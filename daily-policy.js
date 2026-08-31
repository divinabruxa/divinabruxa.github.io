export const DAILY_TIME_ZONE = 'America/Sao_Paulo';
export const DAILY_STORAGE_KEY = 'daily';

export function brasiliaDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: DAILY_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function isDailyRecord(value, date = brasiliaDate()) {
  return Boolean(value && value.date === date && Number.isInteger(value.id) && value.id >= 0 && value.id < 78 && value.reversed !== true);
}

export function secureCardIndex() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] % 78;
}

export function createDailyRecord(intention = '', now = new Date()) {
  return Object.freeze({ date: brasiliaDate(now), id: secureCardIndex(), reversed: false, intention: String(intention).trim().slice(0, 120), revealedAt: now.toISOString(), timeZone: DAILY_TIME_ZONE, schemaVersion: '5.0.1' });
}
