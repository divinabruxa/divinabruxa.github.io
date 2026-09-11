/* DIVINA BRUXA — TAROT LIVRE ZERO V400
   Um único mundo. Um único motor. Chama Viva em Canvas 2D.
   78 cartas diretas, sem repetição, sem significados, seis por linha. */

import { CARDS } from './tarot-data.js';
import { cardImageMarkup, prepareCardImage, preloadCardImages } from './tarot-image-runtime.js?v=148';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=182';
import {
  DECK_SIZE,
  drawNextCard,
  resetTarotState,
  shuffleRemainingCards
} from './tarot-session.js?v=182';
import { store } from './storage.js';

const VERSION='V400';
const STORAGE_KEY='free-tarot';
const FAST_BIRTH_MS=430;

const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';
const escapeText=value=>String(value??'').replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[ch]));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,ms)));

function announce(message){
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast',{detail:message}));
}

class LivingFlameV400 {
  constructor(backCanvas,frontCanvas,universe,orb,cardZone){
    this.back=backCanvas;
    this.front=frontCanvas;
    this.bctx=backCanvas.getContext('2d',{alpha:true,desynchronized:true});
    this.fctx=frontCanvas.getContext('2d',{alpha:true,desynchronized:true});
    this.universe=universe;
    this.orb=orb;
    this.cardZone=cardZone;
    this.scale=Math.min(2,Math.max(1,devicePixelRatio||1));
    this.width=1;
    this.height=1;
    this.stars=[];
    this.dust=[];
    this.flames=[];
    this.burstUntil=0;
    this.running=false;
    this.raf=0;
    this.last=performance.now();
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(universe);
    this.resize();
  }

  resize(){
    const r=this.universe.getBoundingClientRect();
    this.width=Math.max(1,r.width);
    this.height=Math.max(1,r.height);
    for(const c of [this.back,this.front]){
      c.width=Math.round(this.width*this.scale);
      c.height=Math.round(this.height*this.scale);
      c.style.width=`${this.width}px`;
      c.style.height=`${this.height}px`;
    }
    this.bctx.setTransform(this.scale,0,0,this.scale,0,0);
    this.fctx.setTransform(this.scale,0,0,this.scale,0,0);
    const n=constrained()?48:96;
    this.stars=Array.from({length:n},()=>({
      x:Math.random()*this.width,
      y:Math.random()*this.height,
      r:.35+Math.random()*1.25,
      a:.12+Math.random()*.72,
      phase:Math.random()*Math.PI*2,
      speed:.25+Math.random()*.95,
      gold:Math.random()<.18
    }));
  }

  center(el){
    const r=el.getBoundingClientRect();
    const u=this.universe.getBoundingClientRect();
    return {
      x:r.left+r.width/2-u.left,
      y:r.top+r.height/2-u.top,
      w:r.width,
      h:r.height
    };
  }

  color(kind,a){
    if(kind==='gold') return `rgba(255,190,74,${a})`;
    if(kind==='white') return `rgba(255,242,205,${a})`;
    if(kind==='pink') return `rgba(244,79,211,${a})`;
    return `rgba(164,62,255,${a})`;
  }

  spawnAmbient(){
    if(reducedMotion())return;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);

    if(Math.random()<.70){
      const t=Math.random();
      const curveX=o.x+(c.x-o.x)*t + Math.sin(t*Math.PI*3)*28*(1-t);
      const curveY=o.y+(c.y-o.y)*t;
      this.dust.push({
        x:curveX+(Math.random()-.5)*24,
        y:curveY+(Math.random()-.5)*22,
        vx:(Math.random()-.5)*14,
        vy:-10-Math.random()*22,
        life:.65+Math.random()*.95,
        age:0,
        size:1+Math.random()*3.8,
        kind:Math.random()<.32?'gold':'violet'
      });
    }

    if(Math.random()<.38){
      const ang=Math.random()*Math.PI*2;
      const rad=o.w*(.38+.18*Math.random());
      this.flames.push({
        x:o.x+Math.cos(ang)*rad,
        y:o.y+Math.sin(ang)*rad,
        vx:Math.cos(ang)*(12+Math.random()*20),
        vy:-24-Math.random()*24,
        life:.5+Math.random()*.8,
        age:0,
        size:3+Math.random()*7,
        kind:Math.random()<.45?'gold':'violet'
      });
    }
  }

  burst(){
    if(reducedMotion())return;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    const dx=c.x-o.x;
    const dy=c.y-o.y;
    const base=Math.atan2(dy,dx);
    const count=constrained()?56:128;

    for(let i=0;i<count;i++){
      const hot=i<count*.38;
      const angle=base+(Math.random()-.5)*.72;
      const speed=(hot?360:220)+Math.random()*(hot?460:340);
      this.flames.push({
        x:o.x+(Math.random()-.5)*o.w*.26,
        y:o.y+(Math.random()-.5)*o.h*.20,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:.30+Math.random()*.52,
        age:0,
        size:(hot?4:2)+Math.random()*(hot?10:7),
        kind:hot?(Math.random()<.72?'gold':'white'):(Math.random()<.62?'violet':'pink')
      });
    }

    for(let i=0;i<(constrained()?24:58);i++){
      const ang=Math.random()*Math.PI*2;
      const speed=80+Math.random()*220;
      this.dust.push({
        x:c.x+(Math.random()-.5)*c.w*.44,
        y:c.y+(Math.random()-.5)*c.h*.48,
        vx:Math.cos(ang)*speed,
        vy:Math.sin(ang)*speed,
        life:.36+Math.random()*.54,
        age:0,
        size:1.2+Math.random()*4,
        kind:Math.random()<.48?'gold':'violet'
      });
    }

    this.burstUntil=performance.now()+700;
    this.start();
  }

  pulse(){
    this.burstUntil=Math.max(this.burstUntil,performance.now()+320);
    this.start();
  }

  drawBack(t){
    const ctx=this.bctx;
    ctx.clearRect(0,0,this.width,this.height);

    const nebula=ctx.createRadialGradient(
      this.width*.50,this.height*.60,0,
      this.width*.50,this.height*.60,Math.max(this.width,this.height)*.58
    );
    nebula.addColorStop(0,'rgba(91,25,159,.15)');
    nebula.addColorStop(.28,'rgba(70,18,132,.10)');
    nebula.addColorStop(.62,'rgba(31,8,62,.04)');
    nebula.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=nebula;
    ctx.fillRect(0,0,this.width,this.height);

    for(const s of this.stars){
      const k=.38+.62*Math.sin(t*.001*s.speed+s.phase);
      ctx.beginPath();
      ctx.fillStyle=s.gold
        ?`rgba(255,213,140,${s.a*k})`
        :`rgba(234,218,255,${s.a*k})`;
      ctx.shadowBlur=8*k;
      ctx.shadowColor=s.gold?'rgba(255,190,90,.6)':'rgba(177,80,255,.6)';
      ctx.arc(s.x,s.y,Math.max(.25,s.r*k),0,Math.PI*2);
      ctx.fill();
    }
    ctx.shadowBlur=0;
  }

  flameRibbon(ctx,t,intensity=1){
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    ctx.save();
    ctx.globalCompositeOperation='lighter';

    for(let layer=0;layer<4;layer++){
      const phase=t*.0031+layer*1.43;
      const sway=Math.sin(phase)*22 + Math.sin(phase*.47)*13;
      const grad=ctx.createLinearGradient(o.x,o.y,c.x,c.y);
      grad.addColorStop(0,'rgba(158,57,255,0)');
      grad.addColorStop(.15,`rgba(180,65,255,${.12*intensity})`);
      grad.addColorStop(.48,`rgba(240,91,219,${.14*intensity})`);
      grad.addColorStop(.69,`rgba(255,150,59,${.20*intensity})`);
      grad.addColorStop(.87,`rgba(255,220,137,${.24*intensity})`);
      grad.addColorStop(1,'rgba(255,244,210,0)');
      ctx.strokeStyle=grad;
      ctx.lineWidth=(18-layer*3)*intensity;
      ctx.shadowBlur=20+14*intensity;
      ctx.shadowColor=layer%2?'rgba(255,151,65,.55)':'rgba(190,65,255,.60)';
      ctx.beginPath();
      ctx.moveTo(o.x,o.y);
      ctx.bezierCurveTo(
        o.x+sway+(layer-1.5)*16,
        o.y-(o.y-c.y)*.32,
        c.x-sway+(1.5-layer)*12,
        o.y-(o.y-c.y)*.73,
        c.x,c.y
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  drawCardCrown(ctx,t,intensity){
    const c=this.center(this.cardZone);
    if(intensity<=.01)return;
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    const n=18;
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2 + t*.002*(i%2?1:-1);
      const rx=c.w*.52+Math.sin(t*.004+i)*10;
      const ry=c.h*.48+Math.cos(t*.003+i)*14;
      const x=c.x+Math.cos(a)*rx;
      const y=c.y+Math.sin(a)*ry;
      const r=8+intensity*(8+(i%4)*3);
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(255,242,202,.90)');
      g.addColorStop(.28,'rgba(255,156,64,.62)');
      g.addColorStop(.60,'rgba(215,72,255,.34)');
      g.addColorStop(1,'rgba(215,72,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  updateParticles(ctx,arr,dt){
    const keep=[];
    for(const p of arr){
      p.age+=dt;
      if(p.age>=p.life)continue;
      const k=1-p.age/p.life;
      p.x+=p.vx*dt;
      p.y+=p.vy*dt;
      p.vx*=.992;
      p.vy*=.992;

      ctx.save();
      ctx.globalCompositeOperation='lighter';
      const alpha=Math.min(1,k*1.8);
      ctx.fillStyle=this.color(p.kind,alpha*.78);
      ctx.shadowBlur=12+p.size*2;
      ctx.shadowColor=this.color(p.kind,Math.min(.85,alpha));
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.4,p.size*k),0,Math.PI*2);
      ctx.fill();

      ctx.strokeStyle=this.color(p.kind,alpha*.22);
      ctx.lineWidth=Math.max(.5,p.size*.28*k);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x-p.vx*.018,p.y-p.vy*.018);
      ctx.stroke();
      ctx.restore();
      keep.push(p);
    }
    return keep;
  }

  frame(t){
    if(!this.running)return;
    const dt=Math.min(.034,Math.max(.001,(t-this.last)/1000));
    this.last=t;

    this.drawBack(t);
    const ctx=this.fctx;
    ctx.clearRect(0,0,this.width,this.height);

    this.spawnAmbient();

    const burst=Math.max(0,Math.min(1,(this.burstUntil-t)/700));
    this.flameRibbon(ctx,t,.34+burst*.92);
    this.drawCardCrown(ctx,t,burst);
    this.dust=this.updateParticles(ctx,this.dust,dt).slice(-240);
    this.flames=this.updateParticles(ctx,this.flames,dt).slice(-260);

    if(routeNow()==='tarot' || this.flames.length || this.dust.length){
      this.raf=requestAnimationFrame(tt=>this.frame(tt));
    }else{
      this.running=false;
    }
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

  destroy(){
    this.stop();
    this.resizeObserver.disconnect();
    this.flames=[];
    this.dust=[];
  }
}

export class TarotLivreZeroV400 {
  constructor(root,{storage=store}={}){
    if(!root)throw new TypeError('O mundo do Tarot Livre não foi encontrado.');

    this.root=root;
    this.storage=storage;
    this.abort=new AbortController();
    this.coordinator=new TarotSessionCoordinator({storage,key:STORAGE_KEY});
    this.state=this.coordinator.latest();
    this.selected=this.state.revealed.length?this.state.revealed.length-1:-1;
    this.busy=false;
    this.touchStart=null;
    this.mesaOpen=false;

    this.root.innerHTML='';
    this.root.dataset.tarotWorld='zero-v400';
    this.root.className=this.root.className.replace(/\btarot-world-v301-host\b/g,'').trim();
    this.build();
    this.bind();
    this.render(false);

    this.fire=new LivingFlameV400(
      this.backCanvas,
      this.frontCanvas,
      this.universe,
      this.revealButton,
      this.cardZone
    );

    this.fire.start();
    preloadCardImages([this.state.waiting[0],this.state.waiting[1]],2);

    document.documentElement.dataset.tarotLivre='v400';
    document.dispatchEvent(new CustomEvent('divina:tarot-zero-ready',{
      detail:Object.freeze({
        version:400,
        engine:'LivingFlameV400',
        deckSize:DECK_SIZE,
        normalOnly:true,
        noRepeats:true
      })
    }));
  }

  build(){
    this.root.innerHTML=`
      <div class="tl400" data-phase="rest">
        <header class="tl400__head">
          <div class="tl400__title">
            <small>DIVINA BRUXA</small>
            <h2>Tarot Livre</h2>
          </div>
          <div class="tl400__head-actions">
            <p><b data-count>0</b><span>/78</span></p>
            <button type="button" class="tl400__mesa-button" data-mesa-open>MESA REAL</button>
          </div>
        </header>

        <section class="tl400__universe" aria-label="Tarot Livre — Chama Viva">
          <canvas class="tl400__canvas tl400__canvas--back" data-fire-back aria-hidden="true"></canvas>

          <div class="tl400__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas já reveladas.">
            <div class="tl400__card" data-current-card data-empty="true">
              <div class="tl400__empty-card" aria-hidden="true"><span>✦</span></div>
            </div>
          </div>

          <canvas class="tl400__canvas tl400__canvas--front" data-fire-front aria-hidden="true"></canvas>

          <button class="tl400__orb" type="button" data-reveal aria-label="Revelar uma carta pela Chama Viva">
            <span class="tl400__orb-image" data-orb-surface="tarot"></span>
            <span class="tl400__orb-touch" aria-hidden="true"></span>
          </button>

          <div class="tl400__signal" data-signal aria-live="polite">Toque a Orbe.</div>

          <nav class="tl400__nav" aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">←</button>
            <span data-position>0 · 0</span>
            <button type="button" data-next aria-label="Próxima carta">→</button>
          </nav>
        </section>

        <div class="tl400__actions" aria-label="Ações do Tarot Livre">
          <button type="button" data-shuffle>EMBARALHAR</button>
          <button type="button" data-reset>NOVO CÍRCULO</button>
        </div>

        <section class="tl400__constellation" aria-labelledby="tl400ConstellationTitle">
          <header>
            <h3 id="tl400ConstellationTitle">Constelação</h3>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl400__grid" data-grid role="grid" aria-label="Cartas reveladas, seis por linha" aria-colcount="6"></div>
        </section>

        <section class="tl400__mesa" data-mesa hidden aria-label="Mesa Real">
          <div class="tl400__mesa-backdrop" data-mesa-close aria-hidden="true"></div>
          <div class="tl400__mesa-shell" role="dialog" aria-modal="true" aria-labelledby="tl400MesaTitle">
            <header>
              <div>
                <small>DIVINA BRUXA</small>
                <h3 id="tl400MesaTitle">Mesa Real</h3>
                <p data-mesa-count>0 cartas reveladas</p>
              </div>
              <button type="button" data-mesa-close>VOLTAR</button>
            </header>
            <div class="tl400__mesa-grid" data-mesa-grid role="grid" aria-colcount="6"></div>
          </div>
        </section>

        <p class="tl400__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world=this.root.querySelector('.tl400');
    this.universe=this.root.querySelector('.tl400__universe');
    this.backCanvas=this.root.querySelector('[data-fire-back]');
    this.frontCanvas=this.root.querySelector('[data-fire-front]');
    this.revealButton=this.root.querySelector('[data-reveal]');
    this.cardZone=this.root.querySelector('[data-card-zone]');
    this.card=this.root.querySelector('[data-current-card]');
    this.signal=this.root.querySelector('[data-signal]');
    this.count=this.root.querySelector('[data-count]');
    this.position=this.root.querySelector('[data-position]');
    this.remaining=this.root.querySelector('[data-remaining]');
    this.grid=this.root.querySelector('[data-grid]');
    this.prev=this.root.querySelector('[data-prev]');
    this.next=this.root.querySelector('[data-next]');
    this.shuffle=this.root.querySelector('[data-shuffle]');
    this.resetButton=this.root.querySelector('[data-reset]');
    this.live=this.root.querySelector('[data-live]');
    this.mesa=this.root.querySelector('[data-mesa]');
    this.mesaGrid=this.root.querySelector('[data-mesa-grid]');
    this.mesaCount=this.root.querySelector('[data-mesa-count]');
  }

  bind(){
    const options={signal:this.abort.signal};

    this.revealButton.addEventListener('click',()=>this.draw(),options);
    this.prev.addEventListener('click',()=>this.move(-1),options);
    this.next.addEventListener('click',()=>this.move(1),options);
    this.shuffle.addEventListener('click',()=>this.reshuffle(),options);
    this.resetButton.addEventListener('click',()=>this.reset(),options);

    this.root.addEventListener('click',event=>{
      if(event.target.closest('[data-mesa-open]')){
        event.preventDefault();
        this.openMesa();
        return;
      }
      if(event.target.closest('[data-mesa-close]')){
        event.preventDefault();
        this.closeMesa();
        return;
      }
      const mesaCard=event.target.closest('[data-mesa-index]');
      if(mesaCard){
        const index=Number(mesaCard.dataset.mesaIndex);
        if(Number.isInteger(index)){
          this.show(index,false);
          this.closeMesa();
        }
      }
    },options);

    this.cardZone.addEventListener('keydown',event=>{
      if(event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.key==='ArrowLeft'){event.preventDefault();this.move(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();this.move(1);}
    },options);

    this.cardZone.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      this.touchStart={x:event.clientX,y:event.clientY,at:performance.now()};
    },options);

    this.cardZone.addEventListener('pointerup',event=>{
      const start=this.touchStart;
      this.touchStart=null;
      if(!start)return;
      const dx=event.clientX-start.x;
      const dy=event.clientY-start.y;
      if(Math.abs(dx)<44||Math.abs(dx)<=Math.abs(dy)*1.2)return;
      this.move(dx<0?1:-1);
    },options);
    this.cardZone.addEventListener('pointercancel',()=>{this.touchStart=null;},options);

    this.grid.addEventListener('click',event=>{
      const button=event.target.closest('[data-index]');
      if(!button)return;
      const index=Number(button.dataset.index);
      if(Number.isInteger(index))this.show(index,true);
    },options);

    this.onStorage=event=>{
      if(!event.key?.endsWith(`:${STORAGE_KEY}`)||!event.newValue)return;
      const latest=this.coordinator.latest();
      if(latest.revision<=this.state.revision&&latest.sessionId===this.state.sessionId)return;
      this.state=latest;
      this.selected=Math.min(this.selected,this.state.revealed.length-1);
      if(this.selected<0&&this.state.revealed.length)this.selected=this.state.revealed.length-1;
      this.render(false);
    };
    globalThis.addEventListener?.('storage',this.onStorage,{signal:this.abort.signal});
  }

  setPhase(phase){
    this.world.dataset.phase=phase;
    const busy=phase!=='rest';
    this.world.setAttribute('aria-busy',String(busy));
    this.revealButton.disabled=busy||this.state.completed;
  }

  async draw(){
    if(this.busy||this.state.completed)return null;

    this.busy=true;
    this.setPhase('ignite');
    this.signal.textContent='A Chama Viva desperta…';
    this.fire?.burst();

    try{
      const result=await this.coordinator.commit(latest=>drawNextCard(latest));
      this.state=result.state;
      if(result.cardId===null)return null;
      this.selected=result.position;

      const card=CARDS[result.cardId];
      const imageTask=prepareCardImage(card,{timeout:1600,priority:'high'});

      // A carta atual continua visível enquanto a próxima imagem termina de preparar.
      await imageTask;

      this.setPhase('birth');
      this.show(result.position,true);
      this.signal.textContent=card?.name||'Carta revelada';
      this.live.textContent=`${card?.name||'Carta'}, direta. ${result.position+1} de 78.`;

      if(!reducedMotion())await wait(FAST_BIRTH_MS);
      this.setPhase('rest');

      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed',{
        detail:{
          cardId:result.cardId,
          position:result.position,
          remaining:this.state.waiting.length,
          engine:'living-flame-v400'
        }
      }));

      preloadCardImages([this.state.waiting[0],this.state.waiting[1]],2);
      return result.cardId;
    }catch(error){
      console.error('[Divina] Chama Viva interrompida',error);
      this.state=this.coordinator.latest();
      this.selected=this.state.revealed.length-1;
      this.render(false);
      this.signal.textContent='O círculo foi preservado. Toque novamente.';
      announce('A revelação foi interrompida, mas nenhuma carta foi perdida.');
      return null;
    }finally{
      this.busy=false;
      this.setPhase('rest');
    }
  }

  show(index,animate=false){
    if(!Number.isInteger(index)||index<0||index>=this.state.revealed.length)return false;

    this.selected=index;
    const cardId=this.state.revealed[index];
    const card=CARDS[cardId];
    if(!card||card.orientation!=='normal')return false;

    this.card.innerHTML=`${cardImageMarkup(card,{
      alt:`${card.name}, direta`,
      priority:'high'
    })}<div class="tl400__card-name"><b>${escapeText(card.name)}</b><small>${index+1} / ${this.state.revealed.length}</small></div>`;
    this.card.dataset.empty='false';
    this.cardZone.setAttribute(
      'aria-label',
      `${card.name}, direta. Carta ${index+1} de ${this.state.revealed.length}. Deslize ou use as setas para navegar.`
    );

    if(animate&&!reducedMotion()){
      this.card.animate([
        {opacity:.10,transform:'translate3d(0,40px,0) scale(.78)',filter:'blur(10px) brightness(1.8)'},
        {opacity:1,transform:'translate3d(0,-5px,0) scale(1.025)',filter:'blur(0) brightness(1.15)',offset:.62},
        {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0) brightness(1)'}
      ],{
        duration:420,
        easing:'cubic-bezier(.16,.85,.18,1)'
      });
    }

    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button=>{
      const active=Number(button.dataset.index)===index;
      button.classList.toggle('is-current',active);
      button.setAttribute('aria-current',active?'true':'false');
    });
    preloadCardImages([this.state.revealed[index-1],this.state.revealed[index+1]],2);
    return true;
  }

  move(direction){
    if(this.busy||!this.state.revealed.length)return false;
    const next=this.selected+direction;
    if(next<0||next>=this.state.revealed.length)return false;
    this.show(next,false);

    if(!reducedMotion()){
      const x=direction>0?22:-22;
      this.card.animate([
        {opacity:.46,transform:`translate3d(${x}px,0,0) scale(.99)`},
        {opacity:1,transform:'translate3d(0,0,0) scale(1)'}
      ],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    return true;
  }

  async reshuffle(){
    if(this.busy||this.state.waiting.length<2)return false;
    const revealed=this.state.revealed.join(',');

    try{
      this.state=await this.coordinator.commit(latest=>shuffleRemainingCards(latest));
      if(this.state.revealed.join(',')!==revealed)throw new Error('As cartas já reveladas mudaram.');
      preloadCardImages([this.state.waiting[0],this.state.waiting[1]],2);
      this.signal.textContent='O universo mudou as cartas ocultas.';
      this.fire?.pulse();
      return true;
    }catch{
      announce('Não foi possível embaralhar agora. O círculo revelado continua intacto.');
      return false;
    }
  }

  async reset(force=false){
    if(this.busy)return false;
    if(
      this.state.revealed.length &&
      force!==true &&
      globalThis.confirm &&
      !globalThis.confirm('Abrir um novo círculo e fechar as cartas reveladas agora?')
    )return false;

    try{
      this.state=await this.coordinator.commit(latest=>resetTarotState({
        now:()=>Math.max(Date.now(),Number(latest.updatedAt||0)+1)
      }));
      this.selected=-1;
      this.render(false);
      this.signal.textContent='Novo círculo. Toque a Orbe quando quiser.';
      this.fire?.pulse();
      return true;
    }catch{
      announce('O círculo atual foi preservado. Tente novamente.');
      return false;
    }
  }

  render(animateCurrent=false){
    const revealed=this.state.revealed.length;
    this.count.textContent=String(revealed);
    this.remaining.textContent=this.state.completed
      ?'Círculo completo'
      :`${this.state.waiting.length} aguardam`;

    if(!revealed){
      this.selected=-1;
      this.card.dataset.empty='true';
      this.card.innerHTML='<div class="tl400__empty-card" aria-hidden="true"><span>✦</span></div>';
      this.cardZone.setAttribute('aria-label','Nenhuma carta revelada. Toque a Orbe para começar.');
    }else{
      this.selected=Math.max(0,Math.min(this.selected,revealed-1));
      this.show(this.selected,animateCurrent);
    }

    this.renderGrid();
    this.renderMesaGrid();
    this.updateControls();
  }

  renderGrid(){
    this.grid.innerHTML=this.state.revealed.map((cardId,index)=>{
      const card=CARDS[cardId];
      if(!card)return'';
      return `<button type="button" data-index="${index}" role="gridcell" aria-label="${escapeText(card.name)}, carta ${index+1}">${cardImageMarkup(card,{alt:'',priority:'low'})}<span>${index+1}</span></button>`;
    }).join('');
  }

  renderMesaGrid(){
    if(!this.mesaGrid)return;
    const revealed=this.state.revealed.length;
    this.mesaCount.textContent=`${revealed} ${revealed===1?'carta revelada':'cartas reveladas'}`;

    if(!revealed){
      this.mesaGrid.innerHTML='<div class="tl400__mesa-empty">Nenhuma carta revelada ainda.</div>';
      return;
    }

    this.mesaGrid.innerHTML=this.state.revealed.map((cardId,index)=>{
      const card=CARDS[cardId];
      if(!card)return'';
      return `<button type="button" data-mesa-index="${index}" role="gridcell" aria-label="${escapeText(card.name)}, carta ${index+1}">${cardImageMarkup(card,{alt:'',priority:'low'})}<span>${escapeText(card.name)}</span></button>`;
    }).join('');
  }

  updateControls(){
    const revealed=this.state.revealed.length;
    this.position.textContent=revealed?`${this.selected+1} · ${revealed}`:'0 · 0';
    this.prev.disabled=!revealed||this.selected<=0||this.busy;
    this.next.disabled=!revealed||this.selected>=revealed-1||this.busy;
    this.shuffle.disabled=this.busy||this.state.waiting.length<2;
    this.resetButton.disabled=this.busy;
    this.revealButton.disabled=this.busy||this.state.completed;
    this.renderMesaGrid();
  }

  openMesa(){
    this.renderMesaGrid();
    this.mesaOpen=true;
    this.mesa.hidden=false;
    document.documentElement.classList.add('tl400-mesa-open');
    requestAnimationFrame(()=>this.mesa.classList.add('is-open'));
  }

  closeMesa(){
    if(!this.mesaOpen)return;
    this.mesaOpen=false;
    this.mesa.classList.remove('is-open');
    document.documentElement.classList.remove('tl400-mesa-open');
    setTimeout(()=>{
      if(!this.mesaOpen)this.mesa.hidden=true;
    },360);
  }

  destroy(){
    this.abort.abort();
    this.fire?.destroy();
    document.documentElement.classList.remove('tl400-mesa-open');
    delete document.documentElement.dataset.tarotLivre;
  }
}
