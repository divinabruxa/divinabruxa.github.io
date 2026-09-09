/* DIVINA BRUXA V192 — CATÁLOGO EDITORIAL RESTAURADO PELA V197 */
import { CONFIG } from './config.js';

const freezeEntries = entries => Object.freeze(entries.map(entry => Object.freeze({ ...entry })));

export const STORE_PRODUCTS_V192 = freezeEntries(CONFIG.products || []);
export const MUSIC_ALBUMS_V192 = freezeEntries(CONFIG.spotifyAlbums || []);
export const VIDEO_EPISODES_V192 = freezeEntries(
  (CONFIG.youtubeVideos || []).filter(item => item?.status === 'publicado')
);

export const EDITORIAL_RELEASE_V192 = Object.freeze({
  version: 192,
  environment: 'editorial-staging',
  productionPublished: false,
  externalWrites: false,
  storeProducts: STORE_PRODUCTS_V192.length,
  musicAlbums: MUSIC_ALBUMS_V192.length,
  publishedVideoEpisodes: VIDEO_EPISODES_V192.length
});
