/*
 * DIVINA BRUXA 4.0.6 · MOTOR WHIT TARÓLOGA
 *
 * Whit conduz a consulta como uma narrativa de Tarot: acolhe a pergunta,
 * lê o presente, reconhece o padrão, apresenta uma previsão ficcional e
 * devolve fé, amor, mente, livre-arbítrio e matéria como forças praticáveis.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import {
  storyConversation as realitiesConversation,
  storyForCard as realitiesForCard,
  storyResponse as realitiesResponse,
  tarotIdentity
} from './tarot-orbe-realities-engine-v405.js';

export { tarotIdentity } from './tarot-orbe-realities-engine-v405.js';

export const STORY_ENGINE_NAME = 'MOTOR WHIT TARÓLOGA';
export const STORY_ENGINE_VERSION = '4.0.6';
export const STORY_ENGINE_LABEL = 'CONSULTA DE TAROT · ALMA, HISTÓRIA E ESCOLHA';

export const READER_COVENANT = Object.freeze([
  'Whit interpreta somente as cartas reveladas, suas posições e a pergunta entregue pela pessoa',
  'a consulta é uma história coesa sobre a vida, nunca uma sequência de palavras soltas',
  'a previsão é ficcional e simbólica: mostra tendências sem declarar destino inevitável',
  'fé acolhe; amor respeita; mente esclarece; livre-arbítrio escolhe; matéria realiza',
  'nenhuma leitura inventa pensamentos de terceiros, fatos privados ou autoridade divina',
  'todo ensinamento termina num conselho possível de viver no mundo real'
]);

const clean = (value, limit = 6000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 900)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const lower = value => clean(value).replace(/[.!?…]+$/u, '');
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};
const cardName = card => clean(card?.name, 100) || 'Carta do Tarot';
const cardKey = card => `${card?.canonicalId ?? card?.id ?? 'carta'}:${cardName(card)}`;
const signature = (seed, key) => loveHash(`${seed}¦${key}`).toString(36).toUpperCase().padStart(8, '0');

const SUIT_TEACHINGS = Object.freeze({
  paus:'Paus ensina que desejo sem direção se dispersa, enquanto coragem com propósito inaugura caminhos.',
  copas:'Copas ensina que sentir profundamente não exige abandonar limites, verdade ou reciprocidade.',
  espadas:'Espadas ensina que pensamento e palavra criam consequências; clareza liberta quando não é usada para ferir.',
  ouros:'Ouros ensina que toda mudança precisa encontrar corpo, tempo, recurso e continuidade para permanecer.'
});

const RANK_TEACHINGS = Object.freeze({
  as:'O Ás é a semente: existe potência, mas ela ainda precisa de escolha e cuidado para ganhar forma.',
  dois:'O Dois coloca duas forças frente a frente e pergunta se elas podem dialogar sem que uma apague a outra.',
  tres:'O Três mostra o que nasce do encontro: criação, consequência e expansão já começam a aparecer.',
  quatro:'O Quatro procura estrutura e proteção, mas alerta quando segurança começa a impedir o movimento.',
  cinco:'O Cinco revela uma ruptura no equilíbrio e ensina que conflito também mostra o que precisa mudar.',
  seis:'O Seis procura reorganizar a experiência e transformar o que foi vivido em passagem, troca ou reparação.',
  sete:'O Sete testa convicção e discernimento: nem toda opção merece energia, e nem toda resistência merece vitória.',
  oito:'O Oito acelera o aprendizado e mostra que repetição consciente pode libertar, enquanto automatismo aprisiona.',
  nove:'O Nove aproxima a experiência de sua maturidade e pergunta o que foi conquistado, protegido ou carregado demais.',
  dez:'O Dez encerra um ciclo e revela a herança deixada por tudo o que foi acumulado ao longo do caminho.',
  valete:'O Valete aprende pelo encontro com o novo; sua mensagem pede curiosidade acompanhada de responsabilidade.',
  cavaleiro:'O Cavaleiro coloca a energia em marcha e pergunta se velocidade e direção realmente servem ao mesmo destino.',
  rainha:'A Rainha governa por presença interior: recebe, compreende e transforma sem precisar abandonar a própria autoridade.',
  rei:'O Rei transforma experiência em responsabilidade e mede poder pelo modo como ele sustenta a vida ao redor.'
});

const ELEMENT_FICTION = Object.freeze({
  fire:'uma decisão rompe a espera e obriga a vida a responder ao movimento iniciado',
  water:'uma verdade emocional deixa o silêncio e altera a forma como você continuará sentindo, escolhendo ou se relacionando',
  air:'uma conversa, uma compreensão ou uma escolha muda a narrativa que estava governando o caminho',
  earth:'um gesto concreto reorganiza rotina, trabalho, corpo ou recursos e torna visível aquilo que antes era apenas intenção',
  spirit:'um ciclo interno chega ao limiar da mudança e transforma a maneira como os próximos acontecimentos serão recebidos'
});

function explicitQuestion(value) {
  const raw = clean(value, 180).replace(/\s+/g, ' ').replace(/[.!?…]+$/u, '');
  return normalize(raw).split(' ').filter(Boolean).length >= 4 ? raw : '';
}

function lessonFor(identity) {
  if (identity.source === 'major') {
    return `Este Arcano Maior amplia a escala da consulta: não fala somente de um episódio, mas do aprendizado que o episódio está exigindo. ${sentence(identity.truth)}`;
  }
  const rank = RANK_TEACHINGS[identity.rank] || 'O número ou figura mostra a etapa que esta experiência alcançou.';
  const suit = SUIT_TEACHINGS[identity.suit] || 'O naipe mostra onde esta experiência pede presença.';
  return `${rank} ${suit} Nesta carta específica, o ensinamento ganha esta forma: ${sentence(identity.truth)}`;
}

function fiveForces(identity, base) {
  const counsel = sentence(base.realityProfile?.counsel || identity.gesture);
  const tendency = sentence(base.realityProfile?.tendency || identity.consequence);
  return Object.freeze({
    faith:`Fé — Confie no processo sem fingir certeza. A fé desta carta nasce quando você aceita esta verdade: ${lower(identity.truth)}.`,
    love:`Amor — Acolha a parte de você tocada por esta tensão: ${lower(identity.pressure)}. Compaixão não apaga limites; oferece dignidade para atravessá-los.`,
    mind:`Mente — Pergunte quais fatos sustentam ou contradizem esta tendência: ${lower(identity.consequence)}. Uma emoção intensa não transforma hipótese em prova.`,
    freedom:`Livre-arbítrio — ${counsel} Esta é a parte da história que ainda pode receber sua autoria.`,
    matter:`Matéria — Escolha uma ação pequena, observável e possível para hoje. A direção a fortalecer é esta: ${tendency}`
  });
}

function forcesText(forces) {
  return [forces.faith, forces.love, forces.mind, forces.freedom, forces.matter].join('\n');
}

function cardFromResponse(response, cards) {
  const available = (Array.isArray(cards) ? cards : []).filter(Boolean);
  return available.find(card => {
    if (response.storyCard?.id !== '' && String(card?.id) === String(response.storyCard?.id)) return true;
    if (response.storyCard?.canonicalId && card?.canonicalId === response.storyCard.canonicalId) return true;
    return cardName(card) === response.storyCard?.name;
  }) || Object.freeze({
    id:response.storyCard?.id ?? '', canonicalId:response.storyCard?.canonicalId ?? '',
    name:response.storyCard?.name || 'A Estrela'
  });
}

function forceCard(cards, identities, element, fallbackIndex) {
  const index = identities.findIndex(identity => identity.element === element);
  const chosen = index >= 0 ? index : fallbackIndex;
  return Object.freeze({ card:cards[chosen], identity:identities[chosen], index:chosen });
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta', moment = 'agora', intention = ''
} = {}) {
  const stableSeed = `${cardKey(card)}:${scope}:${moment}:${normalize(intention)}`;
  const base = realitiesForCard(card, stableSeed, { scope, moment, intention });
  const identity = tarotIdentity(card);
  const question = explicitQuestion(intention);
  const forces = fiveForces(identity, base);
  const fiction = ELEMENT_FICTION[identity.element] || ELEMENT_FICTION.spirit;
  const opening = question
    ? `Whit recebe sua pergunta — “${question}” — e coloca “${cardName(card)}” diante dela. A resposta não invade sua intimidade: acompanha o padrão que a carta consegue iluminar.`
    : `Whit coloca “${cardName(card)}” diante do seu momento. A consulta começa onde símbolo e vida se reconhecem: ${lower(base.realityProfile.present)}.`;

  const paragraphs = Object.freeze([
    `Diante da sua vida — ${opening}`,
    `O capítulo que você está vivendo — ${sentence(identity.pressure)} A carta sugere que isso pode não ter nascido hoje: é uma história que ganhou força cada vez que a mesma necessidade encontrou a mesma resposta.`,
    `A verdade que Whit devolve — ${sentence(identity.truth)} Esta verdade não define você; ela nomeia o ponto em que sua liberdade pode voltar a participar da história.`,
    `Previsão ficcional da carta — Na realidade simbólica narrada pelo Tarot, ${fiction}. Se o padrão continuar sem revisão, ${lower(base.realityProfile.unchanged)}. Se o conselho virar atitude, a tendência muda de direção: ${lower(identity.consequence)}.`,
    `Aula mágica da Whit — ${lessonFor(identity)}`,
    `As cinco forças da consulta —\n${forcesText(forces)}`,
    `Conselho da Whit Taróloga — ${sentence(base.realityProfile.counsel)} Não tente resolver a vida inteira hoje. Faça o gesto que prova, na matéria, que você escutou a carta.`,
    `Palavra que permanece — ${base.lifeProfile.blessing}\n\n“${base.lifeProfile.affirmation}”`
  ]);

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:scope.includes('carta-do-dia')
      ? 'WHIT TARÓLOGA · CONSULTA DO SEU DIA'
      : 'WHIT TARÓLOGA · CONSULTA DA SUA VIDA',
    title:`Whit Taróloga · ${cardName(card)}`,
    heartline:`Whit abre a leitura — ${sentence(identity.truth)}`,
    whisper:`A história aponta — ${sentence(identity.consequence)}`,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:'Fechamento da consulta — Leve somente o que encontrou verdade em você. Pratique o conselho antes de abrir outra leitura; o Tarot ganha alma quando a palavra atravessa a escolha e chega à vida.',
    signature:signature(stableSeed, 'whit-tarot-reader-card'),
    readerProfile:Object.freeze({ card:identity.key, fictionalPrediction:true, forces, lesson:lessonFor(identity) }),
    cohesion:Object.freeze({ ...base.cohesion, tarotReader:true, fictionalPrediction:true, fiveForces:true, teaching:true, livedCounsel:true })
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const base = realitiesConversation(validCards, positions, seed, intention);
  if (validCards.length === 1) {
    const single = storyForCard(validCards[0], seed, {
      scope:'tiragem', moment:clean(positions[0], 100) || 'Conselho', intention
    });
    return Object.freeze({ ...single, lead:base.lead, voices:base.voices });
  }

  const identities = validCards.map(tarotIdentity);
  const lastIndex = validCards.length - 1;
  const pivotIndex = Math.floor(lastIndex / 2);
  const first = identities[0];
  const pivot = identities[pivotIndex];
  const last = identities[lastIndex];
  const question = explicitQuestion(intention);
  const stableSeed = `${validCards.map(cardKey).join('→')}:${positions.join('→')}:${normalize(intention)}`;

  const faith = forceCard(validCards, identities, 'spirit', pivotIndex);
  const love = forceCard(validCards, identities, 'water', pivotIndex);
  const mind = forceCard(validCards, identities, 'air', pivotIndex);
  const freedom = forceCard(validCards, identities, 'fire', 0);
  const matter = forceCard(validCards, identities, 'earth', lastIndex);
  const finalBase = realitiesForCard(validCards[lastIndex], stableSeed, {
    scope:'tiragem', moment:positions[lastIndex] || `Posição ${lastIndex + 1}`, intention
  });
  const freedomBase = realitiesForCard(freedom.card, stableSeed, {
    scope:'tiragem', moment:positions[freedom.index] || `Posição ${freedom.index + 1}`, intention
  });

  const forces = Object.freeze({
    faith:`Fé · ${cardName(faith.card)} — ${sentence(faith.identity.truth)} Fé aqui é permanecer presente sem transformar esperança em certeza inventada.`,
    love:`Amor · ${cardName(love.card)} — ${sentence(love.identity.truth)} O amor desta mesa pede cuidado com reciprocidade, dignidade e limite.`,
    mind:`Mente · ${cardName(mind.card)} — ${sentence(mind.identity.truth)} A mente precisa separar fato, medo, desejo e interpretação antes da próxima escolha.`,
    freedom:`Livre-arbítrio · ${cardName(freedom.card)} — ${sentence(freedomBase.realityProfile.counsel)} A tiragem mostra tendência; esta força decide como você responderá a ela.`,
    matter:`Matéria · ${cardName(matter.card)} — ${sentence(matter.identity.consequence)} Torne a leitura real por uma atitude pequena e verificável.`
  });

  const consultation = question
    ? `Whit recebe a pergunta “${question}” e não procura uma frase capaz de agradar. Ela acompanha a história que começa em “${cardName(validCards[0])}”, muda de consciência em “${cardName(validCards[pivotIndex])}” e procura direção em “${cardName(validCards[lastIndex])}”.`
    : `Whit abre a mesa como um espelho do momento. “${cardName(validCards[0])}” mostra a raiz, “${cardName(validCards[pivotIndex])}” revela a consciência necessária e “${cardName(validCards[lastIndex])}” mostra a direção que está ganhando força.`;

  const story = [
    `Whit diante da sua vida — ${consultation}`,
    base.story,
    `O acontecimento que une a mesa — A história começa onde ${lower(first.pressure)}. Ela atravessa esta verdade: ${lower(pivot.truth)}. Na ficção simbólica do Tarot, o próximo capítulo tende a nascer assim: ${lower(ELEMENT_FICTION[last.element] || ELEMENT_FICTION.spirit)}.`,
    `As cinco forças da tiragem —\n${forcesText(forces)}`,
    `Aula mágica da Whit — A primeira carta explica a origem do movimento. A carta central mostra por que a resposta antiga já não basta. A carta final não encerra seu destino; ensina qual consequência ganha força quando você continua escolhendo da mesma maneira. ${lessonFor(last)}`,
    `Conselho da Whit Taróloga — ${sentence(finalBase.realityProfile.counsel)} Depois, observe o que muda na realidade antes de pedir às cartas outra resposta.`,
    `Palavra que permanece — ${finalBase.lifeProfile.blessing}\n\n“${finalBase.lifeProfile.affirmation}”`
  ].join('\n\n');

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'WHIT TARÓLOGA · A VIDA DIANTE DAS CARTAS',
    title:`Whit Taróloga · ${cardName(validCards[0])} → ${cardName(validCards[lastIndex])}`,
    heartline:question
      ? `Whit recebe sua pergunta — “${question}”.`
      : `Whit recebe seu momento — ${sentence(pivot.truth)}`,
    lead:`A mesa se abre — ${sentence(first.consequence)} A direção em formação é: ${sentence(last.consequence)}`,
    story,
    closing:'Fechamento da mesa — Esta tiragem não pede dependência; pede presença. Escolha um conselho, viva-o e permita que a realidade responda antes de voltar às cartas.',
    signature:signature(stableSeed, 'whit-tarot-reader-spread'),
    readerProfile:Object.freeze({ beginning:first.key, revelation:pivot.key, direction:last.key, fictionalPrediction:true, forces }),
    cohesion:Object.freeze({ ...base.cohesion, tarotReader:true, oneConsultation:true, fictionalPrediction:true, fiveForces:true, teaching:true })
  });
}

export function storyResponse(input, options = {}) {
  const raw = clean(input, 700);
  const base = realitiesResponse(raw, options);
  if (base.safety || base.matterQuery || !base.storyCard) return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME
  });

  const card = cardFromResponse(base, options.cards);
  const creation = storyForCard(card, options.seed || secureLoveSeed(), {
    scope:'whit', moment:'consulta', intention:raw
  });
  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:creation.title,
    storySignature:creation.signature,
    storyCohesion:true,
    tarotGrounded:true,
    tarotBasis:creation.tarotBasis,
    readerProfile:creation.readerProfile,
    text:[creation.heartline, creation.whisper, ...creation.paragraphs, creation.closing].join('\n\n')
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    fixedMeanings:true,
    fictionalPrediction:true,
    fiveForces:Object.freeze(['fé', 'amor', 'mente', 'livre-arbítrio', 'matéria']),
    spreadConsultation:true,
    deepTeaching:true,
    silentPrivateReading:false,
    inevitableDestiny:false,
    rule:'Whit lê cartas, posições e pergunta; a vida confirma padrões e a pessoa conserva a escolha'
  });
}
