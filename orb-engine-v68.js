/*
 * DIVINA BRUXA — LIVING MATTER ENGINE V69 · IDLE GALAXY
 *
 * A borda da esfera nunca se move. A vida acontece dentro dela:
 * respiração orgânica, matéria líquida, profundidade óptica, cáusticas,
 * resposta localizada ao toque, memória curta do gesto e dois pulsos vitais.
 * O motor usa WebGL 1 para máxima compatibilidade e conserva a fotografia
 * como fallback permanente — inclusive em computadores sem aceleração gráfica.
 */

const ORB_IMAGE = new URL('./divina-orb-v68.png?v=69', import.meta.url).href;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const follow = (rate, seconds) => 1 - Math.exp(-rate * seconds);
const clock = () => performance.now();

const VERTEX_SHADER = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main(){
    vUv = aPosition * .5 + .5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision __PRECISION__ float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uBreath;
  uniform float uEnergy;
  uniform float uPressure;
  uniform float uTouch;
  uniform float uRippleAge;
  uniform float uSpin;
  uniform float uReduced;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform vec2 uRippleOrigin;

  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise21(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p){
    float value = 0.0;
    float amplitude = .52;
    mat2 turn = mat2(.80, .60, -.60, .80);
    for(int index = 0; index < 5; index++){
      value += amplitude * noise21(p);
      p = turn * p * 2.03 + vec2(7.1, 3.4);
      amplitude *= .5;
    }
    return value;
  }

  vec2 rotatePoint(vec2 point, float angle){
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine) * point;
  }

  void main(){
    vec2 sphere = (vUv - .5) * 2.0;
    float radius = length(sphere);
    if(radius > 1.0) discard;

    float edge = 1.0 - smoothstep(.974, 1.0, radius);
    float depth = sqrt(max(0.0, 1.0 - radius * radius));
    float inner = pow(max(0.0, 1.0 - radius), .52);
    float time = uTime * mix(1.0, .28, uReduced);
    float energy = clamp(uEnergy, 0.0, 1.5);

    vec2 finger = (uPointer - .5) * 2.0;
    vec2 ripplePoint = (uRippleOrigin - .5) * 2.0;
    vec2 fromFinger = sphere - finger;
    float fingerDistance = length(fromFinger);
    vec2 fingerDirection = fromFinger / max(fingerDistance, .001);
    float touchField = exp(-fingerDistance * fingerDistance * 7.8);

    float rippleDistance = length(sphere - ripplePoint);
    vec2 rippleDirection = (sphere - ripplePoint) / max(rippleDistance, .001);
    float rippleLife = exp(-uRippleAge * 1.48);
    float rippleWave = sin(rippleDistance * 25.0 - uRippleAge * 8.6) *
      exp(-rippleDistance * 2.8) * rippleLife;

    float slowNoise = fbm(sphere * 1.42 + vec2(time * .067, -time * .049));
    float fineNoise = fbm(sphere * 3.24 + vec2(-time * .078, time * .058) + slowNoise * 1.24);
    vec2 livingFlow = vec2(slowNoise - .5, fineNoise - .5);
    float livingTide = sin(time * .34 + slowNoise * 6.28318 + radius * 3.2);

    // A fotografia respira por dentro. A circunferência externa permanece fixa.
    float innerScale = .982 - uBreath * .028 - energy * .004 * inner;
    vec2 material = sphere * innerScale;
    float soulTurn = sin(time * .21) * .014 + (uBreath - .5) * .021 +
      livingTide * .004 + uSpin * .018;
    material = rotatePoint(material, soulTurn * (1.0 - radius * .68));
    vec2 tangent = vec2(-material.y, material.x);
    material += tangent * (slowNoise - .5) * (.031 + uBreath * .012) * inner;
    material += tangent * livingTide * .006 * inner;
    material += livingFlow * (.017 + energy * .010) * inner;
    material -= uVelocity * touchField * (.012 + uPressure * .016);
    material += fingerDirection * touchField * uTouch * (.012 + uPressure * .019);
    material += rippleDirection * rippleWave * (.013 + energy * .008);

    vec2 sampleUv = clamp(material * .5 + .5, vec2(.008), vec2(.992));
    vec2 deepMaterial = rotatePoint(material * (.992 - uBreath * .006),
      -.012 - slowNoise * .014 + time * .0043);
    vec2 nearMaterial = rotatePoint(material * .986,
      .010 + fineNoise * .012 - time * .0035);

    vec4 base = texture2D(uTexture, sampleUv);
    vec4 deepLayer = texture2D(uTexture, clamp(deepMaterial * .5 + .5, vec2(.008), vec2(.992)));
    vec4 nearLayer = texture2D(uTexture, clamp(nearMaterial * .5 + .5, vec2(.008), vec2(.992)));
    vec3 color = base.rgb * .72 + deepLayer.rgb * .16 + nearLayer.rgb * .12;

    // Respiração profunda e uma maré luminosa que nunca congela.
    float galaxyWave = .5 + .5 * sin(time * .48 - radius * 8.0 + slowNoise * 3.7);
    color *= .855 + uBreath * .245 + galaxyWave * .058 * inner + energy * .055;
    color = pow(max(color, vec3(0.0)), vec3(.965));
    float caustic = pow(.5 + .5 * sin((slowNoise + fineNoise) * 19.0 - time * .66), 14.0);
    color += mix(vec3(.40, .10, .78), vec3(1.0, .56, .19), fineNoise) *
      caustic * (.034 + uBreath * .050) * inner;

    // Uma presença luminosa atravessa lentamente a galáxia em repouso.
    vec2 wanderingSoul = vec2(sin(time * .21), cos(time * .17)) * .27;
    float wanderingGlow = exp(-dot(sphere - wanderingSoul, sphere - wanderingSoul) * 4.2);
    vec3 wanderingColor = mix(vec3(.49, .12, 1.0), vec3(1.0, .48, .20),
      .5 + .5 * sin(time * .13));
    color += wanderingColor * wanderingGlow * (.028 + uBreath * .052) * inner;

    // Somente as estrelas já presentes na fotografia cintilam: não há pontos sobrepostos.
    float sourceLight = max(base.r, max(base.g, base.b));
    float existingStar = pow(smoothstep(.70, 1.0, sourceLight), 2.5);
    float starRhythm = .5 + .5 * sin(time * 3.15 + sampleUv.x * 187.0 +
      sampleUv.y * 131.0 + fineNoise * 18.0);
    float starTwinkle = pow(starRhythm, 8.0) * existingStar;
    color += mix(vec3(.88, .77, 1.0), vec3(1.0, .72, .30), slowNoise) *
      starTwinkle * (.075 + uBreath * .055);

    float touchCore = exp(-fingerDistance * fingerDistance * 31.0);
    color += vec3(.86, .20, 1.0) * touchField * energy * .11;
    color += vec3(1.0, .88, .72) * touchCore * (uTouch + uPressure) * .22;
    color += mix(vec3(.51, .20, 1.0), vec3(1.0, .50, .22), slowNoise) *
      abs(rippleWave) * (.09 + energy * .07);

    vec3 normal = normalize(vec3(sphere, depth));
    vec3 light = normalize(vec3(-.46, .62, .78));
    float diffuse = max(0.0, dot(normal, light));
    float specular = pow(max(0.0, dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0))), 46.0);
    float fresnel = pow(1.0 - depth, 2.35);
    color *= .93 + diffuse * .075;
    color += vec3(1.0, .92, .78) * specular * .13;
    color += mix(vec3(.32, .09, .82), vec3(1.0, .35, .72), fineNoise) * fresnel * .18;

    float heart = exp(-dot(sphere - vec2(-.015, .015), sphere - vec2(-.015, .015)) * 7.2);
    color += mix(vec3(.52, .12, 1.0), vec3(1.0, .65, .34), slowNoise) *
      heart * (.032 + uBreath * .078 + energy * .025);

    gl_FragColor = vec4(color, edge);
  }
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Não foi possível compilar a matéria da Orbe.';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function gaussian(value, center, width) {
  const distance = (value - center) / width;
  return Math.exp(-distance * distance);
}

export class RealityOrbEngine {
  constructor(canvas, { onOpen } = {}) {
    if (!canvas) throw new Error('O canvas da Orbe não foi encontrado.');
    this.canvas = canvas;
    this.shell = canvas.closest('.orb-shell');
    this.status = document.querySelector('#orbStatus');
    this.onOpen = onOpen;
    this.startedAt = clock();
    this.lastFrame = 0;
    this.lastTap = 0;
    this.lastTapPoint = { x: .5, y: .5 };
    this.opening = false;
    this.destroyed = false;
    this.visible = true;
    this.ready = false;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pixelRatio = Math.min(devicePixelRatio || 1, this.reducedMotion ? 1.25 : 2);
    this.frameAverage = 16.7;
    this.qualitySamples = 0;
    this.lastQualityChange = 0;
    this.pointerId = null;
    this.down = false;
    this.hovering = false;
    this.moved = false;
    this.pressStartedAt = 0;
    this.startPoint = { x: .5, y: .5 };
    this.pointer = { x: .5, y: .5, targetX: .5, targetY: .5, previousX: .5, previousY: .5 };
    this.velocity = { x: 0, y: 0 };
    this.ripple = { x: .5, y: .5, age: 99 };
    this.energy = .16;
    this.targetEnergy = .16;
    this.pressure = 0;
    this.targetPressure = 0;
    this.spin = 0;
    this.raf = 0;
    this.phaseTimer = 0;
    this.tapTimer = 0;
    this.bind();
    this.prepare().catch(error => this.fallback(error?.message || 'renderer'));
  }

  async prepare() {
    const image = new Image();
    image.decoding = 'async';
    image.src = ORB_IMAGE;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('imagem'));
      if (image.complete && image.naturalWidth) resolve();
    });
    try { await image.decode?.(); } catch {}
    if (this.destroyed) return;
    this.image = image;
    this.setupWebGL();
    this.resize();
    this.ready = true;
    this.shell?.classList.remove('orb-loading', 'webgl-fallback');
    this.shell?.classList.add('orb-live');
    this.announce('A Orbe está respirando', 'RESPIRA');
    this.requestFrame();
  }

  setupWebGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });
    if (!gl) throw new Error('webgl');
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ? 'highp' : 'mediump';
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER.replace('__PRECISION__', precision));
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'programa');
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    this.gl = gl;
    this.program = program;
    this.buffer = buffer;
    this.texture = texture;
    this.uniforms = {};
    [
      'uTexture', 'uTime', 'uBreath', 'uEnergy', 'uPressure', 'uTouch',
      'uRippleAge', 'uSpin', 'uReduced', 'uPointer', 'uVelocity', 'uRippleOrigin'
    ].forEach(name => { this.uniforms[name] = gl.getUniformLocation(program, name); });
    gl.uniform1i(this.uniforms.uTexture, 0);

    this.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.fallback('contexto');
    });
  }

  bind() {
    this.shell?.classList.add('orb-loading');
    this.onPointerDown = event => this.pointerDown(event);
    this.onPointerMove = event => this.pointerMove(event);
    this.onPointerUp = event => this.pointerUp(event);
    this.onPointerCancel = event => this.pointerCancel(event);
    this.onPointerEnter = event => {
      if (event.pointerType === 'mouse') {
        this.hovering = true;
        this.moveTarget(event);
      }
    };
    this.onPointerLeave = event => {
      if (event.pointerType === 'mouse' && !this.down) this.hovering = false;
    };
    this.onClick = event => {
      event.preventDefault();
      if (event.detail === 0) this.open();
    };
    this.onDoubleClick = event => event.preventDefault();
    this.onResize = () => this.resize();
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else {
        this.lastFrame = 0;
        this.requestFrame();
      }
    };

    this.shell?.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    this.shell?.addEventListener('pointermove', this.onPointerMove, { passive: false });
    this.shell?.addEventListener('pointerup', this.onPointerUp, { passive: false });
    this.shell?.addEventListener('pointercancel', this.onPointerCancel, { passive: false });
    this.shell?.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
    this.shell?.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    this.shell?.addEventListener('click', this.onClick);
    this.shell?.addEventListener('dblclick', this.onDoubleClick);
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    }
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(entries => {
        this.visible = entries[0]?.isIntersecting !== false;
        if (this.visible) this.requestFrame();
        else this.stop();
      }, { rootMargin: '160px' });
      this.intersectionObserver.observe(this.shell);
    }
  }

  locate(event) {
    const rect = this.shell.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / Math.max(rect.width, 1)),
      y: clamp((event.clientY - rect.top) / Math.max(rect.height, 1))
    };
  }

  moveTarget(event) {
    const point = this.locate(event);
    this.pointer.targetX = point.x;
    this.pointer.targetY = point.y;
    this.shell?.style.setProperty('--orb-touch-x', `${(point.x * 100).toFixed(2)}%`);
    this.shell?.style.setProperty('--orb-touch-y', `${(point.y * 100).toFixed(2)}%`);
    return point;
  }

  pointerDown(event) {
    if (this.opening) return;
    event.preventDefault();
    const point = this.moveTarget(event);
    this.pointerId = event.pointerId;
    this.down = true;
    this.moved = false;
    this.pressStartedAt = clock();
    this.startPoint = point;
    this.pointer.x = point.x;
    this.pointer.y = point.y;
    this.pointer.previousX = point.x;
    this.pointer.previousY = point.y;
    this.ripple = { x: point.x, y: point.y, age: 0 };
    this.targetEnergy = 1;
    this.targetPressure = clamp(event.pressure || .48, .32, 1);
    this.shell?.classList.add('is-touching');
    this.announce('A Orbe reconheceu seu toque', 'DESPERTA');
    try { this.shell?.setPointerCapture(event.pointerId); } catch {}
    this.haptic(8);
    this.requestFrame();
  }

  pointerMove(event) {
    if (event.pointerType === 'mouse' && !this.down) {
      this.hovering = true;
      this.moveTarget(event);
      this.targetEnergy = Math.max(this.targetEnergy, .24);
      this.requestFrame();
      return;
    }
    if (!this.down || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    const samples = event.getCoalescedEvents?.() || [event];
    const previous = { x: this.pointer.targetX, y: this.pointer.targetY };
    let point = previous;
    for (const sample of samples) point = this.moveTarget(sample);
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    this.velocity.x = lerp(this.velocity.x, clamp(dx * 18, -1.6, 1.6), .62);
    this.velocity.y = lerp(this.velocity.y, clamp(-dy * 18, -1.6, 1.6), .62);
    const before = { x: previous.x - .5, y: previous.y - .5 };
    const after = { x: point.x - .5, y: point.y - .5 };
    this.spin += clamp(before.x * after.y - before.y * after.x, -.035, .035) * 1.8;
    if (Math.hypot(point.x - this.startPoint.x, point.y - this.startPoint.y) > .032) this.moved = true;
    this.targetEnergy = clamp(.94 + Math.hypot(this.velocity.x, this.velocity.y) * .28, .94, 1.38);
    this.targetPressure = clamp(event.pressure || this.targetPressure || .52, .28, 1);
    this.requestFrame();
  }

  pointerUp(event) {
    if (!this.down || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    const point = this.moveTarget(event);
    const wasTap = !this.moved && clock() - this.pressStartedAt < 720;
    this.releaseTouch(point);
    if (wasTap) this.handleTap(point);
    else {
      this.pulse('A matéria acompanhou o seu gesto', .82);
      this.haptic(11);
    }
  }

  pointerCancel(event) {
    if (!this.down || event.pointerId !== this.pointerId) return;
    this.releaseTouch({ x: this.pointer.targetX, y: this.pointer.targetY });
  }

  releaseTouch(point) {
    this.down = false;
    this.pointerId = null;
    this.targetPressure = 0;
    this.targetEnergy = .38;
    this.ripple = { x: point.x, y: point.y, age: 0 };
    this.shell?.classList.remove('is-touching');
    this.playPhase('phase-release', 920);
    this.requestFrame();
  }

  handleTap(point) {
    const now = clock();
    const closeInTime = now - this.lastTap < 430;
    const closeInSpace = Math.hypot(point.x - this.lastTapPoint.x, point.y - this.lastTapPoint.y) < .16;
    if (closeInTime && closeInSpace) {
      clearTimeout(this.tapTimer);
      this.lastTap = 0;
      this.open();
      return;
    }
    this.lastTap = now;
    this.lastTapPoint = point;
    this.pulse('A Orbe despertou — toque novamente para abrir', 1.05);
    clearTimeout(this.tapTimer);
    this.tapTimer = setTimeout(() => {
      if (!this.down && !this.opening) this.announce('A Orbe está respirando', 'RESPIRA');
    }, 1500);
  }

  pulse(message = 'A Orbe despertou', strength = 1) {
    this.targetEnergy = Math.max(this.targetEnergy, strength);
    this.ripple = { x: this.pointer.targetX, y: this.pointer.targetY, age: 0 };
    this.announce(message, 'PULSO');
    this.haptic(7);
    setTimeout(() => {
      if (!this.down && !this.opening) this.targetEnergy = .17;
    }, 520);
    this.requestFrame();
  }

  open() {
    if (this.opening) return;
    this.opening = true;
    clearTimeout(this.tapTimer);
    this.targetEnergy = 1.48;
    this.targetPressure = .72;
    this.ripple = { x: this.pointer.targetX, y: this.pointer.targetY, age: 0 };
    this.playPhase('phase-resonance', 1250);
    this.announce('O portal do Tarot Livre está se abrindo', 'PORTAL');
    this.haptic([12, 28, 18]);
    this.requestFrame();
    setTimeout(() => this.onOpen?.(), 180);
    setTimeout(() => {
      this.opening = false;
      this.targetPressure = 0;
      this.targetEnergy = .16;
    }, 1100);
  }

  playPhase(className, duration) {
    clearTimeout(this.phaseTimer);
    this.shell?.classList.remove('phase-release', 'phase-resonance');
    void this.shell?.offsetWidth;
    this.shell?.classList.add(className);
    this.phaseTimer = setTimeout(() => this.shell?.classList.remove(className), duration);
  }

  announce(message, phase) {
    if (this.status) this.status.textContent = message;
    if (this.shell) this.shell.dataset.orbPhase = phase;
  }

  haptic(pattern) {
    try { navigator.vibrate?.(pattern); } catch {}
  }

  breathAt(seconds) {
    const phase = (seconds % 7.8) / 7.8;
    const wave = .5 - .5 * Math.cos(phase * Math.PI * 2);
    const lung = wave * wave * (3 - 2 * wave);
    const firstPulse = gaussian(phase, .535, .025);
    const secondPulse = gaussian(phase, .615, .034) * .62;
    return clamp(.10 + lung * .76 + firstPulse * .17 + secondPulse * .13, 0, 1.08);
  }

  resize() {
    if (!this.gl || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const width = Math.max(256, Math.round(rect.width * this.pixelRatio));
    const height = Math.max(256, Math.round(rect.height * this.pixelRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  update(time, seconds) {
    const elapsed = (time - this.startedAt) / 1000;
    if (!this.down && !this.hovering) {
      this.pointer.targetX = .5 + Math.sin(elapsed * .23) * .075;
      this.pointer.targetY = .5 + Math.cos(elapsed * .19) * .055;
    }
    const pointerFollow = follow(this.down ? 42 : 5.4, seconds);
    this.pointer.previousX = this.pointer.x;
    this.pointer.previousY = this.pointer.y;
    this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, pointerFollow);
    this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, pointerFollow);
    if (this.down) {
      const held = clamp((time - this.pressStartedAt) / 1650);
      this.targetEnergy = Math.max(this.targetEnergy, .92 + held * .35);
      this.targetPressure = Math.max(this.targetPressure, .36 + held * .56);
      if (held > .72) this.announce('A Orbe guarda a sua intenção', 'INTENÇÃO');
    } else {
      this.targetEnergy = Math.max(this.hovering ? .24 : .16, this.targetEnergy * Math.exp(-1.9 * seconds));
    }
    this.energy = lerp(this.energy, this.targetEnergy, follow(this.down ? 8.5 : 3.4, seconds));
    this.pressure = lerp(this.pressure, this.targetPressure, follow(this.down ? 7.8 : 5.2, seconds));
    this.velocity.x *= Math.exp(-(this.down ? 2.8 : 5.5) * seconds);
    this.velocity.y *= Math.exp(-(this.down ? 2.8 : 5.5) * seconds);
    this.spin *= Math.exp(-(this.down ? 1.4 : 3.2) * seconds);
    this.ripple.age += seconds;
    this.shell?.style.setProperty('--orb-touch-x', `${(this.pointer.x * 100).toFixed(2)}%`);
    this.shell?.style.setProperty('--orb-touch-y', `${(this.pointer.y * 100).toFixed(2)}%`);
    this.shell?.style.setProperty('--orb-touch-energy', this.energy.toFixed(3));
    this.shell?.style.setProperty('--orb-touch-opacity', clamp(.13 + this.energy * .38, .13, .72).toFixed(3));
    return elapsed;
  }

  requestFrame() {
    if (this.raf || this.destroyed || !this.ready || !this.visible || document.hidden) return;
    this.raf = requestAnimationFrame(time => this.draw(time));
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  draw(time) {
    this.raf = 0;
    if (!this.gl || this.destroyed || !this.visible || document.hidden) return;
    if (this.reducedMotion && this.lastFrame && time - this.lastFrame < 66) {
      this.requestFrame();
      return;
    }
    const milliseconds = this.lastFrame ? time - this.lastFrame : 16.7;
    const seconds = clamp(milliseconds / 1000, .001, .05);
    this.lastFrame = time;
    const elapsed = this.update(time, seconds);
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1f(this.uniforms.uTime, elapsed);
    gl.uniform1f(this.uniforms.uBreath, this.breathAt(elapsed));
    gl.uniform1f(this.uniforms.uEnergy, this.energy);
    gl.uniform1f(this.uniforms.uPressure, this.pressure);
    gl.uniform1f(this.uniforms.uTouch, this.down ? 1 : 0);
    gl.uniform1f(this.uniforms.uRippleAge, this.ripple.age);
    gl.uniform1f(this.uniforms.uSpin, clamp(this.spin, -.8, .8));
    gl.uniform1f(this.uniforms.uReduced, this.reducedMotion ? 1 : 0);
    gl.uniform2f(this.uniforms.uPointer, this.pointer.x, 1 - this.pointer.y);
    gl.uniform2f(this.uniforms.uVelocity, this.velocity.x, this.velocity.y);
    gl.uniform2f(this.uniforms.uRippleOrigin, this.ripple.x, 1 - this.ripple.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.adaptQuality(milliseconds, time);
    this.requestFrame();
  }

  adaptQuality(milliseconds, time) {
    if (milliseconds > 80) return;
    this.frameAverage = this.frameAverage * .95 + milliseconds * .05;
    this.qualitySamples += 1;
    if (this.qualitySamples < 120 || time - this.lastQualityChange < 4000) return;
    this.qualitySamples = 0;
    let next = this.pixelRatio;
    const ceiling = Math.min(devicePixelRatio || 1, 2);
    if (this.frameAverage > 23) next = Math.max(1, this.pixelRatio - .18);
    else if (this.frameAverage < 18) next = Math.min(ceiling, this.pixelRatio + .10);
    if (Math.abs(next - this.pixelRatio) > .02) {
      this.pixelRatio = next;
      this.lastQualityChange = time;
      this.resize();
    }
  }

  fallback(reason = 'indisponível') {
    this.ready = false;
    this.stop();
    this.canvas.style.opacity = '0';
    this.shell?.classList.remove('orb-loading', 'orb-live');
    this.shell?.classList.add('webgl-fallback');
    if (this.shell) this.shell.dataset.orbFallback = reason;
    this.announce('A Orbe está respirando', 'RESPIRA');
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    clearTimeout(this.phaseTimer);
    clearTimeout(this.tapTimer);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.shell?.removeEventListener('pointerdown', this.onPointerDown);
    this.shell?.removeEventListener('pointermove', this.onPointerMove);
    this.shell?.removeEventListener('pointerup', this.onPointerUp);
    this.shell?.removeEventListener('pointercancel', this.onPointerCancel);
    this.shell?.removeEventListener('pointerenter', this.onPointerEnter);
    this.shell?.removeEventListener('pointerleave', this.onPointerLeave);
    this.shell?.removeEventListener('click', this.onClick);
    this.shell?.removeEventListener('dblclick', this.onDoubleClick);
    if (this.gl) {
      if (this.texture) this.gl.deleteTexture(this.texture);
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }
  }
}

export default RealityOrbEngine;
