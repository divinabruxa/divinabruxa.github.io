-- DIVINA BRUXA — V200 · VERDADE COMERCIAL ÚNICA
-- PREPARADA, NÃO EXECUTADA. STAGING apenas; não cria checkout nem objetos Stripe.

begin;
set local lock_timeout = '8s';
set local statement_timeout = '60s';

do $$
begin
  if not exists (select 1 from private.billing_release_gate_v191 where singleton=true and environment='staging' and real_billing_authorized=false and production_authorized=false) then
    raise exception 'V200_REQUIRES_CLOSED_STAGING_BILLING_GATE';
  end if;
end;
$$;

insert into public.consultation_services
  (service_key,name,price_brl_cents,summary,active,delivery_method,turnaround_label,terms_version,updated_at)
values
  ('mesa-real-profissional','Mesa Real Profissional',25000,'Leitura humana ampla para observar ciclos, caminhos, relações e decisões.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','COMMERCIAL-V200',clock_timestamp()),
  ('leitura-mentes','Leitura de Mentes',15000,'Leitura simbólica de sinais, intenções percebidas e dinâmicas; não acessa pensamentos privados.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','COMMERCIAL-V200',clock_timestamp()),
  ('carta-conselho','Carta de Conselho',10000,'Uma carta com interpretação profunda e orientação clara para o momento.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','COMMERCIAL-V200',clock_timestamp()),
  ('pergunta-direta','Pergunta Direta',5000,'Uma pergunta específica com resposta simbólica e direção prática.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','COMMERCIAL-V200',clock_timestamp())
on conflict (service_key) do update set
  name=excluded.name,price_brl_cents=excluded.price_brl_cents,summary=excluded.summary,
  active=true,delivery_method='email',turnaround_label=excluded.turnaround_label,
  terms_version='COMMERCIAL-V200',updated_at=clock_timestamp();

alter table public.consultation_services drop constraint if exists consultation_services_commercial_v200_check;
alter table public.consultation_services add constraint consultation_services_commercial_v200_check check (
  service_key not in ('mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta') or
  (service_key='mesa-real-profissional' and price_brl_cents=25000) or
  (service_key='leitura-mentes' and price_brl_cents=15000) or
  (service_key='carta-conselho' and price_brl_cents=10000) or
  (service_key='pergunta-direta' and price_brl_cents=5000)
);

insert into public.product_catalog(product_key,product_type,name,price_brl_cents,billing_mode,credits,active,catalog_version,metadata,updated_at)
values
  ('premium_lifetime','premium','Divina Bruxa Premium',19990,'payment',null,true,'V191','{"commercial_truth":"V200","includes_ai":false,"includes_all_30_skins":true,"checkout":"disabled","environment":"staging"}'::jsonb,clock_timestamp()),
  ('orbe_ai_monthly','ai_subscription','Orbe IA',8990,'subscription',400,true,'V191','{"commercial_truth":"V200","luna_cost":1,"terra_cost":10,"sol_enabled":false,"checkout":"disabled","environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_200','credits','200 créditos',3990,'payment',200,true,'V191','{"commercial_truth":"V200","checkout":"disabled","environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_600','credits','600 créditos',9990,'payment',600,true,'V191','{"commercial_truth":"V200","checkout":"disabled","environment":"staging"}'::jsonb,clock_timestamp()),
  ('credits_1500','credits','1.500 créditos',19990,'payment',1500,true,'V191','{"commercial_truth":"V200","checkout":"disabled","environment":"staging"}'::jsonb,clock_timestamp())
on conflict (product_key) do update set
  product_type=excluded.product_type,name=excluded.name,price_brl_cents=excluded.price_brl_cents,
  billing_mode=excluded.billing_mode,credits=excluded.credits,active=true,catalog_version='V191',
  metadata=excluded.metadata,updated_at=clock_timestamp();

alter table public.product_catalog drop constraint if exists product_catalog_commercial_v200_check;
alter table public.product_catalog add constraint product_catalog_commercial_v200_check check (
  product_key not in ('premium_lifetime','orbe_ai_monthly','credits_200','credits_600','credits_1500') or
  (product_key='premium_lifetime' and price_brl_cents=19990) or
  (product_key='orbe_ai_monthly' and price_brl_cents=8990 and credits=400) or
  (product_key='credits_200' and price_brl_cents=3990 and credits=200) or
  (product_key='credits_600' and price_brl_cents=9990 and credits=600) or
  (product_key='credits_1500' and price_brl_cents=19990 and credits=1500)
);

do $$
begin
  if (select array_agg(price_brl_cents order by price_brl_cents desc) from public.consultation_services where service_key in ('mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta')) <> array[25000,15000,10000,5000] then
    raise exception 'V200_CONSULTATION_RECONCILIATION_FAILED';
  end if;
  if (select count(*) from public.product_catalog where active and catalog_version='V191' and product_key in ('premium_lifetime','orbe_ai_monthly','credits_200','credits_600','credits_1500')) <> 5 then
    raise exception 'V200_PRODUCT_RECONCILIATION_FAILED';
  end if;
end;
$$;

select pg_notify('pgrst','reload schema');
commit;
