import { applySkinContract, preloadSkinAsset, preparedSkinImage, readStoredSkin } from './skin-universal-v10.js?v=129';
import { createPortalTransition } from './portal-transition-v10.js?v=130';
import { SKIN_REGISTRY_V12, skinByIdV12 } from './skin-registry-v12.js';

const ACTIVE_SKIN_KEY = 'divina.skin.v10';
let portal = null;
let skinSwitchToken = 0;

const PAGE_REALMS = Object.freeze({
  daily: 'moon',
  library: 'archive',
  school: 'academy',
  spreads: 'oracle',
  ai: 'voice',
  journal: 'memory',
  store: 'market',
  consultations: 'sanctuary',
  subscriptions: 'crown',
  videos: 'vision',
  music: 'resonance',
  login: 'threshold',
  admin: 'command'
});

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
    <div id="skinsApp"></div>`;
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
    const realm = PAGE_REALMS[screen.id];
    if (!realm) return;
    screen.dataset.dbRealm = realm;
    const eyebrow = screen.querySelector(':scope > .eyebrow');
    const title = screen.querySelector(':scope > h2');
    const intro = screen.querySelector(':scope > .lead');
    eyebrow?.classList.add('db-page-world__kicker');
    title?.classList.add('db-page-world__title');
    intro?.classList.add('db-page-world__intro');
    if (title && !title.id) title.id = `${screen.id}Title`;
    if (title) screen.setAttribute('aria-labelledby', title.id);
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
      if (element.dataset.orbSurface !== surface) element.dataset.orbSurface = surface;
    });
  });
  document.querySelectorAll('.mini-orb:not([data-orb-surface])').forEach(element => {
    element.dataset.orbSurface = 'internal';
  });
}

function rememberSkin(id) {
  try { localStorage.setItem(ACTIVE_SKIN_KEY, id); } catch { /* modo privado */ }
}

function updateSkinCards(id) {
  document.querySelectorAll('.skin-tile[data-skin-card]').forEach(tile => {
    const current = tile.dataset.skinCard === id;
    tile.classList.toggle('is-active', current);
    if (current) tile.setAttribute('aria-current', 'true');
    else tile.removeAttribute('aria-current');
  });
}

function commitSkin(skin, { persist = true, preparedImage: imageElement = null } = {}) {
  markOrbSurfaces();
  const cssImage = `url("${skin.surfaces.home}")`;
  document.documentElement.dataset.orbImage = skin.surfaces.home;
  document.documentElement.style.setProperty('--db-release-orb-image', cssImage);
  const applied = applySkinContract({ id: skin.id, registry: SKIN_REGISTRY_V12 });
  if (!applied) return false;

  if (document.body?.dataset.orbeSkin !== skin.id) document.body.dataset.orbeSkin = skin.id;
  if (persist) rememberSkin(skin.id);
  updateSkinCards(skin.id);
  document.dispatchEvent(new CustomEvent('divina:orb-image', {
    detail: {
      id: skin.id,
      src: skin.surfaces.home,
      imageElement: imageElement || preparedSkinImage(skin.surfaces.home)
    }
  }));
  return true;
}

export function activeSkinV12() {
  return document.documentElement.dataset.skin || 'classic';
}

export function prepareSkinV12(id, { priority = 'auto' } = {}) {
  const skin = skinByIdV12(id);
  return preloadSkinAsset(skin.surfaces.home, { priority }).then(image => ({ skin, image }));
}

export function activateSkinV12(id, { persist = true } = {}) {
  skinSwitchToken += 1;
  const skin = skinByIdV12(id);
  delete document.documentElement.dataset.skinSwitch;
  return commitSkin(skin, {
    persist,
    preparedImage: preparedSkinImage(skin.surfaces.home)
  });
}

export async function activateSkinFluidV12(id, { persist = true } = {}) {
  const skin = skinByIdV12(id);
  if (activeSkinV12() === skin.id) return true;

  const token = ++skinSwitchToken;
  const html = document.documentElement;
  html.dataset.skinSwitch = 'preparing';
  document.dispatchEvent(new CustomEvent('divina:skin-preparing', {
    detail: { id: skin.id, src: skin.surfaces.home }
  }));

  let image = null;
  try {
    ({ image } = await prepareSkinV12(skin.id, { priority: 'high' }));
  } catch {
    if (token === skinSwitchToken) {
      delete html.dataset.skinSwitch;
      document.dispatchEvent(new CustomEvent('divina:skin-error', { detail: { id: skin.id } }));
    }
    return false;
  }

  if (token !== skinSwitchToken) return false;
  html.dataset.skinSwitch = 'committing';
  const applied = commitSkin(skin, { persist, preparedImage: image });

  const settle = () => {
    if (token !== skinSwitchToken) return;
    delete html.dataset.skinSwitch;
    document.dispatchEvent(new CustomEvent('divina:skin-settled', {
      detail: { id: skin.id }
    }));
  };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(settle));
  else settle();
  return applied;
}

function installPortalLayer() {
  portal = createPortalTransition({ duration: 680 });
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    const destination = target?.dataset.go;
    if (!destination || document.getElementById(destination)?.classList.contains('active')) return;
    portal.enter(destination).catch(() => {});
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
  if (stored === 'classic') activateSkinV12('classic', { persist: false });
  else {
    activateSkinV12('classic', { persist: false });
    activateSkinFluidV12(stored, { persist: false }).catch(() => {});
  }

  document.documentElement.dataset.runtime = 'v12';
  document.dispatchEvent(new CustomEvent('divina:runtime-ready', {
    detail: { version: '12.2.0', skins: SKIN_REGISTRY_V12.skins.length, realms: Object.keys(PAGE_REALMS).length }
  }));
}
