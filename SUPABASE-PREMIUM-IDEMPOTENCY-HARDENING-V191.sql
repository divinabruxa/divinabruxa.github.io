-- Divina Bruxa V191 — reject reuse of an idempotency UUID with a different
-- command payload, and keep cancel_subscription from overloading purchase_id.
-- Corrective migration for STAGING. Safe and idempotent.

do $migration$
declare
  v_definition text;
  v_old_declarations constant text := $old$
  v_existing_user uuid;
  v_existing_result jsonb;
  v_result jsonb;
$old$;
  v_new_declarations constant text := $new$
  v_existing_user uuid;
  v_existing_command text;
  v_existing_product text;
  v_existing_purchase uuid;
  v_existing_result jsonb;
  v_result jsonb;
  v_subscription_id uuid;
$new$;
  v_old_lookup constant text := $old$
  select user_id,result into v_existing_user,v_existing_result
    from private.billing_sandbox_commands_v191 where request_id=p_request_id;
  if found then
    if v_existing_user<>p_user_id then
      raise exception using errcode='22023',message='BILLING_REQUEST_CONFLICT';
    end if;
$old$;
  v_new_lookup constant text := $new$
  select user_id,command,product_key,purchase_id,result
    into v_existing_user,v_existing_command,v_existing_product,v_existing_purchase,v_existing_result
    from private.billing_sandbox_commands_v191 where request_id=p_request_id;
  if found then
    if v_existing_user<>p_user_id
       or v_existing_command is distinct from p_command
       or v_existing_product is distinct from p_product_key
       or v_existing_purchase is distinct from p_purchase_id then
      raise exception using errcode='22023',message='BILLING_REQUEST_CONFLICT';
    end if;
$new$;
  v_old_cancel constant text := $old$
    update public.billing_subscriptions_v191 set cancel_at_period_end=true,updated_at=clock_timestamp()
     where user_id=p_user_id and product_key=p_product_key and status='active' returning id into p_purchase_id;
    if not found then raise exception using errcode='22023',message='BILLING_SUBSCRIPTION_NOT_FOUND'; end if;
    v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,'productKey',p_product_key,
      'message','Cancelamento sandbox agendado para o fim do ciclo.');
$old$;
  v_new_cancel constant text := $new$
    update public.billing_subscriptions_v191 set cancel_at_period_end=true,updated_at=clock_timestamp()
     where user_id=p_user_id and product_key=p_product_key and status='active' returning id into v_subscription_id;
    if not found then raise exception using errcode='22023',message='BILLING_SUBSCRIPTION_NOT_FOUND'; end if;
    v_result=jsonb_build_object('ok',true,'idempotent',false,'command',p_command,'productKey',p_product_key,
      'subscriptionId',v_subscription_id,'message','Cancelamento sandbox agendado para o fim do ciclo.');
$new$;
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

  if position(v_new_lookup in v_definition) > 0
     and position(v_new_cancel in v_definition) > 0 then
    return;
  end if;

  if position(v_old_declarations in v_definition) = 0
     or position(v_old_lookup in v_definition) = 0
     or position(v_old_cancel in v_definition) = 0 then
    raise exception using errcode='55000', message='V191_IDEMPOTENCY_FUNCTION_UNEXPECTED';
  end if;

  v_definition := replace(v_definition, v_old_declarations, v_new_declarations);
  v_definition := replace(v_definition, v_old_lookup, v_new_lookup);
  v_definition := replace(v_definition, v_old_cancel, v_new_cancel);
  execute v_definition;
end
$migration$;

revoke all on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text)
  from public, anon, authenticated;
grant execute on function private.process_billing_sandbox_command_v191(uuid,uuid,text,text,uuid,text)
  to service_role;
