/* DIVINA BRUXA 4.0 — MACROETAPA 6/14 · TIRAGENS SUPREMAS V554
   Observatório de possibilidades sobre SpreadsWorld V305 / SpreadsEngine V213.
   Não cria um segundo motor. */

import { SpreadsWorldV305 } from './spreads-world-v305.js?v=554';
import { synthesizeSpreadV331 } from './spread-synthesis-v331.js?v=331';

const RELEASE='V554';
const STYLE_ID='spreadsSupremeV331Styles';
const MARK=Symbol.for('divina.spreads.supreme.v331');
const PATCH_MARK=Symbol.for('divina.spreads.synthesis.patch.v331');

const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const positionLabel=position=>typeof position==='string'?position:position?.label||'';
const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const constrained=()=>document.documentElement.dataset.performanceTier==='constrained';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./spreads-supreme-v331.css?v=554';
  document.head.append(link);
}

function patchSynthesis(){
  if(SpreadsWorldV305.prototype[PATCH_MARK])return;

  SpreadsWorldV305.prototype.synthesisMarkup=function(items,target){
    if(!this.isComplete())return '';
    const synthesisItems=items.map(item=>({card:item.card,position:positionLabel(item.position)}));
    const synthesis=synthesizeSpreadV331(synthesisItems,{
      question:this.session?.question||'',
      tone:target?.tone
    });

    return `<article class="spread-synthesis v213 spread-synthesis-v331">
      <span>LEITURA INTEGRADA · V554</span>
      <h3>O que este desenho pode revelar sobre o seu momento.</h3>
      <div class="spread-life-map-v331">
        <section data-life-layer="now"><small>AGORA</small><p>${safe(synthesis.now)}</p></section>
        <section data-life-layer="tension"><small>TENSÃO</small><p>${safe(synthesis.tension)}</p></section>
        <section data-life-layer="possibility"><small>POSSIBILIDADE</small><p>${safe(synthesis.possibility)}</p></section>
        <section data-life-layer="relation"><small>RELAÇÃO</small><p>${safe(synthesis.relation)}</p></section>
      </div>
      <blockquote><b>CAMINHO</b><span>${safe(synthesis.integration)}</span></blockquote>
      <div class="spread-next-step-v331"><span>✦</span><p><b>UM PASSO QUE DEPENDE DE VOCÊ</b><small>${safe(synthesis.action)}</small></p></div>
      <details class="spread-patterns-v331">
        <summary>Padrões do desenho</summary>
        <div><span><b>${synthesis.majorCount}</b>Maiores</span><span><b>${synthesis.courtCount}</b>Corte</span><span><b>${safe(synthesis.dominantElement)}</b>Elemento</span><span><b>${safe(synthesis.dominantSuit)}</b>Campo</span></div>
      </details>
      <aside><b>LEITURA RESPONSÁVEL</b><p>${safe(synthesis.responsibleNotice)}</p></aside>
    </article>`;
  };

  Object.defineProperty(SpreadsWorldV305.prototype,PATCH_MARK,{
    value:true,configurable:true,enumerable:false
  });
}

function layer(parent,className,html=''){
  let node=parent?.querySelector?.(`.${className}`);
  if(node)return node;
  node=document.createElement('span');
  node.className=className;
  node.setAttribute('aria-hidden','true');
  node.innerHTML=html;
  parent?.prepend?.(node);
  return node;
}

export class SpreadsSupremeV331{
  constructor(){
    this.root=null;
    this.result=null;
    this.grid=null;
    this.observer=null;
    this.frame=0;
    this.abort=new AbortController();
    this.mounted=false;
    installStyle();
    patchSynthesis();
    this.bind();
    this.tryMount();
    document.documentElement.dataset.spreadsSupreme='v554';
  }

  bind(){
    const signal=this.abort.signal;

    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id==='spreads')queueMicrotask(()=>this.tryMount(true));
    },{signal});
    document.addEventListener('divina:route-ready',event=>{
      if(event.detail?.id==='spreads')queueMicrotask(()=>this.tryMount(true));
    },{signal});

    document.addEventListener('click',event=>{
      if(!this.root)return;
      const choice=event.target.closest?.('#spreads .spread-choice');
      if(choice)this.portalPulse(choice);
      const reveal=event.target.closest?.('#spreads [data-reveal-card]');
      if(reveal)this.revealPulse(reveal);
    },{capture:true,signal});
  }

  tryMount(force=false){
    const root=document.querySelector('#spreads');
    if(!root)return false;
    if(this.mounted&&this.root===root&&!force)return true;

    this.root=root;
    this.result=root.querySelector('#spreadResult,.spread-result,[data-spread-result]')||document.querySelector('#spreadResult');
    this.grid=root.querySelector('#spreadGrid,[data-spread-grid],.spread-grid')||root;
    root.dataset.spreadsSupreme='v554';
    root.classList.add('sp331');

    this.enhance();
    this.observe();
    this.mounted=true;

    document.dispatchEvent(new CustomEvent('divina:spreads-supreme-ready',{
      detail:Object.freeze({
        release:RELEASE,
        baseWorld:'V305',
        baseEngine:'V213',
        methods:15,
        freeMethods:4,
        premiumMethods:11,
        celticCross:10,
        royalTable:78,
        canonicalOrb:true,
        atlasGrid:true,
        realLifeSynthesis:true,
        automaticWhitReading:false,
        extraApiCalls:0
      })
    }));
    return true;
  }

  observe(){
    this.observer?.disconnect();
    this.observer=new MutationObserver(records=>{
      if(!records.some(record=>record.type==='childList'))return;
      if(this.frame)return;
      this.frame=requestAnimationFrame(()=>{this.frame=0;this.enhance();});
    });
    this.observer.observe(this.root,{childList:true,subtree:true});
  }

  enhance(){
    if(!this.root)return;

    if(!this.root.querySelector('.sp331__cosmos')){
      layer(this.root,'sp331__cosmos','<i></i><i></i><i></i>');
    }

    const ritual=this.root.querySelector('.spread-ritual-v305');
    if(ritual&&!ritual.querySelector('.sp331__ritual-orbit')){
      layer(ritual,'sp331__ritual-orbit','<i></i><i></i>');
    }

    this.root.querySelectorAll('.spread-choice').forEach((button,index)=>{
      button.style.setProperty('--sp331-index',String(index%15));
      button.dataset.sp331Portal='true';
    });

    const reading=this.root.querySelector('.spread-reading');
    if(reading){
      reading.classList.add('spread-reading-v331');
      if(!reading.querySelector('.sp331__reading-space')){
        layer(reading,'sp331__reading-space','<i></i><i></i><i></i><i></i>');
      }
      const orb=reading.querySelector('[data-spread-orb-host]');
      orb?.classList.add('spread-orb-v554');
      const map=reading.querySelector('.spread-map');
      map?.classList.add('spread-map-v331');
    }

    const synthesis=this.root.querySelector('.spread-synthesis-v331');
    synthesis?.classList.add('is-integrated-v331');

    const intention=this.root.querySelector('.spread-intention-field');
    if(intention)intention.classList.add('spread-intention-v331');

    const filters=this.root.querySelector('.spread-filters');
    if(filters)filters.setAttribute('data-sp331-filters','true');
  }

  portalPulse(button){
    if(reduced())return;
    button.classList.remove('sp331-choice-pulse');
    requestAnimationFrame(()=>{
      button.classList.add('sp331-choice-pulse');
      setTimeout(()=>button.classList.remove('sp331-choice-pulse'),260);
    });
  }

  revealPulse(button){
    const reading=button.closest('.spread-reading');
    if(!reading)return;
    reading.classList.remove('sp331-reveal-pulse');
    requestAnimationFrame(()=>{
      reading.classList.add('sp331-reveal-pulse');
      setTimeout(()=>reading.classList.remove('sp331-reveal-pulse'),280);
    });
    document.dispatchEvent(new CustomEvent('whit:whisper',{
      detail:Object.freeze({
        phrase:'Mais uma posição se abriu. Observe a relação antes de buscar uma conclusão.',
        source:'spreads-v331',
        private:false
      })
    }));
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      baseWorld:'V305',
      baseEngine:'V213',
      synthesisPatched:Boolean(SpreadsWorldV305.prototype[PATCH_MARK]),
      methods:15,
      freeMethods:4,
      premiumMethods:11,
      celticCross:10,
      royalTable:78,
      canonicalOrb:true,
      atlasGrid:true,
      gridFullImageRequests:0,
      realLifeSynthesis:true,
      cardDictionaryStyle:false,
      automaticWhitReading:false,
      reducedMotion:reduced(),
      constrained:constrained(),
      extraApiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    if(this.frame)cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.root?.classList.remove('sp331');
    this.root?.removeAttribute('data-spreads-supreme');
    delete document.documentElement.dataset.spreadsSupreme;
    this.mounted=false;
  }
}

export function installSpreadsSupremeV331(){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new SpreadsSupremeV331();
  globalThis[MARK]=instance;
  globalThis.divinaSpreadsV331=instance;
  return instance;
}
