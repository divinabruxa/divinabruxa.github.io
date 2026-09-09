import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(join(ROOT, name), 'utf8');
const sha256 = name => createHash('sha256').update(readFileSync(join(ROOT, name))).digest('hex');

const passes = [];
const failures = [];
const check = (name, condition, severity = 'P1') => {
  if (condition) passes.push({ name, severity });
  else failures.push({ name, severity });
};

const requiredFiles = [
  'index.html',
  'app.js',
  'sw.js',
  'home-orb-absolute-v194.css',
  '00-LEIA-PRIMEIRO-V194-HOME-SOMENTE-ORBE.txt',
  'MANIFESTO-V194-HOME-SOMENTE-ORBE.json',
  'QA-V194-HOME-SOMENTE-ORBE.mjs'
];

for (const file of requiredFiles) {
  check(`arquivo presente: ${file}`, existsSync(join(ROOT, file)), 'P0');
  check(`arquivo não vazio: ${file}`, existsSync(join(ROOT, file)) && statSync(join(ROOT, file)).size > 0, 'P0');
}

const index = read('index.html');
const css = read('home-orb-absolute-v194.css');
const app = read('app.js');
const sw = read('sw.js');
const manifest = JSON.parse(read('MANIFESTO-V194-HOME-SOMENTE-ORBE.json'));
const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"');
const homeMarkup = homeStart >= 0 && tarotStart > homeStart ? index.slice(homeStart, tarotStart) : '';

check('Home V194 existe antes do Tarot Livre', homeStart >= 0 && tarotStart > homeStart, 'P0');
check('classe exclusiva da Home V194 aplicada', /id="home" class="[^"]*home-orb-only-v194[^"]*"/.test(index), 'P0');
check('título Orbe das Realidades preservado', /<h1>Orbe das<br>Realidades/.test(homeMarkup), 'P0');
check('uma Orbe principal na Home', (homeMarkup.match(/id="orb"/g) || []).length === 1, 'P0');
check('um canvas WebGL na Home', (homeMarkup.match(/id="orbCanvas"/g) || []).length === 1, 'P0');
check('menu orbital preservado dentro do palco', /class="orb-stage-ref"[\s\S]*id="orbMenu"/.test(homeMarkup), 'P0');
check('gesto duplo continua anunciado na Orbe', /toque duplo abre o Tarot Livre/i.test(homeMarkup), 'P1');
check('cabeçalho preservado', /<header class="app-header">/.test(index), 'P1');
check('dock inferior preservado', /<nav class="magic-dock"/.test(index), 'P1');
check('CSS V194 carregado', /home-orb-absolute-v194\.css\?v=194/.test(index), 'P0');
check('CSS V194 carregado depois do universo editorial', index.indexOf('home-orb-absolute-v194.css?v=194') > index.indexOf('editorial-universe-v192.css?v=192'), 'P1');
check('aplicativo cache-busted para V194', /app\.js\?v=194/.test(index), 'P0');
check('service worker cache-busted para V194 no bootstrap', /sw\.js\?v=194/.test(index), 'P0');
check('chave de recarga V194 no bootstrap', /divina\.sw\.reload\.v194/.test(index), 'P1');
check('bootstrap não mantém chave de recarga V193', !/divina\.sw\.reload\.v193/.test(index), 'P1');

check('Home usa viewport dinâmica', /height:\s*100dvh/.test(css), 'P1');
check('Home respeita safe area superior', /safe-area-inset-top/.test(css), 'P1');
check('Home respeita safe area inferior', /safe-area-inset-bottom/.test(css), 'P1');
check('Home bloqueia rolagem própria', /#home\.home-orb-only-v194\.active[\s\S]*overflow:\s*hidden\s*!important/.test(css), 'P1');
check('rolagem do body é bloqueada somente na Home', /body\[data-screen="home"\][\s\S]*overflow:\s*hidden\s*!important/.test(css), 'P1');
check('conteúdo fora de título e palco é ocultado', />\s*:not\(\.home-copy\):not\(\.orb-stage-ref\)[\s\S]*display:\s*none\s*!important/.test(css), 'P0');
check('conteúdo oculto sai da árvore visual', />\s*:not\(\.home-copy\):not\(\.orb-stage-ref\)[\s\S]*visibility:\s*hidden\s*!important/.test(css), 'P1');
check('eyebrow e subtítulo são ocultados', /\.home-copy \.eyebrow,[\s\S]*\.home-copy \.intro[\s\S]*display:\s*none\s*!important/.test(css), 'P0');
check('painel decorativo atrás do título foi removido', /\.home-copy::before[\s\S]*content:\s*none\s*!important/.test(css), 'P1');
check('título recebe composição própria sem fundo', /\.home-copy h1[\s\S]*text-align:\s*center\s*!important/.test(css), 'P1');
check('título e Orbe ficam centralizados', /justify-content:\s*center/.test(css) && /place-items:\s*center/.test(css) && /margin:\s*0 auto\s*!important/.test(css), 'P0');
check('Orbe tem limite de largura móvel', /--v75-orb-size:\s*min\(89vw,\s*47dvh,\s*470px\)/.test(css), 'P1');
check('menu aberto não recebe o limite da Home fechada', /active:not\(\.orb-menu-open\)\s*>\s*\.orb-stage-ref/.test(css), 'P1');
check('ajuste para iPhone estreito', /max-width:\s*430px/.test(css), 'P1');
check('ajuste para paisagem baixa', /orientation:\s*landscape/.test(css) && /max-height:\s*560px/.test(css), 'P1');
check('movimento reduzido respeitado', /prefers-reduced-motion:\s*reduce/.test(css), 'P1');
check('CSS da Home não oculta cabeçalho', !/\.app-header\s*\{[^}]*display:\s*none/s.test(css), 'P0');
check('CSS da Home não oculta dock', !/\.magic-dock\s*\{[^}]*display:\s*none/s.test(css), 'P0');
check('CSS da Home não alcança telas internas', !/#app\s*>\s*\.screen(?![^\n]*#home)/.test(css), 'P0');

check('comentário do aplicativo identifica V194', /APLICATIVO V194/.test(app), 'P1');
check('loader do aplicativo usa V194', /page-loader-v1\.js\?v=194/.test(app), 'P1');
check('fallback do service worker usa V194', /serviceWorker\.register\('\.\/sw\.js\?v=194'\)/.test(app), 'P0');
check('política SEO V193 permanece ativa', /installIndexPolicyV193/.test(app), 'P1');

check('service worker identifica V194', /SERVICE WORKER V64[\s\S]*V194/.test(sw), 'P1');
check('cache novo e isolado da V194', /divina-bruxa-v64-home-orb-only-v194/.test(sw), 'P0');
check('cache antigo V193 removido do nome ativo', !/const CACHE='divina-bruxa-v63-seo-authority-v193'/.test(sw), 'P1');
check('CSS V194 está no precache obrigatório', (sw.match(/'\.\/home-orb-absolute-v194\.css'/g) || []).length === 2, 'P0');
check('service worker mantém estratégia offline', /self\.addEventListener\('install'/.test(sw) && /self\.addEventListener\('fetch'/.test(sw), 'P0');

check('manifesto declara versão 194', manifest.version === 194, 'P0');
check('manifesto declara delta plano', manifest.delivery?.type === 'flat-delta' && manifest.delivery?.directories_inside_zip === 0, 'P0');
check('manifesto não autoriza exclusões', manifest.delivery?.delete_existing_files === false, 'P0');
check('manifesto preserva páginas internas', manifest.home_contract?.internal_pages_changed === false, 'P1');
check('manifesto preserva título da Orbe', manifest.home_contract?.orb_title_visible === true, 'P1');
check('manifesto mantém produção bloqueada', manifest.preserved_contracts?.production_publish_authorized === false, 'P0');
check('manifesto mantém cobrança real bloqueada', manifest.preserved_contracts?.real_billing_authorized === false, 'P0');

const frozen = {
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js': 'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js': '18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};

for (const [file, expected] of Object.entries(frozen)) {
  check(`arquivo congelado intacto: ${file}`, existsSync(join(ROOT, file)) && sha256(file) === expected, 'P0');
}

const tarotModule = await import(`${pathToFileURL(join(ROOT, 'tarot-data.js')).href}?qa=194`);
const cards = tarotModule.CARDS;
check('catálogo canônico contém 78 cartas', Array.isArray(cards) && cards.length === 78, 'P0');
check('78 IDs numéricos únicos', new Set(cards.map(card => card.id)).size === 78, 'P0');
check('78 IDs permanentes únicos', new Set(cards.map(card => card.canonicalId)).size === 78, 'P0');
check('78 imagens oficiais mapeadas', new Set(cards.map(card => card.image)).size === 78, 'P0');
check('todas as cartas permanecem normais', cards.every(card => card.orientation === 'normal'), 'P0');
check('orientação obrigatória permanece normal', tarotModule.REQUIRED_ORIENTATION === 'normal', 'P0');

const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project: 'Divina Bruxa',
  version: 194,
  suite: 'Home somente com a Orbe',
  generated_at: new Date().toISOString(),
  total: passes.length + failures.length,
  passed: passes.length,
  failed: failures.length,
  gate: { p0, p1, approved: p0 === 0 && p1 === 0 },
  frozen_hashes: frozen,
  failures
};

writeFileSync(join(ROOT, 'EVIDENCIA-QA-V194.json'), `${JSON.stringify(evidence, null, 2)}\n`);

console.log(`DIVINA BRUXA V194 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
if (failures.length) {
  for (const failure of failures) console.error(`[${failure.severity}] ${failure.name}`);
  process.exitCode = 1;
}
