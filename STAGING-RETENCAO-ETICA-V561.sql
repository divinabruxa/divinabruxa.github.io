-- DIVINA BRUXA 4.0 — V561 · RETENÇÃO ÉTICA · STAGING ONLY
-- Projeto autorizado: kyphdsamyygavmkzyezr
-- Este script não publica produção. Execute somente no SQL Editor do STAGING.
-- Nenhuma coluna aceita texto livre, carta, pergunta, prompt ou localização precisa.

begin;

create table if not exists public.ethical_analytics_events_v561 (
  event_id uuid primary key,
  actor_hash text not null check (actor_hash ~ '^[0-9a-f]{64}$'),
  session_hash text not null check (session_hash ~ '^[0-9a-f]{64}$'),
  event_key text not null check (event_key in (
    'session_start','route_view','daily_revealed','school_challenge_started',
    'school_challenge_completed','journal_calendar_opened','journal_favorites_opened',
    'favorite_route_changed','notification_preference_saved','media_catalog_viewed',
    'skin_catalog_viewed'
  )),
  route_key text check (route_key is null or route_key in (
    'home','tarot','daily','library','spreads','school','store','subscriptions',
    'music','videos','skins','notifications','private-area'
  )),
  funnel_stage text not null check (funnel_stage in (
    'arrival','exploration','ritual','learning','return','permission','content'
  )),
  locale_group text not null check (locale_group in ('pt','en','es','other')),
  platform text not null check (platform in ('web','pwa')),
  consent_version text not null check (consent_version = 'privacy-v547-2026-09-13'),
  release text not null check (release = 'V561'),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days'),
  check (occurred_at >= received_at - interval '72 hours'),
  check (occurred_at <= received_at + interval '10 minutes'),
  check (expires_at > received_at),
  check (expires_at <= received_at + interval '91 days')
);

comment on table public.ethical_analytics_events_v561 is
  'V561 consented product events. Stores only server-HMAC pseudonyms and strict enums; no private text or raw identifiers.';
comment on column public.ethical_analytics_events_v561.actor_hash is
  'HMAC-SHA256 created only in the Edge Function from a random 90-day device token; the raw token is never stored.';
comment on column public.ethical_analytics_events_v561.route_key is
  'Whitelisted public route or private-area bucket; never a URL, query string or content value.';

create index if not exists ethical_analytics_v561_occurred_idx
  on public.ethical_analytics_events_v561 (occurred_at desc);
create index if not exists ethical_analytics_v561_actor_occurred_idx
  on public.ethical_analytics_events_v561 (actor_hash, occurred_at desc);
create index if not exists ethical_analytics_v561_event_occurred_idx
  on public.ethical_analytics_events_v561 (event_key, occurred_at desc);
create index if not exists ethical_analytics_v561_funnel_occurred_idx
  on public.ethical_analytics_events_v561 (funnel_stage, occurred_at desc);
create index if not exists ethical_analytics_v561_expiry_idx
  on public.ethical_analytics_events_v561 (expires_at);

alter table public.ethical_analytics_events_v561 enable row level security;
alter table public.ethical_analytics_events_v561 force row level security;
revoke all on table public.ethical_analytics_events_v561 from public, anon, authenticated;
grant select, insert, delete on table public.ethical_analytics_events_v561 to service_role;

create table if not exists public.ethical_analytics_ingest_budget_v561 (
  key_hash text not null check (key_hash ~ '^[0-9a-f]{64}$'),
  bucket_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (key_hash, bucket_start)
);

comment on table public.ethical_analytics_ingest_budget_v561 is
  'Short-lived HMAC rate-limit buckets for the V561 STAGING ingestion endpoint.';

create index if not exists ethical_analytics_v561_budget_expiry_idx
  on public.ethical_analytics_ingest_budget_v561 (bucket_start);

alter table public.ethical_analytics_ingest_budget_v561 enable row level security;
alter table public.ethical_analytics_ingest_budget_v561 force row level security;
revoke all on table public.ethical_analytics_ingest_budget_v561 from public, anon, authenticated;
grant select, insert, update, delete on table public.ethical_analytics_ingest_budget_v561 to service_role;

create or replace function public.consume_ethical_analytics_budget_v561(
  p_key_hash text,
  p_limit integer default 120,
  p_window_seconds integer default 60
)
returns jsonb
language plpgsql
volatile
security invoker
set search_path = pg_catalog, public
as $function$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 120), 600));
  v_window integer := greatest(10, least(coalesce(p_window_seconds, 60), 3600));
  v_bucket timestamptz;
  v_count integer;
  v_retry integer;
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_key_hash is null or p_key_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid key hash' using errcode = '22023';
  end if;

  v_bucket := to_timestamp(floor(extract(epoch from statement_timestamp()) / v_window) * v_window);
  insert into public.ethical_analytics_ingest_budget_v561(key_hash,bucket_start,request_count,updated_at)
  values (p_key_hash,v_bucket,1,statement_timestamp())
  on conflict (key_hash,bucket_start) do update
    set request_count = public.ethical_analytics_ingest_budget_v561.request_count + 1,
        updated_at = statement_timestamp()
  returning request_count into v_count;

  delete from public.ethical_analytics_ingest_budget_v561
   where bucket_start < statement_timestamp() - interval '1 day';

  v_retry := greatest(1,ceil(extract(epoch from (v_bucket + make_interval(secs => v_window) - statement_timestamp())))::integer);
  return jsonb_build_object(
    'allowed', v_count <= v_limit,
    'remaining', greatest(0,v_limit-v_count),
    'retryAfterSeconds', case when v_count <= v_limit then 0 else v_retry end
  );
end;
$function$;

revoke all on function public.consume_ethical_analytics_budget_v561(text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_ethical_analytics_budget_v561(text,integer,integer) to service_role;

create or replace function public.ethical_analytics_snapshot_v561()
returns jsonb
language sql
stable
security invoker
set search_path = pg_catalog, public
as $function$
with
params as (
  select current_timestamp as now_at,
         (current_timestamp at time zone 'America/Sao_Paulo')::date as today
),
events as (
  select e.actor_hash,e.event_key,e.route_key,e.funnel_stage,e.locale_group,e.platform,e.occurred_at,
         (e.occurred_at at time zone 'America/Sao_Paulo')::date as activity_day
    from public.ethical_analytics_events_v561 e, params p
   where e.occurred_at >= p.now_at - interval '90 days'
     and e.expires_at > p.now_at
),
activity_days as (
  select distinct actor_hash,activity_day from events
),
first_seen as (
  select actor_hash,min(activity_day) as cohort_day
    from activity_days
   group by actor_hash
),
milestones(days) as (values (1),(7),(30)),
retention_rows as (
  select m.days,
         count(f.actor_hash)::bigint as eligible,
         count(f.actor_hash) filter (
           where exists (
             select 1 from activity_days d
              where d.actor_hash = f.actor_hash
                and d.activity_day = f.cohort_day + m.days
           )
         )::bigint as retained
    from milestones m
    cross join params p
    left join first_seen f on f.cohort_day <= p.today - m.days
   group by m.days
),
retention_json as (
  select jsonb_object_agg(
    'd' || days,
    jsonb_build_object(
      'eligible',eligible,
      'retained',retained,
      'rate',case when eligible=0 then 0 else round(retained::numeric*100/eligible,1) end
    ) order by days
  ) as value
  from retention_rows
),
activity as (
  select
    count(distinct actor_hash) filter (where activity_day = p.today)::bigint as dau,
    count(distinct actor_hash) filter (where activity_day >= p.today - 6)::bigint as wau,
    count(distinct actor_hash) filter (where activity_day >= p.today - 29)::bigint as mau
  from events cross join params p
),
returning as (
  select count(*)::bigint as returning_7d
  from (
    select actor_hash
      from activity_days cross join params p
     where activity_day >= p.today - 6
     group by actor_hash
    having count(*) >= 2
  ) repeated
),
funnel_json as (
  select coalesce(jsonb_agg(jsonb_build_object('key',key,'count',count) order by count desc,key),'[]'::jsonb) as value
  from (select funnel_stage as key,count(*)::bigint as count from events group by funnel_stage order by count desc,key limit 20) grouped
),
events_json as (
  select coalesce(jsonb_agg(jsonb_build_object('key',key,'count',count) order by count desc,key),'[]'::jsonb) as value
  from (select event_key as key,count(*)::bigint as count from events group by event_key order by count desc,key limit 30) grouped
),
routes_json as (
  select coalesce(jsonb_agg(jsonb_build_object('key',key,'count',count) order by count desc,key),'[]'::jsonb) as value
  from (select coalesce(route_key,'none') as key,count(*)::bigint as count from events group by route_key order by count desc,key limit 20) grouped
),
platforms_json as (
  select coalesce(jsonb_agg(jsonb_build_object('key',key,'count',count) order by count desc,key),'[]'::jsonb) as value
  from (select platform as key,count(*)::bigint as count from events group by platform order by count desc,key limit 10) grouped
),
locales_json as (
  select coalesce(jsonb_agg(jsonb_build_object('key',key,'count',count) order by count desc,key),'[]'::jsonb) as value
  from (select locale_group as key,count(*)::bigint as count from events group by locale_group order by count desc,key limit 10) grouped
),
days as (
  select generate_series(p.today-29,p.today,interval '1 day')::date as day from params p
),
daily_json as (
  select jsonb_agg(jsonb_build_object(
    'day',to_char(d.day,'YYYY-MM-DD'),
    'events',coalesce(x.events,0),
    'actors',coalesce(x.actors,0)
  ) order by d.day) as value
  from days d
  left join (
    select activity_day,count(*)::bigint as events,count(distinct actor_hash)::bigint as actors
      from events
     where activity_day >= (select today-29 from params)
     group by activity_day
  ) x on x.activity_day=d.day
)
select jsonb_build_object(
  'available',true,
  'release','V561',
  'timeZone','America/Sao_Paulo',
  'retentionWindowDays',90,
  'generatedAt',to_jsonb((select now_at from params)),
  'activity',jsonb_build_object(
    'dau',(select dau from activity),
    'wau',(select wau from activity),
    'mau',(select mau from activity),
    'returning7d',(select returning_7d from returning)
  ),
  'retention',(select value from retention_json),
  'funnel',(select value from funnel_json),
  'eventsByKey',(select value from events_json),
  'routes',(select value from routes_json),
  'platforms',(select value from platforms_json),
  'locales',(select value from locales_json),
  'daily',(select value from daily_json),
  'coverage',jsonb_build_object(
    'events',(select count(*) from events),
    'actors',(select count(distinct actor_hash) from events),
    'consentOnly',true,
    'privateTextFields',0,
    'rawIdentifiers',false,
    'preciseLocation',false
  )
);
$function$;

revoke all on function public.ethical_analytics_snapshot_v561() from public, anon, authenticated;
grant execute on function public.ethical_analytics_snapshot_v561() to service_role;

create or replace function public.purge_ethical_analytics_v561()
returns bigint
language plpgsql
volatile
security invoker
set search_path = pg_catalog, public
as $function$
declare
  v_removed bigint;
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service role required' using errcode = '42501';
  end if;
  delete from public.ethical_analytics_events_v561 where expires_at <= statement_timestamp();
  get diagnostics v_removed = row_count;
  return v_removed;
end;
$function$;

revoke all on function public.purge_ethical_analytics_v561() from public, anon, authenticated;
grant execute on function public.purge_ethical_analytics_v561() to service_role;

commit;

-- VERIFICAÇÃO PÓS-APLICAÇÃO (STAGING)
-- select public.ethical_analytics_snapshot_v561();
-- select relname,relrowsecurity,relforcerowsecurity
--   from pg_class where relname in ('ethical_analytics_events_v561','ethical_analytics_ingest_budget_v561');
-- select grantee,privilege_type from information_schema.role_table_grants
--   where table_name in ('ethical_analytics_events_v561','ethical_analytics_ingest_budget_v561')
--   order by table_name,grantee,privilege_type;
