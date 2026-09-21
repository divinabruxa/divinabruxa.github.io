/* DIVINA BRUXA — WORK13 · ALMA DO TAROT LIVRE · V610
   A liberdade permanece intacta. Esta camada escuta os controles existentes,
   responde ao gesto e muda somente a atmosfera: carta, resposta e silencio.
   Nao escolhe cartas, nao interpreta, nao navega e nao cria outra Orbe. */

const VERSION = 610;
const STYLE_ID = 'divinaTarotLivreSoulV610';
const STYLE_HREF = './tarot-livre-soul-v610.css?v=610-work13-tarot-soul';
const INSTANCE = Symbol.for('divina.work13.tarot.livre.soul.v610');

export const TAROT_LIVRE_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'tarot',
  stage:'primeira-realidade-alma-propria',
  sequence:Object.freeze(['orb','card','silence','freedom']),
  existingTarotAuthority:'V517-preserved',
  existingTarotUniverse:'V528-preserved',
  cards:78,
  rows:13,
  columns:6,
  reversedCards:false,
  repetitionBeforeReset:false,
  automaticMeanings:false,
  meaningsAdded:0,
  cardSelectionChanges:0,
  shuffleChanges:0,
  resetChanges:0,
  historyChanges:0,
  mesaRealChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
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

const numberFrom = node => {
  const match = String(node?.textContent || '').match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class TarotLivreSoulV610 {
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
    this.screen = this.documentTarget?.getElementById?.('tarot') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.tableOrb = this.documentTarget?.getElementById?.('tableOrb') || null;
    this.current = this.documentTarget?.getElementById?.('current') || null;
    this.count = this.documentTarget?.getElementById?.('count') || null;
    this.remaining = this.documentTarget?.getElementById?.('remaining') || null;
    this.shuffle = this.documentTarget?.getElementById?.('shuffleDeck') || null;
    this.reset = this.documentTarget?.getElementById?.('resetDeck') || null;
    this.realTable = this.documentTarget?.getElementById?.('realTable') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.responses = 0;
    this.revealsObserved = 0;
    this.shuffleGestures = 0;
    this.resetGestures = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:tarot-soul-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13TarotSoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.tarotSoul = 'v610';
    this.screen.dataset.tarotSoulPhase = 'rest';
    this.screen.dataset.tarotSoulPresence = 'away';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  isActive() {
    return this.route === 'tarot' && this.screen?.classList?.contains?.('active') !== false;
  }

  setPhase(phase, reason = 'gesture') {
    const next = String(phase || 'rest').toLowerCase();
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.tarotSoulPhase = next;
    emit(this.documentTarget, 'divina:tarot-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      revealed:numberFrom(this.count),
      automaticNavigation:false,
      automaticMeaning:false
    });
    return next;
  }

  answer(source = 'touch') {
    if (!this.isActive()) return false;
    this.responses += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('tarot-free-answer', { intensity:.46 });
    return true;
  }

  silence(source = 'reveal') {
    if (!this.isActive()) return false;
    this.setPhase('silence', source);
    return true;
  }

  observeReveal(source = 'touch') {
    if (!this.isActive()) return false;
    this.revealsObserved += 1;
    return this.silence(source);
  }

  onShuffle() {
    if (!this.isActive()) return false;
    this.shuffleGestures += 1;
    this.orbCore?.pulse?.('tarot-free-shuffle', { intensity:.28 });
    this.setPhase('ready', 'shuffle');
    return true;
  }

  onReset() {
    if (!this.isActive()) return false;
    this.resetGestures += 1;
    this.setPhase('origin', 'reset');
    return true;
  }

  sync(reason = 'sync') {
    const active = this.route === 'tarot';
    if (this.screen?.dataset) this.screen.dataset.tarotSoulPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    const empty = this.current?.classList?.contains?.('empty') === true || numberFrom(this.count) === 0;
    return this.setPhase(empty ? 'origin' : 'silence', reason);
  }

  bind() {
    this.listen(this.tableOrb, 'pointerdown', () => this.answer('touch'), { passive:true });
    this.listen(this.tableOrb, 'pointerup', () => this.silence('release'), { passive:true });
    this.listen(this.tableOrb, 'pointercancel', () => this.setPhase('ready', 'cancel'), { passive:true });
    this.listen(this.tableOrb, 'click', event => {
      if (Number(event?.detail || 0) === 0 && this.phase !== 'answering') this.answer('keyboard');
      this.observeReveal(event?.detail === 0 ? 'keyboard' : 'touch');
    });
    this.listen(this.shuffle, 'click', () => this.onShuffle());
    this.listen(this.reset, 'click', () => this.onReset());

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
    const rowCount = Number(this.realTable?.getAttribute?.('aria-rowcount') || 13);
    const columnCount = Number(this.realTable?.getAttribute?.('aria-colcount') || 6);
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      tarotScreenPresent:Boolean(this.screen),
      revealOrbPresent:Boolean(this.tableOrb),
      shufflePreserved:Boolean(this.shuffle),
      resetPreserved:Boolean(this.reset),
      mesaRealPreserved:Boolean(this.realTable),
      mesaRealPositions:rowCount * columnCount,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      reversedCards:false,
      automaticMeanings:false,
      cardSelectionChanges:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...TAROT_LIVRE_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      responses:this.responses,
      revealsObserved:this.revealsObserved,
      shuffleGestures:this.shuffleGestures,
      resetGestures:this.resetGestures,
      revealed:numberFrom(this.count),
      remaining:numberFrom(this.remaining),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.screen?.dataset) {
      delete this.screen.dataset.tarotSoul;
      delete this.screen.dataset.tarotSoulPhase;
      delete this.screen.dataset.tarotSoulPresence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13TarotSoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createTarotLivreSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const soul = new TarotLivreSoulV610(options);
  globalThis[INSTANCE] = soul;
  globalThis.divinaTarotLivreSoulV610 = soul;
  return soul;
}
