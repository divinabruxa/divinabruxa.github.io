/*
 * DIVINA BRUXA 4.1.3 · REALIDADE HUMANA
 *
 * A pergunta não substitui o Tarot: ela revela onde a leitura toca a vida.
 * Esta camada distingue necessidades humanas dentro do mesmo território e
 * converte carta, posição e combinação em evidência, tendência e escolha.
 */

import { positionedTarotCard, positionedTarotSpread } from './whit-tarot-position-engine-v411.js';
import { tarotDialogueSpread } from './whit-tarot-dialogue-engine-v412.js';

export const HUMAN_REALITY_ENGINE_NAME = 'MOTOR DA REALIDADE HUMANA';
export const HUMAN_REALITY_ENGINE_VERSION = '4.1.3';

export const HUMAN_REALITY_COVENANT = Object.freeze([
  'a pergunta localiza a vida humana sem governar as cartas',
  'perguntas diferentes dentro do mesmo território recebem critérios diferentes',
  'sentimento, desejo, hipótese e fato nunca são tratados como a mesma coisa',
  'pensamentos privados de terceiros não são apresentados como conhecimento',
  'futuro continua sendo tendência condicionada por padrão e escolha',
  'conselho termina em atitude observável e possível',
  'nenhum texto pessoal é buscado fora da consulta oferecida voluntariamente'
]);

const clean = (value, limit = 1000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const clause = value => clean(value, 4000).replace(/[.!?…]+$/u, '');
const lower = value => {
  const text = clause(value);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};
const sentence = value => {
  const text = clean(value, 5000);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};

const TERRITORIES = Object.freeze({
  relationship:Object.freeze({
    title:'relacionamento', opening:'No relacionamento',
    pattern:/\b(?:relacionamento|relacao|casamento|namoro|parceria|casal)\b/,
    evidence:'acordos, constância e responsabilidade compartilhada'
  }),
  love:Object.freeze({
    title:'amor', opening:'No amor',
    pattern:/\b(?:amor|amar|paixao|romance|afetiv\w*|saudade|ex)\b/,
    evidence:'atitudes, disponibilidade, reciprocidade e respeito'
  }),
  work:Object.freeze({
    title:'trabalho', opening:'No trabalho',
    pattern:/\b(?:trabalho|carreira|emprego|profiss\w*|projeto|negocio|chefe|equipe)\b/,
    evidence:'prioridades, entregas, acordos e condições reais'
  }),
  money:Object.freeze({
    title:'dinheiro', opening:'No dinheiro',
    pattern:/\b(?:dinheiro|financeir\w*|renda|divida|prosper\w*|recurso|invest\w*|gasto|pagar)\b/,
    evidence:'recursos, prazos, compromissos e riscos concretos'
  }),
  family:Object.freeze({
    title:'família', opening:'Na família',
    pattern:/\b(?:familia|familiar|mae|pai|filh\w*|irma|irmao|avo|casa)\b/,
    evidence:'limites, responsabilidades e cuidado possível'
  }),
  identity:Object.freeze({
    title:'identidade', opening:'Na relação com você',
    pattern:/\b(?:identidade|autoestima|quem sou|meu valor|confian[cç]a em mim|autonomia)\b/,
    evidence:'escolhas que preservam valor, corpo e autonomia'
  }),
  change:Object.freeze({
    title:'mudança', opening:'Na mudança',
    pattern:/\b(?:mudanca|recomeco|transicao|partir|mudar|travessia|novo ciclo)\b/,
    evidence:'condições, perdas e um primeiro passo sustentável'
  }),
  decision:Object.freeze({
    title:'decisão', opening:'Na decisão',
    pattern:/\b(?:decisao|escolha|devo|caminho|opcao|insistir|ficar ou|ir embora)\b/,
    evidence:'fatos, custos, desejos e consequências'
  }),
  spirituality:Object.freeze({
    title:'espiritualidade', opening:'Na espiritualidade',
    pattern:/\b(?:espiritual|alma|fe|proposito|sagrado|deus|oracao)\b/,
    evidence:'sentido, prática, realidade e discernimento'
  }),
  general:Object.freeze({
    title:'momento atual', opening:'Na vida concreta', pattern:/(?!)/,
    evidence:'fatos, atitudes, limites e consequências'
  })
});

const INTENTS = Object.freeze({
  return:Object.freeze({
    title:'reaproximação', pattern:/\b(?:voltar|volta|reconcili\w*|reatar|reaproxim\w*|retomar)\b/,
    evidence:'mudança observável, conversa direta e reciprocidade'
  }),
  trust:Object.freeze({
    title:'reconstrução da confiança', pattern:/\b(?:confianca|confiar|traic\w*|traiu|mentira|mentiu|segredo)\b/,
    evidence:'verdade verificável, reparação e consistência'
  }),
  ending:Object.freeze({
    title:'encerramento', pattern:/\b(?:termino|terminou|terminar|fim|separacao|deixar ir|encerrar|despedida)\b/,
    evidence:'o que já terminou, o que ainda prende e o limite necessário'
  }),
  commitment:Object.freeze({
    title:'compromisso', pattern:/\b(?:compromisso|comprometer|casar|casamento|namoro|oficial|assumir)\b/,
    evidence:'coerência entre palavra, disponibilidade e continuidade'
  }),
  reciprocity:Object.freeze({
    title:'reciprocidade', pattern:/\b(?:pensa em mim|sente por mim|me ama|gosta de mim|reciproc\w*|sentimentos? (?:dele|dela))\b/,
    evidence:'presença, atitude, troca e resposta concreta'
  }),
  communication:Object.freeze({
    title:'conversa', pattern:/\b(?:conversar|conversa|falar|mensagem|responder|resposta|contato|procurar)\b/,
    evidence:'clareza, escuta, oportunidade e resposta observável'
  }),
  boundary:Object.freeze({
    title:'limite', pattern:/\b(?:limite|afastar|proteger|respeito|dignidade|dizer nao)\b/,
    evidence:'dignidade, segurança e consequência sustentada'
  }),
  healing:Object.freeze({
    title:'cura', pattern:/\b(?:curar|cura|superar|perdoar|recuperar|cicatrizar|recomecar)\b/,
    evidence:'acolhimento, limite, apoio e continuidade'
  }),
  decision:Object.freeze({
    title:'decisão', pattern:/\b(?:devo|decidir|decisao|escolher|escolha|qual caminho|insistir|ficar|partir)\b/,
    evidence:'fato, desejo, custo e consequência'
  }),
  action:Object.freeze({
    title:'ação', pattern:/\b(?:como agir|o que fazer|proximo passo|qual atitude|como comecar)\b/,
    evidence:'o próximo gesto possível e o efeito que ele produz'
  }),
  timing:Object.freeze({
    title:'clareza sobre o tempo', pattern:/\b(?:quando|quanto tempo|em que momento|qual momento|demora|prazo)\b/,
    evidence:'ritmo, condições e sinais concretos de avanço'
  }),
  future:Object.freeze({
    title:'tendência futura', pattern:/\b(?:futuro|vai acontecer|acontecera|tendencia|resultado|para onde vai)\b/,
    evidence:'o padrão atual, o movimento e as escolhas ainda disponíveis'
  }),
  beginning:Object.freeze({
    title:'começo', pattern:/\b(?:comecar|inicio|iniciar|nascer|reconstruir|novo amor|novo trabalho|oportunidade)\b/,
    evidence:'abertura real, recurso disponível e primeiro passo'
  }),
  stability:Object.freeze({
    title:'estabilidade', pattern:/\b(?:estavel|estabilidade|seguranca|sustentar|divida|renda|organizar o dinheiro)\b/,
    evidence:'recurso disponível, ritmo e capacidade de sustentação'
  }),
  conflict:Object.freeze({
    title:'resolução do conflito', pattern:/\b(?:conflito|briga|problema|tensao|desentendimento|discussao)\b/,
    evidence:'causa, responsabilidade, limite e condição de reparo'
  }),
  purpose:Object.freeze({
    title:'propósito', pattern:/\b(?:proposito|missao|sentido espiritual|caminho espiritual|vocacao)\b/,
    evidence:'valor, prática e direção que possa ser sustentada'
  }),
  understanding:Object.freeze({
    title:'compreensão', pattern:/\b(?:por que|entender|compreender|o que significa|o que preciso saber|o que mostra)\b/,
    evidence:'padrão, origem, efeito e parte ainda escolhível'
  }),
  general:Object.freeze({
    title:'compreensão do momento', pattern:/(?!)/,
    evidence:'o que é sentido, o que é demonstrado e o que ainda pode ser escolhido'
  })
});

const TONES = Object.freeze({
  grief:/\b(?:luto|perda|saudade|dor|termino|separacao|abandono)\b/,
  fear:/\b(?:medo|ansiedade|receio|insegur\w*|preocup\w*|aflita|aflito)\b/,
  conflict:/\b(?:raiva|briga|traic\w*|mentira|injustica|culpa)\b/,
  hope:/\b(?:esperanca|sonho|desejo|quero|recomeco|oportunidade)\b/
});

const OTHER_SUBJECT = /\b(?:ele|ela|essa pessoa|a outra pessoa|meu ex|minha ex|o ex|a ex|sentimentos? (?:dele|dela)|pensa em mim)\b/;
const SHARED_SUBJECT = /\b(?:nos|nosso|nossa|juntos|relacao|relacionamento|casal)\b/;
const SELF_SUBJECT = /\b(?:eu|minha|meu|mim|devo|posso|quero|preciso)\b/;
const CERTAINTY_WORDS = /\b(?:certeza|garantia|sem duvida|sim ou nao|vai mesmo|com certeza|inevitavel)\b/;
const HIGH_STAKES_WORDS = /\b(?:saude|doenca|gravidez|medic\w*|diagnost\w*|processo|jurid\w*|advog\w*|investimento|aposta|divida)\b/;
const IMMEDIATE_TIME = /\b(?:hoje|agora|imediat|esta semana|neste momento)\b/;
const NEAR_TIME = /\b(?:em breve|proximos dias|proximas semanas|curto prazo)\b/;
const LONG_TIME = /\b(?:este ano|proximo ano|longo prazo|daqui a anos)\b/;

function classifyByPattern(value, collection, fallback) {
  return Object.keys(collection).find(key => key !== fallback && collection[key].pattern.test(value)) || fallback;
}

function classifySubject(value) {
  if (OTHER_SUBJECT.test(value)) return 'other';
  if (SHARED_SUBJECT.test(value)) return 'shared';
  if (SELF_SUBJECT.test(value)) return 'self';
  return 'unspecified';
}

function classifyTone(value) {
  return Object.keys(TONES).find(key => TONES[key].test(value)) || 'neutral';
}

function classifyTime(value) {
  if (IMMEDIATE_TIME.test(value)) return 'immediate';
  if (NEAR_TIME.test(value)) return 'near';
  if (LONG_TIME.test(value)) return 'long';
  return 'open';
}

function contextEvidence(context) {
  const territory = TERRITORIES[context.territory] || TERRITORIES.general;
  const intent = INTENTS[context.intent] || INTENTS.general;
  if (context.intent === 'general') return territory.evidence;
  return `${intent.evidence}, com confirmação em ${territory.evidence}`;
}

export function classifyHumanReality(question = '') {
  const value = normalize(question);
  const facets = Object.freeze(Object.keys(INTENTS).filter(key => key !== 'general' && INTENTS[key].pattern.test(value)));
  const intent = facets[0] || 'general';
  const subject = classifySubject(value);
  const detectedTerritory = classifyByPattern(value, TERRITORIES, 'general');
  const relationalIntent = ['return', 'commitment', 'reciprocity'].includes(intent);
  const territory = detectedTerritory === 'general' && relationalIntent ? 'love' : detectedTerritory;
  const tone = classifyTone(value);
  const time = classifyTime(value);
  const words = value.split(' ').filter(Boolean).length;
  const certaintyRequested = CERTAINTY_WORDS.test(value);
  const highStakes = HIGH_STAKES_WORDS.test(value);
  const needsTimingBoundary = facets.includes('timing');
  const requiresObservableEvidence = subject === 'other' || ['return', 'trust', 'reciprocity', 'commitment'].includes(intent);
  return Object.freeze({
    territory,
    territoryTitle:TERRITORIES[territory].title,
    intent,
    intentTitle:INTENTS[intent].title,
    facets,
    subject,
    tone,
    time,
    certaintyRequested,
    highStakes,
    needsTimingBoundary,
    requiresObservableEvidence,
    hasContext:Boolean(value),
    wordCount:words,
    signature:`${territory}:${intent}:${subject}:${tone}:${time}`,
    privacy:Object.freeze({
      usesOnlyOfferedQuestion:true,
      privateSourcesUsed:false,
      storesRawQuestion:false
    })
  });
}

function groundingSuffix(context) {
  if (!context.highStakes) return '';
  return ' Decisões importantes também precisam ser confirmadas com dados e apoio adequado.';
}

function focusSentence(entry, context) {
  if (!context.hasContext) return '';
  const territory = TERRITORIES[context.territory] || TERRITORIES.general;
  const evidence = contextEvidence(context);
  const center = `${territory.opening}, ${entry.card.name} leva sua busca por ${context.intentTitle} para ${lower(entry.knowledge.core.theme)}`;
  if (context.subject === 'other') {
    return `${sentence(`${center}; a resposta precisa aparecer em ${evidence}, não na tentativa de adivinhar pensamentos privados`)}${groundingSuffix(context)}`;
  }
  if (context.needsTimingBoundary) {
    return `${sentence(`${center}; o tempo depende de ${evidence}, não de uma data garantida`)}${groundingSuffix(context)}`;
  }
  if (context.certaintyRequested) {
    return `${sentence(`${center}; a direção se confirma por ${evidence}, nunca por garantia absoluta`)}${groundingSuffix(context)}`;
  }
  return `${sentence(`${center}; na prática, observe ${evidence}`)}${groundingSuffix(context)}`;
}

function actionSentence(entry, context) {
  return sentence(
    `Na busca por ${context.intentTitle}, use ${entry.card.name} como critério: ` +
    `${lower(entry.knowledge.core.truth)}; na prática, você ${lower(entry.knowledge.core.movement)}`
  );
}

function tendencySentence(entry, context) {
  const role = entry.classification.role;
  const opening = role === 'outcome'
    ? `Como resultado, ${entry.card.name}`
    : role === 'future'
      ? `Como futuro provável, ${entry.card.name}`
      : `Como direção, ${entry.card.name}`;
  return sentence(
    `${opening} aponta para isto: ${lower(entry.knowledge.core.consequence)}; ` +
    'isso é tendência, não sentença, e as próximas atitudes mostrarão se ela ganha realidade'
  );
}

function closingSentence(entry, context) {
  if (!context.hasContext) return '';
  if (context.subject === 'other') {
    return sentence(
      `${entry.card.name} devolve a leitura ao que pode ser observado e escolhido por você; ` +
      `sua direção não precisa depender de pensamentos que não foram demonstrados`
    );
  }
  if (context.needsTimingBoundary) {
    return sentence(
      `${entry.card.name} não fecha o relógio; mostra quais condições precisam amadurecer antes da próxima passagem`
    );
  }
  return sentence(
    `${entry.card.name} ilumina sua busca por ${context.intentTitle}, mas não decide por você`
  );
}

export function humanRealityForCard(card, {
  position = 'Posição revelada',
  question = '',
  positioned = null
} = {}) {
  if (!card) return null;
  const context = classifyHumanReality(question);
  const entry = positioned || positionedTarotCard(card, position, { question });
  return Object.freeze({
    engine:HUMAN_REALITY_ENGINE_NAME,
    version:HUMAN_REALITY_ENGINE_VERSION,
    context,
    card:Object.freeze({ key:entry.card.key, name:entry.card.name }),
    position:entry.classification,
    signals:Object.freeze({
      humanConflict:entry.knowledge.core.conflict,
      observableEvidence:contextEvidence(context),
      availableChoice:entry.knowledge.core.movement,
      conditionalDirection:entry.knowledge.core.consequence
    }),
    focusSentence:focusSentence(entry, context),
    actionSentence:actionSentence(entry, context),
    tendencySentence:tendencySentence(entry, context),
    closingSentence:closingSentence(entry, context),
    integrity:Object.freeze({
      tarotGoverns:true,
      questionSetsHumanContext:true,
      literalMindReading:false,
      futureIsConditional:true,
      privateSourcesUsed:false,
      finalVoice:false
    })
  });
}

function spreadFocusSentence(entries, dialogue, context) {
  if (!context.hasContext) return '';
  const territory = TERRITORIES[context.territory] || TERRITORIES.general;
  const edge = dialogue.turningEdge;
  const from = edge ? edge.from.name : entries[0].card.name;
  const to = edge ? edge.to.name : entries.at(-1).card.name;
  const evidence = contextEvidence(context);
  if (context.subject === 'other') {
    return `${sentence(
      `${territory.opening}, a passagem de ${from} para ${to} leva sua busca por ${context.intentTitle} ` +
      `ao que pode ser verificado: ${evidence}; a mesa não usa suposição sobre outra pessoa como resposta`
    )}${groundingSuffix(context)}`;
  }
  if (context.needsTimingBoundary) {
    return `${sentence(
      `${territory.opening}, a passagem de ${from} para ${to} mostra que o tempo depende de ${evidence}; ` +
      `a mesa revela condições, não uma data fechada`
    )}${groundingSuffix(context)}`;
  }
  if (context.certaintyRequested) {
    return `${sentence(
      `${territory.opening}, a passagem de ${from} para ${to} transforma sua busca por ${context.intentTitle} ` +
      `num critério real: ${evidence}, nunca uma garantia absoluta`
    )}${groundingSuffix(context)}`;
  }
  return `${sentence(
    `${territory.opening}, a passagem de ${from} para ${to} traz sua busca por ${context.intentTitle} ` +
    `para a vida real: observe ${evidence}`
  )}${groundingSuffix(context)}`;
}

export function humanRealitySpread(cards = [], positions = [], {
  question = '',
  positioned = null,
  dialogue = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const positionMap = positioned?.entries?.length === validCards.length
    ? positioned
    : positionedTarotSpread(validCards, safePositions, { question });
  const dialogueMap = dialogue?.coverage?.cardCount === validCards.length
    ? dialogue
    : tarotDialogueSpread(validCards, safePositions, { question, positioned:positionMap });
  const context = classifyHumanReality(question);
  const counselIndex = positionMap.axes.counselIndex;
  const tendencyIndex = positionMap.axes.tendencyIndex;
  const counsel = positionMap.entries[counselIndex];
  const tendency = positionMap.entries[tendencyIndex];
  const final = positionMap.entries.at(-1);
  const edge = dialogueMap.turningEdge;

  return Object.freeze({
    engine:HUMAN_REALITY_ENGINE_NAME,
    version:HUMAN_REALITY_ENGINE_VERSION,
    context,
    focusSentence:spreadFocusSentence(positionMap.entries, dialogueMap, context),
    actionSentence:actionSentence(counsel, context),
    tendencySentence:tendencySentence(tendency, context),
    closingSentence:closingSentence(final, context),
    humanConflict:Object.freeze({
      fromKey:edge?.from.key || positionMap.entries[0].card.key,
      toKey:edge?.to.key || final.card.key,
      turningPair:edge?.pairKey || '',
      statement:edge ? positionMap.entries[edge.index + 1].knowledge.core.conflict : final.knowledge.core.conflict
    }),
    evidence:Object.freeze({
      observable:contextEvidence(context),
      privateThoughtsTreatedAsFacts:false,
      exactDatePromised:false,
      absoluteCertaintyPromised:false
    }),
    axes:Object.freeze({ counselIndex, tendencyIndex }),
    integrity:Object.freeze({
      tarotGoverns:true,
      wholeTableInherited:dialogueMap.coverage.allCardsUsed,
      questionSetsHumanContext:true,
      literalMindReading:false,
      futureIsConditional:true,
      privateSourcesUsed:false,
      finalVoice:false
    })
  });
}

export function humanRealityCapacity() {
  return Object.freeze({
    territories:Object.keys(TERRITORIES).length,
    humanIntentions:Object.keys(INTENTS).length,
    subjectLenses:4,
    emotionalTones:Object.keys(TONES).length + 1,
    timeHorizons:4,
    distinguishesQuestionsInsideTerritory:true,
    requiresObservableEvidence:true,
    literalMindReading:false,
    exactDatesPromised:false,
    privateSourcesUsed:false,
    writesIndependentParagraphs:false,
    rule:'a pergunta mostra onde a vida dói; as cartas mostram como esse ponto se move'
  });
}
