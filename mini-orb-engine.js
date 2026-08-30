/* DIVINA BRUXA — V63 MINI-ORB TOUCH SOUL
   A tiny, dependency-free controller for every small Orbe used by the header,
   dock and Menu Mágico. It keeps the button's navigation intact while making
   each touch feel immediate: the light follows the fingertip, the shell wakes,
   and a short release pulse lingers without moving the page or its layout. */

const bound = new WeakSet();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function clearState(orb, delay = 0) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  if (delay) {
    orb.__miniOrbReleaseTimer = setTimeout(() => {
      orb.classList.remove('mini-awake', 'mini-release');
      orb.style.removeProperty('--mini-x');
      orb.style.removeProperty('--mini-y');
      orb.style.removeProperty('--mini-glow-x');
      orb.style.removeProperty('--mini-glow-y');
    }, delay);
    return;
  }
  orb.classList.remove('mini-awake', 'mini-release');
  orb.style.removeProperty('--mini-x');
  orb.style.removeProperty('--mini-y');
  orb.style.removeProperty('--mini-glow-x');
  orb.style.removeProperty('--mini-glow-y');
}

function pointOrb(orb, event) {
  const rect = orb.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  const ny = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  orb.style.setProperty('--mini-x', `${(nx * 7).toFixed(2)}px`);
  orb.style.setProperty('--mini-y', `${(ny * 7).toFixed(2)}px`);
  orb.style.setProperty('--mini-glow-x', `${(50 + nx * 27).toFixed(2)}%`);
  orb.style.setProperty('--mini-glow-y', `${(50 + ny * 27).toFixed(2)}%`);
}

function wake(orb, event) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  orb.classList.remove('mini-release');
  orb.classList.add('mini-awake');
  orb.closest('button')?.classList.add('mini-orb-active');
  if (event) pointOrb(orb, event);
  if (event?.pointerType === 'touch' && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(7);
}

function release(orb) {
  orb.__miniOrbPointer = null;
  orb.classList.remove('mini-awake');
  orb.closest('button')?.classList.remove('mini-orb-active');
  orb.classList.add('mini-release');
  clearState(orb, 620);
}

function bindOne(orb) {
  if (bound.has(orb)) return;
  bound.add(orb);
  orb.style.touchAction = 'none';
  orb.style.userSelect = 'none';
  orb.style.webkitUserSelect = 'none';
  orb.style.webkitTouchCallout = 'none';

  orb.addEventListener('pointerdown', event => {
    orb.__miniOrbPointer = event.pointerId;
    wake(orb, event);
    try { orb.setPointerCapture?.(event.pointerId); } catch {}
  }, { passive: true });

  orb.addEventListener('pointermove', event => {
    if (orb.__miniOrbPointer === event.pointerId) pointOrb(orb, event);
  }, { passive: true });

  orb.addEventListener('pointerup', event => {
    if (orb.__miniOrbPointer === event.pointerId) release(orb);
  }, { passive: true });

  orb.addEventListener('pointercancel', event => {
    if (orb.__miniOrbPointer === event.pointerId) release(orb);
  }, { passive: true });

  orb.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') wake(orb, event);
  }, { passive: true });

  orb.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && orb.__miniOrbPointer == null) release(orb);
  }, { passive: true });

  const button = orb.closest('button');
  button?.addEventListener('focus', () => wake(orb), { passive: true });
  button?.addEventListener('blur', () => {
    if (orb.__miniOrbPointer == null) release(orb);
  }, { passive: true });
}

export function bindMiniOrbs(root = document) {
  root.querySelectorAll?.('.mini-orb').forEach(bindOne);
  return root.querySelectorAll ? [...root.querySelectorAll('.mini-orb')] : [];
}

export default bindMiniOrbs;
