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
  'privacidade-e-dados.html',
  'termos-de-uso.html',
  'acessibilidade.html',
  '00-LEIA-PRIMEIRO-V158-PRIVACIDADE-DIREITOS.txt',
  'PRIVACIDADE-DIREITOS-V158.json',
  'QA-V158-PRIVACIDADE-DIREITOS.mjs',
  'ARQUIVOS-V158-SHA256.txt'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V158-PRIVACIDADE-DIREITOS',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const index = read('index.html');
const sitemap = read('sitemap.xml');
const contract = JSON.parse(read('PRIVACIDADE-DIREITOS-V158.json'));
const googleToken = 'VJjhRxQ18euRcUn_hPcAtTNi5Dj-qX3kjr7-xzvAT8k';
const officialEmail = 'orbedasrealidades@hotmail.com';
const v157IndexHash = '945b934cbc89b82cffd50ff9b3ba71ab59d6a2f9b439a8f0d0b1f7033d08a3a6';
const v157SitemapHash = '11a1de945fd390c7750f2a087a843b670fc5631983c2c66a029e1197f376d5fc';

pass('Metatag oficial do Search Console preservada',
  count(index, new RegExp(`<meta name="google-site-verification" content="${googleToken}">`, 'g')) === 1);
pass('Token do Google aparece uma única vez', count(index, new RegExp(googleToken, 'g')) === 1);
pass('CSS V156 continua carregado uma única vez',
  count(index, /<link rel="stylesheet" href="seo-navigation-v156\.css\?v=156">/g) === 1);
pass('Navegação pública aparece uma única vez', count(index, /<nav class="magic-menu-guides"/g) === 1);

const guideMatch = index.match(/<nav class="magic-menu-guides"[^>]*>[\s\S]*?<\/nav>/);
const guide = guideMatch?.[0] || '';
pass('Navegação possui rótulo acessível',
  guide.includes('aria-label="Guias, informações e direitos na Divina Bruxa"'));
pass('Navegação fica dentro do Menu Mágico',
  index.indexOf(guide) > index.indexOf('<aside id="drawer"') &&
  index.indexOf(guide) < index.indexOf('</aside>', index.indexOf('<aside id="drawer"')));
pass('Menu possui dois grupos visíveis',
  count(guide, /<strong>/g) === 2 &&
  guide.includes('<strong>GUIAS E INFORMAÇÕES</strong>') &&
  guide.includes('<strong>PRIVACIDADE E DIREITOS</strong>'));

const portalLinks = [
  ['tarot-livre.html', 'Tarot Livre online'],
  ['carta-do-dia.html', 'Carta do Dia no Tarot'],
  ['tiragens-de-tarot.html', 'Tiragens de Tarot'],
  ['escola-do-tarot.html', 'Escola do Tarot'],
  ['consultas-de-tarot.html', 'Consultas de Tarot'],
  ['cartas-do-tarot.html', 'Significados das 78 cartas']
];

const trustLinks = [
  ['sobre-a-divina-bruxa.html', 'Sobre a Divina Bruxa'],
  ['metodologia-do-tarot.html', 'Metodologia do Tarot'],
  ['etica-e-responsabilidade.html', 'Ética e responsabilidade'],
  ['contato.html', 'Contato oficial']
];

const rightsLinks = [
  ['privacidade-e-dados.html', 'Privacidade e dados'],
  ['termos-de-uso.html', 'Termos de uso'],
  ['acessibilidade.html', 'Acessibilidade']
];

for (const [href, label] of [...portalLinks, ...trustLinks, ...rightsLinks]) {
  pass(`Link rastreável: ${label}`,
    count(guide, new RegExp(`<a href="${escapeRegExp(href)}"[^>]*>${escapeRegExp(label)}<\\/a>`, 'g')) === 1);
}

pass('Menu possui exatamente treze links públicos', count(guide, /<a href=/g) === 13);
pass('Textos de link são descritivos', !/(>clique aqui<|>saiba mais<|>conhecer<|>abrir<)/i.test(guide));
pass('Nenhuma área privada é ligada nos guias',
  !/href="[^"]*(?:admin|login|checkout|diario|orbe-ia)(?:[.\/#?"-])/i.test(guide));

const previousGuide = '<nav class="magic-menu-guides" aria-label="Guias e informações da Divina Bruxa"><strong>GUIAS E INFORMAÇÕES</strong><a href="tarot-livre.html">Tarot Livre online</a><a href="carta-do-dia.html">Carta do Dia no Tarot</a><a href="tiragens-de-tarot.html">Tiragens de Tarot</a><a href="escola-do-tarot.html">Escola do Tarot</a><a href="consultas-de-tarot.html">Consultas de Tarot</a><a href="cartas-do-tarot.html">Significados das 78 cartas</a><a href="sobre-a-divina-bruxa.html">Sobre a Divina Bruxa</a><a href="metodologia-do-tarot.html">Metodologia do Tarot</a><a href="etica-e-responsabilidade.html">Ética e responsabilidade</a><a href="contato.html">Contato oficial</a></nav>';
const recoveredV157Index = guide ? index.replace(guide, previousGuide) : index;
pass('Home preserva integralmente a base V157 fora do menu público',
  sha256(recoveredV157Index) === v157IndexHash,
  `hash recuperado ${sha256(recoveredV157Index)}`);

const previousFooter = '  <footer class="site-footer"><p><strong>Divina Bruxa</strong> · Orbe das Realidades</p><nav aria-label="Rodapé"><a href="./">Início</a><a href="sobre-a-divina-bruxa.html">Sobre</a><a href="metodologia-do-tarot.html">Metodologia</a><a href="etica-e-responsabilidade.html">Ética</a><a href="contato.html">Contato</a></nav><small>Conteúdo simbólico para reflexão e autoconhecimento. © 2026 Divina Bruxa.</small></footer>';
const currentFooter = '  <footer class="site-footer"><p><strong>Divina Bruxa</strong> · Orbe das Realidades</p><nav aria-label="Rodapé"><a href="./">Início</a><a href="sobre-a-divina-bruxa.html">Sobre</a><a href="metodologia-do-tarot.html">Metodologia</a><a href="etica-e-responsabilidade.html">Ética</a><a href="privacidade-e-dados.html">Privacidade</a><a href="termos-de-uso.html">Termos</a><a href="acessibilidade.html">Acessibilidade</a><a href="contato.html">Contato</a></nav><small>Conteúdo simbólico para reflexão e autoconhecimento. © 2026 Divina Bruxa.</small></footer>';
const v157PageHashes = {
  'sobre-a-divina-bruxa.html': 'a82e30bbca99b0dee23a3461fe6ff37e703999e29c0ac2ca66f3db7fdfce8b0a',
  'metodologia-do-tarot.html': '53c8f534e354fe039fca89e1a1b594d999e53b511268a4b5a72f00948a0bd82d',
  'etica-e-responsabilidade.html': '6f48ebfb9e18fdec1512b08be72f39c0a1c905cc70d810895759c3cd867db671',
  'contato.html': 'ad21bb87b5c7602c92fcaafd4a3061b19d2ce72430b899675f28370225735891'
};

for (const [name, hash] of Object.entries(v157PageHashes)) {
  const html = read(name);
  pass(`Rodapé de direitos aparece uma vez: ${name}`, count(html, /<footer class="site-footer">/g) === 1 && html.includes(currentFooter));
  for (const [href] of rightsLinks) {
    pass(`Direito ligado no rodapé de ${name}: ${href}`,
      count(currentFooter, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) === 1);
  }
  const recovered = html.replace(currentFooter, previousFooter).replace(/\n+$/, '\n');
  pass(`Conteúdo V157 preservado fora do rodapé: ${name}`,
    sha256(recovered) === hash,
    `hash normalizado ${sha256(recovered)}`);
}

const publicPages = [
  {
    file: 'privacidade-e-dados.html',
    title: 'Privacidade e dados pessoais | Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/privacidade-e-dados.html',
    image: 'diario-espelho-celestial-v1.webp',
    requiredPhrases: [
      'A navegação pública não exige uma conta',
      'Supabase STAGING',
      'A automação pelo Resend ainda não está ativa',
      'A versão pública não cria cookies próprios de publicidade',
      'cronograma automático de retenção será concluído antes do uso em produção',
      'Nenhuma segurança é absoluta',
      officialEmail
    ],
    externalReferences: [
      'https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares',
      'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm'
    ]
  },
  {
    file: 'termos-de-uso.html',
    title: 'Termos de Uso da Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/termos-de-uso.html',
    image: 'tarot-temple-background-v1.webp',
    requiredPhrases: [
      '18 anos ou mais',
      'Símbolo não é prova, diagnóstico ou sentença',
      'Nenhuma cobrança é realizada nesta versão',
      'Não. O formulário de Conta está preparado visualmente',
      'pode receber comissão por compra qualificada',
      'não eliminam direitos obrigatórios'
    ],
    externalReferences: []
  },
  {
    file: 'acessibilidade.html',
    title: 'Acessibilidade na Divina Bruxa',
    canonical: 'https://divinabruxa.com.br/acessibilidade.html',
    image: 'orbe-ia-celestial-v1.webp',
    requiredPhrases: [
      'não uma certificação formal de conformidade',
      'Ir para o conteúdo',
      'Movimento reduzido',
      'ainda precisa de auditoria completa',
      'Relatar uma barreira',
      officialEmail
    ],
    externalReferences: [
      'https://www.w3.org/TR/WCAG22/',
      'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital'
    ]
  }
];

const institutionalFiles = [...Object.keys(v157PageHashes), ...publicPages.map(page => page.file)];
const titles = [];
const descriptions = [];
const parsedPages = new Map();

for (const name of institutionalFiles) {
  const html = read(name);
  parsedPages.set(name, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title);
  descriptions.push(description);
  pass(`Título presente: ${name}`, title.length >= 20 && title.length <= 65, `${title.length} caracteres`);
  pass(`Descrição presente: ${name}`, description.length >= 110 && description.length <= 170, `${description.length} caracteres`);
  pass(`Página indexável: ${name}`,
    html.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
  pass(`H1 único: ${name}`, count(html, /<h1(?:\s|>)/g) === 1);
  pass(`Main identificável: ${name}`, count(html, /<main\b[^>]*\bid="conteudo"[^>]*>/g) === 1);
  pass(`Link para pular conteúdo: ${name}`, html.includes('<a class="skip-link" href="#conteudo">'));
  pass(`Sem imagem social não solicitada: ${name}`, count(html, /<meta[^>]+property="og:image"/g) === 0);
  pass(`Sem nome pessoal não confirmado: ${name}`, !/\b[ií]sis\b/i.test(html));
  pass(`Sem scripts executáveis: ${name}`,
    [...html.matchAll(/<script(?:\s[^>]*)?>/g)].every(match => /type="application\/ld\+json"/.test(match[0])));
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  pass(`Um bloco JSON-LD: ${name}`, jsonLdBlocks.length === 1);
  let graph = [];
  try {
    graph = JSON.parse(jsonLdBlocks[0]?.[1] || '{}')['@graph'] || [];
    pass(`JSON-LD válido: ${name}`, true);
  } catch (error) {
    pass(`JSON-LD válido: ${name}`, false, error.message);
  }
  pass(`Breadcrumb estruturado: ${name}`,
    graph.some(item => item['@type'] === 'BreadcrumbList' && item.itemListElement?.length === 2));
  const organization = graph.find(item => item['@type'] === 'Organization');
  pass(`Organization consistente: ${name}`,
    organization?.name === 'Divina Bruxa' &&
    organization?.logo?.url === 'https://divinabruxa.com.br/icon-512.png');
}

pass('Títulos institucionais são únicos', new Set(titles).size === institutionalFiles.length);
pass('Descrições institucionais são únicas', new Set(descriptions).size === institutionalFiles.length);

for (const page of publicPages) {
  const html = parsedPages.get(page.file);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  pass(`Título exato: ${page.file}`, title === page.title);
  pass(`Canonical correto: ${page.file}`,
    count(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(page.canonical)}">`, 'g')) === 1);
  pass(`CSS público reutilizado: ${page.file}`,
    count(html, /<link rel="stylesheet" href="seo-portal-v154\.css\?v=154">/g) === 1);
  pass(`Imagem principal declarada: ${page.file}`, html.includes(`<img src="${page.image}"`));
  for (const phrase of page.requiredPhrases) {
    pass(`Conteúdo essencial em ${page.file}: ${phrase}`, html.includes(phrase));
  }
  for (const reference of page.externalReferences) {
    pass(`Referência oficial em ${page.file}: ${reference}`, html.includes(`href="${reference}"`));
  }
  for (const [href] of portalLinks) {
    pass(`Portal ligado em ${page.file}: ${href}`,
      count(html, new RegExp(`href="${escapeRegExp(href)}"`, 'g')) >= 1);
  }
  for (const related of publicPages) {
    if (related.file === page.file) continue;
    pass(`Núcleo de direitos ligado: ${page.file} → ${related.file}`,
      count(html, new RegExp(`href="${escapeRegExp(related.file)}"`, 'g')) >= 1);
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    pass(`Link externo protegido em ${page.file}`, /rel="[^"]*noopener[^"]*"/.test(match[0]));
  }
}

const privacy = parsedPages.get('privacidade-e-dados.html');
const terms = parsedPages.get('termos-de-uso.html');
const accessibility = parsedPages.get('acessibilidade.html');
pass('Privacidade não afirma certificação jurídica', !/(certificad[ao]|conformidade total com a LGPD)/i.test(privacy));
pass('Privacidade não inventa prazo fixo de servidor', !/(apagados? automaticamente em \d+ dias|retidos? por exatamente \d+ dias)/i.test(privacy));
pass('Privacidade diferencia armazenamento local e envio', privacy.includes('NO SEU APARELHO') && privacy.includes('FORA DO APARELHO'));
pass('Termos preservam natureza simbólica', terms.includes('não substitui orientação médica, psicológica, jurídica, financeira'));
pass('Termos preservam direitos obrigatórios', terms.includes('não eliminam direitos obrigatórios'));
pass('Acessibilidade não afirma conformidade certificada',
  accessibility.includes('não uma certificação formal de conformidade') &&
  !/(conformidade WCAG 2\.2 nível|certificad[ao] WCAG)/i.test(accessibility));
pass('Canal de direitos usa e-mail oficial',
  count(privacy, new RegExp(`mailto:${escapeRegExp(officialEmail)}`, 'g')) >= 2);
pass('Canal de acessibilidade usa e-mail oficial',
  count(accessibility, new RegExp(`mailto:${escapeRegExp(officialEmail)}`, 'g')) >= 2);

pass('Sitemap possui 92 URLs', count(sitemap, /<url>/g) === 92);
pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pageLocations = sitemapLocations.filter(location => !/\.(?:webp|png|jpe?g|svg)$/i.test(location));
pass('URLs de página não se repetem no sitemap', new Set(pageLocations).size === 92,
  `${new Set(pageLocations).size} URLs únicas`);
for (const page of publicPages) {
  pass(`Sitemap inclui ${page.file}`,
    count(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}<\\/loc>`, 'g')) === 1);
}

const addedSitemapBlocks = publicPages.map(page => `  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`);
let recoveredV157Sitemap = sitemap;
for (const block of addedSitemapBlocks) recoveredV157Sitemap = recoveredV157Sitemap.replace(block, '');
pass('Sitemap preserva integralmente as 89 URLs da V157',
  sha256(recoveredV157Sitemap) === v157SitemapHash,
  `hash recuperado ${sha256(recoveredV157Sitemap)}`);

pass('Contrato declara versão 158', contract.schemaVersion === '158.0.0');
pass('Contrato registra três páginas públicas', contract.publicPages?.length === 3);
pass('Contrato registra 92 URLs', contract.discoverability?.sitemapUrlsAfter === 92);
pass('Contrato registra 78 imagens', contract.discoverability?.sitemapImageEntries === 78);
pass('Contrato registra 13 links na Home', contract.discoverability?.homeGuideLinksAfter === 13);
pass('Contrato registra conta pública desativada', contract.observedProductState?.publicAccountApiEnabled === false);
pass('Contrato registra IA desativada', contract.observedProductState?.orbeAiApiEnabled === false);
pass('Contrato registra billing real desativado', contract.observedProductState?.realBillingEnabled === false);
pass('Contrato registra Resend desativado', contract.observedProductState?.consultationAutomaticEmailEnabled === false);
pass('Contrato registra e-mail oficial', contract.dataRightsChannel?.email === officialEmail);
pass('Contrato não afirma certificação WCAG', contract.accessibility?.formalCertificationClaimed === false);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas funcionais', contract.safeguards?.consultationsFunctionalCodeChanged === false);
pass('Contrato preserva preços', contract.safeguards?.consultationPricesChanged === false);
pass('Contrato não adiciona imagem social', contract.safeguards?.socialPreviewImageAdded === false);

const manifestLines = read('ARQUIVOS-V158-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const manifest = new Map();
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (match) manifest.set(match[2], match[1]);
}
const hashedFiles = required.filter(name => name !== 'ARQUIVOS-V158-SHA256.txt');
pass('Manifesto contém doze hashes', manifest.size === hashedFiles.length, `${manifest.size} entradas`);
for (const name of hashedFiles) {
  pass(`Hash íntegro: ${name}`, manifest.get(name) === sha256(fs.readFileSync(filePath(name))));
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
  'diario-espelho-celestial-v1.webp',
  'tarot-temple-background-v1.webp',
  'orbe-ia-celestial-v1.webp',
  'divina-icon-fast-v1.png',
  'icon-512.png'
];

const stateFiles = [
  'config.js',
  'storage.js',
  'consultation-engine.js',
  'auth-client-v6.js',
  'analytics-policy.js',
  'STAGING-EMAIL-STATUS-V148.json'
];

const fullProject = [...Object.keys(stableFiles), ...supportingAssets, ...stateFiles].every(exists);

if (fullProject) {
  for (const [name, hash] of Object.entries(stableFiles)) {
    pass(`Arquivo crítico preservado byte a byte: ${name}`,
      sha256(fs.readFileSync(filePath(name))) === hash);
  }
  for (const asset of supportingAssets) {
    pass(`Dependência visual disponível: ${asset}`, fs.statSync(filePath(asset)).size > 0);
  }

  const config = read('config.js');
  const storage = read('storage.js');
  const consultation = read('consultation-engine.js');
  const auth = read('auth-client-v6.js');
  const analyticsPolicy = read('analytics-policy.js');
  const emailStatus = JSON.parse(read('STAGING-EMAIL-STATUS-V148.json'));
  pass('Auditoria: conta pública continua desligada', /\bapiBase:\s*''/.test(config));
  pass('Auditoria: Consultas apontam para Supabase',
    /consultationsApiBase:'https:\/\/[a-z]+\.supabase\.co\/functions\/v1\/consultations-booking'/.test(config));
  pass('Auditoria: armazenamento principal é localStorage', storage.includes('localStorage.getItem') && storage.includes('localStorage.setItem'));
  pass('Auditoria: Consulta exige consentimento de privacidade',
    consultation.includes('acceptPrivacy') && consultation.includes('Autorizo o uso destes dados'));
  pass('Auditoria: Consulta envia campos declarados',
    ['name:this.pendingPayload.customer.name', 'email:this.pendingPayload.customer.email', 'phone:this.pendingPayload.customer.phone', 'questionContext:this.pendingPayload.question'].every(value => consultation.includes(value)));
  pass('Auditoria: autenticação usa cookie seguro quando futura API existir',
    auth.includes("credentials: 'include'") && !/localStorage\.(?:getItem|setItem|removeItem)/.test(auth));
  pass('Auditoria: analytics externo permanece desligado', analyticsPolicy.includes('externalProvider:false'));
  pass('Auditoria: Resend ainda não está configurado',
    emailStatus.ownerEmailConfigured === false && emailStatus.automaticDelivery === 'awaiting-provider-secrets');
  const browserSources = fs.readdirSync(root)
    .filter(name => name.endsWith('.js') || name === 'index.html')
    .map(read)
    .join('\n');
  pass('Auditoria: código público não cria cookies diretamente', !browserSources.includes('document.cookie'));

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
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => consultations.includes(price)));
}

const result = {
  suite: 'DIVINA-BRUXA-V158-PRIVACIDADE-DIREITOS',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
