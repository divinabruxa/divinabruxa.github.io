/* DIVINA BRUXA — WORK13 · CONSULTAS · TEMPLO DO ENCONTRO · V621
   Camada de mundo sobre Consultas V558, Camaras V596 e Clareza V608.
   Reusa o formulario e o protocolo existentes: intencao, quatro leituras,
   dados essenciais, pergunta privada, revisao, passagem por e-mail e retorno.
   Nao le campos, pergunta, contato, protocolo, conta ou pagamento. */

const VERSION = 621;
const STYLE_ID = 'divinaConsultasWorldV621';
const STYLE_HREF = './consultas-world-v621.css?v=621-templo-do-encontro';
const INSTANCE = Symbol.for('divina.work13.consultas.world.v621');
const PHASES = new Set([
  'rest','threshold','invitation','choices','request','details','review',
  'handoff','protocol','settled','portal','travel','silence'
]);

export const CONSULTAS_WORLD_CONTRACT_V621 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'consultations',
  name:'Consultas',
  universe:'templo-do-encontro',
  identity:'garnet-rosewood-candle-gold-moon-ivory',
  sequence:Object.freeze([
    'arrival','one-clear-intention','four-human-readings','one-explicit-choice',
    'essential-contact','private-question-or-context','review','email-handoff',
    'private-protocol','return','silence'
  ]),
  consultationsAuthority:'V558-preserved',
  chamberAuthority:'V596-preserved',
  livingCommerceAuthority:'V608-preserved',
  servicesPreserved:4,
  serviceNamesPreserved:Object.freeze([
    'Mesa Real','Leitura de Mente','Carta de Conselho','Pergunta'
  ]),
  servicePricesCentsPreserved:Object.freeze([25000,20000,15000,5000]),
  priceSnapshotPreserved:true,
  futurePricesAdminEditablePreserved:true,
  previousOrdersImmutable:true,
  humanReadingOnly:true,
  separateFromPremium:true,
  separateFromWhit:true,
  separateFromAppRoyalTable:true,
  requiredFieldsPreserved:Object.freeze([
    'name','email','phone','service','question-or-context'
  ]),
  emailRequired:true,
  phoneRequired:true,
  whatsappRequired:false,
  operationalContact:'orbedasrealidades@hotmail.com',
  submissionChannel:'email-only',
  onlineOnlySubmission:true,
  automaticEmail:false,
  falseDeliveryClaim:false,
  realBilling:false,
  checkoutChanges:0,
  paymentStatusChanges:0,
  requestStatusAuthorityPreserved:true,
  privateByDefault:true,
  otherUserAccess:false,
  analyticsPrivateBodyAccess:false,
  commonLogsPrivateBodyAccess:false,
  whitSilentRead:false,
  seoPrivateContentAccess:false,
  existingConsultationBodyReused:true,
  separateConsultationBody:false,
  consultationFunctionChanges:0,
  serviceChanges:0,
  priceChanges:0,
  formChanges:0,
  submissionChanges:0,
  protocolChanges:0,
  adminChanges:0,
  consentChanges:0,
  orbActionChanges:0,
  privateContentReads:0,
  formValueReads:0,
  questionReads:0,
  contactReads:0,
  protocolReads:0,
  accountDataReads:0,
  paymentDataReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
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
  if (/track|protocol/.test(signal)) return 'protocol';
  if (/mail|handoff|submit|confirm|send/.test(signal)) return 'handoff';
  if (/review|summary|resume/.test(signal)) return 'review';
  if (/detail|contact|field|focus|compos/.test(signal)) return 'details';
  if (/request|question|context|form|engag/.test(signal)) return 'request';
  if (/choice|service|reading/.test(signal)) return 'choices';
  if (/guide|invite|open|present/.test(signal)) return 'invitation';
  if (/settle|received|saved|complete|done|idle|close/.test(signal)) return 'settled';
  if (/silent|quiet|rest/.test(signal)) return 'silence';
  if (/threshold|awak/.test(signal)) return 'threshold';
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

export class ConsultasWorldV621 {
  constructor({
    livingCommerce = globalThis.divinaLivingCommercePathV608,
    chambers = globalThis.divinaRealityChambersV596,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.livingCommerce = livingCommerce || null;
    this.chambers = chambers || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('consultations') || null;
    this.app = this.documentTarget?.getElementById?.('consultationApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.publicSignals = 0;
    this.choiceSignals = 0;
    this.handoffSignals = 0;
    this.protocolSignals = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:consultas-world-v621-ready',this.publicStatus());
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
    if (this.root?.dataset) this.root.dataset.work13ConsultasWorld = 'v621';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.consultasWorld = 'v621';
    this.screen.dataset.consultasUniverse = 'templo-do-encontro';
    this.screen.dataset.consultasWorldPhase = 'rest';
    this.screen.dataset.consultasWorldPresence = 'away';
    this.screen.dataset.consultasWorldSequence = 'arrival-intention-readings-choice-contact-question-review-email-protocol-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.consultasWorldCopy !== 'v621') {
      title.textContent = 'Todo encontro começa pela confiança.';
      title.dataset.consultasWorldCopy = 'v621';
    }
    return true;
  }

  listen(target,type,handler,options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? { ...options,signal } : options);
  }

  isActive() {
    return this.route === 'consultations' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('consultations') || null;
    const nextApp = this.documentTarget?.getElementById?.('consultationApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.app?.dataset) {
      this.app.dataset.consultasWorld = 'v621';
      this.app.dataset.consultasUniverse = 'templo-do-encontro';
      this.app.dataset.consultasWorldPhase = this.phase;
      this.app.dataset.consultasWorldPrivacy = 'question-contact-protocol-unread';
    }
    return this.app;
  }

  phaseFromPublicState() {
    if (!this.isActive()) return 'rest';
    const candidates = [
      this.screen?.dataset?.v608CommerceMode,
      this.screen?.dataset?.db596ChamberMode,
      this.screen?.dataset?.db596ChamberState,
      this.app?.dataset?.consultationState,
      this.app?.dataset?.consultationPhase
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
    if (this.screen?.dataset) this.screen.dataset.consultasWorldPhase = phase;
    if (this.app?.dataset) this.app.dataset.consultasWorldPhase = phase;
    emit(this.documentTarget,'divina:consultas-world-v621-state',{
      version:VERSION,
      universe:'templo-do-encontro',
      route:this.route,
      phase,
      reason:String(reason || 'state').slice(0,64),
      privateContentIncluded:false,
      oneOrb:true,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      realBilling:false
    });
    return phase;
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'consultations';
    if (this.screen?.dataset) this.screen.dataset.consultasWorldPresence = active ? 'present' : 'away';
    return this.setPhase(active ? this.phaseFromPublicState() : 'rest',reason);
  }

  observePublicSignal(event, fallback = '') {
    this.publicSignals += 1;
    if (!this.isActive()) return false;
    const detail = event?.detail || {};
    if (detail.route && normalizeRoute(detail.route) !== 'consultations') return false;
    const phase = phaseFromSignal(detail.state || detail.phase || detail.mode || fallback);
    if (!phase) return false;
    if (phase === 'choices') this.choiceSignals += 1;
    if (phase === 'handoff') this.handoffSignals += 1;
    if (phase === 'protocol') this.protocolSignals += 1;
    return Boolean(this.setPhase(phase,`public-${event?.type || 'signal'}`));
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;

    this.listen(doc,'divina:living-commerce-ready',event => this.observePublicSignal(event,'invitation'));
    this.listen(doc,'divina:living-commerce-state',event => this.observePublicSignal(event,'invitation'));
    this.listen(doc,'divina:reality-chamber-state',event => this.observePublicSignal(event,'threshold'));
    this.listen(doc,'divina:consultations-world-ready',event => this.observePublicSignal(event,'invitation'));
    this.listen(doc,'divina:consultation-state',event => this.observePublicSignal(event,'request'));
    this.listen(doc,'divina:consultation-request-state',event => this.observePublicSignal(event,'request'));
    this.listen(doc,'divina:consultation-protocol-state',event => this.observePublicSignal(event,'protocol'));

    this.listen(doc,'click',event => {
      if (!this.isActive()) return;
      const target = event.target?.closest?.('button,a,summary');
      if (!target) return;
      if (target.matches?.('[data-v608-action="consultations-start"]')) {
        this.choiceSignals += 1;
        this.setPhase('choices','explicit-intention');
        return;
      }
      if (target.matches?.('#consultationApp [data-service],[data-service]')) {
        this.choiceSignals += 1;
        this.setPhase('request','explicit-service');
        return;
      }
      if (target.matches?.('[data-back-services],[data-change-service]')) {
        this.setPhase('choices','explicit-return-services');
        return;
      }
      if (target.matches?.('[data-open-tracking],[data-toggle-tracking],[data-v608-action="consultations-track"]')) {
        this.protocolSignals += 1;
        this.setPhase('protocol','explicit-protocol');
        return;
      }
      if (target.matches?.('[data-consultation-review],[data-review-request]')) this.setPhase('review','explicit-review');
    },{ capture:true });

    this.listen(doc,'focusin',event => {
      if (!this.isActive() || !this.app?.contains?.(event.target)) return;
      if (!event.target?.matches?.('input,select,textarea,[contenteditable="true"]')) return;
      this.setPhase('details','explicit-field-focus');
    },{ capture:true });

    this.listen(doc,'submit',event => {
      if (!this.isActive() || !this.app?.contains?.(event.target)) return;
      this.handoffSignals += 1;
      this.setPhase('handoff','explicit-submit');
    },{ capture:true });

    this.listen(doc,'divina:menu-state',event => {
      const state = String(event?.detail?.state || 'closed').toLowerCase();
      if (state !== 'closed' && this.route === 'consultations') this.setPhase('portal','menu-open');
      else if (this.route === 'consultations') this.sync('menu-closed');
    });

    this.listen(doc,'divina:route-start',event => {
      const target = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || this.route);
      if (this.route === 'consultations' || target === 'consultations') this.setPhase('travel','route-start');
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
      consultationsScreenPresent:Boolean(this.screen),
      consultationAppPresent:Boolean(this.app),
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0,canonicalOrbs - 1),
      existingConsultationBodyReused:true,
      separateConsultationBody:false,
      servicesPreserved:4,
      servicePricesCentsPreserved:Object.freeze([25000,20000,15000,5000]),
      priceSnapshotPreserved:true,
      emailRequired:true,
      phoneRequired:true,
      whatsappRequired:false,
      realBilling:false,
      automaticEmail:false,
      privateContentReads:0,
      formValueReads:0,
      questionReads:0,
      contactReads:0,
      protocolReads:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      work14:false
    });
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      universe:'templo-do-encontro',
      route:this.route,
      phase:this.phase,
      publicSignals:this.publicSignals,
      choiceSignals:this.choiceSignals,
      handoffSignals:this.handoffSignals,
      protocolSignals:this.protocolSignals,
      attachments:this.attachments,
      privateContentIncluded:false,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      realBilling:false,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...CONSULTAS_WORLD_CONTRACT_V621,
      ...this.publicStatus(),
      livingCommerce:safeStatus(this.livingCommerce),
      chambers:safeStatus(this.chambers),
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.app?.dataset) {
      delete this.app.dataset.consultasWorld;
      delete this.app.dataset.consultasUniverse;
      delete this.app.dataset.consultasWorldPhase;
      delete this.app.dataset.consultasWorldPrivacy;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.consultasWorld;
      delete this.screen.dataset.consultasUniverse;
      delete this.screen.dataset.consultasWorldPhase;
      delete this.screen.dataset.consultasWorldPresence;
      delete this.screen.dataset.consultasWorldSequence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13ConsultasWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaConsultasWorldV621 === this) delete globalThis.divinaConsultasWorldV621;
    return true;
  }
}

export function createConsultasWorldV621(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new ConsultasWorldV621(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaConsultasWorldV621 = world;
  return world;
}

export default createConsultasWorldV621;
