/* DIVINA BRUXA — RUNTIME DE ATMOSFERAS V8 */
const PORTALS=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','videos','music','login','admin'];
const apply=()=>document.querySelectorAll('.screen[id]').forEach(screen=>{if(PORTALS.includes(screen.id))screen.dataset.portal=screen.id;});
const boot=()=>{apply();new MutationObserver(apply).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
