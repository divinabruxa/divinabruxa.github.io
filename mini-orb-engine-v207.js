/* DIVINA BRUXA — ORBE 2.0 V207 · MINI-ORBES NO NÚCLEO ÚNICO
   A arte aprovada permanece imóvel. Luz, cor e profundidade respiram no mesmo
   relógio da Orbe principal, somente enquanto cada superfície está visível. */

import { orbMotionV207, requestNativeHapticV207 } from './orb-motion-core-v207.js?v=207';

const bindings = new Map();
const livingOrbs = new Set();
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
let phaseSeed = 0;
let timeline = 0;
let motionClient;

function pulse(position, center, width) {
  const distance = (position - center) / width;
  return Math.exp(-(distance * distance));
}

function setStyle(orb, name, value) {
  const state = orb.__miniOrbCss || (orb.__miniOrbCss = new Map());
  if (state.get(name) === value) return;
  state.set(name, value);
  orb.style.setProperty(name, value);
}

function paintLife(orb, seconds, still = false) {
  const phase = orb.__miniOrbPhase || 0;
  const time = seconds + phase;
  const cycle = ((time % 8.4) + 8.4) % 8.4 / 8.4;
  const breath = .5 - .5 * Math.cos(time * .78);
  const heartbeat = pulse(cycle, .56, .026) + pulse(cycle, .615, .018) * .58;
  setStyle(orb, '--mini-brightness', (still ? 1.045 : .93 + breath * .13 + heartbeat * .09).toFixed(3));
  setStyle(orb, '--mini-saturation', (still ? 1.12 : 1.02 + breath * .12).toFixed(3));
  setStyle(orb, '--mini-layer-opacity', (still ? .19 : .095 + breath * .11 + heartbeat * .05).toFixed(3));
  setStyle(orb, '--mini-aura', (still ? .72 : .48 + breath * .34 + heartbeat * .14).toFixed(3));
}

function isAwake(orb) {
  return orb.classList.contains('mini-awake') || orb.__miniOrbPointer != null;
}

function isVisible(orb) {
  return orb.isConnected && (orb.__miniOrbVisible !== false || isAwake(orb));
}

function clearTouch(orb, delay = 0) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  const finish = () => {
    orb.classList.remove('mini-awake', 'mini-release');
    orb.style.removeProperty('--mini-glow-x');
    orb.style.removeProperty('--mini-glow-y');
    orb.__miniOrbCss?.delete('--mini-glow-x');
    orb.__miniOrbCss?.delete('--mini-glow-y');
  };
  if (delay) orb.__miniOrbReleaseTimer = setTimeout(finish, delay);
  else finish();
}

function pointOrb(orb, event) {
  const rect = orb.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nx = clamp(((event.clientX - rect.left) / rect.width - .5) * 2, -1, 1);
  const ny = clamp(((event.clientY - rect.top) / rect.height - .5) * 2, -1, 1);
  setStyle(orb, '--mini-glow-x', `${(50 + nx * 29).toFixed(2)}%`);
  setStyle(orb, '--mini-glow-y', `${(50 + ny * 29).toFixed(2)}%`);
}

function wake(orb, event) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  orb.classList.remove('mini-release');
  orb.classList.add('mini-awake');
  orb.closest('button')?.classList.add('mini-orb-active');
  if (event) pointOrb(orb, event);
  if (event?.pointerType === 'touch') requestNativeHapticV207(7);
  motionClient?.wake('mini-touch');
}

function release(orb) {
  orb.__miniOrbPointer = null;
  orb.classList.remove('mini-awake');
  orb.closest('button')?.classList.remove('mini-orb-active');
  orb.classList.add('mini-release');
  clearTouch(orb, 680);
  motionClient?.wake('mini-release');
}

const visibilityObserver = typeof IntersectionObserver === 'function'
  ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.__miniOrbVisible = entry.isIntersecting && entry.intersectionRatio > 0;
      }
      motionClient?.wake('mini-visibility');
    }, { rootMargin: '96px', threshold: [0, .01] })
  : null;

function unbindOne(orb) {
  const binding = bindings.get(orb);
  if (!binding) return;
  binding.controller.abort();
  visibilityObserver?.unobserve(orb);
  clearTimeout(orb.__miniOrbReleaseTimer);
  clearTouch(orb);
  orb.closest('button')?.classList.remove('mini-orb-active');
  orb.__miniOrbPointer = null;
  livingOrbs.delete(orb);
  bindings.delete(orb);
}

function pruneDisconnected() {
  for (const orb of [...livingOrbs]) {
    if (!orb.isConnected) unbindOne(orb);
  }
}

function bindOne(orb) {
  if (bindings.has(orb)) return;
  const controller = new AbortController();
  const listen = (target, type, handler, options = {}) => target?.addEventListener(type, handler, {
    passive: true,
    ...options,
    signal: controller.signal
  });

  bindings.set(orb, { controller });
  livingOrbs.add(orb);
  orb.__miniOrbPhase = phaseSeed += 1.73;
  orb.__miniOrbVisible = true;
  paintLife(orb, timeline, orbMotionV207.reducedMotion);
  orb.style.touchAction = 'none';
  orb.style.userSelect = 'none';
  orb.style.webkitUserSelect = 'none';
  orb.style.webkitTouchCallout = 'none';

  listen(orb, 'pointerdown', event => {
    orb.__miniOrbPointer = event.pointerId;
    wake(orb, event);
    try { orb.setPointerCapture?.(event.pointerId); } catch {}
  });
  listen(orb, 'pointermove', event => {
    if (orb.__miniOrbPointer === event.pointerId) pointOrb(orb, event);
  });
  listen(orb, 'pointerup', event => {
    if (orb.__miniOrbPointer === event.pointerId) release(orb);
  });
  listen(orb, 'lostpointercapture', () => {
    if (orb.__miniOrbPointer != null) release(orb);
  });
  listen(orb, 'pointercancel', event => {
    if (orb.__miniOrbPointer === event.pointerId) release(orb);
  });
  listen(orb, 'pointerenter', event => {
    if (event.pointerType === 'mouse') wake(orb, event);
  });
  listen(orb, 'pointerleave', event => {
    if (event.pointerType === 'mouse' && orb.__miniOrbPointer == null) release(orb);
  });

  const button = orb.closest('button');
  listen(button, 'focus', () => wake(orb));
  listen(button, 'blur', () => {
    if (orb.__miniOrbPointer == null) release(orb);
  });
  visibilityObserver?.observe(orb);
  motionClient?.wake('mini-bind');
}

motionClient = orbMotionV207.register({
  id: 'mini-orbs',
  isActive: () => {
    pruneDisconnected();
    return [...livingOrbs].some(isVisible);
  },
  frameRate: reduced => reduced ? 1 : 30,
  onFrame: (_time, _seconds, elapsed, state) => {
    timeline = elapsed;
    pruneDisconnected();
    for (const orb of livingOrbs) {
      if (isVisible(orb)) paintLife(orb, elapsed, state.reducedMotion);
    }
  },
  onSuspend: () => {
    for (const orb of livingOrbs) {
      if (orb.__miniOrbPointer != null) release(orb);
    }
  },
  onReducedMotionChange: reduced => {
    for (const orb of livingOrbs) {
      if (isVisible(orb)) paintLife(orb, timeline, reduced);
    }
  }
});

export function bindMiniOrbs(root = document) {
  const orbs = root.querySelectorAll ? [...root.querySelectorAll('.mini-orb')] : [];
  orbs.forEach(bindOne);
  motionClient.wake('mini-bind-all');
  return Object.freeze({
    orbs: Object.freeze(orbs),
    refresh: () => bindMiniOrbs(root),
    destroy: () => orbs.forEach(unbindOne)
  });
}

export function destroyMiniOrbs(root = document) {
  for (const orb of [...livingOrbs]) {
    if (root === document || root.contains?.(orb)) unbindOne(orb);
  }
  motionClient.wake('mini-destroy');
}

export default bindMiniOrbs;
