import { shuffle } from './lib/tarot-state.js';

const makeRoyalPositions = () => Array.from({ length:78 }, (_, index) => {
  const row = Math.floor(index / 13) + 1;
  const house = (index % 13) + 1;
  return `Linha ${row} · Casa ${house}`;
});

const defineSpread = ({ positions, ...definition }) => Object.freeze({
  ...definition,
  positions:Object.freeze([...positions])
});

const DEFINITIONS = [
  defineSpread({
    id:'conselho', name:'Conselho', eyebrow:'UMA LUZ', access:'free',
    positions:['Conselho para o agora'],
    synthesisPrompt:'Que gesto concreto pode honrar esta imagem hoje?'
  }),
  defineSpread({
    id:'tres-tempos', name:'Três Tempos', eyebrow:'MOVIMENTO', access:'free',
    positions:['Origem', 'Agora', 'Próximo movimento'],
    synthesisPrompt:'Que fio liga a origem ao movimento que agora se anuncia?'
  }),
  defineSpread({
    id:'dois-caminhos', name:'Dois Caminhos', eyebrow:'ESCOLHA CONSCIENTE', access:'free',
    positions:[
      'Você diante da escolha',
      'Caminho A · potência',
      'Caminho A · desafio',
      'Caminho B · potência',
      'Caminho B · desafio',
      'Critério de integração'
    ],
    synthesisPrompt:'Qual critério permanece verdadeiro nos dois caminhos?'
  }),
  defineSpread({
    id:'cruz-celta', name:'Cruz Celta', eyebrow:'DEZ POSIÇÕES', access:'free',
    positions:[
      'Situação presente',
      'Desafio que atravessa',
      'Consciência e intenção',
      'Base profunda',
      'Passado que se afasta',
      'Futuro próximo',
      'Sua postura',
      'Ambiente e influências',
      'Esperanças e receios',
      'Síntese e direção'
    ],
    synthesisPrompt:'O que muda quando situação, base e direção são observadas como um só movimento?'
  }),
  defineSpread({
    id:'mesa-real', name:'Mesa Real', eyebrow:'TREZE POR SEIS', access:'premium',
    positions:makeRoyalPositions(),
    synthesisPrompt:'Quais padrões atravessam linhas diferentes e onde a mesa pede integração?'
  }),
  defineSpread({
    id:'amor-relacao', name:'Amor & Relação', eyebrow:'SETE ESPELHOS', access:'premium',
    positions:[
      'Você no vínculo',
      'A outra presença no vínculo',
      'O que aproxima',
      'O que pede cuidado',
      'Necessidade não expressa',
      'Limite saudável',
      'Próximo gesto possível'
    ],
    synthesisPrompt:'Que cuidado preserva sua verdade sem apagar a verdade do vínculo?'
  }),
  defineSpread({
    id:'vinculo-percepcoes', name:'Vínculo & Percepções', eyebrow:'SETE CAMADAS', access:'premium',
    positions:[
      'O que você percebe',
      'O que é observável',
      'O que permanece ambíguo',
      'Sua projeção possível',
      'Dinâmica compartilhada',
      'Limite que traz clareza',
      'Conversa ou gesto possível'
    ],
    synthesisPrompt:'O que é observável, o que permanece ambíguo e qual limite devolve clareza?'
  }),
  defineSpread({
    id:'trabalho-vocacao', name:'Trabalho & Vocação', eyebrow:'SETE OFÍCIOS', access:'premium',
    positions:[
      'Momento profissional',
      'Talento disponível',
      'Valor que orienta',
      'Desafio presente',
      'Recurso a desenvolver',
      'Oportunidade concreta',
      'Próximo movimento'
    ],
    synthesisPrompt:'Qual talento pode virar movimento prático sem ignorar o desafio presente?'
  }),
  defineSpread({
    id:'dinheiro-recursos', name:'Dinheiro & Recursos', eyebrow:'SEIS RECURSOS', access:'premium',
    positions:[
      'Relação atual com recursos',
      'Recurso já disponível',
      'Vazamento ou tensão',
      'Prioridade material',
      'Ação responsável',
      'Critério para decidir'
    ],
    synthesisPrompt:'Que ação responsável fortalece recursos reais sem prometer certezas?'
  }),
  defineSpread({
    id:'sombra-integracao', name:'Sombra & Integração', eyebrow:'SETE PORTAIS', access:'premium',
    positions:[
      'O que pede reconhecimento',
      'Gatilho ou contexto',
      'Proteção que já serviu',
      'Custo dessa proteção hoje',
      'Recurso consciente',
      'Limite de cuidado',
      'Gesto de integração'
    ],
    synthesisPrompt:'Que parte pode ser reconhecida com responsabilidade, limite e cuidado?'
  }),
  defineSpread({
    id:'ciclo-12-meses', name:'Ciclo de 12 Meses', eyebrow:'DOZE PASSAGENS', access:'premium',
    positions:Array.from({ length:12 }, (_, index) => `Mês ${index + 1} · tema simbólico`),
    synthesisPrompt:'Que tema simbólico atravessa o ciclo sem transformar possibilidade em previsão?'
  }),
  defineSpread({
    id:'mandala-ano', name:'Mandala do Ano', eyebrow:'CENTRO E DOZE CASAS', access:'premium',
    positions:[
      'Centro · eixo do ciclo',
      'Casa 1 · presença',
      'Casa 2 · recursos',
      'Casa 3 · expressão',
      'Casa 4 · raízes',
      'Casa 5 · criação',
      'Casa 6 · cotidiano',
      'Casa 7 · relações',
      'Casa 8 · transformação',
      'Casa 9 · horizontes',
      'Casa 10 · vocação',
      'Casa 11 · comunidade',
      'Casa 12 · mundo interior'
    ],
    synthesisPrompt:'Como o centro da mandala conversa com o mundo interior e a vida compartilhada?'
  }),
  defineSpread({
    id:'arvore-da-vida', name:'Árvore da Vida', eyebrow:'DEZ ESFERAS', access:'premium',
    positions:[
      'Coroa · intenção',
      'Sabedoria · impulso',
      'Entendimento · forma',
      'Misericórdia · expansão',
      'Força · limite',
      'Beleza · integração',
      'Vitória · desejo',
      'Esplendor · linguagem',
      'Fundamento · vínculo',
      'Reino · manifestação'
    ],
    synthesisPrompt:'Que caminho desce da intenção até a manifestação e onde precisa de equilíbrio?'
  }),
  defineSpread({
    id:'proposito-caminho', name:'Propósito & Caminho', eyebrow:'SETE DIREÇÕES', access:'premium',
    positions:[
      'O chamado presente',
      'Dom em movimento',
      'Valor inegociável',
      'Experiência que ensina',
      'O que pede desapego',
      'Apoio disponível',
      'Próximo passo possível'
    ],
    synthesisPrompt:'Que próximo movimento honra o dom presente sem exigir uma resposta definitiva?'
  }),
  defineSpread({
    id:'cura-emocional', name:'Cura Emocional', eyebrow:'SEIS CUIDADOS', access:'premium',
    positions:[
      'Emoção que pede espaço',
      'Necessidade por trás dela',
      'Recurso interno',
      'Apoio externo possível',
      'Limite protetor',
      'Cuidado para o agora'
    ],
    synthesisPrompt:'Que cuidado possível cabe no agora, sem substituir apoio profissional quando necessário?'
  })
];

export const SPREAD_LIST = Object.freeze([...DEFINITIONS]);
export const SPREADS = Object.freeze(Object.fromEntries(SPREAD_LIST.map(spread => [spread.id, spread])));
export const FREE_SPREAD_IDS = Object.freeze(SPREAD_LIST.filter(spread => spread.access === 'free').map(spread => spread.id));
export const PREMIUM_SPREAD_IDS = Object.freeze(SPREAD_LIST.filter(spread => spread.access === 'premium').map(spread => spread.id));

export function createSpreadState(spreadId, cardIds, cryptoSource = globalThis.crypto) {
  if (!SPREADS[spreadId]) throw new TypeError('Tiragem desconhecida.');
  return { spreadId, order:shuffle(cardIds, cryptoSource), revealed:0, intention:'' };
}

export function validateSpreadState(candidate, cardIds) {
  if (!candidate || !SPREADS[candidate.spreadId] || !Array.isArray(candidate.order)) return null;
  if (candidate.order.length !== cardIds.length || new Set(candidate.order).size !== cardIds.length) return null;
  const expected = new Set(cardIds);
  if (candidate.order.some(id => !expected.has(id))) return null;
  const total = SPREADS[candidate.spreadId].positions.length;
  const revealed = Math.min(Math.max(Number(candidate.revealed) || 0, 0), total);
  const intention = typeof candidate.intention === 'string' ? candidate.intention.slice(0, 180) : '';
  return { spreadId:candidate.spreadId, order:[...candidate.order], revealed, intention };
}

export function revealSpreadPosition(state) {
  const total = SPREADS[state.spreadId].positions.length;
  if (state.revealed >= total) return { state, cardId:null, positionIndex:null };
  const positionIndex = state.revealed;
  return {
    state:{ ...state, order:[...state.order], revealed:state.revealed + 1 },
    cardId:state.order[positionIndex],
    positionIndex
  };
}

function leaders(values) {
  const counts = new Map();
  values.filter(Boolean).forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
  const highest = Math.max(0, ...counts.values());
  return [...counts.entries()].filter(([, count]) => count === highest).map(([label, count]) => `${label} (${count})`);
}

export function buildSpreadSynthesis(spreadId, cards) {
  const spread = SPREADS[spreadId];
  if (!spread || !Array.isArray(cards) || cards.length !== spread.positions.length || cards.some(card => !card)) return null;
  const majors = cards.filter(card => card.arcanaCode === 'major').length;
  const courts = cards.filter(card => Boolean(card.court)).length;
  const elementLeaders = leaders(cards.map(card => card.element));
  const suitLeaders = leaders(cards.filter(card => card.arcanaCode === 'minor').map(card => card.suit));
  const facts = [
    `${majors} ${majors === 1 ? 'Arcano Maior' : 'Arcanos Maiores'} na composição.`,
    ...(elementLeaders.length ? [`Maior presença elemental: ${elementLeaders.join(' e ')}.`] : []),
    ...(suitLeaders.length ? [`Entre os Menores, maior presença: ${suitLeaders.join(' e ')}.`] : []),
    `${courts} ${courts === 1 ? 'figura da corte' : 'figuras da corte'} na composição.`
  ];
  return Object.freeze({
    title:'Essência da composição',
    facts:Object.freeze(facts),
    prompt:spread.synthesisPrompt
  });
}

export function spreadStorageKey(spreadId) {
  return `divina-bruxa-3.tiragem.${spreadId}.v1`;
}
