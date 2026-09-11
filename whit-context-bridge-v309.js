/* DIVINA BRUXA 2.0 — REBIRTH R010 · WHIT CONTEXT BRIDGE V309
   Um único contrato de passagem de contexto para toda a Divina Bruxa.
   O recibo contém somente metadados mínimos: nunca guarda o corpo privado. */

import { store } from './storage.js';
import { AI_DRAFT_KEY, AI_TAROT_SELECTION_KEY } from './ai-policy.js?v=190';
import { JOURNAL_AI_SELECTION_KEY } from './journal-policy.js?v=187';
import { SCHOOL_AI_SELECTION_KEY } from './school-policy.js?v=186';

const RELEASE = 'V309';
const SESSION_KEY = 'divina.whit.context.receipt.v309';
const DEFAULT_TTL_MS = 30 * 60 * 1000;

const SOURCE_META = Object.freeze({
  daily: Object.freeze({
    resourceType:'tarot_card',
    privacy:'public-editorial',
    capability:'library-single-card',
    excludes:['intention','journal','otherCards','history']
  }),
  library: Object.freeze({
    resourceType:'tarot_card',
    privacy:'public-editorial',
    capability:'library-single-card',
    excludes:['favorites','history','otherCards']
  }),
  spreads: Object.freeze({
    resourceType:'tarot_reading',
    privacy:'private-exact',
    capability:'tarot-single-spread',
    excludes:['journal','otherReadings','accountHistory','otherScreens']
  }),
  school: Object.freeze({
    resourceType:'school_lesson',
    privacy:'public-editorial',
    capability:'school-single-lesson',
    excludes:['notes','progress','favorites','history']
  }),
  journal: Object.freeze({
    resourceType:'journal_entry',
    privacy:'private-exact',
    capability:'journal-single-entry',
    excludes:['otherEntries','draft','relationships','revisions','mood','favorites']
  })
});

const safeText = (value, limit = 180) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const safeId = value => {
  const text = safeText(value, 180);
  if (!text || ['*','all','any','everything'].includes(text.toLowerCase())) return '';
  return text;
};

const nowIso = () => new Date().toISOString();

const futureIso = ms => new Date(Date.now() + ms).toISOString();

const readSessionReceipt = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value?.id || !value?.source || !value?.resourceId) return null;
    if (value.expiresAt && new Date(value.expiresAt).getTime() <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return value;
  } catch {
    return null;
  }
};

const saveSessionReceipt = receipt => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(receipt));
    return true;
  } catch {
    return false;
  }
};

const clearSessionReceipt = () => {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
};

function extractLibraryCardName(draft) {
  if (!draft || draft.rebirth !== 'library-v302' || typeof draft.text !== 'string') return '';
  const match = draft.text.match(/(?:^|\n)Carta:\s*([^\n.]{1,120})\./i);
  return safeText(match?.[1] || '', 120);
}

function dailyCardName() {
  return safeText(document.querySelector('#dailyCard .dw303__identity h3')?.textContent || '', 120);
}

function receiptId(source, resourceId) {
  const stamp = Date.now().toString(36);
  const base = `${source}:${resourceId}`.replace(/[^a-z0-9:_-]+/gi, '-').slice(0, 120);
  return `${base}:${stamp}`;
}

export class WhitContextBridgeV309 {
  constructor({
    core = globalThis.whit,
    presence = globalThis.divinaWhitV307?.presence,
    nervousSystem = globalThis.divinaWhitV308?.nervousSystem
  } = {}) {
    this.core = core || null;
    this.presence = presence || null;
    this.nervousSystem = nervousSystem || null;
    this.abort = new AbortController();
    this.activeReceipt = readSessionReceipt();
    this.receiptCount = this.activeReceipt ? 1 : 0;
    this.destroyed = false;
    document.documentElement.dataset.whitContextBridge = 'v309';
    this.bind();
    if (this.activeReceipt) this.publish('restored', this.activeReceipt, false);
  }

  bind() {
    const signal = this.abort.signal;

    addEventListener('divina:tarot-ai-selected', event => {
      const readingId = safeId(event.detail?.readingId);
      const spreadId = safeId(event.detail?.spreadId);
      if (!readingId) return;
      this.prepare('spreads', readingId, {
        label: spreadId || 'tiragem',
        grantState:'server-grant-created',
        sendConsentRequired:true
      });
    }, { signal });

    addEventListener('divina:school-ai-selected', () => {
      const selection = store.get(SCHOOL_AI_SELECTION_KEY);
      const lessonId = safeId(selection?.lessonId);
      if (!lessonId) return;
      this.prepare('school', lessonId, {
        label:safeText(selection?.lessonTitle || 'aula', 120),
        grantState:'public-selection',
        sendConsentRequired:true
      });
    }, { signal });

    addEventListener('divina:journal-ai-selected', () => {
      const selection = store.get(JOURNAL_AI_SELECTION_KEY);
      const entryId = safeId(selection?.id);
      if (!entryId) return;
      this.prepare('journal', entryId, {
        label:safeText(selection?.title || 'entrada do Diário', 120),
        grantState:'explicit-local-selection',
        sendConsentRequired:true
      });
    }, { signal });

    // Biblioteca V302 já grava um draft somente após a confirmação explícita.
    addEventListener('divina:storage-change', event => {
      if (event.detail?.key !== AI_DRAFT_KEY || event.detail?.removed) return;
      const draft = event.detail?.value;
      if (draft?.rebirth !== 'library-v302') return;
      const cardName = extractLibraryCardName(draft);
      const resourceId = safeId(cardName || `library-selection-${Date.now()}`);
      this.prepare('library', resourceId, {
        label:cardName || 'carta escolhida',
        grantState:'explicit-public-selection',
        sendConsentRequired:true
      });
    }, { signal });

    // Carta do Dia: o clique é o gesto explícito. Só o nome público da carta entra no recibo.
    document.addEventListener('click', event => {
      const button = event.target?.closest?.('[data-daily-whit]');
      if (!button) return;
      const cardName = dailyCardName();
      if (!cardName) return;
      this.prepare('daily', cardName, {
        label:cardName,
        grantState:'explicit-public-selection',
        sendConsentRequired:true
      });
    }, { capture:true, passive:true, signal });

    addEventListener('whit:consent-changed', event => {
      if (!this.activeReceipt) return;
      if (event.detail?.action === 'revoked') this.clear('grant-revoked');
    }, { signal });

    addEventListener('divina:auth-state', event => {
      if (!this.activeReceipt) return;
      if (String(event.detail?.event || event.detail || '').toUpperCase().includes('SIGNED_OUT')) {
        this.clear('signed-out');
      }
    }, { signal });

    document.addEventListener('visibilitychange', () => this.expireIfNeeded(), { signal });
    addEventListener('pageshow', () => this.expireIfNeeded(), { signal });
  }

  prepare(source, rawResourceId, options = {}) {
    if (this.destroyed) return null;
    const meta = SOURCE_META[source];
    const resourceId = safeId(rawResourceId);
    if (!meta || !resourceId) return null;

    const ttlMs = Math.max(60_000, Math.min(60 * 60 * 1000, Number(options.ttlMs) || DEFAULT_TTL_MS));
    const receipt = Object.freeze({
      id:receiptId(source, resourceId),
      release:RELEASE,
      source,
      resourceType:meta.resourceType,
      resourceId,
      label:safeText(options.label || resourceId, 140),
      privacy:meta.privacy,
      capability:meta.capability,
      selectedAt:nowIso(),
      expiresAt:futureIso(ttlMs),
      grantState:safeText(options.grantState || 'prepared', 80),
      sendConsentRequired:options.sendConsentRequired !== false,
      bodyIncluded:false,
      privateBodyStored:false,
      excludes:[...meta.excludes],
      localReceipt:true
    });

    this.activeReceipt = receipt;
    this.receiptCount += 1;
    saveSessionReceipt(receipt);

    try {
      this.core?.rememberSession?.('context:active-receipt', {
        id:receipt.id,
        source:receipt.source,
        resourceType:receipt.resourceType,
        resourceId:receipt.resourceId,
        expiresAt:receipt.expiresAt,
        bodyIncluded:false
      });
    } catch {}

    this.publish('prepared', receipt, true);
    return receipt;
  }

  publish(action, receipt, visible = true) {
    dispatchEvent(new CustomEvent('whit:context-receipt', {
      detail:{
        action,
        receipt,
        local:true,
        apiUsed:false,
        bodyIncluded:false
      }
    }));

    this.nervousSystem?.signal?.('context-receipt', {
      visible:false,
      source:receipt?.source || 'context'
    });

    if (visible && receipt && document.body?.dataset?.screen !== 'home') {
      const privateCopy = receipt.privacy === 'private-exact'
        ? `Recibo criado: somente ${receipt.label}. O conteúdo continua fora até o envio consentido.`
        : `Contexto preparado: somente ${receipt.label}. Nada foi enviado.`;
      this.presence?.show?.(privateCopy, { tone:'consent', duration:4300 });
    }
  }

  expireIfNeeded() {
    const receipt = this.activeReceipt || readSessionReceipt();
    if (!receipt) return false;
    if (!receipt.expiresAt || new Date(receipt.expiresAt).getTime() > Date.now()) return false;
    this.clear('expired');
    return true;
  }

  clear(reason = 'manual') {
    const previous = this.activeReceipt;
    this.activeReceipt = null;
    clearSessionReceipt();
    try { this.core?.rememberSession?.('context:active-receipt', null); } catch {}
    dispatchEvent(new CustomEvent('whit:context-receipt', {
      detail:{ action:'cleared', reason:safeText(reason, 80), receipt:previous, local:true, apiUsed:false }
    }));
    return true;
  }

  active() {
    this.expireIfNeeded();
    return this.activeReceipt ? Object.freeze({ ...this.activeReceipt, excludes:[...this.activeReceipt.excludes] }) : null;
  }

  status() {
    const active = this.active();
    return Object.freeze({
      release:RELEASE,
      local:true,
      apiUsed:false,
      active:Boolean(active),
      receiptCount:this.receiptCount,
      activeReceipt:active,
      bodyStored:false,
      privateScan:false,
      sendConsentRequired:true
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    delete document.documentElement.dataset.whitContextBridge;
  }
}

export const createWhitContextBridgeV309 = options => new WhitContextBridgeV309(options);
