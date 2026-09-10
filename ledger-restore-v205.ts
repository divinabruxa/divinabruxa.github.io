/* DIVINA BRUXA V205 — provider-backed restoration in Stripe TEST.
   The client asks to reconcile; it never supplies a product, price or entitlement. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION = "2026-07-29.dahlia";
const ORIGINS = new Set(["https://divinabruxa.com.br", "https://www.divinabruxa.com.br", "https://divinabruxa.github.io", "http://localhost:4173", "http://127.0.0.1:4173"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT = /^[a-z0-9_]{3,80}$/;
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const allowed = (origin: string) => !origin || ORIGINS.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
const headers = (origin: string) => ({
  "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff",
  "Vary":"Origin", ...(origin && allowed(origin) ? { "Access-Control-Allow-Origin":origin } : {})
});
const reply = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers:headers(origin) });
const idOf = (value: any) => typeof value === "string" ? value : String(value?.id || "");
const iso = (value: unknown) => Number(value) > 0 ? new Date(Number(value) * 1000).toISOString() : null;
const digest = async (value: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const result = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(result)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};
const meta = (...items: any[]) => Object.assign({}, ...items.map(item => item?.metadata || item?.parent?.subscription_details?.metadata || {}));
const identity = (userId: string, ...items: any[]) => {
  const values = meta(...items);
  return {
    valid:String(values.user_id || "") === userId && UUID.test(String(values.user_id || "")) && PRODUCT.test(String(values.product_key || "")),
    productKey:String(values.product_key || "")
  };
};
const dates = (subscription: any, invoice?: any) => {
  const lines = invoice?.lines?.data || [];
  const starts = [subscription?.current_period_start, ...lines.map((line: any) => line?.period?.start)].map(Number).filter(Number.isFinite);
  const ends = [subscription?.current_period_end, ...lines.map((line: any) => line?.period?.end)].map(Number).filter(Number.isFinite);
  return { start:starts.length ? iso(Math.min(...starts)) : null, end:ends.length ? iso(Math.max(...ends)) : null };
};
const subscriptionAction = (status: string) => ["active", "trialing"].includes(status)
  ? "subscription_active" : ["past_due", "unpaid", "incomplete"].includes(status)
    ? "subscription_past_due" : "subscription_expired";

type Apply = {
  eventKey: string; eventType: string; userId: string; productKey: string; action: string;
  root: string; transaction: string; subscription?: string | null; amount: number; currency?: string;
  periodStart?: string | null; periodEnd?: string | null; cancelAtPeriodEnd?: boolean; status: string;
};

async function apply(admin: SupabaseClient, item: Apply) {
  const observedAt = new Date().toISOString();
  const { data, error } = await admin.rpc("ledger_apply_provider_event_v205", {
    p_provider:"stripe", p_provider_environment:"test", p_event_key:item.eventKey,
    p_event_type:item.eventType, p_payload_sha256:await digest({ id:item.transaction, state:item.status, amount:item.amount }),
    p_user_id:item.userId, p_product_key:item.productKey, p_action:item.action,
    p_root_reference:item.root, p_transaction_reference:item.transaction,
    p_subscription_reference:item.subscription || null, p_amount_brl_cents:item.amount,
    p_currency:String(item.currency || "brl").toLowerCase(), p_occurred_at:observedAt,
    p_period_start:item.periodStart || null, p_period_end:item.periodEnd || null,
    p_cancel_at_period_end:Boolean(item.cancelAtPeriodEnd),
    p_metadata:{ objectType:"provider_restore", providerStatus:item.status }
  });
  if (error) throw new Error("RESTORE_LEDGER_APPLY_FAILED");
  return data;
}

async function pages<T>(load: (startingAfter?: string) => Promise<{ data: T[]; has_more: boolean }>) {
  const rows: T[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const result = await load(cursor);
    rows.push(...result.data);
    if (!result.has_more || !result.data.length) break;
    cursor = idOf(result.data.at(-1));
  }
  return rows;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (!allowed(origin)) return reply(origin, { ok:false, code:"ORIGIN_FORBIDDEN" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status:204, headers:{ ...headers(origin), "Access-Control-Allow-Headers":"authorization, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS" } });
  if (req.method !== "POST") return reply(origin, { ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = env("STRIPE_RESTRICTED_KEY_TEST");
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (!url || !anon || !service || !stripeKey.startsWith("rk_test_")) return reply(origin, { ok:false, code:"V205_TEST_RESTORE_NOT_CONFIGURED" }, 503);
  if (!token) return reply(origin, { ok:false, code:"AUTH_REQUIRED" }, 401);
  const userDb = createClient(url, anon, { global:{ headers:{ Authorization:authorization } }, auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const [{ data:userData, error:userError }, { data:active }] = await Promise.all([
    userDb.auth.getUser(token), userDb.rpc("account_access_is_active_v201")
  ]);
  if (userError || !userData.user || active !== true) return reply(origin, { ok:false, code:"ACTIVE_SESSION_REQUIRED" }, 401);
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const { data:gate, error:gateError } = await admin.rpc("ledger_gate_state_v205");
  if (gateError || gate?.restoreEnabled !== true || gate?.ledgerProcessingEnabled !== true || gate?.liveBillingEnabled !== false) {
    return reply(origin, { ok:false, code:"V205_RESTORE_LOCKED" }, 423);
  }
  const { data:customerId, error:customerError } = await admin.rpc("stripe_customer_lookup_v204", { p_user_id:userData.user.id });
  if (customerError) return reply(origin, { ok:false, code:"V204_CUSTOMER_MAP_REQUIRED" }, 409);
  if (!customerId) return reply(origin, { ok:true, release:"V205", restored:0, message:"Nenhuma compra Stripe TEST encontrada." });
  const stripe = new Stripe(stripeKey, { apiVersion:API_VERSION, httpClient:Stripe.createFetchHttpClient(), appInfo:{ name:"Divina Bruxa", version:"V205" } });
  let applied = 0;
  let duplicates = 0;
  let review = 0;
  try {
    const subscriptions: any[] = await pages(startingAfter => stripe.subscriptions.list({
      customer:String(customerId), status:"all", limit:100, expand:["data.latest_invoice"], ...(startingAfter ? { starting_after:startingAfter } : {})
    }) as any);
    const subscriptionById = new Map<string, any>();
    for (const subscription of subscriptions) {
      subscriptionById.set(subscription.id, subscription);
      const who = identity(userData.user.id, subscription, subscription.latest_invoice);
      if (!who.valid) { review++; continue; }
      const range = dates(subscription, subscription.latest_invoice);
      const result = await apply(admin, {
        eventKey:`restore:subscription:${subscription.id}:${subscription.status}:${subscription.current_period_end || subscription.ended_at || 0}`,
        eventType:"restore.subscription.current", userId:userData.user.id, productKey:who.productKey,
        action:subscriptionAction(String(subscription.status)), root:subscription.id,
        transaction:`${subscription.id}:${subscription.status}:${subscription.current_period_end || subscription.ended_at || 0}`,
        subscription:subscription.id, amount:0, periodStart:range.start, periodEnd:range.end,
        cancelAtPeriodEnd:Boolean(subscription.cancel_at_period_end), status:String(subscription.status)
      });
      result?.duplicate ? duplicates++ : applied++;
    }

    const invoices: any[] = await pages(startingAfter => stripe.invoices.list({
      customer:String(customerId), status:"paid", limit:100, expand:["data.lines.data"], ...(startingAfter ? { starting_after:startingAfter } : {})
    }) as any);
    for (const invoice of invoices) {
      const subscriptionId = idOf(invoice.subscription) || idOf(invoice.parent?.subscription_details?.subscription);
      const subscription = subscriptionById.get(subscriptionId);
      const who = identity(userData.user.id, invoice, subscription, ...(invoice.lines?.data || []));
      if (!who.valid || !subscriptionId) { review++; continue; }
      const range = dates(subscription, invoice);
      const result = await apply(admin, {
        eventKey:`restore:invoice:${invoice.id}:paid`, eventType:"restore.invoice.paid",
        userId:userData.user.id, productKey:who.productKey, action:"subscription_renewed",
        root:invoice.id, transaction:invoice.id, subscription:subscriptionId,
        amount:Number(invoice.amount_paid || 0), currency:invoice.currency,
        periodStart:range.start, periodEnd:range.end,
        cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end), status:"paid"
      });
      result?.duplicate ? duplicates++ : applied++;
    }

    const intents: any[] = await pages(startingAfter => stripe.paymentIntents.list({
      customer:String(customerId), limit:100, expand:["data.latest_charge"], ...(startingAfter ? { starting_after:startingAfter } : {})
    }) as any);
    for (const intent of intents) {
      if (idOf(intent.invoice) || intent.status !== "succeeded") continue;
      const who = identity(userData.user.id, intent);
      if (!who.valid) { review++; continue; }
      const charge: any = intent.latest_charge;
      const refunded = charge && Number(charge.amount_refunded || 0) >= Number(charge.amount || 0);
      const partial = charge && Number(charge.amount_refunded || 0) > 0 && !refunded;
      const action = refunded ? "refund_full" : partial ? "refund_partial" : "restore_paid";
      const amount = refunded || partial ? Number(charge.amount_refunded || 0) : Number(intent.amount_received || intent.amount || 0);
      const state = refunded ? "refunded" : partial ? "partially_refunded" : "paid";
      const result = await apply(admin, {
        eventKey:`restore:intent:${intent.id}:${state}:${charge?.amount_refunded || 0}`,
        eventType:`restore.payment_intent.${state}`, userId:userData.user.id, productKey:who.productKey,
        action, root:intent.id, transaction:`${intent.id}:${state}:${charge?.amount_refunded || 0}`,
        amount, currency:intent.currency, status:state
      });
      result?.duplicate ? duplicates++ : applied++;
    }

    const charges: any[] = await pages(startingAfter => stripe.charges.list({
      customer:String(customerId), limit:100, expand:["data.payment_intent"], ...(startingAfter ? { starting_after:startingAfter } : {})
    }) as any);
    for (const charge of charges) {
      if (!charge.refunded && !charge.disputed && Number(charge.amount_refunded || 0) === 0) continue;
      const invoiceId = idOf(charge.invoice);
      const invoice = invoices.find(item => item.id === invoiceId);
      const subscriptionId = idOf(invoice?.subscription) || idOf(invoice?.parent?.subscription_details?.subscription) || null;
      const subscription = subscriptionById.get(subscriptionId);
      const who = identity(userData.user.id, charge, charge.payment_intent, invoice, subscription);
      if (!who.valid) { review++; continue; }
      const full = Number(charge.amount_refunded || 0) >= Number(charge.amount || 0);
      const action = charge.disputed ? "dispute_opened" : full ? "refund_full" : "refund_partial";
      const range = dates(subscription, invoice);
      const result = await apply(admin, {
        eventKey:`restore:charge:${charge.id}:${action}:${charge.amount_refunded || 0}`,
        eventType:`restore.charge.${action}`, userId:userData.user.id, productKey:who.productKey,
        action, root:invoiceId || idOf(charge.payment_intent) || charge.id,
        transaction:`${charge.id}:${action}:${charge.amount_refunded || 0}`, subscription:subscriptionId,
        amount:charge.disputed ? Number(charge.amount || 0) : Number(charge.amount_refunded || 0),
        currency:charge.currency, periodStart:range.start, periodEnd:range.end,
        cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end), status:action
      });
      result?.duplicate ? duplicates++ : applied++;
    }

    return reply(origin, { ok:true, release:"V205", mode:"stripe_test", applied, duplicates, review, message:"Restauração conferida diretamente no provedor." });
  } catch (error) {
    const code = error instanceof Error && /^[A-Z0-9_]{3,80}$/.test(error.message) ? error.message : "V205_PROVIDER_RESTORE_FAILED";
    console.error("ledger restore v205", { code, requestId:crypto.randomUUID() });
    return reply(origin, { ok:false, code }, 502);
  }
});
