/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · FUNDAÇÃO V580
   Uma única governança para as falas visíveis da Orbe e da Whit.

   Este núcleo não cria interface, animação, Orbe ou loop. Ele decide quando uma
   mensagem contextual realmente merece aparecer, impede repetições literais e
   semânticas, preserva somente IDs/horários e garante um balão por vez.
*/

const VERSION = 580;
const MARK = Symbol.for('divina.experience.message.governor.v580');
const SESSION_KEY = 'divina.message.governor.v580.session';
const PERSISTENT_KEY = 'divina.message.governor.v580.memory';
const SESSION_LIMIT = 12;
const PERSISTENT_LIMIT = 48;
const SEMANTIC_WINDOW = 5;
const DEFAULT_COOLDOWN_MS = 60000;
const EXPLICIT_COLLISION_MS = 1600;
const ROUTE_MESSAGE_CATEGORIES = new Set(['route-arrival','route-guidance']);

const clean = (value, limit = 180) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const fingerprint = value => {
  const text = clean(value, 360).toLocaleLowerCase('pt-BR');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

const safeStorage = storage => ({
  read(key, fallback) {
    try {
      const parsed = JSON.parse(storage?.getItem?.(key) || 'null');
      return parsed ?? fallback;
    } catch { return fallback; }
  },
  write(key, value) {
    try {
      storage?.setItem?.(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  }
});

const browserStorage = name => {
  try { return globalThis[name] || null; }
  catch { return null; }
};

const normalizeRecord = value => {
  if (!value || typeof value !== 'object') return null;
  const id = clean(value.id, 120);
  const textHash = clean(value.textHash, 24);
  const at = safeNumber(value.at, 0);
  if (!id || !textHash || at <= 0) return null;
  return Object.freeze({
    id,
    cooldownKey:clean(value.cooldownKey || id, 120),
    semanticKey:clean(value.semanticKey, 120),
    textHash,
    route:clean(value.route || 'home', 40),
    channel:clean(value.channel || 'ambient', 40),
    category:clean(value.category || 'presence', 40),
    at
  });
};

const validHistory = (value, limit) => Array.isArray(value)
  ? value.map(normalizeRecord).filter(Boolean).slice(-limit)
  : [];

function dispatch(target, type, detail) {
  if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
  target.dispatchEvent(new CustomEvent(type, { detail:Object.freeze(detail) }));
}

export class ExperienceMessageGovernorV580 {
  constructor({
    session,
    persistent,
    eventTarget = globalThis.document,
    documentElement = globalThis.document?.documentElement,
    clock = () => Date.now()
  } = {}) {
    this.version = VERSION;
    this.routeMessageOwner = 'orb-voice';
    this.sessionStorage = safeStorage(session === undefined ? browserStorage('sessionStorage') : session);
    this.persistentStorage = safeStorage(persistent === undefined ? browserStorage('localStorage') : persistent);
    this.eventTarget = eventTarget || null;
    this.documentElement = documentElement || null;
    this.clock = typeof clock === 'function' ? clock : () => Date.now();
    this.sequence = 0;
    this.active = null;
    this.accepted = 0;
    this.rejected = 0;
    this.reasons = new Map();
    this.sessionHistory = validHistory(this.sessionStorage.read(SESSION_KEY, []), SESSION_LIMIT);
    this.persistentHistory = validHistory(this.persistentStorage.read(PERSISTENT_KEY, []), PERSISTENT_LIMIT);
    if (this.documentElement) this.documentElement.dataset.messageGovernor = 'v580';
  }

  now() {
    return Math.max(0, safeNumber(this.clock(), Date.now()));
  }

  traveling() {
    const root = this.documentElement;
    return root?.dataset?.orbNavigationState === 'active'
      || root?.getAttribute?.('data-orb-global-flight') === 'active';
  }

  expireActive(now = this.now()) {
    if (!this.active) return null;
    if (this.active.until === Infinity || this.active.until > now) return this.active;
    const expired = this.active;
    this.active = null;
    dispatch(this.eventTarget, 'divina:experience-message-released', {
      version:VERSION,
      token:expired.token,
      channel:expired.channel,
      reason:'expired'
    });
    return null;
  }

  reject(reason, detail = {}) {
    this.rejected += 1;
    this.reasons.set(reason, (this.reasons.get(reason) || 0) + 1);
    const result = Object.freeze({ accepted:false, reason, ...detail });
    dispatch(this.eventTarget, 'divina:experience-message-rejected', {
      version:VERSION,
      reason,
      id:detail.id || null,
      channel:detail.channel || null
    });
    return result;
  }

  selectVariant(variants, { id = 'message', route = 'home' } = {}) {
    const candidates = [...new Set((Array.isArray(variants) ? variants : [variants])
      .map(value => clean(value, 360)).filter(Boolean))];
    if (!candidates.length) return '';
    const recentHashes = new Set(
      [...this.persistentHistory, ...this.sessionHistory]
        .slice(-SESSION_LIMIT)
        .map(record => record.textHash)
    );
    const unseen = candidates.find(value => !recentHashes.has(fingerprint(value)));
    if (unseen) return unseen;

    // Se todas já apareceram na janela, escolhe a menos recente de forma
    // determinística. A validação posterior ainda pode preferir silêncio.
    const lastSeen = value => {
      const hash = fingerprint(value);
      const records = [...this.persistentHistory, ...this.sessionHistory];
      for (let index = records.length - 1; index >= 0; index -= 1) {
        if (records[index].textHash === hash) return records[index].at;
      }
      return 0;
    };
    return [...candidates].sort((left, right) => {
      const time = lastSeen(left) - lastSeen(right);
      if (time) return time;
      return fingerprint(`${id}:${route}:${left}`).localeCompare(fingerprint(`${id}:${route}:${right}`));
    })[0];
  }

  request({
    id,
    text = '',
    variants = null,
    route = 'home',
    channel = 'ambient',
    category = 'presence',
    semanticKey = '',
    cooldownKey = '',
    cooldownMs = DEFAULT_COOLDOWN_MS,
    duration = 3200,
    priority = 10,
    explicit = false,
    collisionMs = null,
    allowDuringTravel = false,
    persist = true
  } = {}) {
    const safeId = clean(id, 120);
    const safeRoute = clean(route || 'home', 40).toLowerCase();
    const safeChannel = clean(channel || 'ambient', 40);
    const safeCategory = clean(category || 'presence', 40);
    const safeSemantic = clean(semanticKey, 120);
    const safeCooldownKey = clean(cooldownKey || safeId, 120);
    const safeText = variants
      ? this.selectVariant(variants, { id:safeId, route:safeRoute })
      : clean(text, 360);
    if (!safeId || !safeText) return this.reject('invalid-message', { id:safeId, channel:safeChannel });
    if (!explicit && !allowDuringTravel && this.traveling()) {
      return this.reject('navigation-silence', { id:safeId, channel:safeChannel });
    }
    if (!explicit && ROUTE_MESSAGE_CATEGORIES.has(safeCategory) && safeChannel !== this.routeMessageOwner) {
      return this.reject('route-owner', { id:safeId, channel:safeChannel });
    }

    const now = this.now();
    const records = [...this.persistentHistory, ...this.sessionHistory];
    const collisionKey = safeSemantic || safeCooldownKey || safeId;
    const safeCollisionMs = Math.max(0, safeNumber(
      collisionMs == null ? (explicit ? EXPLICIT_COLLISION_MS : 0) : collisionMs,
      0
    ));
    const lastCollision = safeCollisionMs > 0
      ? [...records].reverse().find(record =>
          (record.semanticKey || record.cooldownKey || record.id) === collisionKey
        )
      : null;
    if (lastCollision && now - lastCollision.at < safeCollisionMs) {
      return this.reject('event-collision', { id:safeId, channel:safeChannel });
    }

    const active = this.expireActive(now);
    const safePriority = Math.max(0, safeNumber(priority, 10));
    if (active && active.token) {
      const sameChannel = active.channel === safeChannel;
      const canPreempt = explicit || safePriority > active.priority;
      if (!canPreempt) {
        return this.reject(sameChannel ? 'channel-busy' : 'another-bubble-active', {
          id:safeId,
          channel:safeChannel,
          activeChannel:active.channel
        });
      }
    }

    const lastCooldown = [...records].reverse().find(record => record.cooldownKey === safeCooldownKey);
    const waitMs = Math.max(0, safeNumber(cooldownMs, DEFAULT_COOLDOWN_MS));
    if (!explicit && lastCooldown && now - lastCooldown.at < waitMs) {
      return this.reject('cooldown', { id:safeId, channel:safeChannel });
    }

    const textHash = fingerprint(safeText);
    if (!explicit && this.sessionHistory.some(record => record.textHash === textHash)) {
      return this.reject('literal-repeat', { id:safeId, channel:safeChannel });
    }
    if (!explicit && safeSemantic && this.sessionHistory.slice(-SEMANTIC_WINDOW)
      .some(record => record.semanticKey === safeSemantic)) {
      return this.reject('semantic-repeat', { id:safeId, channel:safeChannel });
    }

    const token = `v580-${now.toString(36)}-${(++this.sequence).toString(36)}`;
    const safeDuration = Math.max(0, safeNumber(duration, 3200));
    const preempted = active?.token ? { token:active.token, channel:active.channel } : null;
    this.active = Object.freeze({
      token,
      id:safeId,
      channel:safeChannel,
      priority:safePriority,
      until:safeDuration > 0 ? now + safeDuration : Infinity
    });

    const record = normalizeRecord({
      id:safeId,
      cooldownKey:safeCooldownKey,
      semanticKey:safeSemantic,
      textHash,
      route:safeRoute,
      channel:safeChannel,
      category:safeCategory,
      at:now
    });
    this.sessionHistory = [...this.sessionHistory, record].slice(-SESSION_LIMIT);
    this.sessionStorage.write(SESSION_KEY, this.sessionHistory);
    if (persist) {
      this.persistentHistory = [...this.persistentHistory, record].slice(-PERSISTENT_LIMIT);
      this.persistentStorage.write(PERSISTENT_KEY, this.persistentHistory);
    }
    this.accepted += 1;

    const result = Object.freeze({
      accepted:true,
      token,
      id:safeId,
      text:safeText,
      route:safeRoute,
      channel:safeChannel,
      category:safeCategory,
      duration:safeDuration,
      priority:safePriority,
      preempted
    });
    dispatch(this.eventTarget, 'divina:experience-message-accepted', {
      version:VERSION,
      token,
      id:safeId,
      route:safeRoute,
      channel:safeChannel,
      category:safeCategory,
      duration:safeDuration,
      priority:safePriority,
      preemptedChannel:preempted?.channel || null,
      messageIncluded:false
    });
    return result;
  }

  release(token, reason = 'closed') {
    if (!this.active || (token && this.active.token !== token)) return false;
    const released = this.active;
    this.active = null;
    dispatch(this.eventTarget, 'divina:experience-message-released', {
      version:VERSION,
      token:released.token,
      channel:released.channel,
      reason:clean(reason, 60) || 'closed'
    });
    return true;
  }

  status() {
    const active = this.expireActive();
    return Object.freeze({
      version:VERSION,
      active:active ? Object.freeze({
        token:active.token,
        id:active.id,
        channel:active.channel,
        priority:active.priority
      }) : null,
      accepted:this.accepted,
      rejected:this.rejected,
      rejectionReasons:Object.freeze(Object.fromEntries(this.reasons)),
      sessionHistory:this.sessionHistory.length,
      persistentHistory:this.persistentHistory.length,
      sessionLimit:SESSION_LIMIT,
      semanticWindow:SEMANTIC_WINDOW,
      explicitCollisionMs:EXPLICIT_COLLISION_MS,
      routeMessageOwner:this.routeMessageOwner,
      oneBubbleAtATime:true,
      storesMessageText:false,
      navigationSilence:true
    });
  }

  destroy() {
    this.release(null, 'destroy');
    if (this.documentElement?.dataset?.messageGovernor === 'v580') {
      delete this.documentElement.dataset.messageGovernor;
    }
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createExperienceMessageGovernorV580(options = {}) {
  const existing = globalThis[MARK];
  if (existing?.version === VERSION) return existing;
  existing?.destroy?.();
  const governor = new ExperienceMessageGovernorV580(options);
  globalThis[MARK] = governor;
  globalThis.divinaMessageGovernorV580 = governor;
  return governor;
}

export const EXPERIENCE_MESSAGE_GOVERNOR_V580 = Object.freeze({
  version:VERSION,
  sessionLimit:SESSION_LIMIT,
  persistentLimit:PERSISTENT_LIMIT,
  semanticWindow:SEMANTIC_WINDOW,
  explicitCollisionMs:EXPLICIT_COLLISION_MS,
  routeMessageOwner:'orb-voice',
  defaultCooldownMs:DEFAULT_COOLDOWN_MS,
  storesMessageText:false,
  oneBubbleAtATime:true
});

export default createExperienceMessageGovernorV580;
