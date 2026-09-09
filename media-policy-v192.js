/* DIVINA BRUXA V192 — VERDADE EDITORIAL PARA MÚSICA E VÍDEO */

const SPOTIFY_ID = /^[a-z0-9]{12,40}$/i;
const HTTPS_HOSTS = Object.freeze(new Set([
  'open.spotify.com',
  'spotify.com',
  'www.spotify.com',
  'youtube.com',
  'www.youtube.com',
  'youtu.be'
]));

export const MEDIA_POLICY_V192 = Object.freeze({
  version: 'V192',
  environment: 'editorial-staging',
  reviewedAt: '2026-09-09',
  artist: 'Hércules DX',
  youtubeChannel: 'https://www.youtube.com/@divinabruxa33',
  heroImage: 'midia-celestial-estudio-v1.webp',
  publicStatuses: Object.freeze(['published','publicado']),
  publishOnlyWhenExplicit: true,
  futurePublishingHidden: true,
  externalPlayers: true,
  storesListeningHistory: false,
  inventedEpisodes: false,
  transcriptRequiredForEpisode: true,
  fallbackRequired: true
});

export const safeMediaURLV192 = value => {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && HTTPS_HOSTS.has(url.hostname) ? url.href : '';
  } catch {
    return '';
  }
};

export const safeSpotifyAlbumIdV192 = value => SPOTIFY_ID.test(String(value || '').trim())
  ? String(value).trim()
  : '';

export const safeTranscriptURLV192 = value => {
  try {
    const url = new URL(String(value || ''), 'https://divinabruxa.com.br/');
    const officialHost = url.hostname === 'divinabruxa.com.br' || url.hostname === 'www.divinabruxa.com.br';
    return url.protocol === 'https:' && officialHost && /\.html$/i.test(url.pathname) ? url.href : '';
  } catch {
    return '';
  }
};

export const publishedMediaItemsV192 = (items = [], now = new Date()) => items.filter(item => {
  if (!MEDIA_POLICY_V192.publicStatuses.includes(item?.status) || !safeMediaURLV192(item?.url)) return false;
  if (!item.publishAt) return true;
  const publication = new Date(item.publishAt);
  return !Number.isNaN(publication.getTime()) && publication <= now;
});
