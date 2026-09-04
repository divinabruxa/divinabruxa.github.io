/* DIVINA BRUXA — ATLAS VISUAL CÓSMICO V1
   Carrega cada mundo somente quando ele será visitado e revela a arte após a decodificação. */

const ATLAS = Object.freeze({
  daily: Object.freeze({
    realm: 'moon',
    image: 'carta-dia-santuario-lunar-v1.webp'
  })
});

const assets = new Map();
let activeDestination = '';

function loadAsset(source, priority = 'auto') {
  const absolute = new URL(source, document.baseURI).href;
  const cached = assets.get(absolute);
  if (cached) {
    if (priority === 'high' && 'fetchPriority' in cached.image) cached.image.fetchPriority = 'high';
    return cached.promise;
  }

  const image = new Image();
  image.decoding = 'async';
  if ('fetchPriority' in image) image.fetchPriority = priority;

  const promise = new Promise((resolve, reject) => {
    let settled = false;
    const ready = () => {
      if (settled) return;
      settled = true;
      const decoded = typeof image.decode === 'function'
        ? image.decode().catch(() => {})
        : Promise.resolve();
      decoded.then(() => resolve(absolute));
    };
    image.onload = ready;
    image.onerror = () => {
      if (settled) return;
      settled = true;
      assets.delete(absolute);
      reject(new Error(`Atlas indisponível: ${source}`));
    };
    image.src = absolute;
    if (image.complete && image.naturalWidth) ready();
  });

  assets.set(absolute, { image, promise });
  return promise;
}

function prepare(destination, { priority = 'auto' } = {}) {
  const entry = ATLAS[destination];
  const screen = entry ? document.getElementById(destination) : null;
  if (!entry || !screen || screen.dataset.dbRealm !== entry.realm) return Promise.resolve(false);
  if (screen.dataset.dbAtlas === 'ready') return Promise.resolve(true);

  screen.dataset.dbAtlas = 'loading';
  return loadAsset(entry.image, priority).then(source => {
    screen.style.setProperty('--db-atlas-image', `url("${source}")`);
    screen.dataset.dbAtlas = 'ready';
    return true;
  }).catch(() => {
    delete screen.dataset.dbAtlas;
    if (activeDestination === destination) activeDestination = '';
    return false;
  });
}

function revealActiveWorld() {
  const screen = document.querySelector('#app > .screen.active');
  const destination = screen?.id || '';
  if (!ATLAS[destination] || destination === activeDestination) return;
  activeDestination = destination;
  prepare(destination, { priority: 'high' });
}

function primeFromIntent(event) {
  const destination = event.target.closest?.('[data-go]')?.dataset.go;
  if (!ATLAS[destination]) return;
  prepare(destination, { priority: event.type === 'click' || event.type === 'touchstart' ? 'high' : 'auto' });
}

Object.keys(ATLAS).forEach(destination => {
  const screen = document.getElementById(destination);
  if (!screen) return;
  new MutationObserver(revealActiveWorld).observe(screen, {
    attributes: true,
    attributeFilter: ['class']
  });
});

document.addEventListener('pointerover', primeFromIntent, { capture: true, passive: true });
document.addEventListener('touchstart', primeFromIntent, { capture: true, passive: true });
document.addEventListener('focusin', primeFromIntent, true);
document.addEventListener('click', primeFromIntent, true);
window.addEventListener('hashchange', revealActiveWorld);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) revealActiveWorld();
});

revealActiveWorld();

const warmDaily = () => prepare('daily', { priority: 'low' });
if ('requestIdleCallback' in window) window.requestIdleCallback(warmDaily, { timeout: 4200 });
else window.setTimeout(warmDaily, 2400);
