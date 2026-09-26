/*
 * DIVINA BRUXA 3.7.0 · PONTE ARBÍTRIO + MOTOR DO AMOR
 *
 * O ARBÍTRIO continua criando ficção inédita. O AMOR acrescenta escuta de
 * contexto, presença afetiva e livre-arbítrio sem consultar significados das
 * cartas, sem prever e sem enviar a intenção para fora do aparelho.
 */

import {
  ARBITRIO_COMBINATION_FLOOR,
  ARBITRIO_LABEL,
  ARBITRIO_NAME,
  arbitrioCapacity as baseCapacity,
  arbitrioConversation as baseConversation,
  arbitrioForCard as baseForCard,
  arbitrioHash,
  secureArbitrioSeed
} from './arbitrio-engine-v360.js';
import {
  LOVE_ENGINE_NAME,
  LOVE_ENGINE_VERSION,
  infuseLove
} from './love-engine-v370.js';

export {
  ARBITRIO_COMBINATION_FLOOR,
  ARBITRIO_LABEL,
  ARBITRIO_NAME,
  arbitrioHash,
  secureArbitrioSeed
};

export const ARBITRIO_VERSION = LOVE_ENGINE_VERSION;

const cardIdentity = card => `${card?.canonicalId ?? card?.id ?? 'carta'}:${card?.name ?? 'Carta sem nome'}`;

export function arbitrioForCard(card, seed = secureArbitrioSeed(), options = {}) {
  const creation = baseForCard(card, seed, options);
  return infuseLove(creation, {
    input:String(options.intention || ''),
    channel:String(options.scope || 'carta'),
    seed:`${seed}:${cardIdentity(card)}:${options.moment || 'agora'}`
  });
}

export function arbitrioConversation(cards, positions = [], seed = secureArbitrioSeed(), intention = '') {
  const creation = baseConversation(cards, positions, seed, intention);
  if (!creation) return null;
  const identities = (cards || []).filter(Boolean).map(cardIdentity).join('→');
  return infuseLove(creation, {
    input:String(intention || ''),
    channel:'tiragem',
    seed:`${seed}:${identities}:concilio`
  });
}

export function arbitrioCapacity() {
  const base = baseCapacity();
  return Object.freeze({
    ...base,
    version:ARBITRIO_VERSION,
    emotionEngine:LOVE_ENGINE_NAME,
    emotionalCoherence:'contextual-local'
  });
}
