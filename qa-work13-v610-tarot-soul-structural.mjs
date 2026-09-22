import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html,app,sw,soul,styles,entry,orchestra] = await Promise.all([
  read('./index.html'),read('./app-v208.js'),read('./sw.js'),
  read('./tarot-livre-soul-v610.js'),read('./tarot-livre-world-v614.css'),
  read('./cosmos-entry-intention-v610.js'),
  read('./cosmos-final-orchestra-v610.js')
]);
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;

ok(count(html,/id="orb"/g) === 1, 'uma Orbe física');
ok(count(html,/id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html,/<section id="tarot"/g) === 1, 'um Tarot Livre');
ok(count(html,/id="tableOrb"/g) === 1, 'um altar de revelação');
ok(html.includes('aria-rowcount="13"') && html.includes('aria-colcount="6"'), 'Mesa Real 13 por 6');
ok(html.includes('78 cartas sem repetição'), 'regra das 78 preservada');
ok(html.includes('DIRETA · SEM SIGNIFICADO'), 'orientação direta preservada');
ok(html.includes('id="shuffleDeck"') && html.includes('id="resetDeck"'), 'embaralhar e recomeçar preservados');
ok(html.includes('id="lightboxPrev"') && html.includes('id="lightboxNext"'), 'histórico navegável preservado');

ok(count(app,/createTarotLivreSoulV610/g) === 2, 'importação e criação únicas');
ok(app.includes("tarot-livre-soul-v610.js?v=614-camara-vazio-violeta"), 'mundo ligado ao app');
ok(app.includes('createTarotLivreSoulV610({ orbCore:supremeOrb })'), 'mesma Orbe reutilizada');
ok(app.includes('window.orbe.tarotLivreSoul = tarotLivreSoul'), 'alma publicada na Orbe');
ok(app.includes('divinaWork13TarotLivreWorldV614'), 'mundo V614 publicado');
ok(app.includes("stage:'renovacao-dos-mundos-1-tarot-livre'"), 'renovação do primeiro mundo declarada');
ok(app.includes('work14:false'), 'nenhum WORK14');
ok(entry.includes('realityOwnedOrbActionsPreserved:true'), 'menu global preserva ação local');
ok(entry.includes("if (this.route === 'tarot') return true;"), 'toda a Orbe física pertence ao Tarot Livre');
ok((entry.match(/if \(this\.route === 'tarot'\) return;/g) || []).length === 3, 'pointer, clique e teclado globais cedem ao Tarot');
ok(entry.includes("tarotOrbAction:'reveal-only'") && entry.includes('tarotOrbOpensMenu:false'), 'toque da Orbe revela e não abre o menu');

for (const token of [
  'TAROT_LIVRE_WORLD_CONTRACT_V614',"sequence:Object.freeze(['arrival','orb-alone','touch','card','silence','freedom'])",
  "universe:'camara-do-vazio-violeta'",'orbAloneOutsideMenu:true','orbitingListsVisible:false',
  "revealEvent:'tarot:supreme-revealed'",'tableDeferredRendering:true',
  'cards:78','rows:13','columns:6','reversedCards:false','repetitionBeforeReset:false',
  'automaticMeanings:false','cardSelectionChanges:0','reusesCanonicalOrb:true',
  'permanentAnimationLoops:0','mutationObservers:0','deferredTimers:0','work14:false'
]) ok(soul.includes(token), `contrato: ${token}`);

ok(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(soul), 'sem dados ou rede');
ok(!/\.navigate\(|location\.(?:href|assign|replace)|\bgo\(/.test(soul), 'sem roteador paralelo');
ok(!/innerHTML|insertAdjacentHTML|textContent\s*=/.test(soul), 'sem conteúdo visível injetado');
ok(!/setTimeout|setInterval|requestAnimationFrame|MutationObserver/.test(soul), 'sem relógio ou observador');
ok(count(soul,/createElement\?\.\('link'\)/g) === 1, 'somente link de estilo criado');

for (const token of [
  '[data-tarot-world="v614"]','[data-tarot-soul-phase="answering"]',
  '[data-tarot-soul-phase="receiving"]','[data-tarot-soul-phase="silence"]','#revealAltar','#current','#tableOrb',
  '.ritual-sky','.altar-rings','.orbital-cards','.ritual-stats','content-visibility:auto',
  '#realTableViewport','@media(max-width:430px)','@media(orientation:landscape)',
  '@media(prefers-reduced-motion:reduce)','safe-area-inset-top','safe-area-inset-bottom'
]) ok(styles.includes(token), `estilo: ${token}`);
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(styles), 'nenhum efeito pesado ou loop');
ok(!/url\(|data:image|<svg/.test(styles), 'nenhum ativo visual novo');
ok(styles.includes('#tarot>.free-rule') && styles.includes('display:none!important'), 'explicação repetida removida');
ok(styles.includes('body[data-screen="tarot"] .app-header') && styles.includes('body[data-screen="tarot"] .magic-dock'), 'navegação antiga recua diante do pentagrama');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core,/^\s*'\.\//gm) === 66, '66 ativos atômicos');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v619-diario-camara-tinta-viva'"), 'cache cumulativo próprio');
ok(sw.includes("'./tarot-livre-soul-v610.js?v=614-camara-vazio-violeta'"), 'JS no cache');
ok(sw.includes("'./tarot-livre-world-v614.css?v=614-camara-vazio-violeta'"), 'CSS no cache');
ok(sw.includes('DIVINA_WORK13_TAROT_SOUL_ACTIVE'), 'ativação comunicada');
ok(sw.includes('DIVINA_WORK13_TAROT_WORLD_ACTIVE'), 'novo mundo comunicado');
ok(sw.includes('work13-tarot-livre-soul-contract-missing'), 'contrato validado pelo worker');

const orchestraHash = createHash('sha256').update(orchestra).digest('hex');
ok(orchestraHash === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra protegida byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da Câmara do Vazio Violeta V614`);
