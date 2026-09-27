/*
 * DIVINA BRUXA 4.0.5 · MOTOR DA ORBE DAS REALIDADES
 *
 * Carta, posição, pergunta e ordem formam uma leitura única sobre presente,
 * padrão, tendência e escolha. O Tarot indica caminhos possíveis sem fingir
 * conhecer fatos privados nem transformar uma tendência em sentença.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import {
  storyConversation as lifeConversation,
  storyForCard as lifeForCard,
  storyResponse as lifeResponse,
  tarotIdentity
} from './tarot-life-engine-v404.js';

export { tarotIdentity } from './tarot-life-engine-v404.js';

export const STORY_ENGINE_NAME = 'MOTOR DA ORBE DAS REALIDADES';
export const STORY_ENGINE_VERSION = '4.0.5';
export const STORY_ENGINE_LABEL = 'LEITURA DE TAROT · VIDA, DESTINO E CONSELHO';

export const STORY_COVENANT = Object.freeze([
  'toda leitura nasce da carta real, da posição e da pergunta apresentada',
  'presente, padrão oculto, tendência e conselho formam uma única história',
  'a tendência mostra o que ganha força se o padrão continuar; nunca decreta um futuro inevitável',
  'a leitura fala da vida de quem consulta sem inventar fatos privados ou pensamentos de terceiros',
  'cada conselho termina numa atitude concreta que pode ser praticada no dia',
  'nas tiragens as cartas respondem umas às outras antes da síntese final'
]);

const clean = (value, limit = 5000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 900)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const lower = value => clean(value).replace(/[.!?…]+$/u, '');
const lowerFirst = value => {
  const text = lower(value);
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

const REALITY_LENSES = Object.freeze({
  love:Object.freeze({
    title:'amor e vínculos',
    keywords:/\b(?:amor|amar|apaixonad[oa]|relacao|relacionamento|namoro|casamento|saudade|ex|romance|reciprocidade|parceir[oa])\b/,
    present:Object.freeze([
      'Seu coração está tentando distinguir presença verdadeira de expectativa alimentada em silêncio.',
      'Uma relação, uma ausência ou um desejo afetivo está pedindo que sentimento e realidade sejam colocados lado a lado.',
      'A vida afetiva chegou a um ponto em que intensidade já não basta; reciprocidade, limite e atitude precisam responder.'
    ]),
    unchanged:'a expectativa pode continuar ocupando o lugar que deveria pertencer à reciprocidade',
    action:'Compare o que é sentido, o que é dito e o que é feito; confie no padrão que se repete.',
    sign:'quem se faz presente, como você se sente depois de cada encontro e quais promessas realmente viram atitude'
  }),
  work:Object.freeze({
    title:'trabalho, criação e recursos',
    keywords:/\b(?:trabalho|emprego|carreira|dinheiro|projeto|negocio|cliente|profissao|estudo|criar|criatividade|vender|prosperidade)\b/,
    present:Object.freeze([
      'Existe esforço sendo colocado no mundo, mas a leitura pede que você diferencie movimento de avanço verdadeiro.',
      'Seu caminho material está exigindo menos dispersão e uma escolha mais nítida sobre aquilo que merece continuidade.',
      'Uma ideia, tarefa ou responsabilidade pede forma concreta para deixar de viver apenas como intenção.'
    ]),
    unchanged:'o cansaço pode crescer sem produzir a mudança ou o resultado que você espera',
    action:'Transforme a orientação da carta numa tarefa pequena, verificável e possível de concluir hoje.',
    sign:'o que produz resultado, o que apenas consome energia e qual tarefa abre caminho para a próxima'
  }),
  family:Object.freeze({
    title:'família e pertencimento',
    keywords:/\b(?:familia|mae|pai|irma|irmao|filha|filho|casa|parente|lar)\b/,
    present:Object.freeze([
      'Amor, dever e memória estão misturados, e sua alma procura um modo de cuidar sem desaparecer.',
      'Um padrão antigo de convivência pede um limite novo para que afeto e dignidade possam continuar juntos.',
      'A questão não é somente o que você sente pela família, mas o papel que continua assumindo dentro dela.'
    ]),
    unchanged:'culpa, silêncio ou obrigação podem continuar repetindo uma história que ninguém escolhe conscientemente',
    action:'Nomeie um comportamento concreto e escolha um limite que preserve respeito sem fazer você se abandonar.',
    sign:'o papel que sempre sobra para você, o assunto que ninguém consegue nomear e o efeito disso no seu corpo'
  }),
  change:Object.freeze({
    title:'mudança e recomeço',
    keywords:/\b(?:mudar|mudanca|recomeco|novo|partir|viagem|cidade|fase|futuro|terminar|fim|destino)\b/,
    present:Object.freeze([
      'Uma parte da sua vida já terminou por dentro, embora a nova forma ainda não esteja pronta.',
      'Você está entre uma realidade conhecida que perdeu força e outra que ainda precisa de coragem para nascer.',
      'A mudança não depende de enxergar a estrada inteira; depende de reconhecer qual passo já se tornou verdadeiro.'
    ]),
    unchanged:'o medo pode conservar uma forma antiga depois de ela ter deixado de sustentar sua vida',
    action:'Preserve o que sustenta você, encerre o que cumpriu sua função e defina o primeiro passo do novo ciclo.',
    sign:'o que perdeu sentido, o que insiste em nascer e qual decisão pequena devolve movimento ao caminho'
  }),
  self:Object.freeze({
    title:'vida interior e valor próprio',
    keywords:/\b(?:eu|alma|autoestima|valor|vergonha|culpa|cansad[oa]|exaust[oa]|ansiedade|medo|triste|sozinh[oa]|identidade|coracao)\b/,
    present:Object.freeze([
      'Você pode estar carregando uma emoção como se ela definisse toda a sua identidade, e a carta vem separar dor de destino.',
      'Seu mundo interior pede escuta, mas também pede que a sensibilidade deixe de ser usada contra você.',
      'Existe uma verdade pessoal tentando respirar por baixo do cansaço, da cobrança ou do medo de decepcionar.'
    ]),
    unchanged:'a dor do momento pode continuar falando como se fosse a verdade inteira sobre quem você é',
    action:'Reduza o dia ao essencial e faça uma escolha que devolva respeito, descanso ou voz ao seu próximo passo.',
    sign:'o que contrai seu corpo, o que devolve dignidade e qual pensamento se repete sem apresentar prova'
  }),
  decision:Object.freeze({
    title:'decisão e direção',
    keywords:/\b(?:decidir|decisao|escolher|escolha|duvida|caminho|opcao|confus[oa]|direcao)\b/,
    present:Object.freeze([
      'Você não precisa de mais possibilidades; precisa reconhecer qual critério merece conduzir a escolha.',
      'A dúvida está misturando fato, medo e desejo, e a carta chega para devolver um lugar diferente a cada um.',
      'Uma decisão pede movimento, mas o movimento certo nasce da verdade que continuará digna depois da urgência.'
    ]),
    unchanged:'a indecisão pode escolher por você e manter exatamente o cenário que já provoca desconforto',
    action:'Separe fato, medo, desejo e hipótese; escolha o menor passo reversível capaz de testar a realidade.',
    sign:'qual opção respeita seus limites, quais fatos já existem e o que você escolheria sem a pressão de agradar'
  }),
  general:Object.freeze({
    title:'momento atual',
    keywords:/(?!)/,
    present:Object.freeze([
      'Um padrão repetido chegou ao ponto em que já pode ser reconhecido, nomeado e transformado.',
      'A vida está mostrando a diferença entre aquilo que ocupa você e aquilo que realmente conduz você.',
      'O momento pede menos adivinhação e mais presença diante da verdade que já começou a aparecer.'
    ]),
    unchanged:'o mesmo padrão pode continuar produzindo a mesma consequência com uma aparência diferente',
    action:'Escolha uma atitude simples que confirme a parte mais lúcida da leitura antes que o dia termine.',
    sign:'o padrão que se repete, o efeito que ele produz e a escolha que ainda permanece em suas mãos'
  })
});

const ELEMENT_CLIMATE = Object.freeze({
  fire:'O fogo domina a leitura: desejo, iniciativa e coragem querem movimento, mas precisam de direção para não virarem pressa.',
  water:'A água domina a leitura: sentimentos e vínculos são o coração da história, e limites serão tão importantes quanto entrega.',
  air:'O ar domina a leitura: pensamentos, palavras e decisões estão criando a realidade; clareza precisa ocupar o lugar do ruído.',
  earth:'A terra domina a leitura: corpo, tempo, trabalho e recursos pedem atitude concreta, continuidade e cuidado com o que precisa durar.',
  spirit:'Os Arcanos Maiores conduzem a leitura: esta não parece uma questão isolada, mas uma passagem capaz de reorganizar sua forma de viver.'
});

const ELEMENT_DIALOGUE = Object.freeze({
  'fire>water':'a ação encontra a emoção e precisa aprender a cuidar do que despertou',
  'water>fire':'o sentimento deixa de esperar e exige uma atitude capaz de mudar a história',
  'fire>air':'o impulso recebe pensamento, palavra e direção',
  'air>fire':'a compreensão precisa deixar a mente e produzir consequência',
  'fire>earth':'a inspiração é testada pela realidade e precisa construir algo sustentável',
  'earth>fire':'o que estava apenas sendo mantido recebe desejo e movimento',
  'water>air':'o coração encontra palavras para aquilo que já sabia em silêncio',
  'air>water':'a decisão encontra humanidade e passa a considerar o que realmente é sentido',
  'water>earth':'o sentimento procura uma forma concreta de ser cuidado e sustentado',
  'earth>water':'a segurança é perguntada se também possui afeto e vida',
  'air>earth':'a ideia é testada pelos fatos e pelo efeito que produz',
  'earth>air':'a estrutura recebe uma nova interpretação e deixa de parecer a única possível'
});

function explicitIntention(value) {
  const raw = clean(value, 180).replace(/\s+/g, ' ').replace(/[.!?…]+$/u, '');
  return normalize(raw).split(' ').filter(Boolean).length >= 4 ? raw : '';
}

function lensFor(intention, fallback = 'general') {
  const value = normalize(intention);
  const explicit = Object.entries(REALITY_LENSES).find(([, lens]) => lens.keywords.test(value));
  const key = explicit?.[0] || (REALITY_LENSES[fallback] ? fallback : 'general');
  return Object.freeze({ key, value:REALITY_LENSES[key] });
}

function positionFrom(moment, scope) {
  if (!String(scope).includes('tiragem')) return '';
  return clean(moment, 100).replace(/^\d+\s*-\s*/u, '') || 'posição revelada';
}

function counselFrom(life, identity) {
  const destiny = clean(life?.paragraphs?.[2]);
  const match = destiny.match(/O movimento que fortalece esse caminho é:\s*(.+)$/isu);
  return sentence(match?.[1] || identity.gesture);
}

function stableSeed(card, scope, moment, intention) {
  return `${cardKey(card)}:${scope}:${moment}:${normalize(intention)}`;
}

function dominantElement(identities) {
  const majorCount = identities.filter(identity => identity.source === 'major').length;
  if (majorCount >= Math.ceil(identities.length / 2)) return 'spirit';
  const counts = new Map();
  identities.forEach(identity => counts.set(identity.element, (counts.get(identity.element) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'spirit';
}

function representativeIndices(length) {
  if (length <= 5) return Array.from({ length }, (_, index) => index);
  return [...new Set([0, Math.round((length - 1) * .25), Math.round((length - 1) * .5), Math.round((length - 1) * .75), length - 1])];
}

function dialogue(previous, current) {
  if (previous.element === current.element) {
    const element = ({ fire:'fogo', water:'água', air:'ar', earth:'terra', spirit:'mistério' })[current.element] || 'mistério';
    return `o ${element} se repete e aprofunda o mesmo assunto até que ele não possa mais ser tratado como detalhe`;
  }
  return ELEMENT_DIALOGUE[`${previous.element}>${current.element}`]
    || 'uma realidade responde à outra e transforma o significado do passo anterior';
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta', moment = 'agora', intention = ''
} = {}) {
  const fixedSeed = stableSeed(card, scope, moment, intention);
  const life = lifeForCard(card, fixedSeed, { scope, moment, intention });
  const identity = tarotIdentity(card);
  const lens = lensFor(intention, identity.defaultLens);
  const namedIntention = explicitIntention(intention);
  const position = positionFrom(moment, scope);
  const counsel = counselFrom(life, identity);
  const present = choose(lens.value.present, fixedSeed, 'present-reality');
  const context = namedIntention
    ? `Você trouxe esta questão às cartas: “${namedIntention}”. “${cardName(card)}” responde mostrando o padrão que governa essa situação, sem inventar fatos que não foram apresentados.`
    : `A leitura se concentra em ${lens.value.title}. ${present}`;
  const place = position ? ` Na posição “${position}”, esta verdade ocupa uma função precisa dentro da tiragem.` : '';

  const paragraphs = Object.freeze([
    `Leitura da sua realidade — ${context}${place} A imagem central da carta mostra que ${lower(identity.scene)}.`,
    `O que está acontecendo — ${sentence(identity.pressure)} Isso não aparece como castigo: é o ponto da história que já não pode continuar sem consciência.`,
    `A verdade que estava por baixo — ${sentence(identity.truth)} Por isso, a carta não fala de um acontecimento isolado; fala da maneira como você está atravessando este capítulo da vida.`,
    `Destino em formação — Se nada for revisto, ${lens.value.unchanged}. Mas o futuro permanece aberto. Quando você transforma a orientação da carta em atitude, outra realidade ganha força: ${lower(identity.consequence)}.`,
    `Conselho supremo para hoje — ${counsel} ${lens.value.action}\n\nConfirmação na vida real — Observe ${lens.value.sign}. A leitura se confirma pelo padrão e pelas escolhas, não por medo ou coincidências forçadas.`,
    `Mensagem final da Orbe — ${life.lifeProfile.blessing}\n\nPalavra para o seu caminho — “${life.lifeProfile.affirmation}”`
  ]);

  return Object.freeze({
    ...life,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:scope.includes('carta-do-dia')
      ? 'ORBE DAS REALIDADES · LEITURA DO SEU DIA'
      : 'ORBE DAS REALIDADES · LEITURA DO SEU CAMINHO',
    title:`${cardName(card)} · leitura da sua realidade`,
    heartline:`O que a carta vê — ${sentence(identity.truth)}`,
    whisper:`Para onde o caminho aponta — ${sentence(identity.consequence)}`,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:'Ritual de realidade — Antes do fim do dia, transforme o conselho em uma atitude observável. Depois pergunte a si: o que mudou dentro de mim quando deixei de esperar um sinal e comecei a responder à carta?',
    signature:signature(fixedSeed, 'orbe-realities-card'),
    realityProfile:Object.freeze({ lens:lens.key, present, unchanged:lens.value.unchanged, counsel, tendency:identity.consequence }),
    cohesion:Object.freeze({ ...life.cohesion, present:true, hiddenPattern:true, conditionalFuture:true, realityCheck:true, supremeCounsel:true })
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const base = lifeConversation(validCards, positions, seed, intention);
  if (validCards.length === 1) {
    const single = storyForCard(validCards[0], seed, {
      scope:'tiragem', moment:clean(positions[0], 100) || 'Posição 1', intention
    });
    return Object.freeze({
      ...single,
      label:'ORBE DAS REALIDADES · UMA CARTA, UMA LEITURA INTEIRA',
      lead:`Na posição “${clean(positions[0], 100) || 'Conselho'}”, a carta descreve presente, padrão, tendência e escolha.`,
      voices:base.voices
    });
  }

  const identities = validCards.map(tarotIdentity);
  const lastIndex = validCards.length - 1;
  const pivotIndex = Math.floor(lastIndex / 2);
  const first = identities[0];
  const pivot = identities[pivotIndex];
  const last = identities[lastIndex];
  const lens = lensFor(intention, pivot.defaultLens);
  const namedIntention = explicitIntention(intention);
  const fixedSeed = `${validCards.map(cardKey).join('→')}:${positions.join('→')}:${normalize(intention)}`;
  const selected = representativeIndices(validCards.length);
  const element = dominantElement(identities);
  const climate = ELEMENT_CLIMATE[element] || ELEMENT_CLIMATE.spirit;
  const present = choose(lens.value.present, fixedSeed, 'spread-present');
  const firstLife = lifeForCard(validCards[0], fixedSeed, { scope:'tiragem', moment:positions[0], intention });
  const lastLife = lifeForCard(validCards[lastIndex], fixedSeed, { scope:'tiragem', moment:positions[lastIndex], intention });
  const firstCounsel = counselFrom(firstLife, first);
  const lastCounsel = counselFrom(lastLife, last);

  const movements = selected.slice(1).map(index => {
    const previousIndex = Math.max(0, index - 1);
    return `Em “${clean(positions[index], 100) || `Posição ${index + 1}`}”, “${cardName(validCards[index])}” responde a “${cardName(validCards[previousIndex])}”: ${dialogue(identities[previousIndex], identities[index])}. A nova verdade é esta: ${lower(identities[index].truth)}.`;
  }).join(' ');

  const story = [
    `A história revelada — “${cardName(validCards[0])}” abre a leitura mostrando que ${lower(first.pressure)}. No centro, “${cardName(validCards[pivotIndex])}” revela que ${lower(pivot.truth)}. Ao final, “${cardName(validCards[lastIndex])}” aponta esta direção: ${sentence(last.consequence)} Não são mensagens separadas: a primeira carta apresenta a raiz, a carta central revela a consciência necessária e a última mostra a direção que está sendo construída.`,
    `Como as cartas conversam — ${movements}`,
    `O que sua vida está mostrando — ${namedIntention ? `A questão “${namedIntention}” chegou a um ponto em que precisa ser vivida com verdade, não apenas pensada.` : present} ${climate}`,
    `O padrão escondido — A tensão de “${cardName(validCards[0])}” encontra a de “${cardName(validCards[pivotIndex])}”: ${lower(first.pressure)}; ao mesmo tempo, ${lower(pivot.pressure)}. Juntas, elas mostram por que repetir a mesma resposta não conseguirá criar um resultado diferente.`,
    `Destino se nada mudar — ${sentence(lens.value.unchanged)} A carta final adverte que ${lower(last.pressure)}. Esta é uma tendência do caminho atual, não uma condenação.`,
    `Destino que pode ser construído — Quando a verdade de “${cardName(validCards[pivotIndex])}” é aceita e o conselho de “${cardName(validCards[lastIndex])}” vira atitude, a leitura aponta para esta possibilidade: ${sentence(last.consequence)} Suas escolhas ainda podem fortalecer, corrigir ou transformar essa direção.`,
    `Conselho supremo — Primeiro: ${firstCounsel} Depois: ${lastCounsel} Para trazer a tiragem ao dia de hoje, ${lowerFirst(lens.value.action)}.`,
    `Mensagem final da Orbe — ${lastLife.lifeProfile.blessing}\n\nPalavra para o seu caminho — “${lastLife.lifeProfile.affirmation}”`
  ].join('\n\n');

  const voices = Object.freeze(validCards.map((card, index) => {
    const identity = identities[index];
    return `${clean(positions[index], 100) || `Posição ${index + 1}`} — ${cardName(card)}. Situação: ${sentence(identity.pressure)} Verdade: ${sentence(identity.truth)} Direção: ${sentence(identity.consequence)}`;
  }));

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'ORBE DAS REALIDADES · LEITURA COMPLETA DO DESTINO',
    title:`${cardName(validCards[0])} → ${cardName(validCards[lastIndex])} · a história do seu caminho`,
    heartline:namedIntention
      ? `A pergunta entregue ao Tarot — “${namedIntention}”.`
      : `A realidade central — ${sentence(pivot.truth)}`,
    lead:`Ponto de partida — Em “${clean(positions[0], 100) || 'Início'}”, “${cardName(validCards[0])}” mostra que ${lower(first.consequence)}.`,
    story,
    voices,
    closing:'Ritual de integração — Escolha apenas uma atitude do conselho final e pratique-a antes de pedir outra resposta às cartas. O destino desta leitura começa no ponto em que a consciência se transforma em gesto.',
    signature:signature(fixedSeed, 'orbe-realities-spread'),
    realityProfile:Object.freeze({
      lens:lens.key,
      beginning:first.key,
      revelation:pivot.key,
      direction:last.key,
      dominantElement:element,
      conditionalFuture:true
    }),
    cohesion:Object.freeze({ ...base.cohesion, oneStory:true, dialogue:true, hiddenPattern:true, conditionalFuture:true, supremeCounsel:true })
  });
}

function cardFromResponse(response, cards) {
  const available = (Array.isArray(cards) ? cards : []).filter(Boolean);
  return available.find(card => {
    if (response.storyCard?.id !== '' && String(card?.id) === String(response.storyCard?.id)) return true;
    if (response.storyCard?.canonicalId && card?.canonicalId === response.storyCard.canonicalId) return true;
    return cardName(card) === response.storyCard?.name;
  }) || Object.freeze({
    id:response.storyCard?.id ?? '',
    canonicalId:response.storyCard?.canonicalId ?? '',
    name:response.storyCard?.name || 'A Estrela'
  });
}

export function storyResponse(input, options = {}) {
  const raw = clean(input, 700);
  const base = lifeResponse(raw, options);
  if (base.safety || base.matterQuery || !base.storyCard) return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME
  });

  const card = cardFromResponse(base, options.cards);
  const creation = storyForCard(card, options.seed || secureLoveSeed(), {
    scope:'whit', moment:'conversa', intention:raw
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
    realityProfile:creation.realityProfile,
    text:[creation.heartline, creation.whisper, ...creation.paragraphs, creation.closing].join('\n\n')
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    fixedMeanings:true,
    contextualReadings:true,
    spreadDialogue:true,
    conditionalFuture:true,
    literalMindReading:false,
    inevitablePrediction:false,
    rule:'a carta revela o padrão; a continuidade mostra a tendência; a escolha participa do destino'
  });
}
