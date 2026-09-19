/* DIVINA BRUXA — WORK12 · QA ESTRUTURAL · MACROETAPA 5 V593 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const occurrences=(source,pattern)=>[...source.matchAll(pattern)].length;
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});

const app=read('app-v208.js');
const index=read('index.html');
const worker=read('sw.js');
const menu=read('orbital-menu-v502.js');
const css=read('orbital-menu-v502.css');
const intentionBlock=menu.slice(menu.indexOf('const INTENTIONS'),menu.indexOf('const INTENTION_FRAMES'));
const scene=menu.slice(menu.indexOf('function createScene'),menu.indexOf('function nativePulse'));

for(const file of [
  'app-v208.js','index.html','sw.js','orbital-menu-v502.js','orbital-menu-v502.css',
  'navigation.js','work12-foundation-v589.js','page-loader-v1.js',
  'living-universe-core-v524.js','supreme-orb-core-v501.js','orb-engine-v208.js',
  'orb-persistent-journey-v565.js','whit-orb-soul-bridge-v581.js',
  'tarot-session.js','tarot-data.js','daily-world-v509.js','daily-policy-v303.js'
]) check(`file:${file}`,exists(file),file);

check('release:meta-v593',/name="divina-fluidity-release" content="V593"/.test(index));
check('release:work12-v593',/name="divina-work12" content="V593"/.test(index));
check('release:macro-five',/data-macroetapa="work12-5-menu-lendario"/.test(index));
check('release:law',/data-law="one-orb-one-universe-one-physics-one-presence"/.test(index));
check('release:app-query',/app-v208\.js\?v=593-work12-menu/.test(index));
check('release:worker-query',/sw\.js\?v=593/.test(index));
check('release:inline-bootstrap',/__divinaSWBootstrap='v593-work12-inline'/.test(index));
check('release:inline-ready',/work12Boot='ready-v593'/.test(index));
check('release:app-bootstrap',/__divinaSWBootstrap = 'v593-work12-app'/.test(app));
check('release:worker-version',/const VERSION = 593;/.test(worker));
check('release:macro-public',/window\.divinaWork12Macro5V593/.test(app));
check('release:macro-dataset',/work12Macro = '5-menu-lendario'/.test(app));
check('release:legacy-macros-preserved',['divinaWork12Macro1V589','divinaWork12Macro2V590','divinaWork12Macro3V591','divinaWork12Macro4V592'].every(marker=>app.includes(marker)));

check('wiring:menu-v593',app.includes("orbital-menu-v502.js?v=593-work12-menu"));
check('wiring:navigation-v592',app.includes("./navigation.js?v=592-work12-navigation"));
check('wiring:foundation-v592',app.includes("./work12-foundation-v589.js?v=592-work12-navigation"));
check('wiring:universe-v590',app.includes("./living-universe-core-v524.js?v=590-work12-universe"));
check('wiring:orb-v591',app.includes("./supreme-orb-core-v501.js?v=591-work12-orb"));
check('wiring:one-menu-installer',occurrences(app,/installOrbitalMenuV502\?\./g)===1,occurrences(app,/installOrbitalMenuV502\?\./g));
check('wiring:one-navigation',occurrences(app,/createNavigation\(/g)===1);
check('wiring:one-core',occurrences(app,/createSupremeOrbCoreV501\(/g)===1);
check('wiring:one-renderer',occurrences(app,/new RealityOrbEngine\(/g)===1);

const imports=[
  ...app.matchAll(/\bfrom\s+['"](\.\/[^'"]+)['"]/g),
  ...app.matchAll(/\bimport\(\s*['"](\.\/[^'"]+)['"]\s*\)/g)
].map(match=>match[1].split('?')[0].replace(/^\.\//,''));
for(const imported of new Set(imports)) check(`module-graph:${imported}`,exists(imported),imported);

check('entity:one-id',occurrences(index,/id="orb"/g)===1);
check('entity:one-canvas',occurrences(index,/id="orbCanvas"/g)===1);
check('entity:menu-no-canvas',!menu.includes("createElement('canvas')")&&!scene.includes('<canvas'));
check('entity:menu-no-orb-copy',!scene.includes('mini-orb')&&!scene.includes('orbCanvas'));
check('entity:same-physical-claim',menu.includes('this.core.claim(this.host'));
check('entity:claim-handed-to-travel',menu.includes('preserveClaim:true')&&menu.includes("source:'orbital-menu-v502'"));
check('entity:home-via-orb',scene.includes('data-v593-home')&&menu.includes('activateHome()'));
check('entity:home-always-accessible',menu.includes('homeAlwaysAccessible:true')&&menu.includes('homeViaLivingOrb:true'));

const routes=[...intentionBlock.matchAll(/route:'([^']+)'/g)].map(match=>match[1]);
const intents=[...intentionBlock.matchAll(/intent:'([^']+)'/g)].map(match=>match[1]);
check('intentions:fifteen-destinations',routes.length===15,routes.length);
check('intentions:unique-routes',new Set(routes).size===15,routes.join(','));
check('intentions:unique-meaning',new Set(intents).size===15,intents.join(','));
check('intentions:one-word-each',intents.every(value=>value.trim().split(/\s+/).length===1),intents.join(','));
for(const route of ['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications']) {
  check(`intentions:route-${route}`,routes.includes(route));
}
check('intentions:frames-of-two',menu.includes('Math.ceil(INTENTIONS.length / 2)')&&menu.includes('slice(index * 2, index * 2 + 2)'));
check('intentions:maximum-two-status',menu.includes('maximumVisibleIntentions:2'));
check('intentions:hidden-before-offer',menu.includes('hidden aria-hidden="true" tabindex="-1"'));
check('intentions:progressive-state',menu.includes("publishBubble('birth'")&&menu.includes("publishBubble('breath'")&&menu.includes("publishBubble('dissolve'")&&menu.includes("publishBubble('accept'"));
check('intentions:horizontal-swipe',menu.includes("reason:'horizontal-travel'")&&menu.includes('Math.abs(dx) < Math.abs(dy) * 1.15'));
check('intentions:sky-next',scene.includes('data-v593-next="sky"')&&menu.includes("reason:'sky-touch'"));
check('intentions:keyboard-next',menu.includes("event.key === 'ArrowRight'")&&menu.includes("event.key === 'ArrowLeft'"));
check('intentions:no-auto-rotation',menu.includes('automaticRotation:false')&&!/setInterval\s*\(/.test(menu));
check('intentions:silence-copy',scene.includes('>Escute</span>')&&scene.includes('Deslize · outro sopro'));
check('intentions:not-menu-label',index.includes('aria-label="Chamar o universo"')&&index.includes('<span>SOPRO</span>'));
check('intentions:no-grid',menu.includes('menuGrid:false')&&!/display\s*:\s*grid[^}]*grid-template-columns/s.test(css));
check('intentions:organic-shape',css.includes('58% 42% 55% 45%')&&css.includes('43% 57% 46% 54%'));
check('intentions:max-two-css-breaths',occurrences(css,/@keyframes/g)===1,occurrences(css,/@keyframes/g));
check('intentions:motion-pauses-breath',css.includes('html[data-menu-motion="active"] .db502-portal')&&css.includes('animation-play-state:paused!important'));
check('intentions:universe-pause',menu.includes("pause?.(MENU_MOTION_REASON)")&&menu.includes("start?.(MENU_MOTION_REASON)"));
check('intentions:no-observer',!/new MutationObserver\s*\(/.test(menu));
check('intentions:no-raf-loop',occurrences(menu,/requestAnimationFrame\(/g)===1&&menu.includes('const frame = () => new Promise'));
check('intentions:no-storage',!/localStorage|sessionStorage/.test(menu));
check('intentions:no-whit-on-touch',!menu.includes('whit:')&&!menu.includes('Whit fala'));

check('viewport:fullscreen',css.includes('#divinaOrbitalMenuV502{')&&css.includes('inset:0!important')&&css.includes('overflow:hidden!important'));
check('viewport:no-scroll',!/.db502-menu\{[^}]*overflow\s*:\s*auto/s.test(css));
check('viewport:safe-top',css.includes('env(safe-area-inset-top)'));
check('viewport:safe-bottom',css.includes('env(safe-area-inset-bottom)'));
check('viewport:safe-right',css.includes('env(safe-area-inset-right)'));
check('viewport:reduced-motion',css.includes('@media (prefers-reduced-motion:reduce)')&&css.includes('animation:none!important'));
check('viewport:forced-colors',css.includes('@media (forced-colors:active)'));
check('viewport:dock-silent',css.includes('html.db502-menu-open .magic-dock')&&css.includes('visibility:hidden!important'));
check('viewport:background-inert',menu.includes('lockBackground()')&&menu.includes('node.inert = true')&&menu.includes('unlockBackground()'));

const iphoneProfiles=[
  {name:'SE-1',width:320,height:568},
  {name:'SE-2',width:375,height:667},
  {name:'13-mini',width:375,height:812},
  {name:'15',width:393,height:852},
  {name:'15-Pro-Max',width:430,height:932}
];
for(const profile of iphoneProfiles){
  const width=Math.max(108,Math.min(profile.width*.30,152));
  const height=Math.max(92,Math.min(profile.height*.17,128));
  const leftCenter=profile.width*.25;
  const rightCenter=profile.width*.75;
  const upperCenter=profile.height*.34;
  const lowerCenter=profile.height*.70;
  check(`iphone:${profile.name}:left-safe`,leftCenter-width/2>=18,`${leftCenter-width/2}`);
  check(`iphone:${profile.name}:right-safe`,rightCenter+width/2<=profile.width-18,`${rightCenter+width/2}`);
  check(`iphone:${profile.name}:upper-safe`,upperCenter-height/2>=118,`${upperCenter-height/2}`);
  check(`iphone:${profile.name}:lower-safe`,lowerCenter+height/2<=profile.height-70,`${lowerCenter+height/2}`);
}

check('worker:cache-v593',worker.includes('divina-bruxa-work12-v593-menu'));
check('worker:fourteen-core-assets',occurrences(worker,/^  '\.\//gm)===14,occurrences(worker,/^  '\.\//gm));
check('worker:menu-js',worker.includes("'./orbital-menu-v502.js?v=593-work12-menu'"));
check('worker:menu-css',worker.includes("'./orbital-menu-v502.css?v=593-work12-menu'"));
check('worker:validates-menu',worker.includes('work12-menu-contract-missing'));
check('worker:validates-menu-styles',worker.includes('work12-menu-styles-contract-missing'));
check('worker:menu-active',worker.includes('DIVINA_WORK12_MENU_ACTIVE'));
check('worker:network-first-code',worker.includes('if (isCode(url))'));

const protectedHashes=Object.freeze({
  'navigation.js':'aed753f83db6d3a0fd9ddecbcc2e20389536fae8c214b7b1fdbccf55a8f1551b',
  'work12-foundation-v589.js':'09efb3e189fd933569c55b5ceaaabd60fb218511f8d0dc2f2845d0742e98360a',
  'page-loader-v1.js':'6caa47abb2dd35b210ffb7539ee2ba62efa1225690fad4b14c8c5d2a2785f7cf',
  'whit-orb-soul-bridge-v581.js':'d48ec6c8abcfd7d9c11202d0e9877d66a34f0cd926794fdd3703b4a5e54c6866',
  'living-universe-core-v524.js':'0f9bf832a9cc673596d78d023f41b0091f6de0a3467def5033ca1bf10155fdd9',
  'supreme-orb-core-v501.js':'8e815568c54d368b5b2b4643a27466187f3722018d264c7ed9a3d8fe2cc9fcb3',
  'orb-engine-v208.js':'f7939f0219d34f086043836acba7e5b0b77b809e58d31e6b8331f0248b53532c',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'universe-coordinate-law-v583.js':'c28116ebdcad8274bfaeec1d816b1d150437778839b5f4e872e6dd81e4a6fb00',
  'orb-universal-presence-v526.js':'9df8d1131ed769392d921077e1931c9d780969d623e0ce30c7b1ca044c3a532b',
  'orb-skin-release-v1.js':'9be903883973fff3e6d069f4bf38ae00dfe638ed506b12ad8b41cc13deb926f4',
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'whit-core-supreme-v527.js':'a9789adc73171ae0fb67fd8fdb804fbb3598e2b83f8c31d3457a4d43a905c069',
  'whit-presence-v307.js':'0dc618b4c02bcad61c4bcf4ca4e9340bf9eb0d05d2da69a922edf28ceeb006ef',
  'whit-signature-v311.js':'7518dcf1e8a6d8e06ab66b8019cdf6a35932b4f699dc4738989499d53b0e8fbe',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'magical-bubble-system-v586.js':'b98c465d0519af348289c11e9abe4e6da28298459b3e24d84f81a654dd7c755e'
});
for(const [file,expected] of Object.entries(protectedHashes)) {
  check(`protected:${file}`,exists(file)&&hash(file)===expected,exists(file)?hash(file):'missing');
}

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v593-menu`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check('coordinates:all-realities',coordinateAudit.valid&&coordinateAudit.routeCount===17,JSON.stringify(coordinateAudit));
check('coordinates:all-horizontal',coordinateAudit.everyRealityTransitionIsHorizontal);
const vector=coordinates.universeJourneyVectorV583('home','tarot',593);
check('coordinates:no-teleport',vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,JSON.stringify(vector));

const session=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v593-menu`);
const {CARDS}=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v593-menu`);
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v593-menu',auditSeed:'work12-v593'});
const cards=[];
for(let index=0;index<78;index+=1){
  const draw=session.drawNextCard(tarotState,{now:()=>index+2});
  tarotState=draw.state;
  cards.push(draw.cardId);
}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:all-direct',cards.every(id=>CARDS[id]?.orientation==='normal'));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V593',work:'WORK12',macroStage:'5-of-10 / Menu Lendario',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,protectedFiles:Object.keys(protectedHashes).length,
  intentionRoutes:routes.length,iphoneProfiles:iphoneProfiles.length,
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
