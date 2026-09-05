/* DIVINA BRUXA — LEDGER LOCAL DEMONSTRATIVO DA ORBE IA V141
   Produção exige ledger imutável e saldo derivados no servidor seguro. */

import { store } from './storage.js';
import { AI_POLICY, AI_LEDGER_KEY } from './ai-policy.js?v=141';

const LEGACY_KEY = 'ai-credit-ledger-v5';
const allowedPack = amount => AI_POLICY.packs.some(pack => pack.credits === Number(amount));
const createId = prefix => globalThis.crypto?.randomUUID
  ? `${prefix}-${crypto.randomUUID()}`
  : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const todayKey = value => {
  const date = new Date(value || Date.now());
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

function seedState() {
  const at = new Date().toISOString();
  return {
    schemaVersion: '7.0.0',
    sandbox: true,
    balance: AI_POLICY.demoCredits,
    granted: AI_POLICY.demoCredits,
    consumed: 0,
    entries: [{ id: createId('credit'), type: 'demo-grant', credits: AI_POLICY.demoCredits, reason: 'controlled-demo', at, balanceAfter: AI_POLICY.demoCredits }]
  };
}

function migrateLegacy() {
  const legacy = store.get(LEGACY_KEY);
  if (!legacy || !Number.isFinite(legacy.remaining)) return seedState();
  const balance = Math.max(0, Math.floor(legacy.remaining));
  const granted = Math.max(balance, Math.floor(Number(legacy.granted) || AI_POLICY.demoCredits));
  const consumed = Math.max(0, Math.floor(Number(legacy.consumed) || granted - balance));
  return {
    schemaVersion: '7.0.0', sandbox: true, balance, granted, consumed,
    entries: [{ id: createId('migration'), type: 'migration', credits: balance, reason: 'v5-to-v141', at: new Date().toISOString(), balanceAfter: balance }]
  };
}

function normalize(value) {
  if (!value || !Number.isFinite(value.balance) || !Array.isArray(value.entries)) return migrateLegacy();
  return {
    schemaVersion: '7.0.0',
    sandbox: true,
    balance: Math.max(0, Math.floor(value.balance)),
    granted: Math.max(0, Math.floor(Number(value.granted) || 0)),
    consumed: Math.max(0, Math.floor(Number(value.consumed) || 0)),
    entries: value.entries.filter(entry => entry && typeof entry === 'object').slice(-250).map(entry => ({
      id: String(entry.id || createId('ledger')).slice(0, 160),
      type: String(entry.type || 'legacy').slice(0, 40),
      mode: entry.mode && AI_POLICY.modes[entry.mode] ? entry.mode : undefined,
      credits: Math.max(0, Math.floor(Number(entry.credits) || 0)),
      reason: String(entry.reason || 'sandbox').slice(0, 80),
      receiptId: entry.receiptId ? String(entry.receiptId).slice(0, 160) : undefined,
      at: Number.isNaN(new Date(entry.at).getTime()) ? new Date().toISOString() : new Date(entry.at).toISOString(),
      balanceAfter: Math.max(0, Math.floor(Number(entry.balanceAfter) || 0))
    }))
  };
}

function persist(next) {
  store.set(AI_LEDGER_KEY, next);
  return creditState();
}

export function creditState() {
  const existing = store.get(AI_LEDGER_KEY);
  const state = normalize(existing);
  if (!existing) store.set(AI_LEDGER_KEY, state);
  return Object.freeze({ ...state, remaining: state.balance, entries: Object.freeze(state.entries.map(entry => Object.freeze({ ...entry }))) });
}

export function creditUsage(state = creditState(), now = new Date()) {
  const today = todayKey(now);
  const todayConsumed = state.entries.filter(entry => entry.type === 'debit' && todayKey(entry.at) === today).reduce((sum, entry) => sum + entry.credits, 0);
  return Object.freeze({ todayConsumed, todayRemaining: Math.max(0, AI_POLICY.limits.dailyCredits - todayConsumed) });
}

export function canSpend(mode) {
  const selected = AI_POLICY.modes[mode];
  if (!selected || selected.enabled === false || selected.cost <= 0) return false;
  const state = creditState();
  const usage = creditUsage(state);
  return state.balance >= selected.cost && usage.todayRemaining >= selected.cost;
}

export function spend(mode, receiptId = createId('receipt')) {
  const selected = AI_POLICY.modes[mode];
  if (!selected || selected.enabled === false || selected.cost <= 0) return false;
  const current = creditState();
  if (current.entries.some(entry => entry.receiptId === receiptId)) return true;
  if (!canSpend(mode)) return false;
  const balance = current.balance - selected.cost;
  persist({
    ...current,
    balance,
    consumed: current.consumed + selected.cost,
    entries: [...current.entries, { id: createId('debit'), type: 'debit', mode, credits: selected.cost, reason: 'successful-response', receiptId, at: new Date().toISOString(), balanceAfter: balance }].slice(-250)
  });
  return true;
}

export function grantCredits(amount, source = 'sandbox-pack') {
  const credits = Math.floor(Number(amount));
  if (!allowedPack(credits) || source !== 'sandbox-pack') return false;
  const current = creditState();
  const balance = current.balance + credits;
  persist({
    ...current,
    balance,
    granted: current.granted + credits,
    entries: [...current.entries, { id: createId('grant'), type: 'sandbox-pack', credits, reason: 'explicit-two-step-confirmation', at: new Date().toISOString(), balanceAfter: balance }].slice(-250)
  });
  return true;
}
