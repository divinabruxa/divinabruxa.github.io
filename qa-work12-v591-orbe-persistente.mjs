import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const exists = file => fs.existsSync(path.join(root,file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences = (source,pattern) => [...source.matchAll(pattern)].length;
const checks = [];
const check = (id,condition,detail='') => checks.push({id,pass:Boolean(condition),detail:condition?'':detail});

const app = read('app-v208.js');
const index = read('index.html');
const worker = read('sw.js');
const core = read('supreme-orb-core-v501.js');
const renderer = read('orb-engine-v208.js');
const soul = read('whit-orb-soul-bridge-v581.js');
const journey = read('orb-persistent-journey-v565.js');
const universe = read('living-universe-core-v524.js');
const foundation = read('work12-foundation-v589.js');

for (const file of [
  'app-v208.js','index.html','sw.js','supreme-orb-core-v501.js','orb-engine-v208.js',
  'whit-orb-soul-bridge-v581.js','orb-motion-core-v207.js','orb-gesture-core-v208.js',
  'orb-persistent-journey-v565.js','orb-universal-presence-v526.js','orb-skin-release-v1.js',
  'living-universe-core-v524.js','work12-foundation-v589.js','tarot-livre-orbe-os-v517.js',
  'tarot-session.js','tarot-data.js','daily-world-v509.js','daily-policy-v303.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v591',/name="divina-fluidity-release" content="V591"/.test(index));
check('release:work12-v591',/name="divina-work12" content="V591"/.test(index));
check('release:macro-three',/data-macroetapa="work12-3-orbe-persistente"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=591-work12-orb/.test(index));
check('release:worker-query',/sw\.js\?v=591/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v591-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v591'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v591-work12-app'/.test(app));
check('release:macro-public',/window\.divinaWork12Macro3V591/.test(app));
check('release:macro-dataset',/work12Macro = '3-orbe-persistente'/.test(app));
check('release:worker-version',/const VERSION = 591;/.test(worker));

check('wiring:renderer-v591',app.includes("./orb-engine-v208.js?v=591-work12-orb"));
check('wiring:core-v591',app.includes("./supreme-orb-core-v501.js?v=591-work12-orb"));
check('wiring:soul-v591',app.includes("./whit-orb-soul-bridge-v581.js?v=591-work12-orb"));
check('wiring:foundation-v589',app.includes("./work12-foundation-v589.js?v=589"));
check('wiring:universe-v590',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:journey-v583',app.includes("./orb-persistent-journey-v565.js?v=583-coordinate-travel"));
check('wiring:one-renderer-construction',occurrences(app,/new RealityOrbEngine\(/g)===1);
check('wiring:one-core-construction',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-soul-construction',occurrences(app,/createWhitOrbSoulBridgeV581\(/g)===1);
check('wiring:renderer-public',/renderer:realityOrb/.test(app));
check('wiring:macro-one-preserved',/window\.divinaWork12Macro1V589/.test(app));
check('wiring:macro-two-preserved',/window\.divinaWork12Macro2V590/.test(app));
check('wiring:foundation-authority',/window\.divinaWork12 = work12Foundation/.test(app));

const imports = [
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
check('module-graph:count',new Set(imports).size>=64,String(new Set(imports).size));
for (const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('entity:one-id',occurrences(index,/id="orb"/g)===1);
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1);
check('entity:release',/const WORK12_RELEASE = 591;/.test(core));
check('entity:stable-id',/const ENTITY_ID = 'divina-orb-canonical'/.test(core));
check('entity:audit',/auditPersistence\(reason = 'manual'\)/.test(core));
check('entity:identity-proof',/canonicalOrbs\[0\] === this\.entityNode/.test(core));
check('entity:renderer-proof',/this\.renderer\?\.canvas === this\.canvas/.test(core));
check('entity:physics-proof',/this\.renderer\?\.motionCore === this\.motion/.test(core));
check('entity:journey-proof',/travelerCopies \|\| 0\) === 0/.test(core));
check('entity:actual-one-not-claim',/oneLivingOrb:persistence\.canonicalOrbs === 1/.test(core));
check('entity:projections-not-entities',/projectionSurfacesAreNotEntities:true/.test(core));
check('entity:one-existing-observer',occurrences(core,/new MutationObserver\(/g)===1);
check('entity:no-interval',!/setInterval\s*\(/.test(core));

check('renderer:release',/const ORB_RENDERER_RELEASE = 591;/.test(renderer));
check('renderer:singleton',/Symbol\.for\('divina\.reality\.orb\.instance\.v208'\)/.test(renderer));
check('renderer:one-motion-client',occurrences(renderer,/this\.motionCore\.register\(/g)===1);
check('renderer:shared-motion-reference',/this\.motionCore = orbMotionV207/.test(renderer));
check('renderer:duplicate-construction-reused',/current\.constructorReuses/.test(renderer));
check('renderer:foreign-canvas-observed',/current\.canvas !== canvas/.test(renderer));
check('renderer:idempotent-presence',/const repeated = previous === state/.test(renderer)&&/this\.presenceRefreshes \+= 1/.test(renderer));
check('renderer:one-renderer-contract',/oneRenderer:this\.foreignCanvasAttempts === 0/.test(renderer));
check('renderer:one-physics-contract',/onePhysics:this\.motionCore === orbMotionV207/.test(renderer));
check('renderer:shared-clock',/sharedMotionClock:true/.test(renderer));
check('renderer:no-private-raf',!renderer.includes('requestAnimationFrame('));
check('renderer:no-interval',!/setInterval\s*\(/.test(renderer));

check('soul:release',/const VERSION = 591;/.test(soul));
check('soul:work12-listener',soul.includes("'divina:work12-state'"));
check('soul:complete-state-map',Object.keys({REST:1,AWAKEN:1,OFFER:1,ACCEPT:1,QUIET:1,DEPART:1,TRAVEL:1,ARRIVE:1,REVEAL:1})
  .every(state=>new RegExp(`\\n  ${state}:'`).test(soul)));
check('soul:expression-coalescing',/MIN_EXPRESSION_INTERVAL = 180/.test(soul)&&/coalescedExpressions/.test(soul));
check('soul:travel-single-expression',/\['traveling','resting'\]\.includes\(next\)/.test(soul));
check('soul:renderer-before-semantic-broadcast',soul.indexOf('renderer?.expressSoul?.({')<soul.indexOf('journey?.setPresence?.(rendererState'));
check('soul:no-ui',!soul.includes('createElement('));
check('soul:no-raf',!soul.includes('requestAnimationFrame('));
check('soul:no-interval',!/setInterval\s*\(/.test(soul));
check('soul:no-worker',!soul.includes('new Worker('));
check('soul:no-speech',!soul.includes('speechSynthesis'));
check('soul:no-api',/modelCalls:0/.test(soul)&&/apiCalls:0/.test(soul));
check('soul:privacy',/privateContentRead:false/.test(soul)&&/formFieldReads:false/.test(soul));
check('soul:fiction-honesty',/fictionalPersona:true/.test(soul)&&/soulMetaphor:true/.test(soul)&&/consciousnessClaim:false/.test(soul));
check('soul:canonical-only',/canonicalOrbOnly:true/.test(soul)&&/separateOrb:false/.test(soul));
check('soul:silence',/messageIncluded:false/.test(soul)&&/speechAdded:false/.test(soul));

check('journey:physical-orb',/physicalOrbTransport:true/.test(journey));
check('journey:no-copies',/travelerCopies:0/.test(journey));
check('journey:no-teleport',/teleportFallback:false/.test(journey)&&/portalVisual:false/.test(journey));
check('journey:no-flicker',/flicker:false/.test(journey));
check('journey:return-home',/this\.core\?\.returnHome\?\.\(\)/.test(journey));
check('journey:pauses-heavy',journey.includes("this.universe?.pause?.('atom-one-flight')"));
check('journey:resumes-heavy',journey.includes("this.universe?.start?.('atom-one-flight')"));
check('journey:orb-renderer-priority',/orbRendererPausedDuringFlight:false/.test(journey));
check('journey:no-permanent-loop',/permanentAnimationLoops:0/.test(journey));
check('journey:voice-silent-arrival',/automaticRouteVoice:false/.test(journey)&&/explicitOrbVoiceOnly:true/.test(journey));

check('skin:core-sync',/syncSkin\(explicitSkin\)/.test(core));
check('skin:journey-copy',/function copyVariables\(source, destination\)/.test(journey));
check('skin:thirty-valid',/dataset\.orbSkinRegistry = valid \? '30-valid'/.test(read('orb-skin-release-v1.js')));
check('universe:v590-preserved',/const RELEASE = 590;/.test(universe)&&/essentialUniverseDuringTravel:true/.test(universe));
check('foundation:v589-preserved',/WORK12_CONSTITUTION_V589/.test(foundation)&&/const MAX_INTENTIONS = 2;/.test(foundation));
check('tarot:section-preserved',/<section id="tarot"/.test(index));
check('daily:section-preserved',/<section id="daily"/.test(index));

check('worker:cache',/divina-bruxa-work12-v591-orb/.test(worker));
check('worker:ten-core-assets',occurrences(worker,/^  '\.\//gm)===10);
check('worker:validates-foundation',/work12-foundation-contract-missing/.test(worker));
check('worker:validates-universe',/work12-universe-contract-missing/.test(worker));
check('worker:validates-identity',/work12-orb-identity-contract-missing/.test(worker));
check('worker:validates-renderer',/work12-orb-renderer-contract-missing/.test(worker));
check('worker:validates-journey',/work12-orb-journey-contract-missing/.test(worker));
check('worker:validates-soul',/work12-orb-soul-contract-missing/.test(worker));
check('worker:orb-active-message',/DIVINA_WORK12_ORB_ACTIVE/.test(worker));
check('worker:network-first-code',/if \(isCode\(url\)\)/.test(worker));

const protectedHashes = Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'0f9bf832a9cc673596d78d023f41b0091f6de0a3467def5033ca1bf10155fdd9',
  'work12-foundation-v589.js':'3a9bef9f0295bd4ba0bdc085877ed460dc07c804f8a0df1ef9b9271cd2590806',
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
  'navigation.js':'fb33453fb9d10b10b3860fbb9f4586bd6c2f9c4e70e5482fc2e4063b44081694',
  'world-truth-registry-v535.js':'e8aaa5724fa87868a46e228bbb9b655dafbeeb0299bc4f5ac20fb9a847a7acf9',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'reality-intention-language-v585.css':'1d6be387ff29d6401488276e562d43af28286232bded442650475eb6036e86f3',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e',
  'magical-bubble-system-v586.css':'3c6a30c9ff78c1a3aaabcf26cfcde4dcbe163209c2c5ec774a15bf762d064bab'
});
for (const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const failures = checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V591',work:'WORK12',macroStage:'3-of-10 / Orbe Persistente',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  importFiles:new Set(imports).size,failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if (failures.length) process.exitCode=1;
