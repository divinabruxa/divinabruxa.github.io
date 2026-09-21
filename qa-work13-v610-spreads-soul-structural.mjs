import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,soul,styles,entry,spread,spreadStyles,daily,dailyStyles,tarot,tarotStyles,orchestra] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./tiragens-soul-v610.js'),read('./tiragens-soul-v610.css'),
  read('./cosmos-entry-intention-v610.js'),read('./cosmic-spread-reading-v605.js'),
  read('./cosmic-spread-reading-v605.css'),read('./carta-do-dia-soul-v610.js'),
  read('./carta-do-dia-soul-v610.css'),read('./tarot-livre-soul-v610.js'),
  read('./tarot-livre-soul-v610.css'),read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const hash = source => createHash('sha256').update(source).digest('hex');

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="spreads"/g) === 1, 'um mundo de Tiragens');
ok(count(html,/id="spreadGrid"/g) === 1, 'uma escolha de estruturas');
ok(count(html,/id="spreadResult"/g) === 1, 'um altar de leitura');
ok(count(html,/id="spreadIntention"/g) === 1, 'uma intenção existente');
ok(!/id="(?:tiragens|spreads)OrbV610"/.test(html), 'nenhuma Orbe duplicada');

ok(count(app,/createTiragensSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("tiragens-soul-v610.js?v=610-work13-spreads-soul"), 'alma ligada ao app');
ok(app.includes('createTiragensSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.tiragensSoul = tiragensSoul'), 'alma publicada na Orbe');
ok(app.includes('window.divinaWork13TiragensSoulV610'), 'estado público próprio');
ok(app.includes("stage:'terceira-realidade-alma-propria'"), 'terceira realidade declarada');
ok(app.includes('tiragensSoulStatus:tiragensSoul?.status?.() || null'), 'auditoria reunida');
ok(app.includes('realitySouls:6'), 'seis realidades acumuladas');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_SPREADS_SOUL_ACTIVE'"), 'worker ouvido');
ok(app.includes('work14:false'), 'nenhum WORK14');

ok(entry.includes('realityOwnedOrbActionsPreserved:true'), 'menu global preserva ações locais');
ok(entry.includes("if (this.route === 'tarot') return true;"), 'Tarot Livre continua protegido em toda a Orbe');
ok(entry.includes('tarotOrbOpensMenu:false'), 'menu não captura a revelação do Tarot');
ok(entry.includes("target?.closest?.('[data-daily-orb-host]')"), 'Carta do Dia continua protegida');
ok(entry.includes("target?.closest?.('#spreadResult')"), 'Orbe da tiragem recebe o gesto');
ok(entry.includes("this.route === 'spreads'"), 'rótulo da Orbe tem contexto de Tiragens');

for (const token of [
  'TIRAGENS_SOUL_CONTRACT_V610',
  "sequence:Object.freeze(['choice','orb','revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])",
  "existingSpreadAuthority:'V331-preserved'","existingCosmicReadingAuthority:'V605-preserved'",
  'methodsPreserved:15','freeMethodsPreserved:4','premiumMethodsPreserved:11',
  'celticCrossPositionsPreserved:10','royalTableCardsPreserved:78',
  "royalTableGeometryPreserved:'13x6'",'normalOnly:true','noRepeats:true',
  'maximumConversationVoices:3','maximumSynthesisSentences:1',
  'depthRequiresExplicitGesture:true','cardSelectionChanges:0','shuffleChanges:0',
  'premiumAuthorityChanges:0','persistenceChanges:0','synthesisChanges:0',
  'reusesCanonicalOrb:true','reusesGlobalLivingMenu:true','visibleCopyAdded:0',
  'automaticNavigation:false','automaticWhitSpeech:false','privateContentReads:0',
  'intentionReads:0','questionReads:0','cardIdentityReads:0','unrevealedCardReads:0',
  'storageReads:0','storageWrites:0','networkCalls:0','modelCalls:0',
  'newVisibleDomNodes:0','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente o link de estilo é criado');
ok(soul.includes("'divina:spreads-supreme-ready'"), 'acompanha o motor existente');
ok(soul.includes("'divina:cosmic-spread-reading-updated'"), 'acompanha V605');
ok(soul.includes("candidate.closest?.('#spreadResult')"), 'ação local exige a Orbe dentro do altar');
ok(!/\.value\b|\.textContent\b|\.innerText\b/.test(soul), 'não lê pergunta, intenção ou carta');

for (const token of [
  '[data-spreads-soul="v610"]','[data-spreads-soul-phase="answering"]',
  '[data-spreads-soul-phase="silence"]','[data-spreads-soul-phase="essence"]',
  '#spreadGrid','#spreadIntention','#spreadResult','.spread-reading[data-spreads-soul="v610"]',
  '#spreadResult #orb','.spread-active-meaning[data-cosmic-card-reading="v605"]',
  '.db605-card-essence','.db605-depth-call','[data-cosmic-spread-synthesis="v605"]',
  '[data-spread-id="royal-table"]','scroll-snap-type:x proximity',
  '@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)',
  'safe-area-inset-top','safe-area-inset-bottom','min-block-size:100dvh','min-block-size:100svh'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(styles), 'nenhum efeito pesado ou loop');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(!/position\s*:\s*fixed/.test(styles), 'nenhuma camada fixa nova');
ok(!/100vw/.test(styles), 'nenhuma largura que force rolagem');

ok(spread.includes("sequence:Object.freeze(['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])"), 'conversa V605 preservada');
ok(spread.includes('methodsPreserved:15') && spread.includes('celticCrossPositionsPreserved:10') && spread.includes('royalTableCardsPreserved:78'), 'estruturas V605 preservadas');
ok(spread.includes('maximumConversationVoices:3') && spread.includes('maximumVisibleSynthesisSentences:1'), 'síntese V605 preservada');
ok(spread.includes('privateContentReads:0') && spread.includes('questionReads:0') && spread.includes('unrevealedCardReads:0'), 'privacidade V605 preservada');
ok(spreadStyles.includes('[data-cosmic-spread-phase="silence"]') && spreadStyles.includes('.db605-conversation'), 'camadas visuais V605 preservadas');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 58, '58 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v615-biblioteca-sala-fios-vivos'"), 'cache próprio');
ok(sw.includes("'./tiragens-soul-v610.js?v=610-work13-spreads-soul'"), 'JS no cache');
ok(sw.includes("'./tiragens-soul-v610.css?v=610-work13-spreads-soul'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_SPREADS_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('work13-tiragens-soul-contract-missing'), 'contrato validado pelo worker');
ok(sw.includes('work13-tiragens-soul-styles-missing'), 'estilo validado pelo worker');

ok(hash(orchestra) === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');
ok(hash(tarot) === '7c6ed126a83031f429eb1e887926c97b0b3614c175caebea3335e422a1ac1fe0', 'Câmara Violeta V614 protegida byte a byte');
ok(hash(tarotStyles) === '53bd7cd30891f4473fe85addbebfe1f09c8edb7768e9bc945572e33c5e0da3a6', 'visual do Tarot protegido byte a byte');
ok(hash(daily) === 'c5ca4de3881fc03a3425cc4a2e1d5c4703f9ce188e4640649f63bc136f68783f', 'alma da Carta do Dia protegida byte a byte');
ok(hash(dailyStyles) === '4ab92a4f206d75d51bd7b276408b6d057dcd9886a58f941c65a1777d898c7014', 'visual da Carta do Dia protegido byte a byte');
ok(hash(spread) === '6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b', 'leitura V605 protegida byte a byte');
ok(hash(spreadStyles) === 'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff', 'visual V605 protegido byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da alma das Tiragens V610`);
