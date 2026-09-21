import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,soul,styles,wisdom,wisdomStyles,schoolWorld,chambers,chamberStyles,entry,spreads,spreadsStyles,daily,dailyStyles,tarot,tarotStyles,orchestra] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./escola-soul-v610.js'),read('./escola-soul-v610.css'),
  read('./living-wisdom-path-v607.js'),read('./living-wisdom-path-v607.css'),
  read('./school-world-v306.js'),read('./reality-chambers-v596.js'),read('./reality-chambers-v596.css'),
  read('./cosmos-entry-intention-v610.js'),read('./tiragens-soul-v610.js'),
  read('./tiragens-soul-v610.css'),read('./carta-do-dia-soul-v610.js'),
  read('./carta-do-dia-soul-v610.css'),read('./tarot-livre-soul-v610.js'),
  read('./tarot-livre-soul-v610.css'),read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="school"/g) === 1, 'um mundo Escola');
ok(count(html,/id="schoolApp"/g) === 1, 'um app Escola');
ok(!/id="(?:escola|school)OrbV610"/.test(html), 'nenhuma Orbe duplicada');

ok(count(app,/createEscolaSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("escola-soul-v610.js?v=610-work13-school-soul"), 'alma ligada ao app');
ok(app.includes('createEscolaSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.escolaSoul = escolaSoul'), 'alma publicada na Orbe');
ok(app.includes('window.divinaWork13EscolaSoulV610'), 'estado público próprio');
ok(app.includes("stage:'quarta-realidade-alma-propria'"), 'quarta realidade declarada');
ok(app.includes("universe:'jardim-arcano-do-conhecimento'"), 'Jardim Arcano declarado');
ok(app.includes('escolaSoulStatus:escolaSoul?.status?.() || null'), 'auditoria reunida');
ok(app.includes('realitySouls:6'), 'seis realidades concluídas');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_SCHOOL_SOUL_ACTIVE'"), 'worker ouvido');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'ESCOLA_SOUL_CONTRACT_V610',"universe:'jardim-arcano-do-conhecimento'",
  "sequence:Object.freeze(['seed','one-next-step','path','one-whole-lesson','practice','root','silence'])",
  "existingSchoolAuthority:'V555-preserved'","existingChamberAuthority:'V596-preserved'",
  "existingLivingWisdomAuthority:'V607-preserved'",'stagesPreserved:3',
  'modulesPreserved:17','lessonsPreserved:124','cardLessonsPreserved:78',
  'freeLessonsPreserved:17','premiumLessonsPreserved:107','oneNaturalNextLesson:true',
  'programmeRequiresExplicitGesture:true','progressAuthorityChanges:0','lessonContentChanges:0',
  'quizChanges:0','exerciseChanges:0','favouritesChanges:0','searchChanges:0',
  'premiumAuthorityChanges:0','persistenceChanges:0','reusesCanonicalOrb:true',
  'reusesGlobalLivingMenu:true','visibleCopyAdded:0','automaticNavigation:false',
  'automaticWhitSpeech:false','privateContentReads:0','lessonBodyReads:0',
  'schoolNoteReads:0','answerReads:0','searchQueryReads:0','storageReads:0',
  'storageWrites:0','networkCalls:0','modelCalls:0','newVisibleDomNodes:0',
  'newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente o link de estilo é criado');
ok(soul.includes("'divina:school-world-ready'"), 'acompanha o motor existente');
ok(soul.includes("'divina:school-progress-v555'"), 'acompanha progresso público');
ok(soul.includes("'divina:reality-chamber-state'"), 'acompanha a câmara existente');
ok(soul.includes("'divina:menu-state'"), 'acompanha a Orbe global');
ok(!/\.value\b|\.textContent\b|\.innerText\b/.test(soul), 'não lê aula, nota, resposta ou busca');

for (const token of [
  '[data-school-soul="v610"]','[data-school-soul-phase="germinating"]',
  '[data-school-soul-phase="paths"]','[data-school-soul-phase="lesson"]',
  '[data-school-soul-phase="practice"]','[data-school-soul-phase="rooting"]',
  '[data-school-soul-phase="rooted"]','[data-school-soul-phase="portal"]',
  '.db585-intent-threshold','.school-dashboard','.db607-school-step',
  '.school-progress-orbit','.school-v555-compass','.school-v555-stages',
  '.school-filter-bar','.school-workspace','.school-stage','.school-lessons',
  '.school-lesson','.school-portability','scroll-snap-type:x mandatory',
  'overscroll-behavior-inline:contain','-webkit-overflow-scrolling:touch',
  '@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)',
  'safe-area-inset-top','safe-area-inset-bottom','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado ou loop novo');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw/.test(styles), 'nenhuma largura que force rolagem');

ok(wisdom.includes("schoolEntry:'one-natural-next-lesson'"), 'um próximo passo V607 preservado');
ok(wisdom.includes('schoolModulesPreserved:17') && wisdom.includes('schoolLessonsPreserved:124'), 'programa V607 preservado');
ok(wisdom.includes("root.dataset.v607SchoolMode = 'lesson'"), 'uma aula por vez preservada');
ok(wisdom.includes('schoolNoteReads:0') && wisdom.includes('privateContentReads:0'), 'privacidade V607 preservada');
ok(wisdomStyles.includes('[data-v607-school-mode="lesson"]') && wisdomStyles.includes('.school-lesson:not(.is-v607-current)'), 'foco V607 preservado');
ok(schoolWorld.includes('SCHOOL_MODULES') && schoolWorld.includes('SCHOOL_LESSON_TOTAL'), 'autoridade escolar preservada');
ok(schoolWorld.includes('modules:17') && schoolWorld.includes('lessons:124') && schoolWorld.includes('stages:3'), 'estrutura V555 preservada');
ok(chambers.includes("this.engage('school', 'study', 'school-continue')"), 'entrada V596 preservada');
ok(chamberStyles.includes('.db596-school-paths') && chamberStyles.includes('scroll-snap-type:x mandatory'), 'caminhos V596 preservados');
ok(entry.includes('globalOrbMenuCycle:true') && entry.includes('everyRealityCanCallUniverse:true'), 'Orbe continua abrindo o menu global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 58, '58 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v612-global-pentagram-tarot-fix'"), 'cache próprio');
ok(sw.includes("'./escola-soul-v610.js?v=610-work13-school-soul'"), 'JS no cache');
ok(sw.includes("'./escola-soul-v610.css?v=610-work13-school-soul'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_SCHOOL_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-escola-soul-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-escola-soul-styles-missing'), 'estilo validado pelo worker');

ok(hash(orchestra) === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');
ok(hash(tarot) === 'df82aab23d6b74b52d455202484d95aa802cc0e3ed3383e28005b49950594568', 'alma do Tarot protegida byte a byte');
ok(hash(tarotStyles) === '53bd7cd30891f4473fe85addbebfe1f09c8edb7768e9bc945572e33c5e0da3a6', 'visual do Tarot protegido byte a byte');
ok(hash(daily) === 'c5ca4de3881fc03a3425cc4a2e1d5c4703f9ce188e4640649f63bc136f68783f', 'alma da Carta do Dia protegida byte a byte');
ok(hash(dailyStyles) === '4ab92a4f206d75d51bd7b276408b6d057dcd9886a58f941c65a1777d898c7014', 'visual da Carta do Dia protegido byte a byte');
ok(hash(spreads) === '3eb2ccac06370f3ee48eaee8df8bf473449dbba234e737c6e21d555169a24c04', 'alma das Tiragens protegida byte a byte');
ok(hash(spreadsStyles) === '8a89a6a1edc5e4682c959de13449462b226132011e74c4ae2ba92fbd3b8d3771', 'visual das Tiragens protegido byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da alma da Escola V610`);
