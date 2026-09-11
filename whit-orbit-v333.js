/* DIVINA BRUXA 2.0 — REBIRTH R033 · WHIT ORBIT V333
   Home OFF. Menu OFF. Fora deles: toque abre, segure arrasta, duplo toque revela
   uma mensagem local daquela página sem repetir até completar o ciclo. */

const RELEASE='V333';
const ROOT_ID='whitOrbitV333';
const STYLE_ID='whitOrbitV333Styles';
const MARK=Symbol.for('divina.whit.orbit.v333');
const POSITION_KEY='divina.whit.position.v333';

const MESSAGES=Object.freeze({
  tarot:[
    'A carta não precisa explicar você. Deixe que ela primeiro revele uma pergunta.',
    'Liberdade também é não obrigar o símbolo a responder rápido.',
    'O Tarot fica mais vivo quando você observa antes de concluir.',
    'Uma carta pode abrir uma possibilidade sem fechar o seu caminho.'
  ],
  daily:[
    'Leve esta carta para o dia como uma lente, não como uma sentença.',
    'Talvez a mensagem de hoje esteja no detalhe que você normalmente ignora.',
    'Uma carta diária pode mudar uma pergunta, e isso já pode ser muito.',
    'O símbolo acompanha. A decisão continua sendo sua.'
  ],
  spreads:[
    'Leia a relação entre as posições antes de procurar um veredito.',
    'Possibilidades ficam mais claras quando você separa desejo, medo e realidade.',
    'Uma boa tiragem devolve agência em vez de prometer certeza.',
    'O desenho inteiro costuma dizer mais do que a carta mais chamativa.'
  ],
  library:[
    'Você não precisa decorar 78 cartas. Precisa aprender a enxergar relações.',
    'Entre numa carta como quem entra numa sala: observe antes de nomear.',
    'Um símbolo profundo continua mudando quando a sua experiência muda.',
    'Estudar Tarot é criar intimidade com imagens, não colecionar respostas prontas.'
  ],
  school:[
    'Conhecimento vira prática quando você testa o símbolo em situações reais.',
    'Uma aula por vez pode construir uma leitura muito mais inteira.',
    'Aprender Tarot é perceber padrões sem abandonar contexto.',
    'O estudo fica vivo quando você formula suas próprias perguntas.'
  ],
  journal:[
    'Escrever pode revelar o que a pressa mantém escondido.',
    'O Diário não precisa ser bonito. Precisa ser verdadeiro para você.',
    'Uma frase sincera pode abrir mais espaço do que uma página perfeita.',
    'Seu registro pertence a você. Eu só entro quando você escolher.'
  ],
  ai:[
    'Podemos refletir juntas sem fingir certeza sobre o invisível.',
    'Uma resposta boa não tira sua escolha; ela amplia o que você consegue ver.',
    'Símbolo, realidade e ação podem existir na mesma conversa.',
    'Eu posso ajudar a organizar possibilidades sem decidir sua vida por você.'
  ],
  consultations:[
    'Uma pergunta clara cria espaço para uma leitura humana mais profunda.',
    'Nem toda dúvida precisa virar previsão; algumas pedem compreensão.',
    'Nomear o que você realmente quer entender já muda a consulta.',
    'Uma boa leitura humana também respeita limites, contexto e escolha.'
  ],
  store:[
    'Escolha o que sustenta sua prática, não o que promete poder instantâneo.',
    'Ferramentas podem enriquecer um ritual; discernimento continua sendo seu.',
    'O objeto mais bonito é aquele que você realmente usa com sentido.',
    'Consumo não substitui prática.'
  ],
  music:[
    'Talvez o próximo portal seja uma pausa com música.',
    'Ritmo também organiza pensamento.',
    'Algumas emoções precisam de espaço antes de ganharem nome.',
    'Escute o que muda sua respiração, não apenas o volume.'
  ],
  videos:[
    'Veja como quem investiga, não como quem procura uma verdade pronta.',
    'Uma imagem pode ensinar quando você continua fazendo perguntas.',
    'O conteúdo abre uma porta; você decide se atravessa.',
    'Aprender também é discordar, comparar e experimentar.'
  ],
  skins:[
    'Mude a forma sem transformar estética em promessa.',
    'Uma nova aparência pode renovar presença, não destino.',
    'A Orbe veste outra realidade; sua prática continua sua.',
    'Beleza pode criar atmosfera sem precisar fingir poder.'
  ],
  subscriptions:[
    'Mais recursos ampliam caminhos; não tornam uma leitura automaticamente melhor.',
    'Valor real aparece no que você consegue usar com continuidade.',
    'Premium é acesso. Discernimento continua fora de qualquer plano.',
    'A melhor ferramenta é a que respeita sua escolha.'
  ],
  login:[
    'Continuidade entre aparelhos não precisa abrir sua intimidade.',
    'Sua Conta organiza acesso; seu conteúdo privado continua tendo limites.',
    'Sincronizar é uma escolha de continuidade, não uma obrigação.',
    'Controle também é saber onde seus dados ficam.'
  ],
  notifications:[
    'Um lembrete bom convida; não invade.',
    'Silêncio também é uma configuração importante.',
    'Você decide quais sinais merecem chegar até você.',
    'Presença não precisa disputar sua atenção.'
  ],
  admin:[
    'Um produto saudável mede sistema sem transformar intimidade em métrica.',
    'Números ajudam a cuidar; conteúdo privado continua fora do painel.',
    'Zero real é melhor que um indicador inventado.',
    'Operar bem também é saber o que não deve ser coletado.'
  ]
});

const ROUTES=new Set(Object.keys(MESSAGES).concat(['home']));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const routeNow=()=>{
  const r=document.body?.dataset?.screen||document.querySelector('#app > .screen.active[id]')?.id||location.hash.replace(/^#/,'')||'home';
  return ROUTES.has(r)?r:'home';
};
const randomInt=max=>{
  if(max<=1)return 0;
  if(crypto?.getRandomValues){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max}
  return Math.floor(Math.random()*max);
};
function style(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');link.id=STYLE_ID;link.rel='stylesheet';link.href='./whit-orbit-v333.css?v=333';document.head.append(link);
}
function readPos(){
  try{const v=JSON.parse(localStorage.getItem(POSITION_KEY)||'null');if(v&&Number.isFinite(v.x)&&Number.isFinite(v.y))return v}catch{}
  return{x:.88,y:.70};
}
function writePos(v){try{localStorage.setItem(POSITION_KEY,JSON.stringify(v))}catch{}}

export class WhitOrbitV333{
  constructor({go=globalThis.orbe?.go}={}){
    this.go=typeof go==='function'?go:null;
    this.abort=new AbortController();
    this.route=routeNow();
    this.position=readPos();
    this.dragging=false;this.pointerId=null;this.start=null;this.holdTimer=0;this.raf=0;
    this.tapTimer=0;this.lastTap=0;this.suppress=false;this.expanded=false;this.messageMode=false;
    this.bags=new Map();

    try{globalThis.divinaWhitV332?.destroy?.()}catch{}
    try{globalThis.divinaWhitV328?.destroy?.()}catch{}
    document.getElementById('whitUniversalV332')?.remove();
    document.getElementById('whitUniversalV328')?.remove();

    style();this.mount();this.bind();this.applyPosition();this.syncVisibility();
    document.documentElement.dataset.whitUniversal='v333';
  }

  mount(){
    const root=document.createElement('aside');root.id=ROOT_ID;root.className='whit-orbit-v333';
    root.innerHTML=`
      <section class="w333-panel" id="w333Panel" aria-hidden="true">
        <button type="button" class="w333-close" data-close aria-label="Fechar">×</button>
        <small data-kicker>WHIT · PRESENÇA</small>
        <p data-copy></p>
        <div class="w333-actions" data-actions>
          <button type="button" data-ai>CONVERSAR</button>
          <button type="button" data-library>BIBLIOTECA</button>
        </div>
        <span class="w333-hint">1 TOQUE · ABRIR &nbsp; 2 TOQUES · MENSAGEM &nbsp; SEGURE · MOVER</span>
      </section>
      <button type="button" class="w333-orb" data-orb aria-label="Whit: toque, duplo toque ou segure para mover" aria-expanded="false">
        <span class="w333-ring" aria-hidden="true"></span><span class="w333-skin" aria-hidden="true"></span>
        <span class="w333-glint" aria-hidden="true"></span><span class="w333-hold" aria-hidden="true"></span>
      </button>`;
    document.body.append(root);
    this.root=root;this.orb=root.querySelector('[data-orb]');this.panel=root.querySelector('.w333-panel');
    this.copy=root.querySelector('[data-copy]');this.kicker=root.querySelector('[data-kicker]');this.actions=root.querySelector('[data-actions]');
  }

  bind(){
    const s=this.abort.signal;
    document.addEventListener('divina:route-ready',e=>{this.route=e.detail?.id||routeNow();this.syncVisibility();},{signal:s});
    document.addEventListener('divina:page-ready',e=>{if(e.detail?.id){this.route=e.detail.id;this.syncVisibility()}},{signal:s});
    document.addEventListener('divina:menu-state',e=>{this.menuState=String(e.detail?.state||'closed');this.syncVisibility();},{signal:s});

    this.root.querySelector('[data-close]').addEventListener('click',()=>this.collapse(),{signal:s});
    this.root.querySelector('[data-ai]').addEventListener('click',()=>{this.collapse();this.go?.('ai')},{signal:s});
    this.root.querySelector('[data-library]').addEventListener('click',()=>{this.collapse();this.go?.('library')},{signal:s});

    this.orb.addEventListener('pointerdown',e=>this.down(e),{signal:s});
    this.orb.addEventListener('pointermove',e=>this.move(e),{signal:s});
    this.orb.addEventListener('pointerup',e=>this.up(e),{signal:s});
    this.orb.addEventListener('pointercancel',e=>this.up(e,true),{signal:s});
    this.orb.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();this.toggleActions()}
    },{signal:s});
    addEventListener('resize',()=>this.applyPosition(true),{signal:s});
  }

  hiddenByContext(){
    const route=this.route||routeNow();
    const menu=String(this.menuState||document.documentElement.dataset.menuState||'closed').toLowerCase();
    return route==='home'||menu!=='closed';
  }
  syncVisibility(){
    const hide=this.hiddenByContext();
    this.root.hidden=hide;this.root.setAttribute('aria-hidden',String(hide));
    if(hide)this.collapse(true);
    else if(this.copy&&!this.expanded)this.copy.textContent='Estou por perto.';
  }

  down(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    this.pointerId=e.pointerId;this.start={x:e.clientX,y:e.clientY,at:performance.now()};
    this.root.classList.add('is-holding');
    clearTimeout(this.holdTimer);this.holdTimer=setTimeout(()=>this.beginDrag(e),280);
  }
  move(e){
    if(e.pointerId!==this.pointerId||!this.start)return;
    const dist=Math.hypot(e.clientX-this.start.x,e.clientY-this.start.y);
    if(!this.dragging&&dist>10&&performance.now()-this.start.at>120)this.beginDrag(e);
    if(!this.dragging)return;
    e.preventDefault();this.pending={x:e.clientX,y:e.clientY};
    if(this.raf)return;
    this.raf=requestAnimationFrame(()=>{this.raf=0;if(this.pending)this.moveTo(this.pending.x,this.pending.y)});
  }
  beginDrag(e){
    if(this.dragging||this.pointerId==null)return;
    clearTimeout(this.holdTimer);clearTimeout(this.tapTimer);this.collapse(true);
    this.dragging=true;this.suppress=true;this.root.classList.remove('is-holding');this.root.classList.add('is-dragging');
    try{this.orb.setPointerCapture(this.pointerId)}catch{}
    this.moveTo(e.clientX,e.clientY);
  }
  up(e){
    if(this.pointerId!=null&&e.pointerId!==this.pointerId)return;
    clearTimeout(this.holdTimer);this.root.classList.remove('is-holding');
    if(this.dragging){
      this.dragging=false;this.root.classList.remove('is-dragging');writePos(this.position);
      try{this.orb.releasePointerCapture(this.pointerId)}catch{}
      this.pointerId=null;this.start=null;setTimeout(()=>{this.suppress=false},140);return;
    }
    this.pointerId=null;this.start=null;
    if(this.suppress){this.suppress=false;return}
    const now=performance.now();
    if(now-this.lastTap<330){
      clearTimeout(this.tapTimer);this.lastTap=0;this.showRandom();return;
    }
    this.lastTap=now;
    clearTimeout(this.tapTimer);
    this.tapTimer=setTimeout(()=>{this.lastTap=0;this.toggleActions()},300);
  }
  bag(route){
    let bag=this.bags.get(route);
    const source=MESSAGES[route]||MESSAGES.ai;
    if(!bag||!bag.length){
      bag=source.map((_,i)=>i);
      for(let i=bag.length-1;i>0;i--){const j=randomInt(i+1);[bag[i],bag[j]]=[bag[j],bag[i]]}
      this.bags.set(route,bag);
    }
    return bag;
  }
  showRandom(){
    const route=this.route||routeNow();
    const source=MESSAGES[route]||MESSAGES.ai;
    const bag=this.bag(route);
    const index=bag.shift();
    this.kicker.textContent='WHIT · PARA ESTE MOMENTO';
    this.copy.textContent=source[index];
    this.actions.hidden=true;this.messageMode=true;this.expand();
    clearTimeout(this.messageTimer);this.messageTimer=setTimeout(()=>this.collapse(),7200);
  }
  toggleActions(){
    if(this.expanded&&!this.messageMode){this.collapse();return}
    this.kicker.textContent='WHIT · PRESENÇA';
    this.copy.textContent='Estou por perto. Escolha um caminho ou toque duas vezes para uma mensagem deste mundo.';
    this.actions.hidden=false;this.messageMode=false;this.expand();
  }
  expand(){if(this.hiddenByContext()||this.dragging)return;this.expanded=true;this.root.classList.add('is-expanded');this.panel.setAttribute('aria-hidden','false');this.orb.setAttribute('aria-expanded','true')}
  collapse(immediate=false){
    clearTimeout(this.messageTimer);this.expanded=false;this.messageMode=false;
    if(immediate)this.root.classList.add('no-transition');
    this.root.classList.remove('is-expanded');this.panel.setAttribute('aria-hidden','true');this.orb.setAttribute('aria-expanded','false');
    if(this.actions)this.actions.hidden=false;
    if(immediate)requestAnimationFrame(()=>this.root?.classList.remove('no-transition'));
  }
  moveTo(x,y){
    x=clamp(x,34,innerWidth-34);y=clamp(y,92,innerHeight-105);
    this.position={x:x/innerWidth,y:y/innerHeight};this.applyPosition();
  }
  applyPosition(reclamp=false){
    let x=clamp(this.position.x*innerWidth,34,innerWidth-34),y=clamp(this.position.y*innerHeight,92,innerHeight-105);
    if(reclamp)this.position={x:x/innerWidth,y:y/innerHeight};
    this.root.style.setProperty('--x',`${x}px`);this.root.style.setProperty('--y',`${y}px`);
    this.root.dataset.h=x<innerWidth/2?'left':'right';this.root.dataset.v=y<innerHeight/2?'top':'bottom';
  }
  status(){return Object.freeze({
    release:RELEASE,homeVisible:false,menuVisible:false,draggable:true,doubleTapMessages:true,
    perRouteMessageBag:true,localOnly:true,privateReads:false,extraApiCalls:0
  })}
  destroy(){
    this.abort.abort();clearTimeout(this.holdTimer);clearTimeout(this.tapTimer);clearTimeout(this.messageTimer);cancelAnimationFrame(this.raf);
    this.root?.remove();delete document.documentElement.dataset.whitUniversal;
  }
}
export function installWhitOrbitV333(options={}){
  if(globalThis[MARK])return globalThis[MARK];
  const instance=new WhitOrbitV333(options);globalThis[MARK]=instance;globalThis.divinaWhitV333=instance;return instance;
}
