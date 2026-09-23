import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name,import.meta.url),'utf8');
const [
  html,app,sw,world,styles,commerce,commerceStyles,whitWorld,whitStyles,
  entry,entryStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./consultas-world-v621.js'),read('./consultas-world-v621.css'),
  read('./living-commerce-path-v608.js'),read('./living-commerce-path-v608.css'),
  read('./whit-world-v620.js'),read('./whit-world-v620.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const count = (source,pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="consultations"/g) === 1, 'um mundo Consultas');
ok(count(html,/id="consultationApp"/g) === 1, 'um app Consultas');
ok(!/id="(?:consultas|consultation)OrbV621"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V625"') && html.includes('V625-MUSICA-PALCO-DAS-ESTRELAS'), 'release cumulativa V625');
ok(html.includes('app-v208.js?v=625-musica-palco-das-estrelas'), 'app cumulativo V625');

ok(count(app,/createConsultasWorldV621/g) === 2, 'importação e criação únicas');
ok(app.includes("consultas-world-v621.js?v=621-templo-do-encontro"), 'mundo ligado ao app');
ok(app.includes('livingCommerce:livingCommercePath') && app.includes('chambers:realityChambers'), 'autoridades existentes reutilizadas');
ok(app.includes('window.orbe.consultasWorld = consultasWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13ConsultasWorldV621'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-8-consultas'"), 'oitava renovação declarada');
ok(app.includes("universe:'templo-do-encontro'"), 'universo declarado');
ok(app.includes('consultasWorldStatus:consultasWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_CONSULTAS_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV621'), 'continuidade pública V621');
ok(app.includes("document.documentElement.dataset.work13Macro = 'musica-palco-das-estrelas'"), 'macroetapa ativa');
ok(app.includes("document.documentElement.dataset.work13WhitWorld = 'v620'"), 'Whit V620 permanece');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'CONSULTAS_WORLD_CONTRACT_V621',"universe:'templo-do-encontro'",
  "identity:'garnet-rosewood-candle-gold-moon-ivory'",
  "'arrival','one-clear-intention','four-human-readings','one-explicit-choice'",
  "'essential-contact','private-question-or-context','review','email-handoff'",
  "'private-protocol','return','silence'",
  "consultationsAuthority:'V558-preserved'","chamberAuthority:'V596-preserved'",
  "livingCommerceAuthority:'V608-preserved'",'servicesPreserved:4',
  "'Mesa Real','Leitura de Mente','Carta de Conselho','Pergunta'",
  '[25000,20000,15000,5000]','priceSnapshotPreserved:true',
  'futurePricesAdminEditablePreserved:true','previousOrdersImmutable:true',
  'humanReadingOnly:true','separateFromPremium:true','separateFromWhit:true',
  'separateFromAppRoyalTable:true',"'name','email','phone','service','question-or-context'",
  'emailRequired:true','phoneRequired:true','whatsappRequired:false',
  "operationalContact:'orbedasrealidades@hotmail.com'","submissionChannel:'email-only'",
  'onlineOnlySubmission:true','automaticEmail:false','falseDeliveryClaim:false',
  'realBilling:false','checkoutChanges:0','paymentStatusChanges:0',
  'requestStatusAuthorityPreserved:true','privateByDefault:true','otherUserAccess:false',
  'analyticsPrivateBodyAccess:false','commonLogsPrivateBodyAccess:false',
  'whitSilentRead:false','seoPrivateContentAccess:false',
  'existingConsultationBodyReused:true','separateConsultationBody:false',
  'consultationFunctionChanges:0','serviceChanges:0','priceChanges:0','formChanges:0',
  'submissionChanges:0','protocolChanges:0','adminChanges:0','consentChanges:0',
  'privateContentReads:0','formValueReads:0','questionReads:0','contactReads:0',
  'protocolReads:0','accountDataReads:0','paymentDataReads:0',
  'storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'reusesCanonicalOrb:true','pentagramMenuPreserved:true','automaticNavigation:false',
  'automaticWhitSpeech:false','visibleCopyChanges:1','newVisibleDomNodes:0',
  'newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê formulário, pergunta ou protocolo');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'Todo encontro começa pela confiança.'"), 'identidade visível curta');
ok(world.includes("'divina:living-commerce-state'") && world.includes("'divina:consultation-protocol-state'"), 'somente sinais públicos acompanhados');

for (const token of [
  '[data-work13-consultas-world="v621"]','[data-consultas-world="v621"]',
  '[data-consultas-world-phase="invitation"]','[data-consultas-world-phase="choices"]',
  '[data-consultas-world-phase="request"]','[data-consultas-world-phase="details"]',
  '[data-consultas-world-phase="review"]','[data-consultas-world-phase="handoff"]',
  '[data-consultas-world-phase="protocol"]','[data-consultas-world-phase="travel"]',
  '[data-consultas-world-phase="portal"]','#consultationApp','.db608-commerce-guide',
  '.consultation-v147-services','.consultation-v147-service','.consultation-flow-stage',
  '.consultation-tracker','content-visibility:auto','contain-intrinsic-size:420px',
  '@media(max-width:430px)','@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'min-block-size:100dvh','min-block-size:100svh','min-block-size:48px','touch-action:manipulation'
]) ok(styles.includes(token),`estilo: ${token}`);
ok(styles.includes('--cw621-void') && styles.includes('--cw621-garnet') && styles.includes('--cw621-gold') && styles.includes('--cw621-ivory'), 'paleta própria completa');
ok(styles.includes('content:"CONSULTAS · TEMPLO DO ENCONTRO"'), 'nome do mundo presente');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável');

ok(commerce.includes("choicesAfterExplicitRequest:4") && commerce.includes('priceCents:Object.freeze([25000,20000,15000,5000])'), 'oferta V608 preservada');
ok(commerce.includes("contact:'orbedasrealidades@hotmail.com'") && commerce.includes('automaticEmail:false') && commerce.includes('automaticBilling:false'), 'operação V608 honesta');
ok(commerce.includes('privateContentReads:0') && commerce.includes('formValueReads:0') && commerce.includes('consultationProtocolReads:0'), 'clareza V608 preserva privacidade');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 78, '78 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v625-musica-palco-das-estrelas'"), 'cache próprio');
ok(sw.includes("'./consultas-world-v621.js?v=621-templo-do-encontro'"), 'JS no cache');
ok(sw.includes("'./consultas-world-v621.css?v=621-templo-do-encontro'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_CONSULTAS_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-consultas-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-consultas-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [commerce,'de6614a2354e604ea09641a0f002aceb313571787df3dc93446625a0fdf991d3','clareza comercial V608'],
  [commerceStyles,'9b6b43aca5630c1f30acab6074505e92b9eb6801081483739a61113f5c38c42f','visual comercial V608'],
  [whitWorld,'d5dc2f0d2787b54b6dd7f80411e5e223ac420de12feb5c62881658e56963b340','Whit V620'],
  [whitStyles,'811044c1dfcdeb99d2e6f20a26a1eb78fb51d6bc98581bb59c840c2d4c8e466d','visual Whit V620'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610']
]) ok(hash(source) === expected,`${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura do Templo do Encontro V621`);
