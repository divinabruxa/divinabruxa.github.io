// Motor de portal explícito. Não intercepta links nem navegação automaticamente.
export function createPortalTransition({ root = document, duration = 680 } = {}) {
  let layer = root.querySelector('.db-portal-layer');
  if (!layer) {
    layer = root.createElement('div');
    layer.className = 'db-portal-layer';
    layer.setAttribute('aria-hidden', 'true');
    root.body?.append(layer);
  }
  const reduced = root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const wait = reduced ? 120 : Math.min(850, Math.max(120, duration));
  return {
    async enter() {
      layer.classList.add('is-entering');
      await new Promise(resolve => root.defaultView?.setTimeout(resolve, wait) ?? resolve());
      layer.classList.remove('is-entering');
    },
    destroy() { layer.remove(); }
  };
}
