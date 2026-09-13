import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const scope='http://divina.local/';
let online=true,passed=0,skipWaitingCalls=0,claimCalls=0,releaseMessages=0,navigationPreloadEnabled=false;
const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const keyOf=request=>typeof request==='string'?new URL(request,scope).href:request.url;
const comparable=(value,ignoreSearch)=>{const url=new URL(value);return ignoreSearch?`${url.origin}${url.pathname}`:url.href;};

class MemoryCache{
  constructor(){this.entries=new Map();this.failNextPut=false;}
  async put(request,response){if(this.failNextPut){this.failNextPut=false;throw new Error('simulated-cache-quota');}this.entries.set(keyOf(request),response.clone());}
  async match(request,{ignoreSearch=false}={}){
    const wanted=comparable(keyOf(request),ignoreSearch);
    for(const [key,response] of this.entries)if(comparable(key,ignoreSearch)===wanted)return response.clone();
    return undefined;
  }
  async keys(){return [...this.entries.keys()].map(url=>new Request(url));}
  async delete(request){
    const key=keyOf(request);if(this.entries.delete(key))return true;
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
const mime=file=>file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':file.endsWith('.json')||file.endsWith('.webmanifest')?'application/json; charset=utf-8':file.endsWith('.webp')?'image/webp':file.endsWith('.png')?'image/png':'application/octet-stream';
const fetchMock=async request=>{
  const url=new URL(keyOf(request));if(!online)throw new TypeError('network-offline');
  if(url.origin!==new URL(scope).origin)return new Response('',{status:502});
  let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}${path.sep}`)||!fs.existsSync(file)||!fs.statSync(file).isFile())return new Response('not-found',{status:404});
  const body=fs.readFileSync(file);
  return new Response(body,{status:200,headers:{'content-type':mime(file),'content-length':String(body.length),'cache-control':'public, max-age=60'}});
};

const listeners=new Map();
const self={
  location:new URL(scope),
  registration:{scope,navigationPreload:{enable:async()=>{navigationPreloadEnabled=true;}}},
  clients:{
    claim:async()=>{claimCalls+=1;},
    matchAll:async()=>[{url:scope,postMessage:message=>{if(message?.type==='DIVINA_RELEASE_READY')releaseMessages+=1;},focus:async()=>{}}],
    openWindow:async()=>null
  },
  skipWaiting:async()=>{skipWaitingCalls+=1;},
  addEventListener:(type,handler)=>listeners.set(type,handler)
};
const context=vm.createContext({self,caches,fetch:fetchMock,Request,Response,URL,AbortController,setTimeout,clearTimeout,console});
vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),context,{filename:'sw.js'});

const waitEvent=async(type,event={})=>{let task=Promise.resolve();event.waitUntil=value=>{task=Promise.resolve(value);};listeners.get(type)?.(event);await task;return event;};
const message=async data=>{let reply;await waitEvent('message',{data,ports:[{postMessage:value=>{reply=value;}}]});return reply;};
const fetchEvent=async request=>{let responseTask;listeners.get('fetch')?.({request,preloadResponse:undefined,respondWith:value=>{responseTask=Promise.resolve(value);}});return responseTask?responseTask:null;};

await waitEvent('install');
check(skipWaitingCalls===1,'install-skip-waiting');
check(cacheStores.has('divina-bruxa-v549-shell'),'install-cache-v548');
check((await cacheStores.get('divina-bruxa-v549-shell').keys()).length>=120,'install-shell-atomico');
check(!cacheStores.has('divina-bruxa-v549-offline-core'),'install-sem-cache-opcional');

const oldCache=await caches.open('divina-bruxa-v546-shell');
await oldCache.put(new Request(`${scope}old.js`),new Response('old'));
await waitEvent('activate');
check(navigationPreloadEnabled,'activate-navigation-preload');
check(claimCalls===1,'activate-claim');
check(releaseMessages===1,'activate-release-ready');
check(!cacheStores.has('divina-bruxa-v546-shell'),'activate-remove-cache-antigo');

let result=await message({type:'VERIFY_SHELL'});
check(result?.complete===true&&result?.atomic===true,'verify-shell-completo');
check(result?.ready===result?.total,'verify-shell-contagem');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:false});
check(result?.complete===false&&result?.reason==='server-entitlement-required','premium-fail-closed');
check(!cacheStores.has('divina-bruxa-v549-premium-static'),'premium-sem-cache-na-negacao');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:true});
check(result?.complete===true&&result?.grantsEntitlement===false,'premium-cache-nao-concede-direito');
result=await message({type:'PREPARE_OFFLINE_CORE'});
check(result?.complete===true,'offline-core-preparado');
check(result?.worlds?.whitLocal===true&&result?.onlineOnly?.whitOnline===true,'offline-whit-separada');
check(result?.onlineOnly?.accountAuthority===true,'offline-conta-autoridade-online');

online=false;
let response=await fetchEvent(new Request(`${scope}laboratorio-fisico-v547.html`,{headers:{accept:'text/html'}}));
check(response?.status===200,'offline-laboratorio-do-cache');
check((await response.text()).includes('Matriz Física da Orbe'),'offline-laboratorio-conteudo');
response=await fetchEvent(new Request(`${scope}api/admin/session`,{headers:{authorization:'Bearer test'}}));
check(response?.status===503,'offline-admin-fail-closed');
check(response?.headers.get('cache-control')==='no-store','offline-admin-no-store');

online=true;
const shellCache=cacheStores.get('divina-bruxa-v549-shell');
await shellCache.delete(new Request(`${scope}security-privacy-core-v547.js`));
result=await message({type:'VERIFY_SHELL'});
check(result?.complete===false&&result?.missing?.includes('./security-privacy-core-v547.js'),'corrupcao-v549-detectada');
result=await message({type:'REPAIR_SHELL'});
check(result?.complete===true,'corrupcao-v549-reparada');

result=await message({type:'CLEAR_OPTIONAL_OFFLINE'});
check(result?.ok===true,'cache-opcional-limpo');
check(!cacheStores.has('divina-bruxa-v549-offline-core')&&!cacheStores.has('divina-bruxa-v549-premium-static'),'stores-opcionais-removidas');
check(result?.authorityDataRemoved===false,'nao-inventa-exclusao-privada');

const contentCache=await caches.open('divina-bruxa-v549-content');contentCache.failNextPut=true;
response=await fetchEvent({url:`${scope}SECURITY-HEADERS-V547.json?quota=1`,method:'GET',mode:'navigate',destination:'document',cache:'default',headers:new Headers()});
check(response?.status===200,'quota-cache-nao-bloqueia-rede');

const total=passed+failures.length;
console.log(`V549 Service Worker runtime: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
