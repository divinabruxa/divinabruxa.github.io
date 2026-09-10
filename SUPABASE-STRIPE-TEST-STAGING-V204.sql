-- DIVINA BRUXA V204 — STRIPE TEST REAL, SEM COBRANÇA VERDADEIRA
-- Migração aditiva para STAGING. Não cria objetos na Stripe, não contém segredos,
-- não habilita Checkout, não concede direitos e recusa qualquer evento livemode=true.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists private.stripe_release_gate_v204 (
  environment text primary key check (environment = 'staging'),
  provider_mode text not null default 'test' check (provider_mode = 'test'),
  catalog_version text not null,
  test_catalog_provisioning_authorized boolean not null default false,
  test_checkout_authorized boolean not null default false,
  webhook_processing_enabled boolean not null default false,
  entitlement_dispatch_enabled boolean not null default false check (entitlement_dispatch_enabled = false),
  live_billing_authorized boolean not null default false check (live_billing_authorized = false),
  automatic_tax_enabled boolean not null default false check (automatic_tax_enabled = false),
  updated_at timestamptz not null default now()
);

insert into private.stripe_release_gate_v204 (
  environment, provider_mode, catalog_version,
  test_catalog_provisioning_authorized, test_checkout_authorized,
  webhook_processing_enabled, entitlement_dispatch_enabled,
  live_billing_authorized, automatic_tax_enabled
) values (
  'staging', 'test', 'commercial-2026-09-09-v200',
  false, false, false, false, false, false
) on conflict (environment) do update set
  provider_mode = 'test',
  catalog_version = excluded.catalog_version,
  entitlement_dispatch_enabled = false,
  live_billing_authorized = false,
  automatic_tax_enabled = false,
  updated_at = now();

create table if not exists private.stripe_catalog_v204 (
  product_key text primary key check (product_key ~ '^[a-z0-9_]{3,80}$'),
  catalog_version text not null,
  display_name text not null,
  billing_mode text not null check (billing_mode in ('payment','subscription')),
  amount_brl_cents integer not null check (amount_brl_cents > 0),
  currency text not null default 'brl' check (currency = 'brl'),
  recurring_interval text check (
    (billing_mode = 'payment' and recurring_interval is null) or
    (billing_mode = 'subscription' and recurring_interval in ('month','year'))
  ),
  credits integer check (credits is null or credits > 0),
  benefit_code text,
  fulfillment_code text,
  active boolean not null default true,
  checkout_ready boolean not null default false,
  stripe_product_id text unique check (stripe_product_id is null or stripe_product_id ~ '^prod_[A-Za-z0-9]+$'),
  stripe_price_id text unique check (stripe_price_id is null or stripe_price_id ~ '^price_[A-Za-z0-9]+$'),
  livemode boolean not null default false check (livemode = false),
  updated_at timestamptz not null default now()
);

insert into private.stripe_catalog_v204(
  product_key,catalog_version,display_name,billing_mode,amount_brl_cents,
  recurring_interval,credits,benefit_code,fulfillment_code,active,checkout_ready,livemode
) values
  ('premium_lifetime','commercial-2026-09-09-v200','Divina Bruxa Premium','payment',19990,null,null,'premium_lifetime_all_30_skins',null,true,false,false),
  ('orbe_ai_monthly','commercial-2026-09-09-v200','Orbe IA','subscription',8990,'month',400,'orbe_ai_monthly_400_credits',null,true,false,false),
  ('credits_200','commercial-2026-09-09-v200','Orbe IA · 200 créditos','payment',3990,null,200,'ai_credits_200',null,true,false,false),
  ('credits_600','commercial-2026-09-09-v200','Orbe IA · 600 créditos','payment',9990,null,600,'ai_credits_600',null,true,false,false),
  ('credits_1500','commercial-2026-09-09-v200','Orbe IA · 1.500 créditos','payment',19990,null,1500,'ai_credits_1500',null,true,false,false),
  ('consultation_mesa_real','commercial-2026-09-09-v200','Mesa Real Profissional','payment',25000,null,null,'consultation_mesa_real','manual_booking_confirmed_by_email',true,false,false),
  ('consultation_leitura_mentes','commercial-2026-09-09-v200','Leitura de Mentes','payment',15000,null,null,'consultation_leitura_mentes','manual_booking_confirmed_by_email',true,false,false),
  ('consultation_carta_conselho','commercial-2026-09-09-v200','Carta de Conselho','payment',10000,null,null,'consultation_carta_conselho','manual_booking_confirmed_by_email',true,false,false),
  ('consultation_pergunta_direta','commercial-2026-09-09-v200','Pergunta Direta','payment',5000,null,null,'consultation_pergunta_direta','manual_booking_confirmed_by_email',true,false,false)
on conflict(product_key) do update set
  catalog_version=excluded.catalog_version,
  display_name=excluded.display_name,
  billing_mode=excluded.billing_mode,
  amount_brl_cents=excluded.amount_brl_cents,
  recurring_interval=excluded.recurring_interval,
  credits=excluded.credits,
  benefit_code=excluded.benefit_code,
  fulfillment_code=excluded.fulfillment_code,
  active=excluded.active,
  livemode=false,
  updated_at=now();

create table if not exists private.stripe_customers_v204 (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique check (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),
  livemode boolean not null default false check (livemode = false),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.stripe_checkout_sessions_v204 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  product_key text not null references private.stripe_catalog_v204(product_key) on delete restrict,
  idempotency_key text not null unique check (idempotency_key ~ '^[A-Za-z0-9._:/-]{16,180}$'),
  stripe_checkout_session_id text unique check (stripe_checkout_session_id is null or stripe_checkout_session_id ~ '^cs_test_[A-Za-z0-9]+$'),
  stripe_customer_id text check (stripe_customer_id is null or stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),
  billing_mode text not null check (billing_mode in ('payment','subscription')),
  amount_brl_cents integer not null check (amount_brl_cents > 0),
  currency text not null default 'brl' check (currency = 'brl'),
  status text not null default 'creating' check (status in ('creating','open','complete','expired','failed')),
  livemode boolean not null default false check (livemode = false),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists stripe_checkout_sessions_v204_user_idx
  on private.stripe_checkout_sessions_v204(user_id,created_at desc);

create table if not exists private.stripe_webhook_events_v204 (
  stripe_event_id text primary key check (stripe_event_id ~ '^evt_[A-Za-z0-9]+$'),
  event_type text not null check (length(event_type) between 3 and 120),
  stripe_object_id text check (stripe_object_id is null or length(stripe_object_id) between 3 and 160),
  stripe_created_at timestamptz not null,
  api_version text,
  payload_sha256 text not null check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  livemode boolean not null check (livemode = false),
  processing_status text not null default 'received' check (processing_status in ('received','processing','processed','ignored','failed')),
  delivery_count integer not null default 1 check (delivery_count > 0),
  last_error_code text check (last_error_code is null or last_error_code ~ '^[A-Z0-9_]{2,80}$'),
  first_received_at timestamptz not null default now(),
  last_received_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists stripe_webhook_events_v204_status_idx
  on private.stripe_webhook_events_v204(processing_status,stripe_created_at);

create table if not exists private.stripe_object_state_v204 (
  stripe_object_id text primary key,
  object_type text not null check (object_type in ('checkout_session','payment_intent','subscription','invoice','charge','dispute')),
  user_id uuid references auth.users(id) on delete set null,
  product_key text references private.stripe_catalog_v204(product_key) on delete restrict,
  state text not null check (state in ('pending','active','paid','failed','cancelled','refunded','disputed','resolved','unknown')),
  amount_brl_cents integer check (amount_brl_cents is null or amount_brl_cents >= 0),
  currency text check (currency is null or currency = 'brl'),
  parent_object_id text,
  latest_event_created_at timestamptz not null,
  latest_event_id text not null references private.stripe_webhook_events_v204(stripe_event_id) on delete restrict,
  livemode boolean not null default false check (livemode = false),
  updated_at timestamptz not null default now()
);
create index if not exists stripe_object_state_v204_user_idx
  on private.stripe_object_state_v204(user_id,updated_at desc);

create table if not exists private.stripe_reconciliation_v204 (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null,
  observed_at timestamptz not null default now(),
  stripe_total_brl_cents bigint not null default 0,
  local_total_brl_cents bigint not null default 0,
  difference_brl_cents bigint generated always as (stripe_total_brl_cents-local_total_brl_cents) stored,
  open_event_count integer not null default 0 check (open_event_count >= 0),
  duplicate_effect_count integer not null default 0 check (duplicate_effect_count >= 0),
  entitlement_dispatch_count integer not null default 0 check (entitlement_dispatch_count = 0),
  livemode boolean not null default false check (livemode = false),
  evidence jsonb not null default '{}'::jsonb
);
create index if not exists stripe_reconciliation_v204_scope_idx
  on private.stripe_reconciliation_v204(scope_key,observed_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'stripe_release_gate_v204','stripe_catalog_v204','stripe_customers_v204',
    'stripe_checkout_sessions_v204','stripe_webhook_events_v204',
    'stripe_object_state_v204','stripe_reconciliation_v204'
  ] loop
    execute format('alter table private.%I enable row level security',table_name);
    execute format('alter table private.%I force row level security',table_name);
    execute format('revoke all on table private.%I from public,anon,authenticated',table_name);
    execute format('grant select,insert,update on table private.%I to service_role',table_name);
  end loop;
end $$;

create or replace function public.stripe_gate_v204()
returns jsonb language sql stable security definer set search_path=''
as $$
  select pg_catalog.jsonb_build_object(
    'environment',g.environment,
    'providerMode',g.provider_mode,
    'catalogVersion',g.catalog_version,
    'provisioningAuthorized',g.test_catalog_provisioning_authorized,
    'checkoutAuthorized',g.test_checkout_authorized,
    'webhookProcessingEnabled',g.webhook_processing_enabled,
    'entitlementDispatchEnabled',false,
    'liveBillingAuthorized',false,
    'automaticTaxEnabled',false
  ) from private.stripe_release_gate_v204 g where g.environment='staging';
$$;

create or replace function public.stripe_catalog_lookup_v204(p_product_key text)
returns jsonb language sql stable security definer set search_path=''
as $$
  select pg_catalog.jsonb_build_object(
    'productKey',c.product_key,'name',c.display_name,'billingMode',c.billing_mode,
    'amountBrlCents',c.amount_brl_cents,'currency',c.currency,
    'recurringInterval',c.recurring_interval,'credits',c.credits,
    'benefitCode',c.benefit_code,'fulfillmentCode',c.fulfillment_code,
    'active',c.active,'checkoutReady',c.checkout_ready,
    'stripeProductId',c.stripe_product_id,'stripePriceId',c.stripe_price_id,
    'livemode',false
  ) from private.stripe_catalog_v204 c where c.product_key=p_product_key;
$$;

create or replace function public.stripe_catalog_register_v204(
  p_product_key text,p_stripe_product_id text,p_stripe_price_id text
) returns boolean language plpgsql security definer set search_path=''
as $$
begin
  if p_stripe_product_id !~ '^prod_[A-Za-z0-9]+$' or p_stripe_price_id !~ '^price_[A-Za-z0-9]+$' then
    raise exception using errcode='22023',message='V204_INVALID_TEST_CATALOG_ID';
  end if;
  update private.stripe_catalog_v204
     set stripe_product_id=p_stripe_product_id,stripe_price_id=p_stripe_price_id,
         checkout_ready=true,livemode=false,updated_at=now()
   where product_key=p_product_key and active=true;
  return found;
end;
$$;

create or replace function public.stripe_catalog_pending_v204()
returns jsonb language sql stable security definer set search_path=''
as $$
  select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
    'productKey',c.product_key,'name',c.display_name,'billingMode',c.billing_mode,
    'amountBrlCents',c.amount_brl_cents,'currency',c.currency,
    'recurringInterval',c.recurring_interval,'credits',c.credits,
    'benefitCode',c.benefit_code,'fulfillmentCode',c.fulfillment_code
  ) order by c.product_key),'[]'::jsonb)
  from private.stripe_catalog_v204 c
  where c.active=true and c.checkout_ready=false and c.livemode=false;
$$;

create or replace function public.stripe_customer_lookup_v204(p_user_id uuid)
returns text language sql stable security definer set search_path=''
as $$ select c.stripe_customer_id from private.stripe_customers_v204 c where c.user_id=p_user_id and c.livemode=false $$;

create or replace function public.stripe_customer_upsert_v204(p_user_id uuid,p_stripe_customer_id text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_customer text;
begin
  if p_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$' then
    raise exception using errcode='22023',message='V204_INVALID_TEST_CUSTOMER_ID';
  end if;
  insert into private.stripe_customers_v204(user_id,stripe_customer_id,livemode)
  values(p_user_id,p_stripe_customer_id,false)
  on conflict(user_id) do update set stripe_customer_id=excluded.stripe_customer_id,livemode=false,updated_at=now()
  returning stripe_customer_id into v_customer;
  return v_customer;
end;
$$;

create or replace function public.stripe_checkout_record_v204(
  p_user_id uuid,p_product_key text,p_idempotency_key text,
  p_stripe_checkout_session_id text,p_stripe_customer_id text,p_status text,p_expires_at timestamptz
) returns uuid language plpgsql security definer set search_path=''
as $$
declare v_id uuid;
begin
  if p_idempotency_key !~ '^[A-Za-z0-9._:/-]{16,180}$'
    or p_stripe_checkout_session_id !~ '^cs_test_[A-Za-z0-9]+$'
    or p_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$'
    or p_status not in ('open','complete','expired','failed') then
    raise exception using errcode='22023',message='V204_INVALID_TEST_CHECKOUT';
  end if;
  insert into private.stripe_checkout_sessions_v204(
    user_id,product_key,idempotency_key,stripe_checkout_session_id,stripe_customer_id,
    billing_mode,amount_brl_cents,currency,status,livemode,expires_at
  ) select p_user_id,c.product_key,p_idempotency_key,p_stripe_checkout_session_id,p_stripe_customer_id,
           c.billing_mode,c.amount_brl_cents,c.currency,p_status,false,p_expires_at
      from private.stripe_catalog_v204 c
     where c.product_key=p_product_key and c.active=true and c.checkout_ready=true and c.livemode=false
  on conflict(idempotency_key) do update set
    stripe_checkout_session_id=excluded.stripe_checkout_session_id,
    stripe_customer_id=excluded.stripe_customer_id,status=excluded.status,
    expires_at=excluded.expires_at,updated_at=now()
  returning id into v_id;
  if v_id is null then raise exception using errcode='P0001',message='V204_CATALOG_NOT_READY'; end if;
  return v_id;
end;
$$;

create or replace function public.stripe_webhook_ingest_v204(
  p_event_id text,p_event_type text,p_object_id text,p_created_at timestamptz,
  p_api_version text,p_payload_sha256 text,p_livemode boolean
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_inserted integer;
begin
  if p_livemode or p_event_id !~ '^evt_[A-Za-z0-9]+$'
    or p_payload_sha256 !~ '^[a-f0-9]{64}$' then
    raise exception using errcode='22023',message='V204_TEST_EVENT_REQUIRED';
  end if;
  insert into private.stripe_webhook_events_v204(
    stripe_event_id,event_type,stripe_object_id,stripe_created_at,api_version,payload_sha256,livemode
  ) values(p_event_id,p_event_type,p_object_id,p_created_at,p_api_version,p_payload_sha256,false)
  on conflict(stripe_event_id) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted=0 then
    update private.stripe_webhook_events_v204 set delivery_count=delivery_count+1,last_received_at=now()
     where stripe_event_id=p_event_id;
  end if;
  return pg_catalog.jsonb_build_object('persisted',true,'firstDelivery',v_inserted=1,'eventId',p_event_id);
end;
$$;

create or replace function public.stripe_webhook_apply_v204(
  p_event_id text,p_object_id text,p_object_type text,p_state text,
  p_user_id uuid,p_product_key text,p_amount_brl_cents integer,p_currency text,p_parent_object_id text
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_created timestamptz; v_current private.stripe_object_state_v204%rowtype; v_is_newer boolean;
begin
  select stripe_created_at into v_created from private.stripe_webhook_events_v204
   where stripe_event_id=p_event_id and livemode=false for update;
  if v_created is null then raise exception using errcode='P0001',message='V204_EVENT_NOT_PERSISTED'; end if;
  if p_object_type not in ('checkout_session','payment_intent','subscription','invoice','charge','dispute')
    or p_state not in ('pending','active','paid','failed','cancelled','refunded','disputed','resolved','unknown')
    or (p_currency is not null and p_currency <> 'brl') then
    raise exception using errcode='22023',message='V204_INVALID_NORMALIZED_EVENT';
  end if;
  update private.stripe_webhook_events_v204 set processing_status='processing',last_error_code=null
   where stripe_event_id=p_event_id;
  select * into v_current from private.stripe_object_state_v204 where stripe_object_id=p_object_id for update;
  v_is_newer := v_current.stripe_object_id is null
    or v_created > v_current.latest_event_created_at
    or (v_created = v_current.latest_event_created_at and p_event_id > v_current.latest_event_id);
  if not v_is_newer then
    update private.stripe_webhook_events_v204 set processing_status='ignored',processed_at=now()
     where stripe_event_id=p_event_id;
    return pg_catalog.jsonb_build_object('applied',false,'reason','out_of_order','entitlementDispatched',false);
  end if;
  insert into private.stripe_object_state_v204(
    stripe_object_id,object_type,user_id,product_key,state,amount_brl_cents,currency,
    parent_object_id,latest_event_created_at,latest_event_id,livemode
  ) values(
    p_object_id,p_object_type,p_user_id,p_product_key,p_state,p_amount_brl_cents,p_currency,
    p_parent_object_id,v_created,p_event_id,false
  ) on conflict(stripe_object_id) do update set
    object_type=excluded.object_type,user_id=coalesce(excluded.user_id,private.stripe_object_state_v204.user_id),
    product_key=coalesce(excluded.product_key,private.stripe_object_state_v204.product_key),
    state=excluded.state,amount_brl_cents=coalesce(excluded.amount_brl_cents,private.stripe_object_state_v204.amount_brl_cents),
    currency=coalesce(excluded.currency,private.stripe_object_state_v204.currency),
    parent_object_id=coalesce(excluded.parent_object_id,private.stripe_object_state_v204.parent_object_id),
    latest_event_created_at=excluded.latest_event_created_at,latest_event_id=excluded.latest_event_id,
    livemode=false,updated_at=now();
  update private.stripe_webhook_events_v204 set processing_status='processed',processed_at=now()
   where stripe_event_id=p_event_id;
  return pg_catalog.jsonb_build_object('applied',true,'state',p_state,'entitlementDispatched',false);
end;
$$;

create or replace function public.stripe_webhook_finish_v204(
  p_event_id text,p_status text,p_error_code text default null
) returns boolean language plpgsql security definer set search_path=''
as $$
begin
  if p_status not in ('ignored','failed')
    or (p_error_code is not null and p_error_code !~ '^[A-Z0-9_]{2,80}$') then
    raise exception using errcode='22023',message='V204_INVALID_WEBHOOK_FINISH';
  end if;
  update private.stripe_webhook_events_v204
     set processing_status=p_status,last_error_code=p_error_code,processed_at=now()
   where stripe_event_id=p_event_id and livemode=false;
  return found;
end;
$$;

create or replace function public.stripe_reconciliation_snapshot_v204(p_scope_key text,p_stripe_total bigint)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_open integer; v_local bigint; v_id uuid; v_difference bigint;
begin
  if p_scope_key !~ '^[a-z0-9_.:-]{3,100}$' or p_stripe_total < 0 then
    raise exception using errcode='22023',message='V204_INVALID_RECONCILIATION';
  end if;
  select count(*)::integer into v_open from private.stripe_webhook_events_v204
   where processing_status in ('received','processing','failed');
  select coalesce(sum(case
    when s.object_type='payment_intent' and c.billing_mode='payment' and s.state='paid' then s.amount_brl_cents
    when s.object_type='invoice' and c.billing_mode='subscription' and s.state='paid' then s.amount_brl_cents
    when s.object_type='charge' and s.state='refunded' then -coalesce(s.amount_brl_cents,0)
    else 0 end),0)::bigint into v_local
  from private.stripe_object_state_v204 s
  left join private.stripe_catalog_v204 c on c.product_key=s.product_key
  where s.livemode=false;
  insert into private.stripe_reconciliation_v204(
    scope_key,stripe_total_brl_cents,local_total_brl_cents,open_event_count,
    duplicate_effect_count,entitlement_dispatch_count,livemode,evidence
  ) values(p_scope_key,p_stripe_total,v_local,v_open,0,0,false,
    pg_catalog.jsonb_build_object('release','V204','fullPayloadStored',false,'entitlementsEnabled',false))
  returning id,difference_brl_cents into v_id,v_difference;
  return pg_catalog.jsonb_build_object('id',v_id,'differenceBrlCents',v_difference,'openEvents',v_open,'zero',v_difference=0 and v_open=0);
end;
$$;

do $$
declare fn text;
begin
  foreach fn in array array[
    'public.stripe_gate_v204()',
    'public.stripe_catalog_lookup_v204(text)',
    'public.stripe_catalog_register_v204(text,text,text)',
    'public.stripe_catalog_pending_v204()',
    'public.stripe_customer_lookup_v204(uuid)',
    'public.stripe_customer_upsert_v204(uuid,text)',
    'public.stripe_checkout_record_v204(uuid,text,text,text,text,text,timestamptz)',
    'public.stripe_webhook_ingest_v204(text,text,text,timestamptz,text,text,boolean)',
    'public.stripe_webhook_apply_v204(text,text,text,text,uuid,text,integer,text,text)',
    'public.stripe_webhook_finish_v204(text,text,text)',
    'public.stripe_reconciliation_snapshot_v204(text,bigint)'
  ] loop
    execute format('revoke all on function %s from public,anon,authenticated',fn);
    execute format('grant execute on function %s to service_role',fn);
  end loop;
end $$;

commit;
