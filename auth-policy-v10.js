// Guardas client-side de intenção; autorização verdadeira deve ocorrer no backend.
export function isSafePublicConfig(config = {}) {
  const serialized = JSON.stringify(config);
  return !/service_role|secret[_-]?key|private[_-]?key/i.test(serialized);
}

export function shouldRefreshSensitiveSession(session, now = Date.now(), maxAgeMs = 15 * 60 * 1000) {
  const issued = Number(session?.issuedAt || 0);
  return !issued || now - issued > maxAgeMs;
}

export const PRIVACY_INVARIANTS = Object.freeze({
  diaryBodyInAnalytics: false,
  diaryBodyInAdmin: false,
  aiRequiresExplicitConsent: true,
  productionPublishAuthorized: false,
  realBillingAuthorized: false
});
