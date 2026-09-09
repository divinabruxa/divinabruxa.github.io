/* DIVINA BRUXA — CORE WEB VITALS V196
   Observa LCP, INP e CLS no navegador. As medições ficam em memória e só
   viram amostras locais quando a pessoa autorizou métricas opcionais.
   Esta versão não envia telemetria para nenhum servidor.
*/
import { getPrivacyPreferences } from './privacy-center-v9.js?v=196';

export const CORE_WEB_VITALS_TARGETS_V196 = Object.freeze({
  LCP: Object.freeze({ good: 2500, poor: 4000, unit: 'ms' }),
  INP: Object.freeze({ good: 200, poor: 500, unit: 'ms' }),
  CLS: Object.freeze({ good: 0.1, poor: 0.25, unit: 'score' })
});

const STORAGE_KEY = 'divina-performance-samples-v196';
const SAMPLE_LIMIT = 75;
let installed = false;

const analyticsAllowed = () => {
  try { return getPrivacyPreferences().analytics === true; }
  catch { return false; }
};

const safeRead = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch { return {}; }
};

const safeWrite = value => {
  if (!analyticsAllowed()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch { return false; }
};

const clearOptionalSamples = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* armazenamento indisponível */ }
};

const rounded = (name, value) => name === 'CLS'
  ? Math.round(value * 1000) / 1000
  : Math.round(value);

const ratingFor = (name, value) => {
  const target = CORE_WEB_VITALS_TARGETS_V196[name];
  if (!target || !Number.isFinite(value)) return 'unavailable';
  if (value <= target.good) return 'good';
  if (value <= target.poor) return 'needs-improvement';
  return 'poor';
};

const percentile = (values, ratio = 0.75) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return sorted[Math.max(0, Math.ceil(sorted.length * ratio) - 1)];
};

export function summarizeLocalWebVitalsV196() {
  const samples = safeRead();
  return Object.fromEntries(Object.keys(CORE_WEB_VITALS_TARGETS_V196).map(name => {
    const values = Array.isArray(samples[name]) ? samples[name].map(item => Number(item.value)) : [];
    const p75 = percentile(values);
    return [name, Object.freeze({
      samples: values.length,
      p75: p75 == null ? null : rounded(name, p75),
      rating: p75 == null ? 'pending' : ratingFor(name, p75),
      target: CORE_WEB_VITALS_TARGETS_V196[name].good
    })];
  }));
}

const navigationType = () => {
  try { return performance.getEntriesByType('navigation')[0]?.type || 'navigate'; }
  catch { return 'navigate'; }
};

const deviceClass = () => matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';

const remember = detail => {
  if (!analyticsAllowed()) return false;
  const samples = safeRead();
  const list = Array.isArray(samples[detail.name]) ? samples[detail.name] : [];
  list.push({
    value: detail.value,
    rating: detail.rating,
    at: new Date().toISOString(),
    device: deviceClass(),
    navigation: detail.navigation
  });
  samples[detail.name] = list.slice(-SAMPLE_LIMIT);
  return safeWrite(samples);
};

const publish = (name, value, { final = false, supported = true } = {}) => {
  if (!Number.isFinite(value)) return;
  const detail = Object.freeze({
    name,
    value: rounded(name, value),
    rating: ratingFor(name, value),
    target: CORE_WEB_VITALS_TARGETS_V196[name]?.good ?? null,
    final,
    supported,
    navigation: navigationType(),
    transport: 'local-only',
    consentedPersistence: final && analyticsAllowed()
  });
  globalThis.__divinaWebVitalsV196 ||= {};
  globalThis.__divinaWebVitalsV196[name] = detail;
  globalThis.dispatchEvent?.(new CustomEvent('divina:web-vital', { detail }));
  if (final) remember(detail);
};

const onHidden = callback => {
  const finish = () => {
    if (document.visibilityState === 'hidden') callback();
  };
  document.addEventListener('visibilitychange', finish, { capture: true });
  addEventListener('pagehide', callback, { capture: true });
};

const observeLcp = () => {
  if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) return;
  let value = 0;
  let finished = false;
  const consume = entries => {
    const entry = entries[entries.length - 1];
    if (!entry) return;
    value = entry.startTime;
    publish('LCP', value);
  };
  const observer = new PerformanceObserver(list => consume(list.getEntries()));
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  const finish = () => {
    if (finished) return;
    finished = true;
    consume(observer.takeRecords());
    observer.disconnect();
    if (value) publish('LCP', value, { final: true });
  };
  addEventListener('pointerdown', finish, { once: true, capture: true });
  addEventListener('keydown', finish, { once: true, capture: true });
  onHidden(finish);
};

const observeCls = () => {
  if (!PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) return;
  let maxWindow = 0;
  let windowValue = 0;
  let windowStart = 0;
  let previous = 0;
  let finished = false;
  const consume = entries => {
    for (const entry of entries) {
      if (entry.hadRecentInput) continue;
      const withinWindow = previous && entry.startTime - previous < 1000 && entry.startTime - windowStart < 5000;
      if (withinWindow) windowValue += entry.value;
      else {
        windowValue = entry.value;
        windowStart = entry.startTime;
      }
      previous = entry.startTime;
      maxWindow = Math.max(maxWindow, windowValue);
      publish('CLS', maxWindow);
    }
  };
  const observer = new PerformanceObserver(list => consume(list.getEntries()));
  observer.observe({ type: 'layout-shift', buffered: true });
  onHidden(() => {
    if (finished) return;
    finished = true;
    consume(observer.takeRecords());
    observer.disconnect();
    publish('CLS', maxWindow, { final: true });
  });
};

const observeInp = () => {
  if (!PerformanceObserver.supportedEntryTypes?.includes('event')) return;
  const interactions = new Map();
  let current = 0;
  let finished = false;
  const update = () => {
    const durations = [...interactions.values()].sort((a, b) => a - b);
    if (!durations.length) return;
    const rank = Math.max(0, Math.ceil(durations.length * 0.98) - 1);
    current = durations[rank];
    publish('INP', current);
  };
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (!entry.interactionId || entry.duration <= 0) continue;
      interactions.set(entry.interactionId, Math.max(interactions.get(entry.interactionId) || 0, entry.duration));
    }
    update();
  });
  try { observer.observe({ type: 'event', buffered: true, durationThreshold: 16 }); }
  catch { observer.observe({ type: 'event', buffered: true }); }
  onHidden(() => {
    if (finished) return;
    finished = true;
    for (const entry of observer.takeRecords()) {
      if (entry.interactionId && entry.duration > 0) interactions.set(entry.interactionId, Math.max(interactions.get(entry.interactionId) || 0, entry.duration));
    }
    observer.disconnect();
    update();
    if (current) publish('INP', current, { final: true });
  });
};

export function installWebVitalsV196() {
  if (installed || typeof window === 'undefined' || typeof document === 'undefined' || typeof PerformanceObserver === 'undefined') return false;
  installed = true;
  observeLcp();
  observeCls();
  observeInp();
  addEventListener('divina:privacy-change', event => {
    if (event.detail?.analytics !== true) clearOptionalSamples();
  });
  globalThis.divinaPerformanceV196 = Object.freeze({
    targets: CORE_WEB_VITALS_TARGETS_V196,
    summary: summarizeLocalWebVitalsV196,
    storage: 'consent-only',
    networkTransport: false
  });
  return true;
}
