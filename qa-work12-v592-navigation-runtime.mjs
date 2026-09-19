import fs from 'node:fs';
import vm from 'node:vm';

class TestCustomEvent extends Event {
  constructor(type,options={}) { super(type,options); this.detail=options.detail; }
}

const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':detail});
const flush=async()=>{
  await Promise.resolve();
  await Promise.resolve();
  await new Promise(resolve=>setTimeout(resolve,0));
};

const indexSource=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const bootScript=[...indexSource.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .map(match=>match[2])
  .find(body=>body.includes('divina:work12-boot-release'));

function bootHarness(){
  const timers=new Map();
  const listeners=new Map();
  const events=[];
  let timerId=0;
  const classList=()=>{
    const values=new Set();
    return {add:(...items)=>items.forEach(item=>values.add(item)),remove:(...items)=>items.forEach(item=>values.delete(item)),contains:item=>values.has(item)};
  };
  const style=()=>{
    const values=new Map();
    return {setProperty:(name,value)=>values.set(name,value),removeProperty:name=>values.delete(name)};
  };
  const node=()=>({
    hidden:false,disabled:false,textContent:'',dataset:{},classList:classList(),style:style(),
    attributes:new Map(),listeners:new Map(),
    setAttribute(name,value){this.attributes.set(name,String(value));},
    removeAttribute(name){this.attributes.delete(name);},
    addEventListener(type,handler){this.listeners.set(type,handler);}
  });
  const root=node(),message=node(),whisper=node(),recovery=node(),portal=node(),app=node(),home=node(),body=node();
  portal.querySelector=selector=>({'.db-orb-loader__message':message,'.db-orb-loader__whisper':whisper,'.db-orb-loader__recovery':recovery})[selector]||null;
  const document={documentElement:root,body,getElementById:id=>({orbLoadingPortal:portal,app,home})[id]||null,dispatchEvent:event=>{events.push(event);return true;}};
  class PlainCustomEvent { constructor(type,options={}){this.type=type;this.detail=options.detail;this.bubbles=Boolean(options.bubbles);} }
  const context={
    document,CustomEvent:PlainCustomEvent,console,
    navigator:{serviceWorker:{addEventListener(){},register:async()=>({scope:'https://divina.test/',update:async()=>{}})}},
    setTimeout:(handler,delay=0)=>{const id=++timerId;timers.set(id,{handler,delay});return id;},
    clearTimeout:id=>timers.delete(id),
    addEventListener:(type,handler)=>{if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(handler);},
    removeEventListener:(type,handler)=>listeners.set(type,(listeners.get(type)||[]).filter(item=>item!==handler))
  };
  context.window=context;
  context.dispatchEvent=event=>{for(const handler of listeners.get(event.type)||[])handler(event);return true;};
  vm.runInContext(bootScript,vm.createContext(context),{filename:'work12-inline-boot-v592.js'});
  const runDelay=delay=>{for(const [id,timer] of [...timers]){if(timer.delay!==delay)continue;timers.delete(id);timer.handler();}};
  const fire=type=>{for(const handler of listeners.get(type)||[])handler({type});};
  const click=()=>recovery.listeners.get('click')?.({preventDefault(){},stopImmediatePropagation(){}});
  return {root,portal,home,body,timers,events,runDelay,fire,click};
}

check('boot:script-found',Boolean(bootScript));
const hard=bootHarness();
check('boot:watchdog-armed',[...hard.timers.values()].some(timer=>timer.delay===4500));
hard.runDelay(4500);
hard.runDelay(180);
check('boot:watchdog-reveals-home',hard.home.classList.contains('active')&&hard.body.dataset.screen==='home');
check('boot:watchdog-hides-portal',hard.portal.hidden&&hard.portal.attributes.get('aria-hidden')==='true');
check('boot:watchdog-v592',hard.root.dataset.work12Boot==='released-v592'&&hard.root.dataset.work12BootReason==='boot-watchdog');
check('boot:watchdog-event-v592',hard.events.some(event=>event.type==='divina:work12-boot-release'&&event.detail.version===592));
const manual=bootHarness();
manual.click();
check('boot:manual-opens',manual.home.classList.contains('active')&&manual.root.dataset.work12BootReason==='manual');
const healthy=bootHarness();
healthy.root.dataset.appShell='v180';
healthy.fire('divina:boot-ready');
healthy.runDelay(4500);
check('boot:healthy-never-bypassed',healthy.root.dataset.work12Boot==='ready-v592'&&!healthy.home.classList.contains('active'));

class FakeDocument extends EventTarget {
  constructor(){
    super();
    this.documentElement={dataset:{}};
    this.body={dataset:{screen:'home'}};
    this.counts=new Map([
      ['#orb',1],['[data-supreme-orb="living"]',1],['#orbCanvas',1],
      ['#divinaLivingUniverseV524',1],['#divinaOrbPersistentJourneyV565',1],
      ['[data-v586-magic-bubble="true"]',0]
    ]);
  }
  querySelector(selector){return selector.includes('.screen.active')?{id:this.body.dataset.screen}:null;}
  querySelectorAll(selector){return Array.from({length:this.counts.get(selector)||0},(_,index)=>({index}));}
}

globalThis.CustomEvent=TestCustomEvent;
const documentTarget=new FakeDocument();
const windowTarget=new EventTarget();
globalThis.document=documentTarget;
globalThis.location={hash:''};
globalThis.addEventListener=windowTarget.addEventListener.bind(windowTarget);
globalThis.removeEventListener=windowTarget.removeEventListener.bind(windowTarget);
globalThis.dispatchEvent=windowTarget.dispatchEvent.bind(windowTarget);

const {createWork12FoundationV589}=await import('./work12-foundation-v589.js?qa-v592-navigation');
const dispatch=(type,detail={})=>documentTarget.dispatchEvent(new CustomEvent(type,{detail}));
let bubbleSilences=0,messageSilences=0,delegateCalls=0;
const delegateOptions=[];
const routeAtReady=[];
const originalNavigate=()=>Promise.resolve('original');
const orbCore={navigate:originalNavigate,snapshot:()=>({oneLivingOrb:true,oneRenderer:true,onePhysics:true,entityPreserved:true})};
const universe={status:()=>({oneUniverseCanvas:true,essentialUniverseDuringTravel:true,oneRenderClock:true})};
const journey={status:()=>({travelerCopies:0,physicalOrbTransport:true,teleportFallback:false,portalVisual:false,flicker:false,heavyEffectsPausedDuringAnyTravel:true})};
const routeTransitions=[];
const arrivals=[];
documentTarget.addEventListener('divina:work12-state',event=>routeTransitions.push(event.detail.state));
documentTarget.addEventListener('divina:work12-arrival',event=>arrivals.push(event.detail));
let foundation=null;
const navigate=async(route,options)=>{
  delegateCalls+=1;
  delegateOptions.push({route,source:options?.source,historyMode:options?.historyMode});
  const from=documentTarget.body.dataset.screen;
  dispatch('divina:supreme-orb-will-navigate',{from,to:route,source:options?.source});
  dispatch('divina:orb-ios-journey-state',{state:'depart',route});
  dispatch('divina:orb-ios-journey-state',{state:'flight',route});
  documentTarget.body.dataset.screen=route;
  dispatch('divina:route-ready',{id:route,source:options?.source,historyMode:options?.historyMode});
  routeAtReady.push(foundation.snapshot().route);
  dispatch('divina:orb-ios-journey-state',{state:'arrival',route});
  dispatch('divina:orb-ios-journey-state',{state:'settle',route});
  dispatch('divina:orb-persistent-finished',{reason:'complete',route});
  dispatch('divina:supreme-orb-did-navigate',{from,to:route});
  return route;
};
foundation=createWork12FoundationV589({
  orbCore,universe,journey,
  bubbles:{hide:()=>{bubbleSilences+=1;},status:()=>({simultaneousBubbles:1})},
  whit:{status:()=>({automaticSpeech:false})},
  messageGovernor:{release:()=>{messageSilences+=1;},status:()=>({navigationSilence:true})},
  navigate,eventTarget:documentTarget,documentElement:documentTarget.documentElement
});

check('machine:release',foundation.snapshot().release==='V592'&&foundation.version===592);
check('machine:authority',documentTarget.documentElement.dataset.work12NavigationAuthority==='v592');
check('machine:health-before-travel',foundation.audit('v592-before').health==='ok');
check('machine:single-navigation-authority',orbCore.navigate!==originalNavigate);
const initial=await foundation.navigate('home',{source:'boot',historyMode:'boot',initial:true});
await flush();
check('machine:initial-home-silent',initial==='home'&&delegateCalls===0&&foundation.snapshot().state==='REST');

routeTransitions.length=0;
const tarotResult=await foundation.navigate('tarot',{source:'data-go-v592'});
await flush();
check('journey:tarot-one-delegate',delegateCalls===1&&tarotResult==='tarot');
for(const state of ['DEPART','TRAVEL','ARRIVE','REVEAL','REST']) check(`journey:tarot-${state.toLowerCase()}`,routeTransitions.includes(state));
check('journey:route-kept-until-arrival',routeAtReady[0]==='home',routeAtReady[0]);
check('journey:tarot-rest',foundation.snapshot().state==='REST'&&foundation.snapshot().route==='tarot');
check('journey:tarot-one-arrival',arrivals.length===1&&arrivals[0].route==='tarot',String(arrivals.length));
check('journey:tarot-intention-dissolved',foundation.snapshot().activeIntentions===0);
check('journey:tarot-silence-before-motion',bubbleSilences>=1&&messageSilences>=1);

routeTransitions.length=0;
const homeResult=await foundation.navigate('home',{source:'brand-return'});
await flush();
check('journey:return-home',homeResult==='home'&&foundation.snapshot().route==='home'&&foundation.snapshot().state==='REST');
for(const state of ['DEPART','TRAVEL','ARRIVE','REVEAL']) check(`journey:return-${state.toLowerCase()}`,routeTransitions.includes(state));

const deepResult=await foundation.navigate('library',{source:'deep-link',historyMode:'deep-link'});
await flush();
check('history:deep-link-journey',deepResult==='library'&&foundation.snapshot().route==='library');
check('history:deep-link-count',foundation.status().deepLinks===1,String(foundation.status().deepLinks));
check('history:deep-link-options',delegateOptions.some(item=>item.route==='library'&&item.historyMode==='deep-link'));

const backResult=await foundation.navigate('home',{source:'history',historyMode:'traverse'});
await flush();
check('history:back-journey',backResult==='home'&&foundation.snapshot().route==='home'&&foundation.snapshot().state==='REST');
check('history:traversal-count',foundation.status().historyTraversals===1,String(foundation.status().historyTraversals));
check('history:back-options',delegateOptions.some(item=>item.route==='home'&&item.source==='history'&&item.historyMode==='traverse'));
check('history:one-arrival-per-journey',foundation.status().arrivals===4,String(foundation.status().arrivals));
check('journey:no-teleport',foundation.status().audit.checks.noTeleport===true);
check('journey:one-orb-one-universe',foundation.status().audit.checks.oneLivingOrb&&foundation.status().audit.checks.oneUniverse);
check('journey:no-copies',foundation.status().audit.checks.noTravelerCopies===true);
foundation.destroy();
check('machine:authority-restored',orbCore.navigate===originalNavigate);

documentTarget.body.dataset.screen='home';
let releaseFirst;
const gate=new Promise(resolve=>{releaseFirst=resolve;});
const queuedCalls=[];
let queuedFoundation=null;
const queuedNavigate=async(route,options)=>{
  queuedCalls.push(route);
  const from=documentTarget.body.dataset.screen;
  dispatch('divina:supreme-orb-will-navigate',{from,to:route,source:options?.source});
  dispatch('divina:orb-ios-journey-state',{state:'depart',route});
  dispatch('divina:orb-ios-journey-state',{state:'flight',route});
  if(queuedCalls.length===1) await gate;
  documentTarget.body.dataset.screen=route;
  dispatch('divina:route-ready',{id:route,source:options?.source});
  dispatch('divina:orb-ios-journey-state',{state:'arrival',route});
  dispatch('divina:orb-persistent-finished',{route});
  dispatch('divina:supreme-orb-did-navigate',{from,to:route});
  return route;
};
queuedFoundation=createWork12FoundationV589({
  orbCore,universe,journey,bubbles:{hide(){},status:()=>({})},
  messageGovernor:{release(){},status:()=>({})},navigate:queuedNavigate,
  eventTarget:documentTarget,documentElement:documentTarget.documentElement
});
const firstJourney=queuedFoundation.navigate('tarot',{source:'first'});
await Promise.resolve();
await Promise.resolve();
const queuedDaily=queuedFoundation.navigate('daily',{source:'second'});
const queuedLibrary=queuedFoundation.navigate('library',{source:'third'});
check('queue:one-pending-slot',queuedFoundation.snapshot().queuedNavigation==='library');
check('queue:shared-latest-promise',queuedDaily===queuedLibrary);
releaseFirst();
const queueResults=await Promise.all([firstJourney,queuedDaily,queuedLibrary]);
await flush();
check('queue:latest-intention-wins',queuedCalls.join(',')==='tarot,library',queuedCalls.join(','));
check('queue:superseded-daily-never-committed',!queuedCalls.includes('daily'));
check('queue:all-callers-settle',queueResults[0]==='tarot'&&queueResults[1]==='library'&&queueResults[2]==='library');
check('queue:final-route-rest',queuedFoundation.snapshot().route==='library'&&queuedFoundation.snapshot().state==='REST');
check('queue:no-hidden-pile',queuedFoundation.snapshot().queuedNavigation===null&&queuedFoundation.snapshot().activeNavigation===null);
queuedFoundation.destroy();

const soulDocument=new FakeDocument();
soulDocument.documentElement.dataset.work12='v592';
soulDocument.documentElement.dataset.work12NavigationAuthority='v592';
const soulWindow=new EventTarget();
const soulOrb={id:'orb',dataset:{},isConnected:true};
soulDocument.querySelector=selector=>selector==='#orb'?soulOrb:null;
soulDocument.querySelectorAll=selector=>selector==='#orb'||selector==='[data-supreme-orb="living"]'?[soulOrb]:[];
const soulExpressions=[];
const {WhitOrbSoulBridgeV581}=await import('./whit-orb-soul-bridge-v581.js?qa-v592-authority');
const soulBridge=new WhitOrbSoulBridgeV581({
  orbCore:{
    orb:soulOrb,
    renderer:{expressSoul:detail=>{soulExpressions.push(detail);return {existingClock:true};}},
    journeyEngine:{setPresence(){}}
  },
  universe:{signalPresence(){}},whit:{},documentTarget:soulDocument,windowTarget:soulWindow,
  documentElement:soulDocument.documentElement
});
const soulBeforeTravel=soulExpressions.length;
soulDocument.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'DEPART'}}));
const soulAfterWork12=soulExpressions.length;
soulDocument.dispatchEvent(new CustomEvent('divina:supreme-orb-will-navigate',{detail:{to:'tarot'}}));
soulDocument.dispatchEvent(new CustomEvent('divina:orb-ios-journey-state',{detail:{state:'flight'}}));
soulDocument.dispatchEvent(new CustomEvent('divina:supreme-orb-did-navigate',{detail:{to:'tarot'}}));
check('soul:v592-authority-recognized',soulBridge.work12AuthorityActive()===true);
check('soul:one-work12-travel-expression',soulAfterWork12===soulBeforeTravel+1);
check('soul:raw-navigation-yields',soulExpressions.length===soulAfterWork12,String(soulExpressions.length-soulAfterWork12));
soulDocument.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'REST'}}));
check('soul:returns-to-aware',soulBridge.state==='aware'&&soulBridge.traveling===false);
soulBridge.destroy();

const session=await import('./tarot-session.js?qa-v592-navigation');
const {CARDS}=await import('./tarot-data.js?qa-v592-navigation');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v592-navigation',auditSeed:'work12-v592-navigation'});
const cards=[];
for(let index=0;index<78;index+=1){const draw=session.drawNextCard(tarotState,{now:()=>index+2});tarotState=draw.state;cards.push(draw.cardId);}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:orientation-direct',tarotState.normalOnly===true&&cards.every(id=>CARDS[id]?.orientation==='normal'));

const daily=await import('./daily-policy-v303.js?qa-v592-navigation');
const identity={scope:'device',digest:'592c0def'};
const moment=new Date('2026-09-19T15:00:00.000Z');
const recordA=daily.createDailyRecord('  propósito   e fé  ',moment,identity);
const recordB=daily.createDailyRecord('outra intenção',moment,identity);
const next=daily.createDailyRecord('',new Date('2026-09-20T15:00:00.000Z'),identity);
check('daily:same-day-same-card',recordA.id===recordB.id);
check('daily:next-cycle',recordA.date!==next.date&&recordA.id!==next.id);
check('daily:direct',recordA.orientation==='normal'&&recordA.reversed===false);
check('daily:intention-normalized',recordA.intention==='propósito e fé');
check('daily:record-valid',daily.isDailyRecord(recordA,recordA.date));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V592',work:'WORK12',macroStage:'4-of-10 / navigation-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
