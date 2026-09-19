/* DIVINA BRUXA — WORK13 V607 · QA ESTRUTURAL DA SABEDORIA VIVA */
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
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });

for (const file of [
  'index.html','app-v208.js','sw.js','living-wisdom-path-v607.js','living-wisdom-path-v607.css',
  'whit-silence-timing-v606.js','cosmic-spread-reading-v605.js','cosmic-spread-reading-v605.css',
  'cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css',
  'cosmos-context-memory-v602.js','cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css',
  'library-world-v302.js','library-deep-v332.js','public-library-core-v544.js',
  'school-world-v306.js','school-engine.js','school-policy.js','school-library-supreme-v555.css',
  'journal-world-v317.js','journal-engine.js','journal-policy.js','journal-mirror-supreme-v556.css',
  'reality-chambers-v596.js','reality-chambers-v596.css',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V606-MACROETAPA-6.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip',
  'qa-work13-v607-living-runtime.mjs','qa-work13-v607-continuity-runtime.mjs',
  'qa-work13-v607-service-worker-runtime.mjs','qa-work13-v607-boot-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const runtime = read('living-wisdom-path-v607.js');
const styles = read('living-wisdom-path-v607.css');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenFilesChecked = 0;

for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenFilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedWisdom = Object.freeze({
  'library-world-v302.js':'394b9e4aced4939da8b41cff1c9cf540a6d783b88b2ae87f3f55f9ae7c9b2969',
  'library-deep-v332.js':'d65d5ca270dae56034847b868a85f28c8beb09c6453b85ab332bec8f8d48e4fe',
  'public-library-core-v544.js':'c2e9dd11c7bced6014c24697b2c0baee36d6e985626b9da277dda6c3a862a6dd',
  'school-world-v306.js':'b29fd7f86c1859432f06e80ab7234a76628c6b35f09eec316cd972fe6ba5c156',
  'school-engine.js':'00d4846ec3fa8ba97482ea1e361cb946a820ff279669f94768569d400af68da0',
  'school-policy.js':'a3bbd91b2f4537178d729ad80dcef28c39e47575ea40371c8ccdfa956a2183b8',
  'school-library-supreme-v555.css':'f69e3524097b07e70bfa94b49857176c174306b62cea461bdefef7ffdb85e973',
  'journal-world-v317.js':'20b58bd2b928dbf68de42bc730bf32b3abdf01afc9734c3351a381924313809e',
  'journal-engine.js':'6aecd1a33d78d87c835077360bf23f2839692b1ee4a0ca9b55daa5bbd6bd9bc6',
  'journal-policy.js':'738d9b1bf2dcec2c358a9ed9d68bbeeed63ef103d39df02c49aa0dbabccddfbb',
  'journal-mirror-supreme-v556.css':'401b9b5e37644d9a2955cc107d0c50471ae28064ef91caf334df9db0f0f43bed',
  'reality-chambers-v596.js':'1ae6b54a8f53d5e8e89230e042c6cf24bc6c662928e118afbe6be18dc2869fad',
  'reality-chambers-v596.css':'bfc65e0566c7ea5c4acb42aac42245b4fa5079cc25ce124067ce99dfaad25033'
});
for (const [file, expected] of Object.entries(protectedWisdom)) {
  check(`wisdom-engine-protected:${file}`, hash(file) === expected, hash(file));
}

const protectedWork13 = Object.freeze({
  'cosmos-context-memory-v602.js':'82aea44135a5c960700d97a249a870d1a6fe759f1224cb81d3b798296dfa0ce1',
  'cosmos-reality-resonance-v603.js':'d16da25d2552b8aa3023cc94fd0caac0911f6302cdbabc3d99b7a9a4dbb79d51',
  'cosmos-reality-resonance-v603.css':'d6166c2802567a28e5575adc5c73c085f6ee8a530a6876e1a0e71e67677f14ad',
  'cosmic-daily-reading-v604.js':'747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c',
  'cosmic-daily-reading-v604.css':'04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5',
  'cosmic-spread-reading-v605.js':'6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b',
  'cosmic-spread-reading-v605.css':'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff',
  'whit-silence-timing-v606.js':'db625f3495efd65109144b780b8ea47b2177a4996ccc7e1fb215b27eff946e2a'
});
for (const [file, expected] of Object.entries(protectedWork13)) {
  check(`work13-prior-protected:${file}`, hash(file) === expected, hash(file));
}

check('snapshot:v600-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');
check('manifest:v606-intact', hash('MANIFESTO-WORK13-V606-MACROETAPA-6.json') === '8c34176334310246d086a668c2fc8a4e86e8f3bdd3901fb5c31d063ca6c6f8e4');

check('index:work13-v607', index.includes('name="divina-work13" content="V607"'));
check('index:fluidity-v607', index.includes('name="divina-fluidity-release" content="V607"'));
check('index:macro-seven', index.includes('data-macroetapa="work13-7-biblioteca-escola-diario-vivos"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v607', index.includes('app-v208.js?v=607-work13-living-wisdom'));
check('index:style-v607', index.includes('living-wisdom-path-v607.css?v=607-work13-living-wisdom'));
check('index:one-style-v607', occurrences(index, /id="divinaLivingWisdomPathV607"/g) === 1);
check('index:worker-v607', index.includes("register('./sw.js?v=607'"));
check('index:bootstrap-v607', index.includes("__divinaSWBootstrap='v607-work13-living-wisdom-inline'"));
check('index:ready-v607', index.includes("work13Boot='ready-v607'"));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:v606-timing-no-css', !index.includes('whit-silence-timing-v606.css'));
check('index:v605-style-preserved', occurrences(index, /id="divinaCosmicSpreadReadingV605"/g) === 1);
check('index:v604-style-preserved', occurrences(index, /id="divinaCosmicDailyReadingV604"/g) === 1);
check('index:v603-style-preserved', occurrences(index, /id="divinaCosmosRealityResonanceV603"/g) === 1);
check('index:final-style-preserved', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);

check('app:v607-import', app.includes("createLivingWisdomPathV607 } from './living-wisdom-path-v607.js?v=607-work13-living-wisdom'"));
check('app:v607-created-once', occurrences(app, /createLivingWisdomPathV607\(\{/g) === 1, occurrences(app, /createLivingWisdomPathV607\(\{/g));
check('app:v607-public', app.includes('window.divinaWork13Macro7V607'));
check('app:v607-alias', app.includes('window.divinaCosmosVivoV607 = window.divinaWork13Macro7V607'));
check('app:v607-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro7V607'));
check('app:v606-preserved', app.includes('window.divinaWork13Macro6V606'));
check('app:v605-preserved', app.includes('window.divinaWork13Macro5V605'));
check('app:v604-preserved', app.includes('window.divinaWork13Macro4V604'));
check('app:v603-preserved', app.includes('window.divinaWork13Macro3V603'));
check('app:v602-preserved', app.includes('window.divinaWork13Macro2V602'));
check('app:context-passed', app.includes('contextMemory:cosmosContextMemory'));
check('app:chambers-passed', app.includes('chambers:realityChambers'));
check('app:navigation-explicit', app.includes('navigate:go'));
check('app:on-orbe', app.includes('window.orbe.livingWisdom = livingWisdomPath'));
check('app:three-worlds', app.includes("worlds:Object.freeze(['library','school','journal'])"));
check('app:one-sequence', app.includes("sequence:Object.freeze(['one-discovery','one-lesson','direct-writing'])"));
check('app:no-auto-navigation', app.includes('automaticNavigation:false'));
check('app:no-auto-whit', app.includes('automaticWhitSpeech:false'));
check('app:private-zero', app.includes('journalBodyReads:0') && app.includes('schoolNoteReads:0'));
check('app:worker-handler', app.includes("event.data?.type === 'DIVINA_WORK13_LIVING_WISDOM_ACTIVE'"));
check('app:worker-v607', app.includes("register('./sw.js?v=607'"));
check('app:boot-v607', app.includes("work13CosmosVivo:'V607'") && app.includes("work13MacroStage:'7-of-10-living-wisdom-path'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('runtime:contract', runtime.includes('LIVING_WISDOM_PATH_CONTRACT_V607'));
check('runtime:version', runtime.includes('const VERSION = 607;'));
check('runtime:base-v606', runtime.includes("base:'V606-whit-silence-timing-on-WORK12-V600-frozen-by-V601'"));
check('runtime:macro-seven', runtime.includes("macroStage:'7-of-10'"));
check('runtime:worlds', runtime.includes("worlds:Object.freeze(['library','school','journal'])"));
check('runtime:sequence', runtime.includes("sequence:Object.freeze(['one-discovery','one-lesson','direct-writing'])"));
check('runtime:library-one', runtime.includes("libraryEntry:'one-discovery-through-canonical-orb'"));
check('runtime:library-explicit-catalogue', runtime.includes("libraryCatalogue:'explicit-request-only'"));
check('runtime:library-78', runtime.includes('libraryCardsPreserved:78'));
check('runtime:school-one', runtime.includes("schoolEntry:'one-natural-next-lesson'"));
check('runtime:school-explicit-programme', runtime.includes("schoolProgramme:'explicit-request-only'"));
check('runtime:school-counts', runtime.includes('schoolModulesPreserved:17') && runtime.includes('schoolLessonsPreserved:124'));
check('runtime:journal-direct', runtime.includes("journalEntry:'direct-writing-after-explicit-depth'"));
check('runtime:journal-explicit-review', runtime.includes("journalReview:'explicit-request-only'"));
check('runtime:one-continuation', runtime.includes('maximumContextualContinuations:1'));
check('runtime:context-v602', runtime.includes("contextModel:'V602-public-route-metadata-only'"));
check('runtime:depth-marker-reused', runtime.includes("target.dataset.v585DepthStart = 'true'"));
check('runtime:canonical-orb-proxy', runtime.includes("querySelector?.('[data-orb]')?.click?.()"));
check('runtime:journal-explicit-depth', runtime.includes("event?.detail?.source !== 'explicit-gesture'"));
check('runtime:journal-cancels-old-delay', runtime.includes("clearSequence?.(`work13-v607-${reason}`)"));
check('runtime:journal-existing-chamber', runtime.includes("engage?.('journal', 'write'"));
check('runtime:journal-form-focus-only', runtime.includes("#journalForm [name=\"title\"]") && !runtime.includes('.value'));
check('runtime:abortable', runtime.includes('signal:this.abort.signal'));
check('runtime:no-private-form-read', !/FormData|\.elements\.|\.value\b|textContent\s*\.includes/.test(runtime));
check('runtime:no-private-selectors', !/querySelector[^\n]*(?:textarea|data-school-note|journal-text|entries)/i.test(runtime));
check('runtime:no-storage', runtime.includes('storageReads:0') && runtime.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(runtime));
check('runtime:no-network', runtime.includes('networkCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(runtime));
check('runtime:no-model', runtime.includes('modelCalls:0'));
check('runtime:no-canvas', runtime.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(runtime));
check('runtime:no-renderer', runtime.includes('newRenderers:0'));
check('runtime:no-loop', runtime.includes('permanentAnimationLoops:0') && !/setInterval\s*\(/.test(runtime));
check('runtime:no-timer', runtime.includes('deferredTimers:0') && !/setTimeout\s*\(/.test(runtime));
check('runtime:no-observer', runtime.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(runtime));
check('runtime:no-auto-navigation', runtime.includes('automaticNavigation:false') && !/location\.(?:assign|replace)|location\.href\s*=/.test(runtime));
check('runtime:no-auto-whit', runtime.includes('automaticWhitSpeech:false') && !/\.whisper\?\.|\.speak\?\.|\.offer\?\./.test(runtime));
check('runtime:private-zero', ['privateContentReads:0','formValueReads:0','journalBodyReads:0','journalDraftReads:0','journalHistoryReads:0','schoolNoteReads:0','questionReads:0','cardIdentityReads:0'].every(value => runtime.includes(value)));
check('runtime:iphone-first', runtime.includes('iphoneFirst:true'));

check('styles:identity', styles.includes('[data-living-wisdom="v607"]'));
check('styles:library-focus', styles.includes('[data-v607-library-mode="focus"]'));
check('styles:library-catalogue', styles.includes('[data-v607-library-mode="catalogue"]'));
check('styles:school-lesson', styles.includes('[data-v607-school-mode="lesson"]'));
check('styles:journal-write', styles.includes('[data-v607-journal-mode="write"]'));
check('styles:journal-review', styles.includes('[data-v607-journal-mode="review"]'));
check('styles:iphone-430', styles.includes('@media(max-width:430px)'));
check('styles:reduced-motion', styles.includes('@media(prefers-reduced-motion:reduce)'));
check('styles:forced-colors', styles.includes('@media(forced-colors:active)'));
check('styles:no-keyframes', !/@keyframes/.test(styles));
check('styles:no-heavy-filter', !/backdrop-filter|filter\s*:/.test(styles));
check('styles:no-external-url', !/url\s*\(/.test(styles));

check('worker:v607', worker.includes('const VERSION = 607;'));
check('worker:cache-v607', worker.includes('divina-bruxa-work13-v607-living-wisdom'));
check('worker:app-v607', worker.includes("'./app-v208.js?v=607-work13-living-wisdom'"));
check('worker:runtime-v607', worker.includes("'./living-wisdom-path-v607.js?v=607-work13-living-wisdom'"));
check('worker:styles-v607', worker.includes("'./living-wisdom-path-v607.css?v=607-work13-living-wisdom'"));
check('worker:runtime-validates', worker.includes('work13-living-wisdom-contract-missing'));
check('worker:styles-validates', worker.includes('work13-living-wisdom-styles-missing'));
check('worker:v606-preserved', worker.includes("'./whit-silence-timing-v606.js?v=606-work13-whit-timing'"));
check('worker:v605-preserved', worker.includes("'./cosmic-spread-reading-v605.js?v=605-work13-spread-reading'"));
check('worker:v604-preserved', worker.includes("'./cosmic-daily-reading-v604.js?v=604-work13-daily-reading'"));
check('worker:v603-preserved', worker.includes("'./cosmos-reality-resonance-v603.js?v=603-work13-resonance'"));
check('worker:v602-preserved', worker.includes("'./cosmos-context-memory-v602.js?v=602-work13-context'"));
check('worker:message-v607', worker.includes("type:'DIVINA_WORK13_LIVING_WISDOM_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V607',
  work:'WORK13',
  macroStage:'7-of-10 / Biblioteca, Escola e Diario Vivos',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  protectedWisdomFilesChecked:Object.keys(protectedWisdom).length,
  protectedPriorWork13FilesChecked:Object.keys(protectedWork13).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['living-wisdom-path-v607.js','living-wisdom-path-v607.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
