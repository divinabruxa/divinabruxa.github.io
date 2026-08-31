#!/usr/bin/env node
/* Divina Bruxa — prova reproduzível do Motor do Tarot Livre — Checkpoint 2.1 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const moduleURL = `${pathToFileURL(path.join(root, 'tarot-session.js')).href}?audit=${Date.now()}`;
const {
  CARD_IDS,
  DECK_SIZE,
  TAROT_SESSION_SCHEMA,
  createTarotState,
  drawNextCard,
  isValidTarotState,
  normalizeTarotState,
  resetTarotState,
  restoreTarotState,
  serializeTarotState,
  shuffleIds,
  shuffleRemainingCards
} = await import(moduleURL);
const { CARDS } = await import(`${pathToFileURL(path.join(root, 'tarot-data.js')).href}?audit=${Date.now()}`);

const results = [];
const check = (name, condition, detail = '') => results.push({ name, pass: Boolean(condition), detail });
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const deterministicStill = max => max - 1;
const deterministicTurn = () => 0;

check('schema do Checkpoint 2.1 está ativa', TAROT_SESSION_SCHEMA === '5.2.1');
check('núcleo declara exatamente 78 posições', DECK_SIZE === 78 && CARD_IDS.length === 78);
check('catálogo canônico mantém 78 cartas normais', CARDS.length === 78 && CARDS.every(card => card.orientation === 'normal'));
check('IDs canônicos continuam únicos', new Set(CARD_IDS).size === 78);

const first = createTarotState({ randomInt: deterministicStill, now: () => 1000 });
check('nova mesa começa com 78 cartas aguardando', first.waiting.length === 78 && first.revealed.length === 0);
check('nova mesa começa incompleta', first.completed === false);
check('nova mesa é validada pelo contrato', isValidTarotState(first));
check('embaralhamento não modifica a lista de origem', (() => {
  const source = [0, 1, 2, 3];
  const copy = shuffleIds(source, deterministicTurn);
  return source.join(',') === '0,1,2,3' && copy.length === source.length;
})());

let session = first;
const revealedIds = [];
let positionsCorrect = true;
for (let index = 0; index < DECK_SIZE; index += 1) {
  const result = drawNextCard(session, { now: () => 1001 + index });
  if (result.position !== index || result.cardId === null) positionsCorrect = false;
  revealedIds.push(result.cardId);
  session = result.state;
}
check('cada toque ocupa exatamente a próxima posição', positionsCorrect);
check('78 toques revelam exatamente 78 cartas', session.revealed.length === 78 && session.waiting.length === 0);
check('as 78 revelações não possuem repetição', new Set(revealedIds).size === 78);
check('todas as cartas do catálogo aparecem uma vez', CARD_IDS.every(id => revealedIds.includes(id)));
check('mesa completa é marcada automaticamente', session.completed === true);

const afterComplete = drawNextCard(session, { now: () => 2000 });
check('o 79º toque não revela outra carta', afterComplete.cardId === null && afterComplete.position === -1);
check('o 79º toque não altera a mesa completa', afterComplete.state.revealed.length === 78 && afterComplete.state.waiting.length === 0);

let partial = createTarotState({ randomInt: deterministicStill, now: () => 3000 });
for (let index = 0; index < 13; index += 1) partial = drawNextCard(partial, { now: () => 3001 + index }).state;
const openedBefore = [...partial.revealed];
const waitingBefore = [...partial.waiting];
const reshuffled = shuffleRemainingCards(partial, { randomInt: deterministicTurn, now: () => 4000 });
check('embaralhar restantes preserva as 13 cartas abertas', reshuffled.revealed.join(',') === openedBefore.join(','));
check('embaralhar restantes preserva as 65 cartas aguardando', reshuffled.waiting.length === 65 && new Set(reshuffled.waiting).size === 65);
check('embaralhar restantes preserva o mesmo conjunto', waitingBefore.every(id => reshuffled.waiting.includes(id)));
check('embaralhar restantes realmente muda a ordem', reshuffled.waiting.join(',') !== waitingBefore.join(','));
check('mesa continua válida após novo embaralhamento', isValidTarotState(reshuffled));

const serialized = serializeTarotState(reshuffled);
const resumed = restoreTarotState(serialized, { now: () => 5000 });
check('sessão serializada pode ser retomada', resumed !== null && isValidTarotState(resumed));
check('retomada preserva a ordem já revelada', resumed?.revealed.join(',') === reshuffled.revealed.join(','));
check('retomada preserva a ordem restante', resumed?.waiting.join(',') === reshuffled.waiting.join(','));
check('retomada preserva identidade e revisão', resumed?.sessionId === reshuffled.sessionId && resumed?.revision === reshuffled.revision);

const forbiddenKey = ['rev', 'ersed'].join('');
const legacyCandidate = { ...JSON.parse(serialized), [forbiddenKey]: Array(13).fill(false) };
const migrated = normalizeTarotState(legacyCandidate, { now: () => 6000 });
check('sessão antiga íntegra é migrada sem perder cartas', migrated?.revealed.join(',') === reshuffled.revealed.join(','));
check('migração remove a propriedade de orientação antiga', migrated && !Object.hasOwn(migrated, forbiddenKey));
check('estado persistido contém somente orientação normal', migrated?.normalOnly === true && !serialized.includes(forbiddenKey));

const duplicateCorruption = { ...reshuffled, waiting: [...reshuffled.waiting.slice(1), reshuffled.waiting[1]] };
const missingCorruption = { ...reshuffled, waiting: reshuffled.waiting.slice(1) };
const foreignCorruption = { ...reshuffled, waiting: [999, ...reshuffled.waiting.slice(1)] };
check('sessão com carta duplicada é rejeitada', normalizeTarotState(duplicateCorruption) === null);
check('sessão com carta faltando é rejeitada', normalizeTarotState(missingCorruption) === null);
check('sessão com ID estranho é rejeitada', normalizeTarotState(foreignCorruption) === null);
check('JSON corrompido é rejeitado com segurança', restoreTarotState('{não-é-json') === null);

const reset = resetTarotState({ randomInt: deterministicStill, now: () => 7000 });
check('recomeçar cria outra mesa completa', reset.waiting.length === 78 && reset.revealed.length === 0 && isValidTarotState(reset));
check('recomeçar cria uma identidade de sessão nova', reset.sessionId !== reshuffled.sessionId);

let stressOk = true;
for (let cycle = 0; cycle < 2048; cycle += 1) {
  let state = createTarotState();
  const cycleCards = [];
  for (let draw = 0; draw < DECK_SIZE; draw += 1) {
    const result = drawNextCard(state);
    cycleCards.push(result.cardId);
    state = result.state;
  }
  if (new Set(cycleCards).size !== DECK_SIZE || !state.completed || !isValidTarotState(state)) stressOk = false;
}
check('2.048 mesas completas passam sem repetição', stressOk);

const engine = read('tarot-engine.js');
const index = read('index.html');
const sw = read('sw.js');
const tarotSection = index.match(/<section id="tarot"[\s\S]*?<\/section>/)?.[0] ?? '';
check('revelação da interface nasce somente do clique na Orbe', engine.includes("this.orb.addEventListener('click', () => this.draw())"));
check('motor não usa gesto de arrastar para revelar', !/(dragstart|pointermove|touchmove)/.test(engine));
check('Tarot Livre não importa significados', !/(meaning-engine|tarot-meanings)/.test(engine));
check('Tarot Livre declara somente imagens e sem significado', tarotSection.includes('Somente as imagens') && tarotSection.includes('sem significado'));
check('interface promete e motor garante ausência de repetição', tarotSection.includes('sem repetição') && engine.includes('drawNextCard'));
check('mesa real mantém as 78 posições', engine.includes('Array.from({ length: DECK_SIZE }'));
check('cartas abertas continuam clicáveis apenas para consulta visual', engine.includes("closest('[data-index]')") && engine.includes('this.show('));
check('motor bloqueia toques simultâneos', engine.includes('if (this.drawing || this.state.completed) return null'));
check('motor retoma a sessão guardada', engine.includes('normalizeTarotState(this.storage.get(STORAGE_KEY, null))'));
check('motor sincroniza retomada entre abas', engine.includes("addEventListener?.('storage'") && engine.includes('event.newValue'));
check('recomeçar mantém confirmação contra perda acidental', engine.includes('globalThis.confirm'));
check('preload continua limitado às três próximas cartas', engine.includes('preloadCardImages(this.state.waiting, 3)'));
check('nenhuma classe de inversão existe no motor', !engine.includes('state.' + forbiddenKey) && !engine.includes(`classList.add('${forbiddenKey}')`));
check('carta exibida recebe marca explícita DIRETA', engine.includes('<span>DIRETA</span>'));
check('texto de status é acessível e acompanha cartas restantes', tarotSection.includes('aria-live="polite"') && engine.includes('Revelar próxima carta. ${waiting} restantes.'));
const appVersion = Number(index.match(/app\.js\?v=(\d+)/)?.[1] ?? 0);
const engineVersion = Number(read('app.js').match(/tarot-engine\.js\?v=(\d+)/)?.[1] ?? 0);
check('aplicativo aponta para o motor definitivo', appVersion >= 81 && engineVersion >= 81, `app: ${appVersion}; motor: ${engineVersion}`);
check('modo offline inclui núcleo, motor e armazenamento', ['tarot-session.js', 'tarot-engine.js', 'storage.js'].every(file => sw.includes(`'./${file}'`)));
check('cache da Macroetapa 2 está isolado', /cp2[1-4]-(tarot-livre|mesa-real|controles|regra-editorial)/.test(sw));

for (const result of results) console.log(`${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
const passed = results.filter(result => result.pass).length;
console.log(`\n${passed}/${results.length} verificações aprovadas.`);
if (passed !== results.length) process.exitCode = 1;
else console.log('Motor do Tarot Livre aprovado: 78 cartas normais, sem repetição, persistente e protegido.');
