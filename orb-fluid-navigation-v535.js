/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 1/14 · V549
   NAVEGAÇÃO FLUIDA DA ORBE — FREEZE TRANSITÓRIO DO FUNDO

   Governa somente o custo da passagem: uma intenção, uma transação e nenhum
   acúmulo de rotas. A Orbe, a viagem V525 e o Universo V524 continuam sendo
   as autoridades visuais. Nenhum conteúdo privado ou campo é observado.
*/

const VERSION = 549;
const INSTANCE = Symbol.for('divina.orb.fluid.navigation.v535');
const HISTORY_LIMIT = 20;
const now = () => globalThis.performance?.now?.() ?? Date.now();
const coarsePointer = () => globalThis.matchMedia?.('(pointer: coarse)').matches === true
  || Number(navigator.maxTouchPoints || 0) > 0;
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const round = value => Number.isFinite(value) ? Math.round(value * 10) / 10 : null;

function transitionFps() {
  if (reducedMotion() || constrained()) return 24;
  return coarsePointer() ? 30 : 36;
}

function safeListen(target, type, handler, signal, options = {}) {
  if (!target?.addEventListener) return;
  try { target.addEventListener(type, handler, { ...options, signal }); }
  catch {
    target.addEventListener(type, handler, options);
    signal?.addEventListener?.('abort', () => target.removeEventListener(type, handler, options), { once:true });
  }
}

export class OrbFluidNavigationV535 {
  constructor({ core = null, universe = null, pageLoader = null, journey = null } = {}) {
    this.version = VERSION;
    this.core = core;
    this.universe = universe;
    this.pageLoader = pageLoader;
    this.journey = journey;
    this.abort = new AbortController();
    this.intentTimes = new Map();
    this.active = null;
    this.history = [];
    this.sequence = 0;
    this.savedUniverseBudget = null;
    this.budgetReasons = new Set();
    this.restoreTimers = new Map();
    this.longTaskObserver = null;
    this.totalLongTasks = 0;
    this.totalLongTaskMs = 0;
    this.coalesced = 0;
    this.destroyed = false;

    this.bind();
    this.observeLongTasks();
    document.documentElement.dataset.orbFluidNavigation = 'v549';
    document.dispatchEvent(new CustomEvent('divina:orb-fluid-navigation-ready', {
      detail:Object.freeze({ version:VERSION, singleFlight:true, transitionFps:transitionFps() })
    }));
  }

  bind() {
    const { signal } = this.abort;
    safeListen(document, 'divina:supreme-orb-intent', event => {
      const route = String(event.detail?.route || 'home');
      const stamp = now();
      const previous = this.intentTimes.get(route);
      if (!previous || stamp - previous > 1400) this.intentTimes.set(route, stamp);
    }, signal, { passive:true });

    safeListen(document, 'divina:supreme-orb-will-navigate', event => this.begin(event.detail), signal, { passive:true });
    safeListen(document, 'divina:route-start', event => this.mark('routeStartAt', event.detail?.id), signal, { passive:true });
    safeListen(document, 'divina:route-ready', event => this.mark('routeCommittedAt', event.detail?.id), signal, { passive:true });
    safeListen(document, 'divina:page-ready', event => this.mark('moduleReadyAt', event.detail?.id), signal, { passive:true });
    safeListen(document, 'divina:page-deferred', event => {
      if (this.active && this.active.to === event.detail?.id) this.active.moduleDeferred = true;
    }, signal, { passive:true });
    safeListen(document, 'divina:supreme-orb-did-navigate', event => this.finish('complete', event.detail), signal, { passive:true });
    safeListen(document, 'divina:supreme-orb-navigation-error', event => this.finish('recovered-error', event.detail), signal, { passive:true });
    safeListen(document, 'divina:supreme-orb-navigation-coalesced', () => { this.coalesced += 1; }, signal, { passive:true });
    safeListen(document, 'divina:menu-state', event => {
      const state = String(event.detail?.state || '').toLowerCase();
      if (['opening','closing','reversing','navigating'].includes(state)) this.applyTransitionBudget('menu');
      else if (['open','closed'].includes(state)) this.scheduleBudgetRelease('menu', 48);
    }, signal, { passive:true });
    safeListen(document, 'visibilitychange', () => {
      if (document.hidden && this.active) this.finish('visibility-safe-finish', { to:this.active.to });
    }, signal, { passive:true });
  }

  begin(detail = {}) {
    this.cancelBudgetRelease('navigation');
    if (this.active) this.finish('superseded-safe-finish', { to:this.active.to }, false);
    const startedAt = now();
    const to = String(detail.to || 'home');
    const intentAt = this.intentTimes.get(to) || startedAt;
    this.intentTimes.delete(to);
    this.active = {
      id:++this.sequence,
      from:String(detail.from || document.body?.dataset?.screen || 'home'),
      to,
      source:String(detail.source || 'orbe-navigation'),
      intentAt,
      startedAt,
      routeStartAt:null,
      routeCommittedAt:null,
      moduleReadyAt:null,
      finishedAt:null,
      moduleDeferred:false,
      longTasks:0,
      longTaskMs:0
    };

    const html = document.documentElement;
    html.dataset.orbNavigationState = 'active';
    html.dataset.orbNavigationAuthority = 'v549';
    html.dataset.orbNavigationRoute = to;
    document.body?.setAttribute('aria-busy', 'true');
    this.applyTransitionBudget('navigation');
  }

  mark(field, route) {
    const stamp = now();
    if (!this.active || (route && String(route) !== this.active.to)) return;
    if (!this.active[field]) this.active[field] = stamp;
  }

  applyTransitionBudget(reason = 'navigation') {
    if (!this.universe) return;
    this.cancelBudgetRelease(reason);
    this.budgetReasons.add(reason);
    if (!this.savedUniverseBudget) {
      const status = this.universe.status?.() || {};
      this.savedUniverseBudget = Object.freeze({
        fps:Number(status.targetFps || this.universe.targetFps || 60),
        scale:Number(status.qualityCeiling || this.universe.qualityCeiling || this.universe.scale || 1.45),
        profile:String(status.qualityProfile || this.universe.qualityProfile || 'balanced')
      });
    }
    this.universe.setPerformanceBudget?.({
      fps:Math.min(this.savedUniverseBudget.fps, transitionFps()),
      scale:this.savedUniverseBudget.scale,
      profile:this.savedUniverseBudget.profile
    });
    // O bitmap Retina permanece pintado no CSS. Somente o shader/canvas pesado
    // cede seus quadros enquanto Menu, Orbe e página concluem a passagem.
    this.universe.pause?.();
    document.documentElement.dataset.heavyScene = 'paused-for-navigation';
  }

  scheduleBudgetRelease(reason = 'navigation', delay = 72) {
    this.cancelBudgetRelease(reason);
    const timer = setTimeout(() => {
      this.restoreTimers.delete(reason);
      this.restoreUniverseBudget(reason);
    }, delay);
    this.restoreTimers.set(reason, timer);
  }

  cancelBudgetRelease(reason) {
    const timer = this.restoreTimers.get(reason);
    if (timer) clearTimeout(timer);
    this.restoreTimers.delete(reason);
  }

  restoreUniverseBudget(reason = null, force = false) {
    if (reason) this.budgetReasons.delete(reason);
    if (!force && this.budgetReasons.size) return;
    this.budgetReasons.clear();
    const budget = this.savedUniverseBudget;
    this.savedUniverseBudget = null;
    delete document.documentElement.dataset.heavyScene;
    if (!budget || !this.universe) return;
    this.universe.setPerformanceBudget?.(budget);
    this.universe.start?.();
  }

  finish(outcome = 'complete', detail = {}, restore = true) {
    if (!this.active) {
      if (restore) this.releaseUi();
      return null;
    }
    const finishedAt = now();
    const transaction = this.active;
    this.active = null;
    transaction.finishedAt = finishedAt;
    transaction.outcome = outcome;
    transaction.to = String(detail.to || transaction.to);
    transaction.intentResponseMs = round(transaction.startedAt - transaction.intentAt);
    transaction.routeCommitMs = transaction.routeCommittedAt
      ? round(transaction.routeCommittedAt - transaction.startedAt)
      : null;
    transaction.moduleReadyMs = transaction.moduleReadyAt
      ? round(transaction.moduleReadyAt - transaction.startedAt)
      : null;
    transaction.totalMs = round(finishedAt - transaction.startedAt);
    this.history.push(Object.freeze({ ...transaction }));
    if (this.history.length > HISTORY_LIMIT) this.history.shift();

    document.dispatchEvent(new CustomEvent('divina:orb-navigation-measured', {
      detail:Object.freeze({
        version:VERSION,
        from:transaction.from,
        to:transaction.to,
        outcome,
        routeCommitMs:transaction.routeCommitMs,
        totalMs:transaction.totalMs,
        moduleDeferred:transaction.moduleDeferred,
        longTasks:transaction.longTasks
      })
    }));
    if (restore) this.releaseUi();
    return transaction;
  }

  releaseUi() {
    const html = document.documentElement;
    delete html.dataset.orbNavigationState;
    delete html.dataset.orbNavigationRoute;
    document.body?.removeAttribute('aria-busy');
    this.scheduleBudgetRelease('navigation', 72);
  }

  observeLongTasks() {
    if (typeof PerformanceObserver !== 'function'
      || !PerformanceObserver.supportedEntryTypes?.includes('longtask')) return;
    try {
      this.longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const duration = Math.round(Number(entry.duration || 0));
          this.totalLongTasks += 1;
          this.totalLongTaskMs += duration;
          if (this.active) {
            this.active.longTasks += 1;
            this.active.longTaskMs += duration;
          }
        }
      });
      this.longTaskObserver.observe({ type:'longtask' });
    } catch {}
  }

  audit() {
    const core = this.core?.snapshot?.() || {};
    const journey = this.journey?.status?.() || {};
    return Object.freeze({
      release:'V549',
      oneCanonicalOrb:document.querySelectorAll('#orb').length === 1,
      oneUniverseCanvas:document.querySelectorAll('#divinaLivingUniverseV524 canvas').length <= 1,
      singleFlight:core.navigationAuthority === 'v535-single-flight',
      pagePrepareBudgetMs:Number(this.pageLoader?.navigationPrepareBudgetMs || 0),
      transitionFps:transitionFps(),
      heavyScenePaused:this.budgetReasons.size>0,
      budgetReasons:Object.freeze([...this.budgetReasons]),
      journeyFluidity:/v535$/.test(String(journey.fluidityProfile || '')),
      privateContentReads:0,
      formValueReads:0,
      storageReads:0,
      apiCalls:0,
      realBilling:false,
      productionPublish:false,
      sol:false
    });
  }

  status() {
    return Object.freeze({
      ...this.audit(),
      active:Boolean(this.active),
      route:this.active?.to || document.body?.dataset?.screen || 'home',
      completedNavigations:this.history.length,
      coalescedNavigations:this.coalesced,
      last:this.history[this.history.length - 1] || null,
      longTasks:Object.freeze({ count:this.totalLongTasks, totalMs:this.totalLongTaskMs }),
      permanentAnimationLoops:0,
      extraAnimationLoops:0
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.abort.abort();
    this.longTaskObserver?.disconnect();
    for (const timer of this.restoreTimers.values()) clearTimeout(timer);
    this.restoreTimers.clear();
    this.restoreUniverseBudget(null, true);
    delete document.documentElement.dataset.orbNavigationState;
    delete document.documentElement.dataset.orbNavigationRoute;
    document.body?.removeAttribute('aria-busy');
    document.documentElement.removeAttribute('data-orb-fluid-navigation');
    document.documentElement.removeAttribute('data-orb-navigation-authority');
    delete globalThis.divinaOrbFluidNavigationV549;
    delete globalThis[INSTANCE];
  }
}

export function createOrbFluidNavigationV535(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const core = new OrbFluidNavigationV535(options);
  globalThis[INSTANCE] = core;
  globalThis.divinaOrbFluidNavigationV549 = core;
  return core;
}

export default createOrbFluidNavigationV535;
