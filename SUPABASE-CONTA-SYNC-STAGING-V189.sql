-- DIVINA BRUXA V189 — CONTA, SINCRONIZAÇÃO E SEGURANÇA (STAGING)
-- Ambiente autorizado: kyphdsamyygavmkzyezr / divina-bruxa-staging.
-- Não ativa cobrança, não publica produção e não concede acesso anônimo.

begin;

alter table public.user_settings
  add column if not exists journal_sync_enabled boolean not null default false;

alter table public.journal_entries
  add column if not exists client_entry_id text,
  add column if not exists client_payload jsonb not null default '{}'::jsonb;

update public.journal_entries
set client_entry_id = id::text
where client_entry_id is null;

alter table public.journal_entries
  alter column client_entry_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.journal_entries'::regclass
      and conname = 'journal_entries_client_entry_id_check'
  ) then
    alter table public.journal_entries
      add constraint journal_entries_client_entry_id_check
      check (char_length(client_entry_id) between 1 and 160);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.journal_entries'::regclass
      and conname = 'journal_entries_client_payload_check'
  ) then
    alter table public.journal_entries
      add constraint journal_entries_client_payload_check
      check (jsonb_typeof(client_payload) = 'object' and pg_column_size(client_payload) <= 196608);
  end if;
end
$$;

create unique index if not exists journal_entries_user_client_entry_uidx
  on public.journal_entries(user_id, client_entry_id);

create index if not exists journal_entries_user_active_updated_idx
  on public.journal_entries(user_id, updated_at desc)
  where deleted_at is null;

comment on column public.journal_entries.client_payload is
  'Private per-user V189 fields omitted from operational summaries. Never read by Admin, analytics, or AI.';

create table if not exists public.school_sync_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  client_updated_at timestamptz,
  revision bigint not null default 1,
  environment text not null default 'staging',
  updated_at timestamptz not null default now(),
  constraint school_sync_state_object_check check (jsonb_typeof(state) = 'object'),
  constraint school_sync_state_size_check check (pg_column_size(state) <= 262144),
  constraint school_sync_state_revision_check check (revision >= 1),
  constraint school_sync_state_environment_check check (environment = 'staging')
);

comment on table public.school_sync_state is
  'Private V189 School snapshot. Notes are protected by per-user RLS and excluded from Admin, analytics, and AI.';

alter table public.school_sync_state enable row level security;

drop policy if exists school_sync_state_select_own on public.school_sync_state;
drop policy if exists school_sync_state_insert_own on public.school_sync_state;
drop policy if exists school_sync_state_update_own on public.school_sync_state;

create policy school_sync_state_select_own
  on public.school_sync_state for select to authenticated
  using ((select auth.uid()) = user_id);

create policy school_sync_state_insert_own
  on public.school_sync_state for insert to authenticated
  with check ((select auth.uid()) = user_id and environment = 'staging');

create policy school_sync_state_update_own
  on public.school_sync_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and environment = 'staging');

revoke all on table public.school_sync_state from public, anon, authenticated;
grant select, insert, update on table public.school_sync_state to authenticated;
grant all on table public.school_sync_state to service_role;

create table if not exists private.account_sync_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint account_sync_rate_count_check check (request_count between 0 and 10000)
);

comment on table private.account_sync_rate_limits is
  'Server-only per-account limiter for V189 synchronization. Contains no journal or School content.';

alter table private.account_sync_rate_limits enable row level security;
revoke all on table private.account_sync_rate_limits from public, anon, authenticated;
grant all on table private.account_sync_rate_limits to service_role;

create or replace function public.consume_account_sync_quota_v189(
  p_user_id uuid,
  p_limit integer default 30,
  p_window_seconds integer default 60
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
begin
  if p_user_id is null
     or p_limit not between 1 and 120
     or p_window_seconds not between 30 and 3600 then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user_id::text, 189));

  insert into private.account_sync_rate_limits(user_id, window_started_at, request_count, updated_at)
  values (p_user_id, pg_catalog.clock_timestamp(), 1, pg_catalog.clock_timestamp())
  on conflict (user_id) do update
  set window_started_at = case
        when private.account_sync_rate_limits.window_started_at
             <= pg_catalog.clock_timestamp() - pg_catalog.make_interval(secs => p_window_seconds)
          then pg_catalog.clock_timestamp()
        else private.account_sync_rate_limits.window_started_at
      end,
      request_count = case
        when private.account_sync_rate_limits.window_started_at
             <= pg_catalog.clock_timestamp() - pg_catalog.make_interval(secs => p_window_seconds)
          then 1
        else private.account_sync_rate_limits.request_count + 1
      end,
      updated_at = pg_catalog.clock_timestamp()
  returning request_count into current_count;

  return current_count <= p_limit;
end;
$$;

create or replace function public.record_account_sync_audit_v189(
  p_user_id uuid,
  p_request_id uuid,
  p_action text,
  p_outcome text,
  p_counts jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_counts jsonb;
begin
  if p_user_id is null
     or p_request_id is null
     or p_action not in ('pull', 'sync', 'consent')
     or p_outcome not in ('succeeded', 'denied', 'failed') then
    raise exception 'invalid_account_sync_audit';
  end if;

  safe_counts := pg_catalog.jsonb_build_object(
    'journal', least(greatest(coalesce((p_counts ->> 'journal')::integer, 0), 0), 2000),
    'school', least(greatest(coalesce((p_counts ->> 'school')::integer, 0), 0), 124),
    'favorites', least(greatest(coalesce((p_counts ->> 'favorites')::integer, 0), 0), 124),
    'purchases', least(greatest(coalesce((p_counts ->> 'purchases')::integer, 0), 0), 10000)
  );

  insert into private.audit_log(actor_user_id, action, target_type, request_id, metadata)
  values (p_user_id, 'account_sync_' || p_action, 'account', p_request_id,
          safe_counts || pg_catalog.jsonb_build_object('outcome', p_outcome, 'release', 'V189'));
end;
$$;

revoke all on function public.consume_account_sync_quota_v189(uuid, integer, integer)
  from public, anon, authenticated;
revoke all on function public.record_account_sync_audit_v189(uuid, uuid, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.consume_account_sync_quota_v189(uuid, integer, integer)
  to service_role;
grant execute on function public.record_account_sync_audit_v189(uuid, uuid, text, text, jsonb)
  to service_role;

-- Reaffirm least privilege for every V189 client-owned resource.
revoke all on table public.journal_entries from anon;
revoke all on table public.school_progress from anon;
revoke all on table public.school_favorites from anon;
revoke all on table public.purchases from anon;
revoke all on table public.entitlements from anon;
revoke all on table public.daily_cards from anon;

commit;
