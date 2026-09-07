/* DIVINA BRUXA — POLÍTICA DO DIÁRIO E ESPELHO CELESTIAL V187
   Memória privada local, portabilidade verificável e consentimento por entrada. */

export const JOURNAL_STORAGE_KEY = 'journal';
export const JOURNAL_DRAFT_KEY = 'journal-draft-v5';
export const JOURNAL_VIEW_KEY = 'journal-view-v140';
export const JOURNAL_AI_SELECTION_KEY = 'journal-ai-selection-v140';
export const JOURNAL_SCHEMA_VERSION = '7.0.0';
export const JOURNAL_BACKUP_KIND = 'private-journal-portability-copy';
export const JOURNAL_MAX_ENTRIES = 2000;
export const JOURNAL_MAX_REVISIONS = 30;

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

const dateOnly = value => {
  const raw = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) && !Number.isNaN(new Date(`${raw}T12:00:00`).getTime()) ? raw : '';
};

const createId = prefix => {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const text = (value, limit) => String(value ?? '').trim().slice(0, limit);
const uniqueText = (value, limit = 12) => [...new Set(
  (Array.isArray(value) ? value : []).map(item => text(item, 160)).filter(Boolean)
)].slice(0, limit);

export const normalizeJournalText = value => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

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

const normalizeRevision = value => {
  const body = text(value?.text, 3000);
  if (!body) return null;
  const now = new Date().toISOString();
  return Object.freeze({
    id: text(value?.id, 160) || createId('revision'),
    text: body,
    createdAt: validDate(value?.createdAt, now)
  });
};

export function createJournalEntry(input = {}) {
  const now = new Date().toISOString();
  const type = JOURNAL_TYPES.some(item => item.id === input.type) ? input.type : 'note';
  const numericCardId = typeof input.cardId === 'string' && input.cardId !== '' ? Number(input.cardId) : input.cardId;
  const cardId = Number.isInteger(numericCardId) && numericCardId >= 0 && numericCardId < 78 ? numericCardId : null;
  const cardIds = Array.isArray(input.cardIds)
    ? [...new Set(input.cardIds.map(Number).filter(id => Number.isInteger(id) && id >= 0 && id < 78))].slice(0, 78)
    : [];
  const id = text(input.id, 160) || createId('journal');
  const revisions = (Array.isArray(input.revisions) ? input.revisions : [])
    .map(normalizeRevision).filter(Boolean).slice(-JOURNAL_MAX_REVISIONS);
  return {
    id,
    schemaVersion: JOURNAL_SCHEMA_VERSION,
    title: text(input.title || 'Memória da Orbe', 120),
    text: text(input.text, 16000),
    question: text(input.question, 600),
    mood: JOURNAL_MOODS.includes(input.mood) ? input.mood : 'Reflexiva',
    tags: splitJournalTags(input.tags).join(', '),
    collection: text(input.collection, 80),
    relationships: text(input.relationships, 300),
    relatedLesson: text(input.relatedLesson, 180),
    reviewDate: dateOnly(input.reviewDate),
    revisions,
    linkedEntryIds: uniqueText(input.linkedEntryIds).filter(linkedId => linkedId !== id),
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
  const entries = value.slice(0, JOURNAL_MAX_ENTRIES).map(entry => createJournalEntry(entry)).filter(entry => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return Boolean(entry.text || entry.question || entry.cardId !== null || entry.cardIds.length || entry.relatedLesson || entry.revisions.length);
  });
  const ids = new Set(entries.map(entry => entry.id));
  return entries.map(entry => ({
    ...entry,
    linkedEntryIds: entry.linkedEntryIds.filter(id => ids.has(id) && id !== entry.id)
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function appendJournalRevision(entry, revisionText, createdAt = new Date().toISOString()) {
  const revision = normalizeRevision({ text: revisionText, createdAt });
  if (!revision) return createJournalEntry(entry);
  return createJournalEntry({
    ...entry,
    revisions: [...(entry?.revisions || []), revision],
    updatedAt: new Date().toISOString()
  });
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

export function localMirrorData(entries, today = journalDateKey(new Date())) {
  const typeCounts = {};
  const moodCounts = {};
  const cardCounts = {};
  const dayCounts = {};
  const tagCounts = {};
  let favorites = 0;
  let revisions = 0;
  let linked = 0;
  let reviewsDue = 0;
  entries.forEach(entry => {
    typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    dayCounts[journalDateKey(entry.createdAt)] = (dayCounts[journalDateKey(entry.createdAt)] || 0) + 1;
    entryCardIds(entry).forEach(id => { cardCounts[id] = (cardCounts[id] || 0) + 1; });
    splitJournalTags(entry.tags).forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
    if (entry.favorite) favorites += 1;
    revisions += entry.revisions.length;
    linked += entry.linkedEntryIds.length;
    if (entry.reviewDate && entry.reviewDate <= today && !entry.revisions.length) reviewsDue += 1;
  });
  return Object.freeze({
    total: entries.length,
    favorites,
    revisions,
    linked,
    reviewsDue,
    typeCounts: Object.freeze(typeCounts),
    moodCounts: Object.freeze(moodCounts),
    cardCounts: Object.freeze(cardCounts),
    dayCounts: Object.freeze(dayCounts),
    tagCounts: Object.freeze(tagCounts)
  });
}

export const publicMirrorData = localMirrorData;

export function privateJournalExport(entries) {
  return {
    project: 'Divina Bruxa',
    kind: JOURNAL_BACKUP_KIND,
    schemaVersion: JOURNAL_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    private: true,
    includesPrivateText: true,
    orientation: 'normal',
    syncState: 'local-only',
    entries: normalizeJournalEntries(entries)
  };
}

export function normalizeJournalBackup(value) {
  if (!value || typeof value !== 'object' || value.kind !== JOURNAL_BACKUP_KIND || !Array.isArray(value.entries)) return null;
  if (value.entries.length > JOURNAL_MAX_ENTRIES) return null;
  return Object.freeze({
    exportedAt: validDate(value.exportedAt, new Date().toISOString()),
    entries: normalizeJournalEntries(value.entries)
  });
}

export function mergeJournalEntries(activeEntries, importedEntries) {
  const imported = (Array.isArray(importedEntries) ? importedEntries : []).slice(0, JOURNAL_MAX_ENTRIES).map(createJournalEntry);
  const activeList = (Array.isArray(activeEntries) ? activeEntries : []).slice(0, JOURNAL_MAX_ENTRIES).map(createJournalEntry);
  const merged = new Map(imported.map(entry => [entry.id, entry]));
  activeList.forEach(active => {
    const imported = merged.get(active.id);
    if (!imported || new Date(active.updatedAt) >= new Date(imported.updatedAt)) merged.set(active.id, active);
  });
  return normalizeJournalEntries([...merged.values()]);
}

export function createJournalAISelection(entry, cardNames = []) {
  const normalized = createJournalEntry(entry);
  if (!normalized.text) return null;
  return Object.freeze({
    id: normalized.id,
    title: normalized.title,
    text: normalized.text.slice(0, 4200),
    question: normalized.question,
    tags: normalized.tags,
    cards: uniqueText(cardNames, 78),
    selectedAt: new Date().toISOString(),
    consentScope: 'single-entry',
    private: true,
    orientation: 'normal',
    excludes: Object.freeze(['otherEntries', 'draft', 'relationships', 'revisions', 'mood', 'favorites'])
  });
}

export function normalizeJournalAISelection(value) {
  if (!value || value.consentScope !== 'single-entry' || typeof value.text !== 'string') return null;
  const textValue = text(value.text, 4200);
  if (!textValue) return null;
  return Object.freeze({
    id: text(value.id, 160),
    title: text(value.title || 'Memória da Orbe', 120),
    text: textValue,
    question: text(value.question, 600),
    tags: splitJournalTags(value.tags).join(', '),
    cards: uniqueText(value.cards, 78),
    selectedAt: validDate(value.selectedAt, new Date().toISOString()),
    consentScope: 'single-entry',
    private: true,
    orientation: 'normal',
    excludes: Object.freeze(['otherEntries', 'draft', 'relationships', 'revisions', 'mood', 'favorites'])
  });
}
