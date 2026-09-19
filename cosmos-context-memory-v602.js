/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 2 · V602
   Memoria de contexto nao e memoria da pessoa. Este nucleo guarda somente o
   fio publico da sessao: realidade atual, origem, retorno, fase e uma unica
   continuidade possivel. Nao le texto, pergunta, carta, formulario ou emocao.

   Ele observa os maestros aprovados do WORK12. Nunca navega sozinho, nunca
   cria interface, nunca fala pela Whit e nunca fabrica outra Orbe. */

const VERSION = 602;
const INSTANCE = Symbol.for('divina.work13.cosmos.context.memory.v602');
const STORAGE_KEY = 'divina.work13.context.v602';
const MAX_AGE_MS = 6 * 60 * 60 * 1000;
const MAX_PATH = 6;

const ROUTES = new Set([
  'home','tarot','daily','spreads','library','school','journal','ai','skins',
  'consultations','store','music','videos','login','subscriptions',
  'notifications','admin'
]);
const PROTECTED_ROUTES = new Set(['journal','ai','consultations','login','subscriptions','notifications','admin']);
const NON_SUGGESTIBLE_ROUTES = new Set(['ai','consultations','store','login','subscriptions','notifications','admin']);
const READING_PHASES = new Set(['symbol','silence','essence','depth','complete','synthesis']);
const DEPTH_PHASES = new Set(['essence','depth','complete','synthesis']);

const EXPERIENCE_BY_ROUTE = Object.freeze({
  home:'origin',
  tarot:'free-reading',
  daily:'daily-reading',
  spreads:'spread-reading',
  library:'discovery',
  school:'learning',
  journal:'writing',
  ai:'conversation',
  skins:'expression',
  consultations:'human-service',
  store:'curation',
  music:'listening',
  videos:'watching',
  login:'account',
  subscriptions:'rights',
  notifications:'consent',
  admin:'operation'
});

export const COSMOS_CONTEXT_MEMORY_CONTRACT_V602 = Object.freeze({
  version:VERSION,
  base:'WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'2-of-10',
  title:'Memoria de Contexto Global',
  law:'one-orb-one-universe-one-presence-one-journey',
  model:'local-session-route-metadata-only',
  remembers:Object.freeze([
    'current-route','previous-route','origin-route','return-route','pending-route',
    'explicit-destination','public-experience-phase','public-skin-id','recent-route-path',
    'one-natural-next-step'
  ]),
  forbiddenInputs:Object.freeze([
    'form-values','journal-body','private-question','card-identity','card-history',
    'spread-cards','emotion-inference','microphone','camera','location',
    'identity-profile','analytics-profile'
  ]),
  storage:'sessionStorage-one-versioned-key',
  retentionHours:6,
  clearable:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  maximumSuggestedSteps:1,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  newCanvases:0,
  newRenderers:0,
  networkCalls:0,
  modelCalls:0,
  privateContentReads:0,
  formValueReads:0,
  cardIdentityReads:0,
  emotionInference:false,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const clean = (value, limit = 56) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizeRoute = value => {
  const route = clean(value || '', 80).toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return ROUTES.has(route) ? route : '';
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
) || 'home';

const publicExperience = (route, phase = 'entered', active = route !== 'home') => Object.freeze({
  kind:EXPERIENCE_BY_ROUTE[route] || 'presence',
  phase:clean(phase, 24).toLowerCase() || 'entered',
  active:Boolean(active)
});

const safeReturn = (route, current) => {
  const normalized = normalizeRoute(route);
  if (!normalized || normalized === current || normalized === 'home' || NON_SUGGESTIBLE_ROUTES.has(normalized)) return '';
  return normalized;
};

const freezeNext = value => value ? Object.freeze({
  route:value.route,
  intention:value.intention,
  reason:value.reason
}) : null;

export const deriveNaturalNextV602 = context => {
  const route = normalizeRoute(context?.route) || 'home';
  const previous = safeReturn(context?.returnRoute || context?.previousRoute, route);
  const experience = context?.experience || publicExperience(route);
  const phase = clean(experience.phase, 24).toLowerCase();

  if (route === 'home') {
    return previous ? freezeNext({ route:previous, intention:'resume', reason:'session-thread' }) : null;
  }
  if (route === 'tarot' && DEPTH_PHASES.has(phase)) {
    return freezeNext({ route:'library', intention:'discover', reason:'card-to-symbol' });
  }
  if (route === 'daily' && DEPTH_PHASES.has(phase)) {
    return freezeNext({ route:'journal', intention:'keep', reason:'daily-to-journal' });
  }
  if (route === 'spreads' && DEPTH_PHASES.has(phase)) {
    return freezeNext({ route:'journal', intention:'keep', reason:'spread-to-journal' });
  }
  if (route === 'library') {
    return freezeNext({ route:'school', intention:'learn', reason:'symbol-to-study' });
  }
  if (route === 'school') {
    return freezeNext({ route:previous === 'library' ? previous : 'library', intention:'discover', reason:'study-to-symbol' });
  }
  if (route === 'journal' && previous) {
    return freezeNext({ route:previous, intention:'resume', reason:'writing-to-origin' });
  }
  return null;
};

const frozenSnapshot = memory => Object.freeze({
  version:VERSION,
  route:memory.route,
  previousRoute:memory.previousRoute || null,
  originRoute:memory.originRoute || null,
  returnRoute:memory.returnRoute || null,
  pendingRoute:memory.pendingRoute || null,
  lastIntent:memory.lastIntent || null,
  lastEvent:memory.lastEvent,
  experience:Object.freeze({ ...memory.experience }),
  skin:memory.skin || null,
  path:Object.freeze([...memory.path]),
  next:freezeNext(memory.next),
  savedAt:memory.savedAt
});

const eventDispatch = (target, type, detail) => {
  const EventCtor = target?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!target?.dispatchEvent || typeof EventCtor !== 'function') return false;
  target.dispatchEvent(new EventCtor(type, { detail }));
  return true;
};

export class CosmosContextMemoryV602 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    storage = null,
    now = () => Date.now()
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.now = typeof now === 'function' ? now : () => Date.now();
    this.abort = new AbortController();
    this.destroyed = false;
    this.storage = storage || this.resolveStorage();
    this.storageAvailable = Boolean(this.storage);
    this.storageReads = 0;
    this.storageWrites = 0;
    this.storageErrors = 0;
    this.updates = 0;
    this.routeCommits = 0;
    this.ritualUpdates = 0;
    this.chamberUpdates = 0;
    this.skinUpdates = 0;
    this.ignoredEvents = 0;

    const current = routeNow(this.documentTarget, this.windowTarget);
    const restored = this.restore();
    const restoredRoute = normalizeRoute(restored?.route);
    this.route = current;
    this.previousRoute = restoredRoute && restoredRoute !== current
      ? restoredRoute
      : normalizeRoute(restored?.previousRoute);
    this.originRoute = normalizeRoute(restored?.originRoute) || this.previousRoute;
    this.returnRoute = normalizeRoute(restored?.returnRoute) || this.previousRoute;
    this.pendingRoute = '';
    this.lastIntent = normalizeRoute(restored?.lastIntent);
    this.lastEvent = restored ? 'session-restored' : 'session-start';
    this.experience = restoredRoute === current && restored?.experience
      ? publicExperience(current, restored.experience.phase, restored.experience.active)
      : publicExperience(current);
    this.skin = clean(restored?.skin, 40).toLowerCase();
    this.path = Array.isArray(restored?.path)
      ? restored.path.map(normalizeRoute).filter(Boolean).slice(-MAX_PATH)
      : [];
    if (this.path.at(-1) !== current) this.path.push(current);
    this.path = this.path.slice(-MAX_PATH);
    this.savedAt = this.now();
    this.next = deriveNaturalNextV602(this);

    this.installIdentity();
    this.bind();
    this.persist();
    this.publish('ready');
  }

  resolveStorage() {
    try {
      const candidate = this.windowTarget?.sessionStorage;
      if (!candidate?.getItem || !candidate?.setItem || !candidate?.removeItem) return null;
      return candidate;
    } catch {
      return null;
    }
  }

  restore() {
    if (!this.storage) return null;
    try {
      this.storageReads += 1;
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const savedAt = Number(parsed?.savedAt || 0);
      if (parsed?.version !== VERSION || !savedAt || this.now() - savedAt > MAX_AGE_MS) {
        this.storage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      this.storageErrors += 1;
      return null;
    }
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13 = 'cosmos-vivo';
    this.root.dataset.work13Macro = '2-context-memory';
    this.root.dataset.cosmosContextMemory = 'v602';
    this.syncDataset();
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'divina:route-start', event => this.onRouteStart(event));
    this.listen(doc, 'divina:route-ready', event => this.onRouteReady(event));
    this.listen(doc, 'divina:page-ready', event => this.onRouteReady(event));
    this.listen(doc, 'divina:reading-ritual-phase', event => this.onRitualPhase(event));
    this.listen(doc, 'divina:reality-chamber-state', event => this.onChamberState(event));
    this.listen(doc, 'divina:skin-applied', event => this.onSkin(event));
    this.listen(win, 'hashchange', () => this.onRouteReady({ detail:{ id:routeNow(doc, win), source:'history' } }));
    this.listen(win, 'pagehide', () => this.persist(), { passive:true });
  }

  onRouteStart(event) {
    const destination = normalizeRoute(event?.detail?.id || event?.detail?.to || event?.detail?.destination);
    if (!destination) {
      this.ignoredEvents += 1;
      return false;
    }
    this.pendingRoute = destination;
    this.lastIntent = destination;
    this.lastEvent = 'route-start';
    return this.record('route-start');
  }

  onRouteReady(event) {
    const nextRoute = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to)
      || routeNow(this.documentTarget, this.windowTarget);
    if (!nextRoute) {
      this.ignoredEvents += 1;
      return false;
    }
    if (nextRoute === this.route && !this.pendingRoute) return false;

    const leaving = this.route;
    if (nextRoute !== leaving) {
      this.previousRoute = leaving;
      this.originRoute = leaving;
      this.returnRoute = leaving;
      this.route = nextRoute;
      this.routeCommits += 1;
      if (this.path.at(-1) !== nextRoute) this.path.push(nextRoute);
      this.path = this.path.slice(-MAX_PATH);
      this.experience = publicExperience(nextRoute);
    }
    this.pendingRoute = '';
    this.lastEvent = 'route-ready';
    return this.record('route-ready');
  }

  onRitualPhase(event) {
    const kind = normalizeRoute(event?.detail?.kind);
    const phase = clean(event?.detail?.phase, 24).toLowerCase();
    if (!['tarot','daily','spreads'].includes(kind) || !READING_PHASES.has(phase)) {
      this.ignoredEvents += 1;
      return false;
    }
    if (kind !== this.route) return false;
    this.experience = publicExperience(kind, phase, phase !== 'complete');
    this.lastEvent = 'reading-phase';
    this.ritualUpdates += 1;
    return this.record('reading-phase');
  }

  onChamberState(event) {
    const route = normalizeRoute(event?.detail?.route);
    const phase = clean(event?.detail?.state, 24).toLowerCase();
    if (!route || route !== this.route || !['threshold','awakening','present','engaged','travel'].includes(phase)) {
      this.ignoredEvents += 1;
      return false;
    }
    this.experience = publicExperience(route, phase, phase !== 'travel');
    this.lastEvent = 'chamber-state';
    this.chamberUpdates += 1;
    return this.record('chamber-state');
  }

  onSkin(event) {
    const skin = clean(event?.detail?.id || event?.detail?.skin || event?.detail?.skinId, 40).toLowerCase();
    if (!skin || skin === this.skin) return false;
    this.skin = skin;
    this.lastEvent = 'skin-applied';
    this.skinUpdates += 1;
    return this.record('skin-applied');
  }

  record(reason = 'context') {
    if (this.destroyed) return false;
    this.next = deriveNaturalNextV602(this);
    this.savedAt = this.now();
    this.updates += 1;
    this.syncDataset();
    this.persist();
    this.publish(reason);
    return true;
  }

  syncDataset() {
    if (!this.root?.dataset) return false;
    this.root.dataset.cosmosContextRoute = this.route;
    this.root.dataset.cosmosContextOrigin = this.originRoute || 'none';
    this.root.dataset.cosmosContextReturn = this.returnRoute || 'none';
    this.root.dataset.cosmosContextNext = this.next?.route || 'silence';
    this.root.dataset.cosmosContextPrivacy = PROTECTED_ROUTES.has(this.route) ? 'protected-route-only' : 'public-route-only';
    return true;
  }

  persist() {
    if (!this.storage || this.destroyed) return false;
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.snapshot()));
      this.storageWrites += 1;
      return true;
    } catch {
      this.storageErrors += 1;
      return false;
    }
  }

  publish(reason = 'context') {
    return eventDispatch(this.documentTarget, 'divina:context-memory-updated', Object.freeze({
      reason:clean(reason, 32) || 'context',
      context:this.snapshot(),
      automaticNavigation:false,
      automaticWhitSpeech:false
    }));
  }

  nextStep() {
    return freezeNext(this.next);
  }

  snapshot() {
    return frozenSnapshot(this);
  }

  clear(reason = 'explicit-clear') {
    try { this.storage?.removeItem?.(STORAGE_KEY); }
    catch { this.storageErrors += 1; }
    const current = routeNow(this.documentTarget, this.windowTarget);
    this.route = current;
    this.previousRoute = '';
    this.originRoute = '';
    this.returnRoute = '';
    this.pendingRoute = '';
    this.lastIntent = '';
    this.lastEvent = clean(reason, 32) || 'explicit-clear';
    this.experience = publicExperience(current);
    this.skin = '';
    this.path = [current];
    this.savedAt = this.now();
    this.next = null;
    this.syncDataset();
    this.publish('explicit-clear');
    return this.snapshot();
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V602',
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      maximumSuggestedSteps:this.next ? 1 : 0,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      sessionStorageKeys:this.storageAvailable ? 1 : 0,
      localStorageKeys:0,
      privateContentReads:0,
      formValueReads:0,
      cardIdentityReads:0,
      emotionInference:false,
      networkCalls:0,
      modelCalls:0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      deferredTimers:0,
      mutationObservers:0
    });
  }

  status() {
    return Object.freeze({
      ...COSMOS_CONTEXT_MEMORY_CONTRACT_V602,
      context:this.snapshot(),
      next:this.nextStep(),
      storageAvailable:this.storageAvailable,
      storageReads:this.storageReads,
      storageWrites:this.storageWrites,
      storageErrors:this.storageErrors,
      updates:this.updates,
      routeCommits:this.routeCommits,
      ritualUpdates:this.ritualUpdates,
      chamberUpdates:this.chamberUpdates,
      skinUpdates:this.skinUpdates,
      ignoredEvents:this.ignoredEvents,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.persist();
    this.destroyed = true;
    this.abort.abort();
    if (this.root?.dataset?.cosmosContextMemory === 'v602') {
      [
        'work13','work13Macro','cosmosContextMemory','cosmosContextRoute',
        'cosmosContextOrigin','cosmosContextReturn','cosmosContextNext',
        'cosmosContextPrivacy'
      ].forEach(key => delete this.root.dataset[key]);
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaCosmosContextMemoryV602 === this) delete globalThis.divinaCosmosContextMemoryV602;
    return true;
  }
}

export function createCosmosContextMemoryV602(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const memory = new CosmosContextMemoryV602(options);
  globalThis[INSTANCE] = memory;
  globalThis.divinaCosmosContextMemoryV602 = memory;
  return memory;
}

export default createCosmosContextMemoryV602;
