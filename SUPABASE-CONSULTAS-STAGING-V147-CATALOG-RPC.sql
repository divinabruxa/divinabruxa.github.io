-- DIVINA BRUXA — CONSULTAS STAGING V147 · CATÁLOGO ATÔMICO
-- Entrega serviços, preços e horários em uma única chamada backend-only.

begin;

create or replace function public.consultation_catalog_server(p_days integer default 30)
returns jsonb
language sql
security definer
set search_path = 'pg_catalog'
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
      select v.price_table_version
      from public.consultation_price_versions v
      order by v.created_at desc
      limit 1
    ),'consultas-2026-09-05-v147'),
    'timezone','America/Sao_Paulo',
    'environment','staging',
    'realBilling',false
  );
$$;

revoke all on function public.consultation_catalog_server(integer) from public, anon, authenticated;
grant execute on function public.consultation_catalog_server(integer) to service_role;

comment on function public.consultation_catalog_server(integer)
  is 'V147: atomic server-only consultation catalog and availability payload.';

select pg_notify('pgrst','reload schema');

commit;
