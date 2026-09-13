/* DIVINA BRUXA 4.0 — MÚSICA + VÍDEOS SUPREMOS · MACROETAPA 11/14 · V559
   Catálogo público governado por RLS. Um único player adormecido, ativado por toque,
   sem autoplay e desmontado ao sair do mundo editorial. */

export const MEDIA_SUPREME_RELEASE_V559 = 'V559';

const PUBLIC_LIMIT = 240;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com']);
const SPOTIFY_HOSTS = new Set(['open.spotify.com', 'spotify.com', 'www.spotify.com']);
const VALID_TYPES = new Set(['album', 'ep', 'single']);

const COPY = Object.freeze({
  'pt-BR': {
    musicEyebrow:'MÚSICA · ORBE SONORA', musicTitle:'Dois álbuns reais. Uma escuta escolhida por você.',
    musicLead:'Explore os lançamentos de Hércules DX. O player oficial só desperta depois do seu toque.',
    releases:'lançamentos', tracks:'faixas', noAutoplay:'autoplay', off:'DESLIGADO', all:'Todos', album:'Álbum', ep:'EP', single:'Single',
    listen:'OUVIR NO PLAYER OFICIAL', close:'FECHAR PLAYER', spotify:'ABRIR NO SPOTIFY', share:'COMPARTILHAR',
    trackList:'Faixas', card:'Carta', officialAlbum:'Álbum oficial de Hércules DX.', trackNamesOfficial:'Os títulos e créditos completos aparecem no player oficial do Spotify.',
    unavailable:'O catálogo online não respondeu. Os dois álbuns oficiais continuam disponíveis.',
    videoEyebrow:'VÍDEOS · DE FRENTE COM O TAROT', videoTitle:'Conversas que só aparecem depois de publicadas.',
    videoLead:'Temporadas, episódios e cartas relacionadas chegam aqui somente após revisão editorial.',
    published:'publicados', invented:'inventados', editorial:'verdade editorial', none:'NENHUM',
    preparing:'O primeiro encontro está em preparação.', preparingLead:'Hoje existem zero episódios publicados. Nenhum título, convidado ou data foi inventado para preencher este espaço.',
    youtube:'VISITAR O YOUTUBE OFICIAL', search:'Buscar episódios publicados', seasons:'Temporadas', allSeasons:'Todas',
    watch:'ASSISTIR AQUI', closeVideo:'FECHAR VÍDEO', youtubeOpen:'ABRIR NO YOUTUBE', previous:'ANTERIOR', next:'PRÓXIMO', related:'Cartas relacionadas',
    noResults:'Nenhum episódio publicado corresponde a este filtro.', loading:'Consultando o arquivo publicado…', error:'O arquivo online está indisponível agora; nenhum conteúdo foi inventado.',
    copied:'Link copiado.', shareUnavailable:'Não foi possível compartilhar agora.', season:'Temporada', episode:'Episódio'
  },
  en: {
    musicEyebrow:'MUSIC · SONIC ORB', musicTitle:'Two real albums. Listening begins by your choice.',
    musicLead:'Explore Hércules DX releases. The official player wakes only after your tap.',
    releases:'releases', tracks:'tracks', noAutoplay:'autoplay', off:'OFF', all:'All', album:'Album', ep:'EP', single:'Single',
    listen:'OPEN OFFICIAL PLAYER', close:'CLOSE PLAYER', spotify:'OPEN ON SPOTIFY', share:'SHARE',
    trackList:'Tracks', card:'Card', officialAlbum:'Official album by Hércules DX.', trackNamesOfficial:'Complete titles and credits are shown in the official Spotify player.',
    unavailable:'The online catalog did not respond. Both official albums remain available.',
    videoEyebrow:'VIDEOS · FACE TO FACE WITH TAROT', videoTitle:'Conversations appear only after publication.',
    videoLead:'Seasons, episodes and related cards arrive here only after editorial review.',
    published:'published', invented:'invented', editorial:'editorial truth', none:'NONE',
    preparing:'The first encounter is in preparation.', preparingLead:'There are currently zero published episodes. No title, guest or date was invented to fill this space.',
    youtube:'VISIT THE OFFICIAL YOUTUBE', search:'Search published episodes', seasons:'Seasons', allSeasons:'All',
    watch:'WATCH HERE', closeVideo:'CLOSE VIDEO', youtubeOpen:'OPEN ON YOUTUBE', previous:'PREVIOUS', next:'NEXT', related:'Related cards',
    noResults:'No published episode matches this filter.', loading:'Checking the published archive…', error:'The online archive is unavailable; no content was invented.',
    copied:'Link copied.', shareUnavailable:'Sharing is unavailable right now.', season:'Season', episode:'Episode'
  },
  es: {
    musicEyebrow:'MÚSICA · ORBE SONORA', musicTitle:'Dos álbumes reales. Tú eliges cuándo escuchar.',
    musicLead:'Explora los lanzamientos de Hércules DX. El reproductor oficial despierta solo después de tu toque.',
    releases:'lanzamientos', tracks:'canciones', noAutoplay:'reproducción automática', off:'APAGADA', all:'Todos', album:'Álbum', ep:'EP', single:'Single',
    listen:'ABRIR REPRODUCTOR OFICIAL', close:'CERRAR REPRODUCTOR', spotify:'ABRIR EN SPOTIFY', share:'COMPARTIR',
    trackList:'Canciones', card:'Carta', officialAlbum:'Álbum oficial de Hércules DX.', trackNamesOfficial:'Los títulos y créditos completos aparecen en el reproductor oficial de Spotify.',
    unavailable:'El catálogo en línea no respondió. Los dos álbumes oficiales siguen disponibles.',
    videoEyebrow:'VÍDEOS · DE FRENTE CON EL TAROT', videoTitle:'Conversaciones que aparecen solo después de publicarse.',
    videoLead:'Temporadas, episodios y cartas relacionadas llegan aquí únicamente tras revisión editorial.',
    published:'publicados', invented:'inventados', editorial:'verdad editorial', none:'NINGUNO',
    preparing:'El primer encuentro está en preparación.', preparingLead:'Hoy hay cero episodios publicados. No se inventó ningún título, invitado o fecha para llenar este espacio.',
    youtube:'VISITAR YOUTUBE OFICIAL', search:'Buscar episodios publicados', seasons:'Temporadas', allSeasons:'Todas',
    watch:'VER AQUÍ', closeVideo:'CERRAR VÍDEO', youtubeOpen:'ABRIR EN YOUTUBE', previous:'ANTERIOR', next:'SIGUIENTE', related:'Cartas relacionadas',
    noResults:'Ningún episodio publicado coincide con este filtro.', loading:'Consultando el archivo publicado…', error:'El archivo en línea no está disponible; no se inventó contenido.',
    copied:'Enlace copiado.', shareUnavailable:'No fue posible compartir ahora.', season:'Temporada', episode:'Episodio'
  }
});

const fallbackCopy = COPY['pt-BR'];
const html = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const clean = (value, max=400) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const integer = (value, min=0, max=9999) => Math.max(min, Math.min(max, Math.floor(Number(value) || 0)));
const nowIso = () => new Date().toISOString();
const routeNow = () => document.body?.dataset?.screen || location.hash.replace(/^#/, '').split('?')[0] || '';

function safeHttps(value, hosts=null) {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || (hosts && !hosts.has(url.hostname))) return '';
    return url.href.slice(0, 900);
  } catch { return ''; }
}

export function spotifyIdentityV559(value) {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || !SPOTIFY_HOSTS.has(url.hostname)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    const typeAt = parts.findIndex(part => ['album', 'track', 'episode', 'show'].includes(part));
    const type = typeAt >= 0 ? parts[typeAt] : '';
    const id = typeAt >= 0 ? parts[typeAt + 1] || '' : '';
    if (!type || !/^[A-Za-z0-9]{12,40}$/.test(id)) return null;
    return Object.freeze({type, id, url:`https://open.spotify.com/${type}/${id}`});
  } catch { return null; }
}

export function youtubeIdentityV559(value) {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || !YOUTUBE_HOSTS.has(url.hostname)) return null;
    let id = '';
    if (url.hostname === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    else if (url.pathname.startsWith('/shorts/')) id = url.pathname.split('/')[2] || '';
    else if (url.pathname.startsWith('/embed/')) id = url.pathname.split('/')[2] || '';
    else id = url.searchParams.get('v') || '';
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
    return Object.freeze({id, url:`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, embed:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`});
  } catch { return null; }
}

export function isPublishedNowV559(row, clock=Date.now()) {
  if (String(row?.status || '').toLowerCase() !== 'published') return false;
  const date = row?.published_at || row?.publishedAt;
  if (!date) return true;
  const instant = new Date(date).getTime();
  return Number.isFinite(instant) && instant <= clock;
}

export function normalizeReleaseV559(row={}) {
  const spotify = spotifyIdentityV559(row.spotify_url || row.spotifyUrl || (row.id && `https://open.spotify.com/album/${row.id}`));
  const title = clean(row.title || row.name, 160);
  const artist = clean(row.artist, 160);
  if (!title || !artist || !spotify) return null;
  const releaseType = VALID_TYPES.has(String(row.release_type || row.releaseType || '').toLowerCase()) ? String(row.release_type || row.releaseType).toLowerCase() : 'album';
  const releaseDate = clean(row.release_date || row.releaseDate || row.year, 10);
  return Object.freeze({
    id:clean(row.id || spotify.id, 80), slug:clean(row.slug || `${artist}-${title}`, 120), title, artist, releaseType,
    coverUrl:safeHttps(row.cover_url || row.coverUrl), description:clean(row.description, 2000), releaseDate,
    spotifyUrl:spotify.url, spotifyId:spotify.id, locale:clean(row.locale || 'pt-BR', 10),
    sortOrder:integer(row.sort_order ?? row.sortOrder), featured:Boolean(row.is_featured ?? row.featured),
    trackCount:integer(row.track_count ?? row.trackCount, 0, 999), source:clean(row.source || 'database', 20)
  });
}

export function normalizeEpisodeV559(row={}) {
  const youtube = youtubeIdentityV559(row.video_url || row.youtube_url || row.url);
  const title = clean(row.title, 160);
  if (!title || !youtube || !isPublishedNowV559(row)) return null;
  const tags = Array.isArray(row.tags) ? row.tags.map(item => clean(item, 32)).filter(Boolean).slice(0, 12) : [];
  return Object.freeze({
    id:clean(row.id, 80), seasonId:clean(row.season_id || row.seasonId, 80), number:integer(row.episode_number ?? row.number, 1, 9999),
    slug:clean(row.slug || title, 120), title, description:clean(row.description, 2600), videoUrl:youtube.url, embedUrl:youtube.embed,
    thumbnailUrl:safeHttps(row.thumbnail_url || row.thumbnailUrl), altText:clean(row.alt_text || row.altText, 240),
    episodeDate:clean(row.episode_date || row.episodeDate, 10), locale:clean(row.locale || 'pt-BR', 10), tags,
    sortOrder:integer(row.sort_order ?? row.sortOrder), featured:Boolean(row.is_featured ?? row.featured), publishedAt:row.published_at || row.publishedAt || ''
  });
}

function normalizeTrack(row={}) {
  const title = clean(row.title, 160);
  if (!title) return null;
  const spotify = spotifyIdentityV559(row.spotify_url || row.spotifyUrl);
  return Object.freeze({id:clean(row.id,80), releaseId:clean(row.release_id || row.releaseId,80), title, number:integer(row.track_number ?? row.number,1,999), duration:integer(row.duration_seconds ?? row.duration,0,86400), spotifyUrl:spotify?.url || '', featured:Boolean(row.is_featured ?? row.featured)});
}

function normalizeSeason(row={}) {
  if (!isPublishedNowV559(row)) return null;
  const title = clean(row.title, 160);
  if (!title) return null;
  return Object.freeze({id:clean(row.id,80), number:integer(row.season_number ?? row.number,1,999), title, description:clean(row.description,1800), coverUrl:safeHttps(row.cover_url || row.coverUrl), sortOrder:integer(row.sort_order ?? row.sortOrder), publishedAt:row.published_at || ''});
}

function fallbackReleases(config={}) {
  return (Array.isArray(config.spotifyAlbums) ? config.spotifyAlbums : []).map(item => normalizeReleaseV559({...item, spotifyUrl:item.spotifyUrl || `https://open.spotify.com/album/${item.id}`, source:'verified-fallback'})).filter(Boolean);
}

function mergeReleases(databaseRows, fallbackRows) {
  const map = new Map();
  fallbackRows.forEach(item => map.set(item.spotifyId, item));
  databaseRows.filter(isPublishedNowV559).map(normalizeReleaseV559).filter(Boolean).forEach(item => {
    const previous = map.get(item.spotifyId);
    map.set(item.spotifyId, Object.freeze({...previous, ...item, trackCount:item.trackCount || previous?.trackCount || 0}));
  });
  return [...map.values()].sort((a,b) => Number(b.featured)-Number(a.featured) || a.sortOrder-b.sortOrder || a.title.localeCompare(b.title));
}

async function publicRows(config, table, params, signal) {
  const base = String(config?.supabaseUrl || '').replace(/\/$/, '');
  const key = String(config?.supabasePublishableKey || '');
  if (!base || !key) throw new Error('public_backend_unavailable');
  const url = new URL(`${base}/rest/v1/${table}`);
  Object.entries(params).forEach(([name,value]) => url.searchParams.set(name, String(value)));
  const controller = new AbortController();
  const stop = () => controller.abort();
  signal?.addEventListener('abort', stop, {once:true});
  const timer = setTimeout(stop, 12000);
  try {
    const response = await fetch(url, {method:'GET', cache:'no-store', signal:controller.signal, headers:{Accept:'application/json', apikey:key}});
    if (!response.ok) throw new Error(`public_${table}_${response.status}`);
    const rows = await response.json();
    return Array.isArray(rows) ? rows.slice(0, PUBLIC_LIMIT) : [];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', stop);
  }
}

function formatDuration(seconds) {
  const value = integer(seconds,0,86400);
  if (!value) return '';
  return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
}

function formatDate(value, locale) {
  if (!value) return '';
  if (/^\d{4}$/.test(String(value))) return String(value);
  try { return new Intl.DateTimeFormat(locale,{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(value)); }
  catch { return clean(value,10); }
}

function trackCountFor(release, tracks) {
  const real = tracks.filter(track => track.releaseId === release.id).length;
  return real || release.trackCount || 0;
}

export class MusicVideoSupremeV559 {
  constructor(roots={}, config={}, options={}) {
    this.roots = {music:roots.music || null, videos:roots.videos || null};
    this.config = config || {};
    this.locale = COPY[options.locale] ? options.locale : (COPY[document.documentElement.lang] ? document.documentElement.lang : 'pt-BR');
    this.copy = COPY[this.locale] || fallbackCopy;
    this.releases = fallbackReleases(config);
    this.tracks = [];
    this.seasons = [];
    this.episodes = [];
    this.cards = new Map();
    this.albumFilter = 'all';
    this.seasonFilter = 'all';
    this.search = '';
    this.activeRelease = this.releases[0]?.id || '';
    this.activeEpisode = '';
    this.loading = false;
    this.loaded = false;
    this.feedError = false;
    this.player = null;
    this.abort = new AbortController();
    this.bind();
    this.render();
    this.load();
    this.roots.music?.setAttribute('data-media-engine','v559');
    this.roots.videos?.setAttribute('data-media-engine','v559');
  }

  bind() {
    const signal = this.abort.signal;
    const click = event => this.onClick(event);
    this.roots.music?.addEventListener('click', click, {signal});
    this.roots.videos?.addEventListener('click', click, {signal});
    this.roots.videos?.addEventListener('input', event => {
      if (!event.target.matches('[data-video-search]')) return;
      this.search = clean(event.target.value, 80).toLocaleLowerCase(this.locale);
      this.renderVideoCatalog();
    }, {signal});
    const route = event => {
      const id = clean(event.detail?.id || routeNow(), 30);
      if (id !== 'music' && id !== 'videos') this.unloadPlayer();
      if ((id === 'music' || id === 'videos') && !this.loaded) this.load();
    };
    document.addEventListener('divina:page-ready', route, {signal});
    document.addEventListener('divina:route-ready', route, {signal});
    window.addEventListener('pagehide', () => this.unloadPlayer(), {signal});
  }

  async load() {
    if (this.loading || this.loaded) return;
    this.loading = true; this.render();
    const signal = this.abort.signal;
    const beforeNow = `(published_at.is.null,published_at.lte.${nowIso()})`;
    const primary = await Promise.allSettled([
      publicRows(this.config,'music_releases',{select:'id,slug,title,artist,release_type,cover_url,description,release_date,spotify_url,locale,sort_order,is_featured,status,published_at',status:'eq.published',or:beforeNow,order:'is_featured.desc,sort_order.asc,published_at.desc',limit:PUBLIC_LIMIT},signal),
      publicRows(this.config,'tarot_seasons',{select:'id,season_number,title,description,cover_url,sort_order,status,published_at',status:'eq.published',or:beforeNow,order:'sort_order.asc,season_number.asc',limit:PUBLIC_LIMIT},signal)
    ]);
    const releaseRows = primary[0].status === 'fulfilled' ? primary[0].value : [];
    const seasonRows = primary[1].status === 'fulfilled' ? primary[1].value : [];
    this.releases = mergeReleases(releaseRows, fallbackReleases(this.config));
    this.seasons = seasonRows.map(normalizeSeason).filter(Boolean);
    const databaseReleaseIds = releaseRows.map(row => clean(row.id,80)).filter(id => /^[0-9a-f-]{36}$/i.test(id));
    const seasonIds = new Set(this.seasons.map(item => item.id));
    const secondary = await Promise.allSettled([
      databaseReleaseIds.length ? publicRows(this.config,'music_tracks',{select:'id,release_id,title,track_number,duration_seconds,spotify_url,is_featured',release_id:`in.(${databaseReleaseIds.join(',')})`,order:'release_id.asc,track_number.asc',limit:PUBLIC_LIMIT},signal) : Promise.resolve([]),
      seasonIds.size ? publicRows(this.config,'tarot_episodes',{select:'id,season_id,episode_number,slug,title,description,video_url,thumbnail_url,alt_text,episode_date,locale,tags,sort_order,is_featured,status,published_at',season_id:`in.(${[...seasonIds].join(',')})`,status:'eq.published',or:beforeNow,order:'is_featured.desc,sort_order.asc,episode_date.desc',limit:PUBLIC_LIMIT},signal) : Promise.resolve([])
    ]);
    const trackRows = secondary[0].status === 'fulfilled' ? secondary[0].value : [];
    const episodeRows = secondary[1].status === 'fulfilled' ? secondary[1].value : [];
    this.tracks = trackRows.map(normalizeTrack).filter(Boolean);
    this.episodes = episodeRows.map(normalizeEpisodeV559).filter(item => item && seasonIds.has(item.seasonId));
    const episodeIds = this.episodes.map(item => item.id);
    const cardRequest = episodeIds.length ? await Promise.allSettled([
      publicRows(this.config,'tarot_episode_cards',{select:'episode_id,card_index',episode_id:`in.(${episodeIds.join(',')})`,order:'episode_id.asc,card_index.asc',limit:PUBLIC_LIMIT},signal)
    ]) : [{status:'fulfilled',value:[]}];
    const cardRows = cardRequest[0].status === 'fulfilled' ? cardRequest[0].value : [];
    this.cards = new Map();
    cardRows.forEach(row => {
      const episodeId = clean(row.episode_id,80), card = integer(row.card_index,0,77);
      if (!episodeId || !this.episodes.some(item => item.id === episodeId)) return;
      this.cards.set(episodeId,[...(this.cards.get(episodeId)||[]),card]);
    });
    this.feedError = [...primary,...secondary,...cardRequest].some(item => item.status === 'rejected');
    this.loaded = true; this.loading = false;
    if (!this.releases.some(item => item.id === this.activeRelease)) this.activeRelease = this.releases[0]?.id || '';
    if (!this.episodes.some(item => item.id === this.activeEpisode)) this.activeEpisode = this.episodes[0]?.id || '';
    this.render();
    this.syncExternalTruth();
    document.dispatchEvent(new CustomEvent('divina:media-supreme-ready',{detail:Object.freeze({release:MEDIA_SUPREME_RELEASE_V559, albums:this.releases.length, episodes:this.episodes.length, inventedEpisodes:0, autoplay:false, feedError:this.feedError})}));
  }

  render() { this.renderMusic(); this.renderVideos(); }
  syncExternalTruth(){document.querySelectorAll('[data-published-episode-count]').forEach(node=>{node.textContent=`${this.episodes.length} ${this.copy.published}`;});document.querySelectorAll('[data-video-editorial-state]').forEach(node=>{node.textContent=this.episodes.length?this.copy.published:this.copy.preparing;});}

  renderMusic() {
    const root = this.roots.music;
    if (!root) return;
    const c = this.copy;
    const visible = this.releases.filter(item => this.albumFilter === 'all' || item.releaseType === this.albumFilter);
    const selected = this.releases.find(item => item.id === this.activeRelease) || visible[0] || this.releases[0];
    const totalTracks = this.releases.reduce((sum,item) => sum + trackCountFor(item,this.tracks),0);
    root.innerHTML = `<section class="mv559-world mv559-music" data-mv559-world="music">
      <header class="mv559-hero"><span class="mv559-sigil" aria-hidden="true">♫</span><div><p>${html(c.musicEyebrow)}</p><h3>${html(c.musicTitle)}</h3><span>${html(c.musicLead)}</span></div></header>
      <dl class="mv559-stats"><div><dt>${this.releases.length}</dt><dd>${html(c.releases)}</dd></div><div><dt>${totalTracks || '18'}</dt><dd>${html(c.tracks)}</dd></div><div><dt>${html(c.off)}</dt><dd>${html(c.noAutoplay)}</dd></div></dl>
      ${this.loading?`<p class="mv559-notice" role="status">${html(c.loading)}</p>`:''}${this.feedError?`<p class="mv559-notice">${html(c.unavailable)}</p>`:''}
      <div class="mv559-filters" role="group" aria-label="${html(c.releases)}">${[['all',c.all],['album',c.album],['ep',c.ep],['single',c.single]].map(([id,label])=>`<button type="button" data-release-filter="${id}" aria-pressed="${this.albumFilter===id}">${html(label)}</button>`).join('')}</div>
      <div class="mv559-layout"><nav class="mv559-catalog" aria-label="${html(c.releases)}">${visible.map(item=>this.releaseCard(item)).join('')}</nav><div class="mv559-detail" data-music-detail>${selected?this.musicDetail(selected):''}</div></div>
    </section>`;
  }

  releaseCard(item) {
    const count = trackCountFor(item,this.tracks);
    const active = item.id === this.activeRelease;
    return `<button type="button" class="mv559-release-card${active?' is-active':''}" data-release-id="${html(item.id)}" data-album="${html(item.spotifyId)}" aria-pressed="${active}"><span class="mv559-cover">${item.coverUrl?`<img src="${html(item.coverUrl)}" alt="" loading="lazy" decoding="async">`:'<i aria-hidden="true">✦</i>'}</span><span><small>${html(item.releaseType.toUpperCase())}${item.releaseDate?` · ${html(formatDate(item.releaseDate,this.locale))}`:''}</small><strong>${html(item.title)}</strong><em>${html(item.artist)}${count?` · ${count} ${html(this.copy.tracks)}`:''}</em></span></button>`;
  }

  musicDetail(item) {
    const c=this.copy, tracks=this.tracks.filter(track=>track.releaseId===item.id).sort((a,b)=>a.number-b.number), count=trackCountFor(item,this.tracks);
    const description=item.source==='verified-fallback'?c.officialAlbum:item.description;
    return `<article class="mv559-release-detail"><p class="mv559-kicker">${html(item.releaseType.toUpperCase())}${item.releaseDate?` · ${html(formatDate(item.releaseDate,this.locale))}`:''}</p><h4>${html(item.title)}</h4><p class="mv559-byline">${html(item.artist)}</p>${description?`<p>${html(description)}</p>`:''}
      <section class="mv559-tracklist"><h5>${html(c.trackList)}${count?` · ${count}`:''}</h5>${tracks.length?`<ol>${tracks.map(track=>`<li><span>${String(track.number).padStart(2,'0')}</span><b>${html(track.title)}</b><time>${html(formatDuration(track.duration))}</time></li>`).join('')}</ol>`:`<p>${html(c.trackNamesOfficial)}</p>`}</section>
      <div class="mv559-player-slot" data-player-slot="spotify">${this.player?.type==='spotify'&&this.player.id===item.id?`<iframe title="Spotify — ${html(item.title)}" src="https://open.spotify.com/embed/album/${html(item.spotifyId)}?utm_source=generator&theme=0" width="100%" height="352" loading="lazy" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>`:`<button type="button" class="mv559-primary" data-play-release="${html(item.id)}">${html(c.listen)}</button>`}</div>
      <div class="mv559-actions">${this.player?.type==='spotify'&&this.player.id===item.id?`<button type="button" data-close-player>${html(c.close)}</button>`:''}<a href="${html(item.spotifyUrl)}" target="_blank" rel="noopener noreferrer">${html(c.spotify)}</a><button type="button" data-share-media="${html(item.title)}">${html(c.share)}</button></div>
    </article>`;
  }

  renderVideos() {
    const root=this.roots.videos;
    if(!root)return;
    const c=this.copy;
    root.innerHTML=`<section class="mv559-world mv559-videos" data-mv559-world="videos"><header class="mv559-hero"><span class="mv559-sigil" aria-hidden="true">▶</span><div><p>${html(c.videoEyebrow)}</p><h3>${html(c.videoTitle)}</h3><span>${html(c.videoLead)}</span></div></header>
      <dl class="mv559-stats"><div><dt>${this.episodes.length}</dt><dd>${html(c.published)}</dd></div><div><dt>0</dt><dd>${html(c.invented)}</dd></div><div><dt>${html(c.none)}</dt><dd>autoplay</dd></div></dl>
      ${this.loading?`<p class="mv559-notice" role="status">${html(c.loading)}</p>`:''}${this.feedError?`<p class="mv559-notice">${html(c.error)}</p>`:''}
      ${this.episodes.length?`<div class="mv559-video-tools"><label><span>${html(c.search)}</span><input type="search" data-video-search value="${html(this.search)}" autocomplete="off" maxlength="80"></label><div class="mv559-filters" role="group" aria-label="${html(c.seasons)}"><button type="button" data-season-filter="all" aria-pressed="${this.seasonFilter==='all'}">${html(c.allSeasons)}</button>${this.seasons.map(item=>`<button type="button" data-season-filter="${html(item.id)}" aria-pressed="${this.seasonFilter===item.id}">T${item.number}</button>`).join('')}</div></div><div class="mv559-video-layout"><div class="mv559-episodes" data-video-catalog></div><div class="mv559-detail" data-video-detail></div></div>`:this.videoEmpty()}
    </section>`;
    if(this.episodes.length){this.renderVideoCatalog();this.renderVideoDetail();}
  }

  videoEmpty(){const c=this.copy;return `<article class="mv559-empty"><span aria-hidden="true">◇</span><p>${html(c.editorial)}</p><h4>${html(c.preparing)}</h4><strong>0</strong><p>${html(c.preparingLead)}</p><a href="${html(safeHttps(this.config.youtube,YOUTUBE_HOSTS)||'https://www.youtube.com/@divinabruxa33')}" target="_blank" rel="noopener noreferrer">${html(c.youtube)}</a></article>`;}

  filteredEpisodes(){return this.episodes.filter(item=>{if(this.seasonFilter!=='all'&&item.seasonId!==this.seasonFilter)return false;if(!this.search)return true;return `${item.title} ${item.description} ${item.tags.join(' ')}`.toLocaleLowerCase(this.locale).includes(this.search);});}

  renderVideoCatalog(){const slot=this.roots.videos?.querySelector('[data-video-catalog]');if(!slot)return;const list=this.filteredEpisodes();slot.innerHTML=list.length?list.map(item=>{const season=this.seasons.find(value=>value.id===item.seasonId);return `<button type="button" class="mv559-episode-card${item.id===this.activeEpisode?' is-active':''}" data-episode-id="${html(item.id)}"><span class="mv559-video-art">${item.thumbnailUrl?`<img src="${html(item.thumbnailUrl)}" alt="${html(item.altText)}" loading="lazy" decoding="async">`:'<i aria-hidden="true">▶</i>'}</span><span><small>T${season?.number||1}:E${item.number}</small><strong>${html(item.title)}</strong><em>${html(formatDate(item.episodeDate||item.publishedAt,this.locale))}</em></span></button>`;}).join(''):`<p class="mv559-notice">${html(this.copy.noResults)}</p>`;}

  renderVideoDetail(){const slot=this.roots.videos?.querySelector('[data-video-detail]');if(!slot)return;const list=this.filteredEpisodes();const item=list.find(value=>value.id===this.activeEpisode)||list[0];if(!item){slot.innerHTML='';return;}this.activeEpisode=item.id;const season=this.seasons.find(value=>value.id===item.seasonId);const index=list.findIndex(value=>value.id===item.id), cards=this.cards.get(item.id)||[];slot.innerHTML=`<article class="mv559-episode-detail"><p class="mv559-kicker">${html(this.copy.season)} ${season?.number||1} · ${html(this.copy.episode)} ${item.number}</p><h4>${html(item.title)}</h4>${item.description?`<p>${html(item.description)}</p>`:''}${item.tags.length?`<div class="mv559-tags">${item.tags.map(tag=>`<span>${html(tag)}</span>`).join('')}</div>`:''}
      <div class="mv559-player-slot" data-player-slot="youtube">${this.player?.type==='youtube'&&this.player.id===item.id?`<iframe title="${html(item.title)}" src="${html(item.embedUrl)}" width="560" height="315" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:`<button type="button" class="mv559-video-poster" data-play-episode="${html(item.id)}">${item.thumbnailUrl?`<img src="${html(item.thumbnailUrl)}" alt="${html(item.altText)}">`:''}<span>▶</span><b>${html(this.copy.watch)}</b></button>`}</div>
      <div class="mv559-actions">${this.player?.type==='youtube'&&this.player.id===item.id?`<button type="button" data-close-player>${html(this.copy.closeVideo)}</button>`:''}<a href="${html(item.videoUrl)}" target="_blank" rel="noopener noreferrer">${html(this.copy.youtubeOpen)}</a><button type="button" data-share-media="${html(item.title)}">${html(this.copy.share)}</button></div>
      ${cards.length?`<section class="mv559-related"><h5>${html(this.copy.related)}</h5><div>${cards.map(card=>`<a href="cartas-do-tarot.html#carta-${card+1}">${html(this.copy.card)} ${String(card+1).padStart(2,'0')}</a>`).join('')}</div></section>`:''}
      <nav class="mv559-episode-nav">${index>0?`<button type="button" data-episode-id="${html(list[index-1].id)}">← ${html(this.copy.previous)}</button>`:'<span></span>'}${index<list.length-1?`<button type="button" data-episode-id="${html(list[index+1].id)}">${html(this.copy.next)} →</button>`:'<span></span>'}</nav></article>`;}

  onClick(event){const button=event.target.closest('button');if(!button)return;if(button.dataset.releaseFilter){this.albumFilter=button.dataset.releaseFilter;const visible=this.releases.filter(item=>this.albumFilter==='all'||item.releaseType===this.albumFilter);if(!visible.some(item=>item.id===this.activeRelease)){this.unloadPlayer(false);this.activeRelease=visible[0]?.id||'';}this.renderMusic();return;}if(button.dataset.releaseId){this.unloadPlayer(false);this.activeRelease=button.dataset.releaseId;this.renderMusic();return;}if(button.dataset.playRelease){this.player={type:'spotify',id:button.dataset.playRelease};this.emit('player_open','music');this.renderMusic();return;}if(button.dataset.seasonFilter){this.unloadPlayer(false);this.seasonFilter=button.dataset.seasonFilter;this.activeEpisode=this.filteredEpisodes()[0]?.id||'';this.renderVideos();return;}if(button.dataset.episodeId){this.unloadPlayer(false);this.activeEpisode=button.dataset.episodeId;this.renderVideoCatalog();this.renderVideoDetail();return;}if(button.dataset.playEpisode){this.player={type:'youtube',id:button.dataset.playEpisode};this.emit('player_open','videos');this.renderVideoDetail();return;}if(button.hasAttribute('data-close-player')){this.unloadPlayer();return;}if(button.dataset.shareMedia){this.share(button.dataset.shareMedia);}}

  emit(action,world){document.dispatchEvent(new CustomEvent('divina:editorial-metric',{detail:Object.freeze({release:MEDIA_SUPREME_RELEASE_V559,action:clean(action,32),world:clean(world,16),privateData:false})}));}
  async share(title){const data={title:clean(title,160),url:location.href};try{if(navigator.share){await navigator.share(data);}else{await navigator.clipboard.writeText(data.url);this.toast(this.copy.copied);}this.emit('share',this.player?.type==='youtube'?'videos':'music');}catch(error){if(error?.name!=='AbortError')this.toast(this.copy.shareUnavailable);}}
  toast(message){document.dispatchEvent(new CustomEvent('divina:toast',{detail:{message}}));const live=this.roots.music?.querySelector('[data-mv559-world]')||this.roots.videos?.querySelector('[data-mv559-world]');if(live){live.setAttribute('data-live-message',message);setTimeout(()=>live.removeAttribute('data-live-message'),1800);}}
  unloadPlayer(render=true){if(!this.player)return;this.player=null;this.roots.music?.querySelectorAll('iframe').forEach(frame=>frame.remove());this.roots.videos?.querySelectorAll('iframe').forEach(frame=>frame.remove());if(render){this.renderMusic();this.renderVideoDetail();}}
  destroy(){this.unloadPlayer(false);this.abort.abort();}
  status(){return Object.freeze({release:MEDIA_SUPREME_RELEASE_V559,macroStage:'11-of-14',albums:this.releases.length,tracks:this.tracks.length,seasons:this.seasons.length,episodes:this.episodes.length,inventedEpisodes:0,autoplay:false,activePlayers:this.player?1:0,privateReads:0,permanentAnimationLoops:0});}
}

export function createMusicVideoSupremeV559(roots,config,options){return new MusicVideoSupremeV559(roots,config,options);}
