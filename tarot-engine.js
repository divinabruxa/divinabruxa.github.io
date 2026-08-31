import { CARDS } from './tarot-data.js';
import { store } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';

const DECK_SIZE = 78;
const random = max => crypto.getRandomValues(new Uint32Array(1))[0] % max;

function shuffle(ids) {
  const cards = [...ids];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function fresh() {
  return { waiting: shuffle(CARDS.map(card => card.id)), revealed: [], reversed: [], completed: false };
}

export class FreeTarot {
  constructor(root) {
    this.root = root;
    this.altar = root.querySelector('#revealAltar');
    this.stage = root.querySelector('#current');
    this.orb = root.querySelector('#tableOrb');
    this.realTable = root.querySelector('#realTable');
    this.selected = -1;
    this.drawing = false;
    this.state = store.get('free-tarot', fresh());
    this.state.reversed = Array.isArray(this.state.revealed) ? this.state.revealed.map(() => false) : [];
    if (!this.valid()) this.state = fresh();
    preloadCardImages(this.state.waiting, 3);
    this.bind();
    this.render();
  }

  valid() {
    if (!this.state || !Array.isArray(this.state.waiting) || !Array.isArray(this.state.revealed) || !Array.isArray(this.state.reversed)) return false;
    const ids = [...this.state.waiting, ...this.state.revealed];
    return ids.length === DECK_SIZE && new Set(ids).size === DECK_SIZE && ids.every(id => CARDS[id]);
  }

  bind() {
    this.orb.addEventListener('click', () => this.draw());
    this.root.querySelector('#resetDeck').addEventListener('click', () => this.reset());
    this.root.querySelector('#shuffleDeck').addEventListener('click', () => this.reshuffle());
    this.realTable.addEventListener('click', event => {
      const button = event.target.closest('[data-index]');
      if (button) this.show(Number(button.dataset.index), false, true);
    });
  }

  draw() {
    if (this.drawing || !this.state.waiting.length) return;
    this.drawing = true;
    this.altar.classList.add('revealing');
    this.root.querySelector('#orbState').textContent = 'A CARTA ESTÁ NASCENDO';
    const id = this.state.waiting.shift();
    this.state.revealed.push(id);
    this.state.reversed.push(false);
    this.state.completed = this.state.waiting.length === 0;
    store.set('free-tarot', this.state);
    const index = this.state.revealed.length - 1;
    this.render(index);
    this.show(index, true, false);
    preloadCardImages(this.state.waiting, 3);
    navigator.vibrate?.([12, 22, 18]);
    window.setTimeout(() => {
      this.drawing = false;
      this.altar.classList.remove('revealing');
      this.root.querySelector('#orbState').textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR';
    }, 820);
  }

  show(index, animate = true, scroll = false) {
    const id = this.state.revealed[index];
    const card = CARDS[id];
    if (!card) return;
    const reversed = false;
    this.selected = index;
    this.stage.className = `current table-preview ${reversed ? 'reversed' : ''} ${animate ? 'birth' : ''}`;
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}<div class="card-label"><strong>${card.name}</strong><span>DIRETA</span></div>`;
    this.realTable.querySelectorAll('[data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    if (animate) window.setTimeout(() => this.stage.classList.remove('birth'), 900);
    if (scroll) this.altar.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  render(landing = -1) {
    const total = this.state.revealed.length;
    const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`;
    this.root.querySelector('#remaining').textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas';
    this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`;
    this.orb.disabled = this.state.completed;
    this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Mesa completa');
    this.root.querySelector('#orbState').textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR';
    this.root.querySelector('#shuffleDeck').disabled = waiting < 2;
    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const id = this.state.revealed[index];
      if (id === undefined) return `<div class="table-slot waiting" role="listitem" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      const card = CARDS[id];
      const reversed = false;
      return `<button data-index="${index}" role="listitem" class="table-slot revealed ${index === this.selected ? 'selected' : ''} ${index === landing ? 'landing' : ''}" aria-label="Abrir ${card.name}, direta">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');
    if (total && this.selected < 0) this.show(total - 1, false, false);
  }

  reset() {
    if (this.state.revealed.length && !confirm('Apagar as cartas desta mesa e iniciar um novo baralho?')) return;
    this.state = fresh();
    this.selected = -1;
    store.set('free-tarot', this.state);
    this.stage.className = 'current table-preview empty';
    this.stage.innerHTML = '<div class="empty-card"><span>✦</span>A próxima carta nascerá da Orbe.<small>Toque somente na Orbe</small></div>';
    this.render();
    preloadCardImages(this.state.waiting, 3);
  }

  reshuffle() {
    if (this.state.waiting.length < 2) return;
    this.state.waiting = shuffle(this.state.waiting);
    preloadCardImages(this.state.waiting, 3);
    store.set('free-tarot', this.state);
    navigator.vibrate?.(16);
    dispatchEvent(new CustomEvent('orbe:toast',{detail:`${this.state.waiting.length} cartas restantes foram embaralhadas.`}));
  }
}
