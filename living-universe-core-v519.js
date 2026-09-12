/* DIVINA BRUXA — UNIVERSO VIVO · MACROETAPA 1/4 · MOTOR CELESTIAL V519
   Um único céu procedural respira atrás de todas as realidades. Estrelas em
   profundidade, nebulosas, galáxias, gravidade da Orbe e a Chama Celestial
   compartilham o mesmo canvas — sem fotografia, raio ou motor duplicado. */

const VERSION = 519;
const STYLE_ID = 'divinaLivingUniverseV519Styles';
const ROOT_ID = 'divinaLivingUniverseV519';
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
  link.href = './living-universe-core-v519.css?v=519';
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

class LivingUniverseCoreV519 {
  constructor() {
    installStyle();
    this.route = routeNow();
    this.profile = { ...(ROUTE_PROFILES[this.route] || ROUTE_PROFILES.home) };
    this.profileTarget = { ...this.profile };
    this.width = 1;
    this.height = 1;
    const visualQuality = document.documentElement.dataset.visualQuality || 'balanced';
    this.scale = constrained() || visualQuality === 'protected'
      ? 0.54
      : visualQuality === 'cinematic'
        ? (innerWidth < 700 ? 0.72 : 0.80)
        : (innerWidth < 700 ? 0.66 : 0.74);
    this.qualityCeiling = this.scale;
    this.qualityProfile = visualQuality;
    this.pixelRatio = 1;
    this.targetFps = reducedMotion() ? 24 : (constrained() ? 40 : 60);
    this.lastFrame = 0;
    this.lastDraw = 0;
    this.slowFrames = 0;
    this.calmFrames = 0;
    this.frameTimeEma = 16.7;
    this.degraded = false;
    this.energy = 0.18;
    this.pointer = { x:0.5, y:0.45 };
    this.pointerTarget = { ...this.pointer };
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
    this.palette = {
      accent:[0.67, 0.22, 0.94],
      light:[1, 0.72, 0.43],
      gold:[1, 0.84, 0.5]
    };

    this.root = document.createElement('div');
    this.root.id = ROOT_ID;
    this.root.className = 'db519-universe';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.innerHTML = '<canvas data-living-universe-canvas></canvas><span class="db519-universe__veil"></span>';
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
    document.documentElement.dataset.livingUniverse = 'v519';
    document.body.classList.remove('db516-universe-active');
    document.body.classList.add('db519-universe-active');

    this.fallbackStars = this.createFallbackStars();
    this.syncPalette(true);
    this.initializeRenderer();
    this.resize();
    this.bind();
    this.start();

    const readiness = Object.freeze({
      version:VERSION,
      engine:'LivingUniverseCoreV519',
      renderer:this.mode,
      staticUniverseImage:false,
      globalAcrossRoutes:true,
      oneUniverseCanvas:true,
      proceduralStars:true,
      proceduralNebulae:true,
      proceduralGalaxies:true,
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
    return Array.from({ length:protectedQuality ? 110 : 220 }, (_, index) => ({
      x:pseudo(index * 2.71 + 1.2),
      y:pseudo(index * 5.13 + 8.7),
      depth:0.32 + pseudo(index * 7.17 + 2.1) * 0.68,
      size:index % 23 === 0 ? 2.4 : 0.45 + pseudo(index * 1.83 + 9.2) * 1.15,
      phase:pseudo(index * 9.31 + 4.8) * Math.PI * 2,
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
        uniform float u_depth;
        uniform float u_motion;
        uniform vec2 u_camera;
        uniform float u_scroll;
        uniform vec2 u_orb;
        uniform float u_orb_energy;
        uniform vec3 u_accent;
        uniform vec3 u_light;
        uniform vec3 u_gold;
        uniform vec2 u_flame_from;
        uniform vec2 u_flame_to;
        uniform float u_flame_level;
        uniform float u_flame_birth;
        uniform float u_flame_progress;

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
          float breathing=0.96+0.04*sin(time*0.11+phase*2.0);
          float spiral=0.5+0.5*cos(angle*2.0+radius*10.6-phase-time*0.042);
          float arm=pow(max(spiral,0.0),7.4);
          float counter=pow(max(0.5+0.5*cos(angle*2.0+radius*10.6-phase-time*0.042+3.14159),0.0),8.2);
          float disk=exp(-radius*2.64)*breathing;
          float core=exp(-radius*radius*19.0);
          float dust=0.52+0.48*noise2(d*17.0+phase+time*0.004);
          float lane=0.68+0.32*smoothstep(0.30,0.72,noise2(d*28.0-phase));
          return (disk*(0.10+(arm+counter*0.68)*0.86)*dust*lane+core*1.12)
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
          float breath=0.94+0.06*sin(time*0.17+u_seed*6.283185);
          vec2 camera=vec2(u_camera.x*aspect,u_camera.y);
          vec2 orb=vec2((u_orb.x-0.5)*aspect,u_orb.y-0.5);
          vec2 fromOrb=base-orb;
          float orbDistance=length(fromOrb);
          vec2 gravity=(fromOrb/(orbDistance+0.08))*exp(-orbDistance*5.1)
            *(0.004+u_orb_energy*0.009);
          vec2 p=base-camera*0.052-vec2(0.0,u_scroll*0.026)+gravity;
          vec2 slow=vec2(time*0.0062*u_drift,-time*0.0040*u_drift);

          vec2 warp=vec2(
            fbm(p*1.58+slow+u_seed*9.1),
            fbm(p*1.54-slow+vec2(4.8,1.7)+u_seed*5.3)
          );
          float cloud=fbm(p*2.08+warp*2.16+slow*0.7);
          float detail=fbm(p*5.05-warp*1.12-slow*1.35);
          float ridge=1.0-abs(cloud*2.0-1.0);
          float edge=smoothstep(0.10,0.72,abs(uv.x-0.5)*2.0);
          float filament=pow(max(ridge,0.0),2.15);
          float nebula=smoothstep(0.46,0.80,cloud*0.70+detail*0.24+filament*0.12+edge*0.10);
          float darkDust=smoothstep(0.63,0.86,(1.0-detail)*0.62+cloud*0.38);
          nebula*=mix(0.50,1.18,edge)*u_density*(1.0-darkDust*0.28)*breath;
          float hotDust=smoothstep(0.60,0.88,detail*0.54+filament*0.46+edge*0.07);

          vec3 color=vec3(0.0018,0.0005,0.0048);
          color+=u_accent*nebula*(0.23+filament*0.52);
          color+=mix(u_accent,u_light,0.42)*hotDust*nebula*(0.17+u_warmth*0.23);
          color+=u_gold*pow(hotDust,3.15)*0.27*u_warmth;
          color-=vec3(0.0014,0.0005,0.0020)*darkDust;

          vec2 farPlane=base-camera*0.018-vec2(0.0,u_scroll*0.010)+slow*0.05;
          vec2 midPlane=base-camera*0.055-vec2(0.0,u_scroll*0.026)+slow*0.10;
          vec2 nearPlane=base-camera*0.105-vec2(0.0,u_scroll*0.052)+slow*0.17+gravity*1.8;
          float g1=galaxy(farPlane,vec2(-aspect*0.43,-0.30),3.10,0.4+u_seed,time);
          float g2=galaxy(midPlane,vec2(aspect*0.43,0.20),3.48,2.2-u_seed,time);
          float g3=galaxy(farPlane,vec2(-aspect*0.38,0.37),4.72,4.1+u_seed,time);
          color+=mix(u_accent,u_gold,0.38)*g1*0.72*u_depth;
          color+=mix(u_accent,u_light,0.28)*g2*0.60*u_depth;
          color+=mix(u_accent,u_gold,0.56)*g3*0.32*u_depth;

          float giantFar=0.0;
          float giantMid=0.0;
          float giantNear=0.0;
          float starsFar=starLayer(farPlane,92.0,u_seed*137.0+31.0,time*0.62,giantFar);
          float starsMid=starLayer(midPlane,56.0,u_seed*83.0,time,giantMid);
          float starsNear=starLayer(nearPlane,31.0,u_seed*127.0+17.0,time*1.31,giantNear);
          vec3 farColor=mix(vec3(0.52,0.66,1.0),u_light,0.18);
          vec3 midColor=mix(vec3(0.86,0.64,1.0),u_gold,0.32+u_warmth*0.22);
          vec3 nearColor=mix(u_light,u_gold,0.46);
          color+=farColor*starsFar*0.34*u_density*u_depth;
          color+=midColor*starsMid*(0.58+u_density*0.30)*u_depth;
          color+=nearColor*starsNear*0.72*u_density*u_depth;

          float orbAura=exp(-orbDistance*5.4)*(0.025+u_orb_energy*0.055);
          float livingPulse=0.72+0.28*sin(time*0.72+orbDistance*18.0);
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
        depth:this.gl.getUniformLocation(program, 'u_depth'),
        motion:this.gl.getUniformLocation(program, 'u_motion'),
        camera:this.gl.getUniformLocation(program, 'u_camera'),
        scroll:this.gl.getUniformLocation(program, 'u_scroll'),
        orb:this.gl.getUniformLocation(program, 'u_orb'),
        orbEnergy:this.gl.getUniformLocation(program, 'u_orb_energy'),
        accent:this.gl.getUniformLocation(program, 'u_accent'),
        light:this.gl.getUniformLocation(program, 'u_light'),
        gold:this.gl.getUniformLocation(program, 'u_gold'),
        flameFrom:this.gl.getUniformLocation(program, 'u_flame_from'),
        flameTo:this.gl.getUniformLocation(program, 'u_flame_to'),
        flameLevel:this.gl.getUniformLocation(program, 'u_flame_level'),
        flameBirth:this.gl.getUniformLocation(program, 'u_flame_birth'),
        flameProgress:this.gl.getUniformLocation(program, 'u_flame_progress')
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
      Object.assign(replacement.style, {
        position:'absolute', inset:'0', display:'block', width:'100%', height:'100%'
      });
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
    this.resizeFrame = 0;
    this.onResize = () => {
      this.flame.geometryDirty = true;
      this.orbGeometryDirty = true;
      if (this.resizeFrame) return;
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = 0;
        this.resize();
      });
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
      this.pointerTarget = {
        x:clamp(event.clientX / Math.max(innerWidth, 1), 0, 1),
        y:clamp(event.clientY / Math.max(innerHeight, 1), 0, 1)
      };
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
      this.cameraTarget = {
        x:(this.pointerTarget.x - 0.5) * 0.085,
        y:(this.pointerTarget.y - 0.5) * 0.055
      };
      this.energy = Math.max(this.energy, 1);
      this.orbEnergy = Math.max(this.orbEnergy, 0.72);
    };
    addEventListener('pointermove', this.onPointerMove, { passive:true });
    addEventListener('pointerdown', this.onPointerDown, { passive:true });
    this.onSkinChange = () => this.syncPalette(true);
    ['divina:skin-change','divina:skin-applied','skin:changed','orbe:skin-change']
      .forEach(type => document.addEventListener(type, this.onSkinChange));
    this.onRouteEvent = event => this.setRoute(event.detail?.id || routeNow());
    document.addEventListener('divina:route-ready', this.onRouteEvent);
    document.addEventListener('divina:page-ready', this.onRouteEvent);
    addEventListener('hashchange', this.onRouteEvent, { passive:true });
    this.onOrbPulse = event => {
      const detail = event.detail || {};
      this.orbEnergy = Math.max(this.orbEnergy, clamp(Number(detail.intensity) || 0.7, 0.2, 1.4));
      if (Number.isFinite(detail.x) && Number.isFinite(detail.y)) {
        const orb = document.querySelector('[data-supreme-orb="living"], #orb');
        const rect = orb?.getBoundingClientRect?.();
        this.pointerTarget = rect?.width && rect?.height
          ? {
              x:clamp((rect.left + detail.x * rect.width) / Math.max(innerWidth, 1), 0, 1),
              y:clamp((rect.top + detail.y * rect.height) / Math.max(innerHeight, 1), 0, 1)
            }
          : { x:clamp(detail.x,0,1), y:clamp(detail.y,0,1) };
      }
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
      this.resize();
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
    const nextScale = clamp(Number(scale) || this.qualityCeiling, 0.50, 0.84);
    this.targetFps = reducedMotion() ? Math.min(24, nextFps) : nextFps;
    this.qualityCeiling = nextScale;
    this.qualityProfile = String(profile || this.qualityProfile || 'balanced');
    if (!this.degraded || this.scale > nextScale || Math.abs(this.scale - nextScale) < 0.02) {
      this.scale = nextScale;
      this.resize();
    }
    this.root.dataset.performanceBudget = this.qualityProfile;
    return Object.freeze({ fps:this.targetFps, scale:this.scale, ceiling:this.qualityCeiling });
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
    context.fillStyle = '#010005';
    context.fillRect(0,0,this.width,this.height);
    context.globalCompositeOperation = 'screen';
    const clouds = constrained() ? 4 : 6;
    for (let index=0; index<clouds; index+=1) {
      const phase = index * 1.71 + this.profile.seed * 8.3;
      const depth = 0.22 + index / Math.max(1, clouds - 1) * 0.48;
      const x = this.width * (0.5 + Math.sin(phase + time * 0.018 * this.profile.drift) * (0.34 + index % 2 * 0.09) - this.camera.x * depth);
      const y = this.height * (0.5 + Math.cos(phase * 0.74 - time * 0.014 * this.profile.drift) * 0.43 - this.camera.y * depth - this.scroll * 0.025 * depth);
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
      const pulse = 0.22 + Math.sin(time * (0.65 + star.depth) + star.phase) ** 2 * 0.78;
      const size = star.size * (0.58 + pulse * 0.48);
      const color = star.spectrum === 'gold'
        ? this.palette.gold
        : star.spectrum === 'light'
          ? this.palette.light
          : this.palette.accent;
      context.globalAlpha = (0.34 + pulse * 0.62) * this.profile.density;
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
    if (reducedMotion() || constrained()) return;

    if (delta > interval * 1.52 || this.frameTimeEma > interval * 1.32) {
      this.slowFrames += 1;
      this.calmFrames = Math.max(0, this.calmFrames - 3);
    } else {
      this.slowFrames = Math.max(0, this.slowFrames - 1);
      if (delta < interval * 1.18 && this.frameTimeEma < interval * 1.14) this.calmFrames += 1;
    }

    if (this.slowFrames >= 42 && this.scale > 0.50) {
      this.slowFrames = 0;
      this.calmFrames = 0;
      this.degraded = true;
      this.scale = Math.max(0.50, this.scale - 0.055);
      this.resize();
      this.root.dataset.adaptiveQuality = 'protected';
      return;
    }

    if (this.degraded && this.calmFrames >= Math.round(this.targetFps * 10)) {
      this.calmFrames = 0;
      this.scale = Math.min(this.qualityCeiling, this.scale + 0.035);
      this.resize();
      if (this.scale >= this.qualityCeiling - 0.01) {
        this.scale = this.qualityCeiling;
        this.degraded = false;
        this.root.dataset.adaptiveQuality = 'recovered';
      } else {
        this.root.dataset.adaptiveQuality = 'recovering';
      }
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
      this.camera.x += (this.cameraTarget.x - this.camera.x) * cameraEase;
      this.camera.y += (this.cameraTarget.y - this.camera.y) * cameraEase;
      this.scroll += (this.scrollTarget - this.scroll) * Math.min(1, delta * 0.0022);
      this.energy += (0.18 - this.energy) * Math.min(1, delta * 0.0028);
      this.orbEnergy += (0.12 - this.orbEnergy) * Math.min(1, delta * 0.0019);
      this.updateOrbGeometry();
      this.updateFlame(delta, timestamp);
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
    this.pointerTarget = { x:clamp(x,0,1), y:clamp(y,0,1) };
    this.pointer = { ...this.pointerTarget };
    this.cameraTarget = {
      x:(this.pointerTarget.x - 0.5) * 0.085,
      y:(this.pointerTarget.y - 0.5) * 0.055
    };
    this.energy = Math.max(this.energy, clamp(strength,0.2,1.6));
    this.orbEnergy = Math.max(this.orbEnergy, clamp(strength * 0.72, 0.2, 1.2));
    this.start();
  }

  status() {
    return Object.freeze({
      version:VERSION,
      renderer:this.mode,
      route:this.route,
      staticUniverseImage:false,
      globalAcrossRoutes:true,
      oneUniverseCanvas:document.querySelectorAll('#divinaLivingUniverseV519 canvas').length === 1,
      targetFps:this.targetFps,
      adaptiveScale:this.scale,
      qualityCeiling:this.qualityCeiling,
      qualityProfile:this.qualityProfile,
      adaptiveRecovery:true,
      depthLayers:3,
      parallaxCamera:true,
      scrollParallax:true,
      orbGravityField:true,
      clockPausesWhenHidden:true,
      skinReactive:true,
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
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
    this.observer?.disconnect();
    removeEventListener('resize', this.onResize);
    removeEventListener('scroll', this.onViewportShift, true);
    globalThis.visualViewport?.removeEventListener('resize', this.onResize);
    globalThis.visualViewport?.removeEventListener('scroll', this.onViewportShift);
    removeEventListener('pointermove', this.onPointerMove);
    removeEventListener('pointerdown', this.onPointerDown);
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
    }
    this.root.remove();
    document.body.classList.remove('db519-universe-active');
    delete document.documentElement.dataset.livingUniverse;
    if (globalThis.divinaLivingUniverseV519 === this) delete globalThis.divinaLivingUniverseV519;
    if (globalThis.divinaLivingUniverseV516 === this) delete globalThis.divinaLivingUniverseV516;
  }
}

export function createLivingUniverseV519() {
  if (globalThis.divinaLivingUniverseV519?.status) return globalThis.divinaLivingUniverseV519;
  const former = globalThis.divinaLivingUniverseV516;
  try { former?.destroy?.(); } catch {}
  document.getElementById('divinaLivingUniverseV516')?.remove();
  document.getElementById('divinaLivingUniverseV516Styles')?.remove();
  document.getElementById(ROOT_ID)?.remove();
  document.body?.classList.remove('db516-universe-active');
  const universe = new LivingUniverseCoreV519();
  globalThis.divinaLivingUniverseV519 = universe;
  // Ponte de compatibilidade para Tarot V517, Menu V502 e Acabamento V518.
  globalThis.divinaLivingUniverseV516 = universe;
  return universe;
}

export { LivingUniverseCoreV519 };
