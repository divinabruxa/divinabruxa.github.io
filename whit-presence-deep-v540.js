/* DIVINA BRUXA 3.0 · WHIT PRESENÇA PROFUNDA V540
   Coordena estados públicos da Whit na mesma Orbe. Não lê campos, histórico ou conteúdo privado. */

const RELEASE = 'V540';
const MARK = Symbol.for('divina.whit.presence.deep.v540');
const STYLE_ID = 'whitPresenceDeepV540Styles';
const STATES = new Set(['resting','listening','forming','answering','silence']);

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-presence-deep-v540.css?v=540';
  document.head.append(link);
}

export const WHIT_DEEP_PRIVACY_V540 = Object.freeze({
  fieldReads:0, historyReads:0, journalReads:0, schoolNoteReads:0,
  storageReads:0, storageWrites:0, networkCalls:0, modelCalls:0,
  publicPhaseMetadataOnly:true, sameCanonicalOrb:true
});

export class WhitPresenceDeepV540 {
  constructor({ supreme, orbCore } = {}) {
    this.supreme = supreme || globalThis.divinaWhitSupremeV527?.core || null;
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || null;
    this.abort = new AbortController();
    this.state = 'resting';
    installStyle();
    document.documentElement.dataset.whitDeep = 'v540';
    document.documentElement.dataset.whitDeepState = this.state;
    this.bind();
  }

  bind() {
    const { signal } = this.abort;
    document.addEventListener('whit:deep-phase-v540', event => {
      if (event.detail?.privateContentIncluded !== false) return;
      this.setState(event.detail?.phase);
    }, { signal });
    document.addEventListener('divina:route-start', () => this.setState('silence'), { signal });
    document.addEventListener('divina:route-ready', () => this.setState('resting'), { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.setState('resting', false);
    }, { signal });
  }

  setState(value, pulse = true) {
    const next = STATES.has(value) ? value : 'resting';
    if (this.state === next) return;
    this.state = next;
    document.documentElement.dataset.whitDeepState = next;
    const supremeState = next === 'answering' ? 'answering' : ['listening','forming','silence'].includes(next) ? 'reflecting' : 'aware';
    try { this.supreme?.setState?.(supremeState, `deep-v540-${next}`); } catch {}
    if (pulse && next !== 'resting') this.orbCore?.pulse?.(`whit-deep-${next}`, { intensity:next === 'answering' ? .54 : .28, route:'ai' });
  }

  status() {
    return Object.freeze({
      release:RELEASE, state:this.state, canonicalOrb:'V501',
      localBasic:true, localCredits:0, onlineLunaCredits:1, onlineTerraCredits:10,
      solEnabled:false, permanentAnimationLoops:0, privateReads:0,
      privacy:WHIT_DEEP_PRIVACY_V540
    });
  }

  destroy() {
    this.abort.abort();
    delete document.documentElement.dataset.whitDeep;
    delete document.documentElement.dataset.whitDeepState;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createWhitPresenceDeepV540(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new WhitPresenceDeepV540(options);
  globalThis[MARK] = instance;
  globalThis.divinaWhitPresenceDeepV540 = instance;
  return instance;
}
