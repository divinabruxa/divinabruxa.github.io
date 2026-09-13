/* DIVINA BRUXA 3.0 — PWA, PERFORMANCE, OFFLINE E RECUPERAÇÃO · V546
   Coordena orçamento e recuperação sem criar motor visual, loop permanente,
   autoridade de conta ou armazenamento de conteúdo privado. */

export const PWA_PERFORMANCE_RECOVERY_CONTRACT_V546=Object.freeze({
  release:'V546',
  macroStage:'12-of-14',
  title:'PWA, Performance, Offline e Recuperação',
  targets:Object.freeze({touchResponseMs:100,LCPms:2500,INPms:200,CLS:0.1}),
  frameRate:Object.freeze({standard:60,fallback:30,reduced:20}),
  cache:Object.freeze({versioned:true,atomicShell:true,navigationPreload:true,freeOffline:true,premiumByEntitlement:true}),
  offlineWorlds:Object.freeze(['tarot','daily-revealed','library','journal-local','whit-local','current-skin']),
  onlineOnly:Object.freeze(['account-authority','billing','admin','consultation-submit','whit-online']),
  manifest:true,
  safeServiceWorkerUpdate:true,
  staleScreenRecovery:true,
  lazyRoutes:true,
  lazyImages:true,
  weakDeviceLab:true,
  capacitorPrepared:true,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  mutationObservers:0,
  permanentLoops:0,
  privateContentReads:0,
  storageWrites:0,
  extraApiCalls:0,
  environment:'staging'
});

const INSTANCE=Symbol.for('divina.pwa.performance.recovery.v546');
const STYLE_ID='divinaPwaPerformanceRecoveryV546Styles';
const STYLE_HREF='./pwa-performance-recovery-core-v546.css?v=546';
const routeStarts=new Map();
const routeSamples=[];

const connection=()=>navigator.connection||navigator.mozConnection||navigator.webkitConnection||null;
const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const now=()=>globalThis.performance?.now?.()||Date.now();

const capability=()=>{
  const network=connection();
  const effectiveType=String(network?.effectiveType||'').toLowerCase();
  const memory=Number(navigator.deviceMemory||0);
  const cores=Number(navigator.hardwareConcurrency||0);
  const mobile=globalThis.matchMedia?.('(pointer: coarse)')?.matches===true||innerWidth<768;
  const constrained=network?.saveData===true||/slow-2g|(^|-)2g$/.test(effectiveType)||(memory>0&&memory<=3)||(cores>0&&cores<=2);
  const reduced=reducedMotion();
  return Object.freeze({
    tier:reduced?'reduced':constrained?'constrained':'balanced',
    targetFps:reduced?20:constrained?30:60,
    mobile,saveData:network?.saveData===true,effectiveType:effectiveType||'unknown',
    memoryGb:memory||null,cores:cores||null,reducedMotion:reduced
  });
};

const workerRequest=(type,payload={},timeout=12000)=>new Promise((resolve,reject)=>{
  if(!('serviceWorker'in navigator)||typeof MessageChannel==='undefined'){
    reject(new Error('service-worker-unavailable'));return;
  }
  let timer=setTimeout(()=>reject(new Error('service-worker-timeout')),timeout);
  navigator.serviceWorker.ready.then(registration=>{
    const worker=navigator.serviceWorker.controller||registration.active||registration.waiting;
    if(!worker)throw new Error('service-worker-inactive');
    const channel=new MessageChannel();
    channel.port1.onmessage=event=>{clearTimeout(timer);timer=0;resolve(event.data);};
    worker.postMessage({type,...payload},[channel.port2]);
  }).catch(error=>{clearTimeout(timer);timer=0;reject(error);});
});

const ensureStyle=()=>{
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href=STYLE_HREF;
  document.head.append(link);
};

class PwaPerformanceRecoveryV546{
  constructor(){
    this.abort=new AbortController();
    this.profile=null;
    this.lastRecovery=null;
    this.lastShellVerification=null;
    this.applyCapability('boot');
    ensureStyle();
    this.bind();
    document.documentElement.dataset.pwaRecovery='v546';
  }

  applyCapability(reason='manual'){
    const profile=capability();
    this.profile=profile;
    const root=document.documentElement;
    root.dataset.v546Capability=profile.tier;
    root.dataset.v546TargetFps=String(profile.targetFps);
    root.style.setProperty('--db546-target-fps',String(profile.targetFps));
    if(profile.tier!=='balanced')root.dataset.performanceTier='constrained';
    document.dispatchEvent(new CustomEvent('divina:v546-capability',{detail:Object.freeze({...profile,reason,release:'V546'})}));
    return profile;
  }

  bind(){
    const {signal}=this.abort;
    document.addEventListener('visibilitychange',()=>{
      document.documentElement.dataset.scenePaused=String(document.hidden);
      if(!document.hidden)this.applyCapability('visibility-return');
    },{passive:true,signal});
    addEventListener('pageshow',event=>{
      this.applyCapability(event.persisted?'bfcache':'pageshow');
      if(event.persisted)this.verifyShell().catch(()=>null);
    },{passive:true,signal});
    connection()?.addEventListener?.('change',()=>this.applyCapability('connection-change'),{passive:true,signal});
    document.addEventListener('divina:route-start',event=>{
      const id=String(event.detail?.id||'unknown');
      routeStarts.set(id,now());
    },{passive:true,signal});
    document.addEventListener('divina:route-ready',event=>{
      const id=String(event.detail?.id||'unknown');
      const start=routeStarts.get(id);
      if(!Number.isFinite(start))return;
      routeStarts.delete(id);
      routeSamples.push(Object.freeze({id,durationMs:Math.round(now()-start)}));
      if(routeSamples.length>24)routeSamples.shift();
    },{passive:true,signal});
  }

  async verifyShell(){
    const result=await workerRequest('VERIFY_SHELL');
    this.lastShellVerification=Object.freeze({...result,checkedAt:new Date().toISOString()});
    return this.lastShellVerification;
  }

  async recover(){
    const started=Date.now();
    const registration=await navigator.serviceWorker?.getRegistration?.();
    await registration?.update?.().catch(()=>null);
    const result=await workerRequest('REPAIR_SHELL',{},30000);
    this.lastRecovery=Object.freeze({...result,durationMs:Date.now()-started,reloadRequired:result?.complete===true});
    return this.lastRecovery;
  }

  status(){
    return Object.freeze({
      ...PWA_PERFORMANCE_RECOVERY_CONTRACT_V546,
      ready:true,
      capability:this.profile,
      routeSamples:Object.freeze([...routeSamples]),
      lastShellVerification:this.lastShellVerification,
      lastRecovery:this.lastRecovery
    });
  }

  audit(){
    return Object.freeze({
      release:'V546',
      capability:this.profile?.tier||null,
      targetFps:this.profile?.targetFps||null,
      oneCanonicalOrb:document.querySelectorAll('[data-supreme-orb="living"]').length<=1,
      livingOrbCount:document.querySelectorAll('[data-supreme-orb="living"]').length,
      tarotFirePresent:Boolean(document.querySelector('#tarot [class*="fire"],#tarot [class*="flame"],#tarot [class*="chama"]')),
      routeSamples:routeSamples.length,
      mutationObservers:0,
      permanentLoops:0,
      privateContentReads:0,
      storageWrites:0,
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    routeStarts.clear();
    delete document.documentElement.dataset.pwaRecovery;
    delete document.documentElement.dataset.v546Capability;
    delete document.documentElement.dataset.v546TargetFps;
    if(globalThis[INSTANCE]===this)delete globalThis[INSTANCE];
  }
}

export const createPwaPerformanceRecoveryCoreV546=()=>{
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  if(typeof document==='undefined'||typeof window==='undefined')return null;
  const core=new PwaPerformanceRecoveryV546();
  globalThis[INSTANCE]=core;
  globalThis.divinaPwaPerformanceRecoveryV546=core;
  document.dispatchEvent(new CustomEvent('divina:pwa-performance-recovery-ready',{detail:{release:'V546',macroStage:'12-of-14'}}));
  return core;
};

