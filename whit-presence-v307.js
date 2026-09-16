/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · WHIT PRESENCE V307/V580
   Presença local, sem API, atravessando todos os mundos.
   Não lê conteúdo privado. Não gera respostas. Não altera a Orbe aprovada.
   A V580 elimina reações duplicadas e submete toda fala ao governador global. */

const STYLE_ID = 'whitPresenceV307Styles';
const ROOT_ID = 'whitPresenceV307';
const MARK = Symbol.for('divina.whit.presence.v307');

const ROUTES = Object.freeze({
  home: Object.freeze({ tone:'home', phrases:Object.freeze([]), silent:true }),
  tarot: Object.freeze({ tone:'tarot', phrases:Object.freeze(['As cartas continuam livres. Eu só interpreto quando você me chamar.','Primeiro a imagem; qualquer interpretação depende da sua escolha.']) }),
  daily: Object.freeze({ tone:'daily', phrases:Object.freeze(['Uma carta para hoje. Posso aprofundá-la somente quando você escolher.','O encontro de hoje ilumina; não determina o seu caminho.']) }),
  spreads: Object.freeze({ tone:'spreads', phrases:Object.freeze(['A tiragem é sua. Eu só entro nela com o seu convite.','Observe as posições no seu ritmo; eu espero seu chamado.']) }),
  library: Object.freeze({ tone:'library', phrases:Object.freeze(['Estou perto da carta aberta. O significado editorial continua sendo a base.','Explore o símbolo primeiro; eu só amplio quando você pedir.']) }),
  school: Object.freeze({ tone:'school', phrases:Object.freeze(['A Escola está viva. Eu entro apenas na aula que você autorizar.','Aprenda uma passagem por vez; eu acompanho somente quando convidada.']) }),
  journal: Object.freeze({ tone:'journal', phrases:Object.freeze(['Seu Diário continua fechado para mim até você escolher uma única entrada.','Este espaço permanece privado; somente você abre uma passagem específica.']) }),
  ai: Object.freeze({ tone:'ai', phrases:Object.freeze(['Aqui a presença pode virar conversa — sempre com seu consentimento.','Quando você escrever, eu respondo dentro dos limites que estão visíveis.']) }),
  consultations: Object.freeze({ tone:'consultations', phrases:Object.freeze(['Este espaço é humano e profissional. Eu não substituo a consulta.','Aqui a tecnologia prepara o caminho para um atendimento humano.']) }),
  store: Object.freeze({ tone:'store', phrases:Object.freeze(['A Loja permanece separada da sua intimidade e das suas leituras.','A curadoria está aqui; sua escolha continua livre.']) }),
  music: Object.freeze({ tone:'music', phrases:Object.freeze(['A música abre outra passagem do mesmo universo.','Você decide quando o silêncio vira música.']) }),
  videos: Object.freeze({ tone:'videos', phrases:Object.freeze(['A imagem também pode ser um portal.','Assista quando quiser abrir outra forma de encontro.']) }),
  skins: Object.freeze({ tone:'skins', phrases:Object.freeze(['A forma muda. A presença continua a mesma.','Escolha uma nova pele sem perder a mesma Orbe.']) }),
  subscriptions: Object.freeze({ tone:'subscriptions', phrases:Object.freeze(['Planos e créditos não mudam sua privacidade.','Veja os benefícios com clareza antes de escolher.']) }),
  login: Object.freeze({ tone:'account', phrases:Object.freeze(['Sua Conta governa preferências, memória e consentimentos.','Entre somente quando quiser levar sua continuidade para outro dispositivo.']) }),
  notifications: Object.freeze({ tone:'notifications', phrases:Object.freeze(['Você decide quais sinais podem chegar até você.','O silêncio também é uma escolha respeitada.']) }),
  admin: Object.freeze({ tone:'admin', phrases:Object.freeze(['Operação técnica nunca recebe o conteúdo íntimo das suas conversas.','A Central permanece separada do conteúdo privado.']) })
});

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-presence-v307.css?v=307';
  document.head.append(link);
}

function currentRoute() {
  return document.body?.dataset?.screen
    || document.querySelector('#app > .screen.active[id]')?.id
    || location.hash.replace(/^#/, '')
    || 'home';
}

function safeRoute(value) {
  const id = String(value || 'home').trim();
  return ROUTES[id] ? id : 'home';
}

export class WhitPresenceV307 {
  constructor({ core = globalThis.whit, go = globalThis.orbe?.go, messageGovernor = null } = {}) {
    this.core = core || null;
    this.go = typeof go === 'function' ? go : null;
    this.messageGovernor = messageGovernor || globalThis.divinaMessageGovernorV580 || null;
    this.timer = 0;
    this.messageToken = null;
    this.lastEnterRoute = null;
    this.lastEnterAt = 0;
    this.route = safeRoute(currentRoute());
    this.visible = false;
    this.destroyed = false;
    this.abort = new AbortController();
    installStyle();
    this.mount();
    this.bind();
    this.enter(this.route, { initial:true });
  }

  mount() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement('aside');
      root.id = ROOT_ID;
      root.className = 'whit-presence-v307';
      root.setAttribute('aria-live', 'polite');
      root.setAttribute('aria-atomic', 'true');
      root.setAttribute('aria-hidden', 'true');
      root.innerHTML = `
        <span class="whit-presence-v307__aura" aria-hidden="true"></span>
        <span class="whit-presence-v307__sigil" aria-hidden="true"><i></i></span>
        <p class="whit-presence-v307__copy"><b>WHIT</b><span data-whit-presence-copy></span></p>`;
      document.body.append(root);
    }
    this.root = root;
    this.copy = root.querySelector('[data-whit-presence-copy]');
  }

  bind() {
    const signal = this.abort.signal;
    document.addEventListener('divina:page-ready', event => {
      this.enter(event.detail?.id || currentRoute());
    }, { signal });

    document.addEventListener('divina:route-ready', event => {
      this.enter(event.detail?.id || currentRoute());
    }, { signal });

    addEventListener('hashchange', () => this.enter(currentRoute()), { signal });
    addEventListener('popstate', () => this.enter(currentRoute()), { signal });

    addEventListener('whit:consent-required', () => {
      this.show('Eu só atravesso este limite quando você autoriza.', { tone:'consent', duration:4200 });
    }, { signal });

    addEventListener('whit:consent-changed', event => {
      if (event.detail?.action === 'granted') {
        this.show('Permissão recebida para este único contexto.', { tone:'consent', duration:3200 });
      }
      if (event.detail?.action === 'revoked') {
        this.show('Permissão encerrada. O limite voltou a fechar.', { tone:'consent', duration:3200 });
      }
    }, { signal });

    document.addEventListener('visibilitychange', () => {
      document.documentElement.dataset.whitPresenceState =
        document.visibilityState === 'hidden' ? 'resting' : 'awake';
    }, { signal });

    document.addEventListener('divina:experience-message-accepted', event => {
      if (event.detail?.channel === 'whit-presence') return;
      if (this.visible) this.hide(true, 'another-message-accepted');
    }, { signal });
  }

  enter(rawRoute, { initial = false } = {}) {
    if (this.destroyed) return;
    const route = safeRoute(rawRoute);
    this.route = route;
    const spec = ROUTES[route];
    const now = performance.now?.() || Date.now();
    const duplicateEvent = !initial && route === this.lastEnterRoute && now - this.lastEnterAt < 1400;

    document.documentElement.dataset.whitPresence = 'v307';
    document.documentElement.dataset.whitPage = route;
    document.documentElement.dataset.whitTone = spec.tone;
    document.documentElement.dataset.whitPresenceState =
      document.visibilityState === 'hidden' ? 'resting' : 'awake';

    try {
      this.core?.rememberSession?.('presence:last-world', { route, at:new Date().toISOString() });
    } catch {}

    // A Home continua visualmente limpa: somente a Orbe ocupa o centro.
    if (spec.silent || route === 'home') {
      this.hide(true);
      return;
    }

    // Na Fundação V580, a chegada pertence à Orbe ancorada. A Whit conserva
    // respostas deliberadas, mas não agenda uma segunda fala automática.
    if (this.messageGovernor?.routeMessageOwner === 'orb-voice') {
      clearTimeout(this.timer);
      this.hide(true, 'orb-owns-route-arrival');
      return;
    }

    if (duplicateEvent) return;
    this.lastEnterRoute = route;
    this.lastEnterAt = now;

    const delay = initial ? 700 : 260;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.show('', {
      variants:spec.phrases,
      id:`whit-presence-route:${route}`,
      route,
      tone:spec.tone,
      category:'route-guidance',
      semanticKey:`route-arrival:${route}`,
      cooldownKey:`route-arrival:${route}`,
      cooldownMs:90000,
      priority:10,
      duration:3600
    }), delay);
  }

  show(message, {
    tone = 'awake',
    duration = 3600,
    variants = null,
    id = '',
    route = this.route,
    category = 'presence',
    semanticKey = '',
    cooldownKey = '',
    cooldownMs = 45000,
    priority = 30,
    explicit = false
  } = {}) {
    if (this.destroyed || !this.root || (!message && !variants?.length)) return false;
    clearTimeout(this.timer);
    const consent = tone === 'consent';
    const mustShow = explicit || consent;
    const normalizedRoute = safeRoute(route);
    const governedCategory = consent ? 'consent' : category;
    const governedSemantic = consent ? `consent:${normalizedRoute}` : semanticKey;
    const governedCooldown = consent ? `consent:${normalizedRoute}` : cooldownKey;
    const decision = this.messageGovernor?.request?.({
      id:id || `whit-presence:${tone}:${governedCategory}`,
      text:message,
      variants,
      route:normalizedRoute,
      channel:'whit-presence',
      category:governedCategory,
      semanticKey:governedSemantic,
      cooldownKey:governedCooldown,
      cooldownMs:mustShow ? 0 : cooldownMs,
      duration,
      priority:mustShow ? Math.max(90, priority) : priority,
      explicit:mustShow
    }) || { accepted:true, text:String(message || variants?.[0] || '') };
    if (!decision.accepted || !decision.text) return false;
    this.messageToken = decision.token || null;
    this.root.dataset.tone = tone;
    if (this.copy) this.copy.textContent = decision.text;
    this.root.classList.add('is-visible');
    this.root.setAttribute('aria-hidden', 'false');
    this.visible = true;
    this.timer = setTimeout(() => this.hide(false, 'auto-hide'), duration);
    return true;
  }

  hide(immediate = false, reason = 'closed') {
    if (!this.root) return;
    clearTimeout(this.timer);
    const token = this.messageToken;
    this.messageToken = null;
    if (token) this.messageGovernor?.release?.(token, reason);
    if (immediate) this.root.classList.add('no-transition');
    this.root.classList.remove('is-visible');
    this.root.setAttribute('aria-hidden', 'true');
    this.visible = false;
    if (immediate) requestAnimationFrame(() => this.root?.classList.remove('no-transition'));
  }

  status() {
    return Object.freeze({
      release:'V307',
      local:true,
      apiUsed:false,
      generation:false,
      route:this.route,
      visible:this.visible,
      privateReads:false,
      messageGovernorVersion:this.messageGovernor?.version || null,
      duplicateRouteEventsCoalesced:true
    });
  }

  destroy() {
    this.destroyed = true;
    clearTimeout(this.timer);
    this.abort.abort();
    this.root?.remove();
    delete document.documentElement.dataset.whitPresence;
    delete document.documentElement.dataset.whitPage;
    delete document.documentElement.dataset.whitTone;
    delete document.documentElement.dataset.whitPresenceState;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export const createWhitPresenceV307 = options => {
  const existing = globalThis[MARK];
  if (existing && !existing.destroyed) return existing;
  existing?.destroy?.();
  const presence = new WhitPresenceV307(options);
  globalThis[MARK] = presence;
  return presence;
};
