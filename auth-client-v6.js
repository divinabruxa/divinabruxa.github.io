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
}
