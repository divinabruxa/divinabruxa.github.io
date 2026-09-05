/* DIVINA BRUXA — POLÍTICA DA ORBE IA CELESTIAL V141
   Contexto mínimo, consentimento explícito e nenhuma autoridade offline. */

export const AI_HISTORY_KEY = 'whit-history';
export const AI_DRAFT_KEY = 'whit-draft-v141';
export const AI_SETTINGS_KEY = 'whit-settings-v141';
export const AI_LEDGER_KEY = 'ai-credit-ledger-v141';
export const AI_TAROT_SELECTION_KEY = 'ai-tarot-selection-v141';
export const AI_SCHEMA_VERSION = '7.0.0';

export const AI_POLICY = Object.freeze({
  schemaVersion: AI_SCHEMA_VERSION,
  demoCredits: 400,
  subscription: Object.freeze({ priceBRL: 89.90, credits: 400, cycle: 'mensal' }),
  modes: Object.freeze({
    support: Object.freeze({ id: 'support', planet: 'Luna', label: 'Acolhimento e reflexão', cost: 1, enabled: true, sigil: '☾' }),
    tarot: Object.freeze({ id: 'tarot', planet: 'Terra', label: 'Tarot e símbolos', cost: 10, enabled: true, sigil: '◇' }),
    channel: Object.freeze({ id: 'channel', planet: 'Luna', label: 'Canalização simbólica', cost: 1, enabled: true, sigil: '◐' }),
    sol: Object.freeze({ id: 'sol', planet: 'Sol', label: 'Expansão profunda', cost: 0, enabled: false, sigil: '☉' })
  }),
  packs: Object.freeze([
    Object.freeze({ credits: 200, priceBRL: 39.90 }),
    Object.freeze({ credits: 600, priceBRL: 99.90 }),
    Object.freeze({ credits: 1500, priceBRL: 199.90 })
  ]),
  limits: Object.freeze({ requestsPerMinute: 6, dailyCredits: 100, maxMessageCharacters: 5000, maxContextMessages: 12, maxContextCharacters: 24000, historyMessages: 40, timeoutMs: 30000 }),
  controls: Object.freeze({ killSwitch: true, extraCreditConfirmation: true, solEnabled: false, webSearchEnabled: false }),
  privacy: Object.freeze({ diaryRequiresConsent: true, diaryScope: 'single-entry', analyticsReceiveText: false, adminReceivesText: false, promptLogs: 'sanitized', historyLocalOnly: true }),
  requiresSubscription: true,
  requiresConsent: true,
  apiKeyLocation: 'server-only',
  thirdPartyMindReading: false,
  identityClaims: false
});

const clean = (value, limit) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, limit);
const validTime = value => {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};
const createId = prefix => globalThis.crypto?.randomUUID
  ? `${prefix}-${crypto.randomUUID()}`
  : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export function aiDisclosure(mode) {
  return mode === 'channel'
    ? 'Canalização simbólica é uma dramatização ficcional. Não é a pessoa real e não acessa pensamentos, memórias privadas ou mensagens espirituais.'
    : 'As respostas são geradas por IA para reflexão e não substituem ajuda médica, jurídica, financeira ou psicológica.';
}

export function createAIMessage(role, content, metadata = {}) {
  const safeRole = role === 'user' ? 'user' : 'assistant';
  return Object.freeze({
    id: clean(metadata.id, 160) || createId('message'),
    role: safeRole,
    content: clean(content, AI_POLICY.limits.maxMessageCharacters),
    mode: AI_POLICY.modes[metadata.mode]?.enabled !== false && AI_POLICY.modes[metadata.mode] ? metadata.mode : null,
    at: validTime(metadata.at)
  });
}

export function normalizeAIHistory(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.map(message => createAIMessage(message?.role, message?.content, message)).filter(message => {
    if (!message.content || seen.has(message.id)) return false;
    seen.add(message.id);
    return true;
  }).slice(-AI_POLICY.limits.historyMessages);
}

export function compactAIContext(history) {
  const normalized = normalizeAIHistory(history);
  const selected = [];
  let characters = 0;
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const message = normalized[index];
    if (selected.length >= AI_POLICY.limits.maxContextMessages) break;
    if (characters + message.content.length > AI_POLICY.limits.maxContextCharacters) break;
    characters += message.content.length;
    selected.unshift({ role: message.role, content: message.content });
  }
  return selected;
}

export function normalizeTarotContext(value) {
  if (!value || value.consentScope !== 'single-spread' || !Array.isArray(value.positions)) return null;
  const positions = value.positions.slice(0, 12).map(item => {
    const cardId = Number(item?.cardId);
    if (!Number.isInteger(cardId) || cardId < 0 || cardId >= 78) return null;
    return Object.freeze({ position: clean(item.position, 100), cardId, cardName: clean(item.cardName, 120), orientation: 'normal' });
  }).filter(Boolean);
  if (!positions.length) return null;
  return Object.freeze({
    source: 'spread',
    spreadId: clean(value.spreadId, 100),
    spreadName: clean(value.spreadName, 120),
    question: clean(value.question, 600),
    consentScope: 'single-spread',
    positions: Object.freeze(positions)
  });
}

export function createAIRequest({ history = [], mode = 'support', persona = '', message = '', tarotContext = null } = {}) {
  const selectedMode = AI_POLICY.modes[mode]?.enabled ? mode : 'support';
  return Object.freeze({
    requestId: createId('orbe'),
    schemaVersion: AI_SCHEMA_VERSION,
    mode: selectedMode,
    persona: selectedMode === 'channel' ? clean(persona, 100) || null : null,
    message: clean(message, AI_POLICY.limits.maxMessageCharacters),
    history: compactAIContext(history),
    tarotContext: normalizeTarotContext(tarotContext),
    consent: true,
    disclosure: aiDisclosure(selectedMode),
    capabilities: Object.freeze({ webSearch: false, diaryScope: 'single-entry' }),
    optimization: Object.freeze({ compactContext: true, promptCacheEligible: true })
  });
}

export function privateAIExport(history) {
  return {
    project: 'Divina Bruxa',
    kind: 'private-ai-conversation-portability-copy',
    exportedAt: new Date().toISOString(),
    private: true,
    entries: normalizeAIHistory(history)
  };
}
