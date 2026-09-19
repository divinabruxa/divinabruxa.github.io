/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 4 · V604
   A Carta do Dia recebe a camada que faltava entre o silencio e o mergulho:
   uma unica frase retirada da essencia editorial aprovada da propria carta.

   Este nucleo nao sorteia, interpreta, persiste ou transmite nada. Ele nao le
   intencao, pergunta ou identidade da carta; apenas apresenta a primeira frase
   do significado que o motor diario ja resolveu, depois do rito V595 autorizar
   a fase de essencia. A profundidade continua pertencendo ao gesto existente. */

const VERSION = 604;
const INSTANCE = Symbol.for('divina.work13.cosmic.daily.reading.v604');
const DAILY_PHASES = new Set(['rest','symbol','silence','essence','depth','travel']);

export const COSMIC_DAILY_READING_CONTRACT_V604 = Object.freeze({
  version:VERSION,
  base:'V603-reality-resonance-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'4-of-10',
  title:'Leitura Cosmica em Camadas — Carta do Dia',
  law:'one-orb-one-universe-one-presence-one-journey',
  route:'daily',
  sequence:Object.freeze(['card','silence','one-sentence-essence','depth-on-explicit-request']),
  ritualAuthority:'WORK12-V595',
  dailyAuthority:'V554',
  editorialAuthority:'daily-meaning-runtime-v183',
  essenceSource:'approved-essence-first-sentence',
  maximumEssenceSentences:1,
  maximumVisibleDepthIntentions:1,
  depthControlReused:true,
  depthRequiresExplicitGesture:true,
  changesCardSelection:false,
  changesDailyPersistence:false,
  changesBrasiliaCycle:false,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitRole:'silent-timing-only',
  privateContentReads:0,
  intentionReads:0,
  questionReads:0,
  journalBodyReads:0,
  cardIdentityReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newDomNodesMaximum:1,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  clickListeners:0,
  inputListeners:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const clean = (value, limit = 720) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizePhase = value => {
  const phase = clean(value, 24).toLowerCase();
  return DAILY_PHASES.has(phase) ? phase : 'rest';
};

const normalizeRoute = value => clean(value, 48)
  .toLowerCase()
  .replace(/^#/,'')
  .split(/[?&/]/)[0];

export const essenceSentenceV604 = value => {
  const editorial = clean(value);
  if (!editorial) return '';
  const sentence = editorial.match(/^.*?[.!?](?=\s|$)/u)?.[0] || editorial;
  return clean(sentence, 240);
};

const dispatch = (target, type, detail) => {
  const EventCtor = target?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!target?.dispatchEvent || typeof EventCtor !== 'function') return false;
  target.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class CosmicDailyReadingV604 {
  constructor({
    ritual = globalThis.divinaReadingRitualV595,
    dailyProvider = () => globalThis.divinaDailyWorldV509,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.ritual = ritual || null;
    this.dailyProvider = typeof dailyProvider === 'function' ? dailyProvider : () => null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.world = null;
    this.essenceNode = null;
    this.meaningRef = null;
    this.sentence = '';
    this.phase = 'rest';
    this.lastReason = 'boot';
    this.lastSignature = '';
    this.attachments = 0;
    this.phaseUpdates = 0;
    this.essenceReveals = 0;
    this.depthRequests = 0;
    this.editorialReads = 0;
    this.eventsEmitted = 0;
    this.destroyed = false;

    this.installIdentity();
    this.bind();
    this.render('boot');
    dispatch(this.documentTarget, 'divina:cosmic-daily-reading-ready', this.status());
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13 = 'cosmos-vivo';
    this.root.dataset.work13Macro = '4-layered-daily-reading';
    this.root.dataset.cosmicDailyReading = 'v604';
    this.root.dataset.cosmicDailyReadingPrivacy = 'approved-editorial-only';
    this.root.dataset.cosmicDailyReadingWhit = 'silent';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'divina:reading-ritual-phase', event => this.onRitualPhase(event));
    this.listen(doc, 'divina:page-ready', event => this.onPageReady(event));
    this.listen(win, 'divina:daily-v509-ready', () => this.render('daily-ready'));
    this.listen(win, 'divina:daily-v554-ready', () => this.render('daily-ready'));
    this.listen(win, 'divina:daily-v561-revealed', () => this.render('daily-revealed'));
    this.listen(win, 'pageshow', () => this.render('pageshow'));
  }

  resolveWorld() {
    return this.documentTarget?.querySelector?.('#dailyCard .dw509') || null;
  }

  attach() {
    const world = this.resolveWorld();
    if (!world) return null;
    if (world === this.world && this.essenceNode?.isConnected === true) return world;

    this.world = world;
    this.meaningRef = null;
    this.sentence = '';
    let node = world.querySelector?.('[data-cosmic-daily-essence="v604"]') || null;
    if (!node) {
      const identity = world.querySelector?.('[data-daily-identity]');
      if (!identity || !this.documentTarget?.createElement) return null;
      node = this.documentTarget.createElement('p');
      node.id = 'db604DailyEssence';
      node.className = 'db604-daily-essence';
      node.dataset.cosmicDailyEssence = 'v604';
      node.hidden = true;
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'true');
      node.setAttribute('aria-hidden', 'true');
      identity.insertAdjacentElement?.('afterend', node);
    }
    this.essenceNode = node;
    world.dataset.cosmicReading = 'v604';
    world.dataset.cosmicReadingSequence = 'card-silence-essence-depth';
    this.attachments += 1;
    return world;
  }

  currentDaily() {
    try {
      const daily = this.dailyProvider();
      return daily?.world === this.world ? daily : null;
    } catch {
      return null;
    }
  }

  resolveSentence() {
    const meaning = this.currentDaily()?.currentMeaning || null;
    if (!meaning || typeof meaning !== 'object') return '';
    if (meaning === this.meaningRef) return this.sentence;
    this.meaningRef = meaning;
    this.editorialReads += 1;
    this.sentence = essenceSentenceV604(meaning.essence);
    return this.sentence;
  }

  syncDepthControl(phase, sentenceVisible) {
    const button = this.world?.querySelector?.('[data-reading-depth-call="daily"]');
    if (!button) return false;
    button.dataset.cosmicDepthCall = 'v604';
    if (phase === 'essence') {
      button.textContent = 'Aprofundar';
      button.setAttribute('aria-label', 'Aprofundar a Carta do Dia');
      if (sentenceVisible) button.setAttribute('aria-describedby', 'db604DailyEssence');
      else button.removeAttribute?.('aria-describedby');
    } else if (phase === 'depth') {
      button.textContent = 'Recolher';
      button.setAttribute('aria-label', 'Recolher as camadas da Carta do Dia');
      button.removeAttribute?.('aria-describedby');
    } else {
      button.removeAttribute?.('aria-describedby');
    }
    return true;
  }

  hideEssence({ clear = false } = {}) {
    if (!this.essenceNode) return false;
    this.essenceNode.hidden = true;
    this.essenceNode.setAttribute('aria-hidden', 'true');
    if (clear) {
      this.essenceNode.textContent = '';
      this.meaningRef = null;
      this.sentence = '';
    }
    return true;
  }

  render(reason = 'sync') {
    if (this.destroyed) return false;
    const world = this.attach();
    if (!world || !this.essenceNode) return false;
    const phase = normalizePhase(world.dataset.readingPhase || this.phase);
    const revealed = world.dataset.state === 'revealed' || world.classList?.contains?.('is-revealed');
    const allowed = revealed && (phase === 'essence' || phase === 'depth');
    let sentence = '';
    let visible = false;

    if (allowed) {
      sentence = this.resolveSentence();
      if (sentence) {
        const wasHidden = this.essenceNode.hidden;
        this.essenceNode.textContent = sentence;
        this.essenceNode.hidden = false;
        this.essenceNode.setAttribute('aria-hidden', 'false');
        visible = true;
        if (wasHidden && phase === 'essence') this.essenceReveals += 1;
      } else {
        this.hideEssence();
      }
    } else {
      this.hideEssence({ clear:!revealed });
    }

    this.phase = phase;
    this.lastReason = clean(reason, 40) || 'sync';
    world.dataset.cosmicReadingLayer = visible ? phase : phase === 'silence' ? 'silence' : 'card';
    this.syncDepthControl(phase, visible);
    const signature = [world.dataset.state || 'sealed',phase,visible ? 'visible' : 'hidden',this.editorialReads].join('|');
    if (signature !== this.lastSignature) {
      this.lastSignature = signature;
      this.eventsEmitted += 1;
      dispatch(this.documentTarget, 'divina:cosmic-daily-reading-updated', {
        version:VERSION,
        route:'daily',
        phase,
        layer:world.dataset.cosmicReadingLayer,
        essenceVisible:visible,
        essenceSentences:visible ? 1 : 0,
        depthRequiresExplicitGesture:true,
        automaticWhitSpeech:false,
        reason:this.lastReason
      });
    }
    return visible;
  }

  onRitualPhase(event) {
    if (event?.detail?.kind !== 'daily') return false;
    const next = normalizePhase(event.detail.phase);
    if (next === 'depth' && this.phase !== 'depth') this.depthRequests += 1;
    this.phase = next;
    this.phaseUpdates += 1;
    return this.render('ritual-phase');
  }

  onPageReady(event) {
    if (normalizeRoute(event?.detail?.id || event?.detail?.route) !== 'daily') return false;
    return this.render('page-ready');
  }

  snapshot() {
    return Object.freeze({
      version:VERSION,
      route:'daily',
      phase:this.phase,
      layer:this.world?.dataset?.cosmicReadingLayer || 'card',
      attached:Boolean(this.world && this.essenceNode),
      essenceReady:Boolean(this.sentence),
      essenceVisible:Boolean(this.essenceNode && !this.essenceNode.hidden),
      essenceSentences:this.essenceNode && !this.essenceNode.hidden ? 1 : 0,
      depthControlReused:Boolean(this.world?.querySelector?.('[data-reading-depth-call="daily"]')),
      lastReason:this.lastReason
    });
  }

  audit() {
    const doc = this.documentTarget;
    const nodes = doc?.querySelectorAll?.('[data-cosmic-daily-essence="v604"]')?.length || 0;
    return Object.freeze({
      release:'V604',
      dailyEssenceNodes:nodes,
      maximumDailyEssenceNodes:1,
      oneSentenceEssence:true,
      approvedEditorialReads:this.editorialReads,
      cardSelectionReads:0,
      cardIdentityReads:0,
      privateContentReads:0,
      intentionReads:0,
      questionReads:0,
      journalBodyReads:0,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      modelCalls:0,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      deferredTimers:0,
      mutationObservers:0,
      clickListeners:0,
      inputListeners:0
    });
  }

  status() {
    return Object.freeze({
      ...COSMIC_DAILY_READING_CONTRACT_V604,
      reading:this.snapshot(),
      attachments:this.attachments,
      phaseUpdates:this.phaseUpdates,
      essenceReveals:this.essenceReveals,
      depthRequests:this.depthRequests,
      editorialReads:this.editorialReads,
      eventsEmitted:this.eventsEmitted,
      destroyed:this.destroyed,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    const button = this.world?.querySelector?.('[data-reading-depth-call="daily"]');
    if (button?.dataset?.cosmicDepthCall === 'v604') {
      delete button.dataset.cosmicDepthCall;
      button.textContent = this.phase === 'depth' ? 'Recolher' : 'Mergulhar';
      button.setAttribute('aria-label', 'Mergulhar nas camadas da Carta do Dia');
      button.removeAttribute?.('aria-describedby');
    }
    this.essenceNode?.remove?.();
    if (this.world?.dataset?.cosmicReading === 'v604') {
      delete this.world.dataset.cosmicReading;
      delete this.world.dataset.cosmicReadingSequence;
      delete this.world.dataset.cosmicReadingLayer;
    }
    if (this.root?.dataset?.cosmicDailyReading === 'v604') {
      [
        'cosmicDailyReading','cosmicDailyReadingPrivacy','cosmicDailyReadingWhit'
      ].forEach(key => delete this.root.dataset[key]);
    }
    try { if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE]; } catch {}
    return true;
  }
}

export function createCosmicDailyReadingV604(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const reading = new CosmicDailyReadingV604(options);
  globalThis[INSTANCE] = reading;
  globalThis.divinaCosmicDailyReadingV604 = reading;
  return reading;
}

export default createCosmicDailyReadingV604;
