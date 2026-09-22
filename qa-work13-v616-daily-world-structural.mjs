import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,world,styles,soul,soulStyles,daily,ritual,cosmic,cosmicStyles,entry,tarot,library] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./carta-do-dia-world-v616.js'),read('./carta-do-dia-world-v616.css'),
  read('./carta-do-dia-soul-v610.js'),read('./carta-do-dia-soul-v610.css'),
  read('./daily-world-v509.js'),read('./reading-ritual-core-v595.js'),
  read('./cosmic-daily-reading-v604.js'),read('./cosmic-daily-reading-v604.css'),
  read('./cosmos-entry-intention-v610.js'),read('./tarot-livre-soul-v610.js'),
  read('./biblioteca-soul-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="daily"/g) === 1, 'uma realidade diária');
ok(count(html,/id="dailyCard"/g) === 1, 'um altar diário');
ok(html.includes('content="V618"') && html.includes('V618-ESCOLA-JARDIM-DAS-78-SEMENTES'), 'release cumulativa V618');
ok(html.includes('app-v208.js?v=618-escola-jardim-das-78-sementes'), 'app cumulativo V618');

ok(count(app,/createCartaDoDiaWorldV616/g) === 2, 'importação e criação únicas');
ok(app.includes("carta-do-dia-world-v616.js?v=616-santuario-da-aurora"), 'mundo ligado ao app');
ok(app.includes('createCartaDoDiaWorldV616({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.cartaDoDiaWorld = cartaDoDiaWorld'), 'mundo publicado na Orbe');
ok(app.includes('window.divinaWork13CartaDoDiaWorldV616'), 'estado público próprio');
ok(app.includes("universe:'santuario-da-aurora'"), 'universo declarado');
ok(app.includes('cartaDoDiaWorldStatus:cartaDoDiaWorld?.status?.() || null'), 'auditoria reunida');
ok(app.includes('window.divinaCosmosVivoV616'), 'continuidade pública V616');
ok(app.includes('work14:false'), 'nenhum WORK14');

for (const token of [
  'CARTA_DO_DIA_WORLD_CONTRACT_V616',"universe:'santuario-da-aurora'",
  "identity:'indigo-horizon-gold-coral'",
  "sequence:Object.freeze(['arrival','orb','touch','card','silence','one-sentence-essence','depth-on-explicit-request'])",
  "dailyAuthority:'V554-preserved'","ritualAuthority:'V595-preserved'",
  "cosmicReadingAuthority:'V604-preserved'","soulAuthority:'V610-preserved'",
  'cardsPerBrasiliaDay:1',"timeZone:'America/Sao_Paulo'",'normalCardsOnly:true',
  'accountContinuityPreserved:true','crossDeviceContinuityPreserved:true',
  'maximumEssenceSentences:1','depthRequiresExplicitGesture:true',
  "canonicalOrbAction:'reveal-daily-card'",'pentagramMenuPreserved:true',
  'reusesCanonicalOrb:true','cardSelectionChanges:0','dailyPolicyChanges:0',
  'meaningChanges:0','persistenceChanges:0','automaticWhitSpeech:false',
  'newVisibleDomNodes:0','newCanvases:0','newRenderers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','networkCalls:0','work14:false'
]) ok(world.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(world), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(world), 'sem roteador paralelo');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(world), 'sem relógio ou observador');
ok(count(world,/createElement\?\.\('link'\)/g) === 1, 'somente a folha de estilo nasce');
ok(world.includes("'SANTUÁRIO DA AURORA'"), 'identidade visível curta');

for (const token of [
  '[data-daily-world="v616"]','[data-daily-world-phase="answering"]',
  '[data-daily-world-phase="symbol"]','[data-daily-world-phase="silence"]',
  '[data-reading-phase="depth"]','.dw509__sanctuary','.dw509__orb-host',
  '.dw509__card','.db604-daily-essence','.db595-reading-intention',
  'content-visibility:auto','contain-intrinsic-size:240px',
  '@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)',
  'safe-area-inset-top','safe-area-inset-bottom','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(styles), 'nenhum efeito pesado ou loop');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');

ok(daily.includes("timeZone:'America/Sao_Paulo'"), 'Brasília preservada');
ok(daily.includes('onePerDay:true') && daily.includes('normalOnly:true'), 'uma carta direta por dia');
ok(daily.includes('createAccountDailyRecord') && daily.includes('dailyCard()'), 'continuidade por conta preservada');
ok(ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])"), 'rito V595 preservado');
ok(cosmic.includes("sequence:Object.freeze(['card','silence','one-sentence-essence','depth-on-explicit-request'])"), 'leitura V604 preservada');
ok(cosmic.includes('maximumEssenceSentences:1'), 'uma frase preservada');
ok(entry.includes("target?.closest?.('[data-daily-orb-host]')"), 'menu não captura a Orbe diária');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 64, '64 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v618-escola-jardim-78-sementes'"), 'cache cumulativo próprio');
ok(sw.includes("'./carta-do-dia-world-v616.js?v=616-santuario-da-aurora'"), 'JS no cache');
ok(sw.includes("'./carta-do-dia-world-v616.css?v=616-santuario-da-aurora'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_DAILY_WORLD_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-carta-do-dia-world-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-carta-do-dia-world-styles-missing'), 'estilo validado pelo worker');

ok(hash(soul) === 'c5ca4de3881fc03a3425cc4a2e1d5c4703f9ce188e4640649f63bc136f68783f', 'alma V610 protegida byte a byte');
ok(hash(soulStyles) === '4ab92a4f206d75d51bd7b276408b6d057dcd9886a58f941c65a1777d898c7014', 'visual V610 protegido byte a byte');
ok(hash(cosmic) === '747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c', 'leitura V604 protegida byte a byte');
ok(hash(cosmicStyles) === '04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5', 'camadas V604 protegidas byte a byte');
ok(hash(tarot) === '7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0', 'Tarot V614 protegido byte a byte');
ok(hash(library) === '1dcf29e6e20ebb824fe291de52452d2ff7e03d07d4099a81b62c3920a33f32ad', 'Biblioteca V615 protegida byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura do Santuário da Aurora V616`);
