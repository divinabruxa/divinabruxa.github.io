import { CARDS } from './tarot-data.js';
import { store } from './storage.js';

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
    if (!this.valid()) this.state = fresh();
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
    this.state.reversed.push(random(100) < 22);
    this.state.completed = this.state.waiting.length === 0;
    store.set('free-tarot', this.state);
    const index = this.state.revealed.length - 1;
    this.render(index);
    this.show(index, true, false);
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
    const reversed = Boolean(this.state.reversed[index]);
    this.selected = index;
    this.stage.className = `current table-preview ${reversed ? 'reversed' : ''} ${animate ? 'birth' : ''}`;
    this.stage.innerHTML = `<img src="${card.image}" alt="${card.name}${reversed ? ', invertida' : ', direta'}"><div class="card-label"><strong>${card.name}</strong><span>${reversed ? 'INVERTIDA' : 'DIRETA'}</span></div>`;
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
    this.root.querySelector('#resetDeck').hidden = !this.state.completed;
    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const id = this.state.revealed[index];
      if (id === undefined) return `<div class="table-slot waiting" role="listitem" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      const card = CARDS[id];
      const reversed = Boolean(this.state.reversed[index]);
      return `<button data-index="${index}" role="listitem" class="table-slot revealed ${reversed ? 'is-reversed' : ''} ${index === this.selected ? 'selected' : ''} ${index === landing ? 'landing' : ''}" aria-label="Abrir ${card.name}${reversed ? ', invertida' : ', direta'}"><img src="${card.image}" alt=""><span class="order">${index + 1}</span></button>`;
    }).join('');
    if (total && this.selected < 0) this.show(total - 1, false, false);
  }

  reset() {
    if (!this.state.completed) return;
    this.state = fresh();
    this.selected = -1;
    store.set('free-tarot', this.state);
    this.stage.className = 'current table-preview empty';
    this.stage.innerHTML = '<div class="empty-card"><span>✦</span>A próxima carta nascerá da Orbe.<small>Toque somente na Orbe</small></div>';
    this.render();
  }
}
