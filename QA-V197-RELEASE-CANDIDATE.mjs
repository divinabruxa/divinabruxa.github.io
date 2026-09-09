import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(join(ROOT, name), 'utf8');
const sha256 = name => createHash('sha256').update(readFileSync(join(ROOT, name))).digest('hex');
const files = readdirSync(ROOT).filter(name => statSync(join(ROOT, name)).isFile()).sort();
const htmlFiles = files.filter(name => extname(name) === '.html');
const jsFiles = files.filter(name => /\.(?:js|mjs)$/.test(name));
const cssFiles = files.filter(name => extname(name) === '.css');
const jsonFiles = files.filter(name => extname(name) === '.json' || name === 'manifest.webmanifest');
const passes = [];
const failures = [];
const warnings = [];
const check = (name, condition, severity = 'P1', detail = '') => {
  const item = { name, severity, ...(detail ? { detail } : {}) };
  if (condition) passes.push(item); else failures.push(item);
};

const manifest = JSON.parse(read('MANIFESTO-V197-QA-FINAL.json'));
const contract = JSON.parse(read('RELEASE-CANDIDATE-CONTRACT-V197.json'));
for (const name of manifest.delivery.files) {
  check(`delta presente: ${name}`, existsSync(join(ROOT, name)), 'P0');
  check(`delta nao vazio: ${name}`, existsSync(join(ROOT, name)) && statSync(join(ROOT, name)).size > 0, 'P0');
  check(`delta plano: ${name}`, !name.includes('/') && !name.includes('\\'), 'P0');
}
check('manifesto identifica V197', manifest.version === 197 && manifest.base_required === 'V196 instalada', 'P0');
check('delta sem exclusoes', manifest.delivery.type === 'flat-delta' && manifest.delivery.delete_existing_files === false, 'P0');
check('delta sem duplicatas', new Set(manifest.delivery.files).size === manifest.delivery.files.length, 'P0');

const frozen = Object.freeze({
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
});
for (const [name, expected] of Object.entries(frozen)) {
  check(`congelado presente: ${name}`, existsSync(join(ROOT, name)), 'P0');
  check(`congelado intacto: ${name}`, existsSync(join(ROOT, name)) && sha256(name) === expected, 'P0');
}

const v196 = spawnSync(process.execPath, [join(ROOT, 'QA-V196-PWA-WCAG-PERFORMANCE.mjs')], { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
check('suite V196 continua aprovada', v196.status === 0 && /1169\/1169 PASS/.test(v196.stdout), 'P0', (v196.stderr || v196.stdout || '').slice(-500));

check('inventario HTML material', htmlFiles.length >= 150, 'P0', String(htmlFiles.length));
check('inventario JavaScript material', jsFiles.length >= 250, 'P1', String(jsFiles.length));
check('inventario CSS material', cssFiles.length >= 150, 'P1', String(cssFiles.length));

for (const name of htmlFiles) {
  const source = read(name);
  check(`${name}: documento nao vazio`, source.trim().length > 100, 'P0');
  check(`${name}: doctype`, /<!doctype html>/i.test(source), 'P1');
  check(`${name}: idioma declarado`, /<html[^>]+lang="[^"]+"/i.test(source), 'P1');
  check(`${name}: titulo`, /<title>[^<]+<\/title>/i.test(source), 'P1');
  check(`${name}: viewport acessivel`, /<meta[^>]+name="viewport"[^>]*>/i.test(source) && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(source), 'P0');
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  check(`${name}: IDs unicos`, duplicateIds.length === 0, 'P1', duplicateIds.join(', '));
  check(`${name}: sem link javascript`, !/(?:href|src)="javascript:/i.test(source), 'P0');
}

const skipLocal = raw => !raw || raw === './' || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|blob:)/i.test(raw) || raw.includes('${') || raw.includes('{{');
const unresolved = [];
for (const page of htmlFiles) {
  const source = read(page);
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].trim();
    if (skipLocal(raw)) continue;
    let target = raw.split(/[?#]/)[0].replace(/^\/+/, '');
    if (!target) continue;
    try { target = decodeURIComponent(target); } catch {}
    target = normalize(target).replace(/^\.\//, '');
    if (target.startsWith('..')) {
      unresolved.push(`${page} -> ${raw} (fora da raiz)`);
      continue;
    }
    const candidates = [target];
    if (target.endsWith('/')) candidates.push(`${target}index.html`);
    if (!extname(target)) candidates.push(`${target}.html`);
    if (!candidates.some(candidate => existsSync(join(ROOT, candidate)))) unresolved.push(`${page} -> ${raw}`);
  }
}
check('referencias HTML locais resolvidas', unresolved.length === 0, 'P0', unresolved.slice(0, 30).join('; '));

const scriptSyntaxFailures = [];
for (const name of jsFiles) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: read(name), encoding: 'utf8', timeout: 15000 });
  if (result.status !== 0) scriptSyntaxFailures.push(`${name}: ${(result.stderr || '').split('\n').slice(-3).join(' ')}`);
}
check('JavaScript e modulos sem erro de sintaxe', scriptSyntaxFailures.length === 0, 'P0', scriptSyntaxFailures.slice(0, 20).join('; '));

const jsonFailures = [];
for (const name of jsonFiles) {
  try { JSON.parse(read(name)); } catch (error) { jsonFailures.push(`${name}: ${error.message}`); }
}
check('JSON e manifesto validos', jsonFailures.length === 0, 'P0', jsonFailures.join('; '));

const cssFailures = [];
for (const name of cssFiles) {
  const source = read(name).replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
  let depth = 0;
  for (const char of source) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth < 0) break;
  }
  if (depth !== 0) cssFailures.push(`${name}: balance=${depth}`);
}
check('CSS com blocos balanceados', cssFailures.length === 0, 'P0', cssFailures.join('; '));

const index = read('index.html');
const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"');
const home = homeStart >= 0 && tarotStart > homeStart ? index.slice(homeStart, tarotStart) : '';
check('Home identificada antes do Tarot', home.length > 0, 'P0');
check('Home somente com titulo e palco da Orbe', /home-orb-only-v194/.test(home) && /<h1>Orbe das<br>Realidades/.test(home) && /class="orb-stage-ref"/.test(home), 'P0');
check('Home sem cards editoriais', !/portal-card|editorial-card|intl-grid|content-card/.test(home), 'P0');
check('Home com uma Orbe e um canvas', (home.match(/id="orb"/g) || []).length === 1 && (home.match(/id="orbCanvas"/g) || []).length === 1, 'P0');
check('duplo toque abre Tarot Livre', /toque duplo abre o Tarot Livre/i.test(home) && /dblclick|double/i.test(read('orb-engine-v68.js') + read('app.js')), 'P0');
for (const [name, title] of [['english.html', 'Orb of<br>Realities'], ['espanol.html', 'Orbe de las<br>Realidades']]) {
  const source = read(name);
  check(`${name}: titulo localizado e Orbe viva`, source.includes(`<h1>${title}</h1>`) && /id="orbCanvas"/.test(source), 'P0');
  check(`${name}: sem cards na Home`, !/intl-grid|intl-section|intl-stats/.test(source.slice(source.indexOf('<main'), source.indexOf('</main>'))), 'P0');
}

const tarotData = await import(`${pathToFileURL(join(ROOT, 'tarot-data.js')).href}?qa=197`);
check('Tarot tem 78 cartas', Array.isArray(tarotData.CARDS) && tarotData.CARDS.length === 78, 'P0');
check('Tarot tem 78 IDs unicos', new Set(tarotData.CARDS.map(card => card.canonicalId)).size === 78, 'P0');
check('Tarot tem 78 imagens unicas', new Set(tarotData.CARDS.map(card => card.image)).size === 78, 'P0');
check('Tarot somente normal', tarotData.REQUIRED_ORIENTATION === 'normal' && tarotData.CARDS.every(card => card.orientation === 'normal'), 'P0');
const intlTarot = await import(`${pathToFileURL(join(ROOT, 'international-tarot-v195.js')).href}?qa=197`);
let decksValid = true;
for (let run = 0; run < 50; run += 1) {
  const deck = intlTarot.shuffleCanonicalDeck();
  decksValid &&= deck.length === 78 && new Set(deck.map(card => card.canonicalId)).size === 78 && deck.every(card => card.orientation === 'normal');
}
check('50 embaralhamentos sem repeticao ou inversao', decksValid, 'P0');
check('Tarot Livre nao importa significados', !/meaning-engine|tarot-meanings/.test(read('international-tarot-v195.js')), 'P0');
check('Mesa Real permanece 13x6', /13 (?:fileiras|×)\s*[·x×]?\s*6 (?:posições|colunas)|13 × 6/.test(read('tarot-livre.html')) && ['free-tarot-reading.html', 'tarot-libre.html'].every(name => /aria-rowcount="13" aria-colcount="6"/.test(read(name))), 'P0');

const editorialCatalog = await import(`${pathToFileURL(join(ROOT, 'editorial-catalog-v192.js')).href}?qa=197`);
check('catalogo editorial restaura 21 produtos', editorialCatalog.STORE_PRODUCTS_V192.length === 21, 'P0');
check('catalogo musical restaura 2 albuns', editorialCatalog.MUSIC_ALBUMS_V192.length === 2, 'P0');
check('verdade editorial mantem 0 episodios inventados', editorialCatalog.VIDEO_EPISODES_V192.length === 0, 'P0');
check('restauracao editorial nao publica nem escreve fora', editorialCatalog.EDITORIAL_RELEASE_V192.productionPublished === false && editorialCatalog.EDITORIAL_RELEASE_V192.externalWrites === false, 'P0');
for (const name of ['loja-mistica.html', 'musica.html', 'de-frente-com-o-tarot.html']) {
  const source = read(name);
  check(`${name}: manifesto e runtime PWA`, /manifest\.webmanifest\?v=196/.test(source) && /pwa-world-v196\.js\?v=196/.test(source), 'P0');
  check(`${name}: volta para a Orbe`, /href="\.\/"/.test(source), 'P1');
}
const portalGuard = spawnSync(process.execPath, [join(ROOT, 'portal-guard-v10.mjs')], { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
check('verificador de transicoes volta a executar', portalGuard.status === 0 && /"status": "PASS"/.test(portalGuard.stdout), 'P1', (portalGuard.stderr || portalGuard.stdout || '').slice(-300));

const webmanifest = JSON.parse(read('manifest.webmanifest'));
check('PWA standalone e no escopo', webmanifest.id === './' && webmanifest.start_url === './' && webmanifest.scope === './' && webmanifest.display === 'standalone', 'P0');
check('PWA possui icones any e maskable', webmanifest.icons.some(icon => icon.purpose === 'any') && webmanifest.icons.some(icon => icon.purpose === 'maskable'), 'P0');
check('service worker atual V196', /SERVICE WORKER V66[\s\S]*V196/.test(read('sw.js')) && /divina-bruxa-v66-/.test(read('sw.js')), 'P0');
check('offline localizado PT EN ES', ['offline.html', 'offline-en.html', 'offline-es.html'].every(name => read('sw.js').includes(`./${name}`)), 'P0');
check('paginas editoriais entram no cache offline', ['loja-mistica.html', 'musica.html', 'de-frente-com-o-tarot.html'].every(name => read('sw.js').includes(`./${name}`)), 'P0');
check('dependencias editoriais entram no cache offline', ['editorial-catalog-v192.js', 'editorial-metrics-v192.js', 'editorial-journey-v192.js', 'media-engine-v192.js', 'media-policy-v192.js', 'store-engine.js'].every(name => read('sw.js').includes(`./${name}`)), 'P0');
check('autoridade online nao entra em cache', /authorityNetworkOnly/.test(read('sw.js')) && /authorization/.test(read('sw.js')) && /no-store\|private/.test(read('sw.js')), 'P0');

const criticalRoutes = [
  'index.html', 'tarot-livre.html', 'carta-do-dia.html', 'tiragens-de-tarot.html', 'escola-do-tarot.html',
  'diario-de-tarot.html', 'consultas-de-tarot.html', 'cartas-do-tarot.html', 'loja-mistica.html', 'musica.html',
  'de-frente-com-o-tarot.html', 'privacidade-e-dados.html', 'acessibilidade.html', 'english.html', 'espanol.html'
];
for (const name of criticalRoutes) check(`rota critica presente: ${name}`, existsSync(join(ROOT, name)) && statSync(join(ROOT, name)).size > 500, 'P0');

const secretPatterns = [
  /sk_live_[A-Za-z0-9]{16,}/,
  /rk_live_[A-Za-z0-9]{16,}/,
  /whsec_[A-Za-z0-9]{16,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/
];
const secretHits = [];
for (const name of files.filter(name => /\.(?:html|js|mjs|json|css|ts|sql)$/.test(name))) {
  const source = read(name);
  if (secretPatterns.some(pattern => pattern.test(source))) secretHits.push(name);
}
check('nenhum segredo material embutido', secretHits.length === 0, 'P0', secretHits.join(', '));
const publicHtml = htmlFiles.map(read).join('\n');
check('nenhum link de WhatsApp publicado', !/(?:href|src)="[^"]*(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(publicHtml), 'P0');
check('email oficial presente', /orbedasrealidades@hotmail\.com/i.test(read('contato.html') + read('contact.html') + read('contacto.html')), 'P0');

check('producao bloqueada', contract.release_blocks.production_publish_authorized === false && manifest.preserved_contracts.production_publish_authorized === false, 'P0');
check('DNS bloqueado', contract.release_blocks.dns_changes_authorized === false && manifest.preserved_contracts.dns_changes_authorized === false, 'P0');
check('billing real bloqueado', contract.release_blocks.real_billing_authorized === false && manifest.preserved_contracts.real_billing_authorized === false, 'P0');
check('lojas bloqueadas', contract.release_blocks.store_submission_authorized === false && manifest.preserved_contracts.app_store_submission_authorized === false, 'P0');
check('Orbe IA Sol desligada', contract.release_blocks.orbe_ai_sol_enabled === false && manifest.preserved_contracts.sol_enabled === false, 'P0');

warnings.push('Testes fisicos iPhone/Android, VoiceOver/TalkBack e rede real permanecem pos-instalacao.');
warnings.push('Core Web Vitals p75 depende de amostras reais com consentimento e nao e inventado pelo QA do pacote.');
warnings.push('Backend STAGING, billing sandbox, aprovacao juridica e publicacao continuam como portoes externos.');
const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project: 'Divina Bruxa',
  version: 197,
  suite: 'Macroetapa 16 - QA Final / Release Candidate',
  generated_at: new Date().toISOString(),
  inventory: { total_files: files.length, html: htmlFiles.length, javascript: jsFiles.length, css: cssFiles.length, json_and_manifest: jsonFiles.length },
  total: passes.length + failures.length,
  passed: passes.length,
  failed: failures.length,
  gate: { p0, p1, package_approved: p0 === 0 && p1 === 0 },
  coverage: { home: 'title + living Orb only', tarot_cards: 78, royal_table: '13x6', languages: ['pt-BR', 'en', 'es'], html_local_reference_failures: unresolved.length, javascript_syntax_failures: scriptSyntaxFailures.length, json_parse_failures: jsonFailures.length, css_balance_failures: cssFailures.length },
  frozen_hashes: frozen,
  field_validation: { status: 'pending-after-installation', items: contract.quality_gate.field_items },
  warnings,
  failures
};
writeFileSync(join(ROOT, 'EVIDENCIA-QA-V197.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`DIVINA BRUXA V197 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log(`HTML=${htmlFiles.length} JS=${jsFiles.length} CSS=${cssFiles.length} JSON=${jsonFiles.length}`);
if (failures.length) {
  for (const failure of failures) console.error(`[${failure.severity}] ${failure.name}${failure.detail ? ` :: ${failure.detail}` : ''}`);
  process.exitCode = 1;
}
