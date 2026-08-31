// DIVINA BRUXA V72 — MENU SOBRE A ORBE PRINCIPAL
// Não existe uma segunda tela: os caminhos aparecem ao redor da Orbe da Home.
export function createNavigation() {
  const screens = [...document.querySelectorAll('.screen')];
  const home = document.querySelector('#home');
  const orbMenu = document.querySelector('#orbMenu');
  const menuButton = document.querySelector('#menuBtn');
  const pathsButton = document.querySelector('#pathsBtn');
  let lastFocus = null;

  const setCurrent = id => document.querySelectorAll('.magic-dock [data-go], .home-orb-menu [data-go]').forEach(button => {
    const current = button.dataset.go === id;
    button.classList.toggle('is-current', current);
    if (current) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  const closeOrbMenu = (restore = false) => {
    home?.classList.remove('orb-menu-open');
    orbMenu?.setAttribute('aria-hidden', 'true');
    menuButton?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    const label = menuButton?.querySelector('span');
    if (label) label.textContent = 'MENU';
    pathsButton?.setAttribute('aria-expanded', 'false');
    if (restore && lastFocus?.focus) lastFocus.focus({ preventScroll: true });
    if (restore) lastFocus = null;
  };

  const go = (id, push = true) => {
    if (!document.getElementById(id)) id = 'home';
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
    closeOrbMenu(false);
    document.body.dataset.screen = id;
    setCurrent(id);
    window.scrollTo({
      top: 0,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    if (push) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
  };

  const openOrbMenu = () => {
    if (!home || !orbMenu) return;
    if (!home.classList.contains('active')) go('home');
    if (home.classList.contains('orb-menu-open')) return;
    lastFocus = document.activeElement;
    home.classList.add('orb-menu-open');
    orbMenu.setAttribute('aria-hidden', 'false');
    menuButton?.classList.add('is-open');
    menuButton?.setAttribute('aria-expanded', 'true');
    menuButton?.setAttribute('aria-label', 'Fechar menu');
    const label = menuButton?.querySelector('span');
    if (label) label.textContent = 'FECHAR';
    pathsButton?.setAttribute('aria-expanded', 'true');
  };

  const toggleOrbMenu = () => {
    if (home?.classList.contains('orb-menu-open')) closeOrbMenu(true);
    else openOrbMenu();
  };

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (target) go(target.dataset.go);
  });

  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-controls', 'orbMenu');
  pathsButton?.setAttribute('aria-expanded', 'false');
  pathsButton?.setAttribute('aria-controls', 'orbMenu');
  menuButton?.addEventListener('click', toggleOrbMenu);
  pathsButton?.addEventListener('click', toggleOrbMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && home?.classList.contains('orb-menu-open')) closeOrbMenu(true);
  });
  addEventListener('popstate', () => go(location.hash.slice(1) || 'home', false));
  go(location.hash.slice(1) || 'home', false);
  return { go };
}
