/* DIVINA BRUXA — WORK13 V602 · QA DE RUNTIME DA MEMORIA DE CONTEXTO */
import {
  COSMOS_CONTEXT_MEMORY_CONTRACT_V602,
  CosmosContextMemoryV602,
  deriveNaturalNextV602
} from './cosmos-context-memory-v602.js';

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  get length() { return this.map.size; }
}

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor(route = 'home') {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:route } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
  }
  querySelector(selector) {
    if (selector.includes('.screen.active')) return { id:this.body.dataset.screen };
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
}

class FakeWindow extends EventTarget {
  constructor(storage) {
    super();
    this.sessionStorage = storage;
    this.location = { hash:'' };
  }
}

const emit = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});

const storage = new MemoryStorage();
const doc = new FakeDocument('home');
const win = new FakeWindow(storage);
let clock = 1_800_000_000_000;
const memory = new CosmosContextMemoryV602({ documentTarget:doc, windowTarget:win, storage, now:() => clock });

check('contract:version', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.version === 602);
check('contract:base', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.base === 'WORK12-V600-frozen-by-V601');
check('contract:one-next', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.maximumSuggestedSteps === 1);
check('contract:no-auto-navigation', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.automaticNavigation === false);
check('contract:no-auto-whit', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.automaticWhitSpeech === false);
check('contract:no-private-content', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.privateContentReads === 0);
check('contract:no-form-values', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.formValueReads === 0);
check('contract:no-card-identity', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.cardIdentityReads === 0);
check('contract:no-loop', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.permanentAnimationLoops === 0);
check('contract:no-timer', COSMOS_CONTEXT_MEMORY_CONTRACT_V602.deferredTimers === 0);

check('boot:route-home', memory.snapshot().route === 'home');
check('boot:silence', memory.nextStep() === null);
check('boot:path-home', memory.snapshot().path.join(',') === 'home');
check('boot:identity', doc.documentElement.dataset.cosmosContextMemory === 'v602');
check('boot:storage-one-key', storage.length === 1, storage.length);
check('boot:audit-one-orb', memory.audit().oneCanonicalOrb === true);
check('boot:audit-one-canvas', memory.audit().oneCanonicalCanvas === true);

emit(doc, 'divina:route-start', { id:'daily', source:'test' });
check('travel:keeps-current', memory.snapshot().route === 'home');
check('travel:pending-daily', memory.snapshot().pendingRoute === 'daily');
check('travel:explicit-intent', memory.snapshot().lastIntent === 'daily');

doc.body.dataset.screen = 'daily';
clock += 100;
emit(doc, 'divina:route-ready', { id:'daily', source:'test' });
check('daily:committed', memory.snapshot().route === 'daily');
check('daily:origin-home', memory.snapshot().originRoute === 'home');
check('daily:return-home', memory.snapshot().returnRoute === 'home');
check('daily:no-premature-next', memory.nextStep() === null);

clock += 100;
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'essence', privateText:'SEGREDO-NAO-LER' });
check('daily:essence-phase', memory.snapshot().experience.phase === 'essence');
check('daily:one-next', memory.nextStep()?.route === 'journal');
check('daily:next-intention', memory.nextStep()?.intention === 'keep');
check('daily:no-secret-persisted', !storage.getItem('divina.work13.context.v602').includes('SEGREDO-NAO-LER'));

emit(doc, 'divina:route-start', { id:'journal', source:'next-step', value:'NAO-LER' });
doc.body.dataset.screen = 'journal';
clock += 100;
emit(doc, 'divina:route-ready', { id:'journal', source:'test' });
check('journal:committed', memory.snapshot().route === 'journal');
check('journal:origin-daily', memory.snapshot().originRoute === 'daily');
check('journal:return-daily', memory.nextStep()?.route === 'daily');
check('journal:resume-only', memory.nextStep()?.intention === 'resume');
check('journal:no-field-value', !storage.getItem('divina.work13.context.v602').includes('NAO-LER'));
check('journal:protected-route-only', doc.documentElement.dataset.cosmosContextPrivacy === 'protected-route-only');

clock += 100;
emit(doc, 'divina:skin-applied', { id:'cosmic', account:{ name:'NAO-LER' } });
check('skin:public-id-only', memory.snapshot().skin === 'cosmic');
check('skin:no-profile', !storage.getItem('divina.work13.context.v602').includes('NAO-LER'));

const storedBeforeRestore = storage.getItem('divina.work13.context.v602');
memory.destroy();
const restoredDoc = new FakeDocument('journal');
const restoredWin = new FakeWindow(storage);
clock += 100;
const restored = new CosmosContextMemoryV602({
  documentTarget:restoredDoc,
  windowTarget:restoredWin,
  storage,
  now:() => clock
});
check('restore:payload-existed', Boolean(storedBeforeRestore));
check('restore:route-journal', restored.snapshot().route === 'journal');
check('restore:return-daily', restored.nextStep()?.route === 'daily');
check('restore:skin-cosmic', restored.snapshot().skin === 'cosmic');
check('restore:single-read', restored.status().storageReads === 1, restored.status().storageReads);
check('restore:no-error', restored.status().storageErrors === 0, restored.status().storageErrors);

const staticCases = [
  ['tarot','essence','library','discover'],
  ['daily','depth','journal','keep'],
  ['spreads','synthesis','journal','keep'],
  ['library','entered','school','learn'],
  ['consultations','entered',null,null],
  ['store','entered',null,null],
  ['music','entered',null,null]
];
for (const [route, phase, expectedRoute, expectedIntention] of staticCases) {
  const next = deriveNaturalNextV602({ route, experience:{ phase }, previousRoute:'home' });
  check(`next:${route}:${phase}:route`, (next?.route || null) === expectedRoute, next?.route || 'silence');
  check(`next:${route}:${phase}:intention`, (next?.intention || null) === expectedIntention, next?.intention || 'silence');
}

const cleared = restored.clear();
check('clear:route-preserved', cleared.route === 'journal');
check('clear:previous-removed', cleared.previousRoute === null);
check('clear:next-silent', cleared.next === null);
check('clear:storage-removed', storage.getItem('divina.work13.context.v602') === null);

const expiredStorage = new MemoryStorage({
  'divina.work13.context.v602':JSON.stringify({
    version:602,
    route:'daily',
    savedAt:clock - (7 * 60 * 60 * 1000),
    path:['daily']
  })
});
const expiredDoc = new FakeDocument('home');
const expired = new CosmosContextMemoryV602({
  documentTarget:expiredDoc,
  windowTarget:new FakeWindow(expiredStorage),
  storage:expiredStorage,
  now:() => clock
});
check('expiry:does-not-resume', expired.snapshot().previousRoute === null);
check('expiry:starts-home', expired.snapshot().route === 'home');
check('expiry:silence', expired.nextStep() === null);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V602',
  work:'WORK13',
  macroStage:'2-of-10 / context-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  storageModel:'session-route-metadata-only',
  automaticNavigation:false,
  automaticWhitSpeech:false,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
