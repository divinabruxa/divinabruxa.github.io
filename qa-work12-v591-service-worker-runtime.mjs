import fs from 'node:fs';
import vm from 'node:vm';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
const source=read('./sw.js');
const sources=Object.freeze({
  index:read('./index.html'),app:read('./app-v208.js'),foundation:read('./work12-foundation-v589.js'),
  universe:read('./living-universe-core-v524.js'),orb:read('./supreme-orb-core-v501.js'),
  renderer:read('./orb-engine-v208.js'),journey:read('./orb-persistent-journey-v565.js'),
  soul:read('./whit-orb-soul-bridge-v581.js'),shell:read('./divina-shell-v180.css'),
  bridge:read('./cosmic-visual-atlas-v1.js')
});

class FakeRequest {
  constructor(input,options={}){
    const original=typeof input==='string'?null:input;
    this.url=typeof input==='string'?input:input.url;
    this.method=options.method||original?.method||'GET';
    this.mode=options.mode||original?.mode||'same-origin';
    this.cache=options.cache||original?.cache||'default';
  }
}
class FakeResponse {
  constructor(body='',{status=200,type='basic'}={}){
    this.body=String(body);this.status=status;this.ok=status>=200&&status<300;this.type=type;
  }
  clone(){return new FakeResponse(this.body,{status:this.status,type:this.type});}
  async text(){return this.body;}
}
const keyFor=value=>typeof value==='string'?value:value?.url;

function createHarness({broken=null}={}){
  const listeners=new Map();
  const stores=new Map();
  const deleted=[];
  const clientMessages=[];
  const sourceMessages=[];
  let offline=false,claimed=0,skipped=0;
  const paths=new Map([
    ['./index.html',sources.index],
    ['./app-v208.js?v=591-work12-orb',sources.app],
    ['./work12-foundation-v589.js?v=589',sources.foundation],
    ['./living-universe-core-v524.js?v=590-work12-universe',sources.universe],
    ['./supreme-orb-core-v501.js?v=591-work12-orb',broken==='orb'?'/* wrong orb */':sources.orb],
    ['./orb-engine-v208.js?v=591-work12-orb',broken==='renderer'?'/* wrong renderer */':sources.renderer],
    ['./orb-persistent-journey-v565.js?v=583-coordinate-travel',broken==='journey'?'/* wrong journey */':sources.journey],
    ['./whit-orb-soul-bridge-v581.js?v=591-work12-orb',broken==='soul'?'/* wrong soul */':sources.soul],
    ['./divina-shell-v180.css?v=180',sources.shell],
    ['./cosmic-visual-atlas-v1.js?v=590-work12-bridge',sources.bridge]
  ]);
  const caches={
    async open(name){
      if(!stores.has(name))stores.set(name,new Map());
      const store=stores.get(name);
      return {async put(key,response){store.set(keyFor(key),response.clone());},async match(key){return store.get(keyFor(key))?.clone();}};
    },
    async keys(){return [...stores.keys()];},
    async delete(name){deleted.push(name);return stores.delete(name);},
    async match(key){
      const normalized=keyFor(key);
      for(const store of stores.values()){const response=store.get(normalized);if(response)return response.clone();}
      return undefined;
    }
  };
  const fetch=async input=>{
    if(offline)throw new Error('offline');
    const request=input instanceof FakeRequest?input:new FakeRequest(input);
    if(paths.has(request.url))return new FakeResponse(paths.get(request.url));
    const url=new URL(request.url,'https://divina.test/');
    if(request.mode==='navigate'||url.pathname==='/'||url.pathname.endsWith('/index.html'))return new FakeResponse(sources.index);
    const routeSource={
      '/app-v208.js':sources.app,'/supreme-orb-core-v501.js':sources.orb,'/orb-engine-v208.js':sources.renderer,
      '/orb-persistent-journey-v565.js':sources.journey,'/whit-orb-soul-bridge-v581.js':sources.soul,
      '/living-universe-core-v524.js':sources.universe
    }[url.pathname];
    return new FakeResponse(routeSource||`asset:${url.pathname}`);
  };
  const self={
    location:{origin:'https://divina.test'},
    addEventListener(type,handler){listeners.set(type,handler);},
    async skipWaiting(){skipped+=1;},
    clients:{async claim(){claimed+=1;},async matchAll(){return[{postMessage:message=>clientMessages.push(message)}];}}
  };
  vm.runInContext(source,vm.createContext({self,caches,fetch,Request:FakeRequest,URL,Object,Map,Set,Promise,Error,RegExp,console}),{filename:'sw-v591.js'});
  const wait=async(type,event={})=>{
    let promise=Promise.resolve();
    listeners.get(type)?.({...event,waitUntil:value=>{promise=Promise.resolve(value);}});
    return promise;
  };
  const fetchEvent=async request=>{
    let response=null;
    listeners.get('fetch')?.({request,respondWith:value=>{response=Promise.resolve(value);}});
    return response;
  };
  const message=async data=>{
    let promise=Promise.resolve();
    listeners.get('message')?.({data,source:{postMessage:value=>sourceMessages.push(value)},waitUntil:value=>{promise=Promise.resolve(value);}});
    return promise;
  };
  return {listeners,stores,deleted,clientMessages,sourceMessages,wait,fetchEvent,message,offline:value=>{offline=value;},counters:()=>({claimed,skipped})};
}

const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':detail});
const cacheName='divina-bruxa-work12-v591-orb';
const coreAssets=[
  './index.html','./app-v208.js?v=591-work12-orb','./work12-foundation-v589.js?v=589',
  './living-universe-core-v524.js?v=590-work12-universe','./supreme-orb-core-v501.js?v=591-work12-orb',
  './orb-engine-v208.js?v=591-work12-orb','./orb-persistent-journey-v565.js?v=583-coordinate-travel',
  './whit-orb-soul-bridge-v581.js?v=591-work12-orb','./divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
];

const harness=createHarness();
for(const event of ['install','activate','fetch','message'])check(`listener:${event}`,harness.listeners.has(event));
await harness.wait('install');
const cache=harness.stores.get(cacheName);
check('install:atomic-cache-created',cache instanceof Map);
check('install:ten-core-assets',cache?.size===10,String(cache?.size));
for(const asset of coreAssets)check(`install:${asset}`,cache?.has(asset));
check('install:skip-after-validation',harness.counters().skipped===1);

for(const component of ['orb','renderer','journey','soul']){
  const broken=createHarness({broken:component});
  let rejected=false;
  try{await broken.wait('install');}catch{rejected=true;}
  check(`atomic:${component}-rejected`,rejected);
  check(`atomic:${component}-never-cached`,!broken.stores.has(cacheName));
  check(`atomic:${component}-never-activates`,broken.counters().skipped===0);
}

harness.stores.set('divina-bruxa-work12-v590-universe',new Map());
await harness.wait('activate');
check('activate:claims-clients',harness.counters().claimed===1);
check('activate:keeps-v591',harness.stores.has(cacheName));
check('activate:deletes-v590',!harness.stores.has('divina-bruxa-work12-v590-universe'));
check('activate:foundation-message',harness.clientMessages.some(item=>item.type==='DIVINA_WORK12_FOUNDATION_ACTIVE'&&item.version===591));
check('activate:universe-message',harness.clientMessages.some(item=>item.type==='DIVINA_WORK12_UNIVERSE_ACTIVE'&&item.version===591));
check('activate:orb-message',harness.clientMessages.some(item=>item.type==='DIVINA_WORK12_ORB_ACTIVE'&&item.version===591));
check('activate:release-message',harness.clientMessages.some(item=>item.type==='DIVINA_RELEASE_READY'&&item.version===591));

const navigation=new FakeRequest('https://divina.test/#tarot',{mode:'navigate'});
const onlineNavigation=await harness.fetchEvent(navigation);
check('fetch:navigation-network',(await onlineNavigation.text()).includes('content="V591"'));
harness.offline(true);
const offlineNavigation=await harness.fetchEvent(new FakeRequest('https://divina.test/#daily',{mode:'navigate'}));
check('fetch:navigation-offline',(await offlineNavigation.text()).includes('content="V591"'));
harness.offline(false);

for(const [file,needle] of [
  ['supreme-orb-core-v501.js?v=591-work12-orb','const WORK12_RELEASE = 591;'],
  ['orb-engine-v208.js?v=591-work12-orb','const ORB_RENDERER_RELEASE = 591;'],
  ['whit-orb-soul-bridge-v581.js?v=591-work12-orb','const VERSION = 591;']
]){
  const request=new FakeRequest(`https://divina.test/${file}`);
  const online=await harness.fetchEvent(request);
  check(`fetch:${file}-network`,(await online.text()).includes(needle));
  harness.offline(true);
  const offline=await harness.fetchEvent(request);
  check(`fetch:${file}-offline`,(await offline.text()).includes(needle));
  harness.offline(false);
}

await harness.message({type:'WORK12_STATUS'});
check('message:status-version',harness.sourceMessages.some(item=>item.type==='WORK12_STATUS'&&item.version===591));
check('message:status-ten-assets',harness.sourceMessages.some(item=>item.type==='WORK12_STATUS'&&item.core?.length===10));
await harness.message({type:'CLEAR_DIVINA_CACHES'});
check('message:clear-caches',!harness.stores.has(cacheName));
check('message:clear-confirmed',harness.sourceMessages.some(item=>item.type==='DIVINA_CACHES_CLEARED'&&item.version===591));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V591',work:'WORK12',macroStage:'3-of-10 / service-worker-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
