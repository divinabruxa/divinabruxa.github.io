/* DIVINA BRUXA — CONTRATO TEMPORAL DA CARTA DO DIA — V183
   Um ciclo por data de Brasília, seleção estável entre aparelhos e orientação sempre direta.
*/
export const DAILY_TIME_ZONE = 'America/Sao_Paulo';
export const DAILY_STORAGE_KEY = 'daily';
export const DAILY_SCHEMA_VERSION = '10.0.0';
export const DAILY_SELECTION_VERSION = 'deterministic-v183';
export const DAILY_CARD_COUNT = 78;
export const DAILY_MAX_INTENTION_LENGTH = 120;

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAILY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const positiveModulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

export function brasiliaDate(now = new Date()) {
  const parts = Object.fromEntries(DATE_FORMATTER.formatToParts(now).map(part => [part.type, part.value]));
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

export function collectiveDailyIdentity() {
  return Object.freeze({ scope: 'collective', digest: stableDailyDigest('divina-bruxa:collective:v183') });
}

const identityFrom = value => {
  if (value && typeof value === 'object' && /^(collective|account)$/.test(value.scope) && /^[a-f0-9]{8}$/.test(value.digest || '')) {
    return Object.freeze({ scope: value.scope, digest: value.digest });
  }
  const raw = String(value || 'collective').trim().toLocaleLowerCase('pt-BR');
  return Object.freeze({ scope: raw === 'collective' ? 'collective' : 'account', digest: stableDailyDigest(`divina-bruxa:${raw}:v183`) });
};

export async function resolveDailyIdentity(authClient) {
  if (globalThis.navigator?.onLine === false || !authClient?.enabled || typeof authClient.account !== 'function') return collectiveDailyIdentity();
  try {
    const response = await authClient.account();
    const body = response?.body || {};
    const identifier = body.user?.id || body.profile?.id || body.account?.id || body.userId || body.id || body.user?.email || body.email;
    if (!response?.ok || !identifier) return collectiveDailyIdentity();
    return identityFrom(`account:${String(identifier).trim()}`);
  } catch {
    return collectiveDailyIdentity();
  }
}

export function dailyCardIndex(date = brasiliaDate(), identity = collectiveDailyIdentity()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Data diária inválida.');
  const [year, month, day] = date.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (utcDate.getUTCFullYear() !== year || utcDate.getUTCMonth() !== month - 1 || utcDate.getUTCDate() !== day) throw new TypeError('Data diária inválida.');
  const dayNumber = Math.floor(utcDate.getTime() / 86400000);
  const normalizedIdentity = identityFrom(identity);
  const offset = Number.parseInt(normalizedIdentity.digest, 16) % DAILY_CARD_COUNT;
  return positiveModulo(dayNumber * 37 + offset, DAILY_CARD_COUNT);
}

export function normalizeDailyIntention(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, DAILY_MAX_INTENTION_LENGTH);
}

export function createDailyRecord(intention = '', now = new Date(), identity = collectiveDailyIdentity()) {
  const date = brasiliaDate(now);
  const normalizedIdentity = identityFrom(identity);
  return Object.freeze({
    date,
    id: dailyCardIndex(date, normalizedIdentity),
    orientation: 'normal',
    reversed: false,
    intention: normalizeDailyIntention(intention),
    revealedAt: now.toISOString(),
    timeZone: DAILY_TIME_ZONE,
    schemaVersion: DAILY_SCHEMA_VERSION,
    selectionVersion: DAILY_SELECTION_VERSION,
    identityScope: normalizedIdentity.scope,
    identityDigest: normalizedIdentity.digest
  });
}

export function isDailyRecord(value, date = brasiliaDate()) {
  if (!value || value.date !== date || !Number.isInteger(value.id) || value.id < 0 || value.id >= DAILY_CARD_COUNT) return false;
  if (value.reversed === true || (value.orientation && value.orientation !== 'normal')) return false;
  if (value.timeZone !== DAILY_TIME_ZONE) return false;
  if (value.selectionVersion === DAILY_SELECTION_VERSION) {
    if (!/^(collective|account)$/.test(value.identityScope || '') || !/^[a-f0-9]{8}$/.test(value.identityDigest || '')) return false;
    if (dailyCardIndex(value.date, { scope: value.identityScope, digest: value.identityDigest }) !== value.id) return false;
  }
  return typeof value.intention === 'string' && value.intention.length <= DAILY_MAX_INTENTION_LENGTH;
}
