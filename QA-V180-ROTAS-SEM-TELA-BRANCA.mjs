import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const bytes = file => fs.statSync(path.join(root, file)).size;
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, pass: Boolean(condition), ...(detail ? { detail } : {}) });

const packageFiles = [
  'index.html',
  'sw.js',
  'app.js',
  'navigation.js',
  'page-loader-v1.js',
  'route-registry-v180.js',
  'route-recovery-v180.css',
  'BUILD-V180-SHELL.mjs',
  'divina-shell-v180.css',
  'MANIFESTO-RUNTIME-V180.json',
  'QA-V180-ROTAS-SEM-TELA-BRANCA.mjs',
  '00-LEIA-PRIMEIRO-V180-ROTAS-SEM-TELA-BRANCA.txt',
  'ARQUIVOS-V180-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));

const index = read('index.html');
const sw = read('sw.js');
const app = read('app.js');
const navigation = read('navigation.js');
const loader = read('page-loader-v1.js');
const recoveryCss = read('route-recovery-v180.css');
const shell = read('divina-shell-v180.css');
const manifest = JSON.parse(read('MANIFESTO-RUNTIME-V180.json'));
const registryUrl = `${pathToFileURL(path.join(root, 'route-registry-v180.js')).href}?qa=${Date.now()}`;
const registry = await import(registryUrl);

check('release:v180', manifest.release === 'DIVINA-BRUXA-V180-ROTAS-SEM-TELA-BRANCA');
check('rotas:17', registry.ROUTES_V180.length === 17 && new Set(registry.ROUTES_V180.map(route => route.id)).size === 17);
check('rotas:15-modulos', registry.ROUTES_V180.filter(route => route.module).length === 15);
check('rotas:13-visuais-adiados', registry.ROUTES_V180.filter(route => route.portalStyles).length === 13);
check('rotas:desconhecida-inicio', registry.normalizeRouteId('realidade-inexistente') === 'home');
const aliases = {
  inicio: 'home', 'tarot-livre': 'tarot', 'carta-do-dia': 'daily', biblioteca: 'library',
  'escola-do-tarot': 'school', tiragens: 'spreads', 'orbe-ia': 'ai', diario: 'journal',
  loja: 'store', consultas: 'consultations', premium: 'subscriptions', 'skins-da-orbe': 'skins',
  video: 'videos', musica: 'music', notificacoes: 'notifications', conta: 'login', painel: 'admin'
};
Object.entries(aliases).forEach(([alias, expected]) => check(`alias:${alias}`, registry.normalizeRouteId(alias) === expected));

const styleLinks = [...index.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)/gi)].map(match => match[1]);
check('entrada:um-css', styleLinks.length === 1, styleLinks.join(','));
check('entrada:shell-v180', styleLinks[0] === 'divina-shell-v180.css?v=180');
check('entrada:id-css', index.includes('id="divinaCoreStyles"'));
check('entrada:css-load-error', index.includes("dataset.coreStyles='loaded'") && index.includes("dataset.coreStyles='error'"));
check('entrada:fallback-critico', index.includes('id="divinaCriticalFallback"') && index.includes('html:not([data-core-styles="v180"])'));
check('entrada:app-v180', index.includes('app.js?v=180'));
check('entrada:sw-v180', index.includes('sw.js?v=180') && index.includes('divina.sw.reload.v180'));
check('entrada:menu-v177', index.includes('menu-completo-v177.js?v=177'));
check('entrada:biblioteca', index.includes('id="library"') && index.includes('id="cardLibraryApp"'));
check('entrada:tarot-livre', index.includes('id="tarot"') && index.includes('DIRETA · SEM SIGNIFICADO'));
check('entrada:mesa-13x6', index.includes('aria-rowcount="13"') && index.includes('aria-colcount="6"'));
[250, 150, 100, 50].forEach(price => check(`consulta:index-preco-${price}`, index.includes(`R$ ${price}`)));

check('css:50-fontes-completas', manifest.styles.completeSourceCount === 50);
check('css:29-fontes-shell', manifest.styles.shellSourceCount === 29);
check('css:21-fontes-adiadas', manifest.styles.deferredSourceCount === 21);
check('css:um-addon', manifest.styles.shellAddonCount === 1 && manifest.styles.shellAddons[0] === 'route-recovery-v180.css');
check('css:reducao-maior-50', manifest.styles.shell.bytes < manifest.styles.completeBytes * .5, `${manifest.styles.shell.bytes}/${manifest.styles.completeBytes}`);
check('css:hash-shell', digest(shell) === manifest.styles.shell.sha256);
check('css:tamanho-shell', bytes('divina-shell-v180.css') === manifest.styles.shell.bytes);
check('css:full-v179-adiado', manifest.styles.deferredCompleteFile === 'divina-core-v179.css' && loader.includes("divina-core-v179.css?v=179"));
check('css:recovery-integrado', shell.includes('/* ── route-recovery-v180.css ── */') && shell.includes(recoveryCss.trim()));
manifest.styles.shellSources.forEach(source => check(`shell:marca:${source}`, shell.includes(`/* ── ${source} ── */`)));
manifest.styles.deferredSources.forEach(source => check(`shell:adiado:${source}`, !shell.includes(`/* ── ${source} ── */`)));

check('app:navegacao-v180', app.includes("navigation.js?v=180"));
check('app:loader-v180', app.includes("page-loader-v1.js?v=180"));
check('app:barreira-estilos', app.includes('waitForCoreStyles') && app.includes("getElementById('divinaCoreStyles')"));
check('app:assinatura-estilos', app.includes("getPropertyValue('--db-shell-v180')") && app.includes("dataset.coreStyles = 'v180'"));
check('app:preparar-antes', app.includes('navigation.setBeforeEnter(pageLoader.prepare)'));
check('app:inicio-protegido', app.indexOf('await waitForCoreStyles()') < app.indexOf('await navigation.start()'));
check('app:shell-pronto-v180', app.includes("dataset.appShell = 'v180'"));
check('app:camadas-opcionais', app.includes("safely('motor da Orbe'") && app.includes("safely('mídia cósmica'"));
check('app:aquecimento-so-nucleo', app.includes("pageLoader.warm(['tarot', 'daily'])") && !app.includes("pageLoader.warm(['tarot', 'consultations'"));

check('nav:registro-unico', navigation.includes("from './route-registry-v180.js?v=180'"));
check('nav:preparacao-assincrona', /const go = async[\s\S]+await beforeEnter\?\.\(id\)/.test(navigation));
check('nav:troca-protegida', navigation.includes('token !== navigationToken'));
check('nav:popstate', navigation.includes("addEventListener('popstate', syncFromLocation)"));
check('nav:hashchange', navigation.includes("addEventListener('hashchange', syncFromLocation)"));
check('nav:rota-canonica', navigation.includes('history.replaceState'));
check('nav:aria-hidden', navigation.includes("screen.setAttribute('aria-hidden'"));

check('loader:registro-unico', loader.includes("from './route-registry-v180.js?v=180'"));
check('loader:estilo-sob-demanda', loader.includes("routeNeedsPortalStyles(id) ? loadPortalStyles()"));
check('loader:valida-css-completo', loader.includes('sheet?.cssRules?.length > 100'));
check('loader:tempo-limite', loader.includes('const LOAD_TIMEOUT_MS = 15000') && loader.includes('withTimeout(loader()'));
check('loader:recuperacao', loader.includes('dataset.routeRecovery') && loader.includes('dataset.routeRetry'));
check('loader:retorno-inicio', loader.includes("home.dataset.go = 'home'"));
check('loader:retry-sem-reload', loader.includes('pageTasks.delete(route)') && !loader.includes('location.reload'));
check('loader:intencao-antecipada', loader.includes("document.addEventListener('pointerdown', primeFromIntent"));
check('loader:modulos-dinamicos', (loader.match(/import\('\.\//g) || []).length >= 18);
registry.ROUTES_V180.filter(route => route.module).forEach(route => check(`loader:motor:${route.id}`, loader.includes(`${route.id}:`)));

check('sw:cache-v180', sw.includes('divina-bruxa-v51-rotas-v180'));
check('sw:shell-core', sw.includes("'./divina-shell-v180.css'"));
check('sw:registro-core', sw.includes("'./route-registry-v180.js'"));
check('sw:visual-completo-adiado', !sw.includes("'./divina-core-v179.css'"));
check('sw:portais-pesados-adiados', !/\.\/(?:school|journal|store|admin|media|ai)-engine/.test(sw));
check('sw:sem-cache-v179', !sw.includes('divina-bruxa-v50-nucleo-v179'));

for (const file of ['app.js', 'navigation.js', 'page-loader-v1.js', 'route-registry-v180.js', 'sw.js', 'BUILD-V180-SHELL.mjs', 'QA-V180-ROTAS-SEM-TELA-BRANCA.mjs']) {
  try {
    execFileSync(process.execPath, ['--check', path.join(root, file)]);
    check(`sintaxe:${file}`, true);
  } catch {
    check(`sintaxe:${file}`, false);
  }
}

const hashLines = read('ARQUIVOS-V180-SHA256.txt').trim().split(/\r?\n/);
check('pacote:12-hashes', hashLines.length === 12);
for (const line of hashLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-28)}`, match);
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && digest(fs.readFileSync(path.join(root, match[2]))) === match[1]);
}

const fullProject = exists('tarot-data.js') && exists('tarot-session.js') && exists('consultation-policy.js') && exists('divina-core-v179.css');
if (fullProject) {
  const shellBuildSources = [...manifest.styles.shellSources, ...manifest.styles.shellAddons];
  const chunks = shellBuildSources.map(source => `/* ── ${source} ── */\n${read(source).trim()}\n`);
  const expectedShell = `/* DIVINA BRUXA — SHELL CRÍTICO V180\n   Gerado por BUILD-V180-SHELL.mjs.\n   Home, Tarot Livre, Carta do Dia e Conta sem CSS de portais pesados. */\n:root{--db-shell-v180:1}\n\n${chunks.join('\n')}`;
  check('css:shell-exato', shell === expectedShell);
  check('css:full-v179-hash', digest(fs.readFileSync(path.join(root, 'divina-core-v179.css'))) === manifest.styles.deferredCompleteSha256);

  const screenIds = new Set([...index.matchAll(/<section\s+id="([^"]+)"[^>]*class="[^"]*\bscreen\b/g)].map(match => match[1]));
  const routeIds = registry.ROUTES_V180.map(route => route.id);
  routeIds.filter(id => id !== 'skins').forEach(id => check(`tela:${id}`, screenIds.has(id)));
  const destinations = [...new Set([...index.matchAll(/data-go="([^"]+)"/g)].map(match => match[1]))];
  destinations.forEach(id => check(`destino-conhecido:${id}`, registry.isKnownRoute(id)));

  for (const file of ['app.js', 'navigation.js', 'page-loader-v1.js', 'route-registry-v180.js', 'sw.js', 'index.html', '404.html', 'offline.html']) {
    const source = read(file);
    const refs = [...source.matchAll(/(?:from\s*|import\s*\(|src=|href=)["'](\.\/?[^"'?#]+)[^"']*["']/g)].map(match => match[1].replace(/^\.\//, ''));
    refs.forEach(ref => check(`referencia:${file}:${ref}`, exists(ref)));
  }
  const swAssets = [...new Set([...sw.matchAll(/'[.]\/([^']+)'/g)].map(match => match[1]))];
  swAssets.forEach(asset => check(`sw:arquivo:${asset}`, exists(asset)));

  const [{ CARDS, REQUIRED_ORIENTATION }, sessionModule, consultationModule] = await Promise.all([
    import(`${pathToFileURL(path.join(root, 'tarot-data.js')).href}?qa=${Date.now()}`),
    import(`${pathToFileURL(path.join(root, 'tarot-session.js')).href}?qa=${Date.now()}`),
    import(`${pathToFileURL(path.join(root, 'consultation-policy.js')).href}?qa=${Date.now()}`)
  ]);
  check('tarot:78-cartas', CARDS.length === 78 && new Set(CARDS.map(card => card.id)).size === 78);
  check('tarot:diretas', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal'));
  const imageManifest = JSON.parse(read('tarot-image-manifest-v5.json'));
  const imageFailures = imageManifest.cards.filter(card => !exists(card.file) || digest(fs.readFileSync(path.join(root, card.file))) !== card.sha256);
  check('tarot:78-imagens-oficiais', imageManifest.cards.length === 78 && imageFailures.length === 0, `${imageFailures.length} falhas`);
  check('tarot:atlas-oficial', digest(fs.readFileSync(path.join(root, imageManifest.atlas.file))) === imageManifest.atlas.sha256);
  let seed = 180;
  const randomInt = max => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);
  let state = sessionModule.createTarotState({ randomInt, sessionId: 'qa-v180' });
  const drawn = [];
  while (!state.completed) {
    const result = sessionModule.drawNextCard(state);
    drawn.push(result.cardId);
    state = result.state;
  }
  check('tarot:sem-repeticao', drawn.length === 78 && new Set(drawn).size === 78 && state.normalOnly === true);
  const policy = consultationModule.CONSULTATION_POLICY;
  check('consulta:quatro-servicos', policy.services.length === 4 && policy.independentProducts === true);
  check('consulta:precos', policy.services.map(service => service.price).join(',') === '250,150,100,50');
  check('consulta:email-obrigatorio', policy.channels.length === 1 && policy.channels[0] === 'email' && /name="email"[^>]+required/.test(read('consultation-engine.js')));
  check('consulta:email-operacional', read('config.js').includes('orbedasrealidades@hotmail.com'));
  check('consulta:sem-cobranca', policy.realBilling === false);

  check('fallback:404', /fallback-shell-v1\.css/.test(read('404.html')) && /tarot-livre\.html/.test(read('404.html')));
  check('fallback:offline', /fallback-shell-v1\.css/.test(read('offline.html')) && /index\.html#tarot/.test(read('offline.html')));
  check('rotas:78-paginas-cartas', fs.readdirSync(root).filter(file => /^carta-(?!do-dia).*\.html$/.test(file)).length === 78);
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V180-ROTAS-SEM-TELA-BRANCA',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'package',
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
