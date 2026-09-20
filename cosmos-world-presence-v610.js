/* DIVINA BRUXA — WORK13 · LAPIDACAO FINAL DAS REALIDADES · V610
   Cada destino existente permanece uma realidade inteira. Esta camada apenas
   retira ornamentos sem funcao, marca a travessia e entrega a chegada ao mundo
   correto. Nao navega, nao cria Orbe e nao toca no motor do Universo. */

const VERSION = 610;
const INSTANCE = Symbol.for('divina.work13.cosmos.world.presence.v610');

export const PUBLIC_WORLD_ROUTES_V610 = Object.freeze([
  'tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','skins','music','videos','subscriptions','login','notifications'
]);

const WORLD_MODES = Object.freeze({
  tarot:'revelation', daily:'dawn', spreads:'constellation', library:'discovery',
  school:'ascent', journal:'reflection', ai:'listening', consultations:'welcome',
  store:'curation', skins:'prism', music:'tide', videos:'frame',
  subscriptions:'clarity', login:'shelter', notifications:'return'
});

const WORLD_LABELS = Object.freeze({
  tarot:'Tarot Livre', daily:'Carta do Dia', spreads:'Tiragens', library:'Biblioteca',
  school:'Escola', journal:'Diário', ai:'Orbe IA', consultations:'Consultas',
  store:'Loja', skins:'Skins', music:'Música', videos:'Vídeos',
  subscriptions:'Premium', login:'Conta', notifications:'Notificações'
});

export const COSMOS_WORLD_PRESENCE_CONTRACT_V610 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  correction:'lapidacao-final',
  publicWorlds:PUBLIC_WORLD_ROUTES_V610.length,
  allMenuDestinationsHaveFullScreens:true,
  reusesExistingRoutes:true,
  reusesCoordinatedNavigationV592:true,
  reusesLivingMenuV593:true,
  reusesCanonicalOrb:true,
  touchesOrbEngine:false,
  touchesUniverseEngine:false,
  automaticNavigation:false,
  visibleTutorialsAdded:0,
  newDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  work14:false
});

const normalizeRoute = value => String(value || 'home')
  .trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0] || 'home';

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class CosmosWorldPresenceV610 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis,
    menuResolver = () => globalThis.divinaMenuV502 || null
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.menuResolver = menuResolver;
    this.root = this.documentTarget?.documentElement || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.pendingRoute = '';
    this.passages = 0;
    this.arrivals = 0;
    this.ornamentsRemoved = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installIdentity();
    this.decorateWorlds();
    this.cleanLivingMenu();
    this.bind();
    this.arrive(this.route, 'boot');
    emit(this.documentTarget, 'divina:world-presence-ready', this.status());
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13FinalPresence = 'v610';
    this.root.dataset.work13Passage = 'silent';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  screen(route) {
    return this.documentTarget?.getElementById?.(normalizeRoute(route)) || null;
  }

  decorateWorlds() {
    let count = 0;
    PUBLIC_WORLD_ROUTES_V610.forEach(route => {
      const screen = this.screen(route);
      if (!screen?.dataset) return;
      screen.dataset.work13World = route;
      screen.dataset.work13WorldMode = WORLD_MODES[route];
      if (!screen.dataset.work13WorldPresence) screen.dataset.work13WorldPresence = 'rest';
      if (!screen.getAttribute?.('aria-label')) screen.setAttribute?.('aria-label', WORLD_LABELS[route]);
      count += 1;
    });
    return count;
  }

  cleanLivingMenu() {
    const menuButton = this.documentTarget?.getElementById?.('menuBtn');
    menuButton?.setAttribute?.('aria-label', 'Abrir o universo');
    menuButton?.querySelectorAll?.(':scope > span')?.forEach?.(node => {
      node.remove?.();
      this.ornamentsRemoved += 1;
    });

    const menu = this.menuResolver?.();
    const menuRoot = menu?.root || this.documentTarget?.getElementById?.('divinaOrbitalMenuV502');
    if (!menuRoot) return false;
    ['.db502-menu__heading','.db502-menu__hint','.db502-menu__intention'].forEach(selector => {
      const node = menuRoot.querySelector?.(selector);
      if (!node) return;
      node.remove?.();
      this.ornamentsRemoved += 1;
    });
    menuRoot.removeAttribute?.('aria-labelledby');
    menuRoot.removeAttribute?.('aria-describedby');
    menuRoot.setAttribute?.('aria-label', 'Universo da Divina Bruxa');
    menuRoot.querySelectorAll?.('[data-v502-route]')?.forEach?.(portal => {
      portal.dataset.work13Portal = 'living';
    });
    return true;
  }

  depart(event) {
    const destination = normalizeRoute(
      event?.detail?.id || event?.detail?.to || event?.detail?.destination || this.route
    );
    this.pendingRoute = destination;
    this.passages += 1;
    if (this.root?.dataset) {
      this.root.dataset.work13Passage = 'crossing';
      this.root.dataset.work13Destination = destination;
    }
    const current = this.screen(this.route);
    const next = this.screen(destination);
    if (current?.dataset?.work13World) current.dataset.work13WorldPresence = 'leaving';
    if (next?.dataset?.work13World) next.dataset.work13WorldPresence = 'approaching';
    return Boolean(next || destination === 'home');
  }

  arrive(route, reason = 'route-ready') {
    const next = normalizeRoute(route || routeNow(this.documentTarget, this.windowTarget));
    this.route = next;
    this.pendingRoute = '';
    PUBLIC_WORLD_ROUTES_V610.forEach(worldRoute => {
      const screen = this.screen(worldRoute);
      if (screen?.dataset) screen.dataset.work13WorldPresence = worldRoute === next ? 'present' : 'rest';
    });
    if (this.root?.dataset) {
      this.root.dataset.work13Passage = 'silent';
      this.root.dataset.work13CurrentWorld = next;
      this.root.dataset.work13ArrivalReason = reason;
      delete this.root.dataset.work13Destination;
    }
    this.arrivals += 1;
    emit(this.documentTarget, 'divina:world-present', {
      version:VERSION,
      route:next,
      mode:WORLD_MODES[next] || 'origin',
      response:'present',
      silence:true,
      automaticNavigation:false
    });
    return true;
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    ['divina:route-start','divina:supreme-orb-will-navigate']
      .forEach(type => this.listen(doc, type, event => this.depart(event)));
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
      .forEach(type => this.listen(doc, type, event => this.arrive(
        event?.detail?.id || event?.detail?.to || event?.detail?.route,
        type
      )));
    this.listen(doc, 'divina:orbital-menu-ready', () => this.cleanLivingMenu());
    this.listen(doc, 'divina:menu-state', () => this.cleanLivingMenu());
    this.listen(win, 'hashchange', () => this.arrive(routeNow(doc, win), 'hashchange'), { passive:true });
    this.listen(win, 'pageshow', () => this.arrive(routeNow(doc, win), 'pageshow'), { passive:true });
  }

  audit() {
    const present = PUBLIC_WORLD_ROUTES_V610.filter(route => Boolean(this.screen(route)));
    const canonicalOrbs = this.documentTarget?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      expectedPublicWorlds:PUBLIC_WORLD_ROUTES_V610.length,
      presentPublicWorlds:present.length,
      missingPublicWorlds:Object.freeze(PUBLIC_WORLD_ROUTES_V610.filter(route => !present.includes(route))),
      everyMenuDestinationHasFullScreen:present.length === PUBLIC_WORLD_ROUTES_V610.length,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      automaticNavigation:false,
      newDomNodes:0,
      permanentAnimationLoops:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...COSMOS_WORLD_PRESENCE_CONTRACT_V610,
      route:this.route,
      pendingRoute:this.pendingRoute,
      passages:this.passages,
      arrivals:this.arrivals,
      ornamentsRemoved:this.ornamentsRemoved,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    PUBLIC_WORLD_ROUTES_V610.forEach(route => {
      const screen = this.screen(route);
      if (!screen?.dataset) return;
      delete screen.dataset.work13World;
      delete screen.dataset.work13WorldMode;
      delete screen.dataset.work13WorldPresence;
    });
    if (this.root?.dataset) {
      delete this.root.dataset.work13FinalPresence;
      delete this.root.dataset.work13Passage;
      delete this.root.dataset.work13CurrentWorld;
      delete this.root.dataset.work13ArrivalReason;
      delete this.root.dataset.work13Destination;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createCosmosWorldPresenceV610(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const presence = new CosmosWorldPresenceV610(options);
  globalThis[INSTANCE] = presence;
  globalThis.divinaCosmosWorldPresenceV610 = presence;
  return presence;
}
