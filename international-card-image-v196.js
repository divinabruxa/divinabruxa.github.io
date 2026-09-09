/* DIVINA BRUXA V196 — imagem internacional resiliente com atlas offline. */
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const versioned = source => `${source}${source.includes('?') ? '&' : '?'}v=196`;

export function applyInternationalCardImageV196(image, card) {
  if (!image || !card || !Number.isInteger(card.atlasIndex)) return false;
  const column = card.atlasIndex % 10;
  const row = Math.floor(card.atlasIndex / 10);
  image.classList.add('intl-tarot-image-v196');
  image.dataset.cardIndex = String(card.atlasIndex);
  image.style.backgroundImage = `url("${versioned(card.imageSources?.atlasFallback || 'tarot-atlas.webp')}")`;
  image.style.backgroundSize = '1000% 800%';
  image.style.backgroundPosition = `${(column / 9) * 100}% ${(row / 7) * 100}%`;
  image.style.backgroundRepeat = 'no-repeat';

  const showAtlas = () => {
    if (image.dataset.imageState === 'atlas') return;
    image.dataset.imageState = 'atlas';
    image.src = TRANSPARENT_PIXEL;
  };
  image.addEventListener('error', showAtlas, { once: true });
  image.addEventListener('load', () => {
    if (image.dataset.imageState !== 'atlas') image.dataset.imageState = 'ready';
  });
  if (navigator.onLine === false) showAtlas();
  else image.src = versioned(card.image);
  return true;
}
