/* DIVINA BRUXA 4.0 — COMPATIBILIDADE PWA V196 → AUTORIDADE V554
   Páginas públicas antigas usam este caminho. Toda instalação, atualização,
   offline, acessibilidade e recuperação agora passam pelo corte V554. */

import { initializePwaV324 } from './pwa-world-v324.js?v=554';

export const initializeWorldPwaV196=()=>initializePwaV324();

if(typeof document!=='undefined'){
  const start=()=>initializeWorldPwaV196();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else queueMicrotask(start);
}
