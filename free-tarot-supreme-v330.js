/* DIVINA BRUXA 2.0 — REBIRTH R030 · TAROT LIVRE SUPREMO V330
   Camada ritual sobre FreeTarot V301.
   Não altera baralho, sorteio, persistência, ordem, orientação ou repetição. */

const RELEASE='V330';
const STYLE_ID='freeTarotSupremeV330Styles';
const MARK=Symbol.for('divina.free.tarot.supreme.v330');

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
  link.href='./free-tarot-supreme-v330.css?v=330';
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

export class FreeTarotSupremeV330{
  constructor(){
    this.root=null;
    this.world=null;
    this.ritual=null;
    this.cardZone=null;
    this.reveal=null;
    this.signal=null;
    this.grid=null;
    this.observer=null;
    this.abort=new AbortController();
    this.mounted=false;
    this.lastRevealed=-1;
    this.route=routeNow();
    installStyle();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.freeTarotSupreme='v330';
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id==='tarot')queueMicrotask(()=>this.tryMount(true));
    },{signal});

    document.addEventListener('divina:route-ready',event=>{
      this.route=event.detail?.id||routeNow();
      if(this.route==='tarot')queueMicrotask(()=>this.tryMount(true));
    },{signal});

    addEventListener('tarot:rebirth-revealed',event=>{
      if(!this.mounted)return;
      this.lastRevealed=Number(event.detail?.position ?? -1);
      this.birth(event.detail||{});
    },{signal});

    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='hidden')this.world?.classList.remove('ft330-awake');
      else if(routeNow()==='tarot')this.world?.classList.add('ft330-awake');
    },{signal});
  }

  tryMount(force=false){
    const root=document.querySelector('#tarot');
    const world=root?.querySelector('.ft301');
    if(!root||!world)return false;
    if(this.mounted&&this.world===world&&!force)return true;

    this.root=root;
    this.world=world;
    this.ritual=world.querySelector('.ft301__ritual');
    this.cardZone=world.querySelector('.ft301__card-zone');
    this.reveal=world.querySelector('[data-reveal]');
    this.signal=world.querySelector('[data-signal]');
    this.grid=world.querySelector('[data-grid]');

    if(!this.ritual||!this.cardZone||!this.reveal||!this.grid)return false;

    root.dataset.tarotSupreme='v330';
    world.classList.add('ft330','ft330-awake');

    this.enhanceStructure();
    this.bindLocal();
    this.observePhases();
    this.sync();

    this.mounted=true;
    document.dispatchEvent(new CustomEvent('divina:free-tarot-supreme-ready',{
      detail:Object.freeze({
        release:RELEASE,
        baseEngine:'V301',
        deckSize:78,
        normalOnly:true,
        noRepeats:true,
        gridColumns:6,
        interpretationsAdded:false
      })
    }));
    return true;
  }

  enhanceStructure(){
    createLayer('ft330__deep-space',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft330__horizon',this.ritual,'<i></i><i></i>');
    createLayer('ft330__singularity',this.ritual,'<i></i>');
    createLayer('ft330__card-aura',this.cardZone,'<i></i><i></i>');
    createLayer('ft330__orb-rings',this.reveal,'<i></i><i></i><i></i>');
    createLayer('ft330__touch-light',this.reveal);

    if(!this.world.querySelector('.ft330__truth')){
      const truth=document.createElement('p');
      truth.className='ft330__truth';
      truth.setAttribute('aria-hidden','true');
      truth.innerHTML='<span>78</span><i></i><span>SEM REPETIÇÃO</span><i></i><span>DIRETAS</span>';
      this.ritual.append(truth);
    }

    if(!this.world.querySelector('.ft330__gesture')){
      const gesture=document.createElement('p');
      gesture.className='ft330__gesture';
      gesture.setAttribute('aria-hidden','true');
      gesture.textContent='TOQUE A ORBE';
      this.reveal.append(gesture);
    }
  }

  bindLocal(){
    if(this.reveal.dataset.ft330Bound==='true')return;
    this.reveal.dataset.ft330Bound='true';

    const signal=this.abort.signal;

    const point=event=>{
      const rect=this.reveal.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
      const y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
      this.reveal.style.setProperty('--ft330-x',`${x}%`);
      this.reveal.style.setProperty('--ft330-y',`${y}%`);
    };

    this.reveal.addEventListener('pointerdown',event=>{
      point(event);
      this.reveal.classList.add('ft330-touch');
    },{passive:true,signal});

    this.reveal.addEventListener('pointermove',event=>{
      if(this.reveal.classList.contains('ft330-touch'))point(event);
    },{passive:true,signal});

    const release=()=>this.reveal.classList.remove('ft330-touch');
    this.reveal.addEventListener('pointerup',release,{passive:true,signal});
    this.reveal.addEventListener('pointercancel',release,{passive:true,signal});

    this.cardZone.addEventListener('pointerdown',()=>{
      this.cardZone.classList.add('ft330-card-touch');
    },{passive:true,signal});
    const cardRelease=()=>this.cardZone.classList.remove('ft330-card-touch');
    this.cardZone.addEventListener('pointerup',cardRelease,{passive:true,signal});
    this.cardZone.addEventListener('pointercancel',cardRelease,{passive:true,signal});
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
    this.world.dataset.ft330Phase=phase;
    this.ritual.dataset.ft330Phase=phase;

    if(phase==='collapse'){
      this.ritual.classList.add('ft330-folding');
      this.ritual.classList.remove('ft330-birth');
    }
    if(phase==='singularity'){
      this.ritual.classList.add('ft330-singularity-active');
    }
    if(phase==='birth'){
      this.ritual.classList.remove('ft330-folding','ft330-singularity-active');
      this.ritual.classList.add('ft330-birth');
      setTimeout(()=>this.ritual?.classList.remove('ft330-birth'),720);
    }
    if(phase==='rest'){
      this.ritual.classList.remove('ft330-folding','ft330-singularity-active');
    }
  }

  sync(){
    if(!this.world)return;
    const revealed=this.grid.querySelectorAll('[data-index]').length;
    this.world.style.setProperty('--ft330-revealed',String(revealed));
    this.world.dataset.ft330Empty=String(revealed===0);
    this.world.dataset.ft330Complete=String(revealed>=78);

    const head=this.world.querySelector('.ft301__head');
    if(head)head.setAttribute('aria-label',`${revealed} de 78 cartas reveladas`);

    if(revealed===0&&this.signal){
      this.signal.textContent='Toque a Orbe.';
    }
  }

  birth(detail){
    if(!this.ritual)return;

    this.ritual.classList.remove('ft330-reveal-wave');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft330-reveal-wave');
      setTimeout(()=>this.ritual?.classList.remove('ft330-reveal-wave'),900);
    });

    if(!reduced()&&!constrained()){
      const halo=this.cardZone?.querySelector('.ft330__card-aura');
      halo?.animate([
        {opacity:.08,transform:'scale(.72)'},
        {opacity:.92,transform:'scale(1.12)',offset:.40},
        {opacity:.18,transform:'scale(1.35)'}
      ],{duration:780,easing:'cubic-bezier(.16,.82,.22,1)'});
    }

    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:detail?.position===0
          ? 'Primeiro encontro. Observe antes de nomear.'
          : 'Mais uma carta entrou no círculo. O sentido pode amadurecer sem pressa.',
        source:'tarot-free-v330',
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
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    this.root?.removeAttribute('data-tarot-supreme');
    this.world?.classList.remove('ft330','ft330-awake');
    delete document.documentElement.dataset.freeTarotSupreme;
    this.mounted=false;
  }
}

export function installFreeTarotSupremeV330(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new FreeTarotSupremeV330();
  globalThis[MARK]=instance;
  globalThis.divinaFreeTarotV330=instance;
  return instance;
}
