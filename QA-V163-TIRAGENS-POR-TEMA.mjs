import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.argv[2] || process.cwd());
const checks = [], failures = [];
const pass = (name, condition, detail = '') => { checks.push(Boolean(condition)); if (!condition) failures.push(detail ? `${name}: ${detail}` : name); };
const filePath = name => path.join(root, name);
const exists = name => fs.existsSync(filePath(name)) && fs.statSync(filePath(name)).isFile();
const read = name => fs.readFileSync(filePath(name), 'utf8');
const bytes = name => fs.readFileSync(filePath(name));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, expression) => [...value.matchAll(expression)].length;
const esc = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const required = ['sitemap.xml', 'tiragens-de-tarot.html', 'tarot-do-amor.html', 'tiragem-dois-caminhos.html', 'tarot-para-trabalho.html', 'tarot-para-dinheiro.html', 'tarot-espiritual.html', '00-LEIA-PRIMEIRO-V163-TIRAGENS-POR-TEMA.txt', 'TIRAGENS-POR-TEMA-V163.json', 'QA-V163-TIRAGENS-POR-TEMA.mjs', 'ARQUIVOS-V163-SHA256.txt'];
for (const file of required) pass(`Arquivo presente: ${file}`, exists(file));
if (failures.length) { console.error(JSON.stringify({ suite: 'DIVINA-BRUXA-V163-TIRAGENS-POR-TEMA', status: 'FAIL', failures }, null, 2)); process.exit(1); }

const pages = [
  { file: 'tarot-do-amor.html', title: 'Tarot do Amor: tiragem para relações e vínculos | Divina Bruxa', canonical: 'https://divinabruxa.com.br/tarot-do-amor.html', image: 'card-06.webp', positions: ['Você', 'A outra energia', 'O vínculo', 'O que fortalece', 'O que pede limite', 'Tendência'], phrases: ['Relação é encontro, não acesso ao pensamento alheio', 'não é leitura literal da mente', 'Amor responsável inclui realidade e consentimento'] },
  { file: 'tiragem-dois-caminhos.html', title: 'Tiragem Dois Caminhos: compare escolhas no Tarot | Divina Bruxa', canonical: 'https://divinabruxa.com.br/tiragem-dois-caminhos.html', image: 'card-11.webp', positions: ['Núcleo da escolha', 'Caminho A · força', 'Caminho A · desafio', 'Caminho B · força', 'Caminho B · desafio', 'Critério para decidir'], phrases: ['compare opções sem entregar sua decisão ao Tarot', 'Comparar não é transferir responsabilidade', 'Que informação ainda preciso obter antes de escolher?'] },
  { file: 'tarot-para-trabalho.html', title: 'Tarot para Trabalho: tiragem de 5 cartas | Divina Bruxa', canonical: 'https://divinabruxa.com.br/tarot-para-trabalho.html', image: 'card-66.webp', positions: ['Seu lugar agora', 'Talento disponível', 'Ambiente', 'Desafio profissional', 'Direção possível'], phrases: ['talentos, contexto e direção possível', 'Confronte a leitura com evidências', 'Trabalho exige informação concreta'] },
  { file: 'tarot-para-dinheiro.html', title: 'Tarot para Dinheiro: recursos e escolhas | Divina Bruxa', canonical: 'https://divinabruxa.com.br/tarot-para-dinheiro.html', image: 'card-69.webp', positions: ['Realidade atual', 'Recurso disponível', 'Padrão a rever', 'Ação concreta', 'Tendência material'], phrases: ['com os pés na realidade material', 'não promete lucro', 'Decisões financeiras precisam de dados'] },
  { file: 'tarot-espiritual.html', title: 'Tarot Espiritual: presença e integração | Divina Bruxa', canonical: 'https://divinabruxa.com.br/tarot-espiritual.html', image: 'card-02.webp', positions: ['Presença', 'Aprendizado', 'Sombra a acolher', 'Dom a cultivar', 'Integração'], phrases: ['como prática de presença e integração', 'não é prova de mensagem sobrenatural', 'Espiritualidade saudável preserva sua liberdade'] }
];
const coreLinks = ['tarot-livre.html', 'carta-do-dia.html', 'tiragens-de-tarot.html', 'escola-do-tarot.html', 'consultas-de-tarot.html', 'cartas-do-tarot.html'];
const legalLinks = ['sobre-a-divina-bruxa.html', 'metodologia-do-tarot.html', 'etica-e-responsabilidade.html', 'privacidade-e-dados.html', 'termos-de-uso.html', 'acessibilidade.html', 'contato.html'];
const parsed = new Map(), titles = [], descriptions = [];

for (const page of pages) {
  const html = read(page.file); parsed.set(page.file, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title); descriptions.push(description);
  pass(`Título exato: ${page.file}`, title === page.title);
  pass(`Título adequado: ${page.file}`, title.length >= 35 && title.length <= 65, `${title.length}`);
  pass(`Descrição adequada: ${page.file}`, description.length >= 120 && description.length <= 165, `${description.length}`);
  pass(`Canonical: ${page.file}`, html.includes(`<link rel="canonical" href="${page.canonical}">`));
  pass(`Robots: ${page.file}`, html.includes('index,follow,max-image-preview:large'));
  pass(`Idioma: ${page.file}`, html.includes('<html lang="pt-BR">'));
  pass(`H1 único: ${page.file}`, count(html, /<h1(?:\s|>)/g) === 1);
  pass(`Main: ${page.file}`, count(html, /<main\b[^>]*id="conteudo"/g) === 1);
  pass(`Skip link: ${page.file}`, html.includes('<a class="skip-link" href="#conteudo">'));
  pass(`CSS reutilizado: ${page.file}`, count(html, /seo-portal-v154\.css\?v=154/g) === 1);
  pass(`Imagem principal: ${page.file}`, count(html, new RegExp(`<img src="${esc(page.image)}"`, 'g')) === 1);
  pass(`Alt principal: ${page.file}`, new RegExp(`<img src="${esc(page.image)}"[^>]+alt="[^"]{12,}"`).test(html));
  pass(`Sem og:image: ${page.file}`, !/property="og:image"/.test(html));
  pass(`Sem nome pessoal: ${page.file}`, !/\b[ií]sis\b/i.test(html));
  pass(`Sem script executável: ${page.file}`, [...html.matchAll(/<script(?:\s[^>]*)?>/g)].every(m => /application\/ld\+json/.test(m[0])));
  for (const tag of ['article', 'section', 'details']) pass(`Tags ${tag}: ${page.file}`, count(html, new RegExp(`<${tag}(?:\\s|>)`, 'g')) === count(html, new RegExp(`</${tag}>`, 'g')));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  pass(`IDs únicos: ${page.file}`, ids.length === new Set(ids).size);
  for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of m[1].split(/\s+/)) pass(`ARIA ${page.file}: ${id}`, ids.includes(id));
  let graph = [];
  try { graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')['@graph'] || []; pass(`JSON-LD: ${page.file}`, true); } catch (error) { pass(`JSON-LD: ${page.file}`, false, error.message); }
  pass(`Organization: ${page.file}`, graph.some(x => x['@type'] === 'Organization' && x.name === 'Divina Bruxa'));
  pass(`WebSite: ${page.file}`, graph.some(x => x['@type'] === 'WebSite' && x.url === 'https://divinabruxa.com.br/'));
  pass(`Article: ${page.file}`, graph.some(x => x['@type'] === 'Article' && x.url === page.canonical));
  pass(`WebPage: ${page.file}`, graph.some(x => x['@type'] === 'WebPage' && x.url === page.canonical));
  pass(`Breadcrumb: ${page.file}`, graph.find(x => x['@type'] === 'BreadcrumbList')?.itemListElement?.length === 3);
  pass(`ImageObject: ${page.file}`, graph.some(x => x['@type'] === 'ImageObject' && x.contentUrl?.endsWith(page.image)));
  const list = html.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '';
  pass(`Quantidade de posições: ${page.file}`, count(list, /<li>/g) === page.positions.length);
  for (const [index, position] of page.positions.entries()) pass(`Posição ${index + 1} em ${page.file}`, new RegExp(`<li><span>${index + 1}<\\/span>[\\s\\S]*?<h3>${esc(position)}<\\/h3>`).test(list));
  for (const phrase of page.phrases) pass(`Conteúdo ${page.file}: ${phrase}`, html.includes(phrase));
  for (const href of [...coreLinks, ...legalLinks]) pass(`Link ${page.file}: ${href}`, html.includes(`href="${href}"`));
}

pass('Títulos únicos', new Set(titles).size === 5);
pass('Descrições únicas', new Set(descriptions).size === 5);
pass('Sem FAQPage estruturado', [...parsed.values()].every(h => !h.includes('FAQPage')));
pass('Sem promessas deterministas', [...parsed.values()].every(h => !/(resultado garantido|certeza absoluta|previsão infalível)/i.test(h)));
for (const page of pages) pass(`Rede temática: ${page.file}`, pages.filter(x => x.file !== page.file).every(x => parsed.get(page.file).includes(`href="${x.file}"`)));

const hub = read('tiragens-de-tarot.html');
const addedSection = '<section class="related-portals" aria-labelledby="spread-themes-title"><header class="section-heading"><p class="kicker">TIRAGENS POR TEMA</p><h2 id="spread-themes-title">Escolha a área e conheça cada posição</h2><p>Guias completos para vínculos, decisões, carreira, recursos materiais e prática espiritual responsável.</p></header><div class="related-grid"><a href="tarot-do-amor.html"><span aria-hidden="true">♡</span><strong>Tarot do Amor</strong><small>Vínculos, forças e limites</small></a><a href="tiragem-dois-caminhos.html"><span aria-hidden="true">◇</span><strong>Dois Caminhos</strong><small>Forças, desafios e critérios</small></a><a href="tarot-para-trabalho.html"><span aria-hidden="true">♙</span><strong>Trabalho e Carreira</strong><small>Talentos, ambiente e direção</small></a><a href="tarot-para-dinheiro.html"><span aria-hidden="true">⊕</span><strong>Dinheiro e Recursos</strong><small>Realidade, padrões e ação</small></a><a href="tarot-espiritual.html"><span aria-hidden="true">☉</span><strong>Caminho Espiritual</strong><small>Presença, sombra e integração</small></a></div></section>';
pass('Seção temática única no hub', count(hub, /id="spread-themes-title"/g) === 1 && hub.includes(addedSection));
for (const page of pages) pass(`Hub liga ${page.file}`, count(hub, new RegExp(`href="${esc(page.file)}"`, 'g')) === 1);
const recoveredHub = hub.replace(`    ${addedSection}\n`, '');
pass('Hub V162 preservado fora da seção', sha256(recoveredHub) === 'a56f0a974122681b9131e08e64b341c2ebc73b693768c26d6173baa70fa554d2', sha256(recoveredHub));

const sitemap = read('sitemap.xml');
pass('Sitemap com 113 URLs', count(sitemap, /<url>/g) === 113);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(x => !/\.(webp|png|jpe?g|svg)$/i.test(x));
pass('URLs únicas no sitemap', new Set(locs).size === 113);
let recoveredSitemap = sitemap;
for (const page of pages) {
  pass(`Sitemap inclui ${page.file}`, count(sitemap, new RegExp(`<loc>${esc(page.canonical)}<\\/loc>`, 'g')) === 1);
  recoveredSitemap = recoveredSitemap.replace(`  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`, '');
}
pass('Sitemap V162 preservado', sha256(recoveredSitemap) === 'c917900609e920e6fb8d255b03e7b14277a817f561440bc64f4e1a5debb3d263', sha256(recoveredSitemap));

const contract = JSON.parse(read('TIRAGENS-POR-TEMA-V163.json'));
pass('Contrato V163', contract.schemaVersion === '163.0.0');
pass('Contrato cinco páginas', contract.publicPages?.length === 5);
pass('Contrato 113 URLs', contract.discoverability?.sitemapUrlsAfter === 113);
pass('Contrato 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato preços', JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250,150,100,50]));
pass('Contrato e-mail obrigatório', contract.safeguards?.consultationEmailRequired === true);
pass('Contrato Tarot Livre', contract.safeguards?.tarotLivreChanged === false && contract.safeguards?.tarotLivreCards === 78);
pass('Contrato sem cobrança real', contract.safeguards?.realBillingEnabled === false);
pass('Contrato 11 arquivos', contract.installation?.filesInPackage === 11);

const manifest = new Map();
for (const line of read('ARQUIVOS-V163-SHA256.txt').trim().split(/\r?\n/)) { const m = line.match(/^([a-f0-9]{64})  (.+)$/); if (m) manifest.set(m[2], m[1]); }
const hashed = required.filter(x => x !== 'ARQUIVOS-V163-SHA256.txt');
pass('Manifesto dez hashes', manifest.size === 10, `${manifest.size}`);
for (const file of hashed) pass(`Hash ${file}`, manifest.get(file) === sha256(bytes(file)));

const stable = {
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701',
  'tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
  'consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
  'carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
  'escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
  'cartas-do-tarot.html':'647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede',
  'seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6',
  'robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd',
  'spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0'
};
const assets = ['card-02.webp','card-06.webp','card-11.webp','card-66.webp','card-69.webp','divina-orb-thumb-v1.webp','divina-icon-fast-v1.png','icon-512.png'];
const full = [...Object.keys(stable), ...assets].every(exists);
if (full) {
  for (const [file, hash] of Object.entries(stable)) pass(`Crítico preservado: ${file}`, sha256(bytes(file)) === hash);
  for (const asset of assets) pass(`Imagem disponível: ${asset}`, fs.statSync(filePath(asset)).size > 0);
  for (const page of pages) for (const ref of [...parsed.get(page.file).matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]).filter(x => !/^(https?:|mailto:|#)/.test(x))) { const clean = ref.split(/[?#]/)[0].replace(/^\.\//,''); pass(`Destino ${page.file}: ${ref}`, exists(clean || 'index.html')); }
  const policy = read('spreads-policy.js');
  for (const page of pages) for (const position of page.positions) pass(`Política preserva ${position}`, policy.includes(`'${position}'`));
  const free = read('tarot-livre.html'), consult = read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6', free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição', free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática', free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços', ['R$ 250','R$ 150','R$ 100','R$ 50'].every(x => consult.includes(x)));
  pass('Consultas preservam e-mail', consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result = { suite:'DIVINA-BRUXA-V163-TIRAGENS-POR-TEMA', status:failures.length?'FAIL':'PASS', mode:full?'full-project':'release-package', root, total:checks.length, passed:checks.filter(Boolean).length, failed:failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
