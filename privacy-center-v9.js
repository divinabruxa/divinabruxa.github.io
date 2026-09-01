/* DIVINA BRUXA — PRIVACY CENTER V9
   Preferências locais e transparência. Não autentica, não sincroniza e não
   lê o corpo do Diário. A camada de servidor será conectada somente no staging.
*/
const KEY='divina-privacy-preferences-v9';
const DEFAULTS=Object.freeze({analytics:false,marketing:false,essential:true,updatedAt:null,version:'v9.8'});
const safeRead=()=>{try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...DEFAULTS}}};
const safeWrite=value=>{try{localStorage.setItem(KEY,JSON.stringify(value));return true}catch{return false}};
export const getPrivacyPreferences=()=>Object.freeze(safeRead());
export const setPrivacyPreferences=patch=>{const next={...safeRead(),...patch,essential:true,updatedAt:new Date().toISOString(),version:'v9.8'};safeWrite(next);window.dispatchEvent(new CustomEvent('divina:privacy-change',{detail:{...next}}));return Object.freeze(next)};
export const revokeOptionalConsent=()=>setPrivacyPreferences({analytics:false,marketing:false});
export const privacyCapabilities=Object.freeze({localPreferences:true,serverAuth:false,diaryBodyAccess:false,realSync:false,exportRequest:false,deleteRequest:false});
export const renderPrivacyNotice=(root)=>{if(!root)return false;root.innerHTML='<div class="privacy-v9"><span class="privacy-v9-sigil" aria-hidden="true">✦</span><div><p class="eyebrow">CENTRO DE PRIVACIDADE</p><h3>Seu espaço continua seu.</h3><p>O Diário é privado por padrão. Esta versão guarda somente preferências essenciais neste aparelho; ela não lê nem envia o texto das suas memórias.</p><button type="button" data-privacy-revoke>Desativar métricas opcionais</button></div></div>';root.querySelector('[data-privacy-revoke]')?.addEventListener('click',()=>{revokeOptionalConsent();root.querySelector('button').textContent='Métricas opcionais desativadas';});return true};
