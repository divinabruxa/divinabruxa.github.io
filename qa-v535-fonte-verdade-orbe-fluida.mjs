/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 1/14 · V535
   Execução: node qa-v535-fonte-verdade-orbe-fluida.mjs */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const read=file=>readFileSync(join(root,file),'utf8');
const checks=[];
const add=(id,pass,detail)=>checks.push({id,status:pass?'PASS':'FAIL',detail});
const blocked=(id,detail)=>checks.push({id,status:'BLOCKED',detail});
const occurrences=(source,needle)=>source.split(needle).length-1;
const moduleUrl=file=>`${pathToFileURL(join(root,file)).href}?qa=v535-${Date.now()}`;

const releaseFiles=[
  'world-truth-registry-v535.js','orb-fluid-navigation-v535.js',
  'app-v208.js','navigation.js','page-loader-v1.js','orb-engine-v208.js',
  'supreme-orb-core-v501.js','orb-ios-journey-core-v525.js',
  'orb-universal-presence-v526.js','skin-performance-core-v518.js',
  'pwa-world-v324.js','sw.js','index.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];

for(const file of releaseFiles)add(`arquivo:${file}`,existsSync(join(root,file)),'presente no corte incremental V535');
for(const file of releaseFiles.filter(file=>file.endsWith('.js'))){
  let pass=true;
  try{execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'ignore'});}catch{pass=false;}
  add(`sintaxe:${file}`,pass,pass?'JavaScript válido':'JavaScript inválido');
}

const routeModule=await import(moduleUrl('route-registry-v180.js'));
const truthModule=await import(moduleUrl('world-truth-registry-v535.js'));
const commercialModule=await import(moduleUrl('commercial-truth-v200.js'));
const journeyModule=await import(moduleUrl('orb-ios-journey-core-v525.js'));
const loaderModule=await import(moduleUrl('page-loader-v1.js'));
const expectedRoutes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
const routeIds=routeModule.ROUTES_V180.map(route=>route.id);
const worlds=truthModule.WORLD_ROUTES_V535;
const truth=truthModule.WORLD_TRUTH_V535;
const commercial=commercialModule.COMMERCIAL_TRUTH_V200;

add('registro-17-rotas',worlds.length===17&&worlds.map(world=>world.id).join(',')===expectedRoutes.join(','),'17/17 realidades na ordem canônica');
add('registro-paridade-route-registry',worlds.map(world=>world.id).join(',')===routeIds.join(','),'Registro Vivo e roteador possuem a mesma ordem');
add('registro-identidades-unicas',new Set(worlds.map(world=>world.id)).size===17,'IDs únicos');
add('registro-familia-proposito',worlds.every(world=>world.family&&world.name&&world.purpose.length>=20),'todas as realidades possuem família, nome e propósito');
add('registro-assinaturas',worlds.every(world=>world.signature?.mode&&world.signature?.direction&&world.signature?.tone),'17 assinaturas completas');
add('registro-portais',worlds.every(world=>world.gateway?.length===2&&world.gateway.every(value=>value>=0&&value<=1)),'17 portais espaciais normalizados');
add('registro-ancoras',worlds.every(world=>world.journeyAnchors?.length>0),'17 destinos com âncoras de pouso');
add('registro-presencas',Object.keys(truthModule.orbPresenceProfilesV535()).length===15,'15 pousos semânticos; Home e Tarot usam a presença canônica própria');
add('registro-imutavel',Object.isFrozen(truth)&&Object.isFrozen(worlds)&&worlds.every(world=>Object.isFrozen(world)&&Object.isFrozen(world.signature)&&Object.isFrozen(world.gateway)),'fonte pública congelada');
add('registro-normalizacao',truthModule.normalizeWorldRouteV535('biblioteca')==='library'&&truthModule.normalizeWorldRouteV535('#carta-do-dia')==='daily','aliases passam pelo roteador canônico');

add('verdade-tarot',truth.canonical.tarotCards===78&&truth.canonical.tarotOrientation==='normal'&&truth.canonical.tarotRepeats===false,'78 cartas diretas e sem repetição');
add('verdade-mesa-real',truth.canonical.royalTable.columns===13&&truth.canonical.royalTable.rows===6&&truth.canonical.royalTable.total===78,'Mesa Real 13 × 6 = 78');
add('verdade-tiragens',truth.canonical.spreadMethods===15&&truth.canonical.celticCrossPositions===10,'15 tiragens e Cruz Celta de 10 posições');
add('verdade-escola',truth.canonical.schoolModules===17&&truth.canonical.schoolLessons===124,'17 módulos e 124 aulas');
add('verdade-skins',truth.canonical.skins===30,'30 skins cosméticas');
add('verdade-editorial',truth.canonical.publicFallbackAlbums===2&&truth.canonical.inventedVideos===0,'2 álbuns de fallback e zero vídeo inventado');
add('verdade-comercial-ativa',commercialModule.assertCommercialTruthV200()===true&&commercial.services.map(item=>item.priceCents).join(',')==='50000,50000,30000,15000','runtime ativo: R$ 500, R$ 500, R$ 300 e R$ 150');
add('verdade-divergencia-explicita',truth.openDecisions.length===1&&truth.openDecisions[0].state==='BLOCKED_OWNER_DECISION','superfícies históricas de preço não são reescritas silenciosamente');
add('travas-fechadas',truth.gates.environment==='staging'&&truth.gates.realBilling===false&&truth.gates.productionPublish===false&&truth.gates.dnsChanges===false&&truth.gates.storeSubmission===false&&truth.gates.sol===false,'STAGING e todas as travas de autoridade fechadas');

const registrySource=read('world-truth-registry-v535.js');
add('registro-sem-dados-privados',!/(?:localStorage|sessionStorage|indexedDB|\.value\b|FormData\s*\(|fetch\s*\()/i.test(registrySource),'Registro Vivo não lê storage, campos ou rede');
add('registro-sem-loop-visual',!/(?:requestAnimationFrame|setInterval)\s*\(/.test(registrySource),'Registro Vivo não cria loop de animação');

const supreme=read('supreme-orb-core-v501.js');
add('orbe-assinatura-central',supreme.includes("from './world-truth-registry-v535.js?v=535'")&&supreme.includes('worldSignatureV535(route)')&&!supreme.includes('const ROUTE_ALIASES')&&!supreme.includes('const SIGNATURES'),'assinatura e aliases não são duplicados no núcleo');
add('orbe-voo-unico',supreme.includes("navigationAuthority:'v535-single-flight'")&&supreme.includes('if (this.pendingRoute)')&&supreme.includes('divina:supreme-orb-navigation-coalesced'),'uma passagem ativa; novos toques são coalescidos');
add('orbe-sem-fila-encadeada',!supreme.includes('this.pending = this.pending'),'não existe backlog encadeado de rotas');
add('orbe-projecoes-aliviadas',supreme.includes('navigationCritical ? (constrained() ? 5 : 8)'),'espelhos secundários descem para 5/8 fps durante a passagem');
add('orbe-corpo-imovel',supreme.includes('physicalTouchMotion:false'),'toque continua movendo apenas a matéria interna');

const navigation=read('navigation.js');
const commitPosition=navigation.indexOf('const committed = commit(id, push)');
const menuAwaitPosition=navigation.indexOf('await Promise.resolve(menuClosure)');
add('navegacao-autoridade-unica',navigation.includes('let routeRequest = null')&&navigation.includes('setRouteRequest')&&navigation.includes('const request = routeRequest || go'),'todos os data-go podem passar pela Orbe Suprema');
add('navegacao-menu-nao-bloqueia',commitPosition>0&&menuAwaitPosition>commitPosition&&!navigation.includes('Promise.all([preparation, menuClosure])'),'rota assenta antes de aguardar o fechamento completo do menu');
add('navegacao-sem-scroll-concorrente',navigation.includes("window.scrollTo({ top: 0, behavior: 'auto' })")&&!navigation.includes("window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' })"),'commit não inicia rolagem suave concorrente');

const loader=read('page-loader-v1.js');
const primeBody=loader.match(/const prime=rawId=>\{[\s\S]*?\n  \};/)?.[0]||'';
add('loader-orcamento-48ms',loaderModule.NAVIGATION_PREPARE_BUDGET_MS_V535===48&&loader.includes('? 24'),'preparação bloqueia no máximo 48 ms; 24 ms no perfil restrito');
add('loader-intencao-leve',primeBody.includes('warmers[id]')&&!primeBody.includes('load(id)')&&loader.includes("prime(id).catch(()=>{})"),'pointerdown aquece módulo/CSS sem montar o mundo');
add('loader-abertura-diferida',loader.includes('Promise.race([')&&loader.includes('divina:page-deferred')&&loader.includes('divina:supreme-orb-did-navigate')&&loader.includes('scheduleLoad'),'tela abre primeiro; construção do mundo começa depois do pouso');
add('loader-recuperacao-preservada',loader.includes('divina:page-error')&&loader.includes('data-module-state'),'falha continua recuperável e observável');

const engine=read('orb-engine-v208.js');
const gesture=read('orb-gesture-core-v208.js');
add('orbe-resposta-64ms',engine.includes('const PORTAL_COMMIT_DELAY_MS_V535 = 64')&&engine.includes('PORTAL_COMMIT_DELAY_MS_V535'),'portal inicia em 64 ms após o gesto confirmado');
add('orbe-aquecimento-no-primeiro-toque',occurrences(engine,"this.onIntent?.('tarot')")>=2,'primeiro toque aquece Tarot antes do segundo');
add('orbe-duplo-toque-unico',engine.includes('ORB_GESTURE_OUTCOMES_V208.DOUBLE_TAP')&&engine.includes('this.gesture.beginNavigation()')&&gesture.includes('DOUBLE_TAP'),'contrato de toque duplo e trava de navegação preservados');
add('orbe-sem-vibracao-web',!engine.includes('navigator.vibrate')&&!read('orb-motion-core-v207.js').includes('navigator.vibrate'),'somente ponte háptica nativa opcional');
add('orbe-sem-zoom-scroll-gesto',engine.includes("touchAction")&&engine.includes('overscrollBehavior')&&gesture.includes('DRAG'),'roteamento de gesto permanece dedicado à Orbe');

const budgets=journeyModule.ORB_JOURNEY_FLUIDITY_BUDGETS_V535;
const animationTotal=budget=>budget.lift+budget.flight+budget.arrival+budget.settle;
add('viagem-touch-442ms',animationTotal(budgets.touch)===442,'passagem tátil nominal: 442 ms');
add('viagem-restrita-348ms',animationTotal(budgets.constrained)===348,'passagem restrita nominal: 348 ms');
add('viagem-reduced-226ms',animationTotal(budgets.reduced)===226,'movimento reduzido nominal: 226 ms');
add('viagem-espelho-mobile',budgets.touch.mirrorFps===18&&budgets.touch.maximumPixels===560&&budgets.constrained.mirrorFps===12,'espelho móvel limitado sem apagar a Retina');
const journey=read('orb-ios-journey-core-v525.js');
add('viagem-registro-central',journey.includes('worldForRouteV535')&&!journey.includes('const ROUTE_GATEWAYS')&&!journey.includes('const ROUTE_ANCHORS'),'portais e âncoras vêm do Registro Vivo');
add('viagem-mesmo-universo',journey.includes('sameUniverse:true')&&journey.includes('independentOrbEngine:false'),'mesma Orbe e mesmo universo contínuo');

const fluid=read('orb-fluid-navigation-v535.js');
add('governador-event-driven',!fluid.includes('requestAnimationFrame(')&&!fluid.includes('setInterval(')&&fluid.includes('divina:supreme-orb-will-navigate'),'governador reage a eventos e não cria loop permanente');
add('governador-orcamento-transitorio',fluid.includes('Math.min(this.savedUniverseBudget.fps, transitionFps())')&&fluid.includes('restoreUniverseBudget'),'universo reduz custo durante o voo e restaura depois');
add('governador-observabilidade',fluid.includes("type:'longtask'")&&fluid.includes('divina:orb-navigation-measured')&&fluid.includes('HISTORY_LIMIT = 20'),'mede tempos e long tasks apenas em memória');
add('governador-privacidade',!/(?:localStorage|sessionStorage|indexedDB|\.value\b|FormData\s*\(|fetch\s*\()/i.test(fluid),'não lê conteúdo, campos, storage ou rede');

const skinPerformance=read('skin-performance-core-v518.js');
add('iphone-sem-cinematico-falso',skinPerformance.includes("if (touchDevice || innerWidth < 900) return 'balanced'")&&!skinPerformance.includes('(memory >= 6 || memory === 0)'),'deviceMemory ausente não promove iPhone a máximo');
add('universo-mobile-equilibrado',skinPerformance.includes("balanced:{ fps:mobile ? 45 : 60, scale:mobile ? 1.58 : 1.68 }")&&skinPerformance.includes("protected:{ fps:reducedMotion() ? 20 : mobile ? 30 : 40"),'mobile usa 45 fps equilibrado ou 30 fps protegido');

const app=read('app-v208.js');
add('app-registro-v535',app.includes('createWorldTruthRegistryV535')&&app.includes('window.divinaWorldTruthReleaseV535'),'Registro Vivo conectado ao runtime');
add('app-fluidez-v535',app.includes('createOrbFluidNavigationV535')&&app.includes('window.divinaOrbFluidNavigationReleaseV535'),'governador conectado ao runtime');
add('app-data-go-pela-orbe',app.includes('navigation.setRouteRequest(go)'),'navegação pública usa a Orbe Suprema');
add('app-prepara-sem-bloqueio',app.includes('navigation.setBeforeEnter(pageLoader.prepare)')&&app.includes('pageLoader?.prime?.(id)'),'prime antecipado e prepare orçado');
add('app-plano-14',app.includes('supremePlanMacroStages:14')&&app.includes("currentMacroStage:'1-of-14'"),'Plano Supremo 3.0 registrado com 14 macroetapas');
add('app-corte-v535',app.includes('const RELEASE_EPOCH_V535 = 535')&&app.includes("register('./sw.js?v=535'")&&app.includes('startPwaAfterBootV535'),'epoch, SW e PWA alinhados');
add('app-preserva-universos',[
  'living-universe-core-v524.js','whit-core-supreme-v527.js','tarot-universe-core-v528.js',
  'wisdom-universe-core-v529.js','experience-conversion-core-v530.js',
  'identity-rights-core-v531.js','responsive-enchantment-core-v533.js','qa-supreme-core-v534.js'
].every(file=>app.includes(file)),'continuidade V524–V534 preservada');

const index=read('index.html');
add('index-corte-v535',index.includes('app-v208.js?v=535')&&index.includes('manifest.webmanifest?v=535')&&index.includes("register('./sw.js?v=535'")&&index.includes('version:535'),'app, manifesto e bootstrap alinhados');
add('home-orbe-unicas',occurrences(index,'id="home"')===1&&occurrences(index,'id="orb"')===1&&occurrences(index,'id="orbCanvas"')===1,'uma Home, uma Orbe e um canvas principal');
const staticScreenIds=[...index.matchAll(/<section id="([^"]+)" class="screen/g)].map(match=>match[1]);
add('telas-17-com-skins-dinamica',staticScreenIds.length===16&&!staticScreenIds.includes('skins')&&read('responsive-enchantment-core-v533.js').includes("section.id='skins'"),'16 telas no HTML + Skins restaurada antes do primeiro diagnóstico');
const orbMarkup=index.match(/<button id="orb"[\s\S]*?<\/button>/)?.[0]||'';
add('orbe-sem-numero-interno',!/>\s*33\s*</.test(orbMarkup)&&!orbMarkup.includes('data-count="33"'),'nenhum número 33 dentro da Orbe principal');

const sw=read('sw.js');
add('sw-caches-v535',sw.includes('const VERSION=535')&&occurrences(sw,'divina-bruxa-v535-')===4,'quatro caches V535 isolados');
add('sw-shell-v535',sw.includes("'./world-truth-registry-v535.js'")&&sw.includes("'./orb-fluid-navigation-v535.js'")&&sw.includes("'./app-v208.js'"),'novos núcleos pertencem ao shell obrigatório');
add('sw-recusa-index-antigo',sw.includes('/app-v208\\.js\\?v=535/'),'shell anterior não é aceito como V535');
add('sw-autoridade-fora-cache',sw.includes('if(isAuthorityRequest(request,url))')&&sw.includes("request.headers.has('authorization')")&&sw.includes("request.cache==='no-store'"),'Auth, IA, Admin, billing e Consultas seguras não entram no cache');

const pwa=read('pwa-world-v324.js');
add('pwa-v535',pwa.includes('const VERSION=535')&&pwa.includes('dataset.pwaWorld=String(VERSION)')&&pwa.includes("__divinaSWBootstrap='v535'")&&pwa.includes("register('./sw.js?v=535'")&&pwa.includes("recovery:'fonte-verdade-orbe-fluida-v535'"),'autoridade PWA alinhada');
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const source=read(file);
  add(`instalacao-v535:${file}`,source.includes('PWA V535')&&source.includes('manifest.webmanifest?v=535')&&source.includes('pwa-world-v324.js?v=535'),'página de instalação alinhada');
}

const tarotSource=read('tarot-data.js');
const tarotUrl=`data:text/javascript;base64,${Buffer.from(tarotSource).toString('base64')}`;
const tarot=await import(tarotUrl);
add('regressao-tarot-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.canonicalId)).size===78&&tarot.CARDS.every(card=>card.orientation==='normal'),'78 identidades únicas e orientação direta');
const spreadsSource=read('spreads-policy.js');
const spreadsUrl=`data:text/javascript;base64,${Buffer.from(spreadsSource).toString('base64')}`;
const spreads=await import(spreadsUrl);
add('regressao-tiragens',spreads.SPREADS.length===15&&spreads.CELTIC_CROSS_POSITIONS.length===10&&spreads.ROYAL_TABLE_COLUMNS===13&&spreads.ROYAL_TABLE_ROWS===6&&spreads.ROYAL_TABLE_COUNT===78,'tiragens, Cruz Celta e Mesa Real preservadas');
add('regressao-grade-tarot',read('tarot-livre-orbe-os-v517.css').includes('grid-template-columns: repeat(6, minmax(0, 1fr))'),'Tarot Livre mantém 6 cartas por linha');

const localRefs=[...index.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1]).filter(ref=>!ref.startsWith('#')&&!/^(?:https?:|mailto:|tel:|data:)/.test(ref))
  .map(ref=>ref.split(/[?#]/)[0]).filter(Boolean);
const missingIndexRefs=[...new Set(localRefs)].filter(ref=>!existsSync(join(root,ref)));
add('index-referencias-locais',missingIndexRefs.length===0,missingIndexRefs.length?`ausentes: ${missingIndexRefs.join(', ')}`:`${new Set(localRefs).size} referências resolvidas`);

const swRefs=[...sw.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(match=>match[1].slice(2).split(/[?#]/)[0]);
const missingSwRefs=[...new Set(swRefs)].filter(ref=>!existsSync(join(root,ref)));
add('sw-referencias-locais',missingSwRefs.length===0,missingSwRefs.length?`ausentes: ${missingSwRefs.join(', ')}`:`${new Set(swRefs).size} recursos resolvidos`);

const graphEntries=['app-v208.js','pwa-world-v324.js','page-loader-v1.js','supreme-orb-core-v501.js','orb-ios-journey-core-v525.js','orb-universal-presence-v526.js','world-truth-registry-v535.js','orb-fluid-navigation-v535.js'];
const pending=[...graphEntries],visited=new Set(),missingImports=[];
while(pending.length){
  const file=pending.pop();
  if(visited.has(file)||!existsSync(join(root,file)))continue;
  visited.add(file);
  const source=read(file);
  const refs=[...source.matchAll(/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g)]
    .map(match=>match[1].replace(/^\.\//,'').split(/[?#]/)[0]);
  for(const ref of refs){
    if(!existsSync(join(root,ref)))missingImports.push(`${file} -> ${ref}`);
    else if(extname(ref)==='.js')pending.push(ref);
  }
}
add('grafo-modulos',missingImports.length===0,missingImports.length?missingImports.join('; '):`${visited.size} módulos locais resolvidos`);

const textExtensions=new Set(['.js','.mjs','.ts','.json','.sql','.html','.md','.txt']);
const secretPattern=/(?:sk_(?:live|test)_[A-Za-z0-9]{20,}|rk_(?:live|test)_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
const secretHits=[];
for(const name of readdirSync(root)){
  const path=join(root,name);
  if(!statSync(path).isFile()||!textExtensions.has(extname(name))||name==='qa-v535-fonte-verdade-orbe-fluida.mjs')continue;
  if(secretPattern.test(readFileSync(path,'utf8')))secretHits.push(name);
}
add('P0-sem-segredos-expostos',secretHits.length===0,secretHits.length?`revisar: ${secretHits.join(', ')}`:'nenhum valor secreto reconhecível no repositório');

blocked('owner-review-dispositivos-fisicos','medir a navegação da Orbe em iPhone, iPad e Android reais, retrato/paisagem, teclado, retorno e PWA');
blocked('owner-review-mfa','criar a conta verificada da proprietária e validar MFA AAL2 + códigos de recuperação');
blocked('owner-review-mesa-real','validar Mesa Real 13 × 6 autenticada, Premium e continuidade entre aparelhos');
blocked('owner-review-backup-restore','executar restauração real e registrar RPO/RTO antes de qualquer liberação');

const failed=checks.filter(check=>check.status==='FAIL');
const blockedChecks=checks.filter(check=>check.status==='BLOCKED');
const summary={
  total:checks.length,
  passed:checks.filter(check=>check.status==='PASS').length,
  failed:failed.length,
  blocked:blockedChecks.length
};
const status=failed.length?'FAIL':blockedChecks.length?'PASS_WITH_BLOCKERS':'PASS';
console.log(JSON.stringify({suite:'DIVINA-BRUXA-V535-FONTE-VERDADE-ORBE-FLUIDA',status,summary,checks},null,2));
process.exitCode=failed.length?1:0;
