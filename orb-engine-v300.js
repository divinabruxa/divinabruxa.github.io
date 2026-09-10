/* DIVINA BRUXA 2.0 — REBIRTH R001 · ORBE CORAÇÃO V300
   Um renderer, uma esfera, uma presença visual. WebGL 1 + fallback fotográfico.
   Toque = pulso. Arraste = matéria. Segure = profundidade. Duplo toque = Tarot Livre. */

const DEFAULT_IMAGE = new URL('./divina-orb-fast-v1.webp', import.meta.url).href;
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
const now = () => performance.now();

const VERTEX = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;

const FRAGMENT = `
precision __P__ float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uEnergy;
uniform float uPressure;
uniform float uRipple;
uniform float uSpin;
uniform float uReduced;
uniform vec2 uPointer;
uniform vec2 uRipplePoint;
float h(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.55;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.07+vec2(4.3,7.1);a*=.5;}return v;}
mat2 r(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
void main(){
  vec2 p=(vUv-.5)*2.; float rad=length(p); if(rad>1.) discard;
  float z=sqrt(max(0.,1.-rad*rad)); float inner=pow(max(0.,1.-rad),.48);
  float t=uTime*mix(1.,.24,uReduced);
  float breath=.5+.5*sin(t*.72+sin(t*.17)*.35);
  float slow=fb(p*1.55+vec2(t*.045,-t*.038));
  float fine=fb(r(t*.018)*p*3.15+slow*1.7);
  vec2 finger=(uPointer-.5)*2.; float fd=length(p-finger); float touch=exp(-fd*fd*7.2);
  vec2 rp=(uRipplePoint-.5)*2.; float rd=length(p-rp); float wave=sin(rd*27.-uRipple*9.)*exp(-rd*3.2)*exp(-uRipple*1.65);
  float swirl=(slow-.5)*.055*inner + uSpin*.028*inner;
  vec2 q=r(swirl + sin(t*.19)*.012*inner)*p;
  q*=.977-breath*.018*inner;
  q+=vec2(fine-.5,slow-.5)*(.022+.018*uEnergy)*inner;
  q+=(p-finger)/max(fd,.005)*touch*(.014*uPressure+.008*uEnergy);
  q+=(p-rp)/max(rd,.005)*wave*(.012+.009*uEnergy);
  vec2 uv=clamp(q*.5+.5,vec2(.006),vec2(.994));
  vec3 base=texture2D(uTexture,uv).rgb;
  vec3 deep=texture2D(uTexture,clamp((r(-.018)*q*.988)*.5+.5,vec2(.006),vec2(.994))).rgb;
  vec3 col=mix(base,deep,.18);
  float tide=.5+.5*sin(t*.43-rad*7.8+slow*5.2);
  col*=.87+breath*.18+tide*.055*inner;
  float star=pow(smoothstep(.72,1.,max(base.r,max(base.g,base.b))),2.6);
  star*=pow(.5+.5*sin(t*3.1+uv.x*171.+uv.y*137.+fine*14.),9.);
  col+=mix(vec3(.72,.46,1.),vec3(1.,.65,.31),slow)*star*.16;
  col+=vec3(.62,.16,1.)*touch*(.06+.12*uEnergy);
  col+=mix(vec3(.42,.14,1.),vec3(1.,.42,.18),fine)*abs(wave)*(.08+.08*uEnergy);
  vec3 normal=normalize(vec3(p,z)); vec3 light=normalize(vec3(-.42,.58,.78));
  float spec=pow(max(0.,dot(reflect(-light,normal),vec3(0,0,1))),42.);
  float fres=pow(1.-z,2.2);
  col+=vec3(1.,.9,.72)*spec*.14;
  col+=mix(vec3(.28,.08,.7),vec3(.82,.18,.55),slow)*fres*.18;
  float soul=exp(-dot(p-vec2(sin(t*.18),cos(t*.15))*.21,p-vec2(sin(t*.18),cos(t*.15))*.21)*6.);
  col+=mix(vec3(.45,.12,1.),vec3(1.,.45,.18),fine)*soul*(.035+.055*breath)*inner;
  float edge=1.-smoothstep(.965,1.,rad);
  gl_FragColor=vec4(col,edge);
}`;

function shader(gl, type, source){
  const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const m=gl.getShaderInfoLog(s)||'shader';gl.deleteShader(s);throw new Error(m)}
  return s;
}

export class RealityOrbHeartV300 {
  constructor(canvas,{onOpen}={}){
    if(!canvas) throw new Error('Canvas da Orbe ausente.');
    this.canvas=canvas; this.shell=canvas.closest('.orb-shell'); this.onOpen=onOpen;
    this.gl=null; this.program=null; this.buffer=null; this.texture=null; this.uniforms={};
    this.frame=0; this.last=0; this.startTime=now(); this.visible=!document.hidden; this.active=true; this.destroyed=false;
    this.pointer={x:.5,y:.5}; this.ripple={x:.5,y:.5,age:99}; this.energy=.12; this.energyTarget=.12; this.pressure=0; this.pressureTarget=0; this.spin=0;
    this.down=null; this.lastTap=0; this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.imageSource=document.documentElement.dataset.orbImage||DEFAULT_IMAGE;
    this.bind(); this.prepare().catch(()=>this.fallback());
  }
  bind(){
    this.onResize=()=>this.resize();
    this.onVisibility=()=>{this.visible=!document.hidden;if(this.visible)this.loop();};
    this.onRoute=e=>{this.active=(e.detail?.id||document.body.dataset.screen||'home')==='home';if(this.active)this.loop();};
    this.onSkin=e=>this.replaceTexture(e.detail?.src);
    this.onDown=e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      const rect=this.shell.getBoundingClientRect();
      this.down={id:e.pointerId,x:e.clientX,y:e.clientY,t:now(),moved:false};
      this.shell.setPointerCapture?.(e.pointerId); this.point(e,rect); this.pressureTarget=.9; this.energyTarget=.78;
      this.ripple={x:this.pointer.x,y:this.pointer.y,age:0}; this.shell.classList.add('is-touched');
    };
    this.onMove=e=>{
      if(!this.down||e.pointerId!==this.down.id)return;
      const rect=this.shell.getBoundingClientRect(); const px=this.pointer.x; this.point(e,rect);
      if(Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>8)this.down.moved=true;
      this.spin=clamp(this.spin+(this.pointer.x-px)*.7,-1.5,1.5); this.energyTarget=1.05;
    };
    this.onUp=e=>{
      if(!this.down||e.pointerId!==this.down.id)return;
      const gesture=this.down; this.down=null; this.pressureTarget=0; this.energyTarget=.26; this.shell.classList.remove('is-touched');
      const duration=now()-gesture.t;
      if(gesture.moved||duration>520)return;
      const stamp=now(); this.pulse();
      if(stamp-this.lastTap<330){this.lastTap=0;this.openPortal();}else this.lastTap=stamp;
    };
    this.onCancel=()=>{this.down=null;this.pressureTarget=0;this.energyTarget=.16;this.shell.classList.remove('is-touched');};
    this.onKey=e=>{
      if(e.key==='Enter'){e.preventDefault();this.pulse();this.openPortal();}
      else if(e.key===' '){e.preventDefault();this.pulse();}
    };
    this.onContextLost=e=>{e.preventDefault();this.cancel();this.shell.classList.add('orb-fallback');};
    this.onContextRestored=()=>this.prepare().catch(()=>this.fallback());
    addEventListener('resize',this.onResize,{passive:true}); document.addEventListener('visibilitychange',this.onVisibility);
    document.addEventListener('divina:route-ready',this.onRoute); document.addEventListener('divina:orb-image',this.onSkin);
    this.shell.addEventListener('pointerdown',this.onDown); this.shell.addEventListener('pointermove',this.onMove); this.shell.addEventListener('pointerup',this.onUp); this.shell.addEventListener('pointercancel',this.onCancel); this.shell.addEventListener('keydown',this.onKey);
    this.shell.addEventListener('click',e=>e.preventDefault());
    this.canvas.addEventListener('webglcontextlost',this.onContextLost,false); this.canvas.addEventListener('webglcontextrestored',this.onContextRestored,false);
  }
  point(e,rect){this.pointer.x=clamp((e.clientX-rect.left)/Math.max(1,rect.width));this.pointer.y=clamp(1-(e.clientY-rect.top)/Math.max(1,rect.height));}
  pulse(){this.energyTarget=1.12;this.ripple={x:this.pointer.x,y:this.pointer.y,age:0};setTimeout(()=>{if(!this.down)this.energyTarget=.18},260);}
  openPortal(){if(this.shell.dataset.portal==='opening')return;this.shell.dataset.portal='opening';this.energyTarget=1.35;setTimeout(()=>{try{this.onOpen?.()}finally{delete this.shell.dataset.portal;this.energyTarget=.18}},180);}
  async prepare(){
    this.cancel();
    const gl=this.canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:false});
    if(!gl) throw new Error('webgl'); this.gl=gl;
    const precision=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT)?.precision?'highp':'mediump';
    const vs=shader(gl,gl.VERTEX_SHADER,VERTEX); const fs=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT.replace('__P__',precision));
    const program=gl.createProgram(); gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'link');
    this.program=program; this.buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    this.texture=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,this.texture); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([20,8,35,255]));
    const names=['uTexture','uTime','uEnergy','uPressure','uRipple','uSpin','uReduced','uPointer','uRipplePoint']; for(const name of names)this.uniforms[name]=gl.getUniformLocation(program,name);
    this.resize(); await this.replaceTexture(this.imageSource); this.shell.classList.remove('orb-loading','orb-fallback'); this.loop();
  }
  replaceTexture(src){
    if(!src||!this.gl||!this.texture)return Promise.resolve(false); this.imageSource=src;
    return new Promise(resolve=>{const img=new Image();img.decoding='async';img.onload=()=>{if(!this.gl||!this.texture)return resolve(false);try{this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,true);this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,img);resolve(true)}catch{resolve(false)}};img.onerror=()=>resolve(false);img.src=src;});
  }
  resize(){if(!this.gl)return;const rect=this.canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,this.reduced.matches?1.25:2);const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}}
  loop(){if(this.destroyed||this.frame||!this.visible||!this.active||!this.gl)return;this.frame=requestAnimationFrame(t=>{this.frame=0;this.draw(t);this.loop();});}
  draw(t){
    const gl=this.gl;if(!gl||!this.program)return;const dt=Math.min(.05,Math.max(.001,(t-(this.last||t-16.7))/1000));this.last=t;
    const follow=1-Math.exp(-8*dt);this.energy+=(this.energyTarget-this.energy)*follow;this.pressure+=(this.pressureTarget-this.pressure)*follow;this.spin*=Math.pow(.18,dt);this.ripple.age+=dt;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);const a=gl.getAttribLocation(this.program,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);
    gl.uniform1i(this.uniforms.uTexture,0);gl.uniform1f(this.uniforms.uTime,(t-this.startTime)/1000);gl.uniform1f(this.uniforms.uEnergy,this.energy);gl.uniform1f(this.uniforms.uPressure,this.pressure);gl.uniform1f(this.uniforms.uRipple,this.ripple.age);gl.uniform1f(this.uniforms.uSpin,this.spin);gl.uniform1f(this.uniforms.uReduced,this.reduced.matches?1:0);gl.uniform2f(this.uniforms.uPointer,this.pointer.x,this.pointer.y);gl.uniform2f(this.uniforms.uRipplePoint,this.ripple.x,this.ripple.y);gl.drawArrays(gl.TRIANGLES,0,6);
  }
  fallback(){this.cancel();this.shell.classList.remove('orb-loading');this.shell.classList.add('orb-fallback');}
  cancel(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;}
  snapshot(){return{version:300,active:this.active,visible:this.visible,energy:this.energy,pressure:this.pressure,image:this.imageSource,fallback:this.shell.classList.contains('orb-fallback')}}
  destroy(){this.destroyed=true;this.cancel();removeEventListener('resize',this.onResize);document.removeEventListener('visibilitychange',this.onVisibility);document.removeEventListener('divina:route-ready',this.onRoute);document.removeEventListener('divina:orb-image',this.onSkin);this.shell.removeEventListener('pointerdown',this.onDown);this.shell.removeEventListener('pointermove',this.onMove);this.shell.removeEventListener('pointerup',this.onUp);this.shell.removeEventListener('pointercancel',this.onCancel);this.shell.removeEventListener('keydown',this.onKey);if(this.gl){if(this.texture)this.gl.deleteTexture(this.texture);if(this.buffer)this.gl.deleteBuffer(this.buffer);if(this.program)this.gl.deleteProgram(this.program);}this.gl=null;}
}
