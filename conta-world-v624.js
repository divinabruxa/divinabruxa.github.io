/* DIVINA BRUXA — WORK13 · CONTA · CASA DO RETORNO · V624
   Camada de mundo sobre Account V201, AccountWorld V319 e Clareza V608.
   Organiza presença, continuidade e controle sem ler campos ou recriar auth. */

const VERSION = 624;
const STYLE_ID = 'divinaContaWorldV624';
const STYLE_HREF = './conta-world-v624.css?v=624-casa-do-retorno';
const INSTANCE = Symbol.for('divina.work13.conta.world.v624');
const PHASES = new Set([
  'rest','threshold','invitation','authentication','continuity','security','data',
  'critical','settled','portal','travel','silence'
]);

export const CONTA_WORLD_CONTRACT_V624 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'login',
  name:'Conta',
  universe:'casa-do-retorno',
  identity:'midnight-blue-sea-glass-silver-dawn-ivory',
  sequence:Object.freeze([
    'arrival','one-clear-intention','authenticate-or-continue','one-explicit-area',
    'server-confirmed-state','control-data-and-sessions','return','silence'
  ]),
  accountAuthority:'V201-preserved',
  accountWorldAuthority:'V319-preserved',
  livingCommerceAuthority:'V608-preserved',
  identityRightsAuthority:'V542-preserved',
  authAuthority:'AuthClientV201-preserved',
  authSessionStorageOnly:true,
  authLocalStorageTokens:false,
  serverAuthority:true,
  rowLevelSecurityPreserved:true,
  emailVerificationPreserved:true,
  passwordResetPreserved:true,
  logoutPreserved:true,
  globalSessionExitPreserved:true,
  exportPreserved:true,
  accountDeletionPreserved:true,
  criticalFlowBypassPreserved:true,
  criticalActionsRequireServerConfirmation:true,
  ownerMfaRequirementPreserved:true,
  adminAccessForCommonUser:false,
  journalPrivateByDefault:true,
  journalCloudConsentDefault:false,
  journalCloudSyncOptInOnly:true,
  marketingConsentDefault:false,
  notificationQuietHours:'22:00-08:00 America/Sao_Paulo',
  existingAccountBodyReused:true,
  separateAccountBody:false,
  authFunctionChanges:0,
  securityPolicyChanges:0,
  profileChanges:0,
  sessionChanges:0,
  dataPolicyChanges:0,
  privateByDefault:true,
  formValueReads:0,
  passwordReads:0,
  emailReads:0,
  profileReads:0,
  authPayloadReads:0,
  journalBodyReads:0,
  billingPayloadReads:0,
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

const routeNow = (doc,win) => normalizeRoute(
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
  doc.dispatchEvent(new EventCtor(type,{detail:Object.freeze(detail)}));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class ContaWorldV624 {
  constructor({
    account = globalThis.divinaAccount,
    accountWorld = globalThis.divinaAccountWorldV319,
    livingCommerce = globalThis.divinaLivingCommercePathV608,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.account = account || null;
    this.accountWorld = accountWorld || null;
    this.livingCommerce = livingCommerce || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('login') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.publicSignals = 0;
    this.entrySignals = 0;
    this.formSignals = 0;
    this.securitySignals = 0;
    this.dataSignals = 0;
    this.authSignals = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:conta-world-v624-ready',this.publicStatus());
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
    if (this.root?.dataset) this.root.dataset.work13ContaWorld = 'v624';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.contaWorld = 'v624';
    this.screen.dataset.contaUniverse = 'casa-do-retorno';
    this.screen.dataset.contaWorldPhase = 'rest';
    this.screen.dataset.contaWorldPresence = 'away';
    this.screen.dataset.contaWorldSequence = 'arrival-intention-auth-or-continuity-area-server-control-return-silence';
    this.screen.dataset.contaWorldPrivacy = 'fields-profile-auth-journal-billing-private-unread';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.contaWorldCopy !== 'v624') {
      title.textContent = 'Sua presença continua sob seu controle.';
      title.dataset.contaWorldCopy = 'v624';
    }
    return true;
  }

  listen(target,type,handler,options={}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? {...options,signal} : options);
  }

  attach() {
    const next = this.documentTarget?.getElementById?.('login') || null;
    if (next && next !== this.screen) this.screen = next;
    if (this.screen?.dataset) {
      this.screen.dataset.contaWorld = 'v624';
      this.screen.dataset.contaUniverse = 'casa-do-retorno';
      this.screen.dataset.contaWorldPhase = this.phase;
      this.screen.dataset.contaWorldPrivacy = 'fields-profile-auth-journal-billing-private-unread';
    }
    return this.screen;
  }

  isActive() {
    return this.route === 'login' && this.screen?.classList?.contains?.('active') !== false;
  }

  isAuthenticated() {
    return String(this.screen?.dataset?.v608Auth || '').toLowerCase() === 'authenticated';
  }

  arrivalPhase() {
    const mode = String(this.screen?.dataset?.v608CommerceMode || 'guide').toLowerCase();
    if (mode === 'direct') return 'security';
    if (mode === 'detail') return this.isAuthenticated() ? 'continuity' : 'authentication';
    return 'invitation';
  }

  setPhase(next,reason='public-signal') {
    this.phase = normalizePhase(next);
    if (this.screen?.dataset) {
      this.screen.dataset.contaWorldPhase = this.phase;
      this.screen.dataset.contaWorldReason = String(reason || 'public-signal');
      this.screen.dataset.contaWorldPresence = this.isActive() ? 'present' : 'away';
    }
    emit(this.documentTarget,'divina:conta-world-v624-state',this.publicStatus());
    return this.phase;
  }

  sync(reason='sync') {
    this.attach();
    if (!this.isActive()) return this.setPhase('rest',reason);
    return this.setPhase(this.arrivalPhase(),reason);
  }

  onRouteStart(event) {
    const next = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || '');
    this.publicSignals += 1;
    if (this.isActive() && next !== 'login') this.setPhase('travel','route-start');
  }

  onRouteReady(event) {
    this.route = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget,this.windowTarget));
    this.publicSignals += 1;
    this.sync('route-ready');
  }

  onCommerce(event) {
    if (normalizeRoute(event?.detail?.route) !== 'login') return false;
    this.publicSignals += 1;
    if (!this.isActive()) return false;
    const mode = String(event?.detail?.mode || '').toLowerCase();
    if (mode === 'guide') return this.setPhase('invitation','commerce-guide');
    if (mode === 'direct') return this.setPhase('security','critical-direct');
    if (mode === 'detail') return this.setPhase(this.isAuthenticated() ? 'continuity' : 'authentication','commerce-detail');
    return false;
  }

  onAuthState() {
    this.publicSignals += 1;
    this.authSignals += 1;
    if (!this.isActive()) return false;
    return this.setPhase(this.isAuthenticated() ? 'settled' : 'invitation','public-auth-state');
  }

  onFocus(event) {
    if (!this.isActive()) return false;
    if (!event?.target?.matches?.('#login input,#login select,#login textarea')) return false;
    this.formSignals += 1;
    return this.setPhase('authentication','explicit-field-focus');
  }

  onClick(event) {
    if (!this.isActive()) return false;
    const target = event?.target;
    if (target?.closest?.('#login [data-acw319-main]')) {
      this.entrySignals += 1;
      return this.setPhase(this.isAuthenticated() ? 'continuity' : 'authentication','explicit-entry');
    }
    if (target?.closest?.('#login button[type="submit"],#login [data-auth-submit]')) {
      this.formSignals += 1;
      return this.setPhase('authentication','explicit-auth-submit');
    }
    if (target?.closest?.('#login [data-logout],#login [data-sign-out],#login [data-end-sessions],#login .account-v189-security button')) {
      this.securitySignals += 1;
      return this.setPhase('security','explicit-security-control');
    }
    if (target?.closest?.('#login [data-delete-account],#login [data-account-delete]')) {
      this.securitySignals += 1;
      return this.setPhase('critical','explicit-critical-control');
    }
    if (target?.closest?.('#login [data-export],#login [data-journal-sync],#login [data-sync],#login .account-v189-sync button')) {
      this.dataSignals += 1;
      return this.setPhase('data','explicit-data-control');
    }
    return false;
  }

  onMenu(event) {
    if (!this.isActive()) return false;
    this.publicSignals += 1;
    const state = String(event?.detail?.state || event?.detail?.phase || '').toLowerCase();
    if (/open|opening|visible|active/.test(state)) return this.setPhase('portal','menu-open');
    if (/close|closed|hidden|idle/.test(state)) return this.setPhase(this.arrivalPhase(),'menu-close');
    return false;
  }

  bind() {
    const doc = this.documentTarget;
    this.listen(doc,'click',event=>this.onClick(event));
    this.listen(doc,'focusin',event=>this.onFocus(event));
    this.listen(doc,'divina:route-start',event=>this.onRouteStart(event));
    this.listen(doc,'divina:route-ready',event=>this.onRouteReady(event));
    this.listen(doc,'divina:living-commerce-state',event=>this.onCommerce(event));
    this.listen(doc,'divina:auth-state',()=>this.onAuthState());
    this.listen(this.windowTarget,'divina:auth-state',()=>this.onAuthState());
    this.listen(doc,'divina:menu-state',event=>this.onMenu(event));
    this.listen(doc,'divina:portal-state',event=>this.onMenu(event));
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,work:'WORK13',reality:'login',universe:'casa-do-retorno',
      route:this.route,phase:this.phase,present:this.isActive(),
      authenticatedState:this.isAuthenticated() ? 'authenticated' : 'guest-or-unknown',
      publicSignals:this.publicSignals,entrySignals:this.entrySignals,
      formSignals:this.formSignals,securitySignals:this.securitySignals,
      dataSignals:this.dataSignals,authSignals:this.authSignals,
      serverAuthority:true,journalCloudConsentDefault:false,
      automaticNavigation:false,automaticWhitSpeech:false,
      formValueReads:0,passwordReads:0,emailReads:0,profileReads:0,
      authPayloadReads:0,privateContentReads:0,networkCalls:0,storageWrites:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...this.publicStatus(),contract:CONTA_WORLD_CONTRACT_V624,
      account:safeStatus(this.account),accountWorld:safeStatus(this.accountWorld),
      livingCommerce:safeStatus(this.livingCommerce)
    });
  }

  audit() {
    const orbs=this.documentTarget?.querySelectorAll?.('#orb')?.length||0;
    const canvases=this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length||0;
    return Object.freeze({
      version:VERSION,accountScreenPresent:Boolean(this.screen),
      accountGuideReused:Boolean(this.screen?.querySelector?.('#accountWorldV319')),
      oneCanonicalOrb:orbs===1,oneCanonicalCanvas:canvases===1,duplicateOrbs:Math.max(0,orbs-1),
      serverAuthority:true,authSessionStorageOnly:true,authLocalStorageTokens:false,
      journalCloudConsentDefault:false,frontendEntitlementGrants:false,
      formValueReads:0,passwordReads:0,emailReads:0,profileReads:0,
      authPayloadReads:0,journalBodyReads:0,privateContentReads:0,
      newCanvases:0,permanentAnimationLoops:0,work14:false
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed=true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.root?.dataset) delete this.root.dataset.work13ContaWorld;
    if (this.screen?.dataset) {
      ['contaWorld','contaUniverse','contaWorldPhase','contaWorldPresence','contaWorldReason','contaWorldSequence','contaWorldPrivacy']
        .forEach(key=>delete this.screen.dataset[key]);
    }
  }
}

export function createContaWorldV624(options={}) {
  const host=options.windowTarget||globalThis.window||globalThis;
  if (host?.[INSTANCE]?.destroyed===false) return host[INSTANCE];
  const world=new ContaWorldV624(options);
  try { host[INSTANCE]=world; } catch {}
  return world;
}

export default createContaWorldV624;
