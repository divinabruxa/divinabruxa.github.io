/* DIVINA BRUXA — SERVICE WORKER V200 · VERDADE COMERCIAL ÚNICA */
const VERSION = 200;
const OWNED_PREFIX = 'divina-bruxa-';
const SHELL_CACHE = 'divina-bruxa-v200-shell';
const CONTENT_CACHE = 'divina-bruxa-v200-content';
const IMAGE_CACHE = 'divina-bruxa-v200-images';
const TAROT_CACHE = 'divina-bruxa-v200-tarot-offline';
const ACTIVE_CACHES = new Set([SHELL_CACHE, CONTENT_CACHE, IMAGE_CACHE, TAROT_CACHE]);

const REQUIRED_SHELL = Object.freeze([
  './',
  './index.html',
  './offline.html',
  './offline-en.html',
  './offline-es.html',
  './manifest.webmanifest',
  './pwa-world-v196.css',
  './pwa-world-v200.js',
  './performance-world-v196.js',
  './privacy-center-v9.js',
  './fallback-shell-v1.css',
  './divina-shell-v180.css',
  './home-orb-absolute-v199.css',
  './divina-orb-fast-v1.webp',
  './divina-orb-thumb-v1.webp',
  './divina-icon-fast-v1.png',
  './icon-192.png'
]);

const WARM_SHELL = Object.freeze([
  './app-v200.js',
  './navigation.js',
  './route-registry-v180.js',
  './page-loader-v1.js',
  './orb-loading-portal-v1.js',
  './runtime-v12.js',
  './orb-engine-v68.js',
  './mini-orb-engine.js',
  './menu-completo-v177.js',
  './visual-guard-v6.js',
  './tarot-experience-v6.js',
  './cosmic-media-v1.js',
  './portal-transition-v10.js',
  './skin-registry-v12.js',
  './skin-universal-v10.js',
  './skin-catalog-v6.js',
  './skins-v191.js',
  './premium-policy-v191.js',
  './ai-policy.js',
  './config.js',
  './config-v200.js',
  './commercial-truth-v200.js',
  './consultation-policy.js',
  './seo-index-policy-v193.js',
  './editorial-catalog-v192.js',
  './editorial-metrics-v192.js',
  './editorial-journey-v192.js',
  './media-engine-v192.js',
  './media-policy-v192.js',
  './media-engine-v149.js',
  './media-policy-v149.js',
  './store-engine.js',
  './store-policy.js',
  './auth-client-v6.js',
  './auth-client-v189.js',
  './account-engine-v189.js',
  './international-v195.css',
  './international-home-v195.js',
  './international-tarot-v195.js',
  './international-library-v195.js',
  './international-card-image-v196.js',
  './international-consultations-v195.js',
  './divina-core-v179.css',
  './biblioteca-universal-v184.css',
  './tiragens-definitivas-v185.css',
  './escola-definitiva-v186.css',
  './diario-definitivo-v187.css',
  './consultations-definitive-v188.css',
  './account-secure-v189.css',
  './orbe-ai-governada-v190.css',
  './premium-billing-v191.css',
  './editorial-universe-v192.css',
  './store-celestial-v1.css',
  './media-celestial-v149.css',
  './loja-mistica-celestial-v1.webp',
  './midia-celestial-estudio-v1.webp',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png'
]);

const PUBLIC_OFFLINE_PAGES = Object.freeze([
  './acessibilidade.html',
  './english.html', './espanol.html',
  './tarot-livre.html', './free-tarot-reading.html', './tarot-libre.html',
  './cartas-do-tarot.html', './tarot-card-meanings.html', './significados-cartas-tarot.html',
  './escola-do-tarot.html', './tarot-school.html', './escuela-tarot.html',
  './consultas-de-tarot.html', './tarot-consultations.html', './consultas-tarot.html',
  './etica-e-responsabilidade.html', './tarot-ethics.html', './etica-tarot.html',
  './contato.html', './contact.html', './contacto.html',
  './instalar-app.html', './install-app.html', './instalar-aplicacion.html'
  ,'./loja-mistica.html', './musica.html', './de-frente-com-o-tarot.html'
]);

const OFFLINE_TAROT_ASSETS = Object.freeze([
  './tarot-data.js',
  './storage.js',
  './tarot-engine.js',
  './tarot-image-runtime.js',
  './international-card-image-v196.js',
  './tarot-session.js',
  './tarot-continuity.js',
  './tarot-editorial-policy.js',
  './tarot-experience-v6.js',
  './tarot-spiral-suction-v1.webp',
  './tarot-atlas-mobile-v196.webp',
  './ritual-engine.js',
  './daily-policy.js',
  './daily-meaning-runtime.js',
  './tarot-meanings.js',
  './meaning-engine.js',
  './journal-engine.js',
  './journal-policy.js',
  './rhythm-v6.js',
  './diario-definitivo-v187.css',
  './school-engine.js',
  './school-policy.js',
  './escola-definitiva-v186.css',
  './card-library-policy.js',
  './card-library-engine.js',
  './biblioteca-universal-v184.css',
  './biblioteca-universal-v184.js'
]);

const ENGLISH_PATHS = new Set(['english.html', 'free-tarot-reading.html', 'tarot-card-meanings.html', 'tarot-school.html', 'tarot-consultations.html', 'tarot-ethics.html', 'contact.html', 'install-app.html']);
const SPANISH_PATHS = new Set(['espanol.html', 'tarot-libre.html', 'significados-cartas-tarot.html', 'escuela-tarot.html', 'consultas-tarot.html', 'etica-tarot.html', 'contacto.html', 'instalar-aplicacion.html']);

const absoluteRequest = asset => new Request(new URL(asset, self.registration.scope), {
  credentials: 'same-origin',
  cache: 'reload'
});

const canCache = response => {
  if (!response || !response.ok || response.type === 'opaque') return false;
  if (response.headers.get('content-length') === '0') return false;
  const control = response.headers.get('cache-control') || '';
  if (/\b(?:no-store|private)\b/i.test(control)) return false;
  if (response.headers.has('set-cookie')) return false;
  return true;
};

const cacheAsset = async (cacheName, asset) => {
  const request = absoluteRequest(asset);
  const response = await fetch(request);
  if (!canCache(response)) throw new Error(`Invalid cache asset: ${asset}`);
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return asset;
};

const cacheBatch = async (cacheName, assets, concurrency = 5) => {
  const queue = [...new Set(assets)];
  const failures = [];
  const workers = Array.from({ length: Math.min(concurrency, queue.length || 1) }, async () => {
    while (queue.length) {
      const asset = queue.shift();
      try { await cacheAsset(cacheName, asset); }
      catch (error) { failures.push({ asset, message: error?.message || 'cache-failed' }); }
    }
  });
  await Promise.all(workers);
  return failures;
};

const prepareOfflineTarot = async () => {
  const failures = await cacheBatch(TAROT_CACHE, OFFLINE_TAROT_ASSETS, 4);
  const cache = await caches.open(TAROT_CACHE);
  let atlas = await cache.match(absoluteRequest('./tarot-atlas-mobile-v196.webp'), { ignoreSearch: true });
  if (!atlas) {
    try {
      await cacheAsset(TAROT_CACHE, './tarot-atlas.webp');
      atlas = await cache.match(absoluteRequest('./tarot-atlas.webp'), { ignoreSearch: true });
    } catch (error) {
      failures.push({ asset: './tarot-atlas.webp', message: error?.message || 'atlas-failed' });
    }
  }
  if (atlas) await cache.put(absoluteRequest('./tarot-atlas.webp'), atlas.clone());
  const required = OFFLINE_TAROT_ASSETS.filter(asset => !asset.endsWith('tarot-atlas-mobile-v196.webp'));
  let ready = 0;
  for (const asset of required) {
    if (await cache.match(absoluteRequest(asset), { ignoreSearch: true })) ready += 1;
  }
  const aliasReady = Boolean(await cache.match(absoluteRequest('./tarot-atlas.webp'), { ignoreSearch: true }));
  return {
    type: 'OFFLINE_TAROT_STATUS',
    version: VERSION,
    ready: ready + Number(aliasReady),
    total: required.length + 1,
    complete: ready === required.length && aliasReady,
    failures
  };
};

const offlineStatus = async () => {
  const cache = await caches.open(TAROT_CACHE);
  const required = OFFLINE_TAROT_ASSETS.filter(asset => !asset.endsWith('tarot-atlas-mobile-v196.webp'));
  let ready = 0;
  for (const asset of required) {
    if (await cache.match(absoluteRequest(asset), { ignoreSearch: true })) ready += 1;
  }
  const aliasReady = Boolean(await cache.match(absoluteRequest('./tarot-atlas.webp'), { ignoreSearch: true }));
  return {
    type: 'OFFLINE_TAROT_STATUS',
    version: VERSION,
    ready: ready + Number(aliasReady),
    total: required.length + 1,
    complete: ready === required.length && aliasReady
  };
};

self.addEventListener('install', event => event.waitUntil((async () => {
  const requiredFailures = await cacheBatch(SHELL_CACHE, REQUIRED_SHELL, 5);
  if (requiredFailures.length) throw new Error(`Required shell incomplete: ${requiredFailures.map(item => item.asset).join(', ')}`);
  await Promise.allSettled([
    cacheBatch(CONTENT_CACHE, [...WARM_SHELL, ...PUBLIC_OFFLINE_PAGES], 5),
    prepareOfflineTarot()
  ]);
  await self.skipWaiting();
})()));

self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys
    .filter(key => key.startsWith(OWNED_PREFIX) && !ACTIVE_CACHES.has(key))
    .map(key => caches.delete(key)));
  await self.clients.claim();
})()));

const matchCurrentOrPrevious = async request => {
  for (const cacheName of [TAROT_CACHE, SHELL_CACHE, CONTENT_CACHE, IMAGE_CACHE]) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request, { ignoreSearch: true });
    if (response) return response;
  }
  return null;
};

const cacheResponse = async (cacheName, request, response) => {
  if (!canCache(response)) return false;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return true;
};

const fetchWithTimeout = async (request, timeout = 4500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await fetch(request, { signal: controller.signal }); }
  finally { clearTimeout(timer); }
};

const appShellIsValid = async (url, response) => {
  const pathname = url.pathname.replace(/\/+$/, '/');
  const isAppShell = pathname === new URL('./', self.registration.scope).pathname || pathname.endsWith('/index.html');
  if (!isAppShell) return true;
  const html = await response.clone().text();
  return html.length > 1024
    && /id=["']app["']/.test(html)
    && /id=["']home["']/.test(html)
    && /app-v200\.js\?v=200/.test(html)
    && /home-orb-absolute-v199\.css\?v=199/.test(html);
};

const offlinePageFor = async url => {
  const name = url.pathname.split('/').pop() || '';
  const fallback = ENGLISH_PATHS.has(name) ? './offline-en.html' : SPANISH_PATHS.has(name) ? './offline-es.html' : './offline.html';
  return matchCurrentOrPrevious(absoluteRequest(fallback));
};

const navigationNetworkFirst = async (request, url) => {
  try {
    const response = await fetchWithTimeout(request);
    if (canCache(response) && await appShellIsValid(url, response)) {
      await cacheResponse(CONTENT_CACHE, request, response);
      return response;
    }
    const cached = await matchCurrentOrPrevious(request);
    if (cached) return cached;
  } catch {
    const cached = await matchCurrentOrPrevious(request);
    if (cached) return cached;
  }
  return (await offlinePageFor(url)) || new Response('Divina Bruxa is reconnecting.', {
    status: 503,
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
};

const prune = async (cacheName, maximum, predicate = () => true) => {
  const cache = await caches.open(cacheName);
  const keys = (await cache.keys()).filter(predicate);
  const overflow = keys.length - maximum;
  if (overflow <= 0) return;
  await Promise.all(keys.slice(0, overflow).map(key => cache.delete(key)));
};

const cacheFirst = async (request, cacheName, maximum, predicate) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.headers.get('content-length') === '0') return new Response('', { status: 503, statusText: 'Empty asset rejected' });
    if (await cacheResponse(cacheName, request, response)) await prune(cacheName, maximum, predicate);
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
};

const staleWhileRevalidate = async (event, request) => {
  const cached = await matchCurrentOrPrevious(request);
  const update = fetch(request).then(async response => {
    await cacheResponse(CONTENT_CACHE, request, response);
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  try { return await update; }
  catch { return new Response('', { status: 503, statusText: 'Offline' }); }
};

const networkFirst = async request => {
  try {
    const response = await fetch(request);
    await cacheResponse(CONTENT_CACHE, request, response);
    return response;
  } catch {
    return (await matchCurrentOrPrevious(request)) || new Response('', { status: 503, statusText: 'Offline' });
  }
};

const isAuthorityRequest = (request, url) => {
  if (request.headers.has('authorization')) return true;
  if (request.cache === 'no-store') return true;
  if (url.origin !== self.location.origin) return true;
  const path = url.pathname.toLowerCase();
  if (/\/(?:auth|rest|functions|storage)\/v\d+\//.test(path)) return true;
  return /\/(?:api\/)?(?:ai|auth|account|admin|entitlements|billing|payments|checkout|consultations)(?:\/|$)/.test(path);
};

const authorityNetworkOnly = request => fetch(request).catch(() => {
  const json = request.headers.get('accept')?.includes('application/json');
  return new Response(json ? JSON.stringify({ error: 'secure_connection_required' }) : '', {
    status: 503,
    statusText: 'Secure connection required',
    headers: json ? { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } : { 'cache-control': 'no-store' }
  });
});

const isTarotAsset = url => /\/(?:tarot-(?:data|engine|image-runtime|session|continuity|editorial-policy|experience|spiral-suction|atlas)|card-\d{2})[^/]*\.(?:js|webp)$/.test(url.pathname)
  || url.pathname.endsWith('/international-card-image-v196.js');

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (isAuthorityRequest(request, url)) {
    if (url.origin === self.location.origin) event.respondWith(authorityNetworkOnly(request));
    return;
  }
  if (url.origin !== self.location.origin) return;

  const navigation = request.mode === 'navigate' || request.destination === 'document';
  if (navigation) {
    event.respondWith(navigationNetworkFirst(request, url));
    return;
  }
  if (isTarotAsset(url)) {
    const isCard = /\/card-\d{2}[^/]*\.webp$/.test(url.pathname);
    event.respondWith(cacheFirst(request, TAROT_CACHE, 78, key => /\/card-\d{2}[^/]*\.webp$/.test(new URL(key.url).pathname) || !isCard));
    return;
  }
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 96, () => true));
    return;
  }
  if (['script', 'style', 'font', 'manifest', 'worker'].includes(request.destination) || /\.(?:js|css|webmanifest|json)$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});

self.addEventListener('message', event => {
  const respond = value => event.ports?.[0]?.postMessage(value);
  if (event.data?.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type === 'GET_OFFLINE_STATUS') {
    event.waitUntil(offlineStatus().then(respond).catch(error => respond({ type: 'OFFLINE_TAROT_STATUS', complete: false, error: error?.message || 'status-failed' })));
    return;
  }
  if (event.data?.type === 'PREPARE_OFFLINE_TAROT') {
    event.waitUntil(prepareOfflineTarot().then(respond).catch(error => respond({ type: 'OFFLINE_TAROT_STATUS', complete: false, error: error?.message || 'prepare-failed' })));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const raw = String(event.notification?.data?.url || '#home');
  const target = /^#(?:home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(raw) ? raw : '#home';
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const current = windows.find(client => new URL(client.url).origin === self.location.origin);
    if (current) {
      await current.focus();
      current.postMessage({ type: 'divina-notification-open', target });
      return;
    }
    await self.clients.openWindow(`./${target}`);
  })());
});
