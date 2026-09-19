/* DIVINA BRUXA — WORK13 V606 · QA ESTRUTURAL DE SILENCIO, UTILIDADE E TIMING */
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
  'index.html','app-v208.js','sw.js','whit-silence-timing-v606.js',
  'whit-living-presence-v594.js','whit-orb-soul-bridge-v581.js','experience-message-governor-v580.js',
  'whit-presence-v307.js','whit-nervous-system-v308.js','whit-signature-v311.js','whit-core-supreme-v527.js',
  'cosmic-spread-reading-v605.js','cosmic-spread-reading-v605.css',
  'cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css',
  'cosmos-context-memory-v602.js','cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V602-MACROETAPA-2.json',
  'MANIFESTO-WORK13-V603-MACROETAPA-3.json','MANIFESTO-WORK13-V604-MACROETAPA-4.json',
  'MANIFESTO-WORK13-V605-MACROETAPA-5.json','SNAPSHOT-WORK12-V600-PROTEGIDO.zip',
  'reading-ritual-core-v595.js','tarot-livre-orbe-os-v517.js','spreads-supreme-v331.js',
  'qa-work13-v606-whit-runtime.mjs','qa-work13-v606-event-runtime.mjs',
  'qa-work13-v606-service-worker-runtime.mjs','qa-work13-v606-boot-runtime.mjs'
]) check(`file:${file}`, exists(file), file);

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const timing = read('whit-silence-timing-v606.js');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const v602 = JSON.parse(read('MANIFESTO-WORK13-V602-MACROETAPA-2.json'));
const v603 = JSON.parse(read('MANIFESTO-WORK13-V603-MACROETAPA-3.json'));
const v604 = JSON.parse(read('MANIFESTO-WORK13-V604-MACROETAPA-4.json'));
const v605 = JSON.parse(read('MANIFESTO-WORK13-V605-MACROETAPA-5.json'));
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
check('v605:spread-js-intact', hash('cosmic-spread-reading-v605.js') === v605.hashes?.['cosmic-spread-reading-v605.js']);
check('v605:spread-css-intact', hash('cosmic-spread-reading-v605.css') === v605.hashes?.['cosmic-spread-reading-v605.css']);
check('v605:manifest-intact', hash('MANIFESTO-WORK13-V605-MACROETAPA-5.json') === '1febcb476d7b709a73de7a756852a7915238b134838eca74a641b35bf2f96835');

const protectedWhitFiles = Object.freeze({
  'whit-living-presence-v594.js':'8572a154f2ec4a35089de489b5dc4472d2cebc17c219b991d290ba8ab1833fc0',
  'whit-orb-soul-bridge-v581.js':'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866',
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-nervous-system-v308.js':'58bdddaea417b64f67631b4db2cebd107caed16bbc5feb127ae5d894408b4744',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'reading-ritual-core-v595.js':'f864b08e01074a820a58ba6781eb6493075b9bba42d78d8156c4d8bd95e3efe3',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'spreads-supreme-v331.js':'db7fa2f61b5c5e908fb05ecdfa5a3bfbdc70b8b925d6d18e191e85ebf0611e4e'
});
for (const [file, expected] of Object.entries(protectedWhitFiles)) {
  check(`whit-base-protected:${file}`, hash(file) === expected, hash(file));
}

check('index:work13-v606', index.includes('name="divina-work13" content="V606"'));
check('index:fluidity-v606', index.includes('name="divina-fluidity-release" content="V606"'));
check('index:macro-six', index.includes('data-macroetapa="work13-6-whit-silencio-timing"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v606', index.includes('app-v208.js?v=606-work13-whit-timing'));
check('index:worker-v606', index.includes("register('./sw.js?v=606'"));
check('index:bootstrap-v606', index.includes("__divinaSWBootstrap='v606-work13-whit-timing-inline'"));
check('index:ready-v606', index.includes("work13Boot='ready-v606'"));
check('index:spread-style-preserved', occurrences(index, /id="divinaCosmicSpreadReadingV605"/g) === 1);
check('index:daily-style-preserved', occurrences(index, /id="divinaCosmicDailyReadingV604"/g) === 1);
check('index:resonance-style-preserved', occurrences(index, /id="divinaCosmosRealityResonanceV603"/g) === 1);
check('index:final-style-preserved', occurrences(index, /id="divinaWork12FinalContinuityV598"/g) === 1);
check('index:no-v606-style', !index.includes('whit-silence-timing-v606.css'));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:no-v606-orb', !index.includes('id="orbV606"'));
check('index:no-v606-canvas', !index.includes('id="whitCanvasV606"'));
check('index:no-v606-ui', !index.includes('data-work13-whit-timing-ui'));

check('app:v606-import', app.includes("createWhitSilenceTimingV606 } from './whit-silence-timing-v606.js?v=606-work13-whit-timing'"));
check('app:v606-created-once', occurrences(app, /createWhitSilenceTimingV606\(\{/g) === 1, occurrences(app, /createWhitSilenceTimingV606\(\{/g));
check('app:v606-public', app.includes('window.divinaWork13Macro6V606'));
check('app:v606-alias', app.includes('window.divinaCosmosVivoV606 = window.divinaWork13Macro6V606'));
check('app:v606-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro6V606'));
check('app:v605-preserved', app.includes('window.divinaWork13Macro5V605'));
check('app:v604-preserved', app.includes('window.divinaWork13Macro4V604'));
check('app:v603-preserved', app.includes('window.divinaWork13Macro3V603'));
check('app:v602-preserved', app.includes('window.divinaWork13Macro2V602'));
check('app:timing-on-orbe', app.includes('window.orbe.whitTiming = whitSilenceTiming'));
check('app:passes-v594', app.includes('livingPresence:whitLivingPresence'));
check('app:passes-v581', app.includes('soul:whitOrbSoul'));
check('app:passes-v307', app.includes('presence:whitPresence'));
check('app:passes-v308', app.includes('nervousSystem:whitNerves'));
check('app:passes-v311', app.includes('signature:whitSignature'));
check('app:passes-v527', app.includes('supreme:whitSupreme'));
check('app:passes-v580', app.includes('governor:messageGovernor'));
check('app:silence-default', app.includes("defaultResponse:'silence'"));
check('app:explicit-policy', app.includes("visibleSpeechPolicy:'explicit-invitation-or-consent-only'"));
check('app:no-reveal-speech', app.includes('automaticRevealSpeech:false'));
check('app:no-completion-speech', app.includes('automaticCompletionSpeech:false'));
check('app:no-skin-speech', app.includes('automaticSkinSpeech:false'));
check('app:no-context-call', app.includes('contextMemoryTriggersWhit:false'));
check('app:no-new-body', app.includes('newWhitBodies:0') && app.includes('newDomNodes:0'));
check('app:worker-message', app.includes("event.data?.type === 'DIVINA_WORK13_WHIT_TIMING_ACTIVE'"));
check('app:worker-v606', app.includes("register('./sw.js?v=606'"));
check('app:boot-v606', app.includes("work13CosmosVivo:'V606'") && app.includes("work13MacroStage:'6-of-10-whit-silence-timing'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('timing:contract', timing.includes('WHIT_SILENCE_TIMING_CONTRACT_V606'));
check('timing:version', timing.includes('const VERSION = 606;'));
check('timing:base-v605', timing.includes("base:'V605-cards-converse-on-WORK12-V600-frozen-by-V601'"));
check('timing:macro-six', timing.includes("macroStage:'6-of-10'"));
check('timing:canonical-residence', timing.includes("residence:'canonical-orb'"));
check('timing:silence-default', timing.includes("defaultResponse:'silence'"));
check('timing:nonverbal', timing.includes('nonverbalStructuralResponse:true'));
check('timing:explicit-policy', timing.includes("visibleSpeechPolicy:'explicit-invitation-or-consent-only'"));
check('timing:v594-authority', timing.includes("contextualOfferAuthority:'V594-qualified-pause-unchanged'"));
check('timing:offer-limit-preserved', timing.includes('maximumContextualOffersPerSession:2'));
check('timing:no-touch-speech', timing.includes('ordinaryTouchSpeech:false'));
check('timing:no-arrival-speech', timing.includes('routeArrivalSpeech:false'));
check('timing:no-reveal-speech', timing.includes('automaticRevealSpeech:false'));
check('timing:no-completion-speech', timing.includes('automaticCompletionSpeech:false'));
check('timing:no-skin-speech', timing.includes('automaticSkinSpeech:false'));
check('timing:no-legacy-whisper', timing.includes('automaticLegacyWhisperSpeech:false'));
check('timing:absolute-silence', timing.includes("travelPolicy:'absolute-silence'") && timing.includes("menuPolicy:'absolute-silence'") && timing.includes("hiddenPagePolicy:'absolute-silence'"));
check('timing:explicit-kinds', ['library-whit-invite','spread-whit-invite','school-whit-invite','journal-whit-invite','consent-required','consent-changed'].every(kind => timing.includes(`'${kind}'`)));
check('timing:structural-kinds', ['spread-reveal','school-complete','skin-change','whisper'].every(kind => timing.includes(`'${kind}'`)));
check('timing:nerve-proxy', timing.includes('nerves.signal = this.nerveSignalProxy'));
check('timing:forces-visible-false', timing.includes('visible:false'));
check('timing:signature-proxy', timing.includes('signature.offerEventLine = this.signatureOfferProxy'));
check('timing:automatic-signature-silent', timing.includes('AUTOMATIC_SIGNATURE_KINDS.has(normalized)'));
check('timing:restores-nerves', timing.includes('this.nervousSystem.signal = this.originalNerveSignal'));
check('timing:restores-signature', timing.includes('this.signature.offerEventLine = this.originalSignatureOffer'));
check('timing:travel-listeners', timing.includes("'divina:route-start','divina:supreme-orb-will-navigate'"));
check('timing:menu-listener', timing.includes("'divina:menu-state'"));
check('timing:hidden-listener', timing.includes("'visibilitychange'"));
check('timing:v594-offer-listener', timing.includes("'divina:whit-living-offer'"));
check('timing:abortable', timing.includes('signal:this.controller.signal'));
check('timing:no-ui', !/createElement\s*\(|innerHTML\s*=|insertAdjacentHTML|append\s*\(|prepend\s*\(/.test(timing));
check('timing:no-style', !/\.css['"]|createElement\s*\(\s*['"]link['"]|style\.setProperty/.test(timing));
check('timing:no-private-selectors', !/(?:input|textarea|contenteditable|journalApp|spreadIntention|chatInput)/i.test(timing));
check('timing:no-storage', timing.includes('storageReads:0') && timing.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(timing));
check('timing:no-network', timing.includes('networkCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(timing));
check('timing:no-model', timing.includes('modelCalls:0'));
check('timing:no-canvas', timing.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(timing));
check('timing:no-renderer', timing.includes('newRenderers:0'));
check('timing:no-loop', timing.includes('permanentAnimationLoops:0') && !/requestAnimationFrame\s*\(|setInterval\s*\(/.test(timing));
check('timing:no-timer', timing.includes('deferredTimers:0') && !/setTimeout\s*\(/.test(timing));
check('timing:no-observer', timing.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(timing));
check('timing:no-private', timing.includes('privateContentReads:0') && timing.includes('formValueReads:0') && timing.includes('journalBodyReads:0') && timing.includes('questionReads:0') && timing.includes('cardIdentityReads:0'));
check('timing:no-emotion-inference', timing.includes('emotionInference:false'));
check('timing:no-context-trigger', timing.includes('contextMemoryTriggersWhit:false') && !/contextMemory\?\.|context\.next|nextStep\(/.test(timing));
check('timing:no-automatic-navigation', !/\.navigate\?\.|\.go\?\.|location\.(?:assign|replace)|location\.href\s*=/.test(timing));
check('timing:iphone-first', timing.includes('iphoneFirst:true'));

check('worker:v606', worker.includes('const VERSION = 606;'));
check('worker:cache-v606', worker.includes('divina-bruxa-work13-v606-whit-silence-timing'));
check('worker:app-v606', worker.includes("'./app-v208.js?v=606-work13-whit-timing'"));
check('worker:timing-js', worker.includes("'./whit-silence-timing-v606.js?v=606-work13-whit-timing'"));
check('worker:timing-contract-validates', worker.includes('work13-whit-timing-contract-missing'));
check('worker:spread-v605-preserved', worker.includes("'./cosmic-spread-reading-v605.js?v=605-work13-spread-reading'"));
check('worker:daily-v604-preserved', worker.includes("'./cosmic-daily-reading-v604.js?v=604-work13-daily-reading'"));
check('worker:resonance-v603-preserved', worker.includes("'./cosmos-reality-resonance-v603.js?v=603-work13-resonance'"));
check('worker:context-v602-preserved', worker.includes("'./cosmos-context-memory-v602.js?v=602-work13-context'"));
check('worker:work12-validates', worker.includes('work12-final-continuity-contract-missing'));
check('worker:timing-message', worker.includes("type:'DIVINA_WORK13_WHIT_TIMING_ACTIVE'"));
check('worker:timing-version-message', worker.includes('whitTimingVersion:606'));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V606',
  work:'WORK13',
  macroStage:'6-of-10 / Whit Viva — Silencio, Utilidade e Timing',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  protectedWhitFilesChecked:Object.keys(protectedWhitFiles).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['whit-silence-timing-v606.js'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
