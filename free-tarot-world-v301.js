/* DIVINA BRUXA 2.0 — REBIRTH R002 · TAROT LIVRE: O CÍRCULO VIVO · V301
   78 cartas diretas, sem repetição. A Orbe revela; o visitante explora; Whit não interpreta. */

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

const STORAGE_KEY = 'free-tarot';
const REVEAL_OUT_MS = 118;
const REVEAL_IN_MS = 360;

const wait = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[character]));

function randomInt(max) {
  if (max <= 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const bucket = new Uint32Array(1);
    globalThis.crypto.getRandomValues(bucket);
    return bucket[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function announce(message) {
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:message }));
}

const WHIT_LINES = Object.freeze([
  'Fique nesta carta o tempo que quiser. Aqui não existe pressa.',
  'Eu não vou interpretar por você. Primeiro, olha.',
  'A carta chegou. O significado pode esperar.',
  'Se quiser aprofundar depois, a Biblioteca está aberta.',
  'Você pode voltar para qualquer carta já revelada sem perder o círculo.',
  'Aqui o Tarot continua livre: uma imagem, um encontro, nenhuma sentença.'
]);

export class FreeTarot {
  constructor(root, { storage = store } = {}) {
    if (!root) throw new TypeError('O mundo do Tarot Livre não foi encontrado.');
    this.root = root;
    this.storage = storage;
    this.abort = new AbortController();
    this.coordinator = new TarotSessionCoordinator({ storage:this.storage, key:STORAGE_KEY });
    this.state = this.coordinator.latest();
    this.selected = this.state.revealed.length ? this.state.revealed.length - 1 : -1;
    this.busy = false;
    this.touchStart = null;
    this.root.dataset.tarotWorld = 'rebirth-v301';
    this.root.classList.add('tarot-world-v301-host');
    this.build();
    this.bind();
    this.render(false);
    preloadCardImages([this.state.waiting[0], this.state.waiting[1]], 2);
  }

  build() {
    this.root.innerHTML = `
      <div class="ft301" data-phase="rest">
        <header class="ft301__head">
          <div><span>DIVINA BRUXA</span><h2>Tarot Livre</h2></div>
          <p><b data-count>0</b><small>/78</small></p>
        </header>

        <section class="ft301__ritual" aria-label="Tarot Livre">
          <div class="ft301__sky" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="ft301__card-zone" data-card-zone tabindex="0" aria-label="Carta atual. Use as setas para navegar entre cartas reveladas.">
            <div class="ft301__card" data-current-card></div>
          </div>

          <button class="ft301__orb" type="button" data-reveal aria-label="Revelar uma carta pela Orbe">
            <span class="ft301__orb-image" data-orb-surface="tarot"></span>
            <span class="ft301__orb-glow" aria-hidden="true"></span>
          </button>

          <div class="ft301__signal" aria-live="polite" aria-atomic="true" data-signal>Toque a Orbe.</div>

          <nav class="ft301__nav" aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">←</button>
            <span data-position>0 · 0</span>
            <button type="button" data-next aria-label="Próxima carta">→</button>
          </nav>
        </section>

        <div class="ft301__actions" aria-label="Controles do Tarot Livre">
          <button type="button" data-shuffle>Embaralhar ocultas</button>
          <button type="button" data-reset>Novo círculo</button>
        </div>

        <section class="ft301__constellation" aria-labelledby="ft301ConstellationTitle">
          <header>
            <h3 id="ft301ConstellationTitle">Seu círculo</h3>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="ft301__grid" data-grid role="grid" aria-label="Cartas reveladas, seis por linha" aria-colcount="6"></div>
        </section>

        <p class="ft301__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world = this.root.querySelector('.ft301');
    this.revealButton = this.root.querySelector('[data-reveal]');
    this.cardZone = this.root.querySelector('[data-card-zone]');
    this.card = this.root.querySelector('[data-current-card]');
    this.signal = this.root.querySelector('[data-signal]');
    this.count = this.root.querySelector('[data-count]');
    this.position = this.root.querySelector('[data-position]');
    this.remaining = this.root.querySelector('[data-remaining]');
    this.grid = this.root.querySelector('[data-grid]');
    this.prev = this.root.querySelector('[data-prev]');
    this.next = this.root.querySelector('[data-next]');
    this.shuffle = this.root.querySelector('[data-shuffle]');
    this.resetButton = this.root.querySelector('[data-reset]');
    this.live = this.root.querySelector('[data-live]');
  }

  bind() {
    const options = { signal:this.abort.signal };
    this.revealButton.addEventListener('click', () => this.draw(), options);
    this.prev.addEventListener('click', () => this.move(-1), options);
    this.next.addEventListener('click', () => this.move(1), options);
    this.shuffle.addEventListener('click', () => this.reshuffle(), options);
    this.resetButton.addEventListener('click', () => this.reset(), options);

    this.cardZone.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this.move(1); }
    }, options);

    this.cardZone.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.touchStart = { x:event.clientX, y:event.clientY, at:performance.now() };
    }, options);

    this.cardZone.addEventListener('pointerup', event => {
      const start = this.touchStart;
      this.touchStart = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
      this.move(dx < 0 ? 1 : -1);
    }, options);

    this.cardZone.addEventListener('pointercancel', () => { this.touchStart = null; }, options);

    this.grid.addEventListener('click', event => {
      const button = event.target.closest('[data-index]');
      if (!button) return;
      const index = Number(button.dataset.index);
      if (Number.isInteger(index)) this.show(index, true);
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
    globalThis.addEventListener?.('storage', this.onStorage, { signal:this.abort.signal });
  }

  setPhase(phase) {
    this.world.dataset.phase = phase;
    const busy = phase !== 'rest';
    this.world.setAttribute('aria-busy', String(busy));
    this.revealButton.disabled = busy || this.state.completed;
  }

  async draw() {
    if (this.busy || this.state.completed) return null;
    this.busy = true;
    this.setPhase('collapse');
    this.signal.textContent = 'A Orbe abre espaço…';

    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest));
      this.state = result.state;
      if (result.cardId === null) return null;
      this.selected = result.position;

      const imageTask = prepareCardImage(CARDS[result.cardId], { timeout:1600, priority:'high' });
      if (!reducedMotion()) await wait(REVEAL_OUT_MS);
      this.setPhase('singularity');
      await imageTask;
      this.render(true);
      this.setPhase('birth');
      if (!reducedMotion()) await wait(REVEAL_IN_MS);
      this.setPhase('rest');

      const card = CARDS[result.cardId];
      this.signal.textContent = card?.name || 'Carta revelada';
      this.live.textContent = `${card?.name || 'Carta'}, direta. ${result.position + 1} de 78.`;
      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed', {
        detail:{ cardId:result.cardId, position:result.position, remaining:this.state.waiting.length }
      }));
      this.maybeWhit(result.position);
      preloadCardImages([this.state.waiting[0], this.state.waiting[1]], 2);
      return result.cardId;
    } catch (error) {
      console.error('[Divina Rebirth] Tarot Livre interrompido', error);
      this.state = this.coordinator.latest();
      this.selected = this.state.revealed.length - 1;
      this.render(false);
      this.signal.textContent = 'O círculo foi preservado. Toque novamente.';
      announce('A revelação foi interrompida, mas nenhuma carta foi perdida.');
      return null;
    } finally {
      this.busy = false;
      this.setPhase('rest');
    }
  }

  show(index, animate = false) {
    if (!Number.isInteger(index) || index < 0 || index >= this.state.revealed.length) return false;
    this.selected = index;
    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') return false;

    this.card.innerHTML = `${cardImageMarkup(card, { alt:`${card.name}, direta`, priority:'high' })}<div class="ft301__card-name"><b>${escapeText(card.name)}</b><small>${index + 1} / ${this.state.revealed.length}</small></div>`;
    this.card.dataset.empty = 'false';
    this.cardZone.setAttribute('aria-label', `${card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}. Deslize ou use as setas para navegar.`);

    if (animate && !reducedMotion()) {
      this.card.animate([
        { opacity:0, transform:'translate3d(0,44px,0) scale(.72) rotate(-2deg)', filter:'blur(12px)' },
        { opacity:1, transform:'translate3d(0,-7px,0) scale(1.025)', filter:'blur(0)', offset:.72 },
        { opacity:1, transform:'translate3d(0,0,0) scale(1)', filter:'blur(0)' }
      ], { duration:540, easing:'cubic-bezier(.16,.85,.18,1)' });
    }

    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button => {
      const active = Number(button.dataset.index) === index;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    preloadCardImages([this.state.revealed[index - 1], this.state.revealed[index + 1]], 2);
    return true;
  }

  move(direction) {
    if (this.busy || !this.state.revealed.length) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;
    const previous = this.selected;
    this.show(next, false);
    if (!reducedMotion()) {
      const x = direction > 0 ? 24 : -24;
      this.card.animate([
        { opacity:.4, transform:`translate3d(${x}px,0,0) scale(.985)` },
        { opacity:1, transform:'translate3d(0,0,0) scale(1)' }
      ], { duration:230, easing:'cubic-bezier(.2,.8,.2,1)' });
    }
    if (previous !== this.selected) this.live.textContent = `Carta ${this.selected + 1} de ${this.state.revealed.length}.`;
    return true;
  }

  async reshuffle() {
    if (this.busy || this.state.waiting.length < 2) return false;
    const revealed = this.state.revealed.join(',');
    try {
      this.state = await this.coordinator.commit(latest => shuffleRemainingCards(latest));
      if (this.state.revealed.join(',') !== revealed) throw new Error('As cartas já reveladas mudaram.');
      preloadCardImages([this.state.waiting[0], this.state.waiting[1]], 2);
      this.signal.textContent = 'As cartas ocultas mudaram de posição.';
      this.pulseOrb();
      return true;
    } catch {
      announce('Não foi possível embaralhar agora. O círculo revelado continua intacto.');
      return false;
    }
  }

  async reset(force = false) {
    if (this.busy) return false;
    if (this.state.revealed.length && force !== true && globalThis.confirm && !globalThis.confirm('Abrir um novo círculo e fechar as cartas reveladas agora?')) return false;
    try {
      this.state = await this.coordinator.commit(latest => resetTarotState({
        now:() => Math.max(Date.now(), Number(latest.updatedAt || 0) + 1)
      }));
      this.selected = -1;
      this.render(false);
      this.signal.textContent = 'Novo círculo. Toque a Orbe quando quiser.';
      this.pulseOrb();
      return true;
    } catch {
      announce('O círculo atual foi preservado. Tente novamente.');
      return false;
    }
  }

  pulseOrb() {
    if (reducedMotion()) return;
    this.revealButton.animate([
      { transform:'scale(1)' },
      { transform:'scale(1.055)', offset:.45 },
      { transform:'scale(1)' }
    ], { duration:520, easing:'ease-out' });
  }

  maybeWhit(position) {
    if (position !== 0 && randomInt(4) !== 0) return;
    const presence = globalThis.divinaWhit?.presence;
    if (!presence?.speak) return;
    presence.speak(WHIT_LINES[randomInt(WHIT_LINES.length)], { duration:6200 });
  }

  render(animateCurrent = false) {
    const total = this.state.revealed.length;
    const waiting = this.state.waiting.length;
    this.count.textContent = String(total);
    this.remaining.textContent = waiting ? `${waiting} aguardam` : 'círculo completo';
    this.shuffle.disabled = this.busy || waiting < 2;
    this.resetButton.disabled = this.busy;
    this.revealButton.disabled = this.busy || this.state.completed;
    this.revealButton.setAttribute('aria-label', waiting ? `Revelar próxima carta pela Orbe. ${waiting} cartas ainda ocultas.` : 'As 78 cartas foram reveladas.');

    this.grid.innerHTML = this.state.revealed.map((cardId, index) => {
      const card = CARDS[cardId];
      if (!card || card.orientation !== 'normal') return '';
      return `<button type="button" role="gridcell" data-index="${index}" aria-label="${escapeText(card.name)}, direta, carta ${index + 1}" aria-current="${index === this.selected ? 'true' : 'false'}" class="${index === this.selected ? 'is-current' : ''}">${cardImageMarkup(card, { decorative:true, priority:index >= total - 6 ? 'auto' : 'lazy' })}<span>${index + 1}</span></button>`;
    }).join('');

    if (!total) {
      this.card.innerHTML = '<div class="ft301__empty-card" aria-hidden="true"><span>✦</span></div>';
      this.card.dataset.empty = 'true';
      this.cardZone.setAttribute('aria-label', 'Nenhuma carta revelada. Toque a Orbe para começar.');
      this.signal.textContent = 'Toque a Orbe.';
    } else {
      if (this.selected < 0 || this.selected >= total) this.selected = total - 1;
      this.show(this.selected, animateCurrent);
    }

    this.updateControls();
  }

  updateControls() {
    const total = this.state.revealed.length;
    this.position.textContent = total ? `${this.selected + 1} · ${total}` : '0 · 0';
    this.prev.disabled = !total || this.selected <= 0 || this.busy;
    this.next.disabled = !total || this.selected >= total - 1 || this.busy;
  }

  snapshot() {
    return Object.freeze({
      release:'REBIRTH-R002-V301',
      sessionId:this.state.sessionId,
      revision:this.state.revision,
      revealed:this.state.revealed.length,
      remaining:this.state.waiting.length,
      selected:this.selected,
      normalOnly:this.state.normalOnly === true
    });
  }

  destroy() {
    this.abort.abort();
    this.touchStart = null;
    this.root.classList.remove('tarot-world-v301-host');
    delete this.root.dataset.tarotWorld;
  }
}
