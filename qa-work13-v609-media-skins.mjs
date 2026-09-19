/* DIVINA BRUXA — WORK13 V609 · QA ESTRUTURAL DA OBRA EM PRIMEIRO PLANO */
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
  'index.html','app-v208.js','sw.js','living-media-skins-v609.js','living-media-skins-v609.css',
  'living-commerce-path-v608.js','living-commerce-path-v608.css','living-wisdom-path-v607.js',
  'music-video-supreme-v559.js','music-video-supreme-v559.css','admin-media-supreme-v559.js',
  'media-policy-v149.js','config-v200.js','skins-v201.js','skins-premium-world-v318.js',
  'skins-premium-world-v318.css','skin-registry-v12.js','runtime-v12.js','skin-catalog-v6.js',
  'page-loader-v1.js','MANIFESTO-WORK13-V601-MACROETAPA-1.json',
  'SNAPSHOT-WORK12-V600-PROTEGIDO.zip','qa-work13-v609-media-skins-runtime.mjs'
];
required.forEach(file => check(`file:${file}`, exists(file), file));

const index = read('index.html');
const app = read('app-v208.js');
const worker = read('sw.js');
const runtime = read('living-media-skins-v609.js');
const styles = read('living-media-skins-v609.css');
const musicVideo = read('music-video-supreme-v559.js');
const skinEngine = read('skins-v201.js');
const config = read('config-v200.js');
const v601 = JSON.parse(read('MANIFESTO-WORK13-V601-MACROETAPA-1.json'));

const changedRuntime = new Set(['index.html','app-v208.js','sw.js']);
let frozenWork12FilesChecked = 0;
for (const [file, expected] of Object.entries(v601.protectedRuntime || {})) {
  if (changedRuntime.has(file)) continue;
  frozenWork12FilesChecked += 1;
  check(`work12-frozen:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedPrior = Object.freeze({
  'cosmos-context-memory-v602.js':'82aea44135a5c960700d97a249a870d1a6fe759f1224cb81d3b798296dfa0ce1',
  'cosmos-reality-resonance-v603.js':'d16da25d2552b8aa3023cc94fd0caac0911f6302cdbabc3d99b7a9a4dbb79d51',
  'cosmos-reality-resonance-v603.css':'d6166c2802567a28e5575adc5c73c085f6ee8a530a6876e1a0e71e67677f14ad',
  'cosmic-daily-reading-v604.js':'747db49e21fd1b6fa8f6484d4841b99b3cc54984a27b9dddebcd7b7e61a5803c',
  'cosmic-daily-reading-v604.css':'04e30e0ceb1d538dda594294cfd52f318b4cebb05a828d78489e101cec0f0de5',
  'cosmic-spread-reading-v605.js':'6f127cfd9c047aa38be030578aa0be2d34f3be3a2a54a7fc1913b0020fae8f7b',
  'cosmic-spread-reading-v605.css':'f5cfb2c642bf6a09bed18bfe345c2f25707aa33e051b577fb981d40c80480eff',
  'whit-silence-timing-v606.js':'db625f3495efd65109144b780b8ea47b2177a4996ccc7e1fb215b27eff946e2a',
  'living-wisdom-path-v607.js':'cbd5c9b41c8aa390beadcf463934cf72d033aa7c04c102f24a8ce86f045d8377',
  'living-wisdom-path-v607.css':'765e5f3a8ca8670c465df6c62838ceaa54a7b7568a4307da94e0e987f1a37118',
  'living-commerce-path-v608.js':'de6614a2354e604ea09641a0f002aceb313571787df3dc93446625a0fdf991d3',
  'living-commerce-path-v608.css':'9b6b43aca5630c1f30acab6074505e92b9eb6801081483739a61113f5c38c42f'
});
for (const [file, expected] of Object.entries(protectedPrior)) {
  check(`work13-prior-protected:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

const protectedEngines = Object.freeze({
  'music-video-supreme-v559.js':'b6a0d40b9e048ae0507e8010dfc4040845d41dd68323bfcb08c1f57813f6b89f',
  'music-video-supreme-v559.css':'c3f83034d6ecb9f0974c076520d422e3c5fcb56be56943c31790c8857d6c88f4',
  'admin-media-supreme-v559.js':'d867857fa6fa231dfd64eb261c33cedfb32b14097610887b6ee99e927df129aa',
  'media-policy-v149.js':'81dfec4f3c6fe86053e6ae48ad359170d72b1e43611b2287096c81f3203c3b8d',
  'config-v200.js':'be2e5b370b410a73f0952f7439ee077acfba478707ee4ed89ca77273724081f5',
  'skins-v201.js':'25a11b371c71ea1ea320ead42c8021a24dd6b3f72b6fe1d070baa2cdf02470db',
  'skins-premium-world-v318.js':'034141dede37e36fb1528270bf049b6b0ad793849fb3f08d68cf5ec465790ec2',
  'skins-premium-world-v318.css':'f86856d2b27f32c3469cd44c8a16f8c88e36146846a8de15520d495ebff323e9',
  'skin-registry-v12.js':'78780aec86d883073cdbe35bb728177c990c1ca530b205efa15f3d181b23728b',
  'runtime-v12.js':'ac4f2f7d6f100227cb736751e104a157429fade8c2e2da44067446a585fbd2b4',
  'skin-catalog-v6.js':'ef96a7c52f442cd6f26b5ab877b076d4d7e59630372541923e9cf54021fe4d72',
  'page-loader-v1.js':'184c5b01def3737eaee452f933c4ba1f676b5260557f8b712dd83fd850d54a6e'
});
for (const [file, expected] of Object.entries(protectedEngines)) {
  check(`existing-engine-protected:${file}`, exists(file) && hash(file) === expected, exists(file) ? hash(file) : 'missing');
}

check('snapshot:v600-intact', hash('SNAPSHOT-WORK12-V600-PROTEGIDO.zip') === '871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d');

check('index:work13-v609', index.includes('name="divina-work13" content="V609"'));
check('index:fluidity-v609', index.includes('name="divina-fluidity-release" content="V609"'));
check('index:macro-nine', index.includes('data-macroetapa="work13-9-musica-videos-skins-interface-recua"'));
check('index:work12-v600', index.includes('name="divina-work12" content="V600"'));
check('index:live-audit-v600', index.includes('name="divina-live-audit" content="V600"'));
check('index:app-v609', index.includes('app-v208.js?v=609-work13-media-skins'));
check('index:style-v609', index.includes('living-media-skins-v609.css?v=609-work13-media-skins'));
check('index:one-style-v609', occurrences(index, /id="divinaLivingMediaSkinsV609"/g) === 1);
check('index:v608-style-preserved', occurrences(index, /id="divinaLivingCommercePathV608"/g) === 1);
check('index:worker-v609', index.includes("register('./sw.js?v=609'"));
check('index:ready-v609', index.includes("work13Boot='ready-v609'"));
check('index:one-orb', occurrences(index, /id="orb"/g) === 1, occurrences(index, /id="orb"/g));
check('index:one-canvas', occurrences(index, /id="orbCanvas"/g) === 1, occurrences(index, /id="orbCanvas"/g));

check('app:v609-import', app.includes("createLivingMediaSkinsV609 } from './living-media-skins-v609.js?v=609-work13-media-skins'"));
check('app:v609-created-once', occurrences(app, /createLivingMediaSkinsV609\(\{/g) === 1, occurrences(app, /createLivingMediaSkinsV609\(\{/g));
check('app:v609-public', app.includes('window.divinaWork13Macro9V609'));
check('app:v609-current', app.includes('window.divinaCosmosVivo = window.divinaWork13Macro9V609'));
for (const version of [602,603,604,605,606,607,608]) check(`app:v${version}-preserved`, app.includes(`window.divinaWork13Macro${version - 600}V${version}`));
check('app:on-orbe', app.includes('window.orbe.livingMediaSkins = livingMediaSkins'));
check('app:three-worlds', app.includes("worlds:Object.freeze(['music','videos','skins'])"));
check('app:albums', app.includes("musicAlbums:Object.freeze(['Sobre as Estrelas','Z'])"));
check('app:tracks', app.includes('musicTrackCounts:Object.freeze([10,8])') && app.includes('musicVerifiedTracks:18'));
check('app:zero-videos', app.includes('videoPublishedEpisodesAtRelease:0') && app.includes('videoInventedEpisodes:0'));
check('app:thirty-skins', app.includes('skinCount:30') && app.includes('skinGlobalApplyWithoutReload:true'));
check('app:no-real-billing', app.includes('realBilling:false') && app.includes('frontendEntitlementGrants:false'));
check('app:worker-handler', app.includes("event.data?.type === 'DIVINA_WORK13_MEDIA_SKINS_ACTIVE'"));
check('app:worker-v609', app.includes("register('./sw.js?v=609'"));
check('app:boot-v609', app.includes("work13CosmosVivo:'V609'") && app.includes("work13MacroStage:'9-of-10-media-skins-interface-recedes'"));
check('app:one-navigation', occurrences(app, /createNavigation\(/g) === 1, occurrences(app, /createNavigation\(/g));
check('app:one-orb-core', occurrences(app, /createSupremeOrbCoreV501\(/g) === 1, occurrences(app, /createSupremeOrbCoreV501\(/g));
check('app:one-renderer', occurrences(app, /new RealityOrbEngine\(/g) === 1, occurrences(app, /new RealityOrbEngine\(/g));
check('app:one-journey', occurrences(app, /createOrbPersistentJourneyV565\(/g) === 1, occurrences(app, /createOrbPersistentJourneyV565\(/g));

check('runtime:contract', runtime.includes('LIVING_MEDIA_SKINS_CONTRACT_V609'));
check('runtime:version', runtime.includes('const VERSION = 609;'));
check('runtime:macro-nine', runtime.includes("macroStage:'9-of-10'"));
check('runtime:sequence', runtime.includes("'work-first','explicit-depth','single-player-on-demand','interface-recedes'"));
check('runtime:real-albums', runtime.includes("title:'Sobre as Estrelas', year:2024, tracks:10") && runtime.includes("title:'Z', year:2026, tracks:8"));
check('runtime:video-truth', runtime.includes("project:'De Frente com o Tarot'") && runtime.includes('publishedEpisodesAtRelease:0') && runtime.includes('inventedEpisodes:0'));
check('runtime:skins-truth', runtime.includes('count:30') && runtime.includes("freeSkin:'classic'") && runtime.includes('paidSkins:29'));
check('runtime:existing-engines', runtime.includes("existingEnginesPreserved:Object.freeze({ music:'V559', videos:'V559', skins:'V201' })"));
check('runtime:abortable', runtime.includes('signal:this.abort.signal'));
check('runtime:no-private-form-read', !/FormData|\.elements\.|\.value\b/.test(runtime));
check('runtime:no-private-selectors', !/querySelector[^\n]*(?:textarea|input\[name|journal-text|private-question)/i.test(runtime));
check('runtime:no-storage', runtime.includes('storageReads:0') && runtime.includes('storageWrites:0') && !/(?:sessionStorage|localStorage)\.(?:getItem|setItem|removeItem)/.test(runtime));
check('runtime:no-network', runtime.includes('networkCalls:0') && !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(runtime));
check('runtime:no-canvas', runtime.includes('newCanvases:0') && !/createElement\s*\(\s*['"]canvas['"]|getContext\s*\(/.test(runtime));
check('runtime:no-player', runtime.includes('newPlayers:0') && !/createElement\s*\(\s*['"]iframe['"]/.test(runtime));
check('runtime:no-loop', runtime.includes('permanentAnimationLoops:0') && !/setInterval\s*\(/.test(runtime));
check('runtime:no-timer', runtime.includes('deferredTimers:0') && !/setTimeout\s*\(/.test(runtime));
check('runtime:no-observer', runtime.includes('mutationObservers:0') && !/new\s+(?:MutationObserver|IntersectionObserver|ResizeObserver)\s*\(/.test(runtime));
check('runtime:no-auto-navigation', runtime.includes('automaticNavigation:false') && !/location\.(?:assign|replace)|location\.href\s*=/.test(runtime));
check('runtime:no-auto-whit', runtime.includes('automaticWhitSpeech:false') && !/\.whisper\?\.|\.speak\?\.|\.offer\?\./.test(runtime));
for (const value of ['privateContentReads:0','listeningHistoryReads:0','viewingHistoryReads:0','searchQueryReads:0','accountProfileReads:0','purchaseBodyReads:0']) check(`runtime:privacy:${value}`, runtime.includes(value));

check('styles:identity', styles.includes('[data-living-media-skins="v609"]'));
for (const phase of ['focus','detail','immersive','gallery']) check(`styles:phase:${phase}`, styles.includes(`[data-v609-phase="${phase}"]`));
check('styles:music', styles.includes('#musicApp .mv559-catalog') && styles.includes('[data-play-release]') === false);
check('styles:video-empty', styles.includes('#videoApp .mv559-empty'));
check('styles:skins-existing-stage', styles.includes('#skinsApp .skins-v191-stage'));
check('styles:iphone-430', styles.includes('@media(max-width:430px)'));
check('styles:reduced-motion', styles.includes('@media(prefers-reduced-motion:reduce)'));
check('styles:forced-colors', styles.includes('@media(forced-colors:active)'));
check('styles:no-keyframes', !/@keyframes/.test(styles));
check('styles:no-heavy-filter', !/backdrop-filter|(?:^|[;{])\s*filter\s*:/m.test(styles));
check('styles:no-external-url', !/url\s*\(/.test(styles));

check('engine:artist-real', config.includes("artist:'Hércules DX'"));
check('engine:albums-real', config.includes("name:'Sobre as Estrelas'") && config.includes("name:'Z'"));
check('engine:track-counts-real', config.includes('trackCount:10') && config.includes('trackCount:8'));
check('engine:player-explicit', musicVideo.includes('data-play-release=') && musicVideo.includes('data-play-episode='));
check('engine:no-autoplay', !/autoplay\s*=|allow="[^"]*autoplay/i.test(musicVideo));
check('engine:single-player-state', musicVideo.includes("activePlayers:this.player?1:0"));
check('engine:video-zero-copy', musicVideo.includes('zero episódios publicados'));
check('engine:skin-global-event', skinEngine.includes("document.addEventListener('divina:skin-applied'"));
check('engine:skin-no-reload-copy', skinEngine.includes('sem reiniciar o aplicativo'));

check('worker:v609', worker.includes('const VERSION = 609;'));
check('worker:cache-v609', worker.includes('divina-bruxa-work13-v609-media-skins'));
check('worker:app-v609', worker.includes("'./app-v208.js?v=609-work13-media-skins'"));
check('worker:runtime-v609', worker.includes("'./living-media-skins-v609.js?v=609-work13-media-skins'"));
check('worker:styles-v609', worker.includes("'./living-media-skins-v609.css?v=609-work13-media-skins'"));
check('worker:runtime-validates', worker.includes('work13-media-skins-contract-missing'));
check('worker:styles-validates', worker.includes('work13-media-skins-styles-missing'));
check('worker:v608-preserved', worker.includes("'./living-commerce-path-v608.js?v=608-work13-commerce-clarity'"));
check('worker:message-v609', worker.includes("type:'DIVINA_WORK13_MEDIA_SKINS_ACTIVE'"));
check('worker:network-first-code', worker.includes('if (isCode(url))'));
check('worker:no-unlimited-media-cache', worker.includes('event.respondWith(fetch(request))'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V609',
  work:'WORK13',
  macroStage:'9-of-10 / Música, Vídeos e Skins com a interface recuando',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  frozenWork12FilesChecked,
  protectedPriorWork13FilesChecked:Object.keys(protectedPrior).length,
  protectedExistingEngineFilesChecked:Object.keys(protectedEngines).length,
  changedProductionFiles:['app-v208.js','index.html','sw.js'],
  newRuntimeFiles:['living-media-skins-v609.js','living-media-skins-v609.css'],
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
