/* DIVINA BRUXA 2.0 — UNIVERSO VIVO · MACROETAPA 1/4 · CÉU RETINA ESTÁVEL V522
   Cache seletivo e versionado. Nunca guarda Auth, Whit generation, billing,
   Admin, consultas seguras ou outras respostas de autoridade. */

const VERSION=522;
const OWNED_PREFIX='divina-bruxa-';
const SHELL_CACHE='divina-bruxa-v522-shell';
const CONTENT_CACHE='divina-bruxa-v522-content';
const IMAGE_CACHE='divina-bruxa-v522-images';
const OFFLINE_CACHE='divina-bruxa-v522-offline-core';
const ACTIVE_CACHES=new Set([SHELL_CACHE,CONTENT_CACHE,IMAGE_CACHE,OFFLINE_CACHE]);

const REQUIRED_SHELL=Object.freeze([
  './','./index.html',
  './offline.html','./offline-en.html','./offline-es.html',
  './manifest.webmanifest',
  './app-v208.js','./navigation.js','./route-registry-v180.js','./page-loader-v1.js',
  './runtime-v12.js','./orb-motion-core-v207.js','./orb-gesture-core-v208.js',
  './orb-engine-v208.js','./supreme-orb-core-v501.js','./supreme-orb-core-v501.css',
  './reality-lifecycle-v511.js','./reality-lifecycle-v511.css',
  './orbital-menu-v502.js','./orbital-menu-v502.css',
  './living-universe-core-v522.js','./living-universe-core-v522.css',
  './skin-performance-core-v518.js','./skin-performance-core-v518.css',
  './tarot-livre-orbe-os-v517.js','./tarot-livre-orbe-os-v517.css','./tarot-mesa-bridge-v517.js',
  './daily-world-v509.js','./daily-world-v509.css','./daily-policy-v303.js',
  './orb-loading-portal-v1.js',
  './divina-shell-v180.css','./home-orb-absolute-v206.css','./pwa-world-v196.css',
  './pwa-resilience-v324.css','./pwa-world-v324.js','./performance-world-v324.js',
  './divina-orb-fast-v1.webp','./divina-orb-thumb-v1.webp',
  './divina-icon-fast-v1.png','./icon-192.png'
]);

const APP_DEPENDENCIES=Object.freeze([
  './config-v200.js','./commercial-truth-v200.js',
  './auth-client-v6.js','./auth-client-v201.js','./account-engine-v201.js','./account-state-copy-v201.js',
  './account-consultations-world-v319.js','./consultation-engine.js','./consultation-policy.js',
  './visual-guard-v6.js','./tarot-experience-v6.js','./cosmic-media-v1.js',
  './editorial-metrics-v192.js','./seo-index-policy-v193.js','./privacy-center-v9.js',
  './whit-core-v212.js','./whit-presence-v307.js','./whit-presence-v307.css',
  './whit-nervous-system-v308.js','./whit-nervous-system-v308.css',
  './whit-context-bridge-v309.js','./whit-context-bridge-v309.css',
  './whit-memory-garden-v310.js','./whit-memory-garden-v310.css',
  './whit-signature-v311.js','./whit-signature-v311.css',
  './whit-mind-v312.js','./whit-mind-v312.css',
  './whit-generation-bridge-v313.js','./whit-silent-presence-v316.js','./whit-silent-presence-v316.css',
  './menu-completo-v177.js','./orb-skin-release-v1.js','./cosmic-visual-atlas-v1.js',
  './skin-registry-v12.js','./skin-universal-v10.js','./skin-catalog-v6.js',
  './storage.js','./school-policy.js','./journal-policy.js','./daily-policy.js','./daily-policy-v303.js',
  './biblioteca-universal-v184.css','./tiragens-definitivas-v185.css','./escola-definitiva-v186.css',
  './diario-definitivo-v187.css','./consultations-definitive-v188.css','./account-secure-v201.css',
  './orbe-ai-governada-v190.css','./premium-billing-v191.css','./editorial-universe-v192.css',
  './international-v195.css'
]);

const REBIRTH_WARM=Object.freeze([
  './living-universe-core-v522.js','./living-universe-core-v522.css',
  './tarot-livre-orbe-os-v517.js','./tarot-livre-orbe-os-v517.css','./tarot-mesa-bridge-v517.js',
  './library-world-v302.js','./library-world-v302.css',
  './daily-world-v509.js','./daily-world-v509.css','./daily-policy-v303.js',
  './spreads-world-v305.js','./spreads-world-v305.css',
  './school-world-v306.js','./school-world-v306.css',
  './journal-world-v317.js','./journal-world-v317.css',
  './skins-premium-world-v318.js','./skins-premium-world-v318.css',
  './media-commerce-world-v320.js','./media-commerce-world-v320.css',
  './notifications-world-v321.js','./notifications-world-v321.css',
  './admin-intelligence-v322.js','./admin-intelligence-v322.css',
  './privacy-center-v323.css'
]);

const OFFLINE_WORLD_ASSETS=Object.freeze([
  './tarot-data.js','./tarot-image-runtime.js','./tarot-session.js','./tarot-continuity.js',
  './living-universe-core-v522.js','./living-universe-core-v522.css',
  './tarot-livre-orbe-os-v517.js','./tarot-livre-orbe-os-v517.css','./tarot-mesa-bridge-v517.js',
  './tarot-atlas-mobile-v196.webp',
  './card-library-policy.js','./card-library-engine.js','./library-world-v302.js','./library-world-v302.css',
  './daily-world-v509.js','./daily-world-v509.css','./daily-policy-v303.js','./daily-meaning-runtime.js','./tarot-meanings.js','./meaning-engine.js',
  './school-engine.js','./school-policy.js','./school-world-v306.js','./school-world-v306.css','./escola-definitiva-v186.css',
  './journal-engine.js','./journal-policy.js','./rhythm-v6.js','./journal-world-v317.js','./journal-world-v317.css','./diario-definitivo-v187.css',
  './skin-registry-v12.js','./skin-universal-v10.js','./skin-catalog-v6.js',
  './divina-orb-fast-v1.webp','./divina-orb-thumb-v1.webp'
]);

const PUBLIC_OFFLINE_PAGES=Object.freeze([
  './acessibilidade.html','./english.html','./espanol.html',
  './tarot-livre.html','./free-tarot-reading.html','./tarot-libre.html',
  './cartas-do-tarot.html','./tarot-card-meanings.html','./significados-cartas-tarot.html',
  './escola-do-tarot.html','./tarot-school.html','./escuela-tarot.html',
  './consultas-de-tarot.html','./tarot-consultations.html','./consultas-tarot.html',
  './etica-e-responsabilidade.html','./tarot-ethics.html','./etica-tarot.html',
  './contato.html','./contact.html','./contacto.html',
  './instalar-app.html','./install-app.html','./instalar-aplicacion.html',
  './loja-mistica.html','./musica.html','./de-frente-com-o-tarot.html',
  './privacidade-e-dados.html'
]);

const ENGLISH_PATHS=new Set(['english.html','free-tarot-reading.html','tarot-card-meanings.html','tarot-school.html','tarot-consultations.html','tarot-ethics.html','contact.html','install-app.html']);
const SPANISH_PATHS=new Set(['espanol.html','tarot-libre.html','significados-cartas-tarot.html','escuela-tarot.html','consultas-tarot.html','etica-tarot.html','contacto.html','instalar-aplicacion.html']);

const absoluteRequest=asset=>new Request(new URL(asset,self.registration.scope),{credentials:'same-origin',cache:'reload'});

const canCache=response=>{
  if(!response||!response.ok||response.type==='opaque')return false;
  if(response.headers.get('content-length')==='0')return false;
  const control=response.headers.get('cache-control')||'';
  if(/\b(?:no-store|private)\b/i.test(control))return false;
  if(response.headers.has('set-cookie'))return false;
  return true;
};

const cacheAsset=async(cacheName,asset)=>{
  const request=absoluteRequest(asset);
  const response=await fetch(request);
  if(!canCache(response))throw new Error(`invalid-cache-asset:${asset}`);
  const cache=await caches.open(cacheName);
  await cache.put(request,response.clone());
  return asset;
};

const cacheBatch=async(cacheName,assets,concurrency=6)=>{
  const queue=[...new Set(assets)],failures=[];
  const workers=Array.from({length:Math.min(concurrency,queue.length||1)},async()=>{
    while(queue.length){
      const asset=queue.shift();
      try{await cacheAsset(cacheName,asset);}
      catch(error){failures.push({asset,message:error?.message||'cache-failed'});}
    }
  });
  await Promise.all(workers);
  return failures;
};

const matchAny=async request=>{
  for(const cacheName of [OFFLINE_CACHE,SHELL_CACHE,CONTENT_CACHE,IMAGE_CACHE]){
    const cache=await caches.open(cacheName);
    const response=await cache.match(request,{ignoreSearch:true});
    if(response)return response;
  }
  return null;
};

const prepareOfflineCore=async()=>{
  const assets=[...REQUIRED_SHELL,...APP_DEPENDENCIES,...OFFLINE_WORLD_ASSETS];
  const failures=await cacheBatch(OFFLINE_CACHE,assets,5);
  // Atlas alias keeps legacy card runtime compatible.
  const cache=await caches.open(OFFLINE_CACHE);
  const mobileAtlas=await cache.match(absoluteRequest('./tarot-atlas-mobile-v196.webp'),{ignoreSearch:true});
  if(mobileAtlas)await cache.put(absoluteRequest('./tarot-atlas.webp'),mobileAtlas.clone());
  return offlineStatus(failures);
};

const offlineStatus=async(existingFailures=[])=>{
  const assets=[...REQUIRED_SHELL,...APP_DEPENDENCIES,...OFFLINE_WORLD_ASSETS];
  let ready=0;
  for(const asset of assets){
    if(await matchAny(absoluteRequest(asset)))ready+=1;
  }
  const aliasReady=Boolean(await matchAny(absoluteRequest('./tarot-atlas.webp')));
  return {
    type:'OFFLINE_CORE_STATUS',version:VERSION,
    ready:ready+Number(aliasReady),total:assets.length+1,
    complete:ready===assets.length&&aliasReady,
    failures:existingFailures,
    worlds:{tarot:true,dailyPreviouslyRevealed:true,library:true,schoolStatic:true,journalLocal:true,currentSkin:true},
    onlineOnly:{ai:true,billing:true,admin:true,consultationSubmit:true,accountAuthority:true}
  };
};

const cacheResponse=async(cacheName,request,response)=>{
  if(!canCache(response))return false;
  const cache=await caches.open(cacheName);
  await cache.put(request,response.clone());
  return true;
};

const fetchWithTimeout=async(request,timeout=4500)=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{return await fetch(request,{signal:controller.signal});}
  finally{clearTimeout(timer);}
};

const appShellIsValid=async(url,response)=>{
  const pathname=url.pathname.replace(/\/+$/,'/');
  const isShell=pathname===new URL('./',self.registration.scope).pathname||pathname.endsWith('/index.html');
  if(!isShell)return true;
  const html=await response.clone().text();
  return html.length>1024&&/id=["']app["']/.test(html)&&/id=["']home["']/.test(html)&&/app-v208\.js\?v=208/.test(html);
};

const offlinePageFor=async url=>{
  const name=url.pathname.split('/').pop()||'';
  const fallback=ENGLISH_PATHS.has(name)?'./offline-en.html':SPANISH_PATHS.has(name)?'./offline-es.html':'./offline.html';
  return matchAny(absoluteRequest(fallback));
};

const navigationNetworkFirst=async(request,url)=>{
  try{
    const response=await fetchWithTimeout(request);
    if(canCache(response)&&await appShellIsValid(url,response)){await cacheResponse(CONTENT_CACHE,request,response);return response;}
    const cached=await matchAny(request);if(cached)return cached;
  }catch{
    const cached=await matchAny(request);if(cached)return cached;
  }
  return (await offlinePageFor(url))||new Response('Divina Bruxa is reconnecting.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
};

const networkFirst=async request=>{
  try{
    const response=await fetch(request);
    await cacheResponse(CONTENT_CACHE,request,response);
    return response;
  }catch{
    return (await matchAny(request))||new Response('',{status:503,statusText:'Offline'});
  }
};

const cacheFirst=async(request,cacheName,maximum)=>{
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request,{ignoreSearch:true});
  if(cached)return cached;
  try{
    const response=await fetch(request);
    if(await cacheResponse(cacheName,request,response)){
      const keys=await cache.keys();
      if(keys.length>maximum)await Promise.all(keys.slice(0,keys.length-maximum).map(key=>cache.delete(key)));
    }
    return response;
  }catch{return new Response('',{status:503,statusText:'Offline'});}
};

const isAuthorityRequest=(request,url)=>{
  if(request.headers.has('authorization'))return true;
  if(request.cache==='no-store')return true;
  const path=url.pathname.toLowerCase();
  if(/\/(?:auth|rest|functions|storage)\/v\d+\//.test(path))return true;
  return /\/(?:api\/)?(?:ai|orbe-ai|auth|account|admin|entitlements|billing|payments|checkout|consultations)(?:\/|$)/.test(path);
};

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const requiredFailures=await cacheBatch(SHELL_CACHE,REQUIRED_SHELL,6);
  if(requiredFailures.length)throw new Error(`required-shell-incomplete:${requiredFailures.map(item=>item.asset).join(',')}`);
  await Promise.allSettled([
    cacheBatch(CONTENT_CACHE,[...APP_DEPENDENCIES,...REBIRTH_WARM,...PUBLIC_OFFLINE_PAGES],6),
    prepareOfflineCore()
  ]);
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(OWNED_PREFIX)&&!ACTIVE_CACHES.has(key)).map(key=>caches.delete(key)));
  await self.clients.claim();
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  windows.forEach(client=>client.postMessage({type:'DIVINA_RELEASE_READY',version:VERSION}));
})()));

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);

  // Dados de autoridade nunca entram no cache.
  if(isAuthorityRequest(request,url)){
    if(url.origin===self.location.origin){
      event.respondWith(fetch(request).catch(()=>new Response(JSON.stringify({error:'secure_connection_required'}),{
        status:503,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
      })));
    }
    return;
  }

  if(url.origin!==self.location.origin)return;

  const navigation=request.mode==='navigate'||request.destination==='document';
  if(navigation){event.respondWith(navigationNetworkFirst(request,url));return;}

  if(request.destination==='image'){
    event.respondWith(cacheFirst(request,IMAGE_CACHE,128));return;
  }

  if(['script','style','font','manifest','worker'].includes(request.destination)||/\.(?:js|css|webmanifest|json)$/.test(url.pathname)){
    event.respondWith(networkFirst(request));return;
  }

  event.respondWith(networkFirst(request));
});

self.addEventListener('message',event=>{
  const respond=value=>event.ports?.[0]?.postMessage(value);
  const type=event.data?.type;
  if(type==='SKIP_WAITING'){event.waitUntil(self.skipWaiting());return;}
  if(type==='GET_OFFLINE_STATUS'){
    event.waitUntil(offlineStatus().then(respond).catch(error=>respond({type:'OFFLINE_CORE_STATUS',complete:false,error:error?.message||'status-failed'})));
    return;
  }
  if(type==='PREPARE_OFFLINE_CORE'||type==='PREPARE_OFFLINE_TAROT'){
    event.waitUntil(prepareOfflineCore().then(respond).catch(error=>respond({type:'OFFLINE_CORE_STATUS',complete:false,error:error?.message||'prepare-failed'})));
    return;
  }
  if(type==='CLEAR_OPTIONAL_OFFLINE'){
    event.waitUntil((async()=>{
      await caches.delete(OFFLINE_CACHE);
      respond({type:'OFFLINE_CORE_CLEARED',version:VERSION,ok:true});
    })());
  }
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const raw=String(event.notification?.data?.url||'#home');
  const target=/^#(?:home|tarot|daily|library|spreads|school|journal|consultations|store|login|subscriptions|ai|music|videos|skins|notifications)$/.test(raw)?raw:'#home';
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const current=windows.find(client=>new URL(client.url).origin===self.location.origin);
    if(current){
      await current.focus();
      current.postMessage({type:'divina-notification-open',target});
      return;
    }
    await self.clients.openWindow(`./${target}`);
  })());
});
