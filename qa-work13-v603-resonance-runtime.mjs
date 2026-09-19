/* DIVINA BRUXA — WORK13 V603 · QA DE RUNTIME DA RESSONANCIA VIVA */
import {
  COSMOS_REALITY_RESONANCE_CONTRACT_V603,
  CosmosRealityResonanceV603,
  deriveRealityResonanceV603
} from './cosmos-reality-resonance-v603.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeStyle {
  constructor() { this.values = new Map(); }
  setProperty(name, value) { this.values.set(name, String(value)); }
  removeProperty(name) { this.values.delete(name); }
  getPropertyValue(name) { return this.values.get(name) || ''; }
}

class FakeElement {
  constructor() {
    this.dataset = {};
    this.style = new FakeStyle();
    this.veil = null;
  }
  querySelector(selector) {
    if (selector === '.db524-universe__veil') return this.veil;
    return null;
  }
}

class FakeDocument extends EventTarget {
  constructor(route = 'home') {
    super();
    this.documentElement = new FakeElement();
    this.body = { dataset:{ screen:route } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.universeRoot = new FakeElement();
    this.universeRoot.veil = new FakeElement();
  }
  getElementById(id) { return id === 'divinaLivingUniverseV524' ? this.universeRoot : null; }
  querySelector(selector) {
    if (selector === '#divinaLivingUniverseV524') return this.universeRoot;
    if (selector.includes('.screen.active')) return { id:this.body.dataset.screen };
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas' || selector === '#divinaLivingUniverseV524 canvas') return [{}];
    return [];
  }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'' };
    this.reduce = false;
  }
  matchMedia() { return { matches:this.reduce }; }
}

const emit = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});

check('contract:version', COSMOS_REALITY_RESONANCE_CONTRACT_V603.version === 603);
check('contract:base-v602', COSMOS_REALITY_RESONANCE_CONTRACT_V603.base.startsWith('V602-context-memory'));
check('contract:public-input', COSMOS_REALITY_RESONANCE_CONTRACT_V603.inputModel === 'public-route-and-public-phase-only');
check('contract:seventeen-routes', COSMOS_REALITY_RESONANCE_CONTRACT_V603.routeSignatures.length === 17);
check('contract:one-universe', COSMOS_REALITY_RESONANCE_CONTRACT_V603.reusesExistingUniverse === true);
check('contract:one-veil', COSMOS_REALITY_RESONANCE_CONTRACT_V603.reusesExistingVeil === true);
check('contract:no-navigation', COSMOS_REALITY_RESONANCE_CONTRACT_V603.automaticNavigation === false);
check('contract:no-whit', COSMOS_REALITY_RESONANCE_CONTRACT_V603.automaticWhitSpeech === false);
check('contract:no-private', COSMOS_REALITY_RESONANCE_CONTRACT_V603.privateContentReads === 0);
check('contract:no-card', COSMOS_REALITY_RESONANCE_CONTRACT_V603.cardIdentityReads === 0);
check('contract:no-storage', COSMOS_REALITY_RESONANCE_CONTRACT_V603.storageReads === 0 && COSMOS_REALITY_RESONANCE_CONTRACT_V603.storageWrites === 0);
check('contract:no-network-model', COSMOS_REALITY_RESONANCE_CONTRACT_V603.networkCalls === 0 && COSMOS_REALITY_RESONANCE_CONTRACT_V603.modelCalls === 0);
check('contract:no-matter', COSMOS_REALITY_RESONANCE_CONTRACT_V603.newDomNodes === 0 && COSMOS_REALITY_RESONANCE_CONTRACT_V603.newCanvases === 0 && COSMOS_REALITY_RESONANCE_CONTRACT_V603.newRenderers === 0);
check('contract:no-clock', COSMOS_REALITY_RESONANCE_CONTRACT_V603.permanentAnimationLoops === 0 && COSMOS_REALITY_RESONANCE_CONTRACT_V603.deferredTimers === 0);

const routeModes = new Set();
for (const route of COSMOS_REALITY_RESONANCE_CONTRACT_V603.routeSignatures) {
  const profile = deriveRealityResonanceV603({ route });
  routeModes.add(profile.mode);
  check(`profile:${route}:route`, profile.route === route, profile.route);
  check(`profile:${route}:accent-bounded`, profile.accent >= 0.8 && profile.accent <= 6.2, profile.accent);
  check(`profile:${route}:warmth-bounded`, profile.warmth >= 0.4 && profile.warmth <= 5.4, profile.warmth);
  check(`profile:${route}:focus-bounded`, profile.focusX >= 0 && profile.focusX <= 100 && profile.focusY >= 0 && profile.focusY <= 100);
}
check('profile:distinct-modes', routeModes.size === 17, routeModes.size);

const silence = deriveRealityResonanceV603({ route:'daily', phase:'silence' });
const essence = deriveRealityResonanceV603({ route:'daily', phase:'essence' });
const travel = deriveRealityResonanceV603({ route:'daily', phase:'essence', pendingRoute:'journal' });
const constrained = deriveRealityResonanceV603({ route:'skins', phase:'engaged', constrained:true });
check('phase:silence-state', silence.state === 'silence');
check('phase:silence-quieter', silence.accent < essence.accent);
check('phase:essence-warmer', essence.warmth > silence.warmth);
check('phase:travel-state', travel.state === 'travel' && travel.mode === 'passage');
check('phase:travel-uses-destination-focus', travel.focusX === deriveRealityResonanceV603({ route:'journal' }).focusX);
check('quality:accent-capped', constrained.accent <= 3.2, constrained.accent);
check('quality:warmth-capped', constrained.warmth <= 2.8, constrained.warmth);

const doc = new FakeDocument('home');
const win = new FakeWindow();
let context = {
  route:'home',
  pendingRoute:null,
  experience:{ kind:'origin', phase:'entered', active:false }
};
const memory = { snapshot:() => context };
const universe = { root:doc.universeRoot };
const resonance = new CosmosRealityResonanceV603({
  universe,
  contextMemory:memory,
  documentTarget:doc,
  windowTarget:win
});

check('boot:identity', doc.documentElement.dataset.cosmosResonance === 'v603');
check('boot:macro-three', doc.documentElement.dataset.work13Macro === '3-reality-resonance');
check('boot:route-home', resonance.snapshot().route === 'home');
check('boot:mode-origin', resonance.snapshot().mode === 'origin');
check('boot:whit-silent', doc.documentElement.dataset.cosmosResonanceWhit === 'silent');
check('boot:existing-veil', doc.documentElement.dataset.cosmosResonanceMatter === 'existing-veil-only');
check('boot:veil-marked', doc.universeRoot.dataset.cosmosResonance === 'v603');
check('boot:style-focus', doc.universeRoot.veil.style.getPropertyValue('--db603-focus-x') === '50%');
check('boot:style-accent', doc.universeRoot.veil.style.getPropertyValue('--db603-accent-strength') === '2.2%');

emit(doc, 'divina:route-start', { id:'daily', privateText:'NAO-LER' });
check('travel:state', resonance.snapshot().state === 'travel');
check('travel:pending', resonance.snapshot().pendingRoute === 'daily');
check('travel:no-private-snapshot', !JSON.stringify(resonance.snapshot()).includes('NAO-LER'));

context = {
  route:'daily',
  pendingRoute:null,
  experience:{ kind:'daily-reading', phase:'entered', active:true }
};
doc.body.dataset.screen = 'daily';
emit(doc, 'divina:context-memory-updated', { context, privateText:'SEGREDO-NAO-LER' });
check('daily:route', resonance.snapshot().route === 'daily');
check('daily:mode-dawn', resonance.snapshot().mode === 'dawn');
check('daily:no-secret', !JSON.stringify(resonance.status()).includes('SEGREDO-NAO-LER'));
check('daily:warm-veil', doc.universeRoot.veil.style.getPropertyValue('--db603-warm-strength') === '4.6%');

context = {
  route:'daily',
  pendingRoute:null,
  experience:{ kind:'daily-reading', phase:'essence', active:true }
};
emit(doc, 'divina:context-memory-updated', { context, card:{ name:'NAO-LER' } });
check('essence:state', resonance.snapshot().state === 'essence');
check('essence:phase', resonance.snapshot().phase === 'essence');
check('essence:no-card', !JSON.stringify(resonance.status()).includes('NAO-LER'));

doc.documentElement.dataset.performanceTier = 'constrained';
emit(win, 'divina:performance-tier', { tier:'constrained' });
check('constrained:profile', resonance.snapshot().profile.constrained === true);
check('constrained:accent', resonance.snapshot().profile.accent <= 3.2);
check('constrained:warmth', resonance.snapshot().profile.warmth <= 2.8);

win.reduce = true;
emit(doc, 'divina:visual-quality', { profile:'protected' });
check('reduced:meaning-kept', resonance.snapshot().profile.reducedMotion === true && resonance.snapshot().route === 'daily');

const audit = resonance.audit();
check('audit:one-orb', audit.oneCanonicalOrb === true);
check('audit:one-canvas', audit.oneCanonicalCanvas === true);
check('audit:one-universe-canvas', audit.oneUniverseCanvas === true);
check('audit:no-whit', audit.automaticWhitSpeech === false);
check('audit:no-navigation', audit.automaticNavigation === false);
check('audit:no-private', audit.privateContentReads === 0 && audit.formValueReads === 0 && audit.journalBodyReads === 0);
check('audit:no-matter', audit.newDomNodes === 0 && audit.newCanvases === 0 && audit.newRenderers === 0);
check('audit:no-clock', audit.permanentAnimationLoops === 0 && audit.deferredTimers === 0 && audit.mutationObservers === 0);

const appliedBeforeDestroy = resonance.status().applies;
check('runtime:multiple-applies', appliedBeforeDestroy >= 5, appliedBeforeDestroy);
check('runtime:no-universe-method-calls', Object.keys(universe).join(',') === 'root');

resonance.destroy();
check('destroy:marked', resonance.status().destroyed === true);
check('destroy:identity-removed', !doc.documentElement.dataset.cosmosResonance);
check('destroy:surface-removed', !doc.universeRoot.dataset.cosmosResonance);
check('destroy:variables-removed', doc.universeRoot.veil.style.getPropertyValue('--db603-focus-x') === '');
const appliesAfterDestroy = resonance.status().applies;
emit(doc, 'divina:context-memory-updated', { context:{ route:'music', experience:{ phase:'entered' } } });
check('destroy:listeners-aborted', resonance.status().applies === appliesAfterDestroy);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V603',
  work:'WORK13',
  macroStage:'3-of-10 / reality-resonance-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  routeSignatures:COSMOS_REALITY_RESONANCE_CONTRACT_V603.routeSignatures.length,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
