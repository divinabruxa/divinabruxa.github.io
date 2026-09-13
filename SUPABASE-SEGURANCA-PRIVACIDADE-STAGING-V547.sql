-- DIVINA BRUXA 3.0 — SEGURANÇA, PRIVACIDADE E CONTINUIDADE V547
-- Aplicar SOMENTE no projeto STAGING kyphdsamyygavmkzyezr.
-- Não autoriza produção, DNS, cobrança real, publicação em lojas ou PITR pago.

begin;

create extension if not exists pgcrypto with schema extensions;

-- Limite transacional usado somente por Edge Functions com service_role.
-- O identificador recebido já chega em SHA-256 com pepper do servidor; IP e
-- user-agent brutos nunca entram nesta tabela.
create table if not exists public.admin_request_limits_v547 (
  key_hash text not null check (key_hash ~ '^[0-9a-f]{64}$'),
  bucket text not null check (char_length(bucket) between 2 and 48),
  window_started_at timestamptz not null default now(),
  hits integer not null default 1 check (hits between 1 and 1000000),
  updated_at timestamptz not null default now(),
  primary key (key_hash, bucket)
);

alter table public.admin_request_limits_v547 enable row level security;
alter table public.admin_request_limits_v547 force row level security;
revoke all on table public.admin_request_limits_v547 from public, anon, authenticated;
grant select, insert, update, delete on table public.admin_request_limits_v547 to service_role;

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

  -- Limpeza amortizada; nunca bloqueia uma solicitação se a limpeza falhar.
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

-- Consumo de recovery code em uma única escrita condicional. Impede que duas
-- solicitações concorrentes usem o mesmo código.
create or replace function public.consume_admin_recovery_code_v547(
  p_user_id uuid,
  p_code_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  consumed_id bigint;
begin
  if p_user_id is null or p_code_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  update public.admin_recovery_codes
     set used_at = pg_catalog.now()
   where user_id = p_user_id
     and code_hash = p_code_hash
     and used_at is null
  returning id into consumed_id;

  return consumed_id is not null;
end;
$$;

revoke all on function public.consume_admin_recovery_code_v547(uuid,text) from public, anon, authenticated;
grant execute on function public.consume_admin_recovery_code_v547(uuid,text) to service_role;

-- A lista permitida guarda somente o SHA-256 do e-mail oficial normalizado.
-- O gatilho só ativa owner após o Supabase Auth confirmar o e-mail.
create table if not exists private.admin_owner_allowlist_v547 (
  email_sha256 bytea primary key check (octet_length(email_sha256) = 32),
  label text not null default 'Proprietária' check (char_length(label) between 2 and 80),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table private.admin_owner_allowlist_v547 enable row level security;
alter table private.admin_owner_allowlist_v547 force row level security;
revoke all on table private.admin_owner_allowlist_v547 from public, anon, authenticated;

insert into private.admin_owner_allowlist_v547 (email_sha256, label, active)
values (
  extensions.digest(pg_catalog.convert_to('orbedasrealidades@hotmail.com','UTF8'),'sha256'),
  'Proprietária',
  true
)
on conflict (email_sha256) do update
  set label = excluded.label, active = true, updated_at = pg_catalog.now();

create or replace function private.sync_admin_owner_v547()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_label text;
begin
  if new.email is null or new.email_confirmed_at is null then
    return new;
  end if;

  select allowlist.label into owner_label
    from private.admin_owner_allowlist_v547 as allowlist
   where allowlist.active = true
     and allowlist.email_sha256 = extensions.digest(
       pg_catalog.convert_to(pg_catalog.lower(pg_catalog.btrim(new.email)),'UTF8'),
       'sha256'
     );

  if owner_label is null then
    return new;
  end if;

  -- Nunca substitui silenciosamente outra owner ativa nem bloqueia a criação
  -- da conta comum caso uma owner diferente já tenha sido registrada.
  if exists (
    select 1 from public.admin_owners
     where active = true and user_id <> new.id
  ) then
    return new;
  end if;

  insert into public.admin_owners (user_id, display_name, active, accepted_security_at)
  values (new.id, owner_label, true, null)
  on conflict (user_id) do update
    set display_name = excluded.display_name,
        active = true,
        updated_at = pg_catalog.now();

  return new;
end;
$$;

revoke all on function private.sync_admin_owner_v547() from public, anon, authenticated;

drop trigger if exists divina_sync_admin_owner_v547 on auth.users;
create trigger divina_sync_admin_owner_v547
after insert or update of email, email_confirmed_at on auth.users
for each row execute function private.sync_admin_owner_v547();

-- Backfill seguro caso a conta oficial já exista e esteja verificada.
insert into public.admin_owners (user_id, display_name, active, accepted_security_at)
select account.id, allowlist.label, true, null
  from auth.users as account
  join private.admin_owner_allowlist_v547 as allowlist
    on allowlist.active = true
   and allowlist.email_sha256 = extensions.digest(
     pg_catalog.convert_to(pg_catalog.lower(pg_catalog.btrim(account.email)),'UTF8'),
     'sha256'
   )
 where account.email_confirmed_at is not null
on conflict (user_id) do update
  set display_name = excluded.display_name,
      active = true,
      updated_at = pg_catalog.now();

-- Política de continuidade honesta para o plano Free atual. São metas e
-- requisitos, não evidência de execução automática ou de restore aprovado.
create table if not exists private.continuity_policy_v547 (
  environment text primary key check (environment = 'staging'),
  plan_tier text not null check (plan_tier in ('free','pro','team','enterprise')),
  database_export_cadence_hours integer not null check (database_export_cadence_hours between 1 and 168),
  retention_days integer not null check (retention_days between 7 and 365),
  rpo_target_hours integer not null check (rpo_target_hours between 1 and 168),
  rto_target_hours integer not null check (rto_target_hours between 1 and 168),
  storage_objects_separate boolean not null default true,
  encrypted_offsite_required boolean not null default true,
  scheduler_state text not null check (scheduler_state in ('not_connected','connected')),
  restore_state text not null check (restore_state in ('not_verified','verified','failed')),
  updated_at timestamptz not null default now()
);

alter table private.continuity_policy_v547 enable row level security;
alter table private.continuity_policy_v547 force row level security;
revoke all on table private.continuity_policy_v547 from public, anon, authenticated;

insert into private.continuity_policy_v547
  (environment, plan_tier, database_export_cadence_hours, retention_days,
   rpo_target_hours, rto_target_hours, storage_objects_separate,
   encrypted_offsite_required, scheduler_state, restore_state)
values ('staging','free',24,30,24,8,true,true,'not_connected','not_verified')
on conflict (environment) do update set
  plan_tier = 'free',
  database_export_cadence_hours = 24,
  retention_days = 30,
  rpo_target_hours = 24,
  rto_target_hours = 8,
  storage_objects_separate = true,
  encrypted_offsite_required = true,
  updated_at = pg_catalog.now();

-- Snapshot exclusivamente agregado para o Edge Function owner-only.
create or replace function public.admin_continuity_snapshot_v547()
returns jsonb
language sql
security definer
set search_path = ''
stable
as $$
  select pg_catalog.jsonb_build_object(
    'policyConfigured', policy.environment is not null,
    'planTier', coalesce(policy.plan_tier,'free'),
    'databaseExportCadenceHours', policy.database_export_cadence_hours,
    'retentionDays', policy.retention_days,
    'rpoTargetHours', policy.rpo_target_hours,
    'rtoTargetHours', policy.rto_target_hours,
    'storageObjectsSeparate', coalesce(policy.storage_objects_separate,true),
    'encryptedOffsiteRequired', coalesce(policy.encrypted_offsite_required,true),
    'schedulerConnected', coalesce(policy.scheduler_state = 'connected',false),
    'restoreState', coalesce(policy.restore_state,'not_verified'),
    'reportedRuns', pg_catalog.count(run.id),
    'verifiedRestores', pg_catalog.count(run.id) filter (where run.restore_verified_at is not null),
    'failedRuns', pg_catalog.count(run.id) filter (where run.status = 'failed'),
    'latestCompletedAt', pg_catalog.max(run.completed_at),
    'privateRowsReturned', 0
  )
  from private.continuity_policy_v547 as policy
  left join private.backup_runs as run on run.environment = policy.environment
  where policy.environment = 'staging'
  group by policy.environment, policy.plan_tier, policy.database_export_cadence_hours,
           policy.retention_days, policy.rpo_target_hours, policy.rto_target_hours,
           policy.storage_objects_separate, policy.encrypted_offsite_required,
           policy.scheduler_state, policy.restore_state;
$$;

revoke all on function public.admin_continuity_snapshot_v547() from public, anon, authenticated;
grant execute on function public.admin_continuity_snapshot_v547() to service_role;

-- Mesma autorização; forma otimizada para que auth.uid() seja avaliado uma vez.
do $policy$
declare
  table_name text;
begin
  foreach table_name in array array['whit_context_grants','whit_memories','whit_settings'] loop
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_select_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_insert_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_update_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_delete_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', table_name || '_select_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', table_name || '_insert_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', table_name || '_update_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', table_name || '_delete_own', table_name);
  end loop;
end;
$policy$;

create index if not exists video_episodes_created_by_idx on public.video_episodes (created_by) where created_by is not null;
create index if not exists video_episodes_updated_by_idx on public.video_episodes (updated_by) where updated_by is not null;

comment on table public.admin_request_limits_v547 is 'Rate limits administrativos; somente fingerprints com pepper, nunca IP/UA brutos.';
comment on table private.admin_owner_allowlist_v547 is 'Allowlist owner por SHA-256 de e-mail normalizado; sem senha e sem papel local.';
comment on table private.continuity_policy_v547 is 'Metas de continuidade STAGING; não equivalem a backup ou restore executado.';
comment on function public.admin_continuity_snapshot_v547() is 'Somente agregados de continuidade para Edge Function owner-only.';

commit;
