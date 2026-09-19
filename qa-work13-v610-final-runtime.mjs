/* DIVINA BRUXA — WORK13 V610 · QA DE RUNTIME DA ORQUESTRA FINAL */
import {
  COSMOS_FINAL_ORCHESTRA_CONTRACT_V610,
  CosmosFinalOrchestraV610,
  evaluateCosmosSealV610,
  normalizeIPhoneViewportV610
} from './cosmos-final-orchestra-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{}, clientWidth:390, scrollWidth:390 };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.visibilityState = 'visible';
    this.events = [];
    this.active = { id:'home' };
    this.worlds = Array.from({ length:17 }, (_, index) => ({ id:`world-${index}` }));
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  querySelector(selector) {
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.active;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    if (selector === '#app > .screen.active') return [this.active];
    if (selector === '#app > .screen[id]') return this.worlds;
    if (selector === '#musicApp iframe,#videoApp iframe') return [];
    return [];
  }
  createElement() { throw new Error('final-orchestra-must-not-create-dom'); }
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
  flushFrames(limit = 12) {
    let cycles = 0;
    while (this.frames.size && cycles < limit) {
      const pending = [...this.frames.values()];
      this.frames.clear();
      pending.forEach(callback => callback(cycles * 16));
      cycles += 1;
    }
    return cycles;
  }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const contract = COSMOS_FINAL_ORCHESTRA_CONTRACT_V610;

check('contract:version', contract.version === 610);
check('contract:base-v609', contract.base.startsWith('V609-media-skins'));
check('contract:stage-ten', contract.work === 'WORK13' && contract.macroStage === '10-of-10');
check('contract:closure-inside-work13', contract.closure === 'WORK13-completes-inside-WORK13');
check('contract:law', contract.law === 'one-orb-one-universe-one-presence-one-journey');
check('contract:foundation-v601', contract.foundationSnapshot === 601);
check('contract:eight-layers', contract.livingLayers.join('|') === '602|603|604|605|606|607|608|609');
check('contract:seventeen-worlds', contract.routes.length === 17 && contract.expectedWorlds === 17);
check('contract:sequence', contract.sequence.join('|') === 'public-structural-signal|one-coalesced-frame|structural-audit|silence');
check('contract:iphone-matrix', contract.iphoneProfiles.length === 8 && contract.iphoneFirst === true);
check('contract:portrait-landscape', contract.portraitAndLandscape === true);
check('contract:safe-area-keyboard', contract.safeAreasPreserved === true && contract.keyboardViewportPreserved === true);
check('contract:history-pwa-offline', contract.backForwardPreserved === true && contract.pwaReopenPreserved === true && contract.offlineFloorPreserved === true);
check('contract:reduced-motion', contract.reducedMotionPreservesMeaning === true);
check('contract:no-physical-claim', contract.physicalDeviceClaim === false);
check('contract:one-orb-canvas', contract.onePhysicalOrbRequired === true && contract.oneCanonicalCanvasRequired === true);
check('contract:budgets', contract.maximumActivePlayers === 1 && contract.maximumPendingFrames === 1);
for (const key of [
  'visualChanges','newStylesheets','newDomNodes','newCanvases','newRenderers','newPlayers',
  'permanentAnimationLoops','deferredTimers','mutationObservers','clickListeners','inputListeners',
  'privateContentReads','formValueReads','journalBodyReads','questionReads','cardIdentityReads',
  'listeningHistoryReads','viewingHistoryReads','accountProfileReads','purchaseBodyReads',
  'searchQueryReads','storageReads','storageWrites','networkCalls','modelCalls'
]) check(`contract:zero:${key}`, contract[key] === 0, contract[key]);
check('contract:no-automatic-actions', contract.automaticPlayback === false && contract.automaticNavigation === false && contract.automaticWhitSpeech === false);
check('contract:no-production', contract.productionPublish === false && contract.realBilling === false && contract.frontendEntitlementGrants === false);
check('contract:no-work14', contract.work14 === false);

for (const profile of contract.iphoneProfiles) {
  const viewport = normalizeIPhoneViewportV610(profile);
  check(`viewport:${profile.id}:dimensions`, viewport.width === profile.width && viewport.height === profile.height);
  check(`viewport:${profile.id}:orientation`, viewport.orientation === (profile.width > profile.height ? 'landscape' : 'portrait'));
  check(`viewport:${profile.id}:dpr`, viewport.dpr === profile.dpr);
}
const bounded = normalizeIPhoneViewportV610({ width:-1, height:'bad', dpr:99, reducedMotion:true, standalone:true });
check('viewport:bounds', bounded.width === 0 && bounded.height === 0 && bounded.dpr === 4);
check('viewport:public-flags', bounded.reducedMotion === true && bounded.standalone === true);

const healthyInput = {
  layers:Object.fromEntries(contract.requiredLivingLayers.map(key => [key,true])),
  canonicalOrbs:1,
  canonicalCanvases:1,
  activeScreens:1,
  worldCount:17,
  activePlayers:1,
  travelerCopies:0,
  pendingFrames:0,
  routeAligned:true,
  orbEntityPreserved:true,
  teleportFallback:false,
  flicker:false,
  horizontalOverflow:false
};
check('seal:healthy', evaluateCosmosSealV610(healthyInput).sealed === true);
const brokenCases = [
  ['layer',{ layers:{ ...healthyInput.layers, whitTiming:false } }],
  ['orb',{ canonicalOrbs:2 }],
  ['canvas',{ canonicalCanvases:2 }],
  ['active-screen',{ activeScreens:2 }],
  ['world-count',{ worldCount:16 }],
  ['player',{ activePlayers:2 }],
  ['traveler',{ travelerCopies:1 }],
  ['teleport',{ teleportFallback:true }],
  ['flicker',{ flicker:true }],
  ['overflow',{ horizontalOverflow:true }],
  ['frames',{ pendingFrames:2 }],
  ['route-alignment',{ routeAligned:false }]
];
for (const [id, change] of brokenCases) {
  const candidate = { ...healthyInput, ...change };
  check(`seal:rejects:${id}`, evaluateCosmosSealV610(candidate).sealed === false);
}

const doc = new FakeDocument();
const win = new FakeWindow();
const systems = Object.fromEntries(contract.requiredLivingLayers.map(key => [key,{ version:1 }]));
const runtime = new CosmosFinalOrchestraV610({
  systems,
  orb:{ snapshot:() => ({ oneLivingOrb:true, entityPreserved:true }) },
  journey:{ status:() => ({ travelerCopies:0, teleportFallback:false, flicker:false }) },
  documentTarget:doc,
  windowTarget:win
});

check('runtime:identity', doc.documentElement.dataset.cosmosFinalOrchestra === 'v610');
check('runtime:macro', doc.documentElement.dataset.work13Macro === '10-final-orchestra');
check('runtime:privacy', doc.documentElement.dataset.cosmosFinalPrivacy === 'public-structural-signals-only');
check('runtime:sealed', runtime.lastAudit?.sealed === true && doc.documentElement.dataset.work13Complete === 'v610');
check('runtime:no-next-work', doc.documentElement.dataset.work13Next === 'none');
check('runtime:one-completion', runtime.completionEvents === 1);
check('runtime:ready-event', doc.events.some(event => event.type === 'divina:cosmos-final-orchestra-ready'));
check('runtime:completion-event', doc.events.some(event => event.type === 'divina:work13-complete' && event.detail.nextWork === null));
check('runtime:no-dom-created', typeof doc.createElement === 'function' && contract.newDomNodes === 0);
check('runtime:portrait', runtime.lastViewport.orientation === 'portrait' && runtime.lastViewport.standalone === true);

doc.dispatchEvent(new FakeCustomEvent('divina:route-start', { detail:{ to:'tarot' } }));
check('runtime:travel-state', doc.documentElement.dataset.cosmosFinalState === 'travel' && runtime.routeStarts === 1);
const canaries = ['PRIVATE_JOURNAL_610','PRIVATE_QUESTION_610','PRIVATE_PROFILE_610','PRIVATE_PURCHASE_610'];
for (let index = 0; index < 120; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:route-ready', {
    detail:{ id:'home', journal:canaries[0], question:canaries[1], profile:canaries[2], purchase:canaries[3] }
  }));
}
check('runtime:one-frame', win.frames.size === 1, win.frames.size);
check('runtime:signals-coalesced', runtime.coalescedSignals === 119, runtime.coalescedSignals);
check('runtime:one-frame-cycle', win.flushFrames() === 1);
check('runtime:ready-after-settle', doc.documentElement.dataset.cosmosFinalState === 'ready');
check('runtime:completion-not-duplicated', runtime.completionEvents === 1);

win.visualViewport.width = 844;
win.visualViewport.height = 390;
win.dispatchEvent(new Event('orientationchange'));
check('runtime:orientation-frame', win.frames.size === 1 && runtime.orientationSignals === 1);
win.flushFrames();
check('runtime:landscape', runtime.lastViewport.orientation === 'landscape');

doc.visibilityState = 'hidden';
doc.dispatchEvent(new Event('visibilitychange'));
check('runtime:hidden-is-quiet', doc.documentElement.dataset.cosmosFinalState === 'quiet' && win.frames.size === 0);
doc.visibilityState = 'visible';
doc.dispatchEvent(new Event('visibilitychange'));
check('runtime:visible-schedules-one', win.frames.size === 1);
win.flushFrames();
win.dispatchEvent(new Event('error'));
win.dispatchEvent(new Event('unhandledrejection'));
check('runtime:fault-count-only', runtime.faultSignals === 2 && win.frames.size === 1);
win.flushFrames();

const serialized = JSON.stringify(runtime.status());
for (const canary of canaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
check('runtime:no-navigation-event', !doc.events.some(event => /navigate/i.test(event.type)));
check('runtime:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));
check('runtime:still-sealed', runtime.status().complete === true);
check('runtime:one-orb', runtime.lastAudit.onePhysicalOrb === true);
check('runtime:one-canvas', runtime.lastAudit.oneCanonicalCanvas === true);
check('runtime:one-screen', runtime.lastAudit.oneActiveReality === true);
check('runtime:all-layers', runtime.lastAudit.layersReady === true);

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:no-frame', win.frames.size === 0);
check('destroy:identity-removed', doc.documentElement.dataset.cosmosFinalOrchestra === undefined);
check('destroy:seal-removed', doc.documentElement.dataset.work13Complete === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V610',
  work:'WORK13',
  macroStage:'10-of-10 / final-orchestra-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  iphoneProfiles:contract.iphoneProfiles.length,
  routeSignals:120,
  coalescedSignals:runtime.coalescedSignals,
  privateCanariesRetained:canaries.some(value => serialized.includes(value)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
