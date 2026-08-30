/*
 * DIVINA BRUXA — REALITY ORB ENGINE V67 · DEEP BREATH & STARDUST
 *
 * Um motor novo, criado para a Orbe das Realidades:
 * - WebGL 2 com fallback WebGL 1 e fallback fotográfico;
 * - entrada de baixa latência com eventos coalescidos e previsão curta;
 * - animação independente da taxa da tela (60/90/120 Hz);
 * - resolução Retina adaptativa por desempenho real do aparelho;
 * - respiração profunda em quatro fases: inspira, sustenta, pulsa e expira;
 * - poeira astral viva, atraída pelo toque sem formar linhas ou símbolos;
 * - campo de memória GPU: o plasma recorda e dissolve o caminho do dedo;
 * - camada viva de segurança para desktops sem WebGL;
 * - plasma, luz e rastros exclusivamente dentro da esfera;
 * - toque, pressão, arraste, giro, impulso, toque longo e duplo toque;
 * - haptics preparados para Web, iOS/Android e futuro app Capacitor.
 */

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const expFollow = (rate, seconds) => 1 - Math.exp(-rate * seconds);
const nowMs = () => performance.now();

function shaderSources(webgl2, fragmentPrecision) {
  const vertex = webgl2 ? `#version 300 es
    precision highp float;
    in vec2 aPosition;
    out vec2 vUv;
    void main(){
      vUv = aPosition * .5 + .5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }` : `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main(){
      vUv = aPosition * .5 + .5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

  const header = webgl2 ? `#version 300 es
    precision ${fragmentPrecision} float;
    in vec2 vUv;
    out vec4 orbColor;
    #define SAMPLE texture` : `
    precision ${fragmentPrecision} float;
    varying vec2 vUv;
    #define SAMPLE texture2D`;
  const output = webgl2 ? 'orbColor = color;' : 'gl_FragColor = color;';

  const fragment = `${header}
    uniform sampler2D uTexture;
    uniform sampler2D uField;
    uniform vec2 uFieldTexel;
    uniform float uMemoryStrength;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform vec2 uVelocity;
    uniform vec2 uTrail1;
    uniform vec2 uTrail2;
    uniform vec2 uTrail3;
    uniform float uEnergy;
    uniform float uPressure;
    uniform float uCharge;
    uniform float uRelease;
    uniform float uResonance;
    uniform float uSpin;
    uniform float uFlick;
    uniform float uQuality;
    uniform float uBreathStrength;

    float hash21(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise21(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
                 mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
    }

    float fbm(vec2 p){
      float value = 0.0;
      float amplitude = .5;
      mat2 turn = mat2(.80, -.60, .60, .80);
      for(int i = 0; i < 4; i++){
        value += amplitude * noise21(p);
        p = turn * p * 2.03 + vec2(7.17, 11.31);
        amplitude *= .5;
      }
      return value;
    }

    vec2 safeNormal(vec2 p){
      return p / max(length(p), .0001);
    }

    float segmentDistance(vec2 p, vec2 a, vec2 b){
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), .00001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    float stardust(vec2 uv, float scale, float threshold, float seed){
      vec2 grid = uv * scale;
      vec2 cell = floor(grid);
      vec2 local = fract(grid) - .5;
      float particle = exp(-dot(local, local) * 190.0);
      return particle * step(threshold, hash21(cell + seed));
    }

    void main(){
      vec2 centered = vUv - .5;
      float radius = length(centered);
      if(radius > .5) discard;

      float edgeAlpha = 1.0 - smoothstep(.489, .5, radius);
      float time = uTime;
      float energy = clamp(uEnergy, 0.0, 1.6);
      float speed = clamp(length(uVelocity), 0.0, 2.6);
      float pressure = clamp(uPressure, 0.0, 1.0);
      float innerMask = 1.0 - smoothstep(.29, .5, radius);
      vec2 radial = safeNormal(centered);
      vec2 tangent = vec2(-radial.y, radial.x);

      // Vida autônoma: um ciclo de inspiração e expiração que se vê na matéria.
      // A esfera externa permanece fixa; somente o universo interno se expande.
      float breathWave = .5 + .5 * sin(time * .82 - 1.5708 + sin(time * .13) * .15);
      float breathSoft = breathWave * breathWave * (3.0 - 2.0 * breathWave);
      float breath = breathSoft * breathSoft * (3.0 - 2.0 * breathSoft);
      float breathLift = (breath - .5) * uBreathStrength;
      float soulCycle = fract(time * .82 / 6.2831853);
      float firstBeatDistance = (soulCycle - .485) / .026;
      float secondBeatDistance = (soulCycle - .565) / .034;
      float firstBeat = exp(-firstBeatDistance * firstBeatDistance);
      float secondBeat = exp(-secondBeatDistance * secondBeatDistance) * .66;
      float heartBeat = (firstBeat + secondBeat) * uBreathStrength;
      float slowSoul = .5 + .5 * sin(time * .31 + fbm(centered * 3.1 + time * .025) * 3.2);
      float livingCloud = fbm(centered * 6.2 + vec2(time * .055, -time * .041));
      float soulCurrent = (.0024 + slowSoul * .0038 + livingCloud * .0025) * innerMask * (.76 + breath * .52);

      // Curvatura óptica de uma esfera real, sem desenhar contornos ou símbolos.
      float internalBreathScale = 1.0 - breathLift * .118 - heartBeat * .012;
      vec2 sampleUv = .5 + centered * (1.0 + radius * radius * .075) * internalBreathScale;
      sampleUv += tangent * soulCurrent * sin(time * .51 + radius * 9.0 + livingCloud * 2.8);
      sampleUv += radial * (.0021 * sin(time * .59 + radius * 12.0) - .0052 * breathLift - .0060 * heartBeat * innerMask);

      // O toque dobra o plasma no ponto exato do dedo.
      vec2 delta = vUv - uPointer;
      float distanceToTouch = length(delta);
      vec2 touchNormal = safeNormal(delta);
      vec2 touchTangent = vec2(-touchNormal.y, touchNormal.x);
      float touchField = exp(-distanceToTouch * distanceToTouch * 22.0) * energy;
      float touchCore = exp(-distanceToTouch * distanceToTouch * 86.0) * energy;
      float spinDirection = uSpin >= 0.0 ? 1.0 : -1.0;
      float organicWave = sin(distanceToTouch * 31.0 - time * (7.0 + speed * 1.8) + livingCloud * 3.0);
      sampleUv += touchTangent * touchField * spinDirection * (.004 + pressure * .011 + speed * .0045);
      sampleUv -= touchNormal * touchField * organicWave * (.0033 + uCharge * .0047);

      // Memória contínua do gesto. O rastro é difuso, orgânico e desaparece sozinho.
      float trailDistance = min(segmentDistance(vUv, uPointer, uTrail1),
                            min(segmentDistance(vUv, uTrail1, uTrail2),
                                segmentDistance(vUv, uTrail2, uTrail3)));
      float trailCloud = exp(-trailDistance * (30.0 - uFlick * 7.0)) * energy * clamp(.16 + speed * .46 + uFlick * .42, 0.0, 1.35);
      vec2 trailDirection = safeNormal(uPointer - uTrail3);
      sampleUv += vec2(-trailDirection.y, trailDirection.x) * trailCloud * .0038;

      // Campo de memória persistente: cada pixel tocado continua fluindo por instantes.
      vec4 soulMemory = vec4(0.0);
      vec2 memoryGradient = vec2(0.0);
      if(uMemoryStrength > .002){
        soulMemory = SAMPLE(uField, vUv);
        float memoryLeft = SAMPLE(uField, clamp(vUv - vec2(uFieldTexel.x, 0.0), vec2(.001), vec2(.999))).r;
        float memoryRight = SAMPLE(uField, clamp(vUv + vec2(uFieldTexel.x, 0.0), vec2(.001), vec2(.999))).r;
        float memoryDown = SAMPLE(uField, clamp(vUv - vec2(0.0, uFieldTexel.y), vec2(.001), vec2(.999))).r;
        float memoryUp = SAMPLE(uField, clamp(vUv + vec2(0.0, uFieldTexel.y), vec2(.001), vec2(.999))).r;
        memoryGradient = vec2(memoryRight - memoryLeft, memoryUp - memoryDown);
      }
      vec2 memoryCurl = vec2(-memoryGradient.y, memoryGradient.x);
      sampleUv += memoryCurl * (.012 + soulMemory.g * .009) * soulMemory.r;
      sampleUv -= memoryGradient * .0045 * soulMemory.r;

      sampleUv = clamp(sampleUv, vec2(.002), vec2(.998));
      vec4 color = SAMPLE(uTexture, sampleUv);

      // Aberração cromática só durante energia alta; a fotografia permanece a base.
      float chroma = clamp((energy + speed * .22 - .20) * .0024 * uQuality, 0.0, .0042);
      if(chroma > .0001){
        vec2 chromaDirection = safeNormal(centered + vec2(.0001));
        vec4 warmSample = SAMPLE(uTexture, clamp(sampleUv + chromaDirection * chroma, vec2(.002), vec2(.998)));
        vec4 violetSample = SAMPLE(uTexture, clamp(sampleUv - chromaDirection * chroma, vec2(.002), vec2(.998)));
        color.r = mix(color.r, warmSample.r, .17);
        color.b = mix(color.b, violetSample.b, .15);
      }

      // A luz também respira: violeta profundo na expiração, calor no auge da inspiração.
      float inhaleGlow = smoothstep(.48, 1.0, breath) * uBreathStrength;
      float exhaleGlow = smoothstep(.52, 1.0, 1.0 - breath) * uBreathStrength;
      color.rgb *= .935 + breath * .145 * uBreathStrength + slowSoul * .018 + heartBeat * .068;
      color.rgb += vec3(.18, .018, .31) * exhaleGlow * innerMask * .072;
      color.rgb += vec3(.64, .16, .68) * inhaleGlow * innerMask * .066;

      // Plasma luminoso sob o dedo, com ouro apenas nos pontos de maior densidade.
      float plasma = 0.0;
      if(energy > .025){
        float plasmaNoise = fbm((vUv - uPointer) * (8.0 + uQuality * 2.0) + vec2(time * .39, -time * .27));
        plasma = smoothstep(.49, .91, plasmaNoise + touchField * .34) * touchField;
      }
      color.rgb += vec3(.53, .08, .91) * touchField * .43;
      color.rgb += vec3(.95, .25, 1.0) * plasma * .72;
      color.rgb += vec3(1.0, .78, .34) * touchCore * touchCore * (.28 + pressure * .34);

      // O movimento deixa uma seda de luz, não uma linha geométrica.
      float trailTexture = .58;
      if(energy > .025) trailTexture += .42 * fbm(vUv * 14.0 + vec2(-time * .41, time * .29));
      color.rgb += vec3(.58, .12, .94) * trailCloud * trailTexture * .48;
      color.rgb += vec3(1.0, .61, .30) * trailCloud * trailCloud * (.11 + uFlick * .20);

      // A memória não vira uma linha: reaparece como matéria difusa e viva.
      float memoryTexture = .62 + livingCloud * .38;
      color.rgb += vec3(.46, .08, .82) * soulMemory.r * memoryTexture * .36;
      color.rgb += vec3(.93, .27, 1.0) * soulMemory.g * soulMemory.r * .31;
      color.rgb += vec3(1.0, .65, .27) * soulMemory.g * soulMemory.g * .12;

      // Toque longo: a nebulosa ganha profundidade e parece reunir intenção.
      float chargeVeil = 0.0;
      if(uCharge > .01){
        float chargedMatter = fbm(centered * 10.5 + tangent * (time * .72 + uSpin * 1.4));
        chargeVeil = smoothstep(.57, .88, chargedMatter) * uCharge * innerMask;
      }
      color.rgb += vec3(.63, .10, .92) * chargeVeil * .46;
      color.rgb += vec3(1.0, .55, .25) * chargeVeil * chargeVeil * .18;

      // Soltura: uma expansão macia, inteiramente interna, sem círculo desenhado.
      float releaseAge = 1.0 - clamp(uRelease, 0.0, 1.0);
      float releaseSize = .055 + releaseAge * .37;
      float releaseCloud = exp(-(distanceToTouch * distanceToTouch) / max(.002, releaseSize * releaseSize)) * uRelease;
      float releaseTexture = .58;
      if(uRelease > .01) releaseTexture += .42 * fbm((vUv - uPointer) * 12.0 - vec2(time * .34));
      color.rgb += vec3(.76, .18, 1.0) * releaseCloud * releaseTexture * .44;
      color.rgb += vec3(1.0, .72, .34) * releaseCloud * releaseCloud * .19;

      // Ressonância: véus orgânicos e constelações microscópicas, nunca símbolos.
      float veil = 0.0;
      if(uResonance > .01){
        float veilNoise = fbm(centered * 8.8 + tangent * (time * .24) + vec2(time * .07));
        veil = smoothstep(.55, .86, veilNoise) * uResonance * innerMask;
      }
      color.rgb += vec3(.42, .09, .82) * veil * .37;
      color.rgb += vec3(.91, .35, .98) * veil * veil * .25;

      // Poeira astral em duas profundidades. Ela flutua, respira e se reúne sob o dedo.
      vec2 dustUv = vUv + vec2(time * .0052, -time * .0037);
      dustUv += tangent * (.002 + breath * .0045);
      dustUv -= touchNormal * touchField * (.012 + pressure * .010);
      dustUv += touchTangent * touchField * spinDirection * .009;
      float dustNear = stardust(dustUv, 39.0 + uQuality * 9.0, .946, 19.7);
      float dustFar = stardust(dustUv * .73 + vec2(-time * .002, time * .003), 31.0 + uQuality * 7.0, .956, 71.3);
      float dustSeed = hash21(floor(dustUv * 43.0) + 8.4);
      float twinkle = .52 + .48 * sin(time * (2.7 + dustSeed * 3.8) + dustSeed * 31.0);
      float dust = (dustNear + dustFar * .72) * twinkle;
      dust *= (.16 + breath * .22 + energy * .48 + uResonance * .36 + touchField * .42);
      dust *= 1.0 - smoothstep(.42, .495, radius);
      color.rgb += mix(vec3(.77, .47, 1.0), vec3(1.0, .82, .48), dustSeed) * dust * 1.42;

      float touchSpark = stardust((vUv - uPointer) * (1.0 + energy * .08) + .5 + vec2(time * .018, -time * .011), 54.0, .961, 113.0);
      touchSpark *= touchField * (.42 + pressure * .58) * (1.0 - smoothstep(.43, .5, radius));
      color.rgb += vec3(1.0, .72, .96) * touchSpark * 1.65;

      // O coração pulsa dentro da fotografia, sem marcador geométrico fixo.
      float nucleus = exp(-length(vUv - vec2(.505, .518)) * (27.0 - breath * 11.0 - heartBeat * 3.4));
      nucleus *= .08 + breath * .39 * uBreathStrength + heartBeat * .38 + energy * .20 + uCharge * .20;
      vec3 soulColor = mix(vec3(.67, .34, 1.0), vec3(1.0, .75, .93), breath);
      color.rgb += soulColor * nucleus * (.56 + inhaleGlow * .16);

      // Volume e profundidade na borda, sem acrescentar linhas ao redor da Orbe.
      float sphereShade = 1.0 - smoothstep(.33, .5, radius) * .24;
      float softFresnel = pow(clamp(radius / .5, 0.0, 1.0), 4.2);
      color.rgb *= sphereShade;
      color.rgb += vec3(.30, .05, .46) * softFresnel * .055;

      // Compressão suave de brilho: preserva detalhe fotográfico nas áreas intensas.
      color.rgb = color.rgb / (vec3(1.0) + max(color.rgb - vec3(.92), vec3(0.0)) * .24);
      color.rgb *= edgeAlpha;
      color.a *= edgeAlpha;
      ${output}
    }`;

  const fieldHeader = webgl2 ? `#version 300 es
    precision ${fragmentPrecision} float;
    in vec2 vUv;
    out vec4 memoryColor;
    #define SAMPLE texture` : `
    precision ${fragmentPrecision} float;
    varying vec2 vUv;
    #define SAMPLE texture2D`;
  const fieldOutput = webgl2 ? 'memoryColor = field;' : 'gl_FragColor = field;';
  const fieldFragment = `${fieldHeader}
    uniform sampler2D uPreviousField;
    uniform float uTime;
    uniform float uDelta;
    uniform float uDown;
    uniform float uEnergy;
    uniform float uFlick;
    uniform vec2 uPointer;
    uniform vec2 uVelocity;
    uniform vec2 uTrail1;
    uniform vec2 uTrail2;
    uniform vec2 uTrail3;

    float segmentDistance(vec2 p, vec2 a, vec2 b){
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), .00001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main(){
      vec2 centered = vUv - .5;
      float radius = length(centered);
      float frames = clamp(uDelta * 60.0, .25, 4.0);
      vec2 velocity = clamp(uVelocity, vec2(-2.6), vec2(2.6));

      // A memória é transportada pela velocidade do gesto e por uma corrente lenta.
      vec2 curl = vec2(-centered.y, centered.x);
      float breathingDrift = sin(uTime * .43 + radius * 8.0) * .0016;
      vec2 backtrace = vUv - velocity * (.0015 + uDown * .0019) + curl * breathingDrift;
      vec4 previous = SAMPLE(uPreviousField, clamp(backtrace, vec2(.002), vec2(.998)));
      float decay = pow(.966, frames);
      float memory = previous.r * decay;
      float shimmer = previous.g * pow(.949, frames);

      vec2 touchDelta = vUv - uPointer;
      float brush = exp(-dot(touchDelta, touchDelta) * 174.0) * uDown * clamp(uEnergy, 0.0, 1.5);
      float pathDistance = min(segmentDistance(vUv, uPointer, uTrail1),
                           min(segmentDistance(vUv, uTrail1, uTrail2),
                               segmentDistance(vUv, uTrail2, uTrail3)));
      float path = exp(-pathDistance * (47.0 - uFlick * 8.0)) * uDown * clamp(.24 + length(velocity) * .28, 0.0, 1.25);
      float impulse = clamp(brush + path * .68, 0.0, 1.0);
      memory = clamp(max(memory, impulse) + impulse * .11, 0.0, 1.0);
      shimmer = clamp(max(shimmer, brush * (.30 + uFlick * .54) + path * .18), 0.0, 1.0);

      float sphereMask = 1.0 - smoothstep(.485, .505, radius);
      vec4 field = vec4(memory * sphereMask, shimmer * sphereMask, previous.b * decay, 1.0);
      ${fieldOutput}
    }`;

  return { vertex, fragment, fieldFragment };
}

export class RealityOrbEngine {
  constructor(canvas, { onOpen } = {}) {
    this.canvas = canvas;
    this.shell = canvas?.closest('.orb-shell') || null;
    this.onOpen = onOpen;
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.uniforms = {};
    this.fieldProgram = null;
    this.fieldUniforms = {};
    this.fieldTextures = [];
    this.fieldFramebuffers = [];
    this.fieldRead = 0;
    this.fieldEnabled = false;
    this.neutralField = null;
    this.memoryStrength = 0;
    this.webgl2 = false;
    this.ready = false;
    this.lost = false;
    this.destroyed = false;
    this.visible = true;
    this.raf = 0;
    this.lastFrame = 0;
    this.frameEma = 16.7;
    this.qualityFrames = 0;
    this.lastQualityChange = 0;
    this.startedAt = nowMs();
    this.boostUntil = 0;
    this.opening = false;
    this.down = false;
    this.activePointer = null;
    this.holdStartedAt = 0;
    this.lastInputAt = 0;
    this.lastTapAt = 0;
    this.lastHapticAt = 0;
    this.totalTravel = 0;
    this.angularTravel = 0;
    this.previousAngle = 0;
    this.settleTimer = 0;
    this.holdTimers = [];
    this.cssPhaseTimers = new Map();
    this.status = document.querySelector('#orbStatus');

    this.pointer = { x: .5, y: .5, targetX: .5, targetY: .5, previousX: .5, previousY: .5 };
    this.velocity = { x: 0, y: 0 };
    this.trail = Array.from({ length: 3 }, () => ({ x: .5, y: .5 }));
    this.state = { energy: 0, pressure: 0, charge: 0, release: 0, resonance: 0, spin: 0, flick: 0 };

    const cores = Number(navigator.hardwareConcurrency || 4);
    const memory = Number(navigator.deviceMemory || 4);
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.deviceTier = this.reducedMotion || cores <= 2 || memory <= 2 ? 'low' : cores <= 4 || memory <= 4 ? 'mid' : 'high';
    this.baseScale = this.deviceTier === 'low' ? .78 : this.deviceTier === 'mid' ? .90 : 1;
    this.minimumScale = this.deviceTier === 'low' ? .62 : this.deviceTier === 'mid' ? .70 : .76;
    this.renderScale = this.baseScale;
    this.maxPixels = this.deviceTier === 'low' ? 960 : this.deviceTier === 'mid' ? 1440 : 1792;
    this.shaderQuality = this.deviceTier === 'low' ? .66 : this.deviceTier === 'mid' ? .84 : 1;
    this.fieldSize = this.reducedMotion ? 96 : this.deviceTier === 'low' ? 128 : this.deviceTier === 'mid' ? 192 : 256;
    this.dpr = clamp(window.devicePixelRatio || 1, 1, 3);

    this.init();
  }

  init() {
    if (!this.canvas || !this.shell) return;
    this.shell.dataset.orbEngine = 'v67';
    this.shell.classList.add('orb-loading');
    this.shell.style.setProperty('--orb-touch-x', '50%');
    this.shell.style.setProperty('--orb-touch-y', '50%');
    this.shell.style.setProperty('--orb-touch-energy', '0');
    this.shell.style.touchAction = 'none';
    this.shell.style.userSelect = 'none';
    this.shell.style.webkitUserSelect = 'none';
    this.shell.style.webkitTouchCallout = 'none';
    Object.assign(this.canvas.style, {
      display: 'block', position: 'absolute', inset: '0', width: '100%', height: '100%',
      borderRadius: '50%', touchAction: 'none', transform: 'translateZ(0)', imageRendering: 'auto', opacity: '0'
    });
    this.canvas.setAttribute('aria-hidden', 'true');
    this.bindInput();
    this.bindLifecycle();
    try {
      if (!this.createRenderer()) return;
      this.resize();
      this.loadTexture();
      this.requestFrame();
    } catch (error) {
      console.warn('Reality Orb renderer unavailable:', error);
      this.fallback('renderer');
    }
  }

  bindLifecycle() {
    this.onContextLost = event => {
      event.preventDefault();
      this.lost = true;
      this.stop();
      this.fallback('context-lost');
    };
    this.onContextRestored = () => {
      this.lost = false;
      this.canvas.style.display = 'block';
      this.canvas.style.opacity = '0';
      this.shell.classList.add('orb-loading');
      try {
        if (this.createRenderer()) {
          this.resize();
          this.loadTexture();
          this.requestFrame();
        }
      } catch (error) {
        console.warn('Reality Orb restore unavailable:', error);
        this.fallback('restore');
      }
    };
    this.canvas.addEventListener('webglcontextlost', this.onContextLost, { passive: false });
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.shell);
    this.onWindowResize = () => {
      this.dpr = clamp(window.devicePixelRatio || 1, 1, 3);
      this.resize();
    };
    window.addEventListener('resize', this.onWindowResize, { passive: true });

    this.onVisibilityChange = () => {
      if (document.hidden) this.stop();
      else { this.lastFrame = 0; this.requestFrame(); }
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.intersectionObserver = new IntersectionObserver(entries => {
      this.visible = Boolean(entries[0]?.isIntersecting);
      if (this.visible) { this.lastFrame = 0; this.resize(); this.requestFrame(); }
      else this.stop();
    }, { threshold: .01 });
    this.intersectionObserver.observe(this.shell);

    this.onWindowBlur = () => {
      if (this.down) this.cancelActiveTouch();
    };
    window.addEventListener('blur', this.onWindowBlur, { passive: true });
  }

  createRenderer() {
    const attributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      desynchronized: true,
      failIfMajorPerformanceCaveat: false
    };
    const gl2 = this.canvas.getContext('webgl2', attributes);
    const gl = gl2 || this.canvas.getContext('webgl', attributes) || this.canvas.getContext('experimental-webgl', attributes);
    if (!gl) { this.fallback('no-webgl'); return false; }
    this.gl = gl;
    this.webgl2 = Boolean(gl2);
    this.lost = false;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    const precisionInfo = gl.getShaderPrecisionFormat?.(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const precision = precisionInfo?.precision > 0 ? 'highp' : 'mediump';
    const source = shaderSources(this.webgl2, precision);
    const vertexShader = this.compile(gl.VERTEX_SHADER, source.vertex);
    const fragmentShader = this.compile(gl.FRAGMENT_SHADER, source.fragment);
    if (!vertexShader || !fragmentShader) { this.fallback('shader'); return false; }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Reality Orb program:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      this.fallback('program');
      return false;
    }
    this.program = program;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.buffer = buffer;
    this.mainPosition = position;

    const names = ['uTime', 'uPointer', 'uVelocity', 'uTrail1', 'uTrail2', 'uTrail3',
      'uEnergy', 'uPressure', 'uCharge', 'uRelease', 'uResonance', 'uSpin', 'uFlick', 'uQuality', 'uBreathStrength', 'uFieldTexel', 'uMemoryStrength'];
    this.uniforms = Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));
    gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'uField'), 1);

    this.fieldEnabled = this.createFieldPipeline(source);
    if (!this.fieldEnabled) this.createNeutralFieldTexture();

    const viewportLimit = Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || this.maxPixels);
    this.maxPixels = Math.min(this.maxPixels, viewportLimit);
    return true;
  }

  compile(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Reality Orb shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createFieldPipeline(source) {
    const gl = this.gl;
    const vertexShader = this.compile(gl.VERTEX_SHADER, source.vertex);
    const fragmentShader = this.compile(gl.FRAGMENT_SHADER, source.fieldFragment);
    if (!vertexShader || !fragmentShader) return false;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Reality Orb memory field:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return false;
    }

    this.fieldProgram = program;
    this.fieldPosition = gl.getAttribLocation(program, 'aPosition');
    const names = ['uTime', 'uDelta', 'uDown', 'uEnergy', 'uFlick', 'uPointer', 'uVelocity', 'uTrail1', 'uTrail2', 'uTrail3'];
    this.fieldUniforms = Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));
    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, 'uPreviousField'), 1);

    this.fieldTextures = [];
    this.fieldFramebuffers = [];
    for (let index = 0; index < 2; index++) {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const internalFormat = this.webgl2 ? gl.RGBA8 : gl.RGBA;
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, this.fieldSize, this.fieldSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return false;
      }
      gl.viewport(0, 0, this.fieldSize, this.fieldSize);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.fieldTextures.push(texture);
      this.fieldFramebuffers.push(framebuffer);
    }

    this.fieldRead = 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, Math.max(1, this.canvas.width), Math.max(1, this.canvas.height));
    gl.clearColor(0, 0, 0, 0);
    gl.useProgram(this.program);
    this.bindQuad(this.mainPosition);
    return true;
  }

  createNeutralFieldTexture() {
    const gl = this.gl;
    if (!gl) return;
    const texture = gl.createTexture();
    this.neutralField = texture;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.activeTexture(gl.TEXTURE0);
  }

  bindQuad(position) {
    const gl = this.gl;
    if (!gl || position == null || position < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  updateField(time, seconds) {
    if (!this.fieldEnabled || !this.fieldProgram || this.fieldTextures.length !== 2) return;
    const gl = this.gl;
    const writeIndex = 1 - this.fieldRead;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fieldFramebuffers[writeIndex]);
    gl.viewport(0, 0, this.fieldSize, this.fieldSize);
    gl.useProgram(this.fieldProgram);
    this.bindQuad(this.fieldPosition);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fieldTextures[this.fieldRead]);
    gl.uniform1f(this.fieldUniforms.uTime, (time - this.startedAt) / 1000);
    gl.uniform1f(this.fieldUniforms.uDelta, seconds);
    gl.uniform1f(this.fieldUniforms.uDown, this.down ? 1 : 0);
    gl.uniform1f(this.fieldUniforms.uEnergy, this.state.energy);
    gl.uniform1f(this.fieldUniforms.uFlick, this.state.flick);
    gl.uniform2f(this.fieldUniforms.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform2f(this.fieldUniforms.uVelocity, clamp(this.velocity.x * .28, -2.6, 2.6), clamp(this.velocity.y * .28, -2.6, 2.6));
    gl.uniform2f(this.fieldUniforms.uTrail1, this.trail[0].x, this.trail[0].y);
    gl.uniform2f(this.fieldUniforms.uTrail2, this.trail[1].x, this.trail[1].y);
    gl.uniform2f(this.fieldUniforms.uTrail3, this.trail[2].x, this.trail[2].y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.fieldRead = writeIndex;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  loadTexture() {
    const gl = this.gl;
    if (!gl || this.lost) return;
    this.ready = false;
    this.shell.classList.add('orb-loading');
    this.canvas.style.display = 'block';
    this.canvas.style.opacity = '0';
    const texture = gl.createTexture();
    this.texture = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([35, 4, 52, 255]));

    const candidates = [
      new URL('./divina-orb-v48.png?v=67', import.meta.url).href,
      new URL('./divina-orb-v48.png', import.meta.url).href,
      new URL('./divina-orb.png?v=67', import.meta.url).href
    ];
    let attempt = 0;
    const tryNextImage = () => {
      if (attempt >= candidates.length) {
        this.fallback('image');
        return;
      }
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (!this.gl || this.lost || this.destroyed) return;
        try {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          if (gl.UNPACK_COLORSPACE_CONVERSION_WEBGL !== undefined) gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          const powerOfTwo = value => (value & (value - 1)) === 0;
          if (powerOfTwo(image.width) && powerOfTwo(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          }
          const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic') ||
            gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
          if (anisotropy) {
            const maximum = gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
            gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(4, maximum));
          }
          this.ready = true;
          this.shell.classList.remove('orb-loading', 'webgl-fallback');
          this.shell.classList.add('orb-live');
          this.shell.removeAttribute('data-orb-fallback');
          this.canvas.style.opacity = '1';
          this.requestFrame();
        } catch (error) {
          console.warn('Reality Orb texture unavailable:', error);
          tryNextImage();
        }
      };
      image.onerror = tryNextImage;
      image.src = candidates[attempt++];
    };
    tryNextImage();
  }

  resize() {
    if (!this.gl || this.lost || this.destroyed) return;
    const rect = this.shell.getBoundingClientRect();
    const cssSize = Math.max(190, Math.min(rect.width || 190, rect.height || rect.width || 190));
    const target = Math.round(cssSize * this.dpr * this.renderScale);
    const pixels = Math.max(360, Math.min(this.maxPixels, target));
    if (this.canvas.width !== pixels || this.canvas.height !== pixels) {
      this.canvas.width = pixels;
      this.canvas.height = pixels;
      this.gl.viewport(0, 0, pixels, pixels);
      this.lastFrame = 0;
    }
  }

  point(event) {
    const rect = this.shell.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / Math.max(1, rect.width)),
      y: 1 - clamp((event.clientY - rect.top) / Math.max(1, rect.height))
    };
  }

  blockGesture(event) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  }

  bindInput() {
    const shell = this.shell;
    this.blockOnly = event => this.blockGesture(event);
    this.blockedGestureTypes = ['contextmenu', 'dragstart', 'dblclick', 'gesturestart', 'gesturechange', 'gestureend'];
    this.blockedGestureTypes.forEach(type => {
      shell.addEventListener(type, this.blockOnly, { passive: false });
    });

    this.onPointerDown = event => {
      this.blockGesture(event);
      if (this.activePointer !== null && event.pointerId !== this.activePointer) {
        this.state.resonance = Math.max(this.state.resonance, .85);
        this.state.energy = Math.max(this.state.energy, 1.15);
        this.haptic('resonance');
        this.boostUntil = nowMs() + 1600;
        this.requestFrame();
        return;
      }

      clearTimeout(this.settleTimer);
      this.clearHoldTimers();
      this.activePointer = event.pointerId;
      this.down = true;
      this.holdStartedAt = nowMs();
      this.lastInputAt = Number(event.timeStamp || this.holdStartedAt);
      this.totalTravel = 0;
      this.angularTravel = 0;
      const point = this.point(event);
      this.pointer.x = this.pointer.targetX = this.pointer.previousX = point.x;
      this.pointer.y = this.pointer.targetY = this.pointer.previousY = point.y;
      this.setTouchPresentation(point, 1);
      shell.classList.add('is-touching');
      shell.classList.remove('phase-release');
      this.trail.forEach(item => { item.x = point.x; item.y = point.y; });
      this.velocity.x = this.velocity.y = 0;
      this.previousAngle = Math.atan2(point.y - .5, point.x - .5);
      this.state.pressure = event.pressure > 0 ? event.pressure : event.pointerType === 'mouse' ? .22 : .38;
      this.state.energy = Math.max(this.state.energy, 1.02);
      this.state.release = 0;
      this.state.flick = 0;
      this.memoryStrength = 1;
      this.boostUntil = nowMs() + 2400;
      this.lastFrame = 0;
      this.announce('O coração da Orbe reconheceu o seu toque', 'DESPERTA', true);
      this.haptic('touch');
      try { shell.setPointerCapture(event.pointerId); } catch {}
      this.startHoldPhases();
      this.requestFrame();
    };

    this.onPointerMove = event => {
      if (!this.down || event.pointerId !== this.activePointer) return;
      this.blockGesture(event);
      const samples = event.getCoalescedEvents?.() || [event];
      for (const sample of samples) this.ingestSample(sample);

      const predictions = event.getPredictedEvents?.() || [];
      const predicted = predictions[predictions.length - 1];
      if (predicted) {
        const future = this.point(predicted);
        this.pointer.targetX = lerp(this.pointer.targetX, future.x, .24);
        this.pointer.targetY = lerp(this.pointer.targetY, future.y, .24);
      }
      this.boostUntil = nowMs() + 1800;
      this.requestFrame();
    };

    this.onPointerUp = event => this.finishTouch(event, false);
    this.onPointerCancel = event => this.finishTouch(event, true);
    this.onLostCapture = event => {
      if (this.down && event.pointerId === this.activePointer) this.cancelActiveTouch();
    };

    this.pointerMoveEvent = 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove';
    shell.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    shell.addEventListener(this.pointerMoveEvent, this.onPointerMove, { passive: false });
    if (this.pointerMoveEvent !== 'pointermove') shell.addEventListener('pointermove', this.blockOnly, { passive: false });
    shell.addEventListener('pointerup', this.onPointerUp, { passive: false });
    shell.addEventListener('pointercancel', this.onPointerCancel, { passive: false });
    shell.addEventListener('lostpointercapture', this.onLostCapture);
    this.onKeyboardClick = event => {
      if (event.detail === 0) {
        event.preventDefault();
        this.openTarot();
      }
    };
    shell.addEventListener('click', this.onKeyboardClick);
  }

  ingestSample(event) {
    const point = this.point(event);
    const stamp = Number(event.timeStamp || nowMs());
    const seconds = clamp((stamp - this.lastInputAt) / 1000, .004, .06);
    const dx = point.x - this.pointer.targetX;
    const dy = point.y - this.pointer.targetY;
    const distance = Math.hypot(dx, dy);
    const rawVx = dx / seconds;
    const rawVy = dy / seconds;
    this.velocity.x = lerp(this.velocity.x, clamp(rawVx, -7, 7), .48);
    this.velocity.y = lerp(this.velocity.y, clamp(rawVy, -7, 7), .48);
    const speed = clamp(Math.hypot(rawVx, rawVy) * .34, 0, 2.6);

    if (distance > .0015) {
      this.trail[2] = { ...this.trail[1] };
      this.trail[1] = { ...this.trail[0] };
      this.trail[0] = { x: this.pointer.targetX, y: this.pointer.targetY };
    }
    this.pointer.previousX = this.pointer.targetX;
    this.pointer.previousY = this.pointer.targetY;
    this.pointer.targetX = point.x;
    this.pointer.targetY = point.y;
    this.lastInputAt = stamp;
    this.totalTravel += distance;

    const angle = Math.atan2(point.y - .5, point.x - .5);
    let angleDelta = angle - this.previousAngle;
    if (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
    if (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
    this.previousAngle = angle;
    this.angularTravel += Math.abs(angleDelta);
    const angularVelocity = clamp(angleDelta / seconds * .055, -2.2, 2.2);
    this.state.spin = lerp(this.state.spin, angularVelocity, .46);
    this.state.energy = clamp(Math.max(this.state.energy, .72 + speed * .25), 0, 1.55);
    this.state.flick = clamp(Math.max(this.state.flick * .72, speed * .48), 0, 1.35);
    this.state.pressure = event.pressure > 0 ? event.pressure : clamp(.30 + speed * .16, .30, .92);
    this.memoryStrength = 1;
    this.setTouchPresentation(point, clamp(.46 + speed * .30, .46, 1));

    const elapsed = nowMs() - this.holdStartedAt;
    if (this.angularTravel > 1.05) {
      this.state.resonance = clamp(this.state.resonance + Math.abs(angleDelta) * .10, 0, 1.25);
      this.playShellPhase('resonance', 900);
      this.announce('A matéria da Orbe gira junto com você', 'RESSONÂNCIA');
    } else if (speed > 1.12) {
      this.announce('Um fluxo de luz atravessou a Orbe', 'IMPULSO');
    } else if (distance > .005 && elapsed > 70) {
      this.announce('A Orbe acompanha cada movimento do seu dedo', 'FLUXO');
    }
  }

  startHoldPhases() {
    this.holdTimers.push(setTimeout(() => {
      if (!this.down) return;
      this.state.charge = Math.max(this.state.charge, .42);
      this.state.energy = Math.max(this.state.energy, 1.10);
      this.playShellPhase('resonance', 720);
      this.announce('A sua intenção está entrando na Orbe', 'CANALIZA', true);
      this.haptic('hold');
      this.boostUntil = nowMs() + 2300;
      this.requestFrame();
    }, 380));
    this.holdTimers.push(setTimeout(() => {
      if (!this.down) return;
      this.state.resonance = Math.max(this.state.resonance, .95);
      this.state.energy = Math.max(this.state.energy, 1.28);
      this.playShellPhase('resonance', 1500);
      this.announce('A Orbe entrou em ressonância com você', 'RESSONÂNCIA', true);
      this.haptic('resonance');
      this.boostUntil = nowMs() + 3000;
      this.requestFrame();
    }, 1080));
    this.holdTimers.push(setTimeout(() => {
      if (!this.down) return;
      this.state.pressure = 1;
      this.state.charge = 1;
      this.state.resonance = 1.25;
      this.state.energy = 1.52;
      this.playShellPhase('resonance', 2300);
      this.announce('O universo está pulsando dentro da Orbe', 'NÚCLEO', true);
      this.haptic('deep');
      this.boostUntil = nowMs() + 3800;
      this.requestFrame();
    }, 2200));
  }

  finishTouch(event, cancelled) {
    if (!this.down || event.pointerId !== this.activePointer) return;
    this.blockGesture(event);
    const endedAt = nowMs();
    const heldFor = endedAt - this.holdStartedAt;
    this.down = false;
    this.activePointer = null;
    this.shell.classList.remove('is-touching');
    this.shell.style.setProperty('--orb-touch-energy', cancelled ? '.22' : '.64');
    this.playShellPhase('release', cancelled ? 520 : 920);
    this.clearHoldTimers();
    try { this.shell.releasePointerCapture(event.pointerId); } catch {}

    this.state.release = cancelled ? .54 : 1;
    this.state.energy = Math.max(this.state.energy, cancelled ? .65 : heldFor > 900 ? 1.34 : 1.08);
    this.state.resonance = Math.max(this.state.resonance, heldFor > 900 ? .82 : .22);
    this.state.pressure = 0;
    this.memoryStrength = Math.max(this.memoryStrength, 1);
    this.boostUntil = endedAt + 2300;

    const isTap = !cancelled && heldFor < 430 && this.totalTravel < .045;
    if (isTap && this.lastTapAt > 0 && endedAt - this.lastTapAt < 370) {
      this.lastTapAt = 0;
      this.openTarot();
    } else if (isTap) {
      this.lastTapAt = endedAt;
      this.announce('A Orbe guardou o eco do seu toque', 'RESPONDE', true);
      this.haptic('release');
    } else if (!cancelled && this.angularTravel > 1.05) {
      this.state.resonance = Math.max(this.state.resonance, 1.02);
      this.announce('A ressonância circular continua viva', 'RESSONÂNCIA', true);
      this.haptic('resonance');
    } else if (!cancelled) {
      this.announce(heldFor > 900 ? 'Sua intenção foi liberada dentro da Orbe' : 'A luz continua seguindo o seu gesto', 'LIBERA', true);
      this.haptic(heldFor > 900 ? 'deep' : 'release');
    }

    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => {
      if (!this.down && !this.opening) this.announce('A Orbe está respirando', 'RESPIRA', true);
    }, 1180);
    this.requestFrame();
  }

  cancelActiveTouch() {
    this.down = false;
    this.activePointer = null;
    this.shell.classList.remove('is-touching');
    this.shell.style.setProperty('--orb-touch-energy', '.18');
    this.playShellPhase('release', 520);
    this.clearHoldTimers();
    this.state.pressure = 0;
    this.state.release = Math.max(this.state.release, .46);
    this.memoryStrength = Math.max(this.memoryStrength, .72);
    this.boostUntil = nowMs() + 900;
    this.requestFrame();
  }

  clearHoldTimers() {
    this.holdTimers.forEach(clearTimeout);
    this.holdTimers.length = 0;
  }

  setTouchPresentation(point, intensity = 1) {
    if (!this.shell || !point) return;
    this.shell.style.setProperty('--orb-touch-x', `${(clamp(point.x) * 100).toFixed(2)}%`);
    this.shell.style.setProperty('--orb-touch-y', `${((1 - clamp(point.y)) * 100).toFixed(2)}%`);
    this.shell.style.setProperty('--orb-touch-energy', clamp(intensity, 0, 1).toFixed(3));
  }

  playShellPhase(name, duration = 800) {
    if (!this.shell) return;
    const className = `phase-${name}`;
    clearTimeout(this.cssPhaseTimers.get(className));
    this.shell.classList.remove(className);
    requestAnimationFrame(() => {
      if (this.destroyed || !this.shell) return;
      this.shell.classList.add(className);
      const timer = setTimeout(() => {
        this.shell?.classList.remove(className);
        this.cssPhaseTimers.delete(className);
        if (!this.down) this.shell?.style.setProperty('--orb-touch-energy', '0');
      }, duration);
      this.cssPhaseTimers.set(className, timer);
    });
  }

  announce(text, phase = 'RESPIRA', force = false) {
    const time = nowMs();
    if (!force && this.lastAnnouncementAt && time - this.lastAnnouncementAt < 170 && phase === this.lastPhase) return;
    this.lastAnnouncementAt = time;
    this.lastPhase = phase;
    if (this.status) {
      this.status.textContent = text;
      this.status.dataset.state = phase.toLowerCase();
    }
    this.shell.dataset.orbPhase = phase;
    this.shell.dispatchEvent(new CustomEvent('orbphase', { detail: { name: phase, text, energy: this.state.energy }, bubbles: true }));
  }

  haptic(kind = 'touch') {
    const time = nowMs();
    if (time - this.lastHapticAt < 42 && kind !== 'open') return;
    this.lastHapticAt = time;
    const patterns = {
      touch: 8, hold: 15, release: [8, 16, 11], resonance: [10, 20, 14, 24, 22],
      deep: [15, 22, 27], open: [18, 18, 42]
    };
    try {
      const native = window.Capacitor?.Plugins?.Haptics;
      if (native) {
        const style = kind === 'open' || kind === 'deep' || kind === 'resonance' ? 'HEAVY' : kind === 'hold' ? 'MEDIUM' : 'LIGHT';
        native.impact({ style }).catch(() => {});
        return;
      }
      navigator.vibrate?.(patterns[kind] || 8);
    } catch {}
  }

  openTarot() {
    if (this.opening) return;
    this.opening = true;
    clearTimeout(this.settleTimer);
    this.state.energy = 1.55;
    this.state.release = 1;
    this.state.resonance = 1.25;
    this.state.charge = Math.max(this.state.charge, .68);
    this.playShellPhase('resonance', 1500);
    this.boostUntil = nowMs() + 2800;
    this.announce('O portal do Tarot Livre está se abrindo', 'PORTAL', true);
    this.haptic('open');
    this.requestFrame();
    setTimeout(() => this.onOpen?.(), 150);
    setTimeout(() => {
      this.opening = false;
      if (!this.down) this.announce('A Orbe está respirando', 'RESPIRA', true);
    }, 1250);
  }

  requestFrame() {
    if (this.raf || this.destroyed || this.lost || !this.gl || !this.visible || document.hidden) return;
    this.raf = requestAnimationFrame(time => this.draw(time));
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  draw(time) {
    this.raf = 0;
    if (!this.gl || this.lost || this.destroyed || !this.visible || document.hidden) return;

    const active = this.down || time < this.boostUntil || this.state.energy > .035 || this.state.release > .025 ||
      this.state.resonance > .025 || Math.abs(this.state.spin) > .025 || this.state.flick > .025 || this.memoryStrength > .025;
    const idleInterval = this.reducedMotion ? 1000 / 14 : 1000 / 30;
    if (!active && this.lastFrame && time - this.lastFrame < idleInterval) {
      this.requestFrame();
      return;
    }

    const seconds = this.lastFrame ? clamp((time - this.lastFrame) / 1000, .001, .055) : 1 / 60;
    const frameMilliseconds = this.lastFrame ? time - this.lastFrame : 16.7;
    this.lastFrame = time;

    const pointerResponse = expFollow(this.down ? 96 : 24, seconds);
    this.pointer.previousX = this.pointer.x;
    this.pointer.previousY = this.pointer.y;
    this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, pointerResponse);
    this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, pointerResponse);

    if (this.down) {
      const held = clamp((time - this.holdStartedAt) / 1900, 0, 1);
      this.state.charge = lerp(this.state.charge, held, expFollow(3.8, seconds));
      this.state.energy = lerp(this.state.energy, 1.0 + held * .33, expFollow(3.2, seconds));
    } else {
      this.state.energy *= Math.exp(-1.72 * seconds);
      this.state.charge *= Math.exp(-1.18 * seconds);
      this.state.pressure *= Math.exp(-7.4 * seconds);
    }
    this.state.release *= Math.exp(-1.62 * seconds);
    this.state.resonance *= Math.exp(-(this.down ? .20 : .86) * seconds);
    this.state.spin *= Math.exp(-(this.down ? 1.6 : 3.8) * seconds);
    this.state.flick *= Math.exp(-(this.down ? 1.8 : 4.4) * seconds);
    this.velocity.x *= Math.exp(-(this.down ? 2.4 : 5.8) * seconds);
    this.velocity.y *= Math.exp(-(this.down ? 2.4 : 5.8) * seconds);
    this.memoryStrength = this.down ? 1 : this.memoryStrength * Math.exp(-1.72 * seconds);

    if (!this.down) {
      const trailFollow = expFollow(4.2, seconds);
      this.trail[0].x = lerp(this.trail[0].x, this.pointer.x, trailFollow);
      this.trail[0].y = lerp(this.trail[0].y, this.pointer.y, trailFollow);
      for (let index = 1; index < this.trail.length; index++) {
        this.trail[index].x = lerp(this.trail[index].x, this.trail[index - 1].x, trailFollow * .82);
        this.trail[index].y = lerp(this.trail[index].y, this.trail[index - 1].y, trailFollow * .82);
      }
    }

    const gl = this.gl;
    this.updateField(time, seconds);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    this.bindQuad(this.mainPosition);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fieldEnabled ? this.fieldTextures[this.fieldRead] : this.neutralField);
    gl.uniform1f(this.uniforms.uTime, (time - this.startedAt) / 1000);
    gl.uniform2f(this.uniforms.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform2f(this.uniforms.uVelocity, clamp(this.velocity.x * .28, -2.6, 2.6), clamp(this.velocity.y * .28, -2.6, 2.6));
    gl.uniform2f(this.uniforms.uTrail1, this.trail[0].x, this.trail[0].y);
    gl.uniform2f(this.uniforms.uTrail2, this.trail[1].x, this.trail[1].y);
    gl.uniform2f(this.uniforms.uTrail3, this.trail[2].x, this.trail[2].y);
    gl.uniform1f(this.uniforms.uEnergy, this.reducedMotion ? this.state.energy * .58 : this.state.energy);
    gl.uniform1f(this.uniforms.uPressure, this.state.pressure);
    gl.uniform1f(this.uniforms.uCharge, this.reducedMotion ? this.state.charge * .55 : this.state.charge);
    gl.uniform1f(this.uniforms.uRelease, this.reducedMotion ? this.state.release * .52 : this.state.release);
    gl.uniform1f(this.uniforms.uResonance, this.reducedMotion ? this.state.resonance * .45 : this.state.resonance);
    gl.uniform1f(this.uniforms.uSpin, this.state.spin);
    gl.uniform1f(this.uniforms.uFlick, this.state.flick);
    gl.uniform1f(this.uniforms.uQuality, this.shaderQuality);
    gl.uniform1f(this.uniforms.uBreathStrength, this.reducedMotion ? .28 : 1);
    const fieldTexel = this.fieldEnabled ? 1 / this.fieldSize : 1;
    gl.uniform2f(this.uniforms.uFieldTexel, fieldTexel, fieldTexel);
    gl.uniform1f(this.uniforms.uMemoryStrength, this.fieldEnabled ? this.memoryStrength : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if ((this.down || time < this.boostUntil) && frameMilliseconds < 70) this.adaptQuality(frameMilliseconds, time);
    this.requestFrame();
  }

  adaptQuality(frameMilliseconds, time) {
    this.frameEma = this.frameEma * .94 + frameMilliseconds * .06;
    this.qualityFrames += 1;
    if (this.qualityFrames < 84 || time - this.lastQualityChange < 2600) return;
    this.qualityFrames = 0;
    let nextScale = this.renderScale;
    if (this.frameEma > 22.5) nextScale = Math.max(this.minimumScale, this.renderScale - .055);
    else if (this.frameEma < 18.2) nextScale = Math.min(this.baseScale, this.renderScale + .035);
    if (Math.abs(nextScale - this.renderScale) > .001) {
      this.renderScale = nextScale;
      this.lastQualityChange = time;
      this.resize();
    }
  }

  fallback(reason = 'unknown') {
    this.ready = false;
    this.stop();
    if (this.canvas) {
      this.canvas.style.display = 'block';
      this.canvas.style.opacity = '0';
    }
    this.shell?.classList.remove('orb-loading', 'orb-live');
    this.shell?.classList.add('webgl-fallback');
    if (this.shell) this.shell.dataset.orbFallback = reason;
    this.announce('A Orbe está respirando', 'RESPIRA', true);
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    this.clearHoldTimers();
    this.cssPhaseTimers.forEach(clearTimeout);
    this.cssPhaseTimers.clear();
    clearTimeout(this.settleTimer);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('blur', this.onWindowBlur);
    this.blockedGestureTypes?.forEach(type => this.shell?.removeEventListener(type, this.blockOnly));
    this.shell?.removeEventListener('pointerdown', this.onPointerDown);
    this.shell?.removeEventListener(this.pointerMoveEvent || 'pointermove', this.onPointerMove);
    if (this.pointerMoveEvent && this.pointerMoveEvent !== 'pointermove') this.shell?.removeEventListener('pointermove', this.blockOnly);
    this.shell?.removeEventListener('pointerup', this.onPointerUp);
    this.shell?.removeEventListener('pointercancel', this.onPointerCancel);
    this.shell?.removeEventListener('lostpointercapture', this.onLostCapture);
    this.shell?.removeEventListener('click', this.onKeyboardClick);
    this.canvas?.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas?.removeEventListener('webglcontextrestored', this.onContextRestored);
    const gl = this.gl;
    if (gl) {
      if (this.texture) gl.deleteTexture(this.texture);
      if (this.neutralField) gl.deleteTexture(this.neutralField);
      this.fieldTextures.forEach(texture => gl.deleteTexture(texture));
      this.fieldFramebuffers.forEach(framebuffer => gl.deleteFramebuffer(framebuffer));
      if (this.buffer) gl.deleteBuffer(this.buffer);
      if (this.fieldProgram) gl.deleteProgram(this.fieldProgram);
      if (this.program) gl.deleteProgram(this.program);
    }
  }
}

export default RealityOrbEngine;
