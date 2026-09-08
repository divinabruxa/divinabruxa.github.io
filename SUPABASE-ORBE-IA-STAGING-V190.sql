-- DIVINA BRUXA V190 — ORBE IA VERDADEIRA E GOVERNADA
-- Ambiente autorizado: STAGING kyphdsamyygavmkzyezr.
-- Esta migração instala controles e mantém a IA pausada até a ativação separada.

begin;

alter table public.ai_feature_flags
  add column if not exists per_user_requests_per_minute integer not null default 6,
  add column if not exists per_user_daily_credit_limit integer not null default 100,
  add column if not exists global_daily_request_limit integer not null default 500,
  add column if not exists global_daily_cost_limit_usd numeric(12,6) not null default 2.500000,
  add column if not exists max_input_characters integer not null default 5000,
  add column if not exists max_history_messages integer not null default 12,
  add column if not exists max_context_characters integer not null default 24000,
  add column if not exists luna_max_output_tokens integer not null default 700,
  add column if not exists terra_max_output_tokens integer not null default 1400;

alter table public.ai_feature_flags
  drop constraint if exists ai_feature_flags_governance_check;

alter table public.ai_feature_flags
  add constraint ai_feature_flags_governance_check check (
    per_user_requests_per_minute between 1 and 60
    and per_user_daily_credit_limit between 1 and 1000
    and global_daily_credit_limit between 1 and 100000
    and global_daily_request_limit between 1 and 10000
    and global_daily_cost_limit_usd > 0 and global_daily_cost_limit_usd <= 100
    and max_input_characters between 100 and 10000
    and max_history_messages between 0 and 20
    and max_context_characters between 0 and 40000
    and luna_max_output_tokens between 100 and 2000
    and terra_max_output_tokens between 100 and 3000
    and sol_enabled = false
  );

update public.ai_feature_flags
set orbe_ai_enabled = false,
    sol_enabled = false,
    per_user_requests_per_minute = 6,
    per_user_daily_credit_limit = 100,
    global_daily_credit_limit = 2000,
    global_daily_request_limit = 500,
    global_daily_cost_limit_usd = 2.500000,
    max_input_characters = 5000,
    max_history_messages = 12,
    max_context_characters = 24000,
    luna_max_output_tokens = 700,
    terra_max_output_tokens = 1400,
    updated_at = now()
where id = true;

alter table public.ai_usage
  add column if not exists focus text not null default 'reflection',
  add column if not exists context_source text not null default 'message',
  add column if not exists request_fingerprint text,
  add column if not exists provider_request_id text,
  add column if not exists credits_charged integer not null default 0,
  add column if not exists credit_bucket text,
  add column if not exists reserved_cost_usd numeric(12,6) not null default 0,
  add column if not exists settled_at timestamptz,
  add column if not exists refunded_at timestamptz,
  add column if not exists content_retained boolean not null default false;

alter table public.ai_usage
  drop constraint if exists ai_usage_governance_check;

alter table public.ai_usage
  add constraint ai_usage_governance_check check (
    focus in ('reflection','tarot','symbolic-persona','school')
    and context_source in ('message','journal-single-entry','tarot-single-spread','school-single-lesson')
    and (request_fingerprint is null or request_fingerprint ~ '^[0-9a-f]{64}$')
    and (provider_request_id is null or char_length(provider_request_id) between 1 and 160)
    and credits_charged in (0,1,10)
    and (credit_bucket is null or credit_bucket in ('monthly','extra','demo'))
    and reserved_cost_usd >= 0 and reserved_cost_usd <= 1
    and content_retained = false
  );

create index if not exists ai_usage_status_created_v190_idx
  on public.ai_usage (status, created_at desc);

create table if not exists private.ai_request_gates (
  request_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_fingerprint text not null check (request_fingerprint ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

alter table private.ai_request_gates enable row level security;
revoke all on private.ai_request_gates from public, anon, authenticated;

create index if not exists ai_request_gates_user_created_v190_idx
  on private.ai_request_gates (user_id, created_at desc);
create index if not exists ai_request_gates_created_v190_idx
  on private.ai_request_gates (created_at desc);

comment on table private.ai_request_gates
  is 'Gate V190 sem conteúdo: limita todas as chamadas, inclusive as interrompidas pela moderação.';

-- O histórico de conversa permanece somente no aparelho. As tabelas legadas
-- continuam exportáveis para a própria titular, mas não aceitam novas escritas.
drop policy if exists "manage own conversations" on public.ai_conversations;
drop policy if exists "read own conversations" on public.ai_conversations;
create policy "read own conversations"
  on public.ai_conversations for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "manage own ai messages" on public.ai_messages;
drop policy if exists "read own ai messages" on public.ai_messages;
create policy "read own ai messages"
  on public.ai_messages for select to authenticated
  using ((select auth.uid()) = user_id);

revoke insert, update, delete on public.ai_conversations from authenticated;
revoke insert, update, delete on public.ai_messages from authenticated;
grant select on public.ai_conversations, public.ai_messages to authenticated;

drop policy if exists "read ai availability" on public.ai_feature_flags;
revoke all on public.ai_feature_flags from anon, authenticated;

create or replace function public.ai_account_status_v190(target_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  wallet public.ai_wallets;
  flags public.ai_feature_flags;
  ledger_items jsonb;
  ledger_count bigint;
  today_credits integer;
begin
  if target_user is null then raise exception 'user_required'; end if;

  perform pg_advisory_xact_lock(hashtextextended(target_user::text, 190));
  insert into public.ai_wallets(user_id) values(target_user) on conflict do nothing;
  select * into wallet from public.ai_wallets where user_id = target_user for update;
  select * into flags from public.ai_feature_flags where id = true;

  select count(*) into ledger_count
  from public.ai_credit_ledger where user_id = target_user;

  select coalesce(sum(credits_charged), 0)::integer into today_credits
  from public.ai_usage
  where user_id = target_user
    and status in ('reserved','completed')
    and created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', item.id,
    'requestId', item.request_id,
    'bucket', item.bucket,
    'delta', item.delta,
    'reason', item.reason,
    'createdAt', item.created_at
  ) order by item.created_at desc, item.id desc), '[]'::jsonb)
  into ledger_items
  from (
    select id, request_id, bucket, delta, reason, created_at
    from public.ai_credit_ledger
    where user_id = target_user
    order by created_at desc, id desc
    limit 20
  ) item;

  return jsonb_build_object(
    'release', 'V190',
    'environment', 'staging',
    'enabled', coalesce(flags.orbe_ai_enabled, false),
    'solEnabled', false,
    'wallet', jsonb_build_object(
      'monthly', wallet.monthly_credits,
      'extra', wallet.extra_credits,
      'demo', wallet.demo_credits,
      'total', wallet.monthly_credits + wallet.extra_credits + wallet.demo_credits,
      'cycleEndsAt', wallet.cycle_ends_at,
      'updatedAt', wallet.updated_at
    ),
    'usage', jsonb_build_object(
      'todayCredits', today_credits,
      'todayRemaining', greatest(0, flags.per_user_daily_credit_limit - today_credits)
    ),
    'limits', jsonb_build_object(
      'requestsPerMinute', flags.per_user_requests_per_minute,
      'dailyCredits', flags.per_user_daily_credit_limit,
      'maxInputCharacters', flags.max_input_characters,
      'maxHistoryMessages', flags.max_history_messages,
      'maxContextCharacters', flags.max_context_characters,
      'lunaMaxOutputTokens', flags.luna_max_output_tokens,
      'terraMaxOutputTokens', flags.terra_max_output_tokens
    ),
    'ledgerCount', ledger_count,
    'ledger', ledger_items,
    'serverTime', now()
  );
end;
$function$;

create or replace function public.gate_ai_request_v190(
  target_user uuid,
  request_uuid uuid,
  request_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  flags public.ai_feature_flags;
  existing private.ai_request_gates;
  user_minute integer;
  global_day integer;
begin
  if target_user is null then raise exception 'user_required'; end if;
  if request_uuid is null then raise exception 'request_id_required'; end if;
  if request_hash is null or request_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid_request_fingerprint'; end if;

  perform pg_advisory_xact_lock(hashtextextended('orbe-ai-global-v190', 190));
  perform pg_advisory_xact_lock(hashtextextended(target_user::text, 190));

  select * into existing
  from private.ai_request_gates
  where request_id = request_uuid
  for update;
  if found then
    if existing.user_id <> target_user or existing.request_fingerprint <> request_hash then
      raise exception 'request_id_conflict';
    end if;
    return jsonb_build_object('status','accepted','requestId',request_uuid,'idempotent',true);
  end if;

  select * into flags from public.ai_feature_flags where id = true;
  if not found then raise exception 'ai_flags_unavailable'; end if;
  if flags.orbe_ai_enabled is not true then raise exception 'orbe_ai_disabled'; end if;
  if flags.sol_enabled is true then raise exception 'invalid_sol_configuration'; end if;

  delete from private.ai_request_gates where created_at < now() - interval '30 days';

  select count(*)::integer into user_minute
  from private.ai_request_gates
  where user_id = target_user and created_at >= now() - interval '1 minute';
  if user_minute >= flags.per_user_requests_per_minute then raise exception 'rate_limit_per_minute'; end if;

  select count(*)::integer into global_day
  from private.ai_request_gates
  where created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';
  if global_day >= flags.global_daily_request_limit then raise exception 'global_request_limit'; end if;

  insert into private.ai_request_gates(request_id,user_id,request_fingerprint)
  values(request_uuid,target_user,request_hash);

  return jsonb_build_object('status','accepted','requestId',request_uuid,'idempotent',false);
end;
$function$;

create or replace function public.refund_ai_credits_v190(target_user uuid, request_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  usage_row public.ai_usage;
  reservation public.ai_credit_ledger;
  wallet public.ai_wallets;
begin
  if target_user is null or request_uuid is null then raise exception 'invalid_refund'; end if;
  perform pg_advisory_xact_lock(hashtextextended('orbe-ai-global-v190', 190));
  perform pg_advisory_xact_lock(hashtextextended(target_user::text, 190));

  select * into usage_row
  from public.ai_usage
  where request_id = request_uuid and user_id = target_user
  for update;

  if not found then return jsonb_build_object('status','absent','requestId',request_uuid); end if;
  if usage_row.status = 'refunded' then
    return jsonb_build_object('status','refunded','requestId',request_uuid,'idempotent',true);
  end if;
  if usage_row.status <> 'reserved' then
    return jsonb_build_object('status',usage_row.status,'requestId',request_uuid,'idempotent',true);
  end if;

  select * into reservation
  from public.ai_credit_ledger
  where request_id = request_uuid and user_id = target_user and reason = 'reservation'
  for update;
  if not found then raise exception 'reservation_missing'; end if;

  insert into public.ai_credit_ledger(user_id, request_id, bucket, delta, reason)
  values(target_user, request_uuid, reservation.bucket, -reservation.delta, 'refund')
  on conflict (request_id, reason, bucket) do nothing;

  update public.ai_wallets
  set monthly_credits = monthly_credits + case when reservation.bucket = 'monthly' then -reservation.delta else 0 end,
      extra_credits = extra_credits + case when reservation.bucket = 'extra' then -reservation.delta else 0 end,
      demo_credits = demo_credits + case when reservation.bucket = 'demo' then -reservation.delta else 0 end,
      updated_at = now()
  where user_id = target_user
  returning * into wallet;

  update public.ai_usage
  set status = 'refunded', refunded_at = now()
  where request_id = request_uuid and user_id = target_user and status = 'reserved';

  return jsonb_build_object(
    'status','refunded',
    'requestId',request_uuid,
    'credits',-reservation.delta,
    'balance',wallet.monthly_credits + wallet.extra_credits + wallet.demo_credits,
    'idempotent',false
  );
end;
$function$;

create or replace function public.reserve_ai_credits_v190(
  target_user uuid,
  requested_mode text,
  request_uuid uuid,
  request_hash text,
  requested_focus text default 'reflection',
  requested_source text default 'message',
  confirm_extra boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  cost integer;
  model text;
  reserve_cost numeric(12,6);
  chosen_bucket text;
  wallet public.ai_wallets;
  flags public.ai_feature_flags;
  existing public.ai_usage;
  recent_requests integer;
  user_day_credits integer;
  global_day_credits integer;
  global_day_requests integer;
  global_cost numeric(12,6);
  stale record;
begin
  if target_user is null then raise exception 'user_required'; end if;
  if request_uuid is null then raise exception 'request_id_required'; end if;
  if request_hash is null or request_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid_request_fingerprint'; end if;
  if requested_mode = 'sol' then raise exception 'sol_disabled'; end if;
  if requested_mode not in ('luna','terra') then raise exception 'invalid_mode'; end if;
  if requested_focus not in ('reflection','tarot','symbolic-persona','school') then raise exception 'invalid_focus'; end if;
  if requested_source not in ('message','journal-single-entry','tarot-single-spread','school-single-lesson') then raise exception 'invalid_context_source'; end if;

  cost := case requested_mode when 'luna' then 1 else 10 end;
  model := case requested_mode when 'luna' then 'gpt-5.6-luna' else 'gpt-5.6-terra' end;
  -- Reserva conservadora para o pior caso sob o limite HTTP de 64 KB.
  -- O custo real substitui esta margem na liquidação; chamadas concorrentes
  -- continuam contabilizadas pelo teto global enquanto estão em voo.
  reserve_cost := case requested_mode when 'luna' then 0.020000 else 0.200000 end;

  perform pg_advisory_xact_lock(hashtextextended('orbe-ai-global-v190', 190));
  perform pg_advisory_xact_lock(hashtextextended(target_user::text, 190));

  select * into existing from public.ai_usage where request_id = request_uuid for update;
  if found then
    if existing.user_id <> target_user or existing.mode <> requested_mode or existing.request_fingerprint is distinct from request_hash then
      raise exception 'request_id_conflict';
    end if;
    select * into wallet from public.ai_wallets where user_id = target_user;
    return jsonb_build_object(
      'requestId',request_uuid,
      'status',existing.status,
      'credits',existing.credits_charged,
      'bucket',existing.credit_bucket,
      'modelId',existing.model_id,
      'balance',coalesce(wallet.monthly_credits + wallet.extra_credits + wallet.demo_credits,0),
      'idempotent',true
    );
  end if;

  for stale in
    select request_id from public.ai_usage
    where user_id = target_user and status = 'reserved' and created_at < now() - interval '15 minutes'
    for update
  loop
    perform public.refund_ai_credits_v190(target_user, stale.request_id);
  end loop;

  select * into flags from public.ai_feature_flags where id = true;
  if not found then raise exception 'ai_flags_unavailable'; end if;
  if flags.orbe_ai_enabled is not true then raise exception 'orbe_ai_disabled'; end if;
  if flags.sol_enabled is true then raise exception 'invalid_sol_configuration'; end if;

  select count(*)::integer into recent_requests
  from public.ai_usage
  where user_id = target_user and created_at >= now() - interval '1 minute';
  if recent_requests >= flags.per_user_requests_per_minute then raise exception 'rate_limit_per_minute'; end if;

  select coalesce(sum(credits_charged),0)::integer into user_day_credits
  from public.ai_usage
  where user_id = target_user
    and status in ('reserved','completed')
    and created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';
  if user_day_credits + cost > flags.per_user_daily_credit_limit then raise exception 'daily_credit_limit'; end if;

  select count(*)::integer,
         coalesce(sum(credits_charged) filter (where status in ('reserved','completed')),0)::integer,
         coalesce(sum(case when status = 'completed' then estimated_cost_usd else reserved_cost_usd end)
           filter (where status in ('reserved','completed')),0)::numeric(12,6)
  into global_day_requests, global_day_credits, global_cost
  from public.ai_usage
  where created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';

  if global_day_requests >= flags.global_daily_request_limit then raise exception 'global_request_limit'; end if;
  if global_day_credits + cost > flags.global_daily_credit_limit then raise exception 'global_credit_limit'; end if;
  if global_cost + reserve_cost > flags.global_daily_cost_limit_usd then raise exception 'global_cost_limit'; end if;

  insert into public.ai_wallets(user_id) values(target_user) on conflict do nothing;
  select * into wallet from public.ai_wallets where user_id = target_user for update;

  if wallet.cycle_ends_at is not null and wallet.cycle_ends_at <= now() and wallet.monthly_credits > 0 then
    insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
    values(target_user,gen_random_uuid(),'monthly',-wallet.monthly_credits,'expiration');
    update public.ai_wallets set monthly_credits = 0, updated_at = now() where user_id = target_user returning * into wallet;
  end if;

  if wallet.monthly_credits >= cost then
    update public.ai_wallets set monthly_credits = monthly_credits - cost, updated_at = now()
    where user_id = target_user returning * into wallet;
    chosen_bucket := 'monthly';
  elsif requested_mode = 'luna' and wallet.demo_credits >= cost then
    update public.ai_wallets set demo_credits = demo_credits - cost, updated_at = now()
    where user_id = target_user returning * into wallet;
    chosen_bucket := 'demo';
  elsif wallet.extra_credits >= cost and confirm_extra is true then
    update public.ai_wallets set extra_credits = extra_credits - cost, extra_use_confirmed = true, updated_at = now()
    where user_id = target_user returning * into wallet;
    chosen_bucket := 'extra';
  elsif wallet.extra_credits >= cost then
    raise exception 'extra_confirmation_required';
  else
    raise exception 'insufficient_credits';
  end if;

  insert into public.ai_usage(
    user_id, request_id, model_id, mode, focus, context_source, request_fingerprint,
    credits_charged, credit_bucket, reserved_cost_usd, status, content_retained
  ) values(
    target_user, request_uuid, model, requested_mode, requested_focus, requested_source, request_hash,
    cost, chosen_bucket, reserve_cost, 'reserved', false
  );

  insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
  values(target_user,request_uuid,chosen_bucket,-cost,'reservation');

  return jsonb_build_object(
    'requestId',request_uuid,
    'status','reserved',
    'credits',cost,
    'bucket',chosen_bucket,
    'modelId',model,
    'balance',wallet.monthly_credits + wallet.extra_credits + wallet.demo_credits,
    'idempotent',false
  );
end;
$function$;

create or replace function public.settle_ai_usage_v190(
  target_user uuid,
  request_uuid uuid,
  provider_model text,
  provider_id text,
  input_count integer,
  cached_count integer,
  output_count integer,
  cost_usd numeric,
  elapsed_ms integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  usage_row public.ai_usage;
  wallet public.ai_wallets;
begin
  if target_user is null or request_uuid is null then raise exception 'invalid_settlement'; end if;
  if input_count < 0 or cached_count < 0 or output_count < 0 or cached_count > input_count then raise exception 'invalid_token_usage'; end if;
  if cost_usd < 0 or elapsed_ms < 0 or elapsed_ms > 900000 then raise exception 'invalid_cost_or_latency'; end if;
  if provider_id is null or char_length(provider_id) not between 1 and 160 then raise exception 'invalid_provider_request_id'; end if;

  perform pg_advisory_xact_lock(hashtextextended('orbe-ai-global-v190', 190));
  perform pg_advisory_xact_lock(hashtextextended(target_user::text, 190));

  select * into usage_row from public.ai_usage
  where request_id = request_uuid and user_id = target_user for update;
  if not found then raise exception 'reservation_missing'; end if;
  if usage_row.status = 'completed' then
    return jsonb_build_object('status','completed','requestId',request_uuid,'idempotent',true);
  end if;
  if usage_row.status <> 'reserved' then
    return jsonb_build_object('status',usage_row.status,'requestId',request_uuid,'idempotent',true);
  end if;
  if provider_model <> usage_row.model_id then raise exception 'provider_model_mismatch'; end if;
  if cost_usd > usage_row.reserved_cost_usd then raise exception 'cost_ceiling_exceeded'; end if;

  update public.ai_usage
  set input_tokens = input_count,
      cached_input_tokens = cached_count,
      output_tokens = output_count,
      estimated_cost_usd = round(cost_usd,6),
      latency_ms = elapsed_ms,
      provider_request_id = provider_id,
      status = 'completed',
      settled_at = now()
  where request_id = request_uuid and user_id = target_user;

  select * into wallet from public.ai_wallets where user_id = target_user;
  return jsonb_build_object(
    'status','completed',
    'requestId',request_uuid,
    'credits',usage_row.credits_charged,
    'balance',wallet.monthly_credits + wallet.extra_credits + wallet.demo_credits,
    'idempotent',false
  );
end;
$function$;

revoke all on function public.ai_account_status_v190(uuid) from public, anon, authenticated;
revoke all on function public.gate_ai_request_v190(uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean) from public, anon, authenticated;
revoke all on function public.settle_ai_usage_v190(uuid,uuid,text,text,integer,integer,integer,numeric,integer) from public, anon, authenticated;
revoke all on function public.refund_ai_credits_v190(uuid,uuid) from public, anon, authenticated;
grant execute on function public.ai_account_status_v190(uuid) to service_role;
grant execute on function public.gate_ai_request_v190(uuid,uuid,text) to service_role;
grant execute on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean) to service_role;
grant execute on function public.settle_ai_usage_v190(uuid,uuid,text,text,integer,integer,integer,numeric,integer) to service_role;
grant execute on function public.refund_ai_credits_v190(uuid,uuid) to service_role;

drop function if exists public.reserve_ai_credits(uuid,text,uuid,boolean);
drop function if exists public.settle_ai_usage(uuid,uuid,integer,integer,integer,numeric,integer);
drop function if exists public.refund_ai_credits(uuid,uuid);

comment on table public.ai_credit_ledger is 'Ledger V190: eventos financeiros de créditos, sem prompts ou respostas.';
comment on table public.ai_usage is 'Telemetria V190 sem conteúdo: modo, créditos, tokens, custo estimado, latência e estado.';
comment on function public.gate_ai_request_v190(uuid,uuid,text) is 'Rate limit V190 para toda chamada antes da moderação, sem armazenar conteúdo.';
comment on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean) is 'Reserva atômica V190 com idempotência, limites por usuário e tetos globais.';

commit;
