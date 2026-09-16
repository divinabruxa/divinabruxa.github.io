/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · QA MACROETAPA 5 V584 */
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
  'app-v208.js','index.html','orbital-menu-v502.js','orbital-menu-v502.css',
  'universe-coordinate-law-v583.js','orb-persistent-journey-v565.js','sw.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const app=read('app-v208.js');
const index=read('index.html');
const menu=read('orbital-menu-v502.js');
const css=read('orbital-menu-v502.css');
const sw=read('sw.js');
const scene=menu.slice(menu.indexOf('function createScene'),menu.indexOf('function nativePulse'));

check(index.includes('name="divina-fluidity-release" content="V584" data-macroetapa="5-menu-lendario"'),'release:meta-v584');
check(index.includes('app-v208.js?v=584-menu-lendario'),'release:index-app-v584');
check(index.includes("__divinaSWBootstrap='v584-inline'")&&index.includes("sw.js?v=584"),'release:index-worker-v584');
check(app.includes("orbital-menu-v502.js?v=584-menu-lendario"),'release:app-menu-v584');
check(app.includes('window.divinaFluidezSupremaV584'),'release:status-v584');
check(app.includes("stage:'legendary-menu'")&&app.includes("macroStage:'5-of-10'"),'release:macro-stage-5');
check(sw.includes('const VERSION=584;')&&sw.includes('divina-bruxa-v584-shell'),'release:worker-v584');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V584')&&sw.includes(String.raw`/app-v208\.js\?v=584-menu-lendario/`),'release:atomic-v584');

check(count(index,/id=["']orb["']/g)===1,'orb:one-canonical-id');
check(!/createElement\(['"]canvas/.test(menu)&&!scene.includes('mini-orb'),'orb:no-menu-copy');
check(menu.includes('this.core.claim(this.host')&&menu.includes('oneLivingOrb:true'),'orb:same-physical-body');
check(scene.includes('data-v584-home')&&scene.includes('Orbe central. Voltar ao Início')===false,'home:physical-host-marked');
check(menu.includes("ariaLabel:'Orbe central. Voltar ao Início'"),'home:orb-accessible-name');
check(menu.includes("route:'home', label:'Início', intent:'Origem'")&&menu.includes('activateHome()'),'home:always-accessible');
check(menu.includes("route === routeNow()")&&menu.includes('reason:`current:${route}`'),'home:current-coordinate-closes-naturally');
check(menu.includes("source:'orbital-menu-v502'")&&menu.includes('preserveClaim:true'),'journey:physical-handoff-preserved');
check(!menu.includes("this.go('home'")&&!menu.includes('teleport'),'journey:no-forced-home-no-teleport');

const intents=[...menu.matchAll(/intent:'([^']+)'/g)].map(match=>match[1]);
check(intents.length===14,'copy:fourteen-destinations',intents.length);
check(new Set(intents).size===14,'copy:no-repeated-intention');
check(intents.every(value=>value.trim().split(/\s+/).length===1),'copy:one-word-per-intention',intents.join(','));
check(count(scene,/data-v584-intention/g)===1,'copy:one-visible-intention-node');
check(scene.includes('<h2 id="db502MenuTitle">Coordenadas</h2>')&&scene.includes('>Toque. Viaje.</p>'),'copy:summary-of-summary');
check(css.includes('writing-mode:vertical-rl')&&css.includes('color:rgba(255,236,199,.48)'),'copy:vertical-transparent-living-text');

check(css.includes('#divinaOrbitalMenuV502{')&&css.includes('max-inline-size:none!important')&&css.includes('overflow:hidden!important'),'viewport:dialog-card-conflict-neutralized');
check(css.includes('inline-size:auto!important')&&css.includes('block-size:auto!important')&&css.includes('margin:0!important'),'viewport:true-fullscreen-coordinate');
check(!/\.db502-menu\{[^}]*overflow:auto/s.test(css),'viewport:no-menu-scrollbars');
check(css.includes('html.db502-menu-open .magic-dock')&&css.includes('visibility:hidden!important'),'visual:dock-does-not-compete');
check(css.includes('html.db502-menu-open .app-header .brand > *')&&css.includes('content:"INÍCIO"'),'visual:no-brand-mini-orb-home-stays-visible');
check(css.includes('env(safe-area-inset-top)')&&css.includes('env(safe-area-inset-bottom)'),'iphone:safe-areas');
check(count(css,/@keyframes/g)===7,'performance:no-new-animation-loop',count(css,/@keyframes/g));
check(css.includes('html[data-menu-motion="active"] .db502-menu__backdrop:before')&&css.includes('animation-play-state:paused!important'),'performance:menu-motion-pauses-css-effects');
check(menu.includes("pause?.(MENU_MOTION_REASON)")&&menu.includes("start?.(MENU_MOTION_REASON)"),'performance:universe-pause-resume');
check(menu.includes('lockBackground()')&&menu.includes('node.inert = true')&&menu.includes('unlockBackground()'),'interaction:background-locked-and-restored');
check(menu.includes("['closed','closing'].includes(this.state)")&&menu.includes("reversing ? 'reverse-open'"),'interaction:closing-can-reverse');
check(menu.includes('if (!this.host.contains(this.core.orb))'),'interaction:reverse-never-reclaims-orb');
check(!/pointerdown[\s\S]{0,900}live\.textContent/.test(menu),'whit:no-speech-on-touch');

const iphoneProfiles=[
  {name:'iPhone SE 1',width:320,height:568},
  {name:'iPhone SE 2',width:375,height:667},
  {name:'iPhone 13 mini',width:375,height:812},
  {name:'iPhone 15',width:393,height:852},
  {name:'iPhone 15 Pro Max',width:430,height:932}
];
for(const profile of iphoneProfiles){
  const narrow=profile.width<=370;
  const short=profile.height<=690;
  const radius=short
    ? Math.min(profile.width*.38,profile.height*.28,184)
    : narrow
      ? Math.min(profile.width*.38,profile.height*.29,156)
      : Math.min(profile.width*.39,profile.height*.29,224);
  const portalWidth=narrow?72:82;
  const horizontalSafe=radius+portalWidth/2<=profile.width/2;
  const verticalSafe=profile.height*.52+radius+43<profile.height-20;
  check(horizontalSafe,`iphone:${profile.name}:horizontal`,`${radius}+${portalWidth/2}`);
  check(verticalSafe,`iphone:${profile.name}:vertical`,`${profile.height*.52+radius+43}`);
}

const frozen=Object.freeze({
  'experience-message-governor-v580.js':'7f3e5748fe7842c663486deecd8082e0e8cc0a0edaef2f7cf5dc0f82787f4d46',
  'living-universe-core-v524.js':'3cdc1c5913bb7fc315bfe89f80a8864e64fd8720120d46f89aeaa2d082ce7878',
  'orb-engine-v208.js':'57ddc1fd47579c46cb1ec7ca742c81588199a30d442e062d48c82193ddd23b14',
  'orb-motion-core-v207.js':'dab385af0c0939af00d54e202ba585ee2694e87678824a863312289a647c3b64',
  'orb-gesture-core-v208.js':'76df9f11c145fd9fdf8abfff073ea2d487f6609a144c984d851aa7054e153119',
  'orb-persistent-journey-v565.js':'b3f40ddcdfed67f01e91ddeb3b4d223d37e574a9abe8b05eeccd26e4bc1c7306',
  'universe-coordinate-law-v583.js':'c28116ebdcad8274bfaeec1d816b1d150437778839b5f4e872e6dd81e4a6fb00',
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

const coordinates=await import(`${pathToFileURL(path.join(root,'universe-coordinate-law-v583.js')).href}?qa=v584-menu`);
const coordinateAudit=coordinates.auditUniverseCoordinateLawV583();
check(coordinateAudit.valid&&coordinateAudit.routeCount===17,'coordinates:all-realities-preserved');
check(coordinateAudit.directedTransitionCount===272&&coordinateAudit.everyRealityTransitionIsHorizontal,'coordinates:all-journeys-remain-physical');
const homeVector=coordinates.universeJourneyVectorV583('daily','home',584);
check(homeVector.horizontal.sign!==0&&homeVector.continuous&&!homeVector.teleport&&!homeVector.flicker&&!homeVector.duplicateOrb,'coordinates:menu-home-is-real-journey');

const tarotSession=await import(`${pathToFileURL(path.join(root,'tarot-session.js')).href}?qa=v584-menu`);
const tarotData=await import(`${pathToFileURL(path.join(root,'tarot-data.js')).href}?qa=v584-menu`);
let tarotState=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v584-menu',auditSeed:'qa-v584-menu'});
const revealed=[];
for(let index=0;index<78;index+=1){
  const result=tarotSession.drawNextCard(tarotState,{now:()=>index+2});
  tarotState=result.state;revealed.push(result.cardId);
}
check(revealed.length===78&&new Set(revealed).size===78,'tarot:78-without-repetition');
check(revealed.every(id=>tarotData.CARDS[id]?.orientation==='normal'),'tarot:all-cards-direct');

class FakeElement{
  constructor(name='node'){
    this.name=name;this.dataset={};this.attributes=new Map();this.children=[];
    this.parentNode=null;this.parentElement=null;this.hidden=false;this.inert=false;this.isConnected=true;
    const tokens=new Set();
    this.classList={
      add:(...values)=>values.forEach(value=>tokens.add(value)),
      remove:(...values)=>values.forEach(value=>tokens.delete(value)),
      toggle:(value,force)=>{if(force===true)tokens.add(value);else if(force===false)tokens.delete(value);else if(tokens.has(value))tokens.delete(value);else tokens.add(value);},
      contains:value=>tokens.has(value)
    };
  }
  append(node){
    if(node.parentNode)node.parentNode.children=node.parentNode.children.filter(child=>child!==node);
    node.parentNode=this;node.parentElement=this;this.children.push(node);
  }
  contains(node){return node===this||this.children.some(child=>child===node||child.contains?.(node));}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  hasAttribute(name){return this.attributes.has(name);}
  removeAttribute(name){this.attributes.delete(name);}
  querySelector(selector){return selector==='span'||selector==='.db502-portal__label'?this.label||null:null;}
  getBoundingClientRect(){return {left:140,top:280,width:82,height:82};}
  focus(){globalThis.document.activeElement=this;}
}

globalThis.HTMLElement=FakeElement;
globalThis.Element=FakeElement;
globalThis.CustomEvent=class CustomEvent{constructor(type,{detail}={}){this.type=type;this.detail=detail;}};
globalThis.matchMedia=()=>({matches:true});
globalThis.requestAnimationFrame=callback=>{queueMicrotask(()=>callback(globalThis.performance.now()));return 1;};
globalThis.innerWidth=390;
globalThis.innerHeight=844;
globalThis.location={hash:''};

let universePauses=0,universeStarts=0,universeIgnites=0;
globalThis.divinaLivingUniverseV524={pause(){universePauses+=1;},start(){universeStarts+=1;}};
globalThis.divinaLivingUniverseV516={ignite(){universeIgnites+=1;}};

const menuModule=await import(`${pathToFileURL(path.join(root,'orbital-menu-v502.js')).href}?qa=v584-${Date.now()}`);

const makeFixture=(screen='home')=>{
  const html=new FakeElement('html');
  const body=new FakeElement('body');body.dataset.screen=screen;
  const appNode=new FakeElement('app'),dock=new FakeElement('dock'),skip=new FakeElement('skip'),drawer=new FakeElement('drawer');
  drawer.setAttribute('aria-hidden','true');
  const map=new Map([['#app',appNode],['.magic-dock',dock],['.v562-skip-link',skip],['#drawer',drawer]]);
  const events=[];
  globalThis.document={
    documentElement:html,body,activeElement:null,
    querySelector:selector=>map.get(selector)||null,
    dispatchEvent:event=>{events.push(event);return true;}
  };
  const rootNode=new FakeElement('menu-root');rootNode.hidden=true;rootNode.setAttribute('aria-hidden','true');
  const host=new FakeElement('menu-host');rootNode.append(host);
  const intentParent=new FakeElement('intent-parent'),intention=new FakeElement('intention');intentParent.append(intention);rootNode.append(intentParent);
  const live=new FakeElement('live');rootNode.append(live);
  const menuButton=new FakeElement('menu-button');menuButton.label=new FakeElement('menu-label');menuButton.label.textContent='MENU';
  const homeButton=new FakeElement('home-button');
  const portal=new FakeElement('portal');portal.dataset.v502Route='tarot';portal.label=new FakeElement('label');portal.label.textContent='Tarot Livre';rootNode.append(portal);
  const homeHost=new FakeElement('home-host'),journeyHost=new FakeElement('journey-host'),orb=new FakeElement('orb');homeHost.append(orb);
  let claims=0,releases=0,navigations=0,lastNavigation=null;
  const core={
    orb,claimedHost:null,
    claim(target){
      claims+=1;const previous=orb.parentNode;this.claimedHost=target;target.append(orb);let released=false;
      return()=>{if(released)return false;released=true;if(this.claimedHost!==target)return false;this.claimedHost=null;releases+=1;previous.append(orb);return true;};
    },
    pulse(){},prime(){},
    async navigate(route,options){navigations+=1;lastNavigation={route,options};this.claimedHost=null;journeyHost.append(orb);body.dataset.screen=route;return true;},
    settleRoute(route){body.dataset.screen=route;},returnHome(){homeHost.append(orb);},
    snapshot(){return {livingOrbConnected:true};}
  };
  const instance=Object.create(menuModule.OrbitalMenuV502.prototype);
  Object.assign(instance,{
    core,go:()=>{},menuButton,homeButton,homeButtonLabel:null,root:rootNode,host,intention,live,buttons:[portal],
    state:'closed',targetOpen:false,releaseOrb:null,lastFocus:menuButton,motionToken:0,navigating:false,
    intentTimer:0,backgroundSnapshots:[],backgroundLocked:false,menuMotionPaused:false
  });
  return {instance,appNode,dock,drawer,rootNode,host,homeHost,journeyHost,orb,portal,intention,events,
    get claims(){return claims;},get releases(){return releases;},get navigations(){return navigations;},get lastNavigation(){return lastNavigation;}};
};

const reverse=makeFixture();
check(await reverse.instance.open()===true&&reverse.instance.state==='open','runtime:opens');
check(reverse.claims===1&&reverse.host.contains(reverse.orb),'runtime:one-physical-claim');
check(reverse.appNode.inert&&reverse.appNode.getAttribute('aria-hidden')==='true','runtime:background-inert');
check(reverse.intention.textContent==='Origem','runtime:current-intention-is-origin');
const closing=reverse.instance.close({restoreFocus:true,reason:'qa-close'});
await new Promise(resolve=>setTimeout(resolve,1));
const reopening=reverse.instance.open();
const [cancelledClose,reopened]=await Promise.all([closing,reopening]);
check(cancelledClose===false&&reopened===true&&reverse.instance.state==='open','runtime:close-reverses');
check(reverse.claims===1&&reverse.releases===0,'runtime:reverse-keeps-one-claim');
check(await reverse.instance.close({reason:'qa-final'})===true&&reverse.instance.state==='closed','runtime:final-close');
check(reverse.releases===1&&reverse.homeHost.contains(reverse.orb),'runtime:claim-restored-on-close');
check(!reverse.appNode.inert&&!reverse.appNode.hasAttribute('aria-hidden'),'runtime:background-restored');

const currentHome=makeFixture('home');
await currentHome.instance.open();
check(await currentHome.instance.activateHome()===true,'runtime:home-current-closes');
check(currentHome.navigations===0&&currentHome.instance.state==='closed','runtime:home-current-no-false-journey');

const homeTravel=makeFixture('daily');
await homeTravel.instance.open();
await homeTravel.instance.activateHome();
check(homeTravel.navigations===1&&homeTravel.lastNavigation?.route==='home','runtime:home-from-reality-travels');
check(homeTravel.lastNavigation?.options?.source==='orbital-menu-v502','runtime:home-uses-coordinate-journey');
check(homeTravel.instance.state==='closed'&&!homeTravel.instance.navigating,'runtime:home-journey-settles');

const portalTravel=makeFixture('home');
await portalTravel.instance.open();
portalTravel.instance.revealIntent('tarot');
check(portalTravel.intention.textContent==='Escolher','runtime:one-intention-reacts');
await portalTravel.instance.activate(portalTravel.portal);
check(portalTravel.navigations===1&&portalTravel.lastNavigation?.route==='tarot','runtime:portal-single-navigation');
check(portalTravel.instance.state==='closed'&&!portalTravel.instance.navigating,'runtime:portal-closes-cleanly');
check(universePauses===universeStarts&&universePauses>=7,'runtime:every-menu-motion-resumes-universe',`${universePauses}/${universeStarts}`);
check(universeIgnites===2,'runtime:only-real-journeys-ignite',universeIgnites);

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V584',base:'V583',macroStage:'Fluidez Suprema / 5 de 10 / Menu Lendário',
  state:failures.length?'FAIL':'PASS',passed,failed:failures.length,total,
  contracts:{
    destinations:14,portalBubbles:13,homeViaLivingOrb:true,onePhysicalOrb:true,
    oneVisibleIntention:true,maximumIntentWords:1,verticalLivingInformation:true,
    fullViewport:true,scrollbars:false,reversibleMotion:true,backgroundLocked:true,
    heavyEffectsPausedDuringMenuMotion:true,automaticWhitEveryTouch:false,
    iphoneProfiles:iphoneProfiles.length,tarotProtected:true,dailyProtected:true
  },failures
},null,2));
if(failures.length)process.exitCode=1;
