/* DIVINA BRUXA 4.0 — MACROETAPA 9/14 · WHIT LOCAL SUPREMA V557
   Guia local contextual, memória efêmera e camada online separada. */

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
} from './ai-policy.js?v=557';
import { createLocalWhitResponse } from './whit-local-guide-v540.js?v=557';
import { acceptServerCreditState, clearCreditState, creditState } from './ai-credits.js?v=190';
import { JOURNAL_AI_SELECTION_KEY, normalizeJournalAISelection } from './journal-policy.js?v=556';
import { SCHOOL_AI_SELECTION_KEY, normalizeSchoolAISelection } from './school-policy.js?v=555';

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
  message:'Esta mensagem e, em continuações curtas, uma lembrança efêmera desta sessão',
  'journal-single-entry':'Uma única entrada do Diário, visível no campo',
  'tarot-single-spread':'Uma única tiragem concluída, com cartas diretas',
  'school-single-lesson':'Uma única aula pública da Escola'
});

function structuredOnlineAnswer(value) {
  const answer = String(value || '').trim().slice(0, 10500);
  if (/OBSERVA(?:ÇÃO|CAO)[\s\S]+POSSIBILIDADE[\s\S]+LIMITE[\s\S]+PRÓXIMO GESTO/i.test(answer)) return answer;
  return [
    `OBSERVAÇÃO\n${answer}`,
    'POSSIBILIDADE\nLeia esta resposta como uma hipótese para reflexão, não como uma verdade automática sobre você ou o futuro.',
    'LIMITE\nA camada online trabalha somente com o contexto consentido e pode se enganar. Ela não lê pensamentos nem substitui apoio profissional.',
    'PRÓXIMO GESTO\nEscolha uma parte verificável da resposta e observe se ela ajuda numa ação pequena, segura e reversível.'
  ].join('\n\n').slice(0, 12000);
}

export class AIEngine {
  constructor(root, config = {}, options = {}) {
    this.root = root?.id === 'aiApp' ? root : document.querySelector('#aiApp');
    if (!this.root) return;
    this.config = config;
    this.auth = options.authClient || globalThis.divinaAuth;
    this.orbCore = options.orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orb = this.orbCore?.orb || null;
    this.orbRelease = null;
    this.abort = new AbortController();
    this.sessionTurns = [];
    this.orbClaimed = false;
    this.history = normalizeAIHistory(store.get(AI_HISTORY_KEY, []));
    const settings = store.get(AI_SETTINGS_KEY, {});
    const legacyMode = { support:'luna', tarot:'terra', channel:'luna' }[settings?.mode];
    this.modeId = AI_POLICY.modes[legacyMode || settings?.mode]?.enabled ? (legacyMode || settings.mode) : 'luna';
    this.focusId = AI_POLICY.focuses[settings?.focus] ? settings.focus : 'reflection';
    // Cada nova abertura nasce local. A camada paga nunca é restaurada
    // silenciosamente de uma sessão anterior.
    this.deliveryMode = 'local';
    this.source = 'message';
    this.tarotContext = null;
    this.sending = false;
    this.loadingStatus = false;
    this.pendingClear = false;
    this.pendingExtra = null;
    this.abortController = null;
    this.phaseTimers = new Set();
    this.root.dataset.whitLocal = 'v557';
    document.documentElement.dataset.whitLocalSupreme = 'v557';
    this.renderShell();
    this.bind();
    this.syncOrb();
    this.restoreDraft();
    this.renderModes();
    this.renderDelivery();
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
      <section class="whit-v557-orb-zone" aria-labelledby="whitV557Title">
        <div class="whit-v557-orb-host" data-whit-orb-host aria-label="Orbe canônica acompanhando a Whit"></div>
        <div><p class="eyebrow">WHIT LOCAL · PRESENÇA DA ORBE</p><h3 id="whitV557Title">Escuta, contexto e próximo gesto.</h3><p>Uma presença de interface que organiza o que você escolhe trazer. Funciona neste aparelho, sem conta, sem API e sem créditos.</p></div>
      </section>
      <nav class="whit-v557-passages" aria-label="Passagens da Whit">
        <button type="button" data-whit-passage="conversation"><span>✦</span><b>Conversar</b><small>escrever e receber uma reflexão local</small></button>
        <button type="button" data-whit-passage="session"><span>⌁</span><b>Sessão</b><small>ver ou apagar a lembrança efêmera</small></button>
        <button type="button" data-whit-passage="privacy"><span>◇</span><b>Limites</b><small>entender exatamente o que Whit vê</small></button>
      </nav>
      <section class="ai-command" aria-label="Estado da Orbe IA">
        <div class="ai-command-title"><span aria-hidden="true">✦</span><p><b>Whit · presença governada</b><small data-ai-command-copy>Guia local disponível · você escolhe cada contexto</small></p></div>
        <div class="ai-command-state"><span data-ai-connection>Whit local despertando…</span><span>LOCAL · V557</span></div>
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
          <section class="ai-delivery-v540" aria-labelledby="aiDeliveryTitle">
            <div><p class="eyebrow">COMO WHIT RESPONDE</p><h4 id="aiDeliveryTitle">Presença primeiro. Potência quando você escolher.</h4></div>
            <div role="radiogroup" aria-label="Escolher camada da Whit">
              <button type="button" data-ai-delivery="local" role="radio"><b>WHIT LOCAL</b><small>sem conta · sem API · 0 créditos</small></button>
              <button type="button" data-ai-delivery="online" role="radio"><b>CAMADA ONLINE</b><small>Luna 1 · Terra 10 · quando disponível</small></button>
            </div>
            <p data-ai-delivery-note></p>
            <p class="ai-credit-lifecycle-v540" data-ai-credit-lifecycle data-state="idle">Whit local · nenhum crédito reservado.</p>
          </section>
          <div class="ai-quick-prompts" aria-label="Começos de conversa"></div>
          <div id="chat" class="chat ai-chat" role="log" aria-live="polite" aria-relevant="additions"></div>
          <div data-ai-context-slot></div>
          <aside class="whit-v557-session" data-whit-session aria-live="polite"><span aria-hidden="true">⌁</span><p><b>Memória desta sessão</b><small data-whit-session-copy>Nenhuma lembrança efêmera ainda.</small></p><button type="button" data-whit-clear-session disabled>Apagar sessão</button></aside>
          <form id="chatForm" class="chat-form ai-composer">
            <label class="ai-focus-field"><span>Foco desta resposta</span><select id="aiFocus">${Object.values(AI_POLICY.focuses).map(focus => `<option value="${focus.id}">${safe(focus.label)}</option>`).join('')}</select></label>
            <label for="chatInput">Sua mensagem</label>
            <textarea id="chatInput" required maxlength="${AI_POLICY.limits.maxMessageCharacters}" rows="3" placeholder="Escreva para a Orbe…"></textarea>
            <div class="ai-composer-meta"><span data-ai-character-count>0 / ${AI_POLICY.limits.maxMessageCharacters}</span><span>Web e dados ocultos: OFF</span></div>
            <p class="ai-context-scope"><b>Contexto usado nesta resposta:</b> <span data-ai-source-label>${sourceLabels.message}</span>.</p>
            <label class="ai-consent"><input type="checkbox" id="aiConsent"><span data-ai-consent-copy></span></label>
            <p class="ai-consent-error" data-ai-consent-error hidden>Marque o consentimento antes de enviar.</p>
            <div class="ai-composer-actions"><button type="submit" class="primary" data-ai-send>Enviar · <span data-ai-send-cost>1 crédito</span></button><button type="button" class="text-button" data-ai-stop hidden>Interromper</button></div>
          </form>
          <div class="ai-inline-confirm" data-ai-extra-box hidden role="alert"></div>
        </section>
      </section>

      <section class="ai-control-deck" aria-labelledby="aiControlTitle">
        <header><div><p class="eyebrow">CONTROLE E PORTABILIDADE</p><h3 id="aiControlTitle">Você governa o contexto.</h3></div><p>No modo local, nenhuma mensagem sai do aparelho. A camada online futura permanece separada e só envia quando você a escolhe e consente.</p></header>
        <div class="ai-control-grid">
          <section class="ai-history-controls"><span aria-hidden="true">◇</span><div><b>Histórico privado local</b><small data-ai-history-count></small></div><button type="button" data-ai-export>Baixar conversa</button><button type="button" data-ai-clear>Limpar histórico</button></section>
          <section class="ai-ledger-summary"><span aria-hidden="true">⌁</span><div><b>Ledger auditável do servidor</b><small data-ai-ledger-summary>Entre para consultar os eventos.</small></div><details data-ai-ledger-details><summary>Ver últimos eventos</summary><div data-ai-ledger-list></div></details></section>
          <section class="ai-web-off" data-whit-privacy-anchor><span aria-hidden="true">⊘</span><div><b>Dados ocultos e Web desligados</b><small>Whit local não abre páginas, não lê outros campos, Diário, notas ou histórico antigo. Sol permanece desligado.</small></div></section>
        </div>
        <div class="ai-inline-confirm" data-ai-clear-box hidden role="alert"><p><b>Apagar toda a conversa deste aparelho?</b><small>Baixe uma cópia antes se quiser preservar o texto.</small></p><div><button type="button" data-ai-clear-cancel>Manter histórico</button><button type="button" class="danger" data-ai-clear-confirm>Sim, apagar</button></div></div>

        <section class="ai-credit-store ai-credit-store-locked" aria-labelledby="aiPacksTitle">
          <header><div><p class="eyebrow">CAMADA FUTURA</p><h4 id="aiPacksTitle">Cobrança continua desligada.</h4></div><p>A V557 não simula, vende nem concede créditos no navegador. A Whit local continua gratuita e independente desta camada.</p></header>
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
    const { signal } = this.abort;
    this.root.querySelector('.ai-mode-list').addEventListener('click', event => {
      const button = event.target.closest('[data-ai-mode]');
      if (!button) return;
      if (button.disabled) {
        this.appendSystemMessage('O modo Sol permanece desligado e não possui rota de servidor.');
        return;
      }
      this.setMode(button.dataset.aiMode);
    }, { signal });
    this.root.querySelector('.ai-delivery-v540').addEventListener('click', event => {
      const button = event.target.closest('[data-ai-delivery]');
      if (button) this.setDelivery(button.dataset.aiDelivery);
    }, { signal });
    this.focus.addEventListener('change', () => this.setFocus(this.focus.value), { signal });
    this.form.addEventListener('submit', event => { event.preventDefault(); this.send(); }, { signal });
    this.input.addEventListener('input', () => {
      store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString() });
      this.updateCharacterCount();
      this.root.querySelector('[data-ai-consent-error]').hidden = true;
    }, { signal });
    this.root.querySelector('[data-ai-stop]').addEventListener('click', () => this.abortController?.abort(), { signal });
    this.root.querySelector('[data-ai-open-account]').addEventListener('click', () => globalThis.orbe?.go?.('login'), { signal });
    this.root.querySelector('[data-ai-refresh]').addEventListener('click', () => this.loadStatus(true), { signal });
    this.root.querySelector('[data-ai-subscription]').addEventListener('click', () => globalThis.orbe?.go?.('subscriptions'), { signal });
    this.root.querySelector('[data-ai-export]').addEventListener('click', () => this.exportHistory(), { signal });
    this.root.querySelector('[data-ai-clear]').addEventListener('click', () => this.showClearConfirmation(), { signal });
    this.root.querySelector('[data-ai-clear-cancel]').addEventListener('click', () => this.hideClearConfirmation(), { signal });
    this.root.querySelector('[data-ai-clear-confirm]').addEventListener('click', () => this.clearHistory(), { signal });
    this.root.querySelector('[data-whit-clear-session]').addEventListener('click', () => this.clearSession(), { signal });
    this.root.addEventListener('click', event => {
      const prompt = event.target.closest('[data-ai-prompt]');
      if (prompt) {
        this.input.value = prompt.dataset.aiPrompt;
        this.input.dispatchEvent(new Event('input', { bubbles:true }));
        this.input.focus();
      }
      if (event.target.closest('[data-ai-extra-cancel]')) this.cancelExtra();
      if (event.target.closest('[data-ai-extra-confirm]')) this.confirmExtra();
      const passage = event.target.closest('[data-whit-passage]');
      if (passage) this.openPassage(passage.dataset.whitPassage);
    }, { signal });
    window.addEventListener('online', () => this.loadStatus(), { signal });
    window.addEventListener('offline', () => this.updateConnection(), { signal });
    window.addEventListener('divina:journal-ai-selected', () => this.prepareJournalSelection(), { signal });
    window.addEventListener('divina:tarot-ai-selected', () => this.prepareTarotSelection(), { signal });
    window.addEventListener('divina:school-ai-selected', () => this.prepareSchoolSelection(), { signal });
    document.addEventListener('divina:route-ready', event => {
      if (event.detail?.id === 'ai') this.syncOrb(); else this.releaseOrb();
    }, { signal });
    this.orb?.addEventListener('click', () => {
      const host = this.root.querySelector('[data-whit-orb-host]');
      if (document.body?.dataset?.screen !== 'ai' || !host?.contains(this.orb)) return;
      this.orbCore?.pulse?.('whit-listen', { intensity:.38, route:'ai' });
      this.openPassage('conversation');
    }, { signal });
    this.unsubscribeAuth = this.auth?.onAuthStateChange?.((event) => {
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
    store.set(AI_SETTINGS_KEY, { mode:modeId, focus:this.focusId, delivery:this.deliveryMode });
    this.renderModes();
  }

  setFocus(focusId) {
    if (!AI_POLICY.focuses[focusId] || this.sending) return;
    this.focusId = focusId;
    store.set(AI_SETTINGS_KEY, { mode:this.modeId, focus:focusId, delivery:this.deliveryMode });
    this.renderQuickPrompts();
  }

  renderModes() {
    const mode = AI_POLICY.modes[this.modeId];
    this.root.querySelectorAll('[data-ai-mode]').forEach(button => {
      const active = button.dataset.aiMode === this.modeId;
      button.setAttribute('aria-checked', String(active));
      button.classList.toggle('active', active);
      const modeMeta = AI_POLICY.modes[button.dataset.aiMode];
      const cost = button.querySelector('em');
      if (cost && modeMeta?.enabled) cost.textContent = this.deliveryMode === 'local' ? 'LOCAL · 0' : `${modeMeta.cost} ${modeMeta.cost === 1 ? 'CRÉDITO' : 'CRÉDITOS'}`;
    });
    this.root.querySelector('[data-ai-mode-disclosure]').textContent = `${mode.description} ${aiDisclosure(this.modeId)}`;
    this.root.querySelector('[data-ai-send-cost]').textContent = this.deliveryMode === 'local' ? '0 créditos' : `${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}`;
    this.renderQuickPrompts();
  }

  setDelivery(mode) {
    if (!['local','online'].includes(mode) || this.sending) return;
    this.deliveryMode = mode;
    store.set(AI_SETTINGS_KEY, { mode:this.modeId, focus:this.focusId, delivery:mode });
    this.consent.checked = false;
    this.renderDelivery();
    this.renderModes();
    this.updateConnection();
    if (mode === 'online') this.loadStatus();
  }

  renderDelivery() {
    this.root.querySelectorAll('[data-ai-delivery]').forEach(button => {
      const active = button.dataset.aiDelivery === this.deliveryMode;
      button.setAttribute('aria-checked', String(active));
      button.classList.toggle('active', active);
    });
    const local = this.deliveryMode === 'local';
    this.root.dataset.aiDelivery = this.deliveryMode;
    this.root.querySelector('[data-ai-delivery-note]').textContent = local
      ? 'A Whit local organiza possibilidades neste aparelho. Ela não chama modelo, não usa créditos e não promete inteligência ilimitada.'
      : 'A camada online só envia após consentimento, usa o ledger do servidor e permanece indisponível quando a autoridade segura não responde.';
    this.root.querySelector('[data-ai-consent-copy]').textContent = local
      ? 'Autorizo Whit local a usar somente o contexto selecionado e visível acima. Nada sai deste aparelho.'
      : 'Entendo que Whit é uma IA. Autorizo enviar esta mensagem e até 12 mensagens recentes ao servidor seguro e ao provedor configurado. Nada do Diário entra sem seleção explícita.';
    this.root.querySelector('[data-ai-command-copy]').textContent = local
      ? 'Guia local disponível · sem conta, API ou créditos'
      : 'Camada online governada · ledger do servidor · Web Search desligada';
    this.setSource(this.source, this.tarotContext);
  }

  consentRequired() {
    return this.deliveryMode === 'online' || this.source !== 'message';
  }

  renderConsent() {
    const required = this.consentRequired();
    const label = this.root.querySelector('.ai-consent');
    if (label) label.hidden = !required;
    if (!required) {
      this.consent.checked = false;
      this.root.querySelector('[data-ai-consent-error]').hidden = true;
    }
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
    const intro = `<article class="bubble bot ai-welcome"><span aria-hidden="true">✦</span><div><b>Eu sou Whit, uma presença de interface.</b><p>Posso organizar perguntas e refletir sobre símbolos. Não sou consciência, médium ou pessoa; você escolhe o que entra.</p><small>Whit local funciona sem API. A camada online é opcional e governada.</small></div></article>`;
    this.chat.innerHTML = intro + this.history.map(message => {
      const origin = message.provenance === 'local-rule-guide' || message.provenance === 'safety-local' ? 'LOCAL · SEM API' : message.provenance === 'server-model' ? 'ONLINE · SERVIDOR' : '';
      const author = message.role === 'user' ? 'VOCÊ' : message.safetyIntercepted ? 'WHIT · PROTEÇÃO' : 'WHIT';
      return `<article class="bubble ${message.role === 'user' ? 'user' : 'bot'}" data-provenance="${safe(message.provenance || 'legacy')}"><div><p>${safe(message.content).replace(/\n/g, '<br>')}</p><small>${author}${origin ? ` · ${origin}` : ''} · ${safe(formatTime(message.at))}</small></div></article>`;
    }).join('');
    this.chat.scrollTop = this.chat.scrollHeight;
    this.root.querySelector('[data-ai-history-count]').textContent = `${this.history.length} ${this.history.length === 1 ? 'mensagem preservada' : 'mensagens preservadas'} neste aparelho.`;
    this.renderSession();
  }

  persistHistory() {
    this.history = normalizeAIHistory(this.history);
    store.set(AI_HISTORY_KEY, this.history);
    this.renderHistory();
    window.dispatchEvent(new CustomEvent('whit:local-history-v557', { detail:Object.freeze({ messages:this.history.length, privateContentIncluded:false }) }));
  }

  rememberSession(content) {
    const value = String(content || '').replace(/\s+/g, ' ').trim().slice(0, 900);
    if (!value) return;
    this.sessionTurns.push(value);
    if (this.sessionTurns.length > AI_POLICY.local.sessionMemoryTurns) this.sessionTurns.splice(0, this.sessionTurns.length - AI_POLICY.local.sessionMemoryTurns);
    this.renderSession();
  }

  renderSession() {
    const copy = this.root.querySelector('[data-whit-session-copy]');
    const clear = this.root.querySelector('[data-whit-clear-session]');
    const count = this.sessionTurns.length;
    if (copy) copy.textContent = count ? `${count} ${count === 1 ? 'turno disponível' : 'turnos disponíveis'} apenas até esta página ser recarregada.` : 'Nenhuma lembrança efêmera ainda.';
    if (clear) clear.disabled = count === 0;
  }

  clearSession() {
    this.sessionTurns = [];
    this.renderSession();
    this.notify('A memória desta sessão foi apagada. O histórico local não foi alterado.');
  }

  openPassage(passage) {
    const target = passage === 'session' ? this.root.querySelector('[data-whit-session]')
      : passage === 'privacy' ? this.root.querySelector('[data-whit-privacy-anchor]')
        : this.form;
    target?.scrollIntoView({ behavior:'auto', block:'center' });
    if (passage === 'conversation') requestAnimationFrame(() => this.input?.focus({ preventScroll:true }));
  }

  syncOrb() {
    if (document.body?.dataset?.screen !== 'ai' || !this.orbCore?.claim || !this.orb) return false;
    const host = this.root.querySelector('[data-whit-orb-host]');
    if (!host) return false;
    if (host.contains(this.orb)) return true;
    this.releaseOrb();
    this.orbRelease = this.orbCore.claim(host, { mode:'ai', ariaLabel:'Orbe das Realidades. Whit local está pronta para escutar o que você escolher trazer.' });
    return true;
  }

  releaseOrb() {
    try { this.orbRelease?.(); } catch {}
    this.orbRelease = null;
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
    const local = this.deliveryMode === 'local';
    const ready = local || (online && signedIn && state.authoritative && state.enabled && state.providerConfigured && this.config.aiEnabled !== false);
    const status = this.root.querySelector('[data-ai-connection]');
    status.textContent = local ? 'Whit local pronta · 0 créditos · sem API'
      : !online ? 'Offline · camada online indisponível'
      : !signedIn ? 'Entre para usar'
        : this.config.aiEnabled === false ? 'Desligada nesta instalação'
        : !state.authoritative ? 'Verificando servidor…'
          : !state.enabled ? 'Pausada pelo controle de segurança'
            : !state.providerConfigured ? 'Provedor ainda não configurado'
              : 'Servidor e ledger disponíveis';
    status.dataset.ready = String(ready);
    this.root.querySelector('[data-ai-auth-gate]').hidden = local || signedIn;
    this.root.querySelector('[data-ai-refresh]').disabled = local || this.loadingStatus || !signedIn || !online;
    this.root.querySelector('[data-ai-send]').disabled = this.sending || !ready;
  }

  async loadStatus(notify = false) {
    if (this.loadingStatus) return;
    if (this.deliveryMode === 'local') {
      this.updateCredits();
      this.updateConnection();
      return;
    }
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
    this.root.querySelector('[data-ai-source-label]').textContent = this.source === 'message' && this.deliveryMode === 'local'
      ? 'Esta mensagem; uma continuação curta pode usar somente a memória efêmera visível da sessão'
      : sourceLabels[this.source];
    this.renderConsent();
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
    this.showContextCard('tarot', 'Uma única tiragem foi preparada.', 'Whit local usa somente as posições visíveis, com cartas diretas e sem repetição. Revise e consinta antes de refletir.');
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
    this.root.querySelectorAll('[data-ai-delivery]').forEach(button => { button.disabled = active; });
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
    pending.dataset.phase = 'listening';
    pending.innerHTML = '<span aria-hidden="true">✦</span><div><p data-ai-phase-copy>Estou escutando o que você escolheu trazer.</p><ol aria-label="Fases da resposta"><li data-phase="listening">Escuta</li><li data-phase="forming">Elaboração</li><li data-phase="answering">Resposta</li><li data-phase="silence">Silêncio</li></ol><small data-ai-phase-detail>WHIT · PRESENÇA EM FORMAÇÃO</small></div>';
    this.chat.append(pending);
    this.chat.scrollTop = this.chat.scrollHeight;
    return pending;
  }

  setPendingPhase(pending, phase) {
    if (!pending?.isConnected) return;
    const copy = {
      listening:['Estou escutando o que você escolheu trazer.','ESCUTA · CONTEXTO VISÍVEL'],
      forming:['Estou organizando possibilidades e limites.','ELABORAÇÃO · SEM CERTEZA FABRICADA'],
      answering:['A resposta encontrou uma forma.','RESPOSTA · PROVENIÊNCIA VISÍVEL'],
      silence:['Um instante de silêncio antes do próximo gesto.','SILÊNCIO · SEM LOOP']
    }[phase] || ['', ''];
    pending.dataset.phase = phase;
    pending.querySelector('[data-ai-phase-copy]').textContent = copy[0];
    pending.querySelector('[data-ai-phase-detail]').textContent = copy[1];
    pending.querySelectorAll('[data-phase]').forEach(step => step.classList.toggle('active', step.dataset.phase === phase));
    document.dispatchEvent(new CustomEvent('whit:deep-phase-v540', { detail:Object.freeze({ phase, privateContentIncluded:false }) }));
  }

  phasePause(milliseconds = 60) {
    const delay = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : milliseconds;
    return new Promise(resolve => {
      const timer = setTimeout(() => { this.phaseTimers.delete(timer); resolve(); }, delay);
      this.phaseTimers.add(timer);
    });
  }

  settleIntoSilence() {
    document.dispatchEvent(new CustomEvent('whit:deep-phase-v540', { detail:Object.freeze({ phase:'silence', privateContentIncluded:false }) }));
    const timer = setTimeout(() => {
      this.phaseTimers.delete(timer);
      document.dispatchEvent(new CustomEvent('whit:deep-phase-v540', { detail:Object.freeze({ phase:'resting', privateContentIncluded:false }) }));
    }, globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : 620);
    this.phaseTimers.add(timer);
  }

  preserveDraft(content) {
    this.input.value = String(content || '').slice(0, AI_POLICY.limits.maxMessageCharacters);
    store.set(AI_DRAFT_KEY, { text:this.input.value, source:this.source, at:new Date().toISOString(), recovery:'v557' });
    this.updateCharacterCount();
  }

  updateCreditLifecycle(state, text) {
    const output = this.root.querySelector('[data-ai-credit-lifecycle]');
    if (!output) return;
    output.dataset.state = state;
    output.textContent = text;
  }

  async sendLocal(content) {
    const message = createAIMessage('user', content, { mode:this.modeId, provenance:'system' });
    this.history.push(message);
    this.persistHistory();
    this.setSending(true);
    const pending = this.createPending();
    this.updateCreditLifecycle('local', 'Whit local · nenhum crédito reservado');
    try {
      await this.phasePause(55);
      this.setPendingPhase(pending, 'forming');
      const response = createLocalWhitResponse({ message:content, focus:this.focusId, mode:this.modeId, source:this.source, session:this.sessionTurns });
      await this.phasePause(55);
      this.setPendingPhase(pending, 'answering');
      await this.phasePause(45);
      pending.remove();
      this.history.push(createAIMessage('assistant', response.content, {
        mode:this.modeId,
        provenance:response.safetyIntercepted ? 'safety-local' : 'local-rule-guide',
        safetyIntercepted:response.safetyIntercepted
      }));
      this.rememberSession(content);
      this.persistHistory();
      this.settleIntoSilence();
      this.input.value = '';
      store.remove(AI_DRAFT_KEY);
      this.updateCharacterCount();
      this.consent.checked = false;
      this.clearPreparedContext(false);
    } catch {
      pending.remove();
      this.history = this.history.filter(item => item.id !== message.id);
      this.persistHistory();
      this.preserveDraft(content);
      this.appendSystemMessage('A reflexão local foi interrompida. Seu rascunho foi preservado para tentar novamente.', { provenance:'system' });
    } finally {
      this.setSending(false);
      this.updateConnection();
    }
  }

  async performRequest(request, pending) {
    this.abortController = new AbortController();
    this.setPendingPhase(pending, 'forming');
    const silenceTimer = setTimeout(() => this.setPendingPhase(pending, 'silence'), 900);
    this.phaseTimers.add(silenceTimer);
    let result;
    try {
      result = await this.auth.aiChat(request, this.abortController.signal);
    } finally {
      clearTimeout(silenceTimer);
      this.phaseTimers.delete(silenceTimer);
      this.abortController = null;
    }
    if (!result.ok) return { ok:false, result };
    const rawAnswer = String(result.body?.answer || '').trim();
    if (!rawAnswer) return { ok:false, result:{ body:{ error:{ code:'EMPTY_RESPONSE' } }, message:'A resposta veio vazia.' } };
    const answer = structuredOnlineAnswer(rawAnswer);
    this.setPendingPhase(pending, 'answering');
    return { ok:true, result, answer };
  }

  async send() {
    if (this.sending || this.pendingExtra) return;
    const content = this.input.value.trim();
    const mode = AI_POLICY.modes[this.modeId];
    if (!content) { this.input.focus(); return; }
    if (this.consentRequired() && !this.consent.checked) {
      this.root.querySelector('[data-ai-consent-error]').hidden = false;
      this.consent.focus();
      return;
    }
    if (!mode?.enabled) { this.appendSystemMessage('O modo Sol permanece desligado.'); return; }
    if (this.deliveryMode === 'local') {
      await this.sendLocal(content);
      return;
    }
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
    const userMessage = createAIMessage('user', content, { mode:this.modeId, provenance:'system', requestId:request.requestId });
    this.history.push(userMessage);
    this.persistHistory();
    this.input.value = '';
    store.remove(AI_DRAFT_KEY);
    this.updateCharacterCount();
    this.consent.checked = false;
    this.setSending(true);
    const pending = this.createPending();
    this.updateCreditLifecycle('reservation', `Reserva solicitada ao servidor · ${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'}`);

    try {
      const outcome = await this.performRequest(request, pending);
      if (!outcome.ok) {
        const code = this.errorCode(outcome.result);
        pending.remove();
        if (code === 'EXTRA_CONFIRMATION_REQUIRED') {
          this.pendingExtra = { request:{ ...request, confirmExtra:true }, content };
          this.updateCreditLifecycle('confirmation', 'Aguardando sua confirmação · nenhuma reserva local');
          this.showExtraConfirmation(mode.cost);
          return;
        }
        this.history = this.history.filter(item => item.id !== userMessage.id);
        this.persistHistory();
        this.preserveDraft(content);
        this.updateCreditLifecycle('released', 'Falha recuperável · nenhum débito local · confira o ledger');
        this.appendSystemMessage(this.errorText(outcome.result));
        return;
      }
      pending.remove();
      this.history.push(createAIMessage('assistant', outcome.answer, { mode:this.modeId, provenance:'server-model', requestId:request.requestId, safetyIntercepted:outcome.result.body?.safetyIntercepted === true }));
      this.persistHistory();
      this.settleIntoSilence();
      this.updateCreditLifecycle('confirmed', `Servidor confirmou a resposta · ${mode.cost} ${mode.cost === 1 ? 'crédito' : 'créditos'} no ledger`);
      this.clearPreparedContext(false);
      await this.loadStatus();
    } catch {
      this.history = this.history.filter(item => item.id !== userMessage.id);
      this.persistHistory();
      this.preserveDraft(content);
      this.updateCreditLifecycle('released', 'Conexão interrompida · rascunho preservado · confira o ledger');
      this.appendSystemMessage('A camada online foi interrompida. Seu rascunho foi preservado; atualize o ledger antes de tentar novamente.', { provenance:'system' });
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
    this.updateCreditLifecycle('released', 'Envio cancelado · nenhum crédito extra autorizado');
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
    this.updateCreditLifecycle('reservation', 'Reserva confirmada por você · aguardando servidor');
    try {
      const outcome = await this.performRequest(pendingRequest.request, pending);
      pending.remove();
      if (!outcome.ok) {
        this.pendingExtra = pendingRequest;
        this.preserveDraft(pendingRequest.content);
        this.updateCreditLifecycle('released', 'Falha recuperável · confira o ledger antes de repetir');
        this.appendSystemMessage(this.errorText(outcome.result));
        return;
      }
      this.history.push(createAIMessage('assistant', outcome.answer, { mode:this.modeId, provenance:'server-model', requestId:pendingRequest.request.requestId, safetyIntercepted:outcome.result.body?.safetyIntercepted === true }));
      this.persistHistory();
      this.settleIntoSilence();
      this.updateCreditLifecycle('confirmed', 'Servidor confirmou a resposta no ledger');
      this.clearPreparedContext(false);
      await this.loadStatus();
    } catch {
      this.pendingExtra = pendingRequest;
      this.preserveDraft(pendingRequest.content);
      this.updateCreditLifecycle('released', 'Conexão interrompida · confirmação preservada');
      this.appendSystemMessage('A camada online foi interrompida. A confirmação ficou preservada e nenhum débito local foi criado.', { provenance:'system' });
    } finally {
      pending.remove();
      this.abortController = null;
      this.setSending(false);
      this.updateConnection();
    }
  }

  status() {
    return Object.freeze({
      release:'V557',
      mode:this.deliveryMode,
      localDefault:true,
      sessionTurns:this.sessionTurns.length,
      sessionMemoryPersistent:false,
      localNetworkCalls:0,
      localModelCalls:0,
      localCreditsUsed:0,
      explicitVisibleContextOnly:true,
      canonicalOrb:true,
      duplicateOrbs:0,
      permanentAnimationLoops:0
    });
  }

  destroy() {
    this.abortController?.abort();
    this.abort.abort();
    this.phaseTimers.forEach(timer => clearTimeout(timer));
    this.phaseTimers.clear();
    this.releaseOrb();
    this.sessionTurns = [];
    try { this.unsubscribeAuth?.(); } catch {}
  }
}
