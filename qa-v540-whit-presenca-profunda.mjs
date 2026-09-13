import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const checks=[];
const add=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const payload=[
  'whit-local-guide-v540.js','whit-presence-deep-v540.js','whit-presence-deep-v540.css',
  'ai-engine.js','ai-policy.js','page-loader-v1.js','app-v208.js','pwa-world-v324.js','sw.js','index.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];
payload.forEach(file=>add(`arquivo:${file}`,exists(file)));

const stamp=`?qa=${Date.now()}`;
const local=await import(pathToFileURL(path.join(root,'whit-local-guide-v540.js')).href+stamp);
const policy=await import(pathToFileURL(path.join(root,'ai-policy.js')).href+stamp);
const tarot=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+stamp);
const school=await import(pathToFileURL(path.join(root,'school-policy.js')).href+stamp);

const required=['OBSERVAÇÃO','POSSIBILIDADE','LIMITE','PRÓXIMO GESTO'];
for(const sample of [
  {message:'Quero entender esta carta do Tarot.',focus:'tarot',mode:'luna'},
  {message:'Estou estudando uma aula da Escola.',focus:'school',mode:'luna'},
  {message:'Tenho uma decisão entre dois caminhos.',focus:'reflection',mode:'terra'},
  {message:'Estou ansiosa e quero organizar o que sinto.',focus:'reflection',mode:'luna'},
  {message:'Quero criar uma parte verdadeira do meu projeto.',focus:'reflection',mode:'terra'}
]){
  const answer=local.createLocalWhitResponse(sample);
  add(`local:estrutura:${sample.focus}:${sample.mode}`,required.every(label=>answer.content.includes(label)));
  add(`local:zero-rede-modelo-credito:${sample.message.slice(0,12)}`,answer.networkCalls===0&&answer.modelCalls===0&&answer.creditsUsed===0);
}

const crisis=local.createLocalWhitResponse({message:'Eu quero morrer e não aguento mais viver.',focus:'tarot',mode:'terra'});
add('seguranca:risco-imediato-interceptado',crisis.safetyIntercepted===true);
add('seguranca:risco-sem-simbolizar',crisis.content.includes('não vou transformar isso em símbolo')&&crisis.content.includes('apoio humano'));
for(const message of ['Qual remédio devo tomar e qual dose?','Preciso de aconselhamento para um processo judicial.','Devo investir todo meu dinheiro nesta aposta?']){
  add(`seguranca:alto-risco:${message.slice(0,12)}`,local.createLocalWhitResponse({message}).safetyIntercepted===true);
}

const contract=local.WHIT_LOCAL_CONTRACT_V540;
add('privacidade:mensagem-enviada-apenas',contract.usesOnlySubmittedMessage===true);
add('privacidade:sem-leituras-silenciosas',contract.readsJournalSilently===false&&contract.readsSchoolNotesSilently===false&&contract.readsTarotQuestionSilently===false&&contract.privateReads===0);
add('privacidade:sem-api-modelo-creditos',contract.networkCalls===0&&contract.modelCalls===0&&contract.creditsUsed===0);
add('honestidade:sem-consciencia-telepatia',contract.claimsConsciousness===false&&contract.claimsMindReading===false);

add('modos:luna-1',policy.AI_POLICY.modes.luna.cost===1&&policy.AI_POLICY.modes.luna.enabled===true);
add('modos:terra-10',policy.AI_POLICY.modes.terra.cost===10&&policy.AI_POLICY.modes.terra.enabled===true);
add('modos:sol-off',policy.AI_POLICY.modes.sol.cost===0&&policy.AI_POLICY.modes.sol.enabled===false);
const requestA=policy.createAIRequest({message:'teste',mode:'luna'});
const requestB=policy.createAIRequest({message:'teste',mode:'luna'});
add('online:idempotencia-request-id',requestA.requestId!==requestB.requestId&&requestA.requestId.length>=32&&requestB.requestId.length>=32);
add('online:consentimento-explicito',requestA.consent===true);
add('online:contexto-limitado',policy.AI_POLICY.limits.maxContextMessages===12);
add('online:schema-compativel',policy.AI_SCHEMA_VERSION==='8.0.0'&&read('whit-generation-bridge-v313.js').includes("const EXPECTED_SCHEMA = '8.0.0'"));

const engine=read('ai-engine.js');
const deep=read('whit-presence-deep-v540.js');
const css=read('whit-presence-deep-v540.css');
const app=read('app-v208.js');
const loader=read('page-loader-v1.js');
const pwa=read('pwa-world-v324.js');
const sw=read('sw.js');
const index=read('index.html');

add('experiencia:local-padrao',engine.includes("settings?.delivery === 'online' ? 'online' : 'local'"));
add('experiencia:local-sem-conta',engine.includes("this.root.querySelector('[data-ai-auth-gate]').hidden = local || signedIn"));
add('experiencia:contexto-visivel-removivel',engine.includes('data-ai-context-slot')&&engine.includes('data-ai-remove-context'));
add('experiencia:quatro-fases',['listening','forming','answering','silence'].every(phase=>engine.includes(`data-phase="${phase}"`)));
add('experiencia:proveniencia-visivel',engine.includes('LOCAL · SEM API')&&engine.includes('ONLINE · SERVIDOR'));
add('falha:rascunho-preservado',engine.includes('preserveDraft(content)')&&engine.includes('preserveDraft(pendingRequest.content)'));
add('creditos:ciclo-visivel',['reservation','confirmed','released'].every(state=>engine.includes(`'${state}'`)));
add('acessibilidade:log-polite',engine.includes('role="log" aria-live="polite"'));
add('acessibilidade:radio-semantico',engine.includes('role="radiogroup"')&&engine.includes('role="radio"'));
add('mobile:teclado-scroll',css.includes('scroll-padding-bottom:calc(210px + env(safe-area-inset-bottom))'));

add('presenca:mesma-orbe',deep.includes('sameCanonicalOrb:true')&&deep.includes("canonicalOrb:'V501'"));
add('presenca:metadado-publico-apenas',deep.includes('publicPhaseMetadataOnly:true')&&deep.includes('privateContentIncluded !== false'));
add('presenca:zero-storage-rede-modelo',!deep.includes('localStorage')&&!deep.includes('sessionStorage')&&deep.includes('storageReads:0')&&deep.includes('networkCalls:0')&&deep.includes('modelCalls:0'));
add('fluidez:sem-loop-novo',!css.includes('infinite')&&!deep.includes('requestAnimationFrame'));
add('fluidez:animacoes-antigas-neutralizadas',css.includes('#whitPresenceV307 *')&&css.includes('#whitMindV312Panel *')&&css.includes('animation:none!important'));
add('fluidez:sem-blur-whit',css.includes('backdrop-filter:none!important'));
add('fluidez:reduced-motion',css.includes('@media(prefers-reduced-motion:reduce)'));

add('pwa:whit-local-offline',sw.includes("'./whit-local-guide-v540.js'")&&sw.includes("'./ai-engine.js'")&&sw.includes("'./ai-policy.js'"));
add('pwa:whit-local-nao-bloqueada',!pwa.includes("#ai button[type=\"submit\"]")&&!pwa.includes("#ai button[type='submit']"));
add('release:app-v540',app.includes("release:'V540'")&&app.includes("currentMacroStage:'6-of-14'"));
add('release:contrato-v540',app.includes('divinaWhitPresenceReleaseV540'));
add('release:loader-v540',loader.includes('whit-presence-deep-v540.css?v=540')&&loader.includes('ai-engine.js?v=540'));
add('release:sw-v540',sw.includes('const VERSION=540')&&sw.includes('divina-bruxa-v540-shell'));
add('release:index-v540',index.includes('app-v208.js?v=540')&&index.includes('sw.js?v=540'));
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file); add(`release:${file}-v540`,html.includes('PWA V540')&&html.includes('pwa-world-v324.js?v=540'));
}

add('regressao:tarot-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.id)).size===78);
add('regressao:tarot-direto',tarot.CARDS.every(card=>card.orientation==='normal'));
add('regressao:escola-17-124',school.SCHOOL_MODULES.length===17&&school.SCHOOL_LESSON_TOTAL===124);
add('regressao:tarot-sem-fogo',read('tarot-livre-orbe-os-v517.css').includes('motor de fogo foi retirado')&&read('tarot-livre-orbe-os-v517.js').includes('fireInsideUniverseCanvas:false'));

for(const file of ['whit-local-guide-v540.js','whit-presence-deep-v540.js','ai-engine.js','app-v208.js','page-loader-v1.js']){
  const source=read(file);
  for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)|import\(\s*['"](\.\.?\/[^'"]+)/g)){
    const ref=(match[1]||match[2]).split('?')[0];
    add(`referencia:${file}:${ref}`,exists(path.normalize(path.join(path.dirname(file),ref))));
  }
}

const failed=checks.filter(check=>!check.pass);
const result={version:'V540',macroStage:'6/14',total:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed};
console.log(JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
