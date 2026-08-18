const OPENAI_URL="https://api.openai.com/v1/responses";
const STRIPE="https://api.stripe.com/v1";

const PLANS={
  premium:{persona:300,tarot:10,priceEnv:"STRIPE_PRICE_PREMIUM"},
  suprema:{persona:1000,tarot:40,priceEnv:"STRIPE_PRICE_SUPREMA"}
};

function cors(origin,env){
 const allowed=(env.ALLOWED_ORIGINS||"https://divinabruxa.com.br,https://divinabruxa.github.io").split(",").map(x=>x.trim()).filter(Boolean);
 return {"access-control-allow-origin":allowed.includes(origin)?origin:allowed[0],"access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,authorization","vary":"Origin"};
}
function json(data,status=200,origin="",env={}){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...cors(origin,env)}})}
function safe(v,n=5000){return String(v??"").replace(/\u0000/g,"").slice(0,n)}
function monthKey(){return new Date().toISOString().slice(0,7)}
function b64url(bytes){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function fromB64url(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function hmac(secret,data){let k=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return new Uint8Array(await crypto.subtle.sign("HMAC",k,new TextEncoder().encode(data)))}
async function tokenSign(env,payload){let body=b64url(new TextEncoder().encode(JSON.stringify(payload))),sig=b64url(await hmac(env.APP_TOKEN_SECRET,body));return body+"."+sig}
async function tokenVerify(env,t){
 try{let [b,s]=t.split(".");if(!b||!s)return null;let expected=await hmac(env.APP_TOKEN_SECRET,b),got=fromB64url(s);if(expected.length!==got.length)return null;let diff=0;for(let i=0;i<got.length;i++)diff|=expected[i]^got[i];if(diff)return null;let p=JSON.parse(new TextDecoder().decode(fromB64url(b)));if(p.exp&&Date.now()>p.exp)return null;return p}catch{return null}
}
async function auth(req,env){
 let h=req.headers.get("authorization")||"";if(!h.startsWith("Bearer "))return null;
 let p=await tokenVerify(env,h.slice(7));if(!p?.customer)return null;
 let row=await env.DB.prepare("SELECT customer_id,email,plan,status,current_period_end FROM subscriptions WHERE customer_id=?").bind(p.customer).first();
 if(!row||!["active","trialing"].includes(row.status))return null;
 return row;
}
async function stripe(env,path,params={},method="POST"){
 let body=new URLSearchParams();for(const [k,v] of Object.entries(params))if(v!==undefined&&v!==null)body.append(k,String(v));
 let r=await fetch(STRIPE+path,{method,headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,...(method==="POST"?{"Content-Type":"application/x-www-form-urlencoded"}:{})},body:method==="POST"?body:undefined});
 let d=await r.json();if(!r.ok)throw new Error(d?.error?.message||"Erro no pagamento");return d
}
async function checkout(req,env,origin){
 let p=await req.json(),plan=PLANS[p.plan];if(!plan)return json({error:"Plano inválido"},400,origin,env);
 let price=env[plan.priceEnv];if(!price)return json({error:"Preço Stripe ainda não configurado"},503,origin,env);
 let ret=safe(p.return_url,500)||"https://divinabruxa.com.br/";
 let s=await stripe(env,"/checkout/sessions",{
  mode:"subscription","line_items[0][price]":price,"line_items[0][quantity]":1,
  customer_email:safe(p.email,180),
  success_url:ret+(ret.includes("?")?"&":"?")+"session_id={CHECKOUT_SESSION_ID}",
  cancel_url:ret,
  "metadata[plan]":p.plan,
  "subscription_data[metadata][plan]":p.plan,
  allow_promotion_codes:"true"
 });
 return json({url:s.url},200,origin,env)
}
async function checkoutStatus(url,env,origin){
 let sid=url.searchParams.get("session_id");if(!sid)return json({error:"session_id ausente"},400,origin,env);
 let s=await stripe(env,"/checkout/sessions/"+encodeURIComponent(sid),{}, "GET");
 if(s.status!=="complete"||!s.customer)return json({error:"Pagamento ainda não concluído"},409,origin,env);
 let plan=s.metadata?.plan||"premium",email=s.customer_details?.email||s.customer_email||"";
 await env.DB.prepare(`INSERT INTO subscriptions(customer_id,email,plan,status,current_period_end,updated_at) VALUES(?,?,?,?,?,?)
 ON CONFLICT(customer_id) DO UPDATE SET email=excluded.email,plan=excluded.plan,status=excluded.status,updated_at=excluded.updated_at`)
 .bind(s.customer,email,plan,"active",null,Date.now()).run();
 let token=await tokenSign(env,{customer:s.customer,exp:Date.now()+1000*60*60*24*180});
 return json({token,plan},200,origin,env)
}
async function usage(env,customer){
 let m=monthKey(),row=await env.DB.prepare("SELECT persona_count,tarot_count FROM usage WHERE customer_id=? AND month=?").bind(customer,m).first();
 return {persona:row?.persona_count||0,tarot:row?.tarot_count||0}
}
async function consume(env,customer,kind){
 let m=monthKey(),col=kind==="tarot"?"tarot_count":"persona_count";
 await env.DB.prepare(`INSERT INTO usage(customer_id,month,persona_count,tarot_count) VALUES(?,?,0,0) ON CONFLICT(customer_id,month) DO NOTHING`).bind(customer,m).run();
 await env.DB.prepare(`UPDATE usage SET ${col}=${col}+1 WHERE customer_id=? AND month=?`).bind(customer,m).run()
}
async function me(req,env,origin){
 let u=await auth(req,env);if(!u)return json({error:"Não autenticado"},401,origin,env);
 let lim=PLANS[u.plan]||PLANS.premium,used=await usage(env,u.customer_id);
 return json({plan:u.plan,status:u.status,limits:{persona:lim.persona,tarot:lim.tarot},usage:used},200,origin,env)
}
async function portal(req,env,origin){
 let u=await auth(req,env);if(!u)return json({error:"Não autenticado"},401,origin,env);
 let s=await stripe(env,"/billing_portal/sessions",{customer:u.customer_id,return_url:"https://divinabruxa.com.br/"});
 return json({url:s.url},200,origin,env)
}
async function budgetSpent(env){let r=await env.DB.prepare("SELECT estimated_usd FROM ai_budget WHERE month=?").bind(monthKey()).first();return Number(r?.estimated_usd||0)}
async function budgetAdd(env,usd){let m=monthKey();await env.DB.prepare("INSERT INTO ai_budget(month,estimated_usd) VALUES(?,0) ON CONFLICT(month) DO NOTHING").bind(m).run();await env.DB.prepare("UPDATE ai_budget SET estimated_usd=estimated_usd+? WHERE month=?").bind(usd,m).run()}
function estimate(model,usage){
 let input=Number(usage?.input_tokens||0),output=Number(usage?.output_tokens||0);
 // Prices effective 2026-07-30: Luna $0.20/$1.20; Terra $2/$12 per 1M tokens.
 let rate=model.includes("terra")?[2,12]:[0.2,1.2];
 return input/1e6*rate[0]+output/1e6*rate[1]
}
function outputText(d){if(typeof d?.output_text==="string")return d.output_text;let a=[];for(const x of d?.output||[])for(const c of x?.content||[])if(c?.type==="output_text"&&typeof c.text==="string")a.push(c.text);return a.join("\n").trim()}
async function openai(env,model,instructions,input,max_output_tokens){
 let spent=await budgetSpent(env),cap=Number(env.MONTHLY_OPENAI_CAP_USD||20);if(spent>=cap)throw new Error("A cota mensal de IA da Orbe foi atingida. O Tarot local continua disponível.");
 let r=await fetch(OPENAI_URL,{method:"POST",headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model,instructions,input,max_output_tokens,store:false})});
 let d=await r.json();if(!r.ok)throw new Error(d?.error?.message||"Falha temporária da IA");
 await budgetAdd(env,estimate(model,d.usage));return outputText(d)
}
async function persona(req,env,origin){
 let u=await auth(req,env);if(!u)return json({error:"Assinatura necessária"},402,origin,env);
 let lim=PLANS[u.plan]||PLANS.premium,used=await usage(env,u.customer_id);if(used.persona>=lim.persona)return json({error:"Cota mensal de Persona IA atingida"},429,origin,env);
 let p=await req.json(),name=safe(p.name,80),history=Array.isArray(p.history)?p.history.slice(-14):[];
 let instructions=`Você é a Persona IA da Orbe das Realidades. É roleplay ficcional em primeira pessoa inspirado apenas no contexto fornecido. Nunca alegue ser a pessoa real, acessar alma, mente, telepatia, mensagens privadas ou sentimentos reais. Nome da persona: ${name}. Relação: ${safe(p.relation,80)}. Tom: ${safe(p.tone,40)}. Contexto: ${safe(p.intention,1200)}. Responda em português brasileiro natural, íntimo e contextual. Não repita avisos a cada turno porque a interface identifica a simulação. Não invente fatos privados de celebridades ou pessoas reais.`;
 let input=history.map(m=>({role:m.role==="assistant"||m.role==="oracle"?"assistant":"user",content:safe(m.text,1800)}));input.push({role:"user",content:safe(p.message,1800)});
 let reply=await openai(env,env.CHAT_MODEL||"gpt-5.6-luna",instructions,input,650);await consume(env,u.customer_id,"persona");return json({reply},200,origin,env)
}
async function tarot(req,env,origin){
 let u=await auth(req,env);if(!u)return json({error:"Assinatura necessária"},402,origin,env);
 let lim=PLANS[u.plan]||PLANS.premium,used=await usage(env,u.customer_id);if(used.tarot>=lim.tarot)return json({error:"Cota mensal de Tarot IA atingida"},429,origin,env);
 let p=await req.json(),cards=Array.isArray(p.cards)?p.cards.slice(0,10):[];
 let instructions=`Você é o motor de Tarot avançado da Orbe das Realidades. Faça análise simbólica extensa e específica, sem alegar previsão infalível ou leitura de pensamentos. Estruture: visão geral; carta por carta; relações e tensões; elementos/naipes/números; dimensão emocional; tendência temporal; sombra e pontos cegos; o que NÃO pode ser concluído; ação concreta; conclusão integrada; três perguntas finais. Pergunta: ${safe(p.intent,1200)}. Tiragem: ${safe(p.spread,80)}.`;
 let input=cards.map((c,i)=>`${i+1}. ${safe(c.position,100)} — ${safe(c.name,100)} — ${c.reversed?"invertida":"em pé"} — ${safe(c.keywords,350)}`).join("\n");
 let analysis=await openai(env,env.TAROT_MODEL||"gpt-5.6-terra",instructions,input,2200);await consume(env,u.customer_id,"tarot");return json({analysis},200,origin,env)
}
function hex(buf){return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("")}
async function verifyStripe(env,raw,header){
 let parts=Object.fromEntries(header.split(",").map(x=>x.split("=")));if(!parts.t||!parts.v1)return false;
 if(Math.abs(Date.now()/1000-Number(parts.t))>300)return false;
 let k=await crypto.subtle.importKey("raw",new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 let sig=hex(await crypto.subtle.sign("HMAC",k,new TextEncoder().encode(parts.t+"."+raw)));return sig===parts.v1
}
async function webhook(req,env){
 let raw=await req.text(),hdr=req.headers.get("stripe-signature")||"";if(!await verifyStripe(env,raw,hdr))return new Response("invalid signature",{status:400});
 let e=JSON.parse(raw),o=e.data?.object||{};
 if(e.type==="checkout.session.completed"&&o.customer){let plan=o.metadata?.plan||"premium",email=o.customer_details?.email||o.customer_email||"";await env.DB.prepare(`INSERT INTO subscriptions(customer_id,email,plan,status,current_period_end,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(customer_id) DO UPDATE SET email=excluded.email,plan=excluded.plan,status='active',updated_at=excluded.updated_at`).bind(o.customer,email,plan,"active",null,Date.now()).run()}
 if((e.type==="customer.subscription.updated"||e.type==="customer.subscription.deleted")&&o.customer){let plan=o.metadata?.plan||"premium";await env.DB.prepare(`INSERT INTO subscriptions(customer_id,email,plan,status,current_period_end,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(customer_id) DO UPDATE SET plan=excluded.plan,status=excluded.status,current_period_end=excluded.current_period_end,updated_at=excluded.updated_at`).bind(o.customer,"",plan,o.status||"canceled",o.current_period_end||null,Date.now()).run()}
 if(e.type==="invoice.payment_failed"&&o.customer){await env.DB.prepare("UPDATE subscriptions SET status='past_due',updated_at=? WHERE customer_id=?").bind(Date.now(),o.customer).run()}
 if(e.type==="invoice.paid"&&o.customer){await env.DB.prepare("UPDATE subscriptions SET status='active',updated_at=? WHERE customer_id=?").bind(Date.now(),o.customer).run()}
 return new Response("ok")
}
export default{async fetch(req,env){
 const origin=req.headers.get("origin")||"",url=new URL(req.url);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors(origin,env)});
 try{
  if(url.pathname==="/api/stripe-webhook"&&req.method==="POST")return webhook(req,env);
  if(url.pathname==="/health")return json({ok:true},200,origin,env);
  if(url.pathname==="/api/checkout"&&req.method==="POST")return checkout(req,env,origin);
  if(url.pathname==="/api/checkout-status"&&req.method==="GET")return checkoutStatus(url,env,origin);
  if(url.pathname==="/api/me"&&req.method==="GET")return me(req,env,origin);
  if(url.pathname==="/api/portal"&&req.method==="POST")return portal(req,env,origin);
  if(url.pathname==="/api/persona"&&req.method==="POST")return persona(req,env,origin);
  if(url.pathname==="/api/tarot"&&req.method==="POST")return tarot(req,env,origin);
  return json({error:"Not found"},404,origin,env)
 }catch(e){return json({error:e?.message||"Erro interno"},500,origin,env)}
}}
