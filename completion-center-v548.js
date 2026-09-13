/* DIVINA BRUXA 3.0 — CENTRAL DE CONCLUSÃO · MACROETAPA 14/14 · V548
   Só opera dentro do ADMIN autorizado. Lê o JSON físico local e envia apenas
   contagens sanitizadas + SHA-256, nunca os detalhes do aparelho ou conteúdo. */

const RELEASE='V548';
const PROFILE_COUNTS=Object.freeze({
  'iphone-safari':53,'iphone-pwa':57,'ipad-safari':53,'android-chrome':53,
  'android-pwa':57,'mac-safari':49,'desktop-chrome':50,'desktop-firefox':49,'desktop-edge':50
});
const EXPECTED=471;
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const integer=value=>Math.max(0,Math.floor(Number(value)||0));

async function digest(text){
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes),item=>item.toString(16).padStart(2,'0')).join('');
}

export function summarizePhysicalEvidenceV548(raw){
  if(!raw||raw.schema!=='divina-bruxa-physical-matrix-v547'||raw.release!=='V547'||!raw.results||typeof raw.results!=='object')throw new Error('matrix_contract_invalid');
  const totals={passed:0,failed:0,blocked:0,pending:0,profiles:0};
  for(const [profile,expected] of Object.entries(PROFILE_COUNTS)){
    const entries=raw.results[profile];
    if(!entries||typeof entries!=='object'||Array.isArray(entries)){totals.pending+=expected;continue;}
    const values=Object.values(entries);
    if(values.length>expected)throw new Error('matrix_count_invalid');
    let valid=0;
    for(const entry of values){
      const state=String(entry?.status||'');
      if(!['pass','fail','blocked'].includes(state))throw new Error('matrix_status_invalid');
      if(state==='pass')totals.passed+=1;
      if(state==='fail')totals.failed+=1;
      if(state==='blocked')totals.blocked+=1;
      valid+=1;
    }
    totals.pending+=expected-valid;
    if(valid===expected)totals.profiles+=1;
  }
  if(totals.passed+totals.failed+totals.blocked+totals.pending!==EXPECTED)throw new Error('matrix_total_invalid');
  return Object.freeze(totals);
}

export function mergePhysicalEvidenceV548(documents){
  const merged={schema:'divina-bruxa-physical-matrix-v547',release:'V547',results:{}};
  for(const raw of documents){
    if(!raw||raw.schema!==merged.schema||raw.release!=='V547'||!raw.results||typeof raw.results!=='object')throw new Error('matrix_contract_invalid');
    for(const profile of Object.keys(PROFILE_COUNTS)){
      const source=raw.results[profile];if(!source||typeof source!=='object'||Array.isArray(source))continue;
      merged.results[profile]??={};
      for(const [testId,result] of Object.entries(source)){
        const previous=merged.results[profile][testId];
        if(previous&&previous.status!==result?.status)throw new Error('matrix_conflict');
        merged.results[profile][testId]=result;
      }
    }
  }
  return merged;
}

export const COMPLETION_CONTRACT_V548=Object.freeze({
  release:RELEASE,macroStage:'14-of-14',environment:'staging',expectedProfiles:9,
  expectedEvaluations:EXPECTED,automaticPhysicalPasses:0,ownerOnly:true,mfaStepUp:true,
  rawMatrixUpload:false,privateContentReads:0,permanentAnimationLoops:0,
  production:false,realBilling:false,dns:false,storeSubmission:false
});

export class CompletionCenterV548{
  constructor(root,{orbCore=null}={}){
    this.root=root;this.orbCore=orbCore;this.host=null;this.data=null;this.summary=null;this.evidenceHash='';
    this.abort=new AbortController();this.bind();document.documentElement.dataset.completionCenter='v548';
  }
  bind(){
    this.root?.addEventListener('click',event=>{
      const open=event.target.closest?.('[data-v548-open]');if(open){event.preventDefault();this.toggle();return;}
      const refresh=event.target.closest?.('[data-v548-refresh]');if(refresh){event.preventDefault();this.load(true);return;}
    },{signal:this.abort.signal});
    this.root?.addEventListener('change',event=>{if(event.target.matches?.('[data-v548-matrix]'))this.readFile(event.target);},{signal:this.abort.signal});
    this.root?.addEventListener('submit',event=>{if(event.target.matches?.('[data-v548-review]')){event.preventDefault();this.submit(event.target);}},{signal:this.abort.signal});
  }
  mount(crown){
    if(!crown||!this.root?.querySelector('.admin-v144-shell'))return false;
    crown.querySelector('nav')?.insertAdjacentHTML('afterbegin','<button type="button" data-v548-open aria-expanded="false">CONCLUSÃO 14/14</button>');
    this.host=document.createElement('section');this.host.className='cc548';this.host.hidden=true;this.host.setAttribute('aria-label','Central de conclusão do Plano 3.0');
    crown.append(this.host);this.paint();return true;
  }
  toggle(){
    if(!this.host)return;this.host.hidden=!this.host.hidden;
    this.root.querySelector('[data-v548-open]')?.setAttribute('aria-expanded',String(!this.host.hidden));
    if(!this.host.hidden&&!this.data)this.load(false);
    this.orbCore?.pulse?.('owner-final-review',{intensity:.38,privateContentIncluded:false});
  }
  async load(announce=false){
    if(!this.host)return;this.host.dataset.loading='true';this.paint();
    const result=await globalThis.divinaAuth?.adminFinalReadiness?.();
    delete this.host.dataset.loading;
    if(result?.ok)this.data=result.body;else this.data={error:String(result?.body?.error||'readiness_unavailable')};
    this.paint();if(announce)globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:result?.ok?'Conclusão atualizada no STAGING.':'A conclusão não respondeu agora.'}));
  }
  async readFile(input){
    const files=Array.from(input.files||[]);if(!files.length)return;
    try{
      if(files.length>9||files.some(file=>file.size>1024*1024))throw new Error('matrix_too_large');
      const texts=await Promise.all(files.map(file=>file.text())),documents=texts.map(text=>JSON.parse(text));
      const merged=mergePhysicalEvidenceV548(documents);this.summary=summarizePhysicalEvidenceV548(merged);this.evidenceHash=await digest(texts.join('\n--DIVINA-V548--\n'));
      this.paint();this.say(`${files.length} matriz(es) lida(s) localmente. Somente contagens e hash serão enviados após o MFA.`);
    }catch{this.summary=null;this.evidenceHash='';input.value='';this.paint();this.say('Arquivo recusado. Exporte novamente a matriz V547 oficial.');}
  }
  async submit(form){
    if(!this.summary||!/^[0-9a-f]{64}$/.test(this.evidenceHash)){this.say('Selecione primeiro a matriz física V547 exportada.');return;}
    const code=String(form.elements.stepUpCode?.value||'').replace(/\D/g,'');if(code.length!==6){this.say('Digite os seis números do MFA atual.');return;}
    form.elements.stepUpCode.value='';const button=form.querySelector('button[type="submit"]');button.disabled=true;
    const result=await globalThis.divinaAuth.adminRecordFinalReview({...this.summary,evidenceHash:this.evidenceHash,stepUpCode:code});
    this.summary=null;this.evidenceHash='';
    if(result?.ok){await this.load(false);this.say(result.body?.readyToAdminister?'Revisão aceita. A Central confirmou todos os portões.':'Evidência registrada; os bloqueios reais continuam visíveis.');return;}
    button.disabled=false;this.paint();this.say(result?.body?.error==='step_up_failed'?'MFA recusado ou expirado.':'A revisão final não pôde ser registrada.');
  }
  say(message){const live=this.host?.querySelector('[data-v548-live]');if(live)live.textContent=message;}
  gate(label,ok,detail){return `<li class="${ok?'is-ok':'is-blocked'}"><span>${ok?'✓':'!'}</span><p><b>${safe(label)}</b><small>${safe(detail)}</small></p></li>`;}
  paint(){
    if(!this.host)return;const d=this.data||{},physical=d.physical||{},continuity=d.continuity||{},loading=this.host.dataset.loading==='true';
    const imported=this.summary;
    this.host.innerHTML=`<header><div><p class="eyebrow">MACROETAPA 14/14 · V548</p><h3>Central de Conclusão</h3><p>${loading?'Confrontando evidências do STAGING…':'O Plano 3.0 termina por verdade observável, não por um selo decorativo.'}</p></div><strong class="${d.readyToAdminister?'is-ready':'is-action'}">${d.readyToAdminister?'PRONTA PARA ADMINISTRAR':'AÇÃO NECESSÁRIA'}</strong></header>
      <ul class="cc548-gates">
        ${this.gate('Construção técnica',d.technicalConstructionComplete===true,'Macroetapa 14/14 instalada e validada')}
        ${this.gate('Proprietária segura',true,'Sessão atual: owner + e-mail verificado + AAL2 + recovery')}
        ${this.gate('Matriz física',d.ownerReviewStatus==='accepted',`${integer(physical.passed)} passaram · ${integer(physical.failed)} falharam · ${integer(physical.blocked)} bloqueados · ${integer(physical.pending)} pendentes`)}
        ${this.gate('Backup automático',continuity.schedulerConnected===true,`${integer(continuity.reportedRuns)} execução(ões) registrada(s)`) }
        ${this.gate('Restauração real',continuity.restoreVerified===true,`${integer(continuity.verifiedRestores)} restauração(ões) verificada(s)`) }
      </ul>
      <form data-v548-review novalidate><label><span>1 · MATRIZES FÍSICAS V547</span><input type="file" accept="application/json,.json" data-v548-matrix multiple></label>
        ${imported?`<div class="cc548-import"><b>${integer(imported.profiles)}/9 perfis completos</b><span>${integer(imported.passed)} PASS · ${integer(imported.failed)} FAIL · ${integer(imported.blocked)} BLOQUEADOS · ${integer(imported.pending)} PENDENTES</span></div>`:'<p class="cc548-hint">O arquivo fica neste aparelho; o servidor recebe somente 5 contagens e o SHA-256.</p>'}
        <label><span>2 · STEP-UP MFA</span><input name="stepUpCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000"></label>
        <button type="submit" ${imported?'':'disabled'}>REGISTRAR REVISÃO NO STAGING</button></form>
      <footer><a href="laboratorio-fisico-v547.html" target="_blank" rel="noopener noreferrer">ABRIR LABORATÓRIO FÍSICO</a><button type="button" data-v548-refresh>ATUALIZAR PORTÕES</button></footer><p data-v548-live role="status" aria-live="polite"></p>`;
  }
  audit(){return Object.freeze({...COMPLETION_CONTRACT_V548,loaded:Boolean(this.data),matrixInMemory:Boolean(this.summary),readyToAdminister:this.data?.readyToAdminister===true});}
  destroy(){this.abort.abort();this.host?.remove();delete document.documentElement.dataset.completionCenter;}
}

export function createCompletionCenterV548(root,options={}){
  const core=new CompletionCenterV548(root,options);
  globalThis.divinaCompletionCenterV548=Object.freeze({version:548,core,contract:COMPLETION_CONTRACT_V548,audit:()=>core.audit(),permanentAnimationLoops:0,privateContentReads:0});
  return core;
}
