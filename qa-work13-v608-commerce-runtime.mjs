/* DIVINA BRUXA — WORK13 V608 · QA DE RUNTIME DA CLAREZA VIVA */
import {
  LIVING_COMMERCE_PATH_CONTRACT_V608,
  LivingCommercePathV608,
  commerceEntryCopyV608,
  normalizeCommerceRouteV608,
  recommendedPremiumSectionV608
} from './living-commerce-path-v608.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeScreen {
  constructor(id) {
    this.id = id;
    this.dataset = {};
  }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.nodes = new Map([
      ['consultations',new FakeScreen('consultations')],
      ['store',new FakeScreen('store')],
      ['subscriptions',new FakeScreen('subscriptions')],
      ['login',new FakeScreen('login')]
    ]);
    this.events = [];
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById(id) { return this.nodes.get(id) || null; }
  querySelector() { return null; }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
  createElement() { throw new Error('no-guide-dom-without-app-roots'); }
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
  flushFrames(limit = 20) {
    let count = 0;
    while (this.frames.length && count < limit) {
      this.frames.splice(0).forEach(callback => callback(count * 16));
      count += 1;
    }
    return count;
  }
}

const actionEvent = action => ({
  target:{ closest:selector => selector === '[data-v608-action]' ? { dataset:{ v608Action:action } } : null }
});

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const contract = LIVING_COMMERCE_PATH_CONTRACT_V608;

check('contract:version', contract.version === 608);
check('contract:base-v607', contract.base.startsWith('V607-living-wisdom'));
check('contract:stage-eight', contract.work === 'WORK13' && contract.macroStage === '8-of-10');
check('contract:one-law', contract.law === 'one-orb-one-universe-one-presence-one-journey');
check('contract:four-worlds', contract.worlds.join('|') === 'consultations|store|subscriptions|login');
check('contract:sequence', contract.sequence.join('|') === 'one-clear-entry|explicit-choice|existing-engine|one-natural-next-step');
check('contract:context-v602', contract.contextModel === 'V602-public-route-metadata-only');
check('contract:one-primary', contract.maximumPrimaryActionsAtEntry === 1);
check('contract:consultations-engine', contract.consultations.engine === 'V558');
check('contract:consultation-prices', contract.consultations.priceCents.join(',') === '25000,20000,15000,5000');
check('contract:consultation-contact', contract.consultations.contact === 'orbedasrealidades@hotmail.com');
check('contract:consultation-no-auto', contract.consultations.automaticEmail === false && contract.consultations.automaticBilling === false);
check('contract:store-engine', contract.store.engine === 'V543');
check('contract:store-products', contract.store.productsPreserved === 21);
check('contract:store-affiliate', contract.store.associateTag === 'orbedasrealid-20');
check('contract:store-external', contract.store.checkout === 'external-amazon-only' && contract.store.mutablePriceClaims === 0);
check('contract:premium-engine', contract.premium.engine === 'V191');
check('contract:premium-truth', contract.premium.premiumLifetimeCents === 19990 && contract.premium.aiMonthlyCents === 8990 && contract.premium.aiCreditsPerCycle === 400);
check('contract:credit-packs', JSON.stringify(contract.premium.extraCreditPacks) === JSON.stringify([[200,3990],[600,9990],[1500,19990]]));
check('contract:no-real-billing', contract.premium.realBilling === false && contract.premium.frontendEntitlementGrants === false);
check('contract:account-engine', contract.account.engine === 'V201' && contract.account.existingGuideReused === 'AccountWorldV319');
check('contract:account-authority', contract.account.serverAuthority === true && contract.account.journalCloudConsentDefault === false);
check('contract:no-auto-navigation', contract.automaticNavigation === false);
check('contract:no-auto-whit', contract.automaticWhitSpeech === false && contract.whitTimingAuthority === 'V606-unchanged');
check('contract:engines-preserved', JSON.stringify(contract.existingEnginesPreserved) === JSON.stringify({ consultations:'V558', store:'V543', premium:'V191', account:'V201' }));
for (const key of [
  'privateContentReads','formValueReads','consultationBodyReads','consultationProtocolReads',
  'accountProfileReads','purchaseBodyReads','searchQueryReads','storageReads','storageWrites',
  'networkCalls','modelCalls','newCanvases','newRenderers','permanentAnimationLoops',
  'deferredTimers','mutationObservers'
]) check(`contract:zero:${key}`, contract[key] === 0, contract[key]);
check('contract:no-emotion-inference', contract.emotionInference === false);
check('contract:three-new-surfaces-max', contract.maximumNewGuideSurfaces === 3);
check('contract:iphone-first', contract.iphoneFirst === true && contract.reducedMotionPreservesMeaning === true);

check('pure:normalizes-hash', normalizeCommerceRouteV608('#subscriptions?x=1') === 'subscriptions');
check('pure:normalizes-empty', normalizeCommerceRouteV608('') === 'home');
check('pure:premium-default', recommendedPremiumSectionV608({ previousRoute:'home' }, false) === 'premium');
check('pure:premium-ai-origin', recommendedPremiumSectionV608({ previousRoute:'ai' }, false) === 'ai');
check('pure:premium-account', recommendedPremiumSectionV608({ previousRoute:'home' }, true) === 'access');
check('copy:consultations-from-reading', commerceEntryCopyV608('consultations', { previousRoute:'daily' }, false).title.includes('cuidado humano'));
check('copy:consultations-price-range', commerceEntryCopyV608('consultations', {}, false).facts.includes('R$ 50 a R$ 250'));
check('copy:store-intention-first', commerceEntryCopyV608('store', {}, false).primary === 'Escolher uma intenção');
check('copy:store-external', commerceEntryCopyV608('store', {}, false).facts.includes('preço e estoque na Amazon'));
check('copy:premium-one-time', commerceEntryCopyV608('subscriptions', {}, false).copy.includes('R$ 199,90 uma vez'));
check('copy:ai-separate', commerceEntryCopyV608('subscriptions', { previousRoute:'ai' }, false).copy.includes('R$ 89,90 por mês'));
check('copy:authenticated-access', commerceEntryCopyV608('subscriptions', {}, true).primary === 'Ver meus acessos');

const doc = new FakeDocument();
const win = new FakeWindow();
let contextSnapshot = { route:'home', previousRoute:null, returnRoute:null };
const contextMemory = { snapshot:() => contextSnapshot };
const chamberCalls = [];
const account = { user:null, mode:'login', criticalState:'' };
const runtime = new LivingCommercePathV608({
  contextMemory,
  chambers:{ setState:(...args) => { chamberCalls.push(args); return true; } },
  account,
  documentTarget:doc,
  windowTarget:win
});

check('runtime:identity', doc.documentElement.dataset.livingCommercePath === 'v608');
check('runtime:macro-identity', doc.documentElement.dataset.work13Macro === '8-commerce-clarity-path');
check('runtime:privacy-identity', doc.documentElement.dataset.livingCommercePrivacy === 'public-route-and-auth-boolean-only');
check('runtime:ready-event', doc.events.some(event => event.type === 'divina:living-commerce-ready'));
check('runtime:no-nodes-without-app-roots', runtime.nodesCreated === 0);
check('runtime:account-guide-mode', doc.getElementById('login').dataset.v608CommerceMode === 'guide');
check('runtime:one-orb', runtime.audit().oneCanonicalOrb === true);
check('runtime:one-canvas', runtime.audit().oneCanonicalCanvas === true);

doc.dispatchEvent(new FakeCustomEvent('divina:reality-chamber-state', {
  detail:{ route:'consultations', state:'present', mode:'choice', reason:'chamber-born', privateQuestion:'CANARY_QUESTION_608' }
}));
check('consultations:guide-after-chamber', doc.getElementById('consultations').dataset.v608CommerceMode === 'guide');
runtime.onClick(actionEvent('consultations-start'));
check('consultations:explicit-choices', doc.getElementById('consultations').dataset.v608CommerceMode === 'choices');
check('consultations:existing-chamber-reused', chamberCalls.some(call => call[0] === 'consultations' && call[1] === 'present' && call[2] === 'choice'));
check('consultations:one-entry-count', runtime.entryActions === 1);

doc.dispatchEvent(new FakeCustomEvent('divina:reality-chamber-state', {
  detail:{ route:'consultations', state:'engaged', mode:'request', reason:'consultation-selected' }
}));
check('consultations:request-mode', doc.getElementById('consultations').dataset.v608CommerceMode === 'request');
runtime.onClick(actionEvent('consultations-track'));
check('consultations:tracking-explicit', doc.getElementById('consultations').dataset.v608CommerceMode === 'tracking' && runtime.protocolTrackingOpens === 1);

doc.dispatchEvent(new FakeCustomEvent('divina:reality-chamber-state', {
  detail:{ route:'store', state:'present', mode:'choice', reason:'chamber-born', search:'CANARY_SEARCH_608' }
}));
check('store:guide-after-chamber', doc.getElementById('store').dataset.v608CommerceMode === 'guide');
runtime.onClick(actionEvent('store-start'));
check('store:intentions-explicit', doc.getElementById('store').dataset.v608CommerceMode === 'intentions');
check('store:existing-chamber-reused', chamberCalls.some(call => call[0] === 'store' && call[1] === 'present' && call[2] === 'choice'));
doc.dispatchEvent(new FakeCustomEvent('divina:reality-chamber-state', {
  detail:{ route:'store', state:'engaged', mode:'catalog', reason:'store-intention-selected' }
}));
check('store:catalog-after-intention', doc.getElementById('store').dataset.v608CommerceMode === 'catalog');

contextSnapshot = { route:'subscriptions', previousRoute:'ai', returnRoute:'ai', privatePurchase:'CANARY_PURCHASE_608' };
doc.dispatchEvent(new FakeCustomEvent('divina:context-memory-updated', { detail:{ context:contextSnapshot } }));
doc.dispatchEvent(new FakeCustomEvent('divina:route-ready', { detail:{ id:'subscriptions' } }));
check('premium:guide-on-entry', doc.getElementById('subscriptions').dataset.v608CommerceMode === 'guide');
check('premium:ai-recommended', doc.getElementById('subscriptions').dataset.v608PremiumSection === 'ai');
runtime.onClick(actionEvent('subscriptions-primary'));
check('premium:recommended-section-opens', doc.getElementById('subscriptions').dataset.v608CommerceMode === 'detail' && doc.getElementById('subscriptions').dataset.v608PremiumSection === 'ai');
runtime.onClick(actionEvent('subscriptions-premium'));
check('premium:explicit-premium-section', doc.getElementById('subscriptions').dataset.v608PremiumSection === 'premium');
runtime.onClick(actionEvent('subscriptions-access'));
check('premium:explicit-access-section', doc.getElementById('subscriptions').dataset.v608PremiumSection === 'access');
win.flushFrames();

win.dispatchEvent(new FakeCustomEvent('divina:auth-state', { detail:{ event:'SIGNED_IN', session:{ user:{ id:'PUBLIC_BOOLEAN_ONLY' } } } }));
check('account:auth-boolean-only', runtime.authenticated === true && doc.getElementById('login').dataset.v608Auth === 'authenticated');
runtime.onClick({ target:{ closest:selector => selector === '#login [data-acw319-main]' ? {} : null } });
check('account:explicit-detail', doc.getElementById('login').dataset.v608CommerceMode === 'detail');
win.dispatchEvent(new FakeCustomEvent('divina:auth-state', { detail:{ event:'SIGNED_OUT', session:null } }));
check('account:signed-out-boolean', runtime.authenticated === false && doc.getElementById('login').dataset.v608Auth === 'guest');

account.mode = 'reset';
runtime.enterRoute('login', 'recovery-link');
check('account:reset-is-immediate', doc.getElementById('login').dataset.v608CommerceMode === 'direct');
account.mode = 'login';
account.criticalState = 'expired';
runtime.enterRoute('login', 'critical-state');
check('account:critical-is-immediate', doc.getElementById('login').dataset.v608CommerceMode === 'direct');

const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.audit(), context:runtime.context });
for (const canary of ['CANARY_QUESTION_608','CANARY_SEARCH_608','CANARY_PURCHASE_608']) {
  check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
}
check('runtime:no-auto-navigation-event', !doc.events.some(event => /navigate/i.test(event.type)));
check('runtime:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));
check('runtime:no-timers', !('timer' in runtime));
check('runtime:no-observers', !('observer' in runtime));

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:identity-removed', doc.documentElement.dataset.livingCommercePath === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V608',
  work:'WORK13',
  macroStage:'8-of-10 / commerce-clarity-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  entryActions:runtime.entryActions,
  premiumSectionChanges:runtime.explicitSectionChanges,
  protocolTrackingOpens:runtime.protocolTrackingOpens,
  privateCanariesRetained:['CANARY_QUESTION_608','CANARY_SEARCH_608','CANARY_PURCHASE_608'].some(value => serialized.includes(value)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
