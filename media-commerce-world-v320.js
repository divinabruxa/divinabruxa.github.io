/* DIVINA BRUXA 2.0 — REBIRTH R021 · LOJA + MÚSICA + VÍDEO V320
   Loja usa StoreEngine V192.
   Música usa MediaEngine V192 e catálogo Spotify real já configurado.
   Vídeo lê somente episódios publicados do Supabase STAGING.
   AdminMedia usa a função owner+MFA admin-media-v320; nenhum CRUD editorial usa localStorage. */

import { StoreEngine } from './store-engine.js?v=192';
import { MediaEngineV192 } from './media-engine-v192.js?v=192';
import { EditorialJourneyV192 } from './editorial-journey-v192.js?v=192';
import { safeMediaURL } from './media-policy-v149.js?v=149';

const RELEASE='V320';
const PUBLIC_SELECT='id,slug,title,description,season,youtube_url,youtube_video_id,thumbnail_url,seo_title,seo_description,sort_order,is_featured,status,published_at,created_at,updated_at';
const ADMIN_TIMEOUT=15000;

const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

const clean=(value,limit=300)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const routeNow=()=>document.body?.dataset?.screen||location.hash.replace(/^#/,'')||'home';
const reduced=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

const youtubeId=value=>{
  try{
    const url=new URL(String(value||''));
    if(url.hostname==='youtu.be')return url.pathname.split('/').filter(Boolean)[0]||'';
    if(url.pathname.startsWith('/shorts/'))return url.pathname.split('/')[2]||'';
    if(url.pathname.startsWith('/embed/'))return url.pathname.split('/')[2]||'';
    return url.searchParams.get('v')||'';
  }catch{return '';}
};
const thumbnailFor=episode=>{
  const custom=String(episode?.thumbnail||episode?.thumbnail_url||'').trim();
  if(/^https:\/\//i.test(custom))return custom;
  const id=clean(episode?.youtubeVideoId||episode?.youtube_video_id||youtubeId(episode?.url||episode?.youtube_url),24);
  return /^[A-Za-z0-9_-]{6,20}$/.test(id)?`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`:'';
};
const localDateTime=value=>{
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  const offset=date.getTimezoneOffset()*60000;
  return new Date(date.getTime()-offset).toISOString().slice(0,16);
};
const formatDate=value=>{
  if(!value)return '—';
  try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(value));}
  catch{return '—';}
};

async function fetchPublishedEpisodes(config){
  const base=String(config?.supabaseUrl||'').replace(/\/$/,'');
  const key=String(config?.supabasePublishableKey||'');
  if(!base||!key)return [];
  const url=new URL(`${base}/rest/v1/video_episodes`);
  url.searchParams.set('select',PUBLIC_SELECT);
  url.searchParams.set('order','sort_order.asc,published_at.desc');
  url.searchParams.set('limit','100');
  const response=await fetch(url,{
    method:'GET',
    cache:'no-store',
    headers:{Accept:'application/json',apikey:key}
  });
  if(!response.ok)throw new Error(`VIDEO_PUBLIC_${response.status}`);
  const rows=await response.json();
  return (Array.isArray(rows)?rows:[]).map(row=>Object.freeze({
    id:String(row.id||''),
    slug:String(row.slug||''),
    title:String(row.title||'').slice(0,160),
    description:String(row.description||'').slice(0,2000),
    season:String(row.season||'De Frente com o Tarot').slice(0,120),
    url:safeMediaURL(row.youtube_url),
    youtubeVideoId:String(row.youtube_video_id||'').slice(0,24),
    thumbnail:String(row.thumbnail_url||'').slice(0,700),
    seoTitle:String(row.seo_title||'').slice(0,180),
    seoDescription:String(row.seo_description||'').slice(0,400),
    isFeatured:row.is_featured===true,
    status:'publicado',
    publishAt:row.published_at,
    publishedAt:row.published_at
  })).filter(item=>item.title&&item.url);
}

function insertWorld(root,id,html){
  if(!root)return null;
  root.querySelector(`#${id}`)?.remove();
  const section=document.createElement('section');
  section.id=id;
  section.className='mcv320-world';
  section.innerHTML=html;
  root.prepend(section);
  return section;
}

export class StoreWorldV320{
  constructor(root,config={}){
    this.root=root?.id==='storeApp'?root:document.querySelector('#storeApp');
    this.config=config||{};
    if(!this.root)return;
    this.engine=new StoreEngine(this.root,this.config);
    new EditorialJourneyV192(this.root,'store');
    this.root.dataset.storeWorld='v320';
    this.enhance();
    document.dispatchEvent(new CustomEvent('divina:store-world-ready',{detail:Object.freeze({
      release:RELEASE,
      productCount:Array.isArray(this.config.products)?this.config.products.length:0,
      affiliate:Boolean(this.config.amazonAssociateTag),
      checkoutInternal:false
    })}));
  }

  enhance(){
    const count=Array.isArray(this.config.products)?this.config.products.length:0;
    const affiliate=/^[a-z0-9_-]{2,40}$/i.test(String(this.config.amazonAssociateTag||''));
    insertWorld(this.root,'storeWorldV320',`
      <div class="mcv320-stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="mcv320-head">
        <div><p class="eyebrow">LOJA MÍSTICA · CURADORIA VIVA</p>
        <h3>Escolher também pode ser um ritual consciente.</h3>
        <p>A Divina Bruxa organiza caminhos; preço, estoque, vendedor, pagamento e entrega continuam sendo confirmados diretamente na Amazon.</p></div>
        <span class="mcv320-seal" aria-hidden="true">⌘</span>
      </header>
      <div class="mcv320-pulse">
        <article><strong>${count}</strong><span>escolhas editoriais</span></article>
        <article><strong>${affiliate?'ATIVO':'—'}</strong><span>associado Amazon</span></article>
        <article><strong>0</strong><span>checkout interno</span></article>
      </div>
      <p class="mcv320-covenant"><span>◇</span><span><b>Transparência primeiro.</b> Links podem gerar comissão para a Divina Bruxa sem alterar o preço pago no parceiro.</span></p>`);
  }

  status(){
    return Object.freeze({release:RELEASE,baseEngine:'V192',checkoutInternal:false,affiliateLinks:true});
  }
}

export class MediaWorldV320{
  constructor(roots={},config={}){
    this.roots=roots||{};
    this.config=config||{};
    this.episodes=[];
    this.loading=false;
    this.loaded=false;
    this.error='';
    this.abort=new AbortController();

    this.engine=new MediaEngineV192(this.roots,this.config);
    this.originalRenderAlbumPlayer=this.engine.renderAlbumPlayer.bind(this.engine);
    this.engine.renderAlbumPlayer=(...args)=>{
      const result=this.originalRenderAlbumPlayer(...args);
      this.enforceNoAutoplay();
      return result;
    };
    this.engine.episodes=()=>this.episodes;
    this.engine.episodeCard=(episode,index)=>this.episodeCard(episode,index);

    new EditorialJourneyV192(this.roots.music,'music');
    new EditorialJourneyV192(this.roots.videos,'videos');

    this.roots.music?.setAttribute('data-media-world','v320');
    this.roots.videos?.setAttribute('data-media-world','v320');
    this.enforceNoAutoplay();
    this.enhanceMusic();
    this.enhanceVideos();
    this.bind();

    if(routeNow()==='videos')this.loadEpisodes();
  }

  bind(){
    const signal=this.abort.signal;
    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id==='videos')this.loadEpisodes();
      if(event.detail?.id==='music'){this.enforceNoAutoplay();this.enhanceMusic();}
    },{signal});
    document.addEventListener('divina:route-ready',event=>{
      if(event.detail?.id==='videos')this.loadEpisodes();
    },{signal});
  }

  enforceNoAutoplay(){
    this.roots.music?.querySelectorAll('iframe').forEach(frame=>{
      frame.setAttribute('allow','clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    });
  }

  enhanceMusic(){
    const albums=this.engine.albums?.()||[];
    insertWorld(this.roots.music,'musicWorldV320',`
      <div class="mcv320-stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="mcv320-head">
        <div><p class="eyebrow">MÚSICA · ORBE SONORA</p>
        <h3>Som para atravessar realidades — nunca para invadir o silêncio.</h3>
        <p>Seus lançamentos oficiais vivem aqui com player sob escolha da pessoa. Nada começa a tocar sozinho.</p></div>
        <span class="mcv320-seal" aria-hidden="true">♫</span>
      </header>
      <div class="mcv320-pulse">
        <article><strong>${albums.length}</strong><span>álbuns oficiais</span></article>
        <article><strong>OFF</strong><span>autoplay</span></article>
        <article><strong>SPOTIFY</strong><span>player oficial</span></article>
      </div>`);
  }

  enhanceVideos(){
    const count=this.episodes.length;
    const state=this.loading?'SINCRONIZANDO':this.error?'INDISPONÍVEL':count?'ARQUIVO VIVO':'PRONTO PARA PUBLICAR';
    const latest=this.episodes[0];
    const world=insertWorld(this.roots.videos,'videosWorldV320',`
      <div class="mcv320-stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="mcv320-head">
        <div><p class="eyebrow">VÍDEO · DE FRENTE COM O TAROT</p>
        <h3>${latest?`O arquivo está vivo.`:`Sem episódios falsos. O primeiro nasce quando você publicar.`}</h3>
        <p>${latest
          ?'Cada capítulo veio do cofre editorial protegido da proprietária e só aparece depois de publicado.'
          :'Rascunhos ficam invisíveis. Quando você publicar um vídeo pelo Admin, ele passa a aparecer aqui automaticamente.'}</p></div>
        <span class="mcv320-seal" aria-hidden="true">▶</span>
      </header>
      <div class="mcv320-pulse">
        <article><strong>${count}</strong><span>publicados</span></article>
        <article><strong>${state}</strong><span>estado editorial</span></article>
        <article><strong>0</strong><span>episódios inventados</span></article>
      </div>
      ${this.error?'<p class="mcv320-covenant"><span>◇</span><span><b>O arquivo editorial não respondeu agora.</b> A página não inventou conteúdo para preencher o espaço.</span></p>':''}`);
    return world;
  }

  async loadEpisodes(force=false){
    if(this.loading||(!force&&this.loaded))return;
    this.loading=true;this.error='';this.enhanceVideos();
    try{
      this.episodes=await fetchPublishedEpisodes(this.config);
      this.loaded=true;
    }catch(error){
      this.error='public-feed-unavailable';
      this.episodes=[];
    }finally{
      this.loading=false;
      this.engine.renderVideos();
      new EditorialJourneyV192(this.roots.videos,'videos');
      this.enhanceVideos();
      document.dispatchEvent(new CustomEvent('divina:videos-world-ready',{detail:Object.freeze({
        release:RELEASE,
        published:this.episodes.length,
        fakeEpisodes:0,
        loaded:this.loaded,
        error:Boolean(this.error)
      })}));
    }
  }

  episodeCard(episode,index){
    const image=thumbnailFor(episode);
    const date=formatDate(episode.publishAt||episode.publishedAt);
    return `<article class="media-v149-episode mcv320-episode${episode.isFeatured?' is-featured':''}">
      <a class="mcv320-episode-art" href="${safe(episode.url)}" target="_blank" rel="noopener noreferrer" aria-label="Assistir ${safe(episode.title)} no YouTube">
        ${image?`<img src="${safe(image)}" alt="" width="640" height="360" loading="lazy" decoding="async">`:''}
        <span>${String(index+1).padStart(2,'0')}</span><i aria-hidden="true">▶</i>
      </a>
      <div><p class="eyebrow">${safe(episode.season||'DE FRENTE COM O TAROT')}</p>
      <h4>${safe(episode.title)}</h4>
      <p>${safe(episode.description||'')}</p>
      ${date?`<small class="media-v149-date">Publicado em ${safe(date)}</small>`:''}
      <a href="${safe(episode.url)}" target="_blank" rel="noopener noreferrer">ASSISTIR NO YOUTUBE <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V192',
      publishedVideos:this.episodes.length,
      noInventedEpisodes:true,
      musicAutoplay:false,
      publicVideoSource:'supabase-published-only'
    });
  }

  destroy(){this.abort.abort();}
}

export class AdminMediaV320{
  constructor(root){
    this.root=root?.id==='adminApp'?root:document.querySelector('#adminApp');
    this.apiBase='';
    this.episodes=[];
    this.loading=false;
    this.loaded=false;
    this.error='';
    this.editingId='';
    this.observer=null;
    this.abort=new AbortController();
    if(!this.root)return;

    this.apiBase=`${String(globalThis.divinaAuth?.functionBase||'').replace(/\/$/,'')}/admin-media-v320`;
    this.bind();
    this.observe();
    this.tryMount();
  }

  bind(){
    const signal=this.abort.signal;
    this.root.addEventListener('click',event=>{
      if(event.target.closest('[data-admin-module="media"]'))setTimeout(()=>this.tryMount(true),0);
    },{capture:true,signal});
  }

  observe(){
    this.observer=new MutationObserver(()=>this.tryMount(false));
    this.observer.observe(this.root,{childList:true,subtree:true});
  }

  mediaSelected(){
    return Boolean(this.root.querySelector('[data-admin-module="media"][aria-current="page"]'));
  }

  tryMount(forceLoad=false){
    if(!this.mediaSelected())return false;
    const slot=this.root.querySelector('[data-admin-module-content]');
    if(!slot)return false;
    if(!slot.querySelector('[data-admin-media-v320]'))this.render(slot);
    if(forceLoad||!this.loaded)this.load();
    return true;
  }

  async request(payload=null){
    if(!this.apiBase)return {ok:false,error:'backend-unavailable'};
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),ADMIN_TIMEOUT);
    try{
      const response=await fetch(this.apiBase,{
        method:payload?'POST':'GET',
        credentials:'include',
        cache:'no-store',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
          'x-divina-admin-request':'v320'
        },
        signal:controller.signal,
        ...(payload?{body:JSON.stringify(payload)}:{})
      });
      const body=await response.json().catch(()=>({}));
      return {ok:response.ok,status:response.status,body};
    }catch{return {ok:false,status:0,body:{error:'network_unavailable'}};}
    finally{clearTimeout(timer);}
  }

  async load(){
    if(this.loading)return;
    this.loading=true;this.error='';this.paintState('Carregando cofre editorial…');
    const result=await this.request();
    this.loading=false;
    if(result.ok){
      this.episodes=Array.isArray(result.body?.episodes)?result.body.episodes:[];
      this.loaded=true;
      this.error='';
    }else{
      this.error=String(result.body?.error||'media_load_failed');
    }
    const slot=this.root.querySelector('[data-admin-module-content]');
    if(slot&&this.mediaSelected())this.render(slot);
  }

  render(slot){
    const editing=this.episodes.find(item=>item.id===this.editingId)||null;
    slot.innerHTML=`<section class="admin-media-v320" data-admin-media-v320>
      <div class="admin-media-v320__state">
        <span><b>V320</b><small>OWNER + MFA · STAGING</small></span>
        <span><b>${this.episodes.length}</b><small>itens editoriais</small></span>
        <span><b>PUBLICADO</b><small>é o único estado público</small></span>
      </div>

      <article class="admin-media-v320__editor">
        <header><div><p class="eyebrow">EDITOR DE VÍDEO</p><h4>${editing?'Editar episódio':'Novo episódio'}</h4><span>Rascunho → revisão → publicado. Nenhum episódio é criado automaticamente.</span></div><b>DE FRENTE COM O TAROT</b></header>
        <form data-media-form>
          <input type="hidden" name="id" value="${safe(editing?.id||'')}">
          <div class="admin-media-v320__grid">
            <label><span>Título</span><input name="title" maxlength="160" required value="${safe(editing?.title||'')}"></label>
            <label><span>Temporada / série</span><input name="season" maxlength="120" value="${safe(editing?.season||'De Frente com o Tarot')}"></label>
            <label class="wide"><span>URL do YouTube</span><input name="youtubeUrl" type="url" inputmode="url" required placeholder="https://www.youtube.com/watch?v=..." value="${safe(editing?.youtube_url||'')}"></label>
            <label class="wide"><span>Descrição</span><textarea name="description" maxlength="2000" rows="5">${safe(editing?.description||'')}</textarea></label>
            <label><span>Publicar em</span><input name="publishAt" type="datetime-local" value="${safe(localDateTime(editing?.published_at))}"></label>
            <label><span>Ordem</span><input name="sortOrder" type="number" min="0" max="9999" step="1" value="${Number(editing?.sort_order||0)}"></label>
            <label class="wide"><span>Capa opcional (HTTPS)</span><input name="thumbnailUrl" type="url" inputmode="url" placeholder="https://..." value="${safe(editing?.thumbnail_url||'')}"></label>
            <label><span>SEO · título</span><input name="seoTitle" maxlength="180" value="${safe(editing?.seo_title||'')}"></label>
            <label><span>SEO · descrição</span><input name="seoDescription" maxlength="400" value="${safe(editing?.seo_description||'')}"></label>
            <label class="check"><input name="isFeatured" type="checkbox" ${editing?.is_featured?'checked':''}><span>Destacar episódio</span></label>
          </div>
          <div class="admin-media-v320__actions">
            <button type="button" data-save-status="draft">${this.loading?'AGUARDE…':'SALVAR RASCUNHO'}</button>
            <button type="button" class="primary" data-save-status="published">${this.loading?'AGUARDE…':'PUBLICAR / AGENDAR'}</button>
            ${editing?'<button type="button" data-cancel-edit>CANCELAR EDIÇÃO</button>':''}
          </div>
        </form>
        <p data-media-state role="status" aria-live="polite">${this.error?`Falha: ${safe(this.error)}`:'Publicação real permanece restrita ao STAGING editorial; isso não ativa billing nem produção.'}</p>
      </article>

      <article class="admin-media-v320__archive">
        <header><div><p class="eyebrow">ARQUIVO EDITORIAL</p><h4>Seus episódios</h4></div><button type="button" data-media-refresh>ATUALIZAR</button></header>
        ${this.episodes.length?`<div class="admin-media-v320__list">${this.episodes.map(item=>this.row(item)).join('')}</div>`:
        '<div class="admin-media-v320__empty"><span>▶</span><b>Nenhum episódio criado.</b><p>Isso é correto: o site público continuará vazio até você publicar seu primeiro vídeo.</p></div>'}
      </article>
    </section>`;

    this.bindEditor(slot);
  }

  row(item){
    const image=thumbnailFor(item);
    return `<section class="admin-media-v320__row" data-media-row="${safe(item.id)}">
      <div class="admin-media-v320__thumb">${image?`<img src="${safe(image)}" alt="" width="160" height="90" loading="lazy" decoding="async">`:'<span>▶</span>'}</div>
      <div><small>${safe(item.status||'draft')} · ${safe(item.season||'De Frente com o Tarot')}</small>
      <b>${safe(item.title||'Sem título')}</b>
      <span>${item.published_at?`Publicação: ${safe(formatDate(item.published_at))}`:'Ainda não publicado'}</span></div>
      <div class="admin-media-v320__row-actions">
        <button type="button" data-edit-media="${safe(item.id)}">EDITAR</button>
        <button type="button" data-delete-media="${safe(item.id)}">EXCLUIR</button>
      </div>
    </section>`;
  }

  bindEditor(slot){
    slot.querySelectorAll('[data-save-status]').forEach(button=>button.addEventListener('click',()=>this.save(button.dataset.saveStatus)));
    slot.querySelector('[data-cancel-edit]')?.addEventListener('click',()=>{this.editingId='';this.render(slot);});
    slot.querySelector('[data-media-refresh]')?.addEventListener('click',()=>this.load());
    slot.querySelectorAll('[data-edit-media]').forEach(button=>button.addEventListener('click',()=>{
      this.editingId=button.dataset.editMedia;
      this.render(slot);
      slot.querySelector('.admin-media-v320__editor')?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
    }));
    slot.querySelectorAll('[data-delete-media]').forEach(button=>button.addEventListener('click',()=>this.remove(button.dataset.deleteMedia)));
  }

  values(){
    const form=this.root.querySelector('[data-media-form]');
    if(!form)return null;
    const raw=Object.fromEntries(new FormData(form));
    const publishAt=raw.publishAt?new Date(String(raw.publishAt)).toISOString():null;
    return {
      id:clean(raw.id,80)||undefined,
      title:clean(raw.title,160),
      season:clean(raw.season,120)||'De Frente com o Tarot',
      youtubeUrl:clean(raw.youtubeUrl,700),
      description:String(raw.description||'').trim().slice(0,2000),
      publishAt,
      thumbnailUrl:clean(raw.thumbnailUrl,700),
      seoTitle:clean(raw.seoTitle,180),
      seoDescription:clean(raw.seoDescription,400),
      sortOrder:Math.max(0,Math.min(9999,Number(raw.sortOrder)||0)),
      isFeatured:form.elements.isFeatured?.checked===true
    };
  }

  async save(status){
    if(this.loading)return;
    const episode=this.values();
    if(!episode?.title||!episode?.youtubeUrl){this.paintState('Preencha título e URL do YouTube.');return;}
    if(status==='published'&&!globalThis.confirm?.('Publicar este episódio no arquivo público? Rascunhos continuam invisíveis.'))return;
    this.loading=true;this.paintState(status==='published'?'Publicando no cofre editorial…':'Salvando rascunho…');
    const result=await this.request({action:'save',episode:{...episode,status}});
    this.loading=false;
    if(result.ok){
      this.editingId='';
      this.loaded=false;
      await this.load();
      globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:status==='published'?'Episódio publicado no STAGING editorial.':'Rascunho de vídeo salvo no STAGING.'}));
      return;
    }
    this.paintState(`Não foi possível salvar: ${String(result.body?.error||'erro editorial')}.`);
  }

  async remove(id){
    if(this.loading||!id)return;
    const item=this.episodes.find(row=>row.id===id);
    if(!globalThis.confirm?.(`Excluir “${item?.title||'este episódio'}” do cofre editorial?`))return;
    this.loading=true;this.paintState('Excluindo…');
    const result=await this.request({action:'delete',id});
    this.loading=false;
    if(result.ok){
      this.editingId='';
      this.loaded=false;
      await this.load();
      globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:'Episódio excluído do STAGING editorial.'}));
      return;
    }
    this.paintState('O episódio não pôde ser excluído.');
  }

  paintState(message){
    const state=this.root.querySelector('[data-media-state]');
    if(state)state.textContent=message;
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      episodes:this.episodes.length,
      backend:'admin-media-v320',
      localCrud:false,
      ownerMfaRequired:true,
      draftsPublic:false
    });
  }

  destroy(){this.abort.abort();this.observer?.disconnect();}
}
