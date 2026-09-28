/*
 * DIVINA BRUXA 4.1.1 · INTELIGÊNCIA DAS POSIÇÕES
 *
 * A carta conserva sua identidade, mas muda de função conforme a casa.
 * Esta camada transforma rótulos de tiragem em papéis interpretativos reais.
 */

import { tarotKnowledgeForContext } from './whit-tarot-knowledge-v410.js';

export const POSITION_ENGINE_NAME = 'MOTOR DE INTELIGÊNCIA DAS POSIÇÕES';
export const POSITION_ENGINE_VERSION = '4.1.1';

export const POSITION_COVENANT = Object.freeze([
  'posição altera função, ênfase, movimento e conselho da carta',
  'o nome da casa nunca é usado apenas como decoração',
  'futuro permanece tendência condicionada pelo padrão atual',
  'obstáculo mostra distorção e passagem possível',
  'conselho e livre-arbítrio localizam uma escolha praticável',
  'esquemas desconhecidos recebem uma estrutura segura sem fingir certeza'
]);

const clean = (value, limit = 1000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value)
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
  const capitalized = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(capitalized) ? capitalized : `${capitalized}.`;
};
const cardName = card => clean(card?.name, 100) || 'Carta do Tarot';

const POSITION_SEMANTICS = Object.freeze({
  origin:Object.freeze({ title:'origem', base:'origin', mode:'causa', pattern:/\b(?:origem|raiz|causa|fundamento|base|passado distante)\b/ }),
  past:Object.freeze({ title:'passado', base:'past', mode:'herança', pattern:/\b(?:passado|antes|heranca|influencia anterior|o que ficou)\b/ }),
  present:Object.freeze({ title:'presente', base:'present', mode:'estado', pattern:/\b(?:presente|agora|momento atual|situacao atual|onde voce esta)\b/ }),
  obstacle:Object.freeze({ title:'obstáculo', base:'obstacle', mode:'fricção', pattern:/\b(?:obstaculo|bloqueio|desafio|o que cruza|cruza|contra|impedimento)\b/ }),
  hidden:Object.freeze({ title:'oculto', base:'hidden', mode:'invisível', pattern:/\b(?:oculto|invisivel|segredo|inconsciente|por baixo|nao vejo|fator oculto)\b/ }),
  desire:Object.freeze({ title:'desejo', base:'desire', mode:'aspiração', pattern:/\b(?:desejo|esperanca|aspiracao|meta consciente|consciente|o que quer)\b/ }),
  fear:Object.freeze({ title:'medo', base:'fear', mode:'receio', pattern:/\b(?:medo|receio|temor|esperancas e medos|esperanca e medo|o que evita)\b/ }),
  advice:Object.freeze({ title:'conselho', base:'advice', mode:'orientação', pattern:/\b(?:conselho|orientacao|como agir|o que fazer|direcao pratica)\b/ }),
  choice:Object.freeze({ title:'escolha', base:'choice', mode:'critério', pattern:/\b(?:escolha|decisao|caminho|opcao|encruzilhada)\b/ }),
  future:Object.freeze({ title:'futuro', base:'future', mode:'tendência', pattern:/\b(?:futuro|tendencia|proximo passo|futuro proximo|adiante|para onde vai)\b/ }),
  outcome:Object.freeze({ title:'resultado', base:'outcome', mode:'consequência', pattern:/\b(?:resultado|desfecho|consequencia|sintese|coroamento|resposta final)\b/ }),
  birth:Object.freeze({ title:'o que nasce', base:'birth', mode:'emergência', pattern:/\b(?:o que nasce|nascimento|nasce|comeca|emerge|novo ciclo|semente)\b/ }),
  ending:Object.freeze({ title:'o que termina', base:'ending', mode:'liberação', pattern:/\b(?:o que termina|terminar|termina|fim|encerra|encerramento|deixar ir|precisa morrer)\b/ }),
  freewill:Object.freeze({ title:'livre-arbítrio', base:'freewill', mode:'autoria', pattern:/\b(?:livre arbitrio|minha parte|poder pessoal|posso mudar|minha escolha)\b/ }),
  self:Object.freeze({ title:'você na situação', base:'present', mode:'identidade', pattern:/\b(?:voce|consulente|sua postura|como se coloca|eu na situacao)\b/ }),
  environment:Object.freeze({ title:'ambiente', base:'present', mode:'contexto', pattern:/\b(?:ambiente|ao redor|outras pessoas|influencia externa|exterior)\b/ }),
  general:Object.freeze({ title:'posição revelada', base:'general', mode:'presença', pattern:/(?!)/ })
});

const CANONICAL_LABEL = Object.freeze({
  origin:'Origem', past:'Passado', present:'Presente', obstacle:'Obstáculo', hidden:'Oculto',
  desire:'Desejo', fear:'Medo', advice:'Conselho', choice:'Escolha', future:'Futuro',
  outcome:'Resultado', birth:'O que nasce', ending:'O que termina', freewill:'Livre arbítrio',
  self:'Presente', environment:'Presente', general:'Posição revelada'
});

function detectedRole(label) {
  const value = normalize(label);
  if (/\besperancas? e medos?\b/.test(value)) return 'fear';
  return Object.keys(POSITION_SEMANTICS).find(key => key !== 'general' && POSITION_SEMANTICS[key].pattern.test(value)) || '';
}

function fallbackRole(index, total) {
  const schemas = {
    1:['general'],
    2:['present', 'advice'],
    3:['origin', 'present', 'future'],
    4:['origin', 'obstacle', 'advice', 'outcome'],
    5:['origin', 'present', 'hidden', 'advice', 'outcome'],
    10:['present', 'obstacle', 'origin', 'past', 'future', 'desire', 'self', 'environment', 'fear', 'outcome']
  };
  if (schemas[total]) return schemas[total][index] || 'general';
  if (index === 0) return 'origin';
  if (index === total - 1) return 'outcome';
  if (index === Math.floor(total / 2)) return 'present';
  return 'general';
}

function positionReading(knowledge, role) {
  const core = knowledge.core;
  const position = knowledge.positions[POSITION_SEMANTICS[role]?.base || 'general'] || knowledge.positions.general;
  const shared = {
    role,
    title:POSITION_SEMANTICS[role]?.title || POSITION_SEMANTICS.general.title,
    mode:POSITION_SEMANTICS[role]?.mode || POSITION_SEMANTICS.general.mode,
    function:POSITION_SEMANTICS[role]?.base === 'present' && ['self', 'environment'].includes(role)
      ? (role === 'self' ? 'mostrar como a pessoa participa da situação' : 'mostrar a força que o ambiente acrescenta')
      : position.function,
    emphasis:position.emphasis,
    resource:position.resource,
    movement:position.movement
  };
  const readings = {
    origin:{ ...shared, statement:`A raiz desta posição está onde ${lower(core.conflict)}`, possibility:`A origem deixa de comandar tudo quando ${lower(core.movement)}` },
    past:{ ...shared, statement:`O passado trouxe esta consequência: ${lower(core.consequence)}`, possibility:`O aprendizado preservado é que ${lower(core.truth)}` },
    present:{ ...shared, statement:`No presente, a questão central é que ${lower(core.conflict)}`, possibility:`A resposta disponível agora é esta: você ${lower(core.movement)}` },
    obstacle:{ ...shared, statement:`Como obstáculo, ${cardName({ name:knowledge.card.name })} mostra que ${lower(core.conflict)}`, possibility:`O bloqueio começa a ceder quando você ${lower(core.movement)}` },
    hidden:{ ...shared, statement:`Nos bastidores desta situação, ${lower(core.truth)}`, possibility:`Reconhecer essa força muda a leitura do que parecia apenas acaso` },
    desire:{ ...shared, statement:`O desejo busca esta consequência: ${lower(core.consequence)}`, possibility:`Ele amadurece quando aceita esta verdade: ${lower(core.truth)}` },
    fear:{ ...shared, statement:`O medo se concentra onde ${lower(core.conflict)}`, possibility:`Ele perde autoridade quando você ${lower(core.movement)}` },
    advice:{ ...shared, statement:`Como conselho, esta carta indica um gesto concreto: você ${lower(core.movement)}`, possibility:`O critério é simples: ${lower(core.truth)}` },
    choice:{ ...shared, statement:`A escolha precisa respeitar esta verdade: ${lower(core.truth)}`, possibility:`Sua autoria reaparece quando você ${lower(core.movement)}` },
    future:{ ...shared, statement:`Se o padrão atual continuar, a tendência aponta para isto: ${lower(core.consequence)}`, possibility:`A direção ainda pode mudar quando você ${lower(core.movement)}` },
    outcome:{ ...shared, statement:`Como resultado, esta carta reúne a consequência construída: ${lower(core.consequence)}`, possibility:`O desfecho permanece condicionado a esta verdade: ${lower(core.truth)}` },
    birth:{ ...shared, statement:`O que nasce começa a ganhar forma quando você ${lower(core.movement)}`, possibility:`A possibilidade aberta é esta: ${lower(core.consequence)}` },
    ending:{ ...shared, statement:`O que termina é a forma em que ${lower(core.conflict)}`, possibility:`O aprendizado que permanece é que ${lower(core.truth)}` },
    freewill:{ ...shared, statement:`Seu livre-arbítrio aparece neste gesto: você ${lower(core.movement)}`, possibility:`Essa escolha importa porque ${lower(core.truth)}` },
    self:{ ...shared, statement:`Nesta mesa, sua postura encontra esta tensão: ${lower(core.conflict)}`, possibility:`Sua participação muda quando você ${lower(core.movement)}` },
    environment:{ ...shared, statement:`O ambiente acrescenta esta força à situação: ${lower(core.consequence)}`, possibility:`Ainda assim, o contexto não substitui sua escolha` },
    general:{ ...shared, statement:`Esta posição revela que ${lower(core.truth)}`, possibility:`A passagem possível começa quando você ${lower(core.movement)}` }
  };
  const result = readings[role] || readings.general;
  return Object.freeze({
    ...result,
    statement:sentence(result.statement),
    possibility:sentence(result.possibility)
  });
}

export function classifyTarotPosition(label, { index = 0, total = 1 } = {}) {
  const detected = detectedRole(label);
  const role = detected || fallbackRole(index, total);
  const semantic = POSITION_SEMANTICS[role] || POSITION_SEMANTICS.general;
  return Object.freeze({
    role,
    title:semantic.title,
    mode:semantic.mode,
    label:clean(label, 100) || `Posição ${index + 1}`,
    detected:Boolean(detected),
    inferred:!detected
  });
}

export function positionedTarotCard(card, position = '', {
  question = '', territory = '', index = 0, total = 1
} = {}) {
  const classification = classifyTarotPosition(position, { index, total });
  const context = tarotKnowledgeForContext(card, {
    position:CANONICAL_LABEL[classification.role] || CANONICAL_LABEL.general,
    question,
    territory
  });
  const reading = positionReading(context.knowledge, classification.role);
  return Object.freeze({
    engine:POSITION_ENGINE_NAME,
    version:POSITION_ENGINE_VERSION,
    card:context.knowledge.card,
    classification,
    reading,
    territory:context.territory,
    knowledge:context.knowledge,
    integrity:Object.freeze({
      positionChangesMeaning:true,
      futureIsConditional:true,
      finalVoice:false
    })
  });
}

function firstIndex(entries, roles, fallback) {
  const index = entries.findIndex(entry => roles.includes(entry.classification.role));
  return index >= 0 ? index : fallback;
}

export function positionedTarotSpread(cards = [], positions = [], {
  question = '', territory = ''
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const entries = validCards.map((card, index) => positionedTarotCard(card, safePositions[index], {
    question, territory, index, total:validCards.length
  }));
  const lastIndex = entries.length - 1;
  const openingIndex = firstIndex(entries, ['origin', 'past', 'present'], 0);
  const tensionIndex = firstIndex(entries, ['obstacle', 'hidden', 'fear'], Math.floor(lastIndex / 2));
  const counselIndex = firstIndex(entries, ['advice', 'freewill', 'choice'], lastIndex);
  const tendencyIndex = firstIndex(entries, ['future', 'outcome'], lastIndex);
  const recognized = entries.filter(entry => entry.classification.detected).length;
  return Object.freeze({
    engine:POSITION_ENGINE_NAME,
    version:POSITION_ENGINE_VERSION,
    entries:Object.freeze(entries),
    axes:Object.freeze({ openingIndex, tensionIndex, counselIndex, tendencyIndex }),
    recognizedPositions:recognized,
    inferredPositions:entries.length - recognized,
    positionSequence:Object.freeze(entries.map(entry => entry.classification.role)),
    integrity:Object.freeze({
      everyCardPositioned:true,
      positionChangesMeaning:true,
      futureIsConditional:true,
      unknownSchemasHandled:true
    })
  });
}

export function positionEngineCapacity() {
  return Object.freeze({
    namedRoles:Object.keys(POSITION_SEMANTICS).length,
    fallbackSchemas:Object.freeze([1, 2, 3, 4, 5, 10]),
    changesFunction:true,
    changesEmphasis:true,
    changesMovement:true,
    conditionalFuture:true,
    writesFinalReading:false,
    rule:'a carta conserva sua identidade e muda de função conforme a casa'
  });
}
