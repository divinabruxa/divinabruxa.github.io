// DIVINA BRUXA V75 — MENU ORBITAL CONTÍNUO
// A Orbe mantém o canvas no mesmo tamanho. Abrir, fechar e inverter o gesto
// usam uma única transição visual, sem quadro vazio e sem deslocar a página.
export function createNavigation() {
  const screens = [...document.querySelectorAll('.screen')];
  const home = document.querySelector('#home');
  const orbMenu = document.querySelector('#orbMenu');
  const menuButton = document.querySelector('#menuBtn');
  const pathsButton = document.querySelector('#pathsBtn');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const ensureHomePortals = () => {
    if (!orbMenu || orbMenu.querySelector('.home-menu-portals')) return;
    const video = orbMenu.querySelector('.video-portal');
    const store = orbMenu.querySelector('.store-portal');
    if (!video && !store) return;
    const rail = document.createElement('div');
    rail.className = 'home-menu-portals';
    rail.setAttribute('aria-label', 'Portais adicionais da Orbe');
    const extras = [
      ['daily', '☾', 'Carta do Dia'],
      ['skins', '◈', 'Skins da Orbe'],
      ['subscriptions', '✦', 'Premium'],
      ['journal', '▤', 'Diário']
    ];
    const add = (button, id, symbol, label) => {
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.dataset.go = id;
        button.className = 'menu-portal';
        button.innerHTML = `<span aria-hidden="true">${symbol}</span><b>${label}</b>`;
      } else {
        button.classList.add('menu-portal');
        if (id === 'videos') {
          const title = button.querySelector('b');
          if (title) title.textContent = 'Vídeo';
        }
      }
      rail.appendChild(button);
    };
    add(video, 'videos', '▷', 'Vídeos');
    add(store, 'store', '◇', 'Loja Mística');
    extras.forEach(([id, symbol, label]) => add(null, id, symbol, label));
    orbMenu.appendChild(rail);
  };

  let lastFocus = null;
  let restoreFocus = false;
  let wantsMenuOpen = false;
  let motionToken = 0;
  let motionFrame = 0;
  let motionTimer = 0;

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
    const delay = reducedMotion.matches ? 0 : 540;
    motionTimer = setTimeout(() => finishMotion(token), delay);
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

  const go = (id, push = true) => {
    if (!document.getElementById(id)) id = 'home';
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
    resetOrbMenu();
    document.body.dataset.screen = id;
    setCurrent(id);
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
    if (push) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
  };

  const transitionOrbMenu = (open, shouldRestore = false) => {
    if (!home || !orbMenu) return;
    if (open && !home.classList.contains('active')) go('home');
    if (open && !wantsMenuOpen) lastFocus = document.activeElement;

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
      settleMotion(token);
    });
  };

  const openOrbMenu = () => transitionOrbMenu(true);
  const closeOrbMenu = (shouldRestore = false) => transitionOrbMenu(false, shouldRestore);
  const toggleOrbMenu = () => transitionOrbMenu(!wantsMenuOpen, true);

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (target) go(target.dataset.go);
  });

  ensureHomePortals();

  menuButton?.setAttribute('aria-controls', 'orbMenu');
  pathsButton?.setAttribute('aria-controls', 'orbMenu');
  setMenuControls(false);
  menuButton?.addEventListener('click', toggleOrbMenu);
  pathsButton?.addEventListener('click', toggleOrbMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && wantsMenuOpen) closeOrbMenu(true);
  });
  addEventListener('popstate', () => go(location.hash.slice(1) || 'home', false));
  reducedMotion.addEventListener?.('change', () => {
    if (home?.classList.contains('orb-menu-transition')) finishMotion(motionToken);
  });

  go(location.hash.slice(1) || 'home', false);
  return { go, openOrbMenu, closeOrbMenu };
}
