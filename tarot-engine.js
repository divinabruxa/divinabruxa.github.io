/* DIVINA BRUXA — MOTOR DO TAROT LIVRE · NOME MÁGICO V128
   Setas determinísticas, revelação leve, balão da carta e nenhuma navegação por gesto.
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
const PORTAL_OPENING_MS = 72;
const PORTAL_CROSSING_MS = 18;
const NAVIGATION_OUT_MS = 105;
const NAVIGATION_IN_MS = 175;
function announce(message) {
  if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
}

function installOfficialStructure(root) {
  root.classList.add('tarot-livre-official');
  root.dataset.tarotLivre = 'ios-v128';
  document.documentElement.dataset.tarotMotion = 'ios-v1';

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
    wheel.insertAdjacentHTML('beforeend', '<p id="tarotGestureHint" class="tarot-gesture-hint"><span aria-hidden="true">— ✦</span> USE AS SETAS PARA NAVEGAR <span aria-hidden="true">✦ —</span></p>');
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
    altar.insertAdjacentHTML('afterbegin', '<span id="tarotBirthFx" class="tarot-ios-flash" aria-hidden="true"></span><p id="tarotMagicAnnouncement" class="tarot-magic-sr" role="status" aria-live="polite" aria-atomic="true"></p>');
  }
  if (altar && !root.querySelector('#tarotCardToast')) {
    altar.insertAdjacentHTML('afterbegin', '<div id="tarotCardToast" class="tarot-card-toast" aria-hidden="true"><span aria-hidden="true">✦</span><strong id="tarotCardToastName">CARTA REVELADA</strong><span aria-hidden="true">✦</span></div>');
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
    this.cardToast = root.querySelector('#tarotCardToast'); this.cardToastName = root.querySelector('#tarotCardToastName');
    this.currentNav = root.querySelector('#currentCardNav'); this.currentPrev = root.querySelector('#currentCardPrev'); this.currentNext = root.querySelector('#currentCardNext');
    this.gestureHint = root.querySelector('#tarotGestureHint');
    this.viewport = root.querySelector('#realTableViewport'); this.compactButton = root.querySelector('#tableCompact'); this.scrollPrevButton = root.querySelector('#tableScrollPrev'); this.scrollNextButton = root.querySelector('#tableScrollNext'); this.viewHint = root.querySelector('#tableViewHint');
    this.lightbox = root.querySelector('#cardLightbox'); this.lightboxImage = root.querySelector('#lightboxImage'); this.lightboxTitle = root.querySelector('#lightboxTitle'); this.lightboxPosition = root.querySelector('#lightboxPosition'); this.lightboxPrev = root.querySelector('#lightboxPrev'); this.lightboxNext = root.querySelector('#lightboxNext'); this.lightboxClose = root.querySelector('#closeCardLightbox');
    this.orbitalCards = root.querySelector('#orbitalCards'); this.ritualRevealed = root.querySelector('#ritualRevealed'); this.ritualRemaining = root.querySelector('#ritualRemaining');
    this.backupButton = root.querySelector('#saveTableBackup'); this.restoreButton = root.querySelector('#restoreTableBackup'); this.backupInput = root.querySelector('#tableBackupInput'); this.saveState = root.querySelector('#tableSaveState');
    this.editorialState = root.querySelector('#tarotEditorialState');
    this.selected = -1; this.lightboxIndex = -1; this.lightboxTrigger = null; this.compactView = true; this.drawing = false; this.releaseTimer = 0; this.toastTimer = 0; this.toastToken = 0; this.scrollFrame = 0; this.lastTableScrollAt = -Infinity;
    this.navigationAnimation = null; this.navigationToken = 0;
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
    this.currentNext.addEventListener('click', () => this.navigateForward('botão'));
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
    this.drawing = true; this.updateCurrentControls(); this.altar.classList.add('revealing'); this.startRevealMagic();
    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest)); if (result.cardId === null) return null;
      await this.openRevealPortal(revealStartedAt);
      this.state = result.state; this.selected = result.position; this.persist(); this.render(result.position, true); preloadCardImages(this.state.waiting, 3);
      this.finishRevealMagic(CARDS[result.cardId], result.position); revealed = true;
      globalThis.navigator?.vibrate?.([12, 22, 18]); globalThis.dispatchEvent?.(new CustomEvent('tarot:revealed', { detail: { cardId: result.cardId, position: result.position, remaining: this.state.waiting.length } })); return result.cardId;
    } finally {
      globalThis.clearTimeout(this.releaseTimer);
      const settleDelay = this.reducedMotion() ? 20 : (revealed ? 470 : 120);
      this.releaseTimer = globalThis.setTimeout(() => this.settleRevealMagic(), settleDelay);
    }
  }

  startRevealMagic() {
    this.hideCardToast();
    this.altar.classList.remove('magic-awakening', 'magic-manifesting', 'magic-born', 'ios-awakening', 'ios-crossing', 'ios-born');
    this.root.dataset.revealPhase = 'awakening';
    this.altar.setAttribute('aria-busy', 'true'); this.orb.setAttribute('aria-busy', 'true');
    this.altar.classList.add('ios-awakening');
    this.orbState.textContent = 'O PORTAL ESTÁ SE ABRINDO';
    if (this.magicAnnouncement) this.magicAnnouncement.textContent = 'A Orbe está abrindo o portal.';
  }

  async openRevealPortal(startedAt) {
    if (!this.reducedMotion()) {
      const now = globalThis.performance?.now?.() ?? Date.now();
      await new Promise(resolve => globalThis.setTimeout(resolve, Math.max(0, PORTAL_OPENING_MS - (now - startedAt))));
    }
    this.altar.classList.remove('ios-awakening'); this.altar.classList.add('ios-crossing');
    this.root.dataset.revealPhase = 'manifesting';
    this.orbState.textContent = 'A CARTA ATRAVESSA AS ESTRELAS';
    if (!this.reducedMotion()) await new Promise(resolve => globalThis.setTimeout(resolve, PORTAL_CROSSING_MS));
  }

  finishRevealMagic(card, position) {
    this.altar.classList.remove('ios-crossing'); this.altar.classList.add('ios-born'); this.root.dataset.revealPhase = 'born';
    this.orbState.textContent = 'CARTA REVELADA';
    if (this.magicAnnouncement && card) this.magicAnnouncement.textContent = `${card.name}, direta. Carta ${position + 1} de ${DECK_SIZE} revelada.`;
    this.showCardToast(card);
  }

  hideCardToast() {
    globalThis.clearTimeout(this.toastTimer);
    this.toastToken += 1;
    if (!this.cardToast) return;
    this.cardToast.classList.remove('is-visible');
    this.cardToast.setAttribute('aria-hidden', 'true');
  }

  showCardToast(card) {
    if (!card || !this.cardToast || !this.cardToastName) return;
    this.hideCardToast();
    this.cardToastName.textContent = String(card.name).toLocaleUpperCase('pt-BR');
    const token = ++this.toastToken;
    const revealToast = () => {
      if (token !== this.toastToken) return;
      this.cardToast.classList.add('is-visible');
      this.cardToast.setAttribute('aria-hidden', 'false');
      this.toastTimer = globalThis.setTimeout(() => {
        if (token !== this.toastToken) return;
        this.cardToast.classList.remove('is-visible');
        this.cardToast.setAttribute('aria-hidden', 'true');
      }, 2600);
    };
    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(revealToast));
    } else revealToast();
  }

  settleRevealMagic() {
    this.drawing = false;
    this.altar.classList.remove('revealing', 'magic-awakening', 'magic-manifesting', 'magic-born', 'ios-awakening', 'ios-crossing', 'ios-born');
    this.altar.removeAttribute('aria-busy'); this.orb.removeAttribute('aria-busy');
    this.root.dataset.revealPhase = 'idle';
    this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'REVELAR CARTA';
    this.updateCurrentControls();
  }

  async navigateCurrent(direction, source = 'botão') {
    if (this.drawing || this.navigationAnimation) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;

    if (this.reducedMotion() || typeof this.stage.animate !== 'function') {
      const moved = this.moveCurrent(direction);
      if (moved) this.announceCardNavigation(source);
      return moved;
    }

    const token = ++this.navigationToken;
    const travel = direction > 0 ? -18 : 18;
    this.navigationAnimation = this.stage.animate([
      { opacity:1, transform:'translate3d(0,0,0) scale(1)' },
      { opacity:0, transform:`translate3d(${travel}px,0,0) scale(.985)` }
    ], {
      duration:NAVIGATION_OUT_MS,
      easing:'cubic-bezier(.32,0,.67,0)',
      fill:'forwards'
    });

    try { await this.navigationAnimation.finished; }
    catch { if (token === this.navigationToken) this.navigationAnimation = null; return false; }
    if (token !== this.navigationToken) return false;

    this.navigationAnimation.cancel();
    this.navigationAnimation = null;
    this.show(next, false, false);
    this.announceCardNavigation(source);
    this.navigationAnimation = this.stage.animate([
      { opacity:0, transform:`translate3d(${-travel}px,0,0) scale(.985)` },
      { opacity:1, transform:'translate3d(0,0,0) scale(1)' }
    ], {
      duration:NAVIGATION_IN_MS,
      easing:'cubic-bezier(.22,1,.36,1)',
      fill:'both'
    });

    const entering = this.navigationAnimation;
    try { await entering.finished; } catch { /* cancelamento seguro */ }
    entering.cancel();
    if (token === this.navigationToken) this.navigationAnimation = null;
    return true;
  }

  async navigateForward(source = 'botão') {
    if (this.drawing || this.navigationAnimation) return false;
    if (this.selected < this.state.revealed.length - 1) return this.navigateCurrent(1, source);
    if (this.state.completed) return false;
    return (await this.draw()) !== null;
  }

  announceCardNavigation(source) {
    const card = CARDS[this.state.revealed[this.selected]]; if (!card || !this.magicAnnouncement) return;
    this.magicAnnouncement.textContent = `${card.name}, direta. Carta ${this.selected + 1} de ${this.state.revealed.length} reveladas.`;
  }

  handleCardKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    if (event.key === 'ArrowRight') this.navigateForward('teclado');
    else this.navigateCurrent(-1, 'teclado');
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
    const hasKnownNext = !empty && this.selected < total - 1;
    const canReveal = !this.state.completed;
    this.currentNext.disabled = this.drawing || (!hasKnownNext && !canReveal);
    this.currentNext.setAttribute('aria-label', hasKnownNext ? 'Mostrar próxima carta' : canReveal ? 'Revelar nova carta' : 'Todas as cartas foram reveladas');
    if (this.gestureHint) this.gestureHint.innerHTML = empty
      ? '<span aria-hidden="true">— ✦</span> SETA DIREITA: REVELAR A PRIMEIRA CARTA <span aria-hidden="true">✦ —</span>'
      : hasKnownNext
        ? '<span aria-hidden="true">— ✦</span> USE AS SETAS PARA NAVEGAR <span aria-hidden="true">✦ —</span>'
        : canReveal
          ? '<span aria-hidden="true">— ✦</span> SETA DIREITA: NOVA CARTA <span aria-hidden="true">✦ —</span>'
          : '<span aria-hidden="true">— ✦</span> AS 78 CARTAS FORAM REVELADAS <span aria-hidden="true">✦ —</span>';
  }

  show(index, animate = true, scroll = false) {
    const card = CARDS[this.state.revealed[index]]; if (!isFreeTarotCard(card)) return;
    this.hideCardToast();
    this.selected = index; this.stage.className = 'current table-preview';
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}${freeCardLabel(card)}`;
    this.stage.setAttribute('aria-label', `${card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}. Use as setas para navegar.`);
    this.realTable.querySelectorAll('[data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    this.orbitalCards.querySelectorAll('[data-orbit-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.orbitIndex) === index));
    this.updateCurrentControls();
    preloadCardImages([
      this.state.revealed[index - 1],
      this.state.revealed[index + 1],
      this.state.waiting[0]
    ], 3);
    if (animate && !this.reducedMotion() && typeof this.stage.animate === 'function') {
      this.stage.animate([
        { opacity:0, transform:'translate3d(0,18px,0) scale(.955)' },
        { opacity:1, transform:'translate3d(0,-2px,0) scale(1.008)', offset:.72 },
        { opacity:1, transform:'translate3d(0,0,0) scale(1)' }
      ], {
        duration:420,
        easing:'cubic-bezier(.22,1,.36,1)'
      });
    }
    if (scroll) this.altar.scrollIntoView({ behavior:'auto', block:'start' });
  }

  reducedMotion() { return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true; }
  updateViewMode() {
    this.compactView = true; this.viewport.classList.add('is-compact'); this.compactButton.setAttribute('aria-pressed', 'true'); this.compactButton.textContent = 'Mesa em seis colunas'; this.viewHint.textContent = 'As seis colunas estão visíveis na tela.'; globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
  }
  scrollTable(direction) { const distance = Math.max(260, this.viewport.clientWidth * .78); this.viewport.scrollBy({ left: direction * distance, behavior:'auto' }); }
  updateScrollControls() { const maximum = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth); this.scrollPrevButton.disabled = maximum < 2 || this.viewport.scrollLeft <= 2; this.scrollNextButton.disabled = maximum < 2 || this.viewport.scrollLeft >= maximum - 2; }
  centerTablePosition() { /* A mesa V126 cabe em seis colunas e não precisa de rolagem horizontal. */ }

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

  renderOrbit() {
    this.orbitalCards.replaceChildren();
  }

  render(landing = -1, animateCurrent = false) {
    const total = this.state.revealed.length; const waiting = this.state.waiting.length;
    this.root.querySelector('#count').innerHTML = `${total}<small>/${DECK_SIZE}</small>`; this.root.querySelector('#remaining').textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas'; this.root.querySelector('#deckProgress').style.width = `${(total / DECK_SIZE) * 100}%`; this.ritualRevealed.textContent = String(total); this.ritualRemaining.textContent = String(waiting); this.saveState.textContent = total ? `Mesa salva neste aparelho · ${total} de ${DECK_SIZE}` : 'Nova mesa salva neste aparelho'; this.editorialState.textContent = tarotEditorialStatus(total, DECK_SIZE); this.orb.disabled = this.state.completed; this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta. ${waiting} restantes.` : 'Mesa completa'); this.orbState.textContent = this.state.completed ? 'MESA COMPLETA' : 'REVELAR CARTA'; this.shuffleButton.disabled = waiting < 2;
    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const cardId = this.state.revealed[index]; const row = Math.floor(index / 6) + 1; const column = (index % 6) + 1;
      if (cardId === undefined) return `<div data-position="${index}" class="table-slot waiting" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" aria-disabled="true" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      const card = CARDS[cardId]; if (!isFreeTarotCard(card)) return '';
      return `<button type="button" data-index="${index}" data-position="${index}" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" class="table-slot revealed${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" aria-label="${freeCardAriaLabel(card, index + 1)}">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');
    this.renderOrbit(landing); this.centerTablePosition(landing); globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
    if (total) { if (this.selected < 0 || this.selected >= total) this.selected = total - 1; this.show(this.selected, animateCurrent, false); }
    else { this.selected = -1; this.stage.className = 'current table-preview empty'; this.stage.innerHTML = EMPTY_ALTAR; this.stage.setAttribute('aria-label', 'Nenhuma carta revelada. Toque na Orbe para começar.'); }
    this.updateCurrentControls();
  }

  async reset(force = false) {
    if (this.drawing || this.navigationAnimation) return false;
    if (this.state.revealed.length > 0 && force !== true && globalThis.confirm && !globalThis.confirm('Apagar as cartas desta mesa e iniciar um novo baralho?')) return false;
    this.hideCardToast(); this.state = await this.coordinator.commit(() => resetTarotState()); this.selected = -1; this.closeLightbox(); this.render(); preloadCardImages(this.state.waiting, 3); announce('Uma nova Mesa Real foi preparada.'); return true;
  }
  async reshuffle() {
    if (this.drawing || this.navigationAnimation || this.state.waiting.length < 2) return false;
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

  destroy() { globalThis.clearTimeout(this.releaseTimer); this.hideCardToast(); globalThis.cancelAnimationFrame?.(this.scrollFrame); this.navigationToken += 1; this.navigationAnimation?.cancel?.(); this.navigationAnimation = null; this.closeLightbox(); globalThis.removeEventListener?.('storage', this.onStorage); document.removeEventListener('visibilitychange', this.onVisibility); }
}
