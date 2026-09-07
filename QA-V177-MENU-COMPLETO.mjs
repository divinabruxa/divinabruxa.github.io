import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'sw.js',
  'menu-completo-v177.css',
  'menu-completo-v177.js',
  '00-LEIA-PRIMEIRO-V177-MENU-COMPLETO.txt',
  'MENU-COMPLETO-V177.json'
];

const results = [];
const check = (name, condition) => results.push({ check: name, status: condition ? 'PASS' : 'FAIL' });
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

required.forEach(file => check(`required:${file}`, fs.existsSync(path.join(root, file))));

const index = read('index.html');
const sw = read('sw.js');
const css = read('menu-completo-v177.css');
const js = read('menu-completo-v177.js');
const contract = JSON.parse(read('MENU-COMPLETO-V177.json'));

check('index:css-versioned', index.includes('menu-completo-v177.css?v=177'));
check('index:js-versioned', index.includes('menu-completo-v177.js?v=177'));
check('index:menu-button', index.includes('id="menuBtn"'));
check('index:orb-menu', index.includes('id="orbMenu"'));
check('index:library-screen', index.includes('id="library"'));
check('index:library-app', index.includes('id="cardLibraryApp"'));
check('index:tarot-screen', index.includes('id="tarot"'));
check('index:consultations-screen', index.includes('id="consultations"'));
check('index:tarot-78', index.includes('78 cartas sem repetição'));
[250, 150, 100, 50].forEach(price => check(`index:price-${price}`, index.includes(`R$ ${price}`)));

check('sw:cache-v177', sw.includes('divina-bruxa-v49-menu-completo-v177'));
check('sw:css-warmed', sw.includes("'./menu-completo-v177.css'"));
check('sw:js-warmed', sw.includes("'./menu-completo-v177.js'"));

const order = ['videos', 'library', 'daily', 'store', 'journal', 'skins', 'subscriptions', 'notifications'];
order.forEach(destination => {
  check(`js:destination-${destination}`, js.includes(`'${destination}'`));
  check(`contract:shortcut-${destination}`, contract.essential_shortcuts.includes(destination));
});

check('js:library-label', js.includes("library: 'Biblioteca 78 Cartas'"));
check('js:library-aria', js.includes("button.setAttribute('aria-label', labels[destination])"));
check('js:menu-version', js.includes("row.dataset.menuVersion = '177'"));
check('js:ordered-append', js.includes('row.append(button)'));
check('js:retry-frame', js.includes('requestAnimationFrame'));
check('js:retry-timeout', js.includes('setTimeout(enhanceCompleteMenu, 120)'));

for (let child = 1; child <= 8; child += 1) {
  check(`css:position-child-${child}`, css.includes(`nth-child(${child})`));
}
check('css:library-highlight', css.includes('[data-go="library"]'));
check('css:focus-visible', css.includes(':focus-visible'));
check('css:mobile-700', css.includes('@media (max-width: 700px)'));
check('css:mobile-390', css.includes('@media (max-width: 390px)'));
check('css:reduced-motion', css.includes('@media (prefers-reduced-motion: reduce)'));
check('css:touch-transform', css.includes('translateX(-50%)'));

check('contract:release', contract.release === 'DIVINA-BRUXA-V177-MENU-COMPLETO');
check('contract:primary-eight', contract.primary_orbit.length === 8);
check('contract:shortcuts-eight', contract.essential_shortcuts.length === 8);
check('contract:library-highlighted', contract.library.highlighted === true);
check('contract:no-reversals', contract.preserved_invariants.free_tarot_reversals === false);
check('contract:no-repetition', contract.preserved_invariants.free_tarot_repetition === false);
check('contract:no-real-billing', contract.preserved_invariants.real_billing_enabled === false);

const failed = results.filter(result => result.status === 'FAIL');
const output = {
  suite: 'DIVINA-BRUXA-V177-MENU-COMPLETO',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fs.existsSync(path.join(root, 'tarot-data.js')) ? 'full-project' : 'package',
  root,
  total: results.length,
  passed: results.length - failed.length,
  failed
};

console.log(JSON.stringify(output, null, 2));
if (failed.length) process.exit(1);
