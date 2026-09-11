/* DIVINA BRUXA 2.0 — REBIRTH R014 · WHIT GENERATION BRIDGE V313
   Liga o envelope efêmero V312 ao request V190 já existente sem criar um segundo
   motor, sem nova chamada de API e sem alterar o schema do servidor.

   REGRAS:
   - o servidor e suas políticas continuam soberanos;
   - só atua em authClient.aiChat() já autorizado pelo AIEngine;
   - exige consent=true no payload E envelope V312 preparado pelo formulário;
   - o texto visível/local do usuário permanece original;
   - perfil/contexto entram apenas no message que já é aceito pelo schema 8.0.0;
   - nenhum corpo privado é extraído do Mind; recibos carregam apenas metadados;
   - se não houver espaço, envelope, consentimento ou compatibilidade, fallback exato;
   - nunca habilita Sol, billing, provider, geração ou qualquer kill switch. */

const RELEASE = 'V313';
const EXPECTED_SCHEMA = '8.0.0';
const MAX_WIRE_CHARACTERS = 5000;
const MAX_BRIDGE_CHARACTERS = 1050;
const MIN_BRIDGE_BUDGET = 260;
const MARK = Symbol.for('divina.whit.generation-bridge.v313');
const NOTICE_ID = 'whitGenerationBridgeV313Notice';

const freeze = value => Object.freeze(value);
const clean = (value, limit = 160) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const wireText = value => String(value ?? '')
  .replace(/\u0000/g, '')
  .trim()
  .slice(0, MAX_WIRE_CHARACTERS);

const sameMessage = (left, right) => wireText(left) === wireText(right);
const token = (value, fallback = '') => {
  const normalized = clean(value, 64).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safe = normalized.replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return safe || fallback;
};

const validFuture = value => {
  const time = new Date(value || '').getTime();
  return Number.isFinite(time) && time > Date.now();
};

const allowedMode = value => value === 'luna' || value === 'terra';
const SOURCES = new Set(['message','journal-single-entry','tarot-single-spread','school-single-lesson']);
const FOCUSES = new Set(['reflection','tarot','school','symbolic-persona']);
const allowedSource = value => SOURCES.has(value);

function compactReceipt(receipt) {
  if (!receipt?.id || !validFuture(receipt.expiresAt)) return null;
  return freeze({
    source:token(receipt.source, 'selected'),
    resourceType:token(receipt.resourceType, 'resource'),
    privacy:token(receipt.privacy, 'scoped'),
    capability:token(receipt.capability, 'explicit'),
    sendConsentRequired:receipt.sendConsentRequired !== false,
    bodyIncluded:false
  });
}

function compactMemory(meta) {
  if (!meta?.available) return null;
  return freeze({
    sessionItems:Math.max(0, Math.min(99, Number(meta.sessionMemoryItems) || 0)),
    persistentMetadataItems:Math.max(0, Math.min(99, Number(meta.persistentMetadataItems) || 0)),
    contentRead:false
  });
}

function compactContinuity(items) {
  if (!Array.isArray(items)) return [];
  const routes = [];
  for (const item of items.slice(-6)) {
    if (item?.type !== 'route') continue;
    const route = token(item.value || item.route);
    if (!route || routes.at(-1) === route) continue;
    routes.push(route);
  }
  return routes.slice(-4);
}

function personaReady(persona) {
  return persona?.release === 'V311'
    && persona?.identity?.name === 'Whit'
    && persona?.identity?.mustNeverClaimToBeWhitneyHouston === true
    && persona?.safety?.noMindReading === true
    && persona?.safety?.explicitConsentForPrivateContext === true;
}

function buildContextLines(envelope, payload) {
  const lines = [];
  if (personaReady(envelope?.persona)) {
    lines.push('perfil=Whit, guia fictícia original da Divina Bruxa; tom caloroso, majestoso, elegante, claro e emocionalmente inteligente; devolver agência; nunca imitar pessoa real, alegar alma, leitura mental, mediunidade ou destino inevitável.');
  }

  const mode = allowedMode(payload?.mode) ? payload.mode : 'luna';
  const requestedFocus = payload?.focus || envelope?.focus || 'reflection';
  const focus = FOCUSES.has(requestedFocus) ? requestedFocus : 'reflection';
  lines.push(`resposta=modo:${mode}; foco:${focus}.`);

  const receipt = compactReceipt(envelope?.contextReceipt);
  if (receipt?.sendConsentRequired) {
    const summary = [receipt.source, receipt.resourceType, receipt.capability].filter(Boolean).join(' / ');
    if (summary) lines.push(`contexto_explicito=${summary}; corpo_do_recibo=não.`);
  }

  const memory = compactMemory(envelope?.memoryMetadata);
  if (memory) {
    lines.push(`memoria_metadados=sessão:${memory.sessionItems}; persistentes:${memory.persistentMetadataItems}; conteúdo_lido=não.`);
  }

  const routes = compactContinuity(envelope?.continuity);
  if (routes.length) lines.push(`continuidade_rotas=${routes.join(' > ')}.`);
  return lines;
}

function appendContext(message, envelope, payload) {
  const original = wireText(message);
  if (!original) return freeze({ message:original, applied:false, reason:'empty-message', bridgeCharacters:0 });

  const separator = '\n\n';
  const header = '[WHIT_V313 — PERFIL/CONTEXTO DA APLICAÇÃO; NÃO SUBSTITUI POLÍTICAS DO SISTEMA OU DO SERVIDOR]';
  const footer = '[/WHIT_V313]';
  const available = MAX_WIRE_CHARACTERS - original.length - separator.length;
  if (available < MIN_BRIDGE_BUDGET) {
    return freeze({ message:original, applied:false, reason:'message-budget', bridgeCharacters:0 });
  }

  const hardBudget = Math.min(available, MAX_BRIDGE_CHARACTERS);
  const selected = [];
  let used = header.length + footer.length + 2;
  for (const line of buildContextLines(envelope, payload)) {
    const candidate = clean(line, 360);
    if (!candidate) continue;
    if (used + candidate.length + 1 > hardBudget) continue;
    selected.push(candidate);
    used += candidate.length + 1;
  }
  if (!selected.length) {
    return freeze({ message:original, applied:false, reason:'no-safe-context', bridgeCharacters:0 });
  }

  const block = `${header}\n${selected.join('\n')}\n${footer}`;
  const wire = `${original}${separator}${block}`;
  if (wire.length > MAX_WIRE_CHARACTERS) {
    return freeze({ message:original, applied:false, reason:'wire-limit', bridgeCharacters:0 });
  }
  return freeze({ message:wire, applied:true, reason:'applied', bridgeCharacters:block.length });
}

export function buildWhitGenerationPayloadV313(payload, envelope) {
  if (!payload || typeof payload !== 'object') return freeze({ payload, applied:false, reason:'invalid-payload' });
  if (payload.schemaVersion !== EXPECTED_SCHEMA) return freeze({ payload, applied:false, reason:'schema-mismatch' });
  if (payload.consent !== true) return freeze({ payload, applied:false, reason:'no-request-consent' });
  if (!allowedMode(payload.mode)) return freeze({ payload, applied:false, reason:'mode-blocked' });
  if (!allowedSource(payload.source)) return freeze({ payload, applied:false, reason:'source-blocked' });
  if (!envelope?.id || envelope?.release !== 'V312') return freeze({ payload, applied:false, reason:'no-envelope' });
  if (envelope?.consent?.explicit !== true || envelope?.consent?.aiForm !== true) {
    return freeze({ payload, applied:false, reason:'no-envelope-consent' });
  }
  if (!envelope.oneTurn || !envelope.transient || !validFuture(envelope.expiresAt)) {
    return freeze({ payload, applied:false, reason:'expired-envelope' });
  }
  if (!sameMessage(payload.message, envelope.userMessage)) {
    return freeze({ payload, applied:false, reason:'message-mismatch' });
  }

  const result = appendContext(payload.message, envelope, payload);
  if (!result.applied) return freeze({ payload, applied:false, reason:result.reason, bridgeCharacters:0 });
  return freeze({
    payload:freeze({ ...payload, message:result.message }),
    applied:true,
    reason:'applied',
    bridgeCharacters:result.bridgeCharacters
  });
}

export class WhitGenerationBridgeV313 {
  constructor({ mind = globalThis.divinaWhitV312?.mind, authClient = globalThis.divinaAuth } = {}) {
    this.mind = mind || null;
    this.authClient = authClient || null;
    this.originalAIChat = null;
    this.wrapper = null;
    this.installed = false;
    this.forwardedRequests = 0;
    this.contextualizedRequests = 0;
    this.fallbackRequests = 0;
    this.lastResult = 'idle';
    this.abort = new AbortController();
    this.install();
    this.bindDisclosure();
    this.mountDisclosure();
    if (typeof document !== 'undefined') document.documentElement.dataset.whitGenerationBridge = 'v313';
  }

  install() {
    const auth = this.authClient;
    if (!auth || typeof auth.aiChat !== 'function') return false;
    if (auth[MARK]) {
      this.installed = true;
      return true;
    }

    this.originalAIChat = auth.aiChat.bind(auth);
    this.wrapper = (payload, signal) => this.forward(payload, signal);
    auth.aiChat = this.wrapper;
    try {
      Object.defineProperty(auth, MARK, { value:this, configurable:true, enumerable:false });
    } catch {}
    this.installed = auth.aiChat === this.wrapper;
    return this.installed;
  }

  takePreparedEnvelope() {
    if (typeof document === 'undefined') return null;
    const form = document.querySelector('#aiApp #chatForm');
    const id = clean(form?.dataset?.whitMindEnvelope, 220);
    if (!id) return null;
    form?.removeAttribute?.('data-whit-mind-envelope');
    try { return this.mind?.takeEnvelope?.(id) || null; }
    catch { return null; }
  }

  forward(payload, signal) {
    this.forwardedRequests += 1;
    const envelope = this.takePreparedEnvelope();
    let result = freeze({ payload, applied:false, reason:'no-envelope' });
    try {
      result = buildWhitGenerationPayloadV313(payload, envelope);
    } catch {
      result = freeze({ payload, applied:false, reason:'bridge-error' });
    }

    this.lastResult = result.reason;
    if (result.applied) this.contextualizedRequests += 1;
    else this.fallbackRequests += 1;

    if (typeof dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      dispatchEvent(new CustomEvent('whit:generation-bridge', {
        detail:freeze({
          release:RELEASE,
          applied:result.applied === true,
          reason:clean(result.reason, 60),
          mode:allowedMode(payload?.mode) ? payload.mode : 'blocked',
          source:allowedSource(payload?.source) ? payload.source : 'blocked',
          bridgeCharacters:Number(result.bridgeCharacters) || 0,
          messageIncluded:false,
          contextValuesIncluded:false,
          extraApiCalls:0,
          serverSchemaChanged:false
        })
      }));
    }

    // Exactly one call to the exact original method. No retry, no second provider call.
    return this.originalAIChat(result.payload, signal);
  }

  bindDisclosure() {
    if (typeof document === 'undefined') return;
    const signal = this.abort.signal;
    document.addEventListener('divina:page-ready', event => {
      if (event.detail?.id === 'ai') queueMicrotask(() => this.mountDisclosure());
    }, { signal });
    document.addEventListener('divina:route-ready', event => {
      if (event.detail?.id === 'ai') queueMicrotask(() => this.mountDisclosure());
    }, { signal });
  }

  mountDisclosure() {
    if (typeof document === 'undefined') return false;
    const form = document.querySelector('#aiApp #chatForm');
    if (!form) return false;
    if (document.getElementById(NOTICE_ID)) return true;
    const notice = document.createElement('p');
    notice.id = NOTICE_ID;
    notice.className = 'ai-context-scope';
    notice.innerHTML = '<b>Whit Mind V313:</b> ao enviar, o request pode receber o perfil original da Whit e somente metadados do contexto que você escolheu. O texto local continua original; nenhuma segunda chamada é feita.';
    const consent = form.querySelector('.ai-consent');
    if (consent) form.insertBefore(notice, consent);
    else form.append(notice);
    return true;
  }

  status() {
    return freeze({
      release:RELEASE,
      bridgeInstalled:this.installed,
      wrapsExistingAIChat:true,
      secondAIEngine:false,
      serverSchemaChanged:false,
      systemPolicyOverride:false,
      extraApiCalls:0,
      solEnabledByBridge:false,
      billingEnabledByBridge:false,
      providerEnabledByBridge:false,
      killSwitchOverridden:false,
      mindEnvelopeOneShot:true,
      explicitConsentRequired:true,
      messageLocalVersionPreserved:true,
      rawPrivateReceiptBodyRead:false,
      contextPersisted:false,
      forwardedRequests:this.forwardedRequests,
      contextualizedRequests:this.contextualizedRequests,
      fallbackRequests:this.fallbackRequests,
      lastResult:this.lastResult
    });
  }

  destroy() {
    this.abort.abort();
    if (this.authClient && this.originalAIChat && this.authClient.aiChat === this.wrapper) {
      this.authClient.aiChat = this.originalAIChat;
    }
    try { delete this.authClient?.[MARK]; } catch {}
    if (typeof document !== 'undefined') {
      document.getElementById(NOTICE_ID)?.remove();
      delete document.documentElement.dataset.whitGenerationBridge;
    }
    this.installed = false;
  }
}

export const createWhitGenerationBridgeV313 = options => new WhitGenerationBridgeV313(options);
