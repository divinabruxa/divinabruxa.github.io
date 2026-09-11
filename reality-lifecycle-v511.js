/* DIVINA BRUXA — MACROETAPA 2 · MOTOR UNIVERSAL DAS REALIDADES V511
   Uma única passagem entre mundos. A Orbe Suprema V501 continua sendo o
   único corpo vivo; o portal de carregamento recebe apenas uma projeção do
   canvas original, sem criar outro motor, sorteio, API ou consciência. */

const VERSION = 511;
const INSTANCE = Symbol.for('divina.reality.lifecycle.v511');
const STYLE_ID = 'divinaRealityLifecycleV511Styles';
const STYLE_HREF = './reality-lifecycle-v511.css?v=511';
const WATCHDOG_MS = 6500;
const ARRIVAL_MS = 480;

const ROUTE_ALIASES = Object.freeze({
  inicio:'home', free:'tarot', 'tarot-livre':'tarot',
  'carta-do-dia':'daily', biblioteca:'library', tiragens:'spreads',
  escola:'school', diario:'journal', espelho:'journal', whit:'ai',
  'orbe-ia':'ai', loja:'store', consultas:'consultations', musica:'music',
  video:'videos', conta:'login', premium:'subscriptions'
});

export const REALITY_SIGNATURES_V511 = Object.freeze({
  home:{ direction:'in', tone:'origin', whisper:'Toda realidade retorna ao centro.' },
  tarot:{ direction:'up', tone:'stellar-fire', whisper:'O fogo estelar abre o círculo.' },
  daily:{ direction:'up-right', tone:'dawn', whisper:'O amanhecer encontra a carta deste dia.' },
  spreads:{ direction:'out', tone:'constellation', whisper:'As posições encontram sua constelação.' },
  school:{ direction:'right', tone:'knowledge', whisper:'O conhecimento acende o próximo caminho.' },
  library:{ direction:'right', tone:'archive', whisper:'As 78 cartas despertam no arquivo vivo.' },
  journal:{ direction:'in', tone:'reflection', whisper:'Seu espaço privado permanece protegido.' },
  ai:{ direction:'out', tone:'mind', whisper:'Whit abre presença, contexto e escuta.' },
  store:{ direction:'down-right', tone:'market', whisper:'A Loja Mística surge entre os portais.' },
  consultations:{ direction:'up-right', tone:'sanctuary', whisper:'O santuário prepara sua entrada.' },
  music:{ direction:'left', tone:'resonance', whisper:'O universo encontra sua frequência.' },
  videos:{ direction:'left', tone:'vision', whisper:'A luz abre o próximo episódio.' },
  skins:{ direction:'around', tone:'metamorphosis', whisper:'A mesma Orbe veste outra realidade.' },
  login:{ direction:'in', tone:'halo', whisper:'Sua conta abre com proteção.' },
  subscriptions:{ direction:'up', tone:'crown', whisper:'A Coroa Premium reconhece seu caminho.' },
  notifications:{ direction:'down', tone:'signal', whisper:'Seus sinais chegam sem revelar o mistério.' },
  admin:{ direction:'in', tone:'guard', whisper:'A autoridade permanece protegida.' }
});

const reducedMotion = view => view.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function normalizeRoute(value) {
  const route = String(value || 'home')
    .trim()
    .replace(/^#/, '')
    .replace(/^\//, '')
    .toLowerCase();
  return ROUTE_ALIASES[route] || route || 'home';
}

function currentRoute(root) {
  return normalizeRoute(
    root.body?.dataset?.screen ||
    root.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
    root.defaultView?.location?.hash ||
    'home'
  );
}

function routeFromDetail(detail, fallback = 'home') {
  return normalizeRoute(detail?.to || detail?.pageId || detail?.id || detail?.route || fallback);
}

function signatureFor(route) {
  return REALITY_SIGNATURES_V511[normalizeRoute(route)] || {
    direction:'out', tone:'cosmos', whisper:'A Orbe abre esta realidade.'
  };
}

function installStyles(root) {
  const existing = root.getElementById(STYLE_ID);
  if (existing) {
    existing.href = STYLE_HREF;
    return existing;
  }
  const link = root.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.realityLifecycleStyle = String(VERSION);
  root.head.append(link);
  return link;
}

function dispatch(root, type, detail = {}) {
  root.dispatchEvent(new CustomEvent(type, {
    detail:Object.freeze({ version:VERSION, ...detail })
  }));
}

export class RealityLifecycleV511 {
  constructor({ root = document, core } = {}) {
    if (!root?.documentElement || !root?.body || !root?.defaultView) {
      throw new TypeError('O documento das realidades não está pronto.');
    }
    if (!core?.orb || !core?.pulse) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes do Motor V511.');
    }

    this.root = root;
    this.view = root.defaultView;
    this.html = root.documentElement;
    this.core = core;
    this.abort = new AbortController();
    this.activeRequests = new Map();
    this.route = currentRoute(root);
    this.destination = null;
    this.phase = 'idle';
    this.sequence = 0;
    this.arrivalTimer = 0;
    this.scrollTimer = 0;
    this.watchdogTimer = 0;
    this.scrollFrame = 0;
    this.observer = null;
    this.loader = null;
    this.loaderOrb = null;
    this.destroyed = false;

    installStyles(root);
    this.html.dataset.realityLifecycle = 'v511';
    this.html.dataset.transitionAuthority = 'supreme-orb-v501';
    this.upgradeLoader();
    this.bind();
    this.observe();
    this.applySignature(this.route);
    this.setPhase('idle', 'install');

    dispatch(root, 'divina:reality-lifecycle-ready', this.status());
  }

  applySignature(rawRoute) {
    const route = normalizeRoute(rawRoute);
    const signature = signatureFor(route);
    this.html.dataset.realityRoute = route;
    this.html.dataset.realityDirection = signature.direction;
    this.html.dataset.realityTone = signature.tone;
    if (this.loader) {
      this.loader.dataset.realityRoute = route;
      this.loader.dataset.realityDirection = signature.direction;
      this.loader.dataset.realityTone = signature.tone;
    }
    return { route, ...signature };
  }

  upgradeLoader(detail = {}) {
    const loader = this.root.getElementById('orbLoadingPortal');
    if (!loader) return false;
    this.loader = loader;
    loader.dataset.realityLifecycle = 'v511';

    const route = routeFromDetail(detail, this.destination || this.route);
    const signature = this.applySignature(route);
    const eyebrow = loader.querySelector('.db-orb-loader__eyebrow');
    const whisper = loader.querySelector('.db-orb-loader__whisper');
    if (eyebrow) eyebrow.textContent = 'ORBE DAS REALIDADES';
    if (whisper && !loader.classList.contains('is-recovery')) {
      whisper.textContent = signature.whisper;
    }

    const projection = loader.querySelector('.db-orb-loader__orb');
    if (!projection) return true;
    this.loaderOrb = projection;
    projection.dataset.orbProjection = 'v511-loader';
    projection.dataset.orbSurface = 'loader-v511';
    projection.dataset.realityProjection = 'supreme-orb-v501';
    projection.setAttribute('aria-hidden', 'true');
    this.core.adoptProjections?.(projection);
    this.core.syncSkin?.();
    return true;
  }

  bind() {
    const options = { signal:this.abort.signal };

    this.root.addEventListener('divina:supreme-orb-will-navigate', event => {
      const route = routeFromDetail(event.detail, this.route);
      this.begin(route, {
        from:normalizeRoute(event.detail?.from || this.route),
        reason:'supreme-orb',
        transitionAlreadyAwake:true
      });
    }, options);

    this.root.addEventListener('divina:route-start', event => {
      const route = routeFromDetail(event.detail, this.route);
      this.begin(route, { from:this.route, reason:'route-start' });
    }, options);

    this.root.addEventListener('divina:loading-start', event => {
      const detail = event.detail || {};
      const id = String(detail.id || `loading:${++this.sequence}`);
      const route = routeFromDetail(detail, this.destination || this.route);
      this.activeRequests.set(id, route);
      this.begin(route, { from:this.route, reason:'loading-start' });
      this.upgradeLoader(detail);
      this.setPhase('loading', 'loading-start');
    }, options);

    this.root.addEventListener('divina:loading-end', event => {
      const id = String(event.detail?.id || '');
      if (id) this.activeRequests.delete(id);
      if (!this.activeRequests.size && this.phase === 'loading') {
        this.setPhase('departing', 'content-ready');
      }
    }, options);

    this.root.addEventListener('divina:page-ready', event => {
      const route = routeFromDetail(event.detail, this.destination || this.route);
      this.html.dataset.realityContentReady = route;
    }, options);

    this.root.addEventListener('divina:route-ready', event => {
      this.arrive(routeFromDetail(event.detail, this.destination || this.route));
    }, options);

    this.root.addEventListener('divina:supreme-orb-did-navigate', event => {
      const route = routeFromDetail(event.detail, this.destination || this.route);
      if (this.phase === 'departing' || this.phase === 'loading') this.arrive(route);
    }, options);

    for (const name of [
      'divina:route-error',
      'divina:page-error',
      'divina:supreme-orb-navigation-error'
    ]) {
      this.root.addEventListener(name, event => this.recover(name, event.detail), options);
    }

    this.root.addEventListener('visibilitychange', () => {
      if (!this.root.hidden && this.phase !== 'idle') this.upgradeLoader({ pageId:this.destination });
    }, options);
  }

  observe() {
    this.observer = new MutationObserver(mutations => {
      if (this.destroyed) return;
      const loaderMissing = !this.loader?.isConnected;
      const loaderAdded = mutations.some(mutation => [...mutation.addedNodes].some(node =>
        node?.id === 'orbLoadingPortal' || node?.querySelector?.('#orbLoadingPortal')
      ));
      if (loaderMissing || loaderAdded) this.upgradeLoader({ pageId:this.destination || this.route });
    });
    this.observer.observe(this.root.body, { childList:true, subtree:true });
  }

  begin(rawRoute, {
    from = this.route,
    reason = 'intent',
    transitionAlreadyAwake = false
  } = {}) {
    if (this.destroyed) return false;
    const route = normalizeRoute(rawRoute);
    const sameJourney = this.destination === route && this.phase !== 'idle' && this.phase !== 'error';
    const active = this.root.querySelector('#app > .screen.active[id], .screen.active[id]');
    const alreadyHere = this.phase === 'idle' && normalizeRoute(active?.id || this.route) === route;
    if (alreadyHere && reason === 'route-start') return false;
    this.destination = route;
    const signature = this.applySignature(route);
    if (sameJourney) return true;

    this.sequence += 1;
    clearTimeout(this.arrivalTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.watchdogTimer);
    cancelAnimationFrame(this.scrollFrame);
    this.root.querySelectorAll('[data-reality-arriving]').forEach(screen => delete screen.dataset.realityArriving);
    this.root.querySelectorAll('[data-reality-leaving]').forEach(screen => delete screen.dataset.realityLeaving);

    if (active && normalizeRoute(active.id) !== route) active.dataset.realityLeaving = 'true';
    this.root.body.classList.add('db511-reality-traveling');
    this.setPhase('departing', reason);

    if (!transitionAlreadyAwake) {
      this.core.prime?.(route, { source:'reality-lifecycle-v511', target:this.core.orb });
      this.core.showTransition?.(signature, 511000 + this.sequence);
    }

    this.watchdogTimer = this.view.setTimeout(() => {
      if (this.phase !== 'idle') this.recover('transition-watchdog', { route });
    }, WATCHDOG_MS);

    dispatch(this.root, 'divina:reality-passage-start', {
      from:normalizeRoute(from), to:route, reason, sequence:this.sequence
    });
    return true;
  }

  arrive(rawRoute) {
    if (this.destroyed) return false;
    const route = normalizeRoute(rawRoute);
    if (this.phase === 'idle' && !this.destination && route === this.route) {
      this.applySignature(route);
      return false;
    }
    this.route = route;
    this.destination = route;
    clearTimeout(this.watchdogTimer);
    this.activeRequests.clear();
    this.applySignature(route);
    delete this.html.dataset.realityContentReady;

    this.root.querySelectorAll('[data-reality-leaving]').forEach(screen => delete screen.dataset.realityLeaving);
    this.root.querySelectorAll('[data-reality-arriving]').forEach(screen => delete screen.dataset.realityArriving);
    const screen = this.root.getElementById(route) || this.root.querySelector('#app > .screen.active[id], .screen.active[id]');
    if (screen) {
      screen.dataset.realityArriving = 'true';
      screen.dataset.realityTone = signatureFor(route).tone;
    }
    this.setPhase('arriving', 'route-ready');

    // Alguns módulos focam o título depois do commit. O segundo ajuste acontece
    // sob o véu da chegada e impede que o cabeçalho da página fique escondido.
    cancelAnimationFrame(this.scrollFrame);
    clearTimeout(this.scrollTimer);
    const resetViewport = () => {
      try { this.view.scrollTo({ top:0, left:0, behavior:'auto' }); }
      catch { this.view.scrollTo(0, 0); }
    };
    this.scrollFrame = this.view.requestAnimationFrame(resetViewport);
    this.scrollTimer = this.view.setTimeout(resetViewport, reducedMotion(this.view) ? 30 : 140);

    this.core.pulse?.('reality-arrival', { intensity:0.46 });
    this.view.setTimeout(() => this.core.hideTransition?.(), reducedMotion(this.view) ? 20 : 220);
    clearTimeout(this.arrivalTimer);
    this.arrivalTimer = this.view.setTimeout(() => this.finish(route), reducedMotion(this.view) ? 90 : ARRIVAL_MS);
    return true;
  }

  finish(route = this.route) {
    if (this.destroyed) return false;
    this.root.querySelectorAll('[data-reality-leaving]').forEach(screen => delete screen.dataset.realityLeaving);
    this.root.querySelectorAll('[data-reality-arriving]').forEach(screen => delete screen.dataset.realityArriving);
    this.root.body.classList.remove('db511-reality-traveling');
    this.destination = null;
    this.setPhase('idle', 'settled');
    dispatch(this.root, 'divina:reality-passage-ready', {
      route:normalizeRoute(route), sequence:this.sequence, oneLivingOrb:true
    });
    return true;
  }

  recover(reason = 'error', detail = {}) {
    if (this.destroyed) return false;
    clearTimeout(this.arrivalTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.watchdogTimer);
    cancelAnimationFrame(this.scrollFrame);
    this.activeRequests.clear();
    this.root.querySelectorAll('[data-reality-leaving]').forEach(screen => delete screen.dataset.realityLeaving);
    this.root.querySelectorAll('[data-reality-arriving]').forEach(screen => delete screen.dataset.realityArriving);
    this.root.body.classList.remove('db511-reality-traveling');
    this.core.hideTransition?.();
    this.destination = null;
    this.setPhase('error', reason);
    dispatch(this.root, 'divina:reality-passage-recovered', {
      route:this.route, reason, recoverable:true, sourceDetail:Boolean(detail)
    });
    this.view.setTimeout(() => this.setPhase('idle', 'recovered'), reducedMotion(this.view) ? 40 : 180);
    return true;
  }

  setPhase(phase, reason = 'state') {
    this.phase = phase;
    this.html.dataset.realityPhase = phase;
    this.html.dataset.realityTransitionReason = reason;
    return phase;
  }

  status() {
    const projection = this.loaderOrb?.querySelector?.('.db-supreme-orb-projection-canvas');
    return Object.freeze({
      version:VERSION,
      phase:this.phase,
      route:this.route,
      destination:this.destination,
      activeRequests:this.activeRequests.size,
      transitionAuthority:'supreme-orb-v501',
      legacyPortalVisible:false,
      loaderProjection:'supreme-orb-v501',
      loaderProjectionConnected:Boolean(projection?.isConnected),
      sameOrbRenderer:true,
      secondLivingOrbCreated:false,
      oneLivingOrb:this.root.querySelectorAll('[data-supreme-orb="living"]').length === 1,
      protectedTarot:'v510',
      protectedDaily:'v509',
      routeSignatures:Object.keys(REALITY_SIGNATURES_V511).length,
      viewportReset:true,
      reducedMotion:reducedMotion(this.view),
      extraApiCalls:0,
      webVibration:false
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.arrivalTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.watchdogTimer);
    cancelAnimationFrame(this.scrollFrame);
    this.abort.abort();
    this.observer?.disconnect();
    this.root.body.classList.remove('db511-reality-traveling');
    this.root.querySelectorAll('[data-reality-leaving]').forEach(screen => delete screen.dataset.realityLeaving);
    this.root.querySelectorAll('[data-reality-arriving]').forEach(screen => delete screen.dataset.realityArriving);
    delete this.html.dataset.realityLifecycle;
    delete this.html.dataset.realityPhase;
    delete this.html.dataset.realityRoute;
    delete this.html.dataset.realityDirection;
    delete this.html.dataset.realityTone;
    delete this.html.dataset.realityTransitionReason;
    delete this.html.dataset.transitionAuthority;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaRealityLifecycleV511 === this) delete globalThis.divinaRealityLifecycleV511;
  }
}

export function installRealityLifecycleV511(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new RealityLifecycleV511(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaRealityLifecycleV511 = instance;
  return instance;
}
