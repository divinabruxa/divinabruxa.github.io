import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);

const required=[
  'commercial-truth-v200.js','consultation-policy.js','consultation-engine.js',
  'account-consultations-world-v319.js','admin-engine.js','admin-staging-api-v145.js',
  'consultations-supreme-v558.css','SUPABASE-CONSULTAS-SUPREMAS-V558.sql',
  'consultas-de-tarot.html','tarot-consultations.html','consultas-tarot.html',
  'international-consultations-v195.js','app-v208.js','page-loader-v1.js',
  'index.html','manifest.webmanifest','pwa-world-v324.js','sw.js'
];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`arquivo:${file}`));

const truth=await import(pathToFileURL(path.join(root,'commercial-truth-v200.js')).href+`?qa=${Date.now()}`);
const services=truth.COMMERCIAL_TRUTH_V200.services;
check(services.length===4,'catalogo:quatro-servicos');
check(services.map(item=>item.priceCents).join(',')==='25000,20000,15000,5000','catalogo:precos-v558');
check(services.map(item=>item.name).join('|')==='Mesa Real Profissional|Leitura de Mente|Carta de Conselho|Pergunta','catalogo:nomes-v558');
check(truth.COMMERCIAL_TRUTH_V200.consultationPriceTableVersion==='consultas-2026-09-13-v558','catalogo:versao');
check(truth.assertCommercialTruthV200()===true,'catalogo:asserção');

const policy=await import(pathToFileURL(path.join(root,'consultation-policy.js')).href+`?qa=${Date.now()}`);
const snap=policy.consultationPriceSnapshot(services[1]);
check(policy.CONSULTATION_POLICY.release==='V558'&&policy.CONSULTATION_POLICY.schemaVersion==='11.0.0','politica:v558');
check(snap.priceCents===20000&&snap.price===200&&snap.currency==='BRL','snapshot:valor-imutavel');
check(typeof snap.capturedAt==='string'&&snap.priceTableVersion==='consultas-2026-09-13-v558','snapshot:versao-e-data');
check(policy.CONSULTATION_POLICY.contactEmail==='orbedasrealidades@hotmail.com','email:operacional');
check(policy.CONSULTATION_POLICY.phoneRequired===true&&policy.CONSULTATION_POLICY.channels.join(',')==='email','contato:campos-e-canal');
check(policy.CONSULTATION_POLICY.realBilling===false&&policy.CONSULTATION_POLICY.includedInPremium===false,'verdade:sem-cobranca-ou-premium');

const engine=read('consultation-engine.js');
check(engine.includes("const CATALOG_KEY='consultation-catalog-v558'"),'cache:catalogo-novo');
check(engine.includes("price_snapshot:consultationPriceSnapshot(service,this.catalogVersion)"),'pedido:price-snapshot');
check(engine.includes("name:clean(this.draft.name)")&&engine.includes("email:clean(this.draft.email)")&&engine.includes("phone:clean(this.draft.phone)"),'pedido:contatos');
check(engine.includes("question:clean(this.draft.question).slice(0,3000)"),'pedido:contexto-limitado');
check(engine.includes("marketing:false")&&engine.includes("marketingOptIn:false"),'privacidade:marketing-negado');
check(engine.includes("REGISTRAR E PREPARAR E-MAIL")&&engine.includes("setTimeout(()=>this.openRegisteredEmail(),0)"),'email:fallback-automatico');
check(engine.includes("customerAccepted&&ownerAccepted")&&engine.includes("Aceito pelo provedor"),'email:status-verificavel');
check(engine.includes("behavior:'auto'")&&!engine.includes("behavior:reducedMotion()?'auto':'smooth'"),'fluidez:rolagem-imediata');
check(engine.includes('Nenhuma cobrança automática foi realizada.'),'verdade:sem-checkout');

const world=read('account-consultations-world-v319.js');
check(!world.includes("!==COMMERCIAL_TRUTH_V200.consultationPriceTableVersion"),'admin:nao-rejeita-versao-futura');
check(world.includes('remoteAdminPricesAccepted:true')&&world.includes('historicalPriceSnapshots:true'),'admin:catalogo-governado');
check(world.includes('Mesa Real R$250 · Leitura de Mente R$200 · Carta de Conselho R$150 · Pergunta R$50'),'mundo:precos-visiveis');

const admin=read('admin-engine.js'),api=read('admin-staging-api-v145.js');
check(admin.includes('Pedidos antigos mantêm o price_snapshot original.'),'admin:explica-historico');
check(admin.includes('ALTERAÇÃO CRÍTICA · EXIGE MFA')&&admin.includes('Código MFA atual'),'admin:mfa-visivel');
check(api.includes("decodeJwt(verified.data?.session?.access_token).aal!=='aal2'")&&api.includes("admin_apply_consultation_prices_v146"),'admin:mfa-backend');

const sql=read('SUPABASE-CONSULTAS-SUPREMAS-V558.sql');
check(sql.includes('25000')&&sql.includes('20000')&&sql.includes('15000')&&sql.includes('5000'),'sql:precos');
check(sql.includes('drop constraint if exists consultation_services_commercial_v200_check'),'sql:remove-trava-antiga');
check(sql.includes('terms_version=excluded.terms_version')&&sql.includes("p_version !~ '^consultas-[0-9]{14}-v146$'"),'sql:versao-administravel');
check(sql.includes('consultation_price_versions')&&sql.includes('admin_owners'),'sql:historico-e-owner');
check(sql.includes('revoke all on function public.admin_apply_consultation_prices_v146')&&sql.includes('grant execute')&&sql.includes('service_role'),'sql:menor-privilegio');
check(sql.includes('priceTableVersion')&&sql.includes('price_brl_cents'),'sql:catalogo-servidor');

const css=read('consultations-supreme-v558.css');
check(!/animation\s*:[^;{}]*infinite/i.test(css),'visual:zero-loop-infinito');
check(css.includes('backdrop-filter:none!important')&&css.includes('filter:none!important'),'visual:sem-blur-pesado');
check(css.includes('content-visibility:auto')&&css.includes('contain-intrinsic-size'),'fluidez:pintura-diferida');
check(css.includes('@media(max-width:430px)')&&css.includes('min-height:48px'),'iphone:toque-e-layout');
check(css.includes('@media(prefers-reduced-motion:reduce)'),'acessibilidade:movimento-reduzido');

const pt=read('consultas-de-tarot.html'),en=read('tarot-consultations.html'),es=read('consultas-tarot.html'),intl=read('international-consultations-v195.js');
for(const [name,source] of [['pt',pt],['en',en],['es',es]]){
  for(const amount of ['R$ 250','R$ 200','R$ 150','R$ 50'])check(source.includes(amount),`seo:${name}:${amount}`);
  check(!source.includes('R$ 500')&&!source.includes('R$ 300')&&!source.includes('R$ 100'),`seo:${name}:sem-preco-antigo`);
}
check(en.includes('name="phone"')&&es.includes('name="phone"'),'internacional:telefone-obrigatorio');
check(intl.includes("copy.labels.phone")&&intl.includes("data.get('phone')"),'internacional:telefone-no-email');

const index=read('index.html'),app=read('app-v208.js'),loader=read('page-loader-v1.js'),sw=read('sw.js'),pwa=read('pwa-world-v324.js'),manifest=read('manifest.webmanifest');
check(index.includes('consultations-supreme-v558.css?v=558')&&index.includes('app-v208.js?v=558'),'release:index');
check(index.includes('Leitura de Mente<small>R$ 200')&&index.includes('Carta de Conselho<small>R$ 150'),'home:precos');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 10/14 · V558'),'release:app');
check(app.includes('window.divinaConsultationsReleaseV558')&&app.includes("currentMacroStage:'10-of-14'"),'release:contrato');
check(loader.includes('consultations-supreme-v558.css?v=558')&&loader.includes('v=558-consultations-supreme'),'release:loader');
check(sw.includes('const VERSION=558')&&sw.includes('divina-bruxa-v558-shell')&&sw.includes("'./consultations-supreme-v558.css'"),'release:sw');
check(pwa.includes('const VERSION=558')&&manifest.includes('?v=558'),'release:pwa-manifest');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:321-paginas');

const total=passed+failures.length;
console.log(`V558 Consultas Supremas: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
