import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const exists = file => fs.existsSync(path.join(root,file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences = (source, pattern) => [...source.matchAll(pattern)].length;
const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : detail });

const app = read('app-v208.js');
const index = read('index.html');
const universe = read('living-universe-core-v524.js');
const worker = read('sw.js');
const bridge = read('cosmic-visual-atlas-v1.js');
const foundation = read('work12-foundation-v589.js');
const journey = read('orb-persistent-journey-v565.js');

for (const file of [
  'app-v208.js','index.html','living-universe-core-v524.js','sw.js',
  'cosmic-visual-atlas-v1.js','work12-foundation-v589.js',
  'tarot-livre-orbe-os-v517.js','daily-world-v509.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v590',/name="divina-fluidity-release" content="V590"/.test(index));
check('release:work12-v590',/name="divina-work12" content="V590"/.test(index));
check('release:macro-two',/data-macroetapa="work12-2-universo-vivo-global"/.test(index));
check('release:law-preserved',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=590-work12-universe/.test(index));
check('release:worker-query',/sw\.js\?v=590/.test(index));
check('release:bridge-query',/cosmic-visual-atlas-v1\.js\?v=590-work12-bridge/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v590-work12-app'/.test(app));
check('release:inline-bootstrap',/__divinaSWBootstrap='v590-work12-inline'/.test(index));
check('release:worker-version',/const VERSION = 590;/.test(worker));

check('wiring:foundation-preserved',app.includes("./work12-foundation-v589.js?v=589"));
check('wiring:universe-v590',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:one-universe-create',occurrences(app,/createLivingUniverseV524\(\)/g) === 1);
check('wiring:macro-two-status',/window\.divinaWork12Macro2V590/.test(app));
check('wiring:macro-two-dataset',/work12Macro = '2-app-shell-universe'/.test(app));
check('wiring:public-universe-same-engine',/universe:livingUniverse/.test(app));
check('wiring:foundation-still-authority',/window\.divinaWork12 = work12Foundation/.test(app));

const imports = [
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match => match[1].split('?')[0].replace(/^\.\//,''));
check('module-graph:imports-found',imports.length >= 60,String(imports.length));
for (const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('universe:release-v590',/const RELEASE = 590;/.test(universe));
check('universe:one-root-template',occurrences(universe,/this\.root = document\.createElement\('div'\)/g) === 1);
check('universe:one-canvas-template',occurrences(universe,/<canvas data-living-universe-canvas><\/canvas>/g) === 1);
check('universe:persistent-shell',/persistentAppShell:true/.test(universe) && /persistent-root/.test(universe));
check('universe:persistent-identity',/persistentRootIdentity/.test(universe) && /shellMounts:this\.shellMounts/.test(universe));
check('universe:one-clock-contract',/oneRenderClock:true/.test(universe) && /continuousAnimationLoops:1/.test(universe));
check('universe:no-interval',!/setInterval\s*\(/.test(universe));
check('universe:one-observer',occurrences(universe,/new MutationObserver\(/g) === 1);
check('universe:work12-state-listener',/divina:work12-state/.test(universe) && /setWork12State\(detail/.test(universe));
check('universe:soft-travel-reasons',/softTravelReasons = new Set\(\)/.test(universe));
check('universe:flight-does-not-hard-stop',/WORK12_SOFT_TRAVEL_REASONS_V590\.has\(key\)/.test(universe));
check('universe:hard-lifecycle-still-pauses',universe.includes("this.pause('document-hidden')") && universe.includes("this.pause('document-freeze')"));
check('universe:essential-cadence',/work12-travel-essential/.test(universe) && /mobile \? 24 : 30/.test(universe));
check('universe:heavy-webgl-branch',/uniform float u_travel_budget/.test(universe) && /if\(u_travel_budget>0\.5\)/.test(universe));
check('universe:heavy-canvas-branch',/drawCanvasTravel\(context, time\)/.test(universe));
check('universe:horizontal-travel',/journeyDirection\(from, to\)/.test(universe) && /journeyMotion\.targetX/.test(universe));
check('universe:vertical-immersion',/verticalImmersion:true/.test(universe) && /scrollTarget/.test(universe));
check('universe:depth-discovery',/depthDiscovery:true/.test(universe) && /profile\.depth/.test(universe));
check('universe:same-shader-same-canvas',/É o mesmo shader e o mesmo canvas/.test(universe));
check('universe:no-fire',/trueCelestialFire:false/.test(universe) && /lightningStrokes:false/.test(universe));

for (const route of ['home','tarot','daily','spreads','library','school','journal','ai','skins','consultations','store','music','videos','login','subscriptions','notifications','admin']) {
  check(`universe:profile:${route}`,new RegExp(`\\n  ${route}:\\{`).test(universe));
}

check('journey:existing-physics-preserved',journey.includes("this.universe?.pause?.('atom-one-flight')") && journey.includes("this.universe?.start?.('atom-one-flight')"));
check('foundation:constitution-preserved',/WORK12_CONSTITUTION_V589/.test(foundation));
check('foundation:one-navigation-authority',/core\.navigate = this\.orbNavigateProxy/.test(foundation));
check('foundation:maximum-two-intentions',/const MAX_INTENTIONS = 2;/.test(foundation));
check('foundation:whit-silence',/automaticWhitSpeech:false/.test(foundation));
check('orb:index-one',occurrences(index,/id="orb"/g) === 1);
check('orb:canvas-one',occurrences(index,/id="orbCanvas"/g) === 1);
check('routes:tarot-preserved',/<section id="tarot"/.test(index));
check('routes:daily-preserved',/<section id="daily"/.test(index));
check('bridge:all-work12-releases',/work12Version >= 589/.test(bridge));
check('bridge:old-fallback-preserved',/home-fail-open-v588/.test(bridge));

check('worker:atomic-name',/divina-bruxa-work12-v590-universe/.test(worker));
check('worker:six-core-assets',/const CORE = Object\.freeze\(\[[\s\S]*living-universe-core-v524/.test(worker));
check('worker:validates-foundation',/work12-foundation-contract-missing/.test(worker));
check('worker:validates-universe',/work12-universe-contract-missing/.test(worker));
check('worker:universe-active',/DIVINA_WORK12_UNIVERSE_ACTIVE/.test(worker));
check('worker:network-first-code',/if \(isCode\(url\)\)/.test(worker));
check('worker:cache-fallback',/const cached = await caches\.match\(fallbackKey\)/.test(worker));

const protectedHashes = Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'orb-engine-v208.js':'57ddc1fd47579c46cb1ec7ca742c81588199a30d442e062d48c82193ddd23b14',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'universe-coordinate-law-v583.js':'c28116ebdcad8274bfaeec1d816b1d150437778839b5f4e872e6dd81e4a6fb00',
  'orbital-menu-v502.js':'0a2e0f2818078ec43f73e5b0e0892ecee66d212269057ecd8ba983023730b769',
  'orbital-menu-v502.css':'cc1ed5ecf28f0e4e1f78b8b434c0715523a93a411b9ade8de09bde5fbc32b022',
  'whit-orb-soul-bridge-v581.js':'921444fc727bd877c1658e85f97025d6dca116553a66f85164ea1a1b52294ca8',
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'navigation.js':'fb33453fb9d10b10b3860fbb9f4586bd6c2f9c4e70e5482fc2e4063b44081694',
  'supreme-orb-core-v501.js':'3d6e7979d58ee81db8e150e731330c910e04f1d4c7e233232f73d287040c1e27',
  'orb-universal-presence-v526.js':'9df8d1131ed769392d921077e1931c9d780969d623e0ce30c7b1ca044c3a532b',
  'world-truth-registry-v535.js':'e8aaa5724fa87868a46e228bbb9b655dafbeeb0299bc4f5ac20fb9a847a7acf9',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'reality-intention-language-v585.css':'1d6be387ff29d6401488276e562d43af28286232bded442650475eb6036e86f3',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'magical-bubble-system-v586.css':'3c6a30c9ff78c1a3aaabcf26cfcde4dcbe163209c2c5ec774a15bf762d064bab',
  'work12-foundation-v589.js':'3a9bef9f0295bd4ba0bdc085877ed460dc07c804f8a0df1ef9b9271cd2590806'
});
for (const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file) && hash(file) === expected,exists(file) ? hash(file) : 'missing');
}

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V590',work:'WORK12',macroStage:'2-of-10 / Universo Vivo Global',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length-failures.length,failed:failures.length,total:checks.length,
  protectedFiles:Object.keys(protectedHashes).length,
  importFiles:new Set(imports).size,
  failures:failures.map(({id,detail}) => ({id,detail}))
},null,2));
if (failures.length) process.exitCode = 1;
