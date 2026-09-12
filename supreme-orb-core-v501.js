/* DIVINA BRUXA — NÚCLEO DA ORBE SUPREMA V501 · FLUIDEZ V535
   Uma presença, um estado e um caminho para todos os mundos. O toque ilumina
   o interior sem deslocar o corpo; somente uma viagem de realidade autorizada
   conduz a própria presença visual da Orbe pelo mesmo universo contínuo.
   V535 elimina filas de toques e usa o Registro Vivo como fonte de rotas.
*/

import {
  WORLD_SIGNATURES_V535,
  normalizeWorldRouteV535,
  worldSignatureV535
} from './world-truth-registry-v535.js?v=535';

const VERSION = 501;
const MARK = Symbol.for('divina.supreme.orb.v501');
const STYLE_ID = 'divinaSupremeOrbCoreV501Styles';
const STYLE_HREF = './supreme-orb-core-v501.css?v=501';
const PROJECTION_SELECTOR = [
  '[data-orb-projection]',
  '[data-mini-orb]',
  '.mini-orb',
  '.dock-orb .orb',
  '.menu-center-orb',
  '.brand__mark'
].join(',');

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';

function normalizeRoute(value) {
  return normalizeWorldRouteV535(value, 'home');
}

function currentRoute() {
  return normalizeRoute(
    document.body?.dataset?.screen ||
    document.querySelector('.screen.active,[data-screen].active')?.id ||
    location.hash ||
    'home'
  );
}

function signatureFor(route) {
  return worldSignatureV535(route);
}

function emit(type, detail = {}) {
  document.dispatchEvent(new CustomEvent(type, {
    detail:{ version:VERSION, ...detail }
  }));
}

function installStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) return existing;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.supremeOrbStyle = 'true';
  document.head.append(link);
  return link;
}

function callFirst(target, names, ...args) {
  for (const name of names) {
    if (typeof target?.[name] !== 'function') continue;
    try { return target[name](...args); }
    catch (error) {
      console.info(`[Divina] comando opcional da Orbe não respondeu: ${name}`, error);
      return null;
    }
  }
  return null;
}

function createTransitionLayer() {
  let layer = document.getElementById('dbSupremeOrbTransitionV501');
  if (layer) return layer;
  layer = document.createElement('div');
  layer.id = 'dbSupremeOrbTransitionV501';
  layer.className = 'db-supreme-orb-transition';
  layer.dataset.direction = 'out';
  layer.dataset.tone = 'cosmos';
  layer.setAttribute('aria-hidden', 'true');

  const core = document.createElement('span');
  core.className = 'db-supreme-orb-transition__core';
  layer.append(core);

  const particles = document.createElement('span');
  particles.className = 'db-supreme-orb-transition__particles';
  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement('i');
    spark.style.setProperty('--spark-index', String(index));
    spark.style.setProperty('--spark-angle', `${index * 137.508}deg`);
    spark.style.setProperty('--spark-delay', `${(index % 6) * 12}ms`);
    particles.append(spark);
  }
  layer.append(particles);
  document.body?.append(layer);
  return layer;
}

export class SupremeOrbCoreV501 {
  constructor({ canvas, renderer, motion, go, loading } = {}) {
    this.version = VERSION;
    this.canvas = canvas || document.querySelector('#orbCanvas');
    this.orb = this.canvas?.closest?.('.orb,[data-orb-root]') || this.canvas?.parentElement || null;
    this.renderer = renderer || null;
    this.motion = motion || null;
    this.commit = typeof go === 'function' ? go : null;
    this.loading = loading || null;
    this.abort = new AbortController();
    this.route = currentRoute();
    this.mode = signatureFor(this.route).mode;
    this.direction = signatureFor(this.route).direction;
    this.energy = 0.18;
    this.sequence = 0;
    this.pending = Promise.resolve(null);
    this.pendingRoute = null;
    this.navigationActive = false;
    this.coalescedNavigations = 0;
    this.pulseTimer = 0;
    this.transitionTimer = 0;
    this.projectionNodes = new Set();
    this.projectionContexts = new WeakMap();
    this.projectionFrame = 0;
    this.projectionLoop = 0;
    this.projectionLastPaint = 0;
    this.destroyed = false;
    this.claimedHost = null;
    this.journeyEngine = null;

    installStyles();
    this.layer = createTransitionLayer();
    this.homeParent = this.orb?.parentNode || null;
    this.homeMarker = this.orb ? document.createComment('divina-orbe-suprema-home-v501') : null;
    if (this.orb && this.homeParent && this.homeMarker) {
      this.homeParent.insertBefore(this.homeMarker, this.orb);
    }

    this.adoptLivingOrb();
    this.adoptProjections();
    this.startProjectionBridge();
    this.bind();
    this.observe();
    this.setMode(this.mode, { route:this.route, reason:'boot' });

    document.documentElement.dataset.supremeOrb = 'v501';
    emit('divina:supreme-orb-ready', this.snapshot());
  }

  adoptLivingOrb() {
    if (!this.orb) return;
    this.orb.dataset.supremeOrb = 'living';
    this.orb.dataset.supremeOrbVersion = String(VERSION);
    this.orb.setAttribute('draggable', 'false');
    if (!this.orb.matches('button,a,[role="button"]')) {
      this.orb.setAttribute('role', 'button');
      if (!this.orb.hasAttribute('tabindex')) this.orb.tabIndex = 0;
    }
    if (!this.orb.getAttribute('aria-label')) {
      this.orb.setAttribute('aria-label', 'Orbe das Realidades');
    }
    this.canvas?.setAttribute?.('aria-hidden', 'true');
  }

  scheduleProjectionAdoption(root = document) {
    cancelAnimationFrame(this.projectionFrame);
    this.projectionFrame = requestAnimationFrame(() => this.adoptProjections(root));
  }

  adoptProjections(root = document) {
    const candidates = [];
    if (root?.matches?.(PROJECTION_SELECTOR)) candidates.push(root);
    root?.querySelectorAll?.(PROJECTION_SELECTOR).forEach(node => candidates.push(node));
    for (const node of candidates) {
      if (!node || node === this.orb || this.orb?.contains(node)) continue;
      node.dataset.orbProjectionV501 = 'true';
      node.setAttribute('draggable', 'false');
      let mirror = node.querySelector?.(':scope > canvas.db-supreme-orb-projection-canvas');
      if (!mirror) {
        mirror = document.createElement('canvas');
        mirror.className = 'db-supreme-orb-projection-canvas';
        mirror.setAttribute('aria-hidden', 'true');
        node.prepend(mirror);
      }
      if (!this.projectionContexts.has(mirror)) {
        const context = mirror.getContext?.('2d', { alpha:true, desynchronized:true });
        if (context) this.projectionContexts.set(mirror, context);
      }
      this.projectionNodes.add(node);
    }
    this.syncSkin();
    return this.projections();
  }

  projections() {
    for (const node of this.projectionNodes) {
      if (!node.isConnected) this.projectionNodes.delete(node);
    }
    return [...this.projectionNodes];
  }

  startProjectionBridge() {
    if (this.projectionLoop || !this.canvas) return;
    const paint = now => {
      if (this.destroyed) return;
      const navigationCritical = this.navigationActive
        || document.documentElement.dataset.orbNavigationState === 'active';
      const fps = navigationCritical ? (constrained() ? 5 : 8) : reducedMotion() ? 5 : constrained() ? 12 : 24;
      if (!document.hidden && now - this.projectionLastPaint >= 1000 / fps) {
        this.projectionLastPaint = now;
        this.paintProjections();
      }
      this.projectionLoop = requestAnimationFrame(paint);
    };
    this.projectionLoop = requestAnimationFrame(paint);
  }

  paintProjections() {
    if (!this.canvas?.width || !this.canvas?.height) return;
    const deviceRatio = globalThis.devicePixelRatio || 1;
    const viewportWidth = document.documentElement.clientWidth || innerWidth;
    const viewportHeight = document.documentElement.clientHeight || innerHeight;
    for (const node of this.projections()) {
      const mirror = node.querySelector?.(':scope > canvas.db-supreme-orb-projection-canvas');
      const context = this.projectionContexts.get(mirror);
      const rect = node.getBoundingClientRect?.();
      if (!mirror || !context || !rect?.width || !rect?.height) continue;
      if (rect.bottom < -4 || rect.right < -4 || rect.top > viewportHeight + 4 || rect.left > viewportWidth + 4) continue;
      const retina = node.dataset.orbProjectionQuality === 'retina';
      const ratio = Math.min(deviceRatio, retina ? (constrained() ? 1.75 : 2.25) : (constrained() ? 1 : 1.5));
      const maximum = retina ? (constrained() ? 224 : 288) : 220;
      const width = Math.max(2, Math.min(maximum, Math.round(rect.width * ratio)));
      const height = Math.max(2, Math.min(maximum, Math.round(rect.height * ratio)));
      if (mirror.width !== width || mirror.height !== height) {
        mirror.width = width;
        mirror.height = height;
      }
      try {
        context.clearRect(0, 0, width, height);
        context.drawImage(this.canvas, 0, 0, width, height);
        node.dataset.orbProjectionLive = 'true';
        node.dataset.orbProjectionDensity = retina ? 'retina-v526' : 'balanced-v526';
      } catch {
        delete node.dataset.orbProjectionLive;
      }
    }
  }

  syncSkin(explicitSkin) {
    const skin = String(
      explicitSkin?.detail?.skin ||
      explicitSkin?.detail?.id ||
      explicitSkin ||
      this.orb?.dataset?.skin ||
      document.documentElement.dataset.orbSkin ||
      ''
    ).trim();

    const sourceStyle = this.orb ? getComputedStyle(this.orb) : null;
    const variables = [
      '--p','--s','--a','--core','--dark',
      '--orb-primary','--orb-secondary','--orb-glow','--orb-mid','--orb-bright',
      '--orb-luminance'
    ];

    for (const node of this.projections()) {
      if (skin) node.dataset.skin = skin;
      if (!sourceStyle) continue;
      for (const variable of variables) {
        const value = sourceStyle.getPropertyValue(variable).trim();
        if (value) node.style.setProperty(variable, value);
      }
    }

    if (skin) emit('divina:supreme-orb-skin-synced', { skin });
    return skin || null;
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('pointerdown', event => {
      const target = event.target?.closest?.('[data-supreme-orb], [data-orb-projection-v501], [data-go]');
      if (!target) return;

      const destination = target.closest?.('[data-go]')?.dataset?.go;
      if (destination) this.prime(destination, { source:'pointer-intent', target });

      if (target.matches?.('[data-supreme-orb], [data-orb-projection-v501]') ||
          target.closest?.('[data-supreme-orb], [data-orb-projection-v501]')) {
        this.pulse('press', this.pointFromEvent(event));
      }
    }, { capture:true, passive:true, signal });

    document.addEventListener('pointerup', event => {
      if (!event.target?.closest?.('[data-supreme-orb], [data-orb-projection-v501]')) return;
      this.pulse('release', this.pointFromEvent(event));
    }, { capture:true, passive:true, signal });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (!event.target?.closest?.('[data-supreme-orb], [data-orb-projection-v501]')) return;
      this.pulse('keyboard', { x:0.5, y:0.5, intensity:0.82 });
    }, { signal });

    document.addEventListener('dragstart', event => {
      if (event.target?.closest?.('[data-supreme-orb], [data-orb-projection-v501]')) {
        event.preventDefault();
      }
    }, { capture:true, signal });

    document.addEventListener('divina:route-ready', event => {
      this.settleRoute(event.detail?.id, 'route-ready');
    }, { signal });

    document.addEventListener('divina:page-ready', event => {
      this.settleRoute(event.detail?.id, 'page-ready');
    }, { signal });

    document.addEventListener('divina:page-loading', event => {
      const route = normalizeRoute(event.detail?.id);
      this.setMode('transition', { route, reason:'page-loading' });
    }, { signal });

    document.addEventListener('divina:page-error', event => {
      this.setMode(signatureFor(this.route).mode, { route:this.route, reason:'page-error' });
      this.hideTransition();
      emit('divina:supreme-orb-recovered', { failedRoute:normalizeRoute(event.detail?.id) });
    }, { signal });

    for (const eventName of ['divina:skin-change','orbe:skin-change','skin:changed']) {
      document.addEventListener(eventName, event => this.syncSkin(event), { signal });
    }

    globalThis.addEventListener?.('storage', event => {
      if (!/skin|orb/i.test(event.key || '')) return;
      this.syncSkin(event.newValue || '');
    }, { signal });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) callFirst(this.renderer, ['pause','sleep','suspend']);
      else callFirst(this.renderer, ['resume','wake','start']);
    }, { signal });
  }

  observe() {
    const body = document.body;
    if (!body) return;
    this.observer = new MutationObserver(mutations => {
      let needsProjectionSync = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) needsProjectionSync = true;
        if (mutation.type === 'attributes' && mutation.target === this.orb) this.syncSkin();
      }
      if (needsProjectionSync) this.scheduleProjectionAdoption(body);
    });
    this.observer.observe(body, {
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['data-skin']
    });
  }

  pointFromEvent(event) {
    const node = event.target?.closest?.('[data-supreme-orb], [data-orb-projection-v501]') || this.orb;
    const rect = node?.getBoundingClientRect?.();
    if (!rect?.width || !rect?.height) return { x:0.5, y:0.5, intensity:0.72 };
    return {
      x:clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y:clamp((event.clientY - rect.top) / rect.height, 0, 1),
      intensity:0.82
    };
  }

  pulse(kind = 'pulse', detail = {}) {
    if (this.destroyed) return null;
    const intensity = clamp(Number(detail.intensity ?? (kind === 'press' ? 0.92 : 0.76)), 0, 1.4);
    const physicalMotion = detail.physicalMotion === true;
    const payload = {
      kind,
      x:clamp(Number(detail.x ?? 0.5), 0, 1),
      y:clamp(Number(detail.y ?? 0.5), 0, 1),
      intensity,
      route:this.route,
      mode:this.mode,
      physicalMotion
    };
    this.energy = Math.max(this.energy, intensity);

    this.orb?.dispatchEvent?.(new CustomEvent('db:orb-pulse', { detail:payload }));
    callFirst(this.renderer, ['pulse','impact','energize'], payload);
    if (physicalMotion) callFirst(this.motion, ['pulse','impact','impulse'], payload);

    const html = document.documentElement;
    html.dataset.supremeOrbEnergy = kind;
    html.classList.add('db-supreme-orb-active');
    clearTimeout(this.pulseTimer);
    this.pulseTimer = setTimeout(() => {
      this.energy = 0.18;
      html.classList.remove('db-supreme-orb-active');
      delete html.dataset.supremeOrbEnergy;
    }, reducedMotion() ? 90 : 620);

    emit('divina:supreme-orb-pulse', payload);
    return payload;
  }

  prime(rawRoute, { source = 'intent', target = null } = {}) {
    const route = normalizeRoute(rawRoute);
    const signature = signatureFor(route);
    this.direction = signature.direction;
    document.documentElement.dataset.orbDestination = route;
    document.documentElement.dataset.orbDirection = signature.direction;
    this.positionTransitionOrigin(target || this.orb);
    this.pulse('intent', { intensity:0.62 });
    emit('divina:supreme-orb-intent', { route, source, ...signature });
    return { route, ...signature };
  }

  navigate(rawRoute, options = {}) {
    const route = normalizeRoute(rawRoute);
    if (!this.commit || this.destroyed) return Promise.resolve(null);
    if (!this.pendingRoute && route === currentRoute() && options?.force !== true) {
      this.settleRoute(route, 'already-present-v535');
      this.pulse('present', { intensity:0.42 });
      emit('divina:supreme-orb-navigation-reused', { route, source:options?.source || 'orbe-navigation' });
      // Uma escolha da rota atual dentro do menu fecha o menu sem iniciar uma
      // segunda viagem nem criar uma fila invisível.
      if (document.documentElement.dataset.menuState !== 'closed') {
        return Promise.resolve(this.commit(route));
      }
      return Promise.resolve(route);
    }
    if (this.pendingRoute) {
      this.coalescedNavigations += 1;
      emit('divina:supreme-orb-navigation-coalesced', {
        activeRoute:this.pendingRoute,
        requestedRoute:route,
        source:options?.source || 'orbe-navigation'
      });
      return this.pending;
    }

    const serial = ++this.sequence;
    this.pendingRoute = route;
    this.navigationActive = true;
    document.documentElement.dataset.orbNavigationState = 'active';
    document.documentElement.dataset.orbNavigationAuthority = 'v535';
    this.pending = Promise.resolve()
      .then(() => this.performNavigation(route, options, serial))
      .finally(() => {
        if (this.sequence === serial) {
          this.pendingRoute = null;
          this.navigationActive = false;
          delete document.documentElement.dataset.orbNavigationState;
        }
      });
    return this.pending;
  }

  async performNavigation(route, options, serial) {
    const from = currentRoute();
    const signature = this.prime(route, {
      source:options?.source || 'orbe-navigation',
      target:options?.target || null
    });

    const journey = this.journeyEngine;
    let spatialJourneyActive = typeof journey?.depart === 'function' && typeof journey?.arrive === 'function';

    this.setMode('transition', { route, from, reason:'navigate' });
    if (!spatialJourneyActive) this.showTransition(signature, serial);
    emit('divina:supreme-orb-will-navigate', {
      from,
      to:route,
      signature,
      source:options?.source || 'orbe-navigation'
    });

    if (spatialJourneyActive) {
      try {
        await journey.depart({
          from,
          to:route,
          signature,
          serial,
          origin:options?.target || null,
          source:options?.source || 'orbe-navigation'
        });
      } catch (journeyError) {
        spatialJourneyActive = false;
        journey.finishImmediately?.('safe-fallback');
        this.showTransition(signature, serial);
        console.info('[Divina] a navegação continuou pelo portal seguro', journeyError);
      }
    }
    if (!spatialJourneyActive && !reducedMotion()) await wait(constrained() ? 42 : 72);

    try {
      const result = await Promise.resolve(this.commit(route));
      this.settleRoute(route, 'navigate-complete');
      if (spatialJourneyActive) {
        try {
          await journey.arrive({ from, to:route, signature, serial, result });
        } catch (journeyError) {
          journey.finishImmediately?.('arrival-safe-fallback');
          console.info('[Divina] a realidade abriu e a Orbe reassentou em modo seguro', journeyError);
        }
      } else if (!reducedMotion()) {
        await wait(constrained() ? 130 : 260);
      }
      if (this.sequence === serial) this.hideTransition();
      emit('divina:supreme-orb-did-navigate', { from, to:route, signature });
      return result;
    } catch (error) {
      this.route = from;
      this.setMode(signatureFor(from).mode, { route:from, reason:'navigate-error' });
      if (spatialJourneyActive) {
        try { await journey.recover?.({ from, to:route, signature, serial, error }); }
        catch (recoveryError) {
          console.info('[Divina] a viagem da Orbe encerrou em modo seguro', recoveryError);
        }
      }
      this.hideTransition();
      emit('divina:supreme-orb-navigation-error', { from, to:route, recoverable:true });
      throw error;
    }
  }

  setJourneyEngine(engine) {
    if (engine === this.journeyEngine) return engine;
    this.journeyEngine?.detach?.(this);
    this.journeyEngine = engine || null;
    this.journeyEngine?.attach?.(this);
    emit('divina:supreme-orb-journey-engine', {
      active:Boolean(this.journeyEngine),
      journeyVersion:this.journeyEngine?.version || null
    });
    return this.journeyEngine;
  }

  positionTransitionOrigin(node = this.orb) {
    const rect = node?.getBoundingClientRect?.();
    const x = rect?.width ? rect.left + rect.width / 2 : innerWidth / 2;
    const y = rect?.height ? rect.top + rect.height / 2 : innerHeight / 2;
    this.layer?.style.setProperty('--orb-origin-x', `${Math.round(x)}px`);
    this.layer?.style.setProperty('--orb-origin-y', `${Math.round(y)}px`);
  }

  showTransition(signature, serial) {
    if (!this.layer) return;
    clearTimeout(this.transitionTimer);
    this.layer.classList.remove('is-awake');
    this.layer.dataset.direction = signature.direction;
    this.layer.dataset.tone = signature.tone;
    this.layer.dataset.sequence = String(serial);
    this.layer.hidden = false;
    void this.layer.offsetWidth;
    requestAnimationFrame(() => this.layer?.classList.add('is-awake'));
  }

  hideTransition() {
    if (!this.layer) return;
    this.layer.classList.remove('is-awake');
    clearTimeout(this.transitionTimer);
    this.transitionTimer = setTimeout(() => {
      if (this.layer) this.layer.hidden = true;
    }, reducedMotion() ? 20 : 340);
    delete document.documentElement.dataset.orbDestination;
    delete document.documentElement.dataset.orbDirection;
  }

  settleRoute(rawRoute, reason = 'settle') {
    const route = normalizeRoute(rawRoute || currentRoute());
    const signature = signatureFor(route);
    this.route = route;
    this.direction = signature.direction;
    this.setMode(signature.mode, { route, reason });
    return signature;
  }

  setMode(mode, detail = {}) {
    const next = String(mode || 'home');
    const previous = this.mode;
    this.mode = next;
    document.documentElement.dataset.supremeOrbMode = next;
    if (this.orb) this.orb.dataset.supremeOrbMode = next;
    callFirst(this.renderer, ['setMode','setState','transitionTo'], next, detail);
    callFirst(this.motion, ['setMode','setState','transitionTo'], next, detail);
    if (previous !== next) emit('divina:supreme-orb-mode', { previous, mode:next, ...detail });
    return next;
  }

  claim(host, { mode, ariaLabel } = {}) {
    const target = typeof host === 'string' ? document.querySelector(host) : host;
    if (!target || !this.orb) return () => {};
    if (target.contains(this.orb)) return () => this.returnHome();

    this.claimedHost = target;
    target.dataset.supremeOrbHost = 'active';
    this.orb.classList.add('db-supreme-orb--traveling');
    if (ariaLabel) this.orb.setAttribute('aria-label', ariaLabel);
    target.append(this.orb);
    if (mode) this.setMode(mode, { route:this.route, reason:'claim' });
    callFirst(this.renderer, ['resize','refresh']);
    emit('divina:supreme-orb-claimed', { mode:this.mode, host:target.id || null });
    return () => this.returnHome();
  }

  returnHome() {
    if (!this.orb) return false;
    if (this.homeMarker?.parentNode) {
      this.homeMarker.parentNode.insertBefore(this.orb, this.homeMarker.nextSibling);
    } else if (this.homeParent) {
      this.homeParent.append(this.orb);
    } else {
      return false;
    }

    if (this.claimedHost) delete this.claimedHost.dataset.supremeOrbHost;
    this.claimedHost = null;
    this.orb.classList.remove('db-supreme-orb--traveling');
    this.orb.setAttribute('aria-label', 'Orbe das Realidades');
    callFirst(this.renderer, ['resize','refresh']);
    this.settleRoute('home', 'return-home');
    emit('divina:supreme-orb-returned-home', { route:'home' });
    return true;
  }

  snapshot() {
    let renderer = null;
    let motion = null;
    let journey = null;
    try { renderer = this.renderer?.snapshot?.() || null; } catch {}
    try { motion = this.motion?.snapshot?.() || null; } catch {}
    try { journey = this.journeyEngine?.status?.() || null; } catch {}
    return {
      version:VERSION,
      route:this.route,
      mode:this.mode,
      direction:this.direction,
      energy:this.energy,
      skin:this.orb?.dataset?.skin || document.documentElement.dataset.orbSkin || null,
      livingOrbConnected:Boolean(this.orb?.isConnected),
      claimed:Boolean(this.claimedHost),
      projections:this.projections().length,
      retinaProjections:this.projections().filter(node => node.dataset.orbProjectionQuality === 'retina').length,
      projectionCadence:constrained() ? 12 : 24,
      navigationActive:this.navigationActive,
      navigationAuthority:'v535-single-flight',
      coalescedNavigations:this.coalescedNavigations,
      renderer,
      motion,
      journey,
      oneLivingOrb:true,
      physicalTouchMotion:false,
      spatialRouteTravel:Boolean(this.journeyEngine),
      routeCurtain:false,
      universeReceivesTouchEnergy:true
    };
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.pulseTimer);
    clearTimeout(this.transitionTimer);
    cancelAnimationFrame(this.projectionFrame);
    cancelAnimationFrame(this.projectionLoop);
    this.abort.abort();
    this.observer?.disconnect();
    this.journeyEngine?.destroy?.();
    this.journeyEngine = null;
    this.layer?.remove();
    this.returnHome();
    document.documentElement.removeAttribute('data-supreme-orb');
    document.documentElement.removeAttribute('data-supreme-orb-mode');
    document.documentElement.removeAttribute('data-orb-navigation-state');
    document.documentElement.removeAttribute('data-orb-navigation-authority');
    delete globalThis[MARK];
  }
}

export function createSupremeOrbCoreV501(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const core = new SupremeOrbCoreV501(options);
  globalThis[MARK] = core;
  return core;
}

export const SUPREME_ORB_SIGNATURES_V501 = WORLD_SIGNATURES_V535;
