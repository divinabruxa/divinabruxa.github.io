/* DIVINA BRUXA — WORK13 · CORRECAO SUPREMA DA ENTRADA · V610
   Uma unica intencao convida a pessoa a tocar. A resposta reutiliza a Orbe,
   o menu vivo V593 e a continuidade V598; nao cria rota, motor ou copia. */

const VERSION = 610;

export const COSMOS_ENTRY_INTENTION_CONTRACT_V610 = Object.freeze({
  work:'WORK13',
  correction:'entrada-da-orbe',
  invitation:'Entrá',
  entryIntentions:1,
  responseModel:'touch-answer-silence',
  reusesCanonicalOrb:true,
  reusesLivingMenuV593:true,
  reusesFinalContinuityV598:true,
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
  ai:'Orbe IA',
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
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.menuState = 'closed';
    this.openCalls = 0;
    this.pulses = 0;
    this.renamedRealities = 0;
    this.abortController = typeof AbortController === 'function' ? new AbortController() : null;
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
    return this.route === 'home' && this.menuState === 'closed';
  }

  respond(source = 'entry') {
    if (!this.isHomeReady()) return false;
    if (this.entry?.dataset) this.entry.dataset.response = 'answering';
    if (this.documentTarget?.documentElement?.dataset) {
      this.documentTarget.documentElement.dataset.work13EntryResponse = 'answering';
    }
    this.pulses += 1;
    this.orbCore?.pulse?.('work13-entry-response', { intensity:source === 'orb' ? .42 : .54 });
    return true;
  }

  openUniverse(source = 'touch') {
    if (!this.isHomeReady()) return false;
    this.continuity?.cancelHomeTap?.('entry-intention');
    const opened = this.continuity?.callUniverse?.(source);
    if (opened) {
      this.openCalls += 1;
      if (this.entry?.dataset) this.entry.dataset.response = 'crossing';
      return true;
    }
    const menu = this.menuResolver?.();
    if (!menu?.open) return false;
    this.openCalls += 1;
    if (this.entry?.dataset) this.entry.dataset.response = 'crossing';
    menu.open();
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
      count += 1;
    });
    const homeLabel = root.querySelector?.('.db502-menu__home-label');
    if (homeLabel) homeLabel.textContent = 'Início';
    this.renamedRealities = count;
    return count;
  }

  sync(reason = 'sync') {
    if (!this.entry) return false;
    const visible = this.isHomeReady();
    if (visible && !this.entry.dataset.response) this.entry.dataset.response = 'ready';
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
    this.listen(this.orb, 'pointerdown', () => this.respond('orb'), { passive:true });
    this.listen(this.orb, 'pointerup', restEntry, { passive:true });
    this.listen(this.orb, 'pointercancel', restEntry, { passive:true });
    this.listen(this.documentTarget, 'divina:orbital-menu-ready', () => {
      this.renameMenu();
      this.sync('menu-ready');
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
      invitation:this.entry?.textContent?.trim() || '',
      route:this.route,
      menuState:this.menuState,
      openCalls:this.openCalls,
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
