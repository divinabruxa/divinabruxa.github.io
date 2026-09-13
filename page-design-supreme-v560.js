/* DIVINA BRUXA 4.0 — DESIGN DE PÁGINAS E MOBILE PREMIUM · MACROETAPA 12/14 · V560
   Gramática visual e acessível para os 17 mundos. Preserva a Orbe canônica,
   o menu, a autoridade do servidor e todos os motores aprovados até a V559. */

export const PAGE_DESIGN_SUPREME_CONTRACT_V560 = Object.freeze({
  version: 560,
  plan: '4.0-fluidity-supreme',
  macroStage: '12-of-14',
  title: 'Design de Páginas e Mobile Premium',
  preserves: 'V559',
  worldCount: 17,
  pageFamilies: Object.freeze(['origin', 'ritual', 'wisdom', 'presence', 'experience', 'identity', 'owner']),
  viewportWidths: Object.freeze([320, 350, 375, 390, 430, 768, 1024, 1280, 1920]),
  minimumTouchTargetPx: 44,
  safeAreas: true,
  visualViewportAware: true,
  softwareKeyboardAware: true,
  zoom200Resilient: true,
  screenReaderLandmarks: true,
  reducedMotion: true,
  highContrast: true,
  forcedColors: true,
  pwaStandalone: true,
  canonicalOrb: true,
  duplicateOrbs: 0,
  mutationObservers: 0,
  permanentAnimationLoops: 0,
  privateReads: 0,
  storageWrites: 0,
  apiCalls: 0,
  environment: 'staging',
  productionPublish: false,
  realBilling: false
});

const PROFILE_LIST_V560 = Object.freeze([
  Object.freeze({ id:'home', label:'Início', family:'origin', sigil:'✦' }),
  Object.freeze({ id:'tarot', label:'Tarot Livre', family:'ritual', sigil:'◇' }),
  Object.freeze({ id:'daily', label:'Carta do Dia', family:'ritual', sigil:'☉' }),
  Object.freeze({ id:'spreads', label:'Tiragens', family:'ritual', sigil:'△' }),
  Object.freeze({ id:'library', label:'Biblioteca', family:'wisdom', sigil:'◈' }),
  Object.freeze({ id:'school', label:'Escola do Tarot', family:'wisdom', sigil:'⌘' }),
  Object.freeze({ id:'journal', label:'Diário e Espelho', family:'wisdom', sigil:'☾' }),
  Object.freeze({ id:'ai', label:'Whit Local', family:'presence', sigil:'◌' }),
  Object.freeze({ id:'store', label:'Loja Mística', family:'experience', sigil:'✧' }),
  Object.freeze({ id:'consultations', label:'Consultas', family:'experience', sigil:'♢' }),
  Object.freeze({ id:'music', label:'Música', family:'experience', sigil:'♫' }),
  Object.freeze({ id:'videos', label:'Vídeos', family:'experience', sigil:'▷' }),
  Object.freeze({ id:'login', label:'Minha Orbe', family:'identity', sigil:'◐' }),
  Object.freeze({ id:'subscriptions', label:'Direitos Premium', family:'identity', sigil:'♕' }),
  Object.freeze({ id:'skins', label:'Skins da Orbe', family:'identity', sigil:'◉' }),
  Object.freeze({ id:'notifications', label:'Notificações', family:'identity', sigil:'✺' }),
  Object.freeze({ id:'admin', label:'Painel Supremo', family:'owner', sigil:'♜' })
]);

const PROFILES_V560 = new Map(PROFILE_LIST_V560.map(profile => [profile.id, profile]));
const ROUTE_ALIASES_V560 = Object.freeze({
  inicio:'home', carta:'daily', 'carta-do-dia':'daily', biblioteca:'library', escola:'school',
  tiragens:'spreads', diario:'journal', whit:'ai', loja:'store', consultas:'consultations',
  conta:'login', premium:'subscriptions', assinatura:'subscriptions', pele:'skins', notificacoes:'notifications',
  musica:'music', video:'videos', 'de-frente-com-o-tarot':'videos', painel:'admin'
});

export function normalizeDesignRouteV560(value) {
  const raw = String(value || '').trim().toLowerCase().replace(/^#/, '').replace(/^\/+|\/+$/g, '');
  const clean = raw.split(/[?&/]/)[0] || 'home';
  return ROUTE_ALIASES_V560[clean] || (PROFILES_V560.has(clean) ? clean : 'home');
}

export function designProfileV560(value) {
  return PROFILES_V560.get(normalizeDesignRouteV560(value)) || PROFILES_V560.get('home');
}

export function viewportProfileV560(width = 0, height = 0, scale = 1) {
  const safeWidth = Math.max(0, Number(width) || 0);
  const safeHeight = Math.max(0, Number(height) || 0);
  const safeScale = Math.max(1, Number(scale) || 1);
  const tier = safeWidth <= 350 ? 'compact' : safeWidth <= 430 ? 'phone' : safeWidth <= 768 ? 'tablet' : safeWidth <= 1280 ? 'desktop' : 'wide';
  return Object.freeze({
    width: Math.round(safeWidth),
    height: Math.round(safeHeight),
    scale: Number(safeScale.toFixed(2)),
    tier,
    orientation: safeWidth > safeHeight ? 'landscape' : 'portrait',
    zoomed: safeScale >= 1.75 || (safeWidth > 0 && safeWidth <= 640)
  });
}

export function stateCopyV560(state, route = 'home') {
  const profile = designProfileV560(route);
  const copies = {
    loading: Object.freeze({ icon:'✦', title:`Abrindo ${profile.label}`, message:'Preparando este mundo com cuidado…', live:'polite' }),
    offline: Object.freeze({ icon:'◌', title:'Modo offline', message:'A Orbe preservou o que está disponível neste aparelho.', live:'polite' }),
    error: Object.freeze({ icon:'◇', title:'Este mundo não abriu por completo', message:'Nada foi perdido. Você pode tentar novamente.', live:'assertive' }),
    success: Object.freeze({ icon:'✧', title:'Mundo pronto', message:`${profile.label} está disponível.`, live:'polite' })
  };
  return copies[state] || copies.success;
}

function eventRouteV560(event, fallback = 'home') {
  const detail = event?.detail || {};
  return normalizeDesignRouteV560(detail.id || detail.to || detail.route || fallback);
}

export function createPageDesignSupremeV560({ go, pageLoader, responsive, vitality } = {}) {
  if (globalThis.__divinaPageDesignSupremeV560?.destroy) return globalThis.__divinaPageDesignSupremeV560;

  const root = document.documentElement;
  const controller = new AbortController();
  const signal = controller.signal;
  const generatedHeadings = new Set();
  const managedScreens = new Set();
  let activeRoute = normalizeDesignRouteV560(document.body?.dataset?.screen || location.hash || 'home');
  let loadingTimer = 0;
  let settleTimer = 0;
  let decorateQueued = false;
  let destroyed = false;

  const ensureStyle = () => {
    let link = document.getElementById('divinaPageDesignSupremeV560');
    if (link) return link;
    link = document.createElement('link');
    link.id = 'divinaPageDesignSupremeV560';
    link.rel = 'stylesheet';
    link.href = './page-design-supreme-v560.css?v=560';
    document.head.append(link);
    return link;
  };

  const ensureSkipLink = () => {
    let link = document.getElementById('v560SkipLink');
    if (link) return link;
    link = document.createElement('a');
    link.id = 'v560SkipLink';
    link.className = 'v560-skip-link';
    link.href = '#app';
    link.textContent = 'Pular para o conteúdo';
    document.body.prepend(link);
    document.getElementById('app')?.setAttribute('tabindex', '-1');
    return link;
  };

  const ensureSystemState = () => {
    let surface = document.getElementById('v560SystemState');
    if (surface) return surface;
    surface = document.createElement('aside');
    surface.id = 'v560SystemState';
    surface.className = 'v560-system-state';
    surface.hidden = true;
    surface.dataset.v560State = 'idle';
    surface.setAttribute('role', 'status');
    surface.setAttribute('aria-live', 'polite');
    surface.setAttribute('aria-atomic', 'true');
    const icon = document.createElement('span');
    icon.className = 'v560-system-state__icon';
    icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    copy.className = 'v560-system-state__copy';
    const title = document.createElement('strong');
    const message = document.createElement('small');
    copy.append(title, message);
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'v560-system-state__retry';
    retry.textContent = 'Tentar novamente';
    retry.hidden = true;
    retry.addEventListener('click', () => {
      const route = normalizeDesignRouteV560(surface.dataset.route || activeRoute);
      hideSystemState();
      if (typeof pageLoader?.retry === 'function') pageLoader.retry(route);
      else if (typeof go === 'function') go(route, { source:'v560-recovery' });
    }, { signal });
    surface.append(icon, copy, retry);
    document.body.append(surface);
    return surface;
  };

  const showSystemState = (state, route = activeRoute) => {
    const surface = ensureSystemState();
    const copy = stateCopyV560(state, route);
    surface.dataset.v560State = state;
    surface.dataset.route = normalizeDesignRouteV560(route);
    surface.querySelector('.v560-system-state__icon').textContent = copy.icon;
    surface.querySelector('strong').textContent = copy.title;
    surface.querySelector('small').textContent = copy.message;
    surface.querySelector('.v560-system-state__retry').hidden = state !== 'error';
    surface.setAttribute('role', state === 'error' ? 'alert' : 'status');
    surface.setAttribute('aria-live', copy.live);
    surface.hidden = false;
  };

  const hideSystemState = () => {
    if (navigator.onLine === false) return;
    const surface = document.getElementById('v560SystemState');
    if (!surface) return;
    surface.hidden = true;
    surface.dataset.v560State = 'idle';
    surface.setAttribute('role', 'status');
    surface.setAttribute('aria-live', 'polite');
  };

  const ensureWorldMark = (screen, profile) => {
    if (!screen || profile.id === 'home' || screen.querySelector(':scope > .v560-world-mark')) return;
    const mark = document.createElement('div');
    mark.className = 'v560-world-mark';
    mark.dataset.family = profile.family;
    mark.setAttribute('aria-hidden', 'true');
    const sigil = document.createElement('span');
    sigil.textContent = profile.sigil;
    const name = document.createElement('small');
    name.textContent = profile.label;
    mark.append(sigil, name);
    screen.prepend(mark);
  };

  const decorateScreen = screen => {
    if (!screen?.id) return;
    const profile = designProfileV560(screen.id);
    screen.dataset.v560Screen = profile.id;
    screen.dataset.v560Family = profile.family;
    if (!screen.dataset.v560State) screen.dataset.v560State = 'idle';
    const heading = screen.querySelector('h1, h2');
    if (heading) {
      if (!heading.id) {
        heading.id = `v560-${profile.id}-title`;
        heading.dataset.v560Heading = 'true';
        generatedHeadings.add(heading);
      }
      if (!screen.hasAttribute('aria-labelledby')) {
        screen.setAttribute('aria-labelledby', heading.id);
        screen.dataset.v560Labelled = 'true';
      }
    } else if (!screen.hasAttribute('aria-label')) {
      screen.setAttribute('aria-label', profile.label);
      screen.dataset.v560Labelled = 'true';
    }
    ensureWorldMark(screen, profile);
    managedScreens.add(screen);
  };

  const decorateAll = () => {
    document.querySelectorAll('#app > .screen').forEach(decorateScreen);
    syncRoute(document.body?.dataset?.screen || activeRoute);
  };

  const scheduleDecorate = () => {
    if (decorateQueued || destroyed) return;
    decorateQueued = true;
    queueMicrotask(() => {
      decorateQueued = false;
      if (!destroyed) decorateAll();
    });
  };

  const setScreenState = (route, state) => {
    const screen = document.getElementById(normalizeDesignRouteV560(route));
    if (!screen?.classList.contains('screen')) return;
    screen.dataset.v560State = state;
  };

  function syncRoute(value) {
    activeRoute = normalizeDesignRouteV560(value || document.body?.dataset?.screen || location.hash || 'home');
    root.dataset.v560Route = activeRoute;
    root.dataset.v560Family = designProfileV560(activeRoute).family;
    document.querySelectorAll('#app > .screen').forEach(screen => {
      const isActive = screen.id === activeRoute;
      if (isActive) {
        if (screen.dataset.v560Inert === 'true') {
          screen.inert = false;
          screen.removeAttribute('inert');
          delete screen.dataset.v560Inert;
        }
        screen.setAttribute('aria-hidden', 'false');
      } else {
        if (!screen.hasAttribute('inert')) {
          screen.inert = true;
          screen.dataset.v560Inert = 'true';
        }
        screen.setAttribute('aria-hidden', 'true');
      }
    });
    document.querySelectorAll('[data-go]').forEach(control => {
      if (normalizeDesignRouteV560(control.dataset.go) === activeRoute) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    });
  }

  const syncViewport = () => {
    const viewport = globalThis.visualViewport;
    const profile = viewportProfileV560(viewport?.width || innerWidth, viewport?.height || innerHeight, viewport?.scale || 1);
    root.dataset.v560Viewport = profile.tier;
    root.dataset.v560Orientation = profile.orientation;
    root.dataset.v560Zoom = profile.zoomed ? 'zoomed' : 'default';
    root.style.setProperty('--v560-viewport-height', `${profile.height}px`);
    root.style.setProperty('--v560-viewport-width', `${profile.width}px`);
  };

  const onLoading = event => {
    const route = eventRouteV560(event, activeRoute);
    activeRoute = route;
    clearTimeout(loadingTimer);
    clearTimeout(settleTimer);
    setScreenState(route, 'loading');
    loadingTimer = setTimeout(() => showSystemState('loading', route), 120);
    scheduleDecorate();
  };

  const onReady = event => {
    const route = eventRouteV560(event, document.body?.dataset?.screen || activeRoute);
    clearTimeout(loadingTimer);
    clearTimeout(settleTimer);
    syncRoute(route);
    scheduleDecorate();
    if (navigator.onLine === false) {
      setScreenState(route, 'offline');
      showSystemState('offline', route);
      return;
    }
    setScreenState(route, 'success');
    hideSystemState();
    settleTimer = setTimeout(() => setScreenState(route, 'idle'), 900);
  };

  const onError = event => {
    const route = eventRouteV560(event, activeRoute);
    clearTimeout(loadingTimer);
    clearTimeout(settleTimer);
    syncRoute(route);
    setScreenState(route, 'error');
    showSystemState('error', route);
  };

  const onOffline = () => {
    root.dataset.v560Network = 'offline';
    setScreenState(activeRoute, 'offline');
    showSystemState('offline', activeRoute);
  };

  const onOnline = () => {
    root.dataset.v560Network = 'online';
    setScreenState(activeRoute, 'success');
    showSystemState('success', activeRoute);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      setScreenState(activeRoute, 'idle');
      hideSystemState();
    }, 1400);
  };

  const listen = (target, type, handler) => target?.addEventListener?.(type, handler, { signal });
  ['divina:page-loading', 'divina:route-start'].forEach(type => {
    listen(document, type, onLoading);
    listen(globalThis, type, onLoading);
  });
  ['divina:page-ready', 'divina:route-ready'].forEach(type => {
    listen(document, type, onReady);
    listen(globalThis, type, onReady);
  });
  listen(document, 'divina:page-error', onError);
  listen(globalThis, 'divina:page-error', onError);
  ['divina:auth-state', 'divina:account-world-ready', 'divina:admin-ready', 'divina:viewport-state'].forEach(type => {
    listen(document, type, scheduleDecorate);
    listen(globalThis, type, scheduleDecorate);
  });
  listen(globalThis, 'online', onOnline);
  listen(globalThis, 'offline', onOffline);
  listen(globalThis, 'hashchange', () => syncRoute(location.hash));
  listen(globalThis, 'popstate', () => scheduleDecorate());
  listen(globalThis, 'pageshow', () => {
    syncViewport();
    scheduleDecorate();
  });
  listen(globalThis, 'resize', syncViewport);
  listen(globalThis.visualViewport, 'resize', syncViewport);
  listen(globalThis.visualViewport, 'scroll', syncViewport);

  const audit = () => {
    const screens = [...document.querySelectorAll('#app > .screen')];
    const visibleControls = [...document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]')]
      .filter(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      });
    const undersized = visibleControls.filter(element => {
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    });
    const canonicalOrbCount = document.querySelectorAll('#orb').length;
    return Object.freeze({
      release: 'V560',
      routesExpected: PROFILE_LIST_V560.length,
      screensFound: screens.length,
      screensDecorated: screens.filter(screen => screen.dataset.v560Screen).length,
      screensLabelled: screens.filter(screen => screen.hasAttribute('aria-label') || screen.hasAttribute('aria-labelledby')).length,
      activeRoute,
      activeScreens: screens.filter(screen => screen.getAttribute('aria-hidden') === 'false').length,
      missingRoutes: PROFILE_LIST_V560.filter(profile => !document.getElementById(profile.id)).map(profile => profile.id),
      visibleControls: visibleControls.length,
      undersizedVisibleControls: undersized.length,
      canonicalOrbCount,
      duplicateOrbs: Math.max(0, canonicalOrbCount - 1),
      responsiveFoundation: responsive?.status?.() || null,
      vitality: vitality?.snapshot?.() || vitality?.status?.() || null,
      mutationObservers: 0,
      permanentAnimationLoops: 0,
      privateReads: 0,
      storageWrites: 0,
      apiCalls: 0
    });
  };

  const status = () => Object.freeze({
    ...PAGE_DESIGN_SUPREME_CONTRACT_V560,
    route: activeRoute,
    family: designProfileV560(activeRoute).family,
    network: navigator.onLine === false ? 'offline' : 'online',
    viewport: viewportProfileV560(globalThis.visualViewport?.width || innerWidth, globalThis.visualViewport?.height || innerHeight, globalThis.visualViewport?.scale || 1),
    audit: audit()
  });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    controller.abort();
    clearTimeout(loadingTimer);
    clearTimeout(settleTimer);
    document.getElementById('v560SkipLink')?.remove();
    document.getElementById('v560SystemState')?.remove();
    document.querySelectorAll('.v560-world-mark').forEach(mark => mark.remove());
    managedScreens.forEach(screen => {
      delete screen.dataset.v560Screen;
      delete screen.dataset.v560Family;
      delete screen.dataset.v560State;
      if (screen.dataset.v560Inert === 'true') {
        screen.inert = false;
        screen.removeAttribute('inert');
        delete screen.dataset.v560Inert;
      }
      screen.removeAttribute('aria-hidden');
      if (screen.dataset.v560Labelled === 'true') {
        screen.removeAttribute('aria-labelledby');
        screen.removeAttribute('aria-label');
        delete screen.dataset.v560Labelled;
      }
    });
    generatedHeadings.forEach(heading => {
      if (heading.dataset.v560Heading === 'true') {
        heading.removeAttribute('id');
        delete heading.dataset.v560Heading;
      }
    });
    ['pageDesign', 'v560Route', 'v560Family', 'v560Network', 'v560Viewport', 'v560Orientation', 'v560Zoom'].forEach(key => delete root.dataset[key]);
    root.style.removeProperty('--v560-viewport-height');
    root.style.removeProperty('--v560-viewport-width');
    delete globalThis.__divinaPageDesignSupremeV560;
  };

  ensureStyle();
  ensureSkipLink();
  ensureSystemState();
  root.dataset.pageDesign = 'v560';
  root.dataset.v560Network = navigator.onLine === false ? 'offline' : 'online';
  syncViewport();
  decorateAll();
  if (navigator.onLine === false) onOffline();

  const api = Object.freeze({
    contract: PAGE_DESIGN_SUPREME_CONTRACT_V560,
    profiles: PROFILE_LIST_V560,
    profile: designProfileV560,
    viewport: () => viewportProfileV560(globalThis.visualViewport?.width || innerWidth, globalThis.visualViewport?.height || innerHeight, globalThis.visualViewport?.scale || 1),
    decorate: decorateAll,
    syncRoute,
    showState: showSystemState,
    hideState: hideSystemState,
    audit,
    status,
    destroy
  });
  globalThis.__divinaPageDesignSupremeV560 = api;
  document.dispatchEvent(new CustomEvent('divina:page-design-ready', { detail:{ version:560, routes:PROFILE_LIST_V560.length } }));
  return api;
}
