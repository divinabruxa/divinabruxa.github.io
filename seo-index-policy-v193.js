/* DIVINA BRUXA — POLÍTICA DE INDEXAÇÃO V193
   Áreas privadas recebem noindex; páginas públicas permanecem rastreáveis. */

const PUBLIC_DIRECTIVES = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const PRIVATE_DIRECTIVES = 'noindex,nofollow,noarchive';

const privateTokens = Object.freeze([
  'admin', 'painel', 'central',
  'login', 'conta', 'entrar',
  'ai', 'orbe-ia',
  'journal', 'diario', 'diario-da-orbe',
  'subscriptions', 'premium', 'assinatura', 'checkout',
  'skins', 'constelacao', 'skins-da-orbe',
  'notifications', 'notificacoes'
]);

export const SEO_INDEX_POLICY_V193 = Object.freeze({
  version: 'V193',
  publicDirectives: PUBLIC_DIRECTIVES,
  privateDirectives: PRIVATE_DIRECTIVES,
  privateTokens,
  privacyIsEnforcedByAuthentication: true,
  robotsTxtIsNotAccessControl: true
});

const normalize = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/^#|^\/+|\/+$/g, '')
  .split(/[/?#&=]+/)
  .filter(Boolean);

export function routeNeedsNoindexV193(locationLike = globalThis.location) {
  const tokens = new Set([
    ...normalize(locationLike?.pathname),
    ...normalize(locationLike?.hash),
    ...normalize(locationLike?.search)
  ]);
  return privateTokens.some(token => tokens.has(token));
}

export function applyIndexPolicyV193(
  locationLike = globalThis.location,
  documentLike = globalThis.document
) {
  if (!documentLike?.head) return Object.freeze({ private: false, directives: '' });
  let meta = documentLike.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = documentLike.createElement('meta');
    meta.name = 'robots';
    documentLike.head.append(meta);
  }
  const isPrivate = routeNeedsNoindexV193(locationLike);
  const directives = isPrivate ? PRIVATE_DIRECTIVES : PUBLIC_DIRECTIVES;
  meta.content = directives;
  documentLike.documentElement.dataset.indexPolicy = isPrivate ? 'private-v193' : 'public-v193';
  return Object.freeze({ private: isPrivate, directives });
}

export function installIndexPolicyV193() {
  const apply = () => applyIndexPolicyV193();
  apply();
  globalThis.addEventListener?.('hashchange', apply);
  globalThis.addEventListener?.('popstate', apply);
  return Object.freeze({ version: 'V193', refresh: apply });
}
