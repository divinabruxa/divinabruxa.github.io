/* DIVINA BRUXA V204 — Webhook Stripe TEST: assinatura -> persistência -> normalização. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const API_VERSION="2026-07-29.dahlia";
const SUPPORTED=new Set([
  "checkout.session.completed","checkout.session.async_payment_succeeded","checkout.session.async_payment_failed",
  "payment_intent.succeeded","payment_intent.payment_failed",
  "customer.subscription.created","customer.subscription.updated","customer.subscription.deleted",
  "invoice.paid","invoice.payment_failed","charge.refunded","charge.dispute.created","charge.dispute.closed"
]);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT=/^[a-z0-9_]{3,80}$/;
const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
async function sha256(value:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("");}

function metadataFor(object:any){
  return object?.metadata||object?.subscription_details?.metadata||object?.parent?.subscription_details?.metadata||{};
}
function normalized(event:Stripe.Event){
  const object:any=event.data.object;
  const metadata=metadataFor(object);
  const userId=UUID.test(String(metadata.user_id||""))?String(metadata.user_id):null;
  const productKey=PRODUCT.test(String(metadata.product_key||""))?String(metadata.product_key):null;
  let objectType="unknown",state="unknown",amount:number|null=null,parent:string|null=null;
  if(event.type.startsWith("checkout.session.")){
    objectType="checkout_session";
    state=event.type.endsWith("async_payment_failed")?"failed":(object.payment_status==="paid"||event.type.endsWith("async_payment_succeeded")?"paid":"pending");
    amount=Number.isInteger(object.amount_total)?object.amount_total:null;
    parent=typeof object.payment_intent==="string"?object.payment_intent:(typeof object.subscription==="string"?object.subscription:null);
  }else if(event.type.startsWith("payment_intent.")){
    objectType="payment_intent";state=event.type.endsWith("succeeded")?"paid":"failed";
    amount=Number.isInteger(object.amount_received)?object.amount_received:(Number.isInteger(object.amount)?object.amount:null);
  }else if(event.type.startsWith("customer.subscription.")){
    objectType="subscription";
    state=event.type.endsWith("deleted")||object.status==="canceled"?"cancelled":(["active","trialing"].includes(object.status)?"active":(["past_due","unpaid","incomplete_expired"].includes(object.status)?"failed":"pending"));
  }else if(event.type.startsWith("invoice.")){
    objectType="invoice";state=event.type==="invoice.paid"?"paid":"failed";
    amount=Number.isInteger(object.amount_paid)?object.amount_paid:null;
    parent=typeof object.subscription==="string"?object.subscription:(typeof object.parent?.subscription_details?.subscription==="string"?object.parent.subscription_details.subscription:null);
  }else if(event.type==="charge.refunded"){
    objectType="charge";state="refunded";amount=Number.isInteger(object.amount_refunded)?object.amount_refunded:null;
    parent=typeof object.payment_intent==="string"?object.payment_intent:null;
  }else if(event.type.startsWith("charge.dispute.")){
    objectType="dispute";state=event.type.endsWith("created")?"disputed":"resolved";
    amount=Number.isInteger(object.amount)?object.amount:null;parent=typeof object.charge==="string"?object.charge:null;
  }
  return {objectId:String(object?.id||""),objectType,state,userId,productKey,amount,currency:String(object?.currency||"").toLowerCase()||null,parent};
}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({ok:false,code:"METHOD_NOT_ALLOWED"},405);
  const url=env("SUPABASE_URL"),service=env("SUPABASE_SERVICE_ROLE_KEY"),stripeKey=env("STRIPE_RESTRICTED_KEY_TEST"),secret=env("STRIPE_WEBHOOK_SECRET_TEST");
  if(!url||!service||!stripeKey.startsWith("rk_test_")||!secret.startsWith("whsec_"))return json({ok:false,code:"TEST_WEBHOOK_NOT_CONFIGURED"},503);
  const signature=req.headers.get("stripe-signature");
  if(!signature)return json({ok:false,code:"SIGNATURE_REQUIRED"},400);
  const raw=await req.text();
  if(raw.length>1_000_000)return json({ok:false,code:"PAYLOAD_TOO_LARGE"},413);
  const stripe=new Stripe(stripeKey,{apiVersion:API_VERSION,httpClient:Stripe.createFetchHttpClient(),appInfo:{name:"Divina Bruxa",version:"V204"}});
  let event:Stripe.Event;
  try{event=await stripe.webhooks.constructEventAsync(raw,signature,secret,300,Stripe.createSubtleCryptoProvider());}
  catch{return json({ok:false,code:"SIGNATURE_INVALID"},400);}
  if(event.livemode)return json({ok:false,code:"LIVE_EVENT_REJECTED"},409);
  const object:any=event.data.object;
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:ingested,error:ingestError}=await admin.rpc("stripe_webhook_ingest_v204",{
    p_event_id:event.id,p_event_type:event.type,p_object_id:String(object?.id||"")||null,
    p_created_at:new Date(event.created*1000).toISOString(),p_api_version:event.api_version||API_VERSION,
    p_payload_sha256:await sha256(raw),p_livemode:false
  });
  if(ingestError)return json({ok:false,code:"EVENT_PERSIST_FAILED"},503);
  if(ingested?.firstDelivery!==true)return json({ok:true,release:"V204",duplicate:true,effectApplied:false,entitlementDispatched:false});
  if(!SUPPORTED.has(event.type)){
    await admin.rpc("stripe_webhook_finish_v204",{p_event_id:event.id,p_status:"ignored",p_error_code:"EVENT_NOT_SUBSCRIBED"});
    return json({ok:true,release:"V204",ignored:true,entitlementDispatched:false});
  }
  const {data:gate}=await admin.rpc("stripe_gate_v204");
  if(gate?.providerMode!=="test"||gate?.webhookProcessingEnabled!==true){
    return json({ok:true,release:"V204",persisted:true,processing:"paused",entitlementDispatched:false},202);
  }
  const item=normalized(event);
  if(!item.objectId||item.objectType==="unknown"){
    await admin.rpc("stripe_webhook_finish_v204",{p_event_id:event.id,p_status:"failed",p_error_code:"NORMALIZATION_FAILED"});
    return json({ok:false,code:"NORMALIZATION_FAILED"},422);
  }
  const {data:applied,error:applyError}=await admin.rpc("stripe_webhook_apply_v204",{
    p_event_id:event.id,p_object_id:item.objectId,p_object_type:item.objectType,p_state:item.state,
    p_user_id:item.userId,p_product_key:item.productKey,p_amount_brl_cents:item.amount,
    p_currency:item.currency,p_parent_object_id:item.parent
  });
  if(applyError){
    await admin.rpc("stripe_webhook_finish_v204",{p_event_id:event.id,p_status:"failed",p_error_code:"EVENT_APPLY_FAILED"});
    console.error("stripe webhook v204",{code:"EVENT_APPLY_FAILED",eventId:event.id});
    return json({ok:false,code:"EVENT_APPLY_FAILED"},503);
  }
  return json({ok:true,release:"V204",persisted:true,effectApplied:applied?.applied===true,entitlementDispatched:false});
});
