/* DIVINA BRUXA — MACROETAPA 1/4 · TAROT SOBRE O UNIVERSO VIVO V515
   A única Orbe Suprema V501 ocupa o altar sobre o mesmo universo procedural
   que atravessa a Home e todas as páginas. A fotografia cósmica e a chama
   provisória da V514 foram aposentadas. A carta continua viajando fisicamente;
   o fogo definitivo será ligado a este núcleo na Macroetapa 2. */

import { CARDS } from './tarot-data.js';
import { cardImageMarkup, prepareCardImage, preloadCardImages } from './tarot-image-runtime.js?v=148';
import { TarotSessionCoordinator } from './tarot-continuity.js?v=182';
import {
  DECK_SIZE,
  drawNextCard,
  resetTarotState,
  shuffleRemainingCards
} from './tarot-session.js?v=182';
import { store } from './storage.js';

const VERSION = 515;
const STORAGE_KEY = 'free-tarot';
const RESET_ARM_MS = 3600;
const CARD_READY_TIMEOUT_MS = 4800;
const BIRTH_TRAVEL_MS = 1040;
const HISTORY_TRANSITION_MS = 280;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';
const routeNow = () => String(
  document.body?.dataset?.screen ||
  document.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
  location.hash.replace(/^#/, '') ||
  'home'
).toLowerCase();
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

const FALLBACK_ACCENT = Object.freeze({ r:165, g:101, b:214 });
const FALLBACK_LIGHT = Object.freeze({ r:240, g:214, b:138 });
const FALLBACK_GOLD = Object.freeze({ r:255, g:220, b:161 });

function parseColor(value, fallback = FALLBACK_ACCENT) {
  const input = String(value || '').trim();
  const hex = input.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const normalized = hex.length === 3
      ? hex.split('').map(character => `${character}${character}`).join('')
      : hex;
    return {
      r:parseInt(normalized.slice(0, 2), 16),
      g:parseInt(normalized.slice(2, 4), 16),
      b:parseInt(normalized.slice(4, 6), 16)
    };
  }
  const rgb = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return {
    r:clamp(Math.round(Number(rgb[1])), 0, 255),
    g:clamp(Math.round(Number(rgb[2])), 0, 255),
    b:clamp(Math.round(Number(rgb[3])), 0, 255)
  };
  return { ...fallback };
}

const mixColor = (first, second, amount) => ({
  r:Math.round(first.r + (second.r - first.r) * amount),
  g:Math.round(first.g + (second.g - first.g) * amount),
  b:Math.round(first.b + (second.b - first.b) * amount)
});
const colorCss = (color, alpha = 1) => alpha >= 1
  ? `rgb(${color.r} ${color.g} ${color.b})`
  : `rgb(${color.r} ${color.g} ${color.b} / ${clamp(alpha, 0, 1)})`;

function announce(message) {
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: message }));
}

function nativePulse(style = 'Light') {
  try {
    const capacitor = globalThis.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return;
    Promise.resolve(capacitor.Plugins?.Haptics?.impact?.({ style })).catch(() => {});
  } catch {
    // Haptics are app-only and always optional.
  }
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawPortalBack(canvas) {
  const width = 480;
  const height = 720;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  context.clearRect(0, 0, width, height);
  const surface = context.createLinearGradient(0, 0, width, height);
  surface.addColorStop(0, '#08020e');
  surface.addColorStop(0.48, '#21072f');
  surface.addColorStop(1, '#050108');
  roundedRect(context, 8, 8, width - 16, height - 16, 32);
  context.fillStyle = surface;
  context.fill();

  const aura = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * 0.52);
  aura.addColorStop(0, 'rgba(180,65,255,.40)');
  aura.addColorStop(0.36, 'rgba(112,34,205,.20)');
  aura.addColorStop(1, 'rgba(20,3,30,0)');
  context.fillStyle = aura;
  context.fillRect(0, 0, width, height);

  context.save();
  context.shadowBlur = 28;
  context.shadowColor = 'rgba(255,174,72,.62)';
  roundedRect(context, 17, 17, width - 34, height - 34, 27);
  context.strokeStyle = '#f5cf83';
  context.lineWidth = 5;
  context.stroke();
  roundedRect(context, 34, 34, width - 68, height - 68, 20);
  context.strokeStyle = 'rgba(245,207,131,.55)';
  context.lineWidth = 2;
  context.stroke();
  context.restore();

  context.save();
  context.translate(width / 2, height * 0.47);
  for (let index = 0; index < 32; index += 1) {
    const angle = index / 32 * Math.PI * 2;
    const inner = index % 2 ? 115 : 106;
    const outer = index % 4 ? 147 : 162;
    context.beginPath();
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.strokeStyle = index % 4 ? 'rgba(245,207,131,.38)' : 'rgba(255,226,164,.78)';
    context.lineWidth = index % 4 ? 1.8 : 3;
    context.stroke();
  }

  context.shadowBlur = 34;
  context.shadowColor = 'rgba(255,192,95,.66)';
  context.beginPath();
  context.arc(0, 0, 102, 0, Math.PI * 2);
  context.strokeStyle = '#f5cf83';
  context.lineWidth = 4;
  context.stroke();
  context.beginPath();
  context.arc(-13, -2, 66, 0, Math.PI * 2);
  context.fillStyle = '#f5cf83';
  context.fill();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(16, -16, 67, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const stars = [
    [0.50, 0.15, 9], [0.50, 0.25, 4], [0.50, 0.68, 6], [0.50, 0.78, 3],
    [0.24, 0.30, 3], [0.78, 0.62, 4], [0.19, 0.72, 2], [0.84, 0.25, 2]
  ];
  for (const [x, y, radius] of stars) {
    context.save();
    context.translate(width * x, height * y);
    context.shadowBlur = radius * 4;
    context.shadowColor = '#ffe8b6';
    context.fillStyle = '#fff1c9';
    context.beginPath();
    context.moveTo(0, -radius * 2.4);
    context.lineTo(radius * 0.42, -radius * 0.42);
    context.lineTo(radius * 2.4, 0);
    context.lineTo(radius * 0.42, radius * 0.42);
    context.lineTo(0, radius * 2.4);
    context.lineTo(-radius * 0.42, radius * 0.42);
    context.lineTo(-radius * 2.4, 0);
    context.lineTo(-radius * 0.42, -radius * 0.42);
    context.closePath();
    context.fill();
    context.restore();
  }
}

class RetiredCelestialFireEngineV514 {
  constructor({ cosmos, effects, stage, orb, card }) {
    this.cosmos = cosmos;
    this.effects = effects;
    this.stage = stage;
    this.orb = orb;
    this.card = card;
    this.world = stage.closest('.tl515');
    this.fx = effects.getContext('2d', { alpha: true, desynchronized: true });
    this.gl = null;
    this.program = null;
    this.uniforms = null;
    this.mode = 'canvas';
    this.width = 1;
    this.height = 1;
    this.pixelRatio = 1;
    this.renderScale = constrained() ? 0.54 : (innerWidth < 700 ? 0.72 : 0.84);
    this.effectsScale = constrained() ? 1 : (innerWidth < 700 ? 1.25 : 1.3);
    this.targetFps = reducedMotion() ? 24 : (constrained() ? 40 : 60);
    this.energy = 0.82;
    this.touchPower = 0;
    this.touchPoint = { x: 0.5, y: 0.5 };
    this.birthStartedAt = 0;
    this.birthDuration = 0;
    this.birthStrength = 0;
    this.birthBurstAt = 0;
    this.birthBurstPending = false;
    this.cardImpact = 0;
    this.sparks = [];
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.slowFrames = 0;
    this.frameGeometry = new Map();
    this.raf = 0;
    this.routeActive = routeNow() === 'tarot';
    this.visible = this.routeActive && !document.hidden;
    this.destroyed = false;
    this.startedAt = performance.now();
    this.paletteKey = '';
    this.palette = {
      accent:{ ...FALLBACK_ACCENT },
      light:{ ...FALLBACK_LIGHT },
      gold:{ ...FALLBACK_GOLD },
      hot:mixColor(FALLBACK_LIGHT, { r:255, g:255, b:255 }, 0.68),
      ember:mixColor(FALLBACK_GOLD, FALLBACK_ACCENT, 0.22)
    };
    this.particleSprites = Object.create(null);
    this.flameSprites = Object.create(null);
    const pseudo = value => {
      const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    };
    const livingStarCount = constrained() ? 24 : (innerWidth < 700 ? 38 : 52);
    this.livingStars = Array.from({ length:livingStarCount }, (_, index) => ({
      x:pseudo(index * 2.71 + 7.2),
      y:pseudo(index * 5.13 + 19.7),
      size:index % 11 === 0 ? 1.45 : (0.38 + pseudo(index + 33.4) * 0.72),
      speed:0.54 + pseudo(index * 1.87 + 4.1) * 1.34,
      phase:pseudo(index * 3.4 + 1.8) * Math.PI * 2,
      gold:index % 7 === 0
    }));
    this.foundationStars = Array.from({ length:constrained() ? 24 : 42 }, (_, index) => ({
      angle:pseudo(index * 4.73 + 5.1) * Math.PI * 2,
      reach:0.53 + pseudo(index * 2.17 + 11.8) * 0.85,
      lift:pseudo(index * 6.31 + 2.4),
      phase:pseudo(index * 8.2 + 9.6) * Math.PI * 2,
      size:index % 9 === 0 ? 1.65 : 0.45 + pseudo(index + 71.2) * 0.82
    }));
    const fireVolumeCount = constrained() ? 28 : (innerWidth < 700 ? 42 : 52);
    this.fireVolumes = Array.from({ length:fireVolumeCount }, (_, index) => ({
      progress:(index + 0.35 + pseudo(index * 7.11 + 3.8) * 0.3) / fireVolumeCount,
      lateral:(pseudo(index * 4.79 + 2.6) * 2 - 1),
      size:0.72 + pseudo(index * 5.37 + 14.2) * 0.56,
      stretch:1.18 + pseudo(index * 8.03 + 5.9) * 0.72,
      phase:pseudo(index * 6.91 + 21.4) * Math.PI * 2,
      drift:0.42 + pseudo(index * 3.17 + 12.1) * 0.72,
      color:index % 7 === 0 ? 'hot' : (index % 3 === 0 ? 'gold' : 'accent'),
      tongue:index % 5 === 0
    }));

    this.syncPalette(true);
    this.onSkinChange = () => this.syncPalette(true);
    this.skinEventTypes = [
      'divina:skin-change',
      'divina:skin-applied',
      'divina:supreme-orb-skin-synced',
      'orbe:skin-change',
      'skin:change',
      'skin:changed'
    ];
    this.paletteObserver = globalThis.MutationObserver
      ? new MutationObserver(() => this.syncPalette())
      : null;
    this.paletteObserver?.observe(document.documentElement, {
      attributes:true,
      attributeFilter:['data-skin', 'data-orb-skin', 'data-boot-skin', 'style', 'class']
    });
    if (document.body) this.paletteObserver?.observe(document.body, {
      attributes:true,
      attributeFilter:['data-orbe-skin', 'data-skin', 'style', 'class']
    });
    this.paletteObserver?.observe(this.orb, {
      attributes:true,
      attributeFilter:['data-skin', 'style', 'class']
    });
    this.skinEventTypes.forEach(type => document.addEventListener(type, this.onSkinChange));

    this.onVisibility = () => {
      this.visible = this.routeActive && !document.hidden;
      if (this.visible) this.start();
      else this.pause();
    };
    document.addEventListener('visibilitychange', this.onVisibility);

    this.resizeObserver = globalThis.ResizeObserver
      ? new ResizeObserver(() => this.resize())
      : null;
    this.resizeObserver?.observe(stage);
    this.onResize = () => this.resize();
    if (!this.resizeObserver) addEventListener('resize', this.onResize, { passive: true });

    this.intersectionObserver = globalThis.IntersectionObserver
      ? new IntersectionObserver(entries => {
          const entry = entries[0];
          this.visible = this.routeActive && Boolean(entry?.isIntersecting) && !document.hidden;
          if (this.visible) this.start();
          else this.pause();
        }, { rootMargin: '120px' })
      : null;
    this.intersectionObserver?.observe(stage);

    this.initializeRenderer();
    this.resize();
    this.start();
  }

  syncPalette(force = false) {
    const root = document.documentElement;
    const body = document.body;
    const styles = getComputedStyle(root);
    const orbStyles = getComputedStyle(this.orb);
    const skin = String(
      this.orb?.dataset?.skin ||
      root.dataset.orbSkin ||
      root.dataset.skin ||
      body?.dataset.orbeSkin ||
      body?.dataset.skin ||
      'classic'
    );
    const accentRaw = styles.getPropertyValue('--db-skin-accent').trim()
      || styles.getPropertyValue('--db-supreme-violet').trim()
      || orbStyles.getPropertyValue('--orb-primary').trim()
      || orbStyles.getPropertyValue('--p').trim()
      || '#a565d6';
    const lightRaw = styles.getPropertyValue('--db-skin-light').trim()
      || styles.getPropertyValue('--db-gold-soft').trim()
      || orbStyles.getPropertyValue('--orb-bright').trim()
      || orbStyles.getPropertyValue('--a').trim()
      || '#f0d68a';
    const goldRaw = styles.getPropertyValue('--db-supreme-gold').trim()
      || styles.getPropertyValue('--cosmic-gold').trim()
      || orbStyles.getPropertyValue('--orb-secondary').trim()
      || orbStyles.getPropertyValue('--s').trim()
      || '#ffdca1';
    const key = `${skin}|${accentRaw}|${lightRaw}|${goldRaw}`;
    if (!force && key === this.paletteKey) return false;

    const accent = parseColor(accentRaw, FALLBACK_ACCENT);
    const light = parseColor(lightRaw, FALLBACK_LIGHT);
    const gold = parseColor(goldRaw, FALLBACK_GOLD);
    this.paletteKey = key;
    this.palette = {
      accent,
      light,
      gold,
      hot:mixColor(light, { r:255, g:255, b:255 }, 0.7),
      ember:mixColor(gold, accent, 0.26)
    };
    this.world.style.setProperty('--tl515-skin-accent', colorCss(accent));
    this.world.style.setProperty('--tl515-skin-light', colorCss(light));
    this.world.style.setProperty('--tl515-skin-gold', colorCss(gold));
    this.world.style.setProperty('--tl515-skin-hot', colorCss(this.palette.hot));
    this.world.dataset.skinPalette = skin;
    this.buildParticleSprites();
    this.energy = Math.max(this.energy, 1.08);
    this.start();
    return true;
  }

  buildParticleSprites() {
    const makeStar = (core, halo) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d', { alpha:true });
      if (!context) return canvas;
      const glow = context.createRadialGradient(32, 32, 0, 32, 32, 30);
      glow.addColorStop(0, colorCss(core, 1));
      glow.addColorStop(0.09, colorCss(core, 0.98));
      glow.addColorStop(0.27, colorCss(halo, 0.48));
      glow.addColorStop(0.62, colorCss(halo, 0.12));
      glow.addColorStop(1, colorCss(halo, 0));
      context.fillStyle = glow;
      context.fillRect(0, 0, 64, 64);
      context.globalCompositeOperation = 'lighter';
      context.strokeStyle = colorCss(core, 0.78);
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(32, 8);
      context.lineTo(32, 56);
      context.moveTo(8, 32);
      context.lineTo(56, 32);
      context.stroke();
      return canvas;
    };

    const makeBillow = (core, halo, hot = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 160;
      const context = canvas.getContext('2d', { alpha:true });
      if (!context) return canvas;

      const paintCloud = (x, y, radius, alpha) => {
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, colorCss(hot ? this.palette.hot : core, alpha));
        glow.addColorStop(0.2, colorCss(core, alpha * 0.86));
        glow.addColorStop(0.52, colorCss(halo, alpha * 0.42));
        glow.addColorStop(0.8, colorCss(halo, alpha * 0.12));
        glow.addColorStop(1, colorCss(halo, 0));
        context.fillStyle = glow;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      };

      context.globalCompositeOperation = 'source-over';
      paintCloud(64, 104, 58, 0.72);
      context.globalCompositeOperation = 'lighter';
      paintCloud(46, 84, 42, 0.48);
      paintCloud(79, 71, 46, 0.44);
      paintCloud(63, 48, 38, 0.36);
      paintCloud(64, 117, 31, hot ? 0.68 : 0.48);
      return canvas;
    };

    const makeTongue = (core, halo) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 192;
      const context = canvas.getContext('2d', { alpha:true });
      if (!context) return canvas;
      const flame = context.createLinearGradient(64, 184, 54, 12);
      flame.addColorStop(0, colorCss(this.palette.hot, 0.9));
      flame.addColorStop(0.25, colorCss(core, 0.82));
      flame.addColorStop(0.66, colorCss(halo, 0.48));
      flame.addColorStop(1, colorCss(halo, 0));
      context.save();
      context.shadowColor = colorCss(halo, 0.72);
      context.shadowBlur = 22;
      context.fillStyle = flame;
      context.beginPath();
      context.moveTo(64, 184);
      context.bezierCurveTo(20, 158, 33, 113, 58, 78);
      context.bezierCurveTo(78, 49, 71, 24, 83, 8);
      context.bezierCurveTo(106, 68, 114, 121, 91, 158);
      context.bezierCurveTo(81, 175, 72, 183, 64, 184);
      context.closePath();
      context.fill();
      context.restore();
      const coreGlow = context.createRadialGradient(65, 137, 0, 65, 137, 43);
      coreGlow.addColorStop(0, colorCss(this.palette.hot, 0.84));
      coreGlow.addColorStop(0.3, colorCss(core, 0.48));
      coreGlow.addColorStop(1, colorCss(core, 0));
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = coreGlow;
      context.fillRect(20, 94, 90, 90);
      return canvas;
    };

    this.particleSprites = {
      accent:makeStar(this.palette.hot, this.palette.accent),
      gold:makeStar(this.palette.hot, this.palette.gold),
      white:makeStar({ r:255, g:253, b:242 }, this.palette.light)
    };
    this.flameSprites = {
      outer:makeBillow(mixColor(this.palette.accent, { r:55, g:8, b:88 }, 0.34), this.palette.accent),
      accent:makeBillow(mixColor(this.palette.accent, this.palette.light, 0.18), this.palette.accent),
      gold:makeBillow(mixColor(this.palette.gold, this.palette.hot, 0.18), this.palette.ember),
      hot:makeBillow(this.palette.hot, this.palette.gold, true),
      tongueAccent:makeTongue(mixColor(this.palette.accent, this.palette.hot, 0.28), this.palette.accent),
      tongueGold:makeTongue(this.palette.gold, this.palette.ember)
    };
  }

  initializeRenderer() {
    // The retired V514 experiment used a sprite-volume field. The former shader
    // described distance to a centerline and therefore read as lightning.
    this.useCanvasFallback();
    return;

    if (constrained()) {
      this.useCanvasFallback();
      return;
    }
    const options = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: constrained() ? 'low-power' : 'high-performance'
    };

    const gl = this.cosmos.getContext('webgl', options)
      || this.cosmos.getContext('experimental-webgl', options);
    if (!gl) {
      this.useCanvasFallback();
      return;
    }

    try {
      const vertexSource = `
        attribute vec2 a_position;
        void main(){
          gl_Position=vec4(a_position,0.0,1.0);
        }
      `;
      const fragmentSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform vec2 u_orb;
        uniform vec2 u_card;
        uniform vec2 u_touch;
        uniform float u_time;
        uniform float u_energy;
        uniform float u_touchPower;
        uniform float u_seed;
        uniform vec3 u_accent;
        uniform vec3 u_light;
        uniform vec3 u_gold;

        float hash21(vec2 p){
          p=fract(p*vec2(123.34,456.21));
          p+=dot(p,p+vec2(45.32));
          return fract(p.x*p.y);
        }
        float noise2(vec2 p){
          vec2 i=floor(p);
          vec2 f=fract(p);
          f=f*f*(3.0-2.0*f);
          return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
                     mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
        }
        float fbm(vec2 p){
          float value=0.0;
          float amplitude=0.52;
          for(int i=0;i<4;i++){
            value+=noise2(p)*amplitude;
            p=mat2(1.62,-1.18,1.18,1.62)*p+vec2(11.7,7.3);
            amplitude*=0.48;
          }
          return value;
        }
        float ridge(vec2 p){
          return 1.0-abs(noise2(p)*2.0-1.0);
        }
        float galaxy(vec2 uv,vec2 center,float arms,float spin,float aspect){
          vec2 p=uv-center;
          p.x*=aspect;
          float radius=length(p);
          float angle=atan(p.y,p.x);
          float spiral=0.5+0.5*cos(angle*arms-radius*34.0+spin);
          float dust=fbm(vec2(angle*2.1-radius*11.0+spin*0.08,radius*18.0));
          float body=exp(-radius*10.5)*(0.18+0.82*pow(spiral,5.0));
          return body*(0.54+0.74*dust)+exp(-radius*42.0)*1.35;
        }
        void main(){
          vec2 uv=gl_FragCoord.xy/u_resolution.xy;
          float aspect=u_resolution.x/u_resolution.y;
          float time=u_time;
          vec3 color=vec3(0.0);
          float alpha=0.0;

          float cloud=fbm(uv*vec2(4.4*aspect,4.4)+vec2(time*0.025,-time*0.018)+vec2(u_seed));
          float veil=smoothstep(0.47,0.92,cloud)*0.24;
          color+=mix(u_accent*0.10,u_accent*0.46+u_light*0.05,cloud)*veil;
          alpha+=veil*0.72;

          float g1=galaxy(uv,vec2(0.13,0.73),3.0,time*0.052,aspect);
          float g2=galaxy(uv,vec2(0.88,0.59),3.0,-time*0.045,aspect);
          float g3=galaxy(uv,vec2(0.19,0.39),4.0,-time*0.037,aspect)*0.72;
          color+=u_accent*g1*0.61+mix(u_accent,u_light,0.22)*g2*0.52;
          color+=mix(u_accent,u_gold,0.18)*g3*0.46;
          color+=u_gold*(g1+g2+g3)*0.16;
          alpha+=(g1+g2+g3)*0.48;

          vec2 starGrid=uv*vec2(82.0*aspect,82.0);
          vec2 starId=floor(starGrid);
          vec2 starCell=fract(starGrid);
          float random=hash21(starId+vec2(u_seed));
          vec2 starPoint=vec2(hash21(starId+vec2(2.7)),hash21(starId+vec2(8.4)));
          float star=(1.0-smoothstep(0.0,0.055,length(starCell-starPoint)))*step(0.968,random);
          float twinkle=0.52+0.48*sin(time*(1.1+random*2.2)+random*31.0);
          star*=twinkle;
          color+=mix(u_light,u_gold,step(0.993,random))*star*1.65;
          alpha+=star;

          vec2 axis=u_card-u_orb;
          float axisLength=max(length(axis),0.001);
          vec2 direction=axis/axisLength;
          vec2 normal=vec2(-direction.y,direction.x);
          float along=dot(uv-u_orb,direction)/axisLength;
          float flameT=clamp(along,0.0,1.0);
          float taper=sin(flameT*3.14159265);
          float seedDrift=u_seed*0.17;
          float slowWarp=fbm(vec2(flameT*6.8-time*0.58,seedDrift+time*0.09))-0.5;
          float fastWarp=ridge(vec2(flameT*17.5+time*0.42,seedDrift-time*0.16))-0.5;
          float sway=(sin(flameT*7.15-time*1.34)+0.42*sin(flameT*15.4+time*1.07))*0.052*taper;
          sway+=(slowWarp*0.048+fastWarp*0.019)*taper;
          vec2 center=mix(u_orb,u_card,flameT)+normal*sway;
          float across=dot(uv-center,normal);
          float distanceToFlame=abs(across);
          float segment=smoothstep(-0.025,0.045,along)*(1.0-smoothstep(0.955,1.045,along));
          float edgeNoise=fbm(vec2(flameT*21.0-time*1.62,across*42.0+time*0.31+seedDrift));
          float emberNoise=ridge(vec2(flameT*38.0-time*2.05,across*76.0-time*0.27+u_seed));
          float breath=0.86+0.14*sin(time*2.27+flameT*12.0);
          float width=(0.032+0.017*(1.0-flameT))*breath*(0.9+0.10*u_energy);
          width*=0.78+edgeNoise*0.48;
          float outer=exp(-pow(distanceToFlame/max(width*1.82,0.001),1.32))*segment;
          float body=exp(-pow(distanceToFlame/max(width*0.72,0.001),1.18))*segment*(0.54+0.46*edgeNoise);
          float core=exp(-pow(distanceToFlame/max(width*0.17,0.001),1.08))*segment*(0.34+0.66*emberNoise);
          float brokenGlow=(0.58+0.42*ridge(vec2(flameT*27.0-time*2.6,across*48.0+time*0.22)));

          for(int strand=0;strand<5;strand++){
            float fi=float(strand);
            float strandNoise=noise2(vec2(flameT*(23.0+fi*1.7)+fi*7.9,time*(0.82+fi*0.07)+u_seed));
            float strandWave=sin(flameT*(14.0+fi*2.15)-time*(1.72+fi*0.12)+fi*1.83);
            float strandOffset=(strandWave*(0.009+fi*0.0018)+(strandNoise-0.5)*0.025)*taper;
            float strandDistance=abs(across-strandOffset);
            float filament=exp(-strandDistance*(170.0+fi*18.0))*segment;
            filament*=0.38+0.62*ridge(vec2(flameT*(31.0+fi),time*1.55+fi*4.7));
            vec3 strandColor=mix(u_accent,u_gold,fract(fi*0.43+flameT*0.38));
            color+=strandColor*filament*(0.54+u_energy*0.20);
            alpha+=filament*0.34;
          }

          for(int tongue=0;tongue<4;tongue++){
            float ti=float(tongue);
            float origin=0.16+ti*0.215;
            float locality=exp(-abs(flameT-origin)*11.5);
            float tongueWave=sin(time*(2.15+ti*0.19)+ti*2.4)*0.042*taper;
            float tongueDistance=abs(across-tongueWave);
            float tongueFire=exp(-tongueDistance*(118.0+ti*10.0))*locality*segment;
            color+=mix(mix(u_accent,u_light,0.24),u_gold,fract(ti*0.61))*tongueFire*0.82;
            alpha+=tongueFire*0.27;
          }

          color+=u_accent*outer*(0.62+u_energy*0.18)*brokenGlow;
          color+=mix(u_accent,u_light,0.20)*body*(0.82+u_energy*0.24);
          color+=u_gold*body*(0.38+edgeNoise*0.48);
          color+=mix(u_gold,u_light,0.58)*core*(0.72+u_energy*0.22);
          alpha+=outer*0.46+body*0.45+core*0.27;

          float orbDistance=length((uv-u_orb)*vec2(aspect,1.0));
          float cardDistance=length((uv-u_card)*vec2(aspect,1.0));
          float orbHalo=exp(-orbDistance*10.0)*(0.54+0.17*sin(time*1.8));
          float crown=exp(-cardDistance*18.0)*(0.58+0.42*u_energy);
          color+=u_accent*orbHalo*0.88;
          color+=u_gold*orbHalo*0.31;
          color+=mix(u_accent,u_gold,0.66)*crown*0.74;
          color+=u_light*crown*0.34;
          alpha+=orbHalo*0.54+crown*0.55;

          float touchDistance=length((uv-u_touch)*vec2(aspect,1.0));
          float touchBurst=exp(-touchDistance*28.0)*u_touchPower;
          float touchRing=exp(-abs(touchDistance-(0.035+0.06*(1.0-u_touchPower)))*120.0)*u_touchPower;
          color+=u_light*(touchBurst+touchRing)*1.4;
          color+=u_accent*touchRing*0.9;
          alpha+=touchBurst+touchRing;

          color=1.0-exp(-color);
          gl_FragColor=vec4(color,clamp(alpha,0.0,0.96));
        }
      `;

      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const reason = gl.getShaderInfoLog(shader) || 'shader-compile-failed';
          gl.deleteShader(shader);
          throw new Error(reason);
        }
        return shader;
      };

      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'program-link-failed');
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
      ]), gl.STATIC_DRAW);

      gl.useProgram(program);
      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      this.gl = gl;
      this.program = program;
      this.buffer = buffer;
      this.uniforms = {
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        orb: gl.getUniformLocation(program, 'u_orb'),
        card: gl.getUniformLocation(program, 'u_card'),
        touch: gl.getUniformLocation(program, 'u_touch'),
        time: gl.getUniformLocation(program, 'u_time'),
        energy: gl.getUniformLocation(program, 'u_energy'),
        touchPower: gl.getUniformLocation(program, 'u_touchPower'),
        seed: gl.getUniformLocation(program, 'u_seed'),
        accent: gl.getUniformLocation(program, 'u_accent'),
        light: gl.getUniformLocation(program, 'u_light'),
        gold: gl.getUniformLocation(program, 'u_gold')
      };
      this.mode = 'webgl';
      this.world.dataset.engine = 'webgl';
      this.cosmos.style.opacity = '1';

      this.cosmos.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        this.useCanvasFallback();
      });
      this.cosmos.addEventListener('webglcontextrestored', () => {
        this.gl = null;
        this.program = null;
        this.initializeRenderer();
        this.resize();
      });
    } catch (error) {
      console.info('[Divina] WebGL cedeu ao modo Canvas.', error);
      this.useCanvasFallback();
    }
  }

  useCanvasFallback() {
    this.mode = 'celestial-fire-canvas';
    this.world.dataset.engine = 'celestial-fire-canvas';
    this.cosmos.style.opacity = '0';
    this.world.dataset.canvasArchitecture = 'lossless-deep-space-plus-volumetric-sprite-field';
  }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.pixelRatio = Math.min(constrained() ? 1 : 1.5, Math.max(1, globalThis.devicePixelRatio || 1));

    const cosmosWidth = this.mode === 'celestial-fire-canvas'
      ? 1
      : Math.max(1, Math.round(this.width * this.pixelRatio * this.renderScale));
    const cosmosHeight = this.mode === 'celestial-fire-canvas'
      ? 1
      : Math.max(1, Math.round(this.height * this.pixelRatio * this.renderScale));
    if (this.cosmos.width !== cosmosWidth || this.cosmos.height !== cosmosHeight) {
      this.cosmos.width = cosmosWidth;
      this.cosmos.height = cosmosHeight;
    }
    this.cosmos.style.width = `${this.width}px`;
    this.cosmos.style.height = `${this.height}px`;

    const effectsRatio = Math.min(this.effectsScale, Math.max(1, globalThis.devicePixelRatio || 1));
    const effectsWidth = Math.max(1, Math.round(this.width * effectsRatio));
    const effectsHeight = Math.max(1, Math.round(this.height * effectsRatio));
    if (this.effects.width !== effectsWidth || this.effects.height !== effectsHeight) {
      this.effects.width = effectsWidth;
      this.effects.height = effectsHeight;
    }
    this.effects.style.width = `${this.width}px`;
    this.effects.style.height = `${this.height}px`;
    this.effectsRatio = effectsRatio;
    this.fx?.setTransform(effectsRatio, 0, 0, effectsRatio, 0, 0);
    this.gl?.viewport(0, 0, cosmosWidth, cosmosHeight);
  }

  elementCenter(element, flipY = false) {
    const cached = this.frameGeometry?.get(element);
    if (cached) return flipY ? { ...cached, y:1 - cached.cssY } : cached;
    const host = this.stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const x = clamp((rect.left + rect.width / 2 - host.left) / Math.max(host.width, 1), 0, 1);
    const y = clamp((rect.top + rect.height / 2 - host.top) / Math.max(host.height, 1), 0, 1);
    const center = { x, y, cssY:y, width:rect.width, height:rect.height };
    this.frameGeometry?.set(element, center);
    return flipY ? { ...center, y:1 - y } : center;
  }

  drawWebGL(timestamp) {
    const gl = this.gl;
    if (!gl || !this.program) return;
    const orb = this.elementCenter(this.orb, true);
    const card = this.elementCenter(this.card, true);
    const time = (timestamp - this.startedAt) / 1000;
    gl.viewport(0, 0, this.cosmos.width, this.cosmos.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.resolution, this.cosmos.width, this.cosmos.height);
    gl.uniform2f(this.uniforms.orb, orb.x, orb.y);
    gl.uniform2f(this.uniforms.card, card.x, card.y);
    gl.uniform2f(this.uniforms.touch, this.touchPoint.x, 1 - this.touchPoint.y);
    gl.uniform1f(this.uniforms.time, time);
    gl.uniform1f(this.uniforms.energy, this.energy);
    gl.uniform1f(this.uniforms.touchPower, this.touchPower);
    gl.uniform1f(this.uniforms.seed, 7.33);
    gl.uniform3f(this.uniforms.accent, this.palette.accent.r / 255, this.palette.accent.g / 255, this.palette.accent.b / 255);
    gl.uniform3f(this.uniforms.light, this.palette.light.r / 255, this.palette.light.g / 255, this.palette.light.b / 255);
    gl.uniform3f(this.uniforms.gold, this.palette.gold.r / 255, this.palette.gold.g / 255, this.palette.gold.b / 255);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawFallbackCosmos(context, timestamp) {
    const time = timestamp / 1000;
    const orb = this.elementCenter(this.orb);
    const card = this.elementCenter(this.card);
    const ox = orb.x * this.width;
    const oy = orb.cssY * this.height;
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;

    const field = context.createRadialGradient(this.width * 0.5, this.height * 0.48, 0, this.width * 0.5, this.height * 0.48, Math.max(this.width, this.height) * 0.68);
    field.addColorStop(0, 'rgba(137,30,211,.29)');
    field.addColorStop(0.42, 'rgba(67,10,111,.17)');
    field.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = field;
    context.fillRect(0, 0, this.width, this.height);

    const drawNebula = (x, y, radius, color, hot) => {
      const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
      cloud.addColorStop(0, hot);
      cloud.addColorStop(0.24, color);
      cloud.addColorStop(0.62, color.replace(/\.(\d+)\)/, '.06)'));
      cloud.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = cloud;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };
    const nebulaDrift = Math.sin(time * 0.09) * 9;
    drawNebula(
      this.width * 0.18 + nebulaDrift,
      this.height * 0.58,
      clamp(this.width * 0.31, 120, 280),
      'rgba(148,39,237,.14)',
      'rgba(229,69,255,.12)'
    );
    drawNebula(
      this.width * 0.82 - nebulaDrift,
      this.height * 0.34,
      clamp(this.width * 0.28, 116, 250),
      'rgba(111,39,230,.13)',
      'rgba(255,99,194,.09)'
    );
    drawNebula(
      this.width * 0.52,
      this.height * 0.72 + Math.cos(time * 0.08) * 7,
      clamp(this.width * 0.25, 108, 224),
      'rgba(210,44,223,.09)',
      'rgba(255,142,49,.065)'
    );

    const drawGalaxy = (x, y, radius, spin, violet, gold) => {
      context.save();
      context.translate(x, y);
      context.rotate(spin);
      context.globalCompositeOperation = 'lighter';
      const core = context.createRadialGradient(0, 0, 0, 0, 0, radius);
      core.addColorStop(0, 'rgba(255,244,220,.26)');
      core.addColorStop(0.08, gold);
      core.addColorStop(0.34, violet);
      core.addColorStop(1, 'rgba(87,20,170,0)');
      context.fillStyle = core;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.lineCap = 'round';
      context.lineWidth = constrained() ? 1.15 : 1.65;
      context.shadowBlur = constrained() ? 8 : 13;
      context.shadowColor = '#d84cff';
      const arms = constrained() ? 2 : 3;
      for (let arm = 0; arm < arms; arm += 1) {
        context.beginPath();
        for (let step = 0; step <= 26; step += 1) {
          const progress = step / 26;
          const angle = arm * (Math.PI * 2 / arms) + progress * Math.PI * 2.35;
          const distance = radius * (0.07 + progress * 0.82);
          const px = Math.cos(angle) * distance;
          const py = Math.sin(angle) * distance * 0.56;
          if (step === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.globalAlpha = 0.17;
        context.strokeStyle = arm === arms - 1 ? gold : violet;
        context.stroke();
      }
      context.restore();
    };
    drawGalaxy(this.width * 0.13, this.height * 0.31, clamp(this.width * 0.13, 48, 104), time * 0.045, 'rgba(173,48,255,.16)', 'rgba(255,147,58,.10)');
    drawGalaxy(this.width * 0.88, this.height * 0.45, clamp(this.width * 0.12, 46, 96), -time * 0.04, 'rgba(198,45,255,.14)', 'rgba(255,170,73,.09)');
    drawGalaxy(this.width * 0.18, this.height * 0.67, clamp(this.width * 0.09, 38, 76), -time * 0.034, 'rgba(235,58,220,.12)', 'rgba(255,127,55,.075)');

    context.save();
    context.globalCompositeOperation = 'lighter';
    const fieldStarCount = constrained() ? 54 : 82;
    const pseudo = value => {
      const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    };
    for (let index = 0; index < fieldStarCount; index += 1) {
      const x = pseudo(index + 3.17) * this.width;
      const y = pseudo(index * 2.37 + 19.4) * this.height;
      const twinkle = 0.34 + 0.66 * (0.5 + 0.5 * Math.sin(time * (0.72 + index % 5 * 0.17) + index * 1.91));
      const radius = index % 13 === 0 ? 1.45 : (index % 5 === 0 ? 0.92 : 0.58);
      context.globalAlpha = 0.18 + twinkle * 0.48;
      context.fillStyle = index % 7 === 0 ? '#ffd591' : (index % 3 === 0 ? '#d783ff' : '#fff3d6');
      context.shadowColor = index % 7 === 0 ? '#ff9e3e' : '#a843ff';
      context.shadowBlur = radius * 7;
      context.beginPath();
      context.arc(x, y, radius * twinkle, 0, Math.PI * 2);
      context.fill();
      if (index % 13 === 0) {
        const ray = 3.2 + twinkle * 3.8;
        context.fillRect(x - 0.55, y - ray, 1.1, ray * 2);
        context.fillRect(x - ray, y - 0.55, ray * 2, 1.1);
      }
    }
    context.restore();

    const amplitude = clamp(this.width * 0.118, 40, 94);
    const ribbonPoint = (progress, braidPhase = 0, braidScale = 0.18) => {
      const eased = progress * progress * (3 - 2 * progress);
      const envelope = Math.sin(Math.PI * progress);
      const mainS = Math.sin(progress * Math.PI * 2.14 - time * 0.78) * amplitude * envelope;
      const braid = Math.sin(progress * Math.PI * 7.6 + time * 1.21 + braidPhase) * amplitude * 0.18 * braidScale * envelope;
      const turbulence = (
        Math.sin(progress * Math.PI * 18.8 - time * 2.17 + braidPhase * 1.7) * amplitude * 0.035 +
        Math.sin(progress * Math.PI * 34.2 + time * 1.54 - braidPhase) * amplitude * 0.018
      ) * envelope * braidScale;
      return {
        x: ox + (cx - ox) * eased + mainS + braid + turbulence,
        y: oy + (cy - oy) * eased
          + Math.cos(progress * Math.PI * 4.35 - time * 0.79 + braidPhase * 0.18) * 7 * envelope
          + Math.sin(progress * Math.PI * 23.2 + time * 1.43 + braidPhase) * 2.8 * envelope * braidScale
      };
    };
    const trace = (phase = 0, braidScale = 0.18) => {
      context.beginPath();
      for (let step = 0; step <= 42; step += 1) {
        const point = ribbonPoint(step / 42, phase, braidScale);
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
    };

    const haloGradient = context.createLinearGradient(ox, oy, cx, cy);
    haloGradient.addColorStop(0, 'rgba(111,32,255,0)');
    haloGradient.addColorStop(0.08, 'rgba(142,39,255,.48)');
    haloGradient.addColorStop(0.42, 'rgba(236,48,240,.72)');
    haloGradient.addColorStop(0.72, 'rgba(255,88,168,.62)');
    haloGradient.addColorStop(0.94, 'rgba(255,166,54,.52)');
    haloGradient.addColorStop(1, 'rgba(255,215,133,0)');

    const bodyGradient = context.createLinearGradient(ox, oy, cx, cy);
    bodyGradient.addColorStop(0, 'rgba(139,41,255,0)');
    bodyGradient.addColorStop(0.07, 'rgba(219,45,255,.82)');
    bodyGradient.addColorStop(0.23, 'rgba(255,82,179,.92)');
    bodyGradient.addColorStop(0.46, 'rgba(255,126,35,.98)');
    bodyGradient.addColorStop(0.62, 'rgba(255,181,67,.98)');
    bodyGradient.addColorStop(0.80, 'rgba(255,76,190,.94)');
    bodyGradient.addColorStop(0.95, 'rgba(255,183,67,.9)');
    bodyGradient.addColorStop(1, 'rgba(255,243,210,0)');

    const hotGradient = context.createLinearGradient(ox, oy, cx, cy);
    hotGradient.addColorStop(0, 'rgba(255,225,185,0)');
    hotGradient.addColorStop(0.09, 'rgba(255,205,133,.72)');
    hotGradient.addColorStop(0.46, 'rgba(255,239,205,.78)');
    hotGradient.addColorStop(0.78, 'rgba(255,177,91,.74)');
    hotGradient.addColorStop(1, 'rgba(255,255,236,0)');

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.strokeStyle = haloGradient;
    context.shadowColor = '#9d2cff';
    context.shadowBlur = constrained() ? 25 : 34;
    context.globalAlpha = 0.18;
    context.lineWidth = constrained() ? 38 : 50;
    trace(0, 0.1);
    context.stroke();

    context.globalCompositeOperation = 'lighter';
    const plasmaCellCount = constrained() ? 10 : 16;
    for (let index = 0; index < plasmaCellCount; index += 1) {
      const progress = (index + 0.45) / plasmaCellCount;
      const phase = -2.6 + (index % 5) * 1.31;
      const point = ribbonPoint(progress, phase, 1.08);
      const next = ribbonPoint(Math.min(1, progress + 0.018), phase, 1.08);
      const flutter = 0.5 + 0.5 * Math.sin(time * (1.44 + index % 4 * 0.13) + index * 2.17);
      const length = (constrained() ? 16 : 21) + (index % 4) * 2.8 + flutter * 6;
      const breadth = (constrained() ? 8 : 11) + (index % 3) * 2.1 + flutter * 3.4;
      const angle = Math.atan2(next.y - point.y, next.x - point.x);
      const colorIndex = index % 5;
      context.save();
      context.translate(point.x, point.y);
      context.rotate(angle + Math.sin(time * 1.2 + index) * 0.24);
      context.scale(length, breadth);
      const plasma = context.createRadialGradient(0, 0, 0, 0, 0, 1);
      if (colorIndex === 0 || colorIndex === 4) {
        plasma.addColorStop(0, `rgba(255,239,190,${0.22 + flutter * 0.15})`);
        plasma.addColorStop(0.26, `rgba(255,151,46,${0.22 + flutter * 0.13})`);
        plasma.addColorStop(0.62, `rgba(255,63,173,${0.1 + flutter * 0.08})`);
      } else if (colorIndex === 1 || colorIndex === 3) {
        plasma.addColorStop(0, `rgba(255,128,226,${0.2 + flutter * 0.14})`);
        plasma.addColorStop(0.34, `rgba(226,48,255,${0.19 + flutter * 0.12})`);
        plasma.addColorStop(0.68, `rgba(117,42,255,${0.08 + flutter * 0.07})`);
      } else {
        plasma.addColorStop(0, `rgba(232,198,255,${0.18 + flutter * 0.13})`);
        plasma.addColorStop(0.34, `rgba(131,55,255,${0.21 + flutter * 0.11})`);
        plasma.addColorStop(0.7, `rgba(255,46,203,${0.07 + flutter * 0.06})`);
      }
      plasma.addColorStop(1, 'rgba(40,0,74,0)');
      context.fillStyle = plasma;
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = bodyGradient;
    context.shadowColor = '#ff38ca';
    context.shadowBlur = constrained() ? 17 : 23;
    context.globalAlpha = 0.54;
    context.lineWidth = constrained() ? 11 : 15;
    trace(0, 0.28);
    context.stroke();

    context.globalCompositeOperation = 'lighter';
    context.strokeStyle = hotGradient;
    context.shadowColor = '#ff9d38';
    context.shadowBlur = constrained() ? 9 : 13;
    context.globalAlpha = 0.31;
    context.lineWidth = constrained() ? 1.15 : 1.65;
    trace(0.34, 0.82);
    context.stroke();

    const strands = [
      { phase: -2.8, glow: '#7d2dff', color: 'rgba(168,68,255,.86)', width: 0.76 },
      { phase: -1.25, glow: '#d23cff', color: 'rgba(225,72,255,.88)', width: 0.92 },
      { phase: 0.18, glow: '#ff42d2', color: 'rgba(255,75,202,.92)', width: 1.05 },
      { phase: 1.58, glow: '#ff7138', color: 'rgba(255,118,63,.94)', width: 0.86 },
      { phase: 2.92, glow: '#ffad3c', color: 'rgba(255,184,72,.94)', width: 0.7 }
    ];
    for (let strandIndex = 0; strandIndex < strands.length; strandIndex += 1) {
      const strand = strands[strandIndex];
      context.shadowColor = strand.glow;
      context.shadowBlur = constrained() ? 10 : 15;
      context.strokeStyle = strand.color;
      context.globalAlpha = 0.63 + (strandIndex % 2) * 0.13;
      context.lineWidth = (constrained() ? 2.1 : 3.2) * strand.width;
      trace(strand.phase, 1);
      context.stroke();

      context.shadowColor = '#fff0bd';
      context.shadowBlur = 6;
      context.strokeStyle = 'rgba(255,238,196,.9)';
      context.globalAlpha = strandIndex > 2 ? 0.42 : 0.24;
      context.lineWidth = constrained() ? 0.55 : 0.82;
      trace(strand.phase, 1);
      context.stroke();
    }

    const tongueCount = constrained() ? 9 : 14;
    for (let index = 0; index < tongueCount; index += 1) {
      const progress = (index + 0.45) / tongueCount;
      const phase = strands[index % strands.length].phase;
      const point = ribbonPoint(progress, phase, 0.82);
      const flicker = Math.sin(time * (2.1 + index % 4 * 0.17) + index * 1.73);
      const reach = (constrained() ? 13 : 19) + (index % 5) * 4.2;
      const side = flicker * (8 + index % 4 * 3.1);
      context.beginPath();
      context.moveTo(point.x, point.y + 2);
      context.quadraticCurveTo(
        point.x - side * 0.42,
        point.y - reach * 0.46,
        point.x + side,
        point.y - reach
      );
      context.globalAlpha = 0.24 + 0.24 * (0.5 + 0.5 * flicker);
      context.lineWidth = constrained() ? 0.9 + index % 3 * 0.4 : 1.2 + index % 3 * 0.58;
      context.strokeStyle = index % 3 === 0
        ? 'rgba(255,178,66,.92)'
        : (index % 3 === 1 ? 'rgba(255,78,211,.84)' : 'rgba(175,67,255,.8)');
      context.shadowColor = index % 3 === 0 ? '#ff9a32' : '#d93cff';
      context.shadowBlur = constrained() ? 9 : 13;
      context.stroke();
    }

    const starCount = constrained() ? 15 : 24;
    context.shadowColor = '#ffe0a2';
    context.shadowBlur = 12;
    context.fillStyle = 'rgba(255,247,218,.92)';
    for (let index = 0; index < starCount; index += 1) {
      const progress = (index / starCount + time * 0.027) % 1;
      const point = ribbonPoint(progress, strands[index % strands.length].phase, 0.72);
      const twinkle = 0.55 + 0.45 * Math.sin(time * 2.4 + index * 2.17);
      const ray = (index % 4 === 0 ? 5.4 : 2.5) * twinkle;
      context.globalAlpha = 0.54 + twinkle * 0.4;
      context.fillRect(point.x - 0.75, point.y - ray, 1.5, ray * 2);
      context.fillRect(point.x - ray, point.y - 0.75, ray * 2, 1.5);
    }
    context.restore();
  }

  firePoint(progress, timestamp, phase = 0, lateral = 0) {
    const orb = this.elementCenter(this.orb);
    const card = this.elementCenter(this.card);
    const time = timestamp / 1000;
    const value = clamp(progress, 0, 1);
    const eased = value * value * (3 - 2 * value);
    const envelope = Math.sin(Math.PI * value);
    const amplitude = clamp(this.width * 0.13, 40, 102);
    const ox = orb.x * this.width;
    const oy = orb.cssY * this.height - orb.height * 0.36;
    const cx = card.x * this.width;
    const cy = card.cssY * this.height + card.height * 0.43;
    const broadTurn = Math.sin(value * Math.PI * 2.06 - time * 0.58 + phase) * amplitude * envelope;
    const livingDrift = Math.sin(value * Math.PI * 5.4 + time * 0.31 - phase * 0.4) * amplitude * 0.08 * envelope;
    return {
      x:ox + (cx - ox) * eased + broadTurn + livingDrift + lateral * envelope,
      y:oy + (cy - oy) * eased
        + Math.cos(value * Math.PI * 3.8 - time * 0.46 + phase * 0.22) * 7.4 * envelope
    };
  }

  drawFlameSprite(context, sprite, x, y, width, height, rotation, alpha) {
    if (!sprite || alpha <= 0 || width <= 0 || height <= 0) return;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = clamp(alpha, 0, 1);
    context.drawImage(sprite, -width / 2, -height / 2, width, height);
    context.restore();
  }

  /* Retired V514 Celestial Fire Volume Field. Every visible part is an overlapping
     flame body or ember sprite; no path is stroked between Orbe and card. */
  drawFireVolumeField(context, timestamp, start = 0, end = 1, intensity = 1, birth = false) {
    const time = timestamp / 1000;
    const span = Math.max(0.018, end - start);
    const awakening = clamp((this.energy - 0.66) / 1.08, 0.16, 1);
    const fieldWidth = clamp(this.width * 0.22, constrained() ? 62 : 72, 126);
    const breath = 0.94 + Math.sin(time * 1.37) * 0.06;
    const activeVolumes = birth
      ? this.fireVolumes.filter((_, index) => index % 2 === 0)
      : this.fireVolumes;

    context.save();
    context.globalCompositeOperation = 'source-over';
    for (const volume of activeVolumes) {
      const flow = birth
        ? volume.progress
        : (volume.progress + time * 0.0075 * volume.drift) % 1;
      const progress = start + flow * span;
      const envelope = 0.36 + Math.sin(Math.PI * progress) * 0.64;
      const lateral = volume.lateral * fieldWidth * 0.27
        + Math.sin(time * volume.drift + volume.phase) * fieldWidth * 0.055;
      const point = this.firePoint(progress, timestamp, volume.phase * 0.025, lateral);
      const width = fieldWidth * volume.size * envelope * breath;
      const height = width * volume.stretch;
      this.drawFlameSprite(
        context,
        this.flameSprites.outer,
        point.x,
        point.y,
        width * 1.24,
        height * 1.16,
        Math.sin(time * 0.21 + volume.phase) * 0.17,
        (0.17 + awakening * 0.055) * intensity
      );
    }

    context.globalCompositeOperation = 'lighter';
    for (let index = 0; index < activeVolumes.length; index += 1) {
      const volume = activeVolumes[index];
      const flow = birth
        ? volume.progress
        : (volume.progress + time * 0.0075 * volume.drift) % 1;
      const progress = start + flow * span;
      const envelope = 0.38 + Math.sin(Math.PI * progress) * 0.62;
      const livingOffset = Math.sin(time * volume.drift + volume.phase) * fieldWidth * 0.06;
      const lateral = volume.lateral * fieldWidth * 0.25 + livingOffset;
      const point = this.firePoint(progress, timestamp, volume.phase * 0.025, lateral);
      const baseWidth = fieldWidth * volume.size * envelope * breath;
      const bodySprite = this.flameSprites[volume.color] || this.flameSprites.accent;
      this.drawFlameSprite(
        context,
        bodySprite,
        point.x,
        point.y,
        baseWidth * 0.84,
        baseWidth * volume.stretch,
        Math.sin(time * 0.29 + volume.phase) * 0.14,
        (0.23 + awakening * 0.07) * intensity
      );

      if (index % 2 === 0) {
        const corePoint = this.firePoint(progress, timestamp, volume.phase * 0.018, lateral * 0.36);
        this.drawFlameSprite(
          context,
          this.flameSprites.hot,
          corePoint.x,
          corePoint.y,
          baseWidth * 0.46,
          baseWidth * volume.stretch * 0.72,
          Math.sin(time * 0.34 + volume.phase) * 0.11,
          (0.17 + awakening * 0.055) * intensity
        );
      }

      if (volume.tongue && (!birth || index % 4 === 0)) {
        const previous = this.firePoint(Math.max(start, progress - 0.012), timestamp, volume.phase * 0.025, lateral);
        const next = this.firePoint(Math.min(end, progress + 0.012), timestamp, volume.phase * 0.025, lateral);
        const tangent = Math.atan2(next.y - previous.y, next.x - previous.x);
        const tongue = volume.color === 'gold'
          ? this.flameSprites.tongueGold
          : this.flameSprites.tongueAccent;
        this.drawFlameSprite(
          context,
          tongue,
          point.x,
          point.y,
          baseWidth * 0.54,
          baseWidth * (1.45 + volume.stretch * 0.36),
          tangent + Math.PI / 2 + volume.lateral * 0.16,
          (0.24 + awakening * 0.08) * intensity
        );
      }
    }
    context.restore();
  }

  drawVolumetricFire(context, timestamp) {
    this.drawFireVolumeField(context, timestamp, 0, 1, 0.98, false);
    const time = timestamp / 1000;
    const travelingStars = constrained() ? 11 : 18;
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = 0; index < travelingStars; index += 1) {
      const progress = (index / travelingStars + time * (0.018 + (index % 4) * 0.002)) % 1;
      const lateral = Math.sin(time * 0.72 + index * 2.17) * clamp(this.width * 0.028, 7, 18);
      const point = this.firePoint(progress, timestamp, index * 0.013, lateral);
      const pulse = 0.38 + 0.62 * Math.sin(time * 2.1 + index * 2.37) ** 2;
      const size = (index % 5 === 0 ? 18 : 10) * (0.66 + pulse * 0.5);
      const sprite = index % 4 === 0
        ? this.particleSprites.gold
        : (index % 3 === 0 ? this.particleSprites.accent : this.particleSprites.white);
      context.globalAlpha = 0.42 + pulse * 0.46;
      if (sprite) context.drawImage(sprite, point.x - size / 2, point.y - size / 2, size, size);
    }
    context.restore();
  }

  drawLivingStars(context, timestamp) {
    const time = timestamp / 1000;
    const palette = this.palette;
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.shadowBlur = constrained() ? 3 : 5;
    for (const star of this.livingStars) {
      const pulse = 0.16 + 0.84 * Math.sin(time * star.speed + star.phase) ** 2;
      const x = star.x * this.width + Math.sin(time * 0.11 + star.phase) * 1.8;
      const y = star.y * this.height + Math.cos(time * 0.09 + star.phase) * 1.4;
      const radius = star.size * (0.42 + pulse * 0.58);
      context.globalAlpha = 0.16 + pulse * 0.54;
      context.fillStyle = colorCss(star.gold ? palette.gold : palette.hot);
      context.shadowColor = colorCss(star.gold ? palette.ember : palette.accent);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      if (star.size > 1.3 && pulse > 0.54) {
        const ray = 2.4 + pulse * 3.1;
        context.fillRect(x - 0.45, y - ray, 0.9, ray * 2);
        context.fillRect(x - ray, y - 0.45, ray * 2, 0.9);
        const sprite = star.gold ? this.particleSprites.gold : this.particleSprites.accent;
        const spriteSize = 10 + pulse * 7;
        if (sprite) context.drawImage(sprite, x - spriteSize / 2, y - spriteSize / 2, spriteSize, spriteSize);
      }
    }
    context.restore();
  }

  drawStellarFoundation(context, timestamp) {
    const orb = this.elementCenter(this.orb);
    if (!orb.width || !orb.height) return;
    const time = timestamp / 1000;
    const ox = orb.x * this.width;
    const oy = orb.cssY * this.height;
    const power = clamp((this.energy - 0.68) / 1.15, 0.18, 1);
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = 0; index < this.foundationStars.length; index += 1) {
      const star = this.foundationStars[index];
      const lateral = (star.lift * 2 - 1) * orb.width * star.reach;
      const x = ox + lateral + Math.sin(time * 0.42 + star.phase) * 2.2;
      const y = oy + orb.height * (0.37 + Math.abs(lateral / Math.max(orb.width, 1)) * 0.22)
        + Math.sin(time * 0.73 + star.phase) * (3 + star.reach * 2.2);
      const pulse = 0.28 + 0.72 * Math.sin(time * (0.82 + index % 4 * 0.13) + star.phase) ** 2;
      const ray = star.size * (0.8 + pulse * 1.8);
      context.globalAlpha = (0.22 + pulse * 0.66) * power;
      context.fillStyle = colorCss(index % 4 === 0 ? this.palette.gold : (index % 3 === 0 ? this.palette.accent : this.palette.hot));
      context.shadowColor = colorCss(index % 4 === 0 ? this.palette.ember : this.palette.accent);
      context.shadowBlur = 5 + pulse * 5;
      context.fillRect(x - 0.5, y - ray, 1, ray * 2);
      context.fillRect(x - ray, y - 0.5, ray * 2, 1);
    }
    context.restore();
  }

  drawBirthWave(context, timestamp) {
    if (!this.birthStartedAt || !this.birthDuration) return;
    const progress = clamp((timestamp - this.birthStartedAt) / this.birthDuration, 0, 1);
    if (progress >= 1) {
      this.birthStartedAt = 0;
      return;
    }
    const eased = progress * progress * (3 - 2 * progress);
    const palette = this.palette;
    const card = this.elementCenter(this.card);
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;
    const head = this.firePoint(eased, timestamp);
    const x = head.x;
    const y = head.y;
    const pulse = (1 - progress) * this.birthStrength;
    const radius = 22 + pulse * 26;
    const tailStart = Math.max(0, eased - 0.36);

    this.drawFireVolumeField(context, timestamp, tailStart, eased, 1.34 + pulse * 0.12, true);

    const emissionCount = reducedMotion() ? 0 : (constrained() ? 1 : 2);
    const emissionBudget = constrained() ? 120 : 210;
    for (let index = 0; index < emissionCount && this.sparks.length < emissionBudget; index += 1) {
      const hueRoll = Math.random();
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * 150,
        vy: -58 - Math.random() * 155,
        age: 0,
        life: 0.32 + Math.random() * 0.48,
        radius: 0.62 + Math.random() * 1.42,
        hue: hueRoll < 0.58 ? 'gold' : (hueRoll < 0.82 ? 'white' : 'violet'),
        streak: false
      });
    }

    context.save();
    context.globalCompositeOperation = 'lighter';
    this.drawFlameSprite(context, this.flameSprites.outer, x, y, radius * 3.3, radius * 3.7, 0, 0.72);
    this.drawFlameSprite(context, this.flameSprites.gold, x, y, radius * 2.25, radius * 2.7, 0, 0.8);
    this.drawFlameSprite(context, this.flameSprites.hot, x, y, radius * 1.42, radius * 1.7, 0, 0.92);
    const headStar = this.particleSprites.white;
    if (headStar) {
      const starSize = radius * (1.08 + pulse * 0.22);
      context.globalAlpha = 0.9 - progress * 0.12;
      context.drawImage(headStar, x - starSize / 2, y - starSize / 2, starSize, starSize);
    }

    context.strokeStyle = colorCss(palette.hot, (1 - progress) * 0.72);
    context.lineWidth = 1.5;
    context.shadowBlur = 16;
    context.shadowColor = colorCss(palette.ember);
    context.beginPath();
    context.arc(x, y, radius * (0.78 + progress * 0.78), 0, Math.PI * 2);
    context.stroke();

    if (progress > 0.68) {
      const crown = clamp((progress - 0.68) / 0.32, 0, 1);
      const crownAlpha = Math.sin(crown * Math.PI) * 0.88;
      const crownRadius = 18 + crown * 92;
      context.strokeStyle = colorCss(palette.hot, crownAlpha);
      context.lineWidth = 1.4;
      context.shadowColor = colorCss(palette.gold);
      context.shadowBlur = 13;
      for (let rayIndex = 0; rayIndex < 12; rayIndex += 1) {
        const angle = rayIndex / 12 * Math.PI * 2 + timestamp * 0.00018;
        const inner = crownRadius * (0.38 + (rayIndex % 3) * 0.035);
        const outer = crownRadius * (0.78 + (rayIndex % 4) * 0.08);
        context.beginPath();
        context.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        context.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        context.stroke();
      }
      context.fillStyle = colorCss(palette.hot, crownAlpha);
      context.fillRect(cx - 1.1, cy - crownRadius, 2.2, crownRadius * 2);
      context.fillRect(cx - crownRadius, cy - 1.1, crownRadius * 2, 2.2);
    }
    context.restore();
  }

  drawCardPortal(context, timestamp) {
    const card = this.elementCenter(this.card);
    if (!card.width || !card.height) return;
    const activeBirth = this.birthStartedAt && this.birthDuration
      ? clamp((timestamp - this.birthStartedAt) / this.birthDuration, 0, 1)
      : 1;
    const arrivalWave = activeBirth > 0.68 && activeBirth < 1
      ? Math.sin(((activeBirth - 0.68) / 0.32) * Math.PI)
      : 0;
    const impact = Math.max(this.cardImpact, arrivalWave);
    const idlePulse = 0.5 + 0.5 * Math.sin(timestamp * 0.00145);
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;
    const baseWidth = card.width;
    const baseHeight = card.height;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.lineJoin = 'round';
    for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
      const expansion = ringIndex * 9 + impact * (8 + ringIndex * 7);
      const x = cx - baseWidth / 2 - expansion;
      const y = cy - baseHeight / 2 - expansion;
      const width = baseWidth + expansion * 2;
      const height = baseHeight + expansion * 2;
      const alpha = (0.035 + idlePulse * 0.018) / (ringIndex + 1) + impact * (0.42 - ringIndex * 0.1);
      const edgeColor = ringIndex === 0
        ? this.palette.hot
        : (ringIndex === 1 ? this.palette.accent : this.palette.gold);
      context.strokeStyle = colorCss(edgeColor, alpha);
      context.lineWidth = ringIndex === 0 ? 1.45 + impact * 1.1 : 0.8;
      context.shadowColor = colorCss(ringIndex === 0 ? this.palette.gold : this.palette.accent);
      context.shadowBlur = 8 + impact * 22;
      roundedRect(context, x, y, width, height, 14 + expansion * 0.22);
      context.stroke();
    }

    if (impact > 0.08) {
      const rayAlpha = clamp(impact, 0, 1) * 0.78;
      const vertical = baseHeight * (0.58 + impact * 0.34);
      const horizontal = baseWidth * (0.68 + impact * 0.32);
      context.strokeStyle = colorCss(this.palette.hot, rayAlpha);
      context.lineWidth = 1.2;
      context.shadowColor = colorCss(this.palette.gold);
      context.shadowBlur = 14;
      context.beginPath();
      context.moveTo(cx, cy - vertical);
      context.lineTo(cx, cy + vertical);
      context.moveTo(cx - horizontal, cy);
      context.lineTo(cx + horizontal, cy);
      context.stroke();
    }
    context.restore();
  }

  spawnAmbient(timestamp) {
    const budget = constrained() ? 72 : 128;
    if (this.sparks.length >= budget) return;
    const frequency = reducedMotion() ? 0.06 : (constrained() ? 0.2 : 0.34);
    if (Math.random() > frequency) return;
    const mix = Math.random();
    const point = this.firePoint(mix, timestamp, 0, (Math.random() - 0.5) * 30);
    const hueRoll = Math.random();
    this.sparks.push({
      x:point.x,
      y:point.y,
      vx: (Math.random() - 0.5) * 20,
      vy: -14 - Math.random() * 28,
      age: 0,
      life: 0.62 + Math.random() * 0.72,
      radius: 0.42 + Math.random() * 1.08,
      hue: hueRoll < 0.58 ? 'gold' : (hueRoll < 0.94 ? 'violet' : 'white'),
      streak: false
    });
  }

  drawSparks(context, deltaSeconds) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = this.sparks.length - 1; index >= 0; index -= 1) {
      const spark = this.sparks[index];
      spark.age += deltaSeconds;
      if (spark.age >= spark.life) {
        this.sparks.splice(index, 1);
        continue;
      }
      spark.x += spark.vx * deltaSeconds;
      spark.y += spark.vy * deltaSeconds;
      spark.vx *= 0.986;
      spark.vy -= 5 * deltaSeconds;
      const alpha = 1 - spark.age / spark.life;
      const radius = spark.radius * (0.55 + alpha);
      const spriteKey = spark.hue === 'violet' ? 'accent' : spark.hue;
      const sprite = this.particleSprites[spriteKey] || this.particleSprites.white;
      const color = spark.hue === 'violet'
        ? colorCss(this.palette.hot)
        : (spark.hue === 'white' ? colorCss({ r:255, g:253, b:242 }) : colorCss(this.palette.gold));
      context.shadowColor = colorCss(spark.hue === 'violet' ? this.palette.accent : this.palette.ember);
      context.shadowBlur = constrained() ? 2 : 3;
      if (spark.streak) {
        context.globalAlpha = alpha * 0.82;
        context.beginPath();
        context.moveTo(
          spark.x - spark.vx * 0.026,
          spark.y - spark.vy * 0.018
        );
        context.lineTo(spark.x, spark.y);
        context.strokeStyle = color;
        context.lineWidth = clamp(radius * 0.38, 0.45, 1.25);
        context.stroke();
      }
      context.globalAlpha = alpha * 0.92;
      const spriteSize = clamp(radius * 7.2, 5, 22);
      if (sprite) {
        context.drawImage(sprite, spark.x - spriteSize / 2, spark.y - spriteSize / 2, spriteSize, spriteSize);
      } else {
        context.fillStyle = color;
        context.beginPath();
        context.arc(spark.x, spark.y, Math.max(0.45, radius), 0, Math.PI * 2);
        context.fill();
      }
      if (spark.hue === 'white' && alpha > 0.42) {
        const ray = 1.6 + radius * 1.7;
        context.fillRect(spark.x - 0.4, spark.y - ray, 0.8, ray * 2);
        context.fillRect(spark.x - ray, spark.y - 0.4, ray * 2, 0.8);
      }
    }
    context.restore();
  }

  drawOverlay(timestamp, deltaSeconds) {
    const context = this.fx;
    if (!context) return;
    context.setTransform(this.effectsRatio || 1, 0, 0, this.effectsRatio || 1, 0, 0);
    context.clearRect(0, 0, this.width, this.height);
    this.drawLivingStars(context, timestamp);
    this.drawVolumetricFire(context, timestamp);
    // As únicas formas semelhantes a cartas são a carta central e as cartas
    // realmente reveladas. O restante do quadro é universo vivo.
    this.drawStellarFoundation(context, timestamp);
    this.drawCardPortal(context, timestamp);
    this.drawBirthWave(context, timestamp);
    this.spawnAmbient(timestamp);
    this.drawSparks(context, deltaSeconds);
  }

  adapt(deltaMilliseconds) {
    if (reducedMotion() || constrained() || (this.renderScale <= 0.5 && this.effectsScale <= 1.08)) return;
    if (deltaMilliseconds > 27) this.slowFrames += 1;
    else this.slowFrames = Math.max(0, this.slowFrames - 1);
    if (this.slowFrames < 42) return;
    this.slowFrames = 0;
    this.renderScale = Math.max(0.5, this.renderScale * 0.86);
    this.effectsScale = Math.max(1.08, this.effectsScale * 0.9);
    this.resize();
    this.world.dataset.adaptiveQuality = 'retina-fluid-protected';
  }

  frame(timestamp) {
    if (this.destroyed || !this.visible) return;
    const interval = 1000 / this.targetFps;
    if (timestamp - this.lastDraw >= interval) {
      const delta = this.lastFrame ? Math.min(80, timestamp - this.lastFrame) : interval;
      this.lastFrame = timestamp;
      this.lastDraw = timestamp;
      this.energy += (0.82 - this.energy) * Math.min(1, delta * 0.0021);
      this.touchPower *= Math.pow(0.86, delta / 16.67);
      this.cardImpact *= Math.pow(0.91, delta / 16.67);
      this.frameGeometry.clear();
      if (this.birthBurstPending && timestamp >= this.birthBurstAt) {
        this.birthBurstPending = false;
        this.spawnCardBurst(this.birthStrength);
        this.cardImpact = Math.max(this.cardImpact, 0.94);
      }
      if (this.mode === 'webgl') this.drawWebGL(timestamp);
      this.drawOverlay(timestamp, delta / 1000);
      this.frameGeometry.clear();
      this.adapt(delta);
    }
    this.raf = requestAnimationFrame(next => this.frame(next));
  }

  start() {
    if (this.destroyed || !this.visible || this.raf) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(timestamp => this.frame(timestamp));
  }

  pause() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  setActive(active) {
    this.routeActive = Boolean(active);
    this.visible = this.routeActive && !document.hidden;
    if (this.visible) {
      this.resize();
      this.start();
    } else {
      this.pause();
    }
  }

  absorb(strength = 0.5) {
    if (!this.routeActive) return;
    const orb = this.elementCenter(this.orb);
    this.touchPoint = { x:orb.x, y:orb.cssY };
    this.touchPower = Math.max(this.touchPower, 0.32 + strength * 0.36);
    this.energy = Math.max(this.energy, 1.05 + strength * 0.62);
    this.start();
  }

  touch(clientX, clientY, strength = 1) {
    const rect = this.stage.getBoundingClientRect();
    this.touchPoint = {
      x: clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
      y: clamp((clientY - rect.top) / Math.max(rect.height, 1), 0, 1)
    };
    this.touchPower = Math.max(this.touchPower, strength);
    this.energy = Math.max(this.energy, 1.18 + strength * 0.52);
    this.start();
  }

  ignite(strength = 1) {
    const orb = this.elementCenter(this.orb);
    const count = reducedMotion() ? 8 : (constrained() ? 22 : 42);
    this.energy = Math.max(this.energy, 1.45 + strength * 0.38);
    this.touchPoint = { x: orb.x, y: orb.cssY };
    this.touchPower = 1;

    for (let index = 0; index < count; index += 1) {
      const progress = Math.random();
      const hot = index < count * 0.62;
      const point = this.firePoint(progress, performance.now(), 0, (Math.random() - 0.5) * 28);
      const hueRoll = Math.random();
      this.sparks.push({
        x:point.x,
        y:point.y,
        vx: (Math.random() - 0.5) * (hot ? 185 : 90),
        vy: -45 - Math.random() * (hot ? 230 : 120),
        age: 0,
        life: 0.42 + Math.random() * 0.7,
        radius: (hot ? 0.72 : 0.45) + Math.random() * (hot ? 1.18 : 0.78),
        hue: hueRoll < 0.64 ? 'gold' : (hueRoll < 0.91 ? 'violet' : 'white'),
        streak: false
      });
    }
    const budget = constrained() ? 130 : 220;
    if (this.sparks.length > budget) this.sparks.splice(0, this.sparks.length - budget);
    this.start();
  }

  spawnCardBurst(strength = 1) {
    if (reducedMotion()) return;
    const card = this.elementCenter(this.card);
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;
    const halfWidth = Math.max(24, card.width * 0.51);
    const halfHeight = Math.max(36, card.height * 0.51);
    const count = constrained() ? 32 : 62;

    for (let index = 0; index < count; index += 1) {
      const side = index % 4;
      const offset = Math.random() * 2 - 1;
      let x = cx;
      let y = cy;
      let normalX = 0;
      let normalY = 0;
      if (side === 0 || side === 2) {
        x += offset * halfWidth;
        y += (side === 0 ? -1 : 1) * halfHeight;
        normalY = side === 0 ? -1 : 1;
      } else {
        x += (side === 1 ? 1 : -1) * halfWidth;
        y += offset * halfHeight;
        normalX = side === 1 ? 1 : -1;
      }
      const speed = (46 + Math.random() * 142) * clamp(strength, 0.72, 1.7);
      const hueRoll = Math.random();
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: normalX * speed + (Math.random() - 0.5) * 76,
        vy: normalY * speed - 24 - Math.random() * 88,
        age: 0,
        life: 0.46 + Math.random() * 0.7,
        radius: 0.55 + Math.random() * 1.28,
        hue: hueRoll < 0.52 ? 'gold' : (hueRoll < 0.78 ? 'violet' : 'white'),
        streak: false
      });
    }
    const budget = constrained() ? 150 : 248;
    if (this.sparks.length > budget) this.sparks.splice(0, this.sparks.length - budget);
  }

  birth(strength = 1, duration = BIRTH_TRAVEL_MS) {
    this.birthStartedAt = performance.now();
    this.birthDuration = reducedMotion() ? 150 : Math.max(520, Number(duration) || BIRTH_TRAVEL_MS);
    this.birthStrength = clamp(strength, 0.7, 1.8);
    this.birthBurstAt = this.birthStartedAt + this.birthDuration * 0.86;
    this.birthBurstPending = !reducedMotion();
    this.energy = Math.max(this.energy, 1.5 + strength * 0.34);
    this.cardImpact = reducedMotion() ? 0.18 : 0.08;
    if (reducedMotion()) this.spawnCardBurst(strength);
    this.start();
  }

  destroy() {
    this.destroyed = true;
    this.pause();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.paletteObserver?.disconnect();
    this.skinEventTypes?.forEach(type => document.removeEventListener(type, this.onSkinChange));
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (!this.resizeObserver) removeEventListener('resize', this.onResize);
    this.sparks.length = 0;
    this.birthBurstPending = false;
    if (this.gl) {
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }
  }
}

/* A V515 usa exclusivamente o quadro universal. Este adaptador preserva o
   contrato de interação do Tarot sem iniciar um segundo requestAnimationFrame
   ou fabricar outra Orbe. */
class UniversalUniverseBridgeV515 {
  constructor({ stage, orb, card }) {
    this.stage = stage;
    this.orb = orb;
    this.card = card;
    this.universe = globalThis.divinaLivingUniverseV515 || null;
    this.mode = 'universal-procedural-v515';
    this.targetFps = this.universe?.targetFps || (constrained() ? 40 : 60);
    this.active = false;
    this.arrivalTimer = 0;
    this.foundationStars = null;
    this.fireVolumes = null;
    this.flameSprites = null;
  }

  normalizedPoint(element, clientX, clientY) {
    if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
      return {
        x:clamp(clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(clientY / Math.max(innerHeight, 1), 0, 1)
      };
    }
    const rect = element?.getBoundingClientRect?.();
    return {
      x:clamp(((rect?.left || 0) + (rect?.width || 0) / 2) / Math.max(innerWidth, 1), 0, 1),
      y:clamp(((rect?.top || 0) + (rect?.height || 0) / 2) / Math.max(innerHeight, 1), 0, 1)
    };
  }

  pulseAt(element, strength = 0.7) {
    const point = this.normalizedPoint(element);
    this.universe?.ignite?.({ ...point, strength });
  }

  touch(clientX, clientY, strength = 0.7) {
    const point = this.normalizedPoint(this.orb, clientX, clientY);
    this.universe?.ignite?.({ ...point, strength });
  }

  ignite(strength = 0.8) {
    this.pulseAt(this.orb, strength);
  }

  absorb(strength = 0.35) {
    this.pulseAt(this.card, strength);
  }

  birth(strength = 1, duration = BIRTH_TRAVEL_MS) {
    clearTimeout(this.arrivalTimer);
    this.pulseAt(this.orb, strength);
    this.arrivalTimer = setTimeout(
      () => this.pulseAt(this.card, Math.max(0.48, strength * 0.72)),
      Math.max(90, Number(duration || BIRTH_TRAVEL_MS) * 0.82)
    );
  }

  setActive(active) {
    this.active = Boolean(active);
    if (this.active) this.universe?.setRoute?.('tarot');
  }

  resize() {}

  destroy() {
    clearTimeout(this.arrivalTimer);
    this.active = false;
  }
}

export class TarotLivreOrbOSV515 {
  constructor(root, {
    storage = store,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null
  } = {}) {
    if (!root) throw new TypeError('O mundo do Tarot Livre não foi encontrado.');
    if (!orbCore?.claim || !orbCore?.orb) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes do Tarot Livre V515.');
    }

    this.root = root;
    this.storage = storage;
    this.orbCore = orbCore;
    this.orb = orbCore.orb;
    this.abort = new AbortController();
    this.coordinator = new TarotSessionCoordinator({ storage, key: STORAGE_KEY });
    this.state = this.coordinator.latest();
    this.selected = this.state.revealed.length ? this.state.revealed.length - 1 : -1;
    this.busy = false;
    this.touchStart = null;
    this.resetArmed = false;
    this.resetTimer = 0;
    this.birthTimer = 0;
    this.cardRenderToken = 0;
    this.claimRelease = null;
    this.active = false;

    this.root.innerHTML = '';
    this.root.dataset.tarotWorld = 'orbe-os-v515';
    this.root.className = this.root.className
      .replace(/\btarot-world-v301-host\b/g, '')
      .trim();

    this.build();
    this.world.dataset.birthSync = 'decoded-atomic';
    this.world.dataset.flameTexture = 'retired-v514';
    this.world.dataset.flameArchitecture = 'scheduled-v516';
    this.world.dataset.lightningStrokes = 'none';
    this.world.dataset.birthCorona = 'card-edge';
    this.world.dataset.birthJourney = 'orb-to-card';
    this.world.dataset.birthEasing = 'compositor-v515';
    this.world.dataset.responsiveAltar = 'v515';
    this.world.dataset.visualCalibration = 'universal-living-space';
    this.world.dataset.cardOrigin = 'supreme-orb-v501';
    this.world.dataset.decorativeCards = 'none';
    this.world.dataset.universeBackdrop = 'procedural-no-image-v515';
    this.world.dataset.staticUniverseImage = 'false';
    this.world.dataset.universeAuthority = 'living-universe-core-v515';
    this.world.dataset.skinReactiveUniverse = '30-palettes';
    this.world.dataset.effectsResolution = 'global-adaptive';
    this.world.dataset.frameArchitecture = 'universal-single-raf';
    this.world.dataset.particleArchitecture = 'global-procedural-shader';
    this.render(false);
    this.fire = new UniversalUniverseBridgeV515({
      stage: this.stage,
      orb: this.orb,
      card: this.cardZone
    });
    this.world.dataset.engine = this.fire.mode;
    this.world.dataset.targetFps = String(this.fire.targetFps);
    this.bind();

    if (routeNow() === 'tarot') {
      requestAnimationFrame(() => this.enter());
    } else {
      this.fire.setActive(false);
    }

    preloadCardImages(this.state.waiting.slice(0, 8), 8);

    document.documentElement.dataset.tarotLivre = 'v515';
    const readiness = Object.freeze({
      version: VERSION,
      engine: 'UniversalUniverseBridgeV515',
      renderer: this.fire.mode,
      canonicalOrb: 'v501',
      oneLivingOrb: true,
      deckSize: DECK_SIZE,
      normalOnly: true,
      noRepeats: true,
      gridColumns: 6,
      atomicBirth: true,
      decodedBeforeSwap: true,
      organicCanvasFire: false,
      trueCelestialFire: false,
      celestialFireScheduled:'V516',
      lightningStrokes: false,
      volumetricBillows: false,
      flameTongues: false,
      cardEdgeBurst: true,
      responsiveAltar: true,
      volumetricFire: false,
      cosmicNebula: true,
      livingUniverse: true,
      physicalCardJourney: true,
      stellarFoundation: true,
      optimizedCosmicBackdrop: false,
      staticUniverseImage: false,
      universalUniverseCanvas: true,
      skinReactiveUniverse: true,
      retinaAdaptiveEffects: true,
      spriteAtlasParticles: false,
      smoothBirthJourney: true,
      oneAnimationCadence: true,
      unexplainedFlyingCards: false,
      targetFps: this.fire.targetFps
    });
    document.dispatchEvent(new CustomEvent('divina:tarot-cosmico-ready', {
      detail: readiness
    }));
    document.dispatchEvent(new CustomEvent('divina:tarot-supreme-ready', {
      detail: readiness
    }));
  }

  build() {
    this.root.innerHTML = `
      <div class="tl515" data-phase="idle" data-engine="pending">
        <header class="tl515__header">
          <div class="tl515__title">
            <h2>Tarot Livre</h2>
            <span class="tl515__title-star" aria-hidden="true"><i></i><b></b><i></i></span>
          </div>

          <a class="tl515__mesa" href="#spreads" data-go="spreads" aria-label="Abrir Tiragens e Mesa Real">
            <span aria-hidden="true">✦</span>
            Mesa Real
          </a>

        </header>

        <section class="tl515__stage" data-stage data-universe="alive" aria-label="Tarot Livre — universo vivo nascido da Orbe">
          <div class="tl515__portal-crown" aria-hidden="true"><i></i><i></i><i></i></div>

          <div class="tl515__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas reveladas.">
            <div class="tl515__card" data-current-card data-empty="true">
              <canvas class="tl515__card-back" data-card-back aria-hidden="true"></canvas>
            </div>
          </div>

          <nav class="tl515__card-nav" data-card-nav aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">‹</button>
            <span data-position>0 de 0</span>
            <button type="button" data-next aria-label="Próxima carta">›</button>
          </nav>

          <div class="tl515__orb-host" data-tarot-orb-host>
            <span class="tl515__orb-aura" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="tl515__orb-flare" aria-hidden="true"></span>
          </div>

          <p class="tl515__counter" aria-label="Cartas reveladas">
            <b data-count>0</b><span>/78</span>
          </p>
          <p class="tl515__signal" data-signal aria-live="polite">Toque na Orbe para revelar seu Tarot.</p>
        </section>

        <div class="tl515__toolbar" aria-label="Controles do Tarot Livre">
          <button type="button" data-shuffle>
            <span aria-hidden="true">↻</span>
            Embaralhar
          </button>
          <button type="button" data-reset>
            <span aria-hidden="true">✧</span>
            Novo círculo
          </button>
        </div>

        <section class="tl515__constellation" aria-labelledby="tl515ConstellationTitle">
          <header>
            <div>
              <small>SEU CÍRCULO</small>
              <h3 id="tl515ConstellationTitle">Cartas reveladas</h3>
            </div>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl515__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por fileira" aria-colcount="6"></div>
          <p class="tl515__empty-grid" data-empty-grid>Nenhuma carta foi revelada ainda.</p>
        </section>

        <p class="tl515__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world = this.root.querySelector('.tl515');
    this.stage = this.root.querySelector('[data-stage]');
    this.cosmosCanvas = this.root.querySelector('[data-cosmos]');
    this.effectsCanvas = this.root.querySelector('[data-effects]');
    this.orbHost = this.root.querySelector('[data-tarot-orb-host]');
    this.cardZone = this.root.querySelector('[data-card-zone]');
    this.card = this.root.querySelector('[data-current-card]');
    this.cardBack = this.root.querySelector('[data-card-back]');
    this.cardNav = this.root.querySelector('[data-card-nav]');
    this.signal = this.root.querySelector('[data-signal]');
    this.count = this.root.querySelector('[data-count]');
    this.position = this.root.querySelector('[data-position]');
    this.remaining = this.root.querySelector('[data-remaining]');
    this.grid = this.root.querySelector('[data-grid]');
    this.emptyGrid = this.root.querySelector('[data-empty-grid]');
    this.prev = this.root.querySelector('[data-prev]');
    this.next = this.root.querySelector('[data-next]');
    this.shuffle = this.root.querySelector('[data-shuffle]');
    this.resetButton = this.root.querySelector('[data-reset]');
    this.live = this.root.querySelector('[data-live]');
    drawPortalBack(this.cardBack);
  }

  bind() {
    const options = { signal: this.abort.signal };

    this.orb.addEventListener('pointerdown', event => {
      if (!this.active || !this.orbHost.contains(this.orb)) return;
      this.world.classList.add('is-orb-touching');
      this.fire?.touch(event.clientX, event.clientY, 0.72);
    }, { passive: true, ...options });

    const releaseOrb = () => this.world.classList.remove('is-orb-touching');
    this.orb.addEventListener('pointerup', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('pointercancel', releaseOrb, { passive: true, ...options });
    this.orb.addEventListener('click', () => {
      if (this.active && this.orbHost.contains(this.orb)) this.draw();
    }, options);

    this.prev.addEventListener('click', () => this.move(-1), options);
    this.next.addEventListener('click', () => this.move(1), options);
    this.shuffle.addEventListener('click', () => this.reshuffle(), options);
    this.resetButton.addEventListener('click', () => this.handleResetButton(), options);

    this.cardZone.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.move(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.move(1);
      }
    }, options);

    this.cardZone.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.touchStart = { x: event.clientX, y: event.clientY };
    }, options);
    this.cardZone.addEventListener('pointerup', event => {
      const start = this.touchStart;
      this.touchStart = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      this.move(dx < 0 ? 1 : -1);
    }, options);
    this.cardZone.addEventListener('pointercancel', () => {
      this.touchStart = null;
    }, options);

    this.grid.addEventListener('click', event => {
      if (this.busy) return;
      const button = event.target.closest('[data-index]');
      if (!button) return;
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      this.show(index, true);
      this.stage.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }, options);

    this.onStorage = event => {
      if (!event.key?.endsWith(`:${STORAGE_KEY}`) || !event.newValue) return;
      const latest = this.coordinator.latest();
      if (latest.revision <= this.state.revision && latest.sessionId === this.state.sessionId) return;
      this.state = latest;
      this.selected = Math.min(this.selected, this.state.revealed.length - 1);
      if (this.selected < 0 && this.state.revealed.length) this.selected = this.state.revealed.length - 1;
      this.render(false);
    };
    globalThis.addEventListener?.('storage', this.onStorage, { signal: this.abort.signal });

    document.addEventListener('divina:supreme-orb-pulse', event => {
      if (!this.active) return;
      this.fire?.absorb(Number(event.detail?.intensity || 0.5));
    }, options);

    document.addEventListener('divina:route-ready', event => {
      const route = String(event.detail?.id || routeNow()).replace(/^#/, '').toLowerCase();
      if (route === 'tarot') this.enter();
      else this.leave(route);
    }, options);

    globalThis.addEventListener?.('hashchange', () => {
      const route = routeNow();
      if (route === 'tarot') this.enter();
      else this.leave(route);
    }, { signal: this.abort.signal });

    this.routeObserver = globalThis.MutationObserver && document.body
      ? new MutationObserver(() => {
          const route = routeNow();
          if (route === 'tarot') this.enter();
          else this.leave(route);
        })
      : null;
    this.routeObserver?.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-screen']
    });
  }

  enter() {
    if (this.active && this.orbHost.contains(this.orb)) {
      this.fire?.setActive(true);
      return true;
    }
    this.active = true;
    try {
      this.claimRelease = this.orbCore.claim(this.orbHost, {
        mode: 'tarot',
        ariaLabel: 'Orbe das Realidades. Toque para revelar uma carta.'
      });
    } catch (error) {
      this.active = false;
      console.error('[Divina] A Orbe não alcançou o altar do Tarot.', error);
      return false;
    }
    this.world.dataset.orbClaimed = 'true';
    this.orb.dataset.tarotReveal = 'v515';
    this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    this.fire?.setActive(true);
    requestAnimationFrame(() => {
      this.fire?.resize();
      this.orbCore.pulse?.('tarot-arrival', { intensity: 0.72 });
    });
    return true;
  }

  leave(nextRoute = 'home') {
    this.active = false;
    clearTimeout(this.birthTimer);
    this.world.classList.remove('is-orb-touching', 'is-birthing');
    document.body?.classList.remove('db515-tarot-birthing');
    this.fire?.setActive(false);
    delete this.orb.dataset.tarotReveal;
    this.orb.removeAttribute('aria-disabled');
    if (!this.orbHost.contains(this.orb)) return false;
    try {
      this.claimRelease?.();
    } catch {
      this.orbCore.returnHome?.();
    }
    this.claimRelease = null;
    delete this.world.dataset.orbClaimed;
    this.orbCore.settleRoute?.(nextRoute, 'tarot-leave-v515');
    return true;
  }

  setPhase(phase) {
    this.world.dataset.phase = phase;
    const busy = phase !== 'idle';
    const ritualVisible = phase === 'summoning' || phase === 'revealing' || this.world.classList.contains('is-birthing');
    document.body?.classList.toggle('db515-tarot-birthing', this.active && ritualVisible);
    this.world.setAttribute('aria-busy', String(busy));
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(busy || this.state.completed));
    }
    this.shuffle.disabled = busy || this.state.waiting.length < 2;
    this.resetButton.disabled = busy;
  }

  waitForImage(image, timeout = CARD_READY_TIMEOUT_MS) {
    if (!(image instanceof HTMLImageElement)) return Promise.resolve(true);
    image.loading = 'eager';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'high');

    const decodeLoaded = async () => {
      if (!image.naturalWidth) return false;
      try { await image.decode?.(); } catch {}
      return image.naturalWidth > 0;
    };
    if (image.complete) return decodeLoaded();

    return new Promise(resolve => {
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);
        resolve(value);
      };
      const onLoad = () => decodeLoaded().then(finish);
      const onError = () => finish(false);
      const timer = setTimeout(() => finish(false), timeout);
      image.addEventListener('load', onLoad, { once:true });
      image.addEventListener('error', onError, { once:true });
      if (image.complete) queueMicrotask(onLoad);
    });
  }

  async prepareCardContent(index) {
    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') throw new Error('Carta direta indisponível.');

    // O runtime aquece o atlas enquanto uma árvore conectável é preparada.
    // A árvore atual continua visível até todos os pixels novos decodificarem.
    Promise.resolve(prepareCardImage(card, {
      timeout: CARD_READY_TIMEOUT_MS,
      priority: 'high'
    })).catch(() => false);

    const cradle = document.createElement('div');
    cradle.innerHTML = `${cardImageMarkup(card, {
      alt: `${card.name}, direta`,
      priority: 'high'
    })}<div class="tl515__card-name"><b>${escapeText(card.name)}</b><small>${index + 1} / ${this.state.revealed.length}</small></div>`;
    const images = [...cradle.querySelectorAll('img')];
    const readiness = await Promise.all(images.map(image => this.waitForImage(image)));
    if (readiness.some(value => value !== true)) {
      throw new Error(`A imagem de ${card.name} ainda não terminou de nascer.`);
    }

    const fragment = document.createDocumentFragment();
    while (cradle.firstChild) fragment.append(cradle.firstChild);
    return { card, fragment };
  }

  commitPreparedCard(index, prepared) {
    this.selected = index;
    this.card.replaceChildren(prepared.fragment);
    this.card.dataset.empty = 'false';
    this.card.dataset.imageState = 'decoded';
    this.cardZone.setAttribute(
      'aria-label',
      `${prepared.card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}.`
    );
    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button => {
      const active = Number(button.dataset.index) === index;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    preloadCardImages([this.state.revealed[index - 1], this.state.revealed[index + 1]], 2);
  }

  async transitionTo(index, { onBirth } = {}) {
    const token = ++this.cardRenderToken;
    this.card.dataset.imageState = 'preparing';
    const prepared = await this.prepareCardContent(index);
    if (token !== this.cardRenderToken) return false;
    this.commitPreparedCard(index, prepared);
    const duration = reducedMotion() ? 150 : BIRTH_TRAVEL_MS;
    onBirth?.({ duration });
    if (reducedMotion()) return true;

    const cardRect = this.card.getBoundingClientRect();
    const orbRect = this.orb.getBoundingClientRect();
    const originX = orbRect.left + orbRect.width / 2;
    const originY = orbRect.top + orbRect.height / 2;
    const destinationX = cardRect.left + cardRect.width / 2;
    const destinationY = cardRect.top + cardRect.height / 2;
    const dx = originX - destinationX;
    const dy = originY - destinationY;
    const startScale = clamp((orbRect.width / Math.max(cardRect.width, 1)) * 0.27, 0.16, 0.32);
    const curve = Math.min(34, Math.max(14, cardRect.width * 0.11));

    const veil = document.createElement('canvas');
    veil.className = 'tl515__birth-veil';
    veil.setAttribute('aria-hidden', 'true');
    drawPortalBack(veil);
    this.card.append(veil);
    this.card.dataset.imageState = 'journey';
    this.world.dataset.birthTransit = 'active';
    this.card.getAnimations?.().forEach(animation => animation.cancel());

    const journey = this.card.animate([
      {
        opacity:0.12,
        transform:`translate3d(${dx}px,${dy}px,0) scale(${startScale}) rotateZ(-7deg)`,
        filter:'brightness(1.7) saturate(1.35)'
      },
      {
        opacity:0.9,
        transform:`translate3d(${dx * 0.9 + curve * 0.32}px,${dy * 0.9}px,0) scale(${startScale * 1.28}) rotateZ(-3deg)`,
        filter:'brightness(1.56) saturate(1.34)',
        offset:0.14
      },
      {
        opacity:0.98,
        transform:`translate3d(${dx * 0.62 + curve}px,${dy * 0.62}px,0) scale(.56) rotateZ(3.2deg)`,
        filter:'brightness(1.34) saturate(1.27)',
        offset:0.38
      },
      {
        opacity:1,
        transform:`translate3d(${dx * 0.28 - curve}px,${dy * 0.28}px,0) scale(.82) rotateZ(-2deg)`,
        filter:'brightness(1.18) saturate(1.18)',
        offset:0.68
      },
      {
        opacity:1,
        transform:'translate3d(0,-4px,0) scale(1.025) rotateZ(.4deg)',
        filter:'brightness(1.08) saturate(1.08)',
        offset:0.9
      },
      {
        opacity:1,
        transform:'translate3d(0,0,0) scale(1) rotateZ(0deg)',
        filter:'brightness(1) saturate(1)'
      }
    ], {
      duration,
      easing:'cubic-bezier(.16,.82,.18,1)',
      fill:'both'
    });
    const unveiling = veil.animate([
      { opacity:1, transform:'perspective(700px) rotateY(0deg) scale(1)' },
      { opacity:1, transform:'perspective(700px) rotateY(0deg) scale(1)', offset:0.68 },
      { opacity:0.78, transform:'perspective(700px) rotateY(72deg) scale(.99)', offset:0.86 },
      { opacity:0, transform:'perspective(700px) rotateY(94deg) scale(.98)' }
    ], { duration, easing:'cubic-bezier(.16,.82,.18,1)', fill:'both' });

    await Promise.allSettled([journey.finished, unveiling.finished]);
    veil.remove();
    this.card.dataset.imageState = 'decoded';
    delete this.world.dataset.birthTransit;
    return true;
  }

  async draw() {
    if (!this.active || this.busy || this.state.completed) return null;
    this.busy = true;
    this.setPhase('summoning');
    this.signal.textContent = 'O universo da Orbe encontra uma carta…';
    this.fire?.ignite(0.7);
    this.orbCore.pulse?.('tarot-summon', { intensity: 0.88 });
    nativePulse('Medium');

    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest));
      this.state = result.state;
      if (result.cardId === null) return null;

      const card = CARDS[result.cardId];

      this.setPhase('revealing');
      this.signal.textContent = 'A carta nasce do núcleo vivo…';
      const born = await this.transitionTo(result.position, { onBirth: ({ duration }) => {
        this.count.textContent = String(this.state.revealed.length);
        this.remaining.textContent = this.state.completed
          ? 'Círculo completo'
          : `${this.state.waiting.length} aguardam`;
        this.renderGrid();
        this.world.classList.add('is-birthing');
        this.fire?.birth(1.04, duration);
        this.orbCore.pulse?.('tarot-birth', { intensity: 1.04 });
        clearTimeout(this.birthTimer);
        this.birthTimer = setTimeout(() => {
          this.world?.classList.remove('is-birthing');
          if (this.world?.dataset.phase === 'idle') {
            document.body?.classList.remove('db515-tarot-birthing');
          }
        }, reducedMotion() ? 120 : duration + 120);
      }});
      if (!born) throw new Error('O nascimento visual foi substituído por uma atualização mais recente.');
      if (reducedMotion()) await wait(45);
      else await wait(48);

      this.signal.textContent = this.state.completed
        ? 'O círculo das 78 cartas está completo.'
        : `${card?.name || 'Carta'} nasceu da Orbe.`;
      this.live.textContent = `${card?.name || 'Carta'}, direta. ${result.position + 1} de 78.`;
      nativePulse('Light');

      globalThis.dispatchEvent?.(new CustomEvent('tarot:rebirth-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          engine: 'universal-procedural-v515'
        }
      }));
      globalThis.dispatchEvent?.(new CustomEvent('tarot:cosmic-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          version: VERSION
        }
      }));
      globalThis.dispatchEvent?.(new CustomEvent('tarot:supreme-revealed', {
        detail: {
          cardId: result.cardId,
          position: result.position,
          remaining: this.state.waiting.length,
          canonicalOrb: 'v501',
          version: VERSION
        }
      }));

      preloadCardImages(this.state.waiting.slice(0, 8), 8);
      return result.cardId;
    } catch (error) {
      console.error('[Divina] A revelação foi preservada após uma interrupção.', error);
      this.state = this.coordinator.latest();
      this.selected = this.state.revealed.length - 1;
      this.render(false);
      this.signal.textContent = 'O círculo foi preservado. Toque novamente.';
      announce('Nenhuma carta foi perdida. A Orbe está pronta novamente.');
      return null;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  async show(index, animate = false, direction = 0) {
    if (!Number.isInteger(index) || index < 0 || index >= this.state.revealed.length) return false;
    const token = ++this.cardRenderToken;
    this.card.dataset.imageState = 'preparing';
    try {
      const prepared = await this.prepareCardContent(index);
      if (token !== this.cardRenderToken) return false;
      this.commitPreparedCard(index, prepared);
      if (animate && !reducedMotion()) {
        const offset = direction ? Math.sign(direction) * 28 : 0;
        const movement = this.card.animate([
          { opacity: 0.42, transform: `translate3d(${offset}px,10px,0) scale(.94)`, filter: 'blur(4px) saturate(1.16)' },
          { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) saturate(1)' }
        ], { duration: HISTORY_TRANSITION_MS, easing: 'cubic-bezier(.16,.82,.18,1)' });
        await movement.finished.catch(() => {});
      }
      this.fire?.absorb(0.22);
      return true;
    } catch (error) {
      if (token === this.cardRenderToken) this.card.dataset.imageState = 'preserved';
      console.info('[Divina] A carta anterior ficou visível enquanto a próxima carrega.', error);
      return false;
    }
  }

  async move(direction) {
    if (this.busy || !this.state.revealed.length) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;
    this.busy = true;
    this.updateControls();
    try { return await this.show(next, true, direction); }
    finally {
      this.busy = false;
      this.updateControls();
    }
  }

  async reshuffle() {
    if (this.busy || this.state.waiting.length < 2) return false;
    const revealedSignature = this.state.revealed.join(',');
    this.busy = true;
    this.setPhase('shuffling');
    this.signal.textContent = 'O universo reorganiza apenas as cartas ocultas…';
    this.fire?.ignite(0.92);
    this.orbCore.pulse?.('tarot-shuffle', { intensity: 0.86 });

    try {
      this.state = await this.coordinator.commit(latest => shuffleRemainingCards(latest));
      if (this.state.revealed.join(',') !== revealedSignature) {
        throw new Error('As cartas reveladas mudaram durante o embaralhamento.');
      }
      this.render(false);
      this.signal.textContent = 'As cartas ocultas foram embaralhadas.';
      preloadCardImages([
        this.state.waiting[0],
        this.state.waiting[1],
        this.state.waiting[2]
      ], 3);
      announce('Cartas ocultas embaralhadas. As reveladas foram preservadas.');
      nativePulse('Light');
      return true;
    } catch (error) {
      console.error('[Divina] O embaralhamento foi interrompido.', error);
      this.state = this.coordinator.latest();
      this.render(false);
      this.signal.textContent = 'O círculo atual foi preservado.';
      announce('Não foi possível embaralhar agora.');
      return false;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  handleResetButton() {
    if (this.busy) return;
    if (!this.state.revealed.length) {
      this.resetNow();
      return;
    }
    if (!this.resetArmed) {
      this.resetArmed = true;
      clearTimeout(this.resetTimer);
      this.resetButton.innerHTML = '<span aria-hidden="true">✦</span> Confirmar novo círculo';
      this.resetButton.classList.add('is-armed');
      this.signal.textContent = 'Toque novamente para abrir um círculo novo.';
      this.resetTimer = setTimeout(() => this.disarmReset(), RESET_ARM_MS);
      return;
    }
    this.resetNow();
  }

  disarmReset() {
    this.resetArmed = false;
    clearTimeout(this.resetTimer);
    this.resetButton.innerHTML = '<span aria-hidden="true">✧</span> Novo círculo';
    this.resetButton.classList.remove('is-armed');
  }

  async resetNow() {
    if (this.busy) return false;
    this.disarmReset();
    this.busy = true;
    this.setPhase('resetting');
    this.signal.textContent = 'A Orbe recolhe o círculo anterior…';
    this.fire?.ignite(1.18);
    this.orbCore.pulse?.('tarot-reset', { intensity: 1.02 });

    try {
      this.state = await this.coordinator.commit(latest => resetTarotState({
        now: () => Math.max(Date.now(), Number(latest.updatedAt || 0) + 2)
      }));
      this.selected = -1;
      this.render(false);
      this.signal.textContent = 'Novo círculo aberto. Toque na Orbe.';
      announce('Novo círculo aberto.');
      nativePulse('Medium');
      return true;
    } catch (error) {
      console.error('[Divina] O novo círculo não pôde ser aberto.', error);
      this.state = this.coordinator.latest();
      this.render(false);
      this.signal.textContent = 'O círculo atual foi preservado.';
      announce('Não foi possível recomeçar agora.');
      return false;
    } finally {
      this.busy = false;
      this.setPhase('idle');
    }
  }

  render(animateCurrent = false) {
    const revealed = this.state.revealed.length;
    this.count.textContent = String(revealed);
    this.remaining.textContent = this.state.completed
      ? 'Círculo completo'
      : `${this.state.waiting.length} aguardam`;
    if (this.state.completed) {
      this.signal.textContent = 'O círculo das 78 cartas está completo.';
    }

    if (!revealed) {
      this.cardRenderToken += 1;
      this.selected = -1;
      this.card.dataset.empty = 'true';
      this.card.dataset.imageState = 'portal';
      this.card.innerHTML = '<canvas class="tl515__card-back" data-card-back aria-hidden="true"></canvas>';
      this.cardBack = this.card.querySelector('[data-card-back]');
      drawPortalBack(this.cardBack);
      this.cardZone.setAttribute('aria-label', 'Nenhuma carta revelada. Toque na Orbe para começar.');
    } else {
      this.selected = clamp(this.selected, 0, revealed - 1);
      this.show(this.selected, animateCurrent);
    }

    this.renderGrid();
    this.updateControls();
  }

  renderGrid() {
    this.grid.innerHTML = this.state.revealed.map((cardId, index) => {
      const card = CARDS[cardId];
      if (!card || card.orientation !== 'normal') return '';
      const current = index === this.selected;
      return `<button type="button" data-index="${index}" role="gridcell" class="${current ? 'is-current' : ''}" aria-current="${current ? 'true' : 'false'}" aria-label="${escapeText(card.name)}, carta ${index + 1}">${cardImageMarkup(card, { alt: '', priority: 'low' })}<span>${index + 1}</span></button>`;
    }).join('');
    this.emptyGrid.hidden = this.state.revealed.length > 0;
  }

  updateControls() {
    const revealed = this.state.revealed.length;
    this.position.textContent = revealed ? `${this.selected + 1} de ${revealed}` : '0 de 0';
    this.cardNav.dataset.visible = String(revealed > 0);
    this.prev.disabled = !revealed || this.selected <= 0 || this.busy;
    this.next.disabled = !revealed || this.selected >= revealed - 1 || this.busy;
    this.shuffle.disabled = this.busy || this.state.waiting.length < 2;
    this.resetButton.disabled = this.busy;
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(this.busy || this.state.completed));
    }
  }

  status() {
    return Object.freeze({
      version: VERSION,
      active: this.active,
      renderer: this.fire?.mode || 'pending',
      canonicalOrb: this.orb?.dataset?.supremeOrbVersion || '501',
      oneLivingOrb: document.querySelectorAll('[data-supreme-orb="living"]').length === 1,
      revealed: this.state.revealed.length,
      remaining: this.state.waiting.length,
      normalOnly: this.state.revealed.every(id => CARDS[id]?.orientation === 'normal'),
      noRepeats: new Set(this.state.revealed).size === this.state.revealed.length,
      gridColumns: 6,
      atomicBirth: this.world.dataset.birthSync === 'decoded-atomic',
      decodedBeforeSwap: this.card.dataset.imageState !== 'blank',
      organicCanvasFire: false,
      trueCelestialFire: false,
      celestialFireScheduled: this.world.dataset.flameArchitecture === 'scheduled-v516',
      lightningStrokes: this.world.dataset.lightningStrokes !== 'none',
      volumetricBillows: false,
      flameTongues: false,
      cardEdgeBurst: this.world.dataset.birthCorona === 'card-edge',
      responsiveAltar: this.world.dataset.responsiveAltar === 'v515',
      volumetricFire: false,
      cosmicNebula: true,
      livingUniverse: this.world.dataset.universeAuthority === 'living-universe-core-v515',
      physicalCardJourney: this.world.dataset.birthJourney === 'orb-to-card',
      stellarFoundation: this.world.dataset.universeAuthority === 'living-universe-core-v515',
      optimizedCosmicBackdrop: false,
      staticUniverseImage: this.world.dataset.staticUniverseImage !== 'false',
      universalUniverseCanvas: this.world.dataset.universeAuthority === 'living-universe-core-v515',
      skinReactiveUniverse: this.world.dataset.skinReactiveUniverse === '30-palettes',
      retinaAdaptiveEffects: this.world.dataset.effectsResolution === 'global-adaptive',
      spriteAtlasParticles: this.world.dataset.particleArchitecture === 'palette-sprite-atlas',
      smoothBirthJourney: this.world.dataset.birthEasing === 'compositor-v515',
      oneAnimationCadence: this.world.dataset.frameArchitecture === 'universal-single-raf',
      unexplainedFlyingCards: this.world.dataset.decorativeCards !== 'none',
      targetFps: this.fire?.targetFps || 0
    });
  }

  destroy() {
    this.leave(routeNow());
    this.abort.abort();
    clearTimeout(this.resetTimer);
    clearTimeout(this.birthTimer);
    this.routeObserver?.disconnect();
    this.fire?.destroy();
    if (globalThis.divinaTarotLivreV515 === this) delete globalThis.divinaTarotLivreV515;
    delete document.documentElement.dataset.tarotLivre;
  }
}
