import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name,import.meta.url),'utf8');
const [
  html,app,sw,world,styles,soul,soulStyles,schoolEngine,wisdom,wisdomStyles,
  chambers,chamberStyles,spreads,spreadsStyles,daily,dailyStyles,tarot,tarotStyles,
  library,libraryStyles,entry,entryStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./escola-world-v618.js'),read('./escola-world-v618.css'),
  read('./escola-soul-v610.js'),read('./escola-soul-v610.css'),
  read('./school-world-v306.js'),read('./living-wisdom-path-v607.js'),read('./living-wisdom-path-v607.css'),
  read('./reality-chambers-v596.js'),read('./reality-chambers-v596.css'),
  read('./tiragens-world-v617.js'),read('./tiragens-world-v617.css'),
  read('./carta-do-dia-world-v616.js'),read('./carta-do-dia-world-v616.css'),
  read('./tarot-livre-soul-v610.js'),read('./tarot-livre-world-v614.css'),
  read('./biblioteca-soul-v610.js'),read('./biblioteca-world-v615.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const count = (source,pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="school"/g) === 1, 'um mundo Escola');
ok(count(html,/id="schoolApp"/g) === 1, 'um app Escola');
ok(!/id="(?:school|escola)OrbV618"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V623"') && html.includes('V623-PREMIUM-SALA-DAS-CHAVES'), 'release cumulativa V623');
ok(html.includes('app-v208.js?v=623-premium-sala-das-chaves'), 'app cumulativo V623');

ok(count(app,/createEscolaWorldV618/g) === 2, 'importação e criação únicas');
ok(app.includes("escola-world-v618.js?v=618-jardim-das-78-sementes"), 'mundo ligado ao app');
ok(app.includes('createEscolaWorldV618()'), 'camada não captura a Orbe');
ok(app.includes('window.orbe.escolaWorld = escolaWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13EscolaWorldV618'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-5-escola'"), 'quinta renovação declarada');
ok(app.includes("universe:'jardim-das-78-sementes'"), 'universo declarado');
ok(app.includes('escolaWorldStatus:escolaWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_SCHOOL_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV618'), 'continuidade pública V618');
ok(app.includes("document.documentElement.dataset.work13SchoolWorld = 'v618'"), 'mundo Escola preservado');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'ESCOLA_WORLD_CONTRACT_V618',"universe:'jardim-das-78-sementes'",
  "identity:'midnight-emerald-amber-parchment'",
  "'arrival','one-living-seed','one-next-lesson','one-whole-lesson'",
  "'practice','root','silence','programme-on-explicit-request'",
  "schoolAuthority:'V555-preserved'","chamberAuthority:'V596-preserved'",
  "livingWisdomAuthority:'V607-preserved'","soulAuthority:'V610-preserved'",
  'stagesPreserved:3','modulesPreserved:17','lessonsPreserved:124',
  'cardLessonsPreserved:78','theoryPracticeLessonsPreserved:46',
  'freeLessonsPreserved:17','premiumLessonsPreserved:107',
  'foundationsFreePreserved:true','premiumOfflinePreserved:true',
  'oneNaturalNextLesson:true','oneWholeLessonAtATime:true','programmeRequiresExplicitGesture:true',
  'progressIsPublicAggregateOnly:true','pentagramMenuPreserved:true','reusesCanonicalOrb:true',
  'progressAuthorityChanges:0','curriculumOrderChanges:0','lessonContentChanges:0',
  'quizChanges:0','exerciseChanges:0','favouritesChanges:0','searchChanges:0',
  'premiumAuthorityChanges:0','premiumOfflineAuthorityChanges:0','optionalTutorAuthorityChanges:0',
  'persistenceChanges:0','orbActionChanges:0','automaticNavigation:false','automaticWhitSpeech:false',
  'privateContentReads:0','lessonBodyReads:0','schoolNoteReads:0','answerReads:0',
  'searchQueryReads:0','cardIdentityReads:0','storageReads:0','storageWrites:0',
  'networkCalls:0','modelCalls:0','newVisibleDomNodes:0','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê aula, nota ou resposta');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'O saber que você toca começa a criar raiz.'"), 'identidade visível curta');
ok(world.includes("'divina:school-soul-state'") && world.includes("'divina:school-progress-v555'"), 'motores públicos acompanhados');

for (const token of [
  '[data-work13-school-world="v618"]','[data-school-world="v618"]',
  '[data-school-world-phase="germinating"]','[data-school-world-phase="lesson"]',
  '[data-school-world-phase="practice"]','[data-school-world-phase="rooting"]',
  '[data-school-world-phase="rooted"]','.db585-intent-threshold','.school-dashboard',
  '.db607-school-step','.school-v555-compass','.school-v555-stages','.school-stage',
  '.school-modules','.school-workspace','.school-lesson','.is-v607-current',
  'scroll-snap-type:x mandatory','scroll-snap-align:center','overscroll-behavior-inline:contain',
  '-webkit-overflow-scrolling:touch','content-visibility:auto','contain-intrinsic-size:760px',
  '@media(max-width:430px)','@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'min-block-size:100dvh','min-block-size:100svh','min-block-size:48px','touch-action:manipulation'
]) ok(styles.includes(token),`estilo: ${token}`);
ok(styles.includes('--sc618-emerald') && styles.includes('--sc618-amber') && styles.includes('--sc618-parchment'), 'paleta própria completa');
ok(styles.includes('content:"JARDIM DAS 78 SEMENTES"'), 'nome do mundo presente');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável');

ok(soul.includes('modulesPreserved:17') && soul.includes('lessonsPreserved:124') && soul.includes('cardLessonsPreserved:78'), 'alma V610 preserva o programa');
ok(soul.includes('privateContentReads:0') && soul.includes('schoolNoteReads:0'), 'alma V610 preserva privacidade');
ok(schoolEngine.includes('modules:17,lessons:124,stages:3') && schoolEngine.includes('SCHOOL_LESSON_TOTAL'), 'motor V555 preserva 124/17');
ok(schoolEngine.includes('freeLessons:17,premiumLessons:107'), 'motor V555 preserva acesso');
ok(wisdom.includes("sequence:Object.freeze(['one-discovery','one-lesson','direct-writing'])"), 'caminho V607 preservado');
ok(wisdom.includes("schoolEntry:'one-natural-next-lesson'") && wisdom.includes("schoolProgramme:'explicit-request-only'"), 'programa V607 explícito');
ok(chambers.includes("school:Object.freeze({ label:'Escola', intention:'aprender', entry:'#schoolApp' })"), 'câmara V596 preservada');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 74, '74 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v623-premium-sala-das-chaves'"), 'cache próprio');
ok(sw.includes("'./escola-world-v618.js?v=618-jardim-das-78-sementes'"), 'JS no cache');
ok(sw.includes("'./escola-world-v618.css?v=618-jardim-das-78-sementes'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_SCHOOL_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-escola-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-escola-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [soul,'23446ccfb872519528ae52f8ce99d01ce2bb886f95dd3832b78f525c998ee3eb','alma Escola V610'],
  [soulStyles,'2073c5fdc6d1b1b3b32484f32ac2ef28283335432de58c8042b2fa1016b43ba4','visual Escola V610'],
  [schoolEngine,'b29fd7f86c1859432f06e80ab7234a76628c6b35f09eec316cd972fe6ba5c156','motor Escola V555'],
  [wisdom,'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377','caminho V607'],
  [wisdomStyles,'765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118','visual V607'],
  [chambers,'1ae6b54a8f53d5e8e89230e042c6cf24bc6c662928e118afbe6be18dc2869fad','câmaras V596'],
  [chamberStyles,'bfc65e0566c7ea5c4acb42aac42245b4fa5079cc25ce124067ce99dfaad25033','visual V596'],
  [spreads,'c7de3b466c8a7c86262e590304b30597b3782d00a524e6cd3218b826a627224f','Tiragens V617'],
  [spreadsStyles,'a2b47ab2707bc833f6916b308d3df00843c0614ed2088d951b182e660e667fed','visual Tiragens V617'],
  [daily,'e68041587c325ade6562b641e08840a7cae23f66ca9bbc72afdfdd9c65d6df8e','Carta V616'],
  [dailyStyles,'abb7914b529d2b24433381d39406076e8aec611ad55e184a1a0a0bdbb56103e0','visual Carta V616'],
  [tarot,'7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0','Tarot V614'],
  [tarotStyles,'0c7213229a4acc196e48b114700d6f4cdb16881faf0623dd5ab8a50359027b55','visual Tarot V614'],
  [library,'1dcf29e6e20ebb824fe291de52452d2ff7e03d07d4099a81b62c3920a33f32ad','Biblioteca V615'],
  [libraryStyles,'4c5bde57ea184568bcaa8205dc52c6ec04a1bf024abe71db4a3e93f9970092d3','visual Biblioteca V615'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610']
]) ok(hash(source) === expected,`${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura do Jardim das 78 Sementes V618`);
