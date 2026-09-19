/* DIVINA BRUXA — WORK12 · QA RUNTIME · INTELIGÊNCIA DA EXPERIÊNCIA V597 */
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
  matches(selector){
    return selector.split(',').some(raw=>{
      const value=raw.trim();
      if(value==='input'||value==='textarea'||value==='select')return this.tagName===value.toUpperCase();
      if(value==='[contenteditable="true"]')return this.attributes.get('contenteditable')==='true';
      if(value==='[role="textbox"]')return this.attributes.get('role')==='textbox';
      return value.startsWith('#')&&this.id===value.slice(1);
    });
  }
  closest(selector){return this.matches(selector)?this:this.parentElement?.closest?.(selector)||null;}
  setAttribute(name,value){this.attributes.set(name,String(value));}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();this.defaultView={CustomEvent:TestCustomEvent};this.documentElement=new FakeNode('html');
    this.body=new FakeNode('body');this.body.dataset.screen='home';this.head=new FakeNode('head');
    this.visibilityState='visible';this.hidden=false;this.nodes=new Map();
    this.orb=new FakeNode('button','orb');this.canvas=new FakeNode('canvas','orbCanvas');this.orb.append(this.canvas);
    this.nodes.set('orb',this.orb);this.nodes.set('orbCanvas',this.canvas);
    const append=this.head.append.bind(this.head);
    this.head.append=(...nodes)=>{append(...nodes);for(const node of nodes)if(node.id)this.nodes.set(node.id,node);};
  }
  createElement(tag){return new FakeNode(tag);}
  getElementById(id){return this.nodes.get(id)||null;}
  querySelector(selector){if(selector.includes('.screen.active'))return{id:this.body.dataset.screen};return null;}
  querySelectorAll(selector){if(selector==='#orb')return[this.orb];if(selector==='#orbCanvas')return[this.canvas];return[];}
}

class FakeWindow extends EventTarget{
  constructor(){super();this.location={hash:'#home'};this.CustomEvent=TestCustomEvent;this.reduced=false;}
  matchMedia(){return{matches:this.reduced};}
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
const universeCalls=[];
const universe={
  paused:false,
  enterTravelBudget(reason,detail){universeCalls.push(['enter',reason,detail]);},
  leaveTravelBudget(reason,detail){universeCalls.push(['leave',reason,detail]);},
  pause(reason){this.paused=true;universeCalls.push(['pause',reason]);},
  start(reason){this.paused=false;universeCalls.push(['start',reason]);},
  status(){return{paused:this.paused};}
};
const presenceCalls=[];const speechCalls=[];
const presence={silence(...args){presenceCalls.push(args);},speak(...args){speechCalls.push(args);},offer(...args){speechCalls.push(args);}};
const soulCalls=[];const soul={setState(...args){soulCalls.push(args);}};

globalThis.CustomEvent=TestCustomEvent;
const module=await import(`${pathToFileURL(path.join(root,'experience-intelligence-v597.js')).href}?qa-runtime=v597`);
const intelligence=module.createExperienceIntelligenceV597({
  universe,presence,soul,documentTarget:doc,windowTarget:win,
  setTimer:(handler,delay)=>timers.set(handler,delay),clearTimer:id=>timers.clear(id)
});

check('boot:version',intelligence.version===597);
check('boot:state-still',intelligence.status().state==='still');
check('boot:route-home',intelligence.status().route==='home');
check('boot:context-silence',intelligence.status().context.intention==='silence');
check('boot:style-installed',doc.getElementById('divinaExperienceIntelligenceV597')?.href.includes('experience-intelligence-v597.css'));
check('boot:dataset-installed',doc.documentElement.dataset.experienceIntelligence==='v597');
check('boot:whit-silent',presenceCalls.length===1&&speechCalls.length===0);
check('boot:soul-in-orb',soulCalls.length===1&&soulCalls[0][2]?.radiate===false);
check('boot:no-timer',timers.count()===0);

doc.dispatchEvent(new TestCustomEvent('divina:route-start',{detail:{to:'tarot'}}));
check('travel:state-moving',intelligence.status().state==='moving');
check('travel:budget-essential',intelligence.status().budget==='essential');
check('travel:destination',intelligence.status().destination==='tarot');
check('travel:existing-budget-entered',universeCalls.filter(call=>call[0]==='enter').length===1);
check('travel:whit-traveling',soulCalls.at(-1)?.[0]==='traveling');
check('travel:no-speech',speechCalls.length===0);
doc.dispatchEvent(new TestCustomEvent('divina:work12-state',{detail:{state:'TRAVEL',destination:'tarot'}}));
check('travel:duplicate-event-no-double-budget',universeCalls.filter(call=>call[0]==='enter').length===1);

doc.body.dataset.screen='tarot';win.location.hash='#tarot';
doc.dispatchEvent(new TestCustomEvent('divina:route-ready',{detail:{id:'tarot'}}));
check('arrival:state-settling',intelligence.status().state==='settling');
check('arrival:budget-quiet',intelligence.status().budget==='quiet');
check('arrival:context-ritual',intelligence.status().context.intention==='ritual');
check('arrival:one-timer',timers.count()===1&&intelligence.status().timerActive);
check('arrival:travel-budget-left',universeCalls.filter(call=>call[0]==='leave').length===1);
timers.run();
check('arrival:settles-still',intelligence.status().state==='still');
check('arrival:budget-normal',intelligence.status().budget==='normal');
check('arrival:timer-cleared',timers.count()===0&&!intelligence.status().timerActive);

doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'open'}}));
check('menu:listening',intelligence.status().state==='listening');
check('menu:quiet',intelligence.status().budget==='quiet');
check('menu:no-timer',timers.count()===0);
doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'closed'}}));
check('menu:close-one-settle',timers.count()===1);
doc.dispatchEvent(new TestCustomEvent('divina:menu-state',{detail:{state:'closed'}}));
check('menu:repeat-still-one-settle',timers.count()===1);
timers.run();

doc.dispatchEvent(new TestCustomEvent('divina:reading-ritual-phase',{detail:{phase:'symbol'}}));
check('ritual:symbol-listening',intelligence.status().state==='listening');
doc.dispatchEvent(new TestCustomEvent('divina:reading-ritual-phase',{detail:{phase:'essence'}}));
check('ritual:essence-reflecting',soulCalls.at(-1)?.[0]==='reflecting');
check('ritual:silence-only',speechCalls.length===0);

const input=new FakeNode('input');
Object.defineProperty(input,'value',{get(){throw new Error('private-value-read');}});
check('focus:control-recognized',intelligence.onFocusIn({target:input})===true);
check('focus:state',intelligence.status().state==='focus');
check('focus:quiet',intelligence.status().budget==='quiet');
check('focus:no-value-read',intelligence.status().focusSessions===1);
check('focus:no-speech',speechCalls.length===0);
intelligence.onFocusOut({target:input});
check('focus:exit-one-settle',timers.count()===1);
timers.run();

doc.body.dataset.screen='journal';win.location.hash='#journal';
doc.dispatchEvent(new TestCustomEvent('divina:reality-depth',{detail:{route:'journal'}}));
check('depth:journal-context',intelligence.status().route==='journal'&&intelligence.status().context.intention==='intimacy');
check('depth:privacy-protected',intelligence.status().context.privacy==='protected');
check('depth:listening',intelligence.status().state==='listening');
check('depth:no-private-read',intelligence.audit().privateContentReads===0&&intelligence.audit().formValueReads===0);

doc.visibilityState='hidden';doc.hidden=true;
doc.dispatchEvent(new TestCustomEvent('visibilitychange'));
check('visibility:resting',intelligence.status().state==='resting'&&intelligence.status().budget==='sleeping');
check('visibility:universe-paused',universe.paused&&universeCalls.some(call=>call[0]==='pause'));
check('visibility:no-settle',timers.count()===0);
doc.visibilityState='visible';doc.hidden=false;
doc.dispatchEvent(new TestCustomEvent('visibilitychange'));
check('visibility:universe-resumed',!universe.paused&&universeCalls.some(call=>call[0]==='start'));
check('visibility:single-settle',timers.count()===1);
timers.run();

win.dispatchEvent(new Event('pagehide'));
check('lifecycle:pagehide-suspends-even-visible',intelligence.status().hidden&&intelligence.status().state==='resting');
check('lifecycle:pagehide-pauses',universe.paused);
doc.visibilityState='visible';doc.hidden=false;win.dispatchEvent(new Event('pageshow'));
check('lifecycle:pageshow-resumes',!intelligence.status().hidden&&!universe.paused);
timers.run();

doc.dispatchEvent(new TestCustomEvent('divina:visual-quality',{detail:{tier:'protected'}}));
check('quality:protected',intelligence.status().quality==='protected');
check('quality:dataset',doc.documentElement.dataset.experienceQuality==='protected');

const audit=intelligence.audit();
check('audit:one-orb',audit.oneCanonicalOrb&&audit.canonicalOrbs===1);
check('audit:one-canvas',audit.oneCanonicalCanvas&&audit.canonicalCanvases===1);
check('audit:no-second-body',audit.separateWhitBody===false);
check('audit:no-new-engine',audit.newCanvases===0&&audit.newRenderers===0);
check('audit:no-loops',audit.permanentAnimationLoops===0&&audit.mutationObservers===0);
check('audit:no-storage',audit.storageReads===0&&audit.storageWrites===0);
check('audit:no-model-or-api',audit.modelCalls===0&&audit.apiCalls===0);
check('contract:one-deferred-timer',intelligence.status().oneDeferredTimer===true&&audit.deferredTimersMaximum===1);
check('contract:auto-whit-false',intelligence.status().automaticWhitSpeech===false&&speechCalls.length===0);
check('factory:singleton',module.createExperienceIntelligenceV597()===intelligence);
check('destroy:first-true',intelligence.destroy()===true);
check('destroy:second-false',intelligence.destroy()===false);
check('destroy:dataset-removed',doc.documentElement.dataset.experienceIntelligence===undefined);
check('destroy:no-timer',timers.count()===0);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V597',work:'WORK12',macroStage:'9-of-10 / intelligence-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{oneOrb:true,oneUniverse:true,automaticWhitSpeech:false,privateContentReads:0,maximumDeferredTimers:1},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
