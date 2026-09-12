/* DIVINA BRUXA — MACROETAPA 4/10 · UNIVERSO COMPLETO DO TAROT V528
   Uma autoridade de produto conecta Tarot Livre, Carta do Dia e Tiragens.
   Não cria baralho, Orbe, universo, chama ou motor de renderização paralelos. */

import { CARDS, REQUIRED_ORIENTATION } from './tarot-data.js?v=5';
import { DECK_SIZE } from './tarot-session.js?v=182';
import { DAILY_CARD_COUNT } from './daily-policy-v303.js?v=303';
import {
  SPREADS,
  CELTIC_CROSS_POSITIONS,
  ROYAL_TABLE_COUNT,
  ROYAL_TABLE_COLUMNS,
  ROYAL_TABLE_ROWS,
  spreadById,
  validCardIds
} from './spreads-policy.js?v=213';

const RELEASE = 'V528';
const STYLE_ID = 'divinaTarotUniverseV528Styles';
const MARK = Symbol.for('divina.tarot.universe.core.v528');
const ROUTES = Object.freeze(['tarot', 'daily', 'spreads']);
const REVEAL_SETTLE_MS = 1280;

const PROFILE = Object.freeze({
  tarot:Object.freeze({
    route:'tarot', sigil:'✦', eyebrow:'LIVRE', title:'Tarot Livre', fallback:'78 cartas'
  }),
  daily:Object.freeze({
    route:'daily', sigil:'☾', eyebrow:'HOJE', title:'Carta do Dia', fallback:'Uma por dia'
  }),
  spreads:Object.freeze({
    route:'spreads', sigil:'◇', eyebrow:'MÉTODOS', title:'Tiragens', fallback:'15 métodos'
  })
});

const currentRoute = () => {
  const screen = String(document.body?.dataset?.screen || '').trim();
  if (screen) return screen;
  return String(location.hash || '#home').replace(/^#/, '').split(/[?&/]/)[0] || 'home';
};

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
const between = (value, minimum, maximum) => Number.isFinite(value) && value >= minimum && value <= maximum;

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './tarot-universe-core-v528.css?v=528';
  document.head.append(link);
}

function catalogAudit() {
  const numericIds = CARDS.map(card => card?.id);
  const canonicalIds = CARDS.map(card => card?.canonicalId);
  const uniqueNumericIds = new Set(numericIds).size === DECK_SIZE;
  const uniqueCanonicalIds = new Set(canonicalIds).size === DECK_SIZE;
  const completeRange = numericIds.every((id, index) => id === index);
  const normalOnly = CARDS.every(card => card?.orientation === REQUIRED_ORIENTATION && card?.orientation === 'normal');
  const named = CARDS.every(card => typeof card?.name === 'string' && card.name.trim().length > 0);
  const imaged = CARDS.every(card => typeof card?.image === 'string' && card.image.endsWith('.webp'));
  return Object.freeze({
    valid:CARDS.length === DECK_SIZE && DECK_SIZE === 78 && DAILY_CARD_COUNT === 78 &&
      uniqueNumericIds && uniqueCanonicalIds && completeRange && normalOnly && named && imaged,
    cards:CARDS.length,
    uniqueNumericIds,
    uniqueCanonicalIds,
    completeRange,
    normalOnly,
    named,
    imaged
  });
}

function spreadCatalogAudit() {
  const ids = SPREADS.map(spread => spread.id);
  const uniqueMethods = new Set(ids).size === SPREADS.length;
  const celtic = spreadById('celtic-cross');
  const royal = spreadById('royal-table');
  const normalizableCounts = SPREADS.every(spread => {
    const positions = spread?.positions;
    return Array.isArray(positions) && positions.length >= 1 && positions.length <= DECK_SIZE;
  });
  return Object.freeze({
    valid:SPREADS.length === 15 && uniqueMethods && normalizableCounts &&
      CELTIC_CROSS_POSITIONS.length === 10 && celtic?.positions?.length === 10 &&
      ROYAL_TABLE_COUNT === 78 && ROYAL_TABLE_COLUMNS === 13 && ROYAL_TABLE_ROWS === 6 &&
      royal?.positions?.length === 78 && royal?.premium === true,
    methods:SPREADS.length,
    uniqueMethods,
    normalizableCounts,
    celticCross:CELTIC_SAFE(celtic),
    royalTable:Object.freeze({
      cards:royal?.positions?.length || 0,
      columns:ROYAL_TABLE_COLUMNS,
      rows:ROYAL_TABLE_ROWS,
      premium:royal?.premium === true
    })
  });
}

function CELTIC_SAFE(celtic) {
  return Object.freeze({ cards:celtic?.positions?.length || 0, traditionalOrder:CELTIC_ORDER(celtic) });
}

function CELTIC_ORDER(celtic) {
  const expected = ['present','crossing','foundation','recent-past','conscious','near-future','self','environment','hopes-fears','outcome'];
  return expected.every((id, index) => celtic?.positions?.[index]?.id === id);
}

function tarotSnapshot() {
  const instance = globalThis.divinaTarotLivreV517;
  if (!instance?.status) return Object.freeze({ state:'pending', valid:true, revealed:0, remaining:DECK_SIZE });
  try {
    const value = instance.status();
    const revealed = Number(value?.revealed);
    const remaining = Number(value?.remaining);
    const valid = between(revealed, 0, DECK_SIZE) && between(remaining, 0, DECK_SIZE) &&
      revealed + remaining === DECK_SIZE && value?.normalOnly === true &&
      value?.noRepeats === true && value?.gridColumns === 6;
    return Object.freeze({
      state:'ready', valid, revealed, remaining,
      normalOnly:value?.normalOnly === true,
      noRepeats:value?.noRepeats === true,
      gridColumns:Number(value?.gridColumns || 0),
      mesaRealTransfer:value?.mesaRealTransfer === true
    });
  } catch {
    return Object.freeze({ state:'pending', valid:true, revealed:0, remaining:DECK_SIZE });
  }
}

function dailySnapshot() {
  const instance = globalThis.divinaDailyWorldV509;
  if (!instance?.snapshot) return Object.freeze({ state:'pending', valid:true, cardId:null });
  try {
    const value = instance.snapshot();
    const cardId = Number.isInteger(value?.cardId) ? value.cardId : null;
    const valid = value?.normalOnly === true && value?.onePerDay === true &&
      (cardId === null || between(cardId, 0, DAILY_CARD_COUNT - 1));
    return Object.freeze({
      state:value?.state === 'revealed' ? 'revealed' : 'sealed',
      valid,
      cardId,
      normalOnly:value?.normalOnly === true,
      onePerDay:value?.onePerDay === true,
      canonicalOrb:value?.canonicalOrb || null,
      accountAuthority:value?.accountAuthority === true
    });
  } catch {
    return Object.freeze({ state:'pending', valid:true, cardId:null });
  }
}

function spreadsSnapshot() {
  const instance = globalThis.divinaSpreadsWorldV305;
  const session = instance?.session;
  if (!session) return Object.freeze({ state:instance ? 'choose' : 'pending', valid:true, revealed:0, total:0, spreadId:null });

  /* Somente metadados públicos da tiragem são observados. A intenção privada
     e os textos da leitura nunca entram neste núcleo. */
  const spreadId = typeof session.spreadId === 'string' ? session.spreadId : '';
  const target = spreadById(spreadId);
  const cardIds = Array.isArray(session.cardIds) ? session.cardIds.map(Number) : [];
  const revealed = Number(session.revealed);
  const total = target?.custom ? cardIds.length : target?.positions?.length || 0;
  const specialCount = spreadId === 'celtic-cross'
    ? total === 10
    : spreadId === 'royal-table'
      ? total === ROYAL_TABLE_COUNT
      : true;
  const valid = Boolean(target) && session.orientation === 'normal' &&
    validCardIds(cardIds, total) && between(revealed, 0, total) && specialCount;
  return Object.freeze({
    state:revealed === total && total > 0 ? 'complete' : 'reading',
    valid,
    spreadId:target?.id || null,
    revealed:Number.isFinite(revealed) ? revealed : 0,
    total,
    normalOnly:session.orientation === 'normal',
    noRepeats:new Set(cardIds).size === cardIds.length
  });
}

const statusText = (route, state) => {
  if (route === 'tarot') return state.state === 'ready' ? `${state.revealed}/78 abertas` : PROFILE.tarot.fallback;
  if (route === 'daily') return state.state === 'revealed' ? 'Carta recebida' : state.state === 'sealed' ? 'A revelar hoje' : PROFILE.daily.fallback;
  if (route === 'spreads') return state.total > 0 ? `${state.revealed}/${state.total} posições` : PROFILE.spreads.fallback;
  return '';
};

export const TAROT_UNIVERSE_CONTRACT_V528 = Object.freeze({
  release:RELEASE,
  macroStage:'4/10',
  worlds:ROUTES,
  canonicalCards:78,
  tarotLivreGridColumns:6,
  dailyCardsPerBrasiliaDay:1,
  spreadMethods:15,
  celticCrossPositions:10,
  royalTable:Object.freeze({ columns:13, rows:6, cards:78, premiumAutosaveAuthority:'V213' }),
  normalOnly:true,
  noRepeats:true,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentRenderEngines:0,
  permanentAnimationLoops:0,
  privateQuestionReads:false,
  privateMeaningReads:false,
  extraApiCalls:0,
  webVibration:false
});

export class TarotUniverseCoreV528 {
  constructor({ go, orbCore, orbPresence, whit } = {}) {
    this.go = typeof go === 'function' ? go : id => globalThis.orbe?.go?.(id);
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orbPresence = orbPresence || globalThis.divinaOrbUniversalPresenceV526?.engine || null;
    this.whit = whit || globalThis.divinaWhitSupremeV527?.core || null;
    this.abort = new AbortController();
    this.observer = null;
    this.frame = 0;
    this.refreshTimer = 0;
    this.awakeTimer = 0;
    this.journeyTimer = 0;
    this.busy = false;
    this.navs = new Map();
    this.catalog = catalogAudit();
    this.spreadCatalog = spreadCatalogAudit();
    this.staticIntegrity = this.catalog.valid && this.spreadCatalog.valid;
    installStyle();
    this.bind();
    this.scheduleRefresh();
    document.documentElement.dataset.tarotUniverse = 'v528';
  }

  bind() {
    const { signal } = this.abort;
    const readyEvents = [
      'divina:page-ready', 'divina:route-ready', 'divina:supreme-orb-did-navigate',
      'divina:tarot-cosmico-ready', 'divina:tarot-supreme-ready',
      'divina:daily-v509-ready', 'divina:spreads-supreme-ready',
      'tarot:session-committed', 'divina:tarot-mesa-transfer-v517',
      'divina:tarot-mesa-arrived-v517', 'divina:billing-updated'
    ];
    readyEvents.forEach(type => document.addEventListener(type, () => this.scheduleRefresh(), { passive:true, signal }));

    globalThis.addEventListener?.('tarot:supreme-revealed', event => {
      this.wake('tarot', 'reveal');
      this.scheduleRefresh();
      document.dispatchEvent(new CustomEvent('divina:tarot-universe-revealed-v528', {
        detail:Object.freeze({
          world:'tarot',
          cardId:Number.isInteger(event.detail?.cardId) ? event.detail.cardId : null,
          position:Number.isInteger(event.detail?.position) ? event.detail.position : null,
          private:false
        })
      }));
    }, { passive:true, signal });

    document.addEventListener('click', event => this.handleClick(event), { capture:true, signal });
    globalThis.addEventListener?.('pageshow', () => this.scheduleRefresh(), { passive:true, signal });
    globalThis.addEventListener?.('storage', () => this.scheduleRefresh(), { passive:true, signal });

    this.observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) this.scheduleRefresh();
    });
    if (document.body) this.observer.observe(document.body, { childList:true, subtree:true });
  }

  handleClick(event) {
    const path = event.target?.closest?.('[data-tc528-route]');
    if (path) {
      event.preventDefault();
      this.travel(path.dataset.tc528Route);
      return;
    }

    const route = currentRoute();
    if (!ROUTES.includes(route)) return;
    const reveal = route === 'spreads'
      ? event.target?.closest?.('#spreads [data-reveal-card]')
      : event.target?.closest?.(`#${route} #orbCanvas`);
    if (!reveal) return;

    const audit = this.audit();
    const safe = this.staticIntegrity && audit[route]?.valid !== false;
    if (!safe) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.markIntegrity(route, false);
      this.notify('A Orbe protegeu esta leitura porque a regra das 78 cartas precisa ser restaurada. Nenhuma carta foi alterada.');
      return;
    }

    this.wake(route, 'intention');
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.scheduleRefresh(), REVEAL_SETTLE_MS);
  }

  travel(target) {
    if (!ROUTES.includes(target) || this.busy) return false;
    const from = currentRoute();
    if (from === target) {
      this.orbCore?.pulse?.('tarot-universe-presence', { intensity:0.72 });
      this.wake(target, 'presence');
      return true;
    }

    this.busy = true;
    this.updateNavs();
    this.orbCore?.pulse?.('tarot-universe-path', { intensity:0.9 });
    document.dispatchEvent(new CustomEvent('divina:tarot-universe-travel-v528', {
      detail:Object.freeze({ from, target, canonicalOrb:'v501', private:false })
    }));

    clearTimeout(this.journeyTimer);
    this.journeyTimer = setTimeout(() => {
      if (!this.busy) return;
      this.busy = false;
      this.scheduleRefresh();
    }, 4200);

    let journey;
    try {
      journey = this.go(target, { source:'tarot-universe-v528', from, target });
    } catch (error) {
      journey = Promise.reject(error);
    }
    Promise.resolve(journey)
      .catch(() => this.notify('A passagem continua disponível pelo menu da Orbe.'))
      .finally(() => {
        clearTimeout(this.journeyTimer);
        this.busy = false;
        this.scheduleRefresh();
      });
    return true;
  }

  scheduleRefresh() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }

  refresh() {
    const route = currentRoute();
    ROUTES.forEach(id => this.mount(id));
    this.updateNavs();
    if (ROUTES.includes(route)) {
      const audit = this.audit();
      this.markIntegrity(route, this.staticIntegrity && audit[route]?.valid !== false);
    }
  }

  mount(route) {
    const root = document.getElementById(route);
    if (!root) return null;
    let nav = this.navs.get(route);
    if (nav?.isConnected && nav.closest(`#${route}`) === root) return nav;
    nav = root.querySelector('[data-tarot-universe-nav="v528"]');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'tc528';
      nav.dataset.tarotUniverseNav = 'v528';
      nav.dataset.ownerRoute = route;
      nav.setAttribute('aria-label', 'Três mundos do Tarot');
      nav.innerHTML = `<span class="tc528__thread" aria-hidden="true"><i></i></span>
        <div class="tc528__paths">${ROUTES.map(id => {
          const item = PROFILE[id];
          return `<button type="button" data-tc528-route="${id}" aria-label="Abrir ${item.title}">
            <span class="tc528__sigil" aria-hidden="true">${item.sigil}</span>
            <span class="tc528__copy"><small>${item.eyebrow}</small><b>${item.title}</b><em data-tc528-status="${id}">${item.fallback}</em></span>
          </button>`;
        }).join('')}</div>
        <p class="tc528__live" data-tc528-live role="status" aria-live="polite" aria-atomic="true"></p>`;

      if (route === 'tarot') {
        const header = root.querySelector('.tl517__header');
        if (header) header.insertAdjacentElement('afterend', nav);
        else root.prepend(nav);
      } else if (route === 'daily') {
        const anchor = root.querySelector('#dailyCard');
        if (anchor) root.insertBefore(nav, anchor);
        else root.prepend(nav);
      } else {
        const anchor = root.querySelector('#spreadIntention');
        if (anchor) root.insertBefore(nav, anchor);
        else root.prepend(nav);
      }
    }
    root.dataset.tarotCore = 'v528';
    this.navs.set(route, nav);
    return nav;
  }

  updateNavs() {
    const current = currentRoute();
    const audit = this.audit();
    this.navs.forEach((nav, ownerRoute) => {
      if (!nav?.isConnected) return;
      nav.dataset.current = current;
      nav.dataset.busy = String(this.busy);
      nav.dataset.integrity = this.staticIntegrity && audit[ownerRoute]?.valid !== false ? 'verified' : 'protected';
      nav.querySelectorAll('[data-tc528-route]').forEach(button => {
        const route = button.dataset.tc528Route;
        const selected = route === current;
        button.classList.toggle('is-current', selected);
        button.setAttribute('aria-pressed', String(selected));
        if (selected) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
        button.disabled = this.busy;
        const status = button.querySelector(`[data-tc528-status="${route}"]`);
        const text = statusText(route, audit[route]);
        if (status && status.textContent !== text) status.textContent = text;
      });
    });
  }

  markIntegrity(route, valid) {
    const root = document.getElementById(route);
    if (!root) return;
    root.dataset.tarotIntegrity = valid ? 'verified' : 'protected';
    root.setAttribute('data-orientation-authority', 'normal-only');
    root.setAttribute('data-canonical-deck-size', '78');
  }

  wake(route, reason) {
    const nav = this.navs.get(route) || this.mount(route);
    if (!nav) return;
    nav.dataset.awake = reason;
    nav.classList.remove('is-awake');
    requestAnimationFrame(() => nav.classList.add('is-awake'));
    clearTimeout(this.awakeTimer);
    this.awakeTimer = setTimeout(() => {
      nav.classList.remove('is-awake');
      delete nav.dataset.awake;
    }, reducedMotion() ? 120 : 860);
  }

  notify(message) {
    globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:String(message || '') }));
  }

  audit() {
    return Object.freeze({
      catalog:this.catalog,
      spreadCatalog:this.spreadCatalog,
      tarot:tarotSnapshot(),
      daily:dailySnapshot(),
      spreads:spreadsSnapshot()
    });
  }

  contract() {
    return TAROT_UNIVERSE_CONTRACT_V528;
  }

  status() {
    const audit = this.audit();
    const canonicalOrbCount = document.querySelectorAll('[data-supreme-orb="living"]').length;
    return Object.freeze({
      release:RELEASE,
      macroStage:'4/10',
      route:currentRoute(),
      ready:this.staticIntegrity,
      worlds:ROUTES.length,
      catalog:audit.catalog,
      spreadCatalog:audit.spreadCatalog,
      tarot:audit.tarot,
      daily:audit.daily,
      spreads:audit.spreads,
      oneCanonicalOrb:canonicalOrbCount <= 1,
      canonicalOrbCount,
      orbitalNavigation:true,
      usesOrbJourneyV525:true,
      usesPresenceV526:Boolean(this.orbPresence),
      whitContextAvailable:Boolean(this.whit),
      privateQuestionReads:false,
      privateMeaningReads:false,
      extraApiCalls:0,
      independentRenderEngines:0,
      permanentAnimationLoops:0,
      webVibration:false
    });
  }

  destroy() {
    this.abort.abort();
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
    clearTimeout(this.refreshTimer);
    clearTimeout(this.awakeTimer);
    clearTimeout(this.journeyTimer);
    this.navs.forEach(nav => nav?.remove?.());
    this.navs.clear();
    ROUTES.forEach(route => {
      const root = document.getElementById(route);
      root?.removeAttribute('data-tarot-core');
      root?.removeAttribute('data-tarot-integrity');
      root?.removeAttribute('data-orientation-authority');
      root?.removeAttribute('data-canonical-deck-size');
    });
    if (document.documentElement.dataset.tarotUniverse === 'v528') delete document.documentElement.dataset.tarotUniverse;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createTarotUniverseCoreV528(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new TarotUniverseCoreV528(options);
  globalThis[MARK] = instance;
  globalThis.divinaTarotUniverseV528 = instance;
  return instance;
}
