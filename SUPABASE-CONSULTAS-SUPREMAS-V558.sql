-- DIVINA BRUXA 4.0 — CONSULTAS SUPREMAS V558
-- Novos preços, catálogo administrável e price_snapshot histórico preservado.

begin;
set local lock_timeout='8s';
set local statement_timeout='60s';

-- A trava V200 congelava preços e impedia a edição futura pelo ADMIN.
alter table public.consultation_services
  drop constraint if exists consultation_services_commercial_v200_check;

insert into public.consultation_services
  (service_key,name,price_brl_cents,summary,active,delivery_method,turnaround_label,terms_version,updated_at)
values
  ('mesa-real-profissional','Mesa Real Profissional',25000,'Leitura humana ampla para observar ciclos, caminhos, relações e decisões com profundidade.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','consultas-2026-09-13-v558',clock_timestamp()),
  ('leitura-mentes','Leitura de Mente',20000,'Leitura simbólica de sinais, padrões e dinâmicas percebidas; não acessa pensamentos privados.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','consultas-2026-09-13-v558',clock_timestamp()),
  ('carta-conselho','Carta de Conselho',15000,'Uma carta com interpretação profunda e orientação clara para o momento.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','consultas-2026-09-13-v558',clock_timestamp()),
  ('pergunta-direta','Pergunta',5000,'Uma pergunta específica com resposta simbólica e direção prática.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.','consultas-2026-09-13-v558',clock_timestamp())
on conflict (service_key) do update set
  name=excluded.name,
  price_brl_cents=excluded.price_brl_cents,
  summary=excluded.summary,
  active=true,
  delivery_method='email',
  turnaround_label=excluded.turnaround_label,
  terms_version=excluded.terms_version,
  updated_at=clock_timestamp();

create or replace function public.admin_apply_consultation_prices_v146(
  p_prices jsonb,
  p_created_by uuid,
  p_version text
)
returns void
language plpgsql
security invoker
set search_path=''
as $$
declare
  mesa integer;
  mente integer;
  conselho integer;
  pergunta integer;
begin
  if jsonb_typeof(p_prices)<>'object'
     or jsonb_object_length(p_prices)<>4
     or not (p_prices ?& array['mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta']) then
    raise exception 'invalid_price_table';
  end if;

  mesa := (p_prices->>'mesa-real-profissional')::integer;
  mente := (p_prices->>'leitura-mentes')::integer;
  conselho := (p_prices->>'carta-conselho')::integer;
  pergunta := (p_prices->>'pergunta-direta')::integer;

  if mesa not between 100 and 500000
     or mente not between 100 and 500000
     or conselho not between 100 and 500000
     or pergunta not between 100 and 500000
     or p_version !~ '^consultas-[0-9]{14}-v146$'
     or not exists (
       select 1 from public.admin_owners
       where user_id=p_created_by and active=true
     ) then
    raise exception 'unauthorized_or_invalid_price_change';
  end if;

  insert into public.consultation_price_versions
    (price_table_version,service_id,service_name,price_cents,created_by)
  values
    (p_version,'mesa-real-profissional','Mesa Real Profissional',mesa,p_created_by),
    (p_version,'leitura-mentes','Leitura de Mente',mente,p_created_by),
    (p_version,'carta-conselho','Carta de Conselho',conselho,p_created_by),
    (p_version,'pergunta-direta','Pergunta',pergunta,p_created_by);

  insert into public.consultation_services
    (service_key,name,price_brl_cents,summary,active,delivery_method,turnaround_label,terms_version,updated_at)
  values
    ('mesa-real-profissional','Mesa Real Profissional',mesa,'Leitura humana ampla para observar ciclos, caminhos, relações e decisões com profundidade.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.',p_version,clock_timestamp()),
    ('leitura-mentes','Leitura de Mente',mente,'Leitura simbólica de sinais, padrões e dinâmicas percebidas; não acessa pensamentos privados.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.',p_version,clock_timestamp()),
    ('carta-conselho','Carta de Conselho',conselho,'Uma carta com interpretação profunda e orientação clara para o momento.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.',p_version,clock_timestamp()),
    ('pergunta-direta','Pergunta',pergunta,'Uma pergunta específica com resposta simbólica e direção prática.',true,'email','Disponibilidade, formato e prazo confirmados por e-mail.',p_version,clock_timestamp())
  on conflict (service_key) do update set
    name=excluded.name,
    price_brl_cents=excluded.price_brl_cents,
    summary=excluded.summary,
    active=true,
    delivery_method='email',
    turnaround_label=excluded.turnaround_label,
    terms_version=excluded.terms_version,
    updated_at=clock_timestamp();
end;
$$;

revoke all on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) from public,anon,authenticated;
grant execute on function public.admin_apply_consultation_prices_v146(jsonb,uuid,text) to service_role;

create or replace function public.consultation_catalog_server(p_days integer default 30)
returns jsonb
language sql
security definer
set search_path='pg_catalog'
as $$
  select jsonb_build_object(
    'services',coalesce((
      select jsonb_agg(jsonb_build_object(
        'service_key',s.service_key,
        'name',s.name,
        'price_brl_cents',s.price_brl_cents,
        'summary',s.summary,
        'delivery_method',s.delivery_method,
        'turnaround_label',s.turnaround_label,
        'terms_version',s.terms_version
      ) order by s.price_brl_cents desc)
      from public.consultation_services s
      where s.active=true
    ),'[]'::jsonb),
    'slots',coalesce((
      select jsonb_agg(jsonb_build_object(
        'slot_start_at',a.slot_start_at,
        'slot_end_at',a.slot_end_at
      ) order by a.slot_start_at)
      from public.consultation_availability_server(least(greatest(coalesce(p_days,30),1),30)) a
    ),'[]'::jsonb),
    'priceTableVersion',coalesce((
      select s.terms_version
      from public.consultation_services s
      where s.active=true
      order by s.updated_at desc,s.service_key
      limit 1
    ),'consultas-2026-09-13-v558'),
    'timezone','America/Sao_Paulo',
    'environment','staging',
    'realBilling',false
  );
$$;

revoke all on function public.consultation_catalog_server(integer) from public,anon,authenticated;
grant execute on function public.consultation_catalog_server(integer) to service_role;

do $$
declare values_now integer[];
begin
  select array_agg(price_brl_cents order by array_position(
    array['mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta'],service_key
  )) into values_now
  from public.consultation_services
  where service_key in ('mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta');
  if values_now<>array[25000,20000,15000,5000] then
    raise exception 'V558_CONSULTATION_PRICE_RECONCILIATION_FAILED';
  end if;
end;
$$;

select pg_notify('pgrst','reload schema');
commit;
