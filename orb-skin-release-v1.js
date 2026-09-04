/* DIVINA BRUXA — SINCRONISMO FINAL DAS ORBES V1
   Uma única skin para Home, cabeçalho, menu, rodapé, Tarot e orbes internas. */

import { skinByIdV12 } from './skin-registry-v12.js';

const html = document.documentElement;
let scheduled = 0;

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
    }
  });
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

