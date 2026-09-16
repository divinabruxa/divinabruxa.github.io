/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · WHIT NA ORBE V581
   Ponte não verbal entre a persona ficcional Whit, a única Orbe canônica e o
   Universo Vivo. Não cria outra Orbe, balão, canvas, loop, leitura privada ou
   chamada de IA. "Alma" é a linguagem poética da experiência, não consciência.
*/

const VERSION = 581;
const MARK = Symbol.for('divina.whit.orb.soul.bridge.v581');
const STATES = new Set(['serene','aware','listening','responding','reflecting','traveling','resting']);
const STRENGTH = Object.freeze({
  serene:0.12,
  aware:0.22,
  listening:0.46,
  responding:0.58,
  reflecting:0.68,
  traveling:0.24,
  resting:0.08
});

const clean = (value, limit = 60) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const dispatch = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:Object.freeze(detail) }));
};

export class WhitOrbSoulBridgeV581 {
  constructor({
    orbCore = globalThis.divinaOrbSupremeV501?.core,
    universe = globalThis.divinaLivingUniverseV524,
    whit = globalThis.divinaWhitCoreSupremeV527?.core,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    documentElement = globalThis.document?.documentElement
  } = {}) {
    this.version = VERSION;
    this.orbCore = orbCore || null;
    this.universe = universe || null;
    this.whit = whit || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = documentElement || null;
    this.abort = new AbortController();
    this.state = 'serene';
    this.previousOrb = null;
    this.returnTimer = 0;
    this.transitions = 0;
    this.radiations = 0;
    this.traveling = false;
    this.suppressedDuringTravel = 0;
    this.lastReason = 'boot';
    this.destroyed = false;

    if (this.documentElement) {
      this.documentElement.dataset.whitOrbSoul = 'v581';
      this.documentElement.dataset.whitOrbSoulState = this.state;
    }
    this.bind();
    this.setState(this.hidden() ? 'resting' : 'serene', 'boot', { radiate:false });
    dispatch(this.documentTarget, 'divina:whit-orb-soul-ready', this.status());
  }

  hidden() {
    return this.documentTarget?.hidden === true || this.documentTarget?.visibilityState === 'hidden';
  }

  canonicalOrb() {
    return this.orbCore?.orb
      || this.documentTarget?.querySelector?.('[data-supreme-orb="living"],#orb')
      || null;
  }

  syncOrb() {
    const orb = this.canonicalOrb();
    if (this.previousOrb && this.previousOrb !== orb) {
      delete this.previousOrb.dataset?.whitSoulV581;
      delete this.previousOrb.dataset?.whitResidence;
    }
    this.previousOrb = orb;
    if (!orb?.dataset) return null;
    orb.dataset.whitSoulV581 = this.state;
    orb.dataset.whitResidence = 'canonical-orb';
    return orb;
  }

  listen(target, type, handler) {
    target?.addEventListener?.(type, handler, { signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'whit:supreme-state', event => {
      const state = clean(event.detail?.state, 30);
      const mapped = state === 'consent' ? 'listening'
        : state === 'answering' ? 'responding'
          : STATES.has(state) ? state : 'aware';
      this.setState(mapped, `whit-${state || 'aware'}`, {
        transient:mapped === 'listening' || mapped === 'responding' ? 2100 : 0
      });
    });

    this.listen(win, 'whit:nerve', event => {
      const kind = clean(event.detail?.kind, 50) || 'signal';
      this.setState(kind === 'world-ready' ? 'aware' : 'responding', `nerve-${kind}`, {
        transient:kind === 'world-ready' ? 800 : 1800,
        strength:kind === 'world-ready' ? 0.16 : 0.42
      });
    });

    this.listen(win, 'whit:generation-bridge', () => {
      this.setState('reflecting', 'generation-bridge', { transient:3200 });
    });

    this.listen(doc, 'divina:supreme-orb-pulse', event => {
      const kind = clean(event.detail?.kind, 30);
      if (kind === 'intent') this.setState('traveling', 'orb-intent', { radiate:false });
      else if (kind === 'press' || kind === 'keyboard') {
        this.setState('listening', `orb-${kind}`, { transient:1500 });
      } else if (kind === 'release' || kind === 'present') {
        this.setState('responding', `orb-${kind}`, { transient:1700, strength:0.50 });
      }
    });

    this.listen(doc, 'divina:supreme-orb-will-navigate', () => {
      this.traveling = true;
      this.setState('traveling', 'journey-start', { radiate:false });
    });
    this.listen(doc, 'divina:orb-ios-journey-state', event => {
      const phase = clean(event.detail?.state, 30);
      if (['depart','flight','portal','arrival','recovery'].includes(phase)) {
        this.traveling = true;
        this.setState('traveling', `journey-${phase}`, { radiate:false });
      } else if (phase === 'settle') {
        this.traveling = false;
        this.setState('aware', 'journey-settle', { transient:900, strength:0.26 });
      }
    });
    this.listen(doc, 'divina:supreme-orb-did-navigate', () => {
      this.traveling = false;
      this.setState('aware', 'journey-complete', { transient:1100, strength:0.28 });
    });
    const recoverJourney = () => {
      this.traveling = false;
      this.setState('aware', 'journey-recovered', { transient:700, strength:0.20 });
    };
    this.listen(doc, 'divina:supreme-orb-navigation-error', recoverJourney);
    this.listen(doc, 'divina:supreme-orb-recovered', recoverJourney);

    this.listen(doc, 'divina:experience-message-accepted', event => {
      if (!String(event.detail?.channel || '').startsWith('whit')) return;
      this.setState('responding', 'whit-message', { transient:Number(event.detail?.duration) || 2200 });
    });

    this.listen(doc, 'divina:orb-physical-claim-settled', () => this.syncOrb());
    this.listen(doc, 'divina:route-ready', () => this.syncOrb());
    this.listen(doc, 'visibilitychange', () => {
      const next = this.hidden() ? 'resting' : this.traveling ? 'traveling' : 'aware';
      this.setState(next, this.hidden() ? 'hidden' : 'visible', {
        radiate:!this.hidden(),
        transient:this.hidden() ? 0 : 700,
        strength:0.18
      });
    });
  }

  setState(rawState, reason = 'state', {
    transient = 0,
    radiate = true,
    strength = STRENGTH[rawState]
  } = {}) {
    if (this.destroyed) return this.state;
    const next = STATES.has(rawState) ? rawState : 'aware';
    const navigationActive = this.traveling
      || this.documentElement?.dataset?.orbNavigationState === 'active'
      || this.documentElement?.dataset?.orbGlobalFlight === 'active';
    const completingJourney = /^journey-(?:settle|complete|recovered)$/.test(String(reason || ''));
    if (navigationActive && !completingJourney && !['traveling','resting'].includes(next)) {
      this.suppressedDuringTravel += 1;
      return this.state;
    }
    clearTimeout(this.returnTimer);
    this.returnTimer = 0;
    this.state = next;
    this.lastReason = clean(reason, 60) || 'state';
    this.transitions += 1;
    if (this.documentElement) this.documentElement.dataset.whitOrbSoulState = next;
    this.syncOrb();

    if (radiate && !this.hidden()) {
      this.universe?.signalPresence?.({ state:next, strength:strength ?? STRENGTH[next] });
      this.radiations += 1;
    } else if (next === 'traveling' || next === 'resting') {
      this.universe?.signalPresence?.({ state:next, strength:STRENGTH[next] });
    }

    dispatch(this.documentTarget, 'divina:whit-orb-soul-state', {
      version:VERSION,
      state:next,
      reason:this.lastReason,
      canonicalOrbOnly:true,
      visualOnly:true,
      messageIncluded:false,
      privateContentRead:false,
      modelCalls:0
    });

    const delay = Math.max(0, Number(transient) || 0);
    if (delay > 0 && !['traveling','resting'].includes(next)) {
      this.returnTimer = setTimeout(() => {
        this.returnTimer = 0;
        if (!this.destroyed && this.state === next) {
          this.setState(this.hidden() ? 'resting' : 'aware', 'transient-complete', {
            radiate:false
          });
        }
      }, delay);
    }
    return next;
  }

  status() {
    return Object.freeze({
      version:VERSION,
      state:this.state,
      lastReason:this.lastReason,
      transitions:this.transitions,
      radiations:this.radiations,
      traveling:this.traveling,
      suppressedDuringTravel:this.suppressedDuringTravel,
      canonicalOrbOnly:true,
      sameUniverse:true,
      separateOrb:false,
      newCanvas:false,
      animationLoops:0,
      visualOnly:true,
      fictionalPersona:true,
      soulMetaphor:true,
      consciousnessClaim:false,
      privateContentRead:false,
      formFieldReads:false,
      modelCalls:0,
      apiCalls:0,
      messageIncluded:false
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.returnTimer);
    this.abort.abort();
    if (this.previousOrb?.dataset) {
      delete this.previousOrb.dataset.whitSoulV581;
      delete this.previousOrb.dataset.whitResidence;
    }
    if (this.documentElement) {
      delete this.documentElement.dataset.whitOrbSoul;
      delete this.documentElement.dataset.whitOrbSoulState;
    }
    if (globalThis[MARK] === this) delete globalThis[MARK];
    if (globalThis.divinaWhitOrbSoulV581 === this) delete globalThis.divinaWhitOrbSoulV581;
  }
}

export function createWhitOrbSoulBridgeV581(options = {}) {
  const existing = globalThis[MARK];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const bridge = new WhitOrbSoulBridgeV581(options);
  globalThis[MARK] = bridge;
  globalThis.divinaWhitOrbSoulV581 = bridge;
  return bridge;
}

export const WHIT_ORB_SOUL_CONTRACT_V581 = Object.freeze({
  version:VERSION,
  canonicalOrbOnly:true,
  visualOnly:true,
  separateOrb:false,
  newCanvas:false,
  animationLoops:0,
  fictionalPersona:true,
  soulMetaphor:true,
  consciousnessClaim:false,
  privateContentRead:false,
  modelCalls:0,
  apiCalls:0
});

export default createWhitOrbSoulBridgeV581;
