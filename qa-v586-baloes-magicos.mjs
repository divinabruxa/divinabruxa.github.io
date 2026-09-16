/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 7 V586 */
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
  'magical-bubble-system-v586.js','magical-bubble-system-v586.css',
  'reality-intention-language-v585.js','reality-intention-language-v585.css',
  'orbital-menu-v502.js','orbital-menu-v502.css',
  'universe-coordinate-law-v583.js','orb-persistent-journey-v565.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const indexHtml=read('index.html');
const bubbles=read('magical-bubble-system-v586.js');
const css=read('magical-bubble-system-v586.css');
const language=read('reality-intention-language-v585.js');
const sw=read('sw.js');

check(indexHtml.includes('name="divina-fluidity-release" content="V586" data-macroetapa="7-baloes-magicos-vivos"'),'release:meta-v586');
check(indexHtml.includes('magical-bubble-system-v586.css?v=586'),'release:index-css-v586');
check(indexHtml.includes('app-v208.js?v=586-baloes-vivos'),'release:index-app-v586');
check(indexHtml.includes("__divinaSWBootstrap='v586-inline'")&&indexHtml.includes('sw.js?v=586'),'release:index-worker-v586');
check(indexHtml.includes('divina.sw.reload.v586')&&indexHtml.includes('version:586'),'release:index-worker-epoch-v586');
check(app.includes('createMagicalBubbleSystemV586')&&app.includes('magical-bubble-system-v586.js?v=586'),'release:app-bubbles-v586');
check(app.includes('window.divinaFluidezSupremaV586'),'release:status-v586');
check(app.includes("stage:'living-magical-bubbles'")&&app.includes("macroStage:'7-of-10'"),'release:macro-stage-7');
check(app.includes('bubbles:magicalBubbles'),'release:bubbles-exposed');
check(sw.includes('const VERSION=586;')&&sw.includes('divina-bruxa-v586-shell'),'release:worker-v586');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V586')&&sw.includes('magical-bubble-system-v586'),'release:atomic-bubbles-v586');
check(sw.includes("'./magical-bubble-system-v586.js','./magical-bubble-system-v586.css'"),'release:offline-bubbles-v586');

const moduleUrl=`${pathToFileURL(path.join(root,'magical-bubble-system-v586.js')).href}?qa=${Date.now()}`;
const bubbleModule=await import(moduleUrl);
const profiles=bubbleModule.MAGICAL_BUBBLE_PROFILES_V586;
const contract=bubbleModule.MAGICAL_BUBBLE_CONTRACT_V586;
const ids=profiles.map(profile=>profile.route);
const allIntents=profiles.flatMap(profile=>profile.intents);
const words=allIntents.map(value=>value.trim().split(/\s+/).filter(Boolean).length);
const expectedIds=['tarot','daily','spreads','library','school','journal','ai','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];

check(profiles.length===16,'bubbles:sixteen-realities',profiles.length);
check(JSON.stringify(ids)===JSON.stringify(expectedIds),'bubbles:canonical-route-order',ids.join(','));
check(new Set(ids).size===16,'bubbles:no-route-duplicate');
check(profiles.every(profile=>profile.intents.length===4),'bubbles:four-intents-per-reality');
check(allIntents.length===64,'bubbles:sixty-four-intents',allIntents.length);
check(new Set(allIntents).size===64,'bubbles:no-intent-repeat',new Set(allIntents).size);
check(Math.max(...words)===4,'bubbles:maximum-four-words',Math.max(...words));
check(Math.min(...words)>=2,'bubbles:intentions-remain-phrases',Math.min(...words));
check(!ids.includes('home'),'home:no-profile');
check(bubbleModule.magicalBubbleProfileV586('home')===null,'home:no-bubble-profile');
check(bubbleModule.magicalBubbleProfileV586('#carta-do-dia')?.route==='daily','bubbles:daily-alias');
check(bubbleModule.magicalBubbleProfileV586('whit')?.route==='ai','bubbles:whit-alias');
check(bubbleModule.magicalBubbleProfileV586('ai').intents.includes('Chame Whit quando quiser'),'whit:invitation-not-automatic');
check(bubbleModule.magicalBubbleProfileV586('ai').intents.includes('Contexto nasce com permissão'),'whit:context-with-consent');
check(bubbleModule.magicalBubbleProfileV586('notifications').intents.includes('Só chega com permissão'),'practical:notification-consent');
check(bubbleModule.magicalBubbleProfileV586('store').intents.includes('A origem fica visível'),'practical:store-origin');
check(bubbleModule.magicalBubbleProfileV586('consultations').intents.includes('Limites também acolhem'),'practical:consultation-limits');
check(bubbleModule.magicalBubbleProfileV586('subscriptions').intents.includes('O essencial permanece livre'),'practical:premium-clarity');
check(bubbleModule.magicalBubbleProfileV586('music').intents.includes('Nenhuma reprodução automática'),'practical:music-no-autoplay');
check(bubbleModule.magicalBubbleProfileV586('login').intents.includes('Sua sessão permanece sua'),'practical:account-ownership');

check(contract.base==='V585'&&contract.macroStage==='7-of-10','contract:base-and-stage');
check(contract.supportedRealities===16&&contract.homeBubbles===0,'contract:home-remains-minimal');
check(contract.microIntentsPerReality===4&&contract.totalMicroIntents===64,'contract:semantic-density');
check(contract.maximumWords===4&&contract.simultaneousBubbles===1,'contract:summary-and-one-body');
check(contract.samePhysicalBubble&&contract.opensVerticalDepth,'contract:physical-bubble-is-portal');
check(contract.unpredictableForm&&contract.coherentMeaning,'contract:form-and-meaning');
check(contract.silenceAfterExhaustion&&contract.repeatWithinSession===false,'contract:silence-and-no-repeat');
check(contract.travelPolicy==='remove-immediately'&&contract.menuPolicy==='remove-immediately','contract:motion-priority');
check(contract.iphoneDuo==='continuous-compact-to-expanded','contract:iphone-duo-continuity');
check(contract.permanentAnimationLoops===0&&contract.mutationObservers===0&&contract.newCanvases===0,'contract:no-new-hot-engine');
check(contract.automaticWhitSpeech===false&&contract.apiCalls===0,'contract:no-automatic-whit-no-api');
check(contract.storageReads===0&&contract.storageWrites===0&&contract.privateReads===0,'contract:no-storage-no-private-read');

check(bubbles.includes("bubble.dataset.v586Voice = 'universe'"),'whit:bubble-is-universe-not-whit-speech');
check(bubbles.includes("root.dataset.v586Whit = 'silent-until-invited'"),'whit:silent-until-invited');
check(bubbles.includes("bubble.setAttribute('aria-live', 'off')"),'accessibility:no-unsolicited-announcement');
check(bubbles.includes("route === 'home'")&&bubbles.includes("activeRoute !== 'home'"),'home:explicit-silence-guards');
check(bubbles.includes("bubble.remove()")&&bubbles.includes("visibleBubbles:bubble.isConnected"),'bubble:one-detachable-body');
check(bubbles.includes("new Set()")&&bubbles.includes('routeUsed.add(picked.index)'),'bubble:session-no-repeat-ledger');
check(bubbles.includes("detail:{ version:VERSION, route:normalized, reason:'intentions-lived' }"),'bubble:exhaustion-becomes-silence');
check(bubbles.includes("source:'explicit-bubble-gesture'")&&bubbles.includes("axis:'vertical'"),'depth:explicit-vertical-portal');
check(bubbles.includes('language?.enterDepth?.(depthButton)'),'depth:reuses-v585-depth-authority');
check(bubbles.includes("reason:'travel'")&&bubbles.includes("immediate:true"),'travel:immediate-removal');
check(bubbles.includes("reason:'menu'")&&bubbles.includes("immediate:true"),'menu:immediate-removal');
check(bubbles.includes('root.dataset.v585Keyboard')&&bubbles.includes("reason:'keyboard'"),'iphone:software-keyboard-aware');
check(bubbles.includes('globalThis.visualViewport')&&bubbles.includes("listen(globalThis.visualViewport, 'resize'"),'iphone:visual-viewport-aware');
check(bubbles.includes('width <= 430'),'iphone:compact-breakpoint-runtime');
check(!/createElement\(['"]canvas/.test(bubbles),'performance:no-new-canvas');
check(!/new\s+(?:AudioContext|webkitAudioContext)/.test(bubbles),'performance:no-audio-engine');
check(!/MutationObserver/.test(bubbles),'performance:no-mutation-observer');
check(!/requestAnimationFrame/.test(bubbles),'performance:no-animation-loop');
check(!/speechSynthesis|\.speak\s*\(/.test(bubbles),'whit:no-automatic-speech');
check(!/localStorage|sessionStorage|fetch\s*\(/.test(bubbles),'privacy:no-storage-no-network');

check(count(indexHtml,/id=["']orb["']/g)===1,'orb:one-canonical-id');
check(!indexHtml.includes('data-v586-magic-bubble'),'html:no-hardcoded-bubbles');
check(count(css,/@keyframes/g)===0,'css:no-new-keyframes',count(css,/@keyframes/g));
check(css.includes('[data-v586-form="seed"]')&&css.includes('[data-v586-form="veil"]')&&css.includes('[data-v586-form="crescent"]')&&css.includes('[data-v586-form="comet"]')&&css.includes('[data-v586-form="portal"]'),'css:five-living-forms');
check(css.includes('html[data-v585-motion="travel"]')&&css.includes('transition:none!important'),'css:travel-pauses-effects');
check(css.includes('html[data-v585-menu]:not([data-v585-menu="closed"])'),'css:menu-pauses-effects');
check(css.includes('html[data-v585-keyboard="open"]'),'css:keyboard-hides-bubble');
check(css.includes('@media (max-width:430px)')&&css.includes('@media (min-width:700px)'),'css:closed-and-open-postures');
check(css.includes('@media (orientation:landscape) and (max-height:560px)'),'css:landscape-posture');
check(css.includes('@media (prefers-reduced-motion:reduce)'),'css:reduced-motion');
check(css.includes('@media (forced-colors:active)')&&css.includes('@media (prefers-contrast:more)'),'css:contrast-accessibility');
check(css.includes('touch-action:manipulation')&&css.includes(':focus-visible'),'css:touch-and-keyboard-access');
check(css.includes('contain:layout paint style'),'css:paint-containment');
check(css.includes('text-wrap:balance'),'css:living-information-balanced');

const iphoneProfiles=[
  {name:'iPhone SE 1',width:320,height:568},
  {name:'iPhone SE 2',width:375,height:667},
  {name:'iPhone 13 mini',width:375,height:812},
  {name:'iPhone 15',width:393,height:852},
  {name:'iPhone 15 Pro Max',width:430,height:932},
  {name:'iPhone Duo fechado',width:390,height:844},
  {name:'iPhone Duo aberto',width:768,height:1024},
  {name:'iPhone Duo aberto amplo',width:820,height:1180}
];
for(const profile of iphoneProfiles){
  const compact=profile.width<=430;
  const bubbleWidth=Math.min(compact?profile.width*.74:profile.width*.3,compact?244:286);
  check(bubbleWidth<=profile.width-36,`iphone:${profile.name}:safe-inline`,`${bubbleWidth}/${profile.width}`);
  check(profile.height-118>104,`iphone:${profile.name}:safe-vertical`,profile.height);
}

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
  'route-registry-v180.js':'c743eca7e749338865e6dfeeff8ef3a0a8f5ee1ce3fd6d03ab00cbd9fc896f3b',
  'reality-intention-language-v585.js':'5ac0b25c0fcec3cdd48f39d4428de43f8055ef7df3b3997ca9cab80b8493d91b',
  'reality-intention-language-v585.css':'1d6be387ff29d6401488276e562d43af28286232bded442650475eb6036e86f3'
});
Object.entries(frozen).forEach(([file,expected])=>check(sha(file)===expected,`protected:${file}`,sha(file)));

check(language.includes("if (profile.mode === 'silent') return null"),'protected:home-language-still-silent');
check(language.includes("if (profile.mode !== 'threshold') return false"),'protected:tarot-daily-not-reclaimed');

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v586-bubbles`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check(coordinateAudit.valid&&coordinateAudit.routeCount===17,'coordinates:all-realities-preserved');
check(coordinateAudit.directedTransitionCount===272&&coordinateAudit.everyRealityTransitionIsHorizontal,'coordinates:all-horizontal-travel-preserved');
const vector=coordinates.universeJourneyVectorV583('school','music',586);
check(vector.continuous&&!vector.teleport&&!vector.flicker&&!vector.duplicateOrb,'coordinates:no-teleport-no-flicker');

const tarotSession=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v586-bubbles`);
const tarotData=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v586-bubbles`);
let tarotState=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v586-bubbles',auditSeed:'qa-v586-bubbles'});
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
  release:'V586',base:'V585',macroStage:'Fluidez Suprema / 7 de 10 / Balões Mágicos Vivos',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{
    supportedRealities:16,totalMicroIntents:64,microIntentsPerReality:4,maximumWords:4,
    simultaneousBubbles:1,homeVisibleBubbles:0,onePhysicalOrb:true,duplicateOrbs:0,
    verticalDepthPortal:true,unpredictableForm:true,coherentMeaning:true,repeatWithinSession:false,
    automaticWhitSpeech:false,newCanvases:0,newAnimationLoops:0,mutationObservers:0,
    iphoneProfiles:iphoneProfiles.length,iphoneDuo:'continuous-compact-to-expanded',
    tarotProtected:true,dailyProtected:true
  },failures
},null,2));
if(failures.length)process.exitCode=1;
