/* DIVINA BRUXA — WORK13 · LOJA · CASA DAS ESCOLHAS VIVAS · V622
   Camada de mundo sobre Loja Amazon V543, Camaras V596 e Clareza V608.
   Reusa intencoes, catalogo, busca, favoritos e passagem externa existentes.
   Nao le busca, favoritos, links, conta, Diario, consultas ou pagamento. */

const VERSION = 622;
const STYLE_ID = 'divinaLojaWorldV622';
const STYLE_HREF = './loja-world-v622.css?v=622-casa-das-escolhas-vivas';
const INSTANCE = Symbol.for('divina.work13.loja.world.v622');
const PHASES = new Set([
  'rest','threshold','invitation','intentions','catalog','discovery','filtering',
  'favorites','product','passage','settled','portal','travel','silence'
]);

export const LOJA_WORLD_CONTRACT_V622 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'store',
  name:'Loja',
  universe:'casa-das-escolhas-vivas',
  identity:'night-emerald-patina-copper-amber-parchment',
  sequence:Object.freeze([
    'arrival','one-clear-intention','four-curated-paths','one-explicit-path',
    'twenty-one-curated-choices','category-search-or-favorites-on-explicit-request',
    'product-truth','external-amazon-passage','return','silence'
  ]),
  storeAuthority:'V543-preserved',
  chamberAuthority:'V596-preserved',
  livingCommerceAuthority:'V608-preserved',
  productsPreserved:21,
  intentionPathsPreserved:4,
  categoriesPreserved:9,
  productCategoriesPreserved:8,
  categoryNamesPreserved:Object.freeze([
    'Todos','Baralhos','Livros','Cristais','Ritual','Acessórios',
    'Decoração','Apple & Tecnologia','Presentes Premium'
  ]),
  featuredChoicesPreserved:7,
  freeAccessPreserved:true,
  manualCuratedCatalogPreserved:true,
  officialApiRequiredForMutableClaims:true,
  destinationHost:'www.amazon.com.br',
  affiliateDisclosureAdjacentPreserved:true,
  affiliateTagAuthority:'V543-config-preserved',
  affiliateTagHardcodedByV622:false,
  affiliateTagChanges:0,
  checkout:'external-amazon-only',
  checkoutInternal:false,
  realBilling:false,
  purchaseInsideDivina:false,
  priceCache:false,
  stockCache:false,
  ratingCache:false,
  fakeDiscountClaims:0,
  fakeScarcityClaims:0,
  officialPartnershipClaim:false,
  productImagesAuthority:'V543-editorial-original-only',
  productUnavailablePolicyPreserved:'unavailable-or-archived-never-silent-delete',
  searchLocalOnlyPreserved:true,
  favoritesLocalOnlyPreserved:true,
  favoritesAuthorityChanges:0,
  privateByDefault:true,
  analyticsSearchTextAccess:false,
  analyticsFavoritesAccess:false,
  analyticsJournalAccess:false,
  analyticsTarotQuestionAccess:false,
  analyticsWhitPromptAccess:false,
  analyticsConsultationAccess:false,
  analyticsContactAccess:false,
  existingStoreBodyReused:true,
  separateStoreBody:false,
  storeFunctionChanges:0,
  productChanges:0,
  categoryChanges:0,
  collectionChanges:0,
  linkChanges:0,
  trackingChanges:0,
  checkoutChanges:0,
  adminChanges:0,
  privateContentReads:0,
  searchTextReads:0,
  favoritesReads:0,
  affiliateUrlReads:0,
  accountDataReads:0,
  paymentDataReads:0,
  journalBodyReads:0,
  consultationBodyReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  visibleCopyChanges:1,
  newVisibleDomNodes:0,
  newImages:0,
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
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const phaseFromSignal = value => {
  const signal = String(value || '').trim().toLowerCase();
  if (/travel|depart|arriv/.test(signal)) return 'travel';
  if (/menu|portal/.test(signal)) return 'portal';
  if (/affiliate|amazon|external|passage|outbound/.test(signal)) return 'passage';
  if (/favorite|saved|heart/.test(signal)) return 'favorites';
  if (/product|choice-detail/.test(signal)) return 'product';
  if (/filter|search|category/.test(signal)) return 'filtering';
  if (/catalog|result|engaged|discover/.test(signal)) return 'catalog';
  if (/intention|collection|path/.test(signal)) return 'intentions';
  if (/guide|invite|open|present/.test(signal)) return 'invitation';
  if (/settle|complete|done|idle|close|ready/.test(signal)) return 'settled';
  if (/silent|quiet|rest/.test(signal)) return 'silence';
  if (/threshold|awak/.test(signal)) return 'threshold';
  return '';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{ detail:Object.freeze(detail) }));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class LojaWorldV622 {
  constructor({
    amazonStore = globalThis.divinaAmazonStoreReleaseV543?.core,
    livingCommerce = globalThis.divinaLivingCommercePathV608,
    chambers = globalThis.divinaRealityChambersV596,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.amazonStore = amazonStore || null;
    this.livingCommerce = livingCommerce || null;
    this.chambers = chambers || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('store') || null;
    this.app = this.documentTarget?.getElementById?.('storeApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.publicSignals = 0;
    this.intentionSignals = 0;
    this.discoverySignals = 0;
    this.passageSignals = 0;
    this.favoriteSignals = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:loja-world-v622-ready',this.publicStatus());
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
    if (this.root?.dataset) this.root.dataset.work13LojaWorld = 'v622';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.lojaWorld = 'v622';
    this.screen.dataset.lojaUniverse = 'casa-das-escolhas-vivas';
    this.screen.dataset.lojaWorldPhase = 'rest';
    this.screen.dataset.lojaWorldPresence = 'away';
    this.screen.dataset.lojaWorldSequence = 'arrival-intention-paths-choice-catalog-discovery-truth-amazon-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.lojaWorldCopy !== 'v622') {
      title.textContent = 'Toda escolha começa por uma intenção.';
      title.dataset.lojaWorldCopy = 'v622';
    }
    return true;
  }

  listen(target,type,handler,options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? { ...options,signal } : options);
  }

  isActive() {
    return this.route === 'store' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('store') || null;
    const nextApp = this.documentTarget?.getElementById?.('storeApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.lojaWorld = 'v622';
      this.app.dataset.lojaUniverse = 'casa-das-escolhas-vivas';
      this.app.dataset.lojaWorldPhase = this.phase;
      this.app.dataset.lojaWorldPrivacy = 'search-favorites-links-private-unread';
    }
    return this.app;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const candidates = [
      this.screen?.dataset?.v608CommerceMode,
      this.screen?.dataset?.db596ChamberMode,
      this.screen?.dataset?.db596ChamberState,
      this.app?.dataset?.storePhase,
      this.app?.dataset?.storeState
    ];
    for (const candidate of candidates) {
      const phase = phaseFromSignal(candidate);
      if (phase && phase !== 'silence') return phase;
    }
    return 'threshold';
  }

  setPhase(value,reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.lojaWorldPhase = phase;
    if (this.app?.dataset) this.app.dataset.lojaWorldPhase = phase;
    emit(this.documentTarget,'divina:loja-world-v622-state',{
      version:VERSION,
      universe:'casa-das-escolhas-vivas',
      route:this.route,
      phase,
      reason:String(reason || 'state').slice(0,64),
      privateContentIncluded:false,
      oneOrb:true,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      checkoutInternal:false,
      realBilling:false
    });
    return phase;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'store';
    if (this.screen?.dataset) this.screen.dataset.lojaWorldPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest',reason);
  }

  observePublicSignal(event, fallback = '') {
    this.publicSignals += 1;
    if (!this.isActive()) return false;
    const detail = event?.detail || {};
    if (detail.route && normalizeRoute(detail.route) !== 'store') return false;
    const phase = phaseFromSignal(detail.state || detail.phase || detail.mode || fallback);
    if (!phase) return false;
    if (phase === 'intentions') this.intentionSignals += 1;
    if (phase === 'catalog' || phase === 'filtering' || phase === 'product') this.discoverySignals += 1;
    if (phase === 'passage') this.passageSignals += 1;
    if (phase === 'favorites') this.favoriteSignals += 1;
    return Boolean(this.setPhase(phase,`public-${event?.type || 'signal'}`));
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc,'divina:store-world-ready',event => this.observePublicSignal(event,'invitation'));
    this.listen(doc,'divina:living-commerce-state',event => this.observePublicSignal(event,'invitation'));
    this.listen(doc,'divina:reality-chamber-state',event => this.observePublicSignal(event,'threshold'));
    this.listen(doc,'divina:store-state',event => this.observePublicSignal(event,'catalog'));
    this.listen(doc,'divina:store-catalog-state',event => this.observePublicSignal(event,'catalog'));
    this.listen(doc,'divina:store-affiliate-passage',event => this.observePublicSignal(event,'passage'));

    this.listen(doc,'click',event => {
      if (!this.isActive()) return;
      const target = event.target?.closest?.('button,a,summary');
      if (!target) return;
      if (target.matches?.('[data-v608-action="store-start"]')) {
        this.intentionSignals += 1;
        this.setPhase('intentions','explicit-intention');
        return;
      }
      if (target.matches?.('#storeApp [data-collection],[data-collection]')) {
        this.discoverySignals += 1;
        this.setPhase('catalog','explicit-path');
        return;
      }
      if (target.matches?.('[data-category],[data-reset-store],[data-clear-search]')) {
        this.discoverySignals += 1;
        this.setPhase('filtering','explicit-filter');
        return;
      }
      if (target.matches?.('[data-favorites],[data-favorite]')) {
        this.favoriteSignals += 1;
        this.setPhase('favorites','explicit-favorite');
        return;
      }
      if (target.matches?.('[data-affiliate]')) {
        this.passageSignals += 1;
        this.setPhase('passage','explicit-amazon-passage');
      }
    },{ capture:true });

    this.listen(doc,'focusin',event => {
      if (!this.isActive() || !this.app?.contains?.(event.target)) return;
      if (!event.target?.matches?.('[data-store-search],input[type="search"]')) return;
      this.discoverySignals += 1;
      this.setPhase('filtering','explicit-search-focus');
    },{ capture:true });

    this.listen(doc,'divina:menu-state',event => {
      const state = String(event?.detail?.state || 'closed').toLowerCase();
      if (state !== 'closed' && this.route === 'store') this.setPhase('portal','menu-open');
      else if (this.route === 'store') this.sync('menu-closed');
    });

    this.listen(doc,'divina:route-start',event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'store' || target === 'store') this.setPhase('travel','route-start');
    });

    const onRoute = event => {
      this.route = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget,this.windowTarget)
      );
      this.sync('route');
    };
    this.listen(doc,'divina:route-ready',onRoute);
    this.listen(doc,'divina:page-ready',onRoute);
    this.listen(doc,'divina:supreme-orb-did-navigate',onRoute);
    this.listen(win,'hashchange',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('hashchange');
    },{ passive:true });
    this.listen(win,'pageshow',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('pageshow');
    },{ passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      storeScreenPresent:Boolean(this.screen),
      storeAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0,canonicalOrbs - 1),
      existingStoreBodyReused:true,
      separateStoreBody:false,
      productsPreserved:21,
      intentionPathsPreserved:4,
      categoriesPreserved:9,
      checkoutInternal:false,
      realBilling:false,
      priceCache:false,
      stockCache:false,
      affiliateTagHardcodedByV622:false,
      privateContentReads:0,
      searchTextReads:0,
      favoritesReads:0,
      affiliateUrlReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      universe:'casa-das-escolhas-vivas',
      route:this.route,
      phase:this.phase,
      publicSignals:this.publicSignals,
      intentionSignals:this.intentionSignals,
      discoverySignals:this.discoverySignals,
      passageSignals:this.passageSignals,
      favoriteSignals:this.favoriteSignals,
      attachments:this.attachments,
      privateContentIncluded:false,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      checkoutInternal:false,
      realBilling:false,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...LOJA_WORLD_CONTRACT_V622,
      ...this.publicStatus(),
      amazonStore:safeStatus(this.amazonStore),
      livingCommerce:safeStatus(this.livingCommerce),
      chambers:safeStatus(this.chambers),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.app?.dataset) {
      delete this.app.dataset.lojaWorld;
      delete this.app.dataset.lojaUniverse;
      delete this.app.dataset.lojaWorldPhase;
      delete this.app.dataset.lojaWorldPrivacy;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.lojaWorld;
      delete this.screen.dataset.lojaUniverse;
      delete this.screen.dataset.lojaWorldPhase;
      delete this.screen.dataset.lojaWorldPresence;
      delete this.screen.dataset.lojaWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13LojaWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaLojaWorldV622 === this) delete globalThis.divinaLojaWorldV622;
    return true;
  }
}

export function createLojaWorldV622(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new LojaWorldV622(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaLojaWorldV622 = world;
  return world;
}

export default createLojaWorldV622;
