/* DIVINA BRUXA — WORK12 · FUNDAÇÃO E VERDADE V589
   Service Worker mínimo, atômico e recuperável. A instalação só assume o
   portal quando HTML, aplicação e núcleo WORK12 pertencem à mesma versão.
   Rede primeiro para código; cache apenas como chão seguro, nunca como prisão.
*/

const VERSION = 589;
const CACHE_PREFIX = 'divina-bruxa-';
const CACHE_NAME = 'divina-bruxa-work12-v589-foundation';
const CORE = Object.freeze([
  './index.html',
  './app-v208.js?v=589-work12-foundation',
  './work12-foundation-v589.js?v=589',
  './divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=143'
]);

const sameOrigin = request => new URL(request.url).origin === self.location.origin;
const freshRequest = request => new Request(request, { cache:'no-cache' });
const isCode = url => /\.(?:html?|js|mjs|css|json|webmanifest)$/i.test(url.pathname);

const fetchCore = async path => {
  const response = await fetch(new Request(path, { cache:'no-store' }));
  if (!response?.ok) throw new Error(`work12-core-${response?.status || 'network'}:${path}`);
  return response;
};

const validateCore = async responses => {
  const index = await responses.get('./index.html')?.clone().text();
  const app = await responses.get('./app-v208.js?v=589-work12-foundation')?.clone().text();
  const foundation = await responses.get('./work12-foundation-v589.js?v=589')?.clone().text();
  if (!index?.includes('name="divina-work12" content="V589"')) throw new Error('work12-index-version-mismatch');
  if (!index.includes('app-v208.js?v=589-work12-foundation')) throw new Error('work12-index-app-mismatch');
  if (!app?.includes("./work12-foundation-v589.js?v=589")) throw new Error('work12-app-foundation-mismatch');
  if (!foundation?.includes('WORK12_CONSTITUTION_V589')) throw new Error('work12-foundation-contract-missing');
  return true;
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const responses = new Map();
    for (const path of CORE) responses.set(path, await fetchCore(path));
    await validateCore(responses);
    const cache = await caches.open(CACHE_NAME);
    for (const [path,response] of responses) await cache.put(path,response.clone());
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    for (const client of clients) {
      try {
        client.postMessage({ type:'DIVINA_WORK12_FOUNDATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_RELEASE_READY', version:VERSION });
      } catch {}
    }
  })());
});

const cacheSuccessful = async (cacheKey, response) => {
  if (!response?.ok || response.type === 'opaque') return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(cacheKey,response.clone()).catch(() => {});
  return response;
};

const networkFirst = async (request, fallbackKey = request) => {
  try {
    const response = await fetch(freshRequest(request));
    return cacheSuccessful(fallbackKey,response);
  } catch (error) {
    const cached = await caches.match(fallbackKey);
    if (cached) return cached;
    throw error;
  }
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request)) return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request,'./index.html'));
    return;
  }

  if (isCode(url)) {
    event.respondWith(networkFirst(request,request));
    return;
  }

  // Imagens, fontes e mídia continuam sob o cache HTTP do navegador. O WORK12
  // não ocupa o armazenamento do iPhone com um catálogo visual ilimitado.
  event.respondWith(fetch(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'WORK12_STATUS') {
    event.source?.postMessage?.({
      type:'WORK12_STATUS',
      version:VERSION,
      cache:CACHE_NAME,
      core:[...CORE]
    });
  }
  if (event.data?.type === 'CLEAR_DIVINA_CACHES') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX))
        .map(key => caches.delete(key)));
      event.source?.postMessage?.({ type:'DIVINA_CACHES_CLEARED', version:VERSION });
    })());
  }
});
