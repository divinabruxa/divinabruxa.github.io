// DIVINA BRUXA V130 — portal cancelável e leve.
// Home, Tarot Livre e Skins conservam o modo clássico já aprovado.
const PROTECTED_DESTINATIONS = new Set(['home', 'tarot', 'skins']);

const REALM_COLORS = Object.freeze({
  daily: ['#c1a8ff', '#f3dc9a'],
  library: ['#7caaff', '#efce82'],
  school: ['#66d9dc', '#f0d38d'],
  spreads: ['#e997c5', '#f3cf84'],
  ai: ['#9be7ff', '#f4d891'],
  journal: ['#d59aff', '#edcf91'],
  store: ['#70d8a4', '#f3d17e'],
  consultations: ['#ee9ea8', '#f1ce8b'],
  subscriptions: ['#f0c76f', '#ffe6a3'],
  videos: ['#ef6cae', '#f4d48f'],
  music: ['#77bcff', '#f0d492'],
  login: ['#cab4ed', '#efd49a'],
  admin: ['#d7a85b', '#f7d88f']
});

function ensurePortalPart(root, layer, className) {
  let part = layer.querySelector(`.${className}`);
  if (part) return part;
  part = root.createElement('i');
  part.className = className;
  part.setAttribute('aria-hidden', 'true');
  layer.append(part);
  return part;
}

export function createPortalTransition({ root = document, duration = 680 } = {}) {
  let layer = root.querySelector('.db-portal-layer');
  if (!layer) {
    layer = root.createElement('div');
    layer.className = 'db-portal-layer';
    layer.setAttribute('aria-hidden', 'true');
    root.body?.append(layer);
  }

  const veil = ensurePortalPart(root, layer, 'db-portal-layer__veil');
  const ring = ensurePortalPart(root, layer, 'db-portal-layer__ring');
  const star = ensurePortalPart(root, layer, 'db-portal-layer__star');
  const view = root.defaultView;
  const reducedQuery = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
  const classicWait = Math.min(850, Math.max(120, duration));
  const realmDuration = Math.min(500, Math.max(340, Math.round(duration * .7)));

  let token = 0;
  let classicTimer = 0;
  let classicResolve = null;
  let running = [];

  const cancelAnimations = () => {
    running.forEach(animation => animation?.cancel?.());
    running = [];
  };

  const clearState = () => {
    if (classicTimer) view?.clearTimeout(classicTimer);
    classicTimer = 0;
    if (classicResolve) {
      const resolve = classicResolve;
      classicResolve = null;
      resolve();
    }
    cancelAnimations();
    layer.classList.remove('is-entering', 'is-classic', 'is-realm');
    layer.style.removeProperty('opacity');
    layer.style.removeProperty('transform');
  };

  const classicEnter = () => {
    const ownToken = ++token;
    clearState();
    layer.classList.add('is-classic');
    // O quadro é separado para conservar a transição original.
    view?.requestAnimationFrame?.(() => {
      if (ownToken !== token) return;
      layer.classList.add('is-entering');
    });
    return new Promise(resolve => {
      classicResolve = resolve;
      classicTimer = view?.setTimeout?.(() => {
        if (ownToken === token) layer.classList.remove('is-entering');
        classicTimer = 0;
        classicResolve = null;
        resolve();
      }, reducedQuery?.matches ? 120 : classicWait) || 0;
    });
  };

  const realmEnter = async destination => {
    const ownToken = ++token;
    clearState();
    const [accent, bright] = REALM_COLORS[destination] || ['#bd83ff', '#f6d996'];
    layer.style.setProperty('--db-portal-accent', accent);
    layer.style.setProperty('--db-portal-bright', bright);
    layer.dataset.destination = destination || 'interior';
    layer.classList.add('is-realm');

    const short = Boolean(reducedQuery?.matches);
    const total = short ? 140 : realmDuration;
    const easing = 'cubic-bezier(.16,.82,.22,1)';
    const layerAnimation = layer.animate(short ? [
      { opacity: 0 }, { opacity: .18, offset: .35 }, { opacity: 0 }
    ] : [
      { opacity: 0, transform: 'scale(1.025)' },
      { opacity: .58, transform: 'scale(1)', offset: .34 },
      { opacity: 0, transform: 'scale(1.018)' }
    ], { duration: total, easing, fill: 'both' });

    running = [layerAnimation];
    if (!short) {
      running.push(ring.animate([
        { opacity: 0, transform: 'scale(.64) rotate(-7deg)' },
        { opacity: .85, offset: .38 },
        { opacity: 0, transform: 'scale(1.12) rotate(3deg)' }
      ], { duration: total, easing, fill: 'both' }));
      running.push(star.animate([
        { opacity: 0, transform: 'scale(.2)' },
        { opacity: 1, transform: 'scale(1.25)', offset: .35 },
        { opacity: 0, transform: 'scale(.7)' }
      ], { duration: total, easing, fill: 'both' }));
      running.push(veil.animate([
        { opacity: .15 }, { opacity: .72, offset: .35 }, { opacity: 0 }
      ], { duration: total, easing, fill: 'both' }));
    }

    try { await layerAnimation.finished; } catch { /* troca rápida: a nova intenção vence */ }
    if (ownToken !== token) return;
    clearState();
  };

  return {
    enter(destination = '') {
      return PROTECTED_DESTINATIONS.has(destination) ? classicEnter() : realmEnter(destination);
    },
    destroy() {
      token += 1;
      clearState();
      layer.remove();
    }
  };
}
