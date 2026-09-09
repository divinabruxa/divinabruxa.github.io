/* DIVINA BRUXA — SERVICE WORKER V63 · SEO E AUTORIDADE V193 */
const CACHE='divina-bruxa-v63-seo-authority-v193';

const REQUIRED=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './divina-shell-v180.css',
  './app.js',
  './page-loader-v1.js',
  './route-registry-v180.js',
  './orb-loading-portal-v1.js',
  './cosmic-media-v1.js',
  './runtime-v12.js',
  './portal-transition-v10.js',
  './skin-registry-v12.js',
  './skin-universal-v10.js',
  './skin-catalog-v6.js',
  './config.js',
  './seo-index-policy-v193.js',
  './editorial-catalog-v192.js',
  './editorial-metrics-v192.js',
  './privacy-center-v9.js',
  './editorial-universe-v192.css',
  './auth-client-v6.js',
  './auth-client-v189.js',
  './account-engine-v189.js',
  './account-secure-v189.css',
  './orbe-ai-governada-v190.css',
  './premium-billing-v191.css',
  './premium-policy-v191.js',
  './premium-engine-v191.js',
  './skins-v191.js',
  './navigation.js',
  './orb-engine-v68.js',
  './mini-orb-engine.js',
  './visual-guard-v6.js',
  './tarot-experience-v6.js',
  './orb-skin-release-v1.js',
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
  './divina-shell-v180.css',
  './app.js',
  './menu-completo-v177.js',
  './runtime-v12.js',
  './navigation.js',
  './page-loader-v1.js',
  './route-registry-v180.js',
  './orb-loading-portal-v1.js',
  './config.js',
  './seo-index-policy-v193.js',
  './editorial-catalog-v192.js',
  './editorial-metrics-v192.js',
  './privacy-center-v9.js',
  './editorial-universe-v192.css',
  './orb-engine-v68.js',
  './mini-orb-engine.js',
  './auth-client-v6.js',
  './auth-client-v189.js',
  './account-engine-v189.js',
  './account-secure-v189.css',
  './orbe-ai-governada-v190.css',
  './premium-billing-v191.css',
  './premium-policy-v191.js',
  './premium-engine-v191.js',
  './skins-v191.js',
  './visual-guard-v6.js',
  './tarot-experience-v6.js',
  './tarot-data.js',
  './storage.js',
  './tarot-engine.js',
  './tarot-image-runtime.js',
  './card-library-policy.js',
  './card-library-engine.js',
  './biblioteca-universal-v184.css',
  './school-engine.js',
  './school-policy.js',
  './escola-definitiva-v186.css',
  './escola-do-tarot.html',
  './tarot-session.js',
  './tarot-continuity.js',
  './tarot-editorial-policy.js',
  './tarot-spiral-suction-v1.webp',
  './tarot-atlas.webp',
  './ritual-engine.js',
  './daily-policy.js',
  './daily-meaning-runtime.js',
  './tarot-meanings.js',
  './meaning-engine.js',
  './spreads-engine.js',
  './spreads-policy.js',
  './spread-synthesis.js',
  './tiragens-definitivas-v185.css',
  './ai-policy.js',
  './ai-credits.js',
  './ai-engine.js',
  './journal-policy.js',
  './journal-engine.js',
  './rhythm-v6.js',
  './diario-definitivo-v187.css',
  './consultation-policy.js',
  './consultation-engine.js',
  './consultations-celestial-v1.css',
  './consultations-definitive-v188.css',
  './tiragens-de-tarot.html',
  './cartas-do-tarot.html',
  './biblioteca-universal-v184.js',
  './skin-universal-v10.js',
  './skin-registry-v12.js',
  './portal-transition-v10.js',
  './cosmic-media-v1.js'
];

const WARM=[
  './menu-completo-v177.js','./tarot-spiral-suction-v1.webp',
  './tarot-data.js','./storage.js','./tarot-engine.js','./tarot-image-runtime.js','./daily-meaning-runtime.js','./tarot-meanings.js','./meaning-engine.js','./tarot-atlas.webp',
  './card-library-policy.js','./card-library-engine.js','./biblioteca-universal-v184.css','./biblioteca-universal-v184.js','./cartas-do-tarot.html',
  './school-engine.js','./school-policy.js','./escola-definitiva-v186.css','./escola-do-tarot.html',
  './journal-engine.js','./journal-policy.js','./rhythm-v6.js','./diario-definitivo-v187.css','./diario-de-tarot.html','./diario-tarot-v173.css','./diario-tarot-v173.js','./diario-espelho-celestial-v1.webp',
  './spreads-engine.js','./spreads-policy.js','./spread-synthesis.js','./tiragens-definitivas-v185.css','./tiragens-de-tarot.html',
  './consultation-policy.js','./consultation-engine.js','./consultations-celestial-v1.css','./consultations-definitive-v188.css','./consultas-de-tarot.html',
  './ai-policy.js','./ai-credits.js','./ai-engine.js','./orbe-ai-governada-v190.css',
  './premium-policy-v191.js','./premium-engine-v191.js','./skins-v191.js','./premium-billing-v191.css',
  './store-engine.js','./store-policy.js','./store-celestial-v1.css','./loja-mistica-celestial-v1.webp','./loja-mistica.html',
  './media-engine-v192.js','./media-policy-v192.js','./editorial-journey-v192.js','./media-celestial-v149.css','./midia-celestial-estudio-v1.webp','./musica.html','./de-frente-com-o-tarot.html',
  './mapa-do-tarot.html','./seo-authority-v193.css',
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
  const sensitive=sameOrigin&&/(^|\/)(functions\/v1\/)?(ai|auth|account|admin|entitlements|billing|payments|consultations)([-/]|$)/.test(url.pathname);

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
