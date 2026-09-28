/*
 * DIVINA BRUXA 4.1.4 · CONSCIÊNCIA NARRATIVA
 *
 * Antes de Whit falar, esta camada constrói silenciosamente o arco inteiro:
 * começo, força preservada, tensão, revelação conjunta, tendência, escolha e
 * conselho. Os motores anteriores entregam sinais; somente Whit entrega voz.
 */

import {
  positionedTarotCard,
  positionedTarotSpread
} from './whit-tarot-position-engine-v411.js';
import { tarotDialogueSpread } from './whit-tarot-dialogue-engine-v412.js';
import {
  humanRealityForCard,
  humanRealitySpread
} from './whit-tarot-human-reality-v413.js';

export const NARRATIVE_CONSCIOUSNESS_ENGINE_NAME = 'MOTOR DE CONSCIÊNCIA NARRATIVA';
export const NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION = '4.1.4';

export const NARRATIVE_CONSCIOUSNESS_COVENANT = Object.freeze([
  'Whit constrói a história inteira antes de escolher as palavras visíveis',
  'começo, preservação, tensão, revelação, tendência, escolha e conselho formam um único arco',
  'nenhum motor acrescenta um bloco independente à consulta',
  'todas as cartas são consideradas e somente os eixos decisivos chegam à voz final',
  'a pergunta localiza a história na vida sem substituir o governo do Tarot',
  'futuro permanece tendência e o livre-arbítrio permanece parte da narrativa',
  'a síntese elimina repetição sem apagar contradição, nuance ou identidade'
]);

const clean = (value, limit = 5000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
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
const pluralCard = name => /^(?:Os|As)\s/u.test(clean(name, 100));
const agrees = (name, singular, plural) => pluralCard(name) ? plural : singular;
const afterDe = name => {
  const value = clean(name, 100);
  if (/^O\s/u.test(value)) return `do ${value.slice(2)}`;
  if (/^A\s/u.test(value)) return `da ${value.slice(2)}`;
  if (/^Os\s/u.test(value)) return `dos ${value.slice(3)}`;
  if (/^As\s/u.test(value)) return `das ${value.slice(3)}`;
  return `de ${value}`;
};
const afterPara = name => {
  const value = clean(name, 100);
  if (/^O\s/u.test(value)) return `o ${value.slice(2)}`;
  if (/^A\s/u.test(value)) return `a ${value.slice(2)}`;
  if (/^Os\s/u.test(value)) return `os ${value.slice(3)}`;
  if (/^As\s/u.test(value)) return `as ${value.slice(3)}`;
  return value;
};

function agreeExistingSentence(value, cardName) {
  if (!pluralCard(cardName)) return value;
  return clean(value)
    .replace(`${cardName} leva`, `${cardName} levam`)
    .replace(`${cardName} devolve`, `${cardName} devolvem`)
    .replace(`${cardName} não fecha`, `${cardName} não fecham`)
    .replace(`${cardName} ilumina`, `${cardName} iluminam`);
}

const CONTEXT_OPENING = Object.freeze({
  relationship:'No relacionamento',
  love:'No amor',
  work:'No trabalho',
  money:'No dinheiro',
  family:'Na família',
  identity:'Na relação com você',
  change:'Nesta mudança',
  decision:'Nesta decisão',
  spirituality:'Na espiritualidade',
  general:'Na vida concreta'
});

const SUPPORT_PHASES = Object.freeze({
  healing:8,
  revelation:8,
  integration:7,
  stability:7,
  mastery:7,
  completion:7,
  culmination:6,
  growth:6,
  opening:5,
  awakening:5,
  movement:4,
  transition:4,
  choice:4,
  assessment:3,
  pause:2,
  development:2,
  ending:1,
  uncertainty:0,
  confrontation:-1,
  conflict:-2,
  rupture:-2
});

const CHALLENGE_PHASES = new Set(['conflict', 'confrontation', 'rupture', 'uncertainty']);
const CHALLENGE_ROLES = new Set(['obstacle', 'fear', 'hidden', 'ending']);

function entrySummary(entry, index) {
  return Object.freeze({
    index,
    key:entry.card.key,
    name:entry.card.name,
    role:entry.classification.role,
    position:entry.classification.title,
    phase:entry.knowledge.temporal.phase,
    element:entry.knowledge.card.element,
    theme:entry.knowledge.core.theme,
    truth:entry.knowledge.core.truth,
    conflict:entry.knowledge.core.conflict,
    movement:entry.knowledge.core.movement,
    consequence:entry.knowledge.core.consequence
  });
}

function makeBeat(kind, entry, index, statement) {
  return Object.freeze({
    kind,
    ...entrySummary(entry, index),
    statement:sentence(statement)
  });
}

function preservedScore(entry, index, tensionIndex) {
  const phase = entry.knowledge.temporal.phase;
  const role = entry.classification.role;
  let score = SUPPORT_PHASES[phase] ?? 1;
  if (['origin', 'past', 'present'].includes(role)) score += 3;
  if (['advice', 'choice', 'freewill', 'outcome'].includes(role)) score += 2;
  if (entry.knowledge.card.source === 'major') score += 1;
  if (index !== tensionIndex) score += 2;
  score += Number(entry.knowledge.intensity || 0);
  return score;
}

function preservedIndex(entries, tensionIndex) {
  return entries
    .map((entry, index) => ({ index, score:preservedScore(entry, index, tensionIndex) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.index ?? 0;
}

function tensionIndex(entries, suggestedIndex = 0) {
  const suggested = entries[suggestedIndex];
  if (suggested && (
    CHALLENGE_ROLES.has(suggested.classification.role) ||
    CHALLENGE_PHASES.has(suggested.knowledge.temporal.phase)
  )) return suggestedIndex;

  return entries
    .map((entry, index) => ({
      index,
      score:(CHALLENGE_ROLES.has(entry.classification.role) ? 8 : 0) +
        (CHALLENGE_PHASES.has(entry.knowledge.temporal.phase) ? 7 : 0) +
        Number(entry.knowledge.intensity || 0)
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.index ?? suggestedIndex;
}

function openingSentence(opening, preserved) {
  const beginning = `${opening.card.name} ${agrees(opening.card.name, 'abre', 'abrem')} a história ` +
    `em ${opening.classification.title} com ${lower(opening.knowledge.core.theme)}`;
  if (opening.card.key === preserved.card.key) {
    return sentence(`${beginning}; o que permanece vivo é esta verdade: ${lower(preserved.knowledge.core.truth)}`);
  }
  return sentence(
    `${beginning}; ${preserved.card.name} ${agrees(preserved.card.name, 'preserva', 'preservam')} ` +
    'a verdade que a mesa não pode perder: ' +
    `${lower(preserved.knowledge.core.truth)}`
  );
}

function tensionSentence(entries, tension, dialogue) {
  const pattern = dialogue?.pattern;
  if (pattern?.kind === 'contradiction') {
    const expansion = entries[pattern.expansionIndex] || tension;
    const challenge = entries[pattern.challengeIndex] || tension;
    return sentence(
      `No coração da tiragem, a contradição central fica nítida: ${expansion.card.name} ` +
      `${agrees(expansion.card.name, 'abre', 'abrem')} possibilidade, ` +
      `mas ${challenge.card.name} ${agrees(challenge.card.name, 'mostra', 'mostram')} o limite — ` +
      `${lower(challenge.knowledge.core.conflict)}`
    );
  }
  return sentence(
    `No coração da tiragem, ${tension.card.name} ${agrees(tension.card.name, 'revela', 'revelam')} ` +
    'o ponto que não pode ser ignorado: ' +
    `${lower(tension.knowledge.core.conflict)}`
  );
}

function revelationSentence(entries, dialogue, tension) {
  const edge = dialogue?.turningEdge;
  if (!edge) {
    return sentence(
      `${tension.card.name} ${agrees(tension.card.name, 'muda', 'mudam')} a direção da história ao revelar que ` +
      `${lower(tension.knowledge.core.truth)}`
    );
  }
  const receiving = entries[edge.index + 1] || tension;
  return sentence(
    `Ao passar ${afterDe(edge.from.name)} para ${afterPara(edge.to.name)}, ` +
    `a história ${edge.bridge.phrase} e revela que ` +
    `${lower(receiving.knowledge.core.truth)}`
  );
}

function humanGroundingSentence(human) {
  const context = human.context;
  if (!context.hasContext) return '';
  const opening = CONTEXT_OPENING[context.territory] || CONTEXT_OPENING.general;
  const evidence = human.evidence.observable;
  const base = `${opening}, a busca por ${context.intentTitle}`;
  if (context.subject === 'other') {
    return sentence(
      `${base} precisa ser confirmada por ${evidence}, e não por suposições sobre pensamentos privados`
    );
  }
  if (context.needsTimingBoundary) {
    return sentence(`${base} encontra seu tempo em ${evidence}, não numa data garantida`);
  }
  if (context.certaintyRequested) {
    return sentence(`${base} encontra direção em ${evidence}, nunca numa garantia absoluta`);
  }
  if (context.highStakes) {
    return sentence(`${base} precisa observar ${evidence}; decisões importantes também exigem dados e apoio adequado`);
  }
  return sentence(`${base} encontra um critério real: observe ${evidence}`);
}

function tendencySentence(entry) {
  const role = entry.classification.role;
  const opening = role === 'outcome'
    ? `Como resultado, se o padrão atual continuar, ${entry.card.name}`
    : role === 'future'
      ? `Como futuro provável, se o padrão atual continuar, ${entry.card.name}`
      : `Se o padrão atual continuar, ${entry.card.name}`;
  return sentence(
    `${opening} ${agrees(entry.card.name, 'aponta', 'apontam')} para esta consequência: ` +
    `${lower(entry.knowledge.core.consequence)}; ` +
    'isso é tendência, não uma sentença'
  );
}

function counselSentence(entry, context) {
  const practical = `você ${lower(entry.knowledge.core.movement)}`;
  const criterion = context?.hasContext
    ? `na busca por ${context.intentTitle}, mantenha este critério: ${lower(entry.knowledge.core.truth)}`
    : `mantenha este critério: ${lower(entry.knowledge.core.truth)}`;
  return sentence(
    `Com ${entry.card.name}, seu livre-arbítrio continua vivo: ${practical}; ${criterion}`
  );
}

function closingSentence(entry, human) {
  if (human?.closingSentence) return agreeExistingSentence(human.closingSentence, entry.card.name);
  return sentence(
    `${entry.card.name} ${agrees(entry.card.name, 'encerra', 'encerram')} a leitura sem fechar seu caminho; ` +
    'a carta ilumina o passo, ' +
    'mas a decisão continua pertencendo a você'
  );
}

function compactProfile(arc) {
  return Object.freeze(Object.fromEntries(Object.entries(arc).map(([key, beat]) => [key, Object.freeze({
    index:beat.index,
    key:beat.key,
    name:beat.name,
    role:beat.role,
    phase:beat.phase
  })])));
}

export function narrativeConsciousnessForCard(card, {
  position = 'Posição revelada',
  question = '',
  positioned = null,
  human = null
} = {}) {
  if (!card) return null;
  const entry = positioned || positionedTarotCard(card, position, { question });
  const humanMap = human || humanRealityForCard(card, { position, question, positioned:entry });
  const opening = sentence(
    `${entry.card.name} ${agrees(entry.card.name, 'abre', 'abrem')} a leitura em ${entry.classification.title} ` +
    `com ${lower(entry.knowledge.core.theme)}; ` +
    `o que permanece vivo é esta verdade: ${lower(entry.knowledge.core.truth)}`
  );
  const preserved = sentence(
    `${entry.card.name} ${agrees(entry.card.name, 'preserva', 'preservam')} esta necessidade: ` +
    `${lower(entry.knowledge.core.humanNeed)}`
  );
  const tension = sentence(
    `O ponto central ${afterDe(entry.card.name)} revela sua função nesta posição: ${lower(entry.reading.statement)}`
  );
  const revelation = humanMap.context.hasContext
    ? agreeExistingSentence(humanMap.focusSentence, entry.card.name)
    : sentence(
      `${entry.card.name} ${agrees(entry.card.name, 'muda', 'mudam')} a direção da leitura quando você ` +
      `${lower(entry.knowledge.core.movement)}`
    );
  const tendency = tendencySentence(entry);
  const counsel = counselSentence(entry, humanMap.context);
  const closing = closingSentence(entry, humanMap);
  const arc = Object.freeze({
    beginning:makeBeat('beginning', entry, 0, opening),
    preserved:makeBeat('preserved', entry, 0, `Permanece esta verdade: ${lower(entry.knowledge.core.truth)}`),
    tension:makeBeat('tension', entry, 0, tension),
    revelation:makeBeat('revelation', entry, 0, revelation),
    tendency:makeBeat('tendency', entry, 0, tendency),
    choice:makeBeat('choice', entry, 0, `A escolha possível começa quando você ${lower(entry.knowledge.core.movement)}`),
    counsel:makeBeat('counsel', entry, 0, counsel)
  });

  return Object.freeze({
    engine:NARRATIVE_CONSCIOUSNESS_ENGINE_NAME,
    version:NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
    arc,
    arcProfile:compactProfile(arc),
    visible:Object.freeze({ opening, preserved, tension, revelation, tendency, counsel, closing }),
    coverage:Object.freeze({
      cardCount:1,
      cardsConsidered:1,
      transitionsRead:0,
      beatCount:Object.keys(arc).length,
      completeArc:true
    }),
    integrity:Object.freeze({
      tarotGoverns:true,
      positionMatters:true,
      questionSetsHumanContext:true,
      futureIsConditional:true,
      literalMindReading:false,
      privateSourcesUsed:false,
      storesRawQuestion:false,
      finalVoice:false
    })
  });
}

export function narrativeConsciousnessSpread(cards = [], positions = [], {
  question = '',
  positioned = null,
  dialogue = null,
  human = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    return narrativeConsciousnessForCard(validCards[0], {
      position:positions?.[0] || 'Posição revelada', question,
      positioned:positioned?.entries?.[0],
      human:human?.card ? human : null
    });
  }

  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const positionMap = positioned?.entries?.length === validCards.length
    ? positioned
    : positionedTarotSpread(validCards, safePositions, { question });
  const dialogueMap = dialogue?.coverage?.cardCount === validCards.length
    ? dialogue
    : tarotDialogueSpread(validCards, safePositions, { question, positioned:positionMap });
  const humanMap = human?.integrity?.wholeTableInherited
    ? human
    : humanRealitySpread(validCards, safePositions, {
      question, positioned:positionMap, dialogue:dialogueMap
    });
  const entries = positionMap.entries;
  const axes = positionMap.axes;
  const openingIndex = axes.openingIndex;
  const centralTensionIndex = tensionIndex(entries, axes.tensionIndex);
  const supportIndex = preservedIndex(entries, centralTensionIndex);
  const tendencyIndex = axes.tendencyIndex;
  const choiceIndex = axes.counselIndex;
  const opening = entries[openingIndex];
  const preserved = entries[supportIndex];
  const tension = entries[centralTensionIndex];
  const tendency = entries[tendencyIndex];
  const choice = entries[choiceIndex];
  const final = entries.at(-1);

  const visibleOpening = openingSentence(opening, preserved);
  const visibleTension = tensionSentence(entries, tension, dialogueMap);
  const visibleRevelation = revelationSentence(entries, dialogueMap, tension);
  const visibleHuman = humanGroundingSentence(humanMap);
  const visibleTendency = tendencySentence(tendency);
  const visibleCounsel = counselSentence(choice, humanMap.context);
  const visibleClosing = closingSentence(final, humanMap);
  const edge = dialogueMap.turningEdge;
  const revelationEntry = edge ? entries[edge.index + 1] : tension;
  const revelationIndex = edge ? edge.index + 1 : centralTensionIndex;

  const arc = Object.freeze({
    beginning:makeBeat('beginning', opening, openingIndex, visibleOpening),
    preserved:makeBeat(
      'preserved', preserved, supportIndex,
      `${preserved.card.name} ${agrees(preserved.card.name, 'preserva', 'preservam')} esta verdade: ` +
      `${lower(preserved.knowledge.core.truth)}`
    ),
    tension:makeBeat('tension', tension, centralTensionIndex, visibleTension),
    revelation:makeBeat('revelation', revelationEntry, revelationIndex, visibleRevelation),
    tendency:makeBeat('tendency', tendency, tendencyIndex, visibleTendency),
    choice:makeBeat(
      'choice', choice, choiceIndex,
      `A escolha possível reaparece quando você ${lower(choice.knowledge.core.movement)}`
    ),
    counsel:makeBeat('counsel', choice, choiceIndex, visibleCounsel)
  });
  const paragraphs = Object.freeze([
    visibleRevelation,
    visibleHuman,
    visibleTendency,
    visibleCounsel
  ].filter(Boolean));

  return Object.freeze({
    engine:NARRATIVE_CONSCIOUSNESS_ENGINE_NAME,
    version:NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
    arc,
    arcProfile:compactProfile(arc),
    visible:Object.freeze({
      opening:visibleOpening,
      tension:visibleTension,
      revelation:visibleRevelation,
      human:visibleHuman,
      tendency:visibleTendency,
      counsel:visibleCounsel,
      closing:visibleClosing,
      paragraphs
    }),
    pattern:Object.freeze({
      kind:dialogueMap.pattern.kind,
      turningPair:edge?.pairKey || '',
      bridge:edge?.bridge.kind || '',
      contradiction:dialogueMap.pattern.kind === 'contradiction'
    }),
    coverage:Object.freeze({
      cardCount:entries.length,
      cardsConsidered:dialogueMap.coverage.cardCount,
      uniqueKeys:dialogueMap.coverage.uniqueKeys,
      transitionsRead:dialogueMap.coverage.edgeCount,
      sectorsRead:dialogueMap.coverage.sectorCount,
      beatCount:Object.keys(arc).length,
      completeArc:true,
      allCardsConsidered:dialogueMap.coverage.allCardsUsed,
      allTransitionsRead:dialogueMap.coverage.allTransitionsRead
    }),
    integrity:Object.freeze({
      tarotGoverns:true,
      positionsMatter:true,
      orderMatters:true,
      questionSetsHumanContext:true,
      futureIsConditional:true,
      literalMindReading:false,
      privateSourcesUsed:false,
      storesRawQuestion:false,
      repeatedMotorParagraphs:false,
      finalVoice:false
    })
  });
}

export function narrativeConsciousnessCapacity() {
  return Object.freeze({
    cards:78,
    silentBeats:7,
    beats:Object.freeze(['beginning', 'preserved', 'tension', 'revelation', 'tendency', 'choice', 'counsel']),
    everyCardConsidered:true,
    everyTransitionRead:true,
    questionAware:true,
    positionAware:true,
    orderAware:true,
    contradictionAware:true,
    conditionalFuture:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    writesIndependentParagraphs:false,
    rule:'Whit constrói uma história inteira em silêncio e entrega somente o centro vivo da mesa'
  });
}
