/* DIVINA BRUXA — PREMIUM/BILLING ACCOUNT V191 · SUPABASE STAGING
   Função autenticada para snapshot e laboratório interno. Não chama Stripe. */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.4";

const RELEASE = "V191";
const ENVIRONMENT = "staging";
const MAX_BODY_BYTES = 8_192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT_KEY = /^[a-z0-9_]{3,64}$/;
const COMMANDS = new Set(["simulate_purchase", "restore", "refund", "revoke", "cancel_subscription"]);
const DEFAULT_ORIGINS = [
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

class BillingError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "BillingError";
    this.code = code;
    this.status = status;
  }
}

const env = (name: string) => Deno.env.get(name)?.trim() || "";
const clean = (value: unknown, limit = 160) => String(value ?? "").replaceAll("\0", "").trim().slice(0, limit);

function allowedOrigins() {
  const raw = env("STAGING_ALLOWED_ORIGINS");
  if (!raw) return new Set(DEFAULT_ORIGINS);
  try {
    const parsed = raw.startsWith("[") ? JSON.parse(raw) : raw.split(",");
    return new Set([...DEFAULT_ORIGINS, ...(Array.isArray(parsed) ? parsed : [])].map(String).map(item => item.trim()).filter(Boolean));
  } catch {
    return new Set(DEFAULT_ORIGINS);
  }
}

function requestOrigin(req: Request) {
  const origin = req.headers.get("Origin");
  if (!origin) return null;
  if (!allowedOrigins().has(origin)) throw new BillingError("ORIGIN_NOT_ALLOWED", "Origem não autorizada no STAGING.", 403);
  return origin;
}

function responseHeaders(origin: string | null, extra: Record<string, string> = {}) {
  const headers = new Headers({
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store, max-age=0",
    "X-Content-Type-Options":"nosniff",
    "Referrer-Policy":"no-referrer",
    "Vary":"Origin",
    ...extra
  });
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

const reply = (origin: string | null, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers:responseHeaders(origin)
});
const preflight = (origin: string | null) => new Response(null, {
  status:204,
  headers:responseHeaders(origin, {
    "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Max-Age":"600"
  })
});

function userClient(req: Request) {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  if (!url || !key) throw new BillingError("STAGING_CONFIGURATION_MISSING", "Configuração segura indisponível.", 503);
  return createClient(url, key, {
    global:{ headers:{ Authorization:req.headers.get("Authorization") || "" } },
    auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
  });
}

function adminClient() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new BillingError("STAGING_CONFIGURATION_MISSING", "Configuração segura indisponível.", 503);
  return createClient(url, key, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
}

function bearer(req: Request) {
  const token = (req.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new BillingError("AUTHENTICATION_REQUIRED", "Entre novamente para abrir o Premium.", 401);
  return token;
}

async function authenticate(req: Request) {
  const token = bearer(req);
  const userDb = userClient(req);
  const admin = adminClient();
  const [{ data:userData, error:userError }, { data:claimsData, error:claimsError }] = await Promise.all([
    userDb.auth.getUser(token), userDb.auth.getClaims(token)
  ]);
  const user = userData?.user;
  const claims = claimsData?.claims as Record<string, unknown> | undefined;
  if (userError || claimsError || !user || claims?.sub !== user.id || claims?.role !== "authenticated") {
    throw new BillingError("AUTHENTICATION_REQUIRED", "Entre novamente para abrir o Premium.", 401);
  }
  if (!user.email_confirmed_at && !user.confirmed_at) {
    throw new BillingError("EMAIL_VERIFICATION_REQUIRED", "Confirme seu e-mail antes de testar o Premium.", 403);
  }
  const sessionId = clean(claims?.session_id, 40);
  if (!UUID.test(sessionId)) throw new BillingError("ACTIVE_SESSION_REQUIRED", "Sua sessão precisa ser renovada.", 401);
  const { data:active, error:activeError } = await admin.rpc("verify_active_account_session", {
    p_user_id:user.id, p_session_id:sessionId
  });
  if (activeError || active !== true) throw new BillingError("ACTIVE_SESSION_REQUIRED", "Sua sessão não está mais ativa.", 401);
  return { user, admin };
}

async function readBody(req: Request) {
  const advertised = Number(req.headers.get("Content-Length") || 0);
  if (advertised > MAX_BODY_BYTES) throw new BillingError("BODY_TOO_LARGE", "Solicitação de billing muito grande.", 413);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new BillingError("BODY_TOO_LARGE", "Solicitação de billing muito grande.", 413);
  try {
    const body = JSON.parse(raw || "{}");
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error("invalid");
    return body as Record<string, unknown>;
  } catch {
    throw new BillingError("INVALID_JSON", "Solicitação de billing inválida.", 400);
  }
}

const one = <T>(value: T[] | null | undefined) => value?.[0] || null;

async function accountSnapshot(admin: SupabaseClient, userId: string) {
  const [catalog, entitlements, purchases, receipts, subscriptions, wallet, skins, skinEntitlements] = await Promise.all([
    admin.from("product_catalog").select("product_key,product_type,name,price_brl_cents,billing_mode,credits,catalog_version,metadata").eq("active", true).eq("catalog_version", "V191").order("price_brl_cents"),
    admin.from("entitlements").select("entitlement_key,status,starts_at,ends_at,source_purchase_id").eq("user_id", userId).order("created_at", { ascending:false }).limit(100),
    admin.from("purchases").select("id,product_key,price_brl_cents_snapshot,status,platform,provider,created_at,updated_at").eq("user_id", userId).eq("environment", ENVIRONMENT).eq("catalog_version_snapshot", "V191").order("created_at", { ascending:false }).limit(100),
    admin.from("billing_receipts_v191").select("purchase_id,receipt_code,product_key,product_name_snapshot,amount_brl_cents,status,issued_at,refunded_at,revoked_at").eq("user_id", userId).order("issued_at", { ascending:false }).limit(100),
    admin.from("billing_subscriptions_v191").select("id,product_key,status,current_period_start,current_period_end,cancel_at_period_end,canceled_at,provider").eq("user_id", userId).order("created_at", { ascending:false }).limit(20),
    admin.from("ai_wallets").select("monthly_credits,extra_credits,demo_credits,cycle_ends_at").eq("user_id", userId).limit(1),
    admin.from("orb_skins").select("id,slug,name,rarity,is_free,sort_order,status").eq("status", "published").order("sort_order"),
    admin.from("orb_skin_entitlements").select("skin_id,status,revoked_at").eq("user_id", userId).eq("status", "active").is("revoked_at", null).limit(100)
  ]);
  const failure = [catalog, entitlements, purchases, receipts, subscriptions, wallet, skins, skinEntitlements].find(result => result.error);
  if (failure?.error) throw new BillingError("BILLING_SNAPSHOT_FAILED", "Não foi possível restaurar o retrato Premium.", 500);

  const receiptByPurchase = new Map((receipts.data || []).map(item => [String(item.purchase_id), item]));
  const productName = new Map((catalog.data || []).map(item => [String(item.product_key), String(item.name)]));
  const activeKeys = new Set((entitlements.data || []).filter(item => item.status === "active").map(item => String(item.entitlement_key)));
  const skinSlugById = new Map((skins.data || []).map(item => [String(item.id), String(item.slug)]));
  const premiumActive = activeKeys.has("premium_lifetime");
  const ownedSkinIds = premiumActive
    ? (skins.data || []).map(item => String(item.slug))
    : ["classic", ...((skinEntitlements.data || []).map(item => skinSlugById.get(String(item.skin_id))).filter(Boolean) as string[])];
  const walletRow = one(wallet.data);
  const monthlyCredits = Number(walletRow?.monthly_credits || 0);
  const extraCredits = Number(walletRow?.extra_credits || 0);
  const demoCredits = Number(walletRow?.demo_credits || 0);

  return {
    release:RELEASE,
    environment:ENVIRONMENT,
    mode:"sandbox",
    authenticated:true,
    gates:{
      realBilling:false, stripeCheckout:false, stripeWebhook:false,
      customerPortal:false, automaticTax:false, production:false
    },
    catalog:(catalog.data || []).map(item => ({
      productKey:item.product_key, kind:item.product_type, name:item.name,
      priceCents:item.price_brl_cents, billingMode:item.billing_mode,
      credits:item.credits, catalogVersion:item.catalog_version
    })),
    entitlements:(entitlements.data || []).map(item => ({
      key:item.entitlement_key, status:item.status, startsAt:item.starts_at,
      endsAt:item.ends_at, sourcePurchaseId:item.source_purchase_id
    })),
    purchases:(purchases.data || []).map(item => ({
      id:item.id, productKey:item.product_key, name:productName.get(String(item.product_key)) || item.product_key,
      priceCents:item.price_brl_cents_snapshot, status:item.status, platform:item.platform,
      provider:item.provider, createdAt:item.created_at, updatedAt:item.updated_at,
      receiptCode:receiptByPurchase.get(String(item.id))?.receipt_code || null
    })),
    receipts:(receipts.data || []).map(item => ({
      purchaseId:item.purchase_id, code:item.receipt_code, productKey:item.product_key,
      name:item.product_name_snapshot, amountCents:item.amount_brl_cents,
      status:item.status, issuedAt:item.issued_at, refundedAt:item.refunded_at, revokedAt:item.revoked_at
    })),
    subscriptions:(subscriptions.data || []).map(item => ({
      id:item.id, productKey:item.product_key, status:item.status,
      currentPeriodStart:item.current_period_start, currentPeriodEnd:item.current_period_end,
      cancelAtPeriodEnd:item.cancel_at_period_end, canceledAt:item.canceled_at, provider:item.provider
    })),
    skinIds:[...new Set(ownedSkinIds)],
    skinCatalog:(skins.data || []).map(item => ({
      id:item.slug, name:item.name, rarity:item.rarity, free:item.is_free, order:item.sort_order
    })),
    wallet:{ monthlyCredits, extraCredits, demoCredits, totalCredits:monthlyCredits + extraCredits + demoCredits, cycleEndsAt:walletRow?.cycle_ends_at || null },
    disclosure:{
      fiscalReceipt:false, cardDataCollected:false, stripeCalled:false,
      premiumIncludesAI:false, premiumIncludesAllSkins:true
    }
  };
}

function databaseMessage(error: unknown) {
  const raw = clean((error as { message?: unknown })?.message, 180).toUpperCase();
  if (raw.includes("RATE_LIMITED")) return new BillingError("BILLING_RATE_LIMITED", "Muitas simulações em pouco tempo. Aguarde um minuto.", 429);
  if (raw.includes("PRODUCT_NOT_ALLOWED")) return new BillingError("BILLING_PRODUCT_NOT_ALLOWED", "Produto fora do catálogo V191.", 400);
  if (raw.includes("PURCHASE_NOT_FOUND")) return new BillingError("BILLING_PURCHASE_NOT_FOUND", "Compra sandbox não encontrada.", 404);
  if (raw.includes("SUBSCRIPTION_NOT_FOUND")) return new BillingError("BILLING_SUBSCRIPTION_NOT_FOUND", "Assinatura sandbox não encontrada.", 404);
  if (raw.includes("RELEASE_GATE_CLOSED")) return new BillingError("BILLING_RELEASE_GATE_CLOSED", "O laboratório Premium está pausado.", 503);
  return new BillingError("BILLING_COMMAND_FAILED", "A simulação não foi concluída.", 500);
}

Deno.serve(async (req: Request) => {
  let origin: string | null = null;
  try {
    origin = requestOrigin(req);
    if (req.method === "OPTIONS") return preflight(origin);
    if (req.method !== "POST") throw new BillingError("METHOD_NOT_ALLOWED", "Método não permitido.", 405);
    const body = await readBody(req);
    const { user, admin } = await authenticate(req);
    const action = clean(body.action, 24) || "snapshot";
    let commandResult: unknown = null;

    if (action === "command") {
      const command = clean(body.command, 40);
      const requestId = clean(body.requestId, 40);
      const productKey = clean(body.productKey, 64) || null;
      const purchaseId = clean(body.purchaseId, 40) || null;
      const platform = clean(body.platform, 16) || "web";
      if (!COMMANDS.has(command)) throw new BillingError("BILLING_COMMAND_NOT_ALLOWED", "Comando de billing inválido.", 400);
      if (!UUID.test(requestId)) throw new BillingError("BILLING_REQUEST_ID_INVALID", "Gere uma nova solicitação.", 400);
      if (productKey && !PRODUCT_KEY.test(productKey)) throw new BillingError("BILLING_PRODUCT_INVALID", "Produto inválido.", 400);
      if (purchaseId && !UUID.test(purchaseId)) throw new BillingError("BILLING_PURCHASE_INVALID", "Compra inválida.", 400);
      if (!["web", "android", "ios"].includes(platform)) throw new BillingError("BILLING_PLATFORM_INVALID", "Plataforma inválida.", 400);
      const { data, error } = await admin.rpc("process_billing_sandbox_command_v191", {
        p_user_id:user.id,
        p_request_id:requestId,
        p_command:command,
        p_product_key:productKey,
        p_purchase_id:purchaseId,
        p_platform:platform
      });
      if (error) throw databaseMessage(error);
      commandResult = data;
    } else if (action !== "snapshot") {
      throw new BillingError("BILLING_ACTION_NOT_ALLOWED", "Ação de billing inválida.", 400);
    }

    const snapshot = await accountSnapshot(admin, user.id);
    return reply(origin, {
      ok:true,
      release:RELEASE,
      environment:ENVIRONMENT,
      message:(commandResult as { message?: string } | null)?.message || "Premium restaurado pelo STAGING.",
      command:commandResult,
      snapshot
    });
  } catch (error) {
    const known = error instanceof BillingError;
    return reply(origin, {
      ok:false,
      release:RELEASE,
      environment:ENVIRONMENT,
      error:{
        code:known ? error.code : "BILLING_ACCOUNT_FAILED",
        message:known ? error.message : "Não foi possível abrir o Premium agora."
      }
    }, known ? error.status : 500);
  }
});
