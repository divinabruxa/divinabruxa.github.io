/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 2/14 · V536
   Execução: node qa-v536-vitalidade-gramatica-viva.mjs */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const read=file=>readFileSync(join(root,file),'utf8');
const checks=[];
const add=(id,pass,detail)=>checks.push({id,status:pass?'PASS':'FAIL',detail});
const blocked=(id,detail)=>checks.push({id,status:'BLOCKED',detail});
const count=(source,needle)=>source.split(needle).length-1;
const moduleUrl=file=>`${pathToFileURL(join(root,file)).href}?qa=v536-${Date.now()}-${Math.random()}`;

const payloadFiles=[
  'vitality-bus-v536.js','living-grammar-v536.js','living-grammar-v536.css',
  'app-v208.js','pwa-world-v324.js','sw.js','index.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];
for(const file of payloadFiles)add(`arquivo:${file}`,existsSync(join(root,file)),'presente no corte incremental V536');
for(const file of payloadFiles.filter(file=>extname(file)==='.js')){
  let valid=true;
  try{execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'ignore'});}catch{valid=false;}
  add(`sintaxe:${file}`,valid,valid?'JavaScript válido':'JavaScript inválido');
}

const vitalitySource=read('vitality-bus-v536.js');
const grammarSource=read('living-grammar-v536.js');
const grammarCss=read('living-grammar-v536.css');
const app=read('app-v208.js');
const sw=read('sw.js');
const pwa=read('pwa-world-v324.js');
const index=read('index.html');
const navigation=read('navigation.js');
const supreme=read('supreme-orb-core-v501.js');

const vitalityModule=await import(moduleUrl('vitality-bus-v536.js'));
const contract=vitalityModule.VITALITY_CONTRACT_V536;
add('contrato-release',contract.release==='V536'&&contract.macroStage==='2-of-14','V536 é a Macroetapa 2/14');
add('contrato-oito-fases',contract.phases.join(',')==='rest,intent,transition,loading,present,ready,recovering,paused','oito fases previsíveis');
add('contrato-sinais-oficiais',contract.signals.length===18&&new Set(contract.signals).size===18,'18 sinais semânticos únicos');
add('contrato-evento-unico',contract.dispatchEvent==='divina:vitality','um evento público de estado');
add('contrato-zero-loops',contract.permanentAnimationLoops===0,'zero loops permanentes');
add('contrato-zero-privado',contract.privateContentReads===0&&contract.formValueReads===0,'zero leitura privada ou de formulários');
add('contrato-zero-storage',contract.storageReads===0&&contract.storageWrites===0,'zero persistência pelo barramento');
add('contrato-zero-api',contract.apiCalls===0,'zero API');

add('barramento-event-driven',!/(?:requestAnimationFrame|setInterval)\s*\(/.test(vitalitySource)&&vitalitySource.includes('queueMicrotask'),'coalescimento por microtarefa, sem ciclo visual');
add('barramento-sanitiza-detalhes',vitalitySource.includes("for (const key of ['id','route','from','to','source','reason','kind','mode','state','recoverable'])")&&vitalitySource.includes('publicDetail(detail)'),'somente escalares públicos permitidos');
add('barramento-sem-campos',!/(?:querySelector|querySelectorAll|FormData|\.value\b|textContent|innerHTML)/.test(vitalitySource),'não consulta DOM de conteúdo ou campo');
add('barramento-sem-storage-rede',!/(?:localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|WebSocket)/.test(vitalitySource),'não lê storage nem rede');
add('barramento-historico-limitado',vitalitySource.includes('const HISTORY_LIMIT = 24')&&vitalitySource.includes('this.history.shift()'),'telemetria efêmera limitada a 24 sinais');
add('barramento-assinatura-cancelavel',vitalitySource.includes("options.signal?.addEventListener?.('abort'")&&vitalitySource.includes('unsubscribe'),'assinaturas podem ser encerradas');
add('barramento-instancia-unica',vitalitySource.includes("Symbol.for('divina.vitality.bus.v536')")&&vitalitySource.includes('if (globalThis[INSTANCE])'),'instância única reutilizada');
add('barramento-registro-central',vitalitySource.includes("from './world-truth-registry-v535.js?v=535'")&&vitalitySource.includes('worldForRouteV535'),'rotas e famílias vêm da fonte instalada');
add('barramento-recuperacao',vitalitySource.includes("'divina:page-error','divina:route-error','divina:supreme-orb-navigation-error'")&&vitalitySource.includes("phase:'recovering'"),'erros viram recuperação explícita');
add('barramento-offline',vitalitySource.includes("'network:online','network:offline'")&&vitalitySource.includes("on(globalThis, 'offline'"),'estado de conexão incluído');
add('barramento-visibilidade',vitalitySource.includes("on(document, 'visibilitychange'")&&vitalitySource.includes("phase:'paused'"),'segundo plano vira pausa');
add('barramento-menu',vitalitySource.includes("'divina:menu-state'")&&vitalitySource.includes('MENU_STATES.has(menu)'),'menu usa a mesma linguagem');
add('barramento-orbe',[
  'divina:supreme-orb-pulse','divina:supreme-orb-intent','divina:supreme-orb-will-navigate','divina:supreme-orb-did-navigate'
].every(event=>vitalitySource.includes(event)),'Orbe publica despertar, intenção, viagem e presença');
add('barramento-paginas',[
  'divina:route-start','divina:route-ready','divina:page-loading','divina:page-deferred','divina:page-ready'
].every(event=>vitalitySource.includes(event)),'rotas e módulos convergem no mesmo estado');

add('gramatica-fonte-unica',grammarSource.includes('bus.subscribe')&&!grammarSource.includes('addEventListener('),'Gramática consome somente o barramento');
add('gramatica-sem-loop',!/(?:requestAnimationFrame|setInterval|setTimeout)\s*\(/.test(grammarSource),'nenhum loop ou temporizador');
add('gramatica-sem-conteudo',!/(?:innerHTML|textContent|\.value\b|FormData|querySelectorAll)/.test(grammarSource),'não reescreve conteúdo ou campos');
add('gramatica-sem-rede-storage',!/(?:fetch\s*\(|localStorage|sessionStorage|indexedDB)/.test(grammarSource),'zero rede e storage');
add('gramatica-atributos',count(grammarSource,"'life")>=10&&grammarSource.includes('lifeWorldFamily')&&grammarSource.includes('lifeRecovery'),'11 atributos semânticos públicos');
add('gramatica-sem-efeito',grammarCss.includes('Nenhum efeito')&&!/(?:animation\s*:|filter\s*:|box-shadow\s*:|transform\s*:)/.test(grammarCss),'CSS contém somente tokens');
add('gramatica-reduced-motion',grammarCss.includes('data-life-motion="reduced"')&&grammarCss.includes('--db-life-journey:0ms'),'movimento reduzido zera tempos sem esconder conteúdo');
add('gramatica-jornada-v535',grammarCss.includes('--db-life-journey:442ms'),'token nominal preserva orçamento tátil instalado');
add('gramatica-descricao-real',grammarSource.includes('worldForRouteV535(rawRoute)')&&grammarSource.includes('purpose:world.purpose'),'descrição vem do Registro Vivo');

add('app-importa-v536',app.includes("from './vitality-bus-v536.js?v=536'")&&app.includes("from './living-grammar-v536.js?v=536'"),'dois núcleos integrados no app');
add('app-ordem-v536',app.indexOf('createVitalityBusV536()')<app.indexOf("supremeOrb = safely('Núcleo da Orbe Suprema V501'"),'barramento escuta antes do despertar da Orbe');
add('app-expone-v536',app.includes('window.divinaVitalityReleaseV536')&&app.includes('vitality:vitalityBus')&&app.includes('grammar:livingGrammar'),'API e Orbe compartilham o estado');
add('app-macro-v536',app.includes("release:'V536'")&&app.includes("currentMacroStage:'2-of-14'")&&app.includes('supremePlanMacroStages:14'),'Plano 3.0 continua em 2/14');
add('app-corte-v536',app.includes('const RELEASE_EPOCH_V536 = 536')&&app.includes("register('./sw.js?v=536'")&&app.includes('startPwaAfterBootV536'),'app, cache e atualização alinhados');
add('app-zero-custo-v536',app.includes('vitalityPermanentAnimationLoops:0')&&app.includes('vitalityPrivateContentReads:0')&&app.includes('vitalityApiCalls:0'),'limites publicados no boot');

add('pwa-v536',pwa.includes('const VERSION=536')&&pwa.includes("__divinaSWBootstrap='v536'")&&pwa.includes("register('./sw.js?v=536'")&&pwa.includes('vitalidade-gramatica-viva-v536'),'PWA alinhada');
add('sw-quatro-caches-v536',sw.includes('const VERSION=536')&&count(sw,'divina-bruxa-v536-')===4,'quatro caches V536 isolados');
add('sw-nucleos-obrigatorios',sw.includes("'./vitality-bus-v536.js'")&&sw.includes("'./living-grammar-v536.js'")&&sw.includes("'./living-grammar-v536.css'"),'V536 pertence ao shell offline');
add('sw-recusa-shell-antigo',sw.includes('/app-v208\\.js\\?v=536/'),'validação não aceita index V535');
add('index-v536',index.includes('manifest.webmanifest?v=536')&&index.includes('app-v208.js?v=536')&&index.includes("register('./sw.js?v=536'")&&index.includes('version:536'),'bootstrap HTML alinhado');
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const source=read(file);
  add(`instalacao-v536:${file}`,source.includes('PWA V536')&&source.includes('manifest.webmanifest?v=536')&&source.includes('pwa-world-v324.js?v=536'),'página de instalação alinhada');
}

add('regressao-uma-orbe',count(index,'id="orb"')===1&&count(index,'id="orbCanvas"')===1,'uma Orbe física e um canvas principal');
const orbMarkup=index.match(/<button id="orb"[\s\S]*?<\/button>/)?.[0]||'';
add('regressao-orbe-sem-33',!/>\s*33\s*</.test(orbMarkup)&&!orbMarkup.includes('data-count="33"'),'sem número ou lista dentro da Orbe');
add('regressao-navegacao-unica',navigation.includes('setRouteRequest')&&app.includes('navigation.setRouteRequest(go)'),'data-go continua pela Orbe Suprema');
add('regressao-sem-scroll-concorrente',navigation.includes("window.scrollTo({ top: 0, behavior: 'auto' })"),'troca de rota sem smooth scroll concorrente');
add('regressao-single-flight',supreme.includes("navigationAuthority:'v535-single-flight'")&&supreme.includes('divina:supreme-orb-navigation-coalesced'),'uma viagem por vez preservada');
add('regressao-corpo-imovel',supreme.includes('physicalTouchMotion:false'),'matéria reage; corpo não se desloca');
add('regressao-whit-local',app.includes('whitLocalGuidanceRoutes:17')&&app.includes('whitModelCallsByV527:0')&&app.includes('whitExtraApiCalls:0'),'Whit básica segue local e sem API paga');
add('regressao-travas',app.includes('productionPublish:false')&&app.includes('realBilling:false')&&app.includes('storeSubmission:false')&&app.includes('sol:false'),'produção e autoridade permanecem fechadas');

const localRefs=[...index.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1]).filter(ref=>!ref.startsWith('#')&&!/^(?:https?:|mailto:|tel:|data:)/.test(ref))
  .map(ref=>ref.split(/[?#]/)[0]).filter(Boolean);
const missingIndex=[...new Set(localRefs)].filter(ref=>!existsSync(join(root,ref)));
add('integridade-index',missingIndex.length===0,missingIndex.length?`ausentes: ${missingIndex.join(', ')}`:`${new Set(localRefs).size} referências locais resolvidas`);
const swRefs=[...sw.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(match=>match[1].slice(2).split(/[?#]/)[0]);
const missingSw=[...new Set(swRefs)].filter(ref=>!existsSync(join(root,ref)));
add('integridade-sw',missingSw.length===0,missingSw.length?`ausentes: ${missingSw.join(', ')}`:`${new Set(swRefs).size} recursos locais resolvidos`);

const tarot=await import(moduleUrl('tarot-data.js'));
add('regressao-tarot-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.canonicalId)).size===78&&tarot.CARDS.every(card=>card.orientation==='normal'),'78 cartas diretas e únicas');
const spreads=await import(moduleUrl('spreads-policy.js'));
add('regressao-mesa-13x6',spreads.ROYAL_TABLE_COLUMNS===13&&spreads.ROYAL_TABLE_ROWS===6&&spreads.ROYAL_TABLE_COUNT===78,'Mesa Real 13 × 6');
add('regressao-grade-6',read('tarot-livre-orbe-os-v517.css').includes('grid-template-columns: repeat(6, minmax(0, 1fr))'),'Tarot Livre mantém 6 colunas');

blocked('fisico-fluidez','Validar Home → Menu → Tarot → voltar em iPhone e Android reais; nenhum travamento perceptível.');
blocked('fisico-acessibilidade','Validar VoiceOver/TalkBack e movimento reduzido em aparelhos reais.');
blocked('seguranca-admin-mfa','Validar login owner, AAL2, RLS e 403 de usuária comum no ambiente conectado.');
blocked('premium-mesa-real','Validar Mesa Real 78 Premium autenticada no STAGING, sem cobrança real.');

const totals=checks.reduce((sum,item)=>(sum[item.status]++,sum),{PASS:0,FAIL:0,BLOCKED:0});
const status=totals.FAIL?'FAIL':totals.BLOCKED?'PASS_WITH_BLOCKERS':'PASS';
console.log(`V536 ${status} · ${checks.length} TOTAL · ${totals.PASS} PASS · ${totals.FAIL} FAIL · ${totals.BLOCKED} BLOCKED`);
for(const item of checks)console.log(`${item.status.padEnd(7)} ${item.id} — ${item.detail}`);
if(totals.FAIL)process.exitCode=1;
