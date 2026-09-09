import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const DELIVERY_ROOT = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = process.env.V198_SITE_ROOT || DELIVERY_ROOT;
const readDelivery = name => readFileSync(join(DELIVERY_ROOT, name), 'utf8');
const readSite = name => readFileSync(join(SITE_ROOT, name), 'utf8');
const sha256 = (root, name) => createHash('sha256').update(readFileSync(join(root, name))).digest('hex');
const passes = [];
const failures = [];
const warnings = [];
const check = (name, condition, severity = 'P1', detail = '') => {
  const item = { name, severity, ...(detail ? { detail } : {}) };
  if (condition) passes.push(item); else failures.push(item);
};

const manifest = JSON.parse(readDelivery('MANIFESTO-V198-PLANO-PRODUCAO.json'));
const contract = JSON.parse(readDelivery('PRODUCTION-READINESS-CONTRACT-V198.json'));
const gateContract = JSON.parse(readDelivery('PRODUCTION-GATES-V198.json'));
const secretMatrix = JSON.parse(readDelivery('SECRETS-ENVIRONMENT-MATRIX-V198.json'));
const plan = readDelivery('PLANO-PRODUCAO-V198.md');
const checklist = readDelivery('GO-LIVE-CHECKLIST-V198.md');
const rollback = readDelivery('ROLLBACK-RUNBOOK-V198.md');
const dnsEmail = readDelivery('DNS-EMAIL-PLAN-V198.md');
const stores = readDelivery('STORE-RELEASE-PLAN-V198.md');
const readme = readDelivery('00-LEIA-PRIMEIRO-V198-PLANO-PRODUCAO.txt');

check('manifesto identifica V198 sobre V197', manifest.version === 198 && manifest.base_required === 'V197 instalada', 'P0');
check('pacote e apenas plano', manifest.release === 'macroetapa-17-plano-producao' && contract.release_kind === 'production-plan-only', 'P0');
check('delta plano e aditivo', manifest.delivery.type === 'flat-delta' && manifest.delivery.directories_inside_zip === 0 && manifest.delivery.delete_existing_files === false, 'P0');
check('delta tem 13 arquivos', manifest.delivery.files.length === 13, 'P0', String(manifest.delivery.files.length));
check('delta sem duplicatas', new Set(manifest.delivery.files).size === manifest.delivery.files.length, 'P0');
for (const name of manifest.delivery.files) {
  check(`delta presente: ${name}`, existsSync(join(DELIVERY_ROOT, name)), 'P0');
  check(`delta nao vazio: ${name}`, existsSync(join(DELIVERY_ROOT, name)) && statSync(join(DELIVERY_ROOT, name)).size > 0, 'P0');
  check(`delta plano: ${name}`, !name.includes('/') && !name.includes('\\'), 'P0');
}

const forbiddenRuntime = /^(?:index\.html|english\.html|espanol\.html|sw\.js|CNAME|manifest\.webmanifest|app\.js|orb-engine-v68\.js|mini-orb-engine\.js|menu-completo-v177\.js|tarot-engine\.js|tarot-data\.js)$/;
check('nenhum runtime critico no delta', !manifest.delivery.files.some(name => forbiddenRuntime.test(name)), 'P0');
check('escopo declara zero runtime', manifest.scope.runtime_files_changed === 0 && manifest.scope.external_writes === false, 'P0');
check('Home, Orbe, Tarot, SW e dominio inalterados', ['home_visual_changed', 'orb_changed', 'tarot_changed', 'service_worker_changed', 'domain_file_changed'].every(key => manifest.scope[key] === false), 'P0');
check('instalacao nunca equivale a autorizacao', contract.installation_is_authorization === false && contract.authorization_rule.zip_installation_never_counts === true, 'P0');
check('silencio nunca equivale a autorizacao', contract.authorization_rule.silence_never_counts === true, 'P0');
check('autorizacao nao e transitiva', contract.authorization_rule.authorization_is_not_transitive === true, 'P0');
check('autorizacao exige escopo completo', ['action', 'environment', 'window', 'owner'].every(value => contract.authorization_rule.scope_must_name.includes(value)), 'P0');

const blockValues = Object.values(contract.release_blocks);
check('todos os bloqueios continuam falsos', blockValues.length === 8 && blockValues.every(value => value === false), 'P0');
check('manifesto repete bloqueios externos', Object.values(manifest.preserved_contracts).every(value => value === false), 'P0');
check('Orbe IA Sol desligada', contract.release_blocks.orbe_ai_sol_enabled === false && manifest.preserved_contracts.sol_enabled === false, 'P0');
check('Home so titulo e Orbe', contract.home_contract.visible_content.join('|') === 'localized_orb_title|living_orb' && contract.home_contract.content_cards_allowed === false, 'P0');
check('contrato congelado da Orbe', contract.home_contract.orb_engine_frozen === true, 'P0');
check('Tarot oficial congelado', contract.tarot_contract.cards === 78 && contract.tarot_contract.orientation === 'normal-only' && contract.tarot_contract.official_art_frozen === true, 'P0');
check('Tarot Livre sem repeticao e significado', contract.tarot_contract.free_tarot_repetition === false && contract.tarot_contract.free_tarot_meanings === false, 'P0');
check('Mesa Real 13x6', contract.tarot_contract.royal_table === '13x6', 'P0');

const expectedGateIds = Array.from({ length: 11 }, (_, index) => `G${index}`);
const gateIds = gateContract.gates.map(gate => gate.id);
check('11 portoes G0-G10 presentes', expectedGateIds.every(id => gateIds.includes(id)) && gateIds.length === 11, 'P0');
check('IDs dos portoes unicos', new Set(gateIds).size === gateIds.length, 'P0');
check('portoes externos exigem autorizacao', gateContract.gates.filter(gate => gate.external_mutation).every(gate => gate.requires_authorization === true && gate.status === 'blocked'), 'P0');
check('portoes locais nao afirmam conclusao inexistente', gateContract.gates.filter(gate => !gate.external_mutation).every(gate => ['prepared', 'pending'].includes(gate.status)), 'P0');
check('evidencia ausente bloqueia', gateContract.policy.evidence_missing === 'blocked' && contract.quality_gate.missing_evidence_result === 'blocked', 'P0');
check('P0 exige rollback', gateContract.policy.p0_action === 'stop-and-rollback', 'P0');
check('P1 interrompe promocao', gateContract.policy.p1_action === 'stop-promotion', 'P0');
for (const gate of gateContract.gates) {
  check(`${gate.id}: nome definido`, typeof gate.name === 'string' && gate.name.length > 4, 'P1');
  check(`${gate.id}: evidencia material`, Array.isArray(gate.evidence) && gate.evidence.length >= 4, 'P1');
}

check('matriz nao contem valores secretos', secretMatrix.contains_secret_values === false, 'P0');
check('ambientes separados', secretMatrix.separation_required === true && secretMatrix.environments.join('|') === 'local|staging|production', 'P0');
check('todos os itens separados por ambiente', secretMatrix.items.every(item => item.separate_per_environment === true), 'P0');
check('segredos sensiveis somente servidor', secretMatrix.items.filter(item => !['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'].includes(item.name)).every(item => item.client_visibility === 'server-only'), 'P0');
check('RLS acompanha chave publicavel', secretMatrix.items.some(item => item.name === 'SUPABASE_PUBLISHABLE_KEY' && /RLS/.test(item.client_visibility)), 'P0');
check('cofre e menor privilegio obrigatorios', secretMatrix.storage_policy.allowed.includes('managed-secret-vault') && secretMatrix.storage_policy.least_privilege === true, 'P0');
for (const forbidden of ['html', 'public-javascript', 'repository', 'zip', 'log', 'screenshot']) check(`segredo proibido em ${forbidden}`, secretMatrix.storage_policy.forbidden.includes(forbidden), 'P1');

const requiredPlanTerms = [
  'Instalar o pacote **não** constitui autorização', 'STAGING e produção', 'Node 22+', 'Security Advisor', 'Performance Advisor',
  'RLS', 'restauração', 'GitHub Pages', 'wildcard', 'Resend', 'SPF/DKIM', 'DMARC', 'Checkout Sessions', 'Billing + Checkout',
  '2026-07-29.dahlia', 'integration_identifier', 'payment_method_types', 'idempotência', 'reconciliação', 'automatic_tax',
  'Google Play Billing', 'Digital Asset Links', 'In-App Purchase', 'não expiram', 'Core Web Vitals', 'percentil 75',
  'orbedasrealidades@hotmail.com', 'P0', 'P1', 'rollback'
];
for (const term of requiredPlanTerms) check(`plano cobre: ${term}`, plan.includes(term), 'P1');
for (const url of [
  'https://docs.github.com/', 'https://supabase.com/docs/', 'https://supabase.com/changelog', 'https://docs.stripe.com/',
  'https://resend.com/docs/', 'https://developer.chrome.com/', 'https://developer.android.com/', 'https://developer.apple.com/'
]) check(`fonte oficial registrada: ${url}`, plan.includes(url), 'P1');

check('checklist deixa autorizacoes desmarcadas', (checklist.match(/- \[ \] (?:Publicar|Alterar|Criar|Ativar|Enviar|Ligar)/g) || []).length === 8, 'P0');
check('checklist cobre dispositivos e acessibilidade', /iPhone\/Android/.test(checklist) && /VoiceOver\/TalkBack/.test(checklist), 'P1');
check('rollback inicia por P0', /Rollback imediato para qualquer P0/.test(rollback), 'P0');
check('rollback evita downgrade destrutivo', /não executar downgrade destrutivo/.test(rollback), 'P0');
check('rollback reconcilia pagamentos', /Reconciliar pagamentos e direitos/.test(rollback), 'P0');
check('DNS configura host antes da zona', /antes do DNS/.test(dnsEmail), 'P0');
check('DNS proibe wildcard', /Não usar wildcard/.test(dnsEmail), 'P0');
check('Resend usa subdominio dedicado', /subdomínio transacional dedicado/.test(dnsEmail), 'P1');
check('Android valida compra no servidor', /verificar compra no servidor/.test(stores), 'P0');
check('iOS exige IAP e restore', /IAP/.test(stores) && /restore/.test(stores), 'P0');
check('lojas exigem valor alem da web', /mais que um site reempacotado/.test(stores) && /experiência móvel real/.test(stores), 'P1');
check('README declara producao nao ativada', /Producao ativada: NAO/.test(readme) && /INSTALAR NAO E AUTORIZAR/.test(readme), 'P0');

const secretPatterns = [
  /(?:live_secret|restricted_live|webhook_secret)_[A-Za-z0-9]{16,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/
];
const deliveryText = manifest.delivery.files
  .filter(name => existsSync(join(DELIVERY_ROOT, name)) && name !== 'ARQUIVOS-V198-SHA256.txt')
  .map(readDelivery).join('\n');
check('delta sem segredo material', !secretPatterns.some(pattern => pattern.test(deliveryText)), 'P0');
check('delta sem link WhatsApp', !/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(deliveryText), 'P0');

const frozen = Object.freeze({
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
});
for (const [name, expected] of Object.entries(frozen)) {
  check(`congelado presente: ${name}`, existsSync(join(SITE_ROOT, name)), 'P0');
  check(`congelado intacto: ${name}`, existsSync(join(SITE_ROOT, name)) && sha256(SITE_ROOT, name) === expected, 'P0');
}

const v197 = spawnSync(process.execPath, [join(SITE_ROOT, 'QA-V197-RELEASE-CANDIDATE.mjs')], { cwd: SITE_ROOT, encoding: 'utf8', timeout: 180000 });
check('V197 continua 1221/1221', v197.status === 0 && /1221\/1221 PASS/.test(v197.stdout) && /P0=0 P1=0/.test(v197.stdout), 'P0', (v197.stderr || v197.stdout || '').slice(-500));

const hashFile = readDelivery('ARQUIVOS-V198-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const hashEntries = new Map(hashFile.map(line => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  return match ? [match[2], match[1]] : ['', ''];
}));
const hashTargets = manifest.delivery.files.filter(name => !['ARQUIVOS-V198-SHA256.txt', 'EVIDENCIA-QA-V198.json'].includes(name));
check('checksums cobrem arquivos estaveis', hashTargets.every(name => hashEntries.has(name)) && hashEntries.size === hashTargets.length, 'P0');
for (const name of hashTargets) check(`checksum valido: ${name}`, hashEntries.get(name) === sha256(DELIVERY_ROOT, name), 'P0');

warnings.push('Produção, DNS, backend, e-mail real, cobrança, lojas e Orbe IA Sol permanecem bloqueados.');
warnings.push('Testes físicos, dados de campo e aprovações externas não podem ser fabricados por esta suíte.');
warnings.push('Revisar changelogs e políticas oficiais novamente no dia de cada ativação autorizada.');
const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project: 'Divina Bruxa',
  version: 198,
  suite: 'Macroetapa 17 - Plano de Producao',
  generated_at: new Date().toISOString(),
  total: passes.length + failures.length,
  passed: passes.length,
  failed: failures.length,
  gate: { p0, p1, package_approved: p0 === 0 && p1 === 0 },
  scope: { runtime_files_changed: 0, external_writes: 0, production_activated: false },
  gates: { total: gateContract.gates.length, external_blocked: gateContract.gates.filter(gate => gate.external_mutation && gate.status === 'blocked').length, local_pending: gateContract.gates.filter(gate => !gate.external_mutation && gate.status === 'pending').length },
  authorization: { installation_counts: false, granted_by_v198: [] },
  frozen_hashes: frozen,
  prior_release: { version: 197, expected: '1221/1221', passed: v197.status === 0 && /1221\/1221 PASS/.test(v197.stdout) },
  warnings,
  failures
};
if (process.env.V198_QA_NO_WRITE !== '1') writeFileSync(join(DELIVERY_ROOT, 'EVIDENCIA-QA-V198.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`DIVINA BRUXA V198 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log(`RUNTIME=0 EXTERNAL_WRITES=0 EXTERNAL_GATES_BLOCKED=${evidence.gates.external_blocked}`);
if (failures.length) {
  for (const failure of failures) console.error(`[${failure.severity}] ${failure.name}${failure.detail ? ` :: ${failure.detail}` : ''}`);
  process.exitCode = 1;
}

