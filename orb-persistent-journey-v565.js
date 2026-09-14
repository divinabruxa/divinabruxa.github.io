/* DIVINA BRUXA 4.0 — WORK11 · MOTOR GLOBAL PERSISTENTE DA ORBE · V565
   Primeira entrega cirúrgica: uma única superfície de transporte nasce uma vez,
   recebe uma captura da Orbe viva e atravessa a troca de realidade sem ser
   recriada. Nenhum conteúdo, regra de Tarot ou rota é alterado aqui.
*/

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 565;
const INSTANCE = Symbol.for('divina.orb.persistent.journey.v565');
const ROOT_ID = 'divinaOrbPersistentJourneyV565';
const STYLE_ID = 'divinaOrbPersistentJourneyV565Styles';
const FLIGHT_ATTR = 'data-orb-global-flight';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const touchDevice = () => globalThis.matchMedia?.('(pointer: coarse)').matches === true || Number(navigator.maxTouchPoints || 0) > 0;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const viewport = () => ({
  width:Math.max(1, globalThis.visualViewport?.width || document.documentElement.clientWidth || innerWidth),
  height:Math.max(1, globalThis.visualViewport?.height || document.documentElement.clientHeight || innerHeight)
});

const budgets = () => reducedMotion()
  ? { depart:72, arrive:82, handoff:34, wait:90, profile:'reduced-v535' }
  : constrained()
    ? { depart:178, arrive:196, handoff:58, wait:120, profile:'constrained-v535' }
    : touchDevice()
      ? { depart:224, arrive:258, handoff:72, wait:160, profile:'touch-v535' }
      : { depart:260, arrive:292, handoff:82, wait:190, profile:'pointer-v535' };

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
    #${ROOT_ID} .db565-traveler{position:absolute;left:0;top:0;width:var(--db565-size,88px);height:var(--db565-size,88px);border-radius:50%;transform-origin:50% 50%;will-change:transform;contain:layout style paint;backface-visibility:hidden;-webkit-backface-visibility:hidden}
    #${ROOT_ID} .db565-aura{position:absolute;inset:-16%;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--orb-glow,var(--a,#ffd690)) 24%,transparent),color-mix(in srgb,var(--orb-primary,var(--p,#8f35ff)) 18%,transparent) 46%,transparent 72%);filter:blur(8px);opacity:.62;transform:translateZ(0);transition:opacity 90ms linear}
    #${ROOT_ID} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;border-radius:50%;filter:saturate(1.055) contrast(1.025) brightness(1.025);transform:translateZ(0)}
    #${ROOT_ID} .db565-glass{position:absolute;inset:0;border-radius:50%;border:1px solid color-mix(in srgb,var(--orb-glow,var(--a,#ffd690)) 55%,white 18%);background:radial-gradient(circle at 30% 19%,rgba(255,255,255,.24),transparent 18%);box-shadow:inset 0 0 10px rgba(255,255,255,.12),0 0 22px color-mix(in srgb,var(--orb-secondary,var(--s,#ff3dd7)) 32%,transparent)}
    html[${FLIGHT_ATTR}="active"] [data-supreme-orb="living"],html[${FLIGHT_ATTR}="active"] [data-orb-projection-v501="true"]{visibility:hidden!important}
    html[${FLIGHT_ATTR}="active"] .cosmos,html[${FLIGHT_ATTR}="active"] [class*="particles"],html[${FLIGHT_ATTR}="active"] [class*="embers"]{animation-play-state:paused!important}
    html[${FLIGHT_ATTR}="active"] .screen{animation-play-state:paused!important}
    @media(prefers-reduced-motion:reduce){#${ROOT_ID} .db565-aura{filter:none;opacity:.28}}
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
  return {
    node,
    left:rect.left,
    top:rect.top,
    width:rect.width,
    height:rect.height,
    x:rect.left + rect.width / 2,
    y:rect.top + rect.height / 2
  };
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
  [
    '--p','--s','--a','--core','--dark','--orb-primary','--orb-secondary',
    '--orb-glow','--orb-mid','--orb-bright','--orb-luminance'
  ].forEach(name => {
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
    this.route = null;
    this.current = null;
    this.sourceSize = 88;
    this.scale = 1;
    this.completed = 0;
    this.interrupted = 0;
    this.createPersistentLayer();
    this.bind();
    document.documentElement.dataset.orbPersistentMotor = 'work11-v565';
    emit('divina:orb-ios-journey-ready', this.status());
    emit('divina:orb-persistent-ready', this.status());
  }

  createPersistentLayer() {
    installStyles();
    document.getElementById(ROOT_ID)?.remove();
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="db565-traveler"><span class="db565-aura"></span><canvas aria-hidden="true"></canvas><span class="db565-glass"></span></div>';
    (document.body || document.documentElement).append(root);
    this.root = root;
    this.traveler = root.querySelector('.db565-traveler');
    this.canvas = root.querySelector('canvas');
    this.context = this.canvas.getContext('2d', { alpha:true, desynchronized:true });
  }

  bind() {
    const { signal } = this.abort;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.active) this.finishImmediately('visibility');
    }, { signal });
    addEventListener('pagehide', () => this.finishImmediately('pagehide'), { signal });
    for (const type of ['divina:skin-change','orbe:skin-change','skin:changed']) {
      document.addEventListener(type, () => copyVariables(this.core?.orb, this.root), { signal });
    }
  }

  attach(core) {
    this.core = core || this.core;
    copyVariables(this.core?.orb, this.root);
    return this;
  }

  detach(core) {
    if (!core || core === this.core) this.core = null;
  }

  setState(state, detail = {}) {
    this.state = state;
    this.root.dataset.state = state;
    document.documentElement.dataset.orbJourneyState = state;
    emit('divina:orb-ios-journey-state', { state, route:this.route, ...detail });
    emit('divina:orb-persistent-state', { state, route:this.route, ...detail });
  }

  resolveOrigin() {
    const route = String(document.body?.dataset?.screen || 'home').replace(/^#/,'').toLowerCase();
    return rectOf(this.core?.orb)
      || firstVisible([
        `#${route} [data-orb-presence-v526="true"].is-current`,
        `#${route} [data-orb-presence-v526="true"]`,
        '.magic-dock .dock-orb',
        '[data-orb-projection-v501="true"]'
      ])
      || this.centerFallback();
  }

  resolveDestination(route) {
    const physical = rectOf(this.core?.orb);
    const physicalScreen = this.core?.orb?.closest?.('.screen');
    if (physical && (!physicalScreen || physicalScreen.id === route)) return { ...physical, kind:'living-orb' };
    const profile = worldForRouteV535(route) || {};
    return firstVisible([
      ...(profile.journeyAnchors || []).map(selector => `#${route} ${selector}`),
      `#${route} [data-orb-presence-v526="true"]`,
      `#${route} [data-orb-journey-anchor]`,
      `#${route} [data-orb-projection-v501="true"]`
    ]) || firstVisible(['.magic-dock .dock-orb']) || this.centerFallback();
  }

  centerFallback() {
    const view = viewport();
    return { node:null, x:view.width/2, y:Math.min(view.height*.42, 380), width:76, height:76, kind:'viewport-safe' };
  }

  gateway(route) {
    const view = viewport();
    const point = worldForRouteV535(route)?.gateway || [0.5,0.43];
    return {
      x:clamp(point[0]*view.width, 42, view.width-42),
      y:clamp(point[1]*view.height, 84, view.height-92)
    };
  }

  snapshotSource(rect) {
    this.sourceSize = clamp(Math.max(rect.width, rect.height), 58, Math.min(430, viewport().width*.9));
    const ratio = Math.min(devicePixelRatio || 1, constrained() ? 1.25 : touchDevice() ? 1.55 : 1.8);
    const pixels = Math.round(clamp(this.sourceSize*ratio, 180, constrained() ? 360 : 520));
    if (this.canvas.width !== pixels || this.canvas.height !== pixels) {
      this.canvas.width = pixels;
      this.canvas.height = pixels;
    }
    this.context?.clearRect(0,0,pixels,pixels);
    try {
      const source = this.core?.canvas;
      if (!source?.width || !source?.height) throw new Error('living-canvas-unavailable');
      this.context.drawImage(source,0,0,pixels,pixels);
      this.root.dataset.source = 'living-canvas';
    } catch {
      const gradient = this.context?.createRadialGradient(pixels*.40,pixels*.34,0,pixels/2,pixels/2,pixels/2);
      if (gradient && this.context) {
        gradient.addColorStop(0,'#fff8ff');
        gradient.addColorStop(.15,'#ff52dc');
        gradient.addColorStop(.54,'#7425e8');
        gradient.addColorStop(1,'rgba(5,1,16,0)');
        this.context.fillStyle = gradient;
        this.context.fillRect(0,0,pixels,pixels);
      }
      this.root.dataset.source = 'safe-gradient';
    }
    this.root.style.setProperty('--db565-size',`${this.sourceSize}px`);
    copyVariables(this.core?.orb || rect.node,this.root);
  }

  transform(point, scale = 1) {
    return `translate3d(${(point.x-this.sourceSize/2).toFixed(2)}px,${(point.y-this.sourceSize/2).toFixed(2)}px,0) scale(${scale.toFixed(5)})`;
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
    if (reducedMotion() || typeof this.traveler.animate !== 'function') {
      this.traveler.style.transform = this.transform(finish,finishScale);
      await wait(duration);
    } else {
      const animation = this.traveler.animate(keyframes,{duration,easing,fill:'forwards'});
      this.animations.add(animation);
      try { await animation.finished; } catch {}
      this.animations.delete(animation);
      this.traveler.style.transform = this.transform(finish,finishScale);
      try { animation.cancel(); } catch {}
    }
    this.current = finish;
    this.scale = finishScale;
  }

  suspendHeavyEffects() {
    document.documentElement.setAttribute(FLIGHT_ATTR,'active');
    this.core?.renderer?.suspend?.('work11-flight');
  }

  resumeHeavyEffects() {
    document.documentElement.removeAttribute(FLIGHT_ATTR);
    this.core?.renderer?.resume?.('work11-flight');
  }

  async depart({ from, to, serial, source } = {}) {
    if (this.destroyed) return null;
    if (this.active) this.finishImmediately('superseded');
    this.active = true;
    this.serial = Number(serial || 0);
    this.route = String(to || 'home');
    const origin = this.resolveOrigin();
    this.snapshotSource(origin);
    this.current = { x:origin.x, y:origin.y };
    this.scale = 1;
    this.traveler.style.transform = this.transform(this.current,1);
    this.traveler.style.opacity = '1';
    this.root.hidden = false;
    this.setState('depart',{from,to,serial:this.serial,source});
    await frame();
    this.suspendHeavyEffects();
    const target = this.gateway(this.route);
    const dx = target.x-origin.x;
    const dy = target.y-origin.y;
    const arc = {
      x:origin.x+dx*.52+(dx>=0?-18:18),
      y:origin.y+dy*.42-clamp(Math.abs(dx)*.05,8,26)
    };
    const targetScale = clamp(78/this.sourceSize,.34,1.04);
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
    const arc = {
      x:start.x+dx*.48-(dx>=0?1:-1)*clamp(Math.hypot(dx,dy)*.08,10,32),
      y:start.y+dy*.38-clamp(Math.abs(dx)*.04,6,22)
    };
    const approach = { x:start.x+dx*.82, y:start.y+dy*.84 };
    const targetScale = clamp(Math.max(destination.width,destination.height)/this.sourceSize,.25,5.5);
    this.setState('arrival',{from,to,serial:this.serial,destination:destination.kind||'route-anchor'});
    await this.move([arc,approach,destination],[this.scale+(targetScale-this.scale)*.38,this.scale+(targetScale-this.scale)*.78,targetScale],budgets().arrive,'cubic-bezier(.2,.82,.16,1)');
    this.setState('handoff',{to,serial:this.serial,destination:destination.kind||'route-anchor'});
    this.resumeHeavyEffects();
    if (!reducedMotion() && typeof this.traveler.animate === 'function') {
      const handoff = this.traveler.animate([{opacity:1},{opacity:0}],{duration:budgets().handoff,easing:'linear',fill:'forwards'});
      this.animations.add(handoff);
      try { await handoff.finished; } catch {}
      this.animations.delete(handoff);
    } else await wait(budgets().handoff);
    this.completed += 1;
    this.finishImmediately('complete',false);
    return this.status();
  }

  async recover({ from, serial } = {}) {
    if (!this.active || Number(serial || 0)!==this.serial) return null;
    this.setState('recovery',{from,serial:this.serial});
    const origin = this.resolveOrigin();
    await this.move([origin],[1],reducedMotion()?70:160,'cubic-bezier(.24,.72,.2,1)');
    this.finishImmediately('recovered');
    return this.status();
  }

  finishImmediately(reason = 'complete', countInterruption = true) {
    if (countInterruption && this.active && !['complete','recovered'].includes(reason)) this.interrupted += 1;
    this.animations.forEach(animation => { try { animation.cancel(); } catch {} });
    this.animations.clear();
    this.resumeHeavyEffects();
    if (this.root) {
      this.root.hidden = true;
      this.root.dataset.state = 'rest';
      this.traveler.style.opacity = '1';
    }
    this.active = false;
    this.state = 'rest';
    this.current = null;
    this.scale = 1;
    document.documentElement.dataset.orbJourneyState = 'rest';
    emit('divina:orb-persistent-finished',{reason,route:this.route});
  }

  status() {
    return Object.freeze({
      version:VERSION,
      engine:'OrbPersistentJourneyV565',
      work:'WORK11',
      active:this.active,
      state:this.state,
      route:this.route,
      persistentLayer:Boolean(this.root?.isConnected),
      layerCreations:1,
      perRouteRecreation:false,
      singleVisualTraveler:true,
      snapshotCadence:'one-per-navigation',
      permanentAnimationLoops:0,
      heavyEffectsPausedDuringFlight:true,
      fluidityProfile:budgets().profile,
      completedNavigations:this.completed,
      interruptedNavigations:this.interrupted
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.finishImmediately('destroy');
    this.abort.abort();
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
