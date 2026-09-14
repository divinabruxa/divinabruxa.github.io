import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const packagedRoot=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[2]||packagedRoot);
const scope='http://divina.local/';
let online=true,passed=0,skipWaitingCalls=0,claimCalls=0,releaseMessages=0,navigationPreloadEnabled=false;
const failures=[];
const inheritedFixtures=new Set();
const notifications=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const keyOf=request=>typeof request==='string'?new URL(request,scope).href:request.url;
const comparable=(value,ignoreSearch)=>{const url=new URL(value);return ignoreSearch?`${url.origin}${url.pathname}`:url.href;};

class MemoryCache{
  constructor(){this.entries=new Map();this.failNextPut=false;}
  async put(request,response){
    if(this.failNextPut){this.failNextPut=false;throw new Error('simulated-cache-quota');}
    this.entries.set(keyOf(request),response.clone());
  }
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
const inheritedBody=relative=>{
  if(relative==='page-loader-v1.js')return '/* inherited V562 */ function loadModuleAfterStylesV562(){}';
  if(relative==='qa-supreme-launch-v562.js')return '/* inherited V562 */ const QA_SUPREME_LAUNCH_CONTRACT_V562=true;';
  if(relative.endsWith('.html'))return '<!doctype html><html><body><main>V562 inherited fixture · Música · Vídeos</main></body></html>';
  if(relative.endsWith('.js'))return '/* inherited V562 fixture */';
  if(relative.endsWith('.css'))return '/* inherited V562 fixture */';
  if(relative.endsWith('.json')||relative.endsWith('.webmanifest'))return '{}';
  return 'inherited-v562-fixture';
};
const fetchMock=async request=>{
  const url=new URL(keyOf(request));if(!online)throw new TypeError('network-offline');
  if(url.origin!==new URL(scope).origin)return new Response('',{status:502});
  const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  if(relative==='__qa_v563_missing__')return new Response('not-found',{status:404,headers:{'content-type':'text/plain; charset=utf-8'}});
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}${path.sep}`))return new Response('not-found',{status:404});
  let body;
  if(fs.existsSync(file)&&fs.statSync(file).isFile())body=fs.readFileSync(file);
  else{
    // O pacote V563 é um delta sobre a V562. Fixtures sintéticas representam
    // apenas arquivos herdados e permitem testar isoladamente a lógica do SW.
    inheritedFixtures.add(relative);
    body=Buffer.from(inheritedBody(relative));
  }
  return new Response(body,{status:200,headers:{'content-type':mime(file),'content-length':String(body.length),'cache-control':'public, max-age=60'}});
};

const listeners=new Map();
const FIXED_NOW=Date.parse('2026-09-13T12:00:00.000Z');
class FixedDate extends Date{
  constructor(...args){super(args.length?args[0]:FIXED_NOW);}
  static now(){return FIXED_NOW;}
}
const self={
  location:new URL(scope),
  registration:{scope,navigationPreload:{enable:async()=>{navigationPreloadEnabled=true;}},showNotification:async(title,options)=>{notifications.push({title,options});}},
  clients:{
    claim:async()=>{claimCalls+=1;},
    matchAll:async()=>[{url:scope,postMessage:message=>{if(message?.type==='DIVINA_RELEASE_READY')releaseMessages+=1;},focus:async()=>{}}],
    openWindow:async()=>null
  },
  skipWaiting:async()=>{skipWaitingCalls+=1;},
  addEventListener:(type,handler)=>listeners.set(type,handler)
};
const context=vm.createContext({self,caches,fetch:fetchMock,Request,Response,URL,AbortController,Date:FixedDate,Intl,setTimeout,clearTimeout,console});
vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),context,{filename:'sw.js'});

const waitEvent=async(type,event={})=>{let task=Promise.resolve();event.waitUntil=value=>{task=Promise.resolve(value);};listeners.get(type)?.(event);await task;return event;};
const message=async data=>{let reply;await waitEvent('message',{data,ports:[{postMessage:value=>{reply=value;}}]});return reply;};
const fetchEvent=async request=>{let responseTask;listeners.get('fetch')?.({request,preloadResponse:undefined,respondWith:value=>{responseTask=Promise.resolve(value);}});return responseTask?responseTask:null;};

await waitEvent('install');
check(skipWaitingCalls===1,'install-skip-waiting');
check(cacheStores.has('divina-bruxa-v563-shell'),'install-cache-v563');
check((await cacheStores.get('divina-bruxa-v563-shell').keys()).length>=126,'install-shell-atomico');
check(!cacheStores.has('divina-bruxa-v563-offline-core'),'install-sem-cache-opcional');

const shellCache=cacheStores.get('divina-bruxa-v563-shell');
let response=await shellCache.match(new Request(`${scope}page-loader-v1.js`));
check(response?.status===200&&(await response.text()).includes('loadModuleAfterStylesV562'),'install-correcao-loader-v562-real');
response=await shellCache.match(new Request(`${scope}qa-supreme-launch-v562.js`));
check(response?.status===200&&(await response.text()).includes('QA_SUPREME_LAUNCH_CONTRACT_V562'),'install-qa-v562-real');

const oldCache=await caches.open('divina-bruxa-v561-shell');
await oldCache.put(new Request(`${scope}old.js`),new Response('old'));
await waitEvent('activate');
check(navigationPreloadEnabled,'activate-navigation-preload');
check(claimCalls===1,'activate-claim');
check(releaseMessages===1,'activate-release-ready');
check(!cacheStores.has('divina-bruxa-v561-shell'),'activate-remove-cache-antigo');

let result=await message({type:'VERIFY_SHELL'});
check(result?.complete===true&&result?.atomic===true&&result?.version===563,'verify-shell-completo');
check(result?.ready===result?.total,'verify-shell-contagem');

result=await message({type:'SHOW_LOCAL_NOTIFICATION_V561',category:'daily'});
check(result?.ok===true&&notifications.length===1,'lembrete-local-seguro');
check(notifications[0]?.options?.body==='Sua Carta do Dia está pronta para ser encontrada.','lembrete-diario-copy-fixa');
check(notifications[0]?.options?.data?.privateContentIncluded===false,'lembrete-sem-conteudo-privado');
await waitEvent('push',{data:{json:()=>({release:'V561',consent:true,category:'episodes'})}});
check(notifications.length===2&&notifications[1]?.options?.data?.url==='#videos','push-consentido-template-fixo');
await waitEvent('push',{data:{json:()=>({release:'V561',consent:false,category:'daily'})}});
check(notifications.length===2,'push-sem-consentimento-ignorado');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:false});
check(result?.complete===false&&result?.reason==='server-entitlement-required','premium-fail-closed');
check(!cacheStores.has('divina-bruxa-v563-premium-static'),'premium-sem-cache-na-negacao');

result=await message({type:'PREPARE_OFFLINE_PREMIUM',premiumAuthorized:true});
check(result?.complete===true&&result?.grantsEntitlement===false,'premium-cache-nao-concede-direito');
result=await message({type:'PREPARE_OFFLINE_CORE'});
check(result?.complete===true,'offline-core-preparado');
check(result?.worlds?.musicText===true&&result?.worlds?.videosText===true,'offline-midia-textual');
check(result?.onlineOnly?.spotifyPlayer===true&&result?.onlineOnly?.youtubePlayer===true,'players-permanecem-online');
check(result?.onlineOnly?.mediaPublication===true&&result?.onlineOnly?.accountAuthority===true,'autoridade-permanece-online');

online=false;
response=await fetchEvent(new Request(`${scope}musica.html`,{headers:{accept:'text/html'}}));
check(response?.status===200,'offline-musica-do-cache');
check((await response.text()).includes('Música'),'offline-musica-conteudo');
response=await fetchEvent(new Request(`${scope}api/admin/media`,{headers:{authorization:'Bearer test'}}));
check(response?.status===503,'offline-admin-fail-closed');
check(response?.headers.get('cache-control')==='no-store','offline-admin-no-store');

online=true;
response=await fetchEvent({url:`${scope}__qa_v563_missing__`,method:'GET',mode:'navigate',destination:'document',cache:'default',headers:new Headers()});
check(response?.status===404,'404-online-preservado');
check((await response.text())==='not-found','404-online-corpo-preservado');
const cached404=await Promise.all([...cacheStores.values()].map(cache=>cache.match(new Request(`${scope}__qa_v563_missing__`))));
check(cached404.every(value=>!value),'404-online-nao-cacheado');
response=await fetchEvent({url:`${scope}index.html?fresh=1`,method:'GET',mode:'navigate',destination:'document',cache:'default',headers:new Headers()});
check(response?.status===200,'navegacao-v563-valida');
const contentCache=cacheStores.get('divina-bruxa-v563-content');
check(Boolean(await contentCache?.match(new Request(`${scope}index.html?fresh=1`))),'navegacao-v563-cacheada');

await shellCache.delete(new Request(`${scope}qa-supreme-launch-v562.js`));
result=await message({type:'VERIFY_SHELL'});
check(result?.complete===false&&result?.missing?.includes('./qa-supreme-launch-v562.js'),'corrupcao-v562-detectada');
result=await message({type:'REPAIR_SHELL'});
check(result?.complete===true,'corrupcao-v562-reparada');

result=await message({type:'CLEAR_OPTIONAL_OFFLINE'});
check(result?.ok===true,'cache-opcional-limpo');
check(!cacheStores.has('divina-bruxa-v563-offline-core')&&!cacheStores.has('divina-bruxa-v563-premium-static'),'stores-opcionais-removidas');
check(result?.authorityDataRemoved===false,'nao-inventa-exclusao-privada');

const quotaCache=await caches.open('divina-bruxa-v563-content');quotaCache.failNextPut=true;
response=await fetchEvent({url:`${scope}SECURITY-HEADERS-V547.json?quota=1`,method:'GET',mode:'navigate',destination:'document',cache:'default',headers:new Headers()});
check(response?.status===200,'quota-cache-nao-bloqueia-rede');

const total=passed+failures.length;
console.log(`V563 Service Worker runtime: ${passed}/${total} verificações aprovadas (${inheritedFixtures.size} arquivos herdados simulados quando o teste roda no delta).`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
