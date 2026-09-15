/* DIVINA BRUXA 4.0 — ORBE SUPREMA · MACROETAPA 3 · PRESENÇA VIVA
   Mantém o Átomo Único e a Física Apple aprovados. A mesma #orb agora sustenta
   uma presença global orientada por eventos: serena, atenta, escutando,
   respondendo, viajando ou dormindo. Não existe um segundo loop de animação.
*/

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 570;
const INSTANCE = Symbol.for('divina.orb.persistent.journey.v565');
const ROOT_ID = 'divinaOrbPersistentJourneyV565';
const STYLE_ID = 'divinaOrbPersistentJourneyV565Styles';
const FLIGHT_ATTR = 'data-orb-global-flight';
const REST_ATTR = 'data-orb-physical-rest';
export const ORB_PRESENCE_STATES_V570 = Object.freeze([
  'serene', 'attentive', 'listening', 'responding', 'traveling', 'sleeping'
]);
const TRAVEL_STATES_V570 = new Set(['depart','flight','portal','arrival','settle','recovery']);

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const touchDevice = () => globalThis.matchMedia?.('(pointer: coarse)').matches === true || Number(navigator.maxTouchPoints || 0) > 0;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const routeNow = () => String(
  document.body?.dataset?.screen ||
  document.querySelector('.screen.active,[data-screen].active')?.id ||
  location.hash ||
  'home'
).replace(/^#/,'').toLowerCase();
const viewport = () => ({
  width:Math.max(1, globalThis.visualViewport?.width || document.documentElement.clientWidth || innerWidth),
  height:Math.max(1, globalThis.visualViewport?.height || document.documentElement.clientHeight || innerHeight)
});

const budgets = () => reducedMotion()
  ? { depart:36, arrive:42, wait:90, samples:2, profile:'reduced-apple-physics' }
  : constrained()
    ? { depart:172, arrive:208, wait:140, samples:10, profile:'constrained-apple-physics' }
    : touchDevice()
      ? { depart:216, arrive:264, wait:180, samples:18, profile:'touch-apple-physics' }
      : { depart:252, arrive:296, wait:190, samples:20, profile:'pointer-apple-physics' };

const mix = (from, to, amount) => from + (to-from)*amount;

function appleProgress(raw) {
  const time = clamp(Number(raw || 0),0,1);
  if (time <= 0) return 0;
  if (time >= 1) return 1;
  const response = 5.2;
  const tail = 1-(1+response)*Math.exp(-response);
  return clamp((1-(1+response*time)*Math.exp(-response*time))/tail,0,1);
}

function bezierNumber(values, amount) {
  const list = values.map(Number);
  const t = clamp(amount,0,1);
  if (list.length <= 1) return list[0] || 0;
  if (list.length === 2) return mix(list[0],list[1],t);
  if (list.length === 3) {
    const inverse = 1-t;
    return inverse*inverse*list[0]+2*inverse*t*list[1]+t*t*list[2];
  }
  if (list.length === 4) {
    const inverse = 1-t;
    return inverse**3*list[0]+3*inverse*inverse*t*list[1]+3*inverse*t*t*list[2]+t**3*list[3];
  }
  const position = t*(list.length-1);
  const index = Math.min(list.length-2,Math.floor(position));
  return mix(list[index],list[index+1],position-index);
}

function bezierPoint(points, amount) {
  return {
    x:bezierNumber(points.map(point => point.x),amount),
    y:bezierNumber(points.map(point => point.y),amount)
  };
}

function emit(type, detail = {}) {
  document.dispatchEvent(new CustomEvent(type, { detail:{ version:VERSION, ...detail } }));
}

function installStyles() {
  let style = document.getElementById(STYLE_ID);
  if (style) return style;
  style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${ROOT_ID}{position:fixed;inset:0;z-index:2147482500;overflow:hidden;pointer-events:none;contain:strict;isolation:isolate}
    #${ROOT_ID}[hidden]{display:none!important}
    #${ROOT_ID} .db565-physical-stage{position:absolute;left:0;top:0;width:var(--db565-size,88px);height:var(--db565-size,88px);pointer-events:none;transform-origin:50% 50%;will-change:transform;contain:layout style;backface-visibility:hidden;-webkit-backface-visibility:hidden}
    #${ROOT_ID} .db565-physical-stage>[data-supreme-orb="living"]{display:grid!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;margin:0!important;transform:none!important;translate:none!important;scale:1!important;pointer-events:auto!important;visibility:visible!important;opacity:1!important;animation-play-state:running!important;transition:none!important;backface-visibility:hidden!important;-webkit-backface-visibility:hidden!important}
    html[${FLIGHT_ATTR}="active"] [data-orb-projection-v501="true"],html[${FLIGHT_ATTR}="active"] [data-orb-presence-v526="true"]{animation-play-state:paused!important}
    html[${FLIGHT_ATTR}="active"] .screen.active [data-orb-presence-v526="true"]{visibility:hidden!important}
    html[${FLIGHT_ATTR}="active"] .cosmos,html[${FLIGHT_ATTR}="active"] [class*="particles"],html[${FLIGHT_ATTR}="active"] [class*="embers"]{animation-play-state:paused!important}
    html[${FLIGHT_ATTR}="active"] .screen{animation-play-state:paused!important}
    [data-supreme-orb-host="active"]>[data-supreme-orb="living"]{width:100%!important;height:auto!important;max-width:100%!important;max-height:100%!important;margin:0!important;aspect-ratio:1!important}
    [data-orb-physical-landing="true"]{pointer-events:none!important;background:transparent!important;box-shadow:none!important}
    [data-orb-physical-landing="true"]::before,[data-orb-physical-landing="true"]::after,[data-orb-physical-landing="true"]>*{visibility:hidden!important}
    @media(prefers-reduced-motion:reduce){#${ROOT_ID} .db565-physical-stage{will-change:auto}}
  `;
  document.head.append(style);
  return style;
}

function rectOf(node) {
  if (!node?.isConnected || node.hidden) return null;
  const rect = node.getBoundingClientRect?.();
  if (!rect || rect.width < 8 || rect.height < 8) return null;
  const view = viewport();
  if (rect.right < -4 || rect.bottom < -4 || rect.left > view.width + 4 || rect.top > view.height + 4) return null;
  return { node, left:rect.left, top:rect.top, width:rect.width, height:rect.height,
    x:rect.left + rect.width / 2, y:rect.top + rect.height / 2 };
}

function firstVisible(selectors) {
  for (const selector of selectors) {
    let nodes = [];
    try { nodes = [...document.querySelectorAll(selector)]; } catch {}
    for (const node of nodes) {
      const rect = rectOf(node);
      if (rect) return rect;
    }
  }
  return null;
}

function copyVariables(source, destination) {
  if (!source || !destination) return;
  const style = getComputedStyle(source);
  ['--p','--s','--a','--core','--dark','--orb-primary','--orb-secondary','--orb-glow','--orb-mid','--orb-bright','--orb-luminance']
    .forEach(name => {
      const value = style.getPropertyValue(name).trim();
      if (value) destination.style.setProperty(name, value);
    });
  const skin = source.dataset?.skin || document.documentElement.dataset.orbSkin;
  if (skin) destination.dataset.skin = skin;
}

export class OrbPersistentJourneyV565 {
  constructor({ core = null, universe = null } = {}) {
    this.version = VERSION;
    this.core = core;
    this.universe = universe;
    this.abort = new AbortController();
    this.animations = new Set();
    this.active = false;
    this.destroyed = false;
    this.state = 'rest';
    this.serial = 0;
    this.route = routeNow();
    this.current = null;
    this.sourceSize = 88;
    this.scale = 1;
    this.completed = 0;
    this.interrupted = 0;
    this.landingHost = null;
    this.landingAnchor = null;
    this.trackFrame = 0;
    this.settleToken = 0;
    this.pendingMenuOrigin = null;
    this.pendingMenuOriginAt = 0;
    this.bridgingClaim = false;
    this.originalClaim = null;
    this.claimBridge = null;
    this.presenceState = null;
    this.presenceTransitions = 0;
    this.presenceTimer = 0;
    this.createPersistentLayer();
    this.bind();
    document.documentElement.dataset.orbPersistentMotor = 'orbe-suprema-presence-v570';
    document.documentElement.dataset.orbPhysics = 'critical-damped-v569';
    document.documentElement.dataset.orbPresenceEngine = 'event-driven-v570';
    this.setPresence(document.hidden ? 'sleeping' : 'serene', { reason:'boot', force:true });
    requestAnimationFrame(() => this.syncRestingOrb('boot'));
    emit('divina:orb-ios-journey-ready', this.status());
    emit('divina:orb-persistent-ready', this.status());
  }

  createPersistentLayer() {
    installStyles();
    document.getElementById(ROOT_ID)?.remove();
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.hidden = true;
    root.dataset.state = 'rest';
    const stage = document.createElement('div');
    stage.className = 'db565-physical-stage';
    root.append(stage);
    (document.body || document.documentElement).append(root);
    this.root = root;
    this.stage = stage;
  }

  bind() {
    const { signal } = this.abort;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.setPresence('sleeping', { reason:'visibility-hidden', force:true });
        if (this.active) this.finishImmediately('visibility');
      } else {
        this.setPresence('attentive', {
          reason:'visibility-return', restAfter:reducedMotion() ? 180 : 900, force:true
        });
        this.scheduleTrack('visibility');
      }
    }, { signal });
    addEventListener('pagehide', () => {
      this.setPresence('sleeping', { reason:'pagehide', force:true });
      this.finishImmediately('pagehide');
    }, { signal });
    addEventListener('pageshow', () => {
      this.syncRestingOrb('pageshow');
      this.setPresence('attentive', {
        reason:'pageshow', restAfter:reducedMotion() ? 180 : 900, force:true
      });
    }, { signal });
    addEventListener('resize', () => this.scheduleTrack('resize'), { signal, passive:true });
    addEventListener('orientationchange', () => this.scheduleTrack('orientation'), { signal, passive:true });
    addEventListener('scroll', () => this.scheduleTrack('scroll'), { signal, passive:true, capture:true });
    globalThis.visualViewport?.addEventListener?.('resize', () => this.scheduleTrack('visual-viewport'), { signal, passive:true });
    for (const type of ['divina:skin-change','orbe:skin-change','skin:changed']) {
      document.addEventListener(type, () => copyVariables(this.core?.orb, this.root), { signal });
    }
    for (const type of ['divina:route-ready','divina:page-ready','divina:orb-presence-created']) {
      document.addEventListener(type, () => this.syncRestingOrb(type), { signal });
    }
    document.addEventListener('divina:menu-state', event => {
      if (event.detail?.state !== 'closing') return;
      const origin = rectOf(this.core?.orb);
      if (!origin) return;
      this.pendingMenuOrigin = { ...origin, node:null, kind:'menu-living-orb' };
      this.pendingMenuOriginAt = performance.now();
    }, { signal });
    document.addEventListener('divina:supreme-orb-claimed', () => {
      if (this.bridgingClaim || this.active || this.core?.orb?.parentNode === this.stage) return;
      this.clearLandingAnchor();
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
    }, { signal });
    document.addEventListener('divina:supreme-orb-pulse', event => {
      const kind = String(event.detail?.kind || 'pulse');
      const state = ['press','keyboard'].includes(kind)
        ? 'listening'
        : kind === 'intent' ? 'attentive' : 'responding';
      const restAfter = state === 'listening'
        ? 0
        : reducedMotion() ? 180 : state === 'attentive' ? 680 : 920;
      this.setPresence(state, { reason:`pulse-${kind}`, restAfter });
    }, { signal });
    document.addEventListener('pointerover', event => {
      if (event.target?.closest?.('[data-supreme-orb="living"]') !== this.core?.orb) return;
      this.setPresence('attentive', {
        reason:'orb-proximity', restAfter:reducedMotion() ? 180 : 1500
      });
    }, { signal, passive:true });
    document.addEventListener('focusin', event => {
      if (event.target?.closest?.('[data-supreme-orb="living"]') !== this.core?.orb) return;
      this.setPresence('attentive', {
        reason:'orb-focus', restAfter:reducedMotion() ? 180 : 1500
      });
    }, { signal });
    document.addEventListener('pointercancel', event => {
      if (event.target?.closest?.('[data-supreme-orb="living"]') !== this.core?.orb) return;
      this.setPresence('responding', {
        reason:'pointer-cancel', restAfter:reducedMotion() ? 180 : 720
      });
    }, { signal });
    document.addEventListener('keyup', event => {
      if (!['Enter',' '].includes(event.key)) return;
      if (event.target?.closest?.('[data-supreme-orb="living"]') !== this.core?.orb) return;
      this.setPresence('responding', {
        reason:'keyboard-release', restAfter:reducedMotion() ? 180 : 720
      });
    }, { signal });
  }

  attach(core) {
    this.core = core || this.core;
    copyVariables(this.core?.orb, this.root);
    if (this.core && !this.claimBridge) {
      this.originalClaim = this.core.claim;
      this.claimBridge = (host, options = {}) => {
        const target = typeof host === 'string' ? document.querySelector(host) : host;
        const orb = this.core?.orb;
        const targetScreen = target?.closest?.('.screen')?.id || null;
        const bridgeRestingClaim = !this.active
          && orb?.parentNode === this.stage
          && targetScreen === routeNow()
          && options?.mode !== 'menu';
        const origin = bridgeRestingClaim ? (rectOf(this.stage) || rectOf(orb)) : null;
        this.bridgingClaim = bridgeRestingClaim;
        let release;
        try { release = this.originalClaim.call(this.core, target, options); }
        finally { this.bridgingClaim = false; }
        if (this.active && target?.isConnected && this.core?.orb) {
          this.landingHost = target;
          this.stage.append(this.core.orb);
          this.core.renderer?.resize?.();
        } else if (bridgeRestingClaim && origin && target?.isConnected && orb) {
          const destination = rectOf(target) || rectOf(orb);
          this.landingHost = target;
          this.stage.append(orb);
          this.root.hidden = false;
          this.placeStage(origin);
          requestAnimationFrame(() => this.glideToClaimedHost(target,destination));
        }
        if (typeof release !== 'function') return release;
        return () => {
          const result = release();
          if (this.active && this.state === 'settle') this.finishImmediately('claim-released');
          else this.settleToken += 1;
          requestAnimationFrame(() => this.syncRestingOrb('claim-release'));
          return result;
        };
      };
      this.core.claim = this.claimBridge;
    }
    return this;
  }

  detach(core) {
    if (this.core && this.claimBridge && this.core.claim === this.claimBridge) this.core.claim = this.originalClaim;
    this.claimBridge = null;
    this.originalClaim = null;
    if (!core || core === this.core) this.core = null;
  }

  setState(state, detail = {}) {
    this.state = state;
    this.root.dataset.state = state;
    document.documentElement.dataset.orbJourneyState = state;
    if (TRAVEL_STATES_V570.has(state)) {
      this.setPresence('traveling', { reason:`journey-${state}`, force:true });
    }
    emit('divina:orb-ios-journey-state', { state, route:this.route, ...detail });
    emit('divina:orb-persistent-state', { state, route:this.route, ...detail });
  }

  setPresence(state, { reason = 'state', restAfter = 0, force = false } = {}) {
    const next = ORB_PRESENCE_STATES_V570.includes(state) ? state : 'serene';
    if (!force && document.hidden && next !== 'sleeping') return false;
    if (!force && this.active && next !== 'traveling' && next !== 'sleeping') return false;
    clearTimeout(this.presenceTimer);
    this.presenceTimer = 0;
    const previous = this.presenceState;
    const changed = previous !== next;
    this.presenceState = next;
    document.documentElement.dataset.orbPresenceState = next;
    if (this.core?.orb) this.core.orb.dataset.orbPresenceState = next;
    if (changed) {
      this.presenceTransitions += 1;
      emit('divina:orb-presence-state', {
        state:next, previous, reason, route:this.route, eventDriven:true
      });
    }
    if (restAfter > 0 && next !== 'sleeping' && next !== 'traveling') {
      this.presenceTimer = setTimeout(() => {
        this.presenceTimer = 0;
        if (!this.destroyed && !this.active && !document.hidden) {
          this.setPresence('serene', { reason:`${reason}-rest`, force:true });
        }
      }, restAfter);
    }
    return true;
  }

  centerFallback() {
    const view = viewport();
    return { node:null, x:view.width/2, y:Math.min(view.height*.42,380), width:76, height:76, kind:'viewport-safe' };
  }

  resolveOrigin() {
    const route = routeNow();
    const claimed = this.core?.claimedHost?.contains?.(this.core?.orb) ? rectOf(this.core.claimedHost) : null;
    return rectOf(this.stage) || claimed || rectOf(this.core?.orb) || firstVisible([
      `#${route} [data-orb-presence-v526="true"].is-current`,
      `#${route} [data-orb-presence-v526="true"]`,
      '.magic-dock .dock-orb',
      '[data-orb-projection-v501="true"]'
    ]) || this.centerFallback();
  }

  resolveDestination(route) {
    if (route === 'home') {
      const homeStage = rectOf(document.querySelector('#home.active > .orb-stage-ref,#home.active .orb-stage-ref'));
      if (homeStage) return { ...homeStage, kind:'home-stage' };
    }
    const claimed = rectOf(this.landingHost || this.core?.claimedHost);
    if (claimed && claimed.node?.closest?.('.screen')?.id === route) return { ...claimed, kind:'claimed-host' };
    const profile = worldForRouteV535(route) || {};
    return firstVisible([
      ...(profile.journeyAnchors || [])
        .filter(selector => !selector.includes('[data-supreme-orb="living"]') && !selector.includes('#orb'))
        .map(selector => `#${route} ${selector}`),
      `#${route} [data-orb-presence-v526="true"]`,
      `#${route} [data-orb-journey-anchor]`,
      `#${route} [data-orb-projection-v501="true"]`
    ]) || firstVisible(['.magic-dock .dock-orb']) || this.centerFallback();
  }

  gateway(route) {
    const view = viewport();
    const point = worldForRouteV535(route)?.gateway || [0.5,0.43];
    return { x:clamp(point[0]*view.width,42,view.width-42), y:clamp(point[1]*view.height,84,view.height-92) };
  }

  transform(point, scale = 1) {
    return `translate3d(${(point.x-this.sourceSize/2).toFixed(2)}px,${(point.y-this.sourceSize/2).toFixed(2)}px,0) scale(${scale.toFixed(5)})`;
  }

  capturePhysicalOrb(origin) {
    const orb = this.core?.orb;
    if (!orb) throw new Error('living-orb-unavailable');
    this.clearLandingAnchor();
    this.sourceSize = clamp(Math.max(origin.width,origin.height),58,Math.min(520,viewport().width*.94));
    this.current = { x:origin.x, y:origin.y };
    this.scale = 1;
    this.root.style.setProperty('--db565-size',`${this.sourceSize}px`);
    this.stage.style.transform = this.transform(this.current,1);
    this.stage.append(orb);
    this.root.hidden = false;
    copyVariables(orb,this.root);
    this.core.renderer?.resize?.();
  }

  async move(points, scales, duration, easing) {
    const start = this.current || points[0];
    const path = [start,...points];
    const scalePath = [this.scale,...scales];
    const finish = path[path.length-1];
    const finishScale = scalePath[scalePath.length-1] ?? 1;
    const view = viewport();
    const distance = Math.hypot(finish.x-start.x,finish.y-start.y);
    const distanceRatio = clamp(distance/Math.max(1,Math.hypot(view.width,view.height)),0,1.25);
    const sizeRatio = clamp(Math.abs(finishScale-this.scale),0,1.4);
    const adaptiveDuration = Math.round(Math.max(1,duration)*clamp(.86+distanceRatio*.34+sizeRatio*.08,.84,1.18));
    const samples = Math.max(2,budgets().samples);
    const keyframes = Array.from({ length:samples+1 },(_,index) => {
      const offset = index/samples;
      const physicalProgress = appleProgress(offset);
      const point = bezierPoint(path,physicalProgress);
      const sampledScale = bezierNumber(scalePath,physicalProgress);
      return { transform:this.transform(point,sampledScale), offset };
    });
    if (reducedMotion() || typeof this.stage.animate !== 'function') {
      this.stage.style.transform = this.transform(finish,finishScale);
      await wait(reducedMotion()?Math.min(48,adaptiveDuration):adaptiveDuration);
    } else {
      const animation = this.stage.animate(keyframes,{duration:adaptiveDuration,easing:'linear',fill:'forwards'});
      this.animations.add(animation);
      try { await animation.finished; } catch {}
      this.animations.delete(animation);
      this.stage.style.transform = this.transform(finish,finishScale);
      try { animation.cancel(); } catch {}
    }
    this.current = finish;
    this.scale = finishScale;
    this.lastMotion = {
      duration:adaptiveDuration,
      distance:Math.round(distance),
      samples,
      response:'critical-damped',
      requestedEasing:easing || null
    };
  }

  suspendHeavyEffects() {
    document.documentElement.setAttribute(FLIGHT_ATTR,'active');
    this.universe?.pause?.('atom-one-flight');
  }

  resumeHeavyEffects() {
    document.documentElement.removeAttribute(FLIGHT_ATTR);
    this.universe?.start?.('atom-one-flight');
  }

  async depart({ from, to, serial, source } = {}) {
    if (this.destroyed) return null;
    if (this.active) this.finishImmediately('superseded');
    this.active = true;
    this.serial = Number(serial || 0);
    this.route = String(to || 'home');
    this.landingHost = null;
    const menuOriginIsFresh = source === 'orbital-menu-v502'
      && this.pendingMenuOrigin
      && performance.now()-this.pendingMenuOriginAt < 900;
    const origin = menuOriginIsFresh ? this.pendingMenuOrigin : this.resolveOrigin();
    this.pendingMenuOrigin = null;
    this.pendingMenuOriginAt = 0;
    this.capturePhysicalOrb(origin);
    this.setState('depart',{from,to,serial:this.serial,source});
    await frame();
    this.suspendHeavyEffects();
    const target = this.gateway(this.route);
    const dx = target.x-origin.x;
    const dy = target.y-origin.y;
    const arc = { x:origin.x+dx*.52+(dx>=0?-18:18), y:origin.y+dy*.42-clamp(Math.abs(dx)*.05,8,26) };
    const targetScale = clamp(78/this.sourceSize,.28,1.04);
    this.setState('flight',{from,to,serial:this.serial});
    await this.move([arc,target],[1-(1-targetScale)*.46,targetScale],budgets().depart,'cubic-bezier(.22,.78,.18,1)');
    this.setState('portal',{to,serial:this.serial});
    return this.status();
  }

  async waitForDestination(route) {
    const deadline = performance.now()+budgets().wait;
    let destination = null;
    do {
      destination = this.resolveDestination(route);
      if (destination?.node || performance.now()>=deadline) return destination;
      await frame();
    } while (performance.now()<deadline);
    return destination || this.centerFallback();
  }

  async arrive({ from, to, serial } = {}) {
    if (!this.active || Number(serial || 0)!==this.serial) return null;
    await frame();
    let destination = await this.waitForDestination(String(to || this.route));
    const start = this.current || this.gateway(this.route);
    const dx = destination.x-start.x;
    const dy = destination.y-start.y;
    const arc = { x:start.x+dx*.48-(dx>=0?1:-1)*clamp(Math.hypot(dx,dy)*.08,10,32), y:start.y+dy*.38-clamp(Math.abs(dx)*.04,6,22) };
    const approach = { x:start.x+dx*.82, y:start.y+dy*.84 };
    const targetScale = clamp(Math.max(destination.width,destination.height)/this.sourceSize,.18,5.5);
    this.setState('arrival',{from,to,serial:this.serial,destination:destination.kind||'route-anchor'});
    await this.move([arc,approach,destination],[this.scale+(targetScale-this.scale)*.38,this.scale+(targetScale-this.scale)*.78,targetScale],budgets().arrive,'cubic-bezier(.2,.82,.16,1)');
    const claimedDestination = rectOf(this.landingHost);
    if (claimedDestination && this.landingHost?.closest?.('.screen')?.id === String(to || this.route)) {
      const claimedScale = clamp(Math.max(claimedDestination.width,claimedDestination.height)/this.sourceSize,.18,5.5);
      const claimDistance = Math.hypot(claimedDestination.x-destination.x,claimedDestination.y-destination.y);
      const claimSizeDelta = Math.abs(claimedScale-this.scale);
      if (claimDistance > 2 || claimSizeDelta > .02) {
        const claimApproach = {
          x:destination.x+(claimedDestination.x-destination.x)*.76,
          y:destination.y+(claimedDestination.y-destination.y)*.78
        };
        this.setState('settle',{to,serial:this.serial,destination:'claimed-host-continuation'});
        await this.move(
          [claimApproach,claimedDestination],
          [this.scale+(claimedScale-this.scale)*.74,claimedScale],
          reducedMotion()?42:Math.min(236,budgets().arrive),
          'cubic-bezier(.2,.82,.16,1)'
        );
      }
      destination = { ...claimedDestination, kind:'claimed-host' };
    }
    this.setState('settle',{to,serial:this.serial,destination:destination.kind||'route-anchor'});
    this.resumeHeavyEffects();
    this.completed += 1;
    this.active = false;
    this.state = 'rest';
    this.root.dataset.state = 'rest';
    document.documentElement.dataset.orbJourneyState = 'rest';
    this.settlePhysicalOrb(String(to || this.route),destination);
    this.setPresence('responding', {
      reason:'arrival-complete', restAfter:reducedMotion() ? 180 : 920, force:true
    });
    emit('divina:orb-persistent-finished',{reason:'complete',route:this.route});
    return this.status();
  }

  async glideToClaimedHost(host, fallbackDestination = null) {
    if (this.destroyed || !host?.isConnected || this.core?.orb?.parentNode !== this.stage) return false;
    const destination = rectOf(host) || fallbackDestination;
    if (!destination) return false;
    const token = ++this.settleToken;
    const start = this.current || this.resolveOrigin();
    const dx = destination.x-start.x;
    const dy = destination.y-start.y;
    const approach = {
      x:start.x+dx*.74-(dx>=0?1:-1)*clamp(Math.hypot(dx,dy)*.035,4,14),
      y:start.y+dy*.76-clamp(Math.abs(dx)*.018,2,9)
    };
    const targetScale = clamp(Math.max(destination.width,destination.height)/this.sourceSize,.18,5.5);
    this.active = true;
    this.setState('settle',{route:this.route,destination:'late-claimed-host'});
    this.suspendHeavyEffects();
    await this.move(
      [approach,destination],
      [this.scale+(targetScale-this.scale)*.72,targetScale],
      reducedMotion()?36:Math.min(236,budgets().arrive),
      'cubic-bezier(.2,.82,.16,1)'
    );
    if (token !== this.settleToken || this.destroyed) return false;
    this.resumeHeavyEffects();
    this.active = false;
    this.state = 'rest';
    this.root.dataset.state = 'rest';
    document.documentElement.dataset.orbJourneyState = 'rest';
    this.clearLandingAnchor();
    host.append(this.core.orb);
    this.root.hidden = true;
    this.current = null;
    this.scale = 1;
    this.core.renderer?.resize?.();
    this.setPresence('responding', {
      reason:'claim-settled', restAfter:reducedMotion() ? 180 : 820, force:true
    });
    emit('divina:orb-physical-claim-settled',{route:this.route,host:host.id||null});
    return true;
  }

  settlePhysicalOrb(route, destination = null) {
    const orb = this.core?.orb;
    if (!orb) return false;
    this.route = String(route || routeNow());
    if (this.route === 'home') {
      this.clearLandingAnchor();
      this.core?.returnHome?.();
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      return true;
    }
    const host = this.landingHost?.isConnected ? this.landingHost : this.core?.claimedHost;
    const hostRect = rectOf(host);
    if (host && hostRect && host.closest?.('.screen')?.id === this.route) {
      this.clearLandingAnchor();
      host.append(orb);
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      this.core.renderer?.resize?.();
      return true;
    }
    const anchor = destination?.node?.isConnected ? destination.node : this.resolveDestination(this.route).node;
    if (!anchor) return false;
    this.landingAnchor = anchor;
    anchor.dataset.orbPhysicalLanding = 'true';
    document.documentElement.setAttribute(REST_ATTR,this.route);
    this.root.hidden = false;
    this.placeStage(rectOf(anchor) || destination);
    return true;
  }

  placeStage(rect) {
    if (!rect) return false;
    const size = clamp(Math.max(rect.width,rect.height),44,Math.min(520,viewport().width*.94));
    this.sourceSize = size;
    this.scale = 1;
    this.current = { x:rect.x, y:rect.y };
    this.root.style.setProperty('--db565-size',`${size}px`);
    this.stage.style.transform = this.transform(this.current,1);
    this.core?.renderer?.resize?.();
    return true;
  }

  clearLandingAnchor() {
    this.landingAnchor?.removeAttribute?.('data-orb-physical-landing');
    this.landingAnchor = null;
    document.documentElement.removeAttribute(REST_ATTR);
  }

  scheduleTrack(reason = 'layout') {
    cancelAnimationFrame(this.trackFrame);
    this.trackFrame = requestAnimationFrame(() => {
      this.trackFrame = 0;
      if (this.active || this.destroyed) return;
      if (this.landingAnchor?.isConnected && this.core?.orb?.parentNode === this.stage) {
        this.placeStage(rectOf(this.landingAnchor));
        emit('divina:orb-physical-rest-synced',{reason,route:this.route});
      }
    });
  }

  syncRestingOrb(reason = 'sync') {
    if (this.active || this.destroyed) return false;
    const route = routeNow();
    if (route === 'home') {
      if (this.core?.orb?.parentNode === this.stage) this.settlePhysicalOrb('home');
      return true;
    }
    if (rectOf(this.core?.orb) && this.core?.orb?.parentNode !== this.stage) return true;
    const destination = this.resolveDestination(route);
    if (!destination?.node) return false;
    if (this.core?.orb?.parentNode !== this.stage) this.capturePhysicalOrb(destination);
    this.settlePhysicalOrb(route,destination);
    emit('divina:orb-physical-rest-synced',{reason,route});
    return true;
  }

  async recover({ from, serial } = {}) {
    if (!this.active || Number(serial || 0)!==this.serial) return null;
    this.setState('recovery',{from,serial:this.serial});
    const destination = this.resolveDestination(String(from || routeNow()));
    await this.move([destination],[clamp(Math.max(destination.width,destination.height)/this.sourceSize,.18,5.5)],reducedMotion()?36:150,'cubic-bezier(.24,.72,.2,1)');
    this.resumeHeavyEffects();
    this.active = false;
    this.state = 'rest';
    this.settlePhysicalOrb(String(from || routeNow()),destination);
    this.setPresence('responding', {
      reason:'recovery-complete', restAfter:reducedMotion() ? 180 : 760, force:true
    });
    emit('divina:orb-persistent-finished',{reason:'recovered',route:this.route});
    return this.status();
  }

  finishImmediately(reason = 'complete', countInterruption = true) {
    if (countInterruption && this.active && !['complete','recovered'].includes(reason)) this.interrupted += 1;
    this.settleToken += 1;
    this.animations.forEach(animation => { try { animation.cancel(); } catch {} });
    this.animations.clear();
    this.resumeHeavyEffects();
    this.active = false;
    this.state = 'rest';
    this.root.dataset.state = 'rest';
    document.documentElement.dataset.orbJourneyState = 'rest';
    const route = routeNow();
    const destination = this.resolveDestination(route);
    this.settlePhysicalOrb(route,destination);
    if (reason !== 'destroy') {
      const sleeping = document.hidden || reason === 'pagehide';
      this.setPresence(sleeping ? 'sleeping' : 'responding', {
        reason:`journey-${reason}`,
        restAfter:sleeping ? 0 : reducedMotion() ? 180 : 720,
        force:true
      });
    }
    emit('divina:orb-persistent-finished',{reason,route:this.route});
  }

  status() {
    return Object.freeze({ version:VERSION, engine:'OrbPersistentJourneyV565LivingPresence', work:'ORBE-SUPREMA-MACROETAPA-3',
      active:this.active, state:this.state, route:this.route, persistentLayer:Boolean(this.root?.isConnected), layerCreations:1,
      perRouteRecreation:false, oneLivingOrb:true, physicalOrbTransport:true, physicalOrbConnected:Boolean(this.core?.orb?.isConnected),
      travelerCopies:0, snapshotCadence:'none', handoffFade:false, teleportFallback:false, permanentAnimationLoops:0,
      heavyEffectsPausedDuringFlight:true, orbRendererPausedDuringFlight:false, fluidityProfile:budgets().profile,
      motionLaw:'critical-damped-bezier', adaptiveDuration:true, physicsSamples:budgets().samples,
      presenceState:this.presenceState, presenceStates:ORB_PRESENCE_STATES_V570,
      presenceModel:'event-driven-v570', presenceTransitions:this.presenceTransitions,
      globalLivingRenderer:true, addedAnimationLoops:0, idleTimers:1,
      tactileResponsePreserved:true, lastMotion:this.lastMotion || null,
      completedNavigations:this.completed, interruptedNavigations:this.interrupted });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.finishImmediately('destroy');
    cancelAnimationFrame(this.trackFrame);
    clearTimeout(this.presenceTimer);
    this.abort.abort();
    this.clearLandingAnchor();
    this.core?.returnHome?.();
    this.detach(this.core);
    this.root?.remove();
    document.getElementById(STYLE_ID)?.remove();
    delete document.documentElement.dataset.orbPersistentMotor;
    delete document.documentElement.dataset.orbPhysics;
    delete document.documentElement.dataset.orbJourneyState;
    delete document.documentElement.dataset.orbPresenceEngine;
    delete document.documentElement.dataset.orbPresenceState;
    if (this.core?.orb) delete this.core.orb.dataset.orbPresenceState;
    delete globalThis[INSTANCE];
  }
}

export function createOrbPersistentJourneyV565(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const engine = new OrbPersistentJourneyV565(options);
  globalThis[INSTANCE] = engine;
  return engine;
}

export default createOrbPersistentJourneyV565;
