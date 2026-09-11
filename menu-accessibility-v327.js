/* DIVINA BRUXA 2.0 — REBIRTH R027 · MENU ACCESSIBILITY V327
   A Orbe central participa da interação sem perder foco, teclado ou proteção de fundo. */

const MENU_ACTIVE_STATES=new Set(['opening','open','reversing','closing','navigating']);
const MENU_INTERACTIVE_STATES=new Set(['opening','open','reversing']);
const FOCUSABLE=[
  'button:not([disabled])','a[href]','input:not([disabled])','select:not([disabled])',
  'textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'
].join(',');

const safeFocus=element=>{
  if(!element?.focus||!element.isConnected)return false;
  try{element.focus({preventScroll:true});}
  catch{try{element.focus();}catch{return false;}}
  return document.activeElement===element;
};
const visibleFocusable=root=>[...root.querySelectorAll(FOCUSABLE)].filter(element=>{
  if(element.hidden||element.getAttribute('aria-hidden')==='true')return false;
  if(element.closest('[inert]'))return false;
  const style=getComputedStyle(element);
  return style.display!=='none'&&style.visibility!=='hidden';
});
const rememberAttribute=(element,name)=>({
  element,name,existed:element.hasAttribute(name),value:element.getAttribute(name)
});
const restoreAttribute=snapshot=>{
  if(!snapshot?.element?.isConnected)return;
  if(snapshot.existed)snapshot.element.setAttribute(snapshot.name,snapshot.value??'');
  else snapshot.element.removeAttribute(snapshot.name);
};

export function installMenuAccessibilityV327(){
  const html=document.documentElement;
  const menu=document.querySelector('#orbMenu');
  const menuButton=document.querySelector('#menuBtn');
  const home=document.querySelector('#home');
  const orb=document.querySelector('#orb');
  const dock=document.querySelector('.magic-dock');
  const brand=document.querySelector('.app-header .brand');

  if(!menu||!menuButton||!home||!orb)return Object.freeze({installed:false});

  if(menu.dataset.accessibilityVersion==='327'){
    return window.divinaMenuA11yV327||Object.freeze({installed:true,reused:true});
  }

  try{window.divinaMenuA11yV211?.destroy?.();}catch{}
  delete window.divinaMenuA11yV211;
  menu.removeAttribute('data-accessibility-version');

  const supportsInert='inert' in HTMLElement.prototype;
  let active=false;
  let menuInteractive=false;
  let backgroundSnapshots=[];
  let fallbackTabSnapshots=[];
  let menuTabSnapshots=[];
  let pointerShielded=false;

  // A Orbe fica fora do fundo inerte: ela é o coração interativo do menu.
  const backgroundNodes=()=>{
    const nodes=new Set([brand,dock].filter(Boolean));
    for(const child of home.children){
      if(child.classList.contains('orb-stage-ref')||child.id==='orbStatus')continue;
      nodes.add(child);
    }
    return [...nodes].filter(node=>node!==menu&&!menu.contains(node));
  };

  const applyInert=(element,value)=>{
    if(!element)return;
    if(supportsInert){
      element.inert=value;
      if(value)element.setAttribute('inert','');
      else element.removeAttribute('inert');
      return;
    }
    if(!value)return;
    const candidates=element.matches?.(FOCUSABLE)
      ? [element,...element.querySelectorAll(FOCUSABLE)]
      : [...element.querySelectorAll(FOCUSABLE)];
    for(const focusable of candidates){
      fallbackTabSnapshots.push(rememberAttribute(focusable,'tabindex'));
      focusable.setAttribute('tabindex','-1');
    }
  };

  const lockBackground=()=>{
    if(active)return;
    active=true;
    backgroundSnapshots=backgroundNodes().flatMap(element=>[
      rememberAttribute(element,'aria-hidden'),
      rememberAttribute(element,'inert')
    ]);
    for(const element of backgroundNodes()){
      element.setAttribute('aria-hidden','true');
      applyInert(element,true);
    }
    orb.removeAttribute('aria-hidden');
    try{orb.inert=false;}catch{}
    orb.removeAttribute('inert');
    html.dataset.menuModal='orb-v327';
  };

  const unlockBackground=()=>{
    if(!active)return;
    active=false;
    for(const snapshot of backgroundSnapshots)restoreAttribute(snapshot);
    backgroundSnapshots=[];
    for(const snapshot of fallbackTabSnapshots)restoreAttribute(snapshot);
    fallbackTabSnapshots=[];
    delete html.dataset.menuModal;
  };

  const setMenuInteractive=interactive=>{
    menuInteractive=interactive;
    if(supportsInert){
      menu.inert=!interactive;
      if(interactive)menu.removeAttribute('inert');
      else menu.setAttribute('inert','');
    }else if(interactive){
      for(const snapshot of menuTabSnapshots)restoreAttribute(snapshot);
      menuTabSnapshots=[];
    }else if(!menuTabSnapshots.length){
      const candidates=menu.matches?.(FOCUSABLE)
        ? [menu,...menu.querySelectorAll(FOCUSABLE)]
        : [...menu.querySelectorAll(FOCUSABLE)];
      for(const focusable of candidates){
        menuTabSnapshots.push(rememberAttribute(focusable,'tabindex'));
        focusable.setAttribute('tabindex','-1');
      }
    }
    if(interactive)menu.setAttribute('aria-hidden','false');
  };

  const menuItems=()=>visibleFocusable(menu).filter(element=>element!==menuButton);
  const focusEntry=()=>{
    if(safeFocus(orb))return true;
    const items=menuItems();
    return safeFocus(items.find(item=>item.getAttribute('aria-current')==='page')||items[0]||menuButton);
  };
  const focusCycle=()=>[menuButton,orb,...menuItems()].filter(Boolean);

  const cycleFocus=event=>{
    if(!active||!menuInteractive||event.key!=='Tab')return;
    const items=focusCycle();
    if(!items.length)return;
    const current=items.indexOf(document.activeElement);
    const direction=event.shiftKey?-1:1;
    const next=current<0
      ? (event.shiftKey?items.length-1:0)
      : (current+direction+items.length)%items.length;
    event.preventDefault();
    safeFocus(items[next]);
  };

  const spatialFocus=event=>{
    if(!active||!menuInteractive)return;
    if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key))return;
    const items=[orb,...menuItems()].filter(Boolean);
    if(!items.length)return;
    const current=items.indexOf(document.activeElement);
    if(current<0&&document.activeElement!==menuButton)return;
    let next=0;
    if(event.key==='End')next=items.length-1;
    else if(event.key==='Home')next=0;
    else{
      const direction=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;
      next=current<0?(direction>0?0:items.length-1):(current+direction+items.length)%items.length;
    }
    event.preventDefault();
    safeFocus(items[next]);
  };

  const targetInsideOrb=target=>target instanceof Node&&(target===orb||orb.contains(target));

  const shieldPointer=event=>{
    if(!active)return;
    const target=event.target;
    if(!(target instanceof Node))return;
    if(menu.contains(target)||menuButton.contains(target)||targetInsideOrb(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    pointerShielded=true;
    queueMicrotask(()=>{pointerShielded=false;});
  };

  const shieldClick=event=>{
    if(!active||pointerShielded)return;
    const target=event.target;
    if(!(target instanceof Node))return;
    if(menu.contains(target)||menuButton.contains(target)||targetInsideOrb(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  const onState=event=>{
    const state=String(event.detail?.state||'').toLowerCase();
    const targetOpen=Boolean(event.detail?.targetOpen);
    if(!state)return;

    if(MENU_ACTIVE_STATES.has(state))lockBackground();
    else if(state==='closed')unlockBackground();

    const interactive=MENU_INTERACTIVE_STATES.has(state)&&targetOpen;
    setMenuInteractive(interactive);

    if(state==='open'){
      setMenuInteractive(true);
      requestAnimationFrame(focusEntry);
    }
    if(state==='closing'||state==='navigating'||(state==='reversing'&&!targetOpen)){
      setMenuInteractive(false);
    }
    if(state==='closed'){
      setMenuInteractive(false);
      menu.setAttribute('aria-hidden','true');
    }
  };

  const onFocusEscape=event=>{
    if(!active||!menuInteractive)return;
    const target=event.target;
    if(target===menuButton||targetInsideOrb(target)||menu.contains(target))return;
    queueMicrotask(focusEntry);
  };

  menu.dataset.accessibilityVersion='327';
  menuButton.setAttribute('aria-controls','orbMenu');
  orb.setAttribute('aria-describedby','orbStatus');
  setMenuInteractive(false);

  document.addEventListener('divina:menu-state',onState);
  document.addEventListener('keydown',cycleFocus,true);
  document.addEventListener('keydown',spatialFocus,true);
  document.addEventListener('focusin',onFocusEscape,true);
  document.addEventListener('pointerdown',shieldPointer,true);
  document.addEventListener('click',shieldClick,true);

  const initialState=String(html.dataset.menuState||'closed').toLowerCase();
  onState({detail:{
    state:initialState,
    targetOpen:initialState==='open'||initialState==='opening'
  }});

  const destroy=()=>{
    document.removeEventListener('divina:menu-state',onState);
    document.removeEventListener('keydown',cycleFocus,true);
    document.removeEventListener('keydown',spatialFocus,true);
    document.removeEventListener('focusin',onFocusEscape,true);
    document.removeEventListener('pointerdown',shieldPointer,true);
    document.removeEventListener('click',shieldClick,true);
    unlockBackground();
    if(!supportsInert){
      for(const snapshot of menuTabSnapshots)restoreAttribute(snapshot);
      menuTabSnapshots=[];
    }else{
      setMenuInteractive(false);
    }
    delete menu.dataset.accessibilityVersion;
  };

  const api=Object.freeze({
    installed:true,
    version:327,
    orbInteractive:true,
    focusEntry,
    snapshot:()=>Object.freeze({
      active,
      interactive:menuInteractive,
      state:html.dataset.menuState||'closed',
      focusables:focusCycle().length,
      centralOrbInteractive:true,
      supportsInert
    }),
    destroy
  });

  window.divinaMenuA11yV327=api;
  document.dispatchEvent(new CustomEvent('divina:menu-accessibility-ready',{
    detail:{version:327,supportsInert,centralOrbInteractive:true}
  }));
  return api;
}
