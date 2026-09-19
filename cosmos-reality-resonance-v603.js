/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 3 · V603
   O universo reconhece cada realidade sem ganhar outro corpo. Esta camada
   traduz somente rota e fase publicas em uma ressonancia discreta aplicada ao
   veu que ja pertence ao unico universo V524. Nao le conteudo, nao navega,
   nao fala pela Whit e nao cria Orbe, canvas, renderer, gesto ou relogio. */

const VERSION = 603;
const INSTANCE = Symbol.for('divina.work13.cosmos.reality.resonance.v603');

const ROUTES = new Set([
  'home','tarot','daily','spreads','library','school','journal','ai','skins',
  'consultations','store','music','videos','login','subscriptions',
  'notifications','admin'
]);

const PHASES = new Set([
  'entered','symbol','silence','essence','depth','complete','synthesis',
  'threshold','awakening','present','engaged','travel'
]);

const ROUTE_RESONANCE = Object.freeze({
  home:          Object.freeze({ mode:'origin',      x:50, y:50, accent:2.2, warmth:0.8, horizon:1.4, vignette:28 }),
  tarot:         Object.freeze({ mode:'revelation',  x:50, y:58, accent:4.8, warmth:1.8, horizon:2.3, vignette:31 }),
  daily:         Object.freeze({ mode:'dawn',        x:50, y:36, accent:3.2, warmth:4.6, horizon:2.6, vignette:27 }),
  spreads:       Object.freeze({ mode:'constellation',x:55,y:54, accent:4.6, warmth:2.4, horizon:2.8, vignette:32 }),
  library:       Object.freeze({ mode:'discovery',   x:29, y:38, accent:2.8, warmth:3.0, horizon:2.0, vignette:25 }),
  school:        Object.freeze({ mode:'ascent',      x:70, y:34, accent:2.5, warmth:3.8, horizon:2.1, vignette:24 }),
  journal:       Object.freeze({ mode:'reflection',  x:32, y:68, accent:3.8, warmth:1.2, horizon:1.5, vignette:35 }),
  ai:            Object.freeze({ mode:'listening',   x:50, y:47, accent:4.4, warmth:1.0, horizon:2.0, vignette:33 }),
  skins:         Object.freeze({ mode:'prism',       x:50, y:50, accent:5.2, warmth:3.2, horizon:2.8, vignette:25 }),
  consultations: Object.freeze({ mode:'welcome',     x:66, y:44, accent:2.4, warmth:4.2, horizon:2.0, vignette:28 }),
  store:         Object.freeze({ mode:'curation',    x:72, y:60, accent:2.5, warmth:3.7, horizon:1.9, vignette:27 }),
  music:         Object.freeze({ mode:'tide',        x:27, y:55, accent:4.1, warmth:2.0, horizon:2.8, vignette:27 }),
  videos:        Object.freeze({ mode:'frame',       x:70, y:40, accent:3.2, warmth:2.5, horizon:2.1, vignette:30 }),
  login:         Object.freeze({ mode:'shelter',     x:50, y:60, accent:1.9, warmth:1.5, horizon:1.1, vignette:36 }),
  subscriptions: Object.freeze({ mode:'clarity',     x:50, y:40, accent:2.8, warmth:4.0, horizon:2.0, vignette:27 }),
  notifications: Object.freeze({ mode:'return',      x:38, y:42, accent:2.3, warmth:2.1, horizon:1.5, vignette:30 }),
  admin:         Object.freeze({ mode:'stillness',   x:50, y:50, accent:1.4, warmth:0.8, horizon:0.8, vignette:40 })
});

const READING_ADJUSTMENTS = Object.freeze({
  symbol:    Object.freeze({ accent:0.6, warmth:0.1, horizon:0.2, vignette:0,  state:'symbol' }),
  silence:   Object.freeze({ accent:-1.0,warmth:-0.6,horizon:-0.5,vignette:3,  state:'silence' }),
  essence:   Object.freeze({ accent:0.4, warmth:0.9, horizon:0.3, vignette:0,  state:'essence' }),
  depth:     Object.freeze({ accent:0.9, warmth:0.2, horizon:0.5, vignette:2,  state:'depth' }),
  complete:  Object.freeze({ accent:-0.2,warmth:0.5, horizon:-0.1,vignette:0,  state:'settled' }),
  synthesis: Object.freeze({ accent:0.5, warmth:0.7, horizon:0.2, vignette:1,  state:'synthesis' })
});

const CHAMBER_ADJUSTMENTS = Object.freeze({
  threshold: Object.freeze({ accent:-0.7,warmth:-0.4,horizon:-0.3,vignette:2,  state:'threshold' }),
  awakening: Object.freeze({ accent:0.5, warmth:0.4, horizon:0.3, vignette:0,  state:'awakening' }),
  present:   Object.freeze({ accent:0,   warmth:0,   horizon:0,   vignette:0,  state:'present' }),
  engaged:   Object.freeze({ accent:0.6, warmth:0.3, horizon:0.4, vignette:1,  state:'engaged' }),
  travel:    Object.freeze({ accent:-2.2,warmth:-1.4,horizon:-1.4,vignette:1,  state:'travel' })
});

export const COSMOS_REALITY_RESONANCE_CONTRACT_V603 = Object.freeze({
  version:VERSION,
  base:'V602-context-memory-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'3-of-10',
  title:'Ressonancia Viva das Realidades',
  law:'one-orb-one-universe-one-presence-one-journey',
  inputModel:'public-route-and-public-phase-only',
  routeSignatures:Object.freeze([...ROUTES]),
  phaseSignatures:Object.freeze([...PHASES]),
  reusesExistingUniverse:true,
  reusesExistingVeil:true,
  respectsCurrentSkin:true,
  eventDriven:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  visibleMessages:0,
  suggestedSteps:0,
  privateContentReads:0,
  formValueReads:0,
  journalBodyReads:0,
  cardIdentityReads:0,
  emotionInference:false,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  clickListeners:0,
  inputListeners:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));

const clean = (value, limit = 48) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizeRoute = value => {
  const route = clean(value || '', 80).toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return ROUTES.has(route) ? route : '';
};

const normalizePhase = value => {
  const phase = clean(value || '', 32).toLowerCase();
  return PHASES.has(phase) ? phase : 'entered';
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
) || 'home';

const reducedMotion = win => win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const frozenProfile = profile => Object.freeze({
  route:profile.route,
  phase:profile.phase,
  state:profile.state,
  mode:profile.mode,
  focusX:Number(profile.focusX.toFixed(2)),
  focusY:Number(profile.focusY.toFixed(2)),
  accent:Number(profile.accent.toFixed(2)),
  warmth:Number(profile.warmth.toFixed(2)),
  horizon:Number(profile.horizon.toFixed(2)),
  vignette:Number(profile.vignette.toFixed(2)),
  constrained:Boolean(profile.constrained),
  reducedMotion:Boolean(profile.reducedMotion)
});

export function deriveRealityResonanceV603({
  route = 'home',
  phase = 'entered',
  pendingRoute = '',
  constrained = false,
  prefersReducedMotion = false
} = {}) {
  const normalizedRoute = normalizeRoute(route) || 'home';
  const normalizedPending = normalizeRoute(pendingRoute);
  const normalizedPhase = normalizePhase(phase);
  const base = ROUTE_RESONANCE[normalizedPending || normalizedRoute] || ROUTE_RESONANCE.home;
  const adjustment = normalizedPending
    ? CHAMBER_ADJUSTMENTS.travel
    : READING_ADJUSTMENTS[normalizedPhase] || CHAMBER_ADJUSTMENTS[normalizedPhase] || CHAMBER_ADJUSTMENTS.present;

  let accent = clamp(base.accent + adjustment.accent, 0.8, 6.2);
  let warmth = clamp(base.warmth + adjustment.warmth, 0.4, 5.4);
  let horizon = clamp(base.horizon + adjustment.horizon, 0.5, 3.6);
  const vignette = clamp(base.vignette + adjustment.vignette, 22, 44);

  if (constrained) {
    accent = Math.min(accent, 3.2);
    warmth = Math.min(warmth, 2.8);
    horizon = Math.min(horizon, 2.0);
  }

  return frozenProfile({
    route:normalizedRoute,
    phase:normalizedPending ? 'travel' : normalizedPhase,
    state:normalizedPending ? 'travel' : adjustment.state,
    mode:normalizedPending ? 'passage' : base.mode,
    focusX:base.x,
    focusY:base.y,
    accent,
    warmth,
    horizon,
    vignette,
    constrained,
    reducedMotion:prefersReducedMotion
  });
}

const dispatch = (target, type, detail) => {
  const EventCtor = target?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!target?.dispatchEvent || typeof EventCtor !== 'function') return false;
  target.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class CosmosRealityResonanceV603 {
  constructor({
    universe = globalThis.divinaLivingUniverseV524,
    contextMemory = globalThis.divinaCosmosContextMemoryV602,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.universe = universe || null;
    this.contextMemory = contextMemory || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.destroyed = false;
    this.applies = 0;
    this.skips = 0;
    this.contextUpdates = 0;
    this.routeUpdates = 0;
    this.qualityUpdates = 0;
    this.lastSignature = '';
    this.lastReason = 'boot';
    this.profile = null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'entered';
    this.pendingRoute = '';

    this.installIdentity();
    this.bind();
    const restored = this.safeContext();
    this.commit({
      route:restored?.route || this.route,
      phase:restored?.experience?.phase || 'entered',
      pendingRoute:restored?.pendingRoute || ''
    }, 'boot');
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13 = 'cosmos-vivo';
    this.root.dataset.work13Macro = '3-reality-resonance';
    this.root.dataset.cosmosResonance = 'v603';
    this.root.dataset.cosmosResonancePrivacy = 'public-route-phase-only';
    this.root.dataset.cosmosResonanceWhit = 'silent';
    this.root.dataset.cosmosResonanceMatter = 'existing-veil-only';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'divina:context-memory-updated', event => this.onContext(event));
    this.listen(doc, 'divina:route-start', event => this.onRouteStart(event));
    this.listen(doc, 'divina:route-ready', event => this.onRouteReady(event));
    this.listen(doc, 'divina:page-ready', event => this.onRouteReady(event));
    this.listen(doc, 'divina:visual-quality', () => this.onQuality());
    this.listen(win, 'divina:performance-tier', () => this.onQuality());
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win) } }));
  }

  safeContext() {
    try { return this.contextMemory?.snapshot?.() || null; }
    catch { return null; }
  }

  onContext(event) {
    const context = event?.detail?.context;
    if (!context || typeof context !== 'object') {
      this.skips += 1;
      return false;
    }
    this.contextUpdates += 1;
    return this.commit({
      route:context.route,
      phase:context.experience?.phase,
      pendingRoute:context.pendingRoute
    }, 'context');
  }

  onRouteStart(event) {
    const destination = normalizeRoute(event?.detail?.id || event?.detail?.to || event?.detail?.destination);
    if (!destination) {
      this.skips += 1;
      return false;
    }
    this.routeUpdates += 1;
    return this.commit({ route:this.route, phase:this.phase, pendingRoute:destination }, 'route-start');
  }

  onRouteReady(event) {
    const context = this.safeContext();
    const route = normalizeRoute(context?.route || event?.detail?.id || event?.detail?.route)
      || routeNow(this.documentTarget, this.windowTarget);
    this.routeUpdates += 1;
    return this.commit({
      route,
      phase:context?.experience?.phase || 'entered',
      pendingRoute:context?.pendingRoute || ''
    }, 'route-ready');
  }

  onQuality() {
    this.qualityUpdates += 1;
    const context = this.safeContext();
    this.lastSignature = '';
    return this.commit({
      route:context?.route || this.route,
      phase:context?.experience?.phase || this.phase,
      pendingRoute:context?.pendingRoute || this.pendingRoute
    }, 'quality');
  }

  resolveSurface() {
    const surface = this.universe?.root
      || this.documentTarget?.getElementById?.('divinaLivingUniverseV524')
      || this.documentTarget?.querySelector?.('#divinaLivingUniverseV524');
    const veil = surface?.querySelector?.('.db524-universe__veil') || null;
    return { surface:surface || null, veil };
  }

  commit(input = {}, reason = 'context') {
    if (this.destroyed) return false;
    const route = normalizeRoute(input.route) || this.route || 'home';
    const phase = normalizePhase(input.phase);
    const pendingRoute = normalizeRoute(input.pendingRoute);
    const constrained = this.root?.dataset?.performanceTier === 'constrained'
      || this.root?.dataset?.visualQuality === 'protected';
    const prefersReducedMotion = reducedMotion(this.windowTarget);
    const signature = [route,phase,pendingRoute,constrained ? 'c' : 'f',prefersReducedMotion ? 'r' : 'm'].join('|');
    if (signature === this.lastSignature) {
      this.skips += 1;
      return false;
    }

    const profile = deriveRealityResonanceV603({
      route,phase,pendingRoute,constrained,prefersReducedMotion
    });
    this.lastSignature = signature;
    this.lastReason = clean(reason, 32) || 'context';
    this.route = route;
    this.phase = phase;
    this.pendingRoute = pendingRoute;
    this.profile = profile;
    this.applies += 1;
    this.applyProfile(profile);
    dispatch(this.documentTarget, 'divina:cosmos-resonance-updated', {
      version:VERSION,
      route:profile.route,
      phase:profile.phase,
      state:profile.state,
      mode:profile.mode,
      reason:this.lastReason,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return true;
  }

  applyProfile(profile) {
    if (this.root?.dataset) {
      this.root.dataset.cosmosResonanceRoute = profile.route;
      this.root.dataset.cosmosResonancePhase = profile.phase;
      this.root.dataset.cosmosResonanceState = profile.state;
      this.root.dataset.cosmosResonanceMode = profile.mode;
      this.root.dataset.cosmosResonanceReason = this.lastReason;
    }

    const { surface, veil } = this.resolveSurface();
    if (surface?.dataset) {
      surface.dataset.cosmosResonance = 'v603';
      surface.dataset.cosmosResonanceRoute = profile.route;
      surface.dataset.cosmosResonanceState = profile.state;
      surface.dataset.cosmosResonanceMode = profile.mode;
    }
    if (!veil?.style?.setProperty) return false;
    veil.style.setProperty('--db603-focus-x', `${profile.focusX}%`);
    veil.style.setProperty('--db603-focus-y', `${profile.focusY}%`);
    veil.style.setProperty('--db603-accent-strength', `${profile.accent}%`);
    veil.style.setProperty('--db603-warm-strength', `${profile.warmth}%`);
    veil.style.setProperty('--db603-horizon-strength', `${profile.horizon}%`);
    veil.style.setProperty('--db603-vignette-strength', `${profile.vignette}%`);
    return true;
  }

  snapshot() {
    return Object.freeze({
      version:VERSION,
      route:this.route,
      phase:this.profile?.phase || this.phase,
      pendingRoute:this.pendingRoute || null,
      state:this.profile?.state || null,
      mode:this.profile?.mode || null,
      profile:this.profile ? Object.freeze({ ...this.profile }) : null,
      reason:this.lastReason
    });
  }

  audit() {
    const doc = this.documentTarget;
    const universeCanvasCount = doc?.querySelectorAll?.('#divinaLivingUniverseV524 canvas')?.length || 0;
    return Object.freeze({
      release:'V603',
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      universeCanvases:universeCanvasCount,
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      oneUniverseCanvas:universeCanvasCount === 1,
      reusesExistingUniverse:true,
      reusesExistingVeil:true,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentReads:0,
      formValueReads:0,
      journalBodyReads:0,
      cardIdentityReads:0,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      modelCalls:0,
      newDomNodes:0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      deferredTimers:0,
      mutationObservers:0,
      clickListeners:0,
      inputListeners:0
    });
  }

  status() {
    return Object.freeze({
      ...COSMOS_REALITY_RESONANCE_CONTRACT_V603,
      resonance:this.snapshot(),
      applies:this.applies,
      skips:this.skips,
      contextUpdates:this.contextUpdates,
      routeUpdates:this.routeUpdates,
      qualityUpdates:this.qualityUpdates,
      destroyed:this.destroyed,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    const { surface, veil } = this.resolveSurface();
    [
      '--db603-focus-x','--db603-focus-y','--db603-accent-strength',
      '--db603-warm-strength','--db603-horizon-strength','--db603-vignette-strength'
    ].forEach(name => veil?.style?.removeProperty?.(name));
    if (surface?.dataset?.cosmosResonance === 'v603') {
      ['cosmosResonance','cosmosResonanceRoute','cosmosResonanceState','cosmosResonanceMode']
        .forEach(key => delete surface.dataset[key]);
    }
    if (this.root?.dataset?.cosmosResonance === 'v603') {
      [
        'cosmosResonance','cosmosResonanceRoute','cosmosResonancePhase',
        'cosmosResonanceState','cosmosResonanceMode','cosmosResonanceReason',
        'cosmosResonancePrivacy','cosmosResonanceWhit','cosmosResonanceMatter'
      ].forEach(key => delete this.root.dataset[key]);
    }
    try { if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE]; } catch {}
    return true;
  }
}

export function createCosmosRealityResonanceV603(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const resonance = new CosmosRealityResonanceV603(options);
  globalThis[INSTANCE] = resonance;
  globalThis.divinaCosmosRealityResonanceV603 = resonance;
  return resonance;
}

export default createCosmosRealityResonanceV603;
