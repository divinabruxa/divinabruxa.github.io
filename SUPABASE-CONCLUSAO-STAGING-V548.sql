-- DIVINA BRUXA 3.0 — CONCLUSÃO E OWNER REVIEW V548
-- Aplicar SOMENTE no STAGING kyphdsamyygavmkzyezr.
-- Registra apenas contagens e hash da matriz física; nenhum conteúdo privado.

begin;

create table if not exists private.owner_final_reviews_v548 (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  release text not null default 'V548' check (release = 'V548'),
  environment text not null default 'staging' check (environment = 'staging'),
  evidence_sha256 text not null check (evidence_sha256 ~ '^[0-9a-f]{64}$'),
  profile_count smallint not null check (profile_count between 0 and 9),
  expected_evaluations smallint not null default 471 check (expected_evaluations = 471),
  passed smallint not null check (passed between 0 and 471),
  failed smallint not null check (failed between 0 and 471),
  blocked smallint not null check (blocked between 0 and 471),
  pending smallint not null check (pending between 0 and 471),
  review_status text not null check (review_status in ('action_required','accepted')),
  created_at timestamptz not null default now(),
  check (passed + failed + blocked + pending = expected_evaluations)
);

alter table private.owner_final_reviews_v548 enable row level security;
alter table private.owner_final_reviews_v548 force row level security;
revoke all on table private.owner_final_reviews_v548 from public, anon, authenticated;

create index if not exists owner_final_reviews_v548_owner_created_idx
  on private.owner_final_reviews_v548 (owner_id, created_at desc);

create or replace function public.admin_final_readiness_v548(p_owner_id uuid)
returns jsonb
language sql
security definer
set search_path = ''
stable
as $$
  with latest as (
    select review.*
      from private.owner_final_reviews_v548 as review
     where review.owner_id = p_owner_id
     order by review.created_at desc
     limit 1
  ), continuity as (
    select policy.scheduler_state, policy.restore_state,
           count(run.id)::integer as reported_runs,
           count(run.id) filter (where run.restore_verified_at is not null)::integer as verified_restores
      from private.continuity_policy_v547 as policy
      left join private.backup_runs as run on run.environment = policy.environment
     where policy.environment = 'staging'
     group by policy.scheduler_state, policy.restore_state
  )
  select pg_catalog.jsonb_build_object(
    'release','V548','environment','staging','macroStage','14-of-14',
    'technicalConstructionComplete',true,
    'ownerReviewRecorded',latest.id is not null,
    'ownerReviewStatus',coalesce(latest.review_status,'action_required'),
    'physical',pg_catalog.jsonb_build_object(
      'profiles',coalesce(latest.profile_count,0),'expectedProfiles',9,
      'evaluations',coalesce(latest.expected_evaluations,471),
      'passed',coalesce(latest.passed,0),'failed',coalesce(latest.failed,0),
      'blocked',coalesce(latest.blocked,0),'pending',coalesce(latest.pending,471),
      'evidenceRecorded',latest.id is not null,'recordedAt',latest.created_at
    ),
    'continuity',pg_catalog.jsonb_build_object(
      'schedulerConnected',coalesce(continuity.scheduler_state='connected',false),
      'restoreVerified',coalesce(continuity.restore_state='verified',false),
      'reportedRuns',coalesce(continuity.reported_runs,0),
      'verifiedRestores',coalesce(continuity.verified_restores,0)
    ),
    'readyToAdminister',coalesce(latest.review_status='accepted',false)
      and coalesce(continuity.scheduler_state='connected',false)
      and coalesce(continuity.restore_state='verified',false),
    'privateRowsReturned',0
  )
  from (select 1) as seed
  left join latest on true
  left join continuity on true;
$$;

revoke all on function public.admin_final_readiness_v548(uuid) from public, anon, authenticated;
grant execute on function public.admin_final_readiness_v548(uuid) to service_role;

create or replace function public.record_owner_final_review_v548(
  p_owner_id uuid,
  p_evidence_sha256 text,
  p_profile_count integer,
  p_passed integer,
  p_failed integer,
  p_blocked integer,
  p_pending integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  review_state text;
  row_id bigint;
begin
  if p_owner_id is null or p_evidence_sha256 !~ '^[0-9a-f]{64}$'
     or p_profile_count not between 0 and 9
     or p_passed not between 0 and 471 or p_failed not between 0 and 471
     or p_blocked not between 0 and 471 or p_pending not between 0 and 471
     or p_passed + p_failed + p_blocked + p_pending <> 471 then
    raise exception 'invalid_final_review';
  end if;

  review_state := case
    when p_profile_count = 9 and p_passed = 471 and p_failed = 0
      and p_blocked = 0 and p_pending = 0 then 'accepted'
    else 'action_required'
  end;

  insert into private.owner_final_reviews_v548
    (owner_id,evidence_sha256,profile_count,passed,failed,blocked,pending,review_status)
  values
    (p_owner_id,p_evidence_sha256,p_profile_count,p_passed,p_failed,p_blocked,p_pending,review_state)
  returning id into row_id;

  return pg_catalog.jsonb_build_object('recorded',true,'reviewId',row_id,'reviewStatus',review_state);
end;
$$;

revoke all on function public.record_owner_final_review_v548(uuid,text,integer,integer,integer,integer,integer) from public, anon, authenticated;
grant execute on function public.record_owner_final_review_v548(uuid,text,integer,integer,integer,integer,integer) to service_role;

comment on table private.owner_final_reviews_v548 is 'Atestações owner-only com contagens sanitizadas e hash; nenhum conteúdo da matriz.';
comment on function public.admin_final_readiness_v548(uuid) is 'Snapshot agregado da conclusão, somente para Edge Function owner autenticada.';
comment on function public.record_owner_final_review_v548(uuid,text,integer,integer,integer,integer,integer) is 'Registra resumo sanitizado após step-up MFA no Edge.';

commit;
