import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const checks=[];
const add=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const payload=[
  'tarot-session.js','tarot-continuity.js','tarot-image-runtime.js',
  'tarot-livre-orbe-os-v517.js','tarot-livre-orbe-os-v517.css',
  'page-loader-v1.js','app-v208.js','pwa-world-v324.js','sw.js',
  'index.html','instalar-app.html','install-app.html','instalar-aplicacion.html'
];
payload.forEach(file=>add(`arquivo:${file}`,exists(file)));

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+`?qa=${Date.now()}`);
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);

let state=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v538',auditSeed:'qa-v538-seed'});
const firstFingerprint=state.auditFingerprint;
const revealed=[];
for(let index=0;index<78;index+=1){
  const result=session.drawNextCard(state,{now:()=>index+2});
  state=result.state;
  revealed.push(result.cardId);
}
add('tarot:78-cartas',revealed.length===78,String(revealed.length));
add('tarot:78-unicas',new Set(revealed).size===78,String(new Set(revealed).size));
add('tarot:completo-depois-de-78',state.completed&&state.waiting.length===0);
add('tarot:normal-only',state.normalOnly===true&&revealed.every(id=>CARDS[id]?.orientation==='normal'));
add('tarot:rei-de-ouros-canonico',CARDS.length===78&&CARDS[77]?.name==='Rei de Ouros');
add('tarot:fingerprint-inicial',/^tl-[0-9a-f]{8}$/.test(firstFingerprint),firstFingerprint);
add('tarot:fingerprint-final',state.auditFingerprint===session.tarotStateFingerprint(state),state.auditFingerprint);
add('tarot:fingerprint-evolui',state.auditFingerprint!==firstFingerprint);
add('tarot:estado-valido',session.isValidTarotState(state));

let partial=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'partial-v538',auditSeed:'partial-seed'});
for(let index=0;index<9;index+=1)partial=session.drawNextCard(partial,{now:()=>index+2}).state;
const preserved=partial.revealed.join(',');
const shuffled=session.shuffleRemainingCards(partial,{randomInt:()=>0,now:()=>20});
add('embaralhar:reveladas-estaveis',shuffled.revealed.join(',')===preserved);
add('embaralhar:somente-restantes',shuffled.waiting.length===69&&new Set(shuffled.waiting).size===69);
add('embaralhar:fingerprint-valido',shuffled.auditFingerprint===session.tarotStateFingerprint(shuffled));

const legacy={...partial};delete legacy.auditSeed;delete legacy.auditFingerprint;
const migrated=session.normalizeTarotState(legacy);
add('continuidade:migra-sessao-antiga',Boolean(migrated)&&migrated.revealed.join(',')===preserved);
add('continuidade:seed-legado',migrated?.auditSeed==='legacy-partial-v538');
add('continuidade:fingerprint-legado',migrated?.auditFingerprint===session.tarotStateFingerprint(migrated));
const backup=session.createTarotBackup(partial,{now:()=>50});
const restored=session.restoreTarotBackup(backup,{now:()=>51});
add('continuidade:backup-restaura',restored?.revealed.join(',')===preserved);

const tarot=read('tarot-livre-orbe-os-v517.js');
const css=read('tarot-livre-orbe-os-v517.css');
const images=read('tarot-image-runtime.js');
const loader=read('page-loader-v1.js');
const app=read('app-v208.js');
const sw=read('sw.js');
const index=read('index.html');

add('fluidez:budget-100ms',/RESPONSE_BUDGET_MS\s*=\s*100/.test(tarot));
add('fluidez:atlas-first',tarot.includes("birthSync = 'atlas-first-progressive'")&&tarot.includes("progressiveImages = 'atlas-first'"));
add('fluidez:sem-espera-decode',!tarot.includes('waitForImage(')&&!tarot.includes('CARD_READY_TIMEOUT_MS'));
add('fluidez:transicao-curta',/BIRTH_TRAVEL_MS\s*=\s*440/.test(tarot)&&/HISTORY_TRANSITION_MS\s*=\s*220/.test(tarot));
add('fluidez:preload-ocioso',images.includes('requestIdleCallback')&&images.includes("document.visibilityState === 'hidden'"));
add('fluidez:preload-limitado',/Math\.min\(limit,\s*4\)/.test(images));
add('fluidez:grade-incremental',tarot.includes('appendGridCard(result.position)'));
add('fluidez:pausa-oculta',tarot.includes("document.addEventListener('visibilitychange'")&&css.includes('animation-play-state: paused'));
add('fluidez:sem-infinite-css',!css.includes('infinite'));
add('fluidez:sem-arrasto-js',!tarot.includes("addEventListener('pointermove'")&&!tarot.includes('setPointerCapture')&&!tarot.includes('HISTORY_DRAG'));
add('fluidez:sem-arrasto-contrato',tarot.includes("dataset.noDrag = 'true'")&&tarot.includes('dragNavigation: false'));
add('fluidez:pagina-nao-arrasta',css.includes('touch-action: pan-y pinch-zoom'));

add('fogo:sem-engine-ativo',!tarot.includes('CelestialFireBridge')&&!tarot.includes('free-tarot-fire-engine'));
add('fogo:sem-render-webgl-local',!tarot.includes("getContext('webgl")&&!tarot.includes("getContext('webgl2"));
add('fogo:efeitos-canvas-ocultos',/\.tl517__effects[\s\S]{0,180}display:\s*none\s*!important/.test(css));
add('fogo:pulso-orbe-radial',css.includes('V538')&&css.includes('radial-gradient(circle'));

add('produto:sem-significado-automatico',!tarot.includes('meaning')&&!tarot.includes('significado'));
add('produto:seis-colunas-css',css.includes('grid-template-columns: repeat(6, minmax(0, 1fr))'));
add('produto:aria-colcount-6',tarot.includes('aria-colcount="6"'));
add('produto:reset-confirmado',tarot.includes('Confirmar novo círculo')&&tarot.includes('resetArmed'));
add('produto:orbe-gatilho',tarot.includes("this.orb.addEventListener('click'")&&tarot.includes('this.draw()'));
add('produto:mesa-real',tarot.includes('createTarotMesaTransferV517')&&tarot.includes('openMesaReal'));
add('produto:autosave-local',tarot.includes('TarotSessionCoordinator')&&read('tarot-continuity.js').includes('this.storage.set'));

add('release:loader-js-v538',(loader.match(/tarot-livre-orbe-os-v517\.js\?v=538-fluid/g)||[]).length===2);
add('release:loader-css-v538',(loader.match(/tarot-livre-orbe-os-v517\.css\?v=538-fluid/g)||[]).length===2);
add('release:app-v538',app.includes("release:'V538'")&&app.includes("currentMacroStage:'4-of-14'"));
add('release:contrato-v538',app.includes('divinaTarotLivreReleaseV538'));
add('release:sw-v538',sw.includes('const VERSION=538')&&sw.includes('divina-bruxa-v538-shell'));
add('release:sw-nucleo-offline',['tarot-session.js','tarot-continuity.js','tarot-image-runtime.js'].every(file=>sw.includes(`'./${file}'`)));
add('release:index-v538',index.includes('app-v208.js?v=538')&&index.includes('sw.js?v=538'));
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file);add(`release:${file}-v538`,html.includes('PWA V538')&&html.includes('pwa-world-v324.js?v=538'));
}

for(const file of ['tarot-livre-orbe-os-v517.js','tarot-continuity.js','app-v208.js','page-loader-v1.js']){
  const source=read(file);
  for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)|import\(\s*['"](\.\.?\/[^'"]+)/g)){
    const ref=(match[1]||match[2]).split('?')[0];
    add(`referencia:${file}:${ref}`,exists(path.normalize(path.join(path.dirname(file),ref))));
  }
}

const failed=checks.filter(check=>!check.pass);
const result={version:'V538',macroStage:'4/14',total:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed};
console.log(JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
