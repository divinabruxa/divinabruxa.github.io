/* DIVINA BRUXA 4.0 — ORBE SUPREMA 2.0 · MACROETAPA 2 · BASE V577
   Uma única #orb física sai do menu, atravessa a troca de rota e repousa no
   altar definitivo de cada realidade. Não há viajante, cópia ou pouso tardio.
*/

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 577;
const INSTANCE = Symbol.for('divina.orb.persistent.journey.v565');
const ROOT_ID = 'divinaOrbPersistentJourneyV565';
const STYLE_ID = 'divinaOrbPersistentJourneyV565Styles';
const VOICE_ID = 'divinaOrbVoiceV571';
const FLIGHT_ATTR = 'data-orb-global-flight';
const REST_ATTR = 'data-orb-physical-rest';
const VOICE_TEXT_LIMIT_V571 = 140;
export const ORB_PRESENCE_STATES_V570 = Object.freeze([
  'serene', 'attentive', 'listening', 'responding', 'traveling', 'sleeping'
]);
const TRAVEL_STATES_V570 = new Set(['depart','flight','portal','arrival','settle','recovery']);
export const ORB_ROUTE_VOICE_V571 = Object.freeze({
  home:'Voltamos ao centro.',
  tarot:'O Tarot Livre está aberto.',
  daily:'Seu encontro de hoje está aqui.',
  spreads:'As posições estão prontas.',
  school:'O próximo aprendizado começa aqui.',
  library:'A Biblioteca está aberta.',
  ai:'Whit está pronta para escutar.',
  journal:'Seu espaço privado permanece seu.',
  store:'A Loja Mística está aberta.',
  consultations:'O santuário de consultas está aberto.',
  subscriptions:'Seus benefícios aparecem com clareza.',
  skins:'A mesma Orbe, uma nova pele.',
  videos:'As histórias estão prontas para você.',
  music:'Sua música encontra esta realidade.',
  notifications:'Você escolhe quais sinais receber.',
  login:'Sua continuidade começa pela Conta.',
  admin:'A Central permanece protegida.'
});

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
export function visualViewportSnapshotV574() {
  const visual = globalThis.visualViewport;
  const width = Math.max(1,Number(visual?.width || document.documentElement.clientWidth || globalThis.innerWidth || 1));
  const height = Math.max(1,Number(visual?.height || document.documentElement.clientHeight || globalThis.innerHeight || 1));
  const left = Math.max(0,Number(visual?.offsetLeft || 0));
  const top = Math.max(0,Number(visual?.offsetTop || 0));
  return { width, height, left, top, right:left+width, bottom:top+height };
}
const viewport = visualViewportSnapshotV574;

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
    html[${FLIGHT_ATTR}="active"] body[data-screen="tarot"] .app-header .brand .mini-orb{opacity:0!important;visibility:hidden!important}
    html[data-orb-physical-authority="tarot"] body[data-screen="tarot"] .app-header .brand .mini-orb{opacity:0!important;visibility:hidden!important}
    [data-supreme-orb-host="active"]>[data-supreme-orb="living"]{width:100%!important;height:auto!important;max-width:100%!important;max-height:100%!important;margin:0!important;aspect-ratio:1!important}
    [data-orb-physical-landing="true"]{pointer-events:none!important;background:transparent!important;box-shadow:none!important}
    [data-orb-physical-landing="true"]::before,[data-orb-physical-landing="true"]::after,[data-orb-physical-landing="true"]>*{visibility:hidden!important}
    #${VOICE_ID}{
      position:fixed;left:12px;top:12px;z-index:2147483000;box-sizing:border-box;
      width:max-content;max-width:min(19rem,calc(100vw - 24px));padding:10px 14px;
      pointer-events:none;user-select:none;-webkit-user-select:none;contain:layout style;
      color:rgba(255,255,255,.96);background:rgba(24,11,43,.82);
      border:1px solid rgba(255,255,255,.19);border-radius:17px;
      box-shadow:0 14px 38px rgba(8,2,19,.34),inset 0 1px 0 rgba(255,255,255,.12);
      -webkit-backdrop-filter:blur(18px) saturate(1.22);backdrop-filter:blur(18px) saturate(1.22);
      font:600 clamp(13px,3.45vw,15px)/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;
      letter-spacing:-.012em;text-align:center;text-wrap:balance;
      opacity:0;transform:translate3d(0,var(--db571-entry-y,-5px),0) scale(.985);
      transform-origin:var(--db571-tail-x,50%) 0;
      transition:opacity 180ms ease,transform 180ms cubic-bezier(.2,.8,.2,1);
    }
    #${VOICE_ID}[hidden]{display:none!important}
    #${VOICE_ID}[data-visible="true"]{opacity:1;transform:translate3d(0,0,0) scale(1)}
    #${VOICE_ID}[data-side="above"]{--db571-entry-y:5px;transform-origin:var(--db571-tail-x,50%) 100%}
    #${VOICE_ID}::after{
      content:"";position:absolute;left:clamp(18px,calc(var(--db571-tail-x,50%) - 6px),calc(100% - 30px));
      width:11px;height:11px;background:rgba(24,11,43,.86);transform:rotate(45deg);
    }
    #${VOICE_ID}[data-side="below"]::after{top:-6px;border-left:1px solid rgba(255,255,255,.16);border-top:1px solid rgba(255,255,255,.16)}
    #${VOICE_ID}[data-side="above"]::after{bottom:-6px;border-right:1px solid rgba(255,255,255,.16);border-bottom:1px solid rgba(255,255,255,.16)}
    #${VOICE_ID} .db571-orb-voice__text{display:block;max-width:100%;overflow-wrap:anywhere}
    @media(prefers-reduced-motion:reduce){
      #${ROOT_ID} .db565-physical-stage{will-change:auto}
      #${VOICE_ID}{transition:none;transform:none}
    }
    @media(max-width:620px){
      html[data-orb-physical-authority="tarot"] body[data-screen="tarot"] .app-header .brand{visibility:hidden!important;pointer-events:none!important}
    }
  `;
  document.head.append(style);
  return style;
}

function rectOf(node) {
  if (!node?.isConnected || node.hidden) return null;
  const rect = node.getBoundingClientRect?.();
  if (!rect || rect.width < 8 || rect.height < 8) return null;
  const view = viewport();
  if (rect.right < view.left-4 || rect.bottom < view.top-4 || rect.left > view.right+4 || rect.top > view.bottom+4) return null;
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
    this.continuityChecks = 0;
    this.continuityRecoveries = 0;
    this.lastContinuity = null;
    this.lastPageTransition = null;
    this.landingHost = null;
    this.landingAnchor = null;
    this.trackFrame = 0;
    this.trackSettleFrame = 0;
    this.settleToken = 0;
    this.pendingMenuOrigin = null;
    this.pendingMenuOriginAt = 0;
    this.bridgingClaim = false;
    this.originalClaim = null;
    this.claimBridge = null;
    this.claimAuthorityTarget = null;
    this.claimAuthorityRelease = null;
    this.claimAuthorityReuses = 0;
    this.physicalAuthorityHost = null;
    this.physicalHostSnapshots = new WeakMap();
    this.physicalAuthorityRecoveries = 0;
    this.presenceState = null;
    this.presenceTransitions = 0;
    this.presenceTimer = 0;
    this.voiceTimer = 0;
    this.voiceHideTimer = 0;
    this.voiceFrame = 0;
    this.voiceSerial = 0;
    this.voiceMessages = 0;
    this.voiceState = 'hidden';
    this.createPersistentLayer();
    this.bind();
    document.documentElement.dataset.orbPersistentMotor = 'orbe-suprema-2-universal-v577';
    document.documentElement.dataset.orbPhysics = 'critical-damped-v569';
    document.documentElement.dataset.orbPresenceEngine = 'event-driven-v570';
    document.documentElement.dataset.orbVoiceEngine = 'anchored-bubble-v571';
    document.documentElement.dataset.orbVoiceState = 'hidden';
    document.documentElement.dataset.orbMagicEngine = 'source-born-microlight-v573';
    document.documentElement.dataset.orbContinuityEngine = 'universal-physical-authority-v577';
    if (!document.documentElement.dataset.orbMagicState) {
      document.documentElement.dataset.orbMagicState = 'pending';
    }
    this.setPresence(document.hidden ? 'sleeping' : 'serene', { reason:'boot', force:true });
    requestAnimationFrame(() => this.reconcileContinuity('boot'));
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
    this.createVoiceBubble();
  }

  createVoiceBubble() {
    for (const duplicate of document.querySelectorAll(`#${VOICE_ID}`)) duplicate.remove();
    const voice = document.createElement('div');
    voice.id = VOICE_ID;
    voice.hidden = true;
    voice.dataset.visible = 'false';
    voice.dataset.side = 'below';
    voice.setAttribute('role','status');
    voice.setAttribute('aria-live','polite');
    voice.setAttribute('aria-atomic','true');
    voice.setAttribute('aria-hidden','true');
    const text = document.createElement('span');
    text.className = 'db571-orb-voice__text';
    voice.append(text);
    (document.body || document.documentElement).append(voice);
    this.voice = voice;
    this.voiceText = text;
    return voice;
  }

  voiceCopy(route) {
    const id = String(route || routeNow()).replace(/^#/,'').toLowerCase();
    return ORB_ROUTE_VOICE_V571[id] || ORB_ROUTE_VOICE_V571.home;
  }

  positionVoice() {
    if (this.destroyed || this.active || !this.voice || this.voice.hidden) return false;
    const orbRect = rectOf(this.core?.orb);
    if (!orbRect) return false;
    const view = viewport();
    const margin = 12;
    const gap = 12;
    const availableWidth = Math.max(80,view.width-margin*2);
    this.voice.style.maxWidth = `${availableWidth.toFixed(2)}px`;
    const measured = this.voice.getBoundingClientRect?.();
    const width = clamp(
      measured?.width > 16 ? measured.width : Math.min(280,availableWidth),
      Math.min(80,availableWidth),availableWidth
    );
    const availableHeight = Math.max(32,view.height-margin*2);
    const height = clamp(
      measured?.height > 16 ? measured.height : 48,
      Math.min(32,availableHeight),availableHeight
    );
    const belowTop = orbRect.top+orbRect.height+gap;
    const aboveTop = orbRect.top-gap-height;
    const belowFits = belowTop+height <= view.bottom-margin;
    const aboveFits = aboveTop >= view.top+margin;
    const side = belowFits || !aboveFits ? 'below' : 'above';
    const minimumLeft = view.left+margin;
    const minimumTop = view.top+margin;
    const maximumLeft = Math.max(minimumLeft,view.right-width-margin);
    const maximumTop = Math.max(minimumTop,view.bottom-height-margin);
    const left = clamp(orbRect.x-width/2,minimumLeft,maximumLeft);
    const top = clamp(side === 'below' ? belowTop : aboveTop,minimumTop,maximumTop);
    const tailX = clamp(orbRect.x-left,18,Math.max(18,width-18));
    this.voice.dataset.side = side;
    this.voice.style.left = `${left.toFixed(2)}px`;
    this.voice.style.top = `${top.toFixed(2)}px`;
    this.voice.style.setProperty('--db571-tail-x',`${tailX.toFixed(2)}px`);
    return true;
  }

  showVoice(copy, { duration = 2400, reason = 'response', route = this.route } = {}) {
    if (this.destroyed || this.active || document.hidden || !this.voice || !rectOf(this.core?.orb)) {
      this.hideVoice('unavailable',true);
      return false;
    }
    const safeCopy = String(copy || '').replace(/\s+/g,' ').trim().slice(0,VOICE_TEXT_LIMIT_V571);
    if (!safeCopy) {
      this.hideVoice('empty',true);
      return false;
    }
    const token = ++this.voiceSerial;
    clearTimeout(this.voiceTimer);
    clearTimeout(this.voiceHideTimer);
    cancelAnimationFrame(this.voiceFrame);
    this.voiceTimer = 0;
    this.voiceHideTimer = 0;
    this.voiceFrame = 0;
    this.voiceText.textContent = safeCopy;
    this.voice.dataset.visible = 'false';
    this.voice.dataset.route = String(route || routeNow());
    this.voice.dataset.reason = String(reason || 'response');
    this.voice.hidden = false;
    this.voice.setAttribute('aria-hidden','false');
    copyVariables(this.core?.orb,this.voice);
    this.positionVoice();
    this.voiceState = 'showing';
    document.documentElement.dataset.orbVoiceState = 'showing';
    this.voiceFrame = requestAnimationFrame(() => {
      this.voiceFrame = 0;
      if (this.destroyed || this.active || token !== this.voiceSerial || document.hidden) return;
      this.positionVoice();
      this.voice.dataset.visible = 'true';
      this.voiceState = 'visible';
      document.documentElement.dataset.orbVoiceState = 'visible';
      this.voiceMessages += 1;
      emit('divina:orb-voice-state', {
        state:'visible', reason, route:String(route || routeNow()), anchored:true
      });
      if (duration > 0) {
        this.voiceTimer = setTimeout(() => {
          this.voiceTimer = 0;
          this.hideVoice('auto-hide');
        },Math.max(360,Number(duration) || 0));
      }
    });
    return true;
  }

  hideVoice(reason = 'hidden', immediate = false) {
    if (!this.voice) return false;
    const wasExposed = this.voiceState !== 'hidden' || !this.voice.hidden || this.voice.dataset.visible === 'true';
    ++this.voiceSerial;
    clearTimeout(this.voiceTimer);
    clearTimeout(this.voiceHideTimer);
    cancelAnimationFrame(this.voiceFrame);
    this.voiceTimer = 0;
    this.voiceHideTimer = 0;
    this.voiceFrame = 0;
    this.voice.dataset.visible = 'false';
    this.voice.setAttribute('aria-hidden','true');
    this.voiceState = 'hidden';
    document.documentElement.dataset.orbVoiceState = 'hidden';
    if (wasExposed) {
      emit('divina:orb-voice-state', {
        state:'hidden', reason, route:this.route, anchored:true
      });
    }
    if (immediate || reducedMotion() || this.voice.hidden) {
      this.voice.hidden = true;
    } else {
      this.voiceHideTimer = setTimeout(() => {
        this.voiceHideTimer = 0;
        if (this.voice?.dataset.visible !== 'true') this.voice.hidden = true;
      },190);
    }
    return true;
  }

  speakRoute(route, reason = 'arrival') {
    const id = String(route || routeNow()).replace(/^#/,'').toLowerCase();
    if (this.active || TRAVEL_STATES_V570.has(this.state)) return false;
    return this.showVoice(this.voiceCopy(id), {
      duration:reducedMotion() ? 1800 : 2600, reason, route:id
    });
  }

  bind() {
    const { signal } = this.abort;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.hideVoice('visibility-hidden',true);
        this.setPresence('sleeping', { reason:'visibility-hidden', force:true });
        if (this.active) this.finishImmediately('visibility');
      } else {
        this.setPresence('attentive', {
          reason:'visibility-return', restAfter:reducedMotion() ? 180 : 900, force:true
        });
        this.reconcileContinuity('visibility-return');
        this.scheduleTrack('visibility-return');
      }
    }, { signal });
    addEventListener('pagehide', event => {
      this.lastPageTransition = { type:'pagehide', persisted:Boolean(event?.persisted) };
      this.hideVoice('pagehide',true);
      this.setPresence('sleeping', { reason:'pagehide', force:true });
      this.finishImmediately('pagehide');
    }, { signal });
    addEventListener('pageshow', event => {
      const reason = event?.persisted ? 'pageshow-bfcache' : 'pageshow';
      this.lastPageTransition = { type:'pageshow', persisted:Boolean(event?.persisted) };
      this.reconcileContinuity(reason);
      this.scheduleTrack(reason);
      this.setPresence('attentive', {
        reason, restAfter:reducedMotion() ? 180 : 900, force:true
      });
    }, { signal });
    document.addEventListener('freeze', () => {
      this.hideVoice('freeze',true);
      this.setPresence('sleeping', { reason:'freeze', force:true });
      if (this.active) this.finishImmediately('freeze');
    }, { signal });
    document.addEventListener('resume', () => {
      this.reconcileContinuity('resume');
      this.scheduleTrack('resume');
      this.setPresence('attentive', {
        reason:'resume', restAfter:reducedMotion() ? 180 : 900, force:true
      });
    }, { signal });
    addEventListener('resize', () => this.scheduleTrack('resize'), { signal, passive:true });
    addEventListener('orientationchange', () => this.scheduleTrack('orientation'), { signal, passive:true });
    addEventListener('scroll', () => this.scheduleTrack('scroll'), { signal, passive:true, capture:true });
    for (const type of ['popstate','hashchange']) {
      addEventListener(type, () => requestAnimationFrame(() => this.reconcileContinuity(type)), { signal, passive:true });
    }
    globalThis.visualViewport?.addEventListener?.('resize', () => this.scheduleTrack('visual-viewport-resize'), { signal, passive:true });
    globalThis.visualViewport?.addEventListener?.('scroll', () => this.scheduleTrack('visual-viewport-scroll'), { signal, passive:true });
    for (const type of ['divina:skin-change','orbe:skin-change','skin:changed']) {
      document.addEventListener(type, () => {
        copyVariables(this.core?.orb,this.root);
        copyVariables(this.core?.orb,this.voice);
      }, { signal });
    }
    for (const type of ['divina:route-ready','divina:page-ready','divina:orb-presence-created']) {
      document.addEventListener(type, event => {
        this.syncRestingOrb(type);
        if (type === 'divina:route-ready' && !this.active) {
          requestAnimationFrame(() => this.speakRoute(event.detail?.id || routeNow(),'route-ready'));
        }
      }, { signal });
    }
    document.addEventListener('divina:menu-state', event => {
      const menuState = String(event.detail?.state || 'closed');
      if (menuState !== 'closed') this.hideVoice(`menu-${menuState}`,true);
      if (menuState !== 'closing') return;
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
      const route = routeNow();
      const claimedHost = this.claimedHostForRoute(route,true);
      if (claimedHost) this.setPhysicalAuthority(claimedHost,route);
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
      if (kind === 'intent') this.hideVoice('navigation-intent',true);
      else if (kind === 'present') this.speakRoute(event.detail?.route || routeNow(),'already-present');
      else if (['press','keyboard'].includes(kind)) {
        this.showVoice('Estou ouvindo.', { duration:0, reason:`pulse-${kind}`, route:routeNow() });
      } else if (kind === 'release') {
        this.showVoice('Estou aqui.', { duration:1600, reason:'pulse-release', route:routeNow() });
      }
    }, { signal });
    for (const type of ['divina:supreme-orb-intent','divina:supreme-orb-will-navigate','divina:route-start']) {
      document.addEventListener(type, () => this.hideVoice(type,true), { signal });
    }
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
      this.showVoice('Estou aqui.', { duration:1600, reason:'pointer-cancel', route:routeNow() });
    }, { signal });
    document.addEventListener('keyup', event => {
      if (!['Enter',' '].includes(event.key)) return;
      if (event.target?.closest?.('[data-supreme-orb="living"]') !== this.core?.orb) return;
      this.setPresence('responding', {
        reason:'keyboard-release', restAfter:reducedMotion() ? 180 : 720
      });
      this.showVoice('Estou aqui.', { duration:1600, reason:'keyboard-release', route:routeNow() });
    }, { signal });
  }

  attach(core) {
    this.core = core || this.core;
    copyVariables(this.core?.orb, this.root);
    copyVariables(this.core?.orb, this.voice);
    if (this.core && !this.claimBridge) {
      this.originalClaim = this.core.claim;
      this.claimBridge = (host, options = {}) => {
        const target = typeof host === 'string' ? document.querySelector(host) : host;
        const orb = this.core?.orb;
        const targetScreen = target?.closest?.('.screen')?.id || null;
        if (target?.isConnected && target === this.claimAuthorityTarget &&
          this.core?.claimedHost === target && typeof this.claimAuthorityRelease === 'function') {
          this.landingHost = target;
          this.claimAuthorityReuses += 1;
          return this.claimAuthorityRelease;
        }
        const bridgeRestingClaim = !this.active
          && (orb?.parentNode === this.stage || this.physicalAuthorityHost?.contains?.(orb))
          && targetScreen === routeNow()
          && this.physicalAuthorityHost !== target
          && options?.mode !== 'menu';
        const origin = bridgeRestingClaim
          ? (rectOf(this.physicalAuthorityHost) || rectOf(this.stage) || rectOf(orb))
          : null;
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
          void this.glideToClaimedHost(target,destination);
        }
        if (typeof release !== 'function') return release;
        let released = false;
        const wrappedRelease = () => {
          if (released) return false;
          released = true;
          if (this.claimAuthorityRelease === wrappedRelease) {
            this.claimAuthorityTarget = null;
            this.claimAuthorityRelease = null;
          }
          if (this.landingHost === target) this.landingHost = null;
          this.clearPhysicalAuthority(target);
          const result = release();
          if (this.active && this.state === 'settle') this.finishImmediately('claim-released');
          else this.settleToken += 1;
          requestAnimationFrame(() => this.syncRestingOrb('claim-release'));
          return result;
        };
        if (target?.isConnected && options?.mode !== 'menu') {
          this.claimAuthorityTarget = target;
          this.claimAuthorityRelease = wrappedRelease;
        }
        return wrappedRelease;
      };
      this.core.claim = this.claimBridge;
    }
    return this;
  }

  detach(core) {
    if (this.core && this.claimBridge && this.core.claim === this.claimBridge) this.core.claim = this.originalClaim;
    this.claimBridge = null;
    this.originalClaim = null;
    this.claimAuthorityTarget = null;
    this.claimAuthorityRelease = null;
    if (!core || core === this.core) this.core = null;
  }

  setState(state, detail = {}) {
    this.state = state;
    this.root.dataset.state = state;
    document.documentElement.dataset.orbJourneyState = state;
    if (TRAVEL_STATES_V570.has(state)) {
      document.documentElement.dataset.orbMagicState = 'off';
      this.hideVoice(`journey-${state}`,true);
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

  routeForHost(host) {
    const screen = host?.closest?.('.screen') || host?.closest?.('[data-screen]');
    return String(screen?.id || screen?.dataset?.screen || '')
      .replace(/^#/,'')
      .toLowerCase();
  }

  claimedHostForRoute(route = routeNow(), requireOwnership = false) {
    const host = this.core?.claimedHost;
    const orb = this.core?.orb;
    const currentRoute = String(route || routeNow()).replace(/^#/,'').toLowerCase();
    if (!host?.isConnected || this.routeForHost(host) !== currentRoute) return null;
    if (requireOwnership && !host.contains?.(orb)) return null;
    return host;
  }

  setPhysicalAuthority(host, route = routeNow()) {
    const orb = this.core?.orb;
    const currentRoute = String(route || routeNow()).replace(/^#/,'').toLowerCase();
    if (!host?.isConnected || !orb?.isConnected || !host.contains?.(orb) ||
      this.routeForHost(host) !== currentRoute) {
      this.clearPhysicalAuthority();
      return false;
    }
    if (this.physicalAuthorityHost && this.physicalAuthorityHost !== host) {
      this.restorePhysicalHost(this.physicalAuthorityHost);
    }
    this.physicalAuthorityHost = host;
    if (!this.physicalHostSnapshots.has(host)) {
      this.physicalHostSnapshots.set(host, {
        role:host.getAttribute?.('role') ?? null,
        tabindex:host.getAttribute?.('tabindex') ?? null,
        ariaLabel:host.getAttribute?.('aria-label') ?? null
      });
    }
    host.setAttribute?.('role','presentation');
    host.removeAttribute?.('tabindex');
    host.removeAttribute?.('aria-label');
    host.dataset.orbPhysicalAuthority = 'living';
    document.documentElement.dataset.orbPhysicalAuthority = currentRoute;
    return true;
  }

  clearPhysicalAuthority(host = null) {
    if (host && this.physicalAuthorityHost && this.physicalAuthorityHost !== host) return false;
    const authorityHost = this.physicalAuthorityHost || host;
    this.restorePhysicalHost(authorityHost);
    this.physicalAuthorityHost = null;
    delete document.documentElement.dataset.orbPhysicalAuthority;
    return true;
  }

  restorePhysicalHost(host) {
    if (!host) return false;
    host.removeAttribute?.('data-orb-physical-authority');
    const snapshot = this.physicalHostSnapshots.get(host);
    if (!snapshot) return true;
    const restore = (name,value) => value == null
      ? host.removeAttribute?.(name)
      : host.setAttribute?.(name,value);
    restore('role',snapshot.role);
    restore('tabindex',snapshot.tabindex);
    restore('aria-label',snapshot.ariaLabel);
    this.physicalHostSnapshots.delete(host);
    return true;
  }

  centerFallback() {
    const view = viewport();
    return { node:null, x:view.left+view.width/2, y:view.top+Math.min(view.height*.42,380), width:76, height:76, kind:'viewport-safe' };
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
    return {
      x:clamp(view.left+point[0]*view.width,view.left+42,view.right-42),
      y:clamp(view.top+point[1]*view.height,view.top+84,view.bottom-92)
    };
  }

  transform(point, scale = 1) {
    return `translate3d(${(point.x-this.sourceSize/2).toFixed(2)}px,${(point.y-this.sourceSize/2).toFixed(2)}px,0) scale(${scale.toFixed(5)})`;
  }

  capturePhysicalOrb(origin, { handoffClaim = false } = {}) {
    const orb = this.core?.orb;
    if (!orb) throw new Error('living-orb-unavailable');
    const sourceClaim = this.core?.claimedHost || null;
    this.clearPhysicalAuthority();
    this.clearLandingAnchor();
    this.sourceSize = clamp(Math.max(origin.width,origin.height),58,Math.min(520,viewport().width*.94));
    this.current = { x:origin.x, y:origin.y };
    this.scale = 1;
    this.root.style.setProperty('--db565-size',`${this.sourceSize}px`);
    this.stage.style.transform = this.transform(this.current,1);
    this.stage.append(orb);
    if (handoffClaim && sourceClaim) {
      const handedOff = this.core?.handoffClaimToJourney?.(this.stage);
      if (handedOff && this.claimAuthorityTarget === handedOff) {
        this.claimAuthorityTarget = null;
        this.claimAuthorityRelease = null;
      }
    }
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
      let watchdog = 0;
      try {
        let finished;
        try { finished = animation.finished; }
        catch { finished = Promise.resolve(); }
        await Promise.race([
          Promise.resolve(finished).catch(() => null),
          new Promise(resolve => {
            watchdog = setTimeout(resolve, Math.max(220, adaptiveDuration + 240));
          })
        ]);
      } finally {
        clearTimeout(watchdog);
        this.animations.delete(animation);
        this.stage.style.transform = this.transform(finish,finishScale);
        try { animation.cancel(); } catch {}
      }
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

  resumeHeavyEffects(wake = true) {
    document.documentElement.removeAttribute(FLIGHT_ATTR);
    if (wake) this.universe?.start?.('atom-one-flight');
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
    this.capturePhysicalOrb(origin,{handoffClaim:true});
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
    const requestedRoute = String(route || this.route).replace(/^#/,'').toLowerCase();
    const deadline = performance.now()+budgets().wait;
    let destination = null;
    do {
      if (requestedRoute === 'tarot') {
        const tarot = globalThis.divinaTarotLivreV517;
        const host = document.querySelector('#tarot.active [data-tarot-orb-host]');
        const reserved = tarot?.readyForArrival?.() === true
          && host === tarot.orbHost
          && this.core?.claimedHost === host;
        const altar = reserved ? rectOf(host) : null;
        if (altar) return { ...altar, kind:'tarot-owned-host' };
      } else {
        destination = this.resolveDestination(requestedRoute);
      }
      if (destination?.node) return destination;
      if (performance.now()>=deadline) break;
      await frame();
    } while (performance.now()<deadline);
    if (requestedRoute === 'tarot') throw new Error('tarot-owned-host-unavailable-v576');
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
    this.speakRoute(String(to || this.route),'arrival-complete');
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
    this.setPhysicalAuthority(host,this.route);
    this.core.renderer?.resize?.();
    this.setPresence('responding', {
      reason:'claim-settled', restAfter:reducedMotion() ? 180 : 820, force:true
    });
    this.speakRoute(this.route,'claim-settled');
    emit('divina:orb-physical-claim-settled',{route:this.route,host:host.id||null});
    return true;
  }

  settlePhysicalOrb(route, destination = null) {
    const orb = this.core?.orb;
    if (!orb) return false;
    this.route = String(route || routeNow()).replace(/^#/,'').toLowerCase();
    if (this.route === 'home') {
      this.clearPhysicalAuthority();
      this.clearLandingAnchor();
      this.core?.returnHome?.();
      this.landingHost = null;
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      return true;
    }
    const landingRoute = this.routeForHost(this.landingHost);
    const host = this.landingHost?.isConnected && landingRoute === this.route
      ? this.landingHost
      : this.claimedHostForRoute(this.route);
    if (host?.isConnected && this.routeForHost(host) === this.route) {
      this.clearLandingAnchor();
      host.append(orb);
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      this.landingHost = host;
      this.setPhysicalAuthority(host,this.route);
      this.core.renderer?.resize?.();
      emit('divina:orb-physical-claim-settled',{
        route:this.route,
        host:host.id||null,
        authority:'single-physical-orb-universal-v577'
      });
      return true;
    }
    this.clearPhysicalAuthority();
    this.landingHost = null;
    const fallback = destination || this.centerFallback();
    const anchor = fallback?.node?.isConnected ? fallback.node : this.resolveDestination(this.route)?.node;
    if (!anchor) {
      this.clearLandingAnchor();
      this.root.hidden = false;
      return this.placeStage(fallback);
    }
    const anchorRoute = this.routeForHost(anchor);
    if (anchorRoute === this.route && anchor.matches?.(
      '[data-orb-physical-host-v577],[data-orb-presence-v526],[data-orb-journey-anchor],'+
      '[data-daily-orb-host],[data-library-orb-host],[data-school-orb-host],'+
      '[data-whit-orb-host],[data-journal-orb-host],[data-mesa-orb-host],[data-skin-orb]'
    )) {
      this.clearLandingAnchor();
      anchor.append(orb);
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      this.landingHost = anchor;
      this.setPhysicalAuthority(anchor,this.route);
      this.core.renderer?.resize?.();
      emit('divina:orb-physical-claim-settled',{
        route:this.route,
        host:anchor.id||null,
        authority:'single-physical-orb-universal-v577'
      });
      return true;
    }
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
    cancelAnimationFrame(this.trackSettleFrame);
    this.trackSettleFrame = 0;
    const sync = pass => {
      if (this.active || this.destroyed) return;
      if (this.core?.orb?.parentNode === this.stage) {
        const restingTarget = this.landingAnchor?.isConnected
          ? rectOf(this.landingAnchor) || this.centerFallback()
          : this.resolveDestination(this.route) || this.centerFallback();
        this.placeStage(restingTarget);
        emit('divina:orb-physical-rest-synced',{reason,pass,route:this.route});
      }
      this.positionVoice();
    };
    this.trackFrame = requestAnimationFrame(() => {
      this.trackFrame = 0;
      sync('first-frame');
      if (!/^(visual-viewport|orientation|pageshow|visibility-return|resume)/.test(reason)) return;
      this.trackSettleFrame = requestAnimationFrame(() => {
        this.trackSettleFrame = 0;
        sync('settled-frame');
      });
    });
  }

  syncRestingOrb(reason = 'sync') {
    if (this.active || this.destroyed) return false;
    const route = routeNow();
    const orb = this.core?.orb;
    if (!orb) return false;
    this.route = route;
    if (route === 'home') {
      this.clearPhysicalAuthority();
      if (orb.parentNode === this.stage || this.routeForHost(orb.parentElement) !== 'home') {
        this.settlePhysicalOrb('home');
      }
      return true;
    }

    if (this.physicalAuthorityHost?.isConnected
      && this.routeForHost(this.physicalAuthorityHost) === route
      && this.physicalAuthorityHost.contains?.(orb)) {
      this.landingHost = this.physicalAuthorityHost;
      this.clearLandingAnchor();
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      return true;
    }

    const ownedClaim = this.claimedHostForRoute(route,true);
    if (ownedClaim) {
      this.landingHost = ownedClaim;
      this.clearLandingAnchor();
      this.root.hidden = true;
      this.current = null;
      this.scale = 1;
      this.setPhysicalAuthority(ownedClaim,route);
      return true;
    }

    const routeClaim = this.claimedHostForRoute(route);
    if (routeClaim) {
      this.landingHost = routeClaim;
      const destination = rectOf(routeClaim) || this.resolveDestination(route);
      if (orb.parentNode !== this.stage) this.capturePhysicalOrb(destination);
      if (!this.settlePhysicalOrb(route,destination)) return false;
      this.physicalAuthorityRecoveries += 1;
      emit('divina:orb-physical-authority-recovered',{reason,route});
      return true;
    }

    const structuralRoute = this.routeForHost(orb.parentElement);
    if (orb.isConnected && orb.parentNode !== this.stage && structuralRoute === route) {
      const structuralHost = orb.parentElement;
      if (structuralHost?.matches?.('[data-tarot-orb-host],[data-daily-orb-host],[data-supreme-orb-host],[data-orb-physical-host-v577],[data-orb-presence-v526],[data-orb-journey-anchor]')) {
        this.setPhysicalAuthority(structuralHost,route);
      }
      return true;
    }

    const destination = this.resolveDestination(route);
    if (!destination) return false;
    if (orb.parentNode !== this.stage) this.capturePhysicalOrb(destination);
    if (!this.settlePhysicalOrb(route,destination)) return false;
    emit('divina:orb-physical-rest-synced',{reason,route});
    return true;
  }

  reconcileContinuity(reason = 'lifecycle') {
    if (this.destroyed) return false;
    this.continuityChecks += 1;
    if (this.active) {
      this.lastContinuity = { reason, route:this.route, deferred:true, recovered:false };
      return false;
    }
    let recovered = false;
    const host = document.body || document.documentElement;
    installStyles();
    if (this.root && !this.root.isConnected) {
      host.append(this.root);
      recovered = true;
    }
    if (this.voice && !this.voice.isConnected) {
      host.append(this.voice);
      recovered = true;
    }
    if (document.documentElement.dataset.orbGlobalFlight === 'active' ||
      document.documentElement.getAttribute?.(FLIGHT_ATTR) === 'active') {
      this.resumeHeavyEffects();
      recovered = true;
    }
    const orb = this.core?.orb;
    const route = routeNow();
    this.route = route;
    if (!orb) {
      this.lastContinuity = { reason, route, deferred:false, recovered, connected:false };
      return false;
    }
    if (!orb.isConnected) {
      if (route === 'home') this.core?.returnHome?.();
      else {
        const destination = this.resolveDestination(route);
        this.capturePhysicalOrb(destination);
        this.settlePhysicalOrb(route,destination);
      }
      recovered = orb.isConnected || recovered;
    }
    const synced = this.syncRestingOrb(reason);
    copyVariables(orb,this.root);
    copyVariables(orb,this.voice);
    this.core?.renderer?.resize?.();
    this.core?.renderer?.resume?.('universal-physical-authority-v577');
    this.positionVoice();
    if (recovered) this.continuityRecoveries += 1;
    const connected = Boolean(orb.isConnected && this.root?.isConnected && this.voice?.isConnected);
    this.lastContinuity = { reason, route, deferred:false, recovered, connected, synced:Boolean(synced) };
    emit('divina:orb-continuity-reconciled', {
      reason, route, recovered, connected, visualViewport:viewport()
    });
    return connected && synced !== false;
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
    this.speakRoute(String(from || routeNow()),'recovery-complete');
    emit('divina:orb-persistent-finished',{reason:'recovered',route:this.route});
    return this.status();
  }

  finishImmediately(reason = 'complete', countInterruption = true) {
    this.hideVoice(`journey-${reason}`,true);
    if (countInterruption && this.active && !['complete','recovered'].includes(reason)) this.interrupted += 1;
    this.settleToken += 1;
    this.animations.forEach(animation => { try { animation.cancel(); } catch {} });
    this.animations.clear();
    const sleeping = document.hidden || ['pagehide','visibility','freeze','destroy'].includes(reason);
    this.resumeHeavyEffects(!sleeping);
    this.active = false;
    this.state = 'rest';
    this.root.dataset.state = 'rest';
    document.documentElement.dataset.orbJourneyState = 'rest';
    const route = routeNow();
    const destination = this.resolveDestination(route);
    this.settlePhysicalOrb(route,destination);
    if (reason !== 'destroy') {
      this.setPresence(sleeping ? 'sleeping' : 'responding', {
        reason:`journey-${reason}`,
        restAfter:sleeping ? 0 : reducedMotion() ? 180 : 720,
        force:true
      });
    }
    emit('divina:orb-persistent-finished',{reason,route:this.route});
  }

  status() {
    return Object.freeze({ version:VERSION, engine:'OrbPersistentJourneyV577Universal', work:'ORBE-SUPREMA-2-MACROETAPA-2',
      active:this.active, state:this.state, route:this.route, persistentLayer:Boolean(this.root?.isConnected), layerCreations:1,
      perRouteRecreation:false, oneLivingOrb:true, physicalOrbTransport:true, physicalOrbConnected:Boolean(this.core?.orb?.isConnected),
      travelerCopies:0, snapshotCadence:'none', handoffFade:false, teleportFallback:false, permanentAnimationLoops:0,
      heavyEffectsPausedDuringFlight:true, orbRendererPausedDuringFlight:false, fluidityProfile:budgets().profile,
      motionLaw:'critical-damped-bezier', adaptiveDuration:true, physicsSamples:budgets().samples,
      presenceState:this.presenceState, presenceStates:ORB_PRESENCE_STATES_V570,
      presenceModel:'event-driven-v570', presenceTransitions:this.presenceTransitions,
      globalLivingRenderer:true, addedAnimationLoops:0, idleTimers:1,
      voiceBubble:true, voiceNodes:document.querySelectorAll(`#${VOICE_ID}`).length,
      voiceAnchoredToLivingOrb:Boolean(this.voice?.isConnected && this.core?.orb?.isConnected),
      voiceDuringFlight:false, voiceModel:'anchored-bubble-v571', speechSynthesisUsed:false,
      voiceTextLimit:VOICE_TEXT_LIMIT_V571, voiceState:this.voiceState, voiceMessages:this.voiceMessages,
      microscopicMagic:true, magicModel:'source-born-microlight-v573',
      magicState:document.documentElement.dataset.orbMagicState || 'pending',
      magicInsideLivingRenderer:true, magicDuringFlight:false, magicSourcePixelsOnly:true,
      magicPerformanceGate:true, magicReducedMotionOff:true,
      additionalParticleNodes:0, additionalCanvasNodes:0,
      continuityModel:'iphone-pwa-v577-universal-foundation', bfcacheAware:true, freezeResumeAware:true,
      visualViewportAware:true, visualViewportScrollTracking:true, visualViewportSettledPass:true,
      historyRecoveryAware:true,
      physicalAuthorityRoute:document.documentElement.dataset.orbPhysicalAuthority || null,
      physicalAuthorityOwned:Boolean(this.physicalAuthorityHost?.contains?.(this.core?.orb)),
      physicalAuthorityRecoveries:this.physicalAuthorityRecoveries,
      idempotentClaims:true, claimAuthorityReuses:this.claimAuthorityReuses,
      redundantTarotHeaderProjectionSuppressed:true, universalPhysicalLanding:true,
      rendererContextRestoreAware:true, continuityChecks:this.continuityChecks,
      continuityRecoveries:this.continuityRecoveries, lastContinuity:this.lastContinuity,
      rendererState:document.documentElement.dataset.orbRendererState || 'pending',
      rendererContextRestoreAttempts:Number(this.core?.renderer?.contextRestoreAttempts || 0),
      rendererContextRestoreSuccesses:Number(this.core?.renderer?.contextRestoreSuccesses || 0),
      visualViewport:viewport(), lastPageTransition:this.lastPageTransition,
      tactileResponsePreserved:true, lastMotion:this.lastMotion || null,
      completedNavigations:this.completed, interruptedNavigations:this.interrupted });
  }

  destroy() {
    if (this.destroyed) return;
    const livingOrb = this.core?.orb;
    this.destroyed = true;
    this.finishImmediately('destroy');
    cancelAnimationFrame(this.trackFrame);
    cancelAnimationFrame(this.trackSettleFrame);
    cancelAnimationFrame(this.voiceFrame);
    clearTimeout(this.presenceTimer);
    clearTimeout(this.voiceTimer);
    clearTimeout(this.voiceHideTimer);
    this.abort.abort();
    this.clearPhysicalAuthority();
    this.clearLandingAnchor();
    this.core?.returnHome?.();
    this.detach(this.core);
    this.root?.remove();
    this.voice?.remove();
    document.getElementById(STYLE_ID)?.remove();
    delete document.documentElement.dataset.orbPersistentMotor;
    delete document.documentElement.dataset.orbPhysics;
    delete document.documentElement.dataset.orbJourneyState;
    delete document.documentElement.dataset.orbPresenceEngine;
    delete document.documentElement.dataset.orbPresenceState;
    delete document.documentElement.dataset.orbVoiceEngine;
    delete document.documentElement.dataset.orbVoiceState;
    delete document.documentElement.dataset.orbMagicEngine;
    delete document.documentElement.dataset.orbMagicState;
    delete document.documentElement.dataset.orbContinuityEngine;
    delete document.documentElement.dataset.orbPhysicalAuthority;
    if (livingOrb) delete livingOrb.dataset.orbPresenceState;
    delete globalThis[INSTANCE];
  }
}

export function createOrbPersistentJourneyV565(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  delete globalThis[INSTANCE];
  const engine = new OrbPersistentJourneyV565(options);
  globalThis[INSTANCE] = engine;
  return engine;
}

export default createOrbPersistentJourneyV565;
