/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · BALÕES MÁGICOS VIVOS V586
   Um único balão físico aparece apenas em momentos com sentido. Cada forma
   muda; a intenção continua coerente. Home, viagem, menu e silêncio mandam. */

import { normalizeRealityRouteV585, realityIntentionV585 } from './reality-intention-language-v585.js?v=585';

const VERSION = 586;
const INSTANCE = Symbol.for('divina.magical.bubble.system.v586');
const STYLE_ID = 'divinaMagicalBubbleSystemV586';
const STYLE_HREF = './magical-bubble-system-v586.css?v=586';
const FORMS = Object.freeze(['seed','veil','crescent','comet','portal']);

const profiles = [
  { route:'tarot', label:'Tarot Livre', intents:['Escolha com as mãos','O símbolo encontra você','A pergunta ganha corpo','Três cartas, um fio'] },
  { route:'daily', label:'Carta do Dia', intents:['Hoje cabe inteiro aqui','Receba antes de explicar','Uma carta, presença','O agora tem símbolo'] },
  { route:'spreads', label:'Tiragens', intents:['Dê forma à pergunta','Cada posição revela função','O desenho organiza sentidos','Abra espaço entre cartas'] },
  { route:'library', label:'Biblioteca', intents:['Um símbolo abre caminhos','Compare antes de concluir','Arquétipos conversam em camadas','Conhecer também é sentir'] },
  { route:'school', label:'Escola', intents:['Pratique até florescer','Aprenda no seu ritmo','Exercício transforma intuição','Sabedoria pede presença'] },
  { route:'journal', label:'Diário', intents:['Só você lê aqui','Escreva sem julgamento','Seu ritmo deixa pistas','Palavras guardam ciclos'] },
  { route:'ai', label:'Whit', intents:['Chame Whit quando quiser','Contexto nasce com permissão','Pergunte com intenção','Silêncio também responde'] },
  { route:'store', label:'Loja', intents:['Escolha sem pressa','A origem fica visível','Beleza com propósito','Desejo também merece clareza'] },
  { route:'consultations', label:'Consultas', intents:['Clareza antes da leitura','Limites também acolhem','Seu momento merece escuta','Pergunte sem promessas'] },
  { route:'subscriptions', label:'Premium', intents:['Entenda antes de expandir','Valor vem primeiro','Escolha no seu tempo','O essencial permanece livre'] },
  { route:'skins', label:'Skins', intents:['A alma não muda','Só a forma floresce','Vista outra atmosfera','Sua Orbe, outra pele'] },
  { route:'videos', label:'Vídeos', intents:['A presença ganha voz','Assista quando quiser','Histórias pedem espaço','A imagem guarda ritmo'] },
  { route:'music', label:'Música', intents:['Deixe o som chegar','Nenhuma reprodução automática','A Orbe sente pulsos','Escute entre estrelas'] },
  { route:'notifications', label:'Notificações', intents:['Só chega com permissão','Silêncio também é escolha','Você decide o ritmo','Avisos sem invasão'] },
  { route:'login', label:'Conta', intents:['Seu caminho fica guardado','Sua sessão permanece sua','Entre no seu tempo','Privacidade acompanha a jornada'] },
  { route:'admin', label:'Central', intents:['Cuidar também é observar','Controle sem ruído','Sinais antes de números','O universo pede equilíbrio'] }
].map(profile => Object.freeze({
  ...profile,
  intents:Object.freeze([...profile.intents])
}));

export const MAGICAL_BUBBLE_PROFILES_V586 = Object.freeze(profiles);
export const MAGICAL_BUBBLE_CONTRACT_V586 = Object.freeze({
  version:VERSION,
  base:'V585',
  plan:'Divina Bruxa 2.0 — Fluidez Suprema',
  macroStage:'7-of-10',
  title:'Sistema de Balões Mágicos Vivos',
  screenModel:'coordinate-reveal',
  supportedRealities:16,
  homeBubbles:0,
  microIntentsPerReality:4,
  totalMicroIntents:64,
  maximumWords:4,
  simultaneousBubbles:1,
  samePhysicalBubble:true,
  opensVerticalDepth:true,
  unpredictableForm:true,
  coherentMeaning:true,
  silenceAfterExhaustion:true,
  repeatWithinSession:false,
  travelPolicy:'remove-immediately',
  menuPolicy:'remove-immediately',
  automaticWhitSpeech:false,
  permanentAnimationLoops:0,
  mutationObservers:0,
  newCanvases:0,
  privateReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  iphoneFirst:true,
  iphoneDuo:'continuous-compact-to-expanded',
  reducedMotion:true,
  safeAreas:true,
  softwareKeyboardAware:true
});

const profileIndex = new Map(MAGICAL_BUBBLE_PROFILES_V586.map(profile => [profile.route, profile]));

export function magicalBubbleProfileV586(value) {
  return profileIndex.get(normalizeRealityRouteV585(value)) || null;
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

function routeNow() {
  return normalizeRealityRouteV585(
    document.body?.dataset?.screen ||
    document.querySelector('#app > .screen.active')?.id ||
    document.documentElement.dataset.v585Route ||
    location.hash ||
    'home'
  );
}

function reducedMotion() {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function clock() {
  return globalThis.performance?.now?.() || Date.now();
}

function randomUnit() {
  const values = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return ((Date.now() * 2654435761) >>> 0) / 4294967296;
}

function randomBetween(minimum, maximum) {
  return Math.round(minimum + (maximum - minimum) * randomUnit());
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function createMagicalBubbleSystemV586({ language = null, universe = null } = {}) {
  if (globalThis[INSTANCE]?.destroy) return globalThis[INSTANCE];

  const root = document.documentElement;
  const controller = new AbortController();
  const { signal } = controller;
  const used = new Map(MAGICAL_BUBBLE_PROFILES_V586.map(profile => [profile.route, new Set()]));
  const text = document.createElement('span');
  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'db586-magic-bubble';
  bubble.dataset.v586MagicBubble = 'true';
  bubble.dataset.v586Voice = 'universe';
  bubble.hidden = true;
  bubble.setAttribute('aria-hidden', 'true');
  bubble.setAttribute('aria-live', 'off');
  bubble.append(text);

  let activeRoute = routeNow();
  let visibleRoute = '';
  let visibleIntent = '';
  let visibleSource = '';
  let lastForm = '';
  let lastShownAt = -Infinity;
  let lastArrivalRoute = '';
  let lastArrivalAt = -Infinity;
  let suppressDepthUntil = -Infinity;
  let revealTimer = 0;
  let lifeTimer = 0;
  let concealTimer = 0;
  let destroyed = false;
  let positionFlavor = Object.freeze({ x:0, y:0 });

  const clearTimer = name => {
    const timer = name === 'reveal' ? revealTimer : name === 'life' ? lifeTimer : concealTimer;
    if (timer) clearTimeout(timer);
    if (name === 'reveal') revealTimer = 0;
    else if (name === 'life') lifeTimer = 0;
    else concealTimer = 0;
  };

  const clearTimers = () => {
    clearTimer('reveal');
    clearTimer('life');
    clearTimer('conceal');
  };

  const setState = value => {
    root.dataset.v586BubbleState = value;
  };

  const detach = (state = 'silent') => {
    bubble.hidden = true;
    bubble.disabled = false;
    bubble.setAttribute('aria-hidden', 'true');
    bubble.classList.remove('is-visible','is-opening','is-prepared');
    bubble.remove();
    visibleRoute = '';
    visibleIntent = '';
    visibleSource = '';
    delete root.dataset.v586BubbleRoute;
    delete root.dataset.v586BubbleForm;
    delete root.dataset.v586BubbleSource;
    delete root.dataset.v586PendingSource;
    setState(state);
  };

  const hide = ({ immediate = false, reason = 'silence' } = {}) => {
    clearTimers();
    if (!bubble.isConnected) {
      delete root.dataset.v586PendingSource;
      setState(reason === 'travel' || reason === 'menu' ? 'paused' : 'silent');
      return false;
    }
    bubble.classList.remove('is-visible','is-opening');
    bubble.disabled = true;
    bubble.setAttribute('aria-hidden', 'true');
    const finalState = reason === 'travel' || reason === 'menu' ? 'paused' : 'silent';
    if (immediate || reducedMotion()) {
      detach(finalState);
      return true;
    }
    setState('leaving');
    concealTimer = setTimeout(() => detach(finalState), 360);
    return true;
  };

  const canShow = route => {
    if (destroyed || route === 'home' || !profileIndex.has(route)) return false;
    if (document.visibilityState === 'hidden') return false;
    if (root.dataset.v585Motion === 'travel' || root.dataset.orbNavigationState === 'active') return false;
    if ((root.dataset.v585Menu || 'closed') !== 'closed') return false;
    if (root.dataset.v585Keyboard === 'open') return false;
    return routeNow() === route;
  };

  const pickIntent = route => {
    const profile = profileIndex.get(route);
    const routeUsed = used.get(route);
    if (!profile || !routeUsed || routeUsed.size >= profile.intents.length) return null;
    const candidates = profile.intents
      .map((intent, index) => ({ intent, index }))
      .filter(item => !routeUsed.has(item.index));
    const picked = candidates[Math.floor(randomUnit() * candidates.length)] || candidates[0];
    if (!picked) return null;
    routeUsed.add(picked.index);
    return picked.intent;
  };

  const pickForm = () => {
    const candidates = FORMS.filter(form => form !== lastForm);
    const form = candidates[Math.floor(randomUnit() * candidates.length)] || candidates[0] || FORMS[0];
    lastForm = form;
    return form;
  };

  const position = () => {
    if (!bubble.isConnected || bubble.hidden) return false;
    const viewport = globalThis.visualViewport;
    const width = Math.max(280, Math.round(viewport?.width || document.documentElement.clientWidth || innerWidth));
    const height = Math.max(320, Math.round(viewport?.height || document.documentElement.clientHeight || innerHeight));
    const offsetLeft = Math.round(viewport?.offsetLeft || 0);
    const offsetTop = Math.round(viewport?.offsetTop || 0);
    const compact = width <= 430;
    const bubbleWidth = Math.min(compact ? width * .74 : width * .3, compact ? 244 : 286);
    const halfWidth = Math.max(88, bubbleWidth / 2);
    const threshold = document.querySelector(`.db585-intent-threshold[data-v585-route="${activeRoute}"]`);
    const depthTarget = document.querySelector(`#${activeRoute} [data-v585-depth-start="true"]`);
    const orb = document.getElementById('orb');
    const anchor = visibleSource === 'depth' ? depthTarget : orb?.getBoundingClientRect?.().width ? orb : threshold;
    const rect = anchor?.getBoundingClientRect?.() || { left:width / 2 - 1, right:width / 2 + 1, top:height * .38, bottom:height * .62, width:2, height:height * .24 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let x;
    let y;
    if (visibleSource === 'depth') {
      x = width / 2 + positionFlavor.x;
      y = clamp(rect.top + 76 + positionFlavor.y, 118, height - 136);
    } else if (compact) {
      x = centerX + positionFlavor.x;
      y = rect.bottom + 62 + positionFlavor.y;
      if (y > height - 138) y = rect.top - 64 + positionFlavor.y;
    } else {
      const placeRight = centerX <= width * .54;
      x = placeRight ? rect.right + halfWidth * .72 : rect.left - halfWidth * .72;
      y = centerY + positionFlavor.y;
    }
    x = clamp(x, halfWidth + 18, width - halfWidth - 18);
    y = clamp(y, 104, height - 118);
    bubble.style.setProperty('--db586-x', `${Math.round(offsetLeft + x)}px`);
    bubble.style.setProperty('--db586-y', `${Math.round(offsetTop + y)}px`);
    return true;
  };

  const show = ({ route = activeRoute, source = 'arrival' } = {}) => {
    const normalized = normalizeRealityRouteV585(route);
    revealTimer = 0;
    delete root.dataset.v586PendingSource;
    if (!canShow(normalized)) {
      setState('silent');
      return false;
    }
    if (clock() - lastShownAt < 3600) {
      setState('silent');
      return false;
    }
    const intent = pickIntent(normalized);
    if (!intent) {
      setState('silent');
      document.dispatchEvent(new CustomEvent('divina:magic-bubble-silence', {
        detail:{ version:VERSION, route:normalized, reason:'intentions-lived' }
      }));
      return false;
    }
    clearTimers();
    const profile = profileIndex.get(normalized);
    const form = pickForm();
    activeRoute = normalized;
    visibleRoute = normalized;
    visibleIntent = intent;
    visibleSource = source;
    positionFlavor = Object.freeze({ x:randomBetween(-14,14), y:randomBetween(-10,10) });
    text.textContent = intent;
    bubble.dataset.v586Route = normalized;
    bubble.dataset.v586Form = form;
    bubble.dataset.v586Source = source;
    bubble.setAttribute('aria-label', `${intent}. Mergulhar em ${profile.label}.`);
    bubble.hidden = false;
    bubble.disabled = false;
    bubble.setAttribute('aria-hidden', 'false');
    bubble.classList.remove('is-opening','is-visible');
    bubble.classList.add('is-prepared');
    document.body.append(bubble);
    root.dataset.v586BubbleRoute = normalized;
    root.dataset.v586BubbleForm = form;
    root.dataset.v586BubbleSource = source;
    setState('arriving');
    position();
    void bubble.offsetWidth;
    bubble.classList.add('is-visible');
    setState('visible');
    lastShownAt = clock();
    document.dispatchEvent(new CustomEvent('divina:magic-bubble-visible', {
      detail:{ version:VERSION, route:normalized, intent, form, source, voice:'universe' }
    }));
    lifeTimer = setTimeout(() => hide({ reason:'natural-silence' }), randomBetween(4700,6100));
    return true;
  };

  const schedule = ({ route = activeRoute, source = 'arrival', delay = 900 } = {}) => {
    const normalized = normalizeRealityRouteV585(route);
    clearTimer('reveal');
    if (!canShow(normalized)) return false;
    if (bubble.isConnected) hide({ immediate:true, reason:'new-intention' });
    setState('waiting');
    root.dataset.v586PendingSource = source;
    revealTimer = setTimeout(() => show({ route:normalized, source }), Math.max(320, delay));
    return true;
  };

  const onRouteStart = event => {
    activeRoute = normalizeRealityRouteV585(event.detail?.id || event.detail?.to || activeRoute);
    hide({ immediate:true, reason:'travel' });
  };

  const onRouteSignal = event => {
    activeRoute = normalizeRealityRouteV585(event.detail?.route || event.detail?.id || event.detail?.to || routeNow());
    root.dataset.v586Route = activeRoute;
    if (activeRoute === 'home') hide({ immediate:true, reason:'home' });
  };

  const onJourneyState = event => {
    const state = String(event.detail?.state || '').toLowerCase();
    if (['depart','flight','crossing','arrival','settle'].includes(state)) hide({ immediate:true, reason:'travel' });
  };

  const onJourneyFinished = event => {
    const route = normalizeRealityRouteV585(event.detail?.route || event.detail?.id || routeNow());
    activeRoute = route;
    root.dataset.v586Route = route;
    const moment = clock();
    if (route === lastArrivalRoute && moment - lastArrivalAt < 2600) return;
    lastArrivalRoute = route;
    lastArrivalAt = moment;
    schedule({ route, source:'arrival', delay:randomBetween(820,1280) });
  };

  const onMenuState = event => {
    const state = String(event.detail?.state || 'closed').toLowerCase();
    if (state !== 'closed') hide({ immediate:true, reason:'menu' });
  };

  const onDepth = event => {
    if (clock() < suppressDepthUntil) return;
    const route = normalizeRealityRouteV585(event.detail?.route || routeNow());
    activeRoute = route;
    schedule({ route, source:'depth', delay:randomBetween(620,860) });
  };

  const onBubbleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!visibleRoute || bubble.disabled) return;
    const route = visibleRoute;
    const intent = visibleIntent;
    suppressDepthUntil = clock() + 1800;
    bubble.disabled = true;
    bubble.classList.add('is-opening');
    document.dispatchEvent(new CustomEvent('divina:magic-bubble-open', {
      detail:{ version:VERSION, route, intent, axis:'vertical', source:'explicit-bubble-gesture' }
    }));
    const depthButton = document.querySelector(`[data-v585-depth="${route}"]`);
    language?.enterDepth?.(depthButton);
    setTimeout(() => hide({ reason:'portal-opened' }), 120);
  };

  const onViewportChange = () => {
    if (root.dataset.v585Keyboard === 'open') {
      hide({ immediate:true, reason:'keyboard' });
      return;
    }
    position();
  };

  const listen = (target, type, handler, options = {}) =>
    target?.addEventListener?.(type, handler, { ...options, signal });

  listen(bubble, 'click', onBubbleClick);
  ['divina:route-start','divina:supreme-orb-will-navigate']
    .forEach(type => listen(document, type, onRouteStart));
  ['divina:route-ready','divina:page-ready','divina:reality-language-route']
    .forEach(type => listen(document, type, onRouteSignal));
  ['divina:orb-persistent-finished','divina:supreme-orb-did-navigate','divina:orb-physical-claim-settled']
    .forEach(type => listen(document, type, onJourneyFinished));
  listen(document, 'divina:orb-ios-journey-state', onJourneyState);
  listen(document, 'divina:menu-state', onMenuState);
  listen(document, 'divina:reality-depth', onDepth);
  listen(globalThis, 'scroll', () => {
    if (bubble.isConnected || root.dataset.v586PendingSource !== 'depth') {
      hide({ immediate:true, reason:'manual-depth' });
    }
  }, { passive:true });
  listen(globalThis, 'resize', onViewportChange, { passive:true });
  listen(globalThis, 'orientationchange', onViewportChange, { passive:true });
  listen(globalThis, 'pagehide', () => hide({ immediate:true, reason:'page-hidden' }));
  listen(globalThis, 'pageshow', () => {
    activeRoute = routeNow();
    root.dataset.v586Route = activeRoute;
    if (activeRoute !== 'home') schedule({ route:activeRoute, source:'return', delay:1100 });
  });
  listen(globalThis.visualViewport, 'resize', onViewportChange, { passive:true });
  listen(globalThis.visualViewport, 'scroll', onViewportChange, { passive:true });
  listen(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') hide({ immediate:true, reason:'page-hidden' });
  });

  const audit = () => {
    const allIntents = MAGICAL_BUBBLE_PROFILES_V586.flatMap(profile => profile.intents);
    const maximumWords = Math.max(...allIntents.map(intent => intent.trim().split(/\s+/).filter(Boolean).length));
    const domBubbles = document.querySelectorAll('[data-v586-magic-bubble="true"]').length;
    return Object.freeze({
      release:'V586',
      routeCount:MAGICAL_BUBBLE_PROFILES_V586.length,
      totalMicroIntents:allIntents.length,
      uniqueMicroIntents:new Set(allIntents).size,
      maximumWords,
      forms:FORMS.length,
      activeRoute,
      visibleRoute,
      visibleIntent,
      visibleSource,
      domBubbles,
      visibleBubbles:bubble.isConnected && !bubble.hidden ? 1 : 0,
      homeVisibleBubbles:activeRoute === 'home' && bubble.isConnected && !bubble.hidden ? 1 : 0,
      canonicalOrbCount:document.querySelectorAll('#orb').length,
      permanentAnimationLoops:0,
      mutationObservers:0,
      newCanvases:0,
      automaticWhitSpeech:false,
      privateReads:0,
      storageReads:0,
      storageWrites:0,
      apiCalls:0,
      universeStatus:universe?.status?.() || null
    });
  };

  const status = () => Object.freeze({
    ...MAGICAL_BUBBLE_CONTRACT_V586,
    route:activeRoute,
    reality:realityIntentionV585(activeRoute),
    state:root.dataset.v586BubbleState || 'silent',
    form:lastForm || null,
    used:Object.freeze(Object.fromEntries([...used].map(([route, values]) => [route, values.size]))),
    audit:audit()
  });

  const destroy = () => {
    if (destroyed) return false;
    destroyed = true;
    clearTimers();
    controller.abort();
    detach('silent');
    ['magicBubbles','v586Route','v586BubbleState','v586BubbleRoute','v586BubbleForm','v586BubbleSource','v586PendingSource','v586Whit']
      .forEach(key => delete root.dataset[key]);
    delete globalThis[INSTANCE];
    return true;
  };

  ensureStyle();
  root.dataset.magicBubbles = 'v586';
  root.dataset.v586Route = activeRoute;
  root.dataset.v586Whit = 'silent-until-invited';
  setState('silent');

  const api = Object.freeze({
    version:VERSION,
    contract:MAGICAL_BUBBLE_CONTRACT_V586,
    profiles:MAGICAL_BUBBLE_PROFILES_V586,
    profile:magicalBubbleProfileV586,
    show,
    schedule,
    hide,
    position,
    audit,
    status,
    destroy
  });
  globalThis[INSTANCE] = api;
  document.dispatchEvent(new CustomEvent('divina:magic-bubbles-ready', {
    detail:{ version:VERSION, routes:MAGICAL_BUBBLE_PROFILES_V586.length, physicalBubbles:1, visibleBubbles:0 }
  }));
  if (activeRoute !== 'home') schedule({ route:activeRoute, source:'boot', delay:1150 });
  return api;
}
