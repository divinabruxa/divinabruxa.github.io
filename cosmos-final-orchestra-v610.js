/* DIVINA BRUXA — WORK13 · COSMOS VIVO · ORQUESTRA FINAL · V610
   O fechamento não acrescenta aparência, efeito ou caminho. Ele escuta os
   sinais públicos dos motores já aprovados, reúne uma auditoria estrutural em
   um único quadro e sela o WORK13 somente quando a mesma Orbe, o mesmo canvas,
   os 17 mundos e as oito camadas vivas continuam presentes. */

const VERSION = 610;
const INSTANCE = Symbol.for('divina.work13.cosmos.final.orchestra.v610');
const ROUTES = Object.freeze([
  'home','tarot','daily','spreads','library','school','journal','ai','skins',
  'consultations','store','music','videos','login','subscriptions',
  'notifications','admin'
]);
const ROUTE_SET = new Set(ROUTES);
const LAYERS = Object.freeze([
  'contextMemory','realityResonance','dailyReading','spreadReading',
  'whitTiming','livingWisdom','livingCommerce','livingMediaSkins'
]);

const IPHONE_PROFILES = Object.freeze([
  Object.freeze({ id:'iphone-se-portrait', width:375, height:667, dpr:2 }),
  Object.freeze({ id:'iphone-13-portrait', width:390, height:844, dpr:3 }),
  Object.freeze({ id:'iphone-14-pro-portrait', width:393, height:852, dpr:3 }),
  Object.freeze({ id:'iphone-pro-max-portrait', width:430, height:932, dpr:3 }),
  Object.freeze({ id:'iphone-se-landscape', width:667, height:375, dpr:2 }),
  Object.freeze({ id:'iphone-13-landscape', width:844, height:390, dpr:3 }),
  Object.freeze({ id:'iphone-14-pro-landscape', width:852, height:393, dpr:3 }),
  Object.freeze({ id:'iphone-pro-max-landscape', width:932, height:430, dpr:3 })
]);

export const COSMOS_FINAL_ORCHESTRA_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  base:'V609-media-skins-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'10-of-10',
  title:'Orquestra Final — tudo respira junto',
  law:'one-orb-one-universe-one-presence-one-journey',
  closure:'WORK13-completes-inside-WORK13',
  foundationSnapshot:601,
  livingLayers:Object.freeze([602,603,604,605,606,607,608,609]),
  sequence:Object.freeze([
    'public-structural-signal','one-coalesced-frame','structural-audit','silence'
  ]),
  routes:ROUTES,
  expectedWorlds:17,
  requiredLivingLayers:LAYERS,
  iphoneProfiles:IPHONE_PROFILES,
  iphoneFirst:true,
  portraitAndLandscape:true,
  safeAreasPreserved:true,
  keyboardViewportPreserved:true,
  backForwardPreserved:true,
  pwaReopenPreserved:true,
  offlineFloorPreserved:true,
  reducedMotionPreservesMeaning:true,
  physicalDeviceClaim:false,
  ownerPhysicalIPhoneValidationRecommended:true,
  onePhysicalOrbRequired:true,
  oneCanonicalCanvasRequired:true,
  maximumActivePlayers:1,
  maximumPendingFrames:1,
  eventDrivenSingleFrame:true,
  visualChanges:0,
  newStylesheets:0,
  newDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  newPlayers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  clickListeners:0,
  inputListeners:0,
  privateContentReads:0,
  formValueReads:0,
  journalBodyReads:0,
  questionReads:0,
  cardIdentityReads:0,
  listeningHistoryReads:0,
  viewingHistoryReads:0,
  accountProfileReads:0,
  purchaseBodyReads:0,
  searchQueryReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  automaticPlayback:false,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  productionPublish:false,
  realBilling:false,
  frontendEntitlementGrants:false,
  work14:false
});

const finite = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const cleanRoute = value => {
  const route = String(value || '').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return ROUTE_SET.has(route) ? route : 'home';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export function normalizeIPhoneViewportV610({
  width = 0,
  height = 0,
  dpr = 1,
  reducedMotion = false,
  standalone = false
} = {}) {
  const safeWidth = Math.max(0, Math.round(finite(width)));
  const safeHeight = Math.max(0, Math.round(finite(height)));
  const safeDpr = Math.min(4, Math.max(1, finite(dpr, 1)));
  const orientation = safeWidth > safeHeight ? 'landscape' : 'portrait';
  return Object.freeze({
    width:safeWidth,
    height:safeHeight,
    dpr:safeDpr,
    orientation,
    compactWidth:safeWidth > 0 && safeWidth <= 430,
    compactHeight:safeHeight > 0 && safeHeight <= 560,
    reducedMotion:Boolean(reducedMotion),
    standalone:Boolean(standalone)
  });
}

export function evaluateCosmosSealV610(input = {}) {
  const layerState = Object.freeze(Object.fromEntries(
    LAYERS.map(key => [key, input.layers?.[key] === true])
  ));
  const layersReady = LAYERS.every(key => layerState[key]);
  const canonicalOrbs = Math.max(0, finite(input.canonicalOrbs));
  const canonicalCanvases = Math.max(0, finite(input.canonicalCanvases));
  const activeScreens = Math.max(0, finite(input.activeScreens));
  const worldCount = Math.max(0, finite(input.worldCount));
  const activePlayers = Math.max(0, finite(input.activePlayers));
  const travelerCopies = Math.max(0, finite(input.travelerCopies));
  const pendingFrames = Math.max(0, finite(input.pendingFrames));
  const onePhysicalOrb = canonicalOrbs === 1 && input.orbEntityPreserved !== false;
  const oneCanonicalCanvas = canonicalCanvases === 1;
  const oneActiveReality = activeScreens === 1 && input.routeAligned !== false;
  const allWorldsPresent = worldCount === COSMOS_FINAL_ORCHESTRA_CONTRACT_V610.expectedWorlds;
  const singlePlayerPreserved = activePlayers <= COSMOS_FINAL_ORCHESTRA_CONTRACT_V610.maximumActivePlayers;
  const journeyPreserved = travelerCopies === 0 && input.teleportFallback !== true && input.flicker !== true;
  const layoutWithinViewport = input.horizontalOverflow !== true;
  const frameBudgetPreserved = pendingFrames <= COSMOS_FINAL_ORCHESTRA_CONTRACT_V610.maximumPendingFrames;
  const sealed = Boolean(
    layersReady && onePhysicalOrb && oneCanonicalCanvas && oneActiveReality
    && allWorldsPresent && singlePlayerPreserved && journeyPreserved
    && layoutWithinViewport && frameBudgetPreserved
  );
  return Object.freeze({
    version:VERSION,
    sealed,
    health:sealed ? 'sealed' : 'watch',
    layers:layerState,
    layersReady,
    canonicalOrbs,
    canonicalCanvases,
    onePhysicalOrb,
    oneCanonicalCanvas,
    activeScreens,
    oneActiveReality,
    worldCount,
    allWorldsPresent,
    activePlayers,
    singlePlayerPreserved,
    travelerCopies,
    journeyPreserved,
    horizontalOverflow:Boolean(input.horizontalOverflow),
    layoutWithinViewport,
    pendingFrames,
    frameBudgetPreserved,
    routeAligned:input.routeAligned !== false,
    privateContentIncluded:false
  });
}

export class CosmosFinalOrchestraV610 {
  constructor({
    systems = {},
    orb = null,
    journey = null,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.systems = Object.freeze(Object.fromEntries(LAYERS.map(key => [key, systems?.[key] || null])));
    this.orb = orb || null;
    this.journey = journey || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.destroyed = false;
    this.frameId = 0;
    this.pendingReason = '';
    this.auditRuns = 0;
    this.coalescedSignals = 0;
    this.routeStarts = 0;
    this.routeSettles = 0;
    this.orientationSignals = 0;
    this.visibilitySignals = 0;
    this.faultSignals = 0;
    this.completionEvents = 0;
    this.lastAudit = null;
    this.lastViewport = this.readViewport();
    this.installIdentity();
    this.bind();
    this.audit('boot');
    emit(this.documentTarget, 'divina:cosmos-final-orchestra-ready', this.publicStatus());
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13 = 'cosmos-vivo';
    this.root.dataset.work13Macro = '10-final-orchestra';
    this.root.dataset.cosmosFinalOrchestra = 'v610';
    this.root.dataset.cosmosFinalPrivacy = 'public-structural-signals-only';
    this.root.dataset.cosmosFinalState = 'auditing';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'divina:route-start', () => this.onRouteStart());
    [
      'divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate',
      'divina:orb-persistent-finished','divina:route-error','divina:boot-ready',
      'divina:skin-applied','divina:media-supreme-ready','divina:context-memory-updated'
    ].forEach(type => this.listen(doc, type, () => this.onSettle(type)));
    ['resize','orientationchange','pageshow','popstate','hashchange','online','offline']
      .forEach(type => this.listen(win, type, () => this.onWindowSignal(type), { passive:true }));
    this.listen(doc, 'visibilitychange', () => this.onVisibility(), { passive:true });
    this.listen(win, 'error', () => this.onFault('error'), { passive:true });
    this.listen(win, 'unhandledrejection', () => this.onFault('rejection'), { passive:true });
  }

  onRouteStart() {
    this.routeStarts += 1;
    if (this.root?.dataset) this.root.dataset.cosmosFinalState = 'travel';
  }

  onSettle(reason) {
    this.routeSettles += 1;
    this.scheduleAudit(reason);
  }

  onWindowSignal(reason) {
    if (reason === 'orientationchange') this.orientationSignals += 1;
    this.lastViewport = this.readViewport();
    this.scheduleAudit(reason);
  }

  onVisibility() {
    this.visibilitySignals += 1;
    if (this.documentTarget?.visibilityState === 'hidden') {
      if (this.root?.dataset) this.root.dataset.cosmosFinalState = 'quiet';
      return;
    }
    this.scheduleAudit('visible');
  }

  onFault(reason) {
    this.faultSignals += 1;
    this.scheduleAudit(reason);
  }

  scheduleAudit(reason = 'signal') {
    if (this.destroyed) return false;
    this.pendingReason = String(reason || 'signal').slice(0, 48);
    if (this.frameId) {
      this.coalescedSignals += 1;
      return false;
    }
    const frame = this.windowTarget?.requestAnimationFrame;
    if (typeof frame !== 'function') {
      this.audit(this.pendingReason);
      this.pendingReason = '';
      return false;
    }
    this.frameId = frame.call(this.windowTarget, () => {
      const nextReason = this.pendingReason || 'frame';
      this.frameId = 0;
      this.pendingReason = '';
      if (!this.destroyed) this.audit(nextReason);
    });
    return true;
  }

  readViewport() {
    const win = this.windowTarget;
    const viewport = win?.visualViewport;
    const reducedMotion = win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    const displayStandalone = win?.matchMedia?.('(display-mode: standalone)')?.matches === true;
    return normalizeIPhoneViewportV610({
      width:viewport?.width || win?.innerWidth || 0,
      height:viewport?.height || win?.innerHeight || 0,
      dpr:win?.devicePixelRatio || 1,
      reducedMotion,
      standalone:displayStandalone || win?.navigator?.standalone === true
    });
  }

  readLayerState() {
    return Object.freeze(Object.fromEntries(LAYERS.map(key => [
      key,
      Boolean(this.systems[key] && this.systems[key].destroyed !== true)
    ])));
  }

  readProbe() {
    const doc = this.documentTarget;
    const root = this.root;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length ?? 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length ?? 0;
    const activeScreens = doc?.querySelectorAll?.('#app > .screen.active')?.length ?? 0;
    const worldCount = doc?.querySelectorAll?.('#app > .screen[id]')?.length ?? 0;
    const activePlayers = doc?.querySelectorAll?.('#musicApp iframe,#videoApp iframe')?.length ?? 0;
    const activeNode = doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]') || null;
    const route = cleanRoute(doc?.body?.dataset?.screen || activeNode?.id || this.windowTarget?.location?.hash);
    const routeAligned = !activeNode?.id || cleanRoute(activeNode.id) === route;
    const clientWidth = Math.max(0, finite(root?.clientWidth, this.lastViewport.width));
    const scrollWidth = Math.max(0, finite(root?.scrollWidth, clientWidth));
    let orbSnapshot = null;
    let journeyStatus = null;
    try { orbSnapshot = this.orb?.snapshot?.() || null; } catch {}
    try { journeyStatus = this.journey?.status?.() || null; } catch {}
    return Object.freeze({
      route,
      layers:this.readLayerState(),
      canonicalOrbs,
      canonicalCanvases,
      activeScreens,
      worldCount,
      activePlayers,
      routeAligned,
      horizontalOverflow:clientWidth > 0 && scrollWidth > clientWidth + 1,
      orbEntityPreserved:orbSnapshot?.entityPreserved !== false && orbSnapshot?.oneLivingOrb !== false,
      travelerCopies:finite(journeyStatus?.travelerCopies),
      teleportFallback:journeyStatus?.teleportFallback === true,
      flicker:journeyStatus?.flicker === true,
      pendingFrames:this.frameId ? 1 : 0
    });
  }

  audit(reason = 'manual') {
    this.auditRuns += 1;
    this.lastViewport = this.readViewport();
    const probe = this.readProbe();
    const seal = evaluateCosmosSealV610(probe);
    this.lastAudit = Object.freeze({
      ...seal,
      route:probe.route,
      reason:String(reason || 'manual').slice(0, 48),
      viewport:this.lastViewport,
      faultSignals:this.faultSignals
    });
    if (this.root?.dataset) {
      this.root.dataset.cosmosFinalHealth = seal.health;
      this.root.dataset.cosmosFinalState = seal.sealed ? 'ready' : 'watch';
      if (seal.sealed) {
        this.root.dataset.work13Complete = 'v610';
        this.root.dataset.work13Next = 'none';
      } else {
        delete this.root.dataset.work13Complete;
        delete this.root.dataset.work13Next;
      }
    }
    emit(this.documentTarget, 'divina:cosmos-final-audit', {
      version:VERSION,
      route:probe.route,
      reason:this.lastAudit.reason,
      sealed:seal.sealed,
      health:seal.health,
      onePhysicalOrb:seal.onePhysicalOrb,
      oneCanonicalCanvas:seal.oneCanonicalCanvas,
      oneActiveReality:seal.oneActiveReality,
      layersReady:seal.layersReady,
      privateContentIncluded:false
    });
    if (seal.sealed && this.completionEvents === 0) {
      this.completionEvents = 1;
      emit(this.documentTarget, 'divina:work13-complete', {
        version:VERSION,
        work:'WORK13',
        law:COSMOS_FINAL_ORCHESTRA_CONTRACT_V610.law,
        nextWork:null,
        privateContentIncluded:false
      });
    }
    return this.lastAudit;
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      work:'WORK13',
      macroStage:'10-of-10',
      complete:this.lastAudit?.sealed === true,
      health:this.lastAudit?.health || 'auditing',
      route:this.lastAudit?.route || 'home',
      viewport:this.lastViewport,
      auditRuns:this.auditRuns,
      coalescedSignals:this.coalescedSignals,
      routeStarts:this.routeStarts,
      routeSettles:this.routeSettles,
      orientationSignals:this.orientationSignals,
      visibilitySignals:this.visibilitySignals,
      faultSignals:this.faultSignals,
      completionEvents:this.completionEvents,
      privateContentIncluded:false
    });
  }

  status() {
    return Object.freeze({
      ...COSMOS_FINAL_ORCHESTRA_CONTRACT_V610,
      ...this.publicStatus(),
      audit:this.lastAudit
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    if (this.frameId && typeof this.windowTarget?.cancelAnimationFrame === 'function') {
      this.windowTarget.cancelAnimationFrame(this.frameId);
    }
    this.frameId = 0;
    this.pendingReason = '';
    if (this.root?.dataset?.cosmosFinalOrchestra === 'v610') {
      delete this.root.dataset.cosmosFinalOrchestra;
      delete this.root.dataset.cosmosFinalPrivacy;
      delete this.root.dataset.cosmosFinalHealth;
      delete this.root.dataset.cosmosFinalState;
      delete this.root.dataset.work13Complete;
      delete this.root.dataset.work13Next;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createCosmosFinalOrchestraV610(options = {}) {
  if (globalThis[INSTANCE] && !globalThis[INSTANCE].destroyed) return globalThis[INSTANCE];
  const instance = new CosmosFinalOrchestraV610(options);
  globalThis[INSTANCE] = instance;
  return instance;
}
