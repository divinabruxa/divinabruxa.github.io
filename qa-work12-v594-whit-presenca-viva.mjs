/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · MACROETAPA 6 V594 */
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
const presence=read('whit-living-presence-v594.js');

for(const file of [
  'app-v208.js','index.html','sw.js','whit-living-presence-v594.js',
  'orbital-menu-v502.js','orbital-menu-v502.css','navigation.js','work12-foundation-v589.js',
  'page-loader-v1.js','living-universe-core-v524.js','supreme-orb-core-v501.js',
  'orb-engine-v208.js','orb-persistent-journey-v565.js','whit-orb-soul-bridge-v581.js',
  'tarot-session.js','tarot-data.js','daily-world-v509.js','daily-policy-v303.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v594',/name="divina-fluidity-release" content="V594"/.test(index));
check('release:work12-v594',/name="divina-work12" content="V594"/.test(index));
check('release:macro-six',/data-macroetapa="work12-6-whit-presenca-viva"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=594-work12-whit/.test(index));
check('release:worker-query',/sw\.js\?v=594/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v594-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v594'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v594-work12-app'/.test(app));
check('release:worker-version',/const VERSION = 594;/.test(worker));
check('release:presence-version',/const VERSION = 594;/.test(presence));
check('release:macro-public',/window\.divinaWork12Macro6V594/.test(app));
check('release:macro-dataset',/work12Macro = '6-whit-presenca-viva'/.test(app));
check('release:legacy-macros-preserved',['divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591','divinaWork12Macro4V592','divinaWork12Macro5V593'].every(marker=>app.includes(marker)));

check('wiring:presence-import',app.includes("whit-living-presence-v594.js?v=594-work12-whit"));
check('wiring:presence-created-once',occurrences(app,/createWhitLivingPresenceV594\(/g)===1,occurrences(app,/createWhitLivingPresenceV594\(/g));
check('wiring:soul-reused',app.includes('soul:whitOrbSoul'));
check('wiring:whit-reused',app.includes('whit:whitSupreme'));
check('wiring:bubble-reused',app.includes('bubbles:magicalBubbles'));
check('wiring:foundation-reused',app.includes('foundation:work12Foundation'));
check('wiring:governor-reused',app.includes('governor:messageGovernor'));
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
check('entity:no-whit-dom',!/createElement\s*\(/.test(presence));
check('entity:no-whit-canvas',!/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(presence));
check('entity:no-second-renderer',!/new\s+(?:RealityOrbEngine|WebGLRenderer|Worker)\s*\(/.test(presence));
check('entity:canonical-residence',presence.includes("residence:'canonical-orb'"));
check('entity:same-soul-expression',presence.includes("this.soul?.setState?.('listening'"));

check('silence:ordinary-touch-off',presence.includes("source === 'orb-touch'")&&presence.includes("silent:true"));
check('silence:explicit-preserved',presence.includes('deliberateInvitationPreserved:true'));
check('silence:home',presence.includes('homeSilent:true')&&presence.includes("'home','tarot','daily'"));
check('silence:tarot',presence.includes('tarotRitualSilent:true'));
check('silence:daily',presence.includes('dailyRitualSilent:true'));
check('silence:journal',presence.includes('journalPrivateAndSilent:true'));
check('silence:commerce',presence.includes('commerceSilent:true'));
check('silence:travel',presence.includes("travelPolicy:'absolute-silence'")&&presence.includes("this.clearPause('travel')"));
check('silence:menu',presence.includes("menuPolicy:'absolute-silence'")&&presence.includes("this.clearPause('menu')"));
check('silence:hidden',presence.includes("this.clearPause('hidden')"));
check('silence:no-arrival-text',!presence.includes('showMessage(')&&!presence.includes('textContent ='));
check('silence:no-speech-api',!/speechSynthesis|SpeechSynthesis|webkitSpeech|\.speak\s*\(/.test(presence));

const eligibleBlock=presence.match(/const ELIGIBLE_ROUTES = new Set\(\[([^\]]+)\]\)/)?.[1]||'';
const eligible=[...eligibleBlock.matchAll(/'([^']+)'/g)].map(match=>match[1]);
check('context:six-routes',eligible.length===6,eligible.join(','));
check('context:routes-exact',eligible.join(',')==='spreads,library,school,skins,music,videos',eligible.join(','));
check('context:maximum-two-session',presence.includes('const SESSION_OFFER_LIMIT = 2;'));
check('context:one-per-route',presence.includes('this.offeredRoutes.has(normalized)'));
check('context:one-timer-field',presence.includes('this.timer = 0;')&&presence.includes('oneDeferredTimer:true'));
check('context:dwell-not-immediate',Object.values({spreads:14800,library:13200,school:15600,skins:17100,music:12400,videos:16400}).every(delay=>presence.includes(String(delay))));
check('context:existing-bubble',presence.includes("source:'whit-presence'")&&presence.includes('this.bubbles?.schedule?.'));
check('context:bubble-remains-universe',presence.includes("voice:'universe'"));
check('context:no-commercial-pressure',presence.includes('emotionalSalesPressure:false')&&presence.includes('helpBeforeSale:true'));
check('context:no-emotion-inference',presence.includes('emotionInference:false'));

check('privacy:no-form-query',!/(?:input|textarea|contenteditable|FormData)\b/i.test(presence));
check('privacy:no-private-content',presence.includes('privateContentReads:0')&&presence.includes('journalBodyReads:0'));
check('privacy:no-storage',!/localStorage|sessionStorage|indexedDB/.test(presence));
check('privacy:no-fetch',!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(presence));
check('privacy:no-model',presence.includes('modelCalls:0')&&presence.includes('apiCalls:0'));

check('performance:no-interval',!/setInterval\s*\(/.test(presence));
check('performance:no-raf',!/requestAnimationFrame\s*\(/.test(presence));
check('performance:no-observer',!/new MutationObserver\s*\(/.test(presence));
check('performance:no-css',!index.includes('whit-living-presence-v594.css'));
check('performance:no-new-ui-file',presence.includes('domNodesCreated:0'));
check('performance:iphone-first',presence.includes('iphoneFirst:true'));

check('worker:cache-v594',worker.includes('divina-bruxa-work12-v594-whit'));
check('worker:fifteen-core-assets',occurrences(worker,/^  '\.\//gm)===15,occurrences(worker,/^  '\.\//gm));
check('worker:presence-core',worker.includes("'./whit-living-presence-v594.js?v=594-work12-whit'"));
check('worker:validates-presence',worker.includes('work12-whit-contract-missing'));
check('worker:whit-active',worker.includes('DIVINA_WORK12_WHIT_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));

const protectedHashes=Object.freeze({
  'navigation.js':'aed753f83db6d3a0fd9ddecbcc2e20389536fae8c214b7b1fdbccf55a8f1551b',
  'work12-foundation-v589.js':'09efb3e189fd933569c55b5ceaaabd60fb218511f8d0dc2f2845d0742e98360a',
  'page-loader-v1.js':'6caa47abb2dd35b210ffb7539ee2ba62efa1225690fad4b14c8c5d2a2785f7cf',
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
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'orbital-menu-v502.js':'f9adec56f450032c0b97010be116f7fadaa58610ff880cb06a153c2a49eb2344',
  'orbital-menu-v502.css':'a6d2a33dbcb490f7d32ff7dc6a991b088a76a4a84a9211d335574acaca602c02',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b'
});
for(const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v594-whit`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:all-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:all-horizontal',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('home','library',594);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const session=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v594-whit`);
const {CARDS}=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v594-whit`);
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v594-whit',auditSeed:'work12-v594'});
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
  release:'V594',work:'WORK12',macroStage:'6-of-10 / Whit Presenca Viva',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  contextualRoutes:eligible.length,maximumOffers:2,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
