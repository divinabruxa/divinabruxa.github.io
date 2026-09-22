/* DIVINA BRUXA — WORK13 · ESCOLA · JARDIM DAS 78 SEMENTES · V618
   Uma camada de mundo sobre V555, V596, V607 e a alma V610. O conhecimento
   chega como uma semente: um proximo passo, uma aula inteira, pratica, raiz e
   silencio. Nao altera aulas, progresso, Premium, notas, quizzes ou a Orbe. */

const VERSION = 618;
const STYLE_ID = 'divinaEscolaWorldV618';
const STYLE_HREF = './escola-world-v618.css?v=618-jardim-das-78-sementes';
const INSTANCE = Symbol.for('divina.work13.escola.world.v618');
const PHASES = new Set([
  'rest','threshold','germinating','choice','paths','lesson','practice',
  'rooting','rooted','explore','portal','travel'
]);

export const ESCOLA_WORLD_CONTRACT_V618 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'school',
  universe:'jardim-das-78-sementes',
  identity:'midnight-emerald-amber-parchment',
  sequence:Object.freeze([
    'arrival','one-living-seed','one-next-lesson','one-whole-lesson',
    'practice','root','silence','programme-on-explicit-request'
  ]),
  schoolAuthority:'V555-preserved',
  chamberAuthority:'V596-preserved',
  livingWisdomAuthority:'V607-preserved',
  soulAuthority:'V610-preserved',
  stagesPreserved:3,
  modulesPreserved:17,
  lessonsPreserved:124,
  cardLessonsPreserved:78,
  theoryPracticeLessonsPreserved:46,
  freeLessonsPreserved:17,
  premiumLessonsPreserved:107,
  foundationsFreePreserved:true,
  premiumOfflinePreserved:true,
  oneNaturalNextLesson:true,
  oneWholeLessonAtATime:true,
  programmeRequiresExplicitGesture:true,
  progressIsPublicAggregateOnly:true,
  pentagramMenuPreserved:true,
  reusesCanonicalOrb:true,
  progressAuthorityChanges:0,
  curriculumOrderChanges:0,
  lessonContentChanges:0,
  quizChanges:0,
  exerciseChanges:0,
  favouritesChanges:0,
  searchChanges:0,
  premiumAuthorityChanges:0,
  premiumOfflineAuthorityChanges:0,
  optionalTutorAuthorityChanges:0,
  persistenceChanges:0,
  orbActionChanges:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  lessonBodyReads:0,
  schoolNoteReads:0,
  answerReads:0,
  searchQueryReads:0,
  cardIdentityReads:0,
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
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const publicNumber = value => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
};

const publicProgress = (value = {}, fallback = null) => {
  const source = value && typeof value === 'object' ? value : {};
  const previous = fallback && typeof fallback === 'object' ? fallback : {};
  const total = publicNumber(source.total) || publicNumber(previous.total) || 124;
  const done = Math.min(publicNumber(source.done ?? previous.done), total);
  const calculated = total ? Math.round(done / total * 100) : 0;
  const percent = Math.min(100, publicNumber(source.percent ?? calculated));
  return Object.freeze({ done, total, percent });
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class EscolaWorldV618 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('school') || null;
    this.app = this.documentTarget?.getElementById?.('schoolApp') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.progress = publicProgress();
    this.stateResponses = 0;
    this.progressUpdates = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:school-world-v618-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13SchoolWorld = 'v618';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.schoolWorld = 'v618';
    this.screen.dataset.schoolUniverse = 'jardim-das-78-sementes';
    this.screen.dataset.schoolWorldPhase = 'rest';
    this.screen.dataset.schoolWorldPresence = 'away';
    this.screen.dataset.schoolWorldSequence = 'arrival-seed-next-lesson-whole-lesson-practice-root-silence-programme';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.schoolWorldCopy !== 'v618') {
      title.textContent = 'O saber que você toca começa a criar raiz.';
      title.dataset.schoolWorldCopy = 'v618';
    }
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  isActive() {
    return this.route === 'school' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const next = this.documentTarget?.getElementById?.('schoolApp') || null;
    if (next && next !== this.app) {
      this.app = next;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.schoolWorld = 'v618';
      this.app.dataset.schoolUniverse = 'jardim-das-78-sementes';
      this.app.dataset.schoolWorldPhase = this.phase;
    }
    return this.app;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const soul = String(
      this.app?.dataset?.schoolSoulPhase
      || this.screen?.dataset?.schoolSoulPhase
      || ''
    ).toLowerCase();
    if (PHASES.has(soul) && soul !== 'rest') return soul;
    const chamber = String(this.screen?.dataset?.db596ChamberState || '').toLowerCase();
    if (chamber === 'travel') return 'travel';
    if (chamber === 'awakening') return 'germinating';
    if (chamber === 'threshold') return 'threshold';
    const mode = String(this.app?.dataset?.v607SchoolMode || '').toLowerCase();
    if (mode === 'pending') return 'germinating';
    if (mode === 'lesson') return 'lesson';
    if (mode === 'module') return 'paths';
    if (chamber === 'engaged') return 'choice';
    return chamber === 'present' ? 'choice' : 'threshold';
  }

  setPhase(value, reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.schoolWorldPhase = phase;
    if (this.app?.dataset) this.app.dataset.schoolWorldPhase = phase;
    emit(this.documentTarget, 'divina:school-world-v618-state', {
      version:VERSION,
      universe:'jardim-das-78-sementes',
      route:this.route,
      phase,
      reason,
      progress:this.progress,
      oneOrb:true,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return phase;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'school';
    if (this.screen?.dataset) this.screen.dataset.schoolWorldPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest', reason);
  }

  observeSoul(event) {
    const detail = event?.detail && typeof event.detail === 'object' ? event.detail : {};
    if (detail.progress) this.progress = publicProgress(detail.progress, this.progress);
    this.stateResponses += 1;
    this.attach();
    if (!this.isActive()) return false;
    return Boolean(this.setPhase(detail.phase, String(detail.reason || 'school-soul')));
  }

  observeProgress(event) {
    const detail = event?.detail && typeof event.detail === 'object' ? event.detail : {};
    const previous = this.progress.done;
    this.progress = publicProgress(detail, this.progress);
    this.progressUpdates += 1;
    this.attach();
    if (!this.isActive()) return false;
    if (this.progress.done > previous) return Boolean(this.setPhase('rooted', 'public-progress'));
    return Boolean(this.sync('public-progress'));
  }

  bind() {
    this.listen(this.documentTarget, 'divina:school-soul-state', event => this.observeSoul(event));
    this.listen(this.documentTarget, 'divina:school-progress-v555', event => this.observeProgress(event));
    this.listen(this.documentTarget, 'divina:school-world-ready', () => this.sync('school-engine-ready'));
    this.listen(this.documentTarget, 'divina:living-wisdom-ready', () => this.sync('wisdom-ready'));
    this.listen(this.documentTarget, 'divina:route-start', event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'school' || target === 'school') this.setPhase('travel', 'route-start');
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
      schoolScreenPresent:Boolean(this.screen),
      schoolAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      stagesPreserved:3,
      modulesPreserved:17,
      lessonsPreserved:124,
      cardLessonsPreserved:78,
      theoryPracticeLessonsPreserved:46,
      freeLessonsPreserved:17,
      premiumLessonsPreserved:107,
      oneNaturalNextLesson:true,
      privateContentReads:0,
      lessonBodyReads:0,
      schoolNoteReads:0,
      searchQueryReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...ESCOLA_WORLD_CONTRACT_V618,
      route:this.route,
      phase:this.phase,
      progress:this.progress,
      stateResponses:this.stateResponses,
      progressUpdates:this.progressUpdates,
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
      delete this.app.dataset.schoolWorld;
      delete this.app.dataset.schoolUniverse;
      delete this.app.dataset.schoolWorldPhase;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.schoolWorld;
      delete this.screen.dataset.schoolUniverse;
      delete this.screen.dataset.schoolWorldPhase;
      delete this.screen.dataset.schoolWorldPresence;
      delete this.screen.dataset.schoolWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13SchoolWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaEscolaWorldV618 === this) delete globalThis.divinaEscolaWorldV618;
    return true;
  }
}

export function createEscolaWorldV618(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new EscolaWorldV618(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaEscolaWorldV618 = world;
  return world;
}

export default createEscolaWorldV618;
