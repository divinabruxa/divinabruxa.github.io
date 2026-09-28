/*
 * DIVINA BRUXA 4.0.7 · WHIT TARÓLOGA · INTELIGÊNCIA SUPERIOR
 *
 * Os motores anteriores continuam pensando. Esta camada não os substitui:
 * recebe seus sinais, observa a mesa inteira e entrega uma única síntese.
 * Regra central: entender muito, falar pouco.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import {
  storyConversation as readerConversation,
  storyForCard as readerForCard,
  storyResponse as readerResponse,
  tarotIdentity
} from './whit-tarot-reader-engine-v406.js';

export { tarotIdentity } from './whit-tarot-reader-engine-v406.js';

export const STORY_ENGINE_NAME = 'WHIT TARÓLOGA · INTELIGÊNCIA SUPERIOR';
export const STORY_ENGINE_VERSION = '4.0.7';
export const STORY_ENGINE_LABEL = 'A VOZ DO TAROT DA DIVINA BRUXA';

export const SUPERIOR_COVENANT = Object.freeze([
  'todos os motores anteriores permanecem ativos como inteligência interna',
  'Whit entrega uma única voz, sem revelar ou empilhar os bastidores',
  'uma carta recebe de três a cinco frases e tiragens pequenas recebem de quatro a sete',
  'as cartas formam narrativa por pergunta, posição, sequência, contraste e direção',
  'amor nunca transforma pensamento privado em fato e futuro nunca vira sentença',
  'toda síntese preserva uma escolha possível e termina em conselho praticável'
]);

const clean = (value, limit = 6000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 900)
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
const signature = (seed, key) => loveHash(`${seed}¦${key}`).toString(36).toUpperCase().padStart(8, '0');
const choose = (items, seed, key) => items[loveHash(`${seed}¦${key}`) % items.length];
const freezeRecord = record => Object.freeze(Object.fromEntries(
  Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? Object.freeze([...value]) : value])
));

const TERRITORIES = Object.freeze({
  love:Object.freeze({
    title:'amor',
    where:'No amor',
    pattern:/\b(?:amor|amar|apaixonad[oa]|romance|saudade|ex|reciprocidade)\b/,
    touch:'sentimento precisa ser confirmado por reciprocidade e atitude'
  }),
  relationship:Object.freeze({
    title:'relacionamentos',
    where:'Nos relacionamentos',
    pattern:/\b(?:relacao|relacionamento|namoro|casamento|parceir[oa]|vinculo)\b/,
    touch:'vínculo precisa unir presença, limite e reciprocidade'
  }),
  money:Object.freeze({
    title:'dinheiro',
    where:'No dinheiro',
    pattern:/\b(?:dinheiro|financa|salario|renda|divida|pagar|lucro|recurso)\b/,
    touch:'desejo precisa caber nos recursos, no tempo e na continuidade'
  }),
  work:Object.freeze({
    title:'trabalho',
    where:'No trabalho',
    pattern:/\b(?:trabalho|emprego|carreira|profissao|negocio|cliente|projeto|estudo)\b/,
    touch:'esforço precisa encontrar direção, consequência e resultado real'
  }),
  family:Object.freeze({
    title:'família',
    where:'Na família',
    pattern:/\b(?:familia|mae|pai|irma|irmao|filha|filho|parente|casa|lar)\b/,
    touch:'cuidado precisa conviver com limite para não virar autoabandono'
  }),
  change:Object.freeze({
    title:'mudança',
    where:'Em uma mudança',
    pattern:/\b(?:mudanca|mudar|recomeco|partir|terminar|fim|novo ciclo|transicao)\b/,
    touch:'a travessia precisa de um primeiro passo que exista no mundo real'
  }),
  identity:Object.freeze({
    title:'identidade',
    where:'Na sua identidade',
    pattern:/\b(?:identidade|autoestima|meu valor|quem sou|culpa|vergonha|ansiedade|sozinh[oa])\b/,
    touch:'a emoção do momento não deve receber o poder de definir seu valor inteiro'
  }),
  decision:Object.freeze({
    title:'escolhas',
    where:'Em uma escolha',
    pattern:/\b(?:decidir|decisao|escolher|escolha|duvida|opcao|caminho|direcao)\b/,
    touch:'fato, medo, desejo e hipótese precisam ocupar lugares diferentes'
  }),
  spirituality:Object.freeze({
    title:'espiritualidade',
    where:'Na espiritualidade',
    pattern:/\b(?:espiritual|espiritualidade|fe|alma|deus|oracao|sagrado|proposito)\b/,
    touch:'símbolo e realidade precisam caminhar juntos, sem certeza fabricada'
  }),
  general:Object.freeze({ title:'momento atual', where:'No momento atual', pattern:/(?!)/, touch:'' })
});

const ELEMENT_NAMES = Object.freeze({
  fire:'o fogo', water:'a água', air:'o ar', earth:'a terra', spirit:'os Arcanos Maiores'
});

const ELEMENT_INSIGHT = Object.freeze({
  fire:'o desejo quer movimento, mas precisa de direção para não virar pressa',
  water:'o sentimento governa a história, mas precisa de margem e reciprocidade',
  air:'pensamentos, palavras e decisões estão moldando o próximo capítulo',
  earth:'a resposta precisa deixar a intenção e ganhar corpo, tempo e continuidade',
  spirit:'a questão ultrapassa um episódio isolado e toca uma passagem maior da vida'
});

const ELEMENT_RELATION = Object.freeze({
  'fire>water':'a ação encontra o sentimento e precisa cuidar do que despertou',
  'water>fire':'o sentimento deixa a espera e exige atitude',
  'fire>air':'o impulso encontra pensamento e direção',
  'air>fire':'a compreensão precisa produzir movimento',
  'fire>earth':'a inspiração é testada pela realidade',
  'earth>fire':'o que estava sendo mantido recebe desejo e movimento',
  'water>air':'o coração encontra palavras para o que sabia em silêncio',
  'air>water':'a decisão encontra humanidade e passa a considerar o que é sentido',
  'water>earth':'o sentimento procura uma forma concreta de ser sustentado',
  'earth>water':'a segurança é perguntada se também possui afeto',
  'air>earth':'a ideia é medida pelos fatos e pelas consequências',
  'earth>air':'a estrutura recebe outra interpretação e deixa de parecer inevitável'
});

const START_KEYS = new Set(['louco', 'mago', 'as-de-paus', 'as-de-copas', 'as-de-espadas', 'as-de-ouros']);
const END_KEYS = new Set(['morte', 'julgamento', 'mundo', 'dez-de-paus', 'dez-de-copas', 'dez-de-espadas', 'dez-de-ouros']);
const DECISION_KEYS = new Set(['enamorados', 'carro', 'justica', 'dois-de-paus', 'dois-de-espadas', 'sete-de-copas']);
const STABILITY_KEYS = new Set(['imperador', 'hierofante', 'forca', 'temperanca', 'quatro-de-paus', 'quatro-de-copas', 'quatro-de-espadas', 'quatro-de-ouros']);
const TRANSFORMATION_KEYS = new Set(['roda', 'enforcado', 'morte', 'diabo', 'torre', 'julgamento']);
const EXPANSION_KEYS = new Set([
  'mago', 'imperatriz', 'carro', 'forca', 'temperanca', 'estrela', 'sol', 'julgamento', 'mundo',
  'as-de-paus', 'as-de-copas', 'as-de-ouros', 'seis-de-paus', 'nove-de-copas', 'dez-de-copas', 'dez-de-ouros'
]);
const CHALLENGE_KEYS = new Set([
  'enforcado', 'morte', 'diabo', 'torre', 'lua', 'cinco-de-paus', 'cinco-de-copas', 'cinco-de-espadas',
  'cinco-de-ouros', 'tres-de-espadas', 'oito-de-espadas', 'nove-de-espadas', 'dez-de-espadas', 'dez-de-paus'
]);

function territoryFor(intention, fallback = 'general') {
  const value = normalize(intention);
  const match = Object.entries(TERRITORIES).find(([key, territory]) => key !== 'general' && territory.pattern.test(value));
  const key = match?.[0] || (TERRITORIES[fallback] ? fallback : 'general');
  return Object.freeze({ key, ...TERRITORIES[key] });
}

function positionAt(positions, index) {
  return clean(positions?.[index], 100) || `Posição ${index + 1}`;
}

function positionFrom(scope, moment) {
  if (String(scope).includes('tiragem')) return clean(moment, 100).replace(/^\d+\s*[-–]\s*/u, '') || 'posição revelada';
  if (String(scope).includes('carta-do-dia')) return 'seu dia';
  if (String(scope).includes('tarot-livre')) return 'seu momento';
  return '';
}

function countBy(values) {
  return values.reduce((counts, value) => ({ ...counts, [value]:(counts[value] || 0) + 1 }), {});
}

function repeatedEntries(record, minimum = 2) {
  return Object.entries(record)
    .filter(([, count]) => count >= minimum)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([key, count]) => Object.freeze({ key, count }));
}

function dominantElement(identities) {
  const majorCount = identities.filter(identity => identity.source === 'major').length;
  if (majorCount >= Math.ceil(identities.length / 2)) return 'spirit';
  const counts = countBy(identities.map(identity => identity.element));
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || 'spirit';
}

function relationBetween(previous, current) {
  if (previous.source !== current.source) {
    return previous.source === 'major'
      ? 'um aprendizado maior desce para a realidade e pede consequência'
      : 'uma situação cotidiana abre uma passagem maior de consciência';
  }
  if (previous.element === current.element) {
    const element = ELEMENT_NAMES[current.element] || 'mesmo tema';
    return `${element} se repete e aprofunda o assunto até ele deixar de parecer detalhe`;
  }
  return ELEMENT_RELATION[`${previous.element}>${current.element}`]
    || 'uma força responde à outra e transforma a direção anterior';
}

function roleCount(identities, group) {
  return identities.filter(identity => group.has(identity.key)).length;
}

function analyze(cards, positions, intention) {
  const identities = cards.map(tarotIdentity);
  const middleIndex = Math.floor(cards.length / 2);
  const elementCounts = countBy(identities.map(identity => identity.element));
  const suitCounts = countBy(identities.filter(identity => identity.suit).map(identity => identity.suit));
  const rankCounts = countBy(identities.filter(identity => identity.rank).map(identity => identity.rank));
  const expansionIndex = identities.findIndex(identity => EXPANSION_KEYS.has(identity.key));
  const challengeIndex = identities.findIndex(identity => CHALLENGE_KEYS.has(identity.key));
  const transitions = identities.slice(1).map((identity, index) => Object.freeze({
    from:index,
    to:index + 1,
    relation:relationBetween(identities[index], identity)
  }));
  const elements = ['fire', 'water', 'air', 'earth'];
  return Object.freeze({
    territory:territoryFor(intention).key,
    cardCount:cards.length,
    majorCount:identities.filter(identity => identity.source === 'major').length,
    minorCount:identities.filter(identity => identity.source === 'minor').length,
    elementCounts:freezeRecord(elementCounts),
    suitCounts:freezeRecord(suitCounts),
    rankCounts:freezeRecord(rankCounts),
    dominantElement:dominantElement(identities),
    absentElements:Object.freeze(elements.filter(element => !elementCounts[element])),
    repeatedSuits:Object.freeze(repeatedEntries(suitCounts)),
    repeatedRanks:Object.freeze(repeatedEntries(rankCounts)),
    starts:roleCount(identities, START_KEYS),
    endings:roleCount(identities, END_KEYS),
    decisions:roleCount(identities, DECISION_KEYS),
    stability:roleCount(identities, STABILITY_KEYS),
    transformations:roleCount(identities, TRANSFORMATION_KEYS),
    contradiction:expansionIndex >= 0 && challengeIndex >= 0,
    expansionIndex,
    challengeIndex,
    opening:Object.freeze({ index:0, card:cardName(cards[0]), position:positionAt(positions, 0), key:identities[0]?.key }),
    center:Object.freeze({ index:middleIndex, card:cardName(cards[middleIndex]), position:positionAt(positions, middleIndex), key:identities[middleIndex]?.key }),
    ending:Object.freeze({ index:cards.length - 1, card:cardName(cards.at(-1)), position:positionAt(positions, cards.length - 1), key:identities.at(-1)?.key }),
    transitions:Object.freeze(transitions)
  });
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

function contextCards(context, available) {
  const saved = Array.isArray(context?.cards) ? context.cards : [];
  return saved.map(savedCard => (Array.isArray(available) ? available : []).find(card => {
    if (savedCard?.canonicalId && card?.canonicalId === savedCard.canonicalId) return true;
    if (savedCard?.id !== '' && String(card?.id) === String(savedCard?.id)) return true;
    return cardName(card) === cardName(savedCard);
  }) || savedCard).filter(Boolean);
}

function needsFreedom(intention) {
  return /\b(?:futuro|destino|vai|voltar|acontecer|resultado|quando|certeza|garantia|sim ou nao)\b/.test(normalize(intention));
}

function directCounsel(identity, base, prefix = '') {
  const inherited = clause(base?.realityProfile?.counsel);
  const counsel = inherited || `Você ${lower(identity.gesture)}`;
  return sentence(prefix ? `${prefix} ${lower(counsel)}` : counsel);
}

function cardCenter(identity, territory, position) {
  if (position === 'seu dia') return sentence(`No seu dia, ${lower(identity.pressure)}`);
  if (position === 'seu momento') return sentence(`No seu momento, ${lower(identity.pressure)}`);
  if (position) return sentence(`Na posição “${position}”, ${lower(identity.pressure)}`);
  if (territory.key !== 'general') return sentence(`Na sua questão sobre ${territory.title}, ${lower(identity.pressure)}`);
  return sentence(`O ponto central é este: ${lower(identity.pressure)}`);
}

function cardReading(card, seed, { scope, moment, intention, inherited } = {}) {
  const identity = tarotIdentity(card);
  const stableSeed = `${seed}:${cardKey(card)}:${scope}:${moment}:${normalize(intention)}`;
  const base = inherited || readerForCard(card, stableSeed, { scope, moment, intention });
  const territory = territoryFor(intention);
  const position = positionFrom(scope, moment);
  const reveal = choose([
    `${cardName(card)} revela que ${lower(identity.truth)}`,
    `Em ${cardName(card)}, o Tarot ilumina esta verdade: ${lower(identity.truth)}`,
    `A voz de ${cardName(card)} é precisa: ${lower(identity.truth)}`
  ], stableSeed, 'reveal');
  const tendency = choose([
    `Se o padrão continuar, ${lower(base.realityProfile?.unchanged || identity.pressure)}`,
    `Mantida a direção atual, ${lower(base.realityProfile?.unchanged || identity.pressure)}`,
    `Sem uma escolha diferente, ${lower(base.realityProfile?.unchanged || identity.pressure)}`
  ], stableSeed, 'tendency');
  const counsel = directCounsel(identity, base);
  const freedom = needsFreedom(intention)
    ? 'Esta é uma tendência, não uma sentença; sua próxima escolha ainda pode mudar a rota.'
    : '';
  const paragraphs = Object.freeze(freedom
    ? [sentence(tendency), counsel]
    : [sentence(tendency)]);
  const closing = freedom ? freedom : counsel;

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:String(scope).includes('carta-do-dia')
      ? 'WHIT TARÓLOGA · ESSÊNCIA DO SEU DIA'
      : 'WHIT TARÓLOGA · ESSÊNCIA DA CARTA',
    title:`${cardName(card)} · leitura de Whit`,
    heartline:sentence(reveal),
    whisper:cardCenter(identity, territory, position),
    paragraphs,
    story:paragraphs.join(' '),
    closing,
    signature:signature(stableSeed, 'whit-superior-card'),
    readerProfile:Object.freeze({
      ...base.readerProfile,
      voice:'single',
      territory:territory.key,
      visibleForces:Object.freeze([]),
      sentenceTarget:freedom ? 5 : 4
    }),
    superiorProfile:Object.freeze({
      card:identity.key,
      position:position || 'momento',
      territory:territory.key,
      tendency:'conditional',
      counsel:'practical',
      enginesIntegrated:true
    }),
    cohesion:Object.freeze({
      ...base.cohesion,
      superiorSynthesis:true,
      singleVoice:true,
      concise:true,
      conditionalFuture:true
    })
  });
}

function contradictionSentence(cards, identities, analysis) {
  if (!analysis.contradiction) return '';
  const expansionCard = cards[analysis.expansionIndex];
  const challengeCard = cards[analysis.challengeIndex];
  return sentence(`A promessa de ${cardName(expansionCard)} não apaga a resistência de ${cardName(challengeCard)}; a mesa sustenta possibilidade e limite ao mesmo tempo`);
}

function patternSentence(cards, identities, analysis) {
  const contradiction = contradictionSentence(cards, identities, analysis);
  if (contradiction) return contradiction;
  if (analysis.transformations >= 2) {
    return 'As cartas de transformação dominam a mesa: insistir na forma antiga tende a aumentar a ruptura.';
  }
  if (analysis.decisions >= 2) {
    return 'As cartas de decisão se repetem: a dúvida já começou a escolher por você.';
  }
  if (analysis.stability >= 2 && analysis.transformations > 0) {
    return 'Estabilidade e transformação aparecem juntas: preservar tudo também impediria o que precisa nascer.';
  }
  const insight = ELEMENT_INSIGHT[analysis.dominantElement] || ELEMENT_INSIGHT.spirit;
  return sentence(`O padrão dominante mostra que ${insight}`);
}

function spreadCounsel(lastIdentity, analysis) {
  const gesture = lower(lastIdentity.gesture);
  if (analysis.absentElements.includes('earth')) {
    return sentence(`Transforme a leitura em um gesto observável: você ${gesture}; essa escolha ainda pode mudar a tendência`);
  }
  if (analysis.absentElements.includes('air')) {
    return sentence(`Nomeie o fato central e então você ${gesture}; essa escolha ainda pode mudar a tendência`);
  }
  if (analysis.absentElements.includes('water')) {
    return sentence(`Reconheça o que sente e depois você ${gesture}; essa escolha ainda pode mudar a tendência`);
  }
  if (analysis.absentElements.includes('fire')) {
    return sentence(`Comece sem esperar certeza total: você ${gesture}; essa escolha ainda pode mudar a tendência`);
  }
  return sentence(`Agora, você ${gesture}; sua escolha ainda pode mudar a tendência`);
}

function depthAxes(cards, positions, identities, analysis) {
  if (cards.length === 1) {
    return Object.freeze([
      `${positionAt(positions, 0)} · ${cardName(cards[0])}: ${sentence(identities[0].truth)}`
    ]);
  }
  const middleIndex = analysis.center.index;
  const lastIndex = cards.length - 1;
  const axes = [
    `Abertura · ${positionAt(positions, 0)} → ${positionAt(positions, Math.min(1, lastIndex))}: ${sentence(relationBetween(identities[0], identities[Math.min(1, lastIndex)]))}`
  ];
  if (cards.length > 2) {
    axes.push(`Centro · ${positionAt(positions, middleIndex)} — ${cardName(cards[middleIndex])}: ${sentence(identities[middleIndex].truth)}`);
  }
  axes.push(`Desfecho · ${positionAt(positions, lastIndex)} — ${cardName(cards[lastIndex])}: ${sentence(identities[lastIndex].gesture)}`);
  return Object.freeze(axes.slice(0, 3));
}

export function storyForCard(card, seed = secureLoveSeed(), options = {}) {
  return cardReading(card, seed, {
    scope:options.scope || 'carta',
    moment:options.moment || 'agora',
    intention:options.intention || '',
    inherited:options.inherited
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const safePositions = validCards.map((_, index) => positionAt(positions, index));
  const inherited = readerConversation(validCards, safePositions, seed, intention);
  if (validCards.length === 1) {
    const single = cardReading(validCards[0], seed, {
      scope:'tiragem', moment:safePositions[0], intention
    });
    return Object.freeze({
      ...single,
      label:'WHIT TARÓLOGA · ESSÊNCIA DA TIRAGEM',
      title:`Essência da Tiragem · ${cardName(validCards[0])}`,
      lead:single.whisper,
      voices:depthAxes(validCards, safePositions, [tarotIdentity(validCards[0])], Object.freeze({ center:{ index:0 } }))
    });
  }

  const identities = validCards.map(tarotIdentity);
  const analysis = analyze(validCards, safePositions, intention);
  const middleIndex = analysis.center.index;
  const lastIndex = validCards.length - 1;
  const first = identities[0];
  const pivot = identities[middleIndex];
  const last = identities[lastIndex];
  const territory = territoryFor(intention);
  const stableSeed = `${seed}:${validCards.map(cardKey).join('→')}:${safePositions.join('→')}:${normalize(intention)}`;
  const opening = choose([
    `${cardName(validCards[0])} abre a mesa: ${lower(first.pressure)}`,
    `Em “${safePositions[0]}”, ${cardName(validCards[0])} mostra que ${lower(first.pressure)}`,
    `A raiz está em ${cardName(validCards[0])}: ${lower(first.pressure)}`
  ], stableSeed, 'spread-opening');
  const center = territory.key === 'general'
    ? choose([
      `No centro, ${cardName(validCards[middleIndex])} revela que ${lower(pivot.truth)}`,
      `Em “${safePositions[middleIndex]}”, ${cardName(validCards[middleIndex])} mostra que ${lower(pivot.truth)}`,
      `A virada está em ${cardName(validCards[middleIndex])}: ${lower(pivot.truth)}`
    ], stableSeed, 'spread-center')
    : choose([
      `${territory.where}, ${cardName(validCards[middleIndex])} revela que ${lower(pivot.truth)}`,
      `${territory.where}, ${cardName(validCards[middleIndex])} mostra que ${lower(pivot.truth)}`,
      `Sua questão sobre ${territory.title} encontra ${cardName(validCards[middleIndex])}: ${lower(pivot.truth)}`
    ], stableSeed, 'spread-center');
  const relation = relationBetween(first, last);
  const narrative = sentence(`De ${cardName(validCards[0])} a ${cardName(validCards[lastIndex])}, ${relation}; ${lower(last.consequence)}`);
  const pattern = patternSentence(validCards, identities, analysis);
  const tendency = sentence(`Se o padrão continuar, a tensão de ${cardName(validCards[lastIndex])} tende a dominar: ${lower(last.pressure)}`);
  const storySentences = [narrative, pattern, tendency].filter(Boolean);
  const story = storySentences.join(' ');
  const closing = spreadCounsel(last, analysis);

  return Object.freeze({
    ...inherited,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'WHIT TARÓLOGA · ESSÊNCIA DA TIRAGEM',
    title:`Essência da Tiragem · ${cardName(validCards[0])} → ${cardName(validCards[lastIndex])}`,
    heartline:sentence(opening),
    lead:sentence(center),
    story,
    paragraphs:Object.freeze(storySentences),
    closing,
    voices:depthAxes(validCards, safePositions, identities, analysis),
    signature:signature(stableSeed, 'whit-superior-spread'),
    readerProfile:Object.freeze({
      ...inherited.readerProfile,
      voice:'single',
      territory:territory.key,
      visibleForces:Object.freeze([]),
      sentenceTarget:2 + storySentences.length + 1
    }),
    superiorProfile:Object.freeze({
      analysis,
      enginesIntegrated:true,
      synthesis:'single-voice',
      depthAxes:Math.min(3, validCards.length),
      future:'conditional'
    }),
    cohesion:Object.freeze({
      ...inherited.cohesion,
      superiorSynthesis:true,
      singleVoice:true,
      concise:true,
      wholeTable:true,
      conditionalFuture:true
    })
  });
}

function followUpType(input) {
  const value = normalize(input);
  if (!value) return '';
  if (/\b(?:e o conselho|qual o conselho|so o conselho|somente o conselho)\b/.test(value)) return 'counsel';
  if (/\b(?:e a tendencia|qual a tendencia|e o futuro|para onde vai)\b/.test(value)) return 'tendency';
  if (/\b(?:aprofundar|explique mais|entender as cartas|explicar a posicao)\b/.test(value)) return 'depth';
  if (value.split(' ').length <= 8 && (/^e\b/.test(value) || territoryFor(value).key !== 'general')) return 'territory';
  return '';
}

function consultationContext(cards, positions, intention, territory) {
  return Object.freeze({
    cards:Object.freeze(cards.map(card => Object.freeze({
      id:card?.id ?? '',
      canonicalId:clean(card?.canonicalId, 100),
      name:cardName(card)
    }))),
    positions:Object.freeze([...positions]),
    intention:clean(intention, 700),
    territory,
    privateSourcesUsed:false
  });
}

function responseText(reading, focus = '') {
  if (focus === 'counsel') return reading.closing;
  if (focus === 'tendency') {
    const tendency = (reading.paragraphs || []).find(item => /\b(?:padr[aã]o|dire[cç][aã]o|tend[eê]ncia)\b/i.test(item));
    return [tendency, 'Esta direção continua aberta às suas escolhas.'].filter(Boolean).join(' ');
  }
  if (focus === 'depth' && reading.voices?.length) {
    return [reading.heartline, reading.lead || reading.whisper, ...reading.voices, reading.closing].filter(Boolean).join('\n\n');
  }
  return [reading.heartline, reading.lead || reading.whisper, reading.story, reading.closing].filter(Boolean).join('\n\n');
}

export function storyResponse(input, options = {}) {
  const raw = clean(input, 700);
  const base = readerResponse(raw, options);
  if (base.safety || base.matterQuery || !base.storyCard) {
    return Object.freeze({
      ...base,
      engine:`${base.engine}+${STORY_ENGINE_NAME}`,
      version:STORY_ENGINE_VERSION,
      storyEngine:STORY_ENGINE_NAME
    });
  }

  const follow = followUpType(raw);
  const rememberedCards = follow ? contextCards(options.consultationContext, options.cards) : [];
  const cards = rememberedCards.length ? rememberedCards : [cardFromResponse(base, options.cards)];
  const rememberedPositions = rememberedCards.length && Array.isArray(options.consultationContext?.positions)
    ? options.consultationContext.positions
    : cards.map(() => 'Consulta');
  const inheritedIntention = clean(options.consultationContext?.intention, 700);
  const currentTerritory = territoryFor(raw).key;
  const intention = follow && currentTerritory === 'general' && inheritedIntention ? inheritedIntention : raw;
  const reading = cards.length > 1
    ? storyConversation(cards, rememberedPositions, options.seed || secureLoveSeed(), intention)
    : cardReading(cards[0], options.seed || secureLoveSeed(), {
      scope:'whit', moment:rememberedPositions[0] || 'Consulta', intention,
      inherited:rememberedCards.length ? undefined : base
    });
  const territory = territoryFor(intention).key;

  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyCard:cards[0],
    storyTitle:reading.title,
    storySignature:reading.signature,
    storyCohesion:true,
    tarotGrounded:true,
    tarotBasis:reading.tarotBasis,
    readerProfile:reading.readerProfile,
    superiorProfile:reading.superiorProfile,
    actions:Object.freeze([]),
    consultationContext:consultationContext(cards, rememberedPositions, intention, territory),
    text:responseText(reading, follow)
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    previousEnginesPreserved:true,
    singleVoice:true,
    oneCardSentences:Object.freeze([3, 5]),
    smallSpreadSentences:Object.freeze([4, 7]),
    largeSpreadEssenceFirst:true,
    contextualQuestion:true,
    positionAware:true,
    orderAware:true,
    contradictionAware:true,
    conditionalFuture:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    rule:'dez motores pensam; uma única Whit Taróloga fala'
  });
}
