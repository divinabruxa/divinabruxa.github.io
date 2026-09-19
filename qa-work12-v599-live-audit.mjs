/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · AUDITORIA VIVA V599 */
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
const final=read('work12-final-continuity-v598.js');
const styles=read('work12-final-continuity-v598.css');
const intelligence=read('experience-intelligence-v597.js');

for(const file of [
  'app-v208.js','index.html','sw.js','work12-final-continuity-v598.js','work12-final-continuity-v598.css',
  'experience-intelligence-v597.js','experience-intelligence-v597.css','reality-chambers-v596.js',
  'reality-chambers-v596.css','reading-ritual-core-v595.js','reading-ritual-core-v595.css',
  'daily-world-v509.js','whit-living-presence-v594.js','orbital-menu-v502.js','orbital-menu-v502.css',
  'navigation.js','work12-foundation-v589.js','page-loader-v1.js','living-universe-core-v524.js',
  'supreme-orb-core-v501.js','orb-engine-v208.js','orb-persistent-journey-v565.js',
  'whit-orb-soul-bridge-v581.js','qa-work12-v598-final-runtime.mjs'
]) check(`file:${file}`,exists(file),file);

check('release:application-complete',size('app-v208.js')>100000,size('app-v208.js'));
check('release:meta-v599',index.includes('name="divina-fluidity-release" content="V599"'));
check('release:work12-v599',index.includes('name="divina-work12" content="V599"'));
check('release:live-audit-v599',index.includes('name="divina-live-audit" content="V599"'));
check('release:macro-ten',index.includes('data-macroetapa="work12-10-auditoria-viva"'));
check('release:law',index.includes('data-law="one-orb-one-universe-one-physics-one-presence"'));
check('release:app-query',index.includes('app-v208.js?v=598-work12-final'));
check('release:style-query',index.includes('work12-final-continuity-v598.css?v=599-live-audit'));
check('release:worker-query',index.includes("register('./sw.js?v=599'"));
check('release:inline-bootstrap',index.includes("__divinaSWBootstrap='v599-work12-inline'"));
check('release:inline-ready',index.includes("work12Boot='ready-v599'"));
check('release:inline-recovery',index.includes("work12Boot='released-v599'"));
check('release:inline-recovery-source',index.includes("source:'work12-live-audit-v599'"));
check('release:app-bootstrap',app.includes("__divinaSWBootstrap = 'v598-work12-app'"));
check('release:worker-version',worker.includes('const VERSION = 599;'));
check('release:macro-public',app.includes('window.divinaWork12Macro10V598'));
check('release:macro-alias',app.includes('window.divinaFluidezSupremaV598 = window.divinaWork12Macro10V598'));
check('release:macro-dataset',app.includes("work12Macro = '10-fluidez-suprema-final'"));
check('release:all-ten-macros',[1,2,3,4,5,6,7,8,9,10].every(stage=>app.includes(`divinaWork12Macro${stage}V${588+stage}`)));

check('wiring:final-import',app.includes("work12-final-continuity-v598.js?v=598-work12-final"));
check('wiring:final-created-once',occurrences(app,/createWork12FinalContinuityV598\(/g)===1,occurrences(app,/createWork12FinalContinuityV598\(/g));
check('wiring:final-assigned-to-orbe',app.includes('window.orbe.finalContinuity = finalContinuity'));
check('wiring:final-fluidez-alias',app.includes('window.orbe.fluidezSuprema = finalContinuity'));
check('wiring:orb-core',app.includes('orbCore:supremeOrb'));
check('wiring:journey',app.includes('journey:orbIOSJourney'));
check('wiring:intelligence',app.includes('intelligence:experienceIntelligence'));
check('wiring:menu-resolver',app.includes('menuResolver:() => globalThis.divinaMenuV502'));
check('wiring:same-gesture-intent',app.includes("finalContinuity?.onCanonicalOrbIntent?.('touch')"));
check('wiring:double-tap-preserved',app.includes("source:'home-orb-double-tap'"));
check('wiring:one-navigation',occurrences(app,/createNavigation\(/g)===1);
check('wiring:one-orb-core',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-renderer',occurrences(app,/new RealityOrbEngine\(/g)===1);
check('wiring:one-journey',occurrences(app,/createOrbPersistentJourneyV565\(/g)===1);
check('wiring:intelligence-preserved',app.includes("experience-intelligence-v597.js?v=597-work12-intelligence"));
check('wiring:chambers-preserved',app.includes("reality-chambers-v596.js?v=596-work12-chambers"));
check('wiring:ritual-preserved',app.includes("reading-ritual-core-v595.js?v=595-work12-ritual"));
check('wiring:menu-preserved',app.includes("orbital-menu-v502.js?v=593-work12-menu"));
check('wiring:navigation-preserved',app.includes("navigation.js?v=592-work12-navigation"));

const imports=[
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
for(const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('entity:one-id',occurrences(index,/id="orb"/g)===1,occurrences(index,/id="orb"/g));
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1,occurrences(index,/id="orbCanvas"/g));
check('entity:canonical-selector',final.includes("querySelector?.('#orb')"));
check('entity:canonical-audit',final.includes("querySelectorAll?.('#orb')"));
check('entity:canvas-audit',final.includes("querySelectorAll?.('#orbCanvas')"));
check('entity:no-new-canvas',!/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(final));
check('entity:no-new-renderer',!/new\s+(?:RealityOrbEngine|WebGLRenderer|Worker)\s*\(/.test(final));
check('entity:no-clone',!/cloneNode\s*\(|cloneOrb\s*\(/.test(final));

check('constitution:contract',final.includes('FINAL_CONTINUITY_CONTRACT_V598'));
check('constitution:macro-ten',final.includes("macroStage:'10-of-10'"));
check('constitution:one-organism',final.includes("law:'one-orb-one-universe-one-physics-one-presence'"));
check('constitution:coordinate-model',final.includes("screenModel:'continuous-universe-coordinates'"));
check('constitution:home-only',final.includes("home:'universe-and-canonical-orb-only'"));
for(const beat of ['touch','response','silence','travel','arrival'])check(`constitution:beat-${beat}`,final.includes(`'${beat}'`));
check('constitution:horizontal',final.includes("horizontal:'travel-between-realities'"));
check('constitution:vertical',final.includes("vertical:'immersion'"));
check('constitution:depth',final.includes("depth:'discovery'"));
check('constitution:single-tap-intentions',final.includes("homeSingleTap:'call-intentions'"));
check('constitution:double-tap-tarot',final.includes("homeDoubleTap:'tarot-free'"));
check('constitution:two-intentions-max',final.includes('maximumVisibleIntentions:2'));
check('constitution:movement-first',final.includes('movementBeforeMagic:true'));
check('constitution:destinations-preserved',final.includes('legacyDestinationsPreserved:true'));
check('constitution:dock-preserved-silent',final.includes('legacyDockPreservedButSilent:true'));
check('constitution:iphone',final.includes('iphoneFirst:true'));

check('touch:uses-existing-outcome',final.includes('onCanonicalOrbIntent(source'));
check('touch:protects-double-window',final.includes('const HOME_TAP_DELAY = 470;'));
check('touch:one-deferred-timer',final.includes('deferredTimersMaximum:1'));
check('touch:double-cancel',final.includes("cancelHomeTap('double-tap')"));
check('touch:movement-cancel',final.includes("cancelHomeTap('movement')"));
check('touch:route-gated',final.includes("this.route === 'home'"));
check('touch:menu-ready-gated',final.includes('this.pendingMenuReady'));
check('touch:keyboard-accessible',final.includes('onOrbKeyDown(event)'));
check('touch:existing-menu-open',final.includes('const opening = menu.open()'));
check('touch:existing-orb-pulse',final.includes("this.orbCore?.pulse?.('work12-final-call'"));
check('touch:no-legacy-menu-click',!final.includes("querySelector?.('#menuBtn')")&&!final.includes('.click()'));

check('physics:no-raf',!/requestAnimationFrame\s*\(/.test(final));
check('physics:no-interval',!/setInterval\s*\(/.test(final));
check('physics:no-mutation-observer',!/new MutationObserver\s*\(/.test(final));
check('physics:no-intersection-observer',!/new IntersectionObserver\s*\(/.test(final));
check('physics:no-resize-observer',!/new ResizeObserver\s*\(/.test(final));
check('privacy:no-network',!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(final));
check('privacy:no-storage',!/localStorage|sessionStorage|indexedDB/.test(final));
check('privacy:no-form-read',!/\.value\b|getAttribute\s*\(\s*['"]value/.test(final));
check('privacy:no-content-read',!/innerHTML|innerText|textContent/.test(final));
check('privacy:no-model',final.includes('modelCalls:0'));
check('privacy:no-api',final.includes('apiCalls:0'));
check('privacy:no-private',final.includes('privateContentReads:0'));

check('whit:canonical-residence',final.includes("whitResidence:'canonical-orb'"));
check('whit:no-auto-speech',final.includes('automaticWhitSpeech:false'));
check('whit:silence-presence',final.includes('silenceIsPresence:true'));
check('whit:no-speaking-method',!/\.speak\?\.|\.whisper\?\.|\.offer\?\./.test(final));
check('whit:intelligence-still-silent',intelligence.includes('automaticWhitSpeech:false'));

check('style:hides-brand',styles.includes('body .app-header .brand'));
check('style:hides-legacy-dock',styles.includes('body .magic-dock'));
check('style:home-hides-header',styles.includes('body[data-screen="home"] .app-header'));
check('style:initial-home-route-fallback',styles.includes('[data-work12-final-route="home"] body .app-header'));
check('style:initial-home-excludes-reality-sopro',styles.includes(':not([data-work12-final-route="home"]) body:not([data-screen="home"])'));
check('style:legacy-label-visually-replaced',styles.includes('#menuBtn.menu-button span::after')&&styles.includes('content:"SOPRO"'));
check('style:open-label-is-silence',styles.includes('#menuBtn.menu-button.is-open span::after')&&styles.includes('content:"SILÊNCIO"'));
check('style:home-orb-touch',styles.includes('body[data-screen="home"] #orb'));
check('style:reality-sopro',styles.includes('body:not([data-screen="home"]) #menuBtn.menu-button'));
check('style:sopro-no-lines',styles.includes('#menuBtn.menu-button i'));
check('style:world-mark-silent',styles.includes('.v560-world-mark'));
check('style:menu-heading-silent',styles.includes('.db502-menu__heading'));
check('style:menu-hint-silent',styles.includes('.db502-menu__hint'));
check('style:tarot-crown-silent',styles.includes('.tl517__header'));
check('style:tarot-tabs-silent',styles.includes('.tc528'));
check('style:travel-silences-sopro',styles.includes('[data-work12-state="TRAVEL"] #menuBtn'));
check('style:no-new-animation',!/@keyframes\b/.test(styles)&&!/\banimation\s*:/.test(styles));
check('style:no-heavy-backdrop',!/(?<!none)!?\bbackdrop-filter\s*:(?!none)/.test(styles));
check('style:iphone',styles.includes('@media(max-width:430px)'));
check('style:reduced-motion',styles.includes('@media(prefers-reduced-motion:reduce)'));

check('worker:cache-v599',worker.includes('divina-bruxa-work12-v599-live-audit'));
check('worker:twenty-six-assets',occurrences(worker,/^  '\.\//gm)===26,occurrences(worker,/^  '\.\//gm));
check('worker:app-core',worker.includes("'./app-v208.js?v=598-work12-final'"));
check('worker:final-core',worker.includes("'./work12-final-continuity-v598.js?v=598-work12-final'"));
check('worker:final-styles',worker.includes("'./work12-final-continuity-v598.css?v=599-live-audit'"));
check('worker:validates-final',worker.includes('work12-final-continuity-contract-missing'));
check('worker:validates-final-style',worker.includes('work12-final-continuity-styles-missing'));
check('worker:final-active',worker.includes('DIVINA_WORK12_FINAL_ACTIVE'));
check('worker:intelligence-preserved',worker.includes('DIVINA_WORK12_INTELLIGENCE_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache',worker.includes('event.respondWith(fetch(request))'));

const protectedHashes=Object.freeze({
  'app-v208.js':'47bde00655df05dcc4c7260a444de975fa16098dfeca19ed54f1eef3a5b711cd',
  'work12-final-continuity-v598.js':'e6be06c6fb686ffd4d3e4e143ae6c59da58c53e1d5f1912aa738ad5f820eb745',
  'experience-intelligence-v597.js':'72d089ea87590d6051692e4e8ceec36831975057397c78022bf7d8d44915d395',
  'experience-intelligence-v597.css':'6ab3292e5e801f98749181c9947312d30b975b1e34d79c9b4172223fdb88eed3',
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
  'qa-work12-v597-intelligence-runtime.mjs':'94244487ad50cb3598e7f6e73408a3907683cd6c74e8878d0ac207bbc2a6f7ab'
});
for(const [file,expected] of Object.entries(protectedHashes)){
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v599-live-audit`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:seventeen-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:horizontal-travel',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('home','tarot',599);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V599',work:'WORK12',macroStage:'10-of-10 / Auditoria Viva',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  applicationBytes:size('app-v208.js'),
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
