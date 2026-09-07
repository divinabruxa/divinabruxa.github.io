import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, pass: Boolean(condition), ...(detail ? { detail } : {}) });
const required = [
  'index.html', 'sw.js', 'divina-core-v179.css', 'BUILD-V179-CSS.mjs',
  'MANIFESTO-RUNTIME-V179.json', 'QA-V179-NUCLEO-RAPIDO.mjs',
  '00-LEIA-PRIMEIRO-V179-NUCLEO-RAPIDO.txt', 'ARQUIVOS-V179-SHA256.txt'
];

required.forEach(file => check(`arquivo:${file}`, exists(file)));
const index = read('index.html');
const sw = read('sw.js');
const css = read('divina-core-v179.css');
const manifest = JSON.parse(read('MANIFESTO-RUNTIME-V179.json'));
const styleLinks = [...index.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)/gi)].map(match => match[1]);

check('entrada:um-css', styleLinks.length === 1, styleLinks.join(','));
check('entrada:css-v179', styleLinks[0] === 'divina-core-v179.css?v=179');
check('entrada:menu-v177', index.includes('menu-completo-v177.js?v=177'));
check('entrada:biblioteca', index.includes('id="library"') && index.includes('id="cardLibraryApp"'));
check('entrada:tarot-livre', index.includes('id="tarot"') && index.includes('DIRETA · SEM SIGNIFICADO'));
check('entrada:mesa-13x6', index.includes('aria-rowcount="13"') && index.includes('aria-colcount="6"'));
for (const price of [250, 150, 100, 50]) check(`consulta:preco-${price}`, index.includes(`R$ ${price}`));

check('manifesto:release', manifest.release === 'V179');
check('manifesto:50-fontes', manifest.sources.length === 50 && new Set(manifest.sources).size === 50);
check('manifesto:50-para-1', manifest.entryStylesBefore === 50 && manifest.entryStylesAfter === 1);
check('manifesto:ordem-preservada', manifest.cascadeOrderPreserved === true);
check('manifesto:hash-css', manifest.output.sha256 === sha(css));
check('manifesto:tamanho-css', manifest.output.bytes === Buffer.byteLength(css));
check('css:cabecalho-v179', css.startsWith('/* DIVINA BRUXA — NÚCLEO VISUAL V179'));
manifest.sources.forEach(source => check(`css:marca:${source}`, css.includes(`/* ── ${source} ── */`)));

check('sw:cache-v179', sw.includes("divina-bruxa-v50-nucleo-v179"));
check('sw:nucleo-obrigatorio', sw.includes("'./divina-core-v179.css'"));
check('sw:sem-cache-v177', !sw.includes('divina-bruxa-v49-menu-completo-v177'));
check('sw:registro-v179', index.includes('sw.js?v=179') && index.includes('divina.sw.reload.v179'));
const hashLines = read('ARQUIVOS-V179-SHA256.txt').trim().split(/\r?\n/);
check('pacote:sete-hashes', hashLines.length === 7);
for (const line of hashLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-28)}`, match);
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root, match[2]))) === match[1]);
}
try { execFileSync(process.execPath, ['--check', path.join(root, 'sw.js')]); check('sintaxe:sw', true); } catch { check('sintaxe:sw', false); }
try { execFileSync(process.execPath, ['--check', path.join(root, 'BUILD-V179-CSS.mjs')]); check('sintaxe:build', true); } catch { check('sintaxe:build', false); }

const fullProject = manifest.sources.every(exists) && exists('tarot-data.js') && exists('consultation-policy.js');
if (fullProject) {
  const chunks = manifest.sources.map(source => `/* ── ${source} ── */\n${read(source).trim()}\n`);
  const expected = `/* DIVINA BRUXA — NÚCLEO VISUAL V179\n   Gerado por BUILD-V179-CSS.mjs.\n   Ordem original preservada: não editar este arquivo manualmente. */\n${chunks.join('\n')}`;
  check('css:conteudo-exato', css === expected);
  check('css:fontes-sem-import', manifest.sources.every(source => !/@(?:charset|import)\b/i.test(read(source))));
  const [{ CARDS, REQUIRED_ORIENTATION }, sessionModule, consultationModule] = await Promise.all([
    import(`./tarot-data.js?v=${Date.now()}`),
    import(`./tarot-session.js?v=${Date.now()}`),
    import(`./consultation-policy.js?v=${Date.now()}`)
  ]);
  check('tarot:78-cartas', CARDS.length === 78 && new Set(CARDS.map(card => card.id)).size === 78);
  check('tarot:somente-diretas', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal'));
  let seed = 179;
  const randomInt = max => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);
  let state = sessionModule.createTarotState({ randomInt, sessionId: 'qa-v179' });
  const drawn = [];
  while (!state.completed) { const result = sessionModule.drawNextCard(state); drawn.push(result.cardId); state = result.state; }
  check('tarot:sem-repeticao', drawn.length === 78 && new Set(drawn).size === 78);
  const policy = consultationModule.CONSULTATION_POLICY;
  check('consulta:quatro-servicos', policy.services.length === 4 && policy.independentProducts === true);
  check('consulta:precos-exatos', policy.services.map(service => service.price).join(',') === '250,150,100,50');
  check('consulta:email', policy.channels.length === 1 && policy.channels[0] === 'email' && /name="email"[^>]+required/.test(read('consultation-engine.js')));
  check('consulta:sem-cobranca-real', policy.realBilling === false);
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V179-NUCLEO-RAPIDO',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'package',
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
