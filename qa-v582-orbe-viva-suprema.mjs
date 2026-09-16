/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 3 V582 */
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
  'app-v208.js','index.html','orb-engine-v208.js','whit-orb-soul-bridge-v581.js','sw.js',
  'living-universe-core-v524.js','orb-motion-core-v207.js','orb-persistent-journey-v565.js',
  'tarot-livre-orbe-os-v517.js','daily-world-v509.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const index=read('index.html');
const engine=read('orb-engine-v208.js');
const soul=read('whit-orb-soul-bridge-v581.js');
const universe=read('living-universe-core-v524.js');
const journey=read('orb-persistent-journey-v565.js');
const motion=read('orb-motion-core-v207.js');
const sw=read('sw.js');

check(app.includes("./orb-engine-v208.js?v=582-living-soul"),'wiring:renderer-v582');
check(app.includes("./whit-orb-soul-bridge-v581.js?v=582-living-soul"),'wiring:soul-v582');
check(app.includes('window.divinaFluidezSupremaV582'),'wiring:release-status');
check(app.includes('livingSoul:whitOrbSoul'),'wiring:living-soul-public');
check((app.match(/new RealityOrbEngine\(/g)||[]).length===1,'architecture:one-reality-orb-engine');
check(index.includes('app-v208.js?v=582')&&index.includes('sw.js?v=582'),'cache:index-v582');
check(index.includes('divina.sw.reload.v582')&&index.includes('version:582'),'cache:inline-v582');
check(sw.includes('const VERSION=582;')&&sw.includes('divina-bruxa-v582-shell'),'cache:worker-v582');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V582')&&sw.includes('whit-orb-soul-bridge-v581'),'cache:soul-atomic');
check(sw.includes(String.raw`/app-v208\.js\?v=582/`),'cache:shell-validator-v582');

check((index.match(/id=["']orb["']/g)||[]).length===1,'orb:one-canonical-id');
check((engine.match(/orbMotionV207\.register\(/g)||[]).length===1,'orb:one-existing-motion-client');
check(engine.includes('expressSoul({')&&engine.includes('existingShader:true'),'orb:soul-uses-existing-shader');
check(engine.includes('sharedMotionClock:true')&&engine.includes('newAnimationLoops:0'),'orb:soul-uses-existing-clock');
check(engine.includes("aware:'attentive'")&&engine.includes("reflecting:'listening'")&&engine.includes("resting:'sleeping'"),'orb:semantic-to-physical-map');
check(engine.includes('const nonverbalSignal = message && typeof message === \'object\''),'orb:core-pulse-nonverbal');
check(engine.includes('ariaRepeatsSuppressed')&&engine.includes('now - previous < 18000'),'orb:aria-repeat-suppression');
check(!engine.includes('speechSynthesis')&&!engine.includes('navigator.vibrate'),'orb:no-speech-no-web-vibration');

check(!soul.includes('createElement(')&&!soul.includes('requestAnimationFrame('),'soul:no-ui-no-raf');
check(!soul.includes('setInterval(')&&!soul.includes('new Worker('),'soul:no-interval-no-worker');
check(soul.includes('const EXPRESSIONS = Object.freeze(['),'soul:expression-bank');
check((soul.match(/key:'[^']+'/g)||[]).length===7,'soul:seven-expression-profiles');
check(soul.includes('if (index === this.lastExpressionIndex)'),'soul:no-consecutive-expression-repeat');
check(soul.includes('journey?.setPresence?.(')&&soul.includes('renderer?.expressSoul?.('),'soul:existing-physical-authorities');
check(soul.includes('suppressedDuringTravel')&&soul.includes('orbNavigationState'),'soul:travel-priority');
check(soul.includes('committedJourney')&&soul.includes("'orb-intent-ready'"),'soul:intent-does-not-fake-travel');
check(soul.includes('messageIncluded:false')&&soul.includes('speechAdded:false'),'soul:no-new-voice');
check(soul.includes('fictionalPersona:true')&&soul.includes('soulMetaphor:true')&&soul.includes('consciousnessClaim:false'),'soul:honest-fiction-contract');
check(soul.includes('privateContentRead:false')&&soul.includes('formFieldReads:false'),'soul:privacy');
check(soul.includes('modelCalls:0')&&soul.includes('apiCalls:0'),'soul:no-model-no-api');
check(soul.includes('separateOrb:false')&&soul.includes('newCanvas:false')&&soul.includes('animationLoops:0'),'soul:no-second-orb-engine');

check(universe.includes('const RELEASE = 581;')&&universe.includes('compositeSuspension:true'),'preserved:universe-v581');
check(journey.includes("this.universe?.pause?.('atom-one-flight')")&&journey.includes("this.universe?.start?.('atom-one-flight')"),'preserved:travel-pauses-universe');
check(motion.includes('Um relógio compartilhado')&&motion.includes('scheduledFrames: Number(Boolean(this.frame))'),'preserved:single-motion-clock');

const frozen=Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'3cdc1c5913bb7fc315bfe89f80a8864e64fd8720120d46f89aeaa2d082ce7878',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
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

const globalDocument=new EventTarget();
Object.assign(globalDocument,{documentElement:{dataset:{}},hidden:false});
globalThis.document=globalDocument;
globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});

const {RealityOrbEngine}=await import(pathToFileURL(path.join(root,'orb-engine-v208.js')).href+'?qa=v582');
let rendererState='serene',framesRequested=0;
const rendererProbe=Object.create(RealityOrbEngine.prototype);
Object.assign(rendererProbe,{
  destroyed:false,soulState:'serene',soulExpressions:0,soulLastReason:'boot',
  targetEnergy:.16,targetPressure:0,spin:0,ripple:{x:.5,y:.5,age:99},
  pointer:{targetX:.5,targetY:.5},shell:{dataset:{}},
  setPresenceState(state){rendererState=state;this.presenceState=state;return true;},
  presenceProfile(){return {energy:.21};},
  setTarget(point){this.pointer.targetX=point.x;this.pointer.targetY=point.y;return point;},
  requestFrame(){framesRequested+=1;}
});
const soulExpression=rendererProbe.expressSoul({
  state:'reflecting',strength:.68,focus:{x:.23,y:.71},
  variation:{energy:.08,spin:.04},reason:'qa-reflection'
});
check(rendererState==='listening'&&rendererProbe.soulState==='reflecting','runtime:semantic-reflection-enters-renderer');
check(rendererProbe.pointer.targetX===.23&&rendererProbe.pointer.targetY===.71,'runtime:touch-focus-preserved');
check(soulExpression.existingShader&&soulExpression.existingClock&&framesRequested===1,'runtime:existing-render-clock-only');
check(soulExpression.messageIncluded===false&&soulExpression.hapticTriggered===false,'runtime:expression-is-nonverbal');

let announced=0,haptics=0;
const pulseProbe=Object.create(RealityOrbEngine.prototype);
Object.assign(pulseProbe,{
  targetEnergy:.1,pointer:{targetX:.5,targetY:.5},ripple:{x:.5,y:.5,age:99},
  down:false,opening:false,pulseTimer:0,
  setTarget(point){this.pointer.targetX=point.x;this.pointer.targetY=point.y;},
  announce(){announced+=1;},haptic(){haptics+=1;},requestFrame(){},
  presenceProfile(){return {energy:.16};},settleToIdle(){}
});
pulseProbe.pulse({kind:'press',x:.31,y:.66,intensity:.84});
clearTimeout(pulseProbe.pulseTimer);
check(announced===0&&haptics===0,'runtime:core-payload-never-speaks-or-double-haptics');
check(pulseProbe.pointer.targetX===.31&&pulseProbe.pointer.targetY===.66,'runtime:core-payload-keeps-touch-origin');

const announceProbe=Object.create(RealityOrbEngine.prototype);
Object.assign(announceProbe,{
  status:{textContent:''},shell:{dataset:{}},announcementHistory:new Map(),
  ariaAnnouncements:0,ariaRepeatsSuppressed:0
});
const firstAnnouncement=announceProbe.announce('A Orbe está respirando','RESPIRA');
const repeatedAnnouncement=announceProbe.announce('A Orbe está respirando','RESPIRA');
check(firstAnnouncement===true&&repeatedAnnouncement===false,'runtime:repeated-aria-is-suppressed');
check(announceProbe.ariaAnnouncements===1&&announceProbe.ariaRepeatsSuppressed===1,'runtime:aria-counters');

const {WhitOrbSoulBridgeV581}=await import(pathToFileURL(path.join(root,'whit-orb-soul-bridge-v581.js')).href+'?qa=v582');
const docTarget=new EventTarget();
Object.assign(docTarget,{hidden:false,visibilityState:'visible'});
const winTarget=new EventTarget();
const documentElement={dataset:{}};
const orb={dataset:{}};
docTarget.querySelector=()=>orb;
const rendererExpressions=[];
const presenceStates=[];
const radiations=[];
const bridge=new WhitOrbSoulBridgeV581({
  orbCore:{
    orb,
    journeyEngine:{setPresence:(state,options)=>presenceStates.push({state,options})},
    renderer:{expressSoul:detail=>{rendererExpressions.push(detail);return {ok:true};}}
  },
  universe:{signalPresence:detail=>radiations.push(detail)},
  documentTarget:docTarget,windowTarget:winTarget,documentElement
});
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'press',x:.19,y:.73,intensity:.91}}));
check(bridge.state==='listening'&&orb.dataset.orbLivingSoulV582==='listening','runtime:touch-awakens-one-canonical-orb');
check(rendererExpressions.at(-1)?.focus?.x===.19&&rendererExpressions.at(-1)?.focus?.y===.73,'runtime:soul-follows-real-touch');
const pressExpression=bridge.lastExpression;
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'release',x:.19,y:.73,intensity:.76}}));
check(bridge.state==='responding'&&bridge.lastExpression!==pressExpression,'runtime:response-is-not-mechanical-repeat');
const beforeCoalesce=rendererExpressions.length;
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'release',x:.19,y:.73,intensity:.76}}));
check(bridge.coalescedSignals===1&&rendererExpressions.length===beforeCoalesce,'runtime:duplicate-signal-coalesced');

delete documentElement.dataset.orbNavigationState;
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'intent',x:.5,y:.5}}));
check(bridge.state==='listening'&&bridge.traveling===false,'runtime:uncommitted-intent-never-fakes-travel');
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-will-navigate',{detail:{to:'daily'}}));
const beforeSuppressed=rendererExpressions.length;
winTarget.dispatchEvent(new CustomEvent('whit:nerve',{detail:{kind:'school-complete'}}));
check(bridge.state==='traveling'&&bridge.suppressedDuringTravel===1,'runtime:whit-yields-to-travel');
check(rendererExpressions.length===beforeSuppressed,'runtime:no-extra-expression-during-travel');
docTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-did-navigate',{detail:{to:'daily'}}));
check(bridge.state==='aware'&&bridge.traveling===false,'runtime:soul-returns-after-arrival');
winTarget.dispatchEvent(new CustomEvent('whit:generation-bridge'));
check(bridge.state==='reflecting'&&presenceStates.at(-1)?.state==='listening','runtime:whit-reflection-becomes-physical-state');
check(bridge.status().distinctExpressionProfiles===7&&bridge.status().animationLoops===0,'runtime:seven-expressions-zero-loops');
check(bridge.status().separateOrb===false&&bridge.status().sameRenderer===true,'runtime:no-second-orb-or-renderer');
check(radiations.length>0&&bridge.status().messageIncluded===false,'runtime:presence-radiates-without-message');
bridge.destroy();

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+'?qa=v582');
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+'?qa=v582');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v582-tarot',auditSeed:'qa-v582-seed'});
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
  release:'V582',base:'V581',macroStage:'Fluidez Suprema / 3 de 10 / Orbe Viva Suprema',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{
    onePhysicalOrb:true,sameRenderer:true,sameMotionClock:true,newCanvases:0,
    newAnimationLoops:0,expressionProfiles:7,whitVisualOnly:true,travelPriority:true
  },
  failures
},null,2));
if(failures.length)process.exitCode=1;
