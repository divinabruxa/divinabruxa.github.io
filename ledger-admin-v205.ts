/* DIVINA BRUXA V205 — bounded owner adjustments. Owner + active session + MFA/AAL2. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const MAX_BODY_BYTES = 12_288;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ASSET = /^[a-z0-9:_-]{3,100}$/;
const REASON = /^[A-Z0-9_]{3,80}$/;
const ACTIONS = new Set(["temporary_grant", "temporary_freeze", "temporary_revoke", "clear_override", "grant_credits", "remove_credits"]);
const ORIGINS = new Set(["https://divinabruxa.com.br", "https://www.divinabruxa.com.br", "https://divinabruxa.github.io", "http://localhost:4173", "http://127.0.0.1:4173"]);
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const allowed = (origin: string) => !origin || ORIGINS.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
const headers = (origin: string) => ({
  "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store",
  "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer", "Vary":"Origin",
  ...(origin && allowed(origin) ? { "Access-Control-Allow-Origin":origin } : {})
});
const reply = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers:headers(origin) });
const sha256 = async (value: string) => {
  if (!value) return null;
  const result = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.slice(0, 500)));
  return [...new Uint8Array(result)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (!allowed(origin)) return reply(origin, { ok:false, code:"ORIGIN_FORBIDDEN" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status:204, headers:{ ...headers(origin), "Access-Control-Allow-Headers":"authorization, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS" } });
  if (req.method !== "POST") return reply(origin, { ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return reply(origin, { ok:false, code:"BODY_TOO_LARGE" }, 413);
  let body: any;
  try { body = JSON.parse(raw || "{}"); } catch { return reply(origin, { ok:false, code:"INVALID_JSON" }, 400); }
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !anon || !service) return reply(origin, { ok:false, code:"STAGING_CONFIGURATION_MISSING" }, 503);
  if (!token) return reply(origin, { ok:false, code:"AUTH_REQUIRED" }, 401);
  const userDb = createClient(url, anon, { global:{ headers:{ Authorization:authorization } }, auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:userData, error:userError }, { data:control, error:controlError }] = await Promise.all([
    userDb.auth.getUser(token), userDb.rpc("account_control_v201")
  ]);
  if (userError || controlError || !userData.user) return reply(origin, { ok:false, code:"AUTH_INVALID" }, 401);
  if (control?.owner !== true || control?.sessionActive !== true || control?.mfaSatisfied !== true || control?.aal !== "aal2") {
    return reply(origin, { ok:false, code:"OWNER_AAL2_REQUIRED" }, 403);
  }
  const action = String(body?.action || "");
  const requestId = String(body?.requestId || "");
  const targetUserId = String(body?.targetUserId || "");
  const assetKey = body?.assetKey == null ? null : String(body.assetKey);
  const reasonCode = String(body?.reasonCode || "").toUpperCase();
  const quantity = body?.quantity == null ? null : Number(body.quantity);
  const expiresAt = body?.expiresAt == null ? null : String(body.expiresAt);
  if (!ACTIONS.has(action) || !UUID.test(requestId) || !UUID.test(targetUserId) || !REASON.test(reasonCode)
      || (assetKey !== null && !ASSET.test(assetKey)) || (quantity !== null && (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000))
      || (expiresAt !== null && Number.isNaN(new Date(expiresAt).getTime()))) {
    return reply(origin, { ok:false, code:"INVALID_ADMIN_ADJUSTMENT" }, 400);
  }
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const { data, error } = await admin.rpc("ledger_admin_adjust_v205", {
    p_actor_user_id:userData.user.id, p_target_user_id:targetUserId, p_request_id:requestId,
    p_action:action, p_asset_key:assetKey, p_quantity:quantity, p_expires_at:expiresAt,
    p_reason_code:reasonCode, p_note_sha256:await sha256(String(body?.note || ""))
  });
  if (error) {
    const message = String(error.message || "").toUpperCase();
    const code = message.includes("LOCKED") ? "V205_MANUAL_ADJUSTMENTS_LOCKED"
      : message.includes("BOUNDED") ? "BOUNDED_ADJUSTMENT_REQUIRED"
      : message.includes("NEGATIVE") ? "NEGATIVE_CREDIT_FORBIDDEN"
      : "ADMIN_ADJUSTMENT_FAILED";
    console.error("ledger admin v205", { code, requestId });
    return reply(origin, { ok:false, code }, code.includes("LOCKED") ? 423 : 409);
  }
  return reply(origin, { ok:true, release:"V205", adjustment:data, privateContentReturned:false });
});
