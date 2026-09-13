/* DIVINA BRUXA — ADMIN ANALYTICS V322 · RETENÇÃO ÉTICA V561
   Owner + MFA only. Adds consented DAU/WAU/MAU, funnel and retention aggregates.
   No raw pseudonym, private text, contact data, prompt or question is returned. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const COOKIE_ACCESS='db_admin_access';
const COOKIE_REFRESH='db_admin_refresh';
const STAGING_REF='kyphdsamyygavmkzyezr';
const DEFAULT_ORIGINS=Object.freeze([
  'https://divinabruxa.github.io',
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://divinabruxa.com',
  'https://www.divinabruxa.com'
]);
const env=(name:string)=>Deno.env.get(name)||'';
const keySet=(name:string)=>{try{const value=JSON.parse(env(name));return value&&typeof value==='object'?Object.values(value).filter(item=>typeof item==='string') as string[]:[];}catch{return [];}};
const publishableKey=()=>keySet('SUPABASE_PUBLISHABLE_KEYS')[0]||env('SUPABASE_ANON_KEY');
const secretKey=()=>keySet('SUPABASE_SECRET_KEYS')[0]||env('SUPABASE_SERVICE_ROLE_KEY');
const allowedOrigins=()=>{const values=env('ADMIN_ALLOWED_ORIGINS').split(',').map(v=>v.trim().replace(/\/$/,'')).filter(Boolean);return values.length?values:DEFAULT_ORIGINS;};
const allowedOrigin=(request:Request)=>{const origin=String(request.headers.get('origin')||'').replace(/\/$/,'');return allowedOrigins().includes(origin)?origin:'';};
const headers=(origin:string,extra:Record<string,string>={})=>{
  const result=new Headers({
    'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','pragma':'no-cache','vary':'Origin, Sec-Fetch-Site',
    'access-control-allow-origin':origin,'access-control-allow-credentials':'true','access-control-allow-methods':'GET,OPTIONS',
    'access-control-allow-headers':'content-type,x-divina-admin-request','access-control-max-age':'600',
    'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'no-referrer',
    'cross-origin-resource-policy':'same-site','strict-transport-security':'max-age=31536000; includeSubDomains',
    'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  });
  for(const [key,value] of Object.entries(extra))result.set(key,value);
  return result;
};
const json=(status:number,body:unknown,origin:string,extra:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:headers(origin,extra)});
const parseCookies=(value:string)=>Object.fromEntries(String(value||'').split(';').map(part=>{const at=part.indexOf('=');return at<0?[]:[decodeURIComponent(part.slice(0,at).trim()),decodeURIComponent(part.slice(at+1).trim())];}).filter(parts=>parts.length===2));
const decodeJwt=(token:string)=>{try{return JSON.parse(atob(String(token).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return {};}};
const anonClient=()=>createClient(env('SUPABASE_URL'),publishableKey(),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const serviceClient=()=>createClient(env('SUPABASE_URL'),secretKey(),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const validSetup=()=>{try{return Boolean(publishableKey()&&secretKey()&&new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`);}catch{return false;}};
const sha256=async(value:string)=>{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest),item=>item.toString(16).padStart(2,'0')).join('');
};
const consumeBudget=async(request:Request)=>{
  const forwarded=String(request.headers.get('x-forwarded-for')||request.headers.get('cf-connecting-ip')||'unknown').split(',')[0].trim().slice(0,96);
  const agent=String(request.headers.get('user-agent')||'unknown').slice(0,256);
  const pepper=env('ADMIN_RATE_LIMIT_PEPPER')||env('ADMIN_RECOVERY_PEPPER')||secretKey();
  const keyHash=await sha256(`${STAGING_REF}:${forwarded}:${agent}:${pepper}`);
  const {data,error}=await serviceClient().rpc('consume_admin_request_budget_v547',{
    p_key_hash:keyHash,p_bucket:'analytics-read',p_limit:120,p_window_seconds:60
  });
  if(error||!data||typeof data.allowed!=='boolean')return {error:'rate_limit_unavailable'};
  return data;
};
const isoAgo=(days:number)=>new Date(Date.now()-days*86400000).toISOString();
const integer=(value:unknown)=>Math.max(0,Math.floor(Number(value)||0));
const number=(value:unknown)=>Number.isFinite(Number(value))?Number(value):0;

async function restoreSession(request:Request){
  const cookies=parseCookies(request.headers.get('cookie')||'');
  let access=cookies[COOKIE_ACCESS],refresh=cookies[COOKIE_REFRESH];
  if(!access||!refresh)return {error:'missing_session'};
  const auth=anonClient();
  let userResult=await auth.auth.getUser(access);
  if(userResult.error){
    const refreshed=await auth.auth.refreshSession({refresh_token:refresh});
    if(refreshed.error||!refreshed.data.session)return {error:'expired_session'};
    access=refreshed.data.session.access_token;refresh=refreshed.data.session.refresh_token;
    userResult=await auth.auth.getUser(access);
  }
  if(userResult.error||!userResult.data.user)return {error:'invalid_session'};
  return {auth,user:userResult.data.user,access,refresh,claims:decodeJwt(access)};
}
async function ownerContext(request:Request){
  const restored:any=await restoreSession(request);
  if(restored.error)return {error:restored.error,status:401};
  const db=serviceClient(),user=restored.user,claims=restored.claims;
  const {data:owner,error}=await db.from('admin_owners').select('user_id,active').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(error||!owner||!user.email_confirmed_at)return {error:'forbidden',status:403};
  if(claims.aal!=='aal2')return {error:'mfa_required',status:401};
  if(!claims.session_id)return {error:'invalid_session',status:401};
  const {data:known}=await db.from('admin_sessions').select('revoked_at').eq('session_id',claims.session_id).maybeSingle();
  if(known?.revoked_at)return {error:'revoked_session',status:401};
  const {count:codes}=await db.from('admin_recovery_codes').select('id',{count:'exact',head:true}).eq('user_id',user.id).is('used_at',null);
  if(!Number(codes))return {error:'recovery_codes_required',status:428};
  return {db,user,claims};
}
const group=(rows:any[],key:string)=>{const result:Record<string,number>={};for(const row of rows||[]){const value=String(row?.[key]??'').trim()||'unknown';result[value]=(result[value]||0)+1;}return result;};
const sortedPairs=(map:Record<string,number>,limit=20)=>Object.entries(map).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit).map(([key,count])=>({key,count}));
const within=(value:string,days:number)=>{const time=new Date(value||'').getTime();return Number.isFinite(time)&&time>=Date.now()-days*86400000;};

async function snapshot(context:any){
  const db=context.db;
  const [profilesCount,dailyRows,aiRows,purchaseRows,consultRows,notificationRows,videoRows,eventRows,ethicalRows]=await Promise.all([
    db.from('profiles').select('user_id',{count:'exact',head:true}),
    db.from('daily_cards').select('user_id,revealed_at').gte('revealed_at',isoAgo(30)).limit(5000),
    db.from('ai_usage').select('user_id,mode,focus,status,credits_charged,estimated_cost_usd,created_at').gte('created_at',isoAgo(30)).order('created_at',{ascending:false}).limit(5000),
    db.from('purchases').select('user_id,product_key,platform,environment,status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(30)).order('created_at',{ascending:false}).limit(5000),
    db.from('consultation_requests').select('user_id,service_key,status,payment_status,price_brl_cents_snapshot,created_at').gte('created_at',isoAgo(30)).order('created_at',{ascending:false}).limit(5000),
    db.from('notification_campaigns').select('category,status,test_only,created_at').order('created_at',{ascending:false}).limit(1000),
    db.from('video_episodes').select('status,published_at,created_at').order('created_at',{ascending:false}).limit(1000),
    db.from('analytics_events').select('event_key,locale,country_code,platform,funnel_stage,product_key,occurred_at').gte('occurred_at',isoAgo(30)).order('occurred_at',{ascending:false}).limit(5000),
    db.rpc('ethical_analytics_snapshot_v561')
  ]);
  const failures=[profilesCount,dailyRows,aiRows,purchaseRows,consultRows,notificationRows,videoRows,eventRows].filter((result:any)=>result.error);
  if(failures.length)throw failures[0].error;

  const daily=dailyRows.data||[],ai=aiRows.data||[],purchases=purchaseRows.data||[],consultations=consultRows.data||[],notifications=notificationRows.data||[],videos=videoRows.data||[],events=eventRows.data||[];
  const ethical=!ethicalRows.error&&ethicalRows.data?.available===true?ethicalRows.data:null;
  const observed=new Map<string,number>();
  const note=(id:any,at:any)=>{const uid=String(id||'');const time=new Date(at||'').getTime();if(uid&&Number.isFinite(time))observed.set(uid,Math.max(observed.get(uid)||0,time));};
  daily.forEach((r:any)=>note(r.user_id,r.revealed_at));ai.forEach((r:any)=>note(r.user_id,r.created_at));purchases.forEach((r:any)=>note(r.user_id,r.created_at));consultations.forEach((r:any)=>note(r.user_id,r.created_at));
  const active=(days:number)=>[...observed.values()].filter(time=>time>=Date.now()-days*86400000).length;

  const paidPurchases=purchases.filter((r:any)=>r.status==='paid');
  const sandboxRevenueCents=paidPurchases.reduce((sum:number,r:any)=>sum+integer(r.price_brl_cents_snapshot),0);
  const aiSuccessful=ai.filter((r:any)=>['completed','success','settled'].includes(String(r.status||'').toLowerCase()));
  const aiCredits=ai.reduce((sum:number,r:any)=>sum+integer(r.credits_charged),0);
  const aiCostUsd=ai.reduce((sum:number,r:any)=>sum+number(r.estimated_cost_usd),0);
  const openConsultations=consultations.filter((r:any)=>!['completed','cancelled'].includes(String(r.status||'').toLowerCase())).length;
  const consultationValueCents=consultations.reduce((sum:number,r:any)=>sum+integer(r.price_brl_cents_snapshot),0);
  const countries=events.filter((r:any)=>/^[A-Z]{2}$/.test(String(r.country_code||'').toUpperCase())).map((r:any)=>({...r,country_code:String(r.country_code).toUpperCase()}));

  return {
    release:'V561',securityRelease:'V547',environment:'staging',generatedAt:new Date().toISOString(),sanitized:true,privateContentIncluded:false,
    coverage:{analyticsEvents:events.length,analyticsSampleLimited:events.length>=5000,countryEvents:countries.length,countrySignalAvailable:countries.length>0,regionSignalAvailable:false,ethicalAnalyticsEvents:integer(ethical?.coverage?.events),ethicalAnalyticsActors:integer(ethical?.coverage?.actors),ethicalAnalyticsAvailable:Boolean(ethical),observedAccountActivitySources:['daily_cards','ai_usage','purchases','consultation_requests']},
    audience:{registeredAccounts:integer(profilesCount.count),observedActiveAccounts:{d1:active(1),d7:active(7),d30:active(30)},officialDauWauMauAvailable:Boolean(ethical),dau:integer(ethical?.activity?.dau),wau:integer(ethical?.activity?.wau),mau:integer(ethical?.activity?.mau),returning7d:integer(ethical?.activity?.returning7d)},
    engagement:{dailyCards:{d1:daily.filter((r:any)=>within(r.revealed_at,1)).length,d7:daily.filter((r:any)=>within(r.revealed_at,7)).length,d30:daily.length},analyticsEvents:{d1:events.filter((r:any)=>within(r.occurred_at,1)).length,d7:events.filter((r:any)=>within(r.occurred_at,7)).length,d30:events.length}},
    ai:{requests30d:ai.length,successful30d:aiSuccessful.length,credits30d:aiCredits,estimatedCostUsd30d:Number(aiCostUsd.toFixed(6)),byMode:sortedPairs(group(ai,'mode'),10),byFocus:sortedPairs(group(ai,'focus'),10)},
    revenue:{sandboxPaidPurchases30d:paidPurchases.length,sandboxRevenueCents30d:sandboxRevenueCents,byProduct:sortedPairs(group(paidPurchases,'product_key'),20)},
    consultations:{requests30d:consultations.length,open:openConsultations,valueSnapshotCents30d:consultationValueCents,byService:sortedPairs(group(consultations,'service_key'),10),byStatus:sortedPairs(group(consultations,'status'),10)},
    content:{videoDrafts:videos.filter((r:any)=>r.status==='draft').length,videoPublished:videos.filter((r:any)=>r.status==='published'&&(!r.published_at||new Date(r.published_at)<=new Date())).length,notificationDrafts:notifications.filter((r:any)=>r.status==='draft').length},
    analytics:{eventsByKey:ethical?.eventsByKey||sortedPairs(group(events,'event_key'),30),funnel:ethical?.funnel||sortedPairs(group(events,'funnel_stage'),20),platforms:ethical?.platforms||sortedPairs(group(events,'platform'),10),locales:ethical?.locales||sortedPairs(group(events,'locale'),10),products:sortedPairs(group(events,'product_key'),20)},
    ethicalAnalytics:ethical||{available:false,release:'V561',activity:{dau:0,wau:0,mau:0,returning7d:0},retention:{d1:{eligible:0,retained:0,rate:0},d7:{eligible:0,retained:0,rate:0},d30:{eligible:0,retained:0,rate:0}},funnel:[],eventsByKey:[],routes:[],platforms:[],locales:[],daily:[],coverage:{events:0,actors:0,consentOnly:true,privateTextFields:0,rawIdentifiers:false,preciseLocation:false}},
    map:{countries:sortedPairs(group(countries,'country_code'),40),countrySignalAvailable:countries.length>0,regionSignalAvailable:false},
    privacy:{journalBodies:false,journalQuestions:false,aiPrompts:false,aiResponses:false,consultationQuestions:false,names:false,emails:false,phones:false,preciseLocation:false,rawAnalyticsIdentifiers:false,analyticsConsentOnly:true,analyticsRetentionDays:90}
  };
}

Deno.serve(async(request:Request)=>{
  const origin=allowedOrigin(request),responseOrigin=origin||allowedOrigins()[0];
  if(!validSetup())return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if(!origin)return json(403,{error:'origin_denied'},responseOrigin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  if(request.method!=='GET')return json(405,{error:'method_not_allowed'},origin);
  if(!['v322','v547','v561'].includes(String(request.headers.get('x-divina-admin-request')||'')))return json(403,{error:'request_guard_denied'},origin);
  try{
    const budget:any=await consumeBudget(request);
    if(budget.error)return json(503,{error:budget.error},origin);
    if(budget.allowed!==true)return json(429,{error:'rate_limit_exceeded',retryAfterSeconds:Number(budget.retryAfterSeconds)||1},origin,{'retry-after':String(Number(budget.retryAfterSeconds)||1)});
    const context:any=await ownerContext(request);
    if(context.error)return json(context.status,{error:context.error},origin);
    const data=await snapshot(context);
    await context.db.from('admin_audit_events').insert({actor_user_id:context.user.id,action:'analytics-snapshot-read',module_id:'analytics',result:'allowed',metadata:{release:'V561',securityRelease:'V547',sanitized:true,privateTextIncluded:false}});
    return json(200,data,origin);
  }catch(error){console.error('admin-analytics-v561',error instanceof Error?error.name:'unknown');return json(500,{error:'analytics_snapshot_failed'},origin);}
});
