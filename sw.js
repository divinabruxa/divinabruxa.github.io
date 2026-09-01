const CACHE='divina-bruxa-v9-fallback-shell-1';
const CORE=['./','./index.html','./offline.html','./manifest.webmanifest','./app.css','./fallback-shell-v1.css','./app.js','./divina-orb-v68.png','./cosmic-background.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const requestURL=new URL(event.request.url);
  const isNavigation=event.request.mode==='navigate' || event.request.destination==='document';
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok && requestURL.origin===self.location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached || (isNavigation ? caches.match('./offline.html') : caches.match('./index.html')))));
});
