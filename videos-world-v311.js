import { CONFIG } from './data/config.js';
import { YOUTUBE_CHANNEL } from './data/media.js';

const clean = (value, max = 500) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, max);

const escapeHTML = value => clean(value, 3000).replace(/[&<>'"]/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
}[char]));

function mediaUrl(value) {
  try {
    const url = new URL(value);
    const allowed = new Set([
      'kyphdsamyygavmkzyezr.supabase.co',
      'kyphdsamyygavmkzyezr.storage.supabase.co'
    ]);
    return url.protocol === 'https:' && allowed.has(url.hostname) ? url.href : '';
  } catch { return ''; }
}

async function fetchJson(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal:controller.signal });
    if (!response.ok) throw new Error(`http_${response.status}`);
    return await response.json().catch(() => ({}));
  } finally {
    clearTimeout(timer);
  }
}

export function createVideosWorld({ announce }) {
  const root = document.querySelector('#videosApp');
  let items = [];
  let channel = 'memoji';
  let loading = false;
  let loaded = false;
  let activeVideo = null;

  async function loadPublishedMemojis(force = false) {
    if (loading || (loaded && !force)) return;
    loading = true;
    render();
    try {
      const url = new URL(CONFIG.memojiEndpoint);
      url.searchParams.set('scope', 'public');
      const data = await fetchJson(url, {
        method:'GET',
        credentials:'omit',
        cache:'no-store',
        headers:{
          Accept:'application/json',
          apikey:CONFIG.supabasePublishableKey,
          'x-divina-admin-request':'v626'
        }
      });
      items = (Array.isArray(data.items) ? data.items : []).map(item => ({
        id:clean(item.id, 80),
        title:clean(item.title, 120),
        description:clean(item.description, 600),
        categoryLabel:clean(item.categoryLabel, 40),
        accessibilityText:clean(item.accessibilityText, 240),
        videoUrl:mediaUrl(item.videoUrl),
        posterUrl:mediaUrl(item.posterUrl)
      })).filter(item => item.id && item.title && item.videoUrl);
    } catch {
      items = [];
    }
    loading = false;
    loaded = true;
    render();
  }

  function memojiMarkup() {
    const state = loading
      ? 'Abrindo o Cinema da Orbe…'
      : items.length
        ? `${items.length} ${items.length === 1 ? 'Memoji disponível' : 'Memojis disponíveis'}.`
        : loaded
          ? 'Novas presenças entrarão nesta sala quando estiverem prontas.'
          : 'A sala está abrindo…';

    const gallery = items.length ? items.map(item => `<article class="memoji-card">
      <button type="button" data-play-memoji="${escapeHTML(item.id)}" aria-label="Assistir ${escapeHTML(item.title)}">
        ${item.posterUrl ? `<img src="${escapeHTML(item.posterUrl)}" alt="" loading="lazy" decoding="async">` : '<span class="memoji-card__void" aria-hidden="true">✦</span>'}
        <i aria-hidden="true">▶</i>
      </button>
      <div>
        <small>${escapeHTML(item.categoryLabel || 'Memoji')}</small>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.description)}</p>
        <button type="button" data-play-memoji="${escapeHTML(item.id)}">ASSISTIR</button>
      </div>
    </article>`).join('') : `<article class="videos-empty">
      <span aria-hidden="true">✦</span>
      <h2>O Cinema está respirando.</h2>
      <p>Enquanto a próxima presença ganha forma, os vídeos oficiais continuam no canal da Divina Bruxa.</p>
      <a href="${YOUTUBE_CHANNEL}" target="_blank" rel="noopener noreferrer">VISITAR O CANAL OFICIAL ↗</a>
    </article>`;

    return `<div class="memoji-room">
      <header>
        <div><p class="eyebrow">PALCO NATIVO</p><h2>Seu rosto. Sua voz. Sua atmosfera.</h2></div>
        <button type="button" data-refresh-videos>Atualizar</button>
      </header>
      <p class="videos-state" role="status">${state}</p>
      <div id="memojiPlayer" class="memoji-player"${activeVideo ? '' : ' hidden'}></div>
      <div class="memoji-gallery">${gallery}</div>
    </div>`;
  }

  function tarotCinemaMarkup() {
    return `<div class="tarot-cinema">
      <span aria-hidden="true">▶</span>
      <p class="eyebrow">DE FRENTE COM O TAROT</p>
      <h2>Conversas que atravessam as cartas.</h2>
      <p>Assista aos episódios e conteúdos oficiais diretamente no canal da Divina Bruxa. Nada começa sem o seu toque.</p>
      <a href="${YOUTUBE_CHANNEL}" target="_blank" rel="noopener noreferrer">ABRIR O CANAL OFICIAL ↗</a>
    </div>`;
  }

  function render() {
    root.innerHTML = `<section class="videos-public">
      <nav class="video-portals" role="tablist" aria-label="Salas do Cinema">
        <button type="button" role="tab" data-video-channel="memoji" aria-selected="${channel === 'memoji'}"><span>✦</span><b>MEMOJIS</b><small>A voz da Orbe</small></button>
        <button type="button" role="tab" data-video-channel="tarot" aria-selected="${channel === 'tarot'}"><span>▶</span><b>DE FRENTE COM O TAROT</b><small>Canal oficial</small></button>
      </nav>
      ${channel === 'memoji' ? memojiMarkup() : tarotCinemaMarkup()}
    </section>`;

    root.querySelectorAll('[data-video-channel]').forEach(button => button.addEventListener('click', () => {
      closePlayer(false);
      channel = button.dataset.videoChannel;
      render();
    }));
    root.querySelectorAll('[data-play-memoji]').forEach(button => button.addEventListener('click', () => {
      const item = items.find(value => value.id === button.dataset.playMemoji);
      if (item) openPlayer(item);
    }));
    root.querySelector('[data-refresh-videos]')?.addEventListener('click', () => loadPublishedMemojis(true));
    if (activeVideo) mountPlayer(activeVideo);
  }

  function openPlayer(item) {
    closePlayer(false);
    activeVideo = item;
    render();
    announce(`${item.title}. Player pronto, sem reprodução automática.`);
  }

  function mountPlayer(item) {
    const slot = root.querySelector('#memojiPlayer');
    if (!slot) return;
    slot.hidden = false;
    slot.innerHTML = `<article>
      <header><div><small>${escapeHTML(item.categoryLabel || 'Memoji')}</small><h2>${escapeHTML(item.title)}</h2></div><button type="button" data-close-player>FECHAR</button></header>
      <video controls playsinline preload="metadata" controlslist="nodownload" src="${escapeHTML(item.videoUrl)}"${item.posterUrl ? ` poster="${escapeHTML(item.posterUrl)}"` : ''}${item.accessibilityText ? ` aria-label="${escapeHTML(item.accessibilityText)}"` : ''}></video>
      <p>${escapeHTML(item.accessibilityText || item.description || 'Memoji oficial da Divina Bruxa.')}</p>
    </article>`;
    slot.querySelector('[data-close-player]').addEventListener('click', () => closePlayer());
  }

  function closePlayer(renderAfter = true) {
    const video = root.querySelector('#memojiPlayer video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    activeVideo = null;
    if (renderAfter) render();
  }

  function activate() {
    render();
    void loadPublishedMemojis();
  }

  return { activate };
}
