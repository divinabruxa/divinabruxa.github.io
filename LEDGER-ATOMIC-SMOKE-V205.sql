-- V205 rollback-safe synthetic smoke. Run only after the V205 migration in STAGING.
-- Uses invented identifiers, never calls Stripe and never commits test records.

begin;
update private.ledger_gate_v205
   set ledger_processing_enabled=true,restore_enabled=true,manual_adjustments_enabled=true
 where environment='staging';

do $$
declare
  v_user uuid := '20500000-0000-4000-8000-000000000001'::uuid;
  v_user_two uuid := '20500000-0000-4000-8000-000000000002'::uuid;
  v_user_three uuid := '20500000-0000-4000-8000-000000000003'::uuid;
  v_subject text;
  v_subject_two text;
  v_time timestamptz := clock_timestamp();
  v_snapshot jsonb;
  v_count integer;
  v_debt integer;
  v_result jsonb;
begin
  v_subject := private.subject_hash_v205(v_user);
  v_subject_two := private.subject_hash_v205(v_user_two);

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_sub_active_001',
    p_event_type=>'customer.subscription.created',p_payload_sha256=>repeat('a',64),p_user_id=>v_user,
    p_product_key=>'orbe_ai_monthly',p_action=>'subscription_active',p_root_reference=>'sub_v205_001',
    p_transaction_reference=>'sub_v205_001',p_subscription_reference=>'sub_v205_001',p_amount_brl_cents=>0,
    p_currency=>'brl',p_occurred_at=>v_time,p_period_start=>v_time,p_period_end=>v_time+interval '30 days',
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_invoice_paid_001',
    p_event_type=>'invoice.paid',p_payload_sha256=>repeat('b',64),p_user_id=>v_user,
    p_product_key=>'orbe_ai_monthly',p_action=>'subscription_renewed',p_root_reference=>'in_v205_001',
    p_transaction_reference=>'in_v205_001',p_subscription_reference=>'sub_v205_001',p_amount_brl_cents=>8990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '1 second',p_period_start=>v_time,
    p_period_end=>v_time+interval '30 days',p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_result := public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_invoice_paid_001',
    p_event_type=>'invoice.paid',p_payload_sha256=>repeat('b',64),p_user_id=>v_user,
    p_product_key=>'orbe_ai_monthly',p_action=>'subscription_renewed',p_root_reference=>'in_v205_001',
    p_transaction_reference=>'in_v205_001',p_subscription_reference=>'sub_v205_001',p_amount_brl_cents=>8990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '1 second',p_period_start=>v_time,
    p_period_end=>v_time+interval '30 days',p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  if (v_result->>'duplicate')::boolean is not true then raise exception 'V205_TEST_EVENT_REPLAY_FAILED'; end if;
  select count(*)::integer into v_count from private.credit_lots_v205
   where subject_hash=v_subject and lot_type='monthly';
  if v_count<>1 then raise exception 'V205_TEST_DUPLICATE_MONTHLY_CREDIT'; end if;

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_extra_paid_001',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('c',64),p_user_id=>v_user,
    p_product_key=>'credits_200',p_action=>'purchase_paid',p_root_reference=>'pi_v205_extra_001',
    p_transaction_reference=>'pi_v205_extra_001',p_subscription_reference=>null,p_amount_brl_cents=>3990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '2 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_result := public.ledger_consume_credits_v205(v_user,'20500000-0000-4000-8000-000000000010','terra',repeat('d',64));
  v_result := public.ledger_consume_credits_v205(v_user,'20500000-0000-4000-8000-000000000010','terra',repeat('d',64));
  if (v_result->>'duplicate')::boolean is not true then raise exception 'V205_TEST_SPEND_REPLAY_FAILED'; end if;
  select count(*)::integer into v_count from private.credit_spends_v205 where subject_hash=v_subject;
  if v_count<>1 then raise exception 'V205_TEST_DUPLICATE_SPEND'; end if;
  v_result := public.ledger_reverse_credit_spend_v205(
    v_user,'20500000-0000-4000-8000-000000000011','20500000-0000-4000-8000-000000000010','AI_PROVIDER_FAILURE'
  );
  v_result := public.ledger_reverse_credit_spend_v205(
    v_user,'20500000-0000-4000-8000-000000000011','20500000-0000-4000-8000-000000000010','AI_PROVIDER_FAILURE'
  );
  if (v_result->>'duplicate')::boolean is not true then raise exception 'V205_TEST_REVERSAL_REPLAY_FAILED'; end if;
  perform public.ledger_consume_credits_v205(v_user,'20500000-0000-4000-8000-000000000012','terra',repeat('7',64));

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_skin_paid_001',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('e',64),p_user_id=>v_user,
    p_product_key=>'skin_lunar',p_action=>'purchase_paid',p_root_reference=>'pi_v205_skin_001',
    p_transaction_reference=>'pi_v205_skin_001',p_subscription_reference=>null,p_amount_brl_cents=>1990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '3 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_premium_paid_001',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('f',64),p_user_id=>v_user,
    p_product_key=>'premium_lifetime',p_action=>'purchase_paid',p_root_reference=>'pi_v205_premium_001',
    p_transaction_reference=>'pi_v205_premium_001',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '4 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(v_subject);
  if (v_snapshot->>'premiumActive')::boolean is not true
     or pg_catalog.jsonb_array_length(v_snapshot->'skinIds')<>30 then
    raise exception 'V205_TEST_PREMIUM_30_SKINS_FAILED';
  end if;

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_premium_refund_001',
    p_event_type=>'charge.refunded',p_payload_sha256=>repeat('1',64),p_user_id=>v_user,
    p_product_key=>'premium_lifetime',p_action=>'refund_full',p_root_reference=>'pi_v205_premium_001',
    p_transaction_reference=>'re_v205_premium_001',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '5 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(v_subject);
  if (v_snapshot->>'premiumActive')::boolean is true
     or pg_catalog.jsonb_array_length(v_snapshot->'skinIds')<>2
     or not (v_snapshot->'skinIds' ? 'lunar') then
    raise exception 'V205_TEST_STACKED_SKIN_REFUND_FAILED';
  end if;
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_premium_old_001',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('2',64),p_user_id=>v_user,
    p_product_key=>'premium_lifetime',p_action=>'purchase_paid',p_root_reference=>'pi_v205_premium_001',
    p_transaction_reference=>'pi_v205_premium_old_001',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time-interval '1 day',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(v_subject);
  if (v_snapshot->>'premiumActive')::boolean is true then raise exception 'V205_TEST_OUT_OF_ORDER_REWIND'; end if;

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_invoice_refund_001',
    p_event_type=>'charge.refunded',p_payload_sha256=>repeat('3',64),p_user_id=>v_user,
    p_product_key=>'orbe_ai_monthly',p_action=>'refund_full',p_root_reference=>'in_v205_001',
    p_transaction_reference=>'re_v205_invoice_001',p_subscription_reference=>'sub_v205_001',p_amount_brl_cents=>8990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '6 seconds',p_period_start=>v_time,
    p_period_end=>v_time+interval '30 days',p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  select debt_credits into v_debt from private.credit_accounts_v205 where subject_hash=v_subject;
  v_snapshot := private.ledger_snapshot_for_subject_v205(v_subject);
  if v_debt<>10 or (v_snapshot->'wallet'->>'extraCredits')::integer<>200
     or (v_snapshot->'wallet'->>'availableCredits')::integer<>0 then
    raise exception 'V205_TEST_REFUND_DEBT_OR_LOCK_FAILED';
  end if;

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_two_sub_active',
    p_event_type=>'customer.subscription.created',p_payload_sha256=>repeat('4',64),p_user_id=>v_user_two,
    p_product_key=>'orbe_ai_monthly',p_action=>'subscription_active',p_root_reference=>'sub_v205_two',
    p_transaction_reference=>'sub_v205_two',p_subscription_reference=>'sub_v205_two',p_amount_brl_cents=>0,
    p_currency=>'brl',p_occurred_at=>v_time,p_period_start=>v_time,p_period_end=>v_time+interval '30 days',
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_two_extra_paid',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('5',64),p_user_id=>v_user_two,
    p_product_key=>'credits_200',p_action=>'purchase_paid',p_root_reference=>'pi_v205_two_extra',
    p_transaction_reference=>'pi_v205_two_extra',p_subscription_reference=>null,p_amount_brl_cents=>3990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '1 second',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_two_sub_expired',
    p_event_type=>'customer.subscription.deleted',p_payload_sha256=>repeat('6',64),p_user_id=>v_user_two,
    p_product_key=>'orbe_ai_monthly',p_action=>'subscription_expired',p_root_reference=>'sub_v205_two',
    p_transaction_reference=>'sub_v205_two_deleted',p_subscription_reference=>'sub_v205_two',p_amount_brl_cents=>0,
    p_currency=>'brl',p_occurred_at=>v_time+interval '2 seconds',p_period_start=>v_time,
    p_period_end=>v_time+interval '30 days',p_cancel_at_period_end=>true,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(v_subject_two);
  if (v_snapshot->'wallet'->>'extraCredits')::integer<>200
     or (v_snapshot->'wallet'->>'availableCredits')::integer<>0 then
    raise exception 'V205_TEST_EXTRA_CREDIT_DORMANCY_FAILED';
  end if;

  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_three_premium_paid',
    p_event_type=>'payment_intent.succeeded',p_payload_sha256=>repeat('8',64),p_user_id=>v_user_three,
    p_product_key=>'premium_lifetime',p_action=>'purchase_paid',p_root_reference=>'pi_v205_three_premium',
    p_transaction_reference=>'pi_v205_three_premium',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time,p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_three_dispute_open',
    p_event_type=>'charge.dispute.created',p_payload_sha256=>repeat('9',64),p_user_id=>v_user_three,
    p_product_key=>'premium_lifetime',p_action=>'dispute_opened',p_root_reference=>'pi_v205_three_premium',
    p_transaction_reference=>'dp_v205_three_open',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '1 second',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(private.subject_hash_v205(v_user_three));
  if (v_snapshot->>'premiumActive')::boolean is true then raise exception 'V205_TEST_DISPUTE_FREEZE_FAILED'; end if;
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_three_dispute_won',
    p_event_type=>'charge.dispute.closed',p_payload_sha256=>repeat('a',64),p_user_id=>v_user_three,
    p_product_key=>'premium_lifetime',p_action=>'dispute_won',p_root_reference=>'pi_v205_three_premium',
    p_transaction_reference=>'dp_v205_three_won',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '2 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(private.subject_hash_v205(v_user_three));
  if (v_snapshot->>'premiumActive')::boolean is not true then raise exception 'V205_TEST_DISPUTE_WIN_RESTORE_FAILED'; end if;
  perform public.ledger_apply_provider_event_v205(
    p_provider=>'stripe',p_provider_environment=>'test',p_event_key=>'evt_v205_three_chargeback',
    p_event_type=>'charge.dispute.closed',p_payload_sha256=>repeat('b',64),p_user_id=>v_user_three,
    p_product_key=>'premium_lifetime',p_action=>'chargeback',p_root_reference=>'pi_v205_three_premium',
    p_transaction_reference=>'dp_v205_three_lost',p_subscription_reference=>null,p_amount_brl_cents=>19990,
    p_currency=>'brl',p_occurred_at=>v_time+interval '3 seconds',p_period_start=>null,p_period_end=>null,
    p_cancel_at_period_end=>false,p_metadata=>'{}'::jsonb
  );
  v_snapshot := private.ledger_snapshot_for_subject_v205(private.subject_hash_v205(v_user_three));
  if (v_snapshot->>'premiumActive')::boolean is true then raise exception 'V205_TEST_CHARGEBACK_REVOKE_FAILED'; end if;

  select count(*)::integer into v_count from (
    select previous_hash,coalesce(
      pg_catalog.lag(entry_hash) over(partition by subject_hash order by sequence),repeat('0',64)
    ) expected from private.entitlement_ledger_v205
  ) chain where previous_hash<>expected;
  if v_count<>0 then raise exception 'V205_TEST_HASH_CHAIN_FAILED'; end if;
  if exists(
    select 1 from private.entitlement_claims_v205 c
     where c.status='active' and c.source_transaction_id is null and c.provider not in ('manual','migration')
  ) then raise exception 'V205_TEST_GHOST_ENTITLEMENT'; end if;
end $$;

select pg_catalog.jsonb_build_object(
  'release','V205','status','PASS','transactionCommitted',false,
  'duplicateCreditEffects',0,'ghostEntitlements',0,'negativeAvailableCredits',0,
  'tested',pg_catalog.jsonb_build_array(
    'event replay','credit spend replay','per-subject advisory serialization',
    'credit reversal replay','premium plus individual skin stacking','refund','out-of-order event',
    'explicit credit debt','inactive extra-credit dormancy','dispute and chargeback','hash chain'
  )
) as v205_atomic_smoke;

rollback;
