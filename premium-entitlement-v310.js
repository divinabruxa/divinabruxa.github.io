export const PREMIUM_ENTITLEMENT_KEYS = Object.freeze([
  'premium_lifetime'
]);

const outcome = (active, status, entitlementKey = null) => Object.freeze({ active, status, entitlementKey });

function validEndpoint(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.pathname.endsWith('/functions/v1/premium-entitlement');
  } catch { return false; }
}

export async function checkPremiumEntitlement({
  session,
  endpoint,
  publishableKey,
  fetcher = globalThis.fetch,
  timeoutMs = 8000
} = {}) {
  const token = typeof session?.access_token === 'string' ? session.access_token.trim() : '';
  if (!token) return outcome(false, 'signed-out');
  if (!validEndpoint(endpoint) || typeof publishableKey !== 'string' || !publishableKey.trim() || typeof fetcher !== 'function') {
    return outcome(false, 'unavailable');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs) || 8000));
  try {
    const response = await fetcher(endpoint, {
      method:'GET',
      signal:controller.signal,
      cache:'no-store',
      headers:{
        Accept:'application/json',
        Authorization:`Bearer ${token}`,
        apikey:publishableKey
      }
    });
    if (response.status === 401 || response.status === 403) return outcome(false, 'signed-out');
    if (!response.ok) return outcome(false, 'unavailable');
    const payload = await response.json().catch(() => null);
    const entitlementKey = typeof payload?.entitlementKey === 'string' ? payload.entitlementKey : null;
    if (payload?.active === true && PREMIUM_ENTITLEMENT_KEYS.includes(entitlementKey)) {
      return outcome(true, 'active', entitlementKey);
    }
    return outcome(false, 'inactive');
  } catch {
    return outcome(false, 'unavailable');
  } finally {
    clearTimeout(timer);
  }
}
