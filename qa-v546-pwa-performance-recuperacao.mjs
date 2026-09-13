import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CARDS } from './tarot-data.js';
import { PWA_PERFORMANCE_RECOVERY_CONTRACT_V546 } from './pwa-performance-recovery-core-v546.js';
import { SKINS_V6, SKIN_PRICE_TIERS_V542 } from './skin-catalog-v6.js';

const root=path.dirname(fileURLToPath(import.meta.url));
let passed=0;
const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const exists=file=>fs.existsSync(path.join(root,file));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const occurrences=(source,token)=>source.split(token).length-1;
const localTargets=html=>[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
  .map(match=>match[1].split(/[?#]/)[0])
  .filter(value=>value&&!/^(?:https?:|mailto:|tel:|data:|javascript:|\/|#)/.test(value)&&value!=='.'&&value!=='./')
  .map(value=>value.replace(/^\.\//,''));
const staticImports=source=>[...source.matchAll(/(?:^|\n)\s*import(?:[\s\S]*?from\s*)?['"]\.\/([^'"?]+)(?:\?[^'"]*)?['"]/g)].map(match=>match[1]);
const swArray=(source,name)=>{
  const match=source.match(new RegExp(`const ${name}=Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\);`));
  check(Boolean(match),`sw-array:${name}`);
  return match?[...match[1].matchAll(/'(\.\/[^']+)'/g)].map(item=>item[1]):[];
};

const modernPages=Object.freeze([
  'consultas-tarot.html','contact.html','contacto.html','de-frente-con-el-tarot.html','english.html',
  'escuela-tarot.html','espanol.html','etica-tarot.html','face-to-face-with-tarot.html',
  'free-tarot-reading.html','instalar-aplicacion.html','instalar-app.html','install-app.html','music.html',
  'musica-tarot.html','mystic-store.html','significados-cartas-tarot.html','tarot-card-meanings.html',
  'tarot-consultations.html','tarot-ethics.html','tarot-libre.html','tarot-school.html','tarot-spreads.html',
  'tienda-mistica.html','tiradas-tarot.html'
]);
const compatibilityPages=Object.freeze([
  'acessibilidade.html','cartas-do-tarot.html','consultas-de-tarot.html','contato.html',
  'de-frente-com-o-tarot.html','escola-do-tarot.html','etica-e-responsabilidade.html','loja-mistica.html',
  'musica.html','offline-en.html','offline-es.html','offline.html','tarot-livre.html'
]);
const installPages=Object.freeze(['instalar-app.html','install-app.html','instalar-aplicacion.html']);
const offlinePages=Object.freeze(['offline.html','offline-en.html','offline-es.html']);
const releaseFiles=Object.freeze([
  '00-INSTALE-V546-PWA-PERFORMANCE-OFFLINE-RECUPERACAO.txt',
  'ARQUIVOS-V546-SHA256.txt','LAB-V546-DISPOSITIVOS-E-RECUPERACAO.md',
  'MANIFESTO-V546-PWA-PERFORMANCE-OFFLINE-RECUPERACAO.json',
  'QA-V546-PWA-PERFORMANCE-OFFLINE-RECUPERACAO.md',
  'ROLLBACK-V546-PARA-V545.txt','capacitor-readiness-v546.json',
  'pwa-performance-recovery-core-v546.css','pwa-performance-recovery-core-v546.js',
  'qa-v546-pwa-performance-recuperacao.mjs','qa-v546-service-worker-runtime.mjs'
]);

for(const file of releaseFiles)check(exists(file),`release-file:${file}`);

const core=read('pwa-performance-recovery-core-v546.js');
const coreCss=read('pwa-performance-recovery-core-v546.css');
const app=read('app-v208.js');
const index=read('index.html');
const pwa=read('pwa-world-v324.js');
const compatibility=read('pwa-world-v196.js');
const sw=read('sw.js');
const skinPerformance=read('skin-performance-core-v518.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const releaseManifest=JSON.parse(read('MANIFESTO-V546-PWA-PERFORMANCE-OFFLINE-RECUPERACAO.json'));
const capacitor=JSON.parse(read('capacitor-readiness-v546.json'));

check(releaseManifest.release==='V546','release-manifest-version');
check(releaseManifest.file_count===releaseManifest.files.length,'release-manifest-file-count');
check(releaseManifest.files.length===new Set(releaseManifest.files).size,'release-manifest-unique-files');
for(const file of releaseManifest.files)check(exists(file),`release-manifest-file:${file}`);
const hashFile='ARQUIVOS-V546-SHA256.txt';
const hashEntries=new Map(read(hashFile).split(/\r?\n/).map(line=>line.match(/^([a-f0-9]{64})  (.+)$/)).filter(Boolean).map(match=>[match[2],match[1]]));
const hashedFiles=releaseManifest.files.filter(file=>file!==hashFile);
check(hashEntries.size===hashedFiles.length,'hash-file-entry-count');
for(const file of hashedFiles){
  check(hashEntries.has(file),`hash-entry:${file}`);
  const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
  check(hashEntries.get(file)===actual,`hash-valid:${file}`);
}

check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.release==='V546','contract-release');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.macroStage==='12-of-14','contract-macro');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.targets.touchResponseMs===100,'contract-touch-100');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.targets.LCPms===2500,'contract-lcp-2500');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.targets.INPms===200,'contract-inp-200');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.targets.CLS===0.1,'contract-cls-01');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.frameRate.standard===60,'contract-fps-60');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.frameRate.fallback===30,'contract-fps-30');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.frameRate.reduced===20,'contract-fps-20');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.cache.versioned===true,'contract-versioned-cache');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.cache.atomicShell===true,'contract-atomic-shell');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.cache.navigationPreload===true,'contract-nav-preload');
check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.cache.premiumByEntitlement===true,'contract-premium-entitlement');
for(const world of ['tarot','daily-revealed','library','journal-local','whit-local','current-skin'])
  check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.offlineWorlds.includes(world),`contract-offline:${world}`);
for(const world of ['account-authority','billing','admin','consultation-submit','whit-online'])
  check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546.onlineOnly.includes(world),`contract-online:${world}`);
for(const key of ['oneCanonicalOrb','capacitorPrepared','weakDeviceLab','safeServiceWorkerUpdate','staleScreenRecovery','lazyRoutes','lazyImages'])
  check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546[key]===true,`contract:${key}`);
for(const key of ['independentOrbEngines','mutationObservers','permanentLoops','privateContentReads','storageWrites','extraApiCalls'])
  check(PWA_PERFORMANCE_RECOVERY_CONTRACT_V546[key]===0,`contract-zero:${key}`);
for(const token of ['MutationObserver','setInterval(','requestAnimationFrame(','pointermove','<canvas'])
  check(!core.includes(token),`recovery-core-sem:${token}`);
for(const token of ['scenePaused','visibilitychange','pageshow','connection-change','VERIFY_SHELL','REPAIR_SHELL','routeSamples'])
  check(core.includes(token),`recovery-core:${token}`);
check(!coreCss.includes('@keyframes'),'recovery-css-sem-keyframes');
check(coreCss.includes('content-visibility:hidden'),'recovery-css-telas-inativas');
check(coreCss.includes('.screen:not(.active) *::after{animation-play-state:paused'),'recovery-css-pausa-mundos-inativos');
check(coreCss.includes('touch-action:manipulation'),'recovery-css-toque');
check(coreCss.includes('prefers-reduced-motion:reduce'),'recovery-css-reduced-motion');
check(coreCss.includes('data-scene-paused="true"'),'recovery-css-pausa-oculta');

const required=swArray(sw,'REQUIRED_SHELL');
const boot=swArray(sw,'BOOT_DEPENDENCIES');
const dependencies=swArray(sw,'APP_DEPENDENCIES');
const freeOffline=swArray(sw,'FREE_OFFLINE_ASSETS');
const premiumOffline=swArray(sw,'PREMIUM_OFFLINE_ASSETS');
const publicOffline=swArray(sw,'PUBLIC_OFFLINE_PAGES');
for(const [name,assets] of Object.entries({required,boot,dependencies,freeOffline,premiumOffline,publicOffline})){
  check(assets.length===new Set(assets).size,`sw-sem-duplicatas:${name}`);
  for(const asset of assets)check(exists(asset.replace(/^\.\//,'')),`sw-${name}:${asset}`);
}

const moduleClosure=entryAssets=>{
  const seen=new Set();
  const walk=file=>{
    if(seen.has(file)||!file.endsWith('.js'))return;
    seen.add(file);
    for(const imported of staticImports(read(file)))walk(path.normalize(path.join(path.dirname(file),imported)));
  };
  entryAssets.map(asset=>asset.replace(/^\.\//,'')).forEach(walk);
  return seen;
};
const freeCached=new Set([...required,...boot,...dependencies,...freeOffline].map(asset=>asset.replace(/^\.\//,'')));
for(const file of moduleClosure(freeOffline))check(freeCached.has(file),`sw-free-import-closure:${file}`);
const premiumCached=new Set([...required,...boot,...premiumOffline].map(asset=>asset.replace(/^\.\//,'')));
for(const file of moduleClosure(premiumOffline))check(premiumCached.has(file),`sw-premium-import-closure:${file}`);

const appImportClosure=new Set();
const walkImports=file=>{
  if(appImportClosure.has(file))return;
  appImportClosure.add(file);
  const source=read(file);
  for(const imported of staticImports(source))walkImports(path.normalize(path.join(path.dirname(file),imported)));
};
walkImports('app-v208.js');
const atomicShell=new Set([...required,...boot].map(asset=>asset.replace(/^\.\//,'')));
for(const imported of appImportClosure)check(atomicShell.has(imported),`sw-atomic-import:${imported}`);

check(sw.includes('const VERSION=546'),'sw-version');
for(const name of ['SHELL_CACHE','CONTENT_CACHE','IMAGE_CACHE','OFFLINE_CACHE','PREMIUM_CACHE'])
  check(sw.includes(`divina-bruxa-v546-${name==='SHELL_CACHE'?'shell':name==='CONTENT_CACHE'?'content':name==='IMAGE_CACHE'?'images':name==='OFFLINE_CACHE'?'offline-core':'premium-static'}`),`sw-cache:${name}`);
check(sw.includes('ATOMIC_SHELL_ASSETS'),'sw-atomic-assets');
check(sw.includes("self.addEventListener('install'"),'sw-install');
check(sw.includes('required-shell-incomplete'),'sw-install-fail-closed');
check(sw.includes('navigationPreload?.enable'),'sw-navigation-preload-enable');
check(sw.includes('event.preloadResponse'),'sw-navigation-preload-use');
check(sw.includes('MAX_CONTENT_ENTRIES=180'),'sw-content-cap');
check(sw.includes('MAX_IMAGE_ENTRIES=96'),'sw-image-cap');
check(sw.includes('MAX_RUNTIME_IMAGE_BYTES=1800000'),'sw-image-byte-cap');
check(sw.includes("type==='VERIFY_SHELL'"),'sw-verify-shell');
check(sw.includes("type==='REPAIR_SHELL'"),'sw-repair-shell');
check(sw.includes("type==='PREPARE_OFFLINE_PREMIUM'"),'sw-premium-offline-message');
check(sw.includes("authorized!==true"),'sw-premium-requires-authorized');
check(sw.includes("reason:'server-entitlement-required'"),'sw-premium-denial');
check(sw.includes('grantsEntitlement:false'),'sw-cache-never-grants-entitlement');
check(sw.includes('cache-control')&&sw.includes('no-store|private'),'sw-no-private-cache-control');
check(sw.includes("response.headers.has('set-cookie')"),'sw-no-set-cookie');
check(sw.includes('isAuthorityRequest(request,url)'),'sw-authority-gate');
check(sw.includes('PRIVATE_ROUTE_PATTERN.test(url.pathname)'),'sw-private-navigation-gate');
check(sw.includes('caches.delete(OFFLINE_CACHE)')&&sw.includes('caches.delete(PREMIUM_CACHE)'),'sw-clear-optional-both');
for(const token of ['indexedDB.deleteDatabase','localStorage.clear','sessionStorage.clear'])check(!sw.includes(token),`sw-nao-apaga-privado:${token}`);
check(sw.includes("whitLocal:true"),'sw-whit-local-offline');
check(sw.includes("whitOnline:true"),'sw-whit-online-network');
check(sw.includes('dailyPreviouslyRevealed:true'),'sw-daily-revealed-only');
const swInstallBlock=sw.match(/self\.addEventListener\('install'[\s\S]*?self\.addEventListener\('activate'/)?.[0]||'';
check(!swInstallBlock.includes('prepareOfflineCore()'),'sw-install-sem-offline-total');
check(!swInstallBlock.includes('PUBLIC_OFFLINE_PAGES'),'sw-install-sem-paginas-pesadas');
check(!sw.includes('v545-shell')&&!sw.includes('v544-shell'),'sw-sem-cache-antigo');

check(pwa.includes('const VERSION=546'),'pwa-version');
check(occurrences(pwa,'navigator.serviceWorker.register(')===1,'pwa-um-registro-fallback');
check(!pwa.includes('reinforce'),'pwa-sem-registro-repetido');
check(!pwa.includes('MutationObserver'),'pwa-sem-mutation-observer');
check(!pwa.includes('setInterval('),'pwa-sem-intervalo');
check(pwa.includes("startsWith('v546')"),'pwa-respeita-bootstrap-existente');
check(pwa.includes('premiumEntitlementActive'),'pwa-entitlement-premium');
check(pwa.includes("item?.key==='premium_lifetime'&&item?.status==='active'"),'pwa-premium-ativo');
check(pwa.includes('data-verify-offline')&&pwa.includes('data-repair-offline'),'pwa-controles-recuperacao');
check(pwa.includes('whitLocalOffline:true')&&pwa.includes('whitOnlineOffline:false'),'pwa-whit-honesta');
check(pwa.includes('mutationObservers:0')&&pwa.includes('permanentLoops:0'),'pwa-sem-vigilancia-continua');
check(compatibility.includes("from './pwa-world-v324.js?v=546'"),'compatibilidade-aponta-v546');
check(!compatibility.includes('serviceWorker.register'),'compatibilidade-sem-segunda-autoridade');

const monitorBlock=skinPerformance.match(/scheduleMonitor\(delay[\s\S]*?\n  }\n\n  evaluateWindow/ )?.[0]||'';
check(Boolean(monitorBlock),'skin-monitor-bloco');
check(!monitorBlock.includes('this.scheduleMonitor'),'skin-monitor-nao-recursivo');
check(!skinPerformance.includes('MONITOR_MS'),'skin-sem-ciclo-4s');
check(!skinPerformance.includes('setInterval('),'skin-sem-intervalo');
check(skinPerformance.includes("tarotFire:'removed-v538'"),'skin-confirma-fogo-removido');

check(app.startsWith('/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 12/14 · V546'),'app-header-v546');
check(app.includes("createPwaPerformanceRecoveryCoreV546 } from './pwa-performance-recovery-core-v546.js?v=546'"),'app-import-core');
check(app.includes("release:'V546'"),'app-release-v546');
check(app.includes("currentMacroStage:'12-of-14'"),'app-macro-v546');
check(app.includes("navigator.serviceWorker.register('./sw.js?v=546'"),'app-worker-v546');
check(app.includes('const RELEASE_EPOCH_V537 = 546'),'app-release-epoch');
check(app.includes('`divina-release-reload-${nextRelease}`'),'app-reload-por-versao');
check(app.includes('home|tarot|daily|library|spreads|school|journal|consultations|store|login|subscriptions|ai|music|videos|skins|notifications'),'app-notificacoes-abrem-mundos-publicos');
check(app.includes("pageLoader.warm(['tarot'])"),'app-aquecimento-minimo');
check(!app.includes("pageLoader.warm(['tarot', 'daily', 'library', 'school', 'journal'])"),'app-sem-aquecimento-cinco-mundos');
check(app.includes('recovery:pwaPerformanceRecovery'),'app-publica-recuperacao');
check(app.includes("internationalParity:'v545'"),'app-preserva-v545');
check(app.includes("publicLibrary:'v544'"),'app-preserva-v544');
check(app.includes("amazonStore:'v543'"),'app-preserva-v543');
check(app.includes('tarotFireRemoved:true'),'app-tarot-sem-fogo');
check(app.includes('canonicalTarotNormalOnly:true'),'app-tarot-direto');
check(app.includes('canonicalTarotNoRepeats:true'),'app-tarot-sem-repeticao');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'app-whit-local');
check(index.includes('app-v208.js?v=546'),'index-app-v546');
check(index.includes('manifest.webmanifest?v=546'),'index-manifest-v546');
check(index.includes("__divinaSWBootstrap='v546-inline'"),'index-bootstrap-v546');
check(index.includes("navigator.serviceWorker.register('./sw.js?v=546'"),'index-worker-v546');
check(index.includes("divina.sw.reload.v546"),'index-recovery-versioned');
check(occurrences(index,'serviceWorker.register(')===1,'index-um-registro');
const pageLoader=read('page-loader-v1.js');
const premiumWorld=read('skins-premium-world-v318.js');
const premiumWorldCss=read('skins-premium-world-v318.css');
check(pageLoader.startsWith('/* DIVINA BRUXA 3.0 — CARREGAMENTO V546'),'loader-header-v546');
check(occurrences(pageLoader,"skins-premium-world-v318.js?v=546")===4,'loader-premium-js-v546');
check(occurrences(pageLoader,"skins-premium-world-v318.css?v=546")===4,'loader-premium-css-v546');
check(premiumWorld.includes('data-spw318-offline'),'premium-offline-controle');
check(premiumWorld.includes('PREMIUM ATIVO NECESSÁRIO'),'premium-offline-bloqueado');
check(premiumWorld.includes('divinaPwaV324.prepareOfflinePremium()'),'premium-offline-usa-autoridade-pwa');
check(premiumWorld.includes('offlineCacheGrantsEntitlement:false'),'premium-cache-nao-concede-direito');
check(premiumWorldCss.includes('.spw318__offline'),'premium-offline-responsivo');

for(const file of modernPages){
  const html=read(file);
  check(html.includes('pwa-world-v324.js?v=546'),`${file}:pwa-v546`);
  check(html.includes('manifest.webmanifest?v=546'),`${file}:manifest-v546`);
  for(const target of localTargets(html))check(exists(target),`${file}:local:${target}`);
}
for(const file of compatibilityPages){
  const html=read(file);
  check(html.includes('pwa-world-v196.js?v=546'),`${file}:compat-v546`);
  check(html.includes('manifest.webmanifest?v=546'),`${file}:manifest-v546`);
  for(const target of localTargets(html))check(exists(target),`${file}:local:${target}`);
}
for(const file of installPages){
  const html=read(file);
  check(html.includes('PWA V546'),`${file}:titulo-v546`);
  check(html.includes('data-prepare-offline'),`${file}:preparar`);
  check(html.includes('data-verify-offline'),`${file}:verificar`);
  check(html.includes('data-repair-offline'),`${file}:reparar`);
  check(html.includes('data-offline-health'),`${file}:saida-saude`);
  check(/Whit Local|Local Whit/.test(html),`${file}:whit-local`);
  check(/Escola[^<]*Premium|School[^<]*Premium|Escuela[^<]*Premium/.test(html),`${file}:premium-separado`);
}
for(const file of offlinePages){
  const html=read(file);
  check(html.includes('noindex,nofollow,noarchive'),`${file}:noindex`);
  check(/Whit Local|Local Whit/.test(html),`${file}:whit-local`);
  check(/Whit online|online Whit/.test(html),`${file}:whit-online`);
  check(!/Orbe IA[^<]*exig|Orb AI[^<]*require/.test(html),`${file}:nao-bloqueia-whit-local`);
}

check(manifest.name==='Divina Bruxa — Orbe das Realidades','manifest-name');
check(manifest.id==='./'&&manifest.start_url==='./'&&manifest.scope==='./','manifest-scope');
check(manifest.display==='standalone','manifest-standalone');
check(manifest.launch_handler?.client_mode==='navigate-existing','manifest-launch-existing');
check(manifest.prefer_related_applications===false,'manifest-sem-loja');
for(const icon of manifest.icons){
  const file=icon.src.replace(/^\.\//,'').split('?')[0];
  check(exists(file),`manifest-icon:${file}`);
  check(icon.src.endsWith('?v=546'),`manifest-icon-version:${file}`);
  const buffer=fs.readFileSync(path.join(root,file));
  const declared=icon.sizes.split('x').map(Number);
  check(buffer.readUInt32BE(16)===declared[0]&&buffer.readUInt32BE(20)===declared[1],`manifest-icon-size:${file}`);
}
for(const shortcut of manifest.shortcuts){
  const target=shortcut.url.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';
  check(exists(target),`manifest-shortcut:${shortcut.short_name}`);
}
for(const wanted of ['Tarot','Carta do Dia','Biblioteca','Escola','Diário','Whit Local'])
  check(manifest.shortcuts.some(shortcut=>shortcut.short_name===wanted),`manifest-shortcut-presente:${wanted}`);

check(capacitor.release==='V546','capacitor-release');
check(capacitor.appId==='com.divinabruxa.app','capacitor-app-id');
check(capacitor.webDir==='.','capacitor-web-dir');
check(capacitor.environment==='staging','capacitor-staging');
check(capacitor.productionAuthorized===false,'capacitor-sem-producao');
check(capacitor.storeSubmissionAuthorized===false,'capacitor-sem-loja');
check(capacitor.native?.haptics?.web===false,'capacitor-sem-haptica-web');
check(capacitor.native?.haptics?.nativeFuture===true,'capacitor-haptica-futura');

check(CARDS.length===78,'tarot-78');
check(new Set(CARDS.map(card=>card.canonicalId)).size===78,'tarot-78-identidades');
check(CARDS.every(card=>card.orientation==='normal'),'tarot-todas-diretas');
check(SKINS_V6.length===30,'skins-30');
check(SKINS_V6[0]?.priceCents===0,'skin-classica-gratis');
check(SKINS_V6.filter(skin=>skin.individualPurchase).length===29,'skins-29-unitarias');
check(SKINS_V6.filter(skin=>skin.individualPurchase).every(skin=>SKIN_PRICE_TIERS_V542.includes(skin.priceCents)),'skins-precos-unitarios-validos');
check(read('skins-v201.js').includes('COMPRA UNITÁRIA · SEM PREMIUM OBRIGATÓRIO'),'skins-compra-sem-premium');
check(read('premium-policy-v191.js').includes('individualSkinCheckoutEnabled:false'),'skins-billing-real-bloqueado');
check(read('ai-engine.js').includes("settings?.delivery === 'online' ? 'online' : 'local'"),'whit-modo-local');
check(!/fetch\(|XMLHttpRequest|WebSocket/.test(read('whit-local-guide-v540.js')),'whit-guia-sem-rede');

const total=passed+failures.length;
console.log(`V546 QA: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
