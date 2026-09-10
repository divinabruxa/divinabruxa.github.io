/* DIVINA BRUXA — CARTA DO DIA 2.0 · POLÍTICA V216
   Um ciclo por data de Brasília. Conta = autoridade do servidor.
   Visitante = continuidade por dispositivo, sem fingir sincronização universal. */

export const DAILY_TIME_ZONE = 'America/Sao_Paulo';
export const DAILY_STORAGE_KEY = 'daily';
export const DAILY_HISTORY_KEY = 'daily-history-v216';
export const DAILY_DEVICE_KEY = 'divina.daily.device.v216';
export const DAILY_SCHEMA_VERSION = '11.0.0';
export const DAILY_SELECTION_VERSION = 'device-v216';
export const DAILY_ACCOUNT_SELECTION_VERSION = 'account-authority-v216';
export const DAILY_LEGACY_SELECTION_VERSION = 'deterministic-v183';
export const DAILY_LEGACY_ACCOUNT_VERSION = 'account-authority-v189';
export const DAILY_CARD_COUNT = 78;
export const DAILY_HISTORY_LIMIT = 365;

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAILY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const positiveModulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

export function brasiliaDate(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  const parts = Object.fromEntries(
    DATE_FORMATTER.formatToParts(date).map(part => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function nextBrasiliaBoundary(now = new Date()) {
  const start = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const currentDate = brasiliaDate(new Date(start));
  let low = start;
  let high = start + 30 * 60 * 60 * 1000;
  while (brasiliaDate(new Date(high)) === currentDate) high += 6 * 60 * 60 * 1000;
  while (high - low > 1000) {
    const middle = Math.floor((low + high) / 2);
    if (brasiliaDate(new Date(middle)) === currentDate) low = middle;
    else high = middle;
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

const randomSeed = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  }
  return `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const safeStoredSeed = value => {
  const seed = String(value || '').trim();
  return /^[A-Za-z0-9._:-]{12,160}$/.test(seed) ? seed : '';
};

export function deviceDailyIdentity() {
  let seed = '';
  try { seed = safeStoredSeed(globalThis.localStorage?.getItem(DAILY_DEVICE_KEY)); } catch {}
  if (!seed) {
    seed = randomSeed();
    try { globalThis.localStorage?.setItem(DAILY_DEVICE_KEY, seed); } catch {}
  }
  return Object.freeze({
    scope: 'device',
    digest: stableDailyDigest(`divina-bruxa:daily-device:${seed}:v216`)
  });
}

const identityFrom = value => {
  if (value && typeof value === 'object' && /^(device|account|collective)$/.test(value.scope || '') && /^[a-f0-9]{8}$/.test(value.digest || '')) {
    return Object.freeze({ scope:value.scope, digest:value.digest });
  }
  return deviceDailyIdentity();
};

export function dailyCardIndex(date = brasiliaDate(), identity = deviceDailyIdentity()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Data diária inválida.');
  const [year, month, day] = date.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (utcDate.getUTCFullYear() !== year || utcDate.getUTCMonth() !== month - 1 || utcDate.getUTCDate() !== day) {
    throw new TypeError('Data diária inválida.');
  }
  const dayNumber = Math.floor(utcDate.getTime() / 86400000);
  const normalizedIdentity = identityFrom(identity);
  const offset = Number.parseInt(normalizedIdentity.digest, 16) % DAILY_CARD_COUNT;
  return positiveModulo(dayNumber * 37 + offset, DAILY_CARD_COUNT);
}

export function createDeviceDailyRecord(now = new Date(), identity = deviceDailyIdentity()) {
  const date = brasiliaDate(now);
  const normalizedIdentity = identityFrom(identity);
  return Object.freeze({
    date,
    id: dailyCardIndex(date, normalizedIdentity),
    orientation:'normal',
    reversed:false,
    revealedAt:(now instanceof Date ? now : new Date(now)).toISOString(),
    timeZone:DAILY_TIME_ZONE,
    schemaVersion:DAILY_SCHEMA_VERSION,
    selectionVersion:DAILY_SELECTION_VERSION,
    identityScope:'device',
    identityDigest:normalizedIdentity.digest,
    source:'device'
  });
}

const validServerDate = value => {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

export function createAccountDailyRecord(value = {}) {
  const date = String(value.local_date || value.date || '');
  const id = Number(value.card_id ?? value.cardIndex);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(id) || id < 0 || id >= DAILY_CARD_COUNT) {
    throw new TypeError('Carta da conta inválida.');
  }
  return Object.freeze({
    date,
    id,
    orientation:'normal',
    reversed:false,
    revealedAt:validServerDate(value.revealed_at || value.createdAt),
    timeZone:DAILY_TIME_ZONE,
    schemaVersion:DAILY_SCHEMA_VERSION,
    selectionVersion:DAILY_ACCOUNT_SELECTION_VERSION,
    identityScope:'account',
    identityDigest:stableDailyDigest('divina-bruxa:account-authority:v216'),
    source:'supabase-staging'
  });
}

export function isDailyRecord(value, date = brasiliaDate()) {
  if (!value || value.date !== date || !Number.isInteger(value.id) || value.id < 0 || value.id >= DAILY_CARD_COUNT) return false;
  if (value.reversed === true || (value.orientation && value.orientation !== 'normal')) return false;
  if (value.timeZone !== DAILY_TIME_ZONE) return false;

  const version = String(value.selectionVersion || '');
  if (version === DAILY_SELECTION_VERSION) {
    if (value.identityScope !== 'device' || !/^[a-f0-9]{8}$/.test(value.identityDigest || '')) return false;
    if (dailyCardIndex(value.date, { scope:'device', digest:value.identityDigest }) !== value.id) return false;
  } else if (version === DAILY_ACCOUNT_SELECTION_VERSION || version === DAILY_LEGACY_ACCOUNT_VERSION) {
    if (value.identityScope !== 'account') return false;
  } else if (version === DAILY_LEGACY_SELECTION_VERSION) {
    if (!/^(collective|account)$/.test(value.identityScope || '') || !/^[a-f0-9]{8}$/.test(value.identityDigest || '')) return false;
  } else {
    return false;
  }
  return true;
}

export function normalizeDailyHistory(value) {
  if (!Array.isArray(value)) return [];
  const byDate = new Map();
  for (const item of value) {
    const date = String(item?.date || '');
    const id = Number(item?.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(id) || id < 0 || id >= DAILY_CARD_COUNT) continue;
    const record = {
      date,
      id,
      orientation:'normal',
      revealedAt:validServerDate(item?.revealedAt),
      identityScope:item?.identityScope === 'account' ? 'account' : 'device'
    };
    if (!byDate.has(date)) byDate.set(date, record);
  }
  return [...byDate.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, DAILY_HISTORY_LIMIT);
}

export function appendDailyHistory(history, record) {
  if (!record?.date || !Number.isInteger(record?.id)) return normalizeDailyHistory(history);
  return normalizeDailyHistory([
    {
      date:record.date,
      id:record.id,
      orientation:'normal',
      revealedAt:record.revealedAt,
      identityScope:record.identityScope === 'account' ? 'account' : 'device'
    },
    ...normalizeDailyHistory(history)
  ]);
}

export function cycleLabel(date) {
  const [year, month, day] = String(date).split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone:DAILY_TIME_ZONE,
    dateStyle:'long'
  }).format(new Date(Date.UTC(year, month - 1, day, 15)));
}
