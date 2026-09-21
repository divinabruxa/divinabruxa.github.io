/* DIVINA BRUXA — WORK13 · ALMA DO DIARIO E ESPELHO · V610
   O Diario existente nao e refeito. V556 continua guardando cada memoria,
   V317 continua sustentando o mundo, V596 continua abrindo a camara e V607
   continua levando diretamente a escrita. Esta camada observa somente gestos
   e estados publicos: tinta, autosave, memoria, Espelho e silencio. Nunca le
   titulo, corpo, tags, pergunta, rascunho ou historico. Uma Orbe, nenhuma copia. */

const VERSION = 610;
const STYLE_ID = 'divinaDiarioSoulV610';
const STYLE_HREF = './diario-soul-v610.css?v=610-work13-journal-soul';
const INSTANCE = Symbol.for('divina.work13.diario.soul.v610');
const PHASES = new Set([
  'rest','threshold','opening','writing','saving','saved','details','memories',
  'mirror','portal','travel','silence'
]);

export const DIARIO_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'journal',
  stage:'sexta-realidade-alma-propria',
  universe:'camara-da-tinta-lunar',
  sequence:Object.freeze([
    'threshold','direct-writing','silent-autosave','optional-details',
    'explicit-memories','aggregate-mirror','return','silence'
  ]),
  existingJournalAuthority:'V556-preserved',
  existingJournalWorldAuthority:'V317-preserved',
  existingChamberAuthority:'V596-preserved',
  existingLivingWisdomAuthority:'V607-preserved',
  directWritingFirst:true,
  memoriesRequireExplicitGesture:true,
  mirrorRequiresExplicitGesture:true,
  silentAutosavePreserved:true,
  localFirst:true,
  syncDefault:'off-until-explicit-account-consent',
  privateByDefault:true,
  capabilitiesPreserved:Object.freeze([
    'title','text','date-time','optional-mood','tags','favourites',
    'tarot-relations','autosave','local-drafts','search','filters','calendar',
    'timeline','export','import','edit','delete','offline','sync-conflicts'
  ]),
  timelinePageSizePreserved:12,
  timelineFullImageRequestsPreserved:0,
  mirrorAggregateOnly:true,
  mirrorDiagnosis:false,
  mirrorPrediction:false,
  journalFunctionChanges:0,
  persistenceChanges:0,
  syncChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitSilentRead:false,
  whitEntryShareRequiresTemporaryConsent:true,
  adminBodyAccess:false,
  analyticsBodyAccess:false,
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

const closestAny = (target, selectors) => {
  if (!target?.closest) return null;
  for (const selector of selectors) {
    const match = target.closest(selector);
    if (match) return match;
  }
  return null;
};

export class DiarioSoulV610 {
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
    this.screen = this.documentTarget?.getElementById?.('journal') || null;
    this.app = this.documentTarget?.getElementById?.('journalApp') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.canvas = this.documentTarget?.getElementById?.('orbCanvas') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.saved = false;
    this.responses = 0;
    this.thresholdGestures = 0;
    this.writingGestures = 0;
    this.saveGestures = 0;
    this.detailGestures = 0;
    this.memoryGestures = 0;
    this.mirrorGestures = 0;
    this.publicSaveSignals = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:journal-soul-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13JournalSoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.journalSoul = 'v610';
    this.screen.dataset.journalSoulUniverse = 'camara-da-tinta-lunar';
    this.screen.dataset.journalSoulPhase = 'rest';
    this.screen.dataset.journalSoulPresence = 'away';
    this.screen.dataset.journalSoulSequence = 'threshold-write-autosave-details-memories-mirror-return-silence';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
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
      this.app.dataset.journalSoul = 'v610';
      this.app.dataset.journalSoulPhase = this.phase;
      this.app.dataset.journalSoulPrivacy = 'body-unread';
    }
    return this.app;
  }

  publicSaveState() {
    return String(
      this.app?.querySelector?.('[data-journal-save-state]')?.dataset?.state || ''
    ).toLowerCase();
  }

  setPhase(phase, reason = 'state') {
    const next = PHASES.has(String(phase || '').toLowerCase())
      ? String(phase).toLowerCase()
      : 'threshold';
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.journalSoulPhase = next;
    if (this.app?.dataset) this.app.dataset.journalSoulPhase = next;
    emit(this.documentTarget, 'divina:journal-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      saved:this.saved,
      privateContentIncluded:false,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return next;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const chamber = String(this.screen?.dataset?.db596ChamberState || '').toLowerCase();
    const chamberMode = String(this.screen?.dataset?.db596ChamberMode || '').toLowerCase();
    const wisdomMode = String(this.app?.dataset?.v607JournalMode || '').toLowerCase();
    const saveState = this.publicSaveState();
    if (chamber === 'travel') return 'travel';
    if (chamber === 'awakening') return 'opening';
    if (chamber === 'threshold') return 'threshold';
    if (wisdomMode === 'review' || chamberMode === 'mirror') return 'mirror';
    if (chamberMode === 'calendar') return 'memories';
    if (saveState === 'saving') return 'saving';
    if (saveState === 'saved' || this.saved) return 'saved';
    if (chamber === 'engaged' || wisdomMode === 'write') return 'writing';
    return chamber === 'present' ? 'opening' : 'threshold';
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'journal';
    if (this.screen?.dataset) this.screen.dataset.journalSoulPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest', reason);
  }

  kindFor(target) {
    if (!this.isActive() || !target?.closest) return '';
    if (closestAny(target, [
      '[data-v607-action="journal-review"]','[data-jwv-mirror]',
      '[data-journal-view="mirror"]','[data-journal-mirror]'
    ])) return 'mirror';
    if (closestAny(target, [
      '[data-jwv-calendar]','[data-journal-view="calendar"]','[data-journal-view="timeline"]',
      '[data-journal-search]','[data-journal-filter]','[data-journal-memory]',
      '[data-journal-favourite]','[data-journal-export]','[data-journal-import]',
      '.journal-explorer','.journal-timeline'
    ])) return 'memories';
    if (closestAny(target, [
      '[data-journal-save]','[data-journal-action="save"]','[data-action="save-journal"]',
      '#journalForm button[type="submit"]'
    ])) return 'save';
    if (closestAny(target, [
      '[data-journal-details]','[data-journal-relation]','[data-journal-tags]',
      '[data-journal-mood]','#journalForm details','#journalForm select'
    ])) return 'details';
    if (closestAny(target, [
      '[data-v607-action="journal-write"]','[data-jwv-write]','#journalForm'
    ])) return 'write';
    if (closestAny(target, [
      '[data-v585-orb-host]','[data-journal-orb-host]'
    ])) return 'threshold';
    return '';
  }

  respond(kind, source = 'touch') {
    if (!kind || !this.isActive()) return false;
    this.responses += 1;
    if (kind === 'threshold') {
      this.thresholdGestures += 1;
      this.setPhase('opening', source);
      this.orbCore?.pulse?.('journal-threshold-answer', { intensity:.24 });
      return true;
    }
    if (kind === 'write') {
      this.writingGestures += 1;
      this.setPhase('writing', source);
      this.orbCore?.pulse?.('journal-ink-answer', { intensity:.12 });
      return true;
    }
    if (kind === 'save') {
      this.saveGestures += 1;
      this.setPhase('saving', source);
      this.orbCore?.pulse?.('journal-save-answer', { intensity:.16 });
      return true;
    }
    if (kind === 'details') {
      this.detailGestures += 1;
      this.setPhase('details', source);
      this.orbCore?.pulse?.('journal-detail-answer', { intensity:.08 });
      return true;
    }
    if (kind === 'memories') {
      this.memoryGestures += 1;
      this.setPhase('memories', source);
      this.orbCore?.pulse?.('journal-memory-answer', { intensity:.10 });
      return true;
    }
    if (kind === 'mirror') {
      this.mirrorGestures += 1;
      this.setPhase('mirror', source);
      this.orbCore?.pulse?.('journal-mirror-answer', { intensity:.12 });
      return true;
    }
    return false;
  }

  observePublicSave(reason = 'public-save-state') {
    if (!this.isActive()) return false;
    const state = this.publicSaveState();
    if (state === 'saving') return Boolean(this.setPhase('saving', reason));
    if (state !== 'saved') return false;
    this.saved = true;
    this.publicSaveSignals += 1;
    this.setPhase('saved', reason);
    this.orbCore?.pulse?.('journal-saved-silence', { intensity:.08 });
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
      if (kind && kind !== 'save') this.sync('gesture-settled');
    });

    this.listen(this.documentTarget, 'focusin', event => {
      if (!this.isActive() || !event?.target?.closest?.('#journalForm')) return;
      this.setPhase('writing', 'editor-focus');
    });

    this.listen(this.documentTarget, 'submit', event => {
      if (!this.isActive() || !event?.target?.matches?.('#journalForm')) return;
      this.saveGestures += 1;
      this.setPhase('saving', 'submit');
      this.orbCore?.pulse?.('journal-save-answer', { intensity:.16 });
    }, { capture:true });

    ['divina:journal-saved','divina:journal-autosave','divina:journal-save-state']
      .forEach(type => this.listen(this.documentTarget, type, () => this.observePublicSave(type)));

    this.listen(this.documentTarget, 'divina:journal-world-ready', () => this.sync('journal-ready'));
    this.listen(this.documentTarget, 'divina:journal-world-updated', () => {
      if (!this.observePublicSave('journal-world-updated')) this.sync('journal-world-updated');
    });
    this.listen(this.documentTarget, 'divina:reality-chamber-state', event => {
      if (normalizeRoute(event?.detail?.route || '') === 'journal') this.sync('chamber-state');
    });
    this.listen(this.documentTarget, 'divina:menu-state', event => this.onMenu(event));
    this.listen(this.documentTarget, 'divina:route-start', event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'journal' || target === 'journal') this.setPhase('travel', 'route-start');
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
      journalScreenPresent:Boolean(this.screen),
      journalAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      directWritingFirst:true,
      timelinePageSizePreserved:12,
      timelineFullImageRequestsPreserved:0,
      mirrorAggregateOnly:true,
      mirrorDiagnosis:false,
      privateByDefault:true,
      privateContentReads:0,
      journalBodyReads:0,
      titleReads:0,
      tagReads:0,
      questionReads:0,
      draftReads:0,
      historyReads:0,
      formValueReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...DIARIO_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      saved:this.saved,
      responses:this.responses,
      thresholdGestures:this.thresholdGestures,
      writingGestures:this.writingGestures,
      saveGestures:this.saveGestures,
      detailGestures:this.detailGestures,
      memoryGestures:this.memoryGestures,
      mirrorGestures:this.mirrorGestures,
      publicSaveSignals:this.publicSaveSignals,
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
      delete this.app.dataset.journalSoul;
      delete this.app.dataset.journalSoulPhase;
      delete this.app.dataset.journalSoulPrivacy;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.journalSoul;
      delete this.screen.dataset.journalSoulUniverse;
      delete this.screen.dataset.journalSoulPhase;
      delete this.screen.dataset.journalSoulPresence;
      delete this.screen.dataset.journalSoulSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13JournalSoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaDiarioSoulV610 === this) delete globalThis.divinaDiarioSoulV610;
    return true;
  }
}

export function createDiarioSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const instance = new DiarioSoulV610(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaDiarioSoulV610 = instance;
  return instance;
}

export default createDiarioSoulV610;
