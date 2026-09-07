// DIVINA BRUXA V180 — NAVEGAÇÃO SOBERANA + BASE IMORTAL
// A Orbe mantém o canvas no mesmo tamanho. Abrir, fechar e inverter o gesto
// usam uma única transição visual, sem quadro vazio e sem deslocar a página.
import { isKnownRoute, normalizeRouteId, routeFromLocation } from './route-registry-v180.js?v=180';

export function createNavigation({ beforeEnter: initialBeforeEnter = null, autoStart = false } = {}) {
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

  // Portais comerciais e de conteúdo ficam em uma fileira própria acima da órbita,
  // sem alterar a geometria da Orbe principal.
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

  let lastFocus = null;
  let restoreFocus = false;
  let wantsMenuOpen = false;
  let motionToken = 0;
  let motionFrame = 0;
  let motionTimer = 0;
  let stageMotion = null;

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

  const cancelMotion = () => {
    motionToken += 1;
    cancelAnimationFrame(motionFrame);
    clearTimeout(motionTimer);
    stageMotion?.cancel();
    stageMotion = null;
    motionFrame = 0;
    motionTimer = 0;
  };

  const finishMotion = token => {
    if (!home || !orbMenu || token !== motionToken) return;
    home.classList.remove('orb-menu-transition', 'orb-menu-opening', 'orb-menu-closing');
    if (wantsMenuOpen) {
      home.classList.add('orb-menu-open');
      orbMenu.setAttribute('aria-hidden', 'false');
      return;
    }
    home.classList.remove('orb-menu-open');
    orbMenu.setAttribute('aria-hidden', 'true');
    if (restoreFocus && lastFocus?.focus) lastFocus.focus({ preventScroll: true });
    restoreFocus = false;
    lastFocus = null;
  };

  const settleMotion = token => {
    const delay = reducedMotion.matches ? 0 : 640;
    motionTimer = setTimeout(() => finishMotion(token), delay);
  };

  const glideOrbStage = (from, to, opening) => {
    if (!orbStage || !from || !to || reducedMotion.matches) return;
    const safeWidth = Math.max(to.width, 1);
    const safeHeight = Math.max(to.height, 1);
    const deltaX = from.left - to.left;
    const deltaY = from.top - to.top;
    const scaleX = Math.max(.01, from.width / safeWidth);
    const scaleY = Math.max(.01, from.height / safeHeight);
    const duration = opening ? 620 : 560;
    const animation = orbStage.animate([
      { transform: `translate3d(${deltaX}px,${deltaY}px,0) scale(${scaleX},${scaleY})` },
      { transform: 'translate3d(0,0,0) scale(1,1)' }
    ], {
      duration,
      easing: opening ? 'cubic-bezier(.16,.82,.22,1)' : 'cubic-bezier(.32,.72,.18,1)',
      fill: 'both'
    });
    stageMotion = animation;
    animation.onfinish = () => {
      if (stageMotion !== animation) return;
      animation.cancel();
      stageMotion = null;
    };
  };

  const resetOrbMenu = () => {
    cancelMotion();
    wantsMenuOpen = false;
    restoreFocus = false;
    lastFocus = null;
    home?.classList.remove('orb-menu-open', 'orb-menu-transition', 'orb-menu-opening', 'orb-menu-closing');
    orbMenu?.setAttribute('aria-hidden', 'true');
    setMenuControls(false);
  };

  const commit = (requestedId, push = true) => {
    let id = normalizeRouteId(requestedId);
    const screens = [...document.querySelectorAll('.screen')];
    if (id === 'skins' && !document.getElementById('skins')) {
      screens.forEach(screen => screen.classList.toggle('active', screen.id === 'home'));
      resetOrbMenu();
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
    resetOrbMenu();
    document.body.dataset.screen = id;
    setCurrent(id);
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
    const current = location.hash.slice(1) || 'home';
    if (push && current !== id) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
    lastSyncedLocation = `${location.pathname}${location.search}${location.hash}`;
    return id;
  };

  const go = async (requestedId, push = true) => {
    const id = normalizeRouteId(requestedId);
    const token = ++navigationToken;
    const html = document.documentElement;
    html.dataset.routePending = id;
    document.dispatchEvent(new CustomEvent('divina:route-start', { detail: { id } }));
    let error = null;
    try {
      await beforeEnter?.(id);
    } catch (reason) {
      error = reason;
    }
    if (token !== navigationToken) return false;
    const committed = commit(id, push);
    delete html.dataset.routePending;
    document.dispatchEvent(new CustomEvent(error ? 'divina:route-error' : 'divina:route-ready', {
      detail: { id: committed || id, recoverable: Boolean(error) }
    }));
    return !error;
  };

  const transitionOrbMenu = (open, shouldRestore = false) => {
    if (!home || !orbMenu) return;
    if (open && !home.classList.contains('active')) {
      go('home').then(ready => {
        if (ready) transitionOrbMenu(true, shouldRestore);
      });
      return;
    }
    if (open && !wantsMenuOpen) lastFocus = document.activeElement;

    // Mede o quadro que a pessoa está vendo. Assim, até uma inversão rápida
    // continua do ponto atual, como uma transição nativa do iOS.
    const fromRect = orbStage?.getBoundingClientRect();
    cancelMotion();
    const token = motionToken;
    wantsMenuOpen = open;
    restoreFocus = !open && shouldRestore;
    setMenuControls(open);

    // A imagem de segurança fica pintada antes do primeiro quadro de escala.
    orbMenu.setAttribute('aria-hidden', 'false');
    home.classList.add('orb-menu-transition');
    home.classList.toggle('orb-menu-opening', open);
    home.classList.toggle('orb-menu-closing', !open);

    motionFrame = requestAnimationFrame(() => {
      if (token !== motionToken) return;
      home.classList.toggle('orb-menu-open', open);
      const toRect = orbStage?.getBoundingClientRect();
      glideOrbStage(fromRect, toRect, open);
      settleMotion(token);
    });
  };

  const openOrbMenu = () => transitionOrbMenu(true);
  const closeOrbMenu = (shouldRestore = false) => transitionOrbMenu(false, shouldRestore);
  const toggleOrbMenu = () => transitionOrbMenu(!wantsMenuOpen, true);

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (!target) return;
    event.preventDefault();
    go(target.dataset.go).catch(() => {});
  });

  menuButton?.setAttribute('aria-controls', 'orbMenu');
  setMenuControls(false);
  menuButton?.addEventListener('click', toggleOrbMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && wantsMenuOpen) closeOrbMenu(true);
  });
  const syncFromLocation = () => {
    const locationKey = `${location.pathname}${location.search}${location.hash}`;
    if (locationKey === lastSyncedLocation) return;
    if (routeSyncQueued) return;
    routeSyncQueued = true;
    queueMicrotask(() => {
      routeSyncQueued = false;
      go(routeFromLocation(), false).catch(() => {});
    });
  };
  addEventListener('popstate', syncFromLocation);
  addEventListener('hashchange', syncFromLocation);
  reducedMotion.addEventListener?.('change', () => {
    if (home?.classList.contains('orb-menu-transition')) finishMotion(motionToken);
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
  if (autoStart) start().catch(() => {});
  return Object.freeze({ go, start, setBeforeEnter, openOrbMenu, closeOrbMenu });
}
