import { CONFIG } from '../data/config.js';
import { YOUTUBE_CHANNEL } from '../data/media.js';

const VIDEO_TYPES = new Set(['video/mp4','video/quicktime','video/webm','video/x-m4v']);
const POSTER_TYPES = new Set(['image/jpeg','image/png','image/webp','image/avif']);
const MAX_VIDEO = 512 * 1024 * 1024;
const MAX_POSTER = 12 * 1024 * 1024;
const CHUNK = 6 * 1024 * 1024;
const CATEGORIES = Object.freeze([['orbe','Orbe'],['site','Site'],['tarot','Tarot'],['musica','Música'],['cantando','Cantando'],['bastidores','Bastidores'],['outros','Outros']]);
const clean = (value, max = 500) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const escapeHTML = value => clean(value, 3000).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const formatBytes = bytes => `${(Number(bytes || 0) / 1024 / 1024).toLocaleString('pt-BR', {maximumFractionDigits:1})} MB`;

function mediaUrl(value) {
  try {
    const url = new URL(value);
    const allowed = new Set(['kyphdsamyygavmkzyezr.supabase.co','kyphdsamyygavmkzyezr.storage.supabase.co']);
    return url.protocol === 'https:' && allowed.has(url.hostname) ? url.href : '';
  } catch { return ''; }
}

async function fetchJson(url, options = {}, timeout = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {...options, signal:controller.signal});
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(clean(body?.error || `http_${response.status}`, 100));
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  } finally { clearTimeout(timer); }
}

function adminAuthorized(body) {
  return Boolean(body?.ownerVerified && body?.emailVerified && body?.mfaVerified && body?.recoveryCodesReady && body?.environment === 'staging');
}

export function createVideosWorld({ announce }) {
  const root = document.querySelector('#videosApp');
  let items = [];
  let channel = 'memoji';
  let loading = false;
  let loaded = false;
  let activeVideo = null;
  let adminOpen = false;
  let adminMode = 'checking';
  let adminStatus = '';
  let adminError = false;
  let mfaFactorId = '';
  let recoveryCodes = [];
  let adminItems = [];
  let adminLoaded = false;
  let editorOpen = false;
  let editing = null;
  let uploadAbort = null;
  let uploadProgress = 0;

  async function memojiApi(scope = 'public', method = 'GET', body) {
    const url = new URL(CONFIG.memojiEndpoint);
    url.searchParams.set('scope', scope);
    return fetchJson(url, {
      method, credentials:scope === 'admin' ? 'include' : 'omit', cache:'no-store',
      headers:{ Accept:'application/json', apikey:CONFIG.supabasePublishableKey, 'x-divina-admin-request':'v626', ...(body ? {'Content-Type':'application/json'} : {}) },
      ...(body ? { body:JSON.stringify(body) } : {})
    }, method === 'GET' ? 15000 : 30000);
  }

  async function adminApi(path, method = 'GET', body) {
    return fetchJson(`${CONFIG.adminEndpoint}${path}`, {
      method, credentials:'include', cache:'no-store',
      headers:{ Accept:'application/json', 'Content-Type':'application/json', 'x-divina-admin-request':'v548' },
      ...(body === undefined ? {} : { body:JSON.stringify(body) })
    });
  }

  function publicMarkup() {
    const state = loading ? 'Consultando os Memojis publicados…' : items.length ? `${items.length} ${items.length === 1 ? 'Memoji publicado' : 'Memojis publicados'}.` : loaded ? 'Nenhum Memoji foi publicado ainda.' : 'A sala está abrindo…';
    const gallery = items.length ? items.map(item => `<article class="memoji-card">
      <button type="button" data-play-memoji="${escapeHTML(item.id)}" aria-label="Assistir ${escapeHTML(item.title)}">
        ${item.posterUrl ? `<img src="${escapeHTML(item.posterUrl)}" alt="" loading="lazy" decoding="async">` : '<span class="memoji-card__void" aria-hidden="true">✦</span>'}<i aria-hidden="true">▶</i>
      </button><div><small>${escapeHTML(item.categoryLabel || 'Memoji')}</small><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.description)}</p><button type="button" data-play-memoji="${escapeHTML(item.id)}">ASSISTIR</button></div>
    </article>`).join('') : `<article class="videos-empty"><span aria-hidden="true">✦</span><h2>O primeiro Memoji começa no seu Cinema.</h2><p>Rascunhos ficam privados; só um vídeo marcado como publicado atravessa para esta sala.</p><button type="button" data-open-publisher>PUBLICAR MEU PRIMEIRO MEMOJI</button></article>`;
    return `<section class="videos-public">
      <nav class="video-portals" role="tablist" aria-label="Salas do Cinema">
        <button type="button" role="tab" data-video-channel="memoji" aria-selected="${channel === 'memoji'}"><span>✦</span><b>MEMOJIS</b><small>A voz da Orbe</small></button>
        <button type="button" role="tab" data-video-channel="tarot" aria-selected="${channel === 'tarot'}"><span>▶</span><b>DE FRENTE COM O TAROT</b><small>Canal oficial</small></button>
      </nav>
      ${channel === 'memoji' ? `<div class="memoji-room"><header><div><p class="eyebrow">PALCO NATIVO</p><h2>Seu rosto. Sua voz. Sua atmosfera.</h2></div><button type="button" data-refresh-videos>Atualizar</button></header><p class="videos-state" role="status">${state}</p><div id="memojiPlayer" class="memoji-player"${activeVideo ? '' : ' hidden'}></div><div class="memoji-gallery">${gallery}</div></div>` : `<div class="tarot-cinema"><span aria-hidden="true">▶</span><p class="eyebrow">DE FRENTE COM O TAROT</p><h2>Nenhum episódio oficial publicado no site.</h2><p>O Cinema não inventa episódios. Quando um vídeo oficial existir, ele entra por link verificado e só toca depois do seu toque.</p><a href="${YOUTUBE_CHANNEL}" target="_blank" rel="noopener noreferrer">ABRIR O CANAL OFICIAL ↗</a></div>`}
    </section>`;
  }

  function adminGateMarkup() {
    const copy = {
      checking:['Verificando a porta da proprietária','A publicação só abre depois de confirmar conta, e-mail, MFA e códigos de recuperação.'],
      signin:['Entrar na sala de publicação','Use apenas a conta proprietária. A senha vai diretamente ao cofre de autenticação e nunca é salva aqui.'],
      mfa:['Confirmar o segundo fator','Digite os seis números do seu aplicativo autenticador.'],
      enroll:['Ativar o segundo fator','Escaneie o QR Code no aplicativo autenticador e confirme o primeiro código.'],
      recovery:['Guardar os códigos de recuperação','Eles aparecem uma única vez. Copie para um local seguro antes de continuar.']
    }[adminMode] || ['Sala protegida',''];
    let form = '<div class="publisher-loading" aria-label="Carregando"></div>';
    if (adminMode === 'signin') form = `<form data-owner-signin><label><span>E-mail da proprietária</span><input name="email" type="email" autocomplete="username" required></label><label><span>Senha</span><input name="password" type="password" autocomplete="current-password" minlength="12" required></label><button type="submit">CONTINUAR COM SEGURANÇA</button></form>`;
    if (adminMode === 'mfa') form = `<form data-owner-mfa><label><span>Código MFA</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="000000"></label><button type="submit">VERIFICAR E ABRIR</button></form>`;
    if (adminMode === 'enroll') form = `<form data-owner-mfa><img id="mfaQr" alt="QR Code para ativar MFA"><label><span>Chave manual</span><output id="mfaSecret"></output></label><label><span>Código de confirmação</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label><button type="submit">ATIVAR MFA</button></form>`;
    if (adminMode === 'recovery') form = recoveryCodes.length ? `<div class="recovery-codes"><p>Copie agora; esta lista não será exibida novamente.</p><ol>${recoveryCodes.map(code => `<li><code>${escapeHTML(code)}</code></li>`).join('')}</ol><button type="button" data-confirm-recovery>JÁ GUARDEI EM LOCAL SEGURO</button></div>` : '<button type="button" data-create-recovery>GERAR 10 CÓDIGOS</button>';
    return `<section class="publisher-gate"><span aria-hidden="true">♕</span><p class="eyebrow">PROPRIETÁRIA · MFA · STAGING</p><h2>${copy[0]}</h2><p>${copy[1]}</p>${adminStatus ? `<p class="publisher-status${adminError ? ' is-error' : ''}" role="status">${escapeHTML(adminStatus)}</p>` : ''}${form}</section>`;
  }

  function editorMarkup() {
    const value = name => escapeHTML(editing?.[name] ?? '');
    const selected = (name, value) => editing?.[name] === value ? ' selected' : '';
    const list = adminItems.length ? adminItems.map(item => `<article class="publisher-item"><div><small>${escapeHTML(item.categoryLabel || item.category)} · ${escapeHTML(item.status)}${item.is_visible === false ? ' · oculto' : ''}</small><h3>${escapeHTML(item.title)}</h3></div><button type="button" data-edit-memoji="${escapeHTML(item.id)}">EDITAR</button><button type="button" data-toggle-memoji="${escapeHTML(item.id)}">${item.is_visible === false ? 'MOSTRAR' : 'OCULTAR'}</button>${item.status !== 'published' ? `<button type="button" data-publish-memoji="${escapeHTML(item.id)}">PUBLICAR</button>` : ''}</article>`).join('') : '<p class="publisher-list-empty">Nenhum Memoji no cofre.</p>';
    return `<section class="publisher-studio">
      <header><div><p class="eyebrow">COFRE EDITORIAL</p><h2>Publique seus Memojis</h2><p>Vídeo do iPhone, capa opcional, categoria e estado editorial.</p></div><button type="button" data-owner-signout>SAIR E BLOQUEAR</button></header>
      ${adminStatus ? `<p class="publisher-status${adminError ? ' is-error' : ''}" role="status">${escapeHTML(adminStatus)}</p>` : ''}
      <div class="publisher-actions"><button type="button" data-toggle-editor>${editorOpen ? 'FECHAR EDITOR' : 'NOVO MEMOJI'}</button><button type="button" data-refresh-publisher>ATUALIZAR COFRE</button></div>
      ${editorOpen ? `<form data-memoji-form>
        <input type="hidden" name="id" value="${value('id')}">
        <label><span>Título</span><input name="title" maxlength="120" required value="${value('title')}"></label>
        <div class="publisher-row"><label><span>Categoria</span><select name="category">${CATEGORIES.map(([id,label]) => `<option value="${id}"${selected('category',id)}>${label}</option>`).join('')}</select></label><label><span>Ordem</span><input name="sortOrder" type="number" min="0" max="9999" value="${Number(editing?.sort_order || 0)}"></label></div>
        <label><span>Descrição</span><textarea name="description" maxlength="600" rows="3">${value('description')}</textarea></label>
        <label><span>Descrição acessível</span><input name="accessibilityText" maxlength="240" value="${value('accessibility_text')}"></label>
        <label><span>Vídeo <small>MP4, MOV, WebM ou M4V · até 512 MB</small></span><input name="video" type="file" accept="video/mp4,video/quicktime,video/webm,video/x-m4v"${editing?.id ? '' : ' required'}></label>
        <label><span>Capa opcional <small>JPG, PNG, WebP ou AVIF · até 12 MB</small></span><input name="poster" type="file" accept="image/jpeg,image/png,image/webp,image/avif"></label>
        <div class="publisher-row"><label><span>Estado</span><select name="status">${[['draft','Rascunho'],['review','Em revisão'],['published','Publicado'],['archived','Arquivado']].map(([id,label]) => `<option value="${id}"${selected('status',id)}>${label}</option>`).join('')}</select></label><label class="publisher-check"><input name="isVisible" type="checkbox"${editing?.is_visible === false ? '' : ' checked'}><span>Visível quando publicado</span></label></div>
        ${uploadProgress ? `<div class="publisher-progress"><span><i style="width:${uploadProgress}%"></i></span><b>${uploadProgress}%</b></div>` : ''}
        <div class="publisher-form-actions"><button type="submit">${uploadProgress ? 'ENVIANDO…' : 'SALVAR MEMOJI'}</button><button type="button" data-reset-editor>LIMPAR</button>${uploadProgress ? '<button type="button" data-cancel-upload>CANCELAR ENVIO</button>' : ''}</div>
      </form>` : ''}
      <div class="publisher-list"><header><h3>Seus Memojis</h3><b>${adminItems.length}</b></header>${list}</div>
    </section>`;
  }

  function render() {
    const publicPart = publicMarkup();
    const adminPart = adminOpen ? `<section class="publisher-shell"><header class="publisher-shell__head"><div><p class="eyebrow">PUBLICAÇÃO SEGURA</p><h2>Sala da proprietária</h2></div><button type="button" data-close-publisher>FECHAR</button></header>${adminMode === 'ready' ? editorMarkup() : adminGateMarkup()}</section>` : `<button class="open-publisher" type="button" data-open-publisher><span aria-hidden="true">＋</span><b>PUBLICAR MEMOJI</b><small>Área protegida da proprietária</small></button>`;
    root.innerHTML = publicPart + adminPart;
    bind();
    if (activeVideo) mountPlayer(activeVideo, false);
  }

  function bind() {
    root.querySelectorAll('[data-video-channel]').forEach(button => button.addEventListener('click', () => { closePlayer(); channel = button.dataset.videoChannel; render(); }));
    root.querySelectorAll('[data-play-memoji]').forEach(button => button.addEventListener('click', () => {
      const item = items.find(value => value.id === button.dataset.playMemoji); if (item) openPlayer(item);
    }));
    root.querySelector('[data-close-player]')?.addEventListener('click', closePlayer);
    root.querySelector('[data-refresh-videos]')?.addEventListener('click', () => loadPublic(true));
    root.querySelectorAll('[data-open-publisher]').forEach(button => button.addEventListener('click', openPublisher));
    root.querySelector('[data-close-publisher]')?.addEventListener('click', () => { adminOpen = false; render(); });
    root.querySelector('[data-owner-signin]')?.addEventListener('submit', signIn);
    root.querySelector('[data-owner-mfa]')?.addEventListener('submit', verifyMfa);
    root.querySelector('[data-create-recovery]')?.addEventListener('click', createRecoveryCodes);
    root.querySelector('[data-confirm-recovery]')?.addEventListener('click', checkAdminSession);
    root.querySelector('[data-owner-signout]')?.addEventListener('click', signOut);
    root.querySelector('[data-toggle-editor]')?.addEventListener('click', () => { editorOpen = !editorOpen; editing = null; uploadProgress = 0; render(); });
    root.querySelector('[data-reset-editor]')?.addEventListener('click', () => { editing = null; uploadProgress = 0; render(); });
    root.querySelector('[data-refresh-publisher]')?.addEventListener('click', () => loadAdmin(true));
    root.querySelector('[data-memoji-form]')?.addEventListener('submit', saveMemoji);
    root.querySelector('[data-cancel-upload]')?.addEventListener('click', () => uploadAbort?.abort());
    root.querySelectorAll('[data-edit-memoji]').forEach(button => button.addEventListener('click', () => { editing = adminItems.find(item => item.id === button.dataset.editMemoji) || null; editorOpen = true; render(); }));
    root.querySelectorAll('[data-toggle-memoji]').forEach(button => button.addEventListener('click', () => quickSave(button.dataset.toggleMemoji, 'toggle')));
    root.querySelectorAll('[data-publish-memoji]').forEach(button => button.addEventListener('click', () => quickSave(button.dataset.publishMemoji, 'publish')));
  }

  async function loadPublic(force = false) {
    if (loading || (loaded && !force)) return;
    loading = true; render();
    try {
      const data = await memojiApi();
      items = (Array.isArray(data.items) ? data.items : []).map(item => ({
        id:clean(item.id,80), title:clean(item.title,120), description:clean(item.description,600), categoryLabel:clean(item.categoryLabel,40), accessibilityText:clean(item.accessibilityText,240), videoUrl:mediaUrl(item.videoUrl), posterUrl:mediaUrl(item.posterUrl)
      })).filter(item => item.id && item.title && item.videoUrl);
    } catch { items = []; }
    loading = false; loaded = true; render();
  }

  function openPlayer(item) {
    closePlayer(false); activeVideo = item; render(); announce(`${item.title}. Player pronto, sem reprodução automática.`);
  }

  function mountPlayer(item, replace = true) {
    const slot = root.querySelector('#memojiPlayer');
    if (!slot) return;
    slot.hidden = false;
    if (!replace && slot.childElementCount) return;
    slot.innerHTML = `<article><header><div><small>${escapeHTML(item.categoryLabel || 'Memoji')}</small><h2>${escapeHTML(item.title)}</h2></div><button type="button" data-close-player>FECHAR</button></header><video controls playsinline preload="metadata" controlslist="nodownload" src="${escapeHTML(item.videoUrl)}"${item.posterUrl ? ` poster="${escapeHTML(item.posterUrl)}"` : ''}${item.accessibilityText ? ` aria-label="${escapeHTML(item.accessibilityText)}"` : ''}></video><p>${escapeHTML(item.accessibilityText || item.description || 'Memoji publicado pela Divina Bruxa.')}</p></article>`;
    slot.querySelector('[data-close-player]').addEventListener('click', closePlayer);
  }

  function closePlayer(renderAfter = true) {
    const video = root.querySelector('#memojiPlayer video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    activeVideo = null;
    if (renderAfter) render();
  }

  async function openPublisher() {
    adminOpen = true; adminMode = 'checking'; adminStatus = ''; adminError = false; render(); await checkAdminSession();
  }

  async function checkAdminSession() {
    adminMode = 'checking'; adminStatus = 'Confirmando a sessão segura…'; adminError = false; render();
    try {
      const body = await adminApi('/admin/session');
      if (adminAuthorized(body)) { adminMode = 'ready'; adminStatus = 'Cofre protegido e conectado.'; render(); await loadAdmin(); return; }
      if (body?.recoveryCodesRequired) adminMode = 'recovery';
      else if (body?.mfaEnrollmentRequired) { adminMode = 'enroll'; render(); await beginMfaEnrollment(); return; }
      else if (body?.mfaRequired) adminMode = 'mfa';
      else adminMode = 'signin';
    } catch (error) {
      if (error.body?.recoveryCodesRequired) adminMode = 'recovery';
      else if (error.body?.mfaEnrollmentRequired) { adminMode = 'enroll'; render(); await beginMfaEnrollment(); return; }
      else if (error.body?.mfaRequired || error.message === 'mfa_required') adminMode = 'mfa';
      else adminMode = 'signin';
      adminStatus = '';
    }
    render();
  }

  async function signIn(event) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const email = clean(data.get('email')); const password = String(data.get('password') || '');
    if (!email.includes('@') || password.length < 12) { adminStatus = 'Informe o e-mail da proprietária e a senha completa.'; adminError = true; return render(); }
    adminStatus = 'Confirmando a proprietária…'; adminError = false; render();
    try {
      const body = await adminApi('/admin/session','POST',{email,password});
      if (adminAuthorized(body)) { adminMode = 'ready'; await loadAdmin(); }
      else if (body.mfaEnrollmentRequired) { adminMode = 'enroll'; render(); await beginMfaEnrollment(); return; }
      else adminMode = 'mfa';
      adminStatus = '';
    } catch (error) { adminMode = 'signin'; adminStatus = error.status === 403 ? 'Esta conta não é a proprietária.' : 'Não foi possível confirmar a proprietária.'; adminError = true; }
    render();
  }

  async function beginMfaEnrollment() {
    adminStatus = 'Criando o fator de segurança…'; render();
    try {
      const body = await adminApi('/admin/session/mfa/enroll','POST',{});
      mfaFactorId = clean(body.factorId,120); adminStatus = 'Escaneie e confirme o primeiro código.'; render();
      if (body.qrCode) root.querySelector('#mfaQr').src = body.qrCode;
      root.querySelector('#mfaSecret').textContent = clean(body.secret,300);
    } catch { adminStatus = 'Não foi possível iniciar o MFA.'; adminError = true; render(); }
  }

  async function verifyMfa(event) {
    event.preventDefault(); const code = clean(new FormData(event.currentTarget).get('code')).replace(/\D/g,'');
    if (code.length !== 6) { adminStatus = 'Digite os seis números.'; adminError = true; return render(); }
    adminStatus = 'Verificando o segundo fator…'; adminError = false; render();
    try {
      const body = await adminApi('/admin/session/mfa','POST',{code,factorId:mfaFactorId});
      if (adminAuthorized(body)) { adminMode = 'ready'; adminStatus = 'Sala de publicação aberta.'; render(); await loadAdmin(); return; }
      if (body.recoveryCodesRequired) { adminMode = 'recovery'; adminStatus = ''; render(); return; }
      throw new Error('invalid');
    } catch { adminMode = 'mfa'; adminStatus = 'Código inválido ou expirado.'; adminError = true; render(); }
  }

  async function createRecoveryCodes() {
    adminStatus = 'Gerando os códigos no servidor…'; adminError = false; render();
    try { const body = await adminApi('/admin/session/recovery-codes','POST',{}); recoveryCodes = Array.isArray(body.codes) ? body.codes : []; adminStatus = 'Copie os códigos antes de continuar.'; }
    catch { adminStatus = 'Não foi possível gerar os códigos.'; adminError = true; }
    render();
  }

  async function signOut() {
    try { await adminApi('/admin/session','DELETE',{}); } catch {}
    adminMode = 'signin'; adminItems = []; adminLoaded = false; editorOpen = false; editing = null; adminStatus = 'Sala bloqueada.'; render(); announce('Sala de publicação bloqueada.');
  }

  function adminErrorMessage(error) {
    return ({missing_session:'Entre novamente na conta proprietária.',expired_session:'A sessão expirou.',invalid_session:'A sessão não é válida.',forbidden:'Esta área é exclusiva da proprietária.',email_not_verified:'Confirme o e-mail da conta proprietária.',mfa_required:'Confirme o segundo fator.',recovery_codes_required:'Guarde os códigos de recuperação.',rate_limit_exceeded:'Muitas ações em sequência. Aguarde um instante.',video_required:'Escolha o vídeo do Memoji.',invalid_video_type:'Use MP4, MOV, WebM ou M4V.',invalid_poster_type:'Use JPG, PNG, WebP ou AVIF.',video_too_large:'O vídeo deve ter no máximo 512 MB.',poster_too_large:'A capa deve ter no máximo 12 MB.'})[clean(error?.message,100)] || 'O cofre recusou esta operação.';
  }

  async function loadAdmin(force = false) {
    if (adminLoaded && !force) return;
    adminStatus = 'Sincronizando o cofre editorial…'; adminError = false; render();
    try { const body = await memojiApi('admin'); adminItems = Array.isArray(body.items) ? body.items : []; adminLoaded = true; adminStatus = 'Cofre sincronizado.'; }
    catch (error) { adminStatus = adminErrorMessage(error); adminError = true; if (error.status === 401 || error.status === 403) adminMode = error.status === 401 ? 'mfa' : 'signin'; }
    render();
  }

  function validateFile(file, kind) {
    if (!file) return;
    const types = kind === 'video' ? VIDEO_TYPES : POSTER_TYPES;
    const max = kind === 'video' ? MAX_VIDEO : MAX_POSTER;
    if (!types.has(file.type)) throw new Error(kind === 'video' ? 'invalid_video_type' : 'invalid_poster_type');
    if (!file.size || file.size > max) throw new Error(kind === 'video' ? 'video_too_large' : 'poster_too_large');
  }

  async function prepareUpload(file, kind) {
    const body = await memojiApi('admin','POST',{action:'prepare_upload',asset:{kind,fileName:clean(file.name,180),mime:file.type,bytes:file.size}});
    if (!body?.upload?.path || !body?.upload?.token || !body?.upload?.endpoint) throw new Error('upload_create_failed');
    return body.upload;
  }

  function metadata(value) {
    const bytes = new TextEncoder().encode(String(value)); return btoa(String.fromCharCode(...bytes));
  }

  async function uploadTus(file, reservation, start, span) {
    const signal = uploadAbort.signal;
    const uploadMetadata = [['bucketName',reservation.bucket],['objectName',reservation.path],['contentType',file.type],['cacheControl','3600']].map(([key,value]) => `${key} ${metadata(value)}`).join(',');
    const created = await fetch(reservation.endpoint,{method:'POST',signal,headers:{'Tus-Resumable':'1.0.0','Upload-Length':String(file.size),'Upload-Metadata':uploadMetadata,'x-signature':reservation.token,'x-upsert':'false'}});
    if (!created.ok || !created.headers.get('location')) throw new Error('upload_create_failed');
    const uploadUrl = new URL(created.headers.get('location'), reservation.endpoint).href;
    let offset = Number(created.headers.get('upload-offset') || 0);
    while (offset < file.size) {
      const piece = file.slice(offset, Math.min(file.size, offset + CHUNK));
      const response = await fetch(uploadUrl,{method:'PATCH',signal,headers:{'Tus-Resumable':'1.0.0','Upload-Offset':String(offset),'Content-Type':'application/offset+octet-stream','x-signature':reservation.token},body:piece});
      if (!response.ok) throw new Error('upload_patch_failed');
      offset = Number(response.headers.get('upload-offset') || offset + piece.size);
      uploadProgress = Math.round(start + (offset / file.size) * span); render();
    }
    return reservation.path;
  }

  async function saveMemoji(event) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const video = form.elements.video.files?.[0] || null; const poster = form.elements.poster.files?.[0] || null;
    try {
      if (!editing?.id && !video) throw new Error('video_required'); validateFile(video,'video'); validateFile(poster,'poster');
      uploadAbort = new AbortController(); uploadProgress = 1; adminStatus = video ? `Preparando ${formatBytes(video.size)}…` : 'Salvando alteração…'; adminError = false; render();
      let videoPath = ''; let posterPath = '';
      if (video) { const reservation = await prepareUpload(video,'video'); videoPath = await uploadTus(video,reservation,1,poster ? 84 : 94); }
      if (poster) { const reservation = await prepareUpload(poster,'poster'); posterPath = await uploadTus(poster,reservation,85,10); }
      const item = {id:clean(data.get('id'),80),title:clean(data.get('title'),120),category:clean(data.get('category'),30),sortOrder:Number(data.get('sortOrder') || 0),description:clean(data.get('description'),600),accessibilityText:clean(data.get('accessibilityText'),240),status:clean(data.get('status'),20),isVisible:data.get('isVisible') === 'on',...(videoPath ? {videoPath} : {}),...(posterPath ? {posterPath} : {})};
      await memojiApi('admin','POST',{action:'save',item});
      uploadProgress = 0; editing = null; editorOpen = false; adminLoaded = false; loaded = false; adminStatus = item.status === 'published' ? 'Memoji publicado.' : 'Memoji guardado no cofre.'; announce(adminStatus); await loadAdmin(true); await loadPublic(true);
    } catch (error) { uploadProgress = 0; adminStatus = error?.name === 'AbortError' ? 'Envio cancelado; nada foi publicado.' : adminErrorMessage(error); adminError = true; render(); }
    finally { uploadAbort = null; }
  }

  async function quickSave(id, action) {
    const item = adminItems.find(value => value.id === id); if (!item) return;
    adminStatus = 'Salvando…'; adminError = false; render();
    try {
      await memojiApi('admin','POST',{action:'save',item:{id:item.id,title:item.title,category:item.category,sortOrder:item.sort_order,description:item.description,accessibilityText:item.accessibility_text,status:action === 'publish' ? 'published' : item.status,isVisible:action === 'publish' ? true : item.is_visible === false}});
      adminLoaded = false; loaded = false; await loadAdmin(true); await loadPublic(true); announce('Alteração salva.');
    } catch (error) { adminStatus = adminErrorMessage(error); adminError = true; render(); }
  }

  function activate() { render(); loadPublic(); }
  function deactivate() { closePlayer(false); }
  return { activate, deactivate };
}
