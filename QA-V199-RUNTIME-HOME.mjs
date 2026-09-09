import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const DELIVERY_ROOT = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = process.env.V199_SITE_ROOT || DELIVERY_ROOT;
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

const manifest = JSON.parse(readDelivery('MANIFESTO-V199-RESGATE-RUNTIME-HOME.json'));
const contract = JSON.parse(readDelivery('RUNTIME-RECOVERY-CONTRACT-V199.json'));
const cacheContract = JSON.parse(readDelivery('CACHE-MIGRATION-V199.json'));
const index = readSite('index.html');
const app = readSite('app-v199.js');
const pwa = readSite('pwa-world-v199.js');
const homeCss = readSite('home-orb-absolute-v199.css');
const sw = readSite('sw.js');
const config = readSite('config-v199.js');

check('manifesto identifica V199 sobre V198', manifest.version === 199 && manifest.base_required === 'V198 instalada', 'P0');
check('macroetapa correta', manifest.release === 'plano-supremo-2.0-macroetapa-1-resgate-runtime-home', 'P0');
check('delta plano e aditivo', manifest.delivery.type === 'flat-delta' && manifest.delivery.directories_inside_zip === 0 && manifest.delivery.delete_existing_files === false, 'P0');
check('delta tem 13 arquivos', manifest.delivery.files.length === 13, 'P0', String(manifest.delivery.files.length));
check('delta sem duplicatas', new Set(manifest.delivery.files).size === manifest.delivery.files.length, 'P0');
for (const name of manifest.delivery.files) {
  check(`delta presente: ${name}`, existsSync(join(DELIVERY_ROOT, name)), 'P0');
  check(`delta nao vazio: ${name}`, existsSync(join(DELIVERY_ROOT, name)) && statSync(join(DELIVERY_ROOT, name)).size > 0, 'P0');
  check(`delta plano: ${name}`, !name.includes('/') && !name.includes('\\'), 'P0');
}

check('runtime V199 usa entrada de nome novo', /src="app-v199\.js\?v=199"/.test(index), 'P0');
check('index abandona entrada V196', !/src="app\.js\?v=196"/.test(index), 'P0');
check('Home usa CSS V199 de nome novo', /href="home-orb-absolute-v199\.css\?v=199"/.test(index), 'P0');
check('index abandona CSS V194', !/href="home-orb-absolute-v194\.css\?v=194"/.test(index), 'P0');
check('entrada usa config V199 unica', /from '\.\/config-v199\.js\?v=199'/.test(app), 'P0');
check('entrada usa PWA V199 unica', /import '\.\/pwa-world-v199\.js\?v=199'/.test(app), 'P0');
check('entrada registra SW V199', /register\('\.\/sw\.js\?v=199'\)/.test(app), 'P0');
check('PWA identifica V199', /const VERSION = 199;/.test(pwa), 'P0');
check('PWA registra SW V199', /register\('\.\/sw\.js\?v=199'\)/.test(pwa), 'P0');
check('runtime inicia navegacao', /await navigation\.start\(\)/.test(app), 'P0');
check('runtime publica appShell apos iniciar', /dataset\.appShell = 'v180'/.test(app), 'P0');
check('runtime registra erro recuperavel', /dataset\.bootError = 'v180'/.test(app), 'P1');

const eagerImports = new Map();
const visitImports = name => {
  if (eagerImports.has(name)) return;
  if (!existsSync(join(SITE_ROOT, name))) {
    eagerImports.set(name, ['__MISSING__']);
    return;
  }
  const source = readSite(name);
  const deps = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)]
    .map(match => normalize(join(dirname(name), match[1].split(/[?#]/)[0])).replace(/^\.\//, ''))
    .filter(dep => /\.(?:js|mjs)$/.test(dep));
  eagerImports.set(name, deps);
  deps.forEach(visitImports);
};
visitImports('app-v199.js');
const missingImports = [...eagerImports].flatMap(([name, deps]) => deps.filter(dep => dep === '__MISSING__' || !existsSync(join(SITE_ROOT, dep))).map(dep => `${name} -> ${dep}`));
check('grafo de imports iniciais completo', missingImports.length === 0, 'P0', missingImports.join('; '));
const visiting = new Set();
const visited = new Set();
const cycles = [];
const detectCycles = (name, stack = []) => {
  if (visiting.has(name)) {
    cycles.push([...stack, name].join(' -> '));
    return;
  }
  if (visited.has(name)) return;
  visiting.add(name);
  for (const dep of eagerImports.get(name) || []) if (dep !== '__MISSING__') detectCycles(dep, [...stack, name]);
  visiting.delete(name);
  visited.add(name);
};
detectCycles('app-v199.js');
check('grafo inicial sem ciclo de modulo', cycles.length === 0, 'P0', cycles.join('; '));
check('catalogo editorial fora do boot critico', !eagerImports.has('editorial-catalog-v192.js'), 'P0');
check('config V199 sem import circular', !/\b(?:import|export)\b[^\n]*\bfrom\b/.test(config), 'P0');

const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"');
const home = homeStart >= 0 && tarotStart > homeStart ? index.slice(homeStart, tarotStart) : '';
check('Home identificada antes do Tarot', home.length > 0, 'P0');
check('Home conserva titulo da Orbe', /<h1>Orbe das<br>Realidades/.test(home), 'P0');
check('Home conserva palco e canvas da Orbe', /class="orb-stage-ref"/.test(home) && /id="orbCanvas"/.test(home), 'P0');
check('Home tem classe protegida V194', /id="home" class="screen active home-screen home-orb-only-v194"/.test(home), 'P0');
check('CSS fail-closed nao depende de data-runtime', /#app > #home\.home-orb-only-v194\.active > :not\(\.home-copy\):not\(\.orb-stage-ref\)/.test(homeCss), 'P0');
check('CSS fail-closed esconde extras com important', /:not\(\.home-copy\):not\(\.orb-stage-ref\)[\s\S]*display: none !important;[\s\S]*visibility: hidden !important;/.test(homeCss), 'P0');
check('CSS conserva titulo', /#app > #home\.home-orb-only-v194\.active > \.home-copy[\s\S]*display: block !important/.test(homeCss), 'P0');
check('CSS conserva palco da Orbe', /#app > #home\.home-orb-only-v194\.active > \.orb-stage-ref[\s\S]*display: grid !important/.test(homeCss), 'P0');
check('CSS bloqueia rolagem na Home', /body:has\(#app > #home\.home-orb-only-v194\.active\)[\s\S]*overflow: hidden !important/.test(homeCss), 'P0');
check('CSS nao altera canvas ou motor', !/canvas\s*\{|filter\s*:|mix-blend-mode\s*:/.test(homeCss), 'P1');

check('SW identifica V199', /const VERSION = 199;/.test(sw), 'P0');
for (const cacheName of ['divina-bruxa-v199-shell', 'divina-bruxa-v199-content', 'divina-bruxa-v199-images', 'divina-bruxa-v199-tarot-offline']) {
  check(`cache V199 presente: ${cacheName}`, sw.includes(cacheName), 'P0');
}
check('SW nao conserva cache V195', !/PREVIOUS_CACHE|divina-bruxa-v65-international-v195/.test(sw), 'P0');
check('SW remove caches antigos', /key\.startsWith\(OWNED_PREFIX\) && !ACTIVE_CACHES\.has\(key\)/.test(sw), 'P0');
check('SW reivindica clientes', /self\.clients\.claim\(\)/.test(sw), 'P0');
check('SW ativa sem espera', /self\.skipWaiting\(\)/.test(sw), 'P0');
for (const asset of ['./app-v199.js', './config-v199.js', './pwa-world-v199.js', './home-orb-absolute-v199.css']) {
  check(`SW prepara ${asset}`, sw.includes(`'${asset}'`), 'P0');
}
check('SW valida shell V199 antes de cachear', sw.includes('app-v199\\.js\\?v=199') && sw.includes('home-orb-absolute-v199\\.css\\?v=199'), 'P0');
check('SW usa network-first para estaticos', /event\.respondWith\(networkFirst\(request\)\)/.test(sw), 'P0');
check('SW mantem autoridade network-only', /authorityNetworkOnly/.test(sw) && /cache-control': 'no-store/.test(sw), 'P0');
check('contrato de cache nao retem legado', cacheContract.service_worker_transition.retain_legacy_caches === false, 'P0');
check('contrato exige primeiro boot online', cacheContract.first_online_boot_required === true, 'P1');
check('contrato registra entrada unica', cacheContract.entrypoint_transition.to === 'app-v199.js?v=199', 'P0');
check('contrato registra network-first', cacheContract.static_assets.online_strategy === 'network-first', 'P0');
check('contrato proibe cache de autoridade', cacheContract.authority_requests.strategy === 'network-only' && cacheContract.authority_requests.cache_allowed === false, 'P0');

const routes = contract.boot.deep_links;
check('contrato possui 16 rotas', routes.length === 16 && new Set(routes).size === 16, 'P0');
const routeRegistry = readSite('route-registry-v180.js');
for (const route of routes) check(`deep link mapeado: ${route}`, routeRegistry.includes(`'${route}'`) || route === 'home', 'P1');
check('Home contratada apenas titulo e Orbe', contract.home.visible_content.join('|') === 'localized_orb_title|living_orb' && contract.home.content_cards_allowed === false && contract.home.editorial_blocks_allowed === false, 'P0');
check('Home fail-closed contratada', contract.home.hidden_even_if_javascript_fails === true, 'P0');
check('Home sem rolagem contratada', contract.home.scroll_locked === true, 'P0');
check('escopo nao altera Orbe/menu/Tarot', manifest.scope.orb_engine_changed === false && manifest.scope.mini_orb_changed === false && manifest.scope.menu_changed === false && manifest.scope.tarot_changed === false, 'P0');
check('escopo nao altera precos', manifest.scope.prices_changed === false, 'P0');

const pricePairs = [
  ['Mesa Real', 250], ['Leitura de Mentes', 150], ['Carta de Conselho', 100], ['Pergunta', 50]
];
for (const [label, price] of pricePairs) {
  check(`contrato preserva ${label} R$${price}`, Object.values(contract.commercial_truth_preserved).includes(price), 'P0');
}
check('config preserva Mesa Real R$250', /name:'Mesa Real Profissional',price:250/.test(config), 'P0');
check('config preserva Leitura de Mentes R$150', /name:'Leitura de Mentes',price:150/.test(config), 'P0');
check('config preserva Conselho R$100', /name:'Carta de Conselho',price:100/.test(config), 'P0');
check('config preserva Pergunta R$50', /name:'Pergunta Direta',price:50/.test(config), 'P0');

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
check('Tarot contratual intacto', contract.frozen.tarot_cards === 78 && contract.frozen.tarot_orientation === 'normal-only' && contract.frozen.free_tarot_repetition === false && contract.frozen.free_tarot_meanings === false && contract.frozen.royal_table === '13x6', 'P0');

for (const name of ['app-v199.js', 'config-v199.js', 'pwa-world-v199.js', 'sw.js', 'QA-V199-RUNTIME-HOME.mjs']) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: readDelivery(name), encoding: 'utf8', timeout: 20000 });
  check(`${name}: sintaxe JavaScript`, result.status === 0, 'P0', result.stderr?.slice(-400) || '');
}
for (const name of manifest.delivery.files.filter(name => extname(name) === '.json')) {
  let valid = true;
  try { JSON.parse(readDelivery(name)); } catch { valid = false; }
  check(`${name}: JSON valido`, valid, 'P0');
}

const localRefs = [...index.matchAll(/(?:href|src)="([^"#]+)"/g)]
  .map(match => match[1].split(/[?#]/)[0])
  .filter(value => value && !/^(?:https?:|mailto:|data:|blob:)/.test(value) && value !== './');
const missingRefs = [...new Set(localRefs.filter(name => !existsSync(join(SITE_ROOT, name))))];
check('referencias locais do index resolvidas', missingRefs.length === 0, 'P0', missingRefs.join(', '));

const secretPatterns = [
  /(?:live_secret|restricted_live|webhook_secret)_[A-Za-z0-9]{16,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/
];
const deliveryText = manifest.delivery.files.filter(name => !['ARQUIVOS-V199-SHA256.txt', 'EVIDENCIA-QA-V199.json'].includes(name)).map(readDelivery).join('\n');
check('delta sem segredo material', !secretPatterns.some(pattern => pattern.test(deliveryText)), 'P0');
check('delta sem link WhatsApp', !/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(deliveryText), 'P0');
check('todos os bloqueios continuam falsos', Object.values(contract.release_blocks).every(value => value === false) && Object.values(manifest.preserved_contracts).every(value => value === false), 'P0');

const v197 = spawnSync(process.execPath, [join(SITE_ROOT, 'QA-V197-RELEASE-CANDIDATE.mjs')], { cwd: SITE_ROOT, encoding: 'utf8', timeout: 180000 });
const v197Output = `${v197.stdout || ''}\n${v197.stderr || ''}`;
check('regressao V197 preserva 1219 checks', /1219\/1221 PASS/.test(v197Output), 'P0', v197Output.slice(-800));
check('regressao V197 diverge somente em 2 portoes versionados', /P0=2 P1=0/.test(v197Output) && /suite V196 continua aprovada/.test(v197Output) && /service worker atual V196/.test(v197Output), 'P0', v197Output.slice(-800));

const hashLines = readDelivery('ARQUIVOS-V199-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const hashEntries = new Map(hashLines.map(line => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  return match ? [match[2], match[1]] : ['', ''];
}));
const hashTargets = manifest.delivery.files.filter(name => !['ARQUIVOS-V199-SHA256.txt', 'EVIDENCIA-QA-V199.json'].includes(name));
check('checksums cobrem arquivos estaveis', hashTargets.every(name => hashEntries.has(name)) && hashEntries.size === hashTargets.length, 'P0');
for (const name of hashTargets) check(`checksum valido: ${name}`, hashEntries.get(name) === sha256(DELIVERY_ROOT, name), 'P0');

warnings.push('O primeiro carregamento apos instalar a V199 precisa estar online para receber os arquivos de nome novo.');
warnings.push('Validacao fisica em iPhone/PWA e Android/PWA permanece necessaria depois da instalacao.');
warnings.push('Producao, DNS, cobranca real, lojas e Orbe IA Sol permanecem bloqueados.');
const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project: 'Divina Bruxa',
  version: 199,
  suite: 'Plano Supremo 2.0 - Macroetapa 1 - Resgate Runtime e Home',
  generated_at: new Date().toISOString(),
  total: passes.length + failures.length,
  passed: passes.length,
  failed: failures.length,
  gate: { p0, p1, package_approved: p0 === 0 && p1 === 0 },
  recovery: { unique_entrypoint: true, cache_generation: 199, static_strategy: 'network-first', eager_import_cycles: cycles.length },
  home: { visible_contract: ['localized_orb_title', 'living_orb'], fail_closed: true, scroll_locked: true },
  commercial_truth: contract.commercial_truth_preserved,
  frozen_hashes: frozen,
  legacy_regression: { expected_total: 1221, preserved: 1219, intended_version_gate_differences: 2 },
  external_actions: { production: false, dns: false, real_billing: false, stores: false, sol: false },
  warnings,
  failures
};
if (process.env.V199_QA_NO_WRITE !== '1') writeFileSync(join(DELIVERY_ROOT, 'EVIDENCIA-QA-V199.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`DIVINA BRUXA V199 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log(`BOOT=V199 CACHE=V199 HOME=TITLE+ORB PRICES=250/150/100/50`);
if (failures.length) {
  for (const failure of failures) console.error(`[${failure.severity}] ${failure.name}${failure.detail ? ` :: ${failure.detail}` : ''}`);
  process.exitCode = 1;
}
