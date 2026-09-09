-- DIVINA BRUXA — V191 · PREMIUM, 30 SKINS E BILLING STAGING
-- Ambiente permitido: STAGING. Não cria recursos Stripe, não aceita cobrança real.

begin;
set local lock_timeout = '8s';
set local statement_timeout = '60s';

create table if not exists private.billing_release_gate_v191 (
  singleton boolean primary key default true check (singleton = true),
  environment text not null default 'staging' check (environment = 'staging'),
  sandbox_simulator_enabled boolean not null default true check (sandbox_simulator_enabled = true),
  real_billing_authorized boolean not null default false check (real_billing_authorized = false),
  stripe_checkout_enabled boolean not null default false check (stripe_checkout_enabled = false),
  stripe_webhook_enabled boolean not null default false check (stripe_webhook_enabled = false),
  customer_portal_enabled boolean not null default false check (customer_portal_enabled = false),
  automatic_tax_enabled boolean not null default false check (automatic_tax_enabled = false),
  tax_registration_confirmed boolean not null default false check (tax_registration_confirmed = false),
  production_authorized boolean not null default false check (production_authorized = false),
  updated_at timestamptz not null default clock_timestamp()
);
alter table private.billing_release_gate_v191 enable row level security;
drop policy if exists "deny client billing release gate v191" on private.billing_release_gate_v191;
create policy "deny client billing release gate v191" on private.billing_release_gate_v191
  for all to public using (false) with check (false);
revoke all on private.billing_release_gate_v191 from public, anon, authenticated;
grant select on private.billing_release_gate_v191 to service_role;
insert into private.billing_release_gate_v191(singleton) values (true)
on conflict (singleton) do update set
  environment='staging', sandbox_simulator_enabled=true, real_billing_authorized=false,
  stripe_checkout_enabled=false, stripe_webhook_enabled=false, customer_portal_enabled=false,
  automatic_tax_enabled=false, tax_registration_confirmed=false, production_authorized=false,
  updated_at=clock_timestamp();

create table if not exists private.billing_sandbox_commands_v191 (
  request_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  command text not null check (command in ('simulate_purchase','restore','refund','revoke','cancel_subscription')),
  product_key text,
  purchase_id uuid,
  result jsonb not null check (jsonb_typeof(result) = 'object'),
  created_at timestamptz not null default clock_timestamp()
);
alter table private.billing_sandbox_commands_v191 enable row level security;
drop policy if exists "deny client billing commands v191" on private.billing_sandbox_commands_v191;
create policy "deny client billing commands v191" on private.billing_sandbox_commands_v191
  for all to public using (false) with check (false);
revoke all on private.billing_sandbox_commands_v191 from public, anon, authenticated;
grant select, insert on private.billing_sandbox_commands_v191 to service_role;

create table if not exists private.billing_rate_limits_v191 (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default clock_timestamp(),
  attempts integer not null default 1 check (attempts between 0 and 1000),
  updated_at timestamptz not null default clock_timestamp()
);
alter table private.billing_rate_limits_v191 enable row level security;
drop policy if exists "deny client billing rate limits v191" on private.billing_rate_limits_v191;
create policy "deny client billing rate limits v191" on private.billing_rate_limits_v191
  for all to public using (false) with check (false);
revoke all on private.billing_rate_limits_v191 from public, anon, authenticated;
grant select, insert, update on private.billing_rate_limits_v191 to service_role;

create table if not exists public.billing_subscriptions_v191 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null references public.product_catalog(product_key) on delete restrict,
  provider text not null default 'divina_sandbox' check (provider in ('divina_sandbox','stripe_test','google_play_test','app_store_test')),
  provider_subscription_id text not null unique check (char_length(provider_subscription_id) between 8 and 180),
  status text not null check (status in ('active','past_due','unpaid','canceled','revoked','expired')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null check (current_period_end > current_period_start),
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  environment text not null default 'staging' check (environment = 'staging'),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  unique (user_id, product_key, environment)
);
alter table public.billing_subscriptions_v191 enable row level security;
drop policy if exists "read own billing subscriptions v191" on public.billing_subscriptions_v191;
create policy "read own billing subscriptions v191" on public.billing_subscriptions_v191
  for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.billing_subscriptions_v191 from anon, authenticated;
grant select on public.billing_subscriptions_v191 to authenticated;
grant all on public.billing_subscriptions_v191 to service_role;

create table if not exists public.billing_receipts_v191 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purchase_id uuid not null unique references public.purchases(id) on delete restrict,
  receipt_code text not null unique check (receipt_code ~ '^DBX-V191-[A-Z0-9]{12}$'),
  product_key text not null references public.product_catalog(product_key) on delete restrict,
  product_name_snapshot text not null check (char_length(product_name_snapshot) between 2 and 100),
  amount_brl_cents integer not null check (amount_brl_cents >= 0),
  currency text not null default 'brl' check (currency = 'brl'),
  status text not null default 'issued' check (status in ('issued','refunded','revoked')),
  environment text not null default 'staging' check (environment = 'staging'),
  issued_at timestamptz not null default clock_timestamp(),
  refunded_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp()
);
comment on table public.billing_receipts_v191 is
  'Recibos técnicos V191 sem valor fiscal e sem dados de pagamento; STAGING somente.';
alter table public.billing_receipts_v191 enable row level security;
drop policy if exists "read own billing receipts v191" on public.billing_receipts_v191;
create policy "read own billing receipts v191" on public.billing_receipts_v191
  for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.billing_receipts_v191 from anon, authenticated;
grant select on public.billing_receipts_v191 to authenticated;
grant all on public.billing_receipts_v191 to service_role;

-- O provedor interno é explicitamente um simulador; não se apresenta como Stripe.
alter table public.purchases drop constraint if exists purchases_provider_check;
alter table public.purchases add constraint purchases_provider_check check (
  provider is null or provider in ('divina_sandbox','stripe_test','google_play_test','app_store_test')
);

create unique index if not exists entitlements_one_active_v191_uidx
  on public.entitlements(user_id, entitlement_key) where status='active';
create index if not exists billing_receipts_v191_user_issued_idx
  on public.billing_receipts_v191(user_id, issued_at desc);
create index if not exists billing_receipts_v191_product_key_idx
  on public.billing_receipts_v191(product_key);
create index if not exists billing_subscriptions_v191_user_status_idx
  on public.billing_subscriptions_v191(user_id, status);
create index if not exists billing_subscriptions_v191_product_key_idx
  on public.billing_subscriptions_v191(product_key);
create index if not exists billing_commands_v191_user_created_idx
  on private.billing_sandbox_commands_v191(user_id, created_at desc);

-- Catálogo comercial canônico V191. Produtos de skins antigos deixam de estar à venda.
update public.product_catalog
   set active=false,
       metadata=coalesce(metadata,'{}'::jsonb) || jsonb_build_object('blocked_reason','SUPERSEDED_BY_PREMIUM_V191'),
       updated_at=clock_timestamp()
 where product_type in ('skin','skin_pack');

insert into public.product_catalog(
  product_key,product_type,name,price_brl_cents,billing_mode,credits,active,catalog_version,metadata,updated_at
) values
  ('premium_lifetime','premium','Divina Bruxa Premium',19990,'payment',null,true,'V191',
    '{"includes_ai":false,"includes_all_30_skins":true,"checkout":"hosted_future","environment":"staging"}'::jsonb,clock_timestamp()),
  ('orbe_ai_monthly','ai_subscription','Orbe IA',8990,'subscription',400,true,'V191',
    '{"luna_cost":1,"terra_cost":10,"sol_enabled":false,"checkout":"hosted_future","environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_200','credits','200 créditos',3990,'payment',200,true,'V191','{"environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_600','credits','600 créditos',9990,'payment',600,true,'V191','{"environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_1500','credits','1.500 créditos',19990,'payment',1500,true,'V191','{"environment":"staging"}'::jsonb,clock_timestamp())
on conflict (product_key) do update set
  product_type=excluded.product_type,name=excluded.name,price_brl_cents=excluded.price_brl_cents,
  billing_mode=excluded.billing_mode,credits=excluded.credits,active=true,catalog_version='V191',
  metadata=excluded.metadata,updated_at=clock_timestamp();

-- Reconciliação do catálogo visual: os 20 registros históricos são preservados e arquivados.
alter table public.orb_skins drop constraint if exists orb_skins_sort_order_key;
alter table public.orb_skins drop constraint if exists orb_skins_sort_order_check;
alter table public.orb_skins drop constraint if exists orb_skins_check;
drop index if exists public.orb_skins_published_sort_order_uidx;
update public.orb_skins
   set status='archived', sort_order=100+sort_order, updated_at=clock_timestamp()
 where status <> 'archived' and sort_order between 1 and 30;
alter table public.orb_skins add constraint orb_skins_sort_order_v191_check check (
  (status='archived' and sort_order between 101 and 999)
  or (status<>'archived' and sort_order between 1 and 30)
);
alter table public.orb_skins add constraint orb_skins_price_v191_check check (
  (is_free and price_brl_cents=0) or (not is_free and price_brl_cents>=0)
);
create unique index orb_skins_published_sort_order_uidx
  on public.orb_skins(sort_order) where status='published';

insert into public.orb_skins(slug,name,rarity,price_brl_cents,is_free,status,sort_order,updated_at) values
  ('classic','Clássica Divina','classica',0,true,'published',1,clock_timestamp()),
  ('lunar','Lunar Mistério','premium',0,false,'published',2,clock_timestamp()),
  ('solar','Solar Dourada','premium',0,false,'published',3,clock_timestamp()),
  ('ocean','Oceanos de Copas','premium',0,false,'published',4,clock_timestamp()),
  ('emerald','Esmeralda Ancestral','premium',0,false,'published',5,clock_timestamp()),
  ('fire','Fogo Sagrado','premium',0,false,'published',6,clock_timestamp()),
  ('cosmic','Cósmica Infinita','premium_alta',0,false,'published',7,clock_timestamp()),
  ('eclipse','Eclipse Sombria','premium',0,false,'published',8,clock_timestamp()),
  ('venus','Rosa de Vênus','premium',0,false,'published',9,clock_timestamp()),
  ('amethyst','Ametista Real','premium_alta',0,false,'published',10,clock_timestamp()),
  ('sapphire','Safira Celestial','premium_alta',0,false,'published',11,clock_timestamp()),
  ('ruby','Rubi da Bruxa','premium_alta',0,false,'published',12,clock_timestamp()),
  ('aurora','Aurora Boreal','premium_alta',0,false,'published',13,clock_timestamp()),
  ('storm','Tempestade Astral','premium_alta',0,false,'published',14,clock_timestamp()),
  ('fairy','Jardim das Fadas','premium_alta',0,false,'published',15,clock_timestamp()),
  ('isis','Templo Lunar','premium_alta',0,false,'published',16,clock_timestamp()),
  ('twin-flame','Chama Gêmea','premium_alta',0,false,'published',17,clock_timestamp()),
  ('realities','Portal das Realidades','lendaria',0,false,'published',18,clock_timestamp()),
  ('queen','Rainha do Universo','lendaria',0,false,'published',19,clock_timestamp()),
  ('supreme','Divina Suprema','edicao_especial',0,false,'published',20,clock_timestamp()),
  ('moon-silver','Lua de Prata','lendaria',0,false,'published',21,clock_timestamp()),
  ('solstice','Solstício Dourado','lendaria',0,false,'published',22,clock_timestamp()),
  ('neptune','Maré de Netuno','lendaria',0,false,'published',23,clock_timestamp()),
  ('enchanted-forest','Floresta Encantada','lendaria',0,false,'published',24,clock_timestamp()),
  ('cosmic-dragon','Dragão Cósmico','edicao_especial',0,false,'published',25,clock_timestamp()),
  ('lunar-rose','Rosa Lunar','lendaria',0,false,'published',26,clock_timestamp()),
  ('saturn-crystal','Cristal de Saturno','lendaria',0,false,'published',27,clock_timestamp()),
  ('violet-phoenix','Fênix Violeta','edicao_especial',0,false,'published',28,clock_timestamp()),
  ('celestial-oracle','Oráculo Celestial','edicao_especial',0,false,'published',29,clock_timestamp()),
  ('star-crown','Coroa das Estrelas','edicao_especial',0,false,'published',30,clock_timestamp())
on conflict (slug) do update set
  name=excluded.name,rarity=excluded.rarity,price_brl_cents=excluded.price_brl_cents,
  is_free=excluded.is_free,status='published',sort_order=excluded.sort_order,updated_at=clock_timestamp();

update public.orb_skin_products set active=false, updated_at=clock_timestamp() where active=true;

-- Keep the existing auth trigger aligned with the canonical V191 free skin slug.
-- This must be in the same transaction as the catalog switch so a new account can
-- never observe the archived legacy slug between migrations.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=pg_catalog
as $$
declare
  v_classic uuid;
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''));

  insert into public.user_settings (user_id) values (new.id);
  perform private.seed_notification_preferences(new.id);

  select s.id into v_classic
    from public.orb_skins s
   where s.slug = 'classic'
     and s.is_free = true
     and s.status = 'published'
   limit 1;

  if v_classic is null then
    raise exception using errcode='23514', message='CLASSIC_SKIN_MISSING';
  end if;

  insert into public.orb_skin_preferences(user_id, equipped_skin_id)
  values (new.id, v_classic)
  on conflict (user_id) do nothing;

  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create or replace function private.fallback_revoked_orb_skin()
returns trigger
language plpgsql
security definer
set search_path=pg_catalog
as $$
declare v_classic uuid;
begin
  if (new.status <> 'active' or new.revoked_at is not null)
     and (old.status = 'active' and old.revoked_at is null) then
    select s.id into v_classic from public.orb_skins s
     where s.slug='classic' and s.is_free=true and s.status='published' limit 1;
    if v_classic is null then
      raise exception using errcode='23514',message='CLASSIC_SKIN_MISSING';
    end if;
    update public.orb_skin_preferences p set equipped_skin_id=v_classic,updated_at=clock_timestamp()
     where p.user_id=new.user_id and p.equipped_skin_id=new.skin_id;
  end if;
  return new;
end;
$$;
revoke all on function private.fallback_revoked_orb_skin() from public, anon, authenticated;

create or replace function private.process_billing_sandbox_command_v191(
  p_user_id uuid,
  p_request_id uuid,
  p_command text,
  p_product_key text default null,
  p_purchase_id uuid default null,
  p_platform text default 'web'
) returns jsonb
language plpgsql
security definer
set search_path=pg_catalog
as $$
declare
  v_gate private.billing_release_gate_v191%rowtype;
  v_product public.product_catalog%rowtype;
  v_purchase public.purchases%rowtype;
  v_existing_user uuid;
  v_existing_command text;
  v_existing_product text;
  v_existing_purchase uuid;
  v_existing_result jsonb;
  v_result jsonb;
  v_subscription_id uuid;
  v_attempts integer;
  v_window timestamptz;
  v_old_credits integer:=0;
  v_removed integer:=0;
  v_status text;
  v_message text;
begin
  if p_user_id is null or p_request_id is null then
    raise exception using errcode='22023',message='BILLING_ID_REQUIRED';
  end if;
  if p_command not in ('simulate_purchase','restore','refund','revoke','cancel_subscription') then
    raise exception using errcode='22023',message='BILLING_COMMAND_NOT_ALLOWED';
  end if;
  if p_platform not in ('web','android','ios') then
    raise exception using errcode='22023',message='BILLING_PLATFORM_NOT_ALLOWED';
  end if;

  select * into v_gate from private.billing_release_gate_v191 where singleton=true for update;
  if not found or v_gate.environment<>'staging' or not v_gate.sandbox_simulator_enabled
     or v_gate.real_billing_authorized or v_gate.stripe_checkout_enabled
     or v_gate.stripe_webhook_enabled or v_gate.production_authorized then
    raise exception using errcode='55000',message='BILLING_RELEASE_GATE_CLOSED';
  end if;

  select user_id,command,product_key,purchase_id,result
    into v_existing_user,v_existing_command,v_existing_product,v_existing_purchase,v_existing_result
    from private.billing_sandbox_commands_v191 where request_id=p_request_id;
  if found then
    if v_existing_user<>p_user_id
       or v_existing_command is distinct from p_command
       or v_existing_product is distinct from p_product_key
       or v_existing_purchase is distinct from p_purchase_id then
      raise exception using errcode='22023',message='BILLING_REQUEST_CONFLICT';
    end if;
    return v_existing_result || jsonb_build_object('idempotent',true);
  end if;

  insert into private.billing_rate_limits_v191(user_id,window_started_at,attempts,updated_at)
  values(p_user_id,clock_timestamp(),1,clock_timestamp())
  on conflict(user_id) do update set
    window_started_at=case when private.billing_rate_limits_v191.window_started_at < clock_timestamp()-interval '1 minute' then clock_timestamp() else private.billing_rate_limits_v191.window_started_at end,
    attempts=case when private.billing_rate_limits_v191.window_started_at < clock_timestamp()-interval '1 minute' then 1 else private.billing_rate_limits_v191.attempts+1 end,
    updated_at=clock_timestamp()
  returning attempts,window_started_at into v_attempts,v_window;
  if v_attempts>20 then
    raise exception using errcode='P0001',message='BILLING_RATE_LIMITED';
  end if;

  if p_command='simulate_purchase' then
    select * into v_product from public.product_catalog
     where product_key=p_product_key and active=true and catalog_version='V191' for share;
    if not found then raise exception using errcode='22023',message='BILLING_PRODUCT_NOT_ALLOWED'; end if;

    if v_product.product_type in ('premium','ai_subscription') and exists(
      select 1 from public.entitlements e
       where e.user_id=p_user_id and e.entitlement_key=v_product.product_key and e.status='active'
    ) then
      v_result=jsonb_build_object('ok',true,'idempotent',false,'alreadyActive',true,'command',p_command,
        'productKey',v_product.product_key,'message','Este acesso já está ativo no STAGING.');
      insert into private.billing_sandbox_commands_v191(request_id,user_id,command,product_key,purchase_id,result)
      values(p_request_id,p_user_id,p_command,p_product_key,null,v_result);
      return v_result;
    end if;

    insert into public.purchases(
      user_id,product_key,platform,environment,provider_event_id,provider_object_id,
      price_brl_cents_snapshot,catalog_version_snapshot,status,provider,provider_price_id,last_provider_event_id
    ) values(
      p_user_id,v_product.product_key,p_platform,'staging','v191:'||p_request_id::text,
      'sim_v191_'||replace(p_request_id::text,'-',''),v_product.price_brl_cents,'V191','paid',
      'divina_sandbox',null,'v191:'||p_request_id::text
    ) returning * into v_purchase;

    insert into public.billing_receipts_v191(
      user_id,purchase_id,receipt_code,product_key,product_name_snapshot,amount_brl_cents,status
    ) values(
      p_user_id,v_purchase.id,'DBX-V191-'||upper(substr(md5(p_request_id::text),1,12)),
      v_product.product_key,v_product.name,v_product.price_brl_cents,'issued'
    );

    if v_product.product_type='premium' then
      insert into public.entitlements(user_id,entitlement_key,source_purchase_id,status,starts_at)
      values(p_user_id,v_product.product_key,v_purchase.id,'active',clock_timestamp());
    elsif v_product.product_type='ai_subscription' then
      insert into public.entitlements(user_id,entitlement_key,source_purchase_id,status,starts_at,ends_at)
      values(p_user_id,v_product.product_key,v_purchase.id,'active',clock_timestamp(),clock_timestamp()+interval '1 month');
      select monthly_credits into v_old_credits from public.ai_wallets where user_id=p_user_id for update;
      v_old_credits=coalesce(v_old_credits,0);
      insert into public.ai_wallets(user_id,monthly_credits,extra_credits,demo_credits,extra_use_confirmed,cycle_ends_at,updated_at)
      values(p_user_id,coalesce(v_product.credits,400),0,3,false,clock_timestamp()+interval '1 month',clock_timestamp())
      on conflict(user_id) do update set monthly_credits=excluded.monthly_credits,cycle_ends_at=excluded.cycle_ends_at,updated_at=clock_timestamp();
      if coalesce(v_product.credits,400)-v_old_credits<>0 then
        insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
        values(p_user_id,p_request_id,'monthly',coalesce(v_product.credits,400)-v_old_credits,'purchase');
      end if;
      insert into public.billing_subscriptions_v191(
        user_id,product_key,provider,provider_subscription_id,status,current_period_start,current_period_end,cancel_at_period_end
      ) values(
        p_user_id,v_product.product_key,'divina_sandbox','sub_v191_'||replace(p_request_id::text,'-',''),
        'active',clock_timestamp(),clock_timestamp()+interval '1 month',false
      ) on conflict(user_id,product_key,environment) do update set
        provider='divina_sandbox',provider_subscription_id=excluded.provider_subscription_id,status='active',
        current_period_start=excluded.current_period_start,current_period_end=excluded.current_period_end,
        cancel_at_period_end=false,canceled_at=null,updated_at=clock_timestamp();
    elsif v_product.product_type='credits' then
      insert into public.ai_wallets(user_id,monthly_credits,extra_credits,demo_credits,extra_use_confirmed,updated_at)
      values(p_user_id,0,coalesce(v_product.credits,0),3,false,clock_timestamp())
      on conflict(user_id) do update set extra_credits=public.ai_wallets.extra_credits+coalesce(v_product.credits,0),updated_at=clock_timestamp();
      insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
      values(p_user_id,p_request_id,'extra',coalesce(v_product.credits,0),'purchase');
    end if;
    v_message='Simulação concluída e recibo sandbox emitido.';
    v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,'productKey',v_product.product_key,
      'purchaseId',v_purchase.id,'message',v_message);

  elsif p_command in ('refund','revoke') then
    if p_purchase_id is null then raise exception using errcode='22023',message='BILLING_PURCHASE_REQUIRED'; end if;
    select p.* into v_purchase from public.purchases p
     where p.id=p_purchase_id and p.user_id=p_user_id and p.environment='staging' and p.provider='divina_sandbox' for update;
    if not found then raise exception using errcode='22023',message='BILLING_PURCHASE_NOT_FOUND'; end if;
    select * into v_product from public.product_catalog where product_key=v_purchase.product_key;
    if v_purchase.status<>'paid' then
      v_result=jsonb_build_object('ok',true,'idempotent',false,'alreadyFinal',true,'command',p_command,
        'purchaseId',v_purchase.id,'message','Este registro já estava encerrado no STAGING.');
    else
      v_status=case when p_command='refund' then 'refunded' else 'revoked' end;
      update public.purchases set status=v_status,last_provider_event_id='v191:'||p_request_id::text,updated_at=clock_timestamp()
       where id=v_purchase.id;
      update public.billing_receipts_v191 set status=v_status,
        refunded_at=case when p_command='refund' then clock_timestamp() else refunded_at end,
        revoked_at=case when p_command='revoke' then clock_timestamp() else revoked_at end,
        updated_at=clock_timestamp() where purchase_id=v_purchase.id;
      if v_product.product_type in ('premium','ai_subscription') then
        update public.entitlements set status='revoked',ends_at=clock_timestamp()
         where user_id=p_user_id and entitlement_key=v_product.product_key and status='active';
      end if;
      if v_product.product_type='ai_subscription' then
        select monthly_credits into v_old_credits from public.ai_wallets where user_id=p_user_id for update;
        v_old_credits=coalesce(v_old_credits,0);
        update public.ai_wallets set monthly_credits=0,cycle_ends_at=null,updated_at=clock_timestamp() where user_id=p_user_id;
        if v_old_credits>0 then
          insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
          values(p_user_id,p_request_id,'monthly',-v_old_credits,case when p_command='refund' then 'refund' else 'adjustment' end);
        end if;
        update public.billing_subscriptions_v191 set status=case when p_command='refund' then 'canceled' else 'revoked' end,
          cancel_at_period_end=false,canceled_at=clock_timestamp(),updated_at=clock_timestamp()
         where user_id=p_user_id and product_key=v_product.product_key;
      elsif v_product.product_type='credits' then
        select least(extra_credits,coalesce(v_product.credits,0)) into v_removed
          from public.ai_wallets where user_id=p_user_id for update;
        v_removed=coalesce(v_removed,0);
        update public.ai_wallets set extra_credits=greatest(0,extra_credits-v_removed),updated_at=clock_timestamp() where user_id=p_user_id;
        if v_removed>0 then
          insert into public.ai_credit_ledger(user_id,request_id,bucket,delta,reason)
          values(p_user_id,p_request_id,'extra',-v_removed,case when p_command='refund' then 'refund' else 'adjustment' end);
        end if;
      end if;
      v_message=case when p_command='refund' then 'Reembolso sandbox concluído; acesso correspondente removido.'
                     else 'Acesso revogado no STAGING.' end;
      v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,'purchaseId',v_purchase.id,
        'productKey',v_purchase.product_key,'message',v_message);
    end if;

  elsif p_command='cancel_subscription' then
    if p_product_key<>'orbe_ai_monthly' then raise exception using errcode='22023',message='BILLING_SUBSCRIPTION_NOT_ALLOWED'; end if;
    update public.billing_subscriptions_v191 set cancel_at_period_end=true,updated_at=clock_timestamp()
     where user_id=p_user_id and product_key=p_product_key and status='active' returning id into v_subscription_id;
    if not found then raise exception using errcode='22023',message='BILLING_SUBSCRIPTION_NOT_FOUND'; end if;
    v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,'productKey',p_product_key,
      'subscriptionId',v_subscription_id,'message','Cancelamento sandbox agendado para o fim do ciclo.');

  else
    -- Restore nunca repõe créditos consumidos nem ressuscita compra reembolsada.
    update public.entitlements e set status='active',ends_at=null
     where e.user_id=p_user_id and e.status<>'active' and exists(
       select 1 from public.purchases p where p.id=e.source_purchase_id and p.user_id=p_user_id
        and p.status='paid' and p.environment='staging' and p.product_key in ('premium_lifetime','orbe_ai_monthly')
     );
    insert into public.entitlements(user_id,entitlement_key,source_purchase_id,status,starts_at)
    select p.user_id,p.product_key,p.id,'active',p.created_at from public.purchases p
     where p.user_id=p_user_id and p.status='paid' and p.environment='staging'
       and p.product_key in ('premium_lifetime','orbe_ai_monthly')
       and not exists(select 1 from public.entitlements e where e.source_purchase_id=p.id)
    on conflict do nothing;
    v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,
      'message','Compras e acessos válidos restaurados pelo servidor STAGING.');
  end if;

  insert into private.billing_sandbox_commands_v191(request_id,user_id,command,product_key,purchase_id,result)
  values(p_request_id,p_user_id,p_command,p_product_key,p_purchase_id,v_result);
  return v_result;
end;
$$;
revoke all on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text) from public, anon, authenticated;
grant execute on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text) to service_role;

create or replace function public.process_billing_sandbox_command_v191(
  p_user_id uuid,
  p_request_id uuid,
  p_command text,
  p_product_key text default null,
  p_purchase_id uuid default null,
  p_platform text default 'web'
) returns jsonb
language sql
security invoker
set search_path=pg_catalog
as $$
  select private.process_billing_sandbox_command_v191(
    p_user_id,p_request_id,p_command,p_product_key,p_purchase_id,p_platform
  );
$$;
revoke all on function public.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text) from public, anon, authenticated;
grant execute on function public.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text) to service_role;

comment on function public.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text) is
  'Backend-only V191 sandbox simulator. Never calls Stripe or production billing.';

commit;
