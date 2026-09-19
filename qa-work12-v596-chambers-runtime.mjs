/* DIVINA BRUXA — WORK12 · QA RUNTIME · REALIDADES COMO CÂMARAS V596 */
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

const dataKey=name=>name.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());

class FakeElement extends EventTarget{
  constructor(tag='div',{id='',classes=[]}={}){
    super();this.tagName=tag.toUpperCase();this.id=id;this.dataset={};this.classList=new ClassList(...classes);
    this.children=[];this.parentElement=null;this.parentNode=null;this.hidden=false;this.textContent='';this.attributes=new Map();this.removed=false;this.scrolled=false;
  }
  get isConnected(){return !this.removed;}
  get nextSibling(){if(!this.parentElement)return null;const index=this.parentElement.children.indexOf(this);return this.parentElement.children[index+1]||null;}
  append(...nodes){for(const node of nodes){if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(item=>item!==node);node.parentElement=this;node.parentNode=this;this.children.push(node);}}
  insertBefore(node,before){if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(item=>item!==node);node.parentElement=this;node.parentNode=this;const index=this.children.indexOf(before);if(index<0)this.children.push(node);else this.children.splice(index,0,node);return node;}
  insertAdjacentElement(position,node){if(position==='afterend'&&this.parentElement){const siblings=this.parentElement.children;const index=siblings.indexOf(this);node.parentElement=this.parentElement;node.parentNode=this.parentElement;siblings.splice(index+1,0,node);return node;}this.append(node);return node;}
  remove(){this.removed=true;if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(item=>item!==this);}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  removeAttribute(name){this.attributes.delete(name);}
  contains(node){if(node===this)return true;return this.children.some(child=>child.contains?.(node));}
  matches(selector){
    return selector.split(',').some(raw=>{
      const value=raw.trim();
      if(!value)return false;
      if(value==='button'||value==='a'||value==='summary')return this.tagName===value.toUpperCase();
      if(value.startsWith('#'))return this.id===value.slice(1);
      if(value.startsWith('.'))return this.classList.contains(value.slice(1));
      const data=value.match(/^\[data-([a-z0-9-]+)(?:="([^"]*)")?\]$/i);
      if(data){const key=dataKey(`data-${data[1]}`);return Object.hasOwn(this.dataset,key)&&(data[2]===undefined||String(this.dataset[key])===data[2]);}
      return false;
    });
  }
  closest(selector){return this.matches(selector)?this:this.parentElement?.closest?.(selector)||null;}
  querySelector(selector){
    if(selector===':scope > .db585-intent-threshold [data-v585-orb-host]'){
      const threshold=this.children.find(child=>child.classList.contains('db585-intent-threshold'));
      return threshold?.querySelector('[data-v585-orb-host]')||null;
    }
    const visit=node=>{for(const child of node.children){if(child.matches(selector))return child;const found=visit(child);if(found)return found;}return null;};
    return visit(this);
  }
  querySelectorAll(selector){
    const found=[];
    const visit=node=>{for(const child of node.children){if(child.matches(selector))found.push(child);visit(child);}};
    visit(this);return found;
  }
  scrollIntoView(){this.scrolled=true;}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();this.documentElement=new FakeElement('html');this.body=new FakeElement('body');this.body.dataset.screen='school';
    this.visibilityState='visible';this.head=new FakeElement('head');this.screens=new Map();this.nodesById=new Map();
    const append=this.head.append.bind(this.head);
    this.head.append=(...nodes)=>{append(...nodes);for(const node of nodes)if(node.id)this.nodesById.set(node.id,node);};
  }
  createElement(tag){return new FakeElement(tag);}
  getElementById(id){return this.nodesById.get(id)||this.screens.get(id)||null;}
  querySelector(selector){if(selector.includes('.screen.active'))return this.screens.get(this.body.dataset.screen)||null;return null;}
  querySelectorAll(selector){
    if(selector==='#orb')return this.orb?[this.orb]:[];
    if(selector==='#orbCanvas')return this.canvas?[this.canvas]:[];
    const found=[];for(const screen of this.screens.values())found.push(...screen.querySelectorAll(selector));return found;
  }
}

class FakeWindow extends EventTarget{
  constructor(){super();this.location={hash:'#school'};}
  matchMedia(){return{matches:true};}
}

const node=(tag,id='',classes=[])=>new FakeElement(tag,{id,classes});
const button=(dataName,value='')=>{const item=node('button');item.dataset[dataName]=value;return item;};

function makeScreen(route){
  const screen=node('section',route,['screen','active']);
  const threshold=node('header','',['db585-intent-threshold']);
  const host=node('div');host.dataset.v585OrbHost='true';threshold.append(host);
  const appId={school:'schoolApp',journal:'journalApp',consultations:'consultationApp',store:'storeApp'}[route];
  const app=node('div',appId);screen.append(threshold,app);
  return{screen,threshold,host,app};
}

function fixture(){
  const documentTarget=new FakeDocument();const windowTarget=new FakeWindow();
  const screens={};
  for(const route of ['school','journal','consultations','store']){
    screens[route]=makeScreen(route);documentTarget.screens.set(route,screens[route].screen);documentTarget.nodesById.set(screens[route].app.id,screens[route].app);
  }

  const schoolContinue=button('schoolContinue');const schoolCompass=node('section','',['school-v555-compass']);
  screens.school.app.append(schoolContinue,schoolCompass);
  const journalWrite=button('jwvWrite');const journalMirror=button('jwvMirror');const journalCalendar=button('jwvCalendar');
  screens.journal.app.append(journalWrite,journalMirror,journalCalendar);
  const service=button('service','mesa-real-profissional');const tracking=button('openTracking');
  screens.consultations.app.append(service,tracking);
  const storeShell=node('div','',['store-v148-shell']);const amazon=node('section','amazonStoreCoreV543');
  const storeCollection=button('collection','tarot-estudo');amazon.append(storeCollection);
  const catalog=node('section','',['store-v148-catalog']);const heading=node('header','',['store-v148-section-heading']);catalog.append(heading);
  storeShell.append(amazon,catalog);screens.store.app.append(storeShell);

  const orb=node('button','orb');const canvas=node('canvas','orbCanvas');orb.append(canvas);documentTarget.orb=orb;documentTarget.canvas=canvas;
  documentTarget.nodesById.set('orb',orb);documentTarget.nodesById.set('orbCanvas',canvas);

  const claims=[];const universeCalls=[];const silenceCalls=[];const soulCalls=[];
  const orbCore={
    claim(host,options){claims.push({host,options});host.append(orb);return()=>false;}
  };
  const universe={paused:false,pause(){this.paused=true;universeCalls.push('pause');},start(){this.paused=false;universeCalls.push('start');},status(){return{paused:this.paused};}};
  const foundation={state:'REST',status(){return{state:this.state};}};
  const presence={silence(...args){silenceCalls.push(args);}};
  const soul={setState(...args){soulCalls.push(args);}};
  return{documentTarget,windowTarget,screens,schoolContinue,schoolCompass,journalWrite,journalMirror,journalCalendar,service,tracking,storeCollection,catalog,heading,orb,canvas,orbCore,claims,universe,universeCalls,foundation,presence,silenceCalls,soul,soulCalls};
}

const captureEvent=target=>({target,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}});

globalThis.CustomEvent=TestCustomEvent;
const fx=fixture();
globalThis.document=fx.documentTarget;
globalThis.window=fx.windowTarget;
globalThis.matchMedia=()=>({matches:true});

const module=await import(`${pathToFileURL(path.join(root,'reality-chambers-v596.js')).href}?qa-runtime=v596`);
const chambers=new module.RealityChambersV596({
  orbCore:fx.orbCore,
  universe:fx.universe,
  foundation:fx.foundation,
  presence:fx.presence,
  soul:fx.soul,
  documentTarget:fx.documentTarget,
  windowTarget:fx.windowTarget
});
await Promise.resolve();

check('boot:version',chambers.version===596);
check('boot:four-chambers',chambers.audit().chambers===4,JSON.stringify(chambers.audit()));
check('boot:school-path-added',Boolean(fx.screens.school.screen.querySelector('[data-db596-school-paths]')));
check('boot:store-return-added',Boolean(fx.screens.store.screen.querySelector('[data-db596-store-return]')));
check('boot:only-two-added-controls',chambers.audit().addedIntentions===2,chambers.audit().addedIntentions);
check('boot:one-orb',chambers.audit().oneCanonicalOrb&&chambers.audit().duplicateOrbs===0);
check('boot:one-canvas',chambers.audit().oneCanonicalCanvas);
check('boot:orb-at-school-threshold',fx.screens.school.host.contains(fx.orb));
check('boot:threshold-state',chambers.status().state==='threshold');

chambers.onDepth(new TestCustomEvent('divina:reality-depth',{detail:{route:'school'}}));
check('school:awakening-first',chambers.status().state==='awakening');
check('school:effects-quiet',fx.documentTarget.documentElement.dataset.realityChamberEffects==='quiet');
await wait(70);
check('school:present-after-silence',chambers.status().state==='present',JSON.stringify(chambers.status()));
check('school:entry-scrolls',fx.screens.school.app.scrolled===true);
check('school:effects-resume',fx.documentTarget.documentElement.dataset.realityChamberEffects==='rest');
check('school:orb-never-left-threshold',fx.screens.school.host.contains(fx.orb));

const paths=fx.screens.school.screen.querySelector('[data-db596-school-paths]');
const pathsEvent=captureEvent(paths);chambers.handleCapture(pathsEvent);
check('school:paths-explicit',chambers.status().state==='present'&&chambers.status().mode==='map');
check('school:paths-prevents-duplicate-action',pathsEvent.prevented&&pathsEvent.stopped);
check('school:map-scrolls',fx.schoolCompass.scrolled===true);
chambers.handleCapture(captureEvent(fx.schoolContinue));
check('school:study-engaged',chambers.status().state==='engaged'&&chambers.status().mode==='study');

fx.documentTarget.body.dataset.screen='journal';fx.windowTarget.location.hash='#journal';
chambers.onRouteReady({detail:{id:'journal'}});await Promise.resolve();
check('journal:arrival-resets-threshold',chambers.status().route==='journal'&&chambers.status().state==='threshold');
check('journal:orb-at-threshold',fx.screens.journal.host.contains(fx.orb));
chambers.onDepth({detail:{route:'journal'}});await wait(70);
chambers.handleCapture(captureEvent(fx.journalWrite));
check('journal:write-explicit',chambers.status().state==='engaged'&&chambers.status().mode==='write');
chambers.handleCapture(captureEvent(fx.journalMirror));
check('journal:mirror-explicit',chambers.status().mode==='mirror');
chambers.handleCapture(captureEvent(fx.journalCalendar));
check('journal:calendar-explicit',chambers.status().mode==='calendar');

fx.documentTarget.body.dataset.screen='consultations';fx.windowTarget.location.hash='#consultations';
chambers.onRouteReady({detail:{id:'consultations'}});await Promise.resolve();
chambers.onDepth({detail:{route:'consultations'}});await wait(70);
chambers.handleCapture(captureEvent(fx.service));
check('consultations:request-explicit',chambers.status().state==='engaged'&&chambers.status().mode==='request');
chambers.setState('consultations','present','choice','qa');
chambers.handleCapture(captureEvent(fx.tracking));
check('consultations:tracking-explicit',chambers.status().mode==='tracking');

fx.documentTarget.body.dataset.screen='store';fx.windowTarget.location.hash='#store';
chambers.onRouteReady({detail:{id:'store'}});await Promise.resolve();
chambers.onDepth({detail:{route:'store'}});await wait(70);
chambers.handleCapture(captureEvent(fx.storeCollection));await Promise.resolve();
check('store:catalog-explicit',chambers.status().state==='engaged'&&chambers.status().mode==='catalog');
check('store:catalog-scrolls',fx.catalog.scrolled===true);
const storeReturn=fx.screens.store.screen.querySelector('[data-db596-store-return]');
const storeReturnEvent=captureEvent(storeReturn);chambers.handleCapture(storeReturnEvent);
check('store:intentions-return',chambers.status().state==='present'&&chambers.status().mode==='choice');
check('store:return-is-contained',storeReturnEvent.prevented&&storeReturnEvent.stopped);

chambers.onDepth({detail:{route:'store'}});
chambers.onTravelStart({detail:{to:'home'}});
await wait(70);
check('travel:cancels-reveal',chambers.status().state==='travel'&&!chambers.status().timerActive,JSON.stringify(chambers.status()));
check('travel:effects-stay-quiet',fx.documentTarget.documentElement.dataset.realityChamberEffects==='quiet');
check('travel:orb-still-single',fx.documentTarget.querySelectorAll('#orb').length===1);

chambers.onWork12State(new TestCustomEvent('divina:work12-state',{detail:{state:'REST'}}));
fx.documentTarget.body.dataset.screen='home';fx.windowTarget.location.hash='#home';
chambers.onRouteReady({detail:{id:'home'}});
check('home:chambers-rest',chambers.status().route==='home'&&fx.documentTarget.documentElement.dataset.realityChamberState==='rest');
check('home:effects-resume',fx.documentTarget.documentElement.dataset.realityChamberEffects==='rest');

check('whit:silence-used',fx.silenceCalls.length>=8,fx.silenceCalls.length);
check('whit:no-spoken-method',chambers.status().automaticWhitSpeech===false);
check('soul:existing-body-used',fx.soulCalls.length>=8,fx.soulCalls.length);
check('performance:one-timer',chambers.status().oneDeferredTimer&&!chambers.status().timerActive);
check('performance:no-new-engines',chambers.audit().newCanvases===0&&chambers.audit().newRenderers===0&&chambers.audit().permanentAnimationLoops===0&&chambers.audit().mutationObservers===0);
check('privacy:no-runtime-reads',chambers.audit().privateContentReads===0&&chambers.audit().storageReads===0&&chambers.audit().apiCalls===0);
check('contract:maximum-two',chambers.status().maximumVisibleIntentions===2);
check('destroy:completed',chambers.destroy()===true);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V596',work:'WORK12',macroStage:'8-of-10 / chambers-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{routes:['school','journal','consultations','store'],maximumVisibleIntentions:2,automaticWhitSpeech:false,duplicateOrbs:0},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
