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
  adminRequest(path, options = {}) { return this.request(path, { ...options, headers: { 'x-divina-admin-request': 'v145', ...(options.headers || {}) } }); }
  register(email, password, name = '') { return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }); }
  login(email, password) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  logout() { return this.request('/auth/logout', { method: 'POST', body: '{}' }); }
  account() { return this.request('/account'); }
  history() { return this.request('/history'); }
  saveHistory(entry) { return this.request('/history', { method: 'POST', body: JSON.stringify(entry) }); }
  skinEntitlements() { return this.request('/account/skins'); }
  premiumEntitlements() { return this.request('/account/entitlements'); }
  restorePurchases() { return this.request('/account/entitlements/restore', { method: 'POST', body: '{}' }); }
  adminSession() { return this.adminRequest('/admin/session'); }
  adminSignIn(email, password) { return this.adminRequest('/admin/session', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  adminEnrollMfa() { return this.adminRequest('/admin/session/mfa/enroll', { method: 'POST', body: '{}' }); }
  adminVerifyMfa(code, factorId = '') { return this.adminRequest('/admin/session/mfa', { method: 'POST', body: JSON.stringify({ code, factorId }) }); }
  adminCreateRecoveryCodes() { return this.adminRequest('/admin/session/recovery-codes', { method: 'POST', body: '{}' }); }
  adminSignOut() { return this.adminRequest('/admin/session', { method: 'DELETE' }); }
  adminOverview() { return this.adminRequest('/admin/overview'); }
  adminModule(moduleId) { return this.adminRequest(`/admin/modules/${encodeURIComponent(moduleId)}`); }
  adminUpdateConsultationPrices(prices, stepUpCode) { return this.adminRequest('/admin/consultations/prices', { method: 'PATCH', body: JSON.stringify({ prices, stepUpCode }) }); }
  adminExportDiagnostic() { return this.adminRequest('/admin/diagnostic'); }
  saveSkinEntitlement(skinId) { return this.request('/account/skins', { method: 'POST', body: JSON.stringify({ skinId }) }); }
  revokeSkinEntitlement(skinId) { return this.request(`/account/skins/${encodeURIComponent(skinId)}`, { method: 'DELETE' }); }
}
