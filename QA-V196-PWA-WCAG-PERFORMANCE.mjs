import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const file = name => join(ROOT, name);
const read = name => readFileSync(file(name), 'utf8');
const count = (source, expression) => (source.match(expression) || []).length;
const sha256 = name => createHash('sha256').update(readFileSync(file(name))).digest('hex');
const size = name => statSync(file(name)).size;

const passes = [];
const failures = [];
const check = (name, condition, severity = 'P1') => {
  if (condition) passes.push({ name, severity });
  else failures.push({ name, severity });
};

const manifest = JSON.parse(read('manifest.webmanifest'));
const release = JSON.parse(read('MANIFESTO-V196-PWA-WCAG-PERFORMANCE.json'));
const contract = JSON.parse(read('PWA-WCAG-PERFORMANCE-CONTRACT-V196.json'));
const index = read('index.html');
const app = read('app.js');
const sw = read('sw.js');
const pwa = read('pwa-world-v196.js');
const performanceRuntime = read('performance-world-v196.js');
const pwaCss = read('pwa-world-v196.css');
const fallbackCss = read('fallback-shell-v1.css');

const publicPwaPages = Object.freeze([
  'acessibilidade.html',
  'tarot-livre.html', 'cartas-do-tarot.html', 'escola-do-tarot.html', 'consultas-de-tarot.html', 'etica-e-responsabilidade.html', 'contato.html',
  'english.html', 'free-tarot-reading.html', 'tarot-card-meanings.html', 'tarot-school.html', 'tarot-consultations.html', 'tarot-ethics.html', 'contact.html',
  'espanol.html', 'tarot-libre.html', 'significados-cartas-tarot.html', 'escuela-tarot.html', 'consultas-tarot.html', 'etica-tarot.html', 'contacto.html'
]);
const installPages = Object.freeze(['instalar-app.html', 'install-app.html', 'instalar-aplicacion.html']);
const offlinePages = Object.freeze(['offline.html', 'offline-en.html', 'offline-es.html']);
const changedHtml = Object.freeze(['index.html', ...publicPwaPages, ...installPages, ...offlinePages]);
const inheritedBaseFiles = new Set([
  'editorial-catalog-v192.js', 'editorial-metrics-v192.js', 'editorial-universe-v192.css',
  'media-engine-v192.js', 'media-policy-v192.js', 'editorial-journey-v192.js',
  'loja-mistica.html', 'musica.html', 'de-frente-com-o-tarot.html'
]);

for (const name of release.delivery.files) {
  check(`delta presente: ${name}`, existsSync(file(name)), 'P0');
  check(`delta não vazio: ${name}`, existsSync(file(name)) && statSync(file(name)).size > 0, 'P0');
  check(`delta plano: ${name}`, !name.includes('/') && !name.includes('\\'), 'P0');
}
check('manifesto identifica V196', release.version === 196 && release.release === 'macroetapa-17-pwa-wcag-performance', 'P0');
check('V195 é a base obrigatória', release.base_required === 'V195 instalada', 'P0');
check('entrega é delta plano sem exclusões', release.delivery.type === 'flat-delta' && release.delivery.directories_inside_zip === 0 && release.delivery.delete_existing_files === false, 'P0');
check('lista do delta não contém duplicatas', new Set(release.delivery.files).size === release.delivery.files.length, 'P0');

const frozen = Object.freeze({
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
});
for (const [name, expected] of Object.entries(frozen)) {
  check(`congelado presente: ${name}`, existsSync(file(name)), 'P0');
  check(`congelado intacto: ${name}`, existsSync(file(name)) && sha256(name) === expected, 'P0');
}

const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"');
const home = index.slice(homeStart, tarotStart);
check('Home portuguesa identificada', homeStart >= 0 && tarotStart > homeStart, 'P0');
check('Home V194 permanece ativa', /id="home" class="[^"]*home-orb-only-v194/.test(home), 'P0');
check('Home mantém título Orbe das Realidades', /<h1>Orbe das<br>Realidades/.test(home), 'P0');
check('Home mantém uma Orbe principal', count(home, /id="orb"/g) === 1, 'P0');
check('Home mantém um canvas vivo', count(home, /id="orbCanvas"/g) === 1, 'P0');
check('Home não ganhou bloco informativo V196', !/db-install-(?:page|grid|card|offline)|core-web-vitals|performance-world/.test(home), 'P0');
check('Home não ganhou CTA permanente V196', !/Preparar agora|Leve a Orbe|Instalar a Orbe/.test(home), 'P0');
check('CSS absoluto V194 continua carregado', /home-orb-absolute-v194\.css\?v=194/.test(index), 'P0');
check('CSS V196 carrega depois do CSS da Home', index.indexOf('pwa-world-v196.css?v=196') > index.indexOf('home-orb-absolute-v194.css?v=194'), 'P0');
check('instalação fica no menu', /id="installApp" type="button"/.test(index) && index.indexOf('id="installApp"') > tarotStart, 'P0');

for (const [name, expectedTitle] of [['english.html', 'Orb of<br>Realities'], ['espanol.html', 'Orbe de las<br>Realidades']]) {
  const html = read(name);
  const main = html.slice(html.indexOf('<main id="main"'), html.indexOf('</main>'));
  check(`${name}: título localizado preservado`, main.includes(`<h1>${expectedTitle}</h1>`), 'P0');
  check(`${name}: uma Orbe viva`, count(main, /class="intl-orb-shell orb-shell orb-loading"/g) === 1 && count(main, /id="orbCanvas"/g) === 1, 'P0');
  check(`${name}: sem informações novas na Home`, !/db-install-(?:grid|card|offline)|intl-(?:section|stats|grid|hero)/.test(main), 'P0');
}

const tarotData = await import(`${pathToFileURL(file('tarot-data.js')).href}?qa=196`);
check('catálogo canônico mantém 78 cartas', Array.isArray(tarotData.CARDS) && tarotData.CARDS.length === 78, 'P0');
check('78 IDs canônicos permanecem únicos', new Set(tarotData.CARDS.map(card => card.canonicalId)).size === 78, 'P0');
check('78 imagens permanecem únicas', new Set(tarotData.CARDS.map(card => card.image)).size === 78, 'P0');
check('todas as cartas permanecem diretas', tarotData.CARDS.every(card => card.orientation === 'normal'), 'P0');
const internationalTarot = read('international-tarot-v195.js');
check('Tarot internacional não importa significados', !/tarot-meanings|meaning-engine/.test(internationalTarot), 'P0');
check('Tarot internacional mantém 78 posições', /position\s*=\s*1;\s*position\s*<=\s*78/.test(internationalTarot), 'P0');
check('Mesa Real internacional mantém 13 por 6', ['free-tarot-reading.html', 'tarot-libre.html'].every(name => /aria-rowcount="13" aria-colcount="6"/.test(read(name))), 'P0');
const internationalTarotModule = await import(`${pathToFileURL(file('international-tarot-v195.js')).href}?qa=196`);
let internationalShuffleValid = true;
let internationalShuffleChanged = false;
for (let run = 0; run < 20; run += 1) {
  const deck = internationalTarotModule.shuffleCanonicalDeck();
  internationalShuffleValid &&= deck.length === 78 && new Set(deck.map(card => card.canonicalId)).size === 78 && deck.every(card => card.orientation === 'normal');
  internationalShuffleChanged ||= deck.some((card, position) => card.canonicalId !== tarotData.CARDS[position].canonicalId);
}
check('20 embaralhamentos internacionais preservam 78 cartas únicas', internationalShuffleValid, 'P0');
check('embaralhamento internacional altera a ordem canônica', internationalShuffleChanged, 'P0');
const internationalCardImage = read('international-card-image-v196.js');
check('Tarot internacional usa fallback de atlas', /applyInternationalCardImageV196/.test(internationalTarot) && /tarot-atlas\.webp/.test(internationalCardImage), 'P0');
check('Biblioteca internacional usa fallback de atlas', /applyInternationalCardImageV196/.test(read('international-library-v195.js')), 'P0');
check('fallback internacional preserva grade 10 por 8', /backgroundSize = '1000% 800%'/.test(internationalCardImage) && /atlasIndex % 10/.test(internationalCardImage), 'P0');

check('manifesto PWA mantém identidade', manifest.id === './' && manifest.start_url === './' && manifest.scope === './', 'P0');
check('manifesto usa standalone', manifest.display === 'standalone' && manifest.display_override?.includes('standalone'), 'P0');
check('manifesto tem quatro ícones', Array.isArray(manifest.icons) && manifest.icons.length === 4, 'P0');
check('ícones any e maskable completos', manifest.icons.some(icon => icon.sizes === '192x192' && icon.purpose === 'any') && manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'), 'P0');
check('manifesto V196 não prefere app externo', manifest.prefer_related_applications === false, 'P0');
check('atalhos preservam Tarot e Carta do Dia', manifest.shortcuts.some(item => item.url.includes('#tarot')) && manifest.shortcuts.some(item => item.url.includes('#daily')), 'P0');
check('atalho de instalação existe', manifest.shortcuts.some(item => item.url === './instalar-app.html'), 'P1');
for (const icon of manifest.icons) check(`ícone existe: ${icon.src}`, existsSync(file(icon.src.split(/[?#]/)[0].replace(/^\.\//, ''))), 'P0');

check('index usa manifesto V196', /manifest\.webmanifest\?v=196/.test(index), 'P0');
check('index usa app V196', /app\.js\?v=196/.test(index), 'P0');
check('bootstrap usa service worker V196', /sw\.js\?v=196/.test(index) && /divina\.sw\.reload\.v196/.test(index), 'P0');
check('app identifica V196', /APLICATIVO V196/.test(app), 'P1');
check('app importa runtime mundial V196', /import '\.\/pwa-world-v196\.js\?v=196'/.test(app), 'P0');
check('app registra service worker V196 como contingência', /serviceWorker\.register\('\.\/sw\.js\?v=196'\)/.test(app), 'P0');
check('manipulador antigo de instalação foi removvido', !/let installPrompt|installPrompt\.prompt/.test(app), 'P1');

check('service worker identifica V66 e V196', /SERVICE WORKER V66[\s\S]*V196/.test(sw), 'P0');
for (const namespace of ['shell', 'content', 'images', 'tarot-offline']) check(`cache separado: ${namespace}`, sw.includes(`divina-bruxa-v66-${namespace}-v196`), 'P0');
check('cache anterior V195 é mantido como retorno', /PREVIOUS_CACHE = 'divina-bruxa-v65-international-v195'/.test(sw) && /ACTIVE_CACHES/.test(sw), 'P0');
check('limpeza alcança somente caches próprios', /key\.startsWith\(OWNED_PREFIX\)/.test(sw), 'P0');
check('service worker não apaga todo cache alheio', !/keys\.filter\(key\s*=>\s*key\s*!==/.test(sw), 'P0');
check('respostas private e no-store não são guardadas', /no-store\|private/.test(sw), 'P0');
check('requisições autorizadas não são guardadas', /request\.headers\.has\('authorization'\)/.test(sw), 'P0');
check('autoridade de conta e pagamento é network-only', /account\|admin\|entitlements\|billing\|payments\|checkout/.test(sw) && /authorityNetworkOnly/.test(sw), 'P0');
check('IA e envio de consulta são network-only', /\(\?:ai\|auth\|account[\s\S]*consultations/.test(sw), 'P0');
check('terceiros permanecem network-only', /url\.origin !== self\.location\.origin\) return true/.test(sw), 'P0');
check('resposta segura offline carrega no-store', /secure_connection_required/.test(sw) && /'cache-control': 'no-store'/.test(sw), 'P0');
check('navegação usa timeout e fallback', /fetchWithTimeout/.test(sw) && /navigationNetworkFirst/.test(sw) && /offlinePageFor/.test(sw), 'P0');
check('scripts e estilos usam stale while revalidate', /staleWhileRevalidate/.test(sw), 'P1');
check('imagens usam cache first com orçamento', /cacheFirst/.test(sw) && /IMAGE_CACHE, 96/.test(sw), 'P1');
check('Tarot offline tem comando explícito', /PREPARE_OFFLINE_TAROT/.test(sw) && /GET_OFFLINE_STATUS/.test(sw), 'P0');
for (const asset of ['tarot-data.js', 'tarot-engine.js', 'tarot-image-runtime.js', 'international-card-image-v196.js', 'tarot-session.js', 'tarot-continuity.js', 'tarot-atlas-mobile-v196.webp']) {
  check(`pacote offline inclui ${asset}`, sw.includes(`'./${asset}'`), 'P0');
}
for (const name of offlinePages) check(`fallback localizado em cache: ${name}`, sw.includes(`'./${name}'`), 'P0');
check('atlas otimizado cria alias canônico', /cache\.put\(absoluteRequest\('\.\/tarot-atlas\.webp'\), atlas\.clone\(\)\)/.test(sw), 'P0');
check('atlas offline é pelo menos 35% menor', size('tarot-atlas-mobile-v196.webp') < size('tarot-atlas.webp') * 0.65, 'P0');
check('atlas offline mantém tamanho material', size('tarot-atlas-mobile-v196.webp') > 500000, 'P1');
check('fallback da Orbe usa WebP rápido', /divina-orb-fast-v1\.webp\?v=196/.test(pwaCss) && /divina-orb-fast-v1\.webp\?v=196/.test(fallbackCss), 'P0');
check('WebP da Orbe é pelo menos 90% menor que PNG', size('divina-orb-fast-v1.webp') < size('divina-orb-v68.png') * 0.1, 'P0');

check('runtime PWA captura beforeinstallprompt', /beforeinstallprompt/.test(pwa), 'P0');
check('runtime PWA reage a appinstalled', /appinstalled/.test(pwa), 'P1');
check('runtime detecta modo standalone', /display-mode: standalone/.test(pwa) && /navigator\.standalone/.test(pwa), 'P0');
check('runtime registra SW V196 em páginas públicas', /serviceWorker\.register\('\.\/sw\.js\?v=196'\)/.test(pwa), 'P0');
check('runtime oferece instruções específicas de iPhone', /iPhone|iphone/.test(pwa) && /Compartilhar/.test(pwa) && /Add to Home Screen/.test(pwa), 'P0');
check('runtime oferece instruções Android', /Android/.test(read('instalar-app.html')) && /Chrome/.test(read('instalar-app.html')), 'P0');
check('status de rede usa região viva', /aria-live', 'polite'/.test(pwa) && /db-network-status/.test(pwa), 'P1');
check('ações seguras são bloqueadas offline', /ONLINE_ONLY_SELECTOR/.test(pwa) && /dbOfflineDisabled/.test(pwa), 'P0');
check('retorno do segundo plano é tratado', /visibilitychange/.test(pwa) && /pageshow/.test(pwa) && /divina:resume/.test(pwa), 'P1');
check('regiões inativas usam inert', /element\.inert = inert/.test(pwa) && /syncHiddenRegions/.test(pwa), 'P0');
check('modais prendem a navegação por Tab', /trapVisibleLayer/.test(pwa) && /event\.key !== 'Tab'/.test(pwa), 'P0');
check('menu aberto recebe foco inicial', /openRegionState/.test(pwa) && /focusables\(orbMenu\)\[0\]\?\.focus/.test(pwa), 'P1');
check('mudança de rota leva foco ao título', /divina:route-ready/.test(pwa) && /heading\.focus/.test(pwa), 'P1');
check('atalho para conteúdo é criado', /db-skip-link/.test(pwa) && /ensureSkipLink/.test(pwa), 'P1');
check('API PWA declara que não guarda autoridade', /cacheAuthorityData: false/.test(pwa), 'P0');

check('CSS exige foco visível de alto contraste', /:focus-visible/.test(pwaCss) && /3px solid var\(--db-v196-focus\)/.test(pwaCss), 'P0');
check('CSS mantém alvos de 44 px', count(pwaCss, /44px/g) >= 6, 'P0');
check('CSS respeita safe areas', /safe-area-inset-top/.test(pwaCss) && /safe-area-inset-bottom/.test(pwaCss) && /safe-area-inset-left/.test(pwaCss) && /safe-area-inset-right/.test(pwaCss), 'P0');
check('CSS respeita movimento reduzido', /prefers-reduced-motion: reduce/.test(pwaCss), 'P0');
check('CSS oferece contraste aumentado', /prefers-contrast: more/.test(pwaCss), 'P1');
check('CSS oferece modo de cores forçadas', /forced-colors: active/.test(pwaCss), 'P1');
check('CSS não desativa zoom', !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(changedHtml.map(read).join('\n')), 'P0');

check('metas LCP, INP e CLS estão corretas', /LCP:[\s\S]*good: 2500/.test(performanceRuntime) && /INP:[\s\S]*good: 200/.test(performanceRuntime) && /CLS:[\s\S]*good: 0\.1/.test(performanceRuntime), 'P0');
check('LCP usa Largest Contentful Paint', /largest-contentful-paint/.test(performanceRuntime), 'P0');
check('CLS usa Layout Shift', /layout-shift/.test(performanceRuntime) && /hadRecentInput/.test(performanceRuntime), 'P0');
check('INP usa Event Timing e interactionId', /type: 'event'/.test(performanceRuntime) && /interactionId/.test(performanceRuntime), 'P0');
check('métricas finalizam no ciclo de vida', /visibilitychange/.test(performanceRuntime) && /pagehide/.test(performanceRuntime), 'P1');
check('persistência exige consentimento analytics', /getPrivacyPreferences\(\)\.analytics === true/.test(performanceRuntime), 'P0');
check('revogação remove somente amostras opcionais', /divina:privacy-change/.test(performanceRuntime) && /removeItem\(STORAGE_KEY\)/.test(performanceRuntime), 'P0');
check('amostras locais têm teto de 75', /SAMPLE_LIMIT = 75/.test(performanceRuntime), 'P1');
check('telemetria não usa rede', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(performanceRuntime), 'P0');
check('telemetria não armazena URL ou conteúdo pessoal', !/location\.|document\.URL|account|diary|journal|email|name: detail\.name/.test(performanceRuntime.replace('name: detail.name', '')), 'P0');
check('telemetria se declara local-only', /transport: 'local-only'/.test(performanceRuntime) && /networkTransport: false/.test(performanceRuntime), 'P0');
check('agregação local calcula percentil 75', /percentile\(values\)/.test(performanceRuntime) && /ratio = 0\.75/.test(performanceRuntime), 'P0');

for (const name of publicPwaPages) {
  const html = read(name);
  check(`${name}: manifesto V196`, /manifest\.webmanifest\?v=196/.test(html), 'P0');
  check(`${name}: CSS PWA V196`, /pwa-world-v196\.css\?v=196/.test(html), 'P0');
  check(`${name}: runtime PWA V196`, /pwa-world-v196\.js\?v=196/.test(html), 'P0');
  check(`${name}: uma inclusão do runtime`, count(html, /pwa-world-v196\.js\?v=196/g) === 1, 'P1');
}

for (const [name, language] of [['instalar-app.html', 'pt-BR'], ['install-app.html', 'en'], ['instalar-aplicacion.html', 'es']]) {
  const html = read(name);
  check(`${name}: idioma correto`, new RegExp(`<html lang="${language}">`).test(html), 'P0');
  check(`${name}: um h1`, count(html, /<h1[ >]/g) === 1, 'P1');
  check(`${name}: manifesto e runtime V196`, /manifest\.webmanifest\?v=196/.test(html) && /pwa-world-v196\.js\?v=196/.test(html), 'P0');
  check(`${name}: botão prepara offline`, /data-prepare-offline/.test(html) && /data-offline-result/.test(html), 'P0');
  check(`${name}: quatro hreflangs`, count(html, /rel="alternate" hreflang=/g) === 4, 'P0');
  check(`${name}: não promete recursos seguros offline`, /(Conta, pagamentos|Account, payments|La cuenta, los pagos)/.test(html) && /(conexão segura|secure connection|conexión segura)/.test(html), 'P0');
}

for (const [name, language] of [['offline.html', 'pt-BR'], ['offline-en.html', 'en'], ['offline-es.html', 'es']]) {
  const html = read(name);
  check(`${name}: idioma correto`, new RegExp(`<html lang="${language}">`).test(html), 'P0');
  check(`${name}: não indexável`, /noindex,nofollow,noarchive/.test(html), 'P0');
  check(`${name}: ação útil`, /href="\.\/(?:index\.html#tarot|free-tarot-reading\.html|tarot-libre\.html)"/.test(html), 'P0');
  check(`${name}: limita autoridade offline`, /(Conta, pagamentos|Account, payments|La cuenta, los pagos)/.test(html), 'P0');
}

check('página de acessibilidade declara meta sem certificação falsa', /WCAG 2\.2 AA como meta técnica/.test(read('acessibilidade.html')) && /não equivale a uma certificação formal/.test(read('acessibilidade.html')), 'P0');
check('página de acessibilidade aponta testes humanos', /VoiceOver ou TalkBack/.test(read('acessibilidade.html')), 'P1');
check('sitemap principal inclui instalação PT', /instalar-app\.html/.test(read('sitemap-principal.xml')), 'P0');
check('sitemap inglês inclui instalação EN', /install-app\.html/.test(read('sitemap-en.xml')), 'P0');
check('sitemap espanhol inclui instalação ES', /instalar-aplicacion\.html/.test(read('sitemap-es.xml')), 'P0');

const localAssetPattern = /(?:href|src)="([^"]+)"/g;
for (const name of changedHtml) {
  const html = read(name);
  for (const match of html.matchAll(localAssetPattern)) {
    const raw = match[1];
    if (!raw || raw === './' || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/i.test(raw)) continue;
    const local = raw.split(/[?#]/)[0].replace(/^\.\//, '');
    if (!local) continue;
    check(`${name}: destino local disponível: ${local}`, existsSync(file(local)) || inheritedBaseFiles.has(local), 'P0');
  }
}

const htmlBundle = changedHtml.map(read).join('\n');
check('nenhum rastreador novo foi adicionado', !/(googletagmanager|google-analytics|facebook\.net|hotjar|segment\.com)/i.test(htmlBundle + pwa + performanceRuntime), 'P0');
check('nenhum segredo foi adicionado aos arquivos V196', !/(sk_live_|sk_test_|service_role|BEGIN PRIVATE KEY|RESEND_API_KEY)/.test([sw, pwa, performanceRuntime, pwaCss, read('PWA-WCAG-PERFORMANCE-CONTRACT-V196.json')].join('\n')), 'P0');
check('produção permanece bloqueada', release.preserved_contracts.production_publish_authorized === false && contract.preserved_contracts.production_publish_authorized === false, 'P0');
check('DNS permanece bloqueado', release.preserved_contracts.dns_changes_authorized === false && contract.preserved_contracts.dns_changes_authorized === false, 'P0');
check('cobrança real permanece bloqueada', release.preserved_contracts.real_billing_authorized === false && contract.preserved_contracts.real_billing_authorized === false, 'P0');
check('lojas permanecem bloqueadas', release.preserved_contracts.app_store_submission_authorized === false && contract.preserved_contracts.app_store_submission_authorized === false, 'P0');
check('Sol permanece desligado', release.preserved_contracts.sol_enabled === false && contract.preserved_contracts.sol_enabled === false, 'P0');
check('portão de campo é honesto', /pending real post-install traffic/.test(release.quality_gate.field_cwv) && contract.performance.measurement.field_p75_status === 'pending real post-install traffic', 'P0');

const performanceModule = await import(`${pathToFileURL(file('performance-world-v196.js')).href}?qa=196`);
const summary = performanceModule.summarizeLocalWebVitalsV196();
check('resumo local expõe três métricas', ['LCP', 'INP', 'CLS'].every(metric => metric in summary), 'P1');
check('resumo vazio não inventa percentil', Object.values(summary).every(metric => metric.samples === 0 && metric.p75 === null && metric.rating === 'pending'), 'P0');

const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const originalAtlas = size('tarot-atlas.webp');
const optimizedAtlas = size('tarot-atlas-mobile-v196.webp');
const originalOrb = size('divina-orb-v68.png');
const optimizedOrb = size('divina-orb-fast-v1.webp');
const evidence = {
  project: 'Divina Bruxa',
  version: 196,
  suite: 'Macroetapa 17 · PWA, WCAG 2.2 AA e desempenho mundial',
  generated_at: new Date().toISOString(),
  total: passes.length + failures.length,
  passed: passes.length,
  failed: failures.length,
  gate: { p0, p1, package_approved: p0 === 0 && p1 === 0 },
  coverage: {
    public_pwa_pages: publicPwaPages.length,
    install_guides: installPages.length,
    offline_fallbacks: offlinePages.length,
    languages: ['pt-BR', 'en', 'es'],
    tarot_cards: tarotData.CARDS.length,
    royal_table: '13x6',
    cwv_targets: { p75: true, LCP_ms: 2500, INP_ms: 200, CLS: 0.1 }
  },
  asset_reduction: {
    tarot_atlas: { from_bytes: originalAtlas, to_bytes: optimizedAtlas, percent: Math.round((1 - optimizedAtlas / originalAtlas) * 1000) / 10 },
    orb_fallback: { from_bytes: originalOrb, to_bytes: optimizedOrb, percent: Math.round((1 - optimizedOrb / originalOrb) * 1000) / 10 }
  },
  field_validation: {
    status: 'pending-after-installation',
    reason: 'p75, VoiceOver and TalkBack require real users or physical devices and are not fabricated by package QA',
    required: ['mobile-and-desktop-p75', 'iPhone-VoiceOver', 'Android-TalkBack', 'slow-network', 'offline', 'background-return']
  },
  frozen_hashes: frozen,
  failures
};
writeFileSync(file('EVIDENCIA-QA-V196.json'), `${JSON.stringify(evidence, null, 2)}\n`);

console.log(`DIVINA BRUXA V196 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
if (failures.length) {
  failures.forEach(failure => console.error(`[${failure.severity}] ${failure.name}`));
  process.exitCode = 1;
}
