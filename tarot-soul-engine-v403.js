/*
 * DIVINA BRUXA 4.0.3 · ALMA DO TAROT
 *
 * O significado central não é sorteado. Cada mensagem nasce da carta real,
 * traduz o símbolo para a vida cotidiana e termina com um conselho possível.
 * Nas tiragens, posição e ordem fazem as cartas responderem umas às outras.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import { matterResponse } from './matter-engine-v400.js';
import { tarotIdentity } from './tarot-story-engine-v402.js';

export { tarotIdentity } from './tarot-story-engine-v402.js';

export const STORY_ENGINE_NAME = 'ALMA DO TAROT';
export const STORY_ENGINE_VERSION = '4.0.3';
export const STORY_ENGINE_LABEL = 'VERDADE, JORNADA E CONSELHO';

export const STORY_COVENANT = Object.freeze([
  'o significado central de cada carta é estável e nunca sorteado',
  'símbolo, arcano, naipe, número e figura governam a mensagem',
  'toda leitura traduz o Tarot para uma situação reconhecível da vida cotidiana',
  'toda carta entrega luz, tensão e um conselho possível de praticar',
  'nas tiragens cada posição modifica a conversa entre as cartas',
  'a síntese orienta sem prometer destino, ler pensamentos ou retirar o livre-arbítrio'
]);

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 800)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};
const lowerSentence = value => clean(value).replace(/[.!?…]+$/u, '');
const cardName = card => clean(card?.name, 100) || 'Carta do Tarot';
const cardIdentity = card => `${card?.canonicalId ?? card?.id ?? 'carta'}:${cardName(card)}`;
const signature = (seed, key) => loveHash(`${seed}¦${key}`).toString(36).toUpperCase().padStart(8, '0');

const COUNSEL_VERBS = Object.freeze({
  confere:'confira', escolhe:'escolha', reune:'reúna', transforma:'transforme', suspende:'suspenda',
  observa:'observe', permite:'permita', oferece:'ofereça', define:'defina', organiza:'organize',
  assume:'assuma', escuta:'escute', separa:'separe', coloca:'coloque', segura:'segure', faz:'faça',
  aceita:'aceite', reduz:'reduza', avanca:'avance', reconhece:'reconheça', protege:'proteja', usa:'use',
  permanece:'permaneça', conduz:'conduza', interrompe:'interrompa', retira:'retire', honra:'honre',
  abre:'abra', combina:'combine', testa:'teste', cria:'crie', nomeia:'nomeie', toca:'toque',
  abandona:'abandone', deixa:'deixe', nutre:'nutra', verifica:'verifique', compartilha:'compartilhe',
  ouve:'ouça', celebra:'celebre', atravessa:'atravesse', recebe:'receba', compara:'compare', mede:'meça',
  mantem:'mantenha', acompanha:'acompanhe', prepara:'prepare', 'dá':'dê', entrega:'entregue', firma:'firme',
  elimina:'elimine', responde:'responda', preserva:'preserve', cuida:'cuide', redistribui:'redistribua',
  conserva:'conserve', experimenta:'experimente', entra:'entre', aquece:'aqueça', declara:'declare',
  convoca:'convoque', divide:'divida', respeita:'respeite', olha:'olhe', distingue:'distinga', leva:'leve',
  desfruta:'desfrute', constroi:'construa', inclui:'inclua', pergunta:'pergunte', regula:'regule',
  corta:'corte', abaixa:'abaixe', adia:'adie', identifica:'identifique', acende:'acenda', volta:'volte',
  investiga:'investigue', aprende:'aprenda', aponta:'aponte', fala:'fale', estabelece:'estabeleça',
  examina:'examine', reorganiza:'reorganize', libera:'libere', procura:'procure', torna:'torne',
  distribui:'distribua', ajusta:'ajuste', melhora:'melhore', estuda:'estude', formula:'formule',
  confirma:'confirme', cumpre:'cumpra', administra:'administre', mostra:'mostre', caminha:'caminhe'
});

function counselText(value) {
  return lowerSentence(value).replace(/(^|,\s+|\se\s+)(não\s+)?(depois\s+)?(\p{L}+)/gu, (match, link, negation = '', timing = '', word) => {
    const exact = word.toLocaleLowerCase('pt-BR');
    const replacement = COUNSEL_VERBS[exact] || COUNSEL_VERBS[normalize(word)] || word;
    return `${link}${negation}${timing}${replacement}`;
  });
}

const LENSES = Object.freeze({
  love:Object.freeze({
    keywords:/\b(?:amor|amar|apaixonad[oa]|relacao|relacionamento|namoro|casamento|saudade|ex|romance|reciprocidade)\b/,
    everyday:'Nos relacionamentos, compare sentimento, palavra e atitude. A verdade do vínculo aparece naquilo que se repete, não somente naquilo que é prometido.',
    action:'Escolha uma conversa honesta ou um limite claro que preserve afeto e dignidade ao mesmo tempo.',
    question:'O que esta relação demonstra com constância, além do que você gostaria que ela fosse?'
  }),
  work:Object.freeze({
    keywords:/\b(?:trabalho|emprego|carreira|dinheiro|projeto|negocio|cliente|profissao|estudo|criar|criatividade)\b/,
    everyday:'No trabalho e nos projetos, observe onde existe avanço real e onde existe apenas esforço acumulado. Resultado precisa de direção, recurso e continuidade.',
    action:'Transforme a orientação da carta numa tarefa pequena, verificável e possível de concluir hoje.',
    question:'Qual ação concreta aproxima você do resultado sem sacrificar aquilo que precisa continuar saudável?'
  }),
  family:Object.freeze({
    keywords:/\b(?:familia|mae|pai|irma|irmao|filha|filho|casa|parente)\b/,
    everyday:'Na família, amor e obrigação podem se misturar. Observe o que pertence ao cuidado e o que já se tornou repetição, culpa ou silêncio.',
    action:'Nomeie um comportamento específico e escolha uma atitude que una respeito, limite e responsabilidade.',
    question:'O que pode ser cuidado sem que você precise desaparecer dentro desse vínculo?'
  }),
  change:Object.freeze({
    keywords:/\b(?:mudar|mudanca|recomeco|novo|partir|viagem|cidade|fase|futuro|terminar|fim)\b/,
    everyday:'Nas mudanças, uma parte da vida termina antes de a nova forma estar pronta. O caminho fica mais claro quando o próximo passo é menor que o medo.',
    action:'Preserve o que sustenta você, encerre o que já cumpriu sua função e defina o primeiro passo do novo ciclo.',
    question:'O que já terminou por dentro, mesmo que ainda conserve a aparência de continuidade?'
  }),
  self:Object.freeze({
    keywords:/\b(?:eu|alma|autoestima|valor|vergonha|culpa|cansad[oa]|exaust[oa]|ansiedade|medo|triste|sozinh[oa]|identidade)\b/,
    everyday:'Na vida interior, a dor do momento não representa a pessoa inteira. Observe o que seu corpo, seus limites e sua consciência estão tentando tornar impossível de ignorar.',
    action:'Reduza o dia ao essencial e escolha um cuidado ou uma decisão que devolva dignidade ao seu próximo passo.',
    question:'De que você precisa agora para agir com respeito por si, e não apenas para encerrar o desconforto?'
  }),
  decision:Object.freeze({
    keywords:/\b(?:decidir|decisao|escolher|escolha|duvida|caminho|opcao|confus[oa])\b/,
    everyday:'Diante de uma decisão, separe fato, medo, desejo e hipótese. Nem toda incerteza desaparece antes do movimento, mas todo movimento pode produzir informação.',
    action:'Escreva os critérios essenciais e escolha o menor passo reversível capaz de testar a realidade.',
    question:'Qual escolha respeita melhor os fatos disponíveis e a pessoa que você deseja continuar sendo?'
  }),
  general:Object.freeze({
    keywords:/(?!)/,
    everyday:'Na vida cotidiana, esta carta pede atenção ao padrão que está se repetindo, ao efeito que ele produz e à escolha que ainda pertence a você.',
    action:'Escolha uma atitude simples que confirme a parte mais lúcida da mensagem antes que o dia termine.',
    question:'Qual verdade desta carta pode se transformar numa atitude real hoje?'
  })
});

function lensFor(intention, defaultLens = 'general') {
  const text = normalize(intention);
  const explicit = Object.entries(LENSES).find(([, lens]) => lens.keywords.test(text));
  const key = explicit?.[0] || (LENSES[defaultLens] ? defaultLens : 'general');
  return Object.freeze({ key, value:LENSES[key] });
}

function explicitIntention(intention) {
  const raw = clean(intention, 180).replace(/\s+/g, ' ').replace(/[.!?…]+$/u, '');
  return normalize(raw).split(' ').filter(Boolean).length >= 4 ? raw : '';
}

function soulSummary(identity) {
  return `Esta etapa da jornada pede este movimento: ${sentence(counselText(identity.gesture))} O aprendizado central é este: ${lowerSentence(identity.truth)}.`;
}

function tarotMessage(card, intention = '') {
  const identity = tarotIdentity(card);
  const lens = lensFor(intention, identity.defaultLens);
  const namedIntention = explicitIntention(intention);
  const context = namedIntention
    ? `Sua questão é: “${namedIntention}”. A carta não inventa fatos sobre ela; ilumina a forma de atravessá-la.`
    : lens.value.everyday;
  return Object.freeze({ identity, lens, context, summary:soulSummary(identity) });
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta', moment = 'agora', intention = ''
} = {}) {
  const safeSeed = `${seed}:${cardIdentity(card)}:${scope}:${moment}`;
  const message = tarotMessage(card, intention);
  const { identity, lens } = message;
  const label = scope.includes('carta-do-dia')
    ? 'MENSAGEM DO DIA · ESSÊNCIA E CONSELHO'
    : 'MENSAGEM DA CARTA · VERDADE E CONSELHO';

  const heartline = `Essência — ${sentence(identity.truth)}`;
  const whisper = `Direção central — ${sentence(counselText(identity.gesture))}`;
  const paragraphs = Object.freeze([
    `Na vida real — ${message.context}`,
    `Luz e tensão — ${sentence(identity.consequence)} Ao mesmo tempo, ${lowerSentence(identity.pressure)}.`,
    `Conselho prático — ${sentence(lens.value.action)}\n\nResumo da alma — ${message.summary}`
  ]);

  return Object.freeze({
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label,
    title:`${cardName(card)} · mensagem para sua jornada`,
    heartline,
    whisper,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:`Pergunta para levar com você — ${lens.value.question}`,
    signature:signature(safeSeed, 'tarot-soul'),
    tarotBasis:Object.freeze({
      card:cardName(card), source:identity.source, key:identity.key, arcana:identity.arcana,
      suit:identity.suit || '', rank:identity.rank || '', element:identity.element, lens:lens.key
    }),
    cohesion:Object.freeze({ essence:true, dailyLife:true, light:true, tension:true, advice:true, soulSummary:true, tarot:true })
  });
}

const ELEMENT_NAMES = Object.freeze({ fire:'fogo', water:'água', air:'ar', earth:'terra', spirit:'espírito' });

function positionAt(positions, index) {
  return clean(positions[index], 100) || `Posição ${index + 1}`;
}

function transition(previous, current, previousCard, currentCard) {
  const previousElement = ELEMENT_NAMES[previous.element] || 'mistério';
  const currentElement = ELEMENT_NAMES[current.element] || 'mistério';
  if (previous.element === current.element) {
    return `“${currentCard}” aprofunda o ${currentElement} iniciado por “${previousCard}”: não muda o assunto, mas exige que ele seja vivido com mais consciência`;
  }
  const movements = Object.freeze({
    'fire>water':'a emoção pergunta se o impulso também sabe cuidar',
    'water>fire':'a ação impede que o sentimento permaneça somente expectativa',
    'fire>air':'o pensamento dá direção ao impulso',
    'air>fire':'a ação transforma entendimento em consequência',
    'fire>earth':'a realidade exige que a inspiração construa algo sustentável',
    'earth>fire':'o desejo devolve movimento ao que estava apenas sendo mantido',
    'water>air':'a clareza dá nome ao que o coração já percebia',
    'air>water':'a sensibilidade devolve humanidade à decisão',
    'water>earth':'a realidade mostra como o sentimento pode ser sustentado',
    'earth>water':'o afeto pergunta se a segurança também está viva',
    'air>earth':'os fatos testam a ideia',
    'earth>air':'a reflexão abre uma alternativa dentro da estrutura'
  });
  const movement = movements[`${previous.element}>${current.element}`]
    || `o ${currentElement} responde ao ${previousElement}`;
  return `“${currentCard}” responde a “${previousCard}”: ${movement}`;
}

function representativeIndices(length) {
  if (length <= 10) return Array.from({ length }, (_, index) => index);
  return [...new Set([0, Math.round((length - 1) * .25), Math.round((length - 1) * .5), Math.round((length - 1) * .75), length - 1])];
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    const identity = tarotIdentity(validCards[0]);
    const single = storyForCard(validCards[0], seed, {
      scope:'tiragem', moment:positionAt(positions, 0), intention
    });
    return Object.freeze({
      ...single,
      label:'UMA CARTA · UMA MENSAGEM COMPLETA',
      lead:`Em ${positionAt(positions, 0)}, ${single.whisper}`,
      voices:Object.freeze([
        `${positionAt(positions, 0)} — ${cardName(validCards[0])}. Verdade: ${sentence(identity.truth)} Tensão: ${sentence(identity.pressure)} Conselho: ${sentence(counselText(identity.gesture))}`
      ])
    });
  }

  const identities = validCards.map(tarotIdentity);
  const first = validCards[0];
  const firstIdentity = identities[0];
  const lastIndex = validCards.length - 1;
  const last = validCards[lastIndex];
  const lastIdentity = identities[lastIndex];
  const pivotIndex = Math.floor(validCards.length / 2);
  const pivot = validCards[pivotIndex];
  const pivotIdentity = identities[pivotIndex];
  const lens = lensFor(intention, pivotIdentity.defaultLens);
  const namedIntention = explicitIntention(intention);
  const selected = representativeIndices(validCards.length);

  const lead = `Ponto de partida — Em ${positionAt(positions, 0)}, “${cardName(first)}” mostra que ${lowerSentence(firstIdentity.consequence)}. A tensão inicial é clara: ${lowerSentence(firstIdentity.pressure)}.`;
  const movement = selected.slice(1).map(index => {
    const previousIndex = index - 1;
    return `Em ${positionAt(positions, index)}, ${transition(identities[previousIndex], identities[index], cardName(validCards[previousIndex]), cardName(validCards[index]))}. O conselho de “${cardName(validCards[index])}” é: ${counselText(identities[index].gesture)}.`;
  }).join(' ');
  const journey = `Resumo da jornada — A leitura começa com esta verdade de “${cardName(first)}”: ${lowerSentence(firstIdentity.truth)}. No centro, “${cardName(pivot)}” acrescenta: ${lowerSentence(pivotIdentity.truth)}. Ao final, “${cardName(last)}” confirma: ${lowerSentence(lastIdentity.truth)}.`;
  const advice = `Conselho final — ${sentence(counselText(lastIdentity.gesture))} ${sentence(lens.value.action)}`;
  const story = [movement ? `Como as cartas conversam — ${movement}` : '', journey, advice].filter(Boolean).join('\n\n');

  const voices = Object.freeze(validCards.map((card, index) => {
    const identity = identities[index];
    return `${positionAt(positions, index)} — ${cardName(card)}. Verdade: ${sentence(identity.truth)} Tensão: ${sentence(identity.pressure)} Conselho: ${sentence(counselText(identity.gesture))}`;
  }));

  return Object.freeze({
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'AS CARTAS CONVERSAM · RESUMO DA JORNADA',
    title:`${cardName(first)} → ${cardName(last)} · síntese da alma`,
    heartline:namedIntention
      ? `Pergunta da jornada — “${namedIntention}”.`
      : `Essência da leitura — ${sentence(pivotIdentity.truth)}`,
    lead,
    story,
    voices,
    closing:`Pergunta para integrar a tiragem — ${lens.value.question}`,
    signature:signature(`${seed}:${validCards.map(cardIdentity).join('→')}`, 'tarot-soul-spread'),
    tarotBasis:Object.freeze({
      cards:Object.freeze(validCards.map((card, index) => Object.freeze({
        card:cardName(card), key:identities[index].key, source:identities[index].source,
        element:identities[index].element, position:positionAt(positions, index)
      })))
    }),
    cohesion:Object.freeze({ beginning:true, dialogue:true, synthesis:true, advice:true, soulSummary:true, tarot:true })
  });
}

function findMentionedCard(input, cards) {
  const text = ` ${normalize(input)} `;
  const candidates = cards.map(card => {
    const full = normalize(cardName(card));
    const withoutArticle = full.replace(/^(?:a|o|as|os)\s+/, '');
    return { card, terms:[full, withoutArticle].filter(term => term.length >= 3) };
  }).sort((a, b) => Math.max(...b.terms.map(term => term.length)) - Math.max(...a.terms.map(term => term.length)));
  return candidates.find(candidate => candidate.terms.some(term => text.includes(` ${term} `)))?.card || null;
}

function chooseTarotCard(input, cards, seed) {
  const available = (Array.isArray(cards) ? cards : []).filter(card => card && cardName(card));
  if (!available.length) return Object.freeze({ id:17, canonicalId:'a-estrela', name:'A Estrela' });
  return findMentionedCard(input, available)
    || available[loveHash(`${seed}:${normalize(input)}:tarot-card`) % available.length];
}

export function storyResponse(input, {
  seed = secureLoveSeed(), preferredName = '', cards = [], ...matterOptions
} = {}) {
  const raw = clean(input, 700);
  const base = matterResponse(raw, { ...matterOptions, cards, preferredName, seed:`${seed}:materia` });
  const safeSeed = `${seed}:${normalize(raw)}:${base.intent || 'support'}`;

  if (base.safety) return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:'Segurança antes de qualquer leitura',
    storySignature:signature(safeSeed, 'safety'),
    storyCohesion:true,
    tarotGrounded:true
  });

  if (base.matterQuery) {
    const text = `A pergunta “${base.matterQuery}” pede fatos atuais. O Tarot não será usado para inventar informações sobre uma pessoa real. Abaixo ficam somente caminhos de pesquisa que você pode escolher abrir.`;
    return Object.freeze({
      ...base,
      engine:`${base.engine}+${STORY_ENGINE_NAME}`,
      version:STORY_ENGINE_VERSION,
      storyEngine:STORY_ENGINE_NAME,
      storyTitle:'Fatos pedem fontes; Tarot oferece orientação simbólica',
      storySignature:signature(safeSeed, 'research'),
      storyCohesion:true,
      tarotGrounded:true,
      execution:null,
      actions:Object.freeze(base.actions.filter(action => action.kind === 'research')),
      spiritVoices:Object.freeze([]), spiritSynthesis:'', spiritBlessing:'', text
    });
  }

  const card = chooseTarotCard(raw, cards, safeSeed);
  const creation = storyForCard(card, safeSeed, {
    scope:'whit', moment:'conversa', intention:raw
  });
  const text = [creation.heartline, creation.whisper, ...creation.paragraphs, creation.closing].join('\n\n');
  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:creation.title,
    storySignature:creation.signature,
    storyCohesion:true,
    tarotGrounded:true,
    storyCard:Object.freeze({ id:card?.id ?? '', canonicalId:card?.canonicalId ?? '', name:cardName(card) }),
    tarotBasis:creation.tarotBasis,
    spiritVoices:Object.freeze([]), spiritSynthesis:'', spiritBlessing:'', text
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    majorArcana:22,
    minorArcana:56,
    fixedMeanings:true,
    randomMeaning:false,
    rule:'a carta e a posição definem a leitura; nenhuma palavra aleatória substitui o Tarot'
  });
}
