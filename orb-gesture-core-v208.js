/* DIVINA BRUXA — WORK7.0 V208 · ÁRBITRO DE GESTOS DA ORBE
   Classifica intenção sem tocar no DOM, sem criar relógio próprio e sem decidir
   aparência. A última amostra coalescida é consumida uma única vez por quadro. */

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const validTime = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const validPoint = value => Object.freeze({
  x: clamp(Number(value?.x) || 0, 0, 1),
  y: clamp(Number(value?.y) || 0, 0, 1)
});

export const ORB_GESTURE_PHASES_V208 = Object.freeze({
  IDLE: 'IDLE',
  PRESS: 'PRESS',
  HOLD: 'HOLD',
  DRAG: 'DRAG',
  RELEASE: 'RELEASE',
  CANCELLED: 'CANCELLED',
  NAVIGATING: 'NAVIGATING',
  DESTROYED: 'DESTROYED'
});

export const ORB_GESTURE_OUTCOMES_V208 = Object.freeze({
  NONE: 'NONE',
  TAP: 'TAP',
  DOUBLE_TAP: 'DOUBLE_TAP',
  DRAG: 'DRAG',
  HOLD: 'HOLD',
  CANCEL: 'CANCEL'
});

export const ORB_GESTURE_DEFAULTS_V208 = Object.freeze({
  moveThreshold: .032,
  doubleTapRadius: .16,
  doubleTapMilliseconds: 430,
  tapMaximumMilliseconds: 720,
  holdMilliseconds: 1188,
  velocityScale: .28,
  velocityFollowRate: 30,
  maximumDeltaSeconds: .05
});

function angularDelta(previous, next) {
  const px = previous.x - .5;
  const py = previous.y - .5;
  const nx = next.x - .5;
  const ny = next.y - .5;
  if (Math.hypot(px, py) < .055 || Math.hypot(nx, ny) < .055) return 0;
  let delta = Math.atan2(ny, nx) - Math.atan2(py, px);
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export class OrbGestureCoreV208 {
  constructor(options = {}) {
    this.options = Object.freeze({ ...ORB_GESTURE_DEFAULTS_V208, ...options });
    this.phase = ORB_GESTURE_PHASES_V208.IDLE;
    this.pointerId = null;
    this.pointerType = 'unknown';
    this.startTime = 0;
    this.lastProcessedTime = 0;
    this.startPoint = validPoint({ x:.5, y:.5 });
    this.lastPoint = this.startPoint;
    this.pendingSample = null;
    this.pressure = 0;
    this.velocity = { x:0, y:0 };
    this.pathDistance = 0;
    this.moved = false;
    this.holdAnnounced = false;
    this.lastTap = null;
    this.navigationLocked = false;
    this.navigationSequence = 0;
    this.destroyed = false;
  }

  sample(input = {}, fallbackTime = 0) {
    return Object.freeze({
      pointerId: input.pointerId,
      point: validPoint(input.point),
      pressure: clamp(Number(input.pressure) || 0, 0, 1),
      time: validTime(input.time, fallbackTime)
    });
  }

  begin(input = {}) {
    if (this.destroyed || this.navigationLocked || this.pointerId !== null) {
      return Object.freeze({ accepted:false, reason:this.destroyed ? 'destroyed' : this.navigationLocked ? 'navigating' : 'pointer-active' });
    }
    const sample = this.sample(input);
    this.pointerId = sample.pointerId;
    this.pointerType = String(input.pointerType || 'unknown');
    this.startTime = sample.time;
    this.lastProcessedTime = sample.time;
    this.startPoint = sample.point;
    this.lastPoint = sample.point;
    this.pendingSample = null;
    this.pressure = sample.pressure;
    this.velocity = { x:0, y:0 };
    this.pathDistance = 0;
    this.moved = false;
    this.holdAnnounced = false;
    this.phase = ORB_GESTURE_PHASES_V208.PRESS;
    return Object.freeze({ accepted:true, sample });
  }

  queue(pointerId, samples = [], fallbackTime = 0) {
    if (this.destroyed || pointerId !== this.pointerId) return false;
    const list = Array.isArray(samples) ? samples : [samples];
    const latest = list[list.length - 1];
    if (!latest) return false;
    this.pendingSample = this.sample({ ...latest, pointerId }, fallbackTime);
    return true;
  }

  consume(time = this.lastProcessedTime) {
    if (this.destroyed || this.pointerId === null) return Object.freeze({ active:false, phase:this.phase });
    const now = validTime(time, this.lastProcessedTime);
    let movement = null;
    if (this.pendingSample) {
      const sample = this.pendingSample;
      this.pendingSample = null;
      const seconds = clamp(
        Math.max(1, sample.time - this.lastProcessedTime) / 1000,
        .001,
        this.options.maximumDeltaSeconds
      );
      const dx = sample.point.x - this.lastPoint.x;
      const dy = sample.point.y - this.lastPoint.y;
      const amount = 1 - Math.exp(-this.options.velocityFollowRate * seconds);
      const targetX = clamp(dx / seconds * this.options.velocityScale, -1.6, 1.6);
      const targetY = clamp(-dy / seconds * this.options.velocityScale, -1.6, 1.6);
      this.velocity.x = lerp(this.velocity.x, targetX, amount);
      this.velocity.y = lerp(this.velocity.y, targetY, amount);
      this.pathDistance += Math.hypot(dx, dy);
      this.moved ||= distance(sample.point, this.startPoint) > this.options.moveThreshold;
      if (this.moved) this.phase = ORB_GESTURE_PHASES_V208.DRAG;
      const spinDelta = clamp(angularDelta(this.lastPoint, sample.point) * .42, -.08, .08);
      this.lastPoint = sample.point;
      this.lastProcessedTime = sample.time;
      this.pressure = sample.pressure || this.pressure;
      movement = Object.freeze({
        point:sample.point,
        pressure:this.pressure,
        velocity:Object.freeze({ ...this.velocity }),
        spinDelta,
        seconds,
        pathDistance:this.pathDistance
      });
    }

    const heldFor = Math.max(0, now - this.startTime);
    let becameHold = false;
    if (!this.moved && !this.holdAnnounced && heldFor >= this.options.holdMilliseconds) {
      this.holdAnnounced = true;
      this.phase = ORB_GESTURE_PHASES_V208.HOLD;
      becameHold = true;
    }
    return Object.freeze({
      active:true,
      phase:this.phase,
      movement,
      becameHold,
      heldFor,
      moved:this.moved
    });
  }

  end(input = {}) {
    if (this.destroyed || input.pointerId !== this.pointerId) return Object.freeze({ outcome:ORB_GESTURE_OUTCOMES_V208.NONE });
    const endTime = validTime(input.time, this.lastProcessedTime);
    if (input.point) this.queue(input.pointerId, [input], endTime);
    const consumed = this.consume(endTime);
    const point = this.lastPoint;
    const duration = Math.max(0, endTime - this.startTime);
    let outcome;

    if (this.moved || this.phase === ORB_GESTURE_PHASES_V208.DRAG) {
      outcome = ORB_GESTURE_OUTCOMES_V208.DRAG;
      this.lastTap = null;
    } else if (this.phase === ORB_GESTURE_PHASES_V208.HOLD || duration >= this.options.holdMilliseconds) {
      outcome = ORB_GESTURE_OUTCOMES_V208.HOLD;
      this.lastTap = null;
    } else if (duration <= this.options.tapMaximumMilliseconds) {
      const previous = this.lastTap;
      const isDouble = previous
        && endTime - previous.time <= this.options.doubleTapMilliseconds
        && distance(point, previous.point) <= this.options.doubleTapRadius;
      if (isDouble) {
        outcome = ORB_GESTURE_OUTCOMES_V208.DOUBLE_TAP;
        this.lastTap = null;
      } else {
        outcome = ORB_GESTURE_OUTCOMES_V208.TAP;
        this.lastTap = Object.freeze({ time:endTime, point });
      }
    } else {
      outcome = ORB_GESTURE_OUTCOMES_V208.HOLD;
      this.lastTap = null;
    }

    this.finishPointer(ORB_GESTURE_PHASES_V208.RELEASE);
    return Object.freeze({ outcome, point, duration, consumed, pathDistance:this.pathDistance });
  }

  cancel(pointerId = this.pointerId, time = this.lastProcessedTime) {
    if (this.destroyed || pointerId !== this.pointerId) return Object.freeze({ outcome:ORB_GESTURE_OUTCOMES_V208.NONE });
    const point = this.lastPoint;
    const duration = Math.max(0, validTime(time, this.lastProcessedTime) - this.startTime);
    this.lastTap = null;
    this.finishPointer(ORB_GESTURE_PHASES_V208.CANCELLED);
    return Object.freeze({ outcome:ORB_GESTURE_OUTCOMES_V208.CANCEL, point, duration });
  }

  finishPointer(phase) {
    this.phase = phase;
    this.pointerId = null;
    this.pointerType = 'unknown';
    this.pendingSample = null;
    this.pressure = 0;
  }

  beginNavigation() {
    if (this.destroyed || this.navigationLocked || this.pointerId !== null) return false;
    this.navigationLocked = true;
    this.navigationSequence += 1;
    this.lastTap = null;
    this.phase = ORB_GESTURE_PHASES_V208.NAVIGATING;
    return true;
  }

  endNavigation() {
    if (this.destroyed) return;
    this.navigationLocked = false;
    if (this.pointerId === null) this.phase = ORB_GESTURE_PHASES_V208.IDLE;
  }

  expireTap(time) {
    if (this.lastTap && validTime(time) - this.lastTap.time > this.options.doubleTapMilliseconds) this.lastTap = null;
  }

  snapshot() {
    return Object.freeze({
      version:208,
      phase:this.phase,
      activePointer:this.pointerId !== null,
      moved:this.moved,
      navigationLocked:this.navigationLocked,
      navigationSequence:this.navigationSequence,
      hasPendingSample:Boolean(this.pendingSample),
      pathDistance:this.pathDistance
    });
  }

  destroy() {
    if (this.destroyed) return;
    if (this.pointerId !== null) this.cancel(this.pointerId);
    this.destroyed = true;
    this.navigationLocked = false;
    this.lastTap = null;
    this.pendingSample = null;
    this.phase = ORB_GESTURE_PHASES_V208.DESTROYED;
  }
}

export default OrbGestureCoreV208;
