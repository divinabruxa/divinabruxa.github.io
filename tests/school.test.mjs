import assert from 'node:assert/strict';
import test from 'node:test';
import { CARDS } from '../data/cards.js';
import { SCHOOL_MODULES } from '../data/school.js';

test('a Escola possui dezessete módulos ordenados e únicos', () => {
  assert.equal(SCHOOL_MODULES.length, 17);
  assert.deepEqual(SCHOOL_MODULES.map(module => module.number), Array.from({ length:17 }, (_, index) => index + 1));
  assert.equal(new Set(SCHOOL_MODULES.map(module => module.id)).size, 17);
});

test('cada módulo da Escola possui conteúdo real', () => {
  for (const module of SCHOOL_MODULES) {
    assert.ok(module.title.length >= 8, module.id);
    assert.ok(module.intro.length >= 70, module.id);
    assert.equal(module.focus.length, 3, module.id);
    assert.ok(module.focus.every(item => item.length >= 10), module.id);
  }
});

test('os módulos de cartas cobrem os Maiores, os quatro naipes e a Corte', () => {
  const expected = new Map([
    ['major', 22],
    ['paus', 14],
    ['copas', 14],
    ['espadas', 14],
    ['ouros', 14]
  ]);
  for (const [filter, count] of expected) {
    const cards = filter === 'major'
      ? CARDS.filter(card => card.arcanaCode === filter)
      : CARDS.filter(card => card.suitCode === filter);
    assert.equal(cards.length, count, filter);
    assert.ok(SCHOOL_MODULES.some(module => module.cardFilter === filter), filter);
  }
  assert.equal(CARDS.filter(card => card.court).length, 16);
  assert.ok(SCHOOL_MODULES.some(module => module.cardFilter === 'court'));
});
