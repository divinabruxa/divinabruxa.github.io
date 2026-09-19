/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · MACROETAPA 7 V595 */
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
const ritual=read('reading-ritual-core-v595.js');
const styles=read('reading-ritual-core-v595.css');
const daily=read('daily-world-v509.js');
const loader=read('page-loader-v1.js');

for(const file of [
  'app-v208.js','index.html','sw.js','reading-ritual-core-v595.js','reading-ritual-core-v595.css',
  'daily-world-v509.js','page-loader-v1.js','whit-living-presence-v594.js',
  'orbital-menu-v502.js','orbital-menu-v502.css','navigation.js','work12-foundation-v589.js',
  'living-universe-core-v524.js','supreme-orb-core-v501.js','orb-engine-v208.js',
  'orb-persistent-journey-v565.js','whit-orb-soul-bridge-v581.js','tarot-livre-orbe-os-v517.js',
  'tarot-session.js','tarot-data.js','daily-policy-v303.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v595',/name="divina-fluidity-release" content="V595"/.test(index));
check('release:work12-v595',/name="divina-work12" content="V595"/.test(index));
check('release:macro-seven',/data-macroetapa="work12-7-leituras-como-rito"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=595-work12-ritual/.test(index));
check('release:style-query',/reading-ritual-core-v595\.css\?v=595-work12-ritual/.test(index));
check('release:worker-query',/sw\.js\?v=595/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v595-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v595'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v595-work12-app'/.test(app));
check('release:worker-version',/const VERSION = 595;/.test(worker));
check('release:ritual-version',/const VERSION = 595;/.test(ritual));
check('release:macro-public',/window\.divinaWork12Macro7V595/.test(app));
check('release:macro-dataset',/work12Macro = '7-leituras-como-rito'/.test(app));
check('release:legacy-macros-preserved',[
  'divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591',
  'divinaWork12Macro4V592','divinaWork12Macro5V593','divinaWork12Macro6V594'
].every(marker=>app.includes(marker)));

check('wiring:ritual-import',app.includes("reading-ritual-core-v595.js?v=595-work12-ritual"));
check('wiring:ritual-created-once',occurrences(app,/createReadingRitualCoreV595\(/g)===1,occurrences(app,/createReadingRitualCoreV595\(/g));
check('wiring:soul-reused',app.includes('soul:whitOrbSoul'));
check('wiring:presence-reused',app.includes('presence:whitLivingPresence'));
check('wiring:universe-reused',app.includes('universe:livingUniverse'));
check('wiring:foundation-reused',app.includes('foundation:work12Foundation'));
check('wiring:daily-cache-bust',occurrences(loader,/daily-world-v509\.js\?v=595-work12-ritual/g)===2);
check('wiring:menu-v593-preserved',app.includes("orbital-menu-v502.js?v=593-work12-menu"));
check('wiring:navigation-v592-preserved',app.includes("./navigation.js?v=592-work12-navigation"));
check('wiring:universe-v590-preserved',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:orb-v591-preserved',app.includes("./supreme-orb-core-v501.js?v=591-work12-orb"));
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
check('entity:no-ritual-canvas',!/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(ritual));
check('entity:no-second-renderer',!/new\s+(?:RealityOrbEngine|WebGLRenderer|Worker)\s*\(/.test(ritual));
check('entity:one-control-per-reality',ritual.includes('maximumDepthControlsPerReality:1'));

check('ritual:sequence',ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])"));
check('ritual:one-state-machine',ritual.includes('oneStateMachine:true'));
check('ritual:one-timer',ritual.includes('oneDeferredTimer:true')&&occurrences(ritual,/this\.timer\s*=/g)>=3);
check('ritual:symbol-phase',ritual.includes("this.setPhase(kind, 'symbol'"));
check('ritual:silence-phase',ritual.includes("this.setPhase(kind, 'silence'"));
check('ritual:essence-phase',ritual.includes("this.setPhase(kind, 'essence'"));
check('ritual:depth-explicit',ritual.includes("'explicit-depth'")&&ritual.includes('requestDepth(kind)'));
check('ritual:tarot-depth-library',ritual.includes("this.go?.('library'")&&ritual.includes("intention:'symbol'"));
check('ritual:tarot-no-meanings',ritual.includes('tarotFreeAutomaticMeanings:false'));
check('ritual:daily-depth-collapsed',styles.includes('[data-reading-phase="depth"]')&&styles.includes('display:none!important'));
check('ritual:daily-two-visible-intentions',styles.includes('flex:0 0 calc(50% - 4px)'));
check('ritual:finite-bubble-birth',styles.includes('db595-intention-born 420ms'));
check('ritual:no-infinite-new-animation',!/db595-[\w-]+[^;{]*\binfinite\b/.test(styles));
check('ritual:reduced-motion',styles.includes('@media(prefers-reduced-motion:reduce)'));
check('ritual:iphone-compact',styles.includes('@media(max-width:430px)'));

check('whit:no-auto-draw-speech',!daily.includes("phrase:'Só existe uma carta para hoje"));
check('whit:no-auto-after-reveal',!daily.includes("setTimeout(() => globalThis.dispatchEvent?.(new CustomEvent('whit:whisper'"));
check('whit:one-explicit-dispatch',occurrences(daily,/new CustomEvent\('whit:whisper'/g)===1,occurrences(daily,/new CustomEvent\('whit:whisper'/g));
check('whit:explicit-source',daily.includes("source:'daily-explicit-ritual'"));
check('whit:short-invitation',daily.includes('>Whit, fica</button>'));
check('whit:ritual-silent',ritual.includes('automaticWhitSpeech:false')&&ritual.includes("this.presence?.silence?.(`reading-${reason}`"));

check('motion:universe-quiets',ritual.includes('this.universe.pause()')&&ritual.includes('this.universe?.start?.()'));
check('motion:daily-aurora-quiets',ritual.includes("globalThis.divinaDailyWorldV509?.aurora?.setActive?.(false)"));
check('motion:travel-cancels',ritual.includes("this.clearSequence(reason)")&&ritual.includes("this.setPhase(this.kind, 'travel'"));
check('motion:css-pauses-heavy',styles.includes('animation-play-state:paused!important'));

check('privacy:no-form-read',!/(?:querySelector|closest)\?\.\(\s*['"][^'"]*(?:input|textarea|contenteditable)/i.test(ritual));
check('privacy:no-storage',!/localStorage|sessionStorage|indexedDB/.test(ritual));
check('privacy:no-fetch',!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(ritual));
check('performance:no-interval',!/setInterval\s*\(/.test(ritual));
check('performance:no-raf',!/requestAnimationFrame\s*\(/.test(ritual));
check('performance:no-observer',!/new MutationObserver\s*\(/.test(ritual));
check('performance:iphone-first',ritual.includes('iphoneFirst:true'));

check('worker:cache-v595',worker.includes('divina-bruxa-work12-v595-reading-ritual'));
check('worker:eighteen-core-assets',occurrences(worker,/^  '\.\//gm)===18,occurrences(worker,/^  '\.\//gm));
check('worker:ritual-core',worker.includes("'./reading-ritual-core-v595.js?v=595-work12-ritual'"));
check('worker:ritual-styles',worker.includes("'./reading-ritual-core-v595.css?v=595-work12-ritual'"));
check('worker:daily-core',worker.includes("'./daily-world-v509.js?v=595-work12-ritual'"));
check('worker:validates-ritual',worker.includes('work12-reading-ritual-contract-missing'));
check('worker:ritual-active',worker.includes('DIVINA_WORK12_RITUAL_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));

const protectedHashes=Object.freeze({
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
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'whit-living-presence-v594.js':'8572a154f2ec4a35089de489b5dc4472d2cebc17c219b991d290ba8ab1833fc0',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'orbital-menu-v502.js':'f9adec56f450032c0b97010be116f7fadaa58610ff880cb06a153c2a49eb2344',
  'orbital-menu-v502.css':'a6d2a33dbcb490f7d32ff7dc6a991b088a76a4a84a9211d335574acaca602c02',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b'
});
for(const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v595-ritual`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:all-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:all-horizontal',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('tarot','library',595);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const session=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v595-ritual`);
const {CARDS}=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v595-ritual`);
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v595-ritual',auditSeed:'work12-v595'});
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
  release:'V595',work:'WORK12',macroStage:'7-of-10 / Leituras como Rito',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  sequence:['symbol','silence','essence','depth-on-request'],
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;

