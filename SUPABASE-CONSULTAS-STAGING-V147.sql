-- DIVINA BRUXA — CONSULTAS STAGING V147
-- Canoniza os quatro serviços, aplica os preços oficiais e remove qualquer dependência de WhatsApp.

begin;

do $$
begin
  if exists (
    select 1 from public.consultation_requests
    where service_key in ('mesa-real','leitura-de-mentes','carta-de-conselho','pergunta')
  ) or exists (
    select 1 from private.consultation_slot_holds
    where service_key in ('mesa-real','leitura-de-mentes','carta-de-conselho','pergunta')
  ) then
    raise exception 'legacy_consultation_rows_must_be_migrated_before_v147';
  end if;
end;
$$;

alter table public.consultation_services
  drop constraint if exists consultation_services_delivery_method_check;

alter table public.consultation_services
  add constraint consultation_services_delivery_method_check
  check (delivery_method in (
    'pending_owner_decision','phone','video','live','followup_material','whatsapp_video','email'
  ));

delete from public.consultation_services
where service_key in ('mesa-real','leitura-de-mentes','carta-de-conselho','pergunta');

insert into public.consultation_services
  (service_key,name,price_brl_cents,summary,active,delivery_method,turnaround_label,terms_version,updated_at)
values
  ('mesa-real-profissional','Mesa Real Profissional',25000,'Leitura humana ampla para observar ciclos, caminhos, relações e decisões.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
  ('leitura-mentes','Leitura de Mentes',15000,'Leitura simbólica de sinais, intenções percebidas e dinâmicas; não acessa pensamentos privados.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
  ('carta-conselho','Carta de Conselho',10000,'Uma carta com interpretação profunda e orientação clara para o momento.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
  ('pergunta-direta','Pergunta Direta',5000,'Uma pergunta específica com resposta simbólica e direção prática.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now())
on conflict (service_key) do update
set name=excluded.name,
    price_brl_cents=excluded.price_brl_cents,
    summary=excluded.summary,
    active=true,
    delivery_method='email',
    turnaround_label=excluded.turnaround_label,
    terms_version=excluded.terms_version,
    updated_at=now();

-- Mantém o endpoint administrativo V146 compatível, mas faz o catálogo público
-- usar os mesmos IDs canônicos da página. O histórico continua append-only.
create or replace function public.admin_apply_consultation_prices_v146(
  p_prices jsonb,
  p_created_by uuid,
  p_version text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  mesa integer;
  mentes integer;
  conselho integer;
  pergunta integer;
begin
  if jsonb_typeof(p_prices) <> 'object'
     or jsonb_object_length(p_prices) <> 4
     or not (p_prices ?& array['mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta']) then
    raise exception 'invalid_price_table';
  end if;

  mesa := (p_prices ->> 'mesa-real-profissional')::integer;
  mentes := (p_prices ->> 'leitura-mentes')::integer;
  conselho := (p_prices ->> 'carta-conselho')::integer;
  pergunta := (p_prices ->> 'pergunta-direta')::integer;

  if mesa not between 100 and 500000
     or mentes not between 100 and 500000
     or conselho not between 100 and 500000
     or pergunta not between 100 and 500000
     or p_version !~ '^consultas-[0-9]{14}-v146$'
     or not exists (
       select 1 from public.admin_owners
       where user_id = p_created_by and active = true
     ) then
    raise exception 'unauthorized_or_invalid_price_change';
  end if;

  insert into public.consultation_price_versions
    (price_table_version, service_id, service_name, price_cents, created_by)
  values
    (p_version,'mesa-real-profissional','Mesa Real Profissional',mesa,p_created_by),
    (p_version,'leitura-mentes','Leitura de Mentes',mentes,p_created_by),
    (p_version,'carta-conselho','Carta de Conselho',conselho,p_created_by),
    (p_version,'pergunta-direta','Pergunta Direta',pergunta,p_created_by);

  insert into public.consultation_services
    (service_key,name,price_brl_cents,summary,active,delivery_method,turnaround_label,terms_version,updated_at)
  values
    ('mesa-real-profissional','Mesa Real Profissional',mesa,'Leitura humana ampla para observar ciclos, caminhos, relações e decisões.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
    ('leitura-mentes','Leitura de Mentes',mentes,'Leitura simbólica de sinais, intenções percebidas e dinâmicas; não acessa pensamentos privados.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
    ('carta-conselho','Carta de Conselho',conselho,'Uma carta com interpretação profunda e orientação clara para o momento.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now()),
    ('pergunta-direta','Pergunta Direta',pergunta,'Uma pergunta específica com resposta simbólica e direção prática.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','CONSULTAS-STAGING-V147-2026-09-05',now())
  on conflict (service_key) do update
  set name=excluded.name,
      price_brl_cents=excluded.price_brl_cents,
      summary=excluded.summary,
      active=true,
      delivery_method='email',
      turnaround_label=excluded.turnaround_label,
      terms_version=excluded.terms_version,
      updated_at=now();
end;
$$;

revoke all on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) from public, anon, authenticated;
grant execute on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) to service_role;

comment on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text)
  is 'V147 bridge: atomic owner price history plus canonical consultation catalog update.';

select pg_notify('pgrst','reload schema');

commit;
