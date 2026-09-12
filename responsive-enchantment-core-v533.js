/* DIVINA BRUXA — RESPONSIVIDADE E ENCANTAMENTO FINAL · MACROETAPA 9/10 · V533
   Uma camada de geometria, energia e continuidade. Não cria outra Orbe, não lê
   conteúdo privado e não transforma o navegador em autoridade de conta. */

export const RESPONSIVE_ENCHANTMENT_CONTRACT_V533 = Object.freeze({
  release:'V533',
  macroStage:'9-of-10',
  title:'Responsividade e encantamento final',
  viewportWidths:Object.freeze([320,375,390,430,768,1024,1280,1920]),
  orientations:Object.freeze(['portrait','landscape']),
  minimumTouchTargetPx:44,
  viewportFit:'cover',
  interactiveWidget:'resizes-content',
  visualViewportAware:true,
  keyboardAware:true,
  backNavigationScrollRestore:true,
  adaptiveParticles:true,
  pageVisibilityPause:true,
  reducedMotion:true,
  highContrast:true,
  forcedColors:true,
  pwaStandalone:true,
  selectiveOffline:true,
  dynamicSkinsWorld:true,
  skinCount:30,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  permanentAnimationLoops:0,
  storageReads:0,
  storageWrites:0,
  privateContentReads:0,
  formValueReads:0,
  apiCalls:0,
  realBilling:false,
  productionPublish:false,
  storeSubmission:false,
  sol:false
});

const STYLE_ID='divinaResponsiveEnchantmentV533Styles';
const STYLE_HREF='./responsive-enchantment-core-v533.css?v=533';
const EDITABLE_SELECTOR='input:not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,select,[contenteditable="true"]';
const SCROLL_MEMORY_LIMIT=24;

let singleton=null;

const safeDispatch=(type,detail)=>{
  try{dispatchEvent(new CustomEvent(type,{detail:Object.freeze({...detail})}));}
  catch{}
};

const currentRoute=()=>String(document.body?.dataset?.screen||document.querySelector('.screen.active')?.id||'').trim();
const routeFromLocation=()=>String(location.hash||'#home').replace(/^#/,'').trim()||'home';
const standalone=()=>globalThis.matchMedia?.('(display-mode: standalone)')?.matches===true||navigator.standalone===true;
const editable=element=>element instanceof Element&&element.matches(EDITABLE_SELECTOR)&&!element.matches('[disabled],[readonly]');

const ensureStyle=()=>{
  let link=document.getElementById(STYLE_ID);
  if(link)return link;
  link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href=STYLE_HREF;
  link.dataset.responsiveEnchantment='v533';
  document.head.append(link);
  return link;
};

const ensureViewportMeta=()=>{
  let meta=document.querySelector('meta[name="viewport"]');
  if(!meta){
    meta=document.createElement('meta');
    meta.name='viewport';
    document.head.prepend(meta);
  }
  const preserved=String(meta.content||'').split(',').map(item=>item.trim()).filter(Boolean)
    .filter(item=>!/^width\s*=|^initial-scale\s*=|^viewport-fit\s*=|^interactive-widget\s*=/i.test(item));
  meta.content=['width=device-width','initial-scale=1','viewport-fit=cover','interactive-widget=resizes-content',...preserved].join(', ');
  return meta;
};

const ensureSkinsWorld=()=>{
  if(document.getElementById('skins'))return false;
  const app=document.getElementById('app');
  if(!app)return false;
  const section=document.createElement('section');
  section.id='skins';
  section.className='screen skins-celestial-screen';
  section.setAttribute('aria-hidden','true');
  section.innerHTML='<p class="eyebrow">SKINS DA ORBE · PERSONALIZAÇÃO CONSCIENTE</p><h2>Trinta formas de sentir o mesmo universo.</h2><p class="lead">Escolha a aparência da sua Orbe. Cada skin é somente visual: nenhuma delas muda cartas, significados, chances, direitos ou a presença da Whit.</p><div id="skinsApp"></div>';
  const subscriptions=document.getElementById('subscriptions');
  if(subscriptions?.parentElement===app)subscriptions.after(section);
  else app.append(section);
  safeDispatch('divina:skins-route-restored',{release:'V533',route:'skins',skinCount:30});
  return true;
};

const viewportClass=width=>{
  if(width<=375)return'compact';
  if(width<=767)return'phone';
  if(width<=1024)return'tablet';
  if(width<=1279)return'desktop';
  return'wide';
};

const heightClass=height=>{
  if(height<=520)return'short';
  if(height<=700)return'compact';
  return'regular';
};

const connectionState=()=>{
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const effective=String(connection?.effectiveType||'').toLowerCase();
  const memory=Number(navigator.deviceMemory||0);
  const cores=Number(navigator.hardwareConcurrency||0);
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
  const constrained=connection?.saveData===true
    || /(^|-)2g$|slow-2g/.test(effective)
    || (memory>0&&memory<=3)
    || (cores>0&&cores<=2);
  return Object.freeze({
    reduced,
    constrained,
    saveData:connection?.saveData===true,
    effectiveType:effective||'unknown',
    memory:memory||null,
    cores:cores||null
  });
};

class ResponsiveEnchantmentV533 {
  constructor(){
    this.root=document.documentElement;
    this.abort=new AbortController();
    this.cleanups=[];
    this.frame=0;
    this.settleTimer=0;
    this.focusTimer=0;
    this.pendingHistoryRestore='';
    this.scrollMemory=new Map();
    this.viewportBaselines=new Map();
    this.lastViewport=null;
    this.styles=ensureStyle();
    ensureViewportMeta();
    this.skinsWorldRestored=ensureSkinsWorld();
    this.install();
    this.measure('install');
  }

  listen(target,type,handler,options={}){
    if(!target?.addEventListener)return;
    try{target.addEventListener(type,handler,{...options,signal:this.abort.signal});}
    catch{
      target.addEventListener(type,handler,options);
      this.cleanups.push(()=>target.removeEventListener(type,handler,options));
    }
  }

  listenMedia(query,handler){
    const media=globalThis.matchMedia?.(query);
    if(!media)return null;
    if(media.addEventListener)this.listen(media,'change',handler);
    else if(media.addListener){media.addListener(handler);this.cleanups.push(()=>media.removeListener(handler));}
    return media;
  }

  install(){
    const schedule=event=>this.schedule(event?.type||'event');
    this.listen(globalThis,'resize',schedule,{passive:true});
    this.listen(globalThis,'orientationchange',schedule,{passive:true});
    this.listen(globalThis,'pageshow',event=>{
      this.schedule(event.persisted?'bfcache':'pageshow');
      if(event.persisted)this.restoreScroll(routeFromLocation());
    },{passive:true});
    this.listen(globalThis,'pagehide',()=>this.rememberScroll(currentRoute()),{passive:true});
    this.listen(document,'visibilitychange',()=>{
      this.root.dataset.scenePaused=String(document.hidden);
      if(!document.hidden)this.schedule('visibility');
      safeDispatch('divina:scene-visibility',{release:'V533',paused:document.hidden});
    },{passive:true});
    this.listen(document,'focusin',event=>this.onFocusIn(event),{passive:true});
    this.listen(document,'focusout',()=>{
      clearTimeout(this.focusTimer);
      this.focusTimer=setTimeout(()=>this.schedule('focusout'),180);
    },{passive:true});
    this.listen(document,'divina:route-start',event=>{
      const from=currentRoute();
      const to=String(event.detail?.id||'');
      if(from&&from!==to)this.rememberScroll(from);
    },{passive:true});
    this.listen(document,'divina:route-ready',event=>{
      const route=String(event.detail?.id||currentRoute());
      if(this.pendingHistoryRestore===route){
        this.pendingHistoryRestore='';
        this.restoreScroll(route);
      }
      this.schedule('route-ready');
    },{passive:true});
    this.listen(globalThis,'popstate',()=>{
      this.pendingHistoryRestore=routeFromLocation();
    },{passive:true,capture:true});
    this.listen(navigator.connection||navigator.mozConnection||navigator.webkitConnection,'change',schedule,{passive:true});
    this.listen(globalThis.visualViewport,'resize',schedule,{passive:true});
    this.listen(globalThis.visualViewport,'scroll',schedule,{passive:true});
    this.listenMedia('(prefers-reduced-motion: reduce)',schedule);
    this.listenMedia('(prefers-contrast: more)',schedule);
    this.listenMedia('(forced-colors: active)',schedule);
    this.listenMedia('(display-mode: standalone)',schedule);
    this.root.dataset.scenePaused=String(document.hidden);
  }

  onFocusIn(event){
    if(!editable(event.target))return;
    this.schedule('focusin');
    clearTimeout(this.focusTimer);
    this.focusTimer=setTimeout(()=>this.revealFocusedControl(event.target),220);
  }

  revealFocusedControl(control){
    if(!editable(control)||document.activeElement!==control)return false;
    const visual=globalThis.visualViewport;
    const top=(visual?.offsetTop||0)+12;
    const bottom=top+(visual?.height||innerHeight)-16;
    const rect=control.getBoundingClientRect();
    if(rect.top>=top&&rect.bottom<=bottom)return false;
    try{control.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});}
    catch{control.scrollIntoView();}
    return true;
  }

  rememberScroll(route){
    if(!route)return false;
    this.scrollMemory.delete(route);
    this.scrollMemory.set(route,Math.max(0,Math.round(globalThis.scrollY||0)));
    while(this.scrollMemory.size>SCROLL_MEMORY_LIMIT)this.scrollMemory.delete(this.scrollMemory.keys().next().value);
    return true;
  }

  restoreScroll(route){
    if(!this.scrollMemory.has(route))return false;
    const top=this.scrollMemory.get(route);
    requestAnimationFrame(()=>requestAnimationFrame(()=>globalThis.scrollTo({top,behavior:'auto'})));
    return true;
  }

  schedule(reason='resize'){
    if(this.frame)cancelAnimationFrame(this.frame);
    this.frame=requestAnimationFrame(()=>{
      this.frame=0;
      this.measure(reason);
    });
    clearTimeout(this.settleTimer);
    this.settleTimer=setTimeout(()=>this.measure(`${reason}-settled`),420);
  }

  measure(reason='measure'){
    const visual=globalThis.visualViewport;
    const layoutWidth=Math.max(1,Math.round(this.root.clientWidth||innerWidth||1));
    const layoutHeight=Math.max(1,Math.round(innerHeight||this.root.clientHeight||1));
    const visualWidth=Math.max(1,Math.round(visual?.width||layoutWidth));
    const visualHeight=Math.max(1,Math.round(visual?.height||layoutHeight));
    const offsetTop=Math.max(0,Math.round(visual?.offsetTop||0));
    const offsetLeft=Math.max(0,Math.round(visual?.offsetLeft||0));
    const scale=Number(visual?.scale||1);
    const obscured=Math.max(0,Math.round(layoutHeight-visualHeight-offsetTop));
    const screenOrientation=String(globalThis.screen?.orientation?.type||'');
    const legacyOrientation=Number(globalThis.orientation);
    const touchOrientationAuthority=Number(navigator.maxTouchPoints||0)>0;
    const orientation=touchOrientationAuthority&&(/^landscape/.test(screenOrientation)||(Number.isFinite(legacyOrientation)&&Math.abs(legacyOrientation)===90))
      ?'landscape'
      :touchOrientationAuthority&&(/^portrait/.test(screenOrientation)||(Number.isFinite(legacyOrientation)&&Math.abs(legacyOrientation)!==90))
        ?'portrait'
        :layoutWidth>layoutHeight?'landscape':'portrait';
    const focusedEditable=editable(document.activeElement);
    const previousBaseline=this.viewportBaselines.get(orientation)||Math.max(layoutHeight,visualHeight);
    if(!focusedEditable&&Math.abs(scale-1)<.08)this.viewportBaselines.set(orientation,Math.max(previousBaseline,layoutHeight,visualHeight));
    const baselineHeight=this.viewportBaselines.get(orientation)||previousBaseline;
    const baselineLoss=Math.max(0,Math.round(baselineHeight-visualHeight-offsetTop));
    const keyboardOpen=focusedEditable&&Math.abs(scale-1)<.08&&Math.max(obscured,baselineLoss)>=Math.max(120,Math.round(baselineHeight*.18));
    const keyboardHeight=keyboardOpen?Math.max(obscured,baselineLoss):0;
    const connection=connectionState();
    const motionProfile=connection.reduced?'reduced':connection.constrained?'constrained':'balanced';
    const performanceTier=connection.constrained||connection.reduced?'constrained':'balanced';

    this.root.style.setProperty('--db533-layout-width',`${layoutWidth}px`);
    this.root.style.setProperty('--db533-layout-height',`${layoutHeight}px`);
    this.root.style.setProperty('--db533-visual-width',`${visualWidth}px`);
    this.root.style.setProperty('--db533-visual-height',`${visualHeight}px`);
    this.root.style.setProperty('--db533-visual-offset-top',`${offsetTop}px`);
    this.root.style.setProperty('--db533-visual-offset-left',`${offsetLeft}px`);
    this.root.style.setProperty('--db533-keyboard-height',`${keyboardHeight}px`);
    this.root.style.setProperty('--db533-particle-scale',connection.reduced?'0':connection.constrained?'.56':'1');
    this.root.dataset.responsiveEnchantment='v533';
    this.root.dataset.viewportClass=viewportClass(layoutWidth);
    this.root.dataset.viewportHeight=heightClass(visualHeight);
    this.root.dataset.orientation=orientation;
    this.root.dataset.keyboard=keyboardOpen?'open':'closed';
    this.root.dataset.standalone=String(standalone());
    this.root.dataset.motionProfile=motionProfile;
    this.root.dataset.performanceTier=performanceTier;

    this.lastViewport=Object.freeze({
      release:'V533',reason,layoutWidth,layoutHeight,visualWidth,visualHeight,
      offsetTop,offsetLeft,scale:Math.round(scale*100)/100,orientation,
      viewportClass:viewportClass(layoutWidth),heightClass:heightClass(visualHeight),
      keyboardOpen,keyboardHeight,standalone:standalone(),
      motionProfile,performanceTier,saveData:connection.saveData,
      effectiveType:connection.effectiveType
    });
    safeDispatch('divina:viewport-state',this.lastViewport);
    return this.lastViewport;
  }

  audit(){
    const active=document.querySelector('.screen.active');
    const controls=[...(active||document).querySelectorAll('button,[role="button"],input,select,textarea,summary,nav a[href]')];
    let visibleTargets=0,undersizedTargets=0;
    for(const control of controls){
      const rect=control.getBoundingClientRect();
      const style=getComputedStyle(control);
      if(style.display==='none'||style.visibility==='hidden'||rect.width<=0||rect.height<=0)continue;
      visibleTargets+=1;
      if(rect.width<44||rect.height<44)undersizedTargets+=1;
    }
    return Object.freeze({
      release:'V533',
      route:active?.id||currentRoute()||null,
      screens:document.querySelectorAll('.screen').length,
      skinsScreen:Boolean(document.getElementById('skins')&&document.getElementById('skinsApp')),
      horizontalDocumentOverflow:this.root.scrollWidth>this.root.clientWidth+1,
      visibleTargets,undersizedTargets,
      viewport:this.lastViewport,
      privateContentReads:0,
      formValueReads:0,
      storageReads:0,
      storageWrites:0,
      apiCalls:0
    });
  }

  status(){
    return Object.freeze({
      ...RESPONSIVE_ENCHANTMENT_CONTRACT_V533,
      installed:true,
      stylesheet:Boolean(document.getElementById(STYLE_ID)),
      skinsWorldRestored:this.skinsWorldRestored||Boolean(document.getElementById('skins')),
      viewport:this.lastViewport,
      rememberedRoutes:this.scrollMemory.size
    });
  }

  destroy(){
    this.abort.abort();
    this.cleanups.splice(0).forEach(cleanup=>cleanup());
    cancelAnimationFrame(this.frame);
    clearTimeout(this.settleTimer);
    clearTimeout(this.focusTimer);
    this.frame=0;
  }
}

export function createResponsiveEnchantmentCoreV533(){
  if(singleton)return singleton;
  if(typeof document==='undefined'||typeof window==='undefined')return null;
  const core=new ResponsiveEnchantmentV533();
  singleton=Object.freeze({
    version:533,
    contract:RESPONSIVE_ENCHANTMENT_CONTRACT_V533,
    viewport:()=>core.lastViewport,
    status:()=>core.status(),
    audit:()=>core.audit(),
    refresh:()=>core.measure('manual'),
    restoreScroll:route=>core.restoreScroll(route),
    destroy:()=>core.destroy()
  });
  globalThis.divinaResponsiveEnchantmentV533=singleton;
  safeDispatch('divina:responsive-enchantment-ready',{
    release:'V533',macroStage:'9-of-10',skinsScreen:Boolean(document.getElementById('skins'))
  });
  return singleton;
}
