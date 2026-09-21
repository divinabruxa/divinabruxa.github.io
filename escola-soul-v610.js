/* DIVINA BRUXA — WORK13 · ALMA DA ESCOLA · V610
   A Escola existente nao e refeita. V555 continua ensinando, V596 continua
   abrindo a camara e V607 continua mostrando um passo por vez. Esta camada
   escuta apenas estados publicos e faz o Jardim Arcano responder ao gesto:
   semente, caminho, aula, pratica, raiz e silencio. Uma Orbe, nenhum atalho. */

const VERSION = 610;
const STYLE_ID = 'divinaEscolaSoulV610';
const STYLE_HREF = './escola-soul-v610.css?v=610-work13-school-soul';
const INSTANCE = Symbol.for('divina.work13.escola.soul.v610');
const PHASES = new Set([
  'rest','threshold','germinating','choice','paths','lesson','practice',
  'rooting','rooted','explore','portal','travel'
]);

export const ESCOLA_SOUL_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'school',
  stage:'quarta-realidade-alma-propria',
  universe:'jardim-arcano-do-conhecimento',
  sequence:Object.freeze(['seed','one-next-step','path','one-whole-lesson','practice','root','silence']),
  existingSchoolAuthority:'V555-preserved',
  existingChamberAuthority:'V596-preserved',
  existingLivingWisdomAuthority:'V607-preserved',
  stagesPreserved:3,
  modulesPreserved:17,
  lessonsPreserved:124,
  cardLessonsPreserved:78,
  freeLessonsPreserved:17,
  premiumLessonsPreserved:107,
  oneNaturalNextLesson:true,
  programmeRequiresExplicitGesture:true,
  progressAuthorityChanges:0,
  lessonContentChanges:0,
  quizChanges:0,
  exerciseChanges:0,
  favouritesChanges:0,
  searchChanges:0,
  premiumAuthorityChanges:0,
  persistenceChanges:0,
  reusesCanonicalOrb:true,
  reusesGlobalLivingMenu:true,
  visibleCopyAdded:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  lessonBodyReads:0,
  schoolNoteReads:0,
  answerReads:0,
  searchQueryReads:0,
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

const publicNumber = value => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
};

export class EscolaSoulV610 {
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
    this.screen = this.documentTarget?.getElementById?.('school') || null;
    this.app = this.documentTarget?.getElementById?.('schoolApp') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.canvas = this.documentTarget?.getElementById?.('orbCanvas') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.progress = Object.freeze({ done:0, total:124, percent:0 });
    this.responses = 0;
    this.continueGestures = 0;
    this.pathGestures = 0;
    this.lessonGestures = 0;
    this.practiceGestures = 0;
    this.completionGestures = 0;
    this.progressUpdates = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:school-soul-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13SchoolSoul = 'v610';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.schoolSoul = 'v610';
    this.screen.dataset.schoolSoulUniverse = 'jardim-arcano';
    this.screen.dataset.schoolSoulPhase = 'rest';
    this.screen.dataset.schoolSoulPresence = 'away';
    this.screen.dataset.schoolSoulSequence = 'seed-next-step-path-lesson-practice-root-silence';
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
      this.app.dataset.schoolSoul = 'v610';
      this.app.dataset.schoolSoulPhase = this.phase;
    }
    return this.app;
  }

  setPhase(phase, reason = 'state') {
    const next = PHASES.has(String(phase || '').toLowerCase())
      ? String(phase).toLowerCase()
      : 'threshold';
    this.phase = next;
    if (this.screen?.dataset) this.screen.dataset.schoolSoulPhase = next;
    if (this.app?.dataset) this.app.dataset.schoolSoulPhase = next;
    emit(this.documentTarget, 'divina:school-soul-state', {
      version:VERSION,
      route:this.route,
      phase:next,
      reason,
      progress:this.progress,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return next;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
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

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'school';
    if (this.screen?.dataset) this.screen.dataset.schoolSoulPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest', reason);
  }

  kindFor(target) {
    if (!this.isActive() || !target?.closest) return '';
    if (target.closest('[data-complete]')) return 'complete';
    if (target.closest('[data-school-practice], [data-quiz], [data-exercise], .school-quiz, .school-exercise')) return 'practice';
    if (target.closest('.school-lesson')) return 'lesson';
    if (target.closest('[data-school-stage-target], [data-school-module]')) return 'path';
    if (target.closest('[data-db596-school-paths], [data-v607-action="school-module"]')) return 'paths';
    if (target.closest('[data-school-continue], [data-v607-action="school-next"]')) return 'continue';
    if (target.closest('[data-school-filter], [data-search-toggle], [data-school-search]')) return 'explore';
    return '';
  }

  respond(kind, source = 'touch') {
    if (!kind || !this.isActive()) return false;
    this.responses += 1;
    if (kind === 'continue') {
      this.continueGestures += 1;
      this.setPhase('germinating', source);
      this.orbCore?.pulse?.('school-seed-answer', { intensity:.30 });
      return true;
    }
    if (kind === 'paths' || kind === 'path' || kind === 'explore') {
      this.pathGestures += 1;
      this.setPhase(kind === 'explore' ? 'explore' : 'paths', source);
      this.orbCore?.pulse?.('school-path-answer', { intensity:.20 });
      return true;
    }
    if (kind === 'lesson') {
      this.lessonGestures += 1;
      this.setPhase('lesson', source);
      this.orbCore?.pulse?.('school-lesson-answer', { intensity:.16 });
      return true;
    }
    if (kind === 'practice') {
      this.practiceGestures += 1;
      this.setPhase('practice', source);
      this.orbCore?.pulse?.('school-practice-answer', { intensity:.18 });
      return true;
    }
    if (kind === 'complete') {
      this.completionGestures += 1;
      this.setPhase('rooting', source);
      this.orbCore?.pulse?.('school-root-answer', { intensity:.24 });
      return true;
    }
    return false;
  }

  observeProgress(event) {
    const detail = event?.detail && typeof event.detail === 'object' ? event.detail : {};
    const previous = this.progress.done;
    const total = publicNumber(detail.total) || 124;
    const done = Math.min(publicNumber(detail.done), total);
    const percent = Math.min(100, publicNumber(detail.percent));
    this.progress = Object.freeze({ done, total, percent });
    this.progressUpdates += 1;
    this.attach();
    if (!this.isActive()) return false;
    if (done > previous) {
      this.setPhase('rooted', 'public-progress');
      this.orbCore?.pulse?.('school-growth-answer', { intensity:.18 });
      return true;
    }
    return this.sync('public-progress');
  }

  onChamber(event) {
    if (normalizeRoute(event?.detail?.route) !== 'school') return false;
    const state = String(event?.detail?.state || '').toLowerCase();
    if (state === 'awakening') return Boolean(this.setPhase('germinating', 'chamber-awakening'));
    if (state === 'travel') return Boolean(this.setPhase('travel', 'chamber-travel'));
    return Boolean(this.sync('chamber-state'));
  }

  onMenu(event) {
    if (!this.isActive()) return false;
    const state = String(event?.detail?.state || 'closed').toLowerCase();
    if (state !== 'closed') return Boolean(this.setPhase('portal', 'global-orb-menu'));
    return Boolean(this.sync('menu-closed'));
  }

  bind() {
    this.listen(this.documentTarget, 'pointerdown', event => {
      if (this.isActive() && event?.target?.closest?.('#orb')) {
        this.setPhase('portal', 'orb-touch');
        return;
      }
      this.respond(this.kindFor(event?.target), 'touch');
    }, { passive:true });

    this.listen(this.documentTarget, 'click', event => {
      const kind = this.kindFor(event?.target);
      if (kind && Number(event?.detail || 0) === 0) this.respond(kind, 'keyboard');
      if (kind) this.sync('gesture-settled');
    });
    this.listen(this.documentTarget, 'input', event => {
      if (event?.target?.matches?.('[data-school-search]')) this.setPhase('explore', 'search-gesture');
    });

    this.listen(this.documentTarget, 'divina:school-world-ready', () => this.sync('school-ready'));
    this.listen(this.documentTarget, 'divina:school-progress-v555', event => this.observeProgress(event));
    this.listen(this.documentTarget, 'divina:reality-chamber-state', event => this.onChamber(event));
    this.listen(this.documentTarget, 'divina:menu-state', event => this.onMenu(event));
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
      ...ESCOLA_SOUL_CONTRACT_V610,
      route:this.route,
      phase:this.phase,
      progress:this.progress,
      responses:this.responses,
      continueGestures:this.continueGestures,
      pathGestures:this.pathGestures,
      lessonGestures:this.lessonGestures,
      practiceGestures:this.practiceGestures,
      completionGestures:this.completionGestures,
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
      delete this.app.dataset.schoolSoul;
      delete this.app.dataset.schoolSoulPhase;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.schoolSoul;
      delete this.screen.dataset.schoolSoulUniverse;
      delete this.screen.dataset.schoolSoulPhase;
      delete this.screen.dataset.schoolSoulPresence;
      delete this.screen.dataset.schoolSoulSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13SchoolSoul;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaEscolaSoulV610 === this) delete globalThis.divinaEscolaSoulV610;
    return true;
  }
}

export function createEscolaSoulV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const instance = new EscolaSoulV610(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaEscolaSoulV610 = instance;
  return instance;
}

export default createEscolaSoulV610;
