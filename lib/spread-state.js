import { shuffle } from './tarot-state.js';

const makeRoyalPositions = () => Array.from({ length:78 }, (_, index) => `Posição ${index + 1}`);

export const SPREADS = Object.freeze({
  conselho: Object.freeze({
    id:'conselho',
    name:'Conselho',
    eyebrow:'UMA LUZ',
    positions:Object.freeze(['Conselho para o agora'])
  }),
  'tres-tempos': Object.freeze({
    id:'tres-tempos',
    name:'Três Tempos',
    eyebrow:'MOVIMENTO',
    positions:Object.freeze(['Origem', 'Agora', 'Próximo movimento'])
  }),
  'dois-caminhos': Object.freeze({
    id:'dois-caminhos',
    name:'Dois Caminhos',
    eyebrow:'ESCOLHA CONSCIENTE',
    positions:Object.freeze([
      'Você diante da escolha',
      'Caminho A · potência',
      'Caminho A · desafio',
      'Caminho B · potência',
      'Caminho B · desafio',
      'Critério de integração'
    ])
  }),
  'cruz-celta': Object.freeze({
    id:'cruz-celta',
    name:'Cruz Celta',
    eyebrow:'DEZ POSIÇÕES',
    positions:Object.freeze([
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
    ])
  }),
  'mesa-real': Object.freeze({
    id:'mesa-real',
    name:'Mesa Real',
    eyebrow:'TREZE POR SEIS',
    positions:Object.freeze(makeRoyalPositions())
  })
});

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

export function spreadStorageKey(spreadId) {
  return `divina-bruxa-3.tiragem.${spreadId}.v1`;
}
