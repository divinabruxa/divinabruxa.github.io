/* DIVINA BRUXA 2.0 — REBIRTH R032 · BIBLIOTECA PROFUNDA V332
   Camada visual/ritual sobre LibraryWorld V302. Conteúdo editorial permanece V302/V184. */

const RELEASE='V332';
const STYLE_ID='libraryDeepV332Styles';
const MARK=Symbol.for('divina.library.deep.v332');

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./library-deep-v332.css?v=332';
  document.head.append(link);
}

export class LibraryDeepV332{
  constructor(){
    this.root=null;this.observer=null;this.abort=new AbortController();
    installStyle();this.bind();this.tryMount();
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id==='library')queueMicrotask(()=>this.tryMount(true));
    },{signal});
    document.addEventListener('divina:route-ready',event=>{
      if(event.detail?.id==='library')queueMicrotask(()=>this.tryMount(true));
    },{signal});
  }

  tryMount(force=false){
    const root=document.querySelector('#cardLibraryApp');
    if(!root||!root.querySelector('.lb302'))return false;
    if(this.root===root&&!force)return true;
    this.root=root;
    root.dataset.libraryDeep='v332';
    this.enhance();
    this.observe();
    return true;
  }

  enhance(){
    const world=this.root?.querySelector('.lb302');
    const sanctuary=world?.querySelector('.lb302__sanctuary');
    const orb=world?.querySelector('.lb302__orb');
    const reader=world?.querySelector('.lb302__reader');
    if(!world||!sanctuary||!orb)return;

    if(!sanctuary.querySelector('.lb332-depth')){
      const depth=document.createElement('span');
      depth.className='lb332-depth';
      depth.setAttribute('aria-hidden','true');
      depth.innerHTML='<i></i><i></i><i></i>';
      sanctuary.prepend(depth);
    }

    if(!orb.querySelector('.lb332-orb-light')){
      const light=document.createElement('span');
      light.className='lb332-orb-light';
      light.setAttribute('aria-hidden','true');
      orb.append(light);
    }

    orb.addEventListener('pointerdown',()=>orb.classList.add('lb332-touch'),{passive:true,signal:this.abort.signal});
    const release=()=>orb.classList.remove('lb332-touch');
    orb.addEventListener('pointerup',release,{passive:true,signal:this.abort.signal});
    orb.addEventListener('pointercancel',release,{passive:true,signal:this.abort.signal});

    if(reader&&!reader.querySelector('.lb332-compass')){
      const shell=reader.querySelector('.lb302__reader-shell');
      const compass=document.createElement('nav');
      compass.className='lb332-compass';
      compass.setAttribute('aria-label','Camadas da leitura');
      compass.innerHTML='<span>ESSÊNCIA</span><i></i><span>LUZ</span><i></i><span>TENSÃO</span><i></i><span>VIDA</span>';
      shell?.querySelector('header')?.insertAdjacentElement('afterend',compass);
    }
  }

  observe(){
    this.observer?.disconnect();
    this.observer=new MutationObserver(()=>this.enhance());
    this.observer.observe(this.root,{childList:true,subtree:true});
  }

  status(){return Object.freeze({
    release:RELEASE,baseWorld:'V302',cards:78,contentRewritten:false,
    meaningSourcePreserved:true,orbDiscoveryPreserved:true,extraApiCalls:0
  });}

  destroy(){
    this.abort.abort();this.observer?.disconnect();
    this.root?.removeAttribute('data-library-deep');
  }
}

export function installLibraryDeepV332(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new LibraryDeepV332();
  globalThis[MARK]=instance;
  globalThis.divinaLibraryDeepV332=instance;
  return instance;
}
