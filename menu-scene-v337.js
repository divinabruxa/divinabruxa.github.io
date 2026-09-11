/* DIVINA BRUXA 2.0 — REBIRTH R037 · MENU FLUID CORE V337
   Uma única animação física para a MESMA Orbe V208:
   Home -> Menu, Menu -> Home e reversão no meio do gesto.
   Navigation V210 continua sendo o único roteador/motor de estados. */

const RELEASE='V337';
const ROOT_ID='menuSceneV337';
const STYLE_ID='menuSceneV337Styles';
const INSTANCE=Symbol.for('divina.menu.scene.v337');

const VISIBLE_STATES=new Set(['opening','open','reversing','closing','navigating']);

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

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./menu-scene-v337.css?v=337';
  document.head.append(link);
}

function portal([route,sigil,label,angle],zone,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`ms337-portal ms337-portal--${zone}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(Number.isFinite(angle))button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`<span class="ms337-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return button;
}

function createScene(){
  const scene=document.createElement('nav');
  scene.id=ROOT_ID;
  scene.className='menu-scene-v337';
  scene.dataset.menuMotionRoot='v337';
  scene.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  scene.setAttribute('aria-hidden','true');
  scene.innerHTML=`
    <span class="ms337-nebula" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </span>
    <div class="ms337-upper" data-upper></div>
    <div class="ms337-orbit" aria-hidden="true">
      <i class="ms337-orbit__outer"></i>
      <i class="ms337-orbit__inner"></i>
      <b class="ms337-comet"></b>
    </div>
    <div class="ms337-primary" data-primary></div>
    <div class="ms337-orb-slot" data-orb-slot aria-label="Orbe central do menu"></div>
    <div class="ms337-lower" data-lower></div>`;
  PRIMARY.forEach((item,index)=>scene.querySelector('[data-primary]').append(portal(item,'primary',index)));
  UPPER.forEach((item,index)=>scene.querySelector('[data-upper]').append(portal(item,'secondary',index)));
  LOWER.forEach((item,index)=>scene.querySelector('[data-lower]').append(portal(item,'secondary',index+4)));
  return scene;
}

function setInert(element,value){
  if(!element)return;
  try{element.inert=value;}catch{}
  if(value)element.setAttribute('inert','');
  else element.removeAttribute('inert');
}

function homeTargetRect(){
  const width=window.innerWidth;
  const height=window.innerHeight;
  const portrait=height>=width;
  let size;

  if(!portrait && height<=560){
    size=Math.min(height*.43,330);
  }else if(width<=430 && portrait){
    size=Math.min(width*.88,height*.45,420);
  }else{
    size=Math.min(width*.89,height*.47,470);
  }

  return Object.freeze({
    left:(width-size)/2,
    top:(height-size)/2,
    width:size,
    height:size,
    right:(width+size)/2,
    bottom:(height+size)/2
  });
}

function fixedRect(element,rect){
  const style=element.style;
  style.setProperty('position','fixed','important');
  style.setProperty('left',`${rect.left}px`,'important');
  style.setProperty('top',`${rect.top}px`,'important');
  style.setProperty('right','auto','important');
  style.setProperty('bottom','auto','important');
  style.setProperty('inset','auto','important');
  style.setProperty('width',`${rect.width}px`,'important');
  style.setProperty('height',`${rect.height}px`,'important');
  style.setProperty('margin','0','important');
  style.setProperty('transform','none','important');
  style.setProperty('transform-origin','0 0','important');
  style.setProperty('z-index','55','important');
  style.setProperty('display','grid','important');
  style.setProperty('place-items','center','important');
  style.setProperty('pointer-events','auto','important');
}

export class MenuSceneV337{
  constructor(){
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.stage=this.home?.querySelector('.orb-stage-ref');
    this.orb=this.stage?.querySelector('#orb')||document.querySelector('#orb');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');
    this.brand=document.querySelector('.app-header .brand');
    this.abort=new AbortController();

    this.state=String(this.html.dataset.menuState||'closed').toLowerCase();
    this.stageHomeParent=this.stage?.parentNode||null;
    this.stageHomeNext=this.stage?.nextSibling||null;
    this.stageInline=this.stage?.getAttribute('style');
    this.nativeAnimate=this.stage?.animate?.bind(this.stage)||null;

    this.root=null;
    this.slot=null;
    this.buttons=[];
    this.snapshots=[];
    this.travel=null;
    this.travelToken=0;
    this.targetOpen=false;

    if(!this.home||!this.legacy||!this.stage||!this.orb||!this.menuButton||!this.nativeAnimate){
      throw new Error('Estrutura essencial da Home/Orbe não encontrada.');
    }

    for(const key of ['divinaMenuV336','divinaMenuV335','divinaMenuV334','divinaMenuV333','divinaMenuV332','divinaMenuV329']){
      try{globalThis[key]?.destroy?.();}catch{}
    }
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;

    ['menuSceneV336','menuSceneV335','menuCelestialV334','menuFluidV333','menuRebornV332','menuRebornV329']
      .forEach(id=>document.getElementById(id)?.remove());

    installStyle();
    this.root=createScene();
    document.body.append(this.root);
    this.slot=this.root.querySelector('[data-orb-slot]');
    this.buttons=[...this.root.querySelectorAll('[data-go]')];

    this.legacy.dataset.menuVisualAuthority='v337-compat';
    this.html.dataset.menuReborn='v337';
    this.html.dataset.menuMotionAuthority='v337';

    this.bind();
    this.syncRoute(routeNow());
    this.syncState(this.state,this.state==='open'||this.state==='opening');
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:menu-state',event=>{
      this.syncState(
        String(event.detail?.state||'closed').toLowerCase(),
        Boolean(event.detail?.targetOpen)
      );
    },{signal});

    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    this.root.addEventListener('pointerdown',event=>{
      const button=event.target.closest('.ms337-portal');
      if(!button)return;
      button.classList.add('is-touching');
      const clear=()=>button.classList.remove('is-touching');
      button.addEventListener('pointerup',clear,{once:true});
      button.addEventListener('pointercancel',clear,{once:true});
      setTimeout(clear,440);
    },{passive:true,signal});

    document.addEventListener('keydown',event=>this.handleKeys(event),{capture:true,signal});
    document.addEventListener('focusin',event=>this.guardFocus(event),{capture:true,signal});
    document.addEventListener('pointerdown',event=>this.shield(event),{capture:true,signal});
  }

  restoreInline(){
    if(this.stageInline==null)this.stage.removeAttribute('style');
    else this.stage.setAttribute('style',this.stageInline);
  }

  appendHome(){
    if(this.stageHomeNext?.parentNode===this.stageHomeParent){
      this.stageHomeParent.insertBefore(this.stage,this.stageHomeNext);
    }else{
      this.stageHomeParent.append(this.stage);
    }
    this.restoreInline();
    delete this.stage.dataset.menuScene;
    delete this.orb.dataset.menuScene;
  }

  appendSlot(){
    this.slot.append(this.stage);
    this.restoreInline();
    this.stage.dataset.menuScene='v337';
    this.orb.dataset.menuScene='v337';
  }

  freezeTravel(){
    if(!this.travel)return this.stage.getBoundingClientRect();

    const rect=this.stage.getBoundingClientRect();
    const animation=this.travel;
    this.travelToken+=1;
    this.travel=null;

    try{
      const nativeCancel=animation.__nativeCancel||animation.cancel.bind(animation);
      nativeCancel();
    }catch{}

    document.body.append(this.stage);
    this.restoreInline();
    delete this.stage.dataset.menuScene;
    delete this.orb.dataset.menuScene;
    fixedRect(this.stage,rect);
    this.stage.animate=this.nativeAnimate;
    return rect;
  }

  targetRect(open){
    if(open){
      // Scene always has layout even at opacity 0.
      const rect=this.slot.getBoundingClientRect();
      return {
        left:rect.left,top:rect.top,width:rect.width,height:rect.height,
        right:rect.right,bottom:rect.bottom
      };
    }
    return homeTargetRect();
  }

  beginTravel(open){
    this.targetOpen=open;

    const from=this.freezeTravel();
    const to=this.targetRect(open);

    // Put the real Orb above both scenes while it moves.
    document.body.append(this.stage);
    this.restoreInline();
    delete this.stage.dataset.menuScene;
    delete this.orb.dataset.menuScene;
    fixedRect(this.stage,from);

    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      open?this.appendSlot():this.appendHome();
      return null;
    }

    const dx=to.left-from.left;
    const dy=to.top-from.top;
    const sx=Math.max(.01,to.width/Math.max(1,from.width));
    const sy=Math.max(.01,to.height/Math.max(1,from.height));
    const token=++this.travelToken;

    const animation=this.nativeAnimate([
      {
        transformOrigin:'0 0',
        transform:'translate3d(0,0,0) scale(1,1)',
        filter:'brightness(1)'
      },
      {
        transformOrigin:'0 0',
        transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,
        filter:'brightness(1.035)'
      }
    ],{
      duration:open?620:580,
      easing:open?'cubic-bezier(.16,.82,.22,1)':'cubic-bezier(.32,.72,.18,1)',
      fill:'both'
    });

    this.travel=animation;

    // V210 chamará orbStage.animate() no frame seguinte.
    // Devolvemos a MESMA animação, eliminando uma segunda transformação concorrente.
    const nativeCancel=animation.cancel.bind(animation);
    animation.__nativeCancel=nativeCancel;
    animation.cancel=()=>{
      if(this.travel!==animation){
        try{nativeCancel();}catch{}
        return;
      }
      const current=this.stage.getBoundingClientRect();
      try{nativeCancel();}catch{}
      document.body.append(this.stage);
      this.restoreInline();
      fixedRect(this.stage,current);
      this.travel=null;
    };

    this.stage.animate=(...args)=>{
      if(this.travel===animation && ['running','pending','paused'].includes(animation.playState)){
        return animation;
      }
      return this.nativeAnimate(...args);
    };

    animation.finished.then(()=>{
      if(token!==this.travelToken||this.travel!==animation)return;
      this.travel=null;
      try{nativeCancel();}catch{}
      this.stage.animate=this.nativeAnimate;
      open?this.appendSlot():this.appendHome();
    }).catch(()=>{});

    return animation;
  }

  syncState(state,targetOpen=false){
    this.state=state;

    const visible=VISIBLE_STATES.has(state);
    const opening=state==='opening'||(state==='reversing'&&targetOpen);
    const closing=state==='closing'||state==='navigating'||(state==='reversing'&&!targetOpen);

    const wasVisible=this.root.classList.contains('is-visible');

    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',state==='open'||opening);
    this.root.classList.toggle('is-closing',closing);
    this.root.setAttribute('aria-hidden',String(!visible));

    // Root classes first: slot and portals are already at their final geometry when measured.
    if(opening)this.beginTravel(true);
    else if(closing)this.beginTravel(false);
    else if(state==='open'&&!this.travel&&this.stage.parentNode!==this.slot)this.appendSlot();
    else if(state==='closed'&&!this.travel&&this.stage.parentNode!==this.stageHomeParent)this.appendHome();

    if(visible&&!wasVisible)this.lockBackground();
    if(opening&&!wasVisible)requestAnimationFrame(()=>this.focusEntry());
    if(!visible||state==='closed')this.unlockBackground();

    this.html.dataset.menuVisualState=state;
  }

  lockBackground(){
    if(this.snapshots.length)return;
    if(this.brand){
      this.snapshots.push({
        element:this.brand,
        hadAria:this.brand.hasAttribute('aria-hidden'),
        aria:this.brand.getAttribute('aria-hidden'),
        hadInert:this.brand.hasAttribute('inert')
      });
      this.brand.setAttribute('aria-hidden','true');
      setInert(this.brand,true);
    }
    setInert(this.orb,false);
    setInert(this.root,false);
    this.orb.removeAttribute('aria-hidden');
    this.html.dataset.menuModal='v337';
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
      const current=button.dataset.go===id;
      button.classList.toggle('is-current',current);
      if(current)button.setAttribute('aria-current','page');
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
    if(!this.root.classList.contains('is-open'))return;

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
    if(target===this.menuButton||this.stage.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
    queueMicrotask(()=>this.focusEntry());
  }

  shield(event){
    if(!this.root.classList.contains('is-open'))return;
    const target=event.target;
    if(!(target instanceof Node))return;
    if(this.menuButton.contains(target)||this.stage.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      state:this.state,
      routingAuthority:'V210',
      orbEngine:'V208',
      singleOrbAnimation:true,
      reversibleMidFlight:true,
      tarotLabel:'Tarot Livre',
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.freezeTravel();
    this.appendHome();
    this.unlockBackground();
    this.stage.animate=this.nativeAnimate;
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.html.dataset.menuMotionAuthority;
    delete this.html.dataset.menuVisualState;
  }
}

export function installMenuSceneV337(){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuSceneV337();
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV337=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-scene-ready',{
    detail:Object.freeze({
      release:RELEASE,
      singleOrbAnimation:true,
      reversibleMidFlight:true,
      tarotLabel:'Tarot Livre'
    })
  }));
  return instance;
}
