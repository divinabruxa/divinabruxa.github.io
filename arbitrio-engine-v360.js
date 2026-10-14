/** Gerador antigo aposentado. Utilidades neutras mantêm compatibilidade de nomes. */
export { whitHash as arbitrioHash, secureWhitSeed as secureArbitrioSeed } from './whit-alma-divina-utils-v1.js';
export const ARBITRIO_NAME='APOSENTADO';
export const ARBITRIO_VERSION='retired-1';
export const ARBITRIO_LABEL='Use Whit Alma Divina';
export const ARBITRIO_COMBINATION_FLOOR=Object.freeze([]);
export function arbitrioForCard(){throw new Error('Gerador de Arbítrio aposentado. Use whitTarotReading em whit-alma-divina-core-v1.js.');}
export function arbitrioConversation(){throw new Error('Gerador de Arbítrio aposentado. Use whitTarotReading em whit-alma-divina-core-v1.js.');}
export function arbitrioCapacity(){return Object.freeze({active:false,retired:true,version:ARBITRIO_VERSION});}
