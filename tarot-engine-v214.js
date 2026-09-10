/* DIVINA BRUXA — TAROT LIVRE 2.0 · V214
   Evolução preservando o ritual V182: 78 cartas diretas, zero repetição,
   seis cartas por fileira, retomada resiliente e ponte opcional/consentida com Whit.
*/
import { CARDS } from './tarot-data.js';
import { store } from './storage.js';
import { cardImageMarkup, preloadCardImages, prepareCardImage } from './tarot-image-runtime.js?v=182';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=182';
import {
  DECK_SIZE,
  TAROT_MAX_BACKUP_BYTES,
  compareTarotStates,
  createTarotBackup,
  drawNextCard,
  normalizeTarotState,
  resetTarotState,
  restoreTarotBackup,
  shuffleRemainingCards
} from './tarot-session.js?v=182';
import {
  freeCardAriaLabel,
  freeCardLabel,
  isFreeTarotCard,
  tarotEditorialStatus
} from './tarot-editorial-policy.js?v=182';
import { AI_DRAFT_KEY } from './ai-policy.js?v=190';

const RELEASE = 'V214';
const STORAGE_KEY = 'free-tarot';
const STORAGE_EVENT_SUFFIX = `:${STORAGE_KEY}`;
const STYLE_ID = 'tarotLivreV214Styles';
const EMPTY_ALTAR = '<div class="empty-card"><span aria-hidden="true">✦</span><b>O PORTAL AGUARDA</b><small>Toque na Orbe para revelar</small></div>';
const SUCTION_OUT_MS = 64;
const SUCTION_IN_MS = 112;
const IMAGE_REVEAL_BUDGET_MS = 480;
const IMAGE_PREPARE_BUDGET_MS = 1800;
const SUCTION_CLASSES = ['suction-out', 'suction-hold', 'suction-in', 'suction-nav-out', 'suction-nav-hold', 'suction-nav-in'];
const V214_CSS = String.raw`/* DIVINA BRUXA — TAROT LIVRE 2.0 · V214
   Camada visual isolada: ritual vivo, 6 cartas por fileira, Whit opcional e motion seguro. */

#tarot.tarot-livre-v214{
  --tl214-gold:rgba(239,203,127,.88);
  --tl214-gold-soft:rgba(239,203,127,.28);
  --tl214-violet:rgba(150,84,224,.24);
  --tl214-panel:rgba(9,4,18,.82);
  isolation:isolate;
}

#tarot.tarot-livre-v214 .editorial-covenant{
  position:relative;
  overflow:hidden;
}
#tarot.tarot-livre-v214 .editorial-covenant::before{
  content:"";
  position:absolute;
  width:220px;
  aspect-ratio:1;
  inset:-120px auto auto -90px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(159,88,225,.16),transparent 68%);
  pointer-events:none;
}
#tarot.tarot-livre-v214 .editorial-principles{
  display:flex;
  flex-wrap:wrap;
  gap:.42rem;
}
#tarot.tarot-livre-v214 .editorial-principles span{
  white-space:nowrap;
}

/* O contrato continua literal: 78 posições = 13 fileiras × 6 colunas. */
#tarot.tarot-livre-v214 #realTable{
  display:grid!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
  grid-auto-flow:row!important;
  gap:clamp(.28rem,1.1vw,.72rem)!important;
  width:100%!important;
  min-width:0!important;
}
#tarot.tarot-livre-v214 #realTableViewport,
#tarot.tarot-livre-v214 #realTableViewport.is-compact{
  overflow-x:hidden!important;
  scrollbar-width:none;
}
#tarot.tarot-livre-v214 #realTableViewport::-webkit-scrollbar{display:none}
#tarot.tarot-livre-v214 #realTable .table-slot{
  min-width:0!important;
  width:100%!important;
  aspect-ratio:2/3;
  contain:layout paint style;
  border-radius:clamp(6px,1.5vw,14px);
}
#tarot.tarot-livre-v214 #realTable .table-slot .tarot-card-image,
#tarot.tarot-livre-v214 #realTable .table-slot img{
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius:inherit;
}
#tarot.tarot-livre-v214 #realTable .table-slot.waiting{
  background:
    radial-gradient(circle at 50% 18%,rgba(173,104,227,.1),transparent 38%),
    linear-gradient(145deg,rgba(27,12,39,.68),rgba(7,3,14,.8));
  border:1px solid rgba(238,199,115,.11);
}
#tarot.tarot-livre-v214 #realTable .table-slot.revealed{
  transform:translateZ(0);
  transition:transform .24s cubic-bezier(.22,1,.36,1),box-shadow .24s ease,border-color .24s ease;
}
#tarot.tarot-livre-v214 #realTable .table-slot.revealed.selected{
  z-index:2;
  transform:translateY(-2px) scale(1.025);
  border-color:rgba(244,212,142,.78);
  box-shadow:0 0 0 1px rgba(241,202,120,.24),0 10px 30px rgba(69,23,101,.32);
}
#tarot.tarot-livre-v214 #realTable .table-slot.landing{
  animation:tl214Birth .52s cubic-bezier(.22,1,.36,1) both;
}

/* A Orbe continua sendo o único gatilho de revelação. */
#tarot.tarot-livre-v214 #revealAltar{
  position:relative;
  isolation:isolate;
}
#tarot.tarot-livre-v214 #revealAltar::before{
  content:"";
  position:absolute;
  z-index:-1;
  width:min(76vw,520px);
  aspect-ratio:1;
  left:50%;
  top:48%;
  translate:-50% -50%;
  border-radius:50%;
  background:radial-gradient(circle,rgba(144,68,214,.16),rgba(63,26,92,.07) 40%,transparent 70%);
  filter:blur(8px);
  opacity:.72;
  pointer-events:none;
  animation:tl214Breath 5.6s ease-in-out infinite;
}
#tarot.tarot-livre-v214 #tableOrb{
  transform:translateZ(0);
  touch-action:manipulation;
}
#tarot.tarot-livre-v214[data-interaction-state="Touched"] #tableOrb{
  filter:brightness(1.08) saturate(1.08);
}
#tarot.tarot-livre-v214[data-reveal-phase="awakening"] #revealAltar::before,
#tarot.tarot-livre-v214[data-reveal-phase="manifesting"] #revealAltar::before{
  opacity:1;
  scale:1.08;
}

/* Ponte explícita: Tarot Livre permanece sem significados automáticos. */
#tarot.tarot-livre-v214 .tarot-whit-bridge{
  position:relative;
  display:grid;
  grid-template-columns:auto minmax(0,1fr) auto;
  gap:.8rem;
  align-items:center;
  margin:1rem 0 1.25rem;
  padding:clamp(.85rem,3vw,1.15rem);
  border:1px solid rgba(221,182,245,.18);
  border-radius:22px;
  background:
    radial-gradient(circle at 0 50%,rgba(138,76,203,.17),transparent 40%),
    linear-gradient(145deg,rgba(15,7,27,.9),rgba(7,3,15,.86));
  box-shadow:0 16px 52px rgba(0,0,0,.18);
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__sigil{
  display:grid;
  place-items:center;
  width:44px;
  aspect-ratio:1;
  border:1px solid rgba(230,197,247,.25);
  border-radius:50%;
  color:#ead1f7;
  background:rgba(129,68,183,.1);
  box-shadow:inset 0 0 18px rgba(171,98,226,.08);
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__copy{
  min-width:0;
  display:grid;
  gap:.2rem;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__copy small{
  color:#d9b8e9;
  font:700 .58rem/1.3 system-ui,sans-serif;
  letter-spacing:.14em;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__copy h3{
  margin:0;
  color:#fff3df;
  font:500 clamp(1rem,3vw,1.3rem)/1.15 Georgia,serif;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__copy p{
  margin:0;
  max-width:62ch;
  color:#bfb0c6;
  font:.72rem/1.5 system-ui,sans-serif;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge__copy .tarot-whit-bridge__state{
  margin-top:.16rem;
  color:#e5c77f;
  font-weight:650;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge>[data-whit-open]{
  min-height:44px;
  padding:.68rem .9rem;
  border:1px solid rgba(232,198,128,.48);
  border-radius:999px;
  background:linear-gradient(145deg,rgba(78,41,104,.76),rgba(30,15,46,.9));
  color:#ffe5a8;
  font:800 .67rem/1.1 system-ui,sans-serif;
  letter-spacing:.08em;
  cursor:pointer;
  transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,opacity .22s ease;
}
#tarot.tarot-livre-v214 .tarot-whit-bridge>[data-whit-open]:not(:disabled):hover{
  transform:translateY(-1px);
  border-color:rgba(246,215,151,.82);
  box-shadow:0 8px 24px rgba(102,48,141,.25);
}
#tarot.tarot-livre-v214 .tarot-whit-bridge>[data-whit-open]:disabled{
  opacity:.42;
  cursor:not-allowed;
}
#tarot.tarot-livre-v214 .tarot-whit-confirm{
  grid-column:1/-1;
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:.75rem;
  align-items:center;
  padding:.85rem;
  border:1px solid rgba(236,202,133,.25);
  border-radius:15px;
  background:rgba(4,2,9,.72);
}
#tarot.tarot-livre-v214 .tarot-whit-confirm[hidden]{display:none!important}
#tarot.tarot-livre-v214 .tarot-whit-confirm p{margin:0;color:#ecdfeb;font:.75rem/1.5 system-ui,sans-serif}
#tarot.tarot-livre-v214 .tarot-whit-confirm p b{display:block;margin-bottom:.18rem;color:#f4d99c;font:600 .92rem/1.25 Georgia,serif}
#tarot.tarot-livre-v214 .tarot-whit-confirm p small{display:block;color:#b5a7ba;font:.68rem/1.55 system-ui,sans-serif}
#tarot.tarot-livre-v214 .tarot-whit-confirm>div{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:flex-end}
#tarot.tarot-livre-v214 .tarot-whit-confirm button{
  min-height:42px;
  padding:.62rem .78rem;
  border:1px solid rgba(226,195,132,.24);
  border-radius:12px;
  background:rgba(28,13,39,.8);
  color:#e9dbea;
  font:700 .67rem/1.1 system-ui,sans-serif;
  cursor:pointer;
}
#tarot.tarot-livre-v214 .tarot-whit-confirm button.primary{border-color:rgba(239,205,137,.62);color:#ffe5aa}

#tarot.tarot-livre-v214 .table-recovery b,
#tarot.tarot-livre-v214 #tableSaveState{color:#ead09a}

@keyframes tl214Breath{
  0%,100%{transform:scale(.96);opacity:.56}
  50%{transform:scale(1.04);opacity:.86}
}
@keyframes tl214Birth{
  0%{opacity:0;transform:scale(.74) rotate(-1.2deg);filter:blur(5px) brightness(1.45)}
  64%{opacity:1;transform:scale(1.035) rotate(.2deg);filter:blur(0) brightness(1.08)}
  100%{opacity:1;transform:scale(1);filter:none}
}

@media(max-width:760px){
  #tarot.tarot-livre-v214 #realTable{gap:clamp(.2rem,1vw,.38rem)!important}
  #tarot.tarot-livre-v214 #realTable .table-slot{border-radius:clamp(4px,1.4vw,8px)}
  #tarot.tarot-livre-v214 #realTable .table-slot .order,
  #tarot.tarot-livre-v214 #realTable .table-slot .position{font-size:clamp(.48rem,2.2vw,.62rem)}
  #tarot.tarot-livre-v214 .tarot-whit-bridge{grid-template-columns:38px minmax(0,1fr)}
  #tarot.tarot-livre-v214 .tarot-whit-bridge__sigil{width:38px}
  #tarot.tarot-livre-v214 .tarot-whit-bridge>[data-whit-open]{grid-column:1/-1;width:100%}
  #tarot.tarot-livre-v214 .tarot-whit-confirm{grid-template-columns:1fr}
  #tarot.tarot-livre-v214 .tarot-whit-confirm>div{justify-content:stretch}
  #tarot.tarot-livre-v214 .tarot-whit-confirm button{flex:1 1 130px}
}

@media(max-width:390px){
  #tarot.tarot-livre-v214 #realTable{gap:.18rem!important}
  #tarot.tarot-livre-v214 #realTable .table-slot{border-radius:4px}
}

@media(prefers-reduced-motion:reduce){
  #tarot.tarot-livre-v214 *,
  #tarot.tarot-livre-v214 *::before,
  #tarot.tarot-livre-v214 *::after{
    animation-duration:.001ms!important;
    animation-iteration-count:1!important;
    scroll-behavior:auto!important;
    transition-duration:.001ms!important;
  }
}
`;

export const TAROT_INTERACTION_STATES = Object.freeze({
  READY: 'Ready',
  TOUCHED: 'Touched',
  REVEALING: 'Revealing',
  DISABLED: 'Disabled',
  ERROR: 'Error'
});

const pause = milliseconds => new Promise(resolve => globalThis.setTimeout(resolve, Math.max(0, milliseconds)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

function announce(message) {
  if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') {
    globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
  }
}

function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.dataset.release = RELEASE;
  style.textContent = V214_CSS;
  document.head.append(style);
}

function installOfficialStructure(root) {
  ensureStyles();
  root.classList.add('tarot-livre-official', 'tarot-livre-v214');
  root.dataset.tarotLivre = 'v214';
  document.documentElement.dataset.tarotMotion = 'suction-v2';

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
  if (shuffleButton) shuffleButton.textContent = 'EMBARALHAR AS RESTANTES';
  if (resetButton) resetButton.textContent = 'NOVO CÍRCULO';
  if (archiveKicker) archiveKicker.textContent = 'SEU CÍRCULO LIVRE';
  if (archiveTitle) archiveTitle.textContent = 'Cartas reveladas';
  if (archive) {
    archive.setAttribute('role', 'grid');
    archive.setAttribute('aria-label', 'Tarot Livre: 78 posições em treze fileiras de seis cartas');
    archive.setAttribute('aria-rowcount', '13');
    archive.setAttribute('aria-colcount', '6');
  }

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
  if (altar && !root.querySelector('#tarotSuctionFx')) {
    altar.insertAdjacentHTML('afterbegin', '<span id="tarotSuctionFx" class="tarot-suction-fx" aria-hidden="true"><img src="tarot-spiral-suction-v1.webp" width="512" height="512" alt="" loading="eager" decoding="async" fetchpriority="high"></span>');
  }
  if (altar && !root.querySelector('#tarotCardToast')) {
    altar.insertAdjacentHTML('afterbegin', '<div id="tarotCardToast" class="tarot-card-toast" aria-hidden="true"><span aria-hidden="true">✦</span><strong id="tarotCardToastName">CARTA REVELADA</strong><span aria-hidden="true">✦</span></div>');
  }

  if (!root.querySelector('#tableSaveState')) {
    root.querySelector('.real-table-tools')?.insertAdjacentHTML('afterend', '<div class="table-recovery" aria-label="Guardar e retomar o Tarot Livre"><p><span aria-hidden="true">✧</span><span><b id="tableSaveState">Novo círculo salvo neste aparelho</b><small>Você pode fechar e voltar sem perder as cartas.</small></span></p><div><button id="saveTableBackup" type="button">Guardar cópia</button><button id="restoreTableBackup" type="button">Retomar arquivo</button><input id="tableBackupInput" type="file" accept="application/json,.json" hidden></div></div>');
  } else {
    root.querySelector('.table-recovery')?.setAttribute('aria-label', 'Guardar e retomar o Tarot Livre');
  }

  if (!root.querySelector('#tarotEditorialState')) {
    root.querySelector('.free-rule')?.insertAdjacentHTML('afterend', '<aside class="editorial-covenant" aria-labelledby="editorialCovenantTitle"><span class="editorial-seal" aria-hidden="true">✦</span><div><h3 id="editorialCovenantTitle">A Orbe revela. Você interpreta.</h3><p>O Tarot Livre abre somente a imagem, o nome e a posição. Nenhum significado automático interfere na sua leitura.</p><div class="editorial-principles" aria-label="Princípios do Tarot Livre"><span>78 cartas</span><span>Sempre diretas</span><span>Sem repetição</span><span>6 por fileira</span></div></div><p id="tarotEditorialState" class="editorial-state" aria-live="polite">O círculo aguarda o primeiro toque na Orbe.</p></aside>');
  }

  const covenant = root.querySelector('.editorial-covenant');
  if (covenant && !root.querySelector('#tarotWhitBridge')) {
    covenant.insertAdjacentHTML('afterend', `
      <aside id="tarotWhitBridge" class="tarot-whit-bridge" aria-labelledby="tarotWhitTitle">
        <span class="tarot-whit-bridge__sigil" aria-hidden="true">◇</span>
        <div class="tarot-whit-bridge__copy">
          <small>WHIT · PONTE OPCIONAL</small>
          <h3 id="tarotWhitTitle">A leitura continua sua.</h3>
          <p>Se quiser, escolha uma carta já revelada e prepare somente essa carta para conversar com Whit. Nada é enviado automaticamente.</p>
          <p class="tarot-whit-bridge__state" data-whit-card>Revele uma carta para ativar esta ponte.</p>
        </div>
        <button type="button" data-whit-open disabled>REFLETIR COM WHIT</button>
        <div class="tarot-whit-confirm" data-whit-confirm hidden role="alert"></div>
      </aside>`);
  }
}

export class FreeTarot {
  constructor(root, { storage = store } = {}) {
    if (!root) throw new TypeError('A tela do Tarot Livre não foi encontrada.');
    this.root = root;
    this.storage = storage;
    installOfficialStructure(root);

    this.altar = root.querySelector('#revealAltar');
    this.stage = root.querySelector('#current');
    this.orb = root.querySelector('#tableOrb');
    this.realTable = root.querySelector('#realTable');
    this.orbState = root.querySelector('#orbState');
    this.shuffleButton = root.querySelector('#shuffleDeck');
    this.resetButton = root.querySelector('#resetDeck');
    this.magicAnnouncement = root.querySelector('#tarotMagicAnnouncement');
    this.cardToast = root.querySelector('#tarotCardToast');
    this.cardToastName = root.querySelector('#tarotCardToastName');
    this.currentNav = root.querySelector('#currentCardNav');
    this.currentPrev = root.querySelector('#currentCardPrev');
    this.currentNext = root.querySelector('#currentCardNext');
    this.gestureHint = root.querySelector('#tarotGestureHint');
    this.viewport = root.querySelector('#realTableViewport');
    this.compactButton = root.querySelector('#tableCompact');
    this.scrollPrevButton = root.querySelector('#tableScrollPrev');
    this.scrollNextButton = root.querySelector('#tableScrollNext');
    this.viewHint = root.querySelector('#tableViewHint');
    this.lightbox = root.querySelector('#cardLightbox');
    this.lightboxImage = root.querySelector('#lightboxImage');
    this.lightboxTitle = root.querySelector('#lightboxTitle');
    this.lightboxPosition = root.querySelector('#lightboxPosition');
    this.lightboxPrev = root.querySelector('#lightboxPrev');
    this.lightboxNext = root.querySelector('#lightboxNext');
    this.lightboxClose = root.querySelector('#closeCardLightbox');
    this.orbitalCards = root.querySelector('#orbitalCards');
    this.ritualRevealed = root.querySelector('#ritualRevealed');
    this.ritualRemaining = root.querySelector('#ritualRemaining');
    this.backupButton = root.querySelector('#saveTableBackup');
    this.restoreButton = root.querySelector('#restoreTableBackup');
    this.backupInput = root.querySelector('#tableBackupInput');
    this.saveState = root.querySelector('#tableSaveState');
    this.editorialState = root.querySelector('#tarotEditorialState');
    this.whitBridge = root.querySelector('#tarotWhitBridge');
    this.whitButton = root.querySelector('[data-whit-open]');
    this.whitState = root.querySelector('[data-whit-card]');
    this.whitConfirm = root.querySelector('[data-whit-confirm]');

    const required = [this.altar, this.stage, this.orb, this.realTable, this.orbState, this.shuffleButton, this.resetButton];
    if (required.some(element => !element)) throw new TypeError('A estrutura visual do Tarot Livre está incompleta.');

    this.selected = -1;
    this.lightboxIndex = -1;
    this.lightboxTrigger = null;
    this.drawing = false;
    this.releaseTimer = 0;
    this.toastTimer = 0;
    this.toastToken = 0;
    this.scrollFrame = 0;
    this.lastTableScrollAt = -Infinity;
    this.storageBlocked = false;
    this.persistenceWarningShown = false;
    this.navigationAnimation = null;
    this.navigationToken = 0;
    this.root.dataset.revealPhase = 'idle';

    this.coordinator = new TarotSessionCoordinator({ storage: this.storage, key: STORAGE_KEY });
    this.state = this.coordinator.latest();
    this.selected = this.state.revealed.length - 1;
    this.persist();
    preloadCardImages(this.state.waiting, 3);
    this.bind();
    this.updateViewMode();
    this.render();
  }

  persist() {
    const { persisted } = this.coordinator.remember(this.state);
    this.storageBlocked = !persisted;
    if (!persisted) this.warnPersistence();
    return persisted;
  }

  warnPersistence() {
    if (this.saveState) this.saveState.textContent = 'Círculo preservado nesta aba · memória permanente bloqueada';
    if (this.persistenceWarningShown) return;
    this.persistenceWarningShown = true;
    announce('O Tarot Livre continua seguro nesta aba, mas este navegador bloqueou a retomada depois de fechar.');
  }

  setInteractionState(state, label = '') {
    if (!Object.values(TAROT_INTERACTION_STATES).includes(state)) return false;
    this.root.dataset.interactionState = state;
    this.orb.dataset.interactionState = state;
    const unavailable = state === TAROT_INTERACTION_STATES.DISABLED || state === TAROT_INTERACTION_STATES.REVEALING || this.state?.completed === true;
    this.orb.disabled = unavailable;
    this.orb.setAttribute('aria-disabled', String(unavailable));
    const fallback = {
      [TAROT_INTERACTION_STATES.READY]: 'REVELAR CARTA',
      [TAROT_INTERACTION_STATES.TOUCHED]: 'A ORBE RESPONDE',
      [TAROT_INTERACTION_STATES.REVEALING]: 'A ESPIRAL ESTÁ SE ABRINDO',
      [TAROT_INTERACTION_STATES.DISABLED]: 'CÍRCULO COMPLETO',
      [TAROT_INTERACTION_STATES.ERROR]: 'TENTAR NOVAMENTE'
    }[state];
    this.orbState.textContent = label || fallback;
    return true;
  }

  bind() {
    const touchOrb = () => {
      if (!this.drawing && !this.navigationAnimation && !this.state.completed) this.setInteractionState(TAROT_INTERACTION_STATES.TOUCHED);
    };
    const releaseOrb = () => {
      if (!this.drawing && this.root.dataset.interactionState === TAROT_INTERACTION_STATES.TOUCHED) this.setInteractionState(TAROT_INTERACTION_STATES.READY);
    };

    this.orb.addEventListener('pointerdown', touchOrb);
    this.orb.addEventListener('pointerup', releaseOrb);
    this.orb.addEventListener('pointercancel', releaseOrb);
    this.orb.addEventListener('pointerleave', releaseOrb);
    this.orb.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') touchOrb(); });
    this.orb.addEventListener('keyup', event => { if (event.key === 'Enter' || event.key === ' ') releaseOrb(); });
    this.orb.addEventListener('click', () => this.draw());
    this.resetButton.addEventListener('click', () => this.reset());
    this.shuffleButton.addEventListener('click', () => this.reshuffle());
    this.currentPrev?.addEventListener('click', () => this.navigateCurrent(-1, 'botão'));
    this.currentNext?.addEventListener('click', () => this.navigateForward('botão'));
    this.stage.addEventListener('keydown', event => this.handleCardKeydown(event));
    this.stage.addEventListener('dragstart', event => event.preventDefault());

    this.realTable.addEventListener('click', event => {
      const now = globalThis.performance?.now?.() ?? Date.now();
      if (event.detail > 0 && now - this.lastTableScrollAt < 120) return;
      const button = event.target.closest('[data-index]');
      if (!button) return;
      const index = Number(button.dataset.index);
      this.show(index, false, false);
      this.openLightbox(index, button);
    });

    this.orbitalCards?.addEventListener('click', event => {
      const button = event.target.closest('[data-orbit-index]');
      if (!button) return;
      const index = Number(button.dataset.orbitIndex);
      this.show(index, false, false);
      this.openLightbox(index, button);
    });

    this.compactButton?.addEventListener('click', () => this.updateViewMode());
    this.backupButton?.addEventListener('click', () => this.downloadBackup());
    this.restoreButton?.addEventListener('click', () => this.backupInput?.click());
    this.backupInput?.addEventListener('change', event => this.restoreBackupFile(event.target.files?.[0]));
    this.scrollPrevButton?.addEventListener('click', () => this.scrollTable(-1));
    this.scrollNextButton?.addEventListener('click', () => this.scrollTable(1));
    this.viewport?.addEventListener('scroll', () => {
      this.lastTableScrollAt = globalThis.performance?.now?.() ?? Date.now();
      globalThis.cancelAnimationFrame?.(this.scrollFrame);
      this.scrollFrame = globalThis.requestAnimationFrame?.(() => this.updateScrollControls()) ?? 0;
    }, { passive: true });

    this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev?.addEventListener('click', () => this.moveLightbox(-1));
    this.lightboxNext?.addEventListener('click', () => this.moveLightbox(1));
    this.lightbox?.addEventListener('click', event => { if (event.target === this.lightbox) this.closeLightbox(); });
    this.lightbox?.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      this.moveLightbox(event.key === 'ArrowLeft' ? -1 : 1);
    });
    this.lightbox?.addEventListener('close', () => this.finishLightboxClose());

    this.whitButton?.addEventListener('click', () => this.openWhitConfirmation());
    this.whitConfirm?.addEventListener('click', event => {
      if (event.target.closest('[data-whit-cancel]')) this.closeWhitConfirmation();
      if (event.target.closest('[data-whit-confirm-send]')) this.prepareWhitDraft();
    });

    this.onStorage = event => {
      if (!event.key?.endsWith(STORAGE_EVENT_SUFFIX) || !event.newValue) return;
      let incoming = null;
      try { incoming = normalizeTarotState(JSON.parse(event.newValue)); } catch { return; }
      if (!incoming || compareTarotStates(incoming, this.state) <= 0) return;
      this.coordinator.remember(incoming, { persist: false, dispatch: false });
      this.state = incoming;
      this.selected = incoming.revealed.length - 1;
      this.drawing = false;
      this.render();
      if (this.lightbox?.open && this.lightboxIndex >= incoming.revealed.length) this.closeLightbox();
      else if (this.lightbox?.open) this.renderLightbox();
      preloadCardImages(this.state.waiting, 3);
    };
    globalThis.addEventListener?.('storage', this.onStorage);

    this.onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const latest = this.coordinator.latest();
      if (compareTarotStates(latest, this.state) <= 0) return;
      this.state = latest;
      this.selected = latest.revealed.length - 1;
      this.render();
    };
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  async draw() {
    if (this.drawing || this.navigationAnimation || this.state.completed) return null;
    const revealStartedAt = globalThis.performance?.now?.() ?? Date.now();
    let revealed = false;
    let failed = false;
    this.drawing = true;
    this.updateCurrentControls();
    this.altar.classList.add('revealing');
    this.startRevealMagic();

    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest));
      this.storageBlocked = !result.persisted;
      if (!result.persisted) this.warnPersistence();
      this.state = result.state;
      if (result.cardId === null) {
        this.selected = this.state.revealed.length - 1;
        this.render();
        return null;
      }

      this.selected = result.position;
      const imagePreparation = prepareCardImage(CARDS[result.cardId], { timeout: IMAGE_PREPARE_BUDGET_MS, priority: 'high' });
      await this.openRevealPortal(revealStartedAt);
      await imagePreparation;
      this.render(result.position, false);
      preloadCardImages(this.state.waiting, 3);
      if (!reducedMotion()) await this.waitForCurrentCardImage();
      this.finishRevealMagic(CARDS[result.cardId], result.position);
      revealed = true;
      globalThis.dispatchEvent?.(new CustomEvent('tarot:revealed', {
        detail: { cardId: result.cardId, position: result.position, remaining: this.state.waiting.length, release: RELEASE }
      }));
      return result.cardId;
    } catch {
      failed = true;
      this.state = this.coordinator.latest();
      this.selected = this.state.revealed.length - 1;
      this.render();
      this.setInteractionState(TAROT_INTERACTION_STATES.ERROR);
      if (this.magicAnnouncement) this.magicAnnouncement.textContent = 'A revelação foi interrompida. Toque novamente na Orbe para tentar outra vez.';
      announce('A Orbe encontrou uma interrupção. Seu círculo foi preservado; toque novamente para tentar.');
      return null;
    } finally {
      globalThis.clearTimeout(this.releaseTimer);
      const settleDelay = reducedMotion() ? 20 : (revealed ? SUCTION_IN_MS + 20 : 80);
      this.releaseTimer = globalThis.setTimeout(() => this.settleRevealMagic(failed), settleDelay);
    }
  }

  startRevealMagic() {
    this.hideCardToast();
    this.altar.classList.remove('magic-awakening', 'magic-manifesting', 'magic-born', 'ios-awakening', 'ios-crossing', 'ios-born', 'singularity-nav-out', 'singularity-nav-in', ...SUCTION_CLASSES);
    this.root.dataset.revealPhase = 'awakening';
    this.altar.setAttribute('aria-busy', 'true');
    this.orb.setAttribute('aria-busy', 'true');
    this.altar.classList.add('suction-out');
    this.setInteractionState(TAROT_INTERACTION_STATES.REVEALING);
    if (this.magicAnnouncement) this.magicAnnouncement.textContent = 'A Orbe abriu a espiral.';
  }

  async openRevealPortal(startedAt) {
    if (!reducedMotion()) {
      const now = globalThis.performance?.now?.() ?? Date.now();
      await pause(SUCTION_OUT_MS - (now - startedAt));
    }
    this.altar.classList.remove('suction-out');
    this.altar.classList.add('suction-hold');
    this.root.dataset.revealPhase = 'manifesting';
    this.orbState.textContent = 'A ESPIRAL ABRE O CAMINHO';
  }

  finishRevealMagic(card, position) {
    this.altar.classList.remove('suction-hold');
    this.altar.classList.add('suction-in');
    this.root.dataset.revealPhase = 'born';
    this.orbState.textContent = 'CARTA REVELADA';
    if (this.magicAnnouncement && card) this.magicAnnouncement.textContent = `${card.name}, direta. Carta ${position + 1} de ${DECK_SIZE} revelada.`;
    this.showCardToast(card);
  }

  waitForCurrentCardImage(budget = IMAGE_REVEAL_BUDGET_MS) {
    const image = this.stage.querySelector('.tarot-card-image');
    if (!image || (image.complete && image.naturalWidth > 0)) return Promise.resolve('ready');
    return new Promise(resolve => {
      let settled = false;
      let timer = 0;
      const finish = state => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timer);
        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);
        resolve(state);
      };
      const onLoad = () => finish('ready');
      const onError = () => finish('fallback');
      image.addEventListener('load', onLoad, { once: true });
      image.addEventListener('error', onError, { once: true });
      timer = globalThis.setTimeout(() => finish('budget'), Math.max(24, budget));
    });
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
      }, 2200);
    };
    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(revealToast));
    } else revealToast();
  }

  settleRevealMagic(failed = false) {
    this.drawing = false;
    this.altar.classList.remove('revealing', 'magic-awakening', 'magic-manifesting', 'magic-born', 'ios-awakening', 'ios-crossing', 'ios-born', 'singularity-nav-out', 'singularity-nav-in', ...SUCTION_CLASSES);
    this.altar.removeAttribute('aria-busy');
    this.orb.removeAttribute('aria-busy');
    this.root.dataset.revealPhase = 'idle';
    this.setInteractionState(failed ? TAROT_INTERACTION_STATES.ERROR : this.state.completed ? TAROT_INTERACTION_STATES.DISABLED : TAROT_INTERACTION_STATES.READY);
    this.updateCurrentControls();
  }

  async navigateCurrent(direction, source = 'botão') {
    if (this.drawing || this.navigationAnimation) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;

    if (reducedMotion()) {
      this.show(next, false, false);
      this.announceCardNavigation(source);
      return true;
    }

    const token = ++this.navigationToken;
    this.navigationAnimation = { token };
    const imagePreparation = prepareCardImage(CARDS[this.state.revealed[next]], { timeout: IMAGE_PREPARE_BUDGET_MS, priority: 'high' });
    this.altar.classList.remove(...SUCTION_CLASSES);
    this.altar.classList.add('suction-nav-out');
    try {
      await pause(SUCTION_OUT_MS);
      if (token !== this.navigationToken) return false;
      this.altar.classList.remove('suction-nav-out');
      this.altar.classList.add('suction-nav-hold');
      await imagePreparation;
      if (token !== this.navigationToken) return false;
      this.show(next, false, false);
      await this.waitForCurrentCardImage();
      if (token !== this.navigationToken) return false;
      this.announceCardNavigation(source);
      this.altar.classList.remove('suction-nav-hold');
      this.altar.classList.add('suction-nav-in');
      await pause(SUCTION_IN_MS);
      return true;
    } finally {
      this.altar.classList.remove(...SUCTION_CLASSES);
      if (token === this.navigationToken) this.navigationAnimation = null;
    }
  }

  navigateForward(source = 'botão') {
    if (this.drawing || this.navigationAnimation) return false;
    if (this.selected < this.state.revealed.length - 1) return this.navigateCurrent(1, source);
    return false;
  }

  announceCardNavigation(source) {
    const card = CARDS[this.state.revealed[this.selected]];
    if (!card || !this.magicAnnouncement) return;
    this.magicAnnouncement.textContent = `${card.name}, direta. Carta ${this.selected + 1} de ${this.state.revealed.length} reveladas. Navegação por ${source}.`;
  }

  handleCardKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    if (event.key === 'ArrowRight') this.navigateForward('teclado');
    else this.navigateCurrent(-1, 'teclado');
  }

  updateCurrentControls() {
    const total = this.state.revealed.length;
    const empty = total === 0 || this.selected < 0;
    if (this.currentNav) this.currentNav.dataset.empty = String(empty);
    if (this.currentPrev) this.currentPrev.disabled = empty || this.selected <= 0;
    const hasKnownNext = !empty && this.selected < total - 1;
    if (this.currentNext) {
      this.currentNext.disabled = this.drawing || !hasKnownNext;
      this.currentNext.setAttribute('aria-label', hasKnownNext ? 'Mostrar próxima carta já revelada' : 'Toque na Orbe para revelar uma nova carta');
    }
    if (this.gestureHint) this.gestureHint.innerHTML = empty
      ? '<span aria-hidden="true">— ✦</span> TOQUE NA ORBE PARA REVELAR <span aria-hidden="true">✦ —</span>'
      : hasKnownNext
        ? '<span aria-hidden="true">— ✦</span> USE AS SETAS PARA NAVEGAR <span aria-hidden="true">✦ —</span>'
        : !this.state.completed
          ? '<span aria-hidden="true">— ✦</span> TOQUE NA ORBE PARA UMA NOVA CARTA <span aria-hidden="true">✦ —</span>'
          : '<span aria-hidden="true">— ✦</span> AS 78 CARTAS FORAM REVELADAS <span aria-hidden="true">✦ —</span>';
    this.updateWhitBridge();
  }

  show(index, animate = true, scroll = false) {
    const card = CARDS[this.state.revealed[index]];
    if (!isFreeTarotCard(card)) return;
    this.hideCardToast();
    this.selected = index;
    this.stage.className = 'current table-preview';
    this.stage.innerHTML = `${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}${freeCardLabel(card, index + 1)}`;
    this.stage.setAttribute('aria-label', `${card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}. Use as setas para navegar.`);
    this.realTable.querySelectorAll('[data-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.index) === index));
    this.orbitalCards?.querySelectorAll('[data-orbit-index]').forEach(button => button.classList.toggle('selected', Number(button.dataset.orbitIndex) === index));
    this.updateCurrentControls();
    preloadCardImages([this.state.revealed[index - 1], this.state.revealed[index + 1], this.state.waiting[0]], 3);
    if (animate && !reducedMotion() && typeof this.stage.animate === 'function') {
      this.stage.animate([
        { opacity: 0, transform: 'translate3d(0,14px,0) scale(.965)' },
        { opacity: 1, transform: 'translate3d(0,-2px,0) scale(1.006)', offset: .72 },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (scroll) this.altar.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  updateViewMode() {
    this.viewport?.classList.add('is-compact');
    if (this.compactButton) {
      this.compactButton.setAttribute('aria-pressed', 'true');
      this.compactButton.textContent = 'Círculo em seis colunas';
      this.compactButton.disabled = true;
    }
    if (this.viewHint) this.viewHint.textContent = 'As seis colunas oficiais permanecem visíveis.';
    globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
  }

  scrollTable(direction) {
    if (!this.viewport) return;
    const distance = Math.max(220, this.viewport.clientWidth * .78);
    this.viewport.scrollBy({ left: direction * distance, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  updateScrollControls() {
    if (!this.viewport) return;
    const maximum = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth);
    if (this.scrollPrevButton) this.scrollPrevButton.disabled = maximum < 2 || this.viewport.scrollLeft <= 2;
    if (this.scrollNextButton) this.scrollNextButton.disabled = maximum < 2 || this.viewport.scrollLeft >= maximum - 2;
  }

  openLightbox(index, trigger = null) {
    if (!this.lightbox || !CARDS[this.state.revealed[index]]) return false;
    this.lightboxIndex = index;
    this.lightboxTrigger = trigger;
    this.renderLightbox();
    if (!this.lightbox.open) {
      document.body.classList.add('card-lightbox-open');
      if (typeof this.lightbox.showModal === 'function') this.lightbox.showModal();
      else this.lightbox.setAttribute('open', '');
    }
    globalThis.requestAnimationFrame?.(() => this.lightboxClose?.focus({ preventScroll: true }));
    return true;
  }

  renderLightbox() {
    const card = CARDS[this.state.revealed[this.lightboxIndex]];
    if (!card || !this.lightboxImage) return;
    this.lightboxImage.innerHTML = cardImageMarkup(card, { alt: `${card.name}, direta, ampliada`, priority: 'high' });
    if (this.lightboxTitle) this.lightboxTitle.textContent = card.name;
    if (this.lightboxPosition) this.lightboxPosition.textContent = `POSIÇÃO ${this.lightboxIndex + 1} DE ${DECK_SIZE}`;
    if (this.lightboxPrev) this.lightboxPrev.disabled = this.lightboxIndex <= 0;
    if (this.lightboxNext) this.lightboxNext.disabled = this.lightboxIndex >= this.state.revealed.length - 1;
    preloadCardImages([this.state.revealed[this.lightboxIndex - 1], this.state.revealed[this.lightboxIndex + 1]], 2);
  }

  moveLightbox(direction) {
    const nextIndex = this.lightboxIndex + direction;
    if (nextIndex < 0 || nextIndex >= this.state.revealed.length) return false;
    this.lightboxIndex = nextIndex;
    this.selected = nextIndex;
    this.renderLightbox();
    this.show(nextIndex, false, false);
    return true;
  }

  closeLightbox() {
    if (!this.lightbox?.open) return;
    if (typeof this.lightbox.close === 'function') this.lightbox.close();
    else {
      this.lightbox.removeAttribute('open');
      this.finishLightboxClose();
    }
  }

  finishLightboxClose() {
    document.body.classList.remove('card-lightbox-open');
    const focusTarget = this.lightboxTrigger || this.realTable.querySelector(`[data-index="${this.lightboxIndex}"]`);
    this.lightboxTrigger = null;
    focusTarget?.focus?.({ preventScroll: true });
  }

  renderOrbit() {
    this.orbitalCards?.replaceChildren();
  }

  render(landing = -1, animateCurrent = false) {
    const total = this.state.revealed.length;
    const waiting = this.state.waiting.length;
    const count = this.root.querySelector('#count');
    const remaining = this.root.querySelector('#remaining');
    const progress = this.root.querySelector('#deckProgress');
    if (count) count.innerHTML = `${total}<small>/${DECK_SIZE}</small>`;
    if (remaining) remaining.textContent = waiting ? `${waiting} cartas aguardam` : 'Ciclo completo · 78 cartas reveladas';
    if (progress) progress.style.width = `${(total / DECK_SIZE) * 100}%`;
    if (this.ritualRevealed) this.ritualRevealed.textContent = String(total);
    if (this.ritualRemaining) this.ritualRemaining.textContent = String(waiting);
    if (this.saveState) this.saveState.textContent = this.storageBlocked
      ? `Círculo preservado nesta aba · ${total} de ${DECK_SIZE}`
      : total ? `Tarot Livre salvo neste aparelho · ${total} de ${DECK_SIZE}` : 'Novo círculo salvo neste aparelho';
    if (this.editorialState) this.editorialState.textContent = tarotEditorialStatus(total, DECK_SIZE);
    this.orb.disabled = this.state.completed || this.drawing;
    this.orb.setAttribute('aria-label', waiting ? `Revelar próxima carta pela Orbe. ${waiting} restantes.` : 'Círculo completo');
    this.orbState.textContent = this.state.completed ? 'CÍRCULO COMPLETO' : this.drawing ? 'A ESPIRAL ESTÁ SE ABRINDO' : 'REVELAR CARTA';
    this.shuffleButton.disabled = waiting < 2;

    this.realTable.innerHTML = Array.from({ length: DECK_SIZE }, (_, index) => {
      const cardId = this.state.revealed[index];
      const row = Math.floor(index / 6) + 1;
      const column = (index % 6) + 1;
      if (cardId === undefined) {
        return `<div data-position="${index}" class="table-slot waiting" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" aria-disabled="true" aria-label="Posição ${index + 1}, aguardando carta"><span class="position">${index + 1}</span></div>`;
      }
      const card = CARDS[cardId];
      if (!isFreeTarotCard(card)) return '';
      return `<button type="button" data-index="${index}" data-position="${index}" role="gridcell" aria-rowindex="${row}" aria-colindex="${column}" class="table-slot revealed${index === this.selected ? ' selected' : ''}${index === landing ? ' landing' : ''}" aria-label="${freeCardAriaLabel(card, index + 1)}">${cardImageMarkup(card, { decorative: true })}<span class="order">${index + 1}</span></button>`;
    }).join('');

    this.renderOrbit();
    globalThis.requestAnimationFrame?.(() => this.updateScrollControls());
    if (total) {
      if (this.selected < 0 || this.selected >= total) this.selected = total - 1;
      this.show(this.selected, animateCurrent, false);
    } else {
      this.selected = -1;
      this.stage.className = 'current table-preview empty';
      this.stage.innerHTML = EMPTY_ALTAR;
      this.stage.setAttribute('aria-label', 'Nenhuma carta revelada. Toque na Orbe para começar.');
      this.updateWhitBridge();
    }
    this.updateCurrentControls();
    if (!this.drawing) this.setInteractionState(this.state.completed ? TAROT_INTERACTION_STATES.DISABLED : TAROT_INTERACTION_STATES.READY);
  }

  async reset(force = false) {
    if (this.drawing || this.navigationAnimation) return false;
    if (this.state.revealed.length > 0 && force !== true && globalThis.confirm && !globalThis.confirm('Fechar este círculo e iniciar um novo Tarot Livre?')) return false;
    try {
      this.closeWhitConfirmation();
      this.hideCardToast();
      this.state = await this.coordinator.commit(latest => resetTarotState({ now: () => Math.max(Date.now(), latest.updatedAt + 1) }));
      this.storageBlocked = !this.coordinator.lastPersisted;
      if (this.storageBlocked) this.warnPersistence();
      this.selected = -1;
      this.closeLightbox();
      this.render();
      preloadCardImages(this.state.waiting, 3);
      announce('Um novo círculo do Tarot Livre foi preparado.');
      return true;
    } catch {
      this.setInteractionState(TAROT_INTERACTION_STATES.ERROR);
      announce('Não foi possível recomeçar agora. Seu círculo atual continua preservado.');
      return false;
    }
  }

  async reshuffle() {
    if (this.drawing || this.navigationAnimation || this.state.waiting.length < 2) return false;
    try {
      const revealedBefore = this.state.revealed.join(',');
      this.state = await this.coordinator.commit(latest => shuffleRemainingCards(latest));
      this.storageBlocked = !this.coordinator.lastPersisted;
      if (this.storageBlocked) this.warnPersistence();
      if (this.state.revealed.join(',') !== revealedBefore) throw new Error('As cartas reveladas não podem ser movidas.');
      this.render();
      preloadCardImages(this.state.waiting, 3);
      announce(`${this.state.waiting.length} cartas ainda ocultas foram embaralhadas. As reveladas permaneceram no lugar.`);
      return true;
    } catch {
      this.setInteractionState(TAROT_INTERACTION_STATES.ERROR);
      announce('Não foi possível embaralhar agora. Nenhuma carta revelada foi alterada.');
      return false;
    }
  }

  downloadBackup() {
    const contents = createTarotBackup(this.state);
    if (!contents || typeof Blob === 'undefined' || !globalThis.URL?.createObjectURL) return false;
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    link.href = url;
    link.download = `divina-bruxa-tarot-livre-${stamp}.json`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    globalThis.setTimeout(() => URL.revokeObjectURL(url), 1200);
    announce('A cópia privada do Tarot Livre foi guardada.');
    return true;
  }

  async restoreBackupFile(file) {
    if (this.backupInput) this.backupInput.value = '';
    if (!file) return false;
    if (Number(file.size) > TAROT_MAX_BACKUP_BYTES) {
      announce('Este arquivo é grande demais para ser uma cópia válida do Tarot Livre.');
      return false;
    }
    let restored = null;
    try { restored = restoreTarotBackup(await file.text()); } catch { restored = null; }
    if (!restored) {
      announce('Este arquivo não contém um Tarot Livre válido.');
      return false;
    }
    if (this.state.revealed.length > 0 && globalThis.confirm && !globalThis.confirm('Substituir o círculo atual pelo Tarot Livre guardado neste arquivo?')) return false;
    this.state = await this.coordinator.commit(latest => ({ ...restored, updatedAt: Math.max(restored.updatedAt, latest.updatedAt + 1) }));
    this.storageBlocked = !this.coordinator.lastPersisted;
    if (this.storageBlocked) this.warnPersistence();
    this.selected = this.state.revealed.length - 1;
    this.closeLightbox();
    this.closeWhitConfirmation();
    this.render();
    preloadCardImages(this.state.waiting, 3);
    announce(`Tarot Livre retomado com ${this.state.revealed.length} cartas reveladas.`);
    return true;
  }

  updateWhitBridge() {
    if (!this.whitBridge || !this.whitButton || !this.whitState) return;
    const cardId = this.state.revealed[this.selected];
    const card = CARDS[cardId];
    const ready = isFreeTarotCard(card);
    this.whitButton.disabled = !ready;
    this.whitState.textContent = ready
      ? `Carta escolhida: ${card.name} · posição ${this.selected + 1}. Somente ela será preparada.`
      : 'Revele uma carta para ativar esta ponte.';
    this.whitBridge.dataset.ready = String(ready);
  }

  openWhitConfirmation() {
    const cardId = this.state.revealed[this.selected];
    const card = CARDS[cardId];
    if (!isFreeTarotCard(card) || !this.whitConfirm) return;
    this.whitConfirm.hidden = false;
    this.whitConfirm.innerHTML = `<p><b>Preparar ${card.name} para Whit?</b><small>Será criado apenas um rascunho com o nome desta carta e a posição ${this.selected + 1}. Nenhuma outra carta, histórico, Diário ou dado oculto será enviado. Na Whit, você ainda poderá revisar o texto e precisará consentir antes de qualquer chamada de IA.</small></p><div><button type="button" data-whit-cancel>Cancelar</button><button type="button" class="primary" data-whit-confirm-send>Preparar para Whit</button></div>`;
    this.whitConfirm.querySelector('[data-whit-cancel]')?.focus({ preventScroll: true });
  }

  closeWhitConfirmation() {
    if (!this.whitConfirm) return;
    this.whitConfirm.hidden = true;
    this.whitConfirm.innerHTML = '';
  }

  prepareWhitDraft() {
    const cardId = this.state.revealed[this.selected];
    const card = CARDS[cardId];
    if (!isFreeTarotCard(card)) return false;
    const draft = `Quero refletir com Whit sobre uma única carta que escolhi conscientemente no Tarot Livre.\nCarta: ${card.name} (direta)\nPosição no meu círculo: ${this.selected + 1}\nAjude-me a explorar o símbolo sem tratar a carta como previsão, sentença ou prova de fatos ocultos.`;
    try {
      this.storage.set(AI_DRAFT_KEY, { text: draft, source: 'message', at: new Date().toISOString(), origin: 'tarot-livre-v214' });
    } catch {
      announce('Não foi possível preparar a carta para Whit neste navegador.');
      return false;
    }
    this.closeWhitConfirmation();
    announce(`Somente ${card.name} foi preparada para Whit. Nada foi enviado ainda.`);
    globalThis.orbe?.go?.('ai');
    return true;
  }

  destroy() {
    globalThis.clearTimeout(this.releaseTimer);
    this.hideCardToast();
    globalThis.cancelAnimationFrame?.(this.scrollFrame);
    this.navigationToken += 1;
    this.navigationAnimation = null;
    this.altar.classList.remove('singularity-nav-out', 'singularity-nav-in', ...SUCTION_CLASSES);
    this.closeLightbox();
    globalThis.removeEventListener?.('storage', this.onStorage);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }
}
