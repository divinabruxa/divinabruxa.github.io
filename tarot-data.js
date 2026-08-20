const major = ['O Louco','O Mago','A Sacerdotisa','A Imperatriz','O Imperador','O Hierofante','Os Enamorados','O Carro','A Força','O Eremita','A Roda da Fortuna','A Justiça','O Pendurado','A Morte','A Temperança','O Diabo','A Torre','A Estrela','A Lua','O Sol','O Julgamento','O Mundo'];
const ranks = ['Ás','2','3','4','5','6','7','8','9','10','Pajem','Cavaleiro','Rainha','Rei'];
const suits = ['Copas','Espadas','Paus','Ouros'];

export const CARDS = [...major, ...suits.flatMap(suit => ranks.map(rank => `${rank} de ${suit}`))]
  .map((name, id) => ({
    id, name,
    image: `card-${String(id).padStart(2, '0')}.${id === 47 ? 'png' : 'jpg'}`,
    arcana: id < 22 ? 'Arcano Maior' : 'Arcano Menor',
    suit: id < 22 ? 'Maiores' : suits[Math.floor((id - 22) / 14)]
  }));

export const DAILY_MESSAGES = {
  Maiores: 'Uma força maior atravessa este dia. Observe o símbolo, aceite o chamado e escolha com consciência.',
  Copas: 'Escute o que o coração já sabe. Emoções verdadeiras pedem espaço, cuidado e honestidade.',
  Espadas: 'A clareza nasce quando você encara a verdade. Escolha o pensamento que merece permanecer.',
  Paus: 'Seu fogo está acordado. Direcione a energia para uma ação corajosa, criativa e possível.',
  Ouros: 'O presente pede construção. Cuide do corpo, dos recursos e do próximo passo concreto.'
};
