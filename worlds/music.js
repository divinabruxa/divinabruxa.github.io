import { MUSIC_RELEASES, SPOTIFY_ARTIST } from '../data/media.js';

export function createMusicWorld({ announce }) {
  const releases = document.querySelector('#musicReleases');
  const player = document.querySelector('#musicPlayer');
  let active = '';
  let ready = false;

  function renderReleases() {
    releases.replaceChildren(...MUSIC_RELEASES.map(release => {
      const article = document.createElement('article');
      article.className = `music-release${release.id === active ? ' is-active' : ''}`;
      article.innerHTML = `
        <span aria-hidden="true">${release.mark}</span>
        <div><small>ÁLBUM · ${release.year} · ${release.tracks} FAIXAS</small><h2>${release.title}</h2><p>${release.description}</p><b>${release.artist}</b></div>
        <button type="button" data-album="${release.id}" aria-pressed="${release.id === active}">${release.id === active ? 'PLAYER ABERTO' : 'OUVIR NO SPOTIFY'}</button>`;
      return article;
    }));
  }

  function open(release) {
    active = release.id;
    renderReleases();
    player.replaceChildren();
    const top = document.createElement('div');
    top.className = 'music-player__top';
    top.innerHTML = `<p><small>TOCANDO SOMENTE POR SUA ESCOLHA</small><b>${release.title}</b></p><button type="button" id="closeMusicPlayer">Fechar player</button>`;
    const frame = document.createElement('iframe');
    frame.title = `Spotify — ${release.title}`;
    frame.src = `https://open.spotify.com/embed/album/${release.id}?utm_source=generator&theme=0`;
    frame.width = '100%';
    frame.height = '352';
    frame.loading = 'lazy';
    frame.allow = 'clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.append(top, frame);
    top.querySelector('button').addEventListener('click', close);
    announce(`Player oficial de ${release.title} aberto.`);
  }

  function close() {
    active = '';
    renderReleases();
    player.innerHTML = `<p>O player foi fechado e o áudio interrompido.</p><a href="${SPOTIFY_ARTIST}" target="_blank" rel="noopener noreferrer">VER HÉRCULES DX NO SPOTIFY ↗</a>`;
    announce('Player fechado.');
  }

  function activate() {
    if (ready) return;
    ready = true;
    renderReleases();
    releases.addEventListener('click', event => {
      const button = event.target.closest('[data-album]');
      if (!button) return;
      const release = MUSIC_RELEASES.find(item => item.id === button.dataset.album);
      if (release) open(release);
    });
  }

  return { activate, deactivate:close };
}
