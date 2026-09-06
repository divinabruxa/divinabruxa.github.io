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
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, expression) => [...value.matchAll(expression)].length;
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const required = [
  'index.html',
  'sitemap.xml',
  'sobre-a-divina-bruxa.html',
  'metodologia-do-tarot.html',
  'etica-e-responsabilidade.html',
  'contato.html',
  '00-LEIA-PRIMEIRO-V157-AUTORIDADE-CONFIANCA.txt',
  'SEO-AUTORIDADE-V157.json',
  'QA-V157-AUTORIDADE-CONFIANCA.mjs',
  'ARQUIVOS-V157-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V157-AUTORIDADE-CONFIANCA',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const index = read('index.html');
const sitemap = read('sitemap.xml');
const contract = JSON.parse(read('SEO-AUTORIDADE-V157.json'));
const googleToken = 'VJjhRxQ18euRcUn_hPcAtTNi5Dj-qX3kjr7-xzvAT8k';
const v156IndexHash = '7b9bc221ae442c583e3d6627495aa61ec779af090d2a3ee6970fa792ad67ce40';
const officialEmail = 'orbedasrealidades@hotmail.com';

pass('Metatag oficial do Search Console preservada',
  count(index, new RegExp(`<meta name="google-site-verification" content="${googleToken}">`, 'g')) === 1);
pass('Token do Google aparece uma única vez', count(index, new RegExp(googleToken, 'g')) === 1);
pass('CSS V156 continua carregado uma única vez',
  count(index, /<link rel="stylesheet" href="seo-navigation-v156\.css\?v=156">/g) === 1);
pass('Navegação de guias aparece uma única vez',
  count(index, /<nav class="magic-menu-guides"/g) === 1);

const guideMatch = index.match(/<nav class="magic-menu-guides"[^>]*>[\s\S]*?<\/nav>/);
const guide = guideMatch?.[0] || '';
pass('Navegação possui rótulo acessível',
  guide.includes('aria-label="Guias e informações da Divina Bruxa"'));
pass('Navegação fica dentro do Menu Mágico',
  index.indexOf(guide) > index.indexOf('<aside id="drawer"') &&
  index.indexOf(guide) < index.indexOf('</aside>', index.indexOf('<aside id="drawer"')));

const portalLinks = [
  ['tarot-livre.html', 'Tarot Livre online'],
  ['carta-do-dia.html', 'Carta do Dia no Tarot'],
  ['tiragens-de-tarot.html', 'Tiragens de Tarot'],
  ['escola-do-tarot.html', 'Escola do Tarot'],
  ['consultas-de-tarot.html', 'Consultas de Tarot'],
  ['cartas-do-tarot.html', 'Significados das 78 cartas']
];

const trustPages = [
  {
    file: 'sobre-a-divina-bruxa.html',
    label: 'Sobre a Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/sobre-a-divina-bruxa.html',
    title: 'Sobre a Divina Bruxa e a Orbe das Realidades',
    schemaType: 'AboutPage',
    image: 'premium-constelacao-30-skins-v1.webp',
    requiredPhrases: ['78 cartas', '17 módulos', '15 métodos', '4 formatos', 'não substitui orientação médica']
  },
  {
    file: 'metodologia-do-tarot.html',
    label: 'Metodologia do Tarot',
    canonical: 'https://divinabruxa.com.br/metodologia-do-tarot.html',
    title: 'Metodologia do Tarot: cartas diretas e contexto',
    schemaType: 'WebPage',
    image: 'escola-tarot-observatorio-v1.webp',
    requiredPhrases: ['78 cartas diretas', 'não usamos cartas invertidas', 'Luz e tensão', 'Uma carta sempre significa a mesma coisa?']
  },
  {
    file: 'etica-e-responsabilidade.html',
    label: 'Ética e responsabilidade',
    canonical: 'https://divinabruxa.com.br/etica-e-responsabilidade.html',
    title: 'Ética e responsabilidade nas leituras de Tarot',
    schemaType: 'WebPage',
    image: 'tarot-temple-background-v1.webp',
    requiredPhrases: ['Autonomia', 'Consentimento', 'Privacidade', 'não diagnostica', 'serviços de emergência']
  },
  {
    file: 'contato.html',
    label: 'Contato oficial',
    canonical: 'https://divinabruxa.com.br/contato.html',
    title: 'Contato oficial da Divina Bruxa',
    schemaType: 'ContactPage',
    image: 'consultas-celestiais-santuario-v1.webp',
    requiredPhrases: [officialEmail, 'não realiza cobrança automática', 'nunca precisa da sua senha', 'não confirma agendamento']
  }
];

const expectedGuideLinks = [...portalLinks, ...trustPages.map(page => [page.file, page.label])];
for (const [href, label] of expectedGuideLinks) {
  pass(`Link rastreável: ${label}`,
    count(guide, new RegExp(`<a href="${escapeRegExp(href)}"[^>]*>${escapeRegExp(label)}<\\/a>`, 'g')) === 1);
}

pass('Menu possui exatamente dez guias públicos', count(guide, /<a href=/g) === 10);
pass('Textos de link são descritivos', !/(>clique aqui<|>saiba mais<|>conhecer<|>abrir<)/i.test(guide));
pass('Nenhuma área privada é ligada nos guias',
  !/href="[^"]*(?:admin|login|checkout|diario|orbe-ia)(?:[.\/#?"-])/i.test(guide));

const previousGuide = '<nav class="magic-menu-guides" aria-label="Guias completos da Divina Bruxa"><strong>GUIAS COMPLETOS</strong><a href="tarot-livre.html">Tarot Livre online</a><a href="carta-do-dia.html">Carta do Dia no Tarot</a><a href="tiragens-de-tarot.html">Tiragens de Tarot</a><a href="escola-do-tarot.html">Escola do Tarot</a><a href="consultas-de-tarot.html">Consultas de Tarot</a><a href="cartas-do-tarot.html">Significados das 78 cartas</a></nav>';
const recoveredV156 = guide ? index.replace(guide, previousGuide) : index;
pass('Home preserva integralmente a base V156 fora do menu de guias',
  sha256(recoveredV156) === v156IndexHash,
  `hash recuperado ${sha256(recoveredV156)}`);

const titles = [];
const descriptions = [];
const parsedPages = new Map();

for (const page of trustPages) {
  const html = read(page.file);
  parsedPages.set(page.file, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title);
  descriptions.push(description);

  pass(`Idioma pt-BR: ${page.file}`, html.includes('<html lang="pt-BR">'));
  pass(`Título correto: ${page.file}`, title === page.title);
  pass(`Descrição presente: ${page.file}`, description.length >= 110 && description.length <= 170,
    `${description.length} caracteres`);
  pass(`Página indexável: ${page.file}`,
    html.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
  pass(`Canonical correto: ${page.file}`,
    count(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(page.canonical)}">`, 'g')) === 1);
  pass(`H1 único: ${page.file}`, count(html, /<h1(?:\s|>)/g) === 1);
  pass(`Main identificável: ${page.file}`,
    count(html, /<main\b[^>]*\bid="conteudo"[^>]*>/g) === 1);
  pass(`Link para pular conteúdo: ${page.file}`, html.includes('<a class="skip-link" href="#conteudo">'));
  pass(`CSS público reutilizado: ${page.file}`,
    count(html, /<link rel="stylesheet" href="seo-portal-v154\.css\?v=154">/g) === 1);
  pass(`Imagem principal declarada: ${page.file}`,
    html.includes(`<img src="${page.image}"`));
  pass(`Sem imagem social não solicitada: ${page.file}`,
    count(html, /<meta[^>]+property="og:image"/g) === 0);
  pass(`Sem nome pessoal não confirmado: ${page.file}`, !/\b[ií]sis\b/i.test(html));
  pass(`Sem scripts executáveis: ${page.file}`,
    [...html.matchAll(/<script(?:\s[^>]*)?>/g)].every(match => /type="application\/ld\+json"/.test(match[0])));

  for (const phrase of page.requiredPhrases) {
    pass(`Conteúdo essencial em ${page.file}: ${phrase}`, html.includes(phrase));
  }

  for (const [href] of portalLinks) {
    pass(`Portal ligado em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }

  for (const related of trustPages) {
    if (related.file === page.file) continue;
    pass(`Núcleo de confiança ligado: ${page.file} → ${related.file}`,
      count(html, new RegExp(`href="${escapeRegExp(related.file)}"`, 'g')) >= 1);
  }

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  pass(`Um bloco JSON-LD: ${page.file}`, jsonLdBlocks.length === 1);
  let graph = [];
  try {
    const parsed = JSON.parse(jsonLdBlocks[0]?.[1] || '{}');
    graph = parsed['@graph'] || [];
    pass(`JSON-LD válido: ${page.file}`, true);
  } catch (error) {
    pass(`JSON-LD válido: ${page.file}`, false, error.message);
  }
  pass(`Schema ${page.schemaType}: ${page.file}`,
    graph.some(item => item['@type'] === page.schemaType && item.url === page.canonical));
  pass(`Breadcrumb estruturado: ${page.file}`,
    graph.some(item => item['@type'] === 'BreadcrumbList' && item.itemListElement?.length === 2));
  const organization = graph.find(item => item['@type'] === 'Organization');
  pass(`Organization consistente: ${page.file}`,
    organization?.name === 'Divina Bruxa' &&
    organization?.logo?.url === 'https://divinabruxa.com.br/icon-512.png');
}

pass('Títulos das quatro páginas são únicos', new Set(titles).size === trustPages.length);
pass('Descrições das quatro páginas são únicas', new Set(descriptions).size === trustPages.length);

const contact = parsedPages.get('contato.html');
pass('E-mail oficial publicado no Contato',
  count(contact, new RegExp(escapeRegExp(officialEmail), 'g')) >= 4);
pass('Botões de contato usam mailto oficial',
  count(contact, new RegExp(`href="mailto:${escapeRegExp(officialEmail)}`, 'g')) >= 3);
pass('Contato não simula formulário ou envio automático',
  count(contact, /<form(?:\s|>)/g) === 0 && !/<input(?:\s|>)/.test(contact));

pass('Sitemap possui 89 URLs', count(sitemap, /<url>/g) === 89);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 89,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of trustPages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}

pass('Contrato declara versão 157', contract.schemaVersion === '157.0.0');
pass('Contrato registra quatro páginas de confiança', contract.trustCluster?.pages?.length === 4);
pass('Contrato registra 89 URLs', contract.discoverability?.sitemapUrlsAfter === 89);
pass('Contrato registra 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra e-mail oficial', contract.officialContact?.email === officialEmail);
pass('Contrato não promete envio automático', contract.officialContact?.automaticSendingEnabled === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsChanged === false);
pass('Contrato preserva a Home fechada', contract.safeguards?.closedHomeVisualChanged === false);
pass('Contrato não adiciona imagem social', contract.safeguards?.socialPreviewImageAdded === false);

const manifestLines = read('ARQUIVOS-V157-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V157-SHA256.txt');
pass('Manifesto contém nove hashes', manifest.size === hashedFiles.length,
  `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`,
    manifest.get(name) === sha256(fs.readFileSync(filePath(name))));
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
  'premium-constelacao-30-skins-v1.webp',
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
    pass(`Arquivo crítico preservado byte a byte: ${name}`,
      sha256(fs.readFileSync(filePath(name))) === hash);
  }

  for (const asset of supportingAssets) {
    pass(`Dependência visual disponível: ${asset}`,
      fs.statSync(filePath(asset)).size > 0);
  }

  for (const page of trustPages) {
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
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => consultations.includes(price)));
}

const result = {
  suite: 'DIVINA-BRUXA-V157-AUTORIDADE-CONFIANCA',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
