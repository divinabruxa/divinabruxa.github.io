import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name,import.meta.url),'utf8');
const [
  html,app,sw,world,styles,commerce,commerceStyles,consultas,consultasStyles,
  entry,entryStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./loja-world-v622.js'),read('./loja-world-v622.css'),
  read('./living-commerce-path-v608.js'),read('./living-commerce-path-v608.css'),
  read('./consultas-world-v621.js'),read('./consultas-world-v621.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const count = (source,pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="store"/g) === 1, 'um mundo Loja');
ok(count(html,/id="storeApp"/g) === 1, 'um app Loja');
ok(!/id="(?:loja|store)OrbV622"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V625"') && html.includes('V625-MUSICA-PALCO-DAS-ESTRELAS'), 'release cumulativa V625');
ok(html.includes('app-v208.js?v=625-musica-palco-das-estrelas'), 'app cumulativo V625');

ok(count(app,/createLojaWorldV622/g) === 2, 'importação e criação únicas');
ok(app.includes("loja-world-v622.js?v=622-casa-das-escolhas-vivas"), 'mundo ligado ao app');
ok(app.includes('amazonStore') && app.includes('livingCommerce:livingCommercePath') && app.includes('chambers:realityChambers'), 'autoridades existentes reutilizadas');
ok(app.includes('window.orbe.lojaWorld = lojaWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13LojaWorldV622'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-9-loja'"), 'nona renovação declarada');
ok(app.includes("universe:'casa-das-escolhas-vivas'"), 'universo declarado');
ok(app.includes('lojaWorldStatus:lojaWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_LOJA_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV622'), 'continuidade pública V622');
ok(app.includes("document.documentElement.dataset.work13Macro = 'musica-palco-das-estrelas'"), 'macroetapa seguinte ativa');
ok(app.includes("document.documentElement.dataset.work13ConsultasWorld = 'v621'"), 'Consultas V621 permanece');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'LOJA_WORLD_CONTRACT_V622',"universe:'casa-das-escolhas-vivas'",
  "identity:'night-emerald-patina-copper-amber-parchment'",
  "'arrival','one-clear-intention','four-curated-paths','one-explicit-path'",
  "'twenty-one-curated-choices','category-search-or-favorites-on-explicit-request'",
  "'product-truth','external-amazon-passage','return','silence'",
  "storeAuthority:'V543-preserved'","chamberAuthority:'V596-preserved'",
  "livingCommerceAuthority:'V608-preserved'",'productsPreserved:21',
  'intentionPathsPreserved:4','categoriesPreserved:9','productCategoriesPreserved:8',
  "'Todos','Baralhos','Livros','Cristais','Ritual','Acessórios'",
  "'Decoração','Apple & Tecnologia','Presentes Premium'",'featuredChoicesPreserved:7',
  'freeAccessPreserved:true','manualCuratedCatalogPreserved:true',
  'officialApiRequiredForMutableClaims:true',"destinationHost:'www.amazon.com.br'",
  'affiliateDisclosureAdjacentPreserved:true',"affiliateTagAuthority:'V543-config-preserved'",
  'affiliateTagHardcodedByV622:false','affiliateTagChanges:0',
  "checkout:'external-amazon-only'",'checkoutInternal:false','realBilling:false',
  'purchaseInsideDivina:false','priceCache:false','stockCache:false','ratingCache:false',
  'fakeDiscountClaims:0','fakeScarcityClaims:0','officialPartnershipClaim:false',
  "productImagesAuthority:'V543-editorial-original-only'",
  "productUnavailablePolicyPreserved:'unavailable-or-archived-never-silent-delete'",
  'searchLocalOnlyPreserved:true','favoritesLocalOnlyPreserved:true',
  'analyticsSearchTextAccess:false','analyticsFavoritesAccess:false',
  'analyticsJournalAccess:false','analyticsTarotQuestionAccess:false',
  'analyticsWhitPromptAccess:false','analyticsConsultationAccess:false',
  'existingStoreBodyReused:true','separateStoreBody:false','storeFunctionChanges:0',
  'productChanges:0','categoryChanges:0','collectionChanges:0','linkChanges:0',
  'trackingChanges:0','checkoutChanges:0','adminChanges:0',
  'privateContentReads:0','searchTextReads:0','favoritesReads:0','affiliateUrlReads:0',
  'accountDataReads:0','paymentDataReads:0','journalBodyReads:0','consultationBodyReads:0',
  'storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'reusesCanonicalOrb:true','pentagramMenuPreserved:true','automaticNavigation:false',
  'automaticWhitSpeech:false','visibleCopyChanges:1','newVisibleDomNodes:0',
  'newImages:0','newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê busca, favoritos ou links');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'Toda escolha começa por uma intenção.'"), 'identidade visível curta');
ok(world.includes("'divina:living-commerce-state'") && world.includes("'divina:store-affiliate-passage'"), 'somente sinais públicos acompanhados');

for (const token of [
  '[data-work13-loja-world="v622"]','[data-loja-world="v622"]',
  '[data-loja-world-phase="invitation"]','[data-loja-world-phase="intentions"]',
  '[data-loja-world-phase="catalog"]','[data-loja-world-phase="discovery"]',
  '[data-loja-world-phase="filtering"]','[data-loja-world-phase="favorites"]',
  '[data-loja-world-phase="product"]','[data-loja-world-phase="passage"]',
  '[data-loja-world-phase="travel"]','[data-loja-world-phase="portal"]',
  '#storeApp','.db608-commerce-guide','#amazonStoreCoreV543',
  '.amazon-v543__intentions','.amazon-v543__truth','.store-v148-disclosure',
  '.store-v148-catalog','.store-v148-search-line','.store-v148-categories',
  '.store-v148-grid','.store-v148-product','.store-v148-product-art',
  '.store-v148-heart','.store-v148-partner-state','[data-affiliate]',
  'content-visibility:auto','contain-intrinsic-size:440px',
  '@media(max-width:430px)','@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'min-block-size:100dvh','min-block-size:100svh','min-block-size:48px','touch-action:manipulation'
]) ok(styles.includes(token),`estilo: ${token}`);
ok(styles.includes('--lw622-void') && styles.includes('--lw622-emerald') && styles.includes('--lw622-copper') && styles.includes('--lw622-amber') && styles.includes('--lw622-parchment'), 'paleta própria completa');
ok(styles.includes('content:"LOJA · CASA DAS ESCOLHAS VIVAS"'), 'nome do mundo presente');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável');

ok(commerce.includes('productsPreserved:21') && commerce.includes('intentionsAfterExplicitRequest:4'), 'catálogo V608 preservado');
ok(commerce.includes("checkout:'external-amazon-only'") && commerce.includes('mutablePriceClaims:0'), 'operação V608 honesta');
ok(commerce.includes('searchQueryReads:0') && commerce.includes('purchaseBodyReads:0') && commerce.includes('privateContentReads:0'), 'clareza V608 preserva privacidade');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 78, '78 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v625-musica-palco-das-estrelas'"), 'cache próprio');
ok(sw.includes("'./loja-world-v622.js?v=622-casa-das-escolhas-vivas'"), 'JS no cache');
ok(sw.includes("'./loja-world-v622.css?v=622-casa-das-escolhas-vivas'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_LOJA_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-loja-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-loja-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [commerce,'de6614a2354e604ea09641a0f002aceb313571787df3dc93446625a0fdf991d3','clareza comercial V608'],
  [commerceStyles,'9b6b43aca5630c1f30acab6074505e92b9eb6801081483739a61113f5c38c42f','visual comercial V608'],
  [consultas,'ff72afb4426671364cbb5a4cfff27bfdda60133b443433dcd906b9cdaa915aa4','Consultas V621'],
  [consultasStyles,'01ac715df88620a062704d7534f7b167c7a2b69665df62f7fc4c207a132a6a1b','visual Consultas V621'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610']
]) ok(hash(source) === expected,`${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura da Casa das Escolhas Vivas V622`);
