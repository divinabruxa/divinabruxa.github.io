-- DIVINA BRUXA — V202 — RESEND TRANSACIONAL VERDADEIRO
-- DESTINO EXCLUSIVO: Supabase STAGING divina-bruxa-staging.
-- Não contém segredos, não envia e-mail, não altera DNS e não ativa cobrança.

begin;

alter table public.consultation_email_notifications
  add column if not exists locale text not null default 'pt-BR',
  add column if not exists recipient_hash text,
  add column if not exists delivery_delayed_at timestamptz,
  add column if not exists suppressed_at timestamptz,
  add column if not exists next_retry_at timestamptz;

update public.consultation_email_notifications
   set recipient_hash=pg_catalog.encode(extensions.digest(pg_catalog.lower(pg_catalog.btrim(recipient_email)),'sha256'),'hex')
 where recipient_hash is null;

alter table public.consultation_email_notifications
  drop constraint if exists consultation_email_notifications_delivery_status_check,
  drop constraint if exists consultation_email_notifications_locale_v202_check,
  drop constraint if exists consultation_email_notifications_recipient_hash_v202_check;

alter table public.consultation_email_notifications
  add constraint consultation_email_notifications_delivery_status_check
    check (delivery_status in (
      'pending','sending','scheduled','accepted','delivered','delivery_delayed',
      'not_configured','failed','bounced','complained','suppressed'
    )),
  add constraint consultation_email_notifications_locale_v202_check
    check (locale in ('pt-BR','en','es')),
  add constraint consultation_email_notifications_recipient_hash_v202_check
    check (recipient_hash is null or recipient_hash ~ '^[a-f0-9]{64}$');

drop index if exists public.consultation_email_notifications_retry_idx;
create index consultation_email_notifications_retry_idx
  on public.consultation_email_notifications (next_retry_at,updated_at)
  where delivery_status in ('pending','not_configured','failed','delivery_delayed');

create index if not exists consultation_email_notifications_recipient_hash_v202_idx
  on public.consultation_email_notifications (recipient_hash,updated_at desc)
  where recipient_hash is not null;

create table if not exists private.transactional_email_template_catalog_v202 (
  template_key text not null,
  locale text not null,
  category text not null,
  release text not null default 'V202',
  transactional boolean not null default true,
  marketing boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (template_key,locale),
  check (template_key in (
    'account_confirmation','account_recovery','consultation_owner_new',
    'consultation_customer_confirmation','security_alert','purchase_receipt',
    'refund_confirmation','support_update'
  )),
  check (locale in ('pt-BR','en','es')),
  check (category in ('account','consultation','security','purchase','refund','support')),
  check (release='V202'),
  check (transactional=true and marketing=false)
);

alter table private.transactional_email_template_catalog_v202 enable row level security;
alter table private.transactional_email_template_catalog_v202 force row level security;
revoke all on table private.transactional_email_template_catalog_v202 from public,anon,authenticated;
grant select on table private.transactional_email_template_catalog_v202 to service_role;

insert into private.transactional_email_template_catalog_v202
  (template_key,locale,category,release,transactional,marketing,active)
select template_key,locale,category,'V202',true,false,true
from (values
  ('account_confirmation','account'),
  ('account_recovery','account'),
  ('consultation_owner_new','consultation'),
  ('consultation_customer_confirmation','consultation'),
  ('security_alert','security'),
  ('purchase_receipt','purchase'),
  ('refund_confirmation','refund'),
  ('support_update','support')
) as templates(template_key,category)
cross join (values ('pt-BR'),('en'),('es')) as locales(locale)
on conflict (template_key,locale) do update
set category=excluded.category,release='V202',transactional=true,marketing=false,
    active=true,updated_at=clock_timestamp();

create table if not exists private.transactional_email_suppressions_v202 (
  recipient_hash text primary key check (recipient_hash ~ '^[a-f0-9]{64}$'),
  reason text not null check (reason in ('bounced','complained','suppressed','manual')),
  source_event_id text,
  provider_message_id text,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check (source_event_id is null or char_length(source_event_id) between 1 and 200),
  check (provider_message_id is null or char_length(provider_message_id) between 1 and 200)
);

alter table private.transactional_email_suppressions_v202 enable row level security;
alter table private.transactional_email_suppressions_v202 force row level security;
revoke all on table private.transactional_email_suppressions_v202 from public,anon,authenticated;
grant select,insert,update,delete on table private.transactional_email_suppressions_v202 to service_role;

create table if not exists private.transactional_email_webhook_events_v202 (
  event_id text primary key check (char_length(event_id) between 1 and 200),
  event_type text not null check (event_type in (
    'email.sent','email.scheduled','email.delivered','email.delivery_delayed',
    'email.complained','email.bounced','email.opened','email.clicked',
    'email.failed','email.suppressed'
  )),
  provider_message_id text not null check (char_length(provider_message_id) between 1 and 200),
  recipient_hash text check (recipient_hash is null or recipient_hash ~ '^[a-f0-9]{64}$'),
  payload_sha256 text not null check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  occurred_at timestamptz,
  received_at timestamptz not null default clock_timestamp()
);

alter table private.transactional_email_webhook_events_v202 enable row level security;
alter table private.transactional_email_webhook_events_v202 force row level security;
revoke all on table private.transactional_email_webhook_events_v202 from public,anon,authenticated;
grant select,insert on table private.transactional_email_webhook_events_v202 to service_role;

create index if not exists transactional_email_events_message_v202_idx
  on private.transactional_email_webhook_events_v202 (provider_message_id,received_at desc);

create or replace function public.transactional_email_is_suppressed_v202(p_recipient_email text)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select exists (
    select 1 from private.transactional_email_suppressions_v202 as suppression
     where suppression.recipient_hash=pg_catalog.encode(
       extensions.digest(pg_catalog.lower(pg_catalog.btrim(p_recipient_email)),'sha256'),'hex'
     )
  );
$$;

revoke all on function public.transactional_email_is_suppressed_v202(text) from public,anon,authenticated;
grant execute on function public.transactional_email_is_suppressed_v202(text) to service_role;

create or replace function public.consultation_email_record_server_v202(
  p_consultation_id uuid,
  p_audience text,
  p_recipient_email text,
  p_delivery_status text,
  p_locale text default 'pt-BR',
  p_provider_message_id text default null,
  p_last_error_code text default null,
  p_increment_attempt boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  row_value public.consultation_email_notifications;
  normalized_email text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_recipient_email,'')));
  normalized_status text := p_delivery_status;
  normalized_locale text := case when p_locale in ('pt-BR','en','es') then p_locale else 'pt-BR' end;
  email_hash text;
begin
  if p_audience not in ('owner','customer')
     or p_delivery_status not in (
       'pending','sending','scheduled','accepted','delivered','delivery_delayed',
       'not_configured','failed','bounced','complained','suppressed'
     )
     or char_length(normalized_email) not between 3 and 254
     or normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
     or not exists (select 1 from public.consultation_requests where id=p_consultation_id) then
    raise exception 'invalid_email_ledger_input';
  end if;

  email_hash := pg_catalog.encode(extensions.digest(normalized_email,'sha256'),'hex');
  if normalized_status in ('pending','sending','scheduled')
     and exists (select 1 from private.transactional_email_suppressions_v202 where recipient_hash=email_hash) then
    normalized_status := 'suppressed';
  end if;

  insert into public.consultation_email_notifications(
    consultation_id,audience,template_key,locale,recipient_email,recipient_hash,
    delivery_status,provider,provider_message_id,attempt_count,last_error_code,
    last_attempt_at,accepted_at,delivered_at,delivery_delayed_at,failed_at,
    suppressed_at,next_retry_at,created_at,updated_at
  ) values (
    p_consultation_id,p_audience,
    case when p_audience='owner' then 'consultation_owner_new' else 'consultation_customer_confirmation' end,
    normalized_locale,normalized_email,email_hash,normalized_status,'resend',nullif(p_provider_message_id,''),
    case when p_increment_attempt then 1 else 0 end,nullif(p_last_error_code,''),
    case when p_increment_attempt then clock_timestamp() else null end,
    case when normalized_status='accepted' then clock_timestamp() else null end,
    case when normalized_status='delivered' then clock_timestamp() else null end,
    case when normalized_status='delivery_delayed' then clock_timestamp() else null end,
    case when normalized_status in ('failed','bounced','complained') then clock_timestamp() else null end,
    case when normalized_status='suppressed' then clock_timestamp() else null end,
    case when normalized_status in ('not_configured','failed','delivery_delayed') then clock_timestamp()+interval '15 minutes' else null end,
    clock_timestamp(),clock_timestamp()
  )
  on conflict (consultation_id,audience) do update
  set locale=excluded.locale,
      recipient_email=excluded.recipient_email,
      recipient_hash=excluded.recipient_hash,
      template_key=excluded.template_key,
      delivery_status=case
        when public.consultation_email_notifications.delivery_status in ('delivered','bounced','complained','suppressed')
          then public.consultation_email_notifications.delivery_status
        else excluded.delivery_status
      end,
      provider_message_id=coalesce(excluded.provider_message_id,public.consultation_email_notifications.provider_message_id),
      attempt_count=least(50,public.consultation_email_notifications.attempt_count+case when p_increment_attempt then 1 else 0 end),
      last_error_code=case when excluded.delivery_status in ('accepted','delivered') then null else coalesce(excluded.last_error_code,public.consultation_email_notifications.last_error_code) end,
      last_attempt_at=case when p_increment_attempt then clock_timestamp() else public.consultation_email_notifications.last_attempt_at end,
      accepted_at=case when excluded.delivery_status='accepted' then coalesce(public.consultation_email_notifications.accepted_at,clock_timestamp()) else public.consultation_email_notifications.accepted_at end,
      delivered_at=case when excluded.delivery_status='delivered' then coalesce(public.consultation_email_notifications.delivered_at,clock_timestamp()) else public.consultation_email_notifications.delivered_at end,
      delivery_delayed_at=case when excluded.delivery_status='delivery_delayed' then clock_timestamp() else public.consultation_email_notifications.delivery_delayed_at end,
      failed_at=case when excluded.delivery_status in ('failed','bounced','complained') then clock_timestamp() else public.consultation_email_notifications.failed_at end,
      suppressed_at=case when excluded.delivery_status='suppressed' then clock_timestamp() else public.consultation_email_notifications.suppressed_at end,
      next_retry_at=case
        when excluded.delivery_status in ('accepted','delivered','bounced','complained','suppressed') then null
        when excluded.delivery_status in ('not_configured','failed','delivery_delayed')
          then clock_timestamp()+case
            when public.consultation_email_notifications.attempt_count<2 then interval '15 minutes'
            when public.consultation_email_notifications.attempt_count<5 then interval '1 hour'
            else interval '24 hours'
          end
        else public.consultation_email_notifications.next_retry_at
      end,
      updated_at=clock_timestamp()
  returning * into row_value;

  return pg_catalog.jsonb_build_object(
    'audience',row_value.audience,
    'status',row_value.delivery_status,
    'accepted',row_value.delivery_status in ('accepted','delivered'),
    'delivered',row_value.delivery_status='delivered',
    'suppressed',row_value.delivery_status in ('bounced','complained','suppressed')
  );
end;
$$;

revoke all on function public.consultation_email_record_server_v202(uuid,text,text,text,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.consultation_email_record_server_v202(uuid,text,text,text,text,text,text,boolean) to service_role;

create or replace function public.transactional_email_event_server_v202(
  p_event_id text,
  p_event_type text,
  p_provider_message_id text,
  p_recipient_email text default null,
  p_payload_sha256 text default null,
  p_occurred_at timestamptz default null
)
returns boolean
language plpgsql
security definer
set search_path=''
as $$
declare
  inserted_count integer;
  next_status text;
  email_hash text;
  suppression_reason text;
begin
  if char_length(coalesce(p_event_id,'')) not between 1 and 200
     or p_event_type not in (
       'email.sent','email.scheduled','email.delivered','email.delivery_delayed',
       'email.complained','email.bounced','email.opened','email.clicked',
       'email.failed','email.suppressed'
     )
     or char_length(coalesce(p_provider_message_id,'')) not between 1 and 200
     or coalesce(p_payload_sha256,'') !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_webhook_event';
  end if;

  if p_recipient_email is not null and pg_catalog.btrim(p_recipient_email)<>'' then
    if pg_catalog.btrim(p_recipient_email) !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
      raise exception 'invalid_webhook_recipient';
    end if;
    email_hash := pg_catalog.encode(extensions.digest(pg_catalog.lower(pg_catalog.btrim(p_recipient_email)),'sha256'),'hex');
  else
    select notification.recipient_hash into email_hash
      from public.consultation_email_notifications as notification
     where notification.provider_message_id=p_provider_message_id
     order by notification.updated_at desc limit 1;
  end if;

  insert into private.transactional_email_webhook_events_v202(
    event_id,event_type,provider_message_id,recipient_hash,payload_sha256,occurred_at
  ) values (
    p_event_id,p_event_type,p_provider_message_id,email_hash,p_payload_sha256,p_occurred_at
  ) on conflict (event_id) do nothing;
  get diagnostics inserted_count=row_count;
  if inserted_count=0 then return false; end if;

  next_status := case p_event_type
    when 'email.sent' then 'accepted'
    when 'email.scheduled' then 'scheduled'
    when 'email.delivered' then 'delivered'
    when 'email.delivery_delayed' then 'delivery_delayed'
    when 'email.bounced' then 'bounced'
    when 'email.complained' then 'complained'
    when 'email.failed' then 'failed'
    when 'email.suppressed' then 'suppressed'
    else null
  end;

  if next_status is not null then
    update public.consultation_email_notifications
       set delivery_status=case
             when delivery_status in ('bounced','complained','suppressed') then delivery_status
             else next_status
           end,
           accepted_at=case when next_status='accepted' then coalesce(accepted_at,clock_timestamp()) else accepted_at end,
           delivered_at=case when next_status='delivered' then coalesce(delivered_at,clock_timestamp()) else delivered_at end,
           delivery_delayed_at=case when next_status='delivery_delayed' then clock_timestamp() else delivery_delayed_at end,
           failed_at=case when next_status in ('failed','bounced','complained') then clock_timestamp() else failed_at end,
           suppressed_at=case when next_status='suppressed' then clock_timestamp() else suppressed_at end,
           next_retry_at=case when next_status in ('failed','delivery_delayed') then clock_timestamp()+interval '1 hour' else null end,
           last_error_code=case when next_status in ('failed','bounced','complained','suppressed','delivery_delayed') then upper(replace(p_event_type,'.','_')) else null end,
           updated_at=clock_timestamp()
     where provider_message_id=p_provider_message_id;
  end if;

  suppression_reason := case p_event_type
    when 'email.bounced' then 'bounced'
    when 'email.complained' then 'complained'
    when 'email.suppressed' then 'suppressed'
    else null
  end;
  if suppression_reason is not null and email_hash is not null then
    insert into private.transactional_email_suppressions_v202(
      recipient_hash,reason,source_event_id,provider_message_id
    ) values (email_hash,suppression_reason,p_event_id,p_provider_message_id)
    on conflict (recipient_hash) do update
      set reason=excluded.reason,source_event_id=excluded.source_event_id,
          provider_message_id=excluded.provider_message_id,updated_at=clock_timestamp();
    update public.consultation_email_notifications
       set delivery_status=case when delivery_status='delivered' then delivery_status else suppression_reason end,
           suppressed_at=case when suppression_reason='suppressed' then clock_timestamp() else suppressed_at end,
           failed_at=case when suppression_reason in ('bounced','complained') then clock_timestamp() else failed_at end,
           next_retry_at=null,updated_at=clock_timestamp()
     where recipient_hash=email_hash and delivery_status<>'delivered';
  end if;

  return true;
end;
$$;

revoke all on function public.transactional_email_event_server_v202(text,text,text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.transactional_email_event_server_v202(text,text,text,text,text,timestamptz) to service_role;

comment on table private.transactional_email_template_catalog_v202 is
  'V202: catálogo de 24 templates transacionais versionados em PT-BR, EN e ES; marketing proibido.';
comment on table private.transactional_email_suppressions_v202 is
  'V202: bloqueio por SHA-256 do e-mail após bounce, complaint ou supressão; sem endereço em texto puro.';
comment on table private.transactional_email_webhook_events_v202 is
  'V202: ledger idempotente de eventos Resend; armazena somente metadados e hashes, nunca corpo de e-mail.';

select pg_notify('pgrst','reload schema');

commit;
