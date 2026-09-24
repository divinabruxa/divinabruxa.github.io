import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => readFile(path.join(root, relative), 'utf8');

test('as quatro realidades de Sabedoria possuem seções próprias e são ativadas pelo roteador', async () => {
  const [html, app] = await Promise.all([read('index.html'), read('app.js')]);
  for (const [route, section, title] of [
    ['escola', 'school', 'schoolTitle'],
    ['biblioteca', 'library', 'libraryTitle'],
    ['diario', 'journal', 'journalTitle'],
    ['whit', 'whit', 'whitTitle']
  ]) {
    assert.match(html, new RegExp(`id="${section}"[^>]+data-world="${route}"[^>]+aria-labelledby="${title}"`), route);
    assert.match(app, new RegExp(`if \\(next === '${route}'\\) \\w+\\.activate\\(\\)`), route);
  }
});

test('Diário e Whit permanecem locais e não chamam APIs remotas', async () => {
  const [journal, whit] = await Promise.all([read('worlds/journal.js'), read('worlds/whit.js')]);
  assert.match(journal, /localStorage/);
  assert.match(whit, /localStorage/);
  assert.doesNotMatch(journal, /\bfetch\s*\(/);
  assert.doesNotMatch(whit, /\bfetch\s*\(/);
  assert.doesNotMatch(journal, /https?:\/\//);
  assert.doesNotMatch(whit, /https?:\/\//);
});

test('ações destrutivas locais exigem confirmação em dois toques', async () => {
  const [journal, whit] = await Promise.all([read('worlds/journal.js'), read('worlds/whit.js')]);
  assert.match(journal, /Confirmar exclusão/);
  assert.match(whit, /Confirmar limpeza/);
});

test('a Biblioteca preserva a ponte para páginas públicas sem duplicar a Orbe', async () => {
  const [html, library] = await Promise.all([read('index.html'), read('worlds/library.js')]);
  assert.match(html, /id="dialogPublicLink"/);
  assert.match(library, /cardPublicHref/);
  assert.equal((html.match(/id="orb"/g) || []).length, 1);
});
