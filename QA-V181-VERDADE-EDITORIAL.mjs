import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, pass: Boolean(condition), ...(detail ? { detail } : {}) });

const packageFiles = [
  'menu-completo-v177.js','busca-v165.js','buscar.html','sitemap.xml',
  'sobre-a-divina-bruxa.html','metodologia-do-tarot.html','etica-e-responsabilidade.html','contato.html',
  'politica-editorial.html','fontes-e-referencias.html','verdade-editorial-v181.css',
  'VERDADE-EDITORIAL-V181.json','QA-V181-VERDADE-EDITORIAL.mjs',
  '00-LEIA-PRIMEIRO-V181-VERDADE-EDITORIAL.txt','ARQUIVOS-V181-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));

const policy = read('politica-editorial.html');
const sources = read('fontes-e-referencias.html');
const css = read('verdade-editorial-v181.css');
const menu = read('menu-completo-v177.js');
const searchPage = read('buscar.html');
const search = read('busca-v165.js');
const sitemap = read('sitemap.xml');
const contract = JSON.parse(read('VERDADE-EDITORIAL-V181.json'));

for (const [name, html, canonical] of [
  ['política', policy, 'politica-editorial.html'],
  ['fontes', sources, 'fontes-e-referencias.html']
]) {
  check(`${name}:doctype`, /^<!doctype html>/i.test(html));
  check(`${name}:lang`, /<html lang="pt-BR">/.test(html));
  check(`${name}:viewport`, /name="viewport"/.test(html));
  check(`${name}:canonical`, html.includes(`https://divinabruxa.com.br/${canonical}`));
  check(`${name}:robots`, /index,follow,max-image-preview:large/.test(html));
  check(`${name}:um-h1`, count(html, /<h1\b/g) === 1);
  check(`${name}:skip-link`, /class="skip-link"/.test(html));
  check(`${name}:css-v181`, /verdade-editorial-v181\.css\?v=181/.test(html));
  check(`${name}:data-publicada`, /"datePublished":"2026-09-07"/.test(html));
  check(`${name}:data-revisada`, /"dateModified":"2026-09-07"/.test(html));
  check(`${name}:sem-og-image`, !/property="og:image"/.test(html));
  check(`${name}:sem-nome-removido`, !/\bÍsis\b|\bIsis\b/.test(html));
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  check(`${name}:jsonld-presente`, json);
  try { JSON.parse(json?.[1] || ''); check(`${name}:jsonld-válido`, true); } catch { check(`${name}:jsonld-válido`, false); }
}

check('política:responsável', /Responsabilidade editorial: Divina Bruxa/.test(policy));
check('política:sete-compromissos', count(policy.match(/editorial-principles[\s\S]*?<\/section>/)?.[0] || '', /<article>/g) === 7);
check('política:cinco-etapas', count(policy.match(/editorial-flow[\s\S]*?<\/ol>/)?.[0] || '', /<li>/g) === 5);
check('política:declara-ia', /inteligência artificial podem ajudar/.test(policy));
check('política:correções', /id="correcoes"/.test(policy) && /Corre%C3%A7%C3%A3o%20editorial/.test(policy));
check('política:email', policy.includes('orbedasrealidades@hotmail.com'));
check('política:limites', /médico ou psicológico, orientação jurídica ou financeira/.test(policy));
check('política:schema-correções', /"correctionsPolicy":"https:\/\/divinabruxa\.com\.br\/politica-editorial\.html#correcoes"/.test(policy));

check('fontes:14-itens', count(sources, /<li><span>\d{2}<\/span>/g) === 14);
for (const institution of ['Victoria and Albert Museum','Metropolitan Museum of Art','Morgan Library','British Museum','Warburg Institute','Library of Congress','Smithsonian','Google Search Central','W3C']) {
  check(`fontes:${institution}`, sources.includes(institution));
}
check('fontes:links-seguros', count(sources, /target="_blank" rel="noopener noreferrer"/g) === 14);
check('fontes:quatro-grupos', ['id="historia"','id="aprendizagem"','id="conservacao"','id="qualidade"'].every(value => sources.includes(value)));

check('css:responsivo-980', /@media\(max-width:980px\)/.test(css));
check('css:responsivo-720', /@media\(max-width:720px\)/.test(css));
check('css:movimento-reduzido', /prefers-reduced-motion:reduce/.test(css));

check('menu:seção-editorial', menu.includes("heading.textContent = 'VERDADE EDITORIAL'"));
check('menu:link-política', menu.includes("policy.href = 'politica-editorial.html'"));
check('menu:link-fontes', menu.includes("sources.href = 'fontes-e-referencias.html'"));
check('menu:sem-innerhtml', !menu.includes('innerHTML'));
check('menu:sintaxe', (() => { try { execFileSync(process.execPath, ['--check', path.join(root, 'menu-completo-v177.js')]); return true; } catch { return false; } })());

const pageRows = count(search, /^  \['/gm);
check('busca:52-páginas', pageRows === 52, String(pageRows));
check('busca:130-destinos', pageRows + 78 === 130, String(pageRows + 78));
check('busca:política-única', count(search, /politica-editorial\.html/g) === 1);
check('busca:fontes-única', count(search, /fontes-e-referencias\.html/g) === 1);
check('busca:versão-181', /busca-v165\.js\?v=181/.test(searchPage));
check('busca:sintaxe', (() => { try { execFileSync(process.execPath, ['--check', path.join(root, 'busca-v165.js')]); return true; } catch { return false; } })());

check('sitemap:131-urls', count(sitemap, /<url>/g) === 131, String(count(sitemap, /<url>/g)));
check('sitemap:78-imagens', count(sitemap, /<image:image>/g) === 78);
check('sitemap:política-única', count(sitemap, /<loc>https:\/\/divinabruxa\.com\.br\/politica-editorial\.html<\/loc>/g) === 1);
check('sitemap:fontes-única', count(sitemap, /<loc>https:\/\/divinabruxa\.com\.br\/fontes-e-referencias\.html<\/loc>/g) === 1);

for (const file of ['sobre-a-divina-bruxa.html','metodologia-do-tarot.html','etica-e-responsabilidade.html','contato.html']) {
  const html = read(file);
  check(`integração:${file}:política`, html.includes('politica-editorial.html'));
  check(`integração:${file}:fontes`, html.includes('fontes-e-referencias.html'));
}

check('contrato:versão', contract.schemaVersion === '181.0.0');
check('contrato:macroetapa-3', contract.macroStage === 3);
check('contrato:14-fontes', contract.sourceRegistry.total === 14);
check('contrato:sem-autoria-inventada', contract.editorialResponsibility.inventedPersonByline === false && contract.editorialResponsibility.inventedCredentials === false);
check('contrato:15-arquivos', contract.installation.filesInPackage === 15);
check('contrato:8-substituir', contract.installation.replace.length === 8);
check('contrato:7-adicionar', contract.installation.add.length === 7);
check('contrato:preços', contract.safeguards.consultationPricesBrl.join(',') === '250,150,100,50');
check('contrato:sem-cobrança', contract.safeguards.realBillingEnabled === false);

const hashLines = read('ARQUIVOS-V181-SHA256.txt').trim().split(/\r?\n/);
check('pacote:14-hashes', hashLines.length === 14, String(hashLines.length));
for (const line of hashLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-28)}`, match);
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root, match[2]))) === match[1]);
}

const fullProject = exists('tarot-data.js') && exists('tarot-session.js') && exists('consultation-policy.js') && exists('QA-V180-ROTAS-SEM-TELA-BRANCA.mjs');
if (fullProject) {
  const [{ CARDS, REQUIRED_ORIENTATION }, sessionModule, consultationModule] = await Promise.all([
    import(`${pathToFileURL(path.join(root, 'tarot-data.js')).href}?qa=${Date.now()}`),
    import(`${pathToFileURL(path.join(root, 'tarot-session.js')).href}?qa=${Date.now()}`),
    import(`${pathToFileURL(path.join(root, 'consultation-policy.js')).href}?qa=${Date.now()}`)
  ]);
  check('tarot:78-cartas', CARDS.length === 78 && new Set(CARDS.map(card => card.id)).size === 78);
  check('tarot:diretas', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal'));
  let seed = 181;
  const randomInt = max => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);
  let state = sessionModule.createTarotState({ randomInt, sessionId: 'qa-v181' });
  const drawn = [];
  while (!state.completed) { const result = sessionModule.drawNextCard(state); drawn.push(result.cardId); state = result.state; }
  check('tarot:sem-repetição', drawn.length === 78 && new Set(drawn).size === 78);
  const policyContract = consultationModule.CONSULTATION_POLICY;
  check('consultas:quatro-serviços', policyContract.services.length === 4);
  check('consultas:preços', policyContract.services.map(item => item.price).join(',') === '250,150,100,50');
  check('consultas:email', policyContract.channels.join(',') === 'email' && /name="email"[^>]+required/.test(read('consultation-engine.js')));
  check('consultas:sem-cobrança', policyContract.realBilling === false);
  try { execFileSync(process.execPath, [path.join(root, 'QA-V180-ROTAS-SEM-TELA-BRANCA.mjs'), root], { stdio: 'ignore' }); check('regressão:v180', true); } catch { check('regressão:v180', false); }
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V181-VERDADE-EDITORIAL',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
