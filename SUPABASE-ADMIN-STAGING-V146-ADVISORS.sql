-- DIVINA BRUXA — V146 ADVISOR HARDENING
-- Default deny explícito para clientes e índices das chaves estrangeiras.

begin;

create policy admin_owners_deny_clients
  on public.admin_owners as restrictive for all to anon, authenticated
  using (false) with check (false);
create policy admin_sessions_deny_clients
  on public.admin_sessions as restrictive for all to anon, authenticated
  using (false) with check (false);
create policy admin_recovery_codes_deny_clients
  on public.admin_recovery_codes as restrictive for all to anon, authenticated
  using (false) with check (false);
create policy admin_audit_events_deny_clients
  on public.admin_audit_events as restrictive for all to anon, authenticated
  using (false) with check (false);
create policy consultation_price_versions_deny_clients
  on public.consultation_price_versions as restrictive for all to anon, authenticated
  using (false) with check (false);
create policy admin_runtime_flags_deny_clients
  on public.admin_runtime_flags as restrictive for all to anon, authenticated
  using (false) with check (false);

create index if not exists admin_recovery_codes_user_idx
  on public.admin_recovery_codes (user_id);
create index if not exists admin_audit_events_actor_idx
  on public.admin_audit_events (actor_user_id);
create index if not exists consultation_price_versions_creator_idx
  on public.consultation_price_versions (created_by);
create index if not exists admin_runtime_flags_updater_idx
  on public.admin_runtime_flags (updated_by);

commit;
