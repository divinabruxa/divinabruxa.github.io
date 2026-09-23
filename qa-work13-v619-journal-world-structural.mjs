import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name,import.meta.url),'utf8');
const [
  html,app,sw,world,styles,soul,soulStyles,journalEngine,wisdom,wisdomStyles,
  chambers,chamberStyles,entry,entryStyles,orchestra,schoolWorld,schoolStyles
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./diario-world-v619.js'),read('./diario-world-v619.css'),
  read('./diario-soul-v610.js'),read('./diario-soul-v610.css'),
  read('./journal-world-v317.js'),read('./living-wisdom-path-v607.js'),read('./living-wisdom-path-v607.css'),
  read('./reality-chambers-v596.js'),read('./reality-chambers-v596.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js'),read('./escola-world-v618.js'),read('./escola-world-v618.css')
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const count = (source,pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="journal"/g) === 1, 'um mundo Diário');
ok(count(html,/id="journalApp"/g) === 1, 'um app Diário');
ok(!/id="(?:journal|diario)OrbV619"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V623"') && html.includes('V623-PREMIUM-SALA-DAS-CHAVES'), 'release cumulativa V623');
ok(html.includes('app-v208.js?v=623-premium-sala-das-chaves'), 'app cumulativo V623');

ok(count(app,/createDiarioWorldV619/g) === 2, 'importação e criação únicas');
ok(app.includes("diario-world-v619.js?v=619-camara-da-tinta-viva"), 'mundo ligado ao app');
ok(app.includes('createDiarioWorldV619()'), 'camada não captura a Orbe');
ok(app.includes('window.orbe.diarioWorld = diarioWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13DiarioWorldV619'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-6-diario'"), 'sexta renovação declarada');
ok(app.includes("universe:'camara-da-tinta-viva'"), 'universo declarado');
ok(app.includes('diarioWorldStatus:diarioWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_JOURNAL_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV619'), 'continuidade pública V619');
ok(app.includes("document.documentElement.dataset.work13Macro = 'premium-sala-das-chaves'"), 'macroetapa seguinte ativa');
ok(app.includes("document.documentElement.dataset.work13JournalWorld = 'v619'"), 'Diário instalado permanece marcado');
ok(app.includes("document.documentElement.dataset.work13SchoolWorld = 'v618'"), 'Escola V618 permanece');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'DIARIO_WORLD_CONTRACT_V619',"universe:'camara-da-tinta-viva'",
  "identity:'obsidian-parchment-carmine-moon-silver'",
  "'arrival','orb-threshold','blank-page','direct-writing','silent-autosave'",
  "'ink-settles','optional-details','memories-on-explicit-request'",
  "'aggregate-mirror-on-explicit-request','return','silence'",
  "journalAuthority:'V556-preserved'","journalWorldAuthority:'V317-preserved'",
  "chamberAuthority:'V596-preserved'","livingWisdomAuthority:'V607-preserved'",
  "soulAuthority:'V610-preserved'",'directWritingFirst:true','blankPageFirst:true',
  'cursorAuthorityPreserved:true','silentAutosavePreserved:true','localDraftRecoveryPreserved:true',
  'offlinePreserved:true','syncConflictProtectionPreserved:true',
  'memoriesRequireExplicitGesture:true','mirrorRequiresExplicitGesture:true',
  'mirrorAggregateOnly:true','mirrorDiagnosis:false','mirrorPrediction:false',
  'timelinePageSizePreserved:12','timelineFullImageRequestsPreserved:0',
  'privateByDefault:true','adminBodyAccess:false','analyticsBodyAccess:false',
  'whitSilentRead:false','whitShareRequiresExplicitTemporaryConsent:true',
  'exportUserControlled:true','deleteUserControlled:true','automaticSharing:false',
  'journalFunctionChanges:0','persistenceChanges:0','syncChanges:0','consentChanges:0',
  'orbActionChanges:0','reusesCanonicalOrb:true','pentagramMenuPreserved:true',
  'automaticNavigation:false','automaticWhitSpeech:false','privateContentReads:0',
  'titleReads:0','journalBodyReads:0','tagReads:0','questionReads:0',
  'draftReads:0','historyReads:0','formValueReads:0','storageReads:0','storageWrites:0',
  'networkCalls:0','modelCalls:0','newVisibleDomNodes:0','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê título, corpo, tag ou pergunta');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'A página espera sem observar.'"), 'identidade visível curta');
ok(world.includes("'divina:journal-soul-state'") && world.includes("'divina:journal-world-ready'"), 'motores públicos acompanhados');

for (const token of [
  '[data-work13-journal-world="v619"]','[data-journal-world="v619"]',
  '[data-journal-world-phase="opening"]','[data-journal-world-phase="writing"]',
  '[data-journal-world-phase="saving"]','[data-journal-world-phase="saved"]',
  '[data-journal-world-phase="details"]','[data-journal-world-phase="memories"]',
  '[data-journal-world-phase="mirror"]','.db585-intent-threshold','#journalWorldV317',
  '.db607-journal-path','.journal-workspace','.journal-editor','#journalForm',
  '.journal-mirror','.journal-explorer','.journal-timeline',
  'scroll-snap-type:x mandatory','scroll-snap-align:center','overscroll-behavior-inline:contain',
  '-webkit-overflow-scrolling:touch','content-visibility:auto','contain-intrinsic-size:680px',
  '@media(max-width:430px)','@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'min-block-size:100dvh','min-block-size:100svh','min-block-size:48px','touch-action:manipulation'
]) ok(styles.includes(token),`estilo: ${token}`);
ok(styles.includes('--dw619-obsidian') && styles.includes('--dw619-paper') && styles.includes('--dw619-carmine') && styles.includes('--dw619-silver'), 'paleta própria completa');
ok(styles.includes('content:"CÂMARA DA TINTA VIVA"'), 'nome do mundo presente');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável');

ok(soul.includes('directWritingFirst:true') && soul.includes('silentAutosavePreserved:true'), 'alma V610 preserva escrita direta');
ok(soul.includes('privateContentReads:0') && soul.includes('journalBodyReads:0'), 'alma V610 preserva privacidade');
ok(journalEngine.includes('pageSize:12') && journalEngine.includes("mirror:'aggregate-only'") && journalEngine.includes('renderedEntriesPerPage:12'), 'motor V556 preserva timeline e Espelho');
ok(journalEngine.includes('privateByDefault:true') && journalEngine.includes('adminBodyAccess:false') && journalEngine.includes('whitSilentRead:false'), 'motor V556 preserva o cofre');
ok(wisdom.includes("journalEntry:'direct-writing-after-explicit-depth'") && wisdom.includes("journalReview:'explicit-request-only'"), 'caminho V607 preservado');
ok(chambers.includes("journal:Object.freeze({ label:'Diário', intention:'escutar', entry:'#journalApp' })"), 'câmara V596 preservada');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 74, '74 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v623-premium-sala-das-chaves'"), 'cache próprio');
ok(sw.includes("'./diario-world-v619.js?v=619-camara-da-tinta-viva'"), 'JS no cache');
ok(sw.includes("'./diario-world-v619.css?v=619-camara-da-tinta-viva'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_JOURNAL_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-diario-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-diario-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [soul,'9eb5d5a6f79f8caddfed446f6cfa269faedfa9dc389594401582a30c4af0abe1','alma Diário V610'],
  [soulStyles,'6f3e4f63c01a4c235801e3856c247672ff2d235fa3ab9bf098be807cb14d6dfc','visual Diário V610'],
  [journalEngine,'20b58bd2b928dbf68de42bc730bf32b3abdf01afc9734c3351a381924313809e','motor Diário V556'],
  [wisdom,'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377','caminho V607'],
  [wisdomStyles,'765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118','visual V607'],
  [chambers,'1ae6b54a8f53d5e8e89230e042c6cf24bc6c662928e118afbe6be18dc2869fad','câmaras V596'],
  [chamberStyles,'bfc65e0566c7ea5c4acb42aac42245b4fa5079cc25ce124067ce99dfaad25033','visual V596'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610'],
  [schoolWorld,'1759853cd6423acd3bb6fd7262f917f36b4b437b2e23a7bec5343522f51c4bd3','Escola V618'],
  [schoolStyles,'5671ea6d3ffc5f6ea0fa06c2bf650e29299b0d201870e6660c0aca87fd6c3722','visual Escola V618']
]) ok(hash(source) === expected,`${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura da Câmara da Tinta Viva V619`);
