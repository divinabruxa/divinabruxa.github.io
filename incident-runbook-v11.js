// Estruturas de runbook; execução e alertas pertencem à infraestrutura.
export function classifyIncident({ scope = 'unknown', dataExposure = false, paymentImpact = false } = {}) {
  if (dataExposure || paymentImpact) return 'P0';
  if (scope === 'core') return 'P1';
  if (scope === 'single-feature') return 'P2';
  return 'P3';
}

export function safeFailure(feature) {
  return { payments: 'no-access-grant', ai: 'stop-and-inform', consultations: 'queue-and-confirm', offline: 'fallback-content' }[feature] || 'show-status';
}
