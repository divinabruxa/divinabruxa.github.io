// Ledger determinístico; persistência real deve ocorrer no backend com transação.
export function creditCost(mode) {
  return mode === 'terra' ? 10 : mode === 'luna' ? 1 : Infinity;
}

export function createDebit({ userId, mode, requestId, now = new Date().toISOString() } = {}) {
  const amount = creditCost(mode);
  if (!userId || !requestId || !Number.isFinite(amount)) throw new Error('Débito inválido');
  return { id: `${userId}:${requestId}`, userId, type: 'debit', amount, mode, requestId, createdAt: now };
}

export function calculateBalance(events = []) {
  return events.reduce((balance, event) => balance + (event.type === 'credit' ? event.amount : -event.amount), 0);
}
