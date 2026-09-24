import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function walkFiles(directory = root) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walkFiles(absolute));
    else output.push(absolute);
  }
  return output;
}

test('o corte público preserva as 320 páginas e o domínio oficial', async () => {
  const rootFiles = await readdir(root);
  assert.equal(rootFiles.filter(file => file.endsWith('.html')).length, 320);
  assert.equal((await readFile(path.join(root, 'CNAME'), 'utf8')).trim(), 'divinabruxa.com.br');
  assert.equal(rootFiles.some(file => /^00-(?:INSTALE|LEIA)/.test(file)), false);
  assert.equal(rootFiles.includes('laboratorio-fisico-v547.html'), false);
});

test('toda referência local declarada pelas páginas públicas existe', async () => {
  const htmlFiles = (await readdir(root)).filter(file => file.endsWith('.html'));
  const missing = [];
  for (const file of htmlFiles) {
    const html = await readFile(path.join(root, file), 'utf8');
    const references = [...html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/gi)].map(match => match[1]);
    for (const raw of references) {
      if (!raw || /^(?:[a-z]+:|\/\/|#|data:|mailto:|tel:|javascript:)/i.test(raw)) continue;
      const clean = raw.split('#')[0].split('?')[0];
      const relative = !clean || clean === '.' || clean === './' || clean === '/' ? 'index.html' : clean.replace(/^\.\//, '').replace(/^\//, '');
      try { await stat(path.join(root, relative)); }
      catch { missing.push(`${file} → ${raw}`); }
    }
  }
  assert.deepEqual(missing, []);
});

test('folhas de estilo e módulos não apontam para arquivos removidos', async () => {
  const missing = [];
  for (const absolute of await walkFiles()) {
    const extension = path.extname(absolute);
    if (!['.css', '.js', '.mjs'].includes(extension)) continue;
    const source = await readFile(absolute, 'utf8');
    const references = [];
    if (extension === '.css') {
      for (const match of source.matchAll(/(?:url\(\s*|@import\s+)(?:url\(\s*)?["']?([^"'\s)]+)["']?\s*\)?/g)) references.push(match[1]);
    } else {
      for (const match of source.matchAll(/(?:import\s*(?:\(|[^"']*?\s+from\s+)?|export\s+[^"']*?\s+from\s+|importScripts\s*\()["']([^"']+)["']/g)) references.push(match[1]);
    }
    for (const raw of references) {
      if (!raw.startsWith('.')) continue;
      const target = path.resolve(path.dirname(absolute), raw.split('?')[0].split('#')[0]);
      try { await stat(target); }
      catch { missing.push(`${path.relative(root, absolute)} → ${raw}`); }
    }
  }
  assert.deepEqual(missing, []);
});

test('as páginas SEO e o aplicativo compartilham uma única coleção leve de 78 cartas', async () => {
  const rootFiles = await readdir(root);
  assert.equal(rootFiles.some(file => /^card-\d{2}\.webp$/.test(file)), false);
  const cardDir = path.join(root, 'assets', 'cards');
  const cards = (await readdir(cardDir)).filter(file => /^card-\d{2}\.webp$/.test(file));
  assert.equal(cards.length, 78);
  for (const card of cards) assert.ok((await stat(path.join(cardDir, card))).size > 1_000, card);
  const sitemap = await readFile(path.join(root, 'sitemap-cartas.xml'), 'utf8');
  assert.equal((sitemap.match(/\/assets\/cards\/card-\d{2}\.webp/g) || []).length, 78);
  assert.doesNotMatch(sitemap, /\.com\.br\/card-\d{2}\.webp/);
});

test('a ponte PWA pública não reabre a cadeia de módulos legados', async () => {
  const [bridge, compatibility] = await Promise.all([
    readFile(path.join(root, 'pwa-world-v324.js'), 'utf8'),
    readFile(path.join(root, 'pwa-world-v196.js'), 'utf8')
  ]);
  assert.ok(Buffer.byteLength(bridge) < 6_000);
  assert.match(bridge, /\.\/sw\.js\?v=/);
  assert.doesNotMatch(bridge, /performance-world|responsive-enchantment|pwa-performance-recovery/);
  assert.match(compatibility, /pwa-world-v324\.js\?v=3\.0\.0/);
});

test('o repositório preserva somente as funções ativas sem segredos incorporados', async () => {
  const slugs = [
    'admin-api',
    'consultations-booking',
    'consultations-email-webhook-v188',
    'memoji-videos-v626'
  ];
  for (const slug of slugs) {
    const source = await readFile(path.join(root, 'supabase', 'functions', slug, 'index.ts'), 'utf8');
    assert.match(source, /Deno\.env\.get/);
    assert.doesNotMatch(source, /\b(?:sk_live_|sk_test_)[A-Za-z0-9_-]+/);
    assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+["']/);
  }
});

test('manifesto e chão offline usam somente arquivos existentes', async () => {
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) await stat(path.join(root, icon.src.replace(/^\.\//, '')));
  const serviceWorker = await readFile(path.join(root, 'sw.js'), 'utf8');
  const coreFiles = [...serviceWorker.matchAll(/["']\.\/([^"']*)["']/g)].map(match => match[1] || 'index.html');
  assert.equal(coreFiles.length, 31);
  for (const file of coreFiles) await stat(path.join(root, file));
});
