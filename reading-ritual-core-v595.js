/* DIVINA BRUXA — WORK12 · MACROETAPA 7 · LEITURAS COMO RITO V595
   Tarot Livre e Carta do Dia passam pela mesma respiração sem substituir
   seus motores: símbolo, silêncio, essência e profundidade somente chamada.

   Não existe outro baralho, outra Orbe, outro canvas, observador ou loop.
   Whit sustenta o tempo dentro da Orbe e não pronuncia a leitura.
*/

const VERSION = 595;
const INSTANCE = Symbol.for('divina.work12.reading.ritual.v595');
const STYLE_ID = 'divinaReadingRitualV595';
const STYLE_HREF = './reading-ritual-core-v595.css?v=595-work12-ritual';
const READING_ROUTES = new Set(['tarot','daily']);
const TRAVEL_STATES = new Set(['DEPART','TRAVEL','ARRIVE']);

export const READING_RITUAL_CONTRACT_V595 = Object.freeze({
  version:VERSION,
  base:'V594',
  work:'WORK12',
  macroStage:'7-of-10',
  title:'Leituras como Rito',
  law:'one-orb-one-universe-one-physics-one-presence',
  sequence:Object.freeze(['symbol','silence','essence','depth-on-request']),
  tarotFreeAutomaticMeanings:false,
  tarotFreeDepthDestination:'library',
  dailyMeaningStartsCollapsed:true,
  dailyDepthRequiresExplicitGesture:true,
  dailyMaximumVisibleDepthIntentions:2,
  automaticWhitSpeech:false,
  whitRole:'silent-timing-inside-canonical-orb',
  oneStateMachine:true,
  oneDeferredTimer:true,
  onePhysicalOrb:true,
  duplicateOrbs:0,
  newCanvases:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  privateContentReads:0,
  heavyEffectsQuietDuringRitual:true,
  travelPolicy:'cancel-sequence-keep-symbol-safe',
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
const constrained = doc => doc?.documentElement?.dataset?.performanceTier === 'constrained'
  || globalThis.navigator?.connection?.saveData === true;

const emit = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:Object.freeze(detail) }));
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class ReadingRitualCoreV595 {
  constructor({
    go = null,
    soul = globalThis.divinaWhitOrbSoulV581,
    presence = globalThis.divinaWhitLivingPresenceV594,
    universe = globalThis.divinaLivingUniverseV524,
    foundation = globalThis.divinaWork12V592,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.go = typeof go === 'function' ? go : (id, options) => globalThis.orbe?.go?.(id, options);
    this.soul = soul || null;
    this.presence = presence || null;
    this.universe = universe || null;
    this.foundation = foundation || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.setTimer = typeof setTimer === 'function' ? setTimer : setTimeout;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : clearTimeout;
    this.abort = new AbortController();
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.kind = READING_ROUTES.has(this.route) ? this.route : '';
    this.phase = 'rest';
    this.timer = 0;
    this.sequence = 0;
    this.traveling = false;
    this.menuOpen = false;
    this.universePausedByRitual = false;
    this.pendingLibraryCardId = null;
    this.currentTarotCardId = null;
    this.controls = new Map();
    this.attachedWorlds = new Map();
    this.phaseCounts = new Map();
    this.depthCalls = 0;
    this.completedSequences = 0;
    this.cancelledSequences = 0;
    this.destroyed = false;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.attachAvailable();
    this.restoreActiveReading('boot');
    emit(this.documentTarget, 'divina:reading-ritual-ready', this.status());
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
    this.root.dataset.readingRitual = 'v595';
    this.root.dataset.readingRitualPhase = 'rest';
    this.root.dataset.readingRitualRoute = this.route;
    this.root.dataset.readingRitualWhit = 'silent-timing';
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'click', event => this.handleCapture(event), { capture:true });
    this.listen(doc, 'divina:tarot-supreme-ready', () => {
      this.attach('tarot');
      if (this.route === 'tarot') this.restoreActiveReading('tarot-ready');
    });
    this.listen(win, 'divina:daily-v509-ready', () => {
      this.attach('daily');
      if (this.route === 'daily') this.restoreActiveReading('daily-ready');
    });
    this.listen(win, 'divina:daily-v554-ready', () => {
      this.attach('daily');
      if (this.route === 'daily') this.restoreActiveReading('daily-ready');
    });
    this.listen(win, 'tarot:supreme-revealed', event => {
      this.currentTarotCardId = Number.isInteger(event.detail?.cardId) ? event.detail.cardId : null;
      this.reveal('tarot', 'card-revealed');
    });
    this.listen(win, 'divina:daily-v561-revealed', () => this.reveal('daily', 'card-revealed'));

    ['divina:page-ready','divina:route-ready','divina:supreme-orb-did-navigate']
      .forEach(type => this.listen(doc, type, event => this.onRouteReady(event)));
    ['divina:route-start','divina:supreme-orb-will-navigate']
      .forEach(type => this.listen(doc, type, () => this.onTravelStart(type)));
    this.listen(doc, 'divina:work12-state', event => this.onWork12State(event));
    this.listen(doc, 'divina:menu-state', event => this.onMenuState(event));
    this.listen(doc, 'visibilitychange', () => this.onVisibility());
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win) } }));
    this.listen(win, 'pageshow', () => {
      this.attachAvailable();
      this.onRouteReady({ detail:{ id:routeNow(doc, win) } });
    });
    this.listen(doc, 'divina:library-world-ready', () => this.openPendingLibraryCard());
  }

  world(kind) {
    if (kind === 'tarot') return this.documentTarget?.querySelector?.('#tarot .tl517') || null;
    if (kind === 'daily') return this.documentTarget?.querySelector?.('#dailyCard .dw509') || null;
    return null;
  }

  attachAvailable() {
    this.attach('tarot');
    this.attach('daily');
  }

  attach(kind) {
    const world = this.world(kind);
    if (!world) return null;
    if (this.attachedWorlds.get(kind) !== world) {
      this.attachedWorlds.set(kind, world);
      world.dataset.readingRitual = 'v595';
      world.dataset.readingPhase = kind === this.kind ? this.phase : 'rest';
      this.ensureControl(kind, world);
    }
    return world;
  }

  ensureControl(kind, world) {
    const existing = world.querySelector?.(`[data-reading-depth-call="${kind}"]`);
    if (existing) {
      this.controls.set(kind, existing);
      return existing;
    }
    const doc = this.documentTarget;
    if (!doc?.createElement) return null;
    const breath = doc.createElement('div');
    breath.className = 'db595-reading-breath';
    breath.dataset.readingBreath = kind;
    breath.hidden = true;
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'db595-reading-intention';
    button.dataset.readingDepthCall = kind;
    button.textContent = kind === 'tarot' ? 'Símbolo' : 'Mergulhar';
    button.setAttribute('aria-label', kind === 'tarot'
      ? 'Conhecer o símbolo desta carta na Biblioteca'
      : 'Mergulhar nas camadas da Carta do Dia');
    button.setAttribute('aria-expanded', 'false');
    breath.append(button);
    if (kind === 'tarot') {
      world.querySelector?.('.tl517__stage')?.insertAdjacentElement?.('afterend', breath);
    } else {
      const constellation = world.querySelector?.('[data-daily-constellation]');
      if (constellation) world.insertBefore(breath, constellation);
      else world.append?.(breath);
    }
    this.controls.set(kind, button);
    return button;
  }

  control(kind) {
    const world = this.attach(kind);
    return this.controls.get(kind) || world?.querySelector?.(`[data-reading-depth-call="${kind}"]`) || null;
  }

  handleCapture(event) {
    const depth = event.target?.closest?.('[data-reading-depth-call]');
    if (depth) {
      event.preventDefault?.();
      event.stopPropagation?.();
      this.requestDepth(depth.dataset.readingDepthCall);
      return;
    }
    if (!READING_ROUTES.has(this.route) || this.traveling || this.menuOpen) return;
    const orb = event.target?.closest?.('#orb');
    if (!orb) return;
    const world = this.attach(this.route);
    if (!world?.contains?.(orb)) return;
    if (this.route === 'daily' && world.dataset.state === 'revealed') {
      this.sustainWhit('aware', 'daily-presence', 0.12);
      return;
    }
    this.begin(this.route, 'orb-touch');
  }

  timings() {
    if (reducedMotion(this.windowTarget)) return Object.freeze({ symbol:60, silence:140 });
    if (constrained(this.documentTarget)) return Object.freeze({ symbol:260, silence:420 });
    return Object.freeze({ symbol:380, silence:680 });
  }

  clearSequence(reason = 'cancelled') {
    this.sequence += 1;
    if (!this.timer) return false;
    this.clearTimer(this.timer);
    this.timer = 0;
    this.cancelledSequences += 1;
    if (this.root?.dataset) this.root.dataset.readingRitualReason = reason;
    return true;
  }

  schedule(callback, delay, token) {
    if (this.timer) this.clearTimer(this.timer);
    this.timer = this.setTimer(() => {
      this.timer = 0;
      if (token !== this.sequence || this.destroyed || this.traveling || this.menuOpen) return;
      callback();
    }, Math.max(0, Number(delay || 0)));
  }

  setPhase(kind, phase, reason = 'phase') {
    this.kind = READING_ROUTES.has(kind) ? kind : '';
    this.phase = phase;
    this.phaseCounts.set(phase, (this.phaseCounts.get(phase) || 0) + 1);
    if (this.root?.dataset) {
      this.root.dataset.readingRitualPhase = phase;
      this.root.dataset.readingRitualRoute = this.route;
      this.root.dataset.readingRitualKind = this.kind || 'none';
      this.root.dataset.readingRitualReason = reason;
    }
    this.attachedWorlds.forEach((world, worldKind) => {
      world.dataset.readingPhase = worldKind === this.kind ? phase : 'rest';
    });
    this.syncControl(kind);
    this.syncSignal(kind, phase);
    emit(this.documentTarget, 'divina:reading-ritual-phase', {
      version:VERSION,
      kind:this.kind,
      phase,
      reason,
      meaningIncluded:false,
      whitMessageIncluded:false
    });
    return phase;
  }

  syncControl(kind) {
    const button = this.control(kind);
    const breath = button?.closest?.('[data-reading-breath]');
    if (!button || !breath) return false;
    const visible = this.phase === 'essence' || this.phase === 'depth';
    breath.hidden = !visible;
    button.setAttribute('aria-expanded', String(this.phase === 'depth'));
    button.textContent = kind === 'tarot' ? 'Símbolo' : this.phase === 'depth' ? 'Recolher' : 'Mergulhar';
    return visible;
  }

  syncSignal(kind, phase) {
    if (kind !== 'tarot') return;
    const signal = this.world('tarot')?.querySelector?.('[data-signal]');
    if (!signal) return;
    if (phase === 'symbol') signal.textContent = 'Olhe.';
    else if (phase === 'silence') signal.textContent = '';
    else if (phase === 'essence') signal.textContent = 'Ela chegou.';
  }

  sustainWhit(state, reason, strength = 0.14) {
    this.presence?.silence?.(`reading-${reason}`, { count:false });
    this.soul?.setState?.(state, `reading-${reason}`, {
      radiate:false,
      transient:0,
      strength
    });
  }

  quietEffects() {
    const universeState = safeStatus(this.universe);
    if (universeState?.paused !== true && typeof this.universe?.pause === 'function') {
      this.universe.pause();
      this.universePausedByRitual = true;
    }
    if (this.kind === 'daily') globalThis.divinaDailyWorldV509?.aurora?.setActive?.(false);
    if (this.root?.dataset) this.root.dataset.readingRitualEffects = 'quiet';
  }

  resumeEffects() {
    if (this.root?.dataset) this.root.dataset.readingRitualEffects = 'rest';
    if (this.kind === 'daily' && this.route === 'daily' && this.documentTarget?.visibilityState !== 'hidden') {
      globalThis.divinaDailyWorldV509?.aurora?.setActive?.(true);
    }
    if (!this.universePausedByRitual) return false;
    this.universePausedByRitual = false;
    const foundationState = safeStatus(this.foundation)?.state || this.foundation?.state;
    if (!this.traveling && !this.menuOpen && this.documentTarget?.visibilityState !== 'hidden'
      && (!foundationState || foundationState === 'REST')) {
      this.universe?.start?.();
    }
    return true;
  }

  begin(kind, reason = 'begin') {
    if (!READING_ROUTES.has(kind) || this.destroyed) return false;
    this.attach(kind);
    this.clearSequence('new-reading');
    this.route = kind;
    this.setPhase(kind, 'symbol', reason);
    this.quietEffects();
    this.sustainWhit('listening', 'symbol', 0.12);
    return true;
  }

  reveal(kind, reason = 'revealed') {
    if (!READING_ROUTES.has(kind) || this.destroyed || routeNow(this.documentTarget, this.windowTarget) !== kind) return false;
    this.route = kind;
    this.attach(kind);
    if (this.kind !== kind || !['symbol','silence'].includes(this.phase)) this.begin(kind, reason);
    const token = ++this.sequence;
    const timing = this.timings();
    this.setPhase(kind, 'symbol', reason);
    this.quietEffects();
    this.schedule(() => {
      this.setPhase(kind, 'silence', 'symbol-seen');
      this.sustainWhit('reflecting', 'silence', 0.10);
      this.schedule(() => this.revealEssence(kind), timing.silence, token);
    }, timing.symbol, token);
    return true;
  }

  revealEssence(kind) {
    if (this.route !== kind || this.traveling || this.menuOpen) return false;
    this.completedSequences += 1;
    this.setPhase(kind, 'essence', 'silence-complete');
    this.sustainWhit('aware', 'essence', 0.16);
    this.resumeEffects();
    return true;
  }

  requestDepth(kind) {
    if (kind !== this.route || this.traveling || this.menuOpen || !READING_ROUTES.has(kind)) return false;
    if (kind === 'tarot') return this.openTarotSymbol();
    const next = this.phase === 'depth' ? 'essence' : 'depth';
    if (next === 'depth') this.depthCalls += 1;
    this.setPhase('daily', next, next === 'depth' ? 'explicit-depth' : 'explicit-recollect');
    this.sustainWhit(next === 'depth' ? 'reflecting' : 'aware', `daily-${next}`, 0.13);
    const panel = this.world('daily')?.querySelector?.('[data-daily-layer-panel]');
    if (next === 'depth' && panel) panel.scrollIntoView?.({
      behavior:reducedMotion(this.windowTarget) ? 'auto' : 'smooth',
      block:'nearest'
    });
    return true;
  }

  openTarotSymbol() {
    const instance = globalThis.divinaTarotLivreV517;
    const fallback = instance?.state?.revealed?.[instance?.selected];
    const cardId = Number.isInteger(this.currentTarotCardId)
      ? this.currentTarotCardId
      : Number.isInteger(fallback) ? fallback : null;
    if (!Number.isInteger(cardId)) return false;
    this.depthCalls += 1;
    this.pendingLibraryCardId = cardId;
    this.setPhase('tarot', 'depth', 'explicit-symbol-depth');
    this.sustainWhit('reflecting', 'tarot-depth', 0.12);
    let result = false;
    try {
      result = this.go?.('library', {
        source:'reading-ritual-v595',
        cardId,
        axis:'horizontal',
        intention:'symbol'
      });
    } catch {
      result = false;
    }
    if (result === false) {
      this.pendingLibraryCardId = null;
      this.setPhase('tarot', 'essence', 'symbol-depth-declined');
      return false;
    }
    Promise.resolve(result).catch(() => {
      if (this.pendingLibraryCardId !== cardId) return;
      this.pendingLibraryCardId = null;
      if (this.route === 'tarot') this.setPhase('tarot', 'essence', 'symbol-depth-recovered');
    });
    return true;
  }

  openPendingLibraryCard() {
    if (!Number.isInteger(this.pendingLibraryCardId)) return false;
    const cardId = this.pendingLibraryCardId;
    queueMicrotask(() => {
      const library = globalThis.divinaLibraryWorldV302;
      if (!library?.openReader) return;
      this.pendingLibraryCardId = null;
      library.openReader(cardId);
    });
    return true;
  }

  restoreActiveReading(reason = 'restore') {
    this.route = routeNow(this.documentTarget, this.windowTarget);
    if (!READING_ROUTES.has(this.route) || this.traveling || this.menuOpen) return false;
    const world = this.attach(this.route);
    if (!world) return false;
    const revealed = this.route === 'tarot'
      ? world.querySelector?.('[data-current-card]')?.dataset?.empty === 'false'
      : world.dataset.state === 'revealed' || world.classList?.contains?.('is-revealed');
    if (!revealed) {
      this.setPhase(this.route, 'rest', reason);
      return false;
    }
    if (this.route === 'tarot') {
      const instance = globalThis.divinaTarotLivreV517;
      const cardId = instance?.state?.revealed?.[instance?.selected];
      this.currentTarotCardId = Number.isInteger(cardId) ? cardId : this.currentTarotCardId;
    }
    return this.reveal(this.route, reason);
  }

  onTravelStart(reason = 'travel') {
    this.traveling = true;
    this.clearSequence(reason);
    if (READING_ROUTES.has(this.kind)) this.setPhase(this.kind, 'travel', reason);
    this.quietEffects();
  }

  onWork12State(event) {
    const state = String(event.detail?.state || '').toUpperCase();
    if (TRAVEL_STATES.has(state)) {
      this.onTravelStart(`work12-${state.toLowerCase()}`);
      return;
    }
    if (!['REST','QUIET'].includes(state)) return;
    this.traveling = false;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    if (!READING_ROUTES.has(this.route)) {
      this.kind = '';
      this.phase = 'rest';
      this.resumeEffects();
    }
  }

  onRouteReady(event) {
    const next = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget));
    this.traveling = false;
    this.route = next;
    if (this.root?.dataset) this.root.dataset.readingRitualRoute = next;
    this.attachAvailable();
    if (next === 'library') {
      this.resumeEffects();
      this.openPendingLibraryCard();
      return;
    }
    if (!READING_ROUTES.has(next)) {
      this.clearSequence('non-reading-route');
      this.kind = '';
      this.phase = 'rest';
      this.attachedWorlds.forEach(world => { world.dataset.readingPhase = 'rest'; });
      this.resumeEffects();
      return;
    }
    this.kind = next;
    this.setPhase(next, 'rest', 'route-ready');
    this.restoreActiveReading('route-ready');
  }

  onMenuState(event) {
    const state = String(event.detail?.state || 'closed').toLowerCase();
    this.menuOpen = state !== 'closed';
    if (this.menuOpen) {
      const interrupted = ['symbol','silence'].includes(this.phase);
      this.clearSequence('menu');
      if (interrupted && READING_ROUTES.has(this.kind)) this.setPhase(this.kind, 'essence', 'menu-safety');
      this.quietEffects();
    } else if (!this.traveling) {
      this.resumeEffects();
    }
  }

  onVisibility() {
    if (this.documentTarget?.visibilityState === 'hidden') {
      const interrupted = ['symbol','silence'].includes(this.phase);
      this.clearSequence('hidden');
      if (interrupted && READING_ROUTES.has(this.kind)) this.setPhase(this.kind, 'essence', 'visibility-safety');
      this.quietEffects();
    } else if (!this.traveling && !this.menuOpen) {
      this.resumeEffects();
    }
  }

  status() {
    return Object.freeze({
      version:VERSION,
      route:this.route,
      kind:this.kind || null,
      phase:this.phase,
      sequence:Object.freeze(['symbol','silence','essence','depth-on-request']),
      timerActive:Boolean(this.timer),
      oneDeferredTimer:true,
      traveling:this.traveling,
      menuOpen:this.menuOpen,
      completedSequences:this.completedSequences,
      cancelledSequences:this.cancelledSequences,
      depthCalls:this.depthCalls,
      tarotAutomaticMeanings:false,
      dailyDepthExplicit:true,
      automaticWhitSpeech:false,
      whitResidence:'canonical-orb',
      effects:this.root?.dataset?.readingRitualEffects || 'rest',
      pendingLibraryCard:Number.isInteger(this.pendingLibraryCardId),
      iphoneFirst:true
    });
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V595',
      oneStateMachine:true,
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      duplicateOrbs:Math.max(0, Number(doc?.querySelectorAll?.('#orb')?.length || 0) - 1),
      attachedWorlds:this.attachedWorlds.size,
      depthControls:this.controls.size,
      maximumDepthControlsPerReality:1,
      newCanvases:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      storageReads:0,
      storageWrites:0,
      apiCalls:0,
      privateContentReads:0,
      tarotFreeProtected:true,
      dailyOnePerDayProtected:true
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.clearSequence('destroy');
    this.abort.abort();
    this.resumeEffects();
    this.controls.forEach(button => button.closest?.('[data-reading-breath]')?.remove?.());
    this.attachedWorlds.forEach(world => {
      delete world.dataset.readingRitual;
      delete world.dataset.readingPhase;
    });
    if (this.root?.dataset) {
      delete this.root.dataset.readingRitual;
      delete this.root.dataset.readingRitualPhase;
      delete this.root.dataset.readingRitualRoute;
      delete this.root.dataset.readingRitualKind;
      delete this.root.dataset.readingRitualReason;
      delete this.root.dataset.readingRitualEffects;
      delete this.root.dataset.readingRitualWhit;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createReadingRitualCoreV595(options = {}) {
  if (globalThis[INSTANCE]?.destroy && !globalThis[INSTANCE].destroyed) return globalThis[INSTANCE];
  const core = new ReadingRitualCoreV595(options);
  globalThis[INSTANCE] = core;
  globalThis.divinaReadingRitualV595 = core;
  return core;
}
