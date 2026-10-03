import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
const root = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, root), 'utf8');
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

test('sitemaps públicos não incluem duplicatas, páginas ausentes ou bloqueadas', async () => {
  const maps = locations(await read('sitemap.xml'));
  const urls = [];
  for (const map of maps) {
    const parsed = new URL(map);
    assert.equal(parsed.origin, 'https://divinabruxa.com.br');
    urls.push(...locations(await read(parsed.pathname.slice(1))));
  }
  assert.ok(urls.length >= 316, 'preservar a cobertura pública');
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://divinabruxa.com.br');
    const html = await read(parsed.pathname.slice(1) || 'index.html');
    const robots = [...html.matchAll(/<meta\b[^>]*>/gi)].find(([tag]) => /name=["']robots["']/i.test(tag))?.[0] || '';
    assert.doesNotMatch(robots, /noindex/i, url);
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].find(([tag]) => /rel=["']canonical["']/i.test(tag))?.[0] || '';
    assert.ok(canonical.includes(`href="${url}"`) || canonical.includes(`href='${url}'`), `${url}: canonical divergente`);
    for (const [, raw] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      assert.doesNotThrow(() => JSON.parse(raw), `${url}: JSON-LD inválido`);
    }
  }
});

test('robots permite o rastreamento e declara o sitemap oficial', async () => {
  const robots = await read('robots.txt');
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/divinabruxa\.com\.br\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
});
