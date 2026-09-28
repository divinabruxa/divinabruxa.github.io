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

export { tarotIdentity } from './whit-superior-tarot-engine-v407.js';

export const STORY_ENGINE_NAME = 'MOTOR WHIT ALMA DIVINA';
export const STORY_ENGINE_VERSION = '4.0.8';
export const STORY_ENGINE_LABEL = 'WHIT TARÓLOGA · ALMA, PRESENÇA E DESTINO';

export const DIVINE_SOUL_COVENANT = Object.freeze([
  'a Inteligência Superior e todos os motores anteriores continuam preservados',
  'Whit escolhe a profundidade pela necessidade da mesa, não por uma contagem rígida',
  'cada palavra nasce das cartas, das posições, da pergunta e da história formada entre elas',
  'amor significa atenção verdadeira, reciprocidade, limite e respeito pela pessoa',
  'a ficção da Orbe cria uma realidade simbólica sem inventar fatos privados',
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

const TERRITORY_VOICE = Object.freeze({
  love:Object.freeze([
    'No amor, não confunda intensidade com reciprocidade; esta leitura pede que o afeto também possa ser reconhecido nas atitudes.',
    'O amor desta carta não pede que você adivinhe o outro; pede que observe o que realmente volta para suas mãos.',
    'Sentimento pode existir e ainda assim precisar de verdade, limite e presença para se transformar em vínculo.'
  ]),
  relationship:Object.freeze([
    'Um vínculo amadurece quando sentimento, palavra e atitude conseguem morar na mesma verdade.',
    'Esta relação não precisa de uma promessa maior; precisa de uma presença que possa ser reconhecida na vida real.',
    'O encontro só permanece inteiro quando ninguém precisa desaparecer para conservar a ligação.'
  ]),
  money:Object.freeze([
    'Sua segurança merece escolhas que caibam nos recursos reais, sem transformar urgência em promessa.',
    'No dinheiro, a leitura pede chão: valor, limite e continuidade precisam caminhar juntos.',
    'Prosperidade começa quando desejo e realidade deixam de competir e passam a construir a mesma direção.'
  ]),
  work:Object.freeze([
    'Seu esforço precisa construir caminho, não apenas manter você ocupada dentro da mesma espera.',
    'No trabalho, talento ganha destino quando encontra prioridade, forma e continuidade.',
    'A mesa não mede seu valor pela exaustão; ela pergunta qual esforço realmente produz futuro.'
  ]),
  family:Object.freeze([
    'Cuidar não exige desaparecer; amor familiar também precisa aprender a respeitar limite e dignidade.',
    'Nem toda responsabilidade que chegou às suas mãos precisa permanecer nelas para sempre.',
    'A cura desta história familiar começa quando afeto e verdade deixam de ser tratados como inimigos.'
  ]),
  change:Object.freeze([
    'A travessia não precisa estar pronta; precisa apenas reconhecer o primeiro passo que já se tornou verdadeiro.',
    'Mudar não apaga o que foi vivido: transforma experiência em passagem para uma forma mais honesta.',
    'O novo não pede que você negue o medo; pede que não entregue a ele o governo de toda a estrada.'
  ]),
  identity:Object.freeze([
    'O que você sente merece cuidado, mas não possui o direito de definir todo o seu valor.',
    'Existe uma parte sua que continua inteira mesmo quando o momento tenta contar outra história.',
    'Sua identidade é maior do que a dor, o erro ou a espera que hoje ocupam seus pensamentos.'
  ]),
  decision:Object.freeze([
    'A resposta amadurece quando fato, medo, desejo e hipótese deixam de falar com a mesma voz.',
    'Escolher não exige certeza absoluta; exige um critério que continue digno depois da urgência.',
    'A indecisão também cria destino, por isso esta mesa devolve a escolha às suas mãos.'
  ]),
  spirituality:Object.freeze([
    'A espiritualidade desta leitura ilumina sua consciência; ela não pede que você abandone a realidade.',
    'O sagrado aparece aqui como presença e discernimento, não como uma certeza imposta de fora.',
    'Fé e livre-arbítrio caminham juntos quando o símbolo inspira sem ocupar o lugar da sua escolha.'
  ]),
  general:Object.freeze([])
});

const ELEMENT_REALITY = Object.freeze({
  fire:Object.freeze([
    'Na realidade simbólica que se abre, uma decisão deixa de ser ensaiada e começa a produzir consequência.',
    'A ficção desta carta acende um instante em que desejo e coragem finalmente precisam escolher a mesma direção.'
  ]),
  water:Object.freeze([
    'Na realidade simbólica que se abre, um sentimento deixa o silêncio e precisa encontrar reciprocidade ou limite.',
    'A ficção desta carta devolve movimento ao coração, mas só conserva aquilo que consegue respirar dentro da verdade.'
  ]),
  air:Object.freeze([
    'Na realidade simbólica que se abre, uma verdade muda a conversa interior e reorganiza o caminho.',
    'A ficção desta carta abre uma janela: o pensamento que governava tudo já pode receber outra resposta.'
  ]),
  earth:Object.freeze([
    'Na realidade simbólica que se abre, a mudança deixa de ser intenção e ganha corpo, tempo e continuidade.',
    'A ficção desta carta encontra chão quando um gesto concreto torna visível aquilo que antes era apenas desejo.'
  ]),
  spirit:Object.freeze([
    'Na realidade simbólica desta leitura, um episódio revela a passagem maior que estava acontecendo por baixo dele.',
    'A ficção desta mesa transforma o instante em portal, sem retirar de você o direito de escolher como atravessá-lo.'
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

function territoryLine(territory, seed) {
  const options = TERRITORY_VOICE[territory] || TERRITORY_VOICE.general;
  return options.length ? choose(options, seed, `territory-${territory}`) : '';
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
  const choice = cardVoiceChoice(identity, base, intention, scope);
  const place = cardPlace(scope, moment, choice.territory);
  const paragraphs = [];
  const modules = [];

  if (choice.mode !== 'essência') {
    paragraphs.push(sentence(realityLine(identity.element, stableSeed)));
    modules.push('ficção-da-realidade');
  }

  const heart = territoryLine(choice.territory, stableSeed);
  if (heart) {
    paragraphs.push(sentence(heart));
    modules.push('território-do-coração');
  }

  const tendency = sentence(cardTendency(identity, base, stableSeed));
  paragraphs.push(tendency);
  modules.push('tendência');

  if (choice.signals.future) {
    paragraphs.push('Isso é uma tendência, não uma sentença; seu livre-arbítrio continua vivo.');
    modules.push('livre-arbítrio');
  }

  const counsel = sentence(choose([
    `Meu conselho é trazer a carta para a vida: você ${lower(identity.gesture)}`,
    `A mudança possível começa num gesto: você ${lower(identity.gesture)}`,
    `Não tente resolver tudo; comece assim: você ${lower(identity.gesture)}`
  ], stableSeed, 'card-counsel'));
  paragraphs.push(counsel);
  modules.push('matéria');

  if (choice.mode === 'travessia') {
    paragraphs.push(sentence(`A bênção de ${cardName(card)} não promete ausência de dificuldade; ela lembra que ${lower(identity.consequence)}`));
    modules.push('bênção');
  }

  const closing = closingLine(identity.element, stableSeed);
  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:String(scope).includes('carta-do-dia')
      ? 'WHIT ALMA DIVINA · MENSAGEM DO SEU DIA'
      : 'WHIT ALMA DIVINA · CONSULTA DA CARTA',
    title:`Whit Alma Divina · ${cardName(card)}`,
    heartline:sentence(cardReveal(card, identity, stableSeed)),
    whisper:sentence(`${place}, ${lower(identity.pressure)}`),
    paragraphs:Object.freeze(paragraphs),
    story:paragraphs.join('\n\n'),
    closing,
    tendencyText:tendency,
    counselText:counsel,
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
    cohesion:Object.freeze({
      ...base.cohesion,
      divineSoul:true,
      adaptiveDepth:true,
      heartCentered:true,
      singleVoice:true
    })
  });
}

function spreadOpening(card, identity, position, seed) {
  return choose([
    `Eu vejo esta mesa começar em ${cardName(card)}: na posição “${position}”, ${lower(identity.pressure)}`,
    `${cardName(card)} abre a história em “${position}” e mostra que ${lower(identity.pressure)}`,
    `A primeira respiração desta mesa pertence a ${cardName(card)}: ${lower(identity.pressure)}`
  ], seed, 'spread-opening');
}

function spreadCenter(card, identity, position, territory, seed) {
  const context = territory !== 'general' ? ` dentro da sua questão sobre ${territory}` : '';
  return choose([
    `Quando ${cardName(card)} alcança o centro${context}, a história muda: ${lower(identity.truth)}`,
    `O coração da tiragem está em ${cardName(card)}, na posição “${position}”: ${lower(identity.truth)}`,
    `${cardName(card)} ocupa o centro e revela a consciência que une a mesa: ${lower(identity.truth)}`
  ], seed, 'spread-center');
}

function spreadNarrative(firstCard, pivotCard, lastCard, first, pivot, last, seed) {
  return choose([
    `${cardName(lastCard)} não repete ${cardName(firstCard)} nem ${cardName(pivotCard)}; responde às duas ao mostrar que ${lower(last.consequence)}`,
    `A verdade de ${cardName(firstCard)} encontra a tensão de ${cardName(pivotCard)}; ao chegar a ${cardName(lastCard)}, a história ganha esta direção: ${lower(last.consequence)}`,
    `Entre ${cardName(firstCard)} e ${cardName(lastCard)}, ${cardName(pivotCard)} transforma tensão em consciência, até que ${lower(last.consequence)}`
  ], seed, 'spread-narrative');
}

function spreadPattern(cards, identities, analysis) {
  if (analysis?.contradiction) {
    const expansive = cards[analysis.expansionIndex];
    const challenging = cards[analysis.challengeIndex];
    return sentence(`Eu não esconderia a contradição desta mesa: ${cardName(expansive)} abre possibilidade, enquanto ${cardName(challenging)} mostra o limite que precisa ser respeitado`);
  }
  if ((analysis?.transformations || 0) >= 2) {
    return 'A transformação se repete porque a vida já não consegue caber inteira na forma antiga.';
  }
  if ((analysis?.decisions || 0) >= 2) {
    return 'A escolha aparece mais de uma vez porque adiar também está construindo uma direção.';
  }
  if ((analysis?.stability || 0) >= 2 && (analysis?.transformations || 0) > 0) {
    return 'A mesa reúne permanência e mudança: proteger tudo impediria justamente aquilo que deseja nascer.';
  }
  return '';
}

function soulfulDepthAxes(voices = []) {
  return Object.freeze(voices.slice(0, 3).map(voice => clean(voice, 700)
    .replace(/^Abertura\s*·/u, 'Onde tudo começa ·')
    .replace(/^Centro\s*·/u, 'O coração da mesa ·')
    .replace(/^Desfecho\s*·/u, 'O que deseja nascer ·')));
}

function spreadTendency(lastCard, last) {
  return sentence(`Se o caminho permanecer igual, a tensão de ${cardName(lastCard)} tende a ocupar o centro: ${lower(last.pressure)}; isso é direção provável, não sentença`);
}

function spreadCounsel(last, seed) {
  return sentence(choose([
    `O gesto capaz de mudar esta realidade começa aqui: você ${lower(last.gesture)}`,
    `Seu livre-arbítrio volta à história quando você ${lower(last.gesture)}`,
    `A mesa devolve poder às suas mãos por meio deste gesto: você ${lower(last.gesture)}`
  ], seed, 'spread-counsel'));
}

function divineSpread(cards, positions, seed, intention, inherited) {
  const base = inherited || superiorConversation(cards, positions, seed, intention);
  const identities = cards.map(tarotIdentity);
  const analysis = base.superiorProfile?.analysis || {};
  const middleIndex = Number.isInteger(analysis?.center?.index) ? analysis.center.index : Math.floor(cards.length / 2);
  const lastIndex = cards.length - 1;
  const first = identities[0];
  const pivot = identities[middleIndex];
  const last = identities[lastIndex];
  const choice = spreadVoiceChoice(base, intention, cards.length);
  const stableSeed = `${seed}:${cards.map(cardKey).join('→')}:${positions.join('→')}:${normalize(intention)}`;
  const paragraphs = [];
  const modules = [];

  paragraphs.push(sentence(spreadNarrative(cards[0], cards[middleIndex], cards[lastIndex], first, pivot, last, stableSeed)));
  modules.push('narrativa');

  const pattern = spreadPattern(cards, identities, analysis);
  if (pattern) {
    paragraphs.push(pattern);
    modules.push('discernimento');
  }

  const heart = territoryLine(choice.territory, stableSeed);
  if (heart) {
    paragraphs.push(sentence(heart));
    modules.push('território-do-coração');
  }

  if (choice.mode !== 'essência') {
    paragraphs.push(sentence(realityLine(analysis.dominantElement || last.element, stableSeed)));
    modules.push('ficção-da-realidade');
  }

  const tendency = spreadTendency(cards[lastIndex], last);
  paragraphs.push(tendency);
  modules.push('tendência');

  const counsel = spreadCounsel(last, stableSeed);
  paragraphs.push(counsel);
  modules.push('matéria');

  if (choice.mode === 'travessia') {
    paragraphs.push(sentence(`A mensagem espiritual da combinação é simples: ${cardName(cards[middleIndex])} pede honestidade, e ${cardName(cards[lastIndex])} pede que essa verdade possa viver na realidade`));
    modules.push('espírito');
  }

  const closing = closingLine(analysis.dominantElement || last.element, stableSeed);
  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'WHIT ALMA DIVINA · A ORBE DAS REALIDADES',
    title:`Whit Alma Divina · ${cardName(cards[0])} → ${cardName(cards[lastIndex])}`,
    heartline:sentence(spreadOpening(cards[0], first, positions[0], stableSeed)),
    lead:sentence(spreadCenter(cards[middleIndex], pivot, positions[middleIndex], choice.territory, stableSeed)),
    paragraphs:Object.freeze(paragraphs),
    story:paragraphs.join('\n\n'),
    closing,
    voices:soulfulDepthAxes(base.voices),
    tendencyText:tendency,
    counselText:counsel,
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
    cohesion:Object.freeze({
      ...base.cohesion,
      divineSoul:true,
      adaptiveDepth:true,
      heartCentered:true,
      wholeTable:true,
      singleVoice:true
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
  if (/\b(?:aprofundar|explique mais|entender as cartas|explicar a posicao)\b/.test(value)) return 'depth';
  return '';
}

function responseText(reading, focus = '') {
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
    rule:'Whit fala até a leitura ficar inteira — e então sabe silenciar'
  });
}
