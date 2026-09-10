import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.resolve(process.env.V205_SITE_ROOT || process.cwd());
const checks = [];
const check = (name, ok, detail = '') => checks.push({ name, ok:Boolean(ok), detail:ok ? '' : String(detail || 'falhou') });
const exists = file => fs.existsSync(path.join(root, file));
const text = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(text(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

const required = [
  '00-LEIA-PRIMEIRO-V205-LEDGER-UNIVERSAL.txt', 'LEDGER-PRODUCT-MAP-V205.json',
  'LEDGER-CONTRACT-V205.json', 'LEDGER-EVENT-MATRIX-V205.json',
  'SUPABASE-LEDGER-UNIVERSAL-STAGING-V205.sql', 'LEDGER-ATOMIC-SMOKE-V205.sql',
  'stripe-webhook-v205.ts', 'stripe-checkout-v205.ts', 'stripe-test-catalog-provision-v205.ts',
  'billing-account-v205.ts', 'ledger-restore-v205.ts', 'ledger-admin-v205.ts', 'ledger-reconcile-v205.ts',
  'LEDGER-UNIVERSAL-RUNBOOK-V205.md', 'RECONCILIATION-EVIDENCE-V205.json',
  'MANIFESTO-V205-LEDGER-UNIVERSAL.json', 'EVIDENCIA-QA-V205.json',
  'ARQUIVOS-V205-SHA256.txt', 'QA-V205-LEDGER-UNIVERSAL.mjs'
];
for (const file of required) check(`arquivo:${file}`, exists(file));

const productMap = json('LEDGER-PRODUCT-MAP-V205.json');
const contract = json('LEDGER-CONTRACT-V205.json');
const matrix = json('LEDGER-EVENT-MATRIX-V205.json');
const manifesto = json('MANIFESTO-V205-LEDGER-UNIVERSAL.json');
const reconciliation = json('RECONCILIATION-EVIDENCE-V205.json');
const evidence = json('EVIDENCIA-QA-V205.json');
const sql = text('SUPABASE-LEDGER-UNIVERSAL-STAGING-V205.sql');
const smoke = text('LEDGER-ATOMIC-SMOKE-V205.sql');
const edgeFiles = [
  'stripe-webhook-v205.ts', 'stripe-checkout-v205.ts', 'stripe-test-catalog-provision-v205.ts',
  'billing-account-v205.ts', 'ledger-restore-v205.ts', 'ledger-admin-v205.ts', 'ledger-reconcile-v205.ts'
];
const stripeFiles = edgeFiles.filter(file => file.startsWith('stripe-') || file === 'ledger-restore-v205.ts' || file === 'ledger-reconcile-v205.ts');

check('map:release', productMap.release === 'V205');
check('map:authority-server', productMap.authority === 'server_ledger_only');
check('map:catalog-version', productMap.catalog_version === 'commercial-2026-09-09-v200');
check('map:41-sellable-products', productMap.products.length === 41, productMap.products.length);
check('map:30-skins', productMap.skins.length === 30, productMap.skins.length);
check('map:29-paid-skins', productMap.skins.filter(item => !item.free).length === 29);
check('map:classic-free', productMap.skins.find(item => item.id === 'classic')?.price_brl_cents === 0);
const expectedSkinIds = [
  'classic','lunar','solar','ocean','emerald','fire','cosmic','eclipse','venus','amethyst',
  'sapphire','ruby','aurora','storm','fairy','isis','twin-flame','realities','queen','supreme',
  'moon-silver','solstice','neptune','enchanted-forest','cosmic-dragon','lunar-rose',
  'saturn-crystal','violet-phoenix','celestial-oracle','star-crown'
];
check('map:exact-skin-ids', JSON.stringify(productMap.skins.map(item => item.id)) === JSON.stringify(expectedSkinIds));
check('map:public-templo-lunar', productMap.skins.find(item => item.id === 'isis')?.name === 'Templo Lunar');
const skinProducts = productMap.products.filter(item => item.kind === 'skin');
for (const [amount, count] of [[1990,8],[2990,8],[3990,7],[4990,6]]) {
  check(`map:skin-tier:${amount}`, skinProducts.filter(item => item.amount_brl_cents === amount).length === count);
}
const packs = productMap.products.filter(item => item.kind === 'skin_pack');
for (const amount of [7990,9990,12990]) check(`map:pack:${amount}`, packs.some(item => item.amount_brl_cents === amount));
const priceTruth = {
  premium_lifetime:19990, orbe_ai_monthly:8990, credits_200:3990, credits_600:9990, credits_1500:19990,
  consultation_mesa_real:25000, consultation_leitura_mentes:15000,
  consultation_carta_conselho:10000, consultation_pergunta_direta:5000
};
for (const [key, amount] of Object.entries(priceTruth)) {
  const item = productMap.products.find(product => product.product_key === key);
  check(`map:${key}:exists`, Boolean(item));
  check(`map:${key}:price`, item?.amount_brl_cents === amount, item?.amount_brl_cents);
}
check('map:premium-all-skins', productMap.products.find(item => item.product_key === 'premium_lifetime')?.grants?.includes('all_paid_skins'));
check('map:premium-no-ai', productMap.products.find(item => item.product_key === 'premium_lifetime')?.includes_ai === false);
check('map:orbe-400', productMap.products.find(item => item.product_key === 'orbe_ai_monthly')?.credits_per_paid_cycle === 400);
check('map:luna-1', productMap.credit_policy.luna_cost === 1);
check('map:terra-10', productMap.credit_policy.terra_cost === 10);
check('map:sol-off', productMap.credit_policy.sol_enabled === false);
check('map:extras-require-active', productMap.credit_policy.extras_require_active_subscription_to_buy === true);
check('map:extras-dormant', productMap.credit_policy.extras_remain_recorded_while_inactive === true && productMap.credit_policy.extras_usable_while_inactive === false);

check('contract:release', contract.release === 'V205');
check('contract:client-read-only', contract.authority.client_write === false);
check('contract:no-screenshot', contract.authority.screenshots === false);
check('contract:no-local-storage', contract.authority.local_storage === false);
check('contract:duplicate-zero', contract.invariants.duplicate_credit === 0);
check('contract:ghost-zero', contract.invariants.ghost_entitlement === 0);
check('contract:hash-chain', contract.invariants.tamper_evident_user_hash_chain === true);
check('contract:no-negative-credit', contract.invariants.negative_available_credit === false);
check('contract:content-preserved', contract.invariants.refund_preserves_created_content === true);
check('contract:skin-fallback', contract.invariants.revoked_equipped_skin_falls_back_to_classic === true);
for (const [key, value] of Object.entries(contract.release_gates)) {
  if (key === 'stripe_test_enabled') check(`contract-gate:${key}:test-only`, value === true);
  else check(`contract-gate:${key}:closed`, value === false);
}

const expectedEvents = [
  'checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed',
  'payment_intent.succeeded','payment_intent.payment_failed','customer.subscription.created',
  'customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed',
  'charge.refunded','charge.dispute.created','charge.dispute.closed'
];
check('events:exact-count', matrix.events.length === 13);
for (const event of expectedEvents) check(`event:${event}`, matrix.events.some(item => item.provider_event === event));
check('events:persist-first', matrix.persist_before_effects === true);
check('events:no-full-payload', matrix.full_payload_persisted === false);
check('events:retrieve-current', matrix.events.filter(item => item.authority).every(item => item.authority.includes('retrieved_current')));

const sqlMust = [
  "check (live_billing_enabled=false)", "check (production_enabled=false)", "check (sol_enabled=false)",
  'force row level security', 'revoke all on schema private from public, anon, authenticated',
  'ledger_apply_provider_event_v205', 'ledger_entitlement_snapshot_v205', 'ledger_consume_credits_v205',
  'ledger_reverse_credit_spend_v205', 'ledger_admin_adjust_v205', 'ledger_reconciliation_snapshot_v205',
  'pg_advisory_xact_lock', 'for update', 'on conflict', 'source_key text not null unique',
  'V205_IDEMPOTENCY_CONFLICT', 'DUPLICATE_TRANSACTION', 'ROOT_PRODUCT_MISMATCH', 'AMOUNT_MISMATCH',
  'previous_hash', 'entry_hash', 'V205_IMMUTABLE_HISTORY', 'V205_SKIN_NOT_OWNED',
  "'credit_debt'", "'credit_restore'", "'SUBSCRIPTION_CYCLE_PAID'", "'CREDIT_REFUND_DEBT'",
  "test_catalog_provisioning_enabled=false", "test_checkout_enabled=false", 'commit;'
];
for (const token of sqlMust) check(`sql:${token}`, sql.includes(token));
for (const forbidden of ['drop table', 'truncate table', 'delete from auth.users', 'grant execute on function public.ledger_apply_provider_event_v205(text,text,text,text,text,uuid,text,text,text,text,text,integer,text,timestamptz,timestamptz,timestamptz,boolean,jsonb) to authenticated']) {
  check(`sql:no:${forbidden}`, !sql.toLowerCase().includes(forbidden));
}
check('sql:service-only-provider-apply', sql.includes("grant execute on function %s to service_role"));
check('sql:snapshot-auth-bound', sql.includes('private.is_active_account_session(v_user_id,v_session_id)'));
check('sql:no-user-argument-snapshot', sql.includes('public.ledger_entitlement_snapshot_v205()'));
check('sql:premium-30-grants', sql.includes("select 'premium_lifetime',asset_key,1,'right'"));
check('sql:400-cycle', sql.includes("'monthly',400,p_period_end"));
check('sql:monthly-first', sql.includes("case when lot_type='monthly' then 0 else 1 end"));
check('sql:manual-bounded', sql.includes("p_expires_at>now()+interval '366 days'"));
check('sql:consultation-prices', /25000[\s\S]*15000[\s\S]*10000[\s\S]*5000/.test(sql));
check('sql:41-stripe-map', sql.includes("select 'stripe','test',product_key from private.ledger_products_v205 where active=true"));
check('sql:overlap-check', sql.includes('requiresOverlapAcknowledgement'));

check('smoke:transaction', smoke.startsWith('-- V205') && smoke.includes('\nbegin;'));
check('smoke:rollback', smoke.trim().endsWith('rollback;'));
for (const token of [
  'V205_TEST_EVENT_REPLAY_FAILED','V205_TEST_DUPLICATE_MONTHLY_CREDIT','V205_TEST_SPEND_REPLAY_FAILED',
  'V205_TEST_REVERSAL_REPLAY_FAILED',
  'V205_TEST_PREMIUM_30_SKINS_FAILED','V205_TEST_STACKED_SKIN_REFUND_FAILED','V205_TEST_OUT_OF_ORDER_REWIND',
  'V205_TEST_REFUND_DEBT_OR_LOCK_FAILED','V205_TEST_EXTRA_CREDIT_DORMANCY_FAILED','V205_TEST_HASH_CHAIN_FAILED',
  'V205_TEST_DISPUTE_FREEZE_FAILED','V205_TEST_DISPUTE_WIN_RESTORE_FAILED','V205_TEST_CHARGEBACK_REVOKE_FAILED',
  'V205_TEST_GHOST_ENTITLEMENT'
]) check(`smoke:${token}`, smoke.includes(token));

for (const file of edgeFiles) {
  const source = text(file);
  const parsed = spawnSync(process.execPath, ['--experimental-strip-types', '--check', path.join(root, file)], { encoding:'utf8' });
  check(`${file}:syntax`, parsed.status === 0, parsed.stderr);
  check(`${file}:supabase-pinned`, source.includes('npm:@supabase/supabase-js@2.112.4'));
  check(`${file}:no-live-secret`, !/[sr]k_live_[A-Za-z0-9]{8,}/.test(source));
  check(`${file}:no-test-secret-value`, !/[sr]k_test_[A-Za-z0-9]{12,}/.test(source));
}
for (const file of stripeFiles) {
  const source = text(file);
  check(`${file}:stripe-pinned`, source.includes('npm:stripe@22.4.0'));
  check(`${file}:api-current`, source.includes('2026-07-29.dahlia'));
  check(`${file}:restricted-test-key`, source.includes('STRIPE_RESTRICTED_KEY_TEST'));
  check(`${file}:reject-live-key`, source.includes('startsWith("rk_test_")'));
  check(`${file}:no-manual-payment-methods`, !source.includes('payment_method_types'));
}

const webhook = text('stripe-webhook-v205.ts');
check('webhook:raw-body', webhook.includes('const raw = await req.text()'));
check('webhook:signature', webhook.includes('constructEventAsync(raw, signature, secret'));
check('webhook:live-rejected', webhook.includes('LIVE_EVENT_REJECTED'));
check('webhook:retrieve-current-checkout', webhook.includes('stripe.checkout.sessions.retrieve'));
check('webhook:retrieve-current-subscription', webhook.includes('stripe.subscriptions.retrieve'));
check('webhook:retrieve-current-invoice', webhook.includes('stripe.invoices.retrieve'));
check('webhook:atomic-rpc', webhook.includes('ledger_apply_provider_event_v205'));
check('webhook:no-full-payload-db', !webhook.includes('p_payload:'));
check('webhook:observed-clock', webhook.includes('const observedAt = new Date().toISOString()'));

const checkout = text('stripe-checkout-v205.ts');
check('checkout:hosted', checkout.includes('stripe.checkout.sessions.create'));
check('checkout:server-price', checkout.includes('catalog.stripePriceId'));
check('checkout:eligibility', checkout.includes('ledger_checkout_eligibility_v205'));
check('checkout:overlap-confirmation', checkout.includes('SKIN_PACK_OVERLAP_CONFIRMATION_REQUIRED'));
check('checkout:idempotency', checkout.includes('idempotency-key') && checkout.includes('idempotencyKey'));
check('checkout:tax-off', checkout.includes('automatic_tax:{ enabled:false }'));
check('checkout:no-grant', checkout.includes('entitlementGranted:false'));

const account = text('billing-account-v205.ts');
check('account:read-only', account.includes('LEDGER_READ_ONLY'));
check('account:user-bound-rpc', account.includes('ledger_entitlement_snapshot_v205'));
check('account:no-service-role', !account.includes('SUPABASE_SERVICE_ROLE_KEY'));
check('account:compatibility', account.includes('authorityRelease:"V205"') && account.includes('release:"V191"'));

const restore = text('ledger-restore-v205.ts');
check('restore:provider-list', restore.includes('stripe.subscriptions.list') && restore.includes('stripe.paymentIntents.list') && restore.includes('stripe.charges.list'));
check('restore:no-client-product', !restore.includes('body?.productKey'));
check('restore:gate', restore.includes('gate?.restoreEnabled !== true'));
check('restore:atomic-rpc', restore.includes('ledger_apply_provider_event_v205'));

const admin = text('ledger-admin-v205.ts');
check('admin:owner', admin.includes('control?.owner !== true'));
check('admin:aal2', admin.includes('control?.aal !== "aal2"'));
check('admin:reason', admin.includes('reasonCode'));
check('admin:note-hashed', admin.includes('p_note_sha256:await sha256'));
check('admin:no-private-content-response', admin.includes('privateContentReturned:false'));

const reconcile = text('ledger-reconcile-v205.ts');
check('reconcile:owner-aal2', reconcile.includes('OWNER_AAL2_REQUIRED'));
check('reconcile:no-grant', !reconcile.includes('ledger_admin_adjust_v205') && !reconcile.includes('ledger_apply_provider_event_v205'));
check('reconcile:evidence-rpc', reconcile.includes('ledger_reconciliation_snapshot_v205'));

check('evidence:rollback-pass', reconciliation.rollback_only_database_validation.synthetic_smoke === 'PASS');
check('evidence:no-persistent-remote', reconciliation.persistent_remote_changes === false);
check('evidence:no-stripe-objects', reconciliation.stripe_objects_created === 0);
check('manifest:no-home-change', manifesto.home_changed === false);
check('manifest:no-orb-change', manifesto.orb_changed === false);
check('manifest:no-tarot-change', manifesto.tarot_changed === false);
check('manifest:no-live', manifesto.billing_live_enabled === false && manifesto.production_enabled === false);
check('manifest:next-v206', manifesto.next_release.startsWith('V206'));
check('qa-evidence:release', evidence.release === 'V205');
check('qa-evidence:database-pass', evidence.database_rollback_validation === 'PASS');

const checksumLines = text('ARQUIVOS-V205-SHA256.txt').trim().split(/\r?\n/);
check('checksums:18-files', checksumLines.length === 18, checksumLines.length);
for (const line of checksumLines) {
  const match = line.match(/^([a-f0-9]{64})  ([^/]+)$/);
  check(`checksum-line:${line.slice(-48)}`, Boolean(match));
  if (match) check(`checksum:${match[2]}`, exists(match[2]) && hash(match[2]) === match[1]);
}

check('regression:index-unchanged', exists('index.html') && hash('index.html') === 'b147a817abf0f2f2c26d8ecccef26c3aa91c143b584b3dac86ec5c70dab7ebd6');
check('regression:orb-engine-unchanged', exists('orb-engine-v64.js') && hash('orb-engine-v64.js') === '46cd692b25846fff94c42c026092fbdb5ae10617e906e209a2e75083f890b216');
check('regression:commercial-truth-unchanged', exists('commercial-truth-v200.js') && hash('commercial-truth-v200.js') === '36e87728606864431297c3941a3be2a8fcfab9381d6a3f635789449cc3a1b9d4');
check('regression:tarot-78', fs.readdirSync(root).filter(name => /^card-\d{2}\.webp$/.test(name)).length === 78);
check('regression:home-v199-qa-present', exists('QA-V199-RUNTIME-HOME.mjs'));

const failed = checks.filter(item => !item.ok);
const report = {
  release:'V205', root, total:checks.length, passed:checks.length-failed.length,
  failed:failed.length, p0:failed.length ? 1 : 0, p1:0,
  status:failed.length ? 'FAIL' : 'PASS', failures:failed
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = failed.length ? 1 : 0;
