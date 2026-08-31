/* DIVINA BRUXA — REGRA EDITORIAL DO TAROT LIVRE — CHECKPOINT 2.4 */
export const FREE_TAROT_POLICY = Object.freeze({
  normalOnly: true,
  noRepeats: true,
  automaticMeanings: false,
  visibleCardFields: Object.freeze(['image', 'name', 'position', 'orientation'])
});

const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

export function isFreeTarotCard(card) {
  return Boolean(card && card.orientation === 'normal' && Number.isInteger(card.index) && typeof card.name === 'string');
}

export function freeCardLabel(card) {
  if (!isFreeTarotCard(card)) throw new TypeError('O Tarot Livre aceita somente cartas normais do catálogo oficial.');
  return `<div class="card-label"><strong>${escapeText(card.name)}</strong><span>DIRETA</span></div>`;
}

export function freeCardAriaLabel(card, position, action = 'Ampliar') {
  if (!isFreeTarotCard(card)) return '';
  return `${action} ${card.name}, direta, posição ${position}`;
}

export function tarotEditorialStatus(revealed, deckSize = 78) {
  if (revealed <= 0) return 'O círculo aguarda o primeiro toque na Orbe.';
  if (revealed >= deckSize) return 'O círculo está completo. As 78 imagens permanecem abertas à sua leitura.';
  return `${revealed} ${revealed === 1 ? 'carta aberta' : 'cartas abertas'}. A interpretação continua sendo sua.`;
}
