import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,soul,styles,wisdom,wisdomStyles,entry,school,schoolStyles,spreads,spreadsStyles,daily,dailyStyles,tarot,tarotStyles,orchestra] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./biblioteca-soul-v610.js'),read('./biblioteca-soul-v610.css'),
  read('./living-wisdom-path-v607.js'),read('./living-wisdom-path-v607.css'),
  read('./cosmos-entry-intention-v610.js'),read('./escola-soul-v610.js'),
  read('./escola-soul-v610.css'),read('./tiragens-soul-v610.js'),
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
ok(count(html,/<section id="library"/g) === 1, 'um mundo Biblioteca');
ok(count(html,/id="cardLibraryApp"/g) === 1, 'um app Biblioteca');
ok(!/id="(?:biblioteca|library)OrbV610"/.test(html), 'nenhuma Orbe duplicada');

ok(count(app,/createBibliotecaSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("biblioteca-soul-v610.js?v=610-work13-library-soul"), 'alma ligada ao app');
ok(app.includes('createBibliotecaSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.bibliotecaSoul = bibliotecaSoul'), 'alma publicada na Orbe');
ok(app.includes('window.divinaWork13BibliotecaSoulV610'), 'estado público próprio');
ok(app.includes("stage:'quinta-realidade-alma-propria'"), 'quinta realidade declarada');
ok(app.includes("universe:'arquivo-de-luz'"), 'Arquivo de Luz declarado');
ok(app.includes('bibliotecaSoulStatus:bibliotecaSoul?.status?.() || null'), 'auditoria reunida');
ok(app.includes('realitySouls:6'), 'seis realidades concluídas');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_LIBRARY_SOUL_ACTIVE'"), 'worker ouvido');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'BIBLIOTECA_SOUL_CONTRACT_V610',"universe:'arquivo-de-luz'",
  "'threshold','orb','one-discovery','silence','symbolic-thread'",
  "existingLibraryWorldAuthority:'V302-preserved'","existingLibraryDepthAuthority:'V332-preserved'",
  "existingPublicLibraryAuthority:'V544-preserved'","existingLivingWisdomAuthority:'V607-preserved'",
  'cardsPreserved:78','uprightCardsOnly:true','reversedCards:false',
  'cataloguePageSizePreserved:18','gridFullImageRequestsPreserved:0','oneDiscoveryFirst:true',
  'catalogueRequiresExplicitGesture:true',"'symbol','element','number','archetype','related-cards'",
  "'pt-BR','en','es'",'searchDiacriticsInsensitive:true','cardMeaningChanges:0',
  'cardSelectionChanges:0','searchChanges:0','filterChanges:0','comparisonChanges:0',
  'favouriteChanges:0','premiumAuthorityChanges:0','persistenceChanges:0',
  'reusesCanonicalOrb:true','reusesGlobalLivingMenu:true','visibleCopyAdded:0',
  'automaticNavigation:false','automaticWhitSpeech:false','privateContentReads:0',
  'cardIdentityReads:0','cardMeaningReads:0','searchQueryReads:0','comparisonReads:0',
  'favouriteReads:0','storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'newVisibleDomNodes:0','newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente o link de estilo é criado');
ok(soul.includes("'divina:library-world-ready'"), 'acompanha o mundo existente');
ok(soul.includes("'divina:public-library-ready'"), 'acompanha o catálogo existente');
ok(soul.includes("'divina:wisdom-public-context-v539'"), 'acompanha descoberta pública');
ok(soul.includes("'divina:menu-state'"), 'acompanha a Orbe global');
ok(!/\.value\b|\.textContent\b|\.innerText\b/.test(soul), 'não lê carta, significado ou busca');

for (const token of [
  '[data-library-soul="v610"]','[data-library-soul-phase="answering"]',
  '[data-library-soul-phase="discovery"]','[data-library-soul-phase="thread"]',
  '[data-library-soul-phase="catalogue"]','[data-library-soul-phase="search"]',
  '[data-library-soul-phase="portal"]','.db607-library-guide','.lb302','.lb302__head',
  '.lb302__sanctuary','.lb302__paths','.lb302__field','.lb302__hint','.pl544',
  '[data-library-grid]','[data-library-card]','[data-library-reader]',
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

ok(wisdom.includes("libraryEntry:'one-discovery-through-canonical-orb'"), 'descoberta V607 preservada');
ok(wisdom.includes("libraryCatalogue:'explicit-request-only'") && wisdom.includes('libraryCardsPreserved:78'), 'catálogo explícito preservado');
ok(wisdom.includes("querySelector?.('[data-orb]')?.click?.()"), 'Orbe canônica continua escolhendo');
ok(wisdom.includes('cardIdentityReads:0') && wisdom.includes('privateContentReads:0'), 'privacidade V607 preservada');
ok(wisdomStyles.includes('[data-v607-library-mode="focus"]') && wisdomStyles.includes('[data-v607-library-mode="catalogue"]'), 'camadas V607 preservadas');
ok(entry.includes("target?.closest?.('[data-library-orb-host]')"), 'toque local da Biblioteca não abre o menu');
ok(entry.includes("target?.closest?.('#cardLibraryApp [data-orb]')"), 'Orbe local preservada sem cópia');
ok(entry.includes('Orbe viva. Toque para descobrir uma carta'), 'ação local é anunciada');
ok(entry.includes("'divina:orb-physical-claim-settled'"), 'ação é sincronizada após a travessia');
ok(entry.includes('globalOrbMenuCycle:true') && entry.includes('everyRealityCanCallUniverse:true'), 'menu global continua acessível');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 58, '58 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v614-tarot-livre-camara-violeta'"), 'cache próprio');
ok(sw.includes("'./biblioteca-soul-v610.js?v=610-work13-library-soul'"), 'JS no cache');
ok(sw.includes("'./biblioteca-soul-v610.css?v=610-work13-library-soul'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_LIBRARY_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-biblioteca-soul-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-biblioteca-soul-styles-missing'), 'estilo validado pelo worker');

ok(hash(orchestra) === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');
ok(hash(wisdom) === 'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377', 'rito V607 protegido byte a byte');
ok(hash(wisdomStyles) === '765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118', 'visual V607 protegido byte a byte');
ok(hash(tarot) === '7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0', 'Câmara Violeta V614 protegida byte a byte');
ok(hash(tarotStyles) === '53bd7cd30891f4473fe85addbebfe1f09c8edb7768e9bc945572e33c5e0da3a6', 'visual do Tarot protegido byte a byte');
ok(hash(daily) === 'c5ca4de3881fc03a3425cc4a2e1d5c4703f9ce188e4640649f63bc136f68783f', 'Carta do Dia protegida byte a byte');
ok(hash(dailyStyles) === '4ab92a4f206d75d51bd7b276408b6d057dcd9886a58f941c65a1777d898c7014', 'visual diário protegido byte a byte');
ok(hash(spreads) === '3eb2ccac06370f3ee48eaee8df8bf473449dbba234e737c6e21d555169a24c04', 'Tiragens protegidas byte a byte');
ok(hash(spreadsStyles) === '8a89a6a1edc5e4682c959de13449462b226132011e74c4ae2ba92fbd3b8d3771', 'visual das Tiragens protegido byte a byte');
ok(hash(school) === '23446ccfb872519528ae52f8ce99d01ce2bb886f95dd3832b78f525c998ee3eb', 'Escola protegida byte a byte');
ok(hash(schoolStyles) === '2073c5fdc6d1b1b3b32484f32ac2ef28283335432de58c8042b2fa1016b43ba4', 'Jardim Arcano protegido byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da alma da Biblioteca V610`);
