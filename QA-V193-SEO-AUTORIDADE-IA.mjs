#!/usr/bin/env node
/* QA determinístico da V193 — SEO, autoridade temática e busca por IA. */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(process.argv[2] || process.cwd());
const results = [];
const cache = new Map();

const check = (name, task) => {
  try {
    task();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
  }
};

const source = file => {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(path.join(ROOT, file), 'utf8'));
  return cache.get(file);
};

const sha256 = file => createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex');
const get = (value, expression) => (value.match(expression) || [])[1] || '';
const htmlIds = html => [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
const localRefs = html => [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)]
  .map(match => match[1])
  .filter(ref => !/^(?:[a-z]+:|\/\/|#|\?)/i.test(ref))
  .map(ref => decodeURIComponent(ref.split(/[?#]/)[0]).replace(/^\.\//, ''))
  .filter(ref => ref && ref !== '.');
const structuredGraphs = html => [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => JSON.parse(match[1]));
const structuredTypes = graphs => graphs.flatMap(graph => (graph?.['@graph'] || [graph]))
  .flatMap(item => Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']])
  .filter(Boolean);
const cssBalanced = value => {
  const clean = value.replace(/\/\*[\s\S]*?\*\//g, '');
  let balance = 0;
  for (const character of clean) {
    if (character === '{') balance += 1;
    if (character === '}') balance -= 1;
    if (balance < 0) return false;
  }
  return balance === 0;
};

const replacedFiles = [
  '404.html', 'app.js', 'busca-v165.js', 'buscar.html', 'cartas-do-tarot.html',
  'consultas-de-tarot.html', 'escola-do-tarot.html', 'guias-para-comecar.html',
  'index.html', 'offline.html', 'page-loader-v1.js', 'politica-editorial.html',
  'robots.txt', 'simbolos-do-tarot.html', 'sitemap.xml', 'sw.js', 'tiragens-de-tarot.html'
];
const addedFiles = [
  '00-LEIA-PRIMEIRO-V193-SEO-AUTORIDADE-IA.txt', 'ARQUIVOS-V193-SHA256.txt',
  'BUILD-SITEMAPS-V193.mjs', 'EVIDENCIA-QA-V193.json', 'MANIFESTO-V193-SEO-AUTORIDADE-IA.json',
  'QA-V193-SEO-AUTORIDADE-IA.mjs', 'SEO-AUTORIDADE-BUSCA-IA-V193.json',
  'mapa-do-tarot.html', 'seo-authority-v193.css', 'seo-index-policy-v193.js',
  'sitemap-aprendizado.xml', 'sitemap-cartas.xml', 'sitemap-consultas.xml',
  'sitemap-naipes-simbolos.xml', 'sitemap-principal.xml', 'sitemap-tiragens.xml'
];
const releaseFiles = [...replacedFiles, ...addedFiles];

for (const file of releaseFiles) check(`${file}: presente`, () => assert.ok(fs.existsSync(path.join(ROOT, file))));

for (const file of ['app.js', 'busca-v165.js', 'page-loader-v1.js', 'seo-index-policy-v193.js', 'sw.js', 'BUILD-SITEMAPS-V193.mjs', 'QA-V193-SEO-AUTORIDADE-IA.mjs']) {
  check(`${file}: sintaxe JavaScript`, () => {
    const run = spawnSync(process.execPath, ['--check', file], { cwd: ROOT, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr || run.stdout);
  });
}

for (const file of ['SEO-AUTORIDADE-BUSCA-IA-V193.json', 'MANIFESTO-V193-SEO-AUTORIDADE-IA.json', 'EVIDENCIA-QA-V193.json']) {
  check(`${file}: JSON válido`, () => JSON.parse(source(file)));
}

const index = source('index.html');
for (const [name, marker] of [
  ['aplicativo V193', 'app.js?v=193'],
  ['service worker V193', "register('./sw.js?v=193')"],
  ['recarga isolada V193', 'divina.sw.reload.v193'],
  ['Mapa do Tarot rastreável', 'href="mapa-do-tarot.html"'],
  ['Tarot Livre 78', '78 cartas sem repetição'],
  ['Mesa Real 13 linhas', 'aria-rowcount="13"'],
  ['Mesa Real 6 colunas', 'aria-colcount="6"'],
  ['revelação sem significado', 'DIRETA · SEM SIGNIFICADO']
]) check(`index.html: ${name}`, () => assert.ok(index.includes(marker), `ausente: ${marker}`));
for (const marker of ['src="app.js?v=192"', "register('./sw.js?v=192')", 'divina.sw.reload.v192']) {
  check(`index.html: versão anterior inativa ${marker}`, () => assert.ok(!index.includes(marker)));
}

const app = source('app.js');
for (const marker of ['APLICATIVO V193', "page-loader-v1.js?v=193", "seo-index-policy-v193.js?v=193", 'installIndexPolicyV193', "register('./sw.js?v=193')"]) {
  check(`app.js: ${marker}`, () => assert.ok(app.includes(marker)));
}
check('page-loader-v1.js: V193 e heranças preservadas', () => {
  const value = source('page-loader-v1.js');
  assert.ok(value.includes('AUTORIDADE TEMÁTICA V193'));
  assert.ok(value.includes("import('./premium-engine-v191.js?v=191')"));
  assert.ok(value.includes("import('./media-engine-v192.js?v=192')"));
});

const policy = await import(`${pathToFileURL(path.join(ROOT, 'seo-index-policy-v193.js')).href}?qa=193`);
check('política: versão V193', () => assert.equal(policy.SEO_INDEX_POLICY_V193.version, 'V193'));
check('política: rotas privadas noindex', () => {
  for (const target of ['#admin', '#login', '#conta', '#ai', '#orbe-ia', '#journal', '#diario', '#premium', '#checkout', '#skins', '#notifications']) {
    assert.equal(policy.routeNeedsNoindexV193({ pathname: '/', hash: target, search: '' }), true, target);
  }
});
check('política: rotas públicas indexáveis', () => {
  for (const target of ['#home', '#tarot', '#daily', '#library', '#school', '#spreads', '#consultations']) {
    assert.equal(policy.routeNeedsNoindexV193({ pathname: '/', hash: target, search: '' }), false, target);
  }
});
check('política: caminho privado noindex', () => assert.equal(policy.routeNeedsNoindexV193({ pathname: '/conta', hash: '', search: '' }), true));
check('política: diretivas explícitas', () => assert.deepEqual(
  [policy.SEO_INDEX_POLICY_V193.publicDirectives, policy.SEO_INDEX_POLICY_V193.privateDirectives],
  ['index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'noindex,nofollow,noarchive']
));

for (const file of ['404.html', 'offline.html']) {
  const html = source(file);
  check(`${file}: noindex`, () => assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive">/));
  check(`${file}: sem canonical`, () => assert.doesNotMatch(html, /rel=["']canonical["']/i));
}

const robots = source('robots.txt');
check('robots.txt: rastreamento público permitido', () => assert.match(robots, /^User-agent: \*\s+Allow: \//m));
check('robots.txt: não tenta esconder páginas com Disallow', () => assert.doesNotMatch(robots, /^Disallow:/m));
check('robots.txt: aponta para índice V193', () => assert.ok(robots.includes('Sitemap: https://divinabruxa.com.br/sitemap.xml')));
check('robots.txt: explica autenticação', () => assert.ok(robots.includes('nunca por robots.txt')));

const mapHtml = source('mapa-do-tarot.html');
check('Mapa: um H1', () => assert.equal((mapHtml.match(/<h1\b/gi) || []).length, 1));
check('Mapa: IDs únicos', () => {
  const ids = htmlIds(mapHtml);
  assert.equal(new Set(ids).size, ids.length);
});
check('Mapa: referências locais presentes', () => {
  const missing = [...new Set(localRefs(mapHtml).filter(ref => !fs.existsSync(path.join(ROOT, ref))))];
  assert.deepEqual(missing, []);
});
check('Mapa: canonical e metadados', () => {
  assert.ok(mapHtml.includes('https://divinabruxa.com.br/mapa-do-tarot.html'));
  assert.ok(mapHtml.includes('Conteúdo e revisão: Divina Bruxa'));
  assert.ok(mapHtml.includes('9 de setembro de 2026'));
});
check('Mapa: seis clusters reais', () => assert.equal((mapHtml.match(/data-topic-cluster=/g) || []).length, 6));
for (const topic of ['cartas', 'naipes', 'simbolos', 'tiragens', 'aprendizado', 'consultas']) {
  check(`Mapa: cluster ${topic}`, () => assert.ok(mapHtml.includes(`data-topic-cluster="${topic}"`)));
}
for (const file of ['cartas-do-tarot.html', 'arcanos-menores.html', 'simbolos-do-tarot.html', 'tiragens-de-tarot.html', 'escola-do-tarot.html', 'consultas-de-tarot.html']) {
  check(`Mapa: destino ${file}`, () => assert.ok(mapHtml.includes(`href="${file}"`)));
}
const mapTypes = structuredTypes(structuredGraphs(mapHtml));
for (const type of ['Organization', 'WebSite', 'BreadcrumbList', 'CollectionPage', 'ItemList']) {
  check(`Mapa: JSON-LD ${type}`, () => assert.ok(mapTypes.includes(type)));
}
check('Mapa: marcação representa conteúdo visível', () => {
  assert.ok(mapHtml.includes('Somente tipos e propriedades') === false);
  assert.ok(mapHtml.includes('não existem avaliações, credenciais, episódios, produtos ou datas inventadas'));
});

const css = source('seo-authority-v193.css');
check('CSS V193: chaves equilibradas', () => assert.ok(cssBalanced(css)));
check('CSS V193: mobile', () => assert.match(css, /@media \(max-width:560px\)/));
check('CSS V193: movimento reduzido', () => assert.match(css, /prefers-reduced-motion:reduce/));
check('CSS V193: cores forçadas', () => assert.match(css, /forced-colors:active/));
check('CSS V193: toque de 44px', () => assert.match(css, /min-height:44px/));
check('CSS V193: safe area', () => assert.match(css, /safe-area-inset/));

check('Busca: Mapa do Tarot indexado', () => {
  const search = source('busca-v165.js');
  assert.ok(search.includes("['Mapa do Tarot', 'mapa-do-tarot.html'"));
  assert.ok(search.includes('cartas, naipes, símbolos, tiragens, aprendizado e consultas'));
});
check('Busca: cachebuster V193', () => assert.ok(source('buscar.html').includes('busca-v165.js?v=193')));
check('Política editorial: busca e IA responsável', () => {
  const editorial = source('politica-editorial.html');
  assert.ok(editorial.includes('BUSCA E EXPERIÊNCIAS COM IA · V193'));
  assert.ok(editorial.includes('Sem arquivo mágico para IA'));
  assert.ok(editorial.includes('mapa-do-tarot.html'));
});
for (const file of ['buscar.html', 'cartas-do-tarot.html', 'simbolos-do-tarot.html', 'tiragens-de-tarot.html', 'escola-do-tarot.html', 'consultas-de-tarot.html', 'guias-para-comecar.html', 'politica-editorial.html']) {
  check(`${file}: ligação temática`, () => assert.ok(source(file).includes('href="mapa-do-tarot.html"')));
}

const htmlFiles = fs.readdirSync(ROOT).filter(file => file.endsWith('.html')).sort();
const publicPages = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
for (const file of htmlFiles) {
  const html = source(file);
  const robotsValue = get(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)/i);
  const canonical = get(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i);
  const title = get(html, /<title>([^<]+)<\/title>/i);
  const description = get(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)/i);
  check(`${file}: um título e um H1`, () => {
    assert.equal((html.match(/<title>/gi) || []).length, 1);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  });
  check(`${file}: IDs únicos`, () => {
    const ids = htmlIds(html);
    assert.equal(new Set(ids).size, ids.length);
  });
  if (!/noindex/i.test(robotsValue) && canonical) {
    publicPages.push({ file, html, title, description, canonical });
    check(`${file}: metadados públicos completos`, () => {
      assert.ok(title && description && canonical && /index,follow/i.test(robotsValue));
      assert.ok(canonical.startsWith('https://divinabruxa.com.br/'));
    });
    check(`${file}: JSON-LD válido`, () => assert.ok(structuredGraphs(html).length > 0));
    if (file !== 'index.html') check(`${file}: breadcrumb`, () => assert.ok(structuredTypes(structuredGraphs(html)).includes('BreadcrumbList')));
    for (const [map, key] of [[titles, title], [descriptions, description], [canonicals, canonical]]) {
      map.set(key, [...(map.get(key) || []), file]);
    }
  }
}
check('HTML: 137 páginas totais', () => assert.equal(htmlFiles.length, 137));
check('SEO: 135 páginas públicas', () => assert.equal(publicPages.length, 135));
for (const [name, map] of [['títulos', titles], ['descrições', descriptions], ['canonicals', canonicals]]) {
  check(`SEO: ${name} únicos`, () => assert.deepEqual([...map.values()].filter(files => files.length > 1), []));
}

const sitemapFiles = ['sitemap-principal.xml', 'sitemap-cartas.xml', 'sitemap-naipes-simbolos.xml', 'sitemap-tiragens.xml', 'sitemap-aprendizado.xml', 'sitemap-consultas.xml'];
const sitemapIndex = source('sitemap.xml');
check('sitemap.xml: índice válido', () => assert.match(sitemapIndex, /<sitemapindex\b/));
const indexLocations = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
check('sitemap.xml: seis filhos', () => assert.deepEqual(indexLocations, sitemapFiles.map(file => `https://divinabruxa.com.br/${file}`)));
const childLocations = [];
const childCounts = {};
for (const file of sitemapFiles) {
  const xml = source(file);
  check(`${file}: urlset válido`, () => assert.match(xml, /<urlset\b/));
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  childCounts[file] = locations.length;
  childLocations.push(...locations);
  check(`${file}: URLs HTTPS da origem`, () => assert.ok(locations.every(url => url.startsWith('https://divinabruxa.com.br/'))));
}
check('sitemaps: contagens temáticas', () => assert.deepEqual(childCounts, {
  'sitemap-principal.xml': 11,
  'sitemap-cartas.xml': 81,
  'sitemap-naipes-simbolos.xml': 10,
  'sitemap-tiragens.xml': 15,
  'sitemap-aprendizado.xml': 15,
  'sitemap-consultas.xml': 3
}));
check('sitemaps: 135 URLs únicas', () => {
  assert.equal(childLocations.length, 135);
  assert.equal(new Set(childLocations).size, 135);
});
check('sitemaps: correspondem aos HTML públicos', () => assert.deepEqual(
  [...new Set(childLocations)].sort(),
  publicPages.map(page => page.canonical).sort()
));
check('sitemap de cartas: 78 imagens', () => assert.equal((source('sitemap-cartas.xml').match(/<image:image>/g) || []).length, 78));

const sw = source('sw.js');
for (const marker of [
  'divina-bruxa-v63-seo-authority-v193',
  "'./seo-index-policy-v193.js'",
  "'./mapa-do-tarot.html'",
  "'./seo-authority-v193.css'",
  "'./premium-engine-v191.js'",
  "'./editorial-catalog-v192.js'"
]) check(`sw.js: ${marker}`, () => assert.ok(sw.includes(marker)));

const seoContract = JSON.parse(source('SEO-AUTORIDADE-BUSCA-IA-V193.json'));
check('contrato: V193 Macroetapa 15 sobre V192', () => assert.deepEqual(
  [seoContract.version, seoContract.macroetapa, seoContract.baseline], ['V193', 15, 'V192']
));
check('contrato: seis temas', () => assert.deepEqual(seoContract.topicArchitecture.map(item => item.id), ['cartas', 'naipes', 'simbolos', 'tiragens', 'aprendizado', 'consultas']));
check('contrato: sem truques para IA', () => assert.deepEqual(
  [seoContract.aiSearch.specialTechnicalRequirements, seoContract.aiSearch.llmsTxtAdded, seoContract.aiSearch.syntheticAeoGeoPagesAdded],
  [false, false, false]
));
check('contrato: todos os portões externos bloqueados', () => assert.ok(Object.values(seoContract.protectedGates).every(value => value === false)));
check('contrato: Search Console não acionado', () => assert.equal(seoContract.searchConsole.v193RemoteActionPerformed, false));

const tarot = await import(`${pathToFileURL(path.join(ROOT, 'tarot-data.js')).href}?qa=193`);
check('regressão Tarot: 78 cartas únicas', () => {
  assert.equal(tarot.CARDS.length, 78);
  assert.equal(new Set(tarot.CARDS.map(card => card.canonicalId)).size, 78);
  assert.ok(tarot.CARDS.every(card => card.orientation === 'normal'));
});
const config = (await import(`${pathToFileURL(path.join(ROOT, 'config.js')).href}?qa=193`)).CONFIG;
check('regressão Consultas: serviços e preços', () => assert.deepEqual(config.services.map(item => item.price), [250, 150, 100, 50]));
check('regressão contato: e-mail e sem WhatsApp', () => assert.deepEqual([config.contactEmail, config.whatsapp], ['orbedasrealidades@hotmail.com', '']));
const premium = await import(`${pathToFileURL(path.join(ROOT, 'premium-policy-v191.js')).href}?qa=193`);
check('regressão Premium: preços V191', () => assert.deepEqual(
  premium.PREMIUM_PRODUCTS_V191.map(item => [item.key, item.priceCents, item.credits ?? null]),
  [['premium_lifetime', 19990, null], ['orbe_ai_monthly', 8990, 400], ['credits_200', 3990, 200], ['credits_600', 9990, 600], ['credits_1500', 19990, 1500]]
));
for (const gate of ['realBilling', 'stripeCheckoutEnabled', 'stripeWebhookEnabled', 'customerPortalEnabled', 'automaticTaxEnabled']) {
  check(`regressão Premium: ${gate} off`, () => assert.equal(premium.BILLING_POLICY_V191[gate], false));
}
const skins = await import(`${pathToFileURL(path.join(ROOT, 'skin-catalog-v6.js')).href}?qa=193`);
check('regressão Skins: 30 formas únicas', () => {
  assert.equal(skins.SKINS_V6.length, 30);
  assert.equal(new Set(skins.SKINS_V6.map(item => item.id)).size, 30);
});
const catalog = await import(`${pathToFileURL(path.join(ROOT, 'editorial-catalog-v192.js')).href}?qa=193`);
check('regressão V192: Loja, música e vídeo', () => assert.deepEqual(
  [catalog.STORE_PRODUCTS_V192.length, catalog.MUSIC_ALBUMS_V192.length, catalog.VIDEO_EPISODES_V192.length],
  [21, 2, 0]
));
check('regressão V192: sem publicação ou escrita externa', () => assert.deepEqual(
  [catalog.EDITORIAL_RELEASE_V192.productionPublished, catalog.EDITORIAL_RELEASE_V192.externalWrites],
  [false, false]
));

const frozenHashes = {
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for (const [file, expected] of Object.entries(frozenHashes)) check(`congelado: ${file}`, () => assert.equal(sha256(file), expected));

const manifest = JSON.parse(source('MANIFESTO-V193-SEO-AUTORIDADE-IA.json'));
check('manifesto: delta plano de 33 arquivos', () => assert.deepEqual(
  [manifest.version, manifest.baselineRequired, manifest.delivery.type, manifest.delivery.containsDirectories, manifest.delivery.fileCount],
  ['V193', 'V192-completa-corrigida', 'delta-flat', false, 33]
));
check('manifesto: listas exatas e zero exclusão', () => {
  assert.deepEqual(manifest.replacedFiles, replacedFiles);
  assert.deepEqual(manifest.addedFiles, addedFiles);
  assert.deepEqual(manifest.delivery.deleteFiles, []);
  assert.equal(new Set([...manifest.replacedFiles, ...manifest.addedFiles]).size, 33);
});
check('manifesto: métricas do sitemap', () => assert.deepEqual([manifest.publicUrlCount, manifest.sitemapCount, manifest.imageSitemapEntries], [135, 6, 78]));
check('manifesto: zero escrita externa', () => assert.ok(Object.values(manifest.externalWrites).every(value => value === false)));

const evidence = JSON.parse(source('EVIDENCIA-QA-V193.json'));
check('evidência: versão e baseline', () => assert.deepEqual([evidence.version, evidence.baseline], ['V193', 'V192-completa-corrigida']));
check('evidência: P0 e P1 zerados', () => assert.deepEqual([evidence.severity.P0, evidence.severity.P1], [0, 0]));
check('evidência: instalação incremental validada', () => assert.deepEqual(
  [evidence.cleanInstall.base, evidence.cleanInstall.archiveType, evidence.cleanInstall.archiveMembers, evidence.cleanInstall.directoriesInArchive],
  ['V192-completa-corrigida', 'flat-delta', 33, 0]
));

const checksumLines = source('ARQUIVOS-V193-SHA256.txt').split(/\r?\n/)
  .map(line => line.match(/^([a-f0-9]{64})  ([^\s].*)$/))
  .filter(Boolean)
  .map(match => ({ expected: match[1], file: match[2] }));
check('checksums: 32 membros, sem autorreferência', () => {
  assert.equal(checksumLines.length, 32);
  assert.ok(!checksumLines.some(item => item.file === 'ARQUIVOS-V193-SHA256.txt'));
});
for (const item of checksumLines) check(`checksum: ${item.file}`, () => assert.equal(sha256(item.file), item.expected));

const securityFiles = [
  'app.js', 'busca-v165.js', 'buscar.html', 'index.html', 'mapa-do-tarot.html',
  'page-loader-v1.js', 'politica-editorial.html', 'seo-authority-v193.css',
  'seo-index-policy-v193.js', 'sw.js', 'SEO-AUTORIDADE-BUSCA-IA-V193.json'
];
const releaseText = securityFiles.map(source).join('\n');
check('segurança: sem chave Stripe live', () => assert.doesNotMatch(releaseText, /sk_live_[A-Za-z0-9]+/));
check('segurança: sem service role', () => assert.doesNotMatch(releaseText, /SUPABASE_SERVICE_ROLE_KEY|service_role/));
check('segurança: sem envio Resend', () => assert.doesNotMatch(releaseText, /api\.resend\.com|resend\.emails\.send/));
check('segurança: sem llms.txt', () => assert.ok(!fs.existsSync(path.join(ROOT, 'llms.txt'))));

const failed = results.filter(result => !result.ok);
const report = {
  suite: 'DIVINA-BRUXA-V193-SEO-AUTORIDADE-IA',
  status: failed.length ? 'FAIL' : 'PASS',
  total: results.length,
  passed: results.length - failed.length,
  severity: { P0: 0, P1: failed.length },
  failed
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = failed.length ? 1 : 0;
