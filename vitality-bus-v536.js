/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 2/14 · V536
   BARRAMENTO DE VITALIDADE

   Traduz sinais públicos já existentes para um único estado semântico.
   É orientado por eventos: não cria requestAnimationFrame, intervalo, rede,
   storage ou leitura de conteúdo privado/formulários.
*/

import { normalizeWorldRouteV535, worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 536;
const INSTANCE = Symbol.for('divina.vitality.bus.v536');
const HISTORY_LIMIT = 24;
const PHASES = new Set(['rest','intent','transition','loading','present','ready','recovering','paused']);
const ORB_STATES = new Set(['resting','awake','intent','traveling','present','recovering','paused']);
const LOAD_STATES = new Set(['idle','loading','deferred','ready','error']);
const MENU_STATES = new Set(['closed','opening','open','closing']);
const OFFICIAL_SIGNALS = Object.freeze([
  'presence:foreground','presence:background','network:online','network:offline',
  'menu:opening','menu:open','menu:closing','menu:closed',
  'orb:awake','orb:intent','orb:traveling','orb:present','orb:recovering',
  'world:loading','world:deferred','world:present','world:ready','world:recovering'
]);

const scalar = value => (
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
) ? value : null;

const publicDetail = detail => {
  const safe = {};
  for (const key of ['id','route','from','to','source','reason','kind','mode','state','recoverable']) {
    const value = scalar(detail?.[key]);
    if (value !== null) safe[key] = value;
  }
  return Object.freeze(safe);
};

const cloneState = state => Object.freeze({
  ...state,
  world:Object.freeze({ ...state.world })
});

const initialRoute = () => normalizeWorldRouteV535(
  document.body?.dataset?.screen || location.hash || 'home'
);

export const VITALITY_CONTRACT_V536 = Object.freeze({
  release:'V536',
  macroStage:'2-of-14',
  title:'Barramento de Vitalidade e Gramática Viva',
  phases:Object.freeze([...PHASES]),
  signals:OFFICIAL_SIGNALS,
  dispatchEvent:'divina:vitality',
  permanentAnimationLoops:0,
  privateContentReads:0,
  formValueReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0
});

export class VitalityBusV536 {
  constructor() {
    const route = initialRoute();
    const world = worldForRouteV535(route);
    this.controller = new AbortController();
    this.listeners = new Set();
    this.history = [];
    this.pending = null;
    this.flushQueued = false;
    this.state = cloneState({
      version:VERSION,
      sequence:0,
      phase:document.hidden ? 'paused' : 'rest',
      presence:document.hidden ? 'background' : 'foreground',
      network:navigator.onLine === false ? 'offline' : 'online',
      motion:globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'reduced' : 'full',
      route,
      destination:null,
      world:{ id:world.id, family:world.family, name:world.name },
      orb:document.hidden ? 'paused' : 'resting',
      menu:'closed',
      load:'idle',
      recovery:false,
      reason:'initial'
    });
    this.bind();
    queueMicrotask(() => this.commit({ reason:'ready' }, 'vitality:ready'));
  }

  bind() {
    const { signal } = this.controller;
    const on = (target, type, handler) => target.addEventListener(type, handler, { signal, passive:true });
    on(document, 'divina:supreme-orb-pulse', event => this.commit({ orb:'awake' }, 'orb:awake', event.detail));
    on(document, 'divina:supreme-orb-intent', event => {
      const route = normalizeWorldRouteV535(event.detail?.route || event.detail?.to || this.state.route);
      this.commit({ phase:'intent', orb:'intent', destination:route, recovery:false }, 'orb:intent', event.detail);
    });
    on(document, 'divina:supreme-orb-will-navigate', event => {
      const route = normalizeWorldRouteV535(event.detail?.to || event.detail?.route || this.state.route);
      this.commit({ phase:'transition', orb:'traveling', destination:route, load:'idle', recovery:false }, 'orb:traveling', event.detail);
    });
    on(document, 'divina:route-start', event => this.commit({
      phase:'transition', orb:'traveling', destination:normalizeWorldRouteV535(event.detail?.id || this.state.destination || this.state.route)
    }, 'world:transition', event.detail));
    on(document, 'divina:page-loading', event => this.commit({ phase:'loading', load:'loading' }, 'world:loading', event.detail));
    on(document, 'divina:page-deferred', event => this.commit({ phase:'present', load:'deferred' }, 'world:deferred', event.detail));
    on(document, 'divina:route-ready', event => this.enter(event.detail?.id, 'world:present', event.detail));
    on(document, 'divina:supreme-orb-did-navigate', event => this.enter(event.detail?.to, 'orb:present', event.detail));
    on(document, 'divina:page-ready', event => this.ready(event.detail?.id, event.detail));
    for (const type of ['divina:page-error','divina:route-error','divina:supreme-orb-navigation-error']) {
      on(document, type, event => this.commit({ phase:'recovering', orb:'recovering', load:'error', recovery:true }, 'world:recovering', event.detail));
    }
    on(document, 'divina:supreme-orb-recovered', event => this.ready(this.state.route, event.detail));
    on(document, 'divina:menu-state', event => {
      const menu = String(event.detail?.state || '').toLowerCase();
      if (MENU_STATES.has(menu)) this.commit({ menu }, `menu:${menu}`, event.detail);
    });
    on(document, 'visibilitychange', () => this.commit(document.hidden
      ? { phase:'paused', presence:'background', orb:'paused' }
      : { phase:'ready', presence:'foreground', orb:'present' },
    document.hidden ? 'presence:background' : 'presence:foreground'));
    on(globalThis, 'online', () => this.commit({ network:'online' }, 'network:online'));
    on(globalThis, 'offline', () => this.commit({ network:'offline' }, 'network:offline'));
  }

  enter(rawRoute, signalName, detail) {
    const route = normalizeWorldRouteV535(rawRoute || this.state.destination || this.state.route);
    const world = worldForRouteV535(route);
    this.commit({
      phase:'present', route, destination:null, orb:'present', recovery:false,
      world:{ id:world.id, family:world.family, name:world.name }
    }, signalName, detail);
  }

  ready(rawRoute, detail) {
    const route = normalizeWorldRouteV535(rawRoute || this.state.route);
    const world = worldForRouteV535(route);
    this.commit({
      phase:'ready', route, destination:null, orb:'present', load:'ready', recovery:false,
      world:{ id:world.id, family:world.family, name:world.name }
    }, 'world:ready', detail);
  }

  commit(patch, signalName = 'vitality:update', detail = null) {
    const safePatch = { ...patch };
    if (safePatch.phase && !PHASES.has(safePatch.phase)) delete safePatch.phase;
    if (safePatch.orb && !ORB_STATES.has(safePatch.orb)) delete safePatch.orb;
    if (safePatch.load && !LOAD_STATES.has(safePatch.load)) delete safePatch.load;
    if (safePatch.menu && !MENU_STATES.has(safePatch.menu)) delete safePatch.menu;
    this.pending = { ...(this.pending || {}), ...safePatch, reason:signalName, detail:publicDetail(detail) };
    if (this.flushQueued) return this.snapshot();
    this.flushQueued = true;
    queueMicrotask(() => this.flush());
    return this.snapshot();
  }

  flush() {
    this.flushQueued = false;
    if (!this.pending) return;
    const { detail, ...patch } = this.pending;
    this.pending = null;
    this.state = cloneState({ ...this.state, ...patch, sequence:this.state.sequence + 1 });
    const record = Object.freeze({ sequence:this.state.sequence, signal:this.state.reason, detail });
    this.history.push(record);
    if (this.history.length > HISTORY_LIMIT) this.history.shift();
    const snapshot = this.snapshot();
    for (const listener of [...this.listeners]) {
      try { listener(snapshot, record); } catch (error) { console.error('[Divina] observador de vitalidade isolado', error); }
    }
    document.dispatchEvent(new CustomEvent('divina:vitality', { detail:snapshot }));
  }

  signal(name, detail = {}) {
    if (!OFFICIAL_SIGNALS.includes(name)) return false;
    const [subject, state] = name.split(':');
    if (subject === 'network') this.commit({ network:state }, name, detail);
    else if (subject === 'presence') this.commit({ presence:state, phase:state === 'background' ? 'paused' : 'ready' }, name, detail);
    else if (subject === 'menu') this.commit({ menu:state }, name, detail);
    else if (subject === 'orb') this.commit({ orb:state }, name, detail);
    else if (subject === 'world') this.commit({ phase:state === 'deferred' ? 'present' : state, load:LOAD_STATES.has(state) ? state : this.state.load }, name, detail);
    return true;
  }

  subscribe(listener, options = {}) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    if (options.immediate !== false) listener(this.snapshot(), Object.freeze({ signal:'subscribe', detail:Object.freeze({}) }));
    const unsubscribe = () => this.listeners.delete(listener);
    options.signal?.addEventListener?.('abort', unsubscribe, { once:true });
    return unsubscribe;
  }

  snapshot() { return this.state; }
  audit() {
    return Object.freeze({
      release:'V536', valid:true, route:this.state.route, phase:this.state.phase,
      eventsInMemory:this.history.length, historyLimit:HISTORY_LIMIT,
      subscriberCount:this.listeners.size, permanentAnimationLoops:0,
      privateContentReads:0, formValueReads:0, storageReads:0, storageWrites:0, apiCalls:0
    });
  }
  destroy() {
    this.controller.abort();
    this.listeners.clear();
    this.history.length = 0;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
  }
}

export function createVitalityBusV536() {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const bus = new VitalityBusV536();
  globalThis[INSTANCE] = bus;
  document.documentElement.dataset.vitalityBus = 'v536';
  return bus;
}
