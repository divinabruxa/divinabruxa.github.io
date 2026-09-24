import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CARDS } from '../data/cards.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('a Home possui uma única imagem visual de Orbe e nenhum canvas', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const orbImages = html.match(/<img[^>]+src="assets\/orbe\.webp"/g) || [];
  assert.equal(orbImages.length, 1);
  assert.equal((html.match(/id="orb"/g) || []).length, 1);
  assert.equal((html.match(/<canvas\b/g) || []).length, 0);
});

test('não há IDs HTML duplicados', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('os recursos iniciais são locais e existem', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const references = [...html.matchAll(/(?:src|href)="([^"?]+)"/g)]
    .map(match => match[1])
    .filter(reference => !/^(?:https?:|#|mailto:)/.test(reference));
  for (const reference of references) {
    await assert.doesNotReject(stat(path.join(root, reference)), reference);
  }
});

test('as 78 cartas canônicas possuem uma imagem otimizada', async () => {
  const cardDir = path.join(root, 'assets', 'cards');
  const files = (await readdir(cardDir)).filter(file => /^card-\d{2}\.webp$/.test(file));
  assert.equal(files.length, 78);
  assert.equal(CARDS.length, 78);
  let total = 0;
  for (const card of CARDS) {
    const info = await stat(path.join(cardDir, card.image));
    total += info.size;
    assert.ok(info.size > 1_000, `${card.image} está vazio ou corrompido`);
    assert.ok(info.size < 140_000, `${card.image} excede o teto individual`);
  }
  assert.ok(total < 7 * 1024 * 1024, `as cartas somam ${total} bytes`);
});

test('movimento reduzido e safe areas fazem parte da fundação', async () => {
  const css = await readFile(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});

test('o novo service worker remove caches legados e mantém o chão offline leve', async () => {
  const [worker, manifest, info] = await Promise.all([
    readFile(path.join(root, 'sw.js'), 'utf8'),
    readFile(path.join(root, 'manifest.webmanifest'), 'utf8'),
    stat(path.join(root, 'sw.js'))
  ]);
  assert.ok(info.size < 8_000, `service worker pesa ${info.size} bytes`);
  assert.match(worker, /keys\.filter\(key => key\.startsWith\(PREFIX\) && key !== CACHE\)/);
  assert.match(worker, /cache:'no-store'/);
  assert.doesNotMatch(worker, /assets\/cards\/card-/);
  assert.doesNotMatch(worker, /assets\/skins\/skin-/);
  const data = JSON.parse(manifest);
  assert.equal(data.start_url, './#/home');
  assert.ok(data.shortcuts.every(shortcut => shortcut.url.includes('./#/')));
});

test('a Home publica metadados canônicos e uma política de conteúdo explícita', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/divinabruxa\.com\.br\/"/);
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /script-src 'self'/);
  assert.match(html, /style-src 'self' 'unsafe-inline'/);
  assert.doesNotMatch(html, /'unsafe-eval'/);
  assert.doesNotMatch(html, /script-src[^;]*'unsafe-inline'/);
});
