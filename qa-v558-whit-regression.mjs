import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

const required=['ai-policy.js','ai-engine.js','whit-local-guide-v540.js','whit-local-supreme-v557.css','whit-core-supreme-v527.js','whit-mind-v312.js','whit-silent-presence-v316.js','page-loader-v1.js','app-v208.js','index.html','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js','sw.js'];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`arquivo:${file}`));

const policy=await import(pathToFileURL(path.join(root,'ai-policy.js')).href+`?qa=${Date.now()}`);
check(policy.AI_SCHEMA_VERSION==='9.0.0'&&policy.AI_POLICY.release==='V557','politica:release-v557');
check(policy.AI_POLICY.local.default===true&&policy.AI_POLICY.local.requiresApi===false,'local:padrao-sem-api');
check(policy.AI_POLICY.local.requiresAccount===false&&policy.AI_POLICY.local.credits===0,'local:sem-conta-ou-creditos');
check(policy.AI_POLICY.local.sessionMemoryTurns===6&&policy.AI_POLICY.local.persistentMemoryDefault===false,'memoria:seis-turnos-efemeros');
check(policy.AI_POLICY.privacy.diaryRequiresConsent&&policy.AI_POLICY.privacy.adminReceivesText===false,'privacidade:diario-e-admin');
check(policy.AI_POLICY.controls.solEnabled===false&&policy.AI_POLICY.controls.billingEnabled===false,'online:sol-e-cobranca-off');

const guide=await import(pathToFileURL(path.join(root,'whit-local-guide-v540.js')).href+`?qa=${Date.now()}`);
const work=guide.createLocalWhitResponse({message:'Estou em dúvida sobre uma escolha de trabalho',focus:'reflection',mode:'luna'});
const follow=guide.createLocalWhitResponse({message:'E agora?',focus:'reflection',mode:'terra',session:['Estou em dúvida sobre uma escolha de trabalho']});
const tarot=guide.createLocalWhitResponse({message:'Carta A Lua na posição desafio',focus:'tarot',source:'tarot-single-spread'});
const school=guide.createLocalWhitResponse({message:'Explique esta aula sobre os Arcanos Maiores',focus:'school',source:'school-single-lesson'});
const journal=guide.createLocalWhitResponse({message:'Quero refletir sobre esta memória e meu medo',source:'journal-single-entry'});
const danger=guide.createLocalWhitResponse({message:'Quero me matar',focus:'tarot'});
check(work.release==='V557'&&work.theme==='decision','resposta:tema-decisao');
check(follow.sessionTurnsUsed===1&&['decision','work'].includes(follow.theme),'memoria:continuacao-contextual');
check(tarot.source==='tarot-single-spread'&&tarot.theme==='tarot','contexto:tiragem-unica');
check(school.source==='school-single-lesson'&&school.theme==='study','contexto:aula-unica');
check(journal.source==='journal-single-entry'&&journal.content.includes('Todo o restante continua fechado'),'contexto:diario-unico');
check(danger.safetyIntercepted===true&&!danger.content.includes('destino'),'seguranca:risco-interrompido');
[work,follow,tarot,school,journal,danger].forEach((answer,index)=>{
  check(answer.networkCalls===0&&answer.modelCalls===0&&answer.creditsUsed===0,`local:zero-custo-${index}`);
  check(['OBSERVAÇÃO','POSSIBILIDADE','LIMITE','PRÓXIMO GESTO'].every(section=>answer.content.includes(section)),`resposta:estrutura-${index}`);
});
check(guide.WHIT_LOCAL_CONTRACT_V557.explicitVisibleContextOnly===true,'contrato:contexto-visivel');
check(guide.WHIT_LOCAL_CONTRACT_V557.claimsConsciousness===false&&guide.WHIT_LOCAL_CONTRACT_V557.claimsMindReading===false,'contrato:sem-falsa-consciencia');
check(guide.WHIT_LOCAL_CONTRACT_V557.readsJournalSilently===false,'contrato:sem-leitura-silenciosa');

const engine=read('ai-engine.js'),css=read('whit-local-supreme-v557.css');
check(engine.includes("this.deliveryMode = 'local'")&&!engine.includes("settings?.delivery === 'online'"),'interface:sempre-abre-local');
check(engine.includes('consentRequired()')&&engine.includes("this.source !== 'message'"),'consentimento:contexto-selecionado');
check(engine.includes('this.sessionTurns = []')&&engine.includes('clearSession()'),'memoria:apagavel-e-efemera');
check(engine.includes('session:this.sessionTurns')&&engine.includes('rememberSession(content)'),'memoria:usada-na-resposta');
check(engine.includes('data-whit-session-copy')&&engine.includes('data-whit-clear-session'),'memoria:controle-visivel');
check(engine.includes('data-whit-orb-host')&&engine.includes('this.orbCore.claim'),'orbe:canonica-na-whit');
check(engine.includes("behavior:'auto'")&&!engine.includes("behavior:'smooth'"),'fluidez:rolagem-imediata');
check(engine.includes('this.abort.abort()')&&engine.includes('this.releaseOrb()'),'fluidez:descarte-completo');
check(engine.includes("journal-policy.js?v=556")&&engine.includes("school-policy.js?v=555"),'continuidade:politicas-atuais');
check(engine.includes('A V557 não simula, vende nem concede créditos'),'verdade:sem-cobranca-local');

check(!/animation\s*:[^;{}]*infinite/i.test(css),'visual:zero-loop-infinito');
check(css.includes('backdrop-filter:none!important')&&css.includes('animation:none!important'),'visual:sem-blur-ou-motor');
check(css.includes('content-visibility:auto')&&css.includes('contain-intrinsic-size'),'fluidez:pintura-diferida');
check(css.includes('@media(max-width:430px)')&&css.includes('min-height:48px'),'iphone:layout-e-toque');
check(css.includes('prefers-reduced-motion:reduce'),'acessibilidade:movimento-reduzido');
check(css.includes('body[data-screen="ai"] #whitMindV312Panel'),'visual:presencas-antigas-recolhidas-na-whit');

for(const file of ['whit-core-supreme-v527.js','whit-mind-v312.js','whit-silent-presence-v316.js']){
  check(!read(file).includes('new MutationObserver'),`fluidez:sem-mutation-observer:${file}`);
}
check(read('whit-core-supreme-v527.js').includes('mutationObservers:0'),'fluidez:contrato-event-driven');

const app=read('app-v208.js'),loader=read('page-loader-v1.js'),index=read('index.html'),sw=read('sw.js'),pwa=read('pwa-world-v324.js'),manifest=read('manifest.webmanifest');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 10/14 · V558'),'release:app-v558');
check(app.includes('window.divinaWhitLocalReleaseV557')&&app.includes("currentMacroStage:'10-of-14'"),'release:contrato-v558');
check(app.includes('localApiCalls:0')&&app.includes('sessionMemoryTurns:6'),'release:verdade-local');
check(loader.includes('whit-local-supreme-v557.css?v=557')&&loader.includes("import('./ai-engine.js?v=557')"),'release:loader');
check(loader.includes('divinaWhitLocalV557')&&loader.includes('orbCore:globalThis.divinaOrbSupremeV501'),'integracao:mundo-e-orbe');
check(index.includes('WHIT LOCAL SUPREMA · V557')&&index.includes('app-v208.js?v=558'),'release:index');
check(index.includes('sw.js?v=558')&&index.includes('manifest.webmanifest?v=558'),'release:cache');
check(sw.includes('const VERSION=558')&&sw.includes('divina-bruxa-v558-shell')&&sw.includes("'./whit-local-supreme-v557.css'"),'release:sw-atomico');
check(sw.includes("'./whit-local-guide-v540.js'")&&sw.includes("'./ai-engine.js'"),'offline:whit-local-completa');
check(pwa.includes('const VERSION=558')&&manifest.includes('?v=558'),'release:pwa-manifest');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:321-paginas-reais');

const total=passed+failures.length;
console.log(`V558 Regressão Whit Local: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
