/* DIVINA BRUXA — WORK12 · MACROETAPA 6 · WHIT PRESENÇA VIVA V594
   Whit não ganha corpo, janela ou voz automática. Ela habita a única Orbe
   canônica como timing: toque comum recebe silêncio, convite deliberado
   continua disponível e uma pausa verdadeira pode oferecer um único sopro.

   Esta camada não lê campos, Diário, cartas ou emoções; não cria DOM, canvas,
   animação ou loop. Durante menu e viagem, sai completamente do caminho.
*/

const VERSION = 594;
const INSTANCE = Symbol.for('divina.work12.whit.living.presence.v594');
const SESSION_OFFER_LIMIT = 2;
const TRANSIENT_RETRY_MS = 5200;
const ELIGIBLE_ROUTES = new Set(['spreads','library','school','skins','music','videos']);
const SILENT_ROUTES = new Set([
  'home','tarot','daily','journal','ai','consultations','store','subscriptions',
  'login','notifications','admin'
]);
const KNOWN_ROUTES = new Set([...ELIGIBLE_ROUTES, ...SILENT_ROUTES]);
const DWELL_DELAYS = Object.freeze({
  spreads:14800,
  library:13200,
  school:15600,
  skins:17100,
  music:12400,
  videos:16400
});
const TRANSIENT_BLOCKS = new Set(['bubble-active','message-active','not-resting']);

export const WHIT_LIVING_PRESENCE_CONTRACT_V594 = Object.freeze({
  version:VERSION,
  base:'V593',
  work:'WORK12',
  macroStage:'6-of-10',
  title:'Whit · Presença Viva',
  law:'one-orb-one-universe-one-physics-one-presence',
  residence:'canonical-orb',
  presenceModel:'timing-context-silence',
  ordinaryTouchSpeech:false,
  deliberateInvitationPreserved:true,
  homeSilent:true,
  tarotRitualSilent:true,
  dailyRitualSilent:true,
  journalPrivateAndSilent:true,
  commerceSilent:true,
  contextualOfferRoutes:Object.freeze([...ELIGIBLE_ROUTES]),
  maximumContextualOffersPerSession:SESSION_OFFER_LIMIT,
  maximumContextualOffersPerRoute:1,
  maximumSimultaneousOffers:1,
  oneDeferredTimer:true,
  travelPolicy:'absolute-silence',
  menuPolicy:'absolute-silence',
  helpBeforeSale:true,
  emotionalSalesPressure:false,
  emotionInference:false,
  consciousnessClaim:false,
  privateContentReads:0,
  formFieldReads:0,
  journalBodyReads:0,
  storageReads:0,
  storageWrites:0,
  modelCalls:0,
  apiCalls:0,
  domNodesCreated:0,
  newCanvases:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  iphoneFirst:true
});

const clean = (value, limit = 80) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const freeze = value => Object.freeze(value);
const clock = () => Math.round(globalThis.performance?.now?.() || Date.now());

const normalizeRoute = value => {
  const route = clean(value || 'home', 40)
    .toLowerCase()
    .replace(/^#/,'')
    .split(/[?&/]/)[0];
  return KNOWN_ROUTES.has(route) ? route : 'home';
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

const emit = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:freeze(detail) }));
};

export class WhitLivingPresenceV594 {
  constructor({
    soul = globalThis.divinaWhitOrbSoulV581,
    whit = globalThis.divinaWhitCoreSupremeV527?.core,
    bubbles = globalThis.divinaMagicalBubblesV586,
    foundation = globalThis.divinaWork12V592,
    governor = globalThis.divinaMessageGovernorV580,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    documentElement = globalThis.document?.documentElement,
    dwellDelays = DWELL_DELAYS,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.soul = soul || null;
    this.whit = whit || null;
    this.bubbles = bubbles || null;
    this.foundation = foundation || null;
    this.governor = governor || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = documentElement || null;
    this.dwellDelays = { ...DWELL_DELAYS, ...(dwellDelays || {}) };
    this.setTimer = typeof setTimer === 'function' ? setTimer : setTimeout;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : clearTimeout;
    this.controller = new AbortController();
    this.route = this.currentRoute();
    this.state = 'silent';
    this.timer = 0;
    this.timerRoute = '';
    this.timerReason = '';
    this.arrived = false;
    this.arrivalAt = 0;
    this.interactedSinceArrival = false;
    this.traveling = false;
    this.menuOpen = false;
    this.retryRoute = '';
    this.retryCount = 0;
    this.pendingOfferRoute = '';
    this.offeredRoutes = new Set();
    this.offerRequests = 0;
    this.contextualOffers = 0;
    this.offerFailures = 0;
    this.contextEvaluations = 0;
    this.silenceDecisions = 0;
    this.ordinaryTouchesSilenced = 0;
    this.scheduledPauses = 0;
    this.cancelledPauses = 0;
    this.suppressionReasons = new Map();
    this.originalShowGuidance = null;
    this.showGuidanceProxy = null;
    this.surfaceDescriptions = new WeakMap();
    this.surfaces = new Set();
    this.destroyed = false;

    this.installIdentity();
    this.installOrdinaryTouchSilence();
    this.syncInvitationLanguage();
    this.bind();
    this.silence('boot');
    emit(this.documentTarget, 'divina:whit-living-presence-ready', {
      version:VERSION,
      route:this.route,
      residence:'canonical-orb',
      messageIncluded:false,
      privateContentRead:false
    });
  }

  installIdentity() {
    const root = this.documentElement;
    if (!root?.dataset) return;
    root.dataset.whitLivingPresence = 'v594';
    root.dataset.whitLivingResidence = 'canonical-orb';
    root.dataset.whitLivingTouch = 'explicit-only';
    root.dataset.whitLivingState = 'silent';
  }

  currentRoute() {
    const doc = this.documentTarget;
    return normalizeRoute(
      doc?.body?.dataset?.screen
      || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
      || this.windowTarget?.location?.hash
      || 'home'
    );
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, {
      ...options,
      signal:this.controller.signal
    });
  }

  setState(state, reason = 'state') {
    this.state = clean(state, 24) || 'silent';
    if (this.documentElement?.dataset) {
      this.documentElement.dataset.whitLivingState = this.state;
      this.documentElement.dataset.whitLivingReason = clean(reason, 48) || 'state';
    }
    return this.state;
  }

  countSuppression(reason) {
    const safeReason = clean(reason, 48) || 'silence';
    this.suppressionReasons.set(safeReason, (this.suppressionReasons.get(safeReason) || 0) + 1);
    return safeReason;
  }

  silence(reason = 'silence', { count = true } = {}) {
    const safeReason = this.countSuppression(reason);
    if (count) this.silenceDecisions += 1;
    this.setState(this.traveling ? 'travel-silence' : this.menuOpen ? 'menu-silence' : 'silent', safeReason);
    emit(this.documentTarget, 'divina:whit-living-silence', {
      version:VERSION,
      route:this.route,
      reason:safeReason,
      residence:'canonical-orb',
      messageIncluded:false,
      privateContentRead:false
    });
    return false;
  }

  installOrdinaryTouchSilence() {
    if (!this.whit || typeof this.whit.showGuidance !== 'function') return false;
    this.originalShowGuidance = this.whit.showGuidance;
    const engine = this;
    this.showGuidanceProxy = function(route, options = {}) {
      const source = clean(options?.source, 40).toLowerCase();
      if (source === 'orb-touch' && options?.expanded !== true) {
        engine.ordinaryTouchesSilenced += 1;
        engine.silence('ordinary-orb-touch');
        return freeze({
          route:normalizeRoute(route || engine.currentRoute()),
          silent:true,
          reason:'ordinary-orb-touch',
          messageIncluded:false
        });
      }
      return engine.originalShowGuidance.call(this, route, options);
    };
    this.whit.showGuidance = this.showGuidanceProxy;
    return true;
  }

  syncInvitationLanguage() {
    const surfaces = this.documentTarget?.querySelectorAll?.(
      '[data-whit-core-surface="v527"],[data-supreme-orb="living"],[data-orb-presence-v526="true"]'
    ) || [];
    surfaces.forEach(surface => {
      if (!surface?.setAttribute) return;
      if (!this.surfaceDescriptions.has(surface)) {
        this.surfaceDescriptions.set(surface, surface.getAttribute?.('aria-description'));
      }
      surface.setAttribute('aria-description', 'Whit fica em silêncio. Segure para convidá-la.');
      this.surfaces.add(surface);
    });
    return this.surfaces.size;
  }

  clearPause(reason = 'cancelled') {
    if (!this.timer) return false;
    this.clearTimer(this.timer);
    this.timer = 0;
    this.timerRoute = '';
    this.timerReason = '';
    this.cancelledPauses += 1;
    this.countSuppression(reason);
    return true;
  }

  gate(route) {
    const normalized = normalizeRoute(route);
    const root = this.documentElement;
    const foundation = safeStatus(this.foundation);
    const bubbles = safeStatus(this.bubbles);
    const governor = safeStatus(this.governor);
    if (this.destroyed) return 'destroyed';
    if (!ELIGIBLE_ROUTES.has(normalized)) return SILENT_ROUTES.has(normalized) ? `protected-${normalized}` : 'ineligible-route';
    if (normalized !== this.currentRoute() || normalized !== this.route) return 'route-changed';
    if (!this.arrived) return 'no-meaningful-arrival';
    if (this.interactedSinceArrival) return 'person-is-moving';
    if (this.documentTarget?.visibilityState === 'hidden') return 'hidden';
    if (this.traveling || ['depart','travel','arrive'].includes(String(root?.dataset?.work12State || '').toLowerCase())) return 'travel';
    if (this.menuOpen || (root?.dataset?.menuState && root.dataset.menuState !== 'closed') || (root?.dataset?.v585Menu && root.dataset.v585Menu !== 'closed')) return 'menu';
    if (root?.dataset?.v585Keyboard === 'open') return 'keyboard';
    if (this.offeredRoutes.has(normalized)) return 'route-already-offered';
    if (this.contextualOffers >= SESSION_OFFER_LIMIT) return 'session-offer-limit';
    if (foundation && foundation.state !== 'REST') return 'not-resting';
    if (bubbles && !['silent','paused'].includes(String(bubbles.state || 'silent'))) return 'bubble-active';
    if (governor?.active) return 'message-active';
    return '';
  }

  schedule(route, reason = 'arrival', delay = null) {
    const normalized = normalizeRoute(route);
    this.contextEvaluations += 1;
    this.clearPause('new-context');
    const blocked = this.gate(normalized);
    if (blocked) return this.silence(blocked);
    const wait = Math.max(20, Number(delay ?? this.dwellDelays[normalized] ?? 15000));
    this.timerRoute = normalized;
    this.timerReason = clean(reason, 40) || 'arrival';
    this.scheduledPauses += 1;
    this.setState('listening-to-silence', this.timerReason);
    this.timer = this.setTimer(() => {
      this.timer = 0;
      this.timerRoute = '';
      this.timerReason = '';
      this.offer(normalized);
    }, wait);
    return true;
  }

  retry(route, reason) {
    const normalized = normalizeRoute(route);
    if (this.retryRoute === normalized && this.retryCount >= 1) return this.silence(reason);
    this.retryRoute = normalized;
    this.retryCount = 1;
    this.clearPause('transient-retry');
    this.timerRoute = normalized;
    this.timerReason = `wait-${clean(reason, 32) || 'quiet'}`;
    this.scheduledPauses += 1;
    this.setState('listening-to-silence', this.timerReason);
    this.timer = this.setTimer(() => {
      this.timer = 0;
      this.timerRoute = '';
      this.timerReason = '';
      this.offer(normalized);
    }, TRANSIENT_RETRY_MS);
    return true;
  }

  offer(route) {
    const normalized = normalizeRoute(route);
    this.contextEvaluations += 1;
    const blocked = this.gate(normalized);
    if (blocked) {
      if (TRANSIENT_BLOCKS.has(blocked)) return this.retry(normalized, blocked);
      return this.silence(blocked);
    }

    this.pendingOfferRoute = normalized;
    this.setState('gathering', 'contextual-pause-complete');
    this.soul?.setState?.('listening', 'whit-contextual-offer', {
      radiate:false,
      transient:900,
      strength:0.18
    });
    const scheduled = this.bubbles?.schedule?.({
      route:normalized,
      source:'whit-presence',
      delay:globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 320 : 620
    }) === true;
    if (!scheduled) {
      this.pendingOfferRoute = '';
      this.offerFailures += 1;
      return this.silence('bubble-declined');
    }
    this.offerRequests += 1;
    emit(this.documentTarget, 'divina:whit-living-offer-requested', {
      version:VERSION,
      route:normalized,
      source:'whit-presence',
      messageIncluded:false,
      privateContentRead:false
    });
    return true;
  }

  markInteraction(reason = 'person-moving') {
    if (!this.arrived || this.traveling) return false;
    this.interactedSinceArrival = true;
    this.clearPause(reason);
    this.setState('silent', reason);
    return true;
  }

  onArrival(detail = {}) {
    this.clearPause('new-arrival');
    this.route = normalizeRoute(detail.route || detail.id || this.currentRoute());
    this.arrived = true;
    this.arrivalAt = clock();
    this.interactedSinceArrival = false;
    this.traveling = false;
    this.retryRoute = '';
    this.retryCount = 0;
    this.pendingOfferRoute = '';
    if (!ELIGIBLE_ROUTES.has(this.route)) return this.silence(`arrival-${this.route}`);
    return this.schedule(this.route, 'meaningful-arrival');
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'divina:work12-arrival', event => this.onArrival(event.detail || {}));
    this.listen(doc, 'divina:work12-state', event => {
      const state = clean(event.detail?.state, 20).toUpperCase();
      if (['DEPART','TRAVEL','ARRIVE'].includes(state)) {
        this.traveling = true;
        this.arrived = false;
        this.clearPause('travel');
        this.silence('travel');
      } else if (state === 'REST') {
        this.traveling = false;
        if (!this.timer && !this.pendingOfferRoute && this.arrived && ELIGIBLE_ROUTES.has(this.route)
          && !this.interactedSinceArrival && !this.offeredRoutes.has(this.route)) {
          this.schedule(this.route, 'arrival-rest');
        }
      }
    });

    ['divina:route-start','divina:supreme-orb-will-navigate'].forEach(type => {
      this.listen(doc, type, () => {
        this.traveling = true;
        this.arrived = false;
        this.clearPause('travel');
        this.silence('travel');
      });
    });

    ['divina:route-ready','divina:page-ready'].forEach(type => {
      this.listen(doc, type, event => {
        this.route = normalizeRoute(event.detail?.route || event.detail?.id || this.currentRoute());
        this.syncInvitationLanguage();
        if (!this.arrived) this.setState('silent', 'route-ready');
      });
    });

    this.listen(doc, 'divina:menu-state', event => {
      const state = clean(event.detail?.state || 'closed', 24).toLowerCase();
      this.menuOpen = state !== 'closed';
      if (this.menuOpen) {
        this.clearPause('menu');
        this.silence('menu');
      }
    });

    this.listen(doc, 'divina:magic-bubble-visible', event => {
      if (event.detail?.source !== 'whit-presence') return;
      const route = normalizeRoute(event.detail?.route || this.pendingOfferRoute || this.route);
      this.pendingOfferRoute = '';
      if (!this.offeredRoutes.has(route)) {
        this.offeredRoutes.add(route);
        this.contextualOffers += 1;
      }
      this.setState('offered', 'one-contextual-breath');
      emit(doc, 'divina:whit-living-offer', {
        version:VERSION,
        route,
        residence:'canonical-orb',
        voice:'universe',
        messageIncluded:false,
        privateContentRead:false
      });
    });

    this.listen(doc, 'divina:magic-bubble-silence', () => {
      if (!this.pendingOfferRoute) return;
      this.pendingOfferRoute = '';
      this.offerFailures += 1;
      this.silence('intentions-already-lived');
    });

    this.listen(doc, 'divina:magic-bubble-open', () => this.markInteraction('intention-accepted'));
    this.listen(doc, 'divina:reality-depth', () => this.markInteraction('vertical-immersion'));
    this.listen(doc, 'divina:experience-message-accepted', () => this.markInteraction('message-present'));

    this.listen(doc, 'pointerdown', event => {
      if (event.target?.closest?.('[data-v586-magic-bubble="true"]')) return;
      this.markInteraction('person-touched');
    }, { capture:true, passive:true });
    this.listen(doc, 'keydown', event => {
      if (['Shift','Control','Alt','Meta'].includes(event.key)) return;
      this.markInteraction('person-keyboard');
    }, { capture:true });
    this.listen(win, 'scroll', () => {
      if (clock() - this.arrivalAt > 900) this.markInteraction('person-immersed');
    }, { passive:true });

    this.listen(doc, 'visibilitychange', () => {
      if (doc?.visibilityState === 'hidden') {
        this.clearPause('hidden');
        this.silence('hidden');
      }
    });
    this.listen(win, 'pagehide', () => {
      this.clearPause('pagehide');
      this.silence('pagehide');
    }, { passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const orbCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    const visibleWhitBodies = doc?.querySelectorAll?.('[data-whit-living-presence-ui="true"]')?.length || 0;
    return freeze({
      release:'V594',
      canonicalOrbs,
      orbCanvases,
      visibleWhitBodies,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:orbCanvases === 1,
      separateWhitBody:false,
      touchPolicyInstalled:this.whit?.showGuidance === this.showGuidanceProxy,
      offersWithinLimit:this.contextualOffers <= SESSION_OFFER_LIMIT,
      protectedRoutesSilent:[...SILENT_ROUTES].every(route => !this.offeredRoutes.has(route)),
      commerceOffers:0,
      privateContentReads:0,
      formFieldReads:0,
      storageReads:0,
      storageWrites:0,
      modelCalls:0,
      apiCalls:0,
      domNodesCreated:0,
      newCanvases:0,
      permanentAnimationLoops:0,
      mutationObservers:0
    });
  }

  status() {
    const denominator = this.silenceDecisions + this.contextualOffers;
    return freeze({
      ...WHIT_LIVING_PRESENCE_CONTRACT_V594,
      route:this.route,
      state:this.state,
      arrived:this.arrived,
      traveling:this.traveling,
      menuOpen:this.menuOpen,
      interactedSinceArrival:this.interactedSinceArrival,
      scheduledRoute:this.timerRoute || null,
      pendingOfferRoute:this.pendingOfferRoute || null,
      offeredRoutes:freeze([...this.offeredRoutes]),
      offerRequests:this.offerRequests,
      contextualOffers:this.contextualOffers,
      offerFailures:this.offerFailures,
      contextEvaluations:this.contextEvaluations,
      silenceDecisions:this.silenceDecisions,
      silenceRatio:denominator ? Number((this.silenceDecisions / denominator).toFixed(3)) : 1,
      ordinaryTouchesSilenced:this.ordinaryTouchesSilenced,
      scheduledPauses:this.scheduledPauses,
      cancelledPauses:this.cancelledPauses,
      suppressionReasons:freeze(Object.fromEntries(this.suppressionReasons)),
      soul:safeStatus(this.soul),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.clearPause('destroy');
    this.controller.abort();
    if (this.whit && this.whit.showGuidance === this.showGuidanceProxy && this.originalShowGuidance) {
      this.whit.showGuidance = this.originalShowGuidance;
    }
    for (const surface of this.surfaces) {
      if (!surface?.isConnected) continue;
      const description = this.surfaceDescriptions.get(surface);
      if (description == null) surface.removeAttribute?.('aria-description');
      else surface.setAttribute?.('aria-description', description);
    }
    this.surfaces.clear();
    const root = this.documentElement;
    if (root?.dataset?.whitLivingPresence === 'v594') {
      ['whitLivingPresence','whitLivingResidence','whitLivingTouch','whitLivingState','whitLivingReason']
        .forEach(key => delete root.dataset[key]);
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaWhitLivingPresenceV594 === this) delete globalThis.divinaWhitLivingPresenceV594;
    return true;
  }
}

export function createWhitLivingPresenceV594(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const presence = new WhitLivingPresenceV594(options);
  globalThis[INSTANCE] = presence;
  globalThis.divinaWhitLivingPresenceV594 = presence;
  return presence;
}

export default createWhitLivingPresenceV594;
