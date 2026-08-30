// DIVINA BRUXA V58 — MENU MÁGICO MODAL
export function createNavigation() {
  const screens = [...document.querySelectorAll('.screen')];
  const drawer = document.querySelector('#drawer');
  const menuButton = document.querySelector('#menuBtn');
  const closeButton = document.querySelector('#closeMenu');
  const appRoot = document.querySelector('#app');
  const dock = document.querySelector('.magic-dock');
  const unlock = () => document.documentElement.classList.remove('menu-open');
  let lastFocus = null;
  const setBackgroundInert = inert => {
    [appRoot, dock].forEach(node => { if (node) node.inert = inert; });
  };
  const focusable = () => [...(drawer?.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])') || [])].filter(node => !node.disabled && node.offsetParent !== null);

  const setCurrent = id => document.querySelectorAll('.magic-dock [data-go], .magic-menu [data-go]').forEach(button => {
    const current = button.dataset.go === id;
    button.classList.toggle('is-current', current);
    if (current) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  const closeDrawer = (restore = false) => {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-modal', 'false');
    unlock();
    setBackgroundInert(false);
    menuButton?.setAttribute('aria-expanded', 'false');
    if (restore && lastFocus?.focus) {
      lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }
  };

  const openDrawer = () => {
    if (!drawer) return;
    if (drawer.classList.contains('open')) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.setAttribute('aria-modal', 'true');
    document.documentElement.classList.add('menu-open');
    setBackgroundInert(true);
    menuButton?.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
  };

  const go = (id, push = true) => {
    if (!document.getElementById(id)) id = 'home';
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
    closeDrawer(false);
    document.body.dataset.screen = id;
    setCurrent(id);
    window.scrollTo({
      top: 0,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    if (push) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
  };

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (target) go(target.dataset.go);
  });
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-controls', 'drawer');
  drawer?.setAttribute('role', 'dialog');
  drawer?.setAttribute('aria-modal', 'false');
  menuButton?.addEventListener('click', openDrawer);
  document.querySelector('#pathsBtn')?.addEventListener('click', openDrawer);
  closeButton?.addEventListener('click', () => closeDrawer(true));
  drawer?.addEventListener('click', event => {
    if (event.target === drawer) closeDrawer(true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer(true);
    if (event.key === 'Tab' && drawer?.classList.contains('open')) {
      const items = focusable(); if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  addEventListener('popstate', () => go(location.hash.slice(1) || 'home', false));
  go(location.hash.slice(1) || 'home', false);
  return { go };
}
