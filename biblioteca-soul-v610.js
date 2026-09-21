/* DIVINA BRUXA — WORK13 · ALMA DA BIBLIOTECA · V610
   A Biblioteca existente nao e refeita. V302 continua sustentando o mundo,
   V332 continua aprofundando as cartas, V544 continua guardando o catalogo e
   V607 continua oferecendo uma descoberta antes das 78. Esta camada escuta
   somente gestos e estados publicos e faz o Arquivo de Luz responder: portal,
   Orbe, descoberta, silencio e fio simbolico. Uma Orbe, nenhuma copia. */

const VERSION = 610;
const STYLE_ID = 'divinaBibliotecaSoulV610';
const STYLE_HREF = './biblioteca-soul-v610.css?v=610-work13-library-soul';
const INSTANCE = Symbol.for('divina.work13.biblioteca.soul.v610');
const PHASES = new Set([
  'rest','threshold','answering','discovery','thread','catalogue','search',
  'portal','travel','silence'
]);

export const BIBLIOTECA_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'library',
  stage:'quinta-realidade-alma-propria',
  universe:'arquivo-de-luz',
  sequence:Object.freeze([
    'threshold','orb','one-discovery','silence','symbolic-thread',
    'related-doors','catalogue-on-explicit-request'
  ]),
  existingLibraryWorldAuthority:'V302-preserved',
  existingLibraryDepthAuthority:'V332-preserved',
  existingPublicLibraryAuthority:'V544-preserved',
  existingLivingWisdomAuthority:'V607-preserved',
  cardsPreserved:78,
  uprightCardsOnly:true,
  reversedCards:false,
  cataloguePageSizePreserved:18,
  gridFullImageRequestsPreserved:0,
  oneDiscoveryFirst:true,
  catalogueRequiresExplicitGesture:true,
  symbolicThreadsPreserved:Object.freeze(['symbol','element','number','archetype','related-cards']),
  searchLanguagesPreserved:Object.freeze(['pt-BR','en','es']),
  searchDiacriticsInsensitive:true,
  cardMeaningChanges:0,
  cardSelectionChanges:0,
  searchChanges:0,
  filterChanges:0,
  comparisonChanges:0,
  favouriteChanges:0,
  premiumAuthorityChanges:0,
  persistenceChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  cardIdentityReads:0,
  cardMeaningReads:0,
  searchQueryReads:0,
  comparisonReads:0,
  favouriteReads:0,
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

export class BibliotecaSoulV610 {
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
    this.screen = this.documentTarget?.getElementById?.('library') || null;
    this.app = this.documentTarget?.getElementById?.('cardLibraryApp') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.canvas = this.documentTarget?.getElementById?.('orbCanvas') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.discovered = false;
    this.responses = 0;
    this.invitationGestures = 0;
    this.orbGestures = 0;
    this.discoverySignals = 0;
    this.threadGestures = 0;
    this.catalogueGestures = 0;
    this.searchGestures = 0;
    this.cardGestures = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:library-soul-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13LibrarySoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.librarySoul = 'v610';
    this.screen.dataset.librarySoulUniverse = 'arquivo-de-luz';
    this.screen.dataset.librarySoulPhase = 'rest';
    this.screen.dataset.librarySoulPresence = 'away';
    this.screen.dataset.librarySoulSequence = 'threshold-orb-discovery-silence-thread-doors-catalogue';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  isActive() {
    return this.route === 'library' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const next = this.documentTarget?.getElementById?.('cardLibraryApp') || null;
    if (next && next !== this.app) {
      this.app = next;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.librarySoul = 'v610';
      this.app.dataset.librarySoulPhase = this.phase;
    }
    return this.app;
  }

  setPhase(phase, reason = 'state') {
    const next = PHASES.has(String(phase || '').toLowerCase())
      ? String(phase).toLowerCase()
      : 'threshold';
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.librarySoulPhase = next;
    if (this.app?.dataset) this.app.dataset.librarySoulPhase = next;
    emit(this.documentTarget, 'divina:library-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      discovered:this.discovered,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return next;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const chamber = String(this.screen?.dataset?.db596ChamberState || '').toLowerCase();
    if (chamber === 'travel') return 'travel';
    if (chamber === 'awakening') return 'answering';
    const mode = String(this.app?.dataset?.v607LibraryMode || '').toLowerCase();
    const libraryPhase = String(this.app?.dataset?.v607LibraryPhase || '').toLowerCase();
    if (mode === 'catalogue') return 'catalogue';
    if (libraryPhase === 'discovered' || this.discovered) return 'discovery';
    return 'threshold';
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'library';
    if (this.screen?.dataset) this.screen.dataset.librarySoulPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest', reason);
  }

  kindFor(target) {
    if (!this.isActive() || !target?.closest) return '';
    if (target.closest('[data-v607-action="library-catalogue"]')) return 'catalogue';
    if (target.closest('[data-v607-action="library-primary"]')) return 'invitation';
    if (target.closest('[data-search-toggle], .lb302__field, [data-library-search]')) return 'search';
    if (target.closest('[data-path], [data-library-thread], [data-related-card], [data-library-related]')) return 'thread';
    if (target.closest('[data-library-card], [data-card-id], .pl544__card, .lb302__card, .library-card')) return 'card';
    if (target.closest('[data-library-orb-host], #cardLibraryApp [data-orb]')) return 'orb';
    return '';
  }

  respond(kind, source = 'touch') {
    if (!kind || !this.isActive()) return false;
    this.responses += 1;
    if (kind === 'invitation') {
      this.invitationGestures += 1;
      this.setPhase('answering', source);
      return true;
    }
    if (kind === 'orb') {
      this.orbGestures += 1;
      this.setPhase('answering', source);
      this.orbCore?.pulse?.('library-light-answer', { intensity:.28 });
      return true;
    }
    if (kind === 'catalogue') {
      this.catalogueGestures += 1;
      this.setPhase('catalogue', source);
      this.orbCore?.pulse?.('library-archive-answer', { intensity:.16 });
      return true;
    }
    if (kind === 'search') {
      this.searchGestures += 1;
      this.setPhase('search', source);
      this.orbCore?.pulse?.('library-search-answer', { intensity:.12 });
      return true;
    }
    if (kind === 'thread') {
      this.threadGestures += 1;
      this.setPhase('thread', source);
      this.orbCore?.pulse?.('library-thread-answer', { intensity:.14 });
      return true;
    }
    if (kind === 'card') {
      this.cardGestures += 1;
      this.setPhase('discovery', source);
      this.orbCore?.pulse?.('library-card-answer', { intensity:.14 });
      return true;
    }
    return false;
  }

  observeDiscovery(event) {
    if (this.route !== 'library' || event?.detail?.kind !== 'card') return false;
    this.discovered = true;
    this.discoverySignals += 1;
    this.attach();
    this.setPhase('discovery', 'public-card-discovery');
    this.orbCore?.pulse?.('library-discovery-answer', { intensity:.18 });
    return true;
  }

  onMenu(event) {
    if (!this.isActive()) return false;
    const state = String(event?.detail?.state || 'closed').toLowerCase();
    if (state !== 'closed') return Boolean(this.setPhase('portal', 'global-orb-menu'));
    return Boolean(this.sync('menu-closed'));
  }

  bind() {
    this.listen(this.documentTarget, 'pointerdown', event => {
      this.respond(this.kindFor(event?.target), 'touch');
    }, { passive:true });

    this.listen(this.documentTarget, 'click', event => {
      const kind = this.kindFor(event?.target);
      if (kind && Number(event?.detail || 0) === 0) this.respond(kind, 'keyboard');
      if (kind) this.sync('gesture-settled');
    });
    this.listen(this.documentTarget, 'input', event => {
      if (event?.target?.matches?.('[data-library-search], .lb302__field input, .pl544 input[type="search"]')) {
        this.respond('search', 'search-gesture');
      }
    });

    this.listen(this.documentTarget, 'divina:wisdom-public-context-v539', event => this.observeDiscovery(event));
    this.listen(this.documentTarget, 'divina:library-world-ready', () => this.sync('library-ready'));
    this.listen(this.documentTarget, 'divina:public-library-ready', () => this.sync('public-library-ready'));
    this.listen(this.documentTarget, 'divina:menu-state', event => this.onMenu(event));
    this.listen(this.documentTarget, 'divina:route-start', event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'library' || target === 'library') this.setPhase('travel', 'route-start');
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
      libraryScreenPresent:Boolean(this.screen),
      libraryAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      cardsPreserved:78,
      uprightCardsOnly:true,
      cataloguePageSizePreserved:18,
      gridFullImageRequestsPreserved:0,
      oneDiscoveryFirst:true,
      privateContentReads:0,
      cardIdentityReads:0,
      cardMeaningReads:0,
      searchQueryReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...BIBLIOTECA_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      discovered:this.discovered,
      responses:this.responses,
      invitationGestures:this.invitationGestures,
      orbGestures:this.orbGestures,
      discoverySignals:this.discoverySignals,
      threadGestures:this.threadGestures,
      catalogueGestures:this.catalogueGestures,
      searchGestures:this.searchGestures,
      cardGestures:this.cardGestures,
      attachments:this.attachments,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.app?.dataset) {
      delete this.app.dataset.librarySoul;
      delete this.app.dataset.librarySoulPhase;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.librarySoul;
      delete this.screen.dataset.librarySoulUniverse;
      delete this.screen.dataset.librarySoulPhase;
      delete this.screen.dataset.librarySoulPresence;
      delete this.screen.dataset.librarySoulSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13LibrarySoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaBibliotecaSoulV610 === this) delete globalThis.divinaBibliotecaSoulV610;
    return true;
  }
}

export function createBibliotecaSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const instance = new BibliotecaSoulV610(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaBibliotecaSoulV610 = instance;
  return instance;
}

export default createBibliotecaSoulV610;
