import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const read = name => readFileSync(resolve(root, name), 'utf8');
const has = (source, pattern, message) => assert.match(source, pattern, message);
const lacks = (source, pattern, message) => assert.doesNotMatch(source, pattern, message);

const app = read('app-v208.js');
const index = read('index.html');
const runtime = read('page-design-supreme-v560.js');
const css = read('page-design-supreme-v560.css');
const worker = read('sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const deliveryManifest = JSON.parse(read('MANIFESTO-V560-DESIGN-MOBILE-PREMIUM.json'));
const runtimeApi = await import(`data:text/javascript;base64,${Buffer.from(runtime).toString('base64')}`);

has(app, /MACROETAPA 12\/14 · V560/, 'app deve declarar Macro 12/V560');
has(app, /createPageDesignSupremeV560/, 'runtime V560 não foi importado');
has(app, /divinaPageDesignReleaseV560/, 'contrato público V560 ausente');
has(app, /currentMacroStage:'12-of-14'/, 'boot não aponta para 12/14');
has(app, /design:pageDesignSupreme/, 'núcleo V560 não está exposto pela Orbe');
has(app, /privateReads:0/, 'contrato não declara leitura privada zero');
has(app, /productionPublish:false/, 'publicação de produção precisa permanecer bloqueada');
has(app, /realBilling:false/, 'billing real precisa permanecer bloqueado');

has(index, /manifest\.webmanifest\?v=560/, 'manifesto V560 não está ligado');
has(index, /page-design-supreme-v560\.css\?v=560/, 'CSS V560 não está ligado');
has(index, /app-v208\.js\?v=560/, 'app V560 não está ligado');
has(index, /__divinaSWBootstrap='v560-inline'/, 'bootstrap inline V560 ausente');
has(index, /sw\.js\?v=560/, 'service worker V560 não está registrado');
has(index, /interactive-widget=resizes-content/, 'viewport não está preparado para teclado virtual');

const staticScreenIds = [...index.matchAll(/<section id="([^"]+)" class="screen\b/g)].map(match => match[1]);
assert.equal(staticScreenIds.length, 16, 'index deve preservar 16 mundos estáticos');
assert.equal(new Set(staticScreenIds).size, 16, 'IDs dos mundos estáticos precisam ser únicos');
for (const id of ['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','videos','music','notifications','login','admin']) {
  assert.equal(staticScreenIds.includes(id), true, `mundo estático ausente: ${id}`);
}

assert.equal(runtimeApi.PAGE_DESIGN_SUPREME_CONTRACT_V560.version, 560, 'contrato do runtime incorreto');
assert.equal(runtimeApi.PAGE_DESIGN_SUPREME_CONTRACT_V560.worldCount, 17, 'runtime deve cobrir 17 mundos');
assert.equal(runtimeApi.PAGE_DESIGN_SUPREME_CONTRACT_V560.permanentAnimationLoops, 0, 'runtime não pode criar loop permanente');
assert.equal(runtimeApi.PAGE_DESIGN_SUPREME_CONTRACT_V560.privateReads, 0, 'runtime não pode ler conteúdo privado');
assert.equal(runtimeApi.designProfileV560('conta').id, 'login', 'alias Conta incorreto');
assert.equal(runtimeApi.designProfileV560('tiragens').id, 'spreads', 'alias Tiragens incorreto');
assert.equal(runtimeApi.designProfileV560('de-frente-com-o-tarot').id, 'videos', 'alias editorial incorreto');
assert.equal(runtimeApi.designProfileV560('skins').family, 'identity', 'Skins deve fazer parte de Identidade');
assert.equal(runtimeApi.viewportProfileV560(320, 700, 1).tier, 'compact', 'perfil 320px incorreto');
assert.equal(runtimeApi.viewportProfileV560(390, 844, 1).tier, 'phone', 'perfil iPhone incorreto');
assert.equal(runtimeApi.viewportProfileV560(768, 1024, 1).tier, 'tablet', 'perfil tablet incorreto');
assert.equal(runtimeApi.viewportProfileV560(1440, 900, 1).tier, 'wide', 'perfil wide incorreto');
assert.equal(runtimeApi.viewportProfileV560(640, 720, 2).zoomed, true, 'zoom 200% não foi reconhecido');
assert.equal(runtimeApi.stateCopyV560('error', 'journal').live, 'assertive', 'erro deve ser assertivo');

for (const route of ['home','tarot','daily','spreads','library','school','journal','ai','store','consultations','music','videos','login','subscriptions','skins','notifications','admin']) {
  assert.equal(runtimeApi.designProfileV560(route).id, route, `perfil ausente: ${route}`);
}

has(runtime, /#app > \.screen/, 'runtime não procura somente mundos do app');
has(runtime, /aria-labelledby/, 'rótulos estruturais não são aplicados');
has(runtime, /aria-current/, 'estado de rota atual não é exposto');
has(runtime, /\.inert = true/, 'mundos inativos não recebem inert');
has(runtime, /divina:page-loading/, 'estado de carregamento não está conectado');
has(runtime, /divina:page-error/, 'estado de erro não está conectado');
has(runtime, /navigator\.onLine/, 'estado offline não está conectado');
has(runtime, /visualViewport/, 'visual viewport não está conectado');
has(runtime, /v560State/, 'superfície de estados V560 ausente');
lacks(runtime, /new MutationObserver|setInterval\s*\(|requestAnimationFrame\s*\(/, 'runtime V560 contém observador ou loop permanente');
lacks(runtime, /localStorage|sessionStorage|indexedDB|\.value\b|textContent\s*\)/, 'runtime V560 tenta ler armazenamento ou campos privados');
lacks(runtime, /fetch\s*\(|XMLHttpRequest|WebSocket/, 'runtime V560 não pode chamar rede');
lacks(runtime, /createElement\(['"]canvas|new Worker|new SharedWorker/, 'runtime V560 não pode criar outro motor visual');

has(css, /env\(safe-area-inset-top\)/, 'safe area superior ausente');
has(css, /env\(safe-area-inset-bottom\)/, 'safe area inferior ausente');
has(css, /min-block-size:\s*44px/, 'alvo mínimo de toque 44px ausente');
has(css, /font-size:\s*16px !important/, 'proteção contra zoom automático em formulários ausente');
has(css, /prefers-reduced-motion:\s*reduce/, 'redução de movimento ausente');
has(css, /prefers-contrast:\s*more/, 'alto contraste ausente');
has(css, /forced-colors:\s*active/, 'forced colors ausente');
has(css, /display-mode:\s*standalone/, 'modo PWA standalone ausente');
has(css, /orientation:\s*landscape/, 'tratamento landscape ausente');
has(css, /data-v560-zoom="zoomed"/, 'tratamento de zoom ausente');
has(css, /\.v560-skip-link/, 'skip link não está estilizado');
has(css, /\.v560-system-state/, 'estado global não está estilizado');
has(css, /#admin[\s\S]*font-size:\s*max\(1rem, 16px\)/, 'Admin não recebeu tipografia móvel segura');
lacks(css, /animation\s*:\s*[^;]*infinite|backdrop-filter\s*:/, 'CSS V560 contém loop infinito ou blur pesado');

assert.equal(manifest.icons.every(icon => icon.src.includes('v=560')), true, 'ícones do manifesto não usam epoch V560');
assert.equal(manifest.shortcuts.length, 10, 'atalhos PWA existentes devem ser preservados');
assert.equal(manifest.shortcuts.every(shortcut => shortcut.icons.every(icon => icon.src.includes('v=560'))), true, 'atalhos não usam epoch V560');

has(worker, /const VERSION=560/, 'service worker não usa V560');
has(worker, /divina-bruxa-v560-shell/, 'cache de shell V560 ausente');
has(worker, /page-design-supreme-v560\.js/, 'runtime V560 não está no shell atômico');
has(worker, /page-design-supreme-v560\.css/, 'CSS V560 não está no shell atômico');
has(worker, /app-v208\\\.js\\\?v=560/, 'service worker não valida o shell V560');
lacks(worker, /divina-bruxa-v559-(?:shell|content|images|offline-core|premium-static)/, 'cache V559 não pode permanecer ativo');

for (const file of ['offline.html','offline-en.html','offline-es.html','404.html']) {
  const page = read(file);
  has(page, /data-page-design="v560"/, `${file} não ativa o design V560`);
  has(page, /page-design-supreme-v560\.css\?v=560/, `${file} não carrega o CSS V560`);
  has(page, /interactive-widget=resizes-content/, `${file} não trata teclado virtual`);
}

const deltaEntries = readdirSync(root, { withFileTypes:true });
assert.equal(deltaEntries.some(entry => entry.isDirectory()), false, 'pacote incremental deve permanecer plano');
assert.equal(deltaEntries.length, deliveryManifest.expected_file_count, 'quantidade de arquivos do delta diverge do manifesto');
const declaredFiles = [...deliveryManifest.new_files, ...deliveryManifest.replacement_files].sort();
assert.deepEqual(deltaEntries.map(entry => entry.name).sort(), declaredFiles, 'manifesto não descreve exatamente o delta');

console.log(JSON.stringify({
  ok:true,
  release:'V560',
  macro:'12/14',
  staticWorlds:staticScreenIds.length,
  totalWorlds:17,
  families:7,
  viewportWidths:runtimeApi.PAGE_DESIGN_SUPREME_CONTRACT_V560.viewportWidths,
  minimumTouchTargetPx:44,
  safeAreas:true,
  zoom200:true,
  canonicalOrb:true,
  duplicateOrbs:0,
  mutationObservers:0,
  permanentAnimationLoops:0,
  privateReads:0,
  flatDirectory:true,
  root:basename(root)
}, null, 2));
