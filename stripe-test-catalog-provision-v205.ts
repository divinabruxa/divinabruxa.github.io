/* DIVINA BRUXA V205 — owner-only Stripe TEST catalog provisioner, bounded batches. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION = "2026-07-29.dahlia";
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers:{ "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff" }
});

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return reply({ ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = env("STRIPE_RESTRICTED_KEY_TEST");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !anon || !service || !stripeKey.startsWith("rk_test_")) return reply({ ok:false, code:"V205_TEST_CATALOG_NOT_CONFIGURED" }, 503);
  if (!token) return reply({ ok:false, code:"AUTH_REQUIRED" }, 401);
  const userDb = createClient(url, anon, { global:{ headers:{ Authorization:authorization } }, auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:userData, error:userError }, { data:control, error:controlError }] = await Promise.all([
    userDb.auth.getUser(token), userDb.rpc("account_control_v201")
  ]);
  if (userError || controlError || !userData.user) return reply({ ok:false, code:"AUTH_INVALID" }, 401);
  if (control?.owner !== true || control?.sessionActive !== true || control?.mfaSatisfied !== true || control?.aal !== "aal2") {
    return reply({ ok:false, code:"OWNER_AAL2_REQUIRED" }, 403);
  }
  let body: any = {};
  try { body = await req.json(); } catch {}
  const limit = Math.max(1, Math.min(10, Number(body?.limit || 5)));
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:gate, error:gateError }, { data:pending, error:pendingError }] = await Promise.all([
    admin.rpc("ledger_gate_state_v205"), admin.rpc("ledger_catalog_pending_v205")
  ]);
  if (gateError || pendingError) return reply({ ok:false, code:"V205_CATALOG_STATE_UNAVAILABLE" }, 503);
  if (gate?.testCatalogProvisioningEnabled !== true || gate?.stripeTestEnabled !== true || gate?.liveBillingEnabled !== false) {
    return reply({ ok:false, code:"V205_TEST_CATALOG_PROVISIONING_LOCKED" }, 423);
  }
  const stripe = new Stripe(stripeKey, { apiVersion:API_VERSION, httpClient:Stripe.createFetchHttpClient(), appInfo:{ name:"Divina Bruxa", version:"V205" } });
  const results: any[] = [];
  for (const item of (Array.isArray(pending) ? pending : []).slice(0, limit)) {
    try {
      const metadata = { release:"V205", product_key:String(item.productKey), catalog_version:"commercial-2026-09-09-v200" };
      const product = await stripe.products.create({
        name:String(item.name), active:true, metadata,
        description:`Divina Bruxa · ${String(item.kind).replaceAll("_", " ")}`
      }, { idempotencyKey:`db:v205:product:${item.productKey}` });
      if (product.livemode) throw new Error("LIVE_OBJECT_REJECTED");
      const price = await stripe.prices.create({
        product:product.id, unit_amount:Number(item.amountBrlCents), currency:"brl", active:true, metadata,
        ...(item.billingMode === "subscription" ? { recurring:{ interval:"month" } } : {})
      }, { idempotencyKey:`db:v205:price:${item.productKey}:${item.amountBrlCents}` });
      if (price.livemode) throw new Error("LIVE_OBJECT_REJECTED");
      const { error } = await admin.rpc("ledger_catalog_register_v205", {
        p_product_key:item.productKey, p_external_product_id:product.id, p_external_price_id:price.id
      });
      if (error) throw new Error("CATALOG_REGISTER_FAILED");
      results.push({ productKey:item.productKey, status:"ready", productId:product.id, priceId:price.id });
    } catch (error) {
      const code = error instanceof Error && /^[A-Z0-9_]{3,80}$/.test(error.message) ? error.message : "STRIPE_TEST_PRODUCT_FAILED";
      results.push({ productKey:item.productKey, status:"failed", code });
    }
  }
  return reply({
    ok:results.every(item => item.status === "ready"), release:"V205", mode:"test",
    processed:results.length, remaining:Math.max(0,(Array.isArray(pending) ? pending.length : 0)-results.length), results
  }, results.some(item => item.status === "failed") ? 207 : 200);
});
