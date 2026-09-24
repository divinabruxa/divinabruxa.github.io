function randomIndex(maxExclusive, cryptoSource = globalThis.crypto) {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1) return 0;
  if (!cryptoSource?.getRandomValues) return Math.floor(Math.random() * maxExclusive);
  const range = 0x100000000;
  const ceiling = range - (range % maxExclusive);
  const buffer = new Uint32Array(1);
  let number;
  do {
    cryptoSource.getRandomValues(buffer);
    number = buffer[0];
  } while (number >= ceiling);
  return number % maxExclusive;
}

export function shuffle(values, cryptoSource = globalThis.crypto) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1, cryptoSource);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createTarotState(cardIds, cryptoSource = globalThis.crypto) {
  return { revealed:[], waiting:shuffle(cardIds, cryptoSource), cursor:-1 };
}

export function validateTarotState(candidate, cardIds) {
  if (!candidate || !Array.isArray(candidate.revealed) || !Array.isArray(candidate.waiting)) return null;
  const expected = new Set(cardIds);
  const all = [...candidate.revealed, ...candidate.waiting];
  const unique = new Set(all);
  if (all.length !== cardIds.length || unique.size !== cardIds.length || all.some(id => !expected.has(id))) return null;
  const cursor = candidate.revealed.length
    ? Math.min(Math.max(Number(candidate.cursor) || 0, 0), candidate.revealed.length - 1)
    : -1;
  return { revealed:[...candidate.revealed], waiting:[...candidate.waiting], cursor };
}

export function revealNext(state) {
  if (!state.waiting.length) return { state, revealedId:null };
  const waiting = [...state.waiting];
  const revealedId = waiting.pop();
  const revealed = [...state.revealed, revealedId];
  return {
    state: { revealed, waiting, cursor:revealed.length - 1 },
    revealedId
  };
}

export function shuffleWaiting(state, cryptoSource = globalThis.crypto) {
  return { ...state, revealed:[...state.revealed], waiting:shuffle(state.waiting, cryptoSource) };
}
