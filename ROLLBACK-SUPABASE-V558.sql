-- ROLLBACK OPCIONAL V558: restaura somente o catálogo de preços anterior.
-- Não apaga solicitações e não altera price_snapshots existentes.
begin;
update public.consultation_services set
  price_brl_cents=case service_key
    when 'mesa-real-profissional' then 25000
    when 'leitura-mentes' then 15000
    when 'carta-conselho' then 10000
    when 'pergunta-direta' then 5000
  end,
  name=case service_key
    when 'mesa-real-profissional' then 'Mesa Real Profissional'
    when 'leitura-mentes' then 'Leitura de Mentes'
    when 'carta-conselho' then 'Carta de Conselho'
    when 'pergunta-direta' then 'Pergunta Direta'
  end,
  terms_version='consultas-2026-09-05-v147',
  updated_at=clock_timestamp()
where service_key in ('mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta');
select pg_notify('pgrst','reload schema');
commit;
