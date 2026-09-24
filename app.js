import { CARDS, DAILY_MESSAGES } from './data/cards.js';
import { WORLDS } from './data/worlds.js';
import { dailyCardIndex, dailyStorageKey, dateKeyInTimeZone } from './lib/daily-card.js';
import { createSpreadState, revealSpreadPosition, SPREADS, spreadStorageKey, validateSpreadState } from './lib/spread-state.js';
import { createTarotState, revealNext, shuffleWaiting, validateTarotState } from './lib/tarot-state.js';
import { createJournalWorld } from './worlds/journal.js';
import { createLibraryWorld } from './worlds/library.js';
import { createSchoolWorld } from './worlds/school.js';
import { createWhitWorld } from './worlds/whit.js';
import { createAccountWorld } from './worlds/account.js';
import { createConsultationsWorld } from './worlds/consultations.js';
import { createMusicWorld } from './worlds/music.js';
import { createPremiumWorld } from './worlds/premium.js';
import { createSkinsWorld } from './skins-world-v301.js';
import { createStoreWorld } from './worlds/store.js';
import { createVideosWorld } from './worlds/videos.js';
import { RealityOrbEngine } from './orb-engine-v68.js';
import { createLivingUniverseV524 } from './living-universe-core-v524.js';

const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAROT_KEY = 'divina-bruxa-3.tarot-livre.v1';
const MENU_TRANSITION_MS = 720;

const worlds = WORLDS;
const INTENTIONS = Object.freeze({
  tarot:['tarot', 'carta-do-dia', 'tiragens', 'biblioteca'],
  learn:['escola'],
  inner:['diario', 'whit'],
  universes:['musica', 'videos', 'skins'],
  encounter:['consultas', 'loja', 'premium', 'conta']
});
const INTENTION_LABELS = Object.freeze({
  tarot:'Tarot',
  learn:'Aprender',
  inner:'Interior',
  universes:'Universos',
  encounter:'Encontro'
});
const MENU_LABELS = Object.freeze({ diario:'Diário & Espelho' });
const SECONDARY_ROUTES = new Set(['premium', 'conta']);

const body = document.body;
const main = document.querySelector('#main');
const home = document.querySelector('#home');
const tarotWorld = document.querySelector('#tarot');
const dailyWorld = document.querySelector('#daily');
const spreadsWorld = document.querySelector('#spreads');
const schoolWorld = document.querySelector('#school');
const libraryWorld = document.querySelector('#library');
const journalWorld = document.querySelector('#journal');
const whitWorld = document.querySelector('#whit');
const consultationsWorld = document.querySelector('#consultations');
const premiumWorld = document.querySelector('#premium');
const accountWorld = document.querySelector('#account');
const storeWorld = document.querySelector('#store');
const musicWorld = document.querySelector('#music');
const videosWorld = document.querySelector('#videos');
const skinsWorld = document.querySelector('#skins');
const orb = document.querySelector('#orb');
const orbCue = document.querySelector('#orbCue');
const journey = document.querySelector('#journey');
const journeyTrigger = document.querySelector('#journeyTrigger');
const closeJourney = document.querySelector('#closeJourney');
const constellation = document.querySelector('#constellation');
const livingMap = document.querySelector('#livingMap');
const journeyHint = document.querySelector('#journeyHint');
const announcer = document.querySelector('#announcer');
const pathNodes = [...document.querySelectorAll('.path-node')];
const routeLinks = [...document.querySelectorAll('[data-route-link]')];

let currentRoute = 'home';
let selectedIntention = null;
let focusBeforeJourney = null;
let livingUniverse = null;
let orbEngine = null;
let menuCloseTimer = 0;
let routeSettleTimer = 0;

function announce(message) {
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = message; });
}

function pulseOrb() {
  orb.classList.remove('is-answering');
  void orb.offsetWidth;
  orb.classList.add('is-answering');
  setTimeout(() => orb.classList.remove('is-answering'), 720);
}

function normalizedRoute(value = '') {
  const route = value.replace(/^#\/?/, '').replace(/^\//, '').trim() || 'home';
  return worlds[route] ? route : 'home';
}

function intentionForRoute(route) {
  return Object.entries(INTENTIONS).find(([, routes]) => routes.includes(route))?.[0] || null;
}

function setActiveWorld(route) {
  const targets = {
    home,
    tarot:tarotWorld,
    'carta-do-dia':dailyWorld,
    tiragens:spreadsWorld,
    escola:schoolWorld,
    biblioteca:libraryWorld,
    diario:journalWorld,
    whit:whitWorld,
    consultas:consultationsWorld,
    premium:premiumWorld,
    conta:accountWorld,
    loja:storeWorld,
    musica:musicWorld,
    videos:videosWorld,
    skins:skinsWorld
  };
  const target = targets[route] || home;
  [home, tarotWorld, dailyWorld, spreadsWorld, schoolWorld, libraryWorld, journalWorld, whitWorld, consultationsWorld, premiumWorld, accountWorld, storeWorld, musicWorld, videosWorld, skinsWorld].forEach(section => {
    const active = section === target;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  requestAnimationFrame(() => target.classList.add('is-active'));
}

function applyRoute(route, { push = true, focus = true, animate = true } = {}) {
  const next = normalizedRoute(route);
  const world = worlds[next];
  const previous = currentRoute;
  const travelling = animate && previous !== next;
  if (travelling) {
    body.dataset.travel = 'active';
    body.dataset.nextRoute = next;
    livingUniverse?.pause?.('route-travel');
    document.dispatchEvent(new CustomEvent('divina:supreme-orb-will-navigate', {
      detail:{ from:previous, to:next, source:'divina-3-recovery' }
    }));
  }
  const swap = () => {
    if (currentRoute === 'musica' && next !== 'musica') music.deactivate();
    if (currentRoute === 'videos' && next !== 'videos') videos.deactivate();
    currentRoute = next;
    body.dataset.route = next;
    body.style.setProperty('--world', world.color);
    setActiveWorld(next);
    if (next === 'tarot') tarot.render();
    if (next === 'carta-do-dia') daily.render();
    if (next === 'tiragens') spreads.render();
    if (next === 'escola') school.activate();
    if (next === 'biblioteca') library.activate();
    if (next === 'diario') journal.activate();
    if (next === 'whit') whit.activate();
    if (next === 'consultas') consultations.activate();
    if (next === 'premium') premium.activate();
    if (next === 'conta') account.activate();
    if (next === 'loja') store.activate();
    if (next === 'musica') music.activate();
    if (next === 'videos') videos.activate();
    if (next === 'skins') skins.activate();
    document.title = next === 'home' ? 'Divina Bruxa' : `${world.title} — Divina Bruxa`;
    const orbLabels = {
      tarot:['Revelar a próxima carta', 'Revelar carta'],
      'carta-do-dia':['Revelar a Carta do Dia', 'Revelar a aurora'],
      tiragens:['Revelar a próxima posição da tiragem', 'Revelar posição']
    };
    const [orbLabel, cue] = orbLabels[next] || [
      next === 'home' ? 'Orbe viva: toque para despertar; toque duplo abre o Tarot Livre' : 'Abrir o mapa vivo',
      next === 'home' ? 'Toque para despertar. Toque duplo para abrir o Tarot Livre.' : 'Toque para viajar'
    ];
    orb.setAttribute('aria-label', orbLabel);
    orbCue.textContent = cue;
    routeLinks.forEach(link => link.setAttribute('aria-current', link.dataset.routeLink === next ? 'page' : 'false'));
    const titleIds = {
      home:'homeTitle',
      tarot:'tarotTitle',
      'carta-do-dia':'dailyTitle',
      tiragens:'spreadsTitle',
      escola:'schoolTitle',
      biblioteca:'libraryTitle',
      diario:'journalTitle',
      whit:'whitTitle',
      consultas:'consultationsTitle',
      premium:'premiumTitle',
      conta:'accountTitle',
      loja:'storeTitle',
      musica:'musicTitle',
      videos:'videosTitle',
      skins:'skinsTitle'
    };
    if (focus) document.querySelector(`#${titleIds[next] || 'homeTitle'}`)?.focus?.({ preventScroll:true });
  };

  // A Orbe física nunca entra em uma captura de View Transition: isso evita
  // a cópia visual que parecia uma segunda Orbe durante a viagem.
  swap();

  if (push && normalizedRoute(location.hash) !== next) history.pushState({ route:next }, '', `#/${next}`);
  selectedIntention = intentionForRoute(next);
  announce(`${world.title}. ${world.description}`);
  clearTimeout(routeSettleTimer);
  const settle = () => {
    delete body.dataset.travel;
    delete body.dataset.nextRoute;
    livingUniverse?.setRoute?.(next);
    livingUniverse?.start?.('route-settle');
    document.dispatchEvent(new CustomEvent('divina:supreme-orb-did-navigate', {
      detail:{ from:previous, to:next, source:'divina-3-recovery' }
    }));
  };
  if (travelling && !REDUCED_MOTION) routeSettleTimer = setTimeout(settle, 620);
  else settle();
}

function renderIntention(intention = null) {
  selectedIntention = Object.hasOwn(INTENTIONS, intention) ? intention : null;
  const currentIntention = intentionForRoute(currentRoute);
  livingMap.dataset.intention = selectedIntention || '';
  journey.dataset.depth = selectedIntention ? 'destinations' : 'intentions';
  pathNodes.forEach(node => {
    const expanded = node.dataset.intention === selectedIntention;
    node.setAttribute('aria-expanded', String(expanded));
    if (node.dataset.intention === currentIntention) node.setAttribute('aria-current', 'step');
    else node.removeAttribute('aria-current');
  });
  constellation.replaceChildren();

  if (!selectedIntention) {
    delete constellation.dataset.count;
    journeyHint.textContent = 'Escolha uma intenção.';
    return;
  }

  const destinations = INTENTIONS[selectedIntention].map(route => [route, worlds[route]]);
  constellation.dataset.count = String(destinations.length);

  destinations.forEach(([route, world], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `destination${SECONDARY_ROUTES.has(route) ? ' destination--utility' : ''}`;
    button.dataset.route = route;
    const sigil = document.createElement('span');
    sigil.setAttribute('aria-hidden', 'true');
    sigil.textContent = world.sigil;
    const label = document.createElement('b');
    label.textContent = MENU_LABELS[route] || world.label;
    button.append(sigil, label);
    button.style.animationDelay = `${index * 55}ms`;
    if (route === currentRoute) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      pulseOrb();
      closeMap({ restoreFocus:false });
      applyRoute(route);
    });
    constellation.append(button);
  });
  journeyHint.textContent = `${INTENTION_LABELS[selectedIntention]} — escolha uma realidade.`;
}

function openMap({ focusClose = false } = {}) {
  if (body.dataset.menu !== 'closed') return;
  clearTimeout(menuCloseTimer);
  delete journey.dataset.closing;
  focusBeforeJourney = document.activeElement;
  // O universo permanece visualmente presente, mas congela enquanto o mapa
  // recebe o toque. A Orbe continua viva no próprio motor, sem competir por
  // outro frame loop com a abertura do pentagrama.
  livingUniverse?.pause?.('menu-opening');
  body.dataset.menu = 'opening';
  journey.hidden = false;
  journey.setAttribute('aria-hidden', 'false');
  journeyTrigger.setAttribute('aria-expanded', 'true');
  main.inert = true;
  renderIntention(null);
  document.dispatchEvent(new CustomEvent('divina:menu-state', { detail:{ state:'opening', route:currentRoute } }));
  pulseOrb();
  requestAnimationFrame(() => {
    if (body.dataset.menu !== 'opening') return;
    body.dataset.menu = 'open';
    document.dispatchEvent(new CustomEvent('divina:menu-state', { detail:{ state:'open', route:currentRoute } }));
    if (focusClose) closeJourney.focus({ preventScroll:true });
  });
}

function closeMap({ restoreFocus = true } = {}) {
  if (!['opening','open','closing'].includes(body.dataset.menu)) return;
  if (body.dataset.menu === 'closing') return;
  body.dataset.menu = 'closing';
  journey.dataset.closing = 'true';
  journeyTrigger.setAttribute('aria-expanded', 'false');
  document.dispatchEvent(new CustomEvent('divina:menu-state', { detail:{ state:'closing', route:currentRoute } }));
  clearTimeout(menuCloseTimer);
  const finish = () => {
    body.dataset.menu = 'closed';
    journey.hidden = true;
    journey.setAttribute('aria-hidden', 'true');
    delete journey.dataset.closing;
    main.inert = false;
    livingUniverse?.start?.('menu-closed');
    document.dispatchEvent(new CustomEvent('divina:menu-state', { detail:{ state:'closed', route:currentRoute } }));
    if (restoreFocus) (focusBeforeJourney instanceof HTMLElement ? focusBeforeJourney : journeyTrigger).focus({ preventScroll:true });
  };
  if (REDUCED_MOTION) finish();
  else menuCloseTimer = setTimeout(finish, MENU_TRANSITION_MS);
}

function handleOrb({ source = 'touch' } = {}) {
  pulseOrb();
  if (['opening','open','closing'].includes(body.dataset.menu)) return closeMap();
  if (currentRoute === 'home') return openMap({ focusClose:source === 'keyboard' });
  if (currentRoute === 'tarot') return tarot.reveal();
  if (currentRoute === 'carta-do-dia') return daily.reveal();
  if (currentRoute === 'tiragens') return spreads.reveal();
  openMap({ focusClose:source === 'keyboard' });
}

journeyTrigger.addEventListener('click', event => openMap({ focusClose:event.detail === 0 }));
closeJourney.addEventListener('click', () => closeMap());
pathNodes.forEach(node => node.addEventListener('click', () => {
  renderIntention(node.dataset.intention);
}));
routeLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  closeMap({ restoreFocus:false });
  applyRoute(link.dataset.routeLink);
}));

document.addEventListener('keydown', event => {
  if (body.dataset.menu !== 'open') return;
  if (event.key === 'Escape') return closeMap();
  if (event.key !== 'Tab') return;
  const focusable = [...journey.querySelectorAll('button:not(:disabled)')].filter(node => !node.hidden);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener('popstate', () => {
  closeMap({ restoreFocus:false });
  applyRoute(normalizedRoute(location.hash), { push:false, focus:false });
});

function initialTarotState() {
  return createTarotState(CARDS.map(card => card.id));
}

function loadTarotState() {
  try { return validateTarotState(JSON.parse(localStorage.getItem(TAROT_KEY)), CARDS.map(card => card.id)) || initialTarotState(); }
  catch { return initialTarotState(); }
}

const tarot = {
  state: loadTarotState(),
  resetArmed: false,
  resetTimer: 0,
  nodes: {
    current: document.querySelector('#currentCard'),
    image: document.querySelector('#currentCardImage'),
    empty: document.querySelector('.current-card__empty'),
    name: document.querySelector('#cardName'),
    position: document.querySelector('#cardPosition'),
    meta: document.querySelector('#cardMeta'),
    revealed: document.querySelector('#revealedCount'),
    remaining: document.querySelector('#remainingCount'),
    progress: document.querySelector('#tarotProgress'),
    trail: document.querySelector('#revealedTrail'),
    previous: document.querySelector('#previousCard'),
    next: document.querySelector('#nextCard'),
    shuffle: document.querySelector('#shuffleRemaining'),
    reset: document.querySelector('#resetTarot'),
    persistence: document.querySelector('#tarotPersistence')
  },

  save() {
    try {
      localStorage.setItem(TAROT_KEY, JSON.stringify(this.state));
      this.nodes.persistence.textContent = 'Mesa guardada neste aparelho.';
    } catch {
      this.nodes.persistence.textContent = 'Mesa preservada somente enquanto esta página permanecer aberta.';
    }
  },

  current() {
    return this.state.cursor >= 0 ? CARDS[this.state.revealed[this.state.cursor]] : null;
  },

  imagePath(card) { return `assets/cards/${card.image}`; },

  render() {
    const card = this.current();
    const revealed = this.state.revealed.length;
    const remaining = this.state.waiting.length;
    this.nodes.revealed.textContent = String(revealed);
    this.nodes.remaining.textContent = String(remaining);
    this.nodes.progress.style.width = `${(revealed / CARDS.length) * 100}%`;
    this.nodes.previous.disabled = this.state.cursor <= 0;
    this.nodes.next.disabled = this.state.cursor < 0 || this.state.cursor >= revealed - 1;
    this.nodes.shuffle.disabled = remaining < 2;
    orbCue.textContent = currentRoute === 'tarot' ? remaining ? 'Revelar carta' : 'Círculo completo' : orbCue.textContent;

    if (!card) {
      this.nodes.current.disabled = true;
      this.nodes.current.classList.add('is-empty');
      this.nodes.image.hidden = true;
      this.nodes.empty.hidden = false;
      this.nodes.name.textContent = 'Toque na Orbe';
      this.nodes.position.textContent = 'O CÍRCULO AGUARDA';
      this.nodes.meta.textContent = 'Sempre direta · sem significado automático';
      this.nodes.trail.replaceChildren();
      return;
    }

    this.nodes.current.disabled = false;
    this.nodes.current.classList.remove('is-empty');
    this.nodes.empty.hidden = true;
    this.nodes.image.src = this.imagePath(card);
    this.nodes.image.alt = card.name;
    this.nodes.image.hidden = false;
    this.nodes.current.setAttribute('aria-label', `${card.name}. Ampliar carta.`);
    this.nodes.name.textContent = card.name;
    this.nodes.position.textContent = `POSIÇÃO ${this.state.cursor + 1} DE ${revealed}`;
    this.nodes.meta.textContent = `${card.arcana} · ${card.element} · direta`;
    this.renderTrail();
  },

  renderTrail() {
    const start = Math.max(0, this.state.cursor - 2);
    const end = Math.min(this.state.revealed.length, start + 5);
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      const card = CARDS[this.state.revealed[index]];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'trail-card';
      button.setAttribute('aria-label', `Ver ${card.name}, posição ${index + 1}`);
      if (index === this.state.cursor) button.setAttribute('aria-current', 'true');
      const image = new Image();
      image.src = this.imagePath(card);
      image.alt = '';
      image.loading = 'lazy';
      image.width = 64;
      image.height = 96;
      button.append(image);
      button.addEventListener('click', () => { this.state.cursor = index; this.render(); });
      fragment.append(button);
    }
    this.nodes.trail.replaceChildren(fragment);
  },

  reveal() {
    if (!this.state.waiting.length) {
      announce('O círculo das 78 cartas está completo.');
      return;
    }
    const result = revealNext(this.state);
    const id = result.revealedId;
    this.state = result.state;
    this.save();
    this.render();
    const card = CARDS[id];
    announce(`${card.name}, posição ${this.state.cursor + 1}. ${this.state.waiting.length} cartas ainda ocultas.`);
  },

  move(delta) {
    const next = this.state.cursor + delta;
    if (next < 0 || next >= this.state.revealed.length) return;
    this.state.cursor = next;
    this.render();
    announce(`${this.current().name}, posição ${next + 1}.`);
  },

  shuffle() {
    if (this.state.waiting.length < 2) return;
    this.state = shuffleWaiting(this.state);
    this.save();
    pulseOrb();
    announce(`${this.state.waiting.length} cartas ocultas foram embaralhadas. As reveladas permaneceram no lugar.`);
  },

  reset() {
    if (!this.resetArmed && this.state.revealed.length) {
      this.resetArmed = true;
      this.nodes.reset.textContent = 'Confirmar novo círculo';
      announce('Toque novamente para apagar esta mesa e iniciar um novo círculo.');
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        this.resetArmed = false;
        this.nodes.reset.textContent = 'Novo círculo';
      }, 4500);
      return;
    }
    clearTimeout(this.resetTimer);
    this.resetArmed = false;
    this.nodes.reset.textContent = 'Novo círculo';
    this.state = initialTarotState();
    this.save();
    this.render();
    pulseOrb();
    announce('Novo círculo iniciado. As 78 cartas aguardam.');
  }
};

tarot.nodes.previous.addEventListener('click', () => tarot.move(-1));
tarot.nodes.next.addEventListener('click', () => tarot.move(1));
tarot.nodes.shuffle.addEventListener('click', () => tarot.shuffle());
tarot.nodes.reset.addEventListener('click', () => tarot.reset());

const cardDialog = document.querySelector('#cardDialog');
const dialogCardImage = document.querySelector('#dialogCardImage');
const dialogCardName = document.querySelector('#dialogCardName');
const dialogCardPosition = document.querySelector('#dialogCardPosition');
const dialogPublicLink = document.querySelector('#dialogPublicLink');

function showCardDialog(card, position, publicHref = '') {
  dialogCardImage.src = `assets/cards/${card.image}`;
  dialogCardImage.alt = card.name;
  dialogCardName.textContent = card.name;
  dialogCardPosition.textContent = position;
  dialogPublicLink.hidden = !publicHref;
  if (publicHref) dialogPublicLink.href = publicHref;
  else dialogPublicLink.removeAttribute('href');
  cardDialog.showModal();
}

tarot.nodes.current.addEventListener('click', () => {
  const card = tarot.current();
  if (!card) return;
  showCardDialog(card, `POSIÇÃO ${tarot.state.cursor + 1}`);
});

const daily = {
  dateKey: dateKeyInTimeZone(),
  nodes: {
    date:document.querySelector('#dailyDate'),
    card:document.querySelector('#dailyCard'),
    image:document.querySelector('#dailyCardImage'),
    empty:document.querySelector('#dailyCard .current-card__empty'),
    name:document.querySelector('#dailyCardName'),
    position:document.querySelector('#dailyPosition'),
    meta:document.querySelector('#dailyCardMeta'),
    message:document.querySelector('#dailyMessage'),
    state:document.querySelector('#dailyState')
  },

  get card() { return CARDS[dailyCardIndex(this.dateKey, CARDS.length)]; },

  get revealed() {
    try { return localStorage.getItem(dailyStorageKey(this.dateKey)) === 'revealed'; }
    catch { return false; }
  },

  reveal() {
    if (this.revealed) {
      announce(`${this.card.name}. Esta é a sua Carta do Dia até a próxima meia-noite em Brasília.`);
      return;
    }
    try { localStorage.setItem(dailyStorageKey(this.dateKey), 'revealed'); } catch {}
    this.render();
    announce(`Carta do Dia: ${this.card.name}. Sempre direta.`);
  },

  render() {
    const displayDate = new Intl.DateTimeFormat('pt-BR', {
      timeZone:'America/Sao_Paulo',
      weekday:'long',
      day:'2-digit',
      month:'long',
      year:'numeric'
    }).format(new Date());
    this.nodes.date.textContent = displayDate;
    const revealed = this.revealed;
    const card = this.card;
    this.nodes.card.disabled = !revealed;
    this.nodes.card.classList.toggle('is-empty', !revealed);
    this.nodes.empty.hidden = revealed;
    this.nodes.image.hidden = !revealed;

    if (!revealed) {
      this.nodes.image.removeAttribute('src');
      this.nodes.image.alt = '';
      this.nodes.card.setAttribute('aria-label', 'Carta do Dia ainda não revelada');
      this.nodes.name.textContent = 'Toque na Orbe';
      this.nodes.position.textContent = 'RITUAL DIÁRIO';
      this.nodes.meta.textContent = 'Uma carta · um ciclo · sem invertidas';
      this.nodes.message.textContent = 'Respire. Quando fizer sentido, toque na Orbe. A carta permanecerá até a próxima meia-noite em Brasília.';
      this.nodes.state.textContent = 'Ainda não revelada neste aparelho.';
      if (currentRoute === 'carta-do-dia') orbCue.textContent = 'Revelar a aurora';
      return;
    }

    this.nodes.image.src = `assets/cards/${card.image}`;
    this.nodes.image.alt = card.name;
    this.nodes.card.setAttribute('aria-label', `${card.name}. Ampliar Carta do Dia.`);
    this.nodes.name.textContent = card.name;
    this.nodes.position.textContent = 'SÍMBOLO DE HOJE';
    this.nodes.meta.textContent = `${card.arcana} · ${card.element} · direta`;
    this.nodes.message.textContent = DAILY_MESSAGES[card.suit] || DAILY_MESSAGES.Maiores;
    this.nodes.state.textContent = 'Guardada neste aparelho até o próximo ciclo de Brasília.';
    if (currentRoute === 'carta-do-dia') orbCue.textContent = 'Carta guardada';
  }
};

daily.nodes.card.addEventListener('click', () => {
  if (daily.revealed) showCardDialog(daily.card, 'CARTA DO DIA');
});

const CARD_IDS = CARDS.map(card => card.id);
const CURRENT_SPREAD_KEY = 'divina-bruxa-3.tiragem-atual.v1';

function rememberedSpreadId() {
  try {
    const value = localStorage.getItem(CURRENT_SPREAD_KEY);
    return SPREADS[value] ? value : 'conselho';
  } catch { return 'conselho'; }
}

function loadSpreadState(spreadId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(spreadStorageKey(spreadId)));
    const valid = validateSpreadState(parsed, CARD_IDS);
    return valid?.spreadId === spreadId ? valid : createSpreadState(spreadId, CARD_IDS);
  } catch { return createSpreadState(spreadId, CARD_IDS); }
}

const spreads = {
  state:loadSpreadState(rememberedSpreadId()),
  resetArmed:false,
  resetTimer:0,
  nodes: {
    picker:document.querySelector('#spreadPicker'),
    intention:document.querySelector('#spreadIntention'),
    eyebrow:document.querySelector('#spreadEyebrow'),
    name:document.querySelector('#spreadName'),
    revealed:document.querySelector('#spreadRevealed'),
    total:document.querySelector('#spreadTotal'),
    progress:document.querySelector('#spreadProgress'),
    board:document.querySelector('#spreadBoard'),
    guidance:document.querySelector('#spreadGuidance'),
    reset:document.querySelector('#resetSpread')
  },

  get definition() { return SPREADS[this.state.spreadId]; },

  save() {
    this.state.intention = this.nodes.intention.value.slice(0, 180);
    try {
      localStorage.setItem(spreadStorageKey(this.state.spreadId), JSON.stringify(this.state));
      localStorage.setItem(CURRENT_SPREAD_KEY, this.state.spreadId);
    } catch {}
  },

  select(spreadId) {
    if (!SPREADS[spreadId] || spreadId === this.state.spreadId) return;
    this.save();
    this.state = loadSpreadState(spreadId);
    this.nodes.intention.value = this.state.intention;
    this.disarmReset();
    this.render();
    announce(`${this.definition.name}. ${this.definition.positions.length} posições.`);
  },

  render() {
    const definition = this.definition;
    const total = definition.positions.length;
    this.nodes.eyebrow.textContent = definition.eyebrow;
    this.nodes.name.textContent = definition.name;
    this.nodes.revealed.textContent = String(this.state.revealed);
    this.nodes.total.textContent = String(total);
    this.nodes.progress.style.width = `${(this.state.revealed / total) * 100}%`;
    this.nodes.board.dataset.spread = definition.id;
    this.nodes.picker.querySelectorAll('[data-spread]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.spread === definition.id));
    });

    const fragment = document.createDocumentFragment();
    definition.positions.forEach((position, index) => {
      const slot = document.createElement('article');
      slot.className = 'spread-slot';
      slot.setAttribute('role', 'listitem');
      slot.dataset.position = String(index + 1);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'spread-card';
      const visible = index < this.state.revealed;
      if (visible) {
        const card = CARDS[this.state.order[index]];
        button.classList.add('has-card');
        button.setAttribute('aria-label', `${position}: ${card.name}. Ampliar carta.`);
        const image = new Image();
        image.src = `assets/cards/${card.image}`;
        image.alt = card.name;
        image.loading = index < 3 ? 'eager' : 'lazy';
        image.width = 256;
        image.height = 384;
        button.append(image);
        button.addEventListener('click', () => showCardDialog(card, `${index + 1} · ${position.toUpperCase()}`));
      } else {
        button.disabled = true;
        button.setAttribute('aria-label', `${position}: posição ainda oculta`);
      }
      const label = document.createElement('p');
      label.innerHTML = `<b>${index + 1}</b>${position}`;
      slot.append(button, label);
      fragment.append(slot);
    });
    this.nodes.board.replaceChildren(fragment);

    if (this.state.revealed >= total) {
      this.nodes.guidance.textContent = `${definition.name} completa. Observe relações, repetições e movimento antes de concluir.`;
      if (currentRoute === 'tiragens') orbCue.textContent = 'Tiragem completa';
    } else {
      this.nodes.guidance.textContent = `Próxima: ${definition.positions[this.state.revealed]}. Toque na Orbe.`;
      if (currentRoute === 'tiragens') orbCue.textContent = 'Revelar posição';
    }
  },

  reveal() {
    const result = revealSpreadPosition(this.state);
    if (result.cardId === null) {
      announce(`${this.definition.name} já está completa.`);
      return;
    }
    this.state = result.state;
    this.save();
    this.render();
    const card = CARDS[result.cardId];
    const position = this.definition.positions[result.positionIndex];
    announce(`${position}: ${card.name}. Sempre direta.`);
    const slot = this.nodes.board.querySelector(`[data-position="${result.positionIndex + 1}"]`);
    slot?.scrollIntoView?.({ behavior:REDUCED_MOTION ? 'auto' : 'smooth', block:'nearest', inline:'center' });
  },

  disarmReset() {
    clearTimeout(this.resetTimer);
    this.resetArmed = false;
    this.nodes.reset.textContent = 'Recomeçar tiragem';
  },

  reset() {
    if (!this.resetArmed && (this.state.revealed || this.nodes.intention.value.trim())) {
      this.resetArmed = true;
      this.nodes.reset.textContent = 'Confirmar recomeço';
      announce('Toque novamente para apagar esta tiragem e sua intenção local.');
      this.resetTimer = setTimeout(() => this.disarmReset(), 4500);
      return;
    }
    const spreadId = this.state.spreadId;
    this.disarmReset();
    this.state = createSpreadState(spreadId, CARD_IDS);
    this.nodes.intention.value = '';
    this.save();
    this.render();
    pulseOrb();
    announce(`${this.definition.name} recomeçada. Todas as posições aguardam.`);
  }
};

spreads.nodes.picker.querySelectorAll('[data-spread]').forEach(button => {
  button.addEventListener('click', () => spreads.select(button.dataset.spread));
});
spreads.nodes.intention.addEventListener('input', () => spreads.save());
spreads.nodes.reset.addEventListener('click', () => spreads.reset());

const school = createSchoolWorld({ cards:CARDS, showCard:showCardDialog, announce });
const library = createLibraryWorld({ cards:CARDS, showCard:showCardDialog });
const journal = createJournalWorld({ announce });
const whit = createWhitWorld({ announce });
const navigate = route => applyRoute(route);
const consultations = createConsultationsWorld({ announce });
const premium = createPremiumWorld({ navigate, announce });
const account = createAccountWorld({ announce });
const store = createStoreWorld({ announce });
const music = createMusicWorld({ announce });
const videos = createVideosWorld({ announce });
const skins = createSkinsWorld({ navigate, announce });

document.querySelector('#closeCardDialog').addEventListener('click', () => cardDialog.close());
cardDialog.addEventListener('click', event => {
  const box = cardDialog.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) cardDialog.close();
});

tarot.render();
daily.render();
spreads.nodes.intention.value = spreads.state.intention;
spreads.render();

livingUniverse = createLivingUniverseV524();
orbEngine = new RealityOrbEngine(document.querySelector('#orbCanvas'), {
  onTap: detail => handleOrb(detail),
  onDoubleTap: () => {
    closeMap({ restoreFocus:false });
    applyRoute('tarot');
  }
});
globalThis.divinaRealityOrb = orbEngine;

applyRoute(normalizedRoute(location.hash), { push:false, focus:false, animate:false });

if ('serviceWorker' in navigator) {
  addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=3.0.7-launch-macro0', { updateViaCache:'none' });
      await registration.update();
      if (registration.waiting) registration.waiting.postMessage({ type:'SKIP_WAITING' });
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) worker.postMessage({ type:'SKIP_WAITING' });
        });
      });
    } catch {}
  }, { once:true });
}
