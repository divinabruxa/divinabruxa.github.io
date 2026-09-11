/* DIVINA BRUXA 2.0 — REBIRTH R032 · MENU RECOVERY V332
   Corrige o V329: o novo menu não é mais filho direto da Home.
   Navigation V210 continua sendo a única autoridade de estado/rotas. */

const RELEASE='V332';
const ROOT_ID='menuRebornV332';
const STYLE_ID='menuRebornV332Styles';
const MARK=Symbol.for('divina.menu.reborn.v332');

const ACTIVE_STATES=new Set(['opening','open','reversing']);
const VISIBLE_STATES=new Set(['opening','open','reversing','closing','navigating']);

const PRIMARY=Object.freeze([
  ['home','⌂','Início'],['tarot','▣','Tarot'],['spreads','✧','Tiragens'],['school','▤','Escola'],
  ['ai','✦','Whit'],['consultations','♙','Consultas'],['music','♫','Música'],['login','◎','Conta']
]);
const TOP=Object.freeze([
  ['videos','▶','Vídeos'],['library','▥','Biblioteca'],['daily','☾','Carta do Dia'],['store','◇','Loja']
]);
const BOTTOM=Object.freeze([
  ['journal','▤','Diário'],['skins','◆','Skins'],['subscriptions','✦','Premium'],['notifications','☾','Sinais']
]);

const clean=(value,limit=80)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')||'home';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./menu-reborn-v332.css?v=332';
  document.head.append(link);
}

function portal([route,sigil,label],kind,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`m332-portal m332-portal--${kind}`;
  button.dataset.go=route;
  button.dataset.m332Index=String(index);
  button.style.setProperty('--m332-index',String(index));
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`<span class="m332-portal__jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return button;
}

function createRoot(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-reborn-v332';
  root.setAttribute('aria-label','Menu Mágico — caminhos da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="m332-space" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="m332-top" data-m332-top></div>
    <div class="m332-orbits" aria-hidden="true"><i></i><i></i><b></b></div>
    <div class="m332-primary" data-m332-primary></div>
    <p class="m332-whisper" aria-hidden="true">ESCOLHA UM CAMINHO</p>
    <div class="m332-bottom" data-m332-bottom></div>`;
  PRIMARY.forEach((item,index)=>root.querySelector('[data-m332-primary]').append(portal(item,'primary',index)));
  TOP.forEach((item,index)=>root.querySelector('[data-m332-top]').append(portal(item,'secondary',index)));
  BOTTOM.forEach((item,index)=>root.querySelector('[data-m332-bottom]').append(portal(item,'secondary',index+4)));
  return root;
}

function setInert(element,value){
  if(!element)return;
  try{element.inert=value;}catch{}
  if(value)element.setAttribute('inert','');
  else element.removeAttribute('inert');
}

export class MenuRebornV332{
  constructor(){
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.orb=document.querySelector('#orb');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');
    this.brand=document.querySelector('.app-header .brand');
    this.abort=new AbortController();
    this.state=String(this.html.dataset.menuState||'closed').toLowerCase();
    this.open=false;
    this.snapshots=[];
    this.lastFocus=null;

    if(!this.home||!this.legacy||!this.orb||!this.menuButton)throw new Error('Estrutura do Menu não encontrada.');

    try{globalThis.divinaMenuV329?.destroy?.();}catch{}
    document.getElementById('menuRebornV329')?.remove();
    installStyle();
    this.mount();
    this.bind();
    this.syncRoute(routeNow());
    this.syncState(this.state,this.state==='open'||this.state==='opening');
    this.html.dataset.menuReborn='v332';
    this.legacy.dataset.menuVisualAuthority='v332-compat';
  }

  mount(){
    document.getElementById(ROOT_ID)?.remove();
    this.root=createRoot();
    // P0 FIX: camada fixa no body, nunca dentro da Home.
    document.body.append(this.root);
    this.buttons=[...this.root.querySelectorAll('[data-go]')];
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:menu-state',event=>{
      this.syncState(clean(event.detail?.state,30).toLowerCase()||'closed',Boolean(event.detail?.targetOpen));
    },{signal});
    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{if(event.detail?.id)this.syncRoute(event.detail.id);},{signal});

    this.root.addEventListener('pointerdown',event=>{
      const button=event.target.closest('.m332-portal');
      if(!button)return;
      button.classList.add('is-touching');
      const clear=()=>button.classList.remove('is-touching');
      button.addEventListener('pointerup',clear,{once:true});
      button.addEventListener('pointercancel',clear,{once:true});
      setTimeout(clear,520);
    },{passive:true,signal});

    document.addEventListener('keydown',event=>this.onKey(event),{capture:true,signal});
    document.addEventListener('focusin',event=>this.onFocus(event),{capture:true,signal});
    document.addEventListener('pointerdown',event=>this.shield(event),{capture:true,signal});
  }

  syncState(state,targetOpen=false){
    const visible=VISIBLE_STATES.has(state);
    const wasOpen=this.open;
    this.state=state;
    this.open=(ACTIVE_STATES.has(state)&&targetOpen)||state==='open';

    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',this.open);
    this.root.setAttribute('aria-hidden',String(!visible));

    if(visible&&!wasOpen){
      this.lastFocus=document.activeElement;
      this.lockBackground();
    }
    if(this.open&&!wasOpen)requestAnimationFrame(()=>this.focusEntry());

    if(!visible||state==='closed'){
      this.unlockBackground();
      if(wasOpen){
        try{this.menuButton.focus({preventScroll:true});}catch{}
      }
      this.lastFocus=null;
    }
    this.orb.dataset.m332Menu=this.open?'open':'closed';
  }

  lockBackground(){
    this.snapshots=[];
    for(const element of [this.brand,this.dock]){
      if(!element)continue;
      this.snapshots.push({
        element,
        ariaHidden:element.getAttribute('aria-hidden'),
        hadAriaHidden:element.hasAttribute('aria-hidden'),
        hadInert:element.hasAttribute('inert')
      });
      element.setAttribute('aria-hidden','true');
      setInert(element,true);
    }
    setInert(this.orb,false);
    this.orb.removeAttribute('aria-hidden');
    setInert(this.root,false);
    this.html.dataset.menuModal='v332';
  }

  unlockBackground(){
    for(const snapshot of this.snapshots){
      if(!snapshot.element?.isConnected)continue;
      if(snapshot.hadAriaHidden)snapshot.element.setAttribute('aria-hidden',snapshot.ariaHidden??'');
      else snapshot.element.removeAttribute('aria-hidden');
      if(!snapshot.hadInert)setInert(snapshot.element,false);
    }
    this.snapshots=[];
    delete this.html.dataset.menuModal;
  }

  syncRoute(route){
    const id=clean(route,40)||'home';
    this.buttons.forEach(button=>{
      const current=button.dataset.go===id;
      button.classList.toggle('is-current',current);
      if(current)button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
    });
  }

  focusEntry(){
    try{this.orb.focus({preventScroll:true});}
    catch{try{this.buttons[0]?.focus({preventScroll:true});}catch{}}
  }

  focusables(){return [this.menuButton,this.orb,...this.buttons].filter(node=>node?.isConnected&&!node.disabled);}

  onKey(event){
    if(!this.open)return;
    if(event.key==='Escape'){event.preventDefault();this.menuButton.click();return;}
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

  onFocus(event){
    if(!this.open)return;
    const target=event.target;
    if(target===this.menuButton||target===this.orb||this.orb.contains(target)||this.root.contains(target))return;
    queueMicrotask(()=>this.focusEntry());
  }

  shield(event){
    if(!this.open)return;
    const target=event.target;
    if(!(target instanceof Node))return;
    if(this.menuButton.contains(target)||this.orb.contains(target)||this.root.contains(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  status(){return Object.freeze({
    release:RELEASE,state:this.state,open:this.open,mount:'body-fixed',
    routingAuthority:'V210',centralOrb:'V208',extraApiCalls:0
  });}

  destroy(){
    this.abort.abort();
    this.unlockBackground();
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.orb.dataset.m332Menu;
  }
}

export function installMenuRebornV332(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new MenuRebornV332();
  globalThis[MARK]=instance;
  globalThis.divinaMenuV332=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-reborn-ready',{
    detail:Object.freeze({release:RELEASE,mount:'body-fixed',routingAuthority:'V210'})
  }));
  return instance;
}
