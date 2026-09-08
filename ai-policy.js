/* DIVINA BRUXA — POLÍTICA DA ORBE IA GOVERNADA V190
   Contexto mínimo, consentimento explícito e autoridade integral do servidor. */

export const AI_HISTORY_KEY = 'whit-history';
export const AI_DRAFT_KEY = 'whit-draft-v190';
export const AI_SETTINGS_KEY = 'whit-settings-v190';
export const AI_LEDGER_KEY = 'ai-server-snapshot-v190';
export const AI_TAROT_SELECTION_KEY = 'ai-tarot-selection-v141';
export const AI_SCHEMA_VERSION = '8.0.0';

export const AI_POLICY = Object.freeze({
  release: 'V190',
  schemaVersion: AI_SCHEMA_VERSION,
  demoCredits: 3,
  subscription: Object.freeze({ priceBRL: 89.90, credits: 400, cycle: 'mensal', billingEnabled: false }),
  modes: Object.freeze({
    luna: Object.freeze({ id:'luna', planet:'Luna', label:'Acolhimento objetivo', description:'Reflete o que você trouxe e propõe uma pergunta ou pequena ação observável.', cost:1, enabled:true, sigil:'☾' }),
    terra: Object.freeze({ id:'terra', planet:'Terra', label:'Integração profunda', description:'Organiza símbolos, tensões, possibilidades e integração prática com mais estrutura.', cost:10, enabled:true, sigil:'◇' }),
    sol: Object.freeze({ id:'sol', planet:'Sol', label:'Expansão avançada', description:'Reservada para uma etapa futura e sem rota de servidor nesta versão.', cost:0, enabled:false, sigil:'☉' })
  }),
  focuses: Object.freeze({
    reflection: Object.freeze({ id:'reflection', label:'Reflexão e acolhimento' }),
    tarot: Object.freeze({ id:'tarot', label:'Tarot e símbolos' }),
    school: Object.freeze({ id:'school', label:'Tutoria da Escola' }),
    'symbolic-persona': Object.freeze({ id:'symbolic-persona', label:'Dramatização simbólica ficcional' })
  }),
  packs: Object.freeze([
    Object.freeze({ credits:200, priceBRL:39.90, enabled:false }),
    Object.freeze({ credits:600, priceBRL:99.90, enabled:false }),
    Object.freeze({ credits:1500, priceBRL:199.90, enabled:false })
  ]),
  limits: Object.freeze({ requestsPerMinute:6, dailyCredits:100, maxMessageCharacters:5000, maxContextMessages:12, maxContextCharacters:24000, historyMessages:40, timeoutMs:50000 }),
  controls: Object.freeze({ killSwitch:true, extraCreditConfirmation:true, solEnabled:false, webSearchEnabled:false, billingEnabled:false, serverLedger:true }),
  privacy: Object.freeze({ diaryRequiresConsent:true, diaryScope:'single-entry', analyticsReceiveText:false, adminReceivesText:false, ledgerReceivesText:false, serverConversationHistory:false, providerApplicationState:false, historyLocalOnly:true }),
  requiresAccount:true,
  requiresVerifiedEmail:true,
  requiresConsent:true,
  apiKeyLocation:'server-only',
  thirdPartyMindReading:false,
  identityClaims:false
});

const clean = (value, limit) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, limit);
const validTime = value => {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};
const uuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const values = globalThis.crypto?.getRandomValues ? globalThis.crypto.getRandomValues(new Uint8Array(16)) : Array.from({ length:16 }, () => Math.floor(Math.random() * 256));
  values[6] = (values[6] & 15) | 64;
  values[8] = (values[8] & 63) | 128;
  const hex = Array.from(values, value => Number(value).toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};

export function aiDisclosure(mode = 'luna') {
  if (mode === 'terra') return 'Terra oferece uma análise mais estruturada, mas continua sendo IA simbólica: não prevê o futuro nem acessa dados que você não enviou.';
  if (mode === 'sol') return 'Sol está desligado e não consome créditos.';
  return 'Luna gera linguagem para reflexão. Não é pessoa, consciência ou médium e não substitui ajuda profissional.';
}

export function createAIMessage(role, content, metadata = {}) {
  const safeRole = role === 'user' ? 'user' : 'assistant';
  const legacyModes = { support:'luna', tarot:'terra', channel:'luna' };
  const mode = legacyModes[metadata.mode] || metadata.mode;
  return Object.freeze({
    id:clean(metadata.id, 160) || `message-${uuid()}`,
    role:safeRole,
    content:clean(content, 12000),
    mode:AI_POLICY.modes[mode] ? mode : null,
    at:validTime(metadata.at),
    safetyIntercepted:metadata.safetyIntercepted === true
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
    selected.unshift({ role:message.role, content:message.content.slice(0, 3000) });
  }
  return selected;
}

export function normalizeTarotContext(value) {
  if (!value || value.consentScope !== 'single-spread' || !Array.isArray(value.positions)) return null;
  const seen = new Set();
  const positions = value.positions.slice(0, 12).map(item => {
    const cardId = Number(item?.cardId);
    if (!Number.isInteger(cardId) || cardId < 0 || cardId >= 78 || seen.has(cardId)) return null;
    seen.add(cardId);
    return Object.freeze({ position:clean(item.position, 100), cardId, cardName:clean(item.cardName, 120), orientation:'normal' });
  }).filter(item => item?.position);
  if (!positions.length) return null;
  return Object.freeze({
    source:'spread',
    spreadId:clean(value.spreadId, 100),
    spreadName:clean(value.spreadName, 120),
    question:clean(value.question, 600),
    consentScope:'single-spread',
    positions:Object.freeze(positions)
  });
}

export function createAIRequest({ history = [], mode = 'luna', focus = 'reflection', source = 'message', message = '', tarotContext = null, confirmExtra = false } = {}) {
  const selectedMode = AI_POLICY.modes[mode]?.enabled ? mode : 'luna';
  const selectedFocus = AI_POLICY.focuses[focus] ? focus : 'reflection';
  const allowedSources = new Set(['message','journal-single-entry','tarot-single-spread','school-single-lesson']);
  const selectedSource = allowedSources.has(source) ? source : 'message';
  return Object.freeze({
    requestId:uuid(),
    schemaVersion:AI_SCHEMA_VERSION,
    mode:selectedMode,
    focus:selectedFocus,
    source:selectedSource,
    message:clean(message, AI_POLICY.limits.maxMessageCharacters),
    history:compactAIContext(history),
    tarotContext:selectedSource === 'tarot-single-spread' ? normalizeTarotContext(tarotContext) : null,
    journalConsentScope:selectedSource === 'journal-single-entry' ? 'single-entry' : null,
    confirmExtra:confirmExtra === true,
    consent:true,
    disclosure:aiDisclosure(selectedMode),
    capabilities:Object.freeze({ webSearch:false, diaryScope:'single-entry', serverConversationHistory:false })
  });
}

export function privateAIExport(history) {
  return {
    project:'Divina Bruxa',
    release:'V190',
    kind:'private-ai-conversation-portability-copy',
    exportedAt:new Date().toISOString(),
    private:true,
    notice:'Esta cópia foi criada a partir do histórico guardado somente neste aparelho.',
    entries:normalizeAIHistory(history)
  };
}
