-- ROLLBACK CIRÚRGICO V547 — somente STAGING kyphdsamyygavmkzyezr.
-- Preserva dados e restaura as políticas Whit anteriores.
begin;

drop trigger if exists divina_sync_admin_owner_v547 on auth.users;
drop function if exists private.sync_admin_owner_v547();
drop function if exists public.admin_continuity_snapshot_v547();
drop function if exists public.consume_admin_recovery_code_v547(uuid,text);
drop function if exists public.consume_admin_request_budget_v547(text,text,integer,integer);

drop table if exists private.continuity_policy_v547;
drop table if exists private.admin_owner_allowlist_v547;
drop table if exists public.admin_request_limits_v547;

drop index if exists public.video_episodes_created_by_idx;
drop index if exists public.video_episodes_updated_by_idx;

do $policy$
declare
  table_name text;
begin
  foreach table_name in array array['whit_context_grants','whit_memories','whit_settings'] loop
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_select_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_insert_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_update_own', table_name);
    execute pg_catalog.format('drop policy if exists %I on public.%I', table_name || '_delete_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for select to authenticated using (auth.uid() = user_id)', table_name || '_select_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for insert to authenticated with check (auth.uid() = user_id)', table_name || '_insert_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name || '_update_own', table_name);
    execute pg_catalog.format('create policy %I on public.%I for delete to authenticated using (auth.uid() = user_id)', table_name || '_delete_own', table_name);
  end loop;
end;
$policy$;

commit;
