import fs from 'node:fs';
import process from 'node:process';

const file = 'PRODUCTION-READINESS-V8.29.json';
const raw = fs.readFileSync(file, 'utf8');
const config = JSON.parse(raw);
const secretPatterns = [
  /sk_(?:live|test)_[A-Za-z0-9]+/,
  /rk_(?:live|test)_[A-Za-z0-9]+/,
  /whsec_[A-Za-z0-9]+/,
  /service_role[^\n]{0,40}[=:][^\n]{8,}/i,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/
];
const exposedSecrets = secretPatterns.filter((pattern) => pattern.test(raw)).map(String);
const checks = [];
const add = (id, pass, required, detail) => checks.push({ id, pass: Boolean(pass), required, detail });

add('architecture:no-repository-secrets', config.architecture.secretsAllowedInRepository === false && exposedSecrets.length === 0, true, 'Nenhum segredo pode entrar no GitHub Pages.');
add('architecture:environment-separation', config.architecture.stagingProductionSeparated, true, 'Staging e produção devem usar projetos, chaves e dados diferentes.');
add('supabase:staging', config.supabase.stagingProjectConfigured, true, 'Projeto STAGING configurado.');
add('supabase:production', config.supabase.productionProjectConfigured, true, 'Projeto de produção separado.');
add('supabase:rls', config.supabase.rlsDefaultDenyVerified, true, 'RLS default deny verificado nas tabelas expostas.');
add('supabase:mfa', config.supabase.ownerMfaVerified, true, 'MFA da proprietária verificado.');
add('supabase:journal-privacy', config.supabase.journalBodyPrivateVerified, true, 'Corpo do diário inacessível ao admin e analytics.');
add('supabase:backup-restore', config.supabase.backupRestoreTested, true, 'Restauração de backup testada.');
add('supabase:server-secret', config.supabase.serviceRoleStoredServerSide, true, 'Service role somente no servidor.');
add('stripe:sandbox', config.stripe.mode === 'sandbox', true, 'Toda validação anterior ao lançamento ocorre em sandbox.');
add('stripe:checkout', config.stripe.checkoutSessionsConfigured, true, 'Checkout Sessions configurado para compra única.');
add('stripe:subscription', config.stripe.billingSubscriptionConfigured, true, 'Billing configurado para assinatura da Orbe IA.');
add('stripe:portal', config.stripe.customerPortalConfigured, true, 'Portal do cliente configurado.');
add('stripe:restricted-key', config.stripe.restrictedServerKeyConfigured, true, 'Chave restrita e mínima no servidor.');
add('stripe:webhook-signature', config.stripe.webhookSignatureVerified, true, 'Assinatura dos webhooks verificada antes do processamento.');
add('stripe:idempotency', config.stripe.webhookIdempotencyVerified, true, 'Eventos duplicados não concedem benefícios duplicados.');
add('stripe:lifecycle', config.stripe.restoreRefundRevocationTested, true, 'Restore, reembolso e revogação testados.');
add('stripe:tax-accounting', config.stripe.taxAndAccountingReviewed, true, 'Tributação e contabilidade revisadas antes de cobrar.');
add('products:premium', config.products.premiumOneTimeBRL === 199.90, true, 'Premium permanece R$199,90, compra única.');
add('products:orbe-ai', config.products.orbeAiMonthlyBRL === 89.90 && config.products.orbeAiCredits === 400, true, 'Orbe IA permanece R$89,90/mês e 400 créditos.');
add('products:ai-modes', config.products.lunaCreditCost === 1 && config.products.terraCreditCost === 10 && config.products.solEnabled === false, true, 'Luna 1, Terra 10 e Sol OFF.');

for (const [name, value] of Object.entries(config.legal)) add(`legal:${name}`, value, true, `Pendência jurídica: ${name}.`);
for (const [name, value] of Object.entries(config.operations)) add(`operations:${name}`, value, true, `Pendência operacional: ${name}.`);
add('authorization:staging', config.authorizations.stagingApproved, true, 'STAGING precisa estar aprovado.');
add('authorization:owner', config.authorizations.ownerApproved, true, 'A proprietária precisa aprovar o lançamento.');

const safetyLocks = ['production_publish_authorized','dns_changes_authorized','real_billing_authorized','store_submission_authorized'];
for (const lock of safetyLocks) add(`safety-lock:${lock}`, config.authorizations[lock] === false, true, `${lock} deve permanecer false neste pacote.`);

const failed = checks.filter((check) => check.required && !check.pass);
const report = {
  suite: 'DIVINA-BRUXA-PRODUCTION-READINESS-V8.29',
  status: failed.length ? 'BLOCKED' : 'READY_FOR_EXPLICIT_AUTHORIZATION',
  productionReady: false,
  total: checks.length,
  passed: checks.length - failed.length,
  blocked: failed.length,
  exposedSecrets,
  pending: failed.map(({ id, detail }) => ({ id, detail })),
  note: failed.length
    ? 'Conclua as pendências em STAGING. Não altere as travas neste arquivo público.'
    : 'Pré-requisitos técnicos concluídos; produção ainda exige autorização explícita separada.'
};

console.log(JSON.stringify(report, null, 2));
if (process.argv.includes('--enforce') && failed.length) process.exit(1);

