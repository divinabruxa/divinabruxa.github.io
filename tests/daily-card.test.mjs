import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyCardIndex, dailyStorageKey, dateKeyInTimeZone } from '../lib/daily-card.js';

test('a virada diária obedece à meia-noite de Brasília', () => {
  assert.equal(dateKeyInTimeZone(new Date('2026-09-25T02:59:59Z')), '2026-09-24');
  assert.equal(dateKeyInTimeZone(new Date('2026-09-25T03:00:00Z')), '2026-09-25');
});

test('a mesma data sempre produz a mesma carta direta', () => {
  const first = dailyCardIndex('2026-09-24', 78);
  const second = dailyCardIndex('2026-09-24', 78);
  assert.equal(first, second);
  assert.ok(first >= 0 && first < 78);
});

test('datas e tamanhos inválidos são rejeitados', () => {
  assert.throws(() => dailyCardIndex('24/09/2026', 78), /inválida/);
  assert.throws(() => dailyCardIndex('2026-09-24', 0), /inválida/);
});

test('a chave de persistência é isolada por ciclo', () => {
  assert.equal(dailyStorageKey('2026-09-24'), 'divina-bruxa-3.carta-do-dia.2026-09-24');
});
