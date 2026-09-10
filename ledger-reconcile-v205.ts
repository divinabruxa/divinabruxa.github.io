/* DIVINA BRUXA V205 — owner-only Stripe TEST reconciliation evidence. No grants. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION = "2026-07-29.dahlia";
const SUPPORTED = new Set([
  "checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed",
  "payment_intent.succeeded", "payment_intent.payment_failed", "customer.subscription.created",
  "customer.subscription.updated", "customer.subscription.deleted", "invoice.paid", "invoice.payment_failed",
  "charge.refunded", "charge.dispute.created", "charge.dispute.closed"
]);
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers:{ "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff" }
});
const metadata = (object: any) => object?.metadata || object?.subscription_details?.metadata || object?.parent?.subscription_details?.metadata || {};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return reply({ ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = env("STRIPE_RESTRICTED_KEY_TEST");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !anon || !service || !stripeKey.startsWith("rk_test_")) return reply({ ok:false, code:"V205_TEST_RECONCILIATION_NOT_CONFIGURED" }, 503);
  if (!token) return reply({ ok:false, code:"AUTH_REQUIRED" }, 401);
  const userDb = createClient(url, anon, { global:{ headers:{ Authorization:authorization } }, auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:userData, error:userError }, { data:control, error:controlError }] = await Promise.all([
    userDb.auth.getUser(token), userDb.rpc("account_control_v201")
  ]);
  if (userError || controlError || !userData.user) return reply({ ok:false, code:"AUTH_INVALID" }, 401);
  if (control?.owner !== true || control?.sessionActive !== true || control?.mfaSatisfied !== true || control?.aal !== "aal2") {
    return reply({ ok:false, code:"OWNER_AAL2_REQUIRED" }, 403);
  }
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const stripe = new Stripe(stripeKey, { apiVersion:API_VERSION, httpClient:Stripe.createFetchHttpClient(), appInfo:{ name:"Divina Bruxa", version:"V205" } });
  try {
    let providerTransactions = 0;
    let startingAfter: string | undefined;
    for (let pageIndex = 0; pageIndex < 100; pageIndex++) {
      const page = await stripe.events.list({ limit:100, ...(startingAfter ? { starting_after:startingAfter } : {}) });
      for (const event of page.data) {
        if (event.livemode || !SUPPORTED.has(event.type)) continue;
        const values = metadata(event.data.object);
        if (!["V204", "V205"].includes(String(values.release || ""))) continue;
        if (!values.user_id || !values.product_key) continue;
        providerTransactions++;
      }
      if (!page.has_more || !page.data.length) break;
      startingAfter = page.data.at(-1)?.id;
    }
    await admin.rpc("ledger_expire_due_v205", { p_batch:500 });
    const scopeKey = `v205-stripe-test-${new Date().toISOString().slice(0, 10)}`;
    const { data, error } = await admin.rpc("ledger_reconciliation_snapshot_v205", {
      p_scope_key:scopeKey, p_provider:"stripe", p_provider_environment:"test",
      p_provider_transactions:providerTransactions
    });
    if (error) throw new Error("RECONCILIATION_PERSIST_FAILED");
    return reply({ ok:data?.zero === true, release:"V205", mode:"test", scopeKey, reconciliation:data });
  } catch (error) {
    const code = error instanceof Error && /^[A-Z0-9_]{3,80}$/.test(error.message)
      ? error.message : "V205_TEST_RECONCILIATION_FAILED";
    console.error("ledger reconcile v205", { code, requestId:crypto.randomUUID() });
    return reply({ ok:false, code }, 502);
  }
});
