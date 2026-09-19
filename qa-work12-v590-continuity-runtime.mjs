import fs from 'node:fs';
import vm from 'node:vm';

class TestCustomEvent extends Event {
  constructor(type,options = {}) { super(type,options); this.detail=options.detail; }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({id,pass:Boolean(condition),detail:condition?'':detail});
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise(resolve => setTimeout(resolve,0));
};

const indexSource = fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const bootScript = [...indexSource.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .map(match => match[2])
  .find(body => body.includes('divina:work12-boot-release'));

function bootHarness() {
  const timers = new Map();
  const windowListeners = new Map();
  const events = [];
  let timerId = 0;
  const classList = () => {
    const values = new Set();
    return {add:(...items)=>items.forEach(item=>values.add(item)),remove:(...items)=>items.forEach(item=>values.delete(item)),contains:item=>values.has(item)};
  };
  const style = () => {
    const values = new Map();
    return {setProperty:(name,value)=>values.set(name,value),removeProperty:name=>values.delete(name)};
  };
  const node = () => ({
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
    addEventListener:(type,handler)=>{if(!windowListeners.has(type))windowListeners.set(type,[]);windowListeners.get(type).push(handler);},
    removeEventListener:(type,handler)=>windowListeners.set(type,(windowListeners.get(type)||[]).filter(item=>item!==handler))
  };
  context.window=context;
  context.dispatchEvent=event=>{for(const handler of windowListeners.get(event.type)||[])handler(event);return true;};
  vm.runInContext(bootScript,vm.createContext(context),{filename:'work12-inline-boot-v590.js'});
  const runDelay=delay=>{for(const [id,timer] of [...timers]){if(timer.delay!==delay)continue;timers.delete(id);timer.handler();}};
  const fire=type=>{for(const handler of windowListeners.get(type)||[])handler({type});};
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
check('boot:watchdog-v590',hard.root.dataset.work12Boot==='released-v590'&&hard.root.dataset.work12BootReason==='boot-watchdog');
check('boot:watchdog-event-v590',hard.events.some(event=>event.type==='divina:work12-boot-release'&&event.detail.version===590));
const manual=bootHarness();
manual.click();
check('boot:manual-opens',manual.home.classList.contains('active')&&manual.root.dataset.work12BootReason==='manual');
const healthy=bootHarness();
healthy.root.dataset.appShell='v180';
healthy.fire('divina:boot-ready');
healthy.runDelay(4500);
check('boot:healthy-never-bypassed',healthy.root.dataset.work12Boot==='ready-v590'&&!healthy.home.classList.contains('active'));

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

const {createWork12FoundationV589}=await import('./work12-foundation-v589.js?qa-v590-continuity');
const dispatch=(type,detail={})=>documentTarget.dispatchEvent(new CustomEvent(type,{detail}));
let bubbleSilences=0,messageSilences=0,delegateCalls=0;
const originalNavigate=()=>Promise.resolve('original');
const orbCore={navigate:originalNavigate,snapshot:()=>({oneLivingOrb:true,renderer:'existing-v208'})};
const universe={status:()=>({oneUniverseCanvas:true,essentialUniverseDuringTravel:true,oneRenderClock:true})};
const journey={status:()=>({travelerCopies:0,teleportFallback:false,portalVisual:false,heavyEffectsPausedDuringAnyTravel:true})};
const navigate=async(route,options)=>{
  delegateCalls+=1;
  dispatch('divina:supreme-orb-will-navigate',{from:documentTarget.body.dataset.screen,to:route,source:options?.source});
  dispatch('divina:orb-ios-journey-state',{state:'depart',route});
  dispatch('divina:orb-ios-journey-state',{state:'flight',route});
  documentTarget.body.dataset.screen=route;
  dispatch('divina:route-ready',{id:route});
  dispatch('divina:orb-ios-journey-state',{state:'arrival',route});
  dispatch('divina:orb-ios-journey-state',{state:'settle',route});
  dispatch('divina:orb-persistent-finished',{reason:'complete',route});
  dispatch('divina:supreme-orb-did-navigate',{from:'home',to:route});
  return route;
};
const foundation=createWork12FoundationV589({
  orbCore,universe,journey,
  bubbles:{hide:()=>{bubbleSilences+=1;},status:()=>({simultaneousBubbles:1})},
  whit:{status:()=>({automaticSpeech:false})},
  messageGovernor:{release:()=>{messageSilences+=1;},status:()=>({navigationSilence:true})},
  navigate,eventTarget:documentTarget,documentElement:documentTarget.documentElement
});

check('foundation:health-before-travel',foundation.audit('v590-before').health==='ok');
check('foundation:single-authority',orbCore.navigate!==originalNavigate);
const result=await foundation.navigate('tarot',{source:'qa-v590'});
await flush();
const states=foundation.timeline.map(item=>item.state);
check('journey:one-delegate',delegateCalls===1&&result==='tarot');
for(const state of ['DEPART','TRAVEL','ARRIVE','REVEAL'])check(`journey:${state.toLowerCase()}`,states.includes(state));
check('journey:returns-rest',foundation.snapshot().state==='REST');
check('journey:route-committed',foundation.snapshot().route==='tarot');
check('journey:intention-dissolved',foundation.snapshot().activeIntentions===0);
check('journey:silence-before-motion',bubbleSilences>=1&&messageSilences>=1);
check('journey:no-teleport',foundation.status().audit.checks.noTeleport===true);
check('journey:one-orb-one-universe',foundation.status().audit.checks.oneLivingOrb&&foundation.status().audit.checks.oneUniverse);

const session=await import('./tarot-session.js?qa-v590');
const {CARDS}=await import('./tarot-data.js?qa-v590');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v590',auditSeed:'work12-v590'});
const cards=[];
for(let index=0;index<78;index+=1){const draw=session.drawNextCard(tarotState,{now:()=>index+2});tarotState=draw.state;cards.push(draw.cardId);}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:orientation-direct',tarotState.normalOnly===true&&cards.every(id=>CARDS[id]?.orientation==='normal'));

const daily=await import('./daily-policy-v303.js?qa-v590');
const identity={scope:'device',digest:'1234abcd'};
const moment=new Date('2026-09-19T15:00:00.000Z');
const recordA=daily.createDailyRecord('  clareza   e amor  ',moment,identity);
const recordB=daily.createDailyRecord('outra intenção',moment,identity);
const next=daily.createDailyRecord('',new Date('2026-09-20T15:00:00.000Z'),identity);
check('daily:same-day-same-card',recordA.id===recordB.id);
check('daily:one-new-cycle-next-day',recordA.date!==next.date&&recordA.id!==next.id);
check('daily:orientation-direct',recordA.orientation==='normal'&&recordA.reversed===false);
check('daily:intention-normalized',recordA.intention==='clareza e amor');
check('daily:record-valid',daily.isDailyRecord(recordA,recordA.date));

foundation.destroy();
check('foundation:authority-restored',orbCore.navigate===originalNavigate);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V590',work:'WORK12',macroStage:'2-of-10 / continuidade-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
