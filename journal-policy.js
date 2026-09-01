export const JOURNAL_STORAGE_KEY = 'journal';
export const JOURNAL_DRAFT_KEY = 'journal-draft-v5';
export const JOURNAL_SCHEMA_VERSION = '5.0.1';

export function createJournalEntry(input = {}) {
  const now = new Date().toISOString();
  return {
    id: input.id || crypto.randomUUID(), schemaVersion:JOURNAL_SCHEMA_VERSION,
    title:String(input.title || 'Memória da Orbe').trim().slice(0,120),
    text:String(input.text || '').trim().slice(0,12000), question:String(input.question || '').trim().slice(0,500),
    mood:String(input.mood || 'Reflexiva').trim().slice(0,60), tags:String(input.tags || '').trim().slice(0,300),
    relationships:String(input.relationships || '').trim().slice(0,300), type:String(input.type || 'note'),
    cardId:Number.isInteger(input.cardId) ? input.cardId : null,
    cardIds:Array.isArray(input.cardIds) ? [...new Set(input.cardIds.filter(id => Number.isInteger(id) && id >= 0 && id < 78))] : [],
    orientation:'normal', favorite:Boolean(input.favorite), createdAt:input.createdAt || input.date || now, updatedAt:now, private:true
  };
}

export function normalizeJournalEntries(value) {
  return Array.isArray(value) ? value.map(entry => createJournalEntry(entry)).filter(entry => entry.text || entry.cardId !== null || entry.cardIds.length) : [];
}

export function publicMirrorData(entries) {
  return entries.map(entry => ({ mood:entry.mood, type:entry.type, cardId:entry.cardId, cardIds:entry.cardIds, createdAt:entry.createdAt, favorite:entry.favorite }));
}
