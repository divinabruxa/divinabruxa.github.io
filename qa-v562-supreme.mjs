/* DIVINA BRUXA 4.0 — QA SUPREMO V562
   Execução: node qa-v562-supreme.mjs /caminho/da/base-mesclada */

import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,normalize,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const packagedRoot=dirname(fileURLToPath(import.meta.url));
const root=resolve(process.argv[2]||packagedRoot);
const names=readdirSync(root).filter(name=>statSync(join(root,name)).isFile()).sort();
const read=file=>readFileSync(join(root,file),'utf8');
const checks=[];
const add=(area,id,pass,detail='',severity='P1')=>checks.push(Object.freeze({area,id,severity,state:pass?'PASS':'FAIL',detail}));
const count=(source,token)=>source.split(token).length-1;

const required=[
  'page-loader-v1.js','qa-supreme-launch-v562.js','app-v208.js','index.html',
  'manifest.webmanifest','sw.js','STAGING-QA-SUPREMO-V562.sql',
  'EVIDENCIA-STAGING-V562.json','qa-v562-loader-runtime.mjs',
  'qa-v562-service-worker-runtime.mjs','qa-v562-browser.mjs'
];
const missingRequired=required.filter(file=>!existsSync(join(root,file)));
add('release','required-files',missingRequired.length===0,missingRequired.length?missingRequired.join(', '):`${required.length}/${required.length} arquivos presentes`,'P0');

const jsFiles=names.filter(name=>/\.(?:js|mjs)$/.test(name));
const invalidJs=[];
for(const file of jsFiles){
  try{execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'ignore'});}
  catch{invalidJs.push(file);}
}
add('syntax','javascript',invalidJs.length===0,invalidJs.length?invalidJs.join(', '):`${jsFiles.length}/${jsFiles.length}`,'P0');

const tsFiles=names.filter(name=>name.endsWith('.ts'));
const invalidTs=[];
for(const file of tsFiles){
  try{execFileSync(process.execPath,['--experimental-strip-types','--check',file],{cwd:root,stdio:'ignore'});}
  catch{invalidTs.push(file);}
}
add('syntax','typescript',invalidTs.length===0,invalidTs.length?invalidTs.join(', '):`${tsFiles.length}/${tsFiles.length}`,'P0');

const jsonFiles=names.filter(name=>name.endsWith('.json')||name.endsWith('.webmanifest'));
const invalidJson=[];
for(const file of jsonFiles){try{JSON.parse(read(file));}catch{invalidJson.push(file);}}
add('syntax','json-and-webmanifest',invalidJson.length===0,invalidJson.length?invalidJson.join(', '):`${jsonFiles.length}/${jsonFiles.length}`,'P0');

const app=read('app-v208.js');
const index=read('index.html');
const sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const loader=read('page-loader-v1.js');
const qaCore=read('qa-supreme-launch-v562.js');
add('release','app-contract',app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 14/14 · V562')&&app.includes("release:'V562'")&&app.includes("currentMacroStage:'14-of-14'")&&app.includes('window.divinaQaSupremeLaunchReleaseV562'),'V562 · 14/14 · contrato conectado','P0');
add('release','loader-contract',app.includes("page-loader-v1.js?v=562-qa-supreme")&&loader.includes('loadModuleAfterStylesV562')&&!/const\s+\[[^\]]*\bmodule\b[^\]]*\]\s*=\s*await\s+Promise\.all/.test(loader),'módulo explícito em 13 carregadores','P0');
add('release','index-epoch',index.includes('app-v208.js?v=562')&&index.includes('manifest.webmanifest?v=562')&&index.includes("__divinaSWBootstrap='v562-inline'")&&index.includes("register('./sw.js?v=562'")&&index.includes('version:562'),'app, manifesto e SW alinhados','P0');
add('release','manifest-epoch',manifest.icons.every(icon=>icon.src.includes('?v=562'))&&manifest.shortcuts.every(shortcut=>shortcut.icons.every(icon=>icon.src.includes('?v=562'))),`${manifest.icons.length} ícones e ${manifest.shortcuts.length} atalhos`,'P1');
add('release','qa-privacy',qaCore.includes('privateContentReads:0')&&qaCore.includes('formValueReads:0')&&qaCore.includes('storageReads:0')&&qaCore.includes('apiCalls:0')&&!qaCore.includes('localStorage')&&!qaCore.includes('sessionStorage')&&!qaCore.includes('fetch('),'diagnóstico efêmero sem leitura privada','P0');
add('release','authority-closed',qaCore.includes('productionPublish:false')&&qaCore.includes('dnsChanges:false')&&qaCore.includes('realBilling:false')&&qaCore.includes('storeSubmission:false')&&qaCore.includes('sol:false')&&qaCore.includes("ownerApprovalState:'BLOCKED'"),'portões fechados','P0');

const routeModule=await import(`${pathToFileURL(join(root,'route-registry-v180.js')).href}?qa-v562=${Date.now()}`);
const expectedRoutes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
add('routes','canonical-17',routeModule.ROUTES_V180.length===17&&expectedRoutes.every((id,i)=>routeModule.ROUTES_V180[i]?.id===id),`${routeModule.ROUTES_V180.length}/17`,'P0');
const responsiveSource=read('responsive-enchantment-core-v533.js');
const staticRoutes=expectedRoutes.filter(id=>id!=='skins');
add('routes','dom-17',staticRoutes.every(id=>new RegExp(`<section\\b[^>]*\\bid="${id}"`).test(index))&&responsiveSource.includes("section.id='skins'")&&responsiveSource.includes("section.innerHTML='<p class=\"eyebrow\">SKINS"),'16 mundos estáticos + Skins restaurada antes da navegação','P0');
add('routes','canonical-orb',count(index,'id="orb"')===1&&count(index,'id="orbCanvas"')===1,'uma Orbe e um canvas','P0');

const tarot=await import(`${pathToFileURL(join(root,'tarot-data.js')).href}?qa-v562=${Date.now()}`);
const tarotSession=await import(`${pathToFileURL(join(root,'tarot-session.js')).href}?qa-v562=${Date.now()}`);
let tarotState=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v562',auditSeed:'qa-v562-seed'});
const revealed=[];
for(let i=0;i<78;i+=1){const result=tarotSession.drawNextCard(tarotState,{now:()=>i+2});tarotState=result.state;revealed.push(result.cardId);}
const afterDeck=tarotSession.drawNextCard(tarotState,{now:()=>100});
add('tarot','deck-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.id)).size===78&&tarot.CARDS.every(card=>card.orientation==='normal'),'78 cartas diretas e identidades únicas','P0');
add('tarot','no-repeat',revealed.length===78&&new Set(revealed).size===78&&afterDeck.cardId===null&&afterDeck.state.completed,'78 revelações sem 79ª carta','P0');

const daily=await import(`${pathToFileURL(join(root,'daily-policy-v303.js')).href}?qa-v562=${Date.now()}`);
const fixedDate=new Date('2026-09-14T15:00:00.000Z');
const identity={scope:'device',digest:'qa-v562-device'};
const dailyRecords=await Promise.all(Array.from({length:100},(_,i)=>Promise.resolve(daily.createDailyRecord(`intenção ${i}`,fixedDate,identity))));
add('daily','deterministic-100',new Set(dailyRecords.map(record=>record.id)).size===1&&dailyRecords.every(record=>record.date==='2026-09-14'&&record.orientation==='normal'&&record.reversed===false),'100 chamadas locais, uma identidade diária','P0');

const spreads=await import(`${pathToFileURL(join(root,'spreads-policy.js')).href}?qa-v562=${Date.now()}`);
add('spreads','catalog-15',spreads.SPREADS.length===15&&spreads.SPREADS.filter(item=>!item.premium).length===4&&spreads.SPREADS.filter(item=>item.premium).length===11,'15 total · 4 grátis · 11 Premium','P0');
add('spreads','royal-table',spreads.ROYAL_TABLE_COLUMNS===13&&spreads.ROYAL_TABLE_ROWS===6&&spreads.ROYAL_TABLE_COUNT===78,'13 × 6 = 78','P0');
add('spreads','celtic-cross',spreads.CELTIC_CROSS_POSITIONS.length===10,'10 posições','P1');

const skins=await import(`${pathToFileURL(join(root,'skin-catalog-v6.js')).href}?qa-v562=${Date.now()}`);
add('skins','catalog-30',skins.SKINS_V6.length===30&&skins.SKINS_V6.filter(item=>item.priceCents===0).length===1&&skins.SKINS_V6.filter(item=>item.individualPurchase).length===29,'30 total · 1 clássica grátis · 29 avulsas','P0');
const school=await import(`${pathToFileURL(join(root,'school-policy.js')).href}?qa-v562=${Date.now()}`);
add('school','curriculum',school.SCHOOL_MODULES.length===17&&school.SCHOOL_LESSON_TOTAL===124&&school.SCHOOL_CARD_TOTAL===78&&school.SCHOOL_THEORY_TOTAL===46,'17 módulos · 124 aulas','P0');

const designCss=read('page-design-supreme-v560.css');
add('accessibility','mobile-contract',designCss.includes('min-block-size: 44px')&&designCss.includes('font-size: 16px !important')&&designCss.includes('safe-area-inset-left')&&index.includes('interactive-widget=resizes-content'),'44px, 16px, safe area e teclado','P1');
add('accessibility','user-preferences',designCss.includes('@media (prefers-reduced-motion: reduce)')&&designCss.includes('@media (prefers-contrast: more)')&&designCss.includes('@media (forced-colors: active)'),'movimento, contraste e cores forçadas','P1');
add('accessibility','shell-semantics',index.includes('class="v562-skip-link" href="#app"')&&designCss.includes('.v562-skip-link:focus')&&index.includes('aria-live="polite"')&&index.includes('aria-atomic="true"')&&index.includes('lang="pt-BR"'),'atalho, foco, anúncios e idioma','P1');

const htmlFiles=names.filter(name=>name.endsWith('.html'));
const htmlSecurityIssues=[];
for(const file of htmlFiles){
  const html=read(file);
  if(count(html,'http-equiv="Content-Security-Policy"')!==1)htmlSecurityIssues.push(`${file}:csp`);
  if(!html.includes("default-src 'self'")||!html.includes("object-src 'none'")||!html.includes("base-uri 'self'"))htmlSecurityIssues.push(`${file}:directives`);
  if(!html.includes('name="referrer" content="strict-origin-when-cross-origin"'))htmlSecurityIssues.push(`${file}:referrer`);
  if(/\bjavascript:/i.test(html))htmlSecurityIssues.push(`${file}:javascript-url`);
  for(const match of html.matchAll(/<a\b([^>]*target=["']_blank["'][^>]*)>/gi)){
    if(!/rel=["'][^"']*noopener/i.test(match[1])||!/rel=["'][^"']*noreferrer/i.test(match[1]))htmlSecurityIssues.push(`${file}:blank-rel`);
  }
}
add('security','html-coverage',htmlSecurityIssues.length===0,htmlSecurityIssues.length?htmlSecurityIssues.slice(0,20).join(', '):`${htmlFiles.length}/${htmlFiles.length} HTML`,'P0');

const references=[];
const external=/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|#)/i;
const registerRef=(source,raw)=>{
  const value=String(raw||'').trim();
  if(!value||external.test(value)||value==='.'||value==='./')return;
  const bare=value.split(/[?#]/)[0];
  if(!bare)return;
  let decoded=bare;
  try{decoded=decodeURIComponent(bare);}catch{}
  const target=normalize(decoded.startsWith('/')?decoded.slice(1):join(dirname(source),decoded.replace(/^\.\//,'')));
  if(target.startsWith('..'))return;
  references.push({source,target});
};
for(const file of htmlFiles){for(const match of read(file).matchAll(/\b(?:href|src|poster|action)=(?:"([^"]+)"|'([^']+)')/gi))registerRef(file,match[1]||match[2]);}
for(const file of names.filter(name=>/\.(?:js|mjs|ts)$/.test(name))){for(const match of read(file).matchAll(/(?:from\s*|import\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g))registerRef(file,match[1]);}
for(const file of names.filter(name=>name.endsWith('.css'))){for(const match of read(file).matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi))registerRef(file,match[1]);}
for(const match of sw.matchAll(/["'](\.\/[^"']+)["']/g))registerRef('sw.js',match[1]);
for(const icon of [...manifest.icons,...manifest.shortcuts.flatMap(shortcut=>shortcut.icons||[])])registerRef('manifest.webmanifest',icon.src);
for(const shortcut of manifest.shortcuts)registerRef('manifest.webmanifest',shortcut.url);
const uniqueReferences=[...new Map(references.map(item=>[`${item.source}\0${item.target}`,item])).values()];
const missingReferences=uniqueReferences.filter(item=>!existsSync(join(root,item.target)));
add('references','local-assets',missingReferences.length===0,missingReferences.length?missingReferences.slice(0,30).map(item=>`${item.source} -> ${item.target}`).join(', '):`${uniqueReferences.length} referências resolvidas`,'P0');

const notFound=read('404.html');
add('404','recovery-page',notFound.includes('data-view="404"')&&notFound.includes('href="./index.html"')&&notFound.includes('href="./buscar.html"')&&notFound.includes('href="./tarot-livre.html"')&&notFound.includes('noindex,nofollow,noarchive'),'Home, Busca e Tarot disponíveis','P1');

add('pwa','versioned-caches',sw.includes('const VERSION=562')&&['shell','content','images','offline-core','premium-static'].every(cache=>sw.includes(`divina-bruxa-v562-${cache}`)),'cinco caches V562','P0');
add('pwa','atomic-shell',sw.includes("'./qa-supreme-launch-v562.js'")&&sw.includes("'./page-loader-v1.js'")&&sw.includes('/app-v208\\.js\\?v=562/'),'shell exige correção e recusa HTML antigo','P0');
add('pwa','offline-authority',sw.includes('PRIVATE_ROUTE_PATTERN')&&sw.includes('isAuthorityRequest(request,url)')&&sw.includes("request.headers.has('authorization')")&&sw.includes("request.cache==='no-store'")&&sw.includes("response.headers.has('set-cookie')"),'autoridade e sessão nunca entram no cache','P0');
add('pwa','offline-fallbacks',['offline.html','offline-en.html','offline-es.html'].every(file=>existsSync(join(root,file)))&&sw.includes('navigationPreload'),'três idiomas e preload','P1');

const commercial=await import(`${pathToFileURL(join(root,'commercial-truth-v200.js')).href}?qa-v562=${Date.now()}`);
const adminPolicy=read('admin-policy.js');
add('security','commercial-gates',commercial.COMMERCIAL_TRUTH_V200.environment==='staging'&&commercial.COMMERCIAL_TRUTH_V200.realBilling===false&&commercial.COMMERCIAL_TRUTH_V200.checkoutEnabled===false&&adminPolicy.includes('productionPublishAuthorized:false')&&adminPolicy.includes('dnsChangesAuthorized:false')&&adminPolicy.includes('orbeAISolEnabled:false'),'STAGING · billing/DNS/produção/Sol fechados','P0');

const clientSources=['app-v208.js','config-v200.js','auth-client-v201.js','admin-engine.js','commercial-truth-v200.js','page-loader-v1.js'].map(read).join('\n');
const secretPattern=/(?:sk_live_[A-Za-z0-9]{20,}|rk_live_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
add('security','no-client-secrets',!secretPattern.test(clientSources)&&!/supabase_service_role_key\s*[:=]\s*["'][^"']+/i.test(clientSources),'nenhum segredo reconhecível no cliente','P0');

const stripeWebhook=read('stripe-webhook-v204.ts');
add('billing','webhook-authenticity',stripeWebhook.includes('req.headers.get("stripe-signature")')&&stripeWebhook.includes('const raw=await req.text()')&&stripeWebhook.includes('constructEventAsync(raw,signature,secret'),'assinatura sobre corpo bruto','P0');
add('billing','webhook-idempotency',stripeWebhook.includes('stripe_webhook_ingest_v204')&&stripeWebhook.includes('p_event_id:event.id')&&stripeWebhook.includes('p_payload_sha256:await sha256(raw)'),'event ID e hash antes de aplicar','P0');

const aiSql=read('SUPABASE-ORBE-IA-STAGING-V190.sql');
const billingSql=read('SUPABASE-PREMIUM-BILLING-STAGING-V191.sql');
add('database','credit-concurrency-source',aiSql.includes('pg_advisory_xact_lock')&&aiSql.includes('for update')&&aiSql.includes('on conflict (request_id, reason, bucket) do nothing'),'locks e chave idempotente','P0');
add('database','sandbox-concurrency-source',billingSql.includes('for update')&&billingSql.includes('on conflict')&&billingSql.includes('billing_sandbox_commands_v191'),'comando transacional e idempotente','P0');
const auditSql=read('STAGING-QA-SUPREMO-V562.sql');
const executableSql=auditSql.replace(/--.*$/gm,'').replace(/'(?:''|[^'])*'/g,"''");
add('database','audit-read-only',/begin;[\s\S]*set local transaction read only;/.test(executableSql)&&/rollback;\s*$/.test(executableSql)&&!/^\s*(?:insert|update|delete|create|alter|drop|truncate|grant|revoke|do|call)\b/im.test(executableSql),'transação explicitamente read-only','P0');

const live=JSON.parse(read('EVIDENCIA-STAGING-V562.json'));
const db=live.supabase_read_only_audit;
add('staging','rls-live',db.public_tables===55&&db.public_tables_rls_enabled===55&&db.anon_writable_tables===0&&db.authenticated_writable_without_applicable_policy===0,'55/55 RLS · zero escrita anon · zero grant auth sem política','P0');
add('staging','advisors-live',db.security_advisor.error===0&&db.security_advisor.critical===0&&db.security_advisor.accepted_warnings.length===2&&db.security_advisor.accepted_warnings.every(item=>item.self_bound&&!item.uses_user_metadata&&item.search_path===''),'sem ERROR/CRITICAL; 2 WARN revisados','P1');
add('staging','guards-live',Object.values(db.idempotency_and_concurrency_guards).every(Boolean),'9/9 guardas presentes','P0');
add('staging','flags-live',Object.values(db.authority_flags).every(value=>value===false),'5/5 flags fechadas','P0');
add('staging','v561-backend-honesty',Object.entries(db.v561_backend).filter(([key])=>key!=='state').every(([,value])=>value===false)&&db.v561_backend.state.startsWith('BLOCKED'),'V561 SQL/Edge ainda não aplicados','P1');
add('staging','continuity-honesty',db.continuity.backup_runs===0&&db.continuity.verified_restores===0&&db.continuity.state==='BLOCKED'&&db.owner.active_owners===0&&db.owner.final_reviews===0,'zero evidência convertida em aprovação','P1');

const failures=checks.filter(check=>check.state==='FAIL');
const openP0=failures.filter(check=>check.severity==='P0').length;
const openP1=failures.filter(check=>check.severity==='P1').length;
const areas=Object.fromEntries([...new Set(checks.map(check=>check.area))].map(area=>{
  const list=checks.filter(check=>check.area===area);
  return[area,{passed:list.filter(check=>check.state==='PASS').length,failed:list.filter(check=>check.state==='FAIL').length,total:list.length}];
}));
const result={
  suite:'DIVINA-BRUXA-QA-SUPREMO-V562',
  state:failures.length?'FAIL':'PASS',
  root,
  summary:{passed:checks.length-failures.length,failed:failures.length,total:checks.length,openP0,openP1},
  inventory:{rootFiles:names.length,javascript:jsFiles.length,typescript:tsFiles.length,jsonAndWebmanifest:jsonFiles.length,html:htmlFiles.length,localReferences:uniqueReferences.length},
  areas,
  checks
};
console.log(JSON.stringify(result,null,2));
process.exitCode=failures.length?1:0;
