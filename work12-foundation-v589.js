/* DIVINA BRUXA — WORK12 · MACROETAPA 4 · NAVEGAÇÃO COORDENADA V592
   Uma Orbe, um universo, uma física, uma presença.

   A Fundação V589 amadurece sem trocar de corpo: agora toque, entrada direta,
   histórico, voltar e avançar atravessam a mesma máquina de estados. Este
   núcleo não desenha, não anima e não cria outra viagem; ele coordena a que já
   existe até a chegada respirar e voltar ao silêncio.
*/

const VERSION = 592;
const FOUNDATION_VERSION = 589;
const INSTANCE = Symbol.for('divina.work12.navigation.v592');
const MAX_INTENTIONS = 2;
const TIMELINE_LIMIT = 32;
const VIOLATION_LIMIT = 16;

export const WORK12_STATES_V592 = Object.freeze([
  'REST',
  'AWAKEN',
  'OFFER',
  'ACCEPT',
  'QUIET',
  'DEPART',
  'TRAVEL',
  'ARRIVE',
  'REVEAL'
]);
export const WORK12_STATES_V589 = WORK12_STATES_V592;

export const WORK12_CONSTITUTION_V592 = Object.freeze({
  version:VERSION,
  foundationVersion:FOUNDATION_VERSION,
  work:'WORK12',
  macroStage:'4-of-10',
  title:'Navegação Coordenada',
  law:'one-orb-one-universe-one-physics-one-presence',
  ritual:Object.freeze(['touch','response','silence']),
  journey:Object.freeze(['intention','quiet','depart','travel','arrive','reveal','rest']),
  axes:Object.freeze({
    horizontal:'travel-between-realities',
    vertical:'immersion',
    depth:'discovery'
  }),
  maximumSimultaneousIntentions:MAX_INTENTIONS,
  interfaceModel:'coordinate-reveal',
  pagesAreConceptual:false,
  duplicateOrb:false,
  teleport:false,
  dryScreenSwap:false,
  automaticWhitSpeech:false,
  silenceIsPresence:true,
  performanceIsMagic:true,
  newVisualEffects:0,
  newCanvases:0,
  newAnimationLoops:0,
  mutationObservers:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0
});
export const WORK12_CONSTITUTION_V589 = WORK12_CONSTITUTION_V592;

const KNOWN_ROUTES = new Set([
  'home','tarot','daily','library','spreads','school','journal','consultations',
  'store','login','subscriptions','ai','music','videos','skins','notifications','admin'
]);

const ALLOWED = Object.freeze({
  REST:new Set(['REST','AWAKEN','OFFER','ACCEPT','QUIET','DEPART']),
  AWAKEN:new Set(['REST','AWAKEN','OFFER','ACCEPT','QUIET','DEPART']),
  OFFER:new Set(['REST','OFFER','ACCEPT','QUIET','DEPART']),
  ACCEPT:new Set(['REST','ACCEPT','QUIET','DEPART']),
  QUIET:new Set(['REST','OFFER','QUIET','DEPART']),
  DEPART:new Set(['REST','DEPART','TRAVEL','ARRIVE']),
  TRAVEL:new Set(['REST','TRAVEL','ARRIVE']),
  ARRIVE:new Set(['REST','ARRIVE','REVEAL']),
  REVEAL:new Set(['REST','AWAKEN','OFFER','DEPART','REVEAL'])
});

const clean = (value, limit = 80) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const normalizeRoute = value => {
  const route = clean(value || 'home', 40).replace(/^#/,'').toLowerCase();
  return KNOWN_ROUTES.has(route) ? route : 'home';
};

const currentRoute = () => normalizeRoute(
  globalThis.document?.body?.dataset?.screen ||
  globalThis.document?.querySelector?.('#app > .screen.active[id], .screen.active[id]')?.id ||
  globalThis.location?.hash ||
  'home'
);

const now = () => Math.round(globalThis.performance?.now?.() || Date.now());

const freeze = value => Object.freeze(value);

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

const emit = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:freeze(detail) }));
};

export class Work12FoundationV589 {
  constructor({
    orbCore = null,
    universe = null,
    journey = null,
    bubbles = null,
    whit = null,
    messageGovernor = null,
    prepare = null,
    navigate = null,
    eventTarget = globalThis.document,
    documentElement = globalThis.document?.documentElement
  } = {}) {
    this.version = VERSION;
    this.eventTarget = eventTarget || null;
    this.documentElement = documentElement || null;
    this.orbCore = orbCore;
    this.universe = universe;
    this.journey = journey;
    this.bubbles = bubbles;
    this.whit = whit;
    this.messageGovernor = messageGovernor;
    this.prepareDelegate = typeof prepare === 'function' ? prepare : null;
    this.navigateDelegate = typeof navigate === 'function' ? navigate : null;
    this.controller = new AbortController();
    this.state = 'REST';
    this.route = currentRoute();
    this.previousRoute = this.route;
    this.destination = null;
    this.sequence = 0;
    this.ready = false;
    this.destroyed = false;
    this.navigation = null;
    this.queuedNavigation = null;
    this.navigationSequence = 0;
    this.historyTraversals = 0;
    this.deepLinks = 0;
    this.arrivals = 0;
    this.historyRepairs = 0;
    this.lastArrival = null;
    this.lastRevealKey = null;
    this.orbNavigateOriginal = null;
    this.orbNavigateProxy = null;
    this.intentions = [];
    this.timeline = [];
    this.violations = [];
    this.lastBootRelease = clean(this.documentElement?.dataset?.work12BootReason,64) || null;
    this.recoveries = this.lastBootRelease ? 1 : 0;
    this.lastAudit = null;

    this.installIdentity();
    this.bind();
    this.attachNavigationAuthority();
    this.record('REST','navigation-coordinator-created',{ route:this.route });
    this.audit('navigation-coordinator-created');
    emit(this.eventTarget,'divina:work12-ready',{
      version:VERSION,
      foundationVersion:FOUNDATION_VERSION,
      state:this.state,
      route:this.route,
      law:WORK12_CONSTITUTION_V592.law
    });
  }

  installIdentity() {
    const root = this.documentElement;
    if (!root?.dataset) return;
    root.dataset.work12 = 'v592';
    root.dataset.work12Macro = '4-navigation-coordinated';
    root.dataset.work12Law = 'one-orb-one-universe-one-physics-one-presence';
    root.dataset.work12State = 'rest';
    root.dataset.work12Route = this.route;
    root.dataset.work12Silence = 'presence';
    root.dataset.work12NavigationAuthority = 'v592';
    root.dataset.work12History = 'coordinated-v592';
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.controller.signal });
  }

  bind() {
    const documentTarget = this.eventTarget;

    this.listen(documentTarget,'pointerdown',event => {
      const orb = event.target?.closest?.('#orb,[data-supreme-orb="living"]');
      if (!orb) return;
      this.transition('AWAKEN','orb-touch',{ route:currentRoute() });
    }, { capture:true, passive:true });

    this.listen(documentTarget,'divina:menu-state',event => {
      const state = clean(event.detail?.state, 24).toUpperCase();
      if (state === 'OPENING' || state === 'OPEN') {
        this.transition('OFFER','intentions-breathe',{ source:'menu' });
      } else if (state === 'NAVIGATING') {
        this.transition('ACCEPT','intention-accepted',{ source:'menu' });
      } else if (state === 'CLOSING' || state === 'REVERSING') {
        this.quiet('intentions-dissolve');
      } else if (state === 'CLOSED' && !this.navigation) {
        this.transition('REST','menu-silent',{ source:'menu' });
      }
    });

    this.listen(documentTarget,'divina:magic-bubble-visible',event => {
      this.transition('OFFER','bubble-breathes',{
        route:normalizeRoute(event.detail?.route || currentRoute()),
        source:clean(event.detail?.source, 32),
        form:clean(event.detail?.form, 24)
      });
    });
    this.listen(documentTarget,'divina:magic-bubble-open',event => {
      this.transition('ACCEPT','bubble-accepted',{
        route:normalizeRoute(event.detail?.route || currentRoute()),
        axis:'vertical'
      });
    });
    this.listen(documentTarget,'divina:magic-bubble-silence',event => {
      this.quiet(clean(event.detail?.reason, 40) || 'bubble-silence');
    });

    this.listen(documentTarget,'divina:supreme-orb-intent',event => {
      this.destination = normalizeRoute(event.detail?.route || this.destination || currentRoute());
      this.transition('ACCEPT','orb-intention',{
        route:this.route,
        destination:this.destination,
        source:clean(event.detail?.source, 48)
      });
    });
    this.listen(documentTarget,'divina:supreme-orb-will-navigate',event => {
      this.beginJourney(event.detail || {});
    });
    this.listen(documentTarget,'divina:orb-ios-journey-state',event => {
      this.followJourney(event.detail || {});
    });
    this.listen(documentTarget,'divina:orb-persistent-finished',event => {
      this.reveal(event.detail || {});
    });
    this.listen(documentTarget,'divina:supreme-orb-did-navigate',event => {
      this.reveal(event.detail || {});
    });
    ['divina:supreme-orb-navigation-error','divina:route-error'].forEach(type => {
      this.listen(documentTarget,type,event => this.recover('navigation-error',event.detail || {}));
    });

    this.listen(documentTarget,'divina:route-ready',event => {
      const readyRoute = normalizeRoute(event.detail?.id || currentRoute());
      if (this.navigation || ['DEPART','TRAVEL','ARRIVE'].includes(this.state)) {
        this.destination = readyRoute;
        this.record(this.state,'reality-ready-before-arrival',{
          route:this.route,
          destination:readyRoute,
          source:clean(event.detail?.source,48)
        });
      } else {
        this.previousRoute = this.route;
        this.route = readyRoute;
        this.syncRoute();
      }
      this.audit('route-ready');
    });
    this.listen(documentTarget,'divina:work12-history',event => {
      const action = clean(event.detail?.action,24).toLowerCase();
      if (action === 'canonicalized') this.historyRepairs += 1;
      this.record(this.state,`history-${action || 'sync'}`,{
        route:normalizeRoute(event.detail?.route || this.route),
        source:clean(event.detail?.source,48)
      });
    });
    const onBootReady = () => {
      if (this.ready) return;
      this.ready = true;
      this.transition('REST','boot-ready',{ route:currentRoute() });
      this.audit('boot-ready');
    };
    this.listen(documentTarget,'divina:boot-ready',onBootReady,{ once:true });
    this.listen(globalThis,'divina:boot-ready',onBootReady,{ once:true });
    this.listen(documentTarget,'divina:loading-bypass',event => {
      this.lastBootRelease = clean(event.detail?.reason || event.detail?.source || 'fail-open', 64);
      this.recoveries += 1;
      this.audit('home-fail-open');
    });
    this.listen(documentTarget,'divina:orb-continuity-reconciled',event => {
      if (event.detail?.recovered) this.recoveries += 1;
      this.audit('orb-continuity');
    });

    this.listen(globalThis,'pageshow',() => {
      const pageRoute = currentRoute();
      if (!this.navigation) {
        this.previousRoute = this.route;
        this.route = pageRoute;
        this.destination = null;
        this.syncRoute();
        if (this.state !== 'REST') this.transition('REST','pageshow-rest',{ route:this.route });
      }
      this.audit('pageshow');
    }, { passive:true });
    this.listen(globalThis,'pagehide',() => {
      this.quiet('pagehide');
      this.messageGovernor?.release?.(null,'work12-pagehide');
    }, { passive:true });
  }

  syncRoute() {
    if (this.documentElement?.dataset) this.documentElement.dataset.work12Route = this.route;
  }

  attachNavigationAuthority() {
    const core = this.orbCore;
    if (!core || typeof core.navigate !== 'function' || this.orbNavigateProxy) return false;
    this.orbNavigateOriginal = core.navigate;
    this.orbNavigateProxy = (route,options = {}) => this.navigate(route,options);
    core.navigate = this.orbNavigateProxy;
    if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationAuthority = 'v592';
    return true;
  }

  record(state, reason, detail = {}) {
    const entry = freeze({
      sequence:++this.sequence,
      state,
      reason:clean(reason, 64) || 'state',
      route:normalizeRoute(detail.route || this.route),
      destination:detail.destination ? normalizeRoute(detail.destination) : this.destination,
      source:clean(detail.source, 48) || null,
      at:now()
    });
    this.timeline = [...this.timeline, entry].slice(-TIMELINE_LIMIT);
    return entry;
  }

  violation(code, detail = {}) {
    const item = freeze({
      code:clean(code, 64) || 'invariant',
      route:this.route,
      state:this.state,
      at:now(),
      ...detail
    });
    this.violations = [...this.violations, item].slice(-VIOLATION_LIMIT);
    if (this.documentElement?.dataset) this.documentElement.dataset.work12Health = 'degraded';
    emit(this.eventTarget,'divina:work12-invariant',{
      version:VERSION,
      code:item.code,
      route:item.route,
      state:item.state
    });
    return item;
  }

  transition(next, reason = 'state', detail = {}) {
    if (this.destroyed) return false;
    const target = clean(next, 16).toUpperCase();
    if (!WORK12_STATES_V589.includes(target)) {
      this.violation('unknown-state',{ target });
      return false;
    }

    // Se um evento intermediário chegar atrasado, recompõe a coreografia em
    // memória sem criar frames, timers ou efeitos paralelos.
    if (target === 'TRAVEL' && !['DEPART','TRAVEL'].includes(this.state)) {
      this.transition('DEPART','continuity-recovered',{ ...detail, source:'work12-corridor' });
    }
    if (target === 'ARRIVE' && !['DEPART','TRAVEL','ARRIVE'].includes(this.state)) {
      this.transition('DEPART','continuity-recovered',{ ...detail, source:'work12-corridor' });
      this.transition('TRAVEL','continuity-recovered',{ ...detail, source:'work12-corridor' });
    }
    if (target === 'REVEAL' && !['ARRIVE','REVEAL'].includes(this.state)) {
      if (['DEPART','TRAVEL'].includes(this.state)) this.transition('ARRIVE','continuity-recovered',detail);
      else if (this.navigation) {
        this.transition('DEPART','continuity-recovered',{ ...detail, source:'work12-corridor' });
        this.transition('TRAVEL','continuity-recovered',{ ...detail, source:'work12-corridor' });
        this.transition('ARRIVE','continuity-recovered',{ ...detail, source:'work12-corridor' });
      }
    }

    const previous = this.state;
    if (!ALLOWED[previous]?.has(target)) {
      this.violation('illegal-transition',{ previous, target });
      return false;
    }
    this.state = target;
    if (this.documentElement?.dataset) this.documentElement.dataset.work12State = target.toLowerCase();
    const entry = this.record(target,reason,detail);
    emit(this.eventTarget,'divina:work12-state',{
      version:VERSION,
      previous,
      state:target,
      reason:entry.reason,
      route:entry.route,
      destination:entry.destination,
      sequence:entry.sequence
    });
    return true;
  }

  quiet(reason = 'silence') {
    if (['DEPART','TRAVEL','ARRIVE'].includes(this.state)) return false;
    const changed = this.transition('QUIET',reason,{ route:this.route });
    const sequence = this.sequence;
    queueMicrotask(() => {
      if (!this.destroyed && this.state === 'QUIET' && this.sequence === sequence && !this.navigation) {
        this.transition('REST','silence-complete',{ route:this.route });
      }
    });
    return changed;
  }

  beginJourney(detail = {}) {
    this.previousRoute = normalizeRoute(detail.from || this.route);
    this.destination = normalizeRoute(detail.to || this.destination || currentRoute());
    this.route = this.previousRoute;
    this.syncRoute();
    if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationPhase = 'depart';
    this.bubbles?.hide?.({ immediate:true, reason:'travel' });
    this.messageGovernor?.release?.(null,'work12-travel');
    this.transition('DEPART','journey-depart',{
      route:this.previousRoute,
      destination:this.destination,
      source:clean(detail.source,48)
    });
  }

  followJourney(detail = {}) {
    const phase = clean(detail.state, 24).toLowerCase();
    const route = normalizeRoute(detail.route || this.destination || this.route);
    if (this.documentElement?.dataset && phase) this.documentElement.dataset.work12NavigationPhase = phase;
    if (phase === 'depart') this.transition('DEPART','journey-depart',{ route, destination:this.destination });
    else if (phase === 'flight' || phase === 'crossing' || phase === 'recovery') {
      this.transition('TRAVEL',`journey-${phase}`,{ route, destination:this.destination });
    } else if (phase === 'arrival' || phase === 'settle') {
      this.transition('ARRIVE',`journey-${phase}`,{ route, destination:this.destination });
    } else if (phase === 'rest' && !this.navigation) {
      this.transition('REST','journey-rest',{ route });
    }
  }

  reveal(detail = {}) {
    const route = normalizeRoute(detail.to || detail.route || this.destination || currentRoute());
    const revealKey = `${this.navigation?.serial || this.navigationSequence}:${route}`;
    if (this.lastRevealKey === revealKey) {
      this.record(this.state,'arrival-coalesced',{ route, destination:route });
      return false;
    }
    this.lastRevealKey = revealKey;
    this.previousRoute = this.route;
    this.route = route;
    this.destination = null;
    this.syncRoute();
    this.arrivals += 1;
    this.lastArrival = freeze({
      route,
      from:this.previousRoute,
      serial:this.navigation?.serial || this.navigationSequence,
      at:now()
    });
    if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationPhase = 'reveal';
    this.transition('REVEAL','reality-revealed',{ route });
    emit(this.eventTarget,'divina:work12-arrival',{
      version:VERSION,
      route,
      from:this.previousRoute,
      serial:this.lastArrival.serial
    });
    const settledRevealKey = revealKey;
    queueMicrotask(() => {
      if (!this.destroyed && this.state === 'REVEAL' && this.lastRevealKey === settledRevealKey) {
        this.transition('REST','reality-breathes',{ route:this.route });
        if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationPhase = 'rest';
      }
    });
    return true;
  }

  recover(reason = 'recovery', detail = {}) {
    this.recoveries += 1;
    this.destination = null;
    this.route = normalizeRoute(detail.from || detail.id || currentRoute());
    this.syncRoute();
    if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationPhase = 'rest';
    this.transition('REST',reason,{ route:this.route });
    this.audit(reason);
  }

  offer({ id, context = '', destination = '', source = 'universe' } = {}) {
    const safeId = clean(id, 80);
    if (!safeId) return freeze({ accepted:false, reason:'missing-intention' });
    if (['DEPART','TRAVEL','ARRIVE'].includes(this.state)) {
      return freeze({ accepted:false, reason:'travel-silence' });
    }
    const existing = this.intentions.find(item => item.id === safeId);
    if (existing) return freeze({ accepted:true, intention:existing, reused:true });
    if (this.intentions.length >= MAX_INTENTIONS) {
      return freeze({ accepted:false, reason:'intention-limit' });
    }
    const intention = freeze({
      id:safeId,
      context:clean(context,80),
      destination:destination ? normalizeRoute(destination) : null,
      source:clean(source,48) || 'universe',
      state:'born',
      bornAt:now()
    });
    this.intentions = [...this.intentions, intention];
    this.transition('OFFER','intention-born',{
      route:this.route,
      destination:intention.destination,
      source:intention.source
    });
    return freeze({ accepted:true, intention, reused:false });
  }

  accept(id) {
    const safeId = clean(id,80);
    const intention = this.intentions.find(item => item.id === safeId);
    if (!intention) return freeze({ accepted:false, reason:'unknown-intention' });
    this.destination = intention.destination;
    this.transition('ACCEPT','intention-accepted',{
      route:this.route,
      destination:intention.destination,
      source:intention.source
    });
    return freeze({ accepted:true, intention });
  }

  completeIntention(id, reason = 'fulfilled') {
    const safeId = clean(id,80);
    const before = this.intentions.length;
    this.intentions = this.intentions.filter(item => item.id !== safeId);
    if (before === this.intentions.length) return false;
    this.record(this.state,`intention-${clean(reason,32)}`,{ route:this.route });
    return true;
  }

  queueNavigation(route, options = {}) {
    if (!this.queuedNavigation) {
      let resolve;
      let reject;
      const promise = new Promise((onResolve,onReject) => {
        resolve = onResolve;
        reject = onReject;
      });
      this.queuedNavigation = {
        route,
        options:{ ...options },
        promise,
        resolve,
        reject,
        retargets:0
      };
    } else {
      this.queuedNavigation.route = route;
      this.queuedNavigation.options = { ...options };
      this.queuedNavigation.retargets += 1;
    }
    if (this.documentElement?.dataset) this.documentElement.dataset.work12QueuedRoute = route;
    this.record(this.state,'navigation-latest-intention',{
      route:this.route,
      destination:route,
      source:clean(options.source,48)
    });
    return this.queuedNavigation.promise;
  }

  drainQueuedNavigation() {
    const queued = this.queuedNavigation;
    if (!queued || this.destroyed || this.navigation) return false;
    this.queuedNavigation = null;
    if (this.documentElement?.dataset) delete this.documentElement.dataset.work12QueuedRoute;
    const settledRoute = normalizeRoute(this.route || currentRoute());
    if (queued.route === settledRoute) {
      this.record(this.state,'navigation-latest-already-arrived',{
        route:settledRoute,
        destination:queued.route,
        source:clean(queued.options?.source,48)
      });
      queued.resolve(settledRoute);
      return true;
    }
    queueMicrotask(() => {
      if (this.destroyed) {
        queued.resolve(null);
        return;
      }
      this.navigate(queued.route, queued.options).then(queued.resolve,queued.reject);
    });
    return true;
  }

  navigate(destination, options = {}) {
    const route = normalizeRoute(destination);
    if (!this.navigateDelegate) return Promise.resolve(null);
    if (options?.initial === true && route === this.route && route === currentRoute()) {
      if (this.documentElement?.dataset) this.documentElement.dataset.work12NavigationPhase = 'rest';
      this.record('REST','initial-coordinate-present',{ route, source:clean(options.source,48) });
      return Promise.resolve(route);
    }
    if (this.navigation?.promise) {
      if (route === this.navigation.route && !this.queuedNavigation) {
        this.record(this.state,'navigation-coalesced',{
          route:this.route,
          destination:this.navigation.route,
          source:clean(options.source,48)
        });
        return this.navigation.promise;
      }
      return this.queueNavigation(route,options);
    }

    const source = clean(options.source,48) || 'work12';
    const historyMode = clean(
      options.historyMode || (source === 'history' ? 'traverse' : source === 'deep-link' ? 'deep-link' : 'push'),
      24
    ) || 'push';
    const serial = ++this.navigationSequence;
    const id = `route:${route}`;
    const offered = this.offer({
      id,
      context:this.route,
      destination:route,
      source
    });
    if (offered.accepted) this.accept(id);

    if (source === 'history' || historyMode === 'traverse') this.historyTraversals += 1;
    if (source === 'deep-link' || historyMode === 'deep-link') this.deepLinks += 1;
    if (this.documentElement?.dataset) {
      this.documentElement.dataset.work12NavigationSource = source;
      this.documentElement.dataset.work12HistoryMode = historyMode;
      this.documentElement.dataset.work12NavigationPhase = 'intention';
      this.documentElement.dataset.work12NavigationSequence = String(serial);
    }

    // A preparação só começa depois que a intenção semântica nasceu e foi
    // aceita. Ela corre em paralelo e nunca pode prender a viagem.
    try { this.prepareDelegate?.(route,options)?.catch?.(() => {}); }
    catch {}

    const promise = Promise.resolve().then(() => this.navigateDelegate(route, options));
    this.navigation = { route, id, promise, serial, source, historyMode };
    promise.catch(error => {
      this.violation('navigation-rejected',{
        destination:route,
        error:clean(error?.name || 'error',32)
      });
      this.recover('navigation-rejected',{ from:this.route });
    }).finally(() => {
      this.completeIntention(id,'fulfilled');
      if (this.navigation?.promise === promise) {
        this.navigation = null;
        if (this.documentElement?.dataset) {
          delete this.documentElement.dataset.work12NavigationSource;
          delete this.documentElement.dataset.work12HistoryMode;
          delete this.documentElement.dataset.work12NavigationSequence;
          if (!['DEPART','TRAVEL','ARRIVE','REVEAL'].includes(this.state)) {
            this.documentElement.dataset.work12NavigationPhase = 'rest';
          }
        }
      }
      if (!['REST','DEPART','TRAVEL','ARRIVE','REVEAL'].includes(this.state)) this.quiet('navigation-complete');
      this.drainQueuedNavigation();
    });
    return promise;
  }

  audit(reason = 'manual') {
    const doc = globalThis.document;
    const count = selector => {
      try { return doc?.querySelectorAll?.(selector)?.length || 0; }
      catch { return 0; }
    };
    const orb = safeStatus(this.orbCore) || this.orbCore?.snapshot?.() || null;
    const universe = safeStatus(this.universe);
    const journey = safeStatus(this.journey);
    const bubbles = safeStatus(this.bubbles);
    const counts = freeze({
      canonicalOrbs:count('#orb'),
      livingOrbs:count('[data-supreme-orb="living"]'),
      orbCanvases:count('#orbCanvas'),
      universeLayers:count('#divinaLivingUniverseV524'),
      journeyLayers:count('#divinaOrbPersistentJourneyV565'),
      magicBubbles:count('[data-v586-magic-bubble="true"]')
    });
    const checks = freeze({
      oneCanonicalOrb:counts.canonicalOrbs === 1,
      oneLivingOrb:counts.livingOrbs === 1 && orb?.oneLivingOrb !== false,
      oneOrbCanvas:counts.orbCanvases === 1,
      oneUniverse:counts.universeLayers === 1 && universe?.oneUniverseCanvas !== false,
      oneJourneyLayer:counts.journeyLayers <= 1,
      noTravelerCopies:Number(journey?.travelerCopies || 0) === 0,
      noTeleport:journey?.teleportFallback !== true && journey?.portalVisual !== true,
      bubblesWithinLaw:counts.magicBubbles <= MAX_INTENTIONS,
      intentionLimit:this.intentions.length <= MAX_INTENTIONS,
      oneNavigationFlight:!this.queuedNavigation || Boolean(this.navigation),
      routeSettlesAtArrival:this.state !== 'REST' || this.route === normalizeRoute(currentRoute()),
      historyCoordinated:this.documentElement?.dataset?.work12NavigationAuthority === 'v592',
      travelPausesHeavyEffects:journey?.heavyEffectsPausedDuringAnyTravel !== false,
      whitSilence:WORK12_CONSTITUTION_V592.automaticWhitSpeech === false
    });
    const failing = Object.entries(checks).filter(([,valid]) => !valid).map(([name]) => name);
    const health = failing.length ? 'degraded' : 'ok';
    if (this.documentElement?.dataset) {
      this.documentElement.dataset.work12Health = health;
      this.documentElement.dataset.work12Audit = clean(reason,40) || 'manual';
    }
    this.lastAudit = freeze({
      version:VERSION,
      reason:clean(reason,48) || 'manual',
      route:this.route,
      state:this.state,
      health,
      counts,
      checks,
      failing:freeze(failing),
      at:now()
    });
    if (failing.length) {
      emit(this.eventTarget,'divina:work12-audit-warning',{
        version:VERSION,
        reason:this.lastAudit.reason,
        failing:freeze([...failing])
      });
    }
    return this.lastAudit;
  }

  status() {
    return freeze({
      ...WORK12_CONSTITUTION_V592,
      state:this.state,
      route:this.route,
      previousRoute:this.previousRoute,
      destination:this.destination,
      ready:this.ready,
      activeNavigation:this.navigation?.route || null,
      queuedNavigation:this.queuedNavigation?.route || null,
      navigationAuthority:this.orbNavigateProxy ? 'work12-v592' : 'delegate-only',
      navigationSequence:this.navigationSequence,
      historyTraversals:this.historyTraversals,
      deepLinks:this.deepLinks,
      historyRepairs:this.historyRepairs,
      arrivals:this.arrivals,
      lastArrival:this.lastArrival,
      historyMode:this.navigation?.historyMode || null,
      navigationSource:this.navigation?.source || null,
      activeIntentions:this.intentions.length,
      intentionIds:freeze(this.intentions.map(item => item.id)),
      transitions:this.timeline.length,
      recoveries:this.recoveries,
      violations:this.violations.length,
      lastBootRelease:this.lastBootRelease,
      audit:this.lastAudit || this.audit('status'),
      cores:freeze({
        orb:safeStatus(this.orbCore) || this.orbCore?.snapshot?.() || null,
        universe:safeStatus(this.universe),
        journey:safeStatus(this.journey),
        bubbles:safeStatus(this.bubbles),
        whit:safeStatus(this.whit),
        messages:safeStatus(this.messageGovernor)
      })
    });
  }

  snapshot() {
    return freeze({
      version:VERSION,
      release:'V592',
      foundationVersion:FOUNDATION_VERSION,
      state:this.state,
      route:this.route,
      destination:this.destination,
      activeNavigation:this.navigation?.route || null,
      queuedNavigation:this.queuedNavigation?.route || null,
      historyTraversals:this.historyTraversals,
      deepLinks:this.deepLinks,
      arrivals:this.arrivals,
      activeIntentions:this.intentions.length,
      health:this.lastAudit?.health || 'checking',
      sequence:this.sequence
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.controller.abort();
    this.intentions = [];
    this.navigation = null;
    if (this.queuedNavigation) this.queuedNavigation.resolve(null);
    this.queuedNavigation = null;
    if (this.orbCore && this.orbNavigateProxy && this.orbCore.navigate === this.orbNavigateProxy) {
      this.orbCore.navigate = this.orbNavigateOriginal;
    }
    this.orbNavigateOriginal = null;
    this.orbNavigateProxy = null;
    const root = this.documentElement;
    if (root?.dataset?.work12 === 'v592') {
      ['work12','work12Macro','work12Law','work12State','work12Route','work12Silence','work12Health','work12Audit',
        'work12NavigationAuthority','work12History','work12NavigationSource','work12HistoryMode','work12NavigationPhase',
        'work12NavigationSequence','work12QueuedRoute']
        .forEach(key => delete root.dataset[key]);
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaWork12V592 === this) delete globalThis.divinaWork12V592;
    return true;
  }
}

export function createWork12FoundationV589(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION) return existing;
  existing?.destroy?.();
  const foundation = new Work12FoundationV589(options);
  globalThis[INSTANCE] = foundation;
  globalThis.divinaWork12V589 = foundation;
  globalThis.divinaWork12V592 = foundation;
  return foundation;
}

export const createWork12NavigationV592 = createWork12FoundationV589;

export default createWork12FoundationV589;
