/* DIVINA BRUXA — ORBE SUPREMA 2.0 · MACROETAPA 2 · QA V577 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const failures=[]; let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});

const routes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
const functionalRoutes=['tarot','daily','library','school','ai','journal'];
const files=['index.html','app-v208.js','page-loader-v1.js','orb-persistent-journey-v565.js','orb-universal-presence-v526.js','orb-universal-presence-v526.css','sw.js','tarot-livre-orbe-os-v517.js'];
files.forEach(file=>check(fs.existsSync(path.join(root,file)),`file:${file}`));

const index=read('index.html');
const app=read('app-v208.js');
const loader=read('page-loader-v1.js');
const journey=read('orb-persistent-journey-v565.js');
const presence=read('orb-universal-presence-v526.js');
const presenceCss=read('orb-universal-presence-v526.css');
const sw=read('sw.js');
const truth=read('world-truth-registry-v535.js');

routes.forEach(route=>check(new RegExp(`id:'${route}'`).test(truth),`truth:${route}`));
const criticalBlock=loader.slice(loader.indexOf('const ARRIVAL_CRITICAL_ROUTES_V577'),loader.indexOf('const PORTAL_STYLES_ID'));
functionalRoutes.forEach(route=>check(criticalBlock.includes(`'${route}'`),`prepare-before-commit:${route}`));
check(!['spreads','store','consultations','subscriptions','skins','videos','music','notifications','admin'].some(route=>criticalBlock.includes(`'${route}'`)),'loader:secondary-content-does-not-block-route');
check(loader.includes('ARRIVAL_CRITICAL_ROUTES_V577'),'loader:universal-gate');
check(loader.includes('return load(id).then'),'loader:world-before-commit');
check(presence.includes("anchor.dataset.orbPhysicalHostV577 = 'true'"),'presence:created-is-physical-host');
check(presence.includes("node.dataset.orbPhysicalHostV577 = 'true'"),'presence:existing-is-physical-host');
check(presence.includes("physicalLandingModel:'one-orb-every-route-v577'"),'presence:runtime-truth');
check(presenceCss.includes('[data-orb-physical-authority="living"] > :not([data-supreme-orb="living"])'),'presence:no-visible-double');
check(journey.includes("authority:'single-physical-orb-universal-v577'"),'journey:universal-authority');
check(journey.includes("anchor.append(orb)"),'journey:physical-settle');
check(journey.includes('this.physicalAuthorityHost?.contains?.(orb)'),'journey:late-claim-starts-from-real-host');
check(journey.includes("teleportFallback:false"),'journey:no-teleport-fallback');
check(journey.includes("travelerCopies:0"),'journey:no-copy');
check(app.includes("./orb-persistent-journey-v565.js?v=577-universal"),'cache:app-journey-v577');
check(app.includes("./orb-universal-presence-v526.js?v=577-universal"),'cache:app-presence-v577');
check(app.includes("./page-loader-v1.js?v=577-universal"),'cache:app-loader-v577');
check(index.includes('app-v208.js?v=577'),'cache:index-v577');
check(index.includes("divina.sw.reload.v577")&&!index.includes("divina.sw.reload.v576"),'cache:inline-reload-v577');
check(index.includes("./sw.js?v=577")&&index.includes('version:577'),'cache:inline-worker-v577');
check(sw.includes('const VERSION=577;')&&sw.includes('divina-bruxa-v577-shell'),'cache:worker-v577');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V577')&&sw.includes('orb-universal-presence-v526'),'cache:universal-engine-network-first');
check(sw.includes('/app-v208\\.js\\?v=577/'),'cache:shell-validator-v577');

// O Tarot Livre aprovado fica congelado byte a byte nesta macroetapa.
check(sha('tarot-livre-orbe-os-v517.js')==='c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51','regression:tarot-v576-frozen');

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+'?qa=v577');
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+'?qa=v577');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v577-tarot',auditSeed:'qa-v577-tarot-seed'});
const firstReveal=session.drawNextCard(tarotState,{now:()=>2});
tarotState=firstReveal.state;
check(firstReveal.cardId!==null&&tarotState.revealed.length===1&&tarotState.waiting.length===77,'regression:tarot-first-reveal');
check(CARDS[firstReveal.cardId]?.orientation==='normal'&&session.isValidTarotState(tarotState),'regression:tarot-first-card-direct-valid');

class FakeNode {
  constructor(id,screen=null,physical=true){this.id=id;this.screen=screen;this.dataset={};this.children=[];this.parentNode=null;this.isConnected=true;this.hidden=false;this.physical=physical;this.attributes=new Map();}
  append(node){if(node.parentNode)node.parentNode.children=node.parentNode.children.filter(child=>child!==node);node.parentNode=this;this.children.push(node);}
  contains(node){return node===this||this.children.some(child=>child===node||child.contains?.(node));}
  closest(selector){if(selector==='.screen'||selector==='[data-screen]')return this.screen;if(selector.includes('.screen'))return this.screen;return null;}
  matches(){return this.physical;}
  removeAttribute(name){this.attributes.delete(name);if(name==='data-orb-physical-authority')delete this.dataset.orbPhysicalAuthority;if(name==='data-orb-physical-landing')delete this.dataset.orbPhysicalLanding;}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
}

globalThis.document={
  documentElement:{dataset:{},setAttribute(){},removeAttribute(){},clientWidth:390,clientHeight:844},
  dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]}
};
globalThis.CustomEvent=class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}};
globalThis.matchMedia=()=>({matches:false});

const {OrbPersistentJourneyV565}=await import(pathToFileURL(path.join(root,'orb-persistent-journey-v565.js')).href+'?qa=v577');
const orb=new FakeNode('orb');
const stage=new FakeNode('journeyStage'); stage.append(orb);
const probe=Object.create(OrbPersistentJourneyV565.prototype);
Object.assign(probe,{
  core:{orb,claimedHost:null,renderer:{resize(){}},returnHome(){return true;}},
  route:'home',root:{hidden:false},stage,current:{x:195,y:300},scale:1,sourceSize:88,
  landingHost:null,landingAnchor:null,physicalAuthorityHost:null,physicalHostSnapshots:new WeakMap(),
  clearLandingAnchor(){this.landingAnchor=null;},
  resolveDestination(){return null;},placeStage(){return true;}
});

for(const route of routes.filter(route=>route!=='home')){
  const screen={id:route,dataset:{screen:route}};
  const host=new FakeNode(`${route}Host`,screen,true);
  stage.append(orb);
  const destination={node:host,x:195,y:320,width:88,height:88};
  const settled=probe.settlePhysicalOrb(route,destination);
  check(settled&&host.contains(orb),`physical:${route}`);
  check(probe.physicalAuthorityHost===host&&document.documentElement.dataset.orbPhysicalAuthority===route,`authority:${route}`);
  check([stage,host].filter(node=>node.contains(orb)).length===1,`one-body:${route}`);
}

const semanticScreen={id:'library',dataset:{screen:'library'}};
const semanticHost=new FakeNode('semanticHost',semanticScreen,true);
semanticHost.setAttribute('role','button');semanticHost.setAttribute('tabindex','0');semanticHost.setAttribute('aria-label','Orbe da Biblioteca');
semanticHost.append(orb);probe.setPhysicalAuthority(semanticHost,'library');
check(semanticHost.getAttribute('role')==='presentation'&&semanticHost.getAttribute('tabindex')===null,'a11y:only-living-orb-focusable');
probe.clearPhysicalAuthority(semanticHost);
check(semanticHost.getAttribute('role')==='button'&&semanticHost.getAttribute('tabindex')==='0'&&semanticHost.getAttribute('aria-label')==='Orbe da Biblioteca','a11y:semantic-host-restored');

const total=passed+failures.length;
const report={release:'V577',macroStage:'Orbe Suprema 2.0 / Macroetapa 2',state:failures.length?'FAIL':'PASS',passed,total,failures};
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
