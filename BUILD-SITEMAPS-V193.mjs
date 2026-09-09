#!/usr/bin/env node
/* Gera o índice e os seis sitemaps temáticos a partir dos HTML canônicos. */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || process.cwd());
const ORIGIN = 'https://divinabruxa.com.br/';
const RELEASE_DATE = '2026-09-09';

const groups = [
  ['principal', 'sitemap-principal.xml'],
  ['cartas', 'sitemap-cartas.xml'],
  ['naipes-simbolos', 'sitemap-naipes-simbolos.xml'],
  ['tiragens', 'sitemap-tiragens.xml'],
  ['aprendizado', 'sitemap-aprendizado.xml'],
  ['consultas', 'sitemap-consultas.xml']
];

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const get = (source, expression) => (source.match(expression) || [])[1] || '';

function groupFor(file) {
  if (
    file === 'cartas-do-tarot.html' ||
    file === 'arcanos-maiores.html' ||
    file === 'arcanos-menores.html' ||
    (/^carta-/.test(file) && file !== 'carta-do-dia.html')
  ) return 'cartas';

  if (
    /^naipe-de-/.test(file) ||
    ['simbolos-do-tarot.html', 'numerologia-no-tarot.html', 'figuras-da-corte-no-tarot.html',
      'combinacoes-de-cartas-no-tarot.html', 'historia-do-tarot.html', 'tipos-de-tarot.html'].includes(file)
  ) return 'naipes-simbolos';

  if (
    file === 'tarot-livre.html' || file === 'tiragens-de-tarot.html' ||
    /^tiragem-/.test(file) ||
    /^(cruz-celta|mesa-real|mesa-personalizada|mandala-astrologica|arvore-da-vida)-no-tarot\.html$/.test(file) ||
    ['tarot-do-amor.html', 'tarot-para-trabalho.html', 'tarot-para-dinheiro.html', 'tarot-espiritual.html'].includes(file)
  ) return 'tiragens';

  if (
    ['carta-do-dia.html', 'escola-do-tarot.html', 'guias-para-comecar.html', 'tarot-para-iniciantes.html',
      'plano-de-estudo-do-tarot-em-30-dias.html', 'diario-de-tarot.html', 'glossario-do-tarot.html',
      'metodologia-do-tarot.html', 'fontes-e-referencias.html', 'cartas-invertidas-no-tarot.html'].includes(file) ||
    /^como-/.test(file)
  ) return 'aprendizado';

  if (['consultas-de-tarot.html', 'etica-e-responsabilidade.html', 'contato.html'].includes(file)) return 'consultas';
  return 'principal';
}

function imageFor(file, source) {
  if (!/^carta-/.test(file) || file === 'carta-do-dia.html') return '';
  const relative = get(source, /<link\s+rel=["']preload["']\s+as=["']image["']\s+href=["']([^"']+)/i);
  return relative ? new URL(relative, ORIGIN).href : '';
}

const pages = fs.readdirSync(ROOT)
  .filter(file => file.endsWith('.html'))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .map(file => {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const robots = get(source, /<meta\s+name=["']robots["']\s+content=["']([^"']+)/i);
    const canonical = get(source, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i);
    const dateModified = get(source, /"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/i) || RELEASE_DATE;
    return { file, source, robots, canonical, dateModified, group: groupFor(file), image: imageFor(file, source) };
  })
  .filter(page => page.canonical && !/noindex/i.test(page.robots));

const canonicalSet = new Set();
for (const page of pages) {
  if (!page.canonical.startsWith(ORIGIN)) throw new Error(`Canonical fora da origem: ${page.file}`);
  if (canonicalSet.has(page.canonical)) throw new Error(`Canonical duplicada: ${page.canonical}`);
  canonicalSet.add(page.canonical);
}

const urlXml = page => [
  '  <url>',
  `    <loc>${escapeXml(page.canonical)}</loc>`,
  `    <lastmod>${page.dateModified}</lastmod>`,
  ...(page.image ? ['    <image:image>', `      <image:loc>${escapeXml(page.image)}</image:loc>`, '    </image:image>'] : []),
  '  </url>'
].join('\n');

for (const [group, filename] of groups) {
  const entries = pages.filter(page => page.group === group);
  if (!entries.length) throw new Error(`Sitemap vazio: ${filename}`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map(urlXml),
    '</urlset>',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, filename), xml);
}

const indexXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...groups.flatMap(([, filename]) => [
    '  <sitemap>',
    `    <loc>${ORIGIN}${filename}</loc>`,
    `    <lastmod>${RELEASE_DATE}</lastmod>`,
    '  </sitemap>'
  ]),
  '</sitemapindex>',
  ''
].join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), indexXml);

const counts = Object.fromEntries(groups.map(([group]) => [group, pages.filter(page => page.group === group).length]));
console.log(JSON.stringify({ version: 'V193', total: pages.length, groups: counts }, null, 2));
