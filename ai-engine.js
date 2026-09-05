/* DIVINA BRUXA — ORBE IA CELESTIAL V141
   Conversa consciente, contexto controlado e créditos demonstrativos auditáveis. */

import { escapeHTML, store } from './storage.js';
import {
  AI_POLICY,
  AI_HISTORY_KEY,
  AI_DRAFT_KEY,
  AI_SETTINGS_KEY,
  AI_TAROT_SELECTION_KEY,
  aiDisclosure,
  createAIMessage,
  normalizeAIHistory,
  createAIRequest,
  normalizeTarotContext,
  privateAIExport
} from './ai-policy.js?v=141';
import { canSpend, creditState, creditUsage, grantCredits, spend } from './ai-credits.js?v=141';
import { JOURNAL_AI_SELECTION_KEY } from './journal-policy.js?v=140';

const safe = value => escapeHTML(value ?? '');
const money = value => Number(value).toFixed(2).replace('.', ',');
const modeEntries = () => Object.values(AI_POLICY.modes);
const formatTime = value => {
  try { return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
  catch { return ''; }
};

export class AIEngine {
  constructor(root, config = {}) {
    this.root = root?.id === 'aiApp' ? root : document.querySelector('#aiApp');
    if (!this.root) return;
    this.config = config;
    this.history = normalizeAIHistory(store.get(AI_HISTORY_KEY, []));
    const settings = store.get(AI_SETTINGS_KEY, {});
    this.modeId = AI_POLICY.modes[settings?.mode]?.enabled ? settings.mode : 'support';
    this.pendingPack = 0;
    this.pendingClear = false;
    this.tarotContext = null;
    this.sending = false;
    this.abortController = null;
    this.requestTimes = [];
    this.renderShell();
    this.bind();
    this.restoreDraft();
    this.renderModes();
    this.renderHistory();
    this.updateCredits();
    this.updateConnection();
    this.prepareJournalSelection();
    this.prepareTarotSelection();
  }

  notify(message) {
    window.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
  }

  renderShell() {
    this.root.innerHTML = `
      <section class="ai-command" aria-label="Estado da Orbe IA">
        <div class="ai-command-title"><span aria-hidden="true">✦</span><p><b>Conversa protegida</b><small>Contexto mínimo · Web Search desligada · chave somente no servidor</small></p></div>
        <div class="ai-command-state"><span data-ai-connection></span><span>STAGING</span></div>
      </section>

      <section class="ai-celestial-workspace">
        <aside class="ai-orbit-panel" aria-labelledby="aiModesTitle">
          <header><p class="eyebrow">ÓRBITAS DA CONVERSA</p><h3 id="aiModesTitle">Escolha a presença.</h3></header>
          <div class="ai-mode-list" role="radiogroup" aria-label="Modo da Orbe IA">${modeEntries().map(mode => `
            <button type="button" data-ai-mode="${mode.id}" role="radio" aria-checked="false" ${mode.enabled ? '' : 'disabled'}>
              <span aria-hidden="true">${mode.sigil}</span><span><b>${safe(mode.planet)}</b><small>${safe(mode.label)}</small></span><em>${mode.enabled ? `${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}` : 'OFF'}</em>
            </button>`).join('')}</div>

          <label id="personaField" class="ai-persona" hidden><span>Figura simbólica</span><input id="aiPersona" maxlength="100" autocomplete="off" placeholder="Ex.: uma artista que admiro"></label>
          <p id="channelNotice" class="ai-mode-disclosure" hidden></p>

          <section class="ai-balance" aria-labelledby="aiBalanceTitle">
            <div><p class="eyebrow">SALDO DEMONSTRATIVO</p><h4 id="aiBalanceTitle"><strong data-ai-balance>400</strong> créditos</h4></div>
            <span class="ai-balance-ring" aria-hidden="true"><i data-ai-balance-ring></i></span>
            <div class="ai-balance-meter" aria-hidden="true"><i data-ai-meter></i></div>
            <p><span data-ai-today></span><small>Limite local de proteção: ${AI_POLICY.limits.dailyCredits} créditos por dia.</small></p>
          </section>

          <section class="ai-membership">
            <span aria-hidden="true">◇</span><p><b>Orbe IA · R$ 89,90/mês</b><small>400 créditos mensais. Premium é separado e não inclui IA ilimitada.</small></p>
            <button type="button" data-ai-subscription>Ver assinatura protegida</button>
          </section>
        </aside>

        <section class="ai-conversation" aria-labelledby="aiConversationTitle">
          <header class="ai-conversation-head"><div><p class="eyebrow">WHIT · ORBE IA</p><h3 id="aiConversationTitle">Converse com presença.</h3></div><div><span class="ai-private-dot" aria-hidden="true"></span><small>histórico local</small></div></header>
          <div class="ai-quick-prompts" aria-label="Começos de conversa"></div>
          <div id="chat" class="chat ai-chat" role="log" aria-live="polite" aria-relevant="additions"></div>
          <div data-ai-journal-slot></div>
          <form id="chatForm" class="chat-form ai-composer">
            <label for="chatInput">Sua mensagem</label>
            <textarea id="chatInput" required maxlength="${AI_POLICY.limits.maxMessageCharacters}" rows="3" placeholder="Escreva para a Orbe…"></textarea>
            <div class="ai-composer-meta"><span data-ai-character-count>0 / ${AI_POLICY.limits.maxMessageCharacters}</span><span>Busca na web: OFF</span></div>
            <label class="ai-consent"><input type="checkbox" id="aiConsent"><span>Entendo que esta é uma experiência simbólica gerada por IA e autorizo o envio desta mensagem ao servidor seguro.</span></label>
            <p class="ai-consent-error" data-ai-consent-error hidden>Marque o consentimento antes de enviar.</p>
            <div class="ai-composer-actions"><button type="submit" class="primary" data-ai-send>Enviar · <span data-ai-send-cost>1 crédito</span></button><button type="button" class="text-button" data-ai-stop hidden>Interromper</button></div>
          </form>
        </section>
      </section>

      <section class="ai-control-deck" aria-labelledby="aiControlTitle">
        <header><div><p class="eyebrow">CONTROLE E PORTABILIDADE</p><h3 id="aiControlTitle">Você governa o contexto.</h3></div><p>O Admin e o analytics não recebem suas mensagens. O histórico desta demonstração fica neste aparelho.</p></header>
        <div class="ai-control-grid">
          <section class="ai-history-controls"><span aria-hidden="true">◇</span><div><b>Histórico privado</b><small data-ai-history-count></small></div><button type="button" data-ai-export>Baixar conversa</button><button type="button" data-ai-clear>Limpar histórico</button></section>
          <section class="ai-ledger-summary"><span aria-hidden="true">⌁</span><div><b>Ledger demonstrativo</b><small data-ai-ledger-summary></small></div></section>
          <section class="ai-web-off"><span aria-hidden="true">⊘</span><div><b>Web Search desligada</b><small>A Orbe não pesquisa nem abre páginas externas nesta versão.</small></div></section>
        </div>
        <div class="ai-inline-confirm" data-ai-clear-box hidden role="alert"><p><b>Apagar toda a conversa deste aparelho?</b><small>Baixe uma cópia antes se quiser preservar o texto.</small></p><div><button type="button" data-ai-clear-cancel>Manter histórico</button><button type="button" class="danger" data-ai-clear-confirm>Sim, apagar</button></div></div>

        <section class="ai-credit-store" aria-labelledby="aiPacksTitle">
          <header><div><p class="eyebrow">CRÉDITOS EXTRAS · SANDBOX</p><h4 id="aiPacksTitle">Simulação sem cobrança.</h4></div><p>Nenhum cartão é solicitado. A produção exigirá confirmação, idempotência e recibo do servidor.</p></header>
          <div class="ai-pack-grid">${AI_POLICY.packs.map(pack => `<button type="button" data-ai-pack="${pack.credits}"><b>+${pack.credits}</b><span>créditos</span><em>R$ ${money(pack.priceBRL)}</em><small>Simular pacote</small></button>`).join('')}</div>
          <div class="ai-inline-confirm" data-ai-pack-box hidden role="alert"></div>
        </section>

        <footer class="ai-safety-copy"><span aria-hidden="true">✦</span><p><b>Reflexão, não autoridade.</b><small>A Orbe não lê pensamentos, não é uma pessoa real e não substitui apoio médico, psicológico, jurídico ou financeiro. Em emergência, procure ajuda humana imediata.</small></p></footer>
      </section>`;

    this.chat = this.root.querySelector('#chat');
    this.form = this.root.querySelector('#chatForm');
    this.input = this.root.querySelector('#chatInput');
    this.persona = this.root.querySelector('#aiPersona');
    this.consent = this.root.querySelector('#aiConsent');
  }

  bind() {
    this.root.querySelector('.ai-mode-list').addEventListener('click', event => {
      const button = event.target.closest('[data-ai-mode]');
      if (!button || button.disabled) return;
      this.setMode(button.dataset.aiMode);
    });
    this.form.addEventListener('submit', event => { event.preventDefault(); this.send(); });
    this.input.addEventListener('input', () => {
      store.set(AI_DRAFT_KEY, { text: this.input.value, at: new Date().toISOString() });
      this.updateCharacterCount();
      this.root.querySelector('[data-ai-consent-error]').hidden = true;
    });
    this.root.querySelector('[data-ai-stop]').addEventListener('click', () => this.abortController?.abort());
    this.root.querySelector('[data-ai-subscription]').addEventListener('click', () => globalThis.orbe?.go?.('subscriptions'));
    this.root.querySelector('[data-ai-export]').addEventListener('click', () => this.exportHistory());
    this.root.querySelector('[data-ai-clear]').addEventListener('click', () => this.showClearConfirmation());
    this.root.querySelector('[data-ai-clear-cancel]').addEventListener('click', () => this.hideClearConfirmation());
    this.root.querySelector('[data-ai-clear-confirm]').addEventListener('click', () => this.clearHistory());
    this.root.querySelector('.ai-pack-grid').addEventListener('click', event => {
      const button = event.target.closest('[data-ai-pack]');
      if (button) this.showPackConfirmation(Number(button.dataset.aiPack));
    });
    this.root.addEventListener('click', event => {
      const prompt = event.target.closest('[data-ai-prompt]');
      if (prompt) {
        this.input.value = prompt.dataset.aiPrompt;
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        this.input.focus();
      }
      if (event.target.closest('[data-ai-pack-cancel]')) this.hidePackConfirmation();
      if (event.target.closest('[data-ai-pack-confirm]')) this.confirmPack();
    });
    window.addEventListener('online', () => this.updateConnection());
    window.addEventListener('offline', () => this.updateConnection());
    window.addEventListener('divina:journal-ai-selected', () => this.prepareJournalSelection());
    window.addEventListener('divina:tarot-ai-selected', () => this.prepareTarotSelection());
  }

  restoreDraft() {
    const draft = store.get(AI_DRAFT_KEY);
    if (draft && typeof draft.text === 'string') this.input.value = draft.text.slice(0, AI_POLICY.limits.maxMessageCharacters);
    this.updateCharacterCount();
  }

  setMode(modeId) {
    if (!AI_POLICY.modes[modeId]?.enabled) return;
    this.modeId = modeId;
    store.set(AI_SETTINGS_KEY, { mode: modeId });
    this.renderModes();
  }

  renderModes() {
    const mode = AI_POLICY.modes[this.modeId];
    this.root.querySelectorAll('[data-ai-mode]').forEach(button => {
      const active = button.dataset.aiMode === this.modeId;
      button.setAttribute('aria-checked', String(active));
      button.classList.toggle('active', active);
    });
    const channel = this.modeId === 'channel';
    this.root.querySelector('#personaField').hidden = !channel;
    const notice = this.root.querySelector('#channelNotice');
    notice.hidden = !channel;
    notice.textContent = channel ? aiDisclosure('channel') : '';
    const cost = this.root.querySelector('[data-ai-send-cost]');
    cost.textContent = `${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}`;
    this.renderQuickPrompts();
  }

  renderQuickPrompts() {
    const prompts = {
      support: ['Quero organizar o que estou sentindo.', 'Ajude-me a enxergar esta situação com calma.', 'Faça uma pergunta para eu refletir.'],
      tarot: ['Ajude-me a relacionar os símbolos desta leitura.', 'Como posso integrar o conselho das cartas?', 'Quero observar um padrão sem determinismo.'],
      channel: ['Quero uma dramatização simbólica para reflexão.', 'Crie um diálogo ficcional sobre esta escolha.', 'Faça uma pergunta na voz simbólica escolhida.']
    }[this.modeId] || [];
    this.root.querySelector('.ai-quick-prompts').innerHTML = prompts.map(prompt => `<button type="button" data-ai-prompt="${safe(prompt)}">${safe(prompt)}</button>`).join('');
  }

  renderHistory() {
    const intro = `<article class="bubble bot ai-welcome"><span aria-hidden="true">✦</span><div><b>Eu sou Whit.</b><p>Posso acolher perguntas e refletir sobre símbolos. Você escolhe o que entra nesta conversa.</p><small>${safe(aiDisclosure(this.modeId))}</small></div></article>`;
    this.chat.innerHTML = intro + this.history.map(message => `<article class="bubble ${message.role === 'user' ? 'user' : 'bot'}"><div><p>${safe(message.content).replace(/\n/g, '<br>')}</p><small>${message.role === 'user' ? 'VOCÊ' : 'WHIT'} · ${safe(formatTime(message.at))}</small></div></article>`).join('');
    this.chat.scrollTop = this.chat.scrollHeight;
    const count = this.root.querySelector('[data-ai-history-count]');
    count.textContent = `${this.history.length} ${this.history.length === 1 ? 'mensagem preservada' : 'mensagens preservadas'} neste aparelho.`;
  }

  persistHistory() {
    this.history = normalizeAIHistory(this.history);
    store.set(AI_HISTORY_KEY, this.history);
    this.renderHistory();
  }

  updateCharacterCount() {
    this.root.querySelector('[data-ai-character-count]').textContent = `${this.input.value.length} / ${AI_POLICY.limits.maxMessageCharacters}`;
  }

  updateCredits() {
    const state = creditState();
    const usage = creditUsage(state);
    this.root.querySelector('[data-ai-balance]').textContent = state.balance.toLocaleString('pt-BR');
    this.root.querySelector('[data-ai-today]').textContent = `${usage.todayRemaining} créditos disponíveis hoje`;
    this.root.querySelector('[data-ai-meter]').style.width = `${Math.min(100, state.balance / Math.max(AI_POLICY.demoCredits, state.granted) * 100)}%`;
    this.root.querySelector('[data-ai-balance-ring]').style.setProperty('--ai-credit-angle', `${Math.min(360, state.balance / Math.max(1, state.granted) * 360)}deg`);
    this.root.querySelector('[data-ai-ledger-summary]').textContent = `${state.entries.length} eventos locais · ${state.consumed} créditos consumidos · nenhum texto de conversa.`;
  }

  updateConnection() {
    const status = this.root.querySelector('[data-ai-connection]');
    const online = navigator.onLine !== false;
    const ready = online && Boolean(this.config.apiBase) && this.config.aiEnabled !== false;
    status.textContent = ready ? 'Servidor seguro disponível' : online ? 'Servidor seguro ainda não conectado' : 'Offline · IA indisponível';
    status.dataset.ready = String(ready);
  }

  prepareJournalSelection() {
    const selected = store.get(JOURNAL_AI_SELECTION_KEY);
    if (!selected || selected.consentScope !== 'single-entry' || typeof selected.text !== 'string') return;
    this.clearTarotSelection(false);
    const cards = Array.isArray(selected.cards) && selected.cards.length ? `\nCartas relacionadas: ${selected.cards.join(', ')}` : '';
    const question = selected.question ? `\nIntenção: ${selected.question}` : '';
    const tags = selected.tags ? `\nEtiquetas: ${selected.tags}` : '';
    this.input.value = `Quero refletir somente sobre esta entrada que escolhi no meu Diário.\nTítulo: ${String(selected.title || 'Memória da Orbe')}\nReflexão: ${selected.text.slice(0, 4200)}${question}${cards}${tags}`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text: this.input.value, source: 'single-journal-entry', at: new Date().toISOString() });
    const slot = this.root.querySelector('[data-ai-journal-slot]');
    slot.innerHTML = '<aside class="ai-journal-selection"><span aria-hidden="true">◇</span><p><b>Uma única memória foi preparada.</b><small>Revise o texto. Nada será enviado até você marcar o consentimento e tocar em Enviar.</small></p><button type="button" data-remove-journal>Remover</button></aside>';
    slot.querySelector('[data-remove-journal]').addEventListener('click', () => {
      this.input.value = '';
      store.remove(AI_DRAFT_KEY);
      slot.innerHTML = '';
      this.updateCharacterCount();
    });
    store.remove(JOURNAL_AI_SELECTION_KEY);
    this.updateCharacterCount();
    this.input.focus({ preventScroll: true });
  }

  prepareTarotSelection() {
    const selected = normalizeTarotContext(store.get(AI_TAROT_SELECTION_KEY));
    if (!selected) return;
    this.tarotContext = selected;
    this.setMode('tarot');
    const cards = selected.positions.map(item => `${item.position}: ${item.cardName} (direta)`).join('\n');
    this.input.value = `Quero refletir somente sobre esta tiragem concluída.\nTiragem: ${selected.spreadName}\n${selected.question ? `Pergunta: ${selected.question}\n` : ''}${cards}`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text: this.input.value, source: 'single-spread', at: new Date().toISOString() });
    const slot = this.root.querySelector('[data-ai-journal-slot]');
    slot.innerHTML = '<aside class="ai-journal-selection"><span aria-hidden="true">◇</span><p><b>Uma única tiragem foi preparada.</b><small>As cartas e posições reais serão enviadas como dados estruturados. Revise e consinta antes de enviar.</small></p><button type="button" data-remove-tarot>Remover</button></aside>';
    slot.querySelector('[data-remove-tarot]').addEventListener('click', () => this.clearTarotSelection(true));
    store.remove(AI_TAROT_SELECTION_KEY);
    this.updateCharacterCount();
    this.input.focus({ preventScroll: true });
  }

  clearTarotSelection(clearInput = false) {
    this.tarotContext = null;
    this.root.querySelector('[data-ai-journal-slot]').innerHTML = '';
    if (clearInput) {
      this.input.value = '';
      store.remove(AI_DRAFT_KEY);
      this.updateCharacterCount();
    }
  }

  showClearConfirmation() {
    this.pendingClear = true;
    this.root.querySelector('[data-ai-clear-box]').hidden = false;
    this.root.querySelector('[data-ai-clear-cancel]').focus();
  }

  hideClearConfirmation() {
    this.pendingClear = false;
    this.root.querySelector('[data-ai-clear-box]').hidden = true;
  }

  clearHistory() {
    if (!this.pendingClear) return;
    this.history = [];
    store.remove(AI_HISTORY_KEY);
    this.hideClearConfirmation();
    this.renderHistory();
    this.notify('Histórico removido deste aparelho.');
  }

  exportHistory() {
    const payload = privateAIExport(this.history);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `conversa-orbe-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
    this.notify('Sua cópia privada foi preparada.');
  }

  showPackConfirmation(amount) {
    const pack = AI_POLICY.packs.find(item => item.credits === amount);
    if (!pack) return;
    this.pendingPack = amount;
    const box = this.root.querySelector('[data-ai-pack-box]');
    box.hidden = false;
    box.innerHTML = `<p><b>Simular +${pack.credits} créditos?</b><small>Valor de referência: R$ ${money(pack.priceBRL)}. Nenhuma cobrança, cartão ou benefício real será ativado.</small></p><div><button type="button" data-ai-pack-cancel>Cancelar</button><button type="button" data-ai-pack-confirm>Confirmar simulação</button></div>`;
    box.querySelector('[data-ai-pack-cancel]').focus();
  }

  hidePackConfirmation() {
    this.pendingPack = 0;
    const box = this.root.querySelector('[data-ai-pack-box]');
    box.hidden = true;
    box.innerHTML = '';
  }

  confirmPack() {
    if (!this.pendingPack) return;
    const amount = this.pendingPack;
    if (grantCredits(amount, 'sandbox-pack')) {
      this.updateCredits();
      this.notify(`+${amount} créditos adicionados somente à demonstração.`);
    }
    this.hidePackConfirmation();
  }

  requestAllowed() {
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(time => now - time < 60000);
    if (this.requestTimes.length >= AI_POLICY.limits.requestsPerMinute) return false;
    this.requestTimes.push(now);
    return true;
  }

  setSending(active) {
    this.sending = active;
    this.input.disabled = active;
    this.root.querySelector('[data-ai-send]').disabled = active;
    this.root.querySelector('[data-ai-stop]').hidden = !active;
  }

  appendSystemMessage(content) {
    this.history.push(createAIMessage('assistant', content, { mode: this.modeId }));
    this.persistHistory();
  }

  async readResponse(response, pending) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return String(data.answer || data.message || '').slice(0, AI_POLICY.limits.maxMessageCharacters);
    }
    if (!response.body) return (await response.text()).slice(0, AI_POLICY.limits.maxMessageCharacters);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let answer = '';
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) {
        const raw = line.startsWith('data:') ? line.slice(5).trim() : line;
        if (!raw || raw === '[DONE]') continue;
        let piece = raw;
        let replace = false;
        try {
          const parsed = JSON.parse(raw);
          piece = parsed.delta || parsed.token || parsed.answer || '';
          replace = Boolean(parsed.answer && !parsed.delta && !parsed.token);
        } catch {}
        answer = String(replace ? piece : `${answer}${piece}`).slice(0, AI_POLICY.limits.maxMessageCharacters);
        pending.querySelector('p').textContent = answer || 'A Orbe está refletindo…';
        this.chat.scrollTop = this.chat.scrollHeight;
      }
    }
    if (buffer.trim()) answer = `${answer}${buffer}`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    return answer.trim();
  }

  async send() {
    if (this.sending) return;
    const content = this.input.value.trim();
    const persona = this.persona.value.trim();
    const mode = AI_POLICY.modes[this.modeId];
    if (!content) { this.input.focus(); return; }
    if (!this.consent.checked) {
      this.root.querySelector('[data-ai-consent-error]').hidden = false;
      this.consent.focus();
      return;
    }
    if (this.modeId === 'channel' && !persona) { this.persona.focus(); return; }
    if (!mode?.enabled) { this.appendSystemMessage('O modo Sol permanece desativado até futura aprovação de produção.'); return; }
    if (!canSpend(this.modeId)) { this.appendSystemMessage('O saldo ou o limite diário demonstrativo não permite esta conversa. Nenhuma cobrança foi feita.'); return; }
    if (!this.requestAllowed()) { this.appendSystemMessage('A Orbe fez uma pausa de proteção. Aguarde um minuto antes de uma nova mensagem.'); return; }

    const request = createAIRequest({ history: this.history, mode: this.modeId, persona, message: content, tarotContext: this.tarotContext });
    this.history.push(createAIMessage('user', content, { mode: this.modeId }));
    this.persistHistory();
    this.input.value = '';
    store.remove(AI_DRAFT_KEY);
    this.updateCharacterCount();
    this.consent.checked = false;
    this.setSending(true);

    const pending = document.createElement('article');
    pending.className = 'bubble bot ai-streaming';
    pending.innerHTML = '<span aria-hidden="true">✦</span><div><p>A Orbe está refletindo…</p><small>RESPOSTA EM FORMAÇÃO</small></div>';
    this.chat.append(pending);
    this.chat.scrollTop = this.chat.scrollHeight;

    this.abortController = new AbortController();
    const timeout = setTimeout(() => this.abortController?.abort('timeout'), AI_POLICY.limits.timeoutMs);
    try {
      if (navigator.onLine === false || !this.config.apiBase) throw new Error('offline');
      if (this.config.aiEnabled === false) throw new Error('paused');
      const response = await fetch(`${this.config.apiBase.replace(/\/$/, '')}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: this.abortController.signal,
        body: JSON.stringify(request)
      });
      if (response.status === 401 || response.status === 403) throw new Error('subscription');
      if (response.status === 429) throw new Error('rate');
      if (!response.ok) throw new Error('server');
      const answer = await this.readResponse(response, pending);
      if (!answer) throw new Error('server');
      if (!spend(this.modeId, request.requestId)) throw new Error('credits');
      this.history.push(createAIMessage('assistant', answer, { mode: this.modeId }));
      if (this.tarotContext) this.clearTarotSelection(false);
    } catch (error) {
      const key = error?.name === 'AbortError' ? 'aborted' : error?.message;
      const messages = {
        offline: 'A conexão segura da Whit ainda não foi configurada. Sua chave permanece protegida e nenhum crédito foi consumido.',
        paused: 'A Orbe IA está pausada pelo controle de segurança. Nenhum crédito foi consumido.',
        subscription: 'A Orbe IA exige uma assinatura ativa confirmada pelo servidor seguro.',
        rate: 'O limite de proteção foi alcançado. Aguarde antes de tentar novamente.',
        credits: 'O saldo mudou antes da conclusão. Nenhum débito duplicado foi criado.',
        aborted: 'A resposta foi interrompida. Nenhum crédito foi consumido.',
        server: 'A Orbe está temporariamente indisponível. Nenhum crédito foi consumido.'
      };
      this.history.push(createAIMessage('assistant', messages[key] || messages.server, { mode: this.modeId }));
    } finally {
      clearTimeout(timeout);
      pending.remove();
      this.abortController = null;
      this.setSending(false);
      this.persistHistory();
      this.updateCredits();
      this.updateConnection();
    }
  }
}
