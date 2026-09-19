/* DIVINA BRUXA — WORK13 V602 · QA ESTRUTURAL DA MEMORIA GLOBAL */
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
  'index.html','app-v208.js','sw.js','cosmos-context-memory-v602.js',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','SNAPSHOT-WORK12-V600-PROTEGIDO.zip',
  'work12-final-continuity-v598.js','work12-final-continuity-v598.css',
  'experience-intelligence-v597.js','experience-intelligence-v597.css',
  'qa-work13-v602-context-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const memory = read('cosmos-context-memory-v602.js');
const baseline = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenFilesChecked = 0;

for (const [file, expected] of Object.entries(baseline.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenFilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

check('snapshot:v601-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');
check('snapshot:base-commit', baseline.base?.commit === '17f5c88c5195e834cf0d1ef28892644f988a6069');
check('snapshot:base-v600', baseline.base?.release === 'V600');
check('snapshot:no-runtime-v601', baseline.scope?.runtimeChanges === 0);

check('index:work13-v602', index.includes('name="divina-work13" content="V602"'));
check('index:work12-v600-preserved', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600-preserved', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v602', index.includes('app-v208.js?v=602-work13-context'));
check('index:worker-v602', index.includes("register('./sw.js?v=602'"));
check('index:bootstrap-v602', index.includes("__divinaSWBootstrap='v602-work13-context-inline'"));
check('index:work12-ready-preserved', index.includes("work12Boot='ready-v600'"));
check('index:work13-ready', index.includes("work13Boot='ready-v602'"));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:one-final-style', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);
check('index:no-context-css', !index.includes('cosmos-context-memory-v602.css'));

check('app:context-import', app.includes("createCosmosContextMemoryV602 } from './cosmos-context-memory-v602.js?v=602-work13-context'"));
check('app:context-created-once', occurrences(app, /createCosmosContextMemoryV602\(\)/g) === 1, occurrences(app, /createCosmosContextMemoryV602\(\)/g));
check('app:context-on-orbe', app.includes('window.orbe.contextMemory = cosmosContextMemory'));
check('app:cosmos-on-orbe', app.includes('window.orbe.cosmos = cosmosContextMemory'));
check('app:work13-public', app.includes('window.divinaWork13Macro2V602'));
check('app:work13-alias', app.includes('window.divinaCosmosVivoV602 = window.divinaWork13Macro2V602'));
check('app:no-auto-navigation', app.includes('automaticNavigation:false'));
check('app:no-auto-whit', app.includes('automaticWhitSpeech:false'));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));
check('app:final-continuity-preserved', app.includes('window.divinaWork12Macro10V598'));
check('app:context-worker-message', app.includes("event.data?.type === 'DIVINA_WORK13_CONTEXT_ACTIVE'"));

check('memory:contract', memory.includes('COSMOS_CONTEXT_MEMORY_CONTRACT_V602'));
check('memory:base-frozen', memory.includes("base:'WORK12-V600-frozen-by-V601'"));
check('memory:session-model', memory.includes("model:'local-session-route-metadata-only'"));
check('memory:single-key', memory.includes("const STORAGE_KEY = 'divina.work13.context.v602'"));
check('memory:retention-six-hours', memory.includes('retentionHours:6'));
check('memory:one-next', memory.includes('maximumSuggestedSteps:1'));
check('memory:clearable', memory.includes('clearable:true'));
check('memory:no-auto-navigation', memory.includes('automaticNavigation:false'));
check('memory:no-auto-whit', memory.includes('automaticWhitSpeech:false'));
check('memory:no-private-read', memory.includes('privateContentReads:0'));
check('memory:no-form-read', memory.includes('formValueReads:0'));
check('memory:no-card-read', memory.includes('cardIdentityReads:0'));
check('memory:no-emotion', memory.includes('emotionInference:false'));
check('memory:no-network-contract', memory.includes('networkCalls:0'));
check('memory:no-model-contract', memory.includes('modelCalls:0'));
check('memory:no-timer-contract', memory.includes('deferredTimers:0'));
check('memory:no-loop-contract', memory.includes('permanentAnimationLoops:0'));
check('memory:no-observer-contract', memory.includes('mutationObservers:0'));
check('memory:no-canvas-contract', memory.includes('newCanvases:0'));
check('memory:no-renderer-contract', memory.includes('newRenderers:0'));
check('memory:no-fetch', !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(memory));
check('memory:no-permanent-loop', !/requestAnimationFrame\s*\(|setInterval\s*\(/.test(memory));
check('memory:no-timer', !/setTimeout\s*\(/.test(memory));
check('memory:no-observer', !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(memory));
check('memory:no-canvas', !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(memory));
check('memory:no-form-content', !/\.value\b|innerHTML|innerText|textContent/.test(memory));
check('memory:no-local-storage-io', !/(?:globalThis|window|windowTarget)\??\.localStorage|\blocalStorage\.(?:getItem|setItem|removeItem)/.test(memory));
check('memory:no-navigation-call', !/\.navigate\?\.\(|\bgo\s*\(/.test(memory));
check('memory:no-click-listener', !/listen\([^\n]+['"]click['"]/.test(memory));
check('memory:no-input-listener', !/listen\([^\n]+['"](?:input|change)['"]/.test(memory));
check('memory:abortable-listeners', memory.includes('signal:this.abort.signal'));
check('memory:path-bounded', memory.includes('const MAX_PATH = 6'));
check('memory:commercial-silence', memory.includes("'ai','consultations','store','login','subscriptions','notifications','admin'"));
check('memory:daily-to-journal', memory.includes("reason:'daily-to-journal'"));
check('memory:tarot-to-library', memory.includes("reason:'card-to-symbol'"));
check('memory:library-to-school', memory.includes("reason:'symbol-to-study'"));
check('memory:journal-return', memory.includes("reason:'writing-to-origin'"));

check('worker:v602', worker.includes('const VERSION = 602;'));
check('worker:cache-v602', worker.includes('divina-bruxa-work13-v602-context-memory'));
check('worker:app-v602', worker.includes("'./app-v208.js?v=602-work13-context'"));
check('worker:context-core', worker.includes("'./cosmos-context-memory-v602.js?v=602-work13-context'"));
check('worker:context-validates', worker.includes('work13-context-memory-contract-missing'));
check('worker:work12-validates', worker.includes('work12-final-continuity-contract-missing'));
check('worker:context-message', worker.includes("type:'DIVINA_WORK13_CONTEXT_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V602',
  work:'WORK13',
  macroStage:'2-of-10 / Memoria de Contexto Global',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['cosmos-context-memory-v602.js'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
