/* DIVINA BRUXA — POLÍTICA DO DIÁRIO E ESPELHO CELESTIAL V140
   Texto privado, orientação direta e memória local sem perda silenciosa. */

export const JOURNAL_STORAGE_KEY = 'journal';
export const JOURNAL_DRAFT_KEY = 'journal-draft-v5';
export const JOURNAL_VIEW_KEY = 'journal-view-v140';
export const JOURNAL_AI_SELECTION_KEY = 'journal-ai-selection-v140';
export const JOURNAL_SCHEMA_VERSION = '6.0.0';

export const JOURNAL_PERIODS = Object.freeze([
  Object.freeze({ id: '7', label: '7 dias', days: 7 }),
  Object.freeze({ id: '30', label: '30 dias', days: 30 }),
  Object.freeze({ id: '90', label: '90 dias', days: 90 }),
  Object.freeze({ id: '365', label: '1 ano', days: 365 }),
  Object.freeze({ id: 'all', label: 'Todo período', days: null })
]);

export const JOURNAL_TYPES = Object.freeze([
  Object.freeze({ id: 'note', label: 'Reflexão livre' }),
  Object.freeze({ id: 'daily', label: 'Carta do Dia' }),
  Object.freeze({ id: 'spread', label: 'Tiragem' }),
  Object.freeze({ id: 'lesson', label: 'Aula da Escola' })
]);

export const JOURNAL_MOODS = Object.freeze([
  'Em paz', 'Curiosa', 'Confiante', 'Em dúvida', 'Ansiosa', 'Em transformação', 'Reflexiva'
]);

const validDate = (value, fallback) => {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `journal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const text = (value, limit) => String(value ?? '').trim().slice(0, limit);

export const splitJournalTags = value => [...new Set(
  String(value ?? '').split(',').map(tag => tag.trim()).filter(Boolean)
)].slice(0, 12).map(tag => tag.slice(0, 36));

export const entryCardIds = entry => [...new Set([
  Number.isInteger(entry?.cardId) ? entry.cardId : null,
  ...(Array.isArray(entry?.cardIds) ? entry.cardIds : [])
].filter(id => Number.isInteger(id) && id >= 0 && id < 78))];

export const journalDateKey = value => {
  const date = new Date(validDate(value, new Date().toISOString()));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function createJournalEntry(input = {}) {
  const now = new Date().toISOString();
  const type = JOURNAL_TYPES.some(item => item.id === input.type) ? input.type : 'note';
  const numericCardId = typeof input.cardId === 'string' && input.cardId !== '' ? Number(input.cardId) : input.cardId;
  const cardId = Number.isInteger(numericCardId) && numericCardId >= 0 && numericCardId < 78 ? numericCardId : null;
  const cardIds = Array.isArray(input.cardIds)
    ? [...new Set(input.cardIds.filter(id => Number.isInteger(id) && id >= 0 && id < 78))]
    : [];
  return {
    id: text(input.id, 160) || createId(),
    schemaVersion: JOURNAL_SCHEMA_VERSION,
    title: text(input.title || 'Memória da Orbe', 120),
    text: text(input.text, 16000),
    question: text(input.question, 600),
    mood: text(input.mood || 'Reflexiva', 60),
    tags: splitJournalTags(input.tags).join(', '),
    collection: text(input.collection, 80),
    relationships: text(input.relationships, 300),
    relatedLesson: text(input.relatedLesson, 180),
    type,
    cardId,
    cardIds,
    orientation: 'normal',
    favorite: Boolean(input.favorite),
    status: 'saved',
    createdAt: validDate(input.createdAt || input.date, now),
    updatedAt: validDate(input.updatedAt, now),
    private: true,
    syncState: 'local-only'
  };
}

export function normalizeJournalEntries(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.map(entry => createJournalEntry(entry)).filter(entry => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return Boolean(entry.text || entry.question || entry.cardId !== null || entry.cardIds.length || entry.relatedLesson);
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function entriesForJournalPeriod(entries, period = '30', now = new Date()) {
  const option = JOURNAL_PERIODS.find(item => item.id === String(period)) || JOURNAL_PERIODS[1];
  if (!option.days) return [...entries];
  const limit = new Date(now);
  limit.setHours(23, 59, 59, 999);
  limit.setDate(limit.getDate() - option.days + 1);
  limit.setHours(0, 0, 0, 0);
  return entries.filter(entry => new Date(entry.createdAt) >= limit);
}

export function calendarJournalCounts(entries, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return entries.reduce((counts, entry) => {
    const key = journalDateKey(entry.createdAt);
    if (key.startsWith(prefix)) counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

export function publicMirrorData(entries) {
  const typeCounts = {};
  const moodCounts = {};
  const cardCounts = {};
  const dayCounts = {};
  let favorites = 0;
  entries.forEach(entry => {
    typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    dayCounts[journalDateKey(entry.createdAt)] = (dayCounts[journalDateKey(entry.createdAt)] || 0) + 1;
    entryCardIds(entry).forEach(id => { cardCounts[id] = (cardCounts[id] || 0) + 1; });
    if (entry.favorite) favorites += 1;
  });
  return Object.freeze({
    total: entries.length,
    favorites,
    typeCounts: Object.freeze(typeCounts),
    moodCounts: Object.freeze(moodCounts),
    cardCounts: Object.freeze(cardCounts),
    dayCounts: Object.freeze(dayCounts)
  });
}

export function privateJournalExport(entries) {
  return {
    project: 'Divina Bruxa',
    kind: 'private-journal-portability-copy',
    exportedAt: new Date().toISOString(),
    private: true,
    orientation: 'normal',
    entries: normalizeJournalEntries(entries)
  };
}
