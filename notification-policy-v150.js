/* DIVINA BRUXA — POLÍTICA DE NOTIFICAÇÕES CELESTIAIS V150
   Consentimento explícito, silêncio por padrão e nenhuma revelação da Carta do Dia. */

export const NOTIFICATION_VERSION = 'v150';
export const NOTIFICATION_STORAGE_KEY = 'notification-preferences-v150';
export const NOTIFICATION_CONSENT_VERSION = 'celestial-notifications-v150';

export const QUIET_HOURS = Object.freeze({
  enabled: true,
  start: '22:00',
  end: '08:00',
  timeZone: 'America/Sao_Paulo'
});

export const NOTIFICATION_CATEGORIES = Object.freeze([
  Object.freeze({
    id: 'daily_card',
    label: 'Carta do Dia',
    sigil: '☾',
    description: 'Um convite delicado, sem revelar qual carta espera por você.',
    route: '#daily',
    apiDeepLink: '/carta-do-dia',
    defaultOn: true,
    essential: false
  }),
  Object.freeze({
    id: 'school',
    label: 'Escola do Tarot',
    sigil: '▤',
    description: 'Continuidade de estudos, módulos e práticas escolhidas.',
    route: '#school',
    apiDeepLink: '/escola',
    defaultOn: true,
    essential: false
  }),
  Object.freeze({
    id: 'consultations',
    label: 'Consultas',
    sigil: '♙',
    description: 'Confirmações e atualizações da sua solicitação de consulta.',
    route: '#consultations',
    apiDeepLink: '/consultas',
    defaultOn: true,
    essential: false
  }),
  Object.freeze({
    id: 'account_security',
    label: 'Conta e segurança',
    sigil: '◇',
    description: 'Avisos essenciais sobre acesso, proteção e recuperação da conta.',
    route: '#login',
    apiDeepLink: '/conta',
    defaultOn: true,
    essential: true
  }),
  Object.freeze({
    id: 'billing',
    label: 'Cobranças',
    sigil: '◎',
    description: 'Comprovantes, falhas e mudanças importantes em pagamentos.',
    route: '#subscriptions',
    apiDeepLink: '/conta',
    defaultOn: true,
    essential: true
  }),
  Object.freeze({
    id: 'orbe_ai',
    label: 'Orbe IA',
    sigil: '✦',
    description: 'Créditos, disponibilidade e novidades funcionais da Orbe IA.',
    route: '#ai',
    apiDeepLink: '/orbe-ia',
    defaultOn: true,
    essential: false
  }),
  Object.freeze({
    id: 'music',
    label: 'Música',
    sigil: '♫',
    description: 'Novos lançamentos e experiências sonoras.',
    route: '#music',
    apiDeepLink: '/musica',
    defaultOn: false,
    essential: false
  }),
  Object.freeze({
    id: 'episodes',
    label: 'De Frente com o Tarot',
    sigil: '▷',
    description: 'Avisos quando um novo episódio estiver disponível.',
    route: '#videos',
    apiDeepLink: '/de-frente-com-o-tarot',
    defaultOn: false,
    essential: false
  }),
  Object.freeze({
    id: 'skins',
    label: 'Skins da Orbe',
    sigil: '◆',
    description: 'Novas aparências e coleções para personalizar a Orbe.',
    route: '#skins',
    apiDeepLink: '/skins',
    defaultOn: false,
    essential: false
  }),
  Object.freeze({
    id: 'marketing',
    label: 'Novidades e ofertas',
    sigil: '✧',
    description: 'Conteúdo promocional opcional. Desativado até você escolher.',
    route: '#home',
    apiDeepLink: '/skins',
    defaultOn: false,
    essential: false,
    marketing: true
  })
]);

export const SAFE_DAILY_MESSAGE = 'Sua Carta do Dia espera por você na Orbe.';
export const SAFE_DAILY_TITLE = 'Um novo encontro espera por você';

const categoryMap = new Map(NOTIFICATION_CATEGORIES.map(category => [category.id, category]));
const routeSet = new Set(NOTIFICATION_CATEGORIES.map(category => category.route));
const apiRouteSet = new Set(NOTIFICATION_CATEGORIES.map(category => category.apiDeepLink));

export const notificationCategoryById = id => categoryMap.get(String(id || '')) || NOTIFICATION_CATEGORIES[0];
export const safeNotificationRoute = route => routeSet.has(String(route || '')) ? String(route) : '#home';
export const safeNotificationApiDeepLink = route => apiRouteSet.has(String(route || '')) ? String(route) : '/conta';

const oldCategoryIds = Object.freeze({
  'Carta do Dia': 'daily_card',
  Escola: 'school',
  Consultas: 'consultations',
  Segurança: 'account_security',
  'Orbe IA': 'orbe_ai',
  Música: 'music',
  Skins: 'skins'
});

const boolean = (value, fallback) => typeof value === 'boolean' ? value : fallback;
const validTime = (value, fallback) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || '')) ? String(value) : fallback;

export function defaultNotificationPreferences() {
  return {
    schema: NOTIFICATION_VERSION,
    enabled: false,
    categories: Object.fromEntries(NOTIFICATION_CATEGORIES.map(category => [category.id, category.defaultOn])),
    quietHours: { ...QUIET_HOURS },
    marketingConsent: {
      granted: false,
      version: NOTIFICATION_CONSENT_VERSION,
      consentedAt: null,
      revokedAt: null
    },
    savedAt: null,
    scope: 'this-device'
  };
}

export function normalizeNotificationPreferences(source = {}) {
  const defaults = defaultNotificationPreferences();
  const sourceCategories = source?.categories;
  const categories = { ...defaults.categories };

  if (Array.isArray(sourceCategories)) {
    Object.keys(categories).forEach(id => { categories[id] = false; });
    for (const value of sourceCategories) {
      const id = oldCategoryIds[value] || String(value || '').replaceAll('-', '_');
      if (categoryMap.has(id)) categories[id] = true;
    }
  } else if (sourceCategories && typeof sourceCategories === 'object') {
    for (const category of NOTIFICATION_CATEGORIES) {
      categories[category.id] = boolean(sourceCategories[category.id], category.defaultOn);
    }
  }

  for (const category of NOTIFICATION_CATEGORIES) {
    if (category.essential) categories[category.id] = true;
  }

  const v8Marketing = source.news === true;
  categories.daily_card = boolean(source.daily, categories.daily_card);
  categories.school = boolean(source.school, categories.school);
  categories.account_security = true;
  if (source.news !== undefined) {
    categories.marketing = v8Marketing;
    categories.skins = v8Marketing;
  }

  const marketingGranted = boolean(source?.marketingConsent?.granted, categories.marketing === true);
  categories.marketing = marketingGranted;

  return {
    schema: NOTIFICATION_VERSION,
    enabled: boolean(source.enabled, false),
    categories,
    quietHours: {
      enabled: boolean(source?.quietHours?.enabled, boolean(source.quiet, true)),
      start: validTime(source?.quietHours?.start, QUIET_HOURS.start),
      end: validTime(source?.quietHours?.end, QUIET_HOURS.end),
      timeZone: QUIET_HOURS.timeZone
    },
    marketingConsent: {
      granted: marketingGranted,
      version: NOTIFICATION_CONSENT_VERSION,
      consentedAt: source?.marketingConsent?.consentedAt || null,
      revokedAt: source?.marketingConsent?.revokedAt || null
    },
    savedAt: source.savedAt || null,
    scope: 'this-device'
  };
}

const minutesFromTime = value => {
  const [hour, minute] = validTime(value, '00:00').split(':').map(Number);
  return hour * 60 + minute;
};

export function isQuietTime(date = new Date(), quietHours = QUIET_HOURS) {
  if (quietHours?.enabled === false) return false;
  const parts = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: QUIET_HOURS.timeZone
  }).formatToParts(date);
  const hour = Number(parts.find(part => part.type === 'hour')?.value || 0) % 24;
  const minute = Number(parts.find(part => part.type === 'minute')?.value || 0);
  const now = hour * 60 + minute;
  const start = minutesFromTime(quietHours?.start || QUIET_HOURS.start);
  const end = minutesFromTime(quietHours?.end || QUIET_HOURS.end);
  return start === end || (start > end ? now >= start || now < end : now >= start && now < end);
}
