-- Divina Bruxa 3.5.0 · Macroetapa 5A · endurecimento seguro do STAGING
-- Esta migração não habilita cobrança real, Stripe, produção ou impostos.

create index if not exists memoji_videos_created_by_idx
  on public.memoji_videos (created_by);

create index if not exists memoji_videos_updated_by_idx
  on public.memoji_videos (updated_by);

-- Tabelas públicas usadas somente por funções de servidor permanecem
-- inacessíveis aos papéis do navegador, mesmo se privilégios forem ampliados
-- acidentalmente por uma migração futura.
revoke all on table public.account_deletion_receipts from anon, authenticated;
revoke all on table public.admin_request_limits_v547 from anon, authenticated;
revoke all on table public.ai_feature_flags from anon, authenticated;
revoke all on table public.memoji_videos from anon, authenticated;

-- A fronteira de billing é exclusivamente server-side.
revoke all on function public.process_billing_sandbox_command_v191(
  uuid, uuid, text, text, uuid, text
) from public, anon, authenticated;
grant execute on function public.process_billing_sandbox_command_v191(
  uuid, uuid, text, text, uuid, text
) to service_role;

revoke all on function public.process_orb_skin_billing_event_server(
  text, text, text, text, uuid, text, integer, text, text
) from public, anon, authenticated;
grant execute on function public.process_orb_skin_billing_event_server(
  text, text, text, text, uuid, text, integer, text, text
) to service_role;

-- Estas duas funções SECURITY DEFINER são fronteiras autenticadas intencionais:
-- parâmetros vêm do JWT validado e o search_path permanece vazio.
revoke all on function public.account_access_is_active_v201() from public, anon;
grant execute on function public.account_access_is_active_v201() to authenticated, service_role;

revoke all on function public.account_control_v201() from public, anon;
grant execute on function public.account_control_v201() to authenticated, service_role;

comment on function public.account_access_is_active_v201() is
  'Audited SECURITY DEFINER boundary: authenticated JWT identity only; fixed empty search_path.';

comment on function public.account_control_v201() is
  'Audited SECURITY DEFINER boundary: minimal account/MFA status for the authenticated JWT; fixed empty search_path.';
