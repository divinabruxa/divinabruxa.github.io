/* DIVINA BRUXA — PREMIUM ENTITLEMENT
   Retorna somente a decisão mínima de acesso. A identidade vem do JWT do
   usuário e a consulta respeita RLS; nenhum segredo de serviço chega ao site. */
import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const ENTITLEMENT_KEYS = Object.freeze(['premium_lifetime']);
const DEFAULT_ORIGINS = Object.freeze([
  'https://divinabruxa.github.io',
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://divinabruxa.com',
  'https://www.divinabruxa.com'
]);

const env = (name:string) => Deno.env.get(name) || '';
const publishableKey = () => {
  const legacy = env('SUPABASE_ANON_KEY');
  if (legacy) return legacy;
  try {
    const variables = JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS'));
    const defaultVariable = typeof variables?.default === 'string' ? variables.default : '';
    return defaultVariable ? env(defaultVariable) : '';
  } catch { return ''; }
};
const allowedOrigins = () => {
  const configured = env('PREMIUM_ALLOWED_ORIGINS').split(',').map(value => value.trim().replace(/\/$/, '')).filter(Boolean);
  return configured.length ? configured : DEFAULT_ORIGINS;
};
const allowedOrigin = (request:Request) => {
  const origin = String(request.headers.get('origin') || '').replace(/\/$/, '');
  return allowedOrigins().includes(origin) ? origin : '';
};
const headers = (origin:string) => new Headers({
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store, max-age=0',
  'pragma':'no-cache',
  'vary':'Origin',
  'access-control-allow-origin':origin,
  'access-control-allow-methods':'GET,OPTIONS',
  'access-control-allow-headers':'authorization,apikey,content-type',
  'access-control-max-age':'600',
  'x-content-type-options':'nosniff',
  'x-frame-options':'DENY',
  'referrer-policy':'no-referrer',
  'cross-origin-resource-policy':'cross-origin',
  'strict-transport-security':'max-age=31536000; includeSubDomains',
  'content-security-policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
});
const json = (status:number, body:Record<string, unknown>, origin:string) => new Response(JSON.stringify(body), { status, headers:headers(origin) });

Deno.serve(async request => {
  const origin = allowedOrigin(request);
  if (!origin) return json(403, { active:false, error:'origin_not_allowed' }, 'null');
  if (request.method === 'OPTIONS') return new Response(null, { status:204, headers:headers(origin) });
  if (request.method !== 'GET') return json(405, { active:false, error:'method_not_allowed' }, origin);

  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || '';
  if (!token) return json(401, { active:false, error:'authentication_required' }, origin);

  const supabaseUrl = env('SUPABASE_URL');
  const browserKey = publishableKey();
  if (!supabaseUrl || !browserKey) return json(503, { active:false, error:'service_unavailable' }, origin);

  const client = createClient(supabaseUrl, browserKey, {
    global:{ headers:{ Authorization:`Bearer ${token}` } },
    auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
  });
  const { data:userData, error:userError } = await client.auth.getUser(token);
  const user = userData.user;
  if (userError || !user) return json(401, { active:false, error:'invalid_session' }, origin);

  const now = new Date().toISOString();
  const { data, error } = await client
    .from('entitlements')
    .select('entitlement_key,status')
    .eq('user_id', user.id)
    .in('entitlement_key', [...ENTITLEMENT_KEYS])
    .eq('status', 'active')
    .lte('starts_at', now)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (error) return json(503, { active:false, error:'entitlement_unavailable' }, origin);
  const entitlementKey = typeof data?.entitlement_key === 'string' && ENTITLEMENT_KEYS.includes(data.entitlement_key)
    ? data.entitlement_key
    : null;
  return json(200, entitlementKey ? { active:true, entitlementKey } : { active:false }, origin);
});
