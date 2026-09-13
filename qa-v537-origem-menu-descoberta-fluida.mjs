/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 3/14 · V537
   Execução: node qa-v537-origem-menu-descoberta-fluida.mjs */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const read=file=>readFileSync(join(root,file),'utf8');
const checks=[];
const add=(id,pass,detail)=>checks.push({id,status:pass?'PASS':'FAIL',detail});
const blocked=(id,detail)=>checks.push({id,status:'BLOCKED',detail});
const notRun=(id,detail)=>checks.push({id,status:'NOT RUN',detail});
const count=(source,needle)=>source.split(needle).length-1;
const moduleUrl=file=>`${pathToFileURL(join(root,file)).href}?qa=v537-${Date.now()}-${Math.random()}`;

const releaseFiles=[
  '00-INSTALE-V537-ORIGEM-MENU-DESCOBERTA-FLUIDA.txt','ARQUIVOS-V537-SHA256.txt',
  'MANIFESTO-V537-ORIGEM-MENU-DESCOBERTA-FLUIDA.json','QA-V537-ORIGEM-MENU-DESCOBERTA-FLUIDA.md',
  'qa-v537-origem-menu-descoberta-fluida.mjs','origin-discovery-v537.js','origin-discovery-v537.css',
  'app-v208.js','pwa-world-v324.js','sw.js','index.html','instalar-app.html','install-app.html',
  'instalar-aplicacion.html','page-loader-v1.js','orbital-menu-v502.js','tarot-livre-orbe-os-v517.js',
  'tarot-livre-orbe-os-v517.css','living-universe-core-v524.js'
];
for(const file of releaseFiles)add(`arquivo:${file}`,existsSync(join(root,file)),'presente no corte incremental V537');
for(const file of releaseFiles.filter(file=>extname(file)==='.js')){
  let valid=true;
  try{execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'ignore'});}catch{valid=false;}
  add(`sintaxe:${file}`,valid,valid?'JavaScript válido':'JavaScript inválido');
}

const discovery=read('origin-discovery-v537.js');
const discoveryCss=read('origin-discovery-v537.css');
const tarot=read('tarot-livre-orbe-os-v517.js');
const tarotCss=read('tarot-livre-orbe-os-v517.css');
const universe=read('living-universe-core-v524.js');
const menu=read('orbital-menu-v502.js');
const loader=read('page-loader-v1.js');
const app=read('app-v208.js');
const sw=read('sw.js');
const pwa=read('pwa-world-v324.js');
const index=read('index.html');

const discoveryModule=await import(moduleUrl('origin-discovery-v537.js'));
const contract=discoveryModule.ORIGIN_DISCOVERY_CONTRACT_V537;
add('contrato-v537',contract.release==='V537'&&contract.macroStage==='3-of-14','V537 é a Macroetapa 3/14');
add('contrato-17-realidades',contract.routeCount===17,'descoberta cobre 17 realidades');
add('contrato-cinco-trilhas',contract.trailCount===5,'cinco entradas por intenção');
add('contrato-home-orbe',contract.homeVisibleContent==='one-canonical-orb','Home visual permanece somente Orbe');
add('contrato-busca-local',contract.localSearch===true&&contract.networkRequests===0,'busca local sem rede');
add('contrato-performance',contract.performanceTargets.lcpP75Ms===2500&&contract.performanceTargets.inpP75Ms===150&&contract.performanceTargets.homeCls===0&&contract.performanceTargets.orbMenuLongTasks===0,'LCP/INP/CLS/long task registrados');
add('contrato-zero-loop',contract.permanentAnimationLoops===0,'descoberta sem loop permanente');
add('contrato-zero-privado',contract.privateContentReads===0&&contract.storageReads===0&&contract.storageWrites===0,'sem conteúdo privado ou storage');
add('contrato-uma-orbe',contract.independentOrbEngines===0,'nenhum motor de Orbe adicional');

const expectedTrails=["label:'Começar'","label:'Consultar uma carta'","label:'Fazer uma leitura'","label:'Estudar'","label:'Agendar'"];
add('descoberta-trilhas-oficiais',expectedTrails.every(label=>discovery.includes(label)),'cinco trilhas oficiais presentes');
add('descoberta-rotas-trilhas',[
  "route:'daily'","route:'library'","route:'tarot'","route:'school'","route:'consultations'"
].every(route=>discovery.includes(route)),'trilhas levam a destinos reais');
add('descoberta-fonte-verdade',discovery.includes('WORLD_ROUTES_V535')&&discovery.includes('normalizeWorldRouteV535'),'17 destinos vêm do Registro Vivo');
add('descoberta-local',!/(?:fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon)/.test(discovery),'nenhuma requisição de rede');
add('descoberta-sem-storage',!/(?:localStorage|sessionStorage|indexedDB)/.test(discovery),'nenhuma persistência');
add('descoberta-sem-loop',!/(?:requestAnimationFrame|setInterval|setTimeout)\s*\(/.test(discovery),'nenhum ciclo visual ou temporizador');
add('descoberta-texto-seguro',discovery.includes('textContent = label')&&discovery.includes('textContent = detail')&&!discovery.includes('innerHTML = this.query'),'consulta nunca é injetada como HTML');
add('descoberta-limite-consulta',discovery.includes("maxlength=\"80\"")&&discovery.includes('slice(0, 80)'),'busca limitada a 80 caracteres');
add('descoberta-acentos',discovery.includes("normalize('NFD')")&&discovery.includes('/[\\u0300-\\u036f]/g'),'busca tolera acentos');
add('descoberta-acessivel',discovery.includes("aria-live=\"polite\"")&&discovery.includes("aria-controls")&&discovery.includes("aria-expanded"),'estado e resultados acessíveis');
add('descoberta-contexto',discovery.includes("aria-label', 'Você está aqui'")&&discovery.includes('divina:context-route'),'breadcrumb e evento contextual reais');
add('descoberta-atalho-home',discovery.includes("this.go?.('home'")&&discovery.includes("source:'context-v537'"),'breadcrumb retorna à Origem');
add('descoberta-vitalidade',discovery.includes("this.vitality?.signal?.('orb:awake'")&&discovery.includes('divina:menu-state'),'integra V536 e ciclo do Menu');
add('descoberta-fecha-antes-rota',discovery.includes('await menu.close')&&discovery.includes('await Promise.resolve(this.go?.(route'),'fecha o Menu antes de abrir destino');
add('descoberta-css-sem-infinito',! /animation\s*:[^;]*infinite/.test(discoveryCss),'CSS sem animação infinita');
add('descoberta-css-compositor-curto',discoveryCss.includes('transition:background var(--db-life-response,80ms)')&&!discoveryCss.includes('filter:'),'feedback curto sem filtros animados');
add('descoberta-mobile',discoveryCss.includes('@media(max-width:760px)')&&discoveryCss.includes('@media(max-height:620px) and (orientation:landscape)'),'mobile e paisagem baixa tratados');
add('descoberta-toque-44',discoveryCss.includes('min-height:44px'),'controle principal com alvo mínimo de 44 px');

add('home-trava-css',discoveryCss.includes('#app>#home.home-orb-only-v206.active>:not(.orb-stage-ref):not(#orbStatus)'),'conteúdo editorial não reaparece na Home');
add('home-estrutura-unica',count(index,'id="home"')===1&&count(index,'id="orb"')===1&&count(index,'id="orbCanvas"')===1,'uma Home, uma Orbe e um canvas');
add('home-classe-orbe-only',/<section id="home" class="[^"]*\bactive\b[^"]*\bhome-orb-only-v206\b/.test(index),'Home usa contrato fechado aprovado');
const orbMarkup=index.match(/<button id="orb"[\s\S]*?<\/button>/)?.[0]||'';
add('home-sem-33',!/>\s*33\s*</.test(orbMarkup)&&!orbMarkup.includes('data-count="33"'),'sem número 33 dentro da Orbe');
add('home-sem-nome-isso',!orbMarkup.toLowerCase().includes('ísis')&&!orbMarkup.toLowerCase().includes('isis'),'Orbe sem nome rejeitado');

add('menu-treze-portais',count(menu,"route:'")===13,'13 portais orbitais aprovados');
add('menu-biblioteca',menu.includes("route:'library', label:'Biblioteca'"),'Biblioteca presente no anel');
add('menu-descoberta-completa',contract.routeCount===17&&menu.includes('innerRing:INNER.length')&&menu.includes('outerRing:OUTER.length'),'anel leve + mapa completo de 17');
add('menu-uma-orbe',menu.includes('oneLivingOrb:true')&&menu.includes('this.core.claim(this.host'),'mesma Orbe é reclamada pelo Menu');
add('menu-sem-chama',!/(?:pulseCelestialFlame|birthCelestialFlame|setCelestialFlame)/.test(menu),'Menu não ativa fogo');
add('menu-single-activate',menu.includes('if (this.navigating || !this.targetOpen) return'),'um portal por vez');

add('tarot-ponte-fluida',tarot.includes('class TarotFluencyBridgeV537')&&tarot.includes("mode = 'fire-removed-fluid-v537'")&&tarot.includes('targetFps = 0'),'ponte inerte substitui motor de fogo');
add('tarot-sem-motor-fogo',!/(?:CelestialFireBridge|pulseCelestialFlame|birthCelestialFlame|setCelestialFlame|this\.fire)/.test(tarot),'nenhuma ativação ou referência ao motor antigo');
add('tarot-sem-timer-fogo',!tarot.includes('arrivalTimer'),'timer de chegada da chama removido');
add('tarot-status-sem-fogo',count(tarot,'trueCelestialFire: false')===2&&count(tarot,'volumetricFire: false')===2&&count(tarot,'fireInsideUniverseCanvas:false')+count(tarot,'fireInsideUniverseCanvas: false')===2,'readiness e status declaram fogo removido');
add('tarot-texto-sem-chama',!tarot.includes('A chama reorganiza'),'texto de embaralhar agora pertence à Orbe');
add('tarot-css-sem-infinito',! /animation\s*:[^;]*infinite/.test(tarotCss),'seis animações decorativas infinitas eliminadas');
add('tarot-css-effects-off',tarotCss.includes('[data-effects]')&&tarotCss.includes('display: none !important'),'canvas de efeitos desativado');
add('tarot-transicoes-acao',tarotCss.includes('tl517-card-birth-flash')&&tarotCss.includes('tl517-mesa-pulse'),'transições curtas de ação preservadas');

add('universo-flag-fogo-off',universe.includes('export const CELESTIAL_FIRE_ENABLED_V537 = false'),'bloqueio oficial exportado');
add('universo-sem-shader-fogo',!/(?:u_flame|celestialFlame)/.test(universe),'shader de fogo removido do WebGL');
add('universo-sem-cpu-fogo',!/(?:this\.flame|updateFlame|drawCanvasFlame|setCelestialFlame|pulseCelestialFlame|birthCelestialFlame)/.test(universe),'estado, geometria, desenho e API de fogo removidos');
add('universo-status-fogo-off',universe.includes('trueCelestialFire:false')&&universe.includes('celestialFireActive:false')&&universe.includes("firePalette:'none'"),'status honesto e inativo');
add('universo-continua-unico',universe.includes("const ROOT_ID = 'divinaLivingUniverseV524'")&&universe.includes('oneUniverseCanvas:'),'um único Universo V524 permanece');
add('universo-orbe-imovel',universe.includes('physicalOrbTouchMotion:false'),'corpo da Orbe não se desloca');

add('loader-tarot-v537',count(loader,"tarot-livre-orbe-os-v517.js?v=537-no-fire")===2&&count(loader,"tarot-livre-orbe-os-v517.css?v=537-no-fire")===2,'loader e warmer exigem corte sem fogo');
add('app-importa-descoberta',app.includes("from './origin-discovery-v537.js?v=537'")&&app.includes('createOriginDiscoveryV537'),'V537 conectada ao runtime');
add('app-universo-sem-fogo',app.includes("living-universe-core-v524.js?v=537-no-fire")&&app.includes("stellarFire:'removed-v537'")&&app.includes('trueCelestialFire:false'),'app exige Universo sem fogo');
add('app-expone-v537',app.includes('window.divinaOriginDiscoveryReleaseV537')&&app.includes('discovery:originDiscovery'),'API pública e Orbe conectadas');
add('app-plano-v537',app.includes("release:'V537'")&&app.includes("currentMacroStage:'3-of-14'")&&app.includes('supremePlanMacroStages:14'),'Plano 3.0 permanece 3/14');
add('app-pwa-v537',app.includes('const RELEASE_EPOCH_V537 = 537')&&app.includes("register('./sw.js?v=537'")&&app.includes('startPwaAfterBootV537'),'epoch e cache alinhados');
add('app-preserva-v536',app.includes('createVitalityBusV536')&&app.includes('createLivingGrammarV536'),'Barramento e Gramática instalados permanecem');
add('app-whit-local',app.includes('whitLocalGuidanceRoutes:17')&&app.includes('whitModelCallsByV527:0')&&app.includes('whitExtraApiCalls:0'),'Whit básica continua local');

add('pwa-v537',pwa.includes('const VERSION=537')&&pwa.includes("__divinaSWBootstrap='v537'")&&pwa.includes("register('./sw.js?v=537'")&&pwa.includes('origem-menu-descoberta-v537'),'PWA alinhada');
add('sw-quatro-caches',sw.includes('const VERSION=537')&&count(sw,'divina-bruxa-v537-')===4,'quatro caches V537 isolados');
add('sw-descoberta-shell',sw.includes("'./origin-discovery-v537.js'")&&sw.includes("'./origin-discovery-v537.css'"),'descoberta funciona offline');
add('sw-recusa-antigo',sw.includes('/app-v208\\.js\\?v=537/'),'shell anterior não é aceito como V537');
add('index-v537',index.includes('manifest.webmanifest?v=537')&&index.includes('app-v208.js?v=537')&&index.includes("register('./sw.js?v=537'")&&index.includes('version:537'),'HTML alinhado');
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const source=read(file);
  add(`instalacao-v537:${file}`,source.includes('PWA V537')&&source.includes('manifest.webmanifest?v=537')&&source.includes('pwa-world-v324.js?v=537'),'página de instalação alinhada');
}

const tarotData=await import(moduleUrl('tarot-data.js'));
add('regressao-78-diretas',tarotData.CARDS.length===78&&new Set(tarotData.CARDS.map(card=>card.canonicalId)).size===78&&tarotData.CARDS.every(card=>card.orientation==='normal'),'78 cartas diretas e únicas');
const spreads=await import(moduleUrl('spreads-policy.js'));
add('regressao-mesa-real',spreads.ROYAL_TABLE_COLUMNS===13&&spreads.ROYAL_TABLE_ROWS===6&&spreads.ROYAL_TABLE_COUNT===78,'Mesa Real 13 × 6');
add('regressao-grade-seis',tarotCss.includes('grid-template-columns: repeat(6, minmax(0, 1fr))'),'Tarot Livre mantém 6 por fileira');
add('regressao-gesto-orbe',read('orb-engine-v208.js').includes('ORB_GESTURE_OUTCOMES_V208.DOUBLE_TAP'),'duplo toque continua abrindo Tarot uma vez');
add('regressao-navegacao',read('navigation.js').includes('setRouteRequest')&&app.includes('navigation.setRouteRequest(go)'),'navegação pública continua single-flight');
add('regressao-travas',app.includes('productionPublish:false')&&app.includes('realBilling:false')&&app.includes('storeSubmission:false')&&app.includes('sol:false'),'produção e autoridade fechadas');

const localRefs=[...index.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1]).filter(ref=>!ref.startsWith('#')&&!/^(?:https?:|mailto:|tel:|data:)/.test(ref))
  .map(ref=>ref.split(/[?#]/)[0]).filter(Boolean);
const missingIndex=[...new Set(localRefs)].filter(ref=>!existsSync(join(root,ref)));
add('integridade-index',missingIndex.length===0,missingIndex.length?`ausentes: ${missingIndex.join(', ')}`:`${new Set(localRefs).size} referências resolvidas`);
const swRefs=[...sw.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(match=>match[1].slice(2).split(/[?#]/)[0]);
const missingSw=[...new Set(swRefs)].filter(ref=>!existsSync(join(root,ref)));
add('integridade-sw',missingSw.length===0,missingSw.length?`ausentes: ${missingSw.join(', ')}`:`${new Set(swRefs).size} recursos resolvidos`);

blocked('fisico-fluidez-tarot','Validar 20 revelações, histórico, embaralhar e reset em iPhone/Android reais sem fogo, travamento ou tela preta.');
blocked('fisico-menu-descoberta','Validar abrir/buscar/navegar/voltar no Menu em iPhone/Android, retrato e paisagem.');
blocked('web-vitals-reais','Medir LCP p75 ≤ 2,5 s, INP p75 ≤ 150 ms, CLS Home 0,000 e zero long task da Orbe/Menu em tráfego real.');
blocked('acessibilidade-fisica','Validar VoiceOver/TalkBack, foco, teclado e movimento reduzido em aparelhos reais.');
notRun('browser-headless','Executor sem binário Chromium; percurso Home/Menu/Busca/Tarot não foi classificado como PASS.');

const totals=checks.reduce((sum,item)=>(sum[item.status]++,sum),{PASS:0,FAIL:0,BLOCKED:0,'NOT RUN':0});
const status=totals.FAIL?'FAIL':totals.BLOCKED?'PASS_WITH_BLOCKERS':'PASS';
console.log(`V537 ${status} · ${checks.length} TOTAL · ${totals.PASS} PASS · ${totals.FAIL} FAIL · ${totals.BLOCKED} BLOCKED · ${totals['NOT RUN']} NOT RUN`);
for(const item of checks)console.log(`${item.status.padEnd(7)} ${item.id} — ${item.detail}`);
if(totals.FAIL)process.exitCode=1;
