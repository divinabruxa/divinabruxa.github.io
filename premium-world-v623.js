/* DIVINA BRUXA — WORK13 · PREMIUM · SALA DAS CHAVES · V623
   Camada de mundo sobre Premium V191 e Clareza V608. Organiza chegada,
   escolha e confirmação sem ler billing, conceder direitos ou criar outra Orbe. */

const VERSION = 623;
const STYLE_ID = 'divinaPremiumWorldV623';
const STYLE_HREF = './premium-world-v623.css?v=623-sala-das-chaves';
const INSTANCE = Symbol.for('divina.work13.premium.world.v623');
const PHASES = new Set([
  'rest','threshold','invitation','keys','premium','ai','access','confirmation',
  'settled','portal','travel','silence'
]);

export const PREMIUM_WORLD_CONTRACT_V623 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'subscriptions',
  name:'Premium',
  universe:'sala-das-chaves',
  identity:'obsidian-champagne-gold-peacock-teal-ivory',
  sequence:Object.freeze([
    'arrival','one-clear-intention','three-explicit-keys','one-explicit-chamber',
    'price-truth','staging-action','server-confirmed-rights','return','silence'
  ]),
  premiumAuthority:'V191-preserved',
  livingCommerceAuthority:'V608-preserved',
  premiumLifetimeCents:19990,
  premiumBillingMode:'one-time',
  skinsIncluded:30,
  aiIncludedInPremium:false,
  aiMonthlyCents:8990,
  aiCreditsPerCycle:400,
  aiModels:Object.freeze({ Luna:1,Terra:10,Sol:'off' }),
  extraCreditPacks:Object.freeze([[200,3990],[600,9990],[1500,19990]]),
  sections:Object.freeze(['premium','ai','access']),
  environment:'staging',
  simulatorOnly:true,
  cardDataCollected:false,
  pixDataCollected:false,
  realBilling:false,
  stripeCheckout:false,
  stripeWebhook:false,
  customerPortal:false,
  automaticTax:false,
  serverAuthority:true,
  frontendEntitlementGrants:false,
  restorePreserved:true,
  refundPreserved:true,
  revokePreserved:true,
  cancelSubscriptionPreserved:true,
  existingPremiumBodyReused:true,
  separatePremiumBody:false,
  billingFunctionChanges:0,
  entitlementChanges:0,
  productChanges:0,
  priceChanges:0,
  accountChanges:0,
  privateByDefault:true,
  billingPayloadReads:0,
  paymentDataReads:0,
  accountDataReads:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  visibleCopyChanges:1,
  newVisibleDomNodes:0,
  newImages:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  deferredTimers:0,
  work14:false
});

const normalizeRoute = value => String(value || 'home')
  .trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0] || 'home';

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const normalizePhase = value => {
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const emit = (doc,type,detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{ detail:Object.freeze(detail) }));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class PremiumWorldV623 {
  constructor({
    premiumEngine = globalThis.divinaPremiumEngineV191,
    livingCommerce = globalThis.divinaLivingCommercePathV608,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.premiumEngine = premiumEngine || null;
    this.livingCommerce = livingCommerce || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('subscriptions') || null;
    this.app = this.documentTarget?.getElementById?.('subscriptionApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.selectedKey = '';
    this.publicSignals = 0;
    this.entrySignals = 0;
    this.keySignals = 0;
    this.actionSignals = 0;
    this.billingSignals = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:premium-world-v623-ready',this.publicStatus());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement?.('link');
    if (!link) return false;
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append?.(link);
    return true;
  }

  installIdentity() {
    if (this.root?.dataset) this.root.dataset.work13PremiumWorld = 'v623';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.premiumWorld = 'v623';
    this.screen.dataset.premiumUniverse = 'sala-das-chaves';
    this.screen.dataset.premiumWorldPhase = 'rest';
    this.screen.dataset.premiumWorldPresence = 'away';
    this.screen.dataset.premiumWorldSequence = 'arrival-intention-keys-chamber-price-staging-server-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.premiumWorldCopy !== 'v623') {
      title.textContent = 'Escolha somente a chave que abre o que você quer viver.';
      title.dataset.premiumWorldCopy = 'v623';
    }
    return true;
  }

  listen(target,type,handler,options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? { ...options,signal } : options);
  }

  isActive() {
    return this.route === 'subscriptions' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('subscriptions') || null;
    const nextApp = this.documentTarget?.getElementById?.('subscriptionApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.premiumWorld = 'v623';
      this.app.dataset.premiumUniverse = 'sala-das-chaves';
      this.app.dataset.premiumWorldPhase = this.phase;
      this.app.dataset.premiumWorldPrivacy = 'billing-account-payment-private-unread';
    }
    return this.app;
  }

  arrivalPhase() {
    const mode = String(this.screen?.dataset?.v608CommerceMode || 'guide');
    const section = String(this.screen?.dataset?.v608PremiumSection || '');
    if (mode !== 'detail') return 'invitation';
    return ['premium','ai','access'].includes(section) ? section : 'keys';
  }

  setPhase(next,reason = 'public-signal') {
    this.phase = normalizePhase(next);
    if (this.screen?.dataset) {
      this.screen.dataset.premiumWorldPhase = this.phase;
      this.screen.dataset.premiumWorldReason = String(reason || 'public-signal');
      this.screen.dataset.premiumWorldPresence = this.isActive() ? 'present' : 'away';
      if (this.selectedKey) this.screen.dataset.premiumWorldKey = this.selectedKey;
      else delete this.screen.dataset.premiumWorldKey;
    }
    if (this.app?.dataset) this.app.dataset.premiumWorldPhase = this.phase;
    emit(this.documentTarget,'divina:premium-world-v623-state',this.publicStatus());
    return this.phase;
  }

  sync(reason = 'sync') {
    this.attach();
    if (!this.isActive()) return this.setPhase('rest',reason);
    return this.setPhase(this.arrivalPhase(),reason);
  }

  onRouteStart(event) {
    const next = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || '');
    this.publicSignals += 1;
    if (this.isActive() && next !== 'subscriptions') this.setPhase('travel','route-start');
  }

  onRouteReady(event) {
    this.route = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget,this.windowTarget));
    this.publicSignals += 1;
    this.selectedKey = '';
    this.sync('route-ready');
  }

  onCommerce(event) {
    if (normalizeRoute(event?.detail?.route) !== 'subscriptions') return false;
    this.publicSignals += 1;
    if (!this.isActive()) return false;
    const mode = String(event?.detail?.mode || '').toLowerCase();
    if (mode === 'guide') return this.setPhase('invitation','commerce-guide');
    if (mode === 'detail' && !this.selectedKey) return this.setPhase('keys','commerce-detail');
    return this.setPhase(this.selectedKey || this.arrivalPhase(),'commerce-state');
  }

  chooseKey(key,reason = 'explicit-key') {
    if (!['premium','ai','access'].includes(key)) return false;
    this.selectedKey = key;
    this.keySignals += 1;
    return this.setPhase(key,reason);
  }

  onClick(event) {
    if (!this.isActive()) return false;
    const target = event?.target;
    const action = target?.closest?.('[data-v608-action]')?.dataset?.v608Action || '';
    if (action === 'subscriptions-primary') {
      this.entrySignals += 1;
      this.selectedKey = '';
      return this.setPhase('keys','explicit-entry');
    }
    if (action === 'subscriptions-premium') return this.chooseKey('premium');
    if (action === 'subscriptions-ai') return this.chooseKey('ai');
    if (action === 'subscriptions-access') return this.chooseKey('access');
    if (target?.closest?.('[data-purchase]')) {
      this.actionSignals += 1;
      return this.setPhase('confirmation','explicit-staging-action');
    }
    if (target?.closest?.('[data-restore]')) {
      this.actionSignals += 1;
      return this.chooseKey('access','explicit-restore');
    }
    if (target?.closest?.('[data-refund],[data-revoke],[data-cancel-subscription]')) {
      this.actionSignals += 1;
      return this.setPhase('confirmation','explicit-lifecycle-action');
    }
    return false;
  }

  onBillingUpdated() {
    this.publicSignals += 1;
    this.billingSignals += 1;
    if (!this.isActive()) return false;
    return this.setPhase('settled','server-public-update');
  }

  onMenu(event) {
    if (!this.isActive()) return false;
    this.publicSignals += 1;
    const state = String(event?.detail?.state || event?.detail?.phase || '').toLowerCase();
    if (/open|opening|visible|active/.test(state)) return this.setPhase('portal','menu-open');
    if (/close|closed|hidden|idle/.test(state)) return this.setPhase(this.selectedKey || this.arrivalPhase(),'menu-close');
    return false;
  }

  bind() {
    const doc = this.documentTarget;
    this.listen(doc,'click',event => this.onClick(event));
    this.listen(doc,'divina:route-start',event => this.onRouteStart(event));
    this.listen(doc,'divina:route-ready',event => this.onRouteReady(event));
    this.listen(doc,'divina:living-commerce-state',event => this.onCommerce(event));
    this.listen(doc,'divina:billing-updated',() => this.onBillingUpdated());
    this.listen(doc,'divina:menu-state',event => this.onMenu(event));
    this.listen(doc,'divina:portal-state',event => this.onMenu(event));
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      work:'WORK13',
      reality:'subscriptions',
      universe:'sala-das-chaves',
      route:this.route,
      phase:this.phase,
      selectedKey:this.selectedKey || null,
      present:this.isActive(),
      publicSignals:this.publicSignals,
      entrySignals:this.entrySignals,
      keySignals:this.keySignals,
      actionSignals:this.actionSignals,
      billingSignals:this.billingSignals,
      environment:'staging',
      realBilling:false,
      serverAuthority:true,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentReads:0,
      billingPayloadReads:0,
      networkCalls:0,
      storageWrites:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...this.publicStatus(),
      contract:PREMIUM_WORLD_CONTRACT_V623,
      premiumEngine:safeStatus(this.premiumEngine),
      livingCommerce:safeStatus(this.livingCommerce)
    });
  }

  audit() {
    const orbs = this.documentTarget?.querySelectorAll?.('#orb')?.length || 0;
    const canvases = this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      version:VERSION,
      premiumScreenPresent:Boolean(this.screen),
      subscriptionAppPresent:Boolean(this.app),
      oneCanonicalOrb:orbs === 1,
      oneCanonicalCanvas:canvases === 1,
      duplicateOrbs:Math.max(0,orbs - 1),
      premiumLifetimeCents:19990,
      skinsIncluded:30,
      aiMonthlyCents:8990,
      aiCreditsPerCycle:400,
      realBilling:false,
      simulatorOnly:true,
      serverAuthority:true,
      frontendEntitlementGrants:false,
      billingPayloadReads:0,
      paymentDataReads:0,
      privateContentReads:0,
      newCanvases:0,
      permanentAnimationLoops:0,
      work14:false
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.root?.dataset) delete this.root.dataset.work13PremiumWorld;
    if (this.screen?.dataset) {
      ['premiumWorld','premiumUniverse','premiumWorldPhase','premiumWorldPresence','premiumWorldReason','premiumWorldSequence','premiumWorldKey']
        .forEach(key => delete this.screen.dataset[key]);
    }
    if (this.app?.dataset) {
      ['premiumWorld','premiumUniverse','premiumWorldPhase','premiumWorldPrivacy']
        .forEach(key => delete this.app.dataset[key]);
    }
  }
}

export function createPremiumWorldV623(options = {}) {
  const host = options.windowTarget || globalThis.window || globalThis;
  if (host?.[INSTANCE]?.destroyed === false) return host[INSTANCE];
  const world = new PremiumWorldV623(options);
  try { host[INSTANCE] = world; } catch {}
  return world;
}

export default createPremiumWorldV623;
