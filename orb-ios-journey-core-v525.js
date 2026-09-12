/* DIVINA BRUXA — ORBOS iOS · VIAGEM ESPACIAL DA ORBE V525 · FLUIDEZ V535
   Shared-element navigation for the single living Orb. The page never receives
   a second Orb engine: a temporary Retina mirror carries the same visual signal
   across the one continuous V524 universe, then yields to the destination host.
*/

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 525;
const MARK = Symbol.for('divina.orb.ios.journey.v525');
const STYLE_ID = 'divinaOrbIOSJourneyV525Styles';
const STYLE_HREF = './orb-ios-journey-core-v525.css?v=525';
const ROOT_ID = 'divinaOrbIOSJourneyV525';
const HIDDEN_CLASS = 'db525-orb-in-flight';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const frame = () => new Promise(resolve => requestAnimationFrame(() => resolve()));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const coarsePointer = () => globalThis.matchMedia?.('(pointer: coarse)').matches === true
  || Number(navigator.maxTouchPoints || 0) > 0;
export const ORB_JOURNEY_FLUIDITY_BUDGETS_V535 = Object.freeze({
  reduced:Object.freeze({
    lift:52, flight:66, arrival:70, settle:38, destinationWait:96,
    mirrorFps:8, igniteEvery:190, ratio:1.35, minimumPixels:240, maximumPixels:420,
    profile:'reduced-v535'
  }),
  constrained:Object.freeze({
    lift:54, flight:112, arrival:128, settle:54, destinationWait:120,
    mirrorFps:12, igniteEvery:180, ratio:1.45, minimumPixels:260, maximumPixels:460,
    profile:'constrained-v535'
  }),
  touch:Object.freeze({
    lift:64, flight:146, arrival:164, settle:68, destinationWait:150,
    mirrorFps:18, igniteEvery:150, ratio:1.72, minimumPixels:288, maximumPixels:560,
    profile:'touch-v535'
  }),
  pointer:Object.freeze({
    lift:78, flight:184, arrival:206, settle:82, destinationWait:210,
    mirrorFps:24, igniteEvery:126, ratio:2, minimumPixels:320, maximumPixels:680,
    profile:'pointer-v535'
  })
});
const fluidityBudget = () => reducedMotion()
  ? ORB_JOURNEY_FLUIDITY_BUDGETS_V535.reduced
  : constrained()
    ? ORB_JOURNEY_FLUIDITY_BUDGETS_V535.constrained
    : coarsePointer()
      ? ORB_JOURNEY_FLUIDITY_BUDGETS_V535.touch
      : ORB_JOURNEY_FLUIDITY_BUDGETS_V535.pointer;
const viewport = () => ({
  width:Math.max(1, globalThis.visualViewport?.width || document.documentElement.clientWidth || innerWidth),
  height:Math.max(1, globalThis.visualViewport?.height || document.documentElement.clientHeight || innerHeight)
});

function emit(type, detail = {}) {
  document.dispatchEvent(new CustomEvent(type, { detail:{ version:VERSION, ...detail } }));
}

function installStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) return existing;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.orbIOSJourneyStyle = 'true';
  document.head.append(link);
  return link;
}

function usableRect(node) {
  if (!node?.isConnected || node.hidden) return null;
  const rect = node.getBoundingClientRect?.();
  if (!rect || rect.width < 8 || rect.height < 8) return null;
  if (rect.bottom < -8 || rect.right < -8) return null;
  const view = viewport();
  if (rect.top > view.height + 8 || rect.left > view.width + 8) return null;
  return {
    left:rect.left,
    top:rect.top,
    right:rect.right,
    bottom:rect.bottom,
    width:rect.width,
    height:rect.height,
    x:rect.left + rect.width / 2,
    y:rect.top + rect.height / 2
  };
}

function findNode(selectors = []) {
  for (const selector of selectors) {
    let node = null;
    try { node = document.querySelector(selector); } catch {}
    const rect = usableRect(node);
    if (rect) return { node, rect };
  }
  return null;
}

function resolveOrigin(core, explicitOrigin) {
  const explicitNode = explicitOrigin instanceof Element ? explicitOrigin : null;
  const explicitRect = usableRect(explicitOrigin);
  const physicalRect = usableRect(core?.orb);
  const projectionOrigin = explicitNode?.closest?.('[data-orb-projection-v501], [data-orb-projection], .dock-orb, .mini-orb');

  if (projectionOrigin && explicitRect) return { node:projectionOrigin, rect:explicitRect };
  if (physicalRect) return { node:core.orb, rect:physicalRect };
  if (explicitRect) return { node:explicitNode, rect:explicitRect };
  return findNode([
    '.magic-dock .dock-orb',
    '.dock-orb',
    '[data-orb-projection-v501="true"]',
    '[data-orb-projection]'
  ]) || {
    node:null,
    rect:{ left:innerWidth/2-42, top:innerHeight/2-42, right:innerWidth/2+42,
      bottom:innerHeight/2+42, width:84, height:84, x:innerWidth/2, y:innerHeight/2 }
  };
}

function copyOrbVariables(source, destination) {
  const node = source || document.querySelector('[data-supreme-orb="living"]');
  if (!node || !destination) return;
  const style = getComputedStyle(node);
  [
    '--p','--s','--a','--core','--dark','--orb-primary','--orb-secondary',
    '--orb-glow','--orb-mid','--orb-bright','--orb-luminance'
  ].forEach(name => {
    const value = style.getPropertyValue(name).trim();
    if (value) destination.style.setProperty(name, value);
  });
  const skin = node.dataset?.skin || document.documentElement.dataset.orbSkin;
  if (skin) destination.dataset.skin = skin;
}

export class OrbIOSJourneyCoreV525 {
  constructor({ core = null, universe = null } = {}) {
    this.version = VERSION;
    this.core = core;
    this.universe = universe;
    this.abort = new AbortController();
    this.state = 'rest';
    this.active = false;
    this.serial = 0;
    this.route = null;
    this.source = null;
    this.destination = null;
    this.sourceRect = null;
    this.currentPoint = null;
    this.size = 92;
    this.scale = 1;
    this.animations = new Set();
    this.paintFrame = 0;
    this.lastPaint = 0;
    this.lastIgnite = 0;
    this.fallbackPresence = null;
    this.destroyed = false;

    installStyles();
    this.createLayer();
    this.bind();
    document.documentElement.dataset.orbIOSJourney = 'v525';
    emit('divina:orb-ios-journey-ready', this.status());
  }

  createLayer() {
    document.getElementById(ROOT_ID)?.remove();
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'db525-orb-journey';
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    Object.assign(root.style, {
      position:'fixed', inset:'0', zIndex:'2147482500', pointerEvents:'none',
      overflow:'hidden', contain:'strict'
    });
    root.innerHTML = `
      <div class="db525-orb-journey__traveler">
        <div class="db525-orb-journey__plume" aria-hidden="true"></div>
        <div class="db525-orb-journey__body">
          <span class="db525-orb-journey__aura" aria-hidden="true"></span>
          <canvas class="db525-orb-journey__canvas" aria-hidden="true"></canvas>
          <span class="db525-orb-journey__glass" aria-hidden="true"></span>
        </div>
        <span class="db525-orb-journey__embers" aria-hidden="true"></span>
      </div>`;
    const embers = root.querySelector('.db525-orb-journey__embers');
    for (let index=0; index<12; index+=1) {
      const ember = document.createElement('i');
      ember.style.setProperty('--ember-i', String(index));
      ember.style.setProperty('--ember-angle', `${index * 137.508}deg`);
      ember.style.setProperty('--ember-delay', `${-(index % 6) * 83}ms`);
      embers.append(ember);
    }
    (document.body || document.documentElement).append(root);
    this.root = root;
    this.traveler = root.querySelector('.db525-orb-journey__traveler');
    this.body = root.querySelector('.db525-orb-journey__body');
    this.canvas = root.querySelector('canvas');
    this.context = this.canvas.getContext('2d', { alpha:true, desynchronized:true });
  }

  bind() {
    const { signal } = this.abort;
    document.addEventListener('divina:skin-change', () => copyOrbVariables(this.core?.orb, this.root), { signal });
    document.addEventListener('orbe:skin-change', () => copyOrbVariables(this.core?.orb, this.root), { signal });
    document.addEventListener('skin:changed', () => copyOrbVariables(this.core?.orb, this.root), { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.active) this.finishImmediately('visibility');
    }, { signal });
    const reconcile = () => setTimeout(() => this.reconcileFallbackPresence(), 80);
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-claimed','divina:orbital-menu-ready']
      .forEach(type => document.addEventListener(type, reconcile, { signal }));
    globalThis.addEventListener?.('pagehide', () => this.finishImmediately('pagehide'), { signal });
  }

  attach(core) {
    this.core = core || this.core;
    copyOrbVariables(this.core?.orb, this.root);
    return this;
  }

  detach(core) {
    if (!core || core === this.core) this.core = null;
  }

  setState(state, detail = {}) {
    this.state = state;
    if (this.root) this.root.dataset.state = state;
    document.documentElement.dataset.orbJourneyState = state;
    emit('divina:orb-ios-journey-state', { state, route:this.route, ...detail });
  }

  prepareMirror(rect, sourceNode) {
    const view = viewport();
    this.size = clamp(Math.max(rect.width, rect.height), 64, Math.min(560, view.width * 1.28));
    this.ensureMirrorResolution(this.size);
    this.root.style.setProperty('--db525-orb-size', `${this.size}px`);
    copyOrbVariables(this.core?.orb || sourceNode, this.root);
    this.paintMirror(performance.now(), true);
  }

  ensureMirrorResolution(displaySize) {
    const budget = fluidityBudget();
    const ratio = Math.min(globalThis.devicePixelRatio || 1, budget.ratio);
    const pixels = Math.round(clamp(displaySize * ratio, budget.minimumPixels, budget.maximumPixels));
    if (this.canvas.width !== pixels || this.canvas.height !== pixels) {
      this.canvas.width = pixels;
      this.canvas.height = pixels;
    }
  }

  paintMirror(timestamp, force = false) {
    if (!this.active && !force) return;
    const fps = fluidityBudget().mirrorFps;
    if (!force && timestamp - this.lastPaint < 1000 / fps) return;
    this.lastPaint = timestamp;
    const { width, height } = this.canvas;
    if (!width || !height || !this.context) return;
    this.context.clearRect(0, 0, width, height);
    try {
      const sourceCanvas = this.core?.canvas;
      if (!sourceCanvas?.width || !sourceCanvas?.height) throw new Error('orb-canvas-unavailable');
      this.context.drawImage(sourceCanvas, 0, 0, width, height);
      this.root.dataset.mirror = 'living-canvas';
    } catch {
      const gradient = this.context.createRadialGradient(width*0.46,height*0.43,0,width/2,height/2,width/2);
      gradient.addColorStop(0,'rgba(255,255,255,.98)');
      gradient.addColorStop(.12,'rgba(255,92,238,.95)');
      gradient.addColorStop(.52,'rgba(112,28,255,.82)');
      gradient.addColorStop(1,'rgba(7,1,20,0)');
      this.context.fillStyle = gradient;
      this.context.fillRect(0,0,width,height);
      this.root.dataset.mirror = 'safe-gradient';
    }
  }

  startLivingMirror() {
    cancelAnimationFrame(this.paintFrame);
    const budget = fluidityBudget();
    const paint = timestamp => {
      if (!this.active || this.destroyed) return;
      this.paintMirror(timestamp);
      if (timestamp - this.lastIgnite > budget.igniteEvery) {
        const rect = this.traveler?.getBoundingClientRect?.();
        if (rect?.width && rect?.height) {
          const view = viewport();
          this.universe?.ignite?.({
            x:clamp((rect.left + rect.width/2) / view.width, 0, 1),
            y:clamp((rect.top + rect.height/2) / view.height, 0, 1),
            strength:0.46
          });
        }
        this.lastIgnite = timestamp;
      }
      this.paintFrame = requestAnimationFrame(paint);
    };
    this.paintFrame = requestAnimationFrame(paint);
  }

  gatewayFor(route) {
    const view = viewport();
    const point = worldForRouteV535(route)?.gateway || [0.5,0.44];
    return {
      x:clamp(point[0] * view.width, 44, view.width - 44),
      y:clamp(point[1] * view.height, 88, view.height - 96)
    };
  }

  outerTransform(point) {
    return `translate3d(${(point.x-this.size/2).toFixed(2)}px, ${(point.y-this.size/2).toFixed(2)}px, 0)`;
  }

  async animateNode(node, keyframes, options, finalStyles = {}) {
    if (!node) return;
    if (reducedMotion() || typeof node.animate !== 'function') {
      Object.assign(node.style, finalStyles);
      await wait(reducedMotion() ? Math.min(84, options.duration || 0) : options.duration || 0);
      return;
    }
    const animation = node.animate(keyframes, { fill:'forwards', ...options });
    this.animations.add(animation);
    try { await animation.finished; } catch {}
    this.animations.delete(animation);
    Object.assign(node.style, finalStyles);
    try { animation.cancel(); } catch {}
  }

  async movePath(points, duration, easing = 'cubic-bezier(.22,.82,.24,1)') {
    if (!points.length) return;
    const start = this.currentPoint || points[0];
    const path = [start, ...points];
    const finish = path[path.length-1];
    const angle = Math.atan2(finish.y-start.y, finish.x-start.x) * 180 / Math.PI + 90;
    if (Math.hypot(finish.x-start.x, finish.y-start.y) > 3) {
      this.root.style.setProperty('--db525-plume-rotation', `${angle.toFixed(2)}deg`);
    }
    const keyframes = path.map((point, index) => ({
      transform:this.outerTransform(point),
      offset:index / Math.max(1, path.length - 1)
    }));
    await this.animateNode(this.traveler, keyframes, { duration, easing }, {
      transform:this.outerTransform(finish)
    });
    this.currentPoint = finish;
  }

  async scaleBody(scale, duration, easing = 'cubic-bezier(.22,.82,.24,1)', overshoot = false) {
    const start = this.scale;
    const keyframes = overshoot
      ? [
          { transform:`scale(${start})`, offset:0 },
          { transform:`scale(${scale * 1.045})`, offset:.72 },
          { transform:`scale(${scale})`, offset:1 }
        ]
      : [{ transform:`scale(${start})` },{ transform:`scale(${scale})` }];
    await this.animateNode(this.body, keyframes, { duration, easing }, {
      transform:`scale(${scale})`
    });
    this.scale = scale;
  }

  igniteAt(point, strength = 1) {
    const view = viewport();
    this.universe?.ignite?.({
      x:clamp(point.x / view.width, 0, 1),
      y:clamp(point.y / view.height, 0, 1),
      strength
    });
  }

  async depart({ from, to, signature, serial, origin, source } = {}) {
    if (this.destroyed) return null;
    if (this.active) this.finishImmediately('superseded');
    this.active = true;
    this.serial = Number(serial || 0);
    this.route = String(to || 'home');
    this.source = resolveOrigin(this.core, origin);
    this.sourceRect = this.source.rect;
    this.destination = null;
    this.currentPoint = { x:this.sourceRect.x, y:this.sourceRect.y };
    this.scale = 1;

    this.prepareMirror(this.sourceRect, this.source.node);
    this.traveler.style.transform = this.outerTransform(this.currentPoint);
    this.body.style.transform = 'scale(1)';
    this.root.dataset.route = this.route;
    this.root.dataset.direction = signature?.direction || 'out';
    this.root.dataset.tone = signature?.tone || 'cosmos';
    this.root.hidden = false;
    document.documentElement.classList.add(HIDDEN_CLASS, 'db525-route-departing');
    document.documentElement.classList.remove('db525-route-arriving');
    this.setState('lift', { from, to, serial:this.serial, source });
    this.startLivingMirror();
    this.igniteAt(this.currentPoint, 1.04);
    await frame();

    const budget = fluidityBudget();
    if (reducedMotion()) {
      const gateway = this.gatewayFor(this.route);
      await Promise.all([
        this.movePath([gateway], budget.flight, 'ease-out'),
        this.scaleBody(clamp(82/this.size, .22, 1), budget.flight, 'ease-out')
      ]);
      this.setState('portal', { to, serial:this.serial });
      return this.status();
    }

    const liftDistance = clamp(this.size * 0.075, 9, 28);
    const lifted = { x:this.currentPoint.x, y:this.currentPoint.y-liftDistance };
    await Promise.all([
      this.movePath([lifted], budget.lift, 'cubic-bezier(.2,.8,.2,1)'),
      this.scaleBody(0.965, budget.lift, 'cubic-bezier(.2,.8,.2,1)')
    ]);

    this.setState('flight', { from, to, serial:this.serial });
    const gateway = this.gatewayFor(this.route);
    const bend = (gateway.x >= lifted.x ? -1 : 1) * clamp(Math.abs(gateway.y-lifted.y)*0.08+20, 20, 48);
    const first = {
      x:lifted.x + (gateway.x-lifted.x)*0.36 + bend,
      y:lifted.y + (gateway.y-lifted.y)*0.28 - 18
    };
    const second = {
      x:lifted.x + (gateway.x-lifted.x)*0.72 - bend*0.38,
      y:lifted.y + (gateway.y-lifted.y)*0.70 + 10
    };
    const flightScale = clamp((constrained() ? 78 : 90) / this.size, .18, 1.02);
    await Promise.all([
      this.movePath([first,second,gateway], budget.flight),
      this.scaleBody(flightScale, budget.flight)
    ]);
    this.igniteAt(gateway, 0.82);
    this.setState('portal', { to, serial:this.serial });
    return this.status();
  }

  resolveDestination(route) {
    const physical = usableRect(this.core?.orb);
    const physicalScreen = this.core?.orb?.closest?.('.screen,[data-screen]');
    const bodyRoute = String(document.body?.dataset?.screen || '').toLowerCase();
    if (physical && (!physicalScreen || physicalScreen.id === route || bodyRoute === route)) {
      return { node:this.core.orb, rect:physical, kind:'physical' };
    }

    const routeMatch = findNode(worldForRouteV535(route)?.journeyAnchors || []);
    if (routeMatch) return { ...routeMatch, kind:'route-anchor' };

    const screen = document.getElementById(route);
    if (screen) {
      const local = findNode([
        `#${route} [data-orb-journey-anchor]`,
        `#${route} [data-supreme-orb="living"]`,
        `#${route} [data-orb-projection-v501="true"]`
      ]);
      if (local) return { ...local, kind:'screen-presence' };
    }

    const dock = findNode(['.magic-dock .dock-orb','.dock-orb']);
    if (dock) return { ...dock, kind:'dock-presence' };

    const projection = findNode(['[data-orb-projection-v501="true"]','[data-orb-projection]']);
    if (projection) return { ...projection, kind:'projection' };

    const fallback = this.ensureFallbackPresence(route);
    return fallback ? { node:fallback, rect:usableRect(fallback), kind:'fallback-presence' } : null;
  }

  ensureFallbackPresence(route) {
    let presence = this.fallbackPresence;
    if (!presence?.isConnected) {
      presence = document.createElement('span');
      presence.className = 'db525-orb-presence';
      presence.dataset.orbProjection = 'journey-v525';
      presence.dataset.orbJourneyAnchor = 'fallback';
      presence.setAttribute('role', 'img');
      presence.setAttribute('aria-label', 'Presença da Orbe das Realidades');
      document.body.append(presence);
      this.fallbackPresence = presence;
      this.core?.adoptProjections?.(presence);
    }
    presence.dataset.route = route;
    presence.hidden = false;
    return presence;
  }

  reconcileFallbackPresence() {
    if (!this.fallbackPresence?.isConnected || this.active) return;
    const physical = usableRect(this.core?.orb);
    const dock = findNode(['.magic-dock .dock-orb','.dock-orb']);
    this.fallbackPresence.hidden = Boolean(physical || dock);
  }

  async waitForDestination(route) {
    const deadline = performance.now() + fluidityBudget().destinationWait;
    let destination = null;
    do {
      destination = this.resolveDestination(route);
      if (destination?.rect) return destination;
      await frame();
    } while (performance.now() < deadline);
    return this.resolveDestination(route);
  }

  async arrive({ from, to, serial } = {}) {
    if (!this.active || Number(serial || 0) !== this.serial) return null;
    await frame();
    await frame();
    this.destination = await this.waitForDestination(String(to || this.route));
    const destinationRect = this.destination?.rect;
    if (!destinationRect) {
      this.finishImmediately('no-destination');
      return this.status();
    }

    document.documentElement.classList.remove('db525-route-departing');
    document.documentElement.classList.add('db525-route-arriving');
    this.setState('arrival', { from, to, serial:this.serial, destination:this.destination.kind });

    const destination = { x:destinationRect.x, y:destinationRect.y };
    const start = this.currentPoint || this.gatewayFor(this.route);
    const dx = destination.x-start.x;
    const dy = destination.y-start.y;
    const curve = clamp(Math.hypot(dx,dy)*0.12, 18, 52) * (dx >= 0 ? 1 : -1);
    const arc = {
      x:start.x + dx*.46 - curve,
      y:start.y + dy*.38 - clamp(Math.abs(dx)*.08, 8, 34)
    };
    const approach = {
      x:start.x + dx*.82 + curve*.18,
      y:start.y + dy*.83
    };
    const destinationSize = Math.max(destinationRect.width,destinationRect.height);
    this.ensureMirrorResolution(Math.max(this.size, destinationSize));
    this.paintMirror(performance.now(), true);
    const targetScale = clamp(destinationSize/this.size, .18, 7.5);
    const budget = fluidityBudget();
    const duration = budget.arrival;
    await Promise.all([
      this.movePath([arc,approach,destination], duration, 'cubic-bezier(.2,.82,.18,1)'),
      this.scaleBody(targetScale, duration, 'cubic-bezier(.2,.82,.18,1)', true)
    ]);
    this.igniteAt(destination, 1.12);
    this.setState('settle', { to, serial:this.serial, destination:this.destination.kind });
    await this.animateNode(this.body, [
      { opacity:1, filter:'brightness(1.08)' },
      { opacity:.98, filter:'brightness(1.22)' },
      { opacity:0, filter:'brightness(1.08)' }
    ], { duration:budget.settle, easing:'ease-out' }, { opacity:'0' });
    this.finishImmediately('complete');
    return this.status();
  }

  async recover({ from, serial } = {}) {
    if (!this.active || Number(serial || 0) !== this.serial) return null;
    this.setState('recovery', { from, serial:this.serial });
    const target = this.sourceRect
      ? { x:this.sourceRect.x, y:this.sourceRect.y }
      : { x:viewport().width/2, y:viewport().height/2 };
    await Promise.all([
      this.movePath([target], reducedMotion() ? 72 : 180, 'cubic-bezier(.3,.7,.2,1)'),
      this.scaleBody(1, reducedMotion() ? 72 : 180, 'cubic-bezier(.3,.7,.2,1)')
    ]);
    this.finishImmediately('recovered');
    return this.status();
  }

  finishImmediately(reason = 'complete') {
    this.animations.forEach(animation => {
      try { animation.cancel(); } catch {}
    });
    this.animations.clear();
    cancelAnimationFrame(this.paintFrame);
    this.paintFrame = 0;
    this.active = false;
    this.root.hidden = true;
    this.body.style.opacity = '';
    this.body.style.filter = '';
    this.body.style.transform = '';
    this.traveler.style.transform = '';
    this.root.style.removeProperty('--db525-plume-rotation');
    document.documentElement.classList.remove(HIDDEN_CLASS, 'db525-route-departing', 'db525-route-arriving');
    delete document.documentElement.dataset.orbDestination;
    delete document.documentElement.dataset.orbDirection;
    this.setState('rest', { reason });
    this.core?.adoptProjections?.();
  }

  status() {
    return Object.freeze({
      version:VERSION,
      engine:'OrbIOSJourneyCoreV525',
      state:this.state,
      active:this.active,
      route:this.route,
      onePhysicalOrb:true,
      temporaryVisualMirror:true,
      independentOrbEngine:false,
      sameUniverse:true,
      routeCurtain:false,
      sharedElementNavigation:true,
      iosSpatialPhases:['lift','flight','arrival','settle'],
      universeTrailResponse:true,
      physicalTouchMotion:false,
      webVibration:false,
      nativeHapticsOnly:true,
      reducedMotionSupported:true,
      fluidityProfile:fluidityBudget().profile,
      navigationBudgetMs:Object.freeze({
        lift:fluidityBudget().lift,
        flight:fluidityBudget().flight,
        arrival:fluidityBudget().arrival,
        settle:fluidityBudget().settle
      }),
      mirrorFps:fluidityBudget().mirrorFps,
      fallbackPresence:Boolean(this.fallbackPresence?.isConnected),
      mirrorPixels:this.canvas ? { width:this.canvas.width, height:this.canvas.height } : null
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.finishImmediately('destroy');
    this.abort.abort();
    this.root?.remove();
    this.fallbackPresence?.remove();
    document.documentElement.removeAttribute('data-orb-ios-journey');
    document.documentElement.removeAttribute('data-orb-journey-state');
    delete globalThis[MARK];
  }
}

export function createOrbIOSJourneyCoreV525(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const engine = new OrbIOSJourneyCoreV525(options);
  globalThis[MARK] = engine;
  return engine;
}
