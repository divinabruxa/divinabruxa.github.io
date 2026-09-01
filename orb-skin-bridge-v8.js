/* DIVINA BRUXA — PONTE ORBE ↔ SKINS V8
   Liga o catálogo universal às instâncias já presentes no index.html.
   O orb-engine-v68 não é reescrito: recebe o evento e mantém sua física.
*/
const SURFACES=[
  ['#orb','primary'],['#tableOrb','tarot'],['.table-orb','tarot'],['.orb-shell','primary'],
  ['.mini-orb','brand'],['.home-orb-menu .mini-orb','menu'],['.touch-art img','touch-demo'],
  ['#chat + .security-note','ai-support']
];
const mark=()=>{for(const [selector,kind] of SURFACES)document.querySelectorAll(selector).forEach(node=>{node.dataset.orbeSurface=kind;if(node.tagName==='IMG')node.dataset.orbeSkinImage='';});};
const connect=()=>{
  mark();
  window.addEventListener('orbe:skin-change',event=>{
    const detail=event.detail||{};
    document.documentElement.style.setProperty('--db-skin-image',`url("${detail.image||''}")`);
    document.body?.setAttribute('data-orbe-skin',detail.id||'classic');
    document.querySelectorAll('[data-orbe-surface]').forEach(node=>{node.dataset.activeSkin=detail.id||'classic'});
    const engine=window.orbeEngine||window.realityOrbEngine||window.__orbeEngine;
    if(engine){engine.activeSkin=detail.id||'classic';engine.skinImage=detail.image||'';engine.skinVersion='universal-v8';engine.pulse?.(1.15);}
  });
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
