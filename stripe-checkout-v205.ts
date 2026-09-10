/* DIVINA BRUXA V205 — hosted Stripe TEST Checkout. Checkout never grants rights. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION = "2026-07-29.dahlia";
const ORIGINS = new Set(["https://divinabruxa.com.br", "https://www.divinabruxa.com.br", "https://divinabruxa.github.io", "http://localhost:4173", "http://127.0.0.1:4173"]);
const PRODUCT = /^[a-z0-9_]{3,80}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const allowed = (origin: string) => !origin || ORIGINS.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
const headers = (origin: string) => ({
  "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff",
  "Referrer-Policy":"no-referrer", "Vary":"Origin", ...(origin && allowed(origin) ? { "Access-Control-Allow-Origin":origin } : {})
});
const reply = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers:headers(origin) });
const sha256 = async (value: string) => {
  const result = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(result)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (!allowed(origin)) return reply(origin, { ok:false, code:"ORIGIN_FORBIDDEN" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status:204, headers:{ ...headers(origin), "Access-Control-Allow-Headers":"authorization, apikey, content-type, idempotency-key", "Access-Control-Allow-Methods":"POST, OPTIONS" } });
  if (req.method !== "POST") return reply(origin, { ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = env("STRIPE_RESTRICTED_KEY_TEST");
  const siteOrigin = env("PUBLIC_SITE_ORIGIN_STAGING").replace(/\/$/, "");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !anon || !service || !siteOrigin || !stripeKey.startsWith("rk_test_")) return reply(origin, { ok:false, code:"V205_TEST_CHECKOUT_NOT_CONFIGURED" }, 503);
  if (!token) return reply(origin, { ok:false, code:"AUTH_REQUIRED" }, 401);
  let body: any;
  try { body = await req.json(); } catch { return reply(origin, { ok:false, code:"INVALID_JSON" }, 400); }
  const productKey = String(body?.productKey || "");
  const contextId = String(body?.contextId || "");
  const clientKey = String(req.headers.get("idempotency-key") || body?.idempotencyKey || "");
  if (!PRODUCT.test(productKey) || clientKey.length < 16 || clientKey.length > 120) return reply(origin, { ok:false, code:"INVALID_CHECKOUT_REQUEST" }, 400);
  const userDb = createClient(url, anon, { global:{ headers:{ Authorization:authorization } }, auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:userData, error:userError }, { data:active }, { data:eligibility, error:eligibilityError }] = await Promise.all([
    userDb.auth.getUser(token), userDb.rpc("account_access_is_active_v201"),
    userDb.rpc("ledger_checkout_eligibility_v205", { p_product_key:productKey })
  ]);
  if (userError || !userData.user || active !== true) return reply(origin, { ok:false, code:"ACTIVE_SESSION_REQUIRED" }, 401);
  if (eligibilityError) return reply(origin, { ok:false, code:"ELIGIBILITY_UNAVAILABLE" }, 503);
  if (eligibility?.allowed !== true) return reply(origin, { ok:false, code:eligibility?.reason || "CHECKOUT_NOT_ALLOWED", eligibility }, 409);
  if (eligibility?.kind === "consultation" && !UUID.test(contextId)) return reply(origin, { ok:false, code:"BOOKING_CONTEXT_REQUIRED" }, 409);
  if (eligibility?.requiresOverlapAcknowledgement === true && body?.acknowledgeOverlap !== true) {
    return reply(origin, { ok:false, code:"SKIN_PACK_OVERLAP_CONFIRMATION_REQUIRED", eligibility }, 409);
  }
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:gate, error:gateError }, { data:catalog, error:catalogError }] = await Promise.all([
    admin.rpc("ledger_gate_state_v205"), admin.rpc("ledger_catalog_lookup_v205", { p_product_key:productKey })
  ]);
  if (gateError || catalogError) return reply(origin, { ok:false, code:"BILLING_STATE_UNAVAILABLE" }, 503);
  if (gate?.testCheckoutEnabled !== true || gate?.stripeTestEnabled !== true || gate?.liveBillingEnabled !== false || gate?.productionEnabled !== false) {
    return reply(origin, { ok:false, code:"V205_TEST_CHECKOUT_LOCKED" }, 423);
  }
  if (!catalog?.active || !catalog?.checkoutReady || catalog?.livemode !== false || !catalog?.stripePriceId) {
    return reply(origin, { ok:false, code:"V205_TEST_CATALOG_NOT_READY" }, 409);
  }
  const stripe = new Stripe(stripeKey, { apiVersion:API_VERSION, httpClient:Stripe.createFetchHttpClient(), appInfo:{ name:"Divina Bruxa", version:"V205" } });
  const keyHash = await sha256(`v205|${userData.user.id}|${productKey}|${clientKey}`);
  const idempotencyKey = `db:v205:checkout:${keyHash.slice(0,48)}`;
  try {
    let customerId = String((await admin.rpc("ledger_customer_lookup_v205", { p_user_id:userData.user.id })).data || "");
    if (!customerId) {
      const customer = await stripe.customers.create({
        email:userData.user.email || undefined, metadata:{ release:"V205", user_id:userData.user.id }
      }, { idempotencyKey:`db:v205:customer:${userData.user.id}` });
      if (customer.livemode) throw new Error("LIVE_OBJECT_REJECTED");
      customerId = customer.id;
      const saved = await admin.rpc("ledger_customer_upsert_v205", { p_user_id:userData.user.id, p_external_customer_id:customerId });
      if (saved.error) throw new Error("CUSTOMER_MAPPING_FAILED");
    }
    const metadata: Record<string, string> = { release:"V205", product_key:productKey, user_id:userData.user.id };
    if (contextId) metadata.context_id = contextId;
    const mode = catalog.billingMode as "payment" | "subscription";
    const params: Stripe.Checkout.SessionCreateParams = {
      mode, customer:customerId, line_items:[{ price:catalog.stripePriceId, quantity:1 }],
      success_url:`${siteOrigin}/?stripe=success&session_id={CHECKOUT_SESSION_ID}#account`,
      cancel_url:`${siteOrigin}/?stripe=cancel#subscriptions`, locale:"pt-BR",
      client_reference_id:userData.user.id, metadata, automatic_tax:{ enabled:false },
      ...(mode === "payment" ? { payment_intent_data:{ metadata } } : { subscription_data:{ metadata } })
    };
    const session = await stripe.checkout.sessions.create(params, { idempotencyKey });
    if (session.livemode || !session.id.startsWith("cs_test_")) throw new Error("LIVE_OBJECT_REJECTED");
    const recorded = await admin.rpc("ledger_checkout_record_v205", {
      p_user_id:userData.user.id, p_product_key:productKey, p_idempotency_key:idempotencyKey,
      p_external_session_id:session.id, p_external_customer_id:customerId,
      p_status:session.status || "open", p_expires_at:session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
    });
    if (recorded.error) throw new Error("CHECKOUT_RECORD_FAILED");
    return reply(origin, { ok:true, release:"V205", mode:"test", checkoutUrl:session.url, sessionId:session.id, entitlementGranted:false });
  } catch (error) {
    const code = error instanceof Error && /^[A-Z0-9_]{3,80}$/.test(error.message) ? error.message : "STRIPE_TEST_CHECKOUT_FAILED";
    console.error("stripe checkout v205", { code, requestId:crypto.randomUUID() });
    return reply(origin, { ok:false, code }, 502);
  }
});
