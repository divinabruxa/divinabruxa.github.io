/* DIVINA BRUXA — WORK13 · CARTA DO DIA · SANTUARIO DA AURORA · V616
   Uma camada de mundo sobre as autoridades V554, V595, V604 e a alma V610.
   Nao sorteia, interpreta, persiste ou navega. Acompanha o rito existente,
   acende o horizonte no toque e devolve silencio depois da resposta. */

const VERSION = 616;
const STYLE_ID = 'divinaCartaDoDiaWorldV616';
const STYLE_HREF = './carta-do-dia-world-v616.css?v=616-santuario-da-aurora';
const INSTANCE = Symbol.for('divina.work13.carta.do.dia.world.v616');
const PHASES = new Set(['origin','answering','symbol','silence','essence','depth','travel','rest']);

export const CARTA_DO_DIA_WORLD_CONTRACT_V616 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'daily',
  universe:'santuario-da-aurora',
  identity:'indigo-horizon-gold-coral',
  sequence:Object.freeze(['arrival','orb','touch','card','silence','one-sentence-essence','depth-on-explicit-request']),
  dailyAuthority:'V554-preserved',
  ritualAuthority:'V595-preserved',
  cosmicReadingAuthority:'V604-preserved',
  soulAuthority:'V610-preserved',
  cardsPerBrasiliaDay:1,
  timeZone:'America/Sao_Paulo',
  normalCardsOnly:true,
  accountContinuityPreserved:true,
  crossDeviceContinuityPreserved:true,
  maximumEssenceSentences:1,
  depthRequiresExplicitGesture:true,
  canonicalOrbAction:'reveal-daily-card',
  pentagramMenuPreserved:true,
  reusesCanonicalOrb:true,
  cardSelectionChanges:0,
  dailyPolicyChanges:0,
  meaningChanges:0,
  persistenceChanges:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  newVisibleDomNodes:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  deferredTimers:0,
  networkCalls:0,
  storageReads:0,
  storageWrites:0,
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
  const phase = String(value || 'rest').trim().toLowerCase();
  if (phase === 'answering') return 'answering';
  return PHASES.has(phase) ? phase : 'rest';
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class CartaDoDiaWorldV616 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis,
    orbCore = null
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.orbCore = orbCore || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('daily') || null;
    this.orb = this.documentTarget?.getElementById?.('orb') || null;
    this.world = null;
    this.orbHost = null;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.phase = 'rest';
    this.responses = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget, 'divina:daily-world-v616-ready', this.status());
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
    if (this.root?.dataset) this.root.dataset.work13DailyWorld = 'v616';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.dailyWorld = 'v616';
    this.screen.dataset.dailyWorldPhase = 'rest';
    this.screen.dataset.dailyWorldPresence = 'away';
    return true;
  }

  listen(target, type, handler, options = {}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type, handler, signal ? { ...options, signal } : options);
  }

  attach() {
    const world = this.documentTarget?.querySelector?.('#dailyCard .dw509') || null;
    if (!world) return null;
    if (world !== this.world) {
      this.world = world;
      this.orbHost = world.querySelector?.('[data-daily-orb-host]') || null;
      this.attachments += 1;
    }
    world.dataset.dailyWorld = 'v616';
    world.dataset.dailyUniverse = 'santuario-da-aurora';
    world.dataset.dailyWorldPhase = this.phase;
    world.dataset.dailyWorldSequence = 'arrival-orb-touch-card-silence-essence-depth';
    const eyebrow = world.querySelector?.('.dw509__head span');
    if (eyebrow && eyebrow.dataset.dailyWorldCopy !== 'v616') {
      eyebrow.textContent = 'SANTUÁRIO DA AURORA';
      eyebrow.dataset.dailyWorldCopy = 'v616';
    }
    return world;
  }

  isActive() {
    return this.route === 'daily' && this.screen?.classList?.contains?.('active') !== false;
  }

  ownsOrb() {
    return Boolean(this.isActive() && this.orb && this.orbHost?.contains?.(this.orb));
  }

  setPhase(value, reason = 'sync') {
    const phase = normalizePhase(value);
    this.phase = phase;
    if (this.screen?.dataset) this.screen.dataset.dailyWorldPhase = phase;
    if (this.world?.dataset) this.world.dataset.dailyWorldPhase = phase;
    emit(this.documentTarget, 'divina:daily-world-v616-state', {
      version:VERSION,
      universe:'santuario-da-aurora',
      route:this.route,
      phase,
      reason,
      revealed:this.world?.dataset?.state === 'revealed',
      oneOrb:true,
      automaticNavigation:false
    });
    return phase;
  }

  answer(source = 'touch') {
    if (!this.ownsOrb()) return false;
    this.responses += 1;
    this.setPhase('answering', source);
    this.orbCore?.pulse?.('daily-aurora-answer', { intensity:.42 });
    return true;
  }

  release(source = 'release') {
    if (!this.isActive()) return false;
    if (this.world?.classList?.contains?.('is-opening')) return this.setPhase('symbol', source);
    if (this.world?.dataset?.state === 'revealed') {
      const phase = normalizePhase(this.world.dataset?.readingPhase);
      return this.setPhase(phase === 'rest' ? 'silence' : phase, source);
    }
    return this.setPhase('origin', source);
  }

  sync(reason = 'sync') {
    this.attach();
    const active = this.route === 'daily';
    if (this.screen?.dataset) this.screen.dataset.dailyWorldPresence = active ? 'present' : 'away';
    if (!active) return this.setPhase('rest', reason);
    if (!this.world || this.world.dataset?.state !== 'revealed') {
      return this.setPhase(this.world?.classList?.contains?.('is-opening') ? 'symbol' : 'origin', reason);
    }
    const phase = normalizePhase(this.world.dataset?.readingPhase);
    return this.setPhase(phase === 'rest' ? 'silence' : phase, reason);
  }

  bind() {
    this.listen(this.orb, 'pointerdown', () => this.answer('touch'), { passive:true });
    this.listen(this.orb, 'pointerup', () => this.release('release'), { passive:true });
    this.listen(this.orb, 'pointercancel', () => this.release('cancel'), { passive:true });
    this.listen(this.orb, 'click', event => {
      if (this.ownsOrb() && Number(event?.detail || 0) === 0 && this.phase !== 'answering') this.answer('keyboard');
    });

    this.listen(this.documentTarget, 'divina:reading-ritual-phase', event => {
      if (event?.detail?.kind !== 'daily' || !this.isActive()) return;
      this.attach();
      this.setPhase(event.detail.phase, 'reading-ritual');
    });
    this.listen(this.documentTarget, 'divina:cosmic-daily-reading-updated', event => {
      if (!this.isActive()) return;
      this.setPhase(event?.detail?.phase, 'cosmic-reading');
    });
    this.listen(this.windowTarget, 'divina:daily-v509-ready', () => this.sync('daily-ready'));
    this.listen(this.windowTarget, 'divina:daily-v554-ready', () => this.sync('daily-ready'));
    this.listen(this.windowTarget, 'divina:daily-v561-revealed', () => {
      this.attach();
      if (this.isActive()) this.setPhase('symbol', 'card-revealed');
    });

    const onRoute = event => {
      this.route = normalizeRoute(
        event?.detail?.id || event?.detail?.route || event?.detail?.to
        || routeNow(this.documentTarget, this.windowTarget)
      );
      this.sync('route');
    };
    this.listen(this.documentTarget, 'divina:route-ready', onRoute);
    this.listen(this.documentTarget, 'divina:page-ready', onRoute);
    this.listen(this.documentTarget, 'divina:supreme-orb-did-navigate', onRoute);
    this.listen(this.windowTarget, 'hashchange', () => {
      this.route = routeNow(this.documentTarget, this.windowTarget);
      this.sync('hashchange');
    }, { passive:true });
    this.listen(this.windowTarget, 'pageshow', () => {
      this.route = routeNow(this.documentTarget, this.windowTarget);
      this.sync('pageshow');
    }, { passive:true });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length || 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length || 0;
    return Object.freeze({
      dailyScreenPresent:Boolean(this.screen),
      dailyWorldAttached:Boolean(this.world),
      dailyOrbHostPresent:Boolean(this.orbHost),
      dailyRule:this.world?.dataset?.dailyRule || 'one-per-brasilia-day',
      orientation:this.world?.dataset?.orientation || 'normal',
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      duplicateOrbs:Math.max(0, canonicalOrbs - 1),
      cardsPerBrasiliaDay:1,
      timeZone:'America/Sao_Paulo',
      reversedCards:false,
      cardSelectionChanges:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      work14:false
    });
  }

  status() {
    return Object.freeze({
      ...CARTA_DO_DIA_WORLD_CONTRACT_V616,
      route:this.route,
      phase:this.phase,
      responses:this.responses,
      attachments:this.attachments,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.world?.dataset) {
      delete this.world.dataset.dailyWorld;
      delete this.world.dataset.dailyUniverse;
      delete this.world.dataset.dailyWorldPhase;
      delete this.world.dataset.dailyWorldSequence;
    }
    if (this.screen?.dataset) {
      delete this.screen.dataset.dailyWorld;
      delete this.screen.dataset.dailyWorldPhase;
      delete this.screen.dataset.dailyWorldPresence;
    }
    if (this.root?.dataset) delete this.root.dataset.work13DailyWorld;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createCartaDoDiaWorldV616(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const world = new CartaDoDiaWorldV616(options);
  globalThis[INSTANCE] = world;
  globalThis.divinaCartaDoDiaWorldV616 = world;
  return world;
}

export default createCartaDoDiaWorldV616;
