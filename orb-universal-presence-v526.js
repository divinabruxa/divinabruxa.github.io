/* DIVINA BRUXA — ORBOS · PRESENÇA UNIVERSAL V526 · REGISTRO VIVO V535
   A única Orbe física ganha um pouso semântico em cada realidade. Cada pouso é
   somente uma janela Retina do canvas vivo V501: nenhum novo motor, universo,
   estado de Tarot ou loop permanente é criado aqui.
*/

import { orbPresenceProfilesV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 526;
const MARK = Symbol.for('divina.orb.universal.presence.v526');
const STYLE_ID = 'divinaOrbUniversalPresenceV526Styles';
const STYLE_HREF = './orb-universal-presence-v526.css?v=526';
const CREATED_ATTR = 'data-orb-presence-created-v526';

const PROFILES = orbPresenceProfilesV535();

const ROUTES = Object.freeze(Object.keys(PROFILES));
const frame = task => requestAnimationFrame(task);
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

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
  link.dataset.orbUniversalPresenceStyle = 'true';
  document.head.append(link);
  return link;
}

function routeNow() {
  return String(
    document.body?.dataset?.screen ||
    document.querySelector('.screen.active,[data-screen].active')?.id ||
    location.hash ||
    'home'
  ).replace(/^#/,'').toLowerCase();
}

function placeAfter(reference, node) {
  if (!reference?.parentNode) return false;
  reference.parentNode.insertBefore(node, reference.nextSibling);
  return true;
}

function pointFor(node) {
  const rect = node?.getBoundingClientRect?.();
  const width = Math.max(1, globalThis.visualViewport?.width || document.documentElement.clientWidth || innerWidth);
  const height = Math.max(1, globalThis.visualViewport?.height || document.documentElement.clientHeight || innerHeight);
  return rect?.width && rect?.height
    ? {
        x:clamp((rect.left + rect.width/2) / width, 0, 1),
        y:clamp((rect.top + rect.height/2) / height, 0, 1)
      }
    : { x:0.5, y:0.36 };
}

export class OrbUniversalPresenceV526 {
  constructor({ core = null, universe = null, journey = null } = {}) {
    this.version = VERSION;
    this.core = core;
    this.universe = universe;
    this.journey = journey;
    this.abort = new AbortController();
    this.anchors = new Map();
    this.createdLandings = new Set();
    this.existingSnapshots = new WeakMap();
    this.awakeTimers = new WeakMap();
    this.ensureFrame = 0;
    this.destroyed = false;

    installStyles();
    this.createLiveRegion();
    this.ensureAll();
    this.bind();
    this.observe();
    this.activate(routeNow(), 'boot');

    document.documentElement.dataset.orbUniversalPresence = 'v526';
    emit('divina:orb-universal-presence-ready', this.status());
  }

  createLiveRegion() {
    let region = document.getElementById('divinaOrbPresenceLiveV526');
    if (!region) {
      region = document.createElement('div');
      region.id = 'divinaOrbPresenceLiveV526';
      region.className = 'db526-orb-presence-live';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.append(region);
    }
    this.live = region;
  }

  createAnchor(route, profile) {
    const landing = document.createElement('div');
    landing.className = 'db526-orb-landing';
    landing.dataset.route = route;
    landing.dataset.orbLandingV526 = 'true';
    landing.setAttribute(CREATED_ATTR, 'true');
    landing.setAttribute('aria-hidden', 'false');

    const anchor = document.createElement('button');
    anchor.type = 'button';
    anchor.className = 'db526-orb-presence';
    anchor.dataset.route = route;
    anchor.dataset.orbSurface = `presence-${route}`;
    anchor.dataset.orbProjection = 'presence-v526';
    anchor.dataset.orbProjectionQuality = 'retina';
    anchor.dataset.orbJourneyAnchor = 'v526';
    anchor.dataset.orbPresenceV526 = 'true';
    anchor.setAttribute('aria-label', profile.aria);
    anchor.innerHTML = `
      <span class="db526-orb-presence__mist" aria-hidden="true"></span>
      <span class="db526-orb-presence__fallback" aria-hidden="true"></span>
      <span class="db526-orb-presence__glass" aria-hidden="true"></span>`;
    landing.append(anchor);
    this.createdLandings.add(landing);
    return { landing, anchor };
  }

  enhanceExisting(route, profile, node) {
    if (!this.existingSnapshots.has(node)) {
      this.existingSnapshots.set(node, {
        role:node.getAttribute('role'),
        tabindex:node.getAttribute('tabindex'),
        ariaLabel:node.getAttribute('aria-label')
      });
    }
    node.classList.add('db526-orb-presence','db526-orb-presence--existing');
    node.dataset.route = route;
    node.dataset.orbSurface = `presence-${route}`;
    node.dataset.orbProjection = 'presence-v526';
    node.dataset.orbProjectionQuality = 'retina';
    node.dataset.orbJourneyAnchor = 'v526';
    node.dataset.orbPresenceV526 = 'true';
    node.setAttribute('role','button');
    node.setAttribute('tabindex','0');
    node.setAttribute('aria-label',profile.aria);
    if (!node.querySelector(':scope > .db526-orb-presence__mist')) {
      const mist = document.createElement('span');
      mist.className = 'db526-orb-presence__mist';
      mist.setAttribute('aria-hidden','true');
      node.append(mist);
    }
    return node;
  }

  insertLanding(screen, profile, landing) {
    const before = profile.before ? screen.querySelector(profile.before) : null;
    if (before?.parentNode) {
      before.parentNode.insertBefore(landing, before);
      return true;
    }
    const after = profile.after ? screen.querySelector(profile.after) : null;
    if (after && placeAfter(after, landing)) return true;
    const intro = screen.querySelector('.db-page-world__intro,.lead');
    if (intro && placeAfter(intro, landing)) return true;
    const heading = screen.querySelector('h1,h2');
    if (heading && placeAfter(heading, landing)) return true;
    screen.prepend(landing);
    return true;
  }

  ensureRoute(route) {
    const profile = PROFILES[route];
    const screen = document.getElementById(route);
    if (!profile || !screen) return null;

    const known = this.anchors.get(route);
    if (known?.isConnected) return known;

    let anchor = null;
    const existing = profile.existing ? screen.querySelector(profile.existing) : null;
    if (existing) {
      anchor = this.enhanceExisting(route, profile, existing);
    } else {
      const prior = screen.querySelector(`[data-orb-presence-v526="true"]`);
      if (prior) anchor = prior;
      else {
        const created = this.createAnchor(route, profile);
        this.insertLanding(screen, profile, created.landing);
        anchor = created.anchor;
      }
    }

    screen.dataset.orbPresence = 'v526';
    this.anchors.set(route, anchor);
    this.core?.adoptProjections?.(anchor);
    emit('divina:orb-presence-created', { route, name:profile.name, reusedExisting:Boolean(existing) });
    return anchor;
  }

  ensureAll() {
    if (this.destroyed) return [];
    ROUTES.forEach(route => this.ensureRoute(route));
    this.core?.adoptProjections?.();
    return [...this.anchors.entries()].filter(([,node]) => node?.isConnected);
  }

  scheduleEnsure() {
    cancelAnimationFrame(this.ensureFrame);
    this.ensureFrame = frame(() => {
      this.ensureFrame = 0;
      this.ensureAll();
      this.activate(routeNow(), 'dom-settle');
    });
  }

  bind() {
    const { signal } = this.abort;
    const activateFromEvent = event => {
      const route = String(event.detail?.id || routeNow()).toLowerCase();
      this.ensureRoute(route);
      this.activate(route, event.type);
    };
    ['divina:route-ready','divina:page-ready']
      .forEach(type => document.addEventListener(type, activateFromEvent, { signal }));

    document.addEventListener('click', event => {
      const anchor = event.target?.closest?.('[data-orb-presence-v526="true"]');
      if (!anchor || !this.anchors.has(anchor.dataset.route)) return;
      this.awaken(anchor.dataset.route, anchor, event.detail === 0 ? 'keyboard' : 'touch');
    }, { signal });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const anchor = event.target?.closest?.('[data-orb-presence-v526="true"]');
      if (!anchor) return;
      if (anchor.matches?.('button,a,input,select,textarea')) return;
      event.preventDefault();
      anchor.click();
    }, { signal });

    document.addEventListener('divina:orb-ios-journey-state', event => {
      if (!['arrival','settle'].includes(event.detail?.state)) return;
      const route = String(event.detail?.to || event.detail?.route || routeNow()).toLowerCase();
      const anchor = this.ensureRoute(route);
      if (anchor) this.bloom(anchor, 'arrival');
    }, { signal });

    document.addEventListener('divina:supreme-orb-did-navigate', event => {
      const route = String(event.detail?.to || routeNow()).toLowerCase();
      this.activate(route, 'journey-complete');
    }, { signal });

    for (const type of ['divina:skin-change','divina:skin-applied','orbe:skin-change','skin:changed']) {
      document.addEventListener(type, event => this.core?.syncSkin?.(event), { signal });
    }
  }

  observe() {
    this.observer = new MutationObserver(records => {
      /* Uma realidade pode reconstruir o próprio conteúdo em duas etapas
         (remove agora, adiciona depois). Qualquer mutação estrutural confirma
         novamente o pouso, inclusive quando só houve remoção. */
      if (records.some(record => record.type === 'childList')) {
        this.scheduleEnsure();
      }
      if (records.some(record => record.type === 'attributes' && record.attributeName === 'data-screen')) {
        this.activate(routeNow(), 'screen-attribute');
      }
    });
    this.observer.observe(document.body, {
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['data-screen']
    });
  }

  activate(route, reason = 'activate') {
    const current = String(route || 'home').toLowerCase();
    for (const [id,anchor] of this.anchors) {
      const active = id === current;
      anchor.classList.toggle('is-current', active);
      anchor.closest?.('.db526-orb-landing')?.classList.toggle('is-current', active);
    }
    document.documentElement.dataset.orbPresenceRoute = current;
    emit('divina:orb-presence-route', {
      route:current,
      reason,
      hasDedicatedLanding:Boolean(this.anchors.get(current)?.isConnected),
      physicalHost:['home','tarot'].includes(current)
    });
  }

  bloom(anchor, kind = 'awake') {
    clearTimeout(this.awakeTimers.get(anchor));
    anchor.classList.remove('is-awake','is-arriving');
    void anchor.offsetWidth;
    anchor.classList.add(kind === 'arrival' ? 'is-arriving' : 'is-awake');
    const timer = setTimeout(() => {
      anchor.classList.remove('is-awake','is-arriving');
      this.awakeTimers.delete(anchor);
    }, reducedMotion() ? 100 : kind === 'arrival' ? 920 : 680);
    this.awakeTimers.set(anchor, timer);
  }

  awaken(route, anchor, source = 'touch') {
    const profile = PROFILES[route];
    if (!profile || !anchor) return false;
    const point = pointFor(anchor);
    this.universe?.ignite?.({ ...point, strength:0.88 });
    this.bloom(anchor, 'awake');
    if (this.live) this.live.textContent = `A Orbe despertou o universo de ${profile.name}.`;
    emit('divina:orb-presence-awake', { route, source, ...point });
    return true;
  }

  status() {
    const connected = [...this.anchors.entries()].filter(([,node]) => node?.isConnected);
    return Object.freeze({
      version:VERSION,
      engine:'OrbUniversalPresenceV526',
      currentRoute:routeNow(),
      physicalHosts:['home','tarot'],
      dedicatedProjectionRoutes:connected.map(([route]) => route),
      dedicatedProjectionCount:connected.length,
      expectedProjectionCount:ROUTES.length,
      complete:connected.length === ROUTES.length,
      onePhysicalOrb:true,
      independentOrbEngines:0,
      liveCanvasProjections:true,
      retinaProjectionRequested:true,
      permanentAnimationLoops:0,
      skinReactive:true,
      touchWakesUniverse:true,
      physicalTouchMotion:false,
      webVibration:false,
      reducedMotionSupported:true
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.abort.abort();
    this.observer?.disconnect();
    cancelAnimationFrame(this.ensureFrame);
    this.createdLandings.forEach(landing => landing.remove());
    for (const anchor of this.anchors.values()) {
      clearTimeout(this.awakeTimers.get(anchor));
      if (!anchor?.isConnected || anchor.closest?.(`[${CREATED_ATTR}]`)) continue;
      const snapshot = this.existingSnapshots.get(anchor);
      anchor.classList.remove('db526-orb-presence','db526-orb-presence--existing','is-current','is-awake','is-arriving');
      ['route','orbSurface','orbProjection','orbProjectionQuality','orbJourneyAnchor','orbPresenceV526']
        .forEach(key => delete anchor.dataset[key]);
      if (snapshot?.role == null) anchor.removeAttribute('role'); else anchor.setAttribute('role',snapshot.role);
      if (snapshot?.tabindex == null) anchor.removeAttribute('tabindex'); else anchor.setAttribute('tabindex',snapshot.tabindex);
      if (snapshot?.ariaLabel == null) anchor.removeAttribute('aria-label'); else anchor.setAttribute('aria-label',snapshot.ariaLabel);
      anchor.querySelector(':scope > .db526-orb-presence__mist')?.remove();
    }
    document.querySelectorAll('.screen[data-orb-presence="v526"]').forEach(screen => delete screen.dataset.orbPresence);
    this.live?.remove();
    delete document.documentElement.dataset.orbUniversalPresence;
    delete document.documentElement.dataset.orbPresenceRoute;
    delete globalThis[MARK];
  }
}

export function createOrbUniversalPresenceV526(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const presence = new OrbUniversalPresenceV526(options);
  globalThis[MARK] = presence;
  return presence;
}

export const ORB_UNIVERSAL_PRESENCE_ROUTES_V526 = ROUTES;
