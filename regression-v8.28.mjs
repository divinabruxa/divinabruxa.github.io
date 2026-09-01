import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const skin = read('skin-universal-v8.js');
const bridge = read('orb-skin-bridge-v8.js');
const loader = read('divina-v8-loader.js');
const snippet = read('INDEX-SNIPPET-V8.txt');
const tests = [];
const check = (name, pass) => tests.push({ name, pass: Boolean(pass) });

check('skin:30-imagens', (skin.match(/skin-[^']+-v1\.png/g) || []).length === 30);
check('skin:observa-conteudo-dinamico', skin.includes('this.contentObserver=new MutationObserver'));
check('skin:sincroniza-novos-nos', skin.includes('this.syncNodes()'));
check('skin:fallback-classico', skin.includes("url('classic')"));
check('skin:migracao-legada', skin.includes('LEGACY_KEYS'));
check('bridge:sincronizacao-inicial', bridge.includes('const connect=()=>{\n  sync();'));
check('bridge:orbes-contextuais', bridge.includes("['[data-orbe]','contextual']"));
check('bridge:sem-aviso-falso', !bridge.includes("['#chat + .security-note'"));
check('bridge:componentes-dinamicos', bridge.includes('requestAnimationFrame(sync)'));
check('loader:versao-8.28', loader.includes("const VERSION='8.28'"));
check('loader:css-paralelo', loader.includes('Promise.allSettled(STYLES.map(addStyle))'));
check('loader:boot-unico', loader.includes('window.__divinaV8Boot'));
check('snippet:versao-8.28', snippet.includes('divina-v8-loader.js?v=8.28'));

const failed = tests.filter((test) => !test.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-REGRESSION-V8.28',
  status: failed.length ? 'FAIL' : 'PASS',
  total: tests.length,
  passed: tests.length - failed.length,
  failed
}, null, 2));
process.exitCode = failed.length ? 1 : 0;
