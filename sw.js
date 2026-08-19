const CACHE='orbe-viva-7.0-core';
const CORE=['./','./index.html','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 if(/card-\d\d\.jpg$/.test(u.pathname)){
   e.respondWith(caches.open(CACHE).then(async c=>{const m=await c.match(e.request);if(m)return m;try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(err){return m}}));return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp})));
});