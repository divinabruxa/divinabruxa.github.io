/* DIVINA BRUXA 2.0 — REBIRTH R040 · MENU ORB LOCK V340
   Evidência do vídeo: a Orbe chegava pequena, mas voltava a crescer quando a WAAPI finalizava no Safari.
   V340 não depende mais de fill/pause da Web Animation.
   A MESMA Orbe V208 permanece na Home e usa translate + scale persistentes com transition CSS reversível.
   Navigation V210 continua sendo usado apenas para rotas. */

const RELEASE='V340';
const ROOT_ID='menuOrbLockV340';
const STYLE_ID='menuOrbLockV340Styles';
const INSTANCE=Symbol.for('divina.menu.orb.lock.v340');
const MOTION_MS=660;

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
  link.href='./menu-orb-lock-v340.css?v=340';
  document.head.append(link);
}

function portal([route,sigil,label,angle],zone,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`mol340-portal mol340-portal--${zone}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(Number.isFinite(angle))button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`<span class="mol340-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return button;
}

function createScene(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-orb-lock-v340';
  root.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="mol340-nebula" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="mol340-upper" data-upper></div>
    <div class="mol340-orbit" aria-hidden="true"><i></i><i></i><b></b></div>
    <div class="mol340-primary" data-primary></div>
    <div class="mol340-orb-target" data-orb-target aria-hidden="true">
      <span class="mol340-aura"></span>
      <span class="mol340-dust"><i></i><i></i><i></i><i></i><i></i></span>
    </div>
    <div class="mol340-lower" data-lower></div>`;
  PRIMARY.forEach((item,index)=>root.querySelector('[data-primary]').append(portal(item,'primary',index)));
  UPPER.forEach((item,index)=>root.querySelector('[data-upper]').append(portal(item,'secondary',index)));
  LOWER.forEach((item,index)=>root.querySelector('[data-lower]').append(portal(item,'secondary',index+4)));
  return root;
}

function rectCopy(rect){
  return Object.freeze({
    left:rect.left,top:rect.top,width:rect.width,height:rect.height,
    right:rect.right,bottom:rect.bottom
  });
}

function waitTransition(element,duration=MOTION_MS+120){
  if(reduced())return Promise.resolve();
  return new Promise(resolve=>{
    let done=false;
    const finish=()=>{
      if(done)return;
      done=true;
      clearTimeout(timer);
      element.removeEventListener('transitionend',onEnd);
      resolve();
    };
    const onEnd=event=>{
      if(event.target!==element)return;
      if(event.propertyName==='scale'||event.propertyName==='translate')finish();
    };
    const timer=setTimeout(finish,duration);
    element.addEventListener('transitionend',onEnd);
  });
}

export class MenuOrbLockV340{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');

    for(const key of ['divinaMenuV339','divinaMenuV338','divinaMenuV337','divinaMenuV336','divinaMenuV335','divinaMenuV334','divinaMenuV333','divinaMenuV332','divinaMenuV329']){
      try{globalThis[key]?.destroy?.();}catch{}
    }
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;
    ['menuOrbVisibleV339','menuOneMotionV338','menuSceneV337','menuSceneV336','menuSceneV335','menuCelestialV334','menuFluidV333','menuRebornV332','menuRebornV329']
      .forEach(id=>document.getElementById(id)?.remove());

    this.stage=this.home?.querySelector('.orb-stage-ref');
    this.orb=this.stage?.querySelector('#orb');
    if(!this.home||!this.legacy||!this.menuButton||!this.stage||!this.orb||!this.go){
      throw new Error('Estrutura essencial do Menu não encontrada.');
    }

    this.abort=new AbortController();
    this.state='closed';
    this.targetOpen=false;
    this.pendingRoute=null;
    this.motionToken=0;
    this.homeRect=null;
    this.menuRect=null;

    installStyle();
    this.root=createScene();
    document.body.append(this.root);
    this.target=this.root.querySelector('[data-orb-target]');
    this.buttons=[...this.root.querySelectorAll('[data-go]')];

    this.legacy.dataset.menuVisualAuthority='v340-compat';
    this.legacy.setAttribute('aria-hidden','true');
    this.html.dataset.menuReborn='v340';
    this.html.dataset.menuMotionAuthority='v340';
    this.home.dataset.menuScene='v340';

    this.prepareStage();
    this.bind();
    this.syncRoute(routeNow());
    this.publish('closed',false,'install');
  }

  prepareStage(){
    const style=this.stage.style;
    style.setProperty('transition',
      `translate ${MOTION_MS}ms cubic-bezier(.65,0,.35,1), scale ${MOTION_MS}ms cubic-bezier(.65,0,.35,1), filter ${MOTION_MS}ms ease`,
      'important');
    style.setProperty('translate','0px 0px','important');
    style.setProperty('scale','1 1','important');
    style.setProperty('filter','brightness(1)','important');
    style.setProperty('will-change','translate, scale, filter','important');
    style.setProperty('transform-origin','50% 50%','important');
  }

  bind(){
    const signal=this.abort.signal;

    this.menuButton.addEventListener('click',event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      this.targetOpen?this.close({restoreFocus:true}):this.open();
    },{capture:true,signal});

    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape'||this.state==='closed')return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close({restoreFocus:true});
    },{capture:true,signal});

    this.root.addEventListener('click',event=>{
      const portal=event.target.closest('[data-go]');
      if(!portal)return;
      event.preventDefault();
      event.stopPropagation();
      const route=portal.dataset.go;
      this.pendingRoute=route;
      this.close().then(()=>this.go(route)).finally(()=>{this.pendingRoute=null;}).catch(()=>{this.pendingRoute=null;});
    },{signal});

    document.addEventListener('click',event=>{
      if(this.state==='closed')return;
      const target=event.target.closest('[data-go]');
      if(!target||this.root.contains(target))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const route=target.dataset.go;
      this.pendingRoute=route;
      this.close().then(()=>this.go(route)).finally(()=>{this.pendingRoute=null;}).catch(()=>{this.pendingRoute=null;});
    },{capture:true,signal});

    this.root.addEventListener('pointerdown',event=>{
      const portal=event.target.closest('.mol340-portal');
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
      if(this.menuButton.contains(target)||this.orb.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },{capture:true,signal});

    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    document.addEventListener('divina:route-start',()=>{
      if(this.state!=='closed'&&!this.pendingRoute)this.snapClosed();
    },{signal});

    addEventListener('resize',()=>{
      if(this.state==='open'){
        this.measure();
        this.applyOpenTransform({instant:true});
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
      detail:Object.freeze({previous,state,targetOpen,reason,authority:'v340'})
    }));
  }

  setButton(open){
    this.menuButton.classList.toggle('is-open',open);
    this.menuButton.setAttribute('aria-expanded',String(open));
    this.menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    const label=this.menuButton.querySelector('span');
    if(label)label.textContent=open?'FECHAR':'MENU';
  }

  measure(){
    // Stage remains in the Home at all times.
    const home=this.stage.getBoundingClientRect();
    const menu=this.target.getBoundingClientRect();
    if(home.width<2||home.height<2||menu.width<2||menu.height<2)return false;

    // When already transformed, derive the untransformed Home rect from the known CSS home size.
    // Closed measurement is authoritative; while open we keep the saved Home rect.
    if(this.state==='closed'||!this.homeRect)this.homeRect=rectCopy(home);
    this.menuRect=rectCopy(menu);
    return true;
  }

  transformValues(){
    const h=this.homeRect,m=this.menuRect;
    const hc={x:h.left+h.width/2,y:h.top+h.height/2};
    const mc={x:m.left+m.width/2,y:m.top+m.height/2};
    return Object.freeze({
      dx:mc.x-hc.x,
      dy:mc.y-hc.y,
      sx:m.width/h.width,
      sy:m.height/h.height
    });
  }

  applyOpenTransform({instant=false}={}){
    if(!this.homeRect||!this.menuRect)return;
    const {dx,dy,sx,sy}=this.transformValues();
    if(instant)this.stage.style.setProperty('transition','none','important');
    this.stage.style.setProperty('translate',`${dx}px ${dy}px`,'important');
    this.stage.style.setProperty('scale',`${sx} ${sy}`,'important');
    this.stage.style.setProperty('filter',
      'brightness(1.04) drop-shadow(0 0 20px rgba(164,65,255,.20)) drop-shadow(0 0 8px rgba(242,203,126,.08))',
      'important');
    if(instant){
      // force style commit then restore transition
      void this.stage.offsetWidth;
      this.prepareStage();
      this.stage.style.setProperty('translate',`${dx}px ${dy}px`,'important');
      this.stage.style.setProperty('scale',`${sx} ${sy}`,'important');
      this.stage.style.setProperty('filter',
        'brightness(1.04) drop-shadow(0 0 20px rgba(164,65,255,.20)) drop-shadow(0 0 8px rgba(242,203,126,.08))',
        'important');
    }
  }

  applyClosedTransform({instant=false}={}){
    if(instant)this.stage.style.setProperty('transition','none','important');
    this.stage.style.setProperty('translate','0px 0px','important');
    this.stage.style.setProperty('scale','1 1','important');
    this.stage.style.setProperty('filter','brightness(1)','important');
    if(instant){
      void this.stage.offsetWidth;
      this.prepareStage();
    }
  }

  async open(){
    if(this.targetOpen&&['opening','open'].includes(this.state))return;

    if(!this.home.classList.contains('active')){
      this.pendingRoute='home';
      await this.go('home');
      this.pendingRoute=null;
    }

    // In CLOSED state the stage is untransformed, so this is the real Home rect.
    this.homeRect=null;
    this.root.classList.add('is-visible');
    this.root.classList.remove('is-closing');
    this.root.setAttribute('aria-hidden','false');
    if(!this.measure())return;

    const token=++this.motionToken;
    this.setButton(true);
    this.publish('opening',true,'open');

    await new Promise(resolve=>requestAnimationFrame(resolve));
    this.root.classList.add('is-open');

    this.applyOpenTransform();
    await waitTransition(this.stage);

    if(token!==this.motionToken||!this.targetOpen)return;

    // CRITICAL: values remain inline. Safari cannot snap the Orb back to Home size.
    this.publish('open',true,'settled-open');
    try{this.orb.focus({preventScroll:true});}catch{}
  }

  async close({restoreFocus=false}={}){
    if(!this.targetOpen&&this.state==='closed')return;

    const token=++this.motionToken;
    this.setButton(false);
    this.publish('closing',false,'close');

    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing');

    // Constellation begins collapsing; the same persistent transform reverses.
    if(!reduced())await new Promise(resolve=>setTimeout(resolve,38));

    this.applyClosedTransform();
    await waitTransition(this.stage);

    if(token!==this.motionToken||this.targetOpen)return;

    this.root.classList.remove('is-visible','is-closing');
    this.root.setAttribute('aria-hidden','true');
    this.publish('closed',false,'settled-closed');

    if(restoreFocus){
      try{this.menuButton.focus({preventScroll:true});}catch{}
    }
  }

  snapClosed(){
    this.motionToken+=1;
    this.targetOpen=false;
    this.applyClosedTransform({instant:true});
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
      visualAuthority:'V340-only',
      orbEngine:'V208',
      samePhysicalOrb:true,
      stageRemainsInsideHome:true,
      openTransformPinnedInline:true,
      cssTransitionReversible:true,
      menuOrbVisible:true,
      orbPhysicalSizeStableWhileOpen:true,
      tarotLabel:'Tarot Livre',
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.motionToken+=1;
    this.applyClosedTransform({instant:true});
    this.stage.style.removeProperty('transition');
    this.stage.style.removeProperty('translate');
    this.stage.style.removeProperty('scale');
    this.stage.style.removeProperty('filter');
    this.stage.style.removeProperty('will-change');
    this.root?.remove();
    delete this.home.dataset.menuScene;
    delete this.html.dataset.menuReborn;
    delete this.html.dataset.menuMotionAuthority;
  }
}

export function installMenuOrbLockV340(options={}){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuOrbLockV340(options);
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV340=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-orb-lock-ready',{
    detail:Object.freeze({
      release:RELEASE,
      menuOrbVisible:true,
      openTransformPinnedInline:true,
      cssTransitionReversible:true
    })
  }));
  return instance;
}
