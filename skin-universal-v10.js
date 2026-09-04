/* DIVINA BRUXA — CONTRATO UNIVERSAL DE SKINS V11
   Pré-decodifica a textura escolhida e mantém uma memória curta para proteger o iPhone. */

const ASSET_CACHE_LIMIT = 4;
const assetCache = new Map();

function absoluteSkinUrl(source) {
  try { return new URL(source, document.baseURI).href; }
  catch { return source; }
}

function pruneAssetCache(protectedKey = '') {
  if (assetCache.size <= ASSET_CACHE_LIMIT) return;
  for (const [candidate, entry] of assetCache) {
    if (assetCache.size <= ASSET_CACHE_LIMIT) break;
    if (candidate === protectedKey || entry.status === 'loading') continue;
    entry.image?.removeAttribute?.('src');
    assetCache.delete(candidate);
  }
}

function rememberAsset(key, entry) {
  assetCache.delete(key);
  assetCache.set(key, entry);
  pruneAssetCache(key);
}

export function preloadSkinAsset(source, { priority = 'auto' } = {}) {
  if (!source || typeof Image === 'undefined') return Promise.reject(new Error('Imagem de skin indisponível.'));
  const key = absoluteSkinUrl(source);
  const cached = assetCache.get(key);
  if (cached) {
    rememberAsset(key, cached);
    return cached.promise;
  }

  const image = new Image();
  image.decoding = 'async';
  if ('fetchPriority' in image) image.fetchPriority = priority;

  let entry = null;
  const promise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Não foi possível preparar ${source}.`));
    image.src = key;
    if (image.complete && image.naturalWidth) resolve(image);
  }).then(async loaded => {
    try { await loaded.decode?.(); } catch { /* onload já confirmou a textura */ }
    loaded.onload = null;
    loaded.onerror = null;
    if (entry) {
      entry.status = 'ready';
      rememberAsset(key, entry);
    }
    return loaded;
  }).catch(error => {
    if (assetCache.get(key)?.image === image) assetCache.delete(key);
    throw error;
  });

  entry = { image, promise, status: 'loading' };
  rememberAsset(key, entry);
  return promise;
}

export function preparedSkinImage(source) {
  const entry = assetCache.get(absoluteSkinUrl(source));
  return entry?.image?.complete && entry.image.naturalWidth ? entry.image : null;
}

export function applySkinContract({ id, registry, root = document } = {}) {
  if (!id || !registry) return false;
  const skin = (registry.skins || []).find(item => item.id === id) || registry.fallbackSkin;
  if (!skin) return false;

  const html = root.documentElement;
  html.dataset.skin = skin.id;
  for (const [key, value] of Object.entries(skin.tokens || {})) {
    html.style.setProperty(`--db-skin-${key}`, value);
  }

  const primarySource = skin.surfaces?.home || skin.image;
  if (primarySource) {
    html.style.setProperty('--db-skin-image', `url("${primarySource}")`);
    html.style.setProperty('--db-skin-id', `"${skin.id}"`);
  }

  for (const orb of root.querySelectorAll('[data-orb-surface]')) {
    const surface = orb.dataset.orbSurface;
    const source = skin.surfaces?.[surface] || primarySource;
    if (!source) continue;

    if ('src' in orb) {
      const target = absoluteSkinUrl(source);
      if (orb.src !== target) orb.src = source;
    } else {
      const cssImage = `url("${source}")`;
      if (orb.style.backgroundImage !== cssImage) orb.style.backgroundImage = cssImage;
    }
    orb.dataset.skin = skin.id;
  }

  root.dispatchEvent(new CustomEvent('divina:skin-applied', {
    detail: { id: skin.id, source: primarySource }
  }));
  return true;
}

export function readStoredSkin(storage = localStorage, key = 'divina.skin.v10') {
  try { return storage.getItem(key) || null; } catch { return null; }
}
