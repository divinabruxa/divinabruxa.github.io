/* DIVINA BRUXA — TAROT LIVRE CHAMA VISÍVEL V401
   Um único mundo. Canvas 2D forte, visível e resiliente no iPhone.
   78 cartas diretas, sem repetição, sem significados, seis por linha.
   Embaralhar e Novo Círculo ficam sempre acessíveis. */

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

const VERSION='V401';
const STORAGE_KEY='free-tarot';
const BIRTH_SETTLE_MS=270;
const RESET_ARM_MS=3500;

const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';
const escapeText=value=>String(value??'').replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[ch]));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,ms)));

function announce(message){
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast',{detail:message}));
}

class LivingFlameV401 {
  constructor({back,front,universe,orb,cardZone}){
    this.back=back;
    this.front=front;
    this.universe=universe;
    this.orb=orb;
    this.cardZone=cardZone;

    this.bctx=back.getContext('2d',{alpha:true});
    this.fctx=front.getContext('2d',{alpha:true});
    this.supported=Boolean(this.bctx&&this.fctx);

    this.scale=Math.min(2,Math.max(1,globalThis.devicePixelRatio||1));
    this.width=1;
    this.height=1;
    this.stars=[];
    this.embers=[];
    this.sparks=[];
    this.burstUntil=0;
    this.shockUntil=0;
    this.running=false;
    this.raf=0;
    this.last=performance.now();
    this.lastLowMotionFrame=0;

    if(globalThis.ResizeObserver){
      this.resizeObserver=new ResizeObserver(()=>this.resize());
      this.resizeObserver.observe(universe);
    }else{
      this.onResize=()=>this.resize();
      addEventListener('resize',this.onResize);
    }

    this.resize();
  }

  resize(){
    if(!this.supported)return;
    const rect=this.universe.getBoundingClientRect();
    this.width=Math.max(1,rect.width);
    this.height=Math.max(1,rect.height);

    for(const canvas of [this.back,this.front]){
      canvas.width=Math.round(this.width*this.scale);
      canvas.height=Math.round(this.height*this.scale);
      canvas.style.width=`${this.width}px`;
      canvas.style.height=`${this.height}px`;
    }
    this.bctx.setTransform(this.scale,0,0,this.scale,0,0);
    this.fctx.setTransform(this.scale,0,0,this.scale,0,0);

    const count=constrained()?54:112;
    this.stars=Array.from({length:count},()=>({
      x:Math.random()*this.width,
      y:Math.random()*this.height,
      r:.45+Math.random()*1.65,
      a:.18+Math.random()*.76,
      phase:Math.random()*Math.PI*2,
      speed:.24+Math.random()*1.05,
      gold:Math.random()<.22
    }));
  }

  center(el){
    const rect=el.getBoundingClientRect();
    const host=this.universe.getBoundingClientRect();
    return {
      x:rect.left+rect.width/2-host.left,
      y:rect.top+rect.height/2-host.top,
      w:rect.width,
      h:rect.height
    };
  }

  rgba(kind,a){
    if(kind==='white')return `rgba(255,247,220,${a})`;
    if(kind==='gold')return `rgba(255,178,62,${a})`;
    if(kind==='orange')return `rgba(255,116,35,${a})`;
    if(kind==='pink')return `rgba(245,76,217,${a})`;
    return `rgba(157,54,255,${a})`;
  }

  spawnAmbient(){
    if(!this.supported)return;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);

    const low=reducedMotion();
    const emberChance=low?.28:.92;
    const sparkChance=low?.10:.50;

    if(Math.random()<emberChance){
      const t=Math.random();
      const bend=Math.sin(t*Math.PI*2.4)*34*(1-t);
      this.embers.push({
        x:o.x+(c.x-o.x)*t+bend+(Math.random()-.5)*22,
        y:o.y+(c.y-o.y)*t+(Math.random()-.5)*20,
        vx:(Math.random()-.5)*14,
        vy:-12-Math.random()*24,
        life:.72+Math.random()*1.18,
        age:0,
        size:1.5+Math.random()*4.8,
        kind:Math.random()<.42?'gold':'violet'
      });
    }

    if(Math.random()<sparkChance){
      const angle=Math.random()*Math.PI*2;
      const radius=o.w*(.32+.22*Math.random());
      this.sparks.push({
        x:o.x+Math.cos(angle)*radius,
        y:o.y+Math.sin(angle)*radius,
        vx:Math.cos(angle)*(22+Math.random()*40),
        vy:-32-Math.random()*42,
        life:.48+Math.random()*.88,
        age:0,
        size:2.2+Math.random()*6.5,
        kind:Math.random()<.46?'gold':'violet'
      });
    }
  }

  burst(){
    if(!this.supported)return;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    const dx=c.x-o.x;
    const dy=c.y-o.y;
    const base=Math.atan2(dy,dx);

    const low=reducedMotion();
    const count=low?44:(constrained()?82:164);

    for(let i=0;i<count;i++){
      const hot=i<count*.46;
      const angle=base+(Math.random()-.5)*(hot?.48:.90);
      const speed=(hot?420:250)+Math.random()*(hot?520:420);
      this.sparks.push({
        x:o.x+(Math.random()-.5)*o.w*.24,
        y:o.y+(Math.random()-.5)*o.h*.20,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:.26+Math.random()*.52,
        age:0,
        size:(hot?4.5:2)+Math.random()*(hot?12:8),
        kind:hot?(Math.random()<.62?'white':'gold'):(Math.random()<.56?'violet':'pink')
      });
    }

    for(let i=0;i<(low?20:(constrained()?34:72));i++){
      const angle=Math.random()*Math.PI*2;
      const speed=90+Math.random()*260;
      this.embers.push({
        x:c.x+(Math.random()-.5)*c.w*.54,
        y:c.y+(Math.random()-.5)*c.h*.52,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:.34+Math.random()*.62,
        age:0,
        size:1.5+Math.random()*5,
        kind:Math.random()<.52?'gold':'violet'
      });
    }

    const now=performance.now();
    this.burstUntil=now+760;
    this.shockUntil=now+420;
    this.start();
  }

  pulse(){
    const now=performance.now();
    this.burstUntil=Math.max(this.burstUntil,now+380);
    this.start();
  }

  drawUniverse(t){
    const ctx=this.bctx;
    ctx.clearRect(0,0,this.width,this.height);

    const field=ctx.createRadialGradient(
      this.width*.5,this.height*.62,0,
      this.width*.5,this.height*.62,Math.max(this.width,this.height)*.62
    );
    field.addColorStop(0,'rgba(84,19,153,.28)');
    field.addColorStop(.24,'rgba(69,13,139,.18)');
    field.addColorStop(.52,'rgba(31,5,65,.08)');
    field.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=field;
    ctx.fillRect(0,0,this.width,this.height);

    for(const s of this.stars){
      const pulse=.44+.56*Math.sin(t*.001*s.speed+s.phase);
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=s.gold
        ?`rgba(255,211,133,${s.a*pulse})`
        :`rgba(229,207,255,${s.a*pulse})`;
      ctx.shadowBlur=9*pulse;
      ctx.shadowColor=s.gold?'rgba(255,177,68,.75)':'rgba(160,58,255,.75)';
      ctx.beginPath();
      ctx.arc(s.x,s.y,Math.max(.35,s.r*pulse),0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawRibbon(t){
    const ctx=this.fctx;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    const burst=Math.max(0,Math.min(1,(this.burstUntil-t)/760));
    const intensity=.78+burst*1.12;

    ctx.save();
    ctx.globalCompositeOperation='lighter';

    // Wide purple body.
    for(let layer=0;layer<5;layer++){
      const phase=t*.0032+layer*1.21;
      const sway=Math.sin(phase)*30+Math.sin(phase*.51)*14;
      const gradient=ctx.createLinearGradient(o.x,o.y,c.x,c.y);
      gradient.addColorStop(0,'rgba(139,45,255,0)');
      gradient.addColorStop(.12,`rgba(166,52,255,${.18*intensity})`);
      gradient.addColorStop(.42,`rgba(236,71,224,${.20*intensity})`);
      gradient.addColorStop(.65,`rgba(255,118,39,${.23*intensity})`);
      gradient.addColorStop(.84,`rgba(255,196,83,${.34*intensity})`);
      gradient.addColorStop(1,'rgba(255,244,213,0)');
      ctx.strokeStyle=gradient;
      ctx.lineWidth=(30-layer*4)*intensity;
      ctx.shadowBlur=28+18*intensity;
      ctx.shadowColor=layer%2?'rgba(255,133,45,.72)':'rgba(181,52,255,.78)';
      ctx.beginPath();
      ctx.moveTo(o.x,o.y);
      ctx.bezierCurveTo(
        o.x+sway+(layer-2)*18,
        o.y-(o.y-c.y)*.30,
        c.x-sway+(2-layer)*15,
        o.y-(o.y-c.y)*.72,
        c.x,c.y
      );
      ctx.stroke();
    }

    // White-hot core.
    const core=ctx.createLinearGradient(o.x,o.y,c.x,c.y);
    core.addColorStop(0,'rgba(255,236,187,0)');
    core.addColorStop(.18,`rgba(255,215,132,${.40*intensity})`);
    core.addColorStop(.58,`rgba(255,170,70,${.48*intensity})`);
    core.addColorStop(.84,`rgba(255,239,202,${.65*intensity})`);
    core.addColorStop(1,'rgba(255,250,230,0)');
    ctx.strokeStyle=core;
    ctx.lineWidth=3.2+burst*4;
    ctx.shadowBlur=18+burst*18;
    ctx.shadowColor='rgba(255,211,128,.95)';
    ctx.beginPath();
    ctx.moveTo(o.x,o.y);
    ctx.bezierCurveTo(
      o.x+Math.sin(t*.004)*20,
      o.y-(o.y-c.y)*.32,
      c.x+Math.cos(t*.003)*18,
      o.y-(o.y-c.y)*.70,
      c.x,c.y
    );
    ctx.stroke();

    ctx.restore();
  }

  drawOrbFire(t){
    const ctx=this.fctx;
    const o=this.center(this.orb);
    ctx.save();
    ctx.globalCompositeOperation='lighter';

    for(let i=0;i<18;i++){
      const a=i/18*Math.PI*2+t*.0018*(i%2?1:-1);
      const radius=o.w*.52+Math.sin(t*.004+i)*7;
      const x=o.x+Math.cos(a)*radius;
      const y=o.y+Math.sin(a)*radius;
      const r=5+(i%4)*2;
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.3);
      g.addColorStop(0,'rgba(255,238,191,.72)');
      g.addColorStop(.25,'rgba(255,159,53,.52)');
      g.addColorStop(.58,'rgba(196,62,255,.34)');
      g.addColorStop(1,'rgba(196,62,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r*2.3,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCardFire(t){
    const ctx=this.fctx;
    const c=this.center(this.cardZone);
    const burst=Math.max(0,Math.min(1,(this.burstUntil-t)/760));
    const idle=.22;

    ctx.save();
    ctx.globalCompositeOperation='lighter';

    for(let i=0;i<22;i++){
      const a=i/22*Math.PI*2+t*.0022*(i%2?1:-1);
      const rx=c.w*.52+Math.sin(t*.004+i)*10;
      const ry=c.h*.49+Math.cos(t*.003+i)*13;
      const x=c.x+Math.cos(a)*rx;
      const y=c.y+Math.sin(a)*ry;
      const r=5+(burst*17)+((i%4)*1.6);
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.4);
      g.addColorStop(0,`rgba(255,242,204,${.35+burst*.48})`);
      g.addColorStop(.22,`rgba(255,154,49,${.28+burst*.44})`);
      g.addColorStop(.58,`rgba(207,61,255,${.20+burst*.30})`);
      g.addColorStop(1,'rgba(207,61,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r*2.4,0,Math.PI*2);
      ctx.fill();
    }

    // Persistent fire halo even when not revealing.
    const halo=ctx.createRadialGradient(c.x,c.y,Math.min(c.w,c.h)*.18,c.x,c.y,Math.max(c.w,c.h)*.62);
    halo.addColorStop(0,'rgba(255,195,78,0)');
    halo.addColorStop(.52,`rgba(255,137,42,${idle+burst*.14})`);
    halo.addColorStop(.72,`rgba(182,54,255,${idle+burst*.16})`);
    halo.addColorStop(1,'rgba(120,24,210,0)');
    ctx.fillStyle=halo;
    ctx.fillRect(c.x-c.w,c.y-c.h,c.w*2,c.h*2);

    ctx.restore();
  }

  updateParticles(ctx,list,dt){
    const keep=[];
    for(const p of list){
      p.age+=dt;
      if(p.age>=p.life)continue;

      const k=1-p.age/p.life;
      p.x+=p.vx*dt;
      p.y+=p.vy*dt;
      p.vx*=.991;
      p.vy*=.991;

      const alpha=Math.min(1,k*1.9);
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=this.rgba(p.kind,alpha*.84);
      ctx.shadowBlur=14+p.size*2.2;
      ctx.shadowColor=this.rgba(p.kind,Math.min(.92,alpha));
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.45,p.size*k),0,Math.PI*2);
      ctx.fill();

      ctx.strokeStyle=this.rgba(p.kind,alpha*.28);
      ctx.lineWidth=Math.max(.5,p.size*.32*k);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x-p.vx*.022,p.y-p.vy*.022);
      ctx.stroke();
      ctx.restore();

      keep.push(p);
    }
    return keep;
  }

  frame(t){
    if(!this.running||!this.supported)return;

    // Respect reduced motion by lowering frame rate, never by hiding the fire.
    if(reducedMotion()&&t-this.lastLowMotionFrame<75){
      this.raf=requestAnimationFrame(tt=>this.frame(tt));
      return;
    }
    if(reducedMotion())this.lastLowMotionFrame=t;

    const dt=Math.min(.034,Math.max(.001,(t-this.last)/1000));
    this.last=t;

    this.drawUniverse(t);
    this.fctx.clearRect(0,0,this.width,this.height);

    this.spawnAmbient();
    this.drawRibbon(t);
    this.drawOrbFire(t);
    this.drawCardFire(t);
    this.embers=this.updateParticles(this.fctx,this.embers,dt).slice(-260);
    this.sparks=this.updateParticles(this.fctx,this.sparks,dt).slice(-300);

    if(routeNow()==='tarot'||this.embers.length||this.sparks.length){
      this.raf=requestAnimationFrame(tt=>this.frame(tt));
    }else{
      this.running=false;
    }
  }

  start(){
    if(!this.supported||this.running)return;
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
    this.resizeObserver?.disconnect?.();
    if(this.onResize)removeEventListener('resize',this.onResize);
    this.embers=[];
    this.sparks=[];
  }
}

export class TarotLivreChamaV401 {
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
    this.resetArmed=false;
    this.resetTimer=0;

    this.root.innerHTML='';
    this.root.dataset.tarotWorld='chama-v401';
    this.root.className=this.root.className
      .replace(/\btarot-world-v301-host\b/g,'')
      .trim();

    this.build();
    this.bind();
    this.render(false);

    this.fire=new LivingFlameV401({
      back:this.backCanvas,
      front:this.frontCanvas,
      universe:this.universe,
      orb:this.revealButton,
      cardZone:this.cardZone
    });
    this.fire.start();

    preloadCardImages([this.state.waiting[0],this.state.waiting[1],this.state.waiting[2]],3);

    document.documentElement.dataset.tarotLivre='v401';
    document.dispatchEvent(new CustomEvent('divina:tarot-chama-ready',{
      detail:Object.freeze({
        version:401,
        engine:'LivingFlameV401',
        deckSize:DECK_SIZE,
        normalOnly:true,
        noRepeats:true
      })
    }));
  }

  build(){
    this.root.innerHTML=`
      <div class="tl401" data-phase="rest">
        <header class="tl401__head">
          <div class="tl401__title">
            <small>DIVINA BRUXA</small>
            <h2>Tarot Livre</h2>
          </div>

          <div class="tl401__head-right">
            <p class="tl401__count"><b data-count>0</b><span>/78</span></p>
            <button type="button" class="tl401__mesa-button" data-mesa-open>MESA REAL</button>
          </div>

          <div class="tl401__toolbar" aria-label="Controles do Tarot Livre">
            <button type="button" data-shuffle>EMBARALHAR</button>
            <button type="button" data-reset>NOVO CÍRCULO</button>
          </div>
        </header>

        <section class="tl401__universe" aria-label="Tarot Livre — Chama Viva">
          <canvas class="tl401__canvas tl401__canvas--back" data-fire-back aria-hidden="true"></canvas>

          <div class="tl401__fire-fallback" aria-hidden="true">
            <i></i><i></i><i></i>
          </div>

          <div class="tl401__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas já reveladas.">
            <div class="tl401__card" data-current-card data-empty="true">
              <div class="tl401__empty-card" aria-hidden="true"><span>✦</span></div>
            </div>
          </div>

          <canvas class="tl401__canvas tl401__canvas--front" data-fire-front aria-hidden="true"></canvas>

          <button class="tl401__orb" type="button" data-reveal aria-label="Revelar uma carta pela Chama Viva">
            <span class="tl401__orb-image" data-orb-surface="tarot"></span>
            <span class="tl401__orb-touch" aria-hidden="true"></span>
          </button>

          <div class="tl401__signal" data-signal aria-live="polite">Toque a Orbe.</div>

          <nav class="tl401__nav" aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">←</button>
            <span data-position>0 · 0</span>
            <button type="button" data-next aria-label="Próxima carta">→</button>
          </nav>
        </section>

        <section class="tl401__constellation" aria-labelledby="tl401ConstellationTitle">
          <header>
            <h3 id="tl401ConstellationTitle">Constelação</h3>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl401__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por linha" aria-colcount="6"></div>
        </section>

        <section class="tl401__mesa" data-mesa hidden aria-label="Mesa Real">
          <div class="tl401__mesa-backdrop" data-mesa-close aria-hidden="true"></div>
          <div class="tl401__mesa-shell" role="dialog" aria-modal="true" aria-labelledby="tl401MesaTitle">
            <header>
              <div>
                <small>DIVINA BRUXA</small>
                <h3 id="tl401MesaTitle">Mesa Real</h3>
                <p data-mesa-count>0 cartas reveladas</p>
              </div>
              <button type="button" data-mesa-close>VOLTAR</button>
            </header>
            <div class="tl401__mesa-grid" data-mesa-grid role="grid" aria-colcount="6"></div>
          </div>
        </section>

        <p class="tl401__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world=this.root.querySelector('.tl401');
    this.universe=this.root.querySelector('.tl401__universe');
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

    this.revealButton.addEventListener('pointerdown',event=>{
      const rect=this.revealButton.getBoundingClientRect();
      this.revealButton.style.setProperty('--tl401-x',`${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
      this.revealButton.style.setProperty('--tl401-y',`${Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))}%`);
      this.revealButton.classList.add('is-touching');
    },{passive:true,...options});
    const releaseOrb=()=>this.revealButton.classList.remove('is-touching');
    this.revealButton.addEventListener('pointerup',releaseOrb,{passive:true,...options});
    this.revealButton.addEventListener('pointercancel',releaseOrb,{passive:true,...options});

    this.revealButton.addEventListener('click',()=>this.draw(),options);
    this.prev.addEventListener('click',()=>this.move(-1),options);
    this.next.addEventListener('click',()=>this.move(1),options);
    this.shuffle.addEventListener('click',()=>this.reshuffle(),options);
    this.resetButton.addEventListener('click',()=>this.handleResetButton(),options);

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
      this.touchStart={x:event.clientX,y:event.clientY};
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
    this.shuffle.disabled=busy||this.state.waiting.length<2;
    this.resetButton.disabled=busy;
  }

  async draw(){
    if(this.busy||this.state.completed)return null;

    this.busy=true;
    this.setPhase('ignite');
    this.signal.textContent='O fogo celestial desperta…';
    this.fire?.burst();

    try{
      const result=await this.coordinator.commit(latest=>drawNextCard(latest));
      this.state=result.state;
      if(result.cardId===null)return null;

      this.selected=result.position;
      const card=CARDS[result.cardId];

      // Fire starts immediately while the actual card image is prepared.
      const imageTask=prepareCardImage(card,{timeout:1600,priority:'high'});
      await imageTask;

      this.setPhase('birth');
      this.show(result.position,true);

      if(!reducedMotion())await wait(BIRTH_SETTLE_MS);
      else await wait(90);

      this.signal.textContent=card?.name||'Carta revelada';
      this.live.textContent=`${card?.name||'Carta'}, direta. ${result.position+1} de 78.`;
      this.setPhase('rest');

      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed',{
        detail:{
          cardId:result.cardId,
          position:result.position,
          remaining:this.state.waiting.length,
          engine:'living-flame-v401'
        }
      }));

      preloadCardImages([this.state.waiting[0],this.state.waiting[1],this.state.waiting[2]],3);
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
    })}<div class="tl401__card-name"><b>${escapeText(card.name)}</b><small>${index+1} / ${this.state.revealed.length}</small></div>`;
    this.card.dataset.empty='false';

    if(animate){
      this.fire?.burst();
      if(!reducedMotion()){
        this.card.animate([
          {opacity:.08,transform:'translate3d(0,36px,0) scale(.80)',filter:'blur(9px) brightness(1.7)'},
          {opacity:1,transform:'translate3d(0,-5px,0) scale(1.03)',filter:'blur(0) brightness(1.16)',offset:.60},
          {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0) brightness(1)'}
        ],{duration:390,easing:'cubic-bezier(.16,.85,.18,1)'});
      }
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
      const x=direction>0?20:-20;
      this.card.animate([
        {opacity:.48,transform:`translate3d(${x}px,0,0) scale(.99)`},
        {opacity:1,transform:'translate3d(0,0,0) scale(1)'}
      ],{duration:200,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    return true;
  }

  async reshuffle(){
    if(this.busy||this.state.waiting.length<2)return false;

    const before=this.state.waiting.slice(0,8).join(',');
    const revealedSignature=this.state.revealed.join(',');

    try{
      this.state=await this.coordinator.commit(latest=>shuffleRemainingCards(latest));

      if(this.state.revealed.join(',')!==revealedSignature){
        throw new Error('As cartas reveladas mudaram durante o embaralhamento.');
      }

      const after=this.state.waiting.slice(0,8).join(',');
      this.signal.textContent=before===after
        ?'As cartas ocultas foram reorganizadas.'
        :'As cartas ocultas foram embaralhadas.';
      this.fire?.burst();
      this.render(false);
      preloadCardImages([this.state.waiting[0],this.state.waiting[1],this.state.waiting[2]],3);
      announce('Cartas ocultas embaralhadas.');
      return true;
    }catch(error){
      console.error('[Divina] embaralhamento interrompido',error);
      this.signal.textContent='O círculo foi preservado.';
      announce('Não foi possível embaralhar agora.');
      return false;
    }
  }

  handleResetButton(){
    if(this.busy)return;

    if(!this.state.revealed.length){
      this.resetNow();
      return;
    }

    if(!this.resetArmed){
      this.resetArmed=true;
      clearTimeout(this.resetTimer);
      this.resetButton.textContent='CONFIRMAR NOVO CÍRCULO';
      this.resetButton.classList.add('is-armed');
      this.signal.textContent='Toque novamente para recomeçar.';
      this.resetTimer=setTimeout(()=>this.disarmReset(),RESET_ARM_MS);
      return;
    }

    this.resetNow();
  }

  disarmReset(){
    this.resetArmed=false;
    clearTimeout(this.resetTimer);
    this.resetButton.textContent='NOVO CÍRCULO';
    this.resetButton.classList.remove('is-armed');
  }

  async resetNow(){
    if(this.busy)return false;
    this.disarmReset();
    this.busy=true;
    this.setPhase('ignite');
    this.fire?.burst();

    try{
      this.state=await this.coordinator.commit(latest=>resetTarotState({
        now:()=>Math.max(Date.now(),Number(latest.updatedAt||0)+2)
      }));
      this.selected=-1;
      this.render(false);
      this.signal.textContent='Novo círculo aberto. Toque a Orbe.';
      announce('Novo círculo aberto.');
      return true;
    }catch(error){
      console.error('[Divina] reset interrompido',error);
      this.state=this.coordinator.latest();
      this.render(false);
      this.signal.textContent='O círculo atual foi preservado.';
      announce('Não foi possível recomeçar agora.');
      return false;
    }finally{
      this.busy=false;
      this.setPhase('rest');
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
      this.card.innerHTML='<div class="tl401__empty-card" aria-hidden="true"><span>✦</span></div>';
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
      this.mesaGrid.innerHTML='<div class="tl401__mesa-empty">Nenhuma carta revelada ainda.</div>';
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
    document.documentElement.classList.add('tl401-mesa-open');
    requestAnimationFrame(()=>this.mesa.classList.add('is-open'));
  }

  closeMesa(){
    if(!this.mesaOpen)return;
    this.mesaOpen=false;
    this.mesa.classList.remove('is-open');
    document.documentElement.classList.remove('tl401-mesa-open');
    setTimeout(()=>{
      if(!this.mesaOpen)this.mesa.hidden=true;
    },340);
  }

  destroy(){
    this.abort.abort();
    clearTimeout(this.resetTimer);
    this.fire?.destroy();
    document.documentElement.classList.remove('tl401-mesa-open');
    delete document.documentElement.dataset.tarotLivre;
  }
}
