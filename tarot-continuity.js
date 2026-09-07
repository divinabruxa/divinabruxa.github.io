/* DIVINA BRUXA — CONTINUIDADE RESILIENTE DO TAROT LIVRE — V182
   Serializa mudanças entre abas e preserva a sessão em memória quando o navegador bloqueia o armazenamento.
*/
import { compareTarotStates, createTarotState, normalizeTarotState } from './tarot-session.js?v=182';

const DEFAULT_LOCK = 'divina-bruxa:tarot-livre';

export class TarotSessionCoordinator {
  constructor({ storage, key = 'free-tarot', lockName = DEFAULT_LOCK } = {}) {
    if (!storage?.get || !storage?.set) throw new TypeError('Armazenamento do Tarot Livre indisponível.');
    this.storage = storage;
    this.key = key;
    this.lockName = lockName;
    this.queue = Promise.resolve();
    this.memoryState = null;
    this.lastPersisted = false;
  }

  latest() {
    let stored = null;
    try { stored = normalizeTarotState(this.storage.get(this.key, null)); }
    catch { stored = null; }
    const memory = normalizeTarotState(this.memoryState);
    const state = !stored ? memory : !memory ? stored : compareTarotStates(stored, memory) > 0 ? stored : memory;
    this.memoryState = state ?? createTarotState();
    return this.memoryState;
  }

  remember(candidate, { persist = true, dispatch = true } = {}) {
    const state = normalizeTarotState(candidate);
    if (!state) throw new TypeError('A alteração da mesa não produziu um estado válido.');
    this.memoryState = state;
    let persisted = false;
    if (persist) {
      try { this.storage.set(this.key, state); persisted = true; }
      catch { persisted = false; }
    }
    this.lastPersisted = persisted;
    if (dispatch && typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') {
      globalThis.dispatchEvent(new CustomEvent('tarot:session-committed', { detail: { sessionId: state.sessionId, revision: state.revision, persisted } }));
    }
    return { state, persisted };
  }

  async commit(transform) {
    const execute = async () => {
      const base = this.latest();
      const output = await transform(base);
      const candidate = output?.state ?? output;
      const { state, persisted } = this.remember(candidate);
      return output?.state ? { ...output, state, persisted } : state;
    };

    if (globalThis.navigator?.locks?.request) {
      return globalThis.navigator.locks.request(this.lockName, { mode: 'exclusive' }, execute);
    }

    const turn = this.queue.then(execute, execute);
    this.queue = turn.catch(() => undefined);
    return turn;
  }
}
