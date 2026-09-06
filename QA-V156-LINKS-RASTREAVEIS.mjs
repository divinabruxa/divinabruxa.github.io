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

const required = [
  'index.html',
  'seo-navigation-v156.css',
  '00-LEIA-PRIMEIRO-V156-LINKS-RASTREAVEIS.txt',
  'SEO-AUTORIDADE-V156.json',
  'QA-V156-LINKS-RASTREAVEIS.mjs'
];

for (const name of required) pass(`Arquivo presente: ${name}`, exists(name));

if (failures.length) {
  console.error(JSON.stringify({
    suite: 'DIVINA-BRUXA-V156-LINKS-RASTREAVEIS',
    status: 'FAIL',
    root,
    failures
  }, null, 2));
  process.exit(1);
}

const index = read('index.html');
const css = read('seo-navigation-v156.css');
const contract = JSON.parse(read('SEO-AUTORIDADE-V156.json'));
const googleToken = 'VJjhRxQ18euRcUn_hPcAtTNi5Dj-qX3kjr7-xzvAT8k';
const v155IndexHash = 'cd24347fc481314e858b97b12b787d08f7c385111ca803c4b05677893aaabe89';

pass('Metatag oficial do Search Console preservada',
  count(index, new RegExp(`<meta name="google-site-verification" content="${googleToken}">`, 'g')) === 1);
pass('Token do Google aparece uma única vez', count(index, new RegExp(googleToken, 'g')) === 1);
pass('CSS V156 carregado uma única vez',
  count(index, /<link rel="stylesheet" href="seo-navigation-v156\.css\?v=156">/g) === 1);
pass('Navegação de guias aparece uma única vez',
  count(index, /<nav class="magic-menu-guides"/g) === 1);

const guideMatch = index.match(/<nav class="magic-menu-guides"[^>]*>([\s\S]*?)<\/nav>/);
const guide = guideMatch?.[0] || '';
pass('Navegação possui rótulo acessível',
  guide.includes('aria-label="Guias completos da Divina Bruxa"'));
pass('Navegação fica dentro do Menu Mágico',
  index.indexOf(guide) > index.indexOf('<aside id="drawer"') &&
  index.indexOf(guide) < index.indexOf('</aside>', index.indexOf('<aside id="drawer"')));

const expectedLinks = [
  ['tarot-livre.html', 'Tarot Livre online'],
  ['carta-do-dia.html', 'Carta do Dia no Tarot'],
  ['tiragens-de-tarot.html', 'Tiragens de Tarot'],
  ['escola-do-tarot.html', 'Escola do Tarot'],
  ['consultas-de-tarot.html', 'Consultas de Tarot'],
  ['cartas-do-tarot.html', 'Significados das 78 cartas']
];

for (const [href, label] of expectedLinks) {
  pass(`Link rastreável: ${label}`,
    count(guide, new RegExp(`<a href="${href.replace('.', '\\.')}"[^>]*>${label}<\\/a>`, 'g')) === 1);
}

pass('Somente seis guias públicos', count(guide, /<a href=/g) === 6);
pass('Textos de link são descritivos',
  !/(>clique aqui<|>saiba mais<|>conhecer<|>abrir<)/i.test(guide));
pass('Nenhuma área privada é ligada nos guias',
  !/(admin|login|conta|checkout|diario|orbe-ia)/i.test(guide));

const jsonLdBlocks = [...index.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
pass('Home possui JSON-LD', jsonLdBlocks.length >= 1);
let homeGraph = [];
try {
  homeGraph = JSON.parse(jsonLdBlocks[0][1])['@graph'] || [];
  pass('JSON-LD da Home é válido', true);
} catch (error) {
  pass('JSON-LD da Home é válido', false, error.message);
}

const organization = homeGraph.find(item => item['@type'] === 'Organization');
pass('Organization identifica Divina Bruxa', organization?.name === 'Divina Bruxa');
pass('Logo oficial está no Organization',
  organization?.logo?.url === 'https://divinabruxa.com.br/icon-512.png');
pass('Dimensões do logo declaradas corretamente',
  organization?.logo?.width === 512 && organization?.logo?.height === 512);

pass('CSS oferece foco visível', css.includes('.magic-menu-guides>a:focus-visible'));
pass('CSS oferece alvos de toque', /min-height:\s*36px/.test(css));
pass('CSS respeita movimento reduzido', css.includes('@media(prefers-reduced-motion:reduce)'));
pass('CSS não contém dependência externa', !/url\(\s*["']?https?:/i.test(css));
pass('CSS possui chaves equilibradas',
  count(css, /\{/g) === count(css, /\}/g));

const v156CssLink = '<link rel="stylesheet" href="seo-navigation-v156.css?v=156">';
const v156Guide = '<nav class="magic-menu-guides" aria-label="Guias completos da Divina Bruxa"><strong>GUIAS COMPLETOS</strong><a href="tarot-livre.html">Tarot Livre online</a><a href="carta-do-dia.html">Carta do Dia no Tarot</a><a href="tiragens-de-tarot.html">Tiragens de Tarot</a><a href="escola-do-tarot.html">Escola do Tarot</a><a href="consultas-de-tarot.html">Consultas de Tarot</a><a href="cartas-do-tarot.html">Significados das 78 cartas</a></nav>';
const v156Logo = ',"logo":{"@type":"ImageObject","url":"https://divinabruxa.com.br/icon-512.png","width":512,"height":512}';
const recoveredV155 = index
  .replace(v156CssLink, '')
  .replace(v156Guide, '')
  .replace(v156Logo, '');
pass('V156 preserva integralmente a base V155 fora do escopo',
  sha256(recoveredV155) === v155IndexHash,
  `hash recuperado ${sha256(recoveredV155)}`);

pass('Contrato declara versão 156', contract.schemaVersion === '156.0.0');
pass('Contrato registra propriedade verificada',
  contract.searchConsoleObservedState?.propertyVerified === true);
pass('Contrato registra sitemap processado',
  contract.searchConsoleObservedState?.sitemapStatus === 'processed' &&
  contract.searchConsoleObservedState?.sitemapPagesFound === 85);
pass('Contrato preserva Tarot Livre', contract.safeguards?.tarotLivreChanged === false);
pass('Contrato preserva Consultas', contract.safeguards?.consultationsChanged === false);
pass('Contrato preserva a Home fechada', contract.safeguards?.closedHomeVisualChanged === false);

const portalFiles = expectedLinks.map(([href]) => href);
const fullProject = portalFiles.every(exists) && exists('sitemap.xml') && exists('icon-512.png');

if (fullProject) {
  const stableHashes = {
    'tarot-livre.html': '57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0',
    'consultas-de-tarot.html': '35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423',
    'carta-do-dia.html': 'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c',
    'tiragens-de-tarot.html': '2de13b11577422f80ce32a27d987dd4e9afe7438e18816582c53327a1efcb416',
    'escola-do-tarot.html': 'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',
    'cartas-do-tarot.html': '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede'
  };

  for (const name of portalFiles) {
    const html = read(name);
    const canonical = `https://divinabruxa.com.br/${name}`;
    pass(`Portal indexável: ${name}`,
      html.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
    pass(`Canonical correto: ${name}`,
      html.includes(`<link rel="canonical" href="${canonical}">`));
    pass(`H1 único: ${name}`, count(html, /<h1(?:\s|>)/g) === 1);
    pass(`JSON-LD válido: ${name}`, [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .every(match => { try { JSON.parse(match[1]); return true; } catch { return false; } }));
    pass(`Portal preservado byte a byte: ${name}`,
      sha256(html) === stableHashes[name]);
  }

  const icon = fs.readFileSync(filePath('icon-512.png'));
  pass('Logo PNG tem largura 512', icon.length > 24 && icon.readUInt32BE(16) === 512);
  pass('Logo PNG tem altura 512', icon.length > 24 && icon.readUInt32BE(20) === 512);

  const sitemap = read('sitemap.xml');
  pass('Sitemap mantém 85 URLs', count(sitemap, /<url>/g) === 85);
  pass('Sitemap mantém 78 imagens', count(sitemap, /<image:image>/g) === 78);
  pass('Tarot Livre mantém Mesa Real 13 × 6',
    read('tarot-livre.html').includes('Mesa Real 13 × 6'));
  pass('Consultas mantêm os quatro valores',
    ['R$ 250', 'R$ 150', 'R$ 100', 'R$ 50'].every(price => read('consultas-de-tarot.html').includes(price)));
}

const result = {
  suite: 'DIVINA-BRUXA-V156-LINKS-RASTREAVEIS',
  status: failures.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.filter(item => item.passed).length,
  failed: failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);

