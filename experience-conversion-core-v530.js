/* DIVINA BRUXA — MACROETAPA 6/10 · EXPERIÊNCIAS, CONTEÚDO E CONVERSÃO V530
   Consultas, Loja Mística, Música e De Frente com o Tarot formam quatro mundos
   conectados pela mesma Orbe V501. Não cria outro canvas, outra Orbe ou outro
   universo. Catálogo musical público vem somente de lançamentos publicados. */

import { COMMERCIAL_TRUTH_V200 } from './commercial-truth-v200.js?v=200';
import { MEDIA_POLICY_V149 } from './media-policy-v149.js?v=149';

const RELEASE = 'V530';
const STYLE_ID = 'divinaExperienceConversionV530Styles';
const MARK = Symbol.for('divina.experience.conversion.core.v530');
const ROUTES = Object.freeze(['consultations', 'store', 'music', 'videos']);
const MUSIC_SELECT = 'id,slug,title,artist,release_type,cover_url,description,release_date,spotify_url,locale,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';
const ADMIN_TIMEOUT = 15000;

const PROFILE = Object.freeze({
  consultations:Object.freeze({
    route:'consultations', sigil:'☾', eyebrow:'ATENDIMENTO HUMANO', title:'Consultas',
    status:'Quatro leituras privadas', anchor:'#consultationApp'
  }),
  store:Object.freeze({
    route:'store', sigil:'◇', eyebrow:'CURADORIA TRANSPARENTE', title:'Loja Mística',
    status:'21 escolhas na Amazon', anchor:'#storeApp'
  }),
  music:Object.freeze({
    route:'music', sigil:'♫', eyebrow:'HÉRCULES DX', title:'Música',
    status:'Álbuns oficiais', anchor:'#musicApp'
  }),
  videos:Object.freeze({
    route:'videos', sigil:'▶', eyebrow:'CANAL OFICIAL', title:'De Frente',
    status:'Vídeos publicados', anchor:'#videoApp'
  })
});

const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const clean = (value, limit = 300) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
const money = cents => new Intl.NumberFormat('pt-BR', {
  style:'currency', currency:'BRL', maximumFractionDigits:0
}).format(Number(cents || 0) / 100);
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
const currentRoute = () => String(document.body?.dataset?.screen || location.hash || '#home')
  .replace(/^#/, '').split(/[?&/]/)[0] || 'home';
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const validUuid = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
const safeHttps = value => {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' ? url.href.slice(0, 700) : '';
  } catch {
    return '';
  }
};
const localDateTime = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const isoOrNull = value => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const formatDate = value => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle:'medium', timeZone:'America/Sao_Paulo'
    }).format(date);
  } catch {
    return '—';
  }
};

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './experience-conversion-core-v530.css?v=530';
  document.head.append(link);
}

export function extractSpotifyAlbumIdV530(value) {
  const input = clean(value, 700);
  if (!input || validUuid(input)) return '';
  if (/^[A-Za-z0-9]{12,40}$/.test(input)) return input;
  const uri = input.match(/^spotify:album:([A-Za-z0-9]{12,40})$/i);
  if (uri) return uri[1];
  try {
    const url = new URL(input);
    if (!['open.spotify.com', 'spotify.com', 'www.spotify.com'].includes(url.hostname)) return '';
    const parts = url.pathname.split('/').filter(Boolean);
    const albumAt = parts.indexOf('album');
    const id = albumAt >= 0 ? parts[albumAt + 1] : '';
    return /^[A-Za-z0-9]{12,40}$/.test(id || '') ? id : '';
  } catch {
    return '';
  }
}

function normalizeFallbackAlbum(album, index) {
  const spotifyId = extractSpotifyAlbumIdV530(album?.spotifyUrl || album?.spotify_url || album?.id);
  if (!spotifyId) return null;
  return Object.freeze({
    recordId:'',
    spotifyId,
    name:clean(album?.name || album?.title || `Álbum ${index + 1}`, 160),
    artist:clean(album?.artist || MEDIA_POLICY_V149.artist, 160),
    releaseType:clean(album?.releaseType || 'album', 20).toLowerCase(),
    description:clean(album?.description || 'Lançamento oficial de Hércules DX.', 1200),
    coverUrl:safeHttps(album?.coverUrl || album?.cover_url),
    releaseDate:album?.releaseDate || album?.release_date || '',
    spotifyUrl:`https://open.spotify.com/album/${spotifyId}`,
    sortOrder:Number(album?.sortOrder ?? index),
    featured:Boolean(album?.isFeatured || index === 0),
    source:'config-official'
  });
}

export function normalizePublishedMusicRowV530(row, now = new Date()) {
  if (!row || row.status !== 'published') return null;
  const publishedAt = row.published_at ? new Date(row.published_at) : null;
  if (!publishedAt || Number.isNaN(publishedAt.getTime()) || publishedAt > now) return null;
  const spotifyId = extractSpotifyAlbumIdV530(row.spotify_url);
  if (!spotifyId) return null;
  return Object.freeze({
    recordId:validUuid(row.id) ? String(row.id) : '',
    spotifyId,
    name:clean(row.title, 160),
    artist:clean(row.artist || MEDIA_POLICY_V149.artist, 160),
    releaseType:['album', 'ep', 'single'].includes(String(row.release_type || '').toLowerCase())
      ? String(row.release_type).toLowerCase() : 'album',
    description:clean(row.description || '', 1200),
    coverUrl:safeHttps(row.cover_url),
    releaseDate:row.release_date || row.published_at || '',
    spotifyUrl:`https://open.spotify.com/album/${spotifyId}`,
    sortOrder:Math.max(0, Math.min(9999, Number(row.sort_order) || 0)),
    featured:row.is_featured === true,
    source:'supabase-published'
  });
}

export function mergeMusicCatalogV530(fallbackAlbums = [], publicRows = [], now = new Date()) {
  const fallback = fallbackAlbums.map(normalizeFallbackAlbum).filter(Boolean);
  const published = publicRows.map(row => normalizePublishedMusicRowV530(row, now)).filter(Boolean)
    .sort((a, b) => Number(b.featured) - Number(a.featured)
      || a.sortOrder - b.sortOrder
      || String(b.releaseDate).localeCompare(String(a.releaseDate)));
  const merged = new Map();
  fallback.forEach(album => merged.set(album.spotifyId, album));
  published.forEach(album => merged.set(album.spotifyId, album));
  const liveIds = new Set(published.map(album => album.spotifyId));
  return Object.freeze([
    ...published,
    ...fallback.filter(album => !liveIds.has(album.spotifyId))
  ].map(album => merged.get(album.spotifyId)));
}

async function fetchPublishedMusic(config, signal) {
  const base = String(config?.supabaseUrl || '').replace(/\/$/, '');
  const key = String(config?.supabasePublishableKey || '');
  if (!base || !key) return [];
  const url = new URL(`${base}/rest/v1/music_releases`);
  url.searchParams.set('select', MUSIC_SELECT);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('published_at', `lte.${new Date().toISOString()}`);
  url.searchParams.set('order', 'is_featured.desc,sort_order.asc,published_at.desc');
  url.searchParams.set('limit', '100');
  const response = await fetch(url, {
    method:'GET', credentials:'omit', cache:'no-store', signal,
    headers:{ Accept:'application/json', apikey:key }
  });
  if (!response.ok) throw new Error(`MUSIC_PUBLIC_${response.status}`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

export const EXPERIENCE_CONVERSION_CONTRACT_V530 = Object.freeze({
  release:RELEASE,
  macroStage:'6/10',
  worlds:ROUTES,
  oneCanonicalOrb:true,
  usesOrbJourneyV525:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  permanentAnimationLoops:0,
  touchFramesOnDemandOnly:true,
  skinReactive:true,
  consultationServices:4,
  consultationPriceCents:Object.freeze([50000, 50000, 30000, 15000]),
  consultationRealBilling:false,
  storeCheckoutInternal:false,
  storeAffiliateExternal:true,
  musicFallbackAlbums:2,
  musicPublicSource:'supabase-published-only',
  musicUuidUsedAsSpotifyId:false,
  musicAutoplay:false,
  futureMusicFromOwnerAdmin:true,
  videoPublicSource:'supabase-published-only',
  inventedVideos:0,
  ownerMfaRequired:true,
  privateContentReads:0
});

class AdminMusicV530 {
  constructor(root, core) {
    this.root = root;
    this.core = core;
    this.apiBase = `${String(globalThis.divinaAuth?.functionBase || '').replace(/\/$/, '')}/admin-media-v320`;
    this.albums = [];
    this.loaded = false;
    this.loading = false;
    this.error = '';
    this.editingId = '';
    this.abort = new AbortController();
    this.observer = null;
    if (!this.root) return;
    this.observer = new MutationObserver(() => this.mount());
    this.observer.observe(this.root, { childList:true, subtree:true });
    this.mount();
  }

  mount() {
    const videoWorld = this.root.querySelector('[data-admin-media-v320]');
    if (!videoWorld) return false;
    let section = videoWorld.querySelector('[data-ec530-admin-music]');
    if (!section) {
      section = document.createElement('section');
      section.className = 'ec530-admin-music';
      section.dataset.ec530AdminMusic = '';
      const archive = videoWorld.querySelector('.admin-media-v320__archive');
      if (archive) archive.insertAdjacentElement('beforebegin', section);
      else videoWorld.append(section);
      this.render();
    }
    if (!this.loaded && !this.loading) this.load();
    return true;
  }

  async request(payload = null) {
    if (!this.apiBase || this.apiBase.startsWith('/admin-media')) return { ok:false, body:{ error:'backend_unavailable' } };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ADMIN_TIMEOUT);
    try {
      const response = await fetch(this.apiBase, {
        method:payload ? 'POST' : 'GET',
        credentials:'include', cache:'no-store', signal:controller.signal,
        headers:{
          Accept:'application/json', 'Content-Type':'application/json',
          'x-divina-admin-request':'v530'
        },
        ...(payload ? { body:JSON.stringify(payload) } : {})
      });
      const body = await response.json().catch(() => ({}));
      return { ok:response.ok, status:response.status, body };
    } catch {
      return { ok:false, status:0, body:{ error:'network_unavailable' } };
    } finally {
      clearTimeout(timer);
    }
  }

  async load() {
    if (this.loading) return;
    this.loading = true;
    this.error = '';
    this.paint('Carregando catálogo musical protegido…');
    const result = await this.request();
    this.loading = false;
    if (result.ok) {
      this.albums = Array.isArray(result.body?.albums) ? result.body.albums : [];
      this.loaded = true;
    } else {
      this.error = clean(result.body?.error || 'music_admin_load_failed', 120);
    }
    this.render();
  }

  render() {
    const section = this.root.querySelector('[data-ec530-admin-music]');
    if (!section) return;
    const editing = this.albums.find(item => item.id === this.editingId) || null;
    section.innerHTML = `
      <div class="ec530-admin-music__state">
        <span><b>V530</b><small>OWNER + MFA · STAGING</small></span>
        <span><b>${this.albums.length}</b><small>lançamentos no cofre</small></span>
        <span><b>SPOTIFY</b><small>ID vem da URL, nunca do UUID</small></span>
      </div>
      <article class="ec530-admin-music__editor">
        <header><div><p class="eyebrow">EDITOR DE MÚSICA</p><h4>${editing ? 'Editar lançamento' : 'Novo lançamento'}</h4>
        <span>Os dois álbuns atuais continuam seguros. Cadastre aqui os próximos quando estiverem oficiais.</span></div><b>ORBE SONORA</b></header>
        <form data-ec530-music-form>
          <input type="hidden" name="id" value="${safe(editing?.id || '')}">
          <div class="ec530-admin-music__grid">
            <label><span>Título</span><input name="title" maxlength="160" required value="${safe(editing?.title || '')}"></label>
            <label><span>Artista</span><input name="artist" maxlength="160" required value="${safe(editing?.artist || MEDIA_POLICY_V149.artist)}"></label>
            <label><span>Formato</span><select name="releaseType"><option value="album"${editing?.release_type === 'album' ? ' selected' : ''}>Álbum</option><option value="ep"${editing?.release_type === 'ep' ? ' selected' : ''}>EP</option><option value="single"${editing?.release_type === 'single' ? ' selected' : ''}>Single</option></select></label>
            <label><span>Data do lançamento</span><input name="releaseDate" type="date" value="${safe(editing?.release_date || '')}"></label>
            <label class="wide"><span>URL oficial do álbum no Spotify</span><input name="spotifyUrl" type="url" inputmode="url" required placeholder="https://open.spotify.com/album/..." value="${safe(editing?.spotify_url || '')}"></label>
            <label class="wide"><span>Descrição</span><textarea name="description" maxlength="2000" rows="4">${safe(editing?.description || '')}</textarea></label>
            <label><span>Publicar em</span><input name="publishAt" type="datetime-local" value="${safe(localDateTime(editing?.published_at))}"></label>
            <label><span>Ordem</span><input name="sortOrder" type="number" min="0" max="9999" step="1" value="${Number(editing?.sort_order || 0)}"></label>
            <label class="wide"><span>Capa opcional (HTTPS)</span><input name="coverUrl" type="url" inputmode="url" placeholder="https://..." value="${safe(editing?.cover_url || '')}"></label>
            <label class="check"><input name="isFeatured" type="checkbox" ${editing?.is_featured ? 'checked' : ''}><span>Destacar lançamento</span></label>
          </div>
          <div class="ec530-admin-music__actions">
            <button type="button" data-ec530-save="draft">${this.loading ? 'AGUARDE…' : 'SALVAR RASCUNHO'}</button>
            <button type="button" class="primary" data-ec530-save="published">${this.loading ? 'AGUARDE…' : 'PUBLICAR / AGENDAR'}</button>
            ${editing ? '<button type="button" data-ec530-cancel>CANCELAR EDIÇÃO</button>' : ''}
          </div>
        </form>
        <p data-ec530-admin-state role="status" aria-live="polite">${this.error ? `Falha: ${safe(this.error)}` : 'Rascunhos e datas futuras não aparecem no site público. Nenhuma cobrança é ativada.'}</p>
      </article>
      <article class="ec530-admin-music__archive">
        <header><div><p class="eyebrow">CATÁLOGO EDITORIAL</p><h4>Seus lançamentos</h4></div><button type="button" data-ec530-refresh>ATUALIZAR</button></header>
        ${this.albums.length ? `<div class="ec530-admin-music__list">${this.albums.map(item => this.row(item)).join('')}</div>` :
          '<div class="ec530-admin-music__empty"><span>♫</span><b>Nenhum lançamento adicional.</b><p>Os dois álbuns oficiais configurados no site continuam visíveis.</p></div>'}
      </article>`;
    this.bindEditor(section);
  }

  row(item) {
    const cover = safeHttps(item.cover_url);
    const spotifyId = extractSpotifyAlbumIdV530(item.spotify_url);
    return `<section class="ec530-admin-music__row" data-ec530-music-row="${safe(item.id)}">
      <div class="ec530-admin-music__cover">${cover ? `<img src="${safe(cover)}" alt="" width="112" height="112" loading="lazy" decoding="async">` : '<span>♫</span>'}</div>
      <div><small>${safe(item.status || 'draft')} · ${safe(item.release_type || 'album')}</small><b>${safe(item.title || 'Sem título')}</b>
      <span>${item.published_at ? `Publicação: ${safe(formatDate(item.published_at))}` : 'Ainda não publicado'} · ${spotifyId ? 'Spotify válido' : 'Revise a URL'}</span></div>
      <div class="ec530-admin-music__row-actions"><button type="button" data-ec530-edit="${safe(item.id)}">EDITAR</button><button type="button" data-ec530-delete="${safe(item.id)}">EXCLUIR</button></div>
    </section>`;
  }

  bindEditor(section) {
    section.querySelectorAll('[data-ec530-save]').forEach(button => button.addEventListener('click', () => this.save(button.dataset.ec530Save)));
    section.querySelector('[data-ec530-cancel]')?.addEventListener('click', () => { this.editingId = ''; this.render(); });
    section.querySelector('[data-ec530-refresh]')?.addEventListener('click', () => { this.loaded = false; this.load(); });
    section.querySelectorAll('[data-ec530-edit]').forEach(button => button.addEventListener('click', () => {
      this.editingId = button.dataset.ec530Edit;
      this.render();
      this.root.querySelector('.ec530-admin-music__editor')?.scrollIntoView({ behavior:reducedMotion() ? 'auto' : 'smooth', block:'start' });
    }));
    section.querySelectorAll('[data-ec530-delete]').forEach(button => button.addEventListener('click', () => this.remove(button.dataset.ec530Delete)));
  }

  values() {
    const form = this.root.querySelector('[data-ec530-music-form]');
    if (!form) return null;
    const raw = Object.fromEntries(new FormData(form));
    return {
      id:clean(raw.id, 80) || undefined,
      title:clean(raw.title, 160),
      artist:clean(raw.artist, 160),
      releaseType:['album', 'ep', 'single'].includes(String(raw.releaseType)) ? String(raw.releaseType) : 'album',
      spotifyUrl:clean(raw.spotifyUrl, 700),
      description:String(raw.description || '').trim().slice(0, 2000),
      releaseDate:clean(raw.releaseDate, 10) || null,
      publishAt:isoOrNull(raw.publishAt),
      coverUrl:clean(raw.coverUrl, 700),
      sortOrder:Math.max(0, Math.min(9999, Number(raw.sortOrder) || 0)),
      isFeatured:form.elements.isFeatured?.checked === true
    };
  }

  async save(status) {
    if (this.loading) return;
    const release = this.values();
    if (!release?.title || !release?.artist || !extractSpotifyAlbumIdV530(release.spotifyUrl)) {
      this.paint('Preencha título, artista e uma URL oficial de álbum do Spotify.');
      return;
    }
    if (status === 'published' && typeof globalThis.confirm === 'function'
      && !globalThis.confirm('Publicar este lançamento no catálogo público? Datas futuras continuam agendadas.')) return;
    this.loading = true;
    this.paint(status === 'published' ? 'Publicando no catálogo protegido…' : 'Salvando rascunho…');
    const result = await this.request({ action:'save', resource:'music_release', release:{ ...release, status } });
    this.loading = false;
    if (result.ok) {
      this.editingId = '';
      this.loaded = false;
      await this.load();
      if (status === 'published' && this.core.musicLoaded) this.core.loadMusic(true);
      this.core.notify(status === 'published' ? 'Lançamento publicado no catálogo musical.' : 'Rascunho musical salvo no STAGING.');
      return;
    }
    this.paint(`Não foi possível salvar: ${clean(result.body?.error || 'erro editorial', 120)}.`);
  }

  async remove(id) {
    if (this.loading || !validUuid(id)) return;
    const item = this.albums.find(row => row.id === id);
    if (typeof globalThis.confirm === 'function' && !globalThis.confirm(`Excluir “${item?.title || 'este lançamento'}” do cofre editorial?`)) return;
    this.loading = true;
    this.paint('Excluindo lançamento…');
    const result = await this.request({ action:'delete', resource:'music_release', id });
    this.loading = false;
    if (result.ok) {
      this.editingId = '';
      this.loaded = false;
      await this.load();
      if (this.core.musicLoaded) this.core.loadMusic(true);
      this.core.notify('Lançamento excluído do STAGING editorial.');
      return;
    }
    this.paint('O lançamento não pôde ser excluído.');
  }

  paint(message) {
    const state = this.root.querySelector('[data-ec530-admin-state]');
    if (state) state.textContent = message;
  }

  status() {
    return Object.freeze({
      release:RELEASE, albums:this.albums.length, backend:'admin-media-v320',
      localCrud:false, ownerMfaRequired:true, draftsPublic:false
    });
  }

  destroy() {
    this.abort.abort();
    this.observer?.disconnect();
    this.root.querySelector('[data-ec530-admin-music]')?.remove();
  }
}

export class ExperienceConversionCoreV530 {
  constructor({ go, orbCore, orbPresence, universe, config } = {}) {
    this.go = typeof go === 'function' ? go : id => globalThis.orbe?.go?.(id);
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orbPresence = orbPresence || globalThis.divinaOrbUniversalPresenceV526?.engine || null;
    this.universe = universe || globalThis.orbe?.universe || null;
    this.config = config || {};
    this.abort = new AbortController();
    this.observer = null;
    this.frame = 0;
    this.pointerFrame = 0;
    this.pointerSample = null;
    this.musicController = null;
    this.musicLoading = false;
    this.musicLoaded = false;
    this.musicError = '';
    this.musicRows = [];
    this.musicCatalog = mergeMusicCatalogV530(this.config.spotifyAlbums || [], []);
    this.activeAlbumId = this.musicCatalog[0]?.spotifyId || '';
    this.adminMusic = null;
    installStyle();
    this.bind();
    this.ensureAdmin();
    this.scheduleRefresh();
    document.documentElement.dataset.experienceConversion = 'v530';
    this.syncHomeCommercialTruth();
  }

  bind() {
    const { signal } = this.abort;
    [
      'divina:page-ready', 'divina:route-ready', 'divina:supreme-orb-did-navigate',
      'divina:consultations-world-ready', 'divina:store-world-ready',
      'divina:videos-world-ready', 'divina:skin-applied', 'divina:skin-changed'
    ].forEach(type => document.addEventListener(type, event => {
      if (event.detail?.id === 'music' || currentRoute() === 'music') this.loadMusic();
      this.scheduleRefresh();
    }, { passive:true, signal }));

    document.addEventListener('click', event => this.handleClick(event), { capture:true, signal });
    document.addEventListener('pointerdown', event => this.handlePointer(event, true), { passive:true, signal });
    document.addEventListener('pointermove', event => this.handlePointer(event, false), { passive:true, signal });
    globalThis.addEventListener?.('resize', () => this.scheduleRefresh(), { passive:true, signal });
    globalThis.addEventListener?.('pageshow', () => this.scheduleRefresh(), { passive:true, signal });

    this.observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) this.scheduleRefresh();
    });
    if (document.body) this.observer.observe(document.body, { childList:true, subtree:true });
  }

  handleClick(event) {
    const routeButton = event.target?.closest?.('[data-ec530-route]');
    if (routeButton) {
      event.preventDefault();
      this.travel(routeButton.dataset.ec530Route);
      return;
    }
    const serviceButton = event.target?.closest?.('[data-ec530-service]');
    if (serviceButton) {
      event.preventDefault();
      this.chooseService(serviceButton.dataset.ec530Service);
      return;
    }
    const albumButton = event.target?.closest?.('[data-ec530-album]');
    if (albumButton) {
      event.preventDefault();
      this.selectAlbum(albumButton.dataset.ec530Album, true);
      return;
    }
    const engineService = event.target?.closest?.('#consultationApp [data-service]');
    if (engineService) this.updateServiceSelection(engineService.dataset.service);
  }

  handlePointer(event, pressed) {
    const root = event.target?.closest?.('#consultations, #store, #music, #videos');
    if (!root || !ROUTES.includes(root.id)) return;
    this.pointerSample = { root, x:event.clientX, y:event.clientY, energy:pressed ? 1 : .52 };
    if (this.pointerFrame) return;
    this.pointerFrame = requestAnimationFrame(() => {
      this.pointerFrame = 0;
      const sample = this.pointerSample;
      this.pointerSample = null;
      if (!sample?.root?.isConnected) return;
      const rect = sample.root.getBoundingClientRect();
      const x = clamp((sample.x - rect.left) / Math.max(1, rect.width) * 100, 0, 100);
      const y = clamp((sample.y - rect.top) / Math.max(1, rect.height) * 100, 0, 100);
      sample.root.style.setProperty('--ec530-touch-x', `${x.toFixed(2)}%`);
      sample.root.style.setProperty('--ec530-touch-y', `${y.toFixed(2)}%`);
      sample.root.style.setProperty('--ec530-touch-energy', String(sample.energy));
    });
    if (pressed) this.orbCore?.pulse?.('experience-touch', { intensity:.46, route:root.id });
  }

  travel(target) {
    if (!ROUTES.includes(target)) return false;
    const from = currentRoute();
    this.orbCore?.pulse?.('experience-path', { intensity:.82, from, target });
    document.dispatchEvent(new CustomEvent('divina:experience-travel-v530', {
      detail:Object.freeze({ from, target, canonicalOrb:'v501' })
    }));
    let journey;
    try {
      journey = this.go(target, { source:'experience-conversion-v530', from, target });
    } catch {
      this.notify('A passagem continua disponível pelo menu da Orbe.');
      return false;
    }
    Promise.resolve(journey).catch(() => this.notify('A passagem continua disponível pelo menu da Orbe.'));
    return true;
  }

  scheduleRefresh() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }

  refresh() {
    this.syncHomeCommercialTruth();
    ROUTES.forEach(route => this.mountNavigation(route));
    this.mountConsultationChoice();
    this.decorateConsultations();
    this.decorateStore();
    this.decorateVideos();
    this.updateNavigation();
    this.ensureAdmin();
    this.adminMusic?.mount();
    if (currentRoute() === 'music') this.loadMusic();
  }

  mountNavigation(route) {
    const root = document.getElementById(route);
    if (!root) return null;
    let nav = root.querySelector(':scope > [data-ec530-nav]');
    if (!nav) {
      nav = document.createElement('section');
      nav.className = 'ec530-nav';
      nav.dataset.ec530Nav = route;
      nav.setAttribute('aria-label', 'Quatro experiências conectadas pela mesma Orbe');
      nav.innerHTML = `
        <span class="ec530-nav__light" aria-hidden="true"></span>
        <header class="ec530-nav__head"><span aria-hidden="true">✦</span><div><small>MACROETAPA 6/10 · MESMA ORBE</small><b>Experiências, Conteúdo e Conversão</b></div><em>V530</em></header>
        <div class="ec530-nav__paths">${ROUTES.map(id => {
          const item = PROFILE[id];
          return `<button type="button" data-ec530-route="${id}" aria-label="Viajar para ${safe(item.title)}"><span aria-hidden="true">${item.sigil}</span><span><small>${safe(item.eyebrow)}</small><b>${safe(item.title)}</b><em>${safe(item.status)}</em></span></button>`;
        }).join('')}</div>
        <p><span aria-hidden="true">◇</span>A Orbe conduz a passagem; cada mundo preserva seu motor, sua verdade e seus limites.</p>`;
      const anchor = root.querySelector(PROFILE[route].anchor);
      if (anchor) anchor.insertAdjacentElement('beforebegin', nav);
      else root.prepend(nav);
    }
    root.dataset.experienceWorld = 'v530';
    return nav;
  }

  updateNavigation() {
    const route = currentRoute();
    document.querySelectorAll('[data-ec530-nav]').forEach(nav => nav.querySelectorAll('[data-ec530-route]').forEach(button => {
      const active = button.dataset.ec530Route === route;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-pressed', String(active));
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }));
  }

  syncHomeCommercialTruth() {
    const buttons = [...document.querySelectorAll('.home-commerce article:first-child button[data-go="consultations"]:not(.home-gold-action)')];
    COMMERCIAL_TRUTH_V200.services.forEach((service, index) => {
      const button = buttons[index];
      const span = button?.querySelector(':scope > span');
      if (!span) return;
      span.replaceChildren(document.createTextNode(service.name));
      const small = document.createElement('small');
      small.textContent = money(service.priceCents);
      span.append(small);
      button.dataset.consultationService = service.id;
      button.setAttribute('aria-label', `${service.name}, ${money(service.priceCents)}. Abrir Consultas.`);
    });
  }

  mountConsultationChoice() {
    const screen = document.getElementById('consultations');
    const app = document.getElementById('consultationApp');
    if (!screen || !app || screen.querySelector(':scope > [data-ec530-consultations]')) return;
    const section = document.createElement('section');
    section.className = 'ec530-consultations';
    section.dataset.ec530Consultations = '';
    section.setAttribute('aria-labelledby', 'ec530ConsultationsTitle');
    section.innerHTML = `
      <header><div><p class="eyebrow">ESCOLHA PELO TAMANHO DA SUA PERGUNTA</p><h3 id="ec530ConsultationsTitle">Uma leitura humana para cada momento.</h3><p>Comece pela profundidade que você precisa — não pelo maior valor. A solicitação é privada, gera protocolo e não cobra automaticamente.</p></div><span aria-hidden="true">☾</span></header>
      <div class="ec530-consultations__choices">${COMMERCIAL_TRUTH_V200.services.map((service, index) => `
        <button type="button" data-ec530-service="${safe(service.id)}" aria-pressed="false">
          <span class="ec530-consultations__halo" aria-hidden="true"></span><i aria-hidden="true">${service.sigil}</i><small>${String(index + 1).padStart(2, '0')} · ${safe(service.duration)}</small><b>${safe(service.name)}</b><p>${safe(service.description)}</p><strong>${money(service.priceCents)}</strong><em>ESCOLHER <span aria-hidden="true">→</span></em>
        </button>`).join('')}</div>
      <p class="ec530-consultations__trust"><span aria-hidden="true">◇</span><span><b>Atendimento humano e separado da Whit.</b> Confirmação por e-mail; nenhuma cobrança real nesta etapa.</span></p>`;
    app.insertAdjacentElement('beforebegin', section);
  }

  chooseService(id) {
    if (!COMMERCIAL_TRUTH_V200.services.some(service => service.id === id)) return false;
    const app = document.getElementById('consultationApp');
    if (!app) return false;
    const select = () => {
      const actual = app.querySelector(`[data-service="${id}"]`);
      if (!actual) return false;
      actual.click();
      this.updateServiceSelection(id);
      this.orbCore?.pulse?.('consultation-choice', { intensity:.72, serviceId:id });
      setTimeout(() => app.querySelector('.consultation-flow-stage')?.scrollIntoView({ behavior:reducedMotion() ? 'auto' : 'smooth', block:'start' }), 0);
      return true;
    };
    if (select()) return true;
    const change = app.querySelector('[data-change-service],[data-back-services]');
    if (change) {
      change.click();
      queueMicrotask(() => select());
      return true;
    }
    this.go('consultations', { source:'experience-service-v530' });
    setTimeout(() => select(), 240);
    return true;
  }

  updateServiceSelection(id) {
    document.querySelectorAll('[data-ec530-service]').forEach(button => {
      const active = button.dataset.ec530Service === id;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  decorateConsultations() {
    const app = document.getElementById('consultationApp');
    if (!app) return;
    const badges = app.querySelectorAll('.consultation-sanctuary-badges span');
    if (badges[1]) badges[1].textContent = '◇ DE R$ 150 A R$ 500';
    app.querySelectorAll('.consultation-v147-service, .consultations-world-v319 article').forEach(surface => {
      surface.dataset.ec530Bubble = 'consultation';
    });
  }

  decorateStore() {
    const app = document.getElementById('storeApp');
    if (!app) return;
    app.querySelectorAll('[data-collection]').forEach(surface => { surface.dataset.ec530Bubble = 'collection'; });
    app.querySelectorAll('.store-v148-product').forEach(surface => { surface.dataset.ec530Bubble = 'product'; });
    app.querySelectorAll('.mcv320-stars').forEach(surface => { surface.dataset.ec530StaticLight = ''; });
  }

  async loadMusic(force = false) {
    const root = document.getElementById('musicApp');
    if (!root || this.musicLoading || (!force && this.musicLoaded)) return;
    if (!root.querySelector('[data-media-v149="music"]') && !root.dataset.experienceMusic) return;
    this.musicLoading = true;
    this.musicError = '';
    this.renderMusic();
    this.musicController?.abort();
    this.musicController = new AbortController();
    const timer = setTimeout(() => this.musicController?.abort(), 12000);
    try {
      this.musicRows = await fetchPublishedMusic(this.config, this.musicController.signal);
      this.musicCatalog = mergeMusicCatalogV530(this.config.spotifyAlbums || [], this.musicRows);
      this.musicLoaded = true;
    } catch {
      this.musicRows = [];
      this.musicCatalog = mergeMusicCatalogV530(this.config.spotifyAlbums || [], []);
      this.musicError = 'public-feed-unavailable';
      this.musicLoaded = true;
    } finally {
      clearTimeout(timer);
      this.musicLoading = false;
      if (!this.musicCatalog.some(album => album.spotifyId === this.activeAlbumId)) this.activeAlbumId = this.musicCatalog[0]?.spotifyId || '';
      this.renderMusic();
      document.dispatchEvent(new CustomEvent('divina:music-world-ready-v530', { detail:Object.freeze({
        release:RELEASE, albums:this.musicCatalog.length, publishedRows:this.musicRows.length,
        fallbackAlbums:(this.config.spotifyAlbums || []).length, autoplay:false,
        uuidUsedAsSpotifyId:false, error:Boolean(this.musicError)
      }) }));
    }
  }

  renderMusic() {
    const root = document.getElementById('musicApp');
    if (!root) return;
    const albums = this.musicCatalog;
    if (!this.activeAlbumId || !albums.some(album => album.spotifyId === this.activeAlbumId)) this.activeAlbumId = albums[0]?.spotifyId || '';
    const active = albums.find(album => album.spotifyId === this.activeAlbumId) || albums[0];
    const liveCount = albums.filter(album => album.source === 'supabase-published').length;
    root.dataset.experienceMusic = 'v530';
    root.innerHTML = `<div class="ec530-music" data-ec530-music>
      <section class="ec530-music__hero" aria-labelledby="ec530MusicTitle">
        <span class="ec530-music__disc" aria-hidden="true"><i></i></span>
        <div><p class="eyebrow">ORBE SONORA · HÉRCULES DX</p><h3 id="ec530MusicTitle">Álbuns para atravessar realidades.</h3><p>Os dois universos atuais permanecem aqui. Cada novo lançamento publicado pelo ADM nasce automaticamente nesta constelação — sempre sob escolha, nunca com autoplay.</p></div>
        <dl><div><dt>${albums.length}</dt><dd>lançamentos</dd></div><div><dt>${liveCount}</dt><dd>do catálogo vivo</dd></div><div><dt>OFF</dt><dd>autoplay</dd></div></dl>
      </section>
      <section class="ec530-music__library" aria-labelledby="ec530AlbumsTitle">
        <header><div><p class="eyebrow">DISCOGRAFIA OFICIAL</p><h3 id="ec530AlbumsTitle">Escolha uma bolha sonora.</h3></div><p role="status" aria-live="polite">${this.musicLoading ? 'Conectando ao catálogo publicado…' : this.musicError ? 'Catálogo ao vivo indisponível agora; os álbuns oficiais continuam acessíveis.' : 'Catálogo publicado sincronizado.'}</p></header>
        ${albums.length ? `<div class="ec530-music__layout"><div class="ec530-music__albums" role="tablist" aria-label="Lançamentos de Hércules DX">${albums.map((album, index) => this.albumButton(album, index)).join('')}</div><div class="ec530-music__player" data-ec530-player>${active ? this.playerMarkup(active) : ''}</div></div>` : '<div class="ec530-music__empty"><span>♫</span><h4>O catálogo está sendo preparado.</h4></div>'}
      </section>
      <aside class="ec530-music__privacy"><span aria-hidden="true">◇</span><p><b>Escuta transparente.</b> O player é fornecido pelo Spotify e só carrega o álbum escolhido. Histórico de reprodução não é guardado pela Divina Bruxa.</p></aside>
    </div>`;
    this.bindMusic(root);
  }

  albumButton(album, index) {
    const active = album.spotifyId === this.activeAlbumId;
    return `<button type="button" role="tab" id="ec530-album-tab-${safe(album.spotifyId)}" aria-selected="${active}" aria-controls="ec530-album-player" tabindex="${active ? '0' : '-1'}" class="${active ? 'is-active' : ''}" data-ec530-album="${safe(album.spotifyId)}">
      <span class="ec530-music__album-art">${album.coverUrl ? `<img src="${safe(album.coverUrl)}" alt="" width="96" height="96" loading="lazy" decoding="async">` : `<i aria-hidden="true">${index % 2 ? '✦' : '☾'}</i>`}</span>
      <span><small>${String(index + 1).padStart(2, '0')} · ${safe(album.releaseType.toUpperCase())}</small><b>${safe(album.name)}</b><em>${safe(album.artist)}</em></span><strong aria-hidden="true">→</strong>
    </button>`;
  }

  playerMarkup(album) {
    return `<article id="ec530-album-player" role="tabpanel" tabindex="-1" aria-labelledby="ec530-album-tab-${safe(album.spotifyId)}">
      <header><span aria-hidden="true">♫</span><div><small>${safe(album.artist)}</small><h4>${safe(album.name)}</h4><p>${safe(album.description || 'Lançamento oficial disponível no Spotify.')}</p></div></header>
      <iframe title="Ouvir ${safe(album.name)} de ${safe(album.artist)} no Spotify" src="https://open.spotify.com/embed/album/${encodeURIComponent(album.spotifyId)}?utm_source=generator&theme=0" loading="lazy" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <footer><span>${album.releaseDate ? safe(formatDate(album.releaseDate)) : 'Lançamento oficial'}</span><a href="${safe(album.spotifyUrl)}" target="_blank" rel="noopener noreferrer">ABRIR NO SPOTIFY <b aria-hidden="true">↗</b></a></footer>
    </article>`;
  }

  bindMusic(root) {
    const tabs = root.querySelector('.ec530-music__albums');
    tabs?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      const buttons = [...tabs.querySelectorAll('[data-ec530-album]')];
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      let next = current;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else next = (current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      this.selectAlbum(buttons[next]?.dataset.ec530Album, true);
      root.querySelector(`[data-ec530-album="${buttons[next]?.dataset.ec530Album || ''}"]`)?.focus();
    });
  }

  selectAlbum(id, focusPlayer = false) {
    if (!this.musicCatalog.some(album => album.spotifyId === id)) return false;
    this.activeAlbumId = id;
    this.renderMusic();
    this.orbCore?.pulse?.('music-choice', { intensity:.64, spotifyAlbumId:id });
    if (focusPlayer) document.getElementById('ec530-album-player')?.focus({ preventScroll:true });
    return true;
  }

  decorateVideos() {
    const root = document.getElementById('videoApp');
    if (!root) return;
    root.querySelectorAll('.media-v149-episode').forEach(surface => { surface.dataset.ec530Bubble = 'video'; });
    if (root.querySelector('[data-media-v149="videos"]') && !root.querySelector('[data-ec530-video-note]')) {
      const note = document.createElement('section');
      note.className = 'ec530-video-note';
      note.dataset.ec530VideoNote = '';
      note.innerHTML = `<span aria-hidden="true">▶</span><div><p class="eyebrow">DE FRENTE COM O TAROT · FORMATO VIVO</p><h3>Vídeo, animação ou Memoji — sempre conteúdo real.</h3><p>O formato pode evoluir; o compromisso não muda. Só aparece aqui o que foi publicado no YouTube oficial pelo ADM. Rascunhos e datas futuras continuam invisíveis.</p></div><a href="${safe(MEDIA_POLICY_V149.youtubeChannel)}" target="_blank" rel="noopener noreferrer">ABRIR CANAL <b aria-hidden="true">↗</b></a>`;
      const shell = root.querySelector('[data-media-v149="videos"]');
      shell?.insertAdjacentElement('beforebegin', note);
    }
  }

  ensureAdmin() {
    const root = document.getElementById('adminApp');
    if (!root || this.adminMusic) return;
    this.adminMusic = new AdminMusicV530(root, this);
  }

  notify(message) {
    globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:String(message || '') }));
  }

  audit() {
    const routeAudit = Object.fromEntries(ROUTES.map(route => {
      const root = document.getElementById(route);
      return [route, Object.freeze({
        root:Boolean(root),
        navCount:root?.querySelectorAll?.(':scope > [data-ec530-nav]').length || 0,
        bubbleCount:root?.querySelectorAll?.('[data-ec530-bubble]').length || 0
      })];
    }));
    return Object.freeze({
      release:RELEASE,
      routes:Object.freeze(routeAudit),
      duplicateNavs:Object.values(routeAudit).some(item => item.navCount > 1),
      canonicalOrbCount:document.querySelectorAll('[data-supreme-orb="living"]').length,
      homePrices:COMMERCIAL_TRUTH_V200.services.map(service => service.priceCents),
      musicAlbums:this.musicCatalog.length,
      publicMusicRows:this.musicRows.length,
      musicError:Boolean(this.musicError),
      adminMusic:this.adminMusic?.status?.() || null
    });
  }

  status() {
    const audit = this.audit();
    return Object.freeze({
      ...EXPERIENCE_CONVERSION_CONTRACT_V530,
      route:currentRoute(),
      ready:!audit.duplicateNavs,
      canonicalOrbCount:audit.canonicalOrbCount,
      usesOrbPresenceV526:Boolean(this.orbPresence),
      usesLivingUniverseV524:Boolean(this.universe),
      musicAlbums:this.musicCatalog.length,
      musicFeedLoaded:this.musicLoaded,
      musicFeedError:Boolean(this.musicError),
      audit
    });
  }

  contract() {
    return EXPERIENCE_CONVERSION_CONTRACT_V530;
  }

  destroy() {
    this.abort.abort();
    this.observer?.disconnect();
    this.musicController?.abort();
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.pointerFrame);
    this.adminMusic?.destroy();
    ROUTES.forEach(route => {
      const root = document.getElementById(route);
      root?.querySelector(':scope > [data-ec530-nav]')?.remove();
      root?.removeAttribute('data-experience-world');
    });
    document.querySelector('[data-ec530-consultations]')?.remove();
    document.querySelector('[data-ec530-video-note]')?.remove();
    if (document.documentElement.dataset.experienceConversion === 'v530') delete document.documentElement.dataset.experienceConversion;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createExperienceConversionCoreV530(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new ExperienceConversionCoreV530(options);
  globalThis[MARK] = instance;
  globalThis.divinaExperienceConversionV530 = instance;
  return instance;
}
