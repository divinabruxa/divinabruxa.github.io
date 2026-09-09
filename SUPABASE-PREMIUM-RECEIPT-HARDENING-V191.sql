-- Divina Bruxa V191 — make the short receipt code depend on the complete
-- idempotency UUID, avoiding collisions between UUIDs that share a prefix.
-- Corrective migration for staging databases that already ran the primary V191
-- migration. Safe and idempotent.

do $migration$
declare
  v_definition text;
  v_old constant text := $old$'DBX-V191-'||upper(substr(replace(p_request_id::text,'-',''),1,12))$old$;
  v_new constant text := $new$'DBX-V191-'||upper(substr(md5(p_request_id::text),1,12))$new$;
begin
  select pg_get_functiondef(p.oid)
    into v_definition
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'private'
     and p.proname = 'process_billing_sandbox_command_v191'
     and p.prokind = 'f'
   limit 1;

  if v_definition is null then
    raise exception using errcode='42883', message='V191_BILLING_FUNCTION_MISSING';
  end if;

  if position(v_new in v_definition) > 0 then
    return;
  end if;

  if position(v_old in v_definition) = 0 then
    raise exception using errcode='55000', message='V191_RECEIPT_EXPRESSION_UNEXPECTED';
  end if;

  execute replace(v_definition, v_old, v_new);
end
$migration$;

revoke all on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text)
  from public, anon, authenticated;
grant execute on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text)
  to service_role;
