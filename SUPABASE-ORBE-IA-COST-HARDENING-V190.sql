-- DIVINA BRUXA V190 — HARDENING DO TETO DE CUSTO DA ORBE IA
-- STAGING: amplia a reserva conservadora por request sem alterar preços em créditos.

begin;

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

revoke all on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean) from public, anon, authenticated;
grant execute on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean) to service_role;

comment on function public.reserve_ai_credits_v190(uuid,text,uuid,text,text,text,boolean)
  is 'Reserva atômica V190 com idempotência, limites e margem conservadora de custo para 64 KB.';

commit;

