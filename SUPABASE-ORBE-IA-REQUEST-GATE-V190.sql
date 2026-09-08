-- DIVINA BRUXA V190 — GATE DE TODAS AS REQUISIÇÕES DE IA
-- STAGING: limita também chamadas encerradas pela moderação; nenhum texto é armazenado.

begin;

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

revoke all on function public.gate_ai_request_v190(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.gate_ai_request_v190(uuid,uuid,text) to service_role;

comment on function public.gate_ai_request_v190(uuid,uuid,text)
  is 'Rate limit V190 para toda chamada antes da moderação, sem armazenar conteúdo.';

commit;

