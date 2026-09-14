-- DIVINA BRUXA 4.0 — V562 · QA SUPREMO · SOMENTE LEITURA
-- Projeto autorizado para verificação: kyphdsamyygavmkzyezr (STAGING)
-- Não cria, altera ou remove dados. Retorna apenas configuração e contagens.

begin;
set local transaction read only;

select jsonb_build_object(
  'check','environment',
  'projectRef','kyphdsamyygavmkzyezr',
  'database',current_database(),
  'serverVersion',current_setting('server_version'),
  'checkedAt',clock_timestamp(),
  'stagingOnly',true
) as qa_v562;

select jsonb_build_object(
  'check','authority-flags',
  'flags',coalesce(jsonb_object_agg(key,enabled order by key),'{}'::jsonb),
  'allClosed',coalesce(bool_and(enabled=false),false)
) as qa_v562
from public.admin_runtime_flags;

with public_tables as (
  select c.oid,c.relname,c.relrowsecurity,c.relforcerowsecurity
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind in ('r','p')
), writable as (
  select *,
    pg_catalog.has_table_privilege('anon',oid,'INSERT')
      or pg_catalog.has_table_privilege('anon',oid,'UPDATE')
      or pg_catalog.has_table_privilege('anon',oid,'DELETE') as anon_write,
    pg_catalog.has_table_privilege('authenticated',oid,'INSERT') as authenticated_insert,
    pg_catalog.has_table_privilege('authenticated',oid,'UPDATE') as authenticated_update,
    pg_catalog.has_table_privilege('authenticated',oid,'DELETE') as authenticated_delete,
    pg_catalog.has_table_privilege('authenticated',oid,'INSERT')
      or pg_catalog.has_table_privilege('authenticated',oid,'UPDATE')
      or pg_catalog.has_table_privilege('authenticated',oid,'DELETE') as authenticated_write
  from public_tables
)
select jsonb_build_object(
  'check','rls-and-grants',
  'publicTables',count(*),
  'rlsEnabled',count(*) filter(where relrowsecurity),
  'rlsForced',count(*) filter(where relforcerowsecurity),
  'rlsDisabled',coalesce(jsonb_agg(relname order by relname) filter(where not relrowsecurity),'[]'::jsonb),
  'anonWritable',coalesce(jsonb_agg(relname order by relname) filter(where anon_write),'[]'::jsonb),
  'authenticatedWritable',coalesce(jsonb_agg(relname order by relname) filter(where authenticated_write),'[]'::jsonb),
  'authenticatedWritableWithoutApplicablePolicy',coalesce(jsonb_agg(relname order by relname) filter(where
    (authenticated_insert and not exists(select 1 from pg_catalog.pg_policies p where p.schemaname='public' and p.tablename=relname and ('authenticated'=any(p.roles) or 'public'=any(p.roles)) and p.cmd in ('ALL','INSERT')))
    or (authenticated_update and not exists(select 1 from pg_catalog.pg_policies p where p.schemaname='public' and p.tablename=relname and ('authenticated'=any(p.roles) or 'public'=any(p.roles)) and p.cmd in ('ALL','UPDATE')))
    or (authenticated_delete and not exists(select 1 from pg_catalog.pg_policies p where p.schemaname='public' and p.tablename=relname and ('authenticated'=any(p.roles) or 'public'=any(p.roles)) and p.cmd in ('ALL','DELETE')))
  ),'[]'::jsonb)
) as qa_v562
from writable;

with routines as (
  select p.oid,n.nspname,p.proname,p.prosecdef,
         pg_catalog.has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
         pg_catalog.has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
         coalesce(array_to_string(p.proconfig,','),'') as settings
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
)
select jsonb_build_object(
  'check','security-definer-routines',
  'anonExecutable',coalesce(jsonb_agg(format('%I.%I',nspname,proname) order by nspname,proname)
    filter(where prosecdef and anon_execute),'[]'::jsonb),
  'authenticatedExecutable',coalesce(jsonb_agg(format('%I.%I',nspname,proname) order by nspname,proname)
    filter(where prosecdef and authenticated_execute),'[]'::jsonb),
  'withoutExplicitSearchPath',coalesce(jsonb_agg(format('%I.%I',nspname,proname) order by nspname,proname)
    filter(where prosecdef and settings not like '%search_path=%'),'[]'::jsonb)
) as qa_v562
from routines;

with indexes as (
  select schemaname,tablename,lower(indexdef) as definition
  from pg_catalog.pg_indexes
  where schemaname in ('public','private')
), functions as (
  select n.nspname,p.proname,lower(pg_catalog.pg_get_functiondef(p.oid)) as definition
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private')
)
select jsonb_build_object(
  'check','idempotency-and-concurrency-guards',
  'dailyUniqueUserDate',exists(select 1 from indexes where tablename='daily_cards' and definition like '%unique%' and definition ~ 'user_id.*local_date'),
  'dailyOnConflict',exists(select 1 from functions where proname='get_or_create_daily_card' and definition like '%on conflict%'),
  'creditUniqueRequestReasonBucket',exists(select 1 from indexes where tablename='ai_credit_ledger' and definition like '%unique%' and definition ~ 'request_id.*reason.*bucket'),
  'creditRowLock',exists(select 1 from functions where proname in ('reserve_ai_credits_v190','refund_ai_credits_v190') and definition like '%for update%'),
  'creditAdvisoryLock',exists(select 1 from functions where proname in ('reserve_ai_credits_v190','refund_ai_credits_v190') and definition like '%advisory_xact_lock%'),
  'billingWebhookUniqueProviderEvent',exists(select 1 from indexes where tablename='billing_webhook_events' and definition ~ 'provider.*event_id'),
  'skinBillingUniqueProviderEvent',exists(select 1 from indexes where tablename='orb_skin_billing_events' and definition like '%unique%' and definition ~ 'provider.*provider_event_id'),
  'sandboxCommandRowLock',exists(select 1 from functions where proname='process_billing_sandbox_command_v191' and definition like '%for update%'),
  'sandboxCommandOnConflict',exists(select 1 from functions where proname='process_billing_sandbox_command_v191' and definition like '%on conflict%')
) as qa_v562;

select jsonb_build_object(
  'check','v561-backend-installation',
  'analyticsEventsTable',pg_catalog.to_regclass('public.ethical_analytics_events_v561') is not null,
  'analyticsBudgetTable',pg_catalog.to_regclass('public.ethical_analytics_ingest_budget_v561') is not null,
  'analyticsBudgetFunction',pg_catalog.to_regprocedure('public.consume_ethical_analytics_budget_v561(text,integer,integer)') is not null,
  'analyticsSnapshotFunction',pg_catalog.to_regprocedure('public.ethical_analytics_snapshot_v561()') is not null
) as qa_v562;

select jsonb_build_object(
  'check','owner-and-continuity',
  'activeOwners',(select count(*) from public.admin_owners where active),
  'ownerFinalReviews',(select count(*) from private.owner_final_reviews_v548),
  'backupRuns',(select count(*) from private.backup_runs where environment='staging'),
  'verifiedRestores',(select count(*) from private.backup_runs where environment='staging' and restore_verified_at is not null),
  'continuityPolicy',(select jsonb_build_object(
    'schedulerState',scheduler_state,
    'restoreState',restore_state,
    'rpoTargetHours',rpo_target_hours,
    'rtoTargetHours',rto_target_hours,
    'retentionDays',retention_days,
    'encryptedOffsiteRequired',encrypted_offsite_required
  ) from private.continuity_policy_v547 where environment='staging')
) as qa_v562;

select jsonb_build_object(
  'check','billing-sandbox-evidence',
  'webhookEvents',(select count(*) from private.billing_webhook_events),
  'skinBillingEvents',(select count(*) from private.orb_skin_billing_events),
  'receipts',(select count(*) from public.billing_receipts_v191),
  'subscriptions',(select count(*) from public.billing_subscriptions_v191 where environment='staging')
) as qa_v562;

rollback;
