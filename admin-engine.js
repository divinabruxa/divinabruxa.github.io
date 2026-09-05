/* DIVINA BRUXA — PAINEL SUPREMO V146
   Sessão em cookie seguro, owner verificada e MFA; nenhum desbloqueio local. */
import { store, escapeHTML } from './storage.js';
import { ADMIN_POLICY, adminModuleById } from './admin-policy.js?v=144';
import { CONSULTATION_POLICY } from './consultation-policy.js?v=147';

const safe=value=>escapeHTML(value??'');
const count=(key)=>{const value=store.get(key);return Array.isArray(value)?value.length:value&&typeof value==='object'?Object.keys(value).length:0;};
const integer=value=>Number.isFinite(Number(value))?Math.max(0,Math.floor(Number(value))):0;
const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(value)||0);
const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

export class AdminEngine{
  constructor(root){
    this.root=root;
    this.session=null;
    this.overview=null;
    this.selected='today';
    this.pendingPrices=null;
    this.mfaFactorId='';
    if(root)this.start();
  }

  notify(message){window.dispatchEvent(new CustomEvent('orbe:toast',{detail:message}));}

  async start(){
    this.renderGate('checking');
    if(!globalThis.divinaAuth?.adminEnabled){this.renderGate('server-required');return;}
    const result=await globalThis.divinaAuth.adminSession();
    if(this.isAuthorized(result?.body)){this.session=result.body;await this.loadOverview();this.renderPanel();return;}
    if(result?.body?.recoveryCodesRequired){this.renderGate('recovery');return;}
    if(result?.body?.mfaEnrollmentRequired){await this.beginMfaEnrollment();return;}
    if(result?.body?.mfaRequired){this.renderGate('mfa');return;}
    this.renderGate('signin');
  }

  isAuthorized(body){return Boolean(body?.ownerVerified===true&&body?.emailVerified===true&&body?.mfaVerified===true&&body?.recoveryCodesReady===true&&body?.environment==='staging');}

  securityMap(){return `<section class="admin-security-map" aria-label="Proteções obrigatórias"><span><b>PROPRIETÁRIA</b>Conta verificada</span><span><b>MFA</b>Obrigatório</span><span><b>SESSÃO</b>Cookie seguro</span><span><b>PRODUÇÃO</b>Bloqueada</span></section>`;}

  modulePreview(){return `<section class="admin-gate-map"><header><p class="eyebrow">MAPA DO PAINEL</p><h3>O site inteiro em 18 áreas protegidas.</h3></header><div>${ADMIN_POLICY.modules.map(module=>`<span><i>${module.sigil}</i><b>${safe(module.name)}</b><small>${safe(module.group)}</small></span>`).join('')}</div></section>`;}

  renderGate(mode='signin'){
    if(!this.root)return;
    const checking=mode==='checking',serverRequired=mode==='server-required',mfa=mode==='mfa',enroll=mode==='enroll',recovery=mode==='recovery',recoverAccess=mode==='recover-access';
    const title=checking?'Verificando sessão segura…':serverRequired?'O painel está protegido.':enroll?'Ative o seu MFA.':mfa?'Confirme seu segundo fator.':recovery?'Guarde seus códigos de recuperação.':recoverAccess?'Recupere o acesso com segurança.':'Entre na sua Central.';
    const copy=serverRequired?'Conecte o backend seguro para liberar o acesso. Não existe senha administrativa dentro dos arquivos públicos do site.':enroll?'Leia o QR Code no aplicativo autenticador e confirme os seis números.':mfa?'Digite o código do seu aplicativo autenticador. Códigos não são salvos neste aparelho.':recovery?'Eles aparecem uma única vez e não entram em logs, arquivos ou diagnósticos.':recoverAccess?'Use um código guardado. Ele será consumido e todos os fatores MFA atuais serão revogados.':'O servidor precisa confirmar sua conta proprietária, e-mail verificado e MFA antes de enviar qualquer dado administrativo.';
    const form=checking?'<div class="admin-gate-loading" aria-label="Carregando"></div>':serverRequired?'<aside class="admin-server-note"><b>Bloqueio correto</b><span>A prévia abaixo mostra a estrutura, mas nenhum dado ou controle foi entregue ao navegador.</span></aside>':enroll?this.mfaEnrollmentForm():mfa?this.mfaForm():recovery?this.recoveryForm():recoverAccess?this.recoveryAccessForm():this.signInForm();
    this.root.innerHTML=`<div class="admin-v144-gate"><section class="admin-gate-card"><span class="admin-staging-badge">STAGING · OWNER ONLY</span><div class="admin-gate-sigil" aria-hidden="true">♕</div><p class="eyebrow">CENTRAL DA PROPRIETÁRIA</p><h3>${title}</h3><p>${copy}</p>${form}<p class="admin-gate-status" data-admin-gate-status role="status" aria-live="polite"></p></section>${this.securityMap()}${this.modulePreview()}</div>`;
    this.bindGate();
  }

  signInForm(){return `<form class="admin-auth-form" data-admin-signin novalidate><label><span>E-mail da proprietária</span><input type="email" name="email" autocomplete="username" required></label><label><span>Senha</span><input type="password" name="password" autocomplete="current-password" required minlength="12"></label><button type="submit">CONTINUAR COM SEGURANÇA</button></form>`;}
  mfaForm(){return `<form class="admin-auth-form" data-admin-mfa novalidate><label><span>Código MFA</span><input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="000000"></label><button type="submit">VERIFICAR E ABRIR PAINEL</button><button type="button" data-admin-recover>PERDI O AUTENTICADOR</button><button type="button" data-back-signin>VOLTAR</button></form>`;}
  mfaEnrollmentForm(){return `<form class="admin-auth-form admin-mfa-enrollment" data-admin-mfa novalidate><img data-admin-mfa-qr alt="QR Code para ativar MFA"><label><span>Chave manual</span><output data-admin-mfa-secret>Preparando…</output></label><label><span>Código de confirmação</span><input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="000000"></label><button type="submit">ATIVAR MFA</button><button type="button" data-back-signin>VOLTAR</button></form>`;}
  recoveryForm(){return `<section class="admin-recovery-setup"><button type="button" data-create-recovery>GERAR 10 CÓDIGOS</button><div data-recovery-codes></div></section>`;}
  recoveryAccessForm(){return `<form class="admin-auth-form" data-admin-recovery-access novalidate><label><span>Código de recuperação</span><input type="text" name="recoveryCode" autocomplete="off" autocapitalize="characters" pattern="[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}" maxlength="11" required placeholder="XXX-XXX-XXX"></label><button type="submit">RECUPERAR E REVOGAR MFA ANTIGO</button><button type="button" data-back-mfa>VOLTAR</button></form>`;}

  bindGate(){
    this.root.querySelector('[data-admin-signin]')?.addEventListener('submit',event=>this.signIn(event));
    this.root.querySelector('[data-admin-mfa]')?.addEventListener('submit',event=>this.verifyMfa(event));
    this.root.querySelector('[data-create-recovery]')?.addEventListener('click',event=>this.createRecoveryCodes(event.currentTarget));
    this.root.querySelector('[data-admin-recover]')?.addEventListener('click',()=>this.renderGate('recover-access'));
    this.root.querySelector('[data-admin-recovery-access]')?.addEventListener('submit',event=>this.recoverMfa(event));
    this.root.querySelector('[data-back-mfa]')?.addEventListener('click',()=>this.renderGate('mfa'));
    this.root.querySelector('[data-back-signin]')?.addEventListener('click',()=>this.renderGate('signin'));
  }

  setGateStatus(message,error=false){const element=this.root.querySelector('[data-admin-gate-status]');if(element){element.textContent=message;element.classList.toggle('is-error',error);}}

  async signIn(event){
    event.preventDefault();
    const form=event.currentTarget,email=String(form.elements.email.value||'').trim(),password=String(form.elements.password.value||'');
    if(!email.includes('@')||password.length<12){this.setGateStatus('Informe um e-mail válido e sua senha completa.',true);return;}
    form.querySelector('button').disabled=true;this.setGateStatus('Confirmando identidade…');
    const result=await globalThis.divinaAuth.adminSignIn(email,password);
    if(result?.ok&&result.body?.mfaEnrollmentRequired){await this.beginMfaEnrollment();return;}
    if(result?.ok&&result.body?.mfaRequired){this.renderGate('mfa');return;}
    if(result?.ok&&this.isAuthorized(result.body)){this.session=result.body;await this.loadOverview();this.renderPanel();return;}
    this.setGateStatus(result?.status===403?'Esta conta não possui acesso à Central.':'Não foi possível confirmar a proprietária.',true);form.querySelector('button').disabled=false;
  }

  async verifyMfa(event){
    event.preventDefault();
    const form=event.currentTarget,code=String(form.elements.code.value||'').replace(/\D/g,'');
    if(code.length!==6){this.setGateStatus('Digite os seis números do código MFA.',true);return;}
    form.querySelector('button').disabled=true;this.setGateStatus('Verificando MFA…');
    const result=await globalThis.divinaAuth.adminVerifyMfa(code,this.mfaFactorId);
    if(result?.ok&&this.isAuthorized(result.body)){this.session=result.body;await this.loadOverview();this.renderPanel();return;}
    if(result?.ok&&result.body?.recoveryCodesRequired){this.renderGate('recovery');return;}
    this.setGateStatus('Código inválido ou expirado.',true);form.querySelector('button').disabled=false;
  }

  async beginMfaEnrollment(){
    this.renderGate('enroll');this.setGateStatus('Criando fator TOTP…');
    const result=await globalThis.divinaAuth.adminEnrollMfa();
    if(!result?.ok){this.setGateStatus('Não foi possível iniciar o MFA.',true);return;}
    this.mfaFactorId=String(result.body?.factorId||'');
    const image=this.root.querySelector('[data-admin-mfa-qr]'),secret=this.root.querySelector('[data-admin-mfa-secret]');
    if(image&&result.body?.qrCode)image.src=result.body.qrCode;
    if(secret)secret.textContent=String(result.body?.secret||'');
    this.setGateStatus('Escaneie e confirme o primeiro código.');
  }

  async createRecoveryCodes(button){
    button.disabled=true;this.setGateStatus('Gerando códigos no servidor…');
    const result=await globalThis.divinaAuth.adminCreateRecoveryCodes();
    if(!result?.ok){button.disabled=false;this.setGateStatus('Não foi possível gerar os códigos.',true);return;}
    const codes=Array.isArray(result.body?.codes)?result.body.codes:[],zone=this.root.querySelector('[data-recovery-codes]');
    zone.innerHTML=`<p><b>Copie agora. Esta lista não será exibida novamente.</b></p><ol>${codes.map(code=>`<li><code>${safe(code)}</code></li>`).join('')}</ol><button type="button" data-recovery-confirm>JÁ GUARDEI EM LOCAL SEGURO</button>`;
    button.remove();zone.querySelector('[data-recovery-confirm]')?.addEventListener('click',async()=>{const session=await globalThis.divinaAuth.adminSession();if(this.isAuthorized(session?.body)){this.session=session.body;await this.loadOverview();this.renderPanel();}});
    this.setGateStatus('Códigos criados. Eles não serão salvos neste navegador.');
  }

  async recoverMfa(event){
    event.preventDefault();const form=event.currentTarget,code=String(form.elements.recoveryCode.value||'').trim().toUpperCase();
    if(!/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code)){this.setGateStatus('Digite o código completo no formato XXX-XXX-XXX.',true);return;}
    form.querySelector('button').disabled=true;this.setGateStatus('Validando e revogando o MFA antigo…');
    const result=await globalThis.divinaAuth.adminRecoverMfa(code);
    if(result?.ok&&result.body?.recoveryAccepted){this.renderGate('signin');this.setGateStatus('Código aceito. Entre novamente para cadastrar um novo MFA.');return;}
    form.querySelector('button').disabled=false;this.setGateStatus('Código inválido, usado ou indisponível.',true);
  }

  async loadOverview(){const result=await globalThis.divinaAuth.adminOverview();this.overview=result?.ok&&result.body?result.body:{};}

  metrics(){
    const source=this.overview||{};
    return [
      ['Usuárias ativas',integer(source.activeUsers)],
      ['Receita sandbox',money(source.sandboxRevenue)],
      ['Consultas abertas',integer(source.openConsultations)],
      ['Créditos IA usados',integer(source.aiCreditsUsed)],
      ['Cartas oficiais',78],
      ['Módulos da Escola',17]
    ];
  }

  renderPanel(){
    if(!this.root||!this.session)return;
    const module=adminModuleById(this.selected);
    this.root.innerHTML=`<div class="admin-v144-shell"><header class="admin-command-header"><div><span class="admin-staging-badge">STAGING · MFA ATIVO</span><p class="eyebrow">CENTRAL DA PROPRIETÁRIA</p><h3>Comando da Divina Bruxa</h3></div><div class="admin-owner-state"><span>SESSÃO PROTEGIDA</span><b>${safe(this.session.displayName||'Proprietária')}</b><button type="button" data-admin-logout>SAIR E BLOQUEAR</button></div></header>${this.securityMap()}<div class="admin-command-layout"><aside class="admin-sidebar"><label><span>Buscar módulo</span><input type="search" data-admin-search placeholder="Ex.: Consultas"></label><nav aria-label="Módulos administrativos">${this.navMarkup('')}</nav></aside><main class="admin-workspace" aria-labelledby="adminWorkspaceTitle"><header><div><p class="eyebrow">${safe(module.group)}</p><h3 id="adminWorkspaceTitle">${module.sigil} ${safe(module.name)}</h3><p>${safe(module.description)}</p></div><button type="button" data-refresh-module>ATUALIZAR</button></header><div data-admin-module-content>${this.moduleContent(module.id)}</div></main></div><p class="admin-live" data-admin-live role="status" aria-live="polite"></p></div>`;
    this.bindPanel();
  }

  navMarkup(query){const q=String(query||'').toLocaleLowerCase('pt-BR');return ADMIN_POLICY.modules.filter(module=>!q||`${module.name} ${module.group}`.toLocaleLowerCase('pt-BR').includes(q)).map(module=>`<button type="button" data-admin-module="${module.id}" aria-current="${module.id===this.selected?'page':'false'}"><i>${module.sigil}</i><span><b>${safe(module.name)}</b><small>${safe(module.group)}</small></span></button>`).join('')||'<p>Nenhum módulo encontrado.</p>';}

  moduleContent(id){
    if(id==='today')return this.todayContent();
    if(id==='consultations')return this.consultationsContent();
    if(id==='security')return this.securityContent();
    if(id==='audit')return this.auditContent();
    const module=adminModuleById(id);
    return `<section class="admin-module-overview"><div class="admin-module-orb">${module.sigil}</div><h4>${safe(module.name)}</h4><p>${safe(module.description)}</p><dl><div><dt>Ambiente</dt><dd>STAGING</dd></div><div><dt>Acesso</dt><dd>OWNER + MFA</dd></div><div><dt>Dados privados</dt><dd>NÃO EXIBIDOS</dd></div></dl><button type="button" data-load-remote="${module.id}">CARREGAR DADOS SANITIZADOS</button><p data-module-state>Pronto para conexão segura com o backend.</p></section>`;
  }

  todayContent(){return `<section class="admin-today"><div class="admin-metric-grid">${this.metrics().map(([label,value])=>`<article><small>${safe(label)}</small><strong>${safe(value)}</strong></article>`).join('')}</div><div class="admin-today-grid"><article><p class="eyebrow">AÇÕES RÁPIDAS</p><h4>Abra o que precisa cuidar.</h4><div>${['consultations','finance','ai','notifications'].map(id=>{const module=adminModuleById(id);return `<button type="button" data-admin-module="${id}"><span>${module.sigil}</span>${safe(module.name)}</button>`;}).join('')}</div></article><article><p class="eyebrow">PRIVACIDADE ATIVA</p><h4>O painel enxerga números, não intimidades.</h4><ul><li>Corpo do Diário oculto</li><li>Prompts e respostas da IA ocultos</li><li>Perguntas de consulta ocultas</li><li>Senhas e segredos nunca retornam</li></ul></article></div></section>`;}

  consultationsContent(){
    const requests=store.get('consultation-requests-v147',store.get('consultation-requests-v143',[])).slice(0,8);
    return `<section class="admin-consultations"><article class="admin-price-editor"><header><div><p class="eyebrow">PREÇOS FUTUROS</p><h4>Tabela de Consultas</h4><span>Pedidos antigos mantêm o price_snapshot original.</span></div><b>ALTERAÇÃO CRÍTICA · EXIGE MFA</b></header><form data-price-form>${CONSULTATION_POLICY.services.map(service=>{const remoteCents=Number(this.overview?.consultationPrices?.[service.id]);const current=Number.isFinite(remoteCents)&&remoteCents>0?remoteCents/100:service.price;return `<label><span>${safe(service.name)}</span><div><small>R$</small><input name="${safe(service.id)}" type="number" min="1" max="5000" step="1" inputmode="decimal" value="${current}" required></div></label>`;}).join('')}<button type="submit">REVISAR NOVOS PREÇOS</button></form><div data-price-confirm></div></article><article class="admin-request-ledger"><header><div><p class="eyebrow">ESTE APARELHO</p><h4>Pedidos preparados</h4></div><strong>${requests.length}</strong></header>${requests.length?`<div class="admin-request-list">${requests.map(item=>`<span><b>${safe(item.price_snapshot?.serviceName||item.serviceId)}</b><small>${money(item.price_snapshot?.price)} · ${safe(item.status)}</small><em>${safe(String(item.createdAt||'').slice(0,10))}</em></span>`).join('')}</div>`:'<p>Nenhum pedido preparado neste aparelho.</p>'}<small>Nome, contato e pergunta não são exibidos nesta visão.</small></article></section>`;
  }

  securityContent(){return `<section class="admin-security-panel"><div class="admin-flag-grid">${Object.entries(ADMIN_POLICY.flags).map(([key,value])=>`<article><span>${safe(key.replaceAll(/([A-Z])/g,' $1'))}</span><b>${value?'ATIVO':'BLOQUEADO'}</b></article>`).join('')}</div><article><p class="eyebrow">CONTROLES OBRIGATÓRIOS</p><h4>Segurança sem atalhos.</h4><ul><li>E-mail da proprietária verificado</li><li>MFA e códigos de recuperação</li><li>Cookie seguro e sessão revogável</li><li>Step-up para preços, billing e publicação</li><li>RLS e validação de papel no servidor</li><li>403 sem qualquer dado para contas comuns</li></ul></article></section>`;}

  auditContent(){return `<section class="admin-audit-panel"><p class="eyebrow">DIAGNÓSTICO SANITIZADO</p><h4>Auditoria sem conteúdo privado.</h4><p>O arquivo contém somente ambiente, estados de segurança, módulos e contadores autorizados.</p><button type="button" data-export-diagnostic>EXPORTAR DIAGNÓSTICO</button><small>Diário, perguntas, prompts, respostas, contatos, senhas e segredos são excluídos.</small></section>`;}

  bindPanel(){
    this.root.querySelector('[data-admin-logout]')?.addEventListener('click',()=>this.signOut());
    this.root.querySelectorAll('[data-admin-module]').forEach(button=>button.addEventListener('click',()=>{this.selected=button.dataset.adminModule;this.pendingPrices=null;this.renderPanel();this.root.querySelector('.admin-workspace')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});}));
    const search=this.root.querySelector('[data-admin-search]');
    search?.addEventListener('input',()=>{const nav=this.root.querySelector('.admin-sidebar nav');nav.innerHTML=this.navMarkup(search.value);nav.querySelectorAll('[data-admin-module]').forEach(button=>button.addEventListener('click',()=>{this.selected=button.dataset.adminModule;this.renderPanel();}));});
    this.root.querySelector('[data-refresh-module]')?.addEventListener('click',()=>this.refreshModule());
    this.root.querySelector('[data-load-remote]')?.addEventListener('click',event=>this.loadModule(event.currentTarget.dataset.loadRemote));
    this.root.querySelector('[data-price-form]')?.addEventListener('submit',event=>this.reviewPrices(event));
    this.root.querySelector('[data-export-diagnostic]')?.addEventListener('click',()=>this.exportDiagnostic());
  }

  live(message){const element=this.root.querySelector('[data-admin-live]');if(element)element.textContent=message;this.notify(message);}
  async refreshModule(){await this.loadOverview();this.renderPanel();this.live('Dados sanitizados atualizados.');}
  async loadModule(id){const result=await globalThis.divinaAuth.adminModule(id);const state=this.root.querySelector('[data-module-state]');if(state)state.textContent=result?.ok?'Dados sanitizados recebidos do staging.':'Não foi possível atualizar este módulo.';}

  reviewPrices(event){
    event.preventDefault();
    const values=Object.fromEntries(new FormData(event.currentTarget));
    const prices=Object.fromEntries(ADMIN_POLICY.consultationPriceFields.map(id=>[id,Math.round(Number(values[id])*100)]));
    if(Object.values(prices).some(value=>!Number.isInteger(value)||value<100||value>500000)){this.live('Revise os quatro preços antes de continuar.');return;}
    this.pendingPrices=prices;
    const zone=this.root.querySelector('[data-price-confirm]');
    zone.innerHTML=`<aside class="admin-critical-confirm"><span>STEP-UP OBRIGATÓRIO</span><h4>Confirmar preços futuros?</h4><ul>${CONSULTATION_POLICY.services.map(service=>`<li><b>${safe(service.name)}</b><em>${money(prices[service.id]/100)}</em></li>`).join('')}</ul><label>Código MFA atual<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-step-up-code placeholder="000000"></label><p>Pedidos antigos não serão recalculados.</p><div><button type="button" data-confirm-prices>CONFIRMAR NO STAGING</button><button type="button" data-cancel-prices>CANCELAR</button></div></aside>`;
    zone.querySelector('[data-confirm-prices]').addEventListener('click',()=>this.savePrices());
    zone.querySelector('[data-cancel-prices]').addEventListener('click',()=>{this.pendingPrices=null;zone.innerHTML='';});
    zone.querySelector('input').focus();
  }

  async savePrices(){
    const code=String(this.root.querySelector('[data-step-up-code]')?.value||'').replace(/\D/g,'');
    if(code.length!==6){this.live('Digite os seis números do MFA para confirmar.');return;}
    const button=this.root.querySelector('[data-confirm-prices]');button.disabled=true;
    const result=await globalThis.divinaAuth.adminUpdateConsultationPrices(this.pendingPrices,code);
    if(result?.ok){this.pendingPrices=null;await this.loadOverview();this.renderPanel();this.live('Novos preços enviados ao staging. Pedidos antigos foram preservados.');return;}
    button.disabled=false;this.live('Alteração recusada. Confirme o MFA e tente novamente.');
  }

  async exportDiagnostic(){
    const result=await globalThis.divinaAuth.adminExportDiagnostic();
    if(!result?.ok){this.live('O diagnóstico não pôde ser autorizado.');return;}
    const source=result.body||{};
    const payload={schema:'divina-bruxa-admin-diagnostic-v145',environment:'staging',generatedAt:new Date().toISOString(),flags:ADMIN_POLICY.flags,privacy:ADMIN_POLICY.privacy,counters:{activeUsers:integer(source.activeUsers),openConsultations:integer(source.openConsultations),auditEvents:integer(source.auditEvents)},modules:ADMIN_POLICY.modules.map(({id,name})=>({id,name}))};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),anchor=document.createElement('a');
    anchor.href=URL.createObjectURL(blob);anchor.download=`divina-bruxa-diagnostico-${new Date().toISOString().slice(0,10)}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(anchor.href),1000);this.live('Diagnóstico sanitizado exportado.');
  }

  async signOut(){await globalThis.divinaAuth.adminSignOut();this.session=null;this.overview=null;this.renderGate('signin');this.notify('Central bloqueada com segurança.');}
}
