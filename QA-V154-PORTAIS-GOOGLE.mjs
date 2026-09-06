#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const BASE = 'https://divinabruxa.com.br';
const RELEASE = '2026-09-06';
const checks = [];
const failures = [];

const portals = [
  { file: 'tarot-livre.html', hash: 'tarot', label: 'Tarot Livre', art: 'tarot-temple-background-v1.webp', entity: 'WebApplication' },
  { file: 'carta-do-dia.html', hash: 'daily', label: 'Carta do Dia', art: 'carta-dia-santuario-lunar-v1.webp', entity: 'WebApplication' },
  { file: 'tiragens-de-tarot.html', hash: 'spreads', label: 'Tiragens', art: 'templo-tiragens-celestial-v1.webp', entity: 'ItemList' },
  { file: 'escola-do-tarot.html', hash: 'school', label: 'Escola', art: 'escola-tarot-observatorio-v1.webp', entity: 'Course' },
  { file: 'consultas-de-tarot.html', hash: 'consultations', label: 'Consultas', art: 'consultas-celestiais-santuario-v1.webp', entity: 'ItemList' }
];

const check = (condition, label) => condition ? checks.push(label) : failures.push(label);

function read(filename, required = true) {
  const target = path.join(ROOT, filename);
  if (!fs.existsSync(target)) {
    if (required) failures.push(`arquivo presente: ${filename}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}

function capture(source, pattern, label) {
  const match = source.match(pattern);
  check(Boolean(match), label);
  return match?.[1] || '';
}

function schema(source, filename) {
  const raw = capture(source, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/, `${filename}: JSON-LD presente`);
  try {
    return JSON.parse(raw);
  } catch (error) {
    failures.push(`${filename}: JSON-LD válido (${error.message})`);
    return null;
  }
}

function visibleText(source) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function balanced(source, openPattern, closePattern, label) {
  const opens = (source.match(openPattern) || []).length;
  const closes = (source.match(closePattern) || []).length;
  check(opens === closes && opens > 0, `${label} (${opens}/${closes})`);
}

const packageMode = !fs.existsSync(path.join(ROOT, 'index.html'));
const pageTitles = new Set();
const pageDescriptions = new Set();
const pageCanonicals = new Set();

for (const portal of portals) {
  const source = read(portal.file);
  const title = capture(source, /<title>([^<]+)<\/title>/, `${portal.file}: título presente`);
  const description = capture(source, /<meta name="description" content="([^"]+)">/, `${portal.file}: descrição presente`);
  const canonical = capture(source, /<link rel="canonical" href="([^"]+)">/, `${portal.file}: canonical presente`);
  const structured = schema(source, portal.file);
  const graph = structured?.['@graph'] || [];
  const types = new Set(graph.map(node => node['@type']));
  const page = graph.find(node => node['@type'] === 'WebPage');
  const entity = graph.find(node => node['@type'] === portal.entity && node['@id'] !== `${BASE}/${portal.file}#breadcrumb`);
  const words = visibleText(source).split(/\s+/).filter(Boolean).length;

  check(/^<!doctype html>\s*<html lang="pt-BR">/.test(source), `${portal.file}: documento HTML em pt-BR`);
  check(title.length >= 40 && title.length <= 65 && title.endsWith('| Divina Bruxa'), `${portal.file}: título descritivo e conciso (${title.length})`);
  check(description.length >= 120 && description.length <= 165, `${portal.file}: descrição entre 120 e 165 caracteres (${description.length})`);
  check(canonical === `${BASE}/${portal.file}`, `${portal.file}: canonical absoluto e autorreferente`);
  check(source.includes(`<meta property="og:url" content="${canonical}">`), `${portal.file}: URL Open Graph coerente`);
  check(source.includes('name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"'), `${portal.file}: indexação e prévias ampliadas permitidas`);
  check(source.includes('href="seo-portal-v154.css?v=154"'), `${portal.file}: estilo V154 carregado`);
  check(source.includes(`<link rel="preload" as="image" href="${portal.art}"`), `${portal.file}: arte principal pré-carregada`);
  check(source.includes(`<img src="${portal.art}"`) && source.includes('fetchpriority="high"'), `${portal.file}: arte principal visível e prioritária`);
  check((source.match(/<h1>/g) || []).length === 1, `${portal.file}: exatamente um H1`);
  check(source.includes('class="skip-link"') && source.includes('class="breadcrumbs"'), `${portal.file}: salto e breadcrumb visíveis`);
  check(source.includes(`href="./#${portal.hash}"`), `${portal.file}: chamada abre a função real #${portal.hash}`);
  check(portals.every(item => source.includes(`href="${item.file}"`)), `${portal.file}: navegação para os cinco portais públicos`);
  check(source.includes('href="cartas-do-tarot.html"'), `${portal.file}: ligação com a biblioteca das 78 cartas`);
  check(!/<meta (?:property|name)="(?:og:image|twitter:)/.test(source), `${portal.file}: sem imagem social provisória`);
  check(!/google-site-verification|verification-token|TOKEN[_ -]?AQUI|COLE[_ -]?AQUI/i.test(source), `${portal.file}: sem código de verificação inventado`);
  check(!/noindex|nofollow/i.test(source), `${portal.file}: nenhuma diretiva de bloqueio`);
  check((source.match(/<script/g) || []).length === 1, `${portal.file}: página estática sem JavaScript bloqueante`);
  check(words >= 450, `${portal.file}: conteúdo público substancial (${words} palavras)`);
  check(types.has('Organization') && types.has('WebSite') && types.has('WebPage') && types.has('BreadcrumbList'), `${portal.file}: entidades estruturadas básicas completas`);
  check(Boolean(entity), `${portal.file}: entidade principal ${portal.entity}`);
  check(page?.url === canonical && page?.dateModified === RELEASE, `${portal.file}: WebPage coerente com a versão`);
  balanced(source, /<section\b/g, /<\/section>/g, `${portal.file}: seções balanceadas`);
  balanced(source, /<article\b/g, /<\/article>/g, `${portal.file}: artigos balanceados`);
  check((source.match(/<body\b/g) || []).length === 1 && (source.match(/<\/body>/g) || []).length === 1, `${portal.file}: corpo HTML completo`);

  pageTitles.add(title);
  pageDescriptions.add(description);
  pageCanonicals.add(canonical);
}

check(pageTitles.size === 5, 'Portais: cinco títulos exclusivos');
check(pageDescriptions.size === 5, 'Portais: cinco descrições exclusivas');
check(pageCanonicals.size === 5, 'Portais: cinco canonicals exclusivos');

const tarot = read('tarot-livre.html');
check(['78 cartas', '13 × 6', 'Sem repetição', 'Sempre diretas', 'somente as imagens', 'Embaralhe as cartas restantes'].every(text => tarot.includes(text)), 'Tarot Livre: contrato visual, direto e sem repetição publicado');
check(tarot.includes('href="./#tarot"') && tarot.includes('href="carta-00-o-louco.html"'), 'Tarot Livre: entrada real e estudo separado');

const daily = read('carta-do-dia.html');
check(['data de Brasília', 'mesma carta', 'neste aparelho', 'posição direta'].every(text => daily.includes(text)), 'Carta do Dia: ciclo, aparelho e orientação explicados');
check(daily.includes('href="./#daily"') && (daily.match(/class="card-links"/g) || []).length === 1, 'Carta do Dia: ritual real e cartas de estudo conectados');

const spreads = read('tiragens-de-tarot.html');
const spreadNames = ['Uma Carta', 'Passado · Presente · Tendência', 'Triângulo Mágico', 'Situação · Desafio · Conselho', 'Caminho em Cinco', 'Dois Caminhos', 'Amor &amp; Relações', 'Trabalho &amp; Vocação', 'Dinheiro &amp; Recursos', 'Caminho Espiritual', 'Mandala Astrológica', 'Árvore da Vida', 'Cruz Celta', 'Mesa Personalizada', 'Mesa Real'];
check(spreadNames.every(name => spreads.includes(name)), 'Tiragens: 15 nomes oficiais visíveis');
check((spreads.match(/class="catalog-grid spread-catalog"/g) || []).length === 1 && (spreads.match(/<li><span aria-hidden="true">/g) || []).length >= 15, 'Tiragens: catálogo completo renderizado');
const spreadsSchema = schema(spreads, 'tiragens-de-tarot.html (catálogo)');
const spreadList = spreadsSchema?.['@graph']?.find(node => node['@id'] === `${BASE}/tiragens-de-tarot.html#spreads`);
check(spreadList?.numberOfItems === 15 && spreadList?.itemListElement?.length === 15, 'Tiragens: ItemList estruturada com 15 métodos');

const school = read('escola-do-tarot.html');
const moduleNames = ['Fundamentos do Tarot', 'Os 22 Arcanos Maiores', 'Paus', 'Copas', 'Espadas', 'Ouros', 'Cartas da Corte', 'Números e Padrões', 'Naipes e Elementos', 'Posições de uma Tiragem', 'Combinações', 'Construção de Síntese', 'Tiragens Práticas', 'Cruz Celta', 'Mesa Real', 'Ética', 'Prática Avançada'];
check(moduleNames.every(name => school.includes(name)), 'Escola: 17 módulos oficiais visíveis');
check((school.match(/<ol class="module-list">/g) || []).length === 1 && (school.match(/<li><span>\d{2}<\/span>/g) || []).length === 17, 'Escola: trilha numerada com 17 módulos');
const schoolSchema = schema(school, 'escola-do-tarot.html (curso)');
const course = schoolSchema?.['@graph']?.find(node => node['@id'] === `${BASE}/escola-do-tarot.html#course`);
check(course?.hasPart?.length === 17, 'Escola: Course estruturado com 17 recursos de aprendizagem');

const consultations = read('consultas-de-tarot.html');
const services = [
  ['Mesa Real Profissional', 'R$ 250'], ['Leitura de Mentes', 'R$ 150'],
  ['Carta de Conselho', 'R$ 100'], ['Pergunta Direta', 'R$ 50']
];
check(services.every(([name, price]) => consultations.includes(name) && consultations.includes(price)), 'Consultas: quatro serviços e preços corretos');
check((consultations.match(/class="service-grid"/g) || []).length === 1 && (consultations.match(/<article(?: class="service-featured")?>/g) || []).length >= 4, 'Consultas: quatro cartões de serviço visíveis');
check(consultations.includes('orbedasrealidades@hotmail.com') && consultations.includes('e-mail é obrigatório'), 'Consultas: e-mail oficial e e-mail da cliente exigido');
check(consultations.includes('não realiza cobrança automática') && consultations.includes('não lê pensamentos literalmente'), 'Consultas: cobrança e Leitura de Mentes explicadas com responsabilidade');
const consultationSchema = schema(consultations, 'consultas-de-tarot.html (serviços)');
const serviceList = consultationSchema?.['@graph']?.find(node => node['@id'] === `${BASE}/consultas-de-tarot.html#services`);
const structuredPrices = serviceList?.itemListElement?.map(entry => entry.item?.offers?.price) || [];
check(JSON.stringify(structuredPrices) === JSON.stringify([250, 150, 100, 50]), 'Consultas: preços estruturados BRL exatos');

const hub = read('cartas-do-tarot.html');
const cardLinks = [...hub.matchAll(/<a href="(carta-[a-z0-9-]+\.html)" aria-label="Ler o significado/g)].map(match => match[1]);
const cardImages = [...hub.matchAll(/<img src="(card-\d{2}\.webp)"/g)].map(match => match[1]);
check(cardLinks.length === 78 && new Set(cardLinks).size === 78, 'Biblioteca: 78 links exclusivos de cartas preservados');
check(cardImages.length === 78 && new Set(cardImages).size === 78, 'Biblioteca: 78 imagens exclusivas preservadas');
check(portals.every(item => hub.includes(`href="${item.file}"`)), 'Biblioteca: links rastreáveis para os cinco portais');
check(hub.includes('href="./#tarot"') && hub.includes('sempre diretas e sem repetição'), 'Biblioteca: entrada e contrato do Tarot Livre preservados');

const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(match => match[1]);
const expected = new Set([
  `${BASE}/`, `${BASE}/cartas-do-tarot.html`, ...portals.map(item => `${BASE}/${item.file}`), ...cardLinks.map(file => `${BASE}/${file}`)
]);
check(sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'Sitemap: namespace de imagens ativo');
check(locs.length === 85 && new Set(locs).size === 85, 'Sitemap: 85 URLs únicas');
check(expected.size === 85 && locs.every(url => expected.has(url)), 'Sitemap: conjunto exato da Home, biblioteca, portais e cartas');
check(imageLocs.length === 78 && new Set(imageLocs).size === 78, 'Sitemap: 78 imagens oficiais únicas');
check((sitemap.match(new RegExp(`<lastmod>${RELEASE}<\\/lastmod>`, 'g')) || []).length === 85, 'Sitemap: 85 datas de atualização V154');
check(!sitemap.includes('/index.html') && !sitemap.includes('/#'), 'Sitemap: sem /index.html ou rotas de fragmento');

const css = read('seo-portal-v154.css');
check(css.includes('.portal-hero') && css.includes('.service-grid') && css.includes('.module-list'), 'CSS: heróis, consultas e escola contemplados');
check(css.includes('@media (max-width: 560px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS: celular e movimento reduzido contemplados');
check(css.includes(':focus-visible') && css.includes('.skip-link'), 'CSS: foco e salto de acessibilidade presentes');
check(!/@import\s+url/.test(css), 'CSS: sem dependência externa bloqueante');
check((css.match(/{/g) || []).length === (css.match(/}/g) || []).length, 'CSS: chaves balanceadas');

const manifestSource = read('SEO-INDEXACAO-V154.json');
try {
  const manifest = JSON.parse(manifestSource);
  check(manifest.schemaVersion === '154.0.0' && manifest.indexableUrls === 85, 'Manifesto: versão e 85 URLs registrados');
  check(manifest.publicPortals?.length === 5 && manifest.tarotCardPages === 78 && manifest.imageEntries === 78, 'Manifesto: cinco portais e 78 cartas/imagens');
  check(manifest.searchConsole?.verificationTokenIncluded === false && manifest.searchConsole?.status === 'awaiting-owner-verification-token', 'Search Console: token real aguardado, sem valor fictício');
  check(manifest.safeguards?.tarotLivreContractChanged === false && manifest.safeguards?.consultationPricesChanged === false, 'Manifesto: proteções do Tarot Livre e Consultas');
} catch (error) {
  failures.push(`SEO-INDEXACAO-V154.json: JSON válido (${error.message})`);
}

if (!packageMode) {
  const home = read('index.html');
  const robots = read('robots.txt');
  const policy = read('consultation-policy.js');
  const tarotData = read('tarot-data.js');
  check(home.includes('app.js?v=152') && home.includes('sw.js?v=152'), 'Home: Guardião do Portal V152 preservado');
  check(home.includes('78 cartas sem repetição') && home.includes('Somente as imagens'), 'Home: Tarot Livre visual e sem significado preservado');
  check(home.includes('Mesa Real Profissional<small>R$ 250</small>') && home.includes('Pergunta Direta<small>R$ 50</small>'), 'Home: catálogo de consultas e preços preservado');
  check(!home.includes('google-site-verification'), 'Home: sem código fictício do Search Console');
  check(robots.includes(`Sitemap: ${BASE}/sitemap.xml`) && robots.includes('Disallow: /admin'), 'Robots: sitemap e áreas privadas declarados');
  check(policy.includes("contactEmail:'orbedasrealidades@hotmail.com'") && policy.includes('realBilling:false'), 'Consultas: e-mail oficial e cobrança real desligada no contrato');
  check((tarotData.match(/image: imageFor\(/g) || []).length >= 1 && tarotData.includes('export const CARDS'), 'Tarot: catálogo canônico permanece ativo');

  const requiredAssets = [...portals.map(item => item.art), 'divina-orb-thumb-v1.webp', ...cardImages];
  check(requiredAssets.every(file => fs.existsSync(path.join(ROOT, file))), 'Ativos: todas as artes dos portais, Orbe e 78 cartas presentes');
  check(cardLinks.every(file => fs.existsSync(path.join(ROOT, file))), 'Rotas: 78 páginas de cartas presentes');
} else {
  checks.push('Pacote incremental: Home, motores, cartas e imagens permanentes não duplicados no ZIP');
}

console.log('DIVINA BRUXA · QA V154 · PORTAIS PÚBLICOS PARA GOOGLE');
console.log(`Diretório: ${ROOT}`);
console.log(`Modo: ${packageMode ? 'pacote incremental' : 'projeto completo'}`);
console.log(`Verificações aprovadas: ${checks.length}`);

if (failures.length) {
  console.error(`Falhas: ${failures.length}`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log('Resultado: APROVADO — 5 portais, 85 URLs e contratos críticos preservados.');
