/* DIVINA BRUXA — POLÍTICA DAS TIRAGENS 2.0 V213
   15 métodos, uma única orientação, cartas únicas, sessões retomáveis e Mesa Real 13×6. */

export const SPREAD_RELEASE = 'V213';
export const SPREAD_STORAGE_KEY = 'spread-session-v213';
export const SPREAD_LEGACY_STORAGE_KEYS = Object.freeze(['spread-session-v5']);
export const SPREAD_HISTORY_KEY = 'spread-history-v139';
export const SPREAD_SCHEMA_VERSION = 4;
export const ROYAL_TABLE_COLUMNS = 13;
export const ROYAL_TABLE_ROWS = 6;
export const ROYAL_TABLE_COUNT = ROYAL_TABLE_COLUMNS * ROYAL_TABLE_ROWS;

export const SPREAD_FILTERS = Object.freeze([
  Object.freeze({ id: 'all', label: 'Todas', description: '15 métodos' }),
  Object.freeze({ id: 'quick', label: 'Essenciais', description: '1 a 5 cartas' }),
  Object.freeze({ id: 'themes', label: 'Por tema', description: 'amor, escolhas e vida prática' }),
  Object.freeze({ id: 'deep', label: 'Profundas', description: '10 a 12 posições' }),
  Object.freeze({ id: 'author', label: 'Autoral e Premium', description: 'mesas especiais' })
]);

const freezePositions = positions => Object.freeze(positions.map(position => Object.freeze({ ...position })));
const spread = value => Object.freeze({ premium:false, custom:false, layout:null, tone:null, ...value, positions:freezePositions(value.positions) });
const p = (id, label, short = label) => ({ id, label, short });

export const CUSTOM_POSITIONS = freezePositions([
  p('center', 'Centro da questão'),
  p('origin', 'Origem'),
  p('inner', 'Influência interior'),
  p('outer', 'Influência exterior'),
  p('challenge', 'Desafio'),
  p('resource', 'Recurso disponível'),
  p('awareness', 'O que pede consciência'),
  p('growing', 'O que ganha força'),
  p('releasing', 'O que perde força'),
  p('next-step', 'Próximo passo'),
  p('tendency', 'Tendência'),
  p('synthesis', 'Síntese')
]);

export const CELTIC_CROSS_POSITIONS = freezePositions([
  p('present', 'Situação presente', 'Presente'),
  p('crossing', 'O que cruza ou desafia', 'Desafio'),
  p('foundation', 'Fundamento · raiz inconsciente', 'Fundamento'),
  p('recent-past', 'Passado recente', 'Passado'),
  p('conscious', 'Possibilidade consciente · objetivo', 'Consciência'),
  p('near-future', 'Futuro próximo', 'Futuro'),
  p('self', 'Você diante da questão', 'Você'),
  p('environment', 'Ambiente e influências externas', 'Ambiente'),
  p('hopes-fears', 'Esperanças e medos', 'Esperanças / medos'),
  p('outcome', 'Desfecho e síntese', 'Desfecho')
]);

export const ROYAL_TABLE_POSITIONS = freezePositions(
  Array.from({ length: ROYAL_TABLE_COUNT }, (_, index) => {
    const row = Math.floor(index / ROYAL_TABLE_COLUMNS) + 1;
    const column = (index % ROYAL_TABLE_COLUMNS) + 1;
    return p(`r${row}c${column}`, `Linha ${row} · Coluna ${column}`, `${row}.${column}`);
  })
);

export const SPREADS = Object.freeze([
  spread({ id:'direct-question', name:'Uma Carta', description:'Uma mensagem central para o agora.', category:'Essencial', sigil:'✦', positions:[p('message','Mensagem central')] }),
  spread({ id:'past-present-tendency', name:'Passado · Presente · Tendência', description:'Três tempos para reconhecer o movimento da questão.', category:'3 Cartas', sigil:'☾', positions:[p('past','Passado · raiz'),p('present','Presente'),p('tendency','Tendência · conselho')] }),
  spread({ id:'magic-triangle', name:'Triângulo Mágico', description:'Manifestação, consciência e caminho possível.', category:'3 Cartas', sigil:'△', positions:[p('manifest','O que se manifesta'),p('awareness','O que pede consciência'),p('path','O caminho possível')] }),
  spread({ id:'situation-challenge-advice', name:'Situação · Desafio · Conselho', description:'Clareza prática para uma questão objetiva.', category:'3 Cartas', sigil:'⌖', positions:[p('situation','Situação'),p('challenge','Desafio'),p('advice','Conselho')] }),
  spread({ id:'five-card-path', name:'Caminho em Cinco', description:'Centro, forças, tensão e próximo movimento.', category:'5 Cartas', sigil:'✧', positions:[p('center','Centro da questão'),p('support','O que favorece'),p('challenge','O que desafia'),p('awareness','O que pede consciência'),p('next','Próximo passo')] }),
  spread({ id:'two-paths', name:'Dois Caminhos', description:'Compare duas possibilidades sem entregar sua decisão ao Tarot.', category:'Escolhas', sigil:'◇', positions:[p('core','Núcleo da escolha'),p('a-strength','Caminho A · força'),p('a-challenge','Caminho A · desafio'),p('b-strength','Caminho B · força'),p('b-challenge','Caminho B · desafio'),p('criterion','Critério para decidir')] }),
  spread({ id:'love-relationships', name:'Amor & Relações', description:'Observe pessoas, vínculo, limites e tendência.', category:'Amor', sigil:'♡', tone:'love', positions:[p('you','Você'),p('other','A outra energia'),p('bond','O vínculo'),p('support','O que fortalece'),p('boundary','O que pede limite'),p('tendency','Tendência')] }),
  spread({ id:'work-career', name:'Trabalho & Vocação', description:'Talentos, ambiente, desafio e direção profissional.', category:'Trabalho', sigil:'♙', tone:'career', positions:[p('now','Seu lugar agora'),p('talent','Talento disponível'),p('environment','Ambiente'),p('challenge','Desafio profissional'),p('direction','Direção possível')] }),
  spread({ id:'money-resources', name:'Dinheiro & Recursos', description:'Uma leitura responsável sobre escolhas e realidade material.', category:'Dinheiro', sigil:'⊕', tone:'money', positions:[p('reality','Realidade atual'),p('resource','Recurso disponível'),p('pattern','Padrão a rever'),p('action','Ação concreta'),p('tendency','Tendência material')] }),
  spread({ id:'spiritual-path', name:'Caminho Espiritual', description:'Presença, aprendizado, sombra, dom e integração.', category:'Espiritualidade', sigil:'☉', tone:'spirituality', positions:[p('presence','Presença'),p('learning','Aprendizado'),p('shadow','Sombra a acolher'),p('gift','Dom a cultivar'),p('integration','Integração')] }),
  spread({ id:'astrological-mandala', name:'Mandala Astrológica', description:'Doze casas observam a vida por inteiro.', category:'Profunda', sigil:'◉', layout:'mandala', positions:[p('house-1','Casa 1 · Identidade'),p('house-2','Casa 2 · Recursos'),p('house-3','Casa 3 · Comunicação'),p('house-4','Casa 4 · Raízes'),p('house-5','Casa 5 · Criação'),p('house-6','Casa 6 · Rotina'),p('house-7','Casa 7 · Relacionamentos'),p('house-8','Casa 8 · Transformação'),p('house-9','Casa 9 · Expansão'),p('house-10','Casa 10 · Vocação'),p('house-11','Casa 11 · Comunidade'),p('house-12','Casa 12 · Mundo interior')] }),
  spread({ id:'tree-of-life', name:'Árvore da Vida', description:'Dez posições conectam origem, aprendizado e realização.', category:'Profunda', sigil:'♧', layout:'tree', positions:[p('crown','Coroa'),p('wisdom','Sabedoria'),p('understanding','Entendimento'),p('mercy','Misericórdia'),p('strength','Força'),p('beauty','Beleza'),p('victory','Vitória'),p('splendor','Esplendor'),p('foundation','Fundamento'),p('manifestation','Manifestação')] }),
  spread({ id:'celtic-cross', name:'Cruz Celta', description:'A estrutura tradicional em dez posições, preservando cruz e coluna.', category:'Profunda', sigil:'✣', layout:'celtic-cross', positions:CELTIC_CROSS_POSITIONS }),
  spread({ id:'custom-table', name:'Mesa Personalizada', description:'Escolha de 1 a 12 posições antes de abrir as cartas.', category:'Autoral', sigil:'⋮', custom:true, positions:CUSTOM_POSITIONS }),
  spread({ id:'royal-table', name:'Mesa Real', description:'As 78 cartas únicas em uma matriz 13 × 6, com autosave Premium.', category:'Premium', sigil:'▦', premium:true, layout:'royal-table', positions:ROYAL_TABLE_POSITIONS })
]);

export function spreadFilterId(target) {
  if (!target) return '';
  if (target.custom || target.premium) return 'author';
  if (target.category === 'Profunda') return 'deep';
  if (['Escolhas','Amor','Trabalho','Dinheiro','Espiritualidade'].includes(target.category)) return 'themes';
  return 'quick';
}

export function spreadsForFilter(filterId = 'all') {
  return filterId === 'all' ? [...SPREADS] : SPREADS.filter(target => spreadFilterId(target) === filterId);
}

export const spreadById = id => SPREADS.find(item => item.id === id) || null;

export function positionsForSpread(target, count) {
  if (!target) return [];
  if (!target.custom) return target.positions.map(position => ({ ...position }));
  const amount = Math.max(1, Math.min(12, Number.parseInt(count, 10) || 5));
  return CUSTOM_POSITIONS.slice(0, amount).map(position => ({ ...position }));
}

export function positionLabels(positions) {
  return (positions || []).map(position => typeof position === 'string' ? position : position?.label || '').filter(Boolean);
}

export function positionIds(positions) {
  return (positions || []).map((position, index) => typeof position === 'string' ? `position-${index + 1}` : position?.id || `position-${index + 1}`);
}

export function validCardIds(ids, count = ids?.length) {
  if (!Array.isArray(ids) || ids.length !== count || new Set(ids).size !== ids.length) return false;
  return ids.every(id => Number.isInteger(id) && id >= 0 && id < 78);
}

function validIso(value) {
  if (typeof value !== 'string') return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

export function normalizeSpreadSession(value, { allowPremium = true } = {}) {
  const target = spreadById(value?.spreadId || value?.spread_key);
  if (!target || (!allowPremium && target.premium) || value?.orientation !== 'normal') return null;

  const rawCards = Array.isArray(value?.cardIds) ? value.cardIds : value?.card_ids;
  const positions = positionsForSpread(target, target.custom ? rawCards?.length : undefined);
  const ids = Array.isArray(rawCards) ? rawCards.map(Number) : [];
  if (!validCardIds(ids, positions.length)) return null;
  if (target.id === 'celtic-cross' && ids.length !== 10) return null;
  if (target.id === 'royal-table' && ids.length !== ROYAL_TABLE_COUNT) return null;

  const rawRevealed = value?.revealed == null ? ids.length : Number(value.revealed);
  const revealed = Math.max(0, Math.min(ids.length, Number.isInteger(rawRevealed) ? rawRevealed : 0));
  const rawActive = Number(value?.activeIndex ?? value?.active_index ?? 0);
  const activeIndex = revealed ? Math.max(0, Math.min(revealed - 1, Number.isInteger(rawActive) ? rawActive : 0)) : 0;
  const now = new Date().toISOString();
  const readingId = typeof value?.readingId === 'string' ? value.readingId : typeof value?.reading_id === 'string' ? value.reading_id : '';

  return {
    readingId,
    spreadId: target.id,
    cardIds: ids,
    positions,
    revealed,
    activeIndex,
    question: typeof value?.question === 'string' ? value.question.slice(0, 600) : '',
    orientation: 'normal',
    createdAt: validIso(value?.createdAt) ? value.createdAt : validIso(value?.created_at) ? value.created_at : now,
    updatedAt: validIso(value?.updatedAt) ? value.updatedAt : validIso(value?.updated_at) ? value.updated_at : now,
    revision: SPREAD_SCHEMA_VERSION,
    cloudSyncedAt: validIso(value?.cloudSyncedAt) ? value.cloudSyncedAt : null
  };
}

export function validSpreadSession(value, options) {
  return Boolean(normalizeSpreadSession(value, options));
}

export function sessionToServerRow(session, userId) {
  const normalized = normalizeSpreadSession(session);
  if (!normalized || !normalized.readingId || !userId) return null;
  return {
    user_id:userId,
    reading_id:normalized.readingId,
    spread_key:normalized.spreadId,
    position_count:normalized.cardIds.length,
    card_ids:normalized.cardIds,
    positions:positionLabels(normalized.positions),
    revealed:normalized.revealed,
    active_index:normalized.activeIndex,
    question:normalized.question,
    orientation:'normal',
    status:normalized.revealed === normalized.cardIds.length ? 'complete' : 'in_progress',
    created_at:normalized.createdAt,
    updated_at:normalized.updatedAt
  };
}
