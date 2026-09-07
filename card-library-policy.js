/* DIVINA BRUXA — POLÍTICA DA BIBLIOTECA UNIVERSAL V184 */
export const LIBRARY_PAGE_SIZE = 24;
export const LIBRARY_ORIENTATION = 'normal';
export const LIBRARY_COMPARE_LIMIT = 2;

export function normalizeLibraryText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function cardContentId(card) {
  return card.arcanaCode === 'major'
    ? card.canonicalId
    : card.canonicalId.replace(/^\d{2}-/, '');
}

export function cardPageHref(card) {
  return `carta-${cardContentId(card)}.html`;
}

export function cardKind(card) {
  if (card.arcanaCode === 'major') return 'major';
  return card.court ? 'court' : 'number';
}

export function meaningForCard(card) {
  return globalThis.DivinaBruxaTarotMeanings?.get?.(cardContentId(card)) || null;
}

export function librarySearchText(card) {
  const deep = meaningForCard(card);
  const correspondence = card.correspondences || {};
  return normalizeLibraryText([
    card.names?.ptBR,
    card.names?.en,
    card.names?.es,
    card.arcana,
    card.suit,
    card.element,
    card.rank,
    card.number,
    correspondence.astrological,
    correspondence.numerology,
    correspondence.domain,
    ...(deep?.keywords || []),
    ...(deep?.symbols || [])
  ].filter(Boolean).join(' '));
}

export function matchesLibraryFilters(card, filters) {
  if (card.orientation !== LIBRARY_ORIENTATION) return false;
  const terms = normalizeLibraryText(filters.query).split(' ').filter(Boolean);
  const searchable = librarySearchText(card);
  return terms.every(term => searchable.includes(term)) &&
    (!filters.arcana || card.arcanaCode === filters.arcana) &&
    (!filters.suit || card.suitCode === filters.suit) &&
    (!filters.element || normalizeLibraryText(card.element) === filters.element) &&
    (!filters.kind || cardKind(card) === filters.kind);
}

export function sortLibraryCards(cards, order = 'journey') {
  const collator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });
  return [...cards].sort((a, b) => {
    if (order === 'name') return collator.compare(a.name, b.name);
    if (order === 'element') return collator.compare(a.element, b.element) || a.index - b.index;
    return a.index - b.index;
  });
}
