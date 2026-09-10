-- DIVINA BRUXA V205 — LEDGER UNIVERSAL DE DIREITOS
-- Destino exclusivo: Supabase STAGING. Stripe TEST; produção e lojas permanecem fechadas.
-- Migração aditiva. O cliente só lê um snapshot vinculado à própria sessão.

begin;
set local lock_timeout = '8s';
set local statement_timeout = '120s';

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

do $$
begin
  if pg_catalog.to_regprocedure('private.is_active_account_session(uuid,uuid)') is null then
    raise exception 'V205_REQUIRES_ACCOUNT_CONTROL_V201';
  end if;
  if pg_catalog.to_regclass('public.admin_owners') is null then
    raise exception 'V205_REQUIRES_OWNER_SECURITY_V146';
  end if;
  if pg_catalog.to_regclass('public.orb_skins') is null
     or pg_catalog.to_regclass('public.orb_skin_preferences') is null then
    raise exception 'V205_REQUIRES_SKIN_CATALOG_V191';
  end if;
end $$;

create table if not exists private.ledger_gate_v205 (
  environment text primary key check (environment='staging'),
  catalog_version text not null check (catalog_version='commercial-2026-09-09-v200'),
  ledger_processing_enabled boolean not null default false,
  restore_enabled boolean not null default false,
  manual_adjustments_enabled boolean not null default false,
  test_catalog_provisioning_enabled boolean not null default false,
  test_checkout_enabled boolean not null default false,
  stripe_test_enabled boolean not null default true,
  google_play_sandbox_enabled boolean not null default false,
  apple_store_sandbox_enabled boolean not null default false,
  live_billing_enabled boolean not null default false check (live_billing_enabled=false),
  production_enabled boolean not null default false check (production_enabled=false),
  sol_enabled boolean not null default false check (sol_enabled=false),
  updated_at timestamptz not null default clock_timestamp()
);

insert into private.ledger_gate_v205(
  environment,catalog_version,ledger_processing_enabled,restore_enabled,
  manual_adjustments_enabled,test_catalog_provisioning_enabled,test_checkout_enabled,
  stripe_test_enabled,google_play_sandbox_enabled,
  apple_store_sandbox_enabled,live_billing_enabled,production_enabled,sol_enabled
) values(
  'staging','commercial-2026-09-09-v200',false,false,false,false,false,true,false,false,false,false,false
) on conflict(environment) do update set
  catalog_version=excluded.catalog_version,
  ledger_processing_enabled=false,
  restore_enabled=false,
  manual_adjustments_enabled=false,
  test_catalog_provisioning_enabled=false,
  test_checkout_enabled=false,
  stripe_test_enabled=true,
  google_play_sandbox_enabled=false,
  apple_store_sandbox_enabled=false,
  live_billing_enabled=false,
  production_enabled=false,
  sol_enabled=false,
  updated_at=clock_timestamp();

create table if not exists private.ledger_assets_v205 (
  asset_key text primary key check (asset_key ~ '^[a-z0-9:_-]{3,100}$'),
  asset_kind text not null check (asset_kind in ('premium','ai_subscription','skin','credit')),
  display_name text not null check (char_length(display_name) between 2 and 100),
  sort_order integer not null check (sort_order between 1 and 1000),
  free boolean not null default false,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object')
);

insert into private.ledger_assets_v205(asset_key,asset_kind,display_name,sort_order,free,metadata) values
  ('premium:lifetime','premium','Divina Bruxa Premium',1,false,'{"includes_ai":false,"includes_all_30_skins":true}'::jsonb),
  ('orbe_ai:active','ai_subscription','Orbe IA',2,false,'{"monthly_credits":400,"luna_cost":1,"terra_cost":10,"sol_enabled":false}'::jsonb),
  ('credit:orbe_ai','credit','Créditos da Orbe IA',3,false,'{"requires_active_subscription":true}'::jsonb),
  ('skin:classic','skin','Clássica Divina',101,true,'{}'::jsonb),
  ('skin:lunar','skin','Lunar Mistério',102,false,'{}'::jsonb),
  ('skin:solar','skin','Solar Dourada',103,false,'{}'::jsonb),
  ('skin:ocean','skin','Oceanos de Copas',104,false,'{}'::jsonb),
  ('skin:emerald','skin','Esmeralda Ancestral',105,false,'{}'::jsonb),
  ('skin:fire','skin','Fogo Sagrado',106,false,'{}'::jsonb),
  ('skin:cosmic','skin','Cósmica Infinita',107,false,'{}'::jsonb),
  ('skin:eclipse','skin','Eclipse Sombria',108,false,'{}'::jsonb),
  ('skin:venus','skin','Rosa de Vênus',109,false,'{}'::jsonb),
  ('skin:amethyst','skin','Ametista Real',110,false,'{}'::jsonb),
  ('skin:sapphire','skin','Safira Celestial',111,false,'{}'::jsonb),
  ('skin:ruby','skin','Rubi da Bruxa',112,false,'{}'::jsonb),
  ('skin:aurora','skin','Aurora Boreal',113,false,'{}'::jsonb),
  ('skin:storm','skin','Tempestade Astral',114,false,'{}'::jsonb),
  ('skin:fairy','skin','Jardim das Fadas',115,false,'{}'::jsonb),
  ('skin:isis','skin','Templo Lunar',116,false,'{}'::jsonb),
  ('skin:twin-flame','skin','Chama Gêmea',117,false,'{}'::jsonb),
  ('skin:realities','skin','Portal das Realidades',118,false,'{}'::jsonb),
  ('skin:queen','skin','Rainha do Universo',119,false,'{}'::jsonb),
  ('skin:supreme','skin','Divina Suprema',120,false,'{}'::jsonb),
  ('skin:moon-silver','skin','Lua de Prata',121,false,'{}'::jsonb),
  ('skin:solstice','skin','Solstício Dourado',122,false,'{}'::jsonb),
  ('skin:neptune','skin','Maré de Netuno',123,false,'{}'::jsonb),
  ('skin:enchanted-forest','skin','Floresta Encantada',124,false,'{}'::jsonb),
  ('skin:cosmic-dragon','skin','Dragão Cósmico',125,false,'{}'::jsonb),
  ('skin:lunar-rose','skin','Rosa Lunar',126,false,'{}'::jsonb),
  ('skin:saturn-crystal','skin','Cristal de Saturno',127,false,'{}'::jsonb),
  ('skin:violet-phoenix','skin','Fênix Violeta',128,false,'{}'::jsonb),
  ('skin:celestial-oracle','skin','Oráculo Celestial',129,false,'{}'::jsonb),
  ('skin:star-crown','skin','Coroa das Estrelas',130,false,'{}'::jsonb)
on conflict(asset_key) do update set
  asset_kind=excluded.asset_kind,display_name=excluded.display_name,sort_order=excluded.sort_order,
  free=excluded.free,active=true,metadata=excluded.metadata;

create table if not exists private.ledger_products_v205 (
  product_key text primary key check (product_key ~ '^[a-z0-9_]{3,80}$'),
  product_kind text not null check (product_kind in ('premium','ai_subscription','credits','skin','skin_pack','consultation')),
  display_name text not null check (char_length(display_name) between 2 and 120),
  billing_mode text not null check (billing_mode in ('payment','subscription')),
  amount_brl_cents integer not null check (amount_brl_cents > 0),
  currency text not null default 'brl' check (currency='brl'),
  recurring_interval text check (
    (billing_mode='payment' and recurring_interval is null)
    or (billing_mode='subscription' and recurring_interval='month')
  ),
  credits integer check (credits is null or credits > 0),
  requires_asset_key text references private.ledger_assets_v205(asset_key) on delete restrict,
  active boolean not null default true,
  catalog_version text not null default 'commercial-2026-09-09-v200'
    check (catalog_version='commercial-2026-09-09-v200'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object'),
  updated_at timestamptz not null default clock_timestamp()
);

insert into private.ledger_products_v205(
  product_key,product_kind,display_name,billing_mode,amount_brl_cents,recurring_interval,credits,requires_asset_key,metadata
) values
  ('premium_lifetime','premium','Divina Bruxa Premium','payment',19990,null,null,null,'{"includes_ai":false,"includes_all_30_skins":true}'::jsonb),
  ('orbe_ai_monthly','ai_subscription','Orbe IA','subscription',8990,'month',400,null,'{"monthly_credits_expire":true}'::jsonb),
  ('credits_200','credits','Orbe IA · 200 créditos','payment',3990,null,200,'orbe_ai:active','{}'::jsonb),
  ('credits_600','credits','Orbe IA · 600 créditos','payment',9990,null,600,'orbe_ai:active','{}'::jsonb),
  ('credits_1500','credits','Orbe IA · 1.500 créditos','payment',19990,null,1500,'orbe_ai:active','{}'::jsonb),
  ('consultation_mesa_real','consultation','Mesa Real Profissional','payment',25000,null,null,null,'{"fulfillment":"manual_booking_confirmed_by_email"}'::jsonb),
  ('consultation_leitura_mentes','consultation','Leitura de Mentes','payment',15000,null,null,null,'{"fulfillment":"manual_booking_confirmed_by_email"}'::jsonb),
  ('consultation_carta_conselho','consultation','Carta de Conselho','payment',10000,null,null,null,'{"fulfillment":"manual_booking_confirmed_by_email"}'::jsonb),
  ('consultation_pergunta_direta','consultation','Pergunta Direta','payment',5000,null,null,null,'{"fulfillment":"manual_booking_confirmed_by_email"}'::jsonb),
  ('skin_lunar','skin','Lunar Mistério','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_solar','skin','Solar Dourada','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_ocean','skin','Oceanos de Copas','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_emerald','skin','Esmeralda Ancestral','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_fire','skin','Fogo Sagrado','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_cosmic','skin','Cósmica Infinita','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_eclipse','skin','Eclipse Sombria','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_venus','skin','Rosa de Vênus','payment',1990,null,null,null,'{}'::jsonb),
  ('skin_amethyst','skin','Ametista Real','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_sapphire','skin','Safira Celestial','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_ruby','skin','Rubi da Bruxa','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_aurora','skin','Aurora Boreal','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_storm','skin','Tempestade Astral','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_fairy','skin','Jardim das Fadas','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_isis','skin','Templo Lunar','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_twin_flame','skin','Chama Gêmea','payment',2990,null,null,null,'{}'::jsonb),
  ('skin_realities','skin','Portal das Realidades','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_queen','skin','Rainha do Universo','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_supreme','skin','Divina Suprema','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_moon_silver','skin','Lua de Prata','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_solstice','skin','Solstício Dourado','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_neptune','skin','Maré de Netuno','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_enchanted_forest','skin','Floresta Encantada','payment',3990,null,null,null,'{}'::jsonb),
  ('skin_cosmic_dragon','skin','Dragão Cósmico','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_lunar_rose','skin','Rosa Lunar','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_saturn_crystal','skin','Cristal de Saturno','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_violet_phoenix','skin','Fênix Violeta','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_celestial_oracle','skin','Oráculo Celestial','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_star_crown','skin','Coroa das Estrelas','payment',4990,null,null,null,'{}'::jsonb),
  ('skin_pack_constelacao_lunar','skin_pack','Constelação Lunar','payment',7990,null,null,null,'{}'::jsonb),
  ('skin_pack_portais_elementais','skin_pack','Portais Elementais','payment',9990,null,null,null,'{}'::jsonb),
  ('skin_pack_coroa_suprema','skin_pack','Coroa Suprema','payment',12990,null,null,null,'{}'::jsonb)
on conflict(product_key) do update set
  product_kind=excluded.product_kind,display_name=excluded.display_name,billing_mode=excluded.billing_mode,
  amount_brl_cents=excluded.amount_brl_cents,currency='brl',recurring_interval=excluded.recurring_interval,
  credits=excluded.credits,requires_asset_key=excluded.requires_asset_key,active=true,
  catalog_version='commercial-2026-09-09-v200',metadata=excluded.metadata,updated_at=clock_timestamp();

insert into private.ledger_products_v205(
  product_key,product_kind,display_name,billing_mode,amount_brl_cents,credits,active,metadata
) values(
  'manual_credit_adjustment','credits','Ajuste interno auditado','payment',1,null,false,'{"internal_only":true}'::jsonb
) on conflict(product_key) do update set active=false,metadata=excluded.metadata,updated_at=clock_timestamp();

create table if not exists private.ledger_product_grants_v205 (
  product_key text not null references private.ledger_products_v205(product_key) on delete cascade,
  asset_key text not null references private.ledger_assets_v205(asset_key) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  grant_kind text not null check (grant_kind in ('right','monthly_credit','extra_credit')),
  primary key(product_key,asset_key)
);

insert into private.ledger_product_grants_v205(product_key,asset_key,quantity,grant_kind) values
  ('premium_lifetime','premium:lifetime',1,'right'),
  ('orbe_ai_monthly','orbe_ai:active',1,'right'),
  ('orbe_ai_monthly','credit:orbe_ai',400,'monthly_credit'),
  ('credits_200','credit:orbe_ai',200,'extra_credit'),
  ('credits_600','credit:orbe_ai',600,'extra_credit'),
  ('credits_1500','credit:orbe_ai',1500,'extra_credit')
on conflict(product_key,asset_key) do update set quantity=excluded.quantity,grant_kind=excluded.grant_kind;

insert into private.ledger_product_grants_v205(product_key,asset_key,quantity,grant_kind)
select 'premium_lifetime',asset_key,1,'right'
from private.ledger_assets_v205
where asset_kind='skin' and free=false
on conflict(product_key,asset_key) do update set quantity=1,grant_kind='right';

create table if not exists private.provider_product_map_v205 (
  provider text not null check (provider in ('stripe','google_play','apple_store')),
  provider_environment text not null check (provider_environment in ('test','sandbox')),
  product_key text not null references private.ledger_products_v205(product_key) on delete cascade,
  external_product_id text,
  external_price_id text,
  checkout_ready boolean not null default false,
  livemode boolean not null default false check (livemode=false),
  updated_at timestamptz not null default clock_timestamp(),
  primary key(provider,provider_environment,product_key),
  unique(provider,provider_environment,external_product_id),
  unique(provider,provider_environment,external_price_id),
  check (
    (provider='stripe' and provider_environment='test'
      and (external_product_id is null or external_product_id ~ '^prod_[A-Za-z0-9]+$')
      and (external_price_id is null or external_price_id ~ '^price_[A-Za-z0-9]+$'))
    or (provider in ('google_play','apple_store') and provider_environment='sandbox')
  ),
  check (not checkout_ready or (external_product_id is not null and external_price_id is not null))
);

insert into private.provider_product_map_v205(provider,provider_environment,product_key)
select 'stripe','test',product_key from private.ledger_products_v205 where active=true
on conflict(provider,provider_environment,product_key) do nothing;

create table if not exists private.provider_customers_v205 (
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  provider text not null check (provider='stripe'),
  provider_environment text not null check (provider_environment='test'),
  external_customer_id text not null check (external_customer_id ~ '^cus_[A-Za-z0-9]+$'),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  primary key(subject_hash,provider,provider_environment),
  unique(provider,provider_environment,external_customer_id)
);

create table if not exists private.checkout_sessions_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  provider text not null default 'stripe' check (provider='stripe'),
  provider_environment text not null default 'test' check (provider_environment='test'),
  idempotency_key text not null unique check (idempotency_key ~ '^[A-Za-z0-9._:/-]{16,180}$'),
  external_session_id text not null unique check (external_session_id ~ '^cs_test_[A-Za-z0-9]+$'),
  external_customer_id text not null check (external_customer_id ~ '^cus_[A-Za-z0-9]+$'),
  amount_brl_cents integer not null check (amount_brl_cents>0),
  currency text not null default 'brl' check (currency='brl'),
  status text not null check (status in ('open','complete','expired','failed')),
  expires_at timestamptz,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp()
);

create table if not exists private.provider_events_v205 (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe','google_play','apple_store')),
  provider_environment text not null check (provider_environment in ('test','sandbox')),
  event_key text not null check (event_key ~ '^[A-Za-z0-9._:/-]{3,200}$'),
  event_type text not null check (char_length(event_type) between 3 and 120),
  object_reference text check (object_reference is null or char_length(object_reference) between 3 and 200),
  occurred_at timestamptz not null,
  payload_sha256 text not null check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  subject_hash text check (subject_hash is null or subject_hash ~ '^[a-f0-9]{64}$'),
  product_key text references private.ledger_products_v205(product_key) on delete restrict,
  normalized_action text,
  processing_status text not null default 'received'
    check (processing_status in ('received','processing','processed','ignored','review_required','failed')),
  delivery_count integer not null default 1 check (delivery_count > 0),
  error_code text check (error_code is null or error_code ~ '^[A-Z0-9_]{2,80}$'),
  first_received_at timestamptz not null default clock_timestamp(),
  last_received_at timestamptz not null default clock_timestamp(),
  processed_at timestamptz,
  unique(provider,provider_environment,event_key)
);

create table if not exists private.commerce_orders_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  provider text not null check (provider in ('stripe','google_play','apple_store')),
  provider_environment text not null check (provider_environment in ('test','sandbox')),
  root_reference_hash text not null check (root_reference_hash ~ '^[a-f0-9]{64}$'),
  product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  status text not null check (status in ('pending','paid','failed','refunded','partially_refunded','disputed','charged_back','cancelled','expired','review_required')),
  amount_brl_cents integer not null check (amount_brl_cents >= 0),
  currency text not null default 'brl' check (currency='brl'),
  receipt_code text not null unique check (receipt_code ~ '^DBX-V205-[A-F0-9]{12}$'),
  latest_event_at timestamptz not null,
  latest_event_key text not null,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  unique(provider,provider_environment,root_reference_hash)
);

create table if not exists private.provider_transactions_v205 (
  id uuid primary key default gen_random_uuid(),
  provider_event_id uuid not null unique references private.provider_events_v205(id) on delete restrict,
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  provider text not null check (provider in ('stripe','google_play','apple_store')),
  provider_environment text not null check (provider_environment in ('test','sandbox')),
  transaction_reference_hash text not null check (transaction_reference_hash ~ '^[a-f0-9]{64}$'),
  root_reference_hash text not null check (root_reference_hash ~ '^[a-f0-9]{64}$'),
  subscription_reference_hash text check (subscription_reference_hash is null or subscription_reference_hash ~ '^[a-f0-9]{64}$'),
  product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  transaction_kind text not null check (transaction_kind in (
    'purchase','renewal','subscription_state','refund','partial_refund','revocation',
    'dispute','chargeback','restore','failure','no_effect'
  )),
  normalized_action text not null,
  outcome text not null default 'pending' check (outcome in ('pending','applied','duplicate','ignored','held','review_required','failed')),
  amount_brl_cents integer not null default 0 check (amount_brl_cents >= 0),
  currency text not null default 'brl' check (currency='brl'),
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object'),
  created_at timestamptz not null default clock_timestamp(),
  unique(provider,provider_environment,transaction_reference_hash,normalized_action)
);

create table if not exists private.ledger_subscriptions_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  provider text not null check (provider in ('stripe','google_play','apple_store')),
  provider_environment text not null check (provider_environment in ('test','sandbox')),
  subscription_reference_hash text not null check (subscription_reference_hash ~ '^[a-f0-9]{64}$'),
  product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  status text not null check (status in ('active','trialing','past_due','unpaid','cancelled','expired','revoked','frozen')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  latest_event_at timestamptz not null,
  latest_event_key text not null,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check (current_period_end is null or current_period_start is null or current_period_end > current_period_start),
  unique(provider,provider_environment,subscription_reference_hash)
);

create table if not exists private.entitlement_claims_v205 (
  id uuid primary key default gen_random_uuid(),
  claim_key text not null unique check (claim_key ~ '^[a-f0-9]{64}$'),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  provider text not null check (provider in ('stripe','google_play','apple_store','manual','migration')),
  provider_environment text not null check (provider_environment in ('test','sandbox','staging')),
  source_reference_hash text not null check (source_reference_hash ~ '^[a-f0-9]{64}$'),
  source_product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  asset_key text not null references private.ledger_assets_v205(asset_key) on delete restrict,
  status text not null check (status in ('active','frozen','revoked','expired')),
  starts_at timestamptz not null default clock_timestamp(),
  ends_at timestamptz,
  latest_event_at timestamptz not null,
  latest_event_key text not null,
  source_transaction_id uuid references private.provider_transactions_v205(id) on delete restrict,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists private.manual_entitlement_overrides_v205 (
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  asset_key text not null references private.ledger_assets_v205(asset_key) on delete restrict,
  override_state text not null check (override_state in ('granted','frozen','revoked')),
  expires_at timestamptz not null,
  source_request_id uuid not null unique,
  actor_hash text not null check (actor_hash ~ '^[a-f0-9]{64}$'),
  reason_code text not null check (reason_code ~ '^[A-Z0-9_]{3,80}$'),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  primary key(subject_hash,asset_key),
  check (expires_at > created_at)
);

create table if not exists private.credit_accounts_v205 (
  subject_hash text primary key check (subject_hash ~ '^[a-f0-9]{64}$'),
  debt_credits integer not null default 0 check (debt_credits >= 0),
  review_status text not null default 'normal' check (review_status in ('normal','review_required','frozen')),
  spending_frozen boolean not null default false,
  updated_at timestamptz not null default clock_timestamp()
);

create table if not exists private.credit_lots_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  lot_type text not null check (lot_type in ('monthly','extra','manual','reversal')),
  source_key text not null unique check (source_key ~ '^[a-f0-9]{64}$'),
  source_reference_hash text not null check (source_reference_hash ~ '^[a-f0-9]{64}$'),
  source_product_key text not null references private.ledger_products_v205(product_key) on delete restrict,
  source_transaction_id uuid references private.provider_transactions_v205(id) on delete restrict,
  granted_credits integer not null check (granted_credits > 0),
  remaining_credits integer not null check (remaining_credits >= 0 and remaining_credits <= granted_credits),
  debt_credits integer not null default 0 check (debt_credits >= 0 and debt_credits <= granted_credits),
  status text not null check (status in ('active','held','frozen','revoked','expired')),
  usable_requires_subscription boolean not null default true check (usable_requires_subscription=true),
  expires_at timestamptz,
  latest_event_at timestamptz not null,
  latest_event_key text not null,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  check ((lot_type='monthly' and expires_at is not null) or lot_type<>'monthly')
);

create table if not exists private.credit_spends_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  request_id uuid not null unique,
  mode text not null check (mode in ('luna','terra')),
  spent_credits integer not null check (spent_credits in (1,10)),
  status text not null check (status in ('committed','reversed')),
  reversal_request_id uuid unique,
  purpose_hash text check (purpose_hash is null or purpose_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default clock_timestamp(),
  reversed_at timestamptz
);

create table if not exists private.credit_allocations_v205 (
  spend_id uuid not null references private.credit_spends_v205(id) on delete restrict,
  lot_id uuid not null references private.credit_lots_v205(id) on delete restrict,
  credits integer not null check (credits > 0),
  restored_credits integer not null default 0 check (restored_credits >= 0 and restored_credits <= credits),
  primary key(spend_id,lot_id)
);

create table if not exists private.entitlement_ledger_heads_v205 (
  subject_hash text primary key check (subject_hash ~ '^[a-f0-9]{64}$'),
  last_sequence bigint not null default 0 check (last_sequence >= 0),
  last_entry_hash text not null default repeat('0',64) check (last_entry_hash ~ '^[a-f0-9]{64}$'),
  updated_at timestamptz not null default clock_timestamp()
);

create table if not exists private.entitlement_ledger_v205 (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  sequence bigint not null check (sequence > 0),
  action text not null check (action in (
    'grant','renew','restore','freeze','unfreeze','revoke','expire',
    'credit_grant','credit_hold','credit_spend','credit_restore','credit_revoke','credit_debt',
    'manual_grant','manual_freeze','manual_revoke','manual_clear'
  )),
  asset_key text not null references private.ledger_assets_v205(asset_key) on delete restrict,
  delta_quantity integer not null,
  reason_code text not null check (reason_code ~ '^[A-Z0-9_]{2,80}$'),
  source_transaction_id uuid references private.provider_transactions_v205(id) on delete restrict,
  previous_hash text not null check (previous_hash ~ '^[a-f0-9]{64}$'),
  entry_hash text not null unique check (entry_hash ~ '^[a-f0-9]{64}$'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object'),
  created_at timestamptz not null default clock_timestamp(),
  unique(subject_hash,sequence)
);

create table if not exists private.manual_adjustments_v205 (
  request_id uuid primary key,
  actor_hash text not null check (actor_hash ~ '^[a-f0-9]{64}$'),
  target_hash text not null check (target_hash ~ '^[a-f0-9]{64}$'),
  action text not null check (action in ('temporary_grant','temporary_freeze','temporary_revoke','clear_override','grant_credits','remove_credits')),
  asset_key text references private.ledger_assets_v205(asset_key) on delete restrict,
  quantity integer check (quantity is null or quantity between 1 and 10000),
  expires_at timestamptz,
  reason_code text not null check (reason_code ~ '^[A-Z0-9_]{3,80}$'),
  note_sha256 text check (note_sha256 is null or note_sha256 ~ '^[a-f0-9]{64}$'),
  outcome text not null check (outcome in ('applied','cleared','partial','no_effect')),
  created_at timestamptz not null default clock_timestamp()
);

create table if not exists private.ledger_reconciliation_v205 (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null check (scope_key ~ '^[a-z0-9_.:-]{3,120}$'),
  provider text not null check (provider in ('stripe','google_play','apple_store','universal')),
  provider_environment text not null check (provider_environment in ('test','sandbox','staging')),
  observed_at timestamptz not null default clock_timestamp(),
  provider_transactions integer not null default 0 check (provider_transactions >= 0),
  local_transactions integer not null default 0 check (local_transactions >= 0),
  duplicate_credit_effects integer not null default 0 check (duplicate_credit_effects >= 0),
  ghost_entitlements integer not null default 0 check (ghost_entitlements >= 0),
  hash_chain_errors integer not null default 0 check (hash_chain_errors >= 0),
  open_review_items integer not null default 0 check (open_review_items >= 0),
  evidence jsonb not null default '{}'::jsonb check (jsonb_typeof(evidence)='object')
);

create index if not exists provider_events_v205_status_idx on private.provider_events_v205(processing_status,occurred_at);
create index if not exists checkout_sessions_v205_subject_idx on private.checkout_sessions_v205(subject_hash,created_at desc);
create index if not exists provider_events_v205_subject_idx on private.provider_events_v205(subject_hash,occurred_at desc);
create index if not exists commerce_orders_v205_subject_idx on private.commerce_orders_v205(subject_hash,created_at desc);
create index if not exists provider_transactions_v205_subject_idx on private.provider_transactions_v205(subject_hash,occurred_at desc);
create index if not exists provider_transactions_v205_root_idx on private.provider_transactions_v205(provider,provider_environment,root_reference_hash);
create index if not exists subscriptions_v205_subject_status_idx on private.ledger_subscriptions_v205(subject_hash,status,current_period_end);
create index if not exists claims_v205_subject_asset_idx on private.entitlement_claims_v205(subject_hash,asset_key,status,ends_at);
create index if not exists claims_v205_source_idx on private.entitlement_claims_v205(provider,provider_environment,source_reference_hash);
create index if not exists overrides_v205_subject_idx on private.manual_entitlement_overrides_v205(subject_hash,expires_at);
create index if not exists credit_lots_v205_spend_idx on private.credit_lots_v205(subject_hash,status,expires_at,lot_type,created_at);
create index if not exists credit_lots_v205_source_idx on private.credit_lots_v205(subject_hash,source_reference_hash,source_product_key);
create index if not exists credit_spends_v205_subject_idx on private.credit_spends_v205(subject_hash,created_at desc);
create index if not exists ledger_v205_subject_idx on private.entitlement_ledger_v205(subject_hash,sequence desc);
create index if not exists manual_adjustments_v205_target_idx on private.manual_adjustments_v205(target_hash,created_at desc);
create index if not exists reconciliation_v205_scope_idx on private.ledger_reconciliation_v205(scope_key,observed_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'ledger_gate_v205','ledger_assets_v205','ledger_products_v205','ledger_product_grants_v205',
    'provider_product_map_v205','provider_customers_v205','checkout_sessions_v205',
    'provider_events_v205','commerce_orders_v205','provider_transactions_v205','ledger_subscriptions_v205',
    'entitlement_claims_v205','manual_entitlement_overrides_v205','credit_accounts_v205','credit_lots_v205',
    'credit_spends_v205','credit_allocations_v205','entitlement_ledger_heads_v205','entitlement_ledger_v205',
    'manual_adjustments_v205','ledger_reconciliation_v205'
  ] loop
    execute pg_catalog.format('alter table private.%I enable row level security',table_name);
    execute pg_catalog.format('alter table private.%I force row level security',table_name);
    execute pg_catalog.format('revoke all on table private.%I from public,anon,authenticated',table_name);
    execute pg_catalog.format('grant select,insert,update on table private.%I to service_role',table_name);
  end loop;
end $$;

create or replace function private.subject_hash_v205(p_user_id uuid)
returns text language sql immutable security definer set search_path=''
as $$
  select pg_catalog.encode(extensions.digest('divina-bruxa-v205|' || p_user_id::text,'sha256'),'hex');
$$;

create or replace function private.reference_hash_v205(
  p_provider text,p_environment text,p_reference text
) returns text language sql immutable security definer set search_path=''
as $$
  select pg_catalog.encode(extensions.digest(
    coalesce(p_provider,'') || '|' || coalesce(p_environment,'') || '|' || coalesce(p_reference,''),
    'sha256'
  ),'hex');
$$;

create or replace function private.assert_safe_ledger_metadata_v205(p_metadata jsonb)
returns void language plpgsql immutable security definer set search_path=''
as $$
begin
  if p_metadata is null or pg_catalog.jsonb_typeof(p_metadata)<>'object'
     or pg_catalog.octet_length(p_metadata::text)>2048 then
    raise exception using errcode='22023',message='V205_UNSAFE_METADATA';
  end if;
  if exists(
    select 1 from pg_catalog.jsonb_object_keys(p_metadata) as key_name
    where pg_catalog.lower(key_name) ~ '(email|name|phone|address|token|secret|payload|question|message|journal|content|card)'
  ) then
    raise exception using errcode='22023',message='V205_PRIVATE_METADATA_FORBIDDEN';
  end if;
end;
$$;

create or replace function private.append_entitlement_ledger_v205(
  p_subject_hash text,p_action text,p_asset_key text,p_delta integer,p_reason_code text,
  p_source_transaction_id uuid default null,p_metadata jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path=''
as $$
declare
  v_sequence bigint;
  v_previous text;
  v_hash text;
  v_id uuid := gen_random_uuid();
  v_created timestamptz := clock_timestamp();
begin
  perform private.assert_safe_ledger_metadata_v205(p_metadata);
  if p_subject_hash !~ '^[a-f0-9]{64}$' or p_reason_code !~ '^[A-Z0-9_]{2,80}$' then
    raise exception using errcode='22023',message='V205_INVALID_LEDGER_ENTRY';
  end if;
  insert into private.entitlement_ledger_heads_v205(subject_hash) values(p_subject_hash)
  on conflict(subject_hash) do nothing;
  select last_sequence,last_entry_hash into v_sequence,v_previous
    from private.entitlement_ledger_heads_v205
   where subject_hash=p_subject_hash for update;
  v_sequence := v_sequence+1;
  v_hash := pg_catalog.encode(extensions.digest(
    p_subject_hash || '|' || v_sequence::text || '|' || p_action || '|' || p_asset_key || '|' ||
    p_delta::text || '|' || p_reason_code || '|' || coalesce(p_source_transaction_id::text,'') || '|' ||
    v_previous || '|' || v_created::text || '|' || p_metadata::text,
    'sha256'
  ),'hex');
  insert into private.entitlement_ledger_v205(
    id,subject_hash,sequence,action,asset_key,delta_quantity,reason_code,
    source_transaction_id,previous_hash,entry_hash,metadata,created_at
  ) values(
    v_id,p_subject_hash,v_sequence,p_action,p_asset_key,p_delta,p_reason_code,
    p_source_transaction_id,v_previous,v_hash,p_metadata,v_created
  );
  update private.entitlement_ledger_heads_v205
     set last_sequence=v_sequence,last_entry_hash=v_hash,updated_at=v_created
   where subject_hash=p_subject_hash;
  return v_id;
end;
$$;

create or replace function private.asset_active_v205(p_subject_hash text,p_asset_key text,p_at timestamptz default now())
returns boolean language sql stable security definer set search_path=''
as $$
  select
    not exists(
      select 1 from private.manual_entitlement_overrides_v205 o
       where o.subject_hash=p_subject_hash and o.asset_key=p_asset_key
         and o.expires_at>p_at and o.override_state in ('frozen','revoked')
    )
    and (
      exists(
        select 1 from private.manual_entitlement_overrides_v205 o
         where o.subject_hash=p_subject_hash and o.asset_key=p_asset_key
           and o.expires_at>p_at and o.override_state='granted'
      )
      or exists(
        select 1 from private.entitlement_claims_v205 c
         where c.subject_hash=p_subject_hash and c.asset_key=p_asset_key and c.status='active'
           and (c.ends_at is null or c.ends_at>p_at)
      )
      or exists(
        select 1 from private.ledger_assets_v205 a
         where a.asset_key=p_asset_key and a.free=true and a.active=true
      )
    );
$$;

create or replace function private.upsert_entitlement_claim_v205(
  p_subject_hash text,p_provider text,p_environment text,p_source_reference_hash text,
  p_product_key text,p_asset_key text,p_status text,p_starts_at timestamptz,p_ends_at timestamptz,
  p_event_at timestamptz,p_event_key text,p_transaction_id uuid,p_reason_code text
) returns boolean language plpgsql security definer set search_path=''
as $$
declare
  v_key text;
  v_current private.entitlement_claims_v205%rowtype;
  v_newer boolean;
  v_changed boolean := false;
  v_action text;
  v_delta integer := 0;
begin
  if p_status not in ('active','frozen','revoked','expired') then
    raise exception using errcode='22023',message='V205_INVALID_CLAIM_STATUS';
  end if;
  v_key := pg_catalog.encode(extensions.digest(
    p_provider || '|' || p_environment || '|' || p_source_reference_hash || '|' || p_asset_key,
    'sha256'
  ),'hex');
  select * into v_current from private.entitlement_claims_v205 where claim_key=v_key for update;
  if v_current.id is null then
    insert into private.entitlement_claims_v205(
      claim_key,subject_hash,provider,provider_environment,source_reference_hash,
      source_product_key,asset_key,status,starts_at,ends_at,latest_event_at,
      latest_event_key,source_transaction_id
    ) values(
      v_key,p_subject_hash,p_provider,p_environment,p_source_reference_hash,
      p_product_key,p_asset_key,p_status,p_starts_at,p_ends_at,p_event_at,
      p_event_key,p_transaction_id
    );
    v_changed := true;
    v_action := case p_status when 'active' then 'grant' when 'frozen' then 'freeze' when 'revoked' then 'revoke' else 'expire' end;
    v_delta := case when p_status='active' then 1 else 0 end;
  else
    v_newer := p_event_at>v_current.latest_event_at
      or (p_event_at=v_current.latest_event_at and p_event_key>v_current.latest_event_key);
    if not v_newer then return false; end if;
    v_changed := v_current.status<>p_status
      or v_current.ends_at is distinct from p_ends_at
      or v_current.source_product_key<>p_product_key;
    if not v_changed then
      update private.entitlement_claims_v205
         set latest_event_at=p_event_at,latest_event_key=p_event_key,source_transaction_id=p_transaction_id,
             updated_at=clock_timestamp()
       where id=v_current.id;
      return false;
    end if;
    v_action := case
      when p_status='active' and v_current.status='frozen' then 'unfreeze'
      when p_status='active' and v_current.status in ('revoked','expired') then 'restore'
      when p_status='active' then 'renew'
      when p_status='frozen' then 'freeze'
      when p_status='revoked' then 'revoke'
      else 'expire'
    end;
    v_delta := case
      when p_status='active' and v_current.status<>'active' then 1
      when p_status in ('revoked','expired') and v_current.status='active' then -1
      else 0
    end;
    update private.entitlement_claims_v205
       set subject_hash=p_subject_hash,source_product_key=p_product_key,status=p_status,
           starts_at=least(starts_at,p_starts_at),ends_at=p_ends_at,
           latest_event_at=p_event_at,latest_event_key=p_event_key,
           source_transaction_id=p_transaction_id,updated_at=clock_timestamp()
     where id=v_current.id;
  end if;
  perform private.append_entitlement_ledger_v205(
    p_subject_hash,v_action,p_asset_key,v_delta,p_reason_code,p_transaction_id,
    pg_catalog.jsonb_build_object('claimKey',v_key,'status',p_status)
  );
  return true;
end;
$$;

create or replace function private.ensure_skin_preference_v205(p_user_id uuid,p_subject_hash text)
returns boolean language plpgsql security definer set search_path=''
as $$
declare v_equipped uuid; v_slug text; v_classic uuid;
begin
  select pref.equipped_skin_id,skin.slug into v_equipped,v_slug
    from public.orb_skin_preferences pref
    join public.orb_skins skin on skin.id=pref.equipped_skin_id
   where pref.user_id=p_user_id;
  if v_equipped is null or v_slug='classic' or private.asset_active_v205(p_subject_hash,'skin:'||v_slug,now()) then
    return false;
  end if;
  select id into v_classic from public.orb_skins
   where slug='classic' and is_free=true and status='published' limit 1;
  if v_classic is null then raise exception 'V205_CLASSIC_SKIN_MISSING'; end if;
  update public.orb_skin_preferences
     set equipped_skin_id=v_classic,updated_at=clock_timestamp()
   where user_id=p_user_id;
  return found;
end;
$$;

create or replace function private.is_orbe_active_v205(p_subject_hash text,p_at timestamptz default now())
returns boolean language sql stable security definer set search_path=''
as $$
  select private.asset_active_v205(p_subject_hash,'orbe_ai:active',p_at)
    and not coalesce((
      select a.spending_frozen from private.credit_accounts_v205 a where a.subject_hash=p_subject_hash
    ),false);
$$;

create or replace function private.apply_product_claims_v205(
  p_subject_hash text,p_provider text,p_environment text,p_source_reference_hash text,
  p_product_key text,p_status text,p_starts_at timestamptz,p_ends_at timestamptz,
  p_event_at timestamptz,p_event_key text,p_transaction_id uuid,p_reason_code text
) returns integer language plpgsql security definer set search_path=''
as $$
declare v_grant record; v_changed integer := 0;
begin
  for v_grant in
    select asset_key from private.ledger_product_grants_v205
     where product_key=p_product_key and grant_kind='right' order by asset_key
  loop
    if private.upsert_entitlement_claim_v205(
      p_subject_hash,p_provider,p_environment,p_source_reference_hash,p_product_key,
      v_grant.asset_key,p_status,p_starts_at,p_ends_at,p_event_at,p_event_key,
      p_transaction_id,p_reason_code
    ) then v_changed := v_changed+1; end if;
  end loop;
  return v_changed;
end;
$$;

create or replace function private.grant_credit_lot_v205(
  p_subject_hash text,p_source_reference_hash text,p_product_key text,p_lot_type text,
  p_credits integer,p_expires_at timestamptz,p_event_at timestamptz,p_event_key text,
  p_transaction_id uuid,p_reason_code text
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_key text;
  v_lot private.credit_lots_v205%rowtype;
  v_status text;
  v_active boolean;
begin
  if p_lot_type not in ('monthly','extra','manual','reversal') or p_credits<1 or p_credits>10000
     or (p_lot_type='monthly' and (p_expires_at is null or p_expires_at<=p_event_at)) then
    raise exception using errcode='22023',message='V205_INVALID_CREDIT_LOT';
  end if;
  insert into private.credit_accounts_v205(subject_hash) values(p_subject_hash)
  on conflict(subject_hash) do nothing;
  select private.is_orbe_active_v205(p_subject_hash,p_event_at) into v_active;
  v_status := case when v_active then 'active' else 'held' end;
  v_key := pg_catalog.encode(extensions.digest(
    p_subject_hash || '|' || p_source_reference_hash || '|' || p_product_key || '|' || p_lot_type,
    'sha256'
  ),'hex');
  select * into v_lot from private.credit_lots_v205 where source_key=v_key for update;
  if v_lot.id is not null then
    if p_event_at>v_lot.latest_event_at or (p_event_at=v_lot.latest_event_at and p_event_key>v_lot.latest_event_key) then
      update private.credit_lots_v205
         set latest_event_at=p_event_at,latest_event_key=p_event_key,updated_at=clock_timestamp()
       where id=v_lot.id;
    end if;
    return pg_catalog.jsonb_build_object('created',false,'status',v_lot.status,'lotId',v_lot.id);
  end if;
  insert into private.credit_lots_v205(
    subject_hash,lot_type,source_key,source_reference_hash,source_product_key,
    source_transaction_id,granted_credits,remaining_credits,debt_credits,status,
    expires_at,latest_event_at,latest_event_key
  ) values(
    p_subject_hash,p_lot_type,v_key,p_source_reference_hash,p_product_key,
    p_transaction_id,p_credits,p_credits,0,v_status,p_expires_at,p_event_at,p_event_key
  ) returning * into v_lot;
  perform private.append_entitlement_ledger_v205(
    p_subject_hash,case when v_status='active' then 'credit_grant' else 'credit_hold' end,
    'credit:orbe_ai',case when v_status='active' then p_credits else 0 end,
    p_reason_code,p_transaction_id,
    pg_catalog.jsonb_build_object('lotType',p_lot_type,'credits',p_credits,'status',v_status)
  );
  if v_status='held' then
    update private.credit_accounts_v205
       set review_status='review_required',spending_frozen=true,updated_at=clock_timestamp()
     where subject_hash=p_subject_hash;
  end if;
  return pg_catalog.jsonb_build_object('created',true,'status',v_status,'lotId',v_lot.id);
end;
$$;

create or replace function private.set_credit_source_state_v205(
  p_subject_hash text,p_source_reference_hash text,p_product_key text,p_desired_state text,
  p_event_at timestamptz,p_event_key text,p_transaction_id uuid,p_reason_code text
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_lot private.credit_lots_v205%rowtype;
  v_changed integer := 0;
  v_removed integer := 0;
  v_debt integer := 0;
  v_spent integer;
  v_new_remaining integer;
begin
  if p_desired_state not in ('active','frozen','revoked') then
    raise exception using errcode='22023',message='V205_INVALID_CREDIT_STATE';
  end if;
  insert into private.credit_accounts_v205(subject_hash) values(p_subject_hash)
  on conflict(subject_hash) do nothing;
  for v_lot in
    select * from private.credit_lots_v205
     where subject_hash=p_subject_hash and source_reference_hash=p_source_reference_hash
       and source_product_key=p_product_key
     order by created_at for update
  loop
    if p_event_at<v_lot.latest_event_at
       or (p_event_at=v_lot.latest_event_at and p_event_key<=v_lot.latest_event_key) then
      continue;
    end if;
    select coalesce(pg_catalog.sum(a.credits-a.restored_credits),0)::integer into v_spent
      from private.credit_allocations_v205 a where a.lot_id=v_lot.id;
    if p_desired_state='revoked' then
      v_removed := v_removed+v_lot.remaining_credits;
      v_debt := v_debt+greatest(0,v_spent-v_lot.debt_credits);
      update private.credit_lots_v205
         set remaining_credits=0,debt_credits=greatest(v_lot.debt_credits,v_spent),
             status='revoked',latest_event_at=p_event_at,latest_event_key=p_event_key,
             updated_at=clock_timestamp()
       where id=v_lot.id;
      perform private.append_entitlement_ledger_v205(
        p_subject_hash,'credit_revoke','credit:orbe_ai',-v_lot.remaining_credits,p_reason_code,
        p_transaction_id,pg_catalog.jsonb_build_object('lotId',v_lot.id,'consumedDebt',v_spent)
      );
      if v_spent>0 then
        perform private.append_entitlement_ledger_v205(
          p_subject_hash,'credit_debt','credit:orbe_ai',0,'CREDIT_REFUND_DEBT',p_transaction_id,
          pg_catalog.jsonb_build_object('lotId',v_lot.id,'debtCredits',v_spent)
        );
      end if;
    elsif p_desired_state='frozen' then
      update private.credit_lots_v205
         set status=case when status='expired' then 'expired' else 'frozen' end,
             latest_event_at=p_event_at,latest_event_key=p_event_key,updated_at=clock_timestamp()
       where id=v_lot.id;
      perform private.append_entitlement_ledger_v205(
        p_subject_hash,'credit_hold','credit:orbe_ai',0,p_reason_code,p_transaction_id,
        pg_catalog.jsonb_build_object('lotId',v_lot.id,'status','frozen')
      );
    else
      v_new_remaining := greatest(0,v_lot.granted_credits-v_spent);
      update private.credit_accounts_v205
         set debt_credits=greatest(0,debt_credits-v_lot.debt_credits),updated_at=clock_timestamp()
       where subject_hash=p_subject_hash;
      update private.credit_lots_v205
         set remaining_credits=v_new_remaining,debt_credits=0,
             status=case when expires_at is not null and expires_at<=p_event_at then 'expired' else 'active' end,
             latest_event_at=p_event_at,latest_event_key=p_event_key,updated_at=clock_timestamp()
       where id=v_lot.id;
      perform private.append_entitlement_ledger_v205(
        p_subject_hash,'credit_restore','credit:orbe_ai',0,p_reason_code,p_transaction_id,
        pg_catalog.jsonb_build_object('lotId',v_lot.id,'remainingCredits',v_new_remaining)
      );
    end if;
    v_changed := v_changed+1;
  end loop;
  if p_desired_state in ('revoked','frozen') then
    update private.credit_accounts_v205
       set debt_credits=debt_credits+v_debt,review_status='review_required',spending_frozen=true,
           updated_at=clock_timestamp()
     where subject_hash=p_subject_hash;
  elsif not exists(
    select 1 from private.credit_lots_v205 where subject_hash=p_subject_hash and status='frozen'
  ) and not exists(
    select 1 from private.entitlement_claims_v205 where subject_hash=p_subject_hash and status='frozen'
  ) then
    update private.credit_accounts_v205
       set review_status=case when debt_credits=0 then 'normal' else 'review_required' end,
           spending_frozen=(debt_credits>0),updated_at=clock_timestamp()
     where subject_hash=p_subject_hash;
  end if;
  return pg_catalog.jsonb_build_object('changedLots',v_changed,'removedCredits',v_removed,'debtAdded',v_debt);
end;
$$;

create or replace function public.ledger_catalog_pending_v205()
returns jsonb language sql stable security definer set search_path=''
as $$
  select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
    'productKey',p.product_key,'name',p.display_name,'kind',p.product_kind,
    'billingMode',p.billing_mode,'amountBrlCents',p.amount_brl_cents,'currency',p.currency,
    'recurringInterval',p.recurring_interval,'credits',p.credits
  ) order by p.product_key),'[]'::jsonb)
  from private.ledger_products_v205 p
  join private.provider_product_map_v205 m on m.product_key=p.product_key
   and m.provider='stripe' and m.provider_environment='test'
  where p.active=true and m.checkout_ready=false and m.livemode=false;
$$;

create or replace function public.ledger_catalog_register_v205(
  p_product_key text,p_external_product_id text,p_external_price_id text
) returns boolean language plpgsql security definer set search_path=''
as $$
begin
  if p_external_product_id !~ '^prod_[A-Za-z0-9]+$' or p_external_price_id !~ '^price_[A-Za-z0-9]+$' then
    raise exception using errcode='22023',message='V205_INVALID_STRIPE_TEST_CATALOG_ID';
  end if;
  update private.provider_product_map_v205 m
     set external_product_id=p_external_product_id,external_price_id=p_external_price_id,
         checkout_ready=true,livemode=false,updated_at=clock_timestamp()
   where m.provider='stripe' and m.provider_environment='test' and m.product_key=p_product_key
     and exists(select 1 from private.ledger_products_v205 p where p.product_key=m.product_key and p.active=true);
  return found;
end;
$$;

create or replace function public.ledger_catalog_lookup_v205(p_product_key text)
returns jsonb language sql stable security definer set search_path=''
as $$
  select pg_catalog.jsonb_build_object(
    'productKey',p.product_key,'name',p.display_name,'kind',p.product_kind,
    'billingMode',p.billing_mode,'amountBrlCents',p.amount_brl_cents,'currency',p.currency,
    'recurringInterval',p.recurring_interval,'credits',p.credits,'active',p.active,
    'checkoutReady',m.checkout_ready,'stripeProductId',m.external_product_id,
    'stripePriceId',m.external_price_id,'livemode',false
  ) from private.ledger_products_v205 p
  join private.provider_product_map_v205 m on m.product_key=p.product_key
   and m.provider='stripe' and m.provider_environment='test'
  where p.product_key=p_product_key;
$$;

create or replace function public.ledger_customer_lookup_v205(p_user_id uuid)
returns text language sql stable security definer set search_path=''
as $$
  select c.external_customer_id from private.provider_customers_v205 c
   where c.subject_hash=private.subject_hash_v205(p_user_id)
     and c.provider='stripe' and c.provider_environment='test';
$$;

create or replace function public.ledger_customer_upsert_v205(p_user_id uuid,p_external_customer_id text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_customer text;
begin
  if p_external_customer_id !~ '^cus_[A-Za-z0-9]+$' then
    raise exception using errcode='22023',message='V205_INVALID_STRIPE_TEST_CUSTOMER';
  end if;
  insert into private.provider_customers_v205(subject_hash,provider,provider_environment,external_customer_id)
  values(private.subject_hash_v205(p_user_id),'stripe','test',p_external_customer_id)
  on conflict(subject_hash,provider,provider_environment) do update set
    external_customer_id=excluded.external_customer_id,updated_at=clock_timestamp()
  returning external_customer_id into v_customer;
  return v_customer;
end;
$$;

create or replace function public.ledger_checkout_record_v205(
  p_user_id uuid,p_product_key text,p_idempotency_key text,p_external_session_id text,
  p_external_customer_id text,p_status text,p_expires_at timestamptz
) returns uuid language plpgsql security definer set search_path=''
as $$
declare v_id uuid;
begin
  if p_idempotency_key !~ '^[A-Za-z0-9._:/-]{16,180}$'
     or p_external_session_id !~ '^cs_test_[A-Za-z0-9]+$'
     or p_external_customer_id !~ '^cus_[A-Za-z0-9]+$'
     or p_status not in ('open','complete','expired','failed') then
    raise exception using errcode='22023',message='V205_INVALID_TEST_CHECKOUT';
  end if;
  insert into private.checkout_sessions_v205(
    subject_hash,product_key,idempotency_key,external_session_id,external_customer_id,
    amount_brl_cents,currency,status,expires_at
  ) select private.subject_hash_v205(p_user_id),p.product_key,p_idempotency_key,p_external_session_id,
           p_external_customer_id,p.amount_brl_cents,p.currency,p_status,p_expires_at
      from private.ledger_products_v205 p
      join private.provider_product_map_v205 m on m.product_key=p.product_key
       and m.provider='stripe' and m.provider_environment='test'
     where p.product_key=p_product_key and p.active=true and m.checkout_ready=true and m.livemode=false
  on conflict(idempotency_key) do update set
    status=excluded.status,expires_at=excluded.expires_at,updated_at=clock_timestamp()
  returning id into v_id;
  if v_id is null then raise exception using errcode='P0001',message='V205_CATALOG_NOT_READY'; end if;
  return v_id;
end;
$$;

create or replace function public.ledger_checkout_eligibility_v205(p_product_key text)
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_session_id uuid := nullif((select auth.jwt()->>'session_id'),'')::uuid;
  v_subject text;
  v_product private.ledger_products_v205%rowtype;
  v_total integer := 0;
  v_owned integer := 0;
  v_overlap jsonb := '[]'::jsonb;
  v_allowed boolean := true;
  v_reason text := null;
begin
  if not private.is_active_account_session(v_user_id,v_session_id) then
    raise exception using errcode='42501',message='V205_ACTIVE_SESSION_REQUIRED';
  end if;
  v_subject := private.subject_hash_v205(v_user_id);
  select * into v_product from private.ledger_products_v205 where product_key=p_product_key and active=true;
  if v_product.product_key is null then
    return pg_catalog.jsonb_build_object('allowed',false,'reason','PRODUCT_NOT_ALLOWED');
  end if;
  if v_product.product_kind='credits' and not private.is_orbe_active_v205(v_subject,now()) then
    v_allowed := false; v_reason := 'ACTIVE_ORBE_REQUIRED';
  elsif v_product.product_kind='premium' and private.asset_active_v205(v_subject,'premium:lifetime',now()) then
    v_allowed := false; v_reason := 'ALREADY_OWNED';
  elsif v_product.product_kind in ('skin','skin_pack') then
    select count(*)::integer,
           count(*) filter(where private.asset_active_v205(v_subject,g.asset_key,now()))::integer,
           coalesce(pg_catalog.jsonb_agg(pg_catalog.substr(g.asset_key,6) order by a.sort_order)
             filter(where private.asset_active_v205(v_subject,g.asset_key,now())),'[]'::jsonb)
      into v_total,v_owned,v_overlap
      from private.ledger_product_grants_v205 g
      join private.ledger_assets_v205 a on a.asset_key=g.asset_key
     where g.product_key=p_product_key and g.grant_kind='right';
    if v_total>0 and v_owned=v_total then v_allowed:=false; v_reason:='ALREADY_OWNED'; end if;
  end if;
  return pg_catalog.jsonb_build_object(
    'allowed',v_allowed,'reason',v_reason,'productKey',v_product.product_key,
    'kind',v_product.product_kind,'amountBrlCents',v_product.amount_brl_cents,
    'ownedGrantCount',v_owned,'totalGrantCount',v_total,'overlapSkinIds',v_overlap,
    'requiresOverlapAcknowledgement',v_allowed and v_owned>0 and v_owned<v_total
  );
end;
$$;

create or replace function public.ledger_apply_provider_event_v205(
  p_provider text,p_provider_environment text,p_event_key text,p_event_type text,
  p_payload_sha256 text,p_user_id uuid,p_product_key text,p_action text,
  p_root_reference text,p_transaction_reference text,p_subscription_reference text,
  p_amount_brl_cents integer,p_currency text,p_occurred_at timestamptz,
  p_period_start timestamptz,p_period_end timestamptz,p_cancel_at_period_end boolean,
  p_metadata jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_gate private.ledger_gate_v205%rowtype;
  v_event private.provider_events_v205%rowtype;
  v_product private.ledger_products_v205%rowtype;
  v_subject text;
  v_root_hash text;
  v_transaction_hash text;
  v_subscription_hash text;
  v_claim_source_hash text;
  v_transaction_id uuid;
  v_transaction_event_id uuid;
  v_transaction_kind text;
  v_order_status text;
  v_receipt text;
  v_claim_status text;
  v_changed integer := 0;
  v_lot jsonb := '{}'::jsonb;
  v_credit_state jsonb := '{}'::jsonb;
  v_existing_product text;
  v_financial boolean;
begin
  if p_provider not in ('stripe','google_play','apple_store')
     or p_provider_environment not in ('test','sandbox')
     or (p_provider='stripe' and p_provider_environment<>'test')
     or (p_provider in ('google_play','apple_store') and p_provider_environment<>'sandbox')
     or p_event_key !~ '^[A-Za-z0-9._:/-]{3,200}$'
     or char_length(p_event_type) not between 3 and 120
     or p_payload_sha256 !~ '^[a-f0-9]{64}$'
     or p_action not in (
       'purchase_paid','restore_paid','subscription_active','subscription_renewed',
       'subscription_past_due','subscription_expired','refund_full','refund_partial',
       'revocation','dispute_opened','dispute_won','chargeback','no_effect'
     ) then
    raise exception using errcode='22023',message='V205_INVALID_PROVIDER_EVENT';
  end if;
  perform private.assert_safe_ledger_metadata_v205(coalesce(p_metadata,'{}'::jsonb));
  v_subject := case when p_user_id is null then null else private.subject_hash_v205(p_user_id) end;
  insert into private.provider_events_v205(
    provider,provider_environment,event_key,event_type,object_reference,occurred_at,
    payload_sha256,subject_hash,normalized_action
  ) values(
    p_provider,p_provider_environment,p_event_key,p_event_type,
    case when p_transaction_reference ~ '^[A-Za-z0-9._:/-]{3,200}$' then p_transaction_reference else null end,
    p_occurred_at,p_payload_sha256,v_subject,p_action
  ) on conflict(provider,provider_environment,event_key) do update set
    delivery_count=private.provider_events_v205.delivery_count+1,
    last_received_at=clock_timestamp()
  returning * into v_event;

  if v_event.processing_status in ('processed','ignored') then
    return pg_catalog.jsonb_build_object(
      'ok',true,'release','V205','duplicate',true,'effectApplied',false,
      'eventId',v_event.id,'status',v_event.processing_status
    );
  end if;
  select * into v_gate from private.ledger_gate_v205 where environment='staging';
  if v_gate.live_billing_enabled or v_gate.production_enabled then
    raise exception using errcode='P0001',message='V205_LIVE_GATE_INVARIANT_BROKEN';
  end if;
  if (p_provider='stripe' and not v_gate.stripe_test_enabled)
     or (p_provider='google_play' and not v_gate.google_play_sandbox_enabled)
     or (p_provider='apple_store' and not v_gate.apple_store_sandbox_enabled) then
    update private.provider_events_v205
       set processing_status='review_required',error_code='PROVIDER_GATE_CLOSED'
     where id=v_event.id;
    return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','provider_gate_closed','eventId',v_event.id);
  end if;
  if not v_gate.ledger_processing_enabled then
    return pg_catalog.jsonb_build_object('ok',true,'release','V205','queued',true,'effectApplied',false,'eventId',v_event.id);
  end if;
  if p_user_id is null or p_product_key !~ '^[a-z0-9_]{3,80}$'
     or p_root_reference !~ '^[A-Za-z0-9._:/-]{3,200}$'
     or p_transaction_reference !~ '^[A-Za-z0-9._:/-]{3,200}$'
     or p_currency<>'brl' then
    update private.provider_events_v205
       set processing_status='review_required',error_code='AUTHORITY_FIELDS_MISSING'
     where id=v_event.id;
    return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','review_required','eventId',v_event.id);
  end if;
  select * into v_product from private.ledger_products_v205
   where product_key=p_product_key and active=true;
  if v_product.product_key is null then
    update private.provider_events_v205 set processing_status='review_required',error_code='PRODUCT_NOT_ALLOWED'
     where id=v_event.id;
    return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','review_required','eventId',v_event.id);
  end if;
  v_financial := p_action in (
    'purchase_paid','restore_paid','subscription_renewed','refund_full','refund_partial',
    'revocation','dispute_opened','dispute_won','chargeback'
  );
  if p_amount_brl_cents is null or p_amount_brl_cents<0
     or (p_action in ('purchase_paid','restore_paid','subscription_renewed') and p_amount_brl_cents<>v_product.amount_brl_cents)
     or (p_action in ('refund_full','refund_partial','dispute_opened','dispute_won','chargeback')
         and (p_amount_brl_cents<1 or p_amount_brl_cents>v_product.amount_brl_cents)) then
    update private.provider_events_v205 set processing_status='review_required',error_code='AMOUNT_MISMATCH'
     where id=v_event.id;
    return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','amount_review','eventId',v_event.id);
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_subject,0));
  update private.provider_events_v205
     set processing_status='processing',subject_hash=v_subject,product_key=p_product_key,
         normalized_action=p_action,error_code=null
   where id=v_event.id;

  v_root_hash := private.reference_hash_v205(p_provider,p_provider_environment,p_root_reference);
  v_transaction_hash := private.reference_hash_v205(p_provider,p_provider_environment,p_transaction_reference);
  v_subscription_hash := case when p_subscription_reference is null then null
    when p_subscription_reference ~ '^[A-Za-z0-9._:/-]{3,200}$'
      then private.reference_hash_v205(p_provider,p_provider_environment,p_subscription_reference)
    else null end;
  v_transaction_kind := case
    when p_action in ('purchase_paid') then 'purchase'
    when p_action='restore_paid' then 'restore'
    when p_action='subscription_renewed' then 'renewal'
    when p_action in ('subscription_active','subscription_past_due','subscription_expired') then 'subscription_state'
    when p_action='refund_full' then 'refund'
    when p_action='refund_partial' then 'partial_refund'
    when p_action='revocation' then 'revocation'
    when p_action='dispute_opened' or p_action='dispute_won' then 'dispute'
    when p_action='chargeback' then 'chargeback'
    else 'no_effect'
  end;
  insert into private.provider_transactions_v205(
    provider_event_id,subject_hash,provider,provider_environment,transaction_reference_hash,
    root_reference_hash,subscription_reference_hash,product_key,transaction_kind,
    normalized_action,outcome,amount_brl_cents,currency,occurred_at,metadata
  ) values(
    v_event.id,v_subject,p_provider,p_provider_environment,v_transaction_hash,
    v_root_hash,v_subscription_hash,p_product_key,v_transaction_kind,p_action,'pending',
    p_amount_brl_cents,'brl',p_occurred_at,coalesce(p_metadata,'{}'::jsonb)
  ) on conflict do nothing
  returning id into v_transaction_id;
  if v_transaction_id is null then
    select id,provider_event_id into v_transaction_id,v_transaction_event_id
      from private.provider_transactions_v205
     where provider_event_id=v_event.id
        or (provider=p_provider and provider_environment=p_provider_environment
            and transaction_reference_hash=v_transaction_hash and normalized_action=p_action)
     order by (provider_event_id=v_event.id) desc limit 1;
    if v_transaction_event_id is distinct from v_event.id then
      update private.provider_events_v205
         set processing_status='ignored',error_code='DUPLICATE_TRANSACTION',processed_at=clock_timestamp()
       where id=v_event.id;
      return pg_catalog.jsonb_build_object(
        'ok',true,'release','V205','duplicate',true,'effectApplied',false,
        'eventId',v_event.id,'transactionId',v_transaction_id,'status','duplicate_transaction'
      );
    end if;
  end if;

  if v_financial then
    select product_key into v_existing_product from private.commerce_orders_v205
     where provider=p_provider and provider_environment=p_provider_environment
       and root_reference_hash=v_root_hash for update;
    if v_existing_product is not null and v_existing_product<>p_product_key then
      update private.provider_transactions_v205 set outcome='review_required' where id=v_transaction_id and outcome='pending';
      update private.provider_events_v205
         set processing_status='review_required',error_code='ROOT_PRODUCT_MISMATCH',processed_at=clock_timestamp()
       where id=v_event.id;
      return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','review_required','eventId',v_event.id);
    end if;
    v_order_status := case
      when p_action in ('purchase_paid','restore_paid','subscription_renewed','dispute_won') then 'paid'
      when p_action='refund_full' or p_action='revocation' then 'refunded'
      when p_action='refund_partial' then 'partially_refunded'
      when p_action='dispute_opened' then 'disputed'
      when p_action='chargeback' then 'charged_back'
      else 'pending'
    end;
    v_receipt := 'DBX-V205-' || pg_catalog.upper(pg_catalog.substr(v_root_hash,1,12));
    insert into private.commerce_orders_v205(
      subject_hash,provider,provider_environment,root_reference_hash,product_key,status,
      amount_brl_cents,currency,receipt_code,latest_event_at,latest_event_key
    ) values(
      v_subject,p_provider,p_provider_environment,v_root_hash,p_product_key,v_order_status,
      case when p_action in ('purchase_paid','restore_paid','subscription_renewed') then p_amount_brl_cents else v_product.amount_brl_cents end,
      'brl',v_receipt,p_occurred_at,p_event_key
    ) on conflict(provider,provider_environment,root_reference_hash) do update set
      status=case
        when excluded.latest_event_at>private.commerce_orders_v205.latest_event_at
          or (excluded.latest_event_at=private.commerce_orders_v205.latest_event_at
              and excluded.latest_event_key>private.commerce_orders_v205.latest_event_key)
        then excluded.status else private.commerce_orders_v205.status end,
      amount_brl_cents=case
        when excluded.status='paid' then excluded.amount_brl_cents
        else private.commerce_orders_v205.amount_brl_cents end,
      latest_event_at=greatest(private.commerce_orders_v205.latest_event_at,excluded.latest_event_at),
      latest_event_key=case
        when excluded.latest_event_at>private.commerce_orders_v205.latest_event_at
          or (excluded.latest_event_at=private.commerce_orders_v205.latest_event_at
              and excluded.latest_event_key>private.commerce_orders_v205.latest_event_key)
        then excluded.latest_event_key else private.commerce_orders_v205.latest_event_key end,
      updated_at=clock_timestamp();
  end if;

  if p_action in ('subscription_active','subscription_renewed','subscription_past_due','subscription_expired') then
    if v_subscription_hash is null or p_product_key<>'orbe_ai_monthly'
       or (p_action in ('subscription_active','subscription_renewed')
           and (p_period_end is null or p_period_end<=p_occurred_at)) then
      update private.provider_transactions_v205 set outcome='review_required' where id=v_transaction_id;
      update private.provider_events_v205
         set processing_status='review_required',error_code='SUBSCRIPTION_STATE_INVALID',processed_at=clock_timestamp()
       where id=v_event.id;
      return pg_catalog.jsonb_build_object('ok',false,'release','V205','status','review_required','eventId',v_event.id);
    end if;
    insert into private.ledger_subscriptions_v205(
      subject_hash,provider,provider_environment,subscription_reference_hash,product_key,status,
      current_period_start,current_period_end,cancel_at_period_end,latest_event_at,latest_event_key
    ) values(
      v_subject,p_provider,p_provider_environment,v_subscription_hash,p_product_key,
      case p_action when 'subscription_past_due' then 'past_due' when 'subscription_expired' then 'expired' else 'active' end,
      p_period_start,p_period_end,coalesce(p_cancel_at_period_end,false),p_occurred_at,p_event_key
    ) on conflict(provider,provider_environment,subscription_reference_hash) do update set
      status=case when excluded.latest_event_at>private.ledger_subscriptions_v205.latest_event_at
                    or (excluded.latest_event_at=private.ledger_subscriptions_v205.latest_event_at
                        and excluded.latest_event_key>private.ledger_subscriptions_v205.latest_event_key)
                  then excluded.status else private.ledger_subscriptions_v205.status end,
      current_period_start=case when excluded.latest_event_at>=private.ledger_subscriptions_v205.latest_event_at
                                then excluded.current_period_start else private.ledger_subscriptions_v205.current_period_start end,
      current_period_end=case when excluded.latest_event_at>=private.ledger_subscriptions_v205.latest_event_at
                              then excluded.current_period_end else private.ledger_subscriptions_v205.current_period_end end,
      cancel_at_period_end=case when excluded.latest_event_at>=private.ledger_subscriptions_v205.latest_event_at
                                then excluded.cancel_at_period_end else private.ledger_subscriptions_v205.cancel_at_period_end end,
      latest_event_at=greatest(private.ledger_subscriptions_v205.latest_event_at,excluded.latest_event_at),
      latest_event_key=case when excluded.latest_event_at>private.ledger_subscriptions_v205.latest_event_at
                              or (excluded.latest_event_at=private.ledger_subscriptions_v205.latest_event_at
                                  and excluded.latest_event_key>private.ledger_subscriptions_v205.latest_event_key)
                            then excluded.latest_event_key else private.ledger_subscriptions_v205.latest_event_key end,
      updated_at=clock_timestamp();
  end if;

  if p_action in ('purchase_paid','restore_paid') then
    if v_product.product_kind in ('premium','skin','skin_pack') then
      v_changed := private.apply_product_claims_v205(
        v_subject,p_provider,p_provider_environment,v_root_hash,p_product_key,'active',
        p_occurred_at,null,p_occurred_at,p_event_key,v_transaction_id,
        case when p_action='restore_paid' then 'PROVIDER_RESTORE' else 'PROVIDER_PAID' end
      );
    elsif v_product.product_kind='credits' then
      v_lot := private.grant_credit_lot_v205(
        v_subject,v_root_hash,p_product_key,'extra',v_product.credits,null,p_occurred_at,
        p_event_key,v_transaction_id,case when p_action='restore_paid' then 'PROVIDER_RESTORE' else 'PROVIDER_PAID' end
      );
    end if;
  elsif p_action in ('subscription_active','subscription_renewed') then
    v_claim_source_hash := v_subscription_hash;
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_claim_source_hash,p_product_key,'active',
      coalesce(p_period_start,p_occurred_at),p_period_end,p_occurred_at,p_event_key,
      v_transaction_id,case when p_action='subscription_renewed' then 'SUBSCRIPTION_RENEWED' else 'SUBSCRIPTION_ACTIVE' end
    );
    if p_action='subscription_renewed' then
      v_lot := private.grant_credit_lot_v205(
        v_subject,v_root_hash,p_product_key,'monthly',400,p_period_end,p_occurred_at,
        p_event_key,v_transaction_id,'SUBSCRIPTION_CYCLE_PAID'
      );
    end if;
  elsif p_action='subscription_past_due' then
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_subscription_hash,p_product_key,'frozen',
      coalesce(p_period_start,p_occurred_at),p_period_end,p_occurred_at,p_event_key,
      v_transaction_id,'SUBSCRIPTION_PAST_DUE'
    );
    update private.credit_accounts_v205 set review_status='review_required',spending_frozen=true,updated_at=clock_timestamp()
     where subject_hash=v_subject;
  elsif p_action='subscription_expired' then
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_subscription_hash,p_product_key,'expired',
      coalesce(p_period_start,p_occurred_at),coalesce(p_period_end,p_occurred_at+interval '1 microsecond'),
      p_occurred_at,p_event_key,v_transaction_id,'SUBSCRIPTION_EXPIRED'
    );
  elsif p_action in ('refund_full','revocation','chargeback') then
    v_claim_status := 'revoked';
    v_claim_source_hash := case when v_product.product_kind='ai_subscription' and v_subscription_hash is not null
      then v_subscription_hash else v_root_hash end;
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_claim_source_hash,p_product_key,v_claim_status,
      p_occurred_at,null,p_occurred_at,p_event_key,v_transaction_id,
      case p_action when 'chargeback' then 'CHARGEBACK' when 'revocation' then 'PROVIDER_REVOCATION' else 'PROVIDER_REFUND' end
    );
    v_credit_state := private.set_credit_source_state_v205(
      v_subject,v_root_hash,p_product_key,'revoked',p_occurred_at,p_event_key,v_transaction_id,
      case p_action when 'chargeback' then 'CHARGEBACK' else 'PROVIDER_REFUND' end
    );
    if p_action='chargeback' then
      insert into private.credit_accounts_v205(subject_hash,review_status,spending_frozen)
      values(v_subject,'frozen',true)
      on conflict(subject_hash) do update set review_status='frozen',spending_frozen=true,updated_at=clock_timestamp();
    end if;
  elsif p_action in ('refund_partial','dispute_opened') then
    v_claim_source_hash := case when v_product.product_kind='ai_subscription' and v_subscription_hash is not null
      then v_subscription_hash else v_root_hash end;
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_claim_source_hash,p_product_key,'frozen',
      p_occurred_at,null,p_occurred_at,p_event_key,v_transaction_id,
      case when p_action='dispute_opened' then 'DISPUTE_OPENED' else 'PARTIAL_REFUND_REVIEW' end
    );
    v_credit_state := private.set_credit_source_state_v205(
      v_subject,v_root_hash,p_product_key,'frozen',p_occurred_at,p_event_key,v_transaction_id,
      case when p_action='dispute_opened' then 'DISPUTE_OPENED' else 'PARTIAL_REFUND_REVIEW' end
    );
    insert into private.credit_accounts_v205(subject_hash,review_status,spending_frozen)
    values(v_subject,'review_required',true)
    on conflict(subject_hash) do update set review_status='review_required',spending_frozen=true,updated_at=clock_timestamp();
  elsif p_action='dispute_won' then
    v_claim_source_hash := case when v_product.product_kind='ai_subscription' and v_subscription_hash is not null
      then v_subscription_hash else v_root_hash end;
    v_changed := private.apply_product_claims_v205(
      v_subject,p_provider,p_provider_environment,v_claim_source_hash,p_product_key,'active',
      coalesce(p_period_start,p_occurred_at),p_period_end,p_occurred_at,p_event_key,
      v_transaction_id,'DISPUTE_WON'
    );
    v_credit_state := private.set_credit_source_state_v205(
      v_subject,v_root_hash,p_product_key,'active',p_occurred_at,p_event_key,v_transaction_id,'DISPUTE_WON'
    );
  end if;

  perform private.ensure_skin_preference_v205(p_user_id,v_subject);
  update private.provider_transactions_v205
     set outcome=case when p_action='no_effect' then 'ignored'
       when v_lot->>'status'='held' then 'held' else 'applied' end
   where id=v_transaction_id and outcome='pending';
  update private.provider_events_v205
     set processing_status=case when p_action='no_effect' then 'ignored' else 'processed' end,
         processed_at=clock_timestamp(),error_code=null
   where id=v_event.id;
  return pg_catalog.jsonb_build_object(
    'ok',true,'release','V205','duplicate',false,'effectApplied',p_action<>'no_effect',
    'eventId',v_event.id,'transactionId',v_transaction_id,'claimsChanged',v_changed,
    'creditLot',v_lot,'creditState',v_credit_state
  );
exception when others then
  -- A raised exception rolls back the complete provider effect. The signed event can be replayed safely.
  raise;
end;
$$;

create or replace function private.ledger_snapshot_for_subject_v205(p_subject_hash text)
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare
  v_now timestamptz := now();
  v_premium boolean;
  v_orbe boolean;
  v_monthly integer;
  v_extra integer;
  v_held integer;
  v_debt integer;
  v_frozen boolean;
  v_skins jsonb;
  v_catalog jsonb;
  v_orders jsonb;
  v_receipts jsonb;
  v_subscriptions jsonb;
  v_head jsonb;
begin
  v_premium := private.asset_active_v205(p_subject_hash,'premium:lifetime',v_now);
  v_orbe := private.is_orbe_active_v205(p_subject_hash,v_now);
  select
    coalesce(pg_catalog.sum(remaining_credits) filter(
      where lot_type='monthly' and status='active' and expires_at>v_now
    ),0)::integer,
    coalesce(pg_catalog.sum(remaining_credits) filter(
      where lot_type in ('extra','manual','reversal') and status in ('active','frozen')
        and (expires_at is null or expires_at>v_now)
    ),0)::integer,
    coalesce(pg_catalog.sum(remaining_credits) filter(
      where status='held' and (expires_at is null or expires_at>v_now)
    ),0)::integer
    into v_monthly,v_extra,v_held
    from private.credit_lots_v205 where subject_hash=p_subject_hash;
  select coalesce(debt_credits,0),coalesce(spending_frozen,false)
    into v_debt,v_frozen from private.credit_accounts_v205 where subject_hash=p_subject_hash;
  v_debt := coalesce(v_debt,0);
  v_frozen := coalesce(v_frozen,false);

  select coalesce(pg_catalog.jsonb_agg(pg_catalog.substr(a.asset_key,6) order by a.sort_order),'[]'::jsonb)
    into v_skins from private.ledger_assets_v205 a
   where a.asset_kind='skin' and a.active=true and private.asset_active_v205(p_subject_hash,a.asset_key,v_now);
  select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
    'productKey',p.product_key,'kind',p.product_kind,'name',p.display_name,
    'priceCents',p.amount_brl_cents,'billingMode',p.billing_mode,'credits',p.credits,
    'catalogVersion',p.catalog_version
  ) order by p.amount_brl_cents,p.product_key),'[]'::jsonb)
    into v_catalog from private.ledger_products_v205 p where p.active=true;
  select coalesce(pg_catalog.jsonb_agg(row_value order by created_at desc),'[]'::jsonb)
    into v_orders from (
      select o.created_at,pg_catalog.jsonb_build_object(
        'id',o.id,'productKey',o.product_key,'name',p.display_name,'priceCents',o.amount_brl_cents,
        'status',o.status,'platform',case o.provider when 'stripe' then 'web' when 'google_play' then 'android' else 'ios' end,
        'provider',o.provider || '_' || o.provider_environment,'createdAt',o.created_at,'updatedAt',o.updated_at,
        'receiptCode',o.receipt_code
      ) as row_value
      from private.commerce_orders_v205 o
      join private.ledger_products_v205 p on p.product_key=o.product_key
      where o.subject_hash=p_subject_hash order by o.created_at desc limit 100
    ) rows;
  select coalesce(pg_catalog.jsonb_agg(row_value order by created_at desc),'[]'::jsonb)
    into v_receipts from (
      select o.created_at,pg_catalog.jsonb_build_object(
        'purchaseId',o.id,'code',o.receipt_code,'productKey',o.product_key,'name',p.display_name,
        'amountCents',o.amount_brl_cents,'status',o.status,'issuedAt',o.created_at,
        'refundedAt',case when o.status in ('refunded','charged_back') then o.updated_at else null end,
        'revokedAt',case when o.status='charged_back' then o.updated_at else null end
      ) as row_value
      from private.commerce_orders_v205 o
      join private.ledger_products_v205 p on p.product_key=o.product_key
      where o.subject_hash=p_subject_hash order by o.created_at desc limit 100
    ) rows;
  select coalesce(pg_catalog.jsonb_agg(row_value order by created_at desc),'[]'::jsonb)
    into v_subscriptions from (
      select s.created_at,pg_catalog.jsonb_build_object(
        'id',s.id,'productKey',s.product_key,'status',s.status,
        'currentPeriodStart',s.current_period_start,'currentPeriodEnd',s.current_period_end,
        'cancelAtPeriodEnd',s.cancel_at_period_end,'canceledAt',case when s.status in ('cancelled','expired') then s.updated_at else null end,
        'provider',s.provider || '_' || s.provider_environment
      ) as row_value
      from private.ledger_subscriptions_v205 s
      where s.subject_hash=p_subject_hash order by s.created_at desc limit 20
    ) rows;
  select pg_catalog.jsonb_build_object('sequence',h.last_sequence,'hash',h.last_entry_hash)
    into v_head from private.entitlement_ledger_heads_v205 h where h.subject_hash=p_subject_hash;
  return pg_catalog.jsonb_build_object(
    'release','V205','environment','staging','mode','universal-ledger','authenticated',true,
    'catalog',v_catalog,
    'entitlements',pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object('key','premium_lifetime','status',case when v_premium then 'active' else 'unknown' end),
      pg_catalog.jsonb_build_object('key','orbe_ai_monthly','status',case when v_orbe then 'active' else 'unknown' end)
    ),
    'premiumActive',v_premium,'orbeAiActive',v_orbe,'skinIds',v_skins,
    'purchases',v_orders,'receipts',v_receipts,'subscriptions',v_subscriptions,
    'wallet',pg_catalog.jsonb_build_object(
      'monthlyCredits',v_monthly,'extraCredits',v_extra,'heldCredits',v_held,'demoCredits',0,
      'totalCredits',v_monthly+v_extra,'recordedCredits',v_monthly+v_extra+v_held,
      'availableCredits',case when v_orbe and not v_frozen then v_monthly+v_extra else 0 end,
      'debtCredits',v_debt,'locked',not v_orbe or v_frozen
    ),
    'ledgerHead',coalesce(v_head,pg_catalog.jsonb_build_object('sequence',0,'hash',repeat('0',64))),
    'gates',pg_catalog.jsonb_build_object(
      'realBilling',false,'production',false,'sol',false,
      'clientCanGrant',false,'restoreRequiresProvider',true
    ),
    'disclosure',pg_catalog.jsonb_build_object(
      'premiumIncludesAI',false,'premiumIncludesAllSkins',true,'serverAuthority',true,
      'monthlyCreditsExpire',true,'extraCreditsRequireActiveSubscription',true
    )
  );
end;
$$;

create or replace function public.ledger_entitlement_snapshot_v205()
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_session_id uuid := nullif((select auth.jwt()->>'session_id'),'')::uuid;
begin
  if not private.is_active_account_session(v_user_id,v_session_id) then
    raise exception using errcode='42501',message='V205_ACTIVE_SESSION_REQUIRED';
  end if;
  return private.ledger_snapshot_for_subject_v205(private.subject_hash_v205(v_user_id));
end;
$$;

create or replace function public.ledger_consume_credits_v205(
  p_user_id uuid,p_request_id uuid,p_mode text,p_purpose_sha256 text default null
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_subject text := private.subject_hash_v205(p_user_id);
  v_cost integer;
  v_available integer;
  v_remaining integer;
  v_take integer;
  v_lot private.credit_lots_v205%rowtype;
  v_spend private.credit_spends_v205%rowtype;
begin
  if p_mode not in ('luna','terra') or (p_purpose_sha256 is not null and p_purpose_sha256 !~ '^[a-f0-9]{64}$') then
    raise exception using errcode='22023',message='V205_INVALID_CREDIT_CONSUMPTION';
  end if;
  v_cost := case p_mode when 'luna' then 1 else 10 end;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_subject,0));
  select * into v_spend from private.credit_spends_v205 where request_id=p_request_id for update;
  if v_spend.id is not null then
    if v_spend.subject_hash<>v_subject or v_spend.mode<>p_mode then
      raise exception using errcode='22023',message='V205_IDEMPOTENCY_CONFLICT';
    end if;
    return pg_catalog.jsonb_build_object('ok',true,'release','V205','duplicate',true,'spendId',v_spend.id,'spentCredits',v_spend.spent_credits);
  end if;
  insert into private.credit_accounts_v205(subject_hash) values(v_subject)
  on conflict(subject_hash) do nothing;
  perform 1 from private.credit_accounts_v205 where subject_hash=v_subject for update;
  if not private.is_orbe_active_v205(v_subject,now()) then
    raise exception using errcode='P0001',message='V205_ORBE_SUBSCRIPTION_REQUIRED';
  end if;
  update private.credit_lots_v205
     set status='expired',remaining_credits=0,updated_at=clock_timestamp()
   where subject_hash=v_subject and status in ('active','held','frozen')
     and expires_at is not null and expires_at<=now();
  select coalesce(pg_catalog.sum(remaining_credits),0)::integer into v_available
    from private.credit_lots_v205
   where subject_hash=v_subject and status='active' and (expires_at is null or expires_at>now());
  if v_available<v_cost then
    raise exception using errcode='P0001',message='V205_INSUFFICIENT_CREDITS';
  end if;
  insert into private.credit_spends_v205(subject_hash,request_id,mode,spent_credits,status,purpose_hash)
  values(v_subject,p_request_id,p_mode,v_cost,'committed',p_purpose_sha256)
  returning * into v_spend;
  v_remaining := v_cost;
  for v_lot in
    select * from private.credit_lots_v205
     where subject_hash=v_subject and status='active' and remaining_credits>0
       and (expires_at is null or expires_at>now())
     order by case when lot_type='monthly' then 0 else 1 end,expires_at nulls last,created_at,id
     for update
  loop
    exit when v_remaining=0;
    v_take := least(v_remaining,v_lot.remaining_credits);
    update private.credit_lots_v205
       set remaining_credits=remaining_credits-v_take,updated_at=clock_timestamp()
     where id=v_lot.id;
    insert into private.credit_allocations_v205(spend_id,lot_id,credits)
    values(v_spend.id,v_lot.id,v_take);
    v_remaining := v_remaining-v_take;
  end loop;
  if v_remaining<>0 then raise exception 'V205_CREDIT_ALLOCATION_INVARIANT'; end if;
  perform private.append_entitlement_ledger_v205(
    v_subject,'credit_spend','credit:orbe_ai',-v_cost,'ORBE_AI_USAGE',null,
    pg_catalog.jsonb_build_object('requestId',p_request_id,'mode',p_mode,'spentCredits',v_cost)
  );
  return pg_catalog.jsonb_build_object(
    'ok',true,'release','V205','duplicate',false,'spendId',v_spend.id,'spentCredits',v_cost,
    'remainingCredits',v_available-v_cost
  );
end;
$$;

create or replace function public.ledger_reverse_credit_spend_v205(
  p_user_id uuid,p_reversal_request_id uuid,p_original_request_id uuid,p_reason_code text
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_subject text := private.subject_hash_v205(p_user_id);
  v_spend private.credit_spends_v205%rowtype;
  v_allocation record;
  v_compensation integer := 0;
  v_restored integer := 0;
  v_reference_hash text;
begin
  if p_reason_code !~ '^[A-Z0-9_]{3,80}$' then
    raise exception using errcode='22023',message='V205_INVALID_REVERSAL_REASON';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_subject,0));
  select * into v_spend from private.credit_spends_v205
   where request_id=p_original_request_id and subject_hash=v_subject for update;
  if v_spend.id is null then raise exception using errcode='P0001',message='V205_SPEND_NOT_FOUND'; end if;
  if v_spend.status='reversed' then
    if v_spend.reversal_request_id=p_reversal_request_id then
      return pg_catalog.jsonb_build_object('ok',true,'release','V205','duplicate',true,'restoredCredits',v_spend.spent_credits);
    end if;
    raise exception using errcode='22023',message='V205_ALREADY_REVERSED';
  end if;
  for v_allocation in
    select a.*,l.status as lot_status,l.expires_at,l.subject_hash,l.debt_credits
      from private.credit_allocations_v205 a
      join private.credit_lots_v205 l on l.id=a.lot_id
     where a.spend_id=v_spend.id order by l.created_at for update of l,a
  loop
    if v_allocation.lot_status in ('active','frozen','held')
       and (v_allocation.expires_at is null or v_allocation.expires_at>now()) then
      update private.credit_lots_v205
         set remaining_credits=remaining_credits+(v_allocation.credits-v_allocation.restored_credits),
             updated_at=clock_timestamp()
       where id=v_allocation.lot_id;
      v_restored := v_restored+(v_allocation.credits-v_allocation.restored_credits);
    elsif v_allocation.lot_status='revoked' then
      update private.credit_lots_v205
         set debt_credits=greatest(0,debt_credits-(v_allocation.credits-v_allocation.restored_credits)),
             updated_at=clock_timestamp()
       where id=v_allocation.lot_id;
      update private.credit_accounts_v205
         set debt_credits=greatest(0,debt_credits-(v_allocation.credits-v_allocation.restored_credits)),
             updated_at=clock_timestamp()
       where subject_hash=v_subject;
    else
      v_compensation := v_compensation+(v_allocation.credits-v_allocation.restored_credits);
    end if;
    update private.credit_allocations_v205 set restored_credits=credits
     where spend_id=v_allocation.spend_id and lot_id=v_allocation.lot_id;
  end loop;
  if v_compensation>0 then
    v_reference_hash := private.reference_hash_v205('manual','staging','reversal:'||p_reversal_request_id::text);
    perform private.grant_credit_lot_v205(
      v_subject,v_reference_hash,'manual_credit_adjustment','reversal',v_compensation,null,now(),
      'reversal:'||p_reversal_request_id::text,null,p_reason_code
    );
    v_restored := v_restored+v_compensation;
  end if;
  update private.credit_spends_v205
     set status='reversed',reversal_request_id=p_reversal_request_id,reversed_at=clock_timestamp()
   where id=v_spend.id;
  update private.credit_accounts_v205
     set review_status=case when debt_credits=0 then 'normal' else review_status end,
         spending_frozen=case when debt_credits=0 then false else spending_frozen end,
         updated_at=clock_timestamp()
   where subject_hash=v_subject;
  perform private.append_entitlement_ledger_v205(
    v_subject,'credit_restore','credit:orbe_ai',v_restored,p_reason_code,null,
    pg_catalog.jsonb_build_object('reversalRequestId',p_reversal_request_id,'originalRequestId',p_original_request_id)
  );
  return pg_catalog.jsonb_build_object('ok',true,'release','V205','duplicate',false,'restoredCredits',v_restored);
end;
$$;

create or replace function public.ledger_expire_due_v205(p_batch integer default 500)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_claim record; v_lot record; v_claims integer := 0; v_lots integer := 0;
begin
  if p_batch<1 or p_batch>2000 then raise exception using errcode='22023',message='V205_INVALID_BATCH'; end if;
  for v_claim in
    select id,subject_hash,asset_key from private.entitlement_claims_v205
     where status='active' and ends_at is not null and ends_at<=now()
     order by ends_at,id limit p_batch for update skip locked
  loop
    update private.entitlement_claims_v205 set status='expired',updated_at=clock_timestamp() where id=v_claim.id;
    perform private.append_entitlement_ledger_v205(
      v_claim.subject_hash,'expire',v_claim.asset_key,-1,'ENTITLEMENT_EXPIRED',null,
      pg_catalog.jsonb_build_object('claimId',v_claim.id)
    );
    v_claims := v_claims+1;
  end loop;
  for v_lot in
    select id,subject_hash,remaining_credits from private.credit_lots_v205
     where status in ('active','held','frozen') and expires_at is not null and expires_at<=now()
     order by expires_at,id limit p_batch for update skip locked
  loop
    update private.credit_lots_v205 set status='expired',remaining_credits=0,updated_at=clock_timestamp() where id=v_lot.id;
    if v_lot.remaining_credits>0 then
      perform private.append_entitlement_ledger_v205(
        v_lot.subject_hash,'credit_revoke','credit:orbe_ai',-v_lot.remaining_credits,'CREDIT_CYCLE_EXPIRED',null,
        pg_catalog.jsonb_build_object('lotId',v_lot.id)
      );
    end if;
    v_lots := v_lots+1;
  end loop;
  return pg_catalog.jsonb_build_object('ok',true,'release','V205','expiredClaims',v_claims,'expiredLots',v_lots);
end;
$$;

create or replace function public.ledger_admin_adjust_v205(
  p_actor_user_id uuid,p_target_user_id uuid,p_request_id uuid,p_action text,
  p_asset_key text,p_quantity integer,p_expires_at timestamptz,p_reason_code text,
  p_note_sha256 text default null
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_gate private.ledger_gate_v205%rowtype;
  v_actor text := private.subject_hash_v205(p_actor_user_id);
  v_target text := private.subject_hash_v205(p_target_user_id);
  v_existing private.manual_adjustments_v205%rowtype;
  v_override_state text;
  v_outcome text := 'applied';
  v_remaining integer;
  v_take integer;
  v_lot private.credit_lots_v205%rowtype;
  v_reference_hash text;
begin
  if not exists(select 1 from public.admin_owners o where o.user_id=p_actor_user_id and o.active=true) then
    raise exception using errcode='42501',message='V205_OWNER_REQUIRED';
  end if;
  select * into v_gate from private.ledger_gate_v205 where environment='staging';
  if not v_gate.manual_adjustments_enabled then
    raise exception using errcode='P0001',message='V205_MANUAL_ADJUSTMENTS_LOCKED';
  end if;
  if p_action not in ('temporary_grant','temporary_freeze','temporary_revoke','clear_override','grant_credits','remove_credits')
     or p_reason_code !~ '^[A-Z0-9_]{3,80}$'
     or (p_note_sha256 is not null and p_note_sha256 !~ '^[a-f0-9]{64}$') then
    raise exception using errcode='22023',message='V205_INVALID_MANUAL_ADJUSTMENT';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_request_id::text,1));
  select * into v_existing from private.manual_adjustments_v205 where request_id=p_request_id;
  if v_existing.request_id is not null then
    if v_existing.actor_hash<>v_actor or v_existing.target_hash<>v_target or v_existing.action<>p_action then
      raise exception using errcode='22023',message='V205_IDEMPOTENCY_CONFLICT';
    end if;
    return pg_catalog.jsonb_build_object('ok',true,'release','V205','duplicate',true,'outcome',v_existing.outcome);
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_target,0));
  if p_action in ('temporary_grant','temporary_freeze','temporary_revoke') then
    if p_asset_key is null or not exists(select 1 from private.ledger_assets_v205 where asset_key=p_asset_key and active=true)
       or p_expires_at is null or p_expires_at<=now() or p_expires_at>now()+interval '366 days' then
      raise exception using errcode='22023',message='V205_BOUNDED_OVERRIDE_REQUIRED';
    end if;
    v_override_state := case p_action when 'temporary_grant' then 'granted' when 'temporary_freeze' then 'frozen' else 'revoked' end;
    insert into private.manual_entitlement_overrides_v205(
      subject_hash,asset_key,override_state,expires_at,source_request_id,actor_hash,reason_code
    ) values(v_target,p_asset_key,v_override_state,p_expires_at,p_request_id,v_actor,p_reason_code)
    on conflict(subject_hash,asset_key) do update set
      override_state=excluded.override_state,expires_at=excluded.expires_at,
      source_request_id=excluded.source_request_id,actor_hash=excluded.actor_hash,
      reason_code=excluded.reason_code,updated_at=clock_timestamp();
    perform private.append_entitlement_ledger_v205(
      v_target,case p_action when 'temporary_grant' then 'manual_grant' when 'temporary_freeze' then 'manual_freeze' else 'manual_revoke' end,
      p_asset_key,case when p_action='temporary_grant' then 1 else 0 end,p_reason_code,null,
      pg_catalog.jsonb_build_object('requestId',p_request_id,'expiresAt',p_expires_at)
    );
  elsif p_action='clear_override' then
    if p_asset_key is null then raise exception using errcode='22023',message='V205_ASSET_REQUIRED'; end if;
    delete from private.manual_entitlement_overrides_v205 where subject_hash=v_target and asset_key=p_asset_key;
    v_outcome := case when found then 'cleared' else 'no_effect' end;
    perform private.append_entitlement_ledger_v205(
      v_target,'manual_clear',p_asset_key,0,p_reason_code,null,
      pg_catalog.jsonb_build_object('requestId',p_request_id)
    );
  elsif p_action='grant_credits' then
    if p_quantity is null or p_quantity not between 1 and 10000
       or p_expires_at is null or p_expires_at<=now() or p_expires_at>now()+interval '366 days' then
      raise exception using errcode='22023',message='V205_BOUNDED_CREDIT_GRANT_REQUIRED';
    end if;
    v_reference_hash := private.reference_hash_v205('manual','staging','manual:'||p_request_id::text);
    perform private.grant_credit_lot_v205(
      v_target,v_reference_hash,'manual_credit_adjustment','manual',p_quantity,p_expires_at,
      now(),'manual:'||p_request_id::text,null,p_reason_code
    );
  else
    if p_quantity is null or p_quantity not between 1 and 10000 then
      raise exception using errcode='22023',message='V205_CREDIT_QUANTITY_REQUIRED';
    end if;
    select coalesce(pg_catalog.sum(remaining_credits),0)::integer into v_remaining
      from private.credit_lots_v205
     where subject_hash=v_target and status in ('active','held','frozen')
       and (expires_at is null or expires_at>now());
    if v_remaining<p_quantity then raise exception using errcode='P0001',message='V205_MANUAL_NEGATIVE_CREDIT_FORBIDDEN'; end if;
    v_remaining := p_quantity;
    for v_lot in
      select * from private.credit_lots_v205
       where subject_hash=v_target and status in ('active','held','frozen') and remaining_credits>0
         and (expires_at is null or expires_at>now())
       order by case when lot_type='monthly' then 0 else 1 end,expires_at nulls last,created_at
       for update
    loop
      exit when v_remaining=0;
      v_take := least(v_remaining,v_lot.remaining_credits);
      update private.credit_lots_v205 set remaining_credits=remaining_credits-v_take,updated_at=clock_timestamp()
       where id=v_lot.id;
      v_remaining := v_remaining-v_take;
    end loop;
    perform private.append_entitlement_ledger_v205(
      v_target,'credit_revoke','credit:orbe_ai',-p_quantity,p_reason_code,null,
      pg_catalog.jsonb_build_object('requestId',p_request_id,'manual',true)
    );
  end if;
  perform private.ensure_skin_preference_v205(p_target_user_id,v_target);
  insert into private.manual_adjustments_v205(
    request_id,actor_hash,target_hash,action,asset_key,quantity,expires_at,
    reason_code,note_sha256,outcome
  ) values(
    p_request_id,v_actor,v_target,p_action,
    case when p_action in ('grant_credits','remove_credits') then 'credit:orbe_ai' else p_asset_key end,
    p_quantity,p_expires_at,p_reason_code,p_note_sha256,v_outcome
  );
  return pg_catalog.jsonb_build_object('ok',true,'release','V205','duplicate',false,'outcome',v_outcome);
end;
$$;

create or replace function public.ledger_reconciliation_snapshot_v205(
  p_scope_key text,p_provider text,p_provider_environment text,p_provider_transactions integer
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_local integer; v_duplicates integer; v_ghosts integer; v_hash_errors integer; v_open integer; v_id uuid;
begin
  if p_scope_key !~ '^[a-z0-9_.:-]{3,120}$' or p_provider not in ('stripe','google_play','apple_store','universal')
     or p_provider_environment not in ('test','sandbox','staging') or p_provider_transactions<0 then
    raise exception using errcode='22023',message='V205_INVALID_RECONCILIATION';
  end if;
  select count(*)::integer into v_local
    from private.provider_transactions_v205 t
    join private.provider_events_v205 e on e.id=t.provider_event_id
   where (p_provider='universal' or t.provider=p_provider)
     and (p_provider_environment='staging' or t.provider_environment=p_provider_environment)
     and e.event_type not like 'restore.%';
  select count(*)::integer into v_duplicates from (
    select source_key from private.credit_lots_v205 group by source_key having count(*)>1
  ) duplicate_lots;
  select count(*)::integer into v_ghosts
    from private.entitlement_claims_v205 c
   where c.status='active' and c.provider not in ('manual','migration')
     and (c.source_transaction_id is null or not exists(
       select 1 from private.provider_transactions_v205 t
        where t.id=c.source_transaction_id and t.outcome in ('applied','held')
     ));
  select count(*)::integer into v_hash_errors from (
    select previous_hash,coalesce(
      pg_catalog.lag(entry_hash) over(partition by subject_hash order by sequence),repeat('0',64)
    ) as expected from private.entitlement_ledger_v205
  ) chain where previous_hash<>expected;
  select (
    (select count(*) from private.provider_events_v205 where processing_status in ('received','processing','review_required','failed'))
    +(select count(*) from private.credit_accounts_v205 where review_status<>'normal' or spending_frozen)
  )::integer into v_open;
  insert into private.ledger_reconciliation_v205(
    scope_key,provider,provider_environment,provider_transactions,local_transactions,
    duplicate_credit_effects,ghost_entitlements,hash_chain_errors,open_review_items,evidence
  ) values(
    p_scope_key,p_provider,p_provider_environment,p_provider_transactions,v_local,
    v_duplicates,v_ghosts,v_hash_errors,v_open,
    pg_catalog.jsonb_build_object('release','V205','fullPayloadStored',false,'clientCanGrant',false)
  ) returning id into v_id;
  return pg_catalog.jsonb_build_object(
    'id',v_id,'release','V205','providerTransactions',p_provider_transactions,'localTransactions',v_local,
    'transactionDifference',p_provider_transactions-v_local,'duplicateCreditEffects',v_duplicates,
    'ghostEntitlements',v_ghosts,'hashChainErrors',v_hash_errors,'openReviewItems',v_open,
    'zero',p_provider_transactions=v_local and v_duplicates=0 and v_ghosts=0 and v_hash_errors=0 and v_open=0
  );
end;
$$;

create or replace function public.ledger_gate_state_v205()
returns jsonb language sql stable security definer set search_path=''
as $$
  select pg_catalog.jsonb_build_object(
    'release','V205','environment',g.environment,'catalogVersion',g.catalog_version,
    'ledgerProcessingEnabled',g.ledger_processing_enabled,'restoreEnabled',g.restore_enabled,
    'manualAdjustmentsEnabled',g.manual_adjustments_enabled,'stripeTestEnabled',g.stripe_test_enabled,
    'testCatalogProvisioningEnabled',g.test_catalog_provisioning_enabled,
    'testCheckoutEnabled',g.test_checkout_enabled,
    'googlePlaySandboxEnabled',g.google_play_sandbox_enabled,'appleStoreSandboxEnabled',g.apple_store_sandbox_enabled,
    'liveBillingEnabled',false,'productionEnabled',false,'solEnabled',false
  ) from private.ledger_gate_v205 g where g.environment='staging';
$$;

create or replace function private.enforce_skin_preference_v205()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_slug text; v_subject text;
begin
  select slug into v_slug from public.orb_skins where id=new.equipped_skin_id and status='published';
  if v_slug is null then raise exception using errcode='23514',message='V205_SKIN_NOT_PUBLISHED'; end if;
  if v_slug='classic' then return new; end if;
  v_subject := private.subject_hash_v205(new.user_id);
  if not private.asset_active_v205(v_subject,'skin:'||v_slug,now()) then
    raise exception using errcode='42501',message='V205_SKIN_NOT_OWNED';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_skin_preference_v205 on public.orb_skin_preferences;
create trigger enforce_skin_preference_v205
before insert or update of equipped_skin_id on public.orb_skin_preferences
for each row execute function private.enforce_skin_preference_v205();

create or replace function private.prevent_v205_history_mutation()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  raise exception using errcode='55000',message='V205_IMMUTABLE_HISTORY';
end;
$$;

drop trigger if exists entitlement_ledger_v205_immutable on private.entitlement_ledger_v205;
create trigger entitlement_ledger_v205_immutable before update or delete on private.entitlement_ledger_v205
for each row execute function private.prevent_v205_history_mutation();
drop trigger if exists manual_adjustments_v205_immutable on private.manual_adjustments_v205;
create trigger manual_adjustments_v205_immutable before update or delete on private.manual_adjustments_v205
for each row execute function private.prevent_v205_history_mutation();
drop trigger if exists reconciliation_v205_immutable on private.ledger_reconciliation_v205;
create trigger reconciliation_v205_immutable before update or delete on private.ledger_reconciliation_v205
for each row execute function private.prevent_v205_history_mutation();

create or replace function private.protect_provider_transaction_v205()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if tg_op='UPDATE' and old.outcome='pending' and new.outcome in ('applied','duplicate','ignored','held','review_required','failed')
     and (pg_catalog.to_jsonb(new)-'outcome')=(pg_catalog.to_jsonb(old)-'outcome') then
    return new;
  end if;
  raise exception using errcode='55000',message='V205_IMMUTABLE_PROVIDER_TRANSACTION';
end;
$$;

drop trigger if exists provider_transactions_v205_protected on private.provider_transactions_v205;
create trigger provider_transactions_v205_protected before update or delete on private.provider_transactions_v205
for each row execute function private.protect_provider_transaction_v205();

create or replace function private.protect_credit_spend_v205()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if tg_op='UPDATE' and old.status='committed' and new.status='reversed'
     and old.reversal_request_id is null and new.reversal_request_id is not null
     and new.reversed_at is not null
     and (pg_catalog.to_jsonb(new)-array['status','reversal_request_id','reversed_at'])
       =(pg_catalog.to_jsonb(old)-array['status','reversal_request_id','reversed_at']) then
    return new;
  end if;
  raise exception using errcode='55000',message='V205_IMMUTABLE_CREDIT_SPEND';
end;
$$;

drop trigger if exists credit_spends_v205_protected on private.credit_spends_v205;
create trigger credit_spends_v205_protected before update or delete on private.credit_spends_v205
for each row execute function private.protect_credit_spend_v205();

do $$
declare fn text;
begin
  foreach fn in array array[
    'private.subject_hash_v205(uuid)',
    'private.reference_hash_v205(text,text,text)',
    'private.assert_safe_ledger_metadata_v205(jsonb)',
    'private.append_entitlement_ledger_v205(text,text,text,integer,text,uuid,jsonb)',
    'private.asset_active_v205(text,text,timestamptz)',
    'private.upsert_entitlement_claim_v205(text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,uuid,text)',
    'private.ensure_skin_preference_v205(uuid,text)',
    'private.is_orbe_active_v205(text,timestamptz)',
    'private.apply_product_claims_v205(text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,uuid,text)',
    'private.grant_credit_lot_v205(text,text,text,text,integer,timestamptz,timestamptz,text,uuid,text)',
    'private.set_credit_source_state_v205(text,text,text,text,timestamptz,text,uuid,text)',
    'private.ledger_snapshot_for_subject_v205(text)',
    'private.enforce_skin_preference_v205()',
    'private.prevent_v205_history_mutation()',
    'private.protect_provider_transaction_v205()',
    'private.protect_credit_spend_v205()'
  ] loop
    execute pg_catalog.format('revoke all on function %s from public,anon,authenticated',fn);
    execute pg_catalog.format('grant execute on function %s to service_role',fn);
  end loop;
end $$;

revoke all on function public.ledger_entitlement_snapshot_v205() from public,anon;
grant execute on function public.ledger_entitlement_snapshot_v205() to authenticated;
revoke all on function public.ledger_checkout_eligibility_v205(text) from public,anon;
grant execute on function public.ledger_checkout_eligibility_v205(text) to authenticated;

do $$
declare fn text;
begin
  foreach fn in array array[
    'public.ledger_apply_provider_event_v205(text,text,text,text,text,uuid,text,text,text,text,text,integer,text,timestamptz,timestamptz,timestamptz,boolean,jsonb)',
    'public.ledger_catalog_pending_v205()',
    'public.ledger_catalog_register_v205(text,text,text)',
    'public.ledger_catalog_lookup_v205(text)',
    'public.ledger_customer_lookup_v205(uuid)',
    'public.ledger_customer_upsert_v205(uuid,text)',
    'public.ledger_checkout_record_v205(uuid,text,text,text,text,text,timestamptz)',
    'public.ledger_consume_credits_v205(uuid,uuid,text,text)',
    'public.ledger_reverse_credit_spend_v205(uuid,uuid,uuid,text)',
    'public.ledger_expire_due_v205(integer)',
    'public.ledger_admin_adjust_v205(uuid,uuid,uuid,text,text,integer,timestamptz,text,text)',
    'public.ledger_reconciliation_snapshot_v205(text,text,text,integer)',
    'public.ledger_gate_state_v205()'
  ] loop
    execute pg_catalog.format('revoke all on function %s from public,anon,authenticated',fn);
    execute pg_catalog.format('grant execute on function %s to service_role',fn);
  end loop;
end $$;

comment on table private.provider_events_v205 is 'V205 signed-event receipt without full provider payload or PII.';
comment on table private.entitlement_ledger_v205 is 'V205 append-only, per-subject hash-chained entitlement and credit history.';
comment on function public.ledger_entitlement_snapshot_v205() is 'Read-only entitlement snapshot bound to auth.uid and the active V201 session.';
comment on function public.ledger_apply_provider_event_v205(text,text,text,text,text,uuid,text,text,text,text,text,integer,text,timestamptz,timestamptz,timestamptz,boolean,jsonb)
  is 'Service-role-only atomic provider event processor. Never callable by a browser.';

commit;

insert into private.ledger_product_grants_v205(product_key,asset_key,quantity,grant_kind) values
  ('skin_lunar','skin:lunar',1,'right'),('skin_solar','skin:solar',1,'right'),
  ('skin_ocean','skin:ocean',1,'right'),('skin_emerald','skin:emerald',1,'right'),
  ('skin_fire','skin:fire',1,'right'),('skin_cosmic','skin:cosmic',1,'right'),
  ('skin_eclipse','skin:eclipse',1,'right'),('skin_venus','skin:venus',1,'right'),
  ('skin_amethyst','skin:amethyst',1,'right'),('skin_sapphire','skin:sapphire',1,'right'),
  ('skin_ruby','skin:ruby',1,'right'),('skin_aurora','skin:aurora',1,'right'),
  ('skin_storm','skin:storm',1,'right'),('skin_fairy','skin:fairy',1,'right'),
  ('skin_isis','skin:isis',1,'right'),('skin_twin_flame','skin:twin-flame',1,'right'),
  ('skin_realities','skin:realities',1,'right'),('skin_queen','skin:queen',1,'right'),
  ('skin_supreme','skin:supreme',1,'right'),('skin_moon_silver','skin:moon-silver',1,'right'),
  ('skin_solstice','skin:solstice',1,'right'),('skin_neptune','skin:neptune',1,'right'),
  ('skin_enchanted_forest','skin:enchanted-forest',1,'right'),
  ('skin_cosmic_dragon','skin:cosmic-dragon',1,'right'),('skin_lunar_rose','skin:lunar-rose',1,'right'),
  ('skin_saturn_crystal','skin:saturn-crystal',1,'right'),
  ('skin_violet_phoenix','skin:violet-phoenix',1,'right'),
  ('skin_celestial_oracle','skin:celestial-oracle',1,'right'),
  ('skin_star_crown','skin:star-crown',1,'right'),
  ('skin_pack_constelacao_lunar','skin:lunar',1,'right'),
  ('skin_pack_constelacao_lunar','skin:eclipse',1,'right'),
  ('skin_pack_constelacao_lunar','skin:venus',1,'right'),
  ('skin_pack_constelacao_lunar','skin:isis',1,'right'),
  ('skin_pack_constelacao_lunar','skin:moon-silver',1,'right'),
  ('skin_pack_constelacao_lunar','skin:lunar-rose',1,'right'),
  ('skin_pack_portais_elementais','skin:solar',1,'right'),
  ('skin_pack_portais_elementais','skin:ocean',1,'right'),
  ('skin_pack_portais_elementais','skin:emerald',1,'right'),
  ('skin_pack_portais_elementais','skin:fire',1,'right'),
  ('skin_pack_portais_elementais','skin:ruby',1,'right'),
  ('skin_pack_portais_elementais','skin:storm',1,'right'),
  ('skin_pack_portais_elementais','skin:solstice',1,'right'),
  ('skin_pack_portais_elementais','skin:neptune',1,'right'),
  ('skin_pack_portais_elementais','skin:enchanted-forest',1,'right'),
  ('skin_pack_coroa_suprema','skin:cosmic',1,'right'),
  ('skin_pack_coroa_suprema','skin:amethyst',1,'right'),
  ('skin_pack_coroa_suprema','skin:sapphire',1,'right'),
  ('skin_pack_coroa_suprema','skin:aurora',1,'right'),
  ('skin_pack_coroa_suprema','skin:fairy',1,'right'),
  ('skin_pack_coroa_suprema','skin:twin-flame',1,'right'),
  ('skin_pack_coroa_suprema','skin:realities',1,'right'),
  ('skin_pack_coroa_suprema','skin:queen',1,'right'),
  ('skin_pack_coroa_suprema','skin:supreme',1,'right'),
  ('skin_pack_coroa_suprema','skin:cosmic-dragon',1,'right'),
  ('skin_pack_coroa_suprema','skin:saturn-crystal',1,'right'),
  ('skin_pack_coroa_suprema','skin:violet-phoenix',1,'right'),
  ('skin_pack_coroa_suprema','skin:celestial-oracle',1,'right'),
  ('skin_pack_coroa_suprema','skin:star-crown',1,'right')
on conflict(product_key,asset_key) do update set quantity=1,grant_kind='right';
