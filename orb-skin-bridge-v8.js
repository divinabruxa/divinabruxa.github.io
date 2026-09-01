/* DIVINA BRUXA — PONTE ORBE ↔ SKINS V8
   Liga o catálogo universal às instâncias já presentes no index.html.
   O orb-engine-v68 não é reescrito: recebe o evento e mantém sua física.
*/
const SURFACES=[
  ['#orb','primary'],['#tableOrb','tarot'],['.table-orb','tarot'],['.orb-shell','primary'],
  ['.mini-orb','brand'],['.home-orb-menu .mini-orb','menu'],['.touch-art img','touch-demo'],
  ['[data-orbe]','contextual'],['[data-orb]','contextual']
];
const mark=()=>{for(const [selector,kind] of SURFACES)document.querySelectorAll(selector).forEach(node=>{node.dataset.orbeSurface=kind;if(node.tagName==='IMG')node.dataset.orbeSkinImage='';});};
const sync=()=>{
  mark();
  const system=window.divinaSkinSystem;
  if(system){system.syncNodes();system.apply(system.active,{force:true});return}
  const id=document.body?.dataset.orbeSkin||'classic';
  document.querySelectorAll('[data-orbe-surface]').forEach(node=>{node.dataset.activeSkin=id});
};
const connect=()=>{
  sync();
  window.addEventListener('orbe:skin-change',event=>{
    const detail=event.detail||{};
    document.documentElement.style.setProperty('--db-skin-image',`url("${detail.image||''}")`);
    document.body?.setAttribute('data-orbe-skin',detail.id||'classic');
    document.querySelectorAll('[data-orbe-surface]').forEach(node=>{node.dataset.activeSkin=detail.id||'classic'});
    const engine=window.orbeEngine||window.realityOrbEngine||window.__orbeEngine;
    if(engine){engine.activeSkin=detail.id||'classic';engine.skinImage=detail.image||'';engine.skinVersion='universal-v8';engine.pulse?.(1.15);}
  });
  let pending=0;
  new MutationObserver(()=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(sync)}).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('divina:v8-ready',sync,{once:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
