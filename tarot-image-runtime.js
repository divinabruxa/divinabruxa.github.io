/* DIVINA BRUXA V148 — RUNTIME DE IMAGENS DO TAROT LIVRE
   Prévia instantânea pelo atlas, arte integral progressiva e fallback offline.
*/
import { CARDS } from './tarot-data.js';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const CARD_ASSET_VERSION = '148';
const imageTasks = new Map();

const escapeAttribute = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const versionedSource = source => `${source}${source.includes('?') ? '&' : '?'}v=${CARD_ASSET_VERSION}`;

export function cardAtlasStyle(card) {
  if (!card || !Number.isInteger(card.atlasIndex)) return '';
  const column = card.atlasIndex % 10;
  const row = Math.floor(card.atlasIndex / 10);
  const x = (column / 9) * 100;
  const y = (row / 7) * 100;
  return `background-image:url(&quot;${escapeAttribute(versionedSource(card.imageSources.atlasFallback))}&quot;);background-size:1000% 800%;background-position:${x}% ${y}%;background-repeat:no-repeat`;
}

export function cardImageMarkup(card, { alt = card?.name || '', priority = 'lazy', decorative = false } = {}) {
  if (!card || !Number.isInteger(card.index)) return '';
  const eager = priority === 'high';
  return `<img class="tarot-card-image tarot-image-progressive" src="${escapeAttribute(versionedSource(card.imageSources.medium))}" data-card-index="${card.index}" data-image-state="loading" width="1024" height="1536" sizes="(max-width: 640px) 46vw, (max-width: 1100px) 18vw, 300px" loading="${eager ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${eager ? 'high' : 'low'}" style="${cardAtlasStyle(card)}" alt="${decorative ? '' : escapeAttribute(alt)}">`;
}

export function prepareCardImage(cardOrId, { timeout = 1800, priority = 'high' } = {}) {
  const card = Number.isInteger(cardOrId) ? CARDS[cardOrId] : cardOrId;
  if (!card || typeof Image === 'undefined') return Promise.resolve('atlas');
  const source = versionedSource(card.imageSources.medium);
  if (imageTasks.has(source)) return imageTasks.get(source);

  const task = new Promise(resolve => {
    const image = new Image();
    let settled = false;
    const finish = state => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(state);
    };
    const timer = setTimeout(() => finish('atlas'), Math.max(120, timeout));
    image.decoding = 'async';
    if ('fetchPriority' in image) image.fetchPriority = priority;
    image.addEventListener('load', async () => {
      try { await image.decode?.(); } catch { /* A imagem carregada continua utilizável. */ }
      finish(image.naturalWidth > 0 ? 'ready' : 'atlas');
    }, { once: true });
    image.addEventListener('error', () => finish('atlas'), { once: true });
    image.src = source;
    if (image.complete) finish(image.naturalWidth > 0 ? 'ready' : 'atlas');
  }).then(state => {
    if (state === 'atlas') imageTasks.delete(source);
    return state;
  });
  imageTasks.set(source, task);
  return task;
}

export function preloadCardImages(cardIds, limit = 3) {
  [...new Set(cardIds)]
    .slice(0, Math.max(0, Math.min(limit, 3)))
    .forEach(id => prepareCardImage(id, { timeout: 2200, priority: 'low' }));
}

function showAtlasFallback(image, index) {
  if (image.dataset.fallbackApplied === 'true') return;
  const card = CARDS[index];
  if (!card) return;
  image.dataset.fallbackApplied = 'true';
  image.dataset.imageState = 'atlas';
  image.src = TRANSPARENT_PIXEL;
  image.classList.add('tarot-image-fallback');
  console.error(`[Divina Bruxa] Fallback do atlas ativado para ${card.canonicalId}.`);
  globalThis.dispatchEvent?.(new CustomEvent('tarot:image-error', { detail: { index, canonicalId: card.canonicalId } }));
}

document.addEventListener('load', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.tarot-card-image[data-card-index]')) return;
  image.dataset.imageState = 'ready';
  image.classList.add('tarot-image-ready');
}, true);

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const index = Number(image.dataset.cardIndex);
  if (Number.isInteger(index)) showAtlasFallback(image, index);
}, true);
