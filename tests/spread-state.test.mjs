import assert from 'node:assert/strict';
import test from 'node:test';
import { createSpreadState, revealSpreadPosition, SPREADS, validateSpreadState } from '../lib/spread-state.js';

const ids = Array.from({ length:78 }, (_, index) => index);
const fixedCrypto = { getRandomValues(buffer) { buffer[0] = 0; return buffer; } };

test('as cinco tiragens possuem o número correto de posições', () => {
  assert.equal(SPREADS.conselho.positions.length, 1);
  assert.equal(SPREADS['tres-tempos'].positions.length, 3);
  assert.equal(SPREADS['dois-caminhos'].positions.length, 6);
  assert.equal(SPREADS['cruz-celta'].positions.length, 10);
  assert.equal(SPREADS['mesa-real'].positions.length, 78);
});

test('uma tiragem revela somente cartas únicas até completar', () => {
  let state = createSpreadState('cruz-celta', ids, fixedCrypto);
  const revealed = [];
  for (let index = 0; index < 10; index += 1) {
    const result = revealSpreadPosition(state);
    state = result.state;
    revealed.push(result.cardId);
  }
  assert.equal(revealed.length, 10);
  assert.equal(new Set(revealed).size, 10);
  assert.equal(state.revealed, 10);
  assert.equal(revealSpreadPosition(state).cardId, null);
});

test('a Mesa Real usa as 78 cartas em treze por seis', () => {
  let state = createSpreadState('mesa-real', ids, fixedCrypto);
  const revealed = [];
  while (state.revealed < 78) {
    const result = revealSpreadPosition(state);
    state = result.state;
    revealed.push(result.cardId);
  }
  assert.equal(new Set(revealed).size, 78);
});

test('estados corrompidos são recusados e a intenção é limitada', () => {
  const valid = validateSpreadState({
    spreadId:'conselho',
    order:ids,
    revealed:9,
    intention:'x'.repeat(300)
  }, ids);
  assert.equal(valid.revealed, 1);
  assert.equal(valid.intention.length, 180);
  assert.equal(validateSpreadState({ spreadId:'conselho', order:[0, 0], revealed:0 }, ids), null);
  assert.equal(validateSpreadState({ spreadId:'inexistente', order:ids, revealed:0 }, ids), null);
});
