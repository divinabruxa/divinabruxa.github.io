/* DIVINA BRUXA — NÚCLEO IMUTÁVEL DO TAROT LIVRE — CHECKPOINT 2.2.1
   78 cartas normais, sem repetição, retomada segura e embaralhamento somente das restantes.
*/
export const TAROT_SESSION_SCHEMA = '5.2.1';
export const DECK_SIZE = 78;
export const CARD_IDS = Object.freeze(Array.from({ length: DECK_SIZE }, (_, index) => index));
export const TAROT_BACKUP_KIND = 'divina-bruxa-tarot-livre';
export const TAROT_BACKUP_VERSION = 1;

const secureRandomInt = max => {
  if (!Number.isInteger(max) || max < 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const ceiling = Math.floor(0x100000000 / max) * max;
    const bucket = new Uint32Array(1);
    do globalThis.crypto.getRandomValues(bucket); while (bucket[0] >= ceiling);
    return bucket[0] % max;
  }
  return Math.floor(Math.random() * max);
};

const makeSessionId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `tarot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const integerTime = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : Date.now();

export function shuffleIds(source, randomInt = secureRandomInt) {
  const shuffled = [...source];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.max(0, Math.min(index, Number(randomInt(index + 1)) || 0));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

export function createTarotState({ randomInt = secureRandomInt, now = Date.now, sessionId = makeSessionId() } = {}) {
  const timestamp = integerTime(now());
  return {
    schema: TAROT_SESSION_SCHEMA,
    sessionId,
    revision: 0,
    normalOnly: true,
    waiting: shuffleIds(CARD_IDS, randomInt),
    revealed: [],
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function isValidTarotState(candidate) {
  if (!candidate || typeof candidate !== 'object') return false;
  if (!Array.isArray(candidate.waiting) || !Array.isArray(candidate.revealed)) return false;
  if (candidate.waiting.length + candidate.revealed.length !== DECK_SIZE) return false;
  const all = [...candidate.revealed, ...candidate.waiting];
  if (new Set(all).size !== DECK_SIZE || all.some(id => !Number.isInteger(id) || id < 0 || id >= DECK_SIZE)) return false;
  if (candidate.normalOnly !== true) return false;
  if (candidate.completed !== (candidate.waiting.length === 0)) return false;
  if (typeof candidate.sessionId !== 'string' || !candidate.sessionId) return false;
  return Number.isInteger(candidate.revision) && candidate.revision >= 0;
}

export function normalizeTarotState(candidate, { now = Date.now } = {}) {
  if (!candidate || typeof candidate !== 'object') return null;
  const waiting = Array.isArray(candidate.waiting) ? candidate.waiting.map(Number) : null;
  const revealed = Array.isArray(candidate.revealed) ? candidate.revealed.map(Number) : null;
  if (!waiting || !revealed) return null;
  const normalized = {
    schema: TAROT_SESSION_SCHEMA,
    sessionId: typeof candidate.sessionId === 'string' && candidate.sessionId ? candidate.sessionId : makeSessionId(),
    revision: Number.isInteger(candidate.revision) && candidate.revision >= 0 ? candidate.revision : revealed.length,
    normalOnly: true,
    waiting,
    revealed,
    completed: waiting.length === 0,
    createdAt: integerTime(candidate.createdAt),
    updatedAt: integerTime(candidate.updatedAt ?? now())
  };
  return isValidTarotState(normalized) ? normalized : null;
}

export function drawNextCard(state, { now = Date.now } = {}) {
  const valid = normalizeTarotState(state, { now });
  if (!valid || valid.completed) return { state: valid ?? createTarotState({ now }), cardId: null, position: -1 };
  const [cardId, ...waiting] = valid.waiting;
  const revealed = [...valid.revealed, cardId];
  const next = {
    ...valid,
    revision: valid.revision + 1,
    waiting,
    revealed,
    completed: waiting.length === 0,
    updatedAt: integerTime(now())
  };
  return { state: next, cardId, position: revealed.length - 1 };
}

export function shuffleRemainingCards(state, { randomInt = secureRandomInt, now = Date.now } = {}) {
  const valid = normalizeTarotState(state, { now });
  if (!valid || valid.waiting.length < 2) return valid;
  return {
    ...valid,
    revision: valid.revision + 1,
    waiting: shuffleIds(valid.waiting, randomInt),
    updatedAt: integerTime(now())
  };
}

export function resetTarotState(options = {}) {
  return createTarotState(options);
}

export function serializeTarotState(state) {
  const valid = normalizeTarotState(state);
  return valid ? JSON.stringify(valid) : '';
}

export function restoreTarotState(serialized, options = {}) {
  try { return normalizeTarotState(JSON.parse(serialized), options); }
  catch { return null; }
}

export function compareTarotStates(left, right) {
  const a = normalizeTarotState(left);
  const b = normalizeTarotState(right);
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  if (a.sessionId === b.sessionId && a.revision !== b.revision) return a.revision > b.revision ? 1 : -1;
  if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? 1 : -1;
  if (a.revealed.length !== b.revealed.length) return a.revealed.length > b.revealed.length ? 1 : -1;
  return a.sessionId.localeCompare(b.sessionId);
}

export function createTarotBackup(state, { now = Date.now } = {}) {
  const normalized = normalizeTarotState(state, { now });
  if (!normalized) return '';
  return JSON.stringify({
    kind: TAROT_BACKUP_KIND,
    version: TAROT_BACKUP_VERSION,
    exportedAt: integerTime(now()),
    state: normalized
  }, null, 2);
}

export function restoreTarotBackup(serialized, { now = Date.now } = {}) {
  try {
    const backup = JSON.parse(serialized);
    if (backup?.kind !== TAROT_BACKUP_KIND || backup?.version !== TAROT_BACKUP_VERSION) return null;
    const state = normalizeTarotState(backup.state, { now });
    if (!state) return null;
    return {
      ...state,
      revision: state.revision + 1,
      updatedAt: integerTime(now())
    };
  } catch { return null; }
}
