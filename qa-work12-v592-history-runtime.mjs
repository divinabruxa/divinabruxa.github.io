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

const makeClassList=()=>{
  const values=new Set();
  return {
    add:(...items)=>items.forEach(item=>values.add(item)),
    remove:(...items)=>items.forEach(item=>values.delete(item)),
    contains:item=>values.has(item),
    toggle:(item,force)=>{
      const active=force===undefined?!values.has(item):Boolean(force);
      if(active)values.add(item);else values.delete(item);
      return active;
    }
  };
};

class FakeNode extends EventTarget {
  constructor(id=''){
    super();
    this.id=id;
    this.dataset={};
    this.classList=makeClassList();
    this.attributes=new Map();
  }
  querySelector(){return null;}
  querySelectorAll(){return [];}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  removeAttribute(name){this.attributes.delete(name);}
  scrollIntoView(){}
}

class FakeDocument extends EventTarget {
  constructor(){
    super();
    this.documentElement={dataset:{}};
    this.body={dataset:{screen:'home'}};
    this.screens=new Map(['home','tarot','daily','library'].map(id=>[id,new FakeNode(id)]));
    this.screens.get('home').classList.add('active');
  }
  querySelector(selector){
    if(selector==='#home')return this.screens.get('home');
    if(selector==='#orbMenu'||selector==='#menuBtn'||selector==='#pathsBtn'||selector==='.home-skins')return null;
    return null;
  }
  querySelectorAll(selector){
    if(selector==='.screen')return [...this.screens.values()];
    return [];
  }
  getElementById(id){return this.screens.get(id)||null;}
  createElement(){return new FakeNode();}
}

function createEnvironment(initialHash=''){
  const documentTarget=new FakeDocument();
  const windowTarget=new EventTarget();
  const locationTarget={pathname:'/',search:'',hash:initialHash};
  const events=[];
  const historyEvents=[];
  const url=()=>`${locationTarget.pathname}${locationTarget.search}${locationTarget.hash}`;
  const applyUrl=value=>{
    const target=String(value||'');
    if(target.startsWith('#')) locationTarget.hash=target;
    else if(target==='./'||target==='/'||target.endsWith('/')) locationTarget.hash='';
  };
  let index=0;
  const entries=[{url:url(),state:null}];
  const historyTarget={
    get state(){return entries[index]?.state||null;},
    get length(){return entries.length;},
    get index(){return index;},
    pushState(state,_title,targetUrl){
      applyUrl(targetUrl);
      entries.splice(index+1);
      entries.push({url:url(),state});
      index=entries.length-1;
      historyEvents.push({action:'push',state,url:url()});
    },
    replaceState(state,_title,targetUrl){
      applyUrl(targetUrl);
      entries[index]={url:url(),state};
      historyEvents.push({action:'replace',state,url:url()});
    },
    back(){
      if(index<=0)return false;
      index-=1;
      locationTarget.hash=entries[index].url.includes('#')?`#${entries[index].url.split('#')[1]}`:'';
      const pop=new Event('popstate');
      Object.defineProperty(pop,'state',{value:entries[index].state});
      windowTarget.dispatchEvent(pop);
      windowTarget.dispatchEvent(new Event('hashchange'));
      return true;
    },
    forward(){
      if(index>=entries.length-1)return false;
      index+=1;
      locationTarget.hash=entries[index].url.includes('#')?`#${entries[index].url.split('#')[1]}`:'';
      const pop=new Event('popstate');
      Object.defineProperty(pop,'state',{value:entries[index].state});
      windowTarget.dispatchEvent(pop);
      windowTarget.dispatchEvent(new Event('hashchange'));
      return true;
    },
    entries
  };
  documentTarget.addEventListener('divina:work12-history',event=>events.push(event.detail));
  globalThis.CustomEvent=TestCustomEvent;
  globalThis.document=documentTarget;
  globalThis.location=locationTarget;
  globalThis.history=historyTarget;
  globalThis.window=globalThis;
  globalThis.scrollTo=()=>{};
  globalThis.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  globalThis.requestAnimationFrame=handler=>{handler(0);return 1;};
  globalThis.cancelAnimationFrame=()=>{};
  globalThis.addEventListener=windowTarget.addEventListener.bind(windowTarget);
  globalThis.removeEventListener=windowTarget.removeEventListener.bind(windowTarget);
  globalThis.dispatchEvent=windowTarget.dispatchEvent.bind(windowTarget);
  return {documentTarget,windowTarget,locationTarget,historyTarget,events,historyEvents};
}

const {createNavigation}=await import('./navigation.js?qa-v592-history');

const env=createEnvironment('#library');
const navigation=createNavigation({beforeEnter:async()=>true});
const requests=[];
navigation.setRouteRequest((route,options)=>{
  requests.push({route,source:options?.source,historyMode:options?.historyMode,initial:options?.initial===true});
  return navigation.go(route,options);
});

const deepReady=await navigation.start();
await flush();
check('deep-link:ready',deepReady===true);
check('deep-link:route',env.documentTarget.body.dataset.screen==='library');
check('deep-link:through-authority',requests.length===1&&requests[0].route==='library'&&requests[0].source==='deep-link');
check('deep-link:history-mode',requests[0].historyMode==='deep-link'&&requests[0].initial===true);
check('deep-link:one-entry',env.historyTarget.length===1,String(env.historyTarget.length));
check('deep-link:state-release',env.historyTarget.state?.work12?.release===592);
check('deep-link:state-route',env.historyTarget.state?.screen==='library'&&env.historyTarget.state?.work12?.route==='library');
check('deep-link:event',env.events.some(item=>item.action==='deep-link'&&item.route==='library'));

await navigation.go('tarot',{source:'touch'});
await navigation.go('daily',{source:'touch'});
check('history:two-pushes',env.historyTarget.length===3,String(env.historyTarget.length));
check('history:daily-current',env.locationTarget.hash==='#daily'&&env.documentTarget.body.dataset.screen==='daily');
check('history:monotonic-entries',env.historyTarget.entries.map(item=>item.state?.work12?.entry).join(',')==='1,2,3',env.historyTarget.entries.map(item=>item.state?.work12?.entry).join(','));

const requestsBeforeBack=requests.length;
env.historyTarget.back();
await flush();
check('back:route',env.locationTarget.hash==='#tarot'&&env.documentTarget.body.dataset.screen==='tarot');
check('back:one-request-for-two-events',requests.length===requestsBeforeBack+1,String(requests.length-requestsBeforeBack));
check('back:through-authority',requests.at(-1)?.source==='history'&&requests.at(-1)?.historyMode==='traverse');
check('back:no-new-entry',env.historyTarget.length===3,String(env.historyTarget.length));
check('back:preserves-entry',env.historyTarget.state?.work12?.entry===2,String(env.historyTarget.state?.work12?.entry));
check('back:traverse-event',env.events.some(item=>item.action==='traverse'&&item.route==='tarot'));

const requestsBeforeForward=requests.length;
env.historyTarget.forward();
await flush();
check('forward:route',env.locationTarget.hash==='#daily'&&env.documentTarget.body.dataset.screen==='daily');
check('forward:one-request-for-two-events',requests.length===requestsBeforeForward+1,String(requests.length-requestsBeforeForward));
check('forward:through-authority',requests.at(-1)?.source==='history'&&requests.at(-1)?.historyMode==='traverse');
check('forward:no-new-entry',env.historyTarget.length===3,String(env.historyTarget.length));
check('forward:preserves-entry',env.historyTarget.state?.work12?.entry===3,String(env.historyTarget.state?.work12?.entry));
check('snapshot:history-release',navigation.menuSnapshot().historyRelease===592);
check('snapshot:history-entry',navigation.menuSnapshot().historyEntry===3);
check('snapshot:route',navigation.menuSnapshot().route==='daily');

env.documentTarget.documentElement.dataset.work12NavigationSource='history';
env.documentTarget.documentElement.dataset.work12HistoryMode='traverse';
const lengthBeforeDatasetBridge=env.historyTarget.length;
await navigation.go('tarot');
check('bridge:foundation-source-reaches-router',env.events.at(-1)?.source==='history');
check('bridge:foundation-mode-reaches-router',env.events.at(-1)?.action==='traverse');
check('bridge:traverse-never-pushes',env.historyTarget.length===lengthBeforeDatasetBridge);
delete env.documentTarget.documentElement.dataset.work12NavigationSource;
delete env.documentTarget.documentElement.dataset.work12HistoryMode;

const invalidEnv=createEnvironment('#nao-existe');
const invalidNavigation=createNavigation({beforeEnter:async()=>true});
const invalidRequests=[];
invalidNavigation.setRouteRequest((route,options)=>{
  invalidRequests.push({route,source:options?.source,historyMode:options?.historyMode});
  return invalidNavigation.go(route,options);
});
await invalidNavigation.start();
await flush();
check('invalid:canonical-home',invalidEnv.locationTarget.hash===''&&invalidEnv.documentTarget.body.dataset.screen==='home');
check('invalid:single-entry',invalidEnv.historyTarget.length===1,String(invalidEnv.historyTarget.length));
check('invalid:canonicalized-state',invalidEnv.historyTarget.state?.work12?.action==='canonicalized');
check('invalid:canonicalized-event',invalidEnv.events.some(item=>item.action==='canonicalized'&&item.route==='home'));
check('invalid:authority-first',invalidRequests.length===1&&invalidRequests[0].route==='home');

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V592',work:'WORK12',macroStage:'4-of-10 / history-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
