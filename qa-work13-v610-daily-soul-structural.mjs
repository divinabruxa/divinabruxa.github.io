import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,soul,styles,entry,daily,ritual,cosmic,cosmicStyles,tarot,tarotStyles,orchestra] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./carta-do-dia-soul-v610.js'),read('./carta-do-dia-soul-v610.css'),
  read('./cosmos-entry-intention-v610.js'),read('./daily-world-v509.js'),
  read('./reading-ritual-core-v595.js'),read('./cosmic-daily-reading-v604.js'),
  read('./cosmic-daily-reading-v604.css'),read('./tarot-livre-soul-v610.js'),
  read('./tarot-livre-soul-v610.css'),read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="daily"/g) === 1, 'uma Carta do Dia');
ok(count(html,/id="dailyCard"/g) === 1, 'um altar diário');

ok(count(app,/createCartaDoDiaSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("carta-do-dia-soul-v610.js?v=610-work13-daily-soul"), 'alma ligada ao app');
ok(app.includes('createCartaDoDiaSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.cartaDoDiaSoul = cartaDoDiaSoul'), 'alma publicada na Orbe');
ok(app.includes('window.divinaWork13CartaDoDiaSoulV610'), 'estado público próprio');
ok(app.includes("stage:'segunda-realidade-alma-propria'"), 'segunda realidade declarada');
ok(app.includes('cartaDoDiaSoulStatus:cartaDoDiaSoul?.status?.() || null'), 'auditoria reunida');
ok(app.includes('realitySouls:6'), 'seis realidades acumuladas');
ok(app.includes('work14:false'), 'nenhum WORK14');

ok(entry.includes('realityOwnedOrbActionsPreserved:true'), 'menu preserva ações locais');
ok(entry.includes("if (this.route === 'tarot') return true;"), 'Tarot Livre continua protegido em toda a Orbe');
ok(entry.includes('tarotOrbOpensMenu:false'), 'menu não captura a revelação do Tarot');
ok(entry.includes("target?.closest?.('[data-daily-orb-host]')"), 'Carta do Dia recebe o toque da Orbe');
ok(entry.includes("this.route === 'daily'"), 'rótulo diário tem contexto');

for (const token of [
  'CARTA_DO_DIA_SOUL_CONTRACT_V610',
  "sequence:Object.freeze(['orb','card','silence','one-sentence-essence','depth-on-explicit-request'])",
  "existingDailyAuthority:'V554-preserved'","existingRitualAuthority:'V595-preserved'",
  "existingCosmicReadingAuthority:'V604-preserved'",'cardsPerBrasiliaDay:1',
  "timeZone:'America/Sao_Paulo'",'accountContinuityPreserved:true',
  'crossDeviceContinuityPreserved:true','manualReveal:true','automaticReveal:false',
  'reversedCards:false','maximumEssenceSentences:1','depthRequiresExplicitGesture:true',
  'cardSelectionChanges:0','datePolicyChanges:0','accountPolicyChanges:0',
  'meaningChanges:0','persistenceChanges:0','reusesCanonicalOrb:true',
  'privateContentReads:0','intentionReads:0','cardIdentityReads:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente link de estilo criado');
ok(soul.includes("'divina:reading-ritual-phase'"), 'acompanha o rito existente');
ok(soul.includes("'divina:cosmic-daily-reading-updated'"), 'acompanha a essência existente');
ok(soul.includes("'divina:daily-v561-revealed'"), 'observa a revelação existente');

for (const token of [
  '[data-daily-soul="v610"]','[data-daily-soul-phase="answering"]',
  '[data-daily-soul-phase="symbol"]','[data-daily-soul-phase="silence"]',
  '[data-daily-soul-phase="essence"]','[data-daily-soul-phase="depth"]',
  '.dw509__sanctuary','.dw509__orb-host','.dw509__card','.db604-daily-essence',
  '.db595-reading-intention','[data-reading-phase="depth"]',
  '@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)',
  'safe-area-inset-top','safe-area-inset-bottom','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(styles), 'nenhum efeito pesado ou loop');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');

ok(daily.includes("timeZone:'America/Sao_Paulo'"), 'autoridade de Brasília preservada');
ok(daily.includes('onePerDay:true') && daily.includes('normalOnly:true'), 'uma carta direta por dia');
ok(daily.includes('createAccountDailyRecord') && daily.includes('dailyCard()'), 'continuidade por conta preservada');
ok(daily.includes('divina:daily-v561-revealed'), 'evento diário preservado');
ok(ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])"), 'rito V595 preservado');
ok(cosmic.includes("sequence:Object.freeze(['card','silence','one-sentence-essence','depth-on-explicit-request'])"), 'leitura V604 preservada');
ok(cosmic.includes('maximumEssenceSentences:1'), 'uma frase preservada');
ok(cosmicStyles.includes('[data-reading-phase="essence"]') && cosmicStyles.includes('[data-reading-phase="depth"]'), 'camadas existentes preservadas');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 72, '72 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v622-loja-casa-das-escolhas-vivas'"), 'cache próprio');
ok(sw.includes("'./carta-do-dia-soul-v610.js?v=610-work13-daily-soul'"), 'JS no cache');
ok(sw.includes("'./carta-do-dia-soul-v610.css?v=610-work13-daily-soul'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_DAILY_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-carta-do-dia-soul-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-carta-do-dia-soul-styles-missing'), 'estilo validado pelo worker');

ok(hash(orchestra) === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');
ok(hash(tarot) === '7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0', 'Câmara Violeta V614 protegida byte a byte');
ok(hash(tarotStyles) === '53bd7cd30891f4473fe85addbebfe1f09c8edb7768e9bc945572e33c5e0da3a6', 'visual do Tarot protegido byte a byte');
ok(hash(cosmic) === '747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c', 'leitura V604 protegida byte a byte');
ok(hash(cosmicStyles) === '04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5', 'visual V604 protegido byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da alma da Carta do Dia V610`);
