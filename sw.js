/* DIVINA BRUXA — SERVICE WORKER V28 · BIBLIOTECA CELESTIAL SOB DEMANDA */
const CACHE='divina-bruxa-v28-biblioteca-celestial';

const REQUIRED=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './app.js',
  './page-loader-v1.js',
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
  './config.js',
  './auth-client-v6.js',
  './navigation.js',
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
  './divina-icon-fast-v1.png'
];

const WARM=[
  './app.css','./motion.css','./update-04.css','./update-05.css','./update-06.css','./update-08.css','./update-09.css','./update-11.css',
  './visual-v68.css','./COSMIC-DESIGN-SYSTEM-V10.css',
  './cosmic-design-system-v1.css','./menu-ring-v8.css','./home-orb-only-v1.css','./home-orb-words-v2.css',
  './tarot-table-v5.css','./tarot-ritual-v5.css','./tarot-controls-v5.css','./tarot-editorial-v5.css',
  './tarot-livre-official-v1.css','./tarot-livre-ios-v1.css',
  './spreads-v5.css',
  './card-library-v5.css','./ai-v5.css','./premium-v5.css','./consultation-v5.css','./notification-v5.css','./admin-analytics-v1.css',
  './musica-videos-cosmica-v1.css','./store-v5.css','./school-v5.css','./journal-v5.css','./fallback-shell-v1.css','./pwa-final-v1.css'
];

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(REQUIRED);
  await Promise.allSettled(WARM.map(asset=>cache.add(asset)));
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

  event.respondWith((async()=>{
    if(sameOrigin&&event.request.destination==='image'){
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached) return cached;
      try{
        const response=await fetch(event.request);
        if(response.ok){
          const cache=await caches.open(CACHE);
          await cache.put(event.request,response.clone());
        }
        return response;
      }catch{
        return new Response('',{status:503,statusText:'Offline'});
      }
    }

    try{
      const response=await fetch(event.request);
      if(response.ok&&sameOrigin){
        const cache=await caches.open(CACHE);
        await cache.put(event.request,response.clone());
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
