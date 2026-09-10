import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const tests = [];
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const exists = name => fs.existsSync(path.join(root, name));
const sha256 = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const hashText = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => [...value.matchAll(pattern)].length;
const expect = (name, condition, detail = '') => tests.push({ name, pass: Boolean(condition), detail });
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const releaseFiles = [
  'index.html',
  'sw.js',
  'orb-motion-core-v207.js',
  'orb-engine-v207.js',
  'mini-orb-engine-v207.js',
  'app-v207.js',
  '00-LEIA-PRIMEIRO-V207-ORBE-NUCLEO-UNICO.txt',
  'ORB-MOTION-CORE-CONTRACT-V207.json',
  'ORB-LIFECYCLE-MATRIX-V207.json',
  'MANIFESTO-V207-ORBE-NUCLEO-UNICO.json',
  'QA-V207-ORBE-NUCLEO-UNICO.mjs',
  'EVIDENCIA-QA-V207.json',
  'ARQUIVOS-V207-SHA256.txt'
];

releaseFiles.forEach(name => expect(`arquivo presente: ${name}`, exists(name)));

const index = read('index.html');
const sw = read('sw.js');
const core = read('orb-motion-core-v207.js');
const engine = read('orb-engine-v207.js');
const previousEngine = read('orb-engine-v68.js');
const mini = read('mini-orb-engine-v207.js');
const app = read('app-v207.js');
const contract = JSON.parse(read('ORB-MOTION-CORE-CONTRACT-V207.json'));
const lifecycleMatrix = JSON.parse(read('ORB-LIFECYCLE-MATRIX-V207.json'));
const manifest = JSON.parse(read('MANIFESTO-V207-ORBE-NUCLEO-UNICO.json'));
const evidence = JSON.parse(read('EVIDENCIA-QA-V207.json'));

const homeStart = index.indexOf('<section id="home"');
const homeHeroEnd = index.indexOf('<section class="home-paths"', homeStart);
const homeHero = index.slice(homeStart, homeHeroEnd);

expect('Home V206 continua ativa', /id="home"[^>]*\bhome-orb-only-v206\b/.test(homeHero));
expect('Home central continua sem H1', !/<h1\b/i.test(homeHero));
expect('Home central continua sem home-copy', !homeHero.includes('class="home-copy"'));
expect('Home central continua sem chamada visível', !/TOQUE PARA DESPERTAR|touch-hint|>ORBE VIVA — MENU MÁGICO</i.test(homeHero));
expect('Orbe principal continua única', count(index, /id="orb"/g) === 1 && count(index, /id="orbCanvas"/g) === 1);
expect('nome acessível da Orbe preservado', /id="orb"[^>]*aria-label="Orbe viva:[^"]+toque duplo abre o Tarot Livre"/.test(homeHero));
expect('status acessível permanece não visual', /id="orbStatus" class="orb-status db-visually-hidden"/.test(homeHero));
expect('header preservado', index.includes('<header class="app-header">'));
expect('dock preservado', index.includes('<nav class="magic-dock" aria-label="Navegação principal">'));
expect('mini-Orbe continua abrindo IA', /data-go="ai" class="dock-orb"/.test(index));
expect('título e metadados SEO preservados', index.includes('<title>Divina Bruxa — Tarot Livre, Carta do Dia e 78 Cartas</title>') && index.includes('application/ld+json'));

let normalizedIndex = index
  .replaceAll('app-v207.js?v=207', 'app-v201.js?v=201')
  .replaceAll('divina.sw.reload.v207', 'divina.sw.reload.v206')
  .replaceAll('sw.js?v=207', 'sw.js?v=206');
expect('index mudou somente nas autoridades V207', hashText(normalizedIndex) === 'b8f8348aceb1dbc14c6df96264383d757030aa69df01f80de8bb840d88cf8228', hashText(normalizedIndex));

expect('index carrega app V207', index.includes('src="app-v207.js?v=207"'));
expect('index não carrega app V201', !index.includes('src="app-v201.js?v=201"'));
expect('registro principal aponta ao SW V207', index.includes("register('./sw.js?v=207')"));
expect('trava de atualização aponta à V207', index.includes('divina.sw.reload.v207'));
expect('CSS visual V206 continua autoridade', index.includes('home-orb-absolute-v206.css?v=206'));

expect('core usa singleton global', core.includes("Symbol.for('divina.orb.motion.core.v207')"));
expect('core define lifecycle global completo', ['ACTIVE', 'SUSPENDED', 'DESTROYED'].every(state => core.includes(`${state}: '${state}'`)));
expect('core registra clientes identificados', core.includes('register({') && core.includes('this.clients = new Map()'));
expect('core controla visibilidade do documento', core.includes("addEventListener('visibilitychange'"));
expect('core controla pagehide e pageshow', core.includes("'pagehide'") && core.includes("'pageshow'"));
expect('core controla freeze e resume', core.includes("addEventListener('freeze'") && core.includes("addEventListener('resume'"));
expect('core controla reduced motion', core.includes("'(prefers-reduced-motion: reduce)'") && core.includes('onReducedMotionChange'));
expect('core limita delta a 50 ms', core.includes("clamp(sinceLastFrame / 1000, .001, .05)"));
expect('core não usa intervalos permanentes', !/setInterval\s*\(/.test(core));
expect('core oferece diagnóstico sem conteúdo privado', core.includes('snapshot()') && core.includes('divinaOrbMotionV207'));
expect('core remove listeners ao destruir', core.includes("removeEventListener?.('pagehide'") && core.includes("removeEventListener('visibilitychange'"));
expect('core é o único relógio das Orbes', /requestAnimationFrame/.test(core) && !/requestAnimationFrame\s*\(/.test(engine) && !/requestAnimationFrame\s*\(/.test(mini));
expect('engines não possuem cancelamento RAF próprio', !/cancelAnimationFrame\s*\(/.test(engine) && !/cancelAnimationFrame\s*\(/.test(mini));

expect('motor principal importa o núcleo V207', engine.includes("from './orb-motion-core-v207.js?v=207'"));
expect('motor principal registra cliente único', engine.includes("id: 'main-orb'"));
expect('motor principal tem singleton', engine.includes("Symbol.for('divina.reality.orb.instance.v207')"));
expect('estados completos da Orbe', ['BOOT','IDLE','TOUCH','HOLD','RELEASE','PORTAL','SUSPENDED','FALLBACK','DESTROYED'].every(state => engine.includes(`${state}: '${state}'`)));
expect('motor principal dorme se for desconectado', engine.includes('this.canvas.isConnected') && engine.includes('this.shell?.isConnected'));
expect('motor pausa fora da rota Home', engine.includes('this.routeActive') && engine.includes("'divina:route-ready'"));
expect('motor pausa fora da viewport', engine.includes('IntersectionObserver') && engine.includes("this.suspend('intersection')"));
expect('motor cancela ponteiro ao suspender', engine.includes('cancelActivePointer()') && engine.includes('releasePointerCapture'));
expect('motor deduplica variáveis CSS', engine.includes('this.cssState = new Map()') && engine.includes("this.cssState.get(name) === value"));
expect('ponte CSS limitada a 30 Hz', engine.includes('time - this.lastCssSync < 1000 / 30'));
expect('timers não retiram o estado suspenso', engine.includes('settleToIdle()') && engine.includes('this.resumeState = ORB_LIFE_STATES_V207.IDLE'));
expect('motor principal não escuta visibility em paralelo', !engine.includes("addEventListener('visibilitychange'"));
expect('motor remove cliente e listeners', engine.includes('this.motionClient?.destroy()') && engine.includes("removeEventListener('divina:route-ready'"));

expect('mini-Orbes importam o mesmo núcleo', mini.includes("from './orb-motion-core-v207.js?v=207'"));
expect('mini-Orbes usam um cliente compartilhado', count(mini, /id: 'mini-orbs'/g) === 1);
expect('mini-Orbes mantêm 30 Hz', mini.includes('reduced ? 1 : 30'));
expect('mini-Orbes pintam somente superfícies visíveis', mini.includes('if (isVisible(orb)) paintLife'));
expect('mini-Orbes observam viewport', mini.includes('new IntersectionObserver'));
expect('mini-Orbes removem vínculos', mini.includes('AbortController') && mini.includes('controller.abort()') && mini.includes('unobserve(orb)'));
expect('mini-Orbes não escutam visibility em paralelo', !mini.includes("addEventListener('visibilitychange'"));

const orbRuntime = `${core}\n${engine}\n${mini}`;
expect('web não usa Vibration API', !/navigator\.vibrate|\.vibrate\s*\(/.test(orbRuntime));
expect('háptica usa apenas ponte nativa opcional', core.includes('globalThis.divinaNativeBridge?.haptics') && engine.includes('requestNativeHapticV207(pattern)') && mini.includes('requestNativeHapticV207(7)'));

const shader = (source, name) => {
  const opening = `const ${name} = ` + '`';
  const start = source.indexOf(opening);
  if (start < 0) return '';
  const bodyStart = start + opening.length;
  const end = source.indexOf('`;', bodyStart);
  return end < 0 ? '' : source.slice(bodyStart, end);
};
const oldVertex = shader(previousEngine, 'VERTEX_SHADER');
const newVertex = shader(engine, 'VERTEX_SHADER');
const oldFragment = shader(previousEngine, 'FRAGMENT_SHADER');
const newFragment = shader(engine, 'FRAGMENT_SHADER');
expect('vertex shader byte a byte', newVertex === oldVertex && hashText(newVertex) === '726e91b6170425a2cc964653eb7a9f6b09b78f276e373e07e689caf27dfe2e9c');
expect('fragment shader byte a byte', newFragment === oldFragment && hashText(newFragment) === '02ea3a49cf1059a02f39d9f6781be93d3775a1ccc9aaa2b79a643d23e6b42bea');

expect('app V207 importa core', app.includes("from './orb-motion-core-v207.js?v=207'"));
expect('app V207 importa motor novo', app.includes("from './orb-engine-v207.js?v=207'"));
expect('app V207 importa mini-Orbes novas', app.includes("from './mini-orb-engine-v207.js?v=207'"));
expect('app V207 não importa motores antigos', !app.includes("from './orb-engine-v68.js") && !app.includes("from './mini-orb-engine.js"));
expect('app expõe snapshot do núcleo', app.includes('window.divinaOrbV207') && app.includes('orbMotionV207.snapshot()'));
expect('fallback opcional do SW aponta V207', app.includes("navigator.serviceWorker.register('./sw.js?v=207')"));

expect('service worker versão 207', /const VERSION = 207;/.test(sw));
expect('quatro caches V207', ['shell','content','images','tarot-offline'].every(kind => sw.includes(`divina-bruxa-v207-${kind}`)));
expect('SW aquece app V207', sw.includes("'./app-v207.js'"));
expect('SW aquece núcleo V207', sw.includes("'./orb-motion-core-v207.js'"));
expect('SW aquece motor V207', sw.includes("'./orb-engine-v207.js'"));
expect('SW aquece mini-Orbes V207', sw.includes("'./mini-orb-engine-v207.js'"));
expect('SW valida app V207', /app-v207\\\.js\\\?v=207/.test(sw));
expect('SW valida Home V206', /home-orb-absolute-v206\\\.css\\\?v=206/.test(sw));

const importPattern = /(?:from\s+|import\s*)['"](\.\/.+?)['"]/g;
for (const [name, source] of [['app-v207.js', app], ['orb-engine-v207.js', engine], ['mini-orb-engine-v207.js', mini]]) {
  for (const match of source.matchAll(importPattern)) {
    const target = match[1].replace(/^\.\//, '').split('?')[0];
    expect(`import existente: ${name} → ${target}`, exists(target));
  }
}

for (const name of ['sw.js','orb-motion-core-v207.js','orb-engine-v207.js','mini-orb-engine-v207.js','app-v207.js','QA-V207-ORBE-NUCLEO-UNICO.mjs']) {
  const syntax = spawnSync(process.execPath, ['--check', path.join(root, name)], { encoding:'utf8' });
  expect(`sintaxe JavaScript: ${name}`, syntax.status === 0, syntax.stderr.trim());
}

const frozen = {
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'navigation.js': '827db63068e3e03d92a02e517c1e9f615e94d8d4ffb45e5851c4851b168f0db6',
  'orb-skin-release-v1.js': '50b66b2ef864ce8a117b4663961afb6d46f76c058600b8316bc08887fa862785',
  'home-orb-absolute-v206.css': '6482ea120123009bb490145cfc366eacd9cdd68de6abb02ea7189fc0e444b6a4',
  'divina-shell-v180.css': 'd45ede5cc056a9ebd754f328b1cbb0c0b1dd4cdf0874972e8fd35e4167c8eddf',
  'menu-completo-v177.css': 'b02312e6c87bf790483082abea206a802aa1babaea79ebb92ba22ef41a54c32f',
  'menu-magic-v7.css': '1cc98eff6ad43b6929e1ff542109272548270bee15700a4d79d9f55b965569e0',
  'menu-ring-v8.css': '1c82ea3200675adf222a1aaa7d899256ec42ec8bbf7469915ec406e9843ae58f',
  'divina-orb-fast-v1.webp': '66c6915571e9547d135d9456343706da77cc50ee5332d5d89f3adcceffb1b8de',
  'divina-orb-thumb-v1.webp': 'eb11d79613119756454ca90be3599849c10650e482968ed19c17ef11e301f873',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'commercial-truth-v200.js': '36e87728606864431297c3941a3be2a8fcfab9381d6a3f635789449cc3a1b9d4'
};
for (const [name, hash] of Object.entries(frozen)) {
  expect(`hash congelado: ${name}`, exists(name) && sha256(name) === hash, exists(name) ? sha256(name) : 'ausente');
}

const cards = fs.readdirSync(root).filter(name => /^card-\d{2}\.webp$/.test(name));
expect('78 cartas físicas preservadas', cards.length === 78, String(cards.length));
expect('cartas 00–77 preservadas', Array.from({ length:78 }, (_, index) => `card-${String(index).padStart(2,'0')}.webp`).every(name => cards.includes(name)));
const commercial = read('commercial-truth-v200.js');
expect('preços 250/150/100/50 preservados', commercial.includes("consultationPrices!=='25000,15000,10000,5000'"));
expect('cobrança real permanece desligada', commercial.includes('realBilling:false') && commercial.includes('checkoutEnabled:false'));

expect('contrato é V207 sobre base V206', contract.release === 207 && contract.base === 206);
expect('contrato congela visual', contract.visual_redesign === false && contract.frozen.includes('fragment_shader'));
expect('contrato reserva V208 e V209', contract.deferred.V208 && contract.deferred.V209);
expect('matriz cobre sete estados de ambiente', lifecycleMatrix.matrix.length === 7);
expect('matriz limita delta', lifecycleMatrix.time_policy.maximum_frame_seconds === 0.05);
expect('manifesto declara dois substituídos', JSON.stringify(manifest.runtime_files.replaced) === JSON.stringify(['index.html','sw.js']));
expect('manifesto declara quatro runtimes novos', JSON.stringify(manifest.runtime_files.new) === JSON.stringify(['orb-motion-core-v207.js','orb-engine-v207.js','mini-orb-engine-v207.js','app-v207.js']));
expect('CNAME protegido e não reenviado', manifest.protected_not_resent.includes('CNAME') && !releaseFiles.includes('CNAME'));
expect('produção e cobrança desligadas', manifest.production_activation === false && manifest.billing_activation === false);
expect('evidência identifica suíte V207', evidence.release === 207 && evidence.status === 'PASS');

class FakeDocument extends EventTarget {
  constructor() { super(); this.hidden = false; }
}
class FakeMediaQuery extends EventTarget {
  constructor() { super(); this.matches = false; }
}
const fakeDocument = new FakeDocument();
const fakeWindowEvents = new EventTarget();
const fakeMedia = new FakeMediaQuery();
globalThis.document = fakeDocument;
globalThis.addEventListener = fakeWindowEvents.addEventListener.bind(fakeWindowEvents);
globalThis.removeEventListener = fakeWindowEvents.removeEventListener.bind(fakeWindowEvents);
globalThis.requestAnimationFrame = callback => setTimeout(() => callback(performance.now()), 2);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.matchMedia = () => fakeMedia;

const coreModule = await import(`${pathToFileURL(path.join(root, 'orb-motion-core-v207.js')).href}?qa=${Date.now()}`);
const runtimeCore = coreModule.orbMotionV207;
let mainActive = true;
let mainFrames = 0;
let miniFrames = 0;
let maximumDelta = 0;
const mainClient = runtimeCore.register({
  id:'qa-main',
  isActive:() => mainActive,
  frameRate:60,
  onFrame:(_time, seconds) => { mainFrames += 1; maximumDelta = Math.max(maximumDelta, seconds); }
});
const miniClient = runtimeCore.register({
  id:'qa-mini',
  isActive:() => true,
  frameRate:30,
  onFrame:() => { miniFrames += 1; }
});

await sleep(55);
expect('simulação: dois clientes avançam no mesmo core', mainFrames >= 2 && miniFrames >= 1, `${mainFrames}/${miniFrames}`);
expect('simulação: apenas um quadro global agendado', runtimeCore.snapshot().scheduledFrames + runtimeCore.snapshot().scheduledWakeTimers <= 1);

mainActive = false;
mainClient.wake('qa-inactive');
const mainAtDeactivate = mainFrames;
const miniAtDeactivate = miniFrames;
await sleep(45);
expect('simulação: superfície inativa fica sem quadros', mainFrames === mainAtDeactivate, `${mainAtDeactivate}→${mainFrames}`);
expect('simulação: mini-Orbe visível continua', miniFrames > miniAtDeactivate, `${miniAtDeactivate}→${miniFrames}`);

fakeDocument.hidden = true;
fakeDocument.dispatchEvent(new Event('visibilitychange'));
const mainAtSuspend = mainFrames;
const miniAtSuspend = miniFrames;
await sleep(40);
expect('simulação: documento oculto suspende tudo', mainFrames === mainAtSuspend && miniFrames === miniAtSuspend);
expect('simulação: lifecycle fica SUSPENDED', runtimeCore.snapshot().lifecycle === 'SUSPENDED');
expect('simulação: nenhum quadro ou timer fica órfão', runtimeCore.snapshot().scheduledFrames === 0 && runtimeCore.snapshot().scheduledWakeTimers === 0);

mainActive = true;
fakeDocument.hidden = false;
fakeDocument.dispatchEvent(new Event('visibilitychange'));
await sleep(55);
expect('simulação: retorno retoma os dois clientes', mainFrames > mainAtSuspend && miniFrames > miniAtSuspend);
expect('simulação: lifecycle volta a ACTIVE', runtimeCore.snapshot().lifecycle === 'ACTIVE');
expect('simulação: delta nunca ultrapassa 50 ms', maximumDelta <= .05, String(maximumDelta));

fakeMedia.matches = true;
const mediaEvent = new Event('change');
Object.defineProperty(mediaEvent, 'matches', { value:true });
fakeMedia.dispatchEvent(mediaEvent);
expect('simulação: preferência reduced motion propaga', runtimeCore.snapshot().reducedMotion === true);

expect('simulação: web sem ponte não solicita háptica', coreModule.requestNativeHapticV207(7) === false);
let nativeHaptics = 0;
globalThis.divinaNativeBridge = { haptics:{ impact:() => { nativeHaptics += 1; } } };
expect('simulação: ponte nativa explícita recebe háptica', coreModule.requestNativeHapticV207(7) === true && nativeHaptics === 1);
delete globalThis.divinaNativeBridge;

mainClient.destroy();
miniClient.destroy();
await sleep(10);
expect('simulação: clientes são removidos sem vazamento', runtimeCore.snapshot().clients.length === 0);
runtimeCore.destroy();
expect('simulação: core termina em DESTROYED', runtimeCore.snapshot().lifecycle === 'DESTROYED');

const checksumNames = releaseFiles.filter(name => name !== 'ARQUIVOS-V207-SHA256.txt');
const checksumLines = read('ARQUIVOS-V207-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const checksumMap = new Map(checksumLines.map(line => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  return match ? [match[2], match[1]] : ['', ''];
}));
expect('lista SHA contém doze arquivos', checksumMap.size === checksumNames.length && !checksumMap.has(''));
checksumNames.forEach(name => expect(`SHA confere: ${name}`, checksumMap.get(name) === sha256(name)));

const failed = tests.filter(test => !test.pass);
for (const test of tests) {
  console.log(`${test.pass ? 'PASS' : 'FAIL'} — ${test.name}${test.pass || !test.detail ? '' : ` (${test.detail})`}`);
}
console.log(`\nV207 QA: ${tests.length - failed.length}/${tests.length} PASS`);
if (failed.length) process.exitCode = 1;
