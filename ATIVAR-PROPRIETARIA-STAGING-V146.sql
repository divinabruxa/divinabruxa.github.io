-- EXECUTAR MANUALMENTE somente depois de criar e verificar o e-mail da proprietária em Supabase Auth.
-- Substitua OWNER_EMAIL abaixo. Não coloque senha neste arquivo.

do $$
declare
  owner_email text := 'OWNER_EMAIL';
  owner_id uuid;
begin
  if owner_email = 'OWNER_EMAIL' or position('@' in owner_email) = 0 then
    raise exception 'substitua OWNER_EMAIL pelo e-mail verificado da proprietária';
  end if;

  select id into owner_id
  from auth.users
  where lower(email) = lower(owner_email)
    and email_confirmed_at is not null;

  if owner_id is null then
    raise exception 'usuária inexistente ou e-mail ainda não verificado';
  end if;

  if exists (select 1 from public.admin_owners where active and user_id <> owner_id) then
    raise exception 'já existe outra proprietária ativa';
  end if;

  insert into public.admin_owners (user_id, display_name, active, accepted_security_at)
  values (owner_id, 'Proprietária', true, now())
  on conflict (user_id) do update
    set active = true, accepted_security_at = now(), updated_at = now();

  perform public.admin_apply_consultation_prices_v146(
    jsonb_build_object(
      'mesa-real-profissional',25000,
      'leitura-mentes',15000,
      'carta-conselho',10000,
      'pergunta-direta',5000
    ),
    owner_id,
    'consultas-20260905000000-v146'
  );
end;
$$;
