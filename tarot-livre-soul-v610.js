/* DIVINA BRUXA — WORK13 · TAROT LIVRE · CÂMARA DO VAZIO VIOLETA · V614
   A Orbe brilha sozinha e conserva um único gesto: revelar. A carta responde,
   o nome chega pelo motor existente e o mundo volta ao silêncio. Esta camada
   não escolhe cartas, não interpreta, não navega e não cria outra Orbe. */

const VERSION = 614;
const STYLE_ID = 'divinaTarotLivreWorldV614';
const STYLE_HREF = './tarot-livre-world-v614.css?v=614-camara-vazio-violeta';
const INSTANCE = Symbol.for('divina.work13.tarot.livre.world.v614');

export const TAROT_LIVRE_WORLD_CONTRACT_V614 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'tarot',
  universe:'camara-do-vazio-violeta',
  stage:'renovacao-dos-mundos-1-tarot-livre',
  sequence:Object.freeze(['arrival','orb-alone','touch','card','silence','freedom']),
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
  orbAloneOutsideMenu:true,
  orbitingListsVisible:false,
  orbitalCardsVisible:false,
  decorativeRingsVisible:false,
  onePrimaryGesture:true,
  immediateTouchResponse:true,
  revealEvent:'tarot:supreme-revealed',
  cardNameOnlyResponse:true,
  tableDeferredRendering:true,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  pentagramAlwaysAvailable:true,
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

/* Compatibilidade pública: consumidores antigos recebem o novo contrato sem
   criar uma segunda instância ou manter duas almas em paralelo. */
export const TAROT_LIVRE_SOUL_CONTRACT_V610 = TAROT_LIVRE_WORLD_CONTRACT_V614;

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
    this.realTableViewport = this.documentTarget?.getElementById?.('realTableViewport') || null;
    this.orbitalCards = this.documentTarget?.getElementById?.('orbitalCards') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.cardState = 'empty';
    this.responses = 0;
    this.revealsObserved = 0;
    this.shuffleGestures = 0;
    this.resetGestures = 0;
    this.revealEvents = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:tarot-world-ready', this.status());
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
    if (this.root?.dataset) {
      this.root.dataset.work13TarotSoul = 'v614';
      this.root.dataset.work13TarotWorld = 'v614';
    }
    if (!this.screen?.dataset) return false;
    this.screen.dataset.tarotSoul = 'v614';
    this.screen.dataset.tarotWorld = 'v614';
    this.screen.dataset.tarotSoulPhase = 'rest';
    this.screen.dataset.tarotSoulPresence = 'away';
    this.screen.dataset.tarotCardState = 'empty';
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
    emit(this.documentTarget, 'divina:tarot-world-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      cardState:this.cardState,
      reason,
      revealed:numberFrom(this.count),
      orbAlone:true,
      automaticNavigation:false,
      automaticMeaning:false
    });
    return next;
  }

  syncCardState(force = '') {
    const revealed = force === 'revealed'
      || (force !== 'empty'
        && this.current?.classList?.contains?.('empty') !== true
        && numberFrom(this.count) > 0);
    this.cardState = revealed ? 'revealed' : 'empty';
    if (this.screen?.dataset) this.screen.dataset.tarotCardState = this.cardState;
    this.tableOrb?.setAttribute?.(
      'aria-label',
      revealed ? 'Revelar a próxima carta do Tarot Livre' : 'Revelar a primeira carta do Tarot Livre'
    );
    return this.cardState;
  }

  answer(source = 'touch') {
    if (!this.isActive()) return false;
    this.responses += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('tarot-free-answer', { intensity:.42 });
    return true;
  }

  receive(source = 'release') {
    if (!this.isActive()) return false;
    this.setPhase('receiving', source);
    return true;
  }

  silence(source = 'reveal') {
    if (!this.isActive()) return false;
    this.setPhase('silence', source);
    return true;
  }

  observeReveal(source = 'engine') {
    if (!this.isActive()) return false;
    this.revealsObserved += 1;
    this.revealEvents += 1;
    this.syncCardState('revealed');
    return this.silence(source);
  }

  onShuffle() {
    if (!this.isActive()) return false;
    this.shuffleGestures += 1;
    this.orbCore?.pulse?.('tarot-free-shuffle', { intensity:.24 });
    this.setPhase('ready', 'shuffle');
    return true;
  }

  onReset() {
    if (!this.isActive()) return false;
    this.resetGestures += 1;
    this.cardState = 'empty';
    if (this.screen?.dataset) this.screen.dataset.tarotCardState = 'empty';
    this.setPhase('origin', 'reset');
    return true;
  }

  sync(reason = 'sync') {
    const active = this.route === 'tarot';
    if (this.screen?.dataset) this.screen.dataset.tarotSoulPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    const cardState = this.syncCardState();
    return this.setPhase(cardState === 'empty' ? 'origin' : 'silence', reason);
  }

  bind() {
    this.listen(this.tableOrb, 'pointerdown', () => this.answer('touch'), { passive:true });
    this.listen(this.tableOrb, 'pointerup', () => this.receive('release'), { passive:true });
    this.listen(this.tableOrb, 'pointercancel', () => this.setPhase('ready', 'cancel'), { passive:true });
    this.listen(this.tableOrb, 'click', event => {
      if (Number(event?.detail || 0) === 0 && this.phase !== 'answering') this.answer('keyboard');
      this.receive(event?.detail === 0 ? 'keyboard' : 'touch');
    });
    this.listen(this.windowTarget, 'tarot:supreme-revealed', () => this.observeReveal('card-revealed'));
    this.listen(this.documentTarget, 'divina:tarot-supreme-ready', () => this.sync('engine-ready'));
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
      orbAloneOutsideMenu:true,
      orbitingListsVisible:false,
      orbitalCardsPresentButSilent:Boolean(this.orbitalCards),
      tableDeferredRendering:Boolean(this.realTableViewport),
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
      ...TAROT_LIVRE_WORLD_CONTRACT_V614,
      route:this.route,
      phase:this.phase,
      cardState:this.cardState,
      responses:this.responses,
      revealsObserved:this.revealsObserved,
      revealEvents:this.revealEvents,
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
      delete this.screen.dataset.tarotWorld;
      delete this.screen.dataset.tarotSoulPhase;
      delete this.screen.dataset.tarotSoulPresence;
      delete this.screen.dataset.tarotCardState;
    }
    if (this.root?.dataset) {
      delete this.root.dataset.work13TarotSoul;
      delete this.root.dataset.work13TarotWorld;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export const TarotLivreWorldV614 = TarotLivreSoulV610;

export function createTarotLivreSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const soul = new TarotLivreSoulV610(options);
  globalThis[INSTANCE] = soul;
  globalThis.divinaTarotLivreSoulV610 = soul;
  globalThis.divinaTarotLivreWorldV614 = soul;
  return soul;
}

export const createTarotLivreWorldV614 = createTarotLivreSoulV610;
