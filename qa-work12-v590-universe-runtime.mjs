class TestCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type, options);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:'home' } };
  }
  querySelector(selector) {
    if (selector.includes('.screen.active')) return { id:this.body.dataset.screen };
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#divinaLivingUniverseV524 canvas') return [{}];
    return [];
  }
}

globalThis.CustomEvent = TestCustomEvent;
const documentTarget = new FakeDocument();
globalThis.document = documentTarget;
globalThis.innerWidth = 390;
globalThis.innerHeight = 844;
globalThis.screen = { width:390, height:844 };
let reduced = false;
globalThis.matchMedia = () => ({ matches:reduced });
let frameSerial = 0;
const cancelled = [];
globalThis.requestAnimationFrame = () => ++frameSerial;
globalThis.cancelAnimationFrame = id => cancelled.push(id);

const { LivingUniverseCoreV524 } = await import('./living-universe-core-v524.js?qa-runtime=v590');

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : detail });

const makeProbe = () => {
  const probe = Object.create(LivingUniverseCoreV524.prototype);
  Object.assign(probe,{
    root:{ dataset:{}, isConnected:true },
    route:'home',
    profile:{ seed:0.08,density:1.06,warmth:0.56,drift:0.72,depth:1.08 },
    profileTarget:{ seed:0.08,density:1.06,warmth:0.56,drift:0.72,depth:1.08 },
    routeTransitions:0,
    suspensions:new Set(),
    softTravelReasons:new Set(),
    work12Phase:'rest',
    travelMode:false,
    journeyMotion:{ x:0,targetX:0,depth:0,targetDepth:0 },
    destroyed:false,
    visible:true,
    raf:0,
    lastFrame:0,
    lastDraw:0,
    lastDemandAt:0,
    demandUntil:0,
    touch:{ active:false,lastMoveAt:0 },
    energy:0.18,
    orbEnergy:0.12,
    width:390,
    requestedFps:60,
    targetFps:60,
    qualityProfile:'balanced',
    degraded:false,
    cadenceMode:'active',
    frame(){},
    markDemand(reason,duration) {
      this.lastDemand = { reason,duration };
      return duration;
    }
  });
  return probe;
};

const budgetEvents = [];
documentTarget.addEventListener('divina:work12-universe-budget',event => budgetEvents.push(event.detail));

const flight = makeProbe();
flight.pause('atom-one-flight');
check('flight:soft-reason-recorded',flight.softTravelReasons.has('atom-one-flight'));
check('flight:no-hard-suspension',flight.suspensions.size === 0);
check('flight:universe-keeps-clock',flight.raf > 0);
check('flight:essential-mode',flight.travelMode && flight.root.dataset.travelBudget === 'essential');
check('flight:heavy-layers-sleep',flight.root.dataset.heavyLayers === 'sleeping');
check('flight:horizontal-motion-begins',Math.abs(flight.journeyMotion.targetX) > 0);
flight.start('atom-one-flight');
check('flight:reason-released',!flight.softTravelReasons.has('atom-one-flight'));
check('flight:ambient-returns',!flight.travelMode && flight.root.dataset.travelBudget === 'full');
check('flight:continuous-clock-not-replaced',flight.raf === 1);

const navigation = makeProbe();
documentTarget.documentElement.dataset.orbNavigationState = 'active';
navigation.pause();
check('navigation:generic-pause-becomes-soft',navigation.softTravelReasons.has('work12-navigation'));
check('navigation:no-canvas-freeze',navigation.suspensions.size === 0 && navigation.raf > 0);
navigation.start();
check('navigation:matching-soft-release',navigation.softTravelReasons.size === 0 && !navigation.travelMode);
delete documentTarget.documentElement.dataset.orbNavigationState;

const lifecycle = makeProbe();
lifecycle.raf = 77;
lifecycle.pause('document-hidden');
check('lifecycle:hard-pause-cancels',cancelled.includes(77) && lifecycle.raf === 0);
check('lifecycle:hard-reason-retained',lifecycle.suspensions.has('document-hidden'));
const resumed = lifecycle.start('document-hidden');
check('lifecycle:matching-resume',resumed && lifecycle.suspensions.size === 0 && lifecycle.raf > 0);

const overlap = makeProbe();
overlap.raf = 88;
overlap.pause('document-freeze');
overlap.pause('atom-one-flight');
check('overlap:travel-does-not-break-lifecycle',overlap.suspensions.has('document-freeze') && overlap.raf === 0);
overlap.start('atom-one-flight');
check('overlap:flight-release-stays-paused',overlap.suspensions.has('document-freeze') && overlap.raf === 0);
overlap.start('document-freeze');
check('overlap:lifecycle-owner-resumes',overlap.suspensions.size === 0 && overlap.raf > 0);

const cadence = makeProbe();
cadence.travelMode = true;
check('cadence:iphone-travel-24fps',cadence.cadenceFor(1000) === 24 && cadence.cadenceMode === 'work12-travel-essential');
cadence.width = 1024;
check('cadence:wide-travel-30fps',cadence.cadenceFor(1000) === 30);
cadence.width = 390;
reduced = true;
check('cadence:reduced-travel-20fps',cadence.cadenceFor(1000) === 20 && cadence.cadenceMode === 'work12-travel-reduced');
reduced = false;
cadence.travelMode = false;
cadence.raf = 0;
check('cadence:iphone-deep-idle-24fps',cadence.cadenceFor(12000) === 24 && cadence.cadenceMode === 'deep-idle');

const states = makeProbe();
states.setWork12State({ state:'DEPART',route:'home',destination:'tarot' });
check('state:depart-enters-travel',states.work12Phase === 'depart' && states.travelMode);
check('state:destination-profile-begins-before-reveal',states.profileTarget.seed === 0.18);
states.setWork12State({ state:'TRAVEL',route:'home',destination:'tarot' });
check('state:travel-keeps-one-clock',states.raf > 0 && states.suspensions.size === 0);
states.setWork12State({ state:'ARRIVE',route:'home',destination:'tarot' });
check('state:arrival-stays-essential',states.travelMode);
states.setWork12State({ state:'REVEAL',route:'tarot',destination:'tarot' });
check('state:reveal-wakes-heavy-layers',!states.travelMode && states.root.dataset.heavyLayers === 'awake');
check('state:recenter-is-continuous',states.journeyMotion.targetX === 0 && states.journeyMotion.targetDepth === 0);

const route = makeProbe();
const originalRoot = route.root;
route.start = () => true;
route.setRoute('daily');
route.setRoute('school');
check('identity:root-never-replaced',route.root === originalRoot);
check('identity:routes-morph-in-place',route.route === 'school' && route.routeTransitions === 2);
check('identity:shortest-horizontal-direction',route.journeyDirection('home','admin') === -1);

check('events:budget-announced',budgetEvents.some(event => event.mode === 'essential-travel' && event.oneCanvas && event.oneClock));
check('events:ambient-announced',budgetEvents.some(event => event.mode === 'ambient' && !event.heavyLayersPaused));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V590',work:'WORK12',macroStage:'2-of-10 / universo-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length-failures.length,failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail}) => ({id,detail}))
},null,2));
if (failures.length) process.exitCode = 1;
