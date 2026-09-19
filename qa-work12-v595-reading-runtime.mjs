/* DIVINA BRUXA — WORK12 · QA RUNTIME · LEITURAS COMO RITO V595 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});
const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));

class TestCustomEvent extends Event{
  constructor(type,options={}){super(type,options);this.detail=options.detail;}
}

class ClassList{
  constructor(...values){this.values=new Set(values.filter(Boolean));}
  add(...values){values.forEach(value=>this.values.add(value));}
  remove(...values){values.forEach(value=>this.values.delete(value));}
  contains(value){return this.values.has(value);}
  toggle(value,force){const next=force===undefined?!this.values.has(value):Boolean(force);if(next)this.values.add(value);else this.values.delete(value);return next;}
}

class FakeElement extends EventTarget{
  constructor(tag='div',{id='',classes=[]}={}){
    super();this.tagName=tag.toUpperCase();this.id=id;this.dataset={};this.classList=new ClassList(...classes);
    this.children=[];this.parentElement=null;this.hidden=false;this.textContent='';this.attributes=new Map();this.removed=false;
  }
  append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
  insertBefore(node,before){node.parentElement=this;const index=this.children.indexOf(before);if(index<0)this.children.push(node);else this.children.splice(index,0,node);}
  insertAdjacentElement(position,node){if(position==='afterend'&&this.parentElement){const siblings=this.parentElement.children;const index=siblings.indexOf(this);node.parentElement=this.parentElement;siblings.splice(index+1,0,node);return node;}this.append(node);return node;}
  remove(){this.removed=true;if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(item=>item!==this);}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  removeAttribute(name){this.attributes.delete(name);}
  contains(node){if(node===this)return true;return this.children.some(child=>child.contains?.(node));}
  closest(selector){
    if(selector==='[data-reading-breath]'&&this.dataset.readingBreath)return this;
    if(selector==='[data-reading-depth-call]'&&this.dataset.readingDepthCall)return this;
    if(selector==='#orb'&&this.id==='orb')return this;
    return this.parentElement?.closest?.(selector)||null;
  }
  querySelector(selector){
    const match=node=>{
      if(selector==='.tl517__stage')return node.classList.contains('tl517__stage');
      if(selector==='[data-current-card]')return Object.hasOwn(node.dataset,'currentCard');
      if(selector==='[data-signal]')return Object.hasOwn(node.dataset,'signal');
      if(selector==='[data-daily-constellation]')return Object.hasOwn(node.dataset,'dailyConstellation');
      if(selector==='[data-daily-layer-panel]')return Object.hasOwn(node.dataset,'dailyLayerPanel');
      const depth=selector.match(/^\[data-reading-depth-call="(tarot|daily)"\]$/);
      if(depth)return node.dataset.readingDepthCall===depth[1];
      return false;
    };
    const visit=node=>{for(const child of node.children){if(match(child))return child;const found=visit(child);if(found)return found;}return null;};
    return visit(this);
  }
  scrollIntoView(){this.scrolled=true;}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();
    this.documentElement=new FakeElement('html');
    this.body=new FakeElement('body');
    this.body.dataset.screen='tarot';
    this.visibilityState='visible';
    this.hidden=false;
    this.nodesById=new Map();
    this.head=new FakeElement('head');
    const append=this.head.append.bind(this.head);
    this.head.append=(...nodes)=>{append(...nodes);for(const node of nodes)if(node.id)this.nodesById.set(node.id,node);};
  }
  createElement(tag){return new FakeElement(tag);}
  getElementById(id){return this.nodesById.get(id)||null;}
  querySelector(selector){
    if(selector==='#tarot .tl517')return this.tarotWorld||null;
    if(selector==='#dailyCard .dw509')return this.dailyWorld||null;
    return null;
  }
  querySelectorAll(selector){
    if(selector==='#orb')return this.orb?[this.orb]:[];
    if(selector==='#orbCanvas')return this.canvas?[this.canvas]:[];
    return [];
  }
}

class FakeWindow extends EventTarget{
  constructor(){super();this.location={hash:'#tarot'};}
  matchMedia(){return{matches:true};}
}

function fixture(){
  const documentTarget=new FakeDocument();
  const windowTarget=new FakeWindow();
  const tarotWorld=new FakeElement('section',{classes:['tl517']});
  const tarotStage=new FakeElement('div',{classes:['tl517__stage']});
  const tarotCard=new FakeElement('div');tarotCard.dataset.currentCard='';tarotCard.dataset.empty='false';
  const tarotSignal=new FakeElement('p');tarotSignal.dataset.signal='';
  tarotStage.append(tarotCard,tarotSignal);tarotWorld.append(tarotStage);
  const dailyWorld=new FakeElement('section',{classes:['dw509','is-revealed']});dailyWorld.dataset.state='revealed';
  const dailyConstellation=new FakeElement('nav');dailyConstellation.dataset.dailyConstellation='';
  const dailyPanel=new FakeElement('article');dailyPanel.dataset.dailyLayerPanel='';
  dailyWorld.append(dailyConstellation,dailyPanel);
  const orb=new FakeElement('button',{id:'orb'});const canvas=new FakeElement('canvas',{id:'orbCanvas'});
  documentTarget.tarotWorld=tarotWorld;documentTarget.dailyWorld=dailyWorld;documentTarget.orb=orb;documentTarget.canvas=canvas;
  documentTarget.nodesById.set('orb',orb);documentTarget.nodesById.set('orbCanvas',canvas);
  const goCalls=[];const soulCalls=[];const silenceCalls=[];const universeCalls=[];
  const go=(id,options)=>{goCalls.push({id,options});return true;};
  const soul={setState(...args){soulCalls.push(args);},status(){return{canonicalOrbOnly:true};}};
  const presence={silence(...args){silenceCalls.push(args);},status(){return{residence:'canonical-orb'};}};
  const universe={paused:false,pause(){this.paused=true;universeCalls.push('pause');},start(){this.paused=false;universeCalls.push('start');},status(){return{paused:this.paused};}};
  const foundation={state:'REST',status(){return{state:this.state};}};
  return{documentTarget,windowTarget,tarotWorld,tarotCard,tarotSignal,dailyWorld,dailyPanel,orb,canvas,go,goCalls,soul,soulCalls,presence,silenceCalls,universe,universeCalls,foundation};
}

globalThis.CustomEvent=TestCustomEvent;
const fx=fixture();
globalThis.document=fx.documentTarget;
globalThis.window=fx.windowTarget;
globalThis.matchMedia=()=>({matches:true});
globalThis.divinaTarotLivreV517={state:{revealed:[7],waiting:Array.from({length:77},(_,index)=>index+1),completed:false},selected:0};
globalThis.divinaDailyWorldV509={aurora:{active:true,setActive(value){this.active=Boolean(value);}},snapshot(){return{onePerDay:true,normalOnly:true};}};

const moduleUrl=`${pathToFileURL(path.join(root,'reading-ritual-core-v595.js')).href}?qa=v595-runtime-${Date.now()}`;
const { createReadingRitualCoreV595 }=await import(moduleUrl);
const ritual=createReadingRitualCoreV595({
  go:fx.go,soul:fx.soul,presence:fx.presence,universe:fx.universe,foundation:fx.foundation,
  documentTarget:fx.documentTarget,windowTarget:fx.windowTarget
});

check('boot:version',ritual.version===595);
check('boot:identity',fx.documentTarget.documentElement.dataset.readingRitual==='v595');
check('boot:one-state-machine',ritual.status().oneDeferredTimer===true);
check('boot:two-worlds-attached',ritual.audit().attachedWorlds===2,ritual.audit().attachedWorlds);
check('boot:one-control-each',ritual.audit().depthControls===2,ritual.audit().depthControls);
check('boot:one-orb-one-canvas',ritual.audit().oneCanonicalOrb&&ritual.audit().oneCanonicalCanvas);

await wait(240);
check('tarot:sequence-reaches-essence',ritual.status().phase==='essence',ritual.status().phase);
check('tarot:symbol-first',ritual.status().completedSequences===1,ritual.status().completedSequences);
check('tarot:signal-minimal',fx.tarotSignal.textContent==='Ela chegou.',fx.tarotSignal.textContent);
check('tarot:depth-control-visible',ritual.control('tarot')?.closest('[data-reading-breath]')?.hidden===false);
check('tarot:whit-silent-timing',fx.silenceCalls.length>=2&&fx.soulCalls.some(call=>call[0]==='reflecting'));
check('tarot:universe-paused-and-resumed',fx.universeCalls.includes('pause')&&fx.universeCalls.includes('start'),fx.universeCalls.join(','));

check('tarot:depth-called',ritual.requestDepth('tarot')===true);
check('tarot:depth-travels-library',fx.goCalls.length===1&&fx.goCalls[0].id==='library'&&fx.goCalls[0].options.cardId===7,JSON.stringify(fx.goCalls));
check('tarot:no-meaning-in-ritual',ritual.status().tarotAutomaticMeanings===false);

const opened=[];
globalThis.divinaLibraryWorldV302={openReader:id=>opened.push(id)};
fx.documentTarget.body.dataset.screen='library';fx.windowTarget.location.hash='#library';
ritual.onRouteReady({detail:{id:'library'}});
await Promise.resolve();
check('tarot:explicit-depth-opens-card',opened.join(',')==='7',opened.join(','));

fx.documentTarget.body.dataset.screen='daily';fx.windowTarget.location.hash='#daily';
ritual.onRouteReady({detail:{id:'daily'}});
await wait(240);
check('daily:sequence-reaches-essence',ritual.status().phase==='essence',ritual.status().phase);
check('daily:aurora-resumes-after-essence',globalThis.divinaDailyWorldV509.aurora.active===true);
check('daily:control-is-one-word',ritual.control('daily')?.textContent==='Mergulhar',ritual.control('daily')?.textContent);
check('daily:explicit-depth',ritual.requestDepth('daily')===true&&ritual.status().phase==='depth');
check('daily:expanded-semantic',ritual.control('daily')?.getAttribute('aria-expanded')==='true');
check('daily:depth-scrolls-vertically',fx.dailyPanel.scrolled===true);
check('daily:recollects',ritual.requestDepth('daily')===true&&ritual.status().phase==='essence');
check('daily:whit-never-speaks',ritual.status().automaticWhitSpeech===false);

fx.documentTarget.body.dataset.screen='tarot';fx.windowTarget.location.hash='#tarot';
ritual.begin('tarot','qa-travel');ritual.reveal('tarot','qa-travel');
ritual.onWork12State(new TestCustomEvent('divina:work12-state',{detail:{state:'DEPART'}}));
await wait(240);
check('travel:cancels-sequence',ritual.status().phase==='travel'&&!ritual.status().timerActive,JSON.stringify(ritual.status()));
check('travel:effects-remain-quiet',fx.documentTarget.documentElement.dataset.readingRitualEffects==='quiet');

ritual.onWork12State(new TestCustomEvent('divina:work12-state',{detail:{state:'REST'}}));
ritual.onRouteReady({detail:{id:'tarot'}});
await wait(240);
ritual.begin('tarot','qa-menu');ritual.reveal('tarot','qa-menu');
ritual.onMenuState(new TestCustomEvent('divina:menu-state',{detail:{state:'open'}}));
check('menu:interruption-safe',ritual.status().phase==='essence'&&!ritual.status().timerActive,JSON.stringify(ritual.status()));
ritual.onMenuState(new TestCustomEvent('divina:menu-state',{detail:{state:'closed'}}));

check('privacy:no-runtime-reads',ritual.audit().privateContentReads===0&&ritual.audit().storageReads===0&&ritual.audit().apiCalls===0);
check('performance:no-runtime-engines',ritual.audit().newCanvases===0&&ritual.audit().permanentAnimationLoops===0&&ritual.audit().mutationObservers===0);
check('destroy:completed',ritual.destroy()===true);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V595',work:'WORK12',macroStage:'7-of-10 / reading-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{sequence:['symbol','silence','essence','depth-on-request'],automaticWhitSpeech:false,duplicateOrbs:0},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;

