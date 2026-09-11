/* DIVINA BRUXA 2.0 — REBIRTH R032 · WHIT UNIVERSAL V332
   Home invisível. Em outros mundos: toque abre; segure/arraste reposiciona.
   Posição é preferência visual local e não sai do aparelho. */

const RELEASE='V332';
const ROOT_ID='whitUniversalV332';
const STYLE_ID='whitUniversalV332Styles';
const MARK=Symbol.for('divina.whit.universal.v332');
const STORAGE_KEY='divina.whit.position.v332';

const SAFE_ROUTES=new Set([
  'home','tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','music','videos','skins','subscriptions','login','notifications','admin'
]);

const copy=Object.freeze({
  tarot:'As cartas ficam livres. Eu entro quando você me chamar.',
  daily:'Observe primeiro. Depois a gente aprofunda juntas.',
  spreads:'Veja relações e possibilidades antes de procurar certeza.',
  library:'A Biblioteca está aberta. Uma carta por vez pode ser suficiente.',
  school:'Aprender Tarot é juntar símbolo, prática e experiência.',
  journal:'Seu Diário continua fechado até você escolher abrir uma entrada.',
  ai:'Aqui eu posso conversar com você por inteiro.',
  consultations:'Posso ajudar você a transformar sua dúvida em uma pergunta clara.',
  store:'Escolha ferramentas, não promessas.',
  music:'Às vezes uma pausa abre mais do que uma resposta.',
  videos:'Veja, sinta e questione.',
  skins:'A forma muda. Sua prática continua sua.',
  subscriptions:'Mais recursos não tornam uma leitura mais verdadeira.',
  login:'Sua Conta guarda continuidade, não a sua intimidade.',
  notifications:'Um bom sinal chama sem invadir.',
  admin:'Números ajudam a cuidar. Intimidade fica fora daqui.'
});

const clean=(value,limit=220)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const routeNow=()=>{
  const route=document.body?.dataset?.screen
    ||document.querySelector('#app > .screen.active[id]')?.id
    ||location.hash.replace(/^#/,'')||'home';
  return SAFE_ROUTES.has(route)?route:'home';
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./whit-universal-v332.css?v=332';
  document.head.append(link);
}

function readPosition(){
  try{
    const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(value&&Number.isFinite(value.x)&&Number.isFinite(value.y))return value;
  }catch{}
  return {x:.88,y:.70};
}
function savePosition(position){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(position));}catch{}
}

export class WhitUniversalV332{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.route=routeNow();
    this.abort=new AbortController();
    this.expanded=false;
    this.dragging=false;
    this.pointerId=null;
    this.holdTimer=0;
    this.raf=0;
    this.start=null;
    this.position=readPosition();
    this.suppressClick=false;

    try{globalThis.divinaWhitV328?.destroy?.();}catch{}
    document.getElementById('whitUniversalV328')?.remove();

    installStyle();
    this.mount();
    this.bind();
    this.applyPosition();
    this.enter(this.route);
    document.documentElement.dataset.whitUniversal='v332';
  }

  mount(){
    const root=document.createElement('aside');
    root.id=ROOT_ID;
    root.className='whit-universal-v332';
    root.innerHTML=`
      <section class="w332-panel" id="w332Panel" aria-hidden="true">
        <button type="button" class="w332-close" data-w332-close aria-label="Fechar">×</button>
        <small>WHIT · PRESENÇA</small>
        <p data-w332-copy></p>
        <div class="w332-actions">
          <button type="button" data-w332-ai>CONVERSAR</button>
          <button type="button" data-w332-library>BIBLIOTECA 78 CARTAS</button>
        </div>
        <span class="w332-drag-hint">SEGURE A ORBE PARA MOVER</span>
      </section>
      <button type="button" class="w332-orb" data-w332-orb
        aria-label="Whit — toque para abrir; segure para mover"
        aria-expanded="false" aria-controls="w332Panel">
        <span class="w332-ring" aria-hidden="true"></span>
        <span class="w332-skin" aria-hidden="true"></span>
        <span class="w332-glint" aria-hidden="true"></span>
        <span class="w332-hold" aria-hidden="true"></span>
      </button>`;
    document.body.append(root);
    this.root=root;
    this.orb=root.querySelector('[data-w332-orb]');
    this.panel=root.querySelector('#w332Panel');
    this.text=root.querySelector('[data-w332-copy]');
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:route-ready',event=>this.enter(event.detail?.id||routeNow()),{signal});
    document.addEventListener('divina:page-ready',event=>{if(event.detail?.id)this.enter(event.detail.id);},{signal});

    this.root.querySelector('[data-w332-close]')?.addEventListener('click',()=>this.collapse(),{signal});
    this.root.querySelector('[data-w332-ai]')?.addEventListener('click',()=>{this.collapse();this.go?.('ai');},{signal});
    this.root.querySelector('[data-w332-library]')?.addEventListener('click',()=>{this.collapse();this.go?.('library');},{signal});

    this.orb.addEventListener('pointerdown',event=>this.pointerDown(event),{signal});
    this.orb.addEventListener('pointermove',event=>this.pointerMove(event),{signal});
    this.orb.addEventListener('pointerup',event=>this.pointerUp(event),{signal});
    this.orb.addEventListener('pointercancel',event=>this.pointerUp(event,true),{signal});
    this.orb.addEventListener('click',event=>{
      if(this.suppressClick){event.preventDefault();this.suppressClick=false;return;}
      if(this.expanded)this.collapse(); else this.expand();
    },{signal});

    addEventListener('resize',()=>this.applyPosition(true),{signal});
  }

  pointerDown(event){
    if(event.pointerType==='mouse'&&event.button!==0)return;
    this.pointerId=event.pointerId;
    this.start={x:event.clientX,y:event.clientY,at:performance.now()};
    this.root.classList.add('is-holding');
    clearTimeout(this.holdTimer);
    this.holdTimer=setTimeout(()=>this.beginDrag(event),260);
  }

  pointerMove(event){
    if(event.pointerId!==this.pointerId||!this.start)return;
    const dx=event.clientX-this.start.x,dy=event.clientY-this.start.y;
    if(!this.dragging&&Math.hypot(dx,dy)>9&&performance.now()-this.start.at>110)this.beginDrag(event);
    if(!this.dragging)return;
    event.preventDefault();
    this.pending={x:event.clientX,y:event.clientY};
    if(this.raf)return;
    this.raf=requestAnimationFrame(()=>{
      this.raf=0;
      if(!this.pending)return;
      this.moveTo(this.pending.x,this.pending.y);
    });
  }

  beginDrag(event){
    if(this.dragging||this.pointerId==null)return;
    clearTimeout(this.holdTimer);
    this.collapse(true);
    this.dragging=true;
    this.suppressClick=true;
    this.root.classList.remove('is-holding');
    this.root.classList.add('is-dragging');
    try{this.orb.setPointerCapture(this.pointerId);}catch{}
    this.moveTo(event.clientX,event.clientY);
  }

  pointerUp(event,cancelled=false){
    if(this.pointerId!=null&&event.pointerId!==this.pointerId)return;
    clearTimeout(this.holdTimer);
    this.root.classList.remove('is-holding');
    if(this.dragging){
      this.dragging=false;
      this.root.classList.remove('is-dragging');
      try{this.orb.releasePointerCapture(this.pointerId);}catch{}
      savePosition(this.position);
      setTimeout(()=>{this.suppressClick=false;},120);
    }
    this.pointerId=null;
    this.start=null;
  }

  moveTo(clientX,clientY){
    const minX=34,maxX=Math.max(minX,innerWidth-34);
    const minY=92,maxY=Math.max(minY,innerHeight-110);
    const x=clamp(clientX,minX,maxX);
    const y=clamp(clientY,minY,maxY);
    this.position={x:x/innerWidth,y:y/innerHeight};
    this.applyPosition();
  }

  applyPosition(reclamp=false){
    let x=this.position.x*innerWidth,y=this.position.y*innerHeight;
    x=clamp(x,34,Math.max(34,innerWidth-34));
    y=clamp(y,92,Math.max(92,innerHeight-110));
    if(reclamp)this.position={x:x/innerWidth,y:y/innerHeight};
    this.root.style.setProperty('--w332-x',`${x}px`);
    this.root.style.setProperty('--w332-y',`${y}px`);
    this.root.dataset.horizontal=x<innerWidth/2?'left':'right';
    this.root.dataset.vertical=y<innerHeight/2?'top':'bottom';
  }

  enter(rawRoute){
    const route=SAFE_ROUTES.has(rawRoute)?rawRoute:routeNow();
    this.route=route;
    this.root.dataset.route=route;
    const home=route==='home';
    this.root.hidden=home;
    this.root.setAttribute('aria-hidden',String(home));
    if(home){
      this.collapse(true);
      return;
    }
    this.text.textContent=copy[route]||'Estou por perto.';
  }

  expand(){
    if(this.route==='home'||this.dragging)return;
    this.expanded=true;
    this.root.classList.add('is-expanded');
    this.panel.setAttribute('aria-hidden','false');
    this.orb.setAttribute('aria-expanded','true');
  }

  collapse(immediate=false){
    this.expanded=false;
    if(immediate)this.root.classList.add('no-transition');
    this.root.classList.remove('is-expanded');
    this.panel.setAttribute('aria-hidden','true');
    this.orb.setAttribute('aria-expanded','false');
    if(immediate)requestAnimationFrame(()=>this.root?.classList.remove('no-transition'));
  }

  status(){return Object.freeze({
    release:RELEASE,route:this.route,hiddenOnHome:true,draggable:true,
    holdToDrag:true,localPositionOnly:true,privateReads:false,extraApiCalls:0
  });}

  destroy(){
    this.abort.abort();
    clearTimeout(this.holdTimer);
    cancelAnimationFrame(this.raf);
    this.root?.remove();
    delete document.documentElement.dataset.whitUniversal;
  }
}

export function installWhitUniversalV332(options={}){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new WhitUniversalV332(options);
  globalThis[MARK]=instance;
  globalThis.divinaWhitV332=instance;
  return instance;
}
