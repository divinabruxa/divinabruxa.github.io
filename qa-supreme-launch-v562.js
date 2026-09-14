/* DIVINA BRUXA 4.0 — QA SUPREMO · MACROETAPA 14/14 · V562
   Diagnóstico público e efêmero. Não lê conteúdo privado, formulários,
   armazenamento, sessão, APIs, analytics ou dados de cobrança. */

const ROUTE_IDS_V562=Object.freeze([
  'home','tarot','daily','library','school','spreads','ai','journal','store',
  'consultations','subscriptions','skins','videos','music','notifications','login','admin'
]);
const ROUTE_SET_V562=new Set(ROUTE_IDS_V562);
const MAX_SAFE_EVENTS_V562=40;

export const QA_SUPREME_LAUNCH_CONTRACT_V562=Object.freeze({
  release:'V562',
  macroStage:'14-of-14',
  title:'QA Supremo',
  preserves:'V561',
  environment:'staging',
  requiredP0:0,
  requiredP1:0,
  evidenceStates:Object.freeze(['PASS','FAIL','BLOCKED','NOT RUN']),
  routeIds:ROUTE_IDS_V562,
  routeCount:17,
  auditDomains:Object.freeze([
    'syntax','references','console','404','pwa','offline','tarot-78',
    'daily-concurrency','spreads','skins','accessibility','security','rls',
    'duplicate-webhooks','simultaneous-credits','backup-restore','sandbox-billing'
  ]),
  ownerApprovalRequired:true,
  ownerApprovalState:'BLOCKED',
  productionReady:false,
  productionPublish:false,
  dnsChanges:false,
  realBilling:false,
  storeSubmission:false,
  sol:false,
  storageReads:0,
  storageWrites:0,
  privateContentReads:0,
  formValueReads:0,
  apiCalls:0,
  mutationObservers:0,
  permanentAnimationLoops:0
});

export function summarizeQaEvidenceV562(records=[]){
  const counts={PASS:0,FAIL:0,BLOCKED:0,'NOT RUN':0};
  for(const record of Array.isArray(records)?records:[]){
    const state=String(record?.state||'').toUpperCase();
    if(Object.prototype.hasOwnProperty.call(counts,state))counts[state]+=1;
  }
  const gate=counts.FAIL>0?'FAIL':counts.BLOCKED>0?'BLOCKED':counts['NOT RUN']>0?'NOT RUN':'PASS';
  return Object.freeze({...counts,gate,total:Object.values(counts).reduce((sum,value)=>sum+value,0)});
}

const safeRouteV562=value=>{
  const route=String(value||'').replace(/^#/,'');
  return ROUTE_SET_V562.has(route)?route:'unknown';
};

const safeAssetV562=value=>{
  try{
    const name=new URL(String(value||''),globalThis.location?.href||'https://local.invalid/').pathname.split('/').pop()||'unknown';
    return name.replace(/[^a-z0-9._-]/gi,'').slice(0,96)||'unknown';
  }catch{return'unknown';}
};

let singletonV562=null;

class QaSupremeLaunchV562{
  constructor(){
    this.abort=new AbortController();
    this.events=[];
    this.routes=new Map();
    this.lastAudit=null;
    this.install();
  }

  listen(target,type,handler,options={}){
    target?.addEventListener?.(type,handler,{...options,signal:this.abort.signal});
  }

  remember(kind,detail={}){
    this.events.push(Object.freeze({
      kind:String(kind||'unknown').slice(0,40),
      route:safeRouteV562(detail.route),
      asset:safeAssetV562(detail.asset),
      at:new Date().toISOString()
    }));
    if(this.events.length>MAX_SAFE_EVENTS_V562)this.events.splice(0,this.events.length-MAX_SAFE_EVENTS_V562);
  }

  install(){
    const root=document.documentElement;
    root.dataset.qaSupremeLaunch='v562';
    root.dataset.qaOwnerApproval='required';
    root.dataset.qaLaunchGate='blocked';

    this.listen(document,'divina:page-loading',event=>{
      const route=safeRouteV562(event.detail?.id);
      if(route!=='unknown')this.routes.set(route,'loading');
    },{passive:true});
    this.listen(document,'divina:page-ready',event=>{
      const route=safeRouteV562(event.detail?.id);
      if(route!=='unknown')this.routes.set(route,'ready');
      this.audit('page-ready');
    },{passive:true});
    this.listen(document,'divina:page-error',event=>{
      const route=safeRouteV562(event.detail?.id);
      if(route!=='unknown')this.routes.set(route,'error');
      this.remember('route-error',{route});
      this.audit('page-error');
    },{passive:true});
    this.listen(globalThis,'error',event=>{
      const asset=event.filename||event.target?.src||event.target?.href||'';
      const kind=event.target?.src||event.target?.href?'asset-error':'runtime-error';
      this.remember(kind,{asset});
      this.audit(kind);
    },{capture:true});
    this.listen(globalThis,'unhandledrejection',()=>{
      this.remember('unhandled-rejection');
      this.audit('unhandled-rejection');
    });
    this.listen(document,'divina:boot-ready',()=>this.audit('boot-ready'),{once:true,passive:true});
    this.lastAudit=this.audit('install');
    document.dispatchEvent(new CustomEvent('divina:qa-supreme-launch-ready',{
      detail:Object.freeze({release:'V562',ownerApprovalRequired:true,productionReady:false})
    }));
  }

  duplicateIds(){
    const seen=new Set();
    const duplicates=new Set();
    document.querySelectorAll('[id]').forEach(element=>{
      if(seen.has(element.id))duplicates.add(element.id);
      seen.add(element.id);
    });
    return[...duplicates].sort();
  }

  audit(reason='manual'){
    const activeScreens=[...document.querySelectorAll('.screen.active:not([hidden])')];
    const recoveryRoutes=[...document.querySelectorAll('[data-route-recovery]')]
      .map(element=>safeRouteV562(element.dataset.routeRecovery))
      .filter(route=>route!=='unknown');
    const missingRoutes=ROUTE_IDS_V562.filter(id=>!document.getElementById(id));
    const duplicateIds=this.duplicateIds();
    const horizontalOverflow=document.documentElement.scrollWidth>document.documentElement.clientWidth+1;
    const runtimeErrors=this.events.filter(event=>event.kind==='runtime-error'||event.kind==='unhandled-rejection');
    const assetErrors=this.events.filter(event=>event.kind==='asset-error');
    const openP0=recoveryRoutes.length+runtimeErrors.length;
    const openP1=missingRoutes.length+duplicateIds.length+assetErrors.length+(horizontalOverflow?1:0)+(activeScreens.length>1?1:0);
    this.lastAudit=Object.freeze({
      release:'V562',
      reason:String(reason),
      routeCount:ROUTE_IDS_V562.length,
      missingRoutes:Object.freeze(missingRoutes),
      duplicateIds:Object.freeze(duplicateIds),
      activeScreenCount:activeScreens.length,
      horizontalOverflow,
      recoveryRoutes:Object.freeze(recoveryRoutes),
      loadedRouteStates:Object.freeze(Object.fromEntries(this.routes)),
      sanitizedRuntimeEventCount:this.events.length,
      openP0,
      openP1,
      browserSessionPass:openP0===0&&openP1===0,
      ownerApprovalRequired:true,
      ownerApprovalState:'BLOCKED',
      productionReady:false
    });
    return this.lastAudit;
  }

  status(){
    return Object.freeze({
      release:'V562',
      contract:QA_SUPREME_LAUNCH_CONTRACT_V562,
      audit:this.lastAudit||this.audit('status'),
      safeEvents:Object.freeze([...this.events]),
      ownerApprovalState:'BLOCKED',
      productionReady:false
    });
  }

  destroy(){
    this.abort.abort();
    delete document.documentElement.dataset.qaSupremeLaunch;
    delete document.documentElement.dataset.qaOwnerApproval;
    delete document.documentElement.dataset.qaLaunchGate;
    if(singletonV562===this)singletonV562=null;
  }
}

export function createQaSupremeLaunchV562(){
  if(typeof document==='undefined')return null;
  if(singletonV562)return singletonV562;
  singletonV562=new QaSupremeLaunchV562();
  globalThis.divinaQaSupremeLaunchV562=singletonV562;
  return singletonV562;
}
