-- DIVINA BRUXA V188 — CONSULTAS DURÁVEIS, RASTREAMENTO PRIVADO E E-MAIL DUPLO
-- STAGING somente. Não cria cobrança, checkout ou credencial pública.

begin;

alter table public.consultation_requests
  add column if not exists tracking_token_hash text,
  add column if not exists preference_source text,
  add column if not exists preferred_date date,
  add column if not exists preferred_period text,
  add column if not exists status_updated_at timestamptz not null default clock_timestamp();

update public.consultation_requests
set preference_source = case
  when scheduled_start_at is not null then 'calendar_slot'
  else 'manual_preference'
end
where preference_source is null;

alter table public.consultation_requests
  alter column preference_source set default 'manual_preference',
  alter column preference_source set not null,
  drop constraint if exists consultation_requests_tracking_token_hash_check,
  drop constraint if exists consultation_requests_preference_source_check,
  drop constraint if exists consultation_requests_preferred_period_check;

alter table public.consultation_requests
  add constraint consultation_requests_tracking_token_hash_check
    check (tracking_token_hash is null or tracking_token_hash ~ '^[0-9a-f]{64}$'),
  add constraint consultation_requests_preference_source_check
    check (preference_source in ('calendar_slot','manual_preference')),
  add constraint consultation_requests_preferred_period_check
    check (preferred_period is null or preferred_period in ('morning','afternoon','evening','any'));

create unique index if not exists consultation_requests_tracking_token_uidx
  on public.consultation_requests (tracking_token_hash)
  where tracking_token_hash is not null;

create or replace function private.consultation_status_timestamp_v188()
returns trigger
language plpgsql
security invoker
set search_path = 'pg_catalog'
as $$
begin
  if new.status is distinct from old.status then
    new.status_updated_at := clock_timestamp();
  end if;
  return new;
end;
$$;

drop trigger if exists consultation_status_timestamp_v188 on public.consultation_requests;
create trigger consultation_status_timestamp_v188
before update of status on public.consultation_requests
for each row execute function private.consultation_status_timestamp_v188();

revoke all on function private.consultation_status_timestamp_v188() from public,anon,authenticated;

alter table public.consultation_email_notifications
  add column if not exists audience text not null default 'owner',
  add column if not exists template_key text not null default 'owner-new-v188',
  add column if not exists delivered_at timestamptz,
  add column if not exists failed_at timestamptz;

update public.consultation_email_notifications
set audience='owner', template_key='owner-new-v188'
where audience is distinct from 'owner' or template_key is distinct from 'owner-new-v188';

alter table public.consultation_email_notifications
  drop constraint if exists consultation_email_notifications_consultation_id_key,
  drop constraint if exists consultation_email_notifications_recipient_email_check,
  drop constraint if exists consultation_email_notifications_delivery_status_check,
  drop constraint if exists consultation_email_notifications_audience_check,
  drop constraint if exists consultation_email_notifications_recipient_format_check,
  drop constraint if exists consultation_email_notifications_template_key_check,
  drop constraint if exists consultation_email_notifications_consultation_audience_key;

alter table public.consultation_email_notifications
  add constraint consultation_email_notifications_audience_check
    check (audience in ('owner','customer')),
  add constraint consultation_email_notifications_recipient_format_check
    check (char_length(recipient_email) between 3 and 254 and recipient_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  add constraint consultation_email_notifications_template_key_check
    check (char_length(template_key) between 3 and 80),
  add constraint consultation_email_notifications_delivery_status_check
    check (delivery_status in ('pending','sending','accepted','delivered','not_configured','failed','bounced','complained')),
  add constraint consultation_email_notifications_consultation_audience_key
    unique (consultation_id,audience);

drop index if exists public.consultation_email_notifications_retry_idx;
create index consultation_email_notifications_retry_idx
  on public.consultation_email_notifications (delivery_status,updated_at)
  where delivery_status in ('pending','not_configured','failed','bounced');

create index if not exists consultation_email_notifications_provider_id_idx
  on public.consultation_email_notifications (provider_message_id)
  where provider_message_id is not null;

create table if not exists private.consultation_email_webhook_events (
  event_id text primary key check (char_length(event_id) between 1 and 200),
  event_type text not null check (char_length(event_type) between 1 and 80),
  provider_message_id text not null check (char_length(provider_message_id) between 1 and 200),
  occurred_at timestamptz,
  received_at timestamptz not null default clock_timestamp()
);

alter table private.consultation_email_webhook_events enable row level security;
alter table private.consultation_email_webhook_events force row level security;
revoke all on table private.consultation_email_webhook_events from public, anon, authenticated;

alter table private.consultation_request_limits
  drop constraint if exists consultation_request_limits_action_check;
alter table private.consultation_request_limits
  add constraint consultation_request_limits_action_check
  check (action in ('hold','submit','status','email'));

create or replace function public.consultation_rate_limit_server(
  p_fingerprint text,
  p_action text,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  current_attempts integer;
  bucket timestamptz := date_trunc('hour',clock_timestamp());
begin
  if p_fingerprint !~ '^[0-9a-f]{64}$'
     or p_action not in ('hold','submit','status','email')
     or p_limit not between 1 and 100 then
    raise exception 'invalid_rate_limit_input';
  end if;

  delete from private.consultation_request_limits
  where window_start < clock_timestamp()-interval '48 hours';

  insert into private.consultation_request_limits
    (fingerprint,action,window_start,attempts,updated_at)
  values
    (p_fingerprint,p_action,bucket,1,clock_timestamp())
  on conflict (fingerprint,action,window_start) do update
  set attempts=private.consultation_request_limits.attempts+1,
      updated_at=clock_timestamp()
  returning attempts into current_attempts;

  return current_attempts<=p_limit;
end;
$$;

create or replace function public.consultation_submit_server_v188(
  p_hold_token uuid,
  p_submission_id uuid,
  p_user_id uuid,
  p_service_key text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_question_context text,
  p_accept_terms boolean,
  p_accept_privacy boolean,
  p_accept_symbolic boolean,
  p_tracking_token_hash text,
  p_preferred_date date default null,
  p_preferred_period text default null,
  p_marketing_opt_in boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  h private.consultation_slot_holds;
  s public.consultation_services;
  r public.consultation_requests;
  proto text;
  source text;
  start_at timestamptz;
  end_at timestamptz;
  hold_id uuid;
  local_today date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
begin
  select * into r
  from public.consultation_requests
  where submission_id=p_submission_id;

  if r.id is not null then
    if r.tracking_token_hash is distinct from p_tracking_token_hash then
      raise exception 'submission_conflict';
    end if;
    return jsonb_build_object(
      'ok',true,'protocol',r.protocol,'consultationId',r.id,
      'slotStartAt',r.scheduled_start_at,'slotEndAt',r.scheduled_end_at,
      'preferredDate',r.preferred_date,'preferredPeriod',r.preferred_period,
      'preferenceSource',r.preference_source,'priceCents',r.price_brl_cents_snapshot,'status',r.status,
      'paymentStatus',r.payment_status,'idempotent',true
    );
  end if;

  if not (p_accept_terms and p_accept_privacy and p_accept_symbolic) then
    raise exception 'consent_required';
  end if;
  if char_length(trim(coalesce(p_customer_name,''))) not between 2 and 120 then
    raise exception 'invalid_name';
  end if;
  if char_length(trim(coalesce(p_customer_email,''))) > 254
     or coalesce(p_customer_email,'') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;
  if p_customer_phone !~ '^\+[1-9][0-9]{9,14}$' then
    raise exception 'invalid_phone';
  end if;
  if char_length(trim(coalesce(p_question_context,''))) not between 10 and 3000 then
    raise exception 'invalid_context';
  end if;
  if p_tracking_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_tracking_token';
  end if;

  if p_hold_token is not null then
    perform private.expire_consultation_holds();
    select * into h
    from private.consultation_slot_holds
    where hold_token=p_hold_token
    for update;
    if h.id is null or h.status<>'held' or h.expires_at<=clock_timestamp() then
      raise exception 'hold_expired';
    end if;
    if h.user_id is not null and h.user_id is distinct from p_user_id then
      raise exception 'hold_owner_mismatch';
    end if;
    if h.service_key is distinct from p_service_key then
      raise exception 'service_mismatch';
    end if;
    source := 'calendar_slot';
    start_at := h.slot_start_at;
    end_at := h.slot_end_at;
    hold_id := h.id;
  else
    source := 'manual_preference';
    if p_preferred_period is not null
       and p_preferred_period not in ('morning','afternoon','evening','any') then
      raise exception 'invalid_preference';
    end if;
    if p_preferred_date is not null
       and (p_preferred_date < local_today or p_preferred_date > local_today+180) then
      raise exception 'invalid_preference';
    end if;
  end if;

  select * into s
  from public.consultation_services
  where service_key=p_service_key and active=true;
  if s.service_key is null then raise exception 'service_unavailable'; end if;

  proto := 'DB-'||to_char(clock_timestamp() at time zone 'America/Sao_Paulo','YYYYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.consultation_requests(
    protocol,user_id,service_key,customer_name,customer_email,customer_phone,question_context,
    price_brl_cents_snapshot,turnaround_snapshot,delivery_method_snapshot,status,payment_status,
    terms_version_snapshot,accepted_terms_at,accepted_privacy_at,accepted_symbolic_disclosure_at,
    marketing_opt_in,submission_id,payment_environment,payment_provider,request_source,
    scheduled_start_at,scheduled_end_at,slot_timezone,booking_hold_id,
    tracking_token_hash,preference_source,preferred_date,preferred_period,status_updated_at
  ) values (
    proto,p_user_id,p_service_key,trim(p_customer_name),lower(trim(p_customer_email)),p_customer_phone,trim(p_question_context),
    s.price_brl_cents,s.turnaround_label,s.delivery_method,'received','not_started',
    s.terms_version,clock_timestamp(),clock_timestamp(),clock_timestamp(),
    coalesce(p_marketing_opt_in,false),p_submission_id,'staging','pending_sandbox','web_staging',
    start_at,end_at,'America/Sao_Paulo',hold_id,
    p_tracking_token_hash,source,
    case when source='manual_preference' then p_preferred_date else null end,
    case when source='manual_preference' then coalesce(p_preferred_period,'any') else null end,
    clock_timestamp()
  ) returning * into r;

  if hold_id is not null then
    update private.consultation_slot_holds
    set status='submitted',consultation_request_id=r.id,updated_at=clock_timestamp()
    where id=hold_id;
  end if;

  insert into public.consultation_status_history
    (consultation_id,from_status,to_status,reason,actor_user_id)
  values(
    r.id,null,'received',
    case when source='calendar_slot'
      then 'Solicitação criada com horário preferido no STAGING.'
      else 'Solicitação criada com preferência manual no STAGING.' end,
    p_user_id
  );

  return jsonb_build_object(
    'ok',true,'protocol',r.protocol,'consultationId',r.id,
    'slotStartAt',r.scheduled_start_at,'slotEndAt',r.scheduled_end_at,
    'preferredDate',r.preferred_date,'preferredPeriod',r.preferred_period,
    'preferenceSource',r.preference_source,'priceCents',r.price_brl_cents_snapshot,'status',r.status,
    'paymentStatus',r.payment_status,'idempotent',false
  );
exception when unique_violation then
  select * into r
  from public.consultation_requests
  where submission_id=p_submission_id;
  if r.id is not null and r.tracking_token_hash=p_tracking_token_hash then
    return jsonb_build_object(
      'ok',true,'protocol',r.protocol,'consultationId',r.id,
      'slotStartAt',r.scheduled_start_at,'slotEndAt',r.scheduled_end_at,
      'preferredDate',r.preferred_date,'preferredPeriod',r.preferred_period,
      'preferenceSource',r.preference_source,'priceCents',r.price_brl_cents_snapshot,'status',r.status,
      'paymentStatus',r.payment_status,'idempotent',true
    );
  end if;
  if p_hold_token is not null then raise exception 'slot_unavailable'; end if;
  raise exception 'submission_conflict';
end;
$$;

create or replace function public.consultation_email_record_server_v188(
  p_consultation_id uuid,
  p_audience text,
  p_recipient_email text,
  p_delivery_status text,
  p_provider_message_id text default null,
  p_last_error_code text default null,
  p_increment_attempt boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  row_value public.consultation_email_notifications;
begin
  if p_audience not in ('owner','customer')
     or p_delivery_status not in ('pending','sending','accepted','delivered','not_configured','failed','bounced','complained')
     or char_length(trim(coalesce(p_recipient_email,''))) not between 3 and 254
     or coalesce(p_recipient_email,'') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
     or not exists (select 1 from public.consultation_requests where id=p_consultation_id) then
    raise exception 'invalid_email_ledger_input';
  end if;

  insert into public.consultation_email_notifications(
    consultation_id,audience,template_key,recipient_email,delivery_status,provider,
    provider_message_id,attempt_count,last_error_code,last_attempt_at,accepted_at,
    delivered_at,failed_at,created_at,updated_at
  ) values (
    p_consultation_id,p_audience,
    case when p_audience='owner' then 'owner-new-v188' else 'customer-confirmation-v188' end,
    lower(trim(p_recipient_email)),p_delivery_status,'resend',nullif(p_provider_message_id,''),
    case when p_increment_attempt then 1 else 0 end,nullif(p_last_error_code,''),
    case when p_increment_attempt then clock_timestamp() else null end,
    case when p_delivery_status='accepted' then clock_timestamp() else null end,
    case when p_delivery_status='delivered' then clock_timestamp() else null end,
    case when p_delivery_status in ('failed','bounced','complained') then clock_timestamp() else null end,
    clock_timestamp(),clock_timestamp()
  )
  on conflict (consultation_id,audience) do update
  set recipient_email=excluded.recipient_email,
      template_key=excluded.template_key,
      delivery_status=case
        when public.consultation_email_notifications.delivery_status in ('delivered','bounced','complained')
          then public.consultation_email_notifications.delivery_status
        when excluded.delivery_status in ('delivered','bounced','complained') then excluded.delivery_status
        when public.consultation_email_notifications.delivery_status='accepted'
          and excluded.delivery_status in ('pending','sending','not_configured','failed')
          then public.consultation_email_notifications.delivery_status
        else excluded.delivery_status
      end,
      provider_message_id=coalesce(excluded.provider_message_id,public.consultation_email_notifications.provider_message_id),
      attempt_count=least(50,public.consultation_email_notifications.attempt_count+case when p_increment_attempt then 1 else 0 end),
      last_error_code=case
        when excluded.delivery_status in ('accepted','delivered') then null
        else coalesce(excluded.last_error_code,public.consultation_email_notifications.last_error_code)
      end,
      last_attempt_at=case when p_increment_attempt then clock_timestamp() else public.consultation_email_notifications.last_attempt_at end,
      accepted_at=case when excluded.delivery_status='accepted' then coalesce(public.consultation_email_notifications.accepted_at,clock_timestamp()) else public.consultation_email_notifications.accepted_at end,
      delivered_at=case when excluded.delivery_status='delivered' then coalesce(public.consultation_email_notifications.delivered_at,clock_timestamp()) else public.consultation_email_notifications.delivered_at end,
      failed_at=case when excluded.delivery_status in ('failed','bounced','complained') then clock_timestamp() else public.consultation_email_notifications.failed_at end,
      updated_at=clock_timestamp()
  returning * into row_value;

  return jsonb_build_object(
    'audience',row_value.audience,
    'status',row_value.delivery_status,
    'accepted',row_value.delivery_status in ('accepted','delivered'),
    'delivered',row_value.delivery_status='delivered'
  );
end;
$$;

create or replace function public.consultation_email_event_server_v188(
  p_event_id text,
  p_event_type text,
  p_provider_message_id text,
  p_occurred_at timestamptz default null
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog'
as $$
declare
  inserted_count integer;
  next_status text;
begin
  if char_length(coalesce(p_event_id,'')) not between 1 and 200
     or char_length(coalesce(p_event_type,'')) not between 1 and 80
     or p_event_type !~ '^email\.[a-z_]+$'
     or char_length(coalesce(p_provider_message_id,'')) not between 1 and 200 then
    raise exception 'invalid_webhook_event';
  end if;

  insert into private.consultation_email_webhook_events
    (event_id,event_type,provider_message_id,occurred_at)
  values(p_event_id,p_event_type,p_provider_message_id,p_occurred_at)
  on conflict (event_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count=0 then return false; end if;

  next_status := case p_event_type
    when 'email.delivered' then 'delivered'
    when 'email.bounced' then 'bounced'
    when 'email.complained' then 'complained'
    when 'email.failed' then 'failed'
    else null
  end;

  if next_status is not null then
    update public.consultation_email_notifications
    set delivery_status=next_status,
        delivered_at=case when next_status='delivered' then coalesce(delivered_at,clock_timestamp()) else delivered_at end,
        failed_at=case when next_status in ('failed','bounced','complained') then clock_timestamp() else failed_at end,
        last_error_code=case when next_status in ('failed','bounced','complained') then upper(replace(p_event_type,'.','_')) else null end,
        updated_at=clock_timestamp()
    where provider_message_id=p_provider_message_id;
  end if;
  return true;
end;
$$;

revoke all on function public.consultation_submit_server_v188(uuid,uuid,uuid,text,text,text,text,text,boolean,boolean,boolean,text,date,text,boolean) from public,anon,authenticated;
revoke all on function public.consultation_email_record_server_v188(uuid,text,text,text,text,text,boolean) from public,anon,authenticated;
revoke all on function public.consultation_email_event_server_v188(text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.consultation_submit_server_v188(uuid,uuid,uuid,text,text,text,text,text,boolean,boolean,boolean,text,date,text,boolean) to service_role;
grant execute on function public.consultation_email_record_server_v188(uuid,text,text,text,text,text,boolean) to service_role;
grant execute on function public.consultation_email_event_server_v188(text,text,text,timestamptz) to service_role;

comment on column public.consultation_requests.tracking_token_hash is
  'V188 SHA-256 do código privado; o código em texto puro não é armazenado no servidor.';
comment on column public.consultation_requests.preference_source is
  'V188 distingue horário real da agenda de mera preferência manual.';
comment on table private.consultation_email_webhook_events is
  'V188 deduplicação privada de webhooks Resend por svix-id; sem conteúdo de e-mail.';
comment on function public.consultation_submit_server_v188(uuid,uuid,uuid,text,text,text,text,text,boolean,boolean,boolean,text,date,text,boolean) is
  'V188 cria de modo atômico pedido com horário real ou preferência manual, preço preservado e token privado em hash.';

select pg_notify('pgrst','reload schema');

commit;
