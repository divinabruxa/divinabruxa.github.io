import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const scope='http://divina.local/';
let online=true;
let passed=0;
const failures=[];
const fetched=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const keyOf=request=>typeof request==='string'?new URL(request,scope).href:request.url;
const comparable=(value,ignoreSearch)=>{
  const url=new URL(value);
  return ignoreSearch?`${url.origin}${url.pathname}`:url.href;
};

class MemoryCache{
  constructor(){this.entries=new Map();this.failNextPut=false;}
  async put(request,response){
    if(this.failNextPut){this.failNextPut=false;throw new Error('simulated-cache-quota');}
    this.entries.set(keyOf(request),response.clone());
  }
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
    for(const stored of this.entries.keys())if(comparable(stored,true)===wanted)return this.entries.delete(stored);
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
  fetched.push(url.href);
  if(!online)throw new TypeError('network-offline');
  if(url.origin!==new URL(scope).origin)return new Response('',{status:502});
  let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if(!relative)relative='index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}${path.sep}`)||!fs.existsSync(file)||!fs.statSync(file).isFile())
    return new Response('not-found',{status:404,headers:{'content-type':'text/plain'}});
  const body=fs.readFileSync(file);
  return new Response(body,{status:200,headers:{'content-type':mime(file),'content-length':String(body.length),'cache-control':'public, max-age=60'}});
};

const listeners=new Map();
let skipWaitingCalls=0;
let claimCalls=0;
let releaseMessages=0;
let navigationPreloadEnabled=false;
const self={
  location:new URL(scope),
  registration:{
    scope,
    navigationPreload:{enable:async()=>{navigationPreloadEnabled=true;}}
  },
  clients:{
    claim:async()=>{claimCalls+=1;},
    matchAll:async()=>[{url:scope,postMessage:message=>{if(message?.type==='DIVINA_RELEASE_READY')releaseMessages+=1;},focus:async()=>{}}],
    openWindow:async()=>null
  },
  skipWaiting:async()=>{skipWaitingCalls+=1;},
  addEventListener:(type,handler)=>listeners.set(type,handler)
};

const context=vm.createContext({
  self,caches,fetch:fetchMock,Request,Response,URL,AbortController,
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
const message=async(data)=>{
  let reply;
  await waitEvent('message',{data,ports:[{postMessage:value=>{reply=value;}}]});
  return reply;
};
const fetchEvent=async(request,preloadResponse=undefined)=>{
  let responseTask;
  const event={request,preloadResponse,respondWith:value=>{responseTask=Promise.resolve(value);}};
  listeners.get('fetch')?.(event);
  return responseTask?responseTask:null;
};

await waitEvent('install');
check(skipWaitingCalls===1,'install-skip-waiting');
check(cacheStores.has('divina-bruxa-v546-shell'),'install-shell-cache');
check((await cacheStores.get('divina-bruxa-v546-shell').keys()).length>=120,'install-atomic-shell-size');
check(!cacheStores.has('divina-bruxa-v546-offline-core'),'install-does-not-precache-full-offline');

const oldCache=await caches.open('divina-bruxa-v545-shell');
await oldCache.put(new Request(`${scope}old.js`),new Response('old'));
await waitEvent('activate');
check(navigationPreloadEnabled,'activate-navigation-preload');
check(claimCalls===1,'activate-clients-claim');
check(releaseMessages===1,'activate-release-message');
check(!cacheStores.has('divina-bruxa-v545-shell'),'activate-removes-old-owned-cache');

let result=await message({type:'VERIFY_SHELL'});
check(result?.complete===true,'verify-shell-complete');
check(result?.ready===result?.total,'verify-shell-count');
check(result?.atomic===true,'verify-shell-atomic');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:false});
check(result?.complete===false&&result?.reason==='server-entitlement-required','premium-denied-without-entitlement');
check(!cacheStores.has('divina-bruxa-v546-premium-static'),'premium-denial-creates-no-cache');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:true});
check(result?.complete===true,'premium-static-prepared');
check(result?.grantsEntitlement===false,'premium-cache-grants-no-right');

result=await message({type:'PREPARE_OFFLINE_CORE'});
check(result?.complete===true,'offline-core-complete');
check(result?.worlds?.whitLocal===true,'offline-whit-local');
check(result?.onlineOnly?.whitOnline===true,'online-whit-separated');
check(result?.onlineOnly?.accountAuthority===true,'account-authority-online');

online=false;
let response=await fetchEvent(new Request(`${scope}tarot-livre.html`,{headers:{accept:'text/html'}}));
check(response?.status===200,'offline-navigation-from-cache');
check((await response.text()).includes('Tarot Livre'),'offline-navigation-content');
response=await fetchEvent(new Request(`${scope}api/auth/session`,{headers:{authorization:'Bearer test'}}));
check(response?.status===503,'offline-authority-fails-closed');
check(response?.headers.get('cache-control')==='no-store','offline-authority-no-store');
check(!fetched.some(url=>/\/api\/(?:billing|payments|checkout|admin)\//.test(url)),'no-authority-prefetch');

online=true;
const shellCache=cacheStores.get('divina-bruxa-v546-shell');
await shellCache.delete(new Request(`${scope}app-v208.js`));
result=await message({type:'VERIFY_SHELL'});
check(result?.complete===false&&result?.missing?.includes('./app-v208.js'),'corruption-detected');
result=await message({type:'REPAIR_SHELL'});
check(result?.complete===true,'corruption-repaired');

result=await message({type:'CLEAR_OPTIONAL_OFFLINE'});
check(result?.ok===true,'optional-caches-cleared');
check(!cacheStores.has('divina-bruxa-v546-offline-core')&&!cacheStores.has('divina-bruxa-v546-premium-static'),'optional-cache-stores-removed');
check(result?.authorityDataRemoved===false,'clear-does-not-claim-private-deletion');

const contentCache=await caches.open('divina-bruxa-v546-content');
contentCache.failNextPut=true;
response=await fetchEvent({
  url:`${scope}QA-V546-PWA-PERFORMANCE-OFFLINE-RECUPERACAO.md?quota-probe=1`,
  method:'GET',mode:'navigate',destination:'document',cache:'default',headers:new Headers()
});
check(response?.status===200,'cache-quota-never-blocks-network-response');

const total=passed+failures.length;
console.log(`V546 Service Worker runtime: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
