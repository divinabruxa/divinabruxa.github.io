import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name,import.meta.url),'utf8');
const [
  html,app,sw,world,styles,living,timing,soul,diarioWorld,diarioStyles,
  entry,entryStyles,orchestra
] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./whit-world-v620.js'),read('./whit-world-v620.css'),
  read('./whit-living-presence-v594.js'),read('./whit-silence-timing-v606.js'),
  read('./whit-orb-soul-bridge-v581.js'),read('./diario-world-v619.js'),read('./diario-world-v619.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const count = (source,pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="ai"/g) === 1, 'um mundo Whit');
ok(count(html,/id="aiApp"/g) === 1, 'um app Whit');
ok(!/id="(?:whit|ai)OrbV620"/.test(html), 'nenhuma Orbe duplicada');
ok(html.includes('name="divina-work13" content="V621"') && html.includes('V621-CONSULTAS-TEMPLO-DO-ENCONTRO'), 'release cumulativa V621');
ok(html.includes('app-v208.js?v=621-consultas-templo-do-encontro'), 'app cumulativo V621');

ok(count(app,/createWhitWorldV620/g) === 2, 'importação e criação únicas');
ok(app.includes("whit-world-v620.js?v=620-presenca-entre-mundos"), 'mundo ligado ao app');
ok(app.includes('livingPresence:whitLivingPresence') && app.includes('silenceTiming:whitSilenceTiming') && app.includes('soul:whitOrbSoul'), 'autoridades existentes reutilizadas');
ok(app.includes('window.orbe.whitWorld = whitWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13WhitWorldV620'), 'estado público próprio');
ok(app.includes("stage:'renovacao-dos-mundos-7-whit'"), 'sétima renovação declarada');
ok(app.includes("universe:'presenca-entre-mundos'"), 'universo declarado');
ok(app.includes('whitWorldStatus:whitWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_WHIT_WORLD_ACTIVE'"), 'worker ouvido');
ok(app.includes('window.divinaCosmosVivoV620'), 'continuidade pública V620');
ok(app.includes("document.documentElement.dataset.work13Macro = 'consultas-templo-do-encontro'"), 'macroetapa seguinte ativa');
ok(app.includes("document.documentElement.dataset.work13JournalWorld = 'v619'"), 'Diário V619 permanece');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'WHIT_WORLD_CONTRACT_V620',"universe:'presenca-entre-mundos'",
  "identity:'midnight-indigo-opal-electric-cyan'",
  "'arrival','silence','one-explicit-invitation','listening'",
  "'one-local-response','visible-session-trace'",
  "'context-on-explicit-consent','return','silence'",
  "localWhitAuthority:'V557-preserved'","orbSoulAuthority:'V581-preserved'",
  "livingPresenceAuthority:'V594-preserved'","silenceTimingAuthority:'V606-preserved'",
  'localDefaultPreserved:true','accountRequired:false','localApiCallsPreserved:0',
  'localModelCallsPreserved:0','localCreditsUsedPreserved:0','sessionMemoryTurnsPreserved:6',
  'sessionMemoryPersistent:false','sessionMemoryVisible:true','sessionMemoryRemovable:true',
  'persistentMemoryExplicitOnly:true','persistentMemoryUserControlled:true','visibleContextOnly:true',
  'exactContextReceiptsPreserved:true','sendConsentRequired:true','contextBodyStoredInReceipt:false',
  "defaultResponse:'silence'","visibleSpeechPolicy:'explicit-invitation-or-consent-only'",
  'maximumContextualOffersPerSession:2','automaticArrivalSpeech:false',
  'automaticRevealSpeech:false','automaticCompletionSpeech:false','automaticSkinSpeech:false',
  'helpBeforeSale:true','emotionalSalesPressure:false','emotionInference:false',
  'consciousnessClaim:false','literalWhitneyIdentity:false','voiceClone:false','soulClaim:false',
  'privateByDefault:true','journalSilentReads:0','schoolNoteSilentReads:0',
  'tarotQuestionSilentReads:0','privateContentReads:0','formValueReads:0',
  'messageBodyReads:0','historyReads:0','memoryBodyReads:0','accountDataReads:0',
  'storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'existingWhitBodyReused:true','separateWhitBody:false','whitFunctionChanges:0',
  'generationChanges:0','memoryAuthorityChanges:0','consentChanges:0','orbActionChanges:0',
  'reusesCanonicalOrb:true','pentagramMenuPreserved:true','automaticNavigation:false',
  'visibleCopyChanges:1','newVisibleDomNodes:0','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(!/\.value\b|\.innerText\b|innerHTML|insertAdjacentHTML/.test(world), 'não lê campos, mensagens ou memória');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'Há presença no intervalo.'"), 'identidade visível curta');
ok(world.includes("'divina:whit-living-offer'") && world.includes("'whit:supreme-state'"), 'somente sinais públicos acompanhados');

for (const token of [
  '[data-work13-whit-world="v620"]','[data-whit-world="v620"]',
  '[data-whit-world-phase="invited"]','[data-whit-world-phase="listening"]',
  '[data-whit-world-phase="responding"]','[data-whit-world-phase="present"]',
  '[data-whit-world-phase="settled"]','[data-whit-world-phase="silence"]',
  '[data-whit-world-phase="travel"]','[data-whit-world-phase="portal"]',
  '#aiApp','[role="log"]','[class*="conversation"]','[class*="memory"]','[class*="context"]',
  'content-visibility:auto','contain-intrinsic-size:220px',
  '@media(max-width:430px)','@media(orientation:landscape)','@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)','safe-area-inset-top','safe-area-inset-bottom',
  'min-block-size:100dvh','min-block-size:100svh','min-block-size:48px','touch-action:manipulation'
]) ok(styles.includes(token),`estilo: ${token}`);
ok(styles.includes('--ww620-void') && styles.includes('--ww620-indigo') && styles.includes('--ww620-cyan') && styles.includes('--ww620-opal'), 'paleta própria completa');
ok(styles.includes('content:"WHIT · PRESENÇA ENTRE MUNDOS"'), 'nome do mundo presente');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(styles), 'nenhum efeito pesado');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw|112vw/.test(styles), 'nenhuma largura instável');

ok(living.includes('const SESSION_OFFER_LIMIT = 2') && living.includes('maximumContextualOffersPerSession:SESSION_OFFER_LIMIT'), 'presença V594 preserva timing');
ok(living.includes('privateContentReads:0') && living.includes('formFieldReads:0') && living.includes('journalBodyReads:0'), 'presença V594 preserva privacidade');
ok(timing.includes("defaultResponse:'silence'") && timing.includes("visibleSpeechPolicy:'explicit-invitation-or-consent-only'"), 'silêncio V606 preservado');
ok(timing.includes('privateContentReads:0') && timing.includes('journalBodyReads:0') && timing.includes('questionReads:0'), 'timing V606 não invade conteúdo');
ok(soul.includes("'divina:work12-state'") && soul.includes('const API_COMPATIBILITY = 581') && soul.includes('newCanvas:false'), 'alma da Orbe preservada');
ok(entry.includes('globalMenuOnEveryPage:true') && entry.includes('pentagramVisibleWhileMenuOpen:true'), 'menu mágico permanece global');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 70, '70 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v621-consultas-templo-do-encontro'"), 'cache próprio');
ok(sw.includes("'./whit-world-v620.js?v=620-presenca-entre-mundos'"), 'JS no cache');
ok(sw.includes("'./whit-world-v620.css?v=620-presenca-entre-mundos'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_WHIT_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-whit-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-whit-world-styles-missing'), 'estilo validado pelo worker');

for (const [source,expected,label] of [
  [living,'8572a154f2ec4a35089de489b5dc4472d2cebc17c219b991d290ba8ab1833fc0','presença Whit V594'],
  [timing,'db625f3495efd65109144b780b8ea47b2177a4996ccc7e1fb215b27eff946e2a','silêncio Whit V606'],
  [soul,'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866','alma da Orbe V581'],
  [diarioWorld,'932c303a150cea51cf05ebc2c734f4a1bd689d8d1da4563a95839cfb3fed309a','Diário V619'],
  [diarioStyles,'8e8c694fdcdb706d4c4302b5535918b092041d004551627752876c897908fc16','visual Diário V619'],
  [entry,'0882f1c21de6ddf054a2e0d9b3a1e63907f4944264c7c45ae7932142cacbf7d6','menu V613'],
  [entryStyles,'d1b150c452598694c26e46b06a1fb5885f168705edfa41a3c64af8bc32424860','visual menu V613'],
  [orchestra,'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0','orquestra V610']
]) ok(hash(source) === expected,`${label} protegido byte a byte`);

console.log(`PASS ${checks}/${checks} — estrutura da Presença Entre Mundos V620`);
