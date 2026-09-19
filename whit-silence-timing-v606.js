/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 6 · V606
   WHIT VIVA PELO SILENCIO, UTILIDADE E TIMING

   A V594 ja mora na unica Orbe e qualifica pausas contextuais. Esta camada nao
   cria outra Whit nem outra interface: ela impede que sinais estruturais dos
   nucleos antigos virem fala automatica. A Orbe ainda pode responder sem texto
   pelo barramento existente; voz visivel permanece reservada a convite ou
   consentimento explicito.

   Nenhum campo, pergunta, carta, Diario ou emocao e lido. Nao ha storage,
   rede, modelo, observador, canvas, renderer, loop ou timer novo.
*/

const VERSION = 606;
const INSTANCE = Symbol.for('divina.work13.whit.silence.timing.v606');

const EXPLICIT_SIGNAL_KINDS = new Set([
  'library-whit-invite',
  'spread-whit-invite',
  'school-whit-invite',
  'journal-whit-invite',
  'consent-required',
  'consent-changed'
]);

const STRUCTURAL_SIGNAL_KINDS = new Set([
  'world-ready',
  'library-card-open',
  'spread-reveal',
  'school-complete',
  'daily-save',
  'account-state',
  'skin-change',
  'notification-choice',
  'whisper',
  'whit-supreme-guidance'
]);

const AUTOMATIC_SIGNATURE_KINDS = new Set([
  'spread-reveal',
  'school-complete',
  'skin-change'
]);

const TRAVEL_STATES = new Set(['DEPART','TRAVEL','ARRIVE']);

export const WHIT_SILENCE_TIMING_CONTRACT_V606 = Object.freeze({
  version:VERSION,
  base:'V605-cards-converse-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'6-of-10',
  title:'Whit Viva — Silencio, Utilidade e Timing',
  law:'one-orb-one-universe-one-presence-one-journey',
  residence:'canonical-orb',
  defaultResponse:'silence',
  nonverbalStructuralResponse:true,
  visibleSpeechPolicy:'explicit-invitation-or-consent-only',
  contextualOfferAuthority:'V594-qualified-pause-unchanged',
  maximumContextualOffersPerSession:2,
  ordinaryTouchSpeech:false,
  routeArrivalSpeech:false,
  automaticRevealSpeech:false,
  automaticCompletionSpeech:false,
  automaticSkinSpeech:false,
  automaticLegacyWhisperSpeech:false,
  travelPolicy:'absolute-silence',
  menuPolicy:'absolute-silence',
  hiddenPagePolicy:'absolute-silence',
  deliberateInvitationPreserved:true,
  consentMessagesPreserved:true,
  contextMemoryTriggersWhit:false,
  separateWhitBody:false,
  domNodesCreated:0,
  stylesheetsCreated:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  deferredTimers:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  privateContentReads:0,
  formValueReads:0,
  journalBodyReads:0,
  questionReads:0,
  cardIdentityReads:0,
  emotionInference:false,
  iphoneFirst:true
});

const clean = (value, limit = 64) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const freeze = value => Object.freeze(value);

const emit = (target, type, detail) => {
  const EventCtor = target?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!target?.dispatchEvent || typeof EventCtor !== 'function') return false;
  target.dispatchEvent(new EventCtor(type, { detail:freeze(detail) }));
  return true;
};

const safeStatus = value => {
  try { return value?.status?.() || null; }
  catch { return null; }
};

export class WhitSilenceTimingV606 {
  constructor({
    livingPresence = globalThis.divinaWhitLivingPresenceV594,
    soul = globalThis.divinaWhitOrbSoulV581,
    presence = globalThis.divinaWhitV307?.presence,
    nervousSystem = globalThis.divinaWhitV308?.nervousSystem,
    signature = globalThis.divinaWhitV311?.signature,
    supreme = globalThis.divinaWhitCoreSupremeV527?.core,
    governor = globalThis.divinaMessageGovernorV580,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    documentElement = globalThis.document?.documentElement
  } = {}) {
    this.version = VERSION;
    this.livingPresence = livingPresence || null;
    this.soul = soul || null;
    this.presence = presence || null;
    this.nervousSystem = nervousSystem || null;
    this.signature = signature || null;
    this.supreme = supreme || null;
    this.governor = governor || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = documentElement || null;
    this.controller = new AbortController();
    this.destroyed = false;
    this.state = 'silent';
    this.lastReason = 'boot';
    this.signalsObserved = 0;
    this.structuralSignalsKeptSilent = 0;
    this.visibleRequestsSuppressed = 0;
    this.signatureLinesSuppressed = 0;
    this.explicitSignalsPassed = 0;
    this.silenceTransitions = 0;
    this.travelSilences = 0;
    this.menuSilences = 0;
    this.hiddenSilences = 0;
    this.qualifiedOffersObserved = 0;
    this.originalNerveSignal = null;
    this.nerveSignalProxy = null;
    this.originalSignatureOffer = null;
    this.signatureOfferProxy = null;

    this.installIdentity();
    this.installNervousSilence();
    this.installSignatureSilence();
    this.bind();
    this.setState('silent', 'boot');
    emit(this.documentTarget, 'divina:whit-silence-timing-ready', {
      version:VERSION,
      state:this.state,
      residence:'canonical-orb',
      automaticSpeech:false,
      privateContentRead:false
    });
  }

  installIdentity() {
    const root = this.documentElement;
    if (!root?.dataset) return false;
    root.dataset.work13WhitTiming = 'v606';
    root.dataset.work13WhitPolicy = 'silence-until-useful';
    root.dataset.work13WhitState = 'silent';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, {
      ...options,
      signal:this.controller.signal
    });
  }

  setState(state, reason = 'state') {
    this.state = clean(state, 32) || 'silent';
    this.lastReason = clean(reason, 64) || 'state';
    if (this.documentElement?.dataset) {
      this.documentElement.dataset.work13WhitState = this.state;
      this.documentElement.dataset.work13WhitReason = this.lastReason;
    }
    return this.state;
  }

  isExplicitSignal(kind, options = {}) {
    const normalized = clean(kind, 80).toLowerCase();
    return options?.explicit === true || EXPLICIT_SIGNAL_KINDS.has(normalized);
  }

  installNervousSilence() {
    const nerves = this.nervousSystem;
    if (!nerves || typeof nerves.signal !== 'function') return false;
    this.originalNerveSignal = nerves.signal;
    const engine = this;
    this.nerveSignalProxy = function(kind, options = {}) {
      const normalized = clean(kind, 80).toLowerCase() || 'signal';
      const source = clean(options?.source, 80).toLowerCase();
      const explicit = engine.isExplicitSignal(normalized, options);
      engine.signalsObserved += 1;

      if (explicit) {
        engine.explicitSignalsPassed += 1;
        engine.setState('invited', normalized);
        return engine.originalNerveSignal.call(this, kind, options);
      }

      const structural = STRUCTURAL_SIGNAL_KINDS.has(normalized)
        || source === 'existing-world-whisper'
        || options?.visible === true;
      if (structural) engine.structuralSignalsKeptSilent += 1;
      if (options?.visible === true || normalized === 'whisper') {
        engine.visibleRequestsSuppressed += 1;
      }
      engine.setState('silent', structural ? `structural-${normalized}` : `uninvited-${normalized}`);
      emit(engine.documentTarget, 'divina:whit-timing-silence', {
        version:VERSION,
        kind:normalized,
        reason:structural ? 'structural-signal' : 'not-explicit',
        messageIncluded:false,
        privateContentRead:false
      });
      return engine.originalNerveSignal.call(this, kind, {
        ...(options || {}),
        visible:false,
        source:source || 'v606-silent-signal'
      });
    };
    nerves.signal = this.nerveSignalProxy;
    return true;
  }

  installSignatureSilence() {
    const signature = this.signature;
    if (!signature || typeof signature.offerEventLine !== 'function') return false;
    this.originalSignatureOffer = signature.offerEventLine;
    const engine = this;
    this.signatureOfferProxy = function(kind, force = false) {
      const normalized = clean(kind, 80).toLowerCase();
      if (AUTOMATIC_SIGNATURE_KINDS.has(normalized)) {
        engine.signatureLinesSuppressed += 1;
        engine.setState('silent', `signature-${normalized}`);
        return false;
      }
      return engine.originalSignatureOffer.call(this, kind, force);
    };
    signature.offerEventLine = this.signatureOfferProxy;
    return true;
  }

  silenceVisiblePresence(reason = 'silence') {
    const safeReason = clean(reason, 64) || 'silence';
    this.silenceTransitions += 1;
    this.setState('silent', safeReason);
    try { this.presence?.hide?.(true, `v606-${safeReason}`); } catch {}
    try { this.supreme?.close?.(true, `v606-${safeReason}`); } catch {}
    emit(this.documentTarget, 'divina:whit-timing-silence', {
      version:VERSION,
      reason:safeReason,
      messageIncluded:false,
      privateContentRead:false
    });
    return true;
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    ['divina:route-start','divina:supreme-orb-will-navigate'].forEach(type => {
      this.listen(doc, type, () => {
        this.travelSilences += 1;
        this.silenceVisiblePresence('travel');
      });
    });

    this.listen(doc, 'divina:work12-state', event => {
      const state = clean(event.detail?.state, 20).toUpperCase();
      if (!TRAVEL_STATES.has(state)) return;
      this.travelSilences += 1;
      this.silenceVisiblePresence(`work12-${state.toLowerCase()}`);
    });

    this.listen(doc, 'divina:menu-state', event => {
      const state = clean(event.detail?.state || 'closed', 24).toLowerCase();
      if (state === 'closed') return;
      this.menuSilences += 1;
      this.silenceVisiblePresence('menu');
    });

    this.listen(doc, 'visibilitychange', () => {
      if (doc?.visibilityState !== 'hidden') return;
      this.hiddenSilences += 1;
      this.silenceVisiblePresence('hidden');
    });

    this.listen(win, 'pagehide', () => {
      this.hiddenSilences += 1;
      this.silenceVisiblePresence('pagehide');
    }, { passive:true });

    this.listen(doc, 'divina:whit-living-offer', () => {
      this.qualifiedOffersObserved += 1;
      this.setState('useful-offer', 'v594-qualified-pause');
    });

    this.listen(doc, 'divina:magic-bubble-silence', () => {
      if (this.state === 'useful-offer') this.setState('silent', 'offer-finished');
    });

    this.listen(doc, 'divina:experience-message-released', event => {
      if (!String(event.detail?.channel || '').startsWith('whit')) return;
      this.setState('silent', 'explicit-message-finished');
    });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    const v606Bodies = doc?.querySelectorAll?.('[data-work13-whit-timing-ui="true"]')?.length || 0;
    return freeze({
      release:'V606',
      canonicalOrbs,
      canonicalCanvases,
      v606Bodies,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      separateWhitBody:false,
      nervousSilenceInstalled:this.nervousSystem?.signal === this.nerveSignalProxy,
      signatureSilenceInstalled:this.signature?.offerEventLine === this.signatureOfferProxy,
      deliberateInvitationPreserved:true,
      contextualOfferAuthorityUnchanged:true,
      contextMemoryTriggersWhit:false,
      automaticRevealSpeech:false,
      automaticCompletionSpeech:false,
      automaticSkinSpeech:false,
      privateContentReads:0,
      formValueReads:0,
      journalBodyReads:0,
      questionReads:0,
      cardIdentityReads:0,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      modelCalls:0,
      domNodesCreated:0,
      stylesheetsCreated:0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0
    });
  }

  status() {
    return freeze({
      ...WHIT_SILENCE_TIMING_CONTRACT_V606,
      state:this.state,
      lastReason:this.lastReason,
      signalsObserved:this.signalsObserved,
      structuralSignalsKeptSilent:this.structuralSignalsKeptSilent,
      visibleRequestsSuppressed:this.visibleRequestsSuppressed,
      signatureLinesSuppressed:this.signatureLinesSuppressed,
      explicitSignalsPassed:this.explicitSignalsPassed,
      silenceTransitions:this.silenceTransitions,
      travelSilences:this.travelSilences,
      menuSilences:this.menuSilences,
      hiddenSilences:this.hiddenSilences,
      qualifiedOffersObserved:this.qualifiedOffersObserved,
      livingPresence:safeStatus(this.livingPresence),
      soul:safeStatus(this.soul),
      governor:safeStatus(this.governor),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.controller.abort();
    if (this.nervousSystem?.signal === this.nerveSignalProxy && this.originalNerveSignal) {
      this.nervousSystem.signal = this.originalNerveSignal;
    }
    if (this.signature?.offerEventLine === this.signatureOfferProxy && this.originalSignatureOffer) {
      this.signature.offerEventLine = this.originalSignatureOffer;
    }
    const root = this.documentElement;
    if (root?.dataset?.work13WhitTiming === 'v606') {
      ['work13WhitTiming','work13WhitPolicy','work13WhitState','work13WhitReason']
        .forEach(key => delete root.dataset[key]);
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaWhitSilenceTimingV606 === this) delete globalThis.divinaWhitSilenceTimingV606;
    return true;
  }
}

export function createWhitSilenceTimingV606(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const timing = new WhitSilenceTimingV606(options);
  globalThis[INSTANCE] = timing;
  globalThis.divinaWhitSilenceTimingV606 = timing;
  return timing;
}

export default createWhitSilenceTimingV606;
