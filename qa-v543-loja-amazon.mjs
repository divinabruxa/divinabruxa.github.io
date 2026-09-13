import fs from 'node:fs';
import { CONFIG } from './config-v200.js';
import { STORE_POLICY } from './store-policy.js';
import { auditAmazonCatalogV543, buildAmazonAffiliateURL } from './store-engine.js';

let passed = 0;
const failures = [];
const check = (condition, label) => condition ? passed++ : failures.push(label);
const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');

const required = [
  'amazon-store-core-v543.js','amazon-store-core-v543.css','store-policy.js','store-engine.js',
  'config-v200.js','media-commerce-world-v320.js','page-loader-v1.js','app-v208.js',
  'pwa-world-v324.js','pwa-world-v196.js','sw.js','index.html','loja-mistica.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];
required.forEach(file => check(fs.existsSync(new URL(file, import.meta.url)), `arquivo:${file}`));

check(CONFIG.amazonAssociateTag === 'orbedasrealid-20', 'tag-oficial');
check(CONFIG.products.length === 21, 'catalogo-21');
check(STORE_POLICY.version === 'v543', 'politica-v543');
check(STORE_POLICY.environment === 'editorial-affiliate-staging', 'ambiente-staging');
check(STORE_POLICY.checkout === false, 'checkout-interno-bloqueado');
check(STORE_POLICY.productionBilling === false, 'billing-real-bloqueado');
check(STORE_POLICY.storesPaymentData === false, 'sem-dados-pagamento');
check(STORE_POLICY.collections.length === 4, 'quatro-colecoes');
check(STORE_POLICY.linkPolicy.priceCache === false, 'sem-cache-preco');
check(STORE_POLICY.linkPolicy.stockCache === false, 'sem-cache-estoque');
check(STORE_POLICY.linkPolicy.ratingCache === false, 'sem-cache-avaliacao');
check(STORE_POLICY.linkPolicy.adjacentDisclosure === true, 'aviso-adjacente');
check(STORE_POLICY.linkPolicy.officialPartnershipClaim === false, 'sem-parceria-oficial-falsa');
check(STORE_POLICY.linkPolicy.productImages === 'editorial-original-only', 'imagens-editoriais-proprias');
check(STORE_POLICY.linkPolicy.analyticsForbiddenFields.includes('search_text'), 'busca-privada');
check(STORE_POLICY.linkPolicy.analyticsForbiddenFields.includes('favorites'), 'favoritos-privados');

const ids = new Set();
CONFIG.products.forEach((product, index) => {
  const label = product.id || `produto-${index + 1}`;
  check(Boolean(product.id), `${label}:id`);
  check(!ids.has(product.id), `${label}:id-unico`); ids.add(product.id);
  check(Boolean(product.name), `${label}:nome`);
  check(Boolean(product.category), `${label}:categoria`);
  check(STORE_POLICY.categories.includes(product.category), `${label}:categoria-valida`);
  check(Boolean(product.description), `${label}:descricao`);
  check(Boolean(product.search), `${label}:busca-ampla`);
  check(!Object.hasOwn(product, 'price') && !Object.hasOwn(product, 'stock') && !Object.hasOwn(product, 'rating'), `${label}:sem-dado-mutavel`);
  const url = new URL(buildAmazonAffiliateURL(product, CONFIG.amazonAssociateTag));
  check(url.protocol === 'https:', `${label}:https`);
  check(url.hostname === 'www.amazon.com.br', `${label}:host`);
  check(url.pathname === '/s', `${label}:rota-busca`);
  check(url.searchParams.get('tag') === 'orbedasrealid-20', `${label}:tag`);
  check(Boolean(url.searchParams.get('k')), `${label}:termo`);
});

const audit = auditAmazonCatalogV543(CONFIG.products, CONFIG.amazonAssociateTag);
check(audit.passed, 'auditoria-catalogo');
check(audit.failures.length === 0, 'auditoria-sem-falhas');
check(audit.uniqueProductIds === 21, 'auditoria-ids');
check(audit.mutableCommerceClaims === 0, 'auditoria-sem-promessas-mutuaveis');
check(audit.privateAnalyticsFields === 0, 'auditoria-sem-analytics-privado');

const core = read('amazon-store-core-v543.js');
['Estudar o Tarot','Preparar um ritual','Cuidar do meu espaço','Criar ou presentear','Ritual de compra consciente'].forEach(text => check(core.includes(text), `conteudo:${text}`));
['pointermove','MutationObserver','setInterval(','requestAnimationFrame(','<canvas'].forEach(token => check(!core.includes(token), `core-sem:${token}`));
check(core.includes("privateContentReads: 0"), 'core-privacidade');
check(core.includes("permanentAnimationLoops: 0"), 'core-sem-loops');

const engine = read('store-engine.js');
check(engine.includes('LINK DE AFILIADO · COMPRA E ENTREGA PELA AMAZON'), 'aviso-em-cada-card');
check(engine.includes('rel="nofollow sponsored noopener"'), 'rel-afiliado-seguro');
check(engine.includes('aria-describedby="store-v148-disclosure"'), 'descricao-acessivel');
check(engine.includes('data-no-private-analytics'), 'marcador-sem-telemetria-privada');

const config = read('config-v200.js');
check(!config.includes('MacBook Pro chip M4'), 'sem-geracao-apple-congelada');
check(config.includes("search:'Apple MacBook Pro'"), 'busca-apple-ampla');

const app = read('app-v208.js');
check(app.includes("currentMacroStage:'9-of-14'"), 'app-macro-9');
check(app.includes("release:'V543'"), 'app-release-v543');
check(app.includes('createAmazonStoreCoreV543'), 'app-core-loja');
check(app.includes("oneCanonicalOrb:true"), 'orbe-canonica-preservada');
check(app.includes('tarotFireRemoved:true'), 'tarot-sem-fogo-preservado');
check(app.includes('canonicalTarotNormalOnly:true'), 'tarot-sem-invertidas-preservado');

const sw = read('sw.js');
check(sw.includes('const VERSION=543'), 'sw-v543');
check(sw.includes("'./amazon-store-core-v543.js','./amazon-store-core-v543.css'"), 'sw-cache-loja');
check(!sw.includes("divina-bruxa-v542-shell"), 'sw-cache-antigo-removido');

const index = read('index.html');
check(index.includes('app-v208.js?v=543'), 'index-app-v543');
check(index.includes('manifest.webmanifest?v=543'), 'index-manifest-v543');
check(index.includes("__divinaSWBootstrap='v543-inline'"), 'index-bootstrap-v543');
check(index.includes('sw.js?v=543'), 'index-sw-v543');
check(index.includes('LOJA AMAZON · CURADORIA V543'), 'index-loja-v543');

const standalone = read('loja-mistica.html');
check(standalone.includes("config-v200.js?v=543"), 'guia-fonte-verdade');
check(standalone.includes('amazon-store-core-v543.css?v=543'), 'guia-estilo-v543');
check(standalone.includes('createAmazonStoreCoreV543'), 'guia-core-v543');
check(standalone.includes('data-store-engine="v543"'), 'guia-engine-v543');

for (const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']) {
  const text = read(file);
  check(text.includes('manifest.webmanifest?v=543'), `${file}:manifest`);
  check(text.includes('pwa-world-v324.js?v=543'), `${file}:pwa`);
}

const total = passed + failures.length;
console.log(`V543 QA: ${passed}/${total} verificações aprovadas.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
