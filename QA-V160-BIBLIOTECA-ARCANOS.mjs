import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.argv[2] || process.cwd());
const checks = [];
const failures = [];

const pass = (name, condition, detail = '') => {
  checks.push({ name, passed: Boolean(condition), detail });
  if (!condition) failures.push(detail ? `${name}: ${detail}` : name);
};

const filePath = name => path.join(root, name);
const exists = name => fs.existsSync(filePath(name)) && fs.statSync(filePath(name)).isFile();
const read = name => fs.readFileSync(filePath(name), 'utf8');
const bytes = name => fs.readFileSync(filePath(name));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, expression) => [...value.matchAll(expression)].length;
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const required = [
  'sitemap.xml',
  'tarot-para-iniciantes.html',
  'arcanos-maiores.html',
  'arcanos-menores.html',
  'naipe-de-paus.html',
  'naipe-de-copas.html',
  'naipe-de-espadas.html',
  'naipe-de-ouros.html',
  '00-LEIA-PRIMEIRO-V160-BIBLIOTECA-ARCANOS.txt',
  'BIBLIOTECA-ARCANOS-V160.json',
  'QA-V160-BIBLIOTECA-ARCANOS.mjs',
  'ARQUIVOS-V160-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V160-BIBLIOTECA-ARCANOS',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const sitemap = read('sitemap.xml');
const beginner = read('tarot-para-iniciantes.html');
const contract = JSON.parse(read('BIBLIOTECA-ARCANOS-V160.json'));
const v159IndexHash = 'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701';
const v159SitemapHash = 'dcb6c98f35e5bebb7f833464a4d5d32b4f50cc02cff5ba3a8cbbbbf1a8e6c99c';
const v159BeginnerHash = '4feaccc22bb6b4ec2ab15ef49c96f116f500863c43296ca0451c33a974d7ef9a';

const newPages = [
  {
    file: 'arcanos-maiores.html',
    title: 'Arcanos Maiores: significado das 22 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/arcanos-maiores.html',
    image: 'card-00.webp',
    breadcrumbCount: 4,
    itemCount: 22,
    requiredPhrases: [
      'Os Arcanos Maiores contam uma jornada de transformação',
      'Quatro movimentos para compreender a sequência',
      'Significado dos 22 Arcanos Maiores',
      'Arquétipo não é sentença'
    ]
  },
  {
    file: 'arcanos-menores.html',
    title: 'Arcanos Menores: naipes e 56 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/arcanos-menores.html',
    image: 'tarot-temple-background-v1.webp',
    breadcrumbCount: 4,
    itemCount: 4,
    requiredPhrases: [
      'Os Arcanos Menores aproximam o símbolo da vida cotidiana',
      'Um sistema de quatro campos e quatorze movimentos',
      'Pajem, Cavaleiro, Rainha e Rei',
      'Leia por camadas, não por frases prontas',
      'Cotidiano não significa certeza'
    ]
  },
  {
    file: 'naipe-de-paus.html',
    title: 'Naipe de Paus: significado das 14 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/naipe-de-paus.html',
    image: 'card-36.webp',
    breadcrumbCount: 5,
    itemCount: 14,
    requiredPhrases: [
      'Paus acende o movimento entre desejo e realização',
      'NAIPE DE PAUS · ELEMENTO FOGO',
      'Significado das 14 cartas de Paus',
      'Entusiasmo, coragem para começar',
      'Muitas cartas de Paus significam sucesso?'
    ]
  },
  {
    file: 'naipe-de-copas.html',
    title: 'Naipe de Copas: significado das 14 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/naipe-de-copas.html',
    image: 'card-22.webp',
    breadcrumbCount: 5,
    itemCount: 14,
    requiredPhrases: [
      'Copas revela como os afetos encontram forma',
      'NAIPE DE COPAS · ELEMENTO ÁGUA',
      'Significado das 14 cartas de Copas',
      'Empatia, escuta, imaginação',
      'Muitas cartas de Copas garantem romance?'
    ]
  },
  {
    file: 'naipe-de-espadas.html',
    title: 'Naipe de Espadas: significado das 14 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/naipe-de-espadas.html',
    image: 'card-50.webp',
    breadcrumbCount: 5,
    itemCount: 14,
    requiredPhrases: [
      'Espadas separa ruído, verdade e escolha',
      'NAIPE DE ESPADAS · ELEMENTO AR',
      'Significado das 14 cartas de Espadas',
      'Clareza, análise, comunicação direta',
      'Uma carta de Espadas comprova mentira?'
    ]
  },
  {
    file: 'naipe-de-ouros.html',
    title: 'Naipe de Ouros: significado das 14 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/naipe-de-ouros.html',
    image: 'card-64.webp',
    breadcrumbCount: 5,
    itemCount: 14,
    requiredPhrases: [
      'Ouros transforma intenção em construção',
      'NAIPE DE OUROS · ELEMENTO TERRA',
      'Significado das 14 cartas de Ouros',
      'Constância, cuidado, habilidade prática',
      'Ouros fala somente de dinheiro?'
    ]
  }
];

const corePortalLinks = [
  'tarot-livre.html',
  'carta-do-dia.html',
  'tiragens-de-tarot.html',
  'escola-do-tarot.html',
  'consultas-de-tarot.html',
  'cartas-do-tarot.html'
];
const parsedPages = new Map();
const titles = [];
const descriptions = [];

for (const page of newPages) {
  const html = read(page.file);
  parsedPages.set(page.file, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title);
  descriptions.push(description);

  pass(`Título exato: ${page.file}`, title === page.title);
  pass(`Título adequado: ${page.file}`, title.length >= 20 && title.length <= 65, `${title.length} caracteres`);
  pass(`Descrição adequada: ${page.file}`,
    description.length >= 110 && description.length <= 170,
    `${description.length} caracteres`);
  pass(`Canonical correto: ${page.file}`,
    count(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(page.canonical)}">`, 'g')) === 1);
  pass(`Página indexável: ${page.file}`,
    html.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
  pass(`Idioma declarado: ${page.file}`, html.includes('<html lang="pt-BR">'));
  pass(`H1 único: ${page.file}`, count(html, /<h1(?:\s|>)/g) === 1);
  pass(`Main identificável: ${page.file}`, count(html, /<main\b[^>]*\bid="conteudo"[^>]*>/g) === 1);
  pass(`Link para pular conteúdo: ${page.file}`, html.includes('<a class="skip-link" href="#conteudo">'));
  pass(`CSS público reutilizado: ${page.file}`,
    count(html, /<link rel="stylesheet" href="seo-portal-v154\.css\?v=154">/g) === 1);
  pass(`Imagem principal declarada: ${page.file}`,
    count(html, new RegExp(`<img src="${escapeRegExp(page.image)}"`, 'g')) === 1);
  pass(`Imagem principal possui texto alternativo: ${page.file}`,
    new RegExp(`<img src="${escapeRegExp(page.image)}"[^>]+alt="[^"]{12,}"`).test(html));
  pass(`Sem imagem social não solicitada: ${page.file}`, count(html, /<meta[^>]+property="og:image"/g) === 0);
  pass(`Sem nome pessoal não confirmado: ${page.file}`, !/\b[ií]sis\b/i.test(html));
  pass(`Sem scripts executáveis: ${page.file}`,
    [...html.matchAll(/<script(?:\s[^>]*)?>/g)].every(match => /type="application\/ld\+json"/.test(match[0])));
  pass(`Tags article equilibradas: ${page.file}`, count(html, /<article(?:\s|>)/g) === count(html, /<\/article>/g));
  pass(`Tags section equilibradas: ${page.file}`, count(html, /<section(?:\s|>)/g) === count(html, /<\/section>/g));
  pass(`Tags details equilibradas: ${page.file}`, count(html, /<details(?:\s|>)/g) === count(html, /<\/details>/g));

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  pass(`IDs únicos: ${page.file}`, new Set(ids).size === ids.length);
  for (const labelled of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
    for (const id of labelled[1].split(/\s+/)) {
      pass(`aria-labelledby resolve em ${page.file}: ${id}`, ids.includes(id));
    }
  }

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  pass(`Um bloco JSON-LD: ${page.file}`, jsonLdBlocks.length === 1);
  let graph = [];
  try {
    graph = JSON.parse(jsonLdBlocks[0]?.[1] || '{}')['@graph'] || [];
    pass(`JSON-LD válido: ${page.file}`, true);
  } catch (error) {
    pass(`JSON-LD válido: ${page.file}`, false, error.message);
  }
  const breadcrumb = graph.find(item => item['@type'] === 'BreadcrumbList');
  const itemList = graph.find(item => item['@type'] === 'ItemList');
  const collection = graph.find(item => item['@type'] === 'CollectionPage');
  pass(`Breadcrumb estruturado: ${page.file}`,
    breadcrumb?.itemListElement?.length === page.breadcrumbCount);
  pass(`ItemList possui contagem correta: ${page.file}`,
    itemList?.numberOfItems === page.itemCount && itemList?.itemListElement?.length === page.itemCount);
  pass(`CollectionPage consistente: ${page.file}`,
    collection?.url === page.canonical && collection?.mainEntity?.['@id']?.endsWith('#list'));
  const organization = graph.find(item => item['@type'] === 'Organization');
  pass(`Organization consistente: ${page.file}`,
    organization?.name === 'Divina Bruxa' &&
    organization?.logo?.url === 'https://divinabruxa.com.br/icon-512.png');
  pass(`WebSite consistente: ${page.file}`,
    graph.some(item => item['@type'] === 'WebSite' && item.url === 'https://divinabruxa.com.br/'));
  pass(`Imagem estruturada correta: ${page.file}`,
    graph.some(item => item['@type'] === 'ImageObject' && item.contentUrl.endsWith(page.image)));

  for (const phrase of page.requiredPhrases) {
    pass(`Conteúdo essencial em ${page.file}: ${phrase}`, html.includes(phrase));
  }
  for (const href of corePortalLinks) {
    pass(`Portal ligado em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
  pass(`Guia iniciante ligado em ${page.file}`,
    count(html, /href="tarot-para-iniciantes\.html"/g) >= 1);
  pass(`Metodologia ligada em ${page.file}`,
    count(html, /href="metodologia-do-tarot\.html"/g) >= 1);
  pass(`Privacidade ligada em ${page.file}`,
    count(html, /href="privacidade-e-dados\.html"/g) >= 1);
  pass(`Termos ligados em ${page.file}`,
    count(html, /href="termos-de-uso\.html"/g) >= 1);
  pass(`Acessibilidade ligada em ${page.file}`,
    count(html, /href="acessibilidade\.html"/g) >= 1);
}

pass('Títulos da biblioteca são únicos', new Set(titles).size === newPages.length);
pass('Descrições da biblioteca são únicas', new Set(descriptions).size === newPages.length);
pass('Páginas não prometem certeza divinatória',
  [...parsedPages.values()].every(html => !/(garante o futuro|previsão infalível|certeza absoluta|comprova pensamentos)/i.test(html)));
pass('Páginas não substituem profissionais',
  [...parsedPages.values()].every(html => /(não substitu|orientação profissional)/i.test(html)));
pass('Nenhum FAQPage estruturado foi adicionado',
  [...parsedPages.values()].every(html => !html.includes('"@type": "FAQPage"')));

const majorCards = [
  ['O Louco', 'carta-00-o-louco.html'],
  ['O Mago', 'carta-01-o-mago.html'],
  ['A Sacerdotisa', 'carta-02-a-sacerdotisa.html'],
  ['A Imperatriz', 'carta-03-a-imperatriz.html'],
  ['O Imperador', 'carta-04-o-imperador.html'],
  ['O Hierofante', 'carta-05-o-hierofante.html'],
  ['Os Enamorados', 'carta-06-os-enamorados.html'],
  ['O Carro', 'carta-07-o-carro.html'],
  ['A Força', 'carta-08-a-forca.html'],
  ['O Eremita', 'carta-09-o-eremita.html'],
  ['A Roda da Fortuna', 'carta-10-a-roda-da-fortuna.html'],
  ['A Justiça', 'carta-11-a-justica.html'],
  ['O Pendurado', 'carta-12-o-pendurado.html'],
  ['A Morte', 'carta-13-a-morte.html'],
  ['A Temperança', 'carta-14-a-temperanca.html'],
  ['O Diabo', 'carta-15-o-diabo.html'],
  ['A Torre', 'carta-16-a-torre.html'],
  ['A Estrela', 'carta-17-a-estrela.html'],
  ['A Lua', 'carta-18-a-lua.html'],
  ['O Sol', 'carta-19-o-sol.html'],
  ['O Julgamento', 'carta-20-o-julgamento.html'],
  ['O Mundo', 'carta-21-o-mundo.html']
];
const ranks = ['as', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'pajem', 'cavaleiro', 'rainha', 'rei'];
const suits = ['paus', 'copas', 'espadas', 'ouros'];
const majorHtml = parsedPages.get('arcanos-maiores.html');
for (const [name, href] of majorCards) {
  pass(`Arcano Maior ligado: ${name}`,
    count(majorHtml, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
}
pass('Lista visível possui 22 Arcanos Maiores',
  count(majorHtml.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 22);

const minorHtml = parsedPages.get('arcanos-menores.html');
for (const suit of suits) {
  pass(`Naipe ligado no hub dos Menores: ${suit}`,
    count(minorHtml, new RegExp(`href="naipe-de-${suit}\.html"`, 'g')) >= 2);
}

for (const suit of suits) {
  const html = parsedPages.get(`naipe-de-${suit}.html`);
  for (const rank of ranks) {
    const href = `carta-${rank}-de-${suit}.html`;
    pass(`Carta ligada em ${suit}: ${rank}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
  pass(`Lista visível possui 14 cartas de ${suit}`,
    count(html.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 14);
  pass(`Página ${suit} liga os outros três naipes`,
    suits.filter(other => other !== suit).every(other => html.includes(`href="naipe-de-${other}.html"`)));
  pass(`Página ${suit} mantém posição direta`, html.includes('posição direta'));
  pass(`Página ${suit} rejeita veredito`, html.includes('Significado não é veredito'));
}

const oldStructure = '<section class="content-section" aria-labelledby="begin-structure-title"><header class="section-heading"><p class="kicker">A ESTRUTURA DO BARALHO</p><h2 id="begin-structure-title">Duas grandes famílias, quatro naipes</h2></header><div class="feature-grid"><article><span>22</span><h3>Arcanos Maiores</h3><p>Do Louco ao Mundo, apresentam grandes temas, passagens e arquétipos. Em uma leitura, costumam ampliar o peso simbólico da posição que ocupam.</p></article><article><span>56</span><h3>Arcanos Menores</h3><p>Descrevem movimentos do cotidiano por meio de quatro naipes. Cada naipe tem Ás, cartas de 2 a 10 e quatro figuras da corte.</p></article><article><span>40</span><h3>Cartas numeradas</h3><p>São dez cartas em cada naipe. O número oferece uma estrutura; o naipe mostra o campo em que aquela dinâmica se expressa.</p></article><article><span>16</span><h3>Figuras da corte</h3><p>Pajem, Cavaleiro, Rainha e Rei aparecem nos quatro naipes e podem indicar atitudes, papéis, modos de agir ou pessoas no contexto.</p></article></div></section>';
const newStructure = '<section class="content-section" aria-labelledby="begin-structure-title"><header class="section-heading"><p class="kicker">A ESTRUTURA DO BARALHO</p><h2 id="begin-structure-title">Duas grandes famílias, quatro naipes</h2></header><div class="feature-grid"><article><span>22</span><h3><a href="arcanos-maiores.html">Arcanos Maiores</a></h3><p>Do Louco ao Mundo, apresentam grandes temas, passagens e arquétipos. Em uma leitura, costumam ampliar o peso simbólico da posição que ocupam.</p></article><article><span>56</span><h3><a href="arcanos-menores.html">Arcanos Menores</a></h3><p>Descrevem movimentos do cotidiano por meio de quatro naipes. Cada naipe tem Ás, cartas de 2 a 10 e quatro figuras da corte.</p></article><article><span>40</span><h3>Cartas numeradas</h3><p>São dez cartas em cada naipe. O número oferece uma estrutura; o naipe mostra o campo em que aquela dinâmica se expressa.</p></article><article><span>16</span><h3>Figuras da corte</h3><p>Pajem, Cavaleiro, Rainha e Rei aparecem nos quatro naipes e podem indicar atitudes, papéis, modos de agir ou pessoas no contexto.</p></article></div></section>';
const oldSuits = '<section class="content-section" aria-labelledby="begin-suits-title"><header class="section-heading"><p class="kicker">OS QUATRO NAIPES</p><h2 id="begin-suits-title">Quatro lentes para a experiência cotidiana</h2><p>As associações abaixo são pontos de partida. Observe sempre a imagem da carta e a pergunta feita.</p></header><div class="feature-grid"><article><span>♧</span><h3>Paus</h3><p>Ação, energia, impulso criativo, desejo de realizar e maneira de ocupar espaço.</p></article><article><span>♡</span><h3>Copas</h3><p>Afetos, vínculos, sensibilidade, imaginação e modo de receber ou expressar sentimentos.</p></article><article><span>♢</span><h3>Espadas</h3><p>Pensamento, comunicação, conflito, decisão e forma de lidar com verdades e limites.</p></article><article><span>◇</span><h3>Ouros</h3><p>Corpo, recursos, trabalho, cuidado material e aquilo que precisa ganhar forma concreta.</p></article></div></section>';
const newSuits = '<section class="content-section" aria-labelledby="begin-suits-title"><header class="section-heading"><p class="kicker">OS QUATRO NAIPES</p><h2 id="begin-suits-title">Quatro lentes para a experiência cotidiana</h2><p>As associações abaixo são pontos de partida. Observe sempre a imagem da carta e a pergunta feita.</p></header><div class="feature-grid"><article><span>♧</span><h3><a href="naipe-de-paus.html">Paus</a></h3><p>Ação, energia, impulso criativo, desejo de realizar e maneira de ocupar espaço.</p></article><article><span>♡</span><h3><a href="naipe-de-copas.html">Copas</a></h3><p>Afetos, vínculos, sensibilidade, imaginação e modo de receber ou expressar sentimentos.</p></article><article><span>♢</span><h3><a href="naipe-de-espadas.html">Espadas</a></h3><p>Pensamento, comunicação, conflito, decisão e forma de lidar com verdades e limites.</p></article><article><span>◇</span><h3><a href="naipe-de-ouros.html">Ouros</a></h3><p>Corpo, recursos, trabalho, cuidado material e aquilo que precisa ganhar forma concreta.</p></article></div></section>';

pass('Guia iniciante possui seis novos caminhos',
  ['arcanos-maiores.html', 'arcanos-menores.html', ...suits.map(suit => `naipe-de-${suit}.html`)]
    .every(href => count(beginner, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) === 1));
let recoveredV159Beginner = beginner.replace(newStructure, oldStructure).replace(newSuits, oldSuits);
pass('Guia iniciante preserva integralmente a V159 fora dos seis links',
  sha256(recoveredV159Beginner) === v159BeginnerHash,
  `hash recuperado ${sha256(recoveredV159Beginner)}`);

pass('Sitemap possui 101 URLs', count(sitemap, /<url>/g) === 101);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 101,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of newPages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}

const addedSitemapBlocks = newPages.map(page => {
  const priority = ['arcanos-maiores.html', 'arcanos-menores.html'].includes(page.file) ? '0.8' : '0.7';
  return `  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
});
let recoveredV159Sitemap = sitemap;
for (const block of addedSitemapBlocks) recoveredV159Sitemap = recoveredV159Sitemap.replace(block, '');
pass('Sitemap preserva integralmente as 95 URLs da V159',
  sha256(recoveredV159Sitemap) === v159SitemapHash,
  `hash recuperado ${sha256(recoveredV159Sitemap)}`);

pass('Contrato declara versão 160', contract.schemaVersion === '160.0.0');
pass('Contrato registra seis páginas públicas', contract.publicPages?.length === 6);
pass('Contrato registra 101 URLs', contract.discoverability?.sitemapUrlsAfter === 101);
pass('Contrato registra 78 imagens no sitemap', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra 22 Maiores', contract.deckArchitecture?.majorArcana === 22);
pass('Contrato registra 56 Menores', contract.deckArchitecture?.minorArcana === 56);
pass('Contrato registra quatro naipes', contract.deckArchitecture?.suits === 4);
pass('Contrato registra 14 cartas por naipe', contract.deckArchitecture?.cardsPerSuit === 14);
pass('Contrato registra orientação direta', contract.deckArchitecture?.orientation === 'upright-only');
pass('Contrato registra 22 links de Maiores', contract.internalLinking?.majorCardLinks === 22);
pass('Contrato registra 56 links de Naipes', contract.internalLinking?.suitCardLinks === 56);
pass('Contrato registra Home intacta', contract.safeguards?.indexChanged === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsFunctionalCodeChanged === false);
pass('Contrato preserva preços',
  JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250, 150, 100, 50]));
pass('Contrato preserva e-mail obrigatório', contract.safeguards?.consultationEmailRequired === true);
pass('Contrato mantém Resend adiado', contract.safeguards?.resendConfigured === false);
pass('Contrato não adiciona imagem social', contract.contentQuality?.socialPreviewImageAdded === false);
pass('Contrato registra doze arquivos de instalação', contract.installation?.filesInPackage === 12);

const manifestLines = read('ARQUIVOS-V160-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V160-SHA256.txt');
pass('Manifesto contém onze hashes', manifest.size === hashedFiles.length, `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`, manifest.get(name) === sha256(bytes(name)));
}

const stableFiles = {
  'index.html': v159IndexHash,
  'tarot-livre.html': '57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
  'consultas-de-tarot.html': '35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
  'carta-do-dia.html': 'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
  'tiragens-de-tarot.html': '2de13b11577422f80ce32a27d987dd4e9afe7438e18816582c53327a1efcb416',
  'escola-do-tarot.html': 'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
  'cartas-do-tarot.html': '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede',
  'guias-para-comecar.html': 'c9f410da98667737e1fc4b5f175ce11188aecc4fc2697cbb69f36d2020fe8529',
  'como-fazer-perguntas-ao-tarot.html': '3e7747d0732ff4e2916be767ebebdc4921ff0dbe3eab3e1dd53b1b4016b8dc7d',
  'seo-portal-v154.css': '242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6',
  'robots.txt': '7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd'
};
const supportingAssets = [
  'card-00.webp',
  'card-22.webp',
  'card-36.webp',
  'card-50.webp',
  'card-64.webp',
  'tarot-temple-background-v1.webp',
  'divina-orb-thumb-v1.webp',
  'divina-icon-fast-v1.png',
  'icon-512.png',
  'tarot-data.js'
];
const fullProject = [...Object.keys(stableFiles), ...supportingAssets].every(exists);

if (fullProject) {
  for (const [name, hash] of Object.entries(stableFiles)) {
    pass(`Arquivo crítico preservado byte a byte: ${name}`, sha256(bytes(name)) === hash);
  }
  for (const asset of supportingAssets) {
    pass(`Dependência disponível: ${asset}`, fs.statSync(filePath(asset)).size > 0);
  }

  for (const page of newPages) {
    const html = parsedPages.get(page.file);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    const localRefs = refs.filter(ref => !/^(?:https?:|mailto:|#)/.test(ref));
    for (const ref of localRefs) {
      const clean = ref.split(/[?#]/)[0];
      const target = clean === '' || clean === '.' || clean === './' ? 'index.html' : clean;
      pass(`Dependência local de ${page.file}: ${ref}`, exists(target));
    }
  }

  for (const [, href] of majorCards) pass(`Destino de Arcano existe: ${href}`, exists(href));
  for (const suit of suits) {
    for (const rank of ranks) {
      const href = `carta-${rank}-de-${suit}.html`;
      pass(`Destino de carta existe: ${href}`, exists(href));
    }
  }

  const tarotData = read('tarot-data.js');
  pass('Catálogo canônico mantém orientação normal', tarotData.includes("REQUIRED_ORIENTATION = 'normal'"));
  pass('Catálogo canônico mantém 22 Maiores',
    count(tarotData.match(/const MAJOR_ARCANA = \[([\s\S]*?)\n\];/)?.[1] || '', /^  \[/gm) === 22);
  pass('Catálogo canônico mantém quatro naipes',
    count(tarotData.match(/const SUITS = \[([\s\S]*?)\n\];/)?.[1] || '', /^  \{/gm) === 4);
  pass('Mapeamento oficial das imagens de naipes preservado',
    [
      "slug: 'copas', element: 'Água', domain: 'emoções, vínculos e intuição', atlasStart: 22",
      "slug: 'espadas', element: 'Ar', domain: 'pensamento, verdade e decisões', atlasStart: 50",
      "slug: 'paus', element: 'Fogo', domain: 'energia, coragem e criatividade', atlasStart: 36",
      "slug: 'ouros', element: 'Terra', domain: 'corpo, trabalho e recursos', atlasStart: 64"
    ].every(value => tarotData.includes(value)));

  const tarotLivre = read('tarot-livre.html');
  const consultations = read('consultas-de-tarot.html');
  pass('Tarot Livre mantém Mesa Real 13 × 6', tarotLivre.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre mantém 78 cartas diretas e sem repetição',
    tarotLivre.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => consultations.includes(price)));
  pass('Consultas mantêm e-mail obrigatório', consultations.includes('Seu e-mail é obrigatório para o contato'));
}

const result = {
  suite: 'DIVINA-BRUXA-V160-BIBLIOTECA-ARCANOS',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
