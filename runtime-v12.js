import { applySkinContract, readStoredSkin } from './skin-universal-v10.js';
import { createPortalTransition } from './portal-transition-v10.js';
import { SKIN_REGISTRY_V12, skinByIdV12 } from './skin-registry-v12.js';

const ACTIVE_SKIN_KEY = 'divina.skin.v10';
let portal = null;

function ensureSkinsScreen() {
  let screen = document.getElementById('skins');
  if (screen) return screen;
  screen = document.createElement('section');
  screen.id = 'skins';
  screen.className = 'screen db-page-world skins-screen';
  screen.innerHTML = `
    <div class="db-page-world__hero">
      <p class="eyebrow db-page-world__kicker">SALÃO DAS REALIDADES</p>
      <h2 class="db-page-world__title">Trinta formas de sentir o universo.</h2>
      <p class="lead db-page-world__intro">Escolha a matéria da sua Orbe. A mesma realidade acompanhará a Home, o menu, o rodapé, a mesa e todos os portais.</p>
    </div>
    <div id="skinsApp" aria-live="polite"></div>`;
  const anchor = document.getElementById('subscriptions');
  (anchor?.parentNode || document.getElementById('app'))?.insertBefore(screen, anchor || null);
  return screen;
}

function addLibraryShortcut() {
  const menu = document.querySelector('.magic-menu-extra');
  if (!menu || menu.querySelector('[data-go="library"]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.go = 'library';
  button.textContent = 'Biblioteca das 78 Cartas';
  const reference = menu.querySelector('[data-go="admin"]');
  menu.insertBefore(button, reference || null);
}

function labelInputs() {
  const labels = [
    ['#userLogin input[type="email"]', 'E-mail'],
    ['#userLogin input[type="password"]', 'Senha'],
    ['#journalSearch', 'Buscar no Diário'],
    ['#chatInput', 'Mensagem para a Orbe IA']
  ];
  labels.forEach(([selector, label]) => {
    const input = document.querySelector(selector);
    if (input && !input.getAttribute('aria-label')) input.setAttribute('aria-label', label);
  });
  document.querySelector('#userLogin input[type="email"]')?.setAttribute('autocomplete', 'email');
  document.querySelector('#userLogin input[type="password"]')?.setAttribute('autocomplete', 'current-password');
}

function decorateWorlds() {
  document.querySelectorAll('#app > .screen:not(#home)').forEach(screen => {
    screen.classList.add('db-page-world');
    screen.querySelector('h2')?.classList.add('db-cosmic-title');
  });
}

function markOrbSurfaces() {
  const surfaces = [
    ['#orb', 'home'],
    ['.app-header .mini-orb', 'header'],
    ['.magic-menu-brand .mini-orb', 'menu'],
    ['.magic-menu-core .mini-orb', 'menu'],
    ['.magic-dock .dock-orb .mini-orb', 'dock'],
    ['#tableOrb .table-orb-image img', 'table']
  ];
  surfaces.forEach(([selector, surface]) => {
    document.querySelectorAll(selector).forEach(element => {
      element.dataset.orbSurface = surface;
    });
  });
  document.querySelectorAll('.mini-orb:not([data-orb-surface])').forEach(element => {
    element.dataset.orbSurface = 'internal';
  });
}

function rememberSkin(id) {
  try { localStorage.setItem(ACTIVE_SKIN_KEY, id); } catch { /* modo privado */ }
}

export function activeSkinV12() {
  return document.documentElement.dataset.skin || 'classic';
}

export function activateSkinV12(id, { persist = true } = {}) {
  markOrbSurfaces();
  const skin = skinByIdV12(id);
  const applied = applySkinContract({ id: skin.id, registry: SKIN_REGISTRY_V12 });
  if (!applied) return false;
  document.body.dataset.orbeSkin = skin.id;
  document.documentElement.dataset.orbImage = skin.surfaces.home;
  if (persist) rememberSkin(skin.id);
  document.querySelectorAll('[data-skin]').forEach(tile => {
    const current = tile.dataset.skin === skin.id;
    tile.classList.toggle('is-active', current);
    if (current) tile.setAttribute('aria-current', 'true');
    else tile.removeAttribute('aria-current');
  });
  document.dispatchEvent(new CustomEvent('divina:orb-image', {
    detail: { id: skin.id, src: skin.surfaces.home }
  }));
  return true;
}

function installPortalLayer() {
  portal = createPortalTransition({ duration: 680 });
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    const destination = target?.dataset.go;
    if (!destination || document.getElementById(destination)?.classList.contains('active')) return;
    portal.enter().catch(() => {});
  }, true);
}

export function installRuntimeV12() {
  if (document.documentElement.dataset.runtime === 'v12') return;
  ensureSkinsScreen();
  addLibraryShortcut();
  decorateWorlds();
  labelInputs();
  markOrbSurfaces();
  installPortalLayer();
  const stored = readStoredSkin(localStorage, ACTIVE_SKIN_KEY) || 'classic';
  activateSkinV12(stored, { persist: false });
  document.documentElement.dataset.runtime = 'v12';
  document.dispatchEvent(new CustomEvent('divina:runtime-ready', {
    detail: { version: '12.0.0', skins: SKIN_REGISTRY_V12.skins.length }
  }));
}
