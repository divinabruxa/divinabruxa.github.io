/* DIVINA BRUXA 2.0 — REBIRTH R013 · WHIT MIND / CONVERSATION CORE V312
   Une presença, assinatura, recibo de contexto, continuidade pública da sessão e
   metadados de memória em um envelope de UMA resposta.

   PRIVACIDADE POR ARQUITETURA:
   - o texto da mensagem só entra após o consentimento explícito do formulário;
   - o envelope vive apenas em memória RAM e expira rapidamente;
   - nenhum texto do Diário, Tiragens ou Escola é lido por esta camada;
   - contexto privado continua sendo responsabilidade do fluxo explícito já existente;
   - eventos públicos recebem somente metadados, nunca o corpo da mensagem;
   - V312 não altera a requisição V190 e não chama API/modelo por conta própria. */

const RELEASE = 'V312';
const STYLE_ID = 'whitMindV312Styles';
const PANEL_ID = 'whitMindV312Panel';
const ENVELOPE_TTL_MS = 2 * 60 * 1000;
const MAX_CONTINUITY = 6;

const clean = (value, limit = 180) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const nowIso = () => new Date().toISOString();
const futureIso = ms => new Date(Date.now() + ms).toISOString();

const freeze = value => Object.freeze(value);

const currentRoute = () => clean(
  document.body?.dataset?.screen
    || document.querySelector('#app > .screen.active[id]')?.id
    || location.hash.replace(/^#/, '')
    || 'home',
  60
);

const makeId = () => {
  try {
    if (globalThis.crypto?.randomUUID) return `mind:${crypto.randomUUID()}`;
  } catch {}
  return `mind:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
};

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-mind-v312.css?v=312';
  document.head.append(link);
}

function formSnapshot(form) {
  if (!form?.matches?.('#aiApp #chatForm')) return null;
  const consent = form.querySelector('#aiConsent');
  const input = form.querySelector('#chatInput');
  const focus = form.querySelector('#aiFocus');
  const checkedMode = document.querySelector('#aiApp [data-ai-mode][aria-checked="true"]');
  const sourceLabel = document.querySelector('#aiApp [data-ai-source-label]');

  return freeze({
    consent:Boolean(consent?.checked),
    message:typeof input?.value === 'string' ? input.value.trim() : '',
    focus:clean(focus?.value || 'reflection', 60),
    mode:clean(checkedMode?.dataset?.aiMode || 'luna', 40),
    sourceLabel:clean(sourceLabel?.textContent || 'mensagem', 180)
  });
}

function safeContextReceipt(bridge) {
  let receipt = null;
  try { receipt = bridge?.active?.() || bridge?.status?.()?.activeReceipt || null; } catch {}
  if (!receipt?.id) return null;

  return freeze({
    id:clean(receipt.id, 220),
    source:clean(receipt.source, 60),
    resourceType:clean(receipt.resourceType, 80),
    resourceId:clean(receipt.resourceId, 180),
    label:clean(receipt.label, 140),
    privacy:clean(receipt.privacy, 80),
    capability:clean(receipt.capability, 100),
    selectedAt:clean(receipt.selectedAt, 60),
    expiresAt:clean(receipt.expiresAt, 60),
    sendConsentRequired:receipt.sendConsentRequired !== false,
    bodyIncluded:false
  });
}

function safeMemoryMetadata(memoryGarden) {
  let status = null;
  try { status = memoryGarden?.status?.() || null; } catch {}
  if (!status) return freeze({ available:false, contentRead:false });

  return freeze({
    available:true,
    signedIn:Boolean(status.signedIn),
    sessionMemoryItems:Number(status.sessionMemoryItems) || 0,
    persistentMetadataItems:Number(status.persistentMetadataItems) || 0,
    persistentContentDisplayed:false,
    contentRead:false,
    privateScan:false
  });
}

function safePersonaContract(signature) {
  let contract = null;
  try { contract = signature?.generationContract?.() || null; } catch {}
  if (!contract) return null;
  // The V311 contract is already frozen and contains no private user data.
  return contract;
}

export class WhitMindV312 {
  constructor({
    core = globalThis.whit,
    presence = globalThis.divinaWhitV307?.presence,
    nervousSystem = globalThis.divinaWhitV308?.nervousSystem,
    contextBridge = globalThis.divinaWhitV309?.contextBridge,
    memoryGarden = globalThis.divinaWhitV310?.memoryGarden,
    signature = globalThis.divinaWhitV311?.signature,
    authClient = globalThis.divinaAuth
  } = {}) {
    this.core = core || null;
    this.presence = presence || null;
    this.nervousSystem = nervousSystem || null;
    this.contextBridge = contextBridge || null;
    this.memoryGarden = memoryGarden || null;
    this.signature = signature || null;
    this.authClient = authClient || null;
    this.abort = new AbortController();
    this.continuity = [];
    this.activeEnvelope = null;
    this.expiryTimer = 0;
    this.destroyed = false;
    this.panel = null;
    this.chatObserver = null;
    this.messageCount = 0;
    this.mountAttempts = 0;
    this.mountTimer = 0;

    installStyle();
    document.documentElement.dataset.whitMind = 'v312';
    this.noteRoute(currentRoute(), 'boot');
    this.bind();
    this.mountPanel();
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('divina:page-ready', event => {
      const route = clean(event.detail?.id || currentRoute(), 60);
      this.noteRoute(route, 'page-ready');
      if (route === 'ai') queueMicrotask(() => this.mountPanel());
      else this.disconnectChatObserver();
    }, { signal });

    document.addEventListener('divina:route-ready', event => {
      const route = clean(event.detail?.id || currentRoute(), 60);
      this.noteRoute(route, 'route-ready');
      if (route === 'ai') queueMicrotask(() => this.mountPanel());
    }, { signal });

    addEventListener('whit:nerve', event => {
      const kind = clean(event.detail?.kind, 80);
      if (!kind) return;
      this.noteContinuity({ type:'nerve', value:kind, route:currentRoute() });
      this.renderPanel();
    }, { signal });

    addEventListener('whit:context-receipt', () => this.renderPanel(), { signal });
    addEventListener('whit:memory-changed', () => this.renderPanel(), { signal });

    // Capture happens before AIEngine V190 handles the same submit event.
    // Nothing is prepared if the user has not checked the explicit consent box.
    document.addEventListener('submit', event => {
      const form = event.target;
      if (!form?.matches?.('#aiApp #chatForm')) return;
      const snap = formSnapshot(form);
      if (!snap?.consent || !snap.message) {
        form?.removeAttribute?.('data-whit-mind-envelope');
        this.clearEnvelope('no-consent');
        this.renderPanel();
        return;
      }

      const envelope = this.prepareTurn({
        message:snap.message,
        consent:true,
        mode:snap.mode,
        focus:snap.focus,
        sourceLabel:snap.sourceLabel,
        route:currentRoute()
      });
      if (envelope?.id) form.dataset.whitMindEnvelope = envelope.id;
    }, { capture:true, signal });

    document.addEventListener('change', event => {
      if (event.target?.id === 'aiConsent') this.renderPanel();
    }, { signal });

    addEventListener('pagehide', () => this.clearEnvelope('pagehide'), { signal });
    addEventListener('divina:auth-state', event => {
      const authEvent = String(event.detail?.event || event.detail || '').toUpperCase();
      if (authEvent.includes('SIGNED_OUT')) this.clearEnvelope('signed-out');
      this.renderPanel();
    }, { signal });
  }

  noteRoute(route, reason = 'route') {
    const value = clean(route, 60);
    if (!value) return;
    const last = this.continuity.at(-1);
    if (last?.type === 'route' && last.value === value) return;
    this.noteContinuity({ type:'route', value, reason:clean(reason, 40), route:value });
  }

  noteContinuity(entry) {
    this.continuity.push(freeze({
      type:clean(entry?.type || 'event', 30),
      value:clean(entry?.value, 80),
      route:clean(entry?.route || currentRoute(), 60),
      reason:clean(entry?.reason || '', 40),
      at:nowIso()
    }));
    if (this.continuity.length > MAX_CONTINUITY) {
      this.continuity.splice(0, this.continuity.length - MAX_CONTINUITY);
    }
  }

  publicContinuity() {
    return freeze(this.continuity.map(item => freeze({ ...item })));
  }

  prepareTurn({ message, consent, mode = 'luna', focus = 'reflection', sourceLabel = 'mensagem', route = currentRoute() } = {}) {
    const uiConsent = Boolean(document.querySelector('#aiApp #aiConsent')?.checked);
    if (this.destroyed || consent !== true || !uiConsent) return null;
    const text = String(message ?? '').trim();
    if (!text) return null;

    this.clearEnvelope('replaced');

    const persona = safePersonaContract(this.signature);
    const receipt = safeContextReceipt(this.contextBridge);
    const memory = safeMemoryMetadata(this.memoryGarden);
    const id = makeId();
    const continuity = this.publicContinuity();

    const envelope = freeze({
      id,
      release:RELEASE,
      preparedAt:nowIso(),
      expiresAt:futureIso(ENVELOPE_TTL_MS),
      oneTurn:true,
      transient:true,
      consumed:false,
      route:clean(route, 60),
      mode:clean(mode, 40),
      focus:clean(focus, 60),
      sourceLabel:clean(sourceLabel, 180),
      consent:freeze({
        explicit:true,
        aiForm:true,
        privateContextStillScoped:true
      }),
      userMessage:text,
      userMessageMetadata:freeze({
        characters:text.length,
        persistedByMind:false
      }),
      persona,
      contextReceipt:receipt,
      memoryMetadata:memory,
      continuity,
      historyPolicy:freeze({
        readByMind:false,
        managedByExistingAIEngine:true,
        maxRecentMessagesManagedElsewhere:12
      }),
      privacy:freeze({
        persistentPromptStorage:false,
        silentPrivateReads:false,
        privateBodyReadByMind:false,
        publicEventContainsMessage:false,
        serverRequestAlteredByMind:false
      })
    });

    this.activeEnvelope = envelope;
    this.expiryTimer = globalThis.setTimeout(() => this.clearEnvelope('expired'), ENVELOPE_TTL_MS + 250);

    try {
      this.core?.rememberSession?.('mind:last-turn-meta', {
        id,
        release:RELEASE,
        route:envelope.route,
        mode:envelope.mode,
        focus:envelope.focus,
        preparedAt:envelope.preparedAt,
        expiresAt:envelope.expiresAt,
        hasContext:Boolean(receipt),
        messageStored:false
      });
    } catch {}

    try {
      this.nervousSystem?.signal?.('mind-turn-prepared', {
        visible:false,
        route:envelope.route,
        hasContext:Boolean(receipt)
      });
    } catch {}

    dispatchEvent(new CustomEvent('whit:mind-turn-prepared', {
      detail:freeze({
        id,
        release:RELEASE,
        route:envelope.route,
        mode:envelope.mode,
        focus:envelope.focus,
        hasContext:Boolean(receipt),
        personaReady:Boolean(persona),
        expiresAt:envelope.expiresAt,
        messageIncluded:false,
        local:true,
        apiUsed:false
      })
    }));

    this.renderPanel();
    return envelope;
  }

  peekEnvelopeMeta() {
    const envelope = this.activeEnvelope;
    if (!envelope) return null;
    return freeze({
      id:envelope.id,
      release:RELEASE,
      route:envelope.route,
      mode:envelope.mode,
      focus:envelope.focus,
      preparedAt:envelope.preparedAt,
      expiresAt:envelope.expiresAt,
      hasContext:Boolean(envelope.contextReceipt),
      personaReady:Boolean(envelope.persona),
      transient:true
    });
  }

  takeEnvelope(id) {
    const envelope = this.activeEnvelope;
    if (!envelope || !id || envelope.id !== id) return null;
    if (new Date(envelope.expiresAt).getTime() <= Date.now()) {
      this.clearEnvelope('expired-before-consume');
      return null;
    }

    this.activeEnvelope = null;
    clearTimeout(this.expiryTimer);
    this.expiryTimer = 0;
    try { this.core?.rememberSession?.('mind:last-turn-meta', null); } catch {}

    dispatchEvent(new CustomEvent('whit:mind-turn-consumed', {
      detail:freeze({ id, release:RELEASE, local:true, apiUsed:false, messageIncluded:false })
    }));
    this.renderPanel();
    return envelope;
  }

  clearEnvelope(reason = 'manual') {
    const previous = this.activeEnvelope;
    this.activeEnvelope = null;
    clearTimeout(this.expiryTimer);
    this.expiryTimer = 0;
    try { this.core?.rememberSession?.('mind:last-turn-meta', null); } catch {}

    if (previous?.id) {
      dispatchEvent(new CustomEvent('whit:mind-turn-cleared', {
        detail:freeze({
          id:previous.id,
          release:RELEASE,
          reason:clean(reason, 80),
          messageIncluded:false,
          local:true,
          apiUsed:false
        })
      }));
    }
    return Boolean(previous);
  }

  mountPanel() {
    if (this.destroyed || currentRoute() !== 'ai') return false;
    const conversation = document.querySelector('#aiApp .ai-conversation');
    if (!conversation) {
      if (this.mountAttempts < 8) {
        this.mountAttempts += 1;
        clearTimeout(this.mountTimer);
        this.mountTimer = globalThis.setTimeout(() => this.mountPanel(), 180);
      }
      return false;
    }
    this.mountAttempts = 0;
    clearTimeout(this.mountTimer);
    this.mountTimer = 0;

    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('aside');
      panel.id = PANEL_ID;
      panel.className = 'whit-mind-v312';
      panel.setAttribute('aria-label', 'Estado da mente conversacional da Whit');
      panel.innerHTML = `
        <div class="whit-mind-v312__orb" aria-hidden="true"><i></i><b>✦</b></div>
        <div class="whit-mind-v312__body">
          <div class="whit-mind-v312__title"><span>WHIT MIND · V312</span><strong data-wm312-state>Presença conectada</strong></div>
          <div class="whit-mind-v312__badges" aria-label="Proteções ativas">
            <span>PERSONA</span><span>CONTEXTO EXPLÍCITO</span><span>MEMÓRIA SOB CONTROLE</span><span>EFÊMERO</span>
          </div>
          <p data-wm312-copy>Preparando continuidade segura desta sessão…</p>
          <div class="whit-mind-v312__meter" aria-hidden="true"><i></i></div>
        </div>`;

      const signatureSeal = conversation.querySelector('#whitSignatureV311Seal');
      if (signatureSeal?.nextSibling) conversation.insertBefore(panel, signatureSeal.nextSibling);
      else {
        const head = conversation.querySelector('.ai-conversation-head');
        if (head?.nextSibling) conversation.insertBefore(panel, head.nextSibling);
        else conversation.prepend(panel);
      }
    }

    this.panel = panel;
    this.connectChatObserver();
    this.renderPanel();
    return true;
  }

  connectChatObserver() {
    if (this.chatObserver) return;
    const chat = document.querySelector('#aiApp #chat');
    if (!chat) return;
    const update = () => {
      this.messageCount = chat.children?.length || 0;
      this.renderPanel();
    };
    update();
    this.chatObserver = new MutationObserver(update);
    this.chatObserver.observe(chat, { childList:true });
  }

  disconnectChatObserver() {
    this.chatObserver?.disconnect?.();
    this.chatObserver = null;
    this.messageCount = 0;
  }

  renderPanel() {
    if (this.destroyed) return;
    if (!this.panel?.isConnected) {
      if (currentRoute() === 'ai') this.mountPanel();
      return;
    }

    const consent = Boolean(document.querySelector('#aiApp #aiConsent')?.checked);
    const receipt = safeContextReceipt(this.contextBridge);
    const memory = safeMemoryMetadata(this.memoryGarden);
    const personaReady = Boolean(safePersonaContract(this.signature));
    const envelope = this.peekEnvelopeMeta();
    const state = this.panel.querySelector('[data-wm312-state]');
    const copy = this.panel.querySelector('[data-wm312-copy]');

    if (state) state.textContent = envelope ? 'Envelope mental pronto' : 'Presença conectada';
    if (copy) {
      const pieces = [
        personaReady ? 'persona V311 conectada' : 'persona aguardando',
        receipt ? '1 contexto explicitamente selecionado' : 'nenhum contexto privado selecionado',
        memory.available ? `${memory.sessionMemoryItems} lembrança(s) da sessão · ${memory.persistentMetadataItems} memória(s) persistente(s) sob controle` : 'memória indisponível',
        `${this.messageCount} item(ns) visível(is) na conversa`
      ];
      copy.textContent = `${pieces.join(' · ')}. ${consent ? 'Consentimento de envio marcado.' : 'Nada novo é preparado até você autorizar o envio.'}`;
    }

    this.panel.dataset.ready = personaReady ? 'true' : 'false';
    this.panel.dataset.context = receipt ? 'selected' : 'none';
    this.panel.dataset.consent = consent ? 'true' : 'false';
    this.panel.dataset.envelope = envelope ? 'ready' : 'none';
  }

  status() {
    return freeze({
      release:RELEASE,
      mindRouter:true,
      conversationContinuity:true,
      continuityItems:this.continuity.length,
      messageCount:this.messageCount,
      activeEnvelope:Boolean(this.activeEnvelope),
      activeEnvelopeMeta:this.peekEnvelopeMeta(),
      explicitContextOnly:true,
      memoryContentRead:false,
      persistentPromptStorage:false,
      silentPrivateReads:false,
      publicEventsContainMessage:false,
      personaContractReady:Boolean(safePersonaContract(this.signature)),
      serverBridgeActive:false,
      requestSchemaAltered:false,
      generationEnabled:false,
      apiUsed:false,
      paidApiUsed:false
    });
  }

  destroy() {
    this.destroyed = true;
    this.clearEnvelope('destroyed');
    this.abort.abort();
    clearTimeout(this.mountTimer);
    this.mountTimer = 0;
    this.disconnectChatObserver();
    this.panel?.remove();
    delete document.documentElement.dataset.whitMind;
  }
}

export const createWhitMindV312 = options => new WhitMindV312(options);
