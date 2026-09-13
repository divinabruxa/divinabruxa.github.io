/* DIVINA BRUXA 3.0 — COMPATIBILIDADE PWA V196 → AUTORIDADE V546
   Páginas públicas antigas usam este caminho. Toda instalação, atualização,
   offline, acessibilidade e recuperação agora passam pelo único núcleo V546. */

import { initializePwaV324 } from './pwa-world-v324.js?v=546';

export const initializeWorldPwaV196=()=>initializePwaV324();

if(typeof document!=='undefined'){
  const start=()=>initializeWorldPwaV196();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else queueMicrotask(start);
}
