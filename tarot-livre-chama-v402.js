/* DIVINA BRUXA — TAROT LIVRE CHAMA CELESTIAL V402
   Referência: uma chama contínua violeta + dourada conectando a Orbe à carta.
   SVG garante fogo sempre visível; Canvas 2D adiciona estrelas, faíscas e explosão.
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

const VERSION='V402';
const STORAGE_KEY='free-tarot';
const BIRTH_SETTLE_MS=240;
const RESET_ARM_MS=3500;

const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';
const escapeText=value=>String(value??'').replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
}[ch]));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,ms)));

function announce(message){
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast',{detail:message}));
}

class CelestialSparksV402 {
  constructor({canvas,universe,orb,cardZone}){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d',{alpha:true});
    this.universe=universe;
    this.orb=orb;
    this.cardZone=cardZone;
    this.supported=Boolean(this.ctx);
    this.scale=Math.min(2,Math.max(1,devicePixelRatio||1));
    this.width=1;
    this.height=1;
    this.stars=[];
    this.particles=[];
    this.burstUntil=0;
    this.running=false;
    this.raf=0;
    this.last=performance.now();
    this.lowFrameAt=0;

    if(globalThis.ResizeObserver){
      this.ro=new ResizeObserver(()=>this.resize());
      this.ro.observe(universe);
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
    this.canvas.width=Math.round(this.width*this.scale);
    this.canvas.height=Math.round(this.height*this.scale);
    this.canvas.style.width=`${this.width}px`;
    this.canvas.style.height=`${this.height}px`;
    this.ctx.setTransform(this.scale,0,0,this.scale,0,0);

    const count=constrained()?48:100;
    this.stars=Array.from({length:count},()=>({
      x:Math.random()*this.width,
      y:Math.random()*this.height,
      r:.4+Math.random()*1.45,
      a:.12+Math.random()*.76,
      phase:Math.random()*Math.PI*2,
      speed:.22+Math.random()*.9,
      gold:Math.random()<.22
    }));
  }

  center(el){
    const r=el.getBoundingClientRect();
    const u=this.universe.getBoundingClientRect();
    return {
      x:r.left+r.width/2-u.left,
      y:r.top+r.height/2-u.top,
      w:r.width,h:r.height
    };
  }

  color(kind,a){
    if(kind==='white')return `rgba(255,246,216,${a})`;
    if(kind==='gold')return `rgba(255,181,58,${a})`;
    if(kind==='orange')return `rgba(255,105,33,${a})`;
    if(kind==='pink')return `rgba(244,68,217,${a})`;
    return `rgba(163,52,255,${a})`;
  }

  emitAmbient(){
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    const chance=reducedMotion()?.20:.72;
    if(Math.random()>chance)return;

    const t=Math.random();
    const sway=Math.sin(t*Math.PI*2.6)*38*(1-t);
    this.particles.push({
      x:o.x+(c.x-o.x)*t+sway+(Math.random()-.5)*20,
      y:o.y+(c.y-o.y)*t+(Math.random()-.5)*18,
      vx:(Math.random()-.5)*20,
      vy:-12-Math.random()*26,
      life:.62+Math.random()*1.0,
      age:0,
      size:1.4+Math.random()*4.6,
      kind:Math.random()<.42?'gold':'violet'
    });
  }

  burst(){
    if(!this.supported)return;
    const o=this.center(this.orb);
    const c=this.center(this.cardZone);
    const base=Math.atan2(c.y-o.y,c.x-o.x);
    const count=reducedMotion()?42:(constrained()?78:150);

    for(let i=0;i<count;i++){
      const hot=i<count*.45;
      const angle=base+(Math.random()-.5)*(hot?.50:.92);
      const speed=(hot?400:230)+Math.random()*(hot?480:390);
      this.particles.push({
        x:o.x+(Math.random()-.5)*o.w*.22,
        y:o.y+(Math.random()-.5)*o.h*.18,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:.28+Math.random()*.54,
        age:0,
        size:(hot?4:2)+Math.random()*(hot?11:7),
        kind:hot?(Math.random()<.68?'white':'gold'):(Math.random()<.55?'violet':'pink')
      });
    }

    for(let i=0;i<(reducedMotion()?18:(constrained()?30:62));i++){
      const angle=Math.random()*Math.PI*2;
      const speed=90+Math.random()*260;
      this.particles.push({
        x:c.x+(Math.random()-.5)*c.w*.55,
        y:c.y+(Math.random()-.5)*c.h*.48,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:.34+Math.random()*.58,
        age:0,
        size:1.5+Math.random()*5,
        kind:Math.random()<.52?'gold':'violet'
      });
    }

    this.burstUntil=performance.now()+680;
    this.start();
  }

  drawStars(t){
    const ctx=this.ctx;
    for(const s of this.stars){
      const pulse=.42+.58*Math.sin(t*.001*s.speed+s.phase);
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=s.gold
        ?`rgba(255,211,132,${s.a*pulse})`
        :`rgba(230,210,255,${s.a*pulse})`;
      ctx.shadowBlur=10*pulse;
      ctx.shadowColor=s.gold?'rgba(255,177,68,.74)':'rgba(160,58,255,.72)';
      ctx.beginPath();
      ctx.arc(s.x,s.y,Math.max(.3,s.r*pulse),0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawOrbCrown(t){
    const ctx=this.ctx;
    const o=this.center(this.orb);
    ctx.save();
    ctx.globalCompositeOperation='lighter';

    for(let i=0;i<18;i++){
      const a=i/18*Math.PI*2+t*.0016*(i%2?1:-1);
      const radius=o.w*(.50+.04*Math.sin(t*.003+i));
      const x=o.x+Math.cos(a)*radius;
      const y=o.y+Math.sin(a)*radius;
      const r=4+(i%4)*1.6;
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.5);
      g.addColorStop(0,'rgba(255,241,202,.74)');
      g.addColorStop(.26,'rgba(255,161,52,.52)');
      g.addColorStop(.60,'rgba(201,64,255,.34)');
      g.addColorStop(1,'rgba(201,64,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r*2.5,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCardCrown(t){
    const ctx=this.ctx;
    const c=this.center(this.cardZone);
    const burst=Math.max(0,Math.min(1,(this.burstUntil-t)/680));
    const base=.28;

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<22;i++){
      const a=i/22*Math.PI*2+t*.0021*(i%2?1:-1);
      const rx=c.w*.51+Math.sin(t*.004+i)*9;
      const ry=c.h*.48+Math.cos(t*.003+i)*12;
      const x=c.x+Math.cos(a)*rx;
      const y=c.y+Math.sin(a)*ry;
      const r=4+burst*16+(i%4)*1.4;
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.5);
      g.addColorStop(0,`rgba(255,242,203,${base+burst*.54})`);
      g.addColorStop(.25,`rgba(255,155,50,${base+burst*.38})`);
      g.addColorStop(.60,`rgba(209,61,255,${.18+burst*.32})`);
      g.addColorStop(1,'rgba(209,61,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(x,y,r*2.5,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  update(dt){
    const ctx=this.ctx;
    const next=[];

    for(const p of this.particles){
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
      ctx.fillStyle=this.color(p.kind,alpha*.84);
      ctx.shadowBlur=14+p.size*2.2;
      ctx.shadowColor=this.color(p.kind,Math.min(.92,alpha));
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.45,p.size*k),0,Math.PI*2);
      ctx.fill();

      ctx.strokeStyle=this.color(p.kind,alpha*.26);
      ctx.lineWidth=Math.max(.5,p.size*.30*k);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x-p.vx*.021,p.y-p.vy*.021);
      ctx.stroke();
      ctx.restore();
      next.push(p);
    }

    this.particles=next.slice(-320);
  }

  frame(t){
    if(!this.running||!this.supported)return;

    if(reducedMotion()&&t-this.lowFrameAt<80){
      this.raf=requestAnimationFrame(tt=>this.frame(tt));
      return;
    }
    if(reducedMotion())this.lowFrameAt=t;

    const dt=Math.min(.034,Math.max(.001,(t-this.last)/1000));
    this.last=t;

    const ctx=this.ctx;
    ctx.clearRect(0,0,this.width,this.height);
    this.drawStars(t);
    this.emitAmbient();
    this.drawOrbCrown(t);
    this.drawCardCrown(t);
    this.update(dt);

    if(routeNow()==='tarot'||this.particles.length){
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
    this.ro?.disconnect?.();
    if(this.onResize)removeEventListener('resize',this.onResize);
  }
}

export class TarotLivreChamaV402 {
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
    this.root.dataset.tarotWorld='chama-v402';
    this.root.className=this.root.className
      .replace(/\btarot-world-v301-host\b/g,'')
      .trim();

    this.build();
    this.bind();
    this.render(false);

    this.sparks=new CelestialSparksV402({
      canvas:this.sparkCanvas,
      universe:this.universe,
      orb:this.revealButton,
      cardZone:this.cardZone
    });
    this.sparks.start();

    preloadCardImages([this.state.waiting[0],this.state.waiting[1],this.state.waiting[2]],3);

    document.documentElement.dataset.tarotLivre='v402';
    document.dispatchEvent(new CustomEvent('divina:tarot-chama-ready',{
      detail:Object.freeze({
        version:402,
        engine:'CelestialFlameSVG+Canvas',
        deckSize:DECK_SIZE,
        normalOnly:true,
        noRepeats:true
      })
    }));
  }

  build(){
    this.root.innerHTML=`
      <div class="tl402" data-phase="rest">
        <header class="tl402__head">
          <div class="tl402__title">
            <small>DIVINA BRUXA</small>
            <h2>Tarot Livre</h2>
          </div>

          <button type="button" class="tl402__mesa-button" data-mesa-open>MESA REAL</button>

          <div class="tl402__toolbar" aria-label="Controles do Tarot Livre">
            <button type="button" data-shuffle>EMBARALHAR</button>
            <button type="button" data-reset>NOVO CÍRCULO</button>
          </div>
        </header>

        <section class="tl402__universe" aria-label="Tarot Livre — Chama Celestial">
          <canvas class="tl402__spark-canvas" data-sparks aria-hidden="true"></canvas>

          <svg class="tl402__flame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="tl402BlurPurple" x="-60%" y="-30%" width="220%" height="160%">
                <feGaussianBlur stdDeviation="3.6"/>
              </filter>
              <filter id="tl402BlurGold" x="-60%" y="-30%" width="220%" height="160%">
                <feGaussianBlur stdDeviation="2.0"/>
              </filter>
              <linearGradient id="tl402Purple" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#7d20ff" stop-opacity="0"/>
                <stop offset="15%" stop-color="#a936ff" stop-opacity=".92"/>
                <stop offset="48%" stop-color="#ef4ee9" stop-opacity=".98"/>
                <stop offset="78%" stop-color="#ca42ff" stop-opacity=".92"/>
                <stop offset="100%" stop-color="#f6c6ff" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="tl402Gold" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#ff7b20" stop-opacity="0"/>
                <stop offset="18%" stop-color="#ff9b32" stop-opacity=".95"/>
                <stop offset="50%" stop-color="#ffd068" stop-opacity="1"/>
                <stop offset="84%" stop-color="#ffae3c" stop-opacity=".96"/>
                <stop offset="100%" stop-color="#fff1b7" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="tl402White" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#fff8dc" stop-opacity="0"/>
                <stop offset="20%" stop-color="#fff4c8" stop-opacity=".88"/>
                <stop offset="54%" stop-color="#fff8df" stop-opacity="1"/>
                <stop offset="84%" stop-color="#ffe18e" stop-opacity=".92"/>
                <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <g class="tl402__flame-group tl402__flame-group--purple">
              <path d="M50 84 C27 75 70 65 43 56 C22 48 69 39 47 29 C34 23 59 18 50 13"
                    fill="none" stroke="url(#tl402Purple)" stroke-width="15"
                    stroke-linecap="round" filter="url(#tl402BlurPurple)"/>
              <path d="M50 84 C69 73 30 65 56 55 C76 47 35 38 55 29 C68 23 42 18 50 13"
                    fill="none" stroke="url(#tl402Purple)" stroke-width="11"
                    stroke-linecap="round" filter="url(#tl402BlurPurple)"/>
            </g>

            <g class="tl402__flame-group tl402__flame-group--gold">
              <path d="M50 84 C34 74 65 65 45 56 C31 49 64 39 49 29 C40 23 56 18 50 13"
                    fill="none" stroke="url(#tl402Gold)" stroke-width="6.5"
                    stroke-linecap="round" filter="url(#tl402BlurGold)"/>
              <path d="M50 84 C63 74 37 65 55 55 C68 47 39 38 53 29 C61 23 45 18 50 13"
                    fill="none" stroke="url(#tl402Gold)" stroke-width="4.6"
                    stroke-linecap="round" filter="url(#tl402BlurGold)"/>
            </g>

            <path class="tl402__flame-core"
                  d="M50 84 C43 75 57 66 48 56 C41 49 58 39 50 29 C46 23 54 18 50 13"
                  fill="none" stroke="url(#tl402White)" stroke-width="1.8"
                  stroke-linecap="round"/>
          </svg>

          <div class="tl402__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas reveladas.">
            <div class="tl402__card-fire-shell" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="tl402__card" data-current-card data-empty="true">
              <div class="tl402__empty-card" aria-hidden="true"><span>✦</span></div>
            </div>
          </div>

          <button class="tl402__orb" type="button" data-reveal aria-label="Revelar uma carta pela Chama Celestial">
            <span class="tl402__orb-fire" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="tl402__orb-image" data-orb-surface="tarot"></span>
            <span class="tl402__orb-touch" aria-hidden="true"></span>
          </button>

          <nav class="tl402__nav" aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">←</button>
            <button type="button" data-next aria-label="Próxima carta">→</button>
          </nav>

          <div class="tl402__counter"><b data-count>0</b><span>/78</span></div>
          <div class="tl402__signal" data-signal aria-live="polite">Toque a Orbe.</div>
        </section>

        <section class="tl402__constellation" aria-labelledby="tl402ConstellationTitle">
          <header>
            <h3 id="tl402ConstellationTitle">Constelação</h3>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl402__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por linha" aria-colcount="6"></div>
        </section>

        <section class="tl402__mesa" data-mesa hidden aria-label="Mesa Real">
          <div class="tl402__mesa-backdrop" data-mesa-close aria-hidden="true"></div>
          <div class="tl402__mesa-shell" role="dialog" aria-modal="true" aria-labelledby="tl402MesaTitle">
            <header>
              <div>
                <small>DIVINA BRUXA</small>
                <h3 id="tl402MesaTitle">Mesa Real</h3>
                <p data-mesa-count>0 cartas reveladas</p>
              </div>
              <button type="button" data-mesa-close>VOLTAR</button>
            </header>
            <div class="tl402__mesa-grid" data-mesa-grid role="grid" aria-colcount="6"></div>
          </div>
        </section>

        <p class="tl402__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world=this.root.querySelector('.tl402');
    this.universe=this.root.querySelector('.tl402__universe');
    this.sparkCanvas=this.root.querySelector('[data-sparks]');
    this.revealButton=this.root.querySelector('[data-reveal]');
    this.cardZone=this.root.querySelector('[data-card-zone]');
    this.card=this.root.querySelector('[data-current-card]');
    this.signal=this.root.querySelector('[data-signal]');
    this.count=this.root.querySelector('[data-count]');
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
      this.revealButton.style.setProperty('--tl402-x',`${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
      this.revealButton.style.setProperty('--tl402-y',`${Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))}%`);
      this.revealButton.classList.add('is-touching');
    },{passive:true,...options});

    const release=()=>this.revealButton.classList.remove('is-touching');
    this.revealButton.addEventListener('pointerup',release,{passive:true,...options});
    this.revealButton.addEventListener('pointercancel',release,{passive:true,...options});

    this.revealButton.addEventListener('click',()=>this.draw(),options);
    this.prev.addEventListener('click',()=>this.move(-1),options);
    this.next.addEventListener('click',()=>this.move(1),options);
    this.shuffle.addEventListener('click',()=>this.reshuffle(),options);
    this.resetButton.addEventListener('click',()=>this.handleReset(),options);

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
    this.universe.classList.add('is-bursting');
    this.sparks?.burst();
    this.signal.textContent='A chama celestial desperta…';

    try{
      const result=await this.coordinator.commit(latest=>drawNextCard(latest));
      this.state=result.state;
      if(result.cardId===null)return null;

      this.selected=result.position;
      const card=CARDS[result.cardId];
      await prepareCardImage(card,{timeout:1600,priority:'high'});

      this.setPhase('birth');
      this.show(result.position,true);

      if(!reducedMotion())await wait(BIRTH_SETTLE_MS);
      else await wait(80);

      this.signal.textContent=card?.name||'Carta revelada';
      this.live.textContent=`${card?.name||'Carta'}, direta. ${result.position+1} de 78.`;
      this.setPhase('rest');

      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed',{
        detail:{
          cardId:result.cardId,
          position:result.position,
          remaining:this.state.waiting.length,
          engine:'celestial-flame-v402'
        }
      }));

      preloadCardImages([this.state.waiting[0],this.state.waiting[1],this.state.waiting[2]],3);
      return result.cardId;
    }catch(error){
      console.error('[Divina] Chama Celestial interrompida',error);
      this.state=this.coordinator.latest();
      this.selected=this.state.revealed.length-1;
      this.render(false);
      this.signal.textContent='O círculo foi preservado. Toque novamente.';
      announce('A revelação foi interrompida, mas nenhuma carta foi perdida.');
      return null;
    }finally{
      this.busy=false;
      this.setPhase('rest');
      setTimeout(()=>this.universe?.classList.remove('is-bursting'),520);
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
    })}<div class="tl402__card-name"><b>${escapeText(card.name)}</b><small>${index+1} / ${this.state.revealed.length}</small></div>`;
    this.card.dataset.empty='false';

    if(animate){
      this.sparks?.burst();
      this.universe.classList.add('is-bursting');
      setTimeout(()=>this.universe?.classList.remove('is-bursting'),520);

      if(!reducedMotion()){
        this.card.animate([
          {opacity:.08,transform:'translate3d(0,35px,0) scale(.80)',filter:'blur(9px) brightness(1.7)'},
          {opacity:1,transform:'translate3d(0,-5px,0) scale(1.03)',filter:'blur(0) brightness(1.18)',offset:.58},
          {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0) brightness(1)'}
        ],{duration:380,easing:'cubic-bezier(.16,.85,.18,1)'});
      }
    }

    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button=>{
      const current=Number(button.dataset.index)===index;
      button.classList.toggle('is-current',current);
      button.setAttribute('aria-current',current?'true':'false');
    });

    preloadCardImages([this.state.revealed[index-1],this.state.revealed[index+1]],2);
    return true;
  }

  move(direction){
    if(this.busy||!this.state.revealed.length)return false;
    const next=this.selected+direction;
    if(next<0||next>=this.state.revealed.length)return false;
    this.show(next,false);
    return true;
  }

  async reshuffle(){
    if(this.busy||this.state.waiting.length<2)return false;
    const revealedSignature=this.state.revealed.join(',');

    try{
      this.state=await this.coordinator.commit(latest=>shuffleRemainingCards(latest));

      if(this.state.revealed.join(',')!==revealedSignature){
        throw new Error('As cartas reveladas mudaram durante o embaralhamento.');
      }

      this.signal.textContent='As cartas ocultas foram embaralhadas.';
      this.universe.classList.add('is-bursting');
      this.sparks?.burst();
      setTimeout(()=>this.universe?.classList.remove('is-bursting'),520);
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

  handleReset(){
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
    this.universe.classList.add('is-bursting');
    this.sparks?.burst();

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
      setTimeout(()=>this.universe?.classList.remove('is-bursting'),520);
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
      this.card.innerHTML='<div class="tl402__empty-card" aria-hidden="true"><span>✦</span></div>';
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
      this.mesaGrid.innerHTML='<div class="tl402__mesa-empty">Nenhuma carta revelada ainda.</div>';
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
    document.documentElement.classList.add('tl402-mesa-open');
    requestAnimationFrame(()=>this.mesa.classList.add('is-open'));
  }

  closeMesa(){
    if(!this.mesaOpen)return;
    this.mesaOpen=false;
    this.mesa.classList.remove('is-open');
    document.documentElement.classList.remove('tl402-mesa-open');
    setTimeout(()=>{
      if(!this.mesaOpen)this.mesa.hidden=true;
    },340);
  }

  destroy(){
    this.abort.abort();
    clearTimeout(this.resetTimer);
    this.sparks?.destroy();
    document.documentElement.classList.remove('tl402-mesa-open');
    delete document.documentElement.dataset.tarotLivre;
  }
}
