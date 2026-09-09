#!/usr/bin/env node
/* QA determinístico da entrega incremental V192. Execute na raiz instalada. */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || process.cwd());
const cache = new Map();
const results = [];

async function source(file) {
  if (!cache.has(file)) cache.set(file, await readFile(path.join(ROOT, file), 'utf8'));
  return cache.get(file);
}

function check(name, task) {
  try {
    task();
    results.push({name,ok:true});
  } catch (error) {
    results.push({name,ok:false,error:error.message});
  }
}

async function contains(file, entries) {
  const value = await source(file);
  for (const [name, needle] of entries) {
    check(`${file}: ${name}`, () => {
      if (needle instanceof RegExp) assert.match(value, needle);
      else assert.ok(value.includes(needle), `ausente: ${needle}`);
    });
  }
}

async function excludes(file, entries) {
  const value = await source(file);
  for (const [name, needle] of entries) {
    check(`${file}: ${name}`, () => {
      if (needle instanceof RegExp) assert.doesNotMatch(value, needle);
      else assert.ok(!value.includes(needle), `não deveria conter: ${needle}`);
    });
  }
}

const sha256 = async file => createHash('sha256').update(await readFile(path.join(ROOT, file))).digest('hex');
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

const htmlIds = html => [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
const localRefs = html => [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)]
  .map(match => match[1])
  .filter(ref => !/^(?:[a-z]+:|\/\/|#)/i.test(ref))
  .map(ref => ref.split(/[?#]/)[0])
  .filter(Boolean)
  .map(ref => decodeURIComponent(ref).replace(/^\.\//, ''));
const structuredGraphs = html => [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => JSON.parse(match[1]));
const structuredTypes = graphs => graphs.flatMap(graph => {
  const values = graph?.['@graph'] || [graph];
  return values.flatMap(item => Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']]).filter(Boolean);
});

const releaseFiles = [
  '00-LEIA-PRIMEIRO-V192-UNIVERSO-EDITORIAL.txt',
  'app.js',
  'ARQUIVOS-V192-SHA256.txt',
  'buscar.html',
  'busca-v165.js',
  'config.js',
  'de-frente-com-o-tarot.html',
  'editorial-catalog-v192.js',
  'editorial-journey-v192.js',
  'editorial-metrics-v192.js',
  'editorial-universe-v192.css',
  'EDITORIAL-CALENDAR-V192.json',
  'EDITORIAL-UNIVERSE-V192.json',
  'EVIDENCIA-QA-V192.json',
  'index.html',
  'loja-mistica.html',
  'media-engine-v192.js',
  'media-policy-v192.js',
  'MEDIA-CATALOG-V192.json',
  'MANIFESTO-V192-UNIVERSO-EDITORIAL.json',
  'musica.html',
  'page-loader-v1.js',
  'politica-editorial.html',
  'privacidade-e-dados.html',
  'sitemap.xml',
  'store-engine.js',
  'store-policy.js',
  'sw.js',
  'termos-de-uso.html'
];
for (const file of releaseFiles) check(`${file}: presente`, () => assert.ok(existsSync(path.join(ROOT, file))));

for (const file of [
  'app.js','busca-v165.js','config.js','editorial-catalog-v192.js','editorial-journey-v192.js',
  'editorial-metrics-v192.js','media-engine-v192.js','media-policy-v192.js','page-loader-v1.js',
  'store-engine.js','store-policy.js','sw.js'
]) {
  check(`${file}: sintaxe JavaScript`, () => {
    const run = spawnSync(process.execPath, ['--check', file], {cwd:ROOT,encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);
  });
}

for (const file of ['EDITORIAL-CALENDAR-V192.json','EDITORIAL-UNIVERSE-V192.json','EVIDENCIA-QA-V192.json','MANIFESTO-V192-UNIVERSO-EDITORIAL.json','MEDIA-CATALOG-V192.json']) {
  const value = await source(file);
  check(`${file}: JSON válido`, () => JSON.parse(value));
}

await contains('index.html', [
  ['aplicativo V192', 'app.js?v=192'],
  ['CSS editorial V192', 'editorial-universe-v192.css?v=192'],
  ['service worker V192', "register('./sw.js?v=192')"],
  ['recarga isolada V192', 'divina.sw.reload.v192'],
  ['Loja V192', 'data-store-engine="v192"'],
  ['Música V192', 'data-media-engine="v192"'],
  ['21 escolhas declaradas', 'Explore 21 escolhas por finalidade'],
  ['piloto honesto', 'O piloto está em preparação'],
  ['player voluntário', 'player do Spotify carregado somente quando você escolher'],
  ['portal público Loja', 'href="loja-mistica.html"'],
  ['portal público Música', 'href="musica.html"'],
  ['portal público série', 'href="de-frente-com-o-tarot.html"'],
  ['Tarot Livre 78', '78 cartas sem repetição'],
  ['Mesa Real 13', 'aria-rowcount="13"'],
  ['Mesa Real 6', 'aria-colcount="6"'],
  ['sem significado na revelação', 'DIRETA · SEM SIGNIFICADO']
]);
await excludes('index.html', [
  ['sem app V191 ativo', 'src="app.js?v=191"'],
  ['sem SW V191 ativo', "register('./sw.js?v=191')"],
  ['sem engine Loja V148 ativo', 'data-store-engine="v148"'],
  ['sem engine mídia V149 ativo', 'data-media-engine="v149"']
]);

const index = await source('index.html');
const ids = htmlIds(index);
check('index.html: IDs únicos', () => assert.equal(new Set(ids).size, ids.length));
check('index.html: referências locais presentes', () => {
  const missing = [...new Set(localRefs(index).filter(ref => !existsSync(path.join(ROOT, ref))))];
  assert.deepEqual(missing, []);
});

await contains('app.js', [
  ['release V192', 'APLICATIVO V192'],
  ['loader V192', "page-loader-v1.js?v=192"],
  ['métricas globais', "editorial-metrics-v192.js?v=192"],
  ['binder editorial', 'bindEditorialMetrics(document.body)'],
  ['fallback SW V192', "register('./sw.js?v=192')"]
]);
await contains('page-loader-v1.js', [
  ['engine mídia V192', "import('./media-engine-v192.js?v=192')"],
  ['jornada editorial V192', "import('./editorial-journey-v192.js?v=192')"],
  ['engine Loja V192', "import('./store-engine.js?v=192')"],
  ['classe mídia V192', 'new MediaEngineV192'],
  ['jornada da Loja', "new EditorialJourneyV192($('#storeApp'), 'store')"],
  ['Premium V191 preservado', "import('./premium-engine-v191.js?v=191')"],
  ['skins V191 preservadas', "import('./skins-v191.js?v=191')"]
]);

const catalog = await import(`${pathToFileURL(path.join(ROOT, 'editorial-catalog-v192.js')).href}?v=192`);
const configModule = await import(`${pathToFileURL(path.join(ROOT, 'config.js')).href}?qa=192`);
const storeModule = await import(`${pathToFileURL(path.join(ROOT, 'store-engine.js')).href}?qa=192`);
const storePolicyModule = await import(`${pathToFileURL(path.join(ROOT, 'store-policy.js')).href}?qa=192`);
const mediaPolicy = await import(`${pathToFileURL(path.join(ROOT, 'media-policy-v192.js')).href}?qa=192`);
const metrics = await import(`${pathToFileURL(path.join(ROOT, 'editorial-metrics-v192.js')).href}?qa=192`);

const {CONFIG} = configModule;
check('catálogo: release V192', () => assert.equal(catalog.EDITORIAL_RELEASE_V192.version, 'V192'));
check('catálogo: STAGING editorial', () => assert.equal(catalog.EDITORIAL_RELEASE_V192.environment, 'editorial-staging'));
check('catálogo: sem publicação de produção', () => assert.equal(catalog.EDITORIAL_RELEASE_V192.productionPublished, false));
check('catálogo: sem escrita externa', () => assert.equal(catalog.EDITORIAL_RELEASE_V192.externalWrites, false));
check('Loja: exatamente 21 escolhas', () => assert.equal(catalog.STORE_PRODUCTS_V192.length, 21));
check('Loja: IDs únicos', () => assert.equal(new Set(catalog.STORE_PRODUCTS_V192.map(item => item.id)).size, 21));
check('Loja: oito categorias', () => assert.equal(new Set(catalog.STORE_PRODUCTS_V192.map(item => item.category)).size, 8));
check('Loja: finalidade editorial em todas', () => assert.ok(catalog.STORE_PRODUCTS_V192.every(item => item.why && item.description)));
check('Loja: disponibilidade sempre no parceiro', () => assert.ok(catalog.STORE_PRODUCTS_V192.every(item => item.availability === 'partner-confirmation')));
check('Loja: revisão datada', () => assert.ok(catalog.STORE_PRODUCTS_V192.every(item => item.reviewedAt === '2026-09-09')));
check('Loja: arrays congelados', () => assert.ok(Object.isFrozen(catalog.STORE_PRODUCTS_V192) && catalog.STORE_PRODUCTS_V192.every(Object.isFrozen)));
check('config: usa catálogo V192', () => assert.equal(CONFIG.products, catalog.STORE_PRODUCTS_V192));
check('config: contato oficial', () => assert.equal(CONFIG.contactEmail, 'orbedasrealidades@hotmail.com'));
check('config: WhatsApp ausente', () => assert.equal(CONFIG.whatsapp, ''));
check('config: tag Amazon preservada', () => assert.equal(CONFIG.amazonAssociateTag, 'orbedasrealid-20'));
check('Loja: termos tecnológicos não envelhecem o catálogo', () => {
  const text = JSON.stringify(catalog.STORE_PRODUCTS_V192);
  assert.doesNotMatch(text, /chip M4|Pro Max|Watch Ultra|AirPods Max/);
});
check('Loja: URL afiliada segura e identificada', () => {
  const url = new URL(storeModule.buildAmazonAffiliateURL(catalog.STORE_PRODUCTS_V192[0], CONFIG.amazonAssociateTag));
  assert.equal(url.protocol, 'https:');
  assert.ok(url.hostname === 'www.amazon.com.br' || url.hostname.endsWith('.amazon.com.br'));
  assert.equal(url.searchParams.get('tag'), 'orbedasrealid-20');
});
check('Loja: host malicioso vira busca segura', () => {
  const url = new URL(storeModule.buildAmazonAffiliateURL({name:'Teste',url:'https://evil.example/sku'}, CONFIG.amazonAssociateTag));
  assert.equal(url.hostname, 'www.amazon.com.br');
});
check('Loja: política V192 e zero checkout', () => {
  assert.equal(storePolicyModule.STORE_POLICY.version, 'v192');
  assert.equal(storePolicyModule.STORE_POLICY.checkout, false);
  assert.equal(storePolicyModule.STORE_POLICY.productionBilling, false);
});
await contains('store-engine.js', [
  ['política V192', "store-policy.js?v=192"],
  ['divulgação visível', 'TRANSPARÊNCIA DE AFILIADO'],
  ['finalidade visível', 'Por que está aqui:'],
  ['preço no parceiro', 'Confirmar na Amazon'],
  ['rel patrocinado', 'rel="nofollow sponsored noopener"'],
  ['conversão permitida', 'data-editorial-target="store_amazon"'],
  ['guia público', 'loja-mistica.html'],
  ['dataset pronto V192', "this.root.dataset.storeReady = 'v192'"]
]);
await excludes('store-engine.js', [
  ['sem contador antigo invasivo', 'affiliateClicks'],
  ['sem integração de pagamento', /PaymentIntent|cardNumber|api\.stripe\.com|checkout\.sessions/i]
]);

check('Música: dois álbuns publicados', () => assert.equal(catalog.MUSIC_ALBUMS_V192.length, 2));
check('Música: IDs e anos exatos', () => assert.deepEqual(
  catalog.MUSIC_ALBUMS_V192.map(item => [item.name,item.id,item.releaseYear,item.status]),
  [
    ['Sobre as Estrelas','0GwJtJujeS9iwSZFADcL1k',2024,'published'],
    ['Z','4mq0UaLMXK21JbrKMFdhdO',2026,'published']
  ]
));
check('Música: config compartilha catálogo canônico', () => assert.equal(CONFIG.spotifyAlbums, catalog.MUSIC_ALBUMS_V192));
check('Mídia: política V192', () => assert.equal(mediaPolicy.MEDIA_POLICY_V192.version, 'V192'));
check('Mídia: URLs aprovadas', () => {
  assert.ok(mediaPolicy.safeMediaURLV192('https://open.spotify.com/album/abc123abc123'));
  assert.ok(mediaPolicy.safeMediaURLV192('https://www.youtube.com/watch?v=ok'));
  assert.equal(mediaPolicy.safeMediaURLV192('http://youtube.com/watch?v=no'), '');
  assert.equal(mediaPolicy.safeMediaURLV192('javascript:alert(1)'), '');
  assert.equal(mediaPolicy.safeMediaURLV192('https://evil.example/video'), '');
});
check('Mídia: transcrição somente em página oficial', () => {
  assert.equal(mediaPolicy.safeTranscriptURLV192('transcricoes/episodio-01.html'), 'https://divinabruxa.com.br/transcricoes/episodio-01.html');
  assert.equal(mediaPolicy.safeTranscriptURLV192('https://evil.example/transcricao.html'), '');
  assert.equal(mediaPolicy.safeTranscriptURLV192('arquivo.pdf'), '');
});
check('Mídia: publicação explícita e futura oculta', () => {
  const now = new Date('2026-09-09T12:00:00Z');
  const fixtures = [
    {status:'draft',url:'https://youtu.be/draft'},
    {status:'published',url:'https://evil.example/video'},
    {status:'published',url:'https://youtu.be/future',publishAt:'2027-01-01T00:00:00Z'},
    {status:'published',url:'https://youtu.be/public',publishAt:'2026-09-09T00:00:00Z'}
  ];
  assert.equal(mediaPolicy.publishedMediaItemsV192(fixtures, now).length, 1);
});
check('Vídeo: piloto em preparação', () => assert.equal(catalog.VIDEO_SERIES_V192.status, 'pilot-preparation'));
check('Vídeo: zero episódios públicos', () => assert.deepEqual([catalog.VIDEO_SERIES_V192.publicEpisodeCount,catalog.VIDEO_EPISODES_V192.length], [0,0]));
check('Vídeo: config mantém vazio canônico', () => assert.equal(CONFIG.youtubeVideos, catalog.VIDEO_EPISODES_V192));
await contains('media-engine-v192.js', [
  ['click para carregar', 'data-load-spotify'],
  ['zero iframe antes do toque', 'O conteúdo externo ainda não foi carregado.'],
  ['um iframe oficial', 'https://open.spotify.com/embed/album/'],
  ['sem autoplay', 'loading="lazy"'],
  ['tablist acessível', 'role="tablist"'],
  ['teclas direcionais', "'ArrowLeft','ArrowRight','ArrowUp','ArrowDown'"],
  ['acessibilidade exigida', 'accessibilityText'],
  ['legenda ou transcrição', 'episode?.captions === true'],
  ['estado vazio verdadeiro', 'Piloto em preparação editorial.'],
  ['sem episódios inventados', 'Esta página não mostra capas, títulos ou datas que não tenham sido confirmados.'],
  ['destino YouTube medido localmente', 'data-editorial-target="youtube_channel"'],
  ['dataset V192', "root.dataset.mediaReady = 'v192'"]
]);

check('Calendário: quatro pontos editoriais', () => assert.equal(catalog.EDITORIAL_RHYTHM_V192.length, 4));
check('Calendário: conecta Biblioteca e Escola', () => {
  const destinations = new Set(catalog.EDITORIAL_RHYTHM_V192.map(item => item.destination));
  assert.ok(destinations.has('library') && destinations.has('school'));
});
check('Calendário: não promete episódio futuro', () => {
  const video = catalog.EDITORIAL_RHYTHM_V192.find(item => item.destination === 'videos');
  assert.equal(video?.publication, 'when-published');
});
await contains('editorial-journey-v192.js', [
  ['propósito por área', 'PROPÓSITO DESTA ÁREA'],
  ['calendário editorial', 'CALENDÁRIO EDITORIAL'],
  ['não fabrica novidade', 'sem fabricar novidade'],
  ['Biblioteca', "['library'"],
  ['Escola', "['school'"],
  ['consentimento visível', 'renderEditorialConsent(this.root)']
]);

check('Métricas: desligadas por padrão', () => assert.equal(metrics.editorialMetricsEnabled(), false));
check('Métricas: evento sem consentimento não grava', () => assert.equal(metrics.recordEditorialConversion('store_amazon').recorded, false));
check('Métricas: política local e 90 dias', () => assert.deepEqual(
  [metrics.EDITORIAL_METRICS_POLICY_V192.storage,metrics.EDITORIAL_METRICS_POLICY_V192.retentionDays,metrics.EDITORIAL_METRICS_POLICY_V192.externalProvider],
  ['local-only',90,false]
));
check('Métricas: oito alvos fechados', () => assert.equal(catalog.EDITORIAL_CONVERSION_TARGETS_V192.length, 8));
await contains('editorial-metrics-v192.js', [
  ['consentimento analytics', "consentPreference: 'analytics'"],
  ['sem busca', 'recordsSearchTerms: false'],
  ['sem URLs', 'recordsUrls: false'],
  ['sem conteúdo', 'recordsContent: false'],
  ['sem identidade', 'recordsIdentity: false'],
  ['controle acessível', 'data-editorial-consent'],
  ['expiração 90 dias', 'retentionDays: 90']
]);
await excludes('editorial-metrics-v192.js', [
  ['sem rede', /\bfetch\s*\(|sendBeacon|XMLHttpRequest|WebSocket/],
  ['sem textos privados', /journal_body|consultation_question|message_body/]
]);

const publicPages = ['loja-mistica.html','musica.html','de-frente-com-o-tarot.html'];
const pageTypes = new Map();
for (const file of publicPages) {
  const html = await source(file);
  check(`${file}: um H1`, () => assert.equal((html.match(/<h1\b/gi) || []).length, 1));
  check(`${file}: canonical HTTPS`, () => assert.match(html, /<link rel="canonical" href="https:\/\/divinabruxa\.com\.br\/[^"]+">/));
  check(`${file}: IDs únicos`, () => {
    const values = htmlIds(html);
    assert.equal(new Set(values).size, values.length);
  });
  check(`${file}: referências locais presentes`, () => {
    const missing = [...new Set(localRefs(html).filter(ref => !existsSync(path.join(ROOT, ref))))];
    assert.deepEqual(missing, []);
  });
  check(`${file}: JSON-LD válido`, () => assert.ok(structuredGraphs(html).length > 0));
  check(`${file}: BreadcrumbList`, () => assert.ok(structuredTypes(structuredGraphs(html)).includes('BreadcrumbList')));
  check(`${file}: link externo isolado`, () => {
    const tags = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)].map(match => match[0]);
    assert.ok(tags.every(tag => /rel="[^"]*noopener[^"]*"/i.test(tag)));
  });
  pageTypes.set(file, structuredTypes(structuredGraphs(html)));
}
check('SEO Loja: CollectionPage e ItemList sem Product', () => {
  assert.ok(pageTypes.get('loja-mistica.html').includes('CollectionPage'));
  assert.ok(pageTypes.get('loja-mistica.html').includes('ItemList'));
  assert.ok(!pageTypes.get('loja-mistica.html').includes('Product'));
});
check('SEO Música: MusicGroup e dois MusicAlbum', () => {
  const types = pageTypes.get('musica.html');
  assert.ok(types.includes('MusicGroup'));
  assert.equal(types.filter(type => type === 'MusicAlbum').length, 2);
});
check('SEO Vídeo: série sem VideoObject fictício', () => {
  const types = pageTypes.get('de-frente-com-o-tarot.html');
  assert.ok(types.includes('CreativeWorkSeries'));
  assert.ok(!types.includes('VideoObject'));
});
await contains('loja-mistica.html', [
  ['divulgação Amazon', 'Como associado da Amazon'],
  ['zero checkout', '<dd>Nenhum</dd>'],
  ['21 escolhas', 'Explorar as 21 escolhas'],
  ['checklist', 'CHECKLIST DE COMPARAÇÃO']
]);
await contains('musica.html', [
  ['Sobre as Estrelas', '0GwJtJujeS9iwSZFADcL1k'],
  ['Z', '4mq0UaLMXK21JbrKMFdhdO'],
  ['ano 2024', '<dd>2024</dd>'],
  ['ano 2026', '<dd>2026</dd>'],
  ['sem autoplay declarado', '<dd>Não</dd>']
]);
await contains('de-frente-com-o-tarot.html', [
  ['estado real', 'Piloto em preparação'],
  ['zero episódios', '<dd>0</dd>'],
  ['sem promessa', 'não anuncia episódios, convidados ou datas ainda inexistentes'],
  ['canal informado', 'Canal informado da Divina Bruxa']
]);

const sitemap = await source('sitemap.xml');
for (const page of publicPages) check(`sitemap: ${page}`, () => assert.ok(sitemap.includes(`https://divinabruxa.com.br/${page}`)));
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
check('sitemap: URLs únicas', () => assert.equal(new Set(sitemapUrls).size, sitemapUrls.length));
await contains('buscar.html', [['cachebuster da busca V192', 'busca-v165.js?v=192']]);
await contains('busca-v165.js', publicPages.map(page => [`página pesquisável ${page}`, `'${page}'`]));
await contains('politica-editorial.html', [
  ['revisão V192', 'LOJA E MÍDIA · V192'],
  ['não fabricar conteúdo', 'não preencher lacunas com invenção'],
  ['data real', '9 de setembro de 2026']
]);
await contains('privacidade-e-dados.html', [
  ['métricas V192', 'MÉTRICAS EDITORIAIS · V192'],
  ['consentimento off', 'Desativadas até você escolher'],
  ['sem rede', 'não usa fetch, beacon, pixel ou sincronização'],
  ['retenção', '90 dias']
]);
await contains('termos-de-uso.html', [
  ['estado V192', 'ESTADO ATUAL DO PRODUTO · V192'],
  ['Premium anterior preservado', 'Premium V191 preservado no STAGING'],
  ['métricas opcionais', 'As métricas editoriais são obrigatórias?'],
  ['série sem episódio', 'ainda não possui episódio público']
]);

const css = await source('editorial-universe-v192.css');
check('CSS V192: chaves equilibradas', () => assert.ok(cssBalanced(css)));
check('CSS V192: responsivo', () => assert.match(css, /@media \(max-width: 680px\)/));
check('CSS V192: movimento reduzido', () => assert.match(css, /prefers-reduced-motion: reduce/));
check('CSS V192: cores forçadas', () => assert.match(css, /forced-colors: active/));
check('CSS V192: alvos de toque', () => assert.match(css, /min-height: 44px/));
check('CSS V192: safe area', () => assert.match(css, /env\(safe-area-inset-bottom\)/));

await contains('sw.js', [
  ['cache V192', "divina-bruxa-v62-editorial-v192"],
  ['catálogo no núcleo', "'./editorial-catalog-v192.js'"],
  ['métricas no núcleo', "'./editorial-metrics-v192.js'"],
  ['CSS no núcleo', "'./editorial-universe-v192.css'"],
  ['Loja aquecida', "'./loja-mistica.html'"],
  ['Música aquecida', "'./musica.html'"],
  ['Vídeo aquecido', "'./de-frente-com-o-tarot.html'"],
  ['engine mídia aquecida', "'./media-engine-v192.js'"]
]);

const contract = JSON.parse(await source('EDITORIAL-UNIVERSE-V192.json'));
check('contrato: Macroetapa 14', () => assert.deepEqual([contract.version,contract.macroetapa,contract.baseline], ['V192',14,'V191']));
check('contrato: produção e writes bloqueados', () => assert.ok(Object.values(contract.protectedGates).every(value => value === false)));
check('contrato: métricas locais', () => assert.deepEqual([contract.metrics.default,contract.metrics.storage,contract.metrics.externalProvider], ['off','local-only',false]));
check('contrato: invariantes declarados', () => assert.deepEqual(
  [contract.preservedInvariants.tarotCards,contract.preservedInvariants.tarotOrientation,contract.preservedInvariants.tarotRepeat,contract.preservedInvariants.mesaReal,contract.preservedInvariants.skins],
  [78,'normal-only',false,'13x6',30]
));

const manifest = JSON.parse(await source('MANIFESTO-V192-UNIVERSO-EDITORIAL.json'));
check('manifesto: delta plano de 30 arquivos', () => {
  assert.equal(manifest.delivery.type, 'delta-flat');
  assert.equal(manifest.delivery.containsDirectories, false);
  assert.equal(manifest.delivery.fileCount, 30);
  assert.equal(new Set([...manifest.replacedFiles,...manifest.addedFiles]).size, 30);
});
check('manifesto: instalação sobre V191', () => assert.deepEqual(
  [manifest.baselineRequired,manifest.delivery.installMode,manifest.delivery.deleteFiles.length],
  ['V191','replace-or-add',0]
));

const evidence = JSON.parse(await source('EVIDENCIA-QA-V192.json'));
check('evidência: baseline V191 aprovada', () => assert.deepEqual(
  [evidence.baseline.status,evidence.baseline.passed,evidence.baseline.failed],
  ['PASS',271,0]
));
check('evidência: instalação incremental aprovada', () => assert.deepEqual(
  [evidence.cleanInstall.base,evidence.cleanInstall.archiveType,evidence.cleanInstall.archiveMembers,evidence.cleanInstall.directoriesInArchive,evidence.cleanInstall.archiveMembersByteExactAgainstV192],
  ['V191','flat-delta',30,0,true]
));

const checksumLines = (await source('ARQUIVOS-V192-SHA256.txt')).split(/\r?\n/)
  .map(line => line.match(/^([a-f0-9]{64})  ([^\s].*)$/))
  .filter(Boolean)
  .map(match => ({expected:match[1],file:match[2]}));
for (const item of checksumLines) cache.set(`delta-hash:${item.file}`, await sha256(item.file));
check('checksums: 29 membros, sem autorreferência', () => {
  assert.equal(checksumLines.length, 29);
  assert.ok(!checksumLines.some(item => item.file === 'ARQUIVOS-V192-SHA256.txt'));
});
for (const item of checksumLines) {
  check(`checksum: ${item.file}`, () => assert.equal(cache.get(`delta-hash:${item.file}`), item.expected));
}

const cards = await import(`${pathToFileURL(path.join(ROOT, 'tarot-data.js')).href}?qa=192`);
check('regressão Tarot: 78 cartas únicas', () => assert.equal(cards.CARDS.length, 78));
check('regressão Tarot: canonical IDs únicos', () => assert.equal(new Set(cards.CARDS.map(card => card.canonicalId)).size, 78));
check('regressão Tarot: somente orientação normal', () => assert.ok(cards.CARDS.every(card => card.orientation === 'normal')));

const premium = await import(`${pathToFileURL(path.join(ROOT, 'premium-policy-v191.js')).href}?qa=192`);
check('regressão Premium: preços V191 intactos', () => assert.deepEqual(
  premium.PREMIUM_PRODUCTS_V191.map(item => [item.key,item.priceCents,item.credits ?? null]),
  [
    ['premium_lifetime',19990,null],
    ['orbe_ai_monthly',8990,400],
    ['credits_200',3990,200],
    ['credits_600',9990,600],
    ['credits_1500',19990,1500]
  ]
));
for (const gate of ['realBilling','stripeCheckoutEnabled','stripeWebhookEnabled','customerPortalEnabled','automaticTaxEnabled']) {
  check(`regressão Premium: ${gate} off`, () => assert.equal(premium.BILLING_POLICY_V191[gate], false));
}
const skins = await import(`${pathToFileURL(path.join(ROOT, 'skin-catalog-v6.js')).href}?qa=192`);
check('regressão skins: 30 formas', () => assert.equal(skins.SKINS_V6.length, 30));
check('regressão skins: IDs únicos', () => assert.equal(new Set(skins.SKINS_V6.map(item => item.id)).size, 30));

const frozenHashes = Object.freeze({
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
});
await primeFrozenHashes();
for (const [file, expected] of Object.entries(frozenHashes)) {
  check(`congelado: ${file}`, () => assert.equal(cache.get(`hash:${file}`), expected));
}

const allReleaseText = (await Promise.all(releaseFiles.filter(file => /\.(?:js|mjs|html|json|xml|css)$/.test(file)).map(source))).join('\n');
check('segurança: sem chave Stripe live', () => assert.doesNotMatch(allReleaseText, /sk_live_[A-Za-z0-9]+/));
check('segurança: sem service role', () => assert.doesNotMatch(allReleaseText, /SUPABASE_SERVICE_ROLE_KEY|service_role/));
check('segurança: sem envio Resend', () => assert.doesNotMatch(allReleaseText, /api\.resend\.com|resend\.emails\.send/));

const failed = results.filter(result => !result.ok);
console.log(JSON.stringify({
  suite:'DIVINA-BRUXA-V192-UNIVERSO-EDITORIAL',
  status:failed.length ? 'FAIL' : 'PASS',
  total:results.length,
  passed:results.length - failed.length,
  failed
}, null, 2));
process.exitCode = failed.length ? 1 : 0;

// Hashes são carregados no fim para evitar I/O duplicado no corpo da suíte.
async function primeFrozenHashes() {
  for (const file of Object.keys(frozenHashes)) cache.set(`hash:${file}`, await sha256(file));
}
