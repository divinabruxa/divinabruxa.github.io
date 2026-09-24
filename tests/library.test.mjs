import assert from 'node:assert/strict';
import test from 'node:test';
import { CARDS } from '../data/cards.js';
import { LIBRARY_GUIDES } from '../data/library.js';
import { cardPublicHref } from '../worlds/library.js';

test('a Biblioteca possui quatorze guias editoriais únicos', () => {
  assert.equal(LIBRARY_GUIDES.length, 14);
  assert.equal(new Set(LIBRARY_GUIDES.map(guide => guide.href)).size, 14);
  for (const guide of LIBRARY_GUIDES) {
    assert.match(guide.href, /^[a-z0-9-]+\.html$/);
    assert.ok(guide.title.length >= 8);
    assert.ok(guide.description.length >= 35);
  }
});

test('as 78 cartas apontam para 78 páginas públicas distintas', () => {
  const routes = CARDS.map(cardPublicHref);
  assert.equal(routes.length, 78);
  assert.equal(new Set(routes).size, 78);
  assert.ok(routes.includes('carta-00-o-louco.html'));
  assert.ok(routes.includes('carta-as-de-copas.html'));
  assert.ok(routes.includes('carta-rei-de-ouros.html'));
  assert.ok(routes.every(route => /^carta-[a-z0-9-]+\.html$/.test(route)));
});
