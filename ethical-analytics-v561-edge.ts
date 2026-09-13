/* DIVINA BRUXA 4.0 — ETHICAL ANALYTICS INGEST · V561 · STAGING ONLY
   Deploy slug: ethical-analytics-v561 · verify_jwt=false.
   Authorization is performed here with the publishable-key allowlist because
   current sb_publishable_* keys are not JWTs. Secret keys never reach clients.
   Raw actor/session tokens and private/free-form text are never persisted. */

import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

type InputEvent = {
  event_id?: unknown;
  event_key?: unknown;
  route_key?: unknown;
  occurred_at?: unknown;
};

const STAGING_REF = 'kyphdsamyygavmkzyezr';
const MAX_BODY_BYTES = 32_768;
const MAX_BATCH = 20;
const MAX_PAST_MS = 48 * 60 * 60 * 1000;
const MAX_FUTURE_MS = 5 * 60 * 1000;
const CONSENT_VERSION = 'privacy-v547-2026-09-13';
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,96}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const DEFAULT_ORIGINS = Object.freeze([
  'https://divinabruxa.github.io',
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://divinabruxa.com',
  'https://www.divinabruxa.com'
]);
const EVENT_STAGES = Object.freeze<Record<string,string>>({
  session_start:'arrival',
  route_view:'exploration',
  daily_revealed:'ritual',
  school_challenge_started:'learning',
  school_challenge_completed:'return',
  journal_calendar_opened:'return',
  journal_favorites_opened:'return',
  favorite_route_changed:'exploration',
  notification_preference_saved:'permission',
  media_catalog_viewed:'content',
  skin_catalog_viewed:'content'
});
const ROUTES = new Set([
  'home','tarot','daily','library','spreads','school','store','subscriptions',
  'music','videos','skins','notifications','private-area'
]);

const env = (name:string) => Deno.env.get(name) || '';
const jsonKeys = (name:string) => {
  try {
    const parsed = JSON.parse(env(name));
    return parsed && typeof parsed === 'object'
      ? Object.values(parsed).filter(value => typeof value === 'string') as string[]
      : [];
  } catch { return []; }
};
const publishableKeys = () => {
  const modern = jsonKeys('SUPABASE_PUBLISHABLE_KEYS');
  const legacy = env('SUPABASE_ANON_KEY');
  return [...new Set([...modern,...(legacy ? [legacy] : [])])];
};
const secretKey = () => jsonKeys('SUPABASE_SECRET_KEYS')[0] || env('SUPABASE_SERVICE_ROLE_KEY');
const allowedOrigins = () => {
  const configured = env('ANALYTICS_ALLOWED_ORIGINS').split(',').map(value => value.trim().replace(/\/$/,'')).filter(Boolean);
  return configured.length ? configured : DEFAULT_ORIGINS;
};
const requestOrigin = (request:Request) => String(request.headers.get('origin') || '').replace(/\/$/,'');
const allowedOrigin = (request:Request) => {
  const origin = requestOrigin(request);
  return allowedOrigins().includes(origin) ? origin : '';
};
const responseHeaders = (origin:string, extra:Record<string,string> = {}) => {
  const headers = new Headers({
    'content-type':'application/json; charset=utf-8',
    'cache-control':'no-store, max-age=0',
    'pragma':'no-cache',
    'vary':'Origin, Sec-Fetch-Site',
    'access-control-allow-origin':origin,
    'access-control-allow-methods':'POST,DELETE,OPTIONS',
    'access-control-allow-headers':'content-type,apikey,x-divina-analytics-request',
    'access-control-max-age':'600',
    'x-content-type-options':'nosniff',
    'x-frame-options':'DENY',
    'referrer-policy':'no-referrer',
    'cross-origin-resource-policy':'same-site',
    'strict-transport-security':'max-age=31536000; includeSubDomains',
    'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  });
  for (const [key,value] of Object.entries(extra)) headers.set(key,value);
  return headers;
};
const json = (status:number, body:unknown, origin:string, extra:Record<string,string> = {}) =>
  new Response(JSON.stringify(body),{status,headers:responseHeaders(origin,extra)});

const equal = (left:string,right:string) => {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length,b.length);
  for (let index=0;index<length;index+=1) difference |= (a[index] || 0) ^ (b[index] || 0);
  return difference === 0;
};
const publishableKeyAllowed = (request:Request) => {
  const candidate = String(request.headers.get('apikey') || '');
  return Boolean(candidate) && publishableKeys().some(key => equal(candidate,key));
};
const validSetup = () => {
  try {
    return Boolean(
      publishableKeys().length && secretKey() && env('ANALYTICS_HASH_PEPPER').length >= 32 &&
      new URL(env('SUPABASE_URL')).hostname === `${STAGING_REF}.supabase.co`
    );
  } catch { return false; }
};
const serviceClient = () => createClient(env('SUPABASE_URL'),secretKey(),{
  auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
  global:{headers:{'x-client-info':'divina-ethical-analytics-v561'}}
});
const hex = (bytes:ArrayBuffer) => Array.from(new Uint8Array(bytes),value => value.toString(16).padStart(2,'0')).join('');
const hmac = async (domain:string,value:string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw',encoder.encode(env('ANALYTICS_HASH_PEPPER')),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return hex(await crypto.subtle.sign('HMAC',key,encoder.encode(`${domain}:${STAGING_REF}:${value}`)));
};
const localeGroup = (value:unknown) => {
  const locale = String(value || '').toLowerCase();
  if (locale.startsWith('pt')) return 'pt';
  if (locale.startsWith('en')) return 'en';
  if (locale.startsWith('es')) return 'es';
  return 'other';
};
const platformGroup = (value:unknown) => ['web','pwa'].includes(String(value || '').toLowerCase())
  ? String(value).toLowerCase() : 'web';

async function readJson(request:Request) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BODY_BYTES) throw new Error('body_too_large');
  if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) throw new Error('json_required');
  const source = await request.text();
  if (!source || new TextEncoder().encode(source).byteLength > MAX_BODY_BYTES) throw new Error('body_too_large');
  try { return JSON.parse(source); }
  catch { throw new Error('invalid_json'); }
}

async function consumeBudget(request:Request) {
  const forwarded = String(request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0,96);
  const agent = String(request.headers.get('user-agent') || 'unknown').slice(0,180);
  const keyHash = await hmac('rate',`${forwarded}:${agent}`);
  if (!HASH_PATTERN.test(keyHash)) return {error:'rate_limit_unavailable'};
  const {data,error} = await serviceClient().rpc('consume_ethical_analytics_budget_v561',{
    p_key_hash:keyHash,p_limit:120,p_window_seconds:60
  });
  if (error || !data || typeof data.allowed !== 'boolean') return {error:'rate_limit_unavailable'};
  return data;
}

const normalizeEvent = (input:InputEvent) => {
  const eventId = String(input?.event_id || '');
  const eventKey = String(input?.event_key || '').trim().toLowerCase();
  const routeKey = String(input?.route_key || '').trim().toLowerCase();
  const occurred = new Date(String(input?.occurred_at || ''));
  const time = occurred.getTime();
  if (!UUID_PATTERN.test(eventId) || !Object.prototype.hasOwnProperty.call(EVENT_STAGES,eventKey)) return null;
  if (routeKey && !ROUTES.has(routeKey)) return null;
  if (!Number.isFinite(time) || time < Date.now()-MAX_PAST_MS || time > Date.now()+MAX_FUTURE_MS) return null;
  return {eventId,eventKey,routeKey:routeKey || null,funnelStage:EVENT_STAGES[eventKey],occurredAt:occurred.toISOString()};
};

async function ingest(request:Request,origin:string) {
  const payload = await readJson(request);
  if (payload?.release !== 'V561' || payload?.consent !== true || payload?.consent_version !== CONSENT_VERSION) {
    return json(403,{error:'explicit_consent_required'},origin);
  }
  const actorToken = String(payload?.actor_token || '');
  const sessionToken = String(payload?.session_token || '');
  if (!TOKEN_PATTERN.test(actorToken) || !TOKEN_PATTERN.test(sessionToken)) return json(400,{error:'invalid_pseudonymous_token'},origin);
  if (!Array.isArray(payload?.events) || payload.events.length < 1 || payload.events.length > MAX_BATCH) return json(400,{error:'invalid_event_batch'},origin);
  const events = payload.events.map(normalizeEvent);
  if (events.some((event:unknown) => !event)) return json(400,{error:'event_not_allowed'},origin);

  const [actorHash,sessionHash] = await Promise.all([hmac('actor',actorToken),hmac('session',sessionToken)]);
  if (!HASH_PATTERN.test(actorHash) || !HASH_PATTERN.test(sessionHash)) return json(500,{error:'hash_failed'},origin);
  const receivedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now()+90*86400000).toISOString();
  const locale = localeGroup(payload?.locale);
  const platform = platformGroup(payload?.platform);
  const rows = events.map((event:any) => ({
    event_id:event.eventId,
    actor_hash:actorHash,
    session_hash:sessionHash,
    event_key:event.eventKey,
    route_key:event.routeKey,
    funnel_stage:event.funnelStage,
    locale_group:locale,
    platform,
    consent_version:CONSENT_VERSION,
    release:'V561',
    occurred_at:event.occurredAt,
    received_at:receivedAt,
    expires_at:expiresAt
  }));
  const db = serviceClient();
  const {error} = await db.from('ethical_analytics_events_v561').upsert(rows,{onConflict:'event_id',ignoreDuplicates:true});
  if (error) throw error;
  await db.from('ethical_analytics_events_v561').delete().lt('expires_at',receivedAt);
  return json(202,{
    accepted:rows.length,
    release:'V561',
    environment:'staging',
    sanitized:true,
    privateTextIncluded:false,
    rawIdentifiersStored:false,
    retentionDays:90
  },origin);
}

async function erase(request:Request,origin:string) {
  const payload = await readJson(request);
  const actorToken = String(payload?.actor_token || '');
  if (!TOKEN_PATTERN.test(actorToken)) return json(400,{error:'invalid_pseudonymous_token'},origin);
  const actorHash = await hmac('actor',actorToken);
  const {error,count} = await serviceClient().from('ethical_analytics_events_v561').delete({count:'exact'}).eq('actor_hash',actorHash);
  if (error) throw error;
  return json(200,{removed:true,rows:Number(count)||0,rawIdentifierStored:false},origin);
}

Deno.serve(async (request:Request) => {
  const origin = allowedOrigin(request);
  const responseOrigin = origin || allowedOrigins()[0];
  if (!validSetup()) return json(503,{error:'staging_backend_not_configured'},responseOrigin);
  if (!origin) return json(403,{error:'origin_denied'},responseOrigin);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:responseHeaders(origin)});
  if (!['POST','DELETE'].includes(request.method)) return json(405,{error:'method_not_allowed'},origin);
  if (request.headers.get('x-divina-analytics-request') !== 'v561' || !publishableKeyAllowed(request)) return json(403,{error:'request_guard_denied'},origin);
  try {
    const budget:any = await consumeBudget(request);
    if (budget.error) return json(503,{error:budget.error},origin);
    if (budget.allowed !== true) return json(429,{error:'rate_limit_exceeded',retryAfterSeconds:Number(budget.retryAfterSeconds)||1},origin,{'retry-after':String(Number(budget.retryAfterSeconds)||1)});
    return request.method === 'DELETE' ? await erase(request,origin) : await ingest(request,origin);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'ingest_failed';
    if (['body_too_large','json_required','invalid_json'].includes(reason)) return json(400,{error:reason},origin);
    console.error('ethical-analytics-v561',error instanceof Error ? error.name : 'unknown');
    return json(500,{error:'ethical_analytics_failed'},origin);
  }
});
