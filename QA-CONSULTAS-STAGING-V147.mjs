import fs from 'node:fs';
import { ConsultationEngine } from './consultation-engine.js';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
const sources={
  policy:read('./consultation-policy.js'),
  engine:read('./consultation-engine.js'),
  css:read('./consultations-celestial-v1.css'),
  config:read('./config.js'),
  loader:read('./page-loader-v1.js'),
  app:read('./app.js'),
  commerce:read('./commerce-engine.js'),
  admin:read('./admin-engine.js'),
  html:read('./index.html'),
  sw:read('./sw.js'),
  sql:read('./SUPABASE-CONSULTAS-STAGING-V147.sql'),
  edge:read('./consultations-booking-v147.ts'),
  rate:read('./SUPABASE-CONSULTAS-STAGING-V147-RATE-LIMIT.sql'),
  catalogRpc:read('./SUPABASE-CONSULTAS-STAGING-V147-CATALOG-RPC.sql')
};

const expectedPrices={
  'mesa-real-profissional':25000,
  'leitura-mentes':15000,
  'carta-conselho':10000,
  'pergunta-direta':5000
};

const balanced=(source,open,close)=>{
  let depth=0;
  for(const character of source){
    if(character===open)depth+=1;
    if(character===close)depth-=1;
    if(depth<0)return false;
  }
  return depth===0;
};

const mockRoot={
  html:'',
  onclick:null,
  set innerHTML(value){this.html=value;},
  get innerHTML(){return this.html;},
  querySelectorAll(){return [];},
  querySelector(){return null;}
};
const renderEngine=new ConsultationEngine(mockRoot,{});
const renderedStates={services:mockRoot.html};
renderEngine.selected='pergunta-direta';
renderEngine.draft={serviceId:'pergunta-direta',preferredDate:'2026-09-10',preferredPeriod:'Tarde'};
renderEngine.step='schedule';renderEngine.render();renderedStates.schedule=mockRoot.html;
renderEngine.step='details';renderEngine.render();renderedStates.details=mockRoot.html;
renderEngine.pendingPayload={id:'14700000-0000-4000-8000-000000000147',serviceId:'pergunta-direta',customer:{name:'Teste V147',email:'teste@example.invalid',phone:'(11) 99999-9999'},preference:{slotStartAt:'',preferredDate:'2026-09-10',preferredPeriod:'Tarde'},question:'Contexto simbólico de teste.',price_snapshot:{priceCents:5000,priceTableVersion:'consultas-2026-09-05-v147'}};
renderEngine.step='review';renderEngine.render();renderedStates.review=mockRoot.html;
renderEngine.success={mode:'staging-api',id:renderEngine.pendingPayload.id,protocol:'DB-TESTE-V147',serviceId:'pergunta-direta',serviceName:'Pergunta Direta',priceCents:5000,scheduleLabel:'10/09/2026 · Tarde'};
renderEngine.step='success';renderEngine.render();renderedStates.success=mockRoot.html;

const checks={
  fourCanonicalServices:Object.keys(expectedPrices).every(id=>sources.policy.includes(`id:'${id}'`))&&(sources.policy.match(/\bid:'/g)||[]).length===4,
  exactOfficialPrices:Object.entries(expectedPrices).every(([id,cents])=>sources.policy.includes(`id:'${id}'`)&&sources.policy.includes(`priceCents:${cents}`)),
  emailOnly:sources.policy.includes("channels:Object.freeze(['email'])")&&sources.policy.includes("contactEmail:'orbedasrealidades@hotmail.com'")&&!/whatsapp/i.test(sources.engine),
  billingRemainsOff:sources.policy.includes('realBilling:false')&&sources.engine.includes("payload?.rules?.realBilling!==false")&&sources.edge.includes('realBilling:false'),
  stagingEndpoint:sources.config.includes("consultationsApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/consultations-booking'"),
  loaderUsesV147:sources.loader.includes("consultation-engine.js?v=147")&&sources.loader.includes("new ConsultationEngine($('#consultationApp'), config)"),
  fourStepJourney:['services','schedule','details','review','success'].every(step=>sources.engine.includes(step)),
  renderAllStates:renderedStates.services.includes('Pergunta Direta')&&renderedStates.schedule.includes('Data preferida')&&renderedStates.details.includes('acceptSymbolic')&&renderedStates.review.includes('VALOR PRESERVADO')&&renderedStates.success.includes('DB-TESTE-V147'),
  onlineAndEmailFallback:sources.engine.includes("action:'hold'")&&sources.engine.includes("action:'submit'")&&sources.engine.includes('data-email-fallback')&&sources.engine.includes('mailto:'),
  threeExplicitConsents:['acceptTerms','acceptPrivacy','acceptSymbolic'].every(name=>sources.engine.includes(`name=\"${name}\"`)),
  symbolicBoundary:sources.engine.includes('não substitui orientação médica, psicológica, jurídica ou financeira'),
  priceSnapshot:sources.engine.includes('consultationPriceSnapshot(service,this.catalogVersion)')&&sources.policy.includes('capturedAt:new Date().toISOString()'),
  sanitizedLocalHistory:/const record=\{id:payload\.id,protocol,[^}]+price_snapshot:[^}]+status:/.test(sources.engine)&&!sources.engine.includes("record={...payload"),
  mobileFormSafety:sources.css.includes('font-size: 1rem;')&&sources.css.includes('env(safe-area-inset-bottom)')&&sources.css.includes('@media (max-width: 640px)'),
  reducedMotion:sources.css.includes('@media (prefers-reduced-motion: reduce)'),
  forcedColors:sources.css.includes('@media (forced-colors: active)'),
  cssBracesBalanced:balanced(sources.css,'{','}'),
  canonicalDatabaseRows:Object.entries(expectedPrices).every(([id,cents])=>sources.sql.includes(`'${id}'`)&&sources.sql.includes(String(cents))),
  noWhatsappDelivery:sources.sql.includes("delivery_method='email'")&&sources.sql.includes("true,'email'"),
  adminPriceBridge:sources.sql.includes('admin_apply_consultation_prices_v146')&&Object.keys(expectedPrices).every(id=>sources.sql.includes(id)),
  edgeOriginGuard:sources.edge.includes('originAllowed')&&sources.edge.includes('ORIGIN_FORBIDDEN')&&sources.edge.includes('MAX_BODY_BYTES=12000'),
  edgeRateLimit:sources.edge.includes('requestFingerprint')&&sources.edge.includes('consultation_rate_limit_server')&&sources.edge.includes('RATE_LIMITED'),
  hashedLimitedRetention:sources.rate.includes("fingerprint ~ '^[0-9a-f]{64}$'")&&sources.rate.includes("interval '48 hours'")&&sources.rate.includes('force row level security'),
  atomicCatalogRpc:sources.edge.includes('consultation_catalog_server')&&sources.catalogRpc.includes('consultation_catalog_server')&&sources.catalogRpc.includes("'realBilling',false"),
  edgeIdempotency:sources.edge.includes('.eq("submission_id",submissionId).maybeSingle()')&&sources.edge.includes('idempotent:true'),
  edgeNoMarketing:sources.edge.includes('p_marketing_opt_in:false'),
  noClientSecrets:!sources.config.includes('SUPABASE_SERVICE_ROLE_KEY')&&!sources.engine.includes('SUPABASE_SERVICE_ROLE_KEY'),
  commerceDoesNotOverwrite:sources.commerce.includes('if(!config.consultationsApiBase)this.renderConsultations()'),
  adminReadsV147:sources.admin.includes("consultation-requests-v147")&&sources.admin.includes("consultation-policy.js?v=147"),
  cacheBumped:sources.sw.includes("divina-bruxa-v42-consultas-staging-v147"),
  versionBusted:sources.html.includes('app.js?v=147')&&sources.html.includes('consultations-celestial-v1.css?v=147'),
  approvedCoreStillPresent:sources.html.includes('id="orb"')&&sources.html.includes('class="magic-dock"')&&sources.html.includes('class="drawer magic-menu"')
};

for(const [name,passed] of Object.entries(checks))console.log(`${passed?'PASS':'FAIL'} ${name}`);
if(Object.values(checks).some(passed=>!passed))process.exit(1);
console.log(`PASS ${Object.keys(checks).length}/${Object.keys(checks).length} — CONSULTAS STAGING V147`);
