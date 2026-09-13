import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const checks=[];
const add=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const payload=[
  'wisdom-depth-core-v539.js','wisdom-depth-core-v539.css',
  'library-world-v302.js','library-world-v302.css',
  'school-world-v306.js','school-world-v306.css','journal-engine.js','journal-world-v317.js','journal-world-v317.css',
  'app-v208.js','page-loader-v1.js','pwa-world-v324.js','sw.js','index.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];
payload.forEach(file=>add(`arquivo:${file}`,exists(file)));

const { CARDS }=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
const school=await import(pathToFileURL(path.join(root,'school-policy.js')).href+`?qa=${Date.now()}`);
const depth=await import(pathToFileURL(path.join(root,'wisdom-depth-core-v539.js')).href+`?qa=${Date.now()}`);

add('biblioteca:78-cartas',CARDS.length===78,String(CARDS.length));
add('biblioteca:78-identidades',new Set(CARDS.map(card=>card.id)).size===78);
add('biblioteca:orientacao-direta',CARDS.every(card=>card.orientation==='normal'));
add('escola:17-modulos',school.SCHOOL_MODULES.length===17,String(school.SCHOOL_MODULES.length));
add('escola:124-aulas',school.SCHOOL_LESSON_TOTAL===124,String(school.SCHOOL_LESSON_TOTAL));
add('escola:78-cartas',school.SCHOOL_CARD_TOTAL===78);
add('escola:46-teoricas',school.SCHOOL_THEORY_TOTAL===46);

const core=read('wisdom-depth-core-v539.js');
const css=read('wisdom-depth-core-v539.css');
const library=read('library-world-v302.js');
const schoolWorld=read('school-world-v306.js');
const journalEngine=read('journal-engine.js');
const journalPolicy=read('journal-policy.js');
const app=read('app-v208.js');
const loader=read('page-loader-v1.js');
const sw=read('sw.js');
const index=read('index.html');

add('jornada:biblioteca-escola-diario',core.includes("['library', 'school', 'journal']"));
add('jornada:ponte-tiragens',core.includes("route:'spreads'"));
add('jornada:tres-verbos',['Aprender','Praticar','Integrar'].every(label=>core.includes(label)));
add('jornada:contexto-publico-carta',library.includes('divina:wisdom-public-context-v539'));
add('biblioteca:comparacao-2-a-3',library.includes('openComparison()')&&library.includes('this.compareCards.size < 3')&&library.includes('cards.length < 2'));
add('biblioteca:comparacao-responsiva',read('library-world-v302.css').includes('.lb302__compare-grid{grid-template-columns:1fr}'));
add('jornada:progresso-publico-escola',schoolWorld.includes('divina:school-progress-v539')&&schoolWorld.includes('noteIncluded:false'));
add('jornada:espelho-agregado',core.includes('journalAggregate')&&core.includes('aggregateMirrorOnly:true'));

const privacy=depth.WISDOM_DEPTH_PRIVACY_V539;
add('privacidade:campos-zero',privacy.privateFieldReads===0);
add('privacidade:corpo-zero',privacy.journalBodyReads===0);
add('privacidade:rascunho-zero',privacy.journalDraftReads===0);
add('privacidade:notas-zero',privacy.schoolNoteReads===0);
add('privacidade:storage-zero',privacy.storageReads===0&&privacy.storageWrites===0);
add('privacidade:rede-modelo-zero',privacy.networkCalls===0&&privacy.modelCalls===0);
add('privacidade:whit-explicita',privacy.whitRequiresExplicitAction===true);
add('privacidade:core-sem-campos',!core.includes('querySelector(\'textarea')&&!core.includes('querySelector("textarea')&&!core.includes('[name="text"]')&&!core.includes('[name="title"]'));
add('privacidade:core-sem-storage',!core.includes('localStorage')&&!core.includes('sessionStorage')&&!core.includes('store.get')&&!core.includes('store.set'));

add('diario:rascunho-autosave',journalEngine.includes('scheduleDraft')&&journalEngine.includes('flushDraft'));
add('diario:restaura-rascunho',journalEngine.includes('restoreDraft()'));
add('diario:offline',journalEngine.includes("window.addEventListener('offline'")&&journalEngine.includes('Sem conexão · escreva normalmente'));
add('diario:backup-privado',journalPolicy.includes('privateJournalExport')&&journalPolicy.includes("private: true"));
add('diario:espelho-local',journalPolicy.includes('localMirrorData'));
add('diario:conflito-sem-sobrescrever',journalEngine.includes('Conflito protegido')&&journalEngine.includes('divina:journal-conflict-v539'));
add('diario:conflito-sem-conteudo-privado',journalEngine.includes("privateContentIncluded:false")&&core.includes('journalConflictProtected'));

for(const file of ['library-world-v302.css','school-world-v306.css','journal-world-v317.css','wisdom-depth-core-v539.css']){
  add(`fluidez:${file}-sem-infinite`,!read(file).includes('infinite'));
}
add('fluidez:sem-novo-canvas',!core.includes('canvas')&&!core.includes('requestAnimationFrame('+'loop'));
add('fluidez:sem-pointermove',!core.includes('pointermove'));
add('fluidez:content-visibility',css.includes('content-visibility:auto'));
add('fluidez:alvos-44px',css.includes('min-height:44px'));
add('fluidez:mobile-uma-coluna',css.includes('@media(max-width:680px)')&&css.includes('grid-template-columns:1fr'));
add('fluidez:reduced-motion',css.includes('prefers-reduced-motion:reduce'));

add('release:app-v539',app.includes("release:'V539'")&&app.includes("currentMacroStage:'5-of-14'"));
add('release:contrato-v539',app.includes('divinaSabedoriaVivaReleaseV539'));
add('release:loader-biblioteca-v539',(loader.match(/library-world-v302\.js\?v=539/g)||[]).length===2);
add('release:loader-escola-v539',(loader.match(/school-world-v306\.js\?v=539/g)||[]).length===2);
add('release:loader-diario-v539',(loader.match(/journal-world-v317\.js\?v=539/g)||[]).length===2);
add('release:sw-v539',sw.includes('const VERSION=539')&&sw.includes('divina-bruxa-v539-shell'));
add('release:sw-sabedoria-offline',sw.includes("'./wisdom-depth-core-v539.js'")&&sw.includes("'./wisdom-depth-core-v539.css'"));
add('release:index-v539',index.includes('app-v208.js?v=539')&&index.includes('sw.js?v=539'));
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file);add(`release:${file}-v539`,html.includes('PWA V539')&&html.includes('pwa-world-v324.js?v=539'));
}

for(const file of ['wisdom-depth-core-v539.js','library-world-v302.js','school-world-v306.js','app-v208.js','page-loader-v1.js']){
  const source=read(file);
  for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)|import\(\s*['"](\.\.?\/[^'"]+)/g)){
    const ref=(match[1]||match[2]).split('?')[0];
    add(`referencia:${file}:${ref}`,exists(path.normalize(path.join(path.dirname(file),ref))));
  }
}

const failed=checks.filter(check=>!check.pass);
const result={version:'V539',macroStage:'5/14',total:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed};
console.log(JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
