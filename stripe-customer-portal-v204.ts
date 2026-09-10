/* DIVINA BRUXA V204 — Customer Portal Stripe TEST. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import Stripe from "npm:stripe@22.4.0";

const ALLOWED=new Set(["https://divinabruxa.com.br","https://www.divinabruxa.com.br","https://divinabruxa.github.io"]);
const LOCAL=/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const origin=(req:Request)=>req.headers.get("origin")||"";
const allowed=(req:Request)=>!origin(req)||ALLOWED.has(origin(req))||LOCAL.test(origin(req));
const h=(req:Request)=>({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Vary":"Origin",...(origin(req)&&allowed(req)?{"Access-Control-Allow-Origin":origin(req)}:{})});
const out=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:h(req)});

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return allowed(req)?new Response(null,{status:204,headers:{...h(req),"Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"}}):out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);
  if(req.method!=="POST")return out(req,{ok:false,code:"METHOD_NOT_ALLOWED"},405);
  if(!allowed(req))return out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);
  const url=env("SUPABASE_URL"),anon=env("SUPABASE_ANON_KEY"),service=env("SUPABASE_SERVICE_ROLE_KEY"),stripeKey=env("STRIPE_RESTRICTED_KEY_TEST"),site=env("PUBLIC_SITE_ORIGIN_STAGING").replace(/\/$/,"");
  if(!url||!anon||!service||!site||!stripeKey.startsWith("rk_test_"))return out(req,{ok:false,code:"TEST_SERVER_NOT_CONFIGURED"},503);
  const bearer=req.headers.get("Authorization")||"";
  if(!bearer.startsWith("Bearer "))return out(req,{ok:false,code:"AUTH_REQUIRED"},401);
  const userClient=createClient(url,anon,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:userData,error}=await userClient.auth.getUser(bearer.slice(7));
  if(error||!userData.user)return out(req,{ok:false,code:"AUTH_INVALID"},401);
  const {data:active}=await userClient.rpc("account_access_is_active_v201");
  if(active!==true)return out(req,{ok:false,code:"ACCOUNT_NOT_ACTIVE"},403);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const [{data:gate},{data:customerId}]=await Promise.all([admin.rpc("stripe_gate_v204"),admin.rpc("stripe_customer_lookup_v204",{p_user_id:userData.user.id})]);
  if(gate?.providerMode!=="test"||gate?.checkoutAuthorized!==true||gate?.liveBillingAuthorized!==false)return out(req,{ok:false,code:"TEST_PORTAL_LOCKED"},423);
  if(!String(customerId||"").startsWith("cus_"))return out(req,{ok:false,code:"TEST_CUSTOMER_NOT_FOUND"},404);
  try{
    const stripe=new Stripe(stripeKey,{apiVersion:"2026-07-29.dahlia",httpClient:Stripe.createFetchHttpClient(),appInfo:{name:"Divina Bruxa",version:"V204"}});
    const session=await stripe.billingPortal.sessions.create({customer:String(customerId),return_url:`${site}/#account`});
    return out(req,{ok:true,release:"V204",mode:"test",portalUrl:session.url});
  }catch{
    console.error("stripe portal v204",{code:"STRIPE_TEST_PORTAL_FAILED",requestId:crypto.randomUUID()});
    return out(req,{ok:false,code:"STRIPE_TEST_PORTAL_FAILED"},502);
  }
});
