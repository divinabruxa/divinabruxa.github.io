/* DIVINA BRUXA V148 — CONSULTAS STAGING + AVISO TRANSACIONAL À PROPRIETÁRIA */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const ALLOWED_ORIGINS=new Set([
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io"
]);
const LOCAL_ORIGIN=/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES=12000;
const DEFAULT_PRICE_VERSION="consultas-2026-09-05-v147";
const OPERATIONS_EMAIL="orbedasrealidades@hotmail.com";
const RESEND_ENDPOINT="https://api.resend.com/emails";
const SERVICE_ALIASES:Record<string,string>={
  "mesa-real":"mesa-real-profissional",
  "mesa-real-profissional":"mesa-real-profissional",
  "leitura-de-mentes":"leitura-mentes",
  "leitura-de-pensamentos":"leitura-mentes",
  "leitura-mentes":"leitura-mentes",
  "carta-de-conselho":"carta-conselho",
  "carta-conselho":"carta-conselho",
  "pergunta":"pergunta-direta",
  "pergunta-direta":"pergunta-direta"
};

const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const origin=(req:Request)=>req.headers.get("origin")||"";
const originAllowed=(req:Request)=>!origin(req)||ALLOWED_ORIGINS.has(origin(req))||LOCAL_ORIGIN.test(origin(req));
const serviceKey=(value:unknown)=>SERVICE_ALIASES[String(value||"").trim()]||"";
const emailConfigured=()=>Boolean(env("RESEND_API_KEY")&&env("CONSULTATIONS_EMAIL_FROM"));

async function requestFingerprint(req:Request,salt:string){
  const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]||"unknown").trim().slice(0,64);
  const agent=(req.headers.get("user-agent")||"unknown").slice(0,160);
  const bytes=new TextEncoder().encode(`${salt.slice(-32)}|${ip}|${agent}`);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,"0")).join("");
}

function responseHeaders(req:Request){
  const headers:Record<string,string>={
    "Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store, max-age=0",
    "X-Content-Type-Options":"nosniff",
    "Referrer-Policy":"no-referrer"
  };
  if(originAllowed(req)&&origin(req))headers["Access-Control-Allow-Origin"]=origin(req);
  return headers;
}

const out=(req:Request,body:unknown,status=200,extra:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{...responseHeaders(req),...extra}});

function normalizePhone(value:unknown){
  const raw=String(value||"").trim();
  if(raw.startsWith("+"))return "+"+raw.slice(1).replace(/\D/g,"");
  const digits=raw.replace(/\D/g,"");
  if(digits.length===10||digits.length===11)return "+55"+digits;
  if((digits.length===12||digits.length===13)&&digits.startsWith("55"))return "+"+digits;
  return raw;
}

async function optionalUser(req:Request,url:string,anon:string){
  const authorization=req.headers.get("Authorization")||"";
  if(!authorization.startsWith("Bearer "))return null;
  const client=createClient(url,anon,{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data,error}=await client.auth.getUser(authorization.slice(7));
  return error?null:data?.user||null;
}

async function loadCatalog(admin:any){
  let result=await admin.rpc("consultation_catalog_server",{p_days:30});
  if(result.error){
    await new Promise(resolve=>setTimeout(resolve,180));
    result=await admin.rpc("consultation_catalog_server",{p_days:30});
  }
  return result;
}

const currency=(cents:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(cents||0)/100);
const dateTime=(value:string)=>{
  try{return new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",dateStyle:"full",timeStyle:"short"}).format(new Date(value));}
  catch{return value||"A combinar";}
};

type ConsultationRecord={
  id:string;
  protocol:string;
  service_key:string;
  customer_name:string;
  customer_email:string;
  customer_phone:string;
  question_context:string;
  price_brl_cents_snapshot:number;
  scheduled_start_at:string;
  scheduled_end_at:string;
  status:string;
  payment_status:string;
};

async function consultationRecord(admin:any,id:string){
  const {data,error}=await admin.from("consultation_requests")
    .select("id,protocol,service_key,customer_name,customer_email,customer_phone,question_context,price_brl_cents_snapshot,scheduled_start_at,scheduled_end_at,status,payment_status")
    .eq("id",id).maybeSingle();
  return error?null:data as ConsultationRecord|null;
}

async function updateNotification(admin:any,record:ConsultationRecord,status:string,details:Record<string,unknown>={}){
  const {data:current}=await admin.from("consultation_email_notifications")
    .select("attempt_count").eq("consultation_id",record.id).maybeSingle();
  const attempted=status==="sending";
  const row={
    consultation_id:record.id,
    recipient_email:OPERATIONS_EMAIL,
    delivery_status:status,
    provider:"resend",
    attempt_count:Number(current?.attempt_count||0)+(attempted?1:0),
    updated_at:new Date().toISOString(),
    ...details
  };
  await admin.from("consultation_email_notifications").upsert(row,{onConflict:"consultation_id"});
}

async function notifyOwner(admin:any,record:ConsultationRecord){
  const {data:ledger}=await admin.from("consultation_email_notifications")
    .select("delivery_status").eq("consultation_id",record.id).maybeSingle();
  if(ledger?.delivery_status==="accepted")return {accepted:true,status:"accepted",idempotent:true};

  const apiKey=env("RESEND_API_KEY");
  const sender=env("CONSULTATIONS_EMAIL_FROM");
  if(!apiKey||!sender){
    await updateNotification(admin,record,"not_configured",{last_error_code:"EMAIL_PROVIDER_NOT_CONFIGURED"});
    return {accepted:false,status:"not_configured"};
  }

  const {data:service}=await admin.from("consultation_services").select("name").eq("service_key",record.service_key).maybeSingle();
  const serviceName=String(service?.name||record.service_key);
  const subject=`Nova consulta · ${record.protocol} · ${serviceName}`.slice(0,180);
  const message=[
    "DIVINA BRUXA — NOVA SOLICITAÇÃO DE CONSULTA",
    "",
    `Protocolo: ${record.protocol}`,
    `Consulta: ${serviceName}`,
    `Valor registrado: ${currency(record.price_brl_cents_snapshot)}`,
    `Horário solicitado: ${dateTime(record.scheduled_start_at)}`,
    "",
    `Nome: ${record.customer_name}`,
    `E-mail da pessoa: ${record.customer_email}`,
    `Telefone: ${record.customer_phone}`,
    "",
    "Pergunta ou contexto:",
    record.question_context,
    "",
    "Ambiente: STAGING",
    "Cobrança realizada: não",
    "Responda diretamente a este e-mail para falar com a pessoa."
  ].join("\n");

  await updateNotification(admin,record,"sending",{last_attempt_at:new Date().toISOString(),last_error_code:null});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(RESEND_ENDPOINT,{
      method:"POST",
      signal:controller.signal,
      headers:{
        "Authorization":`Bearer ${apiKey}`,
        "Content-Type":"application/json",
        "Idempotency-Key":`divina-consultation-${record.id}-owner-v1`
      },
      body:JSON.stringify({
        from:sender,
        to:[OPERATIONS_EMAIL],
        reply_to:record.customer_email,
        subject,
        text:message
      })
    });
    if(!response.ok){
      const errorCode=`PROVIDER_HTTP_${response.status}`;
      await updateNotification(admin,record,"failed",{last_error_code:errorCode,last_attempt_at:new Date().toISOString()});
      console.error("consultation email",{consultationId:record.id,code:errorCode});
      return {accepted:false,status:"failed"};
    }
    let providerMessageId="";
    try{providerMessageId=String((await response.json())?.id||"").slice(0,160);}catch{/* Resposta sem corpo não invalida a aceitação. */}
    await updateNotification(admin,record,"accepted",{
      provider_message_id:providerMessageId||null,
      accepted_at:new Date().toISOString(),
      last_attempt_at:new Date().toISOString(),
      last_error_code:null
    });
    return {accepted:true,status:"accepted"};
  }catch(error){
    const errorCode=error instanceof DOMException&&error.name==="AbortError"?"PROVIDER_TIMEOUT":"PROVIDER_NETWORK_ERROR";
    await updateNotification(admin,record,"failed",{last_error_code:errorCode,last_attempt_at:new Date().toISOString()});
    console.error("consultation email",{consultationId:record.id,code:errorCode});
    return {accepted:false,status:"failed"};
  }finally{clearTimeout(timer);}
}

async function notificationFor(admin:any,consultationId:string){
  const record=await consultationRecord(admin,consultationId);
  if(!record)return {accepted:false,status:"request_lookup_failed"};
  return notifyOwner(admin,record);
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return originAllowed(req)?new Response(null,{status:204,headers:responseHeaders(req)}):out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);
  if(!originAllowed(req))return out(req,{ok:false,code:"ORIGIN_FORBIDDEN"},403);

  const url=env("SUPABASE_URL");
  const anon=env("SUPABASE_ANON_KEY");
  const serviceRole=env("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!anon||!serviceRole)return out(req,{ok:false,code:"SERVER_CONFIG_ERROR"},503);

  const admin=createClient(url,serviceRole,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const user=await optionalUser(req,url,anon);

  if(req.method==="GET"){
    const {data:catalog,error}=await loadCatalog(admin);
    if(error||!catalog){
      console.error("consultations-booking catalog",{code:error?.code||"empty_catalog"});
      return out(req,{ok:false,code:"AVAILABILITY_FAILED"},503);
    }
    return out(req,{
      ok:true,
      environment:"staging",
      timezone:"America/Sao_Paulo",
      priceTableVersion:catalog.priceTableVersion||DEFAULT_PRICE_VERSION,
      rules:{weekdays:[1,2,3,4,5],morning:"08:00-12:00",afternoon:"13:00-18:00",slotMinutes:60,holdMinutes:15,minNoticeHours:4,maxDays:30,confirmationChannel:"email",realBilling:false},
      notifications:{channel:"email",ownerEmail:OPERATIONS_EMAIL,ownerEmailConfigured:emailConfigured()},
      services:Array.isArray(catalog.services)?catalog.services:[],
      slots:Array.isArray(catalog.slots)?catalog.slots:[]
    });
  }

  if(req.method!=="POST")return out(req,{ok:false,code:"METHOD_NOT_ALLOWED"},405);
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>MAX_BODY_BYTES)return out(req,{ok:false,code:"BODY_TOO_LARGE"},413);

  let body:any;
  try{body=await req.json();}catch{return out(req,{ok:false,code:"INVALID_JSON"},400);}
  if(JSON.stringify(body).length>MAX_BODY_BYTES)return out(req,{ok:false,code:"BODY_TOO_LARGE"},413);
  if(String(body?.website||"").trim())return out(req,{ok:false,code:"BOT_REJECTED"},400);
  const action=String(body?.action||"");

  if(action==="hold"||action==="submit"){
    const fingerprint=await requestFingerprint(req,serviceRole);
    const {data:withinLimit,error:limitError}=await admin.rpc("consultation_rate_limit_server",{p_fingerprint:fingerprint,p_action:action,p_limit:action==="hold"?12:8});
    if(limitError)return out(req,{ok:false,code:"RATE_LIMIT_FAILED"},503);
    if(withinLimit!==true)return out(req,{ok:false,code:"RATE_LIMITED"},429,{"Retry-After":"3600"});
  }

  if(action==="hold"){
    const key=serviceKey(body?.serviceKey);
    const start=String(body?.slotStartAt||"");
    if(!key||!start)return out(req,{ok:false,code:"INVALID_HOLD"},400);
    const {data,error}=await admin.rpc("consultation_hold_server",{p_service_key:key,p_slot_start:start,p_user_id:user?.id||null});
    if(error){
      const message=String(error.message||"");
      if(message.includes("slot_unavailable"))return out(req,{ok:false,code:"SLOT_UNAVAILABLE"},409);
      if(message.includes("invalid_slot"))return out(req,{ok:false,code:"INVALID_SLOT"},400);
      if(message.includes("service_unavailable"))return out(req,{ok:false,code:"SERVICE_UNAVAILABLE"},409);
      return out(req,{ok:false,code:"HOLD_FAILED"},400);
    }
    return out(req,{ok:true,...data});
  }

  if(action==="submit"){
    const holdToken=String(body?.holdToken||"");
    const submissionId=String(body?.submissionId||"");
    if(!holdToken||!UUID.test(holdToken)||!UUID.test(submissionId))return out(req,{ok:false,code:"HOLD_REQUIRED"},400);

    const {data:existing}=await admin.from("consultation_requests")
      .select("id,protocol,scheduled_start_at,scheduled_end_at,status,payment_status")
      .eq("submission_id",submissionId).maybeSingle();
    if(existing){
      const notification=await notificationFor(admin,existing.id);
      return out(req,{ok:true,protocol:existing.protocol,consultationId:existing.id,slotStartAt:existing.scheduled_start_at,slotEndAt:existing.scheduled_end_at,status:existing.status,paymentStatus:existing.payment_status,idempotent:true,notification,message:notification.accepted?"Solicitação já registrada e aviso por e-mail confirmado.":"Solicitação já registrada. O aviso por e-mail permanece pendente."});
    }

    const name=String(body?.name||"").trim().slice(0,120);
    const email=String(body?.email||"").trim().slice(0,254);
    const phone=normalizePhone(body?.phone);
    const context=String(body?.questionContext||"").trim().slice(0,3000);
    const {data,error}=await admin.rpc("consultation_submit_server",{
      p_hold_token:holdToken,
      p_submission_id:submissionId,
      p_user_id:user?.id||null,
      p_customer_name:name,
      p_customer_email:email,
      p_customer_phone:phone,
      p_question_context:context,
      p_accept_terms:body?.acceptTerms===true,
      p_accept_privacy:body?.acceptPrivacy===true,
      p_accept_symbolic:body?.acceptSymbolic===true,
      p_marketing_opt_in:false
    });
    if(error){
      const message=String(error.message||"");
      const mapped:[string,string,number][]=[
        ["hold_expired","HOLD_EXPIRED",409],
        ["slot_unavailable","SLOT_UNAVAILABLE",409],
        ["consent_required","CONSENT_REQUIRED",400],
        ["invalid_phone","INVALID_PHONE",400],
        ["invalid_email","INVALID_EMAIL",400],
        ["invalid_context","INVALID_CONTEXT",400],
        ["invalid_name","INVALID_NAME",400],
        ["service_unavailable","SERVICE_UNAVAILABLE",409]
      ];
      for(const [needle,code,status] of mapped)if(message.includes(needle))return out(req,{ok:false,code},status);
      return out(req,{ok:false,code:"SUBMIT_FAILED"},400);
    }
    const notification=await notificationFor(admin,String(data?.consultationId||""));
    return out(req,{ok:true,...data,notification,message:notification.accepted?"Solicitação registrada e aviso por e-mail enviado à proprietária.":"Solicitação registrada. O aviso por e-mail permanece pendente."});
  }

  return out(req,{ok:false,code:"UNKNOWN_ACTION"},400);
});
