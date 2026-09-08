/* DIVINA BRUXA V188 — CONSULTAS DURÁVEIS, RASTREAMENTO PRIVADO E E-MAIL DUPLO */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const ALLOWED_ORIGINS=new Set([
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io"
]);
const LOCAL_ORIGIN=/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PROTOCOL=/^DB-[0-9]{8}-[A-Z0-9]{8}$/;
const TRACKING_TOKEN=/^[A-Za-z0-9_-]{24,96}$/;
const MAX_BODY_BYTES=16000;
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
const PERIODS:Record<string,string>={
  "":"any","any":"any","a combinar":"any",
  "morning":"morning","manha":"morning","manhã":"morning",
  "afternoon":"afternoon","tarde":"afternoon",
  "evening":"evening","noite":"evening"
};
const PERIOD_LABELS:Record<string,string>={morning:"Manhã",afternoon:"Tarde",evening:"Noite",any:"Período a combinar"};

const env=(name:string)=>Deno.env.get(name)?.trim()||"";
const origin=(req:Request)=>req.headers.get("origin")||"";
const originAllowed=(req:Request)=>!origin(req)||ALLOWED_ORIGINS.has(origin(req))||LOCAL_ORIGIN.test(origin(req));
const canonicalService=(value:unknown)=>SERVICE_ALIASES[String(value||"").trim()]||"";
const canonicalPeriod=(value:unknown)=>PERIODS[String(value||"").trim().toLocaleLowerCase("pt-BR")]||"";
const emailConfigured=()=>Boolean(env("RESEND_API_KEY")&&env("CONSULTATIONS_EMAIL_FROM"));

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

async function sha256(value:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}

async function requestFingerprint(req:Request,salt:string){
  const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]||"unknown").trim().slice(0,64);
  const agent=(req.headers.get("user-agent")||"unknown").slice(0,160);
  return sha256(`${salt.slice(-32)}|${ip}|${agent}`);
}

function normalizePhone(value:unknown){
  const raw=String(value||"").trim();
  if(raw.startsWith("+"))return "+"+raw.slice(1).replace(/\D/g,"");
  const digits=raw.replace(/\D/g,"");
  if(digits.length===10||digits.length===11)return "+55"+digits;
  if((digits.length===12||digits.length===13)&&digits.startsWith("55"))return "+"+digits;
  return raw;
}

function normalizeDate(value:unknown){
  const raw=String(value||"").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw)?raw:null;
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
const dateTime=(value:string|null)=>{
  if(!value)return "A combinar";
  try{return new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",dateStyle:"full",timeStyle:"short"}).format(new Date(value));}
  catch{return "A combinar";}
};
const dateOnly=(value:string|null)=>{
  if(!value)return "Data a combinar";
  const [year,month,day]=value.split("-");
  return year&&month&&day?`${day}/${month}/${year}`:"Data a combinar";
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
  scheduled_start_at:string|null;
  scheduled_end_at:string|null;
  status:string;
  payment_status:string;
  tracking_token_hash:string|null;
  preference_source:string;
  preferred_date:string|null;
  preferred_period:string|null;
  created_at:string;
  status_updated_at:string;
};

async function consultationRecord(admin:any,id:string){
  const {data,error}=await admin.from("consultation_requests")
    .select("id,protocol,service_key,customer_name,customer_email,customer_phone,question_context,price_brl_cents_snapshot,scheduled_start_at,scheduled_end_at,status,payment_status,tracking_token_hash,preference_source,preferred_date,preferred_period,created_at,status_updated_at")
    .eq("id",id).maybeSingle();
  return error?null:data as ConsultationRecord|null;
}

async function trackedRecord(admin:any,protocol:string,tokenHash:string){
  const {data,error}=await admin.from("consultation_requests")
    .select("id,protocol,service_key,customer_name,customer_email,customer_phone,question_context,price_brl_cents_snapshot,scheduled_start_at,scheduled_end_at,status,payment_status,tracking_token_hash,preference_source,preferred_date,preferred_period,created_at,status_updated_at")
    .eq("protocol",protocol).eq("tracking_token_hash",tokenHash).maybeSingle();
  return error?null:data as ConsultationRecord|null;
}

async function serviceName(admin:any,key:string){
  const {data}=await admin.from("consultation_services").select("name").eq("service_key",key).maybeSingle();
  return String(data?.name||key);
}

async function ledgerFor(admin:any,consultationId:string,audience:"owner"|"customer"){
  const {data}=await admin.from("consultation_email_notifications")
    .select("delivery_status,provider_message_id,attempt_count,accepted_at,delivered_at,updated_at")
    .eq("consultation_id",consultationId).eq("audience",audience).maybeSingle();
  return data||null;
}

async function recordEmail(admin:any,record:ConsultationRecord,audience:"owner"|"customer",recipient:string,status:string,details:Record<string,unknown>={}){
  const {data,error}=await admin.rpc("consultation_email_record_server_v188",{
    p_consultation_id:record.id,
    p_audience:audience,
    p_recipient_email:recipient,
    p_delivery_status:status,
    p_provider_message_id:String(details.providerMessageId||"")||null,
    p_last_error_code:String(details.errorCode||"")||null,
    p_increment_attempt:details.incrementAttempt===true
  });
  if(error){
    console.error("consultation email ledger",{consultationId:record.id,audience,code:error.code||"LEDGER_ERROR"});
    return {audience,status:"ledger_failed",accepted:false,delivered:false};
  }
  return data||{audience,status};
}

function preferenceLabel(record:ConsultationRecord){
  if(record.scheduled_start_at)return `${dateTime(record.scheduled_start_at)} · horário de Brasília`;
  const period=PERIOD_LABELS[record.preferred_period||"any"]||PERIOD_LABELS.any;
  return `${dateOnly(record.preferred_date)} · ${period}`;
}

function publicStatus(value:string){
  if(value==="completed")return {key:"completed",label:"Concluída"};
  if(value==="cancelled"||value==="refunded")return {key:"cancelled",label:"Cancelada"};
  if(["scheduled","payment_verified","in_progress"].includes(value))return {key:"confirmed",label:"Confirmada"};
  if(["under_review","awaiting_customer","payment_pending"].includes(value))return {key:"awaiting_confirmation",label:"Aguardando confirmação"};
  return {key:"received",label:"Recebida"};
}

function notificationSummary(value:any){
  const status=String(value?.status||value?.delivery_status||"pending");
  return {status,accepted:["accepted","delivered"].includes(status),delivered:status==="delivered"};
}

async function sendEmail(admin:any,record:ConsultationRecord,audience:"owner"|"customer",trackingToken:string){
  const recipient=audience==="owner"?OPERATIONS_EMAIL:record.customer_email;
  const existing=await ledgerFor(admin,record.id,audience);
  if(["accepted","delivered"].includes(String(existing?.delivery_status||"")))return {...notificationSummary(existing),idempotent:true};
  if(["bounced","complained"].includes(String(existing?.delivery_status||"")))return {...notificationSummary(existing),blocked:true};

  const apiKey=env("RESEND_API_KEY");
  const sender=env("CONSULTATIONS_EMAIL_FROM");
  if(!apiKey||!sender)return recordEmail(admin,record,audience,recipient,"not_configured",{errorCode:"EMAIL_PROVIDER_NOT_CONFIGURED"});

  const name=await serviceName(admin,record.service_key);
  const schedule=preferenceLabel(record);
  const isOwner=audience==="owner";
  const subject=(isOwner
    ?`Nova consulta · ${record.protocol} · ${name}`
    :`Recebemos sua solicitação · ${record.protocol}`).slice(0,180);
  const message=isOwner?[
    "DIVINA BRUXA — NOVA SOLICITAÇÃO DE CONSULTA",
    "",
    `Protocolo: ${record.protocol}`,
    `Consulta: ${name}`,
    `Valor registrado: ${currency(record.price_brl_cents_snapshot)}`,
    `Preferência: ${schedule}`,
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
  ].join("\n"):[
    `Olá, ${record.customer_name}.`,
    "",
    "Recebemos sua solicitação de consulta na Divina Bruxa.",
    "",
    `Protocolo: ${record.protocol}`,
    `Código privado de acompanhamento: ${trackingToken}`,
    `Consulta: ${name}`,
    `Valor registrado: ${currency(record.price_brl_cents_snapshot)}`,
    `Preferência: ${schedule}`,
    "",
    "Estado atual: Recebida",
    "A disponibilidade, o formato e o prazo final ainda serão confirmados pelo e-mail oficial.",
    "Nenhuma cobrança automática foi realizada.",
    "",
    "Para acompanhar, abra https://divinabruxa.com.br/#consultations e use o protocolo com o código privado.",
    "Não publique nem encaminhe esse código.",
    "",
    `Canal oficial: ${OPERATIONS_EMAIL}`
  ].join("\n");

  await recordEmail(admin,record,audience,recipient,"sending",{incrementAttempt:true});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(RESEND_ENDPOINT,{
      method:"POST",
      signal:controller.signal,
      headers:{
        "Authorization":`Bearer ${apiKey}`,
        "Content-Type":"application/json",
        "Idempotency-Key":`divina-consultation-${record.id}-${audience}-v188`
      },
      body:JSON.stringify({
        from:sender,
        to:[recipient],
        reply_to:isOwner?record.customer_email:OPERATIONS_EMAIL,
        subject,
        text:message
      })
    });
    if(!response.ok){
      const errorCode=`PROVIDER_HTTP_${response.status}`;
      await recordEmail(admin,record,audience,recipient,"failed",{errorCode});
      console.error("consultation email",{consultationId:record.id,audience,code:errorCode});
      return {status:"failed",accepted:false,delivered:false};
    }
    let providerMessageId="";
    try{providerMessageId=String((await response.json())?.id||"").slice(0,200);}catch{/* Aceitação HTTP basta para registrar accepted. */}
    const result=await recordEmail(admin,record,audience,recipient,"accepted",{providerMessageId});
    return {...notificationSummary(result),providerMessageId:Boolean(providerMessageId)};
  }catch(error){
    const errorCode=error instanceof DOMException&&error.name==="AbortError"?"PROVIDER_TIMEOUT":"PROVIDER_NETWORK_ERROR";
    await recordEmail(admin,record,audience,recipient,"failed",{errorCode});
    console.error("consultation email",{consultationId:record.id,audience,code:errorCode});
    return {status:"failed",accepted:false,delivered:false};
  }finally{clearTimeout(timer);}
}

async function rateLimit(admin:any,req:Request,serviceRole:string,action:string,limit:number){
  const fingerprint=await requestFingerprint(req,serviceRole);
  const {data,error}=await admin.rpc("consultation_rate_limit_server",{p_fingerprint:fingerprint,p_action:action,p_limit:limit});
  return {ok:!error&&data===true,error};
}

function mappedError(error:any){
  const message=String(error?.message||"");
  const mapped:[string,string,number][]=[
    ["hold_expired","HOLD_EXPIRED",409],
    ["hold_owner_mismatch","HOLD_EXPIRED",409],
    ["slot_unavailable","SLOT_UNAVAILABLE",409],
    ["submission_conflict","SUBMISSION_CONFLICT",409],
    ["service_mismatch","SERVICE_UNAVAILABLE",409],
    ["consent_required","CONSENT_REQUIRED",400],
    ["invalid_tracking_token","INVALID_TRACKING_TOKEN",400],
    ["invalid_preference","INVALID_PREFERENCE",400],
    ["invalid_phone","INVALID_PHONE",400],
    ["invalid_email","INVALID_EMAIL",400],
    ["invalid_context","INVALID_CONTEXT",400],
    ["invalid_name","INVALID_NAME",400],
    ["service_unavailable","SERVICE_UNAVAILABLE",409]
  ];
  return mapped.find(([needle])=>message.includes(needle))||["","SUBMIT_FAILED",400];
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
      rules:{weekdays:[1,2,3,4,5],morning:"08:00-12:00",afternoon:"13:00-18:00",slotMinutes:60,holdMinutes:15,minNoticeHours:4,maxDays:30,confirmationChannel:"email",realBilling:false,manualPreferencePersistence:true,privateTracking:true},
      notifications:{channel:"email",ownerEmail:OPERATIONS_EMAIL,providerConfigured:emailConfigured(),customerConfirmation:true,deliveryTracking:Boolean(env("RESEND_WEBHOOK_SECRET"))},
      publicStatuses:["received","awaiting_confirmation","confirmed","completed","cancelled"],
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
  const limitAction=action==="resend_confirmation"?"email":action;
  const limits:Record<string,number>={hold:12,submit:8,status:30,email:5};
  if(limits[limitAction]){
    const limited=await rateLimit(admin,req,serviceRole,limitAction,limits[limitAction]);
    if(limited.error)return out(req,{ok:false,code:"RATE_LIMIT_FAILED"},503);
    if(!limited.ok)return out(req,{ok:false,code:"RATE_LIMITED"},429,{"Retry-After":"3600"});
  }

  if(action==="hold"){
    const key=canonicalService(body?.serviceKey);
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
    const submissionId=String(body?.submissionId||"");
    const holdToken=String(body?.holdToken||"");
    const trackingToken=String(body?.trackingToken||"").trim();
    const key=canonicalService(body?.serviceKey);
    if(!UUID.test(submissionId)||!key||!TRACKING_TOKEN.test(trackingToken))return out(req,{ok:false,code:"INVALID_SUBMISSION"},400);
    if(holdToken&&!UUID.test(holdToken))return out(req,{ok:false,code:"INVALID_HOLD"},400);
    const period=canonicalPeriod(body?.preferredPeriod);
    if(!holdToken&&String(body?.preferredPeriod||"").trim()&&!period)return out(req,{ok:false,code:"INVALID_PREFERENCE"},400);

    const tokenHash=await sha256(trackingToken);
    const {data,error}=await admin.rpc("consultation_submit_server_v188",{
      p_hold_token:holdToken||null,
      p_submission_id:submissionId,
      p_user_id:user?.id||null,
      p_service_key:key,
      p_customer_name:String(body?.name||"").trim().slice(0,120),
      p_customer_email:String(body?.email||"").trim().slice(0,254),
      p_customer_phone:normalizePhone(body?.phone),
      p_question_context:String(body?.questionContext||"").trim().slice(0,3000),
      p_accept_terms:body?.acceptTerms===true,
      p_accept_privacy:body?.acceptPrivacy===true,
      p_accept_symbolic:body?.acceptSymbolic===true,
      p_tracking_token_hash:tokenHash,
      p_preferred_date:holdToken?null:normalizeDate(body?.preferredDate),
      p_preferred_period:holdToken?null:(period||"any"),
      p_marketing_opt_in:false
    });
    if(error){
      const [,code,status]=mappedError(error);
      return out(req,{ok:false,code},status as number);
    }

    const record=await consultationRecord(admin,String(data?.consultationId||""));
    if(!record||record.tracking_token_hash!==tokenHash)return out(req,{ok:false,code:"REQUEST_LOOKUP_FAILED"},503);
    const [owner,customer]=await Promise.all([
      sendEmail(admin,record,"owner",trackingToken),
      sendEmail(admin,record,"customer",trackingToken)
    ]);
    return out(req,{
      ok:true,
      ...data,
      publicStatus:publicStatus(record.status),
      preferenceLabel:preferenceLabel(record),
      notifications:{owner:notificationSummary(owner),customer:notificationSummary(customer)},
      rules:{realBilling:false},
      message:customer.accepted
        ?"Solicitação registrada e confirmação aceita pelo provedor de e-mail."
        :"Solicitação registrada. A confirmação por e-mail permanece pendente."
    });
  }

  if(action==="status"||action==="resend_confirmation"){
    const protocol=String(body?.protocol||"").trim().toUpperCase();
    const trackingToken=String(body?.trackingToken||"").trim();
    if(!PROTOCOL.test(protocol)||!TRACKING_TOKEN.test(trackingToken))return out(req,{ok:false,code:"TRACKING_NOT_FOUND"},404);
    const tokenHash=await sha256(trackingToken);
    const record=await trackedRecord(admin,protocol,tokenHash);
    if(!record)return out(req,{ok:false,code:"TRACKING_NOT_FOUND"},404);

    if(action==="resend_confirmation"){
      const customer=await sendEmail(admin,record,"customer",trackingToken);
      return out(req,{ok:true,protocol:record.protocol,notification:notificationSummary(customer)});
    }

    const [name,customerLedger]=await Promise.all([
      serviceName(admin,record.service_key),
      ledgerFor(admin,record.id,"customer")
    ]);
    const state=publicStatus(record.status);
    return out(req,{
      ok:true,
      request:{
        protocol:record.protocol,
        serviceId:record.service_key,
        serviceName:name,
        priceCents:record.price_brl_cents_snapshot,
        publicStatus:state.key,
        publicStatusLabel:state.label,
        preferenceLabel:preferenceLabel(record),
        createdAt:record.created_at,
        statusUpdatedAt:record.status_updated_at,
        paymentStatus:"not_started",
        realBilling:false
      },
      notification:notificationSummary(customerLedger)
    });
  }

  return out(req,{ok:false,code:"UNKNOWN_ACTION"},400);
});
