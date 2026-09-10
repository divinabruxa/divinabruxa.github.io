/* DIVINA BRUXA — ORBE 2.0 V209 · SKINS ATÔMICAS
   A ponte de skins declara intenção; somente o motor da Orbe toca na textura WebGL.
*/

import { SKIN_REGISTRY_V12, skinByIdV12 } from './skin-registry-v12.js?v=133';
import { preloadSkinAsset } from './skin-universal-v10.js?v=133';
import { installOrbResilienceV209, getOrbResilienceV209 } from './orb-resilience-v209.js?v=209';

const html = document.documentElement;
const ORB_CANDIDATE = '#orb,.app-header .mini-orb,.magic-menu-brand .mini-orb,.magic-menu-core .mini-orb,.magic-dock .dock-orb .mini-orb,#tableOrb .table-orb-image img,#dailyCard .ritual-breathe span,.mini-orb';
const EXPECTED_SKIN_COUNT = 30;
let scheduled = 0;
let transaction = 0;
let pending = {};
let observerStarted = false;

function validateRegistry() {
  const skins = SKIN_REGISTRY_V12?.skins || [];
  const ids = new Set(skins.map(skin => skin.id));
  const valid = skins.length === EXPECTED_SKIN_COUNT
    && ids.size === EXPECTED_SKIN_COUNT
    && skins.every(skin => skin.id && (skin.surfaces?.home || skin.image));
  html.dataset.orbSkinRegistry = valid ? '30-valid' : 'invalid';
  if (!valid) console.error('[Divina V209] catálogo de skins inválido; mantendo fallback seguro.');
  return valid;
}

function markSurfaces() {
  const surfaces = [
    ['#orb', 'home'],
    ['.app-header .mini-orb', 'header'],
    ['.magic-menu-brand .mini-orb', 'menu'],
    ['.magic-menu-core .mini-orb', 'menu'],
    ['.magic-dock .dock-orb .mini-orb', 'dock'],
    ['#tableOrb .table-orb-image img', 'table'],
    ['#dailyCard .ritual-breathe span', 'internal']
  ];
  for (const [selector, surface] of surfaces) {
    document.querySelectorAll(selector).forEach(node => {
      if (node.dataset.orbSurface !== surface) node.dataset.orbSurface = surface;
    });
  }
  document.querySelectorAll('.mini-orb:not([data-orb-surface])').forEach(node => {
    node.dataset.orbSurface = 'internal';
  });
}

function storedSkinId() {
  try { return localStorage.getItem('divina.skin.v10') || ''; }
  catch { return ''; }
}

function currentIdentity(detail = {}) {
  const requested = detail.id || html.dataset.skin || document.body?.dataset.orbeSkin || storedSkinId() || html.dataset.bootSkin || 'classic';
  const skin = skinByIdV12(requested);
  return { id: skin.id, skin, source: skin.surfaces?.home || skin.image };
}

function cssImage(source) {
  return `url("${String(source).replace(/"/g, '\\"')}")`;
}

function applyPreparedSurfaces(identity) {
  const { skin, source } = identity;
  const rootImage = cssImage(source);
  if (html.dataset.skin !== skin.id) html.dataset.skin = skin.id;
  if (html.dataset.orbImage !== source) html.dataset.orbImage = source;
  html.dataset.orbRelease = 'v209';
  html.style.setProperty('--db-release-orb-image', rootImage);
  html.style.setProperty('--db-skin-image', rootImage);
  html.style.setProperty('--db-skin-id', `"${skin.id}"`);
  for (const [key, value] of Object.entries(skin.tokens || {})) {
    html.style.setProperty(`--db-skin-${key}`, value);
  }

  document.querySelectorAll('[data-orb-surface]').forEach(node => {
    const surface = node.dataset.orbSurface || 'internal';
    const target = skin.surfaces?.[surface] || source;
    if (!target) return;
    const absolute = new URL(target, document.baseURI).href;
    node.dataset.skin = skin.id;
    if (node.dataset.orbReleaseSource === absolute) return;
    node.dataset.orbReleaseSource = absolute;
    const image = cssImage(target);
    node.style.setProperty('--db-release-orb-image', image);
    if (node instanceof HTMLImageElement) {
      if (node.src !== absolute) node.src = target;
    } else {
      node.style.setProperty('background-image', image, 'important');
    }
  });
}

async function commit(detail = {}) {
  markSurfaces();
  if (!validateRegistry()) return false;
  const identity = currentIdentity(detail);
  const token = ++transaction;
  html.dataset.orbSkinTransaction = 'preparing';

  let prepared;
  try {
    prepared = await preloadSkinAsset(identity.source, { priority: 'high' });
  } catch (error) {
    if (token === transaction) html.dataset.orbSkinTransaction = 'fallback';
    document.dispatchEvent(new CustomEvent('divina:skin-prepare-error', {
      detail: { id: identity.id, recoverable: true }
    }));
    return false;
  }
  if (token !== transaction || !prepared?.naturalWidth) return false;

  requestAnimationFrame(() => {
    if (token !== transaction) return;
    installOrbResilienceV209();
    applyPreparedSurfaces(identity);
    html.dataset.orbSkinTransaction = 'committed';
    document.dispatchEvent(new CustomEvent('divina:orb-image', {
      detail: {
        id: identity.id,
        src: identity.source,
        imageElement: prepared,
        authority: 'skin-intent-v209'
      }
    }));
    document.dispatchEvent(new CustomEvent('divina:orb-skin-committed', {
      detail: { id: identity.id, version: 209 }
    }));
  });
  return true;
}

function queue(detail = {}) {
  pending = { ...pending, ...detail };
  cancelAnimationFrame(scheduled);
  scheduled = requestAnimationFrame(() => {
    scheduled = 0;
    const next = pending;
    pending = {};
    commit(next);
  });
}

function containsNewOrb(records) {
  return records.some(record => [...record.addedNodes].some(node => {
    if (!(node instanceof Element)) return false;
    return node.matches(ORB_CANDIDATE) || Boolean(node.querySelector(ORB_CANDIDATE));
  }));
}

function installObservers() {
  if (observerStarted) return;
  observerStarted = true;

  new MutationObserver(() => queue()).observe(html, {
    attributes: true,
    attributeFilter: ['data-skin']
  });

  if (document.body) {
    new MutationObserver(() => queue()).observe(document.body, {
      attributes: true,
      attributeFilter: ['data-orbe-skin']
    });
    new MutationObserver(records => {
      if (containsNewOrb(records)) queue();
    }).observe(document.body, { childList: true, subtree: true });
  }
}

document.addEventListener('divina:skin-applied', event => queue(event.detail || {}));
document.addEventListener('divina:runtime-ready', () => queue());
document.addEventListener('divina:boot-ready', () => {
  installOrbResilienceV209();
  queue();
});

document.addEventListener('divina:orb-image', event => {
  if (event.detail?.authority === 'skin-intent-v209') return;
  const detail = event.detail || {};
  if (detail.id) queue(detail);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    installObservers();
    installOrbResilienceV209();
    queue();
  }, { once: true });
} else {
  installObservers();
  installOrbResilienceV209();
  queue();
}

window.divinaOrbSkinV209 = Object.freeze({
  version: 209,
  skinCount: EXPECTED_SKIN_COUNT,
  apply: id => commit({ id }),
  resilience: () => getOrbResilienceV209(),
  snapshot: () => Object.freeze({
    registry: html.dataset.orbSkinRegistry || 'unknown',
    transaction: html.dataset.orbSkinTransaction || 'idle',
    skin: html.dataset.skin || 'classic',
    authority: html.dataset.orbAuthority || 'pending'
  })
});
