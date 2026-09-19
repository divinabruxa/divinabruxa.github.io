import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences=(source,pattern)=>[...source.matchAll(pattern)].length;
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':detail});

const app=read('app-v208.js');
const index=read('index.html');
const worker=read('sw.js');
const navigation=read('navigation.js');
const foundation=read('work12-foundation-v589.js');
const pageLoader=read('page-loader-v1.js');
const core=read('supreme-orb-core-v501.js');
const renderer=read('orb-engine-v208.js');
const soul=read('whit-orb-soul-bridge-v581.js');
const journey=read('orb-persistent-journey-v565.js');
const universe=read('living-universe-core-v524.js');

for(const file of [
  'app-v208.js','index.html','sw.js','navigation.js','work12-foundation-v589.js','page-loader-v1.js',
  'supreme-orb-core-v501.js','orb-engine-v208.js','whit-orb-soul-bridge-v581.js',
  'orb-motion-core-v207.js','orb-gesture-core-v208.js','orb-persistent-journey-v565.js',
  'living-universe-core-v524.js','route-registry-v180.js','tarot-livre-orbe-os-v517.js',
  'tarot-session.js','tarot-data.js','daily-world-v509.js','daily-policy-v303.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v592',/name="divina-fluidity-release" content="V592"/.test(index));
check('release:work12-v592',/name="divina-work12" content="V592"/.test(index));
check('release:macro-four',/data-macroetapa="work12-4-navigation-coordinated"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=592-work12-navigation/.test(index));
check('release:worker-query',/sw\.js\?v=592/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v592-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v592'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v592-work12-app'/.test(app));
check('release:worker-version',/const VERSION = 592;/.test(worker));
check('release:macro-public',/window\.divinaWork12Macro4V592/.test(app));
check('release:macro-dataset',/work12Macro = '4-navigation-coordinated'/.test(app));

check('wiring:navigation-v592',app.includes("./navigation.js?v=592-work12-navigation"));
check('wiring:foundation-v592',app.includes("./work12-foundation-v589.js?v=592-work12-navigation"));
check('wiring:page-loader-v592',app.includes("./page-loader-v1.js?v=592-work12-navigation"));
check('wiring:universe-v590',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:core-v591',app.includes("./supreme-orb-core-v501.js?v=591-work12-orb"));
check('wiring:renderer-v591',app.includes("./orb-engine-v208.js?v=591-work12-orb"));
check('wiring:soul-v592-compatibility',app.includes("./whit-orb-soul-bridge-v581.js?v=592-work12-navigation"));
check('wiring:one-navigation',occurrences(app,/createNavigation\(/g)===1);
check('wiring:one-foundation',occurrences(app,/createWork12FoundationV589\(/g)===1);
check('wiring:one-renderer',occurrences(app,/new RealityOrbEngine\(/g)===1);
check('wiring:one-core',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-soul',occurrences(app,/createWhitOrbSoulBridgeV581\(/g)===1);
check('wiring:public-go-enters-machine',/if \(work12Foundation\?\.navigate\) return work12Foundation\.navigate/.test(app));
check('wiring:router-enters-public-go',/navigation\.setRouteRequest\(go\)/.test(app));
check('wiring:machine-delegates-original-core',/const directSupremeNavigateV589 = supremeOrb\?\.navigate\?\.bind\(supremeOrb\)/.test(app));
for(const marker of ['divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591','divinaWork12Macro4V592']) {
  check(`wiring:preserves-${marker}`,app.includes(marker));
}
check('wiring:public-coordinator',/navigation:work12Foundation/.test(app));

const imports=[
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
check('module-graph:count',new Set(imports).size>=64,String(new Set(imports).size));
for(const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('router:release',/const WORK12_HISTORY_RELEASE = 592;/.test(navigation));
check('router:single-popstate-listener',occurrences(navigation,/addEventListener\('popstate'/g)===1);
check('router:single-hashchange-listener',occurrences(navigation,/addEventListener\('hashchange'/g)===1);
check('router:history-through-authority',/const request = routeRequest \|\| go;[\s\S]*source:'history'[\s\S]*historyMode:'traverse'/.test(navigation));
check('router:deep-link-through-authority',/source:id === 'home' \? 'boot' : 'deep-link'/.test(navigation));
check('router:menu-return-through-authority',/request\('home', \{ source:'menu-return-home' \}\)/.test(navigation));
check('router:history-payload',/work12:\{[\s\S]*release:WORK12_HISTORY_RELEASE[\s\S]*entry,[\s\S]*action/.test(navigation));
check('router:push-state',/history\.pushState\(payload/.test(navigation));
check('router:replace-state',/history\.replaceState\(payload/.test(navigation));
check('router:duplicate-location-events-coalesced',/routeSyncQueued/.test(navigation)&&/queuedLocationEvent/.test(navigation));
check('router:canonicalizes-invalid-deep-link',/action:'canonicalized'/.test(navigation));
check('router:arrival-detail',/historyMode,[\s\S]*release:WORK12_HISTORY_RELEASE/.test(navigation));
check('router:no-interval',!/setInterval\s*\(/.test(navigation));

check('machine:release',/const VERSION = 592;/.test(foundation));
check('machine:foundation-compatibility',/const FOUNDATION_VERSION = 589;/.test(foundation));
check('machine:constitution',/WORK12_CONSTITUTION_V592/.test(foundation)&&/macroStage:'4-of-10'/.test(foundation));
for(const state of ['REST','AWAKEN','OFFER','ACCEPT','QUIET','DEPART','TRAVEL','ARRIVE','REVEAL']) {
  check(`machine:state-${state.toLowerCase()}`,new RegExp(`'${state}'`).test(foundation));
}
check('machine:one-authority',/work12NavigationAuthority = 'v592'/.test(foundation));
check('machine:latest-intention',/queueNavigation\(route, options/.test(foundation)&&/drainQueuedNavigation\(\)/.test(foundation));
check('machine:single-flight',/if \(this\.navigation\?\.promise\)/.test(foundation));
check('machine:route-ready-before-arrival',/reality-ready-before-arrival/.test(foundation));
check('machine:arrival-coalesced',/arrival-coalesced/.test(foundation));
check('machine:arrival-event',/divina:work12-arrival/.test(foundation));
check('machine:arrival-rest',/reality-breathes/.test(foundation)&&/work12NavigationPhase = 'rest'/.test(foundation));
check('machine:initial-home-silence',/initial-coordinate-present/.test(foundation));
check('machine:history-status',/historyTraversals:this\.historyTraversals/.test(foundation)&&/deepLinks:this\.deepLinks/.test(foundation));
check('machine:no-raf',!/requestAnimationFrame\s*\(/.test(foundation));
check('machine:no-interval',!/setInterval\s*\(/.test(foundation));
check('machine:no-observer',!/new MutationObserver\s*\(/.test(foundation));
check('machine:no-storage',!/localStorage|sessionStorage/.test(foundation));
check('page-loader:retry-through-authority',/globalThis\.divinaWork12V592/.test(pageLoader)&&/source:'route-retry'/.test(pageLoader));

check('entity:one-id',occurrences(index,/id="orb"/g)===1);
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1);
check('entity:v591',/const WORK12_RELEASE = 591;/.test(core));
check('entity:stable-id',/const ENTITY_ID = 'divina-orb-canonical'/.test(core));
check('entity:one-living-proof',/oneLivingOrb:persistence\.canonicalOrbs === 1/.test(core));
check('renderer:v591',/const ORB_RENDERER_RELEASE = 591;/.test(renderer));
check('renderer:shared-clock',/sharedMotionClock:true/.test(renderer));
check('soul:v591',/const VERSION = 591;/.test(soul));
check('soul:work12-state',soul.includes("'divina:work12-state'"));
check('soul:v592-authority-compatible',/589\|590\|591\|592/.test(soul));
check('journey:physical',/physicalOrbTransport:true/.test(journey));
check('journey:no-copies',/travelerCopies:0/.test(journey));
check('journey:no-teleport',/teleportFallback:false/.test(journey)&&/portalVisual:false/.test(journey));
check('journey:no-flicker',/flicker:false/.test(journey));
check('journey:pauses-heavy',journey.includes("this.universe?.pause?.('atom-one-flight')"));
check('universe:v590',/const RELEASE = 590;/.test(universe)&&/essentialUniverseDuringTravel:true/.test(universe));
check('tarot:section',/<section id="tarot"/.test(index));
check('daily:section',/<section id="daily"/.test(index));

check('worker:cache',/divina-bruxa-work12-v592-navigation/.test(worker));
check('worker:twelve-core-assets',occurrences(worker,/^  '\.\//gm)===12,String(occurrences(worker,/^  '\.\//gm)));
for(const contract of ['router','foundation','page-loader','universe','orb-identity','orb-renderer','orb-journey','orb-soul']) {
  check(`worker:validates-${contract}`,worker.includes(`work12-${contract}-contract-missing`));
}
check('worker:navigation-active',/DIVINA_WORK12_NAVIGATION_ACTIVE/.test(worker));
check('worker:network-first-code',/if \(isCode\(url\)\)/.test(worker));

const protectedHashes=Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'0f9bf832a9cc673596d78d023f41b0091f6de0a3467def5033ca1bf10155fdd9',
  'supreme-orb-core-v501.js':'8e815568c54d368b5b2b4643a27466187f3722018d264c7ed9a3d8fe2cc9fcb3',
  'orb-engine-v208.js':'f7939f0219d34f086043836acba7e5b0b77b809e58d31e6b8331f0248b53532c',
  'whit-orb-soul-bridge-v581.js':'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'universe-coordinate-law-v583.js':'c28116ebdcad8274bfaeec1d816b1d150437778839b5f4e872e6dd81e4a6fb00',
  'orb-universal-presence-v526.js':'9df8d1131ed769392d921077e1931c9d780969d623e0ce30c7b1ca044c3a532b',
  'orb-skin-release-v1.js':'9be903883973fff3e6d069f4bf38ae00dfe638ed506b12ad8b41cc13deb926f4',
  'orbital-menu-v502.js':'0a2e0f2818078ec43f73e5b0e0892ecee66d212269057ecd8ba983023730b769',
  'orbital-menu-v502.css':'cc1ed5ecf28f0e4e1f78b8b434c0715523a93a411b9ade8de09bde5fbc32b022',
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'world-truth-registry-v535.js':'e8aaa5724fa87868a46e228bbb9b655dafbeeb0299bc4f5ac20fb9a847a7acf9',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'reality-intention-language-v585.css':'1d6be387ff29d6401488276e562d43af28286232bded442650475eb6036e86f3',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'magical-bubble-system-v586.css':'3c6a30c9ff78c1a3aaabcf26cfcde4dcbe163209c2c5ec774a15bf762d064bab'
});
for(const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V592',work:'WORK12',macroStage:'4-of-10 / Navegacao Coordenada',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  importFiles:new Set(imports).size,failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
