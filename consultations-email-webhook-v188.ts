/* DIVINA BRUXA V188 — WEBHOOK RESEND AUTENTICADO E IDEMPOTENTE */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const MAX_BODY_BYTES=100000;
const MAX_CLOCK_SKEW_SECONDS=300;

const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{
  status,
  headers:{
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store, max-age=0",
    "X-Content-Type-Options":"nosniff",
    "Referrer-Policy":"no-referrer"
  }
});

function base64Bytes(value:string){
  try{
    const normalized=value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"=");
    const binary=atob(normalized);
    return Uint8Array.from(binary,char=>char.charCodeAt(0));
  }catch{return null;}
}

function equalBytes(left:Uint8Array,right:Uint8Array){
  if(left.length!==right.length)return false;
  let difference=0;
  for(let index=0;index<left.length;index+=1)difference|=left[index]^right[index];
  return difference===0;
}

async function verifySvix(payload:string,headers:Headers,secret:string){
  const eventId=headers.get("svix-id")||"";
  const timestampRaw=headers.get("svix-timestamp")||"";
  const signatureRaw=headers.get("svix-signature")||"";
  if(!eventId||!/^\d{10,13}$/.test(timestampRaw)||!signatureRaw)return null;

  const timestamp=Number(timestampRaw);
  const seconds=timestamp>1e12?Math.floor(timestamp/1000):timestamp;
  if(!Number.isFinite(seconds)||Math.abs(Math.floor(Date.now()/1000)-seconds)>MAX_CLOCK_SKEW_SECONDS)return null;

  const encodedSecret=secret.startsWith("whsec_")?secret.slice(6):secret;
  const keyBytes=base64Bytes(encodedSecret);
  if(!keyBytes?.length)return null;
  const key=await crypto.subtle.importKey("raw",keyBytes,{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signed=`${eventId}.${timestampRaw}.${payload}`;
  const expected=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(signed)));
  const candidates=signatureRaw.split(/\s+/).map(value=>value.split(",",2)).filter(([version,value])=>version==="v1"&&Boolean(value));
  const valid=candidates.some(([,value])=>{
    const actual=base64Bytes(value);
    return actual?equalBytes(expected,actual):false;
  });
  return valid?eventId:null;
}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({ok:false,code:"METHOD_NOT_ALLOWED"},405);
  const declared=Number(req.headers.get("content-length")||0);
  if(declared>MAX_BODY_BYTES)return json({ok:false,code:"BODY_TOO_LARGE"},413);
  if(!req.headers.get("svix-id")||!req.headers.get("svix-timestamp")||!req.headers.get("svix-signature"))return json({ok:false,code:"INVALID_SIGNATURE"},401);

  const url=env("SUPABASE_URL");
  const serviceRole=env("SUPABASE_SERVICE_ROLE_KEY");
  const webhookSecret=env("RESEND_WEBHOOK_SECRET");
  if(!url||!serviceRole||!webhookSecret)return json({ok:false,code:"SERVER_CONFIG_ERROR"},503);

  const payload=await req.text();
  if(new TextEncoder().encode(payload).byteLength>MAX_BODY_BYTES)return json({ok:false,code:"BODY_TOO_LARGE"},413);
  const eventId=await verifySvix(payload,req.headers,webhookSecret);
  if(!eventId)return json({ok:false,code:"INVALID_SIGNATURE"},401);

  let event:any;
  try{event=JSON.parse(payload);}catch{return json({ok:false,code:"INVALID_JSON"},400);}
  const eventType=String(event?.type||"").slice(0,80);
  const providerMessageId=String(event?.data?.email_id||event?.data?.id||"").slice(0,200);
  const occurredAt=String(event?.created_at||"");
  if(!/^email\.[a-z_]+$/.test(eventType)||!providerMessageId)return json({ok:false,code:"INVALID_EVENT"},400);

  const admin=createClient(url,serviceRole,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data,error}=await admin.rpc("consultation_email_event_server_v188",{
    p_event_id:eventId.slice(0,200),
    p_event_type:eventType,
    p_provider_message_id:providerMessageId,
    p_occurred_at:occurredAt||null
  });
  if(error){
    console.error("consultation webhook",{eventType,code:error.code||"EVENT_STORE_FAILED"});
    return json({ok:false,code:"EVENT_STORE_FAILED"},503);
  }
  return json({ok:true,idempotent:data===false});
});
