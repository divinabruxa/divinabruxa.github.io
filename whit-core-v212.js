/* DIVINA BRUXA — WHIT 2.0 CORE V212 · PRESENÇA LOCAL SEM API
   Núcleo aditivo: presença viva local, consentimento exato e memória controlada.
   Não chama modelo generativo. Não lê Diário, Tiragens ou Escola sem grant explícito. */

export const WHIT_V212 = Object.freeze({
  release: 'V212',
  presence: 'local',
  generation: 'disabled',
  modelApi: false,
  paidApi: false,
  solEnabled: false,
  sessionMemory: 'memory-only',
  persistentMemory: 'explicit-only',
  privateContext: 'exact-grant-only'
});

const CAPABILITIES = Object.freeze({
  'journal-single-entry': Object.freeze({ resourceType: 'journal_entry', label: 'uma entrada do Diário' }),
  'tarot-single-spread': Object.freeze({ resourceType: 'tarot_reading', label: 'uma tiragem' }),
  'school-single-lesson': Object.freeze({ resourceType: 'school_lesson', label: 'uma aula da Escola' }),
  'library-single-card': Object.freeze({ resourceType: 'tarot_card', label: 'uma carta da Biblioteca' })
});

const WHISPERS = Object.freeze({
  awake: Object.freeze([
    'A presença da Whit está ativa.',
    'O universo local está desperto.',
    'A Whit acompanha apenas o que esta tela revela.'
  ]),
  tarot: Object.freeze([
    'As cartas permanecem livres. Nenhuma leitura é enviada para IA.',
    'O símbolo está na mesa; o significado continua sob seu controle.'
  ]),
  school: Object.freeze([
    'A Escola está aberta. Whit só entra em uma aula quando você permitir.'
  ]),
  journal: Object.freeze([
    'Seu Diário continua privado. Whit só recebe uma entrada se você escolher compartilhá-la.'
  ]),
  idle: Object.freeze([
    'Whit está em modo local: presença sem consumo de API.',
    'Nada privado é lido silenciosamente.'
  ])
});

const cleanText = (value, limit = 180) =>
  String(value ?? '').replace(/\u0000/g, '').trim().slice(0, limit);

const safeKey = value => {
  const key = cleanText(value, 120);
  if (!/^[a-z0-9][a-z0-9._:-]{0,119}$/i.test(key)) throw new Error('Chave de memória inválida.');
  return key;
};

const exactId = value => {
  const id = cleanText(value, 180);
  if (!id || ['*', 'all', 'any', 'everything'].includes(id.toLowerCase())) {
    throw new Error('Whit exige um recurso exato; curingas não são permitidos.');
  }
  return id;
};

const safeJson = (value, limit = 8192) => {
  const raw = JSON.stringify(value ?? null);
  if (raw.length > limit) throw new Error('Conteúdo maior que o limite seguro da Whit.');
  return JSON.parse(raw);
};

const currentPage = () => {
  const active = document.querySelector('#app > .screen.active[id]');
  return cleanText(active?.id || location.hash.replace(/^#/, '') || 'home', 80);
};

const localIndex = (key, length) => {
  let hash = 2166136261;
  const text = String(key);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % Math.max(1, length);
};

const emit = (type, detail = {}) => {
  globalThis.dispatchEvent?.(new CustomEvent(type, { detail }));
};

export class WhitCoreV212 {
  constructor({ authClient } = {}) {
    this.authClient = authClient || null;
    this.sessionMemory = new Map();
    this.started = false;
    this.state = 'sleeping';
    this.page = 'home';
    this._unbind = [];
  }

  status() {
    return Object.freeze({
      release: WHIT_V212.release,
      presence: WHIT_V212.presence,
      generation: WHIT_V212.generation,
      modelApi: false,
      paidApi: false,
      solEnabled: false,
      state: this.state,
      page: this.page,
      authenticated: Boolean(this.authClient?.session?.access_token),
      sessionMemoryItems: this.sessionMemory.size
    });
  }

  awaken() {
    if (this.started) return this.status();
    this.started = true;
    this.state = document.visibilityState === 'hidden' ? 'resting' : 'awake';
    this.page = currentPage();

    const onVisibility = () => {
      this.state = document.visibilityState === 'hidden' ? 'resting' : 'awake';
      this.page = currentPage();
      emit('whit:presence', this.status());
    };

    const onNavigation = event => {
      const button = event.target?.closest?.('[data-go]');
      if (!button) return;
      this.page = cleanText(button.dataset.go || currentPage(), 80) || 'home';
      this.sessionMemory.set('navigation:last-page', this.page);
      emit('whit:presence', this.status());
    };

    document.addEventListener('visibilitychange', onVisibility, { passive: true });
    document.addEventListener('click', onNavigation, { passive: true, capture: true });
    this._unbind.push(() => document.removeEventListener('visibilitychange', onVisibility));
    this._unbind.push(() => document.removeEventListener('click', onNavigation, true));

    emit('whit:presence', this.status());
    return this.status();
  }

  sleep() {
    this._unbind.splice(0).forEach(unbind => {
      try { unbind(); } catch {}
    });
    this.started = false;
    this.state = 'sleeping';
    emit('whit:presence', this.status());
  }

  whisper(kind = 'idle') {
    const page = currentPage();
    const family = WHISPERS[kind] || WHISPERS[page] || WHISPERS.idle;
    const phrase = family[localIndex(`${kind}:${page}:${new Date().getHours()}`, family.length)];
    const detail = Object.freeze({ phrase, kind, page, local: true, apiUsed: false });
    emit('whit:whisper', detail);
    return detail;
  }

  rememberSession(key, value) {
    const normalizedKey = safeKey(key);
    this.sessionMemory.set(normalizedKey, safeJson(value, 4096));
    emit('whit:session-memory', { action: 'set', key: normalizedKey, persistent: false });
    return true;
  }

  recallSession(key) {
    const normalizedKey = safeKey(key);
    return this.sessionMemory.has(normalizedKey)
      ? safeJson(this.sessionMemory.get(normalizedKey), 4096)
      : null;
  }

  clearSessionMemory() {
    this.sessionMemory.clear();
    emit('whit:session-memory', { action: 'clear', persistent: false });
  }

  async userId() {
    let id = this.authClient?.session?.user?.id || '';
    if (!id && this.authClient?.account) {
      const account = await this.authClient.account();
      id = account?.body?.user?.id || '';
    }
    return cleanText(id, 80);
  }

  capabilitySpec(capability, resourceType) {
    const name = cleanText(capability, 80);
    const spec = CAPABILITIES[name];
    if (!spec) throw new Error('Capacidade da Whit não reconhecida.');
    if (resourceType && cleanText(resourceType, 80) !== spec.resourceType) {
      throw new Error('Tipo de recurso não corresponde à capacidade solicitada.');
    }
    return { capability: name, resourceType: spec.resourceType, label: spec.label };
  }

  async requestContextGrant({
    capability,
    resourceType,
    resourceId,
    scope = {},
    expiresAt = null,
    confirmed = false
  } = {}) {
    if (confirmed !== true) {
      emit('whit:consent-required', {
        capability: cleanText(capability, 80),
        resourceType: cleanText(resourceType, 80),
        resourceId: cleanText(resourceId, 180)
      });
      return { ok: false, status: 412, code: 'WHIT_EXPLICIT_CONSENT_REQUIRED' };
    }
    if (!this.authClient?.restRequest) return { ok: false, status: 503, code: 'WHIT_ACCOUNT_BRIDGE_UNAVAILABLE' };

    const spec = this.capabilitySpec(capability, resourceType);
    const id = exactId(resourceId);
    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, code: 'WHIT_ACCOUNT_REQUIRED' };

    const expiry = expiresAt ? new Date(expiresAt) : null;
    if (expiry && (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now())) {
      return { ok: false, status: 400, code: 'WHIT_INVALID_EXPIRY' };
    }

    const result = await this.authClient.restRequest('whit_context_grants?select=id,capability,resource_type,resource_id,scope,granted_at,expires_at,revoked_at', {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        user_id: userId,
        capability: spec.capability,
        resource_type: spec.resourceType,
        resource_id: id,
        scope: safeJson(scope, 2048),
        expires_at: expiry ? expiry.toISOString() : null
      }
    });

    if (result.ok) emit('whit:consent-changed', { action: 'granted', capability: spec.capability, resourceType: spec.resourceType, resourceId: id });
    return result;
  }

  async hasContextGrant({ capability, resourceType, resourceId } = {}) {
    if (!this.authClient?.restRequest) return false;
    const spec = this.capabilitySpec(capability, resourceType);
    const id = exactId(resourceId);
    const userId = await this.userId();
    if (!userId) return false;

    const query = [
      'whit_context_grants?select=id,expires_at,revoked_at',
      `&user_id=eq.${encodeURIComponent(userId)}`,
      `&capability=eq.${encodeURIComponent(spec.capability)}`,
      `&resource_type=eq.${encodeURIComponent(spec.resourceType)}`,
      `&resource_id=eq.${encodeURIComponent(id)}`,
      '&revoked_at=is.null',
      '&order=granted_at.desc&limit=5'
    ].join('');

    const result = await this.authClient.restRequest(query);
    if (!result.ok || !Array.isArray(result.body)) return false;
    return result.body.some(row => !row.expires_at || new Date(row.expires_at).getTime() > Date.now());
  }

  async revokeContextGrant(grantId, { confirmed = false } = {}) {
    if (confirmed !== true) return { ok: false, status: 412, code: 'WHIT_EXPLICIT_CONSENT_REQUIRED' };
    if (!this.authClient?.restRequest) return { ok: false, status: 503, code: 'WHIT_ACCOUNT_BRIDGE_UNAVAILABLE' };

    const id = exactId(grantId);
    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, code: 'WHIT_ACCOUNT_REQUIRED' };
    const result = await this.authClient.restRequest(
      `whit_context_grants?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}&revoked_at=is.null`,
      {
        method: 'PATCH',
        prefer: 'return=representation',
        body: { revoked_at: new Date().toISOString() }
      }
    );
    if (result.ok) emit('whit:consent-changed', { action: 'revoked', grantId: id });
    return result;
  }

  async memorySettings() {
    if (!this.authClient?.restRequest) return { ok: false, body: null };
    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, body: null };
    const result = await this.authClient.restRequest(
      `whit_settings?select=memory_enabled,saved_preference_enabled,explicit_memory_enabled,updated_at&user_id=eq.${encodeURIComponent(userId)}&limit=1`
    );
    if (!result.ok) return result;
    const row = Array.isArray(result.body) ? result.body[0] : null;
    return {
      ...result,
      body: row || {
        memory_enabled: true,
        saved_preference_enabled: true,
        explicit_memory_enabled: true,
        updated_at: null
      }
    };
  }

  async saveMemorySettings(settings = {}, { confirmed = false } = {}) {
    if (confirmed !== true) return { ok: false, status: 412, code: 'WHIT_EXPLICIT_CONSENT_REQUIRED' };
    if (!this.authClient?.restRequest) return { ok: false, status: 503, code: 'WHIT_ACCOUNT_BRIDGE_UNAVAILABLE' };
    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, code: 'WHIT_ACCOUNT_REQUIRED' };
    const body = {
      user_id: userId,
      memory_enabled: settings.memory_enabled !== false,
      saved_preference_enabled: settings.saved_preference_enabled !== false,
      explicit_memory_enabled: settings.explicit_memory_enabled !== false,
      updated_at: new Date().toISOString()
    };
    const result = await this.authClient.restRequest('whit_settings?on_conflict=user_id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body
    });
    if (result.ok) emit('whit:memory-settings', body);
    return result;
  }

  async remember(kind, key, value, { confirmed = false } = {}) {
    if (confirmed !== true) return { ok: false, status: 412, code: 'WHIT_EXPLICIT_CONSENT_REQUIRED' };
    if (!['preference', 'explicit'].includes(kind)) return { ok: false, status: 400, code: 'WHIT_MEMORY_KIND_INVALID' };
    if (!this.authClient?.restRequest) return { ok: false, status: 503, code: 'WHIT_ACCOUNT_BRIDGE_UNAVAILABLE' };

    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, code: 'WHIT_ACCOUNT_REQUIRED' };
    const settings = await this.memorySettings();
    if (!settings.ok) return settings;
    if (settings.body?.memory_enabled === false) return { ok: false, status: 403, code: 'WHIT_MEMORY_DISABLED' };
    if (kind === 'preference' && settings.body?.saved_preference_enabled === false) return { ok: false, status: 403, code: 'WHIT_PREFERENCE_MEMORY_DISABLED' };
    if (kind === 'explicit' && settings.body?.explicit_memory_enabled === false) return { ok: false, status: 403, code: 'WHIT_EXPLICIT_MEMORY_DISABLED' };

    const memoryKey = safeKey(key);
    const result = await this.authClient.restRequest('whit_memories?on_conflict=user_id,kind,memory_key', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: {
        user_id: userId,
        kind,
        memory_key: memoryKey,
        value: safeJson(value, 8192),
        updated_at: new Date().toISOString()
      }
    });
    if (result.ok) emit('whit:memory-changed', { action: 'saved', kind, key: memoryKey });
    return result;
  }

  async recall(kind, key) {
    if (!['preference', 'explicit'].includes(kind) || !this.authClient?.restRequest) return null;
    const userId = await this.userId();
    if (!userId) return null;
    const memoryKey = safeKey(key);
    const result = await this.authClient.restRequest(
      `whit_memories?select=value,updated_at&user_id=eq.${encodeURIComponent(userId)}&kind=eq.${encodeURIComponent(kind)}&memory_key=eq.${encodeURIComponent(memoryKey)}&limit=1`
    );
    if (!result.ok || !Array.isArray(result.body) || !result.body[0]) return null;
    return safeJson(result.body[0].value, 8192);
  }

  async forget(kind, key, { confirmed = false } = {}) {
    if (confirmed !== true) return { ok: false, status: 412, code: 'WHIT_EXPLICIT_CONSENT_REQUIRED' };
    if (!['preference', 'explicit'].includes(kind) || !this.authClient?.restRequest) return { ok: false, status: 400, code: 'WHIT_MEMORY_KIND_INVALID' };
    const userId = await this.userId();
    if (!userId) return { ok: false, status: 401, code: 'WHIT_ACCOUNT_REQUIRED' };
    const memoryKey = safeKey(key);
    const result = await this.authClient.restRequest(
      `whit_memories?user_id=eq.${encodeURIComponent(userId)}&kind=eq.${encodeURIComponent(kind)}&memory_key=eq.${encodeURIComponent(memoryKey)}`,
      { method: 'DELETE', prefer: 'return=representation' }
    );
    if (result.ok) emit('whit:memory-changed', { action: 'forgotten', kind, key: memoryKey });
    return result;
  }

  generationRequest() {
    const result = Object.freeze({
      ok: false,
      status: 503,
      code: 'WHIT_GENERATION_DISABLED',
      release: WHIT_V212.release,
      apiUsed: false,
      creditsUsed: 0,
      message: 'A presença local da Whit está ativa; geração por modelo permanece desligada.'
    });
    emit('whit:generation-blocked', result);
    return result;
  }
}

export function createWhitCoreV212(options = {}) {
  return new WhitCoreV212(options);
}
