import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const DELIVERY_ROOT=dirname(fileURLToPath(import.meta.url));
const SITE_ROOT=process.env.V202_SITE_ROOT||DELIVERY_ROOT;
const readDelivery=name=>readFileSync(join(DELIVERY_ROOT,name),'utf8');
const readSite=name=>readFileSync(join(SITE_ROOT,name),'utf8');
const shaBuffer=value=>createHash('sha256').update(value).digest('hex');
const sha=(root,name)=>shaBuffer(readFileSync(join(root,name)));
const passes=[],failures=[],warnings=[];
const check=(name,condition,severity='P1',detail='')=>{
  const item={name,severity,...(detail?{detail}:{})};
  (condition?passes:failures).push(item);
};

const manifest=JSON.parse(readDelivery('MANIFESTO-V202-RESEND-TRANSACIONAL.json'));
const contract=JSON.parse(readDelivery('RESEND-TRANSACTIONAL-V202.json'));
const templateCatalog=JSON.parse(readDelivery('EMAIL-TEMPLATES-V202.json'));
const sql=readDelivery('SUPABASE-RESEND-TRANSACTIONAL-STAGING-V202.sql');
const booking=readDelivery('consultations-booking-v202.ts');
const webhook=readDelivery('consultations-email-webhook-v202.ts');
const templatesSource=readDelivery('transactional-email-templates-v202.ts');
const index=readSite('index.html');

check('manifesto V202 sobre V201',manifest.version===202&&manifest.base_required==='V201 instalada','P0');
check('macroetapa Resend identificada',manifest.release==='plano-supremo-2.0-macroetapa-4-resend-transacional','P0');
check('delta plano, aditivo e sem exclusões',manifest.delivery.type==='flat-delta'&&manifest.delivery.directories_inside_zip===0&&manifest.delivery.delete_existing_files===false,'P0');
check('delta tem 11 arquivos',manifest.delivery.files.length===11,'P0',String(manifest.delivery.files.length));
check('delta sem duplicados',new Set(manifest.delivery.files).size===manifest.delivery.files.length,'P0');
for(const name of manifest.delivery.files){
  check(`delta presente: ${name}`,existsSync(join(DELIVERY_ROOT,name)),'P0');
  check(`delta não vazio: ${name}`,existsSync(join(DELIVERY_ROOT,name))&&statSync(join(DELIVERY_ROOT,name)).size>0,'P0');
  check(`delta plano: ${name}`,!name.includes('/')&&!name.includes('\\'),'P0');
}

check('ambiente STAGING',contract.environment==='staging'&&contract.project.ref==='kyphdsamyygavmkzyezr','P0');
check('auditoria registrou Resend conectado',contract.audit_observed_2026_09_10.resend_connected===true,'P0');
check('auditoria registrou zero domínios',contract.audit_observed_2026_09_10.resend_domains===0,'P0');
check('auditoria registrou zero templates remotos',contract.audit_observed_2026_09_10.resend_templates===0,'P0');
check('auditoria registrou zero webhooks remotos',contract.audit_observed_2026_09_10.resend_webhooks===0,'P0');
check('auditoria não inventa envio',contract.audit_observed_2026_09_10.emails_proven_sent===0&&contract.audit_observed_2026_09_10.provider_message_ids===0,'P0');
check('24 templates localizados',contract.prepared.localized_templates===24&&templateCatalog.templates.length*templateCatalog.locales.length===24,'P0');
check('ensaio SQL remoto registrado com rollback',contract.prepared.sql_trial==='pass-rolled-back','P0');
check('somente transacional, nunca marketing',templateCatalog.templates.every(item=>item.transactional===true&&item.marketing===false)&&contract.prepared.marketing_allowed===false,'P0');
check('PT-BR, EN e ES',templateCatalog.locales.join('/')==='pt-BR/en/es','P0');
check('oito finalidades exatas',new Set(templateCatalog.templates.map(item=>item.key)).size===8,'P0');

check('Clássica continua gratuita',contract.commercial_decision_preserved.classic_skin_free===true,'P0');
check('Premium 199,90 inclui 30 skins',contract.commercial_decision_preserved.premium_lifetime_price_brl_cents===19990&&contract.commercial_decision_preserved.premium_includes_all_30_skins===true,'P0');
check('venda avulsa de skins registrada',contract.commercial_decision_preserved.individual_skin_sales_required===true,'P0');
check('faixas avulsas 19,90/29,90/39,90/49,90',contract.commercial_decision_preserved.individual_skin_price_tiers_brl_cents.join('/')==='1990/2990/3990/4990','P0');
check('packs 79,90/99,90/129,90',contract.commercial_decision_preserved.skin_packs_brl_cents.join('/')==='7990/9990/12990','P0');
check('Orbe IA separada do Premium',contract.commercial_decision_preserved.orbe_ai_included_in_premium===false,'P0');
check('billing real permanece desligado',contract.commercial_decision_preserved.real_billing===false&&manifest.remote_actions.real_billing_changed===false,'P0');

check('migração transacional',/^--[\s\S]*\nbegin;[\s\S]*\ncommit;\s*$/i.test(sql),'P0');
for(const table of ['transactional_email_template_catalog_v202','transactional_email_suppressions_v202','transactional_email_webhook_events_v202']){
  check(`SQL cria ${table}`,sql.includes(`create table if not exists private.${table}`),'P0');
  check(`${table} usa RLS`,sql.includes(`alter table private.${table} enable row level security`),'P0');
  check(`${table} usa FORCE RLS`,sql.includes(`alter table private.${table} force row level security`),'P0');
  check(`${table} nega clientes`,new RegExp(`revoke all on table private\\.${table} from public,anon,authenticated`).test(sql),'P0');
}
check('catálogo SQL cobre 8 chaves',templateCatalog.templates.every(item=>sql.includes(`'${item.key}'`)),'P0');
check('catálogo SQL cruza 3 idiomas',/cross join \(values \('pt-BR'\),\('en'\),\('es'\)\)/.test(sql),'P0');
check('catálogo proíbe marketing',/check \(transactional=true and marketing=false\)/.test(sql),'P0');
check('ledger aceita ciclo completo',contract.prepared.webhook_events.every(event=>sql.includes(`'${event}'`)),'P0');
check('supressão usa SHA-256',/transactional_email_suppressions_v202[\s\S]*recipient_hash/.test(sql)&&/extensions\.digest\([^)]*'sha256'\)/.test(sql),'P0');
check('evento guarda hash do payload',/payload_sha256 text not null/.test(sql),'P0');
check('evento não guarda payload ou corpo bruto',!/\b(?:payload|body|html|text)_raw\b/.test(sql),'P0');
check('evento deduplica por chave primária',/event_id text primary key/.test(sql)&&/on conflict \(event_id\) do nothing/.test(sql),'P0');
check('funções negadas a clientes',/revoke all on function public\.transactional_email_event_server_v202[\s\S]*from public,anon,authenticated/.test(sql),'P0');
check('funções apenas para service role',/grant execute on function public\.transactional_email_event_server_v202[\s\S]*to service_role/.test(sql),'P0');
check('migração não contém segredo',!/(?:re_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9+/=_-]{16,}|service_role\s*[=:]\s*['"][A-Za-z0-9._-]{20,})/.test(sql),'P0');
check('migração não envia e-mail',!/api\.resend\.com|fetch\(|http_post|net\.http/i.test(sql),'P0');

check('booking V202 importa renderer',/renderTransactionalEmailV202/.test(booking)&&/transactional-email-templates-v202\.ts/.test(booking),'P0');
check('booking consulta supressão antes do envio',/transactional_email_is_suppressed_v202/.test(booking)&&/RECIPIENT_SUPPRESSED/.test(booking),'P0');
check('booking usa ledger V202',/consultation_email_record_server_v202/.test(booking)&&!/consultation_email_record_server_v188/.test(booking),'P0');
check('booking envia HTML e texto',/html:rendered\.html/.test(booking)&&/text:rendered\.text/.test(booking),'P0');
check('booking usa Idempotency-Key V202',/Idempotency-Key[^\n]*consultation\/\$\{record\.id\}\/\$\{audience\}\/v202/.test(booking),'P0');
check('booking tem timeout',/setTimeout\(\(\)=>controller\.abort\(\),8000\)/.test(booking),'P0');
check('booking mantém cobrança desligada',/realBilling:false/.test(booking),'P0');
check('booking usa somente contato oficial',booking.includes('orbedasrealidades@hotmail.com')&&!/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(booking),'P0');

for(const header of ['svix-id','svix-timestamp','svix-signature'])check(`webhook exige ${header}`,webhook.includes(`"${header}"`),'P0');
check('webhook verifica corpo bruto',/payload=await req\.text\(\)/.test(webhook),'P0');
check('webhook usa HMAC SHA-256',/name:"HMAC",hash:"SHA-256"/.test(webhook),'P0');
check('webhook compara em tempo constante',/difference\|=left\[index\]\^right\[index\]/.test(webhook),'P0');
check('webhook limita relógio a 300s',/MAX_CLOCK_SKEW_SECONDS=300/.test(webhook),'P0');
check('webhook limita corpo',/MAX_BODY_BYTES=100000/.test(webhook),'P0');
check('webhook permite somente eventos conhecidos',/ALLOWED_EVENTS/.test(webhook)&&contract.prepared.webhook_events.every(event=>webhook.includes(`"${event}"`)),'P0');
check('webhook persiste somente hash do payload',/p_payload_sha256:await sha256\(payload\)/.test(webhook),'P0');
check('webhook chama RPC V202',/transactional_email_event_server_v202/.test(webhook)&&!/consultation_email_event_server_v188/.test(webhook),'P0');
check('webhook não registra destinatário',!/console\.(?:log|error)\([^\n]*(?:recipient|email)/i.test(webhook),'P0');

const imported=await import(`${pathToFileURL(join(DELIVERY_ROOT,'transactional-email-templates-v202.ts')).href}?qa=${Date.now()}`);
const expectedKeys=templateCatalog.templates.map(item=>item.key);
check('renderer exporta as 8 chaves',imported.TRANSACTIONAL_TEMPLATE_KEYS_V202.join('/')===expectedKeys.join('/'),'P0');
for(const locale of templateCatalog.locales){
  for(const key of expectedKeys){
    const rendered=imported.renderTransactionalEmailV202(key,locale,{
      personName:'Pessoa <segura>',protocol:'DB-20260910-TESTE202',serviceName:'Carta de Conselho',
      amountLabel:'R$ 100,00',preferenceLabel:'A combinar',trackingCode:'CODIGO_PRIVADO_202',
      actionLabel:'Troca de senha',deviceLabel:'iPhone',dateLabel:'10/09/2026',
      receiptCode:'DBX-V202-TESTE',productName:'Premium',reasonLabel:'Teste',
      ticketCode:'SUP-V202-1',statusLabel:'Recebido',customerName:'Pessoa',
      customerEmail:'teste@example.invalid',customerPhone:'+55 27 99999-9999',
      questionContext:'Conteúdo <script>alert(1)</script>',actionUrl:'https://evil.example/phishing'
    });
    check(`render ${locale}/${key}: release`,rendered.release==='V202'&&rendered.locale===locale,'P0');
    check(`render ${locale}/${key}: subject`,rendered.subject.length>=8&&rendered.subject.length<=180,'P1');
    check(`render ${locale}/${key}: HTML completo`,/^<!DOCTYPE html><html/.test(rendered.html)&&/<table/.test(rendered.html)&&/<\/html>$/.test(rendered.html),'P0');
    check(`render ${locale}/${key}: texto puro`,rendered.text.length>=50&&!/<table|<script/i.test(rendered.text),'P0');
    check(`render ${locale}/${key}: HTML sem script`,!/<script|javascript:|onerror=/i.test(rendered.html),'P0');
    check(`render ${locale}/${key}: escapa entrada`,!rendered.html.includes('<segura>')&&!rendered.html.includes('<script>'),'P0');
    check(`render ${locale}/${key}: URL bloqueada`,!rendered.html.includes('evil.example')&&rendered.html.includes('https://divinabruxa.com.br/'),'P0');
  }
}
check('fonte usa layout de tabela e estilos inline',/<table width="100%"/.test(templatesSource)&&/style="/.test(templatesSource)&&!/<style>/.test(templatesSource),'P1');
check('fonte não permite HTML do cliente',/const esc =/.test(templatesSource)&&/untrusted_html_allowed/.test(JSON.stringify(templateCatalog)),'P0');

const homeStart=index.indexOf('<section id="home"');
const tarotStart=index.indexOf('<section id="tarot"');
const home=homeStart>=0&&tarotStart>homeStart?index.slice(homeStart,tarotStart):'';
check('Home identificada',home.length>0,'P0');
check('Home somente título e Orbe',/<h1>Orbe das<br>Realidades/.test(home)&&/id="orbCanvas"/.test(home)&&!/editorial-card|shop-portals|service-card/.test(home),'P0');
check('Home congelada desde V200',shaBuffer(home)==='31bfd1ab0460e3367cd0e88dfeea03b5638ef33f996bb1351a0557ed5537bea1','P0',shaBuffer(home));
const frozen={
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for(const [name,expected] of Object.entries(frozen))check(`congelado intacto: ${name}`,existsSync(join(SITE_ROOT,name))&&sha(SITE_ROOT,name)===expected,'P0');
check('escopo congela Home/Orbe/menu/Tarot/preços',manifest.scope.home_changed===false&&manifest.scope.orb_changed===false&&manifest.scope.menu_changed===false&&manifest.scope.tarot_changed===false&&manifest.scope.prices_changed===false,'P0');
check('nenhuma ação remota embutida',Object.values(manifest.remote_actions).every(value=>value===false),'P0');

for(const name of ['QA-V202-RESEND-TRANSACIONAL.mjs']){
  const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:readDelivery(name),encoding:'utf8',timeout:20000});
  check(`${name}: sintaxe`,result.status===0,'P0',result.stderr?.slice(-500)||'');
}
for(const name of manifest.delivery.files.filter(name=>extname(name)==='.json')){
  let valid=true;try{JSON.parse(readDelivery(name));}catch{valid=false;}
  check(`${name}: JSON válido`,valid,'P0');
}

const secrets=[/(?:re_|whsec_)[A-Za-z0-9+/=_-]{20,}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/];
const stableFiles=manifest.delivery.files.filter(name=>!['ARQUIVOS-V202-SHA256.txt','EVIDENCIA-QA-V202.json'].includes(name));
const deliveryText=stableFiles.map(readDelivery).join('\n');
check('delta sem segredo material',!secrets.some(pattern=>pattern.test(deliveryText)),'P0');
check('delta sem WhatsApp',!/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(deliveryText),'P0');
check('delta sem cobrança real',!/realBilling\s*[:=]\s*true|checkoutEnabled\s*[:=]\s*true/i.test(deliveryText),'P0');

const hashLines=readDelivery('ARQUIVOS-V202-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const hashes=new Map(hashLines.map(line=>{const match=line.match(/^([a-f0-9]{64})  (.+)$/);return match?[match[2],match[1]]:['',''];}));
check('checksums cobrem arquivos estáveis',stableFiles.every(name=>hashes.has(name))&&hashes.size===stableFiles.length,'P0');
for(const name of stableFiles)check(`checksum válido: ${name}`,hashes.get(name)===sha(DELIVERY_ROOT,name),'P0');

const legacy=spawnSync(process.execPath,[join(SITE_ROOT,'QA-V201-CONTA-REAL-CONTROLADA.mjs')],{cwd:SITE_ROOT,encoding:'utf8',timeout:240000});
const legacyOutput=`${legacy.stdout||''}\n${legacy.stderr||''}`;
check('regressão V201 preserva 350 checks',/350\/350 PASS/.test(legacyOutput)&&/P0=0 P1=0/.test(legacyOutput),'P0',legacyOutput.slice(-1200));

warnings.push('A migração V202 e as Edge Functions aguardam autorização remota específica para o STAGING.');
warnings.push('O Resend ainda não possui domínio, templates ou webhook; nenhum envio real foi comprovado.');
warnings.push('SPF/DKIM/DMARC exigem escolha de subdomínio e autorização separada para DNS.');
warnings.push('Cobrança real, produção, Stripe, lojas e Orbe IA Sol permanecem bloqueados.');
const p0=failures.filter(item=>item.severity==='P0').length;
const p1=failures.filter(item=>item.severity==='P1').length;
const evidence={
  project:'Divina Bruxa',version:202,
  suite:'Plano Supremo 2.0 - Macroetapa 4 - Resend Transacional',
  generated_at:new Date().toISOString(),total:passes.length+failures.length,passed:passes.length,failed:failures.length,
  gate:{p0,p1,package_approved:p0===0&&p1===0},
  templates:{keys:expectedKeys.length,locales:templateCatalog.locales.length,total:expectedKeys.length*templateCatalog.locales.length},
  webhook:{events:contract.prepared.webhook_events.length,signature:'HMAC-SHA256 raw body',deduplication:'svix-id',suppression:'sha256'},
  resend_audit:contract.audit_observed_2026_09_10,
  commercial_decision:contract.commercial_decision_preserved,
  home:{visible:['localized_orb_title','living_orb'],changed:false,sha256:shaBuffer(home)},
  remote_actions:manifest.remote_actions,warnings,failures
};
if(process.env.V202_QA_NO_WRITE!=='1')writeFileSync(join(DELIVERY_ROOT,'EVIDENCIA-QA-V202.json'),`${JSON.stringify(evidence,null,2)}\n`);
console.log(`DIVINA BRUXA V202 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log(`RESEND=PREPARED TEMPLATES=${expectedKeys.length*templateCatalog.locales.length} WEBHOOK=${contract.prepared.webhook_events.length} SEND=OFF`);
if(failures.length){
  for(const failure of failures)console.error(`[${failure.severity}] ${failure.name}${failure.detail?` :: ${failure.detail}`:''}`);
  process.exitCode=1;
}
