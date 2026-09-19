/* DIVINA BRUXA — WORK12 · QA SERVICE WORKER · FECHAMENTO VIVO V600 */
import fs from 'node:fs';
import vm from 'node:vm';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
const source=read('./sw.js');
const sourceFiles=Object.freeze({
  index:'./index.html',app:'./app-v208.js',final:'./work12-final-continuity-v598.js',
  'final-styles':'./work12-final-continuity-v598.css',intelligence:'./experience-intelligence-v597.js',
  'intelligence-styles':'./experience-intelligence-v597.css',chambers:'./reality-chambers-v596.js',
  'chamber-styles':'./reality-chambers-v596.css',school:'./school-world-v306.js',journal:'./journal-world-v317.js',
  ritual:'./reading-ritual-core-v595.js','ritual-styles':'./reading-ritual-core-v595.css',daily:'./daily-world-v509.js',
  whit:'./whit-living-presence-v594.js',menu:'./orbital-menu-v502.js','menu-styles':'./orbital-menu-v502.css',
  navigation:'./navigation.js',foundation:'./work12-foundation-v589.js','page-loader':'./page-loader-v1.js',
  universe:'./living-universe-core-v524.js',orb:'./supreme-orb-core-v501.js',renderer:'./orb-engine-v208.js',
  journey:'./orb-persistent-journey-v565.js',soul:'./whit-orb-soul-bridge-v581.js',shell:'./divina-shell-v180.css',
  bridge:'./cosmic-visual-atlas-v1.js'
});
const sources=Object.freeze(Object.fromEntries(Object.entries(sourceFiles).map(([key,file])=>[key,read(file)])));
const assets=Object.freeze({
  './index.html':'index',
  './app-v208.js?v=598-work12-final':'app',
  './work12-final-continuity-v598.js?v=598-work12-final':'final',
  './work12-final-continuity-v598.css?v=599-live-audit':'final-styles',
  './experience-intelligence-v597.js?v=597-work12-intelligence':'intelligence',
  './experience-intelligence-v597.css?v=597-work12-intelligence':'intelligence-styles',
  './reality-chambers-v596.js?v=596-work12-chambers':'chambers',
  './reality-chambers-v596.css?v=596-work12-chambers':'chamber-styles',
  './school-world-v306.js?v=596-work12-chambers':'school',
  './journal-world-v317.js?v=596-work12-chambers':'journal',
  './reading-ritual-core-v595.js?v=595-work12-ritual':'ritual',
  './reading-ritual-core-v595.css?v=595-work12-ritual':'ritual-styles',
  './daily-world-v509.js?v=595-work12-ritual':'daily',
  './whit-living-presence-v594.js?v=594-work12-whit':'whit',
  './orbital-menu-v502.js?v=593-work12-menu':'menu',
  './orbital-menu-v502.css?v=593-work12-menu':'menu-styles',
  './navigation.js?v=592-work12-navigation':'navigation',
  './work12-foundation-v589.js?v=592-work12-navigation':'foundation',
  './page-loader-v1.js?v=592-work12-navigation':'page-loader',
  './living-universe-core-v524.js?v=590-work12-universe':'universe',
  './supreme-orb-core-v501.js?v=591-work12-orb':'orb',
  './orb-engine-v208.js?v=591-work12-orb':'renderer',
  './orb-persistent-journey-v565.js?v=583-coordinate-travel':'journey',
  './whit-orb-soul-bridge-v581.js?v=592-work12-navigation':'soul',
  './divina-shell-v180.css?v=180':'shell',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge':'bridge'
});
const coreAssets=Object.freeze(Object.keys(assets));

class FakeRequest{
  constructor(input,options={}){const original=typeof input==='string'?null:input;this.url=typeof input==='string'?input:input.url;this.method=options.method||original?.method||'GET';this.mode=options.mode||original?.mode||'same-origin';this.cache=options.cache||original?.cache||'default';}
}
class FakeResponse{
  constructor(body='',{status=200,type='basic'}={}){this.body=String(body);this.status=status;this.ok=status>=200&&status<300;this.type=type;}
  clone(){return new FakeResponse(this.body,{status:this.status,type:this.type});}
  async text(){return this.body;}
}
const keyFor=value=>typeof value==='string'?value:value?.url;

function createHarness({broken=null}={}){
  const listeners=new Map(),stores=new Map(),clientMessages=[],sourceMessages=[];
  let offline=false,claimed=0,skipped=0;
  const paths=new Map(coreAssets.map(asset=>[asset,broken===assets[asset]?`/* broken ${broken} */`:sources[assets[asset]]]));
  const caches={
    async open(name){if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);return{async put(key,response){store.set(keyFor(key),response.clone());},async match(key){return store.get(keyFor(key))?.clone();}};},
    async keys(){return[...stores.keys()];},async delete(name){return stores.delete(name);},
    async match(key){const normalized=keyFor(key);for(const store of stores.values()){const response=store.get(normalized);if(response)return response.clone();}return undefined;}
  };
  const fetch=async input=>{
    if(offline)throw new Error('offline');
    const request=input instanceof FakeRequest?input:new FakeRequest(input);
    if(paths.has(request.url))return new FakeResponse(paths.get(request.url));
    const url=new URL(request.url,'https://divina.test/');
    if(request.mode==='navigate'||url.pathname==='/'||url.pathname.endsWith('/index.html'))return new FakeResponse(sources.index);
    const entry=Object.entries(sourceFiles).find(([,file])=>file.slice(1)===url.pathname);
    return new FakeResponse(entry?sources[entry[0]]:`asset:${url.pathname}`);
  };
  const self={location:{origin:'https://divina.test'},addEventListener(type,handler){listeners.set(type,handler);},async skipWaiting(){skipped+=1;},clients:{async claim(){claimed+=1;},async matchAll(){return[{postMessage:message=>clientMessages.push(message)}];}}};
  vm.runInContext(source,vm.createContext({self,caches,fetch,Request:FakeRequest,URL,Object,Map,Set,Promise,Error,RegExp,console}),{filename:'sw-v600.js'});
  const wait=async(type,event={})=>{let promise=Promise.resolve();listeners.get(type)?.({...event,waitUntil:value=>{promise=Promise.resolve(value);}});return promise;};
  const fetchEvent=async request=>{let response=null;listeners.get('fetch')?.({request,respondWith:value=>{response=Promise.resolve(value);}});return response;};
  const message=async data=>{let promise=Promise.resolve();listeners.get('message')?.({data,source:{postMessage:value=>sourceMessages.push(value)},waitUntil:value=>{promise=Promise.resolve(value);}});return promise;};
  return{listeners,stores,clientMessages,sourceMessages,wait,fetchEvent,message,offline:value=>{offline=value;},counters:()=>({claimed,skipped})};
}

const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});
const cacheName='divina-bruxa-work12-v600-one-style';
const harness=createHarness();

for(const event of ['install','activate','fetch','message'])check(`listener:${event}`,harness.listeners.has(event));
await harness.wait('install');
const cache=harness.stores.get(cacheName);
check('install:atomic-cache-created',cache instanceof Map);
check('install:twenty-six-core-assets',cache?.size===26,cache?.size);
for(const asset of coreAssets)check(`install:${asset}`,cache?.has(asset));
check('install:skip-after-validation',harness.counters().skipped===1,harness.counters().skipped);

for(const component of Object.keys(sourceFiles).filter(component=>!['shell','bridge'].includes(component))){
  const broken=createHarness({broken:component});let rejected=false;
  try{await broken.wait('install');}catch{rejected=true;}
  check(`atomic:${component}-rejected`,rejected);
  check(`atomic:${component}-never-cached`,!broken.stores.has(cacheName));
  check(`atomic:${component}-never-activates`,broken.counters().skipped===0);
}

harness.stores.set('divina-bruxa-work12-v599-live-audit',new Map());
await harness.wait('activate');
check('activate:claims-clients',harness.counters().claimed===1);
check('activate:keeps-v600',harness.stores.has(cacheName));
check('activate:deletes-v599',!harness.stores.has('divina-bruxa-work12-v599-live-audit'));
for(const type of ['DIVINA_WORK12_FOUNDATION_ACTIVE','DIVINA_WORK12_NAVIGATION_ACTIVE','DIVINA_WORK12_UNIVERSE_ACTIVE','DIVINA_WORK12_ORB_ACTIVE','DIVINA_WORK12_MENU_ACTIVE','DIVINA_WORK12_WHIT_ACTIVE','DIVINA_WORK12_RITUAL_ACTIVE','DIVINA_WORK12_CHAMBERS_ACTIVE','DIVINA_WORK12_INTELLIGENCE_ACTIVE','DIVINA_WORK12_FINAL_ACTIVE','DIVINA_RELEASE_READY']){
  check(`activate:${type}`,harness.clientMessages.some(item=>item.type===type&&item.version===600));
}

const onlineNavigation=await harness.fetchEvent(new FakeRequest('https://divina.test/#tarot',{mode:'navigate'}));
check('fetch:navigation-network',(await onlineNavigation.text()).includes('content="V600"'));
harness.offline(true);
const offlineNavigation=await harness.fetchEvent(new FakeRequest('https://divina.test/#journal',{mode:'navigate'}));
check('fetch:navigation-offline',(await offlineNavigation.text()).includes('content="V600"'));
harness.offline(false);

for(const [file,needle] of [
  ['app-v208.js?v=598-work12-final','divinaWork12Macro10V598'],
  ['work12-final-continuity-v598.js?v=598-work12-final','FINAL_CONTINUITY_CONTRACT_V598'],
  ['work12-final-continuity-v598.css?v=599-live-audit','content:"SOPRO"'],
  ['experience-intelligence-v597.js?v=597-work12-intelligence','EXPERIENCE_INTELLIGENCE_CONTRACT_V597'],
  ['experience-intelligence-v597.css?v=597-work12-intelligence','data-experience-budget="essential"'],
  ['reality-chambers-v596.js?v=596-work12-chambers','REALITY_CHAMBERS_CONTRACT_V596'],
  ['reading-ritual-core-v595.js?v=595-work12-ritual','READING_RITUAL_CONTRACT_V595'],
  ['whit-living-presence-v594.js?v=594-work12-whit','WHIT_LIVING_PRESENCE_CONTRACT_V594'],
  ['orbital-menu-v502.js?v=593-work12-menu','maximumVisibleIntentions:2'],
  ['navigation.js?v=592-work12-navigation','const WORK12_HISTORY_RELEASE = 592;'],
  ['supreme-orb-core-v501.js?v=591-work12-orb','const WORK12_RELEASE = 591;']
]){
  const request=new FakeRequest(`https://divina.test/${file}`);
  const online=await harness.fetchEvent(request);check(`fetch:${file}-network`,(await online.text()).includes(needle));
  harness.offline(true);const cached=await harness.fetchEvent(request);check(`fetch:${file}-offline`,(await cached.text()).includes(needle));harness.offline(false);
}

await harness.message({type:'WORK12_STATUS'});
check('message:status-version',harness.sourceMessages.some(item=>item.type==='WORK12_STATUS'&&item.version===600));
check('message:status-twenty-six-assets',harness.sourceMessages.some(item=>item.type==='WORK12_STATUS'&&item.core?.length===26));
await harness.message({type:'CLEAR_DIVINA_CACHES'});
check('message:clear-caches',!harness.stores.has(cacheName));
check('message:clear-confirmed',harness.sourceMessages.some(item=>item.type==='DIVINA_CACHES_CLEARED'&&item.version===600));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({release:'V600',work:'WORK12',macroStage:'10-of-10 / one-style-service-worker-runtime',state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,failed:failures.length,total:checks.length,failures:failures.map(({id,detail})=>({id,detail}))},null,2));
if(failures.length)process.exitCode=1;
