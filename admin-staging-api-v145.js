/* DIVINA BRUXA — SUPABASE EDGE FUNCTION ADMIN API V532
   Observatório owner-only com agregados sanitizados. Segredos existem apenas
   no ambiente da função; textos íntimos e identificadores pessoais não entram
   nos snapshots administrativos. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const RELEASE='V532';
const MODULES=Object.freeze(['today','finance','users','subscriptions','ai','tarot','school','consultations','store','skins','media','notifications','analytics','seo','security','backups','audit','settings']);
const SERVICES=Object.freeze({
  'mesa-real-profissional':'Mesa Real Profissional',
  'leitura-mentes':'Leitura de Pensamentos',
  'carta-conselho':'Carta de Conselho',
  'pergunta-direta':'Pergunta'
});
const NOTIFICATION_CATEGORIES=Object.freeze(['daily_card','school','consultations','account_security','billing','orbe_ai','music','episodes','skins','marketing']);
const NOTIFICATION_DEEP_LINKS=Object.freeze({
  daily_card:'/carta-do-dia',school:'/escola',consultations:'/consultas',account_security:'/conta',billing:'/conta',
  orbe_ai:'/orbe-ia',music:'/musica',episodes:'/de-frente-com-o-tarot',skins:'/skins',marketing:'/skins'
});
const SAFE_DAILY_TITLE='Um novo encontro espera por você';
const SAFE_DAILY_BODY='Sua Carta do Dia espera por você na Orbe.';
const PERSONAL_DATA_PATTERN=/(?:[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-\s]?\d{4})/i;
const COOKIE_ACCESS='db_admin_access';
const COOKIE_REFRESH='db_admin_refresh';
const PRIVATE_KEYS=/body|content|question|prompt|response|password|secret|token|email|phone|contact|message/i;
const STAGING_REF='kyphdsamyygavmkzyezr';
const DEFAULT_ORIGINS=Object.freeze([
  'https://divinabruxa.github.io',
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://divinabruxa.com',
  'https://www.divinabruxa.com'
]);

const env=name=>Deno.env.get(name)||'';
const allowedOrigins=()=>{
  const configured=env('ADMIN_ALLOWED_ORIGINS').split(',').map(value=>value.trim().replace(/\/$/,'')).filter(Boolean);
  return configured.length?configured:DEFAULT_ORIGINS;
};
const allowedOrigin=request=>{
  const origin=String(request.headers.get('origin')||'').replace(/\/$/,'');
  return allowedOrigins().includes(origin)?origin:'';
};
const headers=(origin,extra={})=>{
  const result=new Headers({
    'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','pragma':'no-cache','vary':'Origin',
    'access-control-allow-origin':origin,'access-control-allow-credentials':'true','access-control-allow-methods':'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers':'content-type,x-divina-admin-request','x-content-type-options':'nosniff','referrer-policy':'no-referrer',
    'permissions-policy':'camera=(), microphone=(), geolocation=()'
  });
  for(const [key,value] of Object.entries(extra))Array.isArray(value)?value.forEach(item=>result.append(key,item)):result.set(key,value);
  return result;
};
const json=(status,body,origin,extra)=>new Response(JSON.stringify(body),{status,headers:headers(origin,extra)});
const parseCookies=value=>Object.fromEntries(String(value||'').split(';').map(part=>{const at=part.indexOf('=');return at<0?[]:[decodeURIComponent(part.slice(0,at).trim()),decodeURIComponent(part.slice(at+1).trim())];}).filter(parts=>parts.length===2));
const cookie=(name,value,maxAge)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`;
const cookieHeaders=session=>[
  cookie(COOKIE_ACCESS,session.access_token,Math.max(60,Number(session.expires_in)||3600)),
  cookie(COOKIE_REFRESH,session.refresh_token,60*60*24*14)
];
const clearCookieHeaders=()=>[cookie(COOKIE_ACCESS,'',0),cookie(COOKIE_REFRESH,'',0)];
const withCookies=(origin,cookies,status=200,body={})=>json(status,body,origin,{'set-cookie':cookies});
const decodeJwt=token=>{
  try{return JSON.parse(atob(String(token).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return {};}
};
const cleanPath=pathname=>{
  const marker='/admin/';
  const at=pathname.indexOf(marker);
  if(at>=0)return pathname.slice(at);
  if(pathname.endsWith('/admin'))return '/admin';
  return pathname;
};
const anonClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const serviceClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const sanitizedMetadata=value=>Object.fromEntries(Object.entries(value||{}).filter(([key,item])=>!PRIVATE_KEYS.test(key)&&['string','number','boolean'].includes(typeof item)).slice(0,12));
const audit=async(db,userId,action,moduleId,result,metadata={})=>{
  await db.from('admin_audit_events').insert({actor_user_id:userId||null,action:String(action).slice(0,80),module_id:MODULES.includes(moduleId)?moduleId:'session',result,metadata:sanitizedMetadata(metadata)});
};
const readBody=async request=>{
  try{return await request.json();}catch{return {};}
};
const validSetup=()=>{
  try{return Boolean(env('SUPABASE_ANON_KEY')&&env('SUPABASE_SERVICE_ROLE_KEY')&&new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`);}catch{return false;}
};
const isMutating=request=>!['GET','HEAD','OPTIONS'].includes(request.method);
const requestAllowed=(request,origin)=>!isMutating(request)||(Boolean(origin)&&['v146','v150','v532'].includes(request.headers.get('x-divina-admin-request')||''));
const isoAgo=days=>new Date(Date.now()-days*86400000).toISOString();
const integer=value=>Math.max(0,Math.floor(Number(value)||0));
const number=value=>Number.isFinite(Number(value))?Number(value):0;
const within=(value,days)=>{const time=new Date(value||'').getTime();return Number.isFinite(time)&&time>=Date.now()-days*86400000;};
const rows=result=>{if(result.error)throw result.error;return result.data||[];};
const countResult=result=>{if(result.error)throw result.error;return integer(result.count);};
const group=(list,key)=>{
  const output={};
  for(const item of list||[]){const value=String(item?.[key]??'').trim()||'unknown';output[value]=(output[value]||0)+1;}
  return Object.entries(output).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([key,count])=>({key,count}));
};
const sum=(list,key)=>list.reduce((total,item)=>total+number(item?.[key]),0);
const envelope=(moduleId,payload={})=>({
  release:RELEASE,moduleId,environment:'staging',generatedAt:new Date().toISOString(),
  sanitized:true,privateContentIncluded:false,personalIdentifiersIncluded:false,...payload
});

async function recoveryCount(db,userId){
  const {count,error}=await db.from('admin_recovery_codes').select('id',{count:'exact',head:true}).eq('user_id',userId).is('used_at',null);
  if(error)throw error;
  return Number(count)||0;
}

async function restoreSession(request){
  const cookies=parseCookies(request.headers.get('cookie'));
  let access=cookies[COOKIE_ACCESS],refresh=cookies[COOKIE_REFRESH],session=null;
  if(!access||!refresh)return {error:'missing_session'};
  const auth=anonClient();
  let userResult=await auth.auth.getUser(access);
  if(userResult.error){
    const refreshed=await auth.auth.refreshSession({refresh_token:refresh});
    if(refreshed.error||!refreshed.data.session)return {error:'expired_session'};
    session=refreshed.data.session;access=session.access_token;refresh=session.refresh_token;
    userResult=await auth.auth.getUser(access);
  }
  if(userResult.error||!userResult.data.user)return {error:'invalid_session'};
  return {auth,user:userResult.data.user,access,refresh,session,claims:decodeJwt(access)};
}

async function ownerContext(request,{requireAal2=true,requireRecovery=true}={}){
  const restored=await restoreSession(request);
  if(restored.error)return {error:restored.error,status:401};
  const db=serviceClient(),user=restored.user,claims=restored.claims;
  const {data:owner,error}=await db.from('admin_owners').select('user_id,display_name,active,accepted_security_at').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(error||!owner){await audit(db,user.id,'owner-check','session','denied');return {error:'forbidden',status:403};}
  if(!user.email_confirmed_at){await audit(db,user.id,'email-check','session','denied');return {error:'email_not_verified',status:403};}
  if(requireAal2&&claims.aal!=='aal2')return {error:'mfa_required',status:401,mfaRequired:true};
  const sessionId=claims.session_id;
  if(!sessionId)return {error:'invalid_session',status:401};
  const {data:known}=await db.from('admin_sessions').select('revoked_at').eq('session_id',sessionId).maybeSingle();
  if(known?.revoked_at)return {error:'revoked_session',status:401};
  const expiresAt=new Date((Number(claims.exp)||0)*1000).toISOString();
  await db.from('admin_sessions').upsert({session_id:sessionId,user_id:user.id,assurance_level:claims.aal||'aal1',last_seen_at:new Date().toISOString(),expires_at:expiresAt},{onConflict:'session_id'});
  const codes=await recoveryCount(db,user.id);
  if(requireRecovery&&codes===0)return {error:'recovery_codes_required',status:428,recoveryCodesRequired:true,restored,db,user,owner,claims};
  return {restored,db,user,owner,claims,recoveryCodesReady:codes>0};
}

const sessionBody=context=>({
  ownerVerified:true,emailVerified:true,mfaVerified:context.claims.aal==='aal2',recoveryCodesReady:Boolean(context.recoveryCodesReady),
  environment:'staging',displayName:context.owner.display_name,expiresAt:new Date(Number(context.claims.exp)*1000).toISOString()
});
const ownerJson=(context,status,body,origin)=>context.restored?.session
  ?withCookies(origin,cookieHeaders(context.restored.session),status,body)
  :json(status,body,origin);

async function signIn(request,origin){
  const body=await readBody(request),email=String(body.email||'').trim(),password=String(body.password||'');
  if(!email.includes('@')||password.length<12)return json(400,{error:'invalid_credentials'},origin);
  const auth=anonClient(),result=await auth.auth.signInWithPassword({email,password});
  if(result.error||!result.data.session||!result.data.user)return json(401,{error:'invalid_credentials'},origin);
  const db=serviceClient(),user=result.data.user;
  const {data:owner}=await db.from('admin_owners').select('user_id').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(!owner||!user.email_confirmed_at){await audit(db,user.id,'sign-in','session','denied');return withCookies(origin,clearCookieHeaders(),403,{error:'forbidden'});}
  const factors=await auth.auth.mfa.listFactors();
  const verified=factors.data?.totp?.some(item=>item.status==='verified');
  await audit(db,user.id,'sign-in','session','allowed',{mfaEnrolled:Boolean(verified)});
  const response=verified?{mfaRequired:true,mfaEnrollmentRequired:false,environment:'staging'}:{mfaRequired:true,mfaEnrollmentRequired:true,environment:'staging'};
  return withCookies(origin,cookieHeaders(result.data.session),200,response);
}

async function enrollMfa(request,origin){
  const context=await ownerContext(request,{requireAal2:false,requireRecovery:false});
  if(context.error&&context.status!==428)return json(context.status,{error:context.error},origin);
  const auth=context.restored.auth;
  await auth.auth.setSession({access_token:context.restored.access,refresh_token:context.restored.refresh});
  const factors=await auth.auth.mfa.listFactors();
  if(factors.data?.totp?.some(item=>item.status==='verified'))return json(409,{error:'mfa_already_enrolled'},origin);
  const enrolled=await auth.auth.mfa.enroll({factorType:'totp',friendlyName:'Divina Bruxa Owner'});
  if(enrolled.error||!enrolled.data)return json(400,{error:'mfa_enrollment_failed'},origin);
  await audit(context.db,context.user.id,'mfa-enroll','security','allowed');
  return json(200,{factorId:enrolled.data.id,qrCode:enrolled.data.totp.qr_code,secret:enrolled.data.totp.secret},origin);
}

async function verifyMfa(request,origin){
  const context=await ownerContext(request,{requireAal2:false,requireRecovery:false});
  if(context.error&&context.status!==428)return json(context.status,{error:context.error},origin);
  const body=await readBody(request),code=String(body.code||'').replace(/\D/g,''),auth=context.restored.auth;
  if(code.length!==6)return json(400,{error:'invalid_mfa_code'},origin);
  await auth.auth.setSession({access_token:context.restored.access,refresh_token:context.restored.refresh});
  const factors=await auth.auth.mfa.listFactors();
  const factorId=String(body.factorId||factors.data?.totp?.find(item=>item.status==='verified')?.id||'');
  if(!factorId)return json(400,{error:'mfa_factor_missing'},origin);
  const verified=await auth.auth.mfa.challengeAndVerify({factorId,code});
  if(verified.error||!verified.data?.session){await audit(context.db,context.user.id,'mfa-verify','security','failed');return json(401,{error:'invalid_mfa_code'},origin);}
  const nextClaims=decodeJwt(verified.data.session.access_token);
  if(nextClaims.aal!=='aal2')return json(401,{error:'aal2_required'},origin);
  const nextContext=await ownerContextFromSession(context.db,context.user,context.owner,verified.data.session,nextClaims);
  await audit(context.db,context.user.id,'mfa-verify','security','allowed');
  const codes=await recoveryCount(context.db,context.user.id);
  const bodyOut=codes?sessionBody({...nextContext,recoveryCodesReady:true}):{...sessionBody({...nextContext,recoveryCodesReady:false}),recoveryCodesRequired:true};
  return withCookies(origin,cookieHeaders(verified.data.session),200,bodyOut);
}

async function ownerContextFromSession(db,user,owner,session,claims){
  await db.from('admin_sessions').upsert({session_id:claims.session_id,user_id:user.id,assurance_level:'aal2',last_seen_at:new Date().toISOString(),expires_at:new Date(Number(claims.exp)*1000).toISOString()},{onConflict:'session_id'});
  return {db,user,owner,claims,restored:{session,access:session.access_token,refresh:session.refresh_token}};
}

const randomCode=()=>{
  const bytes=crypto.getRandomValues(new Uint8Array(9));
  return Array.from(bytes,value=>(value%36).toString(36).toUpperCase()).join('').replace(/(.{3})(?=.)/g,'$1-');
};
const hashRecovery=async(userId,code)=>{
  const pepper=env('ADMIN_RECOVERY_PEPPER')||`divina-admin-recovery:${env('SUPABASE_SERVICE_ROLE_KEY')}`;
  const bytes=new TextEncoder().encode(`${userId}:${code}:${pepper}`);
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(digest),value=>value.toString(16).padStart(2,'0')).join('');
};

async function generateRecoveryCodes(request,origin){
  const context=await ownerContext(request,{requireAal2:true,requireRecovery:false});
  if(context.error&&context.status!==428)return json(context.status,{error:context.error},origin);
  if(await recoveryCount(context.db,context.user.id))return json(409,{error:'recovery_codes_already_created'},origin);
  const codes=Array.from({length:10},randomCode),rows=[];
  for(const code of codes)rows.push({user_id:context.user.id,code_hash:await hashRecovery(context.user.id,code)});
  const {error}=await context.db.from('admin_recovery_codes').insert(rows);
  if(error)return json(500,{error:'recovery_codes_failed'},origin);
  await audit(context.db,context.user.id,'recovery-codes-create','security','allowed',{count:codes.length});
  return json(201,{codes,shownOnce:true,...sessionBody({...context,recoveryCodesReady:true})},origin);
}

async function recoverMfa(request,origin){
  const context=await ownerContext(request,{requireAal2:false,requireRecovery:false});
  if(context.error&&context.status!==428)return json(context.status,{error:context.error},origin);
  const body=await readBody(request),recoveryCode=String(body.recoveryCode||'').trim().toUpperCase();
  if(!/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(recoveryCode))return json(400,{error:'invalid_recovery_code'},origin);
  const codeHash=await hashRecovery(context.user.id,recoveryCode);
  const {data:stored}=await context.db.from('admin_recovery_codes').select('id').eq('user_id',context.user.id).eq('code_hash',codeHash).is('used_at',null).maybeSingle();
  if(!stored){await audit(context.db,context.user.id,'mfa-recovery','security','denied');return json(403,{error:'invalid_recovery_code'},origin);}
  const listed=await context.db.auth.admin.mfa.listFactors({userId:context.user.id});
  if(listed.error)return json(500,{error:'mfa_recovery_failed'},origin);
  const rawFactors=listed.data?.factors||listed.data?.all||listed.data||[];
  const factors=Array.isArray(rawFactors)?rawFactors:[];
  for(const factor of factors){
    if(factor?.status!=='verified')continue;
    const removed=await context.db.auth.admin.mfa.deleteFactor({id:factor.id,userId:context.user.id});
    if(removed.error)return json(500,{error:'mfa_recovery_failed'},origin);
  }
  const usedAt=new Date().toISOString();
  await context.db.from('admin_recovery_codes').update({used_at:usedAt}).eq('id',stored.id).is('used_at',null);
  await context.db.from('admin_sessions').update({revoked_at:usedAt}).eq('user_id',context.user.id).is('revoked_at',null);
  await audit(context.db,context.user.id,'mfa-recovery','security','allowed',{factorCount:factors.length});
  return withCookies(origin,clearCookieHeaders(),200,{ok:true,recoveryAccepted:true,signInAgain:true,environment:'staging'});
}

async function currentPrices(db){
  const {data,error}=await db.from('consultation_price_versions').select('service_id,price_cents,effective_at,created_at').order('effective_at',{ascending:false}).order('created_at',{ascending:false});
  if(error)throw error;
  const result={};
  for(const row of data||[])if(result[row.service_id]===undefined)result[row.service_id]=row.price_cents;
  return result;
}

async function overview(context){
  const db=context.db;
  const [prices,profiles,purchasesResult,consultationsResult,aiResult,auditResult]=await Promise.all([
    currentPrices(db),
    db.from('profiles').select('user_id',{count:'exact',head:true}),
    db.from('purchases').select('status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('consultation_requests').select('status').limit(5000),
    db.from('ai_usage').select('credits_charged,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('admin_audit_events').select('id',{count:'exact',head:true})
  ]);
  const purchases=rows(purchasesResult),consultations=rows(consultationsResult),ai=rows(aiResult);
  const sandboxRevenueCents=sum(purchases.filter(item=>item.status==='paid'),'price_brl_cents_snapshot');
  const openConsultations=consultations.filter(item=>!['completed','cancelled'].includes(String(item.status||'').toLowerCase())).length;
  return {
    release:RELEASE,registeredAccounts:countResult(profiles),activeUsers:0,activeUsersOfficial:false,
    sandboxRevenue:sandboxRevenueCents/100,sandboxRevenueCents,openConsultations,
    aiCreditsUsed:integer(sum(ai,'credits_charged')),auditEvents:countResult(auditResult),
    consultationPrices:prices,environment:'staging',sanitized:true,privateContentIncluded:false
  };
}

async function todayModule(context){
  const db=context.db;
  const [profiles,purchasesResult,consultationsResult,aiResult,privacyResult,auditResult,videosResult,flagsResult]=await Promise.all([
    db.from('profiles').select('user_id',{count:'exact',head:true}),
    db.from('purchases').select('status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('consultation_requests').select('status,payment_status,created_at').limit(5000),
    db.from('ai_usage').select('credits_charged,status,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('privacy_requests').select('status').limit(1000),
    db.from('admin_audit_events').select('action,module_id,result,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('video_episodes').select('status,published_at').limit(1000),
    db.from('admin_runtime_flags').select('key,enabled,updated_at').order('key')
  ]);
  const purchases=rows(purchasesResult),consultations=rows(consultationsResult),ai=rows(aiResult),privacy=rows(privacyResult),audits=rows(auditResult),videos=rows(videosResult),flags=rows(flagsResult);
  const open=consultations.filter(item=>!['completed','cancelled'].includes(String(item.status||'').toLowerCase())).length;
  const paid=purchases.filter(item=>item.status==='paid');
  return envelope('today',{
    metrics:{
      registeredAccounts:countResult(profiles),officialActiveAccountsAvailable:false,
      sandboxRevenueCents30d:integer(sum(paid,'price_brl_cents_snapshot')),paidPurchases30d:paid.length,
      openConsultations:open,aiCredits30d:integer(sum(ai,'credits_charged')),
      pendingPrivacyRequests:privacy.filter(item=>!['completed','cancelled'].includes(String(item.status||'').toLowerCase())).length,
      deniedAdminActions30d:audits.filter(item=>item.result==='denied').length,
      videoDrafts:videos.filter(item=>item.status==='draft').length
    },
    consultationStatus:group(consultations,'status'),
    runtimeGates:flags.map(item=>({key:item.key,enabled:item.enabled===true,updatedAt:item.updated_at})),
    truths:{realBilling:false,productionPublish:false,sol:false,privateReads:0}
  });
}

async function financeModule(context){
  const db=context.db;
  const [purchaseResult,subscriptionResult,catalogResult]=await Promise.all([
    db.from('purchases').select('product_key,platform,environment,status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(90)).order('created_at',{ascending:false}).limit(5000),
    db.from('billing_subscriptions_v191').select('product_key,status,cancel_at_period_end,environment,current_period_end,created_at').order('created_at',{ascending:false}).limit(5000),
    db.from('product_catalog').select('product_key,product_type,price_brl_cents,billing_mode,credits,active,catalog_version').order('product_key').limit(200)
  ]);
  const purchases=rows(purchaseResult),subscriptions=rows(subscriptionResult),catalog=rows(catalogResult);
  const paid30=purchases.filter(item=>item.status==='paid'&&within(item.created_at,30));
  return envelope('finance',{
    metrics:{grossCents30d:integer(sum(paid30,'price_brl_cents_snapshot')),paid30d:paid30.length,refunds90d:purchases.filter(item=>/refund/i.test(String(item.status||''))).length,pending90d:purchases.filter(item=>['pending','processing'].includes(item.status)).length,activeSubscriptions:subscriptions.filter(item=>['active','trialing'].includes(item.status)).length},
    byStatus:group(purchases,'status'),byProduct:group(purchases,'product_key'),byPlatform:group(purchases,'platform'),
    subscriptions:group(subscriptions,'status'),catalog:{items:catalog.length,active:catalog.filter(item=>item.active===true).length,byType:group(catalog,'product_type')},
    currency:'BRL',realBilling:false,financialEnvironment:'staging'
  });
}

async function usersModule(context){
  const db=context.db;
  const [profilesResult,privacyResult,consentResult,settingsResult]=await Promise.all([
    db.from('profiles').select('locale,age_declared_18_plus,created_at').order('created_at',{ascending:false}).limit(5000),
    db.from('privacy_requests').select('kind,status,requested_at').order('requested_at',{ascending:false}).limit(2000),
    db.from('consent_events').select('consent_key,occurred_at').gte('occurred_at',isoAgo(90)).limit(5000),
    db.from('user_settings').select('marketing_email,daily_card_notifications,journal_sync_enabled').limit(5000)
  ]);
  const profiles=rows(profilesResult),privacy=rows(privacyResult),consents=rows(consentResult),settings=rows(settingsResult);
  return envelope('users',{
    metrics:{registeredAccounts:profiles.length,newAccounts30d:profiles.filter(item=>within(item.created_at,30)).length,adultDeclarationCount:profiles.filter(item=>item.age_declared_18_plus===true).length,pendingPrivacyRequests:privacy.filter(item=>!['completed','cancelled'].includes(String(item.status||'').toLowerCase())).length},
    locales:group(profiles,'locale'),privacyByKind:group(privacy,'kind'),privacyByStatus:group(privacy,'status'),consentsByKey:group(consents,'consent_key'),
    preferences:{records:settings.length,marketingOptIn:settings.filter(item=>item.marketing_email===true).length,dailyCardOptIn:settings.filter(item=>item.daily_card_notifications===true).length,journalCloudOptIn:settings.filter(item=>item.journal_sync_enabled===true).length},
    crmMode:'aggregate-only',namesIncluded:false,emailsIncluded:false,phonesIncluded:false
  });
}

async function subscriptionsModule(context){
  const db=context.db;
  const [subscriptionResult,entitlementResult,purchaseResult]=await Promise.all([
    db.from('billing_subscriptions_v191').select('product_key,status,cancel_at_period_end').limit(5000),
    db.from('entitlements').select('entitlement_key,status').limit(5000),
    db.from('purchases').select('product_key,status').limit(5000)
  ]);
  const subscriptions=rows(subscriptionResult),entitlements=rows(entitlementResult),purchases=rows(purchaseResult);
  return envelope('subscriptions',{
    metrics:{activeSubscriptions:subscriptions.filter(item=>['active','trialing'].includes(item.status)).length,cancelAtPeriodEnd:subscriptions.filter(item=>item.cancel_at_period_end===true).length,activeEntitlements:entitlements.filter(item=>item.status==='active').length,paidPurchases:purchases.filter(item=>item.status==='paid').length},
    subscriptionStatus:group(subscriptions,'status'),entitlementStatus:group(entitlements,'status'),entitlementsByKey:group(entitlements,'entitlement_key'),purchasesByProduct:group(purchases,'product_key'),
    authority:'server',premiumLifetimeCents:19990,aiMonthlyCents:8990,aiCreditsPerCycle:400,premiumIncludesAI:false,realBilling:false
  });
}

async function aiModule(context){
  const db=context.db;
  const [usageResult,walletResult,flagsResult]=await Promise.all([
    db.from('ai_usage').select('model_id,mode,input_tokens,cached_input_tokens,output_tokens,estimated_cost_usd,latency_ms,status,focus,credits_charged,content_retained,created_at').gte('created_at',isoAgo(30)).order('created_at',{ascending:false}).limit(5000),
    db.from('ai_wallets').select('monthly_credits,extra_credits,demo_credits').limit(5000),
    db.from('ai_feature_flags').select('orbe_ai_enabled,sol_enabled,global_daily_credit_limit,per_user_requests_per_minute,per_user_daily_credit_limit,global_daily_request_limit,global_daily_cost_limit_usd,max_input_characters,max_history_messages,max_context_characters,luna_max_output_tokens,terra_max_output_tokens,updated_at').limit(1)
  ]);
  const usage=rows(usageResult),wallets=rows(walletResult),feature=rows(flagsResult)[0]||{};
  const latency=usage.length?Math.round(sum(usage,'latency_ms')/usage.length):0;
  return envelope('ai',{
    metrics:{requests30d:usage.length,successful30d:usage.filter(item=>['completed','success','settled'].includes(String(item.status||'').toLowerCase())).length,credits30d:integer(sum(usage,'credits_charged')),estimatedCostUsd30d:Number(sum(usage,'estimated_cost_usd').toFixed(6)),averageLatencyMs:latency,walletCredits:integer(wallets.reduce((total,item)=>total+number(item.monthly_credits)+number(item.extra_credits)+number(item.demo_credits),0)),inputTokens30d:integer(sum(usage,'input_tokens')),cachedInputTokens30d:integer(sum(usage,'cached_input_tokens')),outputTokens30d:integer(sum(usage,'output_tokens'))},
    byStatus:group(usage,'status'),byModel:group(usage,'model_id'),byMode:group(usage,'mode'),byFocus:group(usage,'focus'),
    limits:{orbeAIEnabled:feature.orbe_ai_enabled===true,solEnabled:false,globalDailyCredits:integer(feature.global_daily_credit_limit),perUserRequestsPerMinute:integer(feature.per_user_requests_per_minute),perUserDailyCredits:integer(feature.per_user_daily_credit_limit),globalDailyRequests:integer(feature.global_daily_request_limit),globalDailyCostUsd:number(feature.global_daily_cost_limit_usd),maxInputCharacters:integer(feature.max_input_characters)},
    promptsIncluded:false,responsesIncluded:false,contentRetainedRows:usage.filter(item=>item.content_retained===true).length
  });
}

async function tarotModule(context){
  const db=context.db;
  const [dailyResult,readingResult,sessionResult]=await Promise.all([
    db.from('daily_cards').select('revealed_at').gte('revealed_at',isoAgo(30)).limit(5000),
    db.from('tarot_readings').select('spread_key,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('tarot_spread_sessions_v213').select('status,created_at').gte('created_at',isoAgo(30)).limit(5000)
  ]);
  const daily=rows(dailyResult),readings=rows(readingResult),sessions=rows(sessionResult);
  return envelope('tarot',{
    metrics:{canonicalCards:78,dailyDraws30d:daily.length,dailyDraws24h:daily.filter(item=>within(item.revealed_at,1)).length,completedReadings30d:readings.length,spreadSessions30d:sessions.length},
    readingsBySpread:group(readings,'spread_key'),sessionsByStatus:group(sessions,'status'),
    integrity:{normalOnly:true,noRepeats:true,spreadMethods:15,celticCrossPositions:10,royalTable:'13x6'},questionsIncluded:false,synthesesIncluded:false,cardSelectionsIncluded:false
  });
}

async function schoolModule(context){
  const db=context.db;
  const [progressResult,favoriteResult]=await Promise.all([
    db.from('school_progress').select('status,progress_percent').limit(5000),
    db.from('school_favorites').select('lesson_id,created_at').limit(5000)
  ]);
  const progress=rows(progressResult),favorites=rows(favoriteResult),average=progress.length?Math.round(sum(progress,'progress_percent')/progress.length):0;
  return envelope('school',{
    metrics:{canonicalModules:17,canonicalLessons:124,progressRecords:progress.length,completed:progress.filter(item=>item.status==='completed'||number(item.progress_percent)>=100).length,inProgress:progress.filter(item=>item.status!=='completed'&&number(item.progress_percent)>0).length,averageProgressPercent:average,favorites:favorites.length},
    progressByStatus:group(progress,'status'),popularLessons:group(favorites,'lesson_id').slice(0,12),notesIncluded:false,journalLinksIncluded:false
  });
}

async function consultationsModule(context){
  const db=context.db;
  const [requestResult,historyResult]=await Promise.all([
    db.from('consultation_requests').select('service_key,status,payment_status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(90)).order('created_at',{ascending:false}).limit(5000),
    db.from('consultation_status_history').select('created_at').gte('created_at',isoAgo(90)).limit(5000)
  ]);
  const requests=rows(requestResult),history=rows(historyResult),open=requests.filter(item=>!['completed','cancelled'].includes(String(item.status||'').toLowerCase()));
  return envelope('consultations',{
    metrics:{requests90d:requests.length,open:open.length,completed90d:requests.filter(item=>item.status==='completed').length,valueSnapshotCents90d:integer(sum(requests,'price_brl_cents_snapshot')),statusMoves90d:history.length},
    byService:group(requests,'service_key'),byStatus:group(requests,'status'),byPaymentStatus:group(requests,'payment_status'),
    serviceLabels:SERVICES,questionIncluded:false,contactIncluded:false,protocolIncluded:false,realBilling:false
  });
}

async function storeModule(context){
  const db=context.db;
  const [affiliateResult,catalogResult,eventResult]=await Promise.all([
    db.from('affiliate_products').select('category_key,status,is_featured,locale,policy_reviewed_at').limit(1000),
    db.from('product_catalog').select('product_type,active').limit(500),
    db.from('analytics_events').select('event_key,product_key,platform,occurred_at').not('product_key','is',null).gte('occurred_at',isoAgo(30)).limit(5000)
  ]);
  const products=rows(affiliateResult),catalog=rows(catalogResult),events=rows(eventResult);
  return envelope('store',{
    metrics:{affiliateProducts:products.length,publishedAffiliateProducts:products.filter(item=>item.status==='published').length,featured:products.filter(item=>item.is_featured===true).length,policyReviewed:products.filter(item=>Boolean(item.policy_reviewed_at)).length,productEvents30d:events.length},
    byCategory:group(products,'category_key'),byStatus:group(products,'status'),byLocale:group(products,'locale'),eventsByProduct:group(events,'product_key').slice(0,20),
    catalog:{items:catalog.length,active:catalog.filter(item=>item.active===true).length,byType:group(catalog,'product_type')},checkoutInternal:false,affiliateExternal:true
  });
}

async function skinsModule(context){
  const db=context.db;
  const [skinResult,entitlementResult,preferenceResult,productResult]=await Promise.all([
    db.from('orb_skins').select('slug,rarity,is_free,status,sort_order').order('sort_order').limit(100),
    db.from('orb_skin_entitlements').select('source,status').limit(5000),
    db.from('orb_skin_preferences').select('equipped_skin_id,updated_at').limit(5000),
    db.from('orb_skin_products').select('skin_id,provider,price_brl_cents,active,environment,restore_supported').limit(500)
  ]);
  const skins=rows(skinResult),entitlements=rows(entitlementResult),preferences=rows(preferenceResult),products=rows(productResult),published=skins.filter(item=>item.status==='published');
  return envelope('skins',{
    metrics:{canonicalCatalog:30,published:published.length,archived:skins.filter(item=>item.status==='archived').length,freePublished:published.filter(item=>item.is_free===true).length,activeEntitlements:entitlements.filter(item=>item.status==='active').length,equippedRecords:preferences.length,activeProducts:products.filter(item=>item.active===true).length},
    byRarity:group(published,'rarity'),entitlementsBySource:group(entitlements,'source'),entitlementsByStatus:group(entitlements,'status'),productsByProvider:group(products,'provider'),
    integrity:{classicFree:published.some(item=>item.slug==='classic'&&item.is_free===true),cosmeticOnly:true,premiumIncludesAll:true,serverAuthority:true}
  });
}

async function seoModule(context){
  const db=context.db;
  const [videoResult,musicResult,tarotResult]=await Promise.all([
    db.from('video_episodes').select('status,locale,seo_title,seo_description').limit(1000),
    db.from('music_releases').select('status,locale').limit(1000),
    db.from('tarot_episodes').select('status,locale').limit(1000)
  ]);
  const videos=rows(videoResult),music=rows(musicResult),tarot=rows(tarotResult),publishedVideos=videos.filter(item=>item.status==='published');
  return envelope('seo',{
    metrics:{publishedVideos:publishedVideos.length,videoSeoComplete:publishedVideos.filter(item=>item.seo_title&&item.seo_description).length,publishedMusic:music.filter(item=>item.status==='published').length,publishedTarotEpisodes:tarot.filter(item=>item.status==='published').length},
    videoLocales:group(publishedVideos,'locale'),musicLocales:group(music.filter(item=>item.status==='published'),'locale'),tarotLocales:group(tarot.filter(item=>item.status==='published'),'locale'),
    publicLanguages:['pt-BR','en','es'],privateRoutesNoIndex:['login','journal','admin'],sitemapExpected:true,canonicalExpected:true,hreflangExpected:true,storeSubmissionAuthorized:false
  });
}

async function securityModule(context){
  const db=context.db;
  const [ownersResult,sessionsResult,codesResult,auditsResult,flagsResult]=await Promise.all([
    db.from('admin_owners').select('active').limit(100),
    db.from('admin_sessions').select('assurance_level,expires_at,revoked_at').limit(1000),
    db.from('admin_recovery_codes').select('used_at').limit(1000),
    db.from('admin_audit_events').select('action,module_id,result,created_at').gte('created_at',isoAgo(30)).limit(5000),
    db.from('admin_runtime_flags').select('key,enabled,updated_at').order('key')
  ]);
  const owners=rows(ownersResult),sessions=rows(sessionsResult),codes=rows(codesResult),audits=rows(auditsResult),flags=rows(flagsResult);
  const activeSessions=sessions.filter(item=>!item.revoked_at&&new Date(item.expires_at||0)>new Date());
  return envelope('security',{
    metrics:{activeOwners:owners.filter(item=>item.active===true).length,activeSessions:activeSessions.length,revokedSessions:sessions.filter(item=>Boolean(item.revoked_at)).length,unusedRecoveryCodes:codes.filter(item=>!item.used_at).length,deniedActions30d:audits.filter(item=>item.result==='denied').length,failedActions30d:audits.filter(item=>item.result==='failed').length},
    sessionAssurance:group(activeSessions,'assurance_level'),runtimeGates:flags.map(item=>({key:item.key,enabled:item.enabled===true,updatedAt:item.updated_at})),
    controls:{verifiedEmailRequired:true,aal2Required:true,recoveryCodesRequired:true,httpOnlyCookie:true,secureCookie:true,serverOwnerRegistry:true,clientRoleTrusted:false,stagingLocked:true}
  });
}

async function backupsModule(){
  return envelope('backups',{
    metrics:{reportedRuns:0,verifiedRestores:0,failedRuns:0},
    isolation:{schema:'private',browserReadable:false,adminSnapshotReadsPrivateSchema:false,telemetryConnected:false},
    readiness:{encryptedRequired:true,manifestHashRequired:true,restoreVerificationRequired:true,retentionPolicyConfigured:false,schedulerConfigured:false,rpoConfigured:false,rtoConfigured:false},
    state:'awaiting-infrastructure',message:'A política e o cofre existem, mas a automação de backup e o teste de restauração ainda não foram conectados.'
  });
}

async function auditModule(context){
  const result=await context.db.from('admin_audit_events').select('action,module_id,result,created_at').order('created_at',{ascending:false}).limit(50);
  const events=rows(result);
  return envelope('audit',{
    metrics:{events:events.length,allowed:events.filter(item=>item.result==='allowed').length,denied:events.filter(item=>item.result==='denied').length,failed:events.filter(item=>item.result==='failed').length},
    byModule:group(events,'module_id'),byResult:group(events,'result'),events:events.map(item=>({action:String(item.action||'').slice(0,80),moduleId:String(item.module_id||'session').slice(0,40),result:String(item.result||'unknown').slice(0,40),createdAt:item.created_at})),
    actorIdsIncluded:false,requestIdsIncluded:false,metadataIncluded:false
  });
}

async function settingsModule(context){
  const [flagsResult,catalogResult]=await Promise.all([
    context.db.from('admin_runtime_flags').select('key,enabled,updated_at').order('key'),
    context.db.from('product_catalog').select('product_type,active,catalog_version').order('product_type').limit(200)
  ]);
  const flags=rows(flagsResult),catalog=rows(catalogResult);
  return envelope('settings',{
    runtimeGates:flags.map(item=>({key:item.key,enabled:item.enabled===true,updatedAt:item.updated_at})),
    catalog:{items:catalog.length,active:catalog.filter(item=>item.active===true).length,byType:group(catalog,'product_type'),version:String(catalog.find(item=>item.catalog_version)?.catalog_version||'')},
    defaults:{locale:'pt-BR',timeZone:'America/Sao_Paulo',notificationQuietHours:'22:00–08:00',marketingDefault:false,environment:'staging'},
    criticalChangesReadOnly:true,realBilling:false,productionPublish:false,storeSubmission:false,sol:false
  });
}

async function moduleSnapshot(context,moduleId){
  const loaders={today:todayModule,finance:financeModule,users:usersModule,subscriptions:subscriptionsModule,ai:aiModule,tarot:tarotModule,school:schoolModule,consultations:consultationsModule,store:storeModule,skins:skinsModule,seo:seoModule,security:securityModule,backups:backupsModule,audit:auditModule,settings:settingsModule};
  if(loaders[moduleId])return await loaders[moduleId](context);
  const delegates={media:'admin-media-v320',notifications:'admin-api-v532-notifications',analytics:'admin-analytics-v322'};
  return envelope(moduleId,{delegate:delegates[moduleId]||null,operational:true});
}

async function notificationSummary(db){
  const statuses=['draft','review','scheduled','sending','paused','completed','cancelled'];
  const results=await Promise.all(statuses.map(async status=>{
    const {count,error}=await db.from('notification_campaigns').select('id',{count:'exact',head:true}).eq('test_only',true).eq('status',status);
    if(error)throw error;
    return [status,Number(count)||0];
  }));
  const byStatus=Object.fromEntries(results);
  return {total:Object.values(byStatus).reduce((sum,value)=>sum+value,0),byStatus};
}

async function notificationModule(context){
  const {data,error}=await context.db.from('notification_campaigns')
    .select('id,name,category,status,title,body,deep_link,locale,test_only,created_at,updated_at')
    .eq('test_only',true).order('created_at',{ascending:false}).limit(20);
  if(error)throw error;
  return {
    moduleId:'notifications',environment:'staging',testOnly:true,sendEnabled:false,providerConfigured:false,
    quietHours:{start:'22:00',end:'08:00',timeZone:'America/Sao_Paulo'},
    categories:NOTIFICATION_CATEGORIES,summary:await notificationSummary(context.db),campaigns:data||[],
    sanitized:true,privateContentIncluded:false,updatedAt:new Date().toISOString()
  };
}

const cleanCampaignText=(value,max)=>String(value||'').replace(/\s+/g,' ').trim().slice(0,max);

async function createNotificationDraft(request,origin,context){
  const body=await readBody(request),category=String(body.category||'');
  if(!NOTIFICATION_CATEGORIES.includes(category))return json(400,{error:'invalid_notification_category'},origin);
  let title=cleanCampaignText(body.title,120),message=cleanCampaignText(body.body,500);
  if(category==='daily_card'){
    title=SAFE_DAILY_TITLE;
    message=SAFE_DAILY_BODY;
  }
  if(!title||!message)return json(400,{error:'notification_content_required'},origin);
  if(PERSONAL_DATA_PATTERN.test(`${title} ${message}`))return json(400,{error:'personal_data_not_allowed'},origin);
  const payload={
    name:cleanCampaignText(`Rascunho V532 · ${title}`,120),category,status:'draft',title,body:message,
    deep_link:NOTIFICATION_DEEP_LINKS[category],locale:'pt-BR',test_only:true,scheduled_at:null,created_by:context.user.id
  };
  const {data,error}=await context.db.from('notification_campaigns').insert(payload)
    .select('id,name,category,status,title,body,deep_link,locale,test_only,created_at,updated_at').single();
  if(error){await audit(context.db,context.user.id,'notification-draft-create','notifications','failed',{category});return json(500,{error:'notification_draft_failed'},origin);}
  await audit(context.db,context.user.id,'notification-draft-create','notifications','allowed',{category,testOnly:true});
  return json(201,{ok:true,campaign:data,summary:await notificationSummary(context.db),sendEnabled:false,environment:'staging'},origin);
}

async function deleteNotificationDraft(path,origin,context){
  const id=decodeURIComponent(path.slice('/admin/notifications/campaigns/'.length));
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return json(400,{error:'invalid_campaign_id'},origin);
  const {data:campaign,error:readError}=await context.db.from('notification_campaigns').select('id,category,status,test_only').eq('id',id).maybeSingle();
  if(readError)return json(500,{error:'notification_draft_failed'},origin);
  if(!campaign)return json(404,{error:'notification_draft_not_found'},origin);
  if(campaign.test_only!==true||campaign.status!=='draft')return json(409,{error:'notification_draft_locked'},origin);
  const {error}=await context.db.from('notification_campaigns').delete().eq('id',id).eq('test_only',true).eq('status','draft');
  if(error){await audit(context.db,context.user.id,'notification-draft-delete','notifications','failed',{category:campaign.category});return json(500,{error:'notification_draft_failed'},origin);}
  await audit(context.db,context.user.id,'notification-draft-delete','notifications','allowed',{category:campaign.category,testOnly:true});
  return json(200,{ok:true,deletedId:id,summary:await notificationSummary(context.db),sendEnabled:false,environment:'staging'},origin);
}

async function savePrices(request,origin,context){
  const body=await readBody(request),prices=body.prices||{},code=String(body.stepUpCode||'').replace(/\D/g,'');
  if(code.length!==6||Object.keys(prices).length!==4||Object.keys(SERVICES).some(id=>!Number.isInteger(prices[id])||prices[id]<100||prices[id]>500000))return json(400,{error:'invalid_price_table'},origin);
  const auth=context.restored.auth;
  await auth.auth.setSession({access_token:context.restored.access,refresh_token:context.restored.refresh});
  const factors=await auth.auth.mfa.listFactors(),factorId=factors.data?.totp?.find(item=>item.status==='verified')?.id;
  if(!factorId)return json(403,{error:'mfa_factor_missing'},origin);
  const verified=await auth.auth.mfa.challengeAndVerify({factorId,code});
  if(verified.error||decodeJwt(verified.data?.session?.access_token).aal!=='aal2'){await audit(context.db,context.user.id,'price-change','consultations','denied');return json(403,{error:'step_up_failed'},origin);}
  const version=`consultas-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-v532`;
  const {error}=await context.db.rpc('admin_apply_consultation_prices_v146',{p_prices:prices,p_created_by:context.user.id,p_version:version});
  if(error){await audit(context.db,context.user.id,'price-change','consultations','failed');return json(500,{error:'price_update_failed'},origin);}
  const appliedVersion=version;
  await audit(context.db,context.user.id,'price-change','consultations','allowed',{priceTableVersion:appliedVersion,serviceCount:4});
  return withCookies(origin,cookieHeaders(verified.data.session),200,{ok:true,priceTableVersion:appliedVersion,consultationPrices:prices,historyPreserved:true});
}

async function signOut(request,origin){
  const restored=await restoreSession(request),db=serviceClient();
  if(!restored.error&&restored.claims.session_id){
    await db.from('admin_sessions').update({revoked_at:new Date().toISOString()}).eq('session_id',restored.claims.session_id);
    await audit(db,restored.user.id,'sign-out','session','allowed');
  }
  return withCookies(origin,clearCookieHeaders(),200,{ok:true});
}

Deno.serve(async request=>{
  const origin=allowedOrigin(request),responseOrigin=origin||allowedOrigins()[0];
  if(!validSetup())return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if(!origin)return json(403,{error:'origin_denied'},responseOrigin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  if(!requestAllowed(request,origin))return json(403,{error:'request_guard_denied'},origin);
  const path=cleanPath(new URL(request.url).pathname);
  try{
    if(path==='/admin/session'&&request.method==='POST')return await signIn(request,origin);
    if(path==='/admin/session/mfa/enroll'&&request.method==='POST')return await enrollMfa(request,origin);
    if(path==='/admin/session/mfa'&&request.method==='POST')return await verifyMfa(request,origin);
    if(path==='/admin/session/recovery-codes'&&request.method==='POST')return await generateRecoveryCodes(request,origin);
    if(path==='/admin/session/recovery'&&request.method==='POST')return await recoverMfa(request,origin);
    if(path==='/admin/session'&&request.method==='DELETE')return await signOut(request,origin);
    const context=await ownerContext(request);
    if(context.error){
      const partial=context.recoveryCodesRequired?{error:context.error,recoveryCodesRequired:true,ownerVerified:true,emailVerified:true,mfaVerified:true,environment:'staging'}:{error:context.error,mfaRequired:Boolean(context.mfaRequired)};
      return json(context.status,partial,origin);
    }
    if(path==='/admin/session'&&request.method==='GET')return ownerJson(context,200,sessionBody(context),origin);
    if(path==='/admin/overview'&&request.method==='GET')return ownerJson(context,200,await overview(context),origin);
    if(path==='/admin/diagnostic'&&request.method==='GET')return ownerJson(context,200,await overview(context),origin);
    if(path==='/admin/modules/notifications'&&request.method==='GET'){
      await audit(context.db,context.user.id,'module-read','notifications','allowed');
      return ownerJson(context,200,await notificationModule(context),origin);
    }
    if(path==='/admin/notifications/campaigns'&&request.method==='POST')return await createNotificationDraft(request,origin,context);
    if(path.startsWith('/admin/notifications/campaigns/')&&request.method==='DELETE')return await deleteNotificationDraft(path,origin,context);
    if(path.startsWith('/admin/modules/')&&request.method==='GET'){
      const moduleId=decodeURIComponent(path.slice('/admin/modules/'.length));
      if(!MODULES.includes(moduleId))return json(404,{error:'module_not_found'},origin);
      await audit(context.db,context.user.id,'module-read',moduleId,'allowed');
      return ownerJson(context,200,await moduleSnapshot(context,moduleId),origin);
    }
    if(path==='/admin/consultations/prices'&&request.method==='PATCH')return await savePrices(request,origin,context);
    return json(404,{error:'not_found'},origin);
  }catch(error){
    console.error('admin-api-v532',error instanceof Error?error.name:'unknown');
    return json(500,{error:'internal_error'},origin);
  }
});
