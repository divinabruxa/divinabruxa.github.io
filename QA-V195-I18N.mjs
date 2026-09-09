import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(join(ROOT, name), 'utf8');
const sha256 = name => createHash('sha256').update(readFileSync(join(ROOT, name))).digest('hex');
const count = (source, expression) => (source.match(expression) || []).length;

const passes = [];
const failures = [];
const check = (name, condition, severity = 'P1') => {
  if (condition) passes.push({ name, severity });
  else failures.push({ name, severity });
};

const routes = JSON.parse(read('I18N-ROUTES-V195.json'));
const glossary = JSON.parse(read('I18N-GLOSSARY-V195.json'));
const market = JSON.parse(read('I18N-MARKET-POLICY-V195.json'));
const manifest = JSON.parse(read('MANIFESTO-V195-I18N.json'));
const base = routes.canonicalDomain;

const clusters = Object.freeze([
  { id:'home', pt:'index.html', en:'english.html', es:'espanol.html', urls:{ pt:`${base}/`, en:`${base}/english.html`, es:`${base}/espanol.html` } },
  { id:'free-tarot', pt:'tarot-livre.html', en:'free-tarot-reading.html', es:'tarot-libre.html', urls:{ pt:`${base}/tarot-livre.html`, en:`${base}/free-tarot-reading.html`, es:`${base}/tarot-libre.html` } },
  { id:'library', pt:'cartas-do-tarot.html', en:'tarot-card-meanings.html', es:'significados-cartas-tarot.html', urls:{ pt:`${base}/cartas-do-tarot.html`, en:`${base}/tarot-card-meanings.html`, es:`${base}/significados-cartas-tarot.html` } },
  { id:'school', pt:'escola-do-tarot.html', en:'tarot-school.html', es:'escuela-tarot.html', urls:{ pt:`${base}/escola-do-tarot.html`, en:`${base}/tarot-school.html`, es:`${base}/escuela-tarot.html` } },
  { id:'consultations', pt:'consultas-de-tarot.html', en:'tarot-consultations.html', es:'consultas-tarot.html', urls:{ pt:`${base}/consultas-de-tarot.html`, en:`${base}/tarot-consultations.html`, es:`${base}/consultas-tarot.html` } },
  { id:'ethics', pt:'etica-e-responsabilidade.html', en:'tarot-ethics.html', es:'etica-tarot.html', urls:{ pt:`${base}/etica-e-responsabilidade.html`, en:`${base}/tarot-ethics.html`, es:`${base}/etica-tarot.html` } },
  { id:'contact', pt:'contato.html', en:'contact.html', es:'contacto.html', urls:{ pt:`${base}/contato.html`, en:`${base}/contact.html`, es:`${base}/contacto.html` } }
]);

const localized = clusters.flatMap(cluster => [
  { cluster, language:'en', file:cluster.en, expectedLang:'en' },
  { cluster, language:'es', file:cluster.es, expectedLang:'es' }
]);

const requiredFiles = [
  'index.html','app.js','sw.js','sitemap.xml','sitemap-en.xml','sitemap-es.xml',
  'international-v195.css','international-home-v195.js','international-tarot-v195.js','international-library-v195.js','international-consultations-v195.js',
  'I18N-GLOSSARY-V195.json','I18N-MARKET-POLICY-V195.json','I18N-ROUTES-V195.json','BUILD-I18N-V195.mjs',
  'MANIFESTO-V195-I18N.json','00-LEIA-PRIMEIRO-V195-INGLES-ESPANHOL.txt','QA-V195-I18N.mjs',
  ...localized.map(item => item.file), ...clusters.map(item => item.pt)
];

for (const file of new Set(requiredFiles)) {
  check(`arquivo presente: ${file}`, existsSync(join(ROOT, file)), 'P0');
  check(`arquivo não vazio: ${file}`, existsSync(join(ROOT, file)) && statSync(join(ROOT, file)).size > 0, 'P0');
}

const hreflangEntries = html => [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(match => ({ language:match[1], url:match[2] }));
const canonicalOf = html => html.match(/<link rel="canonical" href="([^"]+)">/)?.[1] || '';

for (const item of localized) {
  const html = read(item.file);
  const alternates = hreflangEntries(html);
  const map = Object.fromEntries(alternates.map(entry => [entry.language, entry.url]));
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(`${item.file}: idioma HTML correto`, new RegExp(`<html lang="${item.expectedLang}">`).test(html), 'P0');
  check(`${item.file}: um único h1`, count(html, /<h1[ >]/g) === 1, 'P1');
  check(`${item.file}: título editorial`, /<title>[^<]{20,}<\/title>/.test(head), 'P1');
  check(`${item.file}: descrição editorial`, /<meta name="description" content="[^"]{80,}">/.test(head), 'P1');
  check(`${item.file}: canonical próprio`, canonicalOf(html) === item.cluster.urls[item.language], 'P0');
  check(`${item.file}: canonical absoluto`, canonicalOf(html).startsWith(`${base}/`), 'P0');
  check(`${item.file}: quatro alternates`, alternates.length === 4, 'P0');
  check(`${item.file}: hreflang pt-BR`, map['pt-BR'] === item.cluster.urls.pt, 'P0');
  check(`${item.file}: hreflang en`, map.en === item.cluster.urls.en, 'P0');
  check(`${item.file}: hreflang es`, map.es === item.cluster.urls.es, 'P0');
  check(`${item.file}: x-default pt-BR`, map['x-default'] === item.cluster.urls.pt, 'P0');
  check(`${item.file}: hreflang dentro do head`, alternates.every(entry => head.includes(`hreflang="${entry.language}" href="${entry.url}"`)), 'P1');
  check(`${item.file}: sem es-419`, !/es-419/i.test(html), 'P0');
  check(`${item.file}: seletor PT EN ES`, /class="intl-language"/.test(html) && />PT<\//.test(html) && />EN<\//.test(html) && />ES<\//.test(html), 'P1');
  check(`${item.file}: link de salto`, /class="intl-skip" href="#main"/.test(html), 'P1');
  check(`${item.file}: main identificado`, /<main id="main"/.test(html), 'P1');
  check(`${item.file}: JSON-LD único`, schemas.length === 1, 'P1');
  let schemaValid = false;
  try {
    const data = JSON.parse(schemas[0]?.[1] || '');
    const pageNode = data['@graph']?.find(node => node['@id'] === `${item.cluster.urls[item.language]}#webpage`);
    schemaValid = Boolean(pageNode && pageNode.inLanguage === item.language && pageNode.url === item.cluster.urls[item.language]);
  } catch {}
  check(`${item.file}: JSON-LD válido no idioma`, schemaValid, 'P1');
  check(`${item.file}: sem fonte remota`, !/fonts\.(googleapis|gstatic)\.com/i.test(html), 'P1');
  check(`${item.file}: sem rastreador novo`, !/(googletagmanager|google-analytics|facebook\.net|hotjar|segment\.com)/i.test(html), 'P0');

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || /^https?:/i.test(raw) || raw === './') continue;
    const local = raw.split(/[?#]/)[0].replace(/^\.\//, '');
    check(`${item.file}: destino local existe: ${local}`, existsSync(join(ROOT, local)), 'P0');
  }
}

for (const cluster of clusters) {
  const html = read(cluster.pt);
  const entries = hreflangEntries(html);
  const map = Object.fromEntries(entries.map(entry => [entry.language, entry.url]));
  check(`${cluster.pt}: alternates recíprocos completos`, entries.length === 4 && map['pt-BR'] === cluster.urls.pt && map.en === cluster.urls.en && map.es === cluster.urls.es && map['x-default'] === cluster.urls.pt, 'P0');
  check(`${cluster.pt}: seletor internacional disponível`, cluster.id === 'home' ? /V195 I18N MENU START[\s\S]*english\.html[\s\S]*espanol\.html/.test(html) : /V195 I18N SWITCH START[\s\S]*>EN<[\s\S]*>ES</.test(html), 'P1');
}

const englishHome = read('english.html');
const spanishHome = read('espanol.html');
const homeCss = read('international-v195.css');
for (const [file, html, title] of [['english.html',englishHome,'Orb of<br>Realities'],['espanol.html',spanishHome,'Orbe de las<br>Realidades']]) {
  const main = html.slice(html.indexOf('<main id="main"'), html.indexOf('</main>'));
  check(`${file}: título localizado preservado`, main.includes(`<h1>${title}</h1>`), 'P0');
  check(`${file}: uma Orbe principal`, count(main, /class="intl-orb-shell orb-shell orb-loading"/g) === 1, 'P0');
  check(`${file}: um canvas WebGL`, count(main, /id="orbCanvas"/g) === 1, 'P0');
  check(`${file}: sem seções informativas`, !/intl-(section|stats|grid|hero)/.test(main), 'P0');
  check(`${file}: sem CTA visível na Home`, !/intl-button/.test(main), 'P0');
  check(`${file}: motor vivo carregado`, /international-home-v195\.js\?v=195/.test(html), 'P0');
}
check('Home internacional trava a rolagem', /body\.intl-home\s*\{[^}]*height:\s*100dvh;[^}]*overflow:\s*hidden/s.test(homeCss), 'P0');
check('Home internacional respeita safe area', /intl-orb-home[\s\S]*safe-area-inset-top[\s\S]*safe-area-inset-bottom/.test(homeCss), 'P1');
check('Home internacional adapta paisagem baixa', /orientation:\s*landscape/.test(homeCss) && /max-height:\s*570px/.test(homeCss), 'P1');
check('Home internacional respeita movimento reduzido', /prefers-reduced-motion:\s*reduce/.test(homeCss), 'P1');

const index = read('index.html');
const ptHomeStart = index.indexOf('<section id="home"');
const ptTarotStart = index.indexOf('<section id="tarot"');
const ptHome = index.slice(ptHomeStart, ptTarotStart);
check('Home portuguesa V194 continua ativa', /id="home" class="[^"]*home-orb-only-v194/.test(index), 'P0');
check('Home portuguesa mantém título Orbe das Realidades', /<h1>Orbe das<br>Realidades/.test(ptHome), 'P0');
check('Home portuguesa mantém uma Orbe e um canvas', count(ptHome, /id="orb"/g) === 1 && count(ptHome, /id="orbCanvas"/g) === 1, 'P0');
check('CSS V194 continua carregado', /home-orb-absolute-v194\.css\?v=194/.test(index), 'P0');
check('app cache-busted para V195', /app\.js\?v=195/.test(index), 'P0');
check('service worker cache-busted no bootstrap V195', /sw\.js\?v=195/.test(index), 'P0');
check('chave de recarga V195', /divina\.sw\.reload\.v195/.test(index) && !/divina\.sw\.reload\.v194/.test(index), 'P1');

const tarotHtml = read('free-tarot-reading.html') + read('tarot-libre.html');
const tarotJs = read('international-tarot-v195.js');
check('Tarot internacional importa catálogo canônico', /import \{ CARDS, REQUIRED_ORIENTATION \} from '\.\/tarot-data\.js\?v=195'/.test(tarotJs), 'P0');
check('Tarot internacional não importa significados', !/tarot-meanings|meaning-engine/.test(tarotJs), 'P0');
check('Tarot internacional cria exatamente 78 posições', /position\s*=\s*1;\s*position\s*<=\s*78/.test(tarotJs), 'P0');
check('Mesa internacional declara 13 linhas e 6 colunas', count(tarotHtml, /aria-rowcount="13" aria-colcount="6"/g) === 2, 'P0');
check('CSS internacional fixa 6 colunas e 13 linhas', /grid-template-columns:\s*repeat\(6,/.test(homeCss) && /grid-template-rows:\s*repeat\(13,\s*auto\)/.test(homeCss), 'P0');
check('Tarot Livre declara sem significados em inglês', /No meaning, reversed card or repeated card/.test(tarotHtml), 'P1');
check('Tarot Livre declara sem significados em espanhol', /No se inserta ningún significado, carta invertida ni repetida/.test(tarotHtml), 'P1');

const tarotData = await import(`${pathToFileURL(join(ROOT, 'tarot-data.js')).href}?qa=195`);
const tarotRuntime = await import(`${pathToFileURL(join(ROOT, 'international-tarot-v195.js')).href}?qa=195`);
const cards = tarotData.CARDS;
check('catálogo canônico contém 78 cartas', Array.isArray(cards) && cards.length === 78, 'P0');
check('catálogo tem 78 IDs permanentes únicos', new Set(cards.map(card => card.canonicalId)).size === 78, 'P0');
check('catálogo tem 78 imagens oficiais únicas', new Set(cards.map(card => card.image)).size === 78, 'P0');
check('todas as cartas continuam normais', cards.every(card => card.orientation === 'normal'), 'P0');
check('todas as cartas têm nome inglês e espanhol', cards.every(card => card.names?.en && card.names?.es), 'P0');
let shuffleValid = true;
let shuffleChanged = false;
for (let run = 0; run < 20; run += 1) {
  const deck = tarotRuntime.shuffleCanonicalDeck();
  shuffleValid &&= deck.length === 78 && new Set(deck.map(card => card.canonicalId)).size === 78 && deck.every(card => card.orientation === 'normal');
  shuffleChanged ||= deck.some((card, index) => card.canonicalId !== cards[index].canonicalId);
}
check('20 embaralhamentos mantêm 78 cartas sem repetição', shuffleValid, 'P0');
check('embaralhamento altera a ordem canônica', shuffleChanged, 'P0');

const libraryJs = read('international-library-v195.js');
check('Biblioteca internacional usa as 78 cartas canônicas', /import \{ CARDS, REQUIRED_ORIENTATION \}/.test(libraryJs) && /CARDS\.filter/.test(libraryJs), 'P0');
check('Biblioteca não importa conteúdo-mãe português', !/tarot-meanings|meaning-engine/.test(libraryJs), 'P1');
check('Biblioteca oferece busca e filtro nos dois idiomas', localized.filter(item => item.cluster.id === 'library').every(item => /data-library-search/.test(read(item.file)) && /data-library-filter/.test(read(item.file))), 'P0');
check('Biblioteca cobre 22 notas de Maiores em inglês', count(libraryJs.match(/en:\s*Object\.freeze\(\[([\s\S]*?)\]\),\s*es:/)?.[1] || '', /^\s*'/gm) === 22, 'P1');
check('Biblioteca cobre 22 notas de Maiores em espanhol', count(libraryJs.match(/es:\s*Object\.freeze\(\[([\s\S]*?)\]\)\s*\}\);/)?.[1] || '', /^\s*'/gm) === 22, 'P1');

const enSchool = read('tarot-school.html');
const esSchool = read('escuela-tarot.html');
check('Escola inglesa publica 17 módulos', count(enSchool, /<small>MODULE \d{2}<\/small>/g) === 17, 'P0');
check('Escola espanhola publica 17 módulos', count(esSchool, /<small>MÓDULO \d{2}<\/small>/g) === 17, 'P0');
check('Escola internacional declara 124 aulas', /124 lessons/.test(enSchool) && /124 lecciones/.test(esSchool), 'P1');

const consultationFiles = ['tarot-consultations.html','consultas-tarot.html'];
for (const file of consultationFiles) {
  const html = read(file);
  for (const price of [250,150,100,50]) check(`${file}: preço R$ ${price} BRL`, html.includes(`R$ ${price} BRL`), 'P0');
  check(`${file}: e-mail obrigatório`, /<input name="email" type="email"[^>]*required>/.test(html), 'P0');
  check(`${file}: consentimento obrigatório`, /<input name="consent" type="checkbox" required>/.test(html), 'P0');
  check(`${file}: informa ausência de cobrança automática`, /(does not book a time, process a payment|no reserva horario, no procesa pagos)/.test(html), 'P0');
  check(`${file}: canal oficial correto`, html.includes('orbedasrealidades@hotmail.com'), 'P0');
}
const consultationJs = read('international-consultations-v195.js');
check('formulário internacional só prepara mailto', /mailto:orbedasrealidades@hotmail\.com/.test(consultationJs), 'P0');
check('formulário não usa rede', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(consultationJs), 'P0');
check('formulário não persiste dados', !/localStorage|sessionStorage|indexedDB|cookie/i.test(consultationJs), 'P0');
check('formulário não usa Resend', !/resend/i.test(consultationJs), 'P0');

check('glossário possui pelo menos 30 termos', glossary.terms.length >= 30, 'P1');
check('glossário protege Leitura de Mentes', glossary.terms.some(term => term.ptBR === 'Leitura de Mentes' && /Dynamics/.test(term.en) && /Dinámicas/.test(term.es)), 'P0');
check('glossário define espanhol neutro', /Neutral international Spanish/.test(glossary.editorialPrinciples.spanish), 'P1');
check('política de mercado mantém BRL', market.markets.en.currency === 'BRL' && market.markets.es.currency === 'BRL' && market.markets.en.automaticConversion === false && market.markets.es.automaticConversion === false, 'P0');
check('política exige e-mail e consentimento', market.consultations.emailRequired === true && /Explicit checkbox/.test(market.consultations.consent), 'P0');
check('política mantém cobrança real desligada', market.consultations.realBilling === false, 'P0');
check('política mantém suporte apenas por e-mail', market.consultations.officialChannels.length === 1 && market.consultations.officialChannels[0] === 'email' && market.consultations.whatsAppOffered === false, 'P0');
check('tabela internacional preserva preços oficiais', JSON.stringify(market.pricing.map(item => item.price)) === JSON.stringify([250,150,100,50]), 'P0');

for (const language of ['en','es']) {
  const xml = read(`sitemap-${language}.xml`);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expected = clusters.map(cluster => cluster.urls[language]);
  check(`sitemap-${language}: sete URLs`, urls.length === 7, 'P0');
  check(`sitemap-${language}: URLs exatas`, expected.every(url => urls.includes(url)) && urls.every(url => expected.includes(url)), 'P0');
  check(`sitemap-${language}: lastmod V195`, count(xml, /<lastmod>2026-09-09<\/lastmod>/g) === 7, 'P1');
}
const sitemapIndex = read('sitemap.xml');
check('índice inclui sitemap inglês uma vez', count(sitemapIndex, /sitemap-en\.xml/g) === 1, 'P0');
check('índice inclui sitemap espanhol uma vez', count(sitemapIndex, /sitemap-es\.xml/g) === 1, 'P0');

const app = read('app.js');
const sw = read('sw.js');
check('aplicativo identifica V195', /APLICATIVO V195/.test(app), 'P1');
check('aplicativo registra SW V195', /serviceWorker\.register\('\.\/sw\.js\?v=195'\)/.test(app), 'P0');
check('service worker identifica V195', /SERVICE WORKER V65[\s\S]*V195/.test(sw), 'P1');
check('cache novo e isolado da V195', /divina-bruxa-v65-international-v195/.test(sw), 'P0');
check('cache V194 deixa de ser o ativo', !/const CACHE='divina-bruxa-v64-home-orb-only-v194'/.test(sw), 'P0');
for (const file of ['international-v195.css','international-home-v195.js','international-tarot-v195.js','international-library-v195.js','international-consultations-v195.js',...localized.map(item => item.file)]) {
  check(`precache V195 inclui ${file}`, sw.includes(`'./${file}'`), 'P0');
}
check('service worker mantém estratégia offline', /self\.addEventListener\('install'/.test(sw) && /self\.addEventListener\('fetch'/.test(sw), 'P0');

check('rotas declaram 7 clusters', routes.clusters.length === 7 && routes.parityGate.localizedPages === 14, 'P0');
check('rotas proíbem redirecionamento automático', routes.seo.automaticLocaleRedirect === false, 'P0');
check('scripts internacionais não detectam idioma do navegador', !/navigator\.(language|languages)|accept-language/i.test([read('international-home-v195.js'),tarotJs,libraryJs,consultationJs].join('\n')), 'P0');
check('manifesto declara V195', manifest.version === 195, 'P0');
check('manifesto exige base V194', manifest.base_required === 'V194 instalada', 'P0');
check('manifesto declara delta plano', manifest.delivery.type === 'flat-delta' && manifest.delivery.directories_inside_zip === 0, 'P0');
check('manifesto não autoriza exclusões', manifest.delivery.delete_existing_files === false, 'P0');
check('manifesto mantém produção bloqueada', manifest.preserved_contracts.production_publish_authorized === false, 'P0');
check('manifesto mantém cobrança real bloqueada', manifest.preserved_contracts.real_billing_authorized === false, 'P0');

const frozen = {
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for (const [file, expected] of Object.entries(frozen)) check(`arquivo congelado intacto: ${file}`, existsSync(join(ROOT,file)) && sha256(file) === expected, 'P0');

const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project:'Divina Bruxa', version:195, suite:'Macroetapa 16 · inglês e espanhol',
  generated_at:new Date().toISOString(), total:passes.length + failures.length,
  passed:passes.length, failed:failures.length,
  gate:{ p0, p1, approved:p0 === 0 && p1 === 0 },
  coverage:{ clusters:7, localized_pages:14, languages:['pt-BR','en','es'], tarot_cards:78, royal_table:'13x6' },
  frozen_hashes:frozen, failures
};
writeFileSync(join(ROOT,'EVIDENCIA-QA-V195.json'), `${JSON.stringify(evidence,null,2)}\n`);

console.log(`DIVINA BRUXA V195 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
if (failures.length) {
  failures.forEach(failure => console.error(`[${failure.severity}] ${failure.name}`));
  process.exitCode = 1;
}
