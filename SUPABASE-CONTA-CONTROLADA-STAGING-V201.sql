-- DIVINA BRUXA — V201 — CONTA REAL CONTROLADA
-- DESTINO EXCLUSIVO: projeto Supabase STAGING divina-bruxa-staging.
-- Não executar em produção. Não cria cobrança, checkout, usuário ou envio de e-mail.

begin;

create table if not exists private.account_states_v201 (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'suspended', 'deletion_pending')),
  reason_code text null
    check (reason_code is null or reason_code ~ '^[A-Z0-9_]{1,48}$'),
  suspended_at timestamptz null,
  deletion_requested_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'suspended') = (suspended_at is not null)),
  check ((status = 'deletion_pending') = (deletion_requested_at is not null))
);

alter table private.account_states_v201 enable row level security;
alter table private.account_states_v201 force row level security;
revoke all on table private.account_states_v201 from public, anon, authenticated;
grant select, insert, update, delete on table private.account_states_v201 to service_role;

create or replace function private.touch_account_state_v201()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.touch_account_state_v201() from public, anon, authenticated;

drop trigger if exists touch_account_state_v201 on private.account_states_v201;
create trigger touch_account_state_v201
before update on private.account_states_v201
for each row execute function private.touch_account_state_v201();

create or replace function private.seed_account_state_v201()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into private.account_states_v201 (user_id, status)
  values (new.id, 'active')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.seed_account_state_v201() from public, anon, authenticated;

drop trigger if exists account_state_seed_v201 on auth.users;
create trigger account_state_seed_v201
after insert on auth.users
for each row execute function private.seed_account_state_v201();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  v_classic uuid;
  v_age_declared boolean := coalesce(new.raw_user_meta_data ->> 'age_declared_18_plus', 'false') = 'true';
begin
  insert into public.profiles (
    user_id,
    display_name,
    age_declared_18_plus,
    age_declared_at
  ) values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
    v_age_declared,
    case when v_age_declared then now() else null end
  );

  insert into public.user_settings (user_id) values (new.id);
  perform private.seed_notification_preferences(new.id);

  select skin.id into v_classic
    from public.orb_skins as skin
   where skin.slug = 'classic'
     and skin.is_free = true
     and skin.status = 'published'
   limit 1;

  if v_classic is null then
    raise exception using errcode = '23514', message = 'CLASSIC_SKIN_MISSING';
  end if;

  insert into public.orb_skin_preferences (user_id, equipped_skin_id)
  values (new.id, v_classic)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

insert into private.account_states_v201 (user_id, status)
select users.id, 'active'
from auth.users as users
on conflict (user_id) do nothing;

create table if not exists private.account_tombstones_v201 (
  subject_hash text primary key
    check (subject_hash ~ '^[a-f0-9]{64}$'),
  deleted_at timestamptz not null default now(),
  release text not null default 'V201'
    check (release = 'V201')
);

alter table private.account_tombstones_v201 enable row level security;
alter table private.account_tombstones_v201 force row level security;
revoke all on table private.account_tombstones_v201 from public, anon, authenticated;
grant select, insert on table private.account_tombstones_v201 to service_role;

create or replace function private.record_account_tombstone_v201()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into private.account_tombstones_v201 (subject_hash, deleted_at, release)
  values (pg_catalog.encode(extensions.digest(old.id::text, 'sha256'), 'hex'), now(), 'V201')
  on conflict (subject_hash) do update
    set deleted_at = excluded.deleted_at,
        release = 'V201';
  return old;
end;
$$;

revoke all on function private.record_account_tombstone_v201() from public, anon, authenticated;

drop trigger if exists account_tombstone_v201 on auth.users;
create trigger account_tombstone_v201
after delete on auth.users
for each row execute function private.record_account_tombstone_v201();

create or replace function private.is_active_account_session(
  p_user_id uuid,
  p_session_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_user_id is not null
    and p_session_id is not null
    and exists (
      select 1
      from auth.users as account
      join private.account_states_v201 as state on state.user_id = account.id
      where account.id = p_user_id
        and account.email_confirmed_at is not null
        and state.status = 'active'
    )
    and exists (
      select 1
      from auth.sessions as session
      where session.id = p_session_id
        and session.user_id = p_user_id
        and (session.not_after is null or session.not_after > now())
    );
$$;

revoke all on function private.is_active_account_session(uuid, uuid) from public, anon, authenticated;
grant execute on function private.is_active_account_session(uuid, uuid) to service_role;

create or replace function public.account_access_is_active_v201()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_active_account_session(
    (select auth.uid()),
    nullif((select auth.jwt() ->> 'session_id'), '')::uuid
  );
$$;

revoke all on function public.account_access_is_active_v201() from public, anon;
grant execute on function public.account_access_is_active_v201() to authenticated;

create or replace function public.account_control_v201()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_session_id uuid := nullif((select auth.jwt() ->> 'session_id'), '')::uuid;
  v_aal text := coalesce((select auth.jwt() ->> 'aal'), 'aal1');
  v_status text;
  v_owner boolean;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'AUTH_REQUIRED';
  end if;

  select state.status
    into v_status
    from private.account_states_v201 as state
   where state.user_id = v_user_id;

  select exists (
    select 1
      from public.admin_owners as owner_account
     where owner_account.user_id = v_user_id
       and owner_account.active = true
  ) into v_owner;

  return pg_catalog.jsonb_build_object(
    'release', 'V201',
    'status', coalesce(v_status, 'suspended'),
    'sessionActive', private.is_active_account_session(v_user_id, v_session_id),
    'emailVerified', exists (
      select 1 from auth.users as account
       where account.id = v_user_id and account.email_confirmed_at is not null
    ),
    'owner', v_owner,
    'mfaRequired', v_owner,
    'mfaSatisfied', (not v_owner) or v_aal = 'aal2',
    'aal', v_aal
  );
end;
$$;

revoke all on function public.account_control_v201() from public, anon;
grant execute on function public.account_control_v201() to authenticated;

do $$
declare
  table_name text;
  account_tables constant text[] := array[
    'ai_conversations',
    'ai_credit_ledger',
    'ai_messages',
    'ai_usage',
    'ai_wallets',
    'billing_receipts_v191',
    'billing_subscriptions_v191',
    'consent_events',
    'consultation_requests',
    'consultation_status_history',
    'daily_cards',
    'entitlements',
    'journal_entries',
    'notification_preferences',
    'notifications',
    'orb_skin_entitlements',
    'orb_skin_preferences',
    'privacy_requests',
    'profiles',
    'purchases',
    'school_favorites',
    'school_progress',
    'school_sync_state',
    'tarot_readings',
    'user_settings'
  ];
begin
  foreach table_name in array account_tables loop
    if pg_catalog.to_regclass(pg_catalog.format('public.%I', table_name)) is null then
      raise exception 'V201_REQUIRED_TABLE_MISSING: %', table_name;
    end if;
    execute pg_catalog.format('drop policy if exists account_active_v201 on public.%I', table_name);
    execute pg_catalog.format(
      'create policy account_active_v201 on public.%I as restrictive for all to authenticated using ((select public.account_access_is_active_v201())) with check ((select public.account_access_is_active_v201()))',
      table_name
    );
  end loop;
end;
$$;

comment on table private.account_states_v201 is
  'V201 server-authoritative account lifecycle. Never expose reason_code to clients.';
comment on table private.account_tombstones_v201 is
  'V201 non-PII SHA-256 deletion tombstones. Contains no email, journal text or raw user UUID.';
comment on function public.account_control_v201() is
  'Returns only the authenticated caller account state, session state and MFA requirement.';

commit;
