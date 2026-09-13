import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
let passed=0;const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const files=['completion-center-v548.js','completion-center-v548.css','SUPABASE-CONCLUSAO-STAGING-V548.sql','ROLLBACK-SUPABASE-V548.sql','admin-staging-api-v145.js','auth-client-v6.js','admin-engine.js','admin-policy.js','owner-observatory-v532.js','owner-observatory-v532.css','page-loader-v1.js','app-v208.js','pwa-world-v324.js','pwa-world-v196.js','sw.js','manifest.webmanifest','index.html'];
for(const file of files)check(exists(file),`arquivo:${file}`);

const app=read('app-v208.js'),loader=read('page-loader-v1.js'),sw=read('sw.js'),index=read('index.html');
const completion=read('completion-center-v548.js'),completionCss=read('completion-center-v548.css');
const api=read('admin-staging-api-v145.js'),auth=read('auth-client-v6.js'),sql=read('SUPABASE-CONCLUSAO-STAGING-V548.sql');
check(app.startsWith('/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 14/14 · V548'),'app:release');
check(app.includes("release:'V548'")&&app.includes("currentMacroStage:'14-of-14'"),'app:macro-final');
check(app.includes("completionCenter:'v548'")&&app.includes('completionReadyToAdminister:false'),'app:conclusao-honesta');
check(index.includes('app-v208.js?v=548')&&index.includes('sw.js?v=548')&&index.includes('manifest.webmanifest?v=548'),'index:corte-v548');
check(sw.includes('const VERSION=548')&&sw.includes('divina-bruxa-v548-shell'),'sw:corte-v548');
check(sw.includes("'./completion-center-v548.js'")&&sw.includes("'./completion-center-v548.css'"),'sw:central');
check(loader.includes("import('./completion-center-v548.js?v=548')")&&loader.includes('createCompletionCenterV548'),'loader:admin-lazy');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=538-fluid')")&&!loader.includes("import('./free-tarot-fire-engine-v345.js"),'tarot:sem-fogo-no-loader');
check(!completion.includes('setInterval(')&&!completion.includes('requestAnimationFrame(')&&!completion.includes('MutationObserver'),'central:sem-loop-observer');
check(!completionCss.includes('@keyframes')&&!completionCss.includes('animation:'),'central-css:sem-animacao');
check(completion.includes('expectedEvaluations:EXPECTED')&&completion.includes('automaticPhysicalPasses:0'),'central:zero-pass-inventado');
check(completion.includes('rawMatrixUpload:false')&&completion.includes('privateContentReads:0'),'central:privacidade');
check(auth.includes("'x-divina-admin-request': 'v548'")&&auth.includes('adminRecordFinalReview'),'auth:contrato-v548');
check(api.includes("const RELEASE='V548'")&&api.includes("path==='/admin/final-readiness'")&&api.includes("path==='/admin/final-review'"),'api:rotas-finais');
check(api.includes('verifyStepUp(context,code')&&api.includes("claims.aal!=='aal2'"),'api:aal2-step-up');
check(api.includes('evidenceHash')&&!api.includes('deviceFacts'),'api:sem-dados-aparelho');
check(sql.includes('private.owner_final_reviews_v548')&&sql.includes('force row level security'),'sql:cofre-privado');
check(sql.includes('grant execute on function public.admin_final_readiness_v548(uuid) to service_role')&&sql.includes('grant execute on function public.record_owner_final_review_v548(uuid,text,integer,integer,integer,integer,integer) to service_role'),'sql:service-only');
check(sql.includes("'privateRowsReturned',0")&&sql.includes("'readyToAdminister'"),'sql:snapshot-sanitizado');

const module=await import(pathToFileURL(path.join(root,'completion-center-v548.js')).href+`?qa=${Date.now()}`);
const expected={'iphone-safari':53,'iphone-pwa':57,'ipad-safari':53,'android-chrome':53,'android-pwa':57,'mac-safari':49,'desktop-chrome':50,'desktop-firefox':49,'desktop-edge':50};
const results={};for(const [profile,count] of Object.entries(expected)){results[profile]={};for(let i=0;i<count;i++)results[profile][`${profile}-${i}`]={status:'pass'};}
let summary=module.summarizePhysicalEvidenceV548({schema:'divina-bruxa-physical-matrix-v547',release:'V547',results});
check(summary.profiles===9&&summary.passed===471&&summary.pending===0,'matriz:471-pass-explicitos');
const merged=module.mergePhysicalEvidenceV548(Object.entries(results).map(([profile,value])=>({schema:'divina-bruxa-physical-matrix-v547',release:'V547',results:{[profile]:value}})));
check(module.summarizePhysicalEvidenceV548(merged).passed===471,'matriz:mescla-nove-aparelhos');
delete results['iphone-pwa']['iphone-pwa-0'];summary=module.summarizePhysicalEvidenceV548({schema:'divina-bruxa-physical-matrix-v547',release:'V547',results});
check(summary.profiles===8&&summary.passed===470&&summary.pending===1,'matriz:pendencia-nao-vira-pass');

const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
const tarot=read('tarot-livre-orbe-os-v517.js'),tarotCss=read('tarot-livre-orbe-os-v517.css');
check(CARDS.length===78&&new Set(CARDS.map(card=>card.id)).size===78,'regressao:tarot-78');
check(CARDS.every(card=>card.orientation==='normal'),'regressao:tarot-direto');
check(!tarot.includes('free-tarot-fire-engine')&&!tarot.includes("getContext('webgl"),'regressao:tarot-sem-fogo-webgl');
check(/\.tl517__effects[\s\S]{0,180}display:\s*none\s*!important/.test(tarotCss),'regressao:efeitos-ocultos');

const skins=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
const catalog=skins.SKINS_V6||[];
check(catalog.length===30,'regressao:30-skins');
check(catalog.filter(item=>item.status==='free'&&item.priceCents===0).length===1,'regressao:skin-classica-gratis');
check(app.includes('identityPaidSkinCount:29')&&app.includes('identitySkinsAlsoSoldIndividually:true'),'regressao:29-skins-unitarias');
check(app.includes('publicLibraryDeepMeanings:78')&&app.includes('publicLibraryGuides:8'),'regressao:biblioteca-profunda');
check(app.includes('schoolModules:17')&&app.includes('schoolLessons:124'),'regressao:escola-completa');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'regressao:whit-local');
check(app.includes('worldTruthRoutes:17')&&app.includes('orbNavigationSingleFlight:true'),'regressao:navegacao');
check(app.includes('oneCanonicalOrb:true')&&app.includes('ownerObservatoryIndependentOrbEngines:0'),'regressao:orbe-unica');

const htmlFiles=fs.readdirSync(root).filter(file=>file.endsWith('.html'));
check(htmlFiles.length===321,'seo:321-html');
for(const file of htmlFiles){const html=read(file);check(html.includes('name="divina-security-release" content="V547"'),`seguranca-html:${file}`);check(!/\bhref=["']javascript:/i.test(html),`sem-javascript-url:${file}`);}
check(exists('sitemap.xml')&&read('sitemap.xml').includes('https://divinabruxa.com.br/'),'seo:sitemap-real');
check(exists('robots.txt')&&read('robots.txt').includes('Sitemap:'),'seo:robots');

const hashes=Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
check(Object.keys(hashes).length===files.length,'hash:arquivos-centrais');
const total=passed+failures.length;
console.log(`V548 QA Supremo: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
