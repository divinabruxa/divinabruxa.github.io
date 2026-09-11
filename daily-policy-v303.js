/* DIVINA BRUXA 2.0 — REBIRTH R004 · CARTA DO DIA · CONTRATO V303
   Um encontro por dia de Brasília. Conta = autoridade do servidor.
   Sem conta = identidade estável deste dispositivo. Conta = autoridade do servidor; offline só reutiliza revelação confirmada. Nunca invertida. */
export const DAILY_TIME_ZONE = 'America/Sao_Paulo';
export const DAILY_STORAGE_KEY = 'daily';
export const DAILY_DEVICE_KEY = 'daily-device-v303';
export const DAILY_SCHEMA_VERSION = '11.0.0';
export const DAILY_SELECTION_VERSION = 'rebirth-device-v303';
export const DAILY_ACCOUNT_SELECTION_VERSION = 'account-authority-v189';
export const DAILY_CARD_COUNT = 78;
export const DAILY_MAX_INTENTION_LENGTH = 120;

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAILY_TIME_ZONE, year:'numeric', month:'2-digit', day:'2-digit'
});

const positiveModulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

export function brasiliaDate(now = new Date()) {
  const parts = Object.fromEntries(DATE_FORMATTER.formatToParts(now).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function nextBrasiliaBoundary(now = new Date()) {
  const start = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const current = brasiliaDate(new Date(start));
  let low = start, high = start + 30 * 60 * 60 * 1000;
  while (brasiliaDate(new Date(high)) === current) high += 6 * 60 * 60 * 1000;
  while (high - low > 1000) {
    const middle = Math.floor((low + high) / 2);
    if (brasiliaDate(new Date(middle)) === current) low = middle; else high = middle;
  }
  return new Date(high);
}

export function stableDailyDigest(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const makeDeviceSeed = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint32Array(4);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(8, '0')).join('-');
  }
  return `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export function deviceDailyIdentity() {
  let seed = '';
  try {
    seed = localStorage.getItem(DAILY_DEVICE_KEY) || '';
    if (!seed) {
      seed = makeDeviceSeed();
      localStorage.setItem(DAILY_DEVICE_KEY, seed);
    }
  } catch {
    seed = 'ephemeral-device';
  }
  return Object.freeze({ scope:'device', digest:stableDailyDigest(`divina-bruxa:device:${seed}:v303`) });
}

const identityFrom = value => {
  if (value && typeof value === 'object' && /^(device|account)$/.test(value.scope) && /^[a-f0-9]{8}$/.test(value.digest || '')) {
    return Object.freeze({ scope:value.scope, digest:value.digest });
  }
  const raw = String(value || 'device').trim().toLocaleLowerCase('pt-BR');
  return Object.freeze({
    scope:raw.startsWith('account:') ? 'account' : 'device',
    digest:stableDailyDigest(`divina-bruxa:${raw}:v303`)
  });
};

export async function resolveDailyIdentity(authClient) {
  const device = deviceDailyIdentity();
  if (globalThis.navigator?.onLine === false || !authClient?.enabled || typeof authClient.account !== 'function') return device;
  try {
    const response = await authClient.account();
    const body = response?.body || {};
    const identifier = body.user?.id || body.profile?.id || body.account?.id || body.userId || body.id || body.user?.email || body.email;
    if (!response?.ok || !identifier) return device;
    return identityFrom(`account:${String(identifier).trim()}`);
  } catch {
    return device;
  }
}

export function dailyCardIndex(date = brasiliaDate(), identity = deviceDailyIdentity()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Data diária inválida.');
  const [year, month, day] = date.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (utcDate.getUTCFullYear() !== year || utcDate.getUTCMonth() !== month - 1 || utcDate.getUTCDate() !== day) {
    throw new TypeError('Data diária inválida.');
  }
  const dayNumber = Math.floor(utcDate.getTime() / 86400000);
  const normalized = identityFrom(identity);
  const offset = Number.parseInt(normalized.digest, 16) % DAILY_CARD_COUNT;
  return positiveModulo(dayNumber * 37 + offset, DAILY_CARD_COUNT);
}

export function normalizeDailyIntention(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, DAILY_MAX_INTENTION_LENGTH);
}

export function createDailyRecord(intention = '', now = new Date(), identity = deviceDailyIdentity()) {
  const date = brasiliaDate(now);
  const normalized = identityFrom(identity);
  return Object.freeze({
    date,
    id:dailyCardIndex(date, normalized),
    orientation:'normal',
    reversed:false,
    intention:normalizeDailyIntention(intention),
    revealedAt:now.toISOString(),
    timeZone:DAILY_TIME_ZONE,
    schemaVersion:DAILY_SCHEMA_VERSION,
    selectionVersion:DAILY_SELECTION_VERSION,
    identityScope:normalized.scope,
    identityDigest:normalized.digest,
    source:normalized.scope === 'device' ? 'device' : 'deterministic-account'
  });
}

function validServerDate(value) {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function createAccountDailyRecord(value = {}, intention = '') {
  const date = String(value.local_date || value.date || '');
  const id = Number(value.card_id ?? value.cardIndex);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(id) || id < 0 || id >= DAILY_CARD_COUNT) {
    throw new TypeError('Carta da conta inválida.');
  }
  return Object.freeze({
    date, id,
    orientation:'normal', reversed:false,
    intention:normalizeDailyIntention(intention),
    revealedAt:validServerDate(value.revealed_at || value.createdAt),
    timeZone:DAILY_TIME_ZONE,
    schemaVersion:DAILY_SCHEMA_VERSION,
    selectionVersion:DAILY_ACCOUNT_SELECTION_VERSION,
    identityScope:'account',
    identityDigest:stableDailyDigest('divina-bruxa:account-authority:v189'),
    source:'supabase-staging'
  });
}

export function isDailyRecord(value, date = brasiliaDate()) {
  if (!value || value.date !== date || !Number.isInteger(value.id) || value.id < 0 || value.id >= DAILY_CARD_COUNT) return false;
  if (value.reversed === true || (value.orientation && value.orientation !== 'normal')) return false;
  if (value.timeZone !== DAILY_TIME_ZONE) return false;
  if (typeof value.intention !== 'string' || value.intention.length > DAILY_MAX_INTENTION_LENGTH) return false;

  if (value.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION) {
    return value.identityScope === 'account';
  }

  if (value.selectionVersion === DAILY_SELECTION_VERSION) {
    if (!/^(device|account)$/.test(value.identityScope || '') || !/^[a-f0-9]{8}$/.test(value.identityDigest || '')) return false;
    return dailyCardIndex(value.date, { scope:value.identityScope, digest:value.identityDigest }) === value.id;
  }

  /* Compatibilidade: preserva a carta já aberta por versões anteriores até virar o dia. */
  if (/^(deterministic-v183|account-authority-v189)$/.test(String(value.selectionVersion || ''))) return true;
  return false;
}
