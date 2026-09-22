/* DIVINA BRUXA — WORK13 · WHIT · PRESENCA ENTRE MUNDOS · V620
   Uma camada de mundo sobre a Whit local V557, a alma V581, a presenca V594
   e o silencio V606. Reusa a interface e a Orbe existentes: chegada, pausa,
   convite explicito, escuta, uma resposta local, rastro visivel e silencio.
   Nao le perguntas, Diario, memoria, mensagens, campos ou identidade. */

const VERSION = 620;
const STYLE_ID = 'divinaWhitWorldV620';
const STYLE_HREF = './whit-world-v620.css?v=620-presenca-entre-mundos';
const INSTANCE = Symbol.for('divina.work13.whit.world.v620');
const PHASES = new Set([
  'rest','threshold','invited','listening','responding','present','settled',
  'context','memory','portal','travel','silence'
]);

export const WHIT_WORLD_CONTRACT_V620 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'ai',
  name:'Whit',
  universe:'presenca-entre-mundos',
  identity:'midnight-indigo-opal-electric-cyan',
  sequence:Object.freeze([
    'arrival','silence','one-explicit-invitation','listening',
    'one-local-response','visible-session-trace',
    'context-on-explicit-consent','return','silence'
  ]),
  localWhitAuthority:'V557-preserved',
  orbSoulAuthority:'V581-preserved',
  livingPresenceAuthority:'V594-preserved',
  silenceTimingAuthority:'V606-preserved',
  localDefaultPreserved:true,
  accountRequired:false,
  localApiCallsPreserved:0,
  localModelCallsPreserved:0,
  localCreditsUsedPreserved:0,
  sessionMemoryTurnsPreserved:6,
  sessionMemoryPersistent:false,
  sessionMemoryVisible:true,
  sessionMemoryRemovable:true,
  persistentMemoryExplicitOnly:true,
  persistentMemoryUserControlled:true,
  visibleContextOnly:true,
  exactContextReceiptsPreserved:true,
  sendConsentRequired:true,
  contextBodyStoredInReceipt:false,
  defaultResponse:'silence',
  ordinaryTouchSpeech:false,
  visibleSpeechPolicy:'explicit-invitation-or-consent-only',
  maximumContextualOffersPerSession:2,
  automaticArrivalSpeech:false,
  automaticRevealSpeech:false,
  automaticCompletionSpeech:false,
  automaticSkinSpeech:false,
  helpBeforeSale:true,
  emotionalSalesPressure:false,
  emotionInference:false,
  consciousnessClaim:false,
  literalWhitneyIdentity:false,
  voiceClone:false,
  soulClaim:false,
  privateByDefault:true,
  journalSilentReads:0,
  schoolNoteSilentReads:0,
  tarotQuestionSilentReads:0,
  privateContentReads:0,
  formValueReads:0,
  messageBodyReads:0,
  historyReads:0,
  memoryBodyReads:0,
  accountDataReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  existingWhitBodyReused:true,
  separateWhitBody:false,
  whitFunctionChanges:0,
  generationChanges:0,
  memoryAuthorityChanges:0,
  consentChanges:0,
  orbActionChanges:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  visibleCopyChanges:1,
  newVisibleDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
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

const normalizePhase = value => {
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const phaseFromSignal = value => {
  const signal = String(value || '').trim().toLowerCase();
  if (/travel|depart|arriv/.test(signal)) return 'travel';
  if (/menu|portal/.test(signal)) return 'portal';
  if (/generat|respond|thinking|compos/.test(signal)) return 'responding';
  if (/listen|input|focus|receiv/.test(signal)) return 'listening';
  if (/memory|remember/.test(signal)) return 'memory';
  if (/context|receipt|consent/.test(signal)) return 'context';
  if (/offer|invite|open|expand/.test(signal)) return 'invited';
  if (/present|visible|speak|message/.test(signal)) return 'present';
  if (/settle|complete|done|idle|close/.test(signal)) return 'settled';
  if (/silent|quiet|rest|aware/.test(signal)) return 'silence';
  return '';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{ detail:Object.freeze(detail) }));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

export class WhitWorldV620 {
  constructor({
    livingPresence = globalThis.divinaWhitLivingPresenceV594,
    silenceTiming = globalThis.divinaWhitSilenceTimingV606,
    soul = globalThis.divinaWhitOrbSoulV581,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.livingPresence = livingPresence || null;
    this.silenceTiming = silenceTiming || null;
    this.soul = soul || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('ai') || null;
    this.app = this.documentTarget?.getElementById?.('aiApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.publicSignals = 0;
    this.explicitInvitations = 0;
    this.localResponses = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:whit-world-v620-ready',this.status());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement?.('link');
    if (!link) return false;
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append?.(link);
    return true;
  }

  installIdentity() {
    if (this.root?.dataset) this.root.dataset.work13WhitWorld = 'v620';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.whitWorld = 'v620';
    this.screen.dataset.whitUniverse = 'presenca-entre-mundos';
    this.screen.dataset.whitWorldPhase = 'rest';
    this.screen.dataset.whitWorldPresence = 'away';
    this.screen.dataset.whitWorldSequence = 'arrival-silence-invitation-listening-response-trace-consent-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.whitWorldCopy !== 'v620') {
      title.textContent = 'Há presença no intervalo.';
      title.dataset.whitWorldCopy = 'v620';
    }
    return true;
  }

  listen(target,type,handler,options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? { ...options,signal } : options);
  }

  isActive() {
    return this.route === 'ai' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('ai') || null;
    const nextApp = this.documentTarget?.getElementById?.('aiApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.whitWorld = 'v620';
      this.app.dataset.whitUniverse = 'presenca-entre-mundos';
      this.app.dataset.whitWorldPhase = this.phase;
      this.app.dataset.whitWorldPrivacy = 'content-unread';
    }
    return this.app;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const candidates = [
      this.app?.dataset?.whitWorldPublicState,
      this.app?.dataset?.whitState,
      this.app?.dataset?.aiState,
      this.root?.dataset?.work13WhitState,
      this.root?.dataset?.whitLivingState
    ];
    for (const candidate of candidates) {
      const phase = phaseFromSignal(candidate);
      if (phase && phase !== 'silence') return phase;
    }
    return 'threshold';
  }

  setPhase(value,reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.whitWorldPhase = phase;
    if (this.app?.dataset) this.app.dataset.whitWorldPhase = phase;
    emit(this.documentTarget,'divina:whit-world-v620-state',{
      version:VERSION,
      universe:'presenca-entre-mundos',
      route:this.route,
      phase,
      reason:String(reason || 'state').slice(0,64),
      privateContentIncluded:false,
      oneOrb:true,
      automaticSpeech:false,
      automaticNavigation:false
    });
    return phase;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'ai';
    if (this.screen?.dataset) this.screen.dataset.whitWorldPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest',reason);
  }

  observePublicSignal(event, fallback = '') {
    this.publicSignals += 1;
    if (!this.isActive()) return false;
    const phase = phaseFromSignal(event?.detail?.state || event?.detail?.phase || fallback);
    if (!phase) return false;
    if (phase === 'invited') this.explicitInvitations += 1;
    if (phase === 'settled') this.localResponses += 1;
    return Boolean(this.setPhase(phase,`public-${event?.type || 'signal'}`));
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc,'divina:whit-living-presence-ready',event => this.observePublicSignal(event,'silence'));
    this.listen(doc,'divina:whit-silence-timing-ready',event => this.observePublicSignal(event,'silence'));
    this.listen(doc,'divina:whit-living-offer',event => this.observePublicSignal(event,'invited'));
    this.listen(doc,'divina:whit-living-silence',event => this.observePublicSignal(event,'silence'));
    this.listen(doc,'divina:whit-timing-silence',event => this.observePublicSignal(event,'silence'));
    this.listen(win,'divina:whit-orb-soul-state',event => this.observePublicSignal(event,'present'));
    this.listen(win,'whit:supreme-state',event => this.observePublicSignal(event,'present'));
    this.listen(win,'whit:generation-bridge',event => this.observePublicSignal(event,'responding'));

    this.listen(doc,'focusin',event => {
      if (!this.isActive() || !this.app?.contains?.(event.target)) return;
      if (!event.target?.matches?.('input,textarea,[contenteditable="true"]')) return;
      this.setPhase('listening','explicit-focus');
    },{ capture:true });
    this.listen(doc,'submit',event => {
      if (!this.isActive() || !this.app?.contains?.(event.target)) return;
      this.explicitInvitations += 1;
      this.setPhase('responding','explicit-submit');
    },{ capture:true });

    this.listen(doc,'divina:menu-state',event => {
      const state = String(event?.detail?.state || 'closed').toLowerCase();
      if (state !== 'closed' && this.route === 'ai') this.setPhase('portal','menu-open');
      else if (this.route === 'ai') this.sync('menu-closed');
    });

    this.listen(doc,'divina:route-start',event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'ai' || target === 'ai') this.setPhase('travel','route-start');
    });

    const onRoute = event => {
      this.route = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget,this.windowTarget)
      );
      this.sync('route');
    };
    this.listen(doc,'divina:route-ready',onRoute);
    this.listen(doc,'divina:page-ready',onRoute);
    this.listen(doc,'divina:supreme-orb-did-navigate',onRoute);
    this.listen(win,'hashchange',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('hashchange');
    },{ passive:true });
    this.listen(win,'pageshow',() => {
      this.route = routeNow(this.documentTarget,this.windowTarget);
      this.sync('pageshow');
    },{ passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      whitScreenPresent:Boolean(this.screen),
      whitAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0,canonicalOrbs - 1),
      existingWhitBodyReused:true,
      separateWhitBody:false,
      sessionMemoryTurnsPreserved:6,
      sessionMemoryPersistent:false,
      journalSilentReads:0,
      schoolNoteSilentReads:0,
      tarotQuestionSilentReads:0,
      privateContentReads:0,
      formValueReads:0,
      messageBodyReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...WHIT_WORLD_CONTRACT_V620,
      route:this.route,
      phase:this.phase,
      publicSignals:this.publicSignals,
      explicitInvitations:this.explicitInvitations,
      localResponses:this.localResponses,
      attachments:this.attachments,
      livingPresence:safeStatus(this.livingPresence),
      silenceTiming:safeStatus(this.silenceTiming),
      soul:safeStatus(this.soul),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.app?.dataset) {
      delete this.app.dataset.whitWorld;
      delete this.app.dataset.whitUniverse;
      delete this.app.dataset.whitWorldPhase;
      delete this.app.dataset.whitWorldPrivacy;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.whitWorld;
      delete this.screen.dataset.whitUniverse;
      delete this.screen.dataset.whitWorldPhase;
      delete this.screen.dataset.whitWorldPresence;
      delete this.screen.dataset.whitWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13WhitWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaWhitWorldV620 === this) delete globalThis.divinaWhitWorldV620;
    return true;
  }
}

export function createWhitWorldV620(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new WhitWorldV620(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaWhitWorldV620 = world;
  return world;
}

export default createWhitWorldV620;
