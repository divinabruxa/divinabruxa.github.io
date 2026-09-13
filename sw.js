/* DIVINA BRUXA 3.0 — PWA, PERFORMANCE, OFFLINE E RECUPERAÇÃO · MACROETAPA 12/14 · V546
   Cache seletivo e versionado. Nunca guarda Auth, respostas online da Whit, billing,
   Admin, consultas seguras ou outras respostas de autoridade. */

const VERSION=546;
const OWNED_PREFIX='divina-bruxa-';
const SHELL_CACHE='divina-bruxa-v546-shell';
const CONTENT_CACHE='divina-bruxa-v546-content';
const IMAGE_CACHE='divina-bruxa-v546-images';
const OFFLINE_CACHE='divina-bruxa-v546-offline-core';
const PREMIUM_CACHE='divina-bruxa-v546-premium-static';
const ACTIVE_CACHES=new Set([SHELL_CACHE,CONTENT_CACHE,IMAGE_CACHE,OFFLINE_CACHE,PREMIUM_CACHE]);
const NAVIGATION_TIMEOUT_MS=3500;
const MAX_CONTENT_ENTRIES=180;
const MAX_IMAGE_ENTRIES=96;
const MAX_RUNTIME_IMAGE_BYTES=1800000;
const PRIVATE_ROUTE_PATTERN=/(?:^|\/)(?:admin|account|conta|diario|journal|checkout|billing|pagamento|consulta-individual)(?:[./-]|$)/i;

const REQUIRED_SHELL=Object.freeze([
  './','./index.html',
  './offline.html','./offline-en.html','./offline-es.html',
  './manifest.webmanifest',
  './app-v208.js','./navigation.js','./route-registry-v180.js','./page-loader-v1.js',
  './world-truth-registry-v535.js','./orb-fluid-navigation-v535.js',
  './vitality-bus-v536.js','./living-grammar-v536.js','./living-grammar-v536.css',
  './origin-discovery-v537.js','./origin-discovery-v537.css',
  './runtime-v12.js','./orb-motion-core-v207.js','./orb-gesture-core-v208.js',
  './orb-engine-v208.js','./supreme-orb-core-v501.js','./supreme-orb-core-v501.css',
  './orb-ios-journey-core-v525.js','./orb-ios-journey-core-v525.css',
  './orb-universal-presence-v526.js','./orb-universal-presence-v526.css',
  './whit-core-supreme-v527.js','./whit-core-supreme-v527.css',
  './whit-presence-deep-v540.js','./whit-presence-deep-v540.css','./whit-local-guide-v540.js',
  './experience-depth-core-v541.js','./experience-depth-core-v541.css',
  './amazon-store-core-v543.js','./amazon-store-core-v543.css',
  './public-library-core-v544.js','./public-library-core-v544.css',
  './international-parity-core-v545.js','./international-parity-v545.css','./international-card-content-v545.js',
  './pwa-performance-recovery-core-v546.js','./pwa-performance-recovery-core-v546.css','./capacitor-readiness-v546.json',
  './tarot-universe-core-v528.js','./tarot-universe-core-v528.css',
  './wisdom-universe-core-v529.js','./wisdom-universe-core-v529.css',
  './wisdom-depth-core-v539.js','./wisdom-depth-core-v539.css',
  './experience-conversion-core-v530.js','./experience-conversion-core-v530.css','./media-policy-v149.js',
  './identity-rights-core-v531.js','./identity-rights-core-v531.css',
  './responsive-enchantment-core-v533.js','./responsive-enchantment-core-v533.css',
  './qa-supreme-core-v534.js','./qa-supreme-core-v534.css',
  './reality-lifecycle-v511.js','./reality-lifecycle-v511.css',
  './orbital-menu-v502.js','./orbital-menu-v502.css',
  './living-universe-core-v524.js','./living-universe-core-v524.css',
  './divina-universe-retina-v523.webp',
  './skin-performance-core-v518.js','./skin-performance-core-v518.css',
  './tarot-livre-orbe-os-v517.js','./tarot-livre-orbe-os-v517.css','./tarot-mesa-bridge-v517.js',
  './tarot-session.js','./tarot-continuity.js','./tarot-image-runtime.js',
  './daily-world-v509.js','./daily-world-v509.css','./daily-policy-v303.js',
  './orb-loading-portal-v1.js',
  './divina-shell-v180.css','./home-orb-absolute-v206.css','./pwa-world-v196.css',
  './pwa-resilience-v324.css','./pwa-world-v324.js','./performance-world-v324.js',
  './divina-orb-fast-v1.webp','./divina-orb-thumb-v1.webp',
  './divina-icon-fast-v1.png','./icon-192.png'
]);

// Fechamento transitivo dos imports estáticos de app-v208.js. Se qualquer um
// falhar, a V546 não assume o controle e o worker anterior continua íntegro.
const BOOT_DEPENDENCIES=Object.freeze([
  './account-consultations-world-v319.js','./account-engine-v201.js','./account-state-copy-v201.js',
  './ai-policy.js','./auth-client-v201.js','./auth-client-v6.js','./card-library-policy.js',
  './commercial-truth-v200.js','./config-v200.js','./consultation-engine.js','./consultation-policy.js',
  './cosmic-media-v1.js','./daily-policy.js','./editorial-metrics-v192.js','./journal-policy.js',
  './portal-transition-v10.js','./school-policy.js','./seo-index-policy-v193.js',
  './skin-registry-v12.js','./skin-universal-v10.js','./spreads-policy.js','./storage.js',
  './store-engine.js','./store-policy.js','./tarot-data.js','./tarot-experience-v6.js','./visual-guard-v6.js',
  './whit-context-bridge-v309.js','./whit-core-v212.js','./whit-generation-bridge-v313.js',
  './whit-memory-garden-v310.js','./whit-mind-v312.js','./whit-nervous-system-v308.js',
  './whit-presence-v307.js','./whit-signature-v311.js','./whit-silent-presence-v316.js'
]);
const ATOMIC_SHELL_ASSETS=Object.freeze([...new Set([...REQUIRED_SHELL,...BOOT_DEPENDENCIES])]);

const APP_DEPENDENCIES=Object.freeze([
  './config-v200.js','./commercial-truth-v200.js',
  './pwa-world-v196.js','./performance-world-v196.js',
  './commerce-engine.js','./store-engine.js','./store-policy.js',
  './media-engine-v149.js','./media-engine-v192.js','./media-policy-v149.js','./editorial-journey-v192.js',
  './media-commerce-world-v320.js','./media-commerce-world-v320.css',
  './auth-client-v6.js','./auth-client-v201.js','./account-engine-v201.js','./account-state-copy-v201.js',
  './account-consultations-world-v319.js','./consultation-engine.js','./consultation-policy.js',
  './premium-engine-v191.js','./premium-policy-v191.js','./skins-v201.js',
  './skins-premium-world-v318.js','./skins-premium-world-v318.css',
  './notification-engine-v150.js','./notification-policy-v150.js',
  './notifications-world-v321.js','./notifications-world-v321.css',
  './admin-engine.js','./admin-policy.js',
  './owner-observatory-v532.js','./owner-observatory-v532.css',
  './visual-guard-v6.js','./tarot-experience-v6.js','./cosmic-media-v1.js',
  './editorial-metrics-v192.js','./seo-index-policy-v193.js','./privacy-center-v9.js',
  './whit-core-v212.js','./whit-presence-v307.js','./whit-presence-v307.css',
  './whit-nervous-system-v308.js','./whit-nervous-system-v308.css',
  './whit-context-bridge-v309.js','./whit-context-bridge-v309.css',
  './whit-memory-garden-v310.js','./whit-memory-garden-v310.css',
  './whit-signature-v311.js','./whit-signature-v311.css',
  './whit-mind-v312.js','./whit-mind-v312.css',
  './whit-generation-bridge-v313.js','./whit-silent-presence-v316.js','./whit-silent-presence-v316.css',
  './ai-engine.js','./ai-policy.js','./ai-credits.js',
  './menu-completo-v177.js','./orb-skin-release-v1.js','./cosmic-visual-atlas-v1.js',
  './skin-registry-v12.js','./skin-universal-v10.js','./skin-catalog-v6.js',
  './storage.js','./school-policy.js','./journal-policy.js','./daily-policy.js','./daily-policy-v303.js',
  './biblioteca-universal-v184.css','./tiragens-definitivas-v185.css','./escola-definitiva-v186.css',
  './diario-definitivo-v187.css','./consultations-definitive-v188.css','./account-secure-v201.css',
  './orbe-ai-governada-v190.css','./premium-billing-v191.css','./editorial-universe-v192.css',
  './international-v195.css','./international-parity-v545.css','./international-card-content-v545.js',
  './international-library-v195.js','./international-card-image-v196.js','./international-tarot-v195.js','./international-home-v195.js'
]);

const FREE_OFFLINE_ASSETS=Object.freeze([
  './tarot-data.js','./tarot-image-runtime.js','./tarot-session.js','./tarot-continuity.js',
  './tarot-universe-core-v528.js','./tarot-universe-core-v528.css',
  './wisdom-universe-core-v529.js','./wisdom-universe-core-v529.css',
  './wisdom-depth-core-v539.js','./wisdom-depth-core-v539.css',
  './whit-presence-deep-v540.js','./whit-presence-deep-v540.css','./whit-local-guide-v540.js',
  './experience-depth-core-v541.js','./experience-depth-core-v541.css',
  './amazon-store-core-v543.js','./amazon-store-core-v543.css',
  './public-library-core-v544.js','./public-library-core-v544.css',
  './ai-engine.js','./ai-policy.js','./ai-credits.js','./orbe-ai-governada-v190.css',
  './living-universe-core-v524.js','./living-universe-core-v524.css','./divina-universe-retina-v523.webp',
  './tarot-livre-orbe-os-v517.js','./tarot-livre-orbe-os-v517.css','./tarot-mesa-bridge-v517.js',
  './tarot-atlas-mobile-v196.webp',
  './card-library-policy.js','./card-library-engine.js','./library-world-v302.js','./library-world-v302.css',
  './biblioteca-universal-v184.js','./biblioteca-universal-v184.css','./busca-v165.js','./busca-v165.css',
  './daily-world-v509.js','./daily-world-v509.css','./daily-policy-v303.js','./daily-meaning-runtime.js','./tarot-meanings.js','./meaning-engine.js',
  './journal-engine.js','./journal-policy.js','./rhythm-v6.js','./journal-world-v317.js','./journal-world-v317.css','./diario-definitivo-v187.css',
  './skin-registry-v12.js','./skin-universal-v10.js','./skin-catalog-v6.js',
  './divina-orb-fast-v1.webp','./divina-orb-thumb-v1.webp'
]);

// Arquivos estáticos não concedem direitos. Este grupo só é preparado quando
// o cliente possui snapshot online de entitlement Premium ativo; a autoridade
// continua no servidor em toda reabertura.
const PREMIUM_OFFLINE_ASSETS=Object.freeze([
  './school-engine.js','./school-policy.js','./school-world-v306.js','./school-world-v306.css','./escola-definitiva-v186.css',
  './spreads-world-v305.js','./spreads-world-v305.css','./spreads-engine.js',
  './spread-synthesis.js','./spread-synthesis-v331.js','./spreads-supreme-v331.js','./tiragens-definitivas-v185.css',
  './daily-meaning-runtime.js','./meaning-engine.js',
  './tarot-continuity.js','./tarot-session.js','./tarot-atlas-mobile-v196.webp'
]);

const PUBLIC_OFFLINE_PAGES=Object.freeze([
  './acessibilidade.html','./english.html','./espanol.html',
  './tarot-livre.html','./free-tarot-reading.html','./tarot-libre.html',
  './cartas-do-tarot.html','./tarot-card-meanings.html','./significados-cartas-tarot.html',
  './buscar.html','./guias-para-comecar.html','./mapa-do-tarot.html',
  './escola-do-tarot.html','./tarot-school.html','./escuela-tarot.html',
  './consultas-de-tarot.html','./tarot-consultations.html','./consultas-tarot.html',
  './etica-e-responsabilidade.html','./tarot-ethics.html','./etica-tarot.html',
  './contato.html','./contact.html','./contacto.html',
  './instalar-app.html','./install-app.html','./instalar-aplicacion.html',
  './loja-mistica.html','./musica.html','./de-frente-com-o-tarot.html',
  './tarot-spreads.html','./music.html','./face-to-face-with-tarot.html','./mystic-store.html',
  './tiradas-tarot.html','./musica-tarot.html','./de-frente-con-el-tarot.html','./tienda-mistica.html',
  './privacidade-e-dados.html'
]);

const ENGLISH_PATHS=new Set(['english.html','free-tarot-reading.html','tarot-card-meanings.html','tarot-school.html','tarot-consultations.html','tarot-ethics.html','contact.html','install-app.html','tarot-spreads.html','music.html','face-to-face-with-tarot.html','mystic-store.html']);
const SPANISH_PATHS=new Set(['espanol.html','tarot-libre.html','significados-cartas-tarot.html','escuela-tarot.html','consultas-tarot.html','etica-tarot.html','contacto.html','instalar-aplicacion.html','tiradas-tarot.html','musica-tarot.html','de-frente-con-el-tarot.html','tienda-mistica.html']);

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
  for(const cacheName of [OFFLINE_CACHE,PREMIUM_CACHE,SHELL_CACHE,CONTENT_CACHE,IMAGE_CACHE]){
    const cache=await caches.open(cacheName);
    const response=await cache.match(request,{ignoreSearch:true});
    if(response)return response;
  }
  return null;
};

const prepareOfflineCore=async()=>{
  const assets=[...new Set([...ATOMIC_SHELL_ASSETS,...APP_DEPENDENCIES,...FREE_OFFLINE_ASSETS,...PUBLIC_OFFLINE_PAGES])];
  const failures=await cacheBatch(OFFLINE_CACHE,assets,5);
  // Atlas alias keeps legacy card runtime compatible.
  const cache=await caches.open(OFFLINE_CACHE);
  const mobileAtlas=await cache.match(absoluteRequest('./tarot-atlas-mobile-v196.webp'),{ignoreSearch:true});
  if(mobileAtlas)await cache.put(absoluteRequest('./tarot-atlas.webp'),mobileAtlas.clone());
  return offlineStatus(failures);
};

const prepareOfflinePremium=async authorized=>{
  if(authorized!==true)return {type:'OFFLINE_PREMIUM_STATUS',version:VERSION,complete:false,reason:'server-entitlement-required',cached:0,total:PREMIUM_OFFLINE_ASSETS.length};
  const failures=await cacheBatch(PREMIUM_CACHE,PREMIUM_OFFLINE_ASSETS,4);
  return {
    type:'OFFLINE_PREMIUM_STATUS',version:VERSION,
    complete:failures.length===0,cached:PREMIUM_OFFLINE_ASSETS.length-failures.length,
    total:PREMIUM_OFFLINE_ASSETS.length,failures,
    authority:'server-snapshot-required-on-client',grantsEntitlement:false
  };
};

const offlineStatus=async(existingFailures=[])=>{
  const assets=[...new Set([...ATOMIC_SHELL_ASSETS,...APP_DEPENDENCIES,...FREE_OFFLINE_ASSETS,...PUBLIC_OFFLINE_PAGES])];
  const stores=await Promise.all([OFFLINE_CACHE,SHELL_CACHE,CONTENT_CACHE,IMAGE_CACHE].map(name=>caches.open(name)));
  const queue=[...assets],states=[];
  const workers=Array.from({length:Math.min(10,queue.length||1)},async()=>{
    while(queue.length){
      const asset=queue.shift(),request=absoluteRequest(asset);
      let found=false;
      for(const store of stores){if(await store.match(request,{ignoreSearch:true})){found=true;break;}}
      states.push(found);
    }
  });
  await Promise.all(workers);
  const ready=states.filter(Boolean).length;
  const aliasRequest=absoluteRequest('./tarot-atlas.webp');
  let aliasReady=false;
  for(const store of stores){if(await store.match(aliasRequest,{ignoreSearch:true})){aliasReady=true;break;}}
  return {
    type:'OFFLINE_CORE_STATUS',version:VERSION,
    ready:ready+Number(aliasReady),total:assets.length+1,
    complete:ready===assets.length&&aliasReady,
    failures:existingFailures,
    worlds:{tarot:true,dailyPreviouslyRevealed:true,library:true,journalLocal:true,whitLocal:true,currentSkin:true},
    premium:{preparedCache:PREMIUM_CACHE,requiresServerEntitlement:true,grantsEntitlement:false},
    onlineOnly:{whitOnline:true,billing:true,admin:true,consultationSubmit:true,accountAuthority:true}
  };
};

const shellStatus=async(existingFailures=[])=>{
  const cache=await caches.open(SHELL_CACHE);
  const checks=await Promise.all(ATOMIC_SHELL_ASSETS.map(async asset=>({
    asset,
    ready:Boolean(await cache.match(absoluteRequest(asset),{ignoreSearch:true}))
  })));
  const missing=checks.filter(item=>!item.ready).map(item=>item.asset);
  return {
    type:'SHELL_STATUS',version:VERSION,complete:missing.length===0,
    ready:checks.length-missing.length,total:checks.length,missing,
    failures:existingFailures,atomic:true,cache:SHELL_CACHE
  };
};

const repairShell=async()=>{
  const failures=await cacheBatch(SHELL_CACHE,ATOMIC_SHELL_ASSETS,4);
  return shellStatus(failures);
};

const trimCache=async(cache,maximum)=>{
  if(!Number.isFinite(maximum)||maximum<1)return;
  const keys=await cache.keys();
  if(keys.length>maximum)await Promise.all(keys.slice(0,keys.length-maximum).map(key=>cache.delete(key)));
};

const cacheResponse=async(cacheName,request,response,maximum=0)=>{
  if(!canCache(response))return false;
  const url=new URL(request.url);
  if(cacheName===IMAGE_CACHE){
    const bytes=Number(response.headers.get('content-length')||0);
    if(bytes>MAX_RUNTIME_IMAGE_BYTES||/(?:master-source|cosmos-(?:deep|master)|skin-.+-v1\.png|divina-orb-v48\.png)$/i.test(url.pathname))return false;
  }
  const cache=await caches.open(cacheName);
  await cache.put(request,response.clone());
  await trimCache(cache,maximum);
  return true;
};

const fetchWithTimeout=async(request,timeout=NAVIGATION_TIMEOUT_MS)=>{
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
  return html.length>1024&&/id=["']app["']/.test(html)&&/id=["']home["']/.test(html)&&/app-v208\.js\?v=546/.test(html);
};

const offlinePageFor=async url=>{
  const name=url.pathname.split('/').pop()||'';
  const fallback=(ENGLISH_PATHS.has(name)||name.startsWith('en-'))?'./offline-en.html':(SPANISH_PATHS.has(name)||name.startsWith('es-'))?'./offline-es.html':'./offline.html';
  return matchAny(absoluteRequest(fallback));
};

const navigationNetworkFirst=async(request,url,preloadResponse)=>{
  try{
    const response=(await preloadResponse?.catch?.(()=>null))||await fetchWithTimeout(request);
    const privateRoute=PRIVATE_ROUTE_PATTERN.test(url.pathname);
    if(canCache(response)&&await appShellIsValid(url,response)){
      if(!privateRoute)await cacheResponse(CONTENT_CACHE,request,response,MAX_CONTENT_ENTRIES).catch(()=>false);
      return response;
    }
    const cached=await matchAny(request);if(cached)return cached;
  }catch{
    const cached=await matchAny(request);if(cached)return cached;
  }
  return (await offlinePageFor(url))||new Response('Divina Bruxa is reconnecting.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
};

const networkFirst=async request=>{
  try{
    const response=await fetch(request);
    await cacheResponse(CONTENT_CACHE,request,response,MAX_CONTENT_ENTRIES).catch(()=>false);
    return response;
  }catch{
    return (await matchAny(request))||new Response('',{status:503,statusText:'Offline'});
  }
};

const staleWhileRevalidate=async request=>{
  const cached=await matchAny(request);
  const network=fetch(request).then(async response=>{
    await cacheResponse(CONTENT_CACHE,request,response,MAX_CONTENT_ENTRIES).catch(()=>false);
    return response;
  }).catch(()=>null);
  if(cached){network.catch(()=>null);return cached;}
  return (await network)||new Response('',{status:503,statusText:'Offline'});
};

const cacheFirst=async(request,cacheName,maximum)=>{
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request,{ignoreSearch:true});
  if(cached)return cached;
  try{
    const response=await fetch(request);
    await cacheResponse(cacheName,request,response,maximum).catch(()=>false);
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
  const requiredFailures=await cacheBatch(SHELL_CACHE,ATOMIC_SHELL_ASSETS,4);
  if(requiredFailures.length)throw new Error(`required-shell-incomplete:${requiredFailures.map(item=>item.asset).join(',')}`);
  // O universo offline amplo só é preparado quando a pessoa pede.
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(OWNED_PREFIX)&&!ACTIVE_CACHES.has(key)).map(key=>caches.delete(key)));
  await self.registration.navigationPreload?.enable?.().catch(()=>null);
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
  if(navigation){event.respondWith(navigationNetworkFirst(request,url,event.preloadResponse));return;}

  if(request.destination==='image'){
    event.respondWith(cacheFirst(request,IMAGE_CACHE,MAX_IMAGE_ENTRIES));return;
  }

  if(['script','style','font','manifest','worker'].includes(request.destination)||/\.(?:js|css|webmanifest|json)$/.test(url.pathname)){
    event.respondWith(staleWhileRevalidate(request));return;
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
  if(type==='PREPARE_OFFLINE_PREMIUM'){
    event.waitUntil(prepareOfflinePremium(event.data?.premiumAuthorized===true).then(respond).catch(error=>respond({type:'OFFLINE_PREMIUM_STATUS',complete:false,error:error?.message||'prepare-failed'})));
    return;
  }
  if(type==='VERIFY_SHELL'){
    event.waitUntil(shellStatus().then(respond).catch(error=>respond({type:'SHELL_STATUS',version:VERSION,complete:false,error:error?.message||'verify-failed'})));
    return;
  }
  if(type==='REPAIR_SHELL'){
    event.waitUntil(repairShell().then(respond).catch(error=>respond({type:'SHELL_STATUS',version:VERSION,complete:false,error:error?.message||'repair-failed'})));
    return;
  }
  if(type==='CLEAR_OPTIONAL_OFFLINE'){
    event.waitUntil((async()=>{
      await Promise.all([caches.delete(OFFLINE_CACHE),caches.delete(PREMIUM_CACHE)]);
      respond({type:'OFFLINE_CORE_CLEARED',version:VERSION,ok:true,authorityDataRemoved:false});
    })());
    return;
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
