/* DIVINA BRUXA — PONTE UNIVERSAL DE TODAS AS ORBES V9 */
const SELECTORS=[
  '.orb,.orb--hero,.orb--dock,.mini-orb,.table-orb,.orb-shell',
  '.home-orb-menu [class*="orb"],[data-orbe],[data-orb],[data-orbe-surface]'
];
const surfaces=()=>document.querySelectorAll(SELECTORS.join(','));
const mark=()=>surfaces().forEach(node=>{
  node.dataset.orbeSurface=node.dataset.orbeSurface||'orb';
  if(node.tagName==='IMG')node.dataset.orbeSkinImage='';
  node.querySelectorAll?.('img').forEach(img=>{img.dataset.orbeSkinImage='';});
});
const sync=()=>{
  mark();
  const system=window.divinaSkinSystem;
  if(system){system.syncNodes();system.apply(system.active,{force:true});return;}
  const id=document.body?.dataset.orbeSkin||'classic';
  document.documentElement.style.setProperty('--db-skin-id',`"${id}"`);
  surfaces().forEach(node=>node.dataset.activeSkin=id);
};
const connect=()=>{
  sync();
  window.addEventListener('orbe:skin-change',event=>{
    const detail=event.detail||{},id=detail.id||'classic';
    document.body?.setAttribute('data-orbe-skin',id);
    document.documentElement.style.setProperty('--db-skin-image',`url("${detail.image||''}")`);
    surfaces().forEach(node=>node.dataset.activeSkin=id);
    const engine=window.orbeEngine||window.realityOrbEngine||window.__orbeEngine;
    if(engine){engine.activeSkin=id;engine.skinImage=detail.image||'';engine.skinVersion='universal-v9';engine.pulse?.(1.15);}
  });
  let frame=0;
  new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)}).observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
