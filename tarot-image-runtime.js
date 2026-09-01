/* DIVINA BRUXA — RUNTIME DE IMAGENS V5 — CHECKPOINT 1.2
   Carregamento progressivo, preload limitado e fallback visível pelo atlas oficial.
*/
import { CARDS } from './tarot-data.js';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const preloaded = new Set();

const escapeAttribute = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

export function cardImageMarkup(card, { alt = card.name, priority = 'lazy', decorative = false } = {}) {
  if (!card || !Number.isInteger(card.index)) return '';
  const eager = priority === 'high';
  return `<img class="tarot-card-image" src="${escapeAttribute(card.imageSources.medium)}" data-card-index="${card.index}" width="1024" height="1536" sizes="(max-width: 640px) 42vw, (max-width: 1100px) 18vw, 300px" loading="${eager ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${eager ? 'high' : 'low'}" alt="${decorative ? '' : escapeAttribute(alt)}">`;
}

export function preloadCardImages(cardIds, limit = 3) {
  if (typeof Image === 'undefined') return;
  [...new Set(cardIds)].slice(0, Math.max(0, Math.min(limit, 3))).forEach(id => {
    const card = CARDS[id];
    if (!card || preloaded.has(card.imageSources.medium)) return;
    preloaded.add(card.imageSources.medium);
    const image = new Image();
    image.decoding = 'async';
    image.src = card.imageSources.medium;
  });
}

function showAtlasFallback(image, index) {
  if (image.dataset.fallbackApplied === 'true') return;
  const card = CARDS[index];
  if (!card) return;
  const column = card.atlasIndex % 10;
  const row = Math.floor(card.atlasIndex / 10);
  image.dataset.fallbackApplied = 'true';
  image.src = TRANSPARENT_PIXEL;
  image.style.backgroundImage = `url("${card.imageSources.atlasFallback}")`;
  image.style.backgroundSize = '1000% 800%';
  image.style.backgroundPosition = `${(column / 9) * 100}% ${(row / 7) * 100}%`;
  image.style.backgroundRepeat = 'no-repeat';
  image.classList.add('tarot-image-fallback');
  console.error(`[Divina Bruxa] Fallback do atlas ativado para ${card.canonicalId}.`);
  dispatchEvent(new CustomEvent('tarot:image-error', { detail: { index, canonicalId: card.canonicalId } }));
}

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const index = Number(image.dataset.cardIndex);
  if (Number.isInteger(index)) showAtlasFallback(image, index);
}, true);
