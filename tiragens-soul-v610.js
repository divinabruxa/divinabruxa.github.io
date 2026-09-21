/* DIVINA BRUXA — WORK13 · ALMA DAS TIRAGENS · V610
   O motor V331 e a leitura cosmica V605 permanecem soberanos. Esta camada
   apenas escuta os estados publicos da jornada e faz o observatorio responder:
   escolha, Orbe, carta, silencio, essencia, conversa e profundidade pedida.
   Nao escolhe cartas, nao le a intencao privada e nao cria outra Orbe. */

const VERSION = 610;
const STYLE_ID = 'divinaTiragensSoulV610';
const STYLE_HREF = './tiragens-soul-v610.css?v=610-work13-spreads-soul';
const INSTANCE = Symbol.for('divina.work13.tiragens.soul.v610');
const READING_PHASES = new Set(['ready','answering','silence','essence','conversation','depth']);

export const TIRAGENS_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'spreads',
  stage:'terceira-realidade-alma-propria',
  sequence:Object.freeze(['choice','orb','revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request']),
  existingSpreadAuthority:'V331-preserved',
  existingCosmicReadingAuthority:'V605-preserved',
  methodsPreserved:15,
  freeMethodsPreserved:4,
  premiumMethodsPreserved:11,
  celticCrossPositionsPreserved:10,
  royalTableCardsPreserved:78,
  royalTableGeometryPreserved:'13x6',
  normalOnly:true,
  noRepeats:true,
  maximumConversationVoices:3,
  maximumSynthesisSentences:1,
  depthRequiresExplicitGesture:true,
  cardSelectionChanges:0,
  shuffleChanges:0,
  premiumAuthorityChanges:0,
  persistenceChanges:0,
  synthesisChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  intentionReads:0,
  questionReads:0,
  cardIdentityReads:0,
  unrevealedCardReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
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

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

const hasExpandedDepth = reading => Boolean(
  reading?.querySelector?.('[data-db605-card-depth-call][aria-expanded="true"], [data-db605-synthesis-depth-call][aria-expanded="true"]')
);

export class TiragensSoulV610 {
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
    this.screen = this.documentTarget?.getElementById?.('spreads') || null;
    this.grid = this.documentTarget?.getElementById?.('spreadGrid') || null;
    this.result = this.documentTarget?.getElementById?.('spreadResult') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.reading = null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.responses = 0;
    this.choiceGestures = 0;
    this.revealGestures = 0;
    this.readingUpdates = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:spreads-soul-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13SpreadsSoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.spreadsSoul = 'v610';
    this.screen.dataset.spreadsSoulPhase = 'rest';
    this.screen.dataset.spreadsSoulPresence = 'away';
    this.screen.dataset.spreadsSoulSequence = 'choice-orb-card-silence-essence-conversation-synthesis-depth';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  isActive() {
    return this.route === 'spreads' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const reading = this.result?.querySelector?.('.spread-reading') || null;
    if (reading && reading !== this.reading) {
      this.reading = reading;
      this.attachments += 1;
    } else if (!reading) {
      this.reading = null;
    }
    if (this.reading?.dataset) {
      this.reading.dataset.spreadsSoul = 'v610';
      this.reading.dataset.spreadsSoulPhase = this.phase;
    }
    return this.reading;
  }

  ownsRevealOrb(target = this.orb) {
    const candidate = target?.closest?.('#orb') || (target === this.orb ? this.orb : null);
    if (!this.isActive() || !candidate || candidate !== this.orb) return false;
    return Boolean(candidate.closest?.('#spreadResult'));
  }

  isChoiceTarget(target) {
    if (!this.isActive() || !target?.closest) return false;
    const choice = target.closest('[data-spread-id], [data-spread], .spread-choice, .spread-choice-card, .spread-method');
    return Boolean(choice && this.grid?.contains?.(choice));
  }

  setPhase(phase, reason = 'state') {
    const next = ['rest','origin','choosing','preparing','travel'].includes(phase)
      ? phase
      : READING_PHASES.has(phase) ? phase : 'origin';
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.spreadsSoulPhase = next;
    if (this.reading?.dataset) this.reading.dataset.spreadsSoulPhase = next;
    emit(this.documentTarget, 'divina:spreads-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      readingPresent:Boolean(this.reading),
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return next;
  }

  respond(kind = 'orb', source = 'touch') {
    if (!this.isActive()) return false;
    this.responses += 1;
    if (kind === 'choice') {
      this.choiceGestures += 1;
      this.setPhase('choosing', source);
      this.orbCore?.pulse?.('spreads-choice-answer', { intensity:.18 });
      return true;
    }
    if (!this.ownsRevealOrb(this.orb)) return false;
    this.revealGestures += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('spreads-reveal-answer', { intensity:.40 });
    return true;
  }

  phaseFromPublicState() {
    const reading = this.attach();
    if (!reading) {
      const hasPreparation = Boolean(this.result?.querySelector?.('form, button, [data-spread-session], [data-spread-start]'));
      return hasPreparation ? 'preparing' : 'origin';
    }
    if (hasExpandedDepth(reading)) return 'depth';
    const cosmicPhase = String(reading.dataset?.cosmicSpreadPhase || '').toLowerCase();
    if (cosmicPhase === 'silence') return 'silence';
    const complete = reading.classList?.contains?.('complete')
      || Boolean(reading.querySelector?.('[data-cosmic-spread-synthesis="v605"]'));
    if (complete) return 'conversation';
    if (cosmicPhase === 'essence') return 'essence';
    return 'ready';
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'spreads';
    if (this.screen?.dataset) this.screen.dataset.spreadsSoulPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    const next = this.phaseFromPublicState();
    return this.setPhase(next, reason);
  }

  observeReading(event) {
    if (!this.isActive()) return false;
    this.readingUpdates += 1;
    this.attach();
    const reason = String(event?.detail?.reason || 'cosmic-reading');
    if (reason === 'explicit-depth') return this.setPhase('depth', reason);
    if (reason === 'explicit-recollect') return this.setPhase(event?.detail?.complete ? 'conversation' : 'essence', reason);
    if (event?.detail?.phase === 'silence') return this.setPhase('silence', reason);
    if (event?.detail?.complete) return this.setPhase('conversation', reason);
    if (event?.detail?.phase === 'essence') return this.setPhase('essence', reason);
    return this.sync(reason);
  }

  onPointerDown(event) {
    if (this.ownsRevealOrb(event?.target)) return this.respond('orb', 'touch');
    if (this.isChoiceTarget(event?.target)) return this.respond('choice', 'touch');
    return false;
  }

  onClick(event) {
    if (!this.isActive()) return false;
    if (Number(event?.detail || 0) === 0 && this.ownsRevealOrb(event?.target) && this.phase !== 'answering') {
      this.respond('orb', 'keyboard');
    }
    if (event?.target?.closest?.('[data-db605-card-depth-call], [data-db605-synthesis-depth-call]')) {
      return this.sync('explicit-layer');
    }
    return this.sync(this.isChoiceTarget(event?.target) ? 'choice' : 'gesture');
  }

  bind() {
    this.listen(this.documentTarget, 'pointerdown', event => this.onPointerDown(event), { passive:true });
    this.listen(this.documentTarget, 'pointerup', event => {
      if (this.ownsRevealOrb(event?.target)) this.sync('release');
    }, { passive:true });
    this.listen(this.documentTarget, 'pointercancel', event => {
      if (this.ownsRevealOrb(event?.target)) this.sync('cancel');
    }, { passive:true });
    this.listen(this.documentTarget, 'click', event => this.onClick(event));
    this.listen(this.documentTarget, 'divina:cosmic-spread-reading-updated', event => this.observeReading(event));
    this.listen(this.documentTarget, 'divina:spreads-supreme-ready', () => this.sync('spreads-ready'));
    this.listen(this.documentTarget, 'divina:route-start', event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'spreads' || target === 'spreads') this.setPhase('travel', 'route-start');
    });

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
      spreadsScreenPresent:Boolean(this.screen),
      spreadGridPresent:Boolean(this.grid),
      spreadResultPresent:Boolean(this.result),
      readingAttached:Boolean(this.reading),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      methodsPreserved:15,
      freeMethodsPreserved:4,
      premiumMethodsPreserved:11,
      celticCrossPositionsPreserved:10,
      royalTableCardsPreserved:78,
      privateContentReads:0,
      cardIdentityReads:0,
      cardSelectionChanges:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...TIRAGENS_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      responses:this.responses,
      choiceGestures:this.choiceGestures,
      revealGestures:this.revealGestures,
      readingUpdates:this.readingUpdates,
      attachments:this.attachments,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.reading?.dataset) {
      delete this.reading.dataset.spreadsSoul;
      delete this.reading.dataset.spreadsSoulPhase;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.spreadsSoul;
      delete this.screen.dataset.spreadsSoulPhase;
      delete this.screen.dataset.spreadsSoulPresence;
      delete this.screen.dataset.spreadsSoulSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13SpreadsSoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createTiragensSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const soul = new TiragensSoulV610(options);
  globalThis[INSTANCE] = soul;
  globalThis.divinaTiragensSoulV610 = soul;
  return soul;
}

export default createTiragensSoulV610;
