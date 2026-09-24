/* Divina Bruxa 3.0 — compatibilidade das páginas públicas. */

import { initializePwaV324 } from './pwa-world-v324.js?v=3.0.0';

export const initializeWorldPwaV196=()=>initializePwaV324();

if(typeof document!=='undefined'){
  const start=()=>initializeWorldPwaV196();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else queueMicrotask(start);
}
