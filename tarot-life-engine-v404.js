/*
 * DIVINA BRUXA 4.0.4 · MOTOR DA VIDA
 *
 * A Alma do Tarot preserva o significado estável. O Motor da Vida acrescenta
 * beleza espiritual, bênção, afirmação e ritual sem transformar possibilidade
 * em destino inevitável nem apresentar uma voz divina como fato literal.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import {
  storyConversation as soulConversation,
  storyForCard as soulForCard,
  storyResponse as soulResponse,
  tarotIdentity
} from './tarot-soul-engine-v403.js';

export { tarotIdentity } from './tarot-soul-engine-v403.js';

export const STORY_ENGINE_NAME = 'MOTOR DA VIDA';
export const STORY_ENGINE_VERSION = '4.0.4';
export const STORY_ENGINE_LABEL = 'TAROT, VIDA E BÊNÇÃO';

export const STORY_COVENANT = Object.freeze([
  'a carta real continua sendo a raiz de cada palavra',
  'o significado permanece estável; somente a forma poética ganha movimento',
  'destino significa caminho possível construído por escolhas, nunca sentença inevitável',
  'a espiritualidade acolhe sem medo, coerção ou promessa sobrenatural',
  'toda beleza termina em conselho compreensível e gesto possível',
  'nas tiragens as cartas conversam antes de receberem uma bênção comum'
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
const choose = (values, seed, key) => values[loveHash(`${seed}¦${key}`) % values.length];
const signature = (seed, key) => loveHash(`${seed}¦${key}`).toString(36).toUpperCase().padStart(8, '0');

const ELEMENT_CALLS = Object.freeze({
  fire:Object.freeze([
    'A vida acende esta carta como uma chama diante do seu caminho. Ela não chega para consumir você, mas para mostrar onde sua coragem precisa ganhar direção.',
    'Uma luz quente atravessa a carta e toca aquilo que ainda deseja nascer. A vida lembra que força verdadeira não é pressa: é presença colocada em movimento.',
    'Esta carta chega como fogo consciente: ilumina o que pede ação e aquece a parte de você que estava esperando permissão para existir.',
    'Há uma chama pedindo forma dentro desta mensagem. A vida não exige grandeza imediata; pede que sua energia encontre um gesto digno de continuar.'
  ]),
  water:Object.freeze([
    'A vida movimenta as águas desta carta para que seu coração reconheça o que sente sem se afogar no que imagina.',
    'Esta mensagem nasce como água limpa: toca memórias, revela afetos e procura um recipiente onde sensibilidade e limite possam permanecer juntos.',
    'A carta abre uma passagem pelo mundo emocional. A vida convida você a sentir com profundidade e, ainda assim, conservar margem, escolha e realidade.',
    'Algo dentro de você pede para voltar a circular. Esta carta abençoa o sentir que nutre, limpa e devolve verdade ao coração.'
  ]),
  air:Object.freeze([
    'A vida abre uma janela dentro desta carta. O ar entra para separar verdade de ruído e devolver espaço ao pensamento que já estava cansado de lutar sozinho.',
    'Esta mensagem atravessa a mente como um vento claro: não leva embora a complexidade, mas permite enxergar qual ideia merece governar o próximo passo.',
    'A carta sopra consciência sobre palavras, escolhas e conflitos. A vida pede uma verdade que ilumine sem precisar ferir.',
    'Um céu mais amplo se abre sobre a pergunta. Esta carta lembra que clareza não é saber tudo; é reconhecer honestamente o que já pode ser decidido.'
  ]),
  earth:Object.freeze([
    'A vida firma seus pés dentro desta carta. O sagrado aparece no corpo, no tempo, no trabalho e em tudo aquilo que precisa ser cuidado para durar.',
    'Esta mensagem nasce da terra: silenciosa, concreta e fértil. Ela recorda que uma bênção também pode chegar como rotina, limite e construção paciente.',
    'A carta coloca realidade sob seus pés sem apagar o mistério. A vida mostra que aquilo que merece crescer precisa de presença, recurso e continuidade.',
    'Existe uma força tranquila sustentando esta mensagem. Ela não promete atalhos; oferece chão para que sua escolha encontre forma verdadeira.'
  ]),
  spirit:Object.freeze([
    'A vida movimenta o invisível desta carta e lembra que nenhum ciclo permanece imóvel. Entre o que termina e o que nasce, sua consciência continua podendo escolher.',
    'Esta carta chega como passagem entre mundos interiores. Ela não determina o futuro: revela o ponto em que sua alma pode responder de outra maneira.',
    'Um ciclo maior respira através desta mensagem. A vida convida você a reconhecer o movimento sem entregar a ele sua liberdade.',
    'A carta abre uma visão mais ampla da jornada. O mistério permanece, mas você não está sem direção: existe uma escolha possível dentro da travessia.'
  ])
});

const majorLife = (name, blessing, affirmation) => Object.freeze({ name, blessing, affirmation });

const MAJOR_LIFE = Object.freeze({
  louco:majorLife(
    'A bênção do primeiro passo',
    'Que seus passos sejam livres sem perderem consciência; que a curiosidade abra caminhos e que a presença proteja você diante de cada borda.',
    'Eu caminho com liberdade, atenção e coragem para aprender durante a travessia.'
  ),
  mago:majorLife(
    'A bênção da autoria',
    'Que suas mãos reconheçam os recursos que já possuem; que intenção e gesto se encontrem, e que sua criação sirva à verdade que deseja colocar no mundo.',
    'Eu reúno meus recursos e transformo intenção em presença criadora.'
  ),
  sacerdotisa:majorLife(
    'A bênção do silêncio fértil',
    'Que o silêncio proteja aquilo que ainda amadurece; que sua intuição converse com a realidade e revele a verdade no tempo certo.',
    'Eu respeito o mistério sem abandonar minha capacidade de observar e compreender.'
  ),
  imperatriz:majorLife(
    'A bênção do jardim vivo',
    'Que seu cuidado encontre reciprocidade, que seu corpo receba beleza e descanso, e que tudo o que você nutre cresça sem sufocar sua própria vida.',
    'Eu nutro o que floresce e também reconheço meu lugar dentro do jardim.'
  ),
  imperador:majorLife(
    'A bênção da estrutura justa',
    'Que seus limites ofereçam proteção sem se tornarem prisão; que sua autoridade nasça da responsabilidade e sustente aquilo que realmente importa.',
    'Eu construo limites firmes para que a vida possa permanecer segura e livre.'
  ),
  hierofante:majorLife(
    'A bênção da sabedoria recebida',
    'Que os ensinamentos antigos tragam raiz sem apagar sua consciência; que você preserve o princípio verdadeiro e transforme aquilo que já não serve ao amor.',
    'Eu honro a sabedoria que liberta e escolho conscientemente o legado que continuará.'
  ),
  enamorados:majorLife(
    'A bênção da escolha amorosa',
    'Que amor, verdade e liberdade possam ocupar a mesma casa; que toda união revele reciprocidade e que nenhuma escolha exija o abandono de sua essência.',
    'Eu escolho vínculos nos quais sentimento, palavra e atitude conseguem caminhar juntos.'
  ),
  carro:majorLife(
    'A bênção da direção',
    'Que suas forças deixem de disputar seu coração e aprendam a servir ao mesmo caminho; que movimento e propósito se reconheçam.',
    'Eu conduzo minha energia com presença e escolho a direção que merece meu avanço.'
  ),
  justica:majorLife(
    'A bênção da verdade equilibrada',
    'Que os fatos recebam seu peso verdadeiro; que responsabilidade não se transforme em crueldade e que sua decisão restaure dignidade e proporção.',
    'Eu olho com honestidade, respondo por minhas escolhas e preservo o que é justo.'
  ),
  eremita:majorLife(
    'A bênção da lanterna interior',
    'Que sua solitude seja abrigo, não exílio; que a experiência ilumine o próximo passo e que você confie na luz possível de hoje.',
    'Eu não preciso enxergar a estrada inteira para caminhar com sabedoria.'
  ),
  roda:majorLife(
    'A bênção dos ciclos',
    'Que você reconheça a mudança sem perder o centro; que cada giro liberte aprendizado e revele a escolha que ainda permanece em suas mãos.',
    'Eu acolho o movimento da vida e escolho como atravessar cada volta.'
  ),
  forca:majorLife(
    'A bênção da coragem serena',
    'Que sua potência não precise ferir para existir; que instinto e consciência se reconheçam, e que sua firmeza proteja sem humilhar.',
    'Eu conduzo minha força com coragem, ternura e domínio de mim.'
  ),
  enforcado:majorLife(
    'A bênção do novo olhar',
    'Que a pausa revele aquilo que a pressa escondia; que outra perspectiva desfaça a repetição e devolva sentido ao caminho.',
    'Eu permito que uma nova visão transforme o que a insistência não conseguiu mover.'
  ),
  morte:majorLife(
    'A bênção da transformação',
    'Que todo fim receba respeito; que o passado entregue seu aprendizado e que o espaço aberto permita à vida nascer numa forma mais verdadeira.',
    'Eu honro o que terminou e libero espaço para aquilo que deseja nascer.'
  ),
  temperanca:majorLife(
    'A bênção da medida viva',
    'Que extremos encontrem diálogo dentro de você; que corpo, desejo e realidade descubram um ritmo capaz de curar sem apagar nenhuma verdade.',
    'Eu crio equilíbrio ajustando meu caminho com paciência e consciência.'
  ),
  diabo:majorLife(
    'A bênção da liberdade recuperada',
    'Que toda corrente seja vista pelo tamanho real; que desejo não se transforme em prisão e que sua honestidade devolva a escolha escondida pelo medo.',
    'Eu reconheço o que me prende e recupero, passo a passo, minha liberdade de escolher.'
  ),
  torre:majorLife(
    'A bênção da verdade que liberta',
    'Que aquilo que cai leve apenas a forma que já não sustentava sua vida; que o chão revelado receba uma construção mais honesta.',
    'Eu deixo cair a fachada e reconstruo a partir do que permanece verdadeiro.'
  ),
  estrela:majorLife(
    'A bênção da esperança profunda',
    'Que sua água volte a circular; que vulnerabilidade encontre proteção e que a esperança permaneça acesa sem precisar negar a noite atravessada.',
    'Eu cuido do que sobreviveu e permito que minha vida volte a florescer.'
  ),
  lua:majorLife(
    'A bênção da intuição lúcida',
    'Que sua sensibilidade enxergue sem fabricar certezas; que o medo perca o direito de nomear todos os caminhos e que a realidade acompanhe sua intuição.',
    'Eu escuto o invisível e confirmo meus passos com tempo, cuidado e realidade.'
  ),
  sol:majorLife(
    'A bênção da vida revelada',
    'Que sua alegria possa existir sem pedir desculpa; que a verdade ilumine o corpo e que sua presença aqueça sem esconder nenhuma parte de você.',
    'Eu permito que minha verdade, minha alegria e minha presença ocupem a luz.'
  ),
  julgamento:majorLife(
    'A bênção do chamado',
    'Que o passado seja compreendido sem condenação; que responsabilidade e perdão abram juntos a passagem para uma resposta nova.',
    'Eu escuto o chamado da mudança e respondo sem carregar uma sentença eterna sobre mim.'
  ),
  mundo:majorLife(
    'A bênção da conclusão inteira',
    'Que você reconheça a obra concluída, celebre a totalidade alcançada e atravesse a próxima fronteira sem diminuir sua conquista.',
    'Eu honro o ciclo completo e sigo adiante levando comigo tudo o que se tornou sabedoria.'
  )
});

const SUIT_LIFE = Object.freeze({
  paus:Object.freeze({
    blessing:'sua chama encontre direção e aqueça a obra que merece nascer',
    choice:'conduzir minha coragem com propósito'
  }),
  copas:Object.freeze({
    blessing:'suas águas encontrem margem, reciprocidade e espaço para voltar a nutrir',
    choice:'honrar meus sentimentos sem abandonar meus limites'
  }),
  espadas:Object.freeze({
    blessing:'sua mente receba clareza e use a verdade para libertar, nunca para ferir sem necessidade',
    choice:'usar a verdade com clareza e humanidade'
  }),
  ouros:Object.freeze({
    blessing:'a terra sustente seu corpo, seu trabalho e tudo aquilo que precisa de tempo para florescer',
    choice:'construir com paciência, corpo e realidade'
  })
});

function lifeProfile(identity) {
  const major = identity.source === 'major' ? MAJOR_LIFE[identity.key] : null;
  if (major) return major;
  const suit = SUIT_LIFE[identity.suit] || SUIT_LIFE.ouros;
  return Object.freeze({
    name:identity.title,
    blessing:`Que ${suit.blessing}. Que a luz particular desta carta acompanhe a possibilidade que ela revela: ${sentence(identity.consequence)}`,
    affirmation:`Eu escolho ${suit.choice} e acolho esta verdade: ${lowerSentence(identity.truth)}.`
  });
}

function stableSeedFor(card, scope, moment, intention) {
  return `${cardIdentity(card)}:${scope}:${moment}:${normalize(intention)}`;
}

function counselFrom(base) {
  return clean(base.whisper).replace(/^Direção central\s+—\s+/iu, '');
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta', moment = 'agora', intention = ''
} = {}) {
  const stableSeed = stableSeedFor(card, scope, moment, intention);
  const base = soulForCard(card, stableSeed, { scope, moment, intention });
  const identity = tarotIdentity(card);
  const profile = lifeProfile(identity);
  const calls = ELEMENT_CALLS[identity.element] || ELEMENT_CALLS.spirit;
  const call = choose(calls, stableSeed, 'life-call');
  const counsel = counselFrom(base);
  const label = scope.includes('carta-do-dia')
    ? 'MOTOR DA VIDA · MENSAGEM ABENÇOADA DO DIA'
    : 'MOTOR DA VIDA · MENSAGEM PARA SUA JORNADA';

  const heartline = `Chamado da Vida — ${call}`;
  const whisper = `Verdade da carta — ${sentence(identity.truth)}`;
  const paragraphs = Object.freeze([
    base.paragraphs[0],
    base.paragraphs[1],
    `Destino em movimento — O futuro não está fechado: esta carta revela a direção que pode amadurecer através das suas escolhas. ${sentence(identity.consequence)} O movimento que fortalece esse caminho é: ${counsel}`,
    `Bênção da carta — ${profile.blessing}\n\n${base.paragraphs[2]}\n\nPalavra para levar no coração — “${profile.affirmation}”`
  ]);

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label,
    title:`${cardName(card)} · ${profile.name}`,
    heartline,
    whisper,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:`Ritual de presença — Respire, releia a verdade da carta e escolha um gesto concreto para honrá-la hoje. ${base.closing}`,
    signature:signature(stableSeed, 'tarot-life'),
    lifeProfile:Object.freeze({ name:profile.name, blessing:profile.blessing, affirmation:profile.affirmation }),
    cohesion:Object.freeze({ ...base.cohesion, lifeCall:true, movingDestiny:true, blessing:true, affirmation:true, ritual:true })
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const base = soulConversation(validCards, positions, seed, intention);
  if (validCards.length === 1) {
    const life = storyForCard(validCards[0], seed, {
      scope:'tiragem', moment:clean(positions[0], 100) || 'Posição 1', intention
    });
    return Object.freeze({
      ...life,
      label:'MOTOR DA VIDA · UMA CARTA, UMA JORNADA',
      lead:base.lead,
      voices:base.voices
    });
  }

  const identities = validCards.map(tarotIdentity);
  const pivotIndex = Math.floor(validCards.length / 2);
  const firstIdentity = identities[0];
  const pivotIdentity = identities[pivotIndex];
  const lastIdentity = identities.at(-1);
  const pivotProfile = lifeProfile(pivotIdentity);
  const lastProfile = lifeProfile(lastIdentity);
  const stableSeed = `${validCards.map(cardIdentity).join('→')}:${positions.join('→')}:${normalize(intention)}`;
  const calls = ELEMENT_CALLS[pivotIdentity.element] || ELEMENT_CALLS.spirit;
  const call = choose(calls, stableSeed, 'spread-life-call');
  const story = [
    base.story,
    `Destino em movimento — Esta sequência não aprisiona o futuro; ela mostra uma passagem possível. A jornada parte de “${cardName(validCards[0])}”, atravessa “${cardName(validCards[pivotIndex])}” e encontra direção em “${cardName(validCards.at(-1))}”. ${sentence(lastIdentity.consequence)} Suas escolhas continuam capazes de fortalecer, corrigir ou transformar esse caminho.`,
    `Bênção da jornada — ${pivotProfile.blessing}\n\nPalavra para levar no coração — “${lastProfile.affirmation}”`
  ].join('\n\n');

  return Object.freeze({
    ...base,
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'MOTOR DA VIDA · AS CARTAS ABENÇOAM A JORNADA',
    title:`${cardName(validCards[0])} → ${cardName(validCards.at(-1))} · jornada viva`,
    heartline:`Chamado da jornada — ${call}`,
    lead:base.lead,
    story,
    closing:`Ritual de integração — Leia novamente o resumo da jornada e escolha uma atitude que honre a carta final. ${base.closing}`,
    signature:signature(stableSeed, 'tarot-life-spread'),
    lifeProfile:Object.freeze({
      beginning:firstIdentity.key,
      center:pivotIdentity.key,
      direction:lastIdentity.key,
      blessing:pivotProfile.blessing,
      affirmation:lastProfile.affirmation
    }),
    cohesion:Object.freeze({ ...base.cohesion, lifeCall:true, movingDestiny:true, blessing:true, affirmation:true, ritual:true })
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
  const base = soulResponse(raw, options);
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
    tarotBasis:creation.tarotBasis,
    lifeProfile:creation.lifeProfile,
    text
  });
}

export function storyCapacity() {
  return Object.freeze({
    cards:78,
    majorBlessings:Object.keys(MAJOR_LIFE).length,
    minorPaths:56,
    fixedMeanings:true,
    movingDestiny:true,
    literalChanneling:false,
    rule:'a poesia amplia a carta; nunca substitui significado, escolha ou realidade'
  });
}
