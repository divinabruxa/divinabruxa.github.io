self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  try{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)))}catch(e){}
  try{await self.registration.unregister()}catch(e){}
  try{const list=await self.clients.matchAll({type:"window"});for(const c of list)c.navigate(c.url)}catch(e){}
})()));