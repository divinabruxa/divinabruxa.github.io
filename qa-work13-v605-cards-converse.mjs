/* DIVINA BRUXA — WORK13 V605 · QA ESTRUTURAL DAS CARTAS QUE CONVERSAM */
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
  'index.html','app-v208.js','sw.js',
  'cosmic-spread-reading-v605.js','cosmic-spread-reading-v605.css',
  'cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css',
  'cosmos-context-memory-v602.js','cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V602-MACROETAPA-2.json',
  'MANIFESTO-WORK13-V603-MACROETAPA-3.json','MANIFESTO-WORK13-V604-MACROETAPA-4.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip','spreads-engine.js','spreads-policy.js','spreads-world-v305.js',
  'spreads-supreme-v331.js','spread-synthesis-v331.js','page-loader-v1.js','tarot-data.js',
  'tarot-livre-orbe-os-v517.js','reading-ritual-core-v595.js',
  'qa-work13-v605-spread-runtime.mjs','qa-work13-v605-dom-runtime.mjs',
  'qa-work13-v605-service-worker-runtime.mjs','qa-work13-v605-boot-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const reading = read('cosmic-spread-reading-v605.js');
const styles = read('cosmic-spread-reading-v605.css');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const v602 = JSON.parse(read('MANIFESTO-WORK13-V602-MACROETAPA-2.json'));
const v603 = JSON.parse(read('MANIFESTO-WORK13-V603-MACROETAPA-3.json'));
const v604 = JSON.parse(read('MANIFESTO-WORK13-V604-MACROETAPA-4.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenFilesChecked = 0;

for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenFilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

check('snapshot:v601-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');
check('snapshot:base-v600', v601.base?.release === 'V600');
check('v602:context-intact', hash('cosmos-context-memory-v602.js') === v602.hashes?.['cosmos-context-memory-v602.js']);
check('v603:resonance-js-intact', hash('cosmos-reality-resonance-v603.js') === v603.hashes?.['cosmos-reality-resonance-v603.js']);
check('v603:resonance-css-intact', hash('cosmos-reality-resonance-v603.css') === v603.hashes?.['cosmos-reality-resonance-v603.css']);
check('v604:daily-js-intact', hash('cosmic-daily-reading-v604.js') === v604.hashes?.['cosmic-daily-reading-v604.js']);
check('v604:daily-css-intact', hash('cosmic-daily-reading-v604.css') === v604.hashes?.['cosmic-daily-reading-v604.css']);
check('v604:manifest-intact', hash('MANIFESTO-WORK13-V604-MACROETAPA-4.json') === '6ccec77bb11d4d13762fe86f699d1eb7943b75b6f09c108f28cf6c68c4d990e4');

const protectedSpreadFiles = Object.freeze({
  'spreads-engine.js':'ddb9eed9c73c644a704f7e157dd463fb488d688d31ec7fbe58d35d7ab42f2122',
  'spreads-policy.js':'6004c575f51e625d21dd0c91d7fb61a902a707d98eba9222f54cc97ca0ebc52b',
  'spreads-world-v305.js':'9ad0e7d2138190bad4b60b8e1c1f394b34ae6d0fb5e7e01fe30ad7f329aa9d2a',
  'spreads-supreme-v331.js':'db7fa2f61b5c5e908fb05ecdfa5a3bfbdc70b8b925d6d18e191e85ebf0611e4e',
  'spread-synthesis-v331.js':'3eb62a5e6e54ce3aa8531103acaefc3821cda773c97ac574ae2ae227fd2ac1ad',
  'page-loader-v1.js':'184c5b01def3737eaee452f933c4ba1f676b5260557f8b712dd83fd850d54a6e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51'
});
for (const [file, expected] of Object.entries(protectedSpreadFiles)) check(`spread-base-protected:${file}`, hash(file) === expected, hash(file));

check('index:work13-v605', index.includes('name="divina-work13" content="V605"'));
check('index:fluidity-v605', index.includes('name="divina-fluidity-release" content="V605"'));
check('index:macro-five', index.includes('data-macroetapa="work13-5-cartas-conversam-sintese"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v605', index.includes('app-v208.js?v=605-work13-spread-reading'));
check('index:worker-v605', index.includes("register('./sw.js?v=605'"));
check('index:bootstrap-v605', index.includes("__divinaSWBootstrap='v605-work13-spread-reading-inline'"));
check('index:ready-v605', index.includes("work13Boot='ready-v605'"));
check('index:spread-style', index.includes('cosmic-spread-reading-v605.css?v=605-work13-spread-reading'));
check('index:one-spread-style', occurrences(index, /id="divinaCosmicSpreadReadingV605"/g) === 1);
check('index:v604-style-preserved', occurrences(index, /id="divinaCosmicDailyReadingV604"/g) === 1);
check('index:v603-style-preserved', occurrences(index, /id="divinaCosmosRealityResonanceV603"/g) === 1);
check('index:one-final-style', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:no-v605-orb', !index.includes('id="orbV605"'));
check('index:no-v605-canvas', !index.includes('id="spreadCanvasV605"'));

check('app:v605-import', app.includes("createCosmicSpreadReadingV605 } from './cosmic-spread-reading-v605.js?v=605-work13-spread-reading'"));
check('app:v605-created-once', occurrences(app, /createCosmicSpreadReadingV605\(\)/g) === 1, occurrences(app, /createCosmicSpreadReadingV605\(\)/g));
check('app:v605-public', app.includes('window.divinaWork13Macro5V605'));
check('app:v605-alias', app.includes('window.divinaCosmosVivoV605 = window.divinaWork13Macro5V605'));
check('app:v605-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro5V605'));
check('app:v604-preserved', app.includes('window.divinaWork13Macro4V604'));
check('app:v603-preserved', app.includes('window.divinaWork13Macro3V603'));
check('app:v602-preserved', app.includes('window.divinaWork13Macro2V602'));
check('app:spread-on-orbe', app.includes('window.orbe.spreadReading = cosmicSpreadReading'));
check('app:cards-converse', app.includes('cardsConverse:true'));
check('app:one-synthesis', app.includes('oneSentenceSynthesis:true'));
check('app:exact-sequence', app.includes("['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request']"));
check('app:tarot-protected', app.includes('tarotFreeAutomaticMeanings:false') && app.includes('tarotFreeChanged:false'));
check('app:no-auto-whit', app.includes('automaticWhitSpeech:false'));
check('app:spread-worker-message', app.includes("event.data?.type === 'DIVINA_WORK13_SPREAD_READING_ACTIVE'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('reading:contract', reading.includes('COSMIC_SPREAD_READING_CONTRACT_V605'));
check('reading:base-v604', reading.includes("base:'V604-layered-daily-reading-on-WORK12-V600-frozen-by-V601'"));
check('reading:route-only-spreads', reading.includes("route:'spreads'"));
check('reading:sequence', reading.includes("sequence:Object.freeze(['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])"));
check('reading:approved-editorial', reading.includes("essenceSource:'approved-local-editorial-first-sentence'"));
check('reading:editorial-lazy', !reading.includes("from './daily-meaning-runtime.js'") && reading.includes('globalThis.DivinaBruxaTarotMeanings'));
check('reading:one-essence', reading.includes('maximumVisibleEssenceSentences:1'));
check('reading:three-voices', reading.includes('maximumConversationVoices:3'));
check('reading:one-synthesis', reading.includes('maximumVisibleSynthesisSentences:1'));
check('reading:depth-explicit', reading.includes('depthRequiresExplicitGesture:true'));
check('reading:fifteen-methods', reading.includes('methodsPreserved:15'));
check('reading:royal-78', reading.includes('royalTableCardsPreserved:78'));
check('reading:normal-only', reading.includes('normalOnly:true'));
check('reading:no-repeat', reading.includes('noRepeats:true'));
check('reading:no-selection-change', reading.includes('changesCardSelection:false'));
check('reading:no-shuffle-change', reading.includes('changesShuffle:false'));
check('reading:no-premium-change', reading.includes('changesPremiumAuthority:false'));
check('reading:no-persistence-change', reading.includes('changesPersistence:false'));
check('reading:tarot-free-protected', reading.includes('tarotFreeAutomaticMeanings:false') && reading.includes('tarotFreeChanged:false'));
check('reading:no-navigation', reading.includes('automaticNavigation:false'));
check('reading:no-whit', reading.includes('automaticWhitSpeech:false') && !/whit:speak|whit:whisper|\.speak\?\.\(|\.offer\?\.\(/i.test(reading));
check('reading:no-private', reading.includes('privateContentReads:0'));
check('reading:no-intention', reading.includes('intentionReads:0'));
check('reading:no-question', reading.includes('questionReads:0') && !/session\?*\.question|session\[['"]question['"]\]/.test(reading));
check('reading:no-journal', reading.includes('journalBodyReads:0'));
check('reading:no-unrevealed', reading.includes('unrevealedCardReads:0') && reading.includes('slice(0, revealed)'));
check('reading:no-storage', reading.includes('storageReads:0') && reading.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(reading));
check('reading:no-network-model', reading.includes('networkCalls:0') && reading.includes('modelCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(reading));
check('reading:no-canvas', reading.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(reading));
check('reading:no-renderer', reading.includes('newRenderers:0'));
check('reading:no-loop', reading.includes('permanentAnimationLoops:0') && !/setInterval\s*\(|requestAnimationFrame\s*\(/.test(reading));
check('reading:one-timer', reading.includes('maximumDeferredTimers:1') && occurrences(reading, /this\.timer\s*=\s*this\.setTimer\(/g) === 1);
check('reading:no-observer', reading.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(reading));
check('reading:one-click-listener', reading.includes("this.listen(doc, 'click', event => this.onClick(event))"));
check('reading:no-input-listener', !/this\.listen\([^\n]+['"](?:input|change)['"]/.test(reading));
check('reading:abortable-listeners', reading.includes('signal:this.abort.signal'));
check('reading:public-event', reading.includes("'divina:cosmic-spread-reading-updated'"));
check('reading:event-no-content', !/conversation\s*:|synthesis\s*:|cardName\s*:/.test((reading.match(/emitUpdate\(reading, reason\) \{([\s\S]*?)\n  \}/) || [,''])[1]));

check('styles:spreads-only', styles.includes('#spreads [data-cosmic-spread-reading="v605"]') && !styles.includes('#tarot '));
check('styles:silence', styles.includes('[data-cosmic-spread-phase="silence"]'));
check('styles:essence', styles.includes('.db605-card-essence'));
check('styles:conversation', styles.includes('.db605-conversation'));
check('styles:synthesis', styles.includes('[data-cosmic-spread-synthesis="v605"]'));
check('styles:depth', styles.includes('.db605-depth-call') && styles.includes('.db605-synthesis-depth'));
check('styles:touch-target', styles.includes('min-height:46px'));
check('styles:iphone', styles.includes('@media(max-width:430px)'));
check('styles:landscape', styles.includes('@media(orientation:landscape) and (max-height:520px)'));
check('styles:reduced-motion', styles.includes('@media(prefers-reduced-motion:reduce)'));
check('styles:forced-colors', styles.includes('@media(forced-colors:active)'));
check('styles:no-infinite', !/animation[^;]*infinite/.test(styles));
check('styles:no-backdrop-filter', !/backdrop-filter\s*:/.test(styles));
check('styles:no-fixed-overlay', !/position\s*:\s*fixed/.test(styles));

check('worker:v605', worker.includes('const VERSION = 605;'));
check('worker:cache-v605', worker.includes('divina-bruxa-work13-v605-cards-converse'));
check('worker:app-v605', worker.includes("'./app-v208.js?v=605-work13-spread-reading'"));
check('worker:spread-js', worker.includes("'./cosmic-spread-reading-v605.js?v=605-work13-spread-reading'"));
check('worker:spread-css', worker.includes("'./cosmic-spread-reading-v605.css?v=605-work13-spread-reading'"));
check('worker:spread-contract-validates', worker.includes('work13-spread-reading-contract-missing'));
check('worker:spread-styles-validates', worker.includes('work13-spread-reading-styles-missing'));
check('worker:v604-validates', worker.includes('work13-daily-reading-contract-missing'));
check('worker:v603-validates', worker.includes('work13-reality-resonance-contract-missing'));
check('worker:v602-validates', worker.includes('work13-context-memory-contract-missing'));
check('worker:work12-validates', worker.includes('work12-final-continuity-contract-missing'));
check('worker:spread-message', worker.includes("type:'DIVINA_WORK13_SPREAD_READING_ACTIVE'"));
check('worker:daily-message', worker.includes('dailyReadingVersion:604'));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V605',
  work:'WORK13',
  macroStage:'5-of-10 / Cartas que Conversam — Tiragens em Camadas',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  protectedSpreadFilesChecked:Object.keys(protectedSpreadFiles).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['cosmic-spread-reading-v605.js','cosmic-spread-reading-v605.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
