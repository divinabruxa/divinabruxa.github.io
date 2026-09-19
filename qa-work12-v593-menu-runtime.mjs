/* DIVINA BRUXA — WORK12 · QA RUNTIME · MENU LENDÁRIO V593 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});

class TestCustomEvent extends Event{
  constructor(type,options={}){super(type,options);this.detail=options.detail;}
}

class FakeElement{
  constructor(name='node'){
    this.name=name;
    this.dataset={};
    this.attributes=new Map();
    this.children=[];
    this.parentNode=null;
    this.parentElement=null;
    this.hidden=false;
    this.inert=false;
    this.isConnected=true;
    this.textContent='';
    this.label=null;
    const tokens=new Set();
    this.classList={
      add:(...values)=>values.forEach(value=>tokens.add(value)),
      remove:(...values)=>values.forEach(value=>tokens.delete(value)),
      toggle:(value,force)=>{
        if(force===true)tokens.add(value);
        else if(force===false)tokens.delete(value);
        else if(tokens.has(value))tokens.delete(value);
        else tokens.add(value);
      },
      contains:value=>tokens.has(value)
    };
    const styles=new Map();
    this.style={setProperty:(name,value)=>styles.set(name,String(value)),removeProperty:name=>styles.delete(name),getPropertyValue:name=>styles.get(name)||''};
  }
  append(node){
    if(node.parentNode)node.parentNode.children=node.parentNode.children.filter(child=>child!==node);
    node.parentNode=this;
    node.parentElement=this;
    this.children.push(node);
  }
  contains(node){return node===this||this.children.some(child=>child===node||child.contains?.(node));}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  hasAttribute(name){return this.attributes.has(name);}
  removeAttribute(name){this.attributes.delete(name);}
  querySelector(selector){
    if(selector==='span'||selector==='.db502-portal__label')return this.label||null;
    return null;
  }
  getBoundingClientRect(){return {left:110,top:270,width:120,height:104};}
  focus(){globalThis.document.activeElement=this;}
  remove(){
    if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(child=>child!==this);
    this.parentNode=null;this.parentElement=null;this.isConnected=false;
  }
}

class FakeDocument extends EventTarget{
  constructor(){
    super();
    this.documentElement=new FakeElement('html');
    this.body=new FakeElement('body');
    this.body.dataset.screen='home';
    this.activeElement=null;
    this.selectorNodes=new Map();
  }
  querySelector(selector){return this.selectorNodes.get(selector)||null;}
}

globalThis.HTMLElement=FakeElement;
globalThis.Element=FakeElement;
globalThis.CustomEvent=TestCustomEvent;
globalThis.matchMedia=()=>({matches:true});
globalThis.requestAnimationFrame=callback=>{queueMicrotask(()=>callback(globalThis.performance.now()));return 1;};
globalThis.innerWidth=390;
globalThis.innerHeight=844;
globalThis.location={hash:''};

let universePauses=0;
let universeStarts=0;
let universeIgnites=0;
globalThis.divinaLivingUniverseV524={pause(){universePauses+=1;},start(){universeStarts+=1;}};
globalThis.divinaLivingUniverseV516={ignite(){universeIgnites+=1;}};

const menuModule=await import(`${pathToFileURL(path.join(root,'orbital-menu-v502.js')).href}?qa=v593-runtime-${Date.now()}`);
const ROUTES=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];

function makeFixture(screen='home'){
  const documentTarget=new FakeDocument();
  globalThis.document=documentTarget;
  documentTarget.body.dataset.screen=screen;
  const appNode=new FakeElement('app');
  const dock=new FakeElement('dock');
  const skip=new FakeElement('skip');
  const drawer=new FakeElement('drawer');
  drawer.setAttribute('aria-hidden','true');
  documentTarget.selectorNodes.set('#app',appNode);
  documentTarget.selectorNodes.set('.magic-dock',dock);
  documentTarget.selectorNodes.set('.v562-skip-link',skip);
  documentTarget.selectorNodes.set('#drawer',drawer);

  const rootNode=new FakeElement('menu-root');
  rootNode.hidden=true;
  rootNode.setAttribute('aria-hidden','true');
  const host=new FakeElement('menu-host');
  rootNode.append(host);
  const intentParent=new FakeElement('intent-parent');
  const intention=new FakeElement('intention');
  intentParent.append(intention);
  rootNode.append(intentParent);
  const live=new FakeElement('live');
  rootNode.append(live);
  const buttons=ROUTES.map(route=>{
    const button=new FakeElement(`intent-${route}`);
    button.dataset.v502Route=route;
    button.label=new FakeElement(`label-${route}`);
    button.label.textContent=route;
    button.setAttribute('aria-label',route);
    rootNode.append(button);
    return button;
  });
  const menuButton=new FakeElement('sopro-button');
  menuButton.label=new FakeElement('sopro-label');
  menuButton.label.textContent='SOPRO';
  const homeButton=new FakeElement('origin-button');
  const homeHost=new FakeElement('home-host');
  const journeyHost=new FakeElement('journey-host');
  const orb=new FakeElement('orb');
  homeHost.append(orb);

  let claims=0;
  let releases=0;
  let navigations=0;
  let lastNavigation=null;
  const core={
    orb,claimedHost:null,
    claim(target){
      claims+=1;
      const previous=orb.parentNode;
      this.claimedHost=target;
      target.append(orb);
      let released=false;
      return()=>{
        if(released)return false;
        released=true;
        if(this.claimedHost!==target)return false;
        this.claimedHost=null;
        releases+=1;
        previous.append(orb);
        return true;
      };
    },
    pulse(){},prime(){},
    async navigate(route,options){
      navigations+=1;
      lastNavigation={route,options};
      this.claimedHost=null;
      journeyHost.append(orb);
      documentTarget.body.dataset.screen=route;
      return true;
    },
    settleRoute(route){documentTarget.body.dataset.screen=route;},
    returnHome(){homeHost.append(orb);},
    snapshot(){return {livingOrbConnected:true,oneLivingOrb:true,entityPreserved:true};}
  };

  const instance=Object.create(menuModule.OrbitalMenuV502.prototype);
  Object.assign(instance,{
    core,go:()=>{},menuButton,homeButton,homeButtonLabel:null,legacy:null,dockOrb:null,
    root:rootNode,host,intention,live,buttons,state:'closed',bubbleState:'dormant',targetOpen:false,
    releaseOrb:null,lastFocus:menuButton,motionToken:0,cycleToken:0,frameIndex:0,visibleButtons:[],
    navigating:false,cycleBusy:false,intentTimer:0,gesture:null,suppressSkyClickUntil:0,
    backgroundSnapshots:[],backgroundLocked:false,motionLocks:new Set(),menuMotionPaused:false
  });
  return {
    instance,documentTarget,appNode,dock,drawer,rootNode,host,homeHost,journeyHost,orb,buttons,intention,live,
    get claims(){return claims;},get releases(){return releases;},get navigations(){return navigations;},get lastNavigation(){return lastNavigation;}
  };
}

const progressive=makeFixture('home');
progressive.instance.targetOpen=true;
progressive.instance.state='open';
progressive.rootNode.hidden=false;
progressive.instance.setFrame(0,{reason:'qa-start'});
const discovered=new Set();
const frameSizes=[];
for(let frameIndex=0;frameIndex<8;frameIndex+=1){
  const routes=progressive.instance.visibleRoutes();
  frameSizes.push(routes.length);
  routes.forEach(route=>discovered.add(route));
  if(frameIndex<7)check(`cycle:frame-${frameIndex+1}`,await progressive.instance.cycleIntentions(1,{reason:'qa-cycle'}));
}
check('cycle:maximum-two',frameSizes.every(size=>size>=1&&size<=2),frameSizes.join(','));
check('cycle:all-fifteen-discovered',discovered.size===15,[...discovered].join(','));
check('cycle:last-frame-silent-one',frameSizes.at(-1)===1,frameSizes.at(-1));
check('cycle:wraps',await progressive.instance.cycleIntentions(1,{reason:'qa-wrap'}));
check('cycle:returns-first-pair',progressive.instance.visibleRoutes().join(',')==='tarot,daily',progressive.instance.visibleRoutes().join(','));
check('cycle:breath-after-arrival',progressive.instance.bubbleState==='breath',progressive.instance.bubbleState);
check('cycle:no-more-than-two-interactive',progressive.buttons.filter(button=>!button.hidden&&button.dataset.v593Visible==='true').length===2);
clearTimeout(progressive.instance.intentTimer);

const openingCancel=makeFixture('home');
const opening=openingCancel.instance.open();
const closingDuringBirth=openingCancel.instance.close({reason:'qa-cancel-birth'});
const [opened,cancelledClosed]=await Promise.all([opening,closingDuringBirth]);
check('motion:open-can-be-cancelled',opened===false&&cancelledClosed===true,`${opened}/${cancelledClosed}`);
check('motion:cancel-releases-orb',openingCancel.homeHost.contains(openingCancel.orb));
check('motion:cancel-does-not-leak-lock',openingCancel.instance.motionLocks.size===0&&openingCancel.instance.menuMotionPaused===false,openingCancel.instance.motionLocks.size);

const normal=makeFixture('home');
check('open:completed',await normal.instance.open()===true);
check('open:state',normal.instance.state==='open'&&normal.instance.bubbleState==='breath',`${normal.instance.state}/${normal.instance.bubbleState}`);
check('open:one-physical-claim',normal.claims===1&&normal.host.contains(normal.orb),normal.claims);
check('open:two-intentions',normal.instance.visibleRoutes().join(',')==='tarot,daily',normal.instance.visibleRoutes().join(','));
check('open:background-inert',normal.appNode.inert&&normal.appNode.getAttribute('aria-hidden')==='true');
check('open:home-accessible',normal.instance.menuButton.getAttribute('aria-label')==='Silenciar intenções'&&normal.instance.menuButton.label.textContent==='SILÊNCIO');
const status=normal.instance.status();
check('status:v593',status.release==='V593'&&status.version===593);
check('status:max-two',status.maximumVisibleIntentions===2&&status.visibleIntentions===2);
check('status:not-list',status.menuList===false&&status.menuGrid===false&&status.progressiveReveal===true);
check('status:no-copy',status.oneLivingOrb===true&&status.newCanvases===0&&status.javascriptAnimationLoops===0);
check('close:completed',await normal.instance.close({restoreFocus:true,reason:'qa-close'})===true);
check('close:state',normal.instance.state==='closed'&&normal.instance.bubbleState==='dormant');
check('close:claim-restored',normal.releases===1&&normal.homeHost.contains(normal.orb),normal.releases);
check('close:background-restored',!normal.appNode.inert&&!normal.appNode.hasAttribute('aria-hidden'));
check('close:sopro-restored',normal.instance.menuButton.getAttribute('aria-label')==='Chamar o universo'&&normal.instance.menuButton.label.textContent==='SOPRO');
clearTimeout(normal.instance.intentTimer);

const currentHome=makeFixture('home');
await currentHome.instance.open();
check('home:current-closes',await currentHome.instance.activateHome()===true);
check('home:current-no-false-travel',currentHome.navigations===0&&currentHome.instance.state==='closed',currentHome.navigations);
clearTimeout(currentHome.instance.intentTimer);

const homeTravel=makeFixture('daily');
await homeTravel.instance.open();
check('home:from-reality-travels',await homeTravel.instance.activateHome()===true);
check('home:coordinate-source',homeTravel.navigations===1&&homeTravel.lastNavigation?.route==='home'&&homeTravel.lastNavigation?.options?.source==='orbital-menu-v502');
check('home:same-orb-arrives',homeTravel.journeyHost.contains(homeTravel.orb)&&homeTravel.instance.state==='closed');
clearTimeout(homeTravel.instance.intentTimer);

const intentionTravel=makeFixture('home');
await intentionTravel.instance.open();
const tarot=intentionTravel.buttons.find(button=>button.dataset.v502Route==='tarot');
check('travel:tarot-is-offered',tarot.hidden===false&&tarot.dataset.v593Visible==='true');
check('travel:accepted',await intentionTravel.instance.activate(tarot)===true);
check('travel:one-navigation',intentionTravel.navigations===1&&intentionTravel.lastNavigation?.route==='tarot',intentionTravel.navigations);
check('travel:intention-is-semantic',intentionTravel.lastNavigation?.options?.intention==='Revelar',intentionTravel.lastNavigation?.options?.intention);
check('travel:same-physical-orb',intentionTravel.journeyHost.contains(intentionTravel.orb)&&intentionTravel.instance.releaseOrb===null);
check('travel:closed-cleanly',intentionTravel.instance.state==='closed'&&!intentionTravel.instance.navigating);
check('travel:one-universe-ignite',universeIgnites===2,universeIgnites);
clearTimeout(intentionTravel.instance.intentTimer);

check('performance:all-pauses-resumed',universePauses===universeStarts,`${universePauses}/${universeStarts}`);

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V593',work:'WORK12',macroStage:'5-of-10 / menu-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{frames:8,destinations:16,intentionDestinations:15,maximumVisibleIntentions:2,onePhysicalOrb:true,progressiveReveal:true},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
