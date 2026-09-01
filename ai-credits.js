import { store } from './storage.js';
import { AI_POLICY } from './ai-policy.js';

const KEY = 'ai-credit-ledger-v5';
export function creditState() { const saved=store.get(KEY); return saved && Number.isFinite(saved.remaining) ? saved : { remaining:AI_POLICY.demoCredits, granted:AI_POLICY.demoCredits, consumed:0, entries:[] }; }
export function canSpend(mode) { const cost=AI_POLICY.modes[mode]?.cost ?? 0; return AI_POLICY.modes[mode]?.enabled !== false && creditState().remaining >= cost; }
export function spend(mode) { const cost=AI_POLICY.modes[mode]?.cost ?? 0; const current=creditState(); if(!canSpend(mode)) return false; const next={...current,remaining:current.remaining-cost,consumed:current.consumed+cost,entries:[...current.entries,{mode,cost,at:new Date().toISOString()}].slice(-100)}; store.set(KEY,next); return true; }
