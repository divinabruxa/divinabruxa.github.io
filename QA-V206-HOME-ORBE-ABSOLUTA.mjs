import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const tests = [];

const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const exists = name => fs.existsSync(path.join(root, name));
const sha256 = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const count = (value, pattern) => [...value.matchAll(pattern)].length;
const balanced = (value, open, close) => value.split(open).length === value.split(close).length;
const expect = (name, condition, detail = '') => tests.push({ name, pass: Boolean(condition), detail });

const releaseFiles = [
  'index.html',
  'sw.js',
  'home-orb-absolute-v206.css',
  '00-LEIA-PRIMEIRO-V206-HOME-ORBE-ABSOLUTA.txt',
  'HOME-ORBE-ABSOLUTA-CONTRACT-V206.json',
  'ORBE-VISUAL-GOLDEN-MASTER-V206.json',
  'MANIFESTO-V206-HOME-ORBE-ABSOLUTA.json',
  'QA-V206-HOME-ORBE-ABSOLUTA.mjs',
  'EVIDENCIA-QA-V206.json',
  'ARQUIVOS-V206-SHA256.txt'
];

releaseFiles.forEach(name => expect(`arquivo presente: ${name}`, exists(name)));

const index = read('index.html');
const css = read('home-orb-absolute-v206.css');
const sw = read('sw.js');
const manifest = JSON.parse(read('MANIFESTO-V206-HOME-ORBE-ABSOLUTA.json'));
const contract = JSON.parse(read('HOME-ORBE-ABSOLUTA-CONTRACT-V206.json'));
const golden = JSON.parse(read('ORBE-VISUAL-GOLDEN-MASTER-V206.json'));
const evidence = JSON.parse(read('EVIDENCIA-QA-V206.json'));

const homeStart = index.indexOf('<section id="home"');
const homeHeroEnd = index.indexOf('<section class="home-paths"', homeStart);
const homeHero = index.slice(homeStart, homeHeroEnd);

expect('Home encontrada', homeStart >= 0 && homeHeroEnd > homeStart);
expect('classe V206 ativa', /id="home"[^>]*\bhome-orb-only-v206\b/.test(homeHero));
expect('Home tem nome acessível', /aria-label="Início — Divina Bruxa"/.test(homeHero));
expect('uma Orbe principal', count(index, /id="orb"/g) === 1);
expect('canvas da Orbe preservado', count(index, /id="orbCanvas"/g) === 1);
expect('Menu Mágico da Orbe preservado', count(index, /id="orbMenu"/g) === 1);
expect('nome acessível da Orbe preservado', /id="orb"[^>]*aria-label="Orbe viva:[^"]+toque duplo abre o Tarot Livre"/.test(homeHero));
expect('status não visual preservado', /<span id="orbStatus" class="orb-status db-visually-hidden" aria-live="polite" aria-atomic="true">/.test(homeHero));
expect('sem home-copy no hero', !homeHero.includes('class="home-copy"'));
expect('sem título H1 no hero', !/<h1\b/i.test(homeHero));
expect('sem eyebrow visível no hero', !/O PORTAL ESTÁ ABERTO/i.test(homeHero));
expect('sem subtítulo visível no hero', !/O universo guardou um caminho para você/i.test(homeHero));
expect('sem chamada de despertar no hero', !/TOQUE PARA DESPERTAR/i.test(homeHero));
expect('sem dica visível no hero', !/class="touch-hint"/.test(homeHero));
expect('sem título visível sob a Orbe', !/>ORBE VIVA — MENU MÁGICO</i.test(homeHero));
expect('sem divisor decorativo no hero', !/class="portal-divider"/.test(homeHero));

expect('título SEO preservado', index.includes('<title>Divina Bruxa — Tarot Livre, Carta do Dia e 78 Cartas</title>'));
expect('descrição SEO preservada', /<meta name="description" content="[^"]+">/.test(index));
expect('schema preservado', index.includes('application/ld+json') && index.includes('"@type":"WebSite"'));
expect('header preservado', index.includes('<header class="app-header">'));
expect('marca preservada', index.includes('<b>DIVINA BRUXA</b><small>ORBE DAS REALIDADES</small>'));
expect('botão de menu preservado', index.includes('id="menuBtn" class="menu-button"'));
expect('dock preservado', index.includes('<nav class="magic-dock" aria-label="Navegação principal">'));
expect('mini-Orbe continua na IA', /data-go="ai" class="dock-orb"/.test(index));

expect('CSS V206 carregado', index.includes('home-orb-absolute-v206.css?v=206'));
expect('CSS V199 não carregado', !index.includes('home-orb-absolute-v199.css?v=199'));
expect('proteção crítica inline presente', index.includes('id="homeOrbAbsoluteV206Critical"'));
expect('proteção crítica vem antes do CSS externo', index.indexOf('homeOrbAbsoluteV206Critical') < index.indexOf('home-orb-absolute-v206.css?v=206'));
expect('proteção fail-closed no CSS', css.includes(':not(.orb-stage-ref):not(#orbStatus)'));
expect('apenas o palco é visível como bloco central', css.includes('> .orb-stage-ref') && css.includes('display: grid !important'));
expect('status usa recorte acessível', css.includes('clip-path: inset(50%)') && css.includes('white-space: nowrap !important'));
expect('Home sem rolagem', css.includes('overflow: hidden !important') && css.includes('overscroll-behavior: none'));
expect('enquadramento desktop congelado', css.includes('min(89vw, 47dvh, 470px)'));
expect('enquadramento mobile congelado', css.includes('min(88vw, 45dvh, 420px)'));
expect('enquadramento landscape congelado', css.includes('min(43vh, 330px)'));
expect('estados do Menu excluídos do tamanho fechado', css.includes(':not(.orb-menu-open):not(.orb-menu-transition):not(.orb-menu-closing)'));
expect('CSS não redesenha shell da Orbe', !/\.orb-shell|\.orb-halo|#orb::|#orbCanvas|\bcanvas\b/.test(css));
expect('CSS não cria animação', !/@keyframes|\banimation\s*:/.test(css));
expect('CSS sem imagem ou efeito novo', !/background(?:-image)?\s*:|\bfilter\s*:|box-shadow\s*:/.test(css));
expect('chaves CSS balanceadas', balanced(css, '{', '}'));

expect('registro SW aponta para V206', index.includes("register('./sw.js?v=206')"));
expect('trava de recarga SW aponta para V206', index.includes('divina.sw.reload.v206'));
expect('service worker versão 206', /const VERSION = 206;/.test(sw));
expect('cache shell V206', sw.includes("divina-bruxa-v206-shell"));
expect('cache content V206', sw.includes("divina-bruxa-v206-content"));
expect('cache images V206', sw.includes("divina-bruxa-v206-images"));
expect('cache Tarot V206', sw.includes("divina-bruxa-v206-tarot-offline"));
expect('CSS V206 é shell obrigatório', sw.includes("'./home-orb-absolute-v206.css'"));
expect('validação do shell exige CSS V206', /home-orb-absolute-v206\\\.css\\\?v=206/.test(sw));
expect('app V201 permanece autoridade do shell', sw.includes('/app-v201\\.js\\?v=201/'));
expect('chaves JS do SW balanceadas', balanced(sw, '{', '}'));

const frozen = {
  'orb-engine-v68.js': '3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'navigation.js': '827db63068e3e03d92a02e517c1e9f615e94d8d4ffb45e5851c4851b168f0db6',
  'mini-orb-engine.js': '26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'orb-skin-release-v1.js': '50b66b2ef864ce8a117b4663961afb6d46f76c058600b8316bc08887fa862785',
  'page-loader-v1.js': '160d2e34199753b8644ef9b7737f4fdd20f0975c982c11684dac813f0b0f4d98',
  'portal-transition-v10.js': '869d4d13be6fefaa00187b012822cbd7a3604ae038a0526493e62c274081f7d0',
  'divina-shell-v180.css': 'd45ede5cc056a9ebd754f328b1cbb0c0b1dd4cdf0874972e8fd35e4167c8eddf',
  'menu-completo-v177.css': 'b02312e6c87bf790483082abea206a802aa1babaea79ebb92ba22ef41a54c32f',
  'menu-magic-v7.css': '1cc98eff6ad43b6929e1ff542109272548270bee15700a4d79d9f55b965569e0',
  'menu-ring-v8.css': '1c82ea3200675adf222a1aaa7d899256ec42ec8bbf7469915ec406e9843ae58f',
  'divina-orb-fast-v1.webp': '66c6915571e9547d135d9456343706da77cc50ee5332d5d89f3adcceffb1b8de',
  'divina-orb-thumb-v1.webp': 'eb11d79613119756454ca90be3599849c10650e482968ed19c17ef11e301f873',
  'tarot-engine.js': '2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'commercial-truth-v200.js': '36e87728606864431297c3941a3be2a8fcfab9381d6a3f635789449cc3a1b9d4'
};

Object.entries(frozen).forEach(([name, hash]) => {
  expect(`hash congelado: ${name}`, exists(name) && sha256(name) === hash, exists(name) ? sha256(name) : 'ausente');
});

const cards = fs.readdirSync(root).filter(name => /^card-\d{2}\.webp$/.test(name));
expect('78 cartas físicas preservadas', cards.length === 78, String(cards.length));
expect('cartas numeradas 00–77', Array.from({ length: 78 }, (_, i) => `card-${String(i).padStart(2, '0')}.webp`).every(name => cards.includes(name)));

expect('contrato é V206', contract.release === 206 && contract.base === 205);
expect('contrato proíbe redesenho', contract.scope.visual_redesign === false && contract.scope.orb_engine_changed === false);
expect('manifesto declara somente dois substituídos', JSON.stringify(manifest.runtime_files.replaced) === JSON.stringify(['index.html', 'sw.js']));
expect('manifesto declara somente um runtime novo', JSON.stringify(manifest.runtime_files.new) === JSON.stringify(['home-orb-absolute-v206.css']));
expect('CNAME não integra entrega', !JSON.stringify(manifest).includes('"CNAME"') || manifest.protected_not_resent.includes('CNAME'));
expect('produção permanece desligada', manifest.production_activation === false && manifest.billing_activation === false);
expect('Golden Master é V206', golden.release === 206 && golden.deterministic_comparison_required_from === 207);
expect('evidência identifica suíte V206', evidence.release === 206 && evidence.status === 'PASS');

const checksumNames = releaseFiles.filter(name => name !== 'ARQUIVOS-V206-SHA256.txt');
const checksumLines = read('ARQUIVOS-V206-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const checksumMap = new Map(checksumLines.map(line => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  return match ? [match[2], match[1]] : ['', ''];
}));
expect('lista SHA contém nove arquivos', checksumMap.size === checksumNames.length && !checksumMap.has(''));
checksumNames.forEach(name => expect(`SHA confere: ${name}`, checksumMap.get(name) === sha256(name)));

const failed = tests.filter(test => !test.pass);
for (const test of tests) {
  console.log(`${test.pass ? 'PASS' : 'FAIL'} — ${test.name}${test.pass || !test.detail ? '' : ` (${test.detail})`}`);
}
console.log(`\nV206 QA: ${tests.length - failed.length}/${tests.length} PASS`);

if (failed.length) process.exitCode = 1;
