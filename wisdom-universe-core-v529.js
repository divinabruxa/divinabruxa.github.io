/* DIVINA BRUXA — MACROETAPA 5/10 · SABEDORIA VIVA V529
   Biblioteca, Escola e Diário formam uma única constelação de conhecimento.
   A mesma Orbe V501 conduz as viagens. Este núcleo observa somente rota,
   geometria e metadados públicos: nunca lê textos, campos ou rascunhos privados. */

const RELEASE = 'V529';
const STYLE_ID = 'divinaWisdomUniverseV529Styles';
const MARK = Symbol.for('divina.wisdom.universe.core.v529');
const ROUTES = Object.freeze(['library', 'school', 'journal']);
const BUSY_FALLBACK_MS = 4200;

const PROFILE = Object.freeze({
  library:Object.freeze({
    route:'library', sigil:'✧', eyebrow:'78 ARCANOS', title:'Biblioteca',
    status:'Busca, estudo e comparação', anchor:'#cardLibraryApp'
  }),
  school:Object.freeze({
    route:'school', sigil:'◇', eyebrow:'17 MÓDULOS', title:'Escola',
    status:'124 aulas em uma jornada', anchor:'#schoolApp'
  }),
  journal:Object.freeze({
    route:'journal', sigil:'☾', eyebrow:'COFRE LOCAL', title:'Diário',
    status:'Privado por princípio', anchor:'#journalApp'
  })
});

const SURFACE_SELECTORS = Object.freeze({
  library:Object.freeze([
    '#cardLibraryApp', '.lb302__sanctuary', '.lb302__controls',
    '.lb302__reader-shell', '.library-reader', '.library-compare'
  ]),
  school:Object.freeze([
    '#schoolApp', '.school-rebirth-journey', '[data-school-lessons]',
    '.school-lesson', '.school-reader', '.school-module-panel'
  ]),
  journal:Object.freeze([
    '#journalApp', '.journal-command', '#journalForm', '.journal-world-v317',
    '.journal-timeline > article', '.journal-mirror', '.journal-explorer'
  ])
});

const currentRoute = () => {
  const screen = String(document.body?.dataset?.screen || '').trim();
  if (screen) return screen;
  return String(location.hash || '#home').replace(/^#/, '').split(/[?&/]/)[0] || 'home';
};

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './wisdom-universe-core-v529.css?v=529';
  document.head.append(link);
}

export const WISDOM_PRIVACY_CONTRACT_V529 = Object.freeze({
  journalPrivateByDefault:true,
  journalFieldReads:0,
  journalBodyReads:0,
  journalDraftReads:0,
  journalTitleReads:0,
  journalQuestionReads:0,
  schoolNoteReads:0,
  whitSilentPrivateReads:0,
  adminPrivateReads:0,
  analyticsPrivateReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  explicitWhitRouteOnly:true
});

export const WISDOM_UNIVERSE_CONTRACT_V529 = Object.freeze({
  release:RELEASE,
  macroStage:'5/10',
  worlds:ROUTES,
  libraryCards:78,
  schoolModules:17,
  schoolLessons:124,
  oneCanonicalOrb:true,
  usesOrbJourneyV525:true,
  usesOrbPresenceV526:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  permanentAnimationLoops:0,
  touchFramesOnDemandOnly:true,
  scrollFramesOnDemandOnly:true,
  skinReactive:true,
  webVibration:false,
  privacy:WISDOM_PRIVACY_CONTRACT_V529
});

export class WisdomUniverseCoreV529 {
  constructor({ go, orbCore, orbPresence, universe, whit } = {}) {
    this.go = typeof go === 'function' ? go : id => globalThis.orbe?.go?.(id);
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orbPresence = orbPresence || globalThis.divinaOrbUniversalPresenceV526?.engine || null;
    this.universe = universe || globalThis.orbe?.universe || null;
    this.whit = whit || globalThis.divinaWhitSupremeV527?.core || null;
    this.abort = new AbortController();
    this.observer = null;
    this.frame = 0;
    this.progressFrame = 0;
    this.pointerFrame = 0;
    this.pointerSample = null;
    this.busyTimer = 0;
    this.awakeTimer = 0;
    this.touchTimer = 0;
    this.surfaceTimer = 0;
    this.busy = false;
    this.navs = new Map();
    this.lastProgress = new Map();
    installStyle();
    this.bind();
    this.scheduleRefresh();
    document.documentElement.dataset.wisdomUniverse = 'v529';
  }

  bind() {
    const { signal } = this.abort;
    const refreshEvents = [
      'divina:page-ready', 'divina:route-ready', 'divina:supreme-orb-did-navigate',
      'divina:library-world-ready', 'divina:school-world-ready',
      'divina:journal-world-ready', 'divina:journal-world-updated',
      'divina:skin-applied', 'divina:skin-changed'
    ];
    refreshEvents.forEach(type => document.addEventListener(type, () => this.scheduleRefresh(), {
      passive:true, signal
    }));

    document.addEventListener('click', event => this.handleClick(event), { capture:true, signal });
    document.addEventListener('pointerdown', event => this.handlePointerDown(event), { passive:true, signal });
    document.addEventListener('pointermove', event => this.handlePointerMove(event), { passive:true, signal });
    document.addEventListener('pointerleave', () => this.releaseTouchField(), { passive:true, signal });
    globalThis.addEventListener?.('scroll', () => this.scheduleProgress(), { passive:true, signal });
    globalThis.addEventListener?.('resize', () => this.scheduleRefresh(), { passive:true, signal });
    globalThis.addEventListener?.('orientationchange', () => this.scheduleRefresh(), { passive:true, signal });
    globalThis.addEventListener?.('pageshow', () => this.scheduleRefresh(), { passive:true, signal });
    globalThis.visualViewport?.addEventListener('scroll', () => this.scheduleProgress(), { passive:true, signal });
    globalThis.visualViewport?.addEventListener('resize', () => this.scheduleRefresh(), { passive:true, signal });

    this.observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) this.scheduleRefresh();
    });
    if (document.body) this.observer.observe(document.body, { childList:true, subtree:true });
  }

  handleClick(event) {
    const path = event.target?.closest?.('[data-wu529-route]');
    if (path) {
      event.preventDefault();
      this.travel(path.dataset.wu529Route);
      return;
    }

    const whitButton = event.target?.closest?.('[data-wu529-whit]');
    if (!whitButton) return;
    event.preventDefault();
    const route = ROUTES.includes(currentRoute()) ? currentRoute() : whitButton.dataset.ownerRoute;
    this.openWhit(route, whitButton);
  }

  handlePointerDown(event) {
    const root = event.target?.closest?.('#library, #school, #journal');
    const route = root?.id;
    if (!ROUTES.includes(route)) return;

    this.applyPointer(root, event.clientX, event.clientY, 1);
    root.dataset.wisdomTouch = 'active';
    const nav = this.navs.get(route);
    nav?.classList.add('is-touching');
    this.orbCore?.pulse?.('wisdom-touch', { intensity:0.44, route });
    document.dispatchEvent(new CustomEvent('divina:wisdom-touch-v529', {
      detail:Object.freeze({ route, source:'pointer', private:false })
    }));

    const surface = event.target?.closest?.('[data-wisdom-surface="v529"]');
    if (surface) {
      const rect = surface.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 100, 0, 100);
      const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height) * 100, 0, 100);
      surface.style.setProperty('--wu529-surface-x', `${x.toFixed(2)}%`);
      surface.style.setProperty('--wu529-surface-y', `${y.toFixed(2)}%`);
      surface.classList.remove('is-wisdom-touched');
      requestAnimationFrame(() => surface.classList.add('is-wisdom-touched'));
      clearTimeout(this.surfaceTimer);
      this.surfaceTimer = setTimeout(() => surface.classList.remove('is-wisdom-touched'), reducedMotion() ? 80 : 620);
    }

    clearTimeout(this.touchTimer);
    this.touchTimer = setTimeout(() => {
      delete root.dataset.wisdomTouch;
      nav?.classList.remove('is-touching');
    }, reducedMotion() ? 100 : 720);
  }

  handlePointerMove(event) {
    const root = event.target?.closest?.('#library, #school, #journal');
    if (!root || !ROUTES.includes(root.id)) return;
    this.pointerSample = { root, x:event.clientX, y:event.clientY };
    if (this.pointerFrame) return;
    this.pointerFrame = requestAnimationFrame(() => {
      this.pointerFrame = 0;
      const sample = this.pointerSample;
      this.pointerSample = null;
      if (sample?.root?.isConnected) this.applyPointer(sample.root, sample.x, sample.y, 0.58);
    });
  }

  applyPointer(root, clientX, clientY, energy) {
    const rect = root.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / Math.max(1, rect.width) * 100, 0, 100);
    const y = clamp((clientY - rect.top) / Math.max(1, rect.height) * 100, 0, 100);
    root.style.setProperty('--wu529-touch-x', `${x.toFixed(2)}%`);
    root.style.setProperty('--wu529-touch-y', `${y.toFixed(2)}%`);
    root.style.setProperty('--wu529-touch-energy', String(energy));
    root.style.setProperty('--wu529-touch-opacity', String((0.04 + energy * 0.08).toFixed(3)));
  }

  releaseTouchField() {
    ROUTES.forEach(route => {
      const root = document.getElementById(route);
      root?.style?.setProperty('--wu529-touch-energy', '0');
      root?.style?.setProperty('--wu529-touch-opacity', '.04');
    });
  }

  travel(target) {
    if (!ROUTES.includes(target) || this.busy) return false;
    const from = currentRoute();
    if (from === target) {
      this.orbCore?.pulse?.('wisdom-presence', { intensity:0.68, route:target });
      this.wake(target, 'presence');
      return true;
    }

    this.busy = true;
    this.updateNavs();
    this.orbCore?.pulse?.('wisdom-path', { intensity:0.86, from, target });
    document.dispatchEvent(new CustomEvent('divina:wisdom-universe-travel-v529', {
      detail:Object.freeze({ from, target, canonicalOrb:'v501', private:false })
    }));

    clearTimeout(this.busyTimer);
    this.busyTimer = setTimeout(() => {
      this.busy = false;
      this.scheduleRefresh();
    }, BUSY_FALLBACK_MS);

    let journey;
    try {
      journey = this.go(target, { source:'wisdom-universe-v529', from, target });
    } catch (error) {
      journey = Promise.reject(error);
    }
    Promise.resolve(journey)
      .catch(() => this.notify('A passagem continua disponível pelo menu da Orbe.'))
      .finally(() => {
        clearTimeout(this.busyTimer);
        this.busy = false;
        this.scheduleRefresh();
      });
    return true;
  }

  openWhit(route, surface = null) {
    if (!ROUTES.includes(route)) return false;
    let opened = false;
    try {
      opened = this.whit?.openSheet?.(route, surface, true) === true;
      if (!opened) opened = globalThis.divinaWhitSupremeV527?.open?.(route, surface) === true;
    } catch {
      opened = false;
    }
    this.orbCore?.pulse?.('whit-wisdom', { intensity:0.58, route });
    document.dispatchEvent(new CustomEvent('divina:wisdom-whit-request-v529', {
      detail:Object.freeze({ route, context:'route-only', privateContentIncluded:false })
    }));
    if (!opened) this.notify('Whit está presente na Orbe. Toque na Orbe IA para conversar.');
    return opened;
  }

  scheduleRefresh() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }

  scheduleProgress() {
    if (this.progressFrame) return;
    this.progressFrame = requestAnimationFrame(() => {
      this.progressFrame = 0;
      this.updateProgress();
    });
  }

  refresh() {
    ROUTES.forEach(route => {
      this.mount(route);
      this.decorate(route);
    });
    this.updateNavs();
    this.updateProgress();
  }

  mount(route) {
    const root = document.getElementById(route);
    if (!root) return null;
    let nav = this.navs.get(route);
    if (nav?.isConnected && nav.closest(`#${route}`) === root) return nav;
    nav = root.querySelector('[data-wisdom-universe-nav="v529"]');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'wu529';
      nav.dataset.wisdomUniverseNav = 'v529';
      nav.dataset.ownerRoute = route;
      nav.setAttribute('aria-label', 'Caminhos de sabedoria da Orbe');
      nav.innerHTML = `
        <span class="wu529__aura" aria-hidden="true"><i></i><i></i><i></i></span>
        <header class="wu529__head">
          <span class="wu529__identity"><i aria-hidden="true">✦</i><span><small>ORBE · SABEDORIA VIVA</small><b data-wu529-current>${PROFILE[route].title}</b></span></span>
          <button type="button" class="wu529__whit" data-wu529-whit data-owner-route="${route}" aria-label="Pedir orientação da Whit sobre ${PROFILE[route].title}"><span>WHIT</span><small>orientar</small></button>
        </header>
        <div class="wu529__progress" aria-label="Progresso nesta página"><i><u data-wu529-progress-bar></u></i><span data-wu529-progress>0% desta passagem</span></div>
        <span class="wu529__thread" aria-hidden="true"><i></i></span>
        <div class="wu529__paths">${ROUTES.map(id => {
          const item = PROFILE[id];
          return `<button type="button" data-wu529-route="${id}" aria-label="Viajar para ${item.title}">
            <span class="wu529__sigil" aria-hidden="true">${item.sigil}</span>
            <span class="wu529__copy"><small>${item.eyebrow}</small><b>${item.title}</b><em>${item.status}</em></span>
          </button>`;
        }).join('')}</div>
        <p class="wu529__promise" data-wu529-promise><span aria-hidden="true">◇</span><span>Whit acompanha o caminho; seus textos privados continuam seus.</span></p>
        <p class="wu529__live" role="status" aria-live="polite" aria-atomic="true"></p>`;

      const anchor = root.querySelector(PROFILE[route].anchor);
      if (anchor) anchor.insertAdjacentElement('beforebegin', nav);
      else root.prepend(nav);
    }
    root.dataset.wisdomCore = 'v529';
    root.dataset.wisdomPrivacy = route === 'journal' ? 'private-body-unread' : 'public-route-only';
    this.navs.set(route, nav);
    return nav;
  }

  decorate(route) {
    const root = document.getElementById(route);
    if (!root) return;
    const selectors = SURFACE_SELECTORS[route];
    selectors.forEach(selector => {
      root.querySelectorAll(selector).forEach(surface => {
        surface.dataset.wisdomSurface = 'v529';
        surface.dataset.wisdomRoute = route;
      });
    });
  }

  updateNavs() {
    const current = currentRoute();
    this.navs.forEach((nav, ownerRoute) => {
      if (!nav?.isConnected) return;
      nav.dataset.current = current;
      nav.dataset.busy = String(this.busy);
      const currentLabel = nav.querySelector('[data-wu529-current]');
      const visibleRoute = ROUTES.includes(current) ? current : ownerRoute;
      if (currentLabel) currentLabel.textContent = PROFILE[visibleRoute].title;
      nav.querySelectorAll('[data-wu529-route]').forEach(button => {
        const route = button.dataset.wu529Route;
        const selected = route === current;
        button.classList.toggle('is-current', selected);
        button.setAttribute('aria-pressed', String(selected));
        if (selected) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
        button.disabled = this.busy;
      });
      const whit = nav.querySelector('[data-wu529-whit]');
      if (whit) whit.disabled = this.busy;
    });
  }

  updateProgress() {
    const route = currentRoute();
    if (!ROUTES.includes(route)) return;
    const root = document.getElementById(route);
    const nav = this.navs.get(route);
    if (!root || !nav) return;
    const scroller = document.scrollingElement || document.documentElement;
    const viewport = Math.max(1, globalThis.visualViewport?.height || globalThis.innerHeight || document.documentElement.clientHeight);
    const rect = root.getBoundingClientRect();
    const start = scroller.scrollTop + rect.top;
    const distance = Math.max(1, root.scrollHeight - viewport * 0.72);
    const travelled = clamp(scroller.scrollTop - start + viewport * 0.18, 0, distance);
    const percent = Math.round(travelled / distance * 100);
    if (this.lastProgress.get(route) === percent) return;
    this.lastProgress.set(route, percent);
    root.style.setProperty('--wu529-reading-progress', `${percent}%`);
    nav.style.setProperty('--wu529-reading-progress', `${percent}%`);
    const label = nav.querySelector('[data-wu529-progress]');
    const bar = nav.querySelector('[data-wu529-progress-bar]');
    if (label) label.textContent = `${percent}% desta passagem`;
    if (bar) bar.style.setProperty('--wu529-progress', `${percent}%`);
  }

  wake(route, reason) {
    const nav = this.navs.get(route) || this.mount(route);
    if (!nav) return;
    nav.dataset.awake = reason;
    nav.classList.remove('is-awake');
    requestAnimationFrame(() => nav.classList.add('is-awake'));
    clearTimeout(this.awakeTimer);
    this.awakeTimer = setTimeout(() => {
      nav.classList.remove('is-awake');
      delete nav.dataset.awake;
    }, reducedMotion() ? 100 : 920);
  }

  notify(message) {
    globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:String(message || '') }));
  }

  audit() {
    const routeAudit = Object.fromEntries(ROUTES.map(route => {
      const root = document.getElementById(route);
      const nav = this.navs.get(route);
      return [route, Object.freeze({
        root:Boolean(root),
        nav:Boolean(nav?.isConnected),
        navCount:root?.querySelectorAll?.('[data-wisdom-universe-nav="v529"]').length || 0,
        decoratedSurfaces:root?.querySelectorAll?.('[data-wisdom-surface="v529"]').length || 0
      })];
    }));
    return Object.freeze({
      release:RELEASE,
      routes:Object.freeze(routeAudit),
      privacy:WISDOM_PRIVACY_CONTRACT_V529,
      duplicateNavs:Object.values(routeAudit).some(item => item.navCount > 1),
      canonicalOrbCount:document.querySelectorAll('[data-supreme-orb="living"]').length
    });
  }

  contract() {
    return WISDOM_UNIVERSE_CONTRACT_V529;
  }

  status() {
    const audit = this.audit();
    return Object.freeze({
      release:RELEASE,
      macroStage:'5/10',
      route:currentRoute(),
      worlds:ROUTES.length,
      ready:!audit.duplicateNavs,
      oneCanonicalOrb:audit.canonicalOrbCount <= 1,
      canonicalOrbCount:audit.canonicalOrbCount,
      usesOrbJourneyV525:true,
      usesPresenceV526:Boolean(this.orbPresence),
      usesLivingUniverseV524:Boolean(this.universe),
      whitRouteGuidance:Boolean(this.whit),
      whitContext:'route-only-explicit',
      skinReactive:true,
      organicReadingSurfaces:true,
      touchResponsive:true,
      readingProgressGeometryOnly:true,
      privateReads:false,
      storageReads:0,
      storageWrites:0,
      extraApiCalls:0,
      permanentAnimationLoops:0,
      webVibration:false,
      audit
    });
  }

  destroy() {
    this.abort.abort();
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.progressFrame);
    cancelAnimationFrame(this.pointerFrame);
    clearTimeout(this.busyTimer);
    clearTimeout(this.awakeTimer);
    clearTimeout(this.touchTimer);
    clearTimeout(this.surfaceTimer);
    this.navs.forEach(nav => nav?.remove?.());
    this.navs.clear();
    ROUTES.forEach(route => {
      const root = document.getElementById(route);
      root?.removeAttribute('data-wisdom-core');
      root?.removeAttribute('data-wisdom-privacy');
      root?.querySelectorAll?.('[data-wisdom-surface="v529"]').forEach(surface => {
        surface.removeAttribute('data-wisdom-surface');
        surface.removeAttribute('data-wisdom-route');
      });
    });
    if (document.documentElement.dataset.wisdomUniverse === 'v529') delete document.documentElement.dataset.wisdomUniverse;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createWisdomUniverseCoreV529(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new WisdomUniverseCoreV529(options);
  globalThis[MARK] = instance;
  globalThis.divinaWisdomUniverseV529 = instance;
  return instance;
}
