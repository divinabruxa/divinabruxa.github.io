export function dateKeyInTimeZone(date = new Date(), timeZone = 'America/Sao_Paulo') {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function dailyCardIndex(dateKey, cardCount = 78, seed = 'divina-bruxa-carta-do-dia-v1') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw new TypeError('Data diária inválida.');
  if (!Number.isInteger(cardCount) || cardCount < 1) throw new TypeError('Quantidade de cartas inválida.');
  return fnv1a(`${seed}:${dateKey}`) % cardCount;
}

export function dailyStorageKey(dateKey) {
  return `divina-bruxa-3.carta-do-dia.${dateKey}`;
}
