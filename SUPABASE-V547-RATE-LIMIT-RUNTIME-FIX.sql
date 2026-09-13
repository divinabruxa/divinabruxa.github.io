-- DIVINA BRUXA V547 — correção idempotente de execução do rate limit STAGING.
begin;

create or replace function public.consume_admin_request_budget_v547(
  p_key_hash text,
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_hits integer;
  current_window timestamptz;
  retry_after integer;
begin
  if p_key_hash !~ '^[0-9a-f]{64}$'
     or char_length(p_bucket) not between 2 and 48
     or p_limit not between 1 and 500
     or p_window_seconds not between 10 and 86400 then
    raise exception 'invalid_admin_request_budget';
  end if;

  insert into public.admin_request_limits_v547 as limiter
    (key_hash, bucket, window_started_at, hits, updated_at)
  values (p_key_hash, p_bucket, pg_catalog.now(), 1, pg_catalog.now())
  on conflict (key_hash, bucket) do update
    set window_started_at = case
          when limiter.window_started_at <= pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds)
            then pg_catalog.now()
          else limiter.window_started_at
        end,
        hits = case
          when limiter.window_started_at <= pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds)
            then 1
          else limiter.hits + 1
        end,
        updated_at = pg_catalog.now()
  returning hits, window_started_at into current_hits, current_window;

  retry_after := greatest(
    0,
    pg_catalog.ceil(extract(epoch from (
      current_window + pg_catalog.make_interval(secs => p_window_seconds) - pg_catalog.now()
    )))::integer
  );

  if pg_catalog.random() < 0.01 then
    delete from public.admin_request_limits_v547
      where updated_at < pg_catalog.now() - interval '2 days';
  end if;

  return pg_catalog.jsonb_build_object(
    'allowed', current_hits <= p_limit,
    'limit', p_limit,
    'remaining', greatest(0, p_limit - current_hits),
    'retryAfterSeconds', case when current_hits <= p_limit then 0 else retry_after end
  );
end;
$$;

revoke all on function public.consume_admin_request_budget_v547(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_admin_request_budget_v547(text,text,integer,integer) to service_role;

commit;
