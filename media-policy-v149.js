/* DIVINA BRUXA V149 — POLÍTICA EDITORIAL DE MÚSICA E VÍDEO */

const SPOTIFY_ID=/^[a-z0-9]{12,40}$/i;
const HTTPS_HOSTS=Object.freeze(new Set([
  'open.spotify.com',
  'spotify.com',
  'www.spotify.com',
  'youtube.com',
  'www.youtube.com',
  'youtu.be'
]));

export const MEDIA_POLICY_V149=Object.freeze({
  version:'v149',
  environment:'editorial-staging',
  artist:'Hércules DX',
  youtubeChannel:'https://www.youtube.com/@divinabruxa33',
  heroImage:'midia-celestial-estudio-v1.webp',
  statuses:Object.freeze(['rascunho','publicado']),
  publishOnlyWhenExplicit:true,
  futurePublishingHidden:true,
  externalPlayers:true,
  storesListeningHistory:false,
  noInventedEpisodes:true
});

export const safeMediaURL=value=>{
  try{
    const url=new URL(String(value||''));
    return url.protocol==='https:'&&HTTPS_HOSTS.has(url.hostname)?url.href:'';
  }catch{return '';}
};

export const safeSpotifyAlbumId=value=>SPOTIFY_ID.test(String(value||'').trim())?String(value).trim():'';

export const publishedMediaItems=(items=[],now=new Date())=>items.filter(item=>{
  if(item?.status!=='publicado'||!safeMediaURL(item?.url))return false;
  if(!item.publishAt)return true;
  const publication=new Date(item.publishAt);
  return !Number.isNaN(publication.getTime())&&publication<=now;
});
