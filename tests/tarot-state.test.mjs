import assert from 'node:assert/strict';
import test from 'node:test';
import { createTarotState, revealNext, shuffle, shuffleWaiting, validateTarotState } from '../lib/tarot-state.js';

const ids = Array.from({ length:78 }, (_, index) => index);

function deterministicCrypto(numbers = [3, 1, 4, 1, 5, 9, 2, 6]) {
  let index = 0;
  return {
    getRandomValues(buffer) {
      buffer[0] = numbers[index % numbers.length];
      index += 1;
      return buffer;
    }
  };
}

test('cria um círculo com 78 cartas únicas', () => {
  const state = createTarotState(ids, deterministicCrypto());
  assert.equal(state.revealed.length, 0);
  assert.equal(state.waiting.length, 78);
  assert.equal(new Set(state.waiting).size, 78);
  assert.equal(state.cursor, -1);
});

test('revela as 78 cartas sem repetição e termina com segurança', () => {
  let state = createTarotState(ids, deterministicCrypto());
  const revealed = [];
  for (let index = 0; index < 78; index += 1) {
    const result = revealNext(state);
    state = result.state;
    revealed.push(result.revealedId);
  }
  assert.equal(new Set(revealed).size, 78);
  assert.equal(state.waiting.length, 0);
  assert.equal(state.cursor, 77);
  const complete = revealNext(state);
  assert.equal(complete.revealedId, null);
  assert.strictEqual(complete.state, state);
});

test('embaralha somente as cartas ocultas e não muda as reveladas', () => {
  const original = { revealed:[4, 8, 15], waiting:[16, 23, 42], cursor:2 };
  const shuffled = shuffleWaiting(original, deterministicCrypto([1, 0]));
  assert.deepEqual(shuffled.revealed, original.revealed);
  assert.notStrictEqual(shuffled.revealed, original.revealed);
  assert.deepEqual(new Set(shuffled.waiting), new Set(original.waiting));
  assert.deepEqual(original, { revealed:[4, 8, 15], waiting:[16, 23, 42], cursor:2 });
});

test('a função de embaralhar não altera a lista recebida', () => {
  const original = [0, 1, 2, 3, 4];
  shuffle(original, deterministicCrypto());
  assert.deepEqual(original, [0, 1, 2, 3, 4]);
});

test('aceita apenas estados íntegros e limita o cursor', () => {
  const valid = validateTarotState({ revealed:[0, 1], waiting:ids.slice(2), cursor:900 }, ids);
  assert.equal(valid.cursor, 1);
  assert.equal(validateTarotState({ revealed:[0, 0], waiting:ids.slice(2), cursor:0 }, ids), null);
  assert.equal(validateTarotState({ revealed:[0], waiting:[...ids.slice(1), 999], cursor:0 }, ids), null);
  assert.equal(validateTarotState(null, ids), null);
});
