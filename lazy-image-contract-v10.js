// Contrato pequeno e seguro para imagens não críticas. Não altera imagens existentes sozinho.
export function prepareLazyImage(image) {
  if (!image || image.dataset.critical === 'true') return image;
  image.loading = 'lazy';
  image.decoding = 'async';
  if (!image.width && image.dataset.width) image.width = Number(image.dataset.width);
  if (!image.height && image.dataset.height) image.height = Number(image.dataset.height);
  return image;
}

export function prepareLazyImages(root = document) {
  return [...root.querySelectorAll('img[data-lazy="true"]')].map(prepareLazyImage);
}
