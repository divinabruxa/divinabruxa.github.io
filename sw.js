/* DIVINA BRUXA — SERVICE WORKER V48 · GUARDIÃO DO PORTAL V152 */
const CACHE='divina-bruxa-v48-guardiao-v152';

const REQUIRED=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './app.js',
  './page-loader-v1.js',
  './orb-loading-portal-v1.js',
  './orb-loading-portal-v1.css',
  './cosmic-media-v1.js',
  './cosmic-media-v1.css',
  './runtime-v12.js',
  './runtime-v12.css',
  './PAGE-INTERIORS-V10.css',
  './PORTAL-TRANSITIONS-V10.css',
  './portal-transition-v10.js',
  './skin-registry-v12.js',
  './skin-universal-v10.js',
  './skin-catalog-v6.js',
  './skins-v6.js',
  './skins-v6.css',
  './premium-constellation-v1.css',
  './premium-entitlements-v142.js',
  './premium-policy.js',
  './premium-engine.js',
  './config.js',
  './auth-client-v6.js',
  './navigation.js',
  './notification-policy-v150.js',
  './notification-engine-v150.js',
  './notification-celestial-v150.css',
  './orb-engine-v68.js',
  './mini-orb-engine.js',
  './visual-guard-v6.js',
  './tarot-experience-v6.js',
  './orb-skin-release-v1.css',
  './orb-skin-release-v1.js',
  './cosmic-visual-atlas-v1.css',
  './cosmic-visual-atlas-v1.js',
  './divina-orb-fast-v1.webp',
  './divina-orb-thumb-v1.webp',
  './divina-icon-fast-v1.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png'
];

const CORE=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './app.js',
  './app.css',
  './runtime-v12.js',
  './navigation.js',
  './page-loader-v1.js',
  './orb-loading-portal-v1.js',
  './orb-loading-portal-v1.css',
  './config.js',
  './orb-engine-v68.js',
  './mini-orb-engine.js',
  './auth-client-v6.js',
  './visual-guard-v6.js',
  './tarot-experience-v6.js',
  './skin-universal-v10.js',
  './skin-registry-v12.js',
  './portal-transition-v10.js',
  './cosmic-media-v1.js'
];

const WARM=[
  './app.css','./motion.css','./update-04.css','./update-05.css','./update-06.css','./update-08.css','./update-09.css','./update-11.css',
  './visual-v68.css','./COSMIC-DESIGN-SYSTEM-V10.css',
  './cosmic-design-system-v1.css','./menu-ring-v8.css','./home-orb-only-v1.css','./home-orb-words-v2.css',
  './tarot-table-v5.css','./tarot-ritual-v5.css','./tarot-controls-v5.css','./tarot-editorial-v5.css',
  './tarot-livre-official-v1.css','./tarot-livre-ios-v1.css','./tarot-spiral-suction-v1.webp',
  './spreads-v5.css','./spreads-temple-v1.css','./templo-tiragens-celestial-v1.webp',
  './card-library-v5.css','./ai-v5.css','./premium-v5.css','./consultation-v5.css','./consultations-celestial-v1.css','./notification-v5.css','./admin-analytics-v1.css','./admin-command-v1.css',
  './media-celestial-v149.css','./midia-celestial-estudio-v1.webp','./media-engine-v149.js','./media-policy-v149.js','./media-ecosystem-v149.js','./store-v5.css','./store-celestial-v1.css','./loja-mistica-celestial-v1.webp','./store-engine.js','./store-policy.js','./school-v5.css','./school-celestial-v1.css','./escola-tarot-observatorio-v1.webp',
  './school-engine.js','./school-policy.js','./spreads-engine.js','./spreads-policy.js','./spread-synthesis.js',
  './tarot-data.js','./storage.js','./tarot-engine.js','./tarot-image-runtime.js','./daily-meaning-runtime.js','./tarot-meanings.js','./meaning-engine.js','./tarot-atlas.webp','./card-library-policy.js',
  './journal-v5.css','./journal-celestial-v1.css','./diario-espelho-celestial-v1.webp',
  './journal-engine.js','./journal-policy.js','./rhythm-v6.js','./premium-constelacao-30-skins-v1.webp',
  './ai-celestial-v1.css','./orbe-ia-celestial-v1.webp','./ai-engine.js','./ai-policy.js','./ai-credits.js',
  './consultation-engine.js','./consultation-policy.js','./consultas-celestiais-santuario-v1.webp',
  './admin-engine.js','./admin-policy.js','./auth-client-v6.js',
  './ADMIN-BACKEND-CONTRACT-V146.json',
  './fallback-shell-v1.css','./pwa-final-v1.css'
];

const cacheAsset=async(cache,asset)=>{
  const request=new Request(new URL(asset,self.registration.scope),{cache:'reload'});
  const response=await fetch(request);
  if(!response.ok||response.headers.get('content-length')==='0')throw new Error(`Invalid asset: ${asset}`);
  await cache.put(request,response);
  return asset;
};

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const coreResults=await Promise.allSettled(CORE.map(asset=>cacheAsset(cache,asset)));
  const coreFailures=coreResults.filter(result=>result.status==='rejected');
  if(coreFailures.length)throw new Error(`Core cache incomplete: ${coreFailures.length}`);
  const optional=[...new Set([...REQUIRED,...WARM])].filter(asset=>!CORE.includes(asset));
  await Promise.allSettled(optional.map(asset=>cacheAsset(cache,asset)));
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const sameOrigin=url.origin===self.location.origin;
  const navigation=event.request.mode==='navigate'||event.request.destination==='document';
  const sensitive=sameOrigin&&/(^|\/)(api\/)?(ai|auth|account|admin|entitlements|billing|payments|consultations)(\/|$)/.test(url.pathname);

  if(sensitive){
    event.respondWith(fetch(event.request).catch(()=>new Response('',{status:503,statusText:'Secure connection required'})));
    return;
  }

  event.respondWith((async()=>{
    if(sameOrigin&&event.request.destination==='image'){
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached) return cached;
      try{
        const response=await fetch(event.request);
        if(response.ok&&response.headers.get('content-length')!=='0'){
          const cache=await caches.open(CACHE);
          await cache.put(event.request,response.clone());
        }
        if(response.headers.get('content-length')==='0'){
          const cached=await caches.match(event.request,{ignoreSearch:true});
          if(cached)return cached;
          return new Response('',{status:503,statusText:'Empty image rejected'});
        }
        return response;
      }catch{
        return new Response('',{status:503,statusText:'Offline'});
      }
    }

    try{
      const response=await fetch(event.request);
      const zeroLength=response.headers.get('content-length')==='0';
      const appShellNavigation=navigation&&sameOrigin&&(url.pathname==='/'||url.pathname.endsWith('/index.html'));
      let validAppShell=true;
      if(response.ok&&appShellNavigation){
        const html=await response.clone().text();
        validAppShell=html.length>1024&&/id=["']app["']/.test(html)&&/id=["']home["']/.test(html);
      }
      if(response.ok&&!zeroLength&&validAppShell&&sameOrigin){
        const cache=await caches.open(CACHE);
        await cache.put(event.request,response.clone());
      }
      if(zeroLength||!validAppShell){
        const cached=await caches.match(event.request,{ignoreSearch:true});
        if(cached)return cached;
        if(navigation)return (await caches.match('./offline.html'))||new Response('A Divina Bruxa está se reconectando.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
        return new Response('',{status:503,statusText:'Empty core asset rejected'});
      }
      return response;
    }catch{
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached) return cached;
      if(navigation) return (await caches.match('./offline.html'))||Response.error();
      return new Response('',{status:503,statusText:'Offline'});
    }
  })());
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const raw=String(event.notification?.data?.url||'#home');
  const target=/^#(?:home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(raw)?raw:'#home';
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const current=windows.find(client=>new URL(client.url).origin===self.location.origin);
    if(current){await current.focus();current.postMessage({type:'divina-notification-open',target});return;}
    await self.clients.openWindow(`./${target}`);
  })());
});
