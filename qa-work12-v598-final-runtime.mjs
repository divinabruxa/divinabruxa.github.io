/* DIVINA BRUXA — WORK12 · QA RUNTIME · FLUIDEZ SUPREMA FINAL V598 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});

class TestCustomEvent extends Event{
  constructor(type,options={}){super(type,options);this.detail=options.detail;}
}

class FakeNode extends EventTarget{
  constructor(tag='div',id=''){
    super();this.tagName=tag.toUpperCase();this.id=id;this.dataset={};this.children=[];this.parentElement=null;
    this.rel='';this.href='';this.attributes=new Map();
  }
  append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
  closest(selector){if(selector==='#orb'&&this.id==='orb')return this;return this.parentElement?.closest?.(selector)||null;}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.has(name)?this.attributes.get(name):null;}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();this.defaultView={CustomEvent:TestCustomEvent};this.documentElement=new FakeNode('html');
    this.body=new FakeNode('body');this.body.dataset.screen='home';this.head=new FakeNode('head');
    this.nodes=new Map();this.orb=new FakeNode('button','orb');this.canvas=new FakeNode('canvas','orbCanvas');
    this.orb.append(this.canvas);this.nodes.set('orb',this.orb);this.nodes.set('orbCanvas',this.canvas);
    const append=this.head.append.bind(this.head);
    this.head.append=(...nodes)=>{append(...nodes);for(const node of nodes)if(node.id)this.nodes.set(node.id,node);};
  }
  createElement(tag){return new FakeNode(tag);}
  getElementById(id){return this.nodes.get(id)||null;}
  querySelector(selector){
    if(selector==='#orb')return this.orb;
    if(selector.includes('.screen.active'))return{id:this.body.dataset.screen};
    return null;
  }
  querySelectorAll(selector){if(selector==='#orb')return[this.orb];if(selector==='#orbCanvas')return[this.canvas];return[];}
}

class FakeWindow extends EventTarget{
  constructor(){super();this.location={hash:'#home'};this.CustomEvent=TestCustomEvent;}
}

const makeTimers=()=>{
  let next=0;const pending=new Map();
  return{
    set(handler,delay){const id=++next;pending.set(id,{handler,delay});return id;},
    clear(id){pending.delete(id);},
    run(){for(const [id,timer] of [...pending]){pending.delete(id);timer.handler();}},
    count(){return pending.size;},
    delays(){return[...pending.values()].map(item=>item.delay);}
  };
};

const doc=new FakeDocument();
const win=new FakeWindow();
const timers=makeTimers();
const menuCalls=[];
const menu={open(){menuCalls.push('open');return Promise.resolve(true);},status(){return{state:'closed'};}};
const pulseCalls=[];
const orbCore={orb:doc.orb,pulse(...args){pulseCalls.push(args);}};
const journey={status(){return{travelerCopies:0,teleportFallback:false,flicker:false,heavyEffectsPausedDuringAnyTravel:true};}};
const intelligence={status(){return{state:'still'};}};
let currentMenu=menu;

globalThis.CustomEvent=TestCustomEvent;
const module=await import(`${pathToFileURL(path.join(root,'work12-final-continuity-v598.js')).href}?qa-runtime=v598`);
const final=module.createWork12FinalContinuityV598({
  orbCore,journey,intelligence,menuResolver:()=>currentMenu,
  documentTarget:doc,windowTarget:win,
  setTimer:(handler,delay)=>timers.set(handler,delay),clearTimer:id=>timers.clear(id)
});

check('boot:version',final.version===598);
check('boot:route-home',final.status().route==='home');
check('boot:presence-orb-only',final.status().presence==='orb-only');
check('boot:style-installed',doc.getElementById('divinaWork12FinalContinuityV598')?.href.includes('work12-final-continuity-v598.css'));
check('boot:dataset-final',doc.documentElement.dataset.work12Final==='v598');
check('boot:dataset-law',doc.documentElement.dataset.work12FinalLaw==='one-orb-one-universe-one-physics-one-presence');
check('boot:aria-grammar',doc.orb.getAttribute('aria-label')?.includes('Toque para chamar o universo'));
check('boot:no-timer',timers.count()===0);
check('contract:macro-ten',module.FINAL_CONTINUITY_CONTRACT_V598.macroStage==='10-of-10');
check('contract:home-only',module.FINAL_CONTINUITY_CONTRACT_V598.home==='universe-and-canonical-orb-only');
check('contract:one-two-intentions',module.FINAL_CONTINUITY_CONTRACT_V598.maximumVisibleIntentions===2);
check('contract:whit-inside',module.FINAL_CONTINUITY_CONTRACT_V598.whitResidence==='canonical-orb');
check('contract:whit-silent',module.FINAL_CONTINUITY_CONTRACT_V598.automaticWhitSpeech===false);

check('tap:schedules',final.onCanonicalOrbIntent('touch')===true);
check('tap:not-immediate',menuCalls.length===0);
check('tap:one-timer',timers.count()===1);
check('tap:delay-protects-double',timers.delays()[0]===470,timers.delays()[0]);
final.onCanonicalOrbIntent('touch');
check('tap:repeat-still-one-timer',timers.count()===1);
timers.run();
await Promise.resolve();
check('tap:opens-intentions',menuCalls.length===1);
check('tap:pulses-existing-orb',pulseCalls.length===1);
check('tap:counts-once',final.status().calls===1&&final.status().touchCalls===1);
check('tap:no-timer-after-response',timers.count()===0);

doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'opening'}}));
check('menu:presence-intentions',final.status().presence==='intentions');
check('menu:state-opening',final.status().menuState==='opening');
doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'closed'}}));
check('menu:returns-orb-only',final.status().presence==='orb-only');

final.onCanonicalOrbIntent('touch');
check('double:timer-armed',timers.count()===1);
final.onOrbClick({target:doc.orb,detail:2});
check('double:cancels-single',timers.count()===0);
check('double:counted',final.status().doubleTapCancellations===1);
check('double:does-not-open-menu',menuCalls.length===1);

final.onCanonicalOrbIntent('touch');
doc.dispatchEvent(new TestCustomEvent('divina:work12-state',{detail:{state:'TRAVEL'}}));
check('travel:cancels-pending',timers.count()===0);
check('travel:state',final.status().work12State==='TRAVEL');
check('travel:movement-cancelled',final.status().movementCancellations>=1);
check('travel:new-tap-refused',final.onCanonicalOrbIntent('touch')===false);
doc.dispatchEvent(new TestCustomEvent('divina:work12-state',{detail:{state:'REST'}}));

doc.body.dataset.screen='tarot';win.location.hash='#tarot';
doc.dispatchEvent(new TestCustomEvent('divina:route-ready',{detail:{id:'tarot'}}));
check('route:tarot',final.status().route==='tarot');
check('route:presence-reality',final.status().presence==='reality');
check('route:orb-intent-does-not-menu',final.onCanonicalOrbIntent('touch')===false);
check('route:no-timer',timers.count()===0);

doc.body.dataset.screen='home';win.location.hash='#home';
doc.dispatchEvent(new TestCustomEvent('divina:route-ready',{detail:{id:'home'}}));
currentMenu=null;
final.onCanonicalOrbIntent('touch');timers.run();
check('lazy:waits-for-menu',final.status().pendingMenuReady&&final.status().menuWaits===1);
check('lazy:no-fallback-interface',menuCalls.length===1);
currentMenu=menu;
doc.dispatchEvent(new TestCustomEvent('divina:orbital-menu-ready',{detail:{version:593}}));
await Promise.resolve();
check('lazy:opens-when-ready',menuCalls.length===2&&!final.status().pendingMenuReady);

doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'closed'}}));
let prevented=0,stopped=0;
const keyEvent={target:doc.orb,key:'Enter',repeat:false,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}};
check('keyboard:handled',final.onOrbKeyDown(keyEvent)===true);
await Promise.resolve();
check('keyboard:immediate-intentions',menuCalls.length===3);
check('keyboard:prevents-old-tarot-action',prevented===1&&stopped===1);
check('keyboard:counted',final.status().keyboardCalls===1);
check('keyboard:keyup',final.onOrbKeyUp({...keyEvent})===true);

const audit=final.audit();
check('audit:one-orb',audit.oneCanonicalOrb&&audit.canonicalOrbs===1);
check('audit:one-canvas',audit.oneCanonicalCanvas&&audit.canonicalCanvases===1);
check('audit:home-only',audit.homeOnlyUniverseAndOrb);
check('audit:no-duplicate-interface-orb',audit.duplicateInterfaceOrbsHidden);
check('audit:no-traveler-copy',audit.travelerCopies===0);
check('audit:no-teleport',audit.teleport===false);
check('audit:no-flicker',audit.flicker===false);
check('audit:travel-rests-effects',audit.heavyEffectsPausedDuringTravel===true);
check('audit:no-new-rendering',audit.newCanvases===0&&audit.newRenderers===0);
check('audit:no-loop-or-observer',audit.permanentAnimationLoops===0&&audit.mutationObservers===0);
check('audit:no-storage-network-model',audit.storageReads===0&&audit.storageWrites===0&&audit.apiCalls===0&&audit.modelCalls===0);
check('factory:singleton',module.createWork12FinalContinuityV598()===final);
check('destroy:first',final.destroy()===true);
check('destroy:second',final.destroy()===false);
check('destroy:dataset-removed',doc.documentElement.dataset.work12Final===undefined);
check('destroy:no-timer',timers.count()===0);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V598',work:'WORK12',macroStage:'10-of-10 / final-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{oneOrb:true,homeOnlyUniverseAndOrb:true,automaticWhitSpeech:false,maximumDeferredTimers:1},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;

