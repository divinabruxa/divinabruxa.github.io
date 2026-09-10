/* DIVINA BRUXA V204 — Checkout hospedado Stripe TEST. Nenhum direito nasce aqui. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const ALLOWED_ORIGINS=new Set(["https://divinabruxa.com.br","https://www.divinabruxa.com.br","https://divinabruxa.github.io"]);
const LOCAL=/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const PRODUCT_KEY=/^[a-z0-9_]{3,80}$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const requestOrigin=(req:Request)=>req.headers.get("origin")||"";
const originAllowed=(req:Request)=>!requestOrigin(req)||ALLOWED_ORIGINS.has(requestOrigin(req))||LOCAL.test(requestOrigin(req));
const headers=(req:Request)=>({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Vary":"Origin",...(requestOrigin(req)&&originAllowed(req)?{"Access-Control-Allow-Origin":requestOrigin(req)}:{})});
const out=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:headers(req)});

async function sha256(value:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return originAllowed(req)?new Response(null,{status:204,headers:{...headers(req),"Access-Control-Allow-Headers":"authorization, apikey, content-type, idempotency-key","Access-Control-Allow-Methods":"POST, OPTIONS"}}):out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);
  if(req.method!=="POST")return out(req,{ok:false,code:"METHOD_NOT_ALLOWED"},405);
  if(!originAllowed(req))return out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);

  const supabaseUrl=env("SUPABASE_URL");
  const anonKey=env("SUPABASE_ANON_KEY");
  const serviceKey=env("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey=env("STRIPE_RESTRICTED_KEY_TEST");
  const siteOrigin=env("PUBLIC_SITE_ORIGIN_STAGING").replace(/\/$/,"");
  if(!supabaseUrl||!anonKey||!serviceKey||!siteOrigin||!stripeKey.startsWith("rk_test_"))return out(req,{ok:false,code:"TEST_SERVER_NOT_CONFIGURED"},503);

  const bearer=req.headers.get("Authorization")||"";
  if(!bearer.startsWith("Bearer "))return out(req,{ok:false,code:"AUTH_REQUIRED"},401);
  const userClient=createClient(supabaseUrl,anonKey,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:userData,error:userError}=await userClient.auth.getUser(bearer.slice(7));
  if(userError||!userData.user)return out(req,{ok:false,code:"AUTH_INVALID"},401);
  const {data:active}=await userClient.rpc("account_access_is_active_v201");
  if(active!==true)return out(req,{ok:false,code:"ACCOUNT_NOT_ACTIVE"},403);

  let body:any;
  try{body=await req.json();}catch{return out(req,{ok:false,code:"INVALID_JSON"},400);}
  const productKey=String(body?.productKey||"");
  const contextId=String(body?.contextId||"");
  const clientKey=String(req.headers.get("Idempotency-Key")||body?.idempotencyKey||"");
  if(!PRODUCT_KEY.test(productKey)||clientKey.length<16||clientKey.length>120)return out(req,{ok:false,code:"INVALID_CHECKOUT_REQUEST"},400);
  if(productKey.startsWith("consultation_")&&!UUID.test(contextId))return out(req,{ok:false,code:"BOOKING_CONTEXT_REQUIRED"},409);

  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const [{data:gate,error:gateError},{data:catalog,error:catalogError}]=await Promise.all([
    admin.rpc("stripe_gate_v204"),admin.rpc("stripe_catalog_lookup_v204",{p_product_key:productKey})
  ]);
  if(gateError||catalogError)return out(req,{ok:false,code:"BILLING_STATE_UNAVAILABLE"},503);
  if(gate?.providerMode!=="test"||gate?.checkoutAuthorized!==true||gate?.liveBillingAuthorized!==false||gate?.automaticTaxEnabled!==false)return out(req,{ok:false,code:"TEST_CHECKOUT_LOCKED"},423);
  if(!catalog?.active||!catalog?.checkoutReady||catalog?.livemode!==false||!catalog?.stripePriceId)return out(req,{ok:false,code:"TEST_CATALOG_NOT_READY"},409);

  const stripe=new Stripe(stripeKey,{apiVersion:"2026-07-29.dahlia",httpClient:Stripe.createFetchHttpClient(),appInfo:{name:"Divina Bruxa",version:"V204"}});
  const idempotencyHash=await sha256(`v204|${userData.user.id}|${productKey}|${clientKey}`);
  const idempotencyKey=`db:v204:checkout:${idempotencyHash.slice(0,48)}`;
  let customerId=String((await admin.rpc("stripe_customer_lookup_v204",{p_user_id:userData.user.id})).data||"");
  try{
    if(!customerId){
      const customer=await stripe.customers.create({email:userData.user.email||undefined,metadata:{release:"V204",user_id:userData.user.id}},{idempotencyKey:`db:v204:customer:${userData.user.id}`});
      if(customer.livemode)return out(req,{ok:false,code:"LIVE_OBJECT_REJECTED"},409);
      customerId=customer.id;
      const saved=await admin.rpc("stripe_customer_upsert_v204",{p_user_id:userData.user.id,p_stripe_customer_id:customerId});
      if(saved.error)throw new Error("CUSTOMER_MAPPING_FAILED");
    }
    const metadata:Record<string,string>={release:"V204",product_key:productKey,user_id:userData.user.id};
    if(contextId)metadata.context_id=contextId;
    const mode=catalog.billingMode as "payment"|"subscription";
    const params:any={
      mode,customer:customerId,line_items:[{price:catalog.stripePriceId,quantity:1}],
      success_url:`${siteOrigin}/?stripe=success&session_id={CHECKOUT_SESSION_ID}#account`,
      cancel_url:`${siteOrigin}/?stripe=cancel#subscriptions`,
      locale:"pt-BR",client_reference_id:userData.user.id,metadata,
      automatic_tax:{enabled:false},integration_identifier:"divina-bruxa-v204-kqmwzjra"
    };
    if(mode==="payment")params.payment_intent_data={metadata};
    if(mode==="subscription")params.subscription_data={metadata};
    const session=await stripe.checkout.sessions.create(params,{idempotencyKey});
    if(session.livemode||!session.id.startsWith("cs_test_"))return out(req,{ok:false,code:"LIVE_OBJECT_REJECTED"},409);
    const recorded=await admin.rpc("stripe_checkout_record_v204",{
      p_user_id:userData.user.id,p_product_key:productKey,p_idempotency_key:idempotencyKey,
      p_stripe_checkout_session_id:session.id,p_stripe_customer_id:customerId,p_status:session.status||"open",
      p_expires_at:session.expires_at?new Date(session.expires_at*1000).toISOString():null
    });
    if(recorded.error)throw new Error("CHECKOUT_RECORD_FAILED");
    return out(req,{ok:true,release:"V204",mode:"test",checkoutUrl:session.url,sessionId:session.id,entitlementGranted:false});
  }catch(error){
    const code=error instanceof Error&&/^[A-Z0-9_]{3,80}$/.test(error.message)?error.message:"STRIPE_TEST_CHECKOUT_FAILED";
    console.error("stripe checkout v204",{code,requestId:crypto.randomUUID()});
    return out(req,{ok:false,code},502);
  }
});
