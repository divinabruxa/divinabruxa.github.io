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
const expect = (name, condition, detail = '') => tests.push({ name, pass:Boolean(condition), detail });
const skipFinalArtifacts = process.env.DIVINA_QA_PREPARE === '1';

const releaseFiles = [
  'index.html',
  'sw.js',
  'orb-gesture-core-v208.js',
  'orb-engine-v208.js',
  'app-v208.js',
  'WORK7-0-DIAGNOSTICO-E-ORDEM-OFICIAL.md',
  'WORK7-0-ESPECIFICACAO-MESTRA-DIVINA-BRUXA-2.0.md',
  'WORK7-0-PRODUCT-CONTRACT-V208.json',
  '00-LEIA-PRIMEIRO-V208-WORK7-TOQUE-ORGANICO.txt',
  'ORB-GESTURE-CONTRACT-V208.json',
  'ORB-GESTURE-MATRIX-V208.json',
  'MANIFESTO-V208-WORK7-TOQUE-ORGANICO.json',
  'QA-V208-WORK7-TOQUE-ORGANICO.mjs',
  'EVIDENCIA-QA-V208.json',
  'ARQUIVOS-V208-SHA256.txt'
];

releaseFiles.forEach(name => expect(`arquivo presente: ${name}`, exists(name)));

const index = read('index.html');
const sw = read('sw.js');
const gestureSource = read('orb-gesture-core-v208.js');
const engine = read('orb-engine-v208.js');
const previousEngine = read('orb-engine-v207.js');
const app = read('app-v208.js');
const diagnosis = read('WORK7-0-DIAGNOSTICO-E-ORDEM-OFICIAL.md');
const specification = read('WORK7-0-ESPECIFICACAO-MESTRA-DIVINA-BRUXA-2.0.md');
const product = JSON.parse(read('WORK7-0-PRODUCT-CONTRACT-V208.json'));
const contract = JSON.parse(read('ORB-GESTURE-CONTRACT-V208.json'));
const matrix = JSON.parse(read('ORB-GESTURE-MATRIX-V208.json'));
const manifest = JSON.parse(read('MANIFESTO-V208-WORK7-TOQUE-ORGANICO.json'));

const homeStart = index.indexOf('<section id="home"');
const homeEnd = index.indexOf('<section class="home-paths"', homeStart);
const home = index.slice(homeStart, homeEnd);
expect('Home V206 continua ativa', /id="home"[^>]*\bhome-orb-only-v206\b/.test(home));
expect('Home central continua sem H1', !/<h1\b/i.test(home));
expect('Home central continua sem home-copy', !home.includes('class="home-copy"'));
expect('Home central continua sem chamada visível', !/TOQUE PARA DESPERTAR|touch-hint|>ORBE VIVA — MENU MÁGICO</i.test(home));
expect('Orbe principal continua única', count(index, /id="orb"/g) === 1 && count(index, /id="orbCanvas"/g) === 1);
expect('Orbe conserva nome acessível', /id="orb"[^>]*aria-label="Orbe viva:[^"]+toque duplo abre o Tarot Livre"/.test(home));
expect('status da Orbe permanece não visual', /id="orbStatus" class="orb-status db-visually-hidden"/.test(home));
expect('cabeçalho preservado', index.includes('<header class="app-header">'));
expect('dock preservado', index.includes('<nav class="magic-dock" aria-label="Navegação principal">'));
expect('mini-Orbe preserva destino IA', /data-go="ai" class="dock-orb"/.test(index));
expect('metadados e título SEO preservados', index.includes('<title>Divina Bruxa — Tarot Livre, Carta do Dia e 78 Cartas</title>') && index.includes('application/ld+json'));
expect('CSS visual V206 continua autoridade', index.includes('home-orb-absolute-v206.css?v=206'));

const normalizedIndex = index
  .replaceAll('app-v208.js?v=208', 'app-v207.js?v=207')
  .replaceAll('divina.sw.reload.v208', 'divina.sw.reload.v207')
  .replaceAll('sw.js?v=208', 'sw.js?v=207');
expect('index mudou somente nas autoridades V208', hashText(normalizedIndex) === '9eeeca75d682f3348f54c4b056f5735b1efdc49ccab045a8047cd72328d6d098', hashText(normalizedIndex));
expect('index carrega somente app V208', index.includes('src="app-v208.js?v=208"') && !index.includes('src="app-v207.js?v=207"'));
expect('bootstrap registra SW V208', index.includes("register('./sw.js?v=208')"));
expect('trava de atualização aponta à V208', index.includes('divina.sw.reload.v208'));

expect('árbitro não toca no DOM', !/\bdocument\b|\bwindow\b|getBoundingClientRect|querySelector|classList|\.style\b/.test(gestureSource));
expect('árbitro não cria relógio próprio', !/requestAnimationFrame|cancelAnimationFrame|setInterval|setTimeout/.test(gestureSource));
expect('árbitro expõe fases completas', ['IDLE','PRESS','HOLD','DRAG','RELEASE','CANCELLED','NAVIGATING','DESTROYED'].every(state => gestureSource.includes(`${state}: '${state}'`)));
expect('árbitro expõe resultados completos', ['NONE','TAP','DOUBLE_TAP','DRAG','HOLD','CANCEL'].every(state => gestureSource.includes(`${state}: '${state}'`)));
expect('limiar de movimento permanece 0,032', gestureSource.includes('moveThreshold: .032'));
expect('duplo toque permanece 430 ms / 0,16', gestureSource.includes('doubleTapMilliseconds: 430') && gestureSource.includes('doubleTapRadius: .16'));
expect('tap permanece até 720 ms', gestureSource.includes('tapMaximumMilliseconds: 720'));
expect('hold é temporal e explícito', gestureSource.includes('holdMilliseconds: 1188'));
expect('delta do gesto é limitado a 50 ms', gestureSource.includes('maximumDeltaSeconds: .05'));
expect('fila conserva somente a amostra mais recente', gestureSource.includes('const latest = list[list.length - 1]') && gestureSource.includes('this.pendingSample = this.sample'));
expect('velocidade é normalizada por segundos', gestureSource.includes('dx / seconds') && gestureSource.includes('velocityFollowRate'));
expect('navegação possui trava e sequência', gestureSource.includes('navigationLocked') && gestureSource.includes('navigationSequence'));

const hotStart = engine.indexOf('\n  pointerMove(event) {');
const hotEnd = engine.indexOf('\n  pointerUp(event) {', hotStart);
const pointerMove = engine.slice(hotStart, hotEnd);
expect('caminho quente do pointermove foi localizado', hotStart > 0 && hotEnd > hotStart);
expect('pointermove não mede layout', !pointerMove.includes('getBoundingClientRect') && !pointerMove.includes('refreshGeometry'));
expect('pointermove não escreve CSS', !pointerMove.includes('setCssVariable') && !pointerMove.includes('.style'));
expect('pointermove consome coalesced events', pointerMove.includes('getCoalescedEvents'));
expect('pointermove entrega somente a última amostra', pointerMove.includes('samples[samples.length - 1]'));
expect('movimento acorda o núcleo compartilhado', pointerMove.includes('this.requestFrame()'));
expect('geometria é atualizada no início do gesto', engine.includes('this.eventSample(event, true)'));
expect('geometria é atualizada em resize', /resize\(\) \{\s*this\.refreshGeometry\(\)/.test(engine));
expect('contenção existe somente na superfície da Orbe', engine.includes("this.shell.style.touchAction = 'none'") && engine.includes("this.shell.style.overscrollBehavior = 'contain'"));
expect('estilos de gesto são restaurados no destroy', engine.includes('this.gestureStyle.touchAction') && engine.includes('this.gestureStyle.overscrollBehavior'));
expect('lostpointercapture cancela com segurança', engine.includes("addEventListener('lostpointercapture'") && engine.includes("removeEventListener('lostpointercapture'"));
expect('teclado Enter e Espaço possuem fluxo próprio', engine.includes("event.key !== 'Enter'") && engine.includes('keyDown(event)') && engine.includes('keyUp(event)'));
expect('clique assistivo detail zero é preservado', engine.includes('if (event.detail !== 0) return'));
expect('clique sintético do teclado é suprimido', engine.includes('suppressSyntheticClick'));
expect('abrir exige trava de navegação', engine.includes('!this.gesture.beginNavigation()'));
expect('trava termina ao fim do portal', engine.includes('this.gesture.endNavigation()'));
expect('suspensão cancela gesto ativo', engine.includes('if (this.down) this.cancelActivePointer()'));
expect('engine V208 não cria RAF próprio', !/requestAnimationFrame\s*\(/.test(engine) && !/cancelAnimationFrame\s*\(/.test(engine));
expect('engine V208 não escuta visibilidade em paralelo', !engine.includes("addEventListener('visibilitychange'"));
expect('engine usa o mesmo núcleo V207', engine.includes("from './orb-motion-core-v207.js?v=207'"));
expect('engine usa árbitro V208', engine.includes("from './orb-gesture-core-v208.js?v=208'"));
expect('engine tem singleton V208', engine.includes("Symbol.for('divina.reality.orb.instance.v208')"));
expect('engine remove árbitro e listeners', engine.includes('this.gesture.destroy()') && engine.includes('this.motionClient?.destroy()'));

const runtimeGesture = `${gestureSource}\n${engine}`;
expect('web não usa Vibration API', !/navigator\.vibrate|\.vibrate\s*\(/.test(runtimeGesture));
expect('háptica continua exclusiva da ponte nativa', engine.includes('requestNativeHapticV207(pattern)'));

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
expect('vertex shader permanece byte a byte', newVertex === oldVertex && hashText(newVertex) === '726e91b6170425a2cc964653eb7a9f6b09b78f276e373e07e689caf27dfe2e9c');
expect('fragment shader permanece byte a byte', newFragment === oldFragment && hashText(newFragment) === '02ea3a49cf1059a02f39d9f6781be93d3775a1ccc9aaa2b79a643d23e6b42bea');

expect('app identifica V208', app.startsWith('/* DIVINA BRUXA — APLICATIVO V208'));
expect('app importa motor V208', app.includes("from './orb-engine-v208.js?v=208'"));
expect('app preserva núcleo e mini-Orbes V207', app.includes("from './orb-motion-core-v207.js?v=207'") && app.includes("from './mini-orb-engine-v207.js?v=207'"));
expect('app não importa motor principal V207', !app.includes("from './orb-engine-v207.js?v=207'"));
expect('app expõe diagnóstico V208', app.includes('window.divinaOrbV208') && app.includes('version: 208'));
expect('fallback de registro aponta ao SW V208', app.includes("navigator.serviceWorker.register('./sw.js?v=208')"));

expect('service worker é V208', /const VERSION = 208;/.test(sw));
expect('quatro caches são V208', ['shell','content','images','tarot-offline'].every(kind => sw.includes(`divina-bruxa-v208-${kind}`)));
expect('SW aquece app V208', sw.includes("'./app-v208.js'"));
expect('SW aquece árbitro V208', sw.includes("'./orb-gesture-core-v208.js'"));
expect('SW aquece motor V208', sw.includes("'./orb-engine-v208.js'"));
expect('SW preserva núcleo e mini-Orbes V207', sw.includes("'./orb-motion-core-v207.js'") && sw.includes("'./mini-orb-engine-v207.js'"));
expect('SW valida app V208 e Home V206', /app-v208\\\.js\\\?v=208/.test(sw) && /home-orb-absolute-v206\\\.css\\\?v=206/.test(sw));

const importPattern = /(?:from\s+|import\s*)['"](\.\/.+?)['"]/g;
for (const [name, source] of [['app-v208.js', app], ['orb-engine-v208.js', engine]]) {
  for (const match of source.matchAll(importPattern)) {
    const target = match[1].replace(/^\.\//, '').split('?')[0];
    expect(`import existente: ${name} → ${target}`, exists(target));
  }
}

for (const name of ['sw.js','orb-gesture-core-v208.js','orb-engine-v208.js','app-v208.js','QA-V208-WORK7-TOQUE-ORGANICO.mjs']) {
  const syntax = spawnSync(process.execPath, ['--check', path.join(root, name)], { encoding:'utf8' });
  expect(`sintaxe JavaScript: ${name}`, syntax.status === 0, syntax.stderr.trim());
}

const frozen = {
  'orb-engine-v207.js': '3c6dbe2967d8b97a88fecf5e0797edf660fd293a420d2250673168572372ec1a',
  'orb-motion-core-v207.js': 'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'mini-orb-engine-v207.js': 'fa881b30f709f79c5acc7017ccbccd9d87714a733450ca5ca6233eb9051e217c',
  'home-orb-absolute-v206.css': '6482ea120123009bb490145cfc366eacd9cdd68de6abb02ea7189fc0e444b6a4',
  'navigation.js': '827db63068e3e03d92a02e517c1e9f615e94d8d4ffb45e5851c4851b168f0db6',
  'divina-shell-v180.css': 'd45ede5cc056a9ebd754f328b1cbb0c0b1dd4cdf0874972e8fd35e4167c8eddf',
  'menu-completo-v177.css': 'b02312e6c87bf790483082abea206a802aa1babaea79ebb92ba22ef41a54c32f',
  'divina-orb-fast-v1.webp': '66c6915571e9547d135d9456343706da77cc50ee5332d5d89f3adcceffb1b8de',
  'divina-orb-thumb-v1.webp': 'eb11d79613119756454ca90be3599849c10650e482968ed19c17ef11e301f873',
  'commercial-truth-v200.js': '36e87728606864431297c3941a3be2a8fcfab9381d6a3f635789449cc3a1b9d4'
};
for (const [name, hash] of Object.entries(frozen)) {
  expect(`hash congelado: ${name}`, exists(name) && sha256(name) === hash, exists(name) ? sha256(name) : 'ausente');
}

const cards = fs.readdirSync(root).filter(name => /^card-\d{2}\.webp$/.test(name));
expect('78 cartas físicas preservadas', cards.length === 78, String(cards.length));
expect('cartas 00–77 preservadas', Array.from({ length:78 }, (_, indexValue) => `card-${String(indexValue).padStart(2,'0')}.webp`).every(name => cards.includes(name)));
const commercial = read('commercial-truth-v200.js');
expect('preços 250/150/100/50 preservados', commercial.includes("consultationPrices!=='25000,15000,10000,5000'"));
expect('cobrança real permanece desligada', commercial.includes('realBilling:false') && commercial.includes('checkoutEnabled:false'));

expect('diagnóstico declara V207 publicada e V208 inicial', diagnosis.includes('**Base publicada confirmada:** V207') && diagnosis.includes('**Primeira macroetapa do WORK7.0:** V208'));
expect('diagnóstico registra limite honesto da recuperação Whit', diagnosis.includes('não retornou a transcrição integral'));
expect('diagnóstico fixa 19 versões V208–V226', count(diagnosis, /^\| V2(?:0[89]|1\d|2[0-6]) \|/gm) === 19);
expect('especificação cobre os mundos solicitados', ['Início','Tarot Livre','Tiragens','Escola','Whit','Consultas','Música','Conta','Vídeos','Biblioteca','Carta do Dia','Loja Mística','Diário','Skins','Premium','Notificações'].every(term => specification.includes(term)));
expect('especificação separa presença local de inteligência paga', specification.includes('Presença Whit local') && specification.includes('Inteligência Whit'));
expect('especificação proíbe conteúdo inventado', specification.includes('Nenhum conteúdo ou disponibilidade inventado'));
expect('especificação fixa 17 módulos e 124 aulas', specification.includes('17 módulos') && specification.includes('124 aulas'));
expect('especificação mantém vídeo honestamente vazio', specification.includes('nenhum episódio oficial publicado'));

expect('contrato de produto é V208 sobre V207', product.candidate === 208 && product.installedBaseline === 207);
expect('contrato de produto mantém Home somente Orbe', JSON.stringify(product.home.visibleCenter) === JSON.stringify(['living-orb']));
expect('contrato de produto preserva Tarot 78 direto', product.tarotTruth.cards === 78 && product.tarotTruth.reversed === false && product.tarotTruth.freeTarotMeanings === false);
expect('contrato de produto preserva preços de consultas', product.commercialTruth.consultations.map(item => item.price).join(',') === '250,150,100,50');
expect('Premium inclui 30 skins e compra individual', product.commercialTruth.premium.includesAllSkins && product.commercialTruth.skinCount === 30 && product.commercialTruth.individualSkinSales);
expect('produto mantém Sol e cobrança real desligados', !product.commercialTruth.ai.solEnabled && !product.commercialTruth.realBillingEnabled);
expect('ordem contém 19 macroetapas', product.releaseOrder.length === 19 && product.releaseOrder[0].version === 208 && product.releaseOrder.at(-1).version === 226);
expect('contrato de gesto congela visual', contract.release === 208 && contract.visualChangeAuthorized === false);
expect('contrato de gesto proíbe layout/CSS no hot path', contract.hotPath.pointerMoveLayoutReads === 0 && contract.hotPath.pointerMoveCssWrites === 0);
expect('matriz cobre oito entradas', matrix.matrix.length === 8);
expect('bateria oficial preservada', matrix.testBattery.taps === 200 && matrix.testBattery.drags === 200 && matrix.testBattery.holds === 100 && matrix.testBattery.doubleTaps === 100);
expect('manifesto declara somente cinco runtimes', manifest.runtimeFiles.replaced.length === 2 && manifest.runtimeFiles.new.length === 3);
expect('manifesto protege CNAME e 78 cartas', manifest.protectedNotResent.includes('CNAME') && manifest.protectedNotResent.includes('78 card images'));
expect('manifesto não ativa ambiente externo', !manifest.databaseMutation && !manifest.externalWrites && !manifest.billingActivation && !manifest.productionActivation);

const gestureModule = await import(`${pathToFileURL(path.join(root, 'orb-gesture-core-v208.js')).href}?qa=${Date.now()}`);
const { OrbGestureCoreV208, ORB_GESTURE_OUTCOMES_V208 } = gestureModule;
const point = (x = .5, y = .5) => ({ x, y });

const tapCore = new OrbGestureCoreV208();
let taps = 0;
for (let indexValue = 0; indexValue < 200; indexValue += 1) {
  const at = indexValue * 1000;
  tapCore.begin({ pointerId:indexValue, pointerType:'touch', point:point(), pressure:.5, time:at });
  const result = tapCore.end({ pointerId:indexValue, point:point(), pressure:0, time:at + 90 });
  if (result.outcome === ORB_GESTURE_OUTCOMES_V208.TAP) taps += 1;
}
expect('simulação: 200 toques são 200 pulsos', taps === 200, String(taps));
expect('simulação: toques isolados não criam navegação', tapCore.snapshot().navigationSequence === 0);

const dragCore = new OrbGestureCoreV208();
let drags = 0;
for (let indexValue = 0; indexValue < 200; indexValue += 1) {
  const at = indexValue * 1000;
  dragCore.begin({ pointerId:indexValue, pointerType:'touch', point:point(.34,.48), pressure:.42, time:at });
  dragCore.queue(indexValue, [{ point:point(.72,.55), pressure:.63, time:at + 70 }]);
  dragCore.consume(at + 70);
  const result = dragCore.end({ pointerId:indexValue, point:point(.76,.58), pressure:0, time:at + 130 });
  if (result.outcome === ORB_GESTURE_OUTCOMES_V208.DRAG) drags += 1;
}
expect('simulação: 200 arrastes são classificados', drags === 200, String(drags));
expect('simulação: arrastes não criam navegação', dragCore.snapshot().navigationSequence === 0);

const holdCore = new OrbGestureCoreV208();
let holds = 0;
let holdTransitions = 0;
for (let indexValue = 0; indexValue < 100; indexValue += 1) {
  const at = indexValue * 2000;
  holdCore.begin({ pointerId:indexValue, pointerType:'touch', point:point(), pressure:.5, time:at });
  const frame = holdCore.consume(at + 1200);
  if (frame.becameHold) holdTransitions += 1;
  const result = holdCore.end({ pointerId:indexValue, point:point(), pressure:0, time:at + 1280 });
  if (result.outcome === ORB_GESTURE_OUTCOMES_V208.HOLD) holds += 1;
}
expect('simulação: 100 holds são classificados', holds === 100, String(holds));
expect('simulação: cada hold anuncia uma única transição', holdTransitions === 100, String(holdTransitions));
expect('simulação: holds não criam navegação', holdCore.snapshot().navigationSequence === 0);

const doubleCore = new OrbGestureCoreV208();
let firstTaps = 0;
let doubleTaps = 0;
let acceptedNavigations = 0;
let rejectedDuplicates = 0;
for (let indexValue = 0; indexValue < 100; indexValue += 1) {
  const at = indexValue * 2000;
  doubleCore.begin({ pointerId:`${indexValue}-a`, pointerType:'touch', point:point(.5,.5), pressure:.5, time:at });
  const first = doubleCore.end({ pointerId:`${indexValue}-a`, point:point(.5,.5), pressure:0, time:at + 70 });
  doubleCore.begin({ pointerId:`${indexValue}-b`, pointerType:'touch', point:point(.52,.49), pressure:.5, time:at + 180 });
  const second = doubleCore.end({ pointerId:`${indexValue}-b`, point:point(.52,.49), pressure:0, time:at + 250 });
  if (first.outcome === ORB_GESTURE_OUTCOMES_V208.TAP) firstTaps += 1;
  if (second.outcome === ORB_GESTURE_OUTCOMES_V208.DOUBLE_TAP) {
    doubleTaps += 1;
    if (doubleCore.beginNavigation()) acceptedNavigations += 1;
    if (!doubleCore.beginNavigation()) rejectedDuplicates += 1;
    doubleCore.endNavigation();
  }
}
expect('simulação: 100 primeiros toques aguardam o segundo', firstTaps === 100, String(firstTaps));
expect('simulação: 100 duplos são classificados', doubleTaps === 100, String(doubleTaps));
expect('simulação: 100 duplos geram exatamente 100 navegações', acceptedNavigations === 100 && doubleCore.snapshot().navigationSequence === 100, `${acceptedNavigations}/${doubleCore.snapshot().navigationSequence}`);
expect('simulação: tentativa duplicada é bloqueada 100 vezes', rejectedDuplicates === 100, String(rejectedDuplicates));

const cancelCore = new OrbGestureCoreV208();
let cancellations = 0;
for (let indexValue = 0; indexValue < 100; indexValue += 1) {
  const at = indexValue * 1000;
  cancelCore.begin({ pointerId:indexValue, pointerType:'touch', point:point(), pressure:.5, time:at });
  const result = cancelCore.cancel(indexValue, at + 40);
  if (result.outcome === ORB_GESTURE_OUTCOMES_V208.CANCEL) cancellations += 1;
}
expect('simulação: 100 cancelamentos são classificados', cancellations === 100, String(cancellations));
expect('simulação: cancelamentos nunca navegam', cancelCore.snapshot().navigationSequence === 0);

const coalescedCore = new OrbGestureCoreV208();
coalescedCore.begin({ pointerId:1, pointerType:'pen', point:point(.1,.1), pressure:.1, time:0 });
coalescedCore.queue(1, [
  { point:point(.2,.2), pressure:.2, time:10 },
  { point:point(.3,.3), pressure:.3, time:20 },
  { point:point(.8,.7), pressure:.8, time:30 }
]);
const latest = coalescedCore.consume(30);
expect('simulação: consumo usa a amostra coalescida mais recente', latest.movement?.point.x === .8 && latest.movement?.point.y === .7 && latest.movement?.pressure === .8);
coalescedCore.end({ pointerId:1, point:point(.8,.7), pressure:0, time:40 });

const stalledCore = new OrbGestureCoreV208();
stalledCore.begin({ pointerId:1, pointerType:'touch', point:point(.2,.2), pressure:.4, time:0 });
stalledCore.queue(1, [{ point:point(.7,.7), pressure:.6, time:5000 }]);
const stalled = stalledCore.consume(5000);
expect('simulação: pausa longa limita delta a 50 ms', stalled.movement?.seconds === .05, String(stalled.movement?.seconds));
stalledCore.cancel(1, 5001);

const lockedCore = new OrbGestureCoreV208();
lockedCore.begin({ pointerId:9, point:point(), time:0 });
expect('simulação: navegação é recusada durante ponteiro ativo', lockedCore.beginNavigation() === false);
lockedCore.cancel(9, 1);
expect('simulação: navegação aceita depois do gesto e bloqueia reentrada', lockedCore.beginNavigation() === true && lockedCore.beginNavigation() === false);
lockedCore.endNavigation();

if (!skipFinalArtifacts) {
  const evidence = JSON.parse(read('EVIDENCIA-QA-V208.json'));
  expect('evidência identifica suíte V208 aprovada', evidence.release === 208 && evidence.status === 'PASS' && evidence.severity.P0 === 0 && evidence.severity.P1 === 0);
  const checksumNames = releaseFiles.filter(name => name !== 'ARQUIVOS-V208-SHA256.txt');
  const checksumLines = read('ARQUIVOS-V208-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
  const checksumMap = new Map(checksumLines.map(line => {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    return match ? [match[2], match[1]] : ['', ''];
  }));
  expect('lista SHA contém quatorze arquivos', checksumMap.size === checksumNames.length && !checksumMap.has(''));
  checksumNames.forEach(name => expect(`SHA confere: ${name}`, checksumMap.get(name) === sha256(name)));
}

const failed = tests.filter(test => !test.pass);
for (const test of tests) {
  console.log(`${test.pass ? 'PASS' : 'FAIL'} — ${test.name}${test.pass || !test.detail ? '' : ` (${test.detail})`}`);
}
console.log(`\nV208 QA: ${tests.length - failed.length}/${tests.length} PASS`);
if (failed.length) process.exitCode = 1;
