/* DIVINA BRUXA V192 — MÉTRICAS EDITORIAIS OPCIONAIS E LOCAIS
   Conta somente aberturas de áreas conhecidas. Não envia dados, URLs, buscas ou textos. */
import { getPrivacyPreferences, setPrivacyPreferences } from './privacy-center-v9.js?v=192';
import { EDITORIAL_CONVERSION_TARGETS_V192 } from './editorial-catalog-v192.js?v=192';

const KEY = 'divina-editorial-metrics-v192';
const DAY_MS = 86_400_000;
const ALLOWED = new Set(EDITORIAL_CONVERSION_TARGETS_V192);

export const EDITORIAL_METRICS_POLICY_V192 = Object.freeze({
  version: 'V192',
  eventType: 'feature_open',
  consentPreference: 'analytics',
  storage: 'local-only',
  retentionDays: 90,
  externalProvider: false,
  recordsSearchTerms: false,
  recordsUrls: false,
  recordsContent: false,
  recordsIdentity: false
});

const today = () => new Date().toISOString().slice(0, 10);
const safeDay = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : '';
const ageInDays = value => {
  const timestamp = Date.parse(`${safeDay(value)}T00:00:00Z`);
  return Number.isFinite(timestamp) ? Math.floor((Date.now() - timestamp) / DAY_MS) : Infinity;
};
const emptySnapshot = () => ({version:'V192',eventType:'feature_open',startedDay:today(),updatedDay:today(),total:0,counts:{}});

function readSnapshot() {
  try {
    const value = JSON.parse(globalThis.localStorage?.getItem(KEY) || 'null');
    if (!value || value.version !== 'V192' || ageInDays(value.updatedDay) > EDITORIAL_METRICS_POLICY_V192.retentionDays) return emptySnapshot();
    const counts = Object.fromEntries(Object.entries(value.counts || {})
      .filter(([target, count]) => ALLOWED.has(target) && Number.isSafeInteger(count) && count >= 0));
    return {...emptySnapshot(),...value,counts,total:Object.values(counts).reduce((sum,count) => sum + count, 0)};
  } catch {
    return emptySnapshot();
  }
}

function writeSnapshot(snapshot) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export const editorialMetricsEnabled = () => getPrivacyPreferences().analytics === true;

export function recordEditorialConversion(target) {
  if (!editorialMetricsEnabled()) return Object.freeze({recorded:false,reason:'consent-off'});
  if (!ALLOWED.has(target)) return Object.freeze({recorded:false,reason:'target-rejected'});
  const current = readSnapshot();
  const counts = {...current.counts,[target]:(current.counts[target] || 0) + 1};
  const next = {...current,updatedDay:today(),counts,total:Object.values(counts).reduce((sum,count) => sum + count, 0)};
  return Object.freeze({recorded:writeSnapshot(next),reason:'local-only'});
}

export const editorialMetricsSnapshot = () => Object.freeze(readSnapshot());

function statusCopy() {
  return editorialMetricsEnabled()
    ? 'Ativas neste aparelho · nenhuma informação é enviada.'
    : 'Desativadas · nenhum clique editorial é contado.';
}

function updateConsentViews() {
  globalThis.document?.querySelectorAll('[data-editorial-metrics-status]').forEach(node => {
    node.textContent = statusCopy();
  });
  globalThis.document?.querySelectorAll('[data-editorial-consent]').forEach(input => {
    input.checked = editorialMetricsEnabled();
  });
}

export function renderEditorialConsent(root) {
  if (!root || root.querySelector('[data-editorial-consent-panel]')) return false;
  const panel = document.createElement('aside');
  const id = `editorial-consent-${String(root.id || 'portal').replace(/[^a-z0-9_-]/gi, '')}`;
  panel.className = 'editorial-v192-consent';
  panel.dataset.editorialConsentPanel = 'v192';
  panel.innerHTML = `<span aria-hidden="true">◎</span><div><strong>MÉTRICAS OPCIONAIS</strong><p id="${id}-status" data-editorial-metrics-status>${statusCopy()}</p><small>Somente contagens agregadas de Loja, Spotify, YouTube, Escola e Biblioteca; retenção máxima de 90 dias.</small></div><label for="${id}"><input id="${id}" type="checkbox" data-editorial-consent ${editorialMetricsEnabled() ? 'checked' : ''}><span>Permitir neste aparelho</span></label><a href="privacidade-e-dados.html">Privacidade</a>`;
  panel.querySelector('[data-editorial-consent]')?.addEventListener('change', event => {
    setPrivacyPreferences({analytics:event.currentTarget.checked === true});
    updateConsentViews();
  });
  root.append(panel);
  return true;
}

export function bindEditorialMetrics(root) {
  if (!root || root.dataset.editorialMetricsBound === 'v192') return false;
  root.dataset.editorialMetricsBound = 'v192';
  root.addEventListener('click', event => {
    const target = event.target.closest('[data-editorial-target]');
    if (!target || !root.contains(target)) return;
    recordEditorialConversion(target.dataset.editorialTarget);
  }, {capture:true});
  return true;
}

globalThis.addEventListener?.('divina:privacy-change', updateConsentViews);
