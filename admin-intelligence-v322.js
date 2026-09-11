/* DIVINA BRUXA 2.0 — REBIRTH R023 · ADMIN INTELLIGENCE V322
   Dashboard owner-only sobre AdminEngine V150.
   Lê somente o snapshot agregado de admin-analytics-v322.
   Nunca lê nem renderiza corpo do Diário, perguntas, contatos, prompts ou respostas. */

const RELEASE='V322';
const PULSE_ID='adminPulseV322';
const ANALYTICS_ID='adminAnalyticsV322';
const REQUEST_TIMEOUT=16000;

const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const number=value=>Number.isFinite(Number(value))?Number(value):0;
const integer=value=>Math.max(0,Math.floor(number(value)));
const brl=cents=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(integer(cents)/100);
const usd=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:4}).format(number(value));
const stamp=value=>{
  try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(value));}
  catch{return '—';}
};
const maxCount=items=>Math.max(1,...(Array.isArray(items)?items:[]).map(item=>integer(item.count)));
const bars=(items=[],empty='Sem eventos ainda.')=>{
  const rows=Array.isArray(items)?items:[];
  if(!rows.length)return `<p class="aiv322__empty">${safe(empty)}</p>`;
  const max=maxCount(rows);
  return `<div class="aiv322__bars">${rows.map(item=>`
    <div><span><b>${safe(item.key==='unknown'?'Não informado':item.key)}</b><small>${integer(item.count)}</small></span>
    <i><em style="--aiv322-bar:${Math.max(.04,integer(item.count)/max)}"></em></i></div>`).join('')}</div>`;
};
const countryName=code=>{
  try{
    return new Intl.DisplayNames(['pt-BR'],{type:'region'}).of(String(code||'').toUpperCase())||code;
  }catch{return code;}
};

export class AdminIntelligenceV322{
  constructor(root){
    this.root=root?.id==='adminApp'?root:document.querySelector('#adminApp');
    this.apiBase=`${String(globalThis.divinaAuth?.functionBase||'').replace(/\/$/,'')}/admin-analytics-v322`;
    this.data=null;
    this.loading=false;
    this.error='';
    this.observer=null;
    this.abort=new AbortController();
    this.renderQueued=false;
    if(!this.root)return;
    this.bind();
    this.observe();
    this.queueMount();
  }

  bind(){
    const signal=this.abort.signal;
    this.root.addEventListener('click',event=>{
      if(event.target.closest('[data-admin-module="analytics"]'))setTimeout(()=>this.queueMount(true),0);
      if(event.target.closest('[data-refresh-module]')&&this.analyticsSelected()){
        event.stopImmediatePropagation();
        this.load(true);
      }
    },{capture:true,signal});
  }

  observe(){
    this.observer=new MutationObserver(()=>this.queueMount());
    this.observer.observe(this.root,{childList:true,subtree:true});
  }

  queueMount(force=false){
    if(this.renderQueued)return;
    this.renderQueued=true;
    queueMicrotask(()=>{
      this.renderQueued=false;
      this.mount();
      if(force||(!this.data&&!this.loading&&this.authorizedShell()))this.load(false);
    });
  }

  authorizedShell(){return Boolean(this.root?.querySelector('.admin-v144-shell'));}

  analyticsSelected(){
    return Boolean(this.root?.querySelector('[data-admin-module="analytics"][aria-current="page"]'));
  }

  async request(){
    if(!this.apiBase)return {ok:false,status:0,body:{error:'backend-unavailable'}};
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT);
    try{
      const response=await fetch(this.apiBase,{
        method:'GET',
        credentials:'include',
        cache:'no-store',
        headers:{Accept:'application/json','x-divina-admin-request':'v322'},
        signal:controller.signal
      });
      return {ok:response.ok,status:response.status,body:await response.json().catch(()=>({}))};
    }catch{return {ok:false,status:0,body:{error:'network_unavailable'}};}
    finally{clearTimeout(timer);}
  }

  async load(announce=false){
    if(this.loading||!this.authorizedShell())return;
    this.loading=true;this.error='';this.mount();
    const result=await this.request();
    this.loading=false;
    if(result.ok){
      this.data=result.body;
      this.error='';
      if(announce)globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:'Analytics sanitizado atualizado do STAGING.'}));
    }else{
      this.error=String(result.body?.error||'analytics_snapshot_failed');
      if(announce)globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:'O snapshot de Analytics não pôde ser atualizado agora.'}));
    }
    this.mount();
  }

  mount(){
    if(!this.authorizedShell())return false;
    this.mountPulse();
    if(this.analyticsSelected())this.mountAnalytics();
    return true;
  }

  mountPulse(){
    const shell=this.root.querySelector('.admin-v144-shell');
    const header=shell?.querySelector('.admin-command-header');
    if(!shell||!header)return;

    let pulse=document.getElementById(PULSE_ID);
    if(!pulse){
      pulse=document.createElement('section');
      pulse.id=PULSE_ID;
      pulse.className='aiv322-pulse';
      header.insertAdjacentElement('afterend',pulse);
    }

    const d=this.data;
    pulse.innerHTML=`
      <div class="aiv322-pulse__identity"><span aria-hidden="true">◈</span><p><small>PULSO OPERACIONAL · V322</small><b>${this.loading?'Lendo o STAGING…':this.error?'Snapshot indisponível':d?'Central conectada':'Pronta para conectar'}</b></p></div>
      <div class="aiv322-pulse__metrics">
        <span><b>${d?integer(d.audience?.registeredAccounts):'—'}</b><small>contas</small></span>
        <span><b>${d?integer(d.consultations?.open):'—'}</b><small>consultas abertas</small></span>
        <span><b>${d?integer(d.ai?.credits30d):'—'}</b><small>créditos IA · 30d</small></span>
        <span><b>${d?brl(d.revenue?.sandboxRevenueCents30d):'—'}</b><small>receita sandbox · 30d</small></span>
      </div>
      <button type="button" data-aiv322-open>ANALYTICS E MAPA</button>`;

    pulse.querySelector('[data-aiv322-open]')?.addEventListener('click',()=>{
      const button=this.root.querySelector('[data-admin-module="analytics"]');
      button?.click();
    });
  }

  mountAnalytics(){
    const slot=this.root.querySelector('[data-admin-module-content]');
    if(!slot)return;

    if(this.loading&&!this.data){
      slot.innerHTML=`<section id="${ANALYTICS_ID}" class="aiv322-dashboard"><div class="aiv322-loading"><i></i><b>Lendo métricas agregadas…</b><span>Nenhum texto privado entra neste snapshot.</span></div></section>`;
      return;
    }
    if(this.error&&!this.data){
      slot.innerHTML=`<section id="${ANALYTICS_ID}" class="aiv322-dashboard"><div class="aiv322-error"><span>◇</span><b>O snapshot não abriu agora.</b><p>${safe(this.error)}</p><button type="button" data-aiv322-retry>TENTAR NOVAMENTE</button></div></section>`;
      slot.querySelector('[data-aiv322-retry]')?.addEventListener('click',()=>this.load(true));
      return;
    }
    if(!this.data){
      slot.innerHTML=`<section id="${ANALYTICS_ID}" class="aiv322-dashboard"><div class="aiv322-loading"><b>Analytics sanitizado pronto para conectar.</b><button type="button" data-aiv322-retry>CARREGAR SNAPSHOT</button></div></section>`;
      slot.querySelector('[data-aiv322-retry]')?.addEventListener('click',()=>this.load(true));
      return;
    }

    const d=this.data;
    const observed=d.audience?.observedActiveAccounts||{};
    const countries=d.map?.countries||[];
    const countryMax=maxCount(countries);

    slot.innerHTML=`<section id="${ANALYTICS_ID}" class="aiv322-dashboard">
      <header class="aiv322-hero">
        <div><p class="eyebrow">ANALYTICS + MAPA · CÉREBRO OPERACIONAL</p>
        <h4>Números reais, intimidades invisíveis.</h4>
        <p>Este painel usa somente agregados sanitizados do STAGING. Quando a instrumentação não existe, a Central mostra a lacuna em vez de inventar um KPI.</p></div>
        <span class="aiv322-hero__seal" aria-hidden="true">◈</span>
      </header>

      <section class="aiv322-scorecards" aria-label="Scorecard do produto">
        ${this.card('CONTAS',integer(d.audience?.registeredAccounts),'registradas')}
        ${this.card('24H',integer(observed.d1),'contas ativas observadas')}
        ${this.card('7D',integer(observed.d7),'contas ativas observadas')}
        ${this.card('30D',integer(observed.d30),'contas ativas observadas')}
        ${this.card('CARTA DO DIA',integer(d.engagement?.dailyCards?.d30),'aberturas · 30d')}
        ${this.card('WHIT / IA',integer(d.ai?.requests30d),'requests · 30d')}
        ${this.card('CONSULTAS',integer(d.consultations?.requests30d),'pedidos · 30d')}
        ${this.card('SANDBOX',brl(d.revenue?.sandboxRevenueCents30d),'receita paga · 30d')}
      </section>

      <aside class="aiv322-truth">
        <span>◇</span><p><b>DAU / WAU / MAU oficial ainda não é reivindicado.</b>
        <small>O STAGING ainda não possui um identificador de atividade completo e consentido em todos os mundos. Os números 24h/7d/30d acima são <em>contas observadas</em> somente em Carta do Dia, IA, compras e Consultas.</small></p>
      </aside>

      <div class="aiv322-grid">
        <section class="aiv322-panel">
          <header><div><p class="eyebrow">FUNIL</p><h5>Eventos por estágio</h5></div><span>${integer(d.coverage?.analyticsEvents)} eventos</span></header>
          ${bars(d.analytics?.funnel,'A instrumentação de funil ainda não registrou eventos.')}
        </section>

        <section class="aiv322-panel">
          <header><div><p class="eyebrow">MUNDOS</p><h5>Eventos permitidos</h5></div><span>30 dias</span></header>
          ${bars(d.analytics?.eventsByKey,'Nenhum evento de analytics chegou ao STAGING ainda.')}
        </section>

        <section class="aiv322-panel">
          <header><div><p class="eyebrow">PLATAFORMAS</p><h5>Onde a experiência acontece</h5></div><span>web · PWA · apps</span></header>
          ${bars(d.analytics?.platforms,'Sem eventos de plataforma ainda.')}
        </section>

        <section class="aiv322-panel">
          <header><div><p class="eyebrow">IDIOMAS</p><h5>Distribuição de locale</h5></div><span>PT · EN · ES</span></header>
          ${bars(d.analytics?.locales,'Sem eventos de idioma ainda.')}
        </section>
      </div>

      <section class="aiv322-atlas">
        <header><div><p class="eyebrow">ATLAS DE PAÍSES</p><h5>Onde a Divina Bruxa está sendo usada</h5></div>
        <span>${d.map?.countrySignalAvailable?'SINAL DISPONÍVEL':'AGUARDANDO SINAL'}</span></header>
        ${countries.length?`
          <div class="aiv322-atlas__body">
            <div class="aiv322-globe" aria-hidden="true"><i></i><b>◎</b></div>
            <div class="aiv322-country-list">${countries.map(item=>`
              <div><span><b>${safe(countryName(item.key))}</b><small>${safe(item.key)} · ${integer(item.count)}</small></span>
              <i><em style="--aiv322-country:${Math.max(.05,integer(item.count)/countryMax)}"></em></i></div>`).join('')}</div>
          </div>`:
          `<div class="aiv322-atlas__empty"><div class="aiv322-globe" aria-hidden="true"><i></i><b>◎</b></div>
          <p><b>Nenhum país registrado ainda.</b><span>O campo geográfico existe, mas o coletor atual ainda não preenche `country_code`. Região/estado também não está instrumentado. O mapa permanece vazio em vez de inferir localização.</span></p></div>`}
      </section>

      <div class="aiv322-grid aiv322-grid--ops">
        <section class="aiv322-panel">
          <header><div><p class="eyebrow">ORBE IA</p><h5>Custo e consumo</h5></div><span>${usd(d.ai?.estimatedCostUsd30d)} estimados</span></header>
          <dl class="aiv322-dl">
            <div><dt>Requests 30d</dt><dd>${integer(d.ai?.requests30d)}</dd></div>
            <div><dt>Sucesso 30d</dt><dd>${integer(d.ai?.successful30d)}</dd></div>
            <div><dt>Créditos 30d</dt><dd>${integer(d.ai?.credits30d)}</dd></div>
            <div><dt>Sol</dt><dd>OFF</dd></div>
          </dl>
        </section>

        <section class="aiv322-panel">
          <header><div><p class="eyebrow">CONSULTAS</p><h5>Operação humana</h5></div><span>${brl(d.consultations?.valueSnapshotCents30d)} em snapshots</span></header>
          ${bars(d.consultations?.byStatus,'Sem pedidos no recorte.')}
        </section>

        <section class="aiv322-panel">
          <header><div><p class="eyebrow">CONTEÚDO</p><h5>Publicação e comunicação</h5></div><span>STAGING</span></header>
          <dl class="aiv322-dl">
            <div><dt>Vídeos publicados</dt><dd>${integer(d.content?.videoPublished)}</dd></div>
            <div><dt>Vídeos rascunho</dt><dd>${integer(d.content?.videoDrafts)}</dd></div>
            <div><dt>Notificações rascunho</dt><dd>${integer(d.content?.notificationDrafts)}</dd></div>
          </dl>
        </section>

        <section class="aiv322-panel aiv322-panel--privacy">
          <header><div><p class="eyebrow">PRIVACIDADE</p><h5>O que este painel não recebe</h5></div><span>ATIVA</span></header>
          <ul><li>corpo do Diário</li><li>perguntas de Consulta</li><li>prompts e respostas Whit</li><li>nomes, e-mails e telefones</li><li>localização precisa</li></ul>
        </section>
      </div>

      <footer class="aiv322-footer">
        <p><b>Snapshot ${safe(d.release||RELEASE)} · ${safe(d.environment||'staging')}</b><small>Gerado ${safe(stamp(d.generatedAt))}. ${d.coverage?.analyticsSampleLimited?'A amostra de eventos atingiu o limite técnico de leitura.':'Amostra dentro do limite técnico.'}</small></p>
        <button type="button" data-aiv322-refresh>ATUALIZAR SNAPSHOT</button>
      </footer>
    </section>`;

    slot.querySelector('[data-aiv322-refresh]')?.addEventListener('click',()=>this.load(true));
  }

  card(label,value,detail){
    return `<article><small>${safe(label)}</small><strong>${safe(value)}</strong><span>${safe(detail)}</span></article>`;
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      backend:'admin-analytics-v322',
      loaded:Boolean(this.data),
      error:this.error||null,
      officialDauWauMauAvailable:this.data?.audience?.officialDauWauMauAvailable===true,
      countrySignalAvailable:this.data?.map?.countrySignalAvailable===true,
      regionSignalAvailable:false,
      privateContentRead:false
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    document.getElementById(PULSE_ID)?.remove();
    document.getElementById(ANALYTICS_ID)?.remove();
  }
}
