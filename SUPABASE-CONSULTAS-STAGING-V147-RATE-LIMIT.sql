-- DIVINA BRUXA — CONSULTAS STAGING V147 · RATE LIMIT
-- Limite por impressão criptográfica; nenhum IP bruto é armazenado.

begin;

create table if not exists private.consultation_request_limits (
  fingerprint text not null check (fingerprint ~ '^[0-9a-f]{64}$'),
  action text not null check (action in ('hold','submit')),
  window_start timestamptz not null,
  attempts integer not null default 1 check (attempts > 0),
  updated_at timestamptz not null default now(),
  primary key (fingerprint, action, window_start)
);

create index if not exists consultation_request_limits_expiry_idx
  on private.consultation_request_limits (window_start);

alter table private.consultation_request_limits enable row level security;
alter table private.consultation_request_limits force row level security;
revoke all on private.consultation_request_limits from public, anon, authenticated;

create or replace function public.consultation_rate_limit_server(
  p_fingerprint text,
  p_action text,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  current_attempts integer;
  bucket timestamptz := date_trunc('hour',clock_timestamp());
begin
  if p_fingerprint !~ '^[0-9a-f]{64}$'
     or p_action not in ('hold','submit')
     or p_limit not between 1 and 100 then
    raise exception 'invalid_rate_limit_input';
  end if;

  delete from private.consultation_request_limits
  where window_start < clock_timestamp()-interval '48 hours';

  insert into private.consultation_request_limits
    (fingerprint,action,window_start,attempts,updated_at)
  values
    (p_fingerprint,p_action,bucket,1,clock_timestamp())
  on conflict (fingerprint,action,window_start) do update
  set attempts=private.consultation_request_limits.attempts+1,
      updated_at=clock_timestamp()
  returning attempts into current_attempts;

  return current_attempts<=p_limit;
end;
$$;

revoke all on function public.consultation_rate_limit_server(text,text,integer) from public, anon, authenticated;
grant execute on function public.consultation_rate_limit_server(text,text,integer) to service_role;

comment on table private.consultation_request_limits
  is 'V147: hourly anti-abuse counters keyed only by salted SHA-256 fingerprint; rows older than 48 hours are removed on subsequent requests.';

select pg_notify('pgrst','reload schema');

commit;
