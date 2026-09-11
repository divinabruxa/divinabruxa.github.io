/* DIVINA BRUXA 2.0 — REBIRTH R011 · WHIT MEMORY GARDEN V310
   Memória visível, controlada e reversível.
   Não lê conteúdo privado. Não chama modelo. Persistência só muda por ação explícita. */

const RELEASE = 'V310';
const STYLE_ID = 'whitMemoryGardenV310Styles';
const PANEL_ID = 'whitMemoryGardenV310';

const safeText = (value, limit = 160) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const bool = value => value !== false;

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-memory-garden-v310.css?v=310';
  document.head.append(link);
}

function currentRoute() {
  return document.body?.dataset?.screen
    || document.querySelector('#app > .screen.active[id]')?.id
    || location.hash.replace(/^#/, '')
    || 'home';
}

export class WhitMemoryGardenV310 {
  constructor({
    core = globalThis.whit,
    presence = globalThis.divinaWhitV307?.presence,
    authClient = globalThis.divinaAuth
  } = {}) {
    this.core = core || null;
    this.presence = presence || null;
    this.authClient = authClient || null;
    this.root = null;
    this.loading = false;
    this.settings = null;
    this.memoryMetadata = [];
    this.abort = new AbortController();
    this.destroyed = false;
    this.lastError = '';
    installStyle();
    document.documentElement.dataset.whitMemoryGarden = 'v310';
    this.bind();
    this.tryMount();
  }

  bind() {
    const signal = this.abort.signal;
    document.addEventListener('divina:page-ready', event => {
      if (event.detail?.id === 'ai') this.tryMount(true);
    }, { signal });
    document.addEventListener('divina:route-ready', event => {
      if (event.detail?.id === 'ai') this.tryMount(true);
    }, { signal });
    addEventListener('whit:memory-settings', event => {
      this.settings = {
        memory_enabled: bool(event.detail?.memory_enabled),
        saved_preference_enabled: bool(event.detail?.saved_preference_enabled),
        explicit_memory_enabled: bool(event.detail?.explicit_memory_enabled)
      };
      this.render();
    }, { signal });
    addEventListener('whit:memory-changed', () => this.refreshPersistentMetadata(), { signal });
    addEventListener('divina:auth-state', () => {
      this.settings = null;
      this.memoryMetadata = [];
      if (currentRoute() === 'ai') this.refresh();
    }, { signal });
  }

  tryMount(refresh = false) {
    if (this.destroyed || currentRoute() !== 'ai') return false;
    const ai = document.querySelector('#aiApp');
    if (!ai) return false;

    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = PANEL_ID;
      panel.className = 'whit-memory-garden-v310';
      panel.setAttribute('aria-labelledby', 'whitMemoryGardenTitle');
      ai.append(panel);
    }
    this.root = panel;
    this.render();
    if (refresh) this.refresh();
    else queueMicrotask(() => this.refresh());
    return true;
  }

  signedIn() {
    return Boolean(this.authClient?.session);
  }

  sessionCount() {
    return Number(this.core?.status?.()?.sessionMemoryItems || 0);
  }

  async refresh() {
    if (this.loading || !this.root) return;
    this.loading = true;
    this.lastError = '';
    this.render();

    if (!this.signedIn()) {
      this.settings = null;
      this.memoryMetadata = [];
      this.loading = false;
      this.render();
      return;
    }

    try {
      const result = await this.core?.memorySettings?.();
      if (result?.ok) this.settings = result.body;
      else this.lastError = result?.code || 'Não foi possível carregar as escolhas de memória.';
      await this.refreshPersistentMetadata(false);
    } catch {
      this.lastError = 'A memória da conta não respondeu agora.';
    } finally {
      this.loading = false;
      this.render();
    }
  }

  async refreshPersistentMetadata(render = true) {
    if (!this.signedIn() || !this.authClient?.restRequest || !this.core?.userId) {
      this.memoryMetadata = [];
      if (render) this.render();
      return [];
    }
    try {
      const userId = await this.core.userId();
      if (!userId) return [];
      const result = await this.authClient.restRequest(
        `whit_memories?select=kind,memory_key,updated_at&user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc&limit=40`
      );
      if (result?.ok && Array.isArray(result.body)) {
        this.memoryMetadata = result.body.map(row => ({
          kind: row.kind === 'preference' ? 'preference' : 'explicit',
          key: safeText(row.memory_key, 120),
          updatedAt: safeText(row.updated_at, 80)
        })).filter(item => item.key);
      }
    } catch {}
    if (render) this.render();
    return this.memoryMetadata;
  }

  render() {
    if (!this.root) return;
    const sessionCount = this.sessionCount();
    const signedIn = this.signedIn();
    const settings = this.settings || {
      memory_enabled:true,
      saved_preference_enabled:true,
      explicit_memory_enabled:true
    };

    this.root.innerHTML = `
      <div class="wmg310__sky" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="wmg310__head">
        <div>
          <p class="eyebrow">WHIT · JARDIM DA MEMÓRIA</p>
          <h3 id="whitMemoryGardenTitle">Nada fica escondido.</h3>
          <p>A continuidade da Whit existe em camadas diferentes. Você escolhe o que pode permanecer.</p>
        </div>
        <span class="wmg310__seal" aria-hidden="true">✦</span>
      </header>

      <div class="wmg310__layers">
        <article>
          <span>01</span>
          <div><b>Memória desta sessão</b><p>Contexto operacional temporário. Não vira memória permanente por conta própria.</p></div>
          <em>${sessionCount} ${sessionCount === 1 ? 'item' : 'itens'}</em>
          <button type="button" data-wmg-clear-session ${sessionCount ? '' : 'disabled'}>Limpar sessão</button>
        </article>

        <article class="${signedIn ? '' : 'is-locked'}">
          <span>02</span>
          <div><b>Preferências salvas</b><p>Somente preferências que você escolher guardar na sua conta.</p></div>
          <em>${signedIn ? (settings.saved_preference_enabled === false ? 'desligada' : 'permitida') : 'requer conta'}</em>
        </article>

        <article class="${signedIn ? '' : 'is-locked'}">
          <span>03</span>
          <div><b>Memórias explícitas</b><p>Whit só conserva uma memória deste tipo quando você pedir de forma consciente.</p></div>
          <em>${signedIn ? (settings.explicit_memory_enabled === false ? 'desligada' : 'permitida') : 'requer conta'}</em>
        </article>
      </div>

      ${signedIn ? `
        <form class="wmg310__controls" data-wmg-form>
          <header><b>CONTROLE DA CONTA</b><small>Nenhuma alteração é feita até você tocar em salvar.</small></header>
          <label><input type="checkbox" name="memory_enabled" ${settings.memory_enabled === false ? '' : 'checked'}><span><b>Memória da Whit</b><small>Chave geral para memória persistente.</small></span></label>
          <label><input type="checkbox" name="saved_preference_enabled" ${settings.saved_preference_enabled === false ? '' : 'checked'}><span><b>Preferências</b><small>Permitir que preferências escolhidas sejam lembradas.</small></span></label>
          <label><input type="checkbox" name="explicit_memory_enabled" ${settings.explicit_memory_enabled === false ? '' : 'checked'}><span><b>Memórias explícitas</b><small>Permitir memórias que você pedir diretamente para guardar.</small></span></label>
          <button type="submit" ${this.loading ? 'disabled' : ''}>${this.loading ? 'CONFERINDO…' : 'SALVAR MINHAS ESCOLHAS'}</button>
        </form>

        <section class="wmg310__records" aria-label="Metadados de memórias persistentes">
          <header><div><b>MEMÓRIAS AUTORIZADAS</b><small>Somente nomes e datas aparecem aqui; o conteúdo não é exibido neste painel.</small></div><button type="button" data-wmg-refresh>Atualizar</button></header>
          ${this.memoryMetadata.length
            ? `<div>${this.memoryMetadata.map(item => `
                <article data-wmg-memory-key="${item.key}" data-wmg-memory-kind="${item.kind}">
                  <span>${item.kind === 'preference' ? 'PREFERÊNCIA' : 'EXPLÍCITA'}</span>
                  <b>${item.key}</b>
                  <small>${item.updatedAt ? new Date(item.updatedAt).toLocaleString('pt-BR') : 'data indisponível'}</small>
                  <button type="button" data-wmg-forget>Esquecer</button>
                </article>`).join('')}</div>`
            : '<p class="wmg310__empty">Nenhuma memória persistente encontrada nesta conta.</p>'}
        </section>`
        : `<aside class="wmg310__account"><span>◇</span><div><b>Memória persistente exige Conta.</b><p>A presença local da Whit continua funcionando sem conta e sem API paga.</p></div><button type="button" data-go="login">ABRIR CONTA</button></aside>`}

      <footer class="wmg310__truth">
        <span aria-hidden="true">✦</span>
        <p><b>Whit não possui memória secreta.</b><small>Texto do Diário, perguntas de Tiragem, notas da Escola e conversas não entram aqui automaticamente.</small></p>
      </footer>
      ${this.lastError ? `<p class="wmg310__error" role="status">${this.lastError}</p>` : ''}`;

    this.bindPanel();
  }

  bindPanel() {
    this.root.querySelector('[data-wmg-clear-session]')?.addEventListener('click', () => {
      this.core?.clearSessionMemory?.();
      this.presence?.show?.('Memória desta sessão limpa. O que não foi salvo explicitamente não permanece.', {
        tone:'consent', duration:3600
      });
      this.render();
    });

    this.root.querySelector('[data-wmg-refresh]')?.addEventListener('click', () => this.refresh());

    this.root.querySelector('[data-wmg-form]')?.addEventListener('submit', async event => {
      event.preventDefault();
      if (this.loading) return;
      const form = event.currentTarget;
      const next = {
        memory_enabled: form.elements.memory_enabled.checked,
        saved_preference_enabled: form.elements.saved_preference_enabled.checked,
        explicit_memory_enabled: form.elements.explicit_memory_enabled.checked
      };
      const confirmed = globalThis.confirm
        ? globalThis.confirm('Salvar estas escolhas de memória da Whit na sua conta?')
        : true;
      if (!confirmed) return;

      this.loading = true;
      this.render();
      try {
        const result = await this.core?.saveMemorySettings?.(next, { confirmed:true });
        if (result?.ok) {
          this.settings = next;
          this.presence?.show?.('Suas escolhas de memória foram atualizadas.', { tone:'consent', duration:3200 });
        } else {
          this.lastError = result?.message || result?.code || 'Não foi possível salvar agora.';
        }
      } catch {
        this.lastError = 'Não foi possível salvar agora.';
      } finally {
        this.loading = false;
        this.render();
      }
    });

    this.root.querySelectorAll('[data-wmg-forget]').forEach(button => button.addEventListener('click', async () => {
      const row = button.closest('[data-wmg-memory-key]');
      const key = row?.dataset.wmgMemoryKey;
      const kind = row?.dataset.wmgMemoryKind;
      if (!key || !kind) return;
      const confirmed = globalThis.confirm
        ? globalThis.confirm(`Esquecer “${key}” da memória persistente da Whit?`)
        : true;
      if (!confirmed) return;
      button.disabled = true;
      try {
        const result = await this.core?.forget?.(kind, key, { confirmed:true });
        if (result?.ok) {
          this.memoryMetadata = this.memoryMetadata.filter(item => !(item.key === key && item.kind === kind));
          this.presence?.show?.('Essa memória foi apagada da sua conta.', { tone:'consent', duration:3000 });
          this.render();
        } else {
          button.disabled = false;
        }
      } catch {
        button.disabled = false;
      }
    }));
  }

  status() {
    return Object.freeze({
      release:RELEASE,
      mounted:Boolean(this.root?.isConnected),
      signedIn:this.signedIn(),
      sessionMemoryItems:this.sessionCount(),
      persistentMetadataItems:this.memoryMetadata.length,
      persistentContentDisplayed:false,
      privateScan:false,
      generation:false,
      paidModelCalls:false
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    this.root?.remove();
    delete document.documentElement.dataset.whitMemoryGarden;
  }
}

export const createWhitMemoryGardenV310 = options => new WhitMemoryGardenV310(options);
