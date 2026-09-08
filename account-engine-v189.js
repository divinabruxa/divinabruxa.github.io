/* DIVINA BRUXA — EXPERIÊNCIA DE CONTA V189 */
import { store, escapeHTML } from './storage.js';
import { normalizeSchoolState, SCHOOL_STORAGE_KEY } from './school-policy.js?v=186';
import { normalizeJournalEntries, mergeJournalEntries, JOURNAL_STORAGE_KEY } from './journal-policy.js?v=187';
import { createAccountDailyRecord, DAILY_STORAGE_KEY } from './daily-policy.js?v=189';

const SYNC_META_KEY = 'account-sync-meta-v189';
const ACCOUNT_CACHE_PREFIX = 'account-cache-v189:';
const TRACKED_KEYS = new Set([SCHOOL_STORAGE_KEY, JOURNAL_STORAGE_KEY, DAILY_STORAGE_KEY]);
const safe = value => escapeHTML(value ?? '');
const uuid = () => globalThis.crypto?.randomUUID?.() || `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`;
const announce = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:message }));
const money = cents => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(Number(cents || 0) / 100);

const defaultCounts = () => ({ journal:0, school:0, favorites:0, purchases:0 });
const friendlyError = result => {
  const code = String(result?.body?.error?.code || result?.body?.code || '').toUpperCase();
  const raw = String(result?.message || result?.body?.error?.message || '').toLocaleLowerCase('pt-BR');
  if (result?.offline) return 'Sem conexão com o servidor seguro. Tente novamente quando estiver online.';
  if (result?.status === 429 || code === 'RATE_LIMITED') return 'Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.';
  if (/email not confirmed|email_not_confirmed/.test(raw) || code === 'EMAIL_VERIFICATION_REQUIRED') return 'Confirme o e-mail enviado antes de entrar.';
  if (/invalid login|invalid_credentials/.test(raw)) return 'E-mail ou senha não conferem.';
  if (/password/.test(raw) && /short|weak|least/.test(raw)) return 'Use uma senha forte com pelo menos 12 caracteres.';
  if (code === 'SYNC_TOO_LARGE' || result?.status === 413) return 'O Diário está grande demais para esta sincronização. Baixe uma cópia privada e tente em partes.';
  if (code === 'RECENT_AUTH_REQUIRED') return 'Confirme a senha novamente e repita a exclusão em até cinco minutos.';
  if (code === 'MFA_REQUIRED' || code === 'RECENT_MFA_REQUIRED') return 'Esta conta exige uma verificação MFA recente antes da exclusão.';
  return 'Não foi possível concluir agora. Nenhum dado local foi apagado.';
};

export class AccountEngineV189 {
  constructor(root, authClient) {
    if (!root) throw new TypeError('O espaço da Conta não foi encontrado.');
    this.root = root;
    this.auth = authClient;
    this.root.dataset.accountV189 = '';
    this.mode = 'login';
    this.user = null;
    this.profile = null;
    this.counts = defaultCounts();
    this.purchases = [];
    this.entitlements = [];
    this.journalEnabled = false;
    this.busy = false;
    this.applying = false;
    this.syncTimer = 0;
    this.redirect = this.auth.consumeRedirectSession?.() || {};
    if (this.redirect.type === 'recovery' && this.redirect.ok) this.mode = 'reset';
    this.render();
    this.bindGlobal();
    this.boot();
  }

  bindGlobal() {
    this.unsubscribe = this.auth.onAuthStateChange?.((event, detail) => {
      if (event === 'SIGNED_OUT') {
        this.separateExpiredAccount();
        this.user = null;
        this.profile = null;
        this.counts = defaultCounts();
        this.mode = 'login';
        this.render();
      } else if (detail?.session?.user && event !== 'SESSION_RESTORED') {
        this.user = detail.session.user;
      }
    });
    globalThis.addEventListener('divina:storage-change', event => {
      const key = event.detail?.key;
      if (this.applying || !this.user || !TRACKED_KEYS.has(key)) return;
      if (key === JOURNAL_STORAGE_KEY && !this.journalEnabled) return;
      clearTimeout(this.syncTimer);
      this.syncTimer = setTimeout(() => this.syncNow({ quiet:true }), 1200);
    });
    globalThis.addEventListener('online', () => {
      if (this.user) this.syncNow({ quiet:true });
    });
  }

  async boot() {
    if (!this.auth.enabled) {
      this.setStatus('A conexão de Conta STAGING não está configurada nesta instalação.', 'error');
      return;
    }
    if (this.redirect.error) this.setStatus('O link expirou ou não pôde ser validado. Solicite um novo.', 'error');
    if (this.mode === 'reset') {
      this.setStatus('Link confirmado. Escolha uma nova senha forte.', 'success');
      return;
    }
    const account = await this.auth.restoreSession();
    if (!account.ok || !account.body?.user) {
      this.separateExpiredAccount();
      return;
    }
    this.user = account.body.user;
    this.prepareLocalForUser();
    this.render();
    await this.syncNow({ quiet:true });
  }

  render() {
    if (this.user) this.renderAccount();
    else this.renderGuest();
    this.bind();
  }

  shell(content) {
    return `<div class="account-v189-shell">
      <header class="account-v189-hero"><span class="account-v189-orb" aria-hidden="true">◎</span><div><p class="eyebrow">MINHA ORBE · V189 · STAGING</p><h2>${this.user ? 'Seu universo acompanha você.' : 'Entre no seu espaço.'}</h2><p>${this.user ? 'Conta verificada, sincronização protegida e escolhas de privacidade sob o seu controle.' : 'Crie uma conta, confirme seu e-mail e continue entre aparelhos sem abrir mão do controle.'}</p></div></header>
      <aside class="account-v189-stage" role="note"><b>AMBIENTE DE TESTES</b><span>Conta real no STAGING · nenhuma cobrança real · produção não publicada</span></aside>
      ${content}
      <p class="account-v189-live" data-account-status role="status" aria-live="polite"></p>
    </div>`;
  }

  renderGuest() {
    const tabs = `<nav class="account-v189-tabs" aria-label="Acesso à conta">
      <button type="button" data-account-mode="login" aria-pressed="${this.mode === 'login'}">Entrar</button>
      <button type="button" data-account-mode="register" aria-pressed="${this.mode === 'register'}">Criar conta</button>
      <button type="button" data-account-mode="recover" aria-pressed="${this.mode === 'recover'}">Recuperar</button>
    </nav>`;
    let form = '';
    if (this.mode === 'register') form = `<form class="account-v189-form" data-account-form="register" autocomplete="on">
      <label><span>Como deseja ser chamada?</span><input name="name" autocomplete="name" maxlength="80" required></label>
      <label><span>E-mail</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <label><span>Senha forte</span><input name="password" type="password" autocomplete="new-password" minlength="12" maxlength="128" required><small>Mínimo de 12 caracteres. Não reutilize uma senha importante.</small></label>
      <label><span>Confirmar senha</span><input name="confirm" type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label>
      <label class="account-v189-check"><input name="age" type="checkbox" required><span>Declaro ter 18 anos ou mais e aceito os <a href="termos-de-uso.html">Termos</a> e o <a href="privacidade-e-dados.html">Aviso de Privacidade</a>.</span></label>
      <button class="primary" type="submit">CRIAR MINHA CONTA</button>
    </form>`;
    else if (this.mode === 'recover') form = `<form class="account-v189-form" data-account-form="recover">
      <p>Informe o e-mail da conta. Se ele estiver cadastrado, enviaremos um link seguro.</p>
      <label><span>E-mail</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <button class="primary" type="submit">ENVIAR LINK DE RECUPERAÇÃO</button>
    </form>`;
    else if (this.mode === 'reset') form = `<form class="account-v189-form" data-account-form="reset">
      <label><span>Nova senha</span><input name="password" type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label>
      <label><span>Confirmar nova senha</span><input name="confirm" type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label>
      <button class="primary" type="submit">GUARDAR NOVA SENHA</button>
    </form>`;
    else form = `<form class="account-v189-form" data-account-form="login" autocomplete="on">
      <label><span>E-mail</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <label><span>Senha</span><input name="password" type="password" autocomplete="current-password" maxlength="128" required></label>
      <button class="primary" type="submit">ENTRAR COM SEGURANÇA</button>
    </form>`;
    const verify = this.mode === 'verify' ? `<section class="account-v189-verify"><span>✉</span><h3>Confira seu e-mail.</h3><p>Abra o link de confirmação para ativar a conta. O link pode levar alguns minutos.</p><form data-account-form="resend"><label><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label><button type="submit">REENVIAR CONFIRMAÇÃO</button></form></section>` : '';
    this.root.innerHTML = this.shell(`${this.mode === 'reset' ? '' : tabs}${verify || form}<section class="account-v189-trust"><article><b>◇</b><span>RLS por conta</span><small>Uma conta não lê dados de outra.</small></article><article><b>✉</b><span>E-mail verificado</span><small>Confirmação e recuperação nativas.</small></article><article><b>☾</b><span>Diário sob escolha</span><small>Nuvem somente após consentimento.</small></article></section>`);
  }

  renderAccount() {
    const email = safe(this.user.email || 'Conta conectada');
    const displayName = safe(this.profile?.displayName || this.user.user_metadata?.display_name || 'Minha Orbe');
    const purchases = this.purchases.slice(0, 4).map(item => `<li><span>${safe(item.product_key)}</span><b>${money(item.price_brl_cents_snapshot)}</b><small>${safe(item.status)}</small></li>`).join('');
    this.root.innerHTML = this.shell(`<section class="account-v189-profile">
      <div><small>CONTA VERIFICADA</small><h3>${displayName}</h3><p>${email}</p></div><span class="account-v189-verified">✓ E-MAIL CONFIRMADO</span>
    </section>
    <section class="account-v189-sync" aria-labelledby="accountSyncTitle"><header><div><p class="eyebrow">SINCRONIZAÇÃO SEGURA</p><h3 id="accountSyncTitle">Continuidade entre aparelhos</h3></div><button type="button" data-account-sync>Sincronizar agora</button></header>
      <div class="account-v189-counts"><article><span>☉</span><b data-count="daily">${store.get(DAILY_STORAGE_KEY) ? 'Hoje' : '—'}</b><small>Carta do Dia</small></article><article><span>▤</span><b data-count="school">${this.counts.school}</b><small>Aulas concluídas</small></article><article><span>☾</span><b data-count="journal">${this.journalEnabled ? this.counts.journal : 'Local'}</b><small>Memórias</small></article><article><span>◇</span><b data-count="purchases">${this.counts.purchases}</b><small>Compras registradas</small></article></div>
      <label class="account-v189-consent"><input type="checkbox" data-journal-sync ${this.journalEnabled ? 'checked' : ''}><span><b>Sincronizar meu Diário privado</b><small>Desligado por padrão. Quando ativado, as entradas salvas — inclusive textos e revisões — são protegidas por RLS e sincronizadas. Rascunhos nunca saem deste aparelho; Admin, analytics e IA não recebem o Diário.</small></span></label>
      <p class="account-v189-sync-note">Escola, favoritos, Carta do Dia, compras e benefícios usam a conta. Compras são somente leitura: este site não pode conceder benefícios.</p>
    </section>
    <section class="account-v189-actions"><button type="button" data-account-export>BAIXAR TODOS OS MEUS DADOS</button><button type="button" data-account-logout>SAIR DESTE APARELHO</button></section>
    <section class="account-v189-purchases"><header><p class="eyebrow">COMPRAS E BENEFÍCIOS</p><h3>Autoridade do servidor</h3></header>${purchases ? `<ul>${purchases}</ul>` : '<p>Nenhuma compra registrada. A cobrança real continua desativada.</p>'}<small>${this.entitlements.length} benefício(s) ativo(s) ou histórico(s) visível(is) para esta conta.</small></section>
    <details class="account-v189-danger"><summary>Encerrar e excluir minha conta</summary><div><p>Esta ação revoga sessões e apaga a conta e seus dados vinculados. Primeiro baixe uma cópia, se desejar.</p><form data-account-form="delete"><label><span>Senha atual</span><input name="password" type="password" autocomplete="current-password" required></label><label><span>Digite exatamente: EXCLUIR MINHA CONTA</span><input name="confirmation" autocomplete="off" required></label><label class="account-v189-check"><input name="removeLocal" type="checkbox" checked><span>Também remover Escola, Diário e Carta do Dia deste aparelho.</span></label><button type="submit">EXCLUIR CONTA DEFINITIVAMENTE</button></form></div></details>
    <aside class="account-v189-security"><span>⬡</span><div><b>Sessão protegida</b><p>O token não é salvo em localStorage, expira e é renovado somente nesta aba. Sair revoga a sessão atual. O painel Admin permanece separado e exige MFA/AAL2.</p></div></aside>`);
  }

  bind() {
    this.root.querySelectorAll('[data-account-mode]').forEach(button => button.onclick = () => {
      if (this.busy) return;
      this.mode = button.dataset.accountMode;
      this.render();
    });
    this.root.querySelector('[data-account-form="login"]')?.addEventListener('submit', event => this.login(event));
    this.root.querySelector('[data-account-form="register"]')?.addEventListener('submit', event => this.register(event));
    this.root.querySelector('[data-account-form="recover"]')?.addEventListener('submit', event => this.recover(event));
    this.root.querySelector('[data-account-form="reset"]')?.addEventListener('submit', event => this.reset(event));
    this.root.querySelector('[data-account-form="resend"]')?.addEventListener('submit', event => this.resend(event));
    this.root.querySelector('[data-account-form="delete"]')?.addEventListener('submit', event => this.deleteAccount(event));
    this.root.querySelector('[data-account-sync]')?.addEventListener('click', () => this.syncNow());
    this.root.querySelector('[data-account-export]')?.addEventListener('click', () => this.exportAccount());
    this.root.querySelector('[data-account-logout]')?.addEventListener('click', () => this.logout());
    this.root.querySelector('[data-journal-sync]')?.addEventListener('change', event => this.changeJournalConsent(event));
  }

  setBusy(active) {
    this.busy = Boolean(active);
    this.root.querySelectorAll('button,input').forEach(control => { control.disabled = this.busy; });
    this.root.toggleAttribute('aria-busy', this.busy);
  }

  setStatus(message, state = '') {
    const output = this.root.querySelector('[data-account-status]');
    if (!output) return;
    output.textContent = message;
    output.dataset.state = state;
  }

  async login(event) {
    event.preventDefault();
    if (this.busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    this.setBusy(true); this.setStatus('Confirmando sua conta…');
    const result = await this.auth.login(String(values.email || '').trim(), String(values.password || ''));
    this.setBusy(false);
    if (!result.ok) return this.setStatus(friendlyError(result), 'error');
    this.user = result.body?.user || this.auth.session?.user;
    this.prepareLocalForUser();
    this.render();
    this.setStatus('Sessão iniciada. Sincronizando seu universo…', 'success');
    await this.syncNow({ quiet:true });
  }

  async register(event) {
    event.preventDefault();
    if (this.busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const password = String(values.password || '');
    if (password.length < 12) return this.setStatus('Use uma senha com pelo menos 12 caracteres.', 'error');
    if (password !== String(values.confirm || '')) return this.setStatus('As senhas não conferem.', 'error');
    if (values.age !== 'on') return this.setStatus('A conta é destinada a pessoas com 18 anos ou mais.', 'error');
    this.setBusy(true); this.setStatus('Criando a conta protegida…');
    const email = String(values.email || '').trim();
    const result = await this.auth.register(email, password, String(values.name || '').trim(), true);
    this.setBusy(false);
    if (!result.ok) return this.setStatus(friendlyError(result), 'error');
    if (result.body?.access_token) {
      this.user = result.body.user || this.auth.session?.user;
      this.prepareLocalForUser();
      this.render();
      await this.syncNow({ quiet:true });
      return;
    }
    this.mode = 'verify';
    this.render();
    this.root.querySelector('[data-account-form="resend"] input[name="email"]').value = email;
    this.setStatus('Conta preparada. Confirme o link enviado ao seu e-mail.', 'success');
  }

  async resend(event) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email') || '').trim();
    this.setBusy(true); this.setStatus('Solicitando uma nova confirmação…');
    const result = await this.auth.resendVerification(email);
    this.setBusy(false);
    this.setStatus(result.ok ? 'Se o cadastro estiver pendente, um novo link será enviado.' : friendlyError(result), result.ok ? 'success' : 'error');
  }

  async recover(event) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email') || '').trim();
    this.setBusy(true); this.setStatus('Preparando a recuperação…');
    const result = await this.auth.recoverPassword(email);
    this.setBusy(false);
    this.setStatus(result.ok ? 'Se a conta existir, o link de recuperação será enviado ao e-mail informado.' : friendlyError(result), result.ok ? 'success' : 'error');
  }

  async reset(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const password = String(values.password || '');
    if (password.length < 12 || password !== String(values.confirm || '')) return this.setStatus('Use 12 caracteres ou mais e confirme a mesma senha.', 'error');
    this.setBusy(true); this.setStatus('Guardando a nova senha…');
    const result = await this.auth.updatePassword(password);
    this.setBusy(false);
    if (!result.ok) return this.setStatus(friendlyError(result), 'error');
    const account = await this.auth.account();
    this.user = account.body?.user || this.auth.session?.user;
    this.prepareLocalForUser();
    this.mode = 'login';
    this.render();
    this.setStatus('Senha atualizada. Sua sessão está protegida.', 'success');
    await this.syncNow({ quiet:true });
  }

  syncMeta() {
    const meta = store.get(SYNC_META_KEY, {});
    return meta && typeof meta === 'object' ? meta : {};
  }

  accountCacheKey(userId) {
    return `${ACCOUNT_CACHE_PREFIX}${String(userId || '').slice(0, 64)}`;
  }

  prepareLocalForUser() {
    if (!this.user?.id) return;
    const meta = this.syncMeta();
    if (!meta.userId) {
      const cached = store.get(this.accountCacheKey(this.user.id), null);
      this.applying = true;
      try {
        if (cached?.meta?.userId === this.user.id) {
          if (cached.school) store.set(SCHOOL_STORAGE_KEY, cached.school);
          if (Array.isArray(cached.journal)) store.set(JOURNAL_STORAGE_KEY, cached.journal);
          if (cached.daily) store.set(DAILY_STORAGE_KEY, cached.daily);
          store.set(SYNC_META_KEY, cached.meta);
        } else {
          store.set(SYNC_META_KEY, {
            userId:this.user.id,
            journalIds:[],
            journalSyncEnabled:false,
            schoolChangedAt:normalizeSchoolState(store.get(SCHOOL_STORAGE_KEY)).lastStudiedAt || null,
            syncedAt:null,
            release:'V189'
          });
        }
      } finally { this.applying = false; }
    }
    if (meta.userId && meta.userId !== this.user.id) {
      this.applying = true;
      try {
        store.set(this.accountCacheKey(meta.userId), {
          school:store.get(SCHOOL_STORAGE_KEY),
          journal:store.get(JOURNAL_STORAGE_KEY, []),
          daily:store.get(DAILY_STORAGE_KEY),
          meta
        });
        const cached = store.get(this.accountCacheKey(this.user.id), null);
        if (cached?.school) store.set(SCHOOL_STORAGE_KEY, cached.school); else store.remove(SCHOOL_STORAGE_KEY);
        if (Array.isArray(cached?.journal)) store.set(JOURNAL_STORAGE_KEY, cached.journal); else store.remove(JOURNAL_STORAGE_KEY);
        if (cached?.daily) store.set(DAILY_STORAGE_KEY, cached.daily); else store.remove(DAILY_STORAGE_KEY);
        store.set(SYNC_META_KEY, cached?.meta?.userId === this.user.id ? cached.meta : {
          userId:this.user.id,
          journalIds:[],
          journalSyncEnabled:false,
          schoolChangedAt:null,
          syncedAt:null,
          release:'V189'
        });
      } finally { this.applying = false; }
    }
    const current = this.syncMeta();
    this.journalEnabled = current.userId === this.user.id && current.journalSyncEnabled === true;
    globalThis.dispatchEvent?.(new CustomEvent('divina:account-sync-applied', { detail:{ school:true, journal:true, daily:true } }));
  }

  cacheAndSeparateCurrentAccount() {
    if (!this.user?.id) return;
    const meta = { ...this.syncMeta(), userId:this.user.id, journalSyncEnabled:this.journalEnabled, release:'V189' };
    this.applying = true;
    try {
      store.set(this.accountCacheKey(this.user.id), {
        school:store.get(SCHOOL_STORAGE_KEY),
        journal:store.get(JOURNAL_STORAGE_KEY, []),
        daily:store.get(DAILY_STORAGE_KEY),
        meta
      });
      store.remove(SCHOOL_STORAGE_KEY);
      store.remove(JOURNAL_STORAGE_KEY);
      store.remove(DAILY_STORAGE_KEY);
      store.remove(SYNC_META_KEY);
    } finally { this.applying = false; }
    globalThis.dispatchEvent?.(new CustomEvent('divina:account-sync-applied', { detail:{ school:true, journal:true, daily:true } }));
  }

  separateExpiredAccount() {
    const meta = this.syncMeta();
    if (!meta.userId) return;
    this.applying = true;
    try {
      store.set(this.accountCacheKey(meta.userId), {
        school:store.get(SCHOOL_STORAGE_KEY),
        journal:store.get(JOURNAL_STORAGE_KEY, []),
        daily:store.get(DAILY_STORAGE_KEY),
        meta
      });
      store.remove(SCHOOL_STORAGE_KEY);
      store.remove(JOURNAL_STORAGE_KEY);
      store.remove(DAILY_STORAGE_KEY);
      store.remove(SYNC_META_KEY);
    } finally { this.applying = false; }
    globalThis.dispatchEvent?.(new CustomEvent('divina:account-sync-applied', { detail:{ school:true, journal:true, daily:true } }));
    this.setStatus('Entre novamente para restaurar o conteúdo local separado desta conta.', '');
  }

  localSyncPayload(consentDecision) {
    const school = normalizeSchoolState(store.get(SCHOOL_STORAGE_KEY));
    const meta = this.syncMeta();
    const includeJournal = consentDecision === true || (consentDecision !== false && this.journalEnabled);
    const journal = includeJournal ? normalizeJournalEntries(store.get(JOURNAL_STORAGE_KEY, [])) : undefined;
    const knownIds = meta.userId === this.user?.id && Array.isArray(meta.journalIds) ? meta.journalIds : [];
    const activeIds = new Set((journal || []).map(entry => entry.id));
    const deletedJournalEntries = includeJournal ? knownIds.filter(id => !activeIds.has(id)).map(id => ({ id, deletedAt:new Date().toISOString() })) : undefined;
    return {
      requestId:uuid(),
      deviceId:'web-pwa-v189',
      school,
      schoolChangedAt:school.lastStudiedAt || meta.schoolChangedAt || null,
      ...(includeJournal ? { journal, deletedJournalEntries } : {}),
      ...(typeof consentDecision === 'boolean' ? { journalConsent:consentDecision } : {})
    };
  }

  async syncNow({ quiet = false, consentDecision } = {}) {
    if (this.busy || !this.user || navigator.onLine === false) {
      if (!quiet && navigator.onLine === false) this.setStatus('Sem conexão. Seus dados continuam guardados neste aparelho.', 'error');
      return null;
    }
    this.setBusy(true);
    if (!quiet) this.setStatus('Sincronizando sem enviar rascunhos…');
    const sentJournal = consentDecision === true || (consentDecision !== false && this.journalEnabled);
    const result = await this.auth.syncAccount(this.localSyncPayload(consentDecision));
    if (!result.ok) {
      this.setBusy(false);
      this.setStatus(friendlyError(result), 'error');
      return null;
    }
    let snapshot = result.body.data || {};
    if (!snapshot.daily && store.get(DAILY_STORAGE_KEY) && typeof this.auth.dailyCard === 'function') {
      const daily = await this.auth.dailyCard();
      if (daily.ok) snapshot = { ...snapshot, daily:daily.body };
    }
    this.setBusy(false);
    this.user = { ...this.user, ...result.body.user };
    this.profile = result.body.user;
    this.counts = { ...defaultCounts(), ...(result.body.counts || {}) };
    this.purchases = Array.isArray(snapshot.purchases) ? snapshot.purchases : [];
    this.entitlements = Array.isArray(snapshot.entitlements) ? snapshot.entitlements : [];
    this.journalEnabled = result.body.settings?.journalSyncEnabled === true;
    this.applySync(snapshot);
    this.render();
    this.setStatus('Sincronização concluída no STAGING.', 'success');
    if (this.journalEnabled && !sentJournal) {
      clearTimeout(this.syncTimer);
      this.syncTimer = setTimeout(() => this.syncNow({ quiet:true }), 250);
    }
    return result.body;
  }

  applySync(data) {
    this.applying = true;
    try {
      const school = normalizeSchoolState(data.school || store.get(SCHOOL_STORAGE_KEY));
      store.set(SCHOOL_STORAGE_KEY, school);
      let journalIds = this.syncMeta().journalIds || [];
      if (this.journalEnabled && Array.isArray(data.journal)) {
        const deletedIds = new Set(Array.isArray(data.journalDeletedIds) ? data.journalDeletedIds.map(String) : []);
        const localJournal = normalizeJournalEntries(store.get(JOURNAL_STORAGE_KEY, [])).filter(entry => !deletedIds.has(entry.id));
        const journal = mergeJournalEntries(localJournal, data.journal);
        store.set(JOURNAL_STORAGE_KEY, journal);
        journalIds = journal.map(entry => entry.id);
      }
      if (data.daily?.local_date && Number.isInteger(Number(data.daily.card_id))) {
        const localDaily = store.get(DAILY_STORAGE_KEY);
        store.set(DAILY_STORAGE_KEY, createAccountDailyRecord(data.daily, localDaily?.intention || ''));
      }
      store.set(SYNC_META_KEY, {
        userId:this.user.id,
        journalIds,
        journalSyncEnabled:this.journalEnabled,
        schoolChangedAt:school.lastStudiedAt || null,
        syncedAt:new Date().toISOString(),
        release:'V189'
      });
      store.set(this.accountCacheKey(this.user.id), {
        school,
        journal:store.get(JOURNAL_STORAGE_KEY, []),
        daily:store.get(DAILY_STORAGE_KEY),
        meta:store.get(SYNC_META_KEY)
      });
      globalThis.dispatchEvent?.(new CustomEvent('divina:account-sync-applied', { detail:{ school:true, journal:this.journalEnabled, daily:Boolean(data.daily) } }));
    } finally {
      this.applying = false;
    }
  }

  async changeJournalConsent(event) {
    const enabled = event.currentTarget.checked;
    if (enabled && !confirm('Ativar a sincronização do Diário privado? Entradas salvas, textos e revisões serão enviados ao Supabase STAGING. Rascunhos, IA, Admin e analytics continuam fora.')) {
      event.currentTarget.checked = false;
      return;
    }
    const result = await this.syncNow({ consentDecision:enabled });
    if (!result) {
      event.currentTarget.checked = this.journalEnabled;
      return;
    }
    announce(enabled ? 'Sincronização privada do Diário ativada.' : 'Sincronização do Diário pausada. A cópia já sincronizada não foi apagada.');
  }

  async exportAccount() {
    if (this.busy) return;
    this.setBusy(true); this.setStatus('Reunindo sua cópia privada…');
    const result = await this.auth.exportAccount();
    this.setBusy(false);
    if (!result.ok) return this.setStatus(friendlyError(result), 'error');
    const blob = new Blob([JSON.stringify(result.body, null, 2)], { type:'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `divina-bruxa-dados-${new Date().toISOString().slice(0, 10)}.json`;
    link.rel = 'noopener';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    this.setStatus('Cópia privada preparada. Guarde o arquivo com cuidado.', 'success');
  }

  async logout() {
    if (this.busy) return;
    this.setBusy(true); this.setStatus('Encerrando a sessão deste aparelho…');
    this.cacheAndSeparateCurrentAccount();
    await this.auth.logout();
    this.setBusy(false);
    this.user = null; this.profile = null; this.mode = 'login';
    this.render();
    this.setStatus('Sessão encerrada. O conteúdo local desta conta foi separado e será restaurado na próxima entrada.', 'success');
  }

  async deleteAccount(event) {
    event.preventDefault();
    if (this.busy || !this.user) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.confirmation !== 'EXCLUIR MINHA CONTA') return this.setStatus('Digite exatamente: EXCLUIR MINHA CONTA', 'error');
    if (!confirm('Última confirmação: excluir definitivamente esta conta e revogar todas as sessões?')) return;
    this.setBusy(true); this.setStatus('Confirmando sua identidade…');
    const recent = await this.auth.reauthenticate(String(values.password || ''));
    if (!recent.ok) {
      this.setBusy(false);
      return this.setStatus('A senha atual não foi confirmada. A conta permanece intacta.', 'error');
    }
    const result = await this.auth.deleteAccount({
      expectedUserId:this.user.id,
      confirmation:'EXCLUIR MINHA CONTA',
      requestId:uuid()
    });
    if (!result.ok) {
      this.setBusy(false);
      return this.setStatus(friendlyError(result), 'error');
    }
    if (values.removeLocal === 'on') {
      this.applying = true;
      try {
        store.remove(SCHOOL_STORAGE_KEY);
        store.remove(JOURNAL_STORAGE_KEY);
        store.remove(DAILY_STORAGE_KEY);
        store.remove(SYNC_META_KEY);
        store.remove(this.accountCacheKey(this.user.id));
      } finally { this.applying = false; }
    }
    await this.auth.logout();
    this.setBusy(false);
    this.user = null; this.profile = null; this.mode = 'login';
    this.render();
    this.setStatus('Conta excluída e sessões revogadas. O comprovante técnico não contém seu e-mail nem seus textos.', 'success');
  }
}
