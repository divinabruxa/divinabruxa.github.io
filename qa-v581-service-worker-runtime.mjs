/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · SERVICE WORKER RUNTIME V581 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(process.argv[2]||path.dirname(fileURLToPath(import.meta.url)));
const scope='http://divina.local/';
let online=true,passed=0,skipWaitingCalls=0,claimCalls=0,navigationPreloadEnabled=false;
const failures=[];
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});
const keyOf=request=>typeof request==='string'?new URL(request,scope).href:request.url;
const comparable=(value,ignoreSearch)=>{const url=new URL(value);return ignoreSearch?`${url.origin}${url.pathname}`:url.href;};

class MemoryCache{
  constructor(){this.entries=new Map();}
  async put(request,response){this.entries.set(keyOf(request),response.clone());}
  async match(request,{ignoreSearch=false}={}){
    const wanted=comparable(keyOf(request),ignoreSearch);
    for(const [key,response] of this.entries){
      if(comparable(key,ignoreSearch)===wanted)return response.clone();
    }
    return undefined;
  }
  async keys(){return [...this.entries.keys()].map(url=>new Request(url));}
  async delete(request){
    const key=keyOf(request);
    if(this.entries.delete(key))return true;
    const wanted=comparable(key,true);
    for(const stored of this.entries.keys()){
      if(comparable(stored,true)===wanted)return this.entries.delete(stored);
    }
    return false;
  }
}

const cacheStores=new Map();
const caches={
  async open(name){if(!cacheStores.has(name))cacheStores.set(name,new MemoryCache());return cacheStores.get(name);},
  async keys(){return [...cacheStores.keys()];},
  async delete(name){return cacheStores.delete(name);}
};

const mime=file=>file.endsWith('.html')?'text/html; charset=utf-8'
  :file.endsWith('.js')?'text/javascript; charset=utf-8'
    :file.endsWith('.css')?'text/css; charset=utf-8'
      :file.endsWith('.json')||file.endsWith('.webmanifest')?'application/json; charset=utf-8'
        :file.endsWith('.webp')?'image/webp'
          :file.endsWith('.png')?'image/png':'application/octet-stream';

const fetchMock=async request=>{
  const url=new URL(keyOf(request));
  if(!online)throw new TypeError('network-offline');
  if(url.origin!==new URL(scope).origin)return new Response('',{status:502});
  const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}${path.sep}`)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    return new Response('not-found',{status:404});
  }
  const body=fs.readFileSync(file);
  return new Response(body,{status:200,headers:{
    'content-type':mime(file),'content-length':String(body.length),'cache-control':'public, max-age=60'
  }});
};

const listeners=new Map();
const self={
  location:new URL(scope),
  registration:{scope,navigationPreload:{enable:async()=>{navigationPreloadEnabled=true;}},showNotification:async()=>{}},
  clients:{
    claim:async()=>{claimCalls+=1;},
    matchAll:async()=>[{url:scope,postMessage(){},focus:async()=>{}}],
    openWindow:async()=>null
  },
  skipWaiting:async()=>{skipWaitingCalls+=1;},
  addEventListener:(type,handler)=>listeners.set(type,handler)
};

const context=vm.createContext({
  self,caches,fetch:fetchMock,Request,Response,URL,AbortController,Date,Intl,
  setTimeout,clearTimeout,console
});
vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),context,{filename:'sw.js'});

const waitEvent=async(type,event={})=>{
  let task=Promise.resolve();
  event.waitUntil=value=>{task=Promise.resolve(value);};
  listeners.get(type)?.(event);
  await task;
  return event;
};
const message=async data=>{
  let reply;
  await waitEvent('message',{data,ports:[{postMessage:value=>{reply=value;}}]});
  return reply;
};
const fetchEvent=async request=>{
  let responseTask;
  listeners.get('fetch')?.({
    request,preloadResponse:undefined,
    respondWith:value=>{responseTask=Promise.resolve(value);}
  });
  return responseTask?responseTask:null;
};

await waitEvent('install');
check(skipWaitingCalls===1,'install:skip-waiting');
check(cacheStores.has('divina-bruxa-v581-shell'),'install:cache-v581');
const shellCache=cacheStores.get('divina-bruxa-v581-shell');
check((await shellCache.keys()).length>=127,'install:atomic-shell-size');
for(const file of [
  'app-v208.js','living-universe-core-v524.js','whit-orb-soul-bridge-v581.js',
  'experience-message-governor-v580.js','orb-persistent-journey-v565.js','whit-signature-v311.js'
]){
  const response=await shellCache.match(new Request(`${scope}${file}`));
  check(response?.status===200,`install:critical:${file}`);
}

const oldCache=await caches.open('divina-bruxa-v580-shell');
await oldCache.put(new Request(`${scope}old.js`),new Response('old'));
await waitEvent('activate');
check(navigationPreloadEnabled,'activate:navigation-preload');
check(claimCalls===1,'activate:clients-claim');
check(!cacheStores.has('divina-bruxa-v580-shell'),'activate:remove-v580-cache');

let result=await message({type:'VERIFY_SHELL'});
check(result?.complete===true&&result?.atomic===true&&result?.version===581,'verify:complete-v581');
check(result?.ready===result?.total,'verify:complete-count');

online=false;
let response=await fetchEvent(new Request(`${scope}whit-orb-soul-bridge-v581.js?v=581`));
check(response?.status===200&&(await response.text()).includes('WhitOrbSoulBridgeV581'),'offline:whit-bridge-from-atomic-shell');
response=await fetchEvent(new Request(`${scope}living-universe-core-v524.js?v=581-living-universe`));
check(response?.status===200&&/const\s+RELEASE\s*=\s*581/.test(await response.text()),'offline:universe-from-atomic-shell');
response=await fetchEvent(new Request(`${scope}api/admin/private`,{headers:{authorization:'Bearer qa'}}));
check(response?.status===503,'offline:private-route-fail-closed');
check(response?.headers.get('cache-control')==='no-store','offline:private-route-no-store');

online=true;
response=await fetchEvent({
  url:`${scope}index.html?v581=1`,method:'GET',mode:'navigate',destination:'document',
  cache:'default',headers:new Headers()
});
check(response?.status===200&&(await response.text()).includes('app-v208.js?v=581'),'navigation:v581-shell-valid');
const contentCache=cacheStores.get('divina-bruxa-v581-content');
check(Boolean(await contentCache?.match(new Request(`${scope}index.html?v581=1`))),'navigation:valid-shell-cached');

await shellCache.delete(new Request(`${scope}whit-orb-soul-bridge-v581.js`));
result=await message({type:'VERIFY_SHELL'});
check(result?.complete===false&&result?.missing?.includes('./whit-orb-soul-bridge-v581.js'),'repair:bridge-corruption-detected');
result=await message({type:'REPAIR_SHELL'});
check(result?.complete===true,'repair:atomic-shell-restored');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V581',base:'V580',state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,failures
},null,2));
if(failures.length)process.exitCode=1;
