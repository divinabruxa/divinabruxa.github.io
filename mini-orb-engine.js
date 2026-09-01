/* DIVINA BRUXA — V71 STATIC-SPHERE MINI GALAXY ENGINE
   One shared energy loop animates every small Orbe. The approved celestial
   artwork stays perfectly centered while light, color and depth breathe.
   Neither the sphere nor its texture changes position — only light answers touch. */

const bound = new WeakSet();
let livingOrbs = [];
let animationFrame = 0;
let lastFrame = 0;
let phaseSeed = 0;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function pulse(position, center, width) {
  const distance = (position - center) / width;
  return Math.exp(-(distance * distance));
}

function paintLife(orb, seconds, still = false) {
  const phase = orb.__miniOrbPhase || 0;
  const time = seconds + phase;
  const cycle = ((time % 8.4) + 8.4) % 8.4 / 8.4;
  const breath = .5 - .5 * Math.cos(time * .78);
  const heartbeat = pulse(cycle, .56, .026) + pulse(cycle, .615, .018) * .58;
  orb.style.setProperty('--mini-brightness', (still ? 1.045 : .93 + breath * .13 + heartbeat * .09).toFixed(3));
  orb.style.setProperty('--mini-saturation', (still ? 1.12 : 1.02 + breath * .12).toFixed(3));
  orb.style.setProperty('--mini-layer-opacity', (still ? .19 : .095 + breath * .11 + heartbeat * .05).toFixed(3));
  orb.style.setProperty('--mini-aura', (still ? .72 : .48 + breath * .34 + heartbeat * .14).toFixed(3));
}

function energyLoop(timestamp) {
  animationFrame = 0;
  if (document.hidden) return;
  const interval = reducedMotion.matches ? 1000 : 1000 / 30;
  if (timestamp - lastFrame >= interval) {
    lastFrame = timestamp;
    livingOrbs = livingOrbs.filter(orb => orb.isConnected);
    livingOrbs.forEach(orb => paintLife(orb, timestamp / 1000, reducedMotion.matches));
  }
  animationFrame = requestAnimationFrame(energyLoop);
}

function ensureEnergyLoop() {
  if (!animationFrame && !document.hidden && livingOrbs.length) {
    animationFrame = requestAnimationFrame(energyLoop);
  }
}

function clearTouch(orb, delay = 0) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  const finish = () => {
    orb.classList.remove('mini-awake', 'mini-release');
    orb.style.removeProperty('--mini-glow-x');
    orb.style.removeProperty('--mini-glow-y');
  };
  if (delay) orb.__miniOrbReleaseTimer = setTimeout(finish, delay);
  else finish();
}

function pointOrb(orb, event) {
  const rect = orb.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nx = clamp(((event.clientX - rect.left) / rect.width - .5) * 2, -1, 1);
  const ny = clamp(((event.clientY - rect.top) / rect.height - .5) * 2, -1, 1);
  orb.style.setProperty('--mini-glow-x', `${(50 + nx * 29).toFixed(2)}%`);
  orb.style.setProperty('--mini-glow-y', `${(50 + ny * 29).toFixed(2)}%`);
}

function wake(orb, event) {
  clearTimeout(orb.__miniOrbReleaseTimer);
  orb.classList.remove('mini-release');
  orb.classList.add('mini-awake');
  orb.closest('button')?.classList.add('mini-orb-active');
  if (event) pointOrb(orb, event);
  if (event?.pointerType === 'touch' && navigator.vibrate) navigator.vibrate(7);
}

function release(orb) {
  orb.__miniOrbPointer = null;
  orb.classList.remove('mini-awake');
  orb.closest('button')?.classList.remove('mini-orb-active');
  orb.classList.add('mini-release');
  clearTouch(orb, 680);
}

function bindOne(orb) {
  if (bound.has(orb)) return;
  bound.add(orb);
  orb.__miniOrbPhase = phaseSeed += 1.73;
  livingOrbs.push(orb);
  paintLife(orb, performance.now() / 1000, reducedMotion.matches);
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
  orb.addEventListener('lostpointercapture', () => {
    if (orb.__miniOrbPointer != null) release(orb);
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
  ensureEnergyLoop();
}

document.addEventListener('visibilitychange', ensureEnergyLoop, { passive: true });
reducedMotion.addEventListener?.('change', () => {
  livingOrbs.forEach(orb => paintLife(orb, performance.now() / 1000, reducedMotion.matches));
  ensureEnergyLoop();
});

export function bindMiniOrbs(root = document) {
  const orbs = root.querySelectorAll ? [...root.querySelectorAll('.mini-orb')] : [];
  orbs.forEach(bindOne);
  ensureEnergyLoop();
  return orbs;
}

export default bindMiniOrbs;
