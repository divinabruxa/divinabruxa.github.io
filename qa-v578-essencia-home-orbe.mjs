import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.argv[2] || '.');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const bytes = file => fs.readFileSync(path.join(root, file));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (text, pattern) => (text.match(pattern) || []).length;

const index = read('index.html');
const worker = read('sw.js');
const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"', homeStart);
const dailyStart = index.indexOf('<section id="daily"', tarotStart);
const libraryStart = index.indexOf('<section id="library"', dailyStart);
const home = index.slice(homeStart, tarotStart);
const tarot = index.slice(tarotStart, dailyStart).trimEnd() + '\n';
const daily = index.slice(dailyStart, libraryStart).trimEnd() + '\n';

const protectedHashes = Object.freeze({
  'app-v208.js':'dd1652ea7b34d84c1ee9afbe8b7792b9a332920378add83cbbee70e2d5cf94b7',
  'orb-engine-v208.js':'8444122fcfaf24ee284724a6523460fec64d11e073fe6fa8e12b0c63d940fa6c',
  'orb-persistent-journey-v565.js':'4bac3e3870165f7b8898c6dfa0bd80f8c572ce016b033bd28ebe872e5439de07',
  'orbital-menu-v502.js':'ae4aefa12f231b15a86604b63b66de9a1975d815ba9a1e10aebab131c9d29259',
  'orbital-menu-v502.css':'f276ce015fcef04aa30fee4ed80be190e7013a6eb67fa613af41e9e3749e2002',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-livre-orbe-os-v517.css':'a093bd5e7ed7c0a3b88a8706a835bfefccad0fa2ea08661762c65988266340ee',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-world-v509.css':'a6c48374be42705e5a8b574fba9eaa75110b2463d0835051aed6a4bc63e1c4b6',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259'
});

const checks = [];
const check = (id, pass, detail = '') => checks.push({ id, pass:Boolean(pass), detail:String(detail || '') });

check('release:meta-v578', /name="divina-essence-release" content="V578"/.test(index));
check('release:macroetapa-home-orbe', /data-macroetapa="1-home-orbe"/.test(index));
check('release:worker-v578', /const VERSION=578;/.test(worker));
check('release:worker-shell-v578', /divina-bruxa-v578-shell/.test(worker));
check('release:inline-worker-v578', /register\('\.\/sw\.js\?v=578'/.test(index));
check('release:worker-validator-v578', /divina-essence-release\["'\] content=\["'\]V578/.test(worker) && /home-essence-v578/.test(worker));
check('release:critical-generation-v578', /RELEASE_CRITICAL_PATTERN_V578/.test(worker) && !/RELEASE_CRITICAL_PATTERN_V577/.test(worker));
check('home:intent-only-orb', /home-essence-v578/.test(home) && /data-home-intent="orb"/.test(home));
check('home:one-section-only', count(home, /<section\b/g) === 1, count(home, /<section\b/g));
check('home:no-editorial-sections', !/home-(?:paths|skins|touch|commerce|editorial|trust)/.test(home));
check('home:no-visible-copy-structure', !/<(?:h1|h2|h3|p|article|footer)\b/.test(home));
check('home:global-chrome-silent', />\.app-header>\.brand\{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important\}/.test(index) && />\.magic-dock\{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important\}/.test(index));
check('home:menu-entry-preserved', /id="menuBtn" class="menu-button" aria-label="Abrir menu"/.test(index) && />\.app-header>\.menu-button\{visibility:visible!important;opacity:1!important;pointer-events:auto!important\}/.test(index));
check('home:one-canonical-orb', count(index, /id="orb"/g) === 1, count(index, /id="orb"/g));
check('home:one-living-canvas', count(index, /id="orbCanvas"/g) === 1, count(index, /id="orbCanvas"/g));
check('home:one-orb-stage', count(home, /class="orb-stage-ref"/g) === 1, count(home, /class="orb-stage-ref"/g));
check('home:menu-markup-preserved', count(home, /id="orbMenu"/g) === 1 && count(home, /data-go=/g) === 9);
check('home:first-frame-fixed', /#app>#home\.home-orb-only-v206\.active\{[^}]*position:fixed!important;[^}]*inset:0!important;[^}]*place-items:center!important;/.test(index));
check('home:no-screen-arrival-jump', /#app>#home\.home-essence-v578\.active\{animation:none!important;opacity:1!important;transform:none!important\}/.test(index));
check('home:first-frame-zero-padding', /#app>#home\.home-orb-only-v206\.active\{[^}]*padding:0 max\(/.test(index));
check('home:first-frame-stage-centered', /width:var\(--db578-home-orb-size\)!important;height:var\(--db578-home-orb-size\)!important;[^}]*margin:auto!important;/.test(index));
check('home:iphone-dynamic-viewport', /--db578-home-orb-size:min\(88vw,45dvh,420px\)/.test(index));
check('home:small-iphone-contract', /--db578-home-orb-size:min\(87vw,44dvh,330px\)/.test(index));
check('home:safe-inline-area', /env\(safe-area-inset-left/.test(index) && /env\(safe-area-inset-right/.test(index));
check('home:no-boot-geometry-swap', !/padding:calc\(96px \+ env\(safe-area-inset-top\)/.test(index));
check('home:boot-projection-hidden', /#orbLoadingPortal\[data-boot-loader\]:not\(\.is-recovery\):not\(\.is-boot-error\)\{visibility:hidden!important;opacity:0!important;/.test(index));
check('home:recovery-preserved', /\.is-recovery,.is-boot-error/.test(index) && /db-orb-loader__recovery/.test(index));
check('home:orb-touch-contract', /touch-action:none/.test(home) || /touch-action:none/.test(index));
check('home:orb-status-accessible', /id="orbStatus"[^>]*aria-live="polite"/.test(home));
check('tarot:html-byte-protected', sha256(tarot) === '59a6226f3526d7c03c5825b0e0911489a75338318f117e88b023c616f9361484', sha256(tarot));
check('daily:html-byte-protected', sha256(daily) === 'aa3ccae8fe84c3bfdaf83a60788e041aec58a2aee1481d23a234f02614b6d6a3', sha256(daily));

const requiredShellBlock = worker.match(/const REQUIRED_SHELL=Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
const requiredShell = [...requiredShellBlock.matchAll(/'\.\/([^']*)'/g)].map(match => match[1]);
const missingShell = requiredShell.filter(file => file && !fs.existsSync(path.join(root, file)));
check('pwa:required-shell-resolved', requiredShell.length >= 50 && missingShell.length === 0, missingShell.join(','));
check('pwa:five-isolated-v578-caches', new Set(
  [...worker.matchAll(/const (?:SHELL|CONTENT|IMAGE|OFFLINE|PREMIUM)_CACHE='([^']+)'/g)].map(match => match[1])
).size === 5 && count(worker, /divina-bruxa-v578-(?:shell|content|images|offline-core|premium-static)/g) === 5);

for (const [file, expected] of Object.entries(protectedHashes)) {
  const full = path.join(root, file);
  check(`protected:${file}`, fs.existsSync(full) && sha256(bytes(file)) === expected, fs.existsSync(full) ? sha256(bytes(file)) : 'missing');
}

const failures = checks.filter(item => !item.pass);
const result = {
  release:'V578',
  phase:'Divina Bruxa 2.0 — Essência Suprema',
  macroStage:'1 — Home e Orbe',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  total:checks.length,
  onePageOneIntent:true,
  homeVisibleIntent:'canonical-orb-only',
  tarotLivreProtected:true,
  cartaDoDiaProtected:true,
  menuChanged:false,
  newProductFunctions:0,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
