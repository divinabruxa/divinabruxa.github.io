/* DIVINA BRUXA 3.0 — SEGURANÇA, PRIVACIDADE E MATRIZ FÍSICA · V547
   Camada pública leve: nenhum loop, observer, API, leitura privada ou escrita
   de armazenamento. Protege navegação externa e apaga campos sensíveis ao
   abandonar uma rota sem interferir na Orbe canônica. */

export const SECURITY_PRIVACY_CONTRACT_V547=Object.freeze({
  release:'V547',
  macroStage:'13-of-14',
  title:'Segurança, Privacidade e Matriz Física',
  admin:Object.freeze({ownerAuthority:'server-hash-auth',verifiedEmail:true,mfaAal2:true,recoveryCodes:true,transactionalRateLimit:true,requestBodyLimits:true}),
  privacy:Object.freeze({journalInAnalytics:false,consultationQuestionInAnalytics:false,aiPromptInAdmin:false,aiResponseInAdmin:false,preciseLocation:false,analyticsRetentionDays:90}),
  continuity:Object.freeze({policyConfigured:true,backupAutomationVerified:false,restoreVerified:false,storageObjectsSeparate:true}),
  physicalMatrix:Object.freeze({profiles:9,automaticPhysicalPasses:0,localOnly:true,sanitizedExport:true}),
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  mutationObservers:0,
  permanentLoops:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  environment:'staging'
});

const INSTANCE=Symbol.for('divina.security.privacy.v547');
const STYLE_ID='divinaSecurityPrivacyV547Styles';
const STYLE_HREF='./security-privacy-core-v547.css?v=547';
const SENSITIVE_SELECTOR='input[type="password"],input[autocomplete="one-time-code"],input[name*="recovery" i],input[name*="mfa" i],input[name*="otp" i]';
const SENSITIVE_OUTPUT_SELECTOR='output[data-admin-mfa-secret],[data-recovery-codes] code';
const SENSITIVE_IMAGE_SELECTOR='img[data-admin-mfa-qr]';

const installStyle=()=>{
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href=STYLE_HREF;
  document.head.append(link);
};

const protectExternalNavigation=(root=document)=>{
  let protectedLinks=0,protectedFrames=0;
  root.querySelectorAll?.('a[target="_blank"]').forEach(anchor=>{
    const rel=new Set(String(anchor.getAttribute('rel')||'').split(/\s+/).filter(Boolean));
    rel.add('noopener');rel.add('noreferrer');
    anchor.setAttribute('rel',[...rel].join(' '));
    anchor.referrerPolicy='strict-origin-when-cross-origin';
    protectedLinks+=1;
  });
  root.querySelectorAll?.('iframe').forEach(frame=>{
    if(!frame.hasAttribute('referrerpolicy'))frame.referrerPolicy='strict-origin-when-cross-origin';
    if(!frame.hasAttribute('loading'))frame.loading='lazy';
    protectedFrames+=1;
  });
  return Object.freeze({protectedLinks,protectedFrames});
};

const clearSensitiveFields=(root=document)=>{
  let cleared=0;
  root.querySelectorAll?.(SENSITIVE_SELECTOR).forEach(input=>{
    if(input.value){input.value='';cleared+=1;}
  });
  root.querySelectorAll?.(SENSITIVE_OUTPUT_SELECTOR).forEach(output=>{
    if(output.textContent){output.textContent='';cleared+=1;}
  });
  root.querySelectorAll?.(SENSITIVE_IMAGE_SELECTOR).forEach(image=>{
    if(image.getAttribute('src')){image.removeAttribute('src');cleared+=1;}
  });
  return cleared;
};

class SecurityPrivacyCoreV547{
  constructor(){
    this.abort=new AbortController();
    this.lastProtection=Object.freeze({protectedLinks:0,protectedFrames:0});
    this.clearedFields=0;
    installStyle();
    this.protect('boot');
    this.bind();
    document.documentElement.dataset.securityPrivacy='v547';
  }

  bind(){
    const {signal}=this.abort;
    document.addEventListener('divina:page-ready',()=>this.protect('page-ready'),{passive:true,signal});
    document.addEventListener('divina:route-start',()=>{this.clearedFields+=clearSensitiveFields();},{passive:true,signal});
    addEventListener('pagehide',()=>{this.clearedFields+=clearSensitiveFields();},{passive:true,signal});
  }

  protect(reason='manual'){
    const result=protectExternalNavigation(document);
    this.lastProtection=Object.freeze({...result,reason});
    return this.lastProtection;
  }

  clearSensitive(){
    const count=clearSensitiveFields(document);
    this.clearedFields+=count;
    return count;
  }

  status(){
    return Object.freeze({...SECURITY_PRIVACY_CONTRACT_V547,ready:true,lastProtection:this.lastProtection,clearedFields:this.clearedFields});
  }

  audit(){
    const policy=document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return Object.freeze({
      release:'V547',
      cspMetaPresent:Boolean(policy?.content),
      referrerPolicyPresent:Boolean(document.querySelector('meta[name="referrer"]')),
      targetBlankWithoutProtection:document.querySelectorAll('a[target="_blank"]:not([rel~="noopener"])').length,
      sensitiveFieldsWithValue:document.querySelectorAll(`${SENSITIVE_SELECTOR}`).length
        ?[...document.querySelectorAll(SENSITIVE_SELECTOR)].filter(input=>Boolean(input.value)).length:0,
      sensitiveOutputsWithValue:[...document.querySelectorAll(SENSITIVE_OUTPUT_SELECTOR)].filter(output=>Boolean(output.textContent)).length,
      sensitiveQrImagesWithSource:document.querySelectorAll(`${SENSITIVE_IMAGE_SELECTOR}[src]`).length,
      livingOrbCount:document.querySelectorAll('[data-supreme-orb="living"]').length,
      oneCanonicalOrb:document.querySelectorAll('[data-supreme-orb="living"]').length<=1,
      physicalPassesClaimedAutomatically:0,
      mutationObservers:0,permanentLoops:0,privateContentReads:0,storageReads:0,storageWrites:0,apiCalls:0
    });
  }

  destroy(){
    this.abort.abort();
    this.clearSensitive();
    delete document.documentElement.dataset.securityPrivacy;
    if(globalThis[INSTANCE]===this)delete globalThis[INSTANCE];
  }
}

export const createSecurityPrivacyCoreV547=()=>{
  if(globalThis[INSTANCE])return globalThis[INSTANCE];
  if(typeof document==='undefined'||typeof window==='undefined')return null;
  const core=new SecurityPrivacyCoreV547();
  globalThis[INSTANCE]=core;
  globalThis.divinaSecurityPrivacyV547=core;
  document.dispatchEvent(new CustomEvent('divina:security-privacy-ready',{detail:{release:'V547',macroStage:'13-of-14',physicalPassesClaimedAutomatically:0}}));
  return core;
};
