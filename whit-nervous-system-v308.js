/* DIVINA BRUXA 2.0 — REBIRTH R009 · WHIT NERVOUS SYSTEM V308
   Uma Whit, um barramento de eventos, zero leitura silenciosa de conteúdo privado.
   Este módulo observa ações e eventos estruturais; não lê textarea, input, Diário,
   perguntas de tiragem, notas da Escola ou mensagens da Orbe IA. */

const STYLE_ID = 'whitNervousSystemV308Styles';
const RELEASE = 'V308';

const SAFE_ROUTES = new Set([
  'home','tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','music','videos','skins','subscriptions','login','notifications','admin'
]);

const SIGNAL_COPY = Object.freeze({
  'library-card-open': 'Uma carta chamou sua atenção. Eu fico perto, sem transformar símbolo em certeza.',
  'library-whit-invite': 'Esta carta pode atravessar comigo somente pelo caminho que você escolheu.',
  'spread-reveal': 'Mais uma posição se abriu. Eu acompanho o movimento, não decido a leitura.',
  'spread-whit-invite': 'A tiragem pode vir comigo quando você autorizar exatamente este contexto.',
  'school-complete': 'Mais uma passagem da Escola foi integrada.',
  'school-whit-invite': 'Eu posso entrar nesta aula específica quando você confirmar.',
  'daily-save': 'O encontro de hoje foi guardado no seu espaço privado.',
  'journal-whit-invite': 'Seu Diário continua fechado. Só a entrada escolhida pode atravessar.',
  'account-state': 'Sua identidade e suas permissões continuam sob seu controle.',
  'skin-change': 'A forma da Orbe mudou. A mesma presença continua aqui.',
  'notification-choice': 'Você continua escolhendo quais sinais podem chegar até você.',
  'world-ready': 'Este mundo está pronto.'
});

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-nervous-system-v308.css?v=308';
  document.head.append(link);
}

function routeNow() {
  const id = document.body?.dataset?.screen
    || document.querySelector('#app > .screen.active[id]')?.id
    || location.hash.replace(/^#/, '')
    || 'home';
  return SAFE_ROUTES.has(id) ? id : 'home';
}

function cleanPhrase(value, limit = 220) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

function eventDetail(kind, route, extra = {}) {
  return Object.freeze({
    release: RELEASE,
    kind,
    route,
    local: true,
    apiUsed: false,
    privateContentRead: false,
    ...extra,
    at: new Date().toISOString()
  });
}

export class WhitNervousSystemV308 {
  constructor({ core = globalThis.whit, presence = globalThis.divinaWhitV307?.presence } = {}) {
    this.core = core || null;
    this.presence = presence || null;
    this.abort = new AbortController();
    this.counts = new Map();
    this.lastSignal = null;
    this.lastShownAt = 0;
    this.destroyed = false;
    installStyle();
    document.documentElement.dataset.whitNerves = 'v308';
    this.bind();
    this.signal('world-ready', { visible:false, source:'bootstrap' });
  }

  bind() {
    const signal = this.abort.signal;

    // Conecta os sussurros já produzidos pelos mundos à única presença global.
    addEventListener('whit:whisper', event => {
      const phrase = cleanPhrase(event.detail?.phrase);
      if (!phrase) return;
      this.signal('whisper', {
        phrase,
        visible:true,
        source:'existing-world-whisper',
        tone:'whisper',
        duration:4200
      });
    }, { signal });

    addEventListener('whit:consent-required', () => {
      this.signal('consent-required', {
        phrase:'O limite está fechado. Eu só atravesso quando você autoriza.',
        visible:true,
        tone:'consent',
        duration:4200
      });
    }, { signal });

    addEventListener('whit:consent-changed', event => {
      const granted = event.detail?.action === 'granted';
      this.signal('consent-changed', {
        phrase:granted
          ? 'Permissão recebida para este único contexto.'
          : 'Permissão encerrada. O limite voltou a fechar.',
        visible:true,
        tone:'consent',
        duration:3400
      });
    }, { signal });

    addEventListener('divina:school-world-ready', () => {
      this.signal('world-ready', { visible:false, source:'school' });
    }, { signal });

    addEventListener('divina:page-ready', event => {
      this.signal('world-ready', { visible:false, source:event.detail?.id || routeNow() });
    }, { signal });

    addEventListener('divina:auth-state', () => {
      this.signal('account-state', { visible:false, source:'auth' });
    }, { signal });

    // Um único listener delegado: observa intenções estruturais, nunca valores digitados.
    document.addEventListener('click', event => this.onClick(event), {
      capture:true,
      passive:true,
      signal
    });
  }

  onClick(event) {
    const target = event.target?.closest?.(
      '[data-card-id],[data-reader-whit],[data-reveal-card],[data-open-whit],' +
      '[data-complete],[data-school-ai],[data-school-ai-confirm],[data-daily-save],' +
      '[data-journal-ai],[data-journal-ai-confirm],[data-skin],[data-skin-id],' +
      '[data-notification-category],[data-notification-toggle]'
    );
    if (!target) return;

    let kind = '';
    if (target.matches('[data-reader-whit]')) kind = 'library-whit-invite';
    else if (target.matches('[data-card-id]')) kind = 'library-card-open';
    else if (target.matches('[data-reveal-card]')) kind = 'spread-reveal';
    else if (target.matches('[data-open-whit]')) kind = 'spread-whit-invite';
    else if (target.matches('[data-complete]')) kind = 'school-complete';
    else if (target.matches('[data-school-ai],[data-school-ai-confirm]')) kind = 'school-whit-invite';
    else if (target.matches('[data-daily-save]')) kind = 'daily-save';
    else if (target.matches('[data-journal-ai],[data-journal-ai-confirm]')) kind = 'journal-whit-invite';
    else if (target.matches('[data-skin],[data-skin-id]')) kind = 'skin-change';
    else if (target.matches('[data-notification-category],[data-notification-toggle]')) kind = 'notification-choice';
    if (!kind) return;

    const explicitWhit = /whit-invite$/.test(kind);
    this.signal(kind, {
      visible: explicitWhit || ['school-complete','spread-reveal','skin-change'].includes(kind),
      tone: routeNow(),
      duration: explicitWhit ? 4200 : 2600,
      source:'interaction'
    });
  }

  signal(kind, options = {}) {
    if (this.destroyed) return null;
    const route = routeNow();
    const previous = this.counts.get(kind) || 0;
    this.counts.set(kind, previous + 1);

    const detail = eventDetail(kind, route, {
      source:cleanPhrase(options.source || 'local-event', 80)
    });
    this.lastSignal = detail;

    try {
      this.core?.rememberSession?.('nerves:last-signal', {
        kind, route, at:detail.at
      });
    } catch {}

    dispatchEvent(new CustomEvent('whit:nerve', { detail }));

    const phrase = cleanPhrase(options.phrase || SIGNAL_COPY[kind] || '');
    if (options.visible && phrase && route !== 'home') {
      const now = performance.now?.() || Date.now();
      const explicit = /whit-invite$|consent|whisper/.test(kind);
      if (explicit || now - this.lastShownAt > 1050) {
        this.lastShownAt = now;
        this.pulse(kind);
        this.presence?.show?.(phrase, {
          tone:cleanPhrase(options.tone || route, 40),
          duration:Number(options.duration) || 3200
        });
      }
    }
    return detail;
  }

  pulse(kind) {
    const root = document.getElementById('whitPresenceV307');
    if (!root) return;
    root.dataset.nerve = kind;
    root.classList.remove('whit-nerve-v308');
    requestAnimationFrame(() => {
      root.classList.add('whit-nerve-v308');
      setTimeout(() => root.classList.remove('whit-nerve-v308'), 760);
    });
  }

  status() {
    return Object.freeze({
      release: RELEASE,
      local:true,
      apiUsed:false,
      generation:false,
      privateContentRead:false,
      route:routeNow(),
      signalKinds:this.counts.size,
      signalCount:[...this.counts.values()].reduce((sum, value) => sum + value, 0),
      lastSignal:this.lastSignal
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    this.counts.clear();
    delete document.documentElement.dataset.whitNerves;
  }
}

export const createWhitNervousSystemV308 = options => new WhitNervousSystemV308(options);
