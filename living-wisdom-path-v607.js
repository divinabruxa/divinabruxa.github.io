/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 7 · V607
   Biblioteca, Escola e Diário passam a compartilhar uma linguagem progressiva:
   uma descoberta, uma aula, uma escrita. Os motores V555/V556 continuam
   intactos; esta camada apenas organiza o que aparece depois de cada gesto.

   Contexto significa somente rota e fase publicas da V602. Nenhum valor de
   campo, texto do Diário, nota da Escola, pergunta, carta ou emoção é lido. */

const VERSION = 607;
const INSTANCE = Symbol.for('divina.work13.living.wisdom.path.v607');
const ROUTES = new Set(['library','school','journal']);
const RETURN_ROUTES = new Set(['tarot','daily','spreads','library','school']);

const ROUTE_LABELS = Object.freeze({
  tarot:'Tarot Livre',
  daily:'Carta do Dia',
  spreads:'Tiragens',
  library:'Biblioteca',
  school:'Escola'
});

export const LIVING_WISDOM_PATH_CONTRACT_V607 = Object.freeze({
  version:VERSION,
  base:'V606-whit-silence-timing-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'7-of-10',
  title:'Sabedoria Viva — Biblioteca, Escola e Diário',
  law:'one-orb-one-universe-one-presence-one-journey',
  worlds:Object.freeze(['library','school','journal']),
  sequence:Object.freeze(['one-discovery','one-lesson','direct-writing']),
  contextModel:'V602-public-route-metadata-only',
  libraryEntry:'one-discovery-through-canonical-orb',
  libraryCatalogue:'explicit-request-only',
  libraryCardsPreserved:78,
  schoolEntry:'one-natural-next-lesson',
  schoolProgramme:'explicit-request-only',
  schoolModulesPreserved:17,
  schoolLessonsPreserved:124,
  journalEntry:'direct-writing-after-explicit-depth',
  journalReview:'explicit-request-only',
  journalPrivateByDefault:true,
  maximumContextualContinuations:1,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitTimingAuthority:'V606-unchanged',
  existingEnginesPreserved:Object.freeze({ library:'V555', school:'V555', journal:'V556' }),
  privateContentReads:0,
  formValueReads:0,
  journalBodyReads:0,
  journalDraftReads:0,
  journalHistoryReads:0,
  schoolNoteReads:0,
  questionReads:0,
  cardIdentityReads:0,
  emotionInference:false,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const cleanRoute = value => {
  const route = String(value || '').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

export const normalizeLivingRouteV607 = value => cleanRoute(value);

const publicContext = value => {
  const context = value && typeof value === 'object' ? value : {};
  const next = context.next && typeof context.next === 'object'
    ? Object.freeze({
        route:cleanRoute(context.next.route),
        intention:String(context.next.intention || '').slice(0,24),
        reason:String(context.next.reason || '').slice(0,40)
      })
    : null;
  return Object.freeze({
    route:cleanRoute(context.route),
    previousRoute:cleanRoute(context.returnRoute || context.previousRoute || ''),
    next
  });
};

export function livingLibraryCopyV607(context = {}, discovered = false) {
  const snapshot = publicContext(context);
  if (discovered) return Object.freeze({
    eyebrow:'O SIMBOLO CONTINUA',
    title:'Uma descoberta pode virar prática.',
    copy:'A Escola é o próximo passo natural. Ela abre somente quando você escolher continuar.',
    primary:'Continuar na Escola'
  });
  if (['tarot','daily','spreads'].includes(snapshot.previousRoute)) return Object.freeze({
    eyebrow:'DA LEITURA AO SIMBOLO',
    title:'Uma leitura trouxe você até aqui.',
    copy:'Toque uma vez. A Orbe escolhe um símbolo para aprofundar, sem abrir todas as respostas de uma vez.',
    primary:'Descobrir uma carta'
  });
  if (snapshot.previousRoute === 'school') return Object.freeze({
    eyebrow:'DA PRATICA AO SIMBOLO',
    title:'Volte a uma carta.',
    copy:'Uma imagem pode reabrir o que a aula deixou vivo. A Orbe escolhe somente uma.',
    primary:'Descobrir uma carta'
  });
  return Object.freeze({
    eyebrow:'BIBLIOTECA VIVA',
    title:'Uma carta por vez.',
    copy:'Deixe a Orbe escolher uma descoberta. O catálogo inteiro continua aqui quando você pedir.',
    primary:'Descobrir uma carta'
  });
}

export function livingContinuationV607(context = {}, route = '') {
  const snapshot = publicContext(context);
  if (snapshot.route !== cleanRoute(route)) return null;
  const nextRoute = cleanRoute(snapshot.next?.route || '');
  if (route === 'library' && nextRoute === 'school') {
    return Object.freeze({ route:'school', label:'Continuar na Escola', reason:snapshot.next?.reason || 'symbol-to-study' });
  }
  if (route === 'journal' && RETURN_ROUTES.has(nextRoute) && nextRoute !== 'journal') {
    return Object.freeze({ route:nextRoute, label:`Voltar a ${ROUTE_LABELS[nextRoute] || 'jornada'}`, reason:snapshot.next?.reason || 'writing-to-origin' });
  }
  return null;
}

const routeNow = (doc, win) => cleanRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const make = (doc, tag, className = '', text = '') => {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const button = (doc, action, text, className = '') => {
  const node = make(doc, 'button', className, text);
  node.type = 'button';
  node.dataset.v607Action = action;
  return node;
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class LivingWisdomPathV607 {
  constructor({
    contextMemory = globalThis.divinaCosmosContextMemoryV602,
    chambers = globalThis.divinaRealityChambersV596,
    navigate = globalThis.orbe?.go,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.contextMemory = contextMemory || null;
    this.chambers = chambers || null;
    this.navigate = typeof navigate === 'function' ? navigate : null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.destroyed = false;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.context = this.readContext();
    this.libraryDiscovered = false;
    this.schoolFocusQueued = false;
    this.journalSaved = false;
    this.nodesCreated = 0;
    this.libraryDiscoveries = 0;
    this.libraryCatalogueOpens = 0;
    this.schoolLessonFocuses = 0;
    this.schoolProgrammeOpens = 0;
    this.journalDirectEntries = 0;
    this.journalReviewOpens = 0;
    this.explicitContinuations = 0;
    this.contextUpdates = 0;

    this.installIdentity();
    this.bind();
    this.enhanceRoute(this.route);
    emit(this.documentTarget, 'divina:living-wisdom-ready', this.publicStatus());
  }

  readContext() {
    try { return publicContext(this.contextMemory?.snapshot?.() || {}); }
    catch { return publicContext({ route:this.route }); }
  }

  installIdentity() {
    if (!this.documentElement?.dataset) return false;
    this.documentElement.dataset.work13 = 'cosmos-vivo';
    this.documentElement.dataset.work13Macro = '7-living-wisdom-path';
    this.documentElement.dataset.livingWisdomPath = 'v607';
    this.documentElement.dataset.livingWisdomPrivacy = 'public-route-metadata-only';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  frame(callback) {
    if (typeof this.windowTarget?.requestAnimationFrame === 'function') {
      this.windowTarget.requestAnimationFrame(callback);
      return true;
    }
    callback();
    return false;
  }

  twoFrames(callback) {
    this.frame(() => this.frame(callback));
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'click', event => this.onClick(event));
    this.listen(doc, 'input', event => this.onInput(event));
    this.listen(doc, 'submit', event => this.onSubmit(event));
    this.listen(doc, 'divina:context-memory-updated', event => this.onContext(event));
    this.listen(doc, 'divina:reality-depth', event => this.onDepth(event));
    this.listen(doc, 'divina:reality-chamber-state', event => this.onChamberState(event));
    this.listen(doc, 'divina:wisdom-public-context-v539', event => this.onLibraryDiscovery(event));
    ['divina:route-ready','divina:page-ready'].forEach(type =>
      this.listen(doc, type, event => this.onRoute(event))
    );
    ['divina:library-world-ready','divina:public-library-ready'].forEach(type =>
      this.listen(doc, type, () => this.ensureLibrary())
    );
    ['divina:school-world-ready','divina:school-progress-v555'].forEach(type =>
      this.listen(doc, type, () => this.onSchoolReady())
    );
    ['divina:journal-world-ready','divina:journal-world-updated'].forEach(type =>
      this.listen(doc, type, () => this.ensureJournal())
    );
    this.listen(win, 'hashchange', () => this.onRoute({ detail:{ id:routeNow(doc, win) } }));
  }

  onContext(event) {
    const context = event?.detail?.context;
    this.context = publicContext(context || this.readContext());
    this.contextUpdates += 1;
    this.updateLibraryGuide();
    this.updateJournalReturn();
  }

  onRoute(event) {
    const next = cleanRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget));
    if (next !== this.route) {
      if (this.route === 'journal') this.journalSaved = false;
      this.route = next;
    }
    this.context = this.readContext();
    this.enhanceRoute(next);
  }

  enhanceRoute(route) {
    if (route === 'library') this.ensureLibrary();
    if (route === 'school') this.ensureSchool();
    if (route === 'journal') this.ensureJournal();
  }

  claimDepthStart(route, target) {
    const screen = this.documentTarget?.getElementById?.(route);
    if (!screen || !target) return false;
    screen.querySelectorAll?.('[data-v585-depth-start="true"]')?.forEach?.(node => {
      if (node !== target) delete node.dataset.v585DepthStart;
    });
    target.dataset.v585DepthStart = 'true';
    return true;
  }

  ensureLibrary() {
    const root = this.documentTarget?.getElementById?.('cardLibraryApp');
    const world = root?.querySelector?.('.lb302');
    if (!root || !world) return null;
    root.dataset.livingWisdom = 'v607';
    this.claimDepthStart('library', root);
    if (!root.dataset.v607LibraryMode) root.dataset.v607LibraryMode = 'focus';
    let guide = root.querySelector('.db607-library-guide');
    if (!guide) {
      guide = make(this.documentTarget, 'section', 'db607-library-guide');
      guide.dataset.v607Surface = 'library';
      guide.setAttribute('aria-labelledby', 'db607LibraryTitle');
      const copy = make(this.documentTarget, 'div', 'db607-library-guide__copy');
      const eyebrow = make(this.documentTarget, 'p', 'eyebrow');
      eyebrow.dataset.v607LibraryEyebrow = 'true';
      const title = make(this.documentTarget, 'h3');
      title.id = 'db607LibraryTitle';
      title.dataset.v607LibraryTitle = 'true';
      const description = make(this.documentTarget, 'p');
      description.dataset.v607LibraryCopy = 'true';
      copy.append(eyebrow, title, description);
      const actions = make(this.documentTarget, 'div', 'db607-library-guide__actions');
      actions.append(
        button(this.documentTarget, 'library-primary', 'Descobrir uma carta', 'db607-primary'),
        button(this.documentTarget, 'library-catalogue', 'Explorar as 78 cartas', 'db607-secondary')
      );
      guide.append(copy, actions);
      const head = world.querySelector('.lb302__head');
      if (head?.insertAdjacentElement) head.insertAdjacentElement('afterend', guide);
      else world.prepend?.(guide);
      this.nodesCreated += 1;
    }
    this.updateLibraryGuide();
    return root;
  }

  updateLibraryGuide() {
    const root = this.documentTarget?.getElementById?.('cardLibraryApp');
    const guide = root?.querySelector?.('.db607-library-guide');
    if (!guide) return false;
    const copy = livingLibraryCopyV607(this.context, this.libraryDiscovered);
    const continuation = livingContinuationV607(this.context, 'library');
    const eyebrow = guide.querySelector('[data-v607-library-eyebrow]');
    const title = guide.querySelector('[data-v607-library-title]');
    const description = guide.querySelector('[data-v607-library-copy]');
    const primary = guide.querySelector('[data-v607-action="library-primary"]');
    const catalogue = guide.querySelector('[data-v607-action="library-catalogue"]');
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.copy;
    if (primary) {
      const canContinue = this.libraryDiscovered && continuation?.route === 'school';
      primary.textContent = canContinue ? continuation.label : copy.primary;
      primary.dataset.v607Intent = canContinue ? 'continue' : 'discover';
    }
    if (catalogue) {
      const open = root.dataset.v607LibraryMode === 'catalogue';
      catalogue.textContent = open ? 'Voltar a uma descoberta' : (this.libraryDiscovered ? 'Ficar e explorar' : 'Explorar as 78 cartas');
      catalogue.setAttribute('aria-expanded', String(open));
    }
    return true;
  }

  onLibraryDiscovery(event) {
    if (this.route !== 'library' || event?.detail?.kind !== 'card') return false;
    this.libraryDiscovered = true;
    const root = this.ensureLibrary();
    if (root?.dataset) root.dataset.v607LibraryPhase = 'discovered';
    this.libraryDiscoveries += 1;
    this.updateLibraryGuide();
    return true;
  }

  setLibraryMode(mode) {
    const root = this.ensureLibrary();
    if (!root) return false;
    root.dataset.v607LibraryMode = mode === 'catalogue' ? 'catalogue' : 'focus';
    if (mode === 'catalogue') this.libraryCatalogueOpens += 1;
    this.updateLibraryGuide();
    return true;
  }

  ensureSchool() {
    const root = this.documentTarget?.getElementById?.('schoolApp');
    const dashboard = root?.querySelector?.('.school-dashboard');
    if (!root || !dashboard) return null;
    root.dataset.livingWisdom = 'v607';
    this.claimDepthStart('school', root);
    if (!root.dataset.v607SchoolMode) root.dataset.v607SchoolMode = 'choice';
    let step = root.querySelector('.db607-school-step');
    if (!step) {
      step = make(this.documentTarget, 'aside', 'db607-school-step');
      step.dataset.v607Surface = 'school';
      const copy = make(this.documentTarget, 'p');
      copy.append(
        make(this.documentTarget, 'b', '', 'Seu próximo passo já existe.'),
        make(this.documentTarget, 'span', '', 'Continue por uma aula. O programa inteiro abre somente quando você pedir.')
      );
      const actions = make(this.documentTarget, 'div');
      actions.append(
        button(this.documentTarget, 'school-next', 'Continuar', 'db607-primary'),
        button(this.documentTarget, 'school-module', 'Ver módulo', 'db607-secondary')
      );
      step.append(copy, actions);
      const compass = root.querySelector('.school-v555-compass');
      if (compass?.insertAdjacentElement) compass.insertAdjacentElement('afterend', step);
      else dashboard.insertAdjacentElement?.('afterend', step);
      this.nodesCreated += 1;
    }
    this.updateSchoolStep();
    return root;
  }

  updateSchoolStep() {
    const root = this.documentTarget?.getElementById?.('schoolApp');
    const step = root?.querySelector?.('.db607-school-step');
    if (!step) return false;
    const mode = root.dataset.v607SchoolMode || 'choice';
    const title = step.querySelector('p>b');
    const copy = step.querySelector('p>span');
    const next = step.querySelector('[data-v607-action="school-next"]');
    const toggle = step.querySelector('[data-v607-action="school-module"]');
    if (mode === 'lesson') {
      if (title) title.textContent = 'Uma aula. Inteira.';
      if (copy) copy.textContent = 'Conclua, aprofunde ou siga para a próxima. O restante espera.';
      if (next) next.textContent = 'Proxima aula';
      if (toggle) toggle.textContent = 'Ver módulo';
    } else if (mode === 'module') {
      if (title) title.textContent = 'O mapa está aberto.';
      if (copy) copy.textContent = 'Escolha sem pressa. Você pode voltar a uma aula por vez.';
      if (next) next.textContent = 'Proxima aula';
      if (toggle) toggle.textContent = 'Uma aula por vez';
    } else {
      if (title) title.textContent = 'Seu próximo passo já existe.';
      if (copy) copy.textContent = 'Continue por uma aula. O programa inteiro abre somente quando você pedir.';
      if (next) next.textContent = 'Continuar';
      if (toggle) toggle.textContent = 'Ver módulo';
    }
    return true;
  }

  setSchoolMode(mode) {
    const root = this.ensureSchool();
    if (!root) return false;
    root.dataset.v607SchoolMode = ['choice','lesson','module','pending'].includes(mode) ? mode : 'choice';
    if (mode === 'module') {
      root.querySelectorAll?.('.school-lesson.is-v607-current')?.forEach?.(node => node.classList.remove('is-v607-current'));
      this.schoolProgrammeOpens += 1;
    }
    this.updateSchoolStep();
    return true;
  }

  focusSchoolLesson(preferred = null) {
    const root = this.ensureSchool();
    if (!root) return false;
    const active = this.documentTarget?.activeElement?.closest?.('.school-lesson');
    const candidate = preferred?.isConnected
      ? preferred
      : active || root.querySelector('.school-lesson:not(.school-lesson-locked)') || root.querySelector('.school-lesson');
    if (!candidate) {
      root.dataset.v607SchoolMode = 'module';
      this.updateSchoolStep();
      return false;
    }
    root.querySelectorAll?.('.school-lesson.is-v607-current')?.forEach?.(node => node.classList.remove('is-v607-current'));
    candidate.classList.add('is-v607-current');
    root.dataset.v607SchoolMode = 'lesson';
    this.schoolLessonFocuses += 1;
    this.updateSchoolStep();
    candidate.scrollIntoView?.({ behavior:'auto', block:'center' });
    return true;
  }

  queueSchoolFocus(publicLessonId = '') {
    if (this.schoolFocusQueued) return false;
    this.schoolFocusQueued = true;
    this.twoFrames(() => {
      this.schoolFocusQueued = false;
      const root = this.ensureSchool();
      const preferred = publicLessonId
        ? [...(root?.querySelectorAll?.('.school-lesson') || [])].find(node => node.dataset?.lessonId === publicLessonId)
        : null;
      this.focusSchoolLesson(preferred || null);
    });
    return true;
  }

  onSchoolReady() {
    const root = this.ensureSchool();
    if (root?.dataset?.v607SchoolMode === 'pending') this.queueSchoolFocus();
  }

  ensureJournal() {
    const root = this.documentTarget?.getElementById?.('journalApp');
    const workspace = root?.querySelector?.('.journal-workspace');
    if (!root || !workspace) return null;
    root.dataset.livingWisdom = 'v607';
    this.claimDepthStart('journal', root);
    if (!root.dataset.v607JournalMode) root.dataset.v607JournalMode = 'write';
    let path = root.querySelector('.db607-journal-path');
    if (!path) {
      path = make(this.documentTarget, 'nav', 'db607-journal-path');
      path.dataset.v607Surface = 'journal';
      path.setAttribute('aria-label', 'Caminho do Diário');
      const modes = make(this.documentTarget, 'div', 'db607-journal-path__modes');
      modes.append(
        button(this.documentTarget, 'journal-write', 'Escrever', 'db607-primary'),
        button(this.documentTarget, 'journal-review', 'Rever memórias', 'db607-secondary')
      );
      const next = button(this.documentTarget, 'journal-return', 'Voltar a jornada', 'db607-continuation');
      next.hidden = true;
      path.append(modes, next);
      workspace.insertAdjacentElement?.('beforebegin', path);
      this.nodesCreated += 1;
    }
    this.updateJournalPath();
    return root;
  }

  updateJournalPath() {
    const root = this.documentTarget?.getElementById?.('journalApp');
    const path = root?.querySelector?.('.db607-journal-path');
    if (!path) return false;
    const mode = root.dataset.v607JournalMode || 'write';
    path.querySelector('[data-v607-action="journal-write"]')?.setAttribute('aria-pressed', String(mode === 'write'));
    path.querySelector('[data-v607-action="journal-review"]')?.setAttribute('aria-pressed', String(mode === 'review'));
    this.updateJournalReturn();
    return true;
  }

  updateJournalReturn() {
    const path = this.documentTarget?.getElementById?.('journalApp')?.querySelector?.('.db607-journal-path');
    const next = path?.querySelector?.('[data-v607-action="journal-return"]');
    if (!next) return false;
    const continuation = this.journalSaved ? livingContinuationV607(this.context, 'journal') : null;
    next.hidden = !continuation;
    if (continuation) {
      next.textContent = continuation.label;
      next.dataset.v607Route = continuation.route;
    } else {
      delete next.dataset.v607Route;
    }
    return Boolean(continuation);
  }

  enterJournalWrite(reason = 'explicit-depth') {
    const root = this.ensureJournal();
    const screen = this.documentTarget?.getElementById?.('journal');
    if (!root || !screen) return false;
    root.dataset.v607JournalMode = 'write';
    screen.dataset.v607Journal = 'write';
    this.chambers?.clearSequence?.(`work13-v607-${reason}`);
    this.chambers?.engage?.('journal', 'write', `work13-v607-${reason}`);
    this.chambers?.resumeEffects?.();
    this.journalDirectEntries += 1;
    this.updateJournalPath();
    root.querySelector('#journalForm')?.scrollIntoView?.({ behavior:'auto', block:'start' });
    this.frame(() => root.querySelector('#journalForm [name="title"]')?.focus?.({ preventScroll:true }));
    return true;
  }

  enterJournalReview() {
    const root = this.ensureJournal();
    const screen = this.documentTarget?.getElementById?.('journal');
    if (!root || !screen) return false;
    root.dataset.v607JournalMode = 'review';
    screen.dataset.v607Journal = 'review';
    this.chambers?.engage?.('journal', 'mirror', 'work13-v607-explicit-review');
    this.journalReviewOpens += 1;
    this.updateJournalPath();
    this.frame(() => root.querySelector('#journalMemoriesTitle')?.focus?.({ preventScroll:true }));
    return true;
  }

  onDepth(event) {
    const route = cleanRoute(event?.detail?.route || this.route);
    if (route !== 'journal' || event?.detail?.source !== 'explicit-gesture') return false;
    return this.enterJournalWrite('direct-write');
  }

  onChamberState(event) {
    const route = cleanRoute(event?.detail?.route || '');
    if (route !== 'journal' || event?.detail?.state !== 'present') return false;
    return this.enterJournalWrite('present-fallback');
  }

  onSubmit(event) {
    if (!event?.target?.matches?.('#journalForm')) return false;
    this.frame(() => {
      const saved = this.documentTarget?.querySelector?.('#journalApp [data-journal-save-state]')?.dataset?.state === 'saved';
      if (!saved) return;
      this.journalSaved = true;
      this.context = this.readContext();
      this.updateJournalReturn();
    });
    return true;
  }

  onInput(event) {
    if (!event?.target?.matches?.('[data-school-search]')) return false;
    this.setSchoolMode('module');
    return true;
  }

  explicitNavigate(route, reason) {
    const destination = cleanRoute(route);
    if (!this.navigate || !destination || destination === 'home') return false;
    this.explicitContinuations += 1;
    this.navigate(destination, { source:`work13-v607-${reason}` });
    return true;
  }

  onClick(event) {
    const target = event?.target?.closest?.('button,a,summary');
    if (!target) return false;
    const action = target.dataset?.v607Action || '';

    if (action === 'library-primary') {
      event.preventDefault?.();
      const continuation = this.libraryDiscovered ? livingContinuationV607(this.context, 'library') : null;
      if (continuation?.route === 'school') return this.explicitNavigate('school', 'library-to-school');
      this.setLibraryMode('focus');
      this.documentTarget?.getElementById?.('cardLibraryApp')?.querySelector?.('[data-orb]')?.click?.();
      return true;
    }
    if (action === 'library-catalogue') {
      event.preventDefault?.();
      const root = this.ensureLibrary();
      const next = root?.dataset?.v607LibraryMode === 'catalogue' ? 'focus' : 'catalogue';
      return this.setLibraryMode(next);
    }
    if (target.matches?.('[data-search-toggle],[data-path]')) {
      this.setLibraryMode('catalogue');
      return true;
    }

    if (action === 'school-next') {
      event.preventDefault?.();
      this.setSchoolMode('pending');
      this.documentTarget?.getElementById?.('schoolApp')?.querySelector?.('[data-school-continue]')?.click?.();
      this.queueSchoolFocus();
      return true;
    }
    if (action === 'school-module') {
      event.preventDefault?.();
      const root = this.ensureSchool();
      if (root?.dataset?.v607SchoolMode === 'module') this.queueSchoolFocus();
      else this.setSchoolMode('module');
      return true;
    }
    if (target.matches?.('[data-school-continue]')) {
      this.setSchoolMode('pending');
      this.queueSchoolFocus();
      return true;
    }
    if (target.matches?.('[data-school-stage-target],[data-school-module],[data-school-filter]')) {
      this.setSchoolMode('module');
      this.frame(() => this.ensureSchool());
      return true;
    }
    if (target.matches?.('[data-complete]')) {
      const root = this.documentTarget?.getElementById?.('schoolApp');
      if (root?.dataset?.v607SchoolMode !== 'lesson') return false;
      const publicLessonId = target.closest?.('.school-lesson')?.dataset?.lessonId || '';
      this.queueSchoolFocus(publicLessonId);
      return true;
    }

    if (action === 'journal-write') {
      event.preventDefault?.();
      return this.enterJournalWrite('explicit-write');
    }
    if (action === 'journal-review') {
      event.preventDefault?.();
      return this.enterJournalReview();
    }
    if (action === 'journal-return') {
      event.preventDefault?.();
      const route = cleanRoute(target.dataset?.v607Route || '');
      return RETURN_ROUTES.has(route) && this.explicitNavigate(route, 'journal-return');
    }
    return false;
  }

  publicStatus() {
    return Object.freeze({
      release:'V607',
      route:this.route,
      worlds:Object.freeze(['library','school','journal']),
      libraryDiscovered:this.libraryDiscovered,
      journalSaved:this.journalSaved,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentIncluded:false
    });
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V607',
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      activeGuideSurfaces:doc?.querySelectorAll?.('[data-v607-surface]')?.length || 0,
      maximumContextualContinuations:doc?.querySelectorAll?.('.db607-continuation:not([hidden])')?.length || 0,
      libraryGuideDuplicates:Math.max(0, (doc?.querySelectorAll?.('.db607-library-guide')?.length || 0) - 1),
      schoolStepDuplicates:Math.max(0, (doc?.querySelectorAll?.('.db607-school-step')?.length || 0) - 1),
      journalPathDuplicates:Math.max(0, (doc?.querySelectorAll?.('.db607-journal-path')?.length || 0) - 1),
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentReads:0,
      formValueReads:0,
      journalBodyReads:0,
      journalDraftReads:0,
      journalHistoryReads:0,
      schoolNoteReads:0,
      questionReads:0,
      cardIdentityReads:0,
      emotionInference:false,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      modelCalls:0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      deferredTimers:0,
      mutationObservers:0
    });
  }

  status() {
    return Object.freeze({
      ...LIVING_WISDOM_PATH_CONTRACT_V607,
      route:this.route,
      context:this.context,
      nodesCreated:this.nodesCreated,
      libraryDiscoveries:this.libraryDiscoveries,
      libraryCatalogueOpens:this.libraryCatalogueOpens,
      schoolLessonFocuses:this.schoolLessonFocuses,
      schoolProgrammeOpens:this.schoolProgrammeOpens,
      journalDirectEntries:this.journalDirectEntries,
      journalReviewOpens:this.journalReviewOpens,
      explicitContinuations:this.explicitContinuations,
      contextUpdates:this.contextUpdates,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    this.documentTarget?.querySelectorAll?.('[data-v607-surface]')?.forEach?.(node => node.remove?.());
    ['cardLibraryApp','schoolApp','journalApp'].forEach(id => {
      const root = this.documentTarget?.getElementById?.(id);
      if (!root?.dataset) return;
      delete root.dataset.livingWisdom;
      delete root.dataset.v607LibraryMode;
      delete root.dataset.v607LibraryPhase;
      delete root.dataset.v607SchoolMode;
      delete root.dataset.v607JournalMode;
    });
    const journal = this.documentTarget?.getElementById?.('journal');
    if (journal?.dataset) delete journal.dataset.v607Journal;
    if (this.documentElement?.dataset?.livingWisdomPath === 'v607') {
      delete this.documentElement.dataset.livingWisdomPath;
      delete this.documentElement.dataset.livingWisdomPrivacy;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaLivingWisdomPathV607 === this) delete globalThis.divinaLivingWisdomPathV607;
    return true;
  }
}

export function createLivingWisdomPathV607(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const instance = new LivingWisdomPathV607(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaLivingWisdomPathV607 = instance;
  return instance;
}

export default createLivingWisdomPathV607;
