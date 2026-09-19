import fs from 'node:fs';
import vm from 'node:vm';

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
    this.visibilityState = 'visible';
    this.counts = new Map([
      ['#orb',1],
      ['[data-supreme-orb="living"]',1],
      ['#orbCanvas',1],
      ['#divinaLivingUniverseV524',1],
      ['#divinaOrbPersistentJourneyV565',1],
      ['[data-v586-magic-bubble="true"]',0]
    ]);
  }

  querySelector(selector) {
    if (selector.includes('.screen.active')) return { id:this.body.dataset.screen };
    return null;
  }

  querySelectorAll(selector) {
    return Array.from({ length:this.counts.get(selector) || 0 }, (_, index) => ({ index }));
  }
}

globalThis.CustomEvent = TestCustomEvent;
const documentTarget = new FakeDocument();
const windowTarget = new EventTarget();
globalThis.document = documentTarget;
globalThis.location = { hash:'' };
globalThis.addEventListener = windowTarget.addEventListener.bind(windowTarget);
globalThis.removeEventListener = windowTarget.removeEventListener.bind(windowTarget);
globalThis.dispatchEvent = windowTarget.dispatchEvent.bind(windowTarget);

const {
  createWork12FoundationV589,
  WORK12_CONSTITUTION_V589,
  WORK12_STATES_V589
} = await import('./work12-foundation-v589.js?qa-runtime=589');

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : detail });
const dispatch = (type, detail = {}) => documentTarget.dispatchEvent(new CustomEvent(type,{ detail }));
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise(resolve => setTimeout(resolve,0));
};

const indexSource = fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const bootScript = [...indexSource.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .map(match => match[2])
  .find(body => body.includes('divina:work12-boot-release'));

function bootHarness() {
  const timers = new Map();
  const windowListeners = new Map();
  const serviceWorkerListeners = new Map();
  const documentEvents = [];
  let timerId = 0;
  const classList = () => {
    const values = new Set();
    return {
      add:(...items) => items.forEach(item => values.add(item)),
      remove:(...items) => items.forEach(item => values.delete(item)),
      contains:item => values.has(item)
    };
  };
  const style = () => {
    const values = new Map();
    return {
      setProperty:(name,value) => values.set(name,value),
      removeProperty:name => values.delete(name),
      getPropertyValue:name => values.get(name) || ''
    };
  };
  const makeNode = () => ({
    hidden:false,
    disabled:false,
    textContent:'',
    dataset:{},
    classList:classList(),
    style:style(),
    attributes:new Map(),
    listeners:new Map(),
    setAttribute(name,value) { this.attributes.set(name,String(value)); },
    removeAttribute(name) { this.attributes.delete(name); },
    addEventListener(type,handler) { this.listeners.set(type,handler); }
  });
  const root = makeNode();
  const message = makeNode();
  const whisper = makeNode();
  const recovery = makeNode();
  const portal = makeNode();
  portal.querySelector = selector => ({
    '.db-orb-loader__message':message,
    '.db-orb-loader__whisper':whisper,
    '.db-orb-loader__recovery':recovery
  })[selector] || null;
  const app = makeNode();
  const home = makeNode();
  const body = makeNode();
  body.dataset = {};
  const document = {
    documentElement:root,
    body,
    getElementById:id => ({ orbLoadingPortal:portal, app, home })[id] || null,
    dispatchEvent:event => { documentEvents.push(event); return true; }
  };
  class PlainCustomEvent {
    constructor(type,options = {}) { this.type=type; this.detail=options.detail; this.bubbles=Boolean(options.bubbles); }
  }
  const context = {
    document,
    navigator:{
      serviceWorker:{
        addEventListener:(type,handler) => serviceWorkerListeners.set(type,handler),
        register:async () => ({ scope:'https://divina.test/', update:async () => {} })
      }
    },
    CustomEvent:PlainCustomEvent,
    setTimeout:(handler,delay = 0) => { const id=++timerId; timers.set(id,{handler,delay}); return id; },
    clearTimeout:id => timers.delete(id),
    addEventListener:(type,handler) => {
      if (!windowListeners.has(type)) windowListeners.set(type,[]);
      windowListeners.get(type).push(handler);
    },
    removeEventListener:(type,handler) => {
      windowListeners.set(type,(windowListeners.get(type)||[]).filter(item => item !== handler));
    },
    console
  };
  context.window = context;
  context.dispatchEvent = event => {
    for (const handler of windowListeners.get(event.type) || []) handler(event);
    return true;
  };
  vm.runInContext(bootScript,vm.createContext(context),{ filename:'work12-inline-boot-v589.js' });
  const runDelay = delay => {
    for (const [id,timer] of [...timers]) {
      if (timer.delay !== delay) continue;
      timers.delete(id);
      timer.handler();
    }
  };
  const fireWindow = type => {
    for (const handler of windowListeners.get(type) || []) handler({ type });
  };
  const clickRecovery = () => recovery.listeners.get('click')?.({
    preventDefault(){},
    stopImmediatePropagation(){}
  });
  return { root,portal,app,home,body,recovery,timers,documentEvents,runDelay,fireWindow,clickRecovery };
}

check('boot-runtime:script-found', Boolean(bootScript));
const hardBoot = bootHarness();
check('boot-runtime:hard-timer-armed', [...hardBoot.timers.values()].some(timer => timer.delay === 4500));
hardBoot.runDelay(4500);
hardBoot.runDelay(180);
check('boot-runtime:home-revealed', hardBoot.home.classList.contains('active') && hardBoot.body.dataset.screen === 'home');
check('boot-runtime:portal-hidden', hardBoot.portal.hidden && hardBoot.portal.attributes.get('aria-hidden') === 'true');
check('boot-runtime:reason-recorded', hardBoot.root.dataset.work12BootReason === 'boot-watchdog');
check('boot-runtime:event-emitted', hardBoot.documentEvents.some(event => event.type === 'divina:work12-boot-release'));
const manualBoot = bootHarness();
manualBoot.clickRecovery();
check('boot-runtime:manual-reveals', manualBoot.root.dataset.work12BootReason === 'manual' && manualBoot.home.classList.contains('active'));
const healthyBoot = bootHarness();
healthyBoot.root.dataset.appShell = 'v180';
healthyBoot.fireWindow('divina:boot-ready');
healthyBoot.runDelay(4500);
check('boot-runtime:healthy-not-bypassed', healthyBoot.root.dataset.work12Boot === 'ready-v589' && !healthyBoot.home.classList.contains('active'));

let bubblesHidden = 0;
let messagesReleased = 0;
let delegateCalls = 0;
const originalOrbNavigate = () => Promise.resolve('original-orb-navigation');
const orbCore = {
  navigate:originalOrbNavigate,
  snapshot:() => ({ oneLivingOrb:true, renderer:'existing-v208' })
};
const universe = { status:() => ({ oneUniverseCanvas:true, canvasCount:1, permanentAnimationLoops:1 }) };
const journey = { status:() => ({
  oneLivingOrb:true,
  travelerCopies:0,
  teleportFallback:false,
  portalVisual:false,
  heavyEffectsPausedDuringAnyTravel:true
}) };
const bubbles = {
  hide:() => { bubblesHidden += 1; return true; },
  status:() => ({ simultaneousBubbles:1, automaticWhitSpeech:false })
};
const messageGovernor = {
  release:() => { messagesReleased += 1; return true; },
  status:() => ({ oneBubbleAtATime:true, navigationSilence:true })
};
const whit = { status:() => ({ livesInCanonicalOrb:true, automaticSpeech:false }) };

const navigate = async (route, options) => {
  delegateCalls += 1;
  dispatch('divina:supreme-orb-will-navigate',{ from:documentTarget.body.dataset.screen, to:route, source:options?.source });
  dispatch('divina:orb-ios-journey-state',{ state:'depart', route });
  dispatch('divina:orb-ios-journey-state',{ state:'flight', route });
  dispatch('divina:orb-ios-journey-state',{ state:'crossing', route });
  documentTarget.body.dataset.screen = route;
  dispatch('divina:route-ready',{ id:route });
  dispatch('divina:orb-ios-journey-state',{ state:'arrival', route });
  dispatch('divina:orb-ios-journey-state',{ state:'settle', route });
  dispatch('divina:orb-persistent-finished',{ reason:'complete', route });
  dispatch('divina:supreme-orb-did-navigate',{ from:'home', to:route });
  return route;
};

const foundation = createWork12FoundationV589({
  orbCore,
  universe,
  journey,
  bubbles,
  whit,
  messageGovernor,
  navigate,
  eventTarget:documentTarget,
  documentElement:documentTarget.documentElement
});

check('contract:version', WORK12_CONSTITUTION_V589.version === 589);
check('contract:macro', WORK12_CONSTITUTION_V589.macroStage === '1-of-10');
check('contract:maximum-two', WORK12_CONSTITUTION_V589.maximumSimultaneousIntentions === 2);
check('contract:complete-states', WORK12_STATES_V589.join('>') === 'REST>AWAKEN>OFFER>ACCEPT>QUIET>DEPART>TRAVEL>ARRIVE>REVEAL');
check('boot:initial-rest', foundation.snapshot().state === 'REST');
check('boot:initial-home', foundation.snapshot().route === 'home');
check('boot:identity', documentTarget.documentElement.dataset.work12 === 'v589');
check('boot:law', documentTarget.documentElement.dataset.work12Law === 'one-orb-one-universe-one-physics-one-presence');
check('boot:audit-ok', foundation.audit('qa-initial').health === 'ok');
check('navigation:central-authority-installed', orbCore.navigate !== originalOrbNavigate && foundation.status().navigationAuthority === 'work12-v589');

const first = foundation.offer({ id:'one', context:'home', destination:'tarot', source:'qa' });
const second = foundation.offer({ id:'two', context:'home', destination:'daily', source:'qa' });
const third = foundation.offer({ id:'three', context:'home', destination:'school', source:'qa' });
check('intent:first-born', first.accepted && !first.reused);
check('intent:second-born', second.accepted && !second.reused);
check('intent:third-refused', !third.accepted && third.reason === 'intention-limit');
check('intent:maximum-two-live', foundation.snapshot().activeIntentions === 2);
check('intent:accepted', foundation.accept('one').accepted && foundation.snapshot().destination === 'tarot');
check('intent:unknown-refused', foundation.accept('missing').reason === 'unknown-intention');
foundation.completeIntention('one');
foundation.completeIntention('two');
foundation.quiet('qa-silence');
await flush();
check('intent:silence-returns-rest', foundation.snapshot().state === 'REST');
check('intent:none-remain', foundation.snapshot().activeIntentions === 0);

const result = await foundation.navigate('tarot',{ source:'qa-touch' });
await flush();
const travelStates = foundation.timeline.map(item => item.state);
check('journey:delegate-result', result === 'tarot');
check('journey:delegate-once', delegateCalls === 1);
check('journey:depart', travelStates.includes('DEPART'));
check('journey:travel', travelStates.includes('TRAVEL'));
check('journey:arrive', travelStates.includes('ARRIVE'));
check('journey:reveal', travelStates.includes('REVEAL'));
check('journey:rest-after-reveal', foundation.snapshot().state === 'REST');
check('journey:route-committed', foundation.snapshot().route === 'tarot');
check('journey:intention-dissolved', foundation.snapshot().activeIntentions === 0);
check('journey:bubble-silenced', bubblesHidden >= 1);
check('journey:message-silenced', messagesReleased >= 1);

dispatch('divina:orb-ios-journey-state',{ state:'flight', route:'daily' });
check('continuity:missing-depart-recovered', foundation.snapshot().state === 'TRAVEL');
dispatch('divina:orb-ios-journey-state',{ state:'arrival', route:'daily' });
dispatch('divina:orb-persistent-finished',{ reason:'complete', route:'daily' });
await flush();
check('continuity:out-of-order-arrives', foundation.snapshot().route === 'daily');
check('continuity:out-of-order-rests', foundation.snapshot().state === 'REST');

const recoveriesBefore = foundation.status().recoveries;
dispatch('divina:loading-bypass',{ source:'qa-fail-open', reason:'qa' });
check('recovery:fail-open-counted', foundation.status().recoveries === recoveriesBefore + 1);
check('recovery:reason-sanitized', foundation.status().lastBootRelease === 'qa');

documentTarget.counts.set('[data-supreme-orb="living"]',2);
check('audit:duplicate-detected', foundation.audit('qa-duplicate').health === 'degraded');
check('audit:duplicate-named', foundation.audit('qa-duplicate').failing.includes('oneLivingOrb'));
documentTarget.counts.set('[data-supreme-orb="living"]',1);
check('audit:health-recovers', foundation.audit('qa-restored').health === 'ok');

const violationsBefore = foundation.status().violations;
check('state:unknown-refused', foundation.transition('TELEPORT','qa') === false);
check('state:violation-counted', foundation.status().violations === violationsBefore + 1);
check('singleton:same-foundation', createWork12FoundationV589({}) === foundation);
check('privacy:no-storage-state', foundation.status().storageReads === 0 && foundation.status().storageWrites === 0);
check('performance:no-new-loops', foundation.status().newAnimationLoops === 0);
check('performance:no-new-canvas', foundation.status().newCanvases === 0);
check('whit:silence-law', foundation.status().automaticWhitSpeech === false);

check('destroy:first', foundation.destroy() === true);
check('destroy:idempotent', foundation.destroy() === false);
check('destroy:identity-cleared', documentTarget.documentElement.dataset.work12 === undefined);
check('destroy:orb-navigation-restored', orbCore.navigate === originalOrbNavigate);

const failures = checks.filter(item => !item.pass);
const output = {
  release:'V589',
  work:'WORK12',
  macroStage:'1-of-10 / runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  failures:failures.map(({ id,detail }) => ({ id,detail }))
};
console.log(JSON.stringify(output,null,2));
if (failures.length) process.exitCode = 1;
