-- Divina Bruxa V191 — corrective hardening for staging databases where the
-- primary V191 migration had already completed before the account-trigger
-- dependency was discovered. Safe and idempotent.

begin;

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

commit;
