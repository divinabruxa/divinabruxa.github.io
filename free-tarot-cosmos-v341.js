/* DIVINA BRUXA 2.0 — REBIRTH R041 · TAROT LIVRE COSMOS V341
   Base V301 + direção visual V330 preservadas, porém com mais universo,
   menos frieza, menos preto e com nascimento de carta ainda mais ritual.
   Regras preservadas: 78 cartas, sem repetição, sem invertidas, sem significados no Tarot Livre. */

const RELEASE='V341';
const STYLE_ID='freeTarotCosmosV341Styles';
const MARK=Symbol.for('divina.free.tarot.cosmos.v341');

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
  link.href='./free-tarot-cosmos-v341.css?v=341';
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

export class FreeTarotCosmosV341{
  constructor(){
    this.root=null;
    this.world=null;
    this.ritual=null;
    this.cardZone=null;
    this.reveal=null;
    this.signal=null;
    this.grid=null;
    this.constellation=null;
    this.observer=null;
    this.abort=new AbortController();
    this.mounted=false;
    this.lastRevealed=-1;
    this.route=routeNow();
    installStyle();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.freeTarotSupreme='v341';
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
      if(document.visibilityState==='hidden')this.world?.classList.remove('ft341-awake');
      else if(routeNow()==='tarot')this.world?.classList.add('ft341-awake');
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
    this.constellation=world.querySelector('.ft301__constellation');

    if(!this.ritual||!this.cardZone||!this.reveal||!this.grid)return false;

    root.dataset.tarotSupreme='v341';
    world.classList.add('ft341','ft341-awake');

    this.enhanceStructure();
    this.bindLocal();
    this.observePhases();
    this.sync();

    this.mounted=true;
    document.dispatchEvent(new CustomEvent('divina:free-tarot-cosmos-ready',{
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
    createLayer('ft341__deep-space',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft341__aurora',this.ritual,'<i></i><i></i><i></i>');
    createLayer('ft341__cosmic-bloom',this.ritual,'<i></i><i></i>');
    createLayer('ft341__horizon',this.ritual,'<i></i><i></i>');
    createLayer('ft341__singularity',this.ritual,'<i></i>');
    createLayer('ft341__birth-stream',this.ritual,'<i></i><i></i><i></i>');
    createLayer('ft341__card-aura',this.cardZone,'<i></i><i></i><i></i>');
    createLayer('ft341__orb-rings',this.reveal,'<i></i><i></i><i></i>');
    createLayer('ft341__touch-light',this.reveal);
    createLayer('ft341__orb-breath',this.reveal,'<i></i><i></i>');

    if(!this.world.querySelector('.ft341__truth')){
      const truth=document.createElement('p');
      truth.className='ft341__truth';
      truth.setAttribute('aria-hidden','true');
      truth.innerHTML='<span>78</span><i></i><span>SEM REPETIÇÃO</span><i></i><span>DIRETAS</span>';
      this.ritual.append(truth);
    }

    if(!this.world.querySelector('.ft341__gesture')){
      const gesture=document.createElement('p');
      gesture.className='ft341__gesture';
      gesture.setAttribute('aria-hidden','true');
      gesture.textContent='TOQUE A ORBE';
      this.reveal.append(gesture);
    }

    if(this.constellation && !this.constellation.querySelector('.ft341__constellation-glow')){
      const glow=document.createElement('span');
      glow.className='ft341__constellation-glow';
      glow.setAttribute('aria-hidden','true');
      glow.innerHTML='<i></i><i></i><i></i><i></i><i></i>';
      this.constellation.prepend(glow);
    }
  }

  bindLocal(){
    if(this.reveal.dataset.ft341Bound==='true')return;
    this.reveal.dataset.ft341Bound='true';

    const signal=this.abort.signal;

    const point=event=>{
      const rect=this.reveal.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
      const y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
      this.reveal.style.setProperty('--ft341-x',`${x}%`);
      this.reveal.style.setProperty('--ft341-y',`${y}%`);
    };

    this.reveal.addEventListener('pointerdown',event=>{
      point(event);
      this.reveal.classList.add('ft341-touch');
    },{passive:true,signal});

    this.reveal.addEventListener('pointermove',event=>{
      if(this.reveal.classList.contains('ft341-touch'))point(event);
    },{passive:true,signal});

    const release=()=>this.reveal.classList.remove('ft341-touch');
    this.reveal.addEventListener('pointerup',release,{passive:true,signal});
    this.reveal.addEventListener('pointercancel',release,{passive:true,signal});

    this.cardZone.addEventListener('pointerdown',()=>this.cardZone.classList.add('ft341-card-touch'),{passive:true,signal});
    const cardRelease=()=>this.cardZone.classList.remove('ft341-card-touch');
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
    this.world.dataset.ft341Phase=phase;
    this.ritual.dataset.ft341Phase=phase;

    if(phase==='collapse'){
      this.ritual.classList.add('ft341-folding');
      this.ritual.classList.remove('ft341-birth');
    }
    if(phase==='singularity'){
      this.ritual.classList.add('ft341-singularity-active');
    }
    if(phase==='birth'){
      this.ritual.classList.remove('ft341-folding','ft341-singularity-active');
      this.ritual.classList.add('ft341-birth');
      setTimeout(()=>this.ritual?.classList.remove('ft341-birth'),760);
    }
    if(phase==='rest'){
      this.ritual.classList.remove('ft341-folding','ft341-singularity-active');
    }
  }

  sync(){
    if(!this.world)return;
    const revealed=this.grid.querySelectorAll('[data-index]').length;
    const remaining=Math.max(0,78-revealed);

    this.world.style.setProperty('--ft341-revealed',String(revealed));
    this.world.style.setProperty('--ft341-density',String(Math.min(1,0.24 + revealed/78*0.76)));
    this.world.dataset.ft341Empty=String(revealed===0);
    this.world.dataset.ft341Complete=String(revealed>=78);

    const head=this.world.querySelector('.ft301__head');
    if(head){
      head.setAttribute('aria-label',`${revealed} de 78 cartas reveladas`);
      const title=head.querySelector('h2');
      const counter=head.querySelector('p');
      if(title)title.textContent='Tarot Livre';
      if(counter)counter.textContent=`${revealed}/78`;
    }

    const constellationHeader=this.constellation?.querySelector('header');
    const constellationTitle=constellationHeader?.querySelector('h3');
    const constellationMeta=constellationHeader?.querySelector('p');
    if(constellationTitle)constellationTitle.textContent='Seu círculo';
    if(constellationMeta)constellationMeta.textContent=`${remaining} aguardam`;

    const actions=this.world.querySelector('.ft301__actions');
    actions?.setAttribute('aria-label','Ações do Tarot Livre');

    if(this.signal){
      this.signal.textContent = revealed===0
        ? 'Toque a Orbe.'
        : remaining===0
          ? 'O círculo está completo.'
          : 'A próxima carta já respira no universo.';
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
    const y2=(cardRect.top + Math.min(cardRect.height*0.18,42)) - ritualRect.top;
    const dx=x2-x1;
    const dy=y2-y1;
    const length=Math.hypot(dx,dy);
    const angle=Math.atan2(dy,dx) * 180 / Math.PI;

    this.ritual.style.setProperty('--ft341-stream-x',`${x1}px`);
    this.ritual.style.setProperty('--ft341-stream-y',`${y1}px`);
    this.ritual.style.setProperty('--ft341-stream-length',`${length}px`);
    this.ritual.style.setProperty('--ft341-stream-angle',`${angle}deg`);

    this.ritual.classList.remove('ft341-birth-stream');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft341-birth-stream');
      setTimeout(()=>this.ritual?.classList.remove('ft341-birth-stream'),900);
    });
  }

  accentNewestCard(position){
    if(!Number.isFinite(position) || position < 0)return;
    const button=this.grid.querySelector(`[data-index="${position}"]`);
    if(!button)return;
    button.classList.remove('ft341-newborn');
    requestAnimationFrame(()=>{
      button.classList.add('ft341-newborn');
      setTimeout(()=>button.classList.remove('ft341-newborn'),1600);
    });
  }

  birth(detail){
    if(!this.ritual)return;
    this.triggerBirthStream();
    this.accentNewestCard(Number(detail?.position ?? -1));

    this.ritual.classList.remove('ft341-reveal-wave');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft341-reveal-wave');
      setTimeout(()=>this.ritual?.classList.remove('ft341-reveal-wave'),960);
    });

    if(!reduced()&&!constrained()){
      const halo=this.cardZone?.querySelector('.ft341__card-aura');
      halo?.animate([
        {opacity:.10,transform:'scale(.72)'},
        {opacity:1,transform:'scale(1.12)',offset:.42},
        {opacity:.22,transform:'scale(1.34)'}
      ],{duration:860,easing:'cubic-bezier(.16,.82,.22,1)'});
    }

    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:detail?.position===0
          ? 'O primeiro portal se abriu. Sinta antes de definir.'
          : 'Outra carta nasceu da Orbe. O universo continua respondendo.',
        source:'tarot-free-v341',
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
    this.world?.classList.remove('ft341','ft341-awake');
    delete document.documentElement.dataset.freeTarotSupreme;
    this.mounted=false;
  }
}

export function installFreeTarotCosmosV341(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new FreeTarotCosmosV341();
  globalThis[MARK]=instance;
  globalThis.divinaFreeTarotV341=instance;
  return instance;
}
