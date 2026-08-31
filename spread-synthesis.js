const plural = (amount, one, many) => amount === 1 ? one : many;

export function synthesizeSpread(items) {
  const suitCounts = new Map();
  const elementCounts = new Map();
  let majors = 0;
  for (const { card } of items) {
    if (card.arcanaCode === 'major' || card.suit === 'Maiores') majors += 1;
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
    if (card.element) elementCounts.set(card.element, (elementCounts.get(card.element) || 0) + 1);
  }
  const dominant = [...suitCounts].sort((a, b) => b[1] - a[1])[0] || ['Maiores', 0];
  const element = [...elementCounts].sort((a, b) => b[1] - a[1])[0] || ['indefinido', 0];
  const opening = majors ? `${majors} ${plural(majors, 'Arcano Maior coloca', 'Arcanos Maiores colocam')} decisões estruturais no centro desta leitura.` : 'Os Arcanos Menores aproximam a leitura das escolhas e acontecimentos cotidianos.';
  const pattern = `O campo mais presente é ${dominant[0]}, com ${dominant[1]} ${plural(dominant[1], 'carta', 'cartas')}; o elemento ${element[0]} concentra a energia principal.`;
  const integration = 'Observe como cada posição modifica a carta que recebeu. A síntese não determina um destino: ela reúne os padrões para apoiar uma escolha consciente, concreta e respeitosa com seus limites.';
  return Object.freeze({ opening, pattern, integration, dominantSuit: dominant[0], dominantElement: element[0], majorCount: majors });
}
