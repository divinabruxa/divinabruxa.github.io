/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 2 V581 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||path.dirname(fileURLToPath(import.meta.url)));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});

const required=[
  'app-v208.js','index.html','living-universe-core-v524.js','whit-orb-soul-bridge-v581.js','sw.js',
  'experience-message-governor-v580.js','orb-persistent-journey-v565.js',
  'tarot-livre-orbe-os-v517.js','daily-world-v509.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const index=read('index.html');
const universe=read('living-universe-core-v524.js');
const soul=read('whit-orb-soul-bridge-v581.js');
const journey=read('orb-persistent-journey-v565.js');
const sw=read('sw.js');

check(app.includes("./living-universe-core-v524.js?v=581-living-universe"),'wiring:universe-cache-busted');
check(app.includes("./whit-orb-soul-bridge-v581.js?v=581-living-universe"),'wiring:soul-bridge-import');
check(app.includes('createWhitOrbSoulBridgeV581({')&&app.includes('whitSoul:whitOrbSoul'),'wiring:one-whit-bridge');
check(app.includes('window.divinaFluidezSupremaV581'),'wiring:release-status');
check(index.includes('app-v208.js?v=581')&&index.includes('sw.js?v=581'),'cache:index-v581');
check(index.includes('divina.sw.reload.v581')&&index.includes('version:581'),'cache:inline-v581');
check(sw.includes('const VERSION=581;')&&sw.includes('divina-bruxa-v581-shell'),'cache:worker-v581');
check(sw.includes("'./whit-orb-soul-bridge-v581.js'")&&sw.includes('RELEASE_CRITICAL_PATTERN_V581'),'cache:soul-bridge-atomic');
check(sw.includes('/app-v208\\.js\\?v=581/'),'cache:shell-validator-v581');

check((universe.match(/<canvas data-living-universe-canvas>/g)||[]).length===1,'universe:one-canvas-template');
check(universe.includes("document.documentElement.dataset.livingUniverseRelease = 'v581'"),'universe:v581-release-signal');
check(universe.includes('this.suspensions = new Set()'),'universe:composite-suspension');
check(universe.includes("this.pause('document-hidden')")&&universe.includes("this.pause('page-lifecycle')")&&universe.includes("this.pause('document-freeze')"),'universe:ios-lifecycle-pauses');
check(universe.includes("this.start('texture-ready')")&&universe.includes('this.suspensions.size'),'universe:texture-cannot-break-flight-pause');
check(universe.includes("mode = 'deep-idle'")&&universe.includes("mode = 'ambient'")&&universe.includes("mode = 'active'"),'universe:demand-aware-cadence');
check(universe.includes("mode = 'reduced'")&&universe.includes("mode = active ? 'protected-active' : 'protected-idle'"),'universe:reduced-and-protected-cadence');
check(universe.includes('signalPresence({ state = \'aware\'')&&universe.includes('whitPresenceVisualOnly:true'),'universe:nonverbal-whit-field');
check(universe.includes('synchronizedBlinking:false')&&!universe.includes('setInterval('),'universe:no-blink-no-interval');
check(journey.includes("this.universe?.pause?.('atom-one-flight')")&&journey.includes("this.universe?.start?.('atom-one-flight')"),'journey:universe-paused-during-flight');

const routes=['home','tarot','daily','spreads','library','school','journal','ai','skins','consultations','store','music','videos','login','subscriptions','notifications','admin'];
routes.forEach(route=>check(new RegExp(`\\n  ${route}:\\{`).test(universe),`universe:profile:${route}`));

check(!soul.includes('createElement(')&&!soul.includes('requestAnimationFrame('),'whit-soul:no-ui-no-loop');
check(soul.includes('canonicalOrbOnly:true')&&soul.includes('separateOrb:false'),'whit-soul:canonical-orb-only');
check(soul.includes('fictionalPersona:true')&&soul.includes('soulMetaphor:true')&&soul.includes('consciousnessClaim:false'),'whit-soul:honest-fiction-contract');
check(soul.includes('privateContentRead:false')&&soul.includes('formFieldReads:false')&&soul.includes('modelCalls:0'),'whit-soul:privacy-and-zero-api');
check(soul.includes('suppressedDuringTravel')&&soul.includes('orbNavigationState'),'whit-soul:movement-priority');
check((index.match(/id=["']orb["']/g)||[]).length===1,'orb:one-canonical-id');

const frozen=Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'orb-persistent-journey-v565.js':'c76df02771d327d3d237043227661b4908fb33f24ceef8de19c7e8426b22d727',
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'navigation.js':'fb33453fb9d10b10b3860fbb9f4586bd6c2f9c4e70e5482fc2e4063b44081694',
  'supreme-orb-core-v501.js':'3d6e7979d58ee81db8e150e731330c910e04f1d4c7e233232f73d287040c1e27',
  'orb-universal-presence-v526.js':'9df8d1131ed769392d921077e1931c9d780969d623e0ce30c7b1ca044c3a532b',
  'orbital-menu-v502.js':'ae4aefa12f231b15a86604b63b66de9a1975d815ba9a1e10aebab131c9d29259'
});
Object.entries(frozen).forEach(([file,expected])=>check(sha(file)===expected,`protected:${file}`));

globalThis.document={documentElement:{dataset:{}}};
globalThis.matchMedia=()=>({matches:false});
let nextFrame=0;
let cancelledFrame=0;
globalThis.requestAnimationFrame=()=>++nextFrame;
globalThis.cancelAnimationFrame=id=>{cancelledFrame=id;};

const {LivingUniverseCoreV524}=await import(pathToFileURL(path.join(root,'living-universe-core-v524.js')).href+'?qa=v581');
const loopProbe=Object.create(LivingUniverseCoreV524.prototype);
Object.assign(loopProbe,{
  root:{dataset:{}},suspensions:new Set(),destroyed:false,visible:true,raf:77,lastFrame:0,lastDraw:0,
  frame(){},touch:{active:false,lastMoveAt:0},energy:0.18,orbEnergy:0.12,width:390,
  requestedFps:60,targetFps:60,qualityProfile:'balanced',degraded:false,cadenceMode:'active',
  lastDemandAt:0,demandUntil:0
});
loopProbe.pause('atom-one-flight');
loopProbe.pause('manual');
const blockedResume=loopProbe.start('atom-one-flight');
check(cancelledFrame===77&&!blockedResume&&loopProbe.suspensions.has('manual')&&loopProbe.raf===0,'runtime:overlapping-pause-blocks-resume');
const manualResume=loopProbe.start();
check(manualResume&&loopProbe.suspensions.size===0&&loopProbe.raf>0,'runtime:matching-resume-only');
loopProbe.raf=0;
check(loopProbe.cadenceFor(12000)===24&&loopProbe.cadenceMode==='deep-idle','runtime:iphone-deep-idle-24fps');
loopProbe.demandUntil=15000;
check(loopProbe.cadenceFor(12000)===60&&loopProbe.cadenceMode==='active','runtime:demand-restores-full-budget');
loopProbe.qualityProfile='protected';
check(loopProbe.cadenceFor(12000)===30&&loopProbe.cadenceMode==='protected-active','runtime:protected-active-cap');

let presenceStarts=0;
const presenceProbe=Object.create(LivingUniverseCoreV524.prototype);
Object.assign(presenceProbe,{
  root:{dataset:{}},presenceState:'serene',presenceSignals:0,orbEnergy:0.12,energy:0.18,
  touch:{target:0.08},markDemand(){},start(){presenceStarts+=1;}
});
const reflected=presenceProbe.signalPresence({state:'reflecting',strength:0.66});
presenceProbe.signalPresence({state:'traveling',strength:0.8});
check(reflected.state==='reflecting'&&presenceProbe.presenceSignals===2,'runtime:whit-presence-enters-universe');
check(presenceStarts===1&&presenceProbe.root.dataset.whitOrbPresence==='traveling','runtime:traveling-never-wakes-renderer');

const {WhitOrbSoulBridgeV581}=await import(pathToFileURL(path.join(root,'whit-orb-soul-bridge-v581.js')).href+'?qa=v581');
const docTarget=new EventTarget();
Object.assign(docTarget,{hidden:false,visibilityState:'visible'});
const winTarget=new EventTarget();
const documentElement={dataset:{}};
const orb={dataset:{}};
docTarget.querySelector=()=>orb;
const radiations=[];
const bridge=new WhitOrbSoulBridgeV581({
  orbCore:{orb},universe:{signalPresence:detail=>radiations.push(detail)},
  documentTarget:docTarget,windowTarget:winTarget,documentElement
});
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'release'}}));
check(bridge.state==='responding'&&orb.dataset.whitSoulV581==='responding','runtime:touch-awakens-whit-inside-canonical-orb');
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-will-navigate',{detail:{to:'daily'}}));
const beforeSuppressed=radiations.length;
winTarget.dispatchEvent(new CustomEvent('whit:nerve',{detail:{kind:'school-complete'}}));
check(bridge.state==='traveling'&&bridge.suppressedDuringTravel===1&&radiations.length===beforeSuppressed,'runtime:whit-yields-to-movement');
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-did-navigate',{detail:{to:'daily'}}));
check(bridge.state==='aware'&&bridge.traveling===false,'runtime:whit-returns-after-arrival');
check(bridge.status().separateOrb===false&&bridge.status().animationLoops===0,'runtime:no-second-orb-no-loop');
bridge.destroy();

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+'?qa=v581');
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+'?qa=v581');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v581-tarot',auditSeed:'qa-v581-seed'});
const revealed=[];
for(let index=0;index<78;index+=1){
  const result=session.drawNextCard(tarotState,{now:()=>index+2});
  tarotState=result.state;
  revealed.push(result.cardId);
}
check(revealed.length===78&&new Set(revealed).size===78,'tarot:78-without-repetition');
check(revealed.every(id=>CARDS[id]?.orientation==='normal'),'tarot:all-cards-direct');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V581',base:'V580',macroStage:'Fluidez Suprema / 2 de 10 / Universo Vivo Global',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{oneUniverseCanvas:true,onePhysicalOrb:true,newAnimationLoops:0,whitVisualOnly:true,travelPriority:true},
  failures
},null,2));
if(failures.length)process.exitCode=1;
