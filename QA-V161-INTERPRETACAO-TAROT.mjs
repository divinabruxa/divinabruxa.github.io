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
  'arcanos-menores.html',
  'numerologia-no-tarot.html',
  'figuras-da-corte-no-tarot.html',
  'combinacoes-de-cartas-no-tarot.html',
  '00-LEIA-PRIMEIRO-V161-INTERPRETACAO-TAROT.txt',
  'INTERPRETACAO-TAROT-V161.json',
  'QA-V161-INTERPRETACAO-TAROT.mjs',
  'ARQUIVOS-V161-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V161-INTERPRETACAO-TAROT',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const sitemap = read('sitemap.xml');
const minorHub = read('arcanos-menores.html');
const contract = JSON.parse(read('INTERPRETACAO-TAROT-V161.json'));
const v160IndexHash = 'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701';
const v160SitemapHash = 'b07f446cb8e46182dd21ba26a4c9123f645c6657aaec526e0a94a31008c9b25c';
const v160MinorHubHash = 'dca8bbead60d1c3202838f239b1b6f19f8e0a09bb1586907f4984022c2155e5b';

const pages = [
  {
    file: 'numerologia-no-tarot.html',
    title: 'Numerologia no Tarot: do Ás ao 10 | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/numerologia-no-tarot.html',
    image: 'escola-tarot-observatorio-v1.webp',
    itemCount: 10,
    requiredPhrases: [
      'Os números revelam o movimento dentro de cada naipe',
      'O número cria um padrão; a carta mantém sua singularidade',
      'Significado dos números do Tarot',
      'O mesmo 3, quatro campos diferentes',
      'Padrão não é previsão inevitável'
    ]
  },
  {
    file: 'figuras-da-corte-no-tarot.html',
    title: 'Figuras da Corte no Tarot: as 16 cartas | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/figuras-da-corte-no-tarot.html',
    image: 'card-48.webp',
    itemCount: 4,
    requiredPhrases: [
      'A Corte mostra como uma força aprende, busca, acolhe e conduz',
      'Significado das 16 Figuras da Corte',
      'Rainha e Rei não definem gênero',
      'Toda Figura da Corte representa uma pessoa?',
      'Personagem não é leitura de mente'
    ]
  },
  {
    file: 'combinacoes-de-cartas-no-tarot.html',
    title: 'Combinações de Tarot: como unir duas ou mais cartas',
    canonical: 'https://divinabruxa.com.br/combinacoes-de-cartas-no-tarot.html',
    image: 'templo-tiragens-celestial-v1.webp',
    itemCount: null,
    requiredPhrases: [
      'Combinar cartas é construir uma frase sem apagar cada voz',
      'MÉTODO EM CINCO PASSOS',
      'Reforço',
      'Contraste',
      'Desenvolvimento',
      'Redirecionamento',
      'Quatro encontros entre cartas',
      'Síntese responsável termina em autonomia'
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
  const article = graph.find(item => item['@type'] === 'Article');
  const webPage = graph.find(item => item['@type'] === 'WebPage');
  const itemList = graph.find(item => item['@type'] === 'ItemList');
  pass(`Breadcrumb estruturado: ${page.file}`, breadcrumb?.itemListElement?.length === 4);
  pass(`Article consistente: ${page.file}`,
    article?.url === page.canonical && article?.publisher?.['@id'] === 'https://divinabruxa.com.br/#organization');
  pass(`WebPage consistente: ${page.file}`, webPage?.url === page.canonical);
  pass(`ItemList conforme a página: ${page.file}`,
    page.itemCount === null ? !itemList : itemList?.numberOfItems === page.itemCount && itemList?.itemListElement?.length === page.itemCount);
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
  pass(`Guia iniciante ligado em ${page.file}`,
    count(html, /href="tarot-para-iniciantes\.html"/g) >= 1);
  pass(`Arcanos Menores ligados em ${page.file}`,
    count(html, /href="arcanos-menores\.html"/g) >= 1);
  pass(`Metodologia ligada em ${page.file}`,
    count(html, /href="metodologia-do-tarot\.html"/g) >= 1);
  pass(`Privacidade ligada em ${page.file}`,
    count(html, /href="privacidade-e-dados\.html"/g) >= 1);
  pass(`Termos ligados em ${page.file}`, count(html, /href="termos-de-uso\.html"/g) >= 1);
  pass(`Acessibilidade ligada em ${page.file}`, count(html, /href="acessibilidade\.html"/g) >= 1);
}

pass('Títulos novos são únicos', new Set(titles).size === pages.length);
pass('Descrições novas são únicas', new Set(descriptions).size === pages.length);
pass('Nenhum FAQPage estruturado foi adicionado',
  [...parsed.values()].every(html => !html.includes('"@type":"FAQPage"') && !html.includes('"@type": "FAQPage"')));
pass('Nenhuma página promete previsão infalível',
  [...parsed.values()].every(html => !/(garante o futuro|previsão infalível|certeza absoluta|resultado garantido)/i.test(html)));

const numerology = parsed.get('numerologia-no-tarot.html');
const court = parsed.get('figuras-da-corte-no-tarot.html');
const combinations = parsed.get('combinacoes-de-cartas-no-tarot.html');
const suits = ['paus', 'copas', 'espadas', 'ouros'];
const numberedRanks = ['as', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const courtRanks = ['pajem', 'cavaleiro', 'rainha', 'rei'];

for (const rank of numberedRanks) {
  for (const suit of suits) {
    const href = `carta-${rank}-de-${suit}.html`;
    pass(`Carta numerada ligada: ${rank} de ${suit}`,
      count(numerology, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
}
pass('Numerologia possui dez blocos visíveis',
  count(numerology.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 10);
pass('Numerologia declara 40 cartas numeradas', numerology.includes('<dd>40</dd>'));
pass('Numerologia mantém números como camada contextual',
  numerology.includes('O número oferece a forma; o naipe mostra onde ela acontece'));

for (const rank of courtRanks) {
  for (const suit of suits) {
    const href = `carta-${rank}-de-${suit}.html`;
    pass(`Figura da Corte ligada: ${rank} de ${suit}`,
      count(court, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
}
pass('Corte possui quatro blocos visíveis',
  count(court.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 4);
pass('Corte declara 16 cartas', court.includes('<dd>16</dd>'));
pass('Corte não limita gênero', court.includes('Qualquer pessoa pode expressar'));
pass('Corte rejeita identidade literal', court.includes('a carta prove identidade ou intenção'));

const exampleCards = [
  'carta-01-o-mago.html',
  'carta-3-de-ouros.html',
  'carta-09-o-eremita.html',
  'carta-2-de-espadas.html',
  'carta-8-de-paus.html',
  'carta-14-a-temperanca.html',
  'carta-rainha-de-copas.html',
  'carta-as-de-espadas.html'
];
for (const href of exampleCards) {
  pass(`Carta ligada nos exemplos: ${href}`,
    count(combinations, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) === 1);
}
pass('Combinações possui cinco passos visíveis',
  count(combinations.match(/<ol class="step-grid">([\s\S]*?)<\/ol>/)?.[1] || '', /<li>/g) === 5);
pass('Combinações preserva posições', combinations.includes('Leia cada posição'));
pass('Combinações preserva linguagem de possibilidade', combinations.includes('linguagem de possibilidade'));
pass('Combinações rejeita repetição ansiosa', combinations.includes('Repetir a tiragem até receber outra combinação'));

for (const target of pages.map(page => page.file)) {
  const otherPages = pages.filter(page => page.file !== target).map(page => page.file);
  const html = parsed.get(target);
  pass(`Rede temática conectada em ${target}`,
    otherPages.every(other => html.includes(`href="${other}"`)));
}

const addedMinorSection = '<section class="related-portals" aria-labelledby="minor-deep-title"><header class="section-heading"><p class="kicker">APROFUNDE A INTERPRETAÇÃO</p><h2 id="minor-deep-title">Transforme estrutura em leitura</h2><p>Estude os padrões que conectam as cartas e pratique como construir uma síntese sem apagar cada imagem.</p></header><div class="related-grid"><a href="numerologia-no-tarot.html"><span aria-hidden="true">10</span><strong>Numerologia no Tarot</strong><small>Do Ás ao 10 nos quatro naipes</small></a><a href="figuras-da-corte-no-tarot.html"><span aria-hidden="true">♙</span><strong>Figuras da Corte</strong><small>16 cartas, papéis e atitudes</small></a><a href="combinacoes-de-cartas-no-tarot.html"><span aria-hidden="true">✧</span><strong>Combinações de Tarot</strong><small>Como unir duas ou mais cartas</small></a><a href="como-fazer-perguntas-ao-tarot.html"><span aria-hidden="true">?</span><strong>Boas perguntas</strong><small>Clareza, contexto e autonomia</small></a></div></section>';
pass('Hub dos Menores possui nova seção uma única vez',
  count(minorHub, /id="minor-deep-title"/g) === 1 && minorHub.includes(addedMinorSection));
for (const page of pages) {
  pass(`Hub dos Menores liga ${page.file}`,
    count(minorHub, new RegExp(`href="${escapeRegExp(page.file)}"`, 'g')) === 1);
}
const recoveredV160MinorHub = minorHub.replace(`\n    ${addedMinorSection}\n`, '');
pass('Hub dos Menores preserva integralmente a V160 fora da nova seção',
  sha256(recoveredV160MinorHub) === v160MinorHubHash,
  `hash recuperado ${sha256(recoveredV160MinorHub)}`);

pass('Sitemap possui 104 URLs', count(sitemap, /<url>/g) === 104);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 104,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of pages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}
const sitemapBlocks = pages.map(page => `  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`);
let recoveredV160Sitemap = sitemap;
for (const block of sitemapBlocks) recoveredV160Sitemap = recoveredV160Sitemap.replace(block, '');
pass('Sitemap preserva integralmente as 101 URLs da V160',
  sha256(recoveredV160Sitemap) === v160SitemapHash,
  `hash recuperado ${sha256(recoveredV160Sitemap)}`);

pass('Contrato declara versão 161', contract.schemaVersion === '161.0.0');
pass('Contrato registra três páginas públicas', contract.publicPages?.length === 3);
pass('Contrato registra 104 URLs', contract.discoverability?.sitemapUrlsAfter === 104);
pass('Contrato registra 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra 40 cartas numeradas', contract.interpretationArchitecture?.numberedCards === 40);
pass('Contrato registra 16 cartas da Corte', contract.interpretationArchitecture?.courtCards === 16);
pass('Contrato registra método em cinco passos', contract.interpretationArchitecture?.combinationMethod?.length === 5);
pass('Contrato registra quatro relações', contract.interpretationArchitecture?.relationshipTypes?.length === 4);
pass('Contrato registra orientação direta', contract.interpretationArchitecture?.orientation === 'upright-only');
pass('Contrato registra 40 links de Numerologia', contract.internalLinking?.numerologyIndividualCardLinks === 40);
pass('Contrato registra 16 links da Corte', contract.internalLinking?.courtIndividualCardLinks === 16);
pass('Contrato registra Home intacta', contract.safeguards?.indexChanged === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsFunctionalCodeChanged === false);
pass('Contrato preserva preços',
  JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250, 150, 100, 50]));
pass('Contrato preserva e-mail obrigatório', contract.safeguards?.consultationEmailRequired === true);
pass('Contrato mantém Resend adiado', contract.safeguards?.resendConfigured === false);
pass('Contrato não adiciona imagem social', contract.contentQuality?.socialPreviewImageAdded === false);
pass('Contrato registra nove arquivos de instalação', contract.installation?.filesInPackage === 9);

const manifestLines = read('ARQUIVOS-V161-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V161-SHA256.txt');
pass('Manifesto contém oito hashes', manifest.size === hashedFiles.length, `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`, manifest.get(name) === sha256(bytes(name)));
}

const stableFiles = {
  'index.html': v160IndexHash,
  'tarot-livre.html': '57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
  'consultas-de-tarot.html': '35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
  'carta-do-dia.html': 'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
  'tiragens-de-tarot.html': '2de13b11577422f80ce32a27d987dd4e9afe7438e18816582c53327a1efcb416',
  'escola-do-tarot.html': 'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
  'cartas-do-tarot.html': '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede',
  'tarot-para-iniciantes.html': '9d6ab9048de9d13aefd6bfcd3ce6071e709cf74d3bbeac97199ee222c8c271de',
  'arcanos-maiores.html': '805d7091117c9437b1363d0203c5fd6887a50d7dd978b439a6e9457c4c53a8e7',
  'naipe-de-paus.html': 'c06f464c37b87bc6d32ae81530bdabb19cc4e78e6510fe244f82e3df764a9d8c',
  'naipe-de-copas.html': '4b3e011334f2d803307ad25503783d03e927cd96c55a035899ee68c44f0bbc6a',
  'naipe-de-espadas.html': '0a0227f957d76f2ee454c6194c69c69704a262a492e2a2969e5dd388c72db619',
  'naipe-de-ouros.html': 'ac772b5323d7203c7dc17ff45838d0d84cbb20c24009562d44a16bec7d8b7213',
  'seo-portal-v154.css': '242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6',
  'robots.txt': '7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd'
};
const supportingAssets = [
  'escola-tarot-observatorio-v1.webp',
  'card-48.webp',
  'templo-tiragens-celestial-v1.webp',
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
      const target = clean === '' || clean === '.' || clean === './' ? 'index.html' : clean;
      pass(`Dependência local de ${page.file}: ${ref}`, exists(target));
    }
  }

  for (const rank of numberedRanks) {
    for (const suit of suits) pass(`Destino numerado existe: ${rank} de ${suit}`, exists(`carta-${rank}-de-${suit}.html`));
  }
  for (const rank of courtRanks) {
    for (const suit of suits) pass(`Destino da Corte existe: ${rank} de ${suit}`, exists(`carta-${rank}-de-${suit}.html`));
  }
  for (const href of exampleCards) pass(`Destino de exemplo existe: ${href}`, exists(href));

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
  suite: 'DIVINA-BRUXA-V161-INTERPRETACAO-TAROT',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
