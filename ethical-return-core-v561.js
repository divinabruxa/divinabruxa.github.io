/* DIVINA BRUXA 4.0 — MACROETAPA 13/14 · RETORNO ÉTICO V561
   Razões reais para voltar, nunca pressão: desafio diário sem punição,
   histórico e favoritos locais, lembretes explícitos e analytics consentido.
   Nenhum corpo do Diário, carta revelada, pergunta, prompt ou localização
   precisa é lido, enviado ou inferido por este núcleo. */

export const ETHICAL_RETURN_RELEASE_V561 = 561;
export const ETHICAL_RETURN_STATE_KEY_V561 = 'divina-ethical-return-v561';
export const ETHICAL_ANALYTICS_STATE_KEY_V561 = 'divina-ethical-analytics-v561';
export const ETHICAL_ANALYTICS_CONSENT_VERSION_V561 = 'privacy-v547-2026-09-13';

export const ETHICAL_RETURN_ROUTES_V561 = Object.freeze([
  'home','tarot','daily','library','spreads','school','journal','consultations',
  'store','login','subscriptions','ai','music','videos','skins','notifications','admin'
]);

export const ETHICAL_RETURN_QUIET_HOURS_V561 = Object.freeze({
  start:'22:00',
  end:'08:00',
  timeZone:'America/Sao_Paulo'
});

export const ETHICAL_NOTIFICATION_TEMPLATES_V561 = Object.freeze({
  daily:Object.freeze({
    title:'Divina Bruxa',
    body:'Sua Carta do Dia está pronta para ser encontrada.',
    route:'daily'
  }),
  school:Object.freeze({
    title:'Escola do Tarot',
    body:'Seu desafio de hoje está disponível. Continue no seu ritmo.',
    route:'school'
  }),
  skins:Object.freeze({
    title:'Skins da Orbe',
    body:'Há uma novidade no catálogo oficial. Veja quando quiser.',
    route:'skins'
  }),
  episodes:Object.freeze({
    title:'De Frente com o Tarot',
    body:'Há um novo episódio publicado para você conhecer.',
    route:'videos'
  })
});

export const SCHOOL_DAILY_CHALLENGES_V561 = Object.freeze([
  Object.freeze({id:'one-lesson',title:'Uma aula, inteira',prompt:'Abra a próxima aula e fique apenas com uma ideia que faça sentido hoje.'}),
  Object.freeze({id:'symbol-notice',title:'Um símbolo em foco',prompt:'Escolha um símbolo de uma carta e observe como ele muda a leitura.'}),
  Object.freeze({id:'three-words',title:'Três palavras',prompt:'Resuma uma carta em três palavras suas, sem procurar a resposta perfeita.'}),
  Object.freeze({id:'major-arcana',title:'Um Arcano Maior',prompt:'Revisite um Arcano Maior e formule uma pergunta aberta para ele.'}),
  Object.freeze({id:'four-elements',title:'Quatro elementos',prompt:'Reconheça qual elemento aparece com mais força no estudo de hoje.'}),
  Object.freeze({id:'number-pattern',title:'Número e movimento',prompt:'Observe um número do Tarot e compare como ele age em dois naipes.'}),
  Object.freeze({id:'court-voice',title:'A voz da Corte',prompt:'Leia uma carta da Corte como postura possível, nunca como rótulo de alguém.'}),
  Object.freeze({id:'position-shift',title:'Mudar a posição',prompt:'Imagine a mesma carta em duas posições de tiragem e compare a nuance.'}),
  Object.freeze({id:'two-card-bridge',title:'Ponte entre duas cartas',prompt:'Una duas cartas em uma frase clara, sem transformar a leitura em sentença.'}),
  Object.freeze({id:'ethical-boundary',title:'Limite antes da resposta',prompt:'Relembre um limite ético que torna uma leitura mais responsável.'}),
  Object.freeze({id:'open-question',title:'Pergunta que abre',prompt:'Transforme uma pergunta fechada em uma pergunta que devolva escolhas.'}),
  Object.freeze({id:'gentle-review',title:'Revisão sem cobrança',prompt:'Abra uma aula marcada para rever e pare quando o aprendizado estiver suficiente.'}),
  Object.freeze({id:'plain-language',title:'Síntese em linguagem simples',prompt:'Explique uma ideia do Tarot como explicaria a uma pessoa começando agora.'}),
  Object.freeze({id:'own-method',title:'Seu próprio método',prompt:'Registre mentalmente o que você manteria e o que mudaria na prática estudada.'})
]);

const ROUTE_LABELS = Object.freeze({
  home:'Início',tarot:'Tarot Livre',daily:'Carta do Dia',library:'Biblioteca',
  spreads:'Tiragens',school:'Escola',journal:'Diário',consultations:'Consultas',
  store:'Loja',login:'Conta',subscriptions:'Premium',ai:'Whit Local',music:'Música',
  videos:'De Frente com o Tarot',skins:'Skins',notifications:'Jardim do Retorno',admin:'Admin'
});
const FAVORITE_ROUTES = Object.freeze(['daily','school','journal','library','spreads','music','videos','skins']);
const ANALYTICS_ROUTES = new Set(['home','tarot','daily','library','spreads','school','store','subscriptions','music','videos','skins','notifications']);
const PRIVATE_AREA_ROUTES = new Set(['journal','consultations','login','ai']);
const EVENT_STAGES = Object.freeze({
  session_start:'arrival',
  route_view:'exploration',
  daily_revealed:'ritual',
  school_challenge_started:'learning',
  school_challenge_completed:'return',
  journal_calendar_opened:'return',
  journal_favorites_opened:'return',
  favorite_route_changed:'exploration',
  notification_preference_saved:'permission',
  media_catalog_viewed:'content',
  skin_catalog_viewed:'content'
});
const ANALYTICS_EVENT_KEYS = new Set(Object.keys(EVENT_STAGES));
const ANALYTICS_ROUTE_KEYS = new Set([...ANALYTICS_ROUTES, 'private-area']);
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,96}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_HISTORY = 30;
const MAX_CHALLENGE_HISTORY = 45;
const MAX_ANALYTICS_QUEUE = 80;
const MAX_ANALYTICS_BATCH = 20;
const ANALYTICS_TOKEN_LIFETIME_MS = 90 * 86400000;

const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[character]));
const integer = value => Math.max(0, Math.floor(Number(value) || 0));
const routeNow = () => String(document.body?.dataset?.screen || location.hash || 'home').replace(/^#/,'').trim().toLowerCase() || 'home';
const routeAllowed = route => ETHICAL_RETURN_ROUTES_V561.includes(String(route || '').toLowerCase());
const normalizeRoute = route => routeAllowed(route) ? String(route).toLowerCase() : 'home';
const normalizeTime = value => TIME_PATTERN.test(String(value || '')) ? String(value) : '09:00';
const toast = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', {detail:String(message || '')}));

export function brasiliaDayV561(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone:ETHICAL_RETURN_QUIET_HOURS_V561.timeZone,
    year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(value).reduce((result, part) => {
    if (part.type !== 'literal') result[part.type] = part.value;
    return result;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

const dateLabel = value => {
  if (!DAY_PATTERN.test(String(value || ''))) return 'dia preservado';
  const [year, month, day] = String(value).split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone:ETHICAL_RETURN_QUIET_HOURS_V561.timeZone,
    day:'2-digit',month:'short'
  }).format(new Date(Date.UTC(year, month - 1, day, 15)));
};

const dayNumber = value => {
  const [year, month, day] = String(value).split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};

export function challengeForDateV561(day = brasiliaDayV561()) {
  const normalized = DAY_PATTERN.test(String(day || '')) ? String(day) : brasiliaDayV561();
  const challenge = SCHOOL_DAILY_CHALLENGES_V561[Math.abs(dayNumber(normalized)) % SCHOOL_DAILY_CHALLENGES_V561.length];
  return Object.freeze({...challenge, day:normalized});
}

export function isQuietHoursV561(value = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-US', {
    timeZone:ETHICAL_RETURN_QUIET_HOURS_V561.timeZone,
    hour:'2-digit',hourCycle:'h23'
  }).format(value));
  return Number.isFinite(hour) && (hour >= 22 || hour < 8);
}

export function notificationTemplateV561(category = 'daily') {
  return ETHICAL_NOTIFICATION_TEMPLATES_V561[category] || ETHICAL_NOTIFICATION_TEMPLATES_V561.daily;
}

export function analyticsRouteV561(route) {
  const candidate = String(route || '').trim().toLowerCase();
  if (!routeAllowed(candidate)) return '';
  const normalized = candidate;
  if (ANALYTICS_ROUTES.has(normalized)) return normalized;
  if (PRIVATE_AREA_ROUTES.has(normalized)) return 'private-area';
  return '';
}

export function sanitizeAnalyticsEventV561(input = {}) {
  const eventKey = String(input.event_key || '').trim().toLowerCase();
  const routeKey = String(input.route_key || '').trim().toLowerCase();
  const occurredAt = new Date(input.occurred_at || '');
  if (!ANALYTICS_EVENT_KEYS.has(eventKey) || !UUID_PATTERN.test(String(input.event_id || ''))) return null;
  if (routeKey && !ANALYTICS_ROUTE_KEYS.has(routeKey)) return null;
  if (Number.isNaN(occurredAt.getTime())) return null;
  return Object.freeze({
    event_id:String(input.event_id),
    event_key:eventKey,
    route_key:routeKey || null,
    funnel_stage:EVENT_STAGES[eventKey],
    occurred_at:occurredAt.toISOString()
  });
}

const defaultReturnState = () => ({
  version:ETHICAL_RETURN_RELEASE_V561,
  reminders:{daily:false,school:false,skins:false,episodes:false,time:'09:00'},
  favorites:[],
  routeHistory:[],
  challengeHistory:[],
  dailyRevealedDay:'',
  media:{seenEpisodes:0,lastPublishedEpisodes:null,checkedDay:''},
  updatedAt:null
});

const readReturnState = () => {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(ETHICAL_RETURN_STATE_KEY_V561) || '{}') || {}; }
  catch {}
  const base = defaultReturnState();
  const favorites = Array.isArray(raw.favorites)
    ? [...new Set(raw.favorites.map(normalizeRoute).filter(route => FAVORITE_ROUTES.includes(route)))].slice(0, FAVORITE_ROUTES.length)
    : [];
  const routeHistory = Array.isArray(raw.routeHistory) ? raw.routeHistory.filter(item =>
    item && DAY_PATTERN.test(String(item.day || '')) && routeAllowed(item.route)
  ).slice(0, MAX_HISTORY).map(item => ({day:String(item.day),route:normalizeRoute(item.route)})) : [];
  const challengeHistory = Array.isArray(raw.challengeHistory) ? raw.challengeHistory.filter(item =>
    item && DAY_PATTERN.test(String(item.day || '')) && SCHOOL_DAILY_CHALLENGES_V561.some(challenge => challenge.id === item.id)
  ).slice(0, MAX_CHALLENGE_HISTORY).map(item => ({day:String(item.day),id:String(item.id),completed:item.completed === true})) : [];
  const episodeCount = raw.media?.lastPublishedEpisodes === null || raw.media?.lastPublishedEpisodes === undefined
    ? null : integer(raw.media.lastPublishedEpisodes);
  return {
    ...base,
    reminders:{
      daily:raw.reminders?.daily === true,
      school:raw.reminders?.school === true,
      skins:raw.reminders?.skins === true,
      episodes:raw.reminders?.episodes === true,
      time:normalizeTime(raw.reminders?.time)
    },
    favorites,
    routeHistory,
    challengeHistory,
    dailyRevealedDay:DAY_PATTERN.test(String(raw.dailyRevealedDay || '')) ? String(raw.dailyRevealedDay) : '',
    media:{
      seenEpisodes:integer(raw.media?.seenEpisodes),
      lastPublishedEpisodes:episodeCount,
      checkedDay:DAY_PATTERN.test(String(raw.media?.checkedDay || '')) ? String(raw.media.checkedDay) : ''
    },
    updatedAt:raw.updatedAt ? String(raw.updatedAt) : null
  };
};

const writeReturnState = state => {
  const next = {...state,version:ETHICAL_RETURN_RELEASE_V561,updatedAt:new Date().toISOString()};
  try { localStorage.setItem(ETHICAL_RETURN_STATE_KEY_V561, JSON.stringify(next)); return next; }
  catch { return next; }
};

const randomToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
};

const randomUuid = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};

const defaultAnalyticsState = () => ({
  version:ETHICAL_RETURN_RELEASE_V561,
  actorToken:randomToken(),
  createdAt:new Date().toISOString(),
  queue:[]
});

const readAnalyticsState = () => {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(ETHICAL_ANALYTICS_STATE_KEY_V561) || 'null'); }
  catch {}
  const created = new Date(raw?.createdAt || '').getTime();
  if (!raw || !TOKEN_PATTERN.test(String(raw.actorToken || '')) || !Number.isFinite(created) || Date.now() - created > ANALYTICS_TOKEN_LIFETIME_MS) {
    return defaultAnalyticsState();
  }
  const queue = Array.isArray(raw.queue)
    ? raw.queue.map(sanitizeAnalyticsEventV561).filter(Boolean).slice(-MAX_ANALYTICS_QUEUE)
    : [];
  return {version:ETHICAL_RETURN_RELEASE_V561,actorToken:String(raw.actorToken),createdAt:new Date(created).toISOString(),queue};
};

const writeAnalyticsState = state => {
  try { localStorage.setItem(ETHICAL_ANALYTICS_STATE_KEY_V561, JSON.stringify(state)); return true; }
  catch { return false; }
};

const removeAnalyticsState = () => {
  try { localStorage.removeItem(ETHICAL_ANALYTICS_STATE_KEY_V561); return true; }
  catch { return false; }
};

const localeGroup = () => {
  const value = String(document.documentElement.lang || navigator.language || 'pt').toLowerCase();
  if (value.startsWith('pt')) return 'pt';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('es')) return 'es';
  return 'other';
};

const platformGroup = () => {
  if (globalThis.matchMedia?.('(display-mode: standalone)')?.matches || navigator.standalone === true) return 'pwa';
  return 'web';
};

const listHistory = state => state.routeHistory.slice(0, 7).map(item => `
  <li><span>${safe(dateLabel(item.day))}</span><b>${safe(ROUTE_LABELS[item.route] || item.route)}</b></li>`).join('');

const enabledReminderCount = reminders => ['daily','school','skins','episodes'].filter(key => reminders[key]).length;

export class EthicalReturnCoreV561 {
  constructor(options = {}) {
    this.go = typeof options.go === 'function' ? options.go : route => { location.hash = route; };
    this.config = options.config || {};
    this.getPrivacyPreferences = typeof options.getPrivacyPreferences === 'function'
      ? options.getPrivacyPreferences : () => ({analytics:false});
    this.endpoint = `${String(this.config.accountFunctionsBase || '').replace(/\/$/,'')}/ethical-analytics-v561`;
    this.publishableKey = String(this.config.supabasePublishableKey || '');
    this.state = readReturnState();
    this.sessionToken = randomToken();
    this.analyticsAllowed = this.getPrivacyPreferences()?.analytics === true;
    this.abort = new AbortController();
    this.flushTimer = 0;
    this.pendingJournalView = '';
    this.pendingSchoolChallenge = false;
    this.feedback = '';
    this.destroyed = false;
    this.bind();
    this.start();
  }

  bind() {
    const signal = this.abort.signal;
    document.addEventListener('divina:route-ready', event => this.routeReady(event.detail?.id), {signal});
    document.addEventListener('divina:page-ready', event => this.pageReady(event.detail?.id), {signal});
    globalThis.addEventListener('divina:privacy-change', event => this.privacyChanged(event.detail || {}), {signal});
    globalThis.addEventListener('divina:daily-v561-revealed', event => this.dailyRevealed(event.detail || {}), {signal});
    document.addEventListener('divina:media-supreme-ready', event => this.mediaReady(event.detail || {}), {signal});
    globalThis.addEventListener('online', () => this.scheduleFlush(80), {passive:true,signal});
    globalThis.addEventListener('pagehide', () => this.flush({keepalive:true}), {passive:true,signal});
  }

  start() {
    const current = normalizeRoute(routeNow());
    this.recordRoute(current);
    if (this.analyticsAllowed) {
      this.track('session_start', current);
      this.track('route_view', current);
    }
    queueMicrotask(() => this.renderRoute(current));
    document.documentElement.dataset.ethicalReturn = 'v561';
    document.dispatchEvent(new CustomEvent('divina:ethical-return-ready', {detail:this.status()}));
  }

  privacyChanged(preferences = {}) {
    const previous = this.analyticsAllowed;
    this.analyticsAllowed = preferences.analytics === true;
    if (previous && !this.analyticsAllowed) this.eraseAnalytics({remote:true,announce:false});
    if (!previous && this.analyticsAllowed) {
      this.track('session_start', routeNow());
      this.track('route_view', routeNow());
    }
    this.renderHub();
  }

  saveState() {
    this.state = writeReturnState(this.state);
    this.renderHub();
    this.renderRoute(routeNow());
    document.dispatchEvent(new CustomEvent('divina:ethical-return-updated', {detail:this.status()}));
  }

  recordRoute(route) {
    const normalized = normalizeRoute(route);
    if (normalized === 'admin') return false;
    const day = brasiliaDayV561();
    const filtered = this.state.routeHistory.filter(item => !(item.day === day && item.route === normalized));
    this.state.routeHistory = [{day,route:normalized},...filtered].slice(0,MAX_HISTORY);
    this.state = writeReturnState(this.state);
    return true;
  }

  routeReady(route) {
    const normalized = normalizeRoute(route);
    this.recordRoute(normalized);
    this.track('route_view', normalized);
    this.renderRoute(normalized);
  }

  pageReady(route) {
    const normalized = normalizeRoute(route);
    this.renderRoute(normalized);
    if (normalized === 'journal') this.applyJournalView();
    if (normalized === 'school') this.applySchoolChallenge();
    if (normalized === 'videos' && Number.isFinite(this.state.media.lastPublishedEpisodes)) {
      this.state.media.seenEpisodes = integer(this.state.media.lastPublishedEpisodes);
      this.saveState();
      this.track('media_catalog_viewed', 'videos');
    }
    if (normalized === 'skins') this.track('skin_catalog_viewed', 'skins');
  }

  dailyRevealed(detail = {}) {
    if (detail.revealed !== true || detail.cardIncluded === true || detail.intentionIncluded === true) return;
    const day = DAY_PATTERN.test(String(detail.date || '')) ? String(detail.date) : brasiliaDayV561();
    this.state.dailyRevealedDay = day;
    this.saveState();
    this.track('daily_revealed', 'daily');
  }

  mediaReady(detail = {}) {
    const episodes = integer(detail.episodes);
    if (detail.inventedEpisodes !== 0) return;
    this.state.media.lastPublishedEpisodes = episodes;
    this.state.media.checkedDay = brasiliaDayV561();
    this.saveState();
  }

  challengeState() {
    const challenge = challengeForDateV561();
    const record = this.state.challengeHistory.find(item => item.day === challenge.day && item.id === challenge.id);
    return {challenge,completed:record?.completed === true};
  }

  startChallenge() {
    this.pendingSchoolChallenge = true;
    this.track('school_challenge_started','school');
    this.go('school', {source:'ethical-return-v561'});
    queueMicrotask(() => this.applySchoolChallenge());
  }

  applySchoolChallenge() {
    if (!this.pendingSchoolChallenge || normalizeRoute(routeNow()) !== 'school') return false;
    const world = globalThis.divinaSchoolWorldV306;
    if (!world?.engine?.continuePath) return false;
    this.pendingSchoolChallenge = false;
    world.engine.continuePath();
    return true;
  }

  completeChallenge() {
    const {challenge,completed} = this.challengeState();
    const others = this.state.challengeHistory.filter(item => item.day !== challenge.day);
    this.state.challengeHistory = [{day:challenge.day,id:challenge.id,completed:!completed},...others].slice(0,MAX_CHALLENGE_HISTORY);
    this.saveState();
    if (!completed) {
      this.track('school_challenge_completed','school');
      toast('Desafio guardado como concluído. Amanhã começa outro, sem zerar nada.');
    } else toast('Conclusão retirada. Seu histórico continua sob seu controle.');
  }

  toggleFavorite(route) {
    const normalized = normalizeRoute(route);
    if (!FAVORITE_ROUTES.includes(normalized)) return false;
    const active = this.state.favorites.includes(normalized);
    this.state.favorites = active
      ? this.state.favorites.filter(item => item !== normalized)
      : [...this.state.favorites, normalized];
    this.saveState();
    this.track('favorite_route_changed', normalized);
    toast(active ? 'Caminho retirado dos favoritos.' : 'Caminho guardado nos favoritos deste aparelho.');
    return !active;
  }

  openJournal(view = 'timeline') {
    this.pendingJournalView = ['calendar','favorites','timeline'].includes(view) ? view : 'timeline';
    this.go('journal', {source:'ethical-return-v561'});
    queueMicrotask(() => this.applyJournalView());
  }

  applyJournalView() {
    if (!this.pendingJournalView || normalizeRoute(routeNow()) !== 'journal') return false;
    const root = document.getElementById('journalApp');
    if (!root) return false;
    const view = this.pendingJournalView;
    const timeline = root.querySelector('[data-journal-view="timeline"]');
    const calendar = root.querySelector('[data-journal-view="calendar"]');
    const favorites = root.querySelector('#journalFavoriteFilter');
    if (view === 'calendar') calendar?.click();
    else {
      timeline?.click();
      if (favorites) {
        favorites.checked = view === 'favorites';
        favorites.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }
    root.querySelector('.journal-explorer')?.scrollIntoView({behavior:'auto',block:'start'});
    this.pendingJournalView = '';
    if (view === 'calendar') this.track('journal_calendar_opened','journal');
    if (view === 'favorites') this.track('journal_favorites_opened','journal');
    return true;
  }

  saveReminders(form) {
    const elements = form?.elements;
    if (!elements) return false;
    this.state.reminders = {
      daily:elements.daily?.checked === true,
      school:elements.school?.checked === true,
      skins:elements.skins?.checked === true,
      episodes:elements.episodes?.checked === true,
      time:normalizeTime(elements.time?.value)
    };
    this.saveState();
    this.track('notification_preference_saved','notifications');
    toast('Preferências locais salvas. O envio externo continua desligado no STAGING.');
    return true;
  }

  async testNotification(category = 'daily') {
    const template = notificationTemplateV561(category);
    if (isQuietHoursV561()) {
      this.feedback = 'Teste preservado: agora é horário de silêncio em Brasília (22h–08h).';
      this.renderHub();
      return {ok:false,reason:'quiet-hours'};
    }
    if (!('Notification' in globalThis)) {
      this.feedback = 'Este navegador não oferece notificações locais.';
      this.renderHub();
      return {ok:false,reason:'unsupported'};
    }
    let permission = Notification.permission;
    if (permission === 'default') permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      this.feedback = 'Permissão não concedida. Nada foi enviado.';
      this.renderHub();
      return {ok:false,reason:'permission-denied'};
    }
    try {
      const registration = await navigator.serviceWorker?.ready;
      const worker = registration?.active || navigator.serviceWorker?.controller;
      if (worker) {
        const channel = new MessageChannel();
        const response = new Promise(resolve => {
          const timer = setTimeout(() => resolve({ok:true,reason:'sent-without-reply'}), 1800);
          channel.port1.onmessage = event => { clearTimeout(timer); resolve(event.data || {ok:true}); };
        });
        worker.postMessage({type:'SHOW_LOCAL_NOTIFICATION_V561',category},[channel.port2]);
        const result = await response;
        this.feedback = result?.ok === false
          ? 'O horário de silêncio protegeu este teste.'
          : 'Lembrete local seguro enviado. Ele não revela a carta.';
        this.renderHub();
        return result;
      }
      new Notification(template.title,{body:template.body,tag:`divina-v561-${category}`,silent:true});
      this.feedback = 'Lembrete local seguro enviado. Ele não revela a carta.';
      this.renderHub();
      return {ok:true,reason:'window-notification'};
    } catch {
      this.feedback = 'O teste local não pôde ser mostrado agora.';
      this.renderHub();
      return {ok:false,reason:'notification-failed'};
    }
  }

  async sharePath(route = 'home') {
    const normalized = normalizeRoute(route);
    const url = `${location.origin}${location.pathname}#${normalized}`;
    const payload = {
      title:'Divina Bruxa — Orbe das Realidades',
      text:'Escolhi um pequeno caminho para hoje na Orbe das Realidades.',
      url
    };
    try {
      if (navigator.share) await navigator.share(payload);
      else await navigator.clipboard.writeText(`${payload.text} ${url}`);
      toast('Caminho compartilhado sem dados privados.');
      return true;
    } catch { return false; }
  }

  clearLocalHistory() {
    if (!globalThis.confirm?.('Apagar o histórico de caminhos e desafios deste aparelho?')) return false;
    this.state.routeHistory = [];
    this.state.challengeHistory = [];
    this.state.dailyRevealedDay = '';
    this.saveState();
    toast('Histórico local apagado. Favoritos e lembretes foram preservados.');
    return true;
  }

  exportLocalHistory() {
    const payload = {
      schema:'divina-ethical-return-v561',
      exportedAt:new Date().toISOString(),
      privateTextIncluded:false,
      state:{
        favorites:[...this.state.favorites],
        routeHistory:this.state.routeHistory.map(item => ({...item})),
        challengeHistory:this.state.challengeHistory.map(item => ({...item})),
        reminders:{...this.state.reminders},
        dailyRevealedDay:this.state.dailyRevealedDay || null,
        media:{...this.state.media}
      }
    };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    link.download = `divina-retorno-v561-${brasiliaDayV561()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
    return true;
  }

  analyticsHeaders() {
    const headers = {'content-type':'application/json','accept':'application/json','x-divina-analytics-request':'v561'};
    if (this.publishableKey) headers.apikey = this.publishableKey;
    return headers;
  }

  track(eventKey, route = '') {
    if (!this.analyticsAllowed || !ANALYTICS_EVENT_KEYS.has(String(eventKey))) return false;
    const routeKey = analyticsRouteV561(route);
    if (normalizeRoute(route) === 'admin') return false;
    const event = sanitizeAnalyticsEventV561({
      event_id:randomUuid(),
      event_key:eventKey,
      route_key:routeKey,
      occurred_at:new Date().toISOString()
    });
    if (!event) return false;
    const state = readAnalyticsState();
    state.queue = [...state.queue,event].slice(-MAX_ANALYTICS_QUEUE);
    writeAnalyticsState(state);
    this.scheduleFlush();
    return true;
  }

  scheduleFlush(delay = 620) {
    if (!this.analyticsAllowed || this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = 0;
      this.flush();
    }, Math.max(0,delay));
  }

  async flush({keepalive = false} = {}) {
    if (!this.analyticsAllowed || !this.endpoint || !this.publishableKey || navigator.onLine === false) return {ok:false,reason:'not-ready'};
    const state = readAnalyticsState();
    const events = state.queue.slice(0,MAX_ANALYTICS_BATCH);
    if (!events.length) return {ok:true,accepted:0};
    try {
      const response = await fetch(this.endpoint, {
        method:'POST',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',keepalive,
        headers:this.analyticsHeaders(),
        body:JSON.stringify({
          release:'V561',consent:true,consent_version:ETHICAL_ANALYTICS_CONSENT_VERSION_V561,
          actor_token:state.actorToken,session_token:this.sessionToken,
          locale:localeGroup(),platform:platformGroup(),events
        })
      });
      if (!response.ok) return {ok:false,status:response.status};
      const acceptedIds = new Set(events.map(event => event.event_id));
      const latest = readAnalyticsState();
      if (latest.actorToken === state.actorToken) {
        latest.queue = latest.queue.filter(event => !acceptedIds.has(event.event_id));
        writeAnalyticsState(latest);
      }
      return {ok:true,accepted:events.length};
    } catch { return {ok:false,reason:'network'}; }
  }

  async eraseAnalytics({remote = true,announce = true} = {}) {
    const state = readAnalyticsState();
    removeAnalyticsState();
    let removedRemote = false;
    if (remote && this.endpoint && this.publishableKey && navigator.onLine !== false) {
      try {
        const response = await fetch(this.endpoint, {
          method:'DELETE',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',keepalive:true,
          headers:this.analyticsHeaders(),
          body:JSON.stringify({actor_token:state.actorToken})
        });
        removedRemote = response.ok;
      } catch {}
    }
    if (announce) toast(removedRemote
      ? 'Métricas pseudônimas deste aparelho apagadas no STAGING.'
      : 'Fila e identificador locais apagados. A remoção remota não pôde ser confirmada agora.');
    this.renderHub();
    return {local:true,remote:removedRemote};
  }

  ensurePanel(id, route, beforeSelector = '') {
    const screen = document.getElementById(route);
    if (!screen) return null;
    let panel = document.getElementById(id);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = id;
      panel.className = `erv561 erv561--${route}`;
      panel.dataset.ethicalReturnPanel = route;
      const before = beforeSelector ? screen.querySelector(beforeSelector) : null;
      if (before) screen.insertBefore(panel,before);
      else screen.append(panel);
    }
    return panel;
  }

  bindPanel(panel) {
    if (!panel || panel.dataset.erv561Bound === 'true') return;
    panel.dataset.erv561Bound = 'true';
    panel.addEventListener('click', event => {
      const goButton = event.target.closest('[data-erv561-go]');
      if (goButton) this.go(normalizeRoute(goButton.dataset.erv561Go),{source:'ethical-return-v561'});
      const favorite = event.target.closest('[data-erv561-favorite]');
      if (favorite) this.toggleFavorite(favorite.dataset.erv561Favorite);
      if (event.target.closest('[data-erv561-challenge-start]')) this.startChallenge();
      if (event.target.closest('[data-erv561-challenge-complete]')) this.completeChallenge();
      const journal = event.target.closest('[data-erv561-journal]');
      if (journal) this.openJournal(journal.dataset.erv561Journal);
      const notify = event.target.closest('[data-erv561-notify-test]');
      if (notify) this.testNotification(notify.dataset.erv561NotifyTest);
      const share = event.target.closest('[data-erv561-share]');
      if (share) this.sharePath(share.dataset.erv561Share);
      if (event.target.closest('[data-erv561-clear-history]')) this.clearLocalHistory();
      if (event.target.closest('[data-erv561-export]')) this.exportLocalHistory();
      if (event.target.closest('[data-erv561-clear-analytics]')) {
        if (globalThis.confirm?.('Apagar a fila local e solicitar a exclusão das métricas pseudônimas deste aparelho no STAGING?')) this.eraseAnalytics();
      }
    }, {signal:this.abort.signal});
    panel.addEventListener('submit', event => {
      const form = event.target.closest('[data-erv561-reminders]');
      if (!form) return;
      event.preventDefault();
      this.saveReminders(form);
    }, {signal:this.abort.signal});
  }

  favoriteButton(route) {
    const active = this.state.favorites.includes(route);
    return `<button type="button" class="erv561__favorite" data-erv561-favorite="${route}" aria-pressed="${active}">${active?'★ FAVORITO':'☆ FAVORITAR'}</button>`;
  }

  renderDaily() {
    const panel = this.ensurePanel('ethicalReturnDailyV561','daily','#dailyCard');
    if (!panel) return;
    const revealed = this.state.dailyRevealedDay === brasiliaDayV561();
    panel.innerHTML = `<div class="erv561__compact"><span aria-hidden="true">☾</span><p><small>RETORNO ÉTICO · HOJE</small><b>${revealed?'Seu encontro de hoje está guardado.':'A carta permanece em segredo até você abrir.'}</b><em>O lembrete diz apenas que o ritual está disponível — nunca mostra carta, imagem ou significado.</em></p><div>${this.favoriteButton('daily')}<button type="button" data-erv561-go="notifications">LEMBRETES</button></div></div>`;
    this.bindPanel(panel);
  }

  renderSchool() {
    const panel = this.ensurePanel('ethicalReturnSchoolV561','school','#schoolApp');
    if (!panel) return;
    const {challenge,completed} = this.challengeState();
    panel.innerHTML = `<div class="erv561__challenge"><div><p class="eyebrow">DESAFIO DA ESCOLA · ${safe(dateLabel(challenge.day))}</p><h3>${safe(challenge.title)}</h3><p>${safe(challenge.prompt)}</p><small>Pular um dia não apaga, zera ou pune nada.</small></div><div class="erv561__actions"><button type="button" data-erv561-challenge-start>CONTINUAR NA PRÓXIMA AULA</button><button type="button" class="secondary" data-erv561-challenge-complete aria-pressed="${completed}">${completed?'✓ CONCLUÍDO':'MARCAR COMO CONCLUÍDO'}</button>${this.favoriteButton('school')}</div></div>`;
    this.bindPanel(panel);
  }

  renderJournal() {
    const panel = this.ensurePanel('ethicalReturnJournalV561','journal','#journalApp');
    if (!panel) return;
    panel.innerHTML = `<div class="erv561__compact"><span aria-hidden="true">◷</span><p><small>ATALHOS PRIVADOS</small><b>Reencontre sem ser observada.</b><em>Estes botões apenas abrem as visualizações do Diário. O Jardim não lê títulos, textos, perguntas ou cartas.</em></p><div><button type="button" data-erv561-journal="calendar">CALENDÁRIO</button><button type="button" data-erv561-journal="favorites">FAVORITAS</button><button type="button" data-erv561-journal="timeline">LINHA DO TEMPO</button>${this.favoriteButton('journal')}</div></div>`;
    this.bindPanel(panel);
  }

  renderVideos() {
    const panel = this.ensurePanel('ethicalReturnVideosV561','videos','#videoApp');
    if (!panel) return;
    const count = this.state.media.lastPublishedEpisodes;
    const copy = count === null
      ? 'O catálogo real será contado quando este mundo terminar de abrir.'
      : count === 0
        ? 'Nenhum episódio foi publicado ainda. A página continua honesta e sem conteúdo inventado.'
        : `${count} ${count === 1 ? 'episódio publicado' : 'episódios publicados'} no catálogo oficial.`;
    panel.innerHTML = `<div class="erv561__compact"><span aria-hidden="true">▷</span><p><small>NOVIDADES REAIS</small><b>${safe(copy)}</b><em>Somente episódios publicados entram aqui; rascunhos e títulos inventados ficam de fora.</em></p><div>${this.favoriteButton('videos')}<button type="button" data-erv561-go="notifications">AVISOS DE EPISÓDIOS</button></div></div>`;
    this.bindPanel(panel);
  }

  renderSkins() {
    const panel = this.ensurePanel('ethicalReturnSkinsV561','skins','#skinsApp');
    if (!panel) return;
    panel.innerHTML = `<div class="erv561__compact"><span aria-hidden="true">✦</span><p><small>DESCOBERTA DIÁRIA</small><b>Explore as 30 skins do catálogo oficial.</b><em>O Jardim não cria nomes ou assets fictícios. Novidades só aparecem depois de publicadas no catálogo real.</em></p><div>${this.favoriteButton('skins')}<button type="button" data-erv561-go="notifications">AVISOS DE SKINS</button></div></div>`;
    this.bindPanel(panel);
  }

  renderHub() {
    const panel = this.ensurePanel('ethicalReturnHubV561','notifications','#notificationApp');
    if (!panel) return;
    const {challenge,completed} = this.challengeState();
    const favorites = this.state.favorites.length
      ? this.state.favorites.map(route => `<button type="button" data-erv561-go="${route}">${safe(ROUTE_LABELS[route])}</button>`).join('')
      : '<span class="erv561__empty">Favorite um caminho para encontrá-lo aqui.</span>';
    const history = listHistory(this.state) || '<li class="erv561__empty">Seu histórico local começa quando você escolhe um caminho.</li>';
    const published = this.state.media.lastPublishedEpisodes;
    const newEpisodes = published === null ? null : Math.max(0,integer(published)-integer(this.state.media.seenEpisodes));
    const episodeCopy = published === null
      ? 'Abra Vídeos para consultar o catálogo publicado.'
      : published === 0
        ? 'Nenhum episódio publicado; nenhum foi inventado.'
        : newEpisodes > 0
          ? `${newEpisodes} ${newEpisodes === 1 ? 'episódio novo' : 'episódios novos'} desde sua última visita.`
          : `${published} ${published === 1 ? 'episódio publicado' : 'episódios publicados'}; nada novo pendente.`;
    const analyticsQueue = this.analyticsAllowed ? readAnalyticsState().queue.length : 0;
    const reminders = this.state.reminders;
    const feedback = this.feedback ? `<p class="erv561__feedback" role="status" aria-live="polite">${safe(this.feedback)}</p>` : '';

    panel.innerHTML = `<div class="erv561__stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="erv561__hero"><div><p class="eyebrow">JARDIM DO RETORNO · V561</p><h3>Voltar porque existe algo vivo — nunca por culpa.</h3><p>Um gesto diário, caminhos guardados e avisos escolhidos por você. Sem sequência obrigatória, urgência fabricada ou punição por ausência.</p></div><span aria-hidden="true">☾</span></header>

      <div class="erv561__grid">
        <article class="erv561__card erv561__card--challenge"><small>DESAFIO DE HOJE</small><h4>${safe(challenge.title)}</h4><p>${safe(challenge.prompt)}</p><div><button type="button" data-erv561-challenge-start>ABRIR ESCOLA</button><button type="button" class="secondary" data-erv561-challenge-complete aria-pressed="${completed}">${completed?'✓ FEITO NO SEU RITMO':'MARCAR COMO FEITO'}</button></div><em>Pular não quebra sequência: não existe sequência para quebrar.</em></article>
        <article class="erv561__card"><small>CARTA DO DIA</small><h4>${this.state.dailyRevealedDay===brasiliaDayV561()?'Encontro realizado hoje':'O ritual espera em silêncio'}</h4><p>O lembrete seguro nunca contém nome, imagem, posição ou significado da carta.</p><div><button type="button" data-erv561-go="daily">ABRIR RITUAL</button>${this.favoriteButton('daily')}</div></article>
        <article class="erv561__card"><small>CONTEÚDO PUBLICADO</small><h4>${safe(episodeCopy)}</h4><p>Skins e episódios só ganham aviso depois de existirem no catálogo oficial.</p><div><button type="button" data-erv561-go="videos">VÍDEOS</button><button type="button" data-erv561-go="skins">SKINS</button></div></article>
      </div>

      <section class="erv561__paths" aria-labelledby="erv561PathsTitle"><header><div><small>SEUS CAMINHOS</small><h4 id="erv561PathsTitle">Favoritos e histórico deste aparelho</h4></div><button type="button" data-erv561-share="notifications">COMPARTILHAR O JARDIM</button></header><div class="erv561__paths-body"><div><b>FAVORITOS</b><nav aria-label="Caminhos favoritos">${favorites}</nav></div><div><b>HISTÓRICO SEM TEXTO</b><ol>${history}</ol></div></div><footer><button type="button" data-erv561-export>BAIXAR CÓPIA LOCAL</button><button type="button" class="danger" data-erv561-clear-history>APAGAR HISTÓRICO</button></footer></section>

      <section class="erv561__journal" aria-labelledby="erv561JournalTitle"><div><small>DIÁRIO PRIVADO</small><h4 id="erv561JournalTitle">Calendário, favoritas e linha do tempo</h4><p>O Jardim abre a porta escolhida e para ali. Nenhum conteúdo do Diário é lido.</p></div><nav><button type="button" data-erv561-journal="calendar">CALENDÁRIO</button><button type="button" data-erv561-journal="favorites">FAVORITAS</button><button type="button" data-erv561-journal="timeline">HISTÓRICO</button></nav></section>

      <form class="erv561__reminders" data-erv561-reminders aria-labelledby="erv561RemindersTitle"><header><div><small>LEMBRETES OPCIONAIS</small><h4 id="erv561RemindersTitle">Você escolhe o que pode chamar.</h4><p>Silêncio fixo das 22h às 08h de Brasília. Nenhuma permissão é pedida ao abrir a página.</p></div><span>${enabledReminderCount(reminders)} ATIVOS</span></header><div class="erv561__toggles">
        <label><input type="checkbox" name="daily" ${reminders.daily?'checked':''}><span><b>Carta do Dia</b><small>sem revelar a carta</small></span></label>
        <label><input type="checkbox" name="school" ${reminders.school?'checked':''}><span><b>Desafio da Escola</b><small>sem cobrança ou streak</small></span></label>
        <label><input type="checkbox" name="skins" ${reminders.skins?'checked':''}><span><b>Novas skins</b><small>somente catálogo publicado</small></span></label>
        <label><input type="checkbox" name="episodes" ${reminders.episodes?'checked':''}><span><b>Novos episódios</b><small>somente conteúdo publicado</small></span></label>
      </div><label class="erv561__time"><span><b>Horário preferido</b><small>se cair no silêncio, aguarda fora dele quando houver provedor</small></span><input type="time" name="time" value="${safe(reminders.time)}"></label><div class="erv561__actions"><button type="submit">SALVAR PREFERÊNCIAS</button><button type="button" class="secondary" data-erv561-notify-test="daily">TESTAR LEMBRETE SEGURO</button></div><p class="erv561__truth"><b>STAGING:</b> preferências e teste local estão ativos. O provedor de envio externo permanece desligado; não existe promessa de lembrete com o app fechado.</p>${feedback}</form>

      <section class="erv561__privacy" aria-labelledby="erv561PrivacyTitle"><span aria-hidden="true">◇</span><div><small>MÉTRICAS ÉTICAS</small><h4 id="erv561PrivacyTitle">${this.analyticsAllowed?'Consentimento ativo':'Desligadas por padrão'}</h4><p>${this.analyticsAllowed?`Fila sanitizada neste aparelho: ${analyticsQueue}. O servidor recebe apenas evento permitido, rota genérica, dia, plataforma ampla e hashes pseudônimos.`:'DAU, WAU, MAU, funil e retenção só começam depois do opt-in no Centro de Privacidade.'}</p><ul><li>zero texto do Diário</li><li>zero carta ou intenção</li><li>zero pergunta de Consulta</li><li>zero prompt/resposta Whit</li><li>zero localização precisa</li></ul><div><a href="./privacidade-e-dados.html">ABRIR CENTRO DE PRIVACIDADE</a>${this.analyticsAllowed?'<button type="button" class="danger" data-erv561-clear-analytics>APAGAR MÉTRICAS DESTE APARELHO</button>':''}</div></div></section>`;
    this.bindPanel(panel);
  }

  renderRoute(route) {
    if (this.destroyed) return;
    const normalized = normalizeRoute(route);
    if (normalized === 'daily') this.renderDaily();
    if (normalized === 'school') this.renderSchool();
    if (normalized === 'journal') this.renderJournal();
    if (normalized === 'videos') this.renderVideos();
    if (normalized === 'skins') this.renderSkins();
    if (normalized === 'notifications') this.renderHub();
  }

  status() {
    const analytics = this.analyticsAllowed ? readAnalyticsState() : {queue:[]};
    const {challenge,completed} = this.challengeState();
    return Object.freeze({
      release:'V561',macroStage:'13-of-14',date:brasiliaDayV561(),
      challenge:challenge.id,challengeCompleted:completed,
      favorites:this.state.favorites.length,historyEntries:this.state.routeHistory.length,
      remindersEnabled:enabledReminderCount(this.state.reminders),quietHours:'22:00-08:00 America/Sao_Paulo',
      notificationProviderActive:false,notificationTestLocalOnly:true,
      analyticsConsent:this.analyticsAllowed,analyticsQueuedEvents:analytics.queue.length,
      analyticsRetentionDays:90,rawIdentifiersStoredServerSide:false,
      journalTextReads:0,dailyCardIdentityReads:0,consultationQuestionReads:0,whitContentReads:0,
      preciseLocation:false,mutationObservers:0,permanentAnimationLoops:0,
      inventedEpisodes:0,inventedSkins:0,canonicalOrb:true,productionPublish:false,realBilling:false,environment:'staging'
    });
  }

  audit() {
    return Object.freeze({
      ...this.status(),
      stateKeys:Object.freeze([ETHICAL_RETURN_STATE_KEY_V561,ETHICAL_ANALYTICS_STATE_KEY_V561]),
      analyticsEventWhitelist:Object.freeze([...ANALYTICS_EVENT_KEYS]),
      notificationCategories:Object.freeze(Object.keys(ETHICAL_NOTIFICATION_TEMPLATES_V561)),
      challengeCount:SCHOOL_DAILY_CHALLENGES_V561.length,
      noStreaks:true,noPunishment:true,noAutomaticPermissionPrompt:true,noSilentPrivateReads:true
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    clearTimeout(this.flushTimer);
    document.querySelectorAll('[data-ethical-return-panel]').forEach(panel => panel.remove());
    delete document.documentElement.dataset.ethicalReturn;
  }
}

export function createEthicalReturnCoreV561(options = {}) {
  globalThis.__divinaEthicalReturnCoreV561?.destroy?.();
  const core = new EthicalReturnCoreV561(options);
  globalThis.__divinaEthicalReturnCoreV561 = core;
  return core;
}

export const ETHICAL_RETURN_CONTRACT_V561 = Object.freeze({
  version:ETHICAL_RETURN_RELEASE_V561,
  macroStage:'13-of-14',
  challengeCount:SCHOOL_DAILY_CHALLENGES_V561.length,
  quietHours:ETHICAL_RETURN_QUIET_HOURS_V561,
  reminderCategories:Object.freeze(Object.keys(ETHICAL_NOTIFICATION_TEMPLATES_V561)),
  analyticsConsentRequired:true,
  analyticsRetentionDays:90,
  privateTextFields:0,
  cardIdentityInNotification:false,
  streaks:false,
  punishment:false,
  automaticPermissionPrompt:false,
  externalNotificationProvider:false,
  mutationObservers:0,
  permanentAnimationLoops:0,
  canonicalOrb:true,
  inventedEpisodes:0,
  inventedSkins:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false
});
