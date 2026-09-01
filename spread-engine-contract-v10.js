// Contrato seguro para sorteio sem repetição. A integração visual permanece explícita.
export function drawUnique(deck, count, random = Math.random) {
  if (!Array.isArray(deck) || count < 1 || count > deck.length) throw new RangeError('Quantidade inválida');
  const pool = [...deck];
  const result = [];
  while (result.length < count) {
    const index = Math.floor(random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

export function validateCustomSpread(spread) {
  const positions = spread?.positions;
  if (!Array.isArray(positions) || positions.length < 1 || positions.length > 24) return false;
  return positions.every(p => p?.title?.trim() && p?.meaning?.trim());
}
