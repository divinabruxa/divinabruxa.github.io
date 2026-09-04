/* DIVINA BRUXA — GUARDA VISUAL V7 · CASCA LEVE
   Protege os gestos aprovados sem antecipar imagens de páginas ocultas. */

const lockTargets = '.orb-shell,.mini-orb,.home-orb-menu,.magic-menu';

export function installVisualGuard() {
  document.addEventListener('gesturestart', event => {
    if (event.target.closest?.(lockTargets)) event.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', event => {
    if (event.target.closest?.('.orb-shell')) event.preventDefault();
  }, { passive: false });

  // A V133 já prepara somente a miniatura e a textura da skin ativa no <head>.
  // Não baixar novamente PNGs antigos, a mini-Orbe legada ou fundos de telas ocultas.
  document.documentElement.dataset.visualBase = 'v134-fast';
}
