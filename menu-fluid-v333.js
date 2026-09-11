/* DIVINA BRUXA 2.0 — REBIRTH R033 · MENU FLUIDO V333
   Menu reconstruído novamente: Orbe menor, abertura/fechamento reversíveis.
   Navigation V210 continua sendo a única autoridade de rotas e estado. */

const RELEASE='V333';
const ROOT_ID='menuFluidV333';
const STYLE_ID='menuFluidV333Styles';
const MARK=Symbol.for('divina.menu.fluid.v333');

const VISIBLE=new Set(['opening','open','reversing','closing','navigating']);
const OPENISH=new Set(['opening','open','reversing']);
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

const clean=(v,n=80)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')||'home';

function style(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./menu-fluid-v333.css?v=333';
  document.head.append(link);
}
function portal([route,sigil,label],zone,index){
  const b=document.createElement('button');
  b.type='button';
  b.className=`mf333-portal mf333-portal--${zone}`;
  b.dataset.go=route;
  b.style.setProperty('--i',String(index));
  b.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  b.innerHTML=`<span class="mf333-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return b;
}
function rootMarkup(){
  const nav=document.createElement('nav');
  nav.id=ROOT_ID;
  nav.className='menu-fluid-v333';
  nav.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  nav.setAttribute('aria-hidden','true');
  nav.innerHTML=`
    <span class="mf333-nebula" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="mf333-top" data-top></div>
    <div class="mf333-ring" aria-hidden="true"><i></i><i></i><b></b></div>
    <div class="mf333-primary" data-primary></div>
    <span class="mf333-heart" aria-hidden="true">✦</span>
    <div class="mf333-bottom" data-bottom></div>`;
  PRIMARY.forEach((item,index)=>nav.querySelector('[data-primary]').append(portal(item,'primary',index)));
  TOP.forEach((item,index)=>nav.querySelector('[data-top]').append(portal(item,'secondary',index)));
  BOTTOM.forEach((item,index)=>nav.querySelector('[data-bottom]').append(portal(item,'secondary',index+4)));
  return nav;
}
function inert(el,value){
  if(!el)return;
  try{el.inert=value;}catch{}
  if(value)el.setAttribute('inert',''); else el.removeAttribute('inert');
}

export class MenuFluidV333{
  constructor(){
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.orb=document.querySelector('#orb');
    this.stage=document.querySelector('#home .orb-stage-ref');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');
    this.brand=document.querySelector('.app-header .brand');
    this.abort=new AbortController();
    this.state=String(this.html.dataset.menuState||'closed').toLowerCase();
    this.open=false;
    this.snapshots=[];

    if(!this.home||!this.legacy||!this.orb||!this.stage||!this.menuButton)throw new Error('Estrutura do Menu não encontrada.');

    try{globalThis.divinaMenuV332?.destroy?.();}catch{}
    try{globalThis.divinaMenuV329?.destroy?.();}catch{}
    document.getElementById('menuRebornV332')?.remove();
    document.getElementById('menuRebornV329')?.remove();

    style();
    this.root=rootMarkup();
    document.body.append(this.root);
    this.buttons=[...this.root.querySelectorAll('[data-go]')];
    this.bind();
    this.syncRoute(routeNow());
    this.sync(this.state,this.state==='open'||this.state==='opening');
    this.html.dataset.menuReborn='v333';
    this.legacy.dataset.menuVisualAuthority='v333-compat';
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:menu-state',event=>{
      this.sync(clean(event.detail?.state,30).toLowerCase()||'closed',Boolean(event.detail?.targetOpen));
    },{signal});
    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{if(event.detail?.id)this.syncRoute(event.detail.id);},{signal});

    this.root.addEventListener('pointerdown',event=>{
      const button=event.target.closest('.mf333-portal');
      if(!button)return;
      button.classList.add('is-touching');
      const clear=()=>button.classList.remove('is-touching');
      button.addEventListener('pointerup',clear,{once:true});
      button.addEventListener('pointercancel',clear,{once:true});
      setTimeout(clear,480);
    },{passive:true,signal});

    document.addEventListener('keydown',event=>this.keys(event),{capture:true,signal});
    document.addEventListener('pointerdown',event=>this.shield(event),{capture:true,signal});
    document.addEventListener('focusin',event=>this.focusGuard(event),{capture:true,signal});
  }

  sync(state,targetOpen=false){
    const visible=VISIBLE.has(state);
    const wasOpen=this.open;
    this.state=state;
    this.open=(OPENISH.has(state)&&targetOpen)||state==='open';

    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',this.open);
    this.root.classList.toggle('is-closing',state==='closing'||state==='navigating'||(state==='reversing'&&!targetOpen));
    this.root.setAttribute('aria-hidden',String(!visible));
    this.html.dataset.menuVisualState=state;

    if(visible&&!wasOpen)this.lock();
    if(this.open&&!wasOpen)requestAnimationFrame(()=>this.focusEntry());
    if(!visible||state==='closed'){
      this.unlock();
      if(wasOpen){try{this.menuButton.focus({preventScroll:true});}catch{}}
    }
    this.orb.dataset.menuFluid=this.open?'open':'closed';
  }

  lock(){
    this.snapshots=[];
    for(const el of [this.brand,this.dock]){
      if(!el)continue;
      this.snapshots.push({el,had:el.hasAttribute('aria-hidden'),aria:el.getAttribute('aria-hidden'),inert:el.hasAttribute('inert')});
      el.setAttribute('aria-hidden','true'); inert(el,true);
    }
    inert(this.orb,false);this.orb.removeAttribute('aria-hidden');
    inert(this.root,false);
    this.html.dataset.menuModal='v333';
  }
  unlock(){
    for(const s of this.snapshots){
      if(!s.el?.isConnected)continue;
      if(s.had)s.el.setAttribute('aria-hidden',s.aria??''); else s.el.removeAttribute('aria-hidden');
      if(!s.inert)inert(s.el,false);
    }
    this.snapshots=[];
    delete this.html.dataset.menuModal;
    delete this.html.dataset.menuVisualState;
  }
  syncRoute(route){
    const id=clean(route,40)||'home';
    this.buttons.forEach(b=>{
      const current=b.dataset.go===id;
      b.classList.toggle('is-current',current);
      current?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');
    });
  }
  focusEntry(){try{this.orb.focus({preventScroll:true});}catch{try{this.buttons[0]?.focus({preventScroll:true});}catch{}}}
  focusables(){return [this.menuButton,this.orb,...this.buttons].filter(n=>n?.isConnected&&!n.disabled)}
  keys(event){
    if(!this.open)return;
    if(event.key==='Escape'){event.preventDefault();this.menuButton.click();return;}
    if(event.key==='Tab'){
      const items=this.focusables();
      const current=items.indexOf(document.activeElement);
      const next=current<0?(event.shiftKey?items.length-1:0):(current+(event.shiftKey?-1:1)+items.length)%items.length;
      event.preventDefault();try{items[next]?.focus({preventScroll:true});}catch{}
    }
  }
  focusGuard(event){
    if(!this.open)return;
    const t=event.target;
    if(t===this.menuButton||t===this.orb||this.orb.contains(t)||this.root.contains(t))return;
    queueMicrotask(()=>this.focusEntry());
  }
  shield(event){
    if(!this.open)return;
    const t=event.target;
    if(!(t instanceof Node))return;
    if(this.menuButton.contains(t)||this.orb.contains(t)||this.root.contains(t))return;
    event.preventDefault();event.stopImmediatePropagation();
  }
  status(){return Object.freeze({
    release:RELEASE,state:this.state,open:this.open,routingAuthority:'V210',
    centralOrb:'V208',openOrbReduced:true,reversibleVisualState:true,extraApiCalls:0
  })}
  destroy(){
    this.abort.abort();this.unlock();this.root?.remove();
    delete this.html.dataset.menuReborn;delete this.orb.dataset.menuFluid;
  }
}
export function installMenuFluidV333(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new MenuFluidV333();
  globalThis[MARK]=instance;globalThis.divinaMenuV333=instance;
  return instance;
}
