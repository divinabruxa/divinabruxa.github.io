/* DIVINA BRUXA V192 — ORBE SONORA + DE FRENTE COM O TAROT */
import { escapeHTML } from './storage.js';
import {
  MEDIA_POLICY_V192,
  publishedMediaItemsV192,
  safeMediaURLV192,
  safeSpotifyAlbumIdV192,
  safeTranscriptURLV192
} from './media-policy-v192.js?v=192';

const formatDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day:'2-digit',month:'short',year:'numeric',timeZone:'America/Sao_Paulo'
  }).format(date).replaceAll('.', '');
};

export class MediaEngineV192 {
  constructor(roots, config = {}) {
    this.roots = roots || {};
    this.config = config || {};
    this.activeAlbumId = '';
    this.playerLoaded = false;
    this.renderMusic();
    this.renderVideos();
  }

  albums() {
    return (this.config.spotifyAlbums || []).map((album, index) => ({
      ...album,
      id: safeSpotifyAlbumIdV192(album?.id),
      artist: String(album?.artist || MEDIA_POLICY_V192.artist).trim(),
      name: String(album?.name || `Álbum ${index + 1}`).trim(),
      url: safeMediaURLV192(album?.url || `https://open.spotify.com/album/${album?.id || ''}`)
    })).filter(album => album.id && album.url && album.status === 'published');
  }

  episodes() {
    return publishedMediaItemsV192(this.config.youtubeVideos || []).filter(episode => (
      String(episode?.title || '').trim()
      && String(episode?.description || '').trim()
      && String(episode?.accessibilityText || '').trim()
      && (episode?.captions === true || safeTranscriptURLV192(episode?.transcriptUrl))
    ));
  }

  renderMusic() {
    const root = this.roots.music;
    if (!root) return;
    const albums = this.albums();
    if (!this.activeAlbumId || !albums.some(album => album.id === this.activeAlbumId)) {
      this.activeAlbumId = albums[0]?.id || '';
      this.playerLoaded = false;
    }
    root.innerHTML = `<div class="media-v149-shell media-v149-music media-v192-shell" data-media-v192="music">
      <section class="media-v149-hero media-v149-music-hero" aria-labelledby="media-v192-music-title">
        <figure>
          <img src="${MEDIA_POLICY_V192.heroImage}" width="1600" height="900" alt="Estúdio celestial com microfone, fones, disco, câmera, cartas e uma Orbe" decoding="async">
          <figcaption>Arte editorial original · Orbe Sonora</figcaption>
        </figure>
        <div class="media-v149-hero-copy">
          <p class="eyebrow">HÉRCULES DX · CATÁLOGO OFICIAL</p>
          <h3 id="media-v192-music-title">Dois álbuns. Dois universos inteiros.</h3>
          <p>A obra musical entra com contexto, crédito e destino oficial. O player do Spotify só é carregado quando você pedir.</p>
          <div class="media-v149-hero-metrics" aria-label="Catálogo musical"><span><b>${albums.length}</b><small>álbuns publicados</small></span><span><b>0</b><small>player antes do seu toque</small></span></div>
          <a class="media-v149-primary" href="musica.html" data-editorial-target="music_guide">CONHECER A DISCOGRAFIA <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="media-v149-library" aria-labelledby="media-v192-albums-title">
        <header class="media-v149-heading"><div><p class="eyebrow">ORBE SONORA</p><h3 id="media-v192-albums-title">Escolha uma obra completa.</h3></div><p>As datas identificam o lançamento; a reprodução e os dados do player pertencem ao Spotify.</p></header>
        ${albums.length ? `<div class="media-v149-album-layout">
          <div class="media-v149-album-tabs" role="tablist" aria-label="Álbuns publicados de Hércules DX">${albums.map((album, index) => this.albumTab(album, index)).join('')}</div>
          <div class="media-v149-player media-v192-player" data-album-player aria-live="polite"></div>
        </div>` : this.emptyMusicMarkup()}
      </section>

      <aside class="media-v149-privacy"><span aria-hidden="true">◇</span><p><strong>Escuta sob seu comando.</strong> Nenhum iframe do Spotify é criado até você escolher “Carregar player”. O link oficial continua disponível como alternativa.</p></aside>
    </div>`;
    this.renderAlbumPlayer();
    this.bindMusic();
    root.dataset.mediaReady = 'v192';
  }

  albumTab(album, index) {
    const active = album.id === this.activeAlbumId;
    return `<button type="button" role="tab" id="album-tab-${escapeHTML(album.id)}" aria-selected="${active}" aria-controls="album-player-panel" tabindex="${active ? '0' : '-1'}" class="${active ? 'is-active' : ''}" data-album="${escapeHTML(album.id)}"><span class="media-v149-album-number">${String(index + 1).padStart(2, '0')}</span><span class="media-v149-album-sigil" aria-hidden="true">${index % 2 ? '✦' : '☾'}</span><span><small>${escapeHTML(album.artist)} · ${escapeHTML(album.releaseYear || '')}</small><b>${escapeHTML(album.name)}</b></span><i aria-hidden="true">→</i></button>`;
  }

  renderAlbumPlayer() {
    const root = this.roots.music;
    const player = root?.querySelector('[data-album-player]');
    const albums = this.albums();
    const album = albums.find(item => item.id === this.activeAlbumId) || albums[0];
    if (!player || !album) return;
    player.id = 'album-player-panel';
    player.tabIndex = -1;
    player.setAttribute('role', 'tabpanel');
    player.setAttribute('aria-labelledby', `album-tab-${album.id}`);
    const identity = `<div class="media-v149-player-identity"><span class="media-v149-disc" aria-hidden="true"><i></i></span><div><p>${escapeHTML(album.artist)}</p><h4>${escapeHTML(album.name)}</h4><small>Álbum publicado em ${escapeHTML(album.releaseYear || 'data identificada no serviço')}</small></div></div>`;
    const context = `<div class="media-v192-album-context"><p>${escapeHTML(album.context || 'Obra autoral disponível no catálogo oficial.')}</p><small>${escapeHTML(album.credits || `Catálogo oficial de ${album.artist}.`)}</small></div>`;
    if (!this.playerLoaded) {
      player.innerHTML = `${identity}${context}<div class="media-v192-player-gate"><span aria-hidden="true">♫</span><p>O conteúdo externo ainda não foi carregado.</p><button type="button" data-load-spotify data-editorial-target="spotify_album">CARREGAR PLAYER DO SPOTIFY</button></div><a href="${escapeHTML(album.url)}" data-editorial-target="spotify_album" target="_blank" rel="noopener noreferrer">ABRIR ÁLBUM NO SPOTIFY <span aria-hidden="true">↗</span></a>`;
      this.bindPlayerGate();
      return;
    }
    player.innerHTML = `${identity}${context}<div class="media-v149-wave" aria-hidden="true">${Array.from({length:18}, (_, index) => `<i style="--wave:${(index % 7) + 2}"></i>`).join('')}</div><iframe title="Ouvir ${escapeHTML(album.name)} de ${escapeHTML(album.artist)} no Spotify" src="https://open.spotify.com/embed/album/${encodeURIComponent(album.id)}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe><a href="${escapeHTML(album.url)}" data-editorial-target="spotify_album" target="_blank" rel="noopener noreferrer">ABRIR ÁLBUM NO SPOTIFY <span aria-hidden="true">↗</span></a>`;
  }

  bindPlayerGate() {
    this.roots.music?.querySelector('[data-load-spotify]')?.addEventListener('click', () => {
      this.playerLoaded = true;
      this.renderAlbumPlayer();
      this.roots.music?.querySelector('[data-album-player]')?.focus({preventScroll:true});
    }, {once:true});
  }

  bindMusic() {
    const root = this.roots.music;
    root?.querySelectorAll('[data-album]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.album === this.activeAlbumId) return;
      this.activeAlbumId = button.dataset.album;
      this.playerLoaded = false;
      root.querySelectorAll('[data-album]').forEach(tab => {
        const active = tab.dataset.album === this.activeAlbumId;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      this.renderAlbumPlayer();
      root.querySelector('[data-album-player]')?.focus({preventScroll:true});
    }));
    root?.querySelector('.media-v149-album-tabs')?.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
      const tabs = [...root.querySelectorAll('[data-album]')];
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const direction = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
      const next = tabs[(current + direction + tabs.length) % tabs.length];
      next?.click();
      next?.focus();
    });
  }

  emptyMusicMarkup() {
    return `<div class="media-v149-empty"><span aria-hidden="true">♫</span><h4>O catálogo está sendo preparado.</h4><p>Somente um álbum publicado em um destino oficial pode aparecer aqui.</p></div>`;
  }

  renderVideos() {
    const root = this.roots.videos;
    if (!root) return;
    const episodes = this.episodes();
    root.innerHTML = `<div class="media-v149-shell media-v149-videos media-v192-shell" data-media-v192="videos">
      <section class="media-v149-hero media-v149-video-hero" aria-labelledby="media-v192-video-title">
        <figure>
          <img src="${MEDIA_POLICY_V192.heroImage}" width="1600" height="900" alt="Estúdio celestial de vídeo com câmera, mesa de Tarot e uma Orbe luminosa" decoding="async">
          <figcaption>Arte editorial original · De Frente com o Tarot</figcaption>
        </figure>
        <div class="media-v149-hero-copy">
          <p class="eyebrow">SÉRIE EDITORIAL · DIVINA BRUXA</p>
          <h3 id="media-v192-video-title">De Frente com o Tarot.</h3>
          <p>Uma série para conversas cuidadosas sobre símbolos e prática. O piloto está em preparação; nenhum episódio inexistente é apresentado como publicado.</p>
          <div class="media-v149-hero-metrics" aria-label="Arquivo de vídeos"><span><b>${episodes.length}</b><small>${episodes.length === 1 ? 'episódio publicado' : 'episódios publicados'}</small></span><span><b>✓</b><small>verdade editorial</small></span></div>
          <a class="media-v149-primary" href="de-frente-com-o-tarot.html" data-editorial-target="video_guide">CONHECER O PROJETO <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <aside class="media-v149-editorial-rule"><span aria-hidden="true">✦</span><div><strong>ARQUIVO VIVO</strong><p>Publicação exige URL oficial, revisão, descrição e recurso de acessibilidade. Rascunhos e datas futuras continuam ocultos.</p></div><small>${episodes.length} no ar</small></aside>

      <section class="media-v149-episodes" aria-labelledby="media-v192-episodes-title">
        <header class="media-v149-heading"><div><p class="eyebrow">CAPÍTULOS PUBLICADOS</p><h3 id="media-v192-episodes-title">Encontros para assistir.</h3></div><p>Quando existir um episódio público, ele abrirá no destino oficial com contexto e apoio textual.</p></header>
        ${episodes.length ? `<div class="media-v149-episode-grid">${episodes.map((episode, index) => this.episodeCard(episode, index)).join('')}</div>` : this.emptyVideosMarkup()}
      </section>
    </div>`;
    root.dataset.mediaReady = 'v192';
  }

  episodeCard(episode, index) {
    const date = formatDate(episode.publishAt || episode.publishedAt);
    const transcript = safeTranscriptURLV192(episode.transcriptUrl);
    return `<article class="media-v149-episode"><div class="media-v149-episode-art" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><i>▶</i><small>DE FRENTE</small></div><div><p class="eyebrow">${escapeHTML(episode.season || 'DE FRENTE COM O TAROT')}</p><h4>${escapeHTML(episode.title)}</h4><p>${escapeHTML(episode.description)}</p><small class="media-v192-accessibility">${escapeHTML(episode.accessibilityText)}</small>${date ? `<small class="media-v149-date">Publicado em ${escapeHTML(date)}</small>` : ''}<a href="${escapeHTML(safeMediaURLV192(episode.url))}" data-editorial-target="youtube_channel" target="_blank" rel="noopener noreferrer">ASSISTIR NO YOUTUBE <span aria-hidden="true">↗</span></a>${transcript ? `<a href="${escapeHTML(transcript)}">LER TRANSCRIÇÃO</a>` : ''}</div></article>`;
  }

  emptyVideosMarkup() {
    return `<div class="media-v149-empty media-v149-video-empty"><span aria-hidden="true">▶</span><h4>Piloto em preparação editorial.</h4><p>Ainda não há episódios públicos. Esta página não mostra capas, títulos ou datas que não tenham sido confirmados.</p><a href="${escapeHTML(MEDIA_POLICY_V192.youtubeChannel)}" data-editorial-target="youtube_channel" target="_blank" rel="noopener noreferrer">CONHECER O CANAL INFORMADO <span aria-hidden="true">↗</span></a><small>A abertura do canal não significa que exista um episódio desta série publicado.</small></div>`;
  }
}
