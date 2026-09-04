/* DIVINA BRUXA — MOTOR DEFINITIVO DO TAROT LIVRE — CHECKPOINT 2.4
   Orbe oficial, constelação, retomada e regra editorial protegida.
*/
import { CARDS } from './tarot-data.js';
import { store } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=84';
import { DECK_SIZE, compareTarotStates, createTarotBackup, createTarotState, drawNextCard, normalizeTarotState, resetTarotState, restoreTarotBackup, shuffleRemainingCards } from './tarot-session.js?v=84';
import { freeCardAriaLabel, freeCardLabel, isFreeTarotCard, tarotEditorialStatus } from './tarot-editorial-policy.js?v=85';

const STORAGE_KEY = 'free-tarot';
const STORAGE_EVENT_SUFFIX = `:${STORAGE_KEY}`;
const EMPTY_ALTAR = '<div class="empty-card"><span aria-hidden="true">✦</span><b>O PORTAL AGUARDA</b><small>Toque na Orbe para revelar</small></div>';
const PORTAL_OPENING_MS = 320;
const PORTAL_CROSSING_MS = 120;
function announce(message) {
  if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
}

function installOfficialStructure(root) {
  root.classList.add('tarot-livre-official');
  root.dataset.tarotLivre = 'official-v1';

  const eyebrow = root.querySelector('.section-head .eyebrow');
  const title = root.querySelector('.section-head h2');
  const orbState = root.querySelector('#orbState');
  const shuffleButton = root.querySelector('#shuffleDeck');
  const resetButton = root.querySelector('#resetDeck');
  const archiveKicker = root.querySelector('.real-table-head p');
  const archiveTitle = root.querySelector('.real-table-head h3');
  const archive = root.querySelector('#realTable');

  if (eyebrow) eyebrow.textContent = 'O PORTAL DAS 78 CARTAS';
  if (title) title.textContent = 'Tarot Livre';
  if (orbState) orbState.textContent = 'REVELAR CARTA';
  if (shuffleButton) shuffleButton.textContent = 'EMBARALHAR NOVAMENTE';
  if (resetButton) resetButton.textContent = 'RECOMEÇAR DO ZERO';
  if (archiveKicker) archiveKicker.textContent = 'SEU CÍRCULO';
  if (archiveTitle) archiveTitle.textContent = 'Cartas reveladas';
  archive?.setAttribute('aria-label', 'Cartas reveladas em seis colunas');

  const wheel = root.querySelector('.ritual-wheel');
  if (wheel && !root.querySelector('#currentCardNav')) {
    wheel.insertAdjacentHTML('beforeend', '<nav id="currentCardNav" class="tarot-current-nav" aria-label="Navegação das cartas reveladas"><button id="currentCardPrev" type="button" aria-label="Mostrar carta anterior" disabled><span aria-hidden="true">←</span><small>ANTERIOR</small></button><button id="currentCardNext" type="button" aria-label="Mostrar próxima carta" disabled><span aria-hidden="true">→</span><small>PRÓXIMA</small></button></nav>');
  }
  if (wheel && !root.querySelector('#tarotGestureHint')) {
    wheel.insertAdjacentHTML('beforeend', '<p id="tarotGestureHint" class="tarot-gesture-hint"><span aria-hidden="true">←</span> DESLIZE PARA NAVEGAR <span aria-hidden="true">→</span></p>');
  }

  const stage = root.querySelector('#current');
  if (stage) {
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-roledescription', 'carta do Tarot Livre');
    stage.setAttribute('aria-describedby', 'tarotGestureHint');
  }

  const altar = root.querySelector('#revealAltar');
  if (altar && !root.querySelector('#tarotBirthFx')) {
    altar.insertAdjacentHTML('afterbegin', '<div id="tarotBirthFx" class="tarot-birth-fx" aria-hidden="true"><span class="tarot-birth-bridge"></span><span class="tarot-birth-horizon"></span><span class="tarot-birth-gate"><i></i><i></i><i></i></span><span class="tarot-birth-flare"></span><span class="tarot-birth-dust"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div><p id="tarotMagicAnnouncement" class="tarot-magic-sr" role="status" aria-live="polite" aria-atomic="true"></p>');
  }
}

export class FreeTarot {
  constructor(root, { storage = store } = {}) {
    if (!root) throw new TypeError('A tela do Tarot Livre não foi encontrada.');
    this.root = root; this.storage = storage;
    installOfficialStructure(root);
    if (!root.querySelector('#tableSaveState')) root.querySelector('.real-table-tools')?.insertAdjacentHTML('afterend', '<div class="table-recovery" aria-label="Guardar e retomar a Mesa Real"><p><span aria-hidden="true">✧</span><span><b id="tableSaveState">Nova mesa salva neste aparelho</b><small>Você pode fechar e voltar sem perder as cartas.</small></span></p><div><button id="saveTableBackup" type="button">Guardar cópia</button><button id="restoreTableBackup" type="button">Retomar arquivo</button><input id="tableBackupInput" type="file" accept="application/json,.json" hidden></div></div>');
    if (!root.querySelector('#tarotEditorialState')) root.querySelector('.free-rule')?.insertAdjacentHTML('afterend', '<aside class="editorial-covenant" aria-labelledby="editorialCovenantTitle"><span class="editorial-seal" aria-hidden="true">✦</span><div><h3 id="editorialCovenantTitle">A Orbe revela. Você interpreta.</h3><p>O Tarot Livre abre somente a imagem, o nome e a posição. Nenhum significado automático interfere na sua leitura.</p><div class="editorial-principles" aria-label="Princípios do Tarot Livre"><span>78 cartas</span><span>Sempre diretas</span><span>Sem repetição</span></div></div><p id="tarotEditorialState" class="editorial-state" aria-live="polite">O círculo aguarda o primeiro toque na Orbe.</p></aside>');
    this.altar = root.querySelector('#revealAltar'); this.stage = root.querySelector('#current'); this.orb = root.querySelector('#tableOrb'); this.realTable = root.querySelector('#realTable');
    this.orbState = root.querySelector('#orbState'); this.shuffleButton = root.querySelector('#shuffleDeck'); this.resetButton = root.querySelector('#resetDeck');
    this.magicFx = root.querySelector('#tarotBirthFx'); this.magicAnnouncement = root.querySelector('#tarotMagicAnnouncement');
    this.currentNav = root.querySelector('#currentCardNav'); this.currentPrev = root.querySelector('#currentCardPrev'); this.currentNext = root.querySelector('#currentCardNext');
    this.gestureHint = root.querySelector('#tarotGestureHint');
    this.viewport = root.querySelector('#realTableViewport'); this.compactButton = root.querySelector('#tableCompact'); this.scrollPrevButton = root.querySelector('#tableScrollPrev'); this.scrollNextButton = root.querySelector('#tableScrollNext'); this.viewHint = root.querySelector('#tableViewHint');
    this.lightbox = root.querySelector('#cardLightbox'); this.lightboxImage = root.querySelector('#lightboxImage'); this.lightboxTitle = root.querySelector('#lightboxTitle'); this.lightboxPosition = root.querySelector('#lightboxPosition'); this.lightboxPrev = root.querySelector('#lightboxPrev'); this.lightboxNext = root.querySelector('#lightboxNext'); this.lightboxClose = root.querySelector('#closeCardLightbox');
    this.orbitalCards = root.querySelector('#orbitalCards'); this.ritualRevealed = root.querySelector('#ritualRevealed'); this.ritualRemaining = root.querySelector('#ritualRemaining');
    this.backupButton = root.querySelector('#saveTableBackup'); this.restoreButton = root.querySelector('#restoreTableBackup'); this.backupInput = root.querySelector('#tableBackupInput'); this.saveState = root.querySelector('#tableSaveState');
    this.editorialState = root.querySelector('#tarotEditorialState');
    this.selected = -1; this.lightboxIndex = -1; this.lightboxTrigger = null; this.compactView = this.storage.get('free-tarot-table-compact', false) === true; this.drawing = false; this.releaseTimer = 0; this.scrollFrame = 0; this.lastTableScrollAt = -Infinity;
    this.cardGesture = null; this.gestureAnimating = false; this.gestureTimer = 0;
    this.root.dataset.revealPhase = 'idle';
    this.coordinator = new TarotSessionCoordinator({ storage: this.storage, key: STORAGE_KEY });
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
    this.currentPrev.addEventListener('click', () => this.navigateCurrent(-1, 'botão'));
    this.currentNext.addEventListener('click', () => this.navigateCurrent(1, 'botão'));
    this.stage.addEventListener('pointerdown', event => this.beginCardGesture(event));
    this.stage.addEventListener('pointermove', event => this.moveCardGesture(event));
    this.stage.addEventListener('pointerup', event => this.endCardGesture(event));
    this.stage.addEventListener('pointercancel', event => this.endCardGesture(event, true));
    this.stage.addEventListener('keydown', event => this.handleCardKeydown(event));
    this.stage.addEventListener('dragstart', event => event.preventDefault());
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
    this.backupButton.addEventListener('click', () => this.downloadBackup());
    this.restoreButton.addEventListener('click', () => this.backupInput.click());
    this.backupInput.addEventListener('change', event => this.restoreBackupFile(event.target.files?.[0]));
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
      if (!incoming || compareTarotStates(incoming, this.state) <= 0) return;
      this.state = incoming; this.selected = incoming.revealed.length - 1; this.drawing = false; this.render();
      if (this.lightbox.open && this.lightboxIndex >= incoming.revealed.length) this.closeLightbox(); else if (this.lightbox.open) this.renderLightbox();
      preloadCardImages(this.state.waiting, 3);
    };
    globalThis.addEventListener?.('storage', this.onStorage);
    this.onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const latest = this.coordinator.latest();
      if (compareTarotStates(latest, this.state) <= 0) return;
      this.state = latest; this.selected = latest.revealed.length - 1; this.render();
    };
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  async draw() {
    if (this.drawing || this.state.completed) return null;
    const revealStartedAt = globalThis.performance?.now?.() ?? Date.now();
    let revealed = false;
    this.drawing = true; this.altar.classList.add('revealing'); this.startRevealMagic();
    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest)); if (result.cardId === null) return null;
      await this.openRevealPortal(revealStartedAt);
      this.state = result.state; this.selected = result.position; this.persist(); this.render(result.position); this.show(result.position, true, false); preloadCardImages(this.state.waiting, 3);
      this.finishRevealMagic(CARDS[result.cardId], result.position); revealed = true;
      globalThis.navigator?.vibrate?.([12, 22, 18]); globalThis.dispatchEvent?.(new CustomEvent('tarot:revealed', { detail: { cardId: result.cardId, position: result.position, remaining: this.state.waiting.length } })); return result.cardId;
    } finally {
      globalThis.clearTimeout(this.releaseTimer);
      const settleDelay = this.reducedMotion() ? 30 : (revealed ? 1320 : 180);
      this.releaseTimer = globalThis.setTimeout(() => this.settleRevealMagic(), settleDelay);
    }
  }

  startRevealMagic() {
    this.altar.classList.remove('magic-awakening', 'magic-manifesting', 'magic-born');
    this.root.dataset.revealPhase = 'awakening';
    this.altar.setAttribute('aria-busy', 'true'); this.orb.setAttribute('aria-busy', 'true');
    void this.altar.offsetWidth;
    this.altar.classList.add('magic-awakening');
    this.orbState.textContent = 'O PORTAL ESTÁ SE ABRINDO';
    if (this.magicAnnouncement) this.magicAnnouncement.textContent = 'A Orbe está abrindo o portal.';
  }

  async openRevealPortal(startedAt) {
    if (!this.reducedMotion()) {
      const now = globalThis.performance?.now?.() ?? Date.now();
      await new Promise(resolve => globalThis.setTimeout(resolve, Math.max(0, PORTAL_OPENING_MS - (now - startedAt))));
    }
    this.altar.classList.remove('magic-awakening'); this.altar.classList.add('magic-manifesting');
    this.root.dataset.revealPhase = 'manifesting';
    this.orbState.textContent = 'A CARTA ATRAVESSA AS ESTRELAS';
    if (!this.reducedMotion()) await new Promise(resolve => globalThis.setTimeout(resolve, PORTAL_CROSSING_MS));
  }

  finishRevealMagic(card, position) {
    this.altar.classList.add('magic-born'); this.root.dataset.revealPhase = 'born';
    this.orbState.textContent = 'CARTA REVELADA';
    if (this.magicAnnouncement && card) this.magicAnnouncement.textContent = `${card.name}, direta. Carta ${position + 1} de ${DECK_SIZE} revelada.`;
  }

  settleRevealMagic() {
    this.drawing = false;
    this.altar.classList.remove('revealing', 'magic-awakening', 'magic-manifesting', 'magic-born');
    this.altar.removeAttribute('aria-busy'); this.orb.removeAttribute('aria-busy');
    this.root.dataset.revealPhase = 'idle';
    this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'REVELAR CARTA';
  }

  beginCardGesture(event) {
    if (this.drawing || this.gestureAnimating || this.selected < 0 || event.isPrimary === false) return false;
    if (event.pointerType === 'mouse' && event.button !== 0) return false;
    globalThis.clearTimeout(this.gestureTimer);
    this.stage.classList.remove('swipe-return', 'swipe-edge', 'swipe-exit-next', 'swipe-exit-previous', 'swipe-enter-next', 'swipe-enter-previous');
    this.stage.style.setProperty('--tarot-swipe-x', '0px');
    this.stage.style.setProperty('--tarot-swipe-tilt', '0deg');
    this.stage.style.setProperty('--tarot-swipe-opacity', '1');
    this.stage.classList.add('is-swiping');
    this.cardGesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startedAt: globalThis.performance?.now?.() ?? Date.now(),
      horizontal: false,
      vertical: false
    };
    return true;
  }

  moveCardGesture(event) {
    const gesture = this.cardGesture;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.vertical) return false;
    gesture.lastX = event.clientX; gesture.lastY = event.clientY;
    const dx = event.clientX - gesture.startX; const dy = event.clientY - gesture.startY;
    const absX = Math.abs(dx); const absY = Math.abs(dy);
    if (!gesture.horizontal) {
      if (absY > 12 && absY > absX * 1.12) { gesture.vertical = true; this.returnCardGesture(false); return false; }
      if (absX < 9 || absX <= absY * 1.08) return false;
      gesture.horizontal = true;
      try { this.stage.setPointerCapture?.(event.pointerId); } catch { /* captura opcional */ }
    }
    event.preventDefault();
    const direction = dx >= 0 ? 1 : -1;
    const canMove = this.selected + direction >= 0 && this.selected + direction < this.state.revealed.length;
    const visualX = Math.max(-112, Math.min(112, dx * (canMove ? .72 : .18)));
    this.stage.style.setProperty('--tarot-swipe-x', `${visualX}px`);
    this.stage.style.setProperty('--tarot-swipe-tilt', `${Math.max(-4.2, Math.min(4.2, visualX / 27))}deg`);
    this.stage.style.setProperty('--tarot-swipe-opacity', String(Math.max(.76, 1 - Math.abs(visualX) / 430)));
    return true;
  }

  endCardGesture(event, cancelled = false) {
    const gesture = this.cardGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return false;
    const endX = Number.isFinite(event.clientX) ? event.clientX : gesture.lastX;
    const endY = Number.isFinite(event.clientY) ? event.clientY : gesture.lastY;
    const dx = endX - gesture.startX; const dy = endY - gesture.startY;
    const elapsed = (globalThis.performance?.now?.() ?? Date.now()) - gesture.startedAt;
    try { if (this.stage.hasPointerCapture?.(event.pointerId)) this.stage.releasePointerCapture?.(event.pointerId); } catch { /* captura opcional */ }
    this.cardGesture = null;
    const threshold = Math.min(62, Math.max(42, this.stage.clientWidth * .15));
    if (!cancelled && gesture.horizontal && Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.12 && elapsed < 1100) {
      return this.navigateCurrent(dx > 0 ? 1 : -1, 'gesto');
    }
    this.returnCardGesture(false);
    return false;
  }

  returnCardGesture(atEdge = false) {
    this.cardGesture = null;
    this.stage.classList.remove('is-swiping', 'swipe-exit-next', 'swipe-exit-previous', 'swipe-enter-next', 'swipe-enter-previous');
    this.stage.classList.add(atEdge ? 'swipe-edge' : 'swipe-return');
    this.stage.style.setProperty('--tarot-swipe-x', '0px');
    this.stage.style.setProperty('--tarot-swipe-tilt', '0deg');
    this.stage.style.setProperty('--tarot-swipe-opacity', '1');
    globalThis.clearTimeout(this.gestureTimer);
    this.gestureTimer = globalThis.setTimeout(() => {
      this.stage.classList.remove('swipe-return', 'swipe-edge');
      this.stage.style.removeProperty('--tarot-swipe-x');
      this.stage.style.removeProperty('--tarot-swipe-tilt');
      this.stage.style.removeProperty('--tarot-swipe-opacity');
    }, 320);
  }

  resetCardGestureVisual() {
    this.cardGesture = null;
    this.stage.classList.remove('is-swiping', 'swipe-return', 'swipe-edge', 'swipe-exit-next', 'swipe-exit-previous', 'swipe-enter-next', 'swipe-enter-previous');
    this.stage.style.removeProperty('--tarot-swipe-x');
    this.stage.style.removeProperty('--tarot-swipe-tilt');
    this.stage.style.removeProperty('--tarot-swipe-opacity');
  }

  navigateCurrent(direction, source = 'botão') {
    if (this.drawing || this.gestureAnimating) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) { this.returnCardGesture(true); return false; }
    if (this.reducedMotion()) {
      this.resetCardGestureVisual();
      const moved = this.moveCurrent(direction); if (moved) this.announceCardNavigation(source);
      return moved;
    }
    this.gestureAnimating = true; this.resetCardGestureVisual(); globalThis.clearTimeout(this.gestureTimer);
    this.stage.classList.add(direction > 0 ? 'swipe-exit-next' : 'swipe-exit-previous');
    this.gestureTimer = globalThis.setTimeout(() => {
      this.moveCurrent(direction);
      this.stage.classList.add(direction > 0 ? 'swipe-enter-next' : 'swipe-enter-previous');
      this.announceCardNavigation(source);
      this.gestureTimer = globalThis.setTimeout(() => {
        this.stage.classList.remove('swipe-enter-next', 'swipe-enter-previous');
        this.gestureAnimating = false;
      }, 380);
    }, 170);
    return true;
  }

  announceCardNavigation(source) {
    const card = CARDS[this.state.revealed[this.selected]]; if (!card || !this.magicAnnouncement) return;
    const prefix = source === 'gesto' ? 'Navegação por gesto. ' : '';
    this.magicAnnouncement.textContent = `${prefix}${card.name}, direta. Carta ${this.selected + 1} de ${this.state.revealed.length} reveladas.`;
  }

  handleCardKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault(); this.navigateCurrent(event.key === 'ArrowRight' ? 1 : -1, 'teclado');
  }

  moveCurrent(direction) {
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;
    this.show(next, false, false);
    return true;
  }

  updateCurrentControls() {
    const total = this.state.revealed.length;
    const empty = total === 0 || this.selected < 0;
    this.currentNav.dataset.empty = String(empty);
    this.currentPrev.disabled = empty || this.selected <= 0;
    this.currentNext.disabled = empty || this.selected >= total - 1;
    if (this.gestureHint) this.gestureHint.textContent = empty ? 'REVELE A PRIMEIRA CARTA' : '← ESQUERDA: ANTERIOR · DIREITA: PRÓXIMA →';
  }

  show(index, animate = true, scroll = false) {
    const card = CARDS[this.state.revealed[index]]; if (!isFreeTarotCard(card)) return;
    this.selected = index; this.stage.className = `current table-preview${animate ? ' birth' : ''}`;
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}${freeCardLabel(card)}`;
    this.stage.setAttribute('aria-label', `${card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}. Use as setas ou deslize para navegar.`);
    this.realTable.querySelectorAll('[data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    this.orbitalCards.querySelectorAll('[data-orbit-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.orbitIndex) === index));
    this.updateCurrentControls();
    if (animate) globalThis.setTimeout(() => this.stage.classList.remove('birth'), 1320);
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
      const card = CARDS[cardId]; if (!isFreeTarotCard(card)) return '';
      return `<button type="button" role="listitem" data-orbit-index="${index}" class="orbital-card${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" style="${style}" aria-label="${freeCardAriaLabel(card, index + 1)}">${cardImageMarkup(card, { decorative: true })}</button>`;
    }).join('');
  }

  render(landing = -1) {
    const total = this.state.revealed.length; const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`; this.root.querySelector('#remaining').textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas'; this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`; this.ritualRevealed.textContent = String(total); this.ritualRemaining.textContent = String(waiting); this.saveState.textContent = total ? `Mesa salva neste aparelho · ${total} de ${DECK_SIZE}` : 'Nova mesa salva neste aparelho'; this.editorialState.textContent = tarotEditorialStatus(total, DECK_SIZE); this.orb.disabled = this.state.completed; this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Mesa completa'); this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'REVELAR CARTA'; this.shuffleButton.disabled = waiting < 2;
    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const cardId = this.state.revealed[index]; const row = Math.floor(index / 6) + 1; const column = (index % 6) + 1;
      if (cardId === undefined) return `<div data-position="${index}" class="table-slot waiting" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" aria-disabled="true" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      const card = CARDS[cardId]; if (!isFreeTarotCard(card)) return '';
      return `<button type="button" data-index="${index}" data-position="${index}" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" class="table-slot revealed${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" aria-label="${freeCardAriaLabel(card, index + 1)}">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');
    this.renderOrbit(landing); this.centerTablePosition(landing); globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
    if (total) { if (this.selected < 0 || this.selected >= total) this.selected = total - 1; this.show(this.selected, false, false); }
    else { this.selected = -1; this.stage.className = 'current table-preview empty'; this.stage.innerHTML = EMPTY_ALTAR; this.stage.setAttribute('aria-label', 'Nenhuma carta revelada. Toque na Orbe para começar.'); }
    this.updateCurrentControls();
  }

  async reset(force = false) {
    if (this.drawing || this.gestureAnimating) return false;
    if (this.state.revealed.length > 0 && force !== true && globalThis.confirm && !globalThis.confirm('Apagar as cartas desta mesa e iniciar um novo baralho?')) return false;
    this.state = await this.coordinator.commit(() => resetTarotState()); this.selected = -1; this.closeLightbox(); this.render(); preloadCardImages(this.state.waiting, 3); announce('Uma nova Mesa Real foi preparada.'); return true;
  }
  async reshuffle() {
    if (this.drawing || this.gestureAnimating || this.state.waiting.length < 2) return false;
    const revealedBefore = this.state.revealed.join(','); this.state = await this.coordinator.commit(latest => shuffleRemainingCards(latest)); if (!this.state.revealed.join(',').startsWith(revealedBefore)) throw new Error('As cartas reveladas não podem ser movidas.'); this.render(); preloadCardImages(this.state.waiting, 3); globalThis.navigator?.vibrate?.(16); announce(`${this.state.waiting.length} cartas restantes foram embaralhadas.`); return true;
  }

  downloadBackup() {
    const contents = createTarotBackup(this.state);
    if (!contents || typeof Blob === 'undefined' || !globalThis.URL?.createObjectURL) return false;
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    link.href = url; link.download = `divina-bruxa-mesa-${stamp}.json`; link.hidden = true;
    document.body.append(link); link.click(); link.remove(); globalThis.setTimeout(() => URL.revokeObjectURL(url), 1200);
    announce('A cópia desta Mesa Real foi guardada.'); return true;
  }

  async restoreBackupFile(file) {
    this.backupInput.value = '';
    if (!file) return false;
    let restored = null;
    try { restored = restoreTarotBackup(await file.text()); } catch { restored = null; }
    if (!restored) { announce('Este arquivo não contém uma Mesa Real válida.'); return false; }
    if (this.state.revealed.length > 0 && globalThis.confirm && !globalThis.confirm('Substituir a mesa atual pela mesa guardada neste arquivo?')) return false;
    this.state = await this.coordinator.commit(() => restored);
    this.selected = this.state.revealed.length - 1; this.closeLightbox(); this.render(); preloadCardImages(this.state.waiting, 3);
    announce(`Mesa retomada com ${this.state.revealed.length} cartas reveladas.`); return true;
  }

  destroy() { globalThis.clearTimeout(this.releaseTimer); globalThis.cancelAnimationFrame?.(this.scrollFrame); this.closeLightbox(); globalThis.removeEventListener?.('storage', this.onStorage); document.removeEventListener('visibilitychange', this.onVisibility); }
}
