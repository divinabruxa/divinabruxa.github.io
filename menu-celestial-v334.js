/* DIVINA BRUXA 2.0 — REBIRTH R034 · MENU CELESTIAL V334
   Menu visual/interativo novo, coreografado em torno da MESMA Orbe V208.
   Navigation V210 continua sendo a única autoridade de rotas e estados. */

const RELEASE='V334';
const ROOT_ID='menuCelestialV334';
const STYLE_ID='menuCelestialV334Styles';
const INSTANCE=Symbol.for('divina.menu.celestial.v334');

const VISIBLE_STATES=new Set(['opening','open','reversing','closing','navigating']);
const OPEN_STATES=new Set(['opening','open']);

const PRIMARY=Object.freeze([
  ['home','⌂','Início',0],
  ['tarot','▣','Tarot',45],
  ['spreads','✧','Tiragens',90],
  ['school','▤','Escola',135],
  ['ai','✦','Whit',180],
  ['consultations','♙','Consultas',225],
  ['music','♫','Música',270],
  ['login','◎','Conta',315]
]);

const UPPER=Object.freeze([
  ['videos','▶','Vídeos'],
  ['library','▥','Biblioteca'],
  ['daily','☾','Carta do Dia'],
  ['store','◇','Loja']
]);

const LOWER=Object.freeze([
  ['journal','▤','Diário'],
  ['skins','◆','Skins'],
  ['subscriptions','✦','Premium'],
  ['notifications','☾','Notificações']
]);

const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')
  ||'home';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./menu-celestial-v334.css?v=334';
  document.head.append(link);
}

function jewel(route,sigil,label,kind,index,angle=null){
  const button=document.createElement('button');
  button.type='button';
  button.className=`mc334-portal mc334-portal--${kind}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(angle!=null)button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`
    <span class="mc334-jewel" aria-hidden="true">
      <i>${sigil}</i><em></em>
    </span>
    <small>${label}</small>`;
  return button;
}

function createMenu(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-celestial-v334';
  root.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="mc334-atmosphere" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </span>
    <div class="mc334-upper" data-upper></div>
    <div class="mc334-orbit" aria-hidden="true">
      <i class="mc334-orbit__outer"></i>
      <i class="mc334-orbit__inner"></i>
      <b class="mc334-comet"></b>
    </div>
    <div class="mc334-primary" data-primary></div>
    <div class="mc334-lower" data-lower></div>`;
  PRIMARY.forEach((item,index)=>root.querySelector('[data-primary]').append(jewel(item[0],item[1],item[2],'primary',index,item[3])));
  UPPER.forEach((item,index)=>root.querySelector('[data-upper]').append(jewel(item[0],item[1],item[2],'secondary',index)));
  LOWER.forEach((item,index)=>root.querySelector('[data-lower]').append(jewel(item[0],item[1],item[2],'secondary',index+4)));
  return root;
}

function setInert(element,value){
  if(!element)return;
  try{element.inert=value;}catch{}
  if(value)element.setAttribute('inert','');
  else element.removeAttribute('inert');
}

export class MenuCelestialV334{
  constructor(){
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.orb=document.querySelector('#orb');
    this.stage=document.querySelector('#home .orb-stage-ref');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');
    this.brand=document.querySelector('.app-header .brand');
    this.state=String(this.html.dataset.menuState||'closed').toLowerCase();
    this.targetOpen=false;
    this.abort=new AbortController();
    this.snapshots=[];

    if(!this.home||!this.legacy||!this.orb||!this.stage||!this.menuButton){
      throw new Error('Estrutura essencial do Menu não encontrada.');
    }

    // Elimina visual/comportamento concorrente de menus Rebirth anteriores.
    try{globalThis.divinaMenuV333?.destroy?.();}catch{}
    try{globalThis.divinaMenuV332?.destroy?.();}catch{}
    try{globalThis.divinaMenuV329?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;
    document.getElementById('menuFluidV333')?.remove();
    document.getElementById('menuRebornV332')?.remove();
    document.getElementById('menuRebornV329')?.remove();

    installStyle();
    this.root=createMenu();
    document.body.append(this.root);
    this.buttons=[...this.root.querySelectorAll('[data-go]')];
    this.legacy.dataset.menuVisualAuthority='v334-compat';

    this.bind();
    this.syncRoute(routeNow());
    this.syncState(this.state,this.state==='open'||this.state==='opening');
    this.html.dataset.menuReborn='v334';
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:menu-state',event=>{
      const state=String(event.detail?.state||'closed').toLowerCase();
      const targetOpen=Boolean(event.detail?.targetOpen);
      this.syncState(state,targetOpen);
    },{signal});

    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    this.root.addEventListener('pointerdown',event=>{
      const portal=event.target.closest('.mc334-portal');
      if(!portal)return;
      portal.classList.add('is-touching');
      const clear=()=>portal.classList.remove('is-touching');
      portal.addEventListener('pointerup',clear,{once:true});
      portal.addEventListener('pointercancel',clear,{once:true});
      setTimeout(clear,440);
    },{passive:true,signal});

    document.addEventListener('keydown',event=>this.handleKeys(event),{capture:true,signal});
    document.addEventListener('focusin',event=>this.guardFocus(event),{capture:true,signal});
    document.addEventListener('pointerdown',event=>this.shield(event),{capture:true,signal});
  }

  syncState(state,targetOpen=false){
    this.state=state;
    this.targetOpen=targetOpen;

    const visible=VISIBLE_STATES.has(state);
    const open=OPEN_STATES.has(state)||(state==='reversing'&&targetOpen);
    const closing=state==='closing'||state==='navigating'||(state==='reversing'&&!targetOpen);

    const wasVisible=this.root.classList.contains('is-visible');

    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',open);
    this.root.classList.toggle('is-closing',closing);
    this.root.setAttribute('aria-hidden',String(!visible));

    if(visible&&!wasVisible)this.lockBackground();
    if(open&&!wasVisible)requestAnimationFrame(()=>this.focusEntry());

    if(!visible||state==='closed'){
      this.unlockBackground();
    }

    this.orb.dataset.menuCelestial=open?'open':closing?'closing':'closed';
    this.html.dataset.menuVisualState=state;
  }

  lockBackground(){
    if(this.snapshots.length)return;
    for(const element of [this.brand]){
      if(!element)continue;
      this.snapshots.push({
        element,
        hadAria:element.hasAttribute('aria-hidden'),
        aria:element.getAttribute('aria-hidden'),
        hadInert:element.hasAttribute('inert')
      });
      element.setAttribute('aria-hidden','true');
      setInert(element,true);
    }
    // Dock permanece visível e clicável como parte persistente do app.
    setInert(this.orb,false);
    this.orb.removeAttribute('aria-hidden');
    setInert(this.root,false);
    this.html.dataset.menuModal='v334';
  }

  unlockBackground(){
    for(const snapshot of this.snapshots){
      if(!snapshot.element?.isConnected)continue;
      if(snapshot.hadAria)snapshot.element.setAttribute('aria-hidden',snapshot.aria??'');
      else snapshot.element.removeAttribute('aria-hidden');
      if(!snapshot.hadInert)setInert(snapshot.element,false);
    }
    this.snapshots=[];
    delete this.html.dataset.menuModal;
    delete this.html.dataset.menuVisualState;
  }

  syncRoute(route){
    const id=String(route||'home');
    this.buttons.forEach(button=>{
      const active=button.dataset.go===id;
      button.classList.toggle('is-current',active);
      if(active)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  focusables(){
    return [this.menuButton,this.orb,...this.buttons].filter(node=>node?.isConnected&&!node.disabled);
  }

  focusEntry(){
    try{this.orb.focus({preventScroll:true});}
    catch{try{this.buttons[0]?.focus({preventScroll:true});}catch{}}
  }

  handleKeys(event){
    const active=this.root.classList.contains('is-open');
    if(!active)return;
    if(event.key==='Escape'){
      event.preventDefault();
      this.menuButton.click();
      return;
    }
    if(event.key==='Tab'){
      const items=this.focusables();
      const current=items.indexOf(document.activeElement);
      const next=current<0
        ? (event.shiftKey?items.length-1:0)
        : (current+(event.shiftKey?-1:1)+items.length)%items.length;
      event.preventDefault();
      try{items[next]?.focus({preventScroll:true});}catch{}
    }
  }

  guardFocus(event){
    if(!this.root.classList.contains('is-open'))return;
    const target=event.target;
    if(target===this.menuButton||target===this.orb||this.orb.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
    queueMicrotask(()=>this.focusEntry());
  }

  shield(event){
    if(!this.root.classList.contains('is-open'))return;
    const target=event.target;
    if(!(target instanceof Node))return;
    if(this.menuButton.contains(target)||this.orb.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      state:this.state,
      routingAuthority:'V210',
      orbEngine:'V208',
      sameOrb:true,
      openOrbVisible:true,
      reversible:true,
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.unlockBackground();
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.orb.dataset.menuCelestial;
  }
}

export function installMenuCelestialV334(){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuCelestialV334();
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV334=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-celestial-ready',{
    detail:Object.freeze({release:RELEASE,routingAuthority:'V210',sameOrb:true})
  }));
  return instance;
}
