/* DIVINA BRUXA 2.0 — REBIRTH R027 · ORBE SUPREMA + MENU VIVO V327
   Camada local e boot-safe sobre WebGL V208 + Navigation V210.
   Nenhuma segunda navegação, nenhum novo backend, nenhuma chamada de IA. */

import { installMenuAccessibilityV327 } from './menu-accessibility-v327.js?v=327';

const RELEASE='V327';
const STYLE_ID='divinaOrbMenuSupremeV327';
const INSTALL_KEY=Symbol.for('divina.orb.menu.supreme.v327');

const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./orb-menu-supreme-v327.css?v=327';
  document.head.append(link);
}

function ensureMagicLayers(orb){
  for(const className of ['r027-orb-veil','r027-orb-touch-light','r027-orb-sparks']){
    if(orb.querySelector(`.${className}`))continue;
    const span=document.createElement('span');
    span.className=className;
    span.setAttribute('aria-hidden','true');
    orb.append(span);
  }
}

function localPointer(orb,event){
  const rect=orb.getBoundingClientRect();
  if(!rect.width||!rect.height)return{x:50,y:50};
  return{
    x:Math.max(0,Math.min(100,((event.clientX-rect.left)/rect.width)*100)),
    y:Math.max(0,Math.min(100,((event.clientY-rect.top)/rect.height)*100))
  };
}

function createSparkBurst(orb,x,y){
  if(reduced()||constrained())return;
  const host=orb.querySelector('.r027-orb-sparks');
  if(!host)return;
  host.replaceChildren();
  [-72,-24,24,72,128].forEach((angle,index)=>{
    const spark=document.createElement('i');
    spark.style.setProperty('--r027-angle',`${angle}deg`);
    spark.style.setProperty('--r027-distance',`${20+index*4}px`);
    spark.style.setProperty('--r027-delay',`${index*22}ms`);
    spark.style.left=`${x}%`;
    spark.style.top=`${y}%`;
    host.append(spark);
  });
  setTimeout(()=>host.replaceChildren(),760);
}

export function installOrbMenuSupremeV327(){
  if(globalThis[INSTALL_KEY])return globalThis[INSTALL_KEY];

  installStyle();

  const html=document.documentElement;
  const home=document.querySelector('#home');
  const orb=document.querySelector('#orb');
  const orbMenu=document.querySelector('#orbMenu');
  if(!home||!orb||!orbMenu)return Object.freeze({installed:false,release:RELEASE});

  ensureMagicLayers(orb);
  installMenuAccessibilityV327();

  html.dataset.orbSupreme='v327';
  home.classList.add('r027-supreme');

  let down=false;
  let pointerId=null;
  let releaseTimer=0;
  let menuState=String(html.dataset.menuState||'closed');

  const syncPoint=event=>{
    const {x,y}=localPointer(orb,event);
    orb.style.setProperty('--r027-touch-x',`${x}%`);
    orb.style.setProperty('--r027-touch-y',`${y}%`);
    return{x,y};
  };

  const press=event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    down=true;
    pointerId=event.pointerId;
    clearTimeout(releaseTimer);
    const{x,y}=syncPoint(event);
    orb.classList.add('r027-touching');
    orb.dataset.r027Touch='true';
    createSparkBurst(orb,x,y);
    document.dispatchEvent(new CustomEvent('divina:orb-supreme-touch',{
      detail:Object.freeze({
        release:RELEASE,phase:'press',
        menuOpen:home.classList.contains('orb-menu-open'),
        x:Math.round(x),y:Math.round(y)
      })
    }));
  };

  const move=event=>{
    if(!down||event.pointerId!==pointerId)return;
    syncPoint(event);
  };

  const release=event=>{
    if(pointerId!=null&&event.pointerId!=null&&event.pointerId!==pointerId)return;
    down=false;
    pointerId=null;
    orb.dataset.r027Touch='false';
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>orb.classList.remove('r027-touching'),260);
    document.dispatchEvent(new CustomEvent('divina:orb-supreme-touch',{
      detail:Object.freeze({
        release:RELEASE,phase:'release',
        menuOpen:home.classList.contains('orb-menu-open')
      })
    }));
  };

  orb.addEventListener('pointerdown',press,{passive:true});
  orb.addEventListener('pointermove',move,{passive:true});
  orb.addEventListener('pointerup',release,{passive:true});
  orb.addEventListener('pointercancel',release,{passive:true});
  orb.addEventListener('lostpointercapture',release,{passive:true});

  orb.addEventListener('keydown',event=>{
    if(!['Enter',' '].includes(event.key))return;
    orb.classList.add('r027-key-pulse');
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>orb.classList.remove('r027-key-pulse'),420);
  });

  const portalPress=event=>{
    const button=event.target.closest('button');
    if(!button||!orbMenu.contains(button))return;
    button.classList.add('r027-portal-touch');
    const clean=()=>button.classList.remove('r027-portal-touch');
    button.addEventListener('pointerup',clean,{once:true});
    button.addEventListener('pointercancel',clean,{once:true});
    setTimeout(clean,520);
  };
  orbMenu.addEventListener('pointerdown',portalPress,{passive:true});

  const onMenuState=event=>{
    menuState=String(event.detail?.state||menuState).toLowerCase();
    home.dataset.r027MenuState=menuState;
    const open=Boolean(event.detail?.targetOpen)||menuState==='open';
    orb.dataset.r027Menu=open?'open':'closed';
    if(open){
      requestAnimationFrame(()=>{
        try{orb.focus({preventScroll:true});}catch{}
      });
    }
  };
  document.addEventListener('divina:menu-state',onMenuState);

  orb.dataset.r027Menu=home.classList.contains('orb-menu-open')?'open':'closed';
  home.dataset.r027MenuState=menuState;

  const destroy=()=>{
    orb.removeEventListener('pointerdown',press);
    orb.removeEventListener('pointermove',move);
    orb.removeEventListener('pointerup',release);
    orb.removeEventListener('pointercancel',release);
    orb.removeEventListener('lostpointercapture',release);
    orbMenu.removeEventListener('pointerdown',portalPress);
    document.removeEventListener('divina:menu-state',onMenuState);
    home.classList.remove('r027-supreme');
    delete html.dataset.orbSupreme;
  };

  const api=Object.freeze({
    installed:true,
    release:RELEASE,
    orbEnginePreserved:'V208',
    navigationPreserved:'V210',
    centralOrbInteractiveInMenu:true,
    menuState:()=>menuState,
    status:()=>Object.freeze({
      release:RELEASE,
      menuState,
      touching:down,
      reducedMotion:reduced(),
      constrained:constrained(),
      centralOrbInteractive:true,
      extraApiCalls:0
    }),
    destroy
  });

  globalThis[INSTALL_KEY]=api;
  globalThis.divinaOrbMenuV327=api;
  document.dispatchEvent(new CustomEvent('divina:orb-menu-supreme-ready',{
    detail:{release:RELEASE,centralOrbInteractive:true}
  }));
  return api;
}
