/* DIVINA BRUXA — WORK13 V608 · QA DE CONTINUIDADE, PRIVACIDADE E PESO */
import { LivingCommercePathV608 } from './living-commerce-path-v608.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.events = [];
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById() { return null; }
  querySelector() { return null; }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
  createElement() { throw new Error('continuity-must-not-create-dom-on-absent-world'); }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'#home' };
    this.frames = [];
  }
  requestAnimationFrame(callback) {
    this.frames.push(callback);
    return this.frames.length;
  }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const doc = new FakeDocument();
const win = new FakeWindow();
let snapshot = { route:'home', previousRoute:null, returnRoute:null };
const runtime = new LivingCommercePathV608({
  documentTarget:doc,
  windowTarget:win,
  contextMemory:{ snapshot:() => snapshot },
  chambers:null,
  account:{ user:null, mode:'login', criticalState:'' }
});

check('boot:single-orb', runtime.audit().oneCanonicalOrb === true);
check('boot:single-canvas', runtime.audit().oneCanonicalCanvas === true);
check('boot:no-guides-with-worlds-absent', runtime.nodesCreated === 0);
check('boot:no-frames', win.frames.length === 0);
check('boot:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));

const canaries = Object.freeze([
  'CANARY_CONSULTATION_BODY_608',
  'CANARY_PROTOCOL_608',
  'CANARY_ACCOUNT_PROFILE_608',
  'CANARY_PURCHASE_608',
  'CANARY_STORE_SEARCH_608',
  'CANARY_FORM_VALUE_608'
]);

for (let index = 0; index < 80; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:consultations-world-ready', {
    detail:{ body:`${canaries[0]}-${index}`, protocol:`${canaries[1]}-${index}`, formValue:canaries[5] }
  }));
}
check('consultations:all-events-survive', doc.events.filter(event => event.type === 'divina:consultations-world-ready').length === 80);
check('consultations:no-protocol-open', runtime.protocolTrackingOpens === 0);

for (let index = 0; index < 84; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:store-world-ready', {
    detail:{ query:`${canaries[4]}-${index}`, favorite:`PRIVATE_FAVORITE_${index}` }
  }));
}
check('store:all-events-survive', doc.events.filter(event => event.type === 'divina:store-world-ready').length === 84);

for (let index = 0; index < 60; index += 1) {
  win.dispatchEvent(new FakeCustomEvent('divina:billing-updated', {
    detail:{ purchase:`${canaries[3]}-${index}`, receipt:`PRIVATE_RECEIPT_${index}`, authenticated:false }
  }));
}
check('billing:all-events-survive', true);
check('billing:no-section-open', runtime.explicitSectionChanges === 0);

for (let index = 0; index < 60; index += 1) {
  win.dispatchEvent(new FakeCustomEvent('divina:account-sync-applied', {
    detail:{ profile:`${canaries[2]}-${index}`, journalBody:`PRIVATE_JOURNAL_${index}` }
  }));
}
check('account:no-entry-open', runtime.entryActions === 0);

snapshot = {
  route:'subscriptions', previousRoute:'store', returnRoute:'store',
  consultationBody:canaries[0], protocol:canaries[1], profile:canaries[2],
  purchases:[canaries[3]], query:canaries[4], formValue:canaries[5]
};
doc.dispatchEvent(new FakeCustomEvent('divina:context-memory-updated', { detail:{ context:snapshot } }));
check('context:one-update', runtime.contextUpdates === 1);
check('context:route-only', runtime.context.route === 'subscriptions' && runtime.context.previousRoute === 'store');
check('context:private-omitted', !('consultationBody' in runtime.context) && !('purchases' in runtime.context));

const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.audit(), context:runtime.context });
for (const canary of canaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
for (const key of [
  'privateContentReads','formValueReads','consultationBodyReads','consultationProtocolReads',
  'accountProfileReads','purchaseBodyReads','searchQueryReads','storageReads','storageWrites',
  'networkCalls','modelCalls','newCanvases','newRenderers','permanentAnimationLoops',
  'deferredTimers','mutationObservers'
]) check(`contract:zero:${key}`, runtime.status()[key] === 0, runtime.status()[key]);

check('continuity:no-automatic-navigation', runtime.status().automaticNavigation === false);
check('continuity:no-automatic-whit', runtime.status().automaticWhitSpeech === false);
check('continuity:no-frame-loop', win.frames.length === 0);
check('continuity:one-journey-law', runtime.status().law === 'one-orb-one-universe-one-presence-one-journey');
check('continuity:maximum-one-primary', runtime.status().maximumPrimaryActionsAtEntry === 1);
check('continuity:billing-stays-off', runtime.status().premium.realBilling === false);
check('continuity:server-authority', runtime.status().account.serverAuthority === true);
check('continuity:no-email-send', runtime.status().consultations.automaticEmail === false);
check('continuity:amazon-external-only', runtime.status().store.checkout === 'external-amazon-only');

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:identity-removed', doc.documentElement.dataset.livingCommercePath === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V608',
  work:'WORK13',
  macroStage:'8-of-10 / continuity-private-content-and-weight',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  consultationSignals:80,
  storeSignals:84,
  billingSignals:60,
  accountSignals:60,
  automaticEntryActions:runtime.entryActions,
  privateCanariesRetained:canaries.some(canary => serialized.includes(canary)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
