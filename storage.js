const PREFIX = 'orbe-v3:';
export const store = {
  get(key, fallback = null) {
    try { const value = localStorage.getItem(PREFIX + key); return value === null ? fallback : JSON.parse(value); }
    catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    globalThis.dispatchEvent?.(new CustomEvent('divina:storage-change', { detail: { key, value } }));
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
    globalThis.dispatchEvent?.(new CustomEvent('divina:storage-change', { detail: { key, removed: true } }));
  }
};
export const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
