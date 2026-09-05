/* DIVINA BRUXA — SANTUÁRIO DAS CONSULTAS V147
   Jornada móvel, agenda STAGING, price snapshot e alternativa exclusiva por e-mail. */
import { store, escapeHTML } from './storage.js';
import { CONSULTATION_POLICY, consultationById, consultationPriceSnapshot } from './consultation-policy.js?v=147';

const DRAFT_KEY='consultation-draft-v147';
const LEGACY_DRAFT_KEYS=Object.freeze(['consultation-draft-v143','consultation-draft-v5']);
const REQUESTS_KEY='consultation-requests-v147';
const LEGACY_REQUESTS_KEY='consultation-requests-v143';
const CATALOG_KEY='consultation-catalog-v147';
const TIMEZONE=CONSULTATION_POLICY.timezone;
const STEP_INDEX=Object.freeze({services:0,schedule:1,details:2,review:3,success:4});
const moneyCents=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format((Number(value)||0)/100);
const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const emit=message=>dispatchEvent(new CustomEvent('orbe:toast',{detail:message}));
const requestId=()=>globalThis.crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,char=>{const value=Math.random()*16|0;return (char==='x'?value:(value&3)|8).toString(16);});
const clean=value=>String(value??'').trim();
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
const validPhone=value=>{const digits=clean(value).replace(/\D/g,'');return digits.length>=10&&digits.length<=15;};
const validPrice=value=>Number.isInteger(Number(value))&&Number(value)>=100&&Number(value)<=500000;
const safeGet=(key,fallback)=>{try{return store.get(key,fallback);}catch{return fallback;}};
const safeSet=(key,value)=>{try{store.set(key,value);return true;}catch{return false;}};
const safeRemove=key=>{try{store.remove(key);}catch{}}
const dateParts=value=>{
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return null;
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).filter(item=>item.type!=='literal').map(item=>[item.type,item.value]));
  return {date,key:`${parts.year}-${parts.month}-${parts.day}`};
};
const dayKey=value=>dateParts(value)?.key||'';
const formatDay=value=>new Intl.DateTimeFormat('pt-BR',{timeZone:TIMEZONE,weekday:'short',day:'2-digit',month:'short'}).format(new Date(value)).replaceAll('.','');
const formatTime=value=>new Intl.DateTimeFormat('pt-BR',{timeZone:TIMEZONE,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const formatSlot=value=>new Intl.DateTimeFormat('pt-BR',{timeZone:TIMEZONE,weekday:'long',day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const manualDateLabel=value=>{const [year,month,day]=clean(value).split('-');return year&&month&&day?`${day}/${month}/${year}`:'';};
const errorMessages=Object.freeze({
  SLOT_UNAVAILABLE:'Esse horário acabou de ser escolhido. Selecione outro horário.',
  INVALID_SLOT:'Esse horário não está mais disponível. Escolha outro.',
  HOLD_EXPIRED:'A reserva temporária expirou. Escolha o horário novamente.',
  INVALID_NAME:'Revise o nome informado.',
  INVALID_EMAIL:'Revise o endereço de e-mail.',
  INVALID_PHONE:'Revise o telefone com DDD.',
  INVALID_CONTEXT:'Conte um pouco mais sobre a sua pergunta.',
  CONSENT_REQUIRED:'Confirme as três declarações para continuar.',
  SERVICE_UNAVAILABLE:'Esta consulta está temporariamente indisponível.',
  RATE_LIMITED:'Muitas tentativas foram feitas. Aguarde alguns minutos e tente novamente.'
});

export class ConsultationEngine{
  constructor(root,config={}){
    this.root=root;
    if(!root)return;
    this.root.onclick=null;
    this.config=config||{};
    this.apiBase=clean(this.config.consultationsApiBase).replace(/\/$/,'');
    const current=safeGet(DRAFT_KEY,null);
    const legacy=LEGACY_DRAFT_KEYS.map(key=>safeGet(key,null)).find(Boolean)||{};
    this.draft={...(legacy||{}),...(current||{})};
    this.draft.preferredDate=this.draft.preferredDate||this.draft.date||'';
    this.draft.preferredPeriod=this.draft.preferredPeriod||this.draft.period||'';
    this.selected=consultationById(this.draft.serviceId)?.id||'';
    this.step=this.selected?'schedule':'services';
    this.catalog=new Map();
    this.catalogVersion=CONSULTATION_POLICY.priceTableVersion;
    this.apiState=this.apiBase?'loading':'disabled';
    this.apiMessage='';
    this.slots=[];
    this.activeDay='';
    this.useEmailFallback=!this.apiBase;
    this.pendingPayload=null;
    this.submitting=false;
    this.submitError='';
    this.success=null;
    this.restoreCachedCatalog();
    this.render();
    if(this.apiBase)this.loadAvailability();
  }

  restoreCachedCatalog(){
    const cached=safeGet(CATALOG_KEY,null);
    if(!cached||!Array.isArray(cached.services)||!cached.savedAt)return;
    const age=Date.now()-new Date(cached.savedAt).getTime();
    if(!Number.isFinite(age)||age>7*24*60*60*1000)return;
    if(this.applyCatalog(cached.services,cached.priceTableVersion))this.apiState=this.apiBase?'loading':'cached';
  }

  applyCatalog(rows,version){
    const next=new Map();
    for(const local of CONSULTATION_POLICY.services){
      const remote=rows.find(row=>clean(row?.service_key)===local.id);
      if(!remote||!validPrice(remote.price_brl_cents))return false;
      next.set(local.id,Object.freeze({...local,price:Number(remote.price_brl_cents)/100,priceCents:Number(remote.price_brl_cents)}));
    }
    this.catalog=next;
    this.catalogVersion=clean(version)||CONSULTATION_POLICY.priceTableVersion;
    return true;
  }

  services(){return CONSULTATION_POLICY.services.map(service=>this.catalog.get(service.id)||service);}
  service(){return this.services().find(service=>service.id===this.selected)||null;}
  requests(){
    const latest=safeGet(REQUESTS_KEY,null);
    if(Array.isArray(latest))return latest;
    const legacy=safeGet(LEGACY_REQUESTS_KEY,[]);
    return Array.isArray(legacy)?legacy:[];
  }

  async loadAvailability(){
    if(!this.apiBase)return;
    this.apiState='loading';
    this.apiMessage='Conectando à agenda segura…';
    this.saveDetails();
    this.render();
    try{
      const payload=await this.request(this.apiBase,{method:'GET'});
      if(payload?.ok!==true||payload?.environment!=='staging'||payload?.rules?.realBilling!==false||!Array.isArray(payload.services)||!Array.isArray(payload.slots))throw new Error('INVALID_CATALOG');
      if(!this.applyCatalog(payload.services,payload.priceTableVersion))throw new Error('INVALID_CATALOG');
      this.slots=payload.slots.map(slot=>({start:clean(slot?.slot_start_at||slot?.start),end:clean(slot?.slot_end_at||slot?.end)})).filter(slot=>dayKey(slot.start)&&new Date(slot.start)>new Date());
      if(this.draft.slotStartAt&&!this.slots.some(slot=>slot.start===this.draft.slotStartAt))this.draft.slotStartAt='';
      this.activeDay=dayKey(this.draft.slotStartAt)||this.activeDay||dayKey(this.slots[0]?.start);
      this.apiState='ready';
      this.apiMessage=this.slots.length?'Agenda atualizada. Escolha o horário que prefere.':'Não há horários livres agora; a solicitação por e-mail continua disponível.';
      this.useEmailFallback=!this.slots.length;
      safeSet(CATALOG_KEY,{services:payload.services,priceTableVersion:this.catalogVersion,savedAt:new Date().toISOString()});
    }catch(error){
      this.apiState=error?.message==='INVALID_CATALOG'?'mismatch':'offline';
      this.apiMessage=this.apiState==='mismatch'?'O catálogo online está sendo sincronizado. Os valores exibidos permanecem protegidos.':'A agenda não respondeu. Você pode continuar pelo e-mail oficial.';
      this.slots=[];
      this.useEmailFallback=true;
    }
    this.render();
  }

  async request(url,options={}){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(url,{...options,credentials:'omit',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});
      let body={};
      try{body=await response.json();}catch{}
      if(!response.ok||body?.ok===false){const error=new Error(clean(body?.code)||`HTTP_${response.status}`);error.code=clean(body?.code)||`HTTP_${response.status}`;throw error;}
      return body;
    }finally{clearTimeout(timer);}
  }

  apiStatus(){
    if(this.apiState==='ready')return {className:'is-online',label:'AGENDA STAGING CONECTADA'};
    if(this.apiState==='loading')return {className:'is-loading',label:'CONECTANDO À AGENDA'};
    if(this.apiState==='mismatch')return {className:'is-protected',label:'VALORES PROTEGIDOS'};
    return {className:'is-email',label:'SOLICITAÇÃO POR E-MAIL'};
  }

  stepperMarkup(){
    const current=STEP_INDEX[this.step]??0;
    const steps=[['Consulta','services'],['Horário','schedule'],['Dados','details'],['Revisão','review']];
    return `<nav class="consultation-steps" aria-label="Etapas da solicitação">${steps.map(([label,id],index)=>`<span class="${index===current?'is-current':index<current?'is-complete':''}"${index===current?' aria-current="step"':''}><b>${index<current?'✓':index+1}</b><small>${label}</small></span>${index<steps.length-1?'<i aria-hidden="true"></i>':''}`).join('')}</nav>`;
  }

  sanctuaryMarkup(){
    const status=this.apiStatus(),requests=this.requests(),last=requests[0];
    return `<section class="consultation-sanctuary" aria-labelledby="consultationSanctuaryTitle">
      <div class="consultation-sanctuary-copy">
        <p class="eyebrow">ATENDIMENTO HUMANO · PRIVADO</p>
        <h3 id="consultationSanctuaryTitle">Sua pergunta merece presença.</h3>
        <p>Escolha a consulta, indique sua preferência e revise cada detalhe. A confirmação acontece pelo e-mail oficial e nenhuma cobrança é feita nesta etapa.</p>
        <div class="consultation-sanctuary-badges"><span>◇ QUATRO LEITURAS</span><span>◇ DE R$ 50 A R$ 250</span><span>◇ SEM CRÉDITOS DE IA</span></div>
      </div>
      <aside class="consultation-sanctuary-seal" aria-label="${requests.length?`${requests.length} solicitações registradas neste aparelho`:'Quatro consultas disponíveis'}"><span aria-hidden="true">☾</span><b>${requests.length||4}</b><small>${requests.length?'neste aparelho':'consultas'}</small></aside>
      <div class="consultation-connection ${status.className}" role="status" aria-live="polite"><i aria-hidden="true"></i><span>${status.label}</span>${last?.protocol?`<small>Último protocolo: ${escapeHTML(last.protocol)}</small>`:'<small>Nenhuma cobrança automática</small>'}</div>
    </section>`;
  }

  serviceCard(service,index){
    const featured=index===0;
    return `<button type="button" class="consultation-v147-service${featured?' is-featured':''}" data-service="${escapeHTML(service.id)}" aria-describedby="service-${escapeHTML(service.id)}-detail">
      <span class="consultation-service-number">0${index+1}</span>${featured?'<em>MAIS COMPLETA</em>':''}
      <i aria-hidden="true">${service.sigil}</i>
      <small>${escapeHTML(service.duration)}</small>
      <h3>${escapeHTML(service.name)}</h3>
      <p id="service-${escapeHTML(service.id)}-detail">${escapeHTML(service.detail)}</p>
      <span class="consultation-ideal">${escapeHTML(service.idealFor)}</span>
      <ul>${service.includes.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>
      <strong>${moneyCents(service.priceCents)}</strong>
      <b>ESCOLHER ESTA CONSULTA <span aria-hidden="true">→</span></b>
    </button>`;
  }

  servicesMarkup(){
    return `<section class="consultation-flow-stage consultation-services-stage" aria-labelledby="consultationServicesTitle">
      <header class="consultation-flow-heading"><div><p class="eyebrow">ETAPA 1 · ESCOLHA</p><h3 id="consultationServicesTitle">Qual leitura acolhe o seu momento?</h3><p>Os valores abaixo são individuais e ficam preservados no pedido.</p></div><span>4 opções</span></header>
      <div class="consultation-v147-services">${this.services().map((service,index)=>this.serviceCard(service,index)).join('')}</div>
    </section>`;
  }

  selectedHeader(service,kicker,title){
    return `<header class="consultation-selected-head"><div><p class="eyebrow">${escapeHTML(kicker)}</p><h3>${escapeHTML(title)}</h3><span><b>${escapeHTML(service.name)}</b> · ${moneyCents(service.priceCents)}</span></div><button type="button" class="consultation-quiet-button" data-change-service>TROCAR CONSULTA</button></header>`;
  }

  scheduleMarkup(service){
    const days=[...new Set(this.slots.map(slot=>dayKey(slot.start)).filter(Boolean))].slice(0,8);
    if(!this.activeDay&&days.length)this.activeDay=days[0];
    const daySlots=this.slots.filter(slot=>dayKey(slot.start)===this.activeDay);
    const usingOnline=this.apiState==='ready'&&this.slots.length&&!this.useEmailFallback;
    let body='';
    if(this.apiState==='loading'&&!this.useEmailFallback){
      body=`<div class="consultation-schedule-loading" role="status"><span></span><span></span><span></span><p>Consultando os próximos horários…</p></div><button type="button" class="consultation-link-button" data-use-email>PREFIRO CONTINUAR POR E-MAIL</button>`;
    }else if(usingOnline){
      body=`<div class="consultation-day-picker" role="group" aria-label="Escolha o dia">${days.map(day=>{const first=this.slots.find(slot=>dayKey(slot.start)===day);return `<button type="button" data-day="${day}" aria-pressed="${day===this.activeDay}" class="${day===this.activeDay?'is-selected':''}">${escapeHTML(formatDay(first.start))}</button>`;}).join('')}</div>
      <div class="consultation-time-picker" role="group" aria-label="Escolha o horário">${daySlots.map(slot=>`<button type="button" data-slot="${escapeHTML(slot.start)}" aria-pressed="${slot.start===this.draft.slotStartAt}" class="${slot.start===this.draft.slotStartAt?'is-selected':''}"><span>${escapeHTML(formatTime(slot.start))}</span><small>horário de Brasília</small></button>`).join('')}</div>
      <p class="consultation-schedule-note"><span aria-hidden="true">◇</span> O horário é uma preferência e será reservado no STAGING somente ao enviar a solicitação.</p>`;
    }else{
      const value=name=>escapeHTML(this.draft[name]||'');
      body=`<div class="consultation-email-fallback"><span aria-hidden="true">✦</span><div><h4>Continue sem perder o seu pedido.</h4><p>${escapeHTML(this.apiMessage||'Informe uma preferência; a disponibilidade será confirmada pelo e-mail oficial.')}</p></div></div>
      <div class="consultation-preference-grid"><label><span>Data preferida <small>(opcional)</small></span><input name="preferredDate" type="date" value="${value('preferredDate')}"></label><label><span>Período preferido</span><select name="preferredPeriod"><option value="">A combinar</option><option value="Manhã"${this.draft.preferredPeriod==='Manhã'?' selected':''}>Manhã</option><option value="Tarde"${this.draft.preferredPeriod==='Tarde'?' selected':''}>Tarde</option><option value="Noite"${this.draft.preferredPeriod==='Noite'?' selected':''}>Noite</option></select></label></div>
      ${this.apiBase?'<button type="button" class="consultation-link-button" data-retry-agenda>TENTAR CONECTAR À AGENDA NOVAMENTE</button>':''}`;
    }
    return `<section class="consultation-flow-stage consultation-schedule-stage" aria-labelledby="consultationScheduleTitle">
      ${this.selectedHeader(service,'ETAPA 2 · PREFERÊNCIA','Quando você prefere ser atendida?')}
      <div class="consultation-schedule-status ${this.apiState==='ready'?'is-ready':''}" role="status" aria-live="polite"><i aria-hidden="true"></i><span id="consultationScheduleTitle">${escapeHTML(this.apiMessage||'Escolha uma preferência para continuar.')}</span></div>
      ${body}
      <div class="consultation-stage-actions"><button type="button" class="consultation-primary-action" data-continue-schedule${usingOnline&&!this.draft.slotStartAt?' disabled':''}>CONTINUAR PARA OS DADOS <span aria-hidden="true">→</span></button><button type="button" class="consultation-secondary-action" data-back-services>VOLTAR</button></div>
    </section>`;
  }

  scheduleLabel(payload=this.draft){
    if(payload.slotStartAt)return `${formatSlot(payload.slotStartAt)} · horário de Brasília`;
    const date=manualDateLabel(payload.preferredDate);
    if(date&&payload.preferredPeriod)return `${date} · ${payload.preferredPeriod}`;
    if(date)return `${date} · período a combinar`;
    return payload.preferredPeriod||'Data e período a combinar por e-mail';
  }

  detailsMarkup(service){
    const value=name=>escapeHTML(this.draft[name]||'');
    return `<section class="consultation-flow-stage consultation-details-stage" aria-labelledby="consultationDetailsTitle">
      ${this.selectedHeader(service,'ETAPA 3 · SEUS DADOS','Conte o essencial, com calma.')}
      <div class="consultation-choice-recap"><span aria-hidden="true">☾</span><p><small>SUA PREFERÊNCIA</small><b>${escapeHTML(this.scheduleLabel())}</b></p><button type="button" data-back-schedule>ALTERAR</button></div>
      <form class="consultation-v147-form" novalidate>
        <div class="consultation-field-grid">
          <label><span>Nome completo *</span><input name="name" autocomplete="name" required value="${value('name')}" placeholder="Como deseja ser chamada"></label>
          <label><span>E-mail *</span><input name="email" type="email" inputmode="email" autocomplete="email" required value="${value('email')}" placeholder="seu@email.com"></label>
          <label class="consultation-phone"><span>Telefone com DDD *</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${value('phone')}" placeholder="(00) 00000-0000"><small>Usado somente para administrar esta solicitação.</small></label>
          <label class="consultation-question"><span>Pergunta ou contexto *</span><textarea name="question" minlength="10" maxlength="3000" required placeholder="Conte o que deseja compreender, sem incluir senhas, documentos ou dados bancários.">${value('question')}</textarea><small><b data-question-count>${clean(this.draft.question).length}</b>/3000 · rascunho privado neste aparelho</small></label>
        </div>
        <fieldset class="consultation-consents"><legend>Antes de continuar</legend>
          <label><input name="acceptTerms" type="checkbox" value="yes"${this.draft.acceptTerms==='yes'?' checked':''}><span>Confirmo a consulta escolhida, o valor exibido e que esta solicitação ainda não realiza cobrança. *</span></label>
          <label><input name="acceptPrivacy" type="checkbox" value="yes"${this.draft.acceptPrivacy==='yes'?' checked':''}><span>Autorizo o uso destes dados somente para responder e administrar a consulta. *</span></label>
          <label><input name="acceptSymbolic" type="checkbox" value="yes"${this.draft.acceptSymbolic==='yes'?' checked':''}><span>Entendo que a leitura é simbólica e não substitui orientação médica, psicológica, jurídica ou financeira. *</span></label>
        </fieldset>
        <p class="consultation-form-status" data-form-status role="alert" aria-live="assertive">Revise os dados antes de avançar.</p>
        <div class="consultation-stage-actions"><button type="submit" class="consultation-primary-action">REVISAR SOLICITAÇÃO <span aria-hidden="true">→</span></button><button type="button" class="consultation-secondary-action" data-clear-draft>LIMPAR RASCUNHO</button></div>
      </form>
    </section>`;
  }

  reviewMarkup(service){
    const payload=this.pendingPayload;
    if(!payload)return this.detailsMarkup(service);
    const apiMode=this.apiState==='ready'&&payload.slotStartAt&&!this.useEmailFallback;
    return `<section class="consultation-flow-stage consultation-review" aria-labelledby="consultationReviewTitle" aria-busy="${this.submitting}">
      ${this.selectedHeader(service,'ETAPA 4 · REVISÃO','Tudo certo para atravessar o portal?')}
      <div class="consultation-review-price"><small>VALOR PRESERVADO NESTE PEDIDO</small><strong>${moneyCents(payload.price_snapshot.priceCents)}</strong><span>${escapeHTML(payload.price_snapshot.priceTableVersion)}</span></div>
      <dl>
        <div><dt>Consulta</dt><dd>${escapeHTML(service.name)}</dd></div>
        <div><dt>Preferência</dt><dd>${escapeHTML(this.scheduleLabel(payload.preference))}</dd></div>
        <div><dt>Nome</dt><dd>${escapeHTML(payload.customer.name)}</dd></div>
        <div><dt>E-mail</dt><dd>${escapeHTML(payload.customer.email)}</dd></div>
        <div><dt>Telefone</dt><dd>${escapeHTML(payload.customer.phone)}</dd></div>
        <div class="is-wide"><dt>Pergunta ou contexto</dt><dd>${escapeHTML(payload.question)}</dd></div>
      </dl>
      <aside><span aria-hidden="true">◇</span><p><b>${apiMode?'Registro seguro no STAGING.':'Envio pelo seu aplicativo de e-mail.'}</b> ${apiMode?'O horário será reservado e você receberá um protocolo.':'Você poderá revisar novamente a mensagem antes de tocar em Enviar.'} Nenhum cartão será solicitado.</p></aside>
      ${this.submitError?`<p class="consultation-submit-error" role="alert">${escapeHTML(this.submitError)}</p>`:''}
      <div class="consultation-review-actions"><button type="button" class="consultation-primary-action" data-confirm-request${this.submitting?' disabled':''}>${this.submitting?'ENVIANDO COM SEGURANÇA…':apiMode?'ENVIAR SOLICITAÇÃO SEGURA':'ABRIR E-MAIL PARA ENVIAR'}</button><button type="button" class="consultation-secondary-action" data-back-details${this.submitting?' disabled':''}>VOLTAR E EDITAR</button>${apiMode&&this.submitError?'<button type="button" class="consultation-link-button" data-email-fallback>USAR O E-MAIL OFICIAL</button>':''}</div>
    </section>`;
  }

  successMarkup(service){
    const result=this.success;
    if(!result)return this.servicesMarkup();
    const isApi=result.mode==='staging-api';
    return `<section class="consultation-flow-stage consultation-success" aria-labelledby="consultationSuccessTitle">
      <div class="consultation-success-orbit" aria-hidden="true"><i></i><i></i><span>✓</span></div>
      <p class="eyebrow">${isApi?'SOLICITAÇÃO RECEBIDA NO STAGING':'E-MAIL PREPARADO'}</p>
      <h3 id="consultationSuccessTitle">${isApi?'Seu pedido atravessou o portal.':'Falta apenas enviar a mensagem.'}</h3>
      <p>${isApi?'Guarde o protocolo abaixo. A confirmação e os próximos detalhes acontecerão pelo e-mail oficial.':'Seu aplicativo de e-mail foi aberto com todos os dados. Revise a mensagem e toque em Enviar para concluir.'}</p>
      <div class="consultation-protocol"><small>${isApi?'SEU PROTOCOLO':'CÓDIGO DO PEDIDO'}</small><strong>${escapeHTML(result.protocol||result.id)}</strong>${isApi?'<button type="button" data-copy-protocol>COPIAR</button>':''}</div>
      <dl><div><dt>Consulta</dt><dd>${escapeHTML(service?.name||result.serviceName)}</dd></div><div><dt>Valor</dt><dd>${moneyCents(result.priceCents)}</dd></div><div><dt>Preferência</dt><dd>${escapeHTML(result.scheduleLabel)}</dd></div><div><dt>Cobrança</dt><dd>Nenhuma realizada</dd></div></dl>
      <a class="consultation-email-contact" href="mailto:${CONSULTATION_POLICY.contactEmail}"><span aria-hidden="true">✦</span><span><small>SUPORTE E CONFIRMAÇÃO</small><b>${CONSULTATION_POLICY.contactEmail}</b></span></a>
      <button type="button" class="consultation-primary-action" data-new-request>FAZER OUTRA SOLICITAÇÃO</button>
    </section>`;
  }

  boundariesMarkup(){
    return `<section class="consultation-boundaries" aria-labelledby="consultationBoundariesTitle"><div><p class="eyebrow">CLAREZA E SEGURANÇA</p><h3 id="consultationBoundariesTitle">Cada universo permanece separado.</h3><p>Atendimento humano, comunicação direta e limites transparentes.</p></div><ul>${CONSULTATION_POLICY.safeguards.map(item=>`<li><span aria-hidden="true">◇</span>${escapeHTML(item)}</li>`).join('')}</ul><p>Suporte e confirmação: <a href="mailto:${CONSULTATION_POLICY.contactEmail}">${CONSULTATION_POLICY.contactEmail}</a></p></section>
    <section class="consultation-faq" aria-label="Dúvidas frequentes"><details><summary>Quando a consulta é confirmada?<span aria-hidden="true">+</span></summary><p>A solicitação registra sua preferência. A disponibilidade, o formato e o prazo final são confirmados diretamente pelo e-mail oficial.</p></details><details><summary>O site cobra agora?<span aria-hidden="true">+</span></summary><p>Não. Esta versão não pede cartão, não abre checkout e não realiza cobrança automática.</p></details><details><summary>“Leitura de Mentes” acessa pensamentos privados?<span aria-hidden="true">+</span></summary><p>Não. É uma leitura simbólica sobre sinais, padrões e dinâmicas percebidas; não lê pensamentos literalmente.</p></details><details><summary>Está incluída no Premium ou na Orbe IA?<span aria-hidden="true">+</span></summary><p>Não. As consultas são atendimentos humanos independentes e não consomem créditos de IA.</p></details></section>`;
  }

  mobileSummaryMarkup(service){
    if(!service||this.step==='services'||this.step==='success')return '';
    const label={schedule:'ESCOLHA O HORÁRIO',details:'REVISE SEUS DADOS',review:'CONFIRME O PEDIDO'}[this.step]||'CONTINUAR';
    return `<aside class="consultation-mobile-summary"><span><small>${escapeHTML(service.shortName)}</small><b>${moneyCents(service.priceCents)}</b></span><em>${label}</em></aside>`;
  }

  render(){
    if(!this.root)return;
    const service=this.service();
    if(this.selected&&!service){this.selected='';this.step='services';}
    const flow=this.step==='services'?this.servicesMarkup():this.step==='schedule'?this.scheduleMarkup(service):this.step==='details'?this.detailsMarkup(service):this.step==='review'?this.reviewMarkup(service):this.successMarkup(service);
    this.root.innerHTML=`<div class="consultations-v147-shell">${this.sanctuaryMarkup()}${this.step!=='success'?this.stepperMarkup():''}${flow}${this.boundariesMarkup()}${this.mobileSummaryMarkup(service)}</div>`;
    this.bind();
  }

  bind(){
    this.root.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
      this.selected=button.dataset.service;
      this.draft={...this.draft,serviceId:this.selected,slotStartAt:'',preferredDate:'',preferredPeriod:'',submissionId:''};
      this.step='schedule';this.pendingPayload=null;this.submitError='';safeSet(DRAFT_KEY,this.draft);this.render();this.scrollFlow();
    }));
    this.root.querySelectorAll('[data-change-service],[data-back-services]').forEach(button=>button.addEventListener('click',()=>{this.saveDetails();this.step='services';this.pendingPayload=null;this.render();this.scrollFlow();}));
    this.root.querySelectorAll('[data-day]').forEach(button=>button.addEventListener('click',()=>{this.activeDay=button.dataset.day;this.draft.slotStartAt='';safeSet(DRAFT_KEY,this.draft);this.render();}));
    this.root.querySelectorAll('[data-slot]').forEach(button=>button.addEventListener('click',()=>{this.draft.slotStartAt=button.dataset.slot;safeSet(DRAFT_KEY,this.draft);this.render();}));
    this.root.querySelector('[data-use-email]')?.addEventListener('click',()=>{this.useEmailFallback=true;this.apiMessage='Informe uma preferência; a confirmação acontecerá pelo e-mail oficial.';this.render();});
    this.root.querySelector('[data-retry-agenda]')?.addEventListener('click',()=>{this.useEmailFallback=false;this.loadAvailability();});
    this.root.querySelectorAll('[name="preferredDate"],[name="preferredPeriod"]').forEach(input=>input.addEventListener('change',()=>{this.draft[input.name]=input.value;safeSet(DRAFT_KEY,this.draft);}));
    this.root.querySelector('[data-continue-schedule]')?.addEventListener('click',()=>{
      if(this.apiState==='ready'&&!this.useEmailFallback&&!this.draft.slotStartAt){this.apiMessage='Escolha um horário para continuar.';this.render();return;}
      const dateInput=this.root.querySelector('[name="preferredDate"]'),periodInput=this.root.querySelector('[name="preferredPeriod"]');
      if(dateInput)this.draft.preferredDate=dateInput.value;if(periodInput)this.draft.preferredPeriod=periodInput.value;
      safeSet(DRAFT_KEY,this.draft);this.step='details';this.render();this.scrollFlow();
    });
    this.root.querySelector('[data-back-schedule]')?.addEventListener('click',()=>{this.saveDetails();this.step='schedule';this.pendingPayload=null;this.render();this.scrollFlow();});
    const form=this.root.querySelector('form');
    form?.addEventListener('input',event=>{this.saveDetails();if(event.target.name==='question'){const counter=this.root.querySelector('[data-question-count]');if(counter)counter.textContent=event.target.value.length;}event.target.removeAttribute('aria-invalid');});
    form?.addEventListener('submit',event=>this.prepareReview(event));
    this.root.querySelector('[data-clear-draft]')?.addEventListener('click',event=>{
      const button=event.currentTarget;
      if(button.dataset.confirm==='true'){safeRemove(DRAFT_KEY);for(const key of LEGACY_DRAFT_KEYS)safeRemove(key);this.draft={serviceId:this.selected};this.render();emit('Rascunho removido deste aparelho.');return;}
      button.dataset.confirm='true';button.textContent='TOQUE NOVAMENTE PARA LIMPAR';
    });
    this.root.querySelector('[data-back-details]')?.addEventListener('click',()=>{this.step='details';this.pendingPayload=null;this.submitError='';this.render();this.scrollFlow();});
    this.root.querySelector('[data-confirm-request]')?.addEventListener('click',()=>this.confirmRequest());
    this.root.querySelector('[data-email-fallback]')?.addEventListener('click',()=>this.openEmail(this.pendingPayload));
    this.root.querySelector('[data-copy-protocol]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(this.success?.protocol||'');emit('Protocolo copiado.');}catch{emit('Não foi possível copiar. Selecione o protocolo na tela.');}});
    this.root.querySelector('[data-new-request]')?.addEventListener('click',()=>this.newRequest());
  }

  saveDetails(){
    const form=this.root?.querySelector('form');
    if(!form)return;
    const data=new FormData(form);
    this.draft={...this.draft,name:clean(data.get('name')),email:clean(data.get('email')),phone:clean(data.get('phone')),question:String(data.get('question')||''),acceptTerms:data.get('acceptTerms')==='yes'?'yes':'',acceptPrivacy:data.get('acceptPrivacy')==='yes'?'yes':'',acceptSymbolic:data.get('acceptSymbolic')==='yes'?'yes':'',updatedAt:new Date().toISOString()};
    safeSet(DRAFT_KEY,this.draft);
  }

  prepareReview(event){
    event.preventDefault();this.saveDetails();
    const form=event.currentTarget,status=this.root.querySelector('[data-form-status]');
    const invalid=[];
    const mark=(name,condition,label)=>{const field=form.elements[name];if(!condition){invalid.push(label);field?.setAttribute('aria-invalid','true');}};
    mark('name',clean(this.draft.name).length>=2,'nome completo');
    mark('email',validEmail(this.draft.email),'e-mail válido');
    mark('phone',validPhone(this.draft.phone),'telefone com DDD');
    mark('question',clean(this.draft.question).length>=10,'pergunta com pelo menos 10 caracteres');
    mark('acceptTerms',this.draft.acceptTerms==='yes','confirmação do valor');
    mark('acceptPrivacy',this.draft.acceptPrivacy==='yes','autorização de privacidade');
    mark('acceptSymbolic',this.draft.acceptSymbolic==='yes','declaração sobre leitura simbólica');
    if(invalid.length){status.textContent=`Revise: ${invalid.join(', ')}.`;status.classList.add('is-error');form.querySelector('[aria-invalid="true"]')?.focus();return;}
    const service=this.service(),submissionId=this.draft.submissionId||requestId();
    this.draft.submissionId=submissionId;safeSet(DRAFT_KEY,this.draft);
    this.pendingPayload={id:submissionId,environment:'staging',status:'ready-to-submit',createdAt:new Date().toISOString(),serviceId:service.id,customer:{name:clean(this.draft.name),email:clean(this.draft.email),phone:clean(this.draft.phone)},preference:{slotStartAt:clean(this.draft.slotStartAt),preferredDate:clean(this.draft.preferredDate),preferredPeriod:clean(this.draft.preferredPeriod)},question:clean(this.draft.question).slice(0,3000),consents:{terms:true,privacy:true,symbolic:true,marketing:false},price_snapshot:consultationPriceSnapshot(service,this.catalogVersion)};
    this.step='review';this.submitError='';this.render();this.scrollFlow();
  }

  async confirmRequest(){
    if(!this.pendingPayload||this.submitting)return;
    const apiMode=this.apiState==='ready'&&this.pendingPayload.preference.slotStartAt&&!this.useEmailFallback;
    if(!apiMode){this.openEmail(this.pendingPayload);return;}
    this.submitting=true;this.submitError='';this.render();
    try{
      const hold=await this.request(this.apiBase,{method:'POST',body:JSON.stringify({action:'hold',serviceKey:this.pendingPayload.serviceId,slotStartAt:this.pendingPayload.preference.slotStartAt,website:''})});
      const result=await this.request(this.apiBase,{method:'POST',body:JSON.stringify({action:'submit',holdToken:hold.holdToken,submissionId:this.pendingPayload.id,name:this.pendingPayload.customer.name,email:this.pendingPayload.customer.email,phone:this.pendingPayload.customer.phone,questionContext:this.pendingPayload.question,acceptTerms:true,acceptPrivacy:true,acceptSymbolic:true,marketingOptIn:false,website:''})});
      this.completeRequest(result);
    }catch(error){
      const code=clean(error?.code||error?.message);
      this.submitting=false;
      if(['SLOT_UNAVAILABLE','INVALID_SLOT','HOLD_EXPIRED'].includes(code)){
        this.draft.slotStartAt='';safeSet(DRAFT_KEY,this.draft);this.pendingPayload=null;this.step='schedule';this.apiMessage=errorMessages[code];await this.loadAvailability();this.apiMessage=errorMessages[code];this.render();this.scrollFlow();return;
      }
      this.submitError=errorMessages[code]||'Não foi possível registrar agora. Tente novamente ou use o e-mail oficial.';
      this.render();
    }
  }

  completeRequest(result){
    const payload=this.pendingPayload,service=this.service();
    const protocol=clean(result?.protocol)||payload.id;
    const record={id:payload.id,protocol,serviceId:service.id,serviceName:service.name,priceCents:payload.price_snapshot.priceCents,price_snapshot:payload.price_snapshot,status:clean(result?.status)||'received',paymentStatus:'not_started',slotStartAt:payload.preference.slotStartAt,createdAt:payload.createdAt};
    const history=this.requests();safeSet(REQUESTS_KEY,[record,...history.filter(item=>item.id!==record.id)].slice(0,50));
    safeSet(DRAFT_KEY,{name:payload.customer.name,email:payload.customer.email,phone:payload.customer.phone});
    this.success={mode:'staging-api',id:payload.id,protocol,serviceId:service.id,serviceName:service.name,priceCents:payload.price_snapshot.priceCents,scheduleLabel:this.scheduleLabel(payload.preference)};
    this.submitting=false;this.pendingPayload=null;this.step='success';this.render();this.scrollFlow();emit('Solicitação recebida. Guarde o seu protocolo.');
  }

  openEmail(payload){
    if(!payload)return;
    const service=this.service()||consultationById(payload.serviceId),schedule=this.scheduleLabel(payload.preference);
    const body=`Olá! Quero solicitar uma ${service.name}.\n\nCódigo: ${payload.id}\nValor registrado: ${moneyCents(payload.price_snapshot.priceCents)}\nTabela: ${payload.price_snapshot.priceTableVersion}\n\nNome: ${payload.customer.name}\nE-mail: ${payload.customer.email}\nTelefone: ${payload.customer.phone}\nPreferência: ${schedule}\n\nPergunta ou contexto:\n${payload.question}\n\nConfirmo o valor exibido, o uso dos dados somente para administrar esta solicitação e que a leitura é simbólica.\n\nEnviado pelo site Divina Bruxa — solicitação sem cobrança automática.`;
    const record={id:payload.id,serviceId:service.id,serviceName:service.name,priceCents:payload.price_snapshot.priceCents,price_snapshot:payload.price_snapshot,status:'email-prepared',slotStartAt:payload.preference.slotStartAt||null,createdAt:payload.createdAt};
    const history=this.requests();safeSet(REQUESTS_KEY,[record,...history.filter(item=>item.id!==record.id)].slice(0,50));
    safeSet(DRAFT_KEY,{name:payload.customer.name,email:payload.customer.email,phone:payload.customer.phone});
    this.success={mode:'email',id:payload.id,serviceId:service.id,serviceName:service.name,priceCents:payload.price_snapshot.priceCents,scheduleLabel:schedule};
    this.pendingPayload=null;this.submitting=false;this.step='success';this.render();
    location.href=`mailto:${CONSULTATION_POLICY.contactEmail}?subject=${encodeURIComponent(`Consulta Divina Bruxa — ${service.name} — ${payload.id}`)}&body=${encodeURIComponent(body)}`;
    emit('E-mail preparado. Revise a mensagem e toque em Enviar.');
  }

  newRequest(){
    const contact={name:this.draft.name||'',email:this.draft.email||'',phone:this.draft.phone||''};
    this.draft=contact;safeSet(DRAFT_KEY,this.draft);this.selected='';this.step='services';this.success=null;this.pendingPayload=null;this.submitError='';this.useEmailFallback=this.apiState!=='ready';this.render();this.scrollFlow();
  }

  scrollFlow(){this.root.querySelector('.consultation-flow-stage')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});}
}
