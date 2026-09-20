/* DIVINA BRUXA — WORK13 V610 · QA ESTRUTURAL DA ORQUESTRA FINAL */
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

const required = [
  'index.html','app-v208.js','sw.js','cosmos-final-orchestra-v610.js',
  'cosmos-entry-intention-v610.js','cosmos-entry-intention-v610.css',
  'cosmos-world-presence-v610.js','cosmos-world-presence-v610.css',
  'cosmos-context-memory-v602.js','cosmos-reality-resonance-v603.js','cosmos-reality-resonance-v603.css',
  'cosmic-daily-reading-v604.js','cosmic-daily-reading-v604.css',
  'cosmic-spread-reading-v605.js','cosmic-spread-reading-v605.css','whit-silence-timing-v606.js',
  'living-wisdom-path-v607.js','living-wisdom-path-v607.css',
  'living-commerce-path-v608.js','living-commerce-path-v608.css',
  'living-media-skins-v609.js','living-media-skins-v609.css',
  'runtime-v12.js',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V609-MACROETAPA-9.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip','qa-work13-v610-final-runtime.mjs'
];
required.forEach(file => check(`file:${file}`, exists(file), file));

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const runtime = read('cosmos-final-orchestra-v610.js');
const skinRuntime = read('runtime-v12.js');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenWork12FilesChecked = 0;
for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenWork12FilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedWork13 = Object.freeze({
  'cosmos-context-memory-v602.js':'82aea44135a5c960700d97a249a870d1a6fe759f1224cb81d3b798296dfa0ce1',
  'cosmos-reality-resonance-v603.js':'d16da25d2552b8aa3023cc94fd0caac0911f6302cdbabc3d99b7a9a4dbb79d51',
  'cosmos-reality-resonance-v603.css':'d6166c2802567a28e5575adc5c73c085f6ee8a530a6876e1a0e71e67677f14ad',
  'cosmic-daily-reading-v604.js':'747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c',
  'cosmic-daily-reading-v604.css':'04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5',
  'cosmic-spread-reading-v605.js':'6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b',
  'cosmic-spread-reading-v605.css':'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff',
  'whit-silence-timing-v606.js':'db625f3495efd65109144b780b8ea47b2177a4996ccc7e1fb215b27eff946e2a',
  'living-wisdom-path-v607.js':'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377',
  'living-wisdom-path-v607.css':'765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118',
  'living-commerce-path-v608.js':'de6614a2354e604ea09641a0f002aceb313571787df3dc93446625a0fdf991d3',
  'living-commerce-path-v608.css':'9b6b43aca5630c1f30acab6074505e92b9eb6801081483739a61113f5c38c42f',
  'living-media-skins-v609.js':'bad73908f8410e64098b1207660daa05ebc14713509ea741a21da05630fd2d01',
  'living-media-skins-v609.css':'f408eef7980d3e21f8d7629a34e3e2b5db6ad5e0bc77bf263873480c874b9eee'
});
for (const [file, expected] of Object.entries(protectedWork13)) {
  check(`work13-prior-protected:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedV609Evidence = Object.freeze({
  '00-INSTALE-V609-WORK13-MACROETAPA-9-MUSICA-VIDEOS-SKINS-VIVOS.txt':'e27a604c3ad050e7d99126548eb17ffa5220cbd7878599e67e93767e25f640be',
  'RELATORIO-WORK13-V609-MACROETAPA-9-MUSICA-VIDEOS-SKINS-VIVOS.md':'af00749d6323ccb86797582b4fe8da87bdc10a3104cfad4c1d5fbaa8d8f37bc8',
  'MANIFESTO-WORK13-V609-MACROETAPA-9.json':'3ea62d85129daba4287b5ce2005f3710dcc6cfeb202bec4547834aaa70819536',
  'HASHES-SHA256-WORK13-V609.txt':'1f516365a5aaa7578b3a874ef674b21c687ac3db73585b75bf7891e0aaf0d07c'
});
for (const [file, expected] of Object.entries(protectedV609Evidence)) {
  check(`v609-evidence-protected:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

check('snapshot:v600-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');

check('index:work13-v610', index.includes('name="divina-work13" content="V610"'));
check('index:fluidity-v610', index.includes('name="divina-fluidity-release" content="V610"'));
check('index:macro-ten', index.includes('data-macroetapa="work13-10-orquestra-final-tudo-respira-junto"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v610', index.includes('app-v208.js?v=610-work13-final-presence'));
check('index:worker-v610', index.includes("register('./sw.js?v=610-final-presence'"));
check('index:ready-v610', index.includes("work13Boot='ready-v610'"));
check('index:released-v610', index.includes("work13Boot='released-v610'"));
check('index:viewport-cover', index.includes('viewport-fit=cover'));
check('index:keyboard-resizes', index.includes('interactive-widget=resizes-content'));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
check('index:seventeen-static-worlds', occurrences(index, /<section id="(?:home|tarot|daily|library|school|spreads|ai|journal|store|consultations|subscriptions|videos|music|skins|notifications|login|admin)"/g) === 17);
check('index:one-static-skins', occurrences(index, /<section id="skins"/g) === 1);
check('runtime-v12:skins-engine-preserved', skinRuntime.includes("screen.id = 'skins'") && skinRuntime.includes('skinsApp'));
check('index:no-v610-style', !/cosmos-final-orchestra-v610\.css|divinaCosmosFinalOrchestraV610/.test(index));
for (const id of [
  'divinaLivingMediaSkinsV609','divinaLivingCommercePathV608','divinaLivingWisdomPathV607',
  'divinaCosmicSpreadReadingV605','divinaCosmicDailyReadingV604',
  'divinaCosmosRealityResonanceV603','divinaWork12FinalContinuityV598'
]) check(`index:prior-style:${id}`, occurrences(index, new RegExp(`id="${id}"`, 'g')) === 1);

check('app:v610-import', app.includes("createCosmosFinalOrchestraV610 } from './cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra'"));
check('app:v610-created-once', occurrences(app, /createCosmosFinalOrchestraV610\(\{/g) === 1, occurrences(app, /createCosmosFinalOrchestraV610\(\{/g));
check('app:v610-public', app.includes('window.divinaWork13Macro10V610'));
check('app:v610-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro10V610'));
check('app:v610-on-orbe', app.includes('window.orbe.finalOrchestra = cosmosFinalOrchestra'));
check('app:v610-no-work14', app.includes('work13EndsHere:true') && app.includes('work14:false'));
check('app:v610-layers', app.includes('livingLayers:Object.freeze([602,603,604,605,606,607,608,609])'));
check('app:v610-worlds', app.includes('worldsPreserved:17'));
check('app:v610-final-presence', app.includes('visualChanges:1') && app.includes('newStylesheets:1'));
check('app:v610-no-production', app.includes('productionPublish:false') && app.includes('realBilling:false'));
check('app:v610-worker-handler', app.includes("event.data?.type === 'DIVINA_WORK13_FINAL_ORCHESTRA_ACTIVE'"));
check('app:v610-worker-registration', app.includes("register('./sw.js?v=610-final-presence'"));
check('app:v610-boot', app.includes("work13CosmosVivo:'V610'") && app.includes("work13MacroStage:'10-of-10-final-orchestra'"));
for (const version of [602,603,604,605,606,607,608,609]) check(`app:v${version}-preserved`, app.includes(`window.divinaWork13Macro${version - 600}V${version}`));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('runtime:contract', runtime.includes('COSMOS_FINAL_ORCHESTRA_CONTRACT_V610'));
check('runtime:version', runtime.includes('const VERSION = 610;'));
check('runtime:stage-ten', runtime.includes("macroStage:'10-of-10'"));
check('runtime:closure', runtime.includes("closure:'WORK13-completes-inside-WORK13'"));
check('runtime:law', runtime.includes("law:'one-orb-one-universe-one-presence-one-journey'"));
check('runtime:layers', runtime.includes('livingLayers:Object.freeze([602,603,604,605,606,607,608,609])'));
check('runtime:seventeen-worlds', runtime.includes('expectedWorlds:17'));
check('runtime:iphone-profiles', occurrences(runtime, /id:'iphone-/g) === 8, occurrences(runtime, /id:'iphone-/g));
check('runtime:no-physical-claim', runtime.includes('physicalDeviceClaim:false'));
check('runtime:single-frame', runtime.includes('maximumPendingFrames:1') && runtime.includes('if (this.frameId)'));
check('runtime:single-player', runtime.includes('maximumActivePlayers:1'));
check('runtime:abortable', runtime.includes('signal:this.abort.signal'));
check('runtime:no-dom-write', !/createElement\s*\(|innerHTML\s*=|insertAdjacentHTML|\.append\s*\(|\.prepend\s*\(/.test(runtime));
check('runtime:no-private-form-read', !/FormData|\.elements\.|\.value\b|textContent\s*\.includes/.test(runtime));
check('runtime:no-private-selectors', !/querySelector[^\n]*(?:textarea|input\[name|journal-text|private-question)/i.test(runtime));
check('runtime:no-storage', runtime.includes('storageReads:0') && runtime.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(runtime));
check('runtime:no-network', runtime.includes('networkCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(runtime));
check('runtime:no-canvas', runtime.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(runtime));
check('runtime:no-player', runtime.includes('newPlayers:0') && !/createElement\s*\(\s*['"]iframe['"]/.test(runtime));
check('runtime:no-loop', runtime.includes('permanentAnimationLoops:0') && !/setInterval\s*\(/.test(runtime));
check('runtime:no-timer', runtime.includes('deferredTimers:0') && !/setTimeout\s*\(/.test(runtime));
check('runtime:no-observer', runtime.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(runtime));
check('runtime:no-click-input-listeners', !/listen\([^\n]*['"](?:click|input)['"]/.test(runtime));
check('runtime:no-auto-navigation', runtime.includes('automaticNavigation:false') && !/location\.(?:assign|replace)|location\.href\s*=|\.go\?\.\(/.test(runtime));
check('runtime:no-auto-whit', runtime.includes('automaticWhitSpeech:false') && !/\.whisper\?\.|\.speak\?\.|\.offer\?\./.test(runtime));
check('runtime:no-style', runtime.includes('newStylesheets:0') && !/style\.setProperty|classList\.(?:add|remove|toggle)/.test(runtime));
for (const value of [
  'privateContentReads:0','formValueReads:0','journalBodyReads:0','questionReads:0',
  'cardIdentityReads:0','listeningHistoryReads:0','viewingHistoryReads:0',
  'accountProfileReads:0','purchaseBodyReads:0','searchQueryReads:0'
]) check(`runtime:privacy:${value}`, runtime.includes(value));

check('worker:v610', worker.includes('const VERSION = 610;'));
check('worker:cache-v610', worker.includes('divina-bruxa-work13-v610-final-presence'));
check('worker:app-v610', worker.includes("'./app-v208.js?v=610-work13-final-presence'"));
check('worker:world-presence-v610', worker.includes("'./cosmos-world-presence-v610.js?v=610-work13-final-presence'"));
check('worker:runtime-v610', worker.includes("'./cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra'"));
check('worker:runtime-validates', worker.includes('work13-final-orchestra-contract-missing'));
check('worker:v609-preserved', worker.includes("'./living-media-skins-v609.js?v=609-work13-media-skins'"));
check('worker:message-v610', worker.includes("type:'DIVINA_WORK13_FINAL_ORCHESTRA_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V610',
  work:'WORK13',
  macroStage:'10-of-10 / Orquestra Final',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked,
  protectedPriorWork13FilesChecked:Object.keys(protectedWork13).length,
  protectedV609EvidenceFilesChecked:Object.keys(protectedV609Evidence).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js','cosmos-entry-intention-v610.js','cosmos-entry-intention-v610.css'],
  newRuntimeFiles:['cosmos-world-presence-v610.js'],
  newStylesheets:1,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
