/* DIVINA BRUXA 3.0 · EXPERIÊNCIAS, CONTEÚDO E CONVERSÃO V541
   Aprofunda Consultas, Loja, Música e Vídeos sem criar outra Orbe, canvas,
   loop visual ou fonte comercial. Conteúdo privado nunca é lido. */

import { COMMERCIAL_TRUTH_V200 } from './commercial-truth-v200.js?v=200';
import { STORE_POLICY } from './store-policy.js?v=192';

const RELEASE='V541';
const MARK=Symbol.for('divina.experience.depth.v541');
const STYLE_ID='divinaExperienceDepthV541Styles';
const ROUTES=Object.freeze(['consultations','store','music','videos']);
const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const clean=(value,limit=180)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const money=cents=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number(cents||0)/100);
const reduced=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./experience-depth-core-v541.css?v=541';
  document.head.append(link);
}

function insertionPoint(route){
  return ({consultations:'consultationApp',store:'storeApp',music:'musicApp',videos:'videoApp'})[route];
}

function publicRoot(route){
  const id=insertionPoint(route);
  const root=document.getElementById(id);
  if(root)return root;
  if(route==='consultations'&&document.body?.classList.contains('portal-consultations'))return document.querySelector('main');
  return null;
}

function makeSection(id,className,label,html){
  const section=document.createElement('section');
  section.id=id;section.className=className;section.dataset.experienceDepth='v541';
  section.setAttribute('aria-label',label);section.innerHTML=html;
  return section;
}

export const EXPERIENCE_DEPTH_PRIVACY_V541=Object.freeze({
  privateFieldReads:0,journalReads:0,consultationQuestionReads:0,phoneReads:0,
  storageReads:0,storageWrites:0,analyticsTextWrites:0,networkCalls:0,modelCalls:0
});

export const EXPERIENCE_DEPTH_CONTRACT_V541=Object.freeze({
  release:RELEASE,macroStage:'7/14',worlds:ROUTES,canonicalOrb:'V501',parallelOrbEngines:0,
  permanentAnimationLoops:0,pointerMoveEffects:0,consultationServices:4,
  consultationPriceCents:Object.freeze([50000,50000,30000,15000]),
  consultationChannel:'email-only',consultationRealBilling:false,
  storeAssociateTag:'orbedasrealid-20',storeCheckoutInternal:false,
  musicFallbackAlbums:2,musicAutoplay:false,musicPlayerLazy:true,
  videoInventedEpisodes:0,videoPublicSource:'published-only',privacy:EXPERIENCE_DEPTH_PRIVACY_V541,
  productionPublish:false,realBilling:false
});

export class ExperienceDepthCoreV541{
  constructor({go,orbCore,base,config}={}){
    this.go=typeof go==='function'?go:(route=>globalThis.orbe?.go?.(route));
    this.orbCore=orbCore||globalThis.divinaOrbSupremeV501?.core||null;
    this.base=base||globalThis.divinaExperienceConversionV530?.core||null;
    this.config=config||{};
    this.abort=new AbortController();
    installStyle();
    document.documentElement.dataset.experienceDepth='v541';
    this.bind();
    queueMicrotask(()=>this.refresh());
  }

  bind(){
    const {signal}=this.abort;
    ['divina:page-ready','divina:route-ready','divina:consultations-world-ready','divina:store-world-ready','divina:music-world-ready-v530','divina:videos-world-ready'].forEach(type=>{
      document.addEventListener(type,()=>this.refresh(),{passive:true,signal});
    });
    document.addEventListener('click',event=>this.handleClick(event),{capture:true,signal});
    document.addEventListener('input',event=>this.handleInput(event),{passive:true,signal});
  }

  refresh(){
    this.mountConsultations();
    this.mountStore();
    this.mountMusic();
    this.mountVideos();
    this.decorateVideos();
  }

  mountConsultations(){
    const app=publicRoot('consultations');
    if(!app||document.getElementById('experienceDepthConsultationsV541'))return;
    const services=COMMERCIAL_TRUTH_V200.services;
    const section=makeSection('experienceDepthConsultationsV541','ex541-world ex541-consultations','Guia para escolher uma consulta',`
      <header class="ex541-head"><span aria-hidden="true">☾</span><div><p class="eyebrow">CONSULTAS · CLAREZA ANTES DA ESCOLHA</p><h3>O tamanho da leitura deve acompanhar o tamanho da pergunta.</h3><p>Compare escopo, profundidade e valor. Nenhum formato promete certeza, lê pensamentos literalmente ou substitui ajuda profissional.</p></div></header>
      <div class="ex541-service-map">${services.map((service,index)=>`<article>
        <small>${String(index+1).padStart(2,'0')} · ${safe(service.duration)}</small><h4>${safe(service.name)}</h4>
        <p>${safe(service.detail)}</p><strong>${money(service.priceCents)}</strong>
        <button type="button" data-ex541-service="${safe(service.id)}">ESCOLHER ESTA LEITURA <span aria-hidden="true">→</span></button>
      </article>`).join('')}</div>
      <div class="ex541-truth-grid"><p><b>O que você envia</b><span>Somente o contexto necessário, com consentimento.</span></p><p><b>O que você recebe</b><span>Protocolo e confirmação humana pelo e-mail oficial.</span></p><p><b>O que não acontece</b><span>Nenhuma cobrança automática ou consumo de créditos da Whit.</span></p></div>`);
    if(app.id==='consultationApp')app.insertAdjacentElement('beforebegin',section);
    else app.append(section);
  }

  mountStore(){
    const app=publicRoot('store');
    if(!app||document.getElementById('experienceDepthStoreV541'))return;
    const section=makeSection('experienceDepthStoreV541','ex541-world ex541-store','Ritual de escolha da Loja Mística',`
      <header class="ex541-head"><span aria-hidden="true">◇</span><div><p class="eyebrow">LOJA MÍSTICA · ESCOLHA CONSCIENTE</p><h3>Entre por uma intenção, não por impulso.</h3><p>A curadoria organiza caminhos de busca. O anúncio real, o preço, o estoque, o vendedor e a entrega são sempre conferidos na Amazon.</p></div></header>
      <div class="ex541-intentions">${STORE_POLICY.collections.map(item=>`<button type="button" data-ex541-collection="${safe(item.id)}"><span aria-hidden="true">${safe(item.sigil)}</span><b>${safe(item.name)}</b><small>${safe(item.description)}</small></button>`).join('')}</div>
      <ol class="ex541-steps"><li><b>1 · Intenção</b><span>Defina o que precisa acompanhar sua prática.</span></li><li><b>2 · Comparação</b><span>Confira material, tamanho, idioma, vendedor e avaliações.</span></li><li><b>3 · Decisão</b><span>Revise preço, entrega, garantia e devolução no parceiro.</span></li></ol>
      <p class="ex541-covenant"><span aria-hidden="true">✦</span><span><b>Parceria transparente.</b> O código de associado oficial está ativo; uma compra qualificada pode gerar comissão sem aumentar o preço.</span></p>`);
    app.insertAdjacentElement('afterend',section);
  }

  mountMusic(){
    const app=publicRoot('music');
    if(!app||document.getElementById('experienceDepthMusicV541'))return;
    const albums=(this.config.spotifyAlbums||[]).filter(item=>item?.name).slice(0,20);
    const section=makeSection('experienceDepthMusicV541','ex541-world ex541-music','Caderno de escuta da Orbe Sonora',`
      <header class="ex541-head"><span aria-hidden="true">♫</span><div><p class="eyebrow">ORBE SONORA · ESCUTA COM PRESENÇA</p><h3>A música começa somente quando você escolhe.</h3><p>Os players ficam adormecidos até o toque. Isso preserva silêncio, dados móveis e fluidez — sem autoplay.</p></div></header>
      ${albums.length?`<div class="ex541-albums">${albums.map((album,index)=>`<button type="button" data-ex541-album="${safe(album.id)}"><small>LANÇAMENTO ${String(index+1).padStart(2,'0')}</small><b>${safe(album.name)}</b><span>${safe(album.artist||'Hércules DX')} · ouvir quando quiser</span></button>`).join('')}</div>`:''}
      <div class="ex541-listening"><p><b>Antes</b><span>Escolha uma intenção simples para a escuta.</span></p><p><b>Durante</b><span>Observe uma imagem, palavra ou sensação sem forçar significado.</span></p><p><b>Depois</b><span>Registre o que permaneceu — não o que você acha que deveria sentir.</span></p></div>`);
    app.insertAdjacentElement('afterend',section);
  }

  mountVideos(){
    const app=publicRoot('videos');
    if(!app||document.getElementById('experienceDepthVideosV541'))return;
    const section=makeSection('experienceDepthVideosV541','ex541-world ex541-videos','Caderno editorial de De Frente com o Tarot',`
      <header class="ex541-head"><span aria-hidden="true">▶</span><div><p class="eyebrow">DE FRENTE COM O TAROT · ARQUIVO VIVO</p><h3>Cada episódio nasce de uma pergunta verdadeira.</h3><p>Vídeo, animação ou Memoji podem entrar no mesmo arquivo. Só conteúdos realmente publicados aparecem; rascunhos, convidados e datas nunca são inventados.</p></div></header>
      <div class="ex541-video-method"><article><small>01</small><h4>Símbolo central</h4><p>Uma carta, imagem ou tema abre a conversa.</p></article><article><small>02</small><h4>Pergunta humana</h4><p>O episódio investiga sem prometer respostas absolutas.</p></article><article><small>03</small><h4>Gesto possível</h4><p>A reflexão termina com autonomia e aplicação concreta.</p></article></div>
      <p class="ex541-covenant"><span aria-hidden="true">◇</span><span><b>Arquivo verdadeiro.</b> Quando houver episódios, busca e compartilhamento aparecem automaticamente sem guardar o que você procurou.</span></p>`);
    app.insertAdjacentElement('afterend',section);
  }

  decorateVideos(){
    const app=publicRoot('videos');
    if(!app)return;
    const cards=[...app.querySelectorAll('.media-v149-episode')];
    const grid=app.querySelector('.media-v149-episode-grid');
    let tools=app.querySelector('[data-ex541-video-tools]');
    if(!cards.length){tools?.remove();return;}
    if(!tools&&grid){
      tools=document.createElement('div');tools.className='ex541-video-tools';tools.dataset.ex541VideoTools='';
      tools.innerHTML=`<label><span>BUSCAR NOS EPISÓDIOS PUBLICADOS</span><input type="search" autocomplete="off" data-ex541-video-search placeholder="Tema, carta ou episódio"></label><p role="status" aria-live="polite" data-ex541-video-status>${cards.length} ${cards.length===1?'episódio publicado':'episódios publicados'}</p>`;
      grid.insertAdjacentElement('beforebegin',tools);
    }
    cards.forEach(card=>{
      if(card.querySelector('[data-ex541-share]'))return;
      const link=card.querySelector('a[href]');
      if(!link)return;
      const button=document.createElement('button');button.type='button';button.dataset.ex541Share=link.href;
      button.textContent='COMPARTILHAR';button.setAttribute('aria-label',`Compartilhar ${clean(card.querySelector('h4')?.textContent||'episódio')}`);
      card.querySelector(':scope > div:last-child')?.append(button);
    });
  }

  handleInput(event){
    const input=event.target.closest?.('[data-ex541-video-search]');
    if(!input)return;
    const query=clean(input.value,100).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const app=publicRoot('videos');
    const cards=[...app?.querySelectorAll?.('.media-v149-episode')||[]];
    let visible=0;
    cards.forEach(card=>{
      const content=String(card.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const show=!query||content.includes(query);card.hidden=!show;if(show)visible+=1;
    });
    const status=app?.querySelector('[data-ex541-video-status]');
    if(status)status.textContent=`${visible} ${visible===1?'episódio encontrado':'episódios encontrados'}`;
  }

  async handleClick(event){
    const service=event.target.closest?.('[data-ex541-service]');
    if(service){
      event.preventDefault();
      const id=service.dataset.ex541Service;
      const selected=this.base?.chooseService?.(id)||document.querySelector(`#consultationApp [data-service="${CSS.escape(id)}"]`)?.click();
      this.pulse('consultation-choice',.42);
      if(!selected&&location.pathname&&!document.getElementById('consultations'))location.href=`./#consultations`;
      return;
    }
    const collection=event.target.closest?.('[data-ex541-collection]');
    if(collection){
      event.preventDefault();
      const target=document.querySelector(`#storeApp [data-collection="${CSS.escape(collection.dataset.ex541Collection)}"]`);
      target?.click();target?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});this.pulse('store-intention',.34);return;
    }
    const album=event.target.closest?.('[data-ex541-album]');
    if(album){
      event.preventDefault();
      const target=document.querySelector(`#musicApp [data-ec530-album="${CSS.escape(album.dataset.ex541Album)}"],#musicApp [data-album="${CSS.escape(album.dataset.ex541Album)}"]`);
      target?.click();target?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});this.pulse('music-listen',.36);return;
    }
    const share=event.target.closest?.('[data-ex541-share]');
    if(share){
      event.preventDefault();
      const title=clean(share.closest('.media-v149-episode')?.querySelector('h4')?.textContent||'De Frente com o Tarot');
      try{
        if(navigator.share)await navigator.share({title,url:share.dataset.ex541Share});
        else{await navigator.clipboard.writeText(share.dataset.ex541Share);this.notify('Link do episódio copiado.');}
      }catch{}
    }
  }

  pulse(reason,intensity){try{this.orbCore?.pulse?.(`experience-v541-${reason}`,{intensity,route:'experience'});}catch{}}
  notify(message){globalThis.dispatchEvent?.(new CustomEvent('orbe:toast',{detail:message}));}

  status(){
    return Object.freeze({...EXPERIENCE_DEPTH_CONTRACT_V541,mounted:ROUTES.filter(route=>Boolean(publicRoot(route))).length,
      publishedVideoCards:document.querySelectorAll('#videoApp .media-v149-episode').length});
  }
  contract(){return EXPERIENCE_DEPTH_CONTRACT_V541;}
  destroy(){
    this.abort.abort();document.querySelectorAll('[data-experience-depth="v541"],[data-ex541-video-tools]').forEach(node=>node.remove());
    delete document.documentElement.dataset.experienceDepth;if(globalThis[MARK]===this)delete globalThis[MARK];
  }
}

export function createExperienceDepthCoreV541(options={}){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new ExperienceDepthCoreV541(options);globalThis[MARK]=instance;
  globalThis.divinaExperienceDepthV541=instance;return instance;
}
