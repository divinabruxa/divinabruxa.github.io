import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

const required=['school-policy.js','school-engine.js','school-world-v306.js','school-library-supreme-v555.css','library-world-v302.js','library-deep-v332.js','public-library-core-v544.js','card-library-policy.js','page-loader-v1.js','app-v208.js','index.html','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js','sw.js'];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`arquivo:${file}`));

const policy=await import(pathToFileURL(path.join(root,'school-policy.js')).href+`?qa=${Date.now()}`);
check(policy.SCHOOL_MODULES.length===17,'escola:17-modulos');
check(policy.SCHOOL_CARD_TOTAL===78&&policy.SCHOOL_THEORY_TOTAL===46&&policy.SCHOOL_LESSON_TOTAL===124,'escola:124-aulas-reais');
check(policy.SCHOOL_ORIENTATION==='normal','escola:zero-invertidas');
check(policy.SCHOOL_STAGES.length===3,'escola:3-jornadas');
const stageModules=policy.SCHOOL_STAGES.flatMap(stage=>stage.moduleIds);
check(stageModules.length===17&&new Set(stageModules).size===17,'escola:mapa-cobre-17-sem-duplicar');
check(stageModules.join(',')===policy.SCHOOL_MODULES.map(module=>module.id).join(','),'escola:ordem-pedagogica');
check(policy.SCHOOL_FREE_LESSON_IDS.length===17&&new Set(policy.SCHOOL_FREE_LESSON_IDS).size===17,'escola:17-aulas-gratis');
check(policy.SCHOOL_FREE_LESSON_IDS.every(id=>policy.isSchoolLessonId(id)&&!policy.isSchoolLessonPremium(id)),'escola:free-valido');
const allIds=[...Array.from({length:78},(_,id)=>`card-${id}`),...Object.entries(policy.SCHOOL_THEORY_COUNTS).flatMap(([module,total])=>Array.from({length:total},(_,i)=>`theory-${module}-${i+1}`))];
check(allIds.length===124&&new Set(allIds).size===124,'escola:ids-unicos');
check(allIds.filter(policy.isSchoolLessonPremium).length===107,'escola:107-premium');
const quiz=policy.normalizeSchoolState({quiz:{'theory-fundamentals-1':{attempts:1,correct:true,lastAnswer:'contexto e escolha'}}});
check(quiz.quiz['theory-fundamentals-1']?.correct===true,'escola:quiz-teorico-persistente');

const engine=read('school-engine.js'),world=read('school-world-v306.js'),library=read('library-world-v302.js');
const libraryDeep=read('library-deep-v332.js'),libraryPolicy=read('card-library-policy.js'),css=read('school-library-supreme-v555.css');
check(engine.includes('SCHOOL_STAGES.map')&&engine.includes('school-stage'),'escola:modulos-em-tres-jornadas');
check(!world.includes('MutationObserver')&&world.includes('duplicateModuleMaps:0'),'escola:sem-observador-e-sem-mapa-duplicado');
check(world.includes('Plano de estudo em 30 dias')&&world.includes('Revisar depois'),'escola:plano-30-dias-e-revisao');
for(const layer of ['Essência','Luz','Tensão','Amor','Relacionamentos','Carreira','Dinheiro e matéria','Espiritualidade','Símbolos','Conselho','Exemplo de leitura','Pergunta de reflexão','Ação possível'])check(engine.includes(layer),`escola:camada:${layer}`);
check(engine.includes('billingSnapshot()')&&engine.includes("premium_lifetime")&&engine.includes('lessonLocked'),'escola:premium-servidor-fail-closed');
check(engine.includes('Seu progresso anterior continua preservado'),'escola:paywall-preserva-progresso');
check(engine.includes('cardAtlasStyle')&&!engine.includes('cardImageMarkup'),'escola:atlas-sem-arte-cheia-em-lista');
check(world.includes("mode:'school'")&&world.includes('canonicalOrb:true'),'escola:orbe-canonica');

check(libraryPolicy.includes('LIBRARY_PAGE_SIZE = 18')&&libraryPolicy.includes('LIBRARY_COMPARE_LIMIT = 3'),'biblioteca:politica-18-e-comparacao-3');
check(library.includes('const PAGE_SIZE = 18')&&library.includes('gridFullImageRequests:0'),'biblioteca:18-por-pagina');
check(library.includes('lb302__card-atlas')&&library.includes('cardAtlasStyle(card)'),'biblioteca:atlas-na-grade');
check((library.match(/cardImageMarkup\(card/g)||[]).length===2,'biblioteca:arte-cheia-somente-leitor-comparacao');
check(library.includes("mode:'library'")&&library.includes('duplicateOrb:false'),'biblioteca:orbe-canonica-sem-duplicata');
check(library.includes('data-reader-diary')&&library.includes('globalThis.confirm'),'biblioteca:diario-com-consentimento');
check(library.includes('data-reader-whit')&&library.includes('Nada é lido ou enviado automaticamente'),'biblioteca:whit-com-consentimento');
for(const layer of ['Essência','Na luz','Na tensão','Amor','Relacionamentos','Carreira e caminho','Dinheiro e matéria','Espiritualidade','Conselho','Pergunta para você','Arquétipo e correspondências','Símbolos da carta','Combinações para estudar'])check(library.includes(layer),`biblioteca:camada:${layer}`);
check(library.includes('Fontes e referências')&&library.includes('revisado em setembro de 2026'),'biblioteca:fonte-e-revisao');
check(!libraryDeep.match(/MutationObserver/)&&libraryDeep.includes('permanentAnimationLoops:0'),'biblioteca:camada-profunda-sem-loop');
check(libraryDeep.includes('lb332Bound'),'biblioteca:eventos-sem-duplicar');
check(!/animation\s*:[^;{}]*infinite/i.test(css),'fluidez:sem-animacao-infinita');
check(css.includes('backdrop-filter:none!important')&&css.includes('prefers-reduced-motion:reduce'),'fluidez:sem-blur-e-movimento-reduzido');
check(css.includes('min-height:44px')&&css.includes('@media(max-width:520px)'),'iphone:toque-e-layout');

const app=read('app-v208.js'),loader=read('page-loader-v1.js'),index=read('index.html'),sw=read('sw.js'),pwa=read('pwa-world-v324.js'),manifest=read('manifest.webmanifest');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 7/14 · V555'),'release:app-v555');
check(app.includes('window.divinaSchoolLibraryReleaseV555')&&app.includes("currentMacroStage:'7-of-14'"),'release:contrato-v555');
check(loader.includes("onSave:remember")&&loader.includes("mode:'school'")===false,'integracao:diario-e-orbe-por-motores');
check(index.includes('school-library-supreme-v555.css?v=555')&&index.includes('app-v208.js?v=555'),'release:index');
check(index.includes('sw.js?v=555')&&index.includes('manifest.webmanifest?v=555'),'release:cache');
check(sw.includes('const VERSION=555')&&sw.includes('divina-bruxa-v555-shell')&&sw.includes("'./school-library-supreme-v555.css'"),'release:sw-atomico');
check(sw.includes("'./school-engine.js'")&&sw.includes("'./library-world-v302.js'"),'offline:escola-e-biblioteca');
check(pwa.includes('const VERSION=555')&&manifest.includes('?v=555'),'release:pwa-manifest');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:321-paginas-reais');

const total=passed+failures.length;
console.log(`V555 Escola + Biblioteca: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
