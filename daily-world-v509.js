/* DIVINA BRUXA 2.0 — MACROETAPA V509 · CARTA DO DIA VIVA
   A própria Orbe Suprema V501 ocupa o altar. Uma carta direta nasce por dia,
   com autoridade de Brasília e sem criar outra imagem de Orbe. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js?v=183';
import {
  brasiliaDate,
  createAccountDailyRecord,
  createDailyRecord,
  isDailyRecord,
  nextBrasiliaBoundary,
  resolveDailyIdentity,
  DAILY_ACCOUNT_SELECTION_VERSION,
  DAILY_STORAGE_KEY
} from './daily-policy-v303.js?v=303';
import { dailyMeaning } from './daily-meaning-runtime.js?v=183';

const VERSION = 509;
const safe = value => escapeHTML(value ?? '');
const wait = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => {
  const tier = document.documentElement.dataset.performanceTier || '';
  return tier === 'constrained' || globalThis.navigator?.connection?.saveData === true;
};
const routeNow = () => String(document.body?.dataset?.screen || location.hash || 'home')
  .replace(/^#/, '')
  .trim()
  .toLowerCase() || 'home';
const announce = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:message }));

const dateLabel = date => {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone:'America/Sao_Paulo', weekday:'long', day:'numeric', month:'long'
  }).format(new Date(Date.UTC(year, month - 1, day, 15)));
};

const layerDefinitions = meaning => [
  ['essencia', 'ESSÊNCIA', meaning.dailyEnergy, meaning.essence],
  ['relacoes', 'VÍNCULOS', meaning.love, meaning.relationships],
  ['caminho', 'CAMINHO', meaning.career, meaning.money, meaning.advice],
  ['interior', 'INTERIOR', meaning.spirituality, meaning.light, meaning.tension],
  ['simbolos', 'SÍMBOLOS', ...(meaning.symbols || [])],
  ['pratica', 'HOJE', meaning.reflectionQuestion, meaning.action, meaning.responsibleNotice]
].map(([id, label, ...parts]) => ({ id, label, parts:parts.filter(Boolean) }));

const WHIT_AFTER_REVEAL = Object.freeze([
  card => `${card.name} está aberta. Não precisa transformar isso em uma sentença.`,
  card => `Fique um pouco com ${card.name}. A primeira sensação não precisa ser a resposta final.`,
  card => `${card.name} é uma lente para hoje. O resto continua sendo escolha sua.`
]);

function seededUnit(index, salt = 0) {
  const value = Math.sin((index + 1) * 91.731 + salt * 47.117) * 43758.5453;
  return value - Math.floor(value);
}

export class DailyAuroraEngineV509 {
  constructor(canvas, stage) {
    this.canvas = canvas;
    this.stage = stage;
    this.context = canvas?.getContext?.('2d', { alpha:true, desynchronized:true }) || null;
    this.width = 1;
    this.height = 1;
    this.pixelRatio = 1;
    this.active = false;
    this.frame = 0;
    this.lastTime = 0;
    this.energy = 0.18;
    this.birthStartedAt = 0;
    this.birthDuration = 0;
    this.particles = [];
    this.stars = [];
    this.resizeObserver = globalThis.ResizeObserver && stage
      ? new ResizeObserver(() => this.resize())
      : null;
    this.resizeObserver?.observe(stage);
    this.resize();
  }

  resize() {
    if (!this.canvas || !this.context) return false;
    const rect = this.stage?.getBoundingClientRect?.() || this.canvas.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width || 1));
    this.height = Math.max(1, Math.round(rect.height || 1));
    this.pixelRatio = Math.min(globalThis.devicePixelRatio || 1, constrained() ? 1.25 : 1.75);
    const nextWidth = Math.max(1, Math.round(this.width * this.pixelRatio));
    const nextHeight = Math.max(1, Math.round(this.height * this.pixelRatio));
    if (this.canvas.width !== nextWidth || this.canvas.height !== nextHeight) {
      this.canvas.width = nextWidth;
      this.canvas.height = nextHeight;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
    }
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    const count = constrained() ? 34 : 58;
    this.stars = Array.from({ length:count }, (_, index) => ({
      x:seededUnit(index, 2) * this.width,
      y:seededUnit(index, 7) * this.height,
      radius:0.45 + seededUnit(index, 11) * 1.35,
      phase:seededUnit(index, 17) * Math.PI * 2,
      speed:0.24 + seededUnit(index, 23) * 0.72
    }));
    this.paint(performance.now());
    return true;
  }

  setActive(value) {
    this.active = Boolean(value);
    if (this.active && !this.frame) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame(time => this.loop(time));
    }
    if (!this.active && this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.paint(performance.now());
    }
  }

  pulse(intensity = 0.7) {
    this.energy = clamp(this.energy + Number(intensity || 0.7) * 0.32, 0.18, 1.45);
    this.spawn(constrained() ? 10 : 18, false);
  }

  touch(clientX, clientY) {
    const rect = this.stage?.getBoundingClientRect?.();
    const x = rect?.width ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0.5;
    const y = rect?.height ? clamp((clientY - rect.top) / rect.height, 0, 1) : 0.52;
    this.spawn(constrained() ? 8 : 14, false, x, y);
  }

  birth() {
    this.birthStartedAt = performance.now();
    this.birthDuration = reducedMotion() ? 150 : 1050;
    this.energy = 1.35;
    this.spawn(constrained() ? 56 : 96, true);
  }

  spawn(count, rising = false, sourceX = 0.5, sourceY = 0.53) {
    const limit = constrained() ? 110 : 190;
    for (let index = 0; index < count && this.particles.length < limit; index += 1) {
      const angle = -Math.PI / 2 + (seededUnit(index + this.particles.length, Date.now() % 97) - 0.5) * (rising ? 1.18 : Math.PI * 1.8);
      const speed = (rising ? 72 : 34) + Math.random() * (rising ? 116 : 74);
      this.particles.push({
        x:sourceX * this.width + (Math.random() - 0.5) * 26,
        y:sourceY * this.height + (Math.random() - 0.5) * 22,
        vx:Math.cos(angle) * speed,
        vy:Math.sin(angle) * speed - (rising ? 34 : 2),
        life:0,
        ttl:0.55 + Math.random() * (rising ? 1.1 : 0.72),
        size:0.9 + Math.random() * (rising ? 3.4 : 2.1),
        hue:index % 4 === 0 ? 38 : index % 3 === 0 ? 312 : 274,
        twist:(Math.random() - 0.5) * 2.2
      });
    }
  }

  loop(timestamp) {
    this.frame = 0;
    if (!this.active) return;
    const delta = Math.min(0.05, Math.max(0.001, (timestamp - this.lastTime) / 1000));
    this.lastTime = timestamp;
    this.update(delta);
    this.paint(timestamp);
    this.frame = requestAnimationFrame(time => this.loop(time));
  }

  update(delta) {
    this.energy += (0.18 - this.energy) * Math.min(1, delta * 1.8);
    for (const particle of this.particles) {
      particle.life += delta;
      particle.vx += Math.sin(particle.life * 7 + particle.twist) * 13 * delta;
      particle.vy -= 11 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
    }
    this.particles = this.particles.filter(particle => particle.life < particle.ttl);
  }

  paint(timestamp) {
    const context = this.context;
    if (!context) return;
    const width = this.width;
    const height = this.height;
    const time = timestamp * 0.001;
    const bornProgress = this.birthStartedAt && this.birthDuration
      ? clamp((timestamp - this.birthStartedAt) / this.birthDuration, 0, 1)
      : 1;
    if (bornProgress >= 1) this.birthStartedAt = 0;

    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'lighter';

    const breath = 0.88 + Math.sin(time * 0.72) * 0.08 + this.energy * 0.08;
    const violet = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.54);
    violet.addColorStop(0, `rgba(178,67,255,${0.075 * breath})`);
    violet.addColorStop(0.36, `rgba(112,24,197,${0.05 * breath})`);
    violet.addColorStop(1, 'rgba(18,0,42,0)');
    context.fillStyle = violet;
    context.fillRect(0, 0, width, height);

    const dawn = context.createRadialGradient(width * 0.5, height * 0.56, 0, width * 0.5, height * 0.56, Math.min(width, height) * 0.44);
    dawn.addColorStop(0, `rgba(255,192,91,${0.035 + this.energy * 0.022})`);
    dawn.addColorStop(0.34, `rgba(255,65,201,${0.032 + this.energy * 0.018})`);
    dawn.addColorStop(1, 'rgba(76,8,130,0)');
    context.fillStyle = dawn;
    context.fillRect(0, 0, width, height);

    for (const star of this.stars) {
      const alpha = 0.16 + (Math.sin(time * star.speed + star.phase) * 0.5 + 0.5) * 0.54;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255,240,198,${alpha})`;
      context.fill();
    }

    if (this.birthStartedAt) {
      const wave = Math.sin(Math.PI * bornProgress);
      const beam = context.createLinearGradient(width * 0.5, height * 0.72, width * 0.5, height * 0.12);
      beam.addColorStop(0, 'rgba(255,105,212,0)');
      beam.addColorStop(0.42, `rgba(255,102,221,${0.18 * wave})`);
      beam.addColorStop(0.72, `rgba(255,220,147,${0.42 * wave})`);
      beam.addColorStop(1, 'rgba(255,250,225,0)');
      context.fillStyle = beam;
      context.fillRect(width * 0.5 - (16 + 32 * wave), height * 0.08, 32 + 64 * wave, height * 0.7);
    }

    for (const particle of this.particles) {
      const life = particle.life / particle.ttl;
      const alpha = Math.max(0, Math.sin(Math.PI * life)) * 0.84;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * (1 - life * 0.42), 0, Math.PI * 2);
      context.fillStyle = `hsla(${particle.hue},100%,72%,${alpha})`;
      context.shadowBlur = particle.size * 6;
      context.shadowColor = `hsla(${particle.hue},100%,66%,${alpha})`;
      context.fill();
    }
    context.shadowBlur = 0;
    context.restore();
  }

  destroy() {
    this.setActive(false);
    this.resizeObserver?.disconnect();
    this.particles.length = 0;
    this.stars.length = 0;
    this.context?.clearRect?.(0, 0, this.width, this.height);
  }
}

export class DailyWorldV509 {
  constructor(root, {
    onSave,
    authClient = globalThis.divinaAuth,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null
  } = {}) {
    if (!root) throw new TypeError('O mundo da Carta do Dia não foi encontrado.');
    if (!orbCore?.claim || !orbCore?.orb) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes da Carta do Dia V509.');
    }

    this.root = root;
    this.onSave = typeof onSave === 'function' ? onSave : () => undefined;
    this.authClient = authClient;
    this.orbCore = orbCore;
    this.orb = orbCore.orb;
    this.data = this.readRecord();
    this.identityPromise = resolveDailyIdentity(this.authClient);
    this.drawing = false;
    this.timer = 0;
    this.geometryTimer = 0;
    this.activeLayer = 'essencia';
    this.abort = new AbortController();
    this.unsubAuth = null;
    this.claimRelease = null;
    this.active = false;
    this.currentCard = null;
    this.currentMeaning = null;

    this.root.classList.remove('daily-world-v303-host');
    this.root.classList.add('daily-world-v509-host');
    this.root.dataset.dailyWorld = '509';
    this.build();
    this.aurora = new DailyAuroraEngineV509(this.cosmos, this.sanctuary);
    this.bind();
    this.scheduleNextCycle();
    this.renderState(false);

    if (routeNow() === 'daily') requestAnimationFrame(() => this.enter());
    else this.aurora.setActive(false);

    document.documentElement.dataset.dailyWorld = 'v509';
    const readiness = Object.freeze({
      version:VERSION,
      canonicalOrb:'v501',
      oneLivingOrb:true,
      duplicateDailyOrb:false,
      timeZone:'America/Sao_Paulo',
      cards:78,
      normalOnly:true,
      onePerDay:true,
      accountAuthorityPreserved:true,
      localContinuityPreserved:true,
      serverSchemaChanged:false,
      extraApiCalls:0
    });
    globalThis.dispatchEvent?.(new CustomEvent('divina:daily-v509-ready', { detail:readiness }));
  }

  build() {
    const date = brasiliaDate();
    this.root.innerHTML = `
      <section class="dw509" aria-labelledby="dw509Title" data-state="sealed"
               data-daily-rule="one-per-brasilia-day" data-orientation="normal">
        <header class="dw509__head">
          <div><span>ENCONTRO DE HOJE</span><h2 id="dw509Title">Carta do Dia</h2></div>
          <time data-daily-date datetime="${date}">${safe(dateLabel(date))}</time>
        </header>

        <div class="dw509__sanctuary" data-daily-sanctuary aria-describedby="dw509Whisper">
          <canvas class="dw509__cosmos" data-daily-cosmos aria-hidden="true"></canvas>
          <span class="dw509__portal dw509__portal--outer" aria-hidden="true"></span>
          <span class="dw509__portal dw509__portal--inner" aria-hidden="true"></span>
          <div class="dw509__card" data-daily-card hidden></div>
          <div class="dw509__orb-host" data-daily-orb-host></div>

          <div class="dw509__sealed" data-daily-sealed>
            <p class="dw509__whisper" id="dw509Whisper" data-daily-whisper></p>
            <button class="dw509__intention-toggle" type="button" data-intention-toggle aria-expanded="false">Deixar uma intenção</button>
            <div class="dw509__intention" data-intention hidden>
              <label for="dailyIntention509">Uma palavra ou pergunta opcional</label>
              <input id="dailyIntention509" maxlength="120" autocomplete="off" placeholder="Só para você">
            </div>
            <p class="dw509__truth" data-daily-truth></p>
          </div>

          <div class="dw509__identity" data-daily-identity hidden></div>
          <p class="dw509__private" data-daily-private hidden></p>
        </div>

        <nav class="dw509__constellation" data-daily-constellation aria-label="Explorar camadas da carta" hidden></nav>
        <article class="dw509__layer" data-daily-layer-panel aria-live="polite" hidden></article>
        <footer class="dw509__actions" data-daily-actions hidden>
          <button type="button" data-daily-save>Guardar no Diário</button>
          <button type="button" data-daily-whit>Whit, fica comigo nesta carta</button>
        </footer>
        <p class="dw509__source" data-daily-source hidden></p>
        <p class="dw509__sr" data-daily-live role="status" aria-live="polite" aria-atomic="true"></p>
      </section>`;

    this.world = this.root.querySelector('.dw509');
    this.date = this.root.querySelector('[data-daily-date]');
    this.sanctuary = this.root.querySelector('[data-daily-sanctuary]');
    this.cosmos = this.root.querySelector('[data-daily-cosmos]');
    this.orbHost = this.root.querySelector('[data-daily-orb-host]');
    this.card = this.root.querySelector('[data-daily-card]');
    this.sealed = this.root.querySelector('[data-daily-sealed]');
    this.whisper = this.root.querySelector('[data-daily-whisper]');
    this.truth = this.root.querySelector('[data-daily-truth]');
    this.identity = this.root.querySelector('[data-daily-identity]');
    this.privateNote = this.root.querySelector('[data-daily-private]');
    this.constellation = this.root.querySelector('[data-daily-constellation]');
    this.layerPanel = this.root.querySelector('[data-daily-layer-panel]');
    this.actions = this.root.querySelector('[data-daily-actions]');
    this.source = this.root.querySelector('[data-daily-source]');
    this.live = this.root.querySelector('[data-daily-live]');
  }

  bind() {
    const options = { signal:this.abort.signal };

    this.onStorage = event => {
      if (!event.key?.endsWith(`:${DAILY_STORAGE_KEY}`) || !event.newValue) return;
      let next = null;
      try { next = JSON.parse(event.newValue); } catch { return; }
      if (!isDailyRecord(next, brasiliaDate()) || !this.recordMatchesCurrentScope(next)) return;
      this.data = next;
      this.renderState(false);
    };
    this.onVisibility = () => {
      if (document.visibilityState === 'visible') {
        this.refreshCycle();
        this.aurora?.setActive(this.active);
      } else {
        this.aurora?.setActive(false);
      }
    };
    this.onAccountSync = () => {
      this.data = this.readRecord();
      this.renderState(false);
    };

    globalThis.addEventListener?.('storage', this.onStorage, options);
    globalThis.addEventListener?.('online', this.onAccountSync, options);
    globalThis.addEventListener?.('offline', this.onAccountSync, options);
    globalThis.addEventListener?.('divina:account-sync-applied', this.onAccountSync, options);
    document.addEventListener('visibilitychange', this.onVisibility, options);

    this.unsubAuth = this.authClient?.onAuthStateChange?.(() => {
      this.identityPromise = resolveDailyIdentity(this.authClient);
      this.data = this.readRecord();
      this.renderState(false);
    }) || null;

    this.root.addEventListener('click', event => {
      const toggle = event.target.closest?.('[data-intention-toggle]');
      if (toggle) {
        const intention = this.root.querySelector('[data-intention]');
        const open = intention?.hidden !== false;
        if (intention) intention.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) intention?.querySelector('input')?.focus?.({ preventScroll:true });
        return;
      }

      const layerButton = event.target.closest?.('[data-daily-layer]');
      if (layerButton) {
        this.activeLayer = layerButton.dataset.dailyLayer;
        this.renderLayer();
        this.layerPanel?.scrollIntoView?.({ behavior:reducedMotion() ? 'auto' : 'smooth', block:'nearest' });
        return;
      }

      if (event.target.closest?.('[data-daily-save]')) this.saveToJournal();
      if (event.target.closest?.('[data-daily-whit]')) this.askWhitToStay();
    }, options);

    this.orb.addEventListener('pointerdown', event => {
      if (!this.active || !this.orbHost.contains(this.orb)) return;
      this.world.classList.add('is-orb-touching');
      this.aurora?.touch(event.clientX, event.clientY);
    }, { passive:true, ...options });
    const releaseTouch = () => this.world.classList.remove('is-orb-touching');
    this.orb.addEventListener('pointerup', releaseTouch, { passive:true, ...options });
    this.orb.addEventListener('pointercancel', releaseTouch, { passive:true, ...options });
    this.orb.addEventListener('click', () => {
      if (!this.active || !this.orbHost.contains(this.orb)) return;
      if (this.data) {
        this.orbCore.pulse?.('daily-presence', { intensity:0.72 });
        this.aurora?.pulse(0.72);
        return;
      }
      const intention = this.root.querySelector('#dailyIntention509')?.value || '';
      this.draw(intention);
    }, options);
    this.orb.addEventListener('keydown', event => {
      if (!this.active || !this.orbHost.contains(this.orb) || !['Enter', ' '].includes(event.key)) return;
      if (this.orb.matches?.('button,a')) return;
      event.preventDefault();
      this.orb.click?.();
    }, options);

    document.addEventListener('divina:supreme-orb-pulse', event => {
      if (this.active) this.aurora?.pulse(Number(event.detail?.intensity || 0.45));
    }, options);
    document.addEventListener('divina:route-ready', event => {
      const route = String(event.detail?.id || routeNow()).replace(/^#/, '').toLowerCase();
      if (route === 'daily') this.enter();
      else this.leave(route);
    }, options);
    globalThis.addEventListener?.('hashchange', () => {
      const route = routeNow();
      if (route === 'daily') this.enter();
      else this.leave(route);
    }, options);

    this.routeObserver = globalThis.MutationObserver && document.body
      ? new MutationObserver(() => {
          const route = routeNow();
          if (route === 'daily') this.enter();
          else this.leave(route);
        })
      : null;
    this.routeObserver?.observe(document.body, { attributes:true, attributeFilter:['data-screen'] });
  }

  readRecord(date = brasiliaDate()) {
    let stored = null;
    try { stored = store.get(DAILY_STORAGE_KEY); } catch {}
    return isDailyRecord(stored, date) ? stored : null;
  }

  saveRecord(record) {
    try {
      store.set(DAILY_STORAGE_KEY, record);
      return true;
    } catch {
      announce('Sua carta continua aberta nesta visita, mas este navegador bloqueou a memória local.');
      return false;
    }
  }

  accountActive() {
    return Boolean(this.authClient?.session);
  }

  recordMatchesCurrentScope(record) {
    if (!record) return false;
    const accountRecord = record.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION;
    return this.accountActive() ? accountRecord : !accountRecord;
  }

  scheduleNextCycle() {
    clearTimeout(this.timer);
    const delay = Math.max(1000, nextBrasiliaBoundary().getTime() - Date.now() + 150);
    this.timer = setTimeout(() => {
      this.refreshCycle();
      this.scheduleNextCycle();
    }, delay);
  }

  refreshCycle() {
    const current = this.readRecord();
    if (current && this.recordMatchesCurrentScope(current)) {
      const changed = current.id !== this.data?.id || current.date !== this.data?.date;
      this.data = current;
      if (changed) this.renderState(false);
      return;
    }
    if (this.data && (this.data.date !== brasiliaDate() || !this.recordMatchesCurrentScope(this.data))) {
      this.data = null;
      this.activeLayer = 'essencia';
      this.renderState(false);
    }
  }

  renderState(animate = false) {
    const current = this.readRecord();
    if (current && this.recordMatchesCurrentScope(current)) this.data = current;
    else if (!this.data || !this.recordMatchesCurrentScope(this.data)) this.data = null;
    if (this.data && isDailyRecord(this.data, brasiliaDate())) {
      this.renderRevealed(animate);
    } else {
      this.data = null;
      this.renderSealed();
    }
  }

  updateDate(date = brasiliaDate()) {
    if (!this.date) return;
    this.date.dateTime = date;
    this.date.textContent = dateLabel(date);
  }

  renderSealed() {
    const date = brasiliaDate();
    const account = this.accountActive();
    const offlineAccount = account && globalThis.navigator?.onLine === false;
    this.updateDate(date);
    this.currentCard = null;
    this.currentMeaning = null;
    this.world.dataset.state = 'sealed';
    this.world.classList.remove('is-revealed', 'is-born', 'is-opening');
    this.sanctuary.classList.remove('is-opening');
    this.sanctuary.removeAttribute('aria-busy');
    this.card.hidden = true;
    this.card.innerHTML = '';
    this.sealed.hidden = false;
    this.identity.hidden = true;
    this.identity.innerHTML = '';
    this.privateNote.hidden = true;
    this.privateNote.textContent = '';
    this.constellation.hidden = true;
    this.constellation.innerHTML = '';
    this.layerPanel.hidden = true;
    this.layerPanel.innerHTML = '';
    this.actions.hidden = true;
    this.source.hidden = true;
    this.whisper.innerHTML = offlineAccount
      ? 'Sua conta está aqui.<br><span>Reconecte para confirmar a carta deste dia.</span>'
      : 'Chegue ao dia.<br><span>Quando sentir, toque a Orbe.</span>';
    this.truth.textContent = `${account ? 'conta sincronizada' : 'este dispositivo'} · 1 carta · 1 dia · Brasília · sempre direta`;
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(offlineAccount));
      this.orb.setAttribute('aria-label', offlineAccount
        ? 'Orbe das Realidades. Reconecte para abrir a Carta do Dia desta conta.'
        : 'Orbe das Realidades. Toque para abrir a Carta do Dia.');
    }
    this.live.textContent = offlineAccount ? 'Reconecte para confirmar a carta da sua conta.' : '';
    this.refreshOrbGeometry();
  }

  async draw(intention = '') {
    if (this.drawing) return null;
    const existing = this.readRecord();
    if (existing && this.recordMatchesCurrentScope(existing)) {
      this.data = existing;
      this.renderRevealed(false);
      return existing.id;
    }
    const account = this.accountActive();
    if (account && globalThis.navigator?.onLine === false) {
      announce('Reconecte para confirmar a Carta do Dia desta conta. Se ela já tiver sido aberta neste aparelho, continuará disponível offline.');
      return null;
    }

    this.drawing = true;
    this.world.classList.add('is-opening');
    this.sanctuary.classList.add('is-opening');
    this.sanctuary.setAttribute('aria-busy', 'true');
    this.orb.setAttribute('aria-disabled', 'true');
    this.live.textContent = 'A Orbe está encontrando a carta deste dia.';
    this.orbCore.pulse?.('daily-summon', { intensity:1.08 });
    this.aurora?.pulse(1.1);
    globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', {
      detail:{ phrase:'Só existe uma carta para hoje. Eu vou ficar por perto, sem decidir o significado por você.' }
    }));

    try {
      const identity = await this.identityPromise;
      let record = null;
      if (account) {
        if (!this.authClient?.enabled || typeof this.authClient.dailyCard !== 'function') throw new Error('account-daily-unavailable');
        const remote = await this.authClient.dailyCard();
        if (!remote?.ok) throw new Error('account-daily-unconfirmed');
        record = createAccountDailyRecord(remote.body, intention);
      } else {
        record = createDailyRecord(intention, new Date(), identity);
      }

      const concurrent = this.readRecord(record.date);
      this.data = concurrent || record;
      if (!concurrent) this.saveRecord(record);
      if (!reducedMotion()) await wait(620);
      this.renderRevealed(true);
      this.aurora?.birth();
      this.orbCore.pulse?.('daily-birth', { intensity:1.2 });
      return this.data.id;
    } catch {
      this.world.classList.remove('is-opening');
      this.sanctuary.classList.remove('is-opening');
      this.sanctuary.removeAttribute('aria-busy');
      this.orb.setAttribute('aria-disabled', 'false');
      this.live.textContent = 'A carta não abriu. Você pode tocar novamente.';
      announce('A Carta do Dia não abriu agora. Nada foi trocado; toque novamente.');
      return null;
    } finally {
      this.drawing = false;
    }
  }

  renderRevealed(animate = false) {
    if (!isDailyRecord(this.data, brasiliaDate())) {
      this.data = null;
      this.renderSealed();
      return;
    }

    const card = CARDS[this.data.id];
    if (!card || card.orientation !== 'normal') {
      this.data = null;
      this.renderSealed();
      announce('A carta recebida não pertence ao catálogo normal das 78 cartas.');
      return;
    }

    const meaning = dailyMeaning(card);
    const layers = layerDefinitions(meaning);
    const active = layers.find(layer => layer.id === this.activeLayer) || layers[0];
    const keywords = (meaning.keywords || []).slice(0, 4);
    const account = this.data.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION;
    this.currentCard = card;
    this.currentMeaning = meaning;
    this.layers = layers;
    this.activeLayer = active.id;
    this.updateDate(this.data.date);

    this.world.dataset.state = 'revealed';
    this.world.classList.add('is-revealed');
    this.world.classList.toggle('is-born', animate);
    this.world.classList.remove('is-opening');
    this.sanctuary.classList.remove('is-opening');
    this.sanctuary.removeAttribute('aria-busy');
    this.card.hidden = false;
    this.card.innerHTML = cardImageMarkup(card, { alt:`${card.name}, direta`, priority:'high' });
    this.card.tabIndex = 0;
    this.card.setAttribute('aria-label', `${card.name}, carta do dia, direta`);
    this.sealed.hidden = true;
    this.identity.hidden = false;
    this.identity.innerHTML = `
      <span>DIRETA</span>
      <h3>${safe(card.name)}</h3>
      ${keywords.length ? `<p>${keywords.map(safe).join(' · ')}</p>` : ''}`;
    this.privateNote.hidden = !this.data.intention;
    this.privateNote.textContent = this.data.intention ? `“${this.data.intention}”` : '';
    this.constellation.hidden = false;
    this.constellation.innerHTML = layers.map(layer => `
      <button type="button" data-daily-layer="${layer.id}" aria-pressed="${layer.id === active.id}">
        <span aria-hidden="true">✦</span>${layer.label}
      </button>`).join('');
    this.layerPanel.hidden = false;
    this.actions.hidden = false;
    this.source.hidden = false;
    this.source.textContent = `${account ? 'Conta sincronizada · mesma carta nos seus dispositivos' : 'Este dispositivo · disponível offline'} · novo ciclo à meia-noite de Brasília`;
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', 'false');
      this.orb.setAttribute('aria-label', `Orbe das Realidades junto de ${card.name}. Toque para sentir a presença.`);
    }
    this.renderLayer();
    this.live.textContent = animate ? `${card.name}, direta. Sua Carta do Dia foi revelada.` : `${card.name}, direta. Carta deste dia.`;
    this.refreshOrbGeometry();

    if (animate) {
      const phrase = WHIT_AFTER_REVEAL[Math.floor(Math.random() * WHIT_AFTER_REVEAL.length)](card);
      setTimeout(() => globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', { detail:{ phrase } })), reducedMotion() ? 60 : 1180);
      setTimeout(() => this.world?.classList.remove('is-born'), reducedMotion() ? 180 : 1250);
    }
  }

  renderLayer() {
    if (!this.currentMeaning || !this.layers?.length) return;
    const active = this.layers.find(layer => layer.id === this.activeLayer) || this.layers[0];
    this.activeLayer = active.id;
    this.constellation.querySelectorAll('[data-daily-layer]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.dailyLayer === active.id));
    });
    this.layerPanel.innerHTML = `
      <span>${active.label}</span>
      ${active.parts.map(part => `<p>${safe(part)}</p>`).join('')}`;
  }

  async saveToJournal() {
    if (!this.currentCard || !this.currentMeaning) return;
    const saveButton = this.root.querySelector('[data-daily-save]');
    if (saveButton) saveButton.disabled = true;
    try {
      await Promise.resolve(this.onSave({
        title:`Carta do Dia — ${this.currentCard.name}`,
        text:`${this.currentMeaning.dailyEnergy}\n\n${this.currentMeaning.essence}\n\n${this.currentMeaning.advice}\n\nAção possível: ${this.currentMeaning.action}`,
        question:this.data?.intention || this.currentMeaning.reflectionQuestion,
        tags:`carta do dia, ${this.currentCard.suit}`,
        mood:'Reflexiva',
        cardId:this.currentCard.id,
        type:'daily',
        orientation:'normal'
      }));
      if (saveButton) saveButton.textContent = 'Guardada no Diário';
      announce('Sua Carta do Dia foi guardada no Diário.');
    } catch {
      if (saveButton) saveButton.disabled = false;
      announce('Não foi possível guardar agora. Sua carta continua aberta.');
    }
  }

  askWhitToStay() {
    if (!this.currentCard) return;
    const phrase = WHIT_AFTER_REVEAL[Math.floor(Math.random() * WHIT_AFTER_REVEAL.length)](this.currentCard);
    globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', { detail:{ phrase } }));
  }

  refreshOrbGeometry() {
    if (!this.active || !this.orbHost.contains(this.orb)) return;
    const refresh = () => {
      this.orbCore.renderer?.resize?.();
      this.orbCore.motion?.refresh?.();
      this.aurora?.resize();
    };
    requestAnimationFrame(refresh);
    clearTimeout(this.geometryTimer);
    this.geometryTimer = setTimeout(refresh, reducedMotion() ? 40 : 760);
  }

  enter() {
    if (this.active && this.orbHost.contains(this.orb)) {
      this.aurora?.setActive(document.visibilityState !== 'hidden');
      return true;
    }
    this.active = true;
    try {
      this.claimRelease = this.orbCore.claim(this.orbHost, {
        mode:'daily',
        ariaLabel:this.data
          ? 'Orbe das Realidades junto da Carta do Dia.'
          : 'Orbe das Realidades. Toque para abrir a Carta do Dia.'
      });
    } catch (error) {
      this.active = false;
      console.error('[Divina] A Orbe não alcançou o altar diário.', error);
      return false;
    }
    this.world.dataset.orbClaimed = 'true';
    this.orb.dataset.dailyReveal = 'v509';
    const offlineAccount = this.accountActive() && globalThis.navigator?.onLine === false;
    this.orb.setAttribute('aria-disabled', String(!this.data && offlineAccount));
    this.orb.setAttribute('aria-label', this.data && this.currentCard
      ? `Orbe das Realidades junto de ${this.currentCard.name}. Toque para sentir a presença.`
      : offlineAccount
        ? 'Orbe das Realidades. Reconecte para abrir a Carta do Dia desta conta.'
        : 'Orbe das Realidades. Toque para abrir a Carta do Dia.');
    this.aurora?.setActive(document.visibilityState !== 'hidden');
    requestAnimationFrame(() => {
      this.aurora?.resize();
      this.orbCore.pulse?.('daily-arrival', { intensity:0.68 });
    });
    return true;
  }

  leave(nextRoute = 'home') {
    this.active = false;
    this.world.classList.remove('is-orb-touching', 'is-opening');
    this.sanctuary.classList.remove('is-opening');
    this.sanctuary.removeAttribute('aria-busy');
    this.aurora?.setActive(false);
    delete this.orb.dataset.dailyReveal;
    this.orb.removeAttribute('aria-disabled');
    if (!this.orbHost.contains(this.orb)) return false;
    try { this.claimRelease?.(); }
    catch { this.orbCore.returnHome?.(); }
    this.claimRelease = null;
    delete this.world.dataset.orbClaimed;
    this.orbCore.settleRoute?.(nextRoute, 'daily-leave-v509');
    return true;
  }

  snapshot() {
    return Object.freeze({
      version:VERSION,
      active:this.active,
      state:this.data ? 'revealed' : 'sealed',
      date:this.data?.date || brasiliaDate(),
      cardId:Number.isInteger(this.data?.id) ? this.data.id : null,
      normalOnly:true,
      onePerDay:true,
      canonicalOrb:'v501',
      orbClaimed:Boolean(this.orbHost?.contains(this.orb)),
      duplicateDailyOrb:false,
      auroraCanvas:Boolean(this.aurora?.context),
      accountAuthority:this.data?.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION
    });
  }

  destroy() {
    clearTimeout(this.timer);
    clearTimeout(this.geometryTimer);
    this.abort.abort();
    try { this.unsubAuth?.(); } catch {}
    this.routeObserver?.disconnect();
    this.leave('home');
    this.aurora?.destroy();
    this.root.classList.remove('daily-world-v509-host');
    delete this.root.dataset.dailyWorld;
    if (globalThis.divinaDailyWorldV509 === this) delete globalThis.divinaDailyWorldV509;
    if (document.documentElement.dataset.dailyWorld === 'v509') delete document.documentElement.dataset.dailyWorld;
  }
}
