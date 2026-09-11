/* DIVINA BRUXA — MACROETAPA 1/4 · UNIVERSO VIVO UNIVERSAL V515
   Um único universo procedural atravessa todas as realidades. Não existe
   fotografia de fundo no motor: estrelas, nebulosas e galáxias são calculadas
   continuamente e respondem à rota, à skin, ao toque e à visibilidade. */

const VERSION = 515;
const STYLE_ID = 'divinaLivingUniverseV515Styles';
const ROOT_ID = 'divinaLivingUniverseV515';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';

const routeNow = () => String(
  document.body?.dataset?.screen ||
  document.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
  location.hash.replace(/^#/, '') ||
  'home'
).toLowerCase();

const ROUTE_PROFILES = Object.freeze({
  home:{ seed:0.08, density:1.04, warmth:0.56, drift:0.74 },
  tarot:{ seed:0.18, density:1.16, warmth:0.64, drift:0.82 },
  daily:{ seed:0.29, density:0.94, warmth:0.76, drift:0.62 },
  spreads:{ seed:0.38, density:1.08, warmth:0.68, drift:0.7 },
  library:{ seed:0.47, density:0.86, warmth:0.5, drift:0.48 },
  school:{ seed:0.56, density:0.78, warmth:0.72, drift:0.44 },
  journal:{ seed:0.65, density:0.82, warmth:0.48, drift:0.4 },
  ai:{ seed:0.74, density:1.04, warmth:0.42, drift:0.72 },
  skins:{ seed:0.83, density:1.12, warmth:0.58, drift:0.68 },
  consultations:{ seed:0.91, density:0.86, warmth:0.82, drift:0.42 }
});

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './living-universe-core-v515.css?v=515';
  document.head.append(link);
}

function parseColor(value, fallback) {
  const input = String(value || '').trim();
  const hex = input.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const normalized = hex.length === 3
      ? hex.split('').map(character => `${character}${character}`).join('')
      : hex;
    return [
      parseInt(normalized.slice(0, 2), 16) / 255,
      parseInt(normalized.slice(2, 4), 16) / 255,
      parseInt(normalized.slice(4, 6), 16) / 255
    ];
  }
  const rgb = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return [
    clamp(Number(rgb[1]) / 255, 0, 1),
    clamp(Number(rgb[2]) / 255, 0, 1),
    clamp(Number(rgb[3]) / 255, 0, 1)
  ];
  return [...fallback];
}

class LivingUniverseCoreV515 {
  constructor() {
    installStyle();
    this.route = routeNow();
    this.profile = { ...(ROUTE_PROFILES[this.route] || ROUTE_PROFILES.home) };
    this.profileTarget = { ...this.profile };
    this.width = 1;
    this.height = 1;
    this.scale = constrained() ? 0.54 : (innerWidth < 700 ? 0.68 : 0.78);
    this.pixelRatio = 1;
    this.targetFps = reducedMotion() ? 24 : (constrained() ? 40 : 60);
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.slowFrames = 0;
    this.energy = 0.18;
    this.pointer = { x:0.5, y:0.45 };
    this.visible = !document.hidden;
    this.destroyed = false;
    this.startedAt = performance.now();
    this.raf = 0;
    this.mode = 'pending';
    this.gl = null;
    this.context = null;
    this.program = null;
    this.uniforms = null;
    this.palette = {
      accent:[0.67, 0.22, 0.94],
      light:[1, 0.72, 0.43],
      gold:[1, 0.84, 0.5]
    };

    this.root = document.createElement('div');
    this.root.id = ROOT_ID;
    this.root.className = 'db515-universe';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.innerHTML = '<canvas data-living-universe-canvas></canvas><span class="db515-universe__veil"></span>';
    this.canvas = this.root.querySelector('canvas');
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'0', width:'100%', height:'100%',
      overflow:'hidden', pointerEvents:'none', background:'#010005'
    });
    Object.assign(this.canvas.style, {
      position:'absolute', inset:'0', display:'block', width:'100%', height:'100%'
    });
    document.body.prepend(this.root);
    this.root.dataset.route = this.route;
    document.documentElement.dataset.livingUniverse = 'v515';
    document.body.classList.add('db515-universe-active');

    this.fallbackStars = this.createFallbackStars();
    this.syncPalette(true);
    this.initializeRenderer();
    this.resize();
    this.bind();
    this.start();

    const readiness = Object.freeze({
      version:VERSION,
      engine:'LivingUniverseCoreV515',
      renderer:this.mode,
      staticUniverseImage:false,
      globalAcrossRoutes:true,
      oneUniverseCanvas:true,
      proceduralStars:true,
      proceduralNebulae:true,
      proceduralGalaxies:true,
      skinReactive:true,
      pausesWhenHidden:true,
      targetFps:this.targetFps
    });
    document.dispatchEvent(new CustomEvent('divina:living-universe-ready', { detail:readiness }));
  }

  createFallbackStars() {
    const pseudo = value => {
      const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    };
    return Array.from({ length:constrained() ? 90 : 170 }, (_, index) => ({
      x:pseudo(index * 2.71 + 1.2),
      y:pseudo(index * 5.13 + 8.7),
      depth:0.32 + pseudo(index * 7.17 + 2.1) * 0.68,
      size:index % 23 === 0 ? 2.4 : 0.45 + pseudo(index * 1.83 + 9.2) * 1.15,
      phase:pseudo(index * 9.31 + 4.8) * Math.PI * 2,
      gold:index % 9 === 0
    }));
  }

  syncPalette(force = false) {
    const styles = getComputedStyle(document.documentElement);
    const accentRaw = styles.getPropertyValue('--db-skin-accent').trim()
      || styles.getPropertyValue('--db-supreme-violet').trim()
      || '#ab38ef';
    const lightRaw = styles.getPropertyValue('--db-skin-light').trim()
      || styles.getPropertyValue('--db-gold-soft').trim()
      || '#ffb869';
    const goldRaw = styles.getPropertyValue('--db-supreme-gold').trim()
      || styles.getPropertyValue('--cosmic-gold').trim()
      || '#ffd77e';
    const key = `${accentRaw}|${lightRaw}|${goldRaw}`;
    if (!force && key === this.paletteKey) return;
    this.paletteKey = key;
    this.palette = {
      accent:parseColor(accentRaw, [0.67, 0.22, 0.94]),
      light:parseColor(lightRaw, [1, 0.72, 0.43]),
      gold:parseColor(goldRaw, [1, 0.84, 0.5])
    };
    this.energy = Math.max(this.energy, 0.56);
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const message = this.gl.getShaderInfoLog(shader) || 'shader-unavailable';
      this.gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  initializeRenderer() {
    const options = {
      alpha:false,
      antialias:false,
      depth:false,
      stencil:false,
      premultipliedAlpha:false,
      preserveDrawingBuffer:false,
      powerPreference:constrained() ? 'low-power' : 'high-performance'
    };
    this.gl = this.canvas.getContext('webgl', options)
      || this.canvas.getContext('experimental-webgl', options);
    if (!this.gl) {
      this.useCanvasFallback();
      return;
    }

    try {
      const vertex = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec2 a_position;
        void main(){ gl_Position=vec4(a_position,0.0,1.0); }
      `);
      const fragment = this.createShader(this.gl.FRAGMENT_SHADER, `
        precision highp float;
        uniform vec2 u_resolution;
        uniform vec2 u_pointer;
        uniform float u_time;
        uniform float u_energy;
        uniform float u_seed;
        uniform float u_density;
        uniform float u_warmth;
        uniform float u_drift;
        uniform float u_motion;
        uniform vec3 u_accent;
        uniform vec3 u_light;
        uniform vec3 u_gold;

        float hash21(vec2 p){
          p=fract(p*vec2(123.34,456.21));
          p+=dot(p,p+45.32);
          return fract(p.x*p.y);
        }

        float noise2(vec2 p){
          vec2 i=floor(p);
          vec2 f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),u.x),
                     mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),u.x),u.y);
        }

        float fbm(vec2 p){
          float value=0.0;
          float amplitude=0.52;
          mat2 turn=mat2(0.80,-0.60,0.60,0.80);
          for(int octave=0;octave<4;octave++){
            value+=noise2(p)*amplitude;
            p=turn*p*2.03+vec2(7.13,3.71);
            amplitude*=0.49;
          }
          return value;
        }

        float galaxy(vec2 p,vec2 center,float size,float phase,float time){
          vec2 d=p-center;
          d.x*=0.92;
          float radius=length(d)*size;
          float angle=atan(d.y,d.x);
          float spiral=0.5+0.5*cos(angle*2.0+radius*10.2-phase-time*0.045);
          spiral=pow(max(spiral,0.0),7.0);
          float disk=exp(-radius*2.72);
          float core=exp(-radius*radius*18.0);
          float dust=0.58+0.42*noise2(d*16.0+phase);
          return (disk*(0.12+spiral*0.92)*dust+core*1.18)
            *(1.0-smoothstep(0.08,1.18,radius));
        }

        float starLayer(vec2 p,float scale,float seed,float time,out float giant){
          vec2 grid=p*scale;
          vec2 id=floor(grid);
          vec2 local=fract(grid)-0.5;
          vec2 jitter=vec2(hash21(id+seed+13.7),hash21(id+seed+71.9))-0.5;
          vec2 delta=local-jitter*0.56;
          float random=hash21(id+seed*31.7);
          float visible=step(0.967-random*0.004,random);
          float radius=mix(0.018,0.046,hash21(id+4.7));
          float core=(1.0-smoothstep(radius,radius*2.15,length(delta)))*visible;
          float twinkle=0.54+0.46*sin(time*(0.7+hash21(id+9.1)*1.8)+random*29.0);
          twinkle*=twinkle;
          giant=step(0.994,random)*visible;
          float vertical=(1.0-smoothstep(0.008,0.026,abs(delta.x)))
            *(1.0-smoothstep(0.04,0.31,abs(delta.y)))*giant;
          float horizontal=(1.0-smoothstep(0.008,0.026,abs(delta.y)))
            *(1.0-smoothstep(0.04,0.31,abs(delta.x)))*giant;
          return core*(0.45+twinkle*0.88)+(vertical+horizontal)*0.54*twinkle;
        }

        void main(){
          vec2 uv=gl_FragCoord.xy/u_resolution.xy;
          uv.y=1.0-uv.y;
          float aspect=u_resolution.x/max(u_resolution.y,1.0);
          vec2 p=vec2((uv.x-0.5)*aspect,uv.y-0.5);
          float time=u_time*u_motion;
          vec2 slow=vec2(time*0.0065*u_drift,-time*0.0042*u_drift);

          vec2 warp=vec2(
            fbm(p*1.62+slow+u_seed*9.1),
            fbm(p*1.58-slow+vec2(4.8,1.7)+u_seed*5.3)
          );
          float cloud=fbm(p*2.18+warp*2.22+slow*0.7);
          float detail=fbm(p*5.2-warp*1.15-slow*1.4);
          float ridge=1.0-abs(cloud*2.0-1.0);
          float edge=smoothstep(0.10,0.72,abs(uv.x-0.5)*2.0);
          float nebula=smoothstep(0.48,0.79,cloud*0.73+detail*0.27+edge*0.12);
          nebula*=mix(0.52,1.2,edge)*u_density;
          float hotDust=smoothstep(0.61,0.87,detail*0.56+ridge*0.44+edge*0.08);

          vec3 color=vec3(0.0018,0.0005,0.0048);
          color+=u_accent*nebula*(0.25+ridge*0.48);
          color+=mix(u_accent,u_light,0.44)*hotDust*nebula*(0.18+u_warmth*0.22);
          color+=u_gold*pow(hotDust,3.0)*0.29*u_warmth;

          float g1=galaxy(p,vec2(-aspect*0.43,-0.30),3.15,0.4+u_seed,time);
          float g2=galaxy(p,vec2(aspect*0.43,0.20),3.55,2.2-u_seed,time);
          float g3=galaxy(p,vec2(-aspect*0.38,0.37),4.8,4.1+u_seed,time);
          color+=mix(u_accent,u_gold,0.38)*g1*0.74;
          color+=mix(u_accent,u_light,0.28)*g2*0.62;
          color+=mix(u_accent,u_gold,0.56)*g3*0.34;

          float giantA=0.0;
          float giantB=0.0;
          float starsA=starLayer(p+slow*0.12,48.0,u_seed*83.0,time,giantA);
          float starsB=starLayer(p-slow*0.08,83.0,u_seed*127.0+17.0,time*1.23,giantB);
          vec3 starColor=mix(vec3(0.86,0.69,1.0),u_gold,0.34+u_warmth*0.24);
          color+=starColor*starsA*(0.62+u_density*0.34);
          color+=mix(vec3(0.76,0.59,1.0),vec3(1.0),0.54)*starsB*0.52*u_density;

          vec2 pointer=vec2((u_pointer.x-0.5)*aspect,u_pointer.y-0.5);
          float touchGlow=exp(-length(p-pointer)*5.8)*u_energy;
          color+=mix(u_accent,u_gold,u_warmth)*touchGlow*0.24;
          float centerCalm=1.0-smoothstep(0.05,0.42,length(vec2((uv.x-0.5)*0.74,uv.y-0.52)));
          color*=1.0-centerCalm*0.11;
          float vignette=smoothstep(0.95,0.28,length((uv-0.5)*vec2(0.82,1.0)));
          color*=0.67+vignette*0.42;
          color=pow(max(color,vec3(0.0)),vec3(0.88));
          gl_FragColor=vec4(min(color,vec3(1.0)),1.0);
        }
      `);
      const program = this.gl.createProgram();
      this.gl.attachShader(program, vertex);
      this.gl.attachShader(program, fragment);
      this.gl.linkProgram(program);
      this.gl.deleteShader(vertex);
      this.gl.deleteShader(fragment);
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        throw new Error(this.gl.getProgramInfoLog(program) || 'program-unavailable');
      }

      const buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1
      ]), this.gl.STATIC_DRAW);
      const position = this.gl.getAttribLocation(program, 'a_position');
      this.gl.enableVertexAttribArray(position);
      this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
      this.program = program;
      this.buffer = buffer;
      this.uniforms = {
        resolution:this.gl.getUniformLocation(program, 'u_resolution'),
        pointer:this.gl.getUniformLocation(program, 'u_pointer'),
        time:this.gl.getUniformLocation(program, 'u_time'),
        energy:this.gl.getUniformLocation(program, 'u_energy'),
        seed:this.gl.getUniformLocation(program, 'u_seed'),
        density:this.gl.getUniformLocation(program, 'u_density'),
        warmth:this.gl.getUniformLocation(program, 'u_warmth'),
        drift:this.gl.getUniformLocation(program, 'u_drift'),
        motion:this.gl.getUniformLocation(program, 'u_motion'),
        accent:this.gl.getUniformLocation(program, 'u_accent'),
        light:this.gl.getUniformLocation(program, 'u_light'),
        gold:this.gl.getUniformLocation(program, 'u_gold')
      };
      this.mode = 'webgl-procedural';
      this.root.dataset.renderer = this.mode;
      this.gl.clearColor(0.0018,0.0005,0.0048,1);
    } catch (error) {
      console.info('[Divina] Universo WebGL cedeu ao céu procedural Canvas.', error);
      this.useCanvasFallback();
    }
  }

  useCanvasFallback() {
    if (this.gl) {
      const replacement = document.createElement('canvas');
      replacement.setAttribute('data-living-universe-canvas', '');
      this.canvas.replaceWith(replacement);
      this.canvas = replacement;
    }
    this.gl = null;
    this.program = null;
    this.context = this.canvas.getContext('2d', { alpha:false, desynchronized:true });
    this.mode = 'canvas-procedural';
    this.root.dataset.renderer = this.mode;
  }

  bind() {
    this.onResize = () => this.resize();
    addEventListener('resize', this.onResize, { passive:true });
    this.onVisibility = () => {
      this.visible = !document.hidden;
      if (this.visible) this.start();
      else this.pause();
    };
    document.addEventListener('visibilitychange', this.onVisibility);
    this.onPointerMove = event => {
      this.pointer.x += (clamp(event.clientX / Math.max(innerWidth, 1), 0, 1) - this.pointer.x) * 0.32;
      this.pointer.y += (clamp(event.clientY / Math.max(innerHeight, 1), 0, 1) - this.pointer.y) * 0.32;
    };
    this.onPointerDown = event => {
      this.pointer = {
        x:clamp(event.clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(event.clientY / Math.max(innerHeight, 1), 0, 1)
      };
      this.energy = Math.max(this.energy, 1);
    };
    addEventListener('pointermove', this.onPointerMove, { passive:true });
    addEventListener('pointerdown', this.onPointerDown, { passive:true });
    this.onSkinChange = () => this.syncPalette(true);
    ['divina:skin-change','divina:skin-applied','skin:changed','orbe:skin-change']
      .forEach(type => document.addEventListener(type, this.onSkinChange));
    this.onRouteEvent = event => this.setRoute(event.detail?.id || routeNow());
    document.addEventListener('divina:route-ready', this.onRouteEvent);
    addEventListener('hashchange', this.onRouteEvent, { passive:true });
    this.observer = new MutationObserver(records => {
      if (records.some(record => record.target === document.body && record.attributeName === 'data-screen')) {
        this.setRoute(routeNow());
      }
      this.syncPalette();
    });
    this.observer.observe(document.documentElement, { attributes:true, attributeFilter:['data-skin','data-orb-skin','style','class'] });
    this.observer.observe(document.body, { attributes:true, attributeFilter:['data-screen','data-skin','style','class'] });
  }

  setRoute(route) {
    const next = String(route || routeNow()).toLowerCase();
    if (next === this.route) return;
    this.route = next;
    this.profileTarget = { ...(ROUTE_PROFILES[next] || {
      seed:(next.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97) / 97,
      density:0.84,
      warmth:0.58,
      drift:0.48
    }) };
    this.energy = Math.max(this.energy, 0.82);
    this.root.dataset.route = next;
  }

  resize() {
    this.width = Math.max(1, innerWidth);
    this.height = Math.max(1, innerHeight);
    this.pixelRatio = Math.min(constrained() ? 1 : 1.4, Math.max(1, devicePixelRatio || 1));
    const renderRatio = this.pixelRatio * this.scale;
    const width = Math.max(1, Math.round(this.width * renderRatio));
    const height = Math.max(1, Math.round(this.height * renderRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.renderRatio = renderRatio;
    this.gl?.viewport(0, 0, width, height);
  }

  drawWebGL(timestamp) {
    const gl = this.gl;
    if (!gl || !this.program) return;
    gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(this.uniforms.time, (timestamp - this.startedAt) / 1000);
    gl.uniform1f(this.uniforms.energy, this.energy);
    gl.uniform1f(this.uniforms.seed, this.profile.seed);
    gl.uniform1f(this.uniforms.density, this.profile.density);
    gl.uniform1f(this.uniforms.warmth, this.profile.warmth);
    gl.uniform1f(this.uniforms.drift, this.profile.drift);
    gl.uniform1f(this.uniforms.motion, reducedMotion() ? 0.22 : 1);
    gl.uniform3fv(this.uniforms.accent, this.palette.accent);
    gl.uniform3fv(this.uniforms.light, this.palette.light);
    gl.uniform3fv(this.uniforms.gold, this.palette.gold);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawCanvas(timestamp) {
    const context = this.context;
    if (!context) return;
    const ratio = this.renderRatio || 1;
    const time = (timestamp - this.startedAt) / 1000 * (reducedMotion() ? 0.22 : 1);
    context.setTransform(ratio,0,0,ratio,0,0);
    context.fillStyle = '#010005';
    context.fillRect(0,0,this.width,this.height);
    context.globalCompositeOperation = 'screen';
    const clouds = constrained() ? 4 : 6;
    for (let index=0; index<clouds; index+=1) {
      const phase = index * 1.71 + this.profile.seed * 8.3;
      const x = this.width * (0.5 + Math.sin(phase + time * 0.018 * this.profile.drift) * (0.34 + index % 2 * 0.09));
      const y = this.height * (0.5 + Math.cos(phase * 0.74 - time * 0.014 * this.profile.drift) * 0.43);
      const radius = Math.max(this.width,this.height) * (0.22 + (index % 3) * 0.055);
      const accent = this.palette.accent.map(value => Math.round(value * 255));
      const gold = this.palette.gold.map(value => Math.round(value * 255));
      const color = index % 3 === 0 ? gold : accent;
      const gradient = context.createRadialGradient(x,y,0,x,y,radius);
      gradient.addColorStop(0,`rgba(${color[0]},${color[1]},${color[2]},${0.055 + this.profile.density * 0.025})`);
      gradient.addColorStop(0.44,`rgba(${color[0]},${color[1]},${color[2]},.028)`);
      gradient.addColorStop(1,`rgba(${color[0]},${color[1]},${color[2]},0)`);
      context.fillStyle = gradient;
      context.fillRect(x-radius,y-radius,radius*2,radius*2);
    }
    for (const star of this.fallbackStars) {
      const driftX = Math.sin(time * 0.035 * star.depth + star.phase) * 5 * star.depth;
      const driftY = Math.cos(time * 0.028 * star.depth + star.phase) * 4 * star.depth;
      const x = star.x * this.width + driftX;
      const y = star.y * this.height + driftY;
      const pulse = 0.22 + Math.sin(time * (0.65 + star.depth) + star.phase) ** 2 * 0.78;
      const size = star.size * (0.58 + pulse * 0.48);
      const color = star.gold ? this.palette.gold : this.palette.accent;
      context.globalAlpha = (0.34 + pulse * 0.62) * this.profile.density;
      context.fillStyle = `rgb(${Math.round(color[0]*255)} ${Math.round(color[1]*255)} ${Math.round(color[2]*255)})`;
      context.fillRect(x-size/2,y-size/2,size,size);
      if (star.size > 2) {
        context.fillRect(x-0.45,y-size*3,0.9,size*6);
        context.fillRect(x-size*3,y-0.45,size*6,0.9);
      }
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  adapt(delta) {
    if (reducedMotion() || constrained() || this.scale <= 0.5) return;
    if (delta > 27) this.slowFrames += 1;
    else this.slowFrames = Math.max(0, this.slowFrames - 1);
    if (this.slowFrames < 48) return;
    this.slowFrames = 0;
    this.scale = Math.max(0.5, this.scale * 0.9);
    this.resize();
    this.root.dataset.adaptiveQuality = 'protected';
  }

  frame(timestamp) {
    if (this.destroyed || !this.visible) return;
    const interval = 1000 / this.targetFps;
    if (timestamp - this.lastDraw >= interval - 0.5) {
      const delta = this.lastFrame ? Math.min(80, timestamp - this.lastFrame) : interval;
      this.lastFrame = timestamp;
      this.lastDraw = timestamp;
      for (const key of ['seed','density','warmth','drift']) {
        this.profile[key] += (this.profileTarget[key] - this.profile[key]) * Math.min(1, delta * 0.0016);
      }
      this.energy += (0.18 - this.energy) * Math.min(1, delta * 0.0028);
      if (this.mode === 'webgl-procedural') this.drawWebGL(timestamp);
      else this.drawCanvas(timestamp);
      this.adapt(delta);
    }
    this.raf = requestAnimationFrame(next => this.frame(next));
  }

  start() {
    if (this.destroyed || !this.visible || this.raf) return;
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.raf = requestAnimationFrame(timestamp => this.frame(timestamp));
  }

  pause() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  ignite({ x=0.5, y=0.5, strength=1 }={}) {
    this.pointer = { x:clamp(x,0,1), y:clamp(y,0,1) };
    this.energy = Math.max(this.energy, clamp(strength,0.2,1.6));
    this.start();
  }

  status() {
    return Object.freeze({
      version:VERSION,
      renderer:this.mode,
      route:this.route,
      staticUniverseImage:false,
      globalAcrossRoutes:true,
      oneUniverseCanvas:document.querySelectorAll('#divinaLivingUniverseV515 canvas').length === 1,
      targetFps:this.targetFps,
      adaptiveScale:this.scale,
      skinReactive:true,
      paused:!this.raf
    });
  }

  destroy() {
    this.destroyed = true;
    this.pause();
    this.observer?.disconnect();
    removeEventListener('resize', this.onResize);
    removeEventListener('pointermove', this.onPointerMove);
    removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('visibilitychange', this.onVisibility);
    ['divina:skin-change','divina:skin-applied','skin:changed','orbe:skin-change']
      .forEach(type => document.removeEventListener(type, this.onSkinChange));
    document.removeEventListener('divina:route-ready', this.onRouteEvent);
    removeEventListener('hashchange', this.onRouteEvent);
    if (this.gl) {
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }
    this.root.remove();
    document.body.classList.remove('db515-universe-active');
    delete document.documentElement.dataset.livingUniverse;
  }
}

export function createLivingUniverseV515() {
  if (globalThis.divinaLivingUniverseV515?.status) return globalThis.divinaLivingUniverseV515;
  const universe = new LivingUniverseCoreV515();
  globalThis.divinaLivingUniverseV515 = universe;
  return universe;
}

export { LivingUniverseCoreV515 };
