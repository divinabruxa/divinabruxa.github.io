/* DIVINA BRUXA V205 — Stripe TEST -> Ledger Universal.
   Deploy target: stripe-webhook-v204 (replacement source, same signed endpoint).
   The raw signed event is verified, the current Stripe object is retrieved, then one atomic RPC applies effects. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION = "2026-07-29.dahlia";
const SUPPORTED = new Set([
  "checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed",
  "payment_intent.succeeded", "payment_intent.payment_failed",
  "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted",
  "invoice.paid", "invoice.payment_failed", "charge.refunded",
  "charge.dispute.created", "charge.dispute.closed"
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT = /^[a-z0-9_]{3,80}$/;
const env = (name: string) => Deno.env.get(name)?.trim() || "";
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers:{
    "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store",
    "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer"
  }
});
const idOf = (value: any) => typeof value === "string" ? value : String(value?.id || "");
const epoch = (value: unknown) => Number.isFinite(Number(value)) && Number(value) > 0
  ? new Date(Number(value) * 1000).toISOString() : null;
const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

type Normalized = {
  userId: string | null;
  productKey: string | null;
  action: string;
  rootReference: string;
  transactionReference: string;
  subscriptionReference: string | null;
  amountBrlCents: number;
  currency: string;
  periodStart: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  objectType: string;
  providerStatus: string;
};

function metadata(...objects: any[]) {
  const merged: Record<string, string> = {};
  for (const object of objects) {
    const candidates = [
      object?.metadata, object?.subscription_details?.metadata,
      object?.parent?.subscription_details?.metadata,
      object?.payment_intent?.metadata, object?.charge?.metadata
    ];
    for (const candidate of candidates) if (candidate && typeof candidate === "object") {
      for (const [key, value] of Object.entries(candidate)) if (typeof value === "string" && !(key in merged)) merged[key] = value;
    }
  }
  return merged;
}

function identity(...objects: any[]) {
  const meta = metadata(...objects);
  const userId = UUID.test(String(meta.user_id || "")) ? String(meta.user_id) : null;
  const productKey = PRODUCT.test(String(meta.product_key || "")) ? String(meta.product_key) : null;
  return { userId, productKey };
}

function period(subscription: any, invoice?: any) {
  const lines = Array.isArray(invoice?.lines?.data) ? invoice.lines.data : [];
  const items = Array.isArray(subscription?.items?.data) ? subscription.items.data : [];
  const starts = [subscription?.current_period_start, ...items.map((item: any) => item?.current_period_start), ...lines.map((line: any) => line?.period?.start)].map(Number).filter(Number.isFinite);
  const ends = [subscription?.current_period_end, ...items.map((item: any) => item?.current_period_end), ...lines.map((line: any) => line?.period?.end)].map(Number).filter(Number.isFinite);
  return {
    start:starts.length ? epoch(Math.min(...starts)) : null,
    end:ends.length ? epoch(Math.max(...ends)) : null
  };
}

function subscriptionAction(status: string) {
  if (["active", "trialing"].includes(status)) return "subscription_active";
  if (["past_due", "unpaid", "incomplete"].includes(status)) return "subscription_past_due";
  if (["canceled", "incomplete_expired", "paused"].includes(status)) return "subscription_expired";
  return "no_effect";
}

async function normalize(stripe: Stripe, event: Stripe.Event): Promise<Normalized> {
  const incoming: any = event.data.object;
  if (event.type.startsWith("checkout.session.")) {
    const session: any = await stripe.checkout.sessions.retrieve(incoming.id, { expand:["payment_intent", "subscription", "invoice"] });
    const paymentIntent = session.payment_intent;
    let subscription: any = session.subscription;
    if (typeof subscription === "string") subscription = await stripe.subscriptions.retrieve(subscription, { expand:["latest_invoice"] });
    const found = identity(session, paymentIntent, subscription);
    if (session.mode === "subscription") {
      const subId = idOf(subscription) || idOf(session.subscription) || session.id;
      const dates = period(subscription, session.invoice);
      const action = event.type.endsWith("async_payment_failed") ? "no_effect" : subscriptionAction(String(subscription?.status || ""));
      return {
        ...found, action, rootReference:subId, transactionReference:subId,
        subscriptionReference:subId, amountBrlCents:0, currency:"brl",
        periodStart:dates.start, periodEnd:dates.end,
        cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end), objectType:"checkout_session",
        providerStatus:String(subscription?.status || session.payment_status || "unknown")
      };
    }
    const root = idOf(paymentIntent) || session.id;
    const paid = session.payment_status === "paid" || event.type.endsWith("async_payment_succeeded");
    return {
      ...found, action:event.type.endsWith("async_payment_failed") || !paid ? "no_effect" : "purchase_paid",
      rootReference:root, transactionReference:root, subscriptionReference:null,
      amountBrlCents:Number(session.amount_total || paymentIntent?.amount_received || 0),
      currency:String(session.currency || paymentIntent?.currency || "brl").toLowerCase(),
      periodStart:null, periodEnd:null, cancelAtPeriodEnd:false,
      objectType:"checkout_session", providerStatus:String(session.payment_status || session.status || "unknown")
    };
  }
  if (event.type.startsWith("payment_intent.")) {
    const intent: any = await stripe.paymentIntents.retrieve(incoming.id);
    const found = identity(intent);
    return {
      ...found, action:event.type.endsWith("succeeded") && intent.status === "succeeded" ? "purchase_paid" : "no_effect",
      rootReference:intent.id, transactionReference:intent.id, subscriptionReference:null,
      amountBrlCents:Number(intent.amount_received || intent.amount || 0), currency:String(intent.currency || "brl").toLowerCase(),
      periodStart:null, periodEnd:null, cancelAtPeriodEnd:false,
      objectType:"payment_intent", providerStatus:String(intent.status || "unknown")
    };
  }
  if (event.type.startsWith("customer.subscription.")) {
    const subscription: any = await stripe.subscriptions.retrieve(incoming.id, { expand:["latest_invoice"] });
    const found = identity(subscription, subscription.latest_invoice);
    const dates = period(subscription, subscription.latest_invoice);
    const action = event.type.endsWith("deleted") ? "subscription_expired" : subscriptionAction(String(subscription.status || ""));
    return {
      ...found, action, rootReference:subscription.id,
      transactionReference:`${subscription.id}:${String(subscription.status || "unknown")}:${subscription.current_period_end || subscription.ended_at || event.created}`,
      subscriptionReference:subscription.id, amountBrlCents:0, currency:"brl",
      periodStart:dates.start, periodEnd:dates.end, cancelAtPeriodEnd:Boolean(subscription.cancel_at_period_end),
      objectType:"subscription", providerStatus:String(subscription.status || "unknown")
    };
  }
  if (event.type.startsWith("invoice.")) {
    const invoice: any = await stripe.invoices.retrieve(incoming.id, { expand:["lines.data"] });
    let subscriptionId = idOf(invoice.subscription) || idOf(invoice.parent?.subscription_details?.subscription);
    let subscription: any = null;
    if (subscriptionId) subscription = await stripe.subscriptions.retrieve(subscriptionId);
    subscriptionId ||= idOf(subscription);
    const found = identity(invoice, subscription, ...(invoice.lines?.data || []));
    const dates = period(subscription, invoice);
    return {
      ...found, action:event.type === "invoice.paid" && invoice.status === "paid" ? "subscription_renewed" : "subscription_past_due",
      rootReference:invoice.id, transactionReference:invoice.id, subscriptionReference:subscriptionId || null,
      amountBrlCents:Number(invoice.amount_paid || invoice.amount_due || 0), currency:String(invoice.currency || "brl").toLowerCase(),
      periodStart:dates.start, periodEnd:dates.end, cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end),
      objectType:"invoice", providerStatus:String(invoice.status || "unknown")
    };
  }
  if (event.type === "charge.refunded") {
    const charge: any = await stripe.charges.retrieve(incoming.id, { expand:["payment_intent"] });
    const invoiceId = idOf(charge.invoice);
    const invoice: any = invoiceId ? await stripe.invoices.retrieve(invoiceId) : null;
    const subscriptionId = idOf(invoice?.subscription) || idOf(invoice?.parent?.subscription_details?.subscription) || null;
    const subscription: any = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
    const found = identity(charge, charge.payment_intent, invoice, subscription);
    const full = Number(charge.amount_refunded || 0) >= Number(charge.amount || 0);
    return {
      ...found, action:full ? "refund_full" : "refund_partial",
      rootReference:invoiceId || idOf(charge.payment_intent) || charge.id,
      transactionReference:`${charge.id}:refund:${charge.amount_refunded || 0}`,
      subscriptionReference:subscriptionId, amountBrlCents:Number(charge.amount_refunded || 0),
      currency:String(charge.currency || "brl").toLowerCase(),
      periodStart:period(subscription, invoice).start, periodEnd:period(subscription, invoice).end,
      cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end), objectType:"charge", providerStatus:full ? "refunded" : "partially_refunded"
    };
  }
  const dispute: any = await stripe.disputes.retrieve(incoming.id);
  const charge: any = typeof dispute.charge === "string"
    ? await stripe.charges.retrieve(dispute.charge, { expand:["payment_intent"] }) : dispute.charge;
  const invoiceId = idOf(charge?.invoice);
  const invoice: any = invoiceId ? await stripe.invoices.retrieve(invoiceId) : null;
  const subscriptionId = idOf(invoice?.subscription) || idOf(invoice?.parent?.subscription_details?.subscription) || null;
  const subscription: any = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
  const found = identity(dispute, charge, charge?.payment_intent, invoice, subscription);
  const won = event.type.endsWith("closed") && dispute.status === "won";
  const action = event.type.endsWith("created") ? "dispute_opened" : won ? "dispute_won" : "chargeback";
  const dates = period(subscription, invoice);
  return {
    ...found, action, rootReference:invoiceId || idOf(charge?.payment_intent) || idOf(charge) || dispute.id,
    transactionReference:`${dispute.id}:${String(dispute.status || "unknown")}`,
    subscriptionReference:subscriptionId, amountBrlCents:Number(dispute.amount || charge?.amount || 0),
    currency:String(dispute.currency || charge?.currency || "brl").toLowerCase(),
    periodStart:dates.start, periodEnd:dates.end, cancelAtPeriodEnd:Boolean(subscription?.cancel_at_period_end),
    objectType:"dispute", providerStatus:String(dispute.status || "unknown")
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return reply({ ok:false, code:"METHOD_NOT_ALLOWED" }, 405);
  const url = env("SUPABASE_URL");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = env("STRIPE_RESTRICTED_KEY_TEST");
  const secret = env("STRIPE_WEBHOOK_SECRET_TEST");
  if (!url || !service || !stripeKey.startsWith("rk_test_") || !secret.startsWith("whsec_")) {
    return reply({ ok:false, code:"V205_TEST_WEBHOOK_NOT_CONFIGURED" }, 503);
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) return reply({ ok:false, code:"SIGNATURE_REQUIRED" }, 400);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > 1_000_000) return reply({ ok:false, code:"PAYLOAD_TOO_LARGE" }, 413);
  const stripe = new Stripe(stripeKey, {
    apiVersion:API_VERSION, httpClient:Stripe.createFetchHttpClient(),
    appInfo:{ name:"Divina Bruxa", version:"V205" }
  });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret, 300, Stripe.createSubtleCryptoProvider());
  } catch {
    return reply({ ok:false, code:"SIGNATURE_INVALID" }, 400);
  }
  if (event.livemode) return reply({ ok:false, code:"LIVE_EVENT_REJECTED" }, 409);
  if (!SUPPORTED.has(event.type)) return reply({ ok:true, release:"V205", ignored:true, code:"EVENT_NOT_SUBSCRIBED" });

  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
  const payloadHash = await sha256(raw);
  const observedAt = new Date().toISOString();
  let item: Normalized;
  try {
    item = await normalize(stripe, event);
  } catch {
    const objectId = String((event.data.object as any)?.id || event.id);
    item = {
      userId:null, productKey:null, action:"no_effect", rootReference:objectId,
      transactionReference:objectId, subscriptionReference:null, amountBrlCents:0,
      currency:"brl", periodStart:null, periodEnd:null, cancelAtPeriodEnd:false,
      objectType:"normalization_failure", providerStatus:"unknown"
    };
  }
  const { data, error } = await admin.rpc("ledger_apply_provider_event_v205", {
    p_provider:"stripe", p_provider_environment:"test", p_event_key:event.id,
    p_event_type:event.type, p_payload_sha256:payloadHash, p_user_id:item.userId,
    p_product_key:item.productKey, p_action:item.action, p_root_reference:item.rootReference,
    p_transaction_reference:item.transactionReference, p_subscription_reference:item.subscriptionReference,
    p_amount_brl_cents:item.amountBrlCents, p_currency:item.currency, p_occurred_at:observedAt,
    p_period_start:item.periodStart, p_period_end:item.periodEnd,
    p_cancel_at_period_end:item.cancelAtPeriodEnd,
    p_metadata:{ objectType:item.objectType, providerStatus:item.providerStatus, providerCreatedAt:epoch(event.created) }
  });
  if (error) {
    console.error("stripe webhook v205", { code:"LEDGER_APPLY_FAILED", eventId:event.id });
    return reply({ ok:false, code:"LEDGER_APPLY_FAILED" }, 503);
  }
  return reply({ ok:true, release:"V205", ledger:data });
});
