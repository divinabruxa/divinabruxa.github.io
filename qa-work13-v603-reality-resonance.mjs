/* DIVINA BRUXA — WORK13 V603 · QA ESTRUTURAL DA RESSONANCIA VIVA */
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
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V602-MACROETAPA-2.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip',
  'work12-final-continuity-v598.js','work12-final-continuity-v598.css',
  'experience-intelligence-v597.js','experience-intelligence-v597.css',
  'qa-work13-v603-resonance-runtime.mjs','qa-work13-v603-service-worker-runtime.mjs',
  'qa-work13-v603-boot-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const memory = read('cosmos-context-memory-v602.js');
const resonance = read('cosmos-reality-resonance-v603.js');
const styles = read('cosmos-reality-resonance-v603.css');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const v602 = JSON.parse(read('MANIFESTO-WORK13-V602-MACROETAPA-2.json'));
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
check('v602:memory-intact', hash('cosmos-context-memory-v602.js') === v602.hashes?.['cosmos-context-memory-v602.js'], hash('cosmos-context-memory-v602.js'));
check('v602:memory-contract', memory.includes('COSMOS_CONTEXT_MEMORY_CONTRACT_V602'));
check('v602:context-local', memory.includes("model:'local-session-route-metadata-only'"));
check('v602:no-auto-navigation', memory.includes('automaticNavigation:false'));
check('v602:no-auto-whit', memory.includes('automaticWhitSpeech:false'));

check('index:work13-v603', index.includes('name="divina-work13" content="V603"'));
check('index:work12-v600-preserved', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600-preserved', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v603', index.includes('app-v208.js?v=603-work13-resonance'));
check('index:worker-v603', index.includes("register('./sw.js?v=603'"));
check('index:bootstrap-v603', index.includes("__divinaSWBootstrap='v603-work13-resonance-inline'"));
check('index:work12-ready-preserved', index.includes("work12Boot='ready-v600'"));
check('index:work13-ready', index.includes("work13Boot='ready-v603'"));
check('index:resonance-style', index.includes('cosmos-reality-resonance-v603.css?v=603-work13-resonance'));
check('index:one-resonance-style', occurrences(index, /id="divinaCosmosRealityResonanceV603"/g) === 1);
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:one-final-style', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);
check('index:no-second-universe-root', !index.includes('id="divinaLivingUniverseV603"'));

check('app:context-preserved', app.includes("createCosmosContextMemoryV602 } from './cosmos-context-memory-v602.js?v=602-work13-context'"));
check('app:context-created-once', occurrences(app, /createCosmosContextMemoryV602\(\)/g) === 1, occurrences(app, /createCosmosContextMemoryV602\(\)/g));
check('app:resonance-import', app.includes("createCosmosRealityResonanceV603 } from './cosmos-reality-resonance-v603.js?v=603-work13-resonance'"));
check('app:resonance-created-once', occurrences(app, /createCosmosRealityResonanceV603\(\{/g) === 1, occurrences(app, /createCosmosRealityResonanceV603\(\{/g));
check('app:resonance-on-orbe', app.includes('window.orbe.resonance = cosmosRealityResonance'));
check('app:work13-v603-public', app.includes('window.divinaWork13Macro3V603'));
check('app:work13-v603-alias', app.includes('window.divinaCosmosVivoV603 = window.divinaWork13Macro3V603'));
check('app:v602-public-preserved', app.includes('window.divinaWork13Macro2V602'));
check('app:no-auto-navigation', app.includes('automaticNavigation:false'));
check('app:no-auto-whit', app.includes('automaticWhitSpeech:false'));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));
check('app:resonance-worker-message', app.includes("event.data?.type === 'DIVINA_WORK13_RESONANCE_ACTIVE'"));
check('app:context-worker-preserved', app.includes("event.data?.type === 'DIVINA_WORK13_CONTEXT_ACTIVE'"));

check('resonance:contract', resonance.includes('COSMOS_REALITY_RESONANCE_CONTRACT_V603'));
check('resonance:base-v602', resonance.includes("base:'V602-context-memory-on-WORK12-V600-frozen-by-V601'"));
check('resonance:public-model', resonance.includes("inputModel:'public-route-and-public-phase-only'"));
check('resonance:seventeen-routes', occurrences(resonance, /Object\.freeze\(\{ mode:/g) === 17, occurrences(resonance, /Object\.freeze\(\{ mode:/g));
check('resonance:existing-universe', resonance.includes('reusesExistingUniverse:true'));
check('resonance:existing-veil', resonance.includes('reusesExistingVeil:true'));
check('resonance:skin-respected', resonance.includes('respectsCurrentSkin:true'));
check('resonance:event-driven', resonance.includes('eventDriven:true'));
check('resonance:no-auto-navigation', resonance.includes('automaticNavigation:false'));
check('resonance:no-auto-whit', resonance.includes('automaticWhitSpeech:false'));
check('resonance:no-private-read', resonance.includes('privateContentReads:0'));
check('resonance:no-form-read', resonance.includes('formValueReads:0'));
check('resonance:no-journal-read', resonance.includes('journalBodyReads:0'));
check('resonance:no-card-read', resonance.includes('cardIdentityReads:0'));
check('resonance:no-emotion', resonance.includes('emotionInference:false'));
check('resonance:no-storage', resonance.includes('storageReads:0') && resonance.includes('storageWrites:0'));
check('resonance:no-network-contract', resonance.includes('networkCalls:0'));
check('resonance:no-model-contract', resonance.includes('modelCalls:0'));
check('resonance:no-dom-contract', resonance.includes('newDomNodes:0'));
check('resonance:no-canvas-contract', resonance.includes('newCanvases:0'));
check('resonance:no-renderer-contract', resonance.includes('newRenderers:0'));
check('resonance:no-loop-contract', resonance.includes('permanentAnimationLoops:0'));
check('resonance:no-timer-contract', resonance.includes('deferredTimers:0'));
check('resonance:no-observer-contract', resonance.includes('mutationObservers:0'));
check('resonance:no-fetch', !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(resonance));
check('resonance:no-permanent-loop', !/requestAnimationFrame\s*\(|setInterval\s*\(/.test(resonance));
check('resonance:no-timer', !/setTimeout\s*\(/.test(resonance));
check('resonance:no-observer', !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(resonance));
check('resonance:no-created-element', !/createElement\s*\(/.test(resonance));
check('resonance:no-canvas', !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(resonance));
check('resonance:no-content-read', !/\.value\b|innerHTML|innerText|textContent/.test(resonance));
check('resonance:no-storage-io', !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(resonance));
check('resonance:no-navigation-call', !/\.navigate\?\.\(|\bgo\s*\(/.test(resonance));
check('resonance:no-whit-call', !/\bwhit\??\.|\.speak\?\.\(|\.offer\?\.\(/i.test(resonance));
check('resonance:no-ignite-call', !/\.ignite\?\.\(|\.signalPresence\?\.\(/.test(resonance));
check('resonance:no-click-listener', !/listen\([^\n]+['"]click['"]/.test(resonance));
check('resonance:no-input-listener', !/listen\([^\n]+['"](?:input|change)['"]/.test(resonance));
check('resonance:abortable-listeners', resonance.includes('signal:this.abort.signal'));
check('resonance:context-event', resonance.includes("'divina:context-memory-updated'"));
check('resonance:route-start-event', resonance.includes("'divina:route-start'"));
check('resonance:public-output-event', resonance.includes("'divina:cosmos-resonance-updated'"));

check('styles:existing-veil-only', styles.includes('#divinaLivingUniverseV524 .db524-universe__veil'));
check('styles:no-new-root', !styles.includes('#divinaLivingUniverseV603'));
check('styles:no-pseudo-layer', !/::before|::after/.test(styles));
check('styles:typed-focus-x', styles.includes('@property --db603-focus-x'));
check('styles:typed-focus-y', styles.includes('@property --db603-focus-y'));
check('styles:skin-accent', styles.includes('var(--db-skin-accent'));
check('styles:skin-gold', styles.includes('var(--db-supreme-gold'));
check('styles:travel-quiet', styles.includes('[data-cosmos-resonance-state="travel"]'));
check('styles:essential-quiet', styles.includes('[data-experience-budget="essential"]'));
check('styles:reduced-motion', styles.includes('@media (prefers-reduced-motion: reduce)'));
check('styles:no-keyframes', !/@keyframes/.test(styles));
check('styles:no-animation', !/animation\s*:/.test(styles));
check('styles:no-filter', !/(?:backdrop-)?filter\s*:/.test(styles));
check('styles:no-will-change', !/will-change\s*:/.test(styles));

check('worker:v603', worker.includes('const VERSION = 603;'));
check('worker:cache-v603', worker.includes('divina-bruxa-work13-v603-reality-resonance'));
check('worker:app-v603', worker.includes("'./app-v208.js?v=603-work13-resonance'"));
check('worker:context-core-v602', worker.includes("'./cosmos-context-memory-v602.js?v=602-work13-context'"));
check('worker:resonance-core', worker.includes("'./cosmos-reality-resonance-v603.js?v=603-work13-resonance'"));
check('worker:resonance-styles', worker.includes("'./cosmos-reality-resonance-v603.css?v=603-work13-resonance'"));
check('worker:resonance-validates', worker.includes('work13-reality-resonance-contract-missing'));
check('worker:context-validates', worker.includes('work13-context-memory-contract-missing'));
check('worker:work12-validates', worker.includes('work12-final-continuity-contract-missing'));
check('worker:resonance-message', worker.includes("type:'DIVINA_WORK13_RESONANCE_ACTIVE'"));
check('worker:context-message', worker.includes("type:'DIVINA_WORK13_CONTEXT_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V603',
  work:'WORK13',
  macroStage:'3-of-10 / Universo Reage Leve',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
