/* DIVINA BRUXA 2.0 — REBIRTH R001 · NAVEGAÇÃO ORGÂNICA V300
   Uma única passagem entre mundos. Mantém a tela atual até o próximo mundo estar pronto,
   fecha o menu sem corte e nunca mostra uma tela branca entre rotas. */
import { normalizeRouteId, routeFromLocation } from './route-registry-v180.js?v=300';

const ROUTE_PHASE = Object.freeze({ IDLE:'idle', PREPARING:'preparing', LEAVING:'leaving', ENTERING:'entering' });
const MENU_PHASE = Object.freeze({ CLOSED:'closed', OPENING:'opening', OPEN:'open', CLOSING:'closing' });
const pause = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
const focusables = root => [...(root?.querySelectorAll?.('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') || [])].filter(el => !el.hidden && el.getClientRects().length);

export function createNavigation({ beforeEnter: initialBeforeEnter = null } = {}) {
  const html = document.documentElement;
  const body = document.body;
  const menu = document.querySelector('#orbMenu');
  const menuButton = document.querySelector('#menuBtn');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let beforeEnter = typeof initialBeforeEnter === 'function' ? initialBeforeEnter : null;
  let currentRoute = 'home';
  let routeToken = 0;
  let menuPhase = MENU_PHASE.CLOSED;
  let previousFocus = null;
  let started = false;

  const veil = document.createElement('div');
  veil.className = 'db-route-veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = '<span class="db-route-veil__orb" data-orb-surface="transition"></span>';
  body.append(veil);

  const publishMenu = reason => document.dispatchEvent(new CustomEvent('divina:menu-state', {
    detail:{ state:menuPhase.toUpperCase(), reason }
  }));

  const setMenuButton = open => {
    if (!menuButton) return;
    menuButton.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar universo de navegação' : 'Abrir universo de navegação');
    const label = menuButton.querySelector('span');
    if (label) label.textContent = open ? 'FECHAR' : 'MENU';
  };

  const setMenuInteractive = interactive => {
    if (!menu) return;
    menu.setAttribute('aria-hidden', String(!interactive));
    if ('inert' in menu) menu.inert = !interactive;
  };

  const openOrbMenu = async () => {
    if (!menu || menuPhase === MENU_PHASE.OPEN || menuPhase === MENU_PHASE.OPENING) return true;
    previousFocus = document.activeElement;
    menuPhase = MENU_PHASE.OPENING;
    publishMenu('open');
    setMenuInteractive(true);
    setMenuButton(true);
    html.classList.add('db-menu-open');
    body.classList.add('db-menu-open');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    await pause(reducedMotion.matches ? 0 : 360);
    menuPhase = MENU_PHASE.OPEN;
    publishMenu('opened');
    const first = menu.querySelector('[data-menu-cluster][aria-selected="true"]') || focusables(menu)[0];
    first?.focus?.({ preventScroll:true });
    return true;
  };

  const closeOrbMenu = async ({ restoreFocus = true } = {}) => {
    if (!menu || menuPhase === MENU_PHASE.CLOSED || menuPhase === MENU_PHASE.CLOSING) return true;
    menuPhase = MENU_PHASE.CLOSING;
    publishMenu('close');
    menu.classList.remove('is-open');
    setMenuButton(false);
    await pause(reducedMotion.matches ? 0 : 300);
    html.classList.remove('db-menu-open');
    body.classList.remove('db-menu-open');
    setMenuInteractive(false);
    menuPhase = MENU_PHASE.CLOSED;
    publishMenu('closed');
    if (restoreFocus) previousFocus?.focus?.({ preventScroll:true });
    previousFocus = null;
    return true;
  };

  const toggleOrbMenu = () => menuPhase === MENU_PHASE.CLOSED || menuPhase === MENU_PHASE.CLOSING
    ? openOrbMenu()
    : closeOrbMenu();

  const markCurrent = id => {
    document.querySelectorAll('[data-go]').forEach(control => {
      const active = control.dataset.go === id;
      control.classList.toggle('is-current', active);
      if (active) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    });
  };

  const commit = (rawId, push = true) => {
    let id = normalizeRouteId(rawId);
    if (!document.getElementById(id)) id = 'home';
    const screens = [...document.querySelectorAll('#app > .screen')];
    for (const screen of screens) {
      const active = screen.id === id;
      screen.classList.toggle('active', active);
      screen.setAttribute('aria-hidden', String(!active));
      if ('inert' in screen) screen.inert = !active;
    }
    currentRoute = id;
    body.dataset.screen = id;
    html.dataset.world = id;
    markCurrent(id);
    if (push) {
      const desired = id === 'home' ? `${location.pathname}${location.search}` : `${location.pathname}${location.search}#${id}`;
      const current = `${location.pathname}${location.search}${location.hash}`;
      if (current !== desired) history.pushState({ screen:id }, '', desired);
    }
    window.scrollTo({ top:0, left:0, behavior:'auto' });
    document.dispatchEvent(new CustomEvent('divina:world-changed', { detail:{ id } }));
    return id;
  };

  const go = async (rawId, push = true) => {
    const id = normalizeRouteId(rawId);
    if (id === currentRoute && started) {
      await closeOrbMenu({ restoreFocus:false });
      return true;
    }
    const token = ++routeToken;
    html.dataset.routePhase = ROUTE_PHASE.PREPARING;
    html.dataset.routePending = id;
    document.dispatchEvent(new CustomEvent('divina:route-start', { detail:{ id } }));

    const preparation = Promise.resolve().then(() => beforeEnter?.(id));
    const menuTask = closeOrbMenu({ restoreFocus:false });
    try {
      await Promise.all([preparation, menuTask]);
    } catch (error) {
      if (token !== routeToken) return false;
      delete html.dataset.routePending;
      html.dataset.routePhase = ROUTE_PHASE.IDLE;
      document.dispatchEvent(new CustomEvent('divina:route-error', { detail:{ id, error, recoverable:true } }));
      return false;
    }
    if (token !== routeToken) return false;

    html.dataset.routePhase = ROUTE_PHASE.LEAVING;
    veil.classList.add('is-active');
    await pause(reducedMotion.matches ? 0 : 125);
    if (token !== routeToken) return false;

    const committed = commit(id, push);
    html.dataset.routePhase = ROUTE_PHASE.ENTERING;
    document.dispatchEvent(new CustomEvent('divina:route-ready', { detail:{ id:committed } }));
    requestAnimationFrame(() => veil.classList.remove('is-active'));
    await pause(reducedMotion.matches ? 0 : 360);
    if (token === routeToken) {
      html.dataset.routePhase = ROUTE_PHASE.IDLE;
      delete html.dataset.routePending;
    }
    return true;
  };

  const setBeforeEnter = handler => { beforeEnter = typeof handler === 'function' ? handler : null; };

  const onDocumentClick = event => {
    const goTarget = event.target.closest?.('[data-go]');
    if (goTarget) {
      if (goTarget.tagName === 'A') event.preventDefault();
      go(goTarget.dataset.go);
      return;
    }
    if (event.target.closest?.('#menuBtn')) {
      event.preventDefault();
      toggleOrbMenu();
    }
  };

  const onKeydown = event => {
    if (event.key === 'Escape' && menuPhase !== MENU_PHASE.CLOSED) {
      event.preventDefault();
      closeOrbMenu();
      return;
    }
    if (event.key !== 'Tab' || menuPhase !== MENU_PHASE.OPEN || !menu) return;
    const items = focusables(menu);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('popstate', () => go(routeFromLocation(), false));

  const start = async () => {
    if (started) return true;
    started = true;
    setMenuInteractive(false);
    setMenuButton(false);
    const initial = normalizeRouteId(routeFromLocation());
    html.dataset.routePhase = ROUTE_PHASE.PREPARING;
    try { await beforeEnter?.(initial); } catch {}
    commit(initial, false);
    html.dataset.routePhase = ROUTE_PHASE.IDLE;
    document.dispatchEvent(new CustomEvent('divina:route-ready', { detail:{ id:currentRoute, initial:true } }));
    return true;
  };

  return Object.freeze({
    start,
    go,
    setBeforeEnter,
    openOrbMenu,
    closeOrbMenu,
    toggleOrbMenu,
    state: () => ({ route:currentRoute, menu:menuPhase })
  });
}
