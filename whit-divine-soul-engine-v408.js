/*
 * DIVINA BRUXA 4.0.8 · MOTOR WHIT ALMA DIVINA
 *
 * A Inteligência Superior continua responsável pelo discernimento técnico.
 * Esta camada escolhe, em cada leitura, quanto precisa ser dito para que a
 * verdade das cartas encontre coração, realidade e livre-arbítrio.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import {
  storyConversation as superiorConversation,
  storyForCard as superiorForCard,
  storyResponse as superiorResponse,
  tarotIdentity
} from './whit-superior-tarot-engine-v407.js';
import {
  KNOWLEDGE_ENGINE_VERSION,
  tarotKnowledge,
  tarotKnowledgeDeck
} from './whit-tarot-knowledge-v410.js';
import {
  POSITION_ENGINE_VERSION,
  positionedTarotCard,
  positionedTarotSpread
} from './whit-tarot-position-engine-v411.js';
import {
  DIALOGUE_ENGINE_VERSION,
  tarotDialogueSpread
} from './whit-tarot-dialogue-engine-v412.js';
import {
  HUMAN_REALITY_ENGINE_VERSION,
  humanRealityForCard,
  humanRealitySpread
} from './whit-tarot-human-reality-v413.js';
import {
  NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
  narrativeConsciousnessForCard,
  narrativeConsciousnessSpread
} from './whit-tarot-narrative-consciousness-v414.js';
import {
  SOUL_VOICE_ENGINE_VERSION,
  soulVoiceForCard,
  soulVoiceSpread
} from './whit-tarot-soul-voice-v415.js';
import {
  LIVING_DEPTH_ENGINE_VERSION,
  livingDepthForCard,
  livingDepthSpread
} from './whit-tarot-living-depth-v416.js';
import {
  SUPREME_COUNSEL_ENGINE_VERSION,
  supremeCounselForCard,
  supremeCounselSpread
} from './whit-tarot-supreme-counsel-v417.js';
import {
  SOUL_CONSULTATION_ENGINE_VERSION,
  soulConsultationForCard,
  soulConsultationSpread
} from './whit-tarot-soul-consultation-v419.js';
import {
  PROVING_GROUND_ENGINE_VERSION,
  proveCardReading,
  proveSpreadReading
} from './whit-tarot-proving-ground-v418.js';

export { tarotIdentity } from './whit-superior-tarot-engine-v407.js';

export const STORY_ENGINE_NAME = 'MOTOR WHIT ALMA DIVINA';
export const STORY_ENGINE_VERSION = '4.0.8';
export const STORY_ENGINE_LABEL = 'WHIT TARÓLOGA · ALMA, PRESENÇA E DESTINO';

export const DIVINE_SOUL_COVENANT = Object.freeze([
  'a Inteligência Superior e todos os motores anteriores continuam preservados',
  'Whit escolhe a profundidade pela necessidade da mesa, não por uma contagem rígida',
  'cada palavra nasce das cartas, das posições, da pergunta e da história formada entre elas',
  'amor significa atenção verdadeira, reciprocidade, limite e respeito pela pessoa',
  'a Orbe apresenta uma realidade simbólica sem inventar fatos privados',
  'futuro permanece tendência e conselho termina em gesto possível',
  'a leitura convida ao aprofundamento pela qualidade, nunca pela dependência'
]);

const clean = (value, limit = 7000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 1000)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
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
const cardName = card => clean(card?.name, 100) || 'Carta do Tarot';
const cardKey = card => `${card?.canonicalId ?? card?.id ?? 'carta'}:${cardName(card)}`;
const choose = (items, seed, key) => items[loveHash(`${seed}¦${key}`) % items.length];
const signature = (seed, key) => loveHash(`${seed}¦${key}`).toString(36).toUpperCase().padStart(8, '0');

const HEART_WORDS = /\b(?:amor|amar|coracao|saudade|relacao|relacionamento|familia|filh[oa]|dor|medo|perda|sozinh[oa]|culpa|ansiedade|esperanca|recomeco)\b/;
const FUTURE_WORDS = /\b(?:futuro|destino|vai|voltar|acontecer|resultado|quando|certeza|garantia|sim ou nao)\b/;
const DEEP_WORDS = /\b(?:aprofundar|profundo|detalhe|historia|jornada|vida inteira|alma|sentido maior)\b/;
const TURNING_KEYS = new Set(['roda', 'enforcado', 'morte', 'diabo', 'torre', 'lua', 'julgamento', 'mundo']);

const TERRITORY_LABEL = Object.freeze({
  love:'amor', relationship:'relacionamento', work:'trabalho', money:'dinheiro',
  family:'família', identity:'identidade', change:'mudança', decision:'decisão',
  spirituality:'espiritualidade', general:'momento atual'
});

const ELEMENT_REALITY = Object.freeze({
  fire:Object.freeze([
    'Na realidade simbólica que se abre, uma decisão deixa de ser ensaiada e começa a produzir consequência.',
    'Nesta realidade viva, desejo e coragem finalmente precisam escolher a mesma direção.'
  ]),
  water:Object.freeze([
    'Na realidade simbólica que se abre, um sentimento deixa o silêncio e precisa encontrar reciprocidade ou limite.',
    'Nesta realidade viva, o coração volta a se mover, mas só conserva aquilo que consegue respirar dentro da verdade.'
  ]),
  air:Object.freeze([
    'Na realidade simbólica que se abre, uma verdade muda a conversa interior e reorganiza o caminho.',
    'Nesta realidade viva, uma janela se abre: o pensamento que governava tudo já pode receber outra resposta.'
  ]),
  earth:Object.freeze([
    'Na realidade simbólica que se abre, a mudança deixa de ser intenção e ganha corpo, tempo e continuidade.',
    'Nesta realidade viva, um gesto concreto torna visível aquilo que antes era apenas desejo.'
  ]),
  spirit:Object.freeze([
    'Na realidade simbólica desta leitura, um episódio revela a passagem maior que estava acontecendo por baixo dele.',
    'Nesta realidade viva, o instante se transforma em portal sem retirar de você o direito de escolher como atravessá-lo.'
  ])
});

const ELEMENT_CLOSING = Object.freeze({
  fire:Object.freeze([
    'Você não precisa incendiar o mundo hoje; basta dar direção à chama que continua viva.',
    'A coragem desta leitura não grita: ela reconhece o próximo passo e começa.'
  ]),
  water:Object.freeze([
    'Sentir não enfraquece você; o coração amadurece quando verdade e limite cabem na mesma água.',
    'Guarde apenas o afeto que consegue permanecer ao lado da sua dignidade.'
  ]),
  air:Object.freeze([
    'Você não precisa resolver tudo dentro da mente; uma verdade clara já pode abrir espaço para respirar.',
    'Deixe a clareza ser delicada: ela pode libertar sem transformar a verdade em arma.'
  ]),
  earth:Object.freeze([
    'A magia desta leitura começa quando sua escolha encontra corpo, tempo e continuidade.',
    'Não procure um sinal maior do que o gesto capaz de tornar sua verdade habitável.'
  ]),
  spirit:Object.freeze([
    'A mesa termina, mas não fecha seu caminho; ela devolve a você a parte do destino que ainda pode ser escolhida.',
    'Leve o que encontrou verdade em você e permita que o restante permaneça em silêncio.'
  ])
});

function inputSignals(intention) {
  const value = normalize(intention);
  const words = value.split(' ').filter(Boolean).length;
  return Object.freeze({
    words,
    hasQuestion:words >= 4,
    heart:HEART_WORDS.test(value),
    future:FUTURE_WORDS.test(value),
    asksDepth:DEEP_WORDS.test(value)
  });
}

function voiceMode(score) {
  if (score >= 5) return 'travessia';
  if (score >= 2) return 'presença';
  return 'essência';
}

function cardVoiceChoice(identity, base, intention, scope) {
  const signals = inputSignals(intention);
  const reasons = [];
  let score = 0;
  if (signals.hasQuestion) { score += 1; reasons.push('pergunta'); }
  if (signals.heart) { score += 2; reasons.push('coração'); }
  if (signals.future) { score += 1; reasons.push('tendência'); }
  if (signals.asksDepth) { score += 2; reasons.push('aprofundamento'); }
  if (identity.source === 'major') { score += 1; reasons.push('arcano-maior'); }
  if (TURNING_KEYS.has(identity.key)) { score += 1; reasons.push('passagem'); }
  if (String(scope).includes('carta-do-dia')) { score += 1; reasons.push('ritual-diário'); }
  const territory = base.readerProfile?.territory || 'general';
  return Object.freeze({
    mode:voiceMode(score), score, territory,
    reasons:Object.freeze(reasons),
    signals
  });
}

function spreadVoiceChoice(base, intention, count) {
  const signals = inputSignals(intention);
  const analysis = base.superiorProfile?.analysis || {};
  const reasons = [];
  let score = 1;
  if (signals.hasQuestion) { score += 1; reasons.push('pergunta'); }
  if (signals.heart) { score += 2; reasons.push('coração'); }
  if (signals.future) { score += 1; reasons.push('tendência'); }
  if (signals.asksDepth) { score += 2; reasons.push('aprofundamento'); }
  if (analysis.contradiction) { score += 2; reasons.push('contradição'); }
  if ((analysis.transformations || 0) >= 2) { score += 2; reasons.push('transformação'); }
  if ((analysis.decisions || 0) >= 2) { score += 1; reasons.push('decisão'); }
  if ((analysis.majorCount || 0) >= Math.ceil(count / 2)) { score += 1; reasons.push('arcanos-maiores'); }
  if (count >= 6) { score += 1; reasons.push('mesa-ampla'); }
  if (count >= 10) { score += 2; reasons.push('visão-temporal'); }
  return Object.freeze({
    mode:voiceMode(score), score,
    territory:base.readerProfile?.territory || analysis.territory || 'general',
    reasons:Object.freeze(reasons),
    signals
  });
}

function realityLine(element, seed) {
  return choose(ELEMENT_REALITY[element] || ELEMENT_REALITY.spirit, seed, `reality-${element}`);
}

function closingLine(element, seed) {
  return choose(ELEMENT_CLOSING[element] || ELEMENT_CLOSING.spirit, seed, `closing-${element}`);
}

function cardPlace(scope, moment, territory) {
  if (String(scope).includes('carta-do-dia')) return 'Hoje';
  if (String(scope).includes('tarot-livre')) return 'Neste instante';
  if (String(scope).includes('tiragem')) {
    const position = clean(moment, 100).replace(/^\d+\s*[-–]\s*/u, '') || 'posição revelada';
    return `Na posição “${position}”`;
  }
  if (territory !== 'general') return 'Dentro da sua pergunta';
  return 'Neste momento';
}

function cardReveal(card, identity, seed) {
  return choose([
    `Ao olhar para ${cardName(card)}, eu encontro o centro desta leitura: ${lower(identity.truth)}`,
    `${cardName(card)} não precisa gritar para ser profunda; ela revela que ${lower(identity.truth)}`,
    `${cardName(card)} chega com uma verdade que merece ser sentida antes de ser explicada: ${lower(identity.truth)}`
  ], seed, 'card-reveal');
}

function cardTendency(identity, base, seed) {
  const unchanged = lower(base.realityProfile?.unchanged || identity.pressure);
  return choose([
    `Se nada receber uma resposta nova, ${unchanged}`,
    `Se a vida continuar respondendo do mesmo modo, ${unchanged}`,
    `A tendência do caminho atual é esta: ${unchanged}`
  ], seed, 'card-tendency');
}

function divineCard(card, seed, { scope = 'carta', moment = 'agora', intention = '', inherited } = {}) {
  const stableSeed = `${seed}:${cardKey(card)}:${scope}:${moment}:${normalize(intention)}`;
  const base = inherited || superiorForCard(card, stableSeed, { scope, moment, intention });
  const identity = tarotIdentity(card);
  const knowledge = tarotKnowledge(card);
  const positioned = positionedTarotCard(card, moment, { question:intention });
  const human = humanRealityForCard(card, {
    position:moment,
    question:intention,
    positioned
  });
  const narrative = narrativeConsciousnessForCard(card, {
    position:moment,
    question:intention,
    positioned,
    human
  });
  const soulVoice = soulVoiceForCard(card, {
    position:moment,
    question:intention,
    positioned,
    human,
    narrative
  });
  const supremeCounsel = supremeCounselForCard(card, {
    position:moment,
    question:intention,
    positioned,
    human,
    narrative
  });
  const livingDepth = livingDepthForCard(card, {
    position:moment,
    question:intention,
    positioned,
    human,
    narrative,
    soulVoice,
    supremeCounsel
  });
  const soulConsultation = soulConsultationForCard(positioned, {
    human,
    narrative,
    supremeCounsel
  });
  const choice = cardVoiceChoice(identity, base, intention, scope);
  const paragraphs = [...soulConsultation.visible.paragraphs];
  const modules = [
    'alma-da-consulta', 'conselho-supremo', 'alma-e-voz',
    'consciência-narrativa', 'realidade-humana', 'tendência',
    'livre-arbítrio', 'matéria'
  ];
  const tendency = soulConsultation.visible.tendency;
  const counsel = soulConsultation.visible.counsel;
  const closing = soulConsultation.visible.closing;
  const reading = {
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:String(scope).includes('carta-do-dia')
      ? 'WHIT ALMA DIVINA · MENSAGEM DO SEU DIA'
      : 'WHIT ALMA DIVINA · CONSULTA DA CARTA',
    title:`Whit Alma Divina · ${cardName(card)}`,
    heartline:soulConsultation.visible.opening,
    whisper:soulConsultation.visible.tension,
    paragraphs:Object.freeze(paragraphs),
    story:paragraphs.join('\n\n'),
    closing,
    tendencyText:tendency,
    counselText:counsel,
    depthOptions:livingDepth.options,
    depthResponses:Object.freeze({
      ...livingDepth.responses,
      ...soulConsultation.depthResponses
    }),
    signature:signature(stableSeed, 'whit-divine-soul-card'),
    readerProfile:Object.freeze({
      ...base.readerProfile,
      voice:'Whit Alma Divina',
      adaptiveDepth:true,
      voiceDepth:choice.mode,
      visibleForces:Object.freeze([])
    }),
    divineProfile:Object.freeze({
      voiceChoice:choice,
      modules:Object.freeze(modules),
      integratedForces:Object.freeze(['fé', 'amor', 'mente', 'livre-arbítrio', 'matéria', 'espírito']),
      heartCentered:true,
      fictionalReality:true,
      dependencyDesign:false
    }),
    knowledgeProfile:Object.freeze({
      version:KNOWLEDGE_ENGINE_VERSION,
      card:knowledge,
      visibleProse:false
    }),
    positionProfile:Object.freeze({
      version:POSITION_ENGINE_VERSION,
      classification:positioned.classification,
      reading:positioned.reading,
      positionChangesMeaning:true
    }),
    humanRealityProfile:Object.freeze({
      version:HUMAN_REALITY_ENGINE_VERSION,
      context:human.context,
      signals:human.signals,
      tarotGoverns:true,
      literalMindReading:false,
      futureIsConditional:true,
      privateSourcesUsed:false
    }),
    narrativeConsciousnessProfile:Object.freeze({
      version:NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
      arc:narrative.arcProfile,
      coverage:narrative.coverage,
      completeArc:narrative.coverage.completeArc,
      repeatedMotorParagraphs:false,
      finalVoice:'Whit'
    }),
    soulVoiceProfile:Object.freeze({
      version:SOUL_VOICE_ENGINE_VERSION,
      ...soulVoice.profile,
      integrity:soulVoice.integrity
    }),
    livingDepthProfile:Object.freeze({
      version:LIVING_DEPTH_ENGINE_VERSION,
      ...livingDepth.profile,
      coverage:livingDepth.coverage
    }),
    supremeCounselProfile:Object.freeze({
      version:SUPREME_COUNSEL_ENGINE_VERSION,
      ...supremeCounsel.profile,
      integrity:supremeCounsel.integrity
    }),
    soulConsultationProfile:Object.freeze({
      version:SOUL_CONSULTATION_ENGINE_VERSION,
      ...soulConsultation.profile
    }),
    cohesion:Object.freeze({
      ...base.cohesion,
      divineSoul:true,
      adaptiveDepth:true,
      heartCentered:true,
      singleVoice:true
    })
  };
  return Object.freeze({
    ...reading,
    provingGroundProfile:proveCardReading(reading, card, {
      position:moment,
      question:intention
    })
  });
}

function spreadOpening(card, identity, position, seed, positioned) {
  const positionTruth = lower(positioned?.reading?.statement || identity.pressure);
  return choose([
    `Eu vejo esta mesa começar em ${cardName(card)}: na posição “${position}”, ${positionTruth}`,
    `${cardName(card)} abre a história em “${position}” e mostra que ${positionTruth}`,
    `A primeira respiração desta mesa pertence a ${cardName(card)}: ${positionTruth}`
  ], seed, 'spread-opening');
}

function spreadCenter(card, identity, position, territory, seed, positioned) {
  const context = territory !== 'general' ? ` dentro da sua questão sobre ${TERRITORY_LABEL[territory] || territory}` : '';
  const positionTruth = lower(positioned?.reading?.statement || identity.truth);
  return choose([
    `Quando ${cardName(card)} alcança o centro${context}, a história muda: ${positionTruth}`,
    `O coração da tiragem está em ${cardName(card)}, na posição “${position}”: ${positionTruth}`,
    `${cardName(card)} ocupa o centro e revela a consciência que une a mesa: ${positionTruth}`
  ], seed, 'spread-center');
}

function soulfulDepthAxes(voices = []) {
  return Object.freeze(voices.slice(0, 3).map(voice => clean(voice, 700)
    .replace(/^Abertura\s*·/u, 'Onde tudo começa ·')
    .replace(/^Centro\s*·/u, 'O coração da mesa ·')
    .replace(/^Desfecho\s*·/u, 'O que deseja nascer ·')));
}

function divineSpread(cards, positions, seed, intention, inherited) {
  const base = inherited || superiorConversation(cards, positions, seed, intention);
  const knowledge = tarotKnowledgeDeck(cards);
  const positionMap = positionedTarotSpread(cards, positions, { question:intention });
  const dialogueMap = tarotDialogueSpread(cards, positions, {
    question:intention,
    positioned:positionMap
  });
  const humanMap = humanRealitySpread(cards, positions, {
    question:intention,
    positioned:positionMap,
    dialogue:dialogueMap
  });
  const narrativeMap = narrativeConsciousnessSpread(cards, positions, {
    question:intention,
    positioned:positionMap,
    dialogue:dialogueMap,
    human:humanMap
  });
  const soulVoiceMap = soulVoiceSpread(cards, positions, {
    question:intention,
    positioned:positionMap,
    dialogue:dialogueMap,
    human:humanMap,
    narrative:narrativeMap
  });
  const supremeCounselMap = supremeCounselSpread(cards, positions, {
    question:intention,
    positioned:positionMap,
    dialogue:dialogueMap,
    human:humanMap,
    narrative:narrativeMap
  });
  const livingDepthMap = livingDepthSpread(cards, positions, {
    question:intention,
    positioned:positionMap,
    dialogue:dialogueMap,
    human:humanMap,
    narrative:narrativeMap,
    soulVoice:soulVoiceMap,
    supremeCounsel:supremeCounselMap
  });
  const soulConsultationMap = soulConsultationSpread(positionMap, {
    human:humanMap,
    narrative:narrativeMap,
    supremeCounsel:supremeCounselMap
  });
  const analysis = base.superiorProfile?.analysis || {};
  const openingIndex = positionMap?.axes?.openingIndex ?? 0;
  const directionIndex = positionMap?.axes?.tendencyIndex ?? (cards.length - 1);
  const choice = spreadVoiceChoice(base, intention, cards.length);
  const stableSeed = `${seed}:${cards.map(cardKey).join('→')}:${positions.join('→')}:${normalize(intention)}`;
  const paragraphs = [...soulConsultationMap.visible.paragraphs];
  const modules = [
    'alma-da-consulta',
    'conselho-supremo',
    'alma-e-voz',
    'consciência-narrativa',
    'cartas-que-conversam',
    ...(narrativeMap.visible.human ? ['realidade-humana'] : []),
    'tendência',
    'livre-arbítrio',
    'matéria'
  ];
  const tendency = soulConsultationMap.visible.tendency;
  const counsel = soulConsultationMap.visible.counsel;
  const closing = soulConsultationMap.visible.closing;
  const reading = {
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'WHIT ALMA DIVINA · A ORBE DAS REALIDADES',
    title:`Whit Alma Divina · ${cardName(cards[openingIndex])} → ${cardName(cards[directionIndex])}`,
    heartline:soulConsultationMap.visible.opening,
    lead:soulConsultationMap.visible.tension,
    paragraphs:Object.freeze(paragraphs),
    story:paragraphs.join('\n\n'),
    closing,
    voices:soulfulDepthAxes(base.voices),
    tendencyText:tendency,
    counselText:counsel,
    depthOptions:livingDepthMap.options,
    depthResponses:Object.freeze({
      ...livingDepthMap.responses,
      ...soulConsultationMap.depthResponses
    }),
    signature:signature(stableSeed, 'whit-divine-soul-spread'),
    readerProfile:Object.freeze({
      ...base.readerProfile,
      voice:'Whit Alma Divina',
      adaptiveDepth:true,
      voiceDepth:choice.mode,
      visibleForces:Object.freeze([])
    }),
    divineProfile:Object.freeze({
      voiceChoice:choice,
      analysis,
      modules:Object.freeze(modules),
      integratedForces:Object.freeze(['fé', 'amor', 'mente', 'livre-arbítrio', 'matéria', 'espírito']),
      heartCentered:true,
      fictionalReality:true,
      dependencyDesign:false
    }),
    knowledgeProfile:Object.freeze({
      version:KNOWLEDGE_ENGINE_VERSION,
      cards:Object.freeze(knowledge.map(item => Object.freeze({
        key:item.card.key,
        name:item.card.name,
        element:item.card.element,
        intensity:item.intensity,
        narrativeRoles:item.narrativeRoles
      }))),
      visibleProse:false
    }),
    positionProfile:Object.freeze({
      version:POSITION_ENGINE_VERSION,
      axes:positionMap.axes,
      sequence:positionMap.positionSequence,
      recognizedPositions:positionMap.recognizedPositions,
      inferredPositions:positionMap.inferredPositions,
      positionChangesMeaning:true
    }),
    dialogueProfile:Object.freeze({
      version:DIALOGUE_ENGINE_VERSION,
      edgeCount:dialogueMap.coverage.edgeCount,
      cardsUsed:dialogueMap.coverage.cardCount,
      uniqueKeys:dialogueMap.coverage.uniqueKeys,
      sectorCount:dialogueMap.coverage.sectorCount,
      sectors:Object.freeze(dialogueMap.sectors.map(sector => Object.freeze({
        label:sector.label,
        startIndex:sector.startIndex,
        endIndex:sector.endIndex,
        dominantKey:sector.dominant.key,
        turningPair:sector.turningPair
      }))),
      turningPair:dialogueMap.turningEdge?.pairKey || '',
      allCardsUsed:dialogueMap.coverage.allCardsUsed,
      allTransitionsRead:dialogueMap.coverage.allTransitionsRead,
      singleVoice:true
    }),
    humanRealityProfile:Object.freeze({
      version:HUMAN_REALITY_ENGINE_VERSION,
      context:humanMap.context,
      conflict:humanMap.humanConflict,
      evidence:humanMap.evidence,
      axes:humanMap.axes,
      tarotGoverns:true,
      wholeTableInherited:humanMap.integrity.wholeTableInherited,
      literalMindReading:false,
      futureIsConditional:true,
      privateSourcesUsed:false,
      singleVoice:true
    }),
    narrativeConsciousnessProfile:Object.freeze({
      version:NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
      arc:narrativeMap.arcProfile,
      pattern:narrativeMap.pattern,
      coverage:narrativeMap.coverage,
      completeArc:narrativeMap.coverage.completeArc,
      repeatedMotorParagraphs:false,
      finalVoice:'Whit'
    }),
    soulVoiceProfile:Object.freeze({
      version:SOUL_VOICE_ENGINE_VERSION,
      ...soulVoiceMap.profile,
      integrity:soulVoiceMap.integrity,
      coverage:soulVoiceMap.coverage
    }),
    livingDepthProfile:Object.freeze({
      version:LIVING_DEPTH_ENGINE_VERSION,
      ...livingDepthMap.profile,
      coverage:livingDepthMap.coverage
    }),
    supremeCounselProfile:Object.freeze({
      version:SUPREME_COUNSEL_ENGINE_VERSION,
      ...supremeCounselMap.profile,
      integrity:supremeCounselMap.integrity
    }),
    soulConsultationProfile:Object.freeze({
      version:SOUL_CONSULTATION_ENGINE_VERSION,
      ...soulConsultationMap.profile
    }),
    cohesion:Object.freeze({
      ...base.cohesion,
      divineSoul:true,
      adaptiveDepth:true,
      heartCentered:true,
      wholeTable:true,
      singleVoice:true
    })
  };
  return Object.freeze({
    ...reading,
    provingGroundProfile:proveSpreadReading(reading, cards, positions, {
      question:intention
    })
  });
}

export function storyForCard(card, seed = secureLoveSeed(), options = {}) {
  return divineCard(card, seed, {
    scope:options.scope || 'carta',
    moment:options.moment || 'agora',
    intention:options.intention || '',
    inherited:options.inherited
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const base = superiorConversation(validCards, safePositions, seed, intention);
  if (validCards.length === 1) {
    const single = divineCard(validCards[0], seed, {
      scope:'tiragem', moment:safePositions[0], intention,
      inherited:base
    });
    return Object.freeze({
      ...single,
      label:'WHIT ALMA DIVINA · UMA CARTA, UMA PRESENÇA',
      title:`Whit Alma Divina · ${cardName(validCards[0])}`,
      lead:single.whisper,
      voices:soulfulDepthAxes(base.voices)
    });
  }
  return divineSpread(validCards, safePositions, seed, intention, base);
}

function cardFromResponse(response, cards) {
  const available = (Array.isArray(cards) ? cards : []).filter(Boolean);
  return available.find(card => {
    if (response?.storyCard?.id !== '' && String(card?.id) === String(response?.storyCard?.id)) return true;
    if (response?.storyCard?.canonicalId && card?.canonicalId === response.storyCard.canonicalId) return true;
    return cardName(card) === response?.storyCard?.name;
  }) || Object.freeze({
    id:response?.storyCard?.id ?? '',
    canonicalId:response?.storyCard?.canonicalId ?? '',
    name:response?.storyCard?.name || 'A Estrela'
  });
}

function followUpType(input) {
  const value = normalize(input);
  if (/\b(?:e o conselho|qual o conselho|so o conselho|somente o conselho)\b/.test(value)) return 'counsel';
  if (/\b(?:e a tendencia|qual a tendencia|e o futuro|para onde vai)\b/.test(value)) return 'tendency';
  if (/\b(?:aprofundar o amor|e no amor|no amor)\b/.test(value)) return 'love';
  if (/\b(?:entender as cartas|explique as cartas)\b/.test(value)) return 'cards';
  if (/\b(?:explicar a posicao|explique a posicao|entender a posicao)\b/.test(value)) return 'position';
  if (/\b(?:aprofundar|explique mais)\b/.test(value)) return 'depth';
  return '';
}

function responseText(reading, focus = '') {
  if (reading.depthResponses?.[focus]) return reading.depthResponses[focus];
  if (focus === 'counsel') return [reading.counselText, reading.closing].filter(Boolean).join(' ');
  if (focus === 'tendency') {
    return [reading.tendencyText, 'O caminho continua vivo porque sua escolha ainda participa dele.'].filter(Boolean).join(' ');
  }
  if (focus === 'depth') {
    return [
      reading.heartline,
      reading.lead || reading.whisper,
      ...reading.paragraphs,
      ...(reading.voices || []),
      reading.closing
    ].filter(Boolean).join('\n\n');
  }
  return [reading.heartline, reading.lead || reading.whisper, reading.story, reading.closing].filter(Boolean).join('\n\n');
}

export function storyResponse(input, options = {}) {
  const raw = clean(input, 700);
  const base = superiorResponse(raw, options);
  if (base.safety || base.matterQuery || !base.storyCard) {
    return Object.freeze({
      ...base,
      engine:`${base.engine}+${STORY_ENGINE_NAME}`,
      version:STORY_ENGINE_VERSION,
      storyEngine:STORY_ENGINE_NAME
    });
  }

  const card = cardFromResponse(base, options.cards);
  const intention = clean(base.consultationContext?.intention, 700) || raw;
  const follow = followUpType(raw);
  const voiceIntention = follow === 'depth' ? `${intention} aprofundar` : intention;
  const reading = divineCard(card, options.seed || secureLoveSeed(), {
    scope:'whit', moment:'Consulta', intention:voiceIntention
  });
  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyCard:card,
    storyTitle:reading.title,
    storySignature:reading.signature,
    storyCohesion:true,
    tarotGrounded:true,
    tarotBasis:reading.tarotBasis,
    readerProfile:reading.readerProfile,
    divineProfile:reading.divineProfile,
    actions:Object.freeze([]),
    text:responseText(reading, follow)
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    previousEnginesPreserved:true,
    superiorIntelligencePreserved:true,
    adaptiveVoice:true,
    fixedSentenceTarget:false,
    heartCentered:true,
    livingSpreadNarrative:true,
    fictionalReality:true,
    conditionalFuture:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    dependencyDesign:false,
    deepTarotKnowledge:KNOWLEDGE_ENGINE_VERSION,
    positionIntelligence:POSITION_ENGINE_VERSION,
    cardDialogue:DIALOGUE_ENGINE_VERSION,
    humanReality:HUMAN_REALITY_ENGINE_VERSION,
    narrativeConsciousness:NARRATIVE_CONSCIOUSNESS_ENGINE_VERSION,
    soulVoice:SOUL_VOICE_ENGINE_VERSION,
    livingDepth:LIVING_DEPTH_ENGINE_VERSION,
    supremeCounsel:SUPREME_COUNSEL_ENGINE_VERSION,
    soulConsultation:SOUL_CONSULTATION_ENGINE_VERSION,
    provingGround:PROVING_GROUND_ENGINE_VERSION,
    rule:'Whit fala até a leitura ficar inteira — e então sabe silenciar'
  });
}
