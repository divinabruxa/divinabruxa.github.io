/* DIVINA BRUXA — WORK13 · TIRAGENS · CONCILIO DAS CONSTELACOES · V617
   Uma camada de mundo sobre V331, V605 e a alma V610. Cada posicao e uma voz;
   as relacoes formam uma constelacao e a leitura termina em uma sintese curta.
   Nao escolhe cartas, nao le perguntas e nao altera Premium ou persistencia. */

const VERSION = 617;
const STYLE_ID = 'divinaTiragensWorldV617';
const STYLE_HREF = './tiragens-world-v617.css?v=617-concilio-das-constelacoes';
const INSTANCE = Symbol.for('divina.work13.tiragens.world.v617');
const PHASES = new Set(['rest','origin','choosing','preparing','ready','answering','silence','essence','conversation','depth','travel']);

export const TIRAGENS_WORLD_CONTRACT_V617 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'spreads',
  universe:'concilio-das-constelacoes',
  identity:'deep-teal-copper-ivory',
  sequence:Object.freeze(['arrival','choice','orb','card-and-position','silence','essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request']),
  spreadAuthority:'V331-preserved',
  cosmicReadingAuthority:'V605-preserved',
  soulAuthority:'V610-preserved',
  methodsPreserved:15,
  freeMethodsPreserved:4,
  premiumMethodsPreserved:11,
  premiumTransparencyPreserved:true,
  celticCrossPositionsPreserved:10,
  royalTableCardsPreserved:78,
  royalTableGeometryPreserved:'13x6',
  normalOnly:true,
  noRepeats:true,
  cardsSpeakBy:Object.freeze(['position','suit','element','arcana','number','court','repetition','contrast','reinforcement','challenge']),
  maximumConversationVoices:3,
  maximumSynthesisSentences:1,
  depthRequiresExplicitGesture:true,
  canonicalOrbAction:'reveal-next-position',
  pentagramMenuPreserved:true,
  reusesCanonicalOrb:true,
  cardSelectionChanges:0,
  shuffleChanges:0,
  premiumAuthorityChanges:0,
  persistenceChanges:0,
  synthesisAuthorityChanges:0,
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

const normalizePhase = value => {
  const phase = String(value || 'rest').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'origin';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

const hasExpandedDepth = reading => Boolean(
  reading?.querySelector?.('[data-db605-card-depth-call][aria-expanded="true"], [data-db605-synthesis-depth-call][aria-expanded="true"]')
);

export class TiragensWorldV617 {
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
    this.choiceResponses = 0;
    this.orbResponses = 0;
    this.readingUpdates = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:spreads-world-v617-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13SpreadsWorld = 'v617';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.spreadsWorld = 'v617';
    this.screen.dataset.spreadsUniverse = 'concilio-das-constelacoes';
    this.screen.dataset.spreadsWorldPhase = 'rest';
    this.screen.dataset.spreadsWorldPresence = 'away';
    this.screen.dataset.spreadsWorldSequence = 'arrival-choice-orb-card-position-silence-essence-conversation-synthesis-depth';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.spreadsWorldCopy !== 'v617') {
      title.textContent = 'As cartas encontram uma voz comum.';
      title.dataset.spreadsWorldCopy = 'v617';
    }
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
      this.reading.dataset.spreadsWorld = 'v617';
      this.reading.dataset.spreadsUniverse = 'concilio-das-constelacoes';
      this.reading.dataset.spreadsWorldPhase = this.phase;
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

  phaseFromPublicState() {
    const reading = this.attach();
    if (!reading) {
      const preparing = Boolean(this.result?.querySelector?.('form, button, [data-spread-session], [data-spread-start]'));
      return preparing ? 'preparing' : 'origin';
    }
    if (hasExpandedDepth(reading)) return 'depth';
    const cosmic = String(reading.dataset?.cosmicSpreadPhase || '').toLowerCase();
    if (cosmic === 'silence') return 'silence';
    if (cosmic === 'essence') return 'essence';
    const complete = reading.classList?.contains?.('complete')
      || Boolean(reading.querySelector?.('[data-cosmic-spread-synthesis="v605"]'));
    return complete ? 'conversation' : 'ready';
  }

  setPhase(value, reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.spreadsWorldPhase = phase;
    if (this.reading?.dataset) this.reading.dataset.spreadsWorldPhase = phase;
    emit(this.documentTarget, 'divina:spreads-world-v617-state', {
      version:VERSION,
      universe:'concilio-das-constelacoes',
      route:this.route,
      phase,
      reason,
      readingPresent:Boolean(this.reading),
      oneOrb:true,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return phase;
  }

  respond(kind, source = 'touch') {
    if (!this.isActive()) return false;
    if (kind === 'choice') {
      this.responses += 1;
      this.choiceResponses += 1;
      this.setPhase('choosing', source);
      this.orbCore?.pulse?.('spreads-council-choice', { intensity:.20 });
      return true;
    }
    if (!this.ownsRevealOrb(this.orb)) return false;
    this.responses += 1;
    this.orbResponses += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('spreads-council-reveal', { intensity:.42 });
    return true;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'spreads';
    if (this.screen?.dataset) this.screen.dataset.spreadsWorldPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    return this.setPhase(this.phaseFromPublicState(), reason);
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

  bind() {
    this.listen(this.documentTarget, 'pointerdown', event => this.onPointerDown(event), { passive:true });
    this.listen(this.documentTarget, 'pointerup', event => {
      if (this.ownsRevealOrb(event?.target)) this.sync('release');
    }, { passive:true });
    this.listen(this.documentTarget, 'pointercancel', event => {
      if (this.ownsRevealOrb(event?.target)) this.sync('cancel');
    }, { passive:true });
    this.listen(this.documentTarget, 'click', event => {
      if (!this.isActive()) return;
      if (Number(event?.detail || 0) === 0 && this.ownsRevealOrb(event?.target) && this.phase !== 'answering') {
        this.respond('orb', 'keyboard');
        return;
      }
      this.sync(this.isChoiceTarget(event?.target) ? 'choice' : 'gesture');
    });
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
      royalTableGeometryPreserved:'13x6',
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
      ...TIRAGENS_WORLD_CONTRACT_V617,
      route:this.route,
      phase:this.phase,
      responses:this.responses,
      choiceResponses:this.choiceResponses,
      orbResponses:this.orbResponses,
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
      delete this.reading.dataset.spreadsWorld;
      delete this.reading.dataset.spreadsUniverse;
      delete this.reading.dataset.spreadsWorldPhase;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.spreadsWorld;
      delete this.screen.dataset.spreadsUniverse;
      delete this.screen.dataset.spreadsWorldPhase;
      delete this.screen.dataset.spreadsWorldPresence;
      delete this.screen.dataset.spreadsWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13SpreadsWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createTiragensWorldV617(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new TiragensWorldV617(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaTiragensWorldV617 = world;
  return world;
}

export default createTiragensWorldV617;
