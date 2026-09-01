/* DIVINA BRUXA — PERFORMANCE E PWA V9 */
const setNetwork=()=>{document.body?.setAttribute('data-network',navigator.onLine?'online':'offline');document.body?.setAttribute('data-installed',(matchMedia?.('(display-mode: standalone)').matches||navigator.standalone)?'true':'false')};
const prepareImages=()=>{
  const images=[...document.images];
  images.forEach((img,index)=>{img.decoding='async';if(index>1&&!img.loading)img.loading='lazy';});
  if(!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const img=entry.target;img.fetchPriority=img.fetchPriority||'low';observer.unobserve(img)}),{rootMargin:'240px'});
  images.slice(2).forEach(img=>observer.observe(img));
};
const boot=()=>{setNetwork();prepareImages();addEventListener('online',setNetwork);addEventListener('offline',setNetwork);new MutationObserver(prepareImages).observe(document.body,{childList:true,subtree:true});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
