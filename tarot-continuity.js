/* DIVINA BRUXA — COORDENADOR LOCAL DO TAROT LIVRE — CHECKPOINT 2.3
   Serializa mudanças entre abas com Web Locks e mantém fallback compatível.
*/
import { createTarotState, normalizeTarotState } from './tarot-session.js?v=84';

const DEFAULT_LOCK = 'divina-bruxa:tarot-livre';

export class TarotSessionCoordinator {
  constructor({ storage, key = 'free-tarot', lockName = DEFAULT_LOCK } = {}) {
    if (!storage?.get || !storage?.set) throw new TypeError('Armazenamento do Tarot Livre indisponível.');
    this.storage = storage;
    this.key = key;
    this.lockName = lockName;
    this.queue = Promise.resolve();
  }

  latest() {
    return normalizeTarotState(this.storage.get(this.key, null)) ?? createTarotState();
  }

  async commit(transform) {
    const execute = async () => {
      const base = this.latest();
      const output = await transform(base);
      const candidate = output?.state ?? output;
      const state = normalizeTarotState(candidate);
      if (!state) throw new TypeError('A alteração da mesa não produziu um estado válido.');
      this.storage.set(this.key, state);
      if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') {
        globalThis.dispatchEvent(new CustomEvent('tarot:session-committed', { detail: { sessionId: state.sessionId, revision: state.revision } }));
      }
      return output?.state ? { ...output, state } : state;
    };

    if (globalThis.navigator?.locks?.request) {
      return globalThis.navigator.locks.request(this.lockName, { mode: 'exclusive' }, execute);
    }

    const turn = this.queue.then(execute, execute);
    this.queue = turn.catch(() => undefined);
    return turn;
  }
}
