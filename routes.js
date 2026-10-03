import { WORLDS } from './data/worlds.js';

// Public guides published before the current router keep their working links.
const ALIASES = Object.freeze({
  daily:'carta-do-dia', spreads:'tiragens', school:'escola',
  consultations:'consultas', journal:'diario', library:'biblioteca',
  music:'musica', store:'loja', account:'conta'
});

export function normalizedRoute(value = '') {
  const raw = String(value).replace(/^#\/?/, '').replace(/^\//, '').trim() || 'home';
  const route = ALIASES[raw] || raw;
  return WORLDS[route] ? route : 'home';
}
