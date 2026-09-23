/* DIVINA BRUXA — WORK13 · VÍDEOS · CINEMA DA ORBE · V626
   Memojis nativos publicados pela proprietária e De Frente com o Tarot no
   motor oficial V559. Um único player, sempre depois de gesto explícito. */

const VERSION = 626;
const STYLE_ID = 'divinaVideosWorldV626';
const STYLE_HREF = './videos-world-v626.css?v=626-cinema-da-orbe';
const INSTANCE = Symbol.for('divina.work13.videos.world.v626');
const BUCKET = 'memoji-videos-v626';
const CHUNK_BYTES = 6 * 1024 * 1024;
const MAX_VIDEO_BYTES = 512 * 1024 * 1024;
const MAX_POSTER_BYTES = 12 * 1024 * 1024;
const VIDEO_TYPES = new Set(['video/mp4','video/quicktime','video/webm','video/x-m4v']);
const POSTER_TYPES = new Set(['image/jpeg','image/png','image/webp','image/avif']);
const STATES = new Set(['draft','review','scheduled','published','archived']);
const CATEGORIES = Object.freeze([
  ['orbe','Orbe'],['site','Site'],['tarot','Tarot'],['musica','Música'],
  ['cantando','Cantando'],['bastidores','Bastidores'],['outros','Outros']
]);

export const VIDEOS_WORLD_CONTRACT_V626 = Object.freeze({
  version:VERSION,work:'WORK13',reality:'videos',name:'Vídeos',universe:'cinema-da-orbe',
  channels:Object.freeze(['memoji-native','de-frente-com-o-tarot-youtube']),
  primaryChannel:'memoji-native',memojiRole:'rosto-e-voz-da-orbe',
  memojiUpload:'signed-resumable-tus',iphoneDirectUpload:true,
  acceptedVideoTypes:Object.freeze([...VIDEO_TYPES]),privateStorage:true,
  publicSignedPlayback:true,adminAuthority:'owner-confirmed-email-mfa-aal2-active-session-recovery-codes',
  editorialStates:Object.freeze([...STATES]),editable:true,reorderable:true,hideable:true,
  youtubeAuthority:'V559-preserved',youtubeProject:'De Frente com o Tarot',
  officialEpisodesAtRelease:0,inventedEpisodes:0,publicPublishedOnly:true,
  playerLoadsAfterExplicitGesture:true,autoplay:false,maximumActivePlayers:1,
  anotherPlayerStopsBeforePlayback:true,existingVideoBodyReused:true,
  oneCanonicalOrb:true,newOrbs:0,newCanvases:0,newRenderers:0,
  automaticNavigation:false,automaticWhitSpeech:false,privateContentReads:0,
  permanentAnimationLoops:0,mutationObservers:0,iphoneFirst:true,
  reducedMotionPreservesMeaning:true,work14:false
});

const clean = (value,max=500) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const number = (value,min=0,max=9999) => Math.max(min,Math.min(max,Math.floor(Number(value)||0)));
const routeId = value => clean(value || 'home',40).toLowerCase().replace(/^#/,'').split(/[?&/]/)[0] || 'home';
const eventRoute = (event,doc,win) => routeId(event?.detail?.id || event?.detail?.route || event?.detail?.to
  || doc?.body?.dataset?.screen || doc?.querySelector?.('.screen.active[id]')?.id || win?.location?.hash);
const formatDate = value => { try { return value ? new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium'}).format(new Date(value)) : ''; } catch { return ''; } };
const formatBytes = value => { const bytes=Number(value)||0; if(!bytes)return ''; const units=['B','KB','MB','GB']; const rank=Math.min(units.length-1,Math.floor(Math.log(bytes)/Math.log(1024))); return `${(bytes/(1024**rank)).toFixed(rank?1:0)} ${units[rank]}`; };
const wait = milliseconds => new Promise(resolve => setTimeout(resolve,Math.max(0,milliseconds)));
const safeCall = (target,name,...args) => { try { return target?.[name]?.(...args); } catch { return null; } };
const emit = (doc,type,detail) => { const EventCtor=doc?.defaultView?.CustomEvent||globalThis.CustomEvent; if(!doc?.dispatchEvent||typeof EventCtor!=='function')return false; doc.dispatchEvent(new EventCtor(type,{detail:Object.freeze(detail)})); return true; };

function mediaUrl(value,config,win){
  try{
    const url=new URL(String(value||''),win?.location?.href||'https://divinabruxa.com.br/');
    const project=new URL(String(config?.supabaseUrl||'')).hostname.split('.')[0];
    const hosts=new Set([`${project}.supabase.co`,`${project}.storage.supabase.co`]);
    return url.protocol==='https:'&&hosts.has(url.hostname)?url.href:'';
  }catch{return '';}
}

function base64Metadata(value){
  const bytes=new TextEncoder().encode(String(value));
  let binary='';
  bytes.forEach(byte=>{binary+=String.fromCharCode(byte);});
  return btoa(binary);
}

function button(label,action,value=''){
  const node=document.createElement('button');
  node.type='button';node.textContent=label;node.dataset.v626Action=action;
  if(value)node.dataset.v626Id=value;
  return node;
}

export class VideosWorldV626 {
  constructor({config={},go=null,media=null,livingMedia=null,orbCore=null,documentTarget=globalThis.document,windowTarget=globalThis.window||globalThis}={}){
    this.config=config||{};this.go=typeof go==='function'?go:null;this.media=media;this.livingMedia=livingMedia;this.orbCore=orbCore;
    this.documentTarget=documentTarget;this.windowTarget=windowTarget;this.root=documentTarget?.getElementById?.('videos')||null;
    this.legacy=documentTarget?.getElementById?.('videoApp')||null;this.adminHost=documentTarget?.getElementById?.('adminMemojiV626Host')||null;
    this.route=eventRoute(null,documentTarget,windowTarget);this.channel='memoji';this.items=[];this.adminItems=[];this.loaded=false;
    this.loading=false;this.adminLoaded=false;this.adminLoading=false;this.activeItem=null;this.activeVideo=null;this.activeTrigger=null;
    this.expiresAt=0;this.publicRequests=0;this.adminRequests=0;this.uploads=0;this.uploadedBytes=0;this.playerOpens=0;this.playerCloses=0;
    this.abort=typeof AbortController==='function'?new AbortController():null;this.uploadAbort=null;this.destroyed=false;
    this.installStyle();this.mountPublic();this.mountAdmin();this.bind();this.syncRoute(null,'boot');
    emit(this.documentTarget,'divina:videos-world-v626-ready',this.publicStatus());
  }

  installStyle(){
    const doc=this.documentTarget;if(!doc?.head||doc.getElementById?.(STYLE_ID))return false;
    const link=doc.createElement('link');link.id=STYLE_ID;link.rel='stylesheet';link.href=STYLE_HREF;doc.head.append(link);return true;
  }

  endpoint(){
    const base=String(this.config?.accountFunctionsBase||globalThis.divinaAuth?.functionBase||'').replace(/\/$/,'');
    return base?`${base}/memoji-videos-v626`:'';
  }

  mountPublic(){
    if(!this.root)return false;
    this.root.dataset.videosWorld='v626';this.root.dataset.videosUniverse='cinema-da-orbe';this.root.dataset.v626Channel=this.channel;
    this.publicShell=this.root.querySelector('[data-videos-world-v626]');
    if(!this.publicShell){
      this.publicShell=this.documentTarget.createElement('section');
      this.publicShell.className='vw626';this.publicShell.dataset.videosWorldV626='';
      this.publicShell.innerHTML=`<nav class="vw626-portals" role="tablist" aria-label="Salas do Cinema da Orbe"><button type="button" role="tab" data-v626-channel="memoji" aria-selected="true"><span aria-hidden="true">✦</span><b>MEMOJIS</b><small>A voz da Orbe</small></button><button type="button" role="tab" data-v626-channel="tarot" aria-selected="false"><span aria-hidden="true">▶</span><b>DE FRENTE COM O TAROT</b><small>Episódios oficiais</small></button></nav><section class="vw626-panel" data-v626-panel="memoji" role="tabpanel"><header class="vw626-intro"><div><p>MEMOJIS · PALCO NATIVO</p><h3>Seu rosto, sua voz, a presença da Orbe.</h3><span>Vídeos publicados pela proprietária, carregados somente quando você escolhe assistir.</span></div><button type="button" data-v626-action="refresh-public" aria-label="Atualizar Memojis">ATUALIZAR</button></header><p class="vw626-state" data-v626-public-state role="status" aria-live="polite">Preparando a sala…</p><div class="vw626-player" data-v626-player hidden></div><div class="vw626-gallery" data-v626-gallery></div></section>`;
      this.root.insertBefore(this.publicShell,this.legacy||null);
    }
    this.gallery=this.publicShell.querySelector('[data-v626-gallery]');this.playerSlot=this.publicShell.querySelector('[data-v626-player]');
    this.publicState=this.publicShell.querySelector('[data-v626-public-state]');
    if(this.legacy){this.legacy.dataset.videosChannel='de-frente-com-o-tarot';this.legacy.hidden=true;}
    return true;
  }

  mountAdmin(){
    if(!this.adminHost)return false;
    this.adminHost.dataset.adminMemoji='v626';
    this.adminHost.innerHTML=`<section class="am626" data-admin-memoji-v626><header class="am626-head"><div><p>CINEMA DA ORBE · OWNER + MFA · V626</p><h3>Publique seus Memojis</h3><span>Vídeo nativo no site; episódios do programa continuam por link oficial.</span></div><span>STAGING</span></header><div class="am626-portals"><button type="button" class="is-primary" data-v626-action="open-memoji-form"><b>PUBLICAR MEMOJI</b><small>Vídeo do iPhone, capa e categoria</small></button><button type="button" data-v626-action="open-tarot-admin"><b>ADICIONAR DE FRENTE COM O TAROT</b><small>Link oficial do YouTube</small></button></div><p class="am626-security">Somente a proprietária com e-mail confirmado, sessão ativa e MFA AAL2 pode salvar.</p><p class="am626-state" data-v626-admin-state role="status" aria-live="polite">Abra o editor para sincronizar seus Memojis.</p><section class="am626-editor" data-v626-admin-editor hidden><form data-v626-memoji-form><input type="hidden" name="id"><div class="am626-grid"><label class="is-wide">Título<input required maxlength="120" name="title" autocomplete="off"></label><label>Categoria<select name="category">${CATEGORIES.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label><label>Ordem<input type="number" min="0" max="9999" name="sortOrder" value="0" inputmode="numeric"></label><label class="is-wide">Descrição<textarea maxlength="600" name="description" rows="3"></textarea></label><label class="is-wide">Descrição acessível<input maxlength="240" name="accessibilityText" autocomplete="off" placeholder="Descreva o que aparece ou é dito no vídeo"></label><label class="is-wide">Vídeo do Memoji <small>MP4, MOV, WebM ou M4V · até 512 MB</small><input type="file" name="video" accept="video/mp4,video/quicktime,video/webm,video/x-m4v"></label><label class="is-wide">Capa opcional <small>JPG, PNG, WebP ou AVIF · até 12 MB</small><input type="file" name="poster" accept="image/jpeg,image/png,image/webp,image/avif"></label><label>Status<select name="status"><option value="draft">Rascunho</option><option value="review">Em revisão</option><option value="scheduled">Agendado</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label><label data-v626-schedule hidden>Publicar em<input type="datetime-local" name="publishAt"></label><label class="am626-check"><input type="checkbox" name="isVisible" checked> Visível quando publicado</label></div><div class="am626-progress" data-v626-progress hidden><span><i data-v626-progress-bar></i></span><b data-v626-progress-copy>0%</b></div><div class="am626-actions"><button type="submit" class="is-primary">SALVAR MEMOJI</button><button type="button" data-v626-action="reset-form">LIMPAR</button><button type="button" data-v626-action="cancel-upload" hidden>CANCELAR ENVIO</button><button type="button" data-v626-action="refresh-admin">ATUALIZAR</button></div></form><div class="am626-list" data-v626-admin-list></div></section></section>`;
    this.adminShell=this.adminHost.querySelector('[data-admin-memoji-v626]');this.adminEditor=this.adminHost.querySelector('[data-v626-admin-editor]');
    this.adminForm=this.adminHost.querySelector('[data-v626-memoji-form]');this.adminList=this.adminHost.querySelector('[data-v626-admin-list]');
    this.adminState=this.adminHost.querySelector('[data-v626-admin-state]');this.progress=this.adminHost.querySelector('[data-v626-progress]');
    return true;
  }

  listen(target,type,handler,options={}){const signal=this.abort?.signal;target?.addEventListener?.(type,handler,signal?{...options,signal}:options);}

  bind(){
    this.listen(this.publicShell,'click',event=>this.onPublicClick(event));
    this.listen(this.adminHost,'click',event=>this.onAdminClick(event));
    this.listen(this.adminForm,'submit',event=>this.onAdminSubmit(event));
    this.listen(this.adminForm,'change',event=>this.onAdminChange(event));
    ['divina:route-ready','divina:page-ready'].forEach(type=>this.listen(this.documentTarget,type,event=>this.syncRoute(event,type)));
    this.listen(this.windowTarget,'pagehide',()=>this.closePlayer('pagehide'));
    this.listen(this.documentTarget,'visibilitychange',()=>{if(this.documentTarget.hidden)this.activeVideo?.pause?.();});
  }

  isVideoRoute(){return this.route==='videos';}
  isAdminRoute(){return this.route==='admin';}

  syncRoute(event,reason='route'){
    const previous=this.route;this.route=eventRoute(event,this.documentTarget,this.windowTarget);
    if(previous==='videos'&&this.route!=='videos'){this.closePlayer('route-leave');this.stopLegacy();}
    if(this.isVideoRoute()){this.root?.setAttribute('data-v626-present','true');if(!this.loaded)this.loadPublic();}
    else this.root?.removeAttribute('data-v626-present');
    if(this.isAdminRoute()&&this.adminEditor&&!this.adminEditor.hidden&&!this.adminLoaded)this.loadAdmin();
    emit(this.documentTarget,'divina:videos-world-v626-state',{...this.publicStatus(),reason});
  }

  async api({scope='public',method='GET',body=null}={}){
    const endpoint=this.endpoint();if(!endpoint)throw new Error('backend_unavailable');
    const url=new URL(endpoint);url.searchParams.set('scope',scope);
    const headers={Accept:'application/json','x-divina-admin-request':'v626'};
    if(this.config?.supabasePublishableKey)headers.apikey=this.config.supabasePublishableKey;
    if(body)headers['content-type']='application/json';
    const response=await fetch(url,{method,credentials:scope==='admin'?'include':'omit',cache:'no-store',signal:this.abort?.signal,headers,body:body?JSON.stringify(body):undefined});
    let data={};try{data=await response.json();}catch{}
    if(!response.ok){const error=new Error(clean(data?.error||`http_${response.status}`,100));error.status=response.status;throw error;}
    return data;
  }

  setPublicState(copy,error=false){if(this.publicState){this.publicState.textContent=copy;this.publicState.classList.toggle('is-error',error);}}

  async loadPublic(force=false){
    if(this.loading||this.destroyed||(!force&&this.loaded))return;
    this.loading=true;this.setPublicState('Consultando os Memojis publicados…');
    try{
      const data=await this.api({scope:'public'});this.publicRequests+=1;
      this.items=(Array.isArray(data.items)?data.items:[]).slice(0,120).map(item=>Object.freeze({
        id:clean(item.id,80),title:clean(item.title,120),description:clean(item.description,600),category:clean(item.category,30),
        categoryLabel:clean(item.categoryLabel,40),accessibilityText:clean(item.accessibilityText,240),publishedAt:clean(item.publishedAt,50),
        videoUrl:mediaUrl(item.videoUrl,this.config,this.windowTarget),posterUrl:mediaUrl(item.posterUrl,this.config,this.windowTarget)
      })).filter(item=>item.id&&item.title&&item.videoUrl);
      this.expiresAt=Number(data.expiresAt)||0;this.loaded=true;this.renderGallery();
      this.setPublicState(this.items.length?`${this.items.length} ${this.items.length===1?'Memoji publicado':'Memojis publicados'}.`:'O primeiro Memoji publicado vai aparecer aqui.');
    }catch(error){
      this.items=[];this.renderGallery();this.setPublicState('A sala está pronta; o arquivo publicado não respondeu agora.',true);
    }finally{this.loading=false;}
  }

  renderGallery(){
    if(!this.gallery)return;this.gallery.replaceChildren();
    if(!this.items.length){
      const empty=this.documentTarget.createElement('article');empty.className='vw626-empty';
      const sigil=this.documentTarget.createElement('span');sigil.textContent='✦';sigil.setAttribute('aria-hidden','true');
      const title=this.documentTarget.createElement('h4');title.textContent='Seu primeiro Memoji começa aqui.';
      const copy=this.documentTarget.createElement('p');copy.textContent='Rascunhos e revisões ficam no Admin; somente o que você publicar chega a esta sala.';
      const open=button('ABRIR ADMIN','open-admin');empty.append(sigil,title,copy,open);this.gallery.append(empty);return;
    }
    const fragment=this.documentTarget.createDocumentFragment();
    this.items.forEach(item=>{
      const card=this.documentTarget.createElement('article');card.className='vw626-card';card.dataset.v626Memoji=item.id;
      const play=button('','play-memoji',item.id);play.className='vw626-poster';play.setAttribute('aria-label',`Assistir ${item.title}`);
      if(item.posterUrl){const image=this.documentTarget.createElement('img');image.src=item.posterUrl;image.alt='';image.loading='lazy';image.decoding='async';play.append(image);}
      const glyph=this.documentTarget.createElement('span');glyph.textContent='▶';glyph.setAttribute('aria-hidden','true');play.append(glyph);
      const body=this.documentTarget.createElement('div');const meta=this.documentTarget.createElement('p');meta.textContent=item.categoryLabel||'Memoji';
      const title=this.documentTarget.createElement('h4');title.textContent=item.title;body.append(meta,title);
      if(item.description){const description=this.documentTarget.createElement('span');description.textContent=item.description;body.append(description);}
      const watch=button('ASSISTIR','play-memoji',item.id);body.append(watch);card.append(play,body);fragment.append(card);
    });
    this.gallery.append(fragment);
  }

  async onPublicClick(event){
    const channel=event.target?.closest?.('[data-v626-channel]')?.dataset?.v626Channel;
    if(channel){this.selectChannel(channel);return;}
    const control=event.target?.closest?.('[data-v626-action]');if(!control)return;
    const action=control.dataset.v626Action;
    if(action==='refresh-public'){this.loaded=false;await this.loadPublic(true);return;}
    if(action==='open-admin'){this.go?.('admin');return;}
    if(action==='close-player'){this.closePlayer('explicit-close');return;}
    if(action==='play-memoji'){
      const id=clean(control.dataset.v626Id,80);
      if(this.expiresAt&&Date.now()>this.expiresAt-60000){this.loaded=false;await this.loadPublic(true);}
      const item=this.items.find(value=>value.id===id);if(item)this.openPlayer(item,control);
    }
  }

  selectChannel(channel){
    const next=channel==='tarot'?'tarot':'memoji';if(next===this.channel)return;
    if(next==='tarot')this.closePlayer('channel-change');else this.stopLegacy();
    this.channel=next;if(this.root?.dataset)this.root.dataset.v626Channel=next;
    this.publicShell?.querySelectorAll?.('[data-v626-channel]').forEach(node=>node.setAttribute('aria-selected',String(node.dataset.v626Channel===next)));
    const panel=this.publicShell?.querySelector?.('[data-v626-panel="memoji"]');if(panel)panel.hidden=next!=='memoji';
    if(this.legacy)this.legacy.hidden=next!=='tarot';
    emit(this.documentTarget,'divina:videos-world-v626-channel',{channel:next,autoplay:false,privateContentIncluded:false});
  }

  stopLegacy(){
    const engine=this.windowTarget?.divinaMusicVideoSupremeV559||globalThis.divinaMusicVideoSupremeV559;
    safeCall(engine,'unloadPlayer',true);
    this.legacy?.querySelectorAll?.('video,audio').forEach(media=>{safeCall(media,'pause');media.removeAttribute?.('src');safeCall(media,'load');});
    this.legacy?.querySelectorAll?.('iframe').forEach(frame=>frame.remove());
  }

  openPlayer(item,trigger){
    const source=mediaUrl(item.videoUrl,this.config,this.windowTarget);if(!source||!this.playerSlot)return false;
    this.stopLegacy();this.closePlayer('replace',false);this.activeItem=item;this.activeTrigger=trigger||null;
    const shell=this.documentTarget.createElement('article');shell.className='vw626-player-shell';
    const head=this.documentTarget.createElement('header');const meta=this.documentTarget.createElement('div');
    const kicker=this.documentTarget.createElement('p');kicker.textContent=(item.categoryLabel||'Memoji').toUpperCase();
    const title=this.documentTarget.createElement('h4');title.textContent=item.title;meta.append(kicker,title);
    const close=button('FECHAR','close-player');close.setAttribute('aria-label','Fechar vídeo');head.append(meta,close);
    const video=this.documentTarget.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.autoplay=false;
    video.setAttribute('playsinline','');video.setAttribute('controlslist','nodownload');video.src=source;
    if(item.posterUrl)video.poster=item.posterUrl;
    if(item.accessibilityText)video.setAttribute('aria-label',item.accessibilityText);
    const copy=this.documentTarget.createElement('p');copy.className='vw626-player-copy';copy.textContent=item.accessibilityText||item.description||'Vídeo Memoji publicado pela Divina Bruxa.';
    shell.append(head,video,copy);this.playerSlot.replaceChildren(shell);this.playerSlot.hidden=false;this.activeVideo=video;this.playerOpens+=1;
    if(this.root?.dataset){this.root.dataset.v626Player='active';this.root.dataset.v626PlayerId=item.id;}
    safeCall(this.orbCore,'pulse','video-memoji',{source:'work13-videos-v626',privateContentIncluded:false});
    emit(this.documentTarget,'divina:media-player-state',{route:'videos',phase:'playing',source:'memoji-v626',autoplay:false,activePlayers:1});
    close.focus?.();return true;
  }

  closePlayer(reason='close',restoreFocus=true){
    if(!this.activeVideo&&!this.activeItem)return false;
    safeCall(this.activeVideo,'pause');this.activeVideo?.removeAttribute?.('src');safeCall(this.activeVideo,'load');
    this.playerSlot?.replaceChildren?.();if(this.playerSlot)this.playerSlot.hidden=true;
    const focus=this.activeTrigger;this.activeVideo=null;this.activeItem=null;this.activeTrigger=null;this.playerCloses+=1;
    if(this.root?.dataset){delete this.root.dataset.v626Player;delete this.root.dataset.v626PlayerId;}
    emit(this.documentTarget,'divina:media-player-state',{route:'videos',phase:'settled',source:'memoji-v626',reason,autoplay:false,activePlayers:0});
    if(restoreFocus)focus?.focus?.();return true;
  }

  setAdminState(copy,error=false){if(this.adminState){this.adminState.textContent=copy;this.adminState.classList.toggle('is-error',error);}}

  async loadAdmin(force=false){
    if(this.adminLoading||(!force&&this.adminLoaded))return;this.adminLoading=true;this.setAdminState('Sincronizando seus Memojis…');
    try{const data=await this.api({scope:'admin'});this.adminRequests+=1;this.adminItems=Array.isArray(data.items)?data.items:[];this.adminLoaded=true;this.renderAdminList();this.setAdminState('Cofre sincronizado. Nada fica público antes da sua escolha.');}
    catch(error){this.setAdminState(this.adminError(error),true);this.adminItems=[];this.renderAdminList();}
    finally{this.adminLoading=false;}
  }

  adminError(error){
    const code=clean(error?.message,100);return ({missing_session:'Entre novamente na conta proprietária.',expired_session:'A sessão expirou. Entre novamente.',invalid_session:'A sessão não é válida.',forbidden:'Esta área é exclusiva da proprietária.',email_not_verified:'Confirme o e-mail da conta proprietária.',mfa_required:'Conclua a verificação em duas etapas.',recovery_codes_required:'Gere e guarde os códigos de recuperação antes de editar.',rate_limit_exceeded:'Muitas ações em sequência. Aguarde um instante.',backend_unavailable:'O cofre de Memojis ainda não foi ativado.',network_error:'Não foi possível alcançar o cofre de Memojis.'})[code]||`O cofre recusou a operação (${code||'erro desconhecido'}).`;
  }

  renderAdminList(){
    if(!this.adminList)return;this.adminList.replaceChildren();
    const heading=this.documentTarget.createElement('header');const title=this.documentTarget.createElement('h4');title.textContent='Seus Memojis';
    const count=this.documentTarget.createElement('span');count.textContent=String(this.adminItems.length);heading.append(title,count);this.adminList.append(heading);
    if(!this.adminItems.length){const empty=this.documentTarget.createElement('p');empty.className='am626-empty';empty.textContent='Nenhum Memoji cadastrado.';this.adminList.append(empty);return;}
    this.adminItems.forEach((item,index)=>{
      const row=this.documentTarget.createElement('article');row.className='am626-item';row.dataset.v626AdminId=clean(item.id,80);
      const copy=this.documentTarget.createElement('div');const meta=this.documentTarget.createElement('p');meta.textContent=`${clean(item.categoryLabel||item.category,40)} · ${clean(item.status,20)}${item.is_visible===false?' · oculto':''}`;
      const name=this.documentTarget.createElement('h5');name.textContent=clean(item.title,120);const when=this.documentTarget.createElement('span');when.textContent=formatDate(item.published_at||item.publish_at||item.updated_at);
      copy.append(meta,name,when);const actions=this.documentTarget.createElement('div');actions.className='am626-item-actions';
      actions.append(button('EDITAR','edit-item',item.id),button(item.is_visible===false?'MOSTRAR':'OCULTAR','toggle-visible',item.id));
      const up=button('↑','move-up',item.id);up.setAttribute('aria-label','Mover para cima');up.disabled=index===0;
      const down=button('↓','move-down',item.id);down.setAttribute('aria-label','Mover para baixo');down.disabled=index===this.adminItems.length-1;
      actions.append(up,down);if(item.status!=='published')actions.append(button('PUBLICAR','publish-item',item.id));
      row.append(copy,actions);this.adminList.append(row);
    });
  }

  async onAdminClick(event){
    const control=event.target?.closest?.('[data-v626-action]');if(!control)return;const action=control.dataset.v626Action;const id=clean(control.dataset.v626Id,80);
    if(action==='open-memoji-form'){this.adminEditor.hidden=false;await this.loadAdmin();this.adminForm?.elements?.namedItem('title')?.focus?.();return;}
    if(action==='open-tarot-admin'){this.openTarotAdmin();return;}
    if(action==='refresh-admin'){this.adminLoaded=false;await this.loadAdmin(true);return;}
    if(action==='reset-form'){this.resetForm();return;}
    if(action==='cancel-upload'){this.uploadAbort?.abort?.();return;}
    if(action==='edit-item'){const item=this.adminItems.find(value=>value.id===id);if(item)this.fillForm(item);return;}
    if(action==='toggle-visible'){const item=this.adminItems.find(value=>value.id===id);if(item)await this.saveQuick(item,{isVisible:item.is_visible===false});return;}
    if(action==='publish-item'){const item=this.adminItems.find(value=>value.id===id);if(item)await this.saveQuick(item,{status:'published',isVisible:true});return;}
    if(action==='move-up'||action==='move-down')await this.reorder(id,action==='move-up'?-1:1);
  }

  openTarotAdmin(){
    const tab=this.documentTarget.querySelector('[data-resource-tab="tarot_episode"]');if(tab){tab.click();tab.scrollIntoView?.({block:'center'});return;}
    emit(this.documentTarget,'divina:admin-media-request',{resource:'tarot_episode',source:'v626'});
    this.documentTarget.getElementById('adminApp')?.scrollIntoView?.({block:'start'});
    this.setAdminState('No painel abaixo, abra “Episódios” para adicionar o link oficial do YouTube.');
  }

  onAdminChange(event){
    if(event.target?.name==='status')this.toggleSchedule();
    if(event.target?.name==='video'||event.target?.name==='poster'){
      const file=event.target.files?.[0];if(file)this.setAdminState(`${file.name} · ${formatBytes(file.size)} selecionado.`);
    }
  }

  toggleSchedule(){const scheduled=this.adminForm?.elements?.namedItem('status')?.value==='scheduled';const label=this.adminForm?.querySelector('[data-v626-schedule]');if(label)label.hidden=!scheduled;}

  fillForm(item){
    if(!this.adminForm)return;this.adminEditor.hidden=false;const field=name=>this.adminForm.elements.namedItem(name);
    field('id').value=clean(item.id,80);field('title').value=clean(item.title,120);field('category').value=clean(item.category,30)||'orbe';
    field('sortOrder').value=number(item.sort_order);field('description').value=clean(item.description,600);field('accessibilityText').value=clean(item.accessibility_text,240);
    field('status').value=STATES.has(item.status)?item.status:'draft';field('isVisible').checked=item.is_visible!==false;
    const date=item.publish_at||'';field('publishAt').value=date?new Date(new Date(date).getTime()-new Date(date).getTimezoneOffset()*60000).toISOString().slice(0,16):'';
    this.toggleSchedule();this.adminForm.scrollIntoView?.({block:'start'});field('title').focus?.();
  }

  resetForm(){this.adminForm?.reset?.();if(this.adminForm?.elements?.namedItem('id'))this.adminForm.elements.namedItem('id').value='';this.toggleSchedule();this.setProgress(0,false);this.setAdminState('Editor limpo. Escolha um vídeo para criar um novo Memoji.');}

  formPayload(){
    const form=this.adminForm,field=name=>form?.elements?.namedItem(name);const publishRaw=field('publishAt')?.value;
    return {id:clean(field('id')?.value,80),title:clean(field('title')?.value,120),category:clean(field('category')?.value,30),sortOrder:number(field('sortOrder')?.value),description:clean(field('description')?.value,600),accessibilityText:clean(field('accessibilityText')?.value,240),status:STATES.has(field('status')?.value)?field('status').value:'draft',publishAt:publishRaw?new Date(publishRaw).toISOString():null,isVisible:Boolean(field('isVisible')?.checked)};
  }

  validateFile(file,kind){
    if(!file)return;const allowed=kind==='video'?VIDEO_TYPES:POSTER_TYPES,max=kind==='video'?MAX_VIDEO_BYTES:MAX_POSTER_BYTES;
    if(!allowed.has(file.type))throw new Error(kind==='video'?'invalid_video_type':'invalid_poster_type');
    if(file.size<=0||file.size>max)throw new Error(kind==='video'?'video_too_large':'poster_too_large');
  }

  setProgress(percent,visible=true,copy=''){
    if(!this.progress)return;this.progress.hidden=!visible;const value=Math.max(0,Math.min(100,Math.round(percent)));
    const bar=this.progress.querySelector('[data-v626-progress-bar]');const label=this.progress.querySelector('[data-v626-progress-copy]');
    if(bar)bar.style.width=`${value}%`;if(label)label.textContent=copy||`${value}%`;
  }

  async onAdminSubmit(event){
    event.preventDefault();if(this.adminLoading)return;const payload=this.formPayload();const video=this.adminForm.elements.namedItem('video')?.files?.[0]||null;const poster=this.adminForm.elements.namedItem('poster')?.files?.[0]||null;
    try{
      if(!payload.id&&!video)throw new Error('video_required');this.validateFile(video,'video');this.validateFile(poster,'poster');
      this.adminLoading=true;this.uploadAbort=new AbortController();this.adminForm.querySelectorAll('button,input,select,textarea').forEach(node=>node.disabled=true);
      const cancel=this.adminForm.querySelector('[data-v626-action="cancel-upload"]');if(cancel){cancel.hidden=false;cancel.disabled=false;}
      let videoPath='',posterPath='';
      if(video){this.setAdminState('Preparando o envio seguro do vídeo…');const reservation=await this.prepareUpload(video,'video');await this.uploadTus(video,reservation,progress=>this.setProgress(progress*0.9,true,'ENVIANDO VÍDEO'));videoPath=reservation.path;}
      if(poster){this.setAdminState('Enviando a capa…');const reservation=await this.prepareUpload(poster,'poster');await this.uploadTus(poster,reservation,progress=>this.setProgress(90+progress*0.1,true,'ENVIANDO CAPA'));posterPath=reservation.path;}
      this.setProgress(100,true,'SALVANDO');this.setAdminState('Salvando o Memoji no cofre editorial…');
      await this.api({scope:'admin',method:'POST',body:{action:'save',item:{...payload,videoPath:videoPath||undefined,posterPath:posterPath||undefined,videoMime:video?.type,videoBytes:video?.size,posterMime:poster?.type,posterBytes:poster?.size}}});
      this.adminRequests+=1;this.adminLoaded=false;this.loaded=false;this.resetForm();await this.loadAdmin(true);if(this.isVideoRoute())await this.loadPublic(true);this.setAdminState(payload.status==='published'?'Memoji publicado.':'Memoji salvo no cofre editorial.');
    }catch(error){if(error?.name==='AbortError')this.setAdminState('Envio cancelado. Nada foi publicado.',true);else this.setAdminState(this.uploadError(error),true);}
    finally{this.adminLoading=false;this.uploadAbort=null;this.adminForm?.querySelectorAll?.('button,input,select,textarea').forEach(node=>node.disabled=false);const cancel=this.adminForm?.querySelector?.('[data-v626-action="cancel-upload"]');if(cancel)cancel.hidden=true;}
  }

  uploadError(error){const code=clean(error?.message,100);return ({video_required:'Escolha o vídeo do Memoji.',invalid_video_type:'Use um vídeo MP4, MOV, WebM ou M4V.',invalid_poster_type:'Use uma capa JPG, PNG, WebP ou AVIF.',video_too_large:'O vídeo deve ter no máximo 512 MB.',poster_too_large:'A capa deve ter no máximo 12 MB.',schedule_must_be_future:'Escolha uma data futura para agendar.',upload_create_failed:'O envio não conseguiu começar.',upload_patch_failed:'A conexão caiu durante o envio. Tente novamente.'})[code]||this.adminError(error);}

  async prepareUpload(file,kind){
    const data=await this.api({scope:'admin',method:'POST',body:{action:'prepare_upload',asset:{kind,fileName:clean(file.name,180),mime:clean(file.type,80),bytes:file.size}}});
    this.adminRequests+=1;if(!data?.upload?.path||!data?.upload?.token||!data?.upload?.endpoint)throw new Error('upload_create_failed');return data.upload;
  }

  async uploadTus(file,reservation,onProgress){
    const signal=this.uploadAbort?.signal;const metadata=[['bucketName',reservation.bucket||BUCKET],['objectName',reservation.path],['contentType',file.type],['cacheControl','3600']].map(([key,value])=>`${key} ${base64Metadata(value)}`).join(',');
    const create=await fetch(reservation.endpoint,{method:'POST',signal,headers:{'Tus-Resumable':'1.0.0','Upload-Length':String(file.size),'Upload-Metadata':metadata,'x-signature':reservation.token,'x-upsert':'false'}});
    if(!create.ok)throw new Error('upload_create_failed');const location=create.headers.get('location');if(!location)throw new Error('upload_create_failed');const uploadUrl=new URL(location,reservation.endpoint).href;
    let offset=Number(create.headers.get('upload-offset')||0);onProgress?.(file.size?offset/file.size*100:100);
    while(offset<file.size){
      const chunk=file.slice(offset,Math.min(file.size,offset+CHUNK_BYTES));let response=null;
      for(const delay of [0,1500,3500,7000]){
        if(delay)await wait(delay);if(signal?.aborted)throw new DOMException('Aborted','AbortError');
        try{response=await fetch(uploadUrl,{method:'PATCH',signal,headers:{'Tus-Resumable':'1.0.0','Upload-Offset':String(offset),'Content-Type':'application/offset+octet-stream','x-signature':reservation.token},body:chunk});if(response.ok)break;}catch(error){if(error?.name==='AbortError')throw error;}
        try{const head=await fetch(uploadUrl,{method:'HEAD',signal,headers:{'Tus-Resumable':'1.0.0','x-signature':reservation.token}});if(head.ok){offset=Number(head.headers.get('upload-offset')||offset);}}catch(error){if(error?.name==='AbortError')throw error;}
      }
      if(!response?.ok)throw new Error('upload_patch_failed');offset=Number(response.headers.get('upload-offset')||offset+chunk.size);onProgress?.(file.size?offset/file.size*100:100);
    }
    this.uploads+=1;this.uploadedBytes+=file.size;return true;
  }

  async saveQuick(item,changes){
    try{this.setAdminState('Salvando…');await this.api({scope:'admin',method:'POST',body:{action:'save',item:{id:item.id,title:item.title,category:item.category,sortOrder:item.sort_order,description:item.description,accessibilityText:item.accessibility_text,status:item.status,isVisible:item.is_visible,...changes}}});this.adminRequests+=1;this.adminLoaded=false;this.loaded=false;await this.loadAdmin(true);this.setAdminState('Alteração salva.');}
    catch(error){this.setAdminState(this.adminError(error),true);}
  }

  async reorder(id,direction){
    const index=this.adminItems.findIndex(item=>item.id===id),next=index+direction;if(index<0||next<0||next>=this.adminItems.length)return;
    const ordered=[...this.adminItems];[ordered[index],ordered[next]]=[ordered[next],ordered[index]];
    try{this.setAdminState('Reordenando…');await this.api({scope:'admin',method:'POST',body:{action:'reorder',ids:ordered.map(item=>item.id)}});this.adminRequests+=1;this.adminLoaded=false;this.loaded=false;await this.loadAdmin(true);this.setAdminState('Nova ordem salva.');}
    catch(error){this.setAdminState(this.adminError(error),true);}
  }

  activePlayers(){return Number(Boolean(this.activeVideo))+(this.legacy?.querySelectorAll?.('iframe,video,audio')?.length||0);}

  publicStatus(){return Object.freeze({version:VERSION,work:'WORK13',reality:'videos',universe:'cinema-da-orbe',route:this.route,channel:this.channel,present:this.isVideoRoute(),memojiItems:this.items.length,youtubeOfficialEpisodesAtRelease:0,inventedEpisodes:0,autoplay:false,maximumActivePlayers:1,activePlayers:this.activePlayers(),playerOpens:this.playerOpens,playerCloses:this.playerCloses,publicRequests:this.publicRequests,adminRequests:this.adminRequests,uploads:this.uploads,uploadedBytes:this.uploadedBytes,privateContentReads:0,automaticNavigation:false,automaticWhitSpeech:false,work14:false});}
  status(){return Object.freeze({...this.publicStatus(),contract:VIDEOS_WORLD_CONTRACT_V626,publicLoaded:this.loaded,adminLoaded:this.adminLoaded,privateStorage:true,signedPlayback:true});}
  audit(){const orbs=this.documentTarget?.querySelectorAll?.('#orb')?.length||0,canvases=this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length||0,players=this.activePlayers();return Object.freeze({version:VERSION,videoScreenPresent:Boolean(this.root),legacyVideoBodyReused:Boolean(this.legacy),memojiAdminPresent:Boolean(this.adminHost),channels:2,oneCanonicalOrb:orbs===1,oneCanonicalCanvas:canvases===1,duplicateOrbs:Math.max(0,orbs-1),activePlayers:players,singlePlayer:players<=1,autoplay:false,inventedEpisodes:0,privateContentReads:0,work14:false});}

  destroy(){if(this.destroyed)return false;this.destroyed=true;this.closePlayer('destroy',false);this.stopLegacy();this.uploadAbort?.abort?.();this.abort?.abort?.();this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();this.publicShell?.remove?.();if(this.legacy)this.legacy.hidden=false;this.adminHost?.replaceChildren?.();return true;}
}

export function createVideosWorldV626(options={}){
  const host=options.windowTarget||globalThis.window||globalThis;
  if(host?.[INSTANCE]?.destroyed===false)return host[INSTANCE];
  const world=new VideosWorldV626(options);try{host[INSTANCE]=world;}catch{}return world;
}

export default createVideosWorldV626;
