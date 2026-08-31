export const SCHOOL_STORAGE_KEY = 'school-progress-v5';

export const SCHOOL_MODULES = Object.freeze([
  ['fundamentals','Fundamentos do Tarot','A linguagem simbólica, a estrutura do baralho e uma prática responsável.','foundation'],
  ['majors','Os 22 Arcanos Maiores','Os grandes arquétipos e passagens da jornada.','major'],
  ['wands','Paus','Fogo, coragem, impulso e criação.','Paus'],
  ['cups','Copas','Água, sentimentos, vínculos e intuição.','Copas'],
  ['swords','Espadas','Ar, pensamentos, escolhas e verdade.','Espadas'],
  ['pentacles','Ouros','Terra, corpo, trabalho e recursos.','Ouros'],
  ['court','Cartas da Corte','Pajem, Cavaleiro, Rainha e Rei como modos de expressão.','court'],
  ['numbers','Números e Padrões','Do Ás ao Dez: ciclos, repetições e movimento.','theory'],
  ['elements','Naipes e Elementos','Como Água, Ar, Fogo e Terra conversam.','theory'],
  ['positions','Posições de uma Tiragem','A carta muda de função conforme a posição.','practice'],
  ['combinations','Combinações','Relações, contrastes e apoios entre cartas.','practice'],
  ['synthesis','Construção de Síntese','Como transformar várias cartas em uma leitura coerente.','practice'],
  ['practice-spreads','Tiragens Práticas','Exercícios progressivos de uma, três e cinco cartas.','practice'],
  ['celtic-cross','Cruz Celta','As dez posições tradicionais e sua integração.','practice'],
  ['royal-table','Mesa Real','As 78 posições em 13 fileiras de 6.','advanced'],
  ['ethics','Ética','Consentimento, limites e linguagem não determinista.','foundation'],
  ['advanced','Prática Avançada','Método, registro, revisão e desenvolvimento da própria voz.','advanced']
].map((item, index) => Object.freeze({ id:item[0], order:index + 1, title:item[1], description:item[2], kind:item[3] })));

export function cardModuleId(card) {
  if (card.arcanaCode === 'major') return 'majors';
  return ({ Paus:'wands', Copas:'cups', Espadas:'swords', Ouros:'pentacles' })[card.suit] || 'fundamentals';
}

export function defaultSchoolState() {
  return { completed: [], favorites: [], lastModule: 'fundamentals', lastLesson: null, schemaVersion: '5.0.1' };
}

export function normalizeSchoolState(value) {
  const base = defaultSchoolState();
  return { ...base, ...(value && typeof value === 'object' ? value : {}), completed: [...new Set(Array.isArray(value?.completed) ? value.completed : [])], favorites: [...new Set(Array.isArray(value?.favorites) ? value.favorites : [])] };
}
