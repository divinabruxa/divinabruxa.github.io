/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 6 V585 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||path.dirname(fileURLToPath(import.meta.url)));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail:String(detail||'')});

const required=[
  'app-v208.js','index.html','sw.js',
  'reality-intention-language-v585.js','reality-intention-language-v585.css',
  'orbital-menu-v502.js','orbital-menu-v502.css',
  'universe-coordinate-law-v583.js','orb-persistent-journey-v565.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const indexHtml=read('index.html');
const language=read('reality-intention-language-v585.js');
const css=read('reality-intention-language-v585.css');
const menu=read('orbital-menu-v502.js');
const menuCss=read('orbital-menu-v502.css');
const sw=read('sw.js');

check(indexHtml.includes('name="divina-fluidity-release" content="V585" data-macroetapa="6-linguagem-viva"'),'release:meta-v585');
check(indexHtml.includes('reality-intention-language-v585.css?v=585'),'release:index-css-v585');
check(indexHtml.includes('app-v208.js?v=585-linguagem-viva'),'release:index-app-v585');
check(indexHtml.includes("__divinaSWBootstrap='v585-inline'")&&indexHtml.includes('sw.js?v=585'),'release:index-worker-v585');
check(indexHtml.includes('divina.sw.reload.v585')&&indexHtml.includes('version:585'),'release:index-worker-epoch-v585');
check(app.includes("createRealityIntentionLanguageV585")&&app.includes("reality-intention-language-v585.js?v=585"),'release:app-language-v585');
check(app.includes('window.divinaFluidezSupremaV585'),'release:status-v585');
check(app.includes("stage:'living-reality-language'")&&app.includes("macroStage:'6-of-10'"),'release:macro-stage-6');
check(sw.includes('const VERSION=585;')&&sw.includes('divina-bruxa-v585-shell'),'release:worker-v585');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V585')&&sw.includes('reality-intention-language-v585'),'release:atomic-language-v585');
check(sw.includes("'./reality-intention-language-v585.js','./reality-intention-language-v585.css'"),'release:offline-language-v585');

const moduleUrl=`${pathToFileURL(path.join(root,'reality-intention-language-v585.js')).href}?qa=${Date.now()}`;
const languageModule=await import(moduleUrl);
const profiles=languageModule.REALITY_INTENTIONS_V585;
const contract=languageModule.REALITY_INTENTION_LANGUAGE_CONTRACT_V585;
const ids=profiles.map(profile=>profile.id);
const intentions=profiles.map(profile=>profile.intention);
const truthWords=profiles.map(profile=>profile.truth.replace(/[.,]/g,'').trim().split(/\s+/).filter(Boolean).length);
const expectedIds=['home','tarot','daily','spreads','library','school','journal','ai','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];

check(profiles.length===17,'language:seventeen-realities',profiles.length);
check(JSON.stringify(ids)===JSON.stringify(expectedIds),'language:canonical-route-order',ids.join(','));
check(new Set(ids).size===17,'language:no-route-duplicate');
check(new Set(intentions).size===17,'language:no-intention-repeat',intentions.join(','));
check(intentions.every(value=>value.trim().split(/\s+/).length===1),'language:one-word-intentions',intentions.join(','));
check(Math.max(...truthWords)<=5,'language:truth-five-words-maximum',Math.max(...truthWords));
check(profiles.filter(profile=>profile.mode==='silent').map(profile=>profile.id).join(',')==='home','language:home-is-only-silence');
check(profiles.filter(profile=>profile.mode==='protected').map(profile=>profile.id).join(',')==='tarot,daily','language:protected-pair');
check(profiles.filter(profile=>profile.mode==='threshold').length===14,'language:fourteen-orb-thresholds');
check(languageModule.normalizeRealityRouteV585('#carta-do-dia')==='daily','language:daily-alias');
check(languageModule.normalizeRealityRouteV585('whit')==='ai','language:whit-alias');
check(languageModule.realityIntentionV585('store').truth==='Magia com origem clara.','language:store-magic-is-clear');
check(languageModule.realityIntentionV585('consultations').truth==='Acolhimento, escopo e limites.','language:consultations-practical-clarity');
check(languageModule.realityIntentionV585('ai').truth==='Whit responde quando chamada.','language:whit-only-when-invited');
check(languageModule.realityIntentionV585('notifications').truth==='Você escolhe o que chega.','language:notification-consent');
check(contract.axes.horizontal==='travel-between-realities'&&contract.axes.vertical==='immersion'&&contract.axes.depth==='contextual-discovery','language:coordinate-law');
check(contract.iphoneDuo==='continuous-compact-to-expanded','language:iphone-duo-continuity');
check(contract.homeThresholds===0&&contract.samePhysicalOrb&&contract.duplicateOrbs===0,'language:home-and-one-orb');
check(contract.permanentAnimationLoops===0&&contract.mutationObservers===0,'language:no-new-hot-loop');
check(contract.automaticWhitSpeech===false&&contract.apiCalls===0,'language:no-automatic-whit-no-api');

check(language.includes("if (profile.mode === 'silent') return null"),'home:no-threshold-created');
check(language.includes("orbHost.dataset.orbJourneyAnchor = 'v585-intention'")&&language.includes('orbCore.claim(host'),'orb:threshold-is-real-destination');
check(language.includes("if (profile.mode !== 'threshold') return false"),'orb:protected-routes-not-reclaimed');
check(!/createElement\(['"]canvas/.test(language),'orb:no-new-canvas');
check(!/new\s+(?:AudioContext|webkitAudioContext)/.test(language),'performance:no-audio-engine');
check(!/MutationObserver/.test(language),'performance:no-mutation-observer');
check(!/requestAnimationFrame/.test(language),'performance:no-animation-loop');
check(!/speechSynthesis|\.speak\s*\(/.test(language),'whit:no-automatic-speech');
check(!/localStorage|sessionStorage|fetch\s*\(/.test(language),'privacy:no-storage-no-network');
check(language.includes("source:'explicit-gesture'")&&language.includes("axis:'vertical'"),'depth:explicit-vertical-gesture');
check(language.includes("behavior:reducedMotion() ? 'auto' : 'smooth'"),'depth:reduced-motion-respected');
check(language.includes('height < layoutHeight * .72'),'iphone:software-keyboard-aware');
check(language.includes("width <= 430 ? 'compact' : width <= 768 ? 'expanded' : 'wide'"),'iphone:continuous-layout-tiers');

check(count(indexHtml,/id=["']orb["']/g)===1,'orb:one-canonical-id');
check(count(indexHtml,/id=["']home["'][^>]*class=["'][^"']*screen/g)===1,'home:one-home-screen');
check(!indexHtml.includes('db585-intent-threshold'),'html:no-hardcoded-thresholds');
check(app.includes('language:realityIntentionLanguage'),'app:language-exposed');
check(app.includes("livingRealityLanguageHomeThresholds:0")&&app.includes("iphoneDuoContinuity:'compact-to-expanded-without-restart'"),'app:release-contract');

check(count(css,/@keyframes/g)===0,'css:no-new-keyframes',count(css,/@keyframes/g));
check(css.includes('writing-mode:vertical-rl')&&css.includes('rgba(255,236,199,.58)'),'css:transparent-vertical-information');
check(css.includes('env(safe-area-inset-top)')&&css.includes('env(safe-area-inset-left)')&&css.includes('env(safe-area-inset-right)'),'css:iphone-safe-areas');
check(css.includes('@media (max-width:430px)')&&css.includes('@media (min-width:700px)'),'css:closed-and-open-postures');
check(css.includes('@media (orientation:landscape) and (max-height:560px)'),'css:landscape-posture');
check(css.includes('@media (prefers-reduced-motion:reduce)'),'css:reduced-motion');
check(css.includes('@media (forced-colors:active)')&&css.includes('@media (prefers-contrast:more)'),'css:contrast-accessibility');
check(css.includes('min-block-size:44px')&&css.includes('touch-action:manipulation'),'css:minimum-touch-target');
check(css.includes('html[data-v585-motion="travel"]')&&css.includes('backdrop-filter:none'),'css:travel-pauses-glass');
check(css.includes('[data-v585-secondary-presence="true"]')&&css.includes('display:none!important'),'css:no-competing-presence');
check(css.includes('--db585-orb-size:clamp')&&css.includes('--db585-threshold-height:clamp'),'css:continuous-fluid-sizing');

const iphoneProfiles=[
  {name:'iPhone SE 1',width:320,height:568,open:false},
  {name:'iPhone SE 2',width:375,height:667,open:false},
  {name:'iPhone 13 mini',width:375,height:812,open:false},
  {name:'iPhone 15',width:393,height:852,open:false},
  {name:'iPhone 15 Pro Max',width:430,height:932,open:false},
  {name:'iPhone Duo fechado',width:390,height:844,open:false},
  {name:'iPhone Duo aberto',width:768,height:1024,open:true},
  {name:'iPhone Duo aberto amplo',width:820,height:1180,open:true}
];
for(const profile of iphoneProfiles){
  const orb=profile.open
    ? Math.max(210,Math.min(Math.min(profile.width*.31,profile.height*.35),330))
    : Math.max(132,Math.min(Math.min(profile.width*.46,profile.height*.27),196));
  const threshold=profile.open
    ? Math.min(820,Math.max(390,profile.height-168))
    : Math.max(380,profile.height-154);
  const verticalNeed=orb+184;
  check(orb<=profile.width*.72,`iphone:${profile.name}:orb-width`,`${orb}/${profile.width}`);
  check(verticalNeed<=threshold,`iphone:${profile.name}:threshold-fit`,`${verticalNeed}/${threshold}`);
}

const menuIntents=[...menu.matchAll(/intent:'([^']+)'/g)].map(match=>match[1]);
check(menuIntents.length===14&&new Set(menuIntents).size===14,'menu:v584-fourteen-unique-intentions');
check(menuIntents.every(value=>value.trim().split(/\s+/).length===1),'menu:v584-one-word-intentions');
check(menu.includes('this.core.claim(this.host')&&menu.includes('oneLivingOrb:true'),'menu:v584-one-physical-orb');
check(menuCss.includes('#divinaOrbitalMenuV502{')&&menuCss.includes('overflow:hidden!important'),'menu:v584-fullscreen-preserved');
check(menuCss.includes('html[data-menu-motion="active"]')&&menuCss.includes('animation-play-state:paused!important'),'menu:v584-motion-pause-preserved');

const frozen=Object.freeze({
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
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b'
});
Object.entries(frozen).forEach(([file,expected])=>check(sha(file)===expected,`protected:${file}`,sha(file)));

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v585-language`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check(coordinateAudit.valid&&coordinateAudit.routeCount===17,'coordinates:all-realities-preserved');
check(coordinateAudit.directedTransitionCount===272&&coordinateAudit.everyRealityTransitionIsHorizontal,'coordinates:all-horizontal-travel-preserved');
const vector=coordinates.universeJourneyVectorV583('library','music',585);
check(vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,'coordinates:no-teleport-no-flicker');

const tarotSession=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v585-language`);
const tarotData=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v585-language`);
let tarotState=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v585-language',auditSeed:'qa-v585-language'});
const revealed=[];
for(let card=0;card<78;card+=1){
  const result=tarotSession.drawNextCard(tarotState,{now:()=>card+2});
  tarotState=result.state;
  revealed.push(result.cardId);
}
check(revealed.length===78&&new Set(revealed).size===78,'tarot:78-without-repetition');
check(revealed.every(id=>tarotData.CARDS[id]?.orientation==='normal'),'tarot:all-cards-direct');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V585',base:'V584',macroStage:'Fluidez Suprema / 6 de 10 / Linguagem Viva das Realidades',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{
    realities:17,uniqueIntentions:17,maximumIntentionWords:1,maximumTruthWords:5,
    thresholdRoutes:16,physicalIntentionHosts:14,protectedCompactRoutes:['tarot','daily'],
    homeThresholds:0,onePhysicalOrb:true,duplicateOrbs:0,verticalDepth:true,
    automaticWhitSpeech:false,newCanvases:0,newAnimationLoops:0,mutationObservers:0,
    iphoneProfiles:iphoneProfiles.length,iphoneDuo:'continuous-compact-to-expanded',
    tarotProtected:true,dailyProtected:true
  },failures
},null,2));
if(failures.length)process.exitCode=1;
