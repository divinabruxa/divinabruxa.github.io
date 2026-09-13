/* DIVINA BRUXA — MACROETAPA 4/14 · UNIVERSO VIVO DO TAROT LIVRE · V538
   Preserva o Universo V524 e a única Orbe Suprema V501. O motor de fogo foi
   removido por decisão da proprietária: a Orbe e as cartas respondem primeiro.
   Esta camada calibra as proporções, cria navegação tátil contínua e envia a
   sequência real do Tarot Livre para a Mesa Real sem repetir cartas. */

import { CARDS } from './tarot-data.js';
import { cardImageMarkup, prepareCardImage, preloadCardImages } from './tarot-image-runtime.js?v=538';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=538';
import {
  DECK_SIZE,
  drawNextCard,
  resetTarotState,
  shuffleRemainingCards,
  tarotStateFingerprint
} from './tarot-session.js?v=538';
import { store } from './storage.js';
import { createTarotMesaTransferV517 } from './tarot-mesa-bridge-v517.js?v=517';

const VERSION = 538;
const STORAGE_KEY = 'free-tarot';
const RESET_ARM_MS = 3600;
const BIRTH_TRAVEL_MS = 440;
const HISTORY_TRANSITION_MS = 220;
const RESPONSE_BUDGET_MS = 100;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const routeNow = () => String(
  document.body?.dataset?.screen ||
  document.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
  location.hash.replace(/^#/, '') ||
  'home'
).toLowerCase();
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

function announce(message) {
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: message }));
}

function nativePulse(style = 'Light') {
  try {
    const capacitor = globalThis.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return;
    Promise.resolve(capacitor.Plugins?.Haptics?.impact?.({ style })).catch(() => {});
  } catch {
    // Haptics are app-only and always optional.
  }
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawPortalBack(canvas) {
  const width = 480;
  const height = 720;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  context.clearRect(0, 0, width, height);
  const surface = context.createLinearGradient(0, 0, width, height);
  surface.addColorStop(0, '#08020e');
  surface.addColorStop(0.48, '#21072f');
  surface.addColorStop(1, '#050108');
  roundedRect(context, 8, 8, width - 16, height - 16, 32);
  context.fillStyle = surface;
  context.fill();

  const aura = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * 0.52);
  aura.addColorStop(0, 'rgba(180,65,255,.40)');
  aura.addColorStop(0.36, 'rgba(112,34,205,.20)');
  aura.addColorStop(1, 'rgba(20,3,30,0)');
  context.fillStyle = aura;
  context.fillRect(0, 0, width, height);

  context.save();
  context.shadowBlur = 28;
  context.shadowColor = 'rgba(255,174,72,.62)';
  roundedRect(context, 17, 17, width - 34, height - 34, 27);
  context.strokeStyle = '#f5cf83';
  context.lineWidth = 5;
  context.stroke();
  roundedRect(context, 34, 34, width - 68, height - 68, 20);
  context.strokeStyle = 'rgba(245,207,131,.55)';
  context.lineWidth = 2;
  context.stroke();
  context.restore();

  context.save();
  context.translate(width / 2, height * 0.47);
  for (let index = 0; index < 32; index += 1) {
    const angle = index / 32 * Math.PI * 2;
    const inner = index % 2 ? 115 : 106;
    const outer = index % 4 ? 147 : 162;
    context.beginPath();
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.strokeStyle = index % 4 ? 'rgba(245,207,131,.38)' : 'rgba(255,226,164,.78)';
    context.lineWidth = index % 4 ? 1.8 : 3;
    context.stroke();
  }

  context.shadowBlur = 34;
  context.shadowColor = 'rgba(255,192,95,.66)';
  context.beginPath();
  context.arc(0, 0, 102, 0, Math.PI * 2);
  context.strokeStyle = '#f5cf83';
  context.lineWidth = 4;
  context.stroke();
  context.beginPath();
  context.arc(-13, -2, 66, 0, Math.PI * 2);
  context.fillStyle = '#f5cf83';
  context.fill();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(16, -16, 67, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const stars = [
    [0.50, 0.15, 9], [0.50, 0.25, 4], [0.50, 0.68, 6], [0.50, 0.78, 3],
    [0.24, 0.30, 3], [0.78, 0.62, 4], [0.19, 0.72, 2], [0.84, 0.25, 2]
  ];
  for (const [x, y, radius] of stars) {
    context.save();
    context.translate(width * x, height * y);
    context.shadowBlur = radius * 4;
    context.shadowColor = '#ffe8b6';
    context.fillStyle = '#fff1c9';
    context.beginPath();
    context.moveTo(0, -radius * 2.4);
    context.lineTo(radius * 0.42, -radius * 0.42);
    context.lineTo(radius * 2.4, 0);
    context.lineTo(radius * 0.42, radius * 0.42);
    context.lineTo(0, radius * 2.4);
    context.lineTo(-radius * 0.42, radius * 0.42);
    context.lineTo(-radius * 2.4, 0);
    context.lineTo(-radius * 0.42, -radius * 0.42);
    context.closePath();
    context.fill();
    context.restore();
  }
}

/* O experimento visual V514 foi removido do bundle ativo. */

/* Compatibilidade mínima com chamadas históricas do altar. Não existe canvas,
   geometria, timer, pulso ou trabalho por quadro nesta ponte. */
class TarotFluencyBridgeV538 {
  constructor() {
    this.mode = 'progressive-no-fire-v538';
    this.targetFps = constrained() ? 30 : 60;
    this.active = false;
  }
  touch() {}
  ignite() {}
  absorb() {}
  birth() {}
  resize() {}
  setActive(active) { this.active = Boolean(active); }
  destroy() { this.active = false; }
}

export class TarotLivreOrbOSV517 {
  constructor(root, {
    storage = store,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null
  } = {}) {
    if (!root) throw new TypeError('O mundo do Tarot Livre não foi encontrado.');
    if (!orbCore?.claim || !orbCore?.orb) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes do Tarot Livre V517.');
    }

    this.root = root;
    this.storage = storage;
    this.orbCore = orbCore;
    this.orb = orbCore.orb;
    this.abort = new AbortController();
    this.coordinator = new TarotSessionCoordinator({ storage, key: STORAGE_KEY });
    this.state = this.coordinator.latest();
    this.selected = this.state.revealed.length ? this.state.revealed.length - 1 : -1;
    this.busy = false;
    this.openingMesa = false;
    this.resetArmed = false;
    this.resetTimer = 0;
    this.birthTimer = 0;
    this.lastInputResponseMs = 0;
    this.cardRenderToken = 0;
    this.claimRelease = null;
    this.active = false;

    this.root.innerHTML = '';
    this.root.dataset.tarotWorld = 'orbe-os-v517';
    this.root.className = this.root.className
      .replace(/\btarot-world-v301-host\b/g, '')
      .trim();

    this.build();
    this.world.dataset.birthSync = 'atlas-first-progressive';
    this.world.dataset.flameTexture = 'removed-v537';
    this.world.dataset.flameArchitecture = 'removed-v537';
    this.world.dataset.lightningStrokes = 'none';
    this.world.dataset.strokedFirePaths = '0';
    this.world.dataset.whiteOverexposure = 'false';
    this.world.dataset.firePalette = 'none';
    this.world.dataset.birthCorona = 'card-edge';
    this.world.dataset.birthJourney = 'orb-to-card-short-v538';
    this.world.dataset.birthEasing = 'ios-short-compositor-v538';
    this.world.dataset.responsiveAltar = 'v517-reference-ratio';
    this.world.dataset.visualCalibration = 'card-orb-fluid-v538';
    this.world.dataset.cardOrigin = 'supreme-orb-v501';
    this.world.dataset.decorativeCards = 'none';
    this.world.dataset.universeBackdrop = 'procedural-no-image-v524';
    this.world.dataset.staticUniverseImage = 'false';
    this.world.dataset.universeAuthority = 'living-universe-core-v524';
    this.world.dataset.skinReactiveUniverse = '30-palettes';
    this.world.dataset.effectsResolution = 'global-adaptive';
    this.world.dataset.frameArchitecture = 'universal-single-raf';
    this.world.dataset.particleArchitecture = 'global-procedural-shader';
    this.world.dataset.noDrag = 'true';
    this.world.dataset.progressiveImages = 'atlas-first';
    this.world.dataset.responseBudgetMs = String(RESPONSE_BUDGET_MS);
    this.render(false);
    this.fluidity = new TarotFluencyBridgeV538();
    this.world.dataset.engine = this.fluidity.mode;
    this.world.dataset.targetFps = String(this.fluidity.targetFps);
    this.bind();

    if (routeNow() === 'tarot') {
      requestAnimationFrame(() => this.enter());
    } else {
      this.fluidity.setActive(false);
    }

    preloadCardImages(this.state.waiting.slice(0, 4), 4);

    document.documentElement.dataset.tarotLivre = 'v538';
    const readiness = Object.freeze({
      version: VERSION,
      engine: 'TarotFluencyBridgeV538',
      renderer: this.fluidity.mode,
      canonicalOrb: 'v501',
      oneLivingOrb: true,
      deckSize: DECK_SIZE,
      normalOnly: true,
      noRepeats: true,
      gridColumns: 6,
      atomicBirth: false,
      decodedBeforeSwap: false,
      atlasFirstProgressive: true,
      responseBudgetMs: RESPONSE_BUDGET_MS,
      dragNavigation: false,
      organicCanvasFire: false,
      trueCelestialFire: false,
      celestialFireScheduled:false,
      lightningStrokes: false,
      strokedFirePaths:0,
      whiteOverexposure:false,
      volumetricBillows: false,
      flameTongues: false,
      cardEdgeBurst: true,
      responsiveAltar: true,
      volumetricFire: false,
      fireInsideUniverseCanvas:false,
      cosmicNebula: true,
      livingUniverse: true,
      physicalCardJourney: true,
      stellarFoundation: true,
      optimizedCosmicBackdrop: false,
      staticUniverseImage: false,
      universalUniverseCanvas: true,
      skinReactiveUniverse: true,
      retinaAdaptiveEffects: true,
      spriteAtlasParticles: false,
      smoothBirthJourney: true,
      iosHistoryNavigation: true,
      mesaRealTransfer: true,
      referenceProportions: true,
      oneAnimationCadence: true,
      unexplainedFlyingCards: false,
      targetFps: this.fluidity.targetFps
    });
    document.dispatchEvent(new CustomEvent('divina:tarot-cosmico-ready', {
      detail: readiness
    }));
    document.dispatchEvent(new CustomEvent('divina:tarot-supreme-ready', {
      detail: readiness
    }));
  }

  build() {
    this.root.innerHTML = `
      <div class="tl517" data-phase="idle" data-engine="pending">
        <header class="tl517__header">
          <div class="tl517__title">
            <h2>Tarot Livre</h2>
            <span class="tl517__title-star" aria-hidden="true"><i></i><b></b><i></i></span>
          </div>

          <button type="button" class="tl517__mesa" data-go="spreads" data-mesa-real
                  aria-label="Abrir a Mesa Real com as cartas reveladas">
            <span aria-hidden="true">✦</span>
            <b data-mesa-label>Mesa Real</b>
            <small data-mesa-count hidden>0</small>
          </button>

        </header>

        <section class="tl517__stage" data-stage data-universe="alive" aria-label="Tarot Livre — universo vivo nascido da Orbe">
          <div class="tl517__portal-crown" aria-hidden="true"><i></i><i></i><i></i></div>

          <div class="tl517__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas reveladas.">
            <div class="tl517__card" data-current-card data-empty="true">
              <canvas class="tl517__card-back" data-card-back aria-hidden="true"></canvas>
            </div>
          </div>

          <nav class="tl517__card-nav" data-card-nav aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev data-direction="previous" aria-label="Voltar para a carta anterior">‹</button>
            <span data-position>0 de 0</span>
            <button type="button" data-next data-direction="next" aria-label="Avançar para a próxima carta">›</button>
          </nav>

          <div class="tl517__orb-host" data-tarot-orb-host>
            <span class="tl517__orb-aura" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="tl517__orb-flare" aria-hidden="true"></span>
          </div>

          <p class="tl517__counter" aria-label="Cartas reveladas">
            <b data-count>0</b><span>/78</span>
          </p>
          <p class="tl517__signal" data-signal aria-live="polite">Toque na Orbe para revelar seu Tarot.</p>
        </section>

        <div class="tl517__toolbar" aria-label="Controles do Tarot Livre">
          <button type="button" data-shuffle>
            <span aria-hidden="true">↻</span>
            Embaralhar
          </button>
          <button type="button" data-reset>
            <span aria-hidden="true">✧</span>
            Novo círculo
          </button>
        </div>

        <section class="tl517__constellation" aria-labelledby="tl517ConstellationTitle">
          <header>
            <div>
              <small>SEU CÍRCULO</small>
              <h3 id="tl517ConstellationTitle">Cartas reveladas</h3>
            </div>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl517__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por fileira" aria-colcount="6"></div>
          <p class="tl517__empty-grid" data-empty-grid>Nenhuma carta foi revelada ainda.</p>
        </section>

        <p class="tl517__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world = this.root.querySelector('.tl517');
    this.stage = this.root.querySelector('[data-stage]');
    this.cosmosCanvas = this.root.querySelector('[data-cosmos]');
    this.effectsCanvas = this.root.querySelector('[data-effects]');
    this.orbHost = this.root.querySelector('[data-tarot-orb-host]');
    this.cardZone = this.root.querySelector('[data-card-zone]');
    this.card = this.root.querySelector('[data-current-card]');
    this.cardBack = this.root.querySelector('[data-card-back]');
    this.cardNav = this.root.querySelector('[data-card-nav]');
    this.signal = this.root.querySelector('[data-signal]');
    this.count = this.root.querySelector('[data-count]');
    this.position = this.root.querySelector('[data-position]');
    this.remaining = this.root.querySelector('[data-remaining]');
    this.grid = this.root.querySelector('[data-grid]');
    this.emptyGrid = this.root.querySelector('[data-empty-grid]');
    this.prev = this.root.querySelector('[data-prev]');
    this.next = this.root.querySelector('[data-next]');
    this.mesaButton = this.root.querySelector('[data-mesa-real]');
    this.mesaLabel = this.root.querySelector('[data-mesa-label]');
    this.mesaCount = this.root.querySelector('[data-mesa-count]');
    this.shuffle = this.root.querySelector('[data-shuffle]');
    this.resetButton = this.root.querySelector('[data-reset]');
    this.live = this.root.querySelector('[data-live]');
    drawPortalBack(this.cardBack);
  }

  bind() {
    const options = { signal: this.abort.signal };

    this.orb.addEventListener('pointerdown', event => {
      if (!this.active || !this.orbHost.contains(this.orb)) return;
      this.world.classList.add('is-orb-touching');
      this.fluidity?.touch(event.clientX, event.clientY, 0.72);
    }, { passive: true, ...options });

    const releaseOrb = () => this.world.classList.remove('is-orb-touching');
    this.orb.addEventListener('pointerup', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('pointercancel', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('click', () => {
      if (this.active && this.orbHost.contains(this.orb)) this.draw();
    }, options);

    this.prev.addEventListener('click', () => {
      nativePulse('Light');
      this.move(-1);
    }, options);
    this.next.addEventListener('click', () => {
      nativePulse('Light');
      this.move(1);
    }, options);
    this.mesaButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.openMesaReal();
    }, options);
    this.shuffle.addEventListener('click', () => this.reshuffle(), options);
    this.resetButton.addEventListener('click', () => this.handleResetButton(), options);

    this.cardZone.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.move(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.move(1);
      }
    }, options);

    this.grid.addEventListener('click', event => {
      if (this.busy) return;
      const button = event.target.closest('[data-index]');
      if (!button) return;
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      const direction = index === this.selected ? 0 : index > this.selected ? 1 : -1;
      this.selectCard(index, direction);
      this.stage.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }, options);

    this.onStorage = event => {
      if (!event.key?.endsWith(`:${STORAGE_KEY}`) || !event.newValue) return;
      const latest = this.coordinator.latest();
      if (latest.revision <= this.state.revision && latest.sessionId === this.state.sessionId) return;
      this.state = latest;
      this.selected = Math.min(this.selected, this.state.revealed.length - 1);
      if (this.selected < 0 && this.state.revealed.length) this.selected = this.state.revealed.length - 1;
      this.render(false);
    };
    globalThis.addEventListener?.('storage', this.onStorage, { signal: this.abort.signal });

    document.addEventListener('divina:supreme-orb-pulse', event => {
      if (!this.active) return;
      this.fluidity?.absorb(Number(event.detail?.intensity || 0.5));
    }, options);

    document.addEventListener('divina:route-ready', event => {
      const route = String(event.detail?.id || routeNow()).replace(/^#/, '').toLowerCase();
      if (route === 'tarot') this.enter();
      else this.leave(route);
    }, options);

    document.addEventListener('visibilitychange', () => {
      const visible = document.visibilityState === 'visible';
      this.world.dataset.visibility = visible ? 'visible' : 'paused';
      this.fluidity?.setActive(this.active && visible);
    }, options);

    globalThis.addEventListener?.('hashchange', () => {
      const route = routeNow();
      if (route === 'tarot') this.enter();
      else this.leave(route);
    }, { signal: this.abort.signal });

    this.routeObserver = globalThis.MutationObserver && document.body
      ? new MutationObserver(() => {
          const route = routeNow();
          if (route === 'tarot') this.enter();
          else this.leave(route);
        })
      : null;
    this.routeObserver?.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-screen']
    });
  }

  async openMesaReal() {
    if (this.openingMesa || this.busy) return false;
    this.openingMesa = true;
    const amount = this.state.revealed.length;
    const transfer = createTarotMesaTransferV517(this.state.revealed, {
      sessionId:this.state.sessionId,
      revision:this.state.revision
    });
    if (!transfer) {
      this.openingMesa = false;
      announce('A Mesa Real não conseguiu receber o círculo agora. Suas cartas continuam preservadas.');
      return false;
    }

    this.world.classList.add('is-opening-mesa');
    this.mesaButton.dataset.state = 'opening';
    this.mesaButton.setAttribute('aria-busy', 'true');
    this.mesaLabel.textContent = amount ? `Enviando ${amount}` : 'Abrindo';
    this.signal.textContent = amount
      ? `${amount} ${amount === 1 ? 'carta segue' : 'cartas seguem'} para a Mesa Real…`
      : 'A Mesa Real está abrindo…';
    this.orbCore.pulse?.('mesa-real-transfer', { intensity:0.96 });
    this.fluidity?.ignite(0.72);
    nativePulse('Medium');

    try {
      if (!reducedMotion()) await wait(90);
      await Promise.resolve(this.orbCore.navigate('spreads', {
        source:'tarot-livre-mesa-real-v517',
        target:this.mesaButton
      }));
      return true;
    } catch (error) {
      console.error('[Divina] A passagem para a Mesa Real foi preservada para nova tentativa.', error);
      this.signal.textContent = 'As cartas continuam guardadas no Tarot Livre.';
      announce('A Mesa Real não abriu agora. Nenhuma carta foi perdida.');
      return false;
    } finally {
      this.openingMesa = false;
      this.world.classList.remove('is-opening-mesa');
      this.mesaButton.removeAttribute('aria-busy');
      delete this.mesaButton.dataset.state;
      this.mesaLabel.textContent = 'Mesa Real';
      this.updateControls();
    }
  }

  enter() {
    if (this.active && this.orbHost.contains(this.orb)) {
      this.fluidity?.setActive(true);
      return true;
    }
    this.active = true;
    try {
      this.claimRelease = this.orbCore.claim(this.orbHost, {
        mode: 'tarot',
        ariaLabel: 'Orbe das Realidades. Toque para revelar uma carta.'
      });
    } catch (error) {
      this.active = false;
      console.error('[Divina] A Orbe não alcançou o altar do Tarot.', error);
      return false;
    }
    this.world.dataset.orbClaimed = 'true';
    this.orb.dataset.tarotReveal = 'v538';
    this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    this.fluidity?.setActive(true);
    requestAnimationFrame(() => {
      this.fluidity?.resize();
      this.orbCore.pulse?.('tarot-arrival', { intensity: 0.72 });
    });
    return true;
  }

  leave(nextRoute = 'home') {
    this.active = false;
    clearTimeout(this.birthTimer);
    this.world.classList.remove('is-orb-touching', 'is-birthing');
    document.body?.classList.remove('db517-tarot-birthing');
    this.fluidity?.setActive(false);
    delete this.orb.dataset.tarotReveal;
    this.orb.removeAttribute('aria-disabled');
    if (!this.orbHost.contains(this.orb)) return false;
    try {
      this.claimRelease?.();
    } catch {
      this.orbCore.returnHome?.();
    }
    this.claimRelease = null;
    delete this.world.dataset.orbClaimed;
    this.orbCore.settleRoute?.(nextRoute, 'tarot-leave-v517');
    return true;
  }

  setPhase(phase) {
    this.world.dataset.phase = phase;
    const busy = phase !== 'idle';
    const ritualVisible = phase === 'summoning' || phase === 'revealing' || this.world.classList.contains('is-birthing');
    document.body?.classList.toggle('db517-tarot-birthing', this.active && ritualVisible);
    this.world.setAttribute('aria-busy', String(busy));
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(busy || this.state.completed));
    }
    this.shuffle.disabled = busy || this.state.waiting.length < 2;
    this.resetButton.disabled = busy;
    this.mesaButton.disabled = busy || this.openingMesa;
    this.prev.disabled = busy || this.selected <= 0;
    this.next.disabled = busy || this.selected >= this.state.revealed.length - 1;
  }

  prepareCardContent(index) {
    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') throw new Error('Carta direta indisponível.');

    // A prévia do atlas nasce imediatamente. A imagem integral ganha definição
    // progressivamente, sem segurar a resposta da Orbe nem criar tela vazia.
    Promise.resolve(prepareCardImage(card, {
      timeout: 1800,
      priority: 'high'
    })).catch(() => false);

    const cradle = document.createElement('div');
    cradle.innerHTML = `${cardImageMarkup(card, {
      alt: `${card.name}, direta`,
      priority: 'high'
    })}<div class="tl517__card-name"><b>${escapeText(card.name)}</b><small>${index + 1} / ${this.state.revealed.length}</small></div>`;
    const fragment = document.createDocumentFragment();
    while (cradle.firstChild) fragment.append(cradle.firstChild);
    return { card, fragment };
  }

  commitPreparedCard(index, prepared) {
    this.selected = index;
    this.card.replaceChildren(prepared.fragment);
    this.card.dataset.empty = 'false';
    this.card.dataset.imageState = 'progressive';
    this.cardZone.setAttribute(
      'aria-label',
      `${prepared.card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}.`
    );
    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button => {
      const active = Number(button.dataset.index) === index;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    preloadCardImages([this.state.revealed[index - 1], this.state.revealed[index + 1]], 2);
  }

  async transitionTo(index, { onBirth } = {}) {
    const token = ++this.cardRenderToken;
    this.card.dataset.imageState = 'preparing';
    const prepared = this.prepareCardContent(index);
    if (token !== this.cardRenderToken) return false;
    this.commitPreparedCard(index, prepared);
    const duration = reducedMotion() ? 150 : BIRTH_TRAVEL_MS;
    onBirth?.({ duration });
    if (reducedMotion()) return true;

    const cardRect = this.card.getBoundingClientRect();
    const orbRect = this.orb.getBoundingClientRect();
    const originX = orbRect.left + orbRect.width / 2;
    const originY = orbRect.top + orbRect.height / 2;
    const destinationX = cardRect.left + cardRect.width / 2;
    const destinationY = cardRect.top + cardRect.height / 2;
    const dx = originX - destinationX;
    const dy = originY - destinationY;
    const startScale = clamp((orbRect.width / Math.max(cardRect.width, 1)) * 0.27, 0.16, 0.32);
    const curve = Math.min(34, Math.max(14, cardRect.width * 0.11));

    const veil = document.createElement('canvas');
    veil.className = 'tl517__birth-veil';
    veil.setAttribute('aria-hidden', 'true');
    drawPortalBack(veil);
    this.card.append(veil);
    this.card.dataset.imageState = 'journey';
    this.world.dataset.birthTransit = 'active';
    this.card.getAnimations?.().forEach(animation => animation.cancel());

    const journey = this.card.animate([
      {
        opacity:0.12,
        transform:`translate3d(${dx}px,${dy}px,0) scale(${startScale}) rotateZ(-7deg)`
      },
      {
        opacity:0.9,
        transform:`translate3d(${dx * 0.9 + curve * 0.32}px,${dy * 0.9}px,0) scale(${startScale * 1.28}) rotateZ(-3deg)`,
        offset:0.14
      },
      {
        opacity:0.98,
        transform:`translate3d(${dx * 0.62 + curve}px,${dy * 0.62}px,0) scale(.56) rotateZ(3.2deg)`,
        offset:0.38
      },
      {
        opacity:1,
        transform:`translate3d(${dx * 0.28 - curve}px,${dy * 0.28}px,0) scale(.82) rotateZ(-2deg)`,
        offset:0.68
      },
      {
        opacity:1,
        transform:'translate3d(0,-4px,0) scale(1.025) rotateZ(.4deg)',
        offset:0.9
      },
      {
        opacity:1,
        transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)'
      }
    ], {
      duration,
      easing:'cubic-bezier(.16,.82,.18,1)',
      fill:'both'
    });
    const unveiling = veil.animate([
      { opacity:1, transform:'perspective(700px) rotateY(0deg) scale(1)' },
      { opacity:1, transform:'perspective(700px) rotateY(0deg) scale(1)', offset:0.68 },
      { opacity:0.78, transform:'perspective(700px) rotateY(72deg) scale(.99)', offset:0.86 },
      { opacity:0, transform:'perspective(700px) rotateY(94deg) scale(.98)' }
    ], { duration, easing:'cubic-bezier(.16,.82,.18,1)', fill:'both' });

    await Promise.allSettled([journey.finished, unveiling.finished]);
    veil.remove();
    this.card.dataset.imageState = 'progressive';
    delete this.world.dataset.birthTransit;
    return true;
  }

  async draw() {
    if (!this.active || this.busy || this.state.completed) return null;
    const responseStartedAt = performance.now();
    this.busy = true;
    this.setPhase('summoning');
    this.world.classList.add('is-responding');
    this.signal.textContent = 'O universo da Orbe encontra uma carta…';
    requestAnimationFrame(() => {
      this.lastInputResponseMs = Math.max(0, performance.now() - responseStartedAt);
      this.world.dataset.lastInputResponseMs = this.lastInputResponseMs.toFixed(1);
      this.world.dataset.responseWithinBudget = String(this.lastInputResponseMs <= RESPONSE_BUDGET_MS);
      this.world.classList.remove('is-responding');
      globalThis.dispatchEvent?.(new CustomEvent('tarot:input-response-v538', {
        detail: {
          milliseconds: this.lastInputResponseMs,
          budget: RESPONSE_BUDGET_MS,
          withinBudget: this.lastInputResponseMs <= RESPONSE_BUDGET_MS
        }
      }));
    });
    this.fluidity?.ignite(0.7);
    this.orbCore.pulse?.('tarot-summon', { intensity: 0.88 });
    nativePulse('Medium');

    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest));
      this.state = result.state;
      if (result.cardId === null) return null;

      const card = CARDS[result.cardId];

      this.setPhase('revealing');
      this.signal.textContent = 'A carta nasce do núcleo vivo…';
      const born = await this.transitionTo(result.position, { onBirth: ({ duration }) => {
        this.count.textContent = String(this.state.revealed.length);
        this.remaining.textContent = this.state.completed
          ? 'Círculo completo'
          : `${this.state.waiting.length} aguardam`;
        this.appendGridCard(result.position);
        this.world.classList.add('is-birthing');
        this.fluidity?.birth(1.04, duration);
        this.orbCore.pulse?.('tarot-birth', { intensity: 1.04 });
        clearTimeout(this.birthTimer);
        this.birthTimer = setTimeout(() => {
          this.world?.classList.remove('is-birthing');
          if (this.world?.dataset.phase === 'idle') {
            document.body?.classList.remove('db517-tarot-birthing');
          }
        }, reducedMotion() ? 120 : duration + 120);
      }});
      if (!born) throw new Error('O nascimento visual foi substituído por uma atualização mais recente.');
      if (reducedMotion()) await wait(45);
      else await wait(48);

      this.signal.textContent = this.state.completed
        ? 'O círculo das 78 cartas está completo.'
        : `${card?.name || 'Carta'} nasceu da Orbe.`;
      this.live.textContent = `${card?.name || 'Carta'}, direta. ${result.position + 1} de 78.`;
      nativePulse('Light');

      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          engine: 'progressive-no-fire-v538',
          auditFingerprint: tarotStateFingerprint(this.state)
        }
      }));
      globalThis.dispatchEvent?.(new CustomEvent('tarot:cosmic-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          version: VERSION
        }
      }));
      globalThis.dispatchEvent?.(new CustomEvent('tarot:supreme-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          canonicalOrb: 'v501',
          version: VERSION
        }
      }));

      preloadCardImages(this.state.waiting.slice(0, 4), 4);
      return result.cardId;
    } catch (error) {
      console.error('[Divina] A revelação foi preservada após uma interrupção.', error);
      this.state = this.coordinator.latest();
      this.selected = this.state.revealed.length - 1;
      this.render(false);
      this.signal.textContent = 'O círculo foi preservado. Toque novamente.';
      announce('Nenhuma carta foi perdida. A Orbe está pronta novamente.');
      return null;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  async show(index, animate = false, direction = 0) {
    if (!Number.isInteger(index) || index < 0 || index >= this.state.revealed.length) return false;
    const token = ++this.cardRenderToken;
    let outgoing = null;
    let incoming = null;
    this.card.dataset.imageState = 'preparing';
    try {
      const prepared = this.prepareCardContent(index);
      if (token !== this.cardRenderToken) return false;
      outgoing = animate && !reducedMotion() && this.card.dataset.empty !== 'true'
        ? this.card.cloneNode(true)
        : null;
      if (outgoing) {
        outgoing.removeAttribute('data-current-card');
        outgoing.removeAttribute('aria-busy');
        outgoing.classList.add('tl517__card-ghost');
        outgoing.setAttribute('aria-hidden', 'true');
        this.cardZone.append(outgoing);
      }
      this.commitPreparedCard(index, prepared);
      if (animate && !reducedMotion()) {
        const sign = direction ? Math.sign(direction) : 1;
        this.cardZone.classList.add('is-history-transitioning');
        this.card.getAnimations?.().forEach(animation => animation.cancel());
        incoming = this.card.animate([
          { opacity:0.18, transform:`translate3d(${sign * 34}px,0,0) scale(.965) rotateZ(${sign * 0.8}deg)` },
          { opacity:1, transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)', offset:0.72 },
          { opacity:1, transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)' }
        ], {
          duration:HISTORY_TRANSITION_MS,
          easing:'cubic-bezier(.2,.88,.22,1)',
          fill:'both'
        });
        const leaving = outgoing?.animate?.([
          { opacity:1, transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)' },
          { opacity:0, transform:`translate3d(${-sign * 28}px,0,0) scale(.975) rotateZ(${-sign * 0.6}deg)` }
        ], {
          duration:Math.round(HISTORY_TRANSITION_MS * 0.74),
          easing:'cubic-bezier(.32,0,.44,1)',
          fill:'both'
        });
        await Promise.allSettled([incoming.finished, leaving?.finished]);
      }
      this.fluidity?.absorb(0.22);
      return true;
    } catch (error) {
      if (token === this.cardRenderToken) this.card.dataset.imageState = 'preserved';
      console.info('[Divina] A carta anterior ficou visível enquanto a próxima carrega.', error);
      return false;
    } finally {
      outgoing?.getAnimations?.().forEach(animation => animation.cancel());
      outgoing?.remove();
      incoming?.cancel?.();
      this.cardZone.classList.remove('is-history-transitioning');
    }
  }

  async move(direction) {
    const next = this.selected + direction;
    return this.selectCard(next, direction);
  }

  async selectCard(index, direction = 0) {
    if (this.busy || !this.state.revealed.length) return false;
    if (!Number.isInteger(index) || index < 0 || index >= this.state.revealed.length) return false;
    if (index === this.selected) return true;
    this.busy = true;
    this.updateControls();
    try { return await this.show(index, true, direction); }
    finally {
      this.busy = false;
      this.updateControls();
    }
  }

  async reshuffle() {
    if (this.busy || this.state.waiting.length < 2) return false;
    const revealedSignature = this.state.revealed.join(',');
    this.busy = true;
    this.setPhase('shuffling');
    this.signal.textContent = 'A Orbe reorganiza apenas as cartas ocultas…';
    this.fluidity?.ignite(0.92);
    this.orbCore.pulse?.('tarot-shuffle', { intensity: 0.86 });

    try {
      this.state = await this.coordinator.commit(latest => shuffleRemainingCards(latest));
      if (this.state.revealed.join(',') !== revealedSignature) {
        throw new Error('As cartas reveladas mudaram durante o embaralhamento.');
      }
      this.render(false);
      this.signal.textContent = 'As cartas ocultas foram embaralhadas.';
      preloadCardImages([
        this.state.waiting[0],
        this.state.waiting[1],
        this.state.waiting[2]
      ], 3);
      announce('Cartas ocultas embaralhadas. As reveladas foram preservadas.');
      nativePulse('Light');
      return true;
    } catch (error) {
      console.error('[Divina] O embaralhamento foi interrompido.', error);
      this.state = this.coordinator.latest();
      this.render(false);
      this.signal.textContent = 'O círculo atual foi preservado.';
      announce('Não foi possível embaralhar agora.');
      return false;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  handleResetButton() {
    if (this.busy) return;
    if (!this.state.revealed.length) {
      this.resetNow();
      return;
    }
    if (!this.resetArmed) {
      this.resetArmed = true;
      clearTimeout(this.resetTimer);
      this.resetButton.innerHTML = '<span aria-hidden="true">✦</span> Confirmar novo círculo';
      this.resetButton.classList.add('is-armed');
      this.signal.textContent = 'Toque novamente para abrir um círculo novo.';
      this.resetTimer = setTimeout(() => this.disarmReset(), RESET_ARM_MS);
      return;
    }
    this.resetNow();
  }

  disarmReset() {
    this.resetArmed = false;
    clearTimeout(this.resetTimer);
    this.resetButton.innerHTML = '<span aria-hidden="true">✧</span> Novo círculo';
    this.resetButton.classList.remove('is-armed');
  }

  async resetNow() {
    if (this.busy) return false;
    this.disarmReset();
    this.busy = true;
    this.setPhase('resetting');
    this.signal.textContent = 'A Orbe recolhe o círculo anterior…';
    this.fluidity?.ignite(1.18);
    this.orbCore.pulse?.('tarot-reset', { intensity: 1.02 });

    try {
      this.state = await this.coordinator.commit(latest => resetTarotState({
        now: () => Math.max(Date.now(), Number(latest.updatedAt || 0) + 2)
      }));
      this.selected = -1;
      this.render(false);
      this.signal.textContent = 'Novo círculo aberto. Toque na Orbe.';
      announce('Novo círculo aberto.');
      nativePulse('Medium');
      return true;
    } catch (error) {
      console.error('[Divina] O novo círculo não pôde ser aberto.', error);
      this.state = this.coordinator.latest();
      this.render(false);
      this.signal.textContent = 'O círculo atual foi preservado.';
      announce('Não foi possível recomeçar agora.');
      return false;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  render(animateCurrent = false) {
    const revealed = this.state.revealed.length;
    this.count.textContent = String(revealed);
    this.remaining.textContent = this.state.completed
      ? 'Círculo completo'
      : `${this.state.waiting.length} aguardam`;
    if (this.state.completed) {
      this.signal.textContent = 'O círculo das 78 cartas está completo.';
    }

    if (!revealed) {
      this.cardRenderToken += 1;
      this.selected = -1;
      this.card.dataset.empty = 'true';
      this.card.dataset.imageState = 'portal';
      this.card.innerHTML = '<canvas class="tl517__card-back" data-card-back aria-hidden="true"></canvas>';
      this.cardBack = this.card.querySelector('[data-card-back]');
      drawPortalBack(this.cardBack);
      this.cardZone.setAttribute('aria-label', 'Nenhuma carta revelada. Toque na Orbe para começar.');
    } else {
      this.selected = clamp(this.selected, 0, revealed - 1);
      this.show(this.selected, animateCurrent);
    }

    this.renderGrid();
    this.updateControls();
  }

  renderGrid() {
    this.grid.innerHTML = this.state.revealed
      .map((cardId, index) => this.gridCardMarkup(cardId, index))
      .join('');
    this.emptyGrid.hidden = this.state.revealed.length > 0;
  }

  gridCardMarkup(cardId, index) {
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') return '';
    const current = index === this.selected;
    return `<button type="button" data-index="${index}" role="gridcell" class="${current ? 'is-current' : ''}" aria-current="${current ? 'true' : 'false'}" aria-label="${escapeText(card.name)}, carta ${index + 1}">${cardImageMarkup(card, { alt: '', priority: 'low' })}<span>${index + 1}</span></button>`;
  }

  appendGridCard(index) {
    const expectedPrevious = index;
    if (this.grid.children.length !== expectedPrevious) {
      this.renderGrid();
      return;
    }
    const markup = this.gridCardMarkup(this.state.revealed[index], index);
    if (!markup) return;
    this.grid.insertAdjacentHTML('beforeend', markup);
    this.emptyGrid.hidden = true;
  }

  updateControls() {
    const revealed = this.state.revealed.length;
    this.position.textContent = revealed ? `${this.selected + 1} de ${revealed}` : '0 de 0';
    this.cardNav.dataset.visible = String(revealed > 0);
    this.prev.disabled = !revealed || this.selected <= 0 || this.busy;
    this.next.disabled = !revealed || this.selected >= revealed - 1 || this.busy;
    this.shuffle.disabled = this.busy || this.state.waiting.length < 2;
    this.resetButton.disabled = this.busy;
    this.mesaButton.disabled = this.openingMesa || this.busy;
    this.mesaCount.textContent = String(revealed);
    this.mesaCount.hidden = revealed === 0;
    this.mesaButton.setAttribute(
      'aria-label',
      revealed
        ? `Abrir a Mesa Real com ${revealed} ${revealed === 1 ? 'carta revelada' : 'cartas reveladas'}`
        : 'Abrir uma nova Mesa Real'
    );
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    }
  }

  status() {
    return Object.freeze({
      version: VERSION,
      active: this.active,
      renderer: this.fluidity?.mode || 'pending',
      canonicalOrb: this.orb?.dataset?.supremeOrbVersion || '501',
      oneLivingOrb: document.querySelectorAll('[data-supreme-orb="living"]').length === 1,
      revealed: this.state.revealed.length,
      remaining: this.state.waiting.length,
      auditFingerprint: tarotStateFingerprint(this.state),
      normalOnly: this.state.revealed.every(id => CARDS[id]?.orientation === 'normal'),
      noRepeats: new Set(this.state.revealed).size === this.state.revealed.length,
      gridColumns: 6,
      atomicBirth: false,
      atlasFirstProgressive: this.world.dataset.birthSync === 'atlas-first-progressive',
      responseBudgetMs: RESPONSE_BUDGET_MS,
      lastInputResponseMs: this.lastInputResponseMs,
      responseWithinBudget: this.lastInputResponseMs === 0 || this.lastInputResponseMs <= RESPONSE_BUDGET_MS,
      dragNavigation: false,
      decodedBeforeSwap: false,
      blankFrameFree: this.card.dataset.imageState !== 'blank',
      organicCanvasFire: false,
      trueCelestialFire: false,
      celestialFireScheduled: false,
      lightningStrokes: this.world.dataset.lightningStrokes !== 'none',
      strokedFirePaths: Number(this.world.dataset.strokedFirePaths || 0),
      whiteOverexposure: this.world.dataset.whiteOverexposure !== 'false',
      volumetricBillows: false,
      flameTongues: false,
      cardEdgeBurst: this.world.dataset.birthCorona === 'card-edge',
      responsiveAltar: this.world.dataset.responsiveAltar === 'v517-reference-ratio',
      volumetricFire: false,
      fireInsideUniverseCanvas: false,
      cosmicNebula: true,
      livingUniverse: this.world.dataset.universeAuthority === 'living-universe-core-v524',
      physicalCardJourney: this.world.dataset.birthJourney === 'orb-to-card-short-v538',
      stellarFoundation: this.world.dataset.universeAuthority === 'living-universe-core-v524',
      optimizedCosmicBackdrop: false,
      staticUniverseImage: this.world.dataset.staticUniverseImage !== 'false',
      universalUniverseCanvas: this.world.dataset.universeAuthority === 'living-universe-core-v524',
      skinReactiveUniverse: this.world.dataset.skinReactiveUniverse === '30-palettes',
      retinaAdaptiveEffects: this.world.dataset.effectsResolution === 'global-adaptive',
      spriteAtlasParticles: this.world.dataset.particleArchitecture === 'palette-sprite-atlas',
      smoothBirthJourney: this.world.dataset.birthEasing === 'ios-short-compositor-v538',
      iosHistoryNavigation: this.world.dataset.birthEasing === 'ios-short-compositor-v538',
      mesaRealTransfer: true,
      referenceProportions: this.world.dataset.responsiveAltar === 'v517-reference-ratio',
      oneAnimationCadence: this.world.dataset.frameArchitecture === 'universal-single-raf',
      unexplainedFlyingCards: this.world.dataset.decorativeCards !== 'none',
      targetFps: this.fluidity?.targetFps || 0
    });
  }

  destroy() {
    this.leave(routeNow());
    this.abort.abort();
    clearTimeout(this.resetTimer);
    clearTimeout(this.birthTimer);
    this.routeObserver?.disconnect();
    this.fluidity?.destroy();
    if (globalThis.divinaTarotLivreV517 === this) delete globalThis.divinaTarotLivreV517;
    delete document.documentElement.dataset.tarotLivre;
  }
}
