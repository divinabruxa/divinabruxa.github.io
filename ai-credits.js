/* DIVINA BRUXA — ESPELHO DO LEDGER DE SERVIDOR V190
   O navegador apenas exibe o último snapshot; nunca concede ou debita créditos. */

import { AI_POLICY } from './ai-policy.js?v=190';

let snapshot = null;

const integer = value => Math.max(0, Math.floor(Number(value) || 0));
const iso = value => {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeLedger = value => (Array.isArray(value) ? value : []).slice(0, 20).map(entry => Object.freeze({
  id:String(entry?.id ?? '').slice(0, 80),
  requestId:String(entry?.requestId ?? '').slice(0, 80),
  bucket:['monthly','extra','demo'].includes(entry?.bucket) ? entry.bucket : 'demo',
  delta:Number.isFinite(Number(entry?.delta)) ? Math.trunc(Number(entry.delta)) : 0,
  reason:String(entry?.reason ?? '').slice(0, 40),
  createdAt:iso(entry?.createdAt)
})).filter(entry => entry.delta !== 0 && entry.createdAt);

export function emptyCreditState() {
  return Object.freeze({
    authoritative:false,
    enabled:false,
    providerConfigured:false,
    balance:null,
    monthly:0,
    extra:0,
    demo:0,
    consumedToday:0,
    todayRemaining:AI_POLICY.limits.dailyCredits,
    ledgerCount:0,
    ledger:Object.freeze([]),
    limits:AI_POLICY.limits,
    updatedAt:null
  });
}

export function acceptServerCreditState(payload) {
  const wallet = payload?.wallet && typeof payload.wallet === 'object' ? payload.wallet : {};
  const usage = payload?.usage && typeof payload.usage === 'object' ? payload.usage : {};
  const limits = payload?.limits && typeof payload.limits === 'object' ? payload.limits : {};
  snapshot = Object.freeze({
    authoritative:true,
    enabled:payload?.enabled === true,
    providerConfigured:payload?.provider?.configured === true,
    balance:integer(wallet.total ?? payload?.balance),
    monthly:integer(wallet.monthly),
    extra:integer(wallet.extra),
    demo:integer(wallet.demo),
    consumedToday:integer(usage.todayCredits),
    todayRemaining:integer(usage.todayRemaining),
    ledgerCount:integer(payload?.ledgerCount),
    ledger:Object.freeze(normalizeLedger(payload?.ledger)),
    limits:Object.freeze({
      requestsPerMinute:integer(limits.requestsPerMinute) || AI_POLICY.limits.requestsPerMinute,
      dailyCredits:integer(limits.dailyCredits) || AI_POLICY.limits.dailyCredits,
      maxMessageCharacters:integer(limits.maxInputCharacters) || AI_POLICY.limits.maxMessageCharacters,
      maxContextMessages:integer(limits.maxHistoryMessages) || AI_POLICY.limits.maxContextMessages,
      maxContextCharacters:integer(limits.maxContextCharacters) || AI_POLICY.limits.maxContextCharacters
    }),
    updatedAt:iso(payload?.serverTime) || new Date().toISOString()
  });
  return snapshot;
}

export function creditState() {
  return snapshot || emptyCreditState();
}

export function clearCreditState() {
  snapshot = null;
  return emptyCreditState();
}
