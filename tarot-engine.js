/* DIVINA BRUXA — MOTOR DEFINITIVO DO TAROT LIVRE — CHECKPOINT 2.2.1
   Orbe oficial, constelação orbital, Mesa Real 13 × 6 e retomada segura.
*/
import { CARDS } from './tarot-data.js';
import { store } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import { DECK_SIZE, createTarotState, drawNextCard, normalizeTarotState, resetTarotState, shuffleRemainingCards } from './tarot-session.js?v=83';

const STORAGE_KEY = 'free-tarot';
const STORAGE_EVENT_SUFFIX = `:${STORAGE_KEY}`;
const EMPTY_ALTAR = '<div class="empty-card"><span>✦</span>A próxima carta nascerá da Orbe.<small>Toque somente na Orbe</small></div>';
function announce(message) {
  if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
}

export class FreeTarot {
  constructor(root, { storage = store } = {}) {
    if (!root) throw new TypeError('A tela do Tarot Livre não foi encontrada.');
    this.root = root; this.storage = storage;
    this.altar = root.querySelector('#revealAltar'); this.stage = root.querySelector('#current'); this.orb = root.querySelector('#tableOrb'); this.realTable = root.querySelector('#realTable');
    this.orbState = root.querySelector('#orbState'); this.shuffleButton = root.querySelector('#shuffleDeck'); this.resetButton = root.querySelector('#resetDeck');
    this.viewport = root.querySelector('#realTableViewport'); this.compactButton = root.querySelector('#tableCompact'); this.scrollPrevButton = root.querySelector('#tableScrollPrev'); this.scrollNextButton = root.querySelector('#tableScrollNext'); this.viewHint = root.querySelector('#tableViewHint');
    this.lightbox = root.querySelector('#cardLightbox'); this.lightboxImage = root.querySelector('#lightboxImage'); this.lightboxTitle = root.querySelector('#lightboxTitle'); this.lightboxPosition = root.querySelector('#lightboxPosition'); this.lightboxPrev = root.querySelector('#lightboxPrev'); this.lightboxNext = root.querySelector('#lightboxNext'); this.lightboxClose = root.querySelector('#closeCardLightbox');
    this.orbitalCards = root.querySelector('#orbitalCards'); this.ritualRevealed = root.querySelector('#ritualRevealed'); this.ritualRemaining = root.querySelector('#ritualRemaining');
    this.selected = -1; this.lightboxIndex = -1; this.lightboxTrigger = null; this.compactView = this.storage.get('free-tarot-table-compact', false) === true; this.drawing = false; this.releaseTimer = 0; this.scrollFrame = 0; this.lastTableScrollAt = -Infinity;
    this.state = normalizeTarotState(this.storage.get(STORAGE_KEY, null)) ?? createTarotState();
    this.selected = this.state.revealed.length - 1;
    this.persist(); preloadCardImages(this.state.waiting, 3); this.bind(); this.updateViewMode(); this.render();
  }

  persist() {
    try { this.storage.set(STORAGE_KEY, this.state); return true; }
    catch { announce('A mesa continua aberta, mas este navegador bloqueou a memória da sessão.'); return false; }
  }

  bind() {
    this.orb.addEventListener('click', () => this.draw());
    this.resetButton.addEventListener('click', () => this.reset());
    this.shuffleButton.addEventListener('click', () => this.reshuffle());
    this.realTable.addEventListener('click', event => {
      const now = globalThis.performance?.now?.() ?? Date.now();
      if (event.detail > 0 && now - this.lastTableScrollAt < 120) return;
      const button = event.target.closest('[data-index]'); if (!button) return;
      const index = Number(button.dataset.index); this.show(index, false, false); this.openLightbox(index, button);
    });
    this.orbitalCards.addEventListener('click', event => {
      const button = event.target.closest('[data-orbit-index]'); if (!button) return;
      const index = Number(button.dataset.orbitIndex); this.show(index, false, false); this.openLightbox(index, button);
    });
    this.compactButton.addEventListener('click', () => {
      this.compactView = !this.compactView;
      try { this.storage.set('free-tarot-table-compact', this.compactView); } catch { /* preferência não essencial */ }
      this.updateViewMode();
    });
    this.scrollPrevButton.addEventListener('click', () => this.scrollTable(-1)); this.scrollNextButton.addEventListener('click', () => this.scrollTable(1));
    this.viewport.addEventListener('scroll', () => { this.lastTableScrollAt = globalThis.performance?.now?.() ?? Date.now(); globalThis.cancelAnimationFrame?.(this.scrollFrame); this.scrollFrame = globalThis.requestAnimationFrame?.(() => this.updateScrollControls()) ?? 0; }, { passive: true });
    this.viewport.addEventListener('keydown', event => { if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; event.preventDefault(); this.scrollTable(event.key === 'ArrowLeft' ? -1 : 1); });
    this.lightboxClose.addEventListener('click', () => this.closeLightbox()); this.lightboxPrev.addEventListener('click', () => this.moveLightbox(-1)); this.lightboxNext.addEventListener('click', () => this.moveLightbox(1));
    this.lightbox.addEventListener('click', event => { if (event.target === this.lightbox) this.closeLightbox(); });
    this.lightbox.addEventListener('keydown', event => { if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; event.preventDefault(); this.moveLightbox(event.key === 'ArrowLeft' ? -1 : 1); });
    this.lightbox.addEventListener('close', () => this.finishLightboxClose());
    this.onStorage = event => {
      if (!event.key?.endsWith(STORAGE_EVENT_SUFFIX) || !event.newValue) return;
      let incoming = null; try { incoming = normalizeTarotState(JSON.parse(event.newValue)); } catch { return; }
      if (!incoming || incoming.updatedAt < this.state.updatedAt) return;
      this.state = incoming; this.selected = incoming.revealed.length - 1; this.drawing = false; this.render();
      if (this.lightbox.open && this.lightboxIndex >= incoming.revealed.length) this.closeLightbox(); else if (this.lightbox.open) this.renderLightbox();
      preloadCardImages(this.state.waiting, 3);
    };
    globalThis.addEventListener?.('storage', this.onStorage);
  }

  draw() {
    if (this.drawing || this.state.completed) return null;
    this.drawing = true; this.altar.classList.add('revealing'); this.orbState.textContent = 'A CARTA ESTÁ NASCENDO';
    try {
      const result = drawNextCard(this.state); if (result.cardId === null) return null;
      this.state = result.state; this.selected = result.position; this.persist(); this.render(result.position); this.show(result.position, true, false); preloadCardImages(this.state.waiting, 3);
      globalThis.navigator?.vibrate?.([12, 22, 18]); globalThis.dispatchEvent?.(new CustomEvent('tarot:revealed', { detail: { cardId: result.cardId, position: result.position, remaining: this.state.waiting.length } })); return result.cardId;
    } finally {
      globalThis.clearTimeout(this.releaseTimer);
      this.releaseTimer = globalThis.setTimeout(() => { this.drawing = false; this.altar.classList.remove('revealing'); this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR'; }, 820);
    }
  }

  show(index, animate = true, scroll = false) {
    const card = CARDS[this.state.revealed[index]]; if (!card) return;
    this.selected = index; this.stage.className = `current table-preview${animate ? ' birth' : ''}`;
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}<div class="card-label"><strong>${card.name}</strong><span>DIRETA</span></div>`;
    this.realTable.querySelectorAll('[data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    this.orbitalCards.querySelectorAll('[data-orbit-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.orbitIndex) === index));
    if (animate) globalThis.setTimeout(() => this.stage.classList.remove('birth'), 900);
    if (scroll) this.altar.scrollIntoView({ behavior: this.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  reducedMotion() { return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true; }
  updateViewMode() {
    this.viewport.classList.toggle('is-compact', this.compactView); this.compactButton.setAttribute('aria-pressed', String(this.compactView)); this.compactButton.textContent = this.compactView ? 'Ampliar cartas' : 'Ver mesa inteira'; this.viewHint.textContent = this.compactView ? 'As seis colunas estão visíveis na largura da tela.' : 'Deslize para percorrer as seis colunas.'; globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
  }
  scrollTable(direction) { const distance = Math.max(260, this.viewport.clientWidth * .78); this.viewport.scrollBy({ left: direction * distance, behavior: this.reducedMotion() ? 'auto' : 'smooth' }); }
  updateScrollControls() { const maximum = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth); this.scrollPrevButton.disabled = maximum < 2 || this.viewport.scrollLeft <= 2; this.scrollNextButton.disabled = maximum < 2 || this.viewport.scrollLeft >= maximum - 2; }
  centerTablePosition(index) { globalThis.requestAnimationFrame?.(() => { const slot = this.realTable.querySelector(`[data-position="${index}"]`); if (!slot || this.viewport.scrollWidth <= this.viewport.clientWidth) return; const left = slot.offsetLeft - ((this.viewport.clientWidth - slot.offsetWidth) / 2); this.viewport.scrollTo({ left: Math.max(0, left), behavior: this.reducedMotion() ? 'auto' : 'smooth' }); }); }

  openLightbox(index, trigger = null) {
    if (!CARDS[this.state.revealed[index]]) return false;
    this.lightboxIndex = index; this.lightboxTrigger = trigger; this.renderLightbox();
    if (!this.lightbox.open) { document.body.classList.add('card-lightbox-open'); if (typeof this.lightbox.showModal === 'function') this.lightbox.showModal(); else this.lightbox.setAttribute('open', ''); }
    globalThis.requestAnimationFrame?.(() => this.lightboxClose.focus({ preventScroll: true })); return true;
  }
  renderLightbox() {
    const card = CARDS[this.state.revealed[this.lightboxIndex]]; if (!card) return;
    this.lightboxImage.innerHTML = cardImageMarkup(card, { alt: `${card.name}, direta, ampliada`, priority: 'high' }); this.lightboxTitle.textContent = card.name; this.lightboxPosition.textContent = `POSIÇÃO ${this.lightboxIndex + 1} DE ${DECK_SIZE}`; this.lightboxPrev.disabled = this.lightboxIndex <= 0; this.lightboxNext.disabled = this.lightboxIndex >= this.state.revealed.length - 1; preloadCardImages([this.state.revealed[this.lightboxIndex - 1], this.state.revealed[this.lightboxIndex + 1]], 2);
  }
  moveLightbox(direction) { const nextIndex = this.lightboxIndex + direction; if (nextIndex < 0 || nextIndex >= this.state.revealed.length) return false; this.lightboxIndex = nextIndex; this.selected = nextIndex; this.renderLightbox(); this.show(nextIndex, false, false); return true; }
  closeLightbox() { if (!this.lightbox.open) return; if (typeof this.lightbox.close === 'function') this.lightbox.close(); else { this.lightbox.removeAttribute('open'); this.finishLightboxClose(); } }
  finishLightboxClose() { document.body.classList.remove('card-lightbox-open'); const focusTarget = this.lightboxTrigger || this.realTable.querySelector(`[data-index="${this.lightboxIndex}"]`); this.lightboxTrigger = null; focusTarget?.focus?.({ preventScroll: true }); }

  renderOrbit(landing = -1) {
    const total = this.state.revealed.length; const start = Math.max(0, total - 12);
    this.orbitalCards.innerHTML = Array.from({ length: 12 }, (_, slot) => {
      const index = start + slot; const cardId = index < total ? this.state.revealed[index] : undefined; const angle = slot * 30; const style = `--orbit-angle:${angle}deg;--orbit-counter:${-angle}deg`;
      if (cardId === undefined) return `<span role="listitem" class="orbital-card empty" style="${style}" aria-hidden="true"></span>`;
      const card = CARDS[cardId]; return `<button type="button" role="listitem" data-orbit-index="${index}" class="orbital-card${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" style="${style}" aria-label="Ampliar ${card.name}, direta, posição ${index + 1}">${cardImageMarkup(card, { decorative: true })}</button>`;
    }).join('');
  }

  render(landing = -1) {
    const total = this.state.revealed.length; const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`; this.root.querySelector('#remaining').textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas'; this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`; this.ritualRevealed.textContent = String(total); this.ritualRemaining.textContent = String(waiting); this.orb.disabled = this.state.completed; this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Mesa completa'); this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'TOQUE PARA REVELAR'; this.shuffleButton.disabled = waiting < 2;
    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const cardId = this.state.revealed[index]; const row = Math.floor(index / 6) + 1; const column = (index % 6) + 1;
      if (cardId === undefined) return `<div data-position="${index}" class="table-slot waiting" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" aria-disabled="true" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      const card = CARDS[cardId]; return `<button type="button" data-index="${index}" data-position="${index}" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" class="table-slot revealed${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" aria-label="Ampliar ${card.name}, direta, posição ${index + 1}">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');
    this.renderOrbit(landing); this.centerTablePosition(landing); globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
    if (total) { if (this.selected < 0 || this.selected >= total) this.selected = total - 1; this.show(this.selected, false, false); }
    else { this.selected = -1; this.stage.className = 'current table-preview empty'; this.stage.innerHTML = EMPTY_ALTAR; }
  }

  reset(force = false) {
    if (this.drawing) return false;
    if (this.state.revealed.length > 0 && force !== true && globalThis.confirm && !globalThis.confirm('Apagar as cartas desta mesa e iniciar um novo baralho?')) return false;
    this.state = resetTarotState(); this.selected = -1; this.closeLightbox(); this.persist(); this.render(); preloadCardImages(this.state.waiting, 3); announce('Uma nova Mesa Real foi preparada.'); return true;
  }
  reshuffle() {
    if (this.drawing || this.state.waiting.length < 2) return false;
    const revealedBefore = this.state.revealed.join(','); this.state = shuffleRemainingCards(this.state); if (this.state.revealed.join(',') !== revealedBefore) throw new Error('As cartas reveladas não podem ser movidas.'); this.persist(); preloadCardImages(this.state.waiting, 3); globalThis.navigator?.vibrate?.(16); announce(`${this.state.waiting.length} cartas restantes foram embaralhadas.`); return true;
  }
  destroy() { globalThis.clearTimeout(this.releaseTimer); globalThis.cancelAnimationFrame?.(this.scrollFrame); this.closeLightbox(); globalThis.removeEventListener?.('storage', this.onStorage); }
}
