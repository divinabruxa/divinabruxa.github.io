/* DIVINA BRUXA — WORK13 V604 · QA ESTRUTURAL DA LEITURA COSMICA DIARIA */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const occurrences = (source, pattern) => [...source.matchAll(pattern)].length;
const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});

for (const file of [
  'index.html','app-v208.js','sw.js',
  'cosmos-context-memory-v602.js','cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css',
  'cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V602-MACROETAPA-2.json',
  'MANIFESTO-WORK13-V603-MACROETAPA-3.json','SNAPSHOT-WORK12-V600-PROTEGIDO.zip',
  'reading-ritual-core-v595.js','reading-ritual-core-v595.css','daily-world-v509.js',
  'qa-work13-v604-daily-runtime.mjs','qa-work13-v604-service-worker-runtime.mjs',
  'qa-work13-v604-boot-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const reading = read('cosmic-daily-reading-v604.js');
const styles = read('cosmic-daily-reading-v604.css');
const ritual = read('reading-ritual-core-v595.js');
const daily = read('daily-world-v509.js');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const v602 = JSON.parse(read('MANIFESTO-WORK13-V602-MACROETAPA-2.json'));
const v603 = JSON.parse(read('MANIFESTO-WORK13-V603-MACROETAPA-3.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenFilesChecked = 0;

for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenFilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

check('snapshot:v601-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');
check('snapshot:base-v600', v601.base?.release === 'V600');
check('snapshot:no-runtime-v601', v601.scope?.runtimeChanges === 0);
check('v602:memory-intact', hash('cosmos-context-memory-v602.js') === v602.hashes?.['cosmos-context-memory-v602.js']);
check('v603:resonance-js-intact', hash('cosmos-reality-resonance-v603.js') === v603.hashes?.['cosmos-reality-resonance-v603.js']);
check('v603:resonance-css-intact', hash('cosmos-reality-resonance-v603.css') === v603.hashes?.['cosmos-reality-resonance-v603.css']);
check('work12:ritual-intact', hash('reading-ritual-core-v595.js') === v601.protectedRuntime?.['reading-ritual-core-v595.js']);
check('work12:ritual-css-intact', hash('reading-ritual-core-v595.css') === v601.protectedRuntime?.['reading-ritual-core-v595.css']);
check('work12:daily-intact', hash('daily-world-v509.js') === v601.protectedRuntime?.['daily-world-v509.js']);
check('work12:ritual-sequence', ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])"));
check('work12:daily-brasilia', daily.includes("timeZone:'America/Sao_Paulo'") && daily.includes('onePerDay:true'));

check('index:work13-v604', index.includes('name="divina-work13" content="V604"'));
check('index:fluidity-v604', index.includes('name="divina-fluidity-release" content="V604"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v604', index.includes('app-v208.js?v=604-work13-daily-reading'));
check('index:worker-v604', index.includes("register('./sw.js?v=604'"));
check('index:bootstrap-v604', index.includes("__divinaSWBootstrap='v604-work13-daily-reading-inline'"));
check('index:work13-ready-v604', index.includes("work13Boot='ready-v604'"));
check('index:v604-style', index.includes('cosmic-daily-reading-v604.css?v=604-work13-daily-reading'));
check('index:one-v604-style', occurrences(index, /id="divinaCosmicDailyReadingV604"/g) === 1);
check('index:v603-style-preserved', occurrences(index, /id="divinaCosmosRealityResonanceV603"/g) === 1);
check('index:one-final-style', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:no-v604-orb', !index.includes('id="orbV604"'));
check('index:no-v604-canvas', !index.includes('id="cosmicDailyCanvasV604"'));

check('app:v604-import', app.includes("createCosmicDailyReadingV604 } from './cosmic-daily-reading-v604.js?v=604-work13-daily-reading'"));
check('app:v604-created-once', occurrences(app, /createCosmicDailyReadingV604\(\{/g) === 1, occurrences(app, /createCosmicDailyReadingV604\(\{/g));
check('app:v604-public', app.includes('window.divinaWork13Macro4V604'));
check('app:v604-alias', app.includes('window.divinaCosmosVivoV604 = window.divinaWork13Macro4V604'));
check('app:v604-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro4V604'));
check('app:v603-preserved', app.includes('window.divinaWork13Macro3V603'));
check('app:v602-preserved', app.includes('window.divinaWork13Macro2V602'));
check('app:reading-on-orbe', app.includes('window.orbe.dailyReading = cosmicDailyReading'));
check('app:exact-sequence', app.includes("['card','silence','one-sentence-essence','depth-on-explicit-request']"));
check('app:depth-explicit', app.includes('depthRequiresExplicitGesture:true'));
check('app:no-auto-whit', app.includes('automaticWhitSpeech:false'));
check('app:daily-worker-message', app.includes("event.data?.type === 'DIVINA_WORK13_DAILY_READING_ACTIVE'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('reading:contract', reading.includes('COSMIC_DAILY_READING_CONTRACT_V604'));
check('reading:base-v603', reading.includes("base:'V603-reality-resonance-on-WORK12-V600-frozen-by-V601'"));
check('reading:daily-only', reading.includes("route:'daily'"));
check('reading:exact-sequence', reading.includes("sequence:Object.freeze(['card','silence','one-sentence-essence','depth-on-explicit-request'])"));
check('reading:approved-source', reading.includes("essenceSource:'approved-essence-first-sentence'"));
check('reading:one-sentence', reading.includes('maximumEssenceSentences:1'));
check('reading:control-reused', reading.includes('depthControlReused:true'));
check('reading:depth-explicit', reading.includes('depthRequiresExplicitGesture:true'));
check('reading:no-selection-change', reading.includes('changesCardSelection:false'));
check('reading:no-persistence-change', reading.includes('changesDailyPersistence:false'));
check('reading:no-cycle-change', reading.includes('changesBrasiliaCycle:false'));
check('reading:no-navigation', reading.includes('automaticNavigation:false'));
check('reading:no-whit', reading.includes('automaticWhitSpeech:false'));
check('reading:no-private', reading.includes('privateContentReads:0'));
check('reading:no-intention', reading.includes('intentionReads:0'));
check('reading:no-question', reading.includes('questionReads:0'));
check('reading:no-journal', reading.includes('journalBodyReads:0'));
check('reading:no-card-identity', reading.includes('cardIdentityReads:0'));
check('reading:no-storage', reading.includes('storageReads:0') && reading.includes('storageWrites:0'));
check('reading:no-network-model', reading.includes('networkCalls:0') && reading.includes('modelCalls:0'));
check('reading:one-node-max', reading.includes('newDomNodesMaximum:1'));
check('reading:no-canvas', reading.includes('newCanvases:0'));
check('reading:no-renderer', reading.includes('newRenderers:0'));
check('reading:no-loop', reading.includes('permanentAnimationLoops:0'));
check('reading:no-timer', reading.includes('deferredTimers:0'));
check('reading:no-observer', reading.includes('mutationObservers:0'));
check('reading:no-fetch', !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(reading));
check('reading:no-permanent-clock', !/requestAnimationFrame\s*\(|setInterval\s*\(|setTimeout\s*\(/.test(reading));
check('reading:no-observer-code', !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(reading));
check('reading:no-canvas-code', !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(reading));
check('reading:no-storage-io', !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(reading));
check('reading:no-form-value', !/\.value\b/.test(reading));
check('reading:no-private-field', !/\.intention\b|privateNote|reflectionQuestion/.test(reading));
check('reading:no-navigation-call', !/\.navigate\?\.\(|\bgo\s*\(/.test(reading));
check('reading:no-whit-call', !/\bwhit\??\.|\.speak\?\.\(|\.offer\?\.\(/i.test(reading));
check('reading:no-click-listener', !/listen\([^\n]+['"]click['"]/.test(reading));
check('reading:no-input-listener', !/listen\([^\n]+['"](?:input|change)['"]/.test(reading));
check('reading:phase-event', reading.includes("'divina:reading-ritual-phase'"));
check('reading:public-output-event', reading.includes("'divina:cosmic-daily-reading-updated'"));
check('reading:does-not-emit-content', reading.includes('essenceSentences:visible ? 1 : 0') && !reading.includes('sentence,\n        reason'));
check('reading:abortable-listeners', reading.includes('signal:this.abort.signal'));

check('styles:daily-only', styles.includes('#dailyCard .dw509[data-cosmic-reading="v604"]'));
check('styles:silence-hidden', styles.includes('[data-reading-phase="silence"]'));
check('styles:essence-visible', styles.includes('[data-reading-phase="essence"]'));
check('styles:depth-visible', styles.includes('[data-reading-phase="depth"]'));
check('styles:keywords-after-depth', styles.includes('[data-reading-phase="essence"] .dw509__identity p'));
check('styles:iphone', styles.includes('@media(max-width:430px)'));
check('styles:landscape', styles.includes('@media(orientation:landscape) and (max-height:520px)'));
check('styles:reduced-motion', styles.includes('@media(prefers-reduced-motion:reduce)'));
check('styles:forced-colors', styles.includes('@media(forced-colors:active)'));
check('styles:no-infinite', !/animation[^;]*infinite/.test(styles));
check('styles:no-filter', !/(?:backdrop-)?filter\s*:/.test(styles));
check('styles:no-fixed-overlay', !/position\s*:\s*fixed/.test(styles));

check('worker:v604', worker.includes('const VERSION = 604;'));
check('worker:cache-v604', worker.includes('divina-bruxa-work13-v604-layered-daily-reading'));
check('worker:app-v604', worker.includes("'./app-v208.js?v=604-work13-daily-reading'"));
check('worker:reading-core', worker.includes("'./cosmic-daily-reading-v604.js?v=604-work13-daily-reading'"));
check('worker:reading-style', worker.includes("'./cosmic-daily-reading-v604.css?v=604-work13-daily-reading'"));
check('worker:reading-validates', worker.includes('work13-daily-reading-contract-missing'));
check('worker:reading-styles-validates', worker.includes('work13-daily-reading-styles-missing'));
check('worker:v603-validates', worker.includes('work13-reality-resonance-contract-missing'));
check('worker:v602-validates', worker.includes('work13-context-memory-contract-missing'));
check('worker:work12-validates', worker.includes('work12-final-continuity-contract-missing'));
check('worker:reading-message', worker.includes("type:'DIVINA_WORK13_DAILY_READING_ACTIVE'"));
check('worker:resonance-message', worker.includes("resonanceVersion:603"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V604',
  work:'WORK13',
  macroStage:'4-of-10 / Leitura Cosmica em Camadas — Carta do Dia',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
