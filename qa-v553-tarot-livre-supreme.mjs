import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

for(const file of ['tarot-session.js','tarot-continuity.js','tarot-image-runtime.js','tarot-livre-orbe-os-v517.js','tarot-livre-orbe-os-v517.css','tarot-free-supreme-v553.css','page-loader-v1.js','app-v208.js','index.html','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js','sw.js']){
  check(fs.existsSync(path.join(root,file)),`arquivo:${file}`);
}

const session=await import(pathToFileURL(path.join(root,'tarot-session.js')).href+`?qa=${Date.now()}`);
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
let state=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v553',auditSeed:'qa-v553-seed'});
const revealed=[];
for(let index=0;index<78;index+=1){
  const result=session.drawNextCard(state,{now:()=>index+2});
  state=result.state;revealed.push(result.cardId);
}
check(revealed.length===78,'tarot:78-cartas');
check(new Set(revealed).size===78,'tarot:78-unicas');
check(state.completed&&state.waiting.length===0,'tarot:completo-em-78');
check(state.normalOnly===true&&revealed.every(id=>CARDS[id]?.orientation==='normal'),'tarot:todas-diretas');
check(CARDS.length===78&&CARDS[77]?.name==='Rei de Ouros','tarot:baralho-canonico');
check(session.isValidTarotState(state),'tarot:estado-valido');
check(state.auditFingerprint===session.tarotStateFingerprint(state),'tarot:fingerprint-valido');
const afterComplete=session.drawNextCard(state,{now:()=>100});
check(afterComplete.cardId===null&&afterComplete.state.completed,'tarot:nao-repete-apos-78');

let partial=session.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'partial-v553',auditSeed:'partial-v553-seed'});
for(let index=0;index<12;index+=1)partial=session.drawNextCard(partial,{now:()=>index+2}).state;
const signature=partial.revealed.join(',');
const shuffled=session.shuffleRemainingCards(partial,{randomInt:()=>0,now:()=>30});
check(shuffled.revealed.join(',')===signature,'embaralhar:reveladas-preservadas');
check(shuffled.waiting.length===66&&new Set(shuffled.waiting).size===66,'embaralhar:somente-ocultas');
const backup=session.createTarotBackup(partial,{now:()=>40});
const restored=session.restoreTarotBackup(backup,{now:()=>41});
check(restored?.revealed.join(',')===signature,'continuidade:backup-restaura');

const tarot=read('tarot-livre-orbe-os-v517.js');
const legacyCss=read('tarot-livre-orbe-os-v517.css');
const css=read('tarot-free-supreme-v553.css');
const loader=read('page-loader-v1.js');
const app=read('app-v208.js');
const index=read('index.html');
const sw=read('sw.js');
const manifest=read('manifest.webmanifest');

check(/const VERSION = 553/.test(tarot),'motor:versao-v553');
check(/RESPONSE_BUDGET_MS = 80/.test(tarot),'fluidez:resposta-80ms');
check(/BIRTH_TRAVEL_MS = 280/.test(tarot)&&/BIRTH_TRAVEL_CONSTRAINED_MS = 190/.test(tarot),'fluidez:nascimento-280-190');
check(/HISTORY_TRANSITION_MS = 160/.test(tarot),'fluidez:historico-160');
check(!tarot.includes('await wait(90)')&&!tarot.includes('await wait(48)'),'fluidez:sem-esperas-artificiais');
check(!tarot.includes('drawPortalBack(veil)'),'fluidez:sem-redesenho-capa-no-nascimento');
check(tarot.includes("const veil = document.createElement('span')"),'fluidez:pelicula-css');
check(tarot.includes('quietUniverseForCardFlight')&&tarot.includes('resumeUniverseAfterCardFlight'),'fluidez:universo-cede-quadros');
check(tarot.includes("dataset.tarotBirthBudget = 'quiet-v553'"),'fluidez:orcamento-auditavel');
check(tarot.includes("scrollIntoView({ behavior:'auto'"),'fluidez:sem-scroll-concorrente');
check(tarot.includes("preloadWaiting()")&&tarot.includes('const limit = constrained() ? 2 : 3'),'fluidez:preload-adaptativo');
check(tarot.includes("this.grid.querySelector('.is-current')")&&!tarot.includes("this.grid.querySelectorAll('[data-index]').forEach"),'fluidez:grid-sem-varredura-78');

check(tarot.includes('cardAtlasStyle(card)'),'grade:atlas-oficial');
check(tarot.includes('class="tl517__grid-art"'),'grade:miniatura-atlas');
check(!/gridCardMarkup[\s\S]{0,700}cardImageMarkup\(card,\s*\{\s*alt:\s*''/.test(tarot),'grade:zero-imagens-integrais');
check(css.includes('.tl517__grid-art')&&css.includes('contain:layout paint style'),'grade:composicao-isolada');
check(legacyCss.includes('grid-template-columns: repeat(6, minmax(0, 1fr))'),'grade:seis-por-fileira');
check(tarot.includes('aria-colcount="6"'),'grade:aria-seis');

check(!tarot.includes('free-tarot-fire-engine')&&!tarot.includes('CelestialFireBridge'),'fogo:sem-motor');
check(!tarot.includes("getContext('webgl")&&!tarot.includes("getContext('webgl2"),'fogo:sem-webgl-local');
check(tarot.includes("dataset.firePalette = 'none'")&&tarot.includes('fireInsideUniverseCanvas:false'),'fogo:contrato-nenhum');
check(legacyCss.includes('.tl517__effects')&&legacyCss.includes('display: none !important'),'fogo:canvas-efeitos-oculto');
check(!/animation\s*:[^;{}]*infinite/i.test(css),'efeitos:sem-loop-infinito');
check(!/requestAnimationFrame\s*\(|setInterval\s*\(/.test(css),'efeitos:sem-motor-novo');
check(css.includes('filter:none!important')&&css.includes('-webkit-backdrop-filter:none!important'),'efeitos:filtros-amplos-removidos');
check(css.includes('prefers-reduced-motion:reduce'),'acessibilidade:movimento-reduzido');
check(css.includes('data-performance-tier="constrained"'),'iphone:modo-limitado');

check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 5/14 · V553'),'release:app');
check(app.includes("release:'V553'")&&app.includes("currentMacroStage:'5-of-14'"),'release:macroetapa');
check(app.includes('window.divinaTarotFreeSupremeReleaseV553'),'release:contrato');
check(app.includes('automaticMeanings:false')&&app.includes('gridFullImageRequests:0'),'produto:sem-significado-e-grid-leve');
check((loader.match(/tarot-livre-orbe-os-v517\.js\?v=553-supreme/g)||[]).length===2,'release:loader-js');
check((loader.match(/tarot-free-supreme-v553\.css\?v=553/g)||[]).length===2,'release:loader-css');
check(index.includes('tarot-free-supreme-v553.css?v=553')&&index.includes('app-v208.js?v=553'),'release:index');
check(index.includes('sw.js?v=553')&&index.includes('manifest.webmanifest?v=553'),'release:index-cache');
check(sw.includes('const VERSION=553')&&sw.includes('divina-bruxa-v553-shell')&&sw.includes("'./tarot-free-supreme-v553.css'"),'release:sw-atomico');
check(manifest.includes('?v=553'),'release:manifest');
check(['tarot-session.js','tarot-continuity.js','tarot-image-runtime.js'].every(file=>sw.includes(`'./${file}'`)),'offline:nucleo-tarot');
check(tarot.includes('TarotSessionCoordinator')&&read('tarot-continuity.js').includes('this.storage.set'),'produto:autosave-local');
check(tarot.includes('createTarotMesaTransferV517')&&tarot.includes('openMesaReal'),'produto:mesa-real');
check(tarot.includes("this.orb.addEventListener('click'")&&tarot.includes('this.draw()'),'produto:orbe-gatilho');
check(!/meaning|significado/i.test(tarot),'produto:sem-significado-automatico');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:conteudo-real');

const total=passed+failures.length;
console.log(`V553 Tarot Livre Supremo: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
