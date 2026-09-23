/* DIVINA BRUXA — WORK13 · V628 · NOTIFICAÇÕES · SINAIS DO COSMOS
   Um sinal só nasce depois de uma escolha explícita. Nenhum conteúdo íntimo,
   carta ou conversa é usado para segmentar, medir ou preencher notificações. */

export const NOTIFICATIONS_CONTRACT_V628 = Object.freeze({
  version:628,
  work:'WORK13',
  stage:'renovacao-dos-mundos-15-notificacoes',
  world:'sinais-do-cosmos',
  masterDefault:false,
  permission:'after-explicit-gesture',
  preferences:'local-device-only',
  quietHours:Object.freeze({start:'22:00',end:'08:00',timeZone:'America/Sao_Paulo'}),
  dailyCardReveal:false,
  privateSegmentation:false,
  marketingDefault:false,
  providerPush:false,
  automaticSend:false,
  automaticSchedule:false,
  localTestOnly:true,
  oneOrb:true,
  extraCanvas:0,
  work14:false
});

export const NOTIFICATION_CATEGORIES_V628 = Object.freeze([
  ['daily','Carta do Dia','Um convite discreto, sem revelar sua carta.','daily'],
  ['school','Escola','Aulas, trilhas e marcos que você escolheu acompanhar.','school'],
  ['consultations','Consultas','Lembretes operacionais sobre seus atendimentos.','consultations'],
  ['account','Conta e segurança','Acessos, proteção e avisos importantes da conta.','login'],
  ['billing','Pagamentos','Confirmações e avisos sobre cobranças autorizadas.','subscriptions'],
  ['orb','Orbe IA','Créditos e recursos da Orbe, nunca o conteúdo da conversa.','ai'],
  ['music','Música','Novidades do Palco das Estrelas.','music'],
  ['episodes','Episódios e Memojis','Novos episódios e Memojis publicados.','videos'],
  ['skins','Skins','Novos universos visuais e direitos disponíveis.','skins'],
  ['marketing','Novidades e ofertas','Comunicações opcionais, sempre separadas.','home']
].map(Object.freeze));

const STORAGE_KEY='divina.notifications.preferences.v628';
const ALLOWED_TARGETS=new Set(['home','tarot','daily','library','spreads','school','journal','consultations','store','login','subscriptions','ai','music','videos','skins','notifications']);
const SIGNAL_STATES=new Set(['idle','unread','read','action-completed']);

export function safeNotificationTargetV628(value){
  const target=String(value||'').trim().toLowerCase();
  return ALLOWED_TARGETS.has(target)?target:'notifications';
}

export function normalizeNotificationPhaseV628(value){
  const phase=String(value||'').trim().toLowerCase();
  return ['arrival','choice','saved','tested','silence'].includes(phase)?phase:'arrival';
}

export function nextNotificationPhaseV628(current,event){
  const phase=normalizeNotificationPhaseV628(current);
  const action=String(event||'').trim().toLowerCase();
  if(action==='open')return 'choice';
  if(action==='save')return 'saved';
  if(action==='test')return 'tested';
  if(action==='close')return 'silence';
  return phase;
}

export function nextSignalStateV628(current,event){
  const state=SIGNAL_STATES.has(current)?current:'idle';
  const action=String(event||'').trim().toLowerCase();
  if(action==='receive')return 'unread';
  if(action==='open'&&state==='unread')return 'read';
  if(action==='arrive'&&(state==='read'||state==='action-completed'))return 'action-completed';
  if(action==='clear')return 'idle';
  return state;
}

const defaultPreferences=()=>({
  master:false,
  categories:Object.fromEntries(NOTIFICATION_CATEGORIES_V628.map(([id])=>[id,false])),
  quietStart:'22:00',
  quietEnd:'08:00',
  timeZone:'America/Sao_Paulo',
  updatedAt:null
});

const cleanTime=(value,fallback)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value||''))?String(value):fallback;

export class NotificationsWorldV628{
  constructor(root,go,options={}){
    this.root=root;
    this.go=typeof go==='function'?go:()=>{};
    this.orbCore=options.orbCore||globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme||null;
    this.phase='arrival';
    this.signalState='idle';
    this.expectedTarget=null;
    this.open=false;
    this.preferences=this.readPreferences();
    this.abort=new AbortController();
    this.mount();
  }

  readPreferences(){
    const fallback=defaultPreferences();
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(!saved||typeof saved!=='object')return fallback;
      return {
        ...fallback,
        master:saved.master===true,
        categories:Object.fromEntries(NOTIFICATION_CATEGORIES_V628.map(([id])=>[id,saved.categories?.[id]===true])),
        quietStart:cleanTime(saved.quietStart,'22:00'),
        quietEnd:cleanTime(saved.quietEnd,'08:00'),
        updatedAt:typeof saved.updatedAt==='string'?saved.updatedAt:null
      };
    }catch{return fallback;}
  }

  permission(){
    if(!('Notification' in globalThis))return 'indisponível';
    return Notification.permission==='granted'?'permitida':Notification.permission==='denied'?'bloqueada':'não solicitada';
  }

  mount(){
    if(!this.root)return;
    this.root.dataset.notificationsWorld='v628';
    this.root.innerHTML=`
      <div class="nw628" data-phase="arrival">
        <header class="nw628__hero">
          <p class="nw628__eyebrow">NOTIFICAÇÕES · SINAIS DO COSMOS · V628</p>
          <h2>Um sinal quando importa. Silêncio quando você escolhe.</h2>
          <p>Nada é ativado sozinho. Você decide quais sinais deseja receber e pode mudar tudo a qualquer momento.</p>
          <div class="nw628__covenants" aria-label="Compromissos dos Sinais do Cosmos">
            <span>Consentimento explícito</span><span>Silêncio 22h–8h</span><span>Sem conteúdo íntimo</span>
          </div>
          <button class="nw628__primary" type="button" data-nw-action="open">ABRIR MEUS SINAIS</button>
        </header>
        <section class="nw628__panel" data-nw-panel hidden aria-labelledby="nw628Title">
          <div class="nw628__panel-head"><div><p class="nw628__eyebrow">SUAS ESCOLHAS</p><h3 id="nw628Title">Quais sinais podem chegar?</h3></div><button class="nw628__close" type="button" data-nw-action="close" aria-label="Fechar escolhas">×</button></div>
          <label class="nw628__master"><span><strong>Permitir Sinais do Cosmos</strong><small>Este é o interruptor principal. Começa desligado.</small></span><input type="checkbox" data-nw-master></label>
          <div class="nw628__permission"><span>Permissão deste aparelho</span><strong data-nw-permission></strong><button type="button" data-nw-action="permission">PEDIR PERMISSÃO</button></div>
          <fieldset class="nw628__categories"><legend>Escolha por categoria</legend>${NOTIFICATION_CATEGORIES_V628.map(([id,title,description])=>`<label data-category="${id}"><span><strong>${title}</strong><small>${description}</small></span><input type="checkbox" data-nw-category="${id}"></label>`).join('')}</fieldset>
          <fieldset class="nw628__quiet"><legend>Horário de silêncio · São Paulo</legend><label>De <input type="time" data-nw-quiet-start value="22:00"></label><label>até <input type="time" data-nw-quiet-end value="08:00"></label><p>Nesse intervalo, sinais não urgentes permanecem em silêncio.</p></fieldset>
          <aside class="nw628__privacy"><strong>O que nunca entra aqui</strong><p>Diário, perguntas, tiragens, cartas, conversas com Whit e notas privadas não são lidos nem usados para segmentação.</p></aside>
          <div class="nw628__actions"><button class="nw628__primary" type="button" data-nw-action="save">SALVAR ESCOLHAS</button><button class="nw628__secondary" type="button" data-nw-action="test">TESTAR NESTE APARELHO</button></div>
        </section>
        <p class="nw628__status" role="status" aria-live="polite" data-nw-status></p>
      </div>`;
    this.bind();
    this.sync();
  }

  bind(){
    const {signal}=this.abort;
    this.root.addEventListener('click',event=>{
      const action=event.target.closest('[data-nw-action]')?.dataset.nwAction;
      if(!action)return;
      if(action==='open')this.openChoices();
      if(action==='close')this.closeChoices();
      if(action==='permission')this.requestPermission();
      if(action==='save')this.save();
      if(action==='test')this.testLocal();
    },{signal});
    this.root.querySelector('[data-nw-master]')?.addEventListener('change',event=>{
      this.preferences.master=event.target.checked;
      this.syncDisabled();
    },{signal});
    document.addEventListener('divina:notification-opened',event=>{
      this.expectedTarget=safeNotificationTargetV628(event.detail?.target);
      this.signalState=nextSignalStateV628('unread','open');
      this.syncStatus('Sinal aberto. Levando você ao lugar certo…');
    },{signal});
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate'].forEach(type=>document.addEventListener(type,event=>{
      const route=safeNotificationTargetV628(event.detail?.id||event.detail?.target||document.body?.dataset.screen);
      if(this.expectedTarget&&route===this.expectedTarget){
        this.signalState=nextSignalStateV628(this.signalState,'arrive');
        this.expectedTarget=null;
      }
    },{signal}));
    addEventListener('online',()=>this.syncStatus('Você está online. Suas escolhas continuam neste aparelho.'),{signal});
    addEventListener('offline',()=>this.syncStatus('Sem conexão. Suas escolhas locais continuam protegidas.'),{signal});
  }

  openChoices(){
    this.open=true;
    this.phase=nextNotificationPhaseV628(this.phase,'open');
    this.root.querySelector('[data-nw-panel]').hidden=false;
    this.root.querySelector('.nw628').dataset.phase=this.phase;
    this.sync();
    requestAnimationFrame(()=>this.root.querySelector('[data-nw-master]')?.focus());
  }

  closeChoices(){
    this.open=false;
    this.phase=nextNotificationPhaseV628(this.phase,'close');
    this.root.querySelector('[data-nw-panel]').hidden=true;
    this.root.querySelector('.nw628').dataset.phase=this.phase;
    this.root.querySelector('[data-nw-action="open"]')?.focus();
  }

  async requestPermission(){
    if(!('Notification' in globalThis)){this.syncStatus('Este navegador não oferece notificações. Suas preferências ainda podem ser salvas.');return;}
    if(Notification.permission==='denied'){this.syncStatus('A permissão está bloqueada no navegador. Você pode alterá-la nos ajustes do site.');return;}
    try{
      const result=await Notification.requestPermission();
      this.sync();
      this.syncStatus(result==='granted'?'Permissão concedida neste aparelho. Nenhum envio automático foi ativado.':'Permissão não concedida. Nada será enviado.');
    }catch{this.syncStatus('Não foi possível pedir permissão agora. Tente novamente quando desejar.');}
  }

  collect(){
    this.preferences.master=this.root.querySelector('[data-nw-master]')?.checked===true;
    NOTIFICATION_CATEGORIES_V628.forEach(([id])=>{this.preferences.categories[id]=this.root.querySelector(`[data-nw-category="${id}"]`)?.checked===true;});
    this.preferences.quietStart=cleanTime(this.root.querySelector('[data-nw-quiet-start]')?.value,'22:00');
    this.preferences.quietEnd=cleanTime(this.root.querySelector('[data-nw-quiet-end]')?.value,'08:00');
    this.preferences.updatedAt=new Date().toISOString();
  }

  save(){
    this.collect();
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(this.preferences));}
    catch{this.syncStatus('O navegador não permitiu salvar neste aparelho. Nenhum dado foi enviado.');return;}
    this.phase=nextNotificationPhaseV628(this.phase,'save');
    this.root.querySelector('.nw628').dataset.phase=this.phase;
    this.syncStatus(this.preferences.master?'Escolhas salvas neste aparelho. O envio real permanece desligado até existir uma fonte autorizada.':'Escolhas salvas. Os Sinais do Cosmos continuam desligados.');
    document.dispatchEvent(new CustomEvent('divina:notifications-preferences-saved',{detail:{version:628,master:this.preferences.master,localOnly:true}}));
  }

  testLocal(){
    this.collect();
    if(!this.preferences.master){this.syncStatus('Ative o interruptor principal antes de testar.');return;}
    const selected=NOTIFICATION_CATEGORIES_V628.find(([id])=>this.preferences.categories[id]);
    if(!selected){this.syncStatus('Escolha pelo menos uma categoria antes de testar.');return;}
    if(!('Notification' in globalThis)||Notification.permission!=='granted'){this.syncStatus('Conceda a permissão deste aparelho para fazer um teste local.');return;}
    const [,title,,target]=selected;
    const body=selected[0]==='daily'?'Sua presença foi lembrada. Abra quando quiser descobrir a mensagem do dia.':`Um teste local de ${title}. Nenhum sinal foi enviado por servidor.`;
    const notification=new Notification('Divina Bruxa · Sinais do Cosmos',{body,tag:'divina-v628-local-test',renotify:false,silent:true});
    this.signalState=nextSignalStateV628(this.signalState,'receive');
    notification.onclick=()=>{
      notification.close();
      this.signalState=nextSignalStateV628(this.signalState,'open');
      this.expectedTarget=safeNotificationTargetV628(target);
      globalThis.focus?.();
      this.go(this.expectedTarget);
    };
    this.phase=nextNotificationPhaseV628(this.phase,'test');
    this.syncStatus('Teste local criado. A Carta do Dia nunca revela a carta na notificação.');
  }

  syncDisabled(){
    const enabled=this.root.querySelector('[data-nw-master]')?.checked===true;
    this.root.querySelectorAll('[data-nw-category]').forEach(input=>{input.disabled=!enabled;});
  }

  sync(){
    const master=this.root.querySelector('[data-nw-master]');
    if(master)master.checked=this.preferences.master;
    NOTIFICATION_CATEGORIES_V628.forEach(([id])=>{const input=this.root.querySelector(`[data-nw-category="${id}"]`);if(input)input.checked=this.preferences.categories[id];});
    const start=this.root.querySelector('[data-nw-quiet-start]');if(start)start.value=this.preferences.quietStart;
    const end=this.root.querySelector('[data-nw-quiet-end]');if(end)end.value=this.preferences.quietEnd;
    const permission=this.root.querySelector('[data-nw-permission]');if(permission)permission.textContent=this.permission();
    this.syncDisabled();
    this.syncStatus(this.preferences.master?'Sinais escolhidos neste aparelho.':'Sinais desligados por padrão.');
  }

  syncStatus(message){const node=this.root?.querySelector('[data-nw-status]');if(node)node.textContent=message;}

  status(){
    return {version:628,phase:this.phase,open:this.open,signalState:this.signalState,master:this.preferences.master,permission:this.permission(),localOnly:true,providerPush:false,automaticSend:false,contract:NOTIFICATIONS_CONTRACT_V628};
  }

  destroy(){this.abort.abort();this.root?.removeAttribute('data-notifications-world');}
}

export function createNotificationsWorldV628(root,go,options={}){
  const existing=globalThis.divinaWork13NotificationsInstanceV628;
  if(existing?.root===root)return existing;
  existing?.destroy?.();
  const instance=new NotificationsWorldV628(root,go,options);
  globalThis.divinaWork13NotificationsInstanceV628=instance;
  globalThis.divinaWork13NotificationsWorldV628=instance;
  return instance;
}

export default createNotificationsWorldV628;
