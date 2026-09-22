import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [
  html,app,sw,world,styles,soul,soulStyles,cosmic,cosmicStyles,
  daily,dailyStyles,tarot,tarotStyles,library,libraryStyles,entry,entryStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./tiragens-world-v617.js'),read('./tiragens-world-v617.css'),
  read('./tiragens-soul-v610.js'),read('./tiragens-soul-v610.css'),
  read('./cosmic-spread-reading-v605.js'),read('./cosmic-spread-reading-v605.css'),
  read('./carta-do-dia-world-v616.js'),read('./carta-do-dia-world-v616.css'),
  read('./tarot-livre-soul-v610.js'),read('./tarot-livre-world-v614.css'),
  read('./biblioteca-soul-v610.js'),read('./biblioteca-world-v615.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="spreads"/g) === 1, 'um mundo de Tiragens');
ok(count(html,/id="spreadGrid"/g) === 1, 'uma escolha de métodos');
ok(count(html,/id="spreadResult"/g) === 1, 'um altar de leitura');
ok(count(html,/id="spreadIntention"/g) === 1, 'uma intenção existente');
ok(!/id="(?:tiragens|spreads)OrbV617"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V618"') && html.includes('V618-ESCOLA-JARDIM-DAS-78-SEMENTES'), 'release cumulativa V618');
ok(html.includes('app-v208.js?v=618-escola-jardim-das-78-sementes'), 'app cumulativo V618');

ok(count(app,/createTiragensWorldV617/g) === 2, 'importação e criação únicas');
ok(app.includes("tiragens-world-v617.js?v=617-concilio-das-constelacoes"), 'mundo ligado ao app');
ok(app.includes('createTiragensWorldV617({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.tiragensWorld = tiragensWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13TiragensWorldV617'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-4-tiragens'"), 'quarta renovação declarada');
ok(app.includes("universe:'concilio-das-constelacoes'"), 'universo declarado');
ok(app.includes('tiragensWorldStatus:tiragensWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_SPREADS_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV617'), 'continuidade pública V617');
ok(app.includes("document.documentElement.dataset.work13Macro = 'escola-jardim-das-78-sementes'"), 'macroetapa cumulativa ativa');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'TIRAGENS_WORLD_CONTRACT_V617',"universe:'concilio-das-constelacoes'",
  "identity:'deep-teal-copper-ivory'",
  "sequence:Object.freeze(['arrival','choice','orb','card-and-position','silence','essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])",
  "spreadAuthority:'V331-preserved'","cosmicReadingAuthority:'V605-preserved'","soulAuthority:'V610-preserved'",
  'methodsPreserved:15','freeMethodsPreserved:4','premiumMethodsPreserved:11',
  'premiumTransparencyPreserved:true','celticCrossPositionsPreserved:10','royalTableCardsPreserved:78',
  "royalTableGeometryPreserved:'13x6'",'normalOnly:true','noRepeats:true',
  "cardsSpeakBy:Object.freeze(['position','suit','element','arcana','number','court','repetition','contrast','reinforcement','challenge'])",
  'maximumConversationVoices:3','maximumSynthesisSentences:1','depthRequiresExplicitGesture:true',
  "canonicalOrbAction:'reveal-next-position'",'pentagramMenuPreserved:true','reusesCanonicalOrb:true',
  'cardSelectionChanges:0','shuffleChanges:0','premiumAuthorityChanges:0','persistenceChanges:0',
  'synthesisAuthorityChanges:0','automaticNavigation:false','automaticWhitSpeech:false',
  'privateContentReads:0','intentionReads:0','questionReads:0','cardIdentityReads:0','unrevealedCardReads:0',
  'storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'newVisibleDomNodes:0','newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê pergunta, intenção ou carta');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'As cartas encontram uma voz comum.'"), 'identidade visível curta');
ok(world.includes("'divina:spreads-supreme-ready'") && world.includes("'divina:cosmic-spread-reading-updated'"), 'motores públicos acompanhados');
ok(world.includes("candidate.closest?.('#spreadResult')"), 'ação local exige a Orbe dentro do altar');

for (const token of [
  '[data-spreads-world="v617"]','[data-spreads-world-phase="choosing"]',
  '[data-spreads-world-phase="answering"]','[data-spreads-world-phase="silence"]',
  '#spreadGrid','#spreadIntention','#spreadResult','.spread-reading[data-spreads-world="v617"]',
  '.spread-active-meaning[data-cosmic-card-reading="v605"]','.db605-card-essence','.db605-depth-call',
  '[data-cosmic-spread-synthesis="v605"]','.db605-conversation','.db605-synthesis-phrase',
  '[data-spread-id="royal-table"]','scroll-snap-type:x proximity','scroll-snap-align:center',
  'overscroll-behavior-inline:contain','-webkit-overflow-scrolling:touch',
  'content-visibility:auto','contain-intrinsic-size:720px',
  '@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)',
  'safe-area-inset-top','safe-area-inset-bottom','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(styles.includes('--tr617-teal') && styles.includes('--tr617-copper') && styles.includes('--tr617-ivory'), 'paleta própria completa');
ok(styles.includes('content:"CONCÍLIO DAS CONSTELAÇÕES"'), 'nome do mundo presente');
ok(styles.includes('content:"PREMIUM"'), 'Premium continua transparente');
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(styles), 'nenhum efeito pesado ou loop');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável de viewport');

ok(soul.includes('methodsPreserved:15') && soul.includes('freeMethodsPreserved:4') && soul.includes('premiumMethodsPreserved:11'), 'alma V610 preserva os quinze métodos');
ok(soul.includes('celticCrossPositionsPreserved:10') && soul.includes('royalTableCardsPreserved:78') && soul.includes("royalTableGeometryPreserved:'13x6'"), 'estruturas extensas preservadas');
ok(cosmic.includes("sequence:Object.freeze(['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])"), 'conversa V605 preservada');
ok(cosmic.includes('maximumConversationVoices:3') && cosmic.includes('maximumVisibleSynthesisSentences:1'), 'síntese V605 preservada');
ok(cosmic.includes('privateContentReads:0') && cosmic.includes('questionReads:0') && cosmic.includes('unrevealedCardReads:0'), 'privacidade V605 preservada');
ok(cosmicStyles.includes('[data-cosmic-spread-phase="silence"]') && cosmicStyles.includes('.db605-conversation'), 'camadas V605 preservadas');
ok(entry.includes("target?.closest?.('#spreadResult')"), 'menu global não captura a Orbe da tiragem');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 64, '64 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v618-escola-jardim-78-sementes'"), 'cache próprio');
ok(sw.includes("'./tiragens-world-v617.js?v=617-concilio-das-constelacoes'"), 'JS no cache');
ok(sw.includes("'./tiragens-world-v617.css?v=617-concilio-das-constelacoes'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_SPREADS_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-tiragens-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-tiragens-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [soul,'3eb2ccac06370f3ee48eaee8df8bf473449dbba234e737c6e21d555169a24c04','alma V610'],
  [soulStyles,'8a89a6a1edc5e4682c959de13449462b226132011e74c4ae2ba92fbd3b8d3771','visual V610'],
  [cosmic,'6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b','leitura V605'],
  [cosmicStyles,'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff','visual V605'],
  [daily,'e68041587c325ade6562b641e08840a7cae23f66ca9bbc72afdfdd9c65d6df8e','Santuário V616'],
  [dailyStyles,'abb7914b529d2b24433381d39406076e8aec611ad55e184a1a0a0bdbb56103e0','visual V616'],
  [tarot,'7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0','Tarot V614'],
  [tarotStyles,'0c7213229a4acc196e48b114700d6f4cdb16881faf0623dd5ab8a50359027b55','visual V614'],
  [library,'1dcf29e6e20ebb824fe291de52452d2ff7e03d07d4099a81b62c3920a33f32ad','Biblioteca V615'],
  [libraryStyles,'4c5bde57ea184568bcaa8205dc52c6ec04a1bf024abe71db4a3e93f9970092d3','visual V615'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual do menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610']
]) ok(hash(source) === expected, `${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura do Concílio das Constelações V617`);
