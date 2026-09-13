import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

const required=['app-v208.js','index.html','manifest.webmanifest','supreme-orb-core-v501.js','orb-ios-journey-core-v525.js','orb-universal-presence-v526.js','pwa-world-v196.js','pwa-world-v324.js','sw.js','AUDITORIA-ORBE-V550.json'];
for(const file of required)check(fs.existsSync(path.join(root,file)),`arquivo:${file}`);

const app=read('app-v208.js'),index=read('index.html'),sw=read('sw.js');
const supreme=read('supreme-orb-core-v501.js'),journey=read('orb-ios-journey-core-v525.js'),presence=read('orb-universal-presence-v526.js');
const loader=read('page-loader-v1.js');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 2/14 · V550'),'app:release');
check(app.includes("release:'V550'")&&app.includes("currentMacroStage:'2-of-14'"),'app:macroetapa');
check(app.includes("projectionMode:'event-snapshot-v550'")&&app.includes('projectionPermanentLoops:0'),'app:projecao');
check(app.includes("journeyMirrorMode:'single-snapshot-v550'")&&app.includes('journeyMirrorAnimationLoops:0'),'app:viagem');
check(index.includes('app-v208.js?v=550')&&index.includes('sw.js?v=550')&&index.includes('manifest.webmanifest?v=550'),'index:corte-v550');
check(sw.includes('const VERSION=550')&&sw.includes('divina-bruxa-v550-shell'),'sw:corte-v550');
check(sw.includes('/app-v208\\.js\\?v=550/'),'sw:validacao-atomica');
check(!supreme.includes('this.projectionLoop'),'orbe:sem-loop-projecoes');
check(supreme.includes("projectionCadence:'event-snapshot-v550'")&&supreme.includes('projectionPermanentLoop:false'),'orbe:foto-por-evento');
check(supreme.includes("scheduleProjectionPaint('skin')")&&supreme.includes("scheduleProjectionPaint('pulse')")&&supreme.includes("scheduleProjectionPaint('mode')"),'orbe:eventos-coalescidos');
check(/scheduleProjectionPaint[\s\S]{0,500}cancelAnimationFrame\(this\.projectionPaintFrame\)[\s\S]{0,500}requestAnimationFrame/.test(supreme),'orbe:um-frame-coalescido');
check(!/startLivingMirror\(\)[\s\S]{0,450}requestAnimationFrame/.test(journey),'viagem:sem-loop-canvas');
check(journey.includes("mirrorCadence:'single-snapshot-v550'")&&journey.includes('mirrorAnimationLoop:false'),'viagem:captura-unica');
check(presence.includes('liveCanvasProjections:false')&&presence.includes("projectionMode:'event-snapshot-v550'"),'presenca:verdade-runtime');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=538-fluid')")&&!loader.includes("import('./free-tarot-fire-engine-v345.js"),'tarot:sem-fogo');

const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
check(CARDS.length===78&&new Set(CARDS.map(card=>card.id)).size===78,'tarot:78-unicas');
check(CARDS.every(card=>card.orientation==='normal'),'tarot:diretas');
const {SKINS_V6=[]}=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
check(SKINS_V6.length===30,'skins:30');
check(app.includes('identityPaidSkinCount:29')&&app.includes('identitySkinsAlsoSoldIndividually:true'),'skins:29-unitarias');
check(app.includes('schoolModules:17')&&app.includes('schoolLessons:124'),'escola:17-124');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'whit:local');
check(app.includes('oneCanonicalOrb:true')&&app.includes('oneOrbMotionClock:true'),'orbe:canonica-e-relogio-unico');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'conteudo:321-html');

const total=passed+failures.length;
console.log(`V550 Orbe Física Única: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
