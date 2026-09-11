/* DIVINA BRUXA 2.0 — REBIRTH R043 · TAROT LIVRE FOGO CELESTIAL V343
   Tarot Livre como extensão da Orbe: universo preto profundo, motor de fogo divino,
   revelação rápida, Orbe crua, sem anéis, e Mesa Real fluida com 6 colunas.
   Regras preservadas: 78 cartas, sem repetição, sem invertidas, sem significados no Tarot Livre. */

const RELEASE='V343';
const STYLE_ID='freeTarotCelestialFireV343Styles';
const MARK=Symbol.for('divina.free.tarot.celestial.fire.v343');

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
  link.href='./free-tarot-celestial-fire-v343.css?v=343';
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

function textOf(el){
  return (el?.textContent || '').replace(/\s+/g,' ').trim();
}

export class FreeTarotCelestialFireV343{
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
    this.mesaRealButton=null;
    this.mesaRealPanel=null;
    this.mesaRealGrid=null;
    this.mesaRealCount=null;
    this.mesaRealOpen=false;
    this.observer=null;
    this.abort=new AbortController();
    this.mounted=false;
    installStyle();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.freeTarotSupreme='v343';
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
      if(document.visibilityState==='hidden')this.world?.classList.remove('ft343-awake');
      else if(routeNow()==='tarot')this.world?.classList.add('ft343-awake');
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

    root.dataset.tarotSupreme='v343';
    world.classList.add('ft343','ft343-awake');

    this.enhanceStructure();
    this.bindLocal();
    this.observePhases();
    this.sync();
    this.syncMesaReal();
    this.mounted=true;

    document.dispatchEvent(new CustomEvent('divina:free-tarot-celestial-fire-ready',{
      detail:Object.freeze({
        release:RELEASE,
        baseEngine:'V301',
        deckSize:78,
        normalOnly:true,
        noRepeats:true,
        gridColumns:6,
        interpretationsAdded:false,
        backgroundAsset:'tarot-livre-universo-fogo-v343.jpg'
      })
    }));

    return true;
  }

  enhanceStructure(){
    createLayer('ft343__deep-space',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft343__nebula',this.ritual,'<i></i><i></i><i></i>');
    createLayer('ft343__celestial-fire',this.ritual,'<i></i><i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft343__singularity',this.ritual,'<i></i>');
    createLayer('ft343__birth-stream',this.ritual,'<i></i><i></i><i></i><i></i><i></i>');
    createLayer('ft343__card-fire',this.cardZone,'<i></i><i></i><i></i><i></i>');
    createLayer('ft343__orb-presence',this.reveal,'<i></i><i></i>');
    createLayer('ft343__touch-light',this.reveal);

    if(!this.world.querySelector('.ft343__gesture')){
      const gesture=document.createElement('p');
      gesture.className='ft343__gesture';
      gesture.setAttribute('aria-hidden','true');
      gesture.textContent='TOQUE A ORBE';
      this.reveal.append(gesture);
    }

    if(this.head){
      this.mesaRealButton=ensureButton(this.head,'ft343__mesa-real','MESA REAL');
    }

    if(!this.root.querySelector('.ft343__mesa-panel')){
      const panel=document.createElement('section');
      panel.className='ft343__mesa-panel';
      panel.hidden=true;
      panel.innerHTML = `
        <div class="ft343__mesa-backdrop" aria-hidden="true"></div>
        <div class="ft343__mesa-shell" role="dialog" aria-modal="true" aria-label="Mesa Real">
          <header class="ft343__mesa-header">
            <div>
              <h3>Mesa Real</h3>
              <p class="ft343__mesa-count">0 cartas reveladas</p>
            </div>
            <button type="button" class="ft343__mesa-close" aria-label="Voltar ao Tarot Livre">Voltar</button>
          </header>
          <div class="ft343__mesa-grid" data-mesa-grid></div>
        </div>
      `;
      this.root.append(panel);
    }
    this.mesaRealPanel=this.root.querySelector('.ft343__mesa-panel');
    this.mesaRealGrid=this.root.querySelector('[data-mesa-grid]');
    this.mesaRealCount=this.root.querySelector('.ft343__mesa-count');

    if(this.constellation && !this.constellation.querySelector('.ft343__constellation-glow')){
      const glow=document.createElement('span');
      glow.className='ft343__constellation-glow';
      glow.setAttribute('aria-hidden','true');
      glow.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';
      this.constellation.prepend(glow);
    }
  }

  bindLocal(){
    if(this.reveal.dataset.ft343Bound==='true')return;
    this.reveal.dataset.ft343Bound='true';

    const signal=this.abort.signal;

    const point=event=>{
      const rect=this.reveal.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
      const y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
      this.reveal.style.setProperty('--ft343-x',`${x}%`);
      this.reveal.style.setProperty('--ft343-y',`${y}%`);
    };

    this.reveal.addEventListener('pointerdown',event=>{
      point(event);
      this.reveal.classList.add('ft343-touch');
    },{passive:true,signal});
    this.reveal.addEventListener('pointermove',event=>{
      if(this.reveal.classList.contains('ft343-touch'))point(event);
    },{passive:true,signal});
    const release=()=>this.reveal.classList.remove('ft343-touch');
    this.reveal.addEventListener('pointerup',release,{passive:true,signal});
    this.reveal.addEventListener('pointercancel',release,{passive:true,signal});

    this.cardZone.addEventListener('pointerdown',()=>this.cardZone.classList.add('ft343-card-touch'),{passive:true,signal});
    const cardRelease=()=>this.cardZone.classList.remove('ft343-card-touch');
    this.cardZone.addEventListener('pointerup',cardRelease,{passive:true,signal});
    this.cardZone.addEventListener('pointercancel',cardRelease,{passive:true,signal});

    this.head?.addEventListener('click',event=>{
      const mesaButton=event.target.closest('.ft343__mesa-real');
      if(mesaButton){
        event.preventDefault();
        this.openMesaReal();
      }
    },{signal});

    this.root?.addEventListener('click',event=>{
      if(event.target.closest('.ft343__mesa-close') || event.target.closest('.ft343__mesa-backdrop')){
        event.preventDefault();
        this.closeMesaReal();
      }
    },{signal});
  }

  observePhases(){
    this.observer?.disconnect();
    this.observer=new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='data-phase'))this.syncPhase();
      if(records.some(record=>record.type==='childList')){ this.sync(); this.syncMesaReal(); }
    });
    this.observer.observe(this.world,{
      attributes:true,
      attributeFilter:['data-phase'],
      childList:true,
      subtree:false
    });
    this.observer.observe(this.grid,{childList:true, subtree:true});
  }

  syncPhase(){
    const phase=this.world.dataset.phase||'rest';
    this.world.dataset.ft343Phase=phase;
    this.ritual.dataset.ft343Phase=phase;

    if(phase==='collapse'){
      this.ritual.classList.add('ft343-folding');
      this.ritual.classList.remove('ft343-birth');
    }
    if(phase==='singularity'){
      this.ritual.classList.add('ft343-singularity-active');
    }
    if(phase==='birth'){
      this.ritual.classList.remove('ft343-folding','ft343-singularity-active');
      this.ritual.classList.add('ft343-birth');
      setTimeout(()=>this.ritual?.classList.remove('ft343-birth'),620);
    }
    if(phase==='rest'){
      this.ritual.classList.remove('ft343-folding','ft343-singularity-active');
    }
  }

  sync(){
    if(!this.world)return;
    const revealed=this.grid.querySelectorAll('[data-index]').length;
    const remaining=Math.max(0,78-revealed);

    this.world.style.setProperty('--ft343-revealed',String(revealed));
    this.world.style.setProperty('--ft343-density',String(Math.min(1,0.22 + revealed/78*0.78)));
    this.world.dataset.ft343Empty=String(revealed===0);
    this.world.dataset.ft343Complete=String(revealed>=78);

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
    if(cm)cm.textContent = remaining===0 ? 'Completa' : `${remaining} aguardam no universo`;

    if(this.signal){
      this.signal.textContent = revealed===0
        ? 'Toque a Orbe.'
        : remaining===0
          ? 'O universo está completo.'
          : 'A próxima carta já está atravessando o fogo celestial.';
    }
  }

  syncMesaReal(){
    if(!this.mesaRealGrid || !this.grid) return;
    const items=[...this.grid.querySelectorAll('[data-index]')];
    this.mesaRealGrid.innerHTML='';
    const fragment=document.createDocumentFragment();

    items.forEach((item,idx)=>{
      const card=document.createElement('button');
      card.type='button';
      card.className='ft343__mesa-card';
      card.dataset.index=item.dataset.index ?? String(idx);
      card.innerHTML = item.innerHTML || `<span>${idx+1}</span>`;

      const label = textOf(item.getAttribute?.('aria-label') ? {textContent:item.getAttribute('aria-label')} : item) || `Carta ${idx+1}`;
      card.setAttribute('aria-label', label);

      if(!card.querySelector('img')){
        const preview=item.querySelector('img');
        if(preview){
          const img=preview.cloneNode(true);
          card.innerHTML='';
          card.append(img);
        }
      }
      if(!card.querySelector('.ft343__mesa-label')){
        const labelNode=document.createElement('span');
        labelNode.className='ft343__mesa-label';
        labelNode.textContent=label;
        card.append(labelNode);
      }
      fragment.append(card);
    });

    this.mesaRealGrid.append(fragment);
    if(this.mesaRealCount){
      this.mesaRealCount.textContent = `${items.length} ${items.length===1?'carta revelada':'cartas reveladas'}`;
    }
  }

  openMesaReal(){
    if(!this.mesaRealPanel || this.mesaRealOpen) return;
    this.syncMesaReal();
    this.mesaRealOpen=true;
    this.root.dataset.ft343Mesa='open';
    this.mesaRealPanel.hidden=false;
    requestAnimationFrame(()=>this.mesaRealPanel.classList.add('is-open'));
  }

  closeMesaReal(){
    if(!this.mesaRealPanel || !this.mesaRealOpen) return;
    this.mesaRealOpen=false;
    this.root.dataset.ft343Mesa='closed';
    this.mesaRealPanel.classList.remove('is-open');
    setTimeout(()=>{
      if(!this.mesaRealOpen && this.mesaRealPanel) this.mesaRealPanel.hidden=true;
    },420);
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
    const y2=(cardRect.top + Math.min(cardRect.height*0.12,24)) - ritualRect.top;
    const dx=x2-x1;
    const dy=y2-y1;
    const length=Math.hypot(dx,dy);
    const angle=Math.atan2(dy,dx) * 180 / Math.PI;

    this.ritual.style.setProperty('--ft343-stream-x',`${x1}px`);
    this.ritual.style.setProperty('--ft343-stream-y',`${y1}px`);
    this.ritual.style.setProperty('--ft343-stream-length',`${length}px`);
    this.ritual.style.setProperty('--ft343-stream-angle',`${angle}deg`);

    this.ritual.classList.remove('ft343-birth-stream');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft343-birth-stream');
      setTimeout(()=>this.ritual?.classList.remove('ft343-birth-stream'),720);
    });
  }

  accentNewestCard(position){
    if(!Number.isFinite(position) || position < 0)return;
    const button=this.grid.querySelector(`[data-index="${position}"]`);
    if(!button)return;
    button.classList.remove('ft343-newborn');
    requestAnimationFrame(()=>{
      button.classList.add('ft343-newborn');
      setTimeout(()=>button.classList.remove('ft343-newborn'),1400);
    });
  }

  birth(detail){
    if(!this.ritual)return;
    const position=Number(detail?.position ?? -1);
    this.triggerBirthStream();
    this.accentNewestCard(position);

    this.ritual.classList.remove('ft343-reveal-wave');
    requestAnimationFrame(()=>{
      this.ritual.classList.add('ft343-reveal-wave');
      setTimeout(()=>this.ritual?.classList.remove('ft343-reveal-wave'),760);
    });

    if(!reduced()&&!constrained()){
      const flames=this.cardZone?.querySelector('.ft343__card-fire');
      flames?.animate([
        {opacity:.18, transform:'scale(.78)'},
        {opacity:1, transform:'scale(1.16)', offset:.38},
        {opacity:.24, transform:'scale(1.34)'}
      ],{duration:720,easing:'cubic-bezier(.16,.82,.22,1)'});
    }

    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:position===0
          ? 'A primeira carta nasceu do fogo celestial.'
          : 'Outra carta atravessou o cosmos e se revelou.',
        source:'tarot-free-v343',
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
      noInterpretations:true,
      gridColumns:6,
      mesaRealOverlay:true,
      backgroundAsset:'tarot-livre-universo-fogo-v343.jpg',
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    this.root?.removeAttribute('data-tarot-supreme');
    this.world?.classList.remove('ft343','ft343-awake');
    delete document.documentElement.dataset.freeTarotSupreme;
    this.mounted=false;
  }
}

export function installFreeTarotCelestialFireV343(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new FreeTarotCelestialFireV343();
  globalThis[MARK]=instance;
  globalThis.divinaFreeTarotV343=instance;
  return instance;
}
