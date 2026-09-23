/* DIVINA BRUXA — WORK13 · V629 · ORQUESTRA SUPREMA DOS MUNDOS
   Continuidade event-driven: nenhuma nova Orbe, canvas, física, animação ou
   navegação paralela. Esta camada observa, reconcilia e protege o que existe. */

export const WORK13_WORLDS_V629=Object.freeze([
  'tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','music','videos','skins','subscriptions','login','notifications'
]);

export const ORCHESTRA_CONTRACT_V629=Object.freeze({
  version:629,
  work:'WORK13',
  stage:'orquestra-suprema-dos-mundos',
  worlds:15,
  routeReloads:0,
  extraOrbs:0,
  extraCanvas:0,
  extraPlayers:0,
  extraMenus:0,
  duplicateListeners:false,
  movement:'event-driven',
  iphoneGeometries:8,
  safariReturn:true,
  pwaResume:true,
  offlineContinuity:true,
  reducedMotion:true,
  productionPublishAuthorized:false,
  dnsChangesAuthorized:false,
  realBillingAuthorized:false,
  storeSubmissionAuthorized:false,
  campaignsAuthorized:false,
  orbeAiSolEnabled:false,
  work14:false
});

const ROUTES=new Set(['home',...WORK13_WORLDS_V629,'admin']);
const JOURNEY_STATES=new Set(['home','portal','menu','world','action','return']);

export function normalizeWorldRouteV629(value){
  const route=String(value||'').trim().toLowerCase();
  return ROUTES.has(route)?route:'home';
}

export function nextJourneyStateV629(current,event,route='home'){
  const state=JOURNEY_STATES.has(current)?current:'home';
  const action=String(event||'').trim().toLowerCase();
  const target=normalizeWorldRouteV629(route);
  if(action==='home')return 'home';
  if(action==='portal')return 'portal';
  if(action==='menu')return 'menu';
  if(action==='arrive')return target==='home'?'home':'world';
  if(action==='act'&&state==='world')return 'action';
  if(action==='return'&&(state==='world'||state==='action'))return 'return';
  return state;
}

export function mediaBelongsToRouteV629(media,route){
  if(!media?.closest)return false;
  const screen=media.closest('.screen,[data-screen-root]');
  if(!screen)return false;
  return normalizeWorldRouteV629(screen.id||screen.dataset?.screenRoot)===normalizeWorldRouteV629(route);
}

export function compactJourneyV629(entries,limit=24){
  const list=Array.isArray(entries)?entries.filter(Boolean):[];
  return list.slice(-Math.max(1,Number(limit)||24));
}

export class CosmosSupremeOrchestraV629{
  constructor(options={}){
    this.document=options.document||document;
    this.window=options.window||globalThis;
    this.go=typeof options.go==='function'?options.go:()=>{};
    this.abort=new AbortController();
    this.observer=null;
    this.route=normalizeWorldRouteV629(this.document.body?.dataset.screen||'home');
    this.state=this.route==='home'?'home':'world';
    this.journey=[];
    this.lastAudit=null;
    this.resumeCount=0;
    this.routeCount=0;
    this.actionCount=0;
    this.mediaGuardCount=0;
    this.swUpdateRequested=false;
    this.reducedMotion=this.window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
    this.mount();
  }

  mount(){
    const html=this.document.documentElement;
    html.dataset.work13='v629';
    html.dataset.work13Macro='orquestra-suprema-dos-mundos';
    html.dataset.work13Closed='true';
    html.dataset.work14='false';
    html.dataset.orchestraMotion=this.reducedMotion?'reduced':'full';
    html.dataset.orchestraNetwork=this.window.navigator?.onLine===false?'offline':'online';
    this.bind();
    this.reconcile('mount');
  }

  bind(){
    const {signal}=this.abort;
    const routeEvent=event=>this.reconcile(event.type,event.detail?.to||event.detail?.id);
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
      .forEach(type=>this.document.addEventListener(type,routeEvent,{passive:true,signal}));

    this.document.addEventListener('click',event=>{
      const target=event.target.closest?.('[data-go],button,a');
      if(!target)return;
      const destination=target.dataset?.go;
      const isPentagram=Boolean(target.closest?.('#cosmosEntryIntent,[data-cosmos-entry],[data-pentagram]'));
      if(isPentagram){
        this.state=nextJourneyStateV629(this.state,'return',this.route);
        this.record('return',{route:this.route});
      }else if(destination){
        this.state=nextJourneyStateV629(this.state,'menu',this.route);
        this.record('choice',{from:this.route,to:normalizeWorldRouteV629(destination)});
      }else if(this.route!=='home'){
        this.state=nextJourneyStateV629(this.state,'act',this.route);
        this.actionCount+=1;
        this.record('action',{route:this.route});
      }
    },{capture:true,passive:true,signal});

    this.document.addEventListener('play',event=>this.guardSinglePlayer(event.target),{capture:true,signal});
    this.window.addEventListener('online',()=>this.setNetwork(true),{passive:true,signal});
    this.window.addEventListener('offline',()=>this.setNetwork(false),{passive:true,signal});
    this.window.addEventListener('pageshow',event=>this.resume(event.persisted?'safari-bfcache':'pageshow'),{passive:true,signal});
    this.document.addEventListener('visibilitychange',()=>{
      if(this.document.visibilityState==='visible')this.resume('visibility');
      else this.pauseHiddenMedia();
    },{passive:true,signal});

    const motion=this.window.matchMedia?.('(prefers-reduced-motion: reduce)');
    motion?.addEventListener?.('change',event=>{
      this.reducedMotion=event.matches;
      this.document.documentElement.dataset.orchestraMotion=event.matches?'reduced':'full';
      this.record('motion',{reduced:event.matches});
    },{signal});

    this.observer=new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='data-screen'))this.reconcile('screen-mutation');
    });
    this.observer.observe(this.document.body,{attributes:true,attributeFilter:['data-screen']});
  }

  reconcile(source='event',candidate){
    const next=normalizeWorldRouteV629(candidate||this.document.body?.dataset.screen||this.route);
    const changed=next!==this.route;
    const previous=this.route;
    this.route=next;
    this.state=nextJourneyStateV629(this.state,next==='home'?'home':'arrive',next);
    if(changed){
      this.routeCount+=1;
      this.pauseMediaOutside(next);
      this.record('route',{from:previous,to:next,source});
    }
    this.document.documentElement.dataset.orchestraRoute=next;
    this.document.documentElement.dataset.orchestraState=this.state;
    this.lastAudit=this.audit();
    this.document.dispatchEvent(new CustomEvent('divina:work13-orchestra-reconciled',{
      detail:{version:629,route:next,state:this.state,changed,audit:this.lastAudit}
    }));
    return this.lastAudit;
  }

  guardSinglePlayer(active){
    if(!active||!['AUDIO','VIDEO'].includes(active.tagName))return;
    this.document.querySelectorAll('audio,video').forEach(media=>{
      if(media!==active&&!media.paused){media.pause();this.mediaGuardCount+=1;}
    });
    this.record('player',{route:this.route,kind:active.tagName.toLowerCase()});
  }

  pauseMediaOutside(route){
    this.document.querySelectorAll('audio,video').forEach(media=>{
      if(!media.paused&&!mediaBelongsToRouteV629(media,route)){media.pause();this.mediaGuardCount+=1;}
    });
  }

  pauseHiddenMedia(){
    this.document.querySelectorAll('audio,video').forEach(media=>{
      if(!media.paused){media.pause();this.mediaGuardCount+=1;}
    });
  }

  setNetwork(online){
    this.document.documentElement.dataset.orchestraNetwork=online?'online':'offline';
    this.record('network',{online});
    if(online)this.requestServiceWorkerUpdate();
  }

  resume(source){
    this.resumeCount+=1;
    this.reconcile(source);
    if(this.window.navigator?.onLine!==false)this.requestServiceWorkerUpdate();
  }

  requestServiceWorkerUpdate(){
    if(this.swUpdateRequested||!this.window.navigator?.serviceWorker?.getRegistration)return;
    this.swUpdateRequested=true;
    this.window.navigator.serviceWorker.getRegistration().then(registration=>registration?.update?.()).catch(()=>{})
      .finally(()=>{this.window.setTimeout?.(()=>{this.swUpdateRequested=false;},30000);});
  }

  record(type,detail={}){
    this.journey=compactJourneyV629([...this.journey,{type,...detail,at:Date.now()}]);
  }

  audit(){
    const canonicalOrbs=this.document.querySelectorAll('#orb').length;
    const canonicalCanvases=this.document.querySelectorAll('#orb canvas,#orbCanvas,canvas[data-orb-canvas]').length;
    const openPlayers=[...this.document.querySelectorAll('audio,video')].filter(media=>!media.paused).length;
    const menuRoots=this.document.querySelectorAll('#drawer').length;
    const pentagramAvailable=Boolean(this.document.querySelector('#cosmosEntryIntent,[data-cosmos-entry],[data-pentagram]'));
    return Object.freeze({
      route:this.route,
      canonicalOrbs,
      canonicalCanvases,
      openPlayers,
      menuRoots,
      pentagramAvailable,
      singleOrb:canonicalOrbs<=1,
      singleCanvas:canonicalCanvases<=1,
      singlePlayer:openPlayers<=1,
      singleMenu:menuRoots<=1,
      online:this.window.navigator?.onLine!==false,
      reducedMotion:this.reducedMotion
    });
  }

  status(){
    return {
      version:629,
      work13Closed:true,
      work14:false,
      route:this.route,
      state:this.state,
      routeCount:this.routeCount,
      actionCount:this.actionCount,
      resumeCount:this.resumeCount,
      mediaGuardCount:this.mediaGuardCount,
      journey:[...this.journey],
      audit:this.lastAudit||this.audit(),
      contract:ORCHESTRA_CONTRACT_V629
    };
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    this.observer=null;
  }
}

export function createCosmosSupremeOrchestraV629(options={}){
  const existing=globalThis.divinaCosmosSupremeOrchestraInstanceV629;
  if(existing)return existing;
  const instance=new CosmosSupremeOrchestraV629(options);
  globalThis.divinaCosmosSupremeOrchestraInstanceV629=instance;
  globalThis.divinaWork13OrchestraV629=instance;
  globalThis.divinaCosmosVivoV629=instance;
  globalThis.divinaCosmosVivo=instance;
  globalThis.orbe=globalThis.orbe||{};
  globalThis.orbe.orquestraSuprema=instance;
  return instance;
}

export default createCosmosSupremeOrchestraV629;
