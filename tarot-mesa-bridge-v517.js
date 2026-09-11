/* DIVINA BRUXA — PONTE TAROT LIVRE → MESA REAL V517
   Transporta somente IDs canônicos, na ordem em que nasceram da Orbe.
   A autorização Premium da Mesa Real continua sendo decidida pelo motor V213. */

import { CARDS } from './tarot-data.js';
import { store } from './storage.js';

const VERSION = 517;
const TRANSFER_KEY = 'tarot-livre-mesa-transfer-v517';
const INSTANCE_MARK = Symbol.for('divina.tarot.mesa.bridge.v517');

const uuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const values = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(4))
    : Uint32Array.from({ length:4 }, () => Math.floor(Math.random() * 0xffffffff));
  return [...values].map(value => value.toString(16).padStart(8, '0')).join('-');
};

const cleanCardIds = value => {
  const ids = Array.isArray(value) ? value : [];
  const unique = [];
  const seen = new Set();
  for (const raw of ids) {
    const id = Number(raw);
    if (!Number.isInteger(id) || id < 0 || !CARDS[id] || CARDS[id].orientation !== 'normal' || seen.has(id)) continue;
    seen.add(id);
    unique.push(id);
  }
  return unique.slice(0, CARDS.length);
};

const normalizeTransfer = value => {
  if (!value || value.version !== VERSION || value.source !== 'tarot-livre') return null;
  const cardIds = cleanCardIds(value.cardIds);
  if (cardIds.length !== (Array.isArray(value.cardIds) ? value.cardIds.length : 0)) return null;
  return {
    version:VERSION,
    transferId:String(value.transferId || uuid()),
    source:'tarot-livre',
    cardIds,
    tarotSessionId:String(value.tarotSessionId || ''),
    tarotRevision:Number(value.tarotRevision || 0),
    createdAt:String(value.createdAt || new Date().toISOString())
  };
};

export function createTarotMesaTransferV517(cardIds, { sessionId = '', revision = 0 } = {}) {
  const payload = Object.freeze({
    version:VERSION,
    transferId:uuid(),
    source:'tarot-livre',
    cardIds:cleanCardIds(cardIds),
    tarotSessionId:String(sessionId || ''),
    tarotRevision:Number(revision || 0),
    createdAt:new Date().toISOString()
  });
  try {
    store.set(TRANSFER_KEY, payload);
  } catch {
    return null;
  }
  globalThis.dispatchEvent?.(new CustomEvent('divina:tarot-mesa-transfer-v517', {
    detail:Object.freeze({ transferId:payload.transferId, cards:payload.cardIds.length })
  }));
  return payload;
}

export const pendingTarotMesaTransferV517 = () => normalizeTransfer(store.get(TRANSFER_KEY));

function applyTransfer(instance, transfer) {
  if (!instance?.session || instance.session.spreadId !== 'royal-table') return false;
  if (instance.session.sourceTransferId === transfer.transferId) {
    store.remove(TRANSFER_KEY);
    return true;
  }

  const incoming = cleanCardIds(transfer.cardIds);
  const incomingSet = new Set(incoming);
  const remaining = cleanCardIds(instance.session.cardIds).filter(id => !incomingSet.has(id));
  const cardIds = [...incoming, ...remaining];
  if (cardIds.length !== CARDS.length || new Set(cardIds).size !== CARDS.length) {
    throw new Error('A Mesa Real recusou uma sequência incompleta ou repetida.');
  }

  instance.session.cardIds = cardIds;
  instance.session.revealed = incoming.length;
  instance.session.activeIndex = incoming.length ? incoming.length - 1 : 0;
  instance.session.source = 'tarot-livre';
  instance.session.sourceTransferId = transfer.transferId;
  instance.session.sourceTarotSessionId = transfer.tarotSessionId;
  instance.session.importedAt = new Date().toISOString();
  instance.justRevealed = -1;
  instance.saveSession?.();
  if (instance.isComplete?.()) instance.archiveCompleted?.();
  instance.renderMenu?.();
  instance.renderReading?.(true);
  instance.syncRitualFrame?.();
  store.remove(TRANSFER_KEY);

  const amount = incoming.length;
  instance.notify?.(amount
    ? `${amount} ${amount === 1 ? 'carta chegou' : 'cartas chegaram'} do Tarot Livre, na ordem revelada.`
    : 'A nova Mesa Real está pronta.');
  globalThis.dispatchEvent?.(new CustomEvent('divina:tarot-mesa-arrived-v517', {
    detail:Object.freeze({ transferId:transfer.transferId, cards:amount, total:cardIds.length })
  }));
  instance.result?.scrollIntoView?.({ behavior:'smooth', block:'start' });
  return true;
}

function showProtectedTransfer(instance, transfer) {
  instance.renderPremium?.();
  const article = instance.result?.querySelector?.('.spread-premium');
  if (!article || article.querySelector('[data-tarot-transfer-waiting]')) return;
  const note = document.createElement('aside');
  note.className = 'spread-resume-banner';
  note.dataset.tarotTransferWaiting = 'v517';
  const waitingLabel = transfer.cardIds.length
    ? `${transfer.cardIds.length} ${transfer.cardIds.length === 1 ? 'carta aguarda' : 'cartas aguardam'} a Mesa Real`
    : 'Uma nova Mesa Real aguarda para ser aberta';
  note.innerHTML = `<span aria-hidden="true">✦</span><div><small>CARTAS DO TAROT LIVRE PRESERVADAS</small><strong>${waitingLabel}</strong><p>A sequência permanece guardada e será colocada nas primeiras posições quando seu acesso Premium for confirmado.</p></div>`;
  article.prepend(note);
  instance.notify?.('A sequência do Tarot Livre continua guardada para a Mesa Real.');
}

function showReplacementChoice(instance, transfer) {
  const current = instance.session;
  const currentName = current?.spreadId === 'royal-table' ? 'Mesa Real atual' : 'tiragem atual';
  if (!instance.result) return false;
  const arrivalLabel = transfer.cardIds.length
    ? `${transfer.cardIds.length} ${transfer.cardIds.length === 1 ? 'carta chegou' : 'cartas chegaram'} à Mesa Real.`
    : 'Uma nova sequência chegou à Mesa Real.';
  instance.result.innerHTML = `<article class="spread-confirm-panel" role="alert" data-tarot-mesa-choice-v517>
    <span class="spread-confirm-sigil" aria-hidden="true">✦</span>
    <p class="eyebrow">CARTAS DO TAROT LIVRE</p>
    <h3>${arrivalLabel}</h3>
    <p>Sua ${currentName} continua protegida. Para receber a nova sequência, escolha abrir uma nova Mesa Real.</p>
    <div class="spread-actions">
      <button type="button" class="primary" data-keep-current>Manter ${currentName}</button>
      <button type="button" class="text-button danger" data-open-imported-mesa>Abrir nova Mesa Real</button>
    </div>
  </article>`;
  instance.result.querySelector('[data-keep-current]')?.addEventListener('click', () => {
    instance.renderReading?.(true);
  });
  instance.result.querySelector('[data-open-imported-mesa]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const previous = instance.session;
    await Promise.resolve(instance.deleteCloudSession?.(previous)).catch(() => {});
    instance.session = null;
    instance.pendingSpreadId = '';
    instance.begin('royal-table');
  });
  instance.syncRitualFrame?.();
  instance.result.scrollIntoView?.({ behavior:'smooth', block:'start' });
  return true;
}

export function connectTarotMesaBridgeV517(instance) {
  if (!instance || typeof instance.begin !== 'function') return instance;
  if (instance[INSTANCE_MARK]) {
    instance[INSTANCE_MARK].consume();
    return instance;
  }

  const abort = new AbortController();
  const originalBegin = instance.begin.bind(instance);
  const originalDestroy = typeof instance.destroy === 'function' ? instance.destroy.bind(instance) : null;
  let consuming = false;

  const consume = async () => {
    if (consuming) return false;
    const transfer = pendingTarotMesaTransferV517();
    if (!transfer) return false;
    consuming = true;
    try {
      const allowed = await Promise.resolve(instance.ensurePremium?.({ silent:true }));
      if (!allowed) {
        showProtectedTransfer(instance, transfer);
        return false;
      }
      if (instance.session && !instance.isComplete?.()) {
        return showReplacementChoice(instance, transfer);
      }
      if (instance.session && instance.isComplete?.()) instance.archiveCompleted?.();
      instance.begin('royal-table');
      return instance.session?.sourceTransferId === transfer.transferId;
    } catch (error) {
      console.error('[Divina] A sequência do Tarot Livre permaneceu guardada.', error);
      instance.notify?.('A sequência continua protegida para uma nova tentativa.');
      return false;
    } finally {
      consuming = false;
    }
  };

  instance.begin = function beginWithTarotTransfer(spreadId, customCount) {
    const result = originalBegin(spreadId, customCount);
    const transfer = pendingTarotMesaTransferV517();
    if (spreadId === 'royal-table' && transfer && instance.session?.spreadId === 'royal-table') {
      applyTransfer(instance, transfer);
    }
    return result;
  };

  instance.destroy = function destroyWithTarotTransferBridge() {
    abort.abort();
    originalDestroy?.();
  };

  Object.defineProperty(instance, INSTANCE_MARK, {
    value:Object.freeze({ version:VERSION, consume, abort }),
    configurable:true
  });

  globalThis.addEventListener?.('divina:tarot-mesa-transfer-v517', () => consume(), { signal:abort.signal });
  globalThis.addEventListener?.('divina:billing-updated', () => consume(), { signal:abort.signal });
  queueMicrotask(consume);
  return instance;
}

export const TAROT_MESA_TRANSFER_KEY_V517 = TRANSFER_KEY;
