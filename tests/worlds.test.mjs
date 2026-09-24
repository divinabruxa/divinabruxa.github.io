import assert from 'node:assert/strict';
import test from 'node:test';
import { CATEGORY_LABELS, WORLDS } from '../data/worlds.js';

test('o mapa vivo contém as quinze realidades previstas', () => {
  assert.equal(Object.keys(WORLDS).length, 15);
  assert.deepEqual(Object.keys(CATEGORY_LABELS).sort(), ['creations','encounter','home','oracles','wisdom']);
});

test('toda realidade tem identidade, descrição, sigilo e cor válidos', () => {
  for (const [route, world] of Object.entries(WORLDS)) {
    assert.match(route, /^[a-z0-9-]+$/);
    assert.ok(CATEGORY_LABELS[world.category]);
    assert.ok(world.label.length > 0);
    assert.ok(world.title.length > 0);
    assert.ok(world.description.length > 20);
    assert.ok(world.sigil.length > 0);
    assert.match(world.color, /^\d{1,3} \d{1,3} \d{1,3}$/);
  }
});

test('cada ponta do pentagrama possui ao menos um destino', () => {
  for (const category of Object.keys(CATEGORY_LABELS)) {
    assert.ok(Object.values(WORLDS).some(world => world.category === category), category);
  }
});

test('a reconstrução declara os quatorze destinos como mundos funcionais', () => {
  const implemented = Object.entries(WORLDS).filter(([, world]) => world.implemented).map(([route]) => route);
  assert.deepEqual(implemented, ['tarot', 'carta-do-dia', 'tiragens', 'escola', 'biblioteca', 'diario', 'whit', 'consultas', 'premium', 'conta', 'loja', 'musica', 'videos', 'skins']);
});
