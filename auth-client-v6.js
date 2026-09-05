/* Cliente de autenticação: sem tokens em localStorage e sem segredos públicos. */
export class AuthClient {
  constructor(config) { this.base = String(config?.apiBase || '').replace(/\/$/, ''); }
  get enabled() { return Boolean(this.base); }
  async request(path, options = {}) {
    if (!this.enabled) return { ok: false, offline: true };
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${this.base}${path}`, { ...options, credentials: 'include', headers: { 'content-type': 'application/json', ...(options.headers || {}) }, signal: controller.signal });
      const body = await response.json().catch(() => ({}));
      return { ok: response.ok, status: response.status, body };
    } catch { return { ok: false, offline: true }; } finally { clearTimeout(timer); }
  }
  register(email, password, name = '') { return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }); }
  login(email, password) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  logout() { return this.request('/auth/logout', { method: 'POST', body: '{}' }); }
  account() { return this.request('/account'); }
  history() { return this.request('/history'); }
  saveHistory(entry) { return this.request('/history', { method: 'POST', body: JSON.stringify(entry) }); }
  skinEntitlements() { return this.request('/account/skins'); }
  premiumEntitlements() { return this.request('/account/entitlements'); }
  restorePurchases() { return this.request('/account/entitlements/restore', { method: 'POST', body: '{}' }); }
  adminSession() { return this.request('/admin/session'); }
  adminSignIn(email, password) { return this.request('/admin/session', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  adminVerifyMfa(code) { return this.request('/admin/session/mfa', { method: 'POST', body: JSON.stringify({ code }) }); }
  adminSignOut() { return this.request('/admin/session', { method: 'DELETE' }); }
  adminOverview() { return this.request('/admin/overview'); }
  adminModule(moduleId) { return this.request(`/admin/modules/${encodeURIComponent(moduleId)}`); }
  adminUpdateConsultationPrices(prices, stepUpCode) { return this.request('/admin/consultations/prices', { method: 'PATCH', body: JSON.stringify({ prices, stepUpCode }) }); }
  adminExportDiagnostic() { return this.request('/admin/diagnostic'); }
  saveSkinEntitlement(skinId) { return this.request('/account/skins', { method: 'POST', body: JSON.stringify({ skinId }) }); }
  revokeSkinEntitlement(skinId) { return this.request(`/account/skins/${encodeURIComponent(skinId)}`, { method: 'DELETE' }); }
}
