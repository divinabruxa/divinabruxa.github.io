/* DIVINA BRUXA — UNIVERSO VIVO · MACROETAPA 1/4 · PELE CÓSMICA TÁTIL V524
   O céu Retina aprovado ganha pigmentação física por skin e nuvens errantes
   que cedem ao toque. A Orbe permanece ancorada enquanto o universo responde. */

const VERSION = 524;
const STYLE_ID = 'divinaLivingUniverseV524Styles';
const ROOT_ID = 'divinaLivingUniverseV524';
const COSMOS_TEXTURE = './divina-universe-retina-v523.webp';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const constrained = () => document.documentElement.dataset.performanceTier === 'constrained';

const stableViewport = () => {
  const html = document.documentElement;
  const width = Math.max(1, Math.round(html.clientWidth || innerWidth || 1));
  const visibleHeight = Math.max(1, Math.round(html.clientHeight || innerHeight || 1));
  if (width >= 700) return { width, height:visibleHeight };
  const screenWidth = Math.max(0, Number(globalThis.screen?.width) || 0);
  const screenHeight = Math.max(0, Number(globalThis.screen?.height) || 0);
  const screenLong = Math.max(screenWidth, screenHeight);
  const screenShort = Math.min(screenWidth, screenHeight);
  const portrait = visibleHeight >= width;
  const stableHeight = portrait ? screenLong : screenShort;
  return { width, height:Math.max(visibleHeight, Math.round(stableHeight || 0)) };
};

const routeNow = () => String(
  document.body?.dataset?.screen ||
  document.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
  location.hash.replace(/^#/, '') ||
  'home'
).toLowerCase();

const ROUTE_PROFILES = Object.freeze({
  home:{ seed:0.08, density:1.06, warmth:0.56, drift:0.72, depth:1.08 },
  tarot:{ seed:0.18, density:1.16, warmth:0.64, drift:0.80, depth:1.18 },
  daily:{ seed:0.29, density:0.96, warmth:0.76, drift:0.60, depth:0.92 },
  spreads:{ seed:0.38, density:1.08, warmth:0.68, drift:0.68, depth:1.06 },
  library:{ seed:0.47, density:0.86, warmth:0.50, drift:0.46, depth:0.82 },
  school:{ seed:0.56, density:0.80, warmth:0.72, drift:0.42, depth:0.76 },
  journal:{ seed:0.65, density:0.84, warmth:0.48, drift:0.38, depth:0.84 },
  ai:{ seed:0.74, density:1.06, warmth:0.42, drift:0.70, depth:1.16 },
  skins:{ seed:0.83, density:1.12, warmth:0.58, drift:0.66, depth:1.10 },
  consultations:{ seed:0.91, density:0.88, warmth:0.82, drift:0.40, depth:0.88 },
  store:{ seed:0.35, density:0.88, warmth:0.72, drift:0.44, depth:0.90 },
  music:{ seed:0.61, density:1.02, warmth:0.58, drift:0.70, depth:1.04 },
  videos:{ seed:0.68, density:0.96, warmth:0.60, drift:0.58, depth:0.98 },
  login:{ seed:0.77, density:0.82, warmth:0.54, drift:0.38, depth:0.80 },
  subscriptions:{ seed:0.88, density:1.08, warmth:0.78, drift:0.52, depth:1.08 },
  notifications:{ seed:0.95, density:0.88, warmth:0.52, drift:0.48, depth:0.90 },
  admin:{ seed:0.04, density:0.72, warmth:0.46, drift:0.30, depth:0.68 }
});

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './living-universe-core-v524.css?v=524';
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

class LivingUniverseCoreV524 {
  constructor() {
    installStyle();
    this.route = routeNow();
    this.profile = { ...(ROUTE_PROFILES[this.route] || ROUTE_PROFILES.home) };
    this.profileTarget = { ...this.profile };
    this.width = 1;
    this.height = 1;
    const visualQuality = document.documentElement.dataset.visualQuality || 'balanced';
    const mobile = innerWidth < 700;
    this.scale = constrained() || visualQuality === 'protected'
      ? 1.45
      : visualQuality === 'cinematic'
        ? (mobile ? 2.05 : 1.82)
        : (mobile ? 1.82 : 1.68);
    this.qualityCeiling = this.scale;
    this.qualityProfile = visualQuality;
    this.pixelRatio = 1;
    this.targetFps = reducedMotion() ? 24 : (constrained() ? 40 : 60);
    this.requestedFps = this.targetFps;
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.slowFrames = 0;
    this.calmFrames = 0;
    this.frameTimeEma = 16.7;
    this.degraded = false;
    this.sessionRenderRatio = 0;
    this.resolutionLocked = false;
    this.resizeCount = 0;
    this.frameCadence = 'full';
    this.lastSuccessfulDraw = 0;
    this.energy = 0.18;
    this.pointer = { x:0.5, y:0.45 };
    this.pointerTarget = { ...this.pointer };
    this.touch = {
      active:false,
      energy:0.08,
      target:0.08,
      velocity:{ x:0, y:0 },
      velocityTarget:{ x:0, y:0 },
      last:{ x:0.5, y:0.45, at:performance.now() },
      lastMoveAt:0
    };
    this.camera = { x:0, y:0 };
    this.cameraTarget = { x:0, y:0 };
    this.scroll = 0;
    this.scrollTarget = 0;
    this.orbPoint = { x:0.5, y:0.64 };
    this.orbEnergy = 0.12;
    this.orbGeometryDirty = true;
    this.elapsed = 0;
    this.flame = {
      requested:false,
      target:0,
      level:0,
      pulse:0,
      birthEnergy:0,
      birthProgress:-1,
      birthStartedAt:0,
      birthDuration:1040,
      from:{ x:0.5, y:0.72 },
      to:{ x:0.5, y:0.28 },
      orb:null,
      card:null,
      geometryDirty:true
    };
    this.visible = !document.hidden;
    this.destroyed = false;
    this.startedAt = performance.now();
    this.raf = 0;
    this.mode = 'pending';
    this.gl = null;
    this.context = null;
    this.program = null;
    this.uniforms = null;
    this.cosmos = {
      image:null,
      texture:null,
      ready:false,
      mix:0,
      target:0,
      source:COSMOS_TEXTURE
    };
    this.palette = {
      accent:[0.67, 0.22, 0.94],
      light:[1, 0.72, 0.43],
      gold:[1, 0.84, 0.5],
      deep:[0.027, 0.008, 0.051]
    };
    this.paletteTarget = {
      accent:[...this.palette.accent],
      light:[...this.palette.light],
      gold:[...this.palette.gold],
      deep:[...this.palette.deep]
    };
    this.paletteInitialized = false;

    this.root = document.createElement('div');
    this.root.id = ROOT_ID;
    this.root.className = 'db524-universe';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.innerHTML = '<canvas data-living-universe-canvas></canvas><span class="db524-universe__veil"></span>';
    this.canvas = this.root.querySelector('canvas');
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'0', width:'100%', height:'100%',
      overflow:'hidden', pointerEvents:'none',
      background:`#010005 url("${COSMOS_TEXTURE}") center / cover no-repeat`
    });
    Object.assign(this.canvas.style, {
      position:'absolute', inset:'0', display:'block', width:'100%', height:'100%'
    });
    document.body.prepend(this.root);
    this.root.dataset.route = this.route;
    this.root.dataset.livingClouds = 'touch-responsive';
    this.root.dataset.cloudBreath = 'traveling-organic-wave';
    this.root.dataset.cosmicDepth = 'four-galaxies-three-star-planes';
    this.root.dataset.constellations = '2-fluid-11-segments';
    this.root.dataset.animationCadence = 'single-raf';
    document.documentElement.dataset.livingUniverse = 'v524';
    document.body.classList.remove('db516-universe-active','db519-universe-active','db520-universe-active','db521-universe-active','db522-universe-active','db523-universe-active');
    document.body.classList.add('db524-universe-active');

    this.fallbackStars = this.createFallbackStars();
    this.syncPalette(true);
    this.initializeRenderer();
    this.loadCosmosTexture();
    this.resize();
    this.bind();
    this.start();

    const readiness = Object.freeze({
      version:VERSION,
      engine:'LivingUniverseCoreV524',
      renderer:this.mode,
      staticUniverseImage:false,
      retinaTextureBackedProceduralWorld:true,
      retinaTextureSource:COSMOS_TEXTURE,
      globalAcrossRoutes:true,
      oneUniverseCanvas:true,
      proceduralStars:true,
      proceduralNebulae:true,
      proceduralGalaxies:true,
      retinaSupersampling:true,
      stableRetinaSession:true,
      adaptiveFrameCadence:true,
      photographicCosmosDetail:true,
      spectralStarHalos:true,
      calmStarField:true,
      synchronizedBlinking:false,
      organicCloudFlow:true,
      travelingCloudBreath:true,
      cosmicDustFilaments:true,
      proceduralGalaxyCount:4,
      livingCloudTouchField:true,
      touchWake:true,
      tactileCloudDisplacement:true,
      wanderingCloudField:true,
      fluidConstellations:2,
      constellationSegments:11,
      constellationTouchRefraction:true,
      parallaxDepthLayers:3,
      orbGravityField:true,
      continuousRouteMorph:true,
      clockPausesWhenHidden:true,
      trueCelestialFire:true,
      fireInsideUniverseCanvas:true,
      lightningStrokes:false,
      whiteOverexposure:false,
      firePalette:'violet-magenta-gold',
      skinReactive:true,
      selectiveSkinPigment:true,
      physicalOrbTouchMotion:false,
      pausesWhenHidden:true,
      webglContextFallback:true,
      targetFps:this.targetFps
    });
    document.dispatchEvent(new CustomEvent('divina:living-universe-ready', { detail:readiness }));
  }

  createFallbackStars() {
    const pseudo = value => {
      const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    };
    const protectedQuality = constrained() || document.documentElement.dataset.visualQuality === 'protected';
    return Array.from({ length:protectedQuality ? 72 : 132 }, (_, index) => ({
      x:pseudo(index * 2.71 + 1.2),
      y:pseudo(index * 5.13 + 8.7),
      depth:0.32 + pseudo(index * 7.17 + 2.1) * 0.68,
      size:index % 37 === 0 ? 2.25 : 0.55 + pseudo(index * 1.83 + 9.2) * 0.80,
      phase:pseudo(index * 9.31 + 4.8) * Math.PI * 2,
      luminance:0.76 + pseudo(index * 4.37 + 3.2) * 0.24,
      spectrum:index % 11 === 0 ? 'gold' : index % 7 === 0 ? 'light' : 'accent'
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
    const deepRaw = styles.getPropertyValue('--db518-deep').trim()
      || styles.getPropertyValue('--dark').trim()
      || '#07020d';
    const key = `${accentRaw}|${lightRaw}|${goldRaw}|${deepRaw}`;
    if (!force && key === this.paletteKey) return;
    this.paletteKey = key;
    const nextPalette = {
      accent:parseColor(accentRaw, [0.67, 0.22, 0.94]),
      light:parseColor(lightRaw, [1, 0.72, 0.43]),
      gold:parseColor(goldRaw, [1, 0.84, 0.5]),
      deep:parseColor(deepRaw, [0.027, 0.008, 0.051])
    };
    this.paletteTarget = nextPalette;
    if (!this.paletteInitialized) {
      this.palette = Object.fromEntries(
        Object.entries(nextPalette).map(([name, channels]) => [name, [...channels]])
      );
      this.paletteInitialized = true;
    }
    if (this.root) {
      this.root.dataset.skinPigment = 'selective-chroma';
      this.root.dataset.skinPalette = document.documentElement.dataset.finishSkin
        || document.documentElement.dataset.skin
        || 'classic';
    }
    this.energy = Math.max(this.energy, 0.56);
  }

  updatePalette(delta) {
    if (!this.paletteTarget) return;
    const ease = Math.min(1, delta * 0.00235);
    for (const name of ['accent','light','gold','deep']) {
      const current = this.palette[name];
      const target = this.paletteTarget[name];
      for (let channel = 0; channel < 3; channel += 1) {
        current[channel] += (target[channel] - current[channel]) * ease;
      }
    }
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
      /* Safari pode entregar um quadro transparente ao compositor quando o
         buffer é descartado. Um único buffer preservado elimina os apagões
         vistos na gravação sem criar outro canvas. */
      preserveDrawingBuffer:true,
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
        uniform vec2 u_touch_velocity;
        uniform float u_touch_energy;
        uniform float u_time;
        uniform float u_energy;
        uniform float u_seed;
        uniform float u_density;
        uniform float u_warmth;
        uniform float u_drift;
        uniform float u_depth;
        uniform float u_motion;
        uniform vec2 u_camera;
        uniform float u_scroll;
        uniform vec2 u_orb;
        uniform float u_orb_energy;
        uniform vec3 u_accent;
        uniform vec3 u_light;
        uniform vec3 u_gold;
        uniform vec3 u_deep;
        uniform vec2 u_flame_from;
        uniform vec2 u_flame_to;
        uniform float u_flame_level;
        uniform float u_flame_birth;
        uniform float u_flame_progress;
        uniform sampler2D u_cosmos;
        uniform float u_cosmos_mix;

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
          float amplitude=0.56;
          mat2 turn=mat2(0.80,-0.60,0.60,0.80);
          for(int octave=0;octave<3;octave++){
            value+=noise2(p)*amplitude;
            p=turn*p*2.02+vec2(7.13,3.71);
            amplitude*=0.47;
          }
          return value;
        }

        float fbmDetail(vec2 p){
          float value=0.0;
          float amplitude=0.55;
          mat2 turn=mat2(0.78,-0.63,0.63,0.78);
          for(int octave=0;octave<4;octave++){
            value+=noise2(p)*amplitude;
            p=turn*p*2.08+vec2(5.37,8.91);
            amplitude*=0.44;
          }
          return value;
        }

        float galaxy(vec2 p,vec2 center,float size,float phase,float time){
          vec2 d=p-center;
          d.x*=0.92;
          float radius=length(d)*size;
          float angle=atan(d.y,d.x);
          float breathing=0.99+0.01*sin(time*0.052+phase*2.0+radius*3.0);
          float spiral=0.5+0.5*cos(angle*2.0+radius*10.8-phase-time*0.018);
          float arm=pow(max(spiral,0.0),10.5);
          float innerArm=pow(max(spiral,0.0),3.2);
          float disk=exp(-radius*2.72)*breathing;
          float core=exp(-radius*radius*25.0);
          float dust=0.70+0.30*noise2(d*17.0+phase+time*0.0016);
          float dustLane=0.76+0.24*smoothstep(0.25,0.78,dust+arm*0.18);
          return (disk*(0.038+innerArm*0.075+arm*0.62)*dustLane+core*0.76)
            *(1.0-smoothstep(0.10,1.20,radius));
        }

        float starLayer(vec2 p,float scale,float seed,float time,out float giant){
          vec2 grid=p*scale;
          vec2 id=floor(grid);
          vec2 local=fract(grid)-0.5;
          vec2 jitter=vec2(hash21(id+seed+13.7),hash21(id+seed+71.9))-0.5;
          vec2 delta=local-jitter*0.56;
          float random=hash21(id+seed*31.7);
          float visible=step(0.969,random);
          float pixel=scale/max(min(u_resolution.x,u_resolution.y),1.0);
          float radius=pixel*mix(0.48,0.82,hash21(id+4.7));
          float distanceToStar=length(delta);
          float core=(1.0-smoothstep(radius,radius+pixel*0.82,distanceToStar))*visible;
          float halo=(1.0-smoothstep(radius*1.10,radius+pixel*3.8,distanceToStar))*visible;
          giant=step(0.9965,random)*visible;
          /* As estrelas mantêm luminância estável. A vida vem da paralaxe e
             do campo tátil, nunca de uma sequência de liga/desliga. */
          float luminance=mix(0.78,1.0,hash21(id+19.7));
          float vertical=(1.0-smoothstep(pixel*0.40,pixel*0.92,abs(delta.x)))
            *(1.0-smoothstep(pixel*1.7,pixel*9.5,abs(delta.y)))*giant;
          float horizontal=(1.0-smoothstep(pixel*0.40,pixel*0.92,abs(delta.y)))
            *(1.0-smoothstep(pixel*1.7,pixel*9.5,abs(delta.x)))*giant;
          return core*luminance+halo*0.095+(vertical+horizontal)*0.34;
        }

        mat2 constellationTurn(float angle){
          float cosine=cos(angle);
          float sine=sin(angle);
          return mat2(cosine,-sine,sine,cosine);
        }

        float constellationSegment(vec2 point,vec2 start,vec2 finish){
          vec2 line=finish-start;
          float projection=clamp(dot(point-start,line)/max(dot(line,line),0.00001),0.0,1.0);
          float distanceToLine=length(point-(start+line*projection));
          float core=1.0-smoothstep(0.0012,0.0034,distanceToLine);
          float aura=1.0-smoothstep(0.0034,0.0135,distanceToLine);
          return core+aura*0.18;
        }

        float constellationStar(vec2 point,vec2 star){
          float distanceToStar=length(point-star);
          float core=exp(-distanceToStar*235.0);
          float aura=exp(-distanceToStar*58.0);
          return core+aura*0.24;
        }

        void livingConstellations(vec2 point,float aspect,float time,out float lines,out float stars){
          lines=0.0;
          stars=0.0;
          vec2 constellationScale=vec2(
            clamp(aspect*1.42,0.60,1.0),
            clamp(aspect*1.18,0.72,1.0)
          );

          float crownAngle=sin(time*0.105+u_seed*4.7)*0.075;
          vec2 crown=constellationTurn(crownAngle)
            *(point-vec2(-aspect*0.285,-0.255+sin(time*0.09+u_seed)*0.012));
          vec2 c0=vec2(-0.135,0.038)*constellationScale;
          vec2 c1=vec2(-0.072,-0.052+sin(time*0.17)*0.005)*constellationScale;
          vec2 c2=vec2(0.0,0.018)*constellationScale;
          vec2 c3=vec2(0.074,-0.064+cos(time*0.14)*0.005)*constellationScale;
          vec2 c4=vec2(0.142,0.042)*constellationScale;
          if(abs(crown.x)<0.18*constellationScale.x+0.02
             &&abs(crown.y)<0.105*constellationScale.y+0.02){
            lines+=constellationSegment(crown,c0,c1);
            lines+=constellationSegment(crown,c1,c2);
            lines+=constellationSegment(crown,c2,c3);
            lines+=constellationSegment(crown,c3,c4);
            lines+=constellationSegment(crown,c0,c2)*0.66;
            lines+=constellationSegment(crown,c2,c4)*0.66;
            stars+=constellationStar(crown,c0);
            stars+=constellationStar(crown,c1);
            stars+=constellationStar(crown,c2);
            stars+=constellationStar(crown,c3);
            stars+=constellationStar(crown,c4);
          }

          float riverAngle=sin(time*0.087+u_seed*7.1)*0.09;
          vec2 river=constellationTurn(riverAngle)
            *(point-vec2(aspect*0.30,0.245+cos(time*0.075+u_seed)*0.014));
          vec2 r0=vec2(-0.105,-0.12)*constellationScale;
          vec2 r1=vec2(-0.048,-0.066+sin(time*0.15+0.4)*0.006)*constellationScale;
          vec2 r2=vec2(-0.083,0.005)*constellationScale;
          vec2 r3=vec2(-0.012,0.057+cos(time*0.13)*0.006)*constellationScale;
          vec2 r4=vec2(0.058,0.025)*constellationScale;
          vec2 r5=vec2(0.112,0.112)*constellationScale;
          if(abs(river.x)<0.145*constellationScale.x+0.02
             &&abs(river.y)<0.155*constellationScale.y+0.02){
            lines+=constellationSegment(river,r0,r1);
            lines+=constellationSegment(river,r1,r2);
            lines+=constellationSegment(river,r2,r3);
            lines+=constellationSegment(river,r3,r4);
            lines+=constellationSegment(river,r4,r5);
            stars+=constellationStar(river,r0);
            stars+=constellationStar(river,r1);
            stars+=constellationStar(river,r2);
            stars+=constellationStar(river,r3);
            stars+=constellationStar(river,r4);
            stars+=constellationStar(river,r5);
          }
        }

        vec3 celestialFlame(vec2 uv,float aspect,float time,out float alpha){
          vec2 point=vec2(uv.x*aspect,uv.y);
          vec2 origin=vec2(u_flame_from.x*aspect,u_flame_from.y);
          vec2 destination=vec2(u_flame_to.x*aspect,u_flame_to.y);
          vec2 axis=destination-origin;
          float axisSquared=max(dot(axis,axis),0.0001);
          float along=clamp(dot(point-origin,axis)/axisSquared,0.0,1.0);
          vec2 tangent=axis*inversesqrt(axisSquared);
          vec2 normal=vec2(-tangent.y,tangent.x);
          float envelope=smoothstep(-0.01,0.07,along)
            *(1.0-smoothstep(0.93,1.015,along));

          float serpentine=(sin(along*6.283185+0.62)
            +0.44*sin(along*12.56637-0.85-time*0.24))*0.033;
          serpentine*=sin(along*3.1415926);
          vec2 center=mix(origin,destination,along)+normal*serpentine;
          float side=dot(point-center,normal);
          float width=mix(0.074,0.042,along)
            *(0.88+0.14*sin(along*25.0-time*1.18));

          vec2 flow=vec2(side*18.0+sin(along*11.0)*0.62,
                         along*8.2-time*0.86);
          float n1=noise2(flow);
          float n2=noise2(flow*1.87+vec2(3.7,-time*0.34));
          float n3=noise2(vec2(side*43.0-time*0.21,
                               along*18.0-time*1.31));
          float displacement=(n1-0.5)*width*0.94+(n2-0.5)*width*0.42;
          float displaced=abs(side+displacement);
          float braid=sin(along*22.0-time*1.08+n2*4.2)*width*0.29;

          float broad=1.0-smoothstep(width*0.22,width*1.42,displaced);
          float lobeA=1.0-smoothstep(width*0.10,width*0.78,
                                     abs(side+displacement+braid));
          float lobeB=1.0-smoothstep(width*0.12,width*0.84,
                                     abs(side+displacement-braid*0.82));
          float cellular=smoothstep(0.18,0.79,n1*0.52+n2*0.29+n3*0.19+broad*0.24);
          float outer=max(broad*0.72,max(lobeA,lobeB)*0.64)
            *(0.56+cellular*0.44)*envelope;
          float middle=(1.0-smoothstep(width*0.08,width*0.78,displaced))
            *(0.46+n2*0.54)*envelope;
          float core=(1.0-smoothstep(width*0.045,width*0.36,
                                     abs(side+displacement*0.48)))
            *smoothstep(0.38,0.78,n1*0.56+n3*0.44)*envelope;
          float hotA=1.0-smoothstep(width*0.06,width*0.43,
                                    abs(side+displacement*0.34+braid*0.68));
          float hotB=1.0-smoothstep(width*0.07,width*0.46,
                                    abs(side+displacement*0.31-braid*0.6));
          float hot=max(hotA,hotB)
            *(0.3+smoothstep(0.22,0.76,n1*0.47+n3*0.53)*0.7)*envelope;
          float wisp=(1.0-smoothstep(width*0.28,width*1.72,
                                    abs(side-displacement*0.34+braid)))
            *smoothstep(0.64,0.88,n3)*envelope;
          vec2 sparkGrid=vec2(side/max(width,0.001)*2.4,
                              along*38.0-time*3.1);
          vec2 sparkId=floor(sparkGrid);
          vec2 sparkLocal=fract(sparkGrid)-0.5;
          float sparkRandom=hash21(sparkId+u_seed*73.0);
          sparkLocal-=vec2(hash21(sparkId+19.4)-0.5,
                           hash21(sparkId+51.7)-0.5)*0.36;
          float sparks=(1.0-smoothstep(0.035,0.17,length(sparkLocal)))
            *step(0.84,sparkRandom)
            *(1.0-smoothstep(width*0.72,width*1.9,abs(side)))
            *envelope;

          float traveler=exp(-pow((along-u_flame_progress)*11.5,2.0))
            *(1.0-smoothstep(width*0.18,width*1.18,displaced))
            *u_flame_birth;
          float originBloom=exp(-length(point-origin)*20.0)*(0.28+u_flame_birth*0.3);
          float portalBloom=exp(-length(point-destination)*27.0)
            *(0.15+traveler*0.62);

          vec3 violet=mix(u_accent,vec3(0.50,0.055,0.94),0.34);
          vec3 magenta=mix(u_accent,vec3(1.0,0.075,0.52),0.56);
          vec3 amber=mix(u_gold,vec3(1.0,0.34,0.035),0.34);
          float magentaMix=clamp(middle*0.84+lobeA*lobeB*0.2,0.0,0.88);
          float amberMix=clamp(hot*0.82+core*0.3+traveler*0.46,0.0,0.92);
          vec3 chroma=mix(violet,magenta,magentaMix);
          chroma=mix(chroma,amber,amberMix);
          float luminosity=clamp(outer*0.5+middle*0.32+hot*0.38
                                 +core*0.2+traveler*0.42,0.0,1.08);
          vec3 flame=chroma*luminosity*1.22
            +violet*wisp*0.18
            +amber*sparks*(0.16+u_flame_birth*0.58)
            +violet*originBloom*0.2
            +amber*portalBloom*0.24;
          alpha=clamp(outer*0.72+middle*0.42+hot*0.38+core*0.24+wisp*0.22+sparks*0.25
                      +traveler*0.64+originBloom*0.16+portalBloom*0.2,0.0,1.0);
          return flame*u_flame_level;
        }

        void main(){
          vec2 uv=gl_FragCoord.xy/u_resolution.xy;
          uv.y=1.0-uv.y;
          float aspect=u_resolution.x/max(u_resolution.y,1.0);
          vec2 base=vec2((uv.x-0.5)*aspect,uv.y-0.5);
          float time=u_time*u_motion;
          float breath=0.985+0.015*sin(time*0.10+u_seed*6.283185);
          vec2 camera=vec2(u_camera.x*aspect,u_camera.y);
          vec2 orb=vec2((u_orb.x-0.5)*aspect,u_orb.y-0.5);
          vec2 fromOrb=base-orb;
          float orbDistance=length(fromOrb);
          vec2 gravity=(fromOrb/(orbDistance+0.08))*exp(-orbDistance*5.1)
            *(0.004+u_orb_energy*0.009);
          vec2 pointer=vec2((u_pointer.x-0.5)*aspect,u_pointer.y-0.5);
          vec2 fromTouch=base-pointer;
          float touchDistance=length(fromTouch);
          vec2 touchNormal=fromTouch/(touchDistance+0.055);
          vec2 touchTangent=vec2(-touchNormal.y,touchNormal.x);
          vec2 touchVelocity=vec2(u_touch_velocity.x*aspect,u_touch_velocity.y);
          float velocityStrength=clamp(length(touchVelocity)*4.8,0.0,1.0);
          float touchField=exp(-touchDistance*2.72)*u_touch_energy;
          float touchWake=exp(-touchDistance*4.9)*u_touch_energy*velocityStrength;
          float touchWave=sin(touchDistance*11.5-time*0.54+u_seed*9.0);
          float tactileWave=sin(touchDistance*19.0-time*1.24+u_seed*12.7);
          float touchPressure=(0.56+0.44*cos(touchDistance*7.8-time*0.31))*touchField;
          vec2 touchFlow=touchTangent*touchField*(0.025+velocityStrength*0.078)
            *(0.72+touchWave*0.28)
            +touchVelocity*touchField*0.29
            +touchNormal*tactileWave*touchField*(0.010+velocityStrength*0.013);
          vec2 tactileFlow=touchTangent*touchPressure*(0.008+velocityStrength*0.020)
            +touchNormal*tactileWave*touchField*0.012;
          vec2 p=base-camera*0.052-vec2(0.0,u_scroll*0.026)+gravity+touchFlow;
          vec2 slow=vec2(time*0.0044*u_drift,-time*0.0033*u_drift);
          const float cosmosAspect=0.571543;
          vec2 coverScale=aspect<cosmosAspect
            ?vec2(aspect/cosmosAspect,1.0)
            :vec2(1.0,cosmosAspect/aspect);
          float cosmosBreath=0.968+0.004*sin(time*0.105+u_seed*4.7);
          vec2 cosmosUv=(uv-0.5)*coverScale*cosmosBreath+0.5;
          vec2 cosmosDomain=vec2((uv.x-0.5)*aspect,uv.y-0.5);
          float cosmosCurrentA=noise2(
            cosmosDomain*1.42+vec2(time*0.028,-time*0.021)+u_seed*5.1
          );
          float cosmosCurrentB=noise2(
            cosmosDomain*1.63+vec2(-time*0.024,time*0.031)+u_seed*8.7
          );
          cosmosUv+=vec2(
            cosmosCurrentA-cosmosCurrentB,
            cosmosCurrentA+cosmosCurrentB-1.0
          )*(0.0094+u_density*0.0023);
          cosmosUv-=vec2(camera.x/max(aspect,0.08),camera.y)*0.18;
          cosmosUv+=vec2(
            (touchFlow.x*0.62+tactileFlow.x)/max(aspect,0.08),
            touchFlow.y*0.62+tactileFlow.y
          );
          cosmosUv+=vec2(
            sin(time*0.045+u_seed*8.0)+sin(time*0.017+u_seed*3.2)*0.42,
            cos(time*0.037+u_seed*5.0)+cos(time*0.014+u_seed*6.1)*0.38
          )*0.0082*u_drift;
          cosmosUv=clamp(cosmosUv,vec2(0.006),vec2(0.994));
          vec3 cosmosSample=texture2D(u_cosmos,cosmosUv).rgb;
          float cosmosLuma=dot(cosmosSample,vec3(0.2126,0.7152,0.0722));
          float cosmosHigh=max(max(cosmosSample.r,cosmosSample.g),cosmosSample.b);
          float cosmosLow=min(min(cosmosSample.r,cosmosSample.g),cosmosSample.b);
          float cosmosChroma=cosmosHigh-cosmosLow;
          float purpleMatter=smoothstep(
            -0.018,
            0.19,
            min(cosmosSample.r,cosmosSample.b)-cosmosSample.g*0.72
          );
          float nebulaPigment=smoothstep(0.025,0.30,cosmosChroma)
            *smoothstep(0.012,0.58,cosmosLuma)
            *purpleMatter;
          float nebulaTone=smoothstep(0.018,0.48,cosmosLuma);
          float starCore=smoothstep(0.60,0.96,cosmosLuma)
            *(1.0-smoothstep(0.055,0.27,cosmosChroma));
          vec3 skinNebula=mix(u_deep*0.54,u_accent,nebulaTone);
          skinNebula=mix(
            skinNebula,
            mix(u_light,u_gold,u_warmth*0.44),
            smoothstep(0.32,0.90,cosmosLuma)*0.48
          );
          skinNebula*=0.40+cosmosLuma*1.70;
          vec3 sourceDetail=cosmosSample/max(cosmosHigh,0.025);
          skinNebula*=mix(vec3(1.0),0.86+sourceDetail*0.14,0.52);
          cosmosSample=mix(cosmosSample,skinNebula,nebulaPigment*0.70);
          cosmosSample=mix(
            cosmosSample,
            mix(vec3(1.0),u_gold,0.24),
            starCore*0.16
          );

          vec2 flow=vec2(
            fbm(p*1.24+slow+u_seed*9.1),
            fbm(p*1.19-slow+vec2(4.8,1.7)+u_seed*5.3)
          )-0.5;
          vec2 fluid=p+flow*0.34;
          float cloud=fbm(fluid*2.05+slow*0.64);
          float detail=fbmDetail(fluid*4.18-flow*1.22-slow*0.82);
          float micro=noise2(fluid*15.2+flow*2.7-slow*1.3+u_seed*11.0);
          float ridge=1.0-abs(cloud*2.0-1.0);
          float edge=smoothstep(0.10,0.72,abs(uv.x-0.5)*2.0);
          float filament=smoothstep(0.38,0.80,ridge)
            *smoothstep(0.30,0.72,detail);
          float curl=0.5+0.5*sin((fluid.y+flow.x*0.24)*25.0
            +(fluid.x-flow.y*0.18)*12.0-time*0.045);
          float silk=pow(curl,5.4)*filament;
          float ribbonLeft=exp(-abs(fluid.x+aspect*0.38
            +sin(fluid.y*4.6+flow.x*2.0+time*0.031)*0.066)*11.0);
          float ribbonRight=exp(-abs(fluid.x-aspect*0.40
            +cos(fluid.y*4.1-flow.y*1.8-time*0.027)*0.073)*10.5);
          float ribbons=(ribbonLeft+ribbonRight)*(0.38+detail*0.62);
          float plumePathA=abs(fluid.x
            +sin(fluid.y*3.35+flow.x*3.1+time*0.051)*aspect*0.28);
          float plumePathB=abs(fluid.x
            -cos(fluid.y*2.85-flow.y*2.7-time*0.043)*aspect*0.31);
          float plumeA=exp(-plumePathA*5.8);
          float plumeB=exp(-plumePathB*6.4);
          float veil=smoothstep(0.43,0.71,cloud*0.76+detail*0.24);
          float voiceCloud=(plumeA*0.58+plumeB*0.42)
            *(0.30+veil*0.38+filament*0.32);
          float voiceThread=(1.0-smoothstep(0.006,0.024,plumePathA))
            *(0.38+detail*0.62)
            +(1.0-smoothstep(0.008,0.028,plumePathB))
            *(0.32+filament*0.68);
          vec2 cloudA=fluid-vec2(-aspect*0.47+sin(time*0.071+u_seed)*0.052,-0.34+cos(time*0.043)*0.018);
          vec2 cloudB=fluid-vec2(aspect*0.49+cos(time*0.063+u_seed)*0.048,-0.19+sin(time*0.052)*0.021);
          vec2 cloudC=fluid-vec2(-aspect*0.51+cos(time*0.038)*0.026,0.09+sin(time*0.058)*0.055);
          vec2 cloudD=fluid-vec2(aspect*0.50+sin(time*0.046)*0.024,0.26+cos(time*0.066)*0.052);
          vec2 cloudE=fluid-vec2(-aspect*0.38+sin(time*0.054)*0.058,0.43+cos(time*0.039)*0.023);
          float liquidField=exp(-dot(cloudA,cloudA)*28.0)
            +exp(-dot(cloudB,cloudB)*25.0)
            +exp(-dot(cloudC,cloudC)*27.0)
            +exp(-dot(cloudD,cloudD)*24.0)
            +exp(-dot(cloudE,cloudE)*26.0);
          float liquidBody=smoothstep(0.16,0.58,liquidField)*(0.64+detail*0.36);
          float liquidRim=(1.0-smoothstep(0.035,0.12,abs(liquidField-0.38)))
            *(0.58+micro*0.42);
          float darkDust=smoothstep(0.62,0.88,(1.0-detail)*0.62+cloud*0.28);
          float cloudResponse=1.0+touchField*(0.26+velocityStrength*0.16)+touchWake*0.28;
          float nebula=(veil*0.68+filament*0.40+ribbons*0.32+silk*0.18+voiceCloud*0.26)
            *mix(0.58,1.16,edge)*u_density*(1.0-darkDust*0.26)*breath*cloudResponse;
          float hotDust=smoothstep(0.40,0.72,
            detail*0.44+filament*0.32+silk*0.14+micro*0.10+edge*0.04);
          float wispWave=0.5+0.5*sin(
            (fluid.y+flow.x*0.42)*54.0
            +(fluid.x-flow.y*0.37)*31.0
            +cloud*7.0-time*0.055
          );
          float fineWisps=pow(wispWave,10.0)
            *smoothstep(0.06,0.58,nebula)*(0.34+micro*0.66);
          float cloudGrain=smoothstep(0.52,0.78,detail*0.80+micro*0.20)
            *smoothstep(0.05,0.52,nebula);
          float travelingBreath=0.94+0.06*sin(
            time*0.145+fluid.y*5.4+fluid.x*2.7+flow.x*5.8
          );
          float laceWave=0.5+0.5*cos(
            (fluid.x+flow.y*0.34)*72.0
            +(fluid.y-flow.x*0.31)*39.0
            +detail*7.4-time*0.062
          );
          float nebulaLace=pow(laceWave,11.0)
            *smoothstep(0.22,0.70,filament+veil*0.22)
            *(0.42+micro*0.58);
          float dustPearls=pow(smoothstep(0.66,0.88,micro),2.4)
            *smoothstep(0.08,0.58,nebula)*filament;

          float liveLayer=mix(1.0,0.32,u_cosmos_mix);
          vec3 color=max(vec3(0.0014,0.0005,0.0032),u_deep*0.17);
          color=mix(color,cosmosSample*(0.84+cosmosLuma*0.06),u_cosmos_mix);
          color+=u_accent*nebula*travelingBreath*(0.23+filament*0.47+silk*0.20)
            *(0.76+micro*0.24)*liveLayer;
          color+=mix(u_accent,u_light,0.42)*hotDust*nebula
            *(0.15+u_warmth*0.21+silk*0.17)*travelingBreath*liveLayer;
          color+=u_gold*pow(max(hotDust*silk,0.0),2.15)*0.29*u_warmth*liveLayer;
          color+=mix(u_accent,u_light,0.56)*ribbons*filament*0.13*liveLayer;
          color+=mix(u_accent,u_light,0.30+u_warmth*0.18)
            *voiceCloud*(0.034+filament*0.072)*travelingBreath*liveLayer;
          color+=mix(u_accent,u_gold,0.34+u_warmth*0.24)
            *voiceThread*(0.18+hotDust*0.13)*liveLayer;
          color+=mix(u_accent,u_light,0.52)*fineWisps*(0.15+hotDust*0.17)*liveLayer;
          color+=mix(u_accent,u_gold,0.26+u_warmth*0.18)
            *cloudGrain*(0.070+filament*0.090)*liveLayer;
          color+=mix(u_accent,u_light,0.46)*nebulaLace*(0.12+hotDust*0.16)*liveLayer;
          color+=mix(u_accent,u_gold,0.38)*dustPearls*0.085*liveLayer;
          color+=u_accent*liquidBody*(0.047+filament*0.092)*travelingBreath*liveLayer;
          color+=mix(u_accent,u_light,0.38)*liquidRim*(0.072+hotDust*0.092)*liveLayer;
          color+=mix(u_accent,u_light,0.36)*touchWake
            *(0.075+filament*0.13+nebulaLace*0.08)*mix(1.0,0.72,u_cosmos_mix);
          color-=vec3(0.0015,0.0006,0.0022)*darkDust;

          vec2 farPlane=base-camera*0.016-vec2(0.0,u_scroll*0.010)+slow*0.025;
          vec2 midPlane=base-camera*0.048-vec2(0.0,u_scroll*0.026)+slow*0.055;
          vec2 nearPlane=base-camera*0.088-vec2(0.0,u_scroll*0.050)+slow*0.082+gravity*1.5;
          float g1=galaxy(farPlane,vec2(-aspect*0.43,-0.31),3.02,0.4+u_seed,time);
          float g2=galaxy(midPlane,vec2(aspect*0.44,0.23),3.38,2.2-u_seed,time);
          float g3=galaxy(farPlane,vec2(aspect*0.46,-0.24),4.35,4.1+u_seed,time);
          float g4=galaxy(midPlane,vec2(-aspect*0.46,0.34),4.05,5.7-u_seed,time);
          float galaxyLayer=mix(1.0,0.12,u_cosmos_mix);
          color+=mix(u_accent,u_gold,0.42)*g1*0.32*u_depth*galaxyLayer;
          color+=mix(u_accent,u_light,0.30)*g2*0.27*u_depth*galaxyLayer;
          color+=mix(u_accent,u_light,0.22)*g3*0.17*u_depth*galaxyLayer;
          color+=mix(u_accent,u_gold,0.34)*g4*0.19*u_depth*galaxyLayer;

          float giantFar=0.0;
          float giantMid=0.0;
          float giantNear=0.0;
          float starsFar=starLayer(farPlane,78.0,u_seed*137.0+31.0,time,giantFar);
          float starsMid=starLayer(midPlane,46.0,u_seed*83.0,time,giantMid);
          float starsNear=starLayer(nearPlane,27.0,u_seed*127.0+17.0,time,giantNear);
          vec3 farColor=mix(vec3(0.52,0.66,1.0),u_light,0.18);
          vec3 midColor=mix(vec3(0.86,0.64,1.0),u_gold,0.32+u_warmth*0.22);
          vec3 nearColor=mix(u_light,u_gold,0.46);
          float starLayerMix=mix(1.0,0.46,u_cosmos_mix);
          color+=farColor*starsFar*0.20*u_density*u_depth*starLayerMix;
          color+=midColor*starsMid*0.34*u_density*u_depth*starLayerMix;
          color+=nearColor*starsNear*0.47*u_density*u_depth*starLayerMix;

          float constellationLines=0.0;
          float constellationStars=0.0;
          vec2 constellationPlane=p-camera*0.022+slow*0.08+touchFlow*1.35;
          livingConstellations(
            constellationPlane,
            aspect,
            time,
            constellationLines,
            constellationStars
          );
          vec3 constellationColor=mix(u_light,u_gold,0.48+u_warmth*0.18);
          color+=constellationColor*constellationLines*0.085*u_depth;
          color+=mix(constellationColor,vec3(1.0),0.20)*constellationStars*0.42*u_depth;

          float orbAura=exp(-orbDistance*5.4)*(0.025+u_orb_energy*0.055);
          float livingPulse=0.96+0.04*sin(time*0.22+orbDistance*12.0);
          color+=mix(u_accent,u_gold,0.42)*orbAura*livingPulse;

          if(u_flame_level>0.002){
            vec2 flameOrigin=vec2(u_flame_from.x*aspect,u_flame_from.y);
            vec2 flameDestination=vec2(u_flame_to.x*aspect,u_flame_to.y);
            vec2 flamePoint=vec2(uv.x*aspect,uv.y);
            vec2 low=min(flameOrigin,flameDestination)-vec2(0.16,0.095);
            vec2 high=max(flameOrigin,flameDestination)+vec2(0.16,0.095);
            if(flamePoint.x>low.x&&flamePoint.x<high.x
               &&flamePoint.y>low.y&&flamePoint.y<high.y){
              float flameAlpha=0.0;
              vec3 flame=celestialFlame(uv,aspect,time,flameAlpha);
              color+=flame*(0.78+flameAlpha*0.2);
            }
          }

          float touchGlow=exp(-length(p-pointer)*5.8)*u_energy;
          color+=mix(u_accent,u_gold,u_warmth)*touchGlow*0.075;
          color+=mix(u_accent,u_light,0.5)*touchField*(0.045+velocityStrength*0.072);
          float centerCalm=1.0-smoothstep(0.05,0.42,length(vec2((uv.x-0.5)*0.74,uv.y-0.52)));
          color*=1.0-centerCalm*0.075;
          float vignette=smoothstep(0.95,0.28,length((uv-0.5)*vec2(0.82,1.0)));
          color*=0.70+vignette*0.38;
          color=pow(max(color,vec3(0.0)),vec3(0.96));
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
        touchVelocity:this.gl.getUniformLocation(program, 'u_touch_velocity'),
        touchEnergy:this.gl.getUniformLocation(program, 'u_touch_energy'),
        time:this.gl.getUniformLocation(program, 'u_time'),
        energy:this.gl.getUniformLocation(program, 'u_energy'),
        seed:this.gl.getUniformLocation(program, 'u_seed'),
        density:this.gl.getUniformLocation(program, 'u_density'),
        warmth:this.gl.getUniformLocation(program, 'u_warmth'),
        drift:this.gl.getUniformLocation(program, 'u_drift'),
        depth:this.gl.getUniformLocation(program, 'u_depth'),
        motion:this.gl.getUniformLocation(program, 'u_motion'),
        camera:this.gl.getUniformLocation(program, 'u_camera'),
        scroll:this.gl.getUniformLocation(program, 'u_scroll'),
        orb:this.gl.getUniformLocation(program, 'u_orb'),
        orbEnergy:this.gl.getUniformLocation(program, 'u_orb_energy'),
        accent:this.gl.getUniformLocation(program, 'u_accent'),
        light:this.gl.getUniformLocation(program, 'u_light'),
        gold:this.gl.getUniformLocation(program, 'u_gold'),
        deep:this.gl.getUniformLocation(program, 'u_deep'),
        flameFrom:this.gl.getUniformLocation(program, 'u_flame_from'),
        flameTo:this.gl.getUniformLocation(program, 'u_flame_to'),
        flameLevel:this.gl.getUniformLocation(program, 'u_flame_level'),
        flameBirth:this.gl.getUniformLocation(program, 'u_flame_birth'),
        flameProgress:this.gl.getUniformLocation(program, 'u_flame_progress'),
        cosmosTexture:this.gl.getUniformLocation(program, 'u_cosmos'),
        cosmosMix:this.gl.getUniformLocation(program, 'u_cosmos_mix')
      };
      this.cosmos.texture = this.gl.createTexture();
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.cosmos.texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0,
        this.gl.RGBA, this.gl.UNSIGNED_BYTE,
        new Uint8Array([2, 0, 7, 255])
      );
      this.gl.useProgram(program);
      this.gl.uniform1i(this.uniforms.cosmosTexture, 0);
      this.mode = 'webgl-procedural';
      this.root.dataset.renderer = this.mode;
      this.gl.clearColor(0.0018,0.0005,0.0048,1);
    } catch (error) {
      console.info('[Divina] Universo WebGL cedeu ao céu procedural Canvas.', error);
      this.useCanvasFallback();
    }
  }

  loadCosmosTexture() {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'high';
    image.addEventListener('load', () => this.commitCosmosTexture(image), { once:true });
    image.addEventListener('error', () => {
      this.root.dataset.cosmosTexture = 'css-fallback';
    }, { once:true });
    image.src = COSMOS_TEXTURE;
    this.cosmos.image = image;
  }

  commitCosmosTexture(image) {
    if (this.destroyed || !image?.naturalWidth || !image?.naturalHeight) return false;
    this.cosmos.ready = true;
    this.cosmos.target = 1;
    this.root.dataset.cosmosTexture = `${image.naturalWidth}x${image.naturalHeight}-retina-live`;
    if (!this.gl || !this.cosmos.texture) {
      this.cosmos.mix = 1;
      this.start();
      return true;
    }
    try {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.cosmos.texture);
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA,
        this.gl.RGBA, this.gl.UNSIGNED_BYTE, image
      );
      this.start();
      return true;
    } catch (error) {
      this.cosmos.ready = false;
      this.cosmos.target = 0;
      this.root.dataset.cosmosTexture = 'css-fallback';
      console.info('[Divina] Textura Retina permaneceu no fundo CSS.', error);
      return false;
    }
  }

  useCanvasFallback() {
    if (this.gl) {
      const replacement = document.createElement('canvas');
      replacement.setAttribute('data-living-universe-canvas', '');
      Object.assign(replacement.style, {
        position:'absolute', inset:'0', display:'block', width:'100%', height:'100%'
      });
      this.canvas.replaceWith(replacement);
      this.canvas = replacement;
    }
    this.gl = null;
    this.program = null;
    this.context = this.canvas.getContext('2d', { alpha:true, desynchronized:true });
    this.mode = 'canvas-procedural';
    this.root.dataset.renderer = this.mode;
  }

  bind() {
    this.resizeTimer = 0;
    this.onResize = () => {
      this.flame.geometryDirty = true;
      this.orbGeometryDirty = true;
      const nextWidth = stableViewport().width;
      if (Math.abs(nextWidth - this.width) <= 2) return;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resizeTimer = 0;
        this.resize({ force:true });
      }, 220);
    };
    addEventListener('resize', this.onResize, { passive:true });
    this.onViewportShift = event => {
      this.flame.geometryDirty = true;
      this.orbGeometryDirty = true;
      const candidate = event?.target && event.target !== document && event.target !== globalThis
        ? event.target
        : document.scrollingElement;
      const top = Number(candidate?.scrollTop ?? globalThis.scrollY ?? 0);
      const extent = Math.max(1, Number(candidate?.scrollHeight || document.documentElement.scrollHeight)
        - Number(candidate?.clientHeight || innerHeight));
      this.scrollTarget = clamp(top / extent, 0, 1);
    };
    addEventListener('scroll', this.onViewportShift, { passive:true, capture:true });
    globalThis.visualViewport?.addEventListener('resize', this.onResize, { passive:true });
    globalThis.visualViewport?.addEventListener('scroll', this.onViewportShift, { passive:true });
    this.portalObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(this.onViewportShift)
      : null;
    this.onVisibility = () => {
      this.visible = !document.hidden;
      if (this.visible) {
        this.lastFrame = 0;
        this.orbGeometryDirty = true;
        this.start();
      }
      else this.pause();
    };
    document.addEventListener('visibilitychange', this.onVisibility);
    this.onPointerMove = event => {
      const next = {
        x:clamp(event.clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(event.clientY / Math.max(innerHeight, 1), 0, 1)
      };
      const now = Number.isFinite(event.timeStamp) ? event.timeStamp : performance.now();
      const delta = clamp(now - this.touch.last.at, 8, 64);
      this.touch.velocityTarget = {
        x:clamp((next.x - this.touch.last.x) * 16.667 / delta, -0.22, 0.22),
        y:clamp((next.y - this.touch.last.y) * 16.667 / delta, -0.22, 0.22)
      };
      this.touch.last = { ...next, at:now };
      this.touch.lastMoveAt = performance.now();
      this.touch.target = Math.max(
        this.touch.target,
        this.touch.active || event.pointerType === 'touch' ? 1 : 0.52
      );
      this.pointerTarget = next;
      this.cameraTarget = {
        x:(this.pointerTarget.x - 0.5) * 0.085,
        y:(this.pointerTarget.y - 0.5) * 0.055
      };
    };
    this.onPointerDown = event => {
      this.pointerTarget = {
        x:clamp(event.clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(event.clientY / Math.max(innerHeight, 1), 0, 1)
      };
      this.pointer = { ...this.pointerTarget };
      this.touch.active = true;
      this.touch.target = 1;
      this.touch.lastMoveAt = performance.now();
      this.touch.last = {
        ...this.pointerTarget,
        at:Number.isFinite(event.timeStamp) ? event.timeStamp : performance.now()
      };
      this.touch.velocityTarget = { x:0, y:0 };
      this.cameraTarget = {
        x:(this.pointerTarget.x - 0.5) * 0.085,
        y:(this.pointerTarget.y - 0.5) * 0.055
      };
      this.energy = Math.max(this.energy, 1);
      this.orbEnergy = Math.max(this.orbEnergy, 0.72);
    };
    this.onPointerUp = () => {
      this.touch.active = false;
      this.touch.target = Math.max(this.touch.target, 0.34);
      this.touch.velocityTarget.x *= 0.42;
      this.touch.velocityTarget.y *= 0.42;
    };
    addEventListener('pointermove', this.onPointerMove, { passive:true });
    addEventListener('pointerdown', this.onPointerDown, { passive:true });
    addEventListener('pointerup', this.onPointerUp, { passive:true });
    addEventListener('pointercancel', this.onPointerUp, { passive:true });
    this.onSkinChange = () => this.syncPalette(true);
    ['divina:skin-change','divina:skin-applied','skin:changed','orbe:skin-change']
      .forEach(type => document.addEventListener(type, this.onSkinChange));
    this.onRouteEvent = event => this.setRoute(event.detail?.id || routeNow());
    document.addEventListener('divina:route-ready', this.onRouteEvent);
    document.addEventListener('divina:page-ready', this.onRouteEvent);
    addEventListener('hashchange', this.onRouteEvent, { passive:true });
    this.onOrbPulse = event => {
      const detail = event.detail || {};
      const intensity = clamp(Number(detail.intensity) || 0.7, 0.2, 1.4);
      this.orbEnergy = Math.max(this.orbEnergy, intensity);
      if (Number.isFinite(detail.x) && Number.isFinite(detail.y)) {
        const orb = document.querySelector('[data-supreme-orb="living"], #orb');
        const rect = orb?.getBoundingClientRect?.();
        this.pointerTarget = rect?.width && rect?.height
          ? {
              x:clamp((rect.left + detail.x * rect.width) / Math.max(innerWidth, 1), 0, 1),
              y:clamp((rect.top + detail.y * rect.height) / Math.max(innerHeight, 1), 0, 1)
            }
          : { x:clamp(detail.x,0,1), y:clamp(detail.y,0,1) };
        const radialX = detail.x - 0.5;
        const radialY = detail.y - 0.5;
        const radialLength = Math.hypot(radialX, radialY);
        const directionX = radialLength > 0.035 ? radialX / radialLength : 0.58;
        const directionY = radialLength > 0.035 ? radialY / radialLength : -0.82;
        this.touch.velocityTarget.x = clamp(
          this.touch.velocityTarget.x + directionX * intensity * 0.060,
          -0.22,
          0.22
        );
        this.touch.velocityTarget.y = clamp(
          this.touch.velocityTarget.y + directionY * intensity * 0.060,
          -0.22,
          0.22
        );
        this.touch.last = { ...this.pointerTarget, at:performance.now() };
      }
      this.touch.target = Math.max(this.touch.target, Math.min(1.22, 0.76 + intensity * 0.36));
      this.touch.lastMoveAt = performance.now();
      this.energy = Math.max(this.energy, intensity);
      this.orbGeometryDirty = true;
      this.start();
    };
    document.addEventListener('divina:supreme-orb-pulse', this.onOrbPulse);
    this.onOrbJourney = event => {
      this.orbGeometryDirty = true;
      this.orbEnergy = Math.max(this.orbEnergy, 0.82);
      if (event?.detail?.to) this.setRoute(event.detail.to);
    };
    this.onOrbJourneyError = () => this.setRoute(routeNow());
    document.addEventListener('divina:supreme-orb-will-navigate', this.onOrbJourney);
    document.addEventListener('divina:supreme-orb-did-navigate', this.onOrbJourney);
    document.addEventListener('divina:supreme-orb-navigation-error', this.onOrbJourneyError);
    document.addEventListener('divina:supreme-orb-recovered', this.onOrbJourneyError);
    document.addEventListener('divina:menu-state', this.onOrbJourney);
    document.addEventListener('divina:orbital-menu-ready', this.onOrbJourney);
    this.onContextLost = event => {
      event.preventDefault();
      this.pause();
      this.root.dataset.context = 'lost-fallback';
      this.useCanvasFallback();
      this.resize({ force:true });
      this.start();
    };
    this.contextEventCanvas = this.canvas;
    this.contextEventCanvas.addEventListener('webglcontextlost', this.onContextLost, { passive:false });
    this.observer = new MutationObserver(records => {
      if (records.some(record => record.target === document.body && record.attributeName === 'data-screen')) {
        this.setRoute(routeNow());
      }
      if (records.some(record => record.type === 'childList')) this.orbGeometryDirty = true;
      if (records.some(record => record.type === 'attributes')) this.syncPalette();
    });
    this.observer.observe(document.documentElement, { attributes:true, attributeFilter:['data-skin','data-orb-skin','style','class'] });
    this.observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['data-screen','data-skin'] });
    this.onViewportShift();
  }

  setRoute(route) {
    const next = String(route || routeNow()).toLowerCase();
    if (next === this.route) return;
    this.route = next;
    this.profileTarget = { ...(ROUTE_PROFILES[next] || {
      seed:(next.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 97) / 97,
      density:0.84,
      warmth:0.58,
      drift:0.48,
      depth:0.86
    }) };
    this.energy = Math.max(this.energy, 0.82);
    this.flame.target = this.flame.requested && next === 'tarot' ? 1 : 0;
    this.flame.geometryDirty = true;
    this.orbGeometryDirty = true;
    this.root.dataset.route = next;
  }

  updateOrbGeometry() {
    if (!this.orbGeometryDirty) return;
    this.orbGeometryDirty = false;
    const orb = document.querySelector('[data-supreme-orb="living"], #orb');
    const rect = orb?.getBoundingClientRect?.();
    if (!rect?.width || !rect?.height) return;
    this.orbPoint = {
      x:clamp((rect.left + rect.width * 0.5) / Math.max(innerWidth, 1), -0.2, 1.2),
      y:clamp((rect.top + rect.height * 0.5) / Math.max(innerHeight, 1), -0.2, 1.2)
    };
  }

  setPerformanceBudget({ fps, scale, profile } = {}) {
    const nextFps = clamp(Number(fps) || this.targetFps, 20, 60);
    const nextScale = clamp(Number(scale) || this.qualityCeiling, 1.25, 2.10);
    this.requestedFps = reducedMotion() ? Math.min(24, nextFps) : nextFps;
    this.targetFps = this.requestedFps;
    this.qualityCeiling = nextScale;
    this.qualityProfile = String(profile || this.qualityProfile || 'balanced');
    /* A primeira negociação acontece antes do primeiro RAF. Depois dela, a
       densidade fica congelada: pressão reduz cadência, nunca nitidez. */
    if (!this.lastSuccessfulDraw) {
      this.scale = nextScale;
      this.resize({ force:true });
    }
    this.root.dataset.performanceBudget = this.qualityProfile;
    return Object.freeze({
      fps:this.targetFps,
      scale:this.sessionRenderRatio || this.scale,
      ceiling:this.qualityCeiling,
      resolutionLocked:this.resolutionLocked
    });
  }

  setCelestialFlame({ orb, card, active=true }={}) {
    this.portalObserver?.disconnect();
    this.flame.orb = orb || null;
    this.flame.card = card || null;
    if (orb) this.portalObserver?.observe(orb);
    if (card) this.portalObserver?.observe(card);
    this.flame.geometryDirty = true;
    this.setCelestialFlameActive(active);
    return this;
  }

  setCelestialFlameActive(active) {
    this.flame.requested = Boolean(active);
    this.flame.target = this.flame.requested && this.route === 'tarot' ? 1 : 0;
    this.flame.geometryDirty = true;
    this.root.dataset.celestialFire = this.flame.requested ? 'alive' : 'resting';
    if (this.flame.requested) {
      this.flame.pulse = Math.max(this.flame.pulse, 0.3);
      this.start();
    } else {
      this.flame.birthProgress = -1;
      this.flame.birthEnergy = 0;
      this.flame.pulse = 0;
    }
  }

  pulseCelestialFlame(strength=0.7) {
    this.flame.pulse = Math.max(this.flame.pulse, clamp(Number(strength) || 0.7, 0.2, 1.4));
    this.energy = Math.max(this.energy, Math.min(1.35, this.flame.pulse));
    this.start();
  }

  birthCelestialFlame({ strength=1, duration=1040 }={}) {
    this.flame.birthEnergy = clamp(Number(strength) || 1, 0.35, 1.35);
    this.flame.birthProgress = 0;
    this.flame.birthStartedAt = performance.now();
    this.flame.birthDuration = Math.max(180, Number(duration) || 1040);
    this.pulseCelestialFlame(this.flame.birthEnergy);
  }

  updateFlameGeometry() {
    if (!this.flame.geometryDirty) return;
    this.flame.geometryDirty = false;
    const orbRect = this.flame.orb?.getBoundingClientRect?.();
    const cardRect = this.flame.card?.getBoundingClientRect?.();
    if (!orbRect?.width || !orbRect?.height || !cardRect?.width || !cardRect?.height) return;
    const viewportWidth = Math.max(innerWidth, 1);
    const viewportHeight = Math.max(innerHeight, 1);
    this.flame.from = {
      x:clamp((orbRect.left + orbRect.width * 0.5) / viewportWidth, -0.15, 1.15),
      y:clamp((orbRect.top + orbRect.height * 0.08) / viewportHeight, -0.15, 1.15)
    };
    this.flame.to = {
      x:clamp((cardRect.left + cardRect.width * 0.5) / viewportWidth, -0.15, 1.15),
      y:clamp((cardRect.bottom - cardRect.height * 0.025) / viewportHeight, -0.15, 1.15)
    };
  }

  updateFlame(delta, timestamp) {
    this.updateFlameGeometry();
    const response = this.flame.target > this.flame.level ? 0.0068 : 0.009;
    this.flame.level += (this.flame.target - this.flame.level)
      * Math.min(1, delta * response);
    this.flame.pulse += (0 - this.flame.pulse) * Math.min(1, delta * 0.0038);
    if (this.flame.birthProgress >= 0) {
      const progress = (timestamp - this.flame.birthStartedAt) / this.flame.birthDuration;
      if (progress >= 1) {
        this.flame.birthProgress = -1;
        this.flame.birthEnergy = 0;
      } else {
        this.flame.birthProgress = clamp(progress, 0, 1);
      }
    }
  }

  resize({ force=false }={}) {
    const viewport = stableViewport();
    const widthChanged = Math.abs(viewport.width - this.width) > 2;
    if (this.resolutionLocked && !force && !widthChanged) return false;
    this.width = viewport.width;
    this.height = viewport.height;
    const mobile = this.width < 700;
    const profile = this.qualityProfile || 'balanced';
    const ratioCeiling = Math.min(
      Math.max(1, Number(devicePixelRatio) || 1),
      this.scale
    );
    const pixelBudget = constrained() || profile === 'protected'
      ? 720000
      : profile === 'cinematic'
        ? (mobile ? 1360000 : 2300000)
        : (mobile ? 1120000 : 1900000);
    this.pixelRatio = Math.max(1, Number(devicePixelRatio) || 1);
    const budgetRatio = Math.sqrt(pixelBudget / Math.max(1, this.width * this.height));
    const renderRatio = Math.max(mobile ? 1.28 : 0.86, Math.min(ratioCeiling, budgetRatio));
    const width = Math.max(1, Math.round(this.width * renderRatio));
    const height = Math.max(1, Math.round(this.height * renderRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.root.style.width = `${this.width}px`;
    this.root.style.height = `${this.height}px`;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.renderRatio = renderRatio;
    this.sessionRenderRatio = renderRatio;
    this.renderPixels = width * height;
    this.resolutionLocked = true;
    this.resizeCount += 1;
    this.root.dataset.renderDensity = `${renderRatio.toFixed(2)}x`;
    this.root.dataset.backingPixels = String(this.renderPixels);
    this.root.dataset.resolutionLock = 'session-stable';
    this.gl?.viewport(0, 0, width, height);
    if (this.mode === 'webgl-procedural' && this.program) this.drawWebGL(performance.now());
    else if (this.context) this.drawCanvas(performance.now());
    return true;
  }

  drawWebGL(timestamp) {
    const gl = this.gl;
    if (!gl || !this.program) return;
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.cosmos.texture);
    gl.uniform1i(this.uniforms.cosmosTexture, 0);
    gl.uniform1f(this.uniforms.cosmosMix, this.cosmos.mix);
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
    gl.uniform2f(this.uniforms.touchVelocity, this.touch.velocity.x, this.touch.velocity.y);
    gl.uniform1f(this.uniforms.touchEnergy, this.touch.energy);
    gl.uniform1f(this.uniforms.time, this.elapsed);
    gl.uniform1f(this.uniforms.energy, this.energy);
    gl.uniform1f(this.uniforms.seed, this.profile.seed);
    gl.uniform1f(this.uniforms.density, this.profile.density);
    gl.uniform1f(this.uniforms.warmth, this.profile.warmth);
    gl.uniform1f(this.uniforms.drift, this.profile.drift);
    gl.uniform1f(this.uniforms.depth, this.profile.depth);
    gl.uniform1f(this.uniforms.motion, reducedMotion() ? 0.22 : 1);
    gl.uniform2f(this.uniforms.camera, this.camera.x, this.camera.y);
    gl.uniform1f(this.uniforms.scroll, this.scroll);
    gl.uniform2f(this.uniforms.orb, this.orbPoint.x, this.orbPoint.y);
    gl.uniform1f(this.uniforms.orbEnergy, this.orbEnergy);
    gl.uniform3fv(this.uniforms.accent, this.palette.accent);
    gl.uniform3fv(this.uniforms.light, this.palette.light);
    gl.uniform3fv(this.uniforms.gold, this.palette.gold);
    gl.uniform3fv(this.uniforms.deep, this.palette.deep);
    gl.uniform2f(this.uniforms.flameFrom, this.flame.from.x, this.flame.from.y);
    gl.uniform2f(this.uniforms.flameTo, this.flame.to.x, this.flame.to.y);
    gl.uniform1f(
      this.uniforms.flameLevel,
      clamp(this.flame.level + this.flame.pulse * 0.2, 0, 1.18)
    );
    gl.uniform1f(
      this.uniforms.flameBirth,
      this.flame.birthProgress < 0
        ? 0
        : this.flame.birthEnergy * (0.62 + Math.sin(this.flame.birthProgress * Math.PI) * 0.38)
    );
    gl.uniform1f(this.uniforms.flameProgress, this.flame.birthProgress);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  warpCanvasPoint(point, strength=1) {
    const pointerX = this.pointer.x * this.width;
    const pointerY = this.pointer.y * this.height;
    const dx = point.x - pointerX;
    const dy = point.y - pointerY;
    const distance = Math.max(1, Math.hypot(dx,dy));
    const fieldRadius = Math.max(180, Math.min(this.width,this.height) * 0.56);
    const field = Math.exp(-distance / fieldRadius) * this.touch.energy * strength;
    const tangentX = -dy / distance;
    const tangentY = dx / distance;
    const velocity = Math.hypot(this.touch.velocity.x,this.touch.velocity.y);
    const curl = (5 + velocity * 95) * field;
    return {
      x:point.x+tangentX*curl+this.touch.velocity.x*this.width*field*0.24,
      y:point.y+tangentY*curl+this.touch.velocity.y*this.height*field*0.24
    };
  }

  drawCanvasConstellations(context, time) {
    const color = this.palette.gold.map(value => Math.round(value * 255));
    const light = this.palette.light.map(value => Math.round(value * 255));
    const definitions = [
      {
        anchor:{ x:0.215, y:0.245 },
        phase:this.profile.seed * 4.7,
        points:[[-0.14,0.04],[-0.07,-0.055],[0,0.018],[0.074,-0.064],[0.142,0.042]],
        edges:[[0,1],[1,2],[2,3],[3,4],[0,2],[2,4]]
      },
      {
        anchor:{ x:0.79, y:0.73 },
        phase:this.profile.seed * 7.1+1.9,
        points:[[-0.105,-0.12],[-0.048,-0.066],[-0.083,0.005],[-0.012,0.057],[0.058,0.025],[0.112,0.112]],
        edges:[[0,1],[1,2],[2,3],[3,4],[4,5]]
      }
    ];
    const measure = Math.min(this.width,this.height);

    context.save();
    context.globalCompositeOperation = 'screen';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    for (const [groupIndex,definition] of definitions.entries()) {
      const angle = Math.sin(time*(groupIndex ? 0.087 : 0.105)+definition.phase)*0.075;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const driftX = Math.sin(time*0.075+definition.phase)*this.width*0.008;
      const driftY = Math.cos(time*0.082+definition.phase)*this.height*0.007;
      const points = definition.points.map(([rawX,rawY], index) => {
        const breath = Math.sin(time*(0.12+index*0.006)+definition.phase+index)*measure*0.0022;
        const x = rawX*measure;
        const y = rawY*measure+breath;
        return this.warpCanvasPoint({
          x:definition.anchor.x*this.width+driftX+x*cosine-y*sine-this.camera.x*this.width*0.12,
          y:definition.anchor.y*this.height+driftY+x*sine+y*cosine-this.camera.y*this.height*0.10
        }, 0.84);
      });
      context.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.18)`;
      context.lineWidth = 0.72+this.touch.energy*0.32;
      context.shadowColor = `rgba(${light[0]},${light[1]},${light[2]},.38)`;
      context.shadowBlur = 5+this.touch.energy*5;
      for (const [startIndex,endIndex] of definition.edges) {
        const start = points[startIndex];
        const finish = points[endIndex];
        const bend = Math.sin(time*0.34+startIndex*1.7+definition.phase)*2.2;
        context.beginPath();
        context.moveTo(start.x,start.y);
        context.quadraticCurveTo(
          (start.x+finish.x)*0.5+bend,
          (start.y+finish.y)*0.5-bend,
          finish.x,
          finish.y
        );
        context.stroke();
      }
      points.forEach((point,index) => {
        context.globalAlpha = 1;
        context.fillStyle = index % 3 === 0
          ? `rgb(${light[0]} ${light[1]} ${light[2]})`
          : `rgb(${color[0]} ${color[1]} ${color[2]})`;
        context.beginPath();
        context.arc(point.x,point.y,1.40,0,Math.PI*2);
        context.fill();
      });
      context.globalAlpha = 1;
    }
    context.restore();
  }

  drawCanvasFlame(context, time) {
    const level = clamp(this.flame.level + this.flame.pulse * 0.2, 0, 1.18);
    if (level < 0.004) return;
    const origin = {
      x:this.flame.from.x * this.width,
      y:this.flame.from.y * this.height
    };
    const destination = {
      x:this.flame.to.x * this.width,
      y:this.flame.to.y * this.height
    };
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    const length = Math.hypot(dx, dy);
    if (length < 20) return;
    const normal = { x:-dy / length, y:dx / length };
    const accent = this.palette.accent.map(value => Math.round(value * 255));
    const gold = this.palette.gold.map(value => Math.round(value * 255));
    const magenta = [
      Math.round(accent[0] * 0.44 + 255 * 0.56),
      Math.round(accent[1] * 0.44 + 20 * 0.56),
      Math.round(accent[2] * 0.44 + 132 * 0.56)
    ];
    const volumes = constrained() ? 12 : 18;
    const baseRadius = Math.min(this.width * 0.18, this.height * 0.085);

    context.save();
    context.globalCompositeOperation = 'screen';
    for (let index=0; index<volumes; index+=1) {
      const along = (index + 0.5) / volumes;
      const envelope = Math.sin(along * Math.PI) ** 0.55;
      const serpentine = (
        Math.sin(along * Math.PI * 2 + 0.62)
        + Math.sin(along * Math.PI * 4 - 0.85 - time * 0.24) * 0.44
      ) * baseRadius * 0.52 * envelope;
      const turbulence = (
        Math.sin(along * 39 + time * 2.1 + index * 0.77) * 0.28
        + Math.cos(along * 21 - time * 1.37 + index) * 0.14
      ) * baseRadius;
      const x = origin.x + dx * along + normal.x * (serpentine + turbulence);
      const y = origin.y + dy * along + normal.y * (serpentine + turbulence);
      const radius = baseRadius * (1 - along * 0.36)
        * (0.7 + Math.sin(index * 2.73 - time * 1.6) ** 2 * 0.3);
      const core = index % 4 === 0 ? gold : magenta;
      const gradient = context.createRadialGradient(x,y,0,x,y,radius);
      gradient.addColorStop(0,`rgba(${core[0]},${core[1]},${core[2]},${0.28*level})`);
      gradient.addColorStop(0.34,`rgba(${magenta[0]},${magenta[1]},${magenta[2]},${0.2*level})`);
      gradient.addColorStop(0.72,`rgba(${accent[0]},${accent[1]},${accent[2]},${0.13*level})`);
      gradient.addColorStop(1,`rgba(${accent[0]},${accent[1]},${accent[2]},0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x,y,radius,0,Math.PI*2);
      context.fill();
    }

    if (this.flame.birthProgress >= 0) {
      const along = this.flame.birthProgress;
      const envelope = Math.sin(along * Math.PI);
      const bend = Math.sin(along * Math.PI * 2 + 0.62) * baseRadius * 0.52 * envelope;
      const x = origin.x + dx * along + normal.x * bend;
      const y = origin.y + dy * along + normal.y * bend;
      const radius = baseRadius * (0.54 + envelope * 0.34);
      const gradient = context.createRadialGradient(x,y,0,x,y,radius);
      gradient.addColorStop(0,`rgba(${gold[0]},${gold[1]},${gold[2]},.72)`);
      gradient.addColorStop(0.34,`rgba(${magenta[0]},${magenta[1]},${magenta[2]},.42)`);
      gradient.addColorStop(1,`rgba(${accent[0]},${accent[1]},${accent[2]},0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x,y,radius,0,Math.PI*2);
      context.fill();
    }
    context.restore();
  }

  drawCanvas(timestamp) {
    const context = this.context;
    if (!context) return;
    const ratio = this.renderRatio || 1;
    const time = this.elapsed * (reducedMotion() ? 0.22 : 1);
    context.setTransform(ratio,0,0,ratio,0,0);
    context.globalCompositeOperation = 'source-over';
    context.clearRect(0,0,this.width,this.height);
    context.globalCompositeOperation = 'screen';
    const clouds = constrained() ? 4 : 6;
    for (let index=0; index<clouds; index+=1) {
      const phase = index * 1.71 + this.profile.seed * 8.3;
      const depth = 0.22 + index / Math.max(1, clouds - 1) * 0.48;
      const source = this.warpCanvasPoint({
        x:this.width * (0.5 + Math.sin(phase + time * 0.035 * this.profile.drift) * (0.34 + index % 2 * 0.09) - this.camera.x * depth),
        y:this.height * (0.5 + Math.cos(phase * 0.74 - time * 0.029 * this.profile.drift) * 0.43 - this.camera.y * depth - this.scroll * 0.025 * depth)
      }, 1.2-depth*0.34);
      const x = source.x;
      const y = source.y;
      const breathing = 0.985+Math.sin(time*0.09+phase)*0.015+this.touch.energy*0.035;
      const radius = Math.max(this.width,this.height) * (0.22 + (index % 3) * 0.055) * breathing;
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
    this.drawCanvasConstellations(context, time);

    const orbX = this.orbPoint.x * this.width;
    const orbY = this.orbPoint.y * this.height;
    const orbRadius = Math.min(this.width * 0.34, this.height * 0.20);
    const orbColor = this.palette.accent.map(value => Math.round(value * 255));
    const orbAura = context.createRadialGradient(orbX,orbY,0,orbX,orbY,orbRadius);
    orbAura.addColorStop(0,`rgba(${orbColor[0]},${orbColor[1]},${orbColor[2]},${0.025+this.orbEnergy*0.035})`);
    orbAura.addColorStop(0.48,`rgba(${orbColor[0]},${orbColor[1]},${orbColor[2]},${0.012+this.orbEnergy*0.012})`);
    orbAura.addColorStop(1,`rgba(${orbColor[0]},${orbColor[1]},${orbColor[2]},0)`);
    context.fillStyle = orbAura;
    context.fillRect(orbX-orbRadius,orbY-orbRadius,orbRadius*2,orbRadius*2);

    for (const star of this.fallbackStars) {
      const driftX = Math.sin(time * 0.035 * star.depth + star.phase) * 5 * star.depth;
      const driftY = Math.cos(time * 0.028 * star.depth + star.phase) * 4 * star.depth;
      const normalizedX = ((star.x - this.camera.x * star.depth * 0.68) % 1 + 1) % 1;
      const normalizedY = ((star.y - this.camera.y * star.depth * 0.52 - this.scroll * star.depth * 0.045) % 1 + 1) % 1;
      const x = normalizedX * this.width + driftX;
      const y = normalizedY * this.height + driftY;
      const size = star.size;
      const color = star.spectrum === 'gold'
        ? this.palette.gold
        : star.spectrum === 'light'
          ? this.palette.light
          : this.palette.accent;
      context.globalAlpha = star.luminance * 0.72 * this.profile.density;
      context.fillStyle = `rgb(${Math.round(color[0]*255)} ${Math.round(color[1]*255)} ${Math.round(color[2]*255)})`;
      if (size > 1.15) {
        context.beginPath();
        context.arc(x,y,size*0.54,0,Math.PI*2);
        context.fill();
      } else {
        context.fillRect(x-size/2,y-size/2,size,size);
      }
      if (star.size > 2) {
        context.fillRect(x-0.45,y-size*3,0.9,size*6);
        context.fillRect(x-size*3,y-0.45,size*6,0.9);
      }
    }
    context.globalAlpha = 1;
    this.drawCanvasFlame(context, time);
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  adapt(delta) {
    const interval = 1000 / Math.max(20, this.targetFps);
    this.frameTimeEma += (delta - this.frameTimeEma) * 0.055;
    if (reducedMotion() || constrained() || this.requestedFps <= 40) return;

    if (delta > interval * 1.52 || this.frameTimeEma > interval * 1.32) {
      this.slowFrames += 1;
      this.calmFrames = Math.max(0, this.calmFrames - 3);
    } else {
      this.slowFrames = Math.max(0, this.slowFrames - 1);
      if (delta < interval * 1.18 && this.frameTimeEma < interval * 1.14) this.calmFrames += 1;
    }

    if (this.slowFrames >= 36 && !this.degraded) {
      this.slowFrames = 0;
      this.calmFrames = 0;
      this.degraded = true;
      this.targetFps = Math.max(45, this.requestedFps - 15);
      this.frameCadence = 'calm-45';
      this.root.dataset.adaptiveQuality = 'stable-retina-calm-cadence';
      return;
    }

    if (this.degraded && this.calmFrames >= Math.round(this.targetFps * 8)) {
      this.calmFrames = 0;
      this.targetFps = this.requestedFps;
      this.degraded = false;
      this.frameCadence = 'full';
      this.root.dataset.adaptiveQuality = 'stable-retina-recovered';
    }
  }

  frame(timestamp) {
    if (this.destroyed || !this.visible) return;
    const interval = 1000 / this.targetFps;
    if (timestamp - this.lastDraw >= interval - 0.5) {
      const delta = this.lastFrame ? Math.min(80, timestamp - this.lastFrame) : interval;
      this.lastFrame = timestamp;
      this.lastDraw = timestamp;
      this.elapsed += Math.min(delta, 42) / 1000;
      for (const key of ['seed','density','warmth','drift','depth']) {
        this.profile[key] += (this.profileTarget[key] - this.profile[key]) * Math.min(1, delta * 0.0016);
      }
      const pointerEase = Math.min(1, delta * 0.0068);
      const cameraEase = Math.min(1, delta * 0.0028);
      this.pointer.x += (this.pointerTarget.x - this.pointer.x) * pointerEase;
      this.pointer.y += (this.pointerTarget.y - this.pointer.y) * pointerEase;
      if (this.touch.active) this.touch.target = Math.max(this.touch.target, 1.08);
      else if (timestamp - this.touch.lastMoveAt > 110) {
        this.touch.target += (0.08 - this.touch.target) * Math.min(1, delta * 0.0025);
      }
      const touchEase = Math.min(1, delta * 0.0105);
      this.touch.energy += (this.touch.target - this.touch.energy) * touchEase;
      this.touch.velocity.x += (this.touch.velocityTarget.x - this.touch.velocity.x) * touchEase;
      this.touch.velocity.y += (this.touch.velocityTarget.y - this.touch.velocity.y) * touchEase;
      const velocityDecay = Math.pow(0.80, delta / 16.667);
      this.touch.velocityTarget.x *= velocityDecay;
      this.touch.velocityTarget.y *= velocityDecay;
      this.camera.x += (this.cameraTarget.x - this.camera.x) * cameraEase;
      this.camera.y += (this.cameraTarget.y - this.camera.y) * cameraEase;
      this.scroll += (this.scrollTarget - this.scroll) * Math.min(1, delta * 0.0022);
      this.energy += (0.18 - this.energy) * Math.min(1, delta * 0.0028);
      this.orbEnergy += (0.12 - this.orbEnergy) * Math.min(1, delta * 0.0019);
      this.cosmos.mix += (this.cosmos.target - this.cosmos.mix) * Math.min(1, delta * 0.0048);
      this.updatePalette(delta);
      this.updateOrbGeometry();
      this.updateFlame(delta, timestamp);
      if (this.mode === 'webgl-procedural') this.drawWebGL(timestamp);
      else this.drawCanvas(timestamp);
      this.lastSuccessfulDraw = timestamp;
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
    this.pointerTarget = { x:clamp(x,0,1), y:clamp(y,0,1) };
    this.pointer = { ...this.pointerTarget };
    this.cameraTarget = {
      x:(this.pointerTarget.x - 0.5) * 0.085,
      y:(this.pointerTarget.y - 0.5) * 0.055
    };
    this.energy = Math.max(this.energy, clamp(strength,0.2,1.6));
    this.touch.target = Math.max(this.touch.target, clamp(strength,0.35,1.2));
    this.touch.lastMoveAt = performance.now();
    this.orbEnergy = Math.max(this.orbEnergy, clamp(strength * 0.72, 0.2, 1.2));
    this.start();
  }

  status() {
    return Object.freeze({
      version:VERSION,
      renderer:this.mode,
      route:this.route,
      staticUniverseImage:false,
      retinaTextureBackedProceduralWorld:true,
      retinaTextureSource:this.cosmos.source,
      retinaTextureReady:this.cosmos.ready,
      retinaTextureMix:this.cosmos.mix,
      retinaTextureSize:this.cosmos.image?.naturalWidth
        ? { width:this.cosmos.image.naturalWidth, height:this.cosmos.image.naturalHeight }
        : null,
      globalAcrossRoutes:true,
      oneUniverseCanvas:document.querySelectorAll('#divinaLivingUniverseV524 canvas').length === 1,
      targetFps:this.targetFps,
      adaptiveScale:this.scale,
      qualityCeiling:this.qualityCeiling,
      qualityProfile:this.qualityProfile,
      retinaSupersampling:true,
      renderDensity:this.renderRatio,
      renderPixels:this.renderPixels,
      backingSize:{ width:this.canvas.width, height:this.canvas.height },
      stableRetinaSession:true,
      resolutionLocked:this.resolutionLocked,
      resizeCount:this.resizeCount,
      adaptivePixelBudget:false,
      adaptiveFrameCadence:true,
      frameCadence:this.frameCadence,
      spectralStarHalos:true,
      calmStarField:true,
      synchronizedBlinking:false,
      organicCloudFlow:true,
      travelingCloudBreath:true,
      cosmicDustFilaments:true,
      proceduralGalaxyCount:4,
      adaptiveRecovery:true,
      depthLayers:3,
      livingCloudTouchField:true,
      touchWake:true,
      touchEnergy:this.touch.energy,
      touchVelocityFlow:true,
      tactileCloudDisplacement:true,
      wanderingCloudField:true,
      fluidConstellations:2,
      constellationSegments:11,
      constellationTouchRefraction:true,
      parallaxCamera:true,
      scrollParallax:true,
      orbGravityField:true,
      clockPausesWhenHidden:true,
      skinReactive:true,
      selectiveSkinPigment:true,
      paletteTransition:'continuous-425ms-response',
      physicalOrbTouchMotion:false,
      trueCelestialFire:true,
      celestialFireActive:this.flame.level > 0.01,
      fireInsideUniverseCanvas:true,
      lightningStrokes:false,
      whiteOverexposure:false,
      firePalette:'violet-magenta-gold',
      birthProgress:this.flame.birthProgress,
      contextFallback:true,
      continuousAnimationLoops:1,
      paused:!this.raf
    });
  }

  destroy() {
    this.destroyed = true;
    this.pause();
    clearTimeout(this.resizeTimer);
    this.observer?.disconnect();
    removeEventListener('resize', this.onResize);
    removeEventListener('scroll', this.onViewportShift, true);
    globalThis.visualViewport?.removeEventListener('resize', this.onResize);
    globalThis.visualViewport?.removeEventListener('scroll', this.onViewportShift);
    removeEventListener('pointermove', this.onPointerMove);
    removeEventListener('pointerdown', this.onPointerDown);
    removeEventListener('pointerup', this.onPointerUp);
    removeEventListener('pointercancel', this.onPointerUp);
    document.removeEventListener('visibilitychange', this.onVisibility);
    ['divina:skin-change','divina:skin-applied','skin:changed','orbe:skin-change']
      .forEach(type => document.removeEventListener(type, this.onSkinChange));
    document.removeEventListener('divina:route-ready', this.onRouteEvent);
    document.removeEventListener('divina:page-ready', this.onRouteEvent);
    document.removeEventListener('divina:supreme-orb-pulse', this.onOrbPulse);
    document.removeEventListener('divina:supreme-orb-will-navigate', this.onOrbJourney);
    document.removeEventListener('divina:supreme-orb-did-navigate', this.onOrbJourney);
    document.removeEventListener('divina:supreme-orb-navigation-error', this.onOrbJourneyError);
    document.removeEventListener('divina:supreme-orb-recovered', this.onOrbJourneyError);
    document.removeEventListener('divina:menu-state', this.onOrbJourney);
    document.removeEventListener('divina:orbital-menu-ready', this.onOrbJourney);
    removeEventListener('hashchange', this.onRouteEvent);
    this.contextEventCanvas?.removeEventListener('webglcontextlost', this.onContextLost);
    this.portalObserver?.disconnect();
    if (this.gl) {
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.cosmos.texture) this.gl.deleteTexture(this.cosmos.texture);
    }
    this.root.remove();
    document.body.classList.remove('db524-universe-active');
    delete document.documentElement.dataset.livingUniverse;
    if (globalThis.divinaLivingUniverseV524 === this) delete globalThis.divinaLivingUniverseV524;
    if (globalThis.divinaLivingUniverseV523 === this) delete globalThis.divinaLivingUniverseV523;
    if (globalThis.divinaLivingUniverseV522 === this) delete globalThis.divinaLivingUniverseV522;
    if (globalThis.divinaLivingUniverseV521 === this) delete globalThis.divinaLivingUniverseV521;
    if (globalThis.divinaLivingUniverseV520 === this) delete globalThis.divinaLivingUniverseV520;
    if (globalThis.divinaLivingUniverseV519 === this) delete globalThis.divinaLivingUniverseV519;
    if (globalThis.divinaLivingUniverseV516 === this) delete globalThis.divinaLivingUniverseV516;
  }
}

export function createLivingUniverseV524() {
  if (globalThis.divinaLivingUniverseV524?.status) return globalThis.divinaLivingUniverseV524;
  const former = globalThis.divinaLivingUniverseV523 || globalThis.divinaLivingUniverseV522 || globalThis.divinaLivingUniverseV521 || globalThis.divinaLivingUniverseV520 || globalThis.divinaLivingUniverseV519 || globalThis.divinaLivingUniverseV516;
  try { former?.destroy?.(); } catch {}
  document.getElementById('divinaLivingUniverseV523')?.remove();
  document.getElementById('divinaLivingUniverseV523Styles')?.remove();
  document.getElementById('divinaLivingUniverseV522')?.remove();
  document.getElementById('divinaLivingUniverseV522Styles')?.remove();
  document.getElementById('divinaLivingUniverseV521')?.remove();
  document.getElementById('divinaLivingUniverseV521Styles')?.remove();
  document.getElementById('divinaLivingUniverseV520')?.remove();
  document.getElementById('divinaLivingUniverseV520Styles')?.remove();
  document.getElementById('divinaLivingUniverseV519')?.remove();
  document.getElementById('divinaLivingUniverseV519Styles')?.remove();
  document.getElementById('divinaLivingUniverseV516')?.remove();
  document.getElementById('divinaLivingUniverseV516Styles')?.remove();
  document.getElementById(ROOT_ID)?.remove();
  document.body?.classList.remove('db516-universe-active','db519-universe-active','db520-universe-active','db521-universe-active','db522-universe-active','db523-universe-active');
  const universe = new LivingUniverseCoreV524();
  globalThis.divinaLivingUniverseV524 = universe;
  // Pontes mantêm Tarot V517, Menu V502 e Acabamento V518 no mesmo céu vivo.
  globalThis.divinaLivingUniverseV523 = universe;
  globalThis.divinaLivingUniverseV522 = universe;
  globalThis.divinaLivingUniverseV521 = universe;
  globalThis.divinaLivingUniverseV520 = universe;
  globalThis.divinaLivingUniverseV519 = universe;
  globalThis.divinaLivingUniverseV516 = universe;
  return universe;
}

export { LivingUniverseCoreV524 };
