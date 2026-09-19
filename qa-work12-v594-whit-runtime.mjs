/* DIVINA BRUXA — WORK12 · QA RUNTIME · WHIT PRESENÇA VIVA V594 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});
const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));

class TestCustomEvent extends Event{
  constructor(type,options={}){super(type,options);this.detail=options.detail;}
}

class FakeDocument extends EventTarget{
  constructor(route='home'){
    super();
    this.documentElement={dataset:{menuState:'closed',v585Menu:'closed',v585Keyboard:'closed',work12State:'rest'}};
    this.body={dataset:{screen:route}};
    this.visibilityState='visible';
  }
  querySelector(){return null;}
  querySelectorAll(selector){
    if(selector==='#orb'||selector==='#orbCanvas')return [{}];
    return [];
  }
}

class FakeWindow extends EventTarget{
  constructor(){super();this.location={hash:''};}
}

globalThis.CustomEvent=TestCustomEvent;
globalThis.matchMedia=()=>({matches:true});

const moduleUrl=`${pathToFileURL(path.join(root,'whit-living-presence-v594.js')).href}?qa=v594-runtime-${Date.now()}`;
const { createWhitLivingPresenceV594 }=await import(moduleUrl);

function fixture(route='home'){
  const documentTarget=new FakeDocument(route);
  const windowTarget=new FakeWindow();
  const guidanceCalls=[];
  const whit={showGuidance(routeValue,options={}){guidanceCalls.push({route:routeValue,options});return {route:routeValue,shown:true};}};
  const soulCalls=[];
  const soul={
    setState(...args){soulCalls.push(args);return args[0];},
    status(){return {canonicalOrbOnly:true,sameRenderer:true,sameMotionClock:true};}
  };
  const schedules=[];
  const bubbles={
    state:'silent',
    schedule(options){schedules.push(options);return true;},
    status(){return {state:this.state};}
  };
  const foundation={state:'REST',status(){return {state:this.state};}};
  const governor={active:null,status(){return {active:this.active};}};
  const presence=createWhitLivingPresenceV594({
    soul,whit,bubbles,foundation,governor,documentTarget,windowTarget,
    documentElement:documentTarget.documentElement,
    dwellDelays:{spreads:20,library:20,school:20,skins:20,music:20,videos:20}
  });
  const routeTo=value=>{documentTarget.body.dataset.screen=value;};
  const dispatch=(type,detail={})=>documentTarget.dispatchEvent(new TestCustomEvent(type,{detail}));
  return {presence,documentTarget,windowTarget,whit,soul,bubbles,foundation,governor,guidanceCalls,soulCalls,schedules,routeTo,dispatch};
}

const primary=fixture('home');
check('boot:release',primary.presence.version===594);
check('boot:canonical-residence',primary.documentTarget.documentElement.dataset.whitLivingResidence==='canonical-orb');
check('boot:explicit-touch-policy',primary.documentTarget.documentElement.dataset.whitLivingTouch==='explicit-only');
check('boot:home-silent',primary.presence.status().state==='silent'&&primary.schedules.length===0);
check('boot:one-orb-audit',primary.presence.audit().oneCanonicalOrb&&primary.presence.audit().oneCanonicalCanvas);

const ordinary=primary.whit.showGuidance('home',{source:'orb-touch'});
check('touch:ordinary-is-silent',ordinary?.silent===true&&primary.guidanceCalls.length===0,JSON.stringify(ordinary));
check('touch:silence-counted',primary.presence.status().ordinaryTouchesSilenced===1);
const deliberate=primary.whit.showGuidance('home',{source:'explicit-open',expanded:true});
check('touch:deliberate-preserved',deliberate?.shown===true&&primary.guidanceCalls.length===1,JSON.stringify(deliberate));

primary.routeTo('library');
primary.dispatch('divina:work12-arrival',{route:'library'});
primary.documentTarget.dispatchEvent(new Event('pointerdown'));
await wait(42);
check('context:movement-keeps-silence',primary.schedules.length===0,primary.schedules.length);
check('context:movement-cancels-pause',primary.presence.status().interactedSinceArrival===true);

primary.routeTo('school');
primary.dispatch('divina:work12-arrival',{route:'school'});
await wait(42);
check('context:quiet-school-offered',primary.schedules.length===1,primary.schedules.length);
check('context:uses-existing-bubble',primary.schedules[0]?.source==='whit-presence'&&primary.schedules[0]?.route==='school',JSON.stringify(primary.schedules[0]));
check('context:soul-breathes-before-offer',primary.soulCalls.some(call=>call[0]==='listening'&&call[1]==='whit-contextual-offer'));
primary.dispatch('divina:magic-bubble-visible',{route:'school',source:'whit-presence'});
check('context:first-offer-lived',primary.presence.status().contextualOffers===1);
check('context:one-route-recorded',primary.presence.status().offeredRoutes.join(',')==='school');

primary.dispatch('divina:work12-arrival',{route:'school'});
await wait(42);
check('context:no-repeat-on-route',primary.schedules.length===1,primary.schedules.length);

primary.routeTo('store');
primary.dispatch('divina:work12-arrival',{route:'store'});
await wait(42);
check('context:commerce-never-offers',primary.schedules.length===1,primary.schedules.length);

primary.routeTo('music');
primary.dispatch('divina:work12-arrival',{route:'music'});
await wait(42);
check('context:second-quiet-offer',primary.schedules.length===2,primary.schedules.length);
primary.dispatch('divina:magic-bubble-visible',{route:'music',source:'whit-presence'});
check('context:session-two-lived',primary.presence.status().contextualOffers===2);

primary.routeTo('videos');
primary.dispatch('divina:work12-arrival',{route:'videos'});
await wait(42);
check('context:session-limit',primary.schedules.length===2,primary.schedules.length);
check('context:maximum-two-contract',primary.presence.status().maximumContextualOffersPerSession===2);
check('context:silence-dominates',primary.presence.status().silenceRatio>=0.5,primary.presence.status().silenceRatio);
check('privacy:no-runtime-reads',primary.presence.status().privateContentReads===0&&primary.presence.status().formFieldReads===0);
check('performance:no-runtime-visuals',primary.presence.audit().domNodesCreated===0&&primary.presence.audit().newCanvases===0&&primary.presence.audit().permanentAnimationLoops===0);

const originalGuidance=primary.guidanceCalls.length;
check('destroy:completed',primary.presence.destroy()===true);
primary.whit.showGuidance('home',{source:'orb-touch'});
check('destroy:restores-whit',primary.guidanceCalls.length===originalGuidance+1,primary.guidanceCalls.length);

const motion=fixture('home');
motion.routeTo('library');
motion.dispatch('divina:work12-arrival',{route:'library'});
motion.dispatch('divina:work12-state',{state:'DEPART'});
await wait(42);
check('travel:cancels-context',motion.schedules.length===0,motion.schedules.length);
check('travel:absolute-silence',motion.presence.status().traveling===true&&motion.presence.status().state==='travel-silence');

motion.dispatch('divina:work12-state',{state:'REST'});
motion.routeTo('school');
motion.dispatch('divina:work12-arrival',{route:'school'});
motion.dispatch('divina:menu-state',{state:'open'});
await wait(42);
check('menu:cancels-context',motion.schedules.length===0,motion.schedules.length);
check('menu:absolute-silence',motion.presence.status().menuOpen===true&&motion.presence.status().state==='menu-silence');

motion.dispatch('divina:menu-state',{state:'closed'});
motion.routeTo('tarot');
motion.dispatch('divina:work12-arrival',{route:'tarot'});
await wait(42);
check('ritual:tarot-remains-silent',motion.schedules.length===0,motion.schedules.length);
motion.routeTo('daily');
motion.dispatch('divina:work12-arrival',{route:'daily'});
await wait(42);
check('ritual:daily-remains-silent',motion.schedules.length===0,motion.schedules.length);
motion.routeTo('journal');
motion.dispatch('divina:work12-arrival',{route:'journal'});
await wait(42);
check('privacy:journal-remains-silent',motion.schedules.length===0,motion.schedules.length);
check('safety:protected-routes-never-offered',motion.presence.audit().protectedRoutesSilent);
motion.presence.destroy();

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V594',work:'WORK12',macroStage:'6-of-10 / whit-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{ordinaryTouchSpeech:false,deliberateInvitation:true,maximumContextualOffers:2,separateWhitBody:false},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
