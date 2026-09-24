/* Divina Bruxa 3.0 — ponte PWA mínima para as páginas públicas. */
const RELEASE='3.0.0-20260924';
const CACHE_PREFIX='divina-bruxa-3-shell-';
let initialized=false;
let registrationPromise=null;

const language=()=>document.documentElement.lang.toLowerCase().startsWith('en')?'en':document.documentElement.lang.toLowerCase().startsWith('es')?'es':'pt';
const copy=()=>({
  pt:{preparing:'Preparando o núcleo leve…',ready:'Núcleo offline preparado. Cartas e skins entram no cache somente quando você as abre.',missing:'O núcleo ainda não está completo.',checking:'Verificando o núcleo…',repairing:'Atualizando os arquivos públicos…',repaired:'Arquivos atualizados. Reabra a Divina Bruxa.',unsupported:'Este navegador não oferece instalação offline.'},
  en:{preparing:'Preparing the lightweight core…',ready:'Offline core prepared. Cards and skins are cached only when you open them.',missing:'The core is not complete yet.',checking:'Checking the core…',repairing:'Updating public files…',repaired:'Files updated. Reopen Divina Bruxa.',unsupported:'This browser does not offer offline installation.'},
  es:{preparing:'Preparando el núcleo ligero…',ready:'Núcleo sin conexión preparado. Las cartas y skins entran en caché solo cuando las abres.',missing:'El núcleo todavía no está completo.',checking:'Verificando el núcleo…',repairing:'Actualizando los archivos públicos…',repaired:'Archivos actualizados. Vuelve a abrir Divina Bruxa.',unsupported:'Este navegador no ofrece instalación sin conexión.'}
})[language()];

function output(message){
  const primary=document.querySelector('[data-offline-result]');
  const health=document.querySelector('[data-offline-health]');
  if(primary)primary.textContent=message;
  if(health)health.textContent=message;
}

async function register({fresh=false}={}){
  if(!('serviceWorker' in navigator)||!('caches' in window))throw new Error('unsupported');
  if(fresh){
    const existing=await navigator.serviceWorker.getRegistration('./');
    if(existing)await existing.unregister();
    for(const key of await caches.keys())if(key.startsWith('divina-bruxa-'))await caches.delete(key);
    registrationPromise=null;
  }
  if(!registrationPromise)registrationPromise=navigator.serviceWorker.register(`./sw.js?v=${RELEASE}`,{updateViaCache:'none'}).then(async registration=>{
    await registration.update();
    if(registration.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});
    return registration;
  });
  return registrationPromise;
}

async function verify(){
  const keys=(await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX));
  if(!keys.length)return false;
  const cache=await caches.open(keys.sort().at(-1));
  return Boolean(await cache.match(new URL('./index.html',location.href).href))&&Boolean(await cache.match(new URL('./app.js',location.href).href));
}

async function prepare(){
  output(copy().preparing);
  try{await register();await navigator.serviceWorker.ready;output((await verify())?copy().ready:copy().missing);}
  catch{output(copy().unsupported);}
}

async function check(){
  output(copy().checking);
  try{output((await verify())?copy().ready:copy().missing);}
  catch{output(copy().missing);}
}

async function repair(){
  output(copy().repairing);
  try{await register({fresh:true});await navigator.serviceWorker.ready;output(copy().repaired);}
  catch{output(copy().unsupported);}
}

export function initializePwaV324(){
  if(initialized)return;
  initialized=true;
  document.querySelector('[data-prepare-offline]')?.addEventListener('click',prepare);
  document.querySelector('[data-verify-offline]')?.addEventListener('click',check);
  document.querySelector('[data-repair-offline]')?.addEventListener('click',repair);
  register().catch(()=>{});
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializePwaV324,{once:true});
  else queueMicrotask(initializePwaV324);
}
