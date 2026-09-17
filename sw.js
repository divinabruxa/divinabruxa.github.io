/* DIVINA BRUXA — EMERGENCY NETWORK RECOVERY V588
   Objetivo único: quebrar qualquer cache/service worker antigo que esteja
   prendendo a Home em "Despertando a Divina Bruxa…".
   Temporário e seguro para recuperar o portal. O WORK12 pode reinstalar um
   service worker completo depois que a Home voltar a abrir.
*/

const CACHE_PREFIX = 'divina-bruxa-';
const RECOVERY_CACHE = 'divina-bruxa-v588-recovery';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX))
        .map(key => caches.delete(key)));
    } catch {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== RECOVERY_CACHE)
        .map(key => caches.delete(key)));
    } catch {}
    await self.clients.claim();

    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      try {
        client.postMessage({ type: 'DIVINA_RECOVERY_ACTIVE', version: 588 });
      } catch {}
    }
  })());
});

const networkFresh = async request => {
  const fresh = new Request(request, { cache: 'no-store' });
  return fetch(fresh);
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === 'navigate';
  const isCritical = /\.(?:html?|js|mjs|css|json|webmanifest)$/i.test(url.pathname);

  if (isNavigation || isCritical) {
    event.respondWith((async () => {
      try {
        return await networkFresh(request);
      } catch (error) {
        if (isNavigation) {
          try {
            return await fetch(new Request('./index.html', { cache: 'reload' }));
          } catch {}
        }
        throw error;
      }
    })());
    return;
  }

  // Imagens/fontes continuam normais: não há cache agressivo nesta recuperação.
  event.respondWith(fetch(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_DIVINA_CACHES') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX))
        .map(key => caches.delete(key)));
      event.source?.postMessage?.({ type: 'DIVINA_CACHES_CLEARED', version: 588 });
    })());
  }
});
