// DIVINA BRUXA V210 — MENU 2.0 · MOTOR DE ESTADO REVERSÍVEL
// Preserva integralmente a geometria/visual V180. Esta versão troca apenas
// a autoridade interna do Menu Mágico: uma intenção, um estado, uma passagem.
import { isKnownRoute, normalizeRouteId, routeFromLocation } from './route-registry-v180.js?v=180';

const MENU_STATE = Object.freeze({
  CLOSED: 'CLOSED',
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  REVERSING: 'REVERSING',
  CLOSING: 'CLOSING',
  NAVIGATING: 'NAVIGATING'
});

export function createNavigation({ beforeEnter: initialBeforeEnter = null, autoStart = false } = {}) {
  const html = document.documentElement;
  const home = document.querySelector('#home');
  const orbMenu = document.querySelector('#orbMenu');
  const orbStage = home?.querySelector('.orb-stage-ref');
  const menuButton = document.querySelector('#menuBtn');
  const pathsButton = document.querySelector('#pathsBtn');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let beforeEnter = typeof initialBeforeEnter === 'function' ? initialBeforeEnter : null;
  let navigationToken = 0;
  let routeSyncQueued = false;
  let lastSyncedLocation = '';
  let started = false;

  // V180 criou os atalhos sem alterar a geometria principal; V210 preserva isso byte a byte em intenção.
  const ensureMenuPortals = () => {
    if (!orbMenu || orbMenu.querySelector('.home-menu-portals')) return;
    const row = document.createElement('div');
    row.className = 'home-menu-portals';
    row.setAttribute('aria-label', 'Atalhos da Orbe');
    const video = orbMenu.querySelector('.video-portal');
    if (video) {
      video.classList.add('menu-portal');
      const title = video.querySelector('b');
      if (title) title.textContent = 'Vídeo';
      row.append(video);
    }
    const shortcuts = [
      ['store', '◇', 'Loja Mística'],
      ['daily', '☾', 'Carta do Dia'],
      ['skins', '◆', 'Skins da Orbe'],
      ['subscriptions', '✦', 'Premium'],
      ['journal', '▤', 'Diário'],
      ['library', '▥', 'Biblioteca'],
      ['notifications', '☾', 'Notificações']
    ];
    shortcuts.forEach(([id, sigil, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'menu-portal';
      button.dataset.go = id;
      button.innerHTML = `<span aria-hidden="true">${sigil}</span><b>${label}</b>`;
      row.append(button);
    });
    orbMenu.append(row);
  };
  ensureMenuPortals();

  if (pathsButton) {
    pathsButton.dataset.go = 'skins';
    pathsButton.removeAttribute('aria-controls');
    const pathsLabel = pathsButton.querySelector('small');
    if (pathsLabel) pathsLabel.textContent = 'Skins';
  }

  let menuState = MENU_STATE.CLOSED;
  let menuTargetOpen = false;
  let lastFocus = null;
  let restoreFocus = false;
  let motionToken = 0;
  let motionFrame = 0;
  let stageMotion = null;
  let motionResolve = null;
  let motionPromise = Promise.resolve({ state: MENU_STATE.CLOSED, cancelled: false });

  const publishMenuState = (next, reason = 'transition') => {
    if (menuState === next) return;
    const previous = menuState;
    menuState = next;
    html.dataset.menuState = next.toLowerCase();
    document.dispatchEvent(new CustomEvent('divina:menu-state', {
      detail: { previous, state: next, targetOpen: menuTargetOpen, reason }
    }));
  };

  html.dataset.menuState = MENU_STATE.CLOSED.toLowerCase();

  const setCurrent = id => document.querySelectorAll('.magic-dock [data-go], .home-orb-menu [data-go]').forEach(button => {
    const current = button.dataset.go === id;
    button.classList.toggle('is-current', current);
    if (current) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  const setMenuControls = open => {
    menuButton?.classList.toggle('is-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    const label = menuButton?.querySelector('span');
    if (label) label.textContent = open ? 'FECHAR' : 'MENU';
    pathsButton?.classList.toggle('is-open', open);
    pathsButton?.setAttribute('aria-expanded', String(open));
    pathsButton?.setAttribute('aria-label', open ? 'Fechar menu mágico' : 'Abrir menu mágico');
  };

  const resolveMotion = result => {
    if (!motionResolve) return;
    const resolve = motionResolve;
    motionResolve = null;
    resolve(result);
  };

  const cancelMotion = (reason = 'superseded') => {
    motionToken += 1;
    cancelAnimationFrame(motionFrame);
    motionFrame = 0;
    stageMotion?.cancel();
    stageMotion = null;
    resolveMotion({ state: menuState, cancelled: true, reason });
  };

  const makeMotionPromise = () => {
    motionPromise = new Promise(resolve => { motionResolve = resolve; });
    return motionPromise;
  };

  const glideOrbStage = (from, to, opening) => {
    if (!orbStage || !from || !to || reducedMotion.matches) return null;
    const safeWidth = Math.max(to.width, 1);
    const safeHeight = Math.max(to.height, 1);
    const deltaX = from.left - to.left;
    const deltaY = from.top - to.top;
    const scaleX = Math.max(.01, from.width / safeWidth);
    const scaleY = Math.max(.01, from.height / safeHeight);
    const animation = orbStage.animate([
      { transform: `translate3d(${deltaX}px,${deltaY}px,0) scale(${scaleX},${scaleY})` },
      { transform: 'translate3d(0,0,0) scale(1,1)' }
    ], {
      duration: opening ? 620 : 560,
      easing: opening ? 'cubic-bezier(.16,.82,.22,1)' : 'cubic-bezier(.32,.72,.18,1)',
      fill: 'both'
    });
    stageMotion = animation;
    animation.finished.catch(() => {}).finally(() => {
      if (stageMotion !== animation) return;
      animation.cancel();
      stageMotion = null;
    });
    return animation;
  };

  const activeVisualAnimations = () => {
    if (reducedMotion.matches) return [];
    const roots = [home, orbMenu].filter(Boolean);
    const unique = new Set();
    for (const root of roots) {
      try {
        for (const animation of root.getAnimations?.({ subtree: true }) || []) {
          if (animation.playState === 'finished' || animation.playState === 'idle') continue;
          // Respiração, aura e órbitas infinitas são vida contínua; nunca pertencem ao gate da transição.
          const timing = animation.effect?.getTiming?.();
          if (timing?.iterations === Infinity) continue;
          const computed = animation.effect?.getComputedTiming?.();
          if (computed?.endTime === Infinity) continue;
          unique.add(animation);
        }
      } catch { /* Safari antigo: o fallback abaixo conclui pelo frame */ }
    }
    if (stageMotion) unique.add(stageMotion);
    return [...unique];
  };

  const finishMotion = (token, { navigating = false } = {}) => {
    if (!home || !orbMenu || token !== motionToken) return;
    home.classList.remove('orb-menu-transition', 'orb-menu-opening', 'orb-menu-closing');

    if (menuTargetOpen) {
      home.classList.add('orb-menu-open');
      orbMenu.setAttribute('aria-hidden', 'false');
      publishMenuState(MENU_STATE.OPEN, 'settled-open');
      resolveMotion({ state: MENU_STATE.OPEN, cancelled: false });
      return;
    }

    home.classList.remove('orb-menu-open');
    orbMenu.setAttribute('aria-hidden', 'true');
    if (!navigating && menuState !== MENU_STATE.NAVIGATING) publishMenuState(MENU_STATE.CLOSED, 'settled-closed');

    if (!navigating && restoreFocus && lastFocus?.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch { lastFocus.focus(); }
    }
    if (!navigating) {
      restoreFocus = false;
      lastFocus = null;
    }
    resolveMotion({ state: menuState, cancelled: false });
  };

  const settleFromAnimations = async (token, options) => {
    if (token !== motionToken) return;
    if (reducedMotion.matches) {
      finishMotion(token, options);
      return;
    }

    // Espera as animações reais do quadro, em vez de manter vários timers concorrentes.
    const animations = activeVisualAnimations();
    if (!animations.length) {
      requestAnimationFrame(() => finishMotion(token, options));
      return;
    }

    // Um único watchdog impede que uma implementação defeituosa de Animation.finished prenda o Menu.
    let watchdog = 0;
    const guard = new Promise(resolve => { watchdog = setTimeout(resolve, 1200); });
    await Promise.race([
      Promise.allSettled(animations.map(animation => animation.finished)),
      guard
    ]);
    clearTimeout(watchdog);
    if (token === motionToken) finishMotion(token, options);
  };

  const resetOrbMenu = (reason = 'route-commit') => {
    cancelMotion(reason);
    menuTargetOpen = false;
    restoreFocus = false;
    lastFocus = null;
    home?.classList.remove('orb-menu-open', 'orb-menu-transition', 'orb-menu-opening', 'orb-menu-closing');
    orbMenu?.setAttribute('aria-hidden', 'true');
    setMenuControls(false);
    publishMenuState(MENU_STATE.CLOSED, reason);
  };

  const transitionOrbMenu = async (open, { shouldRestore = false, navigating = false } = {}) => {
    if (!home || !orbMenu) return { state: MENU_STATE.CLOSED, cancelled: false };

    if (open && menuState === MENU_STATE.NAVIGATING) {
      return { state: MENU_STATE.NAVIGATING, cancelled: true, reason: 'navigation-locked' };
    }

    if (open && !home.classList.contains('active')) {
      const ready = await go('home');
      if (!ready) return { state: menuState, cancelled: true, reason: 'home-unavailable' };
      return transitionOrbMenu(true, { shouldRestore });
    }

    const alreadySettled = open ? menuState === MENU_STATE.OPEN : menuState === MENU_STATE.CLOSED;
    if (alreadySettled && !navigating) return { state: menuState, cancelled: false };

    if (open && !menuTargetOpen && menuState !== MENU_STATE.OPENING) lastFocus = document.activeElement;

    // getBoundingClientRect é usado somente no início da transação do menu, nunca no hot path do gesto da Orbe.
    const fromRect = orbStage?.getBoundingClientRect();
    const wasMoving = [MENU_STATE.OPENING, MENU_STATE.CLOSING, MENU_STATE.REVERSING].includes(menuState);
    cancelMotion(open ? 'open-intent' : navigating ? 'navigation-intent' : 'close-intent');
    const token = motionToken;
    makeMotionPromise();

    menuTargetOpen = open;
    restoreFocus = !open && shouldRestore && !navigating;
    setMenuControls(open);

    if (navigating) publishMenuState(MENU_STATE.NAVIGATING, 'route-intent');
    else if (wasMoving) publishMenuState(MENU_STATE.REVERSING, open ? 'reverse-open' : 'reverse-close');
    else publishMenuState(open ? MENU_STATE.OPENING : MENU_STATE.CLOSING, open ? 'open' : 'close');

    // Mantém a imagem pintada enquanto fecha. aria-hidden só volta a true após o último quadro.
    orbMenu.setAttribute('aria-hidden', 'false');
    home.classList.add('orb-menu-transition');
    home.classList.toggle('orb-menu-opening', open);
    home.classList.toggle('orb-menu-closing', !open);

    motionFrame = requestAnimationFrame(() => {
      if (token !== motionToken) return;
      home.classList.toggle('orb-menu-open', open);
      const toRect = orbStage?.getBoundingClientRect();
      glideOrbStage(fromRect, toRect, open);
      // Um segundo frame garante que transições CSS criadas pela troca de classe já estejam enumeráveis.
      requestAnimationFrame(() => settleFromAnimations(token, { navigating }).catch(() => finishMotion(token, { navigating })));
    });

    return motionPromise;
  };

  const openOrbMenu = () => transitionOrbMenu(true);
  const closeOrbMenu = (shouldRestore = false) => transitionOrbMenu(false, { shouldRestore });
  const toggleOrbMenu = () => transitionOrbMenu(!menuTargetOpen, { shouldRestore: true });

  const commit = (requestedId, push = true) => {
    let id = normalizeRouteId(requestedId);
    const screens = [...document.querySelectorAll('.screen')];

    if (id === 'skins' && !document.getElementById('skins')) {
      screens.forEach(screen => screen.classList.toggle('active', screen.id === 'home'));
      resetOrbMenu('skins-fallback');
      document.body.dataset.screen = 'home';
      setCurrent('skins');
      document.querySelector('.home-skins')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    if (!document.getElementById(id)) id = 'home';
    screens.forEach(screen => {
      const active = screen.id === id;
      screen.classList.toggle('active', active);
      screen.setAttribute('aria-hidden', String(!active));
    });

    resetOrbMenu('route-commit');
    document.body.dataset.screen = id;
    setCurrent(id);
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });

    const current = location.hash.slice(1) || 'home';
    if (push && current !== id) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
    lastSyncedLocation = `${location.pathname}${location.search}${location.hash}`;
    return id;
  };

  const go = async (requestedId, push = true) => {
    const id = normalizeRouteId(requestedId);
    const token = ++navigationToken;
    html.dataset.routePending = id;
    document.dispatchEvent(new CustomEvent('divina:route-start', { detail: { id } }));

    // A próxima página prepara em paralelo ao fechamento do Menu. A pessoa percebe uma passagem, não duas esperas.
    const preparation = Promise.resolve().then(() => beforeEnter?.(id)).then(
      () => ({ error: null }),
      error => ({ error })
    );
    const menuClosure = menuState === MENU_STATE.CLOSED
      ? Promise.resolve({ state: MENU_STATE.CLOSED, cancelled: false })
      : transitionOrbMenu(false, { navigating: true });

    const [{ error }] = await Promise.all([preparation, menuClosure]);
    if (token !== navigationToken) return false;

    const committed = commit(id, push);
    delete html.dataset.routePending;
    document.dispatchEvent(new CustomEvent(error ? 'divina:route-error' : 'divina:route-ready', {
      detail: { id: committed || id, recoverable: Boolean(error) }
    }));
    return !error;
  };

  // Uma única autoridade de roteamento para todos os data-go.
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (!target) return;
    event.preventDefault();
    go(target.dataset.go).catch(() => {});
  });

  menuButton?.setAttribute('aria-controls', 'orbMenu');
  setMenuControls(false);
  menuButton?.addEventListener('click', event => {
    event.preventDefault();
    toggleOrbMenu().catch(() => {});
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuState !== MENU_STATE.CLOSED && menuState !== MENU_STATE.NAVIGATING) {
      event.preventDefault();
      closeOrbMenu(true).catch(() => {});
    }
  });

  const syncFromLocation = () => {
    const locationKey = `${location.pathname}${location.search}${location.hash}`;
    if (locationKey === lastSyncedLocation || routeSyncQueued) return;
    routeSyncQueued = true;
    queueMicrotask(() => {
      routeSyncQueued = false;
      go(routeFromLocation(), false).catch(() => {});
    });
  };
  addEventListener('popstate', syncFromLocation);
  addEventListener('hashchange', syncFromLocation);

  reducedMotion.addEventListener?.('change', () => {
    if (home?.classList.contains('orb-menu-transition')) finishMotion(motionToken, { navigating: menuState === MENU_STATE.NAVIGATING });
  });

  const start = async () => {
    if (started) return true;
    started = true;
    const raw = location.hash.slice(1) || 'home';
    const id = routeFromLocation();
    const ready = await go(id, false);
    if (!isKnownRoute(raw) || raw !== id) {
      history.replaceState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
      lastSyncedLocation = `${location.pathname}${location.search}${location.hash}`;
    }
    return ready;
  };

  const setBeforeEnter = handler => {
    beforeEnter = typeof handler === 'function' ? handler : null;
  };

  const menuSnapshot = () => Object.freeze({
    state: menuState,
    targetOpen: menuTargetOpen,
    routePending: html.dataset.routePending || null
  });

  if (autoStart) start().catch(() => {});
  return Object.freeze({ go, start, setBeforeEnter, openOrbMenu, closeOrbMenu, menuSnapshot, MENU_STATE });
}
