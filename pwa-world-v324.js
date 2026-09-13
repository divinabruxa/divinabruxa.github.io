/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 5/14 · CORTE V553
   Uma única autoridade PWA para app e páginas de instalação.
   Offline seletivo: mundos locais continuam; ações de autoridade exigem rede.
   Não altera o motor visual da Orbe principal. */

import { installPerformanceV324, summarizeLocalWebVitalsV324, performanceTierV324 } from './performance-world-v324.js?v=324';
import { createResponsiveEnchantmentCoreV533 } from './responsive-enchantment-core-v533.js?v=542-skins';
import { createPwaPerformanceRecoveryCoreV546 } from './pwa-performance-recovery-core-v546.js?v=553';

const VERSION=553;
const STYLE_ID='divinaPwaResilienceV324';
const INSTALL_ROUTES=Object.freeze({pt:'instalar-app.html',en:'install-app.html',es:'instalar-aplicacion.html'});
const ONLINE_ONLY_SELECTOR=[
  '[data-requires-online]',
  '[data-checkout]',
  '[data-restore-purchase]',
  '[data-purchase]',
  '[data-refund]',
  '[data-revoke]',
  '[data-cancel-subscription]',
  '#consultations button[type="submit"]',
  '#login button[type="submit"]',
  '#adminApp form button[type="submit"]',
  '#adminApp [data-save-status]',
  '#adminApp [data-delete-media]'
].join(',');

let initialized=false;
let deferredInstallPrompt=null;
let networkStatus=null;
let networkStatusTimer=0;
const openRegionState=new WeakMap();

const locale=()=>{
  const lang=document.documentElement.lang.toLowerCase();
  if(lang.startsWith('en'))return'en';
  if(lang.startsWith('es'))return'es';
  return'pt';
};

const copy=()=>({
  pt:{
    skip:'Ir para o conteúdo principal',install:'Instalar aplicativo',installed:'Aplicativo instalado',
    online:'Conexão restaurada.',offline:'Modo offline: mundos locais preparados continuam disponíveis.',
    unavailable:'Esta ação precisa de conexão segura.',skinsOffline:'Sua skin atual continua ativa. Reconecte para restaurar ou adquirir skins e direitos Premium.',
    title:'Instalar a Orbe',kicker:'DIVINA BRUXA · APLICATIVO',
    ios:['Abra esta página no Safari.','Toque em Compartilhar.','Escolha “Adicionar à Tela de Início” e confirme em “Adicionar”.'],
    browser:['Abra o menu do navegador.','Escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.','Confirme a instalação.'],
    guide:'Ver guia completo',close:'Fechar',
    preparing:'Preparando Tarot, Carta do Dia, Biblioteca, Diário e Whit Local para continuidade offline…',
    ready:'Núcleo gratuito offline preparado. Whit Local também continua sem API; recursos de autoridade exigem conexão.',
    partial:'Parte do núcleo foi preparada. Mantenha a conexão e tente novamente.',
    verifying:'Verificando o núcleo instalado…',healthy:'Núcleo V553 íntegro e pronto.',
    repairing:'Reparando somente os arquivos do aplicativo…',repaired:'Núcleo reparado. Reabra o aplicativo.',
    premiumDenied:'O offline Premium exige Conta conectada e entitlement ativo confirmado pelo servidor.'
  },
  en:{
    skip:'Skip to main content',install:'Install app',installed:'App installed',
    online:'Connection restored.',offline:'Offline mode: prepared local worlds remain available.',
    unavailable:'This action requires a secure connection.',skinsOffline:'Your current skin remains active. Reconnect to restore or purchase skins and Premium rights.',
    title:'Install the Orb',kicker:'DIVINA BRUXA · APP',
    ios:['Open this page in Safari.','Tap Share.','Choose “Add to Home Screen”, then confirm with “Add”.'],
    browser:['Open the browser menu.','Choose “Install app” or “Add to Home Screen”.','Confirm the installation.'],
    guide:'Open full guide',close:'Close',
    preparing:'Preparing Tarot, Daily Card, Library, Journal and Local Whit for offline continuity…',
    ready:'Free offline core prepared. Local Whit also remains available without an API; authority services require a connection.',
    partial:'Part of the offline core was prepared. Keep the connection and try again.',
    verifying:'Checking the installed core…',healthy:'V553 core is intact and ready.',
    repairing:'Repairing app files only…',repaired:'Core repaired. Reopen the app.',
    premiumDenied:'Premium offline requires a connected Account and an active server-confirmed entitlement.'
  },
  es:{
    skip:'Ir al contenido principal',install:'Instalar aplicación',installed:'Aplicación instalada',
    online:'Conexión restablecida.',offline:'Modo sin conexión: los mundos locales preparados siguen disponibles.',
    unavailable:'Esta acción necesita una conexión segura.',skinsOffline:'Tu skin actual sigue activa. Reconecta para restaurar o comprar skins y derechos Premium.',
    title:'Instalar la Orbe',kicker:'DIVINA BRUXA · APLICACIÓN',
    ios:['Abre esta página en Safari.','Toca Compartir.','Elige “Añadir a pantalla de inicio” y confirma con “Añadir”.'],
    browser:['Abre el menú del navegador.','Elige “Instalar aplicación” o “Añadir a pantalla de inicio”.','Confirma la instalación.'],
    guide:'Ver guía completo',close:'Cerrar',
    preparing:'Preparando Tarot, Carta del Día, Biblioteca, Diario y Whit Local para continuidad sin conexión…',
    ready:'Núcleo gratuito sin conexión preparado. Whit Local también continúa sin API; los servicios de autoridad necesitan conexión.',
    partial:'Parte del núcleo fue preparada. Mantén la conexión e inténtalo de nuevo.',
    verifying:'Verificando el núcleo instalado…',healthy:'El núcleo V553 está íntegro y listo.',
    repairing:'Reparando solamente los archivos de la aplicación…',repaired:'Núcleo reparado. Vuelve a abrir la aplicación.',
    premiumDenied:'El modo Premium sin conexión exige Cuenta conectada y un derecho activo confirmado por el servidor.'
  }
})[locale()];

const installStyle=()=>{
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./pwa-resilience-v324.css?v=553';
  document.head.append(link);
};

const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isAppleMobile=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const announce=message=>dispatchEvent(new CustomEvent('orbe:toast',{detail:message}));

const focusables=root=>[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')]
  .filter(el=>!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&!el.closest('[inert]'));

const ensureSkipLink=()=>{
  if(document.querySelector('a[href="#app"],a[href="#main"],.db-skip-link'))return;
  const main=document.querySelector('main');
  if(!main)return;
  if(!main.id)main.id='main';
  const link=document.createElement('a');
  link.className='db-skip-link';link.href=`#${main.id}`;link.textContent=copy().skip;
  document.body.prepend(link);
};

const setInert=(element,inert)=>{
  if(!element)return;
  try{element.inert=inert;}catch{}
};

const syncHiddenRegions=()=>{
  document.querySelectorAll('.screen').forEach(screen=>{
    const active=screen.classList.contains('active');
    const hidden=String(!active);
    // P0: never rewrite an observed attribute when its value is already correct.
    if(screen.getAttribute('aria-hidden')!==hidden)screen.setAttribute('aria-hidden',hidden);
    setInert(screen,!active);
  });
  for(const [selector,openCheck] of [
    ['#orbMenu',el=>el.getAttribute('aria-hidden')==='false'],
    ['#drawer',el=>el.getAttribute('aria-hidden')==='false'||el.classList.contains('open')]
  ]){
    const region=document.querySelector(selector);
    if(!region)continue;
    const open=openCheck(region);
    setInert(region,!open);
    if(open&&openRegionState.get(region)!==true)requestAnimationFrame(()=>focusables(region)[0]?.focus({preventScroll:true}));
    openRegionState.set(region,open);
  }
};

const trapVisibleLayer=event=>{
  if(event.key!=='Tab')return;
  const layers=[...document.querySelectorAll('dialog[open],#drawer.open,#orbMenu[aria-hidden="false"]')];
  const layer=layers.at(-1);
  if(!layer)return;
  const items=focusables(layer);
  if(!items.length)return;
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
};

const installAccessibility=()=>{
  ensureSkipLink();
  document.querySelector('main')?.setAttribute('role','main');
  const toast=document.querySelector('#toast');
  toast?.setAttribute('role','status');toast?.setAttribute('aria-live','polite');toast?.setAttribute('aria-atomic','true');
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');});
  syncHiddenRegions();
  const queueHiddenRegionSync=()=>queueMicrotask(syncHiddenRegions);
  ['divina:route-start','divina:route-ready','divina:menu-state','divina:orb-menu-state','divina:page-ready']
    .forEach(type=>document.addEventListener(type,queueHiddenRegionSync,{passive:true}));
  document.addEventListener('keydown',trapVisibleLayer);
  document.addEventListener('divina:route-ready',event=>{
    const screen=document.getElementById(event.detail?.id||'');
    const heading=screen?.querySelector('h1,h2,[role="heading"]');
    if(!heading)return;
    heading.tabIndex=-1;
    requestAnimationFrame(()=>heading.focus({preventScroll:true}));
  });
};

const ensureNetworkStatus=()=>{
  if(networkStatus)return networkStatus;
  const element=document.createElement('div');
  element.className='db-network-status';element.setAttribute('role','status');element.setAttribute('aria-live','polite');element.setAttribute('aria-atomic','true');element.dataset.visible='false';
  const message=document.createElement('span');
  const close=document.createElement('button');close.type='button';close.setAttribute('aria-label',copy().close);close.textContent='×';
  close.addEventListener('click',()=>{element.dataset.visible='false';});
  element.append(message,close);document.body.append(element);networkStatus=element;return element;
};

const updateOnlineOnlyActions=online=>{
  document.querySelectorAll(ONLINE_ONLY_SELECTOR).forEach(element=>{
    const control=element.matches('button,input[type="submit"]')?element:null;
    if(!online&&control&&!control.disabled){control.dataset.dbOfflineDisabled='true';control.disabled=true;}
    if(online&&control?.dataset.dbOfflineDisabled==='true'){control.disabled=false;delete control.dataset.dbOfflineDisabled;}
    element.setAttribute('aria-disabled',String(!online));
  });
};

const updateNetwork=({initial=false}={})=>{
  const online=navigator.onLine;
  document.body.dataset.network=online?'online':'offline';
  updateOnlineOnlyActions(online);
  const status=ensureNetworkStatus();
  status.querySelector('span').textContent=online?copy().online:copy().offline;
  clearTimeout(networkStatusTimer);
  if(!online){status.dataset.visible='true';return;}
  if(!initial){
    status.dataset.visible='true';
    networkStatusTimer=setTimeout(()=>{status.dataset.visible='false';},2600);
  }else status.dataset.visible='false';
};

const openInstallDialog=()=>{
  let dialog=document.querySelector('#dbInstallDialogV324');
  if(!dialog){
    dialog=document.createElement('dialog');dialog.id='dbInstallDialogV324';dialog.className='db-install-dialog';dialog.setAttribute('aria-labelledby','dbInstallTitleV324');
    dialog.innerHTML=`<div class="db-install-dialog__inner"><div class="db-install-dialog__top"><div><p></p><h2 id="dbInstallTitleV324"></h2></div><button class="db-install-dialog__close" type="button">×</button></div><ol></ol><div class="db-install-dialog__actions"><a></a><button class="secondary" type="button"></button></div></div>`;
    document.body.append(dialog);
    const close=()=>typeof dialog.close==='function'?dialog.close():dialog.removeAttribute('open');
    dialog.querySelector('.db-install-dialog__close').addEventListener('click',close);
    dialog.querySelector('.db-install-dialog__actions button').addEventListener('click',close);
    dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  }
  const words=copy(),steps=isAppleMobile()?words.ios:words.browser;
  dialog.querySelector('.db-install-dialog__top p').textContent=words.kicker;
  dialog.querySelector('h2').textContent=words.title;
  dialog.querySelector('ol').replaceChildren(...steps.map(step=>{const li=document.createElement('li');li.textContent=step;return li;}));
  const guide=dialog.querySelector('.db-install-dialog__actions a');guide.href=INSTALL_ROUTES[locale()];guide.textContent=words.guide;
  dialog.querySelector('.db-install-dialog__actions button').textContent=words.close;
  if(!dialog.open&&typeof dialog.showModal==='function')dialog.showModal();else if(!dialog.open)dialog.setAttribute('open','');
  dialog.querySelector('.db-install-dialog__close').focus();
};

const installApp=async()=>{
  if(isStandalone()){announce(copy().installed);return;}
  if(!deferredInstallPrompt){openInstallDialog();return;}
  const prompt=deferredInstallPrompt;deferredInstallPrompt=null;await prompt.prompt();
  const choice=await prompt.userChoice;if(choice?.outcome!=='accepted')openInstallDialog();
};

const setupInstall=()=>{
  document.body.dataset.installed=String(isStandalone());
  const button=document.querySelector('#installApp');
  if(button){
    button.hidden=false;button.onclick=null;button.textContent=isStandalone()?copy().installed:copy().install;button.disabled=isStandalone();
    button.addEventListener('click',installApp);
  }
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;if(button&&!isStandalone())button.disabled=false;});
  addEventListener('appinstalled',()=>{deferredInstallPrompt=null;document.body.dataset.installed='true';if(button){button.textContent=copy().installed;button.disabled=true;}announce(copy().installed);});
};

const injectInternationalInstallLink=()=>{
  if(locale()==='pt'||document.body.classList.contains('db-install-page'))return;
  const href=INSTALL_ROUTES[locale()];
  const targets=[document.querySelector('.intl-home-menu-panel'),document.querySelector('.intl-footer nav')].filter(Boolean);
  for(const target of targets){
    if(target.querySelector(`[href="${href}"]`))continue;
    const link=document.createElement('a');link.href=href;link.textContent=copy().install;target.append(link);
  }
};

const askWorker=(type,payload={})=>new Promise((resolve,reject)=>{
  if(!('serviceWorker'in navigator)||typeof MessageChannel==='undefined'){reject(new Error('service-worker-unavailable'));return;}
  const timer=setTimeout(()=>reject(new Error('service-worker-timeout')),90000);
  navigator.serviceWorker.ready.then(registration=>{
    const worker=navigator.serviceWorker.controller||registration.active||registration.waiting;
    if(!worker)throw new Error('service-worker-inactive');
    const channel=new MessageChannel();
    channel.port1.onmessage=event=>{clearTimeout(timer);resolve(event.data);};
    worker.postMessage({type,...payload},[channel.port2]);
  }).catch(error=>{clearTimeout(timer);reject(error);});
});

const premiumEntitlementActive=()=>navigator.onLine!==false&&Boolean(
  globalThis.divinaAccount?.user&&globalThis.divinaAccount?.entitlements?.some?.(
    item=>item?.key==='premium_lifetime'&&item?.status==='active'
  )
);

const setupOfflinePreparation=()=>{
  const buttons=document.querySelectorAll('[data-prepare-offline]');
  buttons.forEach(button=>button.addEventListener('click',async()=>{
    const output=document.querySelector('[data-offline-result]');
    button.disabled=true;if(output)output.textContent=copy().preparing;
    try{
      const result=await askWorker('PREPARE_OFFLINE_CORE');
      const message=result?.complete?copy().ready:copy().partial;
      if(output)output.textContent=message;announce(message);
    }catch{
      if(output)output.textContent=copy().partial;announce(copy().partial);
    }finally{button.disabled=false;}
  }));

  document.querySelectorAll('[data-prepare-premium-offline]').forEach(button=>button.addEventListener('click',async()=>{
    const output=document.querySelector('[data-offline-result]');
    if(!premiumEntitlementActive()){if(output)output.textContent=copy().premiumDenied;announce(copy().premiumDenied);return;}
    button.disabled=true;if(output)output.textContent=copy().preparing;
    try{
      const result=await askWorker('PREPARE_OFFLINE_PREMIUM',{premiumAuthorized:true});
      const message=result?.complete?copy().ready:copy().partial;
      if(output)output.textContent=message;announce(message);
    }catch{if(output)output.textContent=copy().partial;}
    finally{button.disabled=false;}
  }));

  document.querySelectorAll('[data-verify-offline]').forEach(button=>button.addEventListener('click',async()=>{
    const output=document.querySelector('[data-offline-health]')||document.querySelector('[data-offline-result]');
    button.disabled=true;if(output)output.textContent=copy().verifying;
    try{const result=await askWorker('VERIFY_SHELL');if(output)output.textContent=result?.complete?copy().healthy:copy().partial;}
    catch{if(output)output.textContent=copy().partial;}
    finally{button.disabled=false;}
  }));

  document.querySelectorAll('[data-repair-offline]').forEach(button=>button.addEventListener('click',async()=>{
    const output=document.querySelector('[data-offline-health]')||document.querySelector('[data-offline-result]');
    button.disabled=true;if(output)output.textContent=copy().repairing;
    try{const result=await askWorker('REPAIR_SHELL');if(output)output.textContent=result?.complete?copy().repaired:copy().partial;}
    catch{if(output)output.textContent=copy().partial;}
    finally{button.disabled=false;}
  }));
};

const setupServiceWorker=()=>{
  if(!('serviceWorker'in navigator))return;
  const announceRegistration=registration=>{
    dispatchEvent(new CustomEvent('divina:pwa-ready',{detail:{scope:registration.scope,version:VERSION,recovery:'pwa-performance-recovery-v546'}}));
    registration.update().catch(()=>{});
    return registration;
  };
  if(String(globalThis.__divinaSWBootstrap||'').startsWith('v553')){
    navigator.serviceWorker.ready.then(announceRegistration).catch(()=>{});
    return;
  }
  globalThis.__divinaSWBootstrap='v553-pwa';
  navigator.serviceWorker.register('./sw.js?v=553',{updateViaCache:'none'})
    .then(registration=>{
      announceRegistration(registration);
    })
    .catch(error=>console.error('[Divina] PWA V553 isolado indisponível',error));
};

const setupReturnFromBackground=()=>{
  let lastRefresh=0;
  const resume=reason=>{
    if(document.visibilityState==='hidden')return;
    updateNetwork({initial:true});
    const now=Date.now();
    if('serviceWorker'in navigator&&now-lastRefresh>60000){
      lastRefresh=now;
      navigator.serviceWorker.getRegistration().then(reg=>reg?.update()).catch(()=>{});
    }
    dispatchEvent(new CustomEvent('divina:resume',{detail:{reason,at:now}}));
  };
  document.addEventListener('visibilitychange',()=>resume('visibility'));
  addEventListener('pageshow',event=>resume(event.persisted?'bfcache':'pageshow'));
};

const guardOffline=()=>{
  document.addEventListener('click',event=>{
    if(navigator.onLine)return;
    const target=event.target.closest(ONLINE_ONLY_SELECTOR);
    if(target){event.preventDefault();event.stopPropagation();announce(copy().unavailable);return;}
    const skins=event.target.closest('[data-go="skins"]');
    if(skins){event.preventDefault();event.stopPropagation();announce(copy().skinsOffline);}
  },true);
};

export function initializePwaV324(){
  if(initialized||typeof document==='undefined')return false;
  initialized=true;
  installStyle();
  const responsive=createResponsiveEnchantmentCoreV533();
  const recovery=createPwaPerformanceRecoveryCoreV546();
  document.documentElement.dataset.pwaWorld=String(VERSION);
  installPerformanceV324();
  installAccessibility();
  setupInstall();
  injectInternationalInstallLink();
  setupOfflinePreparation();
  setupServiceWorker();
  setupReturnFromBackground();
  guardOffline();
  updateNetwork({initial:true});
  addEventListener('online',()=>updateNetwork());
  addEventListener('offline',()=>updateNetwork());
  ['divina:page-ready','divina:account-sync-applied','divina:identity-rights-ready-v531']
    .forEach(type=>document.addEventListener(type,()=>updateOnlineOnlyActions(navigator.onLine),{passive:true}));
  globalThis.divinaPwaV324=Object.freeze({
    version:VERSION,
    install:installApp,
    prepareOfflineCore:()=>askWorker('PREPARE_OFFLINE_CORE'),
    prepareOfflineTarot:()=>askWorker('PREPARE_OFFLINE_CORE'),
    prepareOfflinePremium:()=>premiumEntitlementActive()
      ?askWorker('PREPARE_OFFLINE_PREMIUM',{premiumAuthorized:true})
      :Promise.resolve({type:'OFFLINE_PREMIUM_STATUS',complete:false,reason:'server-entitlement-required'}),
    offlineStatus:()=>askWorker('GET_OFFLINE_STATUS'),
    verifyShell:()=>askWorker('VERIFY_SHELL'),
    repairShell:()=>askWorker('REPAIR_SHELL'),
    clearOptionalCaches:()=>askWorker('CLEAR_OPTIONAL_OFFLINE'),
    webVitals:summarizeLocalWebVitalsV324,
    performanceTier:performanceTierV324,
    responsive,
    recovery,
    authorityDataCached:false,
    whitLocalOffline:true,
    whitOnlineOffline:false,
    billingOffline:false,
    adminOffline:false,
    consultationSubmitOffline:false,
    currentSkinPreservedOffline:true,
    mutationObservers:0,
    permanentLoops:0
  });
  globalThis.divinaPwaV196=globalThis.divinaPwaV324;
  return true;
}

if(typeof document!=='undefined'){
  const autoStart=()=>document.body?.classList.contains('db-install-page')&&initializePwaV324();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoStart,{once:true});
  else queueMicrotask(autoStart);
}
