/* DIVINA BRUXA — QA SUPREMO, EVIDENCIAS E ENTREGA · MACROETAPA 10/10 · V534
   Observa somente estrutura e geometria publica. Nao le campos, conteudo
   privado, armazenamento ou APIs e nao transforma o navegador em autoridade. */

import { ROUTES_V180 } from './route-registry-v180.js?v=180';

const ROUTE_IDS=Object.freeze([
  'home','tarot','daily','library','school','spreads','ai','journal','store',
  'consultations','subscriptions','skins','videos','music','notifications','login','admin'
]);

export const QA_SUPREME_CONTRACT_V534=Object.freeze({
  release:'V534',
  macroStage:'10-of-10',
  title:'QA Supremo, evidencias e entrega',
  routeIds:ROUTE_IDS,
  routeCount:17,
  requiredP0:0,
  requiredP1:0,
  ownerReviewRequired:true,
  ownerReviewState:'blocked-pending-manual-evidence',
  ownerReviewBlockers:Object.freeze([
    'physical-iphone-ipad-android-matrix',
    'verified-owner-mfa-aal2-recovery-codes',
    'authenticated-premium-royal-table-13x6-continuity',
    'backup-restore-drill'
  ]),
  consultationsAnchor:'sanctuary-parent-sibling',
  menuDockMinimumGapPx:8,
  minimumTouchTargetPx:44,
  tarotCards:78,
  tarotNormalOnly:true,
  tarotNoRepeats:true,
  tarotLivreColumns:6,
  royalTable:'13x6',
  oneCanonicalOrb:true,
  whitPreserved:true,
  wisdomPreserved:true,
  environment:'staging',
  productionReady:false,
  realBilling:false,
  productionPublish:false,
  dnsChanges:false,
  storeSubmission:false,
  sol:false,
  storageReads:0,
  storageWrites:0,
  privateContentReads:0,
  formValueReads:0,
  apiCalls:0,
  permanentAnimationLoops:0
});

const STYLE_ID='divinaQaSupremeV534Styles';
const STYLE_HREF='./qa-supreme-core-v534.css?v=534';
const ESSENTIAL_TOUCH_SELECTOR=[
  '.ec530-music__player a[href]',
  '.ec530-video-note>a[href]',
  '.media-v149-primary',
  '.media-v149-player>a[href]',
  '.media-v149-episode>div>a[href]',
  '.media-v149-empty>a[href]',
  '.consultation-email-contact',
  '.consultation-boundaries a[href]'
].join(',');

let singleton=null;

const dispatch=(type,detail)=>{
  try{document.dispatchEvent(new CustomEvent(type,{detail:Object.freeze({...detail})}));}
  catch{}
};

const ensureStyle=()=>{
  let link=document.getElementById(STYLE_ID);
  if(link)return link;
  link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href=STYLE_HREF;
  link.dataset.qaSupreme='v534';
  document.head.append(link);
  return link;
};

const visible=element=>{
  if(!(element instanceof Element)||element.hidden||element.closest('[hidden],[inert]'))return false;
  const style=getComputedStyle(element);
  if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
  const rect=element.getBoundingClientRect();
  return rect.width>0&&rect.height>0;
};

const identity=element=>{
  if(element.id)return`#${element.id}`;
  const className=[...element.classList].slice(0,2).join('.');
  return`${element.localName}${className?`.${className}`:''}`;
};

class QaSupremeCoreV534{
  constructor(){
    this.root=document.documentElement;
    this.abort=new AbortController();
    this.cleanups=[];
    this.frame=0;
    this.lastAudit=null;
    this.styles=ensureStyle();
    this.root.dataset.qaSupreme='v534';
    this.root.dataset.ownerReview='required';
    this.install();
    this.schedule('install');
  }

  listen(target,type,handler,options={}){
    if(!target?.addEventListener)return;
    try{target.addEventListener(type,handler,{...options,signal:this.abort.signal});}
    catch{
      target.addEventListener(type,handler,options);
      this.cleanups.push(()=>target.removeEventListener(type,handler,options));
    }
  }

  install(){
    const schedule=event=>this.schedule(event?.type||'event');
    this.listen(this.styles,'load',schedule,{once:true});
    this.listen(document,'divina:route-ready',schedule,{passive:true});
    this.listen(document,'divina:page-ready',schedule,{passive:true});
    this.listen(document,'divina:page-error',schedule,{passive:true});
    this.listen(document,'divina:menu-state',event=>{
      if(event.detail?.state==='open')this.schedule('menu-open');
    },{passive:true});
    this.listen(globalThis,'resize',schedule,{passive:true});
    this.listen(globalThis,'orientationchange',schedule,{passive:true});
  }

  schedule(reason='manual'){
    if(this.frame)cancelAnimationFrame(this.frame);
    this.frame=requestAnimationFrame(()=>{
      this.frame=0;
      this.lastAudit=this.audit(reason);
      this.root.dataset.qaStructural=this.lastAudit.issues.length?'review':'pass';
      dispatch('divina:qa-supreme-audit',this.lastAudit);
    });
  }

  duplicateIds(){
    const seen=new Set(),duplicates=new Set();
    document.querySelectorAll('[id]').forEach(element=>{
      if(seen.has(element.id))duplicates.add(element.id);
      seen.add(element.id);
    });
    return[...duplicates].sort();
  }

  menuDockGap(){
    const menu=document.querySelector('.db502-menu.is-open');
    const hint=menu?.querySelector('.db502-menu__hint');
    const dock=document.querySelector('.magic-dock');
    if(!visible(menu)||!visible(hint)||!visible(dock))return null;
    const hintRect=hint.getBoundingClientRect();
    const dockRect=dock.getBoundingClientRect();
    return Math.round((dockRect.top-hintRect.bottom)*10)/10;
  }

  undersizedEssentialTouchTargets(){
    if(!matchMedia('(pointer:coarse)').matches)return[];
    return[...document.querySelectorAll(ESSENTIAL_TOUCH_SELECTOR)]
      .filter(visible)
      .filter(element=>{
        const rect=element.getBoundingClientRect();
        return rect.width<44||rect.height<44;
      })
      .map(identity);
  }

  audit(reason='manual'){
    const route=String(document.body?.dataset?.screen||document.querySelector('.screen.active')?.id||'home');
    const activeScreens=[...document.querySelectorAll('.screen.active')].filter(visible);
    const screen=document.getElementById(route);
    const routeError=screen?.dataset?.moduleState==='error'||Boolean(screen?.querySelector(':scope > [data-route-recovery]'));
    const consultationsReady=route!=='consultations'||(
      screen?.dataset?.moduleState!=='error'&&Boolean(document.getElementById('consultationsWorldV319'))
    );
    const horizontalOverflow=this.root.scrollWidth>this.root.clientWidth+1;
    const duplicates=this.duplicateIds();
    const gap=this.menuDockGap();
    const touchTargets=this.undersizedEssentialTouchTargets();
    const issues=[];
    if(ROUTES_V180.length!==17||ROUTE_IDS.some(id=>!ROUTES_V180.some(routeDefinition=>routeDefinition.id===id)))issues.push('route-contract');
    if(activeScreens.length!==1)issues.push('active-screen-count');
    if(horizontalOverflow)issues.push('horizontal-overflow');
    if(duplicates.length)issues.push('duplicate-ids');
    if(routeError)issues.push('active-route-error');
    if(!consultationsReady)issues.push('consultations-world-unavailable');
    if(gap!==null&&gap<QA_SUPREME_CONTRACT_V534.menuDockMinimumGapPx)issues.push('menu-dock-overlap');
    if(touchTargets.length)issues.push('essential-touch-target');
    return Object.freeze({
      release:'V534',reason,route,
      routeCount:ROUTES_V180.length,
      activeScreenCount:activeScreens.length,
      horizontalOverflow,
      duplicateIds:Object.freeze(duplicates),
      consultationsReady,
      menuDockGapPx:gap,
      undersizedEssentialTouchTargets:Object.freeze(touchTargets),
      issues:Object.freeze(issues),
      structuralPass:issues.length===0,
      ownerReviewRequired:true,
      productionReady:false
    });
  }

  status(){
    return Object.freeze({
      release:'V534',
      contract:QA_SUPREME_CONTRACT_V534,
      audit:this.lastAudit||this.audit('status'),
      ownerReviewState:QA_SUPREME_CONTRACT_V534.ownerReviewState,
      productionReady:false
    });
  }

  destroy(){
    this.abort.abort();
    this.cleanups.splice(0).forEach(cleanup=>cleanup());
    if(this.frame)cancelAnimationFrame(this.frame);
    delete this.root.dataset.qaSupreme;
    delete this.root.dataset.qaStructural;
    delete this.root.dataset.ownerReview;
    if(singleton===this)singleton=null;
  }
}

export function createQaSupremeCoreV534(){
  if(typeof document==='undefined')return null;
  if(singleton)return singleton;
  singleton=new QaSupremeCoreV534();
  globalThis.divinaQaSupremeV534=singleton;
  return singleton;
}
