/* DIVINA BRUXA 2.0 — REBIRTH R029 · MENU MÁGICO RECONSTRUÍDO V329
   Visual e interação do Menu refeitos do zero.
   Navigation V210 continua sendo a única autoridade de rotas/estado.
   A mesma Orbe V208 permanece no centro e recebe toque diretamente. */

const RELEASE='V329';
const ROOT_ID='menuRebornV329';
const STYLE_ID='menuRebornV329Styles';
const MARK=Symbol.for('divina.menu.reborn.v329');

const ACTIVE_STATES=new Set(['opening','open','reversing']);
const VISIBLE_STATES=new Set(['opening','open','reversing','closing','navigating']);

const PRIMARY=Object.freeze([
  ['home','⌂','Início'],
  ['tarot','▣','Tarot'],
  ['spreads','✧','Tiragens'],
  ['school','▤','Escola'],
  ['ai','✦','Whit'],
  ['consultations','♙','Consultas'],
  ['music','♫','Música'],
  ['login','◎','Conta']
]);

const TOP=Object.freeze([
  ['videos','▶','Vídeos'],
  ['library','▥','Biblioteca'],
  ['daily','☾','Carta do Dia'],
  ['store','◇','Loja']
]);

const BOTTOM=Object.freeze([
  ['journal','▤','Diário'],
  ['skins','◆','Skins'],
  ['subscriptions','✦','Premium'],
  ['notifications','☾','Sinais']
]);

const clean=(value,limit=80)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')
  ||'home';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./menu-reborn-v329.css?v=329';
  document.head.append(link);
}

function portal([route,sigil,label],kind,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`m329-portal m329-portal--${kind}`;
  button.dataset.go=route;
  button.dataset.m329Index=String(index);
  button.style.setProperty('--m329-index',String(index));
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`
    <span class="m329-portal__jewel" aria-hidden="true">
      <i class="m329-portal__sigil">${sigil}</i>
      <i class="m329-portal__spark"></i>
    </span>
    <small>${label}</small>`;
  return button;
}

function createRoot(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-reborn-v329';
  root.setAttribute('aria-label','Menu Mágico — caminhos da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="m329-cosmos" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="m329-top" data-m329-top aria-label="Portais rápidos"></div>
    <div class="m329-orbit" aria-hidden="true">
      <i class="m329-orbit__line m329-orbit__line--outer"></i>
      <i class="m329-orbit__line m329-orbit__line--inner"></i>
      <i class="m329-orbit__comet"></i>
    </div>
    <div class="m329-primary" data-m329-primary aria-label="Caminhos principais"></div>
    <p class="m329-heart-copy" aria-hidden="true">TOQUE · RESPIRE · ESCOLHA</p>
    <div class="m329-bottom" data-m329-bottom aria-label="Portais pessoais"></div>`;
  PRIMARY.forEach((item,index)=>root.querySelector('[data-m329-primary]').append(portal(item,'primary',index)));
  TOP.forEach((item,index)=>root.querySelector('[data-m329-top]').append(portal(item,'secondary',index)));
  BOTTOM.forEach((item,index)=>root.querySelector('[data-m329-bottom]').append(portal(item,'secondary',index+4)));
  return root;
}

function setInert(element,value){
  if(!element)return;
  try{element.inert=value;}catch{}
  if(value)element.setAttribute('inert','');
  else element.removeAttribute('inert');
}

export class MenuRebornV329{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.orb=document.querySelector('#orb');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');
    this.brand=document.querySelector('.app-header .brand');
    this.destroyed=false;
    this.open=false;
    this.state=String(this.html.dataset.menuState||'closed').toLowerCase();
    this.abort=new AbortController();
    this.lastFocus=null;
    this.focusSnapshots=[];
    this.pointer=0;
    this.route=routeNow();

    if(!this.home||!this.legacy||!this.orb||!this.menuButton)throw new Error('Estrutura do Menu não encontrada.');

    installStyle();
    this.disableLegacyA11y();
    this.mount();
    this.bind();
    this.syncRoute(this.route);
    this.syncState(this.state,this.state==='open'||this.state==='opening');
    this.html.dataset.menuReborn='v329';
  }

  disableLegacyA11y(){
    try{window.divinaMenuA11yV327?.destroy?.();}catch{}
    try{window.divinaMenuA11yV211?.destroy?.();}catch{}
    delete window.divinaMenuA11yV327;
    delete window.divinaMenuA11yV211;
    this.legacy.dataset.menuVisualAuthority='v329-compat';
  }

  mount(){
    document.getElementById(ROOT_ID)?.remove();
    this.root=createRoot();
    this.home.append(this.root);
    this.buttons=[...this.root.querySelectorAll('[data-go]')];
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:menu-state',event=>{
      const state=clean(event.detail?.state,30).toLowerCase()||'closed';
      const targetOpen=Boolean(event.detail?.targetOpen);
      this.syncState(state,targetOpen);
    },{signal});

    document.addEventListener('divina:route-ready',event=>{
      this.syncRoute(event.detail?.id||routeNow());
    },{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    this.root.addEventListener('pointerdown',event=>{
      const button=event.target.closest('.m329-portal');
      if(!button)return;
      button.classList.add('is-touching');
      const cleanTouch=()=>button.classList.remove('is-touching');
      button.addEventListener('pointerup',cleanTouch,{once:true});
      button.addEventListener('pointercancel',cleanTouch,{once:true});
      setTimeout(cleanTouch,520);
    },{passive:true,signal});

    this.root.addEventListener('click',event=>{
      const button=event.target.closest('[data-go]');
      if(!button)return;
      this.pulse(button);
    },{signal});

    this.menuButton.addEventListener('keydown',event=>{
      if(!this.open)return;
      if(event.key==='ArrowDown'||event.key==='ArrowRight'){
        event.preventDefault();
        this.focusEntry();
      }
    },{signal});

    document.addEventListener('keydown',event=>this.onKey(event),{capture:true,signal});
    document.addEventListener('focusin',event=>this.onFocus(event),{capture:true,signal});
    document.addEventListener('pointerdown',event=>this.shield(event),{capture:true,signal});
  }

  syncState(state,targetOpen=false){
    this.state=state;
    const visible=VISIBLE_STATES.has(state);
    const interactive=ACTIVE_STATES.has(state)&&targetOpen;
    const wasOpen=this.open;
    this.open=interactive||state==='open';

    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',this.open);
    this.root.setAttribute('aria-hidden',String(!visible));

    if(visible&&!wasOpen){
      this.lastFocus=document.activeElement;
      this.lockBackground();
    }
    if(this.open&&!wasOpen){
      requestAnimationFrame(()=>this.focusEntry());
    }
    if(!visible||state==='closed'){
      this.unlockBackground();
      if(wasOpen&&this.lastFocus?.focus){
        try{this.menuButton.focus({preventScroll:true});}catch{}
      }
      this.lastFocus=null;
    }

    // Central Orb: same physical size through touch. Magic comes from light, never growth.
    this.orb.dataset.m329Menu=this.open?'open':'closed';
  }

  lockBackground(){
    this.focusSnapshots=[];
    for(const element of [this.brand,this.dock]){
      if(!element)continue;
      this.focusSnapshots.push({
        element,
        ariaHidden:element.getAttribute('aria-hidden'),
        hadAriaHidden:element.hasAttribute('aria-hidden'),
        hadInert:element.hasAttribute('inert')
      });
      element.setAttribute('aria-hidden','true');
      setInert(element,true);
    }
    // Orb and top menu button remain available.
    setInert(this.orb,false);
    this.orb.removeAttribute('aria-hidden');
    setInert(this.root,false);
    this.html.dataset.menuModal='v329';
  }

  unlockBackground(){
    for(const snapshot of this.focusSnapshots){
      if(!snapshot.element?.isConnected)continue;
      if(snapshot.hadAriaHidden)snapshot.element.setAttribute('aria-hidden',snapshot.ariaHidden??'');
      else snapshot.element.removeAttribute('aria-hidden');
      if(!snapshot.hadInert)setInert(snapshot.element,false);
    }
    this.focusSnapshots=[];
    delete this.html.dataset.menuModal;
  }

  syncRoute(route){
    this.route=clean(route,40)||'home';
    this.buttons.forEach(button=>{
      const current=button.dataset.go===this.route;
      button.classList.toggle('is-current',current);
      if(current)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  focusable(){
    return [this.menuButton,this.orb,...this.buttons].filter(element=>element?.isConnected&&!element.disabled);
  }

  focusEntry(){
    try{this.orb.focus({preventScroll:true});return true;}
    catch{
      try{this.buttons[0]?.focus({preventScroll:true});return true;}catch{return false;}
    }
  }

  onKey(event){
    if(!this.open)return;

    if(event.key==='Escape'){
      event.preventDefault();
      this.menuButton.click();
      return;
    }

    if(event.key==='Tab'){
      const items=this.focusable();
      const current=items.indexOf(document.activeElement);
      const direction=event.shiftKey?-1:1;
      const next=current<0
        ? (event.shiftKey?items.length-1:0)
        : (current+direction+items.length)%items.length;
      event.preventDefault();
      try{items[next]?.focus({preventScroll:true});}catch{}
      return;
    }

    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      const items=[this.orb,...this.buttons];
      const current=items.indexOf(document.activeElement);
      if(current<0)return;
      const direction=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;
      const next=(current+direction+items.length)%items.length;
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
    if(target===this.menuButton||this.menuButton.contains(target)
      ||target===this.orb||this.orb.contains(target)
      ||this.root.contains(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  pulse(button){
    button.classList.remove('m329-pulse');
    requestAnimationFrame(()=>{
      button.classList.add('m329-pulse');
      setTimeout(()=>button.classList.remove('m329-pulse'),620);
    });
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      state:this.state,
      route:this.route,
      open:this.open,
      rebuiltFromScratch:true,
      legacyVisualHidden:true,
      routingAuthority:'V210',
      centralOrb:'V208',
      orbGrowsOnTouch:false,
      reducedMotion:reduced(),
      extraApiCalls:0
    });
  }

  destroy(){
    this.destroyed=true;
    this.abort.abort();
    this.unlockBackground();
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.orb.dataset.m329Menu;
  }
}

export function installMenuRebornV329(options={}){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new MenuRebornV329(options);
  globalThis[MARK]=instance;
  globalThis.divinaMenuV329=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-reborn-ready',{
    detail:Object.freeze({
      release:RELEASE,
      rebuiltFromScratch:true,
      routingAuthority:'V210',
      centralOrb:'V208',
      orbGrowsOnTouch:false
    })
  }));
  return instance;
}
