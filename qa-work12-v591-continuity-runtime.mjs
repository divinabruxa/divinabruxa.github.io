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
  vm.runInContext(bootScript,vm.createContext(context),{filename:'work12-inline-boot-v591.js'});
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
check('boot:watchdog-v591',hard.root.dataset.work12Boot==='released-v591'&&hard.root.dataset.work12BootReason==='boot-watchdog');
check('boot:watchdog-event-v591',hard.events.some(event=>event.type==='divina:work12-boot-release'&&event.detail.version===591));
const manual=bootHarness();
manual.click();
check('boot:manual-opens',manual.home.classList.contains('active')&&manual.root.dataset.work12BootReason==='manual');
const healthy=bootHarness();
healthy.root.dataset.appShell='v180';
healthy.fire('divina:boot-ready');
healthy.runDelay(4500);
check('boot:healthy-never-bypassed',healthy.root.dataset.work12Boot==='ready-v591'&&!healthy.home.classList.contains('active'));

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

const {createWork12FoundationV589}=await import('./work12-foundation-v589.js?qa-v591-continuity');
const dispatch=(type,detail={})=>documentTarget.dispatchEvent(new CustomEvent(type,{detail}));
let bubbleSilences=0,messageSilences=0,delegateCalls=0;
const originalNavigate=()=>Promise.resolve('original');
const orbCore={navigate:originalNavigate,snapshot:()=>({oneLivingOrb:true,oneRenderer:true,onePhysics:true,entityPreserved:true})};
const universe={status:()=>({oneUniverseCanvas:true,essentialUniverseDuringTravel:true,oneRenderClock:true})};
const journey={status:()=>({travelerCopies:0,physicalOrbTransport:true,teleportFallback:false,portalVisual:false,flicker:false,heavyEffectsPausedDuringAnyTravel:true})};
const routeTransitions=[];
documentTarget.addEventListener('divina:work12-state',event=>routeTransitions.push(event.detail.state));
const navigate=async(route,options)=>{
  delegateCalls+=1;
  const from=documentTarget.body.dataset.screen;
  dispatch('divina:supreme-orb-will-navigate',{from,to:route,source:options?.source});
  dispatch('divina:orb-ios-journey-state',{state:'depart',route});
  dispatch('divina:orb-ios-journey-state',{state:'flight',route});
  documentTarget.body.dataset.screen=route;
  dispatch('divina:route-ready',{id:route});
  dispatch('divina:orb-ios-journey-state',{state:'arrival',route});
  dispatch('divina:orb-ios-journey-state',{state:'settle',route});
  dispatch('divina:orb-persistent-finished',{reason:'complete',route});
  dispatch('divina:supreme-orb-did-navigate',{from,to:route});
  return route;
};
const foundation=createWork12FoundationV589({
  orbCore,universe,journey,
  bubbles:{hide:()=>{bubbleSilences+=1;},status:()=>({simultaneousBubbles:1})},
  whit:{status:()=>({automaticSpeech:false})},
  messageGovernor:{release:()=>{messageSilences+=1;},status:()=>({navigationSilence:true})},
  navigate,eventTarget:documentTarget,documentElement:documentTarget.documentElement
});

check('foundation:health-before-travel',foundation.audit('v591-before').health==='ok');
check('foundation:single-navigation-authority',orbCore.navigate!==originalNavigate);
const tarotResult=await foundation.navigate('tarot',{source:'qa-v591'});
await flush();
check('journey:tarot-one-delegate',delegateCalls===1&&tarotResult==='tarot');
for(const state of ['DEPART','TRAVEL','ARRIVE','REVEAL']) check(`journey:tarot-${state.toLowerCase()}`,routeTransitions.includes(state));
check('journey:tarot-rest',foundation.snapshot().state==='REST'&&foundation.snapshot().route==='tarot');
check('journey:tarot-intention-dissolved',foundation.snapshot().activeIntentions===0);
check('journey:tarot-silence-before-motion',bubbleSilences>=1&&messageSilences>=1);

routeTransitions.length=0;
const homeResult=await foundation.navigate('home',{source:'qa-return'});
await flush();
check('journey:return-home',homeResult==='home'&&foundation.snapshot().route==='home'&&foundation.snapshot().state==='REST');
for(const state of ['DEPART','TRAVEL','ARRIVE','REVEAL']) check(`journey:return-${state.toLowerCase()}`,routeTransitions.includes(state));

routeTransitions.length=0;
const dailyResult=await foundation.navigate('daily',{source:'qa-daily'});
await flush();
check('journey:daily',dailyResult==='daily'&&foundation.snapshot().route==='daily'&&foundation.snapshot().state==='REST');
check('journey:three-delegates',delegateCalls===3);
check('journey:no-teleport',foundation.status().audit.checks.noTeleport===true);
check('journey:one-orb-one-universe',foundation.status().audit.checks.oneLivingOrb&&foundation.status().audit.checks.oneUniverse);
check('journey:no-copies',foundation.status().audit.checks.noTravelerCopies===true);

const session=await import('./tarot-session.js?qa-v591-continuity');
const {CARDS}=await import('./tarot-data.js?qa-v591-continuity');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v591-continuity',auditSeed:'work12-v591-continuity'});
const cards=[];
for(let index=0;index<78;index+=1){const draw=session.drawNextCard(tarotState,{now:()=>index+2});tarotState=draw.state;cards.push(draw.cardId);}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:orientation-direct',tarotState.normalOnly===true&&cards.every(id=>CARDS[id]?.orientation==='normal'));

const daily=await import('./daily-policy-v303.js?qa-v591-continuity');
const identity={scope:'device',digest:'591c0def'};
const moment=new Date('2026-09-19T15:00:00.000Z');
const recordA=daily.createDailyRecord('  propósito   e fé  ',moment,identity);
const recordB=daily.createDailyRecord('outra intenção',moment,identity);
const next=daily.createDailyRecord('',new Date('2026-09-20T15:00:00.000Z'),identity);
check('daily:same-day-same-card',recordA.id===recordB.id);
check('daily:next-cycle',recordA.date!==next.date&&recordA.id!==next.id);
check('daily:direct',recordA.orientation==='normal'&&recordA.reversed===false);
check('daily:intention-normalized',recordA.intention==='propósito e fé');
check('daily:record-valid',daily.isDailyRecord(recordA,recordA.date));

foundation.destroy();
check('foundation:authority-restored',orbCore.navigate===originalNavigate);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V591',work:'WORK12',macroStage:'3-of-10 / continuity-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
