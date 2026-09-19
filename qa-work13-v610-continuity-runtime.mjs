/* DIVINA BRUXA — WORK13 V610 · QA DE CONTINUIDADE DA JORNADA INTEIRA */
import {
  COSMOS_FINAL_ORCHESTRA_CONTRACT_V610,
  CosmosFinalOrchestraV610
} from './cosmos-final-orchestra-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor(routes) {
    super();
    this.documentElement = { dataset:{}, clientWidth:390, scrollWidth:390 };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.visibilityState = 'visible';
    this.events = [];
    this.routes = routes;
    this.active = { id:'home' };
    this.orbs = 1;
    this.canvases = 1;
    this.players = 0;
    this.created = 0;
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  setRoute(route) {
    this.body.dataset.screen = route;
    this.active = { id:route };
  }
  querySelector(selector) {
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.active;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return Array.from({ length:this.orbs }, () => ({}));
    if (selector === '#orbCanvas') return Array.from({ length:this.canvases }, () => ({}));
    if (selector === '#app > .screen.active') return this.active ? [this.active] : [];
    if (selector === '#app > .screen[id]') return this.routes.map(id => ({ id }));
    if (selector === '#musicApp iframe,#videoApp iframe') return Array.from({ length:this.players }, () => ({}));
    return [];
  }
  createElement() {
    this.created += 1;
    throw new Error('v610-final-orchestra-must-not-create-dom');
  }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'#home' };
    this.visualViewport = { width:390, height:844 };
    this.innerWidth = 390;
    this.innerHeight = 844;
    this.devicePixelRatio = 3;
    this.navigator = { standalone:true };
    this.frames = new Map();
    this.nextFrame = 0;
    this.reducedMotion = false;
  }
  matchMedia(query) {
    return { matches:query.includes('prefers-reduced-motion') ? this.reducedMotion : query.includes('display-mode') };
  }
  requestAnimationFrame(callback) {
    const id = ++this.nextFrame;
    this.frames.set(id, callback);
    return id;
  }
  cancelAnimationFrame(id) { this.frames.delete(id); }
  flushFrames(limit = 8) {
    let cycles = 0;
    while (this.frames.size && cycles < limit) {
      const callbacks = [...this.frames.values()];
      this.frames.clear();
      callbacks.forEach(callback => callback(cycles * 16));
      cycles += 1;
    }
    return cycles;
  }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const contract = COSMOS_FINAL_ORCHESTRA_CONTRACT_V610;
const doc = new FakeDocument(contract.routes);
const win = new FakeWindow();
const systems = Object.fromEntries(contract.requiredLivingLayers.map(key => [key,{ version:key }]));
let orbSnapshot = { oneLivingOrb:true, entityPreserved:true };
let journeyStatus = { travelerCopies:0, teleportFallback:false, flicker:false };
const runtime = new CosmosFinalOrchestraV610({
  systems,
  orb:{ snapshot:() => orbSnapshot },
  journey:{ status:() => journeyStatus },
  documentTarget:doc,
  windowTarget:win
});

check('boot:sealed', runtime.lastAudit.sealed === true);
check('boot:one-orb', runtime.lastAudit.canonicalOrbs === 1);
check('boot:one-canvas', runtime.lastAudit.canonicalCanvases === 1);
check('boot:seventeen-worlds', runtime.lastAudit.worldCount === 17);
check('boot:one-active-world', runtime.lastAudit.activeScreens === 1);
check('boot:no-player', runtime.lastAudit.activePlayers === 0);
check('boot:one-completion', runtime.completionEvents === 1);
check('boot:no-work14', contract.work14 === false && doc.documentElement.dataset.work13Next === 'none');

const canaries = Object.freeze([
  'PRIVATE_JOURNAL_BODY_610', 'PRIVATE_TAROT_QUESTION_610',
  'PRIVATE_ACCOUNT_PROFILE_610', 'PRIVATE_PURCHASE_BODY_610',
  'PRIVATE_LISTENING_HISTORY_610', 'PRIVATE_VIEWING_HISTORY_610'
]);

for (const [index, route] of contract.routes.entries()) {
  const previous = index ? contract.routes[index - 1] : 'home';
  doc.dispatchEvent(new FakeCustomEvent('divina:route-start', {
    detail:{ from:previous, to:route, journal:canaries[0], question:canaries[1] }
  }));
  doc.setRoute(route);
  win.location.hash = `#${route}`;
  doc.dispatchEvent(new FakeCustomEvent('divina:route-ready', {
    detail:{ route, profile:canaries[2], purchase:canaries[3], listening:canaries[4], viewing:canaries[5] }
  }));
}
check('routes:all-started', runtime.routeStarts === 17, runtime.routeStarts);
check('routes:all-settled', runtime.routeSettles === 17, runtime.routeSettles);
check('routes:one-pending-frame', win.frames.size === 1, win.frames.size);
check('routes:signals-coalesced', runtime.coalescedSignals === 16, runtime.coalescedSignals);
check('routes:one-frame-cycle', win.flushFrames() === 1);
check('routes:last-aligned', runtime.lastAudit.route === 'admin' && runtime.lastAudit.routeAligned === true);
check('routes:still-sealed', runtime.lastAudit.sealed === true);

for (const route of ['videos','music','store','daily','tarot','home']) {
  doc.setRoute(route);
  win.location.hash = `#${route}`;
  win.dispatchEvent(new Event('popstate'));
  win.dispatchEvent(new Event('hashchange'));
  check(`history:${route}:one-frame`, win.frames.size === 1, win.frames.size);
  win.flushFrames();
  check(`history:${route}:aligned`, runtime.lastAudit.route === route && runtime.lastAudit.routeAligned === true);
}

win.dispatchEvent(new Event('offline'));
win.dispatchEvent(new Event('online'));
win.dispatchEvent(new Event('pageshow'));
check('pwa:offline-online-reopen-coalesced', win.frames.size === 1, win.frames.size);
win.flushFrames();
check('pwa:reopen-keeps-seal', runtime.lastAudit.sealed === true);

win.visualViewport.width = 844;
win.visualViewport.height = 390;
win.dispatchEvent(new Event('orientationchange'));
win.flushFrames();
check('iphone:landscape-read', runtime.lastViewport.orientation === 'landscape');
check('iphone:landscape-sealed', runtime.lastAudit.sealed === true);

win.visualViewport.width = 390;
win.visualViewport.height = 844;
win.reducedMotion = true;
win.dispatchEvent(new Event('resize'));
win.flushFrames();
check('iphone:portrait-read', runtime.lastViewport.orientation === 'portrait');
check('iphone:reduced-motion-read', runtime.lastViewport.reducedMotion === true);
check('iphone:standalone-read', runtime.lastViewport.standalone === true);

doc.visibilityState = 'hidden';
doc.dispatchEvent(new Event('visibilitychange'));
check('silence:hidden', doc.documentElement.dataset.cosmosFinalState === 'quiet' && win.frames.size === 0);
doc.visibilityState = 'visible';
doc.dispatchEvent(new Event('visibilitychange'));
check('silence:visible-one-frame', win.frames.size === 1);
win.flushFrames();

const recover = (id, breakState, restoreState) => {
  breakState();
  runtime.audit(`break-${id}`);
  check(`guard:${id}:watch`, runtime.lastAudit.sealed === false && doc.documentElement.dataset.work13Complete === undefined);
  restoreState();
  runtime.audit(`recover-${id}`);
  check(`guard:${id}:recovers`, runtime.lastAudit.sealed === true && doc.documentElement.dataset.work13Complete === 'v610');
};
recover('duplicate-orb', () => { doc.orbs = 2; }, () => { doc.orbs = 1; });
recover('duplicate-canvas', () => { doc.canvases = 2; }, () => { doc.canvases = 1; });
recover('two-players', () => { doc.players = 2; }, () => { doc.players = 0; });
recover('horizontal-overflow', () => { doc.documentElement.scrollWidth = 450; }, () => { doc.documentElement.scrollWidth = 390; });
recover('orb-identity', () => { orbSnapshot = { oneLivingOrb:false }; }, () => { orbSnapshot = { oneLivingOrb:true, entityPreserved:true }; });
recover('traveler-copy', () => { journeyStatus = { travelerCopies:1 }; }, () => { journeyStatus = { travelerCopies:0, teleportFallback:false, flicker:false }; });
recover('teleport', () => { journeyStatus = { travelerCopies:0, teleportFallback:true }; }, () => { journeyStatus = { travelerCopies:0, teleportFallback:false, flicker:false }; });
recover('flicker', () => { journeyStatus = { travelerCopies:0, flicker:true }; }, () => { journeyStatus = { travelerCopies:0, teleportFallback:false, flicker:false }; });
recover('missing-layer', () => { systems.contextMemory.destroyed = true; }, () => { systems.contextMemory.destroyed = false; });

win.dispatchEvent(new Event('error'));
win.dispatchEvent(new Event('unhandledrejection'));
check('faults:coalesced', win.frames.size === 1 && runtime.faultSignals === 2);
win.flushFrames();
check('faults:do-not-unseal-structure', runtime.lastAudit.sealed === true);
check('completion:emitted-once', runtime.completionEvents === 1);
check('completion:event-once', doc.events.filter(event => event.type === 'divina:work13-complete').length === 1);
check('continuity:no-dom-created', doc.created === 0);
check('continuity:no-automatic-navigation', !doc.events.some(event => /navigate/i.test(event.type)));
check('continuity:no-automatic-whit', !doc.events.some(event => /whit/i.test(event.type)));
check('continuity:no-automatic-playback', contract.automaticPlayback === false);

const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.lastAudit });
for (const canary of canaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
check('privacy:public-only', runtime.status().privateContentIncluded === false);
check('weight:no-timers', contract.deferredTimers === 0 && contract.permanentAnimationLoops === 0);
check('weight:no-observer', contract.mutationObservers === 0);
check('weight:no-network-model', contract.networkCalls === 0 && contract.modelCalls === 0);
check('weight:one-frame-budget', win.frames.size <= 1);

runtime.destroy();
check('destroy:stops', runtime.destroyed === true);
check('destroy:no-frame', win.frames.size === 0);
check('destroy:seal-removed', doc.documentElement.dataset.work13Complete === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V610',
  work:'WORK13',
  macroStage:'10-of-10 / final-orchestra-continuity',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  routesExercised:contract.routes.length,
  historyRoutesExercised:6,
  completionEvents:runtime.completionEvents,
  privateCanariesRetained:canaries.some(canary => serialized.includes(canary)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
