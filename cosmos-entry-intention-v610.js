/* DIVINA BRUXA — WORK13 · PENTAGRAMA GLOBAL E TAROT PROTEGIDO · V612
   O pentagrama vermelho vive no canto superior de todas as realidades e abre
   o menu V593. No Tarot Livre, a Orbe pertence somente ao gesto de revelar. */

const VERSION = 612;

export const COSMOS_ENTRY_INTENTION_CONTRACT_V610 = Object.freeze({
  work:'WORK13',
  correction:'pentagrama-global-tarot-protegido',
  invitation:'pentagrama-vermelho',
  entryIntentions:1,
  visibleEntryWords:0,
  pentagramAssets:1,
  pentagramIsMenu:true,
  globalPentagram:true,
  pentagramPosition:'top-corner',
  whitInsideMenu:true,
  whitResidence:'canonical-orb',
  tarotOrbAction:'reveal-only',
  tarotOrbOpensMenu:false,
  tarotOrbMenuListenersBypassed:true,
  responseModel:'touch-answer-silence',
  reusesCanonicalOrb:true,
  reusesLivingMenuV593:true,
  reusesFinalContinuityV598:true,
  globalOrbMenuCycle:true,
  everyRealityCanCallUniverse:true,
  realityOwnedOrbActionsPreserved:true,
  journalThresholdOrbActionPreserved:true,
  publicRealityNames:15,
  explanatoryCopy:0,
  automaticNavigation:false,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
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

const routeNow = (doc, win) => String(
  doc?.documentElement?.dataset?.route
  || doc?.body?.dataset?.screen
  || win?.location?.hash?.slice(1)
  || 'home'
).toLowerCase();

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
    this.openCalls = 0;
    this.worldOpenCalls = 0;
    this.openFailures = 0;
    this.pendingOpen = false;
    this.pulses = 0;
    this.renamedRealities = 0;
    this.abortController = typeof AbortController === 'function' ? new AbortController() : null;
    this.movedGlobal = false;
    if (this.entry && this.documentTarget?.body?.append && this.entry.parentElement !== this.documentTarget.body) {
      this.documentTarget.body.append(this.entry);
      this.movedGlobal = true;
    }
    if (this.entry?.dataset) {
      this.entry.dataset.work13MenuSymbol = 'pentagram-v612';
      this.entry.dataset.work13MenuPosition = 'top-corner';
      this.entry.dataset.whitResidence = 'canonical-orb';
    }
    this.bind();
    this.renameMenu();
    this.sync('boot');
  }

  listen(target, type, handler, options = {}) {
    if (!target?.addEventListener) return;
    const signal = this.abortController?.signal;
    target.addEventListener(type, handler, signal ? { ...options, signal } : options);
  }

  isHomeReady() {
    return this.route === 'home' && this.isUniverseReady();
  }

  isUniverseReady() {
    const root = this.documentTarget?.documentElement;
    const moving = root?.dataset?.experienceState === 'moving'
      || ['DEPART','TRAVEL','ARRIVE'].includes(String(root?.dataset?.work12State || '').toUpperCase());
    return this.menuState === 'closed' && !moving;
  }

  isCanonicalOrbTarget(target) {
    const candidate = target?.closest?.('#orb');
    return Boolean(candidate && candidate === this.orb);
  }

  journalThresholdOwnsOrb(target = this.orb) {
    if (this.route !== 'journal' || !target?.closest) return false;
    if (target.closest('[data-journal-orb-host]')) return true;
    const state = String(
      this.documentTarget?.getElementById?.('journal')?.dataset?.db596ChamberState || 'threshold'
    ).toLowerCase();
    return !['engaged','travel'].includes(state)
      && Boolean(target.closest('[data-v585-orb-host]'));
  }

  isRealityOwnedOrbTarget(target) {
    if (this.route === 'tarot') return true;
    if (this.route === 'daily') return Boolean(target?.closest?.('[data-daily-orb-host]'));
    if (this.route === 'spreads') return Boolean(target?.closest?.('#spreadResult'));
    if (this.route === 'library') return Boolean(
      target?.closest?.('[data-library-orb-host]')
      || target?.closest?.('#cardLibraryApp [data-orb]')
    );
    if (this.route === 'journal') return this.journalThresholdOwnsOrb(target);
    return false;
  }

  respond(source = 'entry') {
    if (!this.isUniverseReady()) return false;
    if (this.entry?.dataset) this.entry.dataset.response = 'answering';
    if (this.documentTarget?.documentElement?.dataset) {
      this.documentTarget.documentElement.dataset.work13EntryResponse = 'answering';
    }
    this.pulses += 1;
    this.orbCore?.pulse?.('work13-entry-response', { intensity:source === 'orb' ? .42 : .54 });
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

  renameMenu() {
    const menu = this.menuResolver?.();
    const root = menu?.root || this.documentTarget?.getElementById?.('divinaOrbitalMenuV502');
    if (!root?.querySelectorAll) return 0;
    let count = 0;
    root.querySelectorAll('[data-v502-route]').forEach(portal => {
      const route = String(portal.dataset?.v502Route || portal.getAttribute?.('data-v502-route') || '').toLowerCase();
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

  sync(reason = 'sync') {
    if (!this.entry) return false;
    const journalThreshold = this.journalThresholdOwnsOrb(this.orb);
    if (this.orb) this.orb.setAttribute?.(
      'aria-label',
      this.route === 'home'
        ? 'Orbe viva. Toque para abrir o universo; toque duplo abre o Tarot Livre'
        : this.route === 'tarot'
          ? 'Orbe viva. Toque para revelar a próxima carta'
        : this.route === 'daily'
          ? 'Orbe viva. Toque para abrir a Carta do Dia'
        : this.route === 'spreads' && this.orb?.closest?.('#spreadResult')
          ? 'Orbe viva. Toque para revelar a próxima posição'
        : this.route === 'library' && this.orb?.closest?.('[data-library-orb-host], #cardLibraryApp [data-orb]')
          ? 'Orbe viva. Toque para descobrir uma carta'
        : journalThreshold
          ? 'Orbe viva. Toque para entrar e escrever no Diário'
        : 'Orbe viva. Toque para abrir o universo'
    );
    const visible = this.isUniverseReady();
    if (visible && !this.entry.dataset.response) this.entry.dataset.response = 'ready';
    this.entry.setAttribute('aria-label', 'Abrir o menu mágico');
    this.entry.setAttribute('aria-hidden', String(!visible));
    this.entry.setAttribute('aria-expanded', String(this.menuState !== 'closed'));
    this.entry.tabIndex = visible ? 0 : -1;
    const root = this.documentTarget?.documentElement;
    if (root?.dataset) {
      root.dataset.work13Entry = visible ? 'invitation' : 'resting';
      root.dataset.work13EntryReason = reason;
      if (visible && !root.dataset.work13EntryResponse) root.dataset.work13EntryResponse = 'ready';
    }
    return visible;
  }

  bind() {
    this.listen(this.entry, 'pointerdown', event => {
      event.stopPropagation?.();
      this.respond('entry');
    }, { passive:true });
    const restEntry = () => {
      if (this.menuState !== 'closed' || !this.entry?.dataset) return;
      this.entry.dataset.response = 'ready';
      if (this.documentTarget?.documentElement?.dataset) {
        this.documentTarget.documentElement.dataset.work13EntryResponse = 'ready';
      }
    };
    this.listen(this.entry, 'pointerup', restEntry, { passive:true });
    this.listen(this.entry, 'pointercancel', restEntry, { passive:true });
    this.listen(this.entry, 'click', event => {
      event.preventDefault?.();
      event.stopPropagation?.();
      this.openUniverse(event.detail === 0 ? 'keyboard' : 'touch');
    });
    this.listen(this.orb, 'pointerdown', () => {
      if (this.route === 'tarot') return;
      this.respond('orb');
    }, { passive:true });
    this.listen(this.orb, 'pointerup', restEntry, { passive:true });
    this.listen(this.orb, 'pointercancel', restEntry, { passive:true });
    this.listen(this.documentTarget, 'click', event => {
      if (this.route === 'home' || !this.isCanonicalOrbTarget(event?.target)) return;
      if (this.route === 'tarot') return;
      if (this.isRealityOwnedOrbTarget(event?.target)) return;
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      this.openUniverse('orb-world');
    }, { capture:true });
    this.listen(this.documentTarget, 'keydown', event => {
      if (this.route === 'home' || !this.isCanonicalOrbTarget(event?.target)) return;
      if (this.route === 'tarot') return;
      if (this.isRealityOwnedOrbTarget(event?.target)) return;
      if (!['Enter',' '].includes(event?.key) || event?.repeat) return;
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      this.respond('orb-keyboard');
      this.openUniverse('keyboard-world');
    }, { capture:true });
    this.listen(this.documentTarget, 'divina:orbital-menu-ready', () => {
      const shouldOpen = this.pendingOpen;
      this.renameMenu();
      this.sync('menu-ready');
      if (shouldOpen) this.openUniverse('menu-ready');
    });
    this.listen(this.documentTarget, 'divina:orb-physical-claim-settled', () => {
      this.sync('orb-claim-settled');
    });
    this.listen(this.documentTarget, 'divina:menu-state', event => {
      this.menuState = String(event?.detail?.state || 'closed').toLowerCase();
      if (this.entry?.dataset) this.entry.dataset.response = this.menuState === 'closed' ? 'ready' : 'silent';
      if (this.documentTarget?.documentElement?.dataset) {
        this.documentTarget.documentElement.dataset.work13EntryResponse = this.menuState === 'closed' ? 'ready' : 'silent';
      }
      this.renameMenu();
      this.sync('menu');
    });
    const onRoute = event => {
      this.route = String(event?.detail?.id || event?.detail?.route || routeNow(this.documentTarget, this.windowTarget)).toLowerCase();
      this.menuState = 'closed';
      this.sync('route');
    };
    this.listen(this.documentTarget, 'divina:route-ready', onRoute);
    this.listen(this.documentTarget, 'divina:page-ready', onRoute);
    this.listen(this.windowTarget, 'hashchange', () => {
      this.route = routeNow(this.documentTarget, this.windowTarget);
      this.sync('hash');
    }, { passive:true });
  }

  status() {
    return Object.freeze({
      version:VERSION,
      invitation:'pentagrama-vermelho',
      visibleEntryWords:0,
      pentagramReady:Boolean(this.pentagram),
      globalPentagram:true,
      pentagramPosition:'top-corner',
      movedGlobal:this.movedGlobal,
      whitInsideMenu:true,
      whitResidence:'canonical-orb',
      tarotOrbAction:'reveal-only',
      tarotOrbOpensMenu:false,
      tarotOrbMenuListenersBypassed:true,
      route:this.route,
      menuState:this.menuState,
      openCalls:this.openCalls,
      worldOpenCalls:this.worldOpenCalls,
      openFailures:this.openFailures,
      pendingOpen:this.pendingOpen,
      pulses:this.pulses,
      renamedRealities:this.renamedRealities,
      oneCanonicalOrb:Boolean(this.orb),
      automaticNavigation:false,
      work14:false
    });
  }

  destroy() {
    this.abortController?.abort?.();
  }
}

export function createCosmosEntryIntentionV610(options = {}) {
  return new CosmosEntryIntentionV610(options);
}
