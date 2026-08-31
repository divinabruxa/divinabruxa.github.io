/* DIVINA BRUXA — NÚCLEO PURO DO TAROT LIVRE — CHECKPOINT 2.1
   Uma sessão íntegra, persistente e sempre normal para as 78 cartas.
*/
import { CARDS } from './tarot-data.js';

export const TAROT_SESSION_SCHEMA = '5.2.1';
export const DECK_SIZE = 78;
export const CARD_IDS = Object.freeze(CARDS.map(card => card.id));

const CARD_ID_SET = new Set(CARD_IDS);
const UINT32_RANGE = 0x100000000;

if (CARD_IDS.length !== DECK_SIZE || CARD_ID_SET.size !== DECK_SIZE) {
  throw new Error('O catálogo canônico precisa conter exatamente 78 IDs únicos.');
}

function nowValue(now) {
  const value = typeof now === 'function' ? now() : now;
  return Number.isFinite(value) ? Number(value) : Date.now();
}

function sessionId(timestamp) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
  return `tarot-${timestamp.toString(36)}-${seed}`;
}

function validPartition(waiting, revealed) {
  if (!Array.isArray(waiting) || !Array.isArray(revealed)) return false;
  const completeDeck = [...revealed, ...waiting];
  return completeDeck.length === DECK_SIZE
    && new Set(completeDeck).size === DECK_SIZE
    && completeDeck.every(id => Number.isInteger(id) && CARD_ID_SET.has(id));
}

export function secureRandomInt(max) {
  if (!Number.isInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError('O limite aleatório precisa ser um inteiro positivo de até 2³².');
  }

  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) return Math.floor(Math.random() * max);

  const acceptedRange = Math.floor(UINT32_RANGE / max) * max;
  const sample = new Uint32Array(1);
  do cryptoApi.getRandomValues(sample); while (sample[0] >= acceptedRange);
  return sample[0] % max;
}

export function shuffleIds(ids, randomInt = secureRandomInt) {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const destination = Number(randomInt(index + 1));
    if (!Number.isInteger(destination) || destination < 0 || destination > index) {
      throw new RangeError('A fonte aleatória devolveu uma posição inválida.');
    }
    [shuffled[index], shuffled[destination]] = [shuffled[destination], shuffled[index]];
  }
  return shuffled;
}

export function createTarotState({ randomInt = secureRandomInt, now = Date.now } = {}) {
  const timestamp = nowValue(now);
  return {
    schemaVersion: TAROT_SESSION_SCHEMA,
    sessionId: sessionId(timestamp),
    normalOnly: true,
    waiting: shuffleIds(CARD_IDS, randomInt),
    revealed: [],
    completed: false,
    revision: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function normalizeTarotState(candidate, { now = Date.now } = {}) {
  if (!candidate || !validPartition(candidate.waiting, candidate.revealed)) return null;
  const timestamp = nowValue(now);
  const createdAt = Number.isFinite(candidate.createdAt) ? Number(candidate.createdAt) : timestamp;
  const updatedAt = Number.isFinite(candidate.updatedAt) ? Number(candidate.updatedAt) : createdAt;
  const revision = Number.isInteger(candidate.revision) && candidate.revision >= 0
    ? candidate.revision
    : candidate.revealed.length;

  return {
    schemaVersion: TAROT_SESSION_SCHEMA,
    sessionId: typeof candidate.sessionId === 'string' && candidate.sessionId.trim()
      ? candidate.sessionId
      : sessionId(createdAt),
    normalOnly: true,
    waiting: [...candidate.waiting],
    revealed: [...candidate.revealed],
    completed: candidate.waiting.length === 0,
    revision,
    createdAt,
    updatedAt
  };
}

export function isValidTarotState(candidate) {
  if (!candidate || candidate.schemaVersion !== TAROT_SESSION_SCHEMA || candidate.normalOnly !== true) return false;
  if (typeof candidate.sessionId !== 'string' || !candidate.sessionId.trim()) return false;
  if (!Number.isInteger(candidate.revision) || candidate.revision < 0) return false;
  if (!Number.isFinite(candidate.createdAt) || !Number.isFinite(candidate.updatedAt)) return false;
  if (!validPartition(candidate.waiting, candidate.revealed)) return false;
  return candidate.completed === (candidate.waiting.length === 0);
}

function requireState(state, now) {
  const normalized = normalizeTarotState(state, { now });
  if (!normalized) throw new TypeError('Sessão de Tarot Livre inválida.');
  return normalized;
}

export function drawNextCard(state, { now = Date.now } = {}) {
  const current = requireState(state, now);
  if (current.waiting.length === 0) {
    return { state: current, cardId: null, position: -1 };
  }

  const timestamp = nowValue(now);
  const cardId = current.waiting[0];
  const waiting = current.waiting.slice(1);
  const revealed = [...current.revealed, cardId];
  return {
    cardId,
    position: revealed.length - 1,
    state: {
      ...current,
      waiting,
      revealed,
      completed: waiting.length === 0,
      revision: current.revision + 1,
      updatedAt: timestamp
    }
  };
}

export function shuffleRemainingCards(state, { randomInt = secureRandomInt, now = Date.now } = {}) {
  const current = requireState(state, now);
  if (current.waiting.length < 2) return current;
  return {
    ...current,
    waiting: shuffleIds(current.waiting, randomInt),
    revision: current.revision + 1,
    updatedAt: nowValue(now)
  };
}

export function resetTarotState(options = {}) {
  return createTarotState(options);
}

export function serializeTarotState(state) {
  const normalized = requireState(state, Date.now);
  return JSON.stringify(normalized);
}

export function restoreTarotState(serialized, options = {}) {
  if (typeof serialized !== 'string' || !serialized.trim()) return null;
  try { return normalizeTarotState(JSON.parse(serialized), options); }
  catch { return null; }
}
