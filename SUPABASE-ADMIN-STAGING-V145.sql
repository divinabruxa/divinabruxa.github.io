-- DIVINA BRUXA — BACKEND ADMIN STAGING V145
-- Aplicar SOMENTE no projeto divina-bruxa-staging (kyphdsamyygavmkzyezr).
-- Nenhum objeto deste arquivo autoriza produção, cobrança real, DNS ou publicação em lojas.

begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Proprietária' check (char_length(display_name) between 2 and 80),
  active boolean not null default true,
  accepted_security_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  assurance_level text not null check (assurance_level in ('aal1','aal2')),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_user_active_idx
  on public.admin_sessions (user_id, last_seen_at desc)
  where revoked_at is null;

create table if not exists public.admin_recovery_codes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, code_hash)
);

create index if not exists admin_recovery_codes_user_unused_idx
  on public.admin_recovery_codes (user_id)
  where used_at is null;

create table if not exists public.admin_audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 80),
  module_id text not null check (module_id in ('today','finance','users','subscriptions','ai','tarot','school','consultations','store','skins','media','notifications','analytics','seo','security','backups','audit','settings','session')),
  result text not null check (result in ('allowed','denied','failed')),
  request_id uuid not null default gen_random_uuid(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 4096),
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_events_created_idx
  on public.admin_audit_events (created_at desc);
create index if not exists admin_audit_events_module_created_idx
  on public.admin_audit_events (module_id, created_at desc);

create table if not exists public.consultation_price_versions (
  id uuid primary key default gen_random_uuid(),
  price_table_version text not null check (char_length(price_table_version) between 8 and 80),
  service_id text not null check (service_id in ('mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta')),
  service_name text not null check (char_length(service_name) between 2 and 80),
  price_cents integer not null check (price_cents between 100 and 500000),
  currency text not null default 'BRL' check (currency = 'BRL'),
  created_by uuid not null references auth.users(id) on delete restrict,
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (price_table_version, service_id)
);

create index if not exists consultation_prices_current_idx
  on public.consultation_price_versions (service_id, effective_at desc, created_at desc);

create table if not exists public.admin_runtime_flags (
  key text primary key check (key in ('production_publish_authorized','dns_changes_authorized','real_billing_authorized','store_submission_authorized','ORBE_AI_SOL_ENABLED')),
  enabled boolean not null default false check (enabled = false),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.admin_runtime_flags (key, enabled) values
  ('production_publish_authorized', false),
  ('dns_changes_authorized', false),
  ('real_billing_authorized', false),
  ('store_submission_authorized', false),
  ('ORBE_AI_SOL_ENABLED', false)
on conflict (key) do update set enabled = false, updated_at = now();

-- O histórico é append-only: uma nova tabela de preços cria quatro linhas novas.
create or replace function public.prevent_admin_history_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'immutable_admin_history';
end;
$$;

revoke all on function public.prevent_admin_history_mutation() from public, anon, authenticated;

drop trigger if exists consultation_prices_immutable on public.consultation_price_versions;
create trigger consultation_prices_immutable
before update or delete on public.consultation_price_versions
for each row execute function public.prevent_admin_history_mutation();

drop trigger if exists admin_audit_immutable on public.admin_audit_events;
create trigger admin_audit_immutable
before update or delete on public.admin_audit_events
for each row execute function public.prevent_admin_history_mutation();

-- Bloqueia conteúdo privado mesmo se um cliente futuro tentar incluí-lo no metadata.
create or replace function public.reject_private_admin_metadata()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  forbidden text[] := array['body','content','question','prompt','response','password','secret','token','email','phone','contact','message'];
  candidate text;
begin
  foreach candidate in array forbidden loop
    if new.metadata ? candidate then
      raise exception 'private_admin_metadata_key:%', candidate;
    end if;
  end loop;
  return new;
end;
$$;

revoke all on function public.reject_private_admin_metadata() from public, anon, authenticated;

drop trigger if exists admin_audit_privacy_guard on public.admin_audit_events;
create trigger admin_audit_privacy_guard
before insert on public.admin_audit_events
for each row execute function public.reject_private_admin_metadata();

alter table public.admin_owners enable row level security;
alter table public.admin_owners force row level security;
alter table public.admin_sessions enable row level security;
alter table public.admin_sessions force row level security;
alter table public.admin_recovery_codes enable row level security;
alter table public.admin_recovery_codes force row level security;
alter table public.admin_audit_events enable row level security;
alter table public.admin_audit_events force row level security;
alter table public.consultation_price_versions enable row level security;
alter table public.consultation_price_versions force row level security;
alter table public.admin_runtime_flags enable row level security;
alter table public.admin_runtime_flags force row level security;

revoke all on table public.admin_owners from public, anon, authenticated;
revoke all on table public.admin_sessions from public, anon, authenticated;
revoke all on table public.admin_recovery_codes from public, anon, authenticated;
revoke all on table public.admin_audit_events from public, anon, authenticated;
revoke all on table public.consultation_price_versions from public, anon, authenticated;
revoke all on table public.admin_runtime_flags from public, anon, authenticated;
revoke all on sequence public.admin_recovery_codes_id_seq from public, anon, authenticated;
revoke all on sequence public.admin_audit_events_id_seq from public, anon, authenticated;

grant select, insert, update, delete on table public.admin_owners to service_role;
grant select, insert, update, delete on table public.admin_sessions to service_role;
grant select, insert, update, delete on table public.admin_recovery_codes to service_role;
grant select, insert on table public.admin_audit_events to service_role;
grant select, insert on table public.consultation_price_versions to service_role;
grant select, insert, update on table public.admin_runtime_flags to service_role;
grant usage, select on sequence public.admin_recovery_codes_id_seq to service_role;
grant usage, select on sequence public.admin_audit_events_id_seq to service_role;

-- Preços V143/V145. Troque OWNER_UUID antes de executar este bloco após cadastrar a proprietária.
-- insert into public.admin_owners (user_id, display_name, accepted_security_at)
-- values ('OWNER_UUID'::uuid, 'Proprietária', now());
-- insert into public.consultation_price_versions
--   (price_table_version, service_id, service_name, price_cents, created_by)
-- values
--   ('consultas-2026-09-05-v145','mesa-real-profissional','Mesa Real Profissional',25000,'OWNER_UUID'::uuid),
--   ('consultas-2026-09-05-v145','leitura-mentes','Leitura de Mentes',15000,'OWNER_UUID'::uuid),
--   ('consultas-2026-09-05-v145','carta-conselho','Carta de Conselho',10000,'OWNER_UUID'::uuid),
--   ('consultas-2026-09-05-v145','pergunta-direta','Pergunta Direta',5000,'OWNER_UUID'::uuid);

commit;
