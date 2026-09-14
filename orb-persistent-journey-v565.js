/* DIVINA BRUXA 4.0 — ORBE SUPREMA · MACROETAPA 1 · ÁTOMO ÚNICO
   Mantém a API V565 para compatibilidade, mas elimina o viajante-cópia: quem
   atravessa as realidades é o próprio #orb, com seu canvas, estado e eventos.
   Nenhum conteúdo, rota, regra de Tarot ou superfície aprovada é recriado.
*/

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 566;
const INSTANCE = Symbol.for('divina.orb.persistent.journey.v565');
const ROOT_ID = 'divinaOrbPersistentJourneyV565';
const STYLE_ID = 'divinaOrbPersistentJourneyV565Styles';
const FLIGHT_ATTR = 'data-orb-global-flight';
const REST_ATTR = 'data-orb-physical-rest';

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
  ? { depart:36, arrive:42, wait:90, profile:'reduced-atom-one' }
  : constrained()
    ? { depart:172, arrive:208, wait:140, profile:'constrained-atom-one' }
    : touchDevice()
      ? { depart:216, arrive:264, wait:180, profile:'touch-atom-one' }
      : { depart:252, arrive:296, wait:190, profile:'pointer-atom-one' };

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
    html[${FLIGHT_ATTR}="active"] .cosmos,html[${FLIGHT_ATTR}="active"] [class*="particles"],html[${FLIGHT_ATTR}="active"] [class*="embers"]{animation-play-state:paused!important}
    html[${FLIGHT_ATTR}="active"] .screen{animation-play-state:paused!important}
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
    this.originalClaim = null;
    this.claimBridge = null;
    this.createPersistentLayer();
    this.bind();
    document.documentElement.dataset.orbPersistentMotor = 'orbe-suprema-atom-one-v566';
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
      if (document.hidden && this.active) this.finishImmediately('visibility');
      else if (!document.hidden) this.scheduleTrack('visibility');
    }, { signal });
    addEventListener('pagehide', () => this.finishImmediately('pagehide'), { signal });
    addEventListener('pageshow', () => this.syncRestingOrb('pageshow'), { signal });
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
    document.addEventListener('divina:supreme-orb-claimed', () => {
      if (this.active || this.core?.orb?.parentNode === this.stage) return;
      this.clearLandingAnchor();
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
    }, { signal });
  }

  attach(core) {
    this.core = core || this.core;
    copyVariables(this.core?.orb, this.root);
    if (this.core && !this.claimBridge) {
      this.originalClaim = this.core.claim;
      this.claimBridge = (host, options) => {
        const release = this.originalClaim.call(this.core, host, options);
        const target = typeof host === 'string' ? document.querySelector(host) : host;
        if (this.active && target?.isConnected && this.core?.orb) {
          this.landingHost = target;
          this.stage.append(this.core.orb);
          this.core.renderer?.resize?.();
        }
        return release;
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
    emit('divina:orb-ios-journey-state', { state, route:this.route, ...detail });
    emit('divina:orb-persistent-state', { state, route:this.route, ...detail });
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
    const keyframes = path.map((point,index) => ({
      transform:this.transform(point,scalePath[index] ?? scalePath[scalePath.length-1]),
      offset:index/Math.max(1,path.length-1)
    }));
    const finish = path[path.length-1];
    const finishScale = scalePath[scalePath.length-1] ?? 1;
    if (reducedMotion() || typeof this.stage.animate !== 'function') {
      this.stage.style.transform = this.transform(finish,finishScale);
      await wait(duration);
    } else {
      const animation = this.stage.animate(keyframes,{duration,easing,fill:'forwards'});
      this.animations.add(animation);
      try { await animation.finished; } catch {}
      this.animations.delete(animation);
      this.stage.style.transform = this.transform(finish,finishScale);
      try { animation.cancel(); } catch {}
    }
    this.current = finish;
    this.scale = finishScale;
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
    const origin = this.resolveOrigin();
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
    const destination = await this.waitForDestination(String(to || this.route));
    const start = this.current || this.gateway(this.route);
    const dx = destination.x-start.x;
    const dy = destination.y-start.y;
    const arc = { x:start.x+dx*.48-(dx>=0?1:-1)*clamp(Math.hypot(dx,dy)*.08,10,32), y:start.y+dy*.38-clamp(Math.abs(dx)*.04,6,22) };
    const approach = { x:start.x+dx*.82, y:start.y+dy*.84 };
    const targetScale = clamp(Math.max(destination.width,destination.height)/this.sourceSize,.18,5.5);
    this.setState('arrival',{from,to,serial:this.serial,destination:destination.kind||'route-anchor'});
    await this.move([arc,approach,destination],[this.scale+(targetScale-this.scale)*.38,this.scale+(targetScale-this.scale)*.78,targetScale],budgets().arrive,'cubic-bezier(.2,.82,.16,1)');
    this.setState('settle',{to,serial:this.serial,destination:destination.kind||'route-anchor'});
    this.resumeHeavyEffects();
    this.completed += 1;
    this.active = false;
    this.state = 'rest';
    this.root.dataset.state = 'rest';
    document.documentElement.dataset.orbJourneyState = 'rest';
    this.settlePhysicalOrb(String(to || this.route),destination);
    emit('divina:orb-persistent-finished',{reason:'complete',route:this.route});
    return this.status();
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
    emit('divina:orb-persistent-finished',{reason:'recovered',route:this.route});
    return this.status();
  }

  finishImmediately(reason = 'complete', countInterruption = true) {
    if (countInterruption && this.active && !['complete','recovered'].includes(reason)) this.interrupted += 1;
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
    emit('divina:orb-persistent-finished',{reason,route:this.route});
  }

  status() {
    return Object.freeze({ version:VERSION, engine:'OrbPersistentJourneyV565AtomOne', work:'ORBE-SUPREMA-MACROETAPA-1',
      active:this.active, state:this.state, route:this.route, persistentLayer:Boolean(this.root?.isConnected), layerCreations:1,
      perRouteRecreation:false, oneLivingOrb:true, physicalOrbTransport:true, physicalOrbConnected:Boolean(this.core?.orb?.isConnected),
      travelerCopies:0, snapshotCadence:'none', handoffFade:false, teleportFallback:false, permanentAnimationLoops:0,
      heavyEffectsPausedDuringFlight:true, orbRendererPausedDuringFlight:false, fluidityProfile:budgets().profile,
      completedNavigations:this.completed, interruptedNavigations:this.interrupted });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.finishImmediately('destroy');
    cancelAnimationFrame(this.trackFrame);
    this.abort.abort();
    this.clearLandingAnchor();
    this.core?.returnHome?.();
    this.detach(this.core);
    this.root?.remove();
    document.getElementById(STYLE_ID)?.remove();
    delete document.documentElement.dataset.orbPersistentMotor;
    delete document.documentElement.dataset.orbJourneyState;
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
