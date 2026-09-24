/* DIVINA BRUXA 3.0 — EDGE FUNCTION · MEMOJI VIDEOS
   Deploy como `memoji-videos-v626` com verificação JWT da plataforma desligada.
   GET público devolve somente publicados com URLs temporárias; toda ação de
   Admin revalida owner, e-mail, MFA AAL2, sessão e códigos de recuperação. */

import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const RELEASE='3.0.0';
const COOKIE_ACCESS='db_admin_access';
const COOKIE_REFRESH='db_admin_refresh';
const STAGING_REF='kyphdsamyygavmkzyezr';
const BUCKET='memoji-videos-v626';
const TABLE='memoji_videos';
const MAX_BODY_BYTES=48*1024;
const MAX_VIDEO_BYTES=512*1024*1024;
const MAX_POSTER_BYTES=12*1024*1024;
const SIGNED_READ_SECONDS=60*60;
const CHUNK_BYTES=6*1024*1024;
const DEFAULT_ORIGINS=Object.freeze([
  'https://divinabruxa.github.io','https://divinabruxa.com.br','https://www.divinabruxa.com.br',
  'https://divinabruxa.com','https://www.divinabruxa.com'
]);
const STATES=new Set(['draft','review','scheduled','published','archived']);
const CATEGORIES=new Map([
  ['orbe','Orbe'],['site','Site'],['tarot','Tarot'],['musica','Música'],
  ['cantando','Cantando'],['bastidores','Bastidores'],['outros','Outros']
]);
const VIDEO_TYPES=new Map([['video/mp4','mp4'],['video/quicktime','mov'],['video/webm','webm'],['video/x-m4v','m4v']]);
const POSTER_TYPES=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp'],['image/avif','avif']]);
const FIELDS='id,title,description,category,accessibility_text,video_path,poster_path,video_mime,video_bytes,poster_mime,poster_bytes,status,is_visible,sort_order,publish_at,published_at,created_by,updated_by,created_at,updated_at';

const env=(name:string)=>Deno.env.get(name)||'';
const clean=(value:unknown,max=500)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const integer=(value:unknown,min=0,max=9999)=>Math.max(min,Math.min(max,Math.floor(Number(value)||0)));
const uuid=(value:unknown)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value||''))?String(value):'';
const isoDate=(value:unknown)=>{if(!value)return null;const date=new Date(String(value));return Number.isNaN(date.getTime())?null:date.toISOString();};
const allowedOrigins=()=>{const values=env('ADMIN_ALLOWED_ORIGINS').split(',').map(value=>value.trim().replace(/\/$/,'')).filter(Boolean);return values.length?values:DEFAULT_ORIGINS;};
const allowedOrigin=(request:Request)=>{const origin=String(request.headers.get('origin')||'').replace(/\/$/,'');return allowedOrigins().includes(origin)?origin:'';};
const responseHeaders=(origin:string,extra:Record<string,string|string[]>={})=>{
  const result=new Headers({
    'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','pragma':'no-cache',
    'vary':'Origin, Sec-Fetch-Site','access-control-allow-origin':origin,'access-control-allow-credentials':'true',
    'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,x-divina-admin-request,apikey,authorization',
    'access-control-max-age':'600','x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'no-referrer',
    'cross-origin-resource-policy':'cross-origin','strict-transport-security':'max-age=31536000; includeSubDomains',
    'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  });
  for(const [key,value] of Object.entries(extra))Array.isArray(value)?value.forEach(item=>result.append(key,item)):result.set(key,value);
  return result;
};
const json=(status:number,body:unknown,origin:string,extra?:Record<string,string|string[]>)=>new Response(JSON.stringify(body),{status,headers:responseHeaders(origin,extra)});
const parseCookies=(value:string|null)=>Object.fromEntries(String(value||'').split(';').map(part=>{const at=part.indexOf('=');return at<0?[]:[decodeURIComponent(part.slice(0,at).trim()),decodeURIComponent(part.slice(at+1).trim())];}).filter(parts=>parts.length===2));
const cookie=(name:string,value:string,maxAge:number)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`;
const cookieHeaders=(session:any)=>[cookie(COOKIE_ACCESS,session.access_token,Math.max(60,Number(session.expires_in)||3600)),cookie(COOKIE_REFRESH,session.refresh_token,60*60*24*14)];
const responseCookies=(context:any)=>context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined;
const decodeJwt=(token:string)=>{try{return JSON.parse(atob(String(token).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return {};}};
const anonClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const serviceClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const validSetup=()=>{try{return Boolean(env('SUPABASE_ANON_KEY')&&env('SUPABASE_SERVICE_ROLE_KEY')&&new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`);}catch{return false;}};
const fetchMetadataAllowed=(request:Request)=>{const mode=String(request.headers.get('sec-fetch-mode')||'').toLowerCase(),destination=String(request.headers.get('sec-fetch-dest')||'').toLowerCase();return(!mode||mode==='cors')&&(!destination||destination==='empty');};
const categoryLabel=(id:unknown)=>CATEGORIES.get(clean(id,30))||'Memoji';

class RequestError extends Error{status:number;code:string;constructor(status:number,code:string){super(code);this.status=status;this.code=code;}}

const readBody=async(request:Request)=>{
  const declared=Number(request.headers.get('content-length')||0);if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  if(!String(request.headers.get('content-type')||'').toLowerCase().includes('application/json'))throw new RequestError(415,'json_content_type_required');
  const raw=await request.text();if(new TextEncoder().encode(raw).byteLength>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  try{const value=JSON.parse(raw||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();return value;}catch{throw new RequestError(400,'invalid_json_body');}
};

const sha256=async(value:string)=>{const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(digest),item=>item.toString(16).padStart(2,'0')).join('');};
const consumeBudget=async(request:Request,scope:string)=>{
  const forwarded=String(request.headers.get('x-forwarded-for')||request.headers.get('cf-connecting-ip')||'unknown').split(',')[0].trim().slice(0,96);
  const agent=String(request.headers.get('user-agent')||'unknown').slice(0,256),pepper=env('ADMIN_RATE_LIMIT_PEPPER')||env('ADMIN_RECOVERY_PEPPER')||env('SUPABASE_SERVICE_ROLE_KEY');
  const keyHash=await sha256(`${STAGING_REF}:${forwarded}:${agent}:${pepper}`),limit=scope==='public'?180:(request.method==='GET'?120:30);
  const {data,error}=await serviceClient().rpc('consume_admin_request_budget_v547',{p_key_hash:keyHash,p_bucket:scope==='public'?'memoji-public':request.method==='GET'?'memoji-admin-read':'memoji-admin-write',p_limit:limit,p_window_seconds:60});
  if(error||!data||typeof data.allowed!=='boolean')return {error:'rate_limit_unavailable'};return data;
};

async function restoreSession(request:Request){
  const cookies=parseCookies(request.headers.get('cookie'));let access=cookies[COOKIE_ACCESS],refresh=cookies[COOKIE_REFRESH],session=null;
  if(!access||!refresh)return {error:'missing_session'};const auth=anonClient();let userResult=await auth.auth.getUser(access);
  if(userResult.error){const renewed=await auth.auth.refreshSession({refresh_token:refresh});if(renewed.error||!renewed.data.session)return {error:'expired_session'};session=renewed.data.session;access=session.access_token;refresh=session.refresh_token;userResult=await auth.auth.getUser(access);}
  if(userResult.error||!userResult.data.user)return {error:'invalid_session'};return {auth,user:userResult.data.user,access,refresh,session,claims:decodeJwt(access)};
}

async function ownerContext(request:Request){
  const restored:any=await restoreSession(request);if(restored.error)return {error:restored.error,status:401};const db=serviceClient(),user=restored.user,claims=restored.claims;
  const {data:owner,error}=await db.from('admin_owners').select('user_id,active').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(error||!owner)return {error:'forbidden',status:403};if(!user.email_confirmed_at)return {error:'email_not_verified',status:403};if(claims.aal!=='aal2')return {error:'mfa_required',status:401};
  const sessionId=String(claims.session_id||'');if(!sessionId)return {error:'invalid_session',status:401};
  const {data:known}=await db.from('admin_sessions').select('revoked_at').eq('session_id',sessionId).maybeSingle();if(known?.revoked_at)return {error:'revoked_session',status:401};
  const {count}=await db.from('admin_recovery_codes').select('id',{count:'exact',head:true}).eq('user_id',user.id).is('used_at',null);if(!(Number(count)>0))return {error:'recovery_codes_required',status:428};
  return {db,user,claims,refreshedSession:restored.session};
}

async function audit(db:any,userId:string,action:string,result:string,metadata:Record<string,unknown>={}){
  await db.from('admin_audit_events').insert({actor_user_id:userId,action:clean(action,80),module_id:'memoji-videos',result,metadata:Object.fromEntries(Object.entries(metadata).filter(([,value])=>['string','number','boolean'].includes(typeof value)).slice(0,10))});
}

const effectivelyPublished=(row:any,now:number)=>{
  if(row?.is_visible!==true)return false;const publishAt=row.publish_at?new Date(row.publish_at).getTime():0;
  if(row.status==='published')return !publishAt||publishAt<=now;
  return row.status==='scheduled'&&Boolean(publishAt)&&publishAt<=now;
};

async function signedRead(db:any,path:unknown){
  const safe=clean(path,500);if(!safe)return '';const {data,error}=await db.storage.from(BUCKET).createSignedUrl(safe,SIGNED_READ_SECONDS);
  return error?'':clean(data?.signedUrl,2000);
}

async function publicList(origin:string){
  const db=serviceClient(),now=Date.now();const result=await db.from(TABLE).select(FIELDS).eq('is_visible',true).in('status',['published','scheduled']).order('sort_order',{ascending:true}).order('published_at',{ascending:false}).limit(120);
  if(result.error)return json(503,{error:'memoji_public_unavailable'},origin);
  const rows=(result.data||[]).filter(row=>effectivelyPublished(row,now));
  const items=(await Promise.all(rows.map(async(row:any)=>{
    const [videoUrl,posterUrl]=await Promise.all([signedRead(db,row.video_path),row.poster_path?signedRead(db,row.poster_path):Promise.resolve('')]);
    if(!videoUrl)return null;return {id:row.id,title:clean(row.title,120),description:clean(row.description,600),category:clean(row.category,30),categoryLabel:categoryLabel(row.category),accessibilityText:clean(row.accessibility_text,240),publishedAt:row.publish_at||row.published_at,videoUrl,posterUrl:posterUrl||null};
  }))).filter(Boolean);
  return json(200,{ok:true,release:RELEASE,items,expiresAt:Date.now()+(SIGNED_READ_SECONDS*1000),autoplay:false,inventedEpisodes:0,privateContentIncluded:false},origin,{'cache-control':'public, max-age=45, stale-while-revalidate=90'});
}

async function adminList(context:any,origin:string){
  const result=await context.db.from(TABLE).select(FIELDS).order('sort_order',{ascending:true}).order('created_at',{ascending:false}).limit(240);
  if(result.error)return json(500,{error:'memoji_list_failed'},origin);
  const items=(result.data||[]).map((row:any)=>({...row,categoryLabel:categoryLabel(row.category)}));
  await audit(context.db,context.user.id,'memoji-list','allowed',{count:items.length});
  return json(200,{ok:true,release:RELEASE,environment:'staging',items,privateContentIncluded:false},origin,responseCookies(context));
}

const mimeSpec=(kind:string,mime:string)=>{
  const table=kind==='video'?VIDEO_TYPES:kind==='poster'?POSTER_TYPES:null;if(!table)return null;const extension=table.get(mime);if(!extension)return null;
  return {extension,maxBytes:kind==='video'?MAX_VIDEO_BYTES:MAX_POSTER_BYTES};
};

async function prepareUpload(body:any,context:any,origin:string){
  const asset=body?.asset||{},kind=clean(asset.kind,20),mime=clean(asset.mime,80),bytes=Number(asset.bytes),spec=mimeSpec(kind,mime);
  if(!spec)return json(400,{error:kind==='video'?'invalid_video_type':'invalid_poster_type'},origin);
  if(!Number.isSafeInteger(bytes)||bytes<=0||bytes>spec.maxBytes)return json(400,{error:kind==='video'?'video_too_large':'poster_too_large'},origin);
  const folder=crypto.randomUUID(),path=`${context.user.id}/${folder}/${kind}.${spec.extension}`;
  const signed=await context.db.storage.from(BUCKET).createSignedUploadUrl(path,{upsert:false});
  if(signed.error||!signed.data?.token)return json(503,{error:'signed_upload_failed'},origin);
  const project=new URL(env('SUPABASE_URL')).hostname.split('.')[0],endpoint=`https://${project}.storage.supabase.co/storage/v1/upload/resumable`;
  await audit(context.db,context.user.id,'memoji-prepare-upload','allowed',{kind,bytes});
  return json(200,{ok:true,upload:{bucket:BUCKET,path,token:signed.data.token,endpoint,chunkBytes:CHUNK_BYTES,maxBytes:spec.maxBytes}},origin,responseCookies(context));
}

async function storageObject(db:any,path:string){
  const parts=path.split('/'),name=parts.pop()||'',folder=parts.join('/');if(!folder||!name)return null;
  const result=await db.storage.from(BUCKET).list(folder,{limit:20,search:name});if(result.error)return null;return (result.data||[]).find((item:any)=>item.name===name)||null;
}

async function verifiedPath(context:any,value:unknown,kind:'video'|'poster'){
  const path=clean(value,500),prefix=`${context.user.id}/`;if(!path.startsWith(prefix)||path.includes('..')||path.split('/').length!==3)return {error:'invalid_storage_path'};
  const object:any=await storageObject(context.db,path);if(!object)return {error:'uploaded_asset_missing'};
  const mime=clean(object.metadata?.mimetype||object.metadata?.contentType,80),bytes=Number(object.metadata?.size||0),spec=mimeSpec(kind,mime);
  if(!spec||!bytes||bytes>spec.maxBytes)return {error:kind==='video'?'invalid_video_asset':'invalid_poster_asset'};
  return {path,mime,bytes};
}

function publication(item:any,current:any){
  const status=clean(item?.status??current?.status??'draft',20).toLowerCase();if(!STATES.has(status))return {error:'invalid_editorial_status'};
  if(status==='scheduled'){const publishAt=isoDate(item?.publishAt??current?.publish_at);if(!publishAt||new Date(publishAt).getTime()<=Date.now())return {error:'schedule_must_be_future'};return {status,publish_at:publishAt,published_at:null,is_visible:item?.isVisible!==false};}
  if(status==='published')return {status,publish_at:null,published_at:current?.published_at||new Date().toISOString(),is_visible:item?.isVisible!==false};
  return {status,publish_at:null,published_at:null,is_visible:status==='archived'?false:item?.isVisible!==false};
}

async function saveItem(body:any,context:any,origin:string){
  const raw=body?.item||{},id=uuid(raw.id);if(raw.id&&!id)return json(400,{error:'invalid_memoji_id'},origin);let current:any=null;
  if(id){const found=await context.db.from(TABLE).select(FIELDS).eq('id',id).maybeSingle();if(found.error)return json(500,{error:'memoji_read_failed'},origin);if(!found.data)return json(404,{error:'memoji_not_found'},origin);current=found.data;}
  const title=clean(raw.title??current?.title,120),description=clean(raw.description??current?.description,600),accessibility=clean(raw.accessibilityText??current?.accessibility_text,240);
  const category=CATEGORIES.has(clean(raw.category??current?.category,30))?clean(raw.category??current?.category,30):'outros',state:any=publication(raw,current);
  if(!title||state.error)return json(400,{error:state.error||'invalid_memoji_fields'},origin);
  let video={path:current?.video_path,mime:current?.video_mime,bytes:current?.video_bytes},poster={path:current?.poster_path,mime:current?.poster_mime,bytes:current?.poster_bytes};
  if(raw.videoPath){const verified:any=await verifiedPath(context,raw.videoPath,'video');if(verified.error)return json(400,{error:verified.error},origin);video=verified;}
  if(!video.path)return json(400,{error:'video_required'},origin);
  if(raw.posterPath){const verified:any=await verifiedPath(context,raw.posterPath,'poster');if(verified.error)return json(400,{error:verified.error},origin);poster=verified;}
  const value={title,description,category,accessibility_text:accessibility,video_path:video.path,poster_path:poster.path||null,video_mime:video.mime,video_bytes:video.bytes,poster_mime:poster.mime||null,poster_bytes:poster.bytes||null,sort_order:integer(raw.sortOrder??current?.sort_order),updated_by:context.user.id,updated_at:new Date().toISOString(),...state};
  const result=id?await context.db.from(TABLE).update(value).eq('id',id).select(FIELDS).single():await context.db.from(TABLE).insert({...value,created_by:context.user.id}).select(FIELDS).single();
  if(result.error){const code=String(result.error.code||'')==='23505'?'memoji_path_conflict':'memoji_save_failed';await audit(context.db,context.user.id,`memoji-${id?'update':'create'}`,'failed',{code});return json(code==='memoji_path_conflict'?409:500,{error:code},origin);}
  await audit(context.db,context.user.id,`memoji-${id?'update':'create'}`,'allowed',{recordId:result.data.id,status:value.status});
  return json(id?200:201,{ok:true,item:{...result.data,categoryLabel:categoryLabel(result.data.category)},environment:'staging'},origin,responseCookies(context));
}

async function reorder(body:any,context:any,origin:string){
  const ids=Array.isArray(body?.ids)?body.ids.map(uuid).filter(Boolean).slice(0,240):[];if(!ids.length||ids.length!==body.ids.length||new Set(ids).size!==ids.length)return json(400,{error:'invalid_memoji_order'},origin);
  const existing=await context.db.from(TABLE).select('id').in('id',ids);if(existing.error||(existing.data||[]).length!==ids.length)return json(400,{error:'invalid_memoji_order'},origin);
  const results=await Promise.all(ids.map((id:string,index:number)=>context.db.from(TABLE).update({sort_order:index*10,updated_by:context.user.id,updated_at:new Date().toISOString()}).eq('id',id)));
  if(results.some((result:any)=>result.error))return json(500,{error:'memoji_reorder_failed'},origin);
  await audit(context.db,context.user.id,'memoji-reorder','allowed',{count:ids.length});return json(200,{ok:true,ids},origin,responseCookies(context));
}

Deno.serve(async(request:Request)=>{
  const origin=allowedOrigin(request),responseOrigin=origin||allowedOrigins()[0];
  if(!validSetup())return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if(!origin)return json(403,{error:'origin_denied'},responseOrigin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:responseHeaders(origin)});
  if(String(request.headers.get('x-divina-admin-request')||'')!=='v626')return json(403,{error:'request_guard_denied'},origin);
  const scope=new URL(request.url).searchParams.get('scope')==='admin'?'admin':'public';
  if(request.method==='POST'&&!fetchMetadataAllowed(request))return json(403,{error:'fetch_metadata_denied'},origin);
  try{
    const budget:any=await consumeBudget(request,scope);if(budget.error)return json(503,{error:budget.error},origin);if(budget.allowed!==true)return json(429,{error:'rate_limit_exceeded',retryAfterSeconds:Number(budget.retryAfterSeconds)||1},origin,{'retry-after':String(Number(budget.retryAfterSeconds)||1)});
    if(scope==='public'){if(request.method!=='GET')return json(405,{error:'method_not_allowed'},origin);return await publicList(origin);}
    const context:any=await ownerContext(request);if(context.error)return json(context.status,{error:context.error},origin);
    if(request.method==='GET')return await adminList(context,origin);
    if(request.method==='POST'){
      const body:any=await readBody(request),action=clean(body?.action,40);
      if(action==='prepare_upload')return await prepareUpload(body,context,origin);
      if(action==='save')return await saveItem(body,context,origin);
      if(action==='reorder')return await reorder(body,context,origin);
      return json(400,{error:'invalid_memoji_action'},origin);
    }
    return json(405,{error:'method_not_allowed'},origin);
  }catch(error){if(error instanceof RequestError)return json(error.status,{error:error.code},origin);console.error('memoji-videos-v626',error instanceof Error?error.name:'unknown');return json(500,{error:'internal_error'},origin);}
});
