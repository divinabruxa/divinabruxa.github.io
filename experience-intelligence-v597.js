/* DIVINA BRUXA — WORK12 · MACROETAPA 9 · INTELIGÊNCIA DA EXPERIÊNCIA V597
   Inteligência aqui não adivinha a pessoa. Ela lê somente a física pública da
   sessão — rota, viagem, silêncio, foco e visibilidade — para decidir quando o
   universo deve respirar, reduzir ou sair do caminho.

   Nenhum campo, Diário, pergunta, carta privada ou emoção é lido. Whit continua
   dentro da única Orbe e usa presença, nunca comentário automático. */

const VERSION = 597;
const INSTANCE = Symbol.for('divina.work12.experience.intelligence.v597');
const STYLE_ID = 'divinaExperienceIntelligenceV597';
const STYLE_HREF = './experience-intelligence-v597.css?v=597-work12-intelligence';
const MOVEMENT_STATES = new Set(['DEPART','TRAVEL','ARRIVE']);
const FOCUS_SELECTOR = 'input,textarea,select,[contenteditable="true"],[role="textbox"]';

const ROUTE_CONTEXTS = Object.freeze({
  home:Object.freeze({ intention:'silence', soul:'serene', privacy:'public' }),
  tarot:Object.freeze({ intention:'ritual', soul:'listening', privacy:'public' }),
  daily:Object.freeze({ intention:'ritual', soul:'reflecting', privacy:'public' }),
  spreads:Object.freeze({ intention:'ritual', soul:'listening', privacy:'public' }),
  library:Object.freeze({ intention:'discovery', soul:'aware', privacy:'public' }),
  school:Object.freeze({ intention:'discovery', soul:'aware', privacy:'public' }),
  journal:Object.freeze({ intention:'intimacy', soul:'reflecting', privacy:'protected' }),
  ai:Object.freeze({ intention:'invitation', soul:'listening', privacy:'protected' }),
  skins:Object.freeze({ intention:'expression', soul:'aware', privacy:'public' }),
  consultations:Object.freeze({ intention:'clarity', soul:'aware', privacy:'protected' }),
  store:Object.freeze({ intention:'clarity', soul:'aware', privacy:'public' }),
  music:Object.freeze({ intention:'presence', soul:'aware', privacy:'public' }),
  videos:Object.freeze({ intention:'presence', soul:'aware', privacy:'public' }),
  login:Object.freeze({ intention:'access', soul:'serene', privacy:'protected' }),
  subscriptions:Object.freeze({ intention:'clarity', soul:'aware', privacy:'protected' }),
  notifications:Object.freeze({ intention:'choice', soul:'serene', privacy:'protected' }),
  admin:Object.freeze({ intention:'work', soul:'serene', privacy:'protected' })
});

const DEFAULT_CONTEXT = Object.freeze({ intention:'presence', soul:'aware', privacy:'public' });

export const EXPERIENCE_INTELLIGENCE_CONTRACT_V597 = Object.freeze({
  version:VERSION,
  base:'V596',
  work:'WORK12',
  macroStage:'9-of-10',
  title:'Inteligência da Experiência · Performance é Magia',
  law:'one-orb-one-universe-one-physics-one-presence',
  model:'local-deterministic-context-coordinator',
  states:Object.freeze(['still','moving','settling','listening','focus','resting']),
  contextInputs:Object.freeze([
    'route','movement-state','menu-state','ritual-phase','chamber-state',
    'explicit-depth','focus-class','visibility','visual-quality'
  ]),
  forbiddenInputs:Object.freeze([
    'form-values','journal-body','private-question','card-history','emotion-inference',
    'microphone','camera','location','identity-profile'
  ]),
  whitResidence:'canonical-orb',
  automaticWhitSpeech:false,
  silenceIsDecision:true,
  performancePolicy:'movement-first-existing-engine-budget',
  oneDeferredTimer:true,
  permanentAnimationLoops:0,
  mutationObservers:0,
  newCanvases:0,
  newRenderers:0,
  privateContentReads:0,
  formValueReads:0,
  storageReads:0,
  storageWrites:0,
  modelCalls:0,
  apiCalls:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const clean = (value, limit = 56) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizeRoute = value => {
  const route = clean(value || 'home', 80).toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const reducedMotion = win => win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const dispatch = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class ExperienceIntelligenceV597 {
  constructor({
    universe = globalThis.divinaLivingUniverseV524,
    foundation = globalThis.divinaWork12V592,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme,
    soul = globalThis.divinaWhitOrbSoulV581,
    presence = globalThis.divinaWhitLivingPresenceV594,
    ritual = globalThis.divinaReadingRitualV595,
    chambers = globalThis.divinaRealityChambersV596,
    performance = globalThis.divinaSkinPerformanceV518,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.universe = universe || null;
    this.foundation = foundation || null;
    this.orbCore = orbCore || null;
    this.soul = soul || null;
    this.presence = presence || null;
    this.ritual = ritual || null;
    this.chambers = chambers || null;
    this.performance = performance || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.setTimer = typeof setTimer === 'function' ? setTimer : setTimeout;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : clearTimeout;
    this.abort = new AbortController();

    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.context = ROUTE_CONTEXTS[this.route] || DEFAULT_CONTEXT;
    this.state = 'still';
    this.reason = 'boot';
    this.budget = 'normal';
    this.quality = this.qualityNow();
    this.destination = '';
    this.moving = false;
    this.menuOpen = false;
    this.focusActive = false;
    this.hidden = this.documentTarget?.visibilityState === 'hidden';
    this.softBudgetActive = false;
    this.universePausedByIntelligence = false;
    this.timer = 0;
    this.sequence = 0;
    this.transitions = 0;
    this.silenceDecisions = 0;
    this.contextDecisions = 0;
    this.performanceDecisions = 0;
    this.cancelledSettles = 0;
    this.completedSettles = 0;
    this.focusSessions = 0;
    this.destroyed = false;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.applyContext('boot');
    dispatch(this.documentTarget, 'divina:experience-intelligence-ready', this.status());
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
    this.root.dataset.experienceIntelligence = 'v597';
    this.root.dataset.experienceState = this.state;
    this.root.dataset.experienceContext = this.context.intention;
    this.root.dataset.experiencePrivacy = this.context.privacy;
    this.root.dataset.experienceBudget = this.budget;
    this.root.dataset.experienceQuality = this.quality;
    return true;
  }

  qualityNow() {
    const root = this.root;
    if (reducedMotion(this.windowTarget)) return 'protected';
    if (root?.dataset?.performanceTier === 'constrained' || root?.dataset?.visualQuality === 'protected') return 'protected';
    return clean(root?.dataset?.visualQuality || 'balanced', 24).toLowerCase() || 'balanced';
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    ['divina:route-start','divina:supreme-orb-will-navigate']
      .forEach(type => this.listen(doc, type, event => this.onTravelStart(event)));
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
      .forEach(type => this.listen(doc, type, event => this.onRouteReady(event)));
    this.listen(doc, 'divina:work12-state', event => this.onWork12State(event));
    this.listen(doc, 'divina:menu-state', event => this.onMenuState(event));
    this.listen(doc, 'divina:reading-ritual-phase', event => this.onRitualPhase(event));
    this.listen(doc, 'divina:reality-chamber-state', event => this.onChamberState(event));
    this.listen(doc, 'divina:reality-depth', event => this.onDepth(event));
    this.listen(doc, 'divina:visual-quality', event => this.onQuality(event));
    this.listen(doc, 'focusin', event => this.onFocusIn(event), { capture:true });
    this.listen(doc, 'focusout', event => this.onFocusOut(event), { capture:true });
    this.listen(doc, 'visibilitychange', () => this.onVisibility());
    this.listen(win, 'pagehide', () => this.onPageHide(), { passive:true });
    this.listen(win, 'pageshow', () => this.onPageShow(), { passive:true });
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win), reason:'hashchange' } }));
  }

  updateContext(route = this.route, reason = 'context') {
    this.route = normalizeRoute(route);
    this.context = ROUTE_CONTEXTS[this.route] || DEFAULT_CONTEXT;
    this.contextDecisions += 1;
    if (this.root?.dataset) {
      this.root.dataset.experienceRoute = this.route;
      this.root.dataset.experienceContext = this.context.intention;
      this.root.dataset.experiencePrivacy = this.context.privacy;
      this.root.dataset.experienceContextReason = clean(reason, 48) || 'context';
    }
    return this.context;
  }

  setState(state, reason = 'state') {
    const next = EXPERIENCE_INTELLIGENCE_CONTRACT_V597.states.includes(state) ? state : 'still';
    this.state = next;
    this.reason = clean(reason, 48) || 'state';
    this.transitions += 1;
    if (this.root?.dataset) {
      this.root.dataset.experienceState = next;
      this.root.dataset.experienceReason = this.reason;
    }
    dispatch(this.documentTarget, 'divina:experience-intelligence-state', {
      version:VERSION,
      route:this.route,
      state:next,
      context:this.context.intention,
      budget:this.budget,
      reason:this.reason,
      automaticWhitSpeech:false,
      privateContentRead:false
    });
    return next;
  }

  setBudget(budget, reason = 'budget', detail = {}) {
    const next = ['normal','quiet','essential','sleeping'].includes(budget) ? budget : 'normal';
    this.budget = next;
    this.performanceDecisions += 1;
    if (this.root?.dataset) {
      this.root.dataset.experienceBudget = next;
      this.root.dataset.experienceBudgetReason = clean(reason, 48) || 'budget';
    }

    if (next === 'essential') {
      if (!this.softBudgetActive) {
        this.universe?.enterTravelBudget?.('experience-intelligence-v597', {
          from:this.route,
          destination:normalizeRoute(detail.destination || this.destination || this.route)
        });
        this.softBudgetActive = true;
      }
    } else if (this.softBudgetActive) {
      this.universe?.leaveTravelBudget?.('experience-intelligence-v597', {
        from:this.route,
        destination:this.route
      });
      this.softBudgetActive = false;
    }
    return next;
  }

  sustainSilence(reason = 'context', state = this.context.soul) {
    this.silenceDecisions += 1;
    this.presence?.silence?.(`experience-${clean(reason, 44)}`, { count:false });
    this.soul?.setState?.(state || 'aware', `experience-${clean(reason, 44)}`, {
      radiate:false,
      transient:0,
      strength:state === 'traveling' ? .10 : .14
    });
    return false;
  }

  clearSettle(reason = 'cancelled') {
    this.sequence += 1;
    if (!this.timer) return false;
    this.clearTimer(this.timer);
    this.timer = 0;
    this.cancelledSettles += 1;
    if (this.root?.dataset) this.root.dataset.experienceSettleReason = clean(reason, 48);
    return true;
  }

  scheduleSettle(reason = 'settle') {
    this.clearSettle(reason);
    const token = ++this.sequence;
    const delay = reducedMotion(this.windowTarget) ? 40 : 280;
    this.timer = this.setTimer(() => {
      this.timer = 0;
      if (this.destroyed || token !== this.sequence || this.moving || this.menuOpen || this.focusActive || this.hidden) return;
      this.completedSettles += 1;
      this.setBudget('normal', `${reason}-complete`);
      this.setState('still', `${reason}-complete`);
      this.sustainSilence(`${reason}-complete`, this.context.soul);
    }, delay);
    return true;
  }

  applyContext(reason = 'context') {
    this.updateContext(this.route, reason);
    if (this.hidden) {
      this.setBudget('sleeping', reason);
      this.setState('resting', reason);
      return this.sustainSilence(reason, 'resting');
    }
    this.setBudget('normal', reason);
    this.setState('still', reason);
    return this.sustainSilence(reason, this.context.soul);
  }

  onTravelStart(event) {
    this.clearSettle('movement');
    this.destination = normalizeRoute(event?.detail?.id || event?.detail?.to || event?.detail?.destination || this.route);
    this.moving = true;
    this.setBudget('essential', 'movement', { destination:this.destination });
    this.setState('moving', 'movement');
    this.sustainSilence('movement', 'traveling');
    return true;
  }

  onRouteReady(event) {
    const route = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget));
    this.moving = false;
    this.destination = '';
    this.updateContext(route, event?.type || event?.detail?.reason || 'route-ready');
    if (this.hidden) return this.onVisibility();
    this.setBudget('quiet', 'arrival');
    this.setState('settling', 'arrival');
    this.sustainSilence('arrival', this.context.soul);
    this.scheduleSettle('arrival');
    return true;
  }

  onWork12State(event) {
    const state = clean(event?.detail?.state || '', 20).toUpperCase();
    if (MOVEMENT_STATES.has(state)) return this.onTravelStart(event);
    if (state === 'REST' || state === 'QUIET') {
      this.moving = false;
      if (!this.menuOpen && !this.focusActive && !this.hidden) this.scheduleSettle('work12-rest');
    }
    return false;
  }

  onMenuState(event) {
    const state = clean(event?.detail?.state || 'closed', 24).toLowerCase();
    this.menuOpen = state !== 'closed';
    if (this.menuOpen) {
      this.clearSettle('menu');
      this.setBudget('quiet', 'menu');
      this.setState('listening', 'menu');
      this.sustainSilence('menu', 'listening');
    } else if (!this.moving && !this.focusActive && !this.hidden) this.scheduleSettle('menu-closed');
    return this.menuOpen;
  }

  onRitualPhase(event) {
    const phase = clean(event?.detail?.phase || 'silence', 24).toLowerCase();
    if (phase === 'travel') return this.onTravelStart(event);
    if (!['symbol','silence','essence','depth'].includes(phase)) return false;
    this.setState('listening', `ritual-${phase}`);
    this.sustainSilence(`ritual-${phase}`, phase === 'essence' ? 'reflecting' : 'listening');
    return true;
  }

  onChamberState(event) {
    const state = clean(event?.detail?.state || '', 24).toLowerCase();
    if (state === 'travel' || state === 'awakening') {
      this.setBudget('essential', `chamber-${state}`, { destination:event?.detail?.route });
      this.setState(state === 'travel' ? 'moving' : 'listening', `chamber-${state}`);
      this.sustainSilence(`chamber-${state}`, state === 'travel' ? 'traveling' : 'listening');
      return true;
    }
    if (state === 'present' || state === 'engaged') {
      this.setBudget('normal', `chamber-${state}`);
      this.setState('still', `chamber-${state}`);
      this.sustainSilence(`chamber-${state}`, this.context.soul);
      return true;
    }
    return false;
  }

  onDepth(event) {
    const route = normalizeRoute(event?.detail?.route || this.route);
    this.updateContext(route, 'explicit-depth');
    this.setState('listening', 'explicit-depth');
    this.sustainSilence('explicit-depth', 'listening');
    return true;
  }

  onQuality(event) {
    this.quality = clean(event?.detail?.tier || this.qualityNow(), 24).toLowerCase() || 'balanced';
    if (this.root?.dataset) this.root.dataset.experienceQuality = this.quality;
    return this.quality;
  }

  isFocusControl(target) {
    return target?.matches?.(FOCUS_SELECTOR) === true || target?.closest?.(FOCUS_SELECTOR) != null;
  }

  onFocusIn(event) {
    if (!this.isFocusControl(event?.target)) return false;
    this.focusActive = true;
    this.focusSessions += 1;
    this.clearSettle('focus');
    this.setBudget('quiet', 'focus');
    this.setState('focus', 'focus');
    this.sustainSilence('focus', 'listening');
    return true;
  }

  onFocusOut(event) {
    if (!this.isFocusControl(event?.target)) return false;
    this.focusActive = false;
    if (!this.moving && !this.menuOpen && !this.hidden) this.scheduleSettle('focus-ended');
    return true;
  }

  suspend(reason = 'hidden') {
    this.hidden = true;
    this.clearSettle(reason);
    this.setBudget('sleeping', reason);
    this.setState('resting', reason);
    this.sustainSilence(reason, 'resting');
    const universeState = safeStatus(this.universe);
    if (universeState?.paused !== true && typeof this.universe?.pause === 'function') {
      this.universe.pause('experience-v597-hidden');
      this.universePausedByIntelligence = true;
    }
    return true;
  }

  onVisibility() {
    const hidden = this.documentTarget?.visibilityState === 'hidden' || this.documentTarget?.hidden === true;
    if (hidden) return this.suspend('hidden');
    this.hidden = false;
    if (this.universePausedByIntelligence) {
      this.universePausedByIntelligence = false;
      this.universe?.start?.('experience-v597-hidden');
    }
    if (!this.moving && !this.menuOpen && !this.focusActive) this.scheduleSettle('visible');
    return false;
  }

  onPageHide() {
    return this.suspend('pagehide');
  }

  onPageShow() {
    return this.onVisibility();
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V597',
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      separateWhitBody:false,
      contextInputs:[...EXPERIENCE_INTELLIGENCE_CONTRACT_V597.contextInputs],
      privateContentReads:0,
      formValueReads:0,
      emotionInference:false,
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
      ...EXPERIENCE_INTELLIGENCE_CONTRACT_V597,
      route:this.route,
      context:this.context,
      state:this.state,
      reason:this.reason,
      budget:this.budget,
      quality:this.quality,
      destination:this.destination || null,
      moving:this.moving,
      menuOpen:this.menuOpen,
      focusActive:this.focusActive,
      hidden:this.hidden,
      timerActive:Boolean(this.timer),
      softBudgetActive:this.softBudgetActive,
      transitions:this.transitions,
      contextDecisions:this.contextDecisions,
      performanceDecisions:this.performanceDecisions,
      silenceDecisions:this.silenceDecisions,
      cancelledSettles:this.cancelledSettles,
      completedSettles:this.completedSettles,
      focusSessions:this.focusSessions,
      automaticWhitSpeech:false,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.clearSettle('destroy');
    this.abort.abort();
    if (this.softBudgetActive) this.universe?.leaveTravelBudget?.('experience-intelligence-v597');
    if (this.universePausedByIntelligence) this.universe?.start?.('experience-v597-hidden');
    this.softBudgetActive = false;
    this.universePausedByIntelligence = false;
    if (this.root?.dataset?.experienceIntelligence === 'v597') {
      [
        'experienceIntelligence','experienceState','experienceReason','experienceRoute',
        'experienceContext','experiencePrivacy','experienceContextReason',
        'experienceBudget','experienceBudgetReason','experienceQuality','experienceSettleReason'
      ].forEach(key => delete this.root.dataset[key]);
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaExperienceIntelligenceV597 === this) delete globalThis.divinaExperienceIntelligenceV597;
    return true;
  }
}

export function createExperienceIntelligenceV597(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const intelligence = new ExperienceIntelligenceV597(options);
  globalThis[INSTANCE] = intelligence;
  globalThis.divinaExperienceIntelligenceV597 = intelligence;
  return intelligence;
}

export default createExperienceIntelligenceV597;
