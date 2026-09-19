import fs from 'node:fs';
import crypto from 'node:crypto';

const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(new URL(file, import.meta.url))).digest('hex');
const exists = file => fs.existsSync(new URL(file, import.meta.url));

const app = read('./app-v208.js');
const index = read('./index.html');
const worker = read('./sw.js');
const bridge = read('./cosmic-visual-atlas-v1.js');
const foundation = read('./work12-foundation-v589.js');
const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : detail });
const occurrences = (source, pattern) => [...source.matchAll(pattern)].length;

check('release:meta-v589', /name="divina-fluidity-release" content="V589"/.test(index));
check('release:work12-meta', /name="divina-work12" content="V589"/.test(index));
check('release:law-in-meta', /data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query-v589', /app-v208\.js\?v=589-work12-foundation/.test(index));
check('release:worker-query-v589', /sw\.js\?v=589/.test(index));
check('release:inline-bootstrap-v589', /__divinaSWBootstrap='v589-work12-inline'/.test(index));
check('release:app-bootstrap-v589', /__divinaSWBootstrap = 'v589-work12-app'/.test(app));
check('release:worker-version-v589', /const VERSION = 589;/.test(worker));

check('boot:hard-fail-open', /releaseHome\('boot-watchdog'\)/.test(index));
check('boot:manual-opens-home', /releaseHome\('manual'\)/.test(index));
check('boot:module-error-opens-home', /releaseHome\('boot-error'\)/.test(index));
check('boot:no-location-replace-loop', !/location\.replace\(/.test(index));
check('boot:no-portal-refresh-loop', !/portal-refresh/.test(index));
check('boot:work12-release-event', /divina:work12-boot-release/.test(index));
check('boot:legacy-bridge-delegated', /delegated-work12-v589/.test(bridge));
check('boot:legacy-fallback-preserved', /home-fail-open-v588/.test(bridge));

check('wiring:foundation-file', exists('./work12-foundation-v589.js'));
check('wiring:foundation-import-once', occurrences(app,/import \{ createWork12FoundationV589 \} from/g) === 1);
check('wiring:foundation-create-once', occurrences(app,/createWork12FoundationV589\(\{/g) === 1);
check('wiring:go-through-foundation', /work12Foundation\?\.navigate/.test(app));
check('wiring:intention-before-preparation', /const go = \(id, options\) => \{\s*if \(work12Foundation\?\.navigate\)[\s\S]*?pageLoader\?\.prime/.test(app));
check('wiring:delegate-existing-orb', /navigate:\(id, options\) => directSupremeNavigateV589\?\./.test(app));
check('wiring:orbe-exposes-work12', /work12:work12Foundation/.test(app));
check('wiring:public-work12', /window\.divinaWork12 = work12Foundation/.test(app));
check('wiring:macro-status', /window\.divinaWork12Macro1V589/.test(app));

check('law:constitution', /WORK12_CONSTITUTION_V589/.test(foundation));
check('law:one-presence', /one-orb-one-universe-one-physics-one-presence/.test(foundation));
check('law:maximum-two-intentions', /const MAX_INTENTIONS = 2;/.test(foundation));
check('law:states-rest', /'REST'/.test(foundation));
check('law:states-awaken', /'AWAKEN'/.test(foundation));
check('law:states-offer', /'OFFER'/.test(foundation));
check('law:states-accept', /'ACCEPT'/.test(foundation));
check('law:states-quiet', /'QUIET'/.test(foundation));
check('law:states-depart', /'DEPART'/.test(foundation));
check('law:states-travel', /'TRAVEL'/.test(foundation));
check('law:states-arrive', /'ARRIVE'/.test(foundation));
check('law:states-reveal', /'REVEAL'/.test(foundation));
check('law:intention-before-destination', foundation.indexOf('const offered = this.offer') < foundation.indexOf('this.navigateDelegate(route, options)'));
check('law:single-navigation-authority', /attachNavigationAuthority\(\)/.test(foundation) && /core\.navigate = this\.orbNavigateProxy/.test(foundation));
check('law:travel-silences-bubbles', /this\.bubbles\?\.hide\?\.\(\{ immediate:true, reason:'travel' \}\)/.test(foundation));
check('law:travel-silences-message', /messageGovernor\?\.release\?\.\(null,'work12-travel'\)/.test(foundation));
check('law:no-new-element', !/createElement\(/.test(foundation));
check('law:no-animation-frame', !/requestAnimationFrame|cancelAnimationFrame/.test(foundation));
check('law:no-animation-loop', !/setInterval\(/.test(foundation));
check('law:no-mutation-observer', !/MutationObserver/.test(foundation));
check('law:no-private-storage', !/localStorage|sessionStorage|indexedDB/.test(foundation));
check('law:no-network-api', !/\bfetch\s*\(/.test(foundation));

check('orb:index-one-canonical-id', occurrences(index,/id="orb"/g) === 1);
check('orb:index-one-canvas-id', occurrences(index,/id="orbCanvas"/g) === 1);
check('orb:foundation-audits-living', /livingOrbs:count\('\[data-supreme-orb="living"\]'\)/.test(foundation));
check('orb:foundation-audits-travelers', /noTravelerCopies/.test(foundation));
check('orb:foundation-audits-teleport', /noTeleport/.test(foundation));
check('universe:foundation-audits-one-layer', /universeLayers:count\('#divinaLivingUniverseV524'\)/.test(foundation));
check('bubbles:foundation-audits-limit', /bubblesWithinLaw/.test(foundation));

check('worker:atomic-cache-name', /divina-bruxa-work12-v589-foundation/.test(worker));
check('worker:atomic-index', worker.includes("'./index.html'"));
check('worker:atomic-app', worker.includes("'./app-v208.js?v=589-work12-foundation'"));
check('worker:atomic-foundation', worker.includes("'./work12-foundation-v589.js?v=589'"));
check('worker:validates-index', /work12-index-version-mismatch/.test(worker));
check('worker:validates-app', /work12-app-foundation-mismatch/.test(worker));
check('worker:validates-foundation', /work12-foundation-contract-missing/.test(worker));
check('worker:network-first-code', /if \(isCode\(url\)\)/.test(worker));
check('worker:cache-fallback', /const cached = await caches\.match\(fallbackKey\)/.test(worker));
check('worker:no-old-recovery-event', !/DIVINA_RECOVERY_ACTIVE/.test(worker));
check('worker:release-ready', /DIVINA_RELEASE_READY/.test(worker));
check('worker:work12-active', /DIVINA_WORK12_FOUNDATION_ACTIVE/.test(worker));
for (const asset of ['./index.html','./app-v208.js','./work12-foundation-v589.js','./divina-shell-v180.css','./cosmic-visual-atlas-v1.js']) {
  check(`worker:asset-exists:${asset}`, exists(asset), asset);
}

const protectedHashes = Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'3cdc1c5913bb7fc315bfe89f80a8864e64fd8720120d46f89aeaa2d082ce7878',
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
  'magical-bubble-system-v586.css':'3c6a30c9ff78c1a3aaabcf26cfcde4dcbe163209c2c5ec774a15bf762d064bab'
});
for (const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`, exists(`./${file}`) && hash(`./${file}`) === expected, hash(`./${file}`));
}

check('protected:tarot-route-still-present', /<section id="tarot"/.test(index));
check('protected:daily-route-still-present', /<section id="daily"/.test(index));
check('protected:tarot-session-import-preserved', /tarot-session\.js/.test(read('./tarot-livre-orbe-os-v517.js')));
check('protected:daily-policy-preserved', /daily-policy-v303/.test(read('./daily-world-v509.js')));
check('scope:no-billing-enable', !/productionBilling\s*:\s*true|realBilling\s*:\s*true/.test(foundation));
check('scope:no-new-visual-effects', /newVisualEffects:0/.test(app) && /newVisualEffects:0/.test(foundation));

const failures = checks.filter(item => !item.pass);
const result = {
  release:'V589',
  work:'WORK12',
  macroStage:'1-of-10 / Fundação e Verdade',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  protectedFiles:Object.keys(protectedHashes).length,
  failures:failures.map(({ id,detail }) => ({ id,detail }))
};
console.log(JSON.stringify(result,null,2));
if (failures.length) process.exitCode = 1;
