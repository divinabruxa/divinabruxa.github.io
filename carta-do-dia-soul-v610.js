/* DIVINA BRUXA — WORK13 · ALMA DA CARTA DO DIA · V610
   O amanhecer permanece governado por V554, o rito por V595 e a essencia por
   V604. Esta camada apenas faz o mundo responder ao gesto e acompanhar as
   fases publicas: Orbe, carta, silencio, uma frase e profundidade chamada.
   Nao escolhe carta, nao le conteudo e nao cria outra Orbe. */

const VERSION = 610;
const STYLE_ID = 'divinaCartaDoDiaSoulV610';
const STYLE_HREF = './carta-do-dia-soul-v610.css?v=610-work13-daily-soul';
const INSTANCE = Symbol.for('divina.work13.carta.do.dia.soul.v610');
const RITUAL_PHASES = new Set(['rest','symbol','silence','essence','depth','travel']);

export const CARTA_DO_DIA_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'daily',
  stage:'segunda-realidade-alma-propria',
  sequence:Object.freeze(['orb','card','silence','one-sentence-essence','depth-on-explicit-request']),
  existingDailyAuthority:'V554-preserved',
  existingRitualAuthority:'V595-preserved',
  existingCosmicReadingAuthority:'V604-preserved',
  cardsPerBrasiliaDay:1,
  timeZone:'America/Sao_Paulo',
  accountContinuityPreserved:true,
  crossDeviceContinuityPreserved:true,
  manualReveal:true,
  automaticReveal:false,
  reversedCards:false,
  maximumEssenceSentences:1,
  depthRequiresExplicitGesture:true,
  cardSelectionChanges:0,
  datePolicyChanges:0,
  accountPolicyChanges:0,
  meaningChanges:0,
  persistenceChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  intentionReads:0,
  cardIdentityReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  newVisibleDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  deferredTimers:0,
  work14:false
});

const normalizeRoute = value => String(value || 'home')
  .trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0] || 'home';

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const normalizePhase = value => {
  const phase = String(value || 'rest').trim().toLowerCase();
  return RITUAL_PHASES.has(phase) ? phase : 'rest';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class CartaDoDiaSoulV610 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis,
    orbCore = null
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.orbCore = orbCore || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('daily') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.world = null;
    this.orbHost = null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.responses = 0;
    this.revealsObserved = 0;
    this.ritualPhasesObserved = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:daily-soul-ready', this.status());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement?.('link');
    if (!link) return false;
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append?.(link);
    return true;
  }

  installIdentity() {
    if (this.root?.dataset) this.root.dataset.work13DailySoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.dailySoul = 'v610';
    this.screen.dataset.dailySoulPhase = 'rest';
    this.screen.dataset.dailySoulPresence = 'away';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  attach() {
    const world = this.documentTarget?.querySelector?.('#dailyCard .dw509') || null;
    if (!world) return null;
    if (world !== this.world) {
      this.world = world;
      this.orbHost = world.querySelector?.('[data-daily-orb-host]') || null;
      this.attachments += 1;
    }
    world.dataset.dailySoul = 'v610';
    world.dataset.dailySoulPhase = this.phase;
    world.dataset.dailySoulSequence = 'orb-card-silence-essence-depth';
    return world;
  }

  isActive() {
    return this.route === 'daily' && this.screen?.classList?.contains?.('active') !== false;
  }

  ownsOrb() {
    return Boolean(this.isActive() && this.orb && this.orbHost?.contains?.(this.orb));
  }

  setPhase(phase, reason = 'gesture') {
    const next = phase === 'answering' || phase === 'origin'
      ? phase
      : normalizePhase(phase);
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.dailySoulPhase = next;
    if (this.world?.dataset) this.world.dataset.dailySoulPhase = next;
    emit(this.documentTarget, 'divina:daily-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      revealed:this.world?.dataset?.state === 'revealed',
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return next;
  }

  answer(source = 'touch') {
    if (!this.ownsOrb()) return false;
    this.responses += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('daily-soul-answer', { intensity:.38 });
    return true;
  }

  restAfterTouch(source = 'release') {
    if (!this.isActive()) return false;
    const ritualPhase = normalizePhase(this.world?.dataset?.readingPhase);
    if (this.world?.dataset?.state === 'revealed') {
      return this.setPhase(ritualPhase === 'rest' ? 'silence' : ritualPhase, source);
    }
    return this.setPhase(this.world?.classList?.contains?.('is-opening') ? 'symbol' : 'origin', source);
  }

  observeReveal() {
    this.attach();
    if (!this.isActive()) return false;
    this.revealsObserved += 1;
    const ritualPhase = normalizePhase(this.world?.dataset?.readingPhase);
    return this.setPhase(ritualPhase === 'rest' ? 'symbol' : ritualPhase, 'card-revealed');
  }

  observeRitual(event) {
    if (event?.detail?.kind !== 'daily') return false;
    this.attach();
    this.ritualPhasesObserved += 1;
    if (!this.isActive()) return false;
    return this.setPhase(normalizePhase(event.detail.phase), 'reading-ritual');
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'daily';
    if (this.screen?.dataset) this.screen.dataset.dailySoulPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    if (!this.world) return this.setPhase('origin', reason);
    if (this.world.classList?.contains?.('is-opening')) return this.setPhase('symbol', reason);
    if (this.world.dataset?.state !== 'revealed') return this.setPhase('origin', reason);
    const ritualPhase = normalizePhase(this.world.dataset?.readingPhase);
    return this.setPhase(ritualPhase === 'rest' ? 'silence' : ritualPhase, reason);
  }

  bind() {
    this.listen(this.orb, 'pointerdown', () => this.answer('touch'), { passive:true });
    this.listen(this.orb, 'pointerup', () => this.restAfterTouch('release'), { passive:true });
    this.listen(this.orb, 'pointercancel', () => this.restAfterTouch('cancel'), { passive:true });
    this.listen(this.orb, 'click', event => {
      if (!this.ownsOrb()) return;
      if (Number(event?.detail || 0) === 0 && this.phase !== 'answering') this.answer('keyboard');
    });

    this.listen(this.documentTarget, 'divina:reading-ritual-phase', event => this.observeRitual(event));
    this.listen(this.documentTarget, 'divina:cosmic-daily-reading-updated', event => {
      if (!this.isActive()) return;
      this.setPhase(normalizePhase(event?.detail?.phase), 'cosmic-reading');
    });
    this.listen(this.windowTarget, 'divina:daily-v509-ready', () => this.sync('daily-ready'));
    this.listen(this.windowTarget, 'divina:daily-v554-ready', () => this.sync('daily-ready'));
    this.listen(this.windowTarget, 'divina:daily-v561-revealed', () => this.observeReveal());

    const onRoute = event => {
      this.route = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget, this.windowTarget)
      );
      this.sync('route');
    };
    this.listen(this.documentTarget, 'divina:route-ready', onRoute);
    this.listen(this.documentTarget, 'divina:page-ready', onRoute);
    this.listen(this.documentTarget, 'divina:supreme-orb-did-navigate', onRoute);
    this.listen(this.windowTarget, 'hashchange', () => {
      this.route = routeNow(this.documentTarget, this.windowTarget);
      this.sync('hashchange');
    }, { passive:true });
    this.listen(this.windowTarget, 'pageshow', () => {
      this.route = routeNow(this.documentTarget, this.windowTarget);
      this.sync('pageshow');
    }, { passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      dailyScreenPresent:Boolean(this.screen),
      dailyWorldAttached:Boolean(this.world),
      dailyOrbHostPresent:Boolean(this.orbHost),
      dailyRule:this.world?.dataset?.dailyRule || 'one-per-brasilia-day',
      orientation:this.world?.dataset?.orientation || 'normal',
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      cardsPerBrasiliaDay:1,
      timeZone:'America/Sao_Paulo',
      reversedCards:false,
      cardSelectionChanges:0,
      privateContentReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...CARTA_DO_DIA_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      responses:this.responses,
      revealsObserved:this.revealsObserved,
      ritualPhasesObserved:this.ritualPhasesObserved,
      attachments:this.attachments,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.world?.dataset) {
      delete this.world.dataset.dailySoul;
      delete this.world.dataset.dailySoulPhase;
      delete this.world.dataset.dailySoulSequence;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.dailySoul;
      delete this.screen.dataset.dailySoulPhase;
      delete this.screen.dataset.dailySoulPresence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13DailySoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createCartaDoDiaSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const soul = new CartaDoDiaSoulV610(options);
  globalThis[INSTANCE] = soul;
  globalThis.divinaCartaDoDiaSoulV610 = soul;
  return soul;
}

export default createCartaDoDiaSoulV610;
