/* DIVINA BRUXA — CATÁLOGO CANÔNICO V5 — CHECKPOINT 1.1
   Fonte oficial única das 78 cartas.
   Compatibilidade: `id` continua sendo o índice numérico usado pelos motores atuais.
   Identidade permanente: `canonicalId`. Orientação única e imutável: normal.
*/

export const CATALOG_SCHEMA_VERSION = '5.0.1';
export const REQUIRED_ORIENTATION = 'normal';

const MAJOR_ARCANA = [
  ['o-louco', 'O Louco', 'The Fool', 'El Loco', 'Ar', 'Urano'],
  ['o-mago', 'O Mago', 'The Magician', 'El Mago', 'Ar', 'Mercúrio'],
  ['a-sacerdotisa', 'A Sacerdotisa', 'The High Priestess', 'La Sacerdotisa', 'Água', 'Lua'],
  ['a-imperatriz', 'A Imperatriz', 'The Empress', 'La Emperatriz', 'Terra', 'Vênus'],
  ['o-imperador', 'O Imperador', 'The Emperor', 'El Emperador', 'Fogo', 'Áries'],
  ['o-hierofante', 'O Hierofante', 'The Hierophant', 'El Hierofante', 'Terra', 'Touro'],
  ['os-enamorados', 'Os Enamorados', 'The Lovers', 'Los Enamorados', 'Ar', 'Gêmeos'],
  ['o-carro', 'O Carro', 'The Chariot', 'El Carro', 'Água', 'Câncer'],
  ['a-forca', 'A Força', 'Strength', 'La Fuerza', 'Fogo', 'Leão'],
  ['o-eremita', 'O Eremita', 'The Hermit', 'El Ermitaño', 'Terra', 'Virgem'],
  ['a-roda-da-fortuna', 'A Roda da Fortuna', 'Wheel of Fortune', 'La Rueda de la Fortuna', 'Fogo', 'Júpiter'],
  ['a-justica', 'A Justiça', 'Justice', 'La Justicia', 'Ar', 'Libra'],
  ['o-pendurado', 'O Pendurado', 'The Hanged Man', 'El Colgado', 'Água', 'Netuno'],
  ['a-morte', 'A Morte', 'Death', 'La Muerte', 'Água', 'Escorpião'],
  ['a-temperanca', 'A Temperança', 'Temperance', 'La Templanza', 'Fogo', 'Sagitário'],
  ['o-diabo', 'O Diabo', 'The Devil', 'El Diablo', 'Terra', 'Capricórnio'],
  ['a-torre', 'A Torre', 'The Tower', 'La Torre', 'Fogo', 'Marte'],
  ['a-estrela', 'A Estrela', 'The Star', 'La Estrella', 'Ar', 'Aquário'],
  ['a-lua', 'A Lua', 'The Moon', 'La Luna', 'Água', 'Peixes'],
  ['o-sol', 'O Sol', 'The Sun', 'El Sol', 'Fogo', 'Sol'],
  ['o-julgamento', 'O Julgamento', 'Judgement', 'El Juicio', 'Fogo', 'Plutão'],
  ['o-mundo', 'O Mundo', 'The World', 'El Mundo', 'Terra', 'Saturno']
];

const RANKS = [
  { ptBR: 'Ás', en: 'Ace', es: 'As', value: 1, kind: 'number', correspondence: 'semente e potencial' },
  { ptBR: '2', en: 'Two', es: 'Dos', value: 2, kind: 'number', correspondence: 'polaridade e escolha' },
  { ptBR: '3', en: 'Three', es: 'Tres', value: 3, kind: 'number', correspondence: 'expressão e crescimento' },
  { ptBR: '4', en: 'Four', es: 'Cuatro', value: 4, kind: 'number', correspondence: 'estrutura e estabilidade' },
  { ptBR: '5', en: 'Five', es: 'Cinco', value: 5, kind: 'number', correspondence: 'tensão e transformação' },
  { ptBR: '6', en: 'Six', es: 'Seis', value: 6, kind: 'number', correspondence: 'harmonia e passagem' },
  { ptBR: '7', en: 'Seven', es: 'Siete', value: 7, kind: 'number', correspondence: 'avaliação e aprofundamento' },
  { ptBR: '8', en: 'Eight', es: 'Ocho', value: 8, kind: 'number', correspondence: 'movimento e domínio' },
  { ptBR: '9', en: 'Nine', es: 'Nueve', value: 9, kind: 'number', correspondence: 'maturidade e integração' },
  { ptBR: '10', en: 'Ten', es: 'Diez', value: 10, kind: 'number', correspondence: 'conclusão e consequência' },
  { ptBR: 'Pajem', en: 'Page', es: 'Sota', value: null, kind: 'court', correspondence: 'mensagem e aprendizado' },
  { ptBR: 'Cavaleiro', en: 'Knight', es: 'Caballero', value: null, kind: 'court', correspondence: 'movimento e busca' },
  { ptBR: 'Rainha', en: 'Queen', es: 'Reina', value: null, kind: 'court', correspondence: 'domínio interior e cuidado' },
  { ptBR: 'Rei', en: 'King', es: 'Rey', value: null, kind: 'court', correspondence: 'liderança e responsabilidade' }
];

const SUITS = [
  { ptBR: 'Copas', en: 'Cups', es: 'Copas', slug: 'copas', element: 'Água', domain: 'emoções, vínculos e intuição' },
  { ptBR: 'Espadas', en: 'Swords', es: 'Espadas', slug: 'espadas', element: 'Ar', domain: 'pensamento, verdade e decisões' },
  { ptBR: 'Paus', en: 'Wands', es: 'Bastos', slug: 'paus', element: 'Fogo', domain: 'energia, coragem e criatividade' },
  { ptBR: 'Ouros', en: 'Pentacles', es: 'Oros', slug: 'ouros', element: 'Terra', domain: 'corpo, trabalho e recursos' }
];

const imageFor = index => `card-${String(index).padStart(2, '0')}.${index === 47 ? 'png' : 'jpg'}`;
const permanentId = (index, slug) => `${String(index).padStart(2, '0')}-${slug}`;

const majors = MAJOR_ARCANA.map(([slug, ptBR, en, es, element, astrological], index) => ({
  id: index,
  index,
  atlasIndex: index,
  canonicalId: permanentId(index, slug),
  names: Object.freeze({ ptBR, en, es }),
  name: ptBR,
  arcana: 'Arcano Maior',
  arcanaCode: 'major',
  suit: 'Maiores',
  suitCode: null,
  number: index,
  rank: null,
  court: null,
  element,
  correspondences: Object.freeze({ astrological, archetype: `Arcano Maior ${index}` }),
  image: imageFor(index),
  orientation: REQUIRED_ORIENTATION
}));

const minors = SUITS.flatMap((suit, suitIndex) => RANKS.map((rank, rankIndex) => {
  const index = 22 + (suitIndex * RANKS.length) + rankIndex;
  const rankSlug = rank.ptBR.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const names = {
    ptBR: `${rank.ptBR} de ${suit.ptBR}`,
    en: `${rank.en} of ${suit.en}`,
    es: `${rank.es} de ${suit.es}`
  };
  return {
    id: index,
    index,
    atlasIndex: index,
    canonicalId: permanentId(index, `${rankSlug}-de-${suit.slug}`),
    names: Object.freeze(names),
    name: names.ptBR,
    arcana: 'Arcano Menor',
    arcanaCode: 'minor',
    suit: suit.ptBR,
    suitCode: suit.slug,
    number: rank.value,
    rank: rank.ptBR,
    court: rank.kind === 'court' ? rank.ptBR : null,
    element: suit.element,
    correspondences: Object.freeze({ numerology: rank.correspondence, domain: suit.domain }),
    image: imageFor(index),
    orientation: REQUIRED_ORIENTATION
  };
}));

export const CARDS = Object.freeze([...majors, ...minors].map(card => Object.freeze(card)));

export const CARD_BY_CANONICAL_ID = Object.freeze(Object.fromEntries(
  CARDS.map(card => [card.canonicalId, card])
));

export const CARD_BY_PTBR_NAME = Object.freeze(Object.fromEntries(
  CARDS.map(card => [card.names.ptBR, card])
));

export function getCardByIndex(index) {
  return Number.isInteger(index) ? CARDS[index] || null : null;
}

export function getCardByCanonicalId(canonicalId) {
  return typeof canonicalId === 'string' ? CARD_BY_CANONICAL_ID[canonicalId] || null : null;
}

export const DAILY_MESSAGES = Object.freeze({
  Maiores: 'Uma força maior atravessa este dia. Observe o símbolo, aceite o chamado e escolha com consciência.',
  Copas: 'Escute o que o coração já sabe. Emoções verdadeiras pedem espaço, cuidado e honestidade.',
  Espadas: 'A clareza nasce quando você encara a verdade. Escolha o pensamento que merece permanecer.',
  Paus: 'Seu fogo está acordado. Direcione a energia para uma ação corajosa, criativa e possível.',
  Ouros: 'O presente pede construção. Cuide do corpo, dos recursos e do próximo passo concreto.'
});
