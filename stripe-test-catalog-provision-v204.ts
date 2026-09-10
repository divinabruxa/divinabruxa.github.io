/* DIVINA BRUXA V204 — Provisiona Products/Prices exclusivamente TEST após portão explícito. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({ok:false,code:"METHOD_NOT_ALLOWED"},405);
  const url=env("SUPABASE_URL"),anon=env("SUPABASE_ANON_KEY"),service=env("SUPABASE_SERVICE_ROLE_KEY"),stripeKey=env("STRIPE_RESTRICTED_KEY_TEST");
  if(!url||!anon||!service||!stripeKey.startsWith("rk_test_"))return json({ok:false,code:"TEST_SERVER_NOT_CONFIGURED"},503);
  const bearer=req.headers.get("Authorization")||"";
  if(!bearer.startsWith("Bearer "))return json({ok:false,code:"AUTH_REQUIRED"},401);
  const userClient=createClient(url,anon,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:userData,error:userError}=await userClient.auth.getUser(bearer.slice(7));
  if(userError||!userData.user)return json({ok:false,code:"AUTH_INVALID"},401);
  const {data:control,error:controlError}=await userClient.rpc("account_control_v201");
  if(controlError||control?.owner!==true||control?.mfaSatisfied!==true||control?.sessionActive!==true)return json({ok:false,code:"OWNER_AAL2_REQUIRED"},403);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const [{data:gate},{data:pending,error:pendingError}]=await Promise.all([admin.rpc("stripe_gate_v204"),admin.rpc("stripe_catalog_pending_v204")]);
  if(gate?.providerMode!=="test"||gate?.provisioningAuthorized!==true||gate?.liveBillingAuthorized!==false||gate?.automaticTaxEnabled!==false)return json({ok:false,code:"TEST_PROVISIONING_LOCKED"},423);
  if(pendingError||!Array.isArray(pending))return json({ok:false,code:"CATALOG_UNAVAILABLE"},503);
  const stripe=new Stripe(stripeKey,{apiVersion:"2026-07-29.dahlia",httpClient:Stripe.createFetchHttpClient(),appInfo:{name:"Divina Bruxa",version:"V204"}});
  const results=[];
  for(const item of pending){
    try{
      const metadata={release:"V204",catalog_version:"commercial-2026-09-09-v200",product_key:item.productKey};
      const product=await stripe.products.create({name:item.name,active:true,metadata},{idempotencyKey:`db:v204:product:${item.productKey}`});
      const priceParams:any={product:product.id,currency:"brl",unit_amount:item.amountBrlCents,active:true,nickname:item.productKey,metadata};
      if(item.billingMode==="subscription")priceParams.recurring={interval:item.recurringInterval||"month"};
      const price=await stripe.prices.create(priceParams,{idempotencyKey:`db:v204:price:${item.productKey}:${item.amountBrlCents}`});
      if(product.livemode||price.livemode)throw new Error("LIVE_OBJECT_REJECTED");
      const registered=await admin.rpc("stripe_catalog_register_v204",{p_product_key:item.productKey,p_stripe_product_id:product.id,p_stripe_price_id:price.id});
      if(registered.error||registered.data!==true)throw new Error("CATALOG_REGISTER_FAILED");
      results.push({productKey:item.productKey,status:"ready",productId:product.id,priceId:price.id});
    }catch(error){
      const code=error instanceof Error&&/^[A-Z0-9_]{3,80}$/.test(error.message)?error.message:"STRIPE_TEST_PROVISION_FAILED";
      console.error("stripe provision v204",{code,productKey:item.productKey});
      results.push({productKey:item.productKey,status:"failed",code});
      break;
    }
  }
  return json({ok:results.every(item=>item.status==="ready"),release:"V204",mode:"test",results},results.every(item=>item.status==="ready")?200:502);
});
