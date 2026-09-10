/* DIVINA BRUXA V204 — Reconciliação Stripe TEST, sem conceder direitos. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const meta=(object:any)=>object?.metadata||object?.subscription_details?.metadata||object?.parent?.subscription_details?.metadata||{};

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({ok:false,code:"METHOD_NOT_ALLOWED"},405);
  const url=env("SUPABASE_URL"),anon=env("SUPABASE_ANON_KEY"),service=env("SUPABASE_SERVICE_ROLE_KEY"),stripeKey=env("STRIPE_RESTRICTED_KEY_TEST");
  if(!url||!anon||!service||!stripeKey.startsWith("rk_test_"))return json({ok:false,code:"TEST_SERVER_NOT_CONFIGURED"},503);
  const bearer=req.headers.get("Authorization")||"";
  if(!bearer.startsWith("Bearer "))return json({ok:false,code:"AUTH_REQUIRED"},401);
  const userClient=createClient(url,anon,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:userData,error:userError}=await userClient.auth.getUser(bearer.slice(7));
  if(userError||!userData.user)return json({ok:false,code:"AUTH_INVALID"},401);
  const {data:control}=await userClient.rpc("account_control_v201");
  if(control?.owner!==true||control?.mfaSatisfied!==true||control?.sessionActive!==true)return json({ok:false,code:"OWNER_AAL2_REQUIRED"},403);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:gate}=await admin.rpc("stripe_gate_v204");
  if(gate?.providerMode!=="test"||gate?.webhookProcessingEnabled!==true||gate?.liveBillingAuthorized!==false)return json({ok:false,code:"TEST_RECONCILIATION_LOCKED"},423);
  const stripe=new Stripe(stripeKey,{apiVersion:"2026-07-29.dahlia",httpClient:Stripe.createFetchHttpClient(),appInfo:{name:"Divina Bruxa",version:"V204"}});
  try{
    let oneTime=0,subscriptions=0,refunds=0;
    let startingAfter:string|undefined;
    do{
      const page=await stripe.paymentIntents.list({limit:100,...(startingAfter?{starting_after:startingAfter}:{})});
      for(const item of page.data)if(!item.livemode&&item.status==="succeeded"&&meta(item).release==="V204"&&meta(item).product_key!=="orbe_ai_monthly")oneTime+=item.amount_received;
      startingAfter=page.has_more?page.data.at(-1)?.id:undefined;
    }while(startingAfter);
    startingAfter=undefined;
    do{
      const page=await stripe.invoices.list({limit:100,...(startingAfter?{starting_after:startingAfter}:{})});
      for(const item of page.data)if(!item.livemode&&item.status==="paid"&&meta(item).release==="V204"&&meta(item).product_key==="orbe_ai_monthly")subscriptions+=item.amount_paid;
      startingAfter=page.has_more?page.data.at(-1)?.id:undefined;
    }while(startingAfter);
    startingAfter=undefined;
    do{
      const page=await stripe.charges.list({limit:100,...(startingAfter?{starting_after:startingAfter}:{})});
      for(const item of page.data)if(!item.livemode&&item.refunded&&meta(item).release==="V204")refunds+=item.amount_refunded;
      startingAfter=page.has_more?page.data.at(-1)?.id:undefined;
    }while(startingAfter);
    const stripeTotal=oneTime+subscriptions-refunds;
    const scope=`v204-${new Date().toISOString().slice(0,10)}`;
    const {data:snapshot,error}=await admin.rpc("stripe_reconciliation_snapshot_v204",{p_scope_key:scope,p_stripe_total:stripeTotal});
    if(error)throw new Error("RECONCILIATION_PERSIST_FAILED");
    return json({ok:snapshot?.zero===true,release:"V204",mode:"test",scope,stripeTotalBrlCents:stripeTotal,components:{oneTime,subscriptions,refunds},local:snapshot,entitlementDispatchCount:0});
  }catch(error){
    const code=error instanceof Error&&/^[A-Z0-9_]{3,80}$/.test(error.message)?error.message:"STRIPE_TEST_RECONCILIATION_FAILED";
    console.error("stripe reconcile v204",{code,requestId:crypto.randomUUID()});
    return json({ok:false,code},502);
  }
});
