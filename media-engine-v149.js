/* DIVINA BRUXA V149 — ORBE SONORA + DE FRENTE COM O TAROT */
import { escapeHTML } from './storage.js';
import { MEDIA_POLICY_V149, publishedMediaItems, safeMediaURL, safeSpotifyAlbumId } from './media-policy-v149.js?v=149';

const formatDate=value=>{
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric',timeZone:'America/Sao_Paulo'}).format(date).replaceAll('.','');
};

export class MediaEngineV149{
  constructor(roots,config={}){
    this.roots=roots||{};
    this.config=config||{};
    this.activeAlbumId='';
    this.renderMusic();
    this.renderVideos();
  }

  albums(){
    return (this.config.spotifyAlbums||[]).map((album,index)=>({
      ...album,
      id:safeSpotifyAlbumId(album?.id),
      artist:String(album?.artist||MEDIA_POLICY_V149.artist).trim(),
      name:String(album?.name||`Álbum ${index+1}`).trim()
    })).filter(album=>album.id);
  }

  episodes(){return publishedMediaItems(this.config.youtubeVideos||[]);}

  renderMusic(){
    const root=this.roots.music;
    if(!root)return;
    const albums=this.albums();
    if(!this.activeAlbumId||!albums.some(album=>album.id===this.activeAlbumId))this.activeAlbumId=albums[0]?.id||'';
    root.innerHTML=`<div class="media-v149-shell media-v149-music" data-media-v149="music">
      <section class="media-v149-hero media-v149-music-hero" aria-labelledby="media-v149-music-title">
        <figure>
          <img src="${MEDIA_POLICY_V149.heroImage}" width="1600" height="900" alt="Estúdio celestial com microfone, fones, disco, câmera, cartas e uma Orbe" decoding="async">
          <figcaption>Arte editorial original · Orbe Sonora</figcaption>
        </figure>
        <div class="media-v149-hero-copy">
          <p class="eyebrow">HÉRCULES DX · MÚSICA AUTORAL</p>
          <h3 id="media-v149-music-title">Canções entre estrelas e realidades.</h3>
          <p>Dois universos sonoros para acompanhar seus rituais, sua escrita e os momentos em que você precisa escutar o que existe por dentro.</p>
          <div class="media-v149-hero-metrics" aria-label="Catálogo musical"><span><b>${albums.length}</b><small>álbuns disponíveis</small></span><span><b>♫</b><small>player oficial</small></span></div>
          ${albums[0]?`<a class="media-v149-primary" href="${escapeHTML(safeMediaURL(`https://open.spotify.com/album/${albums[0].id}`))}" target="_blank" rel="noopener noreferrer">OUVIR NO SPOTIFY <span aria-hidden="true">↗</span></a>`:''}
        </div>
      </section>

      <section class="media-v149-library" aria-labelledby="media-v149-albums-title">
        <header class="media-v149-heading"><div><p class="eyebrow">ORBE SONORA</p><h3 id="media-v149-albums-title">Escolha um universo.</h3></div><p>Um player por vez para manter a página leve e fluida.</p></header>
        ${albums.length?`<div class="media-v149-album-layout">
          <div class="media-v149-album-tabs" role="tablist" aria-label="Álbuns de Hércules DX">${albums.map((album,index)=>this.albumTab(album,index)).join('')}</div>
          <div class="media-v149-player" data-album-player></div>
        </div>`:this.emptyMusicMarkup()}
      </section>

      <aside class="media-v149-privacy"><span aria-hidden="true">◇</span><p><strong>Escuta transparente.</strong> O player e a reprodução são fornecidos pelo Spotify. Ao abrir o serviço, valem também os termos e a privacidade da plataforma.</p></aside>
    </div>`;
    this.renderAlbumPlayer();
    this.bindMusic();
    root.dataset.mediaReady='v149';
  }

  albumTab(album,index){
    const active=album.id===this.activeAlbumId;
    return `<button type="button" role="tab" id="album-tab-${escapeHTML(album.id)}" aria-selected="${active}" aria-controls="album-player-panel" tabindex="${active?'0':'-1'}" class="${active?'is-active':''}" data-album="${escapeHTML(album.id)}"><span class="media-v149-album-number">${String(index+1).padStart(2,'0')}</span><span class="media-v149-album-sigil" aria-hidden="true">${index%2?'✦':'☾'}</span><span><small>${escapeHTML(album.artist)}</small><b>${escapeHTML(album.name)}</b></span><i aria-hidden="true">→</i></button>`;
  }

  renderAlbumPlayer(){
    const root=this.roots.music;
    const player=root?.querySelector('[data-album-player]');
    const albums=this.albums();
    const album=albums.find(item=>item.id===this.activeAlbumId)||albums[0];
    if(!player||!album)return;
    player.id='album-player-panel';
    player.tabIndex=-1;
    player.setAttribute('role','tabpanel');
    player.setAttribute('aria-labelledby',`album-tab-${album.id}`);
    player.innerHTML=`<div class="media-v149-player-identity"><span class="media-v149-disc" aria-hidden="true"><i></i></span><div><p>${escapeHTML(album.artist)}</p><h4>${escapeHTML(album.name)}</h4><small>Álbum no Spotify</small></div></div><div class="media-v149-wave" aria-hidden="true">${Array.from({length:18},(_,index)=>`<i style="--wave:${(index%7)+2}"></i>`).join('')}</div><iframe title="Ouvir ${escapeHTML(album.name)} de ${escapeHTML(album.artist)} no Spotify" src="https://open.spotify.com/embed/album/${encodeURIComponent(album.id)}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe><a href="${escapeHTML(safeMediaURL(`https://open.spotify.com/album/${album.id}`))}" target="_blank" rel="noopener noreferrer">ABRIR ÁLBUM NO SPOTIFY <span aria-hidden="true">↗</span></a>`;
  }

  bindMusic(){
    const root=this.roots.music;
    root?.querySelectorAll('[data-album]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.album===this.activeAlbumId)return;
      this.activeAlbumId=button.dataset.album;
      root.querySelectorAll('[data-album]').forEach(tab=>{
        const active=tab.dataset.album===this.activeAlbumId;
        tab.classList.toggle('is-active',active);
        tab.setAttribute('aria-selected',String(active));
        tab.tabIndex=active?0:-1;
      });
      this.renderAlbumPlayer();
      root.querySelector('[data-album-player]')?.focus({preventScroll:true});
    }));
    root?.querySelector('.media-v149-album-tabs')?.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      const tabs=[...root.querySelectorAll('[data-album]')];
      const current=tabs.indexOf(document.activeElement);
      if(current<0)return;
      event.preventDefault();
      const direction=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
      tabs[(current+direction+tabs.length)%tabs.length]?.click();
      tabs[(current+direction+tabs.length)%tabs.length]?.focus();
    });
  }

  emptyMusicMarkup(){return `<div class="media-v149-empty"><span aria-hidden="true">♫</span><h4>O catálogo está sendo preparado.</h4><p>Quando um álbum oficial estiver disponível, ele aparecerá aqui com o player do Spotify.</p></div>`;}

  renderVideos(){
    const root=this.roots.videos;
    if(!root)return;
    const episodes=this.episodes();
    root.innerHTML=`<div class="media-v149-shell media-v149-videos" data-media-v149="videos">
      <section class="media-v149-hero media-v149-video-hero" aria-labelledby="media-v149-video-title">
        <figure>
          <img src="${MEDIA_POLICY_V149.heroImage}" width="1600" height="900" alt="Estúdio celestial de vídeo com câmera, mesa de Tarot e uma Orbe luminosa" decoding="async">
          <figcaption>Arte editorial original · De Frente com o Tarot</figcaption>
        </figure>
        <div class="media-v149-hero-copy">
          <p class="eyebrow">CANAL OFICIAL · DIVINA BRUXA</p>
          <h3 id="media-v149-video-title">De Frente com o Tarot.</h3>
          <p>Conversas em vídeo para olhar os símbolos sem pressa, atravessar perguntas e encontrar novas perspectivas.</p>
          <div class="media-v149-hero-metrics" aria-label="Arquivo de vídeos"><span><b>${episodes.length}</b><small>${episodes.length===1?'capítulo publicado':'capítulos publicados'}</small></span><span><b>▶</b><small>YouTube oficial</small></span></div>
          <a class="media-v149-primary" href="${escapeHTML(MEDIA_POLICY_V149.youtubeChannel)}" target="_blank" rel="noopener noreferrer">ABRIR CANAL NO YOUTUBE <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <aside class="media-v149-editorial-rule"><span aria-hidden="true">✦</span><div><strong>ARQUIVO VIVO</strong><p>Somente capítulos marcados como publicados aparecem nesta página. Rascunhos e publicações futuras permanecem protegidos.</p></div><small>${episodes.length} no ar</small></aside>

      <section class="media-v149-episodes" aria-labelledby="media-v149-episodes-title">
        <header class="media-v149-heading"><div><p class="eyebrow">CAPÍTULOS</p><h3 id="media-v149-episodes-title">Encontros para assistir.</h3></div><p>Cada episódio abre no canal oficial da Divina Bruxa.</p></header>
        ${episodes.length?`<div class="media-v149-episode-grid">${episodes.map((episode,index)=>this.episodeCard(episode,index)).join('')}</div>`:this.emptyVideosMarkup()}
      </section>
    </div>`;
    root.dataset.mediaReady='v149';
  }

  episodeCard(episode,index){
    const date=formatDate(episode.publishAt||episode.publishedAt);
    return `<article class="media-v149-episode"><div class="media-v149-episode-art" aria-hidden="true"><span>${String(index+1).padStart(2,'0')}</span><i>▶</i><small>DE FRENTE</small></div><div><p class="eyebrow">${escapeHTML(episode.season||'DE FRENTE COM O TAROT')}</p><h4>${escapeHTML(episode.title||'Novo capítulo')}</h4><p>${escapeHTML(episode.description||'Um encontro com os símbolos do Tarot.')}</p>${date?`<small class="media-v149-date">Publicado em ${escapeHTML(date)}</small>`:''}<a href="${escapeHTML(safeMediaURL(episode.url))}" target="_blank" rel="noopener noreferrer">ASSISTIR NO YOUTUBE <span aria-hidden="true">↗</span></a></div></article>`;
  }

  emptyVideosMarkup(){return `<div class="media-v149-empty media-v149-video-empty"><span aria-hidden="true">▶</span><h4>O primeiro capítulo está sendo preparado.</h4><p>Assim que um episódio for publicado no arquivo oficial, ele aparecerá aqui. O canal continua aberto para você.</p><a href="${escapeHTML(MEDIA_POLICY_V149.youtubeChannel)}" target="_blank" rel="noopener noreferrer">CONHECER O CANAL <span aria-hidden="true">↗</span></a></div>`;}
}
