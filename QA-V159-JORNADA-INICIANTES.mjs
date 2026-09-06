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
  'index.html',
  'sitemap.xml',
  'guias-para-comecar.html',
  'tarot-para-iniciantes.html',
  'como-fazer-perguntas-ao-tarot.html',
  '00-LEIA-PRIMEIRO-V159-JORNADA-INICIANTES.txt',
  'JORNADA-INICIANTES-V159.json',
  'QA-V159-JORNADA-INICIANTES.mjs',
  'ARQUIVOS-V159-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V159-JORNADA-INICIANTES',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const index = read('index.html');
const sitemap = read('sitemap.xml');
const contract = JSON.parse(read('JORNADA-INICIANTES-V159.json'));
const googleToken = 'VJjhRxQ18euRcUn_hPcAtTNi5Dj-qX3kjr7-xzvAT8k';
const v158IndexHash = '8700ba91f31b92b528041013e1b62352d232d8375e10ce444a6429b083914a22';
const v158SitemapHash = '0d942e918bd060167c3d2a391039bc95b05ac23e4ba1f0060bb90db9e045ce6d';

pass('Metatag oficial do Search Console preservada',
  count(index, new RegExp(`<meta name="google-site-verification" content="${googleToken}">`, 'g')) === 1);
pass('Token do Google aparece uma única vez', count(index, new RegExp(googleToken, 'g')) === 1);
pass('CSS de navegação pública preservado',
  count(index, /<link rel="stylesheet" href="seo-navigation-v156\.css\?v=156">/g) === 1);
pass('Navegação pública aparece uma única vez', count(index, /<nav class="magic-menu-guides"/g) === 1);

const guideMatch = index.match(/<nav class="magic-menu-guides"[^>]*>[\s\S]*?<\/nav>/);
const guide = guideMatch?.[0] || '';
pass('Navegação possui rótulo acessível',
  guide.includes('aria-label="Aprenda, explore e conheça seus direitos na Divina Bruxa"'));
pass('Navegação fica dentro do Menu Mágico',
  index.indexOf(guide) > index.indexOf('<aside id="drawer"') &&
  index.indexOf(guide) < index.indexOf('</aside>', index.indexOf('<aside id="drawer"')));
pass('Menu possui três grupos visíveis',
  count(guide, /<strong>/g) === 3 &&
  guide.includes('<strong>COMECE POR AQUI</strong>') &&
  guide.includes('<strong>GUIAS E INFORMAÇÕES</strong>') &&
  guide.includes('<strong>PRIVACIDADE E DIREITOS</strong>'));

const expectedGuideLinks = [
  ['guias-para-comecar.html', 'Guias para começar no Tarot'],
  ['tarot-livre.html', 'Tarot Livre online'],
  ['carta-do-dia.html', 'Carta do Dia no Tarot'],
  ['tiragens-de-tarot.html', 'Tiragens de Tarot'],
  ['escola-do-tarot.html', 'Escola do Tarot'],
  ['consultas-de-tarot.html', 'Consultas de Tarot'],
  ['cartas-do-tarot.html', 'Significados das 78 cartas'],
  ['sobre-a-divina-bruxa.html', 'Sobre a Divina Bruxa'],
  ['metodologia-do-tarot.html', 'Metodologia do Tarot'],
  ['etica-e-responsabilidade.html', 'Ética e responsabilidade'],
  ['contato.html', 'Contato oficial'],
  ['privacidade-e-dados.html', 'Privacidade e dados'],
  ['termos-de-uso.html', 'Termos de uso'],
  ['acessibilidade.html', 'Acessibilidade']
];

for (const [href, label] of expectedGuideLinks) {
  pass(`Link rastreável: ${label}`,
    count(guide, new RegExp(`<a href="${escapeRegExp(href)}"[^>]*>${escapeRegExp(label)}<\\/a>`, 'g')) === 1);
}

pass('Menu possui exatamente catorze links públicos', count(guide, /<a href=/g) === 14);
pass('Somente o hub de iniciantes foi acrescentado ao menu',
  count(guide, /href="(?:guias-para-comecar|tarot-para-iniciantes|como-fazer-perguntas-ao-tarot)\.html"/g) === 1);
pass('Textos de link são descritivos', !/(>clique aqui<|>saiba mais<|>conhecer<|>abrir<)/i.test(guide));
pass('Nenhuma área privada é ligada nos guias',
  !/href="[^"]*(?:admin|login|checkout|diario|orbe-ia)(?:[.\/#?"-])/i.test(guide));

const v158Guide = '<nav class="magic-menu-guides" aria-label="Guias, informações e direitos na Divina Bruxa"><strong>GUIAS E INFORMAÇÕES</strong><a href="tarot-livre.html">Tarot Livre online</a><a href="carta-do-dia.html">Carta do Dia no Tarot</a><a href="tiragens-de-tarot.html">Tiragens de Tarot</a><a href="escola-do-tarot.html">Escola do Tarot</a><a href="consultas-de-tarot.html">Consultas de Tarot</a><a href="cartas-do-tarot.html">Significados das 78 cartas</a><a href="sobre-a-divina-bruxa.html">Sobre a Divina Bruxa</a><a href="metodologia-do-tarot.html">Metodologia do Tarot</a><a href="etica-e-responsabilidade.html">Ética e responsabilidade</a><a href="contato.html">Contato oficial</a><strong>PRIVACIDADE E DIREITOS</strong><a href="privacidade-e-dados.html">Privacidade e dados</a><a href="termos-de-uso.html">Termos de uso</a><a href="acessibilidade.html">Acessibilidade</a></nav>';
const recoveredV158Index = guide ? index.replace(guide, v158Guide) : index;
pass('Home preserva integralmente a base V158 fora do menu público',
  sha256(recoveredV158Index) === v158IndexHash,
  `hash recuperado ${sha256(recoveredV158Index)}`);

const publicPages = [
  {
    file: 'guias-para-comecar.html',
    title: 'Como começar no Tarot: guia em 5 passos | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/guias-para-comecar.html',
    image: 'escola-tarot-observatorio-v1.webp',
    pageType: 'CollectionPage',
    breadcrumbs: 2,
    requiredPhrases: [
      'Seu primeiro caminho pelo Tarot começa sem pressa',
      'Cinco passos para começar com presença',
      '22 Arcanos Maiores e 56 Arcanos Menores',
      'Você não precisa saber tudo para praticar',
      'O Tarot amplia a pergunta; não substitui a realidade'
    ]
  },
  {
    file: 'tarot-para-iniciantes.html',
    title: 'Tarot para iniciantes: aprenda as 78 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/tarot-para-iniciantes.html',
    image: 'tarot-temple-background-v1.webp',
    pageType: 'Article',
    breadcrumbs: 3,
    requiredPhrases: [
      'Aprenda Tarot começando pela imagem',
      '22 cartas',
      '56 cartas',
      'Pajem, Cavaleiro, Rainha e Rei',
      'Leia uma carta em cinco movimentos',
      'Por que as cartas aparecem sempre diretas',
      'Leitura responsável preserva sua autonomia'
    ]
  },
  {
    file: 'como-fazer-perguntas-ao-tarot.html',
    title: 'Como fazer perguntas ao Tarot: guia e exemplos',
    canonical: 'https://divinabruxa.com.br/como-fazer-perguntas-ao-tarot.html',
    image: 'consultas-celestiais-santuario-v1.webp',
    pageType: 'Article',
    breadcrumbs: 3,
    requiredPhrases: [
      'Uma boa pergunta abre possibilidades',
      'Tema + intenção + escolha possível',
      'Ele vai voltar?',
      'Como posso me preparar melhor para esta oportunidade',
      'Nem toda dúvida deve ser entregue às cartas',
      'As cartas não comprovam segredos nem determinam o futuro'
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

for (const page of publicPages) {
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
  pass(`Imagem principal declarada: ${page.file}`, count(html, new RegExp(`<img src="${escapeRegExp(page.image)}"`, 'g')) === 1);
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
  pass(`Breadcrumb estruturado: ${page.file}`,
    breadcrumb?.itemListElement?.length === page.breadcrumbs);
  const organization = graph.find(item => item['@type'] === 'Organization');
  pass(`Organization consistente: ${page.file}`,
    organization?.name === 'Divina Bruxa' &&
    organization?.logo?.url === 'https://divinabruxa.com.br/icon-512.png');
  pass(`WebSite consistente: ${page.file}`,
    graph.some(item => item['@type'] === 'WebSite' && item.url === 'https://divinabruxa.com.br/'));
  pass(`Tipo estruturado correto: ${page.file}`,
    graph.some(item => item['@type'] === page.pageType && item.url === page.canonical));
  pass(`Imagem estruturada correta: ${page.file}`,
    graph.some(item => item['@type'] === 'ImageObject' && item.contentUrl.endsWith(page.image)));

  for (const phrase of page.requiredPhrases) {
    pass(`Conteúdo essencial em ${page.file}: ${phrase}`, html.includes(phrase));
  }
  for (const href of corePortalLinks) {
    pass(`Portal ligado em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
  pass(`Hub ligado em ${page.file}`, count(html, /href="guias-para-comecar\.html"/g) >= 1);
  pass(`Metodologia ligada em ${page.file}`, count(html, /href="metodologia-do-tarot\.html"/g) >= 1);
  pass(`Ética ligada em ${page.file}`, count(html, /href="etica-e-responsabilidade\.html"/g) >= 1);
  pass(`Privacidade ligada em ${page.file}`, count(html, /href="privacidade-e-dados\.html"/g) >= 1);
  pass(`Termos ligados em ${page.file}`, count(html, /href="termos-de-uso\.html"/g) >= 1);
  pass(`Acessibilidade ligada em ${page.file}`, count(html, /href="acessibilidade\.html"/g) >= 1);

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    pass(`Link externo protegido em ${page.file}`, /rel="[^"]*noopener[^"]*"/.test(match[0]));
  }
}

pass('Títulos novos são únicos', new Set(titles).size === publicPages.length);
pass('Descrições novas são únicas', new Set(descriptions).size === publicPages.length);

const hub = parsedPages.get('guias-para-comecar.html');
const beginner = parsedPages.get('tarot-para-iniciantes.html');
const questions = parsedPages.get('como-fazer-perguntas-ao-tarot.html');
pass('Hub liga os dois guias aprofundados',
  hub.includes('href="tarot-para-iniciantes.html"') &&
  hub.includes('href="como-fazer-perguntas-ao-tarot.html"'));
pass('Guia iniciante liga o guia de perguntas',
  beginner.includes('href="como-fazer-perguntas-ao-tarot.html"'));
pass('Guia de perguntas liga o guia iniciante',
  questions.includes('href="tarot-para-iniciantes.html"'));
pass('Guia iniciante explica 78 cartas diretas',
  beginner.includes('78 cartas') && beginner.includes('posição direta'));
pass('Guia de perguntas preserva agência',
  questions.includes('suas escolhas') && questions.includes('ao seu alcance'));
pass('Guias não prometem certeza divinatória',
  [hub, beginner, questions].every(html => !/(garante o futuro|previsão infalível|certeza absoluta|revela pensamentos literalmente)/i.test(html)));
pass('Guias não substituem profissionais',
  [hub, beginner, questions].every(html => /(não substitu|profissionais? qualificad)/i.test(html)));
pass('Nenhum FAQPage estruturado foi adicionado',
  [hub, beginner, questions].every(html => !html.includes('"@type": "FAQPage"')));

pass('Sitemap possui 95 URLs', count(sitemap, /<url>/g) === 95);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 95,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of publicPages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}

const addedSitemapBlocks = [
  '  <url>\n    <loc>https://divinabruxa.com.br/guias-para-comecar.html</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n',
  '  <url>\n    <loc>https://divinabruxa.com.br/tarot-para-iniciantes.html</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n',
  '  <url>\n    <loc>https://divinabruxa.com.br/como-fazer-perguntas-ao-tarot.html</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n'
];
let recoveredV158Sitemap = sitemap;
for (const block of addedSitemapBlocks) recoveredV158Sitemap = recoveredV158Sitemap.replace(block, '');
pass('Sitemap preserva integralmente as 92 URLs da V158',
  sha256(recoveredV158Sitemap) === v158SitemapHash,
  `hash recuperado ${sha256(recoveredV158Sitemap)}`);

pass('Contrato declara versão 159', contract.schemaVersion === '159.0.0');
pass('Contrato registra três páginas públicas', contract.publicPages?.length === 3);
pass('Contrato registra 95 URLs', contract.discoverability?.sitemapUrlsAfter === 95);
pass('Contrato registra 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra 14 links na Home', contract.discoverability?.homeGuideLinksAfter === 14);
pass('Contrato registra três grupos na Home', contract.discoverability?.homeGuideGroupsAfter === 3);
pass('Contrato registra orientação direta', contract.learningArchitecture?.deckStructure?.orientation === 'upright-only');
pass('Contrato registra 78 cartas', contract.learningArchitecture?.deckStructure?.totalCards === 78);
pass('Contrato preserva autonomia', contract.learningArchitecture?.agencyCentered === true);
pass('Contrato rejeita previsão determinista', contract.learningArchitecture?.deterministicPredictions === false);
pass('Contrato rejeita leitura literal de mente', contract.learningArchitecture?.thirdPartyMindReadingClaims === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsFunctionalCodeChanged === false);
pass('Contrato preserva preços',
  JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250, 150, 100, 50]));
pass('Contrato preserva e-mail obrigatório nas Consultas',
  read('00-LEIA-PRIMEIRO-V159-JORNADA-INICIANTES.txt').includes('E-mail obrigatório no pedido de Consulta'));
pass('Contrato mantém Resend adiado', contract.safeguards?.resendConfigured === false);
pass('Contrato não adiciona imagem social', contract.contentQuality?.socialPreviewImageAdded === false);
pass('Contrato registra nove arquivos de instalação', contract.installation?.filesInPackage === 9);

const manifestLines = read('ARQUIVOS-V159-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V159-SHA256.txt');
pass('Manifesto contém oito hashes', manifest.size === hashedFiles.length, `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`, manifest.get(name) === sha256(bytes(name)));
}

const stableFiles = {
  'tarot-livre.html': '57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
  'consultas-de-tarot.html': '35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
  'carta-do-dia.html': 'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
  'tiragens-de-tarot.html': '2de13b11577422f80ce32a27d987dd4e9afe7438e18816582c53327a1efcb416',
  'escola-do-tarot.html': 'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
  'cartas-do-tarot.html': '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede',
  'seo-portal-v154.css': '242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6',
  'robots.txt': '7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd'
};
const supportingAssets = [
  'escola-tarot-observatorio-v1.webp',
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

  for (const page of publicPages) {
    const html = parsedPages.get(page.file);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    const localRefs = refs.filter(ref => !/^(?:https?:|mailto:|#)/.test(ref));
    for (const ref of localRefs) {
      const clean = ref.split(/[?#]/)[0];
      const target = clean === '' || clean === '.' || clean === './' ? 'index.html' : clean;
      pass(`Dependência local de ${page.file}: ${ref}`, exists(target));
    }
  }

  const tarotLivre = read('tarot-livre.html');
  const consultations = read('consultas-de-tarot.html');
  pass('Tarot Livre mantém Mesa Real 13 × 6', tarotLivre.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre mantém 78 cartas diretas e sem repetição',
    tarotLivre.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => consultations.includes(price)));
  pass('Consultas mantêm e-mail obrigatório',
    consultations.includes('Seu e-mail é obrigatório para o contato'));
  pass('Consultas mantêm confirmação por e-mail',
    consultations.includes('recebe a confirmação por e-mail antes de qualquer pagamento'));
}

const result = {
  suite: 'DIVINA-BRUXA-V159-JORNADA-INICIANTES',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
