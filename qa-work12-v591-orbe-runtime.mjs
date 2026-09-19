class TestCustomEvent extends Event {
  constructor(type,options={}) { super(type,options); this.detail=options.detail; }
}

const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':detail});

class FakeDocument extends EventTarget {
  constructor(){
    super();
    this.hidden=false;
    this.visibilityState='visible';
    this.documentElement={dataset:{work12:'v589',work12NavigationAuthority:'v589',performanceTier:'balanced'}};
    this.body={dataset:{screen:'home'}};
    this.selectorNodes=new Map();
  }
  querySelector(selector){ return this.querySelectorAll(selector)[0]||null; }
  querySelectorAll(selector){ return this.selectorNodes.get(selector)||[]; }
}

globalThis.CustomEvent=TestCustomEvent;
const documentTarget=new FakeDocument();
const windowTarget=new EventTarget();
globalThis.document=documentTarget;
globalThis.location={hash:''};
Object.defineProperty(globalThis,'navigator',{value:{maxTouchPoints:1},configurable:true});
globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
globalThis.addEventListener=windowTarget.addEventListener.bind(windowTarget);
globalThis.removeEventListener=windowTarget.removeEventListener.bind(windowTarget);
globalThis.dispatchEvent=windowTarget.dispatchEvent.bind(windowTarget);
globalThis.requestAnimationFrame=callback=>setTimeout(()=>callback(performance.now()),0);
globalThis.cancelAnimationFrame=handle=>clearTimeout(handle);

const {SupremeOrbCoreV501}=await import('./supreme-orb-core-v501.js?qa-v591-runtime');
const orb={id:'orb',dataset:{supremeOrb:'living',skin:'cosmic'},isConnected:true};
const canvas={id:'orbCanvas',dataset:{},isConnected:true};
const core=Object.create(SupremeOrbCoreV501.prototype);
Object.assign(core,{
  orb,entityNode:orb,canvas,motion:{},
  journeyEngine:null,projectionNodes:new Set(),persistenceAudits:0,persistenceFailures:0,
  lastPersistenceAudit:null
});
core.renderer={canvas,motionClient:{},motionCore:core.motion};
core.journeyEngine={core,status:()=>({travelerCopies:0})};
documentTarget.selectorNodes.set('#orb',[orb]);
documentTarget.selectorNodes.set('#orbCanvas',[canvas]);
documentTarget.selectorNodes.set('[data-supreme-orb="living"]',[orb]);
let identityAudit=core.auditPersistence('qa-identity');
check('identity:healthy',identityAudit.healthy===true);
check('identity:same-node',identityAudit.entityPreserved===true);
check('identity:same-renderer-canvas',identityAudit.rendererPreserved===true);
check('identity:one-physics',identityAudit.physicsPreserved===true);
check('identity:journey-shares-entity',identityAudit.journeySharesEntity===true);
check('identity:no-conceptual-copy',identityAudit.conceptualOrbCopies===0);
check('identity:dataset-ok',documentTarget.documentElement.dataset.orbPersistentIntegrity==='ok');
const duplicate={id:'orb',dataset:{supremeOrb:'living'},isConnected:true};
documentTarget.selectorNodes.set('#orb',[orb,duplicate]);
documentTarget.selectorNodes.set('[data-supreme-orb="living"]',[orb,duplicate]);
const duplicateAudit=core.auditPersistence('qa-duplicate');
check('identity:duplicate-detected',duplicateAudit.healthy===false&&duplicateAudit.canonicalOrbs===2);
check('identity:degraded-only-after-real-violation',documentTarget.documentElement.dataset.orbPersistentIntegrity==='degraded');
documentTarget.selectorNodes.set('#orb',[orb]);
documentTarget.selectorNodes.set('[data-supreme-orb="living"]',[orb]);
identityAudit=core.auditPersistence('qa-recovered');
check('identity:recovery',identityAudit.healthy===true&&core.persistenceFailures===1);

const {RealityOrbEngine}=await import('./orb-engine-v208.js?qa-v591-runtime');
let frames=0;
const rendererProbe=Object.create(RealityOrbEngine.prototype);
Object.assign(rendererProbe,{
  destroyed:false,presenceState:'serene',presenceTransitions:0,presenceRefreshes:0,
  shell:{dataset:{}},routeActive:true,targetEnergy:.16,targetPressure:0,hovering:false,
  lifeState:'IDLE',visible:true,down:false,pointerId:null,keyboardActive:false,
  presenceProfile(){return {energy:.21};},syncMagicState(){},requestFrame(){frames+=1;},resume(){}
});
const changed=rendererProbe.setPresenceState('attentive','qa-first');
const frameAfterChange=frames;
const repeated=rendererProbe.setPresenceState('attentive','qa-same');
check('renderer:first-transition',changed===true&&rendererProbe.presenceTransitions===1);
check('renderer:repeat-idempotent',repeated===false&&rendererProbe.presenceRefreshes===1);
check('renderer:repeat-no-second-frame',frames===frameAfterChange);
check('renderer:reason-remains-current',rendererProbe.shell.dataset.orbPresenceReason==='qa-same');

const soulRenderer=Object.create(RealityOrbEngine.prototype);
Object.assign(soulRenderer,{
  destroyed:false,presenceState:'serene',presenceTransitions:0,presenceRefreshes:0,
  soulState:'serene',soulExpressions:0,soulLastReason:'boot',shell:{dataset:{}},
  targetEnergy:.16,targetPressure:0,spin:0,ripple:{x:.5,y:.5,age:99},
  pointer:{targetX:.5,targetY:.5},routeActive:true,lifeState:'IDLE',visible:true,
  presenceProfile(){return {energy:.21};},syncMagicState(){},requestFrame(){frames+=1;},resume(){},
  setTarget(point){this.pointer.targetX=point.x;this.pointer.targetY=point.y;return point;}
});
const expression=soulRenderer.expressSoul({
  state:'reflecting',strength:.68,focus:{x:.24,y:.72},variation:{energy:.06,spin:.03},reason:'qa-soul'
});
check('renderer:soul-existing-clock',expression.existingClock===true&&expression.existingShader===true);
check('renderer:soul-focus',soulRenderer.pointer.targetX===.24&&soulRenderer.pointer.targetY===.72);
check('renderer:soul-no-message',expression.messageIncluded===false&&expression.hapticTriggered===false);
check('renderer:soul-release-v591',expression.release==='V591'&&soulRenderer.shell.dataset.orbSoulRelease==='v591');

const {WhitOrbSoulBridgeV581}=await import('./whit-orb-soul-bridge-v581.js?qa-v591-runtime');
const soulOrb={id:'orb',dataset:{},isConnected:true};
documentTarget.selectorNodes.set('#orb',[soulOrb]);
documentTarget.selectorNodes.set('[data-supreme-orb="living"]',[soulOrb]);
const physical=[];
const semantic=[];
const radiations=[];
const bridge=new WhitOrbSoulBridgeV581({
  orbCore:{
    orb:soulOrb,
    renderer:{expressSoul:detail=>{physical.push(detail);return {existingClock:true};}},
    journeyEngine:{setPresence:(state,options)=>semantic.push({state,options})}
  },
  universe:{signalPresence:detail=>radiations.push(detail)},
  whit:{},documentTarget,windowTarget,documentElement:documentTarget.documentElement
});
const afterBoot=physical.length;
documentTarget.dispatchEvent(new CustomEvent('divina:supreme-orb-pulse',{detail:{kind:'press',x:.18,y:.74,intensity:.88}}));
const afterPress=physical.length;
documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'AWAKEN',reason:'orb-touch'}}));
check('soul:touch-one-physical-response',afterPress===afterBoot+1&&physical.length===afterPress);
check('soul:equivalent-state-coalesced',bridge.coalescedExpressions>=1);
check('soul:touch-focus-preserved',physical.at(-1)?.focus?.x===.18&&physical.at(-1)?.focus?.y===.74);
check('soul:canonical-residence',soulOrb.dataset.whitResidence==='canonical-orb'&&soulOrb.dataset.orbLivingSoulV591==='listening');

documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'DEPART'}}));
const afterDepart=physical.length;
documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'TRAVEL'}}));
documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'ARRIVE'}}));
documentTarget.dispatchEvent(new CustomEvent('divina:orb-ios-journey-state',{detail:{state:'flight'}}));
check('soul:one-travel-expression',physical.length===afterDepart);
check('soul:travel-priority',bridge.state==='traveling'&&bridge.traveling===true);
const beforeNerve=physical.length;
windowTarget.dispatchEvent(new CustomEvent('whit:nerve',{detail:{kind:'ambient-context'}}));
check('soul:whit-yields-during-travel',physical.length===beforeNerve&&bridge.suppressedDuringTravel>=1);
documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'REVEAL'}}));
documentTarget.dispatchEvent(new CustomEvent('divina:work12-state',{detail:{state:'REST'}}));
check('soul:arrival-returns-aware',bridge.state==='aware'&&bridge.traveling===false);
check('soul:silence-counted',bridge.work12Silences>=1);
const soulStatus=bridge.status();
check('soul:work12-authority',soulStatus.work12StateAuthority===true&&soulStatus.work12Transitions>=6);
check('soul:same-renderer-clock',soulStatus.sameRenderer===true&&soulStatus.sameMotionClock===true);
check('soul:no-new-engine',soulStatus.separateOrb===false&&soulStatus.newCanvas===false&&soulStatus.animationLoops===0);
check('soul:no-model-api',soulStatus.modelCalls===0&&soulStatus.apiCalls===0);
check('soul:no-private-read',soulStatus.privateContentRead===false&&soulStatus.formFieldReads===false);
check('soul:silence-not-speech',soulStatus.messageIncluded===false);
check('soul:semantic-follows-physical',semantic.length===physical.length&&semantic.at(-1)?.state==='attentive');
check('soul:universe-presence-not-text',radiations.length>0);
bridge.destroy();

const session=await import('./tarot-session.js?qa-v591-orb');
const {CARDS}=await import('./tarot-data.js?qa-v591-orb');
let tarotState=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v591',auditSeed:'work12-v591'});
const cards=[];
for(let index=0;index<78;index+=1){
  const draw=session.drawNextCard(tarotState,{now:()=>index+2});
  tarotState=draw.state;
  cards.push(draw.cardId);
}
check('tarot:78-without-repetition',cards.length===78&&new Set(cards).size===78);
check('tarot:all-direct',tarotState.normalOnly===true&&cards.every(id=>CARDS[id]?.orientation==='normal'));

const daily=await import('./daily-policy-v303.js?qa-v591-orb');
const identity={scope:'device',digest:'591abcde'};
const moment=new Date('2026-09-19T15:00:00.000Z');
const dailyA=daily.createDailyRecord('  amor   e clareza  ',moment,identity);
const dailyB=daily.createDailyRecord('outra intenção',moment,identity);
const dailyNext=daily.createDailyRecord('',new Date('2026-09-20T15:00:00.000Z'),identity);
check('daily:same-brasilia-cycle',dailyA.id===dailyB.id&&dailyA.date===dailyB.date);
check('daily:new-day-new-cycle',dailyA.date!==dailyNext.date&&dailyA.id!==dailyNext.id);
check('daily:direct',dailyA.orientation==='normal'&&dailyA.reversed===false);
check('daily:intention-normalized',dailyA.intention==='amor e clareza');

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({
  release:'V591',work:'WORK12',macroStage:'3-of-10 / orbe-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  contracts:{oneEntity:true,oneRenderer:true,onePhysics:true,work12Soul:true,silence:true},
  failures:failures.map(({id,detail})=>({id,detail}))
},null,2));
if(failures.length)process.exitCode=1;
