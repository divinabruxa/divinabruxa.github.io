/* DIVINA BRUXA — MACROETAPA 2/4 · CHAMA CELESTIAL VERDADEIRA V516
   A única Orbe Suprema V501 alimenta um fogo volumétrico integrado ao mesmo
   canvas do universo. A carta real atravessa a chama; não existem raios,
   imagens de fogo, caminhos contornados ou cartas decorativas. */

import { CARDS } from './tarot-data.js';
import { cardImageMarkup, prepareCardImage, preloadCardImages } from './tarot-image-runtime.js?v=148';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=182';
import {
  DECK_SIZE,
  drawNextCard,
  resetTarotState,
  shuffleRemainingCards
} from './tarot-session.js?v=182';
import { store } from './storage.js';

const VERSION = 516;
const STORAGE_KEY = 'free-tarot';
const RESET_ARM_MS = 3600;
const CARD_READY_TIMEOUT_MS = 4800;
const BIRTH_TRAVEL_MS = 1040;
const HISTORY_TRANSITION_MS = 280;

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

/* A V516 usa exclusivamente o quadro universal. Este adaptador preserva o
   contrato de interação do Tarot sem iniciar um segundo requestAnimationFrame
   ou fabricar outra Orbe. */
class CelestialFireBridgeV516 {
  constructor({ stage, orb, card }) {
    this.stage = stage;
    this.orb = orb;
    this.card = card;
    this.universe = globalThis.divinaLivingUniverseV516 || null;
    this.mode = 'celestial-fire-integrated-v516';
    this.targetFps = this.universe?.targetFps || (constrained() ? 40 : 60);
    this.active = false;
    this.arrivalTimer = 0;
    this.foundationStars = null;
    this.fireVolumes = null;
    this.flameSprites = null;
  }

  normalizedPoint(element, clientX, clientY) {
    if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
      return {
        x:clamp(clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(clientY / Math.max(innerHeight, 1), 0, 1)
      };
    }
    const rect = element?.getBoundingClientRect?.();
    return {
      x:clamp(((rect?.left || 0) + (rect?.width || 0) / 2) / Math.max(innerWidth, 1), 0, 1),
      y:clamp(((rect?.top || 0) + (rect?.height || 0) / 2) / Math.max(innerHeight, 1), 0, 1)
    };
  }

  pulseAt(element, strength = 0.7) {
    const point = this.normalizedPoint(element);
    this.universe?.ignite?.({ ...point, strength });
  }

  touch(clientX, clientY, strength = 0.7) {
    const point = this.normalizedPoint(this.orb, clientX, clientY);
    this.universe?.ignite?.({ ...point, strength });
    this.universe?.pulseCelestialFlame?.(strength);
  }

  ignite(strength = 0.8) {
    this.pulseAt(this.orb, strength);
    this.universe?.pulseCelestialFlame?.(strength);
  }

  absorb(strength = 0.35) {
    this.pulseAt(this.card, strength);
    this.universe?.pulseCelestialFlame?.(Math.max(0.2, strength));
  }

  birth(strength = 1, duration = BIRTH_TRAVEL_MS) {
    clearTimeout(this.arrivalTimer);
    this.pulseAt(this.orb, strength);
    this.universe?.birthCelestialFlame?.({ strength, duration });
    this.arrivalTimer = setTimeout(
      () => this.pulseAt(this.card, Math.max(0.48, strength * 0.72)),
      Math.max(90, Number(duration || BIRTH_TRAVEL_MS) * 0.82)
    );
  }

  setActive(active) {
    this.universe ||= globalThis.divinaLivingUniverseV516 || null;
    this.active = Boolean(active);
    if (this.active) {
      this.universe?.setRoute?.('tarot');
      this.universe?.setCelestialFlame?.({
        orb:this.orb,
        card:this.card,
        active:true
      });
    } else {
      this.universe?.setCelestialFlameActive?.(false);
    }
  }

  resize() {}

  destroy() {
    clearTimeout(this.arrivalTimer);
    this.universe?.setCelestialFlameActive?.(false);
    this.active = false;
  }
}

export class TarotLivreOrbOSV516 {
  constructor(root, {
    storage = store,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null
  } = {}) {
    if (!root) throw new TypeError('O mundo do Tarot Livre não foi encontrado.');
    if (!orbCore?.claim || !orbCore?.orb) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes do Tarot Livre V516.');
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
    this.touchStart = null;
    this.resetArmed = false;
    this.resetTimer = 0;
    this.birthTimer = 0;
    this.cardRenderToken = 0;
    this.claimRelease = null;
    this.active = false;

    this.root.innerHTML = '';
    this.root.dataset.tarotWorld = 'orbe-os-v516';
    this.root.className = this.root.className
      .replace(/\btarot-world-v301-host\b/g, '')
      .trim();

    this.build();
    this.world.dataset.birthSync = 'decoded-atomic';
    this.world.dataset.flameTexture = 'procedural-no-image';
    this.world.dataset.flameArchitecture = 'integrated-volumetric-field-v516';
    this.world.dataset.lightningStrokes = 'none';
    this.world.dataset.strokedFirePaths = '0';
    this.world.dataset.whiteOverexposure = 'false';
    this.world.dataset.firePalette = 'violet-magenta-gold';
    this.world.dataset.birthCorona = 'card-edge';
    this.world.dataset.birthJourney = 'orb-to-card';
    this.world.dataset.birthEasing = 'compositor-v516';
    this.world.dataset.responsiveAltar = 'v516';
    this.world.dataset.visualCalibration = 'universal-living-space';
    this.world.dataset.cardOrigin = 'supreme-orb-v501';
    this.world.dataset.decorativeCards = 'none';
    this.world.dataset.universeBackdrop = 'procedural-no-image-v516';
    this.world.dataset.staticUniverseImage = 'false';
    this.world.dataset.universeAuthority = 'living-universe-core-v516';
    this.world.dataset.skinReactiveUniverse = '30-palettes';
    this.world.dataset.effectsResolution = 'global-adaptive';
    this.world.dataset.frameArchitecture = 'universal-single-raf';
    this.world.dataset.particleArchitecture = 'global-procedural-shader';
    this.render(false);
    this.fire = new CelestialFireBridgeV516({
      stage: this.stage,
      orb: this.orb,
      card: this.cardZone
    });
    this.world.dataset.engine = this.fire.mode;
    this.world.dataset.targetFps = String(this.fire.targetFps);
    this.bind();

    if (routeNow() === 'tarot') {
      requestAnimationFrame(() => this.enter());
    } else {
      this.fire.setActive(false);
    }

    preloadCardImages(this.state.waiting.slice(0, 8), 8);

    document.documentElement.dataset.tarotLivre = 'v516';
    const readiness = Object.freeze({
      version: VERSION,
      engine: 'CelestialFireBridgeV516',
      renderer: this.fire.mode,
      canonicalOrb: 'v501',
      oneLivingOrb: true,
      deckSize: DECK_SIZE,
      normalOnly: true,
      noRepeats: true,
      gridColumns: 6,
      atomicBirth: true,
      decodedBeforeSwap: true,
      organicCanvasFire: true,
      trueCelestialFire: true,
      celestialFireScheduled:false,
      lightningStrokes: false,
      strokedFirePaths:0,
      whiteOverexposure:false,
      volumetricBillows: true,
      flameTongues: true,
      cardEdgeBurst: true,
      responsiveAltar: true,
      volumetricFire: true,
      fireInsideUniverseCanvas:true,
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
      oneAnimationCadence: true,
      unexplainedFlyingCards: false,
      targetFps: this.fire.targetFps
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
      <div class="tl516" data-phase="idle" data-engine="pending">
        <header class="tl516__header">
          <div class="tl516__title">
            <h2>Tarot Livre</h2>
            <span class="tl516__title-star" aria-hidden="true"><i></i><b></b><i></i></span>
          </div>

          <a class="tl516__mesa" href="#spreads" data-go="spreads" aria-label="Abrir Tiragens e Mesa Real">
            <span aria-hidden="true">✦</span>
            Mesa Real
          </a>

        </header>

        <section class="tl516__stage" data-stage data-universe="alive" aria-label="Tarot Livre — universo vivo nascido da Orbe">
          <div class="tl516__portal-crown" aria-hidden="true"><i></i><i></i><i></i></div>

          <div class="tl516__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas reveladas.">
            <div class="tl516__card" data-current-card data-empty="true">
              <canvas class="tl516__card-back" data-card-back aria-hidden="true"></canvas>
            </div>
          </div>

          <nav class="tl516__card-nav" data-card-nav aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">‹</button>
            <span data-position>0 de 0</span>
            <button type="button" data-next aria-label="Próxima carta">›</button>
          </nav>

          <div class="tl516__orb-host" data-tarot-orb-host>
            <span class="tl516__orb-aura" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="tl516__orb-flare" aria-hidden="true"></span>
          </div>

          <p class="tl516__counter" aria-label="Cartas reveladas">
            <b data-count>0</b><span>/78</span>
          </p>
          <p class="tl516__signal" data-signal aria-live="polite">Toque na Orbe para revelar seu Tarot.</p>
        </section>

        <div class="tl516__toolbar" aria-label="Controles do Tarot Livre">
          <button type="button" data-shuffle>
            <span aria-hidden="true">↻</span>
            Embaralhar
          </button>
          <button type="button" data-reset>
            <span aria-hidden="true">✧</span>
            Novo círculo
          </button>
        </div>

        <section class="tl516__constellation" aria-labelledby="tl516ConstellationTitle">
          <header>
            <div>
              <small>SEU CÍRCULO</small>
              <h3 id="tl516ConstellationTitle">Cartas reveladas</h3>
            </div>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl516__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por fileira" aria-colcount="6"></div>
          <p class="tl516__empty-grid" data-empty-grid>Nenhuma carta foi revelada ainda.</p>
        </section>

        <p class="tl516__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world = this.root.querySelector('.tl516');
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
      this.fire?.touch(event.clientX, event.clientY, 0.72);
    }, { passive: true, ...options });

    const releaseOrb = () => this.world.classList.remove('is-orb-touching');
    this.orb.addEventListener('pointerup', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('pointercancel', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('click', () => {
      if (this.active && this.orbHost.contains(this.orb)) this.draw();
    }, options);

    this.prev.addEventListener('click', () => this.move(-1), options);
    this.next.addEventListener('click', () => this.move(1), options);
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

    this.cardZone.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.touchStart = { x: event.clientX, y: event.clientY };
    }, options);
    this.cardZone.addEventListener('pointerup', event => {
      const start = this.touchStart;
      this.touchStart = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      this.move(dx < 0 ? 1 : -1);
    }, options);
    this.cardZone.addEventListener('pointercancel', () => {
      this.touchStart = null;
    }, options);

    this.grid.addEventListener('click', event => {
      if (this.busy) return;
      const button = event.target.closest('[data-index]');
      if (!button) return;
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      this.show(index, true);
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
      this.fire?.absorb(Number(event.detail?.intensity || 0.5));
    }, options);

    document.addEventListener('divina:route-ready', event => {
      const route = String(event.detail?.id || routeNow()).replace(/^#/, '').toLowerCase();
      if (route === 'tarot') this.enter();
      else this.leave(route);
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

  enter() {
    if (this.active && this.orbHost.contains(this.orb)) {
      this.fire?.setActive(true);
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
    this.orb.dataset.tarotReveal = 'v516';
    this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    this.fire?.setActive(true);
    requestAnimationFrame(() => {
      this.fire?.resize();
      this.orbCore.pulse?.('tarot-arrival', { intensity: 0.72 });
    });
    return true;
  }

  leave(nextRoute = 'home') {
    this.active = false;
    clearTimeout(this.birthTimer);
    this.world.classList.remove('is-orb-touching', 'is-birthing');
    document.body?.classList.remove('db516-tarot-birthing');
    this.fire?.setActive(false);
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
    this.orbCore.settleRoute?.(nextRoute, 'tarot-leave-v516');
    return true;
  }

  setPhase(phase) {
    this.world.dataset.phase = phase;
    const busy = phase !== 'idle';
    const ritualVisible = phase === 'summoning' || phase === 'revealing' || this.world.classList.contains('is-birthing');
    document.body?.classList.toggle('db516-tarot-birthing', this.active && ritualVisible);
    this.world.setAttribute('aria-busy', String(busy));
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(busy || this.state.completed));
    }
    this.shuffle.disabled = busy || this.state.waiting.length < 2;
    this.resetButton.disabled = busy;
  }

  waitForImage(image, timeout = CARD_READY_TIMEOUT_MS) {
    if (!(image instanceof HTMLImageElement)) return Promise.resolve(true);
    image.loading = 'eager';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'high');

    const decodeLoaded = async () => {
      if (!image.naturalWidth) return false;
      try { await image.decode?.(); } catch {}
      return image.naturalWidth > 0;
    };
    if (image.complete) return decodeLoaded();

    return new Promise(resolve => {
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);
        resolve(value);
      };
      const onLoad = () => decodeLoaded().then(finish);
      const onError = () => finish(false);
      const timer = setTimeout(() => finish(false), timeout);
      image.addEventListener('load', onLoad, { once:true });
      image.addEventListener('error', onError, { once:true });
      if (image.complete) queueMicrotask(onLoad);
    });
  }

  async prepareCardContent(index) {
    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') throw new Error('Carta direta indisponível.');

    // O runtime aquece o atlas enquanto uma árvore conectável é preparada.
    // A árvore atual continua visível até todos os pixels novos decodificarem.
    Promise.resolve(prepareCardImage(card, {
      timeout: CARD_READY_TIMEOUT_MS,
      priority: 'high'
    })).catch(() => false);

    const cradle = document.createElement('div');
    cradle.innerHTML = `${cardImageMarkup(card, {
      alt: `${card.name}, direta`,
      priority: 'high'
    })}<div class="tl516__card-name"><b>${escapeText(card.name)}</b><small>${index + 1} / ${this.state.revealed.length}</small></div>`;
    const images = [...cradle.querySelectorAll('img')];
    const readiness = await Promise.all(images.map(image => this.waitForImage(image)));
    if (readiness.some(value => value !== true)) {
      throw new Error(`A imagem de ${card.name} ainda não terminou de nascer.`);
    }

    const fragment = document.createDocumentFragment();
    while (cradle.firstChild) fragment.append(cradle.firstChild);
    return { card, fragment };
  }

  commitPreparedCard(index, prepared) {
    this.selected = index;
    this.card.replaceChildren(prepared.fragment);
    this.card.dataset.empty = 'false';
    this.card.dataset.imageState = 'decoded';
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
    const prepared = await this.prepareCardContent(index);
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
    veil.className = 'tl516__birth-veil';
    veil.setAttribute('aria-hidden', 'true');
    drawPortalBack(veil);
    this.card.append(veil);
    this.card.dataset.imageState = 'journey';
    this.world.dataset.birthTransit = 'active';
    this.card.getAnimations?.().forEach(animation => animation.cancel());

    const journey = this.card.animate([
      {
        opacity:0.12,
        transform:`translate3d(${dx}px,${dy}px,0) scale(${startScale}) rotateZ(-7deg)`,
        filter:'brightness(1.7) saturate(1.35)'
      },
      {
        opacity:0.9,
        transform:`translate3d(${dx * 0.9 + curve * 0.32}px,${dy * 0.9}px,0) scale(${startScale * 1.28}) rotateZ(-3deg)`,
        filter:'brightness(1.56) saturate(1.34)',
        offset:0.14
      },
      {
        opacity:0.98,
        transform:`translate3d(${dx * 0.62 + curve}px,${dy * 0.62}px,0) scale(.56) rotateZ(3.2deg)`,
        filter:'brightness(1.34) saturate(1.27)',
        offset:0.38
      },
      {
        opacity:1,
        transform:`translate3d(${dx * 0.28 - curve}px,${dy * 0.28}px,0) scale(.82) rotateZ(-2deg)`,
        filter:'brightness(1.18) saturate(1.18)',
        offset:0.68
      },
      {
        opacity:1,
        transform:'translate3d(0,-4px,0) scale(1.025) rotateZ(.4deg)',
        filter:'brightness(1.08) saturate(1.08)',
        offset:0.9
      },
      {
        opacity:1,
        transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)',
        filter:'brightness(1) saturate(1)'
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
    this.card.dataset.imageState = 'decoded';
    delete this.world.dataset.birthTransit;
    return true;
  }

  async draw() {
    if (!this.active || this.busy || this.state.completed) return null;
    this.busy = true;
    this.setPhase('summoning');
    this.signal.textContent = 'O universo da Orbe encontra uma carta…';
    this.fire?.ignite(0.7);
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
        this.renderGrid();
        this.world.classList.add('is-birthing');
        this.fire?.birth(1.04, duration);
        this.orbCore.pulse?.('tarot-birth', { intensity: 1.04 });
        clearTimeout(this.birthTimer);
        this.birthTimer = setTimeout(() => {
          this.world?.classList.remove('is-birthing');
          if (this.world?.dataset.phase === 'idle') {
            document.body?.classList.remove('db516-tarot-birthing');
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
          engine: 'celestial-fire-integrated-v516'
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

      preloadCardImages(this.state.waiting.slice(0, 8), 8);
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
    this.card.dataset.imageState = 'preparing';
    try {
      const prepared = await this.prepareCardContent(index);
      if (token !== this.cardRenderToken) return false;
      this.commitPreparedCard(index, prepared);
      if (animate && !reducedMotion()) {
        const offset = direction ? Math.sign(direction) * 28 : 0;
        const movement = this.card.animate([
          { opacity: 0.42, transform: `translate3d(${offset}px,10px,0) scale(.94)`, filter: 'blur(4px) saturate(1.16)' },
          { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) saturate(1)' }
        ], { duration: HISTORY_TRANSITION_MS, easing: 'cubic-bezier(.16,.82,.18,1)' });
        await movement.finished.catch(() => {});
      }
      this.fire?.absorb(0.22);
      return true;
    } catch (error) {
      if (token === this.cardRenderToken) this.card.dataset.imageState = 'preserved';
      console.info('[Divina] A carta anterior ficou visível enquanto a próxima carrega.', error);
      return false;
    }
  }

  async move(direction) {
    if (this.busy || !this.state.revealed.length) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;
    this.busy = true;
    this.updateControls();
    try { return await this.show(next, true, direction); }
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
    this.signal.textContent = 'A chama reorganiza apenas as cartas ocultas…';
    this.fire?.ignite(0.92);
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
    this.fire?.ignite(1.18);
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
      this.card.innerHTML = '<canvas class="tl516__card-back" data-card-back aria-hidden="true"></canvas>';
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
    this.grid.innerHTML = this.state.revealed.map((cardId, index) => {
      const card = CARDS[cardId];
      if (!card || card.orientation !== 'normal') return '';
      const current = index === this.selected;
      return `<button type="button" data-index="${index}" role="gridcell" class="${current ? 'is-current' : ''}" aria-current="${current ? 'true' : 'false'}" aria-label="${escapeText(card.name)}, carta ${index + 1}">${cardImageMarkup(card, { alt: '', priority: 'low' })}<span>${index + 1}</span></button>`;
    }).join('');
    this.emptyGrid.hidden = this.state.revealed.length > 0;
  }

  updateControls() {
    const revealed = this.state.revealed.length;
    this.position.textContent = revealed ? `${this.selected + 1} de ${revealed}` : '0 de 0';
    this.cardNav.dataset.visible = String(revealed > 0);
    this.prev.disabled = !revealed || this.selected <= 0 || this.busy;
    this.next.disabled = !revealed || this.selected >= revealed - 1 || this.busy;
    this.shuffle.disabled = this.busy || this.state.waiting.length < 2;
    this.resetButton.disabled = this.busy;
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    }
  }

  status() {
    return Object.freeze({
      version: VERSION,
      active: this.active,
      renderer: this.fire?.mode || 'pending',
      canonicalOrb: this.orb?.dataset?.supremeOrbVersion || '501',
      oneLivingOrb: document.querySelectorAll('[data-supreme-orb="living"]').length === 1,
      revealed: this.state.revealed.length,
      remaining: this.state.waiting.length,
      normalOnly: this.state.revealed.every(id => CARDS[id]?.orientation === 'normal'),
      noRepeats: new Set(this.state.revealed).size === this.state.revealed.length,
      gridColumns: 6,
      atomicBirth: this.world.dataset.birthSync === 'decoded-atomic',
      decodedBeforeSwap: this.card.dataset.imageState !== 'blank',
      organicCanvasFire: this.world.dataset.flameTexture === 'procedural-no-image',
      trueCelestialFire: this.world.dataset.flameArchitecture === 'integrated-volumetric-field-v516',
      celestialFireScheduled: false,
      lightningStrokes: this.world.dataset.lightningStrokes !== 'none',
      strokedFirePaths: Number(this.world.dataset.strokedFirePaths || 0),
      whiteOverexposure: this.world.dataset.whiteOverexposure !== 'false',
      volumetricBillows: true,
      flameTongues: true,
      cardEdgeBurst: this.world.dataset.birthCorona === 'card-edge',
      responsiveAltar: this.world.dataset.responsiveAltar === 'v516',
      volumetricFire: true,
      fireInsideUniverseCanvas: this.world.dataset.frameArchitecture === 'universal-single-raf',
      cosmicNebula: true,
      livingUniverse: this.world.dataset.universeAuthority === 'living-universe-core-v516',
      physicalCardJourney: this.world.dataset.birthJourney === 'orb-to-card',
      stellarFoundation: this.world.dataset.universeAuthority === 'living-universe-core-v516',
      optimizedCosmicBackdrop: false,
      staticUniverseImage: this.world.dataset.staticUniverseImage !== 'false',
      universalUniverseCanvas: this.world.dataset.universeAuthority === 'living-universe-core-v516',
      skinReactiveUniverse: this.world.dataset.skinReactiveUniverse === '30-palettes',
      retinaAdaptiveEffects: this.world.dataset.effectsResolution === 'global-adaptive',
      spriteAtlasParticles: this.world.dataset.particleArchitecture === 'palette-sprite-atlas',
      smoothBirthJourney: this.world.dataset.birthEasing === 'compositor-v516',
      oneAnimationCadence: this.world.dataset.frameArchitecture === 'universal-single-raf',
      unexplainedFlyingCards: this.world.dataset.decorativeCards !== 'none',
      targetFps: this.fire?.targetFps || 0
    });
  }

  destroy() {
    this.leave(routeNow());
    this.abort.abort();
    clearTimeout(this.resetTimer);
    clearTimeout(this.birthTimer);
    this.routeObserver?.disconnect();
    this.fire?.destroy();
    if (globalThis.divinaTarotLivreV516 === this) delete globalThis.divinaTarotLivreV516;
    delete document.documentElement.dataset.tarotLivre;
  }
}
