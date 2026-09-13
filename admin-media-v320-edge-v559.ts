/* DIVINA BRUXA 4.0 — ADMIN MEDIA V559 · MACROETAPA 11/14
   Música + De Frente com o Tarot. Autoridade server-side: owner, e-mail verificado,
   MFA AAL2, sessão não revogada, códigos de recuperação e auditoria. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const COOKIE_ACCESS='db_admin_access';
const COOKIE_REFRESH='db_admin_refresh';
const STAGING_REF='kyphdsamyygavmkzyezr';
const MAX_BODY_BYTES=32*1024;
const DEFAULT_ORIGINS=Object.freeze([
  'https://divinabruxa.github.io','https://divinabruxa.com.br','https://www.divinabruxa.com.br',
  'https://divinabruxa.com','https://www.divinabruxa.com'
]);
const YOUTUBE_HOSTS=new Set(['youtube.com','www.youtube.com','m.youtube.com','youtu.be']);
const SPOTIFY_HOSTS=new Set(['open.spotify.com','spotify.com','www.spotify.com']);
const EDITORIAL_STATES=new Set(['draft','review','scheduled','published','archived']);
const LOCALES=new Set(['pt-BR','en','es']);
const RESOURCES=new Set(['video_episode','music_release','music_track','tarot_season','tarot_episode']);

const LEGACY_VIDEO_FIELDS='id,slug,title,description,season,youtube_url,youtube_video_id,thumbnail_url,seo_title,seo_description,locale,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';
const RELEASE_FIELDS='id,slug,title,artist,release_type,cover_url,description,release_date,spotify_url,locale,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';
const TRACK_FIELDS='id,release_id,title,track_number,duration_seconds,spotify_url,is_featured,created_at,updated_at';
const SEASON_FIELDS='id,season_number,title,description,cover_url,sort_order,status,scheduled_at,published_at,created_at,updated_at';
const EPISODE_FIELDS='id,season_id,episode_number,slug,title,description,video_url,thumbnail_url,alt_text,episode_date,locale,tags,sort_order,is_featured,status,scheduled_at,published_at,created_at,updated_at';
const CARD_FIELDS='episode_id,card_index,created_at';

const env=(name:string)=>Deno.env.get(name)||'';
const allowedOrigins=()=>{const values=env('ADMIN_ALLOWED_ORIGINS').split(',').map(value=>value.trim().replace(/\/$/,'')).filter(Boolean);return values.length?values:DEFAULT_ORIGINS;};
const allowedOrigin=(request:Request)=>{const origin=String(request.headers.get('origin')||'').replace(/\/$/,'');return allowedOrigins().includes(origin)?origin:'';};
const headers=(origin:string,extra:Record<string,string|string[]>={})=>{
  const result=new Headers({
    'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','pragma':'no-cache','vary':'Origin, Sec-Fetch-Site',
    'access-control-allow-origin':origin,'access-control-allow-credentials':'true','access-control-allow-methods':'GET,POST,OPTIONS',
    'access-control-allow-headers':'content-type,x-divina-admin-request','access-control-max-age':'600','x-content-type-options':'nosniff',
    'x-frame-options':'DENY','referrer-policy':'no-referrer','cross-origin-resource-policy':'same-site',
    'strict-transport-security':'max-age=31536000; includeSubDomains',
    'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  });
  for(const [key,value] of Object.entries(extra))Array.isArray(value)?value.forEach(item=>result.append(key,item)):result.set(key,value);
  return result;
};
const json=(status:number,body:unknown,origin:string,extra?:Record<string,string|string[]>)=>new Response(JSON.stringify(body),{status,headers:headers(origin,extra)});
const parseCookies=(value:string|null)=>Object.fromEntries(String(value||'').split(';').map(part=>{const at=part.indexOf('=');return at<0?[]:[decodeURIComponent(part.slice(0,at).trim()),decodeURIComponent(part.slice(at+1).trim())];}).filter(parts=>parts.length===2));
const cookie=(name:string,value:string,maxAge:number)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`;
const cookieHeaders=(session:any)=>[cookie(COOKIE_ACCESS,session.access_token,Math.max(60,Number(session.expires_in)||3600)),cookie(COOKIE_REFRESH,session.refresh_token,60*60*24*14)];
const responseCookies=(context:any)=>context.refreshedSession?{'set-cookie':cookieHeaders(context.refreshedSession)}:undefined;
const decodeJwt=(token:string)=>{try{return JSON.parse(atob(String(token).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return {};}};
const anonClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const serviceClient=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const validSetup=()=>{try{return Boolean(env('SUPABASE_ANON_KEY')&&env('SUPABASE_SERVICE_ROLE_KEY')&&new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`);}catch{return false;}};
const fetchMetadataAllowed=(request:Request)=>{const mode=String(request.headers.get('sec-fetch-mode')||'').toLowerCase();const destination=String(request.headers.get('sec-fetch-dest')||'').toLowerCase();return(!mode||mode==='cors')&&(!destination||destination==='empty');};

const sha256=async(value:string)=>{const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(digest),item=>item.toString(16).padStart(2,'0')).join('');};
const consumeBudget=async(request:Request)=>{
  const forwarded=String(request.headers.get('x-forwarded-for')||request.headers.get('cf-connecting-ip')||'unknown').split(',')[0].trim().slice(0,96);
  const agent=String(request.headers.get('user-agent')||'unknown').slice(0,256);
  const pepper=env('ADMIN_RATE_LIMIT_PEPPER')||env('ADMIN_RECOVERY_PEPPER')||env('SUPABASE_SERVICE_ROLE_KEY');
  const keyHash=await sha256(`${STAGING_REF}:${forwarded}:${agent}:${pepper}`),limit=request.method==='GET'?120:30;
  const {data,error}=await serviceClient().rpc('consume_admin_request_budget_v547',{p_key_hash:keyHash,p_bucket:request.method==='GET'?'media-read':'media-write',p_limit:limit,p_window_seconds:60});
  if(error||!data||typeof data.allowed!=='boolean')return {error:'rate_limit_unavailable'};
  return data;
};

class RequestError extends Error{status:number;code:string;constructor(status:number,code:string){super(code);this.status=status;this.code=code;}}
const readBody=async(request:Request)=>{
  const declared=Number(request.headers.get('content-length')||0);
  if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  if(!String(request.headers.get('content-type')||'').toLowerCase().includes('application/json'))throw new RequestError(415,'json_content_type_required');
  const raw=await request.text();
  if(new TextEncoder().encode(raw).byteLength>MAX_BODY_BYTES)throw new RequestError(413,'request_body_too_large');
  try{const value=JSON.parse(raw||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();return value;}catch{throw new RequestError(400,'invalid_json_body');}
};
const clean=(value:unknown,max=200)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const slugify=(value:unknown)=>clean(value,180).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
const uuid=(value:unknown)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value||''))?String(value):'';
const integer=(value:unknown,min=0,max=9999)=>Math.max(min,Math.min(max,Math.floor(Number(value)||0)));
const safeDate=(value:unknown)=>{if(!value)return null;const date=new Date(String(value));return Number.isNaN(date.getTime())?null:date.toISOString();};
const plainDate=(value:unknown)=>{const raw=clean(value,10);if(!raw)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(raw))return null;return Number.isNaN(new Date(`${raw}T00:00:00Z`).getTime())?null:raw;};
const safeHttps=(value:unknown,max=700)=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href.slice(0,max):'';}catch{return '';}};
const locale=(value:unknown)=>LOCALES.has(clean(value,10))?clean(value,10):'pt-BR';
const tags=(value:unknown)=>[...new Set((Array.isArray(value)?value:[]).map(item=>clean(item,32)).filter(Boolean))].slice(0,12);

function youtube(value:unknown){
  try{const url=new URL(String(value||''));if(url.protocol!=='https:'||!YOUTUBE_HOSTS.has(url.hostname))return null;let id='';if(url.hostname==='youtu.be')id=url.pathname.split('/').filter(Boolean)[0]||'';else if(url.pathname.startsWith('/shorts/'))id=url.pathname.split('/')[2]||'';else if(url.pathname.startsWith('/embed/'))id=url.pathname.split('/')[2]||'';else id=url.searchParams.get('v')||'';if(!/^[A-Za-z0-9_-]{6,20}$/.test(id))return null;return{id,url:`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`};}catch{return null;}
}
function spotify(value:unknown,requiredType=''){
  try{const url=new URL(String(value||''));if(url.protocol!=='https:'||!SPOTIFY_HOSTS.has(url.hostname))return null;const parts=url.pathname.split('/').filter(Boolean),typeAt=parts.findIndex(part=>['album','track'].includes(part)),type=typeAt>=0?parts[typeAt]:'',id=typeAt>=0?parts[typeAt+1]||'':'';if(requiredType&&type!==requiredType)return null;if(!/^[A-Za-z0-9]{12,40}$/.test(id))return null;return{id,type,url:`https://open.spotify.com/${type}/${id}`};}catch{return null;}
}
function publication(raw:any,current:any=null){
  const requested=clean(raw?.status??current?.status??'draft',20).toLowerCase();
  if(!EDITORIAL_STATES.has(requested))return {error:'invalid_editorial_status'};
  const requestedAt=safeDate(raw?.publishAt??raw?.published_at??current?.scheduled_at??current?.published_at);
  if(requested==='scheduled'){
    if(!requestedAt||new Date(requestedAt).getTime()<=Date.now())return {error:'schedule_must_be_future'};
    return {status:'published',scheduled_at:requestedAt,published_at:requestedAt};
  }
  if(requested==='published'){
    const publishedAt=requestedAt||new Date().toISOString();
    return {status:'published',scheduled_at:new Date(publishedAt).getTime()>Date.now()?publishedAt:null,published_at:publishedAt};
  }
  return {status:requested,scheduled_at:null,published_at:null};
}

async function restoreSession(request:Request){
  const cookies=parseCookies(request.headers.get('cookie'));let access=cookies[COOKIE_ACCESS],refresh=cookies[COOKIE_REFRESH],session=null;
  if(!access||!refresh)return {error:'missing_session'};
  const auth=anonClient();let userResult=await auth.auth.getUser(access);
  if(userResult.error){const renewed=await auth.auth.refreshSession({refresh_token:refresh});if(renewed.error||!renewed.data.session)return {error:'expired_session'};session=renewed.data.session;access=session.access_token;refresh=session.refresh_token;userResult=await auth.auth.getUser(access);}
  if(userResult.error||!userResult.data.user)return {error:'invalid_session'};
  return {auth,user:userResult.data.user,access,refresh,session,claims:decodeJwt(access)};
}
async function ownerContext(request:Request){
  const restored:any=await restoreSession(request);if(restored.error)return {error:restored.error,status:401};
  const db=serviceClient(),user=restored.user,claims=restored.claims;
  const {data:owner,error}=await db.from('admin_owners').select('user_id,active').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(error||!owner)return {error:'forbidden',status:403};if(!user.email_confirmed_at)return {error:'email_not_verified',status:403};if(claims.aal!=='aal2')return {error:'mfa_required',status:401};
  const sessionId=String(claims.session_id||'');if(!sessionId)return {error:'invalid_session',status:401};
  const {data:known}=await db.from('admin_sessions').select('revoked_at').eq('session_id',sessionId).maybeSingle();if(known?.revoked_at)return {error:'revoked_session',status:401};
  const {count}=await db.from('admin_recovery_codes').select('id',{count:'exact',head:true}).eq('user_id',user.id).is('used_at',null);if(!(Number(count)>0))return {error:'recovery_codes_required',status:428};
  return {db,user,claims,refreshedSession:restored.session};
}
async function audit(db:any,userId:string,action:string,result:string,metadata:Record<string,unknown>={}){await db.from('admin_audit_events').insert({actor_user_id:userId,action:clean(action,80),module_id:'media',result,metadata:Object.fromEntries(Object.entries(metadata).filter(([,value])=>['string','number','boolean'].includes(typeof value)).slice(0,10))});}

async function listMedia(request:Request,context:any,origin:string){
  const current=String(request.headers.get('x-divina-admin-request')||'')==='v559';
  const results=await Promise.all([
    context.db.from('video_episodes').select(LEGACY_VIDEO_FIELDS).order('sort_order',{ascending:true}).order('created_at',{ascending:false}).limit(200),
    context.db.from('music_releases').select(RELEASE_FIELDS).order('sort_order',{ascending:true}).order('created_at',{ascending:false}).limit(240),
    context.db.from('music_tracks').select(TRACK_FIELDS).order('release_id',{ascending:true}).order('track_number',{ascending:true}).limit(500),
    context.db.from('tarot_seasons').select(SEASON_FIELDS).order('sort_order',{ascending:true}).order('season_number',{ascending:true}).limit(200),
    context.db.from('tarot_episodes').select(EPISODE_FIELDS).order('sort_order',{ascending:true}).order('episode_date',{ascending:false}).limit(300),
    context.db.from('tarot_episode_cards').select(CARD_FIELDS).order('episode_id',{ascending:true}).order('card_index',{ascending:true}).limit(800)
  ]);
  if(results.some(result=>result.error))return json(500,{error:'media_list_failed'},origin);
  const [legacy,albums,tracksResult,seasonsResult,episodesResult,cardsResult]=results;
  await audit(context.db,context.user.id,'media-list','allowed',{albums:(albums.data||[]).length,episodes:(episodesResult.data||[]).length,legacyEpisodes:(legacy.data||[]).length});
  const body:any={ok:true,release:'V559',environment:'staging',albums:albums.data||[],tracks:tracksResult.data||[],seasons:seasonsResult.data||[],episodeCards:cardsResult.data||[],legacyEpisodes:legacy.data||[],privateContentIncluded:false};
  body.episodes=current?episodesResult.data||[]:legacy.data||[];
  return json(200,body,origin,responseCookies(context));
}

async function currentRow(context:any,table:string,fields:string,id:string){if(!id)return {data:null,error:null};return await context.db.from(table).select(fields).eq('id',id).maybeSingle();}
async function persist(context:any,table:string,fields:string,id:string,value:any){return id?await context.db.from(table).update(value).eq('id',id).select(fields).single():await context.db.from(table).insert(value).select(fields).single();}
const persistenceError=(error:any,conflict='media_slug_conflict')=>String(error?.code||'')==='23505'?conflict:String(error?.code||'')==='23503'?'record_has_children':'media_save_failed';

function normalizeRelease(raw:any,current:any=null){
  const title=clean(raw?.title??current?.title,160),artist=clean(raw?.artist??current?.artist,160),link=spotify(raw?.spotifyUrl??raw?.spotify_url??current?.spotify_url,'album'),state:any=publication(raw,current);
  if(!title||!artist||!link||state.error)return {error:state.error||'invalid_music_fields'};
  const requestedType=clean(raw?.releaseType??raw?.release_type??current?.release_type??'album',20).toLowerCase(),releaseType=['album','ep','single'].includes(requestedType)?requestedType:'album';
  const slug=slugify(raw?.slug??current?.slug??`${artist}-${title}`),coverRaw=raw?.coverUrl??raw?.cover_url??current?.cover_url??'',cover=coverRaw?safeHttps(coverRaw):'';
  if(!slug||(coverRaw&&!cover))return {error:'invalid_music_fields'};
  return {value:{slug,title,artist,release_type:releaseType,cover_url:cover||null,description:clean(raw?.description??current?.description,2000),release_date:plainDate(raw?.releaseDate??raw?.release_date??current?.release_date),spotify_url:link.url,locale:locale(raw?.locale??current?.locale),sort_order:integer(raw?.sortOrder??raw?.sort_order??current?.sort_order),is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),...state,updated_at:new Date().toISOString()}};
}
function normalizeTrack(raw:any,current:any=null){
  const releaseId=uuid(raw?.releaseId??raw?.release_id??current?.release_id),title=clean(raw?.title??current?.title,160),trackNumber=integer(raw?.trackNumber??raw?.track_number??current?.track_number,1,999),urlRaw=raw?.spotifyUrl??raw?.spotify_url??current?.spotify_url??'',link=urlRaw?spotify(urlRaw):null;
  if(!releaseId||!title||(urlRaw&&!link))return {error:'invalid_track_fields'};
  return {value:{release_id:releaseId,title,track_number:trackNumber,duration_seconds:integer(raw?.durationSeconds??raw?.duration_seconds??current?.duration_seconds,0,86400)||null,spotify_url:link?.url||null,is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),updated_at:new Date().toISOString()}};
}
function normalizeSeason(raw:any,current:any=null){
  const number=integer(raw?.seasonNumber??raw?.season_number??current?.season_number,1,999),title=clean(raw?.title??current?.title,160),coverRaw=raw?.coverUrl??raw?.cover_url??current?.cover_url??'',cover=coverRaw?safeHttps(coverRaw):'',state:any=publication(raw,current);
  if(!number||!title||(coverRaw&&!cover)||state.error)return {error:state.error||'invalid_season_fields'};
  return {value:{season_number:number,title,description:clean(raw?.description??current?.description,1800),cover_url:cover||null,sort_order:integer(raw?.sortOrder??raw?.sort_order??current?.sort_order),...state,updated_at:new Date().toISOString()}};
}
function normalizeEpisode(raw:any,current:any=null){
  const seasonId=uuid(raw?.seasonId??raw?.season_id??current?.season_id),number=integer(raw?.episodeNumber??raw?.episode_number??current?.episode_number,1,9999),title=clean(raw?.title??current?.title,160),video=youtube(raw?.videoUrl??raw?.video_url??current?.video_url),state:any=publication(raw,current);
  const slug=slugify(raw?.slug??current?.slug??title),thumbnailRaw=raw?.thumbnailUrl??raw?.thumbnail_url??current?.thumbnail_url??'',thumbnail=thumbnailRaw?safeHttps(thumbnailRaw):'';
  if(!seasonId||!number||!title||!video||!slug||(thumbnailRaw&&!thumbnail)||state.error)return {error:state.error||'invalid_episode_fields'};
  return {value:{season_id:seasonId,episode_number:number,slug,title,description:clean(raw?.description??current?.description,2600),video_url:video.url,thumbnail_url:thumbnail||null,alt_text:clean(raw?.altText??raw?.alt_text??current?.alt_text,240),episode_date:plainDate(raw?.episodeDate??raw?.episode_date??current?.episode_date),locale:locale(raw?.locale??current?.locale),tags:tags(raw?.tags??current?.tags),sort_order:integer(raw?.sortOrder??raw?.sort_order??current?.sort_order),is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),...state,updated_at:new Date().toISOString()},cards:[...new Set((Array.isArray(raw?.cardIndexes)?raw.cardIndexes:[]).map((item:unknown)=>Number(item)).filter((item:number)=>Number.isInteger(item)&&item>=0&&item<=77))].slice(0,12)};
}
function normalizeLegacyVideo(raw:any,current:any=null){
  const title=clean(raw?.title??current?.title,160),description=clean(raw?.description??current?.description,2000),season=clean(raw?.season??current?.season??'De Frente com o Tarot',120)||'De Frente com o Tarot',video=youtube(raw?.youtubeUrl??raw?.youtube_url??current?.youtube_url);
  if(!title||!video)return {error:'invalid_media_fields'};const status=(raw?.status??current?.status)==='published'?'published':'draft',requested=safeDate(raw?.publishAt??raw?.published_at??current?.published_at),publishedAt=status==='published'?(requested||new Date().toISOString()):null,thumbnail=safeHttps(raw?.thumbnailUrl??raw?.thumbnail_url??current?.thumbnail_url),slug=slugify(raw?.slug??current?.slug??title);if(!slug)return {error:'invalid_slug'};
  return {value:{slug,title,description,season,youtube_url:video.url,youtube_video_id:video.id,thumbnail_url:thumbnail||null,seo_title:clean(raw?.seoTitle??raw?.seo_title??current?.seo_title??title,180),seo_description:clean(raw?.seoDescription??raw?.seo_description??current?.seo_description??description,400),locale:'pt-BR',sort_order:integer(raw?.sortOrder??raw?.sort_order??current?.sort_order),is_featured:Boolean(raw?.isFeatured??raw?.is_featured??current?.is_featured),status,scheduled_at:publishedAt&&new Date(publishedAt).getTime()>Date.now()?publishedAt:null,published_at:publishedAt,updated_at:new Date().toISOString()}};
}

async function saveResource(body:any,context:any,origin:string,resource:string){
  const spec:any={
    music_release:{table:'music_releases',fields:RELEASE_FIELDS,payload:'release',normalize:normalizeRelease,conflict:'media_slug_conflict'},
    music_track:{table:'music_tracks',fields:TRACK_FIELDS,payload:'track',normalize:normalizeTrack,conflict:'track_number_conflict'},
    tarot_season:{table:'tarot_seasons',fields:SEASON_FIELDS,payload:'season',normalize:normalizeSeason,conflict:'season_number_conflict'},
    tarot_episode:{table:'tarot_episodes',fields:EPISODE_FIELDS,payload:'episode',normalize:normalizeEpisode,conflict:'episode_conflict'},
    video_episode:{table:'video_episodes',fields:LEGACY_VIDEO_FIELDS,payload:'episode',normalize:normalizeLegacyVideo,conflict:'media_slug_conflict'}
  }[resource];
  const incoming=body?.[spec.payload]||{},id=uuid(incoming.id);let current:any=null;
  if(incoming.id&&!id)return json(400,{error:'invalid_media_id'},origin);
  if(id){const read=await currentRow(context,spec.table,spec.fields,id);if(read.error)return json(500,{error:'media_read_failed'},origin);if(!read.data)return json(404,{error:'media_not_found'},origin);current=read.data;}
  const normalized:any=spec.normalize(incoming,current);if(normalized.error)return json(400,{error:normalized.error},origin);
  if(resource==='tarot_episode'&&normalized.value.status==='published'){
    const parent=await context.db.from('tarot_seasons').select('id,status,published_at').eq('id',normalized.value.season_id).maybeSingle();
    const episodeTime=new Date(normalized.value.published_at||Date.now()).getTime(),seasonTime=parent.data?.published_at?new Date(parent.data.published_at).getTime():0;
    if(parent.error||!parent.data||parent.data.status!=='published'||seasonTime>episodeTime)return json(409,{error:'parent_season_not_published'},origin);
  }
  const result=await persist(context,spec.table,spec.fields,id,normalized.value);
  if(result.error){const code=persistenceError(result.error,spec.conflict);await audit(context.db,context.user.id,`${resource}-${id?'update':'create'}`,'failed',{code});return json(code.includes('conflict')?409:500,{error:code},origin);}
  if(resource==='tarot_episode'&&Array.isArray(incoming.cardIndexes)){
    const cleared=await context.db.from('tarot_episode_cards').delete().eq('episode_id',result.data.id);if(cleared.error)return json(500,{error:'episode_cards_save_failed',episodeSaved:true},origin);
    if(normalized.cards.length){const inserted=await context.db.from('tarot_episode_cards').insert(normalized.cards.map((cardIndex:number)=>({episode_id:result.data.id,card_index:cardIndex})));if(inserted.error)return json(500,{error:'episode_cards_save_failed',episodeSaved:true},origin);}
  }
  await audit(context.db,context.user.id,`${resource}-${id?'update':'create'}`,'allowed',{recordId:result.data.id,status:normalized.value.status});
  return json(id?200:201,{ok:true,resource,[spec.payload]:result.data,environment:'staging'},origin,responseCookies(context));
}

async function deleteResource(body:any,context:any,origin:string,resource:string){
  const tables:any={video_episode:'video_episodes',music_release:'music_releases',music_track:'music_tracks',tarot_season:'tarot_seasons',tarot_episode:'tarot_episodes'};
  const id=uuid(body?.id),table=tables[resource];if(!id)return json(400,{error:'invalid_media_id'},origin);
  const read=await context.db.from(table).select('id').eq('id',id).maybeSingle();if(read.error)return json(500,{error:'media_read_failed'},origin);if(!read.data)return json(404,{error:'media_not_found'},origin);
  const result=await context.db.from(table).delete().eq('id',id);if(result.error){const code=String(result.error.code||'')==='23503'?'record_has_children':'media_delete_failed';await audit(context.db,context.user.id,`${resource}-delete`,'failed',{recordId:id,code});return json(code==='record_has_children'?409:500,{error:code},origin);}
  await audit(context.db,context.user.id,`${resource}-delete`,'allowed',{recordId:id});return json(200,{ok:true,resource,deletedId:id,environment:'staging'},origin,responseCookies(context));
}

Deno.serve(async(request:Request)=>{
  const origin=allowedOrigin(request),responseOrigin=origin||allowedOrigins()[0];
  if(!validSetup())return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if(!origin)return json(403,{error:'origin_denied'},responseOrigin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  const guard=String(request.headers.get('x-divina-admin-request')||'');
  if(!['v320','v530','v547','v559'].includes(guard))return json(403,{error:'request_guard_denied'},origin);
  if(request.method==='POST'&&!fetchMetadataAllowed(request))return json(403,{error:'fetch_metadata_denied'},origin);
  try{
    const budget:any=await consumeBudget(request);if(budget.error)return json(503,{error:budget.error},origin);if(budget.allowed!==true)return json(429,{error:'rate_limit_exceeded',retryAfterSeconds:Number(budget.retryAfterSeconds)||1},origin,{'retry-after':String(Number(budget.retryAfterSeconds)||1)});
    const context:any=await ownerContext(request);if(context.error)return json(context.status,{error:context.error},origin);
    if(request.method==='GET')return await listMedia(request,context,origin);
    if(request.method==='POST'){
      const body:any=await readBody(request),resource=clean(body?.resource,40);
      if(!RESOURCES.has(resource))return json(400,{error:'invalid_media_resource'},origin);
      if(body?.action==='delete')return await deleteResource(body,context,origin,resource);
      if(body?.action!=='save')return json(400,{error:'invalid_media_action'},origin);
      return await saveResource(body,context,origin,resource);
    }
    return json(405,{error:'method_not_allowed'},origin);
  }catch(error){if(error instanceof RequestError)return json(error.status,{error:error.code},origin);console.error('admin-media-v559',error instanceof Error?error.name:'unknown');return json(500,{error:'internal_error'},origin);}
});
