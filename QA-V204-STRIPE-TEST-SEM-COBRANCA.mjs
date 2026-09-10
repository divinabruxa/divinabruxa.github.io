import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=path.resolve(process.env.V204_SITE_ROOT||process.cwd());
const checks=[];
const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:ok?'':String(detail||'falhou')});
const text=file=>fs.readFileSync(path.join(root,file),'utf8');
const json=file=>JSON.parse(text(file));
const exists=file=>fs.existsSync(path.join(root,file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');

const required=[
  '00-LEIA-PRIMEIRO-V204-STRIPE-TEST-SEM-COBRANCA.txt','BILLING-CATALOG-V204.json',
  'STRIPE-TEST-CONTRACT-V204.json','STRIPE-WEBHOOK-EVENT-MATRIX-V204.json',
  'SUPABASE-STRIPE-TEST-STAGING-V204.sql','stripe-checkout-v204.ts','stripe-customer-portal-v204.ts',
  'stripe-webhook-v204.ts','stripe-test-catalog-provision-v204.ts','stripe-reconcile-v204.ts',
  'STRIPE-TEST-RUNBOOK-V204.md','RECONCILIATION-EVIDENCE-V204.json',
  'MANIFESTO-V204-STRIPE-TEST-SEM-COBRANCA.json','EVIDENCIA-QA-V204.json',
  'ARQUIVOS-V204-SHA256.txt','QA-V204-STRIPE-TEST-SEM-COBRANCA.mjs'
];
for(const file of required)check(`arquivo:${file}`,exists(file));

const catalog=json('BILLING-CATALOG-V204.json');
const contract=json('STRIPE-TEST-CONTRACT-V204.json');
const matrix=json('STRIPE-WEBHOOK-EVENT-MATRIX-V204.json');
const manifesto=json('MANIFESTO-V204-STRIPE-TEST-SEM-COBRANCA.json');
const reconciliation=json('RECONCILIATION-EVIDENCE-V204.json');
const sql=text('SUPABASE-STRIPE-TEST-STAGING-V204.sql');
const sources=['stripe-checkout-v204.ts','stripe-customer-portal-v204.ts','stripe-webhook-v204.ts','stripe-test-catalog-provision-v204.ts','stripe-reconcile-v204.ts'];

check('release:catalog',catalog.release==='V204');
check('catalog:version',catalog.catalog_version==='commercial-2026-09-09-v200');
check('catalog:staging',catalog.environment==='staging');
check('catalog:test',catalog.provider_mode==='test');
check('catalog:brl',catalog.currency==='brl');
check('catalog:nine-products',catalog.products.length===9);
const expected={premium_lifetime:19990,orbe_ai_monthly:8990,credits_200:3990,credits_600:9990,credits_1500:19990,consultation_mesa_real:25000,consultation_leitura_mentes:15000,consultation_carta_conselho:10000,consultation_pergunta_direta:5000};
for(const [key,amount] of Object.entries(expected)){
  const item=catalog.products.find(product=>product.product_key===key);
  check(`catalog:${key}:exists`,Boolean(item));
  check(`catalog:${key}:amount`,item?.amount_brl_cents===amount);
  check(`catalog:${key}:active`,item?.active===true);
  check(`catalog:${key}:mode`,['payment','subscription'].includes(item?.billing_mode));
}
check('catalog:orbe-subscription',catalog.products.find(p=>p.product_key==='orbe_ai_monthly')?.billing_mode==='subscription');
check('catalog:orbe-month',catalog.products.find(p=>p.product_key==='orbe_ai_monthly')?.interval==='month');
check('catalog:orbe-400',catalog.products.find(p=>p.product_key==='orbe_ai_monthly')?.credits_per_cycle===400);
check('catalog:premium-all-skins',catalog.products.find(p=>p.product_key==='premium_lifetime')?.benefit==='premium_lifetime_all_30_skins');
check('catalog:premium-no-ai',catalog.products.find(p=>p.product_key==='premium_lifetime')?.includes_ai===false);
check('skins:premium-all',catalog.skin_sales_policy.premium_includes_all_30===true);
for(const amount of [1990,2990,3990,4990])check(`skins:tier:${amount}`,catalog.skin_sales_policy.individual_price_tiers_brl_cents.includes(amount));
for(const amount of [7990,9990,12990])check(`skins:pack:${amount}`,catalog.skin_sales_policy.pack_prices_brl_cents.includes(amount));
check('skins:deferred-v205',catalog.skin_sales_policy.stripe_products_deferred_to==='V205');
for(const [gate,value] of Object.entries(catalog.gates))check(`catalog-gate:${gate}:closed`,value===false);

check('contract:api-current',contract.api_version==='2026-07-29.dahlia');
check('contract:sdk-current',contract.stripe_node_sdk==='22.4.0');
check('contract:hosted',contract.checkout_surface==='stripe_hosted_checkout');
check('contract:dynamic-methods',contract.dynamic_payment_methods===true);
check('contract:forbid-manual-methods',contract.forbidden_parameters.includes('payment_method_types'));
check('contract:integration-id-suffix',/^divina-bruxa-v204-[a-z]{8}$/.test(contract.integration_identifier));
check('contract:tax-off',contract.automatic_tax.enabled===false);
check('contract:client-no-grant',contract.authority.client_can_grant===false);
check('contract:raw-signature',contract.authority.webhook==='signed_raw_body');
for(const [gate,value] of Object.entries(contract.release_gates))check(`contract-gate:${gate}:closed`,value===false);

const requiredEvents=[
  'checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed',
  'payment_intent.succeeded','payment_intent.payment_failed','customer.subscription.created',
  'customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed',
  'charge.refunded','charge.dispute.created','charge.dispute.closed'
];
check('events:exact-count',matrix.events.length===13);
for(const event of requiredEvents){
  const item=matrix.events.find(entry=>entry.type===event);
  check(`event:${event}:exists`,Boolean(item));
  check(`event:${event}:entitlement-controlled`,item?.entitlement!=='granted');
}
check('events:persist-first',matrix.persist_before_effects===true);
check('events:no-full-payload',matrix.full_payload_persisted===false);
check('events:dedupe-id',matrix.ordering.duplicate_key==='stripe_event_id');
check('events:clock',matrix.ordering.state_clock==='event.created');
check('events:old-ignored',matrix.ordering.older_event==='persist_then_ignore_for_state');

const sqlMust=[
  'check (provider_mode = \'test\')','check (livemode = false)','check (live_billing_authorized = false)',
  'check (automatic_tax_enabled = false)','check (entitlement_dispatch_enabled = false)',
  'enable row level security','force row level security','revoke all on schema private from public, anon, authenticated',
  'stripe_webhook_ingest_v204','stripe_webhook_apply_v204','stripe_reconciliation_snapshot_v204',
  'V204_EVENT_NOT_PERSISTED','out_of_order','delivery_count=delivery_count+1','entitlementDispatched',
  'grant execute on function %s to service_role','commit;'
];
for(const token of sqlMust)check(`sql:${token}`,sql.includes(token));
for(const forbidden of ['drop table','truncate table','delete from auth.users','grant execute on function %s to anon','grant execute on function %s to authenticated'])check(`sql:no:${forbidden}`,!sql.toLowerCase().includes(forbidden));
check('sql:nine-seed-products',(sql.match(/commercial-2026-09-09-v200/g)||[]).length>=10);
check('sql:consultation-prices',/25000[\s\S]*15000[\s\S]*10000[\s\S]*5000/.test(sql));

for(const file of sources){
  const source=text(file);
  check(`${file}:sdk-pinned`,source.includes('npm:stripe@22.4.0'));
  check(`${file}:api-current`,source.includes('2026-07-29.dahlia'));
  check(`${file}:restricted-test-key`,source.includes('STRIPE_RESTRICTED_KEY_TEST'));
  check(`${file}:reject-live-key`,source.includes('startsWith("rk_test_")'));
  check(`${file}:no-payment-method-types`,!source.includes('payment_method_types'));
  check(`${file}:no-live-secret`,!/[sr]k_live_[A-Za-z0-9]{8,}/.test(source));
  check(`${file}:no-test-secret-value`,!/[sr]k_test_[A-Za-z0-9]{12,}/.test(source));
  const parsed=spawnSync(process.execPath,['--experimental-strip-types','--check',path.join(root,file)],{encoding:'utf8'});
  check(`${file}:syntax`,parsed.status===0,parsed.stderr);
}
const checkout=text('stripe-checkout-v204.ts');
check('checkout:hosted-session',checkout.includes('stripe.checkout.sessions.create'));
check('checkout:server-price',checkout.includes('catalog.stripePriceId'));
check('checkout:idempotency',checkout.includes('Idempotency-Key')&&checkout.includes('idempotencyKey'));
check('checkout:tax-off',checkout.includes('automatic_tax:{enabled:false}'));
check('checkout:integration-id',checkout.includes('integration_identifier:"divina-bruxa-v204-kqmwzjra"'));
check('checkout:no-entitlement',checkout.includes('entitlementGranted:false'));
check('checkout:account-active',checkout.includes('account_access_is_active_v201'));
check('checkout:test-session',checkout.includes('cs_test_'));

const webhook=text('stripe-webhook-v204.ts');
check('webhook:raw-body',webhook.includes('const raw=await req.text()'));
check('webhook:signature',webhook.includes('constructEventAsync(raw,signature,secret'));
check('webhook:persist-before-gate',webhook.indexOf('stripe_webhook_ingest_v204')<webhook.indexOf('stripe_gate_v204'));
check('webhook:live-rejected',webhook.includes('LIVE_EVENT_REJECTED'));
check('webhook:duplicate-stop',webhook.includes('firstDelivery!==true'));
check('webhook:no-full-payload-db',!webhook.includes('p_payload:'));
check('webhook:no-entitlement',webhook.includes('entitlementDispatched:false'));

const provision=text('stripe-test-catalog-provision-v204.ts');
check('provision:owner',provision.includes('control?.owner!==true'));
check('provision:aal2',provision.includes('control?.mfaSatisfied!==true'));
check('provision:gate',provision.includes('provisioningAuthorized!==true'));
check('provision:test-object-check',provision.includes('product.livemode||price.livemode'));
check('provision:product-idempotent',provision.includes('db:v204:product:'));
check('provision:price-idempotent',provision.includes('db:v204:price:'));

const runbook=text('STRIPE-TEST-RUNBOOK-V204.md');
for(const phrase of ['cartões de teste','corpo bruto','differenceBrlCents=0','MFA/AAL2','automatic_tax_enabled=false','V205'])check(`runbook:${phrase}`,runbook.includes(phrase));
check('evidence:not-executed',reconciliation.status==='not_executed');
check('evidence:no-real-charge',reconciliation.real_charges===0);
check('evidence:no-fake-zero',reconciliation.reconciliation_difference_brl_cents===null);
check('manifest:no-home-change',manifesto.home_changed===false);
check('manifest:no-orb-change',manifesto.orb_changed===false);
check('manifest:no-remote-change',manifesto.remote_changes_performed===false);
check('manifest:no-live-billing',manifesto.billing_live_enabled===false);
check('manifest:next-v205',manifesto.next_release.startsWith('V205'));

const checksumLines=text('ARQUIVOS-V204-SHA256.txt').trim().split(/\r?\n/);
check('checksums:listed-files',checksumLines.length===15);
for(const line of checksumLines){
  const match=line.match(/^([a-f0-9]{64})  ([^/]+)$/);
  check(`checksum-line:${line.slice(-50)}`,Boolean(match));
  if(match)check(`checksum:${match[2]}`,exists(match[2])&&hash(match[2])===match[1]);
}

check('regression:index-unchanged',hash('index.html')==='b147a817abf0f2f2c26d8ecccef26c3aa91c143b584b3dac86ec5c70dab7ebd6');
check('regression:orb-engine-unchanged',hash('orb-engine-v64.js')==='46cd692b25846fff94c42c026092fbdb5ae10617e906e209a2e75083f890b216');
check('regression:commercial-truth-unchanged',hash('commercial-truth-v200.js')==='36e87728606864431297c3941a3be2a8fcfab9381d6a3f635789449cc3a1b9d4');
check('regression:home-v199-qa-present',exists('QA-V199-RUNTIME-HOME.mjs'));
check('regression:tarot-78',fs.readdirSync(root).filter(name=>/^card-\d{2}\.webp$/.test(name)).length===78);

const failed=checks.filter(item=>!item.ok);
const report={release:'V204',root,total:checks.length,passed:checks.length-failed.length,failed:failed.length,p0:failed.length?1:0,p1:0,status:failed.length?'FAIL':'PASS',failures:failed};
console.log(JSON.stringify(report,null,2));
process.exitCode=failed.length?1:0;
