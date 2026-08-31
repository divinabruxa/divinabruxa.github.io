/* DIVINA BRUXA — MOTOR DEFINITIVO DO TAROT LIVRE — CHECKPOINT 2.1
   Revelação exclusivamente pela Orbe, 78 cartas normais, sem repetição e com retomada segura.
*/
import { CARDS } from './tarot-data.js';
import { store } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import {
  DECK_SIZE,
  createTarotState,
  drawNextCard,
  normalizeTarotState,
  resetTarotState,
  shuffleRemainingCards
} from './tarot-session.js?v=81';

const STORAGE_KEY = 'free-tarot';
const STORAGE_EVENT_SUFFIX = `:${STORAGE_KEY}`;
const EMPTY_ALTAR = '<div class="empty-card"><span>✦</span>A próxima carta nascerá da Orbe.<small>Toque somente na Orbe</small></div>';

function announce(message) {
  if (typeof globalThis.dispatchEvent !== 'function' || typeof globalThis.CustomEvent !== 'function') return;
  globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
}

export class FreeTarot {
  constructor(root, { storage = store } = {}) {
    if (!root) throw new TypeError('A tela do Tarot Livre não foi encontrada.');
    this.root = root;
    this.storage = storage;
    this.altar = root.querySelector('#revealAltar');
    this.stage = root.querySelector('#current');
    this.orb = root.querySelector('#tableOrb');
    this.realTable = root.querySelector('#realTable');
    this.orbState = root.querySelector('#orbState');
    this.shuffleButton = root.querySelector('#shuffleDeck');
    this.resetButton = root.querySelector('#resetDeck');
    this.selected = -1;
    this.drawing = false;
    this.releaseTimer = 0;

    const restored = normalizeTarotState(this.storage.get(STORAGE_KEY, null));
    this.state = restored ?? createTarotState();
    this.selected = this.state.revealed.length - 1;
    this.persist();
    preloadCardImages(this.state.waiting, 3);
    this.bind();
    this.render();
  }

  persist() {
    try {
      this.storage.set(STORAGE_KEY, this.state);
      return true;
    } catch {
      announce('A mesa continua aberta, mas este navegador bloqueou a memória da sessão.');
      return false;
    }
  }

  bind() {
    this.orb.addEventListener('click', () => this.draw());
    this.resetButton.addEventListener('click', () => this.reset());
    this.shuffleButton.addEventListener('click', () => this.reshuffle());
    this.realTable.addEventListener('click', event => {
      const button = event.target.closest('[data-index]');
      if (button) this.show(Number(button.dataset.index), false, true);
    });

    this.onStorage = event => {
      if (!event.key?.endsWith(STORAGE_EVENT_SUFFIX) || !event.newValue) return;
      let incoming = null;
      try { incoming = normalizeTarotState(JSON.parse(event.newValue)); } catch { return; }
      if (!incoming || incoming.updatedAt < this.state.updatedAt) return;
      this.state = incoming;
      this.selected = incoming.revealed.length - 1;
      this.drawing = false;
      this.render();
      preloadCardImages(this.state.waiting, 3);
    };
    globalThis.addEventListener?.('storage', this.onStorage);
  }

  draw() {
    if (this.drawing || this.state.completed) return null;
    this.drawing = true;
    this.altar.classList.add('revealing');
    this.orbState.textContent = 'A CARTA ESTÁ NASCENDO';

    try {
      const result = drawNextCard(this.state);
      if (result.cardId === null) return null;
      this.state = result.state;
      this.selected = result.position;
      this.persist();
      this.render(result.position);
      this.show(result.position, true, false);
      preloadCardImages(this.state.waiting, 3);
      globalThis.navigator?.vibrate?.([12, 22, 18]);
      globalThis.dispatchEvent?.(new CustomEvent('tarot:revealed', {
        detail: { cardId: result.cardId, position: result.position, remaining: this.state.waiting.length }
      }));
      return result.cardId;
    } finally {
      globalThis.clearTimeout(this.releaseTimer);
      this.releaseTimer = globalThis.setTimeout(() => {
        this.drawing = false;
        this.altar.classList.remove('revealing');
        this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR';
      }, 820);
    }
  }

  show(index, animate = true, scroll = false) {
    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card) return;
    this.selected = index;
    this.stage.className = `current table-preview${animate ? ' birth' : ''}`;
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}<div class="card-label"><strong>${card.name}</strong><span>DIRETA</span></div>`;
    this.realTable.querySelectorAll('[data-index]').forEach(button => {
      button.classList.toggle('selected', Number(button.dataset.index) === index);
    });
    if (animate) globalThis.setTimeout(() => this.stage.classList.remove('birth'), 900);
    if (scroll) {
      const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      this.altar.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  render(landing = -1) {
    const total = this.state.revealed.length;
    const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`;
    this.root.querySelector('#remaining').textContent = waiting
      ? `${waiting} cartas aguardam`
      : 'Ciclo completo · 78 cartas reveladas';
    this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`;
    this.orb.disabled = this.state.completed;
    this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Mesa completa');
    this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR';
    this.shuffleButton.disabled = waiting < 2;

    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const cardId = this.state.revealed[index];
      if (cardId === undefined) {
        return `<div class="table-slot waiting" role="listitem" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      }
      const card = CARDS[cardId];
      return `<button data-index="${index}" role="listitem" class="table-slot revealed${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" aria-label="Abrir ${card.name}, direta">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');

    if (total) {
      if (this.selected < 0 || this.selected >= total) this.selected = total - 1;
      this.show(this.selected, false, false);
    } else {
      this.selected = -1;
      this.stage.className = 'current table-preview empty';
      this.stage.innerHTML = EMPTY_ALTAR;
    }
  }

  reset(force = false) {
    if (this.drawing) return false;
    const needsConfirmation = this.state.revealed.length > 0 && force !== true;
    if (needsConfirmation && globalThis.confirm && !globalThis.confirm('Apagar as cartas desta mesa e iniciar um novo baralho?')) return false;
    this.state = resetTarotState();
    this.selected = -1;
    this.persist();
    this.render();
    preloadCardImages(this.state.waiting, 3);
    announce('Uma nova Mesa Real foi preparada.');
    return true;
  }

  reshuffle() {
    if (this.drawing || this.state.waiting.length < 2) return false;
    const revealedBefore = this.state.revealed.join(',');
    this.state = shuffleRemainingCards(this.state);
    if (this.state.revealed.join(',') !== revealedBefore) throw new Error('As cartas reveladas não podem ser movidas.');
    this.persist();
    preloadCardImages(this.state.waiting, 3);
    globalThis.navigator?.vibrate?.(16);
    announce(`${this.state.waiting.length} cartas restantes foram embaralhadas.`);
    return true;
  }

  destroy() {
    globalThis.clearTimeout(this.releaseTimer);
    globalThis.removeEventListener?.('storage', this.onStorage);
  }
}
