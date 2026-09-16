/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 4 V583 */
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
  'app-v208.js','index.html','orb-persistent-journey-v565.js',
  'universe-coordinate-law-v583.js','sw.js','orb-engine-v208.js',
  'whit-orb-soul-bridge-v581.js','tarot-livre-orbe-os-v517.js','daily-world-v509.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const index=read('index.html');
const journey=read('orb-persistent-journey-v565.js');
const coordinates=read('universe-coordinate-law-v583.js');
const sw=read('sw.js');

check(app.includes("./orb-persistent-journey-v565.js?v=583-coordinate-travel"),'wiring:journey-v583');
check(app.includes('window.divinaFluidezSupremaV583'),'wiring:release-status');
check(app.includes("screenModel:'coordinate-reveal'")&&app.includes("conceptualPages:false"),'wiring:coordinate-screen-model');
check(index.includes('app-v208.js?v=583')&&index.includes('sw.js?v=583'),'cache:index-v583');
check(index.includes('divina.sw.reload.v583')&&index.includes('version:583'),'cache:inline-v583');
check(sw.includes('const VERSION=583;')&&sw.includes('divina-bruxa-v583-shell'),'cache:worker-v583');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V583')&&sw.includes('universe-coordinate-law-v583'),'cache:coordinate-law-atomic');
check(sw.includes(String.raw`/app-v208\.js\?v=583/`),'cache:shell-validator-v583');

check((index.match(/id=["']orb["']/g)||[]).length===1,'orb:one-canonical-id');
check((app.match(/new RealityOrbEngine\(/g)||[]).length===1,'orb:one-renderer');
check(app.includes('temporaryLivingCanvasMirror:false')&&app.includes('journeyTravelerCopies:0'),'orb:no-mirror-no-copy');
check(!coordinates.includes('createElement(')&&!coordinates.includes('requestAnimationFrame('),'coordinates:no-ui-no-loop');
check(!coordinates.includes('setInterval(')&&!coordinates.includes('new Worker('),'coordinates:no-interval-no-worker');

const coordinateModule=await import(
  pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href+'?qa=v583'
);
const {
  UNIVERSE_COORDINATES_V583,
  UNIVERSE_COORDINATE_LAW_V583,
  auditUniverseCoordinateLawV583,
  universeCoordinateV583,
  universeJourneyVectorV583
}=coordinateModule;
const coordinateAudit=auditUniverseCoordinateLawV583();
const routes=Object.keys(UNIVERSE_COORDINATES_V583);

check(coordinateAudit.valid&&coordinateAudit.routeCount===17,'coordinates:17-valid-realities');
check(coordinateAudit.directedTransitionCount===272,'coordinates:all-directed-transitions');
check(coordinateAudit.uniqueHorizontalCoordinates,'coordinates:unique-horizontal-lanes');
check(coordinateAudit.everyRealityTransitionIsHorizontal,'coordinates:every-reality-change-travels-horizontally');
check(coordinateAudit.homeIsOrigin,'coordinates:home-is-origin');
check(UNIVERSE_COORDINATE_LAW_V583.pages===false&&UNIVERSE_COORDINATE_LAW_V583.screenModel==='coordinate-reveal','coordinates:no-conceptual-pages');
check(UNIVERSE_COORDINATE_LAW_V583.axes.horizontal==='travel-between-realities','coordinates:x-is-reality-travel');
check(UNIVERSE_COORDINATE_LAW_V583.axes.vertical==='immersion','coordinates:y-is-immersion');
check(UNIVERSE_COORDINATE_LAW_V583.axes.depth==='discovery','coordinates:z-is-discovery');

const vectors=[];
for(const from of routes){
  for(const to of routes){
    if(from===to)continue;
    const vector=universeJourneyVectorV583(from,to,1);
    vectors.push(vector);
    check(vector.horizontal.sign!==0,`vector:${from}:${to}:horizontal`);
    check(vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,`vector:${from}:${to}:continuity`);
    check(vector.vertical.level===universeCoordinateV583(to).y,`vector:${from}:${to}:immersion`);
    check(vector.depth.level===universeCoordinateV583(to).z,`vector:${from}:${to}:discovery`);
  }
}
check(vectors.length===272,'vectors:complete-matrix');
check(vectors.every(vector=>vector.horizontal.direction===(vector.delta.x>0?'right':'left')),'vectors:direction-follows-x');
check(vectors.every(vector=>vector.depth.crossingScale>=.86&&vector.depth.crossingScale<=1.14),'vectors:depth-scale-bounded');

const reversePairs=routes.slice(1).map(route=>[
  universeJourneyVectorV583('home',route,2),
  universeJourneyVectorV583(route,'home',3)
]);
check(reversePairs.every(([outbound,inbound])=>outbound.horizontal.sign===-inbound.horizontal.sign),'vectors:return-reverses-naturally');
const variedForms=new Set(Array.from({length:12},(_,index)=>
  universeJourneyVectorV583('tarot','daily',index).form.key
));
check(variedForms.size>=3,'vectors:form-varies-without-random-loop');
check(Array.from(variedForms).every(Boolean),'vectors:forms-remain-semantic');

check(journey.includes("setState('crossing'")&&!journey.includes("setState('portal'"),'journey:no-portal-phase');
check(journey.includes("this.universe?.pause?.('atom-one-flight')")&&journey.includes("this.universe?.start?.('atom-one-flight')"),'journey:pause-resume-universe');
check(journey.indexOf('this.suspendHeavyEffects();',journey.indexOf('async depart'))<journey.indexOf("this.setState('depart'",journey.indexOf('async depart')),'journey:pause-before-depart-state');
check(journey.includes('continuousManualFallback:true')&&journey.includes('for (let index=1; index<=manualSamples; index+=1)'),'journey:no-teleport-manual-fallback');
check(!journey.includes("if (reducedMotion() || typeof this.stage.animate !== 'function')"),'journey:reduced-motion-not-instant-jump');
check(journey.includes("screenModel:'coordinate-reveal'")&&journey.includes("conceptualPages:false"),'journey:coordinate-contract-observable');
check(journey.includes('travelerCopies:0')&&journey.includes('portalVisual:false')&&journey.includes('flicker:false'),'journey:no-copy-no-portal-no-flicker');
check(journey.includes('automaticRouteVoice:false')&&journey.includes('silenceIsPresence:true'),'journey:silence-is-life');
check(journey.includes("const explicit = ['already-present','explicit-orb-request'].includes(reason)"),'journey:voice-only-after-explicit-intent');
check(journey.includes('oneIntentionPerBubble:true')&&journey.includes('fewWordsPerBubble:true'),'journey:magic-bubble-law');

const documentElement={
  dataset:{performanceTier:'balanced'},
  clientWidth:390,
  clientHeight:844,
  setAttribute(name,value){this[name]=String(value);},
  removeAttribute(name){delete this[name];},
  getAttribute(name){return this[name]??null;}
};
const emitted=[];
globalThis.document={
  documentElement,
  body:{dataset:{screen:'home'}},
  hidden:false,
  dispatchEvent(event){emitted.push({type:event.type,detail:event.detail});return true;},
  querySelector(){return null;},
  querySelectorAll(){return[];}
};
globalThis.CustomEvent=class CustomEvent{
  constructor(type,{detail}={}){this.type=type;this.detail=detail;}
};
globalThis.innerWidth=390;
globalThis.innerHeight=844;
globalThis.visualViewport={width:390,height:844,offsetLeft:0,offsetTop:0};
globalThis.matchMedia=query=>({matches:String(query).includes('prefers-reduced-motion')});
let frameCalls=0;
globalThis.requestAnimationFrame=callback=>{frameCalls+=1;queueMicrotask(()=>callback(frameCalls*16));return frameCalls;};
globalThis.cancelAnimationFrame=()=>{};

const journeyModule=await import(
  pathToFileURL(path.join(root,'orb-persistent-journey-v565.js')).href+'?qa=v583'
);
const {OrbPersistentJourneyV565,ORB_ROUTE_VOICE_V580}=journeyModule;

const transforms=[];
const style={};
Object.defineProperty(style,'transform',{
  set(value){transforms.push(String(value));},
  get(){return transforms.at(-1)||'';}
});
const motionProbe=Object.create(OrbPersistentJourneyV565.prototype);
Object.assign(motionProbe,{
  current:{x:20,y:100},scale:1,sourceSize:80,
  stage:{style},animations:new Set(),lastMotion:null
});
await motionProbe.move([{x:180,y:160}],[.9],84,'linear');
check(frameCalls>=3&&transforms.length>=3,'runtime:manual-path-crosses-real-frames');
check(new Set(transforms).size>=3,'runtime:manual-path-has-intermediate-positions');
check(motionProbe.current.x===180&&motionProbe.current.y===160,'runtime:manual-path-reaches-destination');

const gatewayProbe=Object.create(OrbPersistentJourneyV565.prototype);
gatewayProbe.route='home';
gatewayProbe.serial=1;
const origin={x:195,y:360};
const leftGateway=gatewayProbe.gateway('tarot',{from:'home',origin,vector:universeJourneyVectorV583('home','tarot',1)});
const rightGateway=gatewayProbe.gateway('school',{from:'home',origin,vector:universeJourneyVectorV583('home','school',1)});
const shallowGateway=gatewayProbe.gateway('login',{from:'home',origin,vector:universeJourneyVectorV583('home','login',1)});
check(leftGateway.x<origin.x&&rightGateway.x>origin.x,'runtime:horizontal-direction-is-visible');
check(rightGateway.y>shallowGateway.y,'runtime:vertical-level-deepens-immersion');
check([leftGateway,rightGateway,shallowGateway].every(point=>point.x>=42&&point.x<=348&&point.y>=84&&point.y<=752),'runtime:iphone-safe-bounds');

let universePauses=0,universeStarts=0,physicalSettles=0;
const lifecycleTransforms=[];
const lifecycleStyle={setProperty(){}};
Object.defineProperty(lifecycleStyle,'transform',{
  set(value){lifecycleTransforms.push(String(value));},
  get(){return lifecycleTransforms.at(-1)||'';}
});
const lifecycleProbe=Object.create(OrbPersistentJourneyV565.prototype);
Object.assign(lifecycleProbe,{
  destroyed:false,active:false,state:'rest',serial:0,route:'home',
  coordinate:universeCoordinateV583('home'),journeyVector:null,lastJourneyVector:null,
  coordinateTransitions:0,landingHost:null,pendingMenuOrigin:null,pendingMenuOriginAt:0,
  current:null,sourceSize:80,scale:1,completed:0,interrupted:0,
  root:{dataset:{},style:{setProperty(){}},hidden:false},
  stage:{style:lifecycleStyle},animations:new Set(),
  core:{orb:{isConnected:true},renderer:{resize(){}}},
  universe:{pause(){universePauses+=1;},start(){universeStarts+=1;}},
  resolveOrigin:()=>({x:195,y:360,width:80,height:80}),
  capturePhysicalOrb(origin){this.sourceSize=80;this.current={x:origin.x,y:origin.y};this.scale=1;},
  waitForDestination:async()=>({x:205,y:410,width:88,height:88,kind:'qa-coordinate-anchor'}),
  settlePhysicalOrb(route){this.route=route;physicalSettles+=1;return true;},
  hideVoice(){return true;},setPresence(){return true;},speakRoute(){return false;},
  status(){return {state:this.state,route:this.route,active:this.active};}
});
document.body.dataset.screen='home';
await lifecycleProbe.depart({from:'home',to:'daily',serial:7,source:'qa-v583'});
check(universePauses===1&&universeStarts===0,'runtime:lifecycle-pauses-before-crossing');
check(lifecycleProbe.state==='crossing'&&lifecycleProbe.active,'runtime:lifecycle-reaches-crossing-with-same-body');
check(documentElement.getAttribute('data-orb-global-flight')==='active','runtime:lifecycle-flight-attribute-active');
document.body.dataset.screen='daily';
await lifecycleProbe.arrive({from:'home',to:'daily',serial:7});
check(universeStarts===1&&physicalSettles===1,'runtime:lifecycle-resumes-only-after-physical-settle');
check(!lifecycleProbe.active&&lifecycleProbe.state==='rest'&&lifecycleProbe.journeyVector===null,'runtime:lifecycle-rests-cleanly');
check(documentElement.dataset.universeCoordinate==='-3:1:1'&&documentElement.dataset.universeCoordinatePhase==='rest','runtime:lifecycle-publishes-daily-coordinate');
check(documentElement.getAttribute('data-orb-global-flight')===null,'runtime:lifecycle-clears-flight-attribute');
check(new Set(lifecycleTransforms).size>=5,'runtime:lifecycle-has-continuous-departure-and-arrival');
const lifecycleStates=emitted.filter(event=>event.type==='divina:orb-persistent-state').map(event=>event.detail?.state);
check(['depart','flight','crossing','arrival','settle'].every(state=>lifecycleStates.includes(state)),'runtime:lifecycle-emits-all-coordinate-phases');

let shown=0,hidden=0;
const voiceProbe=Object.create(OrbPersistentJourneyV565.prototype);
Object.assign(voiceProbe,{
  active:false,state:'rest',silenceChoices:0,
  hideVoice(){hidden+=1;return true;},
  showVoice(){shown+=1;return true;},
  voiceVariants:route=>ORB_ROUTE_VOICE_V580[route]
});
check(voiceProbe.speakRoute('tarot','arrival-complete')===false&&shown===0&&voiceProbe.silenceChoices===1,'runtime:arrival-chooses-silence');
check(voiceProbe.speakRoute('tarot','already-present')===true&&shown===1,'runtime:explicit-orb-intent-may-speak');
check(hidden>=1,'runtime:silence-hides-stale-bubble');

const phrases=Object.values(ORB_ROUTE_VOICE_V580).flat();
const wordCounts=phrases.map(phrase=>phrase.trim().split(/\s+/).length);
check(phrases.length===51,'bubble:three-varied-intentions-per-reality');
check(Math.max(...wordCounts)<=4,'bubble:summary-of-summary-copy');
check(new Set(phrases).size===phrases.length,'bubble:no-literal-duplicates');

const frozen=Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'3cdc1c5913bb7fc315bfe89f80a8864e64fd8720120d46f89aeaa2d082ce7878',
  'orb-engine-v208.js':'57ddc1fd47579c46cb1ec7ca742c81588199a30d442e062d48c82193ddd23b14',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'whit-orb-soul-bridge-v581.js':'921444fc727bd877c1658e85f97025d6dca116553a66f85164ea1a1b52294ca8',
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
  'orbital-menu-v502.js':'ae4aefa12f231b15a86604b63b66de9a1975d815ba9a1e10aebab131c9d29259',
  'world-truth-registry-v535.js':'e8aaa5724fa87868a46e228bbb9b655dafbeeb0299bc4f5ac20fb9a847a7acf9',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b'
});
Object.entries(frozen).forEach(([file,expected])=>check(sha(file)===expected,`protected:${file}`));

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+'?qa=v583');
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+'?qa=v583');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v583-tarot',auditSeed:'qa-v583-seed'});
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
  release:'V583',base:'V582',macroStage:'Fluidez Suprema / 4 de 10 / Viagem por Coordenadas',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{
    realities:17,directedTransitions:272,onePhysicalOrb:true,coordinateScreen:true,
    continuousTravel:true,portalVisual:false,teleport:false,flicker:false,
    heavyEffectsPaused:true,automaticWhitEveryTouch:false,silenceIsPresence:true,
    iphoneFirst:true,tarotProtected:true,dailyProtected:true
  },
  failures
},null,2));
if(failures.length)process.exitCode=1;
