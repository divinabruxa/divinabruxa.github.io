/* DIVINA BRUXA — WORK13 · DIARIO · CAMARA DA TINTA VIVA · V619
   Uma camada de mundo sobre V556, V317, V596, V607 e a alma V610. A Orbe abre
   a camara; depois sobra o papel: escrita, autosave, tinta assentada e silencio.
   Nao altera editor, memorias, Espelho, persistencia, consentimento ou menu. */

const VERSION = 619;
const STYLE_ID = 'divinaDiarioWorldV619';
const STYLE_HREF = './diario-world-v619.css?v=619-camara-da-tinta-viva';
const INSTANCE = Symbol.for('divina.work13.diario.world.v619');
const PHASES = new Set([
  'rest','threshold','opening','writing','saving','saved','details','memories',
  'mirror','portal','travel','silence'
]);

export const DIARIO_WORLD_CONTRACT_V619 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'journal',
  universe:'camara-da-tinta-viva',
  identity:'obsidian-parchment-carmine-moon-silver',
  sequence:Object.freeze([
    'arrival','orb-threshold','blank-page','direct-writing','silent-autosave',
    'ink-settles','optional-details','memories-on-explicit-request',
    'aggregate-mirror-on-explicit-request','return','silence'
  ]),
  journalAuthority:'V556-preserved',
  journalWorldAuthority:'V317-preserved',
  chamberAuthority:'V596-preserved',
  livingWisdomAuthority:'V607-preserved',
  soulAuthority:'V610-preserved',
  directWritingFirst:true,
  blankPageFirst:true,
  cursorAuthorityPreserved:true,
  silentAutosavePreserved:true,
  localDraftRecoveryPreserved:true,
  offlinePreserved:true,
  syncConflictProtectionPreserved:true,
  memoriesRequireExplicitGesture:true,
  mirrorRequiresExplicitGesture:true,
  mirrorAggregateOnly:true,
  mirrorDiagnosis:false,
  mirrorPrediction:false,
  timelinePageSizePreserved:12,
  timelineFullImageRequestsPreserved:0,
  capabilitiesPreserved:Object.freeze([
    'title','free-text','date-time','optional-mood','tags','favourites',
    'card-relations','spread-relations','daily-card-relations','lesson-relations',
    'autosave','local-drafts','search','filters','calendar','timeline',
    'export','import','edit','delete','offline','sync-conflicts'
  ]),
  privateByDefault:true,
  adminBodyAccess:false,
  analyticsBodyAccess:false,
  whitSilentRead:false,
  whitShareRequiresExplicitTemporaryConsent:true,
  exportUserControlled:true,
  deleteUserControlled:true,
  automaticSharing:false,
  journalFunctionChanges:0,
  persistenceChanges:0,
  syncChanges:0,
  consentChanges:0,
  orbActionChanges:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  titleReads:0,
  journalBodyReads:0,
  tagReads:0,
  questionReads:0,
  draftReads:0,
  historyReads:0,
  formValueReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  visibleCopyChanges:1,
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
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{ detail:Object.freeze(detail) }));
  return true;
};

export class DiarioWorldV619 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('journal') || null;
    this.app = this.documentTarget?.getElementById?.('journalApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.soulResponses = 0;
    this.savedSignals = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:journal-world-v619-ready',this.status());
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
    if (this.root?.dataset) this.root.dataset.work13JournalWorld = 'v619';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.journalWorld = 'v619';
    this.screen.dataset.journalUniverse = 'camara-da-tinta-viva';
    this.screen.dataset.journalWorldPhase = 'rest';
    this.screen.dataset.journalWorldPresence = 'away';
    this.screen.dataset.journalWorldSequence = 'arrival-orb-page-write-autosave-ink-details-memories-mirror-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.journalWorldCopy !== 'v619') {
      title.textContent = 'A página espera sem observar.';
      title.dataset.journalWorldCopy = 'v619';
    }
    return true;
  }

  listen(target,type,handler,options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? { ...options,signal } : options);
  }

  isActive() {
    return this.route === 'journal' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('journal') || null;
    const nextApp = this.documentTarget?.getElementById?.('journalApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.journalWorld = 'v619';
      this.app.dataset.journalUniverse = 'camara-da-tinta-viva';
      this.app.dataset.journalWorldPhase = this.phase;
      this.app.dataset.journalWorldPrivacy = 'body-unread';
    }
    return this.app;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const soul = String(
      this.app?.dataset?.journalSoulPhase
      || this.screen?.dataset?.journalSoulPhase
      || ''
    ).toLowerCase();
    if (PHASES.has(soul) && soul !== 'rest') return soul;
    const chamber = String(this.screen?.dataset?.db596ChamberState || '').toLowerCase();
    const chamberMode = String(this.screen?.dataset?.db596ChamberMode || '').toLowerCase();
    const wisdomMode = String(this.app?.dataset?.v607JournalMode || '').toLowerCase();
    if (chamber === 'travel') return 'travel';
    if (chamber === 'awakening') return 'opening';
    if (chamber === 'threshold') return 'threshold';
    if (wisdomMode === 'review' || chamberMode === 'mirror') return 'mirror';
    if (chamberMode === 'calendar') return 'memories';
    if (chamber === 'engaged' || wisdomMode === 'write') return 'writing';
    return chamber === 'present' ? 'opening' : 'threshold';
  }

  setPhase(value,reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.journalWorldPhase = phase;
    if (this.app?.dataset) this.app.dataset.journalWorldPhase = phase;
    emit(this.documentTarget,'divina:journal-world-v619-state',{
      version:VERSION,
      universe:'camara-da-tinta-viva',
      route:this.route,
      phase,
      reason,
      privateContentIncluded:false,
      oneOrb:true,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return phase;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'journal';
    if (this.screen?.dataset) this.screen.dataset.journalWorldPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest',reason);
  }

  observeSoul(event) {
    const detail = event?.detail && typeof event.detail === 'object' ? event.detail : {};
    this.soulResponses += 1;
    if (!this.isActive()) return false;
    const phase = normalizePhase(detail.phase);
    if (phase === 'saved') this.savedSignals += 1;
    return Boolean(this.setPhase(phase,String(detail.reason || 'journal-soul')));
  }

  bind() {
    this.listen(this.documentTarget,'divina:journal-soul-state',event => this.observeSoul(event));
    this.listen(this.documentTarget,'divina:journal-world-ready',() => this.sync('journal-engine-ready'));
    this.listen(this.documentTarget,'divina:living-wisdom-ready',() => this.sync('wisdom-ready'));
    this.listen(this.documentTarget,'divina:route-start',event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'journal' || target === 'journal') this.setPhase('travel','route-start');
    });

    const onRoute = event => {
      this.route = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget,this.windowTarget)
      );
      this.sync('route');
    };
    this.listen(this.documentTarget,'divina:route-ready',onRoute);
    this.listen(this.documentTarget,'divina:page-ready',onRoute);
    this.listen(this.documentTarget,'divina:supreme-orb-did-navigate',onRoute);
    this.listen(this.windowTarget,'hashchange',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('hashchange');
    },{ passive:true });
    this.listen(this.windowTarget,'pageshow',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('pageshow');
    },{ passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      journalScreenPresent:Boolean(this.screen),
      journalAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0,canonicalOrbs - 1),
      directWritingFirst:true,
      blankPageFirst:true,
      timelinePageSizePreserved:12,
      timelineFullImageRequestsPreserved:0,
      mirrorAggregateOnly:true,
      adminBodyAccess:false,
      analyticsBodyAccess:false,
      whitSilentRead:false,
      privateContentReads:0,
      journalBodyReads:0,
      formValueReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...DIARIO_WORLD_CONTRACT_V619,
      route:this.route,
      phase:this.phase,
      soulResponses:this.soulResponses,
      savedSignals:this.savedSignals,
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
      delete this.app.dataset.journalWorld;
      delete this.app.dataset.journalUniverse;
      delete this.app.dataset.journalWorldPhase;
      delete this.app.dataset.journalWorldPrivacy;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.journalWorld;
      delete this.screen.dataset.journalUniverse;
      delete this.screen.dataset.journalWorldPhase;
      delete this.screen.dataset.journalWorldPresence;
      delete this.screen.dataset.journalWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13JournalWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaDiarioWorldV619 === this) delete globalThis.divinaDiarioWorldV619;
    return true;
  }
}

export function createDiarioWorldV619(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new DiarioWorldV619(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaDiarioWorldV619 = world;
  return world;
}

export default createDiarioWorldV619;
