// DIVINA BRUXA V58 — LIVING TOUCH FINAL CANDIDATE
// Orbe pura: RESPIRA → DESPERTA → CANALIZA → SOBRECARGA → LIBERA → RESSONA.
// Efeitos fortes acontecem DENTRO da esfera, com orçamento adaptativo para iPhone/Safari.
export class LivingOrb {
  constructor(canvas,{onOpen}={}){
    this.canvas=canvas; this.shell=canvas?.closest('.orb-shell'); this.onOpen=onOpen;
    this.gl=null; this.program=null; this.tex=null; this.lost=false; this.ready=false;
    this.down=false; this.moved=false; this.lastTap=0; this.holdStart=0; this.phase=0;
    this.status=document.querySelector('#orbStatus');this.opening=false;this.tapChain=0;this.lastRhythmTap=0;
    this.angularTravel=0;this.previousAngle=0;this.resonance=0;this.flow=0;this.holdTimer=0;this.overloadTimer=0;this.deepTimer=0;
    this.pressure=0;this.zone=.5;this.echo=0;this.flick=0;this.lastMoveAt=0;this.lastHaptic=0;this.visible=true;this.destroyed=false;
    this.pointer={x:.5,y:.5,px:.5,py:.5,v:0,spin:0};
    this.renderPointer={x:.5,y:.5,px:.5,py:.5};
    this.start=performance.now(); this.lastFrame=0; this.raf=0; this.boostUntil=0; this.releaseUntil=0; this.tapUntil=0;
    const cores=navigator.hardwareConcurrency||4;const memory=Number(navigator.deviceMemory||4);
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.dpr=Math.min(3,Math.max(1,window.devicePixelRatio||1));
    this.deviceTier=this.reduced||cores<=2||memory<=2?'low':cores<=4||memory<=4?'mid':'high';
    this.maxPx=this.deviceTier==='low'?768:this.deviceTier==='mid'?1152:1536;
    this.minPx=this.deviceTier==='low'?300:360;
    this.renderScale=this.reduced?.72:this.deviceTier==='low'?.72:this.deviceTier==='mid'?.84:.94;
    this.maxTextureSize=2048;this.frameSamples=[]; this.burst=0; this.activePointer=null;
    this.init();
  }
  init(){
    if(!this.canvas||!this.shell)return;
    this.shell.style.touchAction='none'; this.shell.style.webkitUserSelect='none'; this.shell.style.userSelect='none';
    Object.assign(this.canvas.style,{display:'block',position:'absolute',inset:'0',width:'100%',height:'100%',borderRadius:'50%',touchAction:'none'});
    this.canvas.setAttribute('aria-hidden','true');
    this.bind();
    if(!this.setupGL())return;
    this.maxTextureSize=Math.min(4096,Number(this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE)||2048));
    this.resize(); this.loadTexture();
    this.ro=new ResizeObserver(()=>this.resize()); this.ro.observe(this.shell);
    this.onWindowResize=()=>{this.dpr=Math.min(3,Math.max(1,window.devicePixelRatio||1));this.resize()};
    window.addEventListener('resize',this.onWindowResize,{passive:true});
    this.onVisibility=()=>{if(document.hidden)this.stop();else{this.lastFrame=0;this.request()}};document.addEventListener('visibilitychange',this.onVisibility);
    this.io=new IntersectionObserver(entries=>{this.visible=!!entries[0]?.isIntersecting;if(!this.visible)this.stop();else{this.lastFrame=0;this.request()}},{threshold:.01});this.io.observe(this.shell);
    this.request();
  }
  setupGL(){
    const attrs={alpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,premultipliedAlpha:false,powerPreference:'high-performance'};
    const gl=this.canvas.getContext('webgl',attrs)||this.canvas.getContext('experimental-webgl',attrs);
    if(!gl){this.fallback();return false} this.gl=gl;
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.clearColor(0,0,0,0);
    const vs=`attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
    const precision=gl.getShaderPrecisionFormat?.(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);
    const fp=precision&&precision.precision>0?'highp':'mediump';
    const fs=`precision ${fp} float;
      varying vec2 v;uniform sampler2D tex;uniform float t;uniform vec2 p;uniform vec2 pp;uniform float e;uniform float down;uniform float burst;uniform float spin;uniform float phase;uniform float releaseP;uniform float resonance;uniform float flow;uniform float pressure;uniform float zone;uniform float echo;uniform float flick;
      float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 q){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*noise(q);q=q*2.02+vec2(13.7,9.1);a*=.5;}return f;}
      float sdSeg(vec2 q,vec2 a,vec2 b){vec2 pa=q-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),.00001),0.,1.);return length(pa-ba*h);}
      float beam(float x,float k){return exp(-abs(x)*k);}
      void main(){
        vec2 uv=v;vec2 c=uv-.5;float r=length(c);if(r>.5)discard;float edgeAlpha=1.0-smoothstep(.492,.5,r);float ang=atan(c.y,c.x);
        vec2 dp=uv-p;float d=length(dp);float force=.72+pressure*1.45;float touch=exp(-d*d*30.0)*e*force;
        float coreZone=1.0-smoothstep(.20,.68,zone);float edgeZone=smoothstep(.54,.96,zone);
        float breathe=.5+.5*sin(t*1.12);
        float charge=smoothstep(1.55,3.8,phase);
        float motion=clamp(e+burst*.62+charge*.58+resonance*.26,0.,2.15);
        float living=.5+.5*sin(t*.43+fbm(uv*3.2+t*.035)*2.8);

        // A textura continua fotográfica; a magia deforma apenas onde a mão atua.
        float vortex=(.006+.043*motion)*exp(-d*3.8);
        float localAng=atan(dp.y,dp.x)+vortex*sin(t*3.2+d*25.0+spin*3.0);
        vec2 local=vec2(cos(localAng),sin(localAng))*d;
        float wave1=sin(d*46.0-t*(10.0+charge*5.0)+spin*2.0)*exp(-d*5.0)*motion;
        float wave2=sin(d*82.0-t*16.0)*exp(-d*8.0)*motion;
        vec2 warped=uv;
        warped += normalize(dp+vec2(.0001))*(wave1*.0074+wave2*.0032);
        warped += (local-dp)*(.08*motion);
        float orbitalFlow=flow*(.010+.012*resonance)*exp(-r*2.8);
        warped += vec2(-c.y,c.x)*orbitalFlow*(.55+.45*sin(t*2.0+r*19.0));
        float n=(fbm(uv*7.0+vec2(t*.12,-t*.08))-.5)*.010*(.22+motion);
        warped += vec2(n,-n*.72);
        // respiração global muito sutil
        warped=.5+(warped-.5)*(1.0+.004*sin(t*.72)+.003*breathe);
        vec4 col=texture2D(tex,clamp(warped,.002,.998));
        col.rgb*=1.0+.022*breathe+.014*living;

        // AURA / PORTAL no toque
        float aura=exp(-d*d*19.0)*motion;
        col.rgb += vec3(.60,.09,1.0)*aura*.58;
        col.rgb += vec3(1.0,.30,.96)*touch*.62;
        col.rgb += vec3(1.0,.78,.30)*touch*touch*.34;
        float portal=exp(-d*d*76.0)*motion;
        col.rgb += vec3(1.0,.86,1.0)*portal*.74;
        col.rgb += vec3(1.0,.58,.18)*portal*portal*.28;

        // O ponto tocado muda a natureza da magia sem criar nada fora da esfera.
        float nucleusTouch=exp(-d*d*105.0)*coreZone*(.35+pressure)*motion;
        col.rgb += vec3(1.0,.88,1.0)*nucleusTouch*1.18;
        float innerRim=exp(-abs(r-(.445-.012*sin(t*2.3)))*76.0)*edgeZone*motion*(.42+pressure);
        col.rgb += vec3(.88,.25,1.0)*innerRim*.78;
        col.rgb += vec3(1.0,.72,.24)*innerRim*innerRim*.46;

        // Trilhas elétricas que perseguem o dedo.
        float trailD=sdSeg(uv,pp,p);
        float trail=exp(-trailD*62.0)*smoothstep(.42,.0,d)*motion;
        float trailCore=exp(-trailD*145.0)*smoothstep(.46,.0,d)*motion;
        col.rgb += vec3(.80,.22,1.0)*trail*.92;
        col.rgb += vec3(1.0,.82,.38)*trailCore*.76;
        float comet=exp(-trailD*26.0)*smoothstep(.60,.0,d)*motion;
        col.rgb += vec3(.42,.12,1.0)*comet*(.32+flick*.74);
        col.rgb += vec3(1.0,.82,.46)*trailCore*flick*.66;

        // Relâmpagos internos em múltiplas frequências.
        float rnd=noise(vec2(ang*9.0+d*31.0,t*2.4));
        float bolt1=beam(sin(ang*(5.0+floor(rnd*3.0))+d*3.2+t*4.0+rnd*5.0),31.0)*exp(-d*6.6)*motion;
        float bolt2=beam(sin(ang*9.0-d*17.0-t*5.2+rnd*2.0),39.0)*exp(-d*8.0)*motion;
        float bolt3=beam(sin(ang*13.0+d*23.0+t*7.0+rnd*7.0),44.0)*exp(-d*9.2)*motion;
        col.rgb += vec3(.82,.50,1.0)*(bolt1*.96+bolt2*.68+bolt3*.52);
        col.rgb += vec3(1.0,.69,.22)*(bolt1*bolt1*.50+bolt3*bolt3*.28);

        // Filamentos espirais de canalização.
        float neb=fbm(vec2(ang*3.3+d*14.0,t*.75));
        float filament=beam(sin(ang*6.0+d*27.0-t*4.2+neb*5.0),27.0)*exp(-d*5.0)*motion;
        float filament2=beam(sin(ang*9.0-d*34.0+t*5.4-neb*4.0),31.0)*exp(-d*6.4)*motion;
        col.rgb += vec3(.96,.16,1.0)*(filament*(.52+.56*charge)+filament2*.46);
        col.rgb += vec3(1.0,.64,.24)*filament2*filament2*.22;

        // Sobrecarga: coroa de energia ao redor do ponto de toque, DENTRO da orbe.
        float crown=beam(sin(ang*12.0+t*6.0+noise(vec2(ang*7.0,t))*5.0),32.0)*exp(-abs(d-(.12+.03*sin(t*2.0)))*40.0)*charge;
        float crown2=beam(sin(ang*18.0-t*8.0+noise(vec2(ang*11.0,t*1.4))*7.0),38.0)*exp(-abs(d-(.18+.025*cos(t*2.6)))*52.0)*charge;
        col.rgb += vec3(1.0,.30,.98)*(crown*1.12+crown2*.82);
        col.rgb += vec3(1.0,.78,.30)*(crown*crown*.52+crown2*crown2*.36);

        // Pulso de libertação em duas frentes.
        float ring1=exp(-abs(d-(.05+.37*(1.0-releaseP)))*72.0)*releaseP;
        float ring2=exp(-abs(d-(.11+.27*(1.0-releaseP)))*54.0)*releaseP;
        float ring3=exp(-abs(d-(.16+.21*(1.0-releaseP)))*46.0)*releaseP;
        col.rgb += vec3(1.0,.42,.98)*ring1*1.22;
        col.rgb += vec3(.54,.44,1.0)*ring2*.78;
        col.rgb += vec3(1.0,.72,.26)*ring3*.54;
        col.rgb += vec3(1.0,.85,.36)*ring1*ring1*.52;

        // Eco tátil: uma segunda onda interna, mais lenta, nasce depois que o dedo parte.
        float echoFront=.045+.36*(1.0-echo);
        float echoRing=exp(-abs(d-echoFront)*58.0)*echo;
        float echoGlow=exp(-abs(d-(echoFront*.68+.035))*34.0)*echo;
        col.rgb += vec3(.72,.26,1.0)*echoGlow*.42;
        col.rgb += vec3(1.0,.72,.34)*echoRing*.64;

        // Explosão estelar quando desperta/toca.
        float rayA=beam(sin(atan(dp.y,dp.x)*8.0),50.0)*exp(-d*12.0)*(burst*.95+charge*.32);
        float rayB=beam(sin(atan(dp.y,dp.x)*4.0+.785),70.0)*exp(-d*8.6)*(burst*.70+charge*.24);
        float rayC=beam(sin(atan(dp.y,dp.x)*12.0+t*.8),68.0)*exp(-d*13.0)*(burst*.62+charge*.40);
        col.rgb += vec3(1.0,.76,1.0)*(rayA*1.10+rayB*.66+rayC*.54);
        col.rgb += vec3(1.0,.68,.24)*rayC*rayC*.26;

        // Partículas-luz procedurais, concentradas ao redor do gesto.
        vec2 g=floor(uv*28.0);vec2 f=fract(uv*28.0)-.5;float h=hash(g);
        vec2 sp=f-vec2(hash(g+3.1)-.5,hash(g+7.7)-.5)*.55;
        float spark=exp(-dot(sp,sp)*120.0)*step(.88,h)*smoothstep(.52,.03,d)*motion*(.58+.42*sin(t*11.0+h*24.0));
        col.rgb += vec3(1.0,.74,.98)*spark*2.45;
        vec2 g2=floor(uv*43.0);vec2 f2=fract(uv*43.0)-.5;float h2=hash(g2+19.7);
        float dust=exp(-dot(f2,f2)*190.0)*step(.955,h2)*smoothstep(.58,.05,d)*motion;
        col.rgb += vec3(1.0,.52,.94)*dust*1.35;

        // Ressonância: constelações e véus internos aparecem após ritmo, giro ou toque longo.
        float resonanceVeil=beam(sin(ang*7.0+d*38.0-t*3.1+fbm(vec2(ang*4.0,t*.4))*6.0),29.0)*exp(-d*4.7)*resonance;
        float resonanceVeil2=beam(sin(ang*11.0-d*28.0+t*4.4),38.0)*exp(-d*6.2)*resonance;
        col.rgb += vec3(.68,.20,1.0)*resonanceVeil*.82;
        col.rgb += vec3(1.0,.64,.24)*(resonanceVeil*resonanceVeil*.34+resonanceVeil2*.24);
        vec2 rg=floor(uv*36.0);float rh=hash(rg+71.3);vec2 rf=fract(uv*36.0)-.5;
        float constellation=exp(-dot(rf,rf)*175.0)*step(.938,rh)*resonance*(.62+.38*sin(t*7.0+rh*31.0));
        col.rgb += vec3(1.0,.84,1.0)*constellation*1.75;

        // Núcleo da própria Orbe pulsa mais forte conforme a fase.
        float core=exp(-length(uv-vec2(.505,.535))*38.0)*(0.23+.12*breathe+charge*.52+burst*.40);
        col.rgb += vec3(1.0,.80,1.0)*core*.76;
        float coreRay=beam(sin(atan((uv-vec2(.505,.535)).y,(uv-vec2(.505,.535)).x)*8.0+t*.35),72.0)*exp(-length(uv-vec2(.505,.535))*8.0)*(charge*.40+burst*.28);
        col.rgb += vec3(1.0,.64,.94)*coreRay*.30;

        // vidro/fresnel sem linhas externas
        float fres=pow(clamp(r/.5,0.,1.),3.3);
        col.rgb += vec3(.72,.24,.94)*fres*.12;

        // cromatismo só sob energia alta
        if(motion>.42){float ca=.0024*motion;vec2 dir=normalize(c+vec2(.0001));col.r+=texture2D(tex,clamp(warped+dir*ca,.002,.998)).r*.095;col.b+=texture2D(tex,clamp(warped-dir*ca,.002,.998)).b*.082;}
        col.rgb*=edgeAlpha;col.a*=edgeAlpha;gl_FragColor=col;
      }`;
    const compile=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn('Orb shader',gl.getShaderInfoLog(sh));return null}return sh};
    const sv=compile(gl.VERTEX_SHADER,vs),sf=compile(gl.FRAGMENT_SHADER,fs);if(!sv||!sf){this.fallback();return false}
    const pr=gl.createProgram();gl.attachShader(pr,sv);gl.attachShader(pr,sf);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){this.fallback();return false}
    this.program=pr;gl.useProgram(pr);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    this.u={t:gl.getUniformLocation(pr,'t'),p:gl.getUniformLocation(pr,'p'),pp:gl.getUniformLocation(pr,'pp'),e:gl.getUniformLocation(pr,'e'),down:gl.getUniformLocation(pr,'down'),burst:gl.getUniformLocation(pr,'burst'),spin:gl.getUniformLocation(pr,'spin'),phase:gl.getUniformLocation(pr,'phase'),releaseP:gl.getUniformLocation(pr,'releaseP'),resonance:gl.getUniformLocation(pr,'resonance'),flow:gl.getUniformLocation(pr,'flow'),pressure:gl.getUniformLocation(pr,'pressure'),zone:gl.getUniformLocation(pr,'zone'),echo:gl.getUniformLocation(pr,'echo'),flick:gl.getUniformLocation(pr,'flick')};
    gl.uniform1i(gl.getUniformLocation(pr,'tex'),0);
    this.canvas.addEventListener('webglcontextlost',ev=>{ev.preventDefault();this.lost=true;this.stop();this.canvas.style.opacity='0';this.shell.classList.add('webgl-fallback')},{passive:false});
    this.canvas.addEventListener('webglcontextrestored',()=>{this.lost=false;this.canvas.style.display='block';this.canvas.style.opacity='1';this.shell.classList.remove('webgl-fallback');this.setupGL();this.maxTextureSize=Math.min(4096,Number(this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE)||2048));this.resize();this.loadTexture();this.request()});
    return true;
  }
  loadTexture(){
    const gl=this.gl;if(!gl)return;const tex=gl.createTexture();this.tex=tex;gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([35,4,52,255]));
    const img=new Image();img.decoding='async';img.onload=()=>{if(!this.gl||this.lost)return;gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);if(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL!==undefined)gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);this.ready=true;this.request()};img.onerror=()=>this.fallback();img.src='divina-orb-v48.png?v=48';
  }
  resize(){
    if(!this.gl||this.lost)return;const r=this.shell.getBoundingClientRect();const css=Math.max(190,Math.min(r.width,r.height));
    // Retina real: framebuffer físico acompanha CSS × DPR, com teto por aparelho.
    // O teto evita alocar uma textura absurda no Safari; a qualidade se ajusta
    // depois pelas amostras de frame-time.
    const safeMax=Math.min(this.maxPx,this.maxTextureSize||this.maxPx);
    const px=Math.max(this.minPx,Math.min(safeMax,Math.round(css*this.dpr*this.renderScale)));
    if(this.canvas.width!==px||this.canvas.height!==px){this.canvas.width=px;this.canvas.height=px;this.gl.viewport(0,0,px,px);this.lastFrame=0;this.frameSamples.length=0}
  }
  point(e){const r=this.shell.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width))),y:1-Math.max(0,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)))}}
  announce(text,name='RESPIRA'){
    const state=name==='RESSONÂNCIA'?'resonance':name==='SOBRECARGA'?'charge':name==='LIBERA'?'release':name==='CANALIZA'?(text.includes('cometa')?'comet':'flow'):name==='DESPERTA'?'awaken':'idle';
    if(this.status){this.status.textContent=text;this.status.dataset.state=state}
    this.shell?.setAttribute('data-orb-phase',name);
    this.shell?.dispatchEvent(new CustomEvent('orbphase',{detail:{name,text,energy:this.resonance},bubbles:true}));
  }
  haptic(kind='tap'){
    const now=performance.now();if(now-this.lastHaptic<38&&kind!=='open')return;this.lastHaptic=now;
    const patterns={tap:9,core:13,edge:[7,16,7],hold:18,deep:[16,22,26],flow:[8,18,8],comet:[6,12,18],release:[14,22,26],resonance:[12,24,18,28,34],open:[18,18,42]};
    try{
      const native=window.Capacitor?.Plugins?.Haptics;
      if(native){const style=kind==='resonance'||kind==='open'||kind==='deep'?'HEAVY':kind==='hold'||kind==='release'?'MEDIUM':'LIGHT';native.impact({style}).catch(()=>{});return}
      navigator.vibrate?.(patterns[kind]||10);
    }catch{}
  }
  clearHoldTimers(){clearTimeout(this.holdTimer);clearTimeout(this.overloadTimer);clearTimeout(this.deepTimer);this.holdTimer=0;this.overloadTimer=0;this.deepTimer=0}
  setPhase(n,label){
    this.phase=n;
    this.shell.classList.toggle('phase-awaken',n===1);
    this.shell.classList.toggle('phase-charge',n===3&&this.down);
    this.shell.classList.toggle('phase-resonance',n===5);
    if(label)this.announce(label,n===1?'DESPERTA':n===2?'CANALIZA':n===3?'SOBRECARGA':n===4?'LIBERA':n===5?'RESSONÂNCIA':'RESPIRA');
  }
  openTarot(){
    if(this.opening)return;
    this.opening=true;this.resonance=1.35;this.burst=1.35;this.setPhase(5,'O portal do Tarot Livre está se abrindo');this.haptic('open');
    setTimeout(()=>this.onOpen?.(),110);
    setTimeout(()=>{this.opening=false;if(!this.down){this.setPhase(0,'A Orbe está respirando');this.shell.classList.remove('phase-release','phase-resonance')}},1200);
  }
  bind(){
    const s=this.shell;const stop=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation()};
    s.addEventListener('contextmenu',stop,{passive:false});s.addEventListener('dragstart',stop,{passive:false});s.addEventListener('dblclick',stop,{passive:false});s.addEventListener('gesturestart',stop,{passive:false});
    s.addEventListener('pointerdown',e=>{
      stop(e);this.clearHoldTimers();this.activePointer=e.pointerId;const q=this.point(e);const c={x:q.x-.5,y:q.y-.5};this.lastFrame=0;this.frameSamples.length=0;
      this.down=true;this.moved=false;this.holdStart=performance.now();this.angularTravel=0;this.previousAngle=Math.atan2(c.y,c.x);
      this.lastMoveAt=this.holdStart;this.zone=Math.min(1,Math.hypot(c.x,c.y)/.5);this.pressure=e.pressure>0?e.pressure:e.pointerType==='mouse'?.18:.32;this.echo=0;
      this.pointer={...this.pointer,x:q.x,y:q.y,px:q.x,py:q.y,v:.42};this.renderPointer={x:q.x,y:q.y,px:q.x,py:q.y};this.flow*=.4;this.burst=1;this.flick=0;this.tapUntil=performance.now()+650;this.releaseUntil=0;this.boostUntil=performance.now()+2500;
      const core=this.zone<.48;s.classList.toggle('touch-core',core);s.classList.toggle('touch-edge',!core);
      this.setPhase(1,core?'O núcleo da Orbe reconheceu você':'A coroa interna despertou sob o seu toque');this.haptic(core?'core':'edge');s.classList.add('is-touching');
      try{s.setPointerCapture(e.pointerId)}catch{}
      this.holdTimer=setTimeout(()=>{if(this.down){this.setPhase(3,'Sua intenção está carregando a Orbe');this.haptic('hold');this.boostUntil=performance.now()+2800;this.request()}},480);
      this.overloadTimer=setTimeout(()=>{if(this.down){this.resonance=1.15;this.setPhase(5,'Ressonância profunda: a Orbe reconheceu sua presença');this.haptic('resonance');this.boostUntil=performance.now()+3400;this.request()}},1450);
      this.deepTimer=setTimeout(()=>{if(this.down){this.pressure=1;this.resonance=1.5;this.echo=1.18;this.burst=1.45;this.setPhase(5,'O coração da Orbe está pulsando com a sua intenção');this.haptic('deep');this.boostUntil=performance.now()+4200;this.request()}},2600);
      this.request();
    },{passive:false});
    s.addEventListener('pointermove',e=>{
      if(!this.down||e.pointerId!==this.activePointer)return;stop(e);const samples=e.getCoalescedEvents?.()||[e];const q=this.point(samples[samples.length-1]||e);const dx=q.x-this.pointer.x,dy=q.y-this.pointer.y,dist=Math.hypot(dx,dy);if(dist>.006)this.moved=true;
      const moveNow=performance.now(),moveDt=Math.max(8,moveNow-this.lastMoveAt),speed=dist/moveDt;this.lastMoveAt=moveNow;this.pressure=e.pressure>0?e.pressure:Math.min(1,.30+speed*72);this.zone=Math.min(1,Math.hypot(q.x-.5,q.y-.5)/.5);this.flick=Math.min(1.4,this.flick*.64+speed*190);
      const angle=Math.atan2(q.y-.5,q.x-.5);let da=angle-this.previousAngle;if(da>Math.PI)da-=Math.PI*2;if(da<-Math.PI)da+=Math.PI*2;this.previousAngle=angle;this.angularTravel+=Math.abs(da);this.flow=Math.max(-2,Math.min(2,this.flow*.72+da*5.4));
      this.pointer.px=this.pointer.x;this.pointer.py=this.pointer.y;this.pointer.x=q.x;this.pointer.y=q.y;this.pointer.v=Math.min(1.35,Math.max(this.pointer.v*.58,dist*24));this.pointer.spin=Math.atan2(dy,dx);this.burst=Math.min(1.35,this.burst*.78+dist*9.2);
      if(this.flick>.72){s.classList.add('gesture-comet');this.echo=Math.max(this.echo,.32);this.setPhase(2,'Um cometa de energia atravessou a Orbe')}
      else if(this.angularTravel>.82){this.resonance=Math.min(1.25,this.resonance+.045);this.setPhase(5,'A energia interna está girando com você')}
      else if(dist>.011)this.setPhase(2,'A Orbe está seguindo o seu movimento');
      this.boostUntil=performance.now()+1850;this.request();
    },{passive:false});
    const release=e=>{
      if(!this.down)return;stop(e);this.clearHoldTimers();const now=performance.now();const held=now-this.holdStart;try{s.releasePointerCapture(e.pointerId)}catch{}this.down=false;this.activePointer=null;this.pressure=0;this.echo=Math.max(this.echo,held>900?1:.68);s.classList.remove('is-touching','phase-charge','touch-core','touch-edge','gesture-comet');
      this.setPhase(4,this.flick>.72?'O rastro do cometa continua vivo dentro da Orbe':held>900?'Sua intenção foi liberada':'A Orbe respondeu ao seu toque');this.releaseUntil=now+1080;this.boostUntil=now+2300;this.burst=held>900?1.35:1.12;s.classList.add('phase-release');this.haptic(this.flick>.72?'comet':held>900?'release':'tap');
      if(e.type==='pointerup'&&!this.moved){
        if(now-this.lastTap<350){this.lastTap=0;this.tapChain=0;this.openTarot()}
        else{
          this.lastTap=now;
          const rhythmGap=now-this.lastRhythmTap;this.tapChain=rhythmGap>430&&rhythmGap<1150?this.tapChain+1:1;this.lastRhythmTap=now;
          if(this.tapChain>=3){this.tapChain=0;this.resonance=1.25;this.setPhase(5,'Ressonância: a Orbe reconheceu o seu ritmo');this.haptic('resonance');this.boostUntil=now+3100}
        }
      }else if(this.angularTravel>.82){this.resonance=1.2;this.setPhase(5,'Ressonância circular liberada');this.haptic('flow')}
      setTimeout(()=>{if(!this.down&&!this.opening){s.classList.remove('phase-release','phase-awaken','phase-resonance');this.setPhase(0,'A Orbe está respirando')}},920);
      this.request();
    };
    s.addEventListener('pointerup',release,{passive:false});s.addEventListener('pointercancel',release,{passive:false});s.addEventListener('lostpointercapture',()=>{this.clearHoldTimers();this.down=false;this.activePointer=null;this.pressure=0;this.echo=Math.max(this.echo,.28);s.classList.remove('is-touching','phase-charge','touch-core','touch-edge','gesture-comet');this.releaseUntil=Math.max(this.releaseUntil,performance.now()+620);this.request()});
  }
  request(){if(this.raf||document.hidden||!this.visible||this.destroyed||this.lost||!this.gl)return;this.raf=requestAnimationFrame(n=>this.draw(n))}
  stop(){if(this.raf){cancelAnimationFrame(this.raf);this.raf=0}}
  draw(now){
    this.raf=0;if(!this.gl||this.lost||document.hidden||!this.visible||this.destroyed)return;
    const active=this.down||now<this.boostUntil||now<this.releaseUntil||now<this.tapUntil||this.resonance>.035||Math.abs(this.flow)>.03||this.echo>.025||this.flick>.025;
    const idleMinDt=1000/22;if(!active&&this.lastFrame&&now-this.lastFrame<idleMinDt){this.request();return}
    const dt=this.lastFrame?now-this.lastFrame:16;this.lastFrame=now;
    const rp=this.renderPointer;const follow=this.down?Math.min(1,.48+dt*.035):Math.min(1,.22+dt*.018);rp.px=rp.x;rp.py=rp.y;rp.x+=(this.pointer.x-rp.x)*follow;rp.y+=(this.pointer.y-rp.y)*follow;
    this.pointer.v*=this.down?.952:.87;this.burst*=this.down?.972:.89;this.resonance*=this.down?.996:.976;this.flow*=this.down?.985:.94;this.echo*=this.down?.992:.956;this.flick*=this.down?.976:.91;
    let releaseP=0;if(now<this.releaseUntil){const x=1-(this.releaseUntil-now)/980;releaseP=Math.sin(Math.min(1,Math.max(0,x))*3.14159)}
    const hold=this.down?Math.min(1.25,(now-this.holdStart)/1050):0;
    const tap=now<this.tapUntil?(this.tapUntil-now)/620:0;
    const energy=Math.min(1.55,(this.down?.78:.10)+this.pointer.v*1.10+(now<this.boostUntil?.34:0)+this.burst*.42+hold*.42+tap*.30);
    const gl=this.gl;gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.uniform1f(this.u.t,(now-this.start)/1000);gl.uniform2f(this.u.p,rp.x,rp.y);gl.uniform2f(this.u.pp,rp.px,rp.py);gl.uniform1f(this.u.e,energy);gl.uniform1f(this.u.down,this.down?1:0);gl.uniform1f(this.u.burst,this.burst);gl.uniform1f(this.u.spin,this.pointer.spin);gl.uniform1f(this.u.phase,this.phase+hold);gl.uniform1f(this.u.releaseP,releaseP);gl.uniform1f(this.u.resonance,this.resonance);gl.uniform1f(this.u.flow,this.flow);gl.uniform1f(this.u.pressure,this.pressure);gl.uniform1f(this.u.zone,this.zone);gl.uniform1f(this.u.echo,Math.min(1,this.echo));gl.uniform1f(this.u.flick,Math.min(1,this.flick));gl.drawArrays(gl.TRIANGLES,0,6);
    if(active&&dt<80){this.frameSamples.push(dt);if(this.frameSamples.length>36){const avg=this.frameSamples.reduce((a,b)=>a+b,0)/this.frameSamples.length;this.frameSamples.length=0;const floor=this.reduced?.64:this.deviceTier==='low'?.64:this.deviceTier==='mid'?.74:.78;const ceiling=this.reduced?.72:this.deviceTier==='low'?.78:this.deviceTier==='mid'?.90:.98;if(avg>24&&this.renderScale>floor){this.renderScale=Math.max(floor,this.renderScale-.05);this.resize()}else if(avg<17.2&&this.renderScale<ceiling){this.renderScale=Math.min(ceiling,this.renderScale+.03);this.resize()}}}
    this.request();
  }
  destroy(){this.destroyed=true;this.stop();this.clearHoldTimers();this.ro?.disconnect();this.io?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);if(this.onWindowResize)window.removeEventListener('resize',this.onWindowResize);this.gl?.deleteTexture(this.tex);this.gl?.deleteProgram(this.program)}
  fallback(){if(this.canvas){this.canvas.style.display='none';this.canvas.style.opacity='0'}if(this.shell)this.shell.classList.add('webgl-fallback')}
}
