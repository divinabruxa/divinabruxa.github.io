/* DIVINA BRUXA — SANTUÁRIO DAS CONSULTAS V143
   Seleção, rascunho privado, price snapshot e confirmação antes do e-mail. */
import { store, escapeHTML } from './storage.js';
import { CONSULTATION_POLICY, consultationById, consultationPriceSnapshot } from './consultation-policy.js?v=143';

const DRAFT_KEY='consultation-draft-v143';
const LEGACY_DRAFT_KEY='consultation-draft-v5';
const REQUESTS_KEY='consultation-requests-v143';
const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const emit=message=>dispatchEvent(new CustomEvent('orbe:toast',{detail:message}));
const requestId=()=>globalThis.crypto?.randomUUID?.()||`consulta-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const clean=value=>String(value??'').trim();
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));

export class ConsultationEngine{
  constructor(root){
    this.root=root;
    if(!root)return;
    this.draft=store.get(DRAFT_KEY)||store.get(LEGACY_DRAFT_KEY)||{};
    this.selected=consultationById(this.draft.serviceId)?.id||'';
    this.step=this.selected?'form':'services';
    this.pendingPayload=null;
    this.render();
  }

  serviceCard(service,index){
    const selected=service.id===this.selected;
    return `<button type="button" class="consultation-v143-service${selected?' is-selected':''}" data-service="${escapeHTML(service.id)}" aria-pressed="${selected}"><span class="consultation-service-number">0${index+1}</span><i aria-hidden="true">${service.sigil}</i><small>${escapeHTML(service.duration)}</small><h3>${escapeHTML(service.name)}</h3><p>${escapeHTML(service.detail)}</p><ul>${service.includes.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul><strong>${money(service.price)}</strong><b>${selected?'SELECIONADA':'ESCOLHER CONSULTA'}</b></button>`;
  }

  render(){
    const service=consultationById(this.selected);
    const requests=store.get(REQUESTS_KEY,[]);
    this.root.innerHTML=`<div class="consultations-v143-shell">
      <section class="consultation-sanctuary" aria-labelledby="consultationSanctuaryTitle"><div><p class="eyebrow">ATENDIMENTO HUMANO · PRIVADO</p><h3 id="consultationSanctuaryTitle">Um espaço reservado para a sua pergunta.</h3><p>Escolha a consulta, conte o contexto e revise tudo antes de abrir o e-mail. O pedido só será enviado quando você confirmar no seu aplicativo de e-mail.</p><div class="consultation-sanctuary-badges"><span>◇ SOMENTE E-MAIL</span><span>◇ SEM COBRANÇA NESTA ETAPA</span><span>◇ SEM CRÉDITOS DE IA</span></div></div><aside><b>${requests.length}</b><span>${requests.length===1?'pedido preparado':'pedidos preparados'} neste aparelho</span></aside></section>

      <nav class="consultation-steps" aria-label="Etapas da solicitação"><span class="${this.step==='services'?'is-current':'is-complete'}"><b>1</b>Escolha</span><i></i><span class="${this.step==='form'?'is-current':this.step==='review'?'is-complete':''}"><b>2</b>Seus dados</span><i></i><span class="${this.step==='review'?'is-current':''}"><b>3</b>Revisão</span></nav>

      <section class="consultation-v143-services" aria-label="Quatro consultas disponíveis">${CONSULTATION_POLICY.services.map((item,index)=>this.serviceCard(item,index)).join('')}</section>

      ${service?this.formMarkup(service):'<p class="consultation-select-hint"><span>✦</span>Escolha uma das quatro consultas para abrir o formulário.</p>'}
      <section class="consultation-boundaries" aria-labelledby="consultationBoundariesTitle"><div><p class="eyebrow">CLAREZA E SEGURANÇA</p><h3 id="consultationBoundariesTitle">Cada universo permanece separado.</h3></div><ul>${CONSULTATION_POLICY.safeguards.map(item=>`<li><span>◇</span>${escapeHTML(item)}</li>`).join('')}</ul><p>Suporte e confirmação: <a href="mailto:${CONSULTATION_POLICY.contactEmail}">${CONSULTATION_POLICY.contactEmail}</a></p></section>
      <section class="consultation-faq"><details><summary>Quando a consulta é confirmada?</summary><p>Depois que você enviar o e-mail, a disponibilidade e o prazo serão respondidos diretamente por e-mail.</p></details><details><summary>O site cobra agora?</summary><p>Não. Esta versão apenas prepara a solicitação. Nenhum cartão ou pagamento é solicitado.</p></details><details><summary>Está incluída no Premium?</summary><p>Não. Consultas são atendimentos humanos independentes do Premium e da Orbe IA.</p></details></section>
    </div>`;
    this.bind();
    if(this.step==='review'&&this.pendingPayload)this.renderReview();
  }

  formMarkup(service){
    const value=name=>escapeHTML(this.draft[name]||'');
    return `<section class="consultation-form-stage" aria-labelledby="consultationFormTitle"><header><div><p class="eyebrow">ETAPA 2 · SEUS DADOS</p><h3 id="consultationFormTitle">${escapeHTML(service.name)}</h3><span>${money(service.price)} · ${escapeHTML(service.delivery)}</span></div><button type="button" data-change-service>TROCAR CONSULTA</button></header><form class="consultation-v143-form" novalidate><div class="consultation-field-grid"><label><span>Nome completo *</span><input name="name" autocomplete="name" required value="${value('name')}" placeholder="Como deseja ser chamada"></label><label><span>E-mail *</span><input name="email" type="email" autocomplete="email" required value="${value('email')}" placeholder="seu@email.com"></label><label><span>Telefone *</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${value('phone')}" placeholder="(00) 00000-0000"></label><label><span>Data preferida</span><input name="date" type="date" value="${value('date')}"></label><label><span>Período preferido</span><select name="period"><option value="">A combinar</option><option${this.draft.period==='Manhã'?' selected':''}>Manhã</option><option${this.draft.period==='Tarde'?' selected':''}>Tarde</option><option${this.draft.period==='Noite'?' selected':''}>Noite</option></select></label><label class="consultation-question"><span>Pergunta ou contexto *</span><textarea name="question" maxlength="3000" required placeholder="Conte com liberdade o que deseja compreender">${value('question')}</textarea><small><b data-question-count>${clean(this.draft.question).length}</b>/3000 · rascunho privado neste aparelho</small></label></div><label class="consultation-consent"><input name="consent" type="checkbox" value="yes"${this.draft.consent==='yes'?' checked':''}><span>Confirmo que revisei meu e-mail e autorizo preparar esta solicitação para envio. *</span></label><p class="consultation-form-status" data-status role="status" aria-live="polite">Nenhuma cobrança será feita ao continuar.</p><div class="consultation-form-actions"><button type="submit">REVISAR SOLICITAÇÃO</button><button type="button" data-clear-draft>LIMPAR RASCUNHO</button></div></form></section>`;
  }

  bind(){
    this.root.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{this.saveCurrentForm();this.selected=button.dataset.service;this.draft={...this.draft,serviceId:this.selected};store.set(DRAFT_KEY,this.draft);this.step='form';this.pendingPayload=null;this.render();this.root.querySelector('.consultation-form-stage')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});}));
    const form=this.root.querySelector('form');
    form?.addEventListener('input',event=>{this.saveCurrentForm();if(event.target.name==='question'){const counter=this.root.querySelector('[data-question-count]');if(counter)counter.textContent=event.target.value.length;}});
    form?.addEventListener('submit',event=>this.prepareReview(event));
    this.root.querySelector('[data-change-service]')?.addEventListener('click',()=>{this.saveCurrentForm();this.step='services';this.render();this.root.querySelector('.consultation-v143-services')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth'});});
    this.root.querySelector('[data-clear-draft]')?.addEventListener('click',()=>{if(this.root.querySelector('[data-clear-draft]').dataset.confirm==='true'){store.remove(DRAFT_KEY);store.remove(LEGACY_DRAFT_KEY);this.draft={serviceId:this.selected};this.render();emit('Rascunho removido deste aparelho.');return;}const button=this.root.querySelector('[data-clear-draft]');button.dataset.confirm='true';button.textContent='CONFIRMAR LIMPEZA';});
  }

  saveCurrentForm(){
    const form=this.root.querySelector('form');
    if(!form)return;
    this.draft={...Object.fromEntries(new FormData(form)),serviceId:this.selected,updatedAt:new Date().toISOString()};
    store.set(DRAFT_KEY,this.draft);
  }

  prepareReview(event){
    event.preventDefault();
    this.saveCurrentForm();
    const status=this.root.querySelector('[data-status]');
    const missing=!clean(this.draft.name)||!validEmail(this.draft.email)||!clean(this.draft.phone)||!clean(this.draft.question)||this.draft.consent!=='yes';
    if(missing){status.textContent='Preencha nome, e-mail válido, telefone, pergunta e confirmação para continuar.';status.classList.add('is-error');return;}
    const service=consultationById(this.selected);
    this.pendingPayload={id:requestId(),environment:'sandbox',status:'draft-email',createdAt:new Date().toISOString(),serviceId:service.id,customer:{name:clean(this.draft.name),email:clean(this.draft.email),phone:clean(this.draft.phone)},preference:{date:clean(this.draft.date),period:clean(this.draft.period)},question:clean(this.draft.question).slice(0,3000),price_snapshot:consultationPriceSnapshot(service)};
    this.step='review';
    this.render();
    this.root.querySelector('.consultation-review')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'center'});
  }

  renderReview(){
    const payload=this.pendingPayload,service=consultationById(payload.serviceId),stage=this.root.querySelector('.consultation-form-stage');
    if(!stage)return;
    stage.innerHTML=`<article class="consultation-review" aria-labelledby="consultationReviewTitle"><p class="eyebrow">ETAPA 3 · REVISE ANTES DE ENVIAR</p><h3 id="consultationReviewTitle">${escapeHTML(service.name)}</h3><strong>${money(payload.price_snapshot.price)}</strong><dl><div><dt>Nome</dt><dd>${escapeHTML(payload.customer.name)}</dd></div><div><dt>E-mail</dt><dd>${escapeHTML(payload.customer.email)}</dd></div><div><dt>Telefone</dt><dd>${escapeHTML(payload.customer.phone)}</dd></div><div><dt>Preferência</dt><dd>${escapeHTML(payload.preference.date||'Data a combinar')} · ${escapeHTML(payload.preference.period||'período a combinar')}</dd></div><div class="is-wide"><dt>Pergunta ou contexto</dt><dd>${escapeHTML(payload.question)}</dd></div></dl><aside><span>◇</span><p><b>Este valor ficará registrado no pedido.</b> A próxima ação apenas abre seu aplicativo de e-mail. Você ainda poderá revisar e decidir se deseja enviar.</p></aside><div class="consultation-review-actions"><button type="button" data-confirm-email>ABRIR E-MAIL PARA ENVIAR</button><button type="button" data-back-form>VOLTAR E EDITAR</button></div></article>`;
    stage.querySelector('[data-back-form]').addEventListener('click',()=>{this.step='form';this.pendingPayload=null;this.render();});
    stage.querySelector('[data-confirm-email]').addEventListener('click',()=>this.openEmail(payload));
  }

  openEmail(payload){
    const service=consultationById(payload.serviceId);
    const body=`Olá! Quero solicitar uma ${service.name}.\n\nCódigo: ${payload.id}\nValor registrado: ${money(payload.price_snapshot.price)}\nTabela: ${payload.price_snapshot.priceTableVersion}\n\nNome: ${payload.customer.name}\nE-mail: ${payload.customer.email}\nTelefone: ${payload.customer.phone}\nData preferida: ${payload.preference.date||'a combinar'}\nPeríodo: ${payload.preference.period||'a combinar'}\n\nPergunta ou contexto:\n${payload.question}\n\nEnviado pelo site Divina Bruxa — solicitação sem cobrança automática.`;
    const history=store.get(REQUESTS_KEY,[]);
    const record={...payload,status:'email-prepared',question:'[conteúdo privado não exibido em analytics]',preparedAt:new Date().toISOString()};
    store.set(REQUESTS_KEY,[record,...history.filter(item=>item.id!==record.id)].slice(0,50));
    store.set(DRAFT_KEY,{serviceId:this.selected,name:this.draft.name,email:this.draft.email,phone:this.draft.phone});
    location.href=`mailto:${CONSULTATION_POLICY.contactEmail}?subject=${encodeURIComponent(`Consulta Divina Bruxa — ${service.name} — ${payload.id}`)}&body=${encodeURIComponent(body)}`;
    emit('Solicitação preparada. Revise e envie no seu e-mail.');
  }
}
