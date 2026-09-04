/* DIVINA BRUXA — SINCRONISMO ABSOLUTO DAS ORBES V3
   Uma textura pré-decodificada, uma troca atômica e nenhuma varredura causada por textos comuns. */

import { skinByIdV12 } from './skin-registry-v12.js';
import { preloadSkinAsset } from './skin-universal-v10.js?v=129';

const html = document.documentElement;
const ORB_CANDIDATE = '#orb,.app-header .mini-orb,.magic-menu-brand .mini-orb,.magic-menu-core .mini-orb,.magic-dock .dock-orb .mini-orb,#tableOrb .table-orb-image img,#dailyCard .ritual-breathe span,.mini-orb';
let scheduled = 0;
let pendingDetail = {};
let canvasToken = 0;
let canvasLoading = '';
let canvasApplied = '';

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

function currentIdentity() {
  const id = html.dataset.skin || document.body?.dataset.orbeSkin || 'classic';
  const skin = skinByIdV12(id);
  const source = html.dataset.orbImage || skin.surfaces?.home || skin.image;
  return { id: skin.id, source };
}

function samePreparedImage(image, absolute) {
  if (!image?.complete || !image.naturalWidth) return false;
  try { return new URL(image.currentSrc || image.src, document.baseURI).href === absolute; }
  catch { return false; }
}

async function createTextureSource(image) {
  const longest = Math.max(image.naturalWidth || 0, image.naturalHeight || 0);
  if (longest <= 1024 || typeof createImageBitmap !== 'function') return { source: image, close: null };
  const scale = 1024 / longest;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  try {
    const bitmap = await createImageBitmap(image, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: 'high'
    });
    return { source: bitmap, close: () => bitmap.close?.() };
  } catch {
    return { source: image, close: null };
  }
}

async function synchronizeCanvas(source, preparedImage = null) {
  const absolute = new URL(source, document.baseURI).href;
  if (absolute === canvasApplied || absolute === canvasLoading) return;
  canvasLoading = absolute;
  const token = ++canvasToken;

  let image = preparedImage;
  try {
    if (!samePreparedImage(image, absolute)) image = await preloadSkinAsset(source, { priority: 'high' });
  } catch {
    if (token === canvasToken) canvasLoading = '';
    return;
  }

  if (token !== canvasToken) return;
  const textureSource = await createTextureSource(image);
  if (token !== canvasToken) {
    textureSource.close?.();
    return;
  }

  const applyTexture = attempt => {
    if (token !== canvasToken) {
      textureSource.close?.();
      return;
    }
    const canvas = document.querySelector('#orbCanvas');
    const gl = canvas?.getContext('webgl');
    const texture = gl?.getParameter(gl.TEXTURE_BINDING_2D);
    if (!gl || !texture) {
      if (attempt < 24) setTimeout(() => applyTexture(attempt + 1), 100);
      else {
        canvasLoading = '';
        textureSource.close?.();
      }
      return;
    }

    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureSource.source);
      canvasApplied = absolute;
      canvasLoading = '';
      html.dataset.orbTexture = 'synchronized';
      canvas.dispatchEvent(new CustomEvent('divina:orb-texture-applied', {
        detail: { src: absolute }
      }));
    } catch {
      canvasLoading = '';
    } finally {
      textureSource.close?.();
    }
  };

  applyTexture(0);
}

function synchronize(detail = {}) {
  markSurfaces();
  const current = currentIdentity();
  const detailMatches = !detail.id || detail.id === current.id;
  const skin = skinByIdV12(current.id);
  const source = detailMatches
    ? detail.src || detail.source || current.source
    : current.source;
  const preparedImage = detailMatches ? detail.imageElement : null;
  if (!source) return;

  const cssImage = `url("${source}")`;
  if (html.style.getPropertyValue('--db-release-orb-image') !== cssImage) {
    html.style.setProperty('--db-release-orb-image', cssImage);
  }
  html.dataset.orbRelease = 'v3';

  const absolute = new URL(source, document.baseURI).href;
  document.querySelectorAll('[data-orb-surface]').forEach(node => {
    node.dataset.skin = skin.id;
    if (node.dataset.orbReleaseSource === absolute) return;
    node.dataset.orbReleaseSource = absolute;
    node.style.setProperty('--db-release-orb-image', cssImage);
    if (node instanceof HTMLImageElement) {
      if (node.src !== absolute) node.src = source;
    } else {
      node.style.setProperty('background-image', cssImage, 'important');
    }
  });

  synchronizeCanvas(source, preparedImage);
}

function queue(detail = {}) {
  pendingDetail = { ...pendingDetail, ...detail };
  cancelAnimationFrame(scheduled);
  scheduled = requestAnimationFrame(() => {
    scheduled = 0;
    const next = pendingDetail;
    pendingDetail = {};
    synchronize(next);
  });
}

function containsNewOrb(records) {
  return records.some(record => [...record.addedNodes].some(node => {
    if (!(node instanceof Element)) return false;
    return node.matches(ORB_CANDIDATE) || Boolean(node.querySelector(ORB_CANDIDATE));
  }));
}

document.addEventListener('divina:orb-image', event => queue(event.detail || {}));
document.addEventListener('divina:skin-applied', event => queue(event.detail || {}));
document.addEventListener('divina:runtime-ready', () => queue());

new MutationObserver(() => queue()).observe(html, {
  attributes: true,
  attributeFilter: ['data-skin', 'data-orb-image']
});

if (document.body) {
  new MutationObserver(() => queue()).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-orbe-skin']
  });
  new MutationObserver(records => {
    if (containsNewOrb(records)) queue();
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => queue(), { once: true });
} else {
  queue();
}
