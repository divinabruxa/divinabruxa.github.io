/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · LINGUAGEM VIVA DAS REALIDADES V585
   Cada realidade nasce como uma intenção curta. A profundidade que já existe
   permanece intacta logo abaixo: horizontal é viagem, vertical é mergulho.
   A Home continua em silêncio e Tarot Livre/Carta do Dia ficam protegidos. */

const VERSION = 585;
const INSTANCE = Symbol.for('divina.reality.intention.language.v585');
const STYLE_ID = 'divinaRealityIntentionLanguageV585';
const STYLE_HREF = './reality-intention-language-v585.css?v=585';

const profiles = [
  { id:'home', label:'Início', intention:'Origem', truth:'Silêncio também é vida.', mode:'silent' },
  { id:'tarot', label:'Tarot Livre', intention:'Escolher', truth:'Sua mão conduz.', mode:'protected' },
  { id:'daily', label:'Carta do Dia', intention:'Receber', truth:'Hoje basta uma carta.', mode:'protected' },
  { id:'spreads', label:'Tiragens', intention:'Aprofundar', truth:'A pergunta encontra forma.', mode:'threshold' },
  { id:'library', label:'Biblioteca', intention:'Descobrir', truth:'Símbolos ganham sentido.', mode:'threshold' },
  { id:'school', label:'Escola', intention:'Aprender', truth:'Prática vira sabedoria.', mode:'threshold' },
  { id:'journal', label:'Diário', intention:'Escutar', truth:'Seu mundo fica seu.', mode:'threshold' },
  { id:'ai', label:'Whit', intention:'Conversar', truth:'Whit responde quando chamada.', mode:'threshold' },
  { id:'store', label:'Loja', intention:'Encontrar', truth:'Magia com origem clara.', mode:'threshold' },
  { id:'consultations', label:'Consultas', intention:'Acolher', truth:'Acolhimento, escopo e limites.', mode:'threshold' },
  { id:'subscriptions', label:'Premium', intention:'Expandir', truth:'Valor antes da escolha.', mode:'threshold' },
  { id:'skins', label:'Skins', intention:'Transformar', truth:'Nova forma. Mesma alma.', mode:'threshold' },
  { id:'videos', label:'Vídeos', intention:'Assistir', truth:'Presença em luz e voz.', mode:'threshold' },
  { id:'music', label:'Música', intention:'Vibrar', truth:'Som que abre espaço.', mode:'threshold' },
  { id:'notifications', label:'Notificações', intention:'Permitir', truth:'Você escolhe o que chega.', mode:'threshold' },
  { id:'login', label:'Conta', intention:'Guardar', truth:'Sua conta. Seu caminho.', mode:'threshold' },
  { id:'admin', label:'Central', intention:'Cuidar', truth:'Cuidado sobre todo o universo.', mode:'threshold' }
].map(profile => Object.freeze({ ...profile }));

export const REALITY_INTENTIONS_V585 = Object.freeze(profiles);
export const REALITY_INTENTION_LANGUAGE_CONTRACT_V585 = Object.freeze({
  version: VERSION,
  base: 'V584',
  plan: 'Divina Bruxa 2.0 — Fluidez Suprema',
  macroStage: '6-of-10',
  title: 'Linguagem Viva das Realidades',
  screenModel: 'coordinate-reveal',
  axes: Object.freeze({
    horizontal: 'travel-between-realities',
    vertical: 'immersion',
    depth: 'contextual-discovery'
  }),
  routeCount: 17,
  visibleThresholdRoutes: 16,
  physicalIntentionHosts: 14,
  protectedCompactRoutes: Object.freeze(['tarot', 'daily']),
  homeThresholds: 0,
  oneIntentionPerReality: true,
  maximumIntentionWords: 1,
  maximumTruthWords: 5,
  samePhysicalOrb: true,
  duplicateOrbs: 0,
  permanentAnimationLoops: 0,
  mutationObservers: 0,
  automaticWhitSpeech: false,
  privateReads: 0,
  storageReads: 0,
  storageWrites: 0,
  apiCalls: 0,
  iphoneFirst: true,
  iphoneDuo: 'continuous-compact-to-expanded',
  reducedMotion: true,
  safeAreas: true,
  softwareKeyboardAware: true
});

const index = new Map(REALITY_INTENTIONS_V585.map(profile => [profile.id, profile]));
const aliases = Object.freeze({
  inicio:'home', carta:'daily', 'carta-do-dia':'daily', biblioteca:'library', escola:'school',
  tiragens:'spreads', diario:'journal', whit:'ai', loja:'store', consultas:'consultations',
  conta:'login', premium:'subscriptions', assinatura:'subscriptions', pele:'skins',
  notificacoes:'notifications', musica:'music', video:'videos', videos:'videos', painel:'admin'
});

export function normalizeRealityRouteV585(value, fallback = 'home') {
  const raw = String(value || '').trim().toLowerCase().replace(/^#/, '').replace(/^\/+|\/+$/g, '');
  const clean = raw.split(/[?&/]/)[0] || fallback;
  const normalized = aliases[clean] || clean;
  return index.has(normalized) ? normalized : fallback;
}

export function realityIntentionV585(value) {
  return index.get(normalizeRealityRouteV585(value)) || index.get('home');
}

function routeNow() {
  return normalizeRealityRouteV585(
    document.body?.dataset?.screen ||
    document.querySelector('#app > .screen.active')?.id ||
    location.hash ||
    'home'
  );
}

function reducedMotion() {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function ensureStyle() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) return existing;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.append(link);
  return link;
}

function element(tag, className, text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function createThreshold(profile) {
  const threshold = element('header', 'db585-intent-threshold');
  threshold.dataset.v585Route = profile.id;
  threshold.dataset.v585Mode = profile.mode;
  threshold.setAttribute('aria-label', `${profile.label}. ${profile.intention}. ${profile.truth}`);
  if (profile.mode === 'protected') threshold.classList.add('db585-intent-threshold--protected');

  const atmosphere = element('span', 'db585-intent-threshold__atmosphere');
  atmosphere.setAttribute('aria-hidden', 'true');

  const coordinate = element('small', 'db585-intent-threshold__coordinate', profile.label);
  const stage = element('div', 'db585-intent-threshold__stage');
  const intention = element('strong', 'db585-intent-threshold__intention', profile.intention);
  intention.dataset.v585Intention = 'true';

  if (profile.mode === 'threshold') {
    const orbHost = element('div', 'db585-intent-threshold__orb-host');
    orbHost.dataset.v585OrbHost = 'true';
    orbHost.dataset.orbJourneyAnchor = 'v585-intention';
    orbHost.dataset.route = profile.id;
    stage.append(orbHost, intention);
  } else {
    stage.append(intention);
  }

  const truth = element('p', 'db585-intent-threshold__truth', profile.truth);
  truth.dataset.v585Truth = 'true';

  const depth = element('button', 'db585-intent-threshold__depth');
  depth.type = 'button';
  depth.dataset.v585Depth = profile.id;
  depth.setAttribute('aria-label', `Mergulhar em ${profile.label}`);
  const depthWord = element('span', '', 'Mergulhar');
  const depthArrow = element('i', '', '↓');
  depthArrow.setAttribute('aria-hidden', 'true');
  depth.append(depthWord, depthArrow);

  threshold.append(atmosphere, coordinate, stage, truth, depth);
  return threshold;
}

export function createRealityIntentionLanguageV585({ orbCore = null, universe = null } = {}) {
  if (globalThis[INSTANCE]?.destroy) return globalThis[INSTANCE];

  const root = document.documentElement;
  const controller = new AbortController();
  const { signal } = controller;
  const thresholds = new Map();
  const depthTargets = new Set();
  let activeRoute = routeNow();
  let destroyed = false;

  const markDepthStart = (screen, threshold) => {
    const target = [...screen.children].find(node =>
      node !== threshold && !node.classList?.contains('v560-world-mark')
    );
    if (!target) return null;
    target.dataset.v585DepthStart = 'true';
    depthTargets.add(target);
    return target;
  };

  const quietSecondaryPresence = screen => {
    screen.querySelectorAll('[data-orb-presence-v526="true"]').forEach(anchor => {
      if (anchor.closest('.db585-intent-threshold')) return;
      anchor.dataset.v585SecondaryPresence = 'true';
      const landing = anchor.closest('.db526-orb-landing');
      if (landing) landing.dataset.v585SecondaryLanding = 'true';
    });
  };

  const decorate = profile => {
    if (profile.mode === 'silent') return null;
    const screen = document.getElementById(profile.id);
    if (!screen?.classList?.contains('screen')) return null;
    let threshold = screen.querySelector(`:scope > .db585-intent-threshold[data-v585-route="${profile.id}"]`);
    if (!threshold) {
      threshold = createThreshold(profile);
      screen.prepend(threshold);
    }
    screen.dataset.v585Language = profile.mode;
    if (profile.mode === 'threshold') {
      screen.dataset.v585PrimaryOrb = 'intention';
      quietSecondaryPresence(screen);
    }
    markDepthStart(screen, threshold);
    thresholds.set(profile.id, threshold);
    return threshold;
  };

  const decorateAll = () => {
    REALITY_INTENTIONS_V585.forEach(decorate);
    return thresholds;
  };

  const syncViewport = () => {
    const viewport = globalThis.visualViewport;
    const width = Math.max(1, Math.round(viewport?.width || document.documentElement.clientWidth || innerWidth));
    const height = Math.max(1, Math.round(viewport?.height || document.documentElement.clientHeight || innerHeight));
    const layoutHeight = Math.max(1, Math.round(innerHeight || height));
    const keyboardOpen = height < layoutHeight * .72;
    root.style.setProperty('--db585-viewport-width', `${width}px`);
    root.style.setProperty('--db585-viewport-height', `${height}px`);
    root.dataset.v585Viewport = width <= 430 ? 'compact' : width <= 768 ? 'expanded' : 'wide';
    root.dataset.v585Posture = width > height ? 'horizontal' : 'vertical';
    root.dataset.v585Keyboard = keyboardOpen ? 'open' : 'closed';
  };

  const syncOrbLabel = route => {
    const profile = realityIntentionV585(route);
    if (profile.mode !== 'threshold') return false;
    const host = thresholds.get(profile.id)?.querySelector('[data-v585-orb-host]');
    const orb = document.getElementById('orb');
    if (!host?.contains(orb)) return false;
    orb.setAttribute('aria-label', `Orbe de ${profile.label}. Toque para despertar. Mantenha pressionado para abrir a Whit.`);
    return true;
  };

  const claimIntentionHost = (route, reason = 'route-ready') => {
    const profile = realityIntentionV585(route);
    if (profile.mode !== 'threshold') return false;
    const host = thresholds.get(profile.id)?.querySelector('[data-v585-orb-host]');
    if (!host?.isConnected || typeof orbCore?.claim !== 'function') return false;
    orbCore.claim(host, {
      mode:profile.id,
      ariaLabel:`Orbe de ${profile.label}. Toque para despertar. Mantenha pressionado para abrir a Whit.`,
      source:`reality-language-v585:${reason}`
    });
    return true;
  };

  const syncRoute = (value = routeNow(), reason = 'sync') => {
    activeRoute = normalizeRealityRouteV585(value);
    const profile = realityIntentionV585(activeRoute);
    root.dataset.v585Route = activeRoute;
    root.dataset.v585LanguageMode = profile.mode;
    root.dataset.v585Silence = activeRoute === 'home' ? 'true' : 'false';
    thresholds.forEach((threshold, route) => {
      const current = route === activeRoute;
      threshold.classList.toggle('is-current', current);
      threshold.dataset.v585State = current ? 'current' : 'dormant';
    });
    syncOrbLabel(activeRoute);
    document.dispatchEvent(new CustomEvent('divina:reality-language-route', {
      detail:{ version:VERSION, route:activeRoute, intention:profile.intention, reason }
    }));
    return profile;
  };

  const setMotion = state => {
    root.dataset.v585Motion = state === 'travel' ? 'travel' : 'rest';
  };

  const onRouteStart = event => {
    setMotion('travel');
    const route = normalizeRealityRouteV585(event.detail?.id || event.detail?.to || activeRoute);
    root.dataset.v585Destination = route;
  };

  const onRouteReady = event => {
    const route = normalizeRealityRouteV585(event.detail?.id || event.detail?.to || routeNow());
    claimIntentionHost(route, event.type);
    syncRoute(route, event.type);
    if (root.dataset.orbNavigationState !== 'active') setMotion('rest');
  };

  const onJourneyState = event => {
    const state = String(event.detail?.state || '');
    setMotion(['depart','flight','crossing','arrival','settle'].includes(state) ? 'travel' : 'rest');
  };

  const onJourneyFinished = event => {
    const route = normalizeRealityRouteV585(event.detail?.route || routeNow());
    delete root.dataset.v585Destination;
    setMotion('rest');
    syncRoute(route, event.type);
  };

  const onMenuState = event => {
    root.dataset.v585Menu = String(event.detail?.state || 'closed').toLowerCase();
  };

  const enterDepth = button => {
    const route = normalizeRealityRouteV585(button?.dataset?.v585Depth || activeRoute);
    const screen = document.getElementById(route);
    const target = screen?.querySelector('[data-v585-depth-start="true"]');
    if (!screen || !target) return false;
    screen.dataset.v585Depth = 'entered';
    target.scrollIntoView({ behavior:reducedMotion() ? 'auto' : 'smooth', block:'start' });
    document.dispatchEvent(new CustomEvent('divina:reality-depth', {
      detail:{ version:VERSION, route, axis:'vertical', source:'explicit-gesture' }
    }));
    return true;
  };

  const listen = (target, type, handler, options = {}) =>
    target?.addEventListener?.(type, handler, { ...options, signal });

  listen(document, 'click', event => {
    const button = event.target?.closest?.('[data-v585-depth]');
    if (!button) return;
    event.preventDefault();
    enterDepth(button);
  });
  ['divina:route-start','divina:supreme-orb-will-navigate']
    .forEach(type => listen(document, type, onRouteStart));
  ['divina:route-ready','divina:page-ready']
    .forEach(type => listen(document, type, onRouteReady));
  listen(document, 'divina:orb-ios-journey-state', onJourneyState);
  ['divina:orb-persistent-finished','divina:supreme-orb-did-navigate','divina:orb-physical-claim-settled']
    .forEach(type => listen(document, type, onJourneyFinished));
  listen(document, 'divina:menu-state', onMenuState);
  listen(globalThis, 'hashchange', () => syncRoute(location.hash, 'hashchange'));
  listen(globalThis, 'pageshow', () => {
    syncViewport();
    const route = routeNow();
    claimIntentionHost(route, 'pageshow');
    syncRoute(route, 'pageshow');
  });
  listen(globalThis, 'resize', syncViewport, { passive:true });
  listen(globalThis, 'orientationchange', syncViewport, { passive:true });
  listen(globalThis.visualViewport, 'resize', syncViewport, { passive:true });

  const audit = () => {
    const intentions = REALITY_INTENTIONS_V585.map(profile => profile.intention);
    const truthWordCounts = REALITY_INTENTIONS_V585.map(profile =>
      profile.truth.replace(/[.,]/g, '').trim().split(/\s+/).filter(Boolean).length
    );
    const activeHost = thresholds.get(activeRoute)?.querySelector('[data-v585-orb-host]') || null;
    const orb = document.getElementById('orb');
    return Object.freeze({
      release:'V585',
      routeCount:REALITY_INTENTIONS_V585.length,
      thresholds:thresholds.size,
      physicalIntentionHosts:document.querySelectorAll('[data-v585-orb-host]').length,
      protectedCompactRoutes:REALITY_INTENTIONS_V585.filter(profile => profile.mode === 'protected').length,
      homeThresholds:document.querySelectorAll('#home .db585-intent-threshold').length,
      uniqueIntentions:new Set(intentions).size,
      maximumIntentionWords:Math.max(...intentions.map(value => value.trim().split(/\s+/).length)),
      maximumTruthWords:Math.max(...truthWordCounts),
      activeRoute,
      activeMode:realityIntentionV585(activeRoute).mode,
      activeOrbAtIntention:Boolean(activeHost?.contains(orb)),
      canonicalOrbCount:document.querySelectorAll('#orb').length,
      duplicateOrbs:Math.max(0, document.querySelectorAll('#orb').length - 1),
      universeStatus:universe?.status?.() || null,
      permanentAnimationLoops:0,
      mutationObservers:0,
      automaticWhitSpeech:false,
      privateReads:0,
      storageReads:0,
      storageWrites:0,
      apiCalls:0
    });
  };

  const status = () => Object.freeze({
    ...REALITY_INTENTION_LANGUAGE_CONTRACT_V585,
    route:activeRoute,
    profile:realityIntentionV585(activeRoute),
    motion:root.dataset.v585Motion || 'rest',
    viewport:Object.freeze({
      width:Number.parseInt(root.style.getPropertyValue('--db585-viewport-width'), 10) || 0,
      height:Number.parseInt(root.style.getPropertyValue('--db585-viewport-height'), 10) || 0,
      mode:root.dataset.v585Viewport || 'unknown',
      posture:root.dataset.v585Posture || 'unknown',
      keyboard:root.dataset.v585Keyboard || 'closed'
    }),
    audit:audit()
  });

  const destroy = () => {
    if (destroyed) return false;
    destroyed = true;
    controller.abort();
    if ([...thresholds.values()].some(threshold => threshold.contains(document.getElementById('orb')))) {
      orbCore?.returnHome?.();
    }
    thresholds.forEach(threshold => threshold.remove());
    depthTargets.forEach(target => delete target.dataset.v585DepthStart);
    document.querySelectorAll('[data-v585-secondary-presence]').forEach(node => delete node.dataset.v585SecondaryPresence);
    document.querySelectorAll('[data-v585-secondary-landing]').forEach(node => delete node.dataset.v585SecondaryLanding);
    document.querySelectorAll('[data-v585-language]').forEach(screen => {
      delete screen.dataset.v585Language;
      delete screen.dataset.v585PrimaryOrb;
      delete screen.dataset.v585Depth;
    });
    ['realityLanguage','v585Route','v585LanguageMode','v585Silence','v585Motion','v585Destination','v585Menu','v585Viewport','v585Posture','v585Keyboard']
      .forEach(key => delete root.dataset[key]);
    root.style.removeProperty('--db585-viewport-width');
    root.style.removeProperty('--db585-viewport-height');
    delete globalThis[INSTANCE];
    return true;
  };

  ensureStyle();
  decorateAll();
  root.dataset.realityLanguage = 'v585';
  root.dataset.v585Motion = 'rest';
  root.dataset.v585Menu = 'closed';
  syncViewport();
  if (activeRoute !== 'home') claimIntentionHost(activeRoute, 'boot');
  syncRoute(activeRoute, 'boot');

  const api = Object.freeze({
    version:VERSION,
    contract:REALITY_INTENTION_LANGUAGE_CONTRACT_V585,
    profiles:REALITY_INTENTIONS_V585,
    profile:realityIntentionV585,
    sync:syncRoute,
    enterDepth,
    audit,
    status,
    destroy
  });
  globalThis[INSTANCE] = api;
  document.dispatchEvent(new CustomEvent('divina:reality-language-ready', {
    detail:{ version:VERSION, routes:REALITY_INTENTIONS_V585.length, thresholds:thresholds.size }
  }));
  return api;
}
