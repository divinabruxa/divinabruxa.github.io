#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const BASE = 'https://divinabruxa.com.br';
const RELEASE = '2026-09-06';
const failures = [];
const checks = [];

function check(condition, message) {
  if (condition) checks.push(message);
  else failures.push(message);
}

function read(filename) {
  const target = path.join(ROOT, filename);
  if (!fs.existsSync(target)) {
    failures.push(`arquivo presente: ${filename}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}

function one(source, pattern, label) {
  const match = source.match(pattern);
  check(Boolean(match), label);
  return match?.[1] || '';
}

function jsonLd(source, filename) {
  const raw = one(source, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/, `${filename}: JSON-LD presente`);
  try {
    return JSON.parse(raw);
  } catch (error) {
    failures.push(`${filename}: JSON-LD válido (${error.message})`);
    return null;
  }
}

const cardFiles = fs.readdirSync(ROOT)
  .filter(filename => /^carta-(?!s-do-tarot)[a-z0-9-]+\.html$/.test(filename))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'));

check(cardFiles.length === 78, `78 páginas individuais encontradas (${cardFiles.length})`);

const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const cardImages = new Set();
const allPageTargets = new Set();

for (const filename of cardFiles) {
  const source = read(filename);
  const title = one(source, /<title>([^<]+)<\/title>/, `${filename}: título presente`);
  const description = one(source, /<meta name="description" content="([^"]+)">/, `${filename}: descrição presente`);
  const canonical = one(source, /<link rel="canonical" href="([^"]+)">/, `${filename}: canonical presente`);
  const image = one(source, /<figure class="card-portrait">[\s\S]*?<img src="(card-\d{2}\.webp)"/, `${filename}: imagem direta presente`);
  const alt = one(source, /<figure class="card-portrait">[\s\S]*?<img[^>]+alt="([^"]+)"/, `${filename}: texto alternativo presente`);
  const schema = jsonLd(source, filename);
  const graph = schema?.['@graph'] || [];
  const types = new Set(graph.map(node => node['@type']));
  const pageLinks = [...source.matchAll(/href="(carta-[a-z0-9-]+\.html)"/g)].map(match => match[1]);

  check(/^<!doctype html>\s*<html lang="pt-BR">/.test(source), `${filename}: documento HTML em pt-BR`);
  check(title.endsWith('| Divina Bruxa') && title.length <= 70, `${filename}: título único, descritivo e conciso`);
  check(description.length >= 120 && description.length <= 165, `${filename}: descrição completa entre 120 e 165 caracteres`);
  check(canonical === `${BASE}/${filename}`, `${filename}: canonical absoluto e autorreferente`);
  check(source.includes(`<meta property="og:url" content="${BASE}/${filename}">`), `${filename}: URL Open Graph coerente`);
  check(source.includes('name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"'), `${filename}: indexação e prévia ampliada permitidas`);
  check(source.includes('href="card-page.css?v=153"'), `${filename}: estilo V153 carregado`);
  check(source.includes(`<link rel="preload" as="image" href="${image}"`), `${filename}: imagem principal pré-carregada`);
  check(alt.includes('posição direta'), `${filename}: alt descreve a orientação direta`);
  check((source.match(/<h1>/g) || []).length === 1, `${filename}: exatamente um H1`);
  check(source.includes('class="breadcrumbs"') && source.includes('aria-current="page"'), `${filename}: breadcrumb visível`);
  check(source.includes('id="simbolos"') && source.includes('class="symbol-list"'), `${filename}: símbolos publicados`);
  check(source.includes('id="combinacoes"') && (source.match(/class="combination-card"/g) || []).length === 3, `${filename}: três combinações publicadas`);
  check(source.includes('id="conselho"') && source.includes('class="reflection-card"'), `${filename}: desafio, conselho e ação publicados`);
  check(source.includes('Leitura simbólica e responsável'), `${filename}: aviso responsável visível`);
  check(!source.includes('tarot-atlas.webp') && !source.includes('class="art"'), `${filename}: sem recorte do atlas antigo`);
  check(!/<meta (?:property|name)="(?:og:image|twitter:)/.test(source), `${filename}: sem imagem social provisória`);
  check(types.has('WebPage') && types.has('Article') && types.has('BreadcrumbList') && types.has('ImageObject'), `${filename}: dados estruturados completos`);

  const webPage = graph.find(node => node['@type'] === 'WebPage');
  const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList');
  const imageObject = graph.find(node => node['@type'] === 'ImageObject');
  check(webPage?.url === canonical && webPage?.dateModified === RELEASE, `${filename}: WebPage coerente com a versão`);
  check(breadcrumb?.itemListElement?.length === 3, `${filename}: trilha estruturada com três níveis`);
  check(imageObject?.contentUrl === `${BASE}/${image}`, `${filename}: ImageObject aponta para a carta oficial`);

  titles.add(title);
  descriptions.add(description);
  canonicals.add(canonical);
  cardImages.add(image);
  pageLinks.forEach(target => allPageTargets.add(target));
}

check(titles.size === 78, `78 títulos exclusivos (${titles.size})`);
check(descriptions.size === 78, `78 descrições exclusivas (${descriptions.size})`);
check(canonicals.size === 78, `78 canonicals exclusivos (${canonicals.size})`);
check(cardImages.size === 78, `78 imagens oficiais sem repetição (${cardImages.size})`);
check([...allPageTargets].every(target => cardFiles.includes(target)), 'Todos os links entre cartas têm destino existente');

const hub = read('cartas-do-tarot.html');
const hubSchema = jsonLd(hub, 'cartas-do-tarot.html');
const hubGraph = hubSchema?.['@graph'] || [];
const itemList = hubGraph.find(node => node['@type'] === 'ItemList');
const hubLinks = [...hub.matchAll(/<a href="(carta-[a-z0-9-]+\.html)" aria-label="Ler o significado/g)].map(match => match[1]);
const hubImages = [...hub.matchAll(/<img src="(card-\d{2}\.webp)"/g)].map(match => match[1]);

check(hub.includes('<title>Significado das 78 cartas do Tarot | Divina Bruxa</title>'), 'Índice: título editorial presente');
check(hub.includes(`<link rel="canonical" href="${BASE}/cartas-do-tarot.html">`), 'Índice: canonical absoluto');
check((hub.match(/class="library-tile"/g) || []).length === 78, 'Índice: 78 blocos visíveis de cartas');
check(hubLinks.length === 78 && new Set(hubLinks).size === 78, 'Índice: 78 links visíveis e exclusivos');
check(hubLinks.every(filename => cardFiles.includes(filename)), 'Índice: todos os links levam a páginas existentes');
check(hubImages.length === 78 && new Set(hubImages).size === 78, 'Índice: 78 imagens sem repetição');
check((hub.match(/loading="lazy"/g) || []).length === 76, 'Índice: carregamento progressivo de 76 imagens');
check(['maiores', 'copas', 'espadas', 'paus', 'ouros'].every(id => hub.includes(`id="${id}"`)), 'Índice: cinco grupos de Arcanos e naipes');
check(itemList?.numberOfItems === 78 && itemList?.itemListElement?.length === 78, 'Índice: ItemList estruturada com 78 itens');
check(hubGraph.some(node => node['@type'] === 'CollectionPage'), 'Índice: CollectionPage estruturada');
check(hub.includes('sempre diretas e sem repetição') && hub.includes('Os significados vivem nesta biblioteca'), 'Índice: contrato do Tarot Livre preservado');
check(!/<meta (?:property|name)="(?:og:image|twitter:)/.test(hub), 'Índice: sem imagem social provisória');

const sitemap = read('sitemap.xml');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const sitemapImages = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(match => match[1]);
const expectedLocs = new Set([`${BASE}/`, `${BASE}/cartas-do-tarot.html`, ...cardFiles.map(filename => `${BASE}/${filename}`)]);
check(sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'Sitemap: namespace de imagens ativo');
check(sitemapLocs.length === 80 && new Set(sitemapLocs).size === 80, 'Sitemap: 80 URLs únicas (Home, índice e 78 cartas)');
check(sitemapLocs.every(url => expectedLocs.has(url)) && expectedLocs.size === 80, 'Sitemap: conjunto exato de URLs canônicas');
check(!sitemap.includes('/index.html'), 'Sitemap: sem duplicata /index.html');
check(sitemapImages.length === 78 && new Set(sitemapImages).size === 78, 'Sitemap: 78 imagens oficiais únicas');
check((sitemap.match(new RegExp(`<lastmod>${RELEASE}<\\/lastmod>`, 'g')) || []).length === 80, 'Sitemap: 80 datas de atualização V153');

const css = read('card-page.css');
check(css.includes('.card-portrait img') && css.includes('.library-index-grid'), 'CSS: páginas individuais e índice estilizados');
check(css.includes('@media (max-width: 640px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS: mobile e movimento reduzido contemplados');
check(css.includes(':focus-visible') && css.includes('.skip-link'), 'CSS: foco e salto de acessibilidade presentes');
check(!/@import\s+url/.test(css), 'CSS: sem dependência externa bloqueante');

const index = read('index.html');
const indexSchema = jsonLd(index, 'index.html');
const indexTypes = new Set((indexSchema?.['@graph'] || []).map(node => node['@type']));
check(index.includes('<link rel="canonical" href="https://divinabruxa.com.br/">'), 'Home: canonical absoluto');
check(index.includes('href="https://divinabruxa.com.br/cartas-do-tarot.html"'), 'Home: referência ao índice das 78 cartas');
check(indexTypes.has('WebSite') && indexTypes.has('Organization'), 'Home: WebSite e Organization estruturados');
check(index.includes('app.js?v=152') && index.includes('sw.js?v=152'), 'Home: Guardião do Portal V152 preservado');
check(index.includes('78 cartas sem repetição') && index.includes('Somente as imagens'), 'Home: contrato do Tarot Livre preservado');
check(index.includes('Mesa Real Profissional<small>R$ 250</small>') && index.includes('Pergunta Direta<small>R$ 50</small>'), 'Home: catálogo de consultas e preços preservado');

const localImages = [...cardImages].filter(filename => fs.existsSync(path.join(ROOT, filename)));
if (localImages.length) {
  check(localImages.length === 78, `Ativos locais: conjunto completo de 78 imagens (${localImages.length})`);
  for (const filename of localImages) {
    const bytes = fs.readFileSync(path.join(ROOT, filename));
    check(bytes.length > 100_000 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP', `${filename}: WEBP oficial válido e em alta resolução`);
  }
} else {
  checks.push('Pacote incremental: imagens permanentes referenciadas sem duplicá-las no ZIP');
}

console.log('DIVINA BRUXA · QA V153 · SEO DAS 78 CARTAS');
console.log(`Diretório: ${ROOT}`);
console.log(`Verificações aprovadas: ${checks.length}`);

if (failures.length) {
  console.error(`Falhas: ${failures.length}`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log('Resultado: APROVADO — 78/78 páginas indexáveis, conectadas e sem regressão do Tarot Livre.');
