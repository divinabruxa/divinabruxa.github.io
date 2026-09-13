/* DIVINA BRUXA — ADMIN MEDIA V547 · SEGURANÇA E PRIVACIDADE
   CRUD editorial de Vídeo + Música protegido por owner, MFA AAL2 e cookie seguro.
   Sem service role no navegador. Sem conteúdo privado da pessoa usuária. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const COOKIE_ACCESS='db_admin_access';
const COOKIE_REFRESH='db_admin_refresh';
const STAGING_REF='kyphdsamyygavmkzyezr';
const MAX_BODY_BYTES=32*1024;
const DEFAULT_ORIGINS=Object.freeze([
  'https://divinabruxa.github.io',
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://divinabruxa.com',
  'https://www.divinabruxa.com'
]);
const YOUTUBE_HOSTS=new Set(['youtube.com','www.youtube.com','m.youtube.com','youtu.be']);
const SPOTIFY_HOSTS=new Set(['open.spotify.com','spotify.com','www.spotify.com']);

const env=(name:string)=>Deno.env.get(name)||'';
const allowedOrigins=()=>{
  const configured=env('ADMIN_ALLOWED_ORIGINS').split(',').map(v=>v.trim().replace(/\/$/,'')).filter(Boolean);
  return configured.length?configured:DEFAULT_ORIGINS;
};
const allowedOrigin=(request:Request)=>{
  const origin=String(request.headers.get('origin')||'').replace(/\/$/,'');
  return allowedOrigins().includes(origin)?origin:'';
};
const headers=(origin:string,extra:Record<string,string|string[]>={})=>{
  const h=new Headers({
    'content-type':'application/json; charset=utf-8',
    'cache-control':'no-store, max-age=0',
    'pragma':'no-cache',
    'vary':'Origin, Sec-Fetch-Site',
    'access-control-allow-origin':origin,
    'access-control-allow-credentials':'true',
    'access-control-allow-methods':'GET,POST,OPTIONS',
    'access-control-allow-headers':'content-type,x-divina-admin-request',
    'access-control-max-age':'600',
    'x-content-type-options':'nosniff',
    'x-frame-options':'DENY',
    'referrer-policy':'no-referrer',
    'cross-origin-resource-policy':'same-site',
    'strict-transport-security':'max-age=31536000; includeSubDomains',
    'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  });
  for(const [key,value] of Object.entries(extra))Array.isArray(value)?value.forEach(item=>h.append(key,item)):h.set(key,value);
  return h;
};
const json=(status:number,body:unknown,origin:string,extra?:Record<string,string|string[]>)=>new Response(JSON.stringify(body),{status,headers:headers(origin,extra)});
const parseCookies=(value:string|null)=>Object.fromEntries(String(value||'').split(';').map(part=>{const at=part.indexOf('=');return at<0?[]:[decodeURIComponent(part.slice(0,at).trim()),decodeURIComponent(part.slice(at+1).trim())];}).filter(parts=>parts.length===2));
const cookie=(name:string,value:string,maxAge:number)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`;
const cookieHeaders=(session:any)=>[
  cookie(COOKIE_ACCESS,session.access_token,Math.max(60,Number(session.expires_in)||3600)),
  cookie(COOKIE_REFRESH,session.refresh_token,60*60*24*14)
];
const decodeJwt=(token:string)=>{try{return JSON.parse(atob(String(token).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return {};}};
const anonClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const serviceClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const validSetup=()=>{try{return Boolean(env('SUPABASE_ANON_KEY')&&env('SUPABASE_SERVICE_ROLE_KEY')&&new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`);}catch{return false;}};
const fetchMetadataAllowed=(request:Request)=>{
  const mode=String(request.headers.get('sec-fetch-mode')||'').toLowerCase();
  const destination=String(request.headers.get('sec-fetch-dest')||'').toLowerCase();
  return (!mode||mode==='cors')&&(!destination||destination==='empty');
};
const sha256=async(value:string)=>{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest),item=>item.toString(16).padStart(2,'0')).join('');
};
const consumeBudget=async(request:Request)=>{
  const forwarded=String(request.headers.get('x-forwarded-for')||request.headers.get('cf-connecting-ip')||'unknown').split(',')[0].trim().slice(0,96);
  const agent=String(request.headers.get('user-agent')||'unknown').slice(0,256);
  const pepper=env('ADMIN_RATE_LIMIT_PEPPER')||env('ADMIN_RECOVERY_PEPPER')||env('SUPABASE_SERVICE_ROLE_KEY');
  const keyHash=await sha256(`${STAGING_REF}:${forwarded}:${agent}:${pepper}`);
  const limit=request.method==='GET'?120:30;
  const {data,error}=await serviceClient().rpc('consume_admin_request_budget_v547',{
    p_key_hash:keyHash,p_bucket:request.method==='GET'?'media-read':'media-write',p_limit:limit,p_window_seconds:60
  });
  if(error||!data||typeof data.allowed!=='boolean')return {error:'rate_limit_unavailable'};
  return data;
};
class RequestError extends Error{status:number;code:string;constructor(status:number,code:string){super(code);this.status=status;this.code=code;}}
const readBody=async(request:Request)=>{
  const declared=Number(request.headers.get('content-length')||0);
  if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  const type=String(request.headers.get('content-type')||'').toLowerCase();
  if(!type.includes('application/json'))throw new RequestError(415,'json_content_type_required');
  const raw=await request.text();
  if(new TextEncoder().encode(raw).byteLength>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  try{
    const value=JSON.parse(raw||'{}');
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('object_required');
    return value;
  }catch{throw new RequestError(400,'invalid_json_body');}
};
const clean=(value:unknown,max=200)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const slugify=(value:unknown)=>clean(value,180).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
const uuid=(value:unknown)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value||''))?String(value):'';
const safeDate=(value:unknown)=>{if(!value)return null;const d=new Date(String(value));return Number.isNaN(d.getTime())?null:d.toISOString();};
const safeReleaseDate=(value:unknown)=>{const date=clean(value,10);if(!date)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;const parsed=new Date(`${date}T00:00:00Z`);return Number.isNaN(parsed.getTime())?null:date;};
const safeHttps=(value:unknown,max=700)=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href.slice(0,max):'';}catch{return '';}};

function youtube(value:unknown){
  try{
    const url=new URL(String(value||''));
    if(url.protocol!=='https:'||!YOUTUBE_HOSTS.has(url.hostname))return null;
    let id='';
    if(url.hostname==='youtu.be')id=url.pathname.split('/').filter(Boolean)[0]||'';
    else if(url.pathname.startsWith('/shorts/'))id=url.pathname.split('/')[2]||'';
    else if(url.pathname.startsWith('/embed/'))id=url.pathname.split('/')[2]||'';
    else id=url.searchParams.get('v')||'';
    if(!/^[A-Za-z0-9_-]{6,20}$/.test(id))return null;
    return {id,url:`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`};
  }catch{return null;}
}

function spotifyAlbum(value:unknown){
  try{
    const url=new URL(String(value||''));
    if(url.protocol!=='https:'||!SPOTIFY_HOSTS.has(url.hostname))return null;
    const parts=url.pathname.split('/').filter(Boolean),albumAt=parts.indexOf('album');
    const id=albumAt>=0?parts[albumAt+1]||'':'';
    if(!/^[A-Za-z0-9]{12,40}$/.test(id))return null;
    return {id,url:`https://open.spotify.com/album/${id}`};
  }catch{return null;}
}

async function restoreSession(request:Request){
  const cookies=parseCookies(request.headers.get('cookie'));
  let access=cookies[COOKIE_ACCESS],refresh=cookies[COOKIE_REFRESH],session=null;
  if(!access||!refresh)return {error:'missing_session'};
  const auth=anonClient();
  let userResult=await auth.auth.getUser(access);
  if(userResult.error){
    const refreshed=await auth.auth.refreshSession({refresh_token:refresh});
    if(refreshed.error||!refreshed.data.session)return {error:'expired_session'};
    session=refreshed.data.session;
    access=session.access_token;refresh=session.refresh_token;
    userResult=await auth.auth.getUser(access);
  }
  if(userResult.error||!userResult.data.user)return {error:'invalid_session'};
  return {auth,user:userResult.data.user,access,refresh,session,claims:decodeJwt(access)};
}

async function ownerContext(request:Request){
  const restored:any=await restoreSession(request);
  if(restored.error)return {error:restored.error,status:401};
  const db=serviceClient(),user=restored.user,claims=restored.claims;
  const {data:owner,error}=await db.from('admin_owners').select('user_id,active').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(error||!owner)return {error:'forbidden',status:403};
  if(!user.email_confirmed_at)return {error:'email_not_verified',status:403};
  if(claims.aal!=='aal2')return {error:'mfa_required',status:401};
  const sessionId=String(claims.session_id||'');
  if(!sessionId)return {error:'invalid_session',status:401};
  const {data:known}=await db.from('admin_sessions').select('revoked_at').eq('session_id',sessionId).maybeSingle();
  if(known?.revoked_at)return {error:'revoked_session',status:401};
  const {count}=await db.from('admin_recovery_codes').select('id',{count:'exact',head:true}).eq('user_id',user.id).is('used_at',null);
  if(!(Number(count)>0))return {error:'recovery_codes_required',status:428};
  return {db,user,claims,refreshedSession:restored.session};
}

async function audit(db:any,userId:string,action:string,result:string,metadata:Record<string,unknown>={}){
  await db.from('admin_audit_events').insert({
    actor_user_id:userId,
    action:String(action).slice(0,80),
    module_id:'media',
    result,
    metadata:Object.fromEntries(Object.entries(metadata).filter(([,v])=>['string','number','boolean'].includes(typeof v)).slice(0,10))
  });
}

const episodeFields='id,slug,title,description,season,youtube_url,youtube_video_id,thumbnail_url,seo_title,seo_description,locale,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';
const musicFields='id,slug,title,artist,release_type,cover_url,description,release_date,spotify_url,locale,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';

async function listMedia(context:any,origin:string){
  const [episodeResult,musicResult]=await Promise.all([
    context.db.from('video_episodes').select(episodeFields).order('sort_order',{ascending:true}).order('created_at',{ascending:false}).limit(200),
    context.db.from('music_releases').select(musicFields).order('sort_order',{ascending:true}).order('created_at',{ascending:false}).limit(200)
  ]);
  if(episodeResult.error||musicResult.error)return json(500,{error:'media_list_failed'},origin);
  await audit(context.db,context.user.id,'media-list','allowed',{episodes:(episodeResult.data||[]).length,albums:(musicResult.data||[]).length});
  return json(200,{ok:true,environment:'staging',episodes:episodeResult.data||[],albums:musicResult.data||[],privateContentIncluded:false},origin,context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined);
}

function normalizedEpisode(raw:any,current:any=null){
  const title=clean(raw?.title??current?.title,160);
  const description=clean(raw?.description??current?.description,2000);
  const season=clean(raw?.season??current?.season??'De Frente com o Tarot',120)||'De Frente com o Tarot';
  const yt=youtube(raw?.youtubeUrl??raw?.youtube_url??current?.youtube_url);
  if(!title||!yt)return {error:'invalid_media_fields'};
  const status=(raw?.status??current?.status)==='published'?'published':'draft';
  const requestedPublish=safeDate(raw?.publishAt??raw?.published_at??current?.published_at);
  const publishedAt=status==='published'?(requestedPublish||new Date().toISOString()):null;
  const scheduledAt=status==='published'&&publishedAt&&new Date(publishedAt).getTime()>Date.now()?publishedAt:null;
  const thumbnail=safeHttps(raw?.thumbnailUrl??raw?.thumbnail_url??current?.thumbnail_url,700);
  const slug=slugify(raw?.slug??current?.slug??title);
  if(!slug)return {error:'invalid_slug'};
  return {value:{
    slug,title,description,season,
    youtube_url:yt.url,youtube_video_id:yt.id,
    thumbnail_url:thumbnail||null,
    seo_title:clean(raw?.seoTitle??raw?.seo_title??current?.seo_title??title,180),
    seo_description:clean(raw?.seoDescription??raw?.seo_description??current?.seo_description??description,400),
    locale:'pt-BR',
    sort_order:Math.max(0,Math.min(9999,Math.floor(Number(raw?.sortOrder??raw?.sort_order??current?.sort_order??0)||0))),
    is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),
    status,scheduled_at:scheduledAt,published_at:publishedAt,
    updated_at:new Date().toISOString()
  }};
}

function normalizedMusic(raw:any,current:any=null){
  const title=clean(raw?.title??current?.title,160);
  const artist=clean(raw?.artist??current?.artist,160);
  const spotify=spotifyAlbum(raw?.spotifyUrl??raw?.spotify_url??current?.spotify_url);
  if(!title||!artist||!spotify)return {error:'invalid_music_fields'};
  const requestedType=clean(raw?.releaseType??raw?.release_type??current?.release_type??'album',20).toLowerCase();
  const releaseType=['album','ep','single'].includes(requestedType)?requestedType:'album';
  const status=(raw?.status??current?.status)==='published'?'published':'draft';
  const requestedPublish=safeDate(raw?.publishAt??raw?.published_at??current?.published_at);
  const publishedAt=status==='published'?(requestedPublish||new Date().toISOString()):null;
  const scheduledAt=status==='published'&&publishedAt&&new Date(publishedAt).getTime()>Date.now()?publishedAt:null;
  const slug=slugify(raw?.slug??current?.slug??`${artist}-${title}`);
  if(!slug)return {error:'invalid_slug'};
  return {value:{
    slug,title,artist,release_type:releaseType,
    cover_url:safeHttps(raw?.coverUrl??raw?.cover_url??current?.cover_url,700)||null,
    description:clean(raw?.description??current?.description,2000),
    release_date:safeReleaseDate(raw?.releaseDate??raw?.release_date??current?.release_date),
    spotify_url:spotify.url,locale:'pt-BR',
    sort_order:Math.max(0,Math.min(9999,Math.floor(Number(raw?.sortOrder??raw?.sort_order??current?.sort_order??0)||0))),
    is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),
    status,scheduled_at:scheduledAt,published_at:publishedAt,
    updated_at:new Date().toISOString()
  }};
}

async function saveEpisode(request:Request,context:any,origin:string){
  const body:any=await readBody(request),incoming=body?.episode||{};
  const id=uuid(incoming.id);
  let current:any=null;
  if(id){
    const read=await context.db.from('video_episodes').select(episodeFields).eq('id',id).maybeSingle();
    if(read.error)return json(500,{error:'media_read_failed'},origin);
    if(!read.data)return json(404,{error:'media_not_found'},origin);
    current=read.data;
  }
  const normalized:any=normalizedEpisode(incoming,current);
  if(normalized.error)return json(400,{error:normalized.error},origin);
  const result=id
    ?await context.db.from('video_episodes').update({...normalized.value,updated_by:context.user.id}).eq('id',id).select(episodeFields).single()
    :await context.db.from('video_episodes').insert({...normalized.value,created_by:context.user.id,updated_by:context.user.id}).select(episodeFields).single();
  if(result.error){
    const code=String(result.error.code||'');
    await audit(context.db,context.user.id,id?'media-update':'media-create','failed',{status:normalized.value.status});
    return json(code==='23505'?409:500,{error:code==='23505'?'media_slug_conflict':'media_save_failed'},origin);
  }
  await audit(context.db,context.user.id,id?'media-update':'media-create','allowed',{status:normalized.value.status,episodeId:result.data.id});
  return json(id?200:201,{ok:true,episode:result.data,environment:'staging'},origin,context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined);
}

async function saveMusic(request:Request,context:any,origin:string){
  const body:any=await readBody(request),incoming=body?.release||{};
  const id=uuid(incoming.id);
  let current:any=null;
  if(id){
    const read=await context.db.from('music_releases').select(musicFields).eq('id',id).maybeSingle();
    if(read.error)return json(500,{error:'music_read_failed'},origin);
    if(!read.data)return json(404,{error:'music_not_found'},origin);
    current=read.data;
  }
  const normalized:any=normalizedMusic(incoming,current);
  if(normalized.error)return json(400,{error:normalized.error},origin);
  const result=id
    ?await context.db.from('music_releases').update(normalized.value).eq('id',id).select(musicFields).single()
    :await context.db.from('music_releases').insert(normalized.value).select(musicFields).single();
  if(result.error){
    const code=String(result.error.code||'');
    await audit(context.db,context.user.id,id?'music-update':'music-create','failed',{status:normalized.value.status});
    return json(code==='23505'?409:500,{error:code==='23505'?'music_slug_conflict':'music_save_failed'},origin);
  }
  await audit(context.db,context.user.id,id?'music-update':'music-create','allowed',{status:normalized.value.status,musicId:result.data.id});
  return json(id?200:201,{ok:true,release:result.data,environment:'staging'},origin,context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined);
}

async function deleteRecord(request:Request,context:any,origin:string,resource:string){
  const body:any=await readBody(request),id=uuid(body?.id);
  if(!id)return json(400,{error:resource==='music_release'?'invalid_music_id':'invalid_media_id'},origin);
  const table=resource==='music_release'?'music_releases':'video_episodes';
  const prefix=resource==='music_release'?'music':'media';
  const {data:row,error:readError}=await context.db.from(table).select('id,status').eq('id',id).maybeSingle();
  if(readError)return json(500,{error:`${prefix}_read_failed`},origin);
  if(!row)return json(404,{error:`${prefix}_not_found`},origin);
  const {error}=await context.db.from(table).delete().eq('id',id);
  if(error){await audit(context.db,context.user.id,`${prefix}-delete`,'failed',{recordId:id});return json(500,{error:`${prefix}_delete_failed`},origin);}
  await audit(context.db,context.user.id,`${prefix}-delete`,'allowed',{recordId:id,status:row.status});
  return json(200,{ok:true,deletedId:id,resource,environment:'staging'},origin,context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined);
}

Deno.serve(async(request:Request)=>{
  const origin=allowedOrigin(request),responseOrigin=origin||allowedOrigins()[0];
  if(!validSetup())return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if(!origin)return json(403,{error:'origin_denied'},responseOrigin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  if(!['v320','v530','v547'].includes(String(request.headers.get('x-divina-admin-request')||'')))return json(403,{error:'request_guard_denied'},origin);
  if(request.method==='POST'&&!fetchMetadataAllowed(request))return json(403,{error:'fetch_metadata_denied'},origin);
  try{
    const budget:any=await consumeBudget(request);
    if(budget.error)return json(503,{error:budget.error},origin);
    if(budget.allowed!==true)return json(429,{error:'rate_limit_exceeded',retryAfterSeconds:Number(budget.retryAfterSeconds)||1},origin,{'retry-after':String(Number(budget.retryAfterSeconds)||1)});
    const context:any=await ownerContext(request);
    if(context.error)return json(context.status,{error:context.error},origin);
    if(request.method==='GET')return await listMedia(context,origin);
    if(request.method==='POST'){
      const body:any=await readBody(request.clone());
      const resource=body?.resource==='music_release'?'music_release':'video_episode';
      if(body?.action==='delete')return await deleteRecord(request,context,origin,resource);
      return resource==='music_release'?await saveMusic(request,context,origin):await saveEpisode(request,context,origin);
    }
    return json(405,{error:'method_not_allowed'},origin);
  }catch(error){
    if(error instanceof RequestError)return json(error.status,{error:error.code},origin);
    console.error('admin-media-v547',error instanceof Error?error.name:'unknown');
    return json(500,{error:'internal_error'},origin);
  }
});

