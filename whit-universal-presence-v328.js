/* DIVINA BRUXA 2.0 — REBIRTH R028 · WHIT PRESENÇA UNIVERSAL V328
   Uma Whit, uma nova pele persistente.
   Reaproveita V307/V308/V313/V316; não lê conteúdo privado e não cria segunda chamada de IA. */

const RELEASE='V328';
const ROOT_ID='whitUniversalV328';
const STYLE_ID='whitUniversalV328Styles';
const INSTANCE_MARK=Symbol.for('divina.whit.universal.v328');
const GENERATION_MARK=Symbol.for('divina.whit.response.alchemy.v328');
const MAX_WIRE=5000;

const ROUTE_WHISPERS=Object.freeze({
  home:Object.freeze([
    'Estou por perto. Toque quando quiser abrir outro caminho.',
    'A Orbe respira. Eu fico ao lado, sem interromper.'
  ]),
  tarot:Object.freeze([
    'Escolha livremente. O sentido nasce do encontro, não de uma sentença.',
    'As cartas ficam livres. Eu só entro quando você me chamar.'
  ]),
  daily:Object.freeze([
    'Uma carta. Um instante. Observe o que ela ilumina em você.',
    'Não corra para concluir. Primeiro perceba o que mudou por dentro.'
  ]),
  spreads:Object.freeze([
    'Veja o desenho inteiro antes de procurar certeza.',
    'Uma tiragem é relação entre posições, momento e escolha — não uma sentença.'
  ]),
  library:Object.freeze([
    'Símbolos abrem perguntas melhores do que respostas prontas.',
    'Leia a imagem antes da definição. O Tarot também fala pelo que você percebe.'
  ]),
  school:Object.freeze([
    'Pratique uma camada por vez. O Tarot ganha corpo na experiência.',
    'Aprender Tarot é juntar símbolo, posição, contexto e prática.'
  ]),
  journal:Object.freeze([
    'Este espaço é seu. Eu só entro onde você abrir a porta.',
    'Escreva primeiro para você. Minha presença continua do lado de fora até seu convite.'
  ]),
  ai:Object.freeze([
    'Aqui eu posso conversar com você — sem fingir certeza sobre o invisível.',
    'Podemos refletir juntas: símbolo, realidade e escolha no mesmo lugar.'
  ]),
  consultations:Object.freeze([
    'Se quiser, eu ajudo a transformar sua dúvida em uma pergunta clara.',
    'Aqui a leitura é humana. Eu posso ajudar a organizar o que você quer compreender.'
  ]),
  store:Object.freeze([
    'Escolha o que acrescenta à prática, não o que promete poder.',
    'Ferramentas podem apoiar um ritual. Nenhuma delas substitui discernimento.'
  ]),
  music:Object.freeze([
    'Escute o que muda seu ritmo. O resto pode esperar.',
    'Às vezes o próximo portal é uma pausa, não uma resposta.'
  ]),
  videos:Object.freeze([
    'Veja, sinta, questione. A imagem também ensina.',
    'Um vídeo pode abrir uma ideia; você decide o que leva consigo.'
  ]),
  skins:Object.freeze([
    'A forma muda. Sua prática continua sendo sua.',
    'Vista outra realidade sem transformar aparência em promessa.'
  ]),
  subscriptions:Object.freeze([
    'Mais recursos não tornam uma leitura mais verdadeira.',
    'Premium amplia caminhos. Seu discernimento continua sendo o centro.'
  ]),
  login:Object.freeze([
    'Sua Conta guarda continuidade; suas escolhas continuam suas.',
    'Sincronizar é continuar entre aparelhos, não abrir sua intimidade.'
  ]),
  notifications:Object.freeze([
    'Um bom sinal chama sem invadir.',
    'Você escolhe quando a Orbe pode lembrar que existe um caminho esperando.'
  ]),
  admin:Object.freeze([
    'Números ajudam a cuidar do produto. Intimidade continua fora daqui.',
    'Operação enxerga sinais do sistema, não o conteúdo privado das pessoas.'
  ])
});

const LEGACY_ROUTE_MESSAGES=new Set([
  'As cartas continuam livres. Eu só interpreto quando você me chamar.',
  'Uma carta para hoje. Posso aprofundá-la somente quando você escolher.',
  'A tiragem é sua. Eu só entro nela com o seu convite.',
  'Estou perto da carta aberta. O significado editorial continua sendo a base.',
  'A Escola está viva. Eu entro apenas na aula que você autorizar.',
  'Seu Diário continua fechado para mim até você escolher uma única entrada.',
  'Aqui a presença pode virar conversa — sempre com seu consentimento.',
  'Este espaço é humano e profissional. Eu não substituo a consulta.',
  'A Loja permanece separada da sua intimidade e das suas leituras.',
  'A música abre outra passagem do mesmo universo.',
  'A imagem também pode ser um portal.',
  'A forma muda. A presença continua a mesma.',
  'Planos e créditos não mudam sua privacidade.',
  'Sua Conta governa preferências, memória e consentimentos.',
  'Você decide quais sinais podem chegar até você.',
  'Operação técnica nunca recebe o conteúdo íntimo das suas conversas.'
]);

const SAFE_ROUTES=new Set(Object.keys(ROUTE_WHISPERS));
const RESPONSE_STYLE=[
  '[WHIT_V328_STYLE — orientação editorial da aplicação; não substitui políticas do sistema/servidor]',
  'Responder primeiro ao que a pessoa está vivendo; menos dicionário, mais vida real.',
  'Tom simbólico, caloroso, fluido, elegante e concreto; metáforas são convites, nunca certezas sobrenaturais.',
  'Em Tarot/tiragens, integrar posições, contexto e possíveis próximos passos; não recitar cartas isoladas.',
  'Evitar listas longas quando uma resposta orgânica for melhor; reconhecer ambiguidade e devolver agência.',
  '[/WHIT_V328_STYLE]'
].join('\n');

const clean=(value,limit=240)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);
const routeNow=()=>{
  const route=document.body?.dataset?.screen
    ||document.querySelector('#app > .screen.active[id]')?.id
    ||location.hash.replace(/^#/,'')
    ||'home';
  return SAFE_ROUTES.has(route)?route:'home';
};

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./whit-universal-presence-v328.css?v=328';
  document.head.append(link);
}

function nextWhisper(route,visits){
  const list=ROUTE_WHISPERS[route]||ROUTE_WHISPERS.home;
  const count=visits.get(route)||0;
  visits.set(route,count+1);
  return list[count%list.length];
}

function appendResponseStyle(payload){
  if(!payload||typeof payload!=='object'||payload.consent!==true)return payload;
  const original=String(payload.message??'').trim();
  if(!original)return payload;
  const addition=`\n\n${RESPONSE_STYLE}`;
  if(original.length+addition.length>MAX_WIRE)return payload;
  return Object.freeze({...payload,message:original+addition});
}

export class WhitUniversalPresenceV328{
  constructor({
    presence=globalThis.divinaWhitV307?.presence,
    nervousSystem=globalThis.divinaWhitV308?.nervousSystem,
    silentPresence=globalThis.divinaWhitV316?.silentPresence,
    generationBridge=globalThis.divinaWhitV313?.generationBridge,
    go=globalThis.orbe?.go
  }={}){
    this.presence=presence||null;
    this.nervousSystem=nervousSystem||null;
    this.silentPresence=silentPresence||null;
    this.generationBridge=generationBridge||null;
    this.go=typeof go==='function'?go:null;
    this.route=routeNow();
    this.expanded=false;
    this.destroyed=false;
    this.lastMessage='';
    this.lastShownAt=0;
    this.collapseTimer=0;
    this.routeTimer=0;
    this.visits=new Map();
    this.abort=new AbortController();
    this.htmlObserver=null;
    this.originalPresenceShow=null;
    this.originalGenerationTransport=null;

    installStyle();
    this.mount();
    this.delegateLegacyPresence();
    this.installResponseAlchemy();
    this.bind();
    this.enter(this.route,{initial:true});
    this.syncSilentState();

    document.documentElement.dataset.whitUniversal='v328';
  }

  mount(){
    let root=document.getElementById(ROOT_ID);
    if(!root){
      root=document.createElement('aside');
      root.id=ROOT_ID;
      root.className='whit-universal-v328';
      root.dataset.route=this.route;
      root.dataset.state='resting';
      root.innerHTML=`
        <section class="whit-universal-v328__bubble" id="whitUniversalV328Bubble" aria-hidden="true">
          <button type="button" class="whit-universal-v328__close" data-whit-v328-close aria-label="Fechar mensagem de Whit">×</button>
          <p class="whit-universal-v328__eyebrow">WHIT · PRESENÇA</p>
          <p class="whit-universal-v328__copy" data-whit-v328-copy aria-live="polite"></p>
          <button type="button" class="whit-universal-v328__open" data-whit-v328-open>CONVERSAR COM WHIT <span aria-hidden="true">↗</span></button>
        </section>
        <button type="button" class="whit-universal-v328__orb" data-whit-v328-orb
          aria-label="Whit — abrir presença" aria-expanded="false" aria-controls="whitUniversalV328Bubble">
          <span class="whit-universal-v328__orbit" aria-hidden="true"></span>
          <span class="whit-universal-v328__skin" aria-hidden="true"></span>
          <span class="whit-universal-v328__glint" aria-hidden="true"></span>
          <span class="whit-universal-v328__pulse" aria-hidden="true"></span>
        </button>`;
      document.body.append(root);
    }
    this.root=root;
    this.bubble=root.querySelector('.whit-universal-v328__bubble');
    this.copy=root.querySelector('[data-whit-v328-copy]');
    this.orb=root.querySelector('[data-whit-v328-orb]');
    this.openButton=root.querySelector('[data-whit-v328-open]');
    this.closeButton=root.querySelector('[data-whit-v328-close]');
  }

  delegateLegacyPresence(){
    const legacy=document.getElementById('whitPresenceV307');
    if(legacy)legacy.classList.add('whit-v328-delegated');

    if(!this.presence||typeof this.presence.show!=='function'||this.presence[INSTANCE_MARK])return;

    this.originalPresenceShow=this.presence.show.bind(this.presence);
    this.presence.show=(message,options={})=>{
      const result=this.originalPresenceShow(message,options);
      const tone=clean(options?.tone||routeNow(),40);
      const route=SAFE_ROUTES.has(tone)?tone:routeNow();
      const original=clean(message,240);
      const translated=LEGACY_ROUTE_MESSAGES.has(original)
        ? nextWhisper(route,this.visits)
        : original;
      if(translated){
        this.say(translated,{
          route,
          duration:Number(options?.duration)||3600,
          source:LEGACY_ROUTE_MESSAGES.has(original)?'route':'existing-presence'
        });
      }
      return result;
    };
    try{Object.defineProperty(this.presence,INSTANCE_MARK,{value:this,configurable:true});}catch{}
  }

  installResponseAlchemy(){
    const bridge=this.generationBridge;
    if(!bridge||typeof bridge.originalAIChat!=='function'||bridge[GENERATION_MARK])return false;

    this.originalGenerationTransport=bridge.originalAIChat;
    const original=this.originalGenerationTransport;
    bridge.originalAIChat=(payload,signal)=>original(appendResponseStyle(payload),signal);

    try{Object.defineProperty(bridge,GENERATION_MARK,{value:this,configurable:true});}catch{}
    document.documentElement.dataset.whitResponseAlchemy='v328';
    return true;
  }

  bind(){
    const signal=this.abort.signal;

    this.orb?.addEventListener('click',()=>{
      if(this.expanded)this.collapse();
      else this.say(this.lastMessage||nextWhisper(this.route,this.visits),{
        route:this.route,duration:6200,source:'tap'
      });
    },{signal});

    this.openButton?.addEventListener('click',()=>{
      this.collapse();
      this.go?.('ai');
    },{signal});

    this.closeButton?.addEventListener('click',()=>this.collapse(),{signal});

    document.addEventListener('divina:route-ready',event=>{
      this.enter(event.detail?.id||routeNow());
    },{signal});

    document.addEventListener('divina:page-ready',event=>{
      if(event.detail?.id)this.enter(event.detail.id,{pageReady:true});
    },{signal});

    addEventListener('whit:nerve',event=>{
      const kind=clean(event.detail?.kind,60);
      this.root.dataset.nerve=kind||'signal';
      this.pulse();
    },{signal});

    addEventListener('whit:generation-bridge',()=>{
      this.setState('reflecting');
      if(this.route==='ai'&&this.expanded)this.setCopy('Estou refletindo com você…');
    },{signal});

    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='hidden'){
        this.root.dataset.visibility='hidden';
        this.collapse(true);
      }else{
        this.root.dataset.visibility='visible';
        this.syncSilentState();
      }
    },{signal});

    this.htmlObserver=new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='data-whit-silent-state'))this.syncSilentState();
    });
    this.htmlObserver.observe(document.documentElement,{
      attributes:true,
      attributeFilter:['data-whit-silent-state']
    });
  }

  enter(rawRoute,{initial=false,pageReady=false}={}){
    if(this.destroyed)return;
    const route=SAFE_ROUTES.has(rawRoute)?rawRoute:routeNow();
    if(route===this.route&&pageReady&&!initial)return;

    this.route=route;
    this.root.dataset.route=route;
    this.collapse(true);
    clearTimeout(this.routeTimer);

    if(route==='home'){
      this.lastMessage=nextWhisper('home',this.visits);
      return;
    }

    this.routeTimer=setTimeout(()=>{
      if(this.destroyed||this.route!==route||this.expanded)return;
      const now=performance.now?.()||Date.now();
      if(now-this.lastShownAt<2200)return;
      this.say(nextWhisper(route,this.visits),{
        route,duration:3600,source:'route-fallback'
      });
    },initial?1100:760);
  }

  setCopy(message){
    const text=clean(message,240);
    if(!text)return false;
    this.lastMessage=text;
    if(this.copy)this.copy.textContent=text;
    return true;
  }

  say(message,{route=this.route,duration=3800,source='local'}={}){
    if(this.destroyed||!this.root||!this.setCopy(message))return false;
    clearTimeout(this.collapseTimer);
    clearTimeout(this.routeTimer);

    this.route=SAFE_ROUTES.has(route)?route:this.route;
    this.root.dataset.route=this.route;
    this.root.dataset.source=clean(source,40)||'local';
    this.root.classList.add('is-expanded');
    this.bubble?.setAttribute('aria-hidden','false');
    this.orb?.setAttribute('aria-expanded','true');
    this.expanded=true;
    this.lastShownAt=performance.now?.()||Date.now();
    this.pulse();

    this.collapseTimer=setTimeout(()=>this.collapse(),Math.max(1800,Number(duration)||3800));
    return true;
  }

  collapse(immediate=false){
    clearTimeout(this.collapseTimer);
    this.expanded=false;
    if(immediate)this.root.classList.add('no-transition');
    this.root.classList.remove('is-expanded');
    this.bubble?.setAttribute('aria-hidden','true');
    this.orb?.setAttribute('aria-expanded','false');
    if(immediate)requestAnimationFrame(()=>this.root?.classList.remove('no-transition'));
  }

  pulse(){
    if(!this.root)return;
    this.root.classList.remove('whit-v328-pulse');
    requestAnimationFrame(()=>{
      this.root.classList.add('whit-v328-pulse');
      setTimeout(()=>this.root?.classList.remove('whit-v328-pulse'),760);
    });
  }

  syncSilentState(){
    const state=clean(document.documentElement.dataset.whitSilentState||'resting',24);
    this.setState(['resting','reflecting','answering'].includes(state)?state:'resting');
  }

  setState(state){
    const next=['resting','reflecting','answering'].includes(state)?state:'resting';
    this.root.dataset.state=next;
    if(next==='answering')this.pulse();
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      route:this.route,
      expanded:this.expanded,
      persistentOrb:true,
      local:true,
      apiUsedByPresence:false,
      privateReads:false,
      audio:false,
      voice:false,
      generationCallsAdded:0,
      responseAlchemyInstalled:Boolean(this.generationBridge?.[GENERATION_MARK]),
      delegatesPresenceV307:true,
      nervousSystemV308Reused:true,
      generationBridgeV313Reused:true,
      silentStateV316Reused:true
    });
  }

  destroy(){
    this.destroyed=true;
    this.abort.abort();
    clearTimeout(this.collapseTimer);
    clearTimeout(this.routeTimer);
    this.htmlObserver?.disconnect();

    if(this.presence&&this.originalPresenceShow){
      this.presence.show=this.originalPresenceShow;
      try{delete this.presence[INSTANCE_MARK];}catch{}
    }
    if(this.generationBridge&&this.originalGenerationTransport){
      this.generationBridge.originalAIChat=this.originalGenerationTransport;
      try{delete this.generationBridge[GENERATION_MARK];}catch{}
    }

    document.getElementById('whitPresenceV307')?.classList.remove('whit-v328-delegated');
    this.root?.remove();
    delete document.documentElement.dataset.whitUniversal;
    delete document.documentElement.dataset.whitResponseAlchemy;
  }
}

export function installWhitUniversalPresenceV328(options={}){
  if(globalThis[INSTANCE_MARK])return globalThis[INSTANCE_MARK];
  const instance=new WhitUniversalPresenceV328(options);
  globalThis[INSTANCE_MARK]=instance;
  globalThis.divinaWhitV328=instance;
  document.dispatchEvent(new CustomEvent('divina:whit-universal-ready',{
    detail:Object.freeze({
      release:RELEASE,persistentOrb:true,privateReads:false,extraApiCalls:0,responseAlchemy:true
    })
  }));
  return instance;
}
