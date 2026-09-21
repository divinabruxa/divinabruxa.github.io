import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [
  html,app,sw,soul,styles,wisdom,wisdomStyles,entry,journalWorld,chambers,chamberStyles,
  library,libraryStyles,school,schoolStyles,spreads,spreadsStyles,daily,dailyStyles,
  tarot,tarotStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./diario-soul-v610.js'),read('./diario-soul-v610.css'),
  read('./living-wisdom-path-v607.js'),read('./living-wisdom-path-v607.css'),
  read('./cosmos-entry-intention-v610.js'),read('./journal-world-v317.js'),
  read('./reality-chambers-v596.js'),read('./reality-chambers-v596.css'),
  read('./biblioteca-soul-v610.js'),read('./biblioteca-world-v615.css'),
  read('./escola-soul-v610.js'),read('./escola-soul-v610.css'),
  read('./tiragens-soul-v610.js'),read('./tiragens-soul-v610.css'),
  read('./carta-do-dia-soul-v610.js'),read('./carta-do-dia-soul-v610.css'),
  read('./tarot-livre-soul-v610.js'),read('./tarot-livre-soul-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="journal"/g) === 1, 'um mundo Diário');
ok(count(html,/id="journalApp"/g) === 1, 'um app Diário');
ok(!/id="(?:diario|journal)OrbV610"/.test(html), 'nenhuma Orbe duplicada');

ok(count(app,/createDiarioSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("diario-soul-v610.js?v=610-work13-journal-soul"), 'alma ligada ao app');
ok(app.includes('createDiarioSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.diarioSoul = diarioSoul'), 'alma publicada na Orbe');
ok(app.includes('window.divinaWork13DiarioSoulV610'), 'estado público próprio');
ok(app.includes("stage:'sexta-realidade-alma-propria'"), 'sexta realidade declarada');
ok(app.includes("universe:'camara-da-tinta-lunar'"), 'Câmara da Tinta Lunar declarada');
ok(app.includes('diarioSoulStatus:diarioSoul?.status?.() || null'), 'auditoria reunida');
ok(app.includes('realitySouls:6'), 'seis realidades concluídas');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_JOURNAL_SOUL_ACTIVE'"), 'worker ouvido');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'DIARIO_SOUL_CONTRACT_V610',"universe:'camara-da-tinta-lunar'",
  "'threshold','direct-writing','silent-autosave','optional-details'",
  "'explicit-memories','aggregate-mirror','return','silence'",
  "existingJournalAuthority:'V556-preserved'","existingJournalWorldAuthority:'V317-preserved'",
  "existingChamberAuthority:'V596-preserved'","existingLivingWisdomAuthority:'V607-preserved'",
  'directWritingFirst:true','memoriesRequireExplicitGesture:true','mirrorRequiresExplicitGesture:true',
  'silentAutosavePreserved:true','localFirst:true',"syncDefault:'off-until-explicit-account-consent'",
  'privateByDefault:true','timelinePageSizePreserved:12','timelineFullImageRequestsPreserved:0',
  'mirrorAggregateOnly:true','mirrorDiagnosis:false','mirrorPrediction:false',
  'journalFunctionChanges:0','persistenceChanges:0','syncChanges:0',
  'reusesCanonicalOrb:true','reusesGlobalLivingMenu:true','visibleCopyAdded:0',
  'automaticNavigation:false','automaticWhitSpeech:false','whitSilentRead:false',
  'whitEntryShareRequiresTemporaryConsent:true','adminBodyAccess:false','analyticsBodyAccess:false',
  'privateContentReads:0','titleReads:0','journalBodyReads:0','tagReads:0','questionReads:0',
  'draftReads:0','historyReads:0','formValueReads:0','storageReads:0','storageWrites:0',
  'networkCalls:0','modelCalls:0','newVisibleDomNodes:0','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

for (const capability of [
  'title','text','date-time','optional-mood','tags','favourites','tarot-relations',
  'autosave','local-drafts','search','filters','calendar','timeline','export','import',
  'edit','delete','offline','sync-conflicts'
]) ok(soul.includes(`'${capability}'`), `função preservada: ${capability}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=|innerText/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente o link de estilo é criado');
ok(soul.includes("'divina:journal-world-ready'"), 'acompanha o mundo existente');
ok(soul.includes("'divina:journal-world-updated'"), 'acompanha estado público do mundo');
ok(soul.includes("'divina:journal-autosave'"), 'acompanha autosave público');
ok(soul.includes("'divina:menu-state'"), 'acompanha a Orbe global');
ok(!/\.value\b|event\?\.detail\?\.(?:title|body|text|tags|question|draft|history)/.test(soul), 'não lê conteúdo do Diário');

for (const token of [
  '[data-journal-soul="v610"]','[data-journal-soul-phase="opening"]',
  '[data-journal-soul-phase="writing"]','[data-journal-soul-phase="saving"]',
  '[data-journal-soul-phase="saved"]','[data-journal-soul-phase="mirror"]',
  '[data-journal-soul-phase="portal"]','.db585-intent-threshold','.db607-journal-path',
  '.journal-workspace','.journal-editor','#journalForm','[name="title"]','[contenteditable="true"]',
  '[data-journal-save-state]','.journal-command','.journal-mirror','.journal-explorer',
  '.journal-timeline','content-visibility:auto','contain-intrinsic-block-size:220px',
  'scroll-snap-type:x mandatory','overscroll-behavior-inline:contain',
  '-webkit-overflow-scrolling:touch','@media(max-width:430px)',
  '@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'safe-area-inset-left','safe-area-inset-right','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado ou loop novo');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw/.test(styles), 'nenhuma largura que force rolagem');

ok(wisdom.includes("journalEntry:'direct-writing-after-explicit-depth'"), 'escrita direta V607 preservada');
ok(wisdom.includes("journalReview:'explicit-request-only'") && wisdom.includes('journalPrivateByDefault:true'), 'revisão explícita e privacidade preservadas');
ok(wisdom.includes("#journalForm [name=\"title\"]") && !wisdom.includes('.value'), 'V607 só entrega foco ao papel');
ok(wisdom.includes('journalBodyReads:0') && wisdom.includes('journalDraftReads:0') && wisdom.includes('journalHistoryReads:0'), 'privacidade V607 preservada');
ok(wisdomStyles.includes('[data-v607-journal-mode="write"]') && wisdomStyles.includes('[data-v607-journal-mode="review"]'), 'camadas V607 preservadas');
ok(journalWorld.includes('private:true') && journalWorld.includes("mirror:'aggregate-only'"), 'mundo V317 permanece privado e agregado');
ok(journalWorld.includes('renderedEntriesPerPage:12') && journalWorld.includes('timelineFullImageRequests:0'), 'timeline V317 continua leve');
ok(chambers.includes("journal:Object.freeze({ label:'Diário', intention:'escutar', entry:'#journalApp' })"), 'câmara do Diário preservada');
ok(chamberStyles.includes('[data-db596-chamber-mode="write"]') && chamberStyles.includes('[data-db596-chamber-mode="mirror"]'), 'escrita e Espelho continuam separados');
ok(entry.includes('journalThresholdOrbActionPreserved:true'), 'Orbe do limiar não abre o menu por engano');
ok(entry.includes("target.closest('[data-v585-orb-host]')"), 'host canônico do limiar preservado');
ok(entry.includes('Orbe viva. Toque para entrar e escrever no Diário'), 'ação local é anunciada');
ok(entry.includes("!['engaged','travel'].includes(state)"), 'depois do mergulho a Orbe recupera o menu global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 58, '58 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v615-biblioteca-sala-fios-vivos'"), 'cache próprio');
ok(sw.includes("'./diario-soul-v610.js?v=610-work13-journal-soul'"), 'JS no cache');
ok(sw.includes("'./diario-soul-v610.css?v=610-work13-journal-soul'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_JOURNAL_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-diario-soul-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-diario-soul-styles-missing'), 'estilo validado pelo worker');

ok(hash(orchestra) === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');
ok(hash(wisdom) === 'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377', 'rito V607 protegido byte a byte');
ok(hash(wisdomStyles) === '765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118', 'visual V607 protegido byte a byte');
ok(hash(journalWorld) === '20b58bd2b928dbf68de42bc730bf32b3abdf01afc9734c3351a381924313809e', 'mundo V317 protegido byte a byte');
ok(hash(chambers) === '1ae6b54a8f53d5e8e89230e042c6cf24bc6c662928e118afbe6be18dc2869fad', 'câmaras V596 protegidas byte a byte');
ok(hash(chamberStyles) === 'bfc65e0566c7ea5c4acb42aac42245b4fa5079cc25ce124067ce99dfaad25033', 'visual das câmaras protegido byte a byte');
ok(hash(tarot) === '7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0', 'Câmara Violeta V614 protegida byte a byte');
ok(hash(tarotStyles) === '53bd7cd30891f4473fe85addbebfe1f09c8edb7768e9bc945572e33c5e0da3a6', 'visual do Tarot protegido byte a byte');
ok(hash(daily) === 'c5ca4de3881fc03a3425cc4a2e1d5c4703f9ce188e4640649f63bc136f68783f', 'Carta do Dia protegida byte a byte');
ok(hash(dailyStyles) === '4ab92a4f206d75d51bd7b276408b6d057dcd9886a58f941c65a1777d898c7014', 'visual diário protegido byte a byte');
ok(hash(spreads) === '3eb2ccac06370f3ee48eaee8df8bf473449dbba234e737c6e21d555169a24c04', 'Tiragens protegidas byte a byte');
ok(hash(spreadsStyles) === '8a89a6a1edc5e4682c959de13449462b226132011e74c4ae2ba92fbd3b8d3771', 'visual das Tiragens protegido byte a byte');
ok(hash(school) === '23446ccfb872519528ae52f8ce99d01ce2bb886f95dd3832b78f525c998ee3eb', 'Escola protegida byte a byte');
ok(hash(schoolStyles) === '2073c5fdc6d1b1b3b32484f32ac2ef28283335432de58c8042b2fa1016b43ba4', 'Jardim Arcano protegido byte a byte');
ok(hash(library) === '1dcf29e6e20ebb824fe291de52452d2ff7e03d07d4099a81b62c3920a33f32ad', 'Sala dos Fios Vivos protegida byte a byte');
ok(hash(libraryStyles) === '4c5bde57ea184568bcaa8205dc52c6ec04a1bf024abe71db4a3e93f9970092d3', 'visual da Sala dos Fios Vivos protegido byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da alma do Diário e Espelho V610`);
