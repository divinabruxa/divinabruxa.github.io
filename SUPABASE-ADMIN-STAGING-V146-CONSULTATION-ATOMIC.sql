-- DIVINA BRUXA — V146 ATOMIC CONSULTATION PRICES
-- Histórico e catálogo atual mudam juntos ou não mudam.

begin;

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
    ('mesa-real-profissional','Mesa Real Profissional',mesa,'Leitura completa e aprofundada.',true,'pending_owner_decision','Prazo confirmado por e-mail','STAGING-DRAFT-NOT-LEGAL-FINAL',now()),
    ('leitura-mentes','Leitura de Mentes',mentes,'Leitura simbólica da dinâmica e das intenções.',true,'pending_owner_decision','Prazo confirmado por e-mail','STAGING-DRAFT-NOT-LEGAL-FINAL',now()),
    ('carta-conselho','Carta de Conselho',conselho,'Uma carta com orientação clara e cuidadosa.',true,'pending_owner_decision','Prazo confirmado por e-mail','STAGING-DRAFT-NOT-LEGAL-FINAL',now()),
    ('pergunta-direta','Pergunta Direta',pergunta,'Uma pergunta objetiva com orientação simbólica.',true,'pending_owner_decision','Prazo confirmado por e-mail','STAGING-DRAFT-NOT-LEGAL-FINAL',now())
  on conflict (service_key) do update
    set name = excluded.name,
        price_brl_cents = excluded.price_brl_cents,
        summary = excluded.summary,
        active = true,
        delivery_method = excluded.delivery_method,
        turnaround_label = excluded.turnaround_label,
        terms_version = excluded.terms_version,
        updated_at = now();
end;
$$;

revoke all on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) from public, anon, authenticated;
grant execute on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) to service_role;

commit;
