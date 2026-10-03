/* Divina Bruxa 4.2.1 · Lançamento público. */
const CACHE = 'divina-bruxa-3-shell-20261003-acessibilidade-2';
const PREFIX = 'divina-bruxa-';
const CORE = [
  './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/orbe.webp',
  './orb-engine-v68.js', './living-universe-core-v524.js', './living-universe-core-v524.css', './skins-world-v301.js',
  './divina-orb-thumb-v1.webp', './divina-universe-retina-v523.webp', './arbitrio-engine-v360.js',
  './love-engine-v370.js', './arbitrio-engine-v370.js', './mind-engine-v380.js', './spirit-engine-v390.js', './matter-engine-v400.js', './tarot-story-engine-v402.js', './tarot-soul-engine-v403.js', './tarot-life-engine-v404.js', './tarot-orbe-realities-engine-v405.js', './whit-tarot-reader-engine-v406.js', './whit-superior-tarot-engine-v407.js', './whit-tarot-knowledge-v410.js', './whit-tarot-position-engine-v411.js', './whit-tarot-dialogue-engine-v412.js', './whit-tarot-human-reality-v413.js', './whit-tarot-narrative-consciousness-v414.js', './whit-tarot-soul-voice-v415.js', './whit-tarot-living-depth-v416.js', './whit-tarot-supreme-counsel-v417.js', './whit-tarot-proving-ground-v418.js', './whit-tarot-soul-consultation-v419.js', './whit-divine-soul-engine-v408.js', './whit-world-v401.js',
  './data/cards.js', './data/config.js', './data/consultations.js', './data/library.js', './data/media.js',
  './data/plans.js', './school-data-v322.js', './data/skins.js', './data/store.js', './data/worlds.js',
  './routes.js', './lib/daily-card.js', './lib/tarot-state.js', './premium-entitlement-v310.js', './spread-state-v310.js',
  './worlds/account.js', './worlds/consultations.js', './worlds/journal.js', './worlds/library.js',
  './worlds/music.js', './premium-world-v310.js', './school-world-v322.js',
  './worlds/store.js', './videos-world-v311.js'
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
