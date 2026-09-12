/* DIVINA BRUXA — QA SUPREMO, EVIDENCIAS E ENTREGA · V534
   Execucao: node qa-v534-supreme.mjs */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root=process.cwd();
const read=file=>readFileSync(join(root,file),'utf8');
const checks=[];
const add=(id,pass,detail)=>checks.push({id,status:pass?'PASS':'FAIL',detail});
const blocked=(id,detail)=>checks.push({id,status:'BLOCKED',detail});
const occurrences=(source,needle)=>source.split(needle).length-1;

const releaseFiles=[
  'account-consultations-world-v319.js','page-loader-v1.js',
  'qa-supreme-core-v534.css','qa-supreme-core-v534.js',
  'app-v208.js','index.html','sw.js','pwa-world-v324.js',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];

releaseFiles.forEach(file=>add(`arquivo:${file}`,existsSync(join(root,file)),'presente no corte V534'));

for(const file of releaseFiles.filter(file=>file.endsWith('.js'))){
  let pass=true;
  try{execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'ignore'});}catch{pass=false;}
  add(`sintaxe:${file}`,pass,pass?'JavaScript valido':'JavaScript invalido');
}

for(const file of releaseFiles.filter(file=>file.endsWith('.css'))){
  const source=read(file);
  const open=(source.match(/\{/g)||[]).length;
  const close=(source.match(/\}/g)||[]).length;
  add(`css:${file}`,open===close,`${open}/${close} chaves`);
}

const consultations=read('account-consultations-world-v319.js');
add('P1-consultas-ancora-segura',consultations.includes("sanctuary.insertAdjacentElement('afterend',world)")&&consultations.includes('sanctuary?.parentElement'),'o mundo e inserido ao lado do santuario no pai real');
add('P1-consultas-insertBefore-invalido-removido',!consultations.includes('this.root.insertBefore(world,sanctuary.nextSibling)'),'a chamada que gerava NotFoundError nao existe');

const loader=read('page-loader-v1.js');
add('P1-consultas-cache-bust-loader',occurrences(loader,"account-consultations-world-v319.js?v=534-consultations-anchor")===2,'loader e warmer apontam para o reparo V534');

const qaCss=read('qa-supreme-core-v534.css');
add('P1-menu-acima-do-dock',qaCss.includes('var(--db534-dock-height) + var(--db534-dock-bottom) + var(--db534-menu-dock-gap)')&&qaCss.includes('safe-area-inset-bottom'),'dica respeita altura, afastamento e safe-area do dock');
add('P1-menu-altura-comprimida',/@media\(max-height:690px\)[\s\S]*?\.db502-menu__hint\{display:none!important\}/.test(qaCss),'dica nao disputa espaco em telas baixas');
add('P1-alvos-tateis-essenciais',qaCss.includes('@media(pointer:coarse)')&&qaCss.includes('min-block-size:44px')&&qaCss.includes('.consultation-email-contact')&&qaCss.includes('.ec530-video-note>a[href]'),'CTAs de suporte, Spotify e YouTube tem 44 px no toque');
add('preservacao-visual-qa-css',!/#home|\.orb-shell|#orbCanvas|\.home-copy/.test(qaCss),'camada V534 nao estiliza Home nem Orbe');

const qaCore=read('qa-supreme-core-v534.js');
add('contrato-macroetapa-10',qaCore.includes("macroStage:'10-of-10'")&&qaCore.includes("release:'V534'"),'contrato V534/10 de 10');
add('contrato-sem-producao',qaCore.includes('productionReady:false')&&qaCore.includes('realBilling:false')&&qaCore.includes('productionPublish:false')&&qaCore.includes('dnsChanges:false')&&qaCore.includes('storeSubmission:false')&&qaCore.includes('sol:false'),'travas de autoridade fechadas');
add('contrato-sem-dados-privados',qaCore.includes('privateContentReads:0')&&qaCore.includes('formValueReads:0')&&qaCore.includes('storageReads:0')&&qaCore.includes('apiCalls:0'),'QA observa apenas estrutura e geometria publica');
add('contrato-owner-review-honesto',qaCore.includes("ownerReviewState:'blocked-pending-manual-evidence'")&&qaCore.includes('productionReady:false'),'nenhuma prontidao e declarada sem evidencia manual');

const app=read('app-v208.js');
add('app-carrega-qa-v534',app.includes("createQaSupremeCoreV534 } from './qa-supreme-core-v534.js?v=534'")&&app.includes('window.divinaQaSupremeReleaseV534'),'QA V534 ligado ao runtime');
add('app-carrega-consultas-reparada',app.includes("account-consultations-world-v319.js?v=534-consultations-anchor")&&app.includes("page-loader-v1.js?v=534-consultations-anchor"),'imports criticos com cache-bust');
add('app-corte-pwa-v534',app.includes("const RELEASE_EPOCH_V534 = 534")&&app.includes("register('./sw.js?v=534'")&&app.includes('startPwaAfterBootV534'),'epoch e registro V534');
add('app-preserva-universos',[
  'living-universe-core-v524.js','whit-core-supreme-v527.js','tarot-universe-core-v528.js',
  'wisdom-universe-core-v529.js','experience-conversion-core-v530.js',
  'identity-rights-core-v531.js','responsive-enchantment-core-v533.js'
].every(file=>app.includes(file)),'V524–V533 continuam conectadas');

const index=read('index.html');
add('index-corte-v534',index.includes('app-v208.js?v=534')&&index.includes('manifest.webmanifest?v=534')&&index.includes("register('./sw.js?v=534'")&&index.includes('version:534'),'app, manifesto e bootstrap alinhados');
add('home-orbe-preservadas',occurrences(index,'id="home"')===1&&occurrences(index,'id="orb"')===1&&index.includes('class="orb-stage-ref"')&&index.includes('id="orbCanvas"'),'Home e Orbe canonicas continuam unicas');

const sw=read('sw.js');
add('sw-caches-v534',sw.includes('const VERSION=534')&&occurrences(sw,'divina-bruxa-v534-')===4,'quatro caches V534 isolados');
add('sw-shell-v534',sw.includes("'./app-v208.js'")&&sw.includes("'./page-loader-v1.js'")&&sw.includes("'./qa-supreme-core-v534.js'")&&sw.includes("'./qa-supreme-core-v534.css'"),'shell exige os arquivos novos; imports do app fazem o cache-bust');
add('sw-consultas-v534',sw.includes("'./account-consultations-world-v319.js'")&&app.includes("account-consultations-world-v319.js?v=534-consultations-anchor"),'reparo entra no cache novo e o runtime exige a revisao V534');
add('sw-shell-recusa-index-antigo',sw.includes('/app-v208\\.js\\?v=534/'),'navegacao nao grava shell anterior como atual');
add('sw-dados-autoridade-fora-cache',sw.includes('if(isAuthorityRequest(request,url))')&&sw.includes("request.headers.has('authorization')")&&sw.includes("request.cache==='no-store'"),'Auth, Admin, billing, IA e Consultas seguras permanecem fora do cache');

const pwa=read('pwa-world-v324.js');
add('pwa-v534',pwa.includes('const VERSION=534')&&pwa.includes("__divinaSWBootstrap='v534'")&&pwa.includes("register('./sw.js?v=534'")&&pwa.includes("recovery:'qa-supreme-v534'"),'autoridade PWA alinhada');

for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const source=read(file);
  add(`instalacao-v534:${file}`,source.includes('PWA V534')&&source.includes('manifest.webmanifest?v=534')&&source.includes('pwa-world-v324.js?v=534'),'pagina de instalacao alinhada');
}

const routeSource=read('route-registry-v180.js');
const routeIds=[...routeSource.matchAll(/\{ id:'([^']+)'/g)].map(match=>match[1]);
const expectedRoutes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
add('rotas-17',routeIds.length===17&&expectedRoutes.every((id,index)=>routeIds[index]===id),`${routeIds.length}/17 rotas na ordem canonica`);

const standaloneModule=async file=>{
  const source=read(file);
  const url=`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return import(url);
};

const tarot=await standaloneModule('tarot-data.js');
add('tarot-78-diretas',tarot.CARDS.length===78&&tarot.REQUIRED_ORIENTATION==='normal'&&tarot.CARDS.every(card=>card.orientation==='normal'),'78/78 cartas com orientacao normal');
add('tarot-identidades-unicas',new Set(tarot.CARDS.map(card=>card.id)).size===78&&new Set(tarot.CARDS.map(card=>card.canonicalId)).size===78,'IDs numericos e canonicos sem repeticao');

const spreads=await standaloneModule('spreads-policy.js');
add('tiragens-15',spreads.SPREADS.length===15,'15 metodos canonicos');
add('cruz-celta-10',spreads.CELTIC_CROSS_POSITIONS.length===10,'10 posicoes tradicionais');
add('mesa-real-13x6',spreads.ROYAL_TABLE_COLUMNS===13&&spreads.ROYAL_TABLE_ROWS===6&&spreads.ROYAL_TABLE_COUNT===78,'13 colunas x 6 linhas = 78 cartas');
add('tarot-livre-seis-por-linha',read('tarot-livre-orbe-os-v517.css').includes('grid-template-columns: repeat(6, minmax(0, 1fr))'),'grade canonica de 6 cartas por linha');
add('tarot-sem-repeticao-runtime',read('tarot-session.js').includes('normalOnly: true')&&read('tarot-livre-orbe-os-v517.js').includes('noRepeats:'),'sessao e diagnostico mantem o contrato');

const commercial=await standaloneModule('commercial-truth-v200.js');
const truth=commercial.COMMERCIAL_TRUTH_V200;
add('verdade-comercial-staging',truth.environment==='staging'&&truth.realBilling===false&&truth.checkoutEnabled===false,'STAGING, billing real e checkout desligados');
add('precos-consultas',truth.services.map(service=>service.priceCents).join(',')==='50000,50000,30000,15000','R$500, R$500, R$300 e R$150 em centavos');
add('premium-ia-separados',truth.plans.find(plan=>plan.id==='premium')?.includesAI===false&&truth.plans.find(plan=>plan.id==='orbe-ia')?.creditsPerCycle===400,'Premium nao inclui IA; plano IA tem 400 creditos');

const localRefs=[...index.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1]).filter(ref=>!ref.startsWith('#')&&!/^(?:https?:|mailto:|tel:|data:)/.test(ref))
  .map(ref=>ref.split(/[?#]/)[0]).filter(Boolean);
const missingIndexRefs=[...new Set(localRefs)].filter(ref=>!existsSync(join(root,ref)));
add('index-referencias-locais',missingIndexRefs.length===0,missingIndexRefs.length?`ausentes: ${missingIndexRefs.join(', ')}`:`${new Set(localRefs).size} referencias resolvidas`);

const swRefs=[...sw.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(match=>match[1].slice(2).split(/[?#]/)[0]);
const missingSwRefs=[...new Set(swRefs)].filter(ref=>!existsSync(join(root,ref)));
add('sw-referencias-locais',missingSwRefs.length===0,missingSwRefs.length?`ausentes: ${missingSwRefs.join(', ')}`:`${new Set(swRefs).size} recursos resolvidos`);

const graphEntries=['app-v208.js','pwa-world-v324.js','qa-supreme-core-v534.js','page-loader-v1.js'];
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
add('grafo-modulos',missingImports.length===0,missingImports.length?missingImports.join('; '):`${visited.size} modulos locais resolvidos`);

const textExtensions=new Set(['.js','.mjs','.ts','.json','.sql','.html','.md','.txt']);
const secretPattern=/(?:sk_(?:live|test)_[A-Za-z0-9]{20,}|rk_(?:live|test)_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
const secretHits=[];
for(const name of readdirSync(root)){
  const path=join(root,name);
  if(!statSync(path).isFile()||!textExtensions.has(extname(name))||name==='qa-v534-supreme.mjs')continue;
  if(secretPattern.test(readFileSync(path,'utf8')))secretHits.push(name);
}
add('P0-sem-segredos-expostos',secretHits.length===0,secretHits.length?`revisar: ${secretHits.join(', ')}`:'nenhum valor secreto reconhecivel no repositorio');

blocked('owner-review-dispositivos-fisicos','executar iPhone, iPad e Android reais em retrato/paisagem, teclado, retorno e PWA');
blocked('owner-review-mfa','criar a conta verificada da proprietaria e validar MFA AAL2 + codigos de recuperacao');
blocked('owner-review-mesa-real','validar Mesa Real 13x6 autenticada, Premium e continuidade entre aparelhos');
blocked('owner-review-backup-restore','executar restauracao real e registrar RPO/RTO antes de qualquer liberacao');

const failed=checks.filter(check=>check.status==='FAIL');
const blockedChecks=checks.filter(check=>check.status==='BLOCKED');
const summary={
  total:checks.length,
  passed:checks.filter(check=>check.status==='PASS').length,
  failed:failed.length,
  blocked:blockedChecks.length
};
const status=failed.length?'FAIL':blockedChecks.length?'PASS_WITH_BLOCKERS':'PASS';
console.log(JSON.stringify({suite:'DIVINA-BRUXA-QA-SUPREMO-V534',status,summary,checks},null,2));
process.exitCode=failed.length?1:0;
