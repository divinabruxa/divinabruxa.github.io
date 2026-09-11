/* DIVINA BRUXA 2.0 — REBIRTH R008 · WHIT PRESENCE V307
   Presença local, sem API, atravessando todos os mundos.
   Não lê conteúdo privado. Não gera respostas. Não altera a Orbe aprovada. */

const STYLE_ID = 'whitPresenceV307Styles';
const ROOT_ID = 'whitPresenceV307';

const ROUTES = Object.freeze({
  home: Object.freeze({ tone:'home', phrase:'', silent:true }),
  tarot: Object.freeze({ tone:'tarot', phrase:'As cartas continuam livres. Eu só interpreto quando você me chamar.' }),
  daily: Object.freeze({ tone:'daily', phrase:'Uma carta para hoje. Posso aprofundá-la somente quando você escolher.' }),
  spreads: Object.freeze({ tone:'spreads', phrase:'A tiragem é sua. Eu só entro nela com o seu convite.' }),
  library: Object.freeze({ tone:'library', phrase:'Estou perto da carta aberta. O significado editorial continua sendo a base.' }),
  school: Object.freeze({ tone:'school', phrase:'A Escola está viva. Eu entro apenas na aula que você autorizar.' }),
  journal: Object.freeze({ tone:'journal', phrase:'Seu Diário continua fechado para mim até você escolher uma única entrada.' }),
  ai: Object.freeze({ tone:'ai', phrase:'Aqui a presença pode virar conversa — sempre com seu consentimento.' }),
  consultations: Object.freeze({ tone:'consultations', phrase:'Este espaço é humano e profissional. Eu não substituo a consulta.' }),
  store: Object.freeze({ tone:'store', phrase:'A Loja permanece separada da sua intimidade e das suas leituras.' }),
  music: Object.freeze({ tone:'music', phrase:'A música abre outra passagem do mesmo universo.' }),
  videos: Object.freeze({ tone:'videos', phrase:'A imagem também pode ser um portal.' }),
  skins: Object.freeze({ tone:'skins', phrase:'A forma muda. A presença continua a mesma.' }),
  subscriptions: Object.freeze({ tone:'subscriptions', phrase:'Planos e créditos não mudam sua privacidade.' }),
  login: Object.freeze({ tone:'account', phrase:'Sua Conta governa preferências, memória e consentimentos.' }),
  notifications: Object.freeze({ tone:'notifications', phrase:'Você decide quais sinais podem chegar até você.' }),
  admin: Object.freeze({ tone:'admin', phrase:'Operação técnica nunca recebe o conteúdo íntimo das suas conversas.' })
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
  constructor({ core = globalThis.whit, go = globalThis.orbe?.go } = {}) {
    this.core = core || null;
    this.go = typeof go === 'function' ? go : null;
    this.timer = 0;
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
  }

  enter(rawRoute, { initial = false } = {}) {
    if (this.destroyed) return;
    const route = safeRoute(rawRoute);
    this.route = route;
    const spec = ROUTES[route];

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

    const delay = initial ? 700 : 260;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.show(spec.phrase, { tone:spec.tone, duration:3600 }), delay);
  }

  show(message, { tone = 'awake', duration = 3600 } = {}) {
    if (this.destroyed || !this.root || !message) return;
    clearTimeout(this.timer);
    this.root.dataset.tone = tone;
    if (this.copy) this.copy.textContent = message;
    this.root.classList.add('is-visible');
    this.root.setAttribute('aria-hidden', 'false');
    this.visible = true;
    this.timer = setTimeout(() => this.hide(), duration);
  }

  hide(immediate = false) {
    if (!this.root) return;
    clearTimeout(this.timer);
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
      privateReads:false
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
  }
}

export const createWhitPresenceV307 = options => new WhitPresenceV307(options);
