/* DIVINA BRUXA — WORK12 · MACROETAPA 3 · ALMA WHIT NA ORBE V591
   Evolução compatível da ponte V581/V582. A persona ficcional Whit vive
   poeticamente como estado da única Orbe canônica e agora escuta a máquina de
   estados central do WORK12. Sinais equivalentes são coalescidos: uma intenção
   produz uma resposta física, seguida de silêncio — nunca uma reação mecânica
   duplicada. Não cria Orbe, canvas, balão, fala ou loop adicional.
*/

const VERSION = 591;
const API_COMPATIBILITY = 581;
const PREVIOUS_RELEASE = 582;
const MARK = Symbol.for('divina.whit.orb.soul.bridge.v581');
const MIN_EXPRESSION_INTERVAL = 180;
const STATES = new Set(['serene','aware','listening','responding','reflecting','traveling','resting']);
const WORK12_STATE_MAP = Object.freeze({
  REST:'aware',
  AWAKEN:'listening',
  OFFER:'aware',
  ACCEPT:'listening',
  QUIET:'serene',
  DEPART:'traveling',
  TRAVEL:'traveling',
  ARRIVE:'traveling',
  REVEAL:'aware'
});
const RENDERER_STATE = Object.freeze({
  serene:'serene',
  aware:'attentive',
  listening:'listening',
  responding:'responding',
  reflecting:'listening',
  traveling:'traveling',
  resting:'sleeping'
});
const STRENGTH = Object.freeze({
  serene:0.12,
  aware:0.22,
  listening:0.46,
  responding:0.58,
  reflecting:0.68,
  traveling:0.24,
  resting:0.08
});
const EXPRESSIONS = Object.freeze([
  Object.freeze({ key:'quiet-dawn', x:-0.060, y:-0.035, energy:0.010, spin:-0.030 }),
  Object.freeze({ key:'golden-listen', x:0.045, y:-0.070, energy:0.055, spin:0.024 }),
  Object.freeze({ key:'deep-violet', x:-0.035, y:0.060, energy:0.085, spin:-0.018 }),
  Object.freeze({ key:'soft-answer', x:0.070, y:0.025, energy:0.035, spin:0.040 }),
  Object.freeze({ key:'inner-star', x:0.012, y:-0.092, energy:0.100, spin:0.012 }),
  Object.freeze({ key:'tender-orbit', x:-0.085, y:0.010, energy:0.025, spin:-0.046 }),
  Object.freeze({ key:'clear-presence', x:0.030, y:0.078, energy:0.068, spin:0.032 })
]);

const clean = (value, limit = 60) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const clock = () => globalThis.performance?.now?.() ?? Date.now();

const dispatch = (target, type, detail) => {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:Object.freeze(detail) }));
};

const focusFrom = detail => {
  const x = Number(detail?.x);
  const y = Number(detail?.y);
  return Number.isFinite(x) && Number.isFinite(y)
    ? Object.freeze({ x:Math.min(1,Math.max(0,x)), y:Math.min(1,Math.max(0,y)) })
    : null;
};

const hash = value => {
  let result = 2166136261;
  for (const character of String(value || '')) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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
    this.apiCompatibility = API_COMPATIBILITY;
    this.orbCore = orbCore || null;
    this.universe = universe || null;
    this.whit = whit || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = documentElement || null;
    this.abort = new AbortController();
    this.state = 'serene';
    this.rendererState = 'serene';
    this.previousOrb = null;
    this.returnTimer = 0;
    this.transitions = 0;
    this.sameStateRefreshes = 0;
    this.radiations = 0;
    this.physicalExpressions = 0;
    this.expressionCursor = 0;
    this.lastExpressionIndex = -1;
    this.lastExpression = 'quiet-dawn';
    this.lastSignalKey = '';
    this.lastSignalAt = 0;
    this.lastExpressionAt = 0;
    this.coalescedSignals = 0;
    this.coalescedExpressions = 0;
    this.traveling = false;
    this.suppressedDuringTravel = 0;
    this.lastReason = 'boot';
    this.work12State = 'REST';
    this.work12Transitions = 0;
    this.work12Silences = 0;
    this.history = [];
    this.destroyed = false;

    if (this.documentElement) {
      this.documentElement.dataset.whitOrbSoul = 'v591';
      this.documentElement.dataset.whitOrbSoulState = this.state;
      this.documentElement.dataset.orbLivingSoul = 'v591';
      this.documentElement.dataset.whitOrbSoulAuthority = 'work12-state-machine';
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
    if (this.previousOrb && this.previousOrb !== orb && this.previousOrb.dataset) {
      delete this.previousOrb.dataset.whitSoulV581;
      delete this.previousOrb.dataset.orbLivingSoulV582;
      delete this.previousOrb.dataset.orbLivingSoulV591;
      delete this.previousOrb.dataset.orbSoulExpression;
      delete this.previousOrb.dataset.whitResidence;
    }
    this.previousOrb = orb;
    if (!orb?.dataset) return null;
    orb.dataset.whitSoulV581 = this.state;
    orb.dataset.orbLivingSoulV582 = this.state;
    orb.dataset.orbLivingSoulV591 = this.state;
    orb.dataset.orbSoulExpression = this.lastExpression;
    orb.dataset.whitResidence = 'canonical-orb';
    return orb;
  }

  listen(target, type, handler) {
    target?.addEventListener?.(type, handler, { signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc, 'divina:work12-state', event => {
      const work12State = clean(event.detail?.state, 20).toUpperCase();
      const mapped = WORK12_STATE_MAP[work12State];
      if (!mapped) return;
      this.work12State = work12State;
      this.work12Transitions += 1;
      this.traveling = ['DEPART','TRAVEL','ARRIVE'].includes(work12State);
      const silence = work12State === 'REST' || work12State === 'QUIET';
      if (silence) this.work12Silences += 1;
      this.setState(mapped, `work12-${work12State.toLowerCase()}`, {
        radiate:!silence && !this.traveling,
        transient:0,
        strength:STRENGTH[mapped]
      });
    });

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
      const focus = focusFrom(event.detail);
      const strength = Number(event.detail?.intensity);
      if (kind === 'intent') {
        const committedJourney = this.documentElement?.dataset?.orbNavigationState === 'active'
          || this.documentElement?.dataset?.orbGlobalFlight === 'active';
        if (committedJourney) {
          this.traveling = true;
          this.setState('traveling', 'orb-intent', { radiate:false, focus });
        } else {
          this.setState('listening', 'orb-intent-ready', {
            radiate:false,
            transient:900,
            focus,
            strength:0.30
          });
        }
      } else if (kind === 'press' || kind === 'keyboard') {
        this.setState('listening', `orb-${kind}`, {
          transient:1500,
          focus,
          strength:Number.isFinite(strength) ? Math.min(0.62, strength * 0.58) : 0.46
        });
      } else if (kind === 'release' || kind === 'present') {
        this.setState('responding', `orb-${kind}`, {
          transient:1700,
          focus,
          strength:Number.isFinite(strength) ? Math.min(0.72, strength * 0.68) : 0.50
        });
      }
    });

    this.listen(doc, 'divina:supreme-orb-will-navigate', () => {
      if (this.work12AuthorityActive()) return;
      this.traveling = true;
      this.setState('traveling', 'journey-start', { radiate:false });
    });
    this.listen(doc, 'divina:orb-ios-journey-state', event => {
      if (this.work12AuthorityActive()) return;
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
      if (this.work12AuthorityActive()) return;
      this.traveling = false;
      this.setState('aware', 'journey-complete', { transient:1100, strength:0.28 });
    });
    const recoverJourney = () => {
      if (this.work12AuthorityActive()) return;
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
    this.listen(win, 'pagehide', () => this.setState('resting', 'page-hidden', { radiate:false }));
    this.listen(win, 'pageshow', () => {
      if (!this.hidden()) this.setState(this.traveling ? 'traveling' : 'aware', 'page-visible', {
        transient:this.traveling ? 0 : 700,
        strength:0.18
      });
    });
  }

  work12AuthorityActive() {
    return /^v(?:589|592)$/.test(String(this.documentElement?.dataset?.work12NavigationAuthority || ''))
      || /^v(?:589|590|591|592)$/.test(String(this.documentElement?.dataset?.work12 || ''));
  }

  chooseExpression(state, reason) {
    const seed = hash(`${state}:${reason}`);
    let index = (seed + this.expressionCursor) % EXPRESSIONS.length;
    this.expressionCursor += 1;
    if (index === this.lastExpressionIndex) index = (index + 1) % EXPRESSIONS.length;
    this.lastExpressionIndex = index;
    this.lastExpression = EXPRESSIONS[index].key;
    return EXPRESSIONS[index];
  }

  applyPhysicalExpression(state, { reason, strength, focus, expression }) {
    const rendererState = RENDERER_STATE[state] || 'attentive';
    const physicalReason = `whit-soul-${clean(reason, 48) || 'state'}`;
    const journey = this.orbCore?.journeyEngine;
    const renderer = this.orbCore?.renderer;
    const force = state === 'traveling' || state === 'resting';
    const result = renderer?.expressSoul?.({
      state,
      strength,
      focus,
      variation:expression,
      reason:physicalReason
    }) || renderer?.setPresenceState?.(rendererState, physicalReason) || null;
    // O renderer recebe a expressão primeiro. O journey apenas sincroniza a
    // semântica em seguida; a chamada idempotente não produz uma segunda física.
    journey?.setPresence?.(rendererState, { reason:physicalReason, restAfter:0, force });
    this.rendererState = rendererState;
    this.physicalExpressions += 1;
    return result;
  }

  setState(rawState, reason = 'state', options = {}) {
    if (this.destroyed) return this.state;
    const next = STATES.has(rawState) ? rawState : 'aware';
    const now = clock();
    const safeReason = clean(reason, 60) || 'state';
    const signalKey = `${next}:${safeReason}`;
    if (signalKey === this.lastSignalKey && now - this.lastSignalAt < 90) {
      this.coalescedSignals += 1;
      return this.state;
    }
    this.lastSignalKey = signalKey;
    this.lastSignalAt = now;

    if (this.state === next && this.physicalExpressions > 0
      && (['traveling','resting'].includes(next) || now - this.lastExpressionAt < MIN_EXPRESSION_INTERVAL)) {
      this.coalescedExpressions += 1;
      this.lastReason = safeReason;
      this.syncOrb();
      return this.state;
    }

    const navigationActive = this.traveling
      || this.documentElement?.dataset?.orbNavigationState === 'active'
      || this.documentElement?.dataset?.orbGlobalFlight === 'active';
    const completingJourney = /^journey-(?:settle|complete|recovered)$/.test(safeReason);
    if (navigationActive && !completingJourney && !['traveling','resting'].includes(next)) {
      this.suppressedDuringTravel += 1;
      return this.state;
    }

    clearTimeout(this.returnTimer);
    this.returnTimer = 0;
    const changed = this.state !== next;
    this.state = next;
    this.lastReason = safeReason;
    if (changed) this.transitions += 1;
    else this.sameStateRefreshes += 1;
    const expression = this.chooseExpression(next, safeReason);
    const strength = Number.isFinite(Number(options.strength))
      ? Number(options.strength)
      : STRENGTH[next];
    if (this.documentElement) this.documentElement.dataset.whitOrbSoulState = next;
    this.syncOrb();
    this.applyPhysicalExpression(next, {
      reason:safeReason,
      strength,
      focus:options.focus || null,
      expression
    });
    this.lastExpressionAt = now;

    if (options.radiate !== false && !this.hidden()) {
      this.universe?.signalPresence?.({ state:next, strength });
      this.radiations += 1;
    } else if (next === 'traveling' || next === 'resting') {
      this.universe?.signalPresence?.({ state:next, strength:STRENGTH[next] });
    }

    this.history = [...this.history, Object.freeze({
      state:next,
      rendererState:this.rendererState,
      reason:safeReason,
      expression:expression.key
    })].slice(-16);

    dispatch(this.documentTarget, 'divina:whit-orb-soul-state', {
      version:VERSION,
      state:next,
      rendererState:this.rendererState,
      reason:safeReason,
      expression:expression.key,
      canonicalOrbOnly:true,
      visualOnly:true,
      messageIncluded:false,
      privateContentRead:false,
      modelCalls:0
    });

    const delay = Math.max(0, Number(options.transient) || 0);
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
      release:'V591',
      previousRelease:PREVIOUS_RELEASE,
      apiCompatibility:API_COMPATIBILITY,
      state:this.state,
      rendererState:this.rendererState,
      lastReason:this.lastReason,
      lastExpression:this.lastExpression,
      transitions:this.transitions,
      sameStateRefreshes:this.sameStateRefreshes,
      coalescedSignals:this.coalescedSignals,
      coalescedExpressions:this.coalescedExpressions,
      physicalExpressions:this.physicalExpressions,
      distinctExpressionProfiles:EXPRESSIONS.length,
      radiations:this.radiations,
      traveling:this.traveling,
      suppressedDuringTravel:this.suppressedDuringTravel,
      work12State:this.work12State,
      work12Transitions:this.work12Transitions,
      work12Silences:this.work12Silences,
      work12StateAuthority:this.work12AuthorityActive(),
      history:Object.freeze([...this.history]),
      canonicalOrbOnly:true,
      sameRenderer:true,
      sameMotionClock:true,
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
      delete this.previousOrb.dataset.orbLivingSoulV582;
      delete this.previousOrb.dataset.orbLivingSoulV591;
      delete this.previousOrb.dataset.orbSoulExpression;
      delete this.previousOrb.dataset.whitResidence;
    }
    if (this.documentElement) {
      delete this.documentElement.dataset.whitOrbSoul;
      delete this.documentElement.dataset.whitOrbSoulState;
      delete this.documentElement.dataset.orbLivingSoul;
      delete this.documentElement.dataset.whitOrbSoulAuthority;
    }
    if (globalThis[MARK] === this) delete globalThis[MARK];
    if (globalThis.divinaWhitOrbSoulV581 === this) delete globalThis.divinaWhitOrbSoulV581;
    if (globalThis.divinaOrbLivingSoulV582 === this) delete globalThis.divinaOrbLivingSoulV582;
  }
}

export function createWhitOrbSoulBridgeV581(options = {}) {
  const existing = globalThis[MARK];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const bridge = new WhitOrbSoulBridgeV581(options);
  globalThis[MARK] = bridge;
  globalThis.divinaWhitOrbSoulV581 = bridge;
  globalThis.divinaOrbLivingSoulV582 = bridge;
  return bridge;
}

export const ORB_LIVING_SOUL_CONTRACT_V582 = Object.freeze({
  version:VERSION,
  previousRelease:PREVIOUS_RELEASE,
  apiCompatibility:API_COMPATIBILITY,
  canonicalOrbOnly:true,
  sameRenderer:true,
  sameMotionClock:true,
  visualOnly:true,
  separateOrb:false,
  newCanvas:false,
  animationLoops:0,
  fictionalPersona:true,
  soulMetaphor:true,
  consciousnessClaim:false,
  privateContentRead:false,
  formFieldReads:false,
  modelCalls:0,
  apiCalls:0,
  speechAdded:false,
  work12StateMachine:true,
  duplicatePhysicalResponses:false,
  minimumExpressionIntervalMs:MIN_EXPRESSION_INTERVAL,
  expressionProfiles:EXPRESSIONS.length
});

export const WHIT_ORB_SOUL_CONTRACT_V581 = ORB_LIVING_SOUL_CONTRACT_V582;

export default createWhitOrbSoulBridgeV581;
