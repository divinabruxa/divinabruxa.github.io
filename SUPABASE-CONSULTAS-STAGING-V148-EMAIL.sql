-- DIVINA BRUXA V148 — FILA PRIVADA DE AVISOS DAS CONSULTAS (STAGING)
-- Nenhuma credencial de e-mail ou conteúdo da pergunta é duplicado nesta tabela.

create table if not exists public.consultation_email_notifications (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null unique references public.consultation_requests(id) on delete cascade,
  recipient_email text not null default 'orbedasrealidades@hotmail.com',
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending','sending','accepted','not_configured','failed')),
  provider text not null default 'resend',
  provider_message_id text,
  attempt_count integer not null default 0 check (attempt_count between 0 and 50),
  last_error_code text,
  last_attempt_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check (recipient_email = 'orbedasrealidades@hotmail.com')
);

alter table public.consultation_email_notifications enable row level security;
alter table public.consultation_email_notifications force row level security;

revoke all on table public.consultation_email_notifications from public, anon, authenticated;
grant select, insert, update on table public.consultation_email_notifications to service_role;

drop policy if exists consultation_email_notifications_service_role
  on public.consultation_email_notifications;
create policy consultation_email_notifications_service_role
  on public.consultation_email_notifications
  for all
  to service_role
  using (true)
  with check (true);

create index if not exists consultation_email_notifications_retry_idx
  on public.consultation_email_notifications (delivery_status, updated_at)
  where delivery_status in ('pending','not_configured','failed');

comment on table public.consultation_email_notifications is
  'V148 private delivery ledger for owner consultation email notifications. No question or customer contact is duplicated here.';
comment on column public.consultation_email_notifications.provider_message_id is
  'Transactional provider identifier only; never an API key.';
comment on column public.consultation_email_notifications.last_error_code is
  'Sanitized operational code without customer data or provider response bodies.';
