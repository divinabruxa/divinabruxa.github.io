/* DIVINA BRUXA — SINCRONISMO FINAL DAS ORBES V1
   Uma única skin para Home, cabeçalho, menu, rodapé, Tarot e orbes internas. */

import { skinByIdV12 } from './skin-registry-v12.js';

const html = document.documentElement;
let scheduled = 0;
let canvasToken = 0;
let canvasLoading = '';
let canvasApplied = '';

function markSurfaces(){
  const surfaces = [
    ['#orb', 'home'],
    ['.app-header .mini-orb', 'header'],
    ['.magic-menu-brand .mini-orb', 'menu'],
    ['.magic-menu-core .mini-orb', 'menu'],
    ['.magic-dock .dock-orb .mini-orb', 'dock'],
    ['#tableOrb .table-orb-image img', 'table']
  ];

  for(const [selector, surface] of surfaces){
    document.querySelectorAll(selector).forEach(node => {
      node.dataset.orbSurface = surface;
    });
  }

  document.querySelectorAll('.mini-orb:not([data-orb-surface])').forEach(node => {
    node.dataset.orbSurface = 'internal';
  });
}

function currentIdentity(){
  const id = html.dataset.skin || document.body?.dataset.orbeSkin || 'classic';
  const skin = skinByIdV12(id);
  const source = html.dataset.orbImage || skin.surfaces?.home || skin.image;
  return { id:skin.id, source };
}

async function synchronizeCanvas(source){
  const absolute = new URL(source, document.baseURI).href;
  if(absolute === canvasApplied || absolute === canvasLoading) return;
  canvasLoading = absolute;
  const token = ++canvasToken;
  const image = new Image();
  image.decoding = 'async';
  image.src = absolute;

  try{
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      if(image.complete && image.naturalWidth) resolve();
    });
    try{ await image.decode?.(); }catch{ /* onload já confirmou a imagem */ }
  }catch{
    if(token === canvasToken) canvasLoading = '';
    return;
  }

  const applyTexture = attempt => {
    if(token !== canvasToken) return;
    const canvas = document.querySelector('#orbCanvas');
    const gl = canvas?.getContext('webgl');
    const texture = gl?.getParameter(gl.TEXTURE_BINDING_2D);
    if(!gl || !texture){
      if(attempt < 24) setTimeout(() => applyTexture(attempt + 1), 100);
      else canvasLoading = '';
      return;
    }

    try{
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      canvasApplied = absolute;
      canvasLoading = '';
      html.dataset.orbTexture = 'synchronized';
      canvas.dispatchEvent(new CustomEvent('divina:orb-texture-applied', {
        detail:{ src:absolute }
      }));
    }catch{
      canvasLoading = '';
    }
  };

  applyTexture(0);
}

function synchronize(detail = {}){
  markSurfaces();
  const current = currentIdentity();
  const id = detail.id || current.id;
  const skin = skinByIdV12(id);
  const source = detail.src || detail.image || html.dataset.orbImage || skin.surfaces?.home || skin.image;
  if(!source) return;

  const cssImage = `url("${source}")`;
  html.style.setProperty('--db-release-orb-image', cssImage);
  html.dataset.orbRelease = 'v1';

  document.querySelectorAll('[data-orb-surface]').forEach(node => {
    node.dataset.skin = skin.id;
    node.style.setProperty('--db-release-orb-image', cssImage);
    if(node instanceof HTMLImageElement){
      const target = new URL(source, document.baseURI).href;
      if(node.src !== target) node.src = source;
    }else{
      node.style.setProperty('background-image', cssImage, 'important');
    }
  });

  synchronizeCanvas(source);
}

function queue(detail){
  cancelAnimationFrame(scheduled);
  scheduled = requestAnimationFrame(() => synchronize(detail));
}

document.addEventListener('divina:orb-image', event => queue(event.detail || {}));
document.addEventListener('divina:skin-applied', () => queue());
document.addEventListener('divina:runtime-ready', () => queue());

new MutationObserver(() => queue()).observe(html, {
  attributes:true,
  attributeFilter:['data-skin', 'data-orb-image']
});

if(document.body){
  new MutationObserver(() => queue()).observe(document.body, {
    attributes:true,
    attributeFilter:['data-orbe-skin']
  });
  new MutationObserver(() => queue()).observe(document.body, {
    childList:true,
    subtree:true
  });
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => queue(), { once:true });
}else{
  queue();
}
