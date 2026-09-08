/* DIVINA BRUXA — ORBE IA VERDADEIRA E GOVERNADA V190
   Luna e Terra reais, ledger no servidor e contexto privado sob consentimento. */

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
} from './ai-policy.js?v=190';
import { acceptServerCreditState, clearCreditState, creditState } from './ai-credits.js?v=190';
import { JOURNAL_AI_SELECTION_KEY, normalizeJournalAISelection } from './journal-policy.js?v=187';
import { SCHOOL_AI_SELECTION_KEY, normalizeSchoolAISelection } from './school-policy.js?v=186';

const safe = value => escapeHTML(value ?? '');
const modeEntries = () => Object.values(AI_POLICY.modes);
const formatTime = value => {
  try { return new Intl.DateTimeFormat('pt-BR', { hour:'2-digit', minute:'2-digit' }).format(new Date(value)); }
  catch { return ''; }
};
const ledgerLabels = Object.freeze({
  reservation:'Reserva concluída',
  refund:'Crédito devolvido',
  purchase:'Compra confirmada',
  renewal:'Renovação confirmada',
  adjustment:'Ajuste auditado',
  expiration:'Ciclo encerrado'
});
const sourceLabels = Object.freeze({
  message:'Somente a mensagem e o contexto local recente',
  'journal-single-entry':'Uma única entrada do Diário, visível no campo',
  'tarot-single-spread':'Uma única tiragem concluída, com cartas diretas',
  'school-single-lesson':'Uma única aula pública da Escola'
});

export class AIEngine {
  constructor(root, config = {}) {
    this.root = root?.id === 'aiApp' ? root : document.querySelector('#aiApp');
    if (!this.root) return;
    this.config = config;
    this.auth = globalThis.divinaAuth;
    this.history = normalizeAIHistory(store.get(AI_HISTORY_KEY, []));
    const settings = store.get(AI_SETTINGS_KEY, {});
    const legacyMode = { support:'luna', tarot:'terra', channel:'luna' }[settings?.mode];
    this.modeId = AI_POLICY.modes[legacyMode || settings?.mode]?.enabled ? (legacyMode || settings.mode) : 'luna';
    this.focusId = AI_POLICY.focuses[settings?.focus] ? settings.focus : 'reflection';
    this.source = 'message';
    this.tarotContext = null;
    this.sending = false;
    this.loadingStatus = false;
    this.pendingClear = false;
    this.pendingExtra = null;
    this.abortController = null;
    this.renderShell();
    this.bind();
    this.restoreDraft();
    this.renderModes();
    this.renderHistory();
    this.prepareJournalSelection();
    this.prepareTarotSelection();
    this.prepareSchoolSelection();
    this.updateCredits();
    this.updateConnection();
    this.loadStatus();
  }

  notify(message) {
    window.dispatchEvent(new CustomEvent('orbe:toast', { detail:message }));
  }

  renderShell() {
    this.root.innerHTML = `
      <section class="ai-command" aria-label="Estado da Orbe IA">
        <div class="ai-command-title"><span aria-hidden="true">✦</span><p><b>Orbe IA governada</b><small>Ledger no servidor · Web Search desligada · chave fora do navegador</small></p></div>
        <div class="ai-command-state"><span data-ai-connection>Verificando servidor…</span><span>STAGING · V190</span></div>
      </section>

      <section class="ai-auth-gate" data-ai-auth-gate>
        <span aria-hidden="true">◎</span><div><b>Entre na sua conta verificada</b><small>O saldo, os limites e cada débito são confirmados pelo servidor. Nenhum crédito local vale como saldo real.</small></div>
        <button type="button" data-ai-open-account>ABRIR MINHA CONTA</button>
      </section>

      <section class="ai-celestial-workspace">
        <aside class="ai-orbit-panel" aria-labelledby="aiModesTitle">
          <header><p class="eyebrow">ÓRBITAS DA CONVERSA</p><h3 id="aiModesTitle">Escolha a profundidade.</h3></header>
          <div class="ai-mode-list" role="radiogroup" aria-label="Modo da Orbe IA">${modeEntries().map(mode => `
            <button type="button" data-ai-mode="${mode.id}" role="radio" aria-checked="false" ${mode.enabled ? '' : 'disabled'}>
              <span aria-hidden="true">${mode.sigil}</span><span><b>${safe(mode.planet)}</b><small>${safe(mode.label)}</small></span><em>${mode.enabled ? `${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}` : 'OFF'}</em>
            </button>`).join('')}</div>
          <p class="ai-mode-disclosure" data-ai-mode-disclosure></p>

          <section class="ai-balance" aria-labelledby="aiBalanceTitle">
            <div><p class="eyebrow">SALDO DO SERVIDOR</p><h4 id="aiBalanceTitle"><strong data-ai-balance>—</strong> créditos</h4></div>
            <span class="ai-balance-ring" aria-hidden="true"><i data-ai-balance-ring></i></span>
            <div class="ai-balance-meter" aria-hidden="true"><i data-ai-meter></i></div>
            <p><span data-ai-today>Entre para consultar.</span><small data-ai-buckets>Mensais 0 · Teste 0 · Extras 0</small></p>
            <button type="button" class="ai-refresh-balance" data-ai-refresh>ATUALIZAR SALDO</button>
          </section>

          <section class="ai-membership">
            <span aria-hidden="true">◇</span><p><b>3 créditos Luna de teste</b><small>A assinatura Orbe IA (R$ 89,90/mês · 400 créditos) e pacotes extras continuam sem cobrança até a etapa de billing.</small></p>
            <button type="button" data-ai-subscription>Ver plano sem cobrança</button>
          </section>
        </aside>

        <section class="ai-conversation" aria-labelledby="aiConversationTitle">
          <header class="ai-conversation-head"><div><p class="eyebrow">WHIT · ORBE IA</p><h3 id="aiConversationTitle">Converse com presença.</h3></div><div><span class="ai-private-dot" aria-hidden="true"></span><small>histórico somente local</small></div></header>
          <div class="ai-quick-prompts" aria-label="Começos de conversa"></div>
          <div id="chat" class="chat ai-chat" role="log" aria-live="polite" aria-relevant="additions"></div>
          <div data-ai-context-slot></div>
          <form id="chatForm" class="chat-form ai-composer">
            <label class="ai-focus-field"><span>Foco desta resposta</span><select id="aiFocus">${Object.values(AI_POLICY.focuses).map(focus => `<option value="${focus.id}">${safe(focus.label)}</option>`).join('')}</select></label>
            <label for="chatInput">Sua mensagem</label>
            <textarea id="chatInput" required maxlength="${AI_POLICY.limits.maxMessageCharacters}" rows="3" placeholder="Escreva para a Orbe…"></textarea>
            <div class="ai-composer-meta"><span data-ai-character-count>0 / ${AI_POLICY.limits.maxMessageCharacters}</span><span>Web e dados ocultos: OFF</span></div>
            <p class="ai-context-scope"><b>Contexto que será enviado:</b> <span data-ai-source-label>${sourceLabels.message}</span>.</p>
            <label class="ai-consent"><input type="checkbox" id="aiConsent"><span>Entendo que Whit é uma IA. Autorizo enviar esta mensagem e até 12 mensagens recentes desta conversa local ao servidor seguro e ao provedor OpenAI. Nada do Diário entra sem seleção explícita.</span></label>
            <p class="ai-consent-error" data-ai-consent-error hidden>Marque o consentimento antes de enviar.</p>
            <div class="ai-composer-actions"><button type="submit" class="primary" data-ai-send>Enviar · <span data-ai-send-cost>1 crédito</span></button><button type="button" class="text-button" data-ai-stop hidden>Interromper</button></div>
          </form>
          <div class="ai-inline-confirm" data-ai-extra-box hidden role="alert"></div>
        </section>
      </section>

      <section class="ai-control-deck" aria-labelledby="aiControlTitle">
        <header><div><p class="eyebrow">CONTROLE E PORTABILIDADE</p><h3 id="aiControlTitle">Você governa o contexto.</h3></div><p>O servidor guarda saldo, ledger e métricas técnicas sem o texto. As mensagens permanecem somente neste aparelho; a OpenAI recebe apenas o envio consentido.</p></header>
        <div class="ai-control-grid">
          <section class="ai-history-controls"><span aria-hidden="true">◇</span><div><b>Histórico privado local</b><small data-ai-history-count></small></div><button type="button" data-ai-export>Baixar conversa</button><button type="button" data-ai-clear>Limpar histórico</button></section>
          <section class="ai-ledger-summary"><span aria-hidden="true">⌁</span><div><b>Ledger auditável do servidor</b><small data-ai-ledger-summary>Entre para consultar os eventos.</small></div><details data-ai-ledger-details><summary>Ver últimos eventos</summary><div data-ai-ledger-list></div></details></section>
          <section class="ai-web-off"><span aria-hidden="true">⊘</span><div><b>Web Search desligada</b><small>Whit não pesquisa nem abre páginas externas. Sol também permanece desligado.</small></div></section>
        </div>
        <div class="ai-inline-confirm" data-ai-clear-box hidden role="alert"><p><b>Apagar toda a conversa deste aparelho?</b><small>Baixe uma cópia antes se quiser preservar o texto.</small></p><div><button type="button" data-ai-clear-cancel>Manter histórico</button><button type="button" class="danger" data-ai-clear-confirm>Sim, apagar</button></div></div>

        <section class="ai-credit-store ai-credit-store-locked" aria-labelledby="aiPacksTitle">
          <header><div><p class="eyebrow">ASSINATURA E EXTRAS</p><h4 id="aiPacksTitle">Cobrança continua desligada.</h4></div><p>A V190 não simula nem concede créditos no navegador. Compras, renovações e recibos entram somente na próxima macroetapa, com confirmação do servidor.</p></header>
          <div class="ai-pack-grid">${AI_POLICY.packs.map(pack => `<article><b>+${pack.credits}</b><span>créditos</span><em>R$ ${Number(pack.priceBRL).toFixed(2).replace('.', ',')}</em><small>Indisponível · nenhuma cobrança</small></article>`).join('')}</div>
        </section>

        <footer class="ai-safety-copy"><span aria-hidden="true">✦</span><p><b>Reflexão, não autoridade.</b><small>Whit não lê pensamentos, não é uma pessoa real e não substitui apoio médico, psicológico, jurídico ou financeiro. Conteúdo de risco recebe interrupção segura e indicação de apoio humano, sem débito de créditos.</small></p></footer>
      </section>`;

    this.chat = this.root.querySelector('#chat');
    this.form = this.root.querySelector('#chatForm');
    this.input = this.root.querySelector('#chatInput');
    this.focus = this.root.querySelector('#aiFocus');
    this.consent = this.root.querySelector('#aiConsent');
    this.focus.value = this.focusId;
  }

  bind() {
    this.root.querySelector('.ai-mode-list').addEventListener('click', event => {
      const button = event.target.closest('[data-ai-mode]');
      if (!button) return;
      if (button.disabled) {
        this.appendSystemMessage('O modo Sol permanece desligado e não possui rota de servidor.');
        return;
      }
      this.setMode(button.dataset.aiMode);
    });
    this.focus.addEventListener('change', () => this.setFocus(this.focus.value));
    this.form.addEventListener('submit', event => { event.preventDefault(); this.send(); });
    this.input.addEventListener('input', () => {
      store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString() });
      this.updateCharacterCount();
      this.root.querySelector('[data-ai-consent-error]').hidden = true;
    });
    this.root.querySelector('[data-ai-stop]').addEventListener('click', () => this.abortController?.abort());
    this.root.querySelector('[data-ai-open-account]').addEventListener('click', () => globalThis.orbe?.go?.('login'));
    this.root.querySelector('[data-ai-refresh]').addEventListener('click', () => this.loadStatus(true));
    this.root.querySelector('[data-ai-subscription]').addEventListener('click', () => globalThis.orbe?.go?.('subscriptions'));
    this.root.querySelector('[data-ai-export]').addEventListener('click', () => this.exportHistory());
    this.root.querySelector('[data-ai-clear]').addEventListener('click', () => this.showClearConfirmation());
    this.root.querySelector('[data-ai-clear-cancel]').addEventListener('click', () => this.hideClearConfirmation());
    this.root.querySelector('[data-ai-clear-confirm]').addEventListener('click', () => this.clearHistory());
    this.root.addEventListener('click', event => {
      const prompt = event.target.closest('[data-ai-prompt]');
      if (prompt) {
        this.input.value = prompt.dataset.aiPrompt;
        this.input.dispatchEvent(new Event('input', { bubbles:true }));
        this.input.focus();
      }
      if (event.target.closest('[data-ai-extra-cancel]')) this.cancelExtra();
      if (event.target.closest('[data-ai-extra-confirm]')) this.confirmExtra();
    });
    window.addEventListener('online', () => this.loadStatus());
    window.addEventListener('offline', () => this.updateConnection());
    window.addEventListener('divina:journal-ai-selected', () => this.prepareJournalSelection());
    window.addEventListener('divina:tarot-ai-selected', () => this.prepareTarotSelection());
    window.addEventListener('divina:school-ai-selected', () => this.prepareSchoolSelection());
    this.auth?.onAuthStateChange?.((event) => {
      clearCreditState();
      if (event === 'SIGNED_OUT') {
        this.updateCredits();
        this.updateConnection();
        return;
      }
      this.loadStatus();
    });
  }

  restoreDraft() {
    const draft = store.get(AI_DRAFT_KEY);
    if (draft && typeof draft.text === 'string') this.input.value = draft.text.slice(0, AI_POLICY.limits.maxMessageCharacters);
    this.updateCharacterCount();
  }

  setMode(modeId) {
    if (!AI_POLICY.modes[modeId]?.enabled || this.sending) return;
    this.modeId = modeId;
    store.set(AI_SETTINGS_KEY, { mode:modeId, focus:this.focusId });
    this.renderModes();
  }

  setFocus(focusId) {
    if (!AI_POLICY.focuses[focusId] || this.sending) return;
    this.focusId = focusId;
    store.set(AI_SETTINGS_KEY, { mode:this.modeId, focus:focusId });
    this.renderQuickPrompts();
  }

  renderModes() {
    const mode = AI_POLICY.modes[this.modeId];
    this.root.querySelectorAll('[data-ai-mode]').forEach(button => {
      const active = button.dataset.aiMode === this.modeId;
      button.setAttribute('aria-checked', String(active));
      button.classList.toggle('active', active);
    });
    this.root.querySelector('[data-ai-mode-disclosure]').textContent = `${mode.description} ${aiDisclosure(this.modeId)}`;
    this.root.querySelector('[data-ai-send-cost]').textContent = `${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}`;
    this.renderQuickPrompts();
  }

  renderQuickPrompts() {
    const prompts = this.focusId === 'tarot'
      ? ['Ajude-me a relacionar os símbolos desta leitura.', 'Como integrar o conselho das cartas sem determinismo?', 'Que padrão observável esta tiragem convida a investigar?']
      : this.focusId === 'school'
        ? ['Explique esta ideia com um exemplo simples.', 'Faça uma pergunta para eu recuperar o que aprendi.', 'Compare dois símbolos sem tratar nenhum como destino.']
        : this.focusId === 'symbolic-persona'
          ? ['Crie uma dramatização simbólica ficcional sobre esta escolha.', 'Mostre duas vozes internas sem fingir que são pessoas reais.', 'Transforme este conflito em um diálogo metafórico.']
          : ['Quero organizar o que estou sentindo.', 'Ajude-me a separar fatos, interpretações e próximos passos.', 'Faça uma pergunta para eu refletir com calma.'];
    this.root.querySelector('.ai-quick-prompts').innerHTML = prompts.map(prompt => `<button type="button" data-ai-prompt="${safe(prompt)}">${safe(prompt)}</button>`).join('');
  }

  renderHistory() {
    const intro = `<article class="bubble bot ai-welcome"><span aria-hidden="true">✦</span><div><b>Eu sou Whit, uma IA.</b><p>Posso acolher perguntas e refletir sobre símbolos. Não sou consciência, médium ou pessoa; você escolhe o que entra.</p><small>${safe(aiDisclosure(this.modeId))}</small></div></article>`;
    this.chat.innerHTML = intro + this.history.map(message => `<article class="bubble ${message.role === 'user' ? 'user' : 'bot'}"><div><p>${safe(message.content).replace(/\n/g, '<br>')}</p><small>${message.role === 'user' ? 'VOCÊ' : message.safetyIntercepted ? 'WHIT · PROTEÇÃO' : 'WHIT'} · ${safe(formatTime(message.at))}</small></div></article>`).join('');
    this.chat.scrollTop = this.chat.scrollHeight;
    this.root.querySelector('[data-ai-history-count]').textContent = `${this.history.length} ${this.history.length === 1 ? 'mensagem preservada' : 'mensagens preservadas'} neste aparelho.`;
  }

  persistHistory() {
    this.history = normalizeAIHistory(this.history);
    store.set(AI_HISTORY_KEY, this.history);
    this.renderHistory();
  }

  appendSystemMessage(content, metadata = {}) {
    this.history.push(createAIMessage('assistant', content, { mode:this.modeId, ...metadata }));
    this.persistHistory();
  }

  updateCharacterCount() {
    this.root.querySelector('[data-ai-character-count]').textContent = `${this.input.value.length} / ${AI_POLICY.limits.maxMessageCharacters}`;
  }

  updateCredits() {
    const state = creditState();
    const balance = this.root.querySelector('[data-ai-balance]');
    balance.textContent = state.authoritative ? state.balance.toLocaleString('pt-BR') : '—';
    this.root.querySelector('[data-ai-today]').textContent = state.authoritative ? `${state.todayRemaining} créditos ainda disponíveis no limite diário` : 'Entre para consultar o saldo real.';
    this.root.querySelector('[data-ai-buckets]').textContent = state.authoritative
      ? `Mensais ${state.monthly} · Teste ${state.demo} · Extras ${state.extra}`
      : 'Mensais — · Teste — · Extras —';
    const denominator = Math.max(AI_POLICY.demoCredits, Number(state.balance || 0) + Number(state.consumedToday || 0));
    const ratio = state.authoritative ? Math.min(1, Number(state.balance || 0) / denominator) : 0;
    this.root.querySelector('[data-ai-meter]').style.width = `${ratio * 100}%`;
    this.root.querySelector('[data-ai-balance-ring]').style.setProperty('--ai-credit-angle', `${ratio * 360}deg`);
    this.root.querySelector('[data-ai-ledger-summary]').textContent = state.authoritative
      ? `${state.ledgerCount} eventos no servidor · ${state.consumedToday} créditos usados hoje · nenhum texto de conversa.`
      : 'Entre para consultar os eventos auditáveis do servidor.';
    const list = this.root.querySelector('[data-ai-ledger-list]');
    list.innerHTML = state.ledger.length
      ? state.ledger.map(entry => `<p><b>${entry.delta > 0 ? '+' : ''}${entry.delta} · ${safe(ledgerLabels[entry.reason] || entry.reason)}</b><small>${safe(entry.bucket)} · ${safe(new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short' }).format(new Date(entry.createdAt)))}</small></p>`).join('')
      : '<p><small>Nenhum evento para mostrar.</small></p>';
  }

  updateConnection() {
    const state = creditState();
    const online = navigator.onLine !== false;
    const signedIn = Boolean(this.auth?.session);
    const ready = online && signedIn && state.authoritative && state.enabled && state.providerConfigured && this.config.aiEnabled !== false;
    const status = this.root.querySelector('[data-ai-connection]');
    status.textContent = !online ? 'Offline · IA indisponível'
      : !signedIn ? 'Entre para usar'
        : this.config.aiEnabled === false ? 'Desligada nesta instalação'
        : !state.authoritative ? 'Verificando servidor…'
          : !state.enabled ? 'Pausada pelo controle de segurança'
            : !state.providerConfigured ? 'Provedor ainda não configurado'
              : 'Servidor e ledger disponíveis';
    status.dataset.ready = String(ready);
    this.root.querySelector('[data-ai-auth-gate]').hidden = signedIn;
    this.root.querySelector('[data-ai-refresh]').disabled = this.loadingStatus || !signedIn || !online;
    this.root.querySelector('[data-ai-send]').disabled = this.sending || !ready;
  }

  async loadStatus(notify = false) {
    if (this.loadingStatus) return;
    if (!this.auth?.session || navigator.onLine === false || typeof this.auth?.aiStatus !== 'function') {
      clearCreditState();
      this.updateCredits();
      this.updateConnection();
      return;
    }
    this.loadingStatus = true;
    this.updateConnection();
    const result = await this.auth.aiStatus();
    this.loadingStatus = false;
    if (result.ok) {
      acceptServerCreditState(result.body);
      if (notify) this.notify('Saldo e ledger atualizados pelo servidor.');
    } else {
      clearCreditState();
      if (notify) this.notify(result.message || 'Não foi possível atualizar o saldo.');
    }
    this.updateCredits();
    this.updateConnection();
  }

  setSource(source, tarotContext = null) {
    this.source = sourceLabels[source] ? source : 'message';
    this.tarotContext = tarotContext;
    this.root.querySelector('[data-ai-source-label]').textContent = sourceLabels[this.source];
  }

  showContextCard(kind, title, detail, remove) {
    const slot = this.root.querySelector('[data-ai-context-slot]');
    slot.innerHTML = `<aside class="ai-journal-selection"><span aria-hidden="true">${kind === 'school' ? '▤' : '◇'}</span><p><b>${safe(title)}</b><small>${safe(detail)}</small></p><button type="button" data-ai-remove-context>Remover</button></aside>`;
    slot.querySelector('[data-ai-remove-context]').addEventListener('click', () => {
      if (remove) remove();
      this.clearPreparedContext(true);
    });
  }

  prepareJournalSelection() {
    const selected = normalizeJournalAISelection(store.get(JOURNAL_AI_SELECTION_KEY));
    if (!selected) return;
    const cards = Array.isArray(selected.cards) && selected.cards.length ? `\nCartas relacionadas: ${selected.cards.join(', ')}` : '';
    const question = selected.question ? `\nIntenção: ${selected.question}` : '';
    const tags = selected.tags ? `\nEtiquetas: ${selected.tags}` : '';
    this.setMode('luna');
    this.setFocus('reflection');
    this.setSource('journal-single-entry');
    this.input.value = `Quero refletir somente sobre esta entrada que escolhi no meu Diário.\nTítulo: ${String(selected.title || 'Memória da Orbe')}\nReflexão: ${selected.text.slice(0, 4200)}${question}${cards}${tags}`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString() });
    this.showContextCard('journal', 'Uma única memória foi preparada.', 'Outras memórias, rascunho, humor, relações e revisões ficaram de fora. Revise o texto; nada será enviado sem seu consentimento.');
    store.remove(JOURNAL_AI_SELECTION_KEY);
    this.updateCharacterCount();
    this.input.focus({ preventScroll:true });
  }

  prepareTarotSelection() {
    const selected = normalizeTarotContext(store.get(AI_TAROT_SELECTION_KEY));
    if (!selected) return;
    this.setMode('terra');
    this.setFocus('tarot');
    this.setSource('tarot-single-spread', selected);
    const cards = selected.positions.map(item => `${item.position}: ${item.cardName} (direta)`).join('\n');
    this.input.value = `Quero refletir somente sobre esta tiragem concluída.\nTiragem: ${selected.spreadName}\n${selected.question ? `Pergunta: ${selected.question}\n` : ''}${cards}`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString() });
    this.showContextCard('tarot', 'Uma única tiragem foi preparada.', 'O servidor validará IDs canônicos, cartas sem repetição e orientação direta. Revise e consinta antes de enviar.');
    store.remove(AI_TAROT_SELECTION_KEY);
    this.updateCharacterCount();
    this.input.focus({ preventScroll:true });
  }

  prepareSchoolSelection() {
    const selected = normalizeSchoolAISelection(store.get(SCHOOL_AI_SELECTION_KEY));
    if (!selected) return;
    this.setMode('luna');
    this.setFocus('school');
    this.setSource('school-single-lesson');
    this.input.value = `Quero estudar somente esta aula pública da Escola do Tarot.\nMódulo: ${selected.moduleTitle}\nAula: ${selected.lessonTitle}\nConteúdo: ${selected.lesson}\nPrática proposta: ${selected.practice}\nAjude-me a compreender e faça uma pergunta de recuperação da memória, sem determinismo.`.slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString() });
    this.showContextCard('school', 'Uma única aula pública foi preparada.', 'Notas, progresso, favoritos e histórico ficaram de fora. Revise o texto e consinta antes de enviar.');
    store.remove(SCHOOL_AI_SELECTION_KEY);
    this.updateCharacterCount();
    this.input.focus({ preventScroll:true });
  }

  clearPreparedContext(clearInput = false) {
    this.setSource('message', null);
    this.root.querySelector('[data-ai-context-slot]').innerHTML = '';
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
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `conversa-orbe-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
    this.notify('Sua cópia privada local foi preparada.');
  }

  setSending(active) {
    this.sending = active;
    this.input.disabled = active;
    this.focus.disabled = active;
    this.root.querySelectorAll('[data-ai-mode]').forEach(button => { if (button.dataset.aiMode !== 'sol') button.disabled = active; });
    this.root.querySelector('[data-ai-send]').disabled = active;
    this.root.querySelector('[data-ai-stop]').hidden = !active;
  }

  errorCode(result) {
    return String(result?.body?.error?.code || result?.body?.code || (result?.aborted ? 'CLIENT_ABORTED' : '')).toUpperCase();
  }

  errorText(result) {
    const code = this.errorCode(result);
    const messages = {
      AUTHENTICATION_REQUIRED:'Entre na sua conta para conversar com a Orbe.',
      ACTIVE_SESSION_REQUIRED:'Sua sessão expirou. Entre novamente.',
      EMAIL_VERIFICATION_REQUIRED:'Confirme seu e-mail antes de usar a Orbe IA.',
      ORBE_AI_DISABLED:'A Orbe IA está pausada pelo controle de segurança. Nenhum crédito foi consumido.',
      AI_PROVIDER_NOT_CONFIGURED:'O provedor de IA ainda não foi configurado no servidor. Nenhum crédito foi consumido.',
      INSUFFICIENT_CREDITS:'Seu saldo não permite este modo. Luna usa 1 crédito; Terra usa 10.',
      RATE_LIMIT_PER_MINUTE:'A Orbe fez uma pausa de proteção. Aguarde um minuto.',
      DAILY_CREDIT_LIMIT:'O limite diário de créditos foi alcançado.',
      GLOBAL_REQUEST_LIMIT:'O limite seguro do ambiente foi alcançado hoje.',
      GLOBAL_CREDIT_LIMIT:'O limite seguro do ambiente foi alcançado hoje.',
      GLOBAL_COST_LIMIT:'O teto de custo do STAGING foi alcançado hoje.',
      SOL_DISABLED:'Sol permanece desligado e não consome créditos.',
      SAFETY_CHECK_UNAVAILABLE:'A verificação de segurança não respondeu. Nenhum crédito foi consumido.',
      REQUEST_ALREADY_COMPLETED:'Esta solicitação já foi concluída sem débito duplicado.',
      REQUEST_ALREADY_REFUNDED:'Esta solicitação já foi devolvida sem débito duplicado.',
      REQUEST_IN_PROGRESS:'Esta solicitação já está em processamento.',
      CLIENT_ABORTED:'A solicitação foi interrompida. O servidor fará a devolução automática se já existia uma reserva.',
      CLIENT_TIMEOUT:'A conexão demorou além do limite. Atualize o ledger antes de tentar novamente.',
      NETWORK_UNAVAILABLE:'A conexão segura está indisponível. Nenhum débito local foi criado.'
    };
    return messages[code] || result?.message || result?.body?.error?.message || 'A Orbe está temporariamente indisponível. Atualize o ledger antes de tentar novamente.';
  }

  createPending() {
    const pending = document.createElement('article');
    pending.className = 'bubble bot ai-streaming';
    pending.innerHTML = '<span aria-hidden="true">✦</span><div><p>A Orbe está refletindo…</p><small>RESPOSTA EM FORMAÇÃO</small></div>';
    this.chat.append(pending);
    this.chat.scrollTop = this.chat.scrollHeight;
    return pending;
  }

  async performRequest(request, pending) {
    this.abortController = new AbortController();
    const result = await this.auth.aiChat(request, this.abortController.signal);
    this.abortController = null;
    if (!result.ok) return { ok:false, result };
    const answer = String(result.body?.answer || '').trim().slice(0, 12000);
    if (!answer) return { ok:false, result:{ body:{ error:{ code:'EMPTY_RESPONSE' } }, message:'A resposta veio vazia.' } };
    pending.querySelector('p').textContent = answer;
    return { ok:true, result, answer };
  }

  async send() {
    if (this.sending || this.pendingExtra) return;
    const content = this.input.value.trim();
    const mode = AI_POLICY.modes[this.modeId];
    if (!content) { this.input.focus(); return; }
    if (!this.consent.checked) {
      this.root.querySelector('[data-ai-consent-error]').hidden = false;
      this.consent.focus();
      return;
    }
    if (!mode?.enabled) { this.appendSystemMessage('O modo Sol permanece desligado.'); return; }
    if (!this.auth?.session || typeof this.auth?.aiChat !== 'function') {
      this.appendSystemMessage('Entre na sua conta verificada para consultar o saldo real e conversar.');
      globalThis.orbe?.go?.('login');
      return;
    }
    if (navigator.onLine === false) { this.appendSystemMessage('A Orbe IA precisa da conexão segura. Seu texto continua somente neste aparelho.'); return; }
    if (!creditState().authoritative) await this.loadStatus();
    const availability = creditState();
    if (this.config.aiEnabled === false || !availability.authoritative || !availability.enabled || !availability.providerConfigured) {
      const reason = this.config.aiEnabled === false
        ? 'A Orbe IA está desligada nesta instalação.'
        : !availability.authoritative
          ? 'Não foi possível confirmar o ledger seguro. Nenhum texto foi enviado.'
          : !availability.enabled
            ? 'A Orbe IA está pausada pelo controle de segurança. Nenhum texto foi enviado.'
            : 'O provedor de IA ainda não está configurado. Nenhum texto foi enviado.';
      this.appendSystemMessage(reason);
      return;
    }

    const request = createAIRequest({ history:this.history, mode:this.modeId, focus:this.focusId, source:this.source, message:content, tarotContext:this.tarotContext });
    this.history.push(createAIMessage('user', content, { mode:this.modeId }));
    this.persistHistory();
    this.input.value = '';
    store.remove(AI_DRAFT_KEY);
    this.updateCharacterCount();
    this.consent.checked = false;
    this.setSending(true);
    const pending = this.createPending();

    try {
      const outcome = await this.performRequest(request, pending);
      if (!outcome.ok) {
        const code = this.errorCode(outcome.result);
        pending.remove();
        if (code === 'EXTRA_CONFIRMATION_REQUIRED') {
          this.pendingExtra = { request:{ ...request, confirmExtra:true }, content };
          this.showExtraConfirmation(mode.cost);
          return;
        }
        this.appendSystemMessage(this.errorText(outcome.result));
        return;
      }
      pending.remove();
      this.history.push(createAIMessage('assistant', outcome.answer, { mode:this.modeId, safetyIntercepted:outcome.result.body?.safetyIntercepted === true }));
      this.persistHistory();
      this.clearPreparedContext(false);
      await this.loadStatus();
    } finally {
      pending.remove();
      this.abortController = null;
      this.setSending(false);
      this.updateConnection();
    }
  }

  showExtraConfirmation(cost) {
    const box = this.root.querySelector('[data-ai-extra-box]');
    box.hidden = false;
    box.innerHTML = `<p><b>Usar ${cost} ${cost === 1 ? 'crédito extra' : 'créditos extras'}?</b><small>O saldo mensal e o teste não cobrem esta mensagem. A confirmação vale somente para este requestId; não existe cobrança nesta tela.</small></p><div><button type="button" data-ai-extra-cancel>Cancelar</button><button type="button" data-ai-extra-confirm>Confirmar uso</button></div>`;
    box.querySelector('[data-ai-extra-cancel]').focus();
  }

  cancelExtra() {
    this.pendingExtra = null;
    const box = this.root.querySelector('[data-ai-extra-box]');
    box.hidden = true;
    box.innerHTML = '';
    this.appendSystemMessage('Envio cancelado. Nenhum crédito extra foi usado.');
  }

  async confirmExtra() {
    if (!this.pendingExtra || this.sending) return;
    const pendingRequest = this.pendingExtra;
    this.pendingExtra = null;
    const box = this.root.querySelector('[data-ai-extra-box]');
    box.hidden = true;
    box.innerHTML = '';
    this.setSending(true);
    const pending = this.createPending();
    try {
      const outcome = await this.performRequest(pendingRequest.request, pending);
      pending.remove();
      if (!outcome.ok) {
        this.appendSystemMessage(this.errorText(outcome.result));
        return;
      }
      this.history.push(createAIMessage('assistant', outcome.answer, { mode:this.modeId, safetyIntercepted:outcome.result.body?.safetyIntercepted === true }));
      this.persistHistory();
      this.clearPreparedContext(false);
      await this.loadStatus();
    } finally {
      pending.remove();
      this.abortController = null;
      this.setSending(false);
      this.updateConnection();
    }
  }
}
