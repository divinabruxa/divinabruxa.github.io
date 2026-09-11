/* DIVINA BRUXA — POLÍTICA DE INDEXAÇÃO V193 · REBIRTH R024 / V323
   Áreas pessoais e operacionais recebem noindex.
   Mundos públicos da SPA apontam canonical para seus portais editoriais estáticos.
   robots.txt nunca é tratado como controle de acesso. */

const PUBLIC_DIRECTIVES='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const PRIVATE_DIRECTIVES='noindex,nofollow,noarchive';

const privateTokens=Object.freeze([
  'admin','painel','central',
  'login','conta','entrar','account',
  'ai','orbe-ia','whit',
  'journal','diario','diario-da-orbe','espelho',
  'subscriptions','premium','assinatura','checkout',
  'skins','constelacao','skins-da-orbe',
  'notifications','notificacoes',
  'consulta-individual','consulta-status','tracking','protocolo'
]);

const PUBLIC_CANONICALS=Object.freeze({
  home:'https://divinabruxa.com.br/',
  tarot:'https://divinabruxa.com.br/tarot-livre.html',
  daily:'https://divinabruxa.com.br/carta-do-dia.html',
  spreads:'https://divinabruxa.com.br/tiragens-de-tarot.html',
  library:'https://divinabruxa.com.br/cartas-do-tarot.html',
  school:'https://divinabruxa.com.br/escola-do-tarot.html',
  consultations:'https://divinabruxa.com.br/consultas-de-tarot.html',
  store:'https://divinabruxa.com.br/loja-mistica.html',
  music:'https://divinabruxa.com.br/musica.html',
  videos:'https://divinabruxa.com.br/de-frente-com-o-tarot.html'
});

export const SEO_INDEX_POLICY_V193=Object.freeze({
  version:'V323',
  publicDirectives:PUBLIC_DIRECTIVES,
  privateDirectives:PRIVATE_DIRECTIVES,
  privateTokens,
  publicCanonicals:PUBLIC_CANONICALS,
  privacyIsEnforcedByAuthentication:true,
  robotsTxtIsNotAccessControl:true,
  privateContentInSitemap:false,
  hashPublicWorldCanonicalized:true
});

const normalize=value=>String(value||'')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/^#|^\/+|\/+$/g,'')
  .split(/[/?#&=]+/)
  .filter(Boolean);

const hashRoute=locationLike=>{
  const raw=String(locationLike?.hash||'').replace(/^#/,'').split(/[?&/]/)[0];
  return raw||'home';
};

export function routeNeedsNoindexV193(locationLike=globalThis.location){
  const tokens=new Set([
    ...normalize(locationLike?.pathname),
    ...normalize(locationLike?.hash),
    ...normalize(locationLike?.search)
  ]);
  return privateTokens.some(token=>tokens.has(token));
}

function canonicalElement(documentLike){
  let link=documentLike.querySelector('link[rel="canonical"]');
  if(!link){
    link=documentLike.createElement('link');
    link.rel='canonical';
    documentLike.head.append(link);
  }
  return link;
}

export function applyIndexPolicyV193(
  locationLike=globalThis.location,
  documentLike=globalThis.document
){
  if(!documentLike?.head)return Object.freeze({private:false,directives:'',canonical:''});

  let meta=documentLike.querySelector('meta[name="robots"]');
  if(!meta){
    meta=documentLike.createElement('meta');
    meta.name='robots';
    documentLike.head.append(meta);
  }

  const isPrivate=routeNeedsNoindexV193(locationLike);
  const route=hashRoute(locationLike);
  const directives=isPrivate?PRIVATE_DIRECTIVES:PUBLIC_DIRECTIVES;
  const canonical=isPrivate
    ? 'https://divinabruxa.com.br/'
    : (PUBLIC_CANONICALS[route]||'https://divinabruxa.com.br/');

  meta.content=directives;
  canonicalElement(documentLike).href=canonical;
  documentLike.documentElement.dataset.indexPolicy=isPrivate?'private-v323':'public-v323';
  documentLike.documentElement.dataset.canonicalWorld=route;

  return Object.freeze({private:isPrivate,directives,canonical,route});
}

export function installIndexPolicyV193(){
  const apply=()=>applyIndexPolicyV193();
  apply();
  globalThis.addEventListener?.('hashchange',apply);
  globalThis.addEventListener?.('popstate',apply);
  globalThis.addEventListener?.('divina:route-ready',apply);
  return Object.freeze({version:'V323',refresh:apply,policy:SEO_INDEX_POLICY_V193});
}
