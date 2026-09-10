/* DIVINA BRUXA — ORBE 2.0 V207 · NÚCLEO ÚNICO DE MOVIMENTO
   Um relógio compartilhado para a Orbe principal e todas as mini-Orbes.
   Nenhuma decisão visual vive aqui: este núcleo apenas agenda, pausa, retoma
   e encerra trabalho de movimento com continuidade e custo previsível. */

const CORE_KEY = Symbol.for('divina.orb.motion.core.v207');
const DEFAULT_FRAME_MS = 1000 / 60;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const now = () => globalThis.performance?.now?.() ?? Date.now();

export const ORB_MOTION_LIFECYCLE_V207 = Object.freeze({
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DESTROYED: 'DESTROYED'
});

const callSafely = (callback, ...args) => {
  try { return callback?.(...args); }
  catch (error) {
    console.error('[Divina] falha isolada no Núcleo de Movimento V207', error);
    return undefined;
  }
};

class OrbMotionCoreV207 {
  constructor(scope = globalThis) {
    this.scope = scope;
    this.document = scope.document || null;
    this.clients = new Map();
    this.sequence = 0;
    this.frame = 0;
    this.wakeTimer = 0;
    this.lastTick = 0;
    this.lifecycle = ORB_MOTION_LIFECYCLE_V207.ACTIVE;
    this.documentVisible = !this.document?.hidden;
    this.pageVisible = true;
    this.frozen = false;
    this.destroyed = false;
    this.reducedQuery = scope.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    this.reducedMotion = Boolean(this.reducedQuery?.matches);

    this.requestAnimationFrame = scope.requestAnimationFrame?.bind(scope)
      || (callback => scope.setTimeout(() => callback(now()), DEFAULT_FRAME_MS));
    this.cancelAnimationFrame = scope.cancelAnimationFrame?.bind(scope)
      || (handle => scope.clearTimeout(handle));

    this.onTick = timestamp => this.tick(timestamp);
    this.onVisibilityChange = () => {
      this.documentVisible = !this.document?.hidden;
      this.refreshLifecycle('visibility');
    };
    this.onPageHide = () => {
      this.pageVisible = false;
      this.refreshLifecycle('pagehide');
    };
    this.onPageShow = () => {
      this.pageVisible = true;
      this.frozen = false;
      this.refreshLifecycle('pageshow');
    };
    this.onFreeze = () => {
      this.frozen = true;
      this.refreshLifecycle('freeze');
    };
    this.onResume = () => {
      this.documentVisible = !this.document?.hidden;
      this.pageVisible = true;
      this.frozen = false;
      this.refreshLifecycle('resume');
    };
    this.onReducedMotionChange = event => {
      this.reducedMotion = Boolean(event.matches);
      for (const client of this.clients.values()) {
        client.lastFrame = 0;
        callSafely(client.onReducedMotionChange, this.reducedMotion);
      }
      this.wake('reduced-motion');
    };

    this.document?.addEventListener('visibilitychange', this.onVisibilityChange, { passive: true });
    this.scope.addEventListener?.('pagehide', this.onPageHide, { passive: true });
    this.scope.addEventListener?.('pageshow', this.onPageShow, { passive: true });
    this.document?.addEventListener('freeze', this.onFreeze, { passive: true });
    this.document?.addEventListener('resume', this.onResume, { passive: true });
    this.scope.addEventListener?.('divina:resume', this.onResume, { passive: true });
    this.reducedQuery?.addEventListener?.('change', this.onReducedMotionChange);
  }

  canRun() {
    return !this.destroyed && this.documentVisible && this.pageVisible && !this.frozen;
  }

  register({
    id,
    onFrame,
    isActive = () => true,
    frameRate = 0,
    continuous = true,
    onActivate,
    onDeactivate,
    onSuspend,
    onResume,
    onReducedMotionChange,
    onError
  } = {}) {
    if (this.destroyed) throw new Error('O Núcleo de Movimento V207 foi encerrado.');
    if (typeof onFrame !== 'function') throw new TypeError('Um cliente de movimento precisa de onFrame.');

    const clientId = String(id || `surface-${++this.sequence}`);
    this.clients.get(clientId)?.handle.destroy();
    const client = {
      id: clientId,
      onFrame,
      isActive,
      frameRate,
      continuous: continuous !== false,
      onActivate,
      onDeactivate,
      onSuspend,
      onResume,
      onReducedMotionChange,
      onError,
      enabled: true,
      active: false,
      lastFrame: 0,
      elapsed: 0,
      frames: 0,
      handle: null
    };

    const handle = Object.freeze({
      id: clientId,
      wake: reason => this.wake(reason || clientId),
      setEnabled: enabled => {
        client.enabled = Boolean(enabled);
        if (!client.enabled) this.deactivateClient(client, 'disabled');
        else this.wake('enabled');
      },
      resetTimeline: () => {
        client.lastFrame = 0;
        client.elapsed = 0;
        this.wake('timeline-reset');
      },
      destroy: () => {
        if (!this.clients.has(clientId)) return;
        this.deactivateClient(client, 'destroy');
        this.clients.delete(clientId);
        this.refreshSchedule();
      },
      snapshot: () => Object.freeze({
        id: client.id,
        active: client.active,
        enabled: client.enabled,
        frames: client.frames,
        elapsed: client.elapsed
      })
    });

    client.handle = handle;
    this.clients.set(clientId, client);
    callSafely(onReducedMotionChange, this.reducedMotion);
    this.wake('register');
    return handle;
  }

  resolveFrameRate(client) {
    const value = typeof client.frameRate === 'function'
      ? callSafely(client.frameRate, this.reducedMotion)
      : client.frameRate;
    const rate = Number(value);
    return Number.isFinite(rate) && rate > 0 ? clamp(rate, 1, 240) : 0;
  }

  clientIsActive(client) {
    if (!client.enabled) return false;
    try { return client.isActive() !== false; }
    catch (error) {
      console.error(`[Divina] superfície ${client.id} não pôde informar visibilidade`, error);
      return false;
    }
  }

  activateClient(client) {
    if (client.active) return;
    client.active = true;
    client.lastFrame = 0;
    callSafely(client.onActivate, 'surface');
  }

  deactivateClient(client, reason) {
    if (!client.active) return;
    client.active = false;
    client.lastFrame = 0;
    callSafely(client.onDeactivate, reason);
  }

  cancelScheduledFrame() {
    if (this.frame) this.cancelAnimationFrame(this.frame);
    if (this.wakeTimer) this.scope.clearTimeout(this.wakeTimer);
    this.frame = 0;
    this.wakeTimer = 0;
  }

  schedule(delay = 0) {
    if (!this.canRun() || this.frame || this.wakeTimer || !this.clients.size) return;
    if (delay > 4) {
      this.wakeTimer = this.scope.setTimeout(() => {
        this.wakeTimer = 0;
        if (!this.frame && this.canRun()) this.frame = this.requestAnimationFrame(this.onTick);
      }, delay);
      return;
    }
    this.frame = this.requestAnimationFrame(this.onTick);
  }

  wake() {
    if (!this.canRun()) return;
    if (this.wakeTimer) {
      this.scope.clearTimeout(this.wakeTimer);
      this.wakeTimer = 0;
    }
    this.schedule(0);
  }

  tick(timestamp = now()) {
    this.frame = 0;
    if (!this.canRun()) return;
    this.lastTick = timestamp;
    let hasActiveClient = false;
    let nextDelay = Infinity;

    for (const client of this.clients.values()) {
      if (!this.clientIsActive(client)) {
        this.deactivateClient(client, 'surface');
        continue;
      }

      this.activateClient(client);
      hasActiveClient = true;
      const frameRate = this.resolveFrameRate(client);
      const interval = frameRate ? 1000 / frameRate : 0;
      const sinceLastFrame = client.lastFrame ? timestamp - client.lastFrame : Infinity;

      if (interval && sinceLastFrame + .25 < interval) {
        nextDelay = Math.min(nextDelay, interval - sinceLastFrame);
        continue;
      }

      const seconds = client.lastFrame
        ? clamp(sinceLastFrame / 1000, .001, .05)
        : DEFAULT_FRAME_MS / 1000;
      client.lastFrame = timestamp;
      client.elapsed += seconds;

      try {
        client.onFrame(timestamp, seconds, client.elapsed, Object.freeze({
          reducedMotion: this.reducedMotion,
          lifecycle: this.lifecycle
        }));
        client.frames += 1;
      } catch (error) {
        client.enabled = false;
        this.deactivateClient(client, 'error');
        callSafely(client.onError, error);
        this.document?.dispatchEvent(new CustomEvent('divina:orb-motion-error', {
          detail: Object.freeze({ id: client.id, message: error?.message || 'frame-error' })
        }));
        continue;
      }

      if (client.continuous) nextDelay = Math.min(nextDelay, interval || 0);
    }

    if (!hasActiveClient || nextDelay === Infinity) {
      this.lastTick = 0;
      return;
    }

    const timerLead = nextDelay > DEFAULT_FRAME_MS ? DEFAULT_FRAME_MS : 0;
    this.schedule(Math.max(0, nextDelay - timerLead));
  }

  refreshSchedule() {
    if (![...this.clients.values()].some(client => this.clientIsActive(client))) {
      this.cancelScheduledFrame();
      this.lastTick = 0;
      return;
    }
    this.wake('refresh');
  }

  refreshLifecycle(reason) {
    if (!this.canRun()) {
      if (this.lifecycle !== ORB_MOTION_LIFECYCLE_V207.SUSPENDED) {
        this.lifecycle = ORB_MOTION_LIFECYCLE_V207.SUSPENDED;
        for (const client of this.clients.values()) {
          this.deactivateClient(client, reason);
          callSafely(client.onSuspend, reason);
        }
      }
      this.cancelScheduledFrame();
      this.lastTick = 0;
      return;
    }

    const resumed = this.lifecycle === ORB_MOTION_LIFECYCLE_V207.SUSPENDED;
    this.lifecycle = ORB_MOTION_LIFECYCLE_V207.ACTIVE;
    if (resumed) {
      for (const client of this.clients.values()) {
        client.lastFrame = 0;
        if (this.clientIsActive(client)) callSafely(client.onResume, reason);
      }
    }
    this.wake(reason);
  }

  snapshot() {
    return Object.freeze({
      version: 207,
      lifecycle: this.lifecycle,
      reducedMotion: this.reducedMotion,
      scheduledFrames: Number(Boolean(this.frame)),
      scheduledWakeTimers: Number(Boolean(this.wakeTimer)),
      clients: Object.freeze([...this.clients.values()].map(client => Object.freeze({
        id: client.id,
        active: client.active,
        enabled: client.enabled,
        frames: client.frames,
        elapsed: client.elapsed
      })))
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.lifecycle = ORB_MOTION_LIFECYCLE_V207.DESTROYED;
    this.cancelScheduledFrame();
    for (const client of [...this.clients.values()]) client.handle.destroy();
    this.document?.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.scope.removeEventListener?.('pagehide', this.onPageHide);
    this.scope.removeEventListener?.('pageshow', this.onPageShow);
    this.document?.removeEventListener('freeze', this.onFreeze);
    this.document?.removeEventListener('resume', this.onResume);
    this.scope.removeEventListener?.('divina:resume', this.onResume);
    this.reducedQuery?.removeEventListener?.('change', this.onReducedMotionChange);
  }
}

export const requestNativeHapticV207 = pattern => {
  const bridge = globalThis.divinaNativeBridge?.haptics;
  if (!bridge) return false;
  try {
    if (typeof bridge.impact === 'function') bridge.impact(pattern);
    else if (typeof bridge.postMessage === 'function') bridge.postMessage({ type: 'impact', pattern });
    else return false;
    return true;
  } catch {
    return false;
  }
};

export const orbMotionV207 = globalThis[CORE_KEY] || new OrbMotionCoreV207(globalThis);
if (!globalThis[CORE_KEY]) globalThis[CORE_KEY] = orbMotionV207;

globalThis.divinaOrbMotionV207 = Object.freeze({
  version: 207,
  wake: reason => orbMotionV207.wake(reason),
  snapshot: () => orbMotionV207.snapshot()
});

export default orbMotionV207;
