/* DIVINA BRUXA — CLIENTE DE CONTA V189 · PONTES ORBE IA V190 E BILLING V191
   Sessão somente na aba (sessionStorage), nunca em localStorage e sem segredos administrativos. */
import { AuthClient as LegacyAuthClient } from './auth-client-v6.js?v=151';

const SESSION_KEY = 'divina.auth.session.v189';
const REQUEST_TIMEOUT = 15000;
const jsonHeaders = Object.freeze({ 'content-type':'application/json', accept:'application/json' });

const errorMessage = body => String(
  body?.error?.message || body?.msg || body?.message || body?.error_description || body?.error || ''
).slice(0, 300);

const normalizeSession = value => {
  if (!value || typeof value !== 'object' || !value.access_token || !value.refresh_token) return null;
  const expiresAt = Number(value.expires_at || value.expiresAt || 0)
    || Math.floor(Date.now() / 1000) + Math.max(60, Number(value.expires_in || 3600));
  return {
    access_token:String(value.access_token),
    refresh_token:String(value.refresh_token),
    token_type:String(value.token_type || 'bearer'),
    expires_at:expiresAt,
    user:value.user && typeof value.user === 'object' ? value.user : null
  };
};

export class AuthClientV189 extends LegacyAuthClient {
  constructor(config = {}) {
    super(config);
    this.supabaseUrl = String(config.supabaseUrl || '').replace(/\/$/, '');
    this.publishableKey = String(config.supabasePublishableKey || '');
    this.functionBase = String(config.accountFunctionsBase || (this.supabaseUrl ? `${this.supabaseUrl}/functions/v1` : '')).replace(/\/$/, '');
    this.memorySession = null;
    this.listeners = new Set();
    this.refreshTask = null;
  }

  get enabled() {
    return /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(this.supabaseUrl)
      && /^sb_publishable_[A-Za-z0-9_-]+$/.test(this.publishableKey);
  }

  get session() {
    if (this.memorySession) return this.memorySession;
    try {
      this.memorySession = normalizeSession(JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'));
    } catch {
      this.memorySession = null;
    }
    return this.memorySession;
  }

  onAuthStateChange(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event, detail = {}) {
    this.listeners.forEach(listener => {
      try { listener(event, detail); } catch {}
    });
    globalThis.dispatchEvent?.(new CustomEvent('divina:auth-state', { detail:{ event, ...detail } }));
  }

  saveSession(value, event = 'SIGNED_IN') {
    const session = normalizeSession(value);
    this.memorySession = session;
    try {
      if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    this.emit(session ? event : 'SIGNED_OUT', { session });
    return session;
  }

  redirectUrl(mode = 'verify') {
    const url = new URL(globalThis.location?.href || 'https://divinabruxa.com.br/');
    url.search = '';
    url.searchParams.set('account-action', mode);
    url.hash = 'login';
    return url.href;
  }

  async fetchJson(url, options = {}) {
    const { signal:externalSignal, timeoutMs = REQUEST_TIMEOUT, ...fetchOptions } = options;
    const controller = new AbortController();
    let timedOut = false;
    const stop = () => controller.abort(externalSignal?.reason);
    if (externalSignal?.aborted) stop();
    else externalSignal?.addEventListener?.('abort', stop, { once:true });
    const timer = setTimeout(() => { timedOut = true; controller.abort('timeout'); }, timeoutMs);
    try {
      const response = await fetch(url, { ...fetchOptions, signal:controller.signal });
      const body = await response.json().catch(() => ({}));
      return { ok:response.ok, status:response.status, body, message:errorMessage(body) };
    } catch (error) {
      const aborted = error?.name === 'AbortError' && !timedOut;
      return {
        ok:false,
        offline:!aborted,
        aborted,
        status:0,
        body:{ error:{ code:aborted ? 'CLIENT_ABORTED' : timedOut ? 'CLIENT_TIMEOUT' : 'NETWORK_UNAVAILABLE' } },
        message:aborted ? 'Solicitação interrompida.' : timedOut ? 'Tempo de conexão esgotado.' : 'Servidor indisponível.'
      };
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener?.('abort', stop);
    }
  }

  async authRequest(path, { method = 'GET', body, token } = {}) {
    if (!this.enabled) return { ok:false, offline:true, status:0, body:{}, message:'Conta STAGING indisponível.' };
    const headers = { ...jsonHeaders, apikey:this.publishableKey };
    if (token) headers.Authorization = `Bearer ${token}`;
    return this.fetchJson(`${this.supabaseUrl}/auth/v1${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body:JSON.stringify(body) })
    });
  }

  async register(email, password, name = '', ageDeclared = false) {
    const redirect = encodeURIComponent(this.redirectUrl('verify'));
    const result = await this.authRequest(`/signup?redirect_to=${redirect}`, {
      method:'POST',
      body:{
        email,
        password,
        data:{
          display_name:String(name || '').trim().slice(0, 80),
          age_declared_18_plus:ageDeclared === true,
          age_declared_at:ageDeclared === true ? new Date().toISOString() : null,
          registration_release:'V189'
        }
      }
    });
    if (result.ok && result.body?.access_token) this.saveSession(result.body, 'SIGNED_IN');
    return result;
  }

  async login(email, password) {
    const result = await this.authRequest('/token?grant_type=password', {
      method:'POST', body:{ email, password }
    });
    if (result.ok) this.saveSession(result.body, 'SIGNED_IN');
    return result;
  }

  async refreshSession() {
    if (this.refreshTask) return this.refreshTask;
    const current = this.session;
    if (!current?.refresh_token) return { ok:false, status:401, body:{}, message:'Sessão ausente.' };
    this.refreshTask = this.authRequest('/token?grant_type=refresh_token', {
      method:'POST', body:{ refresh_token:current.refresh_token }
    }).then(result => {
      if (result.ok) this.saveSession(result.body, 'TOKEN_REFRESHED');
      else this.saveSession(null);
      return result;
    }).finally(() => { this.refreshTask = null; });
    return this.refreshTask;
  }

  async validSession() {
    const current = this.session;
    if (!current) return null;
    if (Number(current.expires_at) - Math.floor(Date.now() / 1000) <= 90) {
      const refreshed = await this.refreshSession();
      return refreshed.ok ? this.session : null;
    }
    return current;
  }

  async restoreSession() {
    const current = await this.validSession();
    if (!current) return { ok:false, status:401, body:{} };
    const result = await this.authRequest('/user', { token:current.access_token });
    if (!result.ok) {
      this.saveSession(null);
      return result;
    }
    const user = result.body?.user || result.body;
    this.memorySession = { ...current, user };
    this.saveSession(this.memorySession, 'SESSION_RESTORED');
    return { ...result, body:{ user } };
  }

  consumeRedirectSession() {
    const hash = new URLSearchParams(String(globalThis.location?.hash || '').replace(/^#/, ''));
    const error = hash.get('error_description') || hash.get('error');
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');
    const type = hash.get('type') || new URL(globalThis.location?.href || 'https://divinabruxa.com.br/').searchParams.get('account-action') || '';
    if (!error && accessToken && refreshToken) {
      this.saveSession({
        access_token:accessToken,
        refresh_token:refreshToken,
        token_type:hash.get('token_type') || 'bearer',
        expires_in:Number(hash.get('expires_in') || 3600)
      }, type === 'recovery' ? 'PASSWORD_RECOVERY' : 'EMAIL_VERIFIED');
    }
    if (error || accessToken) {
      const url = new URL(globalThis.location.href);
      url.search = '';
      url.hash = 'login';
      history.replaceState(null, '', url.href);
    }
    return { ok:Boolean(accessToken && refreshToken && !error), type, error:error ? String(error).slice(0, 300) : '' };
  }

  async account() {
    const current = await this.validSession();
    if (!current) return { ok:false, status:401, body:{} };
    const result = await this.authRequest('/user', { token:current.access_token });
    if (!result.ok && result.status === 401) this.saveSession(null);
    const user = result.body?.user || (result.ok ? result.body : null);
    if (result.ok && user) {
      this.memorySession = { ...current, user };
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.memorySession)); } catch {}
    }
    return { ...result, body:{ ...(result.body || {}), user } };
  }

  async logout() {
    const current = this.session;
    let result = { ok:true, status:204, body:{} };
    if (current?.access_token) result = await this.authRequest('/logout?scope=local', { method:'POST', token:current.access_token, body:{} });
    this.saveSession(null);
    return result;
  }

  resendVerification(email) {
    const redirect = encodeURIComponent(this.redirectUrl('verify'));
    return this.authRequest(`/resend?redirect_to=${redirect}`, { method:'POST', body:{ type:'signup', email } });
  }

  recoverPassword(email) {
    const redirect = encodeURIComponent(this.redirectUrl('recovery'));
    return this.authRequest(`/recover?redirect_to=${redirect}`, { method:'POST', body:{ email } });
  }

  async updatePassword(password) {
    const current = await this.validSession();
    if (!current) return { ok:false, status:401, body:{}, message:'Sessão de recuperação ausente.' };
    return this.authRequest('/user', { method:'PUT', token:current.access_token, body:{ password } });
  }

  async reauthenticate(password) {
    const account = await this.account();
    const email = account.body?.user?.email || this.session?.user?.email;
    if (!email) return { ok:false, status:401, body:{}, message:'Entre novamente.' };
    return this.login(email, password);
  }

  async functionRequest(slug, { method = 'POST', body, signal, timeoutMs } = {}) {
    const current = await this.validSession();
    if (!current || !this.functionBase) return { ok:false, status:401, body:{}, message:'Entre novamente para continuar.' };
    const headers = { ...jsonHeaders, apikey:this.publishableKey, Authorization:`Bearer ${current.access_token}` };
    return this.fetchJson(`${this.functionBase}/${encodeURIComponent(slug)}`, {
      method,
      headers,
      signal,
      timeoutMs,
      ...(body === undefined ? {} : { body:JSON.stringify(body) })
    });
  }

  syncAccount(payload) { return this.functionRequest('account-sync-v189', { body:payload }); }
  dailyCard() { return this.functionRequest('daily-card-account', { method:'GET' }); }
  aiStatus() { return this.functionRequest('orbe-ai-chat', { method:'GET', timeoutMs:20000 }); }
  aiChat(payload, signal) { return this.functionRequest('orbe-ai-chat', { body:payload, signal, timeoutMs:55000 }); }
  billingSnapshot() {
    const requestId = globalThis.crypto?.randomUUID?.();
    return this.functionRequest('billing-account-v191', {
      body:{ action:'snapshot', requestId }, timeoutMs:20000
    });
  }
  billingSandboxCommand(payload = {}) {
    return this.functionRequest('billing-account-v191', {
      body:{ action:'command', ...payload }, timeoutMs:25000
    });
  }
  async skinEntitlements() {
    const result = await this.billingSnapshot();
    return result?.ok
      ? { ...result, body:{ ...(result.body || {}), skinIds:result.body?.snapshot?.skinIds || ['classic'] } }
      : result;
  }
  exportAccount() { return this.functionRequest('account-export', { body:{ formatVersion:'1.0.0' } }); }
  deleteAccount(payload) { return this.functionRequest('account-delete', { body:payload }); }
}
