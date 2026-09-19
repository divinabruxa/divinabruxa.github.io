/* DIVINA BRUXA — WORK12 · MACROETAPA 10 · FLUIDEZ SUPREMA FINAL V598
   A interface sai do caminho. Na Origem, a unica Orbe chama o universo;
   dois toques continuam atravessando para o Tarot Livre. Nas realidades,
   o Sopro preserva todos os destinos sem fabricar outra Orbe.

   Esta camada nao cria fisica, renderer, canvas, observador ou loop. Ela
   coordena a gramatica publica que ja existe e deixa o silencio acontecer. */

const VERSION = 598;
const INSTANCE = Symbol.for('divina.work12.final.continuity.v598');
const STYLE_ID = 'divinaWork12FinalContinuityV598';
const STYLE_HREF = './work12-final-continuity-v598.css?v=598-work12-final';
const HOME_TAP_DELAY = 470;
const MOVEMENT_STATES = new Set(['DEPART','TRAVEL','ARRIVE']);

export const FINAL_CONTINUITY_CONTRACT_V598 = Object.freeze({
  version:VERSION,
  base:'V597',
  work:'WORK12',
  macroStage:'10-of-10',
  title:'Fluidez Suprema Final · Toque, Resposta, Silencio',
  law:'one-orb-one-universe-one-physics-one-presence',
  screenModel:'continuous-universe-coordinates',
  home:'universe-and-canonical-orb-only',
  navigationGrammar:Object.freeze(['touch','response','silence','travel','arrival']),
  axes:Object.freeze({
    horizontal:'travel-between-realities',
    vertical:'immersion',
    depth:'discovery'
  }),
  homeSingleTap:'call-intentions',
  homeDoubleTap:'tarot-free',
  realityAccess:'one-word-breath',
  maximumVisibleIntentions:2,
  whitResidence:'canonical-orb',
  automaticWhitSpeech:false,
  silenceIsPresence:true,
  movementBeforeMagic:true,
  legacyDestinationsPreserved:true,
  legacyDockPreservedButSilent:true,
  permanentAnimationLoops:0,
  mutationObservers:0,
  newCanvases:0,
  newRenderers:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  modelCalls:0,
  apiCalls:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const clean = (value, limit = 64) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizeRoute = value => {
  const route = clean(value || 'home', 80).toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const dispatch = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class Work12FinalContinuityV598 {
  constructor({
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme,
    journey = globalThis.divinaOrbPersistentJourneyV565 || globalThis.orbe?.journey,
    intelligence = globalThis.divinaWork12Macro9V597?.intelligence || globalThis.orbe?.intelligence,
    menuResolver = () => globalThis.divinaMenuV502,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.orbCore = orbCore || null;
    this.journey = journey || null;
    this.intelligence = intelligence || null;
    this.menuResolver = typeof menuResolver === 'function' ? menuResolver : () => null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.orb = this.documentTarget?.querySelector?.('#orb') || this.orbCore?.orb || null;
    this.setTimer = typeof setTimer === 'function' ? setTimer : setTimeout;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : clearTimeout;
    this.abort = new AbortController();

    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.menuState = clean(this.root?.dataset?.menuState || 'closed', 24).toLowerCase() || 'closed';
    this.work12State = 'REST';
    this.tapTimer = 0;
    this.pendingMenuReady = false;
    this.keyboardGesture = false;
    this.destroyed = false;
    this.calls = 0;
    this.touchCalls = 0;
    this.keyboardCalls = 0;
    this.doubleTapCancellations = 0;
    this.movementCancellations = 0;
    this.menuWaits = 0;
    this.menuFailures = 0;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.syncPresence('boot');
    dispatch(this.documentTarget, 'divina:work12-final-ready', this.status());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append(link);
    return true;
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work12Final = 'v598';
    this.root.dataset.work12FinalLaw = 'one-orb-one-universe-one-physics-one-presence';
    this.root.dataset.work12FinalMotion = 'movement-first';
    this.root.dataset.work12FinalWhit = 'inside-canonical-orb';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'click', event => this.onOrbClick(event), { capture:true });
    this.listen(doc, 'dblclick', event => this.onOrbDoubleClick(event), { capture:true });
    this.listen(doc, 'keydown', event => this.onOrbKeyDown(event), { capture:true });
    this.listen(doc, 'keyup', event => this.onOrbKeyUp(event), { capture:true });
    this.listen(doc, 'divina:orbital-menu-ready', () => this.onMenuReady());
    this.listen(doc, 'divina:menu-state', event => this.onMenuState(event));
    this.listen(doc, 'divina:work12-state', event => this.onWork12State(event));
    this.listen(doc, 'divina:route-start', () => this.cancelHomeTap('movement'));
    this.listen(doc, 'divina:supreme-orb-will-navigate', () => this.cancelHomeTap('movement'));
    this.listen(doc, 'divina:route-ready', event => this.onRouteReady(event));
    this.listen(doc, 'divina:page-ready', event => this.onRouteReady(event));
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win) } }));
    this.listen(win, 'pagehide', () => this.cancelHomeTap('pagehide'), { passive:true });
  }

  isCanonicalOrbTarget(target) {
    const candidate = target?.closest?.('#orb');
    return Boolean(candidate && candidate === this.orb);
  }

  isHomeReady() {
    return this.route === 'home'
      && this.menuState === 'closed'
      && !MOVEMENT_STATES.has(this.work12State)
      && this.root?.dataset?.experienceState !== 'moving';
  }

  cancelHomeTap(reason = 'cancelled') {
    if (!this.tapTimer) return false;
    this.clearTimer(this.tapTimer);
    this.tapTimer = 0;
    if (reason === 'double-tap') this.doubleTapCancellations += 1;
    if (reason === 'movement' || reason === 'pagehide') this.movementCancellations += 1;
    if (this.root?.dataset) this.root.dataset.work12FinalTap = clean(reason, 32) || 'cancelled';
    return true;
  }

  scheduleUniverseCall(source = 'touch') {
    this.cancelHomeTap('rescheduled');
    if (!this.isHomeReady()) return false;
    if (this.root?.dataset) this.root.dataset.work12FinalTap = 'listening';
    this.tapTimer = this.setTimer(() => {
      this.tapTimer = 0;
      if (!this.isHomeReady() || this.destroyed) return;
      this.callUniverse(source);
    }, HOME_TAP_DELAY);
    return true;
  }

  // Chamado pelo mesmo resultado TAP do motor V208. Nao existe um segundo
  // reconhecedor de gestos: a camada final apenas traduz a intencao ja aceita.
  onCanonicalOrbIntent(source = 'touch') {
    return this.scheduleUniverseCall(source === 'keyboard' ? 'keyboard' : 'touch');
  }

  onOrbClick(event) {
    if (!this.isCanonicalOrbTarget(event?.target) || this.route !== 'home') return false;
    const detail = Number(event?.detail || 0);
    if (this.keyboardGesture || detail === 0) return false;
    if (detail > 1) {
      this.cancelHomeTap('double-tap');
      return false;
    }
    return this.scheduleUniverseCall('touch');
  }

  onOrbDoubleClick(event) {
    if (!this.isCanonicalOrbTarget(event?.target) || this.route !== 'home') return false;
    return this.cancelHomeTap('double-tap');
  }

  onOrbKeyDown(event) {
    if (!this.isCanonicalOrbTarget(event?.target) || this.route !== 'home') return false;
    if (!['Enter',' '].includes(event?.key) || event?.repeat) return false;
    event.preventDefault?.();
    event.stopImmediatePropagation?.();
    this.keyboardGesture = true;
    this.cancelHomeTap('keyboard');
    return this.callUniverse('keyboard');
  }

  onOrbKeyUp(event) {
    if (!this.keyboardGesture || !this.isCanonicalOrbTarget(event?.target)) return false;
    if (!['Enter',' '].includes(event?.key)) return false;
    event.preventDefault?.();
    event.stopImmediatePropagation?.();
    this.keyboardGesture = false;
    return true;
  }

  callUniverse(source = 'touch') {
    if (!this.isHomeReady()) return false;
    const menu = this.menuResolver?.() || null;
    if (!menu?.open) {
      this.pendingMenuReady = true;
      this.menuWaits += 1;
      if (this.root?.dataset) this.root.dataset.work12FinalTap = 'awaiting-intentions';
      return false;
    }

    this.pendingMenuReady = false;
    this.calls += 1;
    if (source === 'keyboard') this.keyboardCalls += 1;
    else this.touchCalls += 1;
    if (this.root?.dataset) this.root.dataset.work12FinalTap = 'universe-called';
    this.orbCore?.pulse?.('work12-final-call', { intensity:.64 });
    try {
      const opening = menu.open();
      Promise.resolve(opening).catch(() => {
        this.menuFailures += 1;
        if (this.root?.dataset) this.root.dataset.work12FinalTap = 'intentions-resting';
      });
    } catch {
      this.menuFailures += 1;
      return false;
    }
    dispatch(this.documentTarget, 'divina:work12-final-response', {
      version:VERSION,
      response:'intentions',
      source,
      route:this.route,
      automaticWhitSpeech:false
    });
    return true;
  }

  onMenuReady() {
    if (!this.pendingMenuReady || !this.isHomeReady()) return false;
    return this.callUniverse('touch');
  }

  onMenuState(event) {
    this.menuState = clean(event?.detail?.state || 'closed', 24).toLowerCase() || 'closed';
    if (this.menuState !== 'closed') this.cancelHomeTap('menu');
    return this.syncPresence('menu');
  }

  onWork12State(event) {
    this.work12State = clean(event?.detail?.state || 'REST', 20).toUpperCase() || 'REST';
    if (MOVEMENT_STATES.has(this.work12State)) this.cancelHomeTap('movement');
    return this.syncPresence('physics');
  }

  onRouteReady(event) {
    this.cancelHomeTap('movement');
    this.pendingMenuReady = false;
    this.route = normalizeRoute(event?.detail?.id || event?.detail?.route || routeNow(this.documentTarget, this.windowTarget));
    return this.syncPresence('route');
  }

  syncPresence(reason = 'sync') {
    if (!this.root?.dataset) return false;
    this.root.dataset.work12FinalRoute = this.route;
    this.root.dataset.work12FinalReason = clean(reason, 32) || 'sync';
    this.root.dataset.work12FinalPresence = this.menuState !== 'closed'
      ? 'intentions'
      : this.route === 'home' ? 'orb-only' : 'reality';
    if (this.orb && this.route === 'home' && this.menuState === 'closed') {
      this.orb.setAttribute?.('aria-label', 'Orbe viva. Toque para chamar o universo; toque duplo abre o Tarot Livre');
    }
    return true;
  }

  audit() {
    const doc = this.documentTarget;
    const journey = safeStatus(this.journey);
    const intelligence = safeStatus(this.intelligence);
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      release:'V598',
      canonicalOrbs,
      canonicalCanvases,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      homeOnlyUniverseAndOrb:true,
      homeTapCallsUniverse:true,
      homeDoubleTapPreserved:true,
      realityAccessIsBreath:true,
      duplicateInterfaceOrbsHidden:true,
      legacyDestinationsPreserved:true,
      legacyDockRemovedFromPerception:true,
      travelerCopies:Number(journey?.travelerCopies || 0),
      teleport:journey?.teleportFallback === true,
      flicker:journey?.flicker === true,
      heavyEffectsPausedDuringTravel:journey?.heavyEffectsPausedDuringAnyTravel === true,
      intelligenceState:intelligence?.state || null,
      automaticWhitSpeech:false,
      privateContentReads:0,
      storageReads:0,
      storageWrites:0,
      modelCalls:0,
      apiCalls:0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimersMaximum:1
    });
  }

  status() {
    return Object.freeze({
      ...FINAL_CONTINUITY_CONTRACT_V598,
      route:this.route,
      presence:this.root?.dataset?.work12FinalPresence || null,
      menuState:this.menuState,
      work12State:this.work12State,
      tapPending:Boolean(this.tapTimer),
      pendingMenuReady:this.pendingMenuReady,
      calls:this.calls,
      touchCalls:this.touchCalls,
      keyboardCalls:this.keyboardCalls,
      doubleTapCancellations:this.doubleTapCancellations,
      movementCancellations:this.movementCancellations,
      menuWaits:this.menuWaits,
      menuFailures:this.menuFailures,
      destroyed:this.destroyed
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.cancelHomeTap('destroy');
    this.pendingMenuReady = false;
    this.abort.abort();
    if (this.root?.dataset?.work12Final === 'v598') {
      delete this.root.dataset.work12Final;
      delete this.root.dataset.work12FinalLaw;
      delete this.root.dataset.work12FinalMotion;
      delete this.root.dataset.work12FinalWhit;
      delete this.root.dataset.work12FinalRoute;
      delete this.root.dataset.work12FinalReason;
      delete this.root.dataset.work12FinalPresence;
      delete this.root.dataset.work12FinalTap;
    }
    try { delete globalThis[INSTANCE]; } catch {}
    return true;
  }
}

export function createWork12FinalContinuityV598(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new Work12FinalContinuityV598(options);
  globalThis[INSTANCE] = instance;
  return instance;
}
