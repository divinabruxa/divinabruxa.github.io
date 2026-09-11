/* DIVINA BRUXA — PRIVACY CENTER V9 · REBIRTH R024 / V323
   Preferências opcionais locais + registro de consentimento na Conta quando houver sessão.
   Nunca lê Diário, Tiragens, notas da Escola, prompts/respostas Whit ou perguntas de Consulta. */

import { CONFIG } from './config-v200.js?v=200';
import { AuthClientV201 } from './auth-client-v201.js?v=201';

const KEY='divina-privacy-preferences-v9';
const POLICY_VERSION='privacy-v323-2026-09-10';
const SOURCE='privacy-center-web-v323';
const DEFAULTS=Object.freeze({
  analytics:false,
  marketing:false,
  essential:true,
  updatedAt:null,
  version:POLICY_VERSION
});

let syncClient=null;
let syncUser=null;
let syncing=false;

const safeRead=()=>{
  try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}'),essential:true};}
  catch{return {...DEFAULTS};}
};
const safeWrite=value=>{
  try{localStorage.setItem(KEY,JSON.stringify(value));return true;}
  catch{return false;}
};

export const getPrivacyPreferences=()=>Object.freeze(safeRead());

async function appendConsent(key,granted){
  if(!syncClient||!syncUser?.id)return false;
  const result=await syncClient.restRequest('consent_events',{
    method:'POST',
    prefer:'return=minimal',
    body:{
      user_id:syncUser.id,
      consent_key:key,
      granted:granted===true,
      policy_version:POLICY_VERSION,
      source:SOURCE
    }
  });
  return result?.ok===true;
}

async function syncConsentSnapshot(value){
  if(syncing||!syncUser?.id)return false;
  syncing=true;
  try{
    const results=await Promise.allSettled([
      appendConsent('analytics_optional',value.analytics===true),
      appendConsent('marketing_optional',value.marketing===true)
    ]);
    return results.every(item=>item.status==='fulfilled'&&item.value===true);
  }finally{syncing=false;}
}

export const setPrivacyPreferences=patch=>{
  const next={
    ...safeRead(),
    ...patch,
    essential:true,
    updatedAt:new Date().toISOString(),
    version:POLICY_VERSION
  };
  safeWrite(next);
  window.dispatchEvent(new CustomEvent('divina:privacy-change',{detail:{...next}}));
  if(syncUser?.id)syncConsentSnapshot(next).then(ok=>{
    window.dispatchEvent(new CustomEvent('divina:privacy-sync',{detail:{ok,at:new Date().toISOString()}}));
  }).catch(()=>{});
  return Object.freeze(next);
};

export const revokeOptionalConsent=()=>setPrivacyPreferences({analytics:false,marketing:false});

export const privacyCapabilities=Object.freeze({
  localPreferences:true,
  serverAuth:true,
  consentLog:true,
  diaryBodyAccess:false,
  silentPrivateReads:false,
  accountControlledSync:true,
  exportRequest:true,
  deleteRequest:true,
  preciseLocation:false
});

const permissionCopy=connected=>connected
  ? 'Conta conectada: ao salvar, analytics e marketing opcionais também recebem um registro de consentimento no STAGING.'
  : 'Sem Conta conectada: suas escolhas continuam válidas neste aparelho. Entre na Conta se quiser um histórico de consentimento vinculado à conta.';

function centerMarkup(){
  const state=safeRead();
  const connected=Boolean(syncUser?.id);
  return `<section class="privacy-v323" aria-labelledby="privacyCenterTitle">
    <div class="privacy-v323__stars" aria-hidden="true"><i></i><i></i><i></i></div>
    <header class="privacy-v323__head">
      <div><p class="eyebrow">CENTRO DE PRIVACIDADE · V323</p>
      <h2 id="privacyCenterTitle">Seu espaço continua seu.</h2>
      <p>Escolha métricas opcionais e marketing sem abrir acesso às suas intimidades. Dados essenciais de segurança continuam separados dessas escolhas.</p></div>
      <span class="privacy-v323__seal" aria-hidden="true">◇</span>
    </header>

    <div class="privacy-v323__status">
      <span><b>${connected?'CONTA CONECTADA':'SOMENTE NESTE APARELHO'}</b><small>${permissionCopy(connected)}</small></span>
      <span><b>ESSENCIAL · ATIVO</b><small>sessão, segurança, prevenção de abuso e funções que você solicita</small></span>
    </div>

    <form class="privacy-v323__form" data-privacy-form>
      <label>
        <span><b>Métricas opcionais</b><small>Eventos de produto permitidos e agregados. Nunca inclui texto do Diário, pergunta de Consulta, conteúdo da Whit ou localização precisa.</small></span>
        <input type="checkbox" name="analytics" ${state.analytics?'checked':''}><i aria-hidden="true"></i>
      </label>
      <label>
        <span><b>Marketing opcional</b><small>Permite registrar sua preferência de marketing. Isso não ativa notificações promocionais por si só; elas continuam com opt-in próprio na página Notificações.</small></span>
        <input type="checkbox" name="marketing" ${state.marketing?'checked':''}><i aria-hidden="true"></i>
      </label>
      <div class="privacy-v323__actions">
        <button type="submit" class="primary">SALVAR MINHAS ESCOLHAS</button>
        <button type="button" data-privacy-revoke>DESATIVAR OPCIONAIS</button>
      </div>
      <p data-privacy-feedback role="status" aria-live="polite">${state.updatedAt?'Preferências locais já registradas neste aparelho.':'Nenhuma escolha opcional foi registrada ainda.'}</p>
    </form>

    <section class="privacy-v323__rights" aria-label="Controles de dados">
      <article><span>⇩</span><p><b>Baixar meus dados</b><small>A exportação autenticada continua dentro da Conta segura.</small></p><a href="./index.html#login">ABRIR MINHA CONTA</a></article>
      <article><span>⊘</span><p><b>Excluir minha conta</b><small>A exclusão exige o fluxo autenticado da Conta; o Centro de Privacidade não contorna essa proteção.</small></p><a href="./index.html#login">IR PARA CONTROLES DA CONTA</a></article>
      <article><span>☾</span><p><b>Diário</b><small>Permanece local por padrão. Sincronização é um controle separado na Conta.</small></p><a href="./index.html#journal">ABRIR DIÁRIO</a></article>
      <article><span>✦</span><p><b>Whit</b><small>Contexto privado só atravessa após seleção e consentimento explícitos.</small></p><a href="./index.html#ai">ABRIR ORBE IA</a></article>
    </section>

    <footer class="privacy-v323__truth">
      <b>Este Centro não é uma certificação jurídica.</b>
      <span>Ele implementa controles de produto para transparência, consentimento e direitos de conta. Solicitações também podem ser feitas pelo canal oficial de privacidade.</span>
    </footer>
  </section>`;
}

function bindCenter(root){
  const form=root.querySelector('[data-privacy-form]');
  const feedback=root.querySelector('[data-privacy-feedback]');
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const next=setPrivacyPreferences({
      analytics:Boolean(form.elements.analytics.checked),
      marketing:Boolean(form.elements.marketing.checked)
    });
    if(feedback)feedback.textContent=syncUser?.id
      ?'Escolhas salvas neste aparelho. O registro da Conta está sendo atualizado no STAGING.'
      :'Escolhas salvas neste aparelho.';
  });
  root.querySelector('[data-privacy-revoke]')?.addEventListener('click',()=>{
    const next=revokeOptionalConsent();
    form.elements.analytics.checked=false;
    form.elements.marketing.checked=false;
    if(feedback)feedback.textContent=syncUser?.id
      ?'Métricas e marketing opcionais desativados. A revogação está sendo registrada na Conta.'
      :'Métricas e marketing opcionais desativados neste aparelho.';
  });
  window.addEventListener('divina:privacy-sync',event=>{
    if(feedback&&syncUser?.id)feedback.textContent=event.detail?.ok
      ?'Escolhas salvas e registradas na Conta STAGING.'
      :'Escolhas locais salvas; o registro da Conta não pôde ser confirmado agora.';
  });
}

async function connectAccount(root){
  try{
    syncClient=new AuthClientV201(CONFIG);
    if(!syncClient.enabled)return false;
    const result=await syncClient.restoreSession();
    syncUser=result?.ok?result.body?.user:null;
  }catch{
    syncClient=null;syncUser=null;
  }
  root.innerHTML=centerMarkup();
  bindCenter(root);
  return Boolean(syncUser?.id);
}

export const renderPrivacyNotice=root=>{
  if(!root)return false;
  root.innerHTML=centerMarkup();
  bindCenter(root);
  connectAccount(root).catch(()=>{});
  return true;
};

function autoMount(){
  const root=document.querySelector('[data-privacy-center-v323]');
  if(root)renderPrivacyNotice(root);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoMount,{once:true});
else queueMicrotask(autoMount);
