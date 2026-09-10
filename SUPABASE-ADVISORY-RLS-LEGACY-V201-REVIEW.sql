-- DIVINA BRUXA — V201 — CORREÇÃO DE ADVISORY PARA REVISÃO HUMANA
-- NÃO EXECUTADA AUTOMATICAMENTE.
-- Achado: private.billing_environment_guard está com RLS desligada.
-- Estado auditado: 0 linhas, sem dependências de funções e sem grants para anon/authenticated.
-- Decisão proposta: RLS + FORCE RLS + negação explícita a clientes, sem ampliar grants.
-- Referência: https://supabase.com/docs/guides/database/postgres/row-level-security

begin;

alter table private.billing_environment_guard enable row level security;
alter table private.billing_environment_guard force row level security;

revoke all on table private.billing_environment_guard
from public, anon, authenticated, service_role;

drop policy if exists billing_environment_guard_deny_clients_v201
on private.billing_environment_guard;

create policy billing_environment_guard_deny_clients_v201
on private.billing_environment_guard
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

comment on table private.billing_environment_guard is
  'Legacy billing guard locked by V201 review: RLS forced, no client or service-role grants.';

commit;
