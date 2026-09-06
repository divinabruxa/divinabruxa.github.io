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
  'tiragens-de-tarot.html',
  'tiragem-de-uma-carta.html',
  'tiragem-de-tres-cartas.html',
  'cruz-celta-no-tarot.html',
  'mesa-real-no-tarot.html',
  '00-LEIA-PRIMEIRO-V162-TIRAGENS-FUNDAMENTAIS.txt',
  'TIRAGENS-FUNDAMENTAIS-V162.json',
  'QA-V162-TIRAGENS-FUNDAMENTAIS.mjs',
  'ARQUIVOS-V162-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V162-TIRAGENS-FUNDAMENTAIS',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const sitemap = read('sitemap.xml');
const spreadsHub = read('tiragens-de-tarot.html');
const contract = JSON.parse(read('TIRAGENS-FUNDAMENTAIS-V162.json'));
const v161IndexHash = 'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701';
const v161SitemapHash = '4048181228c139d7f8f461c51e60bb49c6f4ae08bb136cae8d41436e674a345e';
const v161SpreadsHubHash = '2de13b11577422f80ce32a27d987dd4e9afe7438e18816582c53327a1efcb416';

const celticPositions = [
  'Presente',
  'Desafio',
  'Fundamento',
  'Passado recente',
  'Possibilidade consciente',
  'Futuro próximo',
  'Você',
  'Ambiente',
  'Esperanças e medos',
  'Síntese'
];

const pages = [
  {
    file: 'tiragem-de-uma-carta.html',
    title: 'Tiragem de Uma Carta: como fazer e interpretar | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/tiragem-de-uma-carta.html',
    image: 'card-17.webp',
    requiredPhrases: [
      'Tiragem de Uma Carta: clareza sem simplificar demais',
      'MÉTODO EM CINCO PASSOS',
      'Mensagem central',
      'A mesma carta muda com a posição',
      'Quatro camadas para não depender de uma palavra-chave',
      'Uma carta abre reflexão; não decreta um resultado'
    ]
  },
  {
    file: 'tiragem-de-tres-cartas.html',
    title: 'Tiragem de Três Cartas: métodos e interpretação | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/tiragem-de-tres-cartas.html',
    image: 'templo-tiragens-celestial-v1.webp',
    requiredPhrases: [
      'Tiragem de Três Cartas: enxergue o movimento da questão',
      'TRÊS MÉTODOS OFICIAIS',
      'Passado · Presente · Tendência',
      'Triângulo Mágico',
      'Situação · Desafio · Conselho',
      'Relação simbólica não é comprovação'
    ]
  },
  {
    file: 'cruz-celta-no-tarot.html',
    title: 'Cruz Celta no Tarot: significado das 10 posições | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/cruz-celta-no-tarot.html',
    image: 'tarot-temple-background-v1.webp',
    requiredPhrases: [
      'Cruz Celta no Tarot: um mapa profundo da questão',
      'A SEQUÊNCIA OFICIAL DO SITE',
      'Significado das 10 posições da Cruz Celta',
      'Existem variações históricas nos nomes e na ordem',
      'Profundidade exige limites claros'
    ]
  },
  {
    file: 'mesa-real-no-tarot.html',
    title: 'Mesa Real no Tarot: guia da disposição 13 × 6 | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/mesa-real-no-tarot.html',
    image: 'consultas-celestiais-santuario-v1.webp',
    requiredPhrases: [
      'Mesa Real no Tarot: o baralho inteiro em uma visão',
      'O que é a Mesa Real 13 × 6',
      'TRÊS EXPERIÊNCIAS, LIMITES CLAROS',
      'Tarot Livre, Premium e consulta profissional não são a mesma coisa',
      'A estrutura organiza a sequência; não cria um significado universal para cada fileira',
      'Uma visão ampla continua sendo simbólica'
    ]
  }
];

const coreLinks = [
  'tarot-livre.html',
  'carta-do-dia.html',
  'tiragens-de-tarot.html',
  'escola-do-tarot.html',
  'consultas-de-tarot.html',
  'cartas-do-tarot.html'
];
const legalLinks = [
  'sobre-a-divina-bruxa.html',
  'metodologia-do-tarot.html',
  'etica-e-responsabilidade.html',
  'privacidade-e-dados.html',
  'termos-de-uso.html',
  'acessibilidade.html',
  'contato.html'
];
const parsed = new Map();
const titles = [];
const descriptions = [];

for (const page of pages) {
  const html = read(page.file);
  parsed.set(page.file, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title);
  descriptions.push(description);

  pass(`Título exato: ${page.file}`, title === page.title);
  pass(`Título adequado: ${page.file}`, title.length >= 35 && title.length <= 65, `${title.length} caracteres`);
  pass(`Descrição adequada: ${page.file}`,
    description.length >= 120 && description.length <= 165,
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
  const article = graph.find(item => item['@type'] === 'Article');
  const webPage = graph.find(item => item['@type'] === 'WebPage');
  pass(`Breadcrumb estruturado: ${page.file}`, breadcrumb?.itemListElement?.length === 3);
  pass(`Article consistente: ${page.file}`,
    article?.url === page.canonical && article?.publisher?.['@id'] === 'https://divinabruxa.com.br/#organization');
  pass(`WebPage consistente: ${page.file}`, webPage?.url === page.canonical);
  pass(`Organization consistente: ${page.file}`,
    graph.some(item => item['@type'] === 'Organization' && item.name === 'Divina Bruxa' && item.logo?.url === 'https://divinabruxa.com.br/icon-512.png'));
  pass(`WebSite consistente: ${page.file}`,
    graph.some(item => item['@type'] === 'WebSite' && item.url === 'https://divinabruxa.com.br/'));
  pass(`Imagem estruturada correta: ${page.file}`,
    graph.some(item => item['@type'] === 'ImageObject' && item.contentUrl.endsWith(page.image)));

  for (const phrase of page.requiredPhrases) {
    pass(`Conteúdo essencial em ${page.file}: ${phrase}`, html.includes(phrase));
  }
  for (const href of coreLinks) {
    pass(`Portal ligado em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
  for (const href of legalLinks) {
    pass(`Página institucional ligada em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
}

pass('Títulos novos são únicos', new Set(titles).size === pages.length);
pass('Descrições novas são únicas', new Set(descriptions).size === pages.length);
pass('Nenhum FAQPage estruturado foi adicionado',
  [...parsed.values()].every(html => !html.includes('"@type":"FAQPage"') && !html.includes('"@type": "FAQPage"')));
pass('Nenhuma página promete previsão infalível',
  [...parsed.values()].every(html => !/(garante o futuro|previsão infalível|certeza absoluta|resultado garantido)/i.test(html)));

for (const target of pages.map(page => page.file)) {
  const otherPages = pages.filter(page => page.file !== target).map(page => page.file);
  const html = parsed.get(target);
  pass(`Rede de tiragens conectada em ${target}`,
    otherPages.every(other => html.includes(`href="${other}"`)));
}

const oneCard = parsed.get('tiragem-de-uma-carta.html');
pass('Uma Carta apresenta cinco passos',
  count(oneCard.match(/<ol class="step-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 5);
pass('Uma Carta rejeita confirmação compulsiva', oneCard.includes('repetir até chegar à resposta desejada aumenta o ruído'));
pass('Uma Carta liga o exemplo à Estrela', oneCard.includes('href="carta-17-a-estrela.html"'));

const threeCards = parsed.get('tiragem-de-tres-cartas.html');
const officialThreeCardText = [
  'Passado · raiz', 'Presente', 'Tendência · conselho',
  'O que se manifesta', 'O que pede consciência', 'O caminho possível',
  'Situação', 'Desafio', 'Conselho'
];
for (const position of officialThreeCardText) {
  pass(`Três Cartas preserva posição oficial: ${position}`, threeCards.includes(position));
}
pass('Três Cartas apresenta cinco passos',
  count(threeCards.match(/<ol class="step-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 5);
pass('Três Cartas mantém tendência aberta', threeCards.includes('Tendência é continuidade possível sob condições atuais'));

const celtic = parsed.get('cruz-celta-no-tarot.html');
const celticVisibleList = celtic.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '';
pass('Cruz Celta possui dez blocos visíveis', count(celticVisibleList, /<li>/g) === 10);
for (const [index, position] of celticPositions.entries()) {
  pass(`Cruz Celta exibe posição ${index + 1}: ${position}`,
    new RegExp(`<li><span>${index + 1}<\\/span>[\\s\\S]*?<h3>${escapeRegExp(position)}<\\/h3>`).test(celticVisibleList));
}
const celticGraph = JSON.parse(celtic.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')['@graph'] || [];
const celticItemList = celticGraph.find(item => item['@type'] === 'ItemList');
pass('Cruz Celta estrutura dez posições no JSON-LD',
  celticItemList?.numberOfItems === 10 && celticItemList?.itemListElement?.length === 10);
pass('Cruz Celta mantém nomes e ordem no JSON-LD',
  JSON.stringify(celticItemList?.itemListElement?.map(item => item.name)) === JSON.stringify(celticPositions));
pass('Cruz Celta trata Futuro próximo como tendência', celtic.includes('Uma tendência sob as condições atuais'));

const royal = parsed.get('mesa-real-no-tarot.html');
pass('Mesa Real declara 78 cartas', royal.includes('<dd>78 cartas</dd>'));
pass('Mesa Real declara 13 fileiras', royal.includes('<dd>13</dd>'));
pass('Mesa Real declara 6 colunas', royal.includes('<dd>6</dd>'));
pass('Mesa Real separa Tarot Livre', royal.includes('<h3>Tarot Livre</h3>') && royal.includes('<strong>Gratuito</strong>'));
pass('Mesa Real separa modo Premium', royal.includes('<h3>Mesa Real em Tiragens</h3>') && royal.includes('<strong>Premium</strong>'));
pass('Mesa Real separa consulta humana', royal.includes('<h3>Mesa Real Profissional</h3>') && royal.includes('<strong>R$ 250</strong>'));
pass('Mesa Real preserva imagens somente no Tarot Livre', royal.includes('Não mostra nome ou significado automático durante a abertura'));
pass('Mesa Real preserva e-mail obrigatório', royal.includes('E-mail da pessoa obrigatório'));
pass('Mesa Real preserva confirmação por e-mail', royal.includes('Confirmação por e-mail'));
pass('Mesa Real preserva ausência de cobrança automática', royal.includes('Sem cobrança automática'));
pass('Mesa Real rejeita casas universais inventadas', royal.includes('sem impor casas universais a cada linha'));

const addedGuideSection = '<section class="related-portals" aria-labelledby="spread-guides-title"><header class="section-heading"><p class="kicker">GUIAS DAS TIRAGENS FUNDAMENTAIS</p><h2 id="spread-guides-title">Aprenda a função de cada posição antes de revelar</h2><p>Conheça o método, a ordem de leitura e os limites responsáveis das estruturas mais procuradas.</p></header><div class="related-grid"><a href="tiragem-de-uma-carta.html"><span aria-hidden="true">1</span><strong>Uma Carta</strong><small>Foco, pergunta e interpretação</small></a><a href="tiragem-de-tres-cartas.html"><span aria-hidden="true">3</span><strong>Três Cartas</strong><small>Métodos, relações e síntese</small></a><a href="cruz-celta-no-tarot.html"><span aria-hidden="true">10</span><strong>Cruz Celta</strong><small>As dez posições oficiais</small></a><a href="mesa-real-no-tarot.html"><span aria-hidden="true">78</span><strong>Mesa Real</strong><small>O baralho completo em 13 × 6</small></a></div></section>';
pass('Hub de Tiragens possui nova seção uma única vez',
  count(spreadsHub, /id="spread-guides-title"/g) === 1 && spreadsHub.includes(addedGuideSection));
for (const page of pages) {
  pass(`Hub de Tiragens liga ${page.file}`,
    count(spreadsHub, new RegExp(`href="${escapeRegExp(page.file)}"`, 'g')) === 1);
}
const recoveredV161SpreadsHub = spreadsHub.replace(`    ${addedGuideSection}\n`, '');
pass('Hub de Tiragens preserva integralmente a V161 fora da nova seção',
  sha256(recoveredV161SpreadsHub) === v161SpreadsHubHash,
  `hash recuperado ${sha256(recoveredV161SpreadsHub)}`);

pass('Sitemap possui 108 URLs', count(sitemap, /<url>/g) === 108);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 108,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of pages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}
const sitemapBlocks = pages.map(page => `  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`);
let recoveredV161Sitemap = sitemap;
for (const block of sitemapBlocks) recoveredV161Sitemap = recoveredV161Sitemap.replace(block, '');
pass('Sitemap preserva integralmente as 104 URLs da V161',
  sha256(recoveredV161Sitemap) === v161SitemapHash,
  `hash recuperado ${sha256(recoveredV161Sitemap)}`);

pass('Contrato declara versão 162', contract.schemaVersion === '162.0.0');
pass('Contrato registra quatro páginas públicas', contract.publicPages?.length === 4);
pass('Contrato registra 108 URLs', contract.discoverability?.sitemapUrlsAfter === 108);
pass('Contrato registra 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra três métodos de três cartas', contract.spreadsArchitecture?.threeCardMethods?.length === 3);
pass('Contrato registra dez posições da Cruz Celta',
  JSON.stringify(contract.spreadsArchitecture?.celticCrossPositions) === JSON.stringify(celticPositions));
pass('Contrato registra Mesa Real 13 × 6',
  contract.spreadsArchitecture?.royalTable?.cards === 78 &&
  contract.spreadsArchitecture?.royalTable?.rows === 13 &&
  contract.spreadsArchitecture?.royalTable?.columns === 6);
pass('Contrato rejeita significados fixos por fileira', contract.spreadsArchitecture?.royalTable?.fixedRowMeanings === false);
pass('Contrato registra orientação direta', contract.spreadsArchitecture?.orientation === 'upright-only');
pass('Contrato registra Tarot Livre apenas com imagens', contract.royalTableSeparation?.freeTarot?.imagesOnlyDuringReveal === true);
pass('Contrato registra Mesa Real Profissional a R$ 250', contract.royalTableSeparation?.professionalConsultation?.priceBrl === 250);
pass('Contrato registra Home intacta', contract.safeguards?.indexChanged === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsFunctionalCodeChanged === false);
pass('Contrato preserva preços',
  JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250, 150, 100, 50]));
pass('Contrato preserva e-mail obrigatório', contract.safeguards?.consultationEmailRequired === true);
pass('Contrato mantém Resend adiado', contract.safeguards?.resendConfigured === false);
pass('Contrato não adiciona imagem social', contract.contentQuality?.socialPreviewImageAdded === false);
pass('Contrato registra dez arquivos de instalação', contract.installation?.filesInPackage === 10);

const manifestLines = read('ARQUIVOS-V162-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V162-SHA256.txt');
pass('Manifesto contém nove hashes', manifest.size === hashedFiles.length, `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`, manifest.get(name) === sha256(bytes(name)));
}

const stableFiles = {
  'index.html': v161IndexHash,
  'tarot-livre.html': '57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
  'consultas-de-tarot.html': '35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
  'carta-do-dia.html': 'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
  'escola-do-tarot.html': 'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
  'cartas-do-tarot.html': '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede',
  'seo-portal-v154.css': '242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6',
  'robots.txt': '7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd',
  'spreads-policy.js': 'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0',
  'consultation-policy.js': 'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3',
  'consultation-engine.js': '745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050'
};
const supportingAssets = [
  'card-17.webp',
  'templo-tiragens-celestial-v1.webp',
  'tarot-temple-background-v1.webp',
  'consultas-celestiais-santuario-v1.webp',
  'divina-orb-thumb-v1.webp',
  'divina-icon-fast-v1.png',
  'icon-512.png'
];
const fullProject = [...Object.keys(stableFiles), ...supportingAssets].every(exists);

if (fullProject) {
  for (const [name, hash] of Object.entries(stableFiles)) {
    pass(`Arquivo crítico preservado byte a byte: ${name}`, sha256(bytes(name)) === hash);
  }
  for (const asset of supportingAssets) {
    pass(`Dependência visual disponível: ${asset}`, fs.statSync(filePath(asset)).size > 0);
  }

  for (const page of pages) {
    const html = parsed.get(page.file);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    const localRefs = refs.filter(ref => !/^(?:https?:|mailto:|#)/.test(ref));
    for (const ref of localRefs) {
      const clean = ref.split(/[?#]/)[0];
      const target = clean === '' || clean === '.' || clean === './' ? 'index.html' : clean.replace(/^\.\//, '') || 'index.html';
      pass(`Dependência local de ${page.file}: ${ref}`, exists(target));
    }
  }

  const spreadsPolicy = read('spreads-policy.js');
  pass('Política mantém Uma Carta oficial',
    spreadsPolicy.includes("name: 'Uma Carta'") && spreadsPolicy.includes("positions: ['Mensagem central']"));
  const officialThreeMethods = [
    "positions: ['Passado · raiz', 'Presente', 'Tendência · conselho']",
    "positions: ['O que se manifesta', 'O que pede consciência', 'O caminho possível']",
    "positions: ['Situação', 'Desafio', 'Conselho']"
  ];
  for (const method of officialThreeMethods) pass(`Política mantém trio: ${method}`, spreadsPolicy.includes(method));
  pass('Política mantém a ordem da Cruz Celta',
    spreadsPolicy.includes(`positions: [${celticPositions.map(position => `'${position}'`).join(', ')}]`));
  pass('Política mantém Mesa Real com 78 posições',
    spreadsPolicy.includes("id: 'royal-table'") && spreadsPolicy.includes('Array.from({ length: 78 }'));

  const tarotLivre = read('tarot-livre.html');
  const consultations = read('consultas-de-tarot.html');
  const consultationPolicy = read('consultation-policy.js');
  pass('Tarot Livre mantém Mesa Real 13 × 6', tarotLivre.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre mantém 78 cartas diretas e sem repetição',
    tarotLivre.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre mantém ausência de interpretação automática',
    tarotLivre.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => consultations.includes(price)));
  pass('Consultas mantêm e-mail obrigatório', consultations.includes('Seu e-mail é obrigatório para o contato'));
  pass('Consultas mantêm confirmação antes de pagamento',
    consultations.includes('recebe a confirmação por e-mail antes de qualquer pagamento'));
  pass('Política mantém ambiente staging', consultationPolicy.includes("environment:'staging'"));
  pass('Política mantém cobrança real desligada', consultationPolicy.includes('realBilling:false'));
  pass('Política mantém e-mail oficial', consultationPolicy.includes("contactEmail:'orbedasrealidades@hotmail.com'"));
}

const result = {
  suite: 'DIVINA-BRUXA-V162-TIRAGENS-FUNDAMENTAIS',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
