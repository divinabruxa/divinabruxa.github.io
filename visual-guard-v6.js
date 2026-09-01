const lockTargets='.orb-shell,.mini-orb,.home-orb-menu,.magic-menu';
export function installVisualGuard(){
  document.addEventListener('gesturestart',e=>{if(e.target.closest?.(lockTargets))e.preventDefault()},{passive:false});
  document.addEventListener('touchmove',e=>{if(e.target.closest?.('.orb-shell'))e.preventDefault()},{passive:false});
  const preload=['divina-orb-v68.png?v=76','divina-mini-orb-hd-v72.jpeg?v=72','cosmic-background.png'];
  preload.forEach(src=>{const img=new Image();img.decoding='async';img.src=src;});
  document.documentElement.dataset.visualBase='v77-plus';
}
