/* DIVINA BRUXA V196 — functional EN/ES Free Tarot with offline atlas.
   Canonical 78-card deck, upright only, no repeats, no meanings. */
import { CARDS, REQUIRED_ORIENTATION } from './tarot-data.js?v=195';
import { applyInternationalCardImageV196 } from './international-card-image-v196.js?v=196';

const randomUnit = () => {
  if (!globalThis.crypto?.getRandomValues) return Math.random();
  const value = new Uint32Array(1);
  globalThis.crypto.getRandomValues(value);
  return value[0] / 4294967296;
};

export function shuffleCanonicalDeck(values = CARDS, random = randomUnit) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

const root = typeof document === 'undefined' ? null : document.querySelector('[data-international-tarot]');

if (root) {
  const language = root.dataset.language === 'es' ? 'es' : 'en';
  const copy = Object.freeze({
    en: Object.freeze({
      empty: 'Touch the Orb to reveal the first card.',
      ready: 'The deck is ready: 78 upright cards, with no repeats.',
      revealed: (name, position, remaining) => `${name} entered position ${position}. ${remaining} cards remain.`,
      completed: 'The Royal Table is complete: 78 unique upright cards.',
      shuffled: 'The unrevealed cards were shuffled. Revealed positions did not change.',
      reset: 'A new Royal Table is ready.',
      reveal: 'Reveal one card',
      complete: 'Table complete',
      cardAlt: (position, name) => `Position ${position}: ${name}, upright`,
      position: position => `Position ${position}, not revealed`
    }),
    es: Object.freeze({
      empty: 'Toca la Orbe para revelar la primera carta.',
      ready: 'El mazo está listo: 78 cartas al derecho, sin repeticiones.',
      revealed: (name, position, remaining) => `${name} entró en la posición ${position}. Quedan ${remaining} cartas.`,
      completed: 'La Mesa Real está completa: 78 cartas únicas al derecho.',
      shuffled: 'Las cartas aún ocultas fueron barajadas. Las posiciones reveladas no cambiaron.',
      reset: 'Una nueva Mesa Real está lista.',
      reveal: 'Revelar una carta',
      complete: 'Mesa completa',
      cardAlt: (position, name) => `Posición ${position}: ${name}, al derecho`,
      position: position => `Posición ${position}, sin revelar`
    })
  })[language];

  const table = root.querySelector('[data-real-table]');
  const drawButton = root.querySelector('[data-draw-card]');
  const shuffleButton = root.querySelector('[data-shuffle-remaining]');
  const resetButton = root.querySelector('[data-reset-table]');
  const status = root.querySelector('[data-tarot-status]');
  const count = root.querySelector('[data-revealed-count]');
  const remainingOutput = root.querySelector('[data-remaining-count]');

  let deck = [];
  let revealed = [];

  const cardName = card => card.names[language];

  const updateCounters = () => {
    count.textContent = String(revealed.length);
    remainingOutput.textContent = String(deck.length);
    drawButton.disabled = deck.length === 0;
    drawButton.querySelector('span').textContent = deck.length ? copy.reveal : copy.complete;
  };

  const makeSlot = (position, card = null) => {
    const slot = document.createElement('div');
    slot.className = `intl-table-slot${card ? ' revealed' : ''}`;
    slot.dataset.position = String(position);
    slot.setAttribute('role', 'gridcell');
    slot.setAttribute('aria-rowindex', String(Math.ceil(position / 6)));
    slot.setAttribute('aria-colindex', String(((position - 1) % 6) + 1));
    if (!card) {
      slot.setAttribute('aria-label', copy.position(position));
      return slot;
    }
    const image = document.createElement('img');
    image.alt = copy.cardAlt(position, cardName(card));
    image.width = 240;
    image.height = 360;
    image.loading = position < 7 ? 'eager' : 'lazy';
    image.decoding = 'async';
    applyInternationalCardImageV196(image, card);
    slot.append(image);
    return slot;
  };

  const render = () => {
    const fragment = document.createDocumentFragment();
    for (let position = 1; position <= 78; position += 1) {
      fragment.append(makeSlot(position, revealed[position - 1] || null));
    }
    table.replaceChildren(fragment);
    updateCounters();
  };

  const revealNext = () => {
    if (!deck.length) return;
    const card = deck.shift();
    if (card.orientation !== REQUIRED_ORIENTATION) throw new Error('The canonical deck orientation changed.');
    revealed.push(card);
    render();
    const message = deck.length
      ? copy.revealed(cardName(card), revealed.length, deck.length)
      : copy.completed;
    status.textContent = message;
    const latest = table.children[revealed.length - 1];
    latest?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
  };

  const reset = () => {
    deck = shuffleCanonicalDeck();
    revealed = [];
    render();
    status.textContent = copy.reset;
  };

  drawButton.addEventListener('click', revealNext);
  shuffleButton.addEventListener('click', () => {
    deck = shuffleCanonicalDeck(deck);
    status.textContent = copy.shuffled;
  });
  resetButton.addEventListener('click', reset);

  deck = shuffleCanonicalDeck();
  render();
  status.textContent = copy.ready;
}
