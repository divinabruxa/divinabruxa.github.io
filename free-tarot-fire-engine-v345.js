/* DIVINA BRUXA 2.0 — REBIRTH R045 · TAROT LIVRE FIRE ENGINE V345
   Motor real de fogo celestial em Canvas 2D.
   Sem cartas decorativas no fundo. Sem significados. Sem invertidas. Sem repetição.
   A carta nasce da Orbe em uma explosão rápida de fogo violeta/dourado. */

const RELEASE='V345';
const STYLE_ID='freeTarotFireEngineV345Styles';
const MARK=Symbol.for('divina.free.tarot.fire.engine.v345');

const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';
const dpr=()=>Math.min(2,Math.max(1,window.devicePixelRatio||1));
const routeNow=()=>document.body?.dataset?.screen
  ||document.querySelector('#app > .screen.active[id]')?.id
  ||location.hash.replace(/^#/,'')
  ||'home';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./free-tarot-fire-engine-v345.css?v=345';
  document.head.append(link);
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

function labelOf(node,idx){
  const aria=node?.getAttribute?.('aria-label');
  if(aria)return aria.trim();
  return (node?.textContent||'').replace(/\s+/g,' ').trim() || `Carta ${idx+1}`;
}

class CelestialFireEngineV345{
  constructor({canvas,ritual,orb,cardZone}){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
    this.ritual=ritual;
    this.orb=orb;
    this.cardZone=cardZone;
    this.particles=[];
    this.stars=[];
    this.running=false;
    this.raf=0;
    this.last=0;
    this.birthUntil=0;
    this.birthStrength=0;
    this.width=0;
    this.height=0;
    this.scale=1;
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(ritual);
    this.resize();
    this.seedStars();
  }

  resize(){
    const rect=this.ritual.getBoundingClientRect();
    const scale=dpr();
    this.width=Math.max(1,rect.width);
    this.height=Math.max(1,rect.height);
    this.scale=scale;
    this.canvas.width=Math.round(this.width*scale);
    this.canvas.height=Math.round(this.height*scale);
    this.canvas.style.width=`${this.width}px`;
    this.canvas.style.height=`${this.height}px`;
    this.ctx.setTransform(scale,0,0,scale,0,0);
    this.seedStars();
  }

  seedStars(){
    const count=constrained()?34:72;
    this.stars=Array.from({length:count},()=>({
      x:Math.random()*this.width,
      y:Math.random()*this.height,
      r:.35+Math.random()*1.2,
      a:.12+Math.random()*.58,
      tw:Math.random()*Math.PI*2,
      s:.35+Math.random()*.8
    }));
  }

  rectCenter(el){
    const r=el.getBoundingClientRect();
    const rr=this.ritual.getBoundingClientRect();
    return {
      x:r.left+r.width/2-rr.left,
      y:r.top+r.height/2-rr.top,
      w:r.width,h:r.height
    };
  }

  emitAmbient(dt){
    if(reduced())return;
    const o=this.rectCenter(this.orb);
    const target=this.rectCenter(this.cardZone);
    const count=(constrained()?1:2);
    for(let i=0;i<count;i++){
      if(Math.random()>.52)continue;
      const angle=-Math.PI/2 + (Math.random()-.5)*1.2;
      const speed=22+Math.random()*44;
      this.particles.push({
        x:o.x+(Math.random()-.5)*o.w*.55,
        y:o.y+(Math.random()-.5)*o.h*.34,
        vx:Math.cos(angle)*speed + (target.x-o.x)*.02,
        vy:Math.sin(angle)*speed - 10,
        life:.8+Math.random()*1.15,
        age:0,
        size:2+Math.random()*5,
        hue:Math.random()<.42?'gold':'violet',
        trail:Math.random()<.72,
        gravity:-8+Math.random()*4,
        swirl:(Math.random()-.5)*1.8
      });
    }
  }

  burst(){
    if(reduced())return;
    const o=this.rectCenter(this.orb);
    const c=this.rectCenter(this.cardZone);
    const dx=c.x-o.x,dy=c.y-o.y;
    const len=Math.max(1,Math.hypot(dx,dy));
    const ux=dx/len,uy=dy/len;
    const base=Math.atan2(dy,dx);
    const total=constrained()?38:86;

    for(let i=0;i<total;i++){
      const spread=(Math.random()-.5)*.72;
      const speed=180+Math.random()*420;
      const angle=base+spread;
      const hot=i<Math.floor(total*.34);
      this.particles.push({
        x:o.x+(Math.random()-.5)*o.w*.25,
        y:o.y+(Math.random()-.5)*o.h*.25,
        vx:Math.cos(angle)*speed + ux*80,
        vy:Math.sin(angle)*speed + uy*80,
        life:.34+Math.random()*.52,
        age:0,
        size:(hot?4:2)+Math.random()*(hot?9:6),
        hue:hot?'gold':(Math.random()<.58?'violet':'pink'),
        trail:true,
        gravity:(Math.random()-.5)*18,
        swirl:(Math.random()-.5)*3.8
      });
    }

    this.birthUntil=performance.now()+640;
    this.birthStrength=1;
    this.start();
  }

  start(){
    if(this.running)return;
    this.running=true;
    this.last=performance.now();
    this.raf=requestAnimationFrame(t=>this.frame(t));
  }

  stop(){
    this.running=false;
    cancelAnimationFrame(this.raf);
  }

  color(p,alpha){
    if(p.hue==='gold')return `rgba(255,195,92,${alpha})`;
    if(p.hue==='pink')return `rgba(245,106,223,${alpha})`;
    return `rgba(174,72,255,${alpha})`;
  }

  drawStars(t){
    const ctx=this.ctx;
    for(const s of this.stars){
      const pulse=.45+.55*Math.sin(t*.001*s.s+s.tw);
      ctx.beginPath();
      ctx.fillStyle=`rgba(255,240,218,${s.a*pulse})`;
      ctx.arc(s.x,s.y,s.r*pulse,0,Math.PI*2);
      ctx.fill();
    }
  }

  drawFlameField(t){
    const ctx=this.ctx;
    const o=this.rectCenter(this.orb);
    const c=this.rectCenter(this.cardZone);
    const birth=Math.max(0,Math.min(1,(this.birthUntil-t)/640));

    ctx.save();
    ctx.globalCompositeOperation='lighter';

    for(let layer=0;layer<3;layer++){
      const phase=t*.0025 + layer*1.9;
      const bend=Math.sin(phase)*18 + Math.sin(phase*.57)*12;
      const grad=ctx.createLinearGradient(o.x,o.y,c.x+Math.sin(phase)*14,c.y);
      grad.addColorStop(0,'rgba(180,65,255,0.05)');
      grad.addColorStop(.30,`rgba(205,74,255,${.10+.15*birth})`);
      grad.addColorStop(.62,`rgba(255,143,72,${.08+.18*birth})`);
      grad.addColorStop(.82,`rgba(255,218,133,${.08+.22*birth})`);
      grad.addColorStop(1,'rgba(255,240,211,0)');
      ctx.strokeStyle=grad;
      ctx.lineWidth=18-layer*4 + birth*10;
      ctx.shadowBlur=22+birth*22;
      ctx.shadowColor=layer===1?'rgba(255,152,75,.55)':'rgba(186,72,255,.58)';
      ctx.beginPath();
      ctx.moveTo(o.x,o.y);
      ctx.bezierCurveTo(
        o.x+bend+(-28+layer*22),
        o.y-(c.y-o.y)*.28,
        c.x-bend+(24-layer*18),
        o.y+(c.y-o.y)*.70,
        c.x,c.y
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  updateParticles(dt){
    const next=[];
    for(const p of this.particles){
      p.age+=dt;
      if(p.age>=p.life)continue;
      const k=1-p.age/p.life;
      const angle=p.age*p.swirl*4;
      p.vx+=Math.cos(angle)*p.swirl*dt*18;
      p.vy+=p.gravity*dt;
      p.x+=p.vx*dt;
      p.y+=p.vy*dt;

      const ctx=this.ctx;
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      const alpha=Math.min(1,k*1.6);
      ctx.fillStyle=this.color(p,alpha*.78);
      ctx.shadowBlur=12+p.size*2;
      ctx.shadowColor=this.color(p,Math.min(.85,alpha));
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.35,p.size*k),0,Math.PI*2);
      ctx.fill();

      if(p.trail){
        ctx.strokeStyle=this.color(p,alpha*.28);
        ctx.lineWidth=Math.max(.5,p.size*.45*k);
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);
        ctx.stroke();
      }
      ctx.restore();
      next.push(p);
    }
    this.particles=next.slice(-220);
  }

  drawCardFire(t){
    const ctx=this.ctx;
    const c=this.rectCenter(this.cardZone);
    const birth=Math.max(0,Math.min(1,(this.birthUntil-t)/640));
    if(birth<=0)return;

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2+t*.004*(i%2?1:-1);
      const rx=c.w*.50 + Math.sin(t*.003+i)*12;
      const ry=c.h*.42 + Math.cos(t*.002+i)*18;
      const x=c.x+Math.cos(a)*rx;
      const y=c.y+Math.sin(a)*ry;
      const r=8+birth*18*(.35+Math.random()*.65);
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(255,238,185,.85)');
      g.addColorStop(.28,'rgba(255,151,69,.55)');
      g.addColorStop(.62,'rgba(214,80,255,.34)');
      g.addColorStop(1,'rgba(214,80,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  frame(t){
    if(!this.running)return;
    const dt=Math.min(.033,Math.max(.001,(t-this.last)/1000));
    this.last=t;

    const ctx=this.ctx;
    ctx.clearRect(0,0,this.width,this.height);
    this.drawStars(t);
    this.emitAmbient(dt);
    this.drawFlameField(t);
    this.drawCardFire(t);
    this.updateParticles(dt);

    const active=this.particles.length>0 || routeNow()==='tarot';
    if(active){
      this.raf=requestAnimationFrame(tt=>this.frame(tt));
    }else{
      this.running=false;
    }
  }

  destroy(){
    this.stop();
    this.resizeObserver.disconnect();
    this.particles=[];
  }
}

export class FreeTarotFireEngineV345{
  constructor(){
    this.root=null;
    this.world=null;
    this.ritual=null;
    this.cardZone=null;
    this.reveal=null;
    this.grid=null;
    this.head=null;
    this.signal=null;
    this.constellation=null;
    this.canvas=null;
    this.engine=null;
    this.mesaButton=null;
    this.mesaPanel=null;
    this.mesaGrid=null;
    this.mesaCount=null;
    this.abort=new AbortController();
    this.observer=null;
    this.mounted=false;

    installStyle();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.freeTarotSupreme='v345';
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:page-ready',e=>{
      if(e.detail?.id==='tarot')queueMicrotask(()=>this.tryMount(true));
    },{signal});
    document.addEventListener('divina:route-ready',e=>{
      if((e.detail?.id||routeNow())==='tarot'){
        queueMicrotask(()=>this.tryMount(true));
        setTimeout(()=>this.engine?.start(),80);
      }else{
        this.engine?.stop();
      }
    },{signal});
    addEventListener('tarot:rebirth-revealed',e=>this.birth(e.detail||{}),{signal});
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='hidden')this.engine?.stop();
      else if(routeNow()==='tarot')this.engine?.start();
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
    this.grid=world.querySelector('[data-grid]');
    this.head=world.querySelector('.ft301__head');
    this.signal=world.querySelector('[data-signal]');
    this.constellation=world.querySelector('.ft301__constellation');
    if(!this.ritual||!this.cardZone||!this.reveal||!this.grid)return false;

    root.dataset.tarotSupreme='v345';
    world.classList.add('ft345','ft345-awake');

    this.mountCanvas();
    this.mountUI();
    this.bindLocal();
    this.observe();
    this.sync();
    this.syncMesa();
    this.engine?.start();
    this.mounted=true;
    return true;
  }

  mountCanvas(){
    let canvas=this.ritual.querySelector('.ft345__fire-canvas');
    if(!canvas){
      canvas=document.createElement('canvas');
      canvas.className='ft345__fire-canvas';
      canvas.setAttribute('aria-hidden','true');
      this.ritual.prepend(canvas);
    }
    this.canvas=canvas;
    this.engine?.destroy?.();
    this.engine=new CelestialFireEngineV345({
      canvas,
      ritual:this.ritual,
      orb:this.reveal,
      cardZone:this.cardZone
    });
  }

  mountUI(){
    if(!this.reveal.querySelector('.ft345__touch-light')){
      const light=document.createElement('span');
      light.className='ft345__touch-light';
      light.setAttribute('aria-hidden','true');
      this.reveal.append(light);
    }

    if(this.head){
      this.mesaButton=ensureButton(this.head,'ft345__mesa-real','MESA REAL');
    }

    if(!this.root.querySelector('.ft345__mesa-panel')){
      const panel=document.createElement('section');
      panel.className='ft345__mesa-panel';
      panel.hidden=true;
      panel.innerHTML=`
        <div class="ft345__mesa-backdrop" aria-hidden="true"></div>
        <div class="ft345__mesa-shell" role="dialog" aria-modal="true" aria-label="Mesa Real">
          <header class="ft345__mesa-header">
            <div>
              <h3>Mesa Real</h3>
              <p class="ft345__mesa-count">0 cartas reveladas</p>
            </div>
            <button type="button" class="ft345__mesa-close">Voltar</button>
          </header>
          <div class="ft345__mesa-grid" data-mesa-grid></div>
        </div>`;
      this.root.append(panel);
    }

    this.mesaPanel=this.root.querySelector('.ft345__mesa-panel');
    this.mesaGrid=this.root.querySelector('[data-mesa-grid]');
    this.mesaCount=this.root.querySelector('.ft345__mesa-count');
  }

  bindLocal(){
    if(this.reveal.dataset.ft345Bound==='true')return;
    this.reveal.dataset.ft345Bound='true';
    const signal=this.abort.signal;

    const point=e=>{
      const r=this.reveal.getBoundingClientRect();
      if(!r.width||!r.height)return;
      this.reveal.style.setProperty('--ft345-x',`${Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))}%`);
      this.reveal.style.setProperty('--ft345-y',`${Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))}%`);
    };

    this.reveal.addEventListener('pointerdown',e=>{
      point(e);
      this.reveal.classList.add('ft345-touch');
      this.engine?.start();
    },{passive:true,signal});
    this.reveal.addEventListener('pointermove',e=>{
      if(this.reveal.classList.contains('ft345-touch'))point(e);
    },{passive:true,signal});
    const release=()=>this.reveal.classList.remove('ft345-touch');
    this.reveal.addEventListener('pointerup',release,{passive:true,signal});
    this.reveal.addEventListener('pointercancel',release,{passive:true,signal});

    this.head?.addEventListener('click',e=>{
      if(e.target.closest('.ft345__mesa-real')){
        e.preventDefault();
        this.openMesa();
      }
    },{signal});

    this.root.addEventListener('click',e=>{
      if(e.target.closest('.ft345__mesa-close')||e.target.closest('.ft345__mesa-backdrop')){
        e.preventDefault();
        this.closeMesa();
      }
    },{signal});
  }

  observe(){
    this.observer?.disconnect();
    this.observer=new MutationObserver(()=>{this.sync();this.syncMesa();});
    this.observer.observe(this.grid,{childList:true,subtree:true});
  }

  sync(){
    const revealed=this.grid.querySelectorAll('[data-index]').length;
    const remaining=Math.max(0,78-revealed);
    if(this.head){
      const h=this.head.querySelector('h2');
      const p=this.head.querySelector('p');
      if(h)h.textContent='Tarot Livre';
      if(p)p.textContent=`${revealed}/78`;
    }
    if(this.signal){
      this.signal.textContent=revealed===0?'Toque a Orbe.':remaining===0?'O universo está completo.':'O fogo celestial já está trazendo a próxima carta.';
    }
    if(this.mesaCount){
      this.mesaCount.textContent=`${revealed} ${revealed===1?'carta revelada':'cartas reveladas'}`;
    }
  }

  syncMesa(){
    if(!this.mesaGrid)return;
    const items=[...this.grid.querySelectorAll('[data-index]')];
    this.mesaGrid.innerHTML='';
    if(!items.length){
      const empty=document.createElement('div');
      empty.className='ft345__mesa-empty';
      empty.textContent='Nenhuma carta revelada ainda.';
      this.mesaGrid.append(empty);
      return;
    }
    const frag=document.createDocumentFragment();
    items.forEach((item,idx)=>{
      const card=document.createElement('button');
      card.type='button';
      card.className='ft345__mesa-card';
      const img=item.querySelector('img');
      if(img)card.append(img.cloneNode(true));
      const label=document.createElement('span');
      label.className='ft345__mesa-label';
      label.textContent=labelOf(item,idx);
      card.append(label);
      frag.append(card);
    });
    this.mesaGrid.append(frag);
  }

  openMesa(){
    this.syncMesa();
    this.mesaPanel.hidden=false;
    document.documentElement.classList.add('ft345-mesa-open');
    requestAnimationFrame(()=>this.mesaPanel.classList.add('is-open'));
  }

  closeMesa(){
    this.mesaPanel.classList.remove('is-open');
    document.documentElement.classList.remove('ft345-mesa-open');
    setTimeout(()=>{if(!this.mesaPanel.classList.contains('is-open'))this.mesaPanel.hidden=true;},380);
  }

  birth(detail){
    const position=Number(detail?.position??-1);
    this.engine?.burst();

    const button=Number.isFinite(position)?this.grid.querySelector(`[data-index="${position}"]`):null;
    if(button){
      button.classList.remove('ft345-newborn');
      requestAnimationFrame(()=>{
        button.classList.add('ft345-newborn');
        setTimeout(()=>button.classList.remove('ft345-newborn'),1050);
      });
    }

    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:position===0?'A primeira carta nasceu do fogo celestial.':'Outra carta atravessou o fogo celestial e se revelou.',
        source:'tarot-free-v345',
        private:false
      })
    }));
  }

  status(){
    const revealed=this.grid?.querySelectorAll('[data-index]').length||0;
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V301',
      canvasFireEngine:true,
      revealed,
      deckSize:78,
      normalOnly:true,
      noRepeats:true,
      noInterpretations:true,
      gridColumns:6,
      mesaRealOverlay:true,
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    this.engine?.destroy();
    document.documentElement.classList.remove('ft345-mesa-open');
    this.root?.removeAttribute('data-tarot-supreme');
    this.world?.classList.remove('ft345','ft345-awake');
  }
}

export function installFreeTarotFireEngineV345(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new FreeTarotFireEngineV345();
  globalThis[MARK]=instance;
  globalThis.divinaFreeTarotV345=instance;
  return instance;
}
