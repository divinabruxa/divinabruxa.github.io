export const LIBRARY_PAGE_SIZE = 18;
export const LIBRARY_ORIENTATION = 'normal';

export function cardPageHref(card) {
  const slug = card.arcanaCode === 'major' ? card.canonicalId : card.canonicalId.replace(/^\d{2}-/, '');
  return `carta-${slug}.html`;
}

export function matchesLibraryFilters(card, filters) {
  const query = String(filters.query || '').trim().toLocaleLowerCase('pt-BR');
  const searchable = [card.names?.ptBR, card.names?.en, card.names?.es, card.arcana, card.suit, card.element].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');
  return (!query || searchable.includes(query)) &&
    (!filters.arcana || card.arcanaCode === filters.arcana) &&
    (!filters.suit || card.suit === filters.suit) &&
    (!filters.element || card.element === filters.element) &&
    card.orientation === LIBRARY_ORIENTATION;
}
