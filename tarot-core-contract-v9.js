/* DIVINA BRUXA — CONTRATO CANÔNICO DO TAROT LIVRE V9 */
import {
  CARD_IDS, DECK_SIZE, createTarotState, drawNextCard, resetTarotState,
  shuffleRemainingCards, normalizeTarotState
} from './tarot-session.js';

export const TAROT_FREE_CONTRACT='v9.4';
export const TAROT_RULES=Object.freeze({cards:78,rows:13,columns:6,orientation:'normal',repetition:false,meanings:false});
export const MESA_REAL_SLOTS=Object.freeze(Array.from({length:DECK_SIZE},(_,index)=>Object.freeze({index,row:Math.floor(index/6)+1,column:index%6+1})));
export const assertTarotContract=state=>{
  const valid=normalizeTarotState(state);
  if(!valid||valid.normalOnly!==true||valid.waiting.length+valid.revealed.length!==DECK_SIZE)return false;
  return new Set([...valid.waiting,...valid.revealed]).size===DECK_SIZE;
};
export const createFreeTarot=options=>createTarotState(options);
export const revealNext=(state,options)=>drawNextCard(state,options);
export const reshuffleRemaining=(state,options)=>shuffleRemainingCards(state,options);
export const resetFreeTarot=options=>resetTarotState(options);
export const mesaPosition=index=>MESA_REAL_SLOTS[index]||null;
export {CARD_IDS,DECK_SIZE};
