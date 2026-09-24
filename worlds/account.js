import { CONFIG } from '../data/config.js';

const SESSION_KEY = 'divina-bruxa-3.auth-session.v1';
const REQUEST_TIMEOUT = 15000;

const clean = value => String(value ?? '').trim();
const escapeHTML = value => clean(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const errorText = body => clean(body?.error_description || body?.msg || body?.message || body?.error?.message || body?.error).slice(0, 240);

function normalizeSession(value) {
  if (!value?.access_token || !value?.refresh_token) return null;
  return {
    access_token:String(value.access_token),
    refresh_token:String(value.refresh_token),
    token_type:String(value.token_type || 'bearer'),
    expires_at:Number(value.expires_at || 0) || Math.floor(Date.now() / 1000) + Math.max(60, Number(value.expires_in || 3600)),
    user:value.user && typeof value.user === 'object' ? value.user : null
  };
}

function readSession() {
  try { return normalizeSession(JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')); }
  catch { return null; }
}

function writeSession(value) {
  const session = normalizeSession(value);
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
  return session;
}

async function request(path, { method = 'GET', body, token } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(`${CONFIG.supabaseUrl}/auth/v1${path}`, {
      method,
      signal:controller.signal,
      cache:'no-store',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
        apikey:CONFIG.supabasePublishableKey,
        ...(token ? { Authorization:`Bearer ${token}` } : {})
      },
      ...(body === undefined ? {} : { body:JSON.stringify(body) })
    });
    const payload = await response.json().catch(() => ({}));
    return { ok:response.ok, status:response.status, body:payload, message:errorText(payload) };
  } catch (error) {
    return { ok:false, status:0, body:{}, message:error?.name === 'AbortError' ? 'A conexão demorou demais.' : 'Não foi possível alcançar a conta agora.' };
  } finally { clearTimeout(timer); }
}

function messageFor(result, fallback) {
  const text = result?.message?.toLocaleLowerCase('pt-BR') || '';
  if (/invalid login credentials/.test(text)) return 'E-mail ou senha não conferem.';
  if (/email not confirmed/.test(text)) return 'Confirme o e-mail recebido antes de entrar.';
  if (/user already registered/.test(text)) return 'Este e-mail já possui uma conta.';
  if (/password/.test(text) && /characters|length|short/.test(text)) return 'Use uma senha mais longa e difícil de adivinhar.';
  if (/rate|too many/.test(text)) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  return fallback;
}

export function createAccountWorld({ announce }) {
  const root = document.querySelector('#accountApp');
  let session = readSession();
  let user = session?.user || null;
  let mode = 'login';
  let busy = false;
  let status = '';
  let statusError = false;
  let recoverySession = false;
  let restored = false;

  function callbackUrl(kind) {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('account-action', kind);
    url.hash = '/conta';
    return url.href;
  }

  function consumeRedirect() {
    const raw = location.hash.replace(/^#/, '');
    if (!raw.includes('access_token=') && !raw.includes('error=')) return;
    const values = new URLSearchParams(raw);
    const error = values.get('error_description') || values.get('error');
    const kind = values.get('type') || new URL(location.href).searchParams.get('account-action') || '';
    if (!error && values.get('access_token') && values.get('refresh_token')) {
      session = writeSession({
        access_token:values.get('access_token'),
        refresh_token:values.get('refresh_token'),
        token_type:values.get('token_type') || 'bearer',
        expires_in:Number(values.get('expires_in') || 3600)
      });
      recoverySession = kind === 'recovery';
      mode = recoverySession ? 'password' : 'login';
      status = recoverySession ? 'Identidade confirmada. Crie agora uma nova senha.' : 'E-mail confirmado. Sua Casa do Retorno está aberta.';
    } else if (error) {
      status = clean(error).slice(0, 240);
      statusError = true;
    }
    const url = new URL(location.href);
    url.search = '';
    url.hash = '/conta';
    history.replaceState(null, '', url.href);
  }

  consumeRedirect();

  async function validSession() {
    if (!session) return null;
    if (session.expires_at - Math.floor(Date.now() / 1000) > 90) return session;
    const refreshed = await request('/token?grant_type=refresh_token', { method:'POST', body:{ refresh_token:session.refresh_token } });
    if (!refreshed.ok) {
      session = writeSession(null);
      user = null;
      return null;
    }
    session = writeSession(refreshed.body);
    return session;
  }

  async function restore() {
    if (restored || !session) return;
    restored = true;
    const current = await validSession();
    if (!current) return render();
    const result = await request('/user', { token:current.access_token });
    if (!result.ok) {
      session = writeSession(null);
      user = null;
    } else {
      user = result.body?.user || result.body;
      session = writeSession({ ...current, user });
    }
    render();
  }

  function gateMarkup() {
    const title = mode === 'register' ? 'Criar sua Casa' : mode === 'recover' ? 'Recuperar a passagem' : mode === 'password' ? 'Criar nova senha' : 'Voltar para sua Casa';
    const form = mode === 'register' ? `
      <form data-account-form="register">
        <label><span>Como deseja ser chamada</span><input name="name" autocomplete="name" maxlength="80" required></label>
        <label><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label>
        <label><span>Senha</span><input name="password" type="password" autocomplete="new-password" minlength="8" required><small>Mínimo de 8 caracteres; prefira uma frase longa e única.</small></label>
        <label class="account-check"><input name="age" type="checkbox" value="yes" required><span>Declaro ter 18 anos ou mais.</span></label>
        <button type="submit"${busy ? ' disabled' : ''}>${busy ? 'CRIANDO…' : 'CRIAR CONTA'}</button>
      </form>` : mode === 'recover' ? `
      <form data-account-form="recover">
        <label><span>E-mail da conta</span><input name="email" type="email" autocomplete="email" required></label>
        <button type="submit"${busy ? ' disabled' : ''}>${busy ? 'ENVIANDO…' : 'ENVIAR PASSAGEM SEGURA'}</button>
      </form>` : mode === 'password' ? `
      <form data-account-form="password">
        <label><span>Nova senha</span><input name="password" type="password" autocomplete="new-password" minlength="8" required></label>
        <label><span>Repita a nova senha</span><input name="confirmation" type="password" autocomplete="new-password" minlength="8" required></label>
        <button type="submit"${busy ? ' disabled' : ''}>${busy ? 'PROTEGENDO…' : 'GUARDAR NOVA SENHA'}</button>
      </form>` : `
      <form data-account-form="login">
        <label><span>E-mail</span><input name="email" type="email" autocomplete="username" required></label>
        <label><span>Senha</span><input name="password" type="password" autocomplete="current-password" minlength="8" required></label>
        <button type="submit"${busy ? ' disabled' : ''}>${busy ? 'ABRINDO…' : 'ENTRAR'}</button>
      </form>`;
    return `<section class="account-gate">
      <div class="account-gate__sigil" aria-hidden="true">⌂</div>
      <div><p class="eyebrow">SESSÃO SOMENTE NESTA ABA</p><h2>${title}</h2><p>Senhas nunca entram nos arquivos do site. A sessão desaparece quando esta aba é encerrada.</p></div>
      ${status ? `<p class="account-status${statusError ? ' is-error' : ''}" role="status">${escapeHTML(status)}</p>` : ''}
      ${form}
      ${mode !== 'password' ? `<nav aria-label="Ações da Conta">
        <button type="button" data-account-mode="login"${mode === 'login' ? ' aria-current="page"' : ''}>Entrar</button>
        <button type="button" data-account-mode="register"${mode === 'register' ? ' aria-current="page"' : ''}>Criar conta</button>
        <button type="button" data-account-mode="recover"${mode === 'recover' ? ' aria-current="page"' : ''}>Esqueci a senha</button>
      </nav>` : ''}
    </section>`;
  }

  function homeMarkup() {
    const name = clean(user?.user_metadata?.display_name) || clean(user?.email).split('@')[0] || 'Presença';
    const verified = Boolean(user?.email_confirmed_at || user?.confirmed_at);
    return `<section class="account-home">
      <div class="account-home__welcome"><span aria-hidden="true">⌂</span><div><p class="eyebrow">A CASA RECONHECE VOCÊ</p><h2>${escapeHTML(name)}</h2><p>${escapeHTML(user?.email || '')}</p></div></div>
      <div class="account-state">
        <article><small>E-MAIL</small><b>${verified ? 'Confirmado' : 'Aguardando confirmação'}</b><span>${verified ? 'Identidade de e-mail verificada.' : 'Abra a mensagem enviada para concluir.'}</span></article>
        <article><small>SESSÃO</small><b>Protegida nesta aba</b><span>Nada foi gravado como senha ou segredo no aparelho.</span></article>
        <article><small>SINCRONIZAÇÃO</small><b>Somente quando você autorizar</b><span>O Diário continua local por padrão.</span></article>
      </div>
      ${status ? `<p class="account-status${statusError ? ' is-error' : ''}" role="status">${escapeHTML(status)}</p>` : ''}
      <div class="account-home__actions"><button type="button" data-refresh-account>ATUALIZAR ESTADO</button><button type="button" data-account-logout>SAIR DESTA ABA</button></div>
    </section>`;
  }

  function bind() {
    root.querySelectorAll('[data-account-mode]').forEach(button => button.addEventListener('click', () => {
      mode = button.dataset.accountMode;
      status = '';
      statusError = false;
      render();
    }));
    root.querySelector('[data-account-form]')?.addEventListener('submit', submit);
    root.querySelector('[data-account-logout]')?.addEventListener('click', logout);
    root.querySelector('[data-refresh-account]')?.addEventListener('click', async () => {
      restored = false;
      status = 'Atualizando a presença da conta…';
      render();
      await restore();
      status = user ? 'Estado da conta atualizado.' : 'A sessão terminou. Entre novamente.';
      statusError = !user;
      render();
    });
  }

  function render() {
    root.innerHTML = session && user && !recoverySession ? homeMarkup() : gateMarkup();
    bind();
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    busy = true;
    status = '';
    statusError = false;
    render();
    let result;
    if (form.dataset.accountForm === 'login') {
      result = await request('/token?grant_type=password', { method:'POST', body:{ email:clean(values.get('email')), password:String(values.get('password') || '') } });
      if (result.ok) {
        session = writeSession(result.body);
        user = session?.user || null;
        status = 'Sua Casa foi aberta nesta aba.';
        announce('Conta aberta com segurança.');
      } else { status = messageFor(result, 'Não foi possível entrar agora.'); statusError = true; }
    } else if (form.dataset.accountForm === 'register') {
      const age = values.get('age') === 'yes';
      result = age ? await request(`/signup?redirect_to=${encodeURIComponent(callbackUrl('verify'))}`, { method:'POST', body:{
        email:clean(values.get('email')), password:String(values.get('password') || ''),
        data:{ display_name:clean(values.get('name')).slice(0,80), age_declared_18_plus:true, age_declared_at:new Date().toISOString(), registration_release:'3.0.0' }
      } }) : { ok:false, message:'age-required' };
      if (result.ok) {
        if (result.body?.access_token) { session = writeSession(result.body); user = session?.user || null; }
        status = result.body?.access_token ? 'Conta criada e aberta nesta aba.' : 'Conta criada. Confirme o e-mail recebido para entrar.';
        mode = 'login';
        announce(status);
      } else { status = result.message === 'age-required' ? 'Confirme que tem 18 anos ou mais.' : messageFor(result, 'Não foi possível criar a conta agora.'); statusError = true; }
    } else if (form.dataset.accountForm === 'recover') {
      result = await request(`/recover?redirect_to=${encodeURIComponent(callbackUrl('recovery'))}`, { method:'POST', body:{ email:clean(values.get('email')) } });
      status = result.ok ? 'Se a conta existir, uma passagem segura chegará por e-mail.' : messageFor(result, 'Não foi possível enviar a recuperação agora.');
      statusError = !result.ok;
      if (result.ok) announce('Passagem de recuperação solicitada.');
    } else {
      const password = String(values.get('password') || '');
      const confirmation = String(values.get('confirmation') || '');
      const current = await validSession();
      if (password !== confirmation) result = { ok:false, message:'confirmation' };
      else if (!current) result = { ok:false, message:'session' };
      else result = await request('/user', { method:'PUT', token:current.access_token, body:{ password } });
      if (result.ok) {
        recoverySession = false;
        mode = 'login';
        status = 'Nova senha guardada. Sua Casa permanece aberta nesta aba.';
        const account = await request('/user', { token:session.access_token });
        user = account.ok ? account.body?.user || account.body : user;
        session = writeSession({ ...session, user });
        announce('Nova senha guardada.');
      } else {
        status = result.message === 'confirmation' ? 'As duas senhas precisam ser iguais.' : result.message === 'session' ? 'A passagem expirou. Solicite uma nova recuperação.' : messageFor(result, 'Não foi possível guardar a nova senha.');
        statusError = true;
      }
    }
    busy = false;
    render();
  }

  async function logout() {
    if (busy) return;
    busy = true;
    const current = session;
    if (current?.access_token) await request('/logout?scope=local', { method:'POST', token:current.access_token, body:{} });
    session = writeSession(null);
    user = null;
    restored = true;
    busy = false;
    status = 'A sessão desta aba foi encerrada.';
    statusError = false;
    render();
    announce('Conta fechada nesta aba.');
  }

  function activate() {
    render();
    restore();
  }

  return { activate, getSession:() => session, getUser:() => user };
}
