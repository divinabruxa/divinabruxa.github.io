/* DIVINA BRUXA 2.0 — P0 HOTFIX V325 · CONTA + CONSULTAS V319
   Camadas vivas sobre AccountEngine V201 e ConsultationEngine V188.
   Não duplica autenticação, RLS, sincronização, protocolo, agenda ou envio. */

import { ConsultationEngine } from './consultation-engine.js?v=188';
import { COMMERCIAL_TRUTH_V200 } from './commercial-truth-v200.js?v=200';

const RELEASE = 'V319';
const STYLE_ID = 'accountConsultationsWorldV319Styles';
const ACCOUNT_WORLD_ID = 'accountWorldV319';
const CONSULT_WORLD_ID = 'consultationsWorldV319';

const money = cents => new Intl.NumberFormat('pt-BR',{
  style:'currency',currency:'BRL'
}).format(Number(cents || 0)/100);

const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
}[char]));

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;
  link.rel='stylesheet';
  link.href='./account-consultations-world-v319.css?v=319';
  document.head.append(link);
}

const emit=(type,detail={})=>document.dispatchEvent(new CustomEvent(type,{
  detail:Object.freeze({release:RELEASE,...detail})
}));

class GovernedConsultationEngineV319 extends ConsultationEngine{
  applyCatalog(rows,version){
    if(!Array.isArray(rows))return false;
    if(String(version||'')!==COMMERCIAL_TRUTH_V200.consultationPriceTableVersion)return false;

    for(const local of COMMERCIAL_TRUTH_V200.services){
      const remote=rows.find(row=>String(row?.service_key||'').trim()===local.id);
      if(!remote||Number(remote.price_brl_cents)!==Number(local.priceCents))return false;
    }
    return super.applyCatalog(rows,version);
  }
}

export class AccountWorldV319{
  constructor(root,engine=globalThis.divinaAccount){
    installStyle();
    this.root=root?.id==='login'?root:document.querySelector('#login');
    this.engine=engine||null;
    this.abort=new AbortController();
    this.observer=null;
    this.renderQueued=false;
    if(!this.root||!this.engine)return;

    this.root.dataset.accountWorld='v319';
    this.bind();
    this.enhance();
    this.observe();
    emit('divina:account-world-ready',{
      authenticated:Boolean(this.engine.user),
      privateBodyIncluded:false
    });
  }

  bind(){
    const signal=this.abort.signal;
    addEventListener('divina:auth-state',()=>this.queueEnhance(),{signal});
    addEventListener('divina:account-sync-applied',()=>this.queueEnhance(),{signal});
    addEventListener('divina:billing-updated',()=>this.queueEnhance(),{signal});
  }

  observe(){
    this.observer=new MutationObserver(records=>{
      const meaningful=records.some(record=>{
        const nodes=[...record.addedNodes,...record.removedNodes].filter(node=>node?.nodeType===1);
        if(!nodes.length)return false;
        return nodes.some(node=>node.id!==ACCOUNT_WORLD_ID);
      });
      if(meaningful)this.queueEnhance();
    });
    this.observer.observe(this.root,{childList:true,subtree:false});
  }

  queueEnhance(){
    if(this.renderQueued)return;
    this.renderQueued=true;
    queueMicrotask(()=>{
      this.renderQueued=false;
      this.enhance();
    });
  }

  enhance(){
    const shell=this.root?.querySelector('.account-v189-shell');
    if(!shell)return false;

    document.getElementById(ACCOUNT_WORLD_ID)?.remove();

    const signedIn=Boolean(this.engine.user);
    const counts=this.engine.counts||{};
    const journalCloud=this.engine.journalEnabled===true;
    const world=document.createElement('section');
    world.id=ACCOUNT_WORLD_ID;
    world.className='account-world-v319';
    world.setAttribute('aria-label','Portal da Conta 2.0');

    world.innerHTML=`
      <div class="acw319__stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="acw319__head">
        <div>
          <p class="eyebrow">MINHA ORBE · PORTAL DE CONTINUIDADE</p>
          <h3>${signedIn?'Seu universo acompanha você.':'Uma conta para continuar, não para invadir.'}</h3>
          <p>${signedIn
            ?'Sua identidade, benefícios e escolhas de sincronização ficam reunidos aqui. O Diário continua sob uma permissão separada.'
            :'A Conta conecta progresso e benefícios entre aparelhos. Conteúdo privado não precisa entrar na nuvem para a Divina Bruxa continuar viva.'}</p>
        </div>
        <span class="acw319__seal" aria-hidden="true">${signedIn?'✓':'◎'}</span>
      </header>

      <div class="acw319__continuity">
        <article><strong>${signedIn?Number(counts.school||0):'—'}</strong><span>aulas concluídas</span></article>
        <article><strong>${signedIn?(journalCloud?Number(counts.journal||0):'LOCAL'):'—'}</strong><span>Diário</span></article>
        <article><strong>${signedIn?Number(counts.purchases||0):'—'}</strong><span>compras registradas</span></article>
        <article><strong>${signedIn?'RLS':'18+'}</strong><span>${signedIn?'isolamento por conta':'entrada protegida'}</span></article>
      </div>

      <div class="acw319__passages">
        <button type="button" data-acw319-main>
          <span>◇</span><b>${signedIn?'VER SINCRONIZAÇÃO':'ENTRAR OU CRIAR CONTA'}</b>
          <small>${signedIn?'continuar entre aparelhos':'e-mail verificado e senha forte'}</small>
        </button>
        <button type="button" data-acw319-consult>
          <span>☾</span><b>MINHAS CONSULTAS</b><small>abrir atendimento humano</small>
        </button>
        <p><b>${journalCloud?'Diário sincronizado por escolha.':'Diário permanece local por padrão.'}</b><small>Whit, Admin e analytics não recebem o corpo das memórias automaticamente.</small></p>
      </div>`;

    const hero=shell.querySelector('.account-v189-hero');
    if(hero?.nextSibling)shell.insertBefore(world,hero.nextSibling);
    else shell.prepend(world);

    world.querySelector('[data-acw319-main]')?.addEventListener('click',()=>{
      const target=signedIn
        ? this.root.querySelector('.account-v189-sync')
        : this.root.querySelector('.account-v189-tabs,.account-v189-form');
      target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      target?.querySelector?.('input')?.focus?.({preventScroll:true});
    });
    world.querySelector('[data-acw319-consult]')?.addEventListener('click',()=>globalThis.orbe?.go?.('consultations'));

    return true;
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V201',
      authenticated:Boolean(this.engine?.user),
      journalCloud:Boolean(this.engine?.journalEnabled),
      privateBodyRead:false,
      authDuplicated:false,
      serverAuthority:true
    });
  }

  destroy(){
    this.abort.abort();
    this.observer?.disconnect();
    document.getElementById(ACCOUNT_WORLD_ID)?.remove();
    delete this.root?.dataset?.accountWorld;
  }
}

export class ConsultationsWorldV319{
  constructor(root,config={}){
    installStyle();
    this.root=root?.id==='consultationApp'?root:document.querySelector('#consultationApp');
    if(!this.root)return;

    this.engine=new GovernedConsultationEngineV319(this.root,config);
    this.originalRender=this.engine.render.bind(this.engine);
    this.engine.render=(...args)=>{
      const result=this.originalRender(...args);
      queueMicrotask(()=>this.enhance());
      return result;
    };

    this.root.dataset.consultationsWorld='v319';
    this.enhance();

    emit('divina:consultations-world-ready',{
      serviceCount:COMMERCIAL_TRUTH_V200.services.length,
      priceTableVersion:COMMERCIAL_TRUTH_V200.consultationPriceTableVersion,
      realBilling:false,
      contactChannel:'email',
      bodyIncluded:false
    });
  }

  enhance(){
    if(!this.root)return false;
    document.getElementById(CONSULT_WORLD_ID)?.remove();

    // Corrige a etiqueta antiga do motor sem duplicar o fluxo.
    const badges=this.root.querySelectorAll('.consultation-sanctuary-badges span');
    if(badges[1])badges[1].textContent='◇ DE R$ 150 A R$ 500';

    const world=document.createElement('section');
    world.id=CONSULT_WORLD_ID;
    world.className='consultations-world-v319';
    world.setAttribute('aria-labelledby','consultationsWorldV319Title');

    const cards=COMMERCIAL_TRUTH_V200.services.map(service=>`
      <article>
        <span aria-hidden="true">${service.sigil}</span>
        <div><small>${safe(service.shortName)}</small><b>${money(service.priceCents)}</b></div>
      </article>`).join('');

    world.innerHTML=`
      <div class="acw319__stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="acw319__head">
        <div>
          <p class="eyebrow">CONSULTAS · ATENDIMENTO HUMANO</p>
          <h3 id="consultationsWorldV319Title">Quando você quiser uma leitura feita por uma pessoa.</h3>
          <p>Whit não substitui este espaço. Aqui a jornada é humana, privada e confirmada por e-mail — sem cobrança automática nesta etapa.</p>
        </div>
        <span class="acw319__seal" aria-hidden="true">☾</span>
      </header>

      <div class="acw319__services">${cards}</div>

      <div class="acw319__consult-covenant">
        <span>◇</span>
        <p><b>Valores oficiais V319.</b><small>Mesa Real R$500 · Leitura de Pensamentos R$500 · Carta de Conselho R$300 · Pergunta R$150.</small></p>
        <button type="button" data-acw319-start>ESCOLHER CONSULTA</button>
      </div>

      <p class="acw319__privacy">
        Protocolo e código privado servem para acompanhar o pedido. Consultas não consomem créditos da Orbe IA e não fazem parte do Premium.
      </p>`;

    const sanctuary=this.root.querySelector('.consultation-sanctuary');
    if(sanctuary?.parentElement)sanctuary.insertAdjacentElement('afterend',world);
    else this.root.prepend(world);

    world.querySelector('[data-acw319-start]')?.addEventListener('click',()=>{
      this.root.querySelector('.consultation-services-stage')?.scrollIntoView({
        behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
        block:'start'
      });
    });

    return true;
  }

  status(){
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V188',
      serviceCount:4,
      priceTableVersion:COMMERCIAL_TRUTH_V200.consultationPriceTableVersion,
      prices:COMMERCIAL_TRUTH_V200.services.map(item=>item.priceCents),
      emailOnly:true,
      realBilling:false,
      aiCreditsConsumed:false,
      includedInPremium:false,
      remotePriceDriftRejected:true
    });
  }

  destroy(){
    this.engine?.destroy?.();
    document.getElementById(CONSULT_WORLD_ID)?.remove();
    delete this.root?.dataset?.consultationsWorld;
  }
}
