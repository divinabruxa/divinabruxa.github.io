/* DIVINA BRUXA — WORK13 V608 · QA ESTRUTURAL DA CLAREZA VIVA */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const occurrences = (source, pattern) => [...source.matchAll(pattern)].length;
const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });

const required = [
  'index.html','app-v208.js','sw.js','living-commerce-path-v608.js','living-commerce-path-v608.css',
  'living-wisdom-path-v607.js','living-wisdom-path-v607.css','whit-silence-timing-v606.js',
  'consultation-engine.js','consultation-policy.js','commercial-truth-v200.js',
  'store-engine.js','store-policy.js','amazon-store-core-v543.js',
  'premium-engine-v191.js','premium-policy-v191.js','account-engine-v201.js','auth-client-v201.js',
  'MANIFESTO-WORK13-V601-MACROETAPA-1.json','MANIFESTO-WORK13-V607-MACROETAPA-7.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip','qa-work13-v608-commerce-runtime.mjs',
  'qa-work13-v608-continuity-runtime.mjs','qa-work13-v608-service-worker-runtime.mjs',
  'qa-work13-v608-boot-runtime.mjs'
];
required.forEach(file => check(`file:${file}`, exists(file), file));

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const runtime = read('living-commerce-path-v608.js');
const styles = read('living-commerce-path-v608.css');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));
const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenFilesChecked = 0;
for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenFilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedCommerce = Object.freeze({
  'commercial-truth-v200.js':'273d0cb7cb152220ff73c09e2329cb4c9c9d018a04366ca79b0fbdff78b796fe',
  'consultation-engine.js':'13fe1c009c986e8a7f108d75873db822641a2cb44eb8c0c218960e8857ec80c9',
  'consultation-policy.js':'7992d614c0a906f994bc06440aadc822524ed11df41322d918c11590d2457030',
  'consultations-supreme-v558.css':'74237d067e25e6c4c1411f70011213ecde30e0146967c68274843b7c1a6045ed',
  'account-consultations-world-v319.js':'1f3df28cfa54c1e51159217380eb24f3d5693f5eae385877f36e240ffe064758',
  'account-consultations-world-v319.css':'476b56929aa954aa8a178e27bf95fc2da7bff8d3351c85a6550678787ae768c6',
  'store-engine.js':'5734261d7f69ede6e6fc828c78f51a9dcf6e92b3fa8e92bb22e9f25a5350fed0',
  'store-policy.js':'fcd6cfec72624c926db02eabeb2ce9e656c5989699b012502a8464026e52cabb',
  'amazon-store-core-v543.js':'f1a13129be2acc0fffa6f1aa402330285baeb106092271ae7afb12113f47defa',
  'amazon-store-core-v543.css':'e3f6ed12ab010a0ab6bd178ab21316e2553fa303eb1dec89834f1bb6962e4538',
  'media-commerce-world-v320.js':'4abe1537290e2d44f0459da7acd3a5d586961760948fc1988b1e01f26f882bf5',
  'media-commerce-world-v320.css':'c690443b1b8337c5fd85788bd4887f61e02198b63794853eb8c3c7d561fc8ed4',
  'premium-engine-v191.js':'54c40ff16c6fc4e66b20c819e5fcf6801989b67598d29b036032d291895bc46d',
  'premium-policy-v191.js':'51d9abc664ba5a6be78405a86ba949caaf49ab328bb66d2aa76ae2ff3bbff9b1',
  'premium-billing-v191.css':'8de264386fe2dedd0dc5fdf0ad5915df98fa3ad0be8373b507dbeb9e4d683204',
  'skins-premium-world-v318.js':'034141dede37e36fb1528270bf049b6b0ad793849fb3f08d68cf5ec465790ec2',
  'skins-premium-world-v318.css':'f86856d2b27f32c3469cd44c8a16f8c88e36146846a8de15520d495ebff323e9',
  'account-engine-v201.js':'2f1365bca1223d2ce50fd13a8fdd3686de3f7d93029353506fb21cb1bdc30629',
  'account-state-copy-v201.js':'ad936b4f543d93b0a9144435535c0b7f746420328e8695a6fe13c7f9d3944661',
  'account-secure-v201.css':'ec2574d04b5e8c8f63ab6694bd413aeb71f502b45052e1b591ef0e2c6605b599',
  'auth-client-v201.js':'e0e1620c9ba20cca6bf15dbc337924379c11fa69c76ee8ec43f429e0c480b86a',
  'identity-rights-core-v531.js':'5fe22c3a6dbfe036260cb45a6640ec6c9177a123f16eb659510a51d9ceaf3fe0',
  'identity-rights-core-v531.css':'91ff943ce06609cd82b3257e8c2e6857dc379f9f75e09f3d8ab80759a627fc3d'
});
for (const [file, expected] of Object.entries(protectedCommerce)) {
  check(`commerce-engine-protected:${file}`, hash(file) === expected, hash(file));
}

const protectedWork13 = Object.freeze({
  'cosmos-context-memory-v602.js':'82aea44135a5c960700d97a249a870d1a6fe759f1224cb81d3b798296dfa0ce1',
  'cosmos-reality-resonance-v603.js':'d16da25d2552b8aa3023cc94fd0caac0911f6302cdbabc3d99b7a9a4dbb79d51',
  'cosmos-reality-resonance-v603.css':'d6166c2802567a28e5575adc5c73c085f6ee8a530a6876e1a0e71e67677f14ad',
  'cosmic-daily-reading-v604.js':'747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c',
  'cosmic-daily-reading-v604.css':'04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5',
  'cosmic-spread-reading-v605.js':'6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b',
  'cosmic-spread-reading-v605.css':'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff',
  'whit-silence-timing-v606.js':'db625f3495efd65109144b780b8ea47b2177a4996ccc7e1fb215b27eff946e2a',
  'living-wisdom-path-v607.js':'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377',
  'living-wisdom-path-v607.css':'765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118'
});
for (const [file, expected] of Object.entries(protectedWork13)) {
  check(`work13-prior-protected:${file}`, hash(file) === expected, hash(file));
}
check('snapshot:v600-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');
check('manifest:v607-intact', hash('MANIFESTO-WORK13-V607-MACROETAPA-7.json') === '3af98c9cfe789d3776020bb32d67bd5727cdf51354c3a6f5277c9a989ef68def');

check('index:work13-v608', index.includes('name="divina-work13" content="V608"'));
check('index:fluidity-v608', index.includes('name="divina-fluidity-release" content="V608"'));
check('index:macro-eight', index.includes('data-macroetapa="work13-8-consultas-loja-premium-conta-claros"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v608', index.includes('app-v208.js?v=608-work13-commerce-clarity'));
check('index:style-v608', index.includes('living-commerce-path-v608.css?v=608-work13-commerce-clarity'));
check('index:one-style-v608', occurrences(index, /id="divinaLivingCommercePathV608"/g) === 1);
check('index:worker-v608', index.includes("register('./sw.js?v=608'"));
check('index:ready-v608', index.includes("work13Boot='ready-v608'"));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));
for (const id of ['divinaLivingWisdomPathV607','divinaCosmicSpreadReadingV605','divinaCosmicDailyReadingV604','divinaCosmosRealityResonanceV603','divinaWork12FinalContinuityV598']) {
  check(`index:prior-style:${id}`, occurrences(index, new RegExp(`id="${id}"`, 'g')) === 1);
}

check('app:v608-import', app.includes("createLivingCommercePathV608 } from './living-commerce-path-v608.js?v=608-work13-commerce-clarity'"));
check('app:v608-created-once', occurrences(app, /createLivingCommercePathV608\(\{/g) === 1, occurrences(app, /createLivingCommercePathV608\(\{/g));
check('app:v608-public', app.includes('window.divinaWork13Macro8V608'));
check('app:v608-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro8V608'));
for (const version of [602,603,604,605,606,607]) check(`app:v${version}-preserved`, app.includes(`window.divinaWork13Macro${version - 600}V${version}`));
check('app:on-orbe', app.includes('window.orbe.livingCommerce = livingCommercePath'));
check('app:four-worlds', app.includes("worlds:Object.freeze(['consultations','store','subscriptions','login'])"));
check('app:prices', app.includes('consultationPricesCents:Object.freeze([25000,20000,15000,5000])'));
check('app:affiliate', app.includes("storeAssociateTag:'orbedasrealid-20'"));
check('app:premium', app.includes('premiumLifetimeCents:19990') && app.includes('aiMonthlyCents:8990'));
check('app:no-real-billing', app.includes('realBilling:false') && app.includes('frontendEntitlementGrants:false'));
check('app:worker-handler', app.includes("event.data?.type === 'DIVINA_WORK13_COMMERCE_CLARITY_ACTIVE'"));
check('app:worker-v608', app.includes("register('./sw.js?v=608'"));
check('app:boot-v608', app.includes("work13CosmosVivo:'V608'") && app.includes("work13MacroStage:'8-of-10-commerce-clarity-path'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('runtime:contract', runtime.includes('LIVING_COMMERCE_PATH_CONTRACT_V608'));
check('runtime:version', runtime.includes('const VERSION = 608;'));
check('runtime:macro-eight', runtime.includes("macroStage:'8-of-10'"));
check('runtime:sequence', runtime.includes("'one-clear-entry','explicit-choice','existing-engine','one-natural-next-step'"));
check('runtime:consultation-truth', runtime.includes('priceCents:Object.freeze([25000,20000,15000,5000])') && runtime.includes("contact:'orbedasrealidades@hotmail.com'"));
check('runtime:store-truth', runtime.includes('productsPreserved:21') && runtime.includes("associateTag:'orbedasrealid-20'"));
check('runtime:premium-truth', runtime.includes('premiumLifetimeCents:19990') && runtime.includes('aiMonthlyCents:8990') && runtime.includes('aiCreditsPerCycle:400'));
check('runtime:account-reuse', runtime.includes("existingGuideReused:'AccountWorldV319'"));
check('runtime:one-primary', runtime.includes('maximumPrimaryActionsAtEntry:1'));
check('runtime:abortable', runtime.includes('signal:this.abort.signal'));
check('runtime:no-private-form-read', !/FormData|\.elements\.|\.value\b|textContent\s*\.includes/.test(runtime));
check('runtime:no-private-selectors', !/querySelector[^\n]*(?:textarea|input\[name|journal-text|private-question)/i.test(runtime));
check('runtime:no-storage', runtime.includes('storageReads:0') && runtime.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(runtime));
check('runtime:no-network', runtime.includes('networkCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(runtime));
check('runtime:no-canvas', runtime.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(runtime));
check('runtime:no-loop', runtime.includes('permanentAnimationLoops:0') && !/setInterval\s*\(/.test(runtime));
check('runtime:no-timer', runtime.includes('deferredTimers:0') && !/setTimeout\s*\(/.test(runtime));
check('runtime:no-observer', runtime.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(runtime));
check('runtime:no-auto-navigation', runtime.includes('automaticNavigation:false') && !/location\.(?:assign|replace)|location\.href\s*=/.test(runtime));
check('runtime:no-auto-whit', runtime.includes('automaticWhitSpeech:false') && !/\.whisper\?\.|\.speak\?\.|\.offer\?\./.test(runtime));
for (const value of ['privateContentReads:0','formValueReads:0','consultationBodyReads:0','consultationProtocolReads:0','accountProfileReads:0','purchaseBodyReads:0','searchQueryReads:0']) check(`runtime:privacy:${value}`, runtime.includes(value));

check('styles:identity', styles.includes('[data-living-commerce-path="v608"]'));
check('styles:consultation-guide', styles.includes('#app>#consultations[data-db596-chamber-state="present"][data-v608-commerce-mode="guide"]'));
check('styles:store-guide', styles.includes('#app>#store[data-db596-chamber-state="present"][data-v608-commerce-mode="guide"]'));
check('styles:premium-sections', ['premium','ai','access'].every(value => styles.includes(`[data-v608-premium-section="${value}"]`)));
check('styles:account-reuse', styles.includes('#accountWorldV319'));
check('styles:iphone-430', styles.includes('@media(max-width:430px)'));
check('styles:reduced-motion', styles.includes('@media(prefers-reduced-motion:reduce)'));
check('styles:forced-colors', styles.includes('@media(forced-colors:active)'));
check('styles:no-keyframes', !/@keyframes/.test(styles));
check('styles:no-heavy-filter', !/backdrop-filter|filter\s*:/.test(styles));
check('styles:no-external-url', !/url\s*\(/.test(styles));

check('worker:v608', worker.includes('const VERSION = 608;'));
check('worker:cache-v608', worker.includes('divina-bruxa-work13-v608-commerce-clarity'));
check('worker:app-v608', worker.includes("'./app-v208.js?v=608-work13-commerce-clarity'"));
check('worker:runtime-v608', worker.includes("'./living-commerce-path-v608.js?v=608-work13-commerce-clarity'"));
check('worker:styles-v608', worker.includes("'./living-commerce-path-v608.css?v=608-work13-commerce-clarity'"));
check('worker:runtime-validates', worker.includes('work13-commerce-clarity-contract-missing'));
check('worker:styles-validates', worker.includes('work13-commerce-clarity-styles-missing'));
check('worker:v607-preserved', worker.includes("'./living-wisdom-path-v607.js?v=607-work13-living-wisdom'"));
check('worker:message-v608', worker.includes("type:'DIVINA_WORK13_COMMERCE_CLARITY_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V608',
  work:'WORK13',
  macroStage:'8-of-10 / Consultas, Loja, Premium e Conta com Clareza',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked:frozenFilesChecked,
  protectedCommerceFilesChecked:Object.keys(protectedCommerce).length,
  protectedPriorWork13FilesChecked:Object.keys(protectedWork13).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['living-commerce-path-v608.js','living-commerce-path-v608.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
