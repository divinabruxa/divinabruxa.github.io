/* DIVINA BRUXA — SUPABASE EDGE FUNCTION ADMIN API V146
   Deno/Supabase Edge Function. Segredos existem apenas no ambiente da função. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const MODULES=Object.freeze(['today','finance','users','subscriptions','ai','tarot','school','consultations','store','skins','media','notifications','analytics','seo','security','backups','audit','settings']);
const SERVICES=Object.freeze({
  'mesa-real-profissional':'Mesa Real Profissional',
  'leitura-mentes':'Leitura de Mentes',
  'carta-conselho':'Carta de Conselho',
  'pergunta-direta':'Pergunta Direta'
});
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
const requestAllowed=(request,origin)=>!isMutating(request)||(Boolean(origin)&&request.headers.get('x-divina-admin-request')==='v146');

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
  const prices=await currentPrices(context.db);
  const {count:auditEvents}=await context.db.from('admin_audit_events').select('id',{count:'exact',head:true});
  return {activeUsers:0,sandboxRevenue:0,openConsultations:0,aiCreditsUsed:0,auditEvents:Number(auditEvents)||0,consultationPrices:prices,environment:'staging'};
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
  const version=`consultas-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-v145`;
  const {error}=await context.db.rpc('admin_apply_consultation_prices_v146',{p_prices:prices,p_created_by:context.user.id,p_version:version.replace('-v145','-v146')});
  if(error){await audit(context.db,context.user.id,'price-change','consultations','failed');return json(500,{error:'price_update_failed'},origin);}
  const appliedVersion=version.replace('-v145','-v146');
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
    if(path==='/admin/session'&&request.method==='GET')return json(200,sessionBody(context),origin);
    if(path==='/admin/overview'&&request.method==='GET')return json(200,await overview(context),origin);
    if(path==='/admin/diagnostic'&&request.method==='GET')return json(200,await overview(context),origin);
    if(path.startsWith('/admin/modules/')&&request.method==='GET'){
      const moduleId=decodeURIComponent(path.slice('/admin/modules/'.length));
      if(!MODULES.includes(moduleId))return json(404,{error:'module_not_found'},origin);
      await audit(context.db,context.user.id,'module-read',moduleId,'allowed');
      return json(200,{moduleId,environment:'staging',sanitized:true,privateContentIncluded:false,updatedAt:new Date().toISOString()},origin);
    }
    if(path==='/admin/consultations/prices'&&request.method==='PATCH')return await savePrices(request,origin,context);
    return json(404,{error:'not_found'},origin);
  }catch(error){
    console.error('admin-api-v146',error instanceof Error?error.name:'unknown');
    return json(500,{error:'internal_error'},origin);
  }
});
