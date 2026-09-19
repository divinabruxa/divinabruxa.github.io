/* DIVINA BRUXA — WORK12 · MACROETAPA 8 · REALIDADES COMO CÂMARAS V596
   Escola, Diário, Consultas e Loja deixam de chegar como páginas empilhadas.
   A única Orbe permanece no limiar; a profundidade nasce somente após convite.

   Este núcleo não substitui nenhum motor. Ele governa presença, ordem e
   silêncio sobre as realidades já verdadeiras. */

const VERSION = 596;
const INSTANCE = Symbol.for('divina.work12.reality.chambers.v596');
const STYLE_ID = 'divinaRealityChambersV596';
const STYLE_HREF = './reality-chambers-v596.css?v=596-work12-chambers';
const ROUTES = Object.freeze(['school','journal','consultations','store']);
const TRAVEL_STATES = new Set(['DEPART','TRAVEL','ARRIVE']);

const PROFILES = Object.freeze({
  school:Object.freeze({ label:'Escola', intention:'aprender', entry:'#schoolApp' }),
  journal:Object.freeze({ label:'Diário', intention:'escutar', entry:'#journalApp' }),
  consultations:Object.freeze({ label:'Consultas', intention:'acolher', entry:'#consultationApp' }),
  store:Object.freeze({ label:'Loja', intention:'encontrar', entry:'#storeApp' })
});

export const REALITY_CHAMBERS_CONTRACT_V596 = Object.freeze({
  version:VERSION,
  base:'V595',
  work:'WORK12',
  macroStage:'8-of-10',
  title:'Realidades como Câmaras',
  law:'one-orb-one-universe-one-physics-one-presence',
  routes:ROUTES,
  states:Object.freeze(['threshold','awakening','present','engaged','travel']),
  arrival:'orb-and-intention-first',
  depth:'only-after-explicit-gesture',
  preservedEngines:Object.freeze({
    school:'V555',
    journal:'V556',
    consultations:'V558',
    store:'V543'
  }),
  maximumVisibleIntentions:2,
  samePhysicalOrb:true,
  automaticWhitSpeech:false,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  oneDeferredTimer:true,
  heavyEffectsQuietDuringReveal:true,
  iphoneFirst:true,
  reducedMotionPreservesOrder:true
});

const normalizeRoute = value => {
  const route = String(value || 'home').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const reducedMotion = win => win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const emit = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:Object.freeze(detail) }));
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class RealityChambersV596 {
  constructor({
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme,
    universe = globalThis.divinaLivingUniverseV524,
    foundation = globalThis.divinaWork12V592,
    presence = globalThis.divinaWhitLivingPresenceV594,
    soul = globalThis.divinaWhitOrbSoulV581,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.orbCore = orbCore || null;
    this.universe = universe || null;
    this.foundation = foundation || null;
    this.presence = presence || null;
    this.soul = soul || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.setTimer = typeof setTimer === 'function' ? setTimer : setTimeout;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : clearTimeout;
    this.abort = new AbortController();
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.state = 'threshold';
    this.mode = 'none';
    this.timer = 0;
    this.sequence = 0;
    this.traveling = false;
    this.menuOpen = false;
    this.universePausedByChamber = false;
    this.explicitDepthCalls = 0;
    this.engagements = 0;
    this.reveals = 0;
    this.destroyed = false;

    this.installStyle();
    this.installIdentity();
    this.decorateAll();
    this.bind();
    this.onRouteReady({ detail:{ id:this.route, reason:'boot' } });
    emit(this.documentTarget, 'divina:reality-chambers-ready', this.status());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append(link);
    return true;
  }

  installIdentity() {
    if (!this.root?.dataset) return;
    this.root.dataset.realityChambers = 'v596';
    this.root.dataset.realityChamberRoute = this.route;
    this.root.dataset.realityChamberState = ROUTES.includes(this.route) ? 'threshold' : 'rest';
    this.root.dataset.realityChamberEffects = 'rest';
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'click', event => this.handleCapture(event), { capture:true });
    this.listen(doc, 'divina:reality-depth', event => this.onDepth(event));

    ['divina:route-start','divina:supreme-orb-will-navigate']
      .forEach(type => this.listen(doc, type, event => this.onTravelStart(event)));
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
      .forEach(type => this.listen(doc, type, event => this.onRouteReady(event)));

    [
      'divina:school-world-ready','divina:school-progress-v555',
      'divina:journal-world-ready','divina:journal-world-updated',
      'divina:consultations-world-ready','divina:store-world-ready'
    ].forEach(type => this.listen(doc, type, () => this.onWorldReady(type)));

    this.listen(doc, 'divina:work12-state', event => this.onWork12State(event));
    this.listen(doc, 'divina:menu-state', event => this.onMenuState(event));
    this.listen(doc, 'visibilitychange', () => this.onVisibility());
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win) } }));
    this.listen(win, 'pageshow', () => this.onRouteReady({ detail:{ id:routeNow(doc, win) } }));
  }

  screen(route = this.route) {
    return this.documentTarget?.getElementById?.(normalizeRoute(route)) || null;
  }

  isChamber(route = this.route) {
    return ROUTES.includes(normalizeRoute(route));
  }

  decorateAll() {
    ROUTES.forEach(route => this.decorate(route));
  }

  decorate(route) {
    const screen = this.screen(route);
    if (!screen) return false;
    screen.dataset.db596Chamber = 'v596';
    if (!screen.dataset.db596ChamberState) screen.dataset.db596ChamberState = 'threshold';
    if (!screen.dataset.db596ChamberMode) screen.dataset.db596ChamberMode = 'none';
    if (route === 'school') this.ensureSchoolPaths();
    if (route === 'store') this.ensureStoreReturn();
    return true;
  }

  ensureSchoolPaths() {
    const screen = this.screen('school');
    const resume = screen?.querySelector?.('[data-school-continue]');
    if (!resume || screen.querySelector?.('[data-db596-school-paths]')) return false;
    const button = this.documentTarget.createElement('button');
    button.type = 'button';
    button.className = 'db596-school-paths';
    button.dataset.db596SchoolPaths = 'true';
    button.textContent = 'Caminhos';
    button.setAttribute('aria-label', 'Abrir os três caminhos da Escola do Tarot');
    resume.insertAdjacentElement?.('afterend', button);
    return true;
  }

  ensureStoreReturn() {
    const screen = this.screen('store');
    const heading = screen?.querySelector?.('.store-v148-section-heading');
    if (!heading || screen.querySelector?.('[data-db596-store-return]')) return false;
    const button = this.documentTarget.createElement('button');
    button.type = 'button';
    button.className = 'db596-store-return';
    button.dataset.db596StoreReturn = 'true';
    button.textContent = 'Intenções';
    button.setAttribute('aria-label', 'Voltar às intenções da Loja Mística');
    heading.append(button);
    return true;
  }

  clearSequence(reason = 'cancelled') {
    this.sequence += 1;
    if (!this.timer) return false;
    this.clearTimer(this.timer);
    this.timer = 0;
    if (this.root?.dataset) this.root.dataset.realityChamberReason = reason;
    return true;
  }

  schedule(callback, delay, token) {
    if (this.timer) this.clearTimer(this.timer);
    this.timer = this.setTimer(() => {
      this.timer = 0;
      if (this.destroyed || token !== this.sequence || this.traveling || this.menuOpen) return;
      callback();
    }, Math.max(0, Number(delay || 0)));
  }

  setState(route, state, mode = this.mode, reason = 'state') {
    const normalized = normalizeRoute(route);
    if (!this.isChamber(normalized)) return false;
    this.route = normalized;
    this.state = state;
    this.mode = mode || 'none';
    const screen = this.screen(normalized);
    if (screen?.dataset) {
      screen.dataset.db596ChamberState = state;
      screen.dataset.db596ChamberMode = this.mode;
      screen.dataset.db596ChamberReason = reason;
    }
    if (this.root?.dataset) {
      this.root.dataset.realityChamberRoute = normalized;
      this.root.dataset.realityChamberState = state;
      this.root.dataset.realityChamberMode = this.mode;
      this.root.dataset.realityChamberReason = reason;
    }
    emit(this.documentTarget, 'divina:reality-chamber-state', {
      version:VERSION,
      route:normalized,
      state,
      mode:this.mode,
      reason,
      automaticWhitSpeech:false
    });
    return true;
  }

  claimThreshold(route = this.route, reason = 'threshold') {
    const normalized = normalizeRoute(route);
    if (!this.isChamber(normalized) || typeof this.orbCore?.claim !== 'function') return false;
    const host = this.screen(normalized)?.querySelector?.(':scope > .db585-intent-threshold [data-v585-orb-host]');
    if (!host) return false;
    const label = PROFILES[normalized].label;
    this.orbCore.claim(host, {
      mode:normalized,
      ariaLabel:`Orbe de ${label}. Toque para sentir. Mergulhe quando quiser.`,
      source:`reality-chambers-v596:${reason}`
    });
    return true;
  }

  quietEffects() {
    const universeState = safeStatus(this.universe);
    if (universeState?.paused !== true && typeof this.universe?.pause === 'function') {
      this.universe.pause();
      this.universePausedByChamber = true;
    }
    if (this.root?.dataset) this.root.dataset.realityChamberEffects = 'quiet';
  }

  resumeEffects() {
    if (this.root?.dataset) this.root.dataset.realityChamberEffects = 'rest';
    if (!this.universePausedByChamber) return false;
    this.universePausedByChamber = false;
    const foundationState = safeStatus(this.foundation)?.state || this.foundation?.state;
    if (!this.traveling && !this.menuOpen && this.documentTarget?.visibilityState !== 'hidden'
      && (!foundationState || foundationState === 'REST')) this.universe?.start?.();
    return true;
  }

  sustainSilence(reason, state = 'listening') {
    this.presence?.silence?.(`chamber-${reason}`, { count:false });
    this.soul?.setState?.(state, `chamber-${reason}`, {
      radiate:false,
      transient:0,
      strength:.12
    });
  }

  onDepth(event) {
    const route = normalizeRoute(event?.detail?.route || this.route);
    if (!this.isChamber(route) || this.traveling || this.menuOpen) return false;
    this.explicitDepthCalls += 1;
    this.clearSequence('explicit-depth');
    this.decorate(route);
    this.claimThreshold(route, 'explicit-depth');
    this.quietEffects();
    this.sustainSilence(`${route}-awakening`, 'listening');
    this.setState(route, 'awakening', 'none', 'explicit-depth');
    const token = ++this.sequence;
    this.schedule(() => {
      this.reveals += 1;
      this.setState(route, 'present', 'choice', 'chamber-born');
      this.sustainSilence(`${route}-present`, 'aware');
      this.resumeEffects();
      const entry = this.screen(route)?.querySelector?.(PROFILES[route].entry);
      entry?.scrollIntoView?.({ behavior:reducedMotion(this.windowTarget) ? 'auto' : 'smooth', block:'start' });
    }, reducedMotion(this.windowTarget) ? 40 : 260, token);
    return true;
  }

  engage(route, mode, reason = 'explicit-intention') {
    const normalized = normalizeRoute(route);
    if (!this.isChamber(normalized) || this.traveling || this.menuOpen) return false;
    this.engagements += 1;
    this.setState(normalized, 'engaged', mode, reason);
    this.sustainSilence(`${normalized}-${mode}`, mode === 'mirror' ? 'reflecting' : 'aware');
    return true;
  }

  showSchoolMap() {
    if (this.route !== 'school') return false;
    this.setState('school', 'present', 'map', 'school-paths');
    this.sustainSilence('school-map', 'aware');
    const map = this.screen('school')?.querySelector?.('.school-v555-compass');
    map?.scrollIntoView?.({ behavior:reducedMotion(this.windowTarget) ? 'auto' : 'smooth', block:'nearest' });
    return true;
  }

  showStoreIntentions() {
    if (this.route !== 'store') return false;
    this.setState('store', 'present', 'choice', 'store-intentions');
    this.sustainSilence('store-intentions', 'aware');
    const intentions = this.screen('store')?.querySelector?.('#amazonStoreCoreV543');
    intentions?.scrollIntoView?.({ behavior:reducedMotion(this.windowTarget) ? 'auto' : 'smooth', block:'nearest' });
    return true;
  }

  handleCapture(event) {
    if (!this.isChamber(this.route) || this.traveling || this.menuOpen) return;
    const target = event.target?.closest?.('button,a,summary');
    if (!target) return;

    if (target.matches?.('[data-db596-school-paths]')) {
      event.preventDefault?.();
      event.stopPropagation?.();
      this.showSchoolMap();
      return;
    }
    if (target.matches?.('[data-db596-store-return]')) {
      event.preventDefault?.();
      event.stopPropagation?.();
      this.showStoreIntentions();
      return;
    }

    if (this.route === 'school') {
      if (target.matches?.('[data-school-continue]')) this.engage('school', 'study', 'school-continue');
      else if (target.matches?.('[data-school-stage-target],[data-school-module]')) this.engage('school', 'study', 'school-path-selected');
      return;
    }

    if (this.route === 'journal') {
      if (target.matches?.('[data-jwv-write]')) this.engage('journal', 'write', 'journal-write');
      else if (target.matches?.('[data-jwv-mirror]')) this.engage('journal', 'mirror', 'journal-mirror');
      else if (target.matches?.('[data-jwv-calendar],[data-journal-view="calendar"]')) this.engage('journal', 'calendar', 'journal-calendar');
      return;
    }

    if (this.route === 'consultations') {
      if (target.matches?.('[data-service]')) this.engage('consultations', 'request', 'consultation-selected');
      else if (target.matches?.('[data-open-tracking],[data-toggle-tracking]')) this.engage('consultations', 'tracking', 'consultation-tracking');
      else if (target.matches?.('[data-back-services],[data-change-service]')) this.setState('consultations', 'present', 'choice', 'consultation-choice');
      return;
    }

    if (this.route === 'store' && target.matches?.('[data-collection]')) {
      this.engage('store', 'catalog', 'store-intention-selected');
      queueMicrotask(() => this.screen('store')?.querySelector?.('.store-v148-catalog')?.scrollIntoView?.({
        behavior:reducedMotion(this.windowTarget) ? 'auto' : 'smooth',
        block:'start'
      }));
    }
  }

  onWorldReady(reason = 'world-ready') {
    this.decorateAll();
    if (!this.isChamber(this.route)) return;
    queueMicrotask(() => {
      this.decorate(this.route);
      this.claimThreshold(this.route, reason);
    });
  }

  onTravelStart(event) {
    const destination = normalizeRoute(event?.detail?.id || event?.detail?.to || this.route);
    this.traveling = true;
    this.clearSequence('travel');
    if (this.isChamber(this.route)) this.setState(this.route, 'travel', this.mode, 'travel');
    if (this.root?.dataset) this.root.dataset.realityChamberDestination = destination;
    this.quietEffects();
  }

  onRouteReady(event) {
    const route = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget));
    this.traveling = false;
    this.route = route;
    delete this.root?.dataset?.realityChamberDestination;
    this.decorateAll();
    if (!this.isChamber(route)) {
      this.state = 'threshold';
      this.mode = 'none';
      if (this.root?.dataset) {
        this.root.dataset.realityChamberRoute = route;
        this.root.dataset.realityChamberState = 'rest';
        this.root.dataset.realityChamberMode = 'none';
      }
      this.resumeEffects();
      return false;
    }
    this.clearSequence('route-ready');
    this.setState(route, 'threshold', 'none', 'route-ready');
    queueMicrotask(() => {
      this.decorate(route);
      this.claimThreshold(route, 'route-ready');
    });
    this.resumeEffects();
    return true;
  }

  onWork12State(event) {
    const state = String(event?.detail?.state || '').toUpperCase();
    if (TRAVEL_STATES.has(state)) {
      this.onTravelStart(event);
      return;
    }
    if (!['REST','QUIET'].includes(state)) return;
    this.traveling = false;
    if (!this.menuOpen) this.resumeEffects();
  }

  onMenuState(event) {
    this.menuOpen = String(event?.detail?.state || 'closed').toLowerCase() !== 'closed';
    if (this.menuOpen) {
      this.clearSequence('menu');
      this.quietEffects();
      this.sustainSilence('menu', 'listening');
    } else if (!this.traveling) this.resumeEffects();
  }

  onVisibility() {
    if (this.documentTarget?.visibilityState === 'hidden') {
      this.clearSequence('hidden');
      this.quietEffects();
    } else if (!this.traveling && !this.menuOpen) this.resumeEffects();
  }

  status() {
    return Object.freeze({
      version:VERSION,
      route:this.route,
      chamber:this.isChamber(this.route),
      state:this.state,
      mode:this.mode,
      routes:ROUTES,
      explicitDepthCalls:this.explicitDepthCalls,
      reveals:this.reveals,
      engagements:this.engagements,
      timerActive:Boolean(this.timer),
      oneDeferredTimer:true,
      maximumVisibleIntentions:2,
      automaticWhitSpeech:false,
      samePhysicalOrb:true,
      traveling:this.traveling,
      effects:this.root?.dataset?.realityChamberEffects || 'rest',
      iphoneFirst:true
    });
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V596',
      chambers:ROUTES.filter(route => this.screen(route)?.dataset?.db596Chamber === 'v596').length,
      expectedChambers:ROUTES.length,
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      duplicateOrbs:Math.max(0, Number(doc?.querySelectorAll?.('#orb')?.length || 0) - 1),
      addedIntentions:doc?.querySelectorAll?.('[data-db596-school-paths],[data-db596-store-return]')?.length || 0,
      maximumAddedIntentionsPerReality:1,
      preservedEngines:true,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      storageReads:0,
      storageWrites:0,
      apiCalls:0,
      privateContentReads:0
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.clearSequence('destroy');
    this.abort.abort();
    this.resumeEffects();
    this.documentTarget?.querySelectorAll?.('[data-db596-school-paths],[data-db596-store-return]')?.forEach?.(node => node.remove?.());
    ROUTES.forEach(route => {
      const screen = this.screen(route);
      if (!screen?.dataset) return;
      delete screen.dataset.db596Chamber;
      delete screen.dataset.db596ChamberState;
      delete screen.dataset.db596ChamberMode;
      delete screen.dataset.db596ChamberReason;
    });
    if (this.root?.dataset) {
      delete this.root.dataset.realityChambers;
      delete this.root.dataset.realityChamberRoute;
      delete this.root.dataset.realityChamberState;
      delete this.root.dataset.realityChamberMode;
      delete this.root.dataset.realityChamberReason;
      delete this.root.dataset.realityChamberEffects;
      delete this.root.dataset.realityChamberDestination;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createRealityChambersV596(options = {}) {
  if (globalThis[INSTANCE]?.destroy && !globalThis[INSTANCE].destroyed) return globalThis[INSTANCE];
  const chambers = new RealityChambersV596(options);
  globalThis[INSTANCE] = chambers;
  globalThis.divinaRealityChambersV596 = chambers;
  return chambers;
}
