/*
 * DIVINA BRUXA 4.1.2 · CARTAS QUE CONVERSAM
 *
 * Esta camada lê relações, não verbetes. Cada carta recebe a anterior,
 * modifica o movimento da mesa e entrega a próxima passagem. Todas as cartas
 * são consideradas internamente; Whit revela somente a história central.
 */

import { tarotKnowledge } from './whit-tarot-knowledge-v410.js';
import {
  positionedTarotCard,
  positionedTarotSpread
} from './whit-tarot-position-engine-v411.js';

export const DIALOGUE_ENGINE_NAME = 'MOTOR CARTAS QUE CONVERSAM';
export const DIALOGUE_ENGINE_VERSION = '4.1.2';

export const DIALOGUE_COVENANT = Object.freeze([
  'cada ligação nasce de duas identidades reais do Tarot',
  'a ordem muda a resposta porque receber uma carta não é o mesmo que antecedê-la',
  'posição e pergunta alteram o papel da relação sem substituir as cartas',
  'todas as cartas da mesa participam da análise, inclusive nas tiragens grandes',
  'a síntese mostra movimento, conflito, virada e direção em uma única voz',
  'nenhum motor acrescenta um parágrafo independente à consulta'
]);

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const clause = value => clean(value).replace(/[.!?…]+$/u, '');
const lower = value => {
  const text = clause(value);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};

const OPEN_PHASES = new Set(['opening', 'growth']);
const CHALLENGE_PHASES = new Set(['conflict', 'confrontation', 'rupture', 'uncertainty']);
const PAUSE_PHASES = new Set(['pause', 'assessment']);
const CHANGE_PHASES = new Set(['turn', 'transition', 'movement', 'awakening', 'ending']);
const INTEGRATION_PHASES = new Set(['integration', 'stability', 'mastery', 'culmination', 'completion', 'healing', 'revelation']);
const CHALLENGE_ROLES = new Set(['obstacle', 'fear', 'hidden']);
const CHOICE_ROLES = new Set(['advice', 'choice', 'freewill']);
const TERRITORY_OPENING = Object.freeze({
  love:'No amor', relationship:'No relacionamento', work:'No trabalho', money:'No dinheiro',
  family:'Na família', identity:'Na identidade', change:'Na mudança', decision:'Na decisão',
  spirituality:'Na espiritualidade', general:''
});

const ROLE_WEIGHT = Object.freeze({
  origin:3, past:2, present:3, obstacle:7, hidden:5, desire:3, fear:6,
  advice:6, choice:6, future:5, outcome:6, birth:4, ending:6,
  freewill:6, self:3, environment:3, general:1
});

const BRIDGES = Object.freeze({
  confronta:Object.freeze({ verb:'confronta', phrase:'confronta essa direção', weight:8 }),
  reabre:Object.freeze({ verb:'reabre', phrase:'reabre o caminho', weight:7 }),
  conclui:Object.freeze({ verb:'conclui', phrase:'leva o ciclo à consequência', weight:6 }),
  reinicia:Object.freeze({ verb:'reinicia', phrase:'transforma o fim em novo começo', weight:8 }),
  transforma:Object.freeze({ verb:'transforma', phrase:'muda a forma dessa história', weight:7 }),
  decide:Object.freeze({ verb:'decide', phrase:'obriga o movimento a escolher', weight:7 }),
  aprofunda:Object.freeze({ verb:'aprofunda', phrase:'aprofunda a mesma força', weight:5 }),
  materializa:Object.freeze({ verb:'materializa', phrase:'dá corpo ao que veio antes', weight:5 }),
  nomeia:Object.freeze({ verb:'nomeia', phrase:'dá nome ao que estava difuso', weight:5 }),
  humaniza:Object.freeze({ verb:'humaniza', phrase:'leva o movimento ao coração', weight:5 }),
  mobiliza:Object.freeze({ verb:'mobiliza', phrase:'converte compreensão em ação', weight:5 }),
  amplia:Object.freeze({ verb:'amplia', phrase:'coloca a experiência num ciclo maior', weight:6 }),
  integra:Object.freeze({ verb:'integra', phrase:'reúne as forças num sentido comum', weight:4 })
});

function phaseFamily(phase) {
  if (OPEN_PHASES.has(phase)) return 'opening';
  if (CHALLENGE_PHASES.has(phase)) return 'challenge';
  if (PAUSE_PHASES.has(phase)) return 'pause';
  if (CHANGE_PHASES.has(phase)) return 'change';
  if (INTEGRATION_PHASES.has(phase)) return 'integration';
  if (phase === 'choice') return 'choice';
  return 'development';
}

function bridgeKind(from, to) {
  const fromPhase = phaseFamily(from.knowledge.temporal.phase);
  const toPhase = phaseFamily(to.knowledge.temporal.phase);
  const toRole = to.classification.role;

  if (CHALLENGE_ROLES.has(toRole) || toPhase === 'challenge') return 'confronta';
  if (['ending', 'completion'].includes(from.knowledge.temporal.phase) && toPhase === 'opening') return 'reinicia';
  if (fromPhase === 'challenge' && ['opening', 'integration'].includes(toPhase)) return 'reabre';
  if (['ending', 'completion'].includes(to.knowledge.temporal.phase) || toRole === 'ending') return 'conclui';
  if (toPhase === 'change') return 'transforma';
  if (CHOICE_ROLES.has(toRole) || toPhase === 'choice') return 'decide';
  if (from.knowledge.card.suit && from.knowledge.card.suit === to.knowledge.card.suit) return 'aprofunda';
  if (to.knowledge.card.source === 'major' || to.knowledge.card.element === 'spirit') return 'amplia';
  if (to.knowledge.card.element === 'earth') return 'materializa';
  if (to.knowledge.card.element === 'air') return 'nomeia';
  if (to.knowledge.card.element === 'water') return 'humaniza';
  if (to.knowledge.card.element === 'fire') return 'mobiliza';
  return 'integra';
}

function relationScore(from, to, bridge) {
  const role = to.classification.role;
  const phaseChange = from.knowledge.temporal.phase !== to.knowledge.temporal.phase ? 2 : 0;
  const elementChange = from.knowledge.card.element !== to.knowledge.card.element ? 1 : 0;
  return bridge.weight + (to.knowledge.intensity * 2) + (ROLE_WEIGHT[role] || 0) + phaseChange + elementChange;
}

function dialogueFromEntries(from, to, index = 0) {
  const kind = bridgeKind(from, to);
  const bridge = BRIDGES[kind];
  const territory = to.territory || from.territory;
  const territoryText = territory?.key && territory.key !== 'general'
    ? ` No território de ${territory.title}, essa mudança toca ${lower(territory.focus)}.`
    : '';
  const firstSentence = sentence(
    `${from.card.name}, em ${from.classification.title}, sustenta ${lower(from.knowledge.core.theme)}; ` +
    `${to.card.name}, em ${to.classification.title}, ${bridge.phrase} ao trazer ${lower(to.knowledge.core.theme)}`
  );
  const secondSentence = sentence(`A passagem se torna consciente quando você ${lower(to.knowledge.core.movement)}`);
  const pairKey = `${from.card.key}>${to.card.key}`;
  const contextualKey = `${pairKey}@${from.classification.role}>${to.classification.role}:${territory?.key || 'general'}`;

  return Object.freeze({
    index,
    pairKey,
    contextualKey,
    from:Object.freeze({
      key:from.card.key,
      name:from.card.name,
      position:from.classification.role,
      phase:from.knowledge.temporal.phase,
      element:from.knowledge.card.element
    }),
    to:Object.freeze({
      key:to.card.key,
      name:to.card.name,
      position:to.classification.role,
      phase:to.knowledge.temporal.phase,
      element:to.knowledge.card.element
    }),
    bridge:Object.freeze({ kind, verb:bridge.verb, phrase:bridge.phrase }),
    opening:sentence(`${from.card.name} entrega à próxima carta ${lower(from.knowledge.core.consequence)}`),
    response:sentence(`${to.card.name} responde ao mostrar que ${lower(to.knowledge.core.truth)}`),
    tension:sentence(to.knowledge.core.conflict),
    movement:sentence(to.knowledge.core.movement),
    summary:`${firstSentence} ${secondSentence}${territoryText}`.trim(),
    score:relationScore(from, to, bridge),
    signature:`${DIALOGUE_ENGINE_VERSION}:${contextualKey}`,
    integrity:Object.freeze({
      bothCardsUsed:true,
      orderMatters:true,
      positionAware:true,
      tarotGrounded:true,
      finalVoice:false
    })
  });
}

function cardScore(entry, index, total) {
  const role = entry.classification.role;
  const phase = phaseFamily(entry.knowledge.temporal.phase);
  const phaseWeight = ({ challenge:6, change:5, choice:5, integration:4, opening:3, pause:3, development:1 })[phase] || 1;
  const edgeWeight = index === 0 || index === total - 1 ? 2 : 0;
  const majorWeight = entry.knowledge.card.source === 'major' ? 3 : 0;
  return (entry.knowledge.intensity * 3) + (ROLE_WEIGHT[role] || 0) + phaseWeight + edgeWeight + majorWeight;
}

function rankedIndices(entries) {
  return Object.freeze(entries
    .map((entry, index) => Object.freeze({ index, score:cardScore(entry, index, entries.length), key:entry.card.key }))
    .sort((a, b) => b.score - a.score || a.index - b.index));
}

function sectorCount(total) {
  if (total <= 5) return 1;
  if (total <= 9) return 3;
  if (total <= 19) return 4;
  return 5;
}

function sectorLabels(count) {
  if (count === 1) return ['História central'];
  if (count === 3) return ['Abertura', 'Virada', 'Direção'];
  if (count === 4) return ['Abertura', 'Tensão', 'Virada', 'Direção'];
  return ['Abertura', 'Desenvolvimento', 'Tensão', 'Virada', 'Direção'];
}

function spreadSectors(entries, edges) {
  const count = sectorCount(entries.length);
  const labels = sectorLabels(count);
  return Object.freeze(Array.from({ length:count }, (_, sectorIndex) => {
    const startIndex = Math.floor((sectorIndex * entries.length) / count);
    const endIndex = Math.max(startIndex, Math.floor(((sectorIndex + 1) * entries.length) / count) - 1);
    const slice = entries.slice(startIndex, endIndex + 1);
    const dominant = slice
      .map((entry, offset) => ({ entry, index:startIndex + offset, score:cardScore(entry, startIndex + offset, entries.length) }))
      .sort((a, b) => b.score - a.score || a.index - b.index)[0];
    const sectorEdges = edges.filter(edge => edge.index >= startIndex && edge.index < endIndex);
    const turning = [...sectorEdges].sort((a, b) => b.score - a.score || a.index - b.index)[0] || null;
    const first = entries[startIndex];
    const last = entries[endIndex];
    return Object.freeze({
      label:labels[sectorIndex],
      startIndex,
      endIndex,
      cardCount:slice.length,
      cardKeys:Object.freeze(slice.map(entry => entry.card.key)),
      dominant:Object.freeze({ index:dominant.index, key:dominant.entry.card.key, name:dominant.entry.card.name }),
      turningPair:turning?.pairKey || '',
      summary:sentence(`${first.card.name} abre este setor e ${last.card.name} o conduz para ${lower(last.knowledge.core.consequence)}`)
    });
  }));
}

function expansive(entry) {
  return ['opening', 'growth', 'healing', 'revelation', 'integration', 'completion'].includes(entry.knowledge.temporal.phase);
}

function challenging(entry) {
  return CHALLENGE_PHASES.has(entry.knowledge.temporal.phase) || CHALLENGE_ROLES.has(entry.classification.role);
}

function centralPattern(entries, edges) {
  const expansionIndex = entries.findIndex(expansive);
  const challengeIndex = entries.findIndex(challenging);
  if (expansionIndex >= 0 && challengeIndex >= 0 && expansionIndex !== challengeIndex) {
    const expansion = entries[expansionIndex];
    const challenge = entries[challengeIndex];
    return Object.freeze({
      kind:'contradiction',
      expansionIndex,
      challengeIndex,
      text:sentence(
        `A contradição central é precisa: ${expansion.card.name} abre possibilidade, enquanto ` +
        `${challenge.card.name} revela o limite — ${lower(challenge.knowledge.core.conflict)}`
      )
    });
  }
  const turning = [...edges].sort((a, b) => b.score - a.score || a.index - b.index)[0];
  if (!turning) return Object.freeze({ kind:'single', expansionIndex:-1, challengeIndex:-1, text:'' });
  return Object.freeze({
    kind:turning.bridge.kind,
    expansionIndex:-1,
    challengeIndex:-1,
    text:sentence(
      `O eixo dominante liga ${turning.from.name} a ${turning.to.name}: ${turning.bridge.phrase}; ` +
      `a resposta prática da segunda carta aparece neste gesto: você ${lower(entries[turning.index + 1].knowledge.core.movement)}`
    )
  });
}

function spreadSynthesis(entries, edges, turningEdge) {
  const first = entries[0];
  const last = entries.at(-1);
  if (entries.length === 1) {
    return sentence(`${first.card.name} concentra a mesa: ${lower(first.reading.statement)} ${lower(first.reading.possibility)}`);
  }
  if (entries.length === 2) return edges[0].summary;

  const turn = turningEdge || edges[Math.floor(edges.length / 2)];
  const territoryPrefix = last.territory?.key && last.territory.key !== 'general'
    ? `${TERRITORY_OPENING[last.territory.key] || `Neste tema de ${last.territory.title}`}, `
    : '';
  const opening = sentence(
    `${first.card.name} abre a história com ${lower(first.knowledge.core.theme)} na função de ${first.classification.title}`
  );
  const turning = sentence(
    `${turn.to.name} ${turn.bridge.phrase}; ao receber ${turn.from.name}, revela que ${lower(entries[turn.index + 1].knowledge.core.conflict)}`
  );
  const direction = sentence(
    `${territoryPrefix}${last.card.name} responde à travessia e dá direção ao conjunto com ` +
    `${lower(last.knowledge.core.theme)}, até que ${lower(last.knowledge.core.consequence)}`
  );
  return `${opening} ${turning} ${direction}`;
}

export function tarotDialoguePair(fromCard, toCard, {
  fromPosition = '',
  toPosition = '',
  question = '',
  territory = ''
} = {}) {
  if (!fromCard || !toCard) return null;
  const from = positionedTarotCard(fromCard, fromPosition || 'Posição revelada', {
    question, territory, index:0, total:fromPosition ? 2 : 1
  });
  const to = positionedTarotCard(toCard, toPosition || 'Posição revelada', {
    question, territory, index:toPosition ? 1 : 0, total:toPosition ? 2 : 1
  });
  return dialogueFromEntries(from, to, 0);
}

export function tarotDialogueSpread(cards = [], positions = [], {
  question = '',
  territory = '',
  positioned = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const positionMap = positioned?.entries?.length === validCards.length
    ? positioned
    : positionedTarotSpread(validCards, safePositions, { question, territory });
  const entries = positionMap.entries;
  const edges = Object.freeze(entries.slice(0, -1).map((entry, index) => dialogueFromEntries(entry, entries[index + 1], index)));
  const ranked = rankedIndices(entries);
  const turningEdge = [...edges].sort((a, b) => b.score - a.score || a.index - b.index)[0] || null;
  const sectors = spreadSectors(entries, edges);
  const pattern = centralPattern(entries, edges);
  const cardsUsed = Object.freeze(entries.map((entry, index) => Object.freeze({ index, key:entry.card.key })));
  const uniqueKeys = new Set(cardsUsed.map(item => item.key)).size;

  return Object.freeze({
    engine:DIALOGUE_ENGINE_NAME,
    version:DIALOGUE_ENGINE_VERSION,
    synthesis:spreadSynthesis(entries, edges, turningEdge),
    patternSentence:pattern.text,
    pattern,
    edges,
    sectors,
    dominantCards:Object.freeze(ranked.slice(0, Math.min(5, ranked.length))),
    turningEdge,
    trajectory:Object.freeze({
      phases:Object.freeze(entries.map(entry => entry.knowledge.temporal.phase)),
      elements:Object.freeze(entries.map(entry => entry.knowledge.card.element)),
      positions:positionMap.positionSequence,
      openingKey:entries[0].card.key,
      endingKey:entries.at(-1).card.key
    }),
    coverage:Object.freeze({
      cardCount:entries.length,
      cardsUsed,
      uniqueKeys,
      edgeCount:edges.length,
      sectorCount:sectors.length,
      allCardsUsed:cardsUsed.length === entries.length,
      allTransitionsRead:edges.length === Math.max(0, entries.length - 1)
    }),
    integrity:Object.freeze({
      wholeTableRead:true,
      orderMatters:true,
      positionsMatter:true,
      questionSetsTerritory:true,
      finalVoice:false,
      privateSourcesUsed:false
    })
  });
}

export function dialogueEngineCapacity() {
  return Object.freeze({
    cards:78,
    orderedDistinctPairs:78 * 77,
    directionSensitive:true,
    positionAware:true,
    questionAware:true,
    everyCardUsedInLargeSpreads:true,
    maximumVisibleSectors:5,
    writesIndependentParagraphs:false,
    rule:'cada carta recebe a anterior, transforma a história e entrega a próxima passagem'
  });
}

export function dialogueIdentity(card) {
  const knowledge = tarotKnowledge(card);
  return Object.freeze({
    key:knowledge.card.key,
    name:knowledge.card.name,
    theme:knowledge.core.theme,
    phase:knowledge.temporal.phase,
    element:knowledge.card.element
  });
}
