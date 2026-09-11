/* DIVINA BRUXA 2.0 — REBIRTH R038 · MENU ONE MOTION V338
   O vídeo de QA confirmou o defeito: o menu era encerrado antes da Orbe terminar a volta.
   V338 separa responsabilidades:
   - Navigation V210 = rotas.
   - Menu V338 = ÚNICA autoridade visual de abrir/fechar.
   O listener antigo do botão Menu é bloqueado em capture; nenhum FLIP legado roda. */

const RELEASE='V338';
const ROOT_ID='menuOneMotionV338';
const STYLE_ID='menuOneMotionV338Styles';
const INSTANCE=Symbol.for('divina.menu.one.motion.v338');

const PRIMARY=Object.freeze([
  ['home','⌂','Início',0],
  ['tarot','▣','Tarot Livre',45],
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

const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./menu-one-motion-v338.css?v=338';
  document.head.append(link);
}

function portal([route,sigil,label,angle],zone,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`mo338-portal mo338-portal--${zone}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(Number.isFinite(angle))button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`<span class="mo338-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return button;
}

function createScene(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-one-motion-v338';
  root.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="mo338-nebula" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="mo338-upper" data-upper></div>
    <div class="mo338-orbit" aria-hidden="true"><i></i><i></i><b></b></div>
    <div class="mo338-primary" data-primary></div>
    <div class="mo338-orb-slot" data-orb-slot aria-hidden="true"></div>
    <div class="mo338-lower" data-lower></div>`;
  PRIMARY.forEach((item,index)=>root.querySelector('[data-primary]').append(portal(item,'primary',index)));
  UPPER.forEach((item,index)=>root.querySelector('[data-upper]').append(portal(item,'secondary',index)));
  LOWER.forEach((item,index)=>root.querySelector('[data-lower]').append(portal(item,'secondary',index+4)));
  return root;
}

function setFixedRect(element,rect){
  const s=element.style;
  s.setProperty('position','fixed','important');
  s.setProperty('left',`${rect.left}px`,'important');
  s.setProperty('top',`${rect.top}px`,'important');
  s.setProperty('right','auto','important');
  s.setProperty('bottom','auto','important');
  s.setProperty('inset','auto','important');
  s.setProperty('width',`${rect.width}px`,'important');
  s.setProperty('height',`${rect.height}px`,'important');
  s.setProperty('margin','0','important');
  s.setProperty('transform','none','important');
  s.setProperty('transform-origin','0 0','important');
  s.setProperty('display','grid','important');
  s.setProperty('place-items','center','important');
  s.setProperty('z-index','55','important');
  s.setProperty('pointer-events','auto','important');
}

function rectCopy(rect){
  return Object.freeze({
    left:rect.left,top:rect.top,width:rect.width,height:rect.height,
    right:rect.right,bottom:rect.bottom
  });
}

export class MenuOneMotionV338{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');

    for(const key of ['divinaMenuV337','divinaMenuV336','divinaMenuV335','divinaMenuV334','divinaMenuV333','divinaMenuV332','divinaMenuV329']){
      try{globalThis[key]?.destroy?.();}catch{}
    }
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;
    ['menuSceneV337','menuSceneV336','menuSceneV335','menuCelestialV334','menuFluidV333','menuRebornV332','menuRebornV329']
      .forEach(id=>document.getElementById(id)?.remove());

    this.stage=this.home?.querySelector('.orb-stage-ref')||document.querySelector('.orb-stage-ref');
    this.orb=this.stage?.querySelector('#orb')||document.querySelector('#orb');
    if(!this.home||!this.legacy||!this.menuButton||!this.stage||!this.orb||!this.go){
      throw new Error('Estrutura essencial do Menu não encontrada.');
    }

    this.homeParent=this.stage.parentNode;
    this.anchor=document.createComment('divina-orb-home-v338');
    this.homeParent.insertBefore(this.anchor,this.stage);
    this.stageInline=this.stage.getAttribute('style');

    this.abort=new AbortController();
    this.state='closed';
    this.targetOpen=false;
    this.travel=null;
    this.travelToken=0;
    this.homeRect=null;
    this.openRect=null;
    this.pendingRoute=null;

    installStyle();
    this.root=createScene();
    document.body.append(this.root);
    this.slot=this.root.querySelector('[data-orb-slot]');
    this.buttons=[...this.root.querySelectorAll('[data-go]')];

    this.legacy.dataset.menuVisualAuthority='v338-compat';
    this.legacy.setAttribute('aria-hidden','true');
    this.html.dataset.menuReborn='v338';
    this.html.dataset.menuMotionAuthority='v338';

    this.bind();
    this.syncRoute(routeNow());
    this.publish('closed',false,'install');
  }

  bind(){
    const signal=this.abort.signal;

    this.menuButton.addEventListener('click',event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      if(this.targetOpen||this.state==='open'||this.state==='opening'){
        this.close({restoreFocus:true}).catch(()=>{});
      }else{
        this.open().catch(()=>{});
      }
    },{capture:true,signal});

    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape'||this.state==='closed')return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close({restoreFocus:true}).catch(()=>{});
    },{capture:true,signal});

    this.root.addEventListener('click',event=>{
      const portal=event.target.closest('[data-go]');
      if(!portal)return;
      event.preventDefault();
      event.stopPropagation();
      const route=portal.dataset.go;
      this.pendingRoute=route;
      this.close({restoreFocus:false})
        .then(()=>this.go(route))
        .finally(()=>{this.pendingRoute=null;})
        .catch(()=>{this.pendingRoute=null;});
    },{signal});

    document.addEventListener('click',event=>{
      if(this.state==='closed')return;
      const target=event.target.closest('[data-go]');
      if(!target||this.root.contains(target))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const route=target.dataset.go;
      this.pendingRoute=route;
      this.close({restoreFocus:false})
        .then(()=>this.go(route))
        .finally(()=>{this.pendingRoute=null;})
        .catch(()=>{this.pendingRoute=null;});
    },{capture:true,signal});

    this.root.addEventListener('pointerdown',event=>{
      const portal=event.target.closest('.mo338-portal');
      if(!portal)return;
      portal.classList.add('is-touching');
      const clear=()=>portal.classList.remove('is-touching');
      portal.addEventListener('pointerup',clear,{once:true});
      portal.addEventListener('pointercancel',clear,{once:true});
      setTimeout(clear,440);
    },{passive:true,signal});

    document.addEventListener('pointerdown',event=>{
      if(this.state==='closed')return;
      const target=event.target;
      if(!(target instanceof Node))return;
      if(this.menuButton.contains(target)||this.stage.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },{capture:true,signal});

    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    document.addEventListener('divina:route-start',()=>{
      if(this.state!=='closed'&&!this.pendingRoute){
        this.snapClosed();
      }
    },{signal});

    addEventListener('resize',()=>{
      if(this.state==='open'&&!this.travel){
        const rect=this.slot.getBoundingClientRect();
        this.openRect=rectCopy(rect);
        setFixedRect(this.stage,this.openRect);
      }
    },{signal});
  }

  publish(state,targetOpen,reason){
    const previous=this.state;
    this.state=state;
    this.targetOpen=targetOpen;
    this.html.dataset.menuState=state;
    this.root.dataset.state=state;
    document.dispatchEvent(new CustomEvent('divina:menu-state',{
      detail:Object.freeze({previous,state,targetOpen,reason,authority:'v338'})
    }));
  }

  setButton(open){
    this.menuButton.classList.toggle('is-open',open);
    this.menuButton.setAttribute('aria-expanded',String(open));
    this.menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    const label=this.menuButton.querySelector('span');
    if(label)label.textContent=open?'FECHAR':'MENU';
  }

  saveHomeRect(){
    if(this.stage.parentNode===this.homeParent){
      const rect=this.stage.getBoundingClientRect();
      if(rect.width>1&&rect.height>1)this.homeRect=rectCopy(rect);
    }
    return this.homeRect;
  }

  clearStageInline(){
    if(this.stageInline==null)this.stage.removeAttribute('style');
    else this.stage.setAttribute('style',this.stageInline);
    delete this.stage.dataset.menuTraveler;
  }

  placeHome(){
    if(this.anchor.parentNode){
      this.anchor.parentNode.insertBefore(this.stage,this.anchor.nextSibling);
    }else{
      this.homeParent.append(this.stage);
    }
    this.clearStageInline();
  }

  placeFixed(rect){
    document.body.append(this.stage);
    this.stage.dataset.menuTraveler='v338';
    setFixedRect(this.stage,rect);
  }

  freezeCurrent(){
    const rect=rectCopy(this.stage.getBoundingClientRect());
    if(this.travel){
      const animation=this.travel;
      this.travel=null;
      this.travelToken+=1;
      try{animation.cancel();}catch{}
    }
    this.placeFixed(rect);
    return rect;
  }

  async travelTo(targetRect,{opening}){
    const from=this.freezeCurrent();
    this.placeFixed(from);

    if(reduced()){
      this.placeFixed(targetRect);
      return;
    }

    const dx=targetRect.left-from.left;
    const dy=targetRect.top-from.top;
    const sx=targetRect.width/Math.max(1,from.width);
    const sy=targetRect.height/Math.max(1,from.height);
    const token=++this.travelToken;

    const animation=this.stage.animate([
      {transformOrigin:'0 0',transform:'translate3d(0,0,0) scale(1,1)',filter:'brightness(1)'},
      {transformOrigin:'0 0',transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,filter:'brightness(1.035)'}
    ],{
      duration:opening?620:600,
      easing:opening?'cubic-bezier(.16,.82,.22,1)':'cubic-bezier(.32,.72,.18,1)',
      fill:'both'
    });

    this.travel=animation;

    try{await animation.finished;}catch{}
    if(token!==this.travelToken||this.travel!==animation)return;

    const finalRect=rectCopy(this.stage.getBoundingClientRect());
    this.travel=null;
    try{animation.cancel();}catch{}
    this.placeFixed(finalRect);
  }

  async open(){
    if(this.targetOpen&&['opening','open'].includes(this.state))return;

    if(!this.home.classList.contains('active')){
      this.pendingRoute='home';
      await this.go('home');
      this.pendingRoute=null;
    }

    this.saveHomeRect();
    if(!this.homeRect)return;

    this.root.classList.add('is-visible');
    this.root.classList.remove('is-closing');
    this.root.setAttribute('aria-hidden','false');
    this.openRect=rectCopy(this.slot.getBoundingClientRect());

    this.setButton(true);
    this.publish('opening',true,'open');

    await new Promise(resolve=>requestAnimationFrame(resolve));
    this.root.classList.add('is-open');

    await this.travelTo(this.openRect,{opening:true});
    if(!this.targetOpen)return;

    setFixedRect(this.stage,this.openRect);
    this.publish('open',true,'settled-open');
    try{this.orb.focus({preventScroll:true});}catch{}
  }

  async close({restoreFocus=false}={}){
    if(!this.targetOpen&&this.state==='closed')return;

    if(!this.homeRect){
      if(this.stage.parentNode===this.homeParent)this.saveHomeRect();
      if(!this.homeRect)return this.snapClosed();
    }

    this.setButton(false);
    this.publish('closing',false,'close');

    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing');

    if(!reduced())await new Promise(resolve=>setTimeout(resolve,55));

    await this.travelTo(this.homeRect,{opening:false});
    if(this.targetOpen)return;

    this.placeHome();
    this.root.classList.remove('is-visible','is-closing');
    this.root.setAttribute('aria-hidden','true');
    this.publish('closed',false,'settled-closed');

    if(restoreFocus){
      try{this.menuButton.focus({preventScroll:true});}catch{}
    }
  }

  snapClosed(){
    this.targetOpen=false;
    this.travelToken+=1;
    try{this.travel?.cancel?.();}catch{}
    this.travel=null;
    this.placeHome();
    this.root.classList.remove('is-visible','is-open','is-closing');
    this.root.setAttribute('aria-hidden','true');
    this.setButton(false);
    this.publish('closed',false,'route-snap');
  }

  syncRoute(route){
    const id=String(route||'home');
    this.buttons.forEach(button=>{
      const current=button.dataset.go===id;
      button.classList.toggle('is-current',current);
      if(current)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      state:this.state,
      routingAuthority:'V210-routes-only',
      visualAuthority:'V338-only',
      orbEngine:'V208',
      samePhysicalOrb:true,
      legacyMenuButtonTransitionBlocked:true,
      noLegacyFlip:true,
      tarotLabel:'Tarot Livre',
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.snapClosed();
    this.anchor.remove();
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.html.dataset.menuMotionAuthority;
  }
}

export function installMenuOneMotionV338(options={}){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuOneMotionV338(options);
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV338=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-one-motion-ready',{
    detail:Object.freeze({release:RELEASE,visualAuthority:'v338',legacyFlip:false})
  }));
  return instance;
}
