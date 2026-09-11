/* DIVINA BRUXA 2.0 — REBIRTH R036 · MENU SCENE V336
   Mantém a abertura V335 aprovada e substitui o fechamento por uma volta contínua.
   Navigation V210 continua sendo a única autoridade de estado/rotas.
   A MESMA Orbe V208 é usada o tempo inteiro. */

const RELEASE='V336';
const ROOT_ID='menuSceneV336';
const STYLE_ID='menuSceneV336Styles';
const INSTANCE=Symbol.for('divina.menu.scene.v336');

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
  link.href='./menu-scene-v336.css?v=336';
  document.head.append(link);
}

function portal([route,sigil,label,angle],zone,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`ms336-portal ms336-portal--${zone}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(Number.isFinite(angle))button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`
    <span class="ms336-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span>
    <small>${label}</small>`;
  return button;
}

function createScene(){
  const scene=document.createElement('nav');
  scene.id=ROOT_ID;
  scene.className='menu-scene-v336';
  scene.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  scene.setAttribute('aria-hidden','true');
  scene.innerHTML=`
    <span class="ms336-nebula" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </span>
    <div class="ms336-upper" data-upper></div>
    <div class="ms336-orbit" aria-hidden="true">
      <i class="ms336-orbit__outer"></i>
      <i class="ms336-orbit__inner"></i>
      <b class="ms336-comet"></b>
    </div>
    <div class="ms336-primary" data-primary></div>
    <div class="ms336-orb-slot" data-orb-slot aria-label="Orbe central do menu"></div>
    <div class="ms336-lower" data-lower></div>`;
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

export class MenuSceneV336{
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
    this.snapshots=[];
    this.stageHomeParent=this.stage?.parentNode||null;
    this.stageHomeNext=this.stage?.nextSibling||null;
    this.homeRect=null;
    this.closeAnimation=null;
    this.homeGateAnimation=null;
    this.originalStageAnimate=this.stage?.animate?.bind(this.stage)||null;
    this.animateRestoreFrame=0;
    this.open=false;

    if(!this.home||!this.legacy||!this.stage||!this.orb||!this.menuButton){
      throw new Error('Estrutura essencial da Home/Orbe não encontrada.');
    }

    for(const key of ['divinaMenuV335','divinaMenuV334','divinaMenuV333','divinaMenuV332','divinaMenuV329']){
      try{globalThis[key]?.destroy?.();}catch{}
    }
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;

    ['menuSceneV335','menuCelestialV334','menuFluidV333','menuRebornV332','menuRebornV329']
      .forEach(id=>document.getElementById(id)?.remove());

    installStyle();
    this.root=createScene();
    document.body.append(this.root);
    this.slot=this.root.querySelector('[data-orb-slot]');
    this.buttons=[...this.root.querySelectorAll('[data-go]')];
    this.legacy.dataset.menuVisualAuthority='v336-compat';
    this.html.dataset.menuReborn='v336';

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
      const button=event.target.closest('.ms336-portal');
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

  stageIsInScene(){
    return this.stage.parentNode===this.slot;
  }

  rememberHomeRect(){
    if(this.stageIsInScene())return this.homeRect;
    const rect=this.stage.getBoundingClientRect();
    if(rect.width>1&&rect.height>1){
      this.homeRect={
        left:rect.left,top:rect.top,width:rect.width,height:rect.height,
        right:rect.right,bottom:rect.bottom
      };
    }
    return this.homeRect;
  }

  moveStageToScene(){
    if(this.stageIsInScene())return;
    this.rememberHomeRect();
    this.slot.append(this.stage);
    this.stage.dataset.menuScene='v336';
    this.orb.dataset.menuScene='v336';
  }

  restoreStageHome(){
    if(!this.stageIsInScene())return;
    if(this.stageHomeNext?.parentNode===this.stageHomeParent){
      this.stageHomeParent.insertBefore(this.stage,this.stageHomeNext);
    }else{
      this.stageHomeParent.append(this.stage);
    }
    delete this.stage.dataset.menuScene;
    delete this.orb.dataset.menuScene;
  }

  cancelCloseMotion(){
    cancelAnimationFrame(this.animateRestoreFrame);
    this.animateRestoreFrame=0;
    try{this.closeAnimation?.cancel?.();}catch{}
    try{this.homeGateAnimation?.cancel?.();}catch{}
    this.closeAnimation=null;
    this.homeGateAnimation=null;
    if(this.originalStageAnimate)this.stage.animate=this.originalStageAnimate;
  }

  startCloseMotion(){
    if(!this.stageIsInScene()){
      this.restoreStageHome();
      return;
    }

    this.cancelCloseMotion();

    const from=this.stage.getBoundingClientRect();
    const target=this.homeRect;
    if(!target||!from.width||!from.height||matchMedia('(prefers-reduced-motion: reduce)').matches){
      this.restoreStageHome();
      return;
    }

    const dx=target.left-from.left;
    const dy=target.top-from.top;
    const sx=Math.max(.01,target.width/from.width);
    const sy=Math.max(.01,target.height/from.height);

    const animation=this.originalStageAnimate([
      {
        transformOrigin:'0 0',
        transform:'translate3d(0,0,0) scale(1,1)',
        filter:'brightness(1)'
      },
      {
        transformOrigin:'0 0',
        transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,
        filter:'brightness(1.04)'
      }
    ],{
      duration:580,
      easing:'cubic-bezier(.32,.72,.18,1)',
      fill:'both'
    });

    this.closeAnimation=animation;

    // Faz o V210 reutilizar ESTA MESMA animação quando tentar executar o FLIP legado.
    // Assim não há duas transforms concorrendo no fechamento.
    this.stage.animate=(...args)=>{
      if(this.closeAnimation&&['running','pending'].includes(this.closeAnimation.playState)){
        return this.closeAnimation;
      }
      return this.originalStageAnimate(...args);
    };

    // V210 observa animações finitas da Home. Este gate mantém o estado CLOSING
    // até a Orbe terminar sua viagem real de volta.
    if(this.home?.animate){
      this.homeGateAnimation=this.home.animate(
        [{opacity:1},{opacity:1}],
        {duration:590,easing:'linear'}
      );
    }

    animation.finished.then(()=>{
      try{animation.cancel();}catch{}
      this.closeAnimation=null;
      this.restoreStageHome();
      this.stage.animate=this.originalStageAnimate;
    }).catch(()=>{
      this.restoreStageHome();
      this.stage.animate=this.originalStageAnimate;
    });

    // V210 chama glideOrbStage no próximo frame; restauramos o método depois que
    // ele já capturou nossa animação, sem manter monkey-patch persistente.
    this.animateRestoreFrame=requestAnimationFrame(()=>{
      this.animateRestoreFrame=requestAnimationFrame(()=>{
        if(this.originalStageAnimate)this.stage.animate=this.originalStageAnimate;
      });
    });
  }

  syncState(state,targetOpen=false){
    this.state=state;
    const visible=VISIBLE_STATES.has(state);
    const opening=state==='opening'||state==='open'||(state==='reversing'&&targetOpen);
    const closing=state==='closing'||state==='navigating'||(state==='reversing'&&!targetOpen);
    const wasVisible=this.root.classList.contains('is-visible');

    if(opening){
      this.cancelCloseMotion();
      this.moveStageToScene();
    }else if(closing){
      this.startCloseMotion();
    }else if(state==='closed'){
      this.cancelCloseMotion();
      this.restoreStageHome();
    }

    this.open=opening;
    this.root.dataset.state=state;
    this.root.classList.toggle('is-visible',visible);
    this.root.classList.toggle('is-open',opening);
    this.root.classList.toggle('is-closing',closing);
    this.root.setAttribute('aria-hidden',String(!visible));

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
    setInert(this.stage,false);
    setInert(this.orb,false);
    setInert(this.root,false);
    this.orb.removeAttribute('aria-hidden');
    this.html.dataset.menuModal='v336';
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
    if(!this.open)return;
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
    if(!this.open)return;
    const target=event.target;
    if(target===this.menuButton||this.stage.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
    queueMicrotask(()=>this.focusEntry());
  }

  shield(event){
    if(!this.open)return;
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
      opening:'V335-approved',
      closing:'single-return-animation',
      sameOrb:true,
      tarotLabel:'Tarot Livre',
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.cancelCloseMotion();
    this.restoreStageHome();
    this.unlockBackground();
    this.root?.remove();
    delete this.html.dataset.menuReborn;
    delete this.html.dataset.menuVisualState;
  }
}

export function installMenuSceneV336(){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuSceneV336();
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV336=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-scene-ready',{
    detail:Object.freeze({
      release:RELEASE,
      routingAuthority:'V210',
      sameOrb:true,
      fluidClose:true,
      tarotLabel:'Tarot Livre'
    })
  }));
  return instance;
}
