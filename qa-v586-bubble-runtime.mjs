/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · DOM RUNTIME V586 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootPath=path.resolve(process.argv[2]||path.dirname(fileURLToPath(import.meta.url)));
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail:String(detail||'')});
const dataKey=name=>name.replace(/^data-/,'').replace(/-([a-z0-9])/g,(_,letter)=>letter.toUpperCase());

class FakeStyle{
  constructor(){this.values=new Map();}
  setProperty(name,value){this.values.set(name,String(value));}
  getPropertyValue(name){return this.values.get(name)||'';}
  removeProperty(name){this.values.delete(name);}
}

class FakeClassList{
  constructor(){this.tokens=new Set();}
  from(value){this.tokens=new Set(String(value||'').split(/\s+/).filter(Boolean));}
  add(...values){values.forEach(value=>this.tokens.add(value));}
  remove(...values){values.forEach(value=>this.tokens.delete(value));}
  contains(value){return this.tokens.has(value);}
  toggle(value,force){
    if(force===true){this.tokens.add(value);return true;}
    if(force===false){this.tokens.delete(value);return false;}
    if(this.tokens.has(value)){this.tokens.delete(value);return false;}
    this.tokens.add(value);return true;
  }
  toString(){return [...this.tokens].join(' ');}
}

function simpleMatch(node,selector){
  const id=selector.match(/#([\w-]+)/)?.[1];
  if(id&&node.id!==id)return false;
  const tag=selector.match(/^([a-z][\w-]*)/i)?.[1];
  if(tag&&node.tagName!==tag.toUpperCase())return false;
  const classes=[...selector.matchAll(/\.([\w-]+)/g)].map(match=>match[1]);
  if(classes.some(name=>!node.classList.contains(name)))return false;
  const data=[...selector.matchAll(/\[(data-[\w-]+)(?:=["']([^"']*)["'])?\]/g)];
  if(data.some(match=>{
    const key=dataKey(match[1]);
    return !(key in node.dataset)||(match[2]!==undefined&&node.dataset[key]!==match[2]);
  }))return false;
  return true;
}

class FakeElement extends EventTarget{
  constructor(tag='div',id=''){
    super();
    this.tagName=String(tag).toUpperCase();
    this.id=id;
    this.dataset={};
    this.attributes=new Map();
    this.classList=new FakeClassList();
    this.style=new FakeStyle();
    this.children=[];
    this.parentNode=null;
    this.parentElement=null;
    this.textContent='';
    this.hidden=false;
    this.disabled=false;
    this.type='';
    this.rect={left:90,top:190,right:290,bottom:390,width:200,height:200};
  }
  get className(){return this.classList.toString();}
  set className(value){this.classList.from(value);}
  get isConnected(){
    let current=this;
    while(current){if(current.tagName==='HTML')return true;current=current.parentNode;}
    return false;
  }
  get offsetWidth(){return this.hidden?0:220;}
  append(...nodes){nodes.forEach(node=>this.insert(node,this.children.length));}
  prepend(...nodes){[...nodes].reverse().forEach(node=>this.insert(node,0));}
  insert(node,index){
    if(node.parentNode){
      const old=node.parentNode.children.indexOf(node);
      if(old>=0)node.parentNode.children.splice(old,1);
    }
    node.parentNode=this;node.parentElement=this;
    this.children.splice(index,0,node);
  }
  remove(){
    if(!this.parentNode)return;
    const index=this.parentNode.children.indexOf(this);
    if(index>=0)this.parentNode.children.splice(index,1);
    this.parentNode=null;this.parentElement=null;
  }
  contains(node){return node===this||this.children.some(child=>child.contains(node));}
  setAttribute(name,value){
    this.attributes.set(name,String(value));
    if(name==='id')this.id=String(value);
    if(name==='class')this.className=String(value);
    if(name.startsWith('data-'))this.dataset[dataKey(name)]=String(value);
  }
  getAttribute(name){
    if(name==='id')return this.id||null;
    if(name==='class')return this.className||null;
    if(name.startsWith('data-'))return this.dataset[dataKey(name)]??null;
    return this.attributes.get(name)??null;
  }
  removeAttribute(name){
    this.attributes.delete(name);
    if(name.startsWith('data-'))delete this.dataset[dataKey(name)];
  }
  matches(selector){return simpleMatch(this,selector);}
  descendants(){return this.children.flatMap(child=>[child,...child.descendants()]);}
  querySelectorAll(selector){return this.descendants().filter(node=>node.matches(selector));}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  getBoundingClientRect(){return {...this.rect};}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();
    this.documentElement=new FakeElement('html');
    this.documentElement.clientWidth=390;
    this.documentElement.clientHeight=844;
    this.head=new FakeElement('head');
    this.body=new FakeElement('body');
    this.visibilityState='visible';
    this.documentElement.append(this.head,this.body);
  }
  createElement(tag){return new FakeElement(tag);}
  all(){return [this.documentElement,...this.documentElement.descendants()];}
  getElementById(id){return this.all().find(node=>node.id===id)||null;}
  querySelectorAll(selector){
    if(selector.includes(' > ')){
      const [parentSelector,childSelector]=selector.split(/\s*>\s*/,2);
      return this.all().filter(node=>node.matches(parentSelector)).flatMap(node=>node.children.filter(child=>child.matches(childSelector)));
    }
    if(selector.includes(' ')){
      const [parentSelector,descendantSelector]=selector.split(/\s+/,2);
      return this.all().filter(node=>node.matches(parentSelector)).flatMap(node=>node.descendants().filter(child=>child.matches(descendantSelector)));
    }
    return this.all().filter(node=>node.matches(selector));
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}

const originals={
  document:globalThis.document,location:globalThis.location,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight,
  visualViewport:globalThis.visualViewport,matchMedia:globalThis.matchMedia,
  addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,
  setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,
  performanceDescriptor:Object.getOwnPropertyDescriptor(globalThis,'performance')
};

const document=new FakeDocument();
const app=new FakeElement('main','app');
document.body.append(app);
const screens=new Map();
for(const id of ['home','school','library','ai']){
  const screen=new FakeElement('section',id);
  screen.className=`screen${id==='home'?' active':''}`;
  if(id!=='home'){
    const threshold=new FakeElement('header');
    threshold.className='db585-intent-threshold';
    threshold.dataset.v585Route=id;
    threshold.rect={left:30,top:110,right:360,bottom:590,width:330,height:480};
    const depthButton=new FakeElement('button');
    depthButton.dataset.v585Depth=id;
    const depthTarget=new FakeElement('div');
    depthTarget.dataset.v585DepthStart='true';
    depthTarget.rect={left:18,top:130,right:372,bottom:650,width:354,height:520};
    screen.append(threshold,depthButton,depthTarget);
  }
  app.append(screen);
  screens.set(id,screen);
}
const orb=new FakeElement('button','orb');
orb.rect={left:105,top:210,right:285,bottom:390,width:180,height:180};
screens.get('home').append(orb);

const activate=route=>{
  document.body.dataset.screen=route;
  screens.forEach((screen,id)=>screen.classList.toggle('active',id===route));
  const threshold=screens.get(route)?.querySelector('.db585-intent-threshold');
  if(threshold)threshold.prepend(orb);
};
activate('home');
document.documentElement.dataset.v585Motion='rest';
document.documentElement.dataset.v585Menu='closed';
document.documentElement.dataset.v585Keyboard='closed';
document.documentElement.dataset.orbNavigationState='idle';

const windowTarget=new EventTarget();
const visualViewport=new EventTarget();
visualViewport.width=390;visualViewport.height=844;visualViewport.offsetLeft=0;visualViewport.offsetTop=0;
let fakeNow=10000;
let timerId=0;
const timers=new Map();
const fakeSetTimeout=(callback,delay=0)=>{const id=++timerId;timers.set(id,{callback,delay:Number(delay)||0});return id;};
const fakeClearTimeout=id=>timers.delete(id);
const runNextTimer=()=>{
  const next=[...timers].sort((a,b)=>a[1].delay-b[1].delay||a[0]-b[0])[0];
  if(!next)return false;
  timers.delete(next[0]);next[1].callback();return true;
};

globalThis.document=document;
globalThis.location={hash:''};
globalThis.innerWidth=390;
globalThis.innerHeight=844;
globalThis.visualViewport=visualViewport;
globalThis.matchMedia=()=>({matches:false});
globalThis.addEventListener=windowTarget.addEventListener.bind(windowTarget);
globalThis.removeEventListener=windowTarget.removeEventListener.bind(windowTarget);
globalThis.setTimeout=fakeSetTimeout;
globalThis.clearTimeout=fakeClearTimeout;
Object.defineProperty(globalThis,'performance',{value:{now:()=>fakeNow},configurable:true});

let depthCalls=0;
const language={enterDepth:button=>{if(button?.dataset?.v585Depth)depthCalls+=1;return Boolean(button);}};
const module=await import(`${pathToFileURL(path.join(rootPath,'magical-bubble-system-v586.js')).href}?runtime=${Date.now()}`);
const api=module.createMagicalBubbleSystemV586({language,universe:{status:()=>({paused:false})}});

check(Boolean(api),'runtime:created');
check(document.getElementById('divinaMagicalBubbleSystemV586')?.href==='./magical-bubble-system-v586.css?v=586','runtime:style-installed');
check(document.documentElement.dataset.magicBubbles==='v586','runtime:root-release');
check(document.documentElement.dataset.v586Whit==='silent-until-invited','runtime:whit-silent');
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===0,'runtime:home-has-no-bubble');
check(api.audit().homeVisibleBubbles===0,'runtime:home-audit-silent');

activate('school');
document.dispatchEvent(new CustomEvent('divina:route-ready',{detail:{id:'school'}}));
document.dispatchEvent(new CustomEvent('divina:orb-persistent-finished',{detail:{route:'school'}}));
check(document.documentElement.dataset.v586BubbleState==='waiting','runtime:arrival-waits');
check(runNextTimer(),'runtime:arrival-timer-fired');
let current=document.querySelector('[data-v586-magic-bubble="true"]');
check(Boolean(current)&&!current.hidden,'runtime:one-bubble-arrived');
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===1,'runtime:never-more-than-one');
check(current?.dataset.v586Route==='school','runtime:route-coherent');
check((current?.textContent||current?.children?.[0]?.textContent||'').trim().split(/\s+/).length<=4,'runtime:four-word-maximum');
check(current?.getAttribute('aria-live')==='off'&&current?.getAttribute('aria-hidden')==='false','runtime:quiet-accessibility');
check(api.audit().visibleBubbles===1&&api.audit().canonicalOrbCount===1,'runtime:one-bubble-one-orb');
const firstIntent=current?.children?.[0]?.textContent;
const firstForm=current?.dataset.v586Form;

document.dispatchEvent(new CustomEvent('divina:route-start',{detail:{id:'music'}}));
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===0,'runtime:travel-removes-bubble');
check(document.documentElement.dataset.v586BubbleState==='paused','runtime:travel-state-paused');

fakeNow+=4000;
activate('school');
document.documentElement.dataset.v585Motion='rest';
document.dispatchEvent(new CustomEvent('divina:orb-persistent-finished',{detail:{route:'school'}}));
runNextTimer();
current=document.querySelector('[data-v586-magic-bubble="true"]');
check(current?.children?.[0]?.textContent!==firstIntent,'runtime:no-intent-repeat');
check(current?.dataset.v586Form!==firstForm,'runtime:no-immediate-form-repeat');

document.documentElement.dataset.v585Menu='open';
document.dispatchEvent(new CustomEvent('divina:menu-state',{detail:{state:'open'}}));
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===0,'runtime:menu-removes-bubble');
check(document.documentElement.dataset.v586BubbleState==='paused','runtime:menu-state-paused');
document.documentElement.dataset.v585Menu='closed';
document.dispatchEvent(new CustomEvent('divina:menu-state',{detail:{state:'closed'}}));

fakeNow+=4000;
activate('ai');
document.dispatchEvent(new CustomEvent('divina:orb-persistent-finished',{detail:{route:'ai'}}));
runNextTimer();
current=document.querySelector('[data-v586-magic-bubble="true"]');
let portalEvents=0;
document.addEventListener('divina:magic-bubble-open',()=>{portalEvents+=1;},{once:true});
current?.dispatchEvent(new Event('click',{cancelable:true}));
check(depthCalls===1&&portalEvents===1,'runtime:bubble-opens-vertical-depth');
check(current?.disabled===true&&current?.classList.contains('is-opening'),'runtime:portal-opens-once');
runNextTimer();
runNextTimer();
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===0,'runtime:portal-returns-to-silence');

activate('library');
const libraryIntents=[];
for(let index=0;index<4;index+=1){
  fakeNow+=4000;
  check(api.show({route:'library',source:'qa'})===true,`runtime:library-intent-${index+1}`);
  current=document.querySelector('[data-v586-magic-bubble="true"]');
  libraryIntents.push(current?.children?.[0]?.textContent);
  api.hide({immediate:true,reason:'qa'});
}
check(new Set(libraryIntents).size===4,'runtime:four-unique-intents-before-silence',libraryIntents.join('|'));
fakeNow+=4000;
let silenceEvents=0;
document.addEventListener('divina:magic-bubble-silence',()=>{silenceEvents+=1;},{once:true});
check(api.show({route:'library',source:'qa'})===false&&silenceEvents===1,'runtime:exhaustion-is-silence');

fakeNow+=4000;
activate('school');
api.show({route:'school',source:'qa-duo'});
visualViewport.width=768;visualViewport.height=1024;
globalThis.innerWidth=768;globalThis.innerHeight=1024;
document.documentElement.clientWidth=768;document.documentElement.clientHeight=1024;
visualViewport.dispatchEvent(new Event('resize'));
current=document.querySelector('[data-v586-magic-bubble="true"]');
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===1,'runtime:duo-resize-keeps-one-bubble');
check(Boolean(current?.style.getPropertyValue('--db586-x'))&&Boolean(current?.style.getPropertyValue('--db586-y')),'runtime:duo-repositions-without-restart');

activate('home');
document.dispatchEvent(new CustomEvent('divina:route-ready',{detail:{id:'home'}}));
check(document.querySelectorAll('[data-v586-magic-bubble="true"]').length===0,'runtime:return-home-removes-bubble');
check(api.audit().homeVisibleBubbles===0,'runtime:return-home-audit-silent');
check(api.destroy()===true,'runtime:destroyed');
check(!document.documentElement.dataset.magicBubbles&&!document.documentElement.dataset.v586Whit,'runtime:destroy-cleans-root-state');

globalThis.document=originals.document;
globalThis.location=originals.location;
globalThis.innerWidth=originals.innerWidth;
globalThis.innerHeight=originals.innerHeight;
globalThis.visualViewport=originals.visualViewport;
globalThis.matchMedia=originals.matchMedia;
globalThis.addEventListener=originals.addEventListener;
globalThis.removeEventListener=originals.removeEventListener;
globalThis.setTimeout=originals.setTimeout;
globalThis.clearTimeout=originals.clearTimeout;
if(originals.performanceDescriptor)Object.defineProperty(globalThis,'performance',originals.performanceDescriptor);

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V586',base:'V585',state:failures.length?'FAIL':'PASS',
  passed,failed:failures.length,total,failures
},null,2));
if(failures.length)process.exitCode=1;
