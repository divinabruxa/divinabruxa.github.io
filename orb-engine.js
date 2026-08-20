export class LivingOrb {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.pointer = { x: .42, y: .38, tx: .42, ty: .38, vx: 0, vy: 0, down: false };
    this.waves = []; this.time = 0; this.running = true; this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.bind(); this.resize(); this.frame();
  }
  bind() {
    const locate = event => { const r = this.canvas.getBoundingClientRect(); return { x: (event.clientX-r.left)/r.width, y: (event.clientY-r.top)/r.height }; };
    this.canvas.addEventListener('pointerdown', event => { event.preventDefault(); this.pointer.down = true; Object.assign(this.pointer, locate(event)); this.pointer.tx=this.pointer.x; this.pointer.ty=this.pointer.y; this.waves.push({x:this.pointer.x,y:this.pointer.y,r:0,a:1}); this.canvas.setPointerCapture(event.pointerId); navigator.vibrate?.(10); });
    this.canvas.addEventListener('pointermove', event => { if (!this.pointer.down) return; const p=locate(event); this.pointer.tx=p.x; this.pointer.ty=p.y; this.waves.push({x:p.x,y:p.y,r:0,a:.36}); });
    const release = () => { this.pointer.down=false; };
    this.canvas.addEventListener('pointerup', release); this.canvas.addEventListener('pointercancel', release);
    addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { this.running = !document.hidden; if (this.running) requestAnimationFrame(() => this.frame()); });
  }
  resize() { const d=Math.min(devicePixelRatio||1,2); const size=Math.max(280,this.canvas.clientWidth); this.canvas.width=Math.round(size*d); this.canvas.height=Math.round(size*d); this.size=this.canvas.width; }
  glow(x,y,r,inner,outer='transparent') { const c=this.ctx,s=this.size,g=c.createRadialGradient(x*s,y*s,0,x*s,y*s,r*s); g.addColorStop(0,inner); g.addColorStop(1,outer); c.fillStyle=g; c.fillRect(0,0,s,s); }
  frame() {
    if (!this.running) return;
    const c=this.ctx,s=this.size,p=this.pointer; this.time += this.reduce ? .002 : .012;
    if (!p.down) { p.tx=.5+Math.sin(this.time*.66)*.2; p.ty=.47+Math.cos(this.time*.81)*.16; }
    p.vx=(p.vx+(p.tx-p.x)*.028)*.925; p.vy=(p.vy+(p.ty-p.y)*.028)*.925; p.x+=p.vx; p.y+=p.vy;
    c.clearRect(0,0,s,s); c.save(); c.beginPath(); c.arc(s/2,s/2,s*.488,0,Math.PI*2); c.clip();
    const base=c.createRadialGradient(s*.3,s*.22,s*.01,s*.53,s*.56,s*.72); base.addColorStop(0,'#f9ffff'); base.addColorStop(.11,'#9ff8ff'); base.addColorStop(.31,'#d33ad8'); base.addColorStop(.58,'#352273'); base.addColorStop(1,'#03050f'); c.fillStyle=base; c.fillRect(0,0,s,s);
    for(let i=0;i<7;i++){ const phase=this.time*(.38+i*.035)+i*1.17; this.glow(.5+Math.sin(phase)*(.14+i*.015),.5+Math.cos(phase*1.23)*(.13+i*.01),.22+i*.025, i%3===0?'rgba(255,242,190,.22)':i%3===1?'rgba(255,43,206,.24)':'rgba(48,232,255,.22)'); }
    this.glow(p.x,p.y,.28,'rgba(255,255,255,.82)');
    this.waves=this.waves.filter(w=>{w.r+=.012;w.a*=.965;c.strokeStyle=`rgba(221,249,255,${w.a})`;c.lineWidth=s*.006*w.a;c.beginPath();c.arc(w.x*s,w.y*s,w.r*s,0,Math.PI*2);c.stroke();return w.a>.025;});
    c.globalCompositeOperation='screen'; c.strokeStyle='rgba(255,255,255,.15)'; c.lineWidth=s*.018; c.beginPath(); c.arc(s*.42,s*.38,s*.42,Math.PI*1.06,Math.PI*1.72); c.stroke(); c.restore();
    const halo=c.createRadialGradient(s/2,s/2,s*.44,s/2,s/2,s*.6); halo.addColorStop(0,'rgba(135,45,255,0)');halo.addColorStop(.72,'rgba(131,35,255,.17)');halo.addColorStop(1,'transparent');c.fillStyle=halo;c.fillRect(0,0,s,s);
    requestAnimationFrame(()=>this.frame());
  }
  pulse() { this.waves.push({x:.5,y:.5,r:.02,a:1},{x:.5,y:.5,r:.12,a:.75}); }
}
