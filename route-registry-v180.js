/* DIVINA BRUXA — REGISTRO SOBERANO DE ROTAS V180
   Uma única fonte de verdade para destinos, nomes, aliases e carga visual. */

const definitions = [
  { id: 'home', label: 'o Início', module: false, portalStyles: false, aliases: ['inicio'] },
  { id: 'tarot', label: 'o Tarot Livre', module: true, portalStyles: false, aliases: ['tarot-livre'] },
  { id: 'daily', label: 'a Carta do Dia', module: true, portalStyles: false, aliases: ['carta-do-dia'] },
  { id: 'library', label: 'a Biblioteca das 78 Cartas', module: true, portalStyles: true, aliases: ['biblioteca', 'biblioteca-78-cartas'] },
  { id: 'school', label: 'a Escola do Tarot', module: true, portalStyles: true, aliases: ['escola', 'escola-do-tarot'] },
  { id: 'spreads', label: 'o Templo das Tiragens', module: true, portalStyles: true, aliases: ['tiragens', 'tiragens-de-tarot'] },
  { id: 'ai', label: 'a Orbe IA', module: true, portalStyles: true, aliases: ['orbe-ia'] },
  { id: 'journal', label: 'o Diário da Orbe', module: true, portalStyles: true, aliases: ['diario', 'diario-da-orbe'] },
  { id: 'store', label: 'a Loja Mística', module: true, portalStyles: true, aliases: ['loja', 'loja-mistica'] },
  { id: 'consultations', label: 'as Consultas', module: true, portalStyles: true, aliases: ['consultas'] },
  { id: 'subscriptions', label: 'o universo Premium', module: true, portalStyles: true, aliases: ['premium', 'assinatura'] },
  { id: 'skins', label: 'a Constelação das 30 Skins', module: true, portalStyles: true, aliases: ['constelacao', 'skins-da-orbe'] },
  { id: 'videos', label: 'De Frente com o Tarot', module: true, portalStyles: true, aliases: ['video', 'de-frente-com-o-tarot'] },
  { id: 'music', label: 'o universo da Música', module: true, portalStyles: true, aliases: ['musica'] },
  { id: 'notifications', label: 'as Notificações Celestiais', module: true, portalStyles: true, aliases: ['notificacoes'] },
  { id: 'login', label: 'a Conta', module: false, portalStyles: false, aliases: ['conta', 'entrar'] },
  { id: 'admin', label: 'a Central da Proprietária', module: true, portalStyles: true, aliases: ['painel', 'central'] }
];

export const ROUTES_V180 = Object.freeze(definitions.map(route => Object.freeze({
  ...route,
  aliases: Object.freeze([...route.aliases])
})));

const routesById = new Map(ROUTES_V180.map(route => [route.id, route]));
const aliases = new Map();
ROUTES_V180.forEach(route => route.aliases.forEach(alias => aliases.set(alias, route.id)));

const routeToken = value => {
  const input = String(value || '').trim().replace(/^#/, '').replace(/^\/+|\/+$/g, '');
  try {
    return decodeURIComponent(input).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  } catch {
    return input.toLowerCase();
  }
};

export function normalizeRouteId(value, fallback = 'home') {
  const token = routeToken(value);
  if (routesById.has(token)) return token;
  if (aliases.has(token)) return aliases.get(token);
  return routesById.has(fallback) ? fallback : 'home';
}

export function routeFromLocation(locationLike = globalThis.location) {
  return normalizeRouteId(locationLike?.hash?.slice(1) || 'home');
}

export function routeDefinition(value) {
  return routesById.get(normalizeRouteId(value)) || routesById.get('home');
}

export function routeLabel(value) {
  return routeDefinition(value).label;
}

export function routeNeedsPortalStyles(value) {
  return routeDefinition(value).portalStyles === true;
}

export function routeHasModule(value) {
  return routeDefinition(value).module === true;
}

export function isKnownRoute(value) {
  const token = routeToken(value);
  return routesById.has(token) || aliases.has(token);
}
