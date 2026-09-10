/* DIVINA BRUXA 2.0 — REBIRTH R001 · MAPA DE MUNDOS V300
   Nome público atual: Whit. Aliases antigos continuam funcionando para não quebrar links. */
const definitions = [
  { id:'home', label:'a Orbe central', module:false, portalStyles:false, aliases:['inicio','orbe'] },
  { id:'tarot', label:'o Tarot Livre', module:true, portalStyles:false, aliases:['tarot-livre'] },
  { id:'daily', label:'a Carta do Dia', module:true, portalStyles:false, aliases:['carta-do-dia'] },
  { id:'library', label:'a Biblioteca', module:true, portalStyles:true, aliases:['biblioteca','biblioteca-78-cartas'] },
  { id:'school', label:'a Escola do Tarot', module:true, portalStyles:true, aliases:['escola','escola-do-tarot'] },
  { id:'spreads', label:'as Tiragens', module:true, portalStyles:true, aliases:['tiragens','tiragens-de-tarot'] },
  { id:'ai', label:'Whit', module:true, portalStyles:true, aliases:['whit','orbe-ia'] },
  { id:'journal', label:'o Diário e Espelho', module:true, portalStyles:true, aliases:['diario','diario-da-orbe','espelho'] },
  { id:'store', label:'a Loja Mística', module:true, portalStyles:true, aliases:['loja','loja-mistica'] },
  { id:'consultations', label:'as Consultas', module:true, portalStyles:true, aliases:['consultas'] },
  { id:'subscriptions', label:'Premium', module:true, portalStyles:true, aliases:['premium','assinatura'] },
  { id:'skins', label:'as Skins', module:true, portalStyles:true, aliases:['constelacao','skins-da-orbe'] },
  { id:'videos', label:'os Vídeos', module:true, portalStyles:true, aliases:['video','de-frente-com-o-tarot'] },
  { id:'music', label:'a Música', module:true, portalStyles:true, aliases:['musica'] },
  { id:'notifications', label:'as Notificações', module:true, portalStyles:true, aliases:['notificacoes'] },
  { id:'login', label:'a Conta', module:false, portalStyles:false, aliases:['conta','entrar'] },
  { id:'admin', label:'a Central da Proprietária', module:true, portalStyles:true, aliases:['painel','central'] }
];
export const ROUTES_V180 = Object.freeze(definitions.map(route => Object.freeze({ ...route, aliases:Object.freeze([...route.aliases]) })));
const routesById = new Map(ROUTES_V180.map(route => [route.id, route]));
const aliases = new Map(); ROUTES_V180.forEach(route => route.aliases.forEach(alias => aliases.set(alias, route.id)));
const routeToken = value => { const input=String(value||'').trim().replace(/^#/,'').replace(/^\/+|\/+$/g,''); try{return decodeURIComponent(input).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}catch{return input.toLowerCase()} };
export function normalizeRouteId(value,fallback='home'){const token=routeToken(value);if(routesById.has(token))return token;if(aliases.has(token))return aliases.get(token);return routesById.has(fallback)?fallback:'home'}
export function routeFromLocation(locationLike=globalThis.location){return normalizeRouteId(locationLike?.hash?.slice(1)||'home')}
export function routeDefinition(value){return routesById.get(normalizeRouteId(value))||routesById.get('home')}
export function routeLabel(value){return routeDefinition(value).label}
export function routeNeedsPortalStyles(value){return routeDefinition(value).portalStyles===true}
export function routeHasModule(value){return routeDefinition(value).module===true}
export function isKnownRoute(value){const token=routeToken(value);return routesById.has(token)||aliases.has(token)}
