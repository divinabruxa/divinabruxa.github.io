/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · MACROETAPA 9 V597 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const size=file=>exists(file)?fs.statSync(path.join(root,file)).size:0;
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences=(source,pattern)=>[...source.matchAll(pattern)].length;
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});

const app=read('app-v208.js');
const index=read('index.html');
const worker=read('sw.js');
const intelligence=read('experience-intelligence-v597.js');
const styles=read('experience-intelligence-v597.css');

for(const file of [
  'app-v208.js','index.html','sw.js','experience-intelligence-v597.js','experience-intelligence-v597.css',
  'reality-chambers-v596.js','reality-chambers-v596.css','reading-ritual-core-v595.js',
  'reading-ritual-core-v595.css','daily-world-v509.js','whit-living-presence-v594.js',
  'orbital-menu-v502.js','orbital-menu-v502.css','navigation.js','work12-foundation-v589.js',
  'page-loader-v1.js','living-universe-core-v524.js','supreme-orb-core-v501.js',
  'orb-engine-v208.js','orb-persistent-journey-v565.js','whit-orb-soul-bridge-v581.js',
  'qa-work12-v596-chambers-runtime.mjs'
]) check(`file:${file}`,exists(file),file);

check('repair:application-restored',size('app-v208.js')>100000,size('app-v208.js'));
check('repair:v596-runtime-restored',size('qa-work12-v596-chambers-runtime.mjs')>15000,size('qa-work12-v596-chambers-runtime.mjs'));
check('release:meta-v597',index.includes('name="divina-fluidity-release" content="V597"'));
check('release:work12-v597',index.includes('name="divina-work12" content="V597"'));
check('release:macro-nine',index.includes('data-macroetapa="work12-9-inteligencia-da-experiencia"'));
check('release:law',index.includes('data-law="one-orb-one-universe-one-physics-one-presence"'));
check('release:app-query',index.includes('app-v208.js?v=597-work12-intelligence'));
check('release:style-query',index.includes('experience-intelligence-v597.css?v=597-work12-intelligence'));
check('release:worker-query',index.includes("register('./sw.js?v=597'"));
check('release:inline-bootstrap',index.includes("__divinaSWBootstrap='v597-work12-inline'"));
check('release:inline-ready',index.includes("work12Boot='ready-v597'"));
check('release:inline-recovery',index.includes("work12Boot='released-v597'"));
check('release:app-bootstrap',app.includes("__divinaSWBootstrap = 'v597-work12-app'"));
check('release:worker-version',worker.includes('const VERSION = 597;'));
check('release:macro-public',app.includes('window.divinaWork12Macro9V597'));
check('release:macro-dataset',app.includes("work12Macro = '9-inteligencia-da-experiencia'"));
check('release:legacy-macros-preserved',[
  'divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591',
  'divinaWork12Macro4V592','divinaWork12Macro5V593','divinaWork12Macro6V594',
  'divinaWork12Macro7V595','divinaWork12Macro8V596'
].every(marker=>app.includes(marker)));

check('wiring:intelligence-import',app.includes("experience-intelligence-v597.js?v=597-work12-intelligence"));
check('wiring:intelligence-created-once',occurrences(app,/createExperienceIntelligenceV597\(/g)===1,occurrences(app,/createExperienceIntelligenceV597\(/g));
for(const needle of ['universe:livingUniverse','foundation:work12Foundation','orbCore:supremeOrb','soul:whitOrbSoul','presence:whitLivingPresence','ritual:readingRitual','chambers:realityChambers','performance:skinPerformanceCore']){
  check(`wiring:${needle}`,app.includes(needle));
}
check('wiring:one-navigation',occurrences(app,/createNavigation\(/g)===1);
check('wiring:one-orb-core',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-renderer',occurrences(app,/new RealityOrbEngine\(/g)===1);
check('wiring:chambers-preserved',app.includes("reality-chambers-v596.js?v=596-work12-chambers"));
check('wiring:ritual-preserved',app.includes("reading-ritual-core-v595.js?v=595-work12-ritual"));
check('wiring:menu-preserved',app.includes("orbital-menu-v502.js?v=593-work12-menu"));
check('wiring:navigation-preserved',app.includes("navigation.js?v=592-work12-navigation"));

const imports=[
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
for(const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('entity:one-id',occurrences(index,/id="orb"/g)===1);
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1);
check('entity:no-new-canvas',!/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(intelligence));
check('entity:no-new-renderer',!/new\s+(?:RealityOrbEngine|WebGLRenderer|Worker)\s*\(/.test(intelligence));
check('entity:no-clone',!/cloneNode\s*\(|cloneOrb\s*\(/.test(intelligence));
check('entity:canonical-orb-audit',intelligence.includes("querySelectorAll?.('#orb')"));
check('entity:canonical-canvas-audit',intelligence.includes("querySelectorAll?.('#orbCanvas')"));

for(const state of ['still','moving','settling','listening','focus','resting']){
  check(`intelligence:state-${state}`,intelligence.includes(`'${state}'`));
}
for(const route of ['home','tarot','daily','spreads','library','school','journal','consultations','store']){
  check(`intelligence:route-${route}`,new RegExp(`\\b${route}:Object\\.freeze`).test(intelligence));
}
for(const input of ['route','movement-state','menu-state','ritual-phase','chamber-state','explicit-depth','focus-class','visibility','visual-quality']){
  check(`intelligence:input-${input}`,intelligence.includes(`'${input}'`));
}
for(const forbidden of ['form-values','journal-body','private-question','card-history','emotion-inference','microphone','camera','location','identity-profile']){
  check(`intelligence:forbidden-${forbidden}`,intelligence.includes(`'${forbidden}'`));
}
check('intelligence:deterministic-local',intelligence.includes("model:'local-deterministic-context-coordinator'"));
check('intelligence:movement-first',intelligence.includes("this.setBudget('essential', 'movement'"));
check('intelligence:existing-budget-enter',intelligence.includes("this.universe?.enterTravelBudget?.('experience-intelligence-v597'"));
check('intelligence:existing-budget-leave',intelligence.includes("this.universe?.leaveTravelBudget?.('experience-intelligence-v597'"));
check('intelligence:visibility-pauses',intelligence.includes("this.universe.pause('experience-v597-hidden')"));
check('intelligence:visibility-resumes',intelligence.includes("this.universe?.start?.('experience-v597-hidden')"));
check('intelligence:pagehide-explicit',intelligence.includes("return this.suspend('pagehide')"));
check('intelligence:one-timer',intelligence.includes('oneDeferredTimer:true')&&!/setInterval\s*\(/.test(intelligence));
check('intelligence:no-raf',!/requestAnimationFrame\s*\(/.test(intelligence));
check('intelligence:no-observer',!/new MutationObserver\s*\(/.test(intelligence));
check('intelligence:no-network',!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(intelligence));
check('intelligence:no-storage',!/localStorage|sessionStorage|indexedDB/.test(intelligence));
check('intelligence:no-value-read',!/\.value\b|getAttribute\s*\(\s*['"]value/.test(intelligence));
check('intelligence:no-text-read',!/textContent|innerText|innerHTML/.test(intelligence));
check('intelligence:no-model',intelligence.includes('modelCalls:0'));
check('intelligence:no-api',intelligence.includes('apiCalls:0'));
check('intelligence:no-private-read',intelligence.includes('privateContentReads:0'));
check('intelligence:no-form-read',intelligence.includes('formValueReads:0'));
check('intelligence:iphone-first',intelligence.includes('iphoneFirst:true'));

check('whit:canonical-residence',intelligence.includes("whitResidence:'canonical-orb'"));
check('whit:no-auto-speech',intelligence.includes('automaticWhitSpeech:false'));
check('whit:silence-decision',intelligence.includes('silenceIsDecision:true'));
check('whit:silence-method',intelligence.includes('this.presence?.silence?.'));
check('whit:soul-existing',intelligence.includes('this.soul?.setState?.'));
check('whit:no-speech-method',!/\.speak\?\.|\.whisper\?\.|\.offer\?\./.test(intelligence));
check('whit:no-emotion-inference',intelligence.includes('emotionInference:false'));

check('style:essential-budget',styles.includes('[data-experience-budget="essential"]'));
check('style:focus-state',styles.includes('[data-experience-state="focus"]'));
check('style:sleeping-budget',styles.includes('[data-experience-budget="sleeping"]'));
check('style:pauses-secondary',styles.includes('animation-play-state:paused!important'));
check('style:orb-never-targeted',!styles.includes('#orb')&&!styles.includes('#orbCanvas'));
check('style:universe-canvas-never-targeted',!styles.includes('#livingUniverse'));
check('style:no-infinite-animation',!/\banimation\s*:[^;]*\binfinite\b/.test(styles));
check('style:no-backdrop-filter',!/backdrop-filter\s*:/.test(styles));
check('style:iphone',styles.includes('@media(max-width:430px)'));
check('style:reduced-motion',styles.includes('@media(prefers-reduced-motion:reduce)'));

check('worker:cache-v597',worker.includes('divina-bruxa-work12-v597-experience-intelligence'));
check('worker:twenty-four-assets',occurrences(worker,/^  '\.\//gm)===24,occurrences(worker,/^  '\.\//gm));
check('worker:intelligence-core',worker.includes("'./experience-intelligence-v597.js?v=597-work12-intelligence'"));
check('worker:intelligence-styles',worker.includes("'./experience-intelligence-v597.css?v=597-work12-intelligence'"));
check('worker:validates-intelligence',worker.includes('work12-experience-intelligence-contract-missing'));
check('worker:intelligence-active',worker.includes('DIVINA_WORK12_INTELLIGENCE_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));

const protectedHashes=Object.freeze({
  'reality-chambers-v596.js':'1ae6b54a8f53d5e8e89230e042c6cf24bc6c662928e118afbe6be18dc2869fad',
  'reality-chambers-v596.css':'bfc65e0566c7ea5c4acb42aac42245b4fa5079cc25ce124067ce99dfaad25033',
  'school-world-v306.js':'b29fd7f86c1859432f06e80ab7234a76628c6b35f09eec316cd972fe6ba5c156',
  'journal-world-v317.js':'20b58bd2b928dbf68de42bc730bf32b3abdf01afc9734c3351a381924313809e',
  'reading-ritual-core-v595.js':'f864b08e01074a820a58ba6781eb6493075b9bba42d78d8156c4d8bd95e3efe3',
  'whit-living-presence-v594.js':'8572a154f2ec4a35089de489b5dc4472d2cebc17c219b991d290ba8ab1833fc0',
  'orbital-menu-v502.js':'f9adec56f450032c0b97010be116f7fadaa58610ff880cb06a153c2a49eb2344',
  'navigation.js':'aed753f83db6d3a0fd9ddecbcc2e20389536fae8c214b7b1fdbccf55a8f1551b',
  'work12-foundation-v589.js':'09efb3e189fd933569c55b5ceaaabd60fb218511f8d0dc2f2845d0742e98360a',
  'living-universe-core-v524.js':'0f9bf832a9cc673596d78d023f41b0091f6de0a3467def5033ca1bf10155fdd9',
  'supreme-orb-core-v501.js':'8e815568c54d368b5b2b4643a27466187f3722018d264c7ed9a3d8fe2cc9fcb3',
  'orb-engine-v208.js':'f7939f0219d34f086043836acba7e5b0b77b809e58d31e6b8331f0248b53532c',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'whit-orb-soul-bridge-v581.js':'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866',
  'qa-work12-v596-chambers-runtime.mjs':'3084d8e45d7ecd4f95663189af796ce01c0fb7a5b67bd96e2aca4b6f4ff7e093'
});
for(const [file,expected] of Object.entries(protectedHashes)){
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v597-intelligence`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:seventeen-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:horizontal-travel',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('home','tarot',597);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V597',work:'WORK12',macroStage:'9-of-10 / Inteligência da Experiência',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  recovery:{applicationRestored:size('app-v208.js'),v596RuntimeRestored:size('qa-work12-v596-chambers-runtime.mjs')},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
