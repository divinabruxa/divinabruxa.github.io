/* Divina Bruxa 3.0 · chão offline mínimo, código sempre rede-primeiro. */
const CACHE = 'divina-bruxa-3-shell-20260924-work13-fluidez-menu-4';
const PREFIX = 'divina-bruxa-';
const CORE = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/orbe.webp',
  './orb-engine-v68.js', './living-universe-core-v524.js', './living-universe-core-v524.css', './skins-world-v301.js',
  './divina-orb-thumb-v1.webp', './divina-universe-retina-v523.webp',
  './data/cards.js', './data/config.js', './data/consultations.js', './data/library.js', './data/media.js',
  './data/plans.js', './data/school.js', './data/skins.js', './data/store.js', './data/worlds.js',
  './lib/daily-card.js', './lib/spread-state.js', './lib/tarot-state.js',
  './worlds/account.js', './worlds/consultations.js', './worlds/journal.js', './worlds/library.js',
  './worlds/music.js', './worlds/premium.js', './worlds/school.js',
  './worlds/store.js', './worlds/videos.js', './worlds/whit.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(new Request(request, { cache:'no-store' }));
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
  }
}

async function assetCache(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const code = request.mode === 'navigate' || /\.(?:html?|js|mjs|css|json|webmanifest)$/i.test(url.pathname);
  const onDemandAsset = /\/assets\/(?:cards|skins)\//.test(url.pathname);
  if (code) event.respondWith(networkFirst(request));
  else if (onDemandAsset) event.respondWith(assetCache(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
