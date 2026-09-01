// Regras de interface; moderação e autorização reais devem ocorrer no backend.
export function canPublishCommunityPost(input = {}) {
  return Boolean(input.optIn === true && input.text?.trim() && input.pseudonym?.trim() && !input.blocked);
}

export function communitySafetyFlags(text = '') {
  const normalized = String(text).toLowerCase();
  return { hasContactDoxxing: /cpf|senha|cart[aã]o|telefone/.test(normalized), hasPromise: /cura garantida|resultado garantido/.test(normalized) };
}

export function publicMetrics(event = {}) {
  const forbidden = new Set(['diaryBody','privateQuestion','mentalHealthInference']);
  return Object.fromEntries(Object.entries(event).filter(([key]) => !forbidden.has(key)));
}
