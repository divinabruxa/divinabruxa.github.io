/* DIVINA BRUXA — FECHAMENTO SUPREMO · ORBE SOZINHA, MUNDOS REAIS · V633
   O pentagrama chama o menu. A Orbe abre a realidade em que já está.
   Nenhuma lista cerca a Orbe; nenhuma segunda Orbe, canvas ou física nasce. */

const VERSION = 633;

export const COSMOS_ENTRY_INTENTION_CONTRACT_V610 = Object.freeze({
  phase:'FECHAMENTO-SUPREMO',
  work13:'concluido-com-auditoria-real',
  correction:'orbe-sozinha-portas-reais',
  invitation:'entra-presenca',
  entryIntentions:1,
  visibleEntryWordsHome:1,
  visibleEntryWordsWorlds:0,
  pentagramAssets:1,
  pentagramIsMenu:true,
  globalPentagram:true,
  pentagramPosition:'home-orb-threshold/world-top-corner',
  globalMenuOnEveryPage:true,
  pentagramVisibleWhileMenuOpen:true,
  pentagramTogglesMenu:true,
  worldOrbOpensMenu:false,
  worldOrbAction:'open-current-world',
  menuOpenOrbAction:'home',
  menuOpenOrbDelegatesToMenu:true,
  menuOpenOrbAriaLabel:'Orbe central. Toque para voltar ao Início',
  orbAloneArrival:true,
  repeatedThresholdCopyVisible:false,
  technicalWorldLayersVisible:false,
  realWorldSurfacesUnlocked:15,
  consultationsEntryReconnected:true,
  maximumVisibleIntentions:2,
  menuLife:'birth-breath-answer-silence',
  whitInsideMenu:true,
  whitResidence:'canonical-orb',
  tarotOrbAction:'reveal-only',
  tarotOrbOpensMenu:false,
  responseModel:'touch-answer-world',
  reusesCanonicalOrb:true,
  reusesLivingMenuV593:true,
  reusesFinalContinuityV598:true,
  realityOwnedOrbActionsPreserved:true,
  publicRealityNames:15,
  explanatoryCopy:0,
  automaticNavigation:false,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  technicalMenuCopy:0,
  homePreserved:true,
  worldsFrozen:false,
  worldsReopenedByProof:true,
  iphoneFirst:true,
  work14:false
});

const REALITY_NAMES = Object.freeze({
  tarot:'Tarot Livre',
  daily:'Carta do Dia',
  spreads:'Tiragens',
  library:'Biblioteca',
  school:'Escola',
  journal:'Diário',
  ai:'Whit',
  consultations:'Consultas',
  store:'Loja',
  skins:'Skins',
  music:'Música',
  videos:'Vídeos',
  subscriptions:'Premium',
  login:'Conta',
  notifications:'Notificações'
});

const WORLD_ROUTES = new Set(Object.keys(REALITY_NAMES));
const PRIMARY_WORLD_ACTIONS = Object.freeze({
  consultations:'[data-v608-action="consultations-start"]',
  store:'[data-v608-action="store-start"]',
  subscriptions:'[data-v608-action="subscriptions-primary"]'
});

const normalizeRoute = value => {
  const route = String(value || 'home').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

const routeNow = (doc, win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.documentElement?.dataset?.route
  || win?.location?.hash
  || 'home'
);

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{ detail:Object.freeze(detail) }));
  return true;
};

export class CosmosEntryIntentionV610 {
  constructor(options = {}) {
    this.documentTarget = options.documentTarget || globalThis.document;
    this.windowTarget = options.windowTarget || globalThis.window;
    this.continuity = options.continuity || null;
    this.orbCore = options.orbCore || null;
    this.menuResolver = options.menuResolver || (() => globalThis.divinaMenuV502 || null);
    this.entry = this.documentTarget?.getElementById?.('cosmosEntryIntent') || null;
    this.pentagram = this.entry?.querySelector?.('img') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.menuState = 'closed';
    this.worldPhase = WORLD_ROUTES.has(this.route) ? 'arrival' : 'home';
    this.worldScreen = null;
    this.orbPath = [];
    this.depthActivatedRoutes = new Set();
    this.primaryActivatedRoutes = new Set();
    this.openCalls = 0;
    this.closeCalls = 0;
    this.worldOpenCalls = 0;
    this.worldEntries = 0;
    this.worldOrbResponses = 0;
    this.depthActionClicks = 0;
    this.primaryActionClicks = 0;
    this.openFailures = 0;
    this.pendingOpen = false;
    this.pulses = 0;
    this.renamedRealities = 0;
    this.rehomes = 0;
    this.pathFrame = 0;
    this.pathTimer = 0;
    this.abortController = typeof AbortController === 'function' ? new AbortController() : null;
    this.movedGlobal = false;
    this.ensureGlobalHost();
    const root = this.documentTarget?.documentElement;
    if (root?.dataset) {
      root.dataset.fechamentoSupremo = 'v633';
      root.dataset.fechamentoMenu = 'v630';
      root.dataset.fsupremeWorlds = 'v633';
      root.dataset.work14 = 'false';
    }
    if (this.entry?.dataset) {
      this.entry.dataset.work13MenuSymbol = 'pentagram-v633';
      this.entry.dataset.work13MenuPosition = 'top-corner';
      this.entry.dataset.work13MenuRole = 'global-toggle';
      this.entry.dataset.whitResidence = 'canonical-orb';
      this.entry.dataset.fechamentoEntry = 'entra-presenca';
    }
    this.bind();
    this.renameMenu();
    this.resetWorldGate(this.route,'boot');
    this.sync('boot');
  }

  listen(target, type, handler, options = {}) {
    if (!target?.addEventListener) return;
    const signal = this.abortController?.signal;
    target.addEventListener(type, handler, signal ? { ...options, signal } : options);
  }

  screenFor(route = this.route) {
    return WORLD_ROUTES.has(route) ? this.documentTarget?.getElementById?.(route) || null : null;
  }

  ensureGlobalHost() {
    const body = this.documentTarget?.body;
    const homeHost = this.documentTarget?.querySelector?.('#home .orb-stage-ref') || null;
    const shouldLiveByOrb = this.route === 'home' && this.menuState === 'closed' && !this.isTraveling();
    const host = shouldLiveByOrb && homeHost?.append ? homeHost : body;
    if (!this.entry || !host?.append || this.entry.parentElement === host) return false;
    host.append(this.entry);
    this.movedGlobal = host === body;
    this.rehomes += 1;
    return true;
  }

  isTraveling() {
    const root = this.documentTarget?.documentElement;
    return root?.dataset?.experienceState === 'moving'
      || ['DEPART','TRAVEL','ARRIVE'].includes(String(root?.dataset?.work12State || '').toUpperCase());
  }

  isUniverseReady() {
    return this.menuState === 'closed' && !this.isTraveling();
  }

  isLauncherAvailable() {
    return this.menuState !== 'closed' || !this.isTraveling();
  }

  isCanonicalOrbTarget(target) {
    const candidate = target?.closest?.('#orb');
    return Boolean(candidate && candidate === this.orb);
  }

  isRealityOwnedOrbTarget(target) {
    if (this.route === 'tarot') return true;
    if (this.route === 'daily') return Boolean(target?.closest?.('[data-daily-orb-host]'));
    if (this.route === 'spreads') return Boolean(target?.closest?.('#spreadResult'));
    if (this.route === 'library') return Boolean(
      target?.closest?.('[data-library-orb-host]')
      || target?.closest?.('#cardLibraryApp [data-orb]')
    );
    if (this.route === 'ai') return Boolean(target?.closest?.('#aiApp,.whit-v557-orb-host'));
    return false;
  }

  respond(source = 'entry') {
    if (!this.isLauncherAvailable()) return false;
    if (this.entry?.dataset) this.entry.dataset.response = 'answering';
    const root = this.documentTarget?.documentElement;
    if (root?.dataset) root.dataset.work13EntryResponse = 'answering';
    this.pulses += 1;
    const intensity = source.startsWith('orb') ? .42 : source === 'entry-close' ? .34 : .54;
    this.orbCore?.pulse?.('work13-entry-response', { intensity });
    return true;
  }

  openUniverse(source = 'touch') {
    if (!this.isUniverseReady()) return false;
    this.continuity?.cancelHomeTap?.('entry-intention');
    const opened = this.route === 'home' ? this.continuity?.callUniverse?.(source) : false;
    if (opened) {
      this.openCalls += 1;
      if (this.entry?.dataset) this.entry.dataset.response = 'crossing';
      return true;
    }
    const menu = this.menuResolver?.();
    if (!menu?.open) {
      this.pendingOpen = true;
      if (this.entry?.dataset) this.entry.dataset.response = 'answering';
      return true;
    }
    this.pendingOpen = false;
    this.openCalls += 1;
    if (this.route !== 'home') this.worldOpenCalls += 1;
    if (this.entry?.dataset) this.entry.dataset.response = 'crossing';
    try {
      Promise.resolve(menu.open()).catch(() => { this.openFailures += 1; });
    } catch {
      this.openFailures += 1;
      return false;
    }
    return true;
  }

  closeUniverse(source = 'touch') {
    const menu = this.menuResolver?.();
    if (!menu?.close || (this.menuState === 'closed' && !menu?.targetOpen)) return false;
    this.pendingOpen = false;
    this.closeCalls += 1;
    if (this.entry?.dataset) this.entry.dataset.response = 'closing';
    try {
      Promise.resolve(menu.close({ restoreFocus:false, reason:`pentagram:${source}` }))
        .catch(() => { this.openFailures += 1; });
    } catch {
      this.openFailures += 1;
      return false;
    }
    return true;
  }

  toggleUniverse(source = 'touch') {
    const menu = this.menuResolver?.();
    const open = this.menuState !== 'closed'
      || menu?.targetOpen === true
      || ['opening','open'].includes(String(menu?.state || '').toLowerCase());
    return open ? this.closeUniverse(source) : this.openUniverse(source);
  }

  clearOrbPath() {
    this.orbPath.forEach(node => {
      node?.removeAttribute?.('data-fsupreme-orb-path');
      node?.removeAttribute?.('data-fsupreme-orb-anchor');
    });
    this.orbPath = [];
  }

  markOrbPath(reason = 'sync') {
    this.clearOrbPath();
    const screen = this.screenFor();
    const root = this.documentTarget?.documentElement;
    if (!screen || this.worldPhase !== 'arrival') return false;
    screen.dataset.fsupremeWorld = 'v633';
    screen.dataset.fsupremeWorldPhase = 'arrival';
    screen.dataset.fsupremeWorldReason = String(reason || 'sync').slice(0,48);
    if (root?.dataset) {
      root.dataset.fsupremeWorldRoute = this.route;
      root.dataset.fsupremeWorldPhase = 'arrival';
    }
    if (!this.orb || !screen.contains?.(this.orb)) {
      screen.dataset.fsupremeOrbLocation = 'persistent';
      return Boolean(this.orb);
    }
    screen.dataset.fsupremeOrbLocation = 'inside-world';
    let node = this.orb;
    const anchor = this.orb.parentElement;
    while (node && node !== screen) {
      node.dataset.fsupremeOrbPath = 'true';
      if (node === anchor) node.dataset.fsupremeOrbAnchor = 'true';
      this.orbPath.push(node);
      node = node.parentElement;
    }
    return node === screen;
  }

  scheduleOrbPath(reason = 'settled') {
    const win = this.windowTarget;
    if (!win?.requestAnimationFrame) return this.markOrbPath(reason);
    if (this.pathFrame) win.cancelAnimationFrame?.(this.pathFrame);
    if (this.pathTimer) win.clearTimeout?.(this.pathTimer);
    this.pathFrame = win.requestAnimationFrame(() => {
      this.pathFrame = 0;
      this.markOrbPath(reason);
      this.pathTimer = win.setTimeout?.(() => {
        this.pathTimer = 0;
        if (this.worldPhase === 'arrival' && this.menuState === 'closed') this.markOrbPath(`${reason}-stable`);
      },80) || 0;
    });
    return true;
  }

  resetWorldGate(route = this.route, reason = 'route') {
    this.clearOrbPath();
    const normalized = normalizeRoute(route);
    const root = this.documentTarget?.documentElement;
    this.worldScreen = this.screenFor(normalized);
    if (!WORLD_ROUTES.has(normalized)) {
      this.worldPhase = 'home';
      if (root?.dataset) {
        root.dataset.fsupremeWorldRoute = normalized;
        root.dataset.fsupremeWorldPhase = 'home';
      }
      return false;
    }
    this.worldPhase = 'arrival';
    this.depthActivatedRoutes.delete(normalized);
    this.primaryActivatedRoutes.delete(normalized);
    if (this.worldScreen?.dataset) {
      this.worldScreen.dataset.fsupremeWorld = 'v633';
      this.worldScreen.dataset.fsupremeWorldPhase = 'arrival';
      this.worldScreen.dataset.fsupremeWorldReason = String(reason || 'route').slice(0,48);
    }
    this.scheduleOrbPath(reason);
    return true;
  }

  clickWorldAction(target, kind) {
    if (!target?.click || target.disabled || target.getAttribute?.('aria-disabled') === 'true') return false;
    try {
      target.click();
      if (kind === 'depth') this.depthActionClicks += 1;
      if (kind === 'primary') this.primaryActionClicks += 1;
      return true;
    } catch {
      return false;
    }
  }

  activatePrimaryWorldAction(screen, route) {
    const selector = PRIMARY_WORLD_ACTIONS[route];
    if (!selector || this.primaryActivatedRoutes.has(route)) return false;
    const action = screen?.querySelector?.(selector);
    if (!this.clickWorldAction(action,'primary')) return false;
    this.primaryActivatedRoutes.add(route);
    return true;
  }

  invokeWorldEntry(screen, route, orbWasInThreshold) {
    const run = () => {
      if (orbWasInThreshold && !this.depthActivatedRoutes.has(route)) {
        const depth = screen?.querySelector?.(':scope > .db585-intent-threshold [data-v585-depth]');
        if (this.clickWorldAction(depth,'depth')) this.depthActivatedRoutes.add(route);
      }
      this.activatePrimaryWorldAction(screen,route);
    };
    const queue = this.windowTarget?.queueMicrotask;
    if (typeof queue === 'function') queue(run);
    else Promise.resolve().then(run);
  }

  enterWorld(source = 'orb') {
    if (!WORLD_ROUTES.has(this.route) || this.worldPhase === 'world' || this.menuState !== 'closed') return false;
    const screen = this.screenFor();
    if (!screen) return false;
    const threshold = this.orb?.closest?.('.db585-intent-threshold') || null;
    const orbWasInThreshold = Boolean(threshold && screen.contains?.(threshold));
    this.worldPhase = 'world';
    this.worldEntries += 1;
    this.worldOrbResponses += 1;
    this.clearOrbPath();
    screen.dataset.fsupremeWorld = 'v633';
    screen.dataset.fsupremeWorldPhase = 'world';
    screen.dataset.fsupremeWorldReason = String(source || 'orb').slice(0,48);
    screen.dataset.fsupremeWorldUnlocked = 'true';
    const root = this.documentTarget?.documentElement;
    if (root?.dataset) {
      root.dataset.fsupremeWorldRoute = this.route;
      root.dataset.fsupremeWorldPhase = 'world';
      root.dataset.fsupremeWorldGesture = 'orb';
    }
    this.invokeWorldEntry(screen,this.route,orbWasInThreshold);
    emit(this.documentTarget,'divina:fsupreme-world-opened',{
      version:VERSION,
      route:this.route,
      source,
      oneOrb:true,
      menuOpened:false,
      work14:false
    });
    this.sync('world-opened');
    return true;
  }

  renameMenu() {
    const menu = this.menuResolver?.();
    const root = menu?.root || this.documentTarget?.getElementById?.('divinaOrbitalMenuV502');
    if (!root?.querySelectorAll) return 0;
    let count = 0;
    root.querySelectorAll('[data-v502-route]').forEach(portal => {
      const route = normalizeRoute(portal.dataset?.v502Route || portal.getAttribute?.('data-v502-route'));
      const name = REALITY_NAMES[route];
      if (!name) return;
      const label = portal.querySelector?.('.db502-portal__label');
      if (label) label.textContent = name;
      portal.setAttribute?.('aria-label', name);
      if (route === 'ai' && portal.dataset) portal.dataset.work13Whit = 'inside-canonical-orb';
      count += 1;
    });
    const homeLabel = root.querySelector?.('.db502-menu__home-label');
    if (homeLabel) homeLabel.textContent = 'Início';
    this.renamedRealities = count;
    return count;
  }

  orbLabel(menuOpen) {
    if (menuOpen) return 'Orbe central. Toque para voltar ao Início';
    if (this.route === 'home') return 'Orbe viva. Toque para sentir; o pentagrama abre o universo';
    if (this.worldPhase === 'arrival') return `Orbe viva de ${REALITY_NAMES[this.route] || 'uma nova realidade'}. Toque para entrar`;
    if (this.route === 'tarot') return 'Orbe viva. Toque para revelar a próxima carta';
    if (this.route === 'daily') return 'Orbe viva. Toque para abrir a Carta do Dia';
    if (this.route === 'spreads' && this.orb?.closest?.('#spreadResult')) return 'Orbe viva. Toque para revelar a próxima posição';
    if (this.route === 'library' && this.orb?.closest?.('[data-library-orb-host], #cardLibraryApp [data-orb]')) return 'Orbe viva. Toque para descobrir uma carta';
    if (this.route === 'ai') return 'Orbe viva. Toque para conversar com Whit';
    return `Orbe viva de ${REALITY_NAMES[this.route] || 'esta realidade'}`;
  }

  sync(reason = 'sync') {
    if (!this.entry) return false;
    this.ensureGlobalHost();
    const menuOpen = this.menuState !== 'closed';
    if (!menuOpen && this.worldPhase === 'arrival') this.scheduleOrbPath(reason);
    if (this.orb) this.orb.setAttribute?.('aria-label',this.orbLabel(menuOpen));
    const traveling = this.isTraveling();
    const visible = menuOpen || !traveling;
    const interactive = visible && !traveling && this.menuState !== 'closing';
    if (this.entry?.dataset) {
      this.entry.dataset.work13MenuPosition = this.route === 'home' && this.menuState === 'closed'
        ? 'orb-threshold'
        : 'top-corner';
      this.entry.dataset.response = menuOpen
        ? this.menuState === 'closing' ? 'closing' : 'menu-open'
        : visible ? 'ready' : 'traveling';
      this.entry.dataset.route = this.route;
    }
    this.entry.setAttribute('aria-label', menuOpen
      ? 'Fechar o universo de caminhos'
      : this.route === 'home'
        ? 'Entrá na Divina Bruxa'
        : 'Abrir o universo de caminhos');
    this.entry.setAttribute('aria-hidden', String(!visible));
    this.entry.setAttribute('aria-expanded', String(menuOpen));
    this.entry.tabIndex = interactive ? 0 : -1;
    const root = this.documentTarget?.documentElement;
    if (root?.dataset) {
      root.dataset.work13Entry = menuOpen ? 'menu-open' : visible ? this.route === 'home' ? 'entra' : 'invitation' : 'traveling';
      root.dataset.work13EntryReason = reason;
      root.dataset.work13EntryResponse = menuOpen ? 'menu-open' : visible ? 'ready' : 'traveling';
      root.dataset.work13MenuAccess = visible ? 'present' : 'traveling';
      root.dataset.fsupremeWorldRoute = this.route;
      root.dataset.fsupremeWorldPhase = this.worldPhase;
    }
    return visible;
  }

  bind() {
    this.listen(this.entry, 'pointerdown', event => {
      event.stopPropagation?.();
      this.respond(this.menuState === 'closed' ? 'entry' : 'entry-close');
    }, { passive:true });
    const restEntry = () => {
      if (this.menuState !== 'closed' || !this.entry?.dataset) return;
      this.entry.dataset.response = 'ready';
      const root = this.documentTarget?.documentElement;
      if (root?.dataset) root.dataset.work13EntryResponse = 'ready';
    };
    this.listen(this.entry, 'pointerup', restEntry, { passive:true });
    this.listen(this.entry, 'pointercancel', restEntry, { passive:true });
    this.listen(this.entry, 'click', event => {
      event.preventDefault?.();
      event.stopPropagation?.();
      this.toggleUniverse(event.detail === 0 ? 'keyboard' : 'touch');
    });
    this.listen(this.orb, 'pointerdown', () => {
      if (this.route === 'home' || this.route === 'tarot' || this.menuState !== 'closed') return;
      this.respond('orb');
    }, { passive:true });
    this.listen(this.orb, 'pointerup', restEntry, { passive:true });
    this.listen(this.orb, 'pointercancel', restEntry, { passive:true });
    this.listen(this.documentTarget, 'click', event => {
      if (this.route === 'home' || !this.isCanonicalOrbTarget(event?.target)) return;
      if (this.menuState !== 'closed' || this.isTraveling()) return;
      const owned = this.isRealityOwnedOrbTarget(event?.target);
      if (this.worldPhase === 'arrival') {
        if (!owned) {
          event.preventDefault?.();
          event.stopImmediatePropagation?.();
        }
        this.respond('orb-world');
        this.enterWorld(event.detail === 0 ? 'keyboard-orb' : 'touch-orb');
        return;
      }
      if (owned) return;
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      this.worldOrbResponses += 1;
      this.respond('orb-world-rest');
      emit(this.documentTarget,'divina:fsupreme-world-orb-response',{
        version:VERSION,
        route:this.route,
        phase:'world',
        menuOpened:false
      });
    }, { capture:true });
    this.listen(this.documentTarget, 'keydown', event => {
      if (this.route === 'home' || !this.isCanonicalOrbTarget(event?.target)) return;
      if (this.menuState !== 'closed' || this.isTraveling()) return;
      if (!['Enter',' '].includes(event?.key) || event?.repeat) return;
      const owned = this.isRealityOwnedOrbTarget(event?.target);
      if (this.worldPhase === 'arrival') {
        if (!owned) {
          event.preventDefault?.();
          event.stopImmediatePropagation?.();
        }
        this.respond('orb-keyboard');
        this.enterWorld('keyboard-orb');
        return;
      }
      if (owned) return;
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      this.respond('orb-keyboard-rest');
    }, { capture:true });
    this.listen(this.documentTarget, 'divina:orbital-menu-ready', () => {
      const shouldOpen = this.pendingOpen;
      this.renameMenu();
      this.sync('menu-ready');
      if (shouldOpen) this.openUniverse('menu-ready');
    });
    this.listen(this.documentTarget, 'divina:orb-physical-claim-settled', () => {
      if (this.worldPhase === 'arrival') this.scheduleOrbPath('orb-claim-settled');
      this.sync('orb-claim-settled');
    });
    this.listen(this.documentTarget, 'divina:menu-state', event => {
      this.menuState = String(event?.detail?.state || 'closed').toLowerCase();
      this.renameMenu();
      this.sync('menu');
    });
    this.listen(this.documentTarget, 'divina:route-start', () => {
      this.clearOrbPath();
      const root = this.documentTarget?.documentElement;
      if (root?.dataset) root.dataset.fsupremeWorldPhase = 'traveling';
    });
    const onRoute = event => {
      const next = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget, this.windowTarget)
      );
      const changed = next !== this.route;
      this.route = next;
      this.menuState = 'closed';
      if (changed) this.resetWorldGate(next,'route');
      else if (this.worldPhase === 'arrival') this.scheduleOrbPath('route-settled');
      if (this.worldPhase === 'world') this.activatePrimaryWorldAction(this.screenFor(),this.route);
      this.sync('route');
    };
    this.listen(this.documentTarget, 'divina:route-ready', onRoute);
    this.listen(this.documentTarget, 'divina:page-ready', onRoute);
    this.listen(this.documentTarget, 'divina:supreme-orb-did-navigate', onRoute);
    this.listen(this.documentTarget, 'divina:work12-state', event => {
      const state = String(event?.detail?.state || '').toUpperCase();
      this.sync(['REST','QUIET','REVEAL'].includes(state) ? 'work12-rest' : 'work12-travel');
    });
    this.listen(this.documentTarget, 'divina:experience-intelligence-state', () => this.sync('experience-state'));
    this.listen(this.windowTarget, 'hashchange', () => {
      const next = routeNow(this.documentTarget, this.windowTarget);
      if (next !== this.route) {
        this.route = next;
        this.resetWorldGate(next,'hash');
      }
      this.sync('hash');
    }, { passive:true });
    this.listen(this.windowTarget, 'pageshow', () => {
      const next = routeNow(this.documentTarget, this.windowTarget);
      if (next !== this.route) {
        this.route = next;
        this.resetWorldGate(next,'pageshow');
      }
      this.sync('pageshow');
    }, { passive:true });
  }

  status() {
    return Object.freeze({
      version:VERSION,
      phase:'FECHAMENTO-SUPREMO',
      invitation:'entra-presenca',
      visibleEntryWords:this.route === 'home' && this.menuState === 'closed' ? 1 : 0,
      pentagramReady:Boolean(this.pentagram),
      globalPentagram:true,
      pentagramPosition:this.route === 'home' && this.menuState === 'closed' ? 'orb-threshold' : 'top-corner',
      globalMenuOnEveryPage:true,
      pentagramVisibleWhileMenuOpen:true,
      pentagramTogglesMenu:true,
      worldOrbOpensMenu:false,
      worldOrbAction:'open-current-world',
      orbAloneArrival:true,
      technicalWorldLayersVisible:false,
      movedGlobal:this.movedGlobal,
      rehomes:this.rehomes,
      whitInsideMenu:true,
      whitResidence:'canonical-orb',
      tarotOrbAction:'reveal-only',
      tarotOrbOpensMenu:false,
      route:this.route,
      worldPhase:this.worldPhase,
      menuState:this.menuState,
      openCalls:this.openCalls,
      closeCalls:this.closeCalls,
      worldOpenCalls:this.worldOpenCalls,
      worldEntries:this.worldEntries,
      worldOrbResponses:this.worldOrbResponses,
      depthActionClicks:this.depthActionClicks,
      primaryActionClicks:this.primaryActionClicks,
      openFailures:this.openFailures,
      pendingOpen:this.pendingOpen,
      pulses:this.pulses,
      renamedRealities:this.renamedRealities,
      oneCanonicalOrb:Boolean(this.orb),
      automaticNavigation:false,
      technicalMenuCopy:0,
      permanentAnimationLoops:0,
      work13:'concluido-com-auditoria-real',
      work14:false
    });
  }

  destroy() {
    this.abortController?.abort?.();
    this.clearOrbPath();
    this.windowTarget?.cancelAnimationFrame?.(this.pathFrame);
    this.windowTarget?.clearTimeout?.(this.pathTimer);
    this.pathFrame = 0;
    this.pathTimer = 0;
  }
}

export function createCosmosEntryIntentionV610(options = {}) {
  return new CosmosEntryIntentionV610(options);
}
