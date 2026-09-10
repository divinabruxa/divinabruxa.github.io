/* DIVINA BRUXA V205 — read-only account projection from the Universal Ledger.
   Deploy target: billing-account-v191 (replacement source for client compatibility). */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const MAX_BODY_BYTES = 8_192;
const DEFAULT_ORIGINS = new Set([
  "https://divinabruxa.com.br", "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io", "http://localhost:4173", "http://127.0.0.1:4173"
]);
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const originAllowed = (origin: string) => DEFAULT_ORIGINS.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
const headers = (origin: string) => ({
  "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store, max-age=0",
  "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer", "Vary":"Origin",
  ...(origin && originAllowed(origin) ? { "Access-Control-Allow-Origin":origin } : {})
});
const reply = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers:headers(origin) });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !originAllowed(origin)) return reply(origin, { ok:false, error:{ code:"ORIGIN_NOT_ALLOWED" } }, 403);
  if (req.method === "OPTIONS") return new Response(null, {
    status:204, headers:{ ...headers(origin), "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods":"POST, OPTIONS" }
  });
  if (req.method !== "POST") return reply(origin, { ok:false, error:{ code:"METHOD_NOT_ALLOWED" } }, 405);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return reply(origin, { ok:false, error:{ code:"BODY_TOO_LARGE" } }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw || "{}");
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error("invalid");
  } catch {
    return reply(origin, { ok:false, error:{ code:"INVALID_JSON" } }, 400);
  }
  const action = String(body.action || "snapshot");
  if (action !== "snapshot") {
    return reply(origin, {
      ok:false, release:"V205",
      error:{ code:"LEDGER_READ_ONLY", message:"Direitos só mudam após confirmação do provedor ou ajuste da proprietária com MFA." }
    }, 409);
  }
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !key) return reply(origin, { ok:false, error:{ code:"STAGING_CONFIGURATION_MISSING" } }, 503);
  if (!token) return reply(origin, { ok:false, error:{ code:"AUTHENTICATION_REQUIRED" } }, 401);
  const userDb = createClient(url, key, {
    global:{ headers:{ Authorization:authorization } },
    auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
  });
  const { data:userData, error:userError } = await userDb.auth.getUser(token);
  if (userError || !userData.user) return reply(origin, { ok:false, error:{ code:"AUTHENTICATION_REQUIRED" } }, 401);
  const { data:snapshot, error } = await userDb.rpc("ledger_entitlement_snapshot_v205");
  if (error || !snapshot) {
    console.error("billing account v205", { code:"LEDGER_SNAPSHOT_FAILED", requestId:crypto.randomUUID() });
    return reply(origin, { ok:false, release:"V205", error:{ code:"LEDGER_SNAPSHOT_FAILED", message:"Não foi possível restaurar seus direitos agora." } }, 503);
  }
  const compatible = {
    ...snapshot,
    release:"V191",
    authorityRelease:"V205",
    environment:"staging",
    mode:"universal-ledger",
    authenticated:true,
    gates:{
      ...(snapshot.gates || {}), realBilling:false, stripeCheckout:false,
      stripeWebhook:false, customerPortal:false, automaticTax:false, production:false,
      clientCanGrant:false
    }
  };
  return reply(origin, {
    ok:true, release:"V205", compatibilityRelease:"V191", environment:"staging",
    message:"Direitos restaurados pelo Ledger Universal.", snapshot:compatible
  });
});
