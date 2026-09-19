/* DIVINA BRUXA — WORK12 · MACROETAPA 5 · MENU LENDÁRIO V593
   Service Worker mínimo, atômico e recuperável. A instalação só assume o
   portal quando HTML, aplicação, intenções, navegação, universo e Orbe pertencem ao corte.
   Rede primeiro para código; cache apenas como chão seguro, nunca como prisão.
*/

const VERSION = 593;
const CACHE_PREFIX = 'divina-bruxa-';
const CACHE_NAME = 'divina-bruxa-work12-v593-menu';
const CORE = Object.freeze([
  './index.html',
  './app-v208.js?v=593-work12-menu',
  './orbital-menu-v502.js?v=593-work12-menu',
  './orbital-menu-v502.css?v=593-work12-menu',
  './navigation.js?v=592-work12-navigation',
  './work12-foundation-v589.js?v=592-work12-navigation',
  './page-loader-v1.js?v=592-work12-navigation',
  './living-universe-core-v524.js?v=590-work12-universe',
  './supreme-orb-core-v501.js?v=591-work12-orb',
  './orb-engine-v208.js?v=591-work12-orb',
  './orb-persistent-journey-v565.js?v=583-coordinate-travel',
  './whit-orb-soul-bridge-v581.js?v=592-work12-navigation',
  './divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
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
  const app = await responses.get('./app-v208.js?v=593-work12-menu')?.clone().text();
  const menu = await responses.get('./orbital-menu-v502.js?v=593-work12-menu')?.clone().text();
  const menuStyles = await responses.get('./orbital-menu-v502.css?v=593-work12-menu')?.clone().text();
  const navigation = await responses.get('./navigation.js?v=592-work12-navigation')?.clone().text();
  const foundation = await responses.get('./work12-foundation-v589.js?v=592-work12-navigation')?.clone().text();
  const pageLoader = await responses.get('./page-loader-v1.js?v=592-work12-navigation')?.clone().text();
  const universe = await responses.get('./living-universe-core-v524.js?v=590-work12-universe')?.clone().text();
  const orb = await responses.get('./supreme-orb-core-v501.js?v=591-work12-orb')?.clone().text();
  const renderer = await responses.get('./orb-engine-v208.js?v=591-work12-orb')?.clone().text();
  const journey = await responses.get('./orb-persistent-journey-v565.js?v=583-coordinate-travel')?.clone().text();
  const soul = await responses.get('./whit-orb-soul-bridge-v581.js?v=592-work12-navigation')?.clone().text();
  if (!index?.includes('name="divina-work12" content="V593"')) throw new Error('work12-index-version-mismatch');
  if (!index.includes('app-v208.js?v=593-work12-menu')) throw new Error('work12-index-app-mismatch');
  if (!app?.includes("./navigation.js?v=592-work12-navigation")) throw new Error('work12-app-router-mismatch');
  if (!app.includes("./work12-foundation-v589.js?v=592-work12-navigation")) throw new Error('work12-app-foundation-mismatch');
  if (!app.includes("./living-universe-core-v524.js?v=590-work12-universe")) throw new Error('work12-app-universe-mismatch');
  if (!app.includes("./supreme-orb-core-v501.js?v=591-work12-orb") || !app.includes('divinaWork12Macro3V591')) {
    throw new Error('work12-app-orb-mismatch');
  }
  if (!app.includes('divinaWork12Macro4V592')) throw new Error('work12-app-navigation-mismatch');
  if (!app.includes('divinaWork12Macro5V593') || !app.includes("orbital-menu-v502.js?v=593-work12-menu")) {
    throw new Error('work12-app-menu-mismatch');
  }
  if (!menu?.includes('const VERSION = 593;') || !menu.includes('maximumVisibleIntentions:2') || !menu.includes('progressiveReveal:true')) {
    throw new Error('work12-menu-contract-missing');
  }
  if (!menuStyles?.includes('db593IntentionBreath') || !menuStyles.includes('.db502-menu.has-intentions .db502-portal.is-offered')) {
    throw new Error('work12-menu-styles-contract-missing');
  }
  if (!navigation?.includes('const WORK12_HISTORY_RELEASE = 592;') || !navigation.includes("source:'history'")) {
    throw new Error('work12-router-contract-missing');
  }
  if (!foundation?.includes('WORK12_CONSTITUTION_V592') || !foundation.includes("navigationAuthority:this.orbNavigateProxy ? 'work12-v592'")) {
    throw new Error('work12-foundation-contract-missing');
  }
  if (!pageLoader?.includes('globalThis.divinaWork12V592') || !pageLoader.includes("source:'route-retry'")) {
    throw new Error('work12-page-loader-contract-missing');
  }
  if (!universe?.includes('const RELEASE = 590;') || !universe.includes('essentialUniverseDuringTravel:true')) {
    throw new Error('work12-universe-contract-missing');
  }
  if (!orb?.includes('const WORK12_RELEASE = 591;') || !orb.includes('auditPersistence(reason')) {
    throw new Error('work12-orb-identity-contract-missing');
  }
  if (!renderer?.includes('const ORB_RENDERER_RELEASE = 591;') || !renderer.includes('sharedMotionClock:true')) {
    throw new Error('work12-orb-renderer-contract-missing');
  }
  if (!journey?.includes('travelerCopies:0') || !journey.includes('physicalOrbTransport:true')) {
    throw new Error('work12-orb-journey-contract-missing');
  }
  if (!soul?.includes('const VERSION = 591;') || !soul.includes("'divina:work12-state'") || !soul.includes("591|592")) {
    throw new Error('work12-orb-soul-contract-missing');
  }
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
        client.postMessage({ type:'DIVINA_WORK12_NAVIGATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_UNIVERSE_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_ORB_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_MENU_ACTIVE', version:VERSION });
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
