/* DIVINA BRUXA — CARTA DO DIA POR CONTA V189 · SUPABASE STAGING */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const TZ = "America/Sao_Paulo";
const SESSION_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEFAULT_ORIGINS = [
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

const env = (name: string) => Deno.env.get(name)?.trim() || "";

function allowedOrigins() {
  const configured = env("STAGING_ALLOWED_ORIGINS");
  if (!configured) return new Set(DEFAULT_ORIGINS);
  try {
    const parsed = configured.startsWith("[") ? JSON.parse(configured) : configured.split(",");
    return new Set([...DEFAULT_ORIGINS, ...(Array.isArray(parsed) ? parsed : [])].map(String).map(value => value.trim()).filter(Boolean));
  } catch {
    return new Set(DEFAULT_ORIGINS);
  }
}

function requestOrigin(req: Request) {
  const origin = req.headers.get("Origin");
  if (origin && !allowedOrigins().has(origin)) return { origin:null, allowed:false };
  return { origin, allowed:true };
}

function responseHeaders(origin: string | null) {
  const result = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Vary": "Origin"
  });
  if (origin) result.set("Access-Control-Allow-Origin", origin);
  return result;
}

const json = (origin: string | null, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers:responseHeaders(origin)
});

function brasiliaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone:TZ,
    year:"numeric",
    month:"2-digit",
    day:"2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function exactRandom78() {
  const bytes = new Uint8Array(1);
  for (;;) {
    crypto.getRandomValues(bytes);
    if (bytes[0] < 234) return bytes[0] % 78;
  }
}

Deno.serve(async (req: Request) => {
  const request = requestOrigin(req);
  if (!request.allowed) return json(null, { ok:false, code:"ORIGIN_NOT_ALLOWED" }, 403);
  const origin = request.origin;
  if (req.method === "OPTIONS") {
    const headers = responseHeaders(origin);
    headers.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Max-Age", "600");
    return new Response(null, { status:204, headers });
  }
  if (!["GET", "POST"].includes(req.method)) return json(origin, { ok:false, code:"METHOD_NOT_ALLOWED" }, 405);

  const authorization = req.headers.get("Authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!token) return json(origin, { ok:false, code:"AUTH_REQUIRED" }, 401);
  const url = env("SUPABASE_URL");
  const publishable = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !publishable || !service) return json(origin, { ok:false, code:"SERVER_CONFIG_ERROR" }, 503);

  const userClient = createClient(url, publishable, {
    global:{ headers:{ Authorization:authorization } },
    auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
  });
  const [{ data:userData, error:userError }, { data:claimsData, error:claimsError }] = await Promise.all([
    userClient.auth.getUser(token),
    userClient.auth.getClaims(token)
  ]);
  const user = userData?.user;
  const claims = claimsData?.claims as Record<string, unknown> | undefined;
  const sessionId = String(claims?.session_id || "");
  if (userError || claimsError || !user || claims?.sub !== user.id || claims?.role !== "authenticated" || !SESSION_UUID.test(sessionId)) {
    return json(origin, { ok:false, code:"AUTH_INVALID" }, 401);
  }
  if (!user.email_confirmed_at && !user.confirmed_at) return json(origin, { ok:false, code:"EMAIL_VERIFICATION_REQUIRED" }, 403);

  const admin = createClient(url, service, {
    auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
  });
  const { data:sessionActive, error:sessionError } = await admin.rpc("verify_active_account_session", {
    p_user_id:user.id,
    p_session_id:sessionId
  });
  if (sessionError || sessionActive !== true) return json(origin, { ok:false, code:"ACTIVE_SESSION_REQUIRED" }, 401);

  const date = brasiliaDateKey();
  const existing = await admin.from("daily_cards")
    .select("card_id,local_date,timezone,revealed_at")
    .eq("user_id", user.id)
    .eq("local_date", date)
    .maybeSingle();
  if (existing.error) return json(origin, { ok:false, code:"DAILY_CARD_LOOKUP_FAILED" }, 500);
  if (existing.data) return json(origin, {
    ok:true,
    date,
    timezone:TZ,
    cardIndex:existing.data.card_id,
    createdAt:existing.data.revealed_at,
    source:"backend-cache",
    orientation:"normal"
  });

  const candidate = exactRandom78();
  const inserted = await admin.from("daily_cards")
    .insert({ user_id:user.id, local_date:date, card_id:candidate, timezone:TZ })
    .select("card_id,local_date,timezone,revealed_at")
    .maybeSingle();
  if (!inserted.error && inserted.data) return json(origin, {
    ok:true,
    date,
    timezone:TZ,
    cardIndex:inserted.data.card_id,
    createdAt:inserted.data.revealed_at,
    source:"backend",
    orientation:"normal"
  });

  const raced = await admin.from("daily_cards")
    .select("card_id,local_date,timezone,revealed_at")
    .eq("user_id", user.id)
    .eq("local_date", date)
    .single();
  if (raced.error || !raced.data) return json(origin, { ok:false, code:"DAILY_CARD_CREATE_FAILED" }, 500);
  return json(origin, {
    ok:true,
    date,
    timezone:TZ,
    cardIndex:raced.data.card_id,
    createdAt:raced.data.revealed_at,
    source:"backend-cache",
    orientation:"normal"
  });
});
