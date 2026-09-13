import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
let passed=0;
const failures=[];
const check=(condition,label,detail='')=>condition?passed++:failures.push(detail?`${label}:${detail}`:label);
const exists=file=>fs.existsSync(path.join(root,file));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const occurrences=(source,token)=>source.split(token).length-1;
const localTargets=html=>[...html.matchAll(/\b(?:href|src)=(?:"([^"]+)"|'([^']+)')/g)]
  .map(match=>(match[1]||match[2]||'').split(/[?#]/)[0])
  .filter(value=>value&&!/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|\/|#)/i.test(value)&&value!=='.'&&value!=='./')
  .map(value=>value.replace(/^\.\//,''));
const moduleTargets=source=>[...source.matchAll(/(?:from\s*|import\(\s*)['"](\.\.?\/[^'"?]+)(?:\?[^'"]*)?['"]/g)]
  .map(match=>match[1]);

const releaseFiles=[
  '00-INSTALE-V547-SEGURANCA-PRIVACIDADE-MATRIZ-FISICA.txt',
  'ARQUIVOS-V547-SHA256.txt','BACKUP-RESTORE-V547.md','BUILD-SECURITY-HEADERS-V547.mjs',
  'EVIDENCIA-STAGING-V547.json','MANIFESTO-V547-SEGURANCA-PRIVACIDADE-MATRIZ-FISICA.json',
  'MATRIZ-FISICA-V547.json','OPERACAO-SEGURANCA-PRIVACIDADE-V547.md',
  'QA-V547-SEGURANCA-PRIVACIDADE-MATRIZ-FISICA.md','ROLLBACK-SUPABASE-V547.sql',
  'ROLLBACK-V547-PARA-V546.txt','SECURITY-HEADERS-V547.json',
  'SUPABASE-ADVISORS-V547.json','SUPABASE-SEGURANCA-PRIVACIDADE-STAGING-V547.sql',
  'SUPABASE-V547-RATE-LIMIT-RUNTIME-FIX.sql','_headers',
  'admin-analytics-v322-edge-v547.ts','admin-media-v320-edge-v547.ts',
  'laboratorio-fisico-v547.css','laboratorio-fisico-v547.html','laboratorio-fisico-v547.js',
  'qa-v547-seguranca-privacidade-matriz.mjs','qa-v547-service-worker-runtime.mjs',
  'security-privacy-core-v547.css','security-privacy-core-v547.js'
];
for(const file of releaseFiles)check(exists(file),`release-file:${file}`);

const manifestFile='MANIFESTO-V547-SEGURANCA-PRIVACIDADE-MATRIZ-FISICA.json';
if(exists(manifestFile)){
  const manifest=JSON.parse(read(manifestFile));
  check(manifest.release==='V547','manifest:release');
  check(manifest.plan==='DIVINA BRUXA 3.0','manifest:plano');
  check(manifest.macro_stage==='13/14','manifest:macro');
  check(manifest.requires==='V546','manifest:pre-requisito');
  check(manifest.file_count===manifest.files.length,'manifest:contagem');
  check(manifest.files.length===new Set(manifest.files).size,'manifest:sem-duplicatas');
  for(const file of manifest.files)check(exists(file),`manifest:file:${file}`);
  const hashEntries=new Map(read('ARQUIVOS-V547-SHA256.txt').split(/\r?\n/)
    .map(line=>line.match(/^([a-f0-9]{64})  (.+)$/)).filter(Boolean).map(match=>[match[2],match[1]]));
  const hashed=manifest.files.filter(file=>file!=='ARQUIVOS-V547-SHA256.txt');
  check(hashEntries.size===hashed.length,'hash:contagem',`${hashEntries.size}/${hashed.length}`);
  for(const file of hashed){
    check(hashEntries.has(file),`hash:entrada:${file}`);
    const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
    check(hashEntries.get(file)===actual,`hash:valido:${file}`);
  }
}

const htmlFiles=fs.readdirSync(root).filter(name=>name.endsWith('.html')).sort();
check(htmlFiles.length===321,'html:321-paginas',String(htmlFiles.length));
for(const file of htmlFiles){
  const html=read(file);
  check(occurrences(html,'http-equiv="Content-Security-Policy"')===1,`${file}:csp-unica`);
  check(html.includes('default-src \'self\''),`${file}:csp-default-self`);
  check(html.includes("object-src 'none'"),`${file}:csp-object-none`);
  check(html.includes("base-uri 'self'"),`${file}:csp-base-self`);
  check(html.includes('name="referrer" content="strict-origin-when-cross-origin"'),`${file}:referrer`);
  check(html.includes('name="divina-security-release" content="V547"'),`${file}:release-seguranca`);
  check(!/\bjavascript:/i.test(html),`${file}:sem-javascript-url`);
  check(!/\b(?:href|src)=["']http:\/\//i.test(html),`${file}:sem-http-asset`);
  for(const match of html.matchAll(/<a\b([^>]*target=["']_blank["'][^>]*)>/gi)){
    check(/rel=["'][^"']*noopener/i.test(match[1]),`${file}:blank-noopener`);
    check(/rel=["'][^"']*noreferrer/i.test(match[1]),`${file}:blank-noreferrer`);
  }
  if(html.includes('manifest.webmanifest'))check(html.includes('manifest.webmanifest?v=547'),`${file}:manifest-v547`);
  for(const target of localTargets(html))check(exists(target),`${file}:referencia:${target}`);
}

const changedModules=[
  'app-v208.js','auth-client-v6.js','admin-policy.js','admin-engine.js','admin-staging-api-v145.js',
  'admin-media-v320-edge-v547.ts','admin-analytics-v322-edge-v547.ts','media-commerce-world-v320.js',
  'admin-intelligence-v322.js','page-loader-v1.js','owner-observatory-v532.js','privacy-center-v9.js',
  'security-privacy-core-v547.js','laboratorio-fisico-v547.js','pwa-world-v324.js','pwa-world-v196.js','sw.js'
];
for(const file of changedModules){
  check(exists(file),`modulo:${file}`);
  for(const target of moduleTargets(read(file))){
    const resolved=path.normalize(path.join(path.dirname(file),target));
    check(exists(resolved),`${file}:import:${target}`);
  }
}

const app=read('app-v208.js'),index=read('index.html'),sw=read('sw.js');
const pwa=read('pwa-world-v324.js'),compatibility=read('pwa-world-v196.js'),loader=read('page-loader-v1.js');
check(app.startsWith('/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 13/14 · V547'),'app:cabecalho-v547');
check(app.includes("createSecurityPrivacyCoreV547 } from './security-privacy-core-v547.js?v=547'"),'app:core-v547');
check(app.includes("release:'V547'"),'app:release-v547');
check(app.includes("currentMacroStage:'13-of-14'"),'app:macro-13');
check(app.includes('securityPrivacyPhysicalProfiles:9')&&app.includes('securityPrivacyPhysicalCases:59'),'app:matriz-9x59');
check(app.includes('securityPrivacyAutomaticPhysicalPasses:0'),'app:zero-passes-fisicos');
check(app.includes('securityPrivacyBackupAutomationVerified:false')&&app.includes('securityPrivacyRestoreVerified:false'),'app:continuidade-honesta');
check(app.includes('tarotFireRemoved:true')&&app.includes('canonicalTarotNormalOnly:true')&&app.includes('canonicalTarotNoRepeats:true'),'app:tarot-preservado');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'app:whit-local');
check(app.includes('identitySkinCount:30')&&app.includes('identityPaidSkinCount:29')&&app.includes('identitySkinsAlsoSoldIndividually:true'),'app:skins-preservadas');
check(index.includes('app-v208.js?v=547'),'index:app-v547');
check(index.includes("__divinaSWBootstrap='v547-inline'"),'index:bootstrap-v547');
check(index.includes("navigator.serviceWorker.register('./sw.js?v=547'"),'index:sw-v547');
check(sw.includes('const VERSION=547'),'sw:version-547');
for(const cache of ['shell','content','images','offline-core','premium-static'])check(sw.includes(`divina-bruxa-v547-${cache}`),`sw:cache:${cache}`);
check(sw.includes("'./security-privacy-core-v547.js'")&&sw.includes("'./laboratorio-fisico-v547.html'"),'sw:ativos-v547');
check(sw.includes('PRIVATE_ROUTE_PATTERN')&&sw.includes('isAuthorityRequest(request,url)'),'sw:autoridade-fora-cache');
check(sw.includes("response.headers.has('set-cookie')")&&sw.includes('no-store|private'),'sw:respostas-privadas-nao-cacheadas');
check(pwa.includes('const VERSION=547')&&pwa.includes("startsWith('v547')"),'pwa:version-547');
check(occurrences(pwa,'navigator.serviceWorker.register(')===1,'pwa:registro-unico');
check(!pwa.includes('setInterval(')&&!pwa.includes('MutationObserver'),'pwa:sem-loop-observer');
check(compatibility.includes("from './pwa-world-v324.js?v=547'"),'pwa:compatibilidade-v547');
check(!compatibility.includes('serviceWorker.register'),'pwa:sem-segundo-registro');
check(loader.startsWith('/* DIVINA BRUXA 3.0 — CARREGAMENTO V547'),'loader:v547');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=538-fluid')"),'loader:tarot-v517');
check(!loader.includes("import('./free-tarot-fire-engine-v345.js"),'loader:sem-engine-fogo');
check(loader.includes("import('./admin-engine.js?v=547')")&&loader.includes("import('./owner-observatory-v532.js?v=547')"),'loader:admin-v547');

const core=read('security-privacy-core-v547.js'),coreCss=read('security-privacy-core-v547.css');
for(const token of ['MutationObserver','setInterval(','requestAnimationFrame(','fetch(','localStorage','sessionStorage','indexedDB'])check(!core.includes(token),`core:sem-${token}`);
check(core.includes("macroStage:'13-of-14'"),'core:macro');
check(core.includes('analyticsRetentionDays:90'),'core:retencao-90');
check(core.includes('automaticPhysicalPasses:0'),'core:zero-passes-fisicos');
check(core.includes('admin-mfa-secret')&&core.includes('data-admin-mfa-qr')&&core.includes('data-recovery-codes'),'core:limpa-segredos-efemeros');
check(core.includes("rel.add('noopener')")&&core.includes("rel.add('noreferrer')"),'core:links-externos');
check(!coreCss.includes('@keyframes')&&!coreCss.includes('animation:'),'core-css:sem-animacao');

const lab=await import(pathToFileURL(path.join(root,'laboratorio-fisico-v547.js')).href+`?qa=${Date.now()}`);
const physicalContract=JSON.parse(read('MATRIZ-FISICA-V547.json'));
check(lab.PHYSICAL_PROFILES_V547.length===9,'matriz:9-perfis');
check(lab.PHYSICAL_CASES_V547.length===59,'matriz:59-casos');
check(new Set(lab.PHYSICAL_PROFILES_V547.map(item=>item.id)).size===9,'matriz:perfis-unicos');
check(new Set(lab.PHYSICAL_CASES_V547.map(item=>item.id)).size===59,'matriz:casos-unicos');
check(lab.PHYSICAL_MATRIX_CONTRACT_V547.automaticPasses===0,'matriz:zero-pass-automatico');
check(lab.PHYSICAL_MATRIX_CONTRACT_V547.networkRequests===0,'matriz:zero-rede');
check(physicalContract.truth.automaticPhysicalPasses===0&&physicalContract.truth.allProfilesInitialState==='not-run','matriz:estado-inicial-honesto');
check(physicalContract.gates.production===false&&physicalContract.gates.realBilling===false&&physicalContract.gates.finalOwnerReview===false,'matriz:portoes-fechados');
const labSource=read('laboratorio-fisico-v547.js'),labCss=read('laboratorio-fisico-v547.css'),labHtml=read('laboratorio-fisico-v547.html');
for(const token of ['fetch(','XMLHttpRequest','WebSocket','sendBeacon','MutationObserver','setInterval(','requestAnimationFrame('])check(!labSource.includes(token),`lab:sem-${token}`);
check(labSource.includes('rawUserAgent:false')&&labSource.includes('privateContent:false'),'lab:export-sanitizado');
check(labHtml.includes('0</b>passes inventados')&&labHtml.includes('SEM API'),'lab:verdade-visivel');
check(labHtml.includes('divina-orb-fast-v1.webp')&&!labHtml.includes('<canvas'),'lab:mesma-orbe-sem-motor');
check(!labCss.includes('@keyframes')&&!labCss.includes('animation:'),'lab-css:sem-animacao');

const configs=`${read('config-v199.js')}\n${read('config-v200.js')}`;
const auth=read('auth-client-v6.js'),policy=read('admin-policy.js'),admin=read('admin-engine.js');
const api=read('admin-staging-api-v145.js'),media=read('admin-media-v320-edge-v547.ts'),analytics=read('admin-analytics-v322-edge-v547.ts');
check(!configs.includes('adminUser')&&!configs.includes('Isis33'),'admin:sem-usuario-senha-fixos');
check(!/supabase_service_role_key\s*[:=]\s*['"][^'"]+/i.test(`${configs}\n${auth}\n${admin}`),'admin:sem-service-role-no-cliente');
check(auth.includes("'x-divina-admin-request': 'v547'")&&auth.includes("credentials: 'include'"),'admin:cliente-cookie-e-guard');
check(policy.includes('ownerOnly:true')&&policy.includes('verifiedEmailRequired:true')&&policy.includes('mfaRequired:true'),'admin:owner-email-mfa');
check(policy.includes('hashedServerAllowlist:true')&&policy.includes('transactionalRateLimit:true')&&policy.includes('atomicRecoveryCode:true'),'admin:protecoes-v547');
check(policy.includes('journalBodiesVisible:false')&&policy.includes('aiPromptsVisible:false')&&policy.includes('consultationQuestionsVisible:false'),'admin:conteudo-intimo-invisivel');
check((policy.match(/Object\.freeze\(\{id:/g)||[]).length===18,'admin:18-modulos');
check(admin.includes('form.elements.password.value=\'\'')&&admin.includes('form.elements.code.value=\'\'')&&admin.includes('form.elements.recoveryCode.value=\'\''),'admin:limpa-campos');
check(admin.includes('STEP-UP OBRIGATÓRIO')&&admin.includes('data-step-up-code'),'admin:step-up-precos');
for(const source of [api,media,analytics]){
  check(source.includes("claims.aal!=='aal2'"),`edge:aal2:${source===api?'api':source===media?'media':'analytics'}`);
  check(source.includes('email_confirmed_at'),`edge:email-verificado:${source===api?'api':source===media?'media':'analytics'}`);
  check(source.includes('consume_admin_request_budget_v547'),`edge:rate-limit:${source===api?'api':source===media?'media':'analytics'}`);
  check(source.includes("'cache-control':'no-store")||source.includes("'cache-control','no-store")||source.includes("'cache-control':'no-store, max-age=0'"),`edge:no-store:${source===api?'api':source===media?'media':'analytics'}`);
  check(source.includes("'x-frame-options':'DENY'")||source.includes("'x-frame-options','DENY'"),`edge:frame-deny:${source===api?'api':source===media?'media':'analytics'}`);
  check(source.includes('strict-transport-security'),`edge:hsts:${source===api?'api':source===media?'media':'analytics'}`);
}
check(api.includes('MAX_BODY_BYTES=16*1024'),'edge-api:limite-16kb');
check(media.includes('MAX_BODY_BYTES=32*1024'),'edge-media:limite-32kb');
check(api.includes('consume_admin_recovery_code_v547'),'edge-api:recovery-atomico');
check(api.includes('admin_continuity_snapshot_v547'),'edge-api:continuidade-agregada');
check(analytics.includes('privateContentIncluded:false'),'analytics:sem-conteudo-privado');
for(const flag of ['journalBodies:false','journalQuestions:false','aiPrompts:false','aiResponses:false','consultationQuestions:false','preciseLocation:false'])check(analytics.includes(flag),`analytics:${flag}`);

const sql=read('SUPABASE-SEGURANCA-PRIVACIDADE-STAGING-V547.sql'),fix=read('SUPABASE-V547-RATE-LIMIT-RUNTIME-FIX.sql');
check(sql.includes('force row level security'),'sql:force-rls');
check(sql.includes('private.admin_owner_allowlist_v547'),'sql:allowlist-privada');
check(sql.includes("extensions.digest")&&sql.includes("'sha256'"),'sql:allowlist-hash');
check(sql.includes('new.email_confirmed_at is null'),'sql:email-confirmado');
check(sql.includes('consume_admin_recovery_code_v547'),'sql:recovery-atomico');
check(sql.includes('consume_admin_request_budget_v547'),'sql:rate-transacional');
check(sql.includes('admin_continuity_snapshot_v547'),'sql:continuidade-agregada');
check(sql.includes("'privateRowsReturned', 0"),'sql:zero-linhas-privadas');
check(sql.includes('grant execute on function public.consume_admin_request_budget_v547(text,text,integer,integer) to service_role'),'sql:rate-service-only');
check(sql.includes('grant execute on function public.consume_admin_recovery_code_v547(uuid,text) to service_role'),'sql:recovery-service-only');
check(fix.includes('create or replace function public.consume_admin_request_budget_v547'),'sql:fix-idempotente');

const privacy=read('privacy-center-v9.js'),privacyHtml=read('privacidade-e-dados.html');
check(privacy.includes("POLICY_VERSION='privacy-v547-2026-09-13'"),'privacidade:politica-v547');
check(privacy.includes('analyticsRetentionDays:90'),'privacidade:retencao-90');
check(privacy.includes('analytics:false')&&privacy.includes('marketing:false'),'privacidade:opt-in-desligado');
check(privacy.includes('diaryBodyAccess:false')&&privacy.includes('silentPrivateReads:false'),'privacidade:sem-leitura-silenciosa');
check(privacyHtml.includes('até 90 dias')&&!privacyHtml.includes('180 dias'),'privacidade:pagina-90-dias');
check(privacyHtml.includes('Diário, perguntas e conversas não viram analytics'),'privacidade:promessa-visivel');
check(privacyHtml.includes('Exportação')&&privacyHtml.includes('Exclusão'),'privacidade:direitos');

const evidence=JSON.parse(read('EVIDENCIA-STAGING-V547.json'));
const advisors=JSON.parse(read('SUPABASE-ADVISORS-V547.json'));
check(evidence.database.activeOwners===0&&evidence.database.activeAllowlistHashes===1,'staging:owner-honesto');
check(evidence.continuity.reportedRuns===0&&evidence.continuity.verifiedRestores===0,'staging:restore-honesto');
check(evidence.edgeFunctions.every(item=>item.status==='ACTIVE'),'staging:edge-ativas');
check(evidence.negativeSessionProbes.every(item=>item.status===401&&item.error==='missing_session'),'staging:portoes-401');
check(advisors.security.error===0&&advisors.security.critical===0,'advisors:sem-erro-critico');
check(advisors.security.acceptedWarnings.length===2,'advisors:dois-warnings-revisados');
check(advisors.performance.authRlsInitPlanWarnings===0,'advisors:whit-initplan-resolvido');

const tarotSession=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+`?qa=${Date.now()}`);
const { CARDS }=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
let state=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v547',auditSeed:'qa-v547-seed'});
const revealed=[];
for(let index=0;index<78;index+=1){const result=tarotSession.drawNextCard(state,{now:()=>index+2});state=result.state;revealed.push(result.cardId);}
check(CARDS.length===78&&revealed.length===78,'regressao:tarot-78');
check(new Set(revealed).size===78,'regressao:tarot-sem-repeticao');
check(CARDS.every(card=>card.orientation==='normal'),'regressao:tarot-direto');
const activeTarot=read('tarot-livre-orbe-os-v517.js'),activeTarotCss=read('tarot-livre-orbe-os-v517.css');
check(!activeTarot.includes('CelestialFireBridge')&&!activeTarot.includes('free-tarot-fire-engine'),'regressao:tarot-sem-fogo');
check(!activeTarot.includes("getContext('webgl")&&!activeTarot.includes("getContext('webgl2"),'regressao:tarot-sem-webgl');
check(/\.tl517__effects[\s\S]{0,180}display:\s*none\s*!important/.test(activeTarotCss),'regressao:efeitos-canvas-ocultos');
check(activeTarot.includes('aria-colcount="6"'),'regressao:mesa-seis-colunas');

const skins=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
check(skins.SKINS_V6.length===30,'regressao:30-skins');
check(skins.SKINS_V6.filter(item=>item.individualPurchase).length===29,'regressao:29-skins-unitarias');
check(skins.SKINS_V6[0].priceCents===0,'regressao:classica-gratis');
check(skins.SKINS_V6.filter(item=>item.individualPurchase).every(item=>skins.SKIN_PRICE_TIERS_V542.includes(item.priceCents)&&item.premiumIncluded),'regressao:precos-e-premium');
const school=await import(pathToFileURL(path.join(root,'school-policy.js')).href+`?qa=${Date.now()}`);
check(school.SCHOOL_MODULES.length===17,'regressao:escola-17-modulos');
check(school.SCHOOL_LESSON_TOTAL===124,'regressao:escola-124-aulas');
const routes=await import(pathToFileURL(path.join(root,'route-registry-v180.js')).href+`?qa=${Date.now()}`);
check(routes.ROUTES_V180.length===17,'regressao:17-mundos');

const total=passed+failures.length;
console.log(`V547 QA estrutural: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
