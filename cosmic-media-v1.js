/* DIVINA BRUXA — MÍDIA CÓSMICA RESPONSIVA V1.1
   Base para artes de página: só materializa imagens do mundo visitado. */

const hydrated = new WeakSet();

function reveal(media, image) {
  const ready = () => {
    const decoded = typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
    decoded.then(() => {
      media.dataset.cosmicState = 'ready';
      media.classList.add('is-cosmic-ready');
    });
  };
  if (image.complete && image.naturalWidth) ready();
  else {
    image.addEventListener('load', ready, { once: true });
    image.addEventListener('error', () => {
      media.dataset.cosmicState = 'error';
    }, { once: true });
  }
}

function hydrateImage(media) {
  if (hydrated.has(media)) return;
  const image = media.matches('img') ? media : media.querySelector('img');
  if (!image) return;
  hydrated.add(media);
  media.dataset.cosmicState = 'loading';

  media.querySelectorAll('source[data-cosmic-srcset]').forEach(source => {
    source.srcset = source.dataset.cosmicSrcset;
    delete source.dataset.cosmicSrcset;
  });
  if (image.dataset.cosmicSizes) image.sizes = image.dataset.cosmicSizes;
  if (image.dataset.cosmicSrcset) image.srcset = image.dataset.cosmicSrcset;
  image.decoding = 'async';
  image.loading = media.dataset.cosmicPriority === 'hero' ? 'eager' : 'lazy';
  if ('fetchPriority' in image) image.fetchPriority = media.dataset.cosmicPriority === 'hero' ? 'high' : 'auto';
  reveal(media, image);
  if (image.dataset.cosmicSrc) image.src = image.dataset.cosmicSrc;
}

function hydrateBackground(media) {
  if (hydrated.has(media) || !media.dataset.cosmicBg) return;
  hydrated.add(media);
  media.dataset.cosmicState = 'loading';
  const image = new Image();
  image.decoding = 'async';
  if ('fetchPriority' in image) image.fetchPriority = media.dataset.cosmicPriority === 'hero' ? 'high' : 'auto';
  image.onload = async () => {
    try { await image.decode?.(); } catch { /* onload já confirmou a arte */ }
    media.style.setProperty('--db-cosmic-media', `url("${image.src}")`);
    media.dataset.cosmicState = 'ready';
    media.classList.add('is-cosmic-ready');
  };
  image.onerror = () => { media.dataset.cosmicState = 'error'; };
  image.src = media.dataset.cosmicBg;
}

function scanScreen(screen) {
  if (!screen) return;
  const media = [
    ...(screen.matches?.('[data-cosmic-media]') ? [screen] : []),
    ...screen.querySelectorAll('[data-cosmic-media]')
  ];
  media.forEach(item => {
    if (item.dataset.cosmicBg) hydrateBackground(item);
    else hydrateImage(item);
  });
}

export function installCosmicMedia() {
  const scanActive = () => scanScreen(document.querySelector('#app > .screen.active'));
  const observer = new MutationObserver(scanActive);
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });
  document.addEventListener('divina:page-ready', event => {
    scanScreen(document.getElementById(event.detail?.id));
  });
  scanActive();
  // O marcador do motor não pode reutilizar `data-cosmic-media`, reservado
  // exclusivamente aos elementos visuais. Isso mantém cartas e skins visíveis.
  delete document.documentElement.dataset.cosmicMedia;
  document.documentElement.dataset.cosmicMediaRuntime = 'v1.1';
  return { scan: scanActive, destroy: () => observer.disconnect() };
}
