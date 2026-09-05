/* DIVINA BRUXA — POLÍTICA DO TEMPLO DAS TIRAGENS V139
   Uma única orientação, cartas únicas e sessões retomáveis neste aparelho. */

export const SPREAD_STORAGE_KEY = 'spread-session-v5';
export const SPREAD_HISTORY_KEY = 'spread-history-v139';
export const SPREAD_SCHEMA_VERSION = 2;

const spread = value => Object.freeze({ premium: false, custom: false, ...value });

export const CUSTOM_POSITIONS = Object.freeze([
  'Centro da questão',
  'Origem',
  'Influência interior',
  'Influência exterior',
  'Desafio',
  'Recurso disponível',
  'O que pede consciência',
  'O que ganha força',
  'O que perde força',
  'Próximo passo',
  'Tendência',
  'Síntese'
]);

export const SPREADS = Object.freeze([
  spread({ id: 'direct-question', name: 'Uma Carta', description: 'Uma mensagem central para o agora.', category: 'Essencial', sigil: '✦', positions: ['Mensagem central'] }),
  spread({ id: 'past-present-tendency', name: 'Passado · Presente · Tendência', description: 'Três tempos para reconhecer o movimento da questão.', category: '3 Cartas', sigil: '☾', positions: ['Passado · raiz', 'Presente', 'Tendência · conselho'] }),
  spread({ id: 'magic-triangle', name: 'Triângulo Mágico', description: 'Manifestação, consciência e caminho possível.', category: '3 Cartas', sigil: '△', positions: ['O que se manifesta', 'O que pede consciência', 'O caminho possível'] }),
  spread({ id: 'situation-challenge-advice', name: 'Situação · Desafio · Conselho', description: 'Clareza prática para uma questão objetiva.', category: '3 Cartas', sigil: '⌖', positions: ['Situação', 'Desafio', 'Conselho'] }),
  spread({ id: 'five-card-path', name: 'Caminho em Cinco', description: 'Centro, forças, tensão e próximo movimento.', category: '5 Cartas', sigil: '✧', positions: ['Centro da questão', 'O que favorece', 'O que desafia', 'O que pede consciência', 'Próximo passo'] }),
  spread({ id: 'two-paths', name: 'Dois Caminhos', description: 'Compare duas possibilidades sem entregar sua decisão ao Tarot.', category: 'Escolhas', sigil: '◇', positions: ['Núcleo da escolha', 'Caminho A · força', 'Caminho A · desafio', 'Caminho B · força', 'Caminho B · desafio', 'Critério para decidir'] }),
  spread({ id: 'love-relationships', name: 'Amor & Relações', description: 'Observe pessoas, vínculo, limites e tendência.', category: 'Amor', sigil: '♡', tone: 'love', positions: ['Você', 'A outra energia', 'O vínculo', 'O que fortalece', 'O que pede limite', 'Tendência'] }),
  spread({ id: 'work-career', name: 'Trabalho & Vocação', description: 'Talentos, ambiente, desafio e direção profissional.', category: 'Trabalho', sigil: '♙', tone: 'career', positions: ['Seu lugar agora', 'Talento disponível', 'Ambiente', 'Desafio profissional', 'Direção possível'] }),
  spread({ id: 'money-resources', name: 'Dinheiro & Recursos', description: 'Uma leitura responsável sobre escolhas e realidade material.', category: 'Dinheiro', sigil: '⊕', tone: 'money', positions: ['Realidade atual', 'Recurso disponível', 'Padrão a rever', 'Ação concreta', 'Tendência material'] }),
  spread({ id: 'spiritual-path', name: 'Caminho Espiritual', description: 'Presença, aprendizado, sombra, dom e integração.', category: 'Espiritualidade', sigil: '☉', tone: 'spirituality', positions: ['Presença', 'Aprendizado', 'Sombra a acolher', 'Dom a cultivar', 'Integração'] }),
  spread({ id: 'astrological-mandala', name: 'Mandala Astrológica', description: 'Doze casas observam a vida por inteiro.', category: 'Profunda', sigil: '◉', positions: ['Identidade', 'Recursos', 'Comunicação', 'Raízes', 'Criação', 'Rotina', 'Relacionamentos', 'Transformação', 'Expansão', 'Vocação', 'Comunidade', 'Mundo interior'] }),
  spread({ id: 'tree-of-life', name: 'Árvore da Vida', description: 'Dez posições conectam origem, aprendizado e realização.', category: 'Profunda', sigil: '♧', positions: ['Coroa', 'Sabedoria', 'Entendimento', 'Misericórdia', 'Força', 'Beleza', 'Vitória', 'Esplendor', 'Fundamento', 'Manifestação'] }),
  spread({ id: 'celtic-cross', name: 'Cruz Celta', description: 'A estrutura tradicional em dez posições complementares.', category: 'Profunda', sigil: '✣', positions: ['Presente', 'Desafio', 'Fundamento', 'Passado recente', 'Possibilidade consciente', 'Futuro próximo', 'Você', 'Ambiente', 'Esperanças e medos', 'Síntese'] }),
  spread({ id: 'custom-table', name: 'Mesa Personalizada', description: 'Escolha de 1 a 12 posições antes de abrir as cartas.', category: 'Autoral', sigil: '⋮', custom: true, positions: CUSTOM_POSITIONS }),
  spread({ id: 'royal-table', name: 'Mesa Real', description: 'As 78 cartas em 13 fileiras de 6, com retomada protegida.', category: 'Premium', sigil: '▦', premium: true, positions: Array.from({ length: 78 }, (_, index) => `Posição ${index + 1}`) })
]);

export const spreadById = id => SPREADS.find(item => item.id === id) || null;

export function positionsForSpread(target, count) {
  if (!target) return [];
  if (!target.custom) return [...target.positions];
  const amount = Math.max(1, Math.min(12, Number.parseInt(count, 10) || 5));
  return CUSTOM_POSITIONS.slice(0, amount);
}

export function normalizeSpreadSession(value) {
  const target = spreadById(value?.spreadId);
  if (!target || target.premium || value?.orientation !== 'normal' || !Array.isArray(value.cardIds)) return null;

  const positions = positionsForSpread(target, target.custom ? value.cardIds.length : undefined);
  const ids = [...value.cardIds];
  if (ids.length !== positions.length || new Set(ids).size !== ids.length) return null;
  if (!ids.every(id => Number.isInteger(id) && id >= 0 && id < 78)) return null;

  const revealedFallback = value.revealed == null ? ids.length : Number(value.revealed);
  const revealed = Math.max(0, Math.min(ids.length, Number.isInteger(revealedFallback) ? revealedFallback : 0));
  const activeIndex = revealed ? Math.max(0, Math.min(revealed - 1, Number(value.activeIndex) || 0)) : 0;
  const question = typeof value.question === 'string' ? value.question.slice(0, 600) : '';

  return {
    spreadId: target.id,
    cardIds: ids,
    positions,
    revealed,
    activeIndex,
    question,
    orientation: 'normal',
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
    revision: SPREAD_SCHEMA_VERSION
  };
}

export function validSpreadSession(value) {
  return Boolean(normalizeSpreadSession(value));
}
