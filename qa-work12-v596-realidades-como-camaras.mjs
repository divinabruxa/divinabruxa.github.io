/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · MACROETAPA 8 V596 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences=(source,pattern)=>[...source.matchAll(pattern)].length;
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});

const app=read('app-v208.js');
const index=read('index.html');
const worker=read('sw.js');
const chambers=read('reality-chambers-v596.js');
const styles=read('reality-chambers-v596.css');
const schoolWorld=read('school-world-v306.js');
const journalWorld=read('journal-world-v317.js');
const loader=read('page-loader-v1.js');

for(const file of [
  'app-v208.js','index.html','sw.js','reality-chambers-v596.js','reality-chambers-v596.css',
  'school-world-v306.js','journal-world-v317.js','page-loader-v1.js',
  'reading-ritual-core-v595.js','reading-ritual-core-v595.css','daily-world-v509.js',
  'whit-living-presence-v594.js','orbital-menu-v502.js','orbital-menu-v502.css',
  'navigation.js','work12-foundation-v589.js','living-universe-core-v524.js',
  'supreme-orb-core-v501.js','orb-engine-v208.js','orb-persistent-journey-v565.js',
  'whit-orb-soul-bridge-v581.js','reality-intention-language-v585.js',
  'magical-bubble-system-v586.js','school-engine.js','journal-engine.js',
  'consultation-engine.js','store-engine.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v596',/name="divina-fluidity-release" content="V596"/.test(index));
check('release:work12-v596',/name="divina-work12" content="V596"/.test(index));
check('release:macro-eight',/data-macroetapa="work12-8-realidades-como-camaras"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=596-work12-chambers/.test(index));
check('release:style-query',/reality-chambers-v596\.css\?v=596-work12-chambers/.test(index));
check('release:ritual-style-preserved',/reading-ritual-core-v595\.css\?v=595-work12-ritual/.test(index));
check('release:worker-query',/sw\.js\?v=596/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v596-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v596'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v596-work12-app'/.test(app));
check('release:worker-version',/const VERSION = 596;/.test(worker));
check('release:chambers-version',/const VERSION = 596;/.test(chambers));
check('release:macro-public',/window\.divinaWork12Macro8V596/.test(app));
check('release:macro-dataset',/work12Macro = '8-realidades-como-camaras'/.test(app));
check('release:legacy-macros-preserved',[
  'divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591',
  'divinaWork12Macro4V592','divinaWork12Macro5V593','divinaWork12Macro6V594',
  'divinaWork12Macro7V595'
].every(marker=>app.includes(marker)));

check('wiring:chambers-import',app.includes("reality-chambers-v596.js?v=596-work12-chambers"));
check('wiring:chambers-created-once',occurrences(app,/createRealityChambersV596\(/g)===1,occurrences(app,/createRealityChambersV596\(/g));
check('wiring:orb-reused',app.includes('orbCore:supremeOrb'));
check('wiring:presence-reused',app.includes('presence:whitLivingPresence'));
check('wiring:soul-reused',app.includes('soul:whitOrbSoul'));
check('wiring:universe-reused',app.includes('universe:livingUniverse'));
check('wiring:foundation-reused',app.includes('foundation:work12Foundation'));
check('wiring:public-orb-chambers',app.includes('realityChambers,'));
check('wiring:school-cache-bust',occurrences(loader,/school-world-v306\.js\?v=596-work12-chambers/g)===2);
check('wiring:journal-cache-bust',occurrences(loader,/journal-world-v317\.js\?v=596-work12-chambers/g)===2);
check('wiring:daily-v595-preserved',occurrences(loader,/daily-world-v509\.js\?v=595-work12-ritual/g)===2);
check('wiring:menu-v593-preserved',app.includes("orbital-menu-v502.js?v=593-work12-menu"));
check('wiring:navigation-v592-preserved',app.includes("./navigation.js?v=592-work12-navigation"));
check('wiring:universe-v590-preserved',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:orb-v591-preserved',app.includes("./supreme-orb-core-v501.js?v=591-work12-orb"));
check('wiring:ritual-v595-preserved',app.includes("./reading-ritual-core-v595.js?v=595-work12-ritual"));
check('wiring:one-navigation',occurrences(app,/createNavigation\(/g)===1);
check('wiring:one-core',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-renderer',occurrences(app,/new RealityOrbEngine\(/g)===1);

const imports=[
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
for(const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('entity:one-id',occurrences(index,/id="orb"/g)===1);
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1);
check('entity:no-chamber-canvas',!/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(chambers));
check('entity:no-second-renderer',!/new\s+(?:RealityOrbEngine|WebGLRenderer|Worker)\s*\(/.test(chambers));
check('entity:same-orb-contract',chambers.includes('samePhysicalOrb:true'));
check('entity:threshold-claim',chambers.includes("querySelector?.(':scope > .db585-intent-threshold [data-v585-orb-host]')"));
check('entity:school-internal-claim-disabled',schoolWorld.includes("document.documentElement.dataset.realityChambers==='v596'"));
check('entity:journal-internal-claim-disabled',journalWorld.includes("document.documentElement.dataset.realityChambers === 'v596'"));
check('entity:no-orb-clone',!/cloneNode\s*\(|cloneOrb\s*\(|createElement\s*\(\s*['"]canvas['"]/.test(chambers));

check('chambers:four-routes',chambers.includes("Object.freeze(['school','journal','consultations','store'])"));
for(const route of ['school','journal','consultations','store']){
  check(`chambers:profile-${route}`,new RegExp(`${route}:Object\\.freeze`).test(chambers));
  check(`chambers:css-${route}`,styles.includes(`#${route}`));
}
for(const state of ['threshold','awakening','present','engaged','travel']){
  check(`chambers:state-${state}`,chambers.includes(`'${state}'`)&&styles.includes(`[data-db596-chamber-state="${state}"]`));
}
check('chambers:explicit-depth-listener',chambers.includes("'divina:reality-depth'"));
check('chambers:depth-before-present',chambers.indexOf("this.setState(route, 'awakening'")<chambers.indexOf("this.setState(route, 'present'"));
check('chambers:one-timer',chambers.includes('oneDeferredTimer:true')&&!/setInterval\s*\(/.test(chambers));
check('chambers:maximum-two-intentions',chambers.includes('maximumVisibleIntentions:2'));
check('chambers:school-two-gates',chambers.includes('data-school-continue')&&chambers.includes('data-db596-school-paths'));
check('chambers:journal-write',chambers.includes("'[data-jwv-write]'"));
check('chambers:journal-mirror',chambers.includes("'[data-jwv-mirror]'"));
check('chambers:consultation-service',chambers.includes("'[data-service]'"));
check('chambers:consultation-tracking',chambers.includes('[data-open-tracking]'));
check('chambers:store-intention',chambers.includes("'[data-collection]'"));
check('chambers:store-recollect',chambers.includes('data-db596-store-return'));
check('chambers:school-engine-preserved',chambers.includes("school:'V555'"));
check('chambers:journal-engine-preserved',chambers.includes("journal:'V556'"));
check('chambers:consultations-engine-preserved',chambers.includes("consultations:'V558'"));
check('chambers:store-engine-preserved',chambers.includes("store:'V543'"));

check('language:old-direct-headings-hidden',styles.includes(':not(.db585-intent-threshold):not(#schoolApp)'));
check('language:school-dashboard-first',styles.includes('#schoolApp>.school-dashboard'));
check('language:school-map-on-call',styles.includes('[data-db596-chamber-mode="map"]'));
check('language:school-active-stage-only',styles.includes('.school-stage:not(:has([data-school-module].active))'));
check('language:journal-two-intentions',styles.includes('.jwv317__passages>button:nth-of-type(n+3)'));
check('language:journal-write-mode',styles.includes('[data-db596-chamber-mode="write"]'));
check('language:journal-mirror-mode',styles.includes('[data-db596-chamber-mode="mirror"]'));
check('language:consultations-no-details-before-choice',styles.includes('.consultation-v147-service>')&&styles.includes('.consultation-ideal'));
check('language:consultations-horizontal',styles.includes('#consultations .consultation-v147-services'));
check('language:store-intentions-first',styles.includes('#store[data-db596-chamber-state="present"] .store-v148-shell>#amazonStoreCoreV543'));
check('language:store-catalog-after-choice',styles.includes('#store[data-db596-chamber-state="engaged"] .store-v148-shell>'));
check('language:store-collections-not-duplicated',styles.includes('#store .store-v148-collections{display:none!important}'));
check('language:horizontal-snap',occurrences(styles,/scroll-snap-type:x mandatory/g)>=4,occurrences(styles,/scroll-snap-type:x mandatory/g));
check('language:finite-birth',styles.includes('db596-chamber-born 420ms'));
check('language:no-infinite-animation',!/db596-[\w-]+[^;{]*\binfinite\b/.test(styles));
check('language:iphone-compact',styles.includes('@media(max-width:430px)'));
check('language:iphone-one-intention-peek',styles.includes('flex-basis:86%!important'));
check('language:two-intentions-wide',styles.includes('flex-basis:calc(50% - 5px)!important'));
check('language:landscape',styles.includes('@media(orientation:landscape) and (max-height:520px)'));
check('language:reduced-motion',styles.includes('@media(prefers-reduced-motion:reduce)'));
check('language:forced-colors',styles.includes('@media(forced-colors:active)'));

check('whit:no-auto-speech',chambers.includes('automaticWhitSpeech:false'));
check('whit:silence-only',chambers.includes('this.presence?.silence?.')&&!/whit:whisper|speak\s*\(|message\s*\(/.test(chambers));
check('whit:soul-existing',chambers.includes('this.soul?.setState?.'));
check('privacy:no-form-read',!/(?:querySelector|closest)\?\.\(\s*['"][^'"]*(?:input|textarea|contenteditable)/i.test(chambers));
check('privacy:no-storage',!/localStorage|sessionStorage|indexedDB/.test(chambers));
check('privacy:no-fetch',!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(chambers));
check('privacy:no-private-content',chambers.includes('privateContentReads:0'));
check('performance:no-interval',!/setInterval\s*\(/.test(chambers));
check('performance:no-raf',!/requestAnimationFrame\s*\(/.test(chambers));
check('performance:no-observer',!/new MutationObserver\s*\(/.test(chambers));
check('performance:universe-quiets',chambers.includes('this.universe.pause()')&&chambers.includes('this.universe?.start?.()'));
check('performance:travel-quiets',chambers.includes("this.clearSequence('travel')")&&chambers.includes('this.quietEffects()'));
check('performance:css-pauses',styles.includes('animation-play-state:paused!important'));
check('performance:no-backdrop-filter',!/backdrop-filter\s*:/.test(styles));
check('performance:iphone-first',chambers.includes('iphoneFirst:true'));

check('worker:cache-v596',worker.includes('divina-bruxa-work12-v596-reality-chambers'));
check('worker:twenty-two-core-assets',occurrences(worker,/^  '\.\//gm)===22,occurrences(worker,/^  '\.\//gm));
check('worker:chambers-core',worker.includes("'./reality-chambers-v596.js?v=596-work12-chambers'"));
check('worker:chambers-styles',worker.includes("'./reality-chambers-v596.css?v=596-work12-chambers'"));
check('worker:school-core',worker.includes("'./school-world-v306.js?v=596-work12-chambers'"));
check('worker:journal-core',worker.includes("'./journal-world-v317.js?v=596-work12-chambers'"));
check('worker:validates-chambers',worker.includes('work12-reality-chambers-contract-missing'));
check('worker:chambers-active',worker.includes('DIVINA_WORK12_CHAMBERS_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));

const protectedHashes=Object.freeze({
  'reading-ritual-core-v595.js':'f864b08e01074a820a58ba6781eb6493075b9bba42d78d8156c4d8bd95e3efe3',
  'reading-ritual-core-v595.css':'dd5407e0ab72e3246ff65aadd8de0ed796a5548e2021c383f9962cdb1eec2037',
  'daily-world-v509.js':'0bfd355911d79829f14cce578ceb10b1b9809018425a81bbf6a99a2982ab083a',
  'whit-living-presence-v594.js':'8572a154f2ec4a35089de489b5dc4472d2cebc17c219b991d290ba8ab1833fc0',
  'orbital-menu-v502.js':'f9adec56f450032c0b97010be116f7fadaa58610ff880cb06a153c2a49eb2344',
  'orbital-menu-v502.css':'a6d2a33dbcb490f7d32ff7dc6a991b088a76a4a84a9211d335574acaca602c02',
  'navigation.js':'aed753f83db6d3a0fd9ddecbcc2e20389536fae8c214b7b1fdbccf55a8f1551b',
  'work12-foundation-v589.js':'09efb3e189fd933569c55b5ceaaabd60fb218511f8d0dc2f2845d0742e98360a',
  'living-universe-core-v524.js':'0f9bf832a9cc673596d78d023f41b0091f6de0a3467def5033ca1bf10155fdd9',
  'supreme-orb-core-v501.js':'8e815568c54d368b5b2b4643a27466187f3722018d264c7ed9a3d8fe2cc9fcb3',
  'orb-engine-v208.js':'f7939f0219d34f086043836acba7e5b0b77b809e58d31e6b8331f0248b53532c',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'universe-coordinate-law-v583.js':'c28116ebdcad8274bfaeec1d816b1d150437778839b5f4e872e6dd81e4a6fb00',
  'whit-orb-soul-bridge-v581.js':'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866',
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'school-engine.js':'00d4846ec3fa8ba97482ea1e361cb946a820ff279669f94768569d400af68da0',
  'school-policy.js':'a3bbd91b2f4537178d729ad80dcef28c39e47575ea40371c8ccdfa956a2183b8',
  'journal-engine.js':'6aecd1a33d78d87c835077360bf23f2839692b1ee4a0ca9b55daa5bbd6bd9bc6',
  'journal-policy.js':'738d9b1bf2dcec2c358a9ed9d68bbeeed63ef103d39df02c49aa0dbabccddfbb',
  'consultation-engine.js':'13fe1c009c986e8a7f108d75873db822641a2cb44eb8c0c218960e8857ec80c9',
  'consultation-policy.js':'7992d614c0a906f994bc06440aadc822524ed11df41322d918c11590d2457030',
  'store-engine.js':'5734261d7f69ede6e6fc828c78f51a9dcf6e92b3fa8e92bb22e9f25a5350fed0',
  'store-policy.js':'fcd6cfec72624c926db02eabeb2ce9e656c5989699b012502a8464026e52cabb',
  'amazon-store-core-v543.js':'f1a13129be2acc0fffa6f1aa402330285baeb106092271ae7afb12113f47defa',
  'account-consultations-world-v319.js':'1f3df28cfa54c1e51159217380eb24f3d5693f5eae385877f36e240ffe064758',
  'media-commerce-world-v320.js':'4abe1537290e2d44f0459da7acd3a5d586961760948fc1988b1e01f26f882bf5'
});
for(const [file,expected] of Object.entries(protectedHashes)){
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v596-chambers`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:all-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:all-horizontal',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('school','journal',596);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const session=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v596-chambers`);
const {CARDS}=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v596-chambers`);
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v596-chambers',auditSeed:'work12-v596'});
const cards=[];
for(let index=0;index<78;index+=1){
  const draw=session.drawNextCard(tarotState,{now:()=>index+2});
  tarotState=draw.state;
  cards.push(draw.cardId);
}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:all-direct',cards.every(id=>CARDS[id]?.orientation==='normal'));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V596',work:'WORK12',macroStage:'8-of-10 / Realidades como Câmaras',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  chambers:ROUTES_FOR_REPORT(),
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;

function ROUTES_FOR_REPORT(){return ['school','journal','consultations','store'];}
