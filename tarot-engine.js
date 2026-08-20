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
    this.table = root.querySelector('#tarotTable');
    this.stage = root.querySelector('#current');
    this.drawing = false;
    this.pointer = null;
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
    this.root.querySelector('#nextCard').addEventListener('click', () => this.draw());
    this.root.querySelector('#deckStack').addEventListener('click', () => this.draw());
    this.root.querySelector('#resetDeck').addEventListener('click', () => this.reset());
    this.root.querySelector('#memory').addEventListener('click', event => {
      const button = event.target.closest('[data-index]');
      if (button) this.show(Number(button.dataset.index), false);
    });
    this.table.addEventListener('pointerdown', event => {
      if (event.target.closest('button')) return;
      this.pointer = { x: event.clientX, y: event.clientY, at: performance.now() };
    });
    this.table.addEventListener('pointerup', event => {
      if (!this.pointer || event.target.closest('button')) return;
      const dx = event.clientX - this.pointer.x;
      const dy = event.clientY - this.pointer.y;
      const elapsed = performance.now() - this.pointer.at;
      this.pointer = null;
      if (dy < -45 && Math.abs(dy) > Math.abs(dx) && elapsed < 900) this.draw();
    });
    this.table.addEventListener('pointercancel', () => { this.pointer = null; });
    this.table.addEventListener('keydown', event => {
      if (event.target.closest('button')) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.draw();
      }
    });
  }

  draw() {
    if (this.drawing || !this.state.waiting.length) return;
    this.drawing = true;
    this.table.classList.add('revealing');
    const id = this.state.waiting.shift();
    this.state.revealed.push(id);
    this.state.reversed.push(random(100) < 22);
    this.state.completed = this.state.waiting.length === 0;
    store.set('free-tarot', this.state);
    this.render();
    this.show(this.state.revealed.length - 1, true);
    navigator.vibrate?.([12, 22, 18]);
    window.setTimeout(() => {
      this.drawing = false;
      this.table.classList.remove('revealing');
    }, 760);
  }

  show(index, animate = true) {
    const id = this.state.revealed[index];
    const card = CARDS[id];
    if (!card) return;
    const reversed = Boolean(this.state.reversed[index]);
    this.stage.className = `current ${reversed ? 'reversed' : ''} ${animate ? 'birth' : ''}`;
    this.stage.innerHTML = `<img src="${card.image}" alt="${card.name}${reversed ? ', invertida' : ', direta'}"><div class="card-label"><strong>${card.name}</strong><span>${reversed ? 'INVERTIDA' : 'DIRETA'}</span></div>`;
    this.root.querySelectorAll('#memory [data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    if (animate) window.setTimeout(() => this.stage.classList.remove('birth'), 850);
  }

  render() {
    const total = this.state.revealed.length;
    const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`;
    this.root.querySelector('#remaining').textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas';
    this.root.querySelector('#deckRemaining').textContent = waiting;
    this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`;
    this.root.querySelector('#deckStack').disabled = this.state.completed;
    this.root.querySelector('#deckStack').setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Ciclo completo');
    this.root.querySelector('#nextCard').disabled = this.state.completed;
    this.root.querySelector('#resetDeck').hidden = !this.state.completed;
    this.root.querySelector('#memory').innerHTML = this.state.revealed.map((id, index) => {
      const reversed = this.state.reversed[index];
      return `<button data-index="${index}" class="${reversed ? 'is-reversed' : ''}" aria-label="Rever ${CARDS[id].name}${reversed ? ', invertida' : ''}"><img src="${CARDS[id].image}" alt=""><span>${index + 1}</span></button>`;
    }).join('');
    if (total) this.show(total - 1, false);
  }

  reset() {
    if (!this.state.completed) return;
    this.state = fresh();
    store.set('free-tarot', this.state);
    this.stage.className = 'current empty';
    this.stage.innerHTML = '<div class="empty-card"><span>✦</span>A próxima carta nascerá da Orbe.<small>Toque no baralho</small></div>';
    this.render();
  }
}
