/* DIVINA BRUXA 2.0 — REBIRTH R039 · MENU ORB VISIBLE V339
   O vídeo V338 mostrou: a fluidez melhorou, mas a Orbe desapareceu quando o stage saiu da Home.
   V339 nunca reparenta a Orbe. A mesma V208 permanece dentro da Home.
   Uma única Animation de translate+scale é tocada para frente e ao contrário.
   Navigation V210 continua sendo usado SOMENTE para rotas. */

const RELEASE='V339';
const ROOT_ID='menuOrbVisibleV339';
const STYLE_ID='menuOrbVisibleV339Styles';
const INSTANCE=Symbol.for('divina.menu.orb.visible.v339');

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
  link.href='./menu-orb-visible-v339.css?v=339';
  document.head.append(link);
}

function portal([route,sigil,label,angle],zone,index){
  const button=document.createElement('button');
  button.type='button';
  button.className=`mov339-portal mov339-portal--${zone}`;
  button.dataset.go=route;
  button.dataset.index=String(index);
  button.style.setProperty('--i',String(index));
  if(Number.isFinite(angle))button.style.setProperty('--angle',`${angle}deg`);
  button.setAttribute('aria-label',label==='Whit'?'Whit · Orbe IA':label);
  button.innerHTML=`<span class="mov339-jewel" aria-hidden="true"><i>${sigil}</i><em></em></span><small>${label}</small>`;
  return button;
}

function createScene(){
  const root=document.createElement('nav');
  root.id=ROOT_ID;
  root.className='menu-orb-visible-v339';
  root.setAttribute('aria-label','Menu Mágico da Divina Bruxa');
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`
    <span class="mov339-nebula" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="mov339-upper" data-upper></div>
    <div class="mov339-orbit" aria-hidden="true"><i></i><i></i><b></b></div>
    <div class="mov339-primary" data-primary></div>
    <div class="mov339-orb-target" data-orb-target aria-hidden="true"></div>
    <div class="mov339-lower" data-lower></div>`;
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

export class MenuOrbVisibleV339{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.html=document.documentElement;
    this.home=document.querySelector('#home');
    this.legacy=document.querySelector('#orbMenu');
    this.menuButton=document.querySelector('#menuBtn');
    this.dock=document.querySelector('.magic-dock');

    for(const key of ['divinaMenuV338','divinaMenuV337','divinaMenuV336','divinaMenuV335','divinaMenuV334','divinaMenuV333','divinaMenuV332','divinaMenuV329']){
      try{globalThis[key]?.destroy?.();}catch{}
    }
    try{globalThis.divinaMenuA11yV327?.destroy?.();}catch{}
    try{globalThis.divinaMenuA11yV211?.destroy?.();}catch{}
    delete globalThis.divinaMenuA11yV327;
    delete globalThis.divinaMenuA11yV211;

    ['menuOneMotionV338','menuSceneV337','menuSceneV336','menuSceneV335','menuCelestialV334','menuFluidV333','menuRebornV332','menuRebornV329']
      .forEach(id=>document.getElementById(id)?.remove());

    this.stage=this.home?.querySelector('.orb-stage-ref');
    this.orb=this.stage?.querySelector('#orb');
    if(!this.home||!this.legacy||!this.menuButton||!this.stage||!this.orb||!this.go){
      throw new Error('Estrutura essencial do Menu não encontrada.');
    }

    this.abort=new AbortController();
    this.state='closed';
    this.targetOpen=false;
    this.animation=null;
    this.animationToken=0;
    this.pendingRoute=null;
    this.homeRect=null;
    this.menuRect=null;

    installStyle();
    this.root=createScene();
    document.body.append(this.root);
    this.target=this.root.querySelector('[data-orb-target]');
    this.buttons=[...this.root.querySelectorAll('[data-go]')];

    this.legacy.dataset.menuVisualAuthority='v339-compat';
    this.legacy.setAttribute('aria-hidden','true');
    this.html.dataset.menuReborn='v339';
    this.html.dataset.menuMotionAuthority='v339';
    this.home.dataset.menuScene='v339';

    this.bind();
    this.syncRoute(routeNow());
    this.publish('closed',false,'install');
  }

  bind(){
    const signal=this.abort.signal;

    // Bloqueia o click antigo do V210: ele continua existindo só como roteador.
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

    // Portais fecham a cena e só depois pedem a rota ao V210.
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
      const portal=event.target.closest('.mov339-portal');
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
      // O centro fica livre para a MESMA Orbe real receber gestos.
      if(this.menuButton.contains(target)||this.orb.contains(target)||this.root.contains(target)||this.dock?.contains(target))return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },{capture:true,signal});

    document.addEventListener('divina:route-ready',event=>this.syncRoute(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.syncRoute(event.detail.id);
    },{signal});

    // Uma rota externa não deixa a cena presa.
    document.addEventListener('divina:route-start',()=>{
      if(this.state!=='closed'&&!this.pendingRoute)this.snapClosed();
    },{signal});

    addEventListener('resize',()=>{
      if(this.state==='open'){
        this.rebuildAnimation({snap:'open'});
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
      detail:Object.freeze({previous,state,targetOpen,reason,authority:'v339'})
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
    const h=this.stage.getBoundingClientRect();
    const m=this.target.getBoundingClientRect();
    if(h.width<2||h.height<2||m.width<2||m.height<2)return false;
    this.homeRect=rectCopy(h);
    this.menuRect=rectCopy(m);
    return true;
  }

  effectKeyframes(){
    const h=this.homeRect;
    const m=this.menuRect;
    const hc={x:h.left+h.width/2,y:h.top+h.height/2};
    const mc={x:m.left+m.width/2,y:m.top+m.height/2};
    const dx=mc.x-hc.x;
    const dy=mc.y-hc.y;
    const sx=m.width/h.width;
    const sy=m.height/h.height;

    return [
      {translate:'0px 0px',scale:'1 1',filter:'brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))'},
      {translate:`${dx}px ${dy}px`,scale:`${sx} ${sy}`,filter:'brightness(1.04) drop-shadow(0 0 18px rgba(164,65,255,.20))'}
    ];
  }

  rebuildAnimation({snap='closed'}={}){
    try{this.animation?.cancel?.();}catch{}
    this.animation=null;
    this.stage.style.removeProperty('translate');
    this.stage.style.removeProperty('scale');
    this.stage.style.removeProperty('filter');

    if(!this.measure())return false;
    if(reduced())return true;

    const animation=this.stage.animate(this.effectKeyframes(),{
      duration:660,
      easing:'cubic-bezier(.65,0,.35,1)',
      fill:'both'
    });
    animation.pause();
    animation.currentTime=snap==='open'?660:0;
    this.animation=animation;
    return true;
  }

  async run(open){
    if(!this.animation){
      if(!this.rebuildAnimation({snap:this.state==='open'?'open':'closed'}))return;
    }

    const animation=this.animation;
    const token=++this.animationToken;

    if(reduced()){
      animation.currentTime=open?660:0;
      return;
    }

    if(open){
      animation.playbackRate=1;
      if((animation.currentTime??0)>=659)animation.currentTime=0;
      animation.play();
    }else{
      if((animation.currentTime??0)<=1)animation.currentTime=660;
      animation.playbackRate=-1;
      animation.play();
    }

    try{await animation.finished;}catch{}
    if(token!==this.animationToken||this.animation!==animation)return;
    animation.pause();
    animation.currentTime=open?660:0;
  }

  async open(){
    if(this.targetOpen&&['opening','open'].includes(this.state))return;

    if(!this.home.classList.contains('active')){
      this.pendingRoute='home';
      await this.go('home');
      this.pendingRoute=null;
    }

    // Home geometry is measured while the stage is still completely untouched.
    if(!this.rebuildAnimation({snap:'closed'}))return;

    this.root.classList.add('is-visible');
    this.root.classList.remove('is-closing');
    this.root.setAttribute('aria-hidden','false');
    this.setButton(true);
    this.publish('opening',true,'open');

    await new Promise(resolve=>requestAnimationFrame(resolve));
    this.root.classList.add('is-open');

    await this.run(true);
    if(!this.targetOpen)return;

    this.publish('open',true,'settled-open');
    try{this.orb.focus({preventScroll:true});}catch{}
  }

  async close({restoreFocus=false}={}){
    if(!this.targetOpen&&this.state==='closed')return;

    this.setButton(false);
    this.publish('closing',false,'close');

    // A cena permanece viva durante TODA a volta da Orbe.
    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing');

    await this.run(false);
    if(this.targetOpen)return;

    // Agora a Orbe já está exatamente em 0/1 (geometria Home), sem reparent.
    this.root.classList.remove('is-visible','is-closing');
    this.root.setAttribute('aria-hidden','true');
    this.publish('closed',false,'settled-closed');

    if(restoreFocus){
      try{this.menuButton.focus({preventScroll:true});}catch{}
    }
  }

  snapClosed(){
    this.targetOpen=false;
    this.animationToken+=1;
    if(this.animation){
      try{this.animation.pause();this.animation.currentTime=0;}catch{}
    }
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
      visualAuthority:'V339-only',
      orbEngine:'V208',
      samePhysicalOrb:true,
      stageRemainsInsideHome:true,
      reversibleSingleAnimation:true,
      menuOrbVisible:true,
      tarotLabel:'Tarot Livre',
      notificationLabel:'Notificações',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.animationToken+=1;
    try{this.animation?.cancel?.();}catch{}
    this.stage.style.removeProperty('translate');
    this.stage.style.removeProperty('scale');
    this.stage.style.removeProperty('filter');
    this.root?.remove();
    delete this.home.dataset.menuScene;
    delete this.html.dataset.menuReborn;
    delete this.html.dataset.menuMotionAuthority;
  }
}

export function installMenuOrbVisibleV339(options={}){
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  const instance=new MenuOrbVisibleV339(options);
  globalThis[INSTANCE]=instance;
  globalThis.divinaMenuV339=instance;
  document.dispatchEvent(new CustomEvent('divina:menu-orb-visible-ready',{
    detail:Object.freeze({
      release:RELEASE,
      stageRemainsInsideHome:true,
      reversibleSingleAnimation:true,
      menuOrbVisible:true
    })
  }));
  return instance;
}
