/* DIVINA BRUXA 2.0 — REBIRTH R042 · TAROT LIVRE LENDÁRIO V342
   Direção visual baseada na imagem cósmica aprovada.
   Objetivo: cartas vagando no universo, preto profundo, Orbe crua como no Menu,
   mais separação entre carta e Orbe, mais magia, mais fluidez.
   Regras preservadas: 78 cartas, sem repetição, sem invertidas, sem significados no Tarot Livre. */

const RELEASE='V342';
const STYLE_ID='freeTarotLegendaryV342Styles';
const MARK=Symbol.for('divina.free.tarot.legendary.v342');

const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';
const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')
  ||'home';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./free-tarot-legendary-v342.css?v=342';
  document.head.append(link);
}

function createLayer(className,parent,html=''){
  let node=parent.querySelector(`.${className}`);
  if(node)return node;
  node=document.createElement('span');
  node.className=className;
  node.setAttribute('aria-hidden','true');
  node.innerHTML=html;
  parent.append(node);
  return node;
}

function ensureButton(host,className,label){
  let button=host.querySelector(`.${className}`);
  if(button)return button;
  button=document.createElement('button');
  button.type='button';
  button.className=className;
  button.textContent=label;
  host.append(button);
  return button;
}

export class FreeTarotLegendaryV342{
  constructor(){
    this.root=null;
    this.world=null;
    this.ritual=null;
    this.cardZone=null;
    this.reveal=null;
    this.signal=null;
    this.grid=null;
    this.constellation=null;
    this.head=null;
    this.mesaReal=null;
    this.observer=null;
    this.abort=new AbortController();
    this.mounted=false;
    installStyle();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.freeTarotSupreme='v342';
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id==='tarot')queueMicrotask(()=>this.tryMount(true));
    },{signal});

    document.addEventListener('divina:route-ready',event=>{
      const route=event.detail?.id||routeNow();
      if(route==='tarot')queueMicrotask(()=>this.tryMount(true));
    },{signal});

    addEventListener('tarot:rebirth-revealed',event=>{
      if(!this.mounted)return;
      this.birth(event.detail||{});
    },{signal});

    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='hidden')this.world?.classList.remove('ft342-awake');
      else if(routeNow()==='tarot')this.world?.classList.add('ft342-awake');
    },{signal});
  }

  tryMount(force=false){
    const root=document.querySelector('#tarot');
    const world=root?.querySelector('.ft301');
    if(!root||!world)return false;
    if(this.mounted&&this.world===world&&!force)return true;

    this.root=root;
    this.world=world;
    this.head=world.querySelector('.ft301__head');
    this.ritual=world.querySelector('.ft301__ritual');
    this.cardZone=world.querySelector('.ft301__card-zone');
    this.reveal=world.querySelector('[data-reveal]');
    this.signal=world.querySelector('[data-signal]');
    this.grid=world.querySelector('[data-grid]');
    this.constellation=world.querySelector('.ft301__constellation');

    if(!this.ritual||!this.cardZone||!this.reveal||!this.grid)return false;

    root.dataset.tarotSupreme='v342';
    world.classList.add('ft342','ft342-awake');

    this.enhanceStructure();
    this.bindLocal();
    this.observePhases();
    this.sync();
    this.mounted=true;

    document.dispatchEvent(new CustomEvent('divina:free-tarot-legendary-ready',{
      detail:Object.freeze({
        release:RELEASE,
        baseEngine:'V301',
        deckSize:78,
        normalOnly:true,
        noRepeats:true,
        gridColumns:6,
        interpretationsAdded:false,
        backgroundAsset:'tarot-livre-universo-v342.png'
      })
    }));

    return true;
  }

  enhanceStructure(){
    createLayer('ft342__deep-space',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft342__galaxies',this.ritual,'<i></i><i></i><i></i>');
    createLayer('ft342__drift-cards',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft342__singularity',this.ritual,'<i></i>');
    createLayer('ft342__birth-stream',this.ritual,'<i></i><i></i><i></i><i></i>');
    createLayer('ft342__card-aura',this.cardZone,'<i></i><i></i><i></i>');
    createLayer('ft342__orb-presence',this.reveal,'<i></i><i></i>');
    createLayer('ft342__touch-light',this.reveal);

    if(!this.world.querySelector('.ft342__gesture')){
      const gesture=document.createElement('p');
      gesture.className='ft342__gesture';
      gesture.setAttribute('aria-hidden','true');
      gesture.textContent='TOQUE A ORBE';
      this.reveal.append(gesture);
    }

    if(this.head){
      this.mesaReal=ensureButton(this.head,'ft342__mesa-real','MESA REAL');
    }

    if(this.constellation && !this.constellation.querySelector('.ft342__constellation-glow')){
      const glow=document.createElement('span');
      glow.className='ft342__constellation-glow';
      glow.setAttribute('aria-hidden','true');
      glow.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';
      this.constellation.prepend(glow);
    }
  }

  bindLocal(){
    if(this.reveal.dataset.ft342Bound==='true')return;
    this.reveal.dataset.ft342Bound='true';

    const signal=this.abort.signal;

    const point=event=>{
      const rect=this.reveal.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
      const y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
      this.reveal.style.setProperty('--ft342-x',`${x}%`);
      this.reveal.style.setProperty('--ft342-y',`${y}%`);
    };

    this.reveal.addEventListener('pointerdown',event=>{
      point(event);
      this.reveal.classList.add('ft342-touch');
    },{passive:true,signal});
    this.reveal.addEventListener('pointermove',event=>{
      if(this.reveal.classList.contains('ft342-touch'))point(event);
    },{passive:true,signal});
    const release=()=>this.reveal.classList.remove('ft342-touch');
    this.reveal.addEventListener('pointerup',release,{passive:true,signal});
    this.reveal.addEventListener('pointercancel',release,{passive:true,signal});

    this.cardZone.addEventListener('pointerdown',()=>this.cardZone.classList.add('ft342-card-touch'),{passive:true,signal});
    const cardRelease=()=>this.cardZone.classList.remove('ft342-card-touch');
    this.cardZone.addEventListener('pointerup',cardRelease,{passive:true,signal});
    this.cardZone.addEventListener('pointercancel',cardRelease,{passive:true,signal});

    this.head?.addEventListener('click',event=>{
      const target=event.target.closest('.ft342__mesa-real');
      if(!target)return;
      event.preventDefault();
      globalThis.orbe?.go?.('spreads');
    },{signal});
  }

  observePhases(){
    this.observer?.disconnect();
    this.observer=new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='data-phase'))this.syncPhase();
      if(records.some(record=>record.type==='childList'))this.sync();
    });
    this.observer.observe(this.world,{
      attributes:true,
      attributeFilter:['data-phase'],
      childList:true,
      subtree:false
    });
    this.observer.observe(this.grid,{childList:true});
  }

  syncPhase(){
    const phase=this.world.dataset.phase||'rest';
    this.world.dataset.ft342Phase=phase;
    this.ritual.dataset.ft342Phase=phase;

    if(phase==='collapse'){
      this.ritual.classList.add('ft342-folding');
      this.ritual.classList.remove('ft342-birth');
    }
    if(phase==='singularity'){
      this.ritual.classList.add('ft342-singularity-active');
    }
    if(phase==='birth'){
      this.ritual.classList.remove('ft342-folding','ft342-singularity-active');
      this.ritual.classList.add('ft342-birth');
      setTimeout(()=>this.ritual?.classList.remove('ft342-birth'),820);
    }
    if(phase==='rest'){
      this.ritual.classList.remove('ft342-folding','ft342-singularity-active');
    }
  }

  sync(){
    if(!this.world)return;
    const revealed=this.grid.querySelectorAll('[data-index]').length;
    const remaining=Math.max(0,78-revealed);

    this.world.style.setProperty('--ft342-revealed',String(revealed));
    this.world.style.setProperty('--ft342-density',String(Math.min(1,0.20 + revealed/78*0.80)));
    this.world.dataset.ft342Empty=String(revealed===0);
    this.world.dataset.ft342Complete=String(revealed>=78);

    if(this.head){
      this.head.setAttribute('aria-label',`${revealed} de 78 cartas reveladas`);
      const title=this.head.querySelector('h2');
      const counter=this.head.querySelector('p');
      if(title)title.textContent='Tarot Livre';
      if(counter)counter.textContent=`${revealed}/78`;
    }

    const ch=this.constellation?.querySelector('header');
    const ct=ch?.querySelector('h3');
    const cm=ch?.querySelector('p');
    if(ct)ct.textContent='Constelação';
    if(cm)cm.textContent = remaining===0 ? 'Completa' : `${remaining} vagam no universo`;

    if(this.signal){
      this.signal.textContent = revealed===0
        ? 'Toque a Orbe.'
        : remaining===0
          ? 'O universo está completo.'
          : 'A próxima carta já está viajando até você.';
    }
  }

  triggerBirthStream(){
    if(!this.ritual||!this.reveal||!this.cardZone)return;
    const ritualRect=this.ritual.getBoundingClientRect();
    const orbRect=this.reveal.getBoundingClientRect();
    const cardRect=this.cardZone.getBoundingClientRect();
    if(!ritualRect.width||!ritualRect.height||!orbRect.width||!cardRect.width)return;

    const x1=(orbRect.left + orbRect.width/2) - ritualRect.left;
    const y1=(orbRect.top + orbRect.height/2) - ritualRect.top;
    const x2=(cardRect.left + cardRect.width/2) - ritualRect.left;
    const y2=(cardRect.top + Math.min(cardRect.height*0.16,38)) - ritualRect.top;
    const dx=x2-x1;
    const dy=y2-y1;
    const length=Math.hypot(dx,dy);
    const angle=Math.atan2(dy,dx) * 180 / Math.PI;

    this.ritual.style.setProperty('--ft342-stream-x',`${x1}px`);
    this.ritual.style.setProperty('--ft342-stream-y',`${y1}px`);
    this.ritual.style.setProperty('--ft342-stream-length',`${length}px`);
    this.ritual.style.setProperty('--ft342-stream-angle',`${angle}deg`);

    this.ritual.classList.remove('ft342-birth-stream');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft342-birth-stream');
      setTimeout(()=>this.ritual?.classList.remove('ft342-birth-stream'),1040);
    });
  }

  accentNewestCard(position){
    if(!Number.isFinite(position) || position < 0)return;
    const button=this.grid.querySelector(`[data-index="${position}"]`);
    if(!button)return;
    button.classList.remove('ft342-newborn');
    requestAnimationFrame(()=>{
      button.classList.add('ft342-newborn');
      setTimeout(()=>button.classList.remove('ft342-newborn'),1700);
    });
  }

  birth(detail){
    if(!this.ritual)return;
    const position=Number(detail?.position ?? -1);
    this.triggerBirthStream();
    this.accentNewestCard(position);

    this.ritual.classList.remove('ft342-reveal-wave');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft342-reveal-wave');
      setTimeout(()=>this.ritual?.classList.remove('ft342-reveal-wave'),1040);
    });

    if(!reduced()&&!constrained()){
      const halo=this.cardZone?.querySelector('.ft342__card-aura');
      halo?.animate([
        {opacity:.06,transform:'scale(.76)'},
        {opacity:1,transform:'scale(1.18)',offset:.44},
        {opacity:.24,transform:'scale(1.42)'}
      ],{duration:980,easing:'cubic-bezier(.16,.82,.22,1)'});
    }

    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:position===0
          ? 'A primeira carta já está viajando pelo universo até você.'
          : 'Outra carta nasceu da Orbe e cruzou o cosmos até o seu círculo.',
        source:'tarot-free-v342',
        private:false
      })
    }));
  }

  status(){
    const revealed=this.grid?.querySelectorAll('[data-index]').length||0;
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V301',
      mounted:this.mounted,
      revealed,
      deckSize:78,
      normalOnly:true,
      noRepeats:true,
      gridColumns:6,
      interpretationsAdded:false,
      backgroundAsset:'tarot-livre-universo-v342.png',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    this.root?.removeAttribute('data-tarot-supreme');
    this.world?.classList.remove('ft342','ft342-awake');
    delete document.documentElement.dataset.freeTarotSupreme;
    this.mounted=false;
  }
}

export function installFreeTarotLegendaryV342(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new FreeTarotLegendaryV342();
  globalThis[MARK]=instance;
  globalThis.divinaFreeTarotV342=instance;
  return instance;
}
