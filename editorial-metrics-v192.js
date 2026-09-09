/* DIVINA BRUXA V192 — MÉTRICAS EDITORIAIS LOCAIS E SEM TRANSPORTE */
const ALLOWED_TARGETS = new Set(['store_guide', 'music_guide', 'video_guide']);

export function bindEditorialMetrics(root = document) {
  if (!root?.addEventListener || root.dataset?.editorialMetrics === 'v192') return () => {};
  if (root.dataset) root.dataset.editorialMetrics = 'v192';
  const onClick = event => {
    const link = event.target?.closest?.('[data-editorial-target]');
    const target = link?.dataset?.editorialTarget;
    if (!ALLOWED_TARGETS.has(target)) return;
    document.dispatchEvent(new CustomEvent('divina:editorial-navigation', {
      detail: Object.freeze({ target, transport: 'local-only' })
    }));
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
