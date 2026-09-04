/* DIVINA BRUXA — SERVICE WORKER V24 · ATLAS VISUAL CÓSMICO */
const CACHE='divina-bruxa-v24-atlas-visual';

const REQUIRED=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './app.js',
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
  './tarot-engine.js',
  './tarot-session.js',
  './tarot-data.js',
  './tarot-image-runtime.js',
  './tarot-editorial-policy.js',
  './tarot-livre-official-v1.css',
  './tarot-livre-ios-v1.css',
  './tarot-temple-oficial-v127.jpeg',
  './orb-skin-release-v1.css',
  './orb-skin-release-v1.js',
  './cosmic-visual-atlas-v1.css',
  './cosmic-visual-atlas-v1.js',
  './divina-orb-v68.png',
  './divina-mini-orb-hd-v72.jpeg'
];

const WARM=[
  './app.css','./motion.css','./update-04.css','./update-05.css','./update-06.css','./update-08.css','./update-09.css','./update-11.css',
  './visual-v68.css','./COSMIC-DESIGN-SYSTEM-V10.css',
  './cosmic-design-system-v1.css','./menu-ring-v8.css','./home-orb-only-v1.css','./home-orb-words-v2.css',
  './tarot-table-v5.css','./tarot-ritual-v5.css','./tarot-controls-v5.css','./tarot-editorial-v5.css',
  './spreads-v5.css',
  './card-library-v5.css','./ai-v5.css','./premium-v5.css','./consultation-v5.css','./notification-v5.css','./admin-analytics-v1.css',
  './musica-videos-cosmica-v1.css','./store-v5.css','./school-v5.css','./journal-v5.css','./fallback-shell-v1.css','./pwa-final-v1.css',
  './navigation.js','./orb-engine-v68.js','./mini-orb-engine.js',
  './storage.js','./config.js','./visual-guard-v6.js','./tarot-experience-v6.js','./tarot-continuity.js','./tarot-meanings.js',
  './ritual-engine.js','./daily-policy.js','./daily-meaning-runtime.js','./card-library-engine.js','./card-library-policy.js',
  './school-engine.js','./school-policy.js','./spreads-engine.js','./spreads-policy.js','./spread-synthesis.js','./journal-engine.js','./journal-policy.js',
  './commerce-engine.js','./consultation-engine.js','./consultation-policy.js','./store-engine.js','./store-policy.js','./media-engine-v5.js','./media-policy.js',
  './notification-engine.js','./notification-policy.js','./admin-engine.js','./admin-policy.js','./analytics-engine.js','./analytics-policy.js',
  './privacy-engine.js','./privacy-policy.js','./pwa-engine.js','./trust-engine.js','./trust-policy.js','./auth-client-v6.js','./rhythm-v6.js',
  './ecosystem-v6.js','./performance-v6.js','./ai-engine.js','./ai-policy.js','./ai-credits.js','./premium-engine.js','./premium-policy.js',
  './cosmic-background.png','./carta-dia-santuario-lunar-v1.webp'
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
