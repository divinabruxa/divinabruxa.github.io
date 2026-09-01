export const SPREAD_STORAGE_KEY = 'spread-session-v5';

export const SPREADS = Object.freeze([
  Object.freeze({ id: 'direct-question', name: 'Pergunta Direta', description: 'Uma carta para iluminar uma questão objetiva.', positions: ['Resposta'] }),
  Object.freeze({ id: 'magic-triangle', name: 'Triângulo Mágico', description: 'Três forças revelam o centro do momento.', positions: ['O que se manifesta', 'O que pede consciência', 'O caminho possível'] }),
  Object.freeze({ id: 'astrological-mandala', name: 'Mandala Astrológica', description: 'Doze casas observam a vida por inteiro.', positions: ['Identidade', 'Recursos', 'Comunicação', 'Raízes', 'Criação', 'Rotina', 'Relacionamentos', 'Transformação', 'Expansão', 'Vocação', 'Comunidade', 'Mundo interior'] }),
  Object.freeze({ id: 'tree-of-life', name: 'Árvore da Vida', description: 'Dez posições conectam origem, aprendizado e realização.', positions: ['Coroa', 'Sabedoria', 'Entendimento', 'Misericórdia', 'Força', 'Beleza', 'Vitória', 'Esplendor', 'Fundamento', 'Manifestação'] }),
  Object.freeze({ id: 'celtic-cross', name: 'Cruz Celta', description: 'A estrutura tradicional em dez posições.', positions: ['Presente', 'Desafio', 'Fundamento', 'Passado recente', 'Possibilidade consciente', 'Futuro próximo', 'Você', 'Ambiente', 'Esperanças e medos', 'Síntese'] }),
  Object.freeze({ id: 'royal-table', name: 'Mesa Real', description: 'As 78 cartas em 13 fileiras de 6.', positions: Array.from({ length: 78 }, (_, index) => `Posição ${index + 1}`), premium: true })
]);

export const spreadById = id => SPREADS.find(spread => spread.id === id) || null;

export function validSpreadSession(value) {
  const spread = spreadById(value?.spreadId);
  return Boolean(spread && !spread.premium && value.orientation === 'normal' && Array.isArray(value.cardIds) && value.cardIds.length === spread.positions.length && new Set(value.cardIds).size === value.cardIds.length && value.cardIds.every(id => Number.isInteger(id) && id >= 0 && id < 78));
}
