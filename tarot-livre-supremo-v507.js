/* DIVINA BRUXA — MACROETAPA V507 · CHAMA ESTELAR ORGÂNICA
   A mesma Orbe Suprema V501 deixa a Home, ocupa o altar do Tarot e revela
   cartas por um motor híbrido de plasma vivo. WebGL adaptativo, filamentos,
   fagulhas Canvas e fallback 2D. Regras: 78 diretas, zero repetição e seis por fileira. */

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

const VERSION = 507;
const STORAGE_KEY = 'free-tarot';
const RESET_ARM_MS = 3600;
const IMAGE_GATE_MS = 280;
const REVEAL_SETTLE_MS = 350;

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

class SupremeStellarFlameEngineV507 {
  constructor({ cosmos, effects, stage, orb, card }) {
    this.cosmos = cosmos;
    this.effects = effects;
    this.stage = stage;
    this.orb = orb;
    this.card = card;
    this.world = stage.closest('.tl507');
    this.fx = effects.getContext('2d', { alpha: true, desynchronized: true });
    this.gl = null;
    this.program = null;
    this.uniforms = null;
    this.mode = 'canvas';
    this.width = 1;
    this.height = 1;
    this.pixelRatio = 1;
    this.renderScale = constrained() ? 0.56 : (innerWidth < 700 ? 0.72 : 0.88);
    this.targetFps = reducedMotion() ? 18 : (constrained() ? 26 : 45);
    this.energy = 0.82;
    this.touchPower = 0;
    this.touchPoint = { x: 0.5, y: 0.5 };
    this.birthStartedAt = 0;
    this.birthDuration = 0;
    this.birthStrength = 0;
    this.cardImpact = 0;
    this.sparks = [];
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.slowFrames = 0;
    this.raf = 0;
    this.routeActive = routeNow() === 'tarot';
    this.visible = this.routeActive && !document.hidden;
    this.destroyed = false;
    this.startedAt = performance.now();

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

  initializeRenderer() {
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
          color+=mix(vec3(0.10,0.015,0.18),vec3(0.42,0.035,0.52),cloud)*veil;
          alpha+=veil*0.72;

          float g1=galaxy(uv,vec2(0.14,0.72),3.0,time*0.055,aspect);
          float g2=galaxy(uv,vec2(0.87,0.58),3.0,-time*0.048,aspect);
          color+=vec3(0.72,0.08,1.0)*g1*0.58+vec3(0.52,0.05,0.95)*g2*0.48;
          color+=vec3(1.0,0.46,0.16)*(g1+g2)*0.17;
          alpha+=(g1+g2)*0.52;

          vec2 starGrid=uv*vec2(82.0*aspect,82.0);
          vec2 starId=floor(starGrid);
          vec2 starCell=fract(starGrid);
          float random=hash21(starId+vec2(u_seed));
          vec2 starPoint=vec2(hash21(starId+vec2(2.7)),hash21(starId+vec2(8.4)));
          float star=(1.0-smoothstep(0.0,0.055,length(starCell-starPoint)))*step(0.968,random);
          float twinkle=0.52+0.48*sin(time*(1.1+random*2.2)+random*31.0);
          star*=twinkle;
          color+=mix(vec3(0.76,0.48,1.0),vec3(1.0,0.82,0.42),step(0.993,random))*star*1.65;
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
          float width=(0.034+0.018*(1.0-flameT))*breath*(0.88+0.12*u_energy);
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
            vec3 strandColor=mix(vec3(0.78,0.07,1.0),vec3(1.0,0.61,0.16),fract(fi*0.43+flameT*0.38));
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
            color+=mix(vec3(0.98,0.08,0.82),vec3(1.0,0.55,0.10),fract(ti*0.61))*tongueFire*0.82;
            alpha+=tongueFire*0.27;
          }

          color+=vec3(0.38,0.018,0.92)*outer*(0.62+u_energy*0.18)*brokenGlow;
          color+=vec3(0.96,0.055,0.72)*body*(0.82+u_energy*0.24);
          color+=vec3(1.0,0.37,0.075)*body*(0.38+edgeNoise*0.48);
          color+=vec3(1.0,0.86,0.48)*core*(1.02+u_energy*0.36);
          alpha+=outer*0.47+body*0.48+core*0.36;

          float orbDistance=length((uv-u_orb)*vec2(aspect,1.0));
          float cardDistance=length((uv-u_card)*vec2(aspect,1.0));
          float orbHalo=exp(-orbDistance*10.0)*(0.54+0.17*sin(time*1.8));
          float crown=exp(-cardDistance*18.0)*(0.58+0.42*u_energy);
          color+=vec3(0.50,0.04,1.0)*orbHalo*0.88;
          color+=vec3(1.0,0.43,0.12)*orbHalo*0.31;
          color+=vec3(1.0,0.29,0.17)*crown*0.74;
          color+=vec3(1.0,0.84,0.50)*crown*0.34;
          alpha+=orbHalo*0.54+crown*0.55;

          float touchDistance=length((uv-u_touch)*vec2(aspect,1.0));
          float touchBurst=exp(-touchDistance*28.0)*u_touchPower;
          float touchRing=exp(-abs(touchDistance-(0.035+0.06*(1.0-u_touchPower)))*120.0)*u_touchPower;
          color+=vec3(1.0,0.78,0.45)*(touchBurst+touchRing)*1.4;
          color+=vec3(0.86,0.08,1.0)*touchRing*0.9;
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
        seed: gl.getUniformLocation(program, 'u_seed')
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
    this.mode = 'canvas';
    this.world.dataset.engine = 'canvas';
    this.cosmos.style.opacity = '0';
  }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.pixelRatio = Math.min(constrained() ? 1 : 1.55, Math.max(1, globalThis.devicePixelRatio || 1));

    const cosmosWidth = Math.max(1, Math.round(this.width * this.pixelRatio * this.renderScale));
    const cosmosHeight = Math.max(1, Math.round(this.height * this.pixelRatio * this.renderScale));
    if (this.cosmos.width !== cosmosWidth || this.cosmos.height !== cosmosHeight) {
      this.cosmos.width = cosmosWidth;
      this.cosmos.height = cosmosHeight;
    }
    this.cosmos.style.width = `${this.width}px`;
    this.cosmos.style.height = `${this.height}px`;

    const effectsWidth = Math.max(1, Math.round(this.width * this.pixelRatio));
    const effectsHeight = Math.max(1, Math.round(this.height * this.pixelRatio));
    if (this.effects.width !== effectsWidth || this.effects.height !== effectsHeight) {
      this.effects.width = effectsWidth;
      this.effects.height = effectsHeight;
    }
    this.effects.style.width = `${this.width}px`;
    this.effects.style.height = `${this.height}px`;
    this.fx?.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.gl?.viewport(0, 0, cosmosWidth, cosmosHeight);
  }

  elementCenter(element, flipY = false) {
    const host = this.stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const x = clamp((rect.left + rect.width / 2 - host.left) / Math.max(host.width, 1), 0, 1);
    const y = clamp((rect.top + rect.height / 2 - host.top) / Math.max(host.height, 1), 0, 1);
    return { x, y: flipY ? 1 - y : y, cssY: y, width: rect.width, height: rect.height };
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
    hotGradient.addColorStop(0.09, 'rgba(255,226,166,.92)');
    hotGradient.addColorStop(0.46, 'rgba(255,255,242,1)');
    hotGradient.addColorStop(0.78, 'rgba(255,214,143,.98)');
    hotGradient.addColorStop(1, 'rgba(255,255,236,0)');

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.strokeStyle = haloGradient;
    context.shadowColor = '#9d2cff';
    context.shadowBlur = constrained() ? 22 : 29;
    context.globalAlpha = 0.14;
    context.lineWidth = constrained() ? 44 : 56;
    trace(0, 0.1);
    context.stroke();

    context.strokeStyle = bodyGradient;
    context.shadowColor = '#ff38ca';
    context.shadowBlur = constrained() ? 14 : 19;
    context.globalAlpha = 0.7;
    context.lineWidth = constrained() ? 11 : 15;
    trace(0, 0.28);
    context.stroke();

    context.globalCompositeOperation = 'lighter';
    context.strokeStyle = hotGradient;
    context.shadowColor = '#ff9d38';
    context.shadowBlur = constrained() ? 9 : 13;
    context.globalAlpha = 0.42;
    context.lineWidth = constrained() ? 1.5 : 2.1;
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

    const tongueCount = constrained() ? 16 : 24;
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

    const starCount = constrained() ? 22 : 34;
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

  drawBirthWave(context, timestamp) {
    if (!this.birthStartedAt || !this.birthDuration) return;
    const progress = clamp((timestamp - this.birthStartedAt) / this.birthDuration, 0, 1);
    if (progress >= 1) {
      this.birthStartedAt = 0;
      return;
    }
    const orb = this.elementCenter(this.orb);
    const card = this.elementCenter(this.card);
    const eased = 1 - Math.pow(1 - progress, 3);
    const amplitude = clamp(this.width * 0.12, 38, 96);
    const ox = orb.x * this.width;
    const oy = orb.cssY * this.height;
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;
    const birthPoint = value => {
      const valueEnvelope = Math.sin(Math.PI * value);
      const valueEased = value * value * (3 - 2 * value);
      return {
        x: ox + (cx - ox) * valueEased
          + Math.sin(value * Math.PI * 2.14 - timestamp * 0.00078) * amplitude * valueEnvelope
          + Math.sin(value * Math.PI * 27.4 + timestamp * 0.0017) * amplitude * 0.028 * valueEnvelope,
        y: oy + (cy - oy) * valueEased
          + Math.cos(value * Math.PI * 4.35 - timestamp * 0.00079) * 7 * valueEnvelope
          + Math.sin(value * Math.PI * 19.8 - timestamp * 0.0014) * 3.2 * valueEnvelope
      };
    };
    const head = birthPoint(eased);
    const x = head.x;
    const y = head.y;
    const pulse = (1 - progress) * this.birthStrength;
    const radius = 21 + pulse * 28;

    const emissionCount = reducedMotion() ? 0 : (constrained() ? 2 : 4);
    const emissionBudget = constrained() ? 280 : 520;
    for (let index = 0; index < emissionCount && this.sparks.length < emissionBudget; index += 1) {
      const hueRoll = Math.random();
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * 150,
        vy: -58 - Math.random() * 155,
        age: 0,
        life: 0.32 + Math.random() * 0.48,
        radius: 1.7 + Math.random() * 4.2,
        hue: hueRoll < 0.58 ? 'gold' : (hueRoll < 0.82 ? 'white' : 'violet'),
        streak: true
      });
    }

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const tailStart = Math.max(0, eased - 0.34);
    const traceTail = () => {
      context.beginPath();
      for (let step = 0; step <= 18; step += 1) {
        const value = tailStart + (eased - tailStart) * (step / 18);
        const point = birthPoint(value);
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
    };
    context.shadowColor = '#a72fff';
    context.shadowBlur = 20;
    context.strokeStyle = `rgba(174,43,255,${0.28 + pulse * 0.08})`;
    context.lineWidth = constrained() ? 17 : 23;
    traceTail();
    context.stroke();
    context.shadowColor = '#ff5fcf';
    context.shadowBlur = 14;
    context.strokeStyle = `rgba(255,66,190,${0.62 + pulse * 0.08})`;
    context.lineWidth = constrained() ? 5.8 : 8.1;
    traceTail();
    context.stroke();
    context.globalCompositeOperation = 'lighter';
    context.shadowColor = '#ffae49';
    context.shadowBlur = 10;
    context.strokeStyle = `rgba(255,214,129,${0.72 + pulse * 0.08})`;
    context.lineWidth = constrained() ? 1.45 : 2.1;
    traceTail();
    context.stroke();

    const flare = context.createRadialGradient(x, y, 0, x, y, radius * 2.8);
    flare.addColorStop(0, `rgba(255,255,239,${0.96 - progress * 0.2})`);
    flare.addColorStop(0.15, `rgba(255,190,73,${0.86 - progress * 0.28})`);
    flare.addColorStop(0.45, `rgba(238,56,255,${0.56 - progress * 0.2})`);
    flare.addColorStop(1, 'rgba(117,36,255,0)');
    context.fillStyle = flare;
    context.beginPath();
    context.arc(x, y, radius * 2.8, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = `rgba(255,231,174,${(1 - progress) * 0.72})`;
    context.lineWidth = 1.5;
    context.shadowBlur = 16;
    context.shadowColor = '#ff8b30';
    context.beginPath();
    context.arc(x, y, radius * (0.78 + progress * 0.78), 0, Math.PI * 2);
    context.stroke();

    if (progress > 0.34) {
      const crown = clamp((progress - 0.34) / 0.66, 0, 1);
      const crownAlpha = Math.sin(crown * Math.PI) * 0.88;
      const crownRadius = 18 + crown * 92;
      context.strokeStyle = `rgba(255,220,145,${crownAlpha})`;
      context.lineWidth = 1.4;
      context.shadowColor = '#ff9f3e';
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
      context.fillStyle = `rgba(255,250,221,${crownAlpha})`;
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
    const impact = Math.max(this.cardImpact, activeBirth < 1 ? Math.sin(activeBirth * Math.PI) : 0);
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
      const edge = context.createLinearGradient(x, y, x + width, y + height);
      edge.addColorStop(0, `rgba(191,64,255,${alpha * 0.78})`);
      edge.addColorStop(0.47, `rgba(255,224,150,${alpha})`);
      edge.addColorStop(0.72, `rgba(255,102,53,${alpha * 0.88})`);
      edge.addColorStop(1, `rgba(225,68,255,${alpha * 0.72})`);
      context.strokeStyle = edge;
      context.lineWidth = ringIndex === 0 ? 1.45 + impact * 1.1 : 0.8;
      context.shadowColor = ringIndex === 0 ? '#ff9b3d' : '#cf43ff';
      context.shadowBlur = 8 + impact * 22;
      roundedRect(context, x, y, width, height, 14 + expansion * 0.22);
      context.stroke();
    }

    if (impact > 0.08) {
      const rayAlpha = clamp(impact, 0, 1) * 0.78;
      const vertical = baseHeight * (0.58 + impact * 0.34);
      const horizontal = baseWidth * (0.68 + impact * 0.32);
      context.strokeStyle = `rgba(255,237,190,${rayAlpha})`;
      context.lineWidth = 1.2;
      context.shadowColor = '#ffb24d';
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

  drawSatellite(context, x, y, width, angle, opacity) {
    const height = width * 1.5;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.globalAlpha = opacity;
    context.filter = `blur(${constrained() ? 1.6 : 2.6}px)`;
    context.shadowBlur = 24;
    context.shadowColor = 'rgba(188,62,255,.72)';
    const fill = context.createLinearGradient(0, -height / 2, 0, height / 2);
    fill.addColorStop(0, '#21072e');
    fill.addColorStop(1, '#07010b');
    roundedRect(context, -width / 2, -height / 2, width, height, width * 0.11);
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = 'rgba(247,205,119,.72)';
    context.lineWidth = Math.max(1, width * 0.024);
    context.stroke();

    context.filter = 'none';
    context.beginPath();
    context.arc(0, 0, width * 0.17, 0, Math.PI * 2);
    context.fillStyle = 'rgba(247,205,119,.75)';
    context.fill();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(width * 0.075, -width * 0.045, width * 0.17, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawSatellites(context, timestamp) {
    const time = timestamp / 1000;
    const mobile = this.width < 620;
    const cardWidth = mobile ? clamp(this.width * 0.115, 34, 52) : clamp(this.width * 0.075, 44, 64);
    const points = [
      [0.14, 0.30, -0.30, 0.23],
      [0.84, 0.25, 0.28, 0.21],
      [0.10, 0.60, -0.18, 0.27],
      [0.89, 0.60, 0.34, 0.25],
      [0.22, 0.79, 0.24, 0.16]
    ];
    const limit = constrained() ? 4 : points.length;
    for (let index = 0; index < limit; index += 1) {
      const [px, py, angle, opacity] = points[index];
      const driftX = Math.sin(time * (0.23 + index * 0.014) + index * 1.9) * (mobile ? 4 : 8);
      const driftY = Math.cos(time * (0.31 + index * 0.018) + index) * (mobile ? 6 : 10);
      this.drawSatellite(
        context,
        px * this.width + driftX,
        py * this.height + driftY,
        cardWidth * (index === 2 || index === 3 ? 1.12 : 1),
        angle + Math.sin(time * 0.2 + index) * 0.045,
        opacity
      );
    }
  }

  spawnAmbient(timestamp) {
    const orb = this.elementCenter(this.orb);
    const card = this.elementCenter(this.card);
    const budget = constrained() ? 280 : 480;
    if (this.sparks.length >= budget) return;
    const frequency = reducedMotion() ? 0.12 : (constrained() ? 0.56 : 0.92);
    if (Math.random() > frequency) return;
    const mix = Math.random();
    const envelope = Math.sin(Math.PI * mix);
    const amplitude = clamp(this.width * 0.118, 40, 94);
    const x = (orb.x + (card.x - orb.x) * mix) * this.width
      + Math.sin(mix * Math.PI * 2.14 - timestamp * 0.00078) * amplitude * envelope
      + Math.sin(mix * Math.PI * 25.6 + timestamp * 0.0016) * amplitude * 0.03 * envelope
      + (Math.random() - 0.5) * 22;
    const y = (orb.cssY + (card.cssY - orb.cssY) * mix) * this.height
      + Math.sin(mix * Math.PI * 19.2 - timestamp * 0.0012) * 3.4 * envelope;
    const hueRoll = Math.random();
    this.sparks.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: -14 - Math.random() * 28,
      age: 0,
      life: 0.55 + Math.random() * 0.82,
      radius: 0.8 + Math.random() * 2.8,
      hue: hueRoll < 0.58 ? 'gold' : (hueRoll < 0.94 ? 'violet' : 'white'),
      streak: Math.random() < 0.34
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
      if (spark.streak) {
        context.beginPath();
        context.moveTo(
          spark.x - spark.vx * 0.026,
          spark.y - spark.vy * 0.018
        );
        context.lineTo(spark.x, spark.y);
        context.strokeStyle = spark.hue === 'violet'
          ? `rgba(220,72,255,${alpha * 0.76})`
          : `rgba(255,202,105,${alpha * 0.86})`;
        context.lineWidth = clamp(radius * 0.42, 0.7, 2.4);
        context.shadowColor = spark.hue === 'violet' ? '#c13cff' : '#ffad3f';
        context.shadowBlur = 7;
        context.stroke();
      }
      const gradient = context.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, radius * 3.2);
      if (spark.hue === 'white') {
        gradient.addColorStop(0, `rgba(255,255,249,${alpha})`);
        gradient.addColorStop(0.28, `rgba(255,224,170,${alpha * 0.84})`);
        gradient.addColorStop(1, 'rgba(255,163,55,0)');
      } else if (spark.hue === 'gold') {
        gradient.addColorStop(0, `rgba(255,249,222,${alpha})`);
        gradient.addColorStop(0.25, `rgba(255,174,64,${alpha * 0.78})`);
        gradient.addColorStop(1, 'rgba(255,116,31,0)');
      } else {
        gradient.addColorStop(0, `rgba(255,234,255,${alpha})`);
        gradient.addColorStop(0.26, `rgba(225,63,255,${alpha * 0.78})`);
        gradient.addColorStop(1, 'rgba(123,38,255,0)');
      }
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(spark.x, spark.y, radius * 3.2, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  drawOverlay(timestamp, deltaSeconds) {
    const context = this.fx;
    if (!context) return;
    context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    context.clearRect(0, 0, this.width, this.height);
    if (this.mode !== 'webgl') this.drawFallbackCosmos(context, timestamp);
    this.drawSatellites(context, timestamp);
    this.drawCardPortal(context, timestamp);
    this.drawBirthWave(context, timestamp);
    this.spawnAmbient(timestamp);
    this.drawSparks(context, deltaSeconds);
  }

  adapt(deltaMilliseconds) {
    if (reducedMotion() || constrained() || this.renderScale <= 0.5) return;
    if (deltaMilliseconds > 34) this.slowFrames += 1;
    else this.slowFrames = Math.max(0, this.slowFrames - 2);
    if (this.slowFrames < 28) return;
    this.slowFrames = 0;
    this.renderScale = Math.max(0.5, this.renderScale * 0.82);
    this.targetFps = Math.max(30, this.targetFps - 8);
    this.resize();
    this.world.dataset.adaptiveQuality = 'calm';
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
      if (this.mode === 'webgl') this.drawWebGL(timestamp);
      this.drawOverlay(timestamp, delta / 1000);
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
    const card = this.elementCenter(this.card);
    const ox = orb.x * this.width;
    const oy = orb.cssY * this.height;
    const cx = card.x * this.width;
    const cy = card.cssY * this.height;
    const count = reducedMotion() ? 36 : (constrained() ? 88 : 154);
    this.energy = Math.max(this.energy, 1.75 + strength * 0.55);
    this.touchPoint = { x: orb.x, y: orb.cssY };
    this.touchPower = 1;

    for (let index = 0; index < count; index += 1) {
      const progress = Math.random();
      const hot = index < count * 0.62;
      const envelope = Math.sin(Math.PI * progress);
      const amplitude = clamp(this.width * 0.122, 42, 98);
      const x = ox + (cx - ox) * progress
        + Math.sin(progress * Math.PI * 2.14 - performance.now() * 0.00074) * amplitude * envelope
        + (Math.random() - 0.5) * 25;
      const y = oy + (cy - oy) * progress + (Math.random() - 0.5) * 24;
      const hueRoll = Math.random();
      this.sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (hot ? 185 : 90),
        vy: -45 - Math.random() * (hot ? 230 : 120),
        age: 0,
        life: 0.34 + Math.random() * 0.78,
        radius: (hot ? 2.2 : 1.2) + Math.random() * (hot ? 5.4 : 3.1),
        hue: hueRoll < 0.64 ? 'gold' : (hueRoll < 0.91 ? 'violet' : 'white'),
        streak: hot || Math.random() < 0.32
      });
    }
    const budget = constrained() ? 280 : 520;
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
    const count = constrained() ? 54 : 96;

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
        life: 0.42 + Math.random() * 0.74,
        radius: 1.25 + Math.random() * 3.9,
        hue: hueRoll < 0.52 ? 'gold' : (hueRoll < 0.78 ? 'violet' : 'white'),
        streak: Math.random() < 0.78
      });
    }
    const budget = constrained() ? 320 : 600;
    if (this.sparks.length > budget) this.sparks.splice(0, this.sparks.length - budget);
  }

  birth(strength = 1) {
    this.ignite(strength);
    this.birthStartedAt = performance.now();
    this.birthDuration = reducedMotion() ? 160 : 760;
    this.birthStrength = clamp(strength, 0.7, 1.8);
    this.cardImpact = reducedMotion() ? 0.2 : 1;
    this.spawnCardBurst(strength);
    this.start();
  }

  destroy() {
    this.destroyed = true;
    this.pause();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (!this.resizeObserver) removeEventListener('resize', this.onResize);
    this.sparks.length = 0;
    if (this.gl) {
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }
  }
}

export class TarotLivreSupremeV507 {
  constructor(root, {
    storage = store,
    orbCore = globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null
  } = {}) {
    if (!root) throw new TypeError('O mundo do Tarot Livre não foi encontrado.');
    if (!orbCore?.claim || !orbCore?.orb) {
      throw new Error('A Orbe Suprema V501 precisa despertar antes do Tarot Livre V507.');
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
    this.claimRelease = null;
    this.active = false;

    this.root.innerHTML = '';
    this.root.dataset.tarotWorld = 'supremo-v507';
    this.root.className = this.root.className
      .replace(/\btarot-world-v301-host\b/g, '')
      .trim();

    this.build();
    this.world.dataset.birthSync = 'atomic';
    this.world.dataset.flameTexture = 'organic-plasma';
    this.world.dataset.birthCorona = 'card-edge';
    this.world.dataset.responsiveAltar = 'v507';
    this.render(false);
    this.fire = new SupremeStellarFlameEngineV507({
      cosmos: this.cosmosCanvas,
      effects: this.effectsCanvas,
      stage: this.stage,
      orb: this.orb,
      card: this.cardZone
    });
    this.bind();

    if (routeNow() === 'tarot') {
      requestAnimationFrame(() => this.enter());
    } else {
      this.fire.setActive(false);
    }

    preloadCardImages(this.state.waiting.slice(0, 8), 8);

    document.documentElement.dataset.tarotLivre = 'v507';
    const readiness = Object.freeze({
      version: VERSION,
      engine: 'SupremeStellarFlameEngineV507',
      renderer: this.fire.mode,
      canonicalOrb: 'v501',
      oneLivingOrb: true,
      deckSize: DECK_SIZE,
      normalOnly: true,
      noRepeats: true,
      gridColumns: 6,
      atomicBirth: true,
      organicCanvasFire: true,
      plasmaFilaments: true,
      cardEdgeBurst: true,
      responsiveAltar: true
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
      <div class="tl507" data-phase="idle" data-engine="pending">
        <header class="tl507__header">
          <div class="tl507__title">
            <h2>Tarot Livre</h2>
            <span class="tl507__title-star" aria-hidden="true"><i></i><b></b><i></i></span>
          </div>

          <a class="tl507__mesa" href="#spreads" data-go="spreads" aria-label="Abrir Tiragens e Mesa Real">
            <span aria-hidden="true">✦</span>
            Mesa Real
          </a>

        </header>

        <section class="tl507__stage" data-stage aria-label="Tarot Livre — Cosmos de Fogo">
          <canvas class="tl507__canvas tl507__cosmos" data-cosmos aria-hidden="true"></canvas>
          <canvas class="tl507__canvas tl507__effects" data-effects aria-hidden="true"></canvas>

          <div class="tl507__portal-crown" aria-hidden="true"><i></i><i></i><i></i></div>

          <div class="tl507__card-zone" data-card-zone tabindex="0"
               aria-label="Carta atual. Use as setas para navegar pelas cartas reveladas.">
            <div class="tl507__card" data-current-card data-empty="true">
              <canvas class="tl507__card-back" data-card-back aria-hidden="true"></canvas>
            </div>
          </div>

          <nav class="tl507__card-nav" data-card-nav aria-label="Navegar pelas cartas reveladas">
            <button type="button" data-prev aria-label="Carta anterior">‹</button>
            <span data-position>0 de 0</span>
            <button type="button" data-next aria-label="Próxima carta">›</button>
          </nav>

          <div class="tl507__orb-host" data-tarot-orb-host>
            <span class="tl507__orb-aura" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="tl507__orb-flare" aria-hidden="true"></span>
          </div>

          <p class="tl507__counter" aria-label="Cartas reveladas">
            <b data-count>0</b><span>/78</span>
          </p>
          <p class="tl507__signal" data-signal aria-live="polite">Toque na Orbe para revelar seu Tarot.</p>
        </section>

        <div class="tl507__toolbar" aria-label="Controles do Tarot Livre">
          <button type="button" data-shuffle>
            <span aria-hidden="true">↻</span>
            Embaralhar
          </button>
          <button type="button" data-reset>
            <span aria-hidden="true">✧</span>
            Novo círculo
          </button>
        </div>

        <section class="tl507__constellation" aria-labelledby="tl507ConstellationTitle">
          <header>
            <div>
              <small>SEU CÍRCULO</small>
              <h3 id="tl507ConstellationTitle">Cartas reveladas</h3>
            </div>
            <span data-remaining>78 aguardam</span>
          </header>
          <div class="tl507__grid" data-grid role="grid"
               aria-label="Cartas reveladas, seis por fileira" aria-colcount="6"></div>
          <p class="tl507__empty-grid" data-empty-grid>Nenhuma carta foi revelada ainda.</p>
        </section>

        <p class="tl507__sr" data-live role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    this.world = this.root.querySelector('.tl507');
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
    this.orb.dataset.tarotReveal = 'v507';
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
    document.body?.classList.remove('db507-tarot-birthing');
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
    this.orbCore.settleRoute?.(nextRoute, 'tarot-leave-v507');
    return true;
  }

  setPhase(phase) {
    this.world.dataset.phase = phase;
    const busy = phase !== 'idle';
    const ritualVisible = phase === 'summoning' || phase === 'revealing' || this.world.classList.contains('is-birthing');
    document.body?.classList.toggle('db507-tarot-birthing', this.active && ritualVisible);
    this.world.setAttribute('aria-busy', String(busy));
    if (this.active && this.orbHost.contains(this.orb)) {
      this.orb.setAttribute('aria-disabled', String(busy || this.state.completed));
    }
    this.shuffle.disabled = busy || this.state.waiting.length < 2;
    this.resetButton.disabled = busy;
  }

  async transitionTo(index, { onBirth } = {}) {
    const previous = this.card.firstElementChild;
    if (previous && !reducedMotion()) {
      const departure = previous.animate([
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) brightness(1)' },
        { opacity: 0.62, transform: 'translate3d(0,9px,0) scale(.92)', filter: 'blur(2px) brightness(1.35)', offset: 0.62 },
        { opacity: 0, transform: 'translate3d(0,24px,0) scale(.52)', filter: 'blur(11px) brightness(2.2)' }
      ], { duration: 145, easing: 'cubic-bezier(.55,.02,.78,.35)', fill: 'forwards' });
      await departure.finished.catch(() => {});
    }

    this.show(index, false);
    onBirth?.();
    const arrival = this.card.firstElementChild;
    if (arrival && !reducedMotion()) {
      const birth = arrival.animate([
        { opacity: 0, transform: 'translate3d(0,42px,0) scale(.72)', filter: 'blur(12px) brightness(2.1)' },
        { opacity: 1, transform: 'translate3d(0,-7px,0) scale(1.035)', filter: 'blur(0) brightness(1.2)', offset: 0.68 },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) brightness(1)' }
      ], { duration: REVEAL_SETTLE_MS, easing: 'cubic-bezier(.14,.86,.18,1)' });
      await birth.finished.catch(() => {});
    }
  }

  async draw() {
    if (!this.active || this.busy || this.state.completed) return null;
    this.busy = true;
    this.setPhase('summoning');
    this.signal.textContent = 'A chama encontra uma carta…';
    this.fire?.ignite(1.08);
    this.orbCore.pulse?.('tarot-summon', { intensity: 1.08 });
    nativePulse('Medium');

    try {
      const result = await this.coordinator.commit(latest => drawNextCard(latest));
      this.state = result.state;
      if (result.cardId === null) return null;

      this.selected = result.position;
      const card = CARDS[result.cardId];
      const imagePreparation = Promise.resolve(
        prepareCardImage(card, { timeout: 1400, priority: 'high' })
      ).catch(() => false);
      await Promise.race([
        imagePreparation,
        wait(reducedMotion() ? 55 : IMAGE_GATE_MS)
      ]);

      this.setPhase('revealing');
      this.signal.textContent = 'A carta atravessa o fogo…';
      await this.transitionTo(result.position, { onBirth: () => {
        this.count.textContent = String(this.state.revealed.length);
        this.remaining.textContent = this.state.completed
          ? 'Círculo completo'
          : `${this.state.waiting.length} aguardam`;
        this.renderGrid();
        this.world.classList.add('is-birthing');
        this.fire?.birth(1.42);
        this.orbCore.pulse?.('tarot-birth', { intensity: 1.26 });
        clearTimeout(this.birthTimer);
        this.birthTimer = setTimeout(() => {
          this.world?.classList.remove('is-birthing');
          if (this.world?.dataset.phase === 'idle') {
            document.body?.classList.remove('db507-tarot-birthing');
          }
        }, reducedMotion() ? 120 : 760);
      }});
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
          engine: 'supreme-stellar-flame-v507'
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

  show(index, animate = false) {
    if (!Number.isInteger(index) || index < 0 || index >= this.state.revealed.length) return false;

    const cardId = this.state.revealed[index];
    const card = CARDS[cardId];
    if (!card || card.orientation !== 'normal') return false;
    this.selected = index;
    this.card.innerHTML = `${cardImageMarkup(card, {
      alt: `${card.name}, direta`,
      priority: 'high'
    })}<div class="tl507__card-name"><b>${escapeText(card.name)}</b><small>${index + 1} / ${this.state.revealed.length}</small></div>`;
    this.card.dataset.empty = 'false';
    this.cardZone.setAttribute('aria-label', `${card.name}, direta. Carta ${index + 1} de ${this.state.revealed.length}.`);

    if (animate && !reducedMotion()) {
      this.card.animate([
        { opacity: 0.55, transform: 'translate3d(0,18px,0) scale(.94)', filter: 'blur(5px) brightness(1.5)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) brightness(1)' }
      ], { duration: 310, easing: 'cubic-bezier(.18,.82,.2,1)' });
      this.fire?.ignite(0.35);
    }

    this.updateControls();
    this.grid.querySelectorAll('[data-index]').forEach(button => {
      const active = Number(button.dataset.index) === index;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    preloadCardImages([this.state.revealed[index - 1], this.state.revealed[index + 1]], 2);
    return true;
  }

  move(direction) {
    if (this.busy || !this.state.revealed.length) return false;
    const next = this.selected + direction;
    if (next < 0 || next >= this.state.revealed.length) return false;
    this.show(next, false);
    if (!reducedMotion()) {
      const start = direction > 0 ? 24 : -24;
      this.card.animate([
        { opacity: 0.46, transform: `translate3d(${start}px,0,0) scale(.985)` },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    return true;
  }

  async reshuffle() {
    if (this.busy || this.state.waiting.length < 2) return false;
    const revealedSignature = this.state.revealed.join(',');
    this.busy = true;
    this.setPhase('shuffling');
    this.signal.textContent = 'O fogo reorganiza apenas as cartas ocultas…';
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
      this.selected = -1;
      this.card.dataset.empty = 'true';
      this.card.innerHTML = '<canvas class="tl507__card-back" data-card-back aria-hidden="true"></canvas>';
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
      atomicBirth: this.world.dataset.birthSync === 'atomic',
      organicCanvasFire: this.world.dataset.flameTexture === 'organic-plasma',
      plasmaFilaments: true,
      cardEdgeBurst: this.world.dataset.birthCorona === 'card-edge',
      responsiveAltar: this.world.dataset.responsiveAltar === 'v507'
    });
  }

  destroy() {
    this.leave(routeNow());
    this.abort.abort();
    clearTimeout(this.resetTimer);
    clearTimeout(this.birthTimer);
    this.routeObserver?.disconnect();
    this.fire?.destroy();
    if (globalThis.divinaTarotLivreV507 === this) delete globalThis.divinaTarotLivreV507;
    delete document.documentElement.dataset.tarotLivre;
  }
}
