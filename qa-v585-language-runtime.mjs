/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · DOM RUNTIME V585 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||path.dirname(fileURLToPath(import.meta.url)));
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
  constructor(owner){this.owner=owner;this.tokens=new Set();}
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

function parseSimpleSelector(selector){
  const result={id:null,classes:[],data:[]};
  const id=selector.match(/#([\w-]+)/);if(id)result.id=id[1];
  result.classes=[...selector.matchAll(/\.([\w-]+)/g)].map(match=>match[1]);
  result.data=[...selector.matchAll(/\[(data-[\w-]+)(?:=["']([^"']*)["'])?\]/g)]
    .map(match=>({key:dataKey(match[1]),value:match[2]}));
  return result;
}

class FakeElement extends EventTarget{
  constructor(tag='div',id=''){
    super();
    this.tagName=String(tag).toUpperCase();
    this.id=id;
    this.dataset={};
    this.attributes=new Map();
    this.classList=new FakeClassList(this);
    this.style=new FakeStyle();
    this.children=[];
    this.parentNode=null;
    this.parentElement=null;
    this.textContent='';
    this.hidden=false;
    this.inert=false;
    this.scrolled=false;
  }
  get className(){return this.classList.toString();}
  set className(value){this.classList.from(value);}
  get isConnected(){return Boolean(this.parentNode)||this.tagName==='HTML';}
  append(...nodes){nodes.forEach(node=>this.insert(node,this.children.length));}
  prepend(...nodes){[...nodes].reverse().forEach(node=>this.insert(node,0));}
  insert(node,index){
    if(node.parentNode){
      const prior=node.parentNode.children.indexOf(node);
      if(prior>=0)node.parentNode.children.splice(prior,1);
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
  hasAttribute(name){return this.getAttribute(name)!=null;}
  removeAttribute(name){
    this.attributes.delete(name);
    if(name.startsWith('data-'))delete this.dataset[dataKey(name)];
  }
  matches(selector){
    const parsed=parseSimpleSelector(selector);
    if(parsed.id&&this.id!==parsed.id)return false;
    if(parsed.classes.some(name=>!this.classList.contains(name)))return false;
    if(parsed.data.some(({key,value})=>!(key in this.dataset)||(value!==undefined&&this.dataset[key]!==value)))return false;
    return true;
  }
  descendants(){return this.children.flatMap(child=>[child,...child.descendants()]);}
  querySelectorAll(selector){
    if(selector.startsWith(':scope > ')){
      const direct=selector.slice(9);
      return this.children.filter(child=>child.matches(direct));
    }
    return this.descendants().filter(node=>node.matches(selector));
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){
    let current=this;
    while(current){if(current.matches(selector))return current;current=current.parentElement;}
    return null;
  }
  scrollIntoView(){this.scrolled=true;}
}

class FakeDocument extends EventTarget{
  constructor(){
    super();
    this.documentElement=new FakeElement('html');
    this.documentElement.clientWidth=390;
    this.documentElement.clientHeight=844;
    this.head=new FakeElement('head');
    this.body=new FakeElement('body');
    this.documentElement.append(this.head,this.body);
  }
  createElement(tag){return new FakeElement(tag);}
  all(){return [this.documentElement,...this.documentElement.descendants()];}
  getElementById(id){return this.all().find(node=>node.id===id)||null;}
  querySelectorAll(selector){
    if(selector==='#app > .screen.active'){
      const app=this.getElementById('app');
      return app?app.children.filter(node=>node.classList.contains('screen')&&node.classList.contains('active')):[];
    }
    return this.all().filter(node=>node.matches(selector));
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}

const original={
  document:globalThis.document,location:globalThis.location,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight,
  visualViewport:globalThis.visualViewport,matchMedia:globalThis.matchMedia,
  addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener
};
const document=new FakeDocument();
const app=new FakeElement('main','app');
document.body.append(app);
document.body.dataset.screen='home';
const routeIds=['home','tarot','daily','spreads','library','school','journal','ai','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
const screens=new Map();
for(const id of routeIds){
  const screen=new FakeElement('section',id);
  screen.className=`screen${id==='home'?' active':''}`;
  const mark=new FakeElement('div');mark.className='v560-world-mark';screen.append(mark);
  const hero=new FakeElement('div');hero.className='legacy-hero';screen.append(hero);
  if(!['home','tarot','daily'].includes(id)){
    const landing=new FakeElement('div');landing.className='db526-orb-landing';
    const presence=new FakeElement('button');presence.dataset.orbPresenceV526='true';landing.append(presence);screen.append(landing);
  }
  app.append(screen);screens.set(id,screen);
}
const homeStage=new FakeElement('div');
const orb=new FakeElement('button','orb');
homeStage.append(orb);screens.get('home').append(homeStage);

const windowTarget=new EventTarget();
const visualViewport=new EventTarget();
visualViewport.width=390;visualViewport.height=844;visualViewport.scale=1;
globalThis.document=document;
globalThis.location={hash:''};
globalThis.innerWidth=390;
globalThis.innerHeight=844;
globalThis.visualViewport=visualViewport;
globalThis.matchMedia=()=>({matches:false});
globalThis.addEventListener=windowTarget.addEventListener.bind(windowTarget);
globalThis.removeEventListener=windowTarget.removeEventListener.bind(windowTarget);

let claims=0,homeReturns=0;
const orbCore={
  orb,
  claim(host){claims+=1;host.append(orb);return()=>true;},
  returnHome(){homeReturns+=1;homeStage.append(orb);return true;}
};

const module=await import(`${pathToFileURL(path.join(root,'reality-intention-language-v585.js')).href}?runtime=${Date.now()}`);
const api=module.createRealityIntentionLanguageV585({orbCore,universe:{status:()=>({paused:false})}});

check(Boolean(api),'runtime:created');
check(document.querySelectorAll('.db585-intent-threshold').length===16,'runtime:sixteen-thresholds',document.querySelectorAll('.db585-intent-threshold').length);
check(document.querySelectorAll('[data-v585-orb-host]').length===14,'runtime:fourteen-orb-hosts',document.querySelectorAll('[data-v585-orb-host]').length);
check(screens.get('home').querySelectorAll('.db585-intent-threshold').length===0,'runtime:home-stays-minimal');
check(screens.get('tarot').querySelector('[data-v585-orb-host]')===null&&screens.get('daily').querySelector('[data-v585-orb-host]')===null,'runtime:tarot-daily-not-reclaimed');
check(document.querySelectorAll('[data-v585-secondary-presence]').length===14,'runtime:secondary-presences-muted');
check(document.documentElement.dataset.v585Viewport==='compact'&&document.documentElement.dataset.v585Posture==='vertical','runtime:iphone-compact-profile');
check(document.documentElement.style.getPropertyValue('--db585-viewport-height')==='844px','runtime:visual-viewport-height');

document.body.dataset.screen='library';
screens.forEach((screen,id)=>screen.classList.toggle('active',id==='library'));
document.dispatchEvent(new CustomEvent('divina:route-ready',{detail:{id:'library'}}));
const libraryHost=screens.get('library').querySelector('[data-v585-orb-host]');
check(claims===1,'runtime:one-claim-for-route',claims);
check(libraryHost?.contains(orb),'runtime:physical-orb-at-intention');
check(document.documentElement.dataset.v585Route==='library','runtime:route-synced');
check(orb.getAttribute('aria-label')?.includes('Orbe de Biblioteca'),'runtime:orb-accessible-context');
check(api.audit().canonicalOrbCount===1&&api.audit().duplicateOrbs===0,'runtime:one-canonical-orb');

const depthButton=screens.get('library').querySelector('[data-v585-depth]');
const depthTarget=screens.get('library').querySelector('[data-v585-depth-start="true"]');
check(api.enterDepth(depthButton)===true,'runtime:explicit-depth-entered');
check(depthTarget?.scrolled===true&&screens.get('library').dataset.v585Depth==='entered','runtime:vertical-depth-scroll');

visualViewport.height=470;
visualViewport.dispatchEvent(new Event('resize'));
check(document.documentElement.dataset.v585Keyboard==='open','runtime:software-keyboard-detected');

document.dispatchEvent(new CustomEvent('divina:route-start',{detail:{id:'music'}}));
check(document.documentElement.dataset.v585Motion==='travel'&&document.documentElement.dataset.v585Destination==='music','runtime:travel-state');
document.dispatchEvent(new CustomEvent('divina:orb-persistent-finished',{detail:{route:'library'}}));
check(document.documentElement.dataset.v585Motion==='rest'&&!document.documentElement.dataset.v585Destination,'runtime:travel-settled');

check(api.destroy()===true,'runtime:destroyed');
check(homeReturns===1&&homeStage.contains(orb),'runtime:destroy-keeps-orb-connected');
check(document.querySelectorAll('.db585-intent-threshold').length===0,'runtime:thresholds-removed');

Object.assign(globalThis,original);

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V585',base:'V584',state:failures.length?'FAIL':'PASS',
  passed,failed:failures.length,total,failures
},null,2));
if(failures.length)process.exitCode=1;
