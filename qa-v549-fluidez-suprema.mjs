import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);

for(const file of ['app-v208.js','index.html','manifest.webmanifest','orb-fluid-navigation-v535.js','pwa-world-v196.js','pwa-world-v324.js','sw.js','BASELINE-FLUIDEZ-V549.json','PLANO-DIVINA-BRUXA-4.0.md']){
  check(fs.existsSync(path.join(root,file)),`arquivo:${file}`);
}

const app=read('app-v208.js');
const index=read('index.html');
const sw=read('sw.js');
const nav=read('orb-fluid-navigation-v535.js');
const loader=read('page-loader-v1.js');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 1/14 · V549'),'app:plano-4');
check(app.includes("release:'V549'")&&app.includes("currentMacroStage:'1-of-14'"),'app:macroetapa');
check(app.includes("preserves:'V548'")&&app.includes('heavyScenePausedDuringNavigation:true'),'app:preserva-e-pausa');
check(index.includes('app-v208.js?v=549')&&index.includes('sw.js?v=549')&&index.includes('manifest.webmanifest?v=549'),'index:corte-v549');
check(sw.includes('const VERSION=549')&&sw.includes('divina-bruxa-v549-shell'),'sw:corte-v549');
check(sw.includes('/app-v208\\.js\\?v=549/'),'sw:valida-shell-v549');
check(nav.includes("this.universe.pause?.()")&&nav.includes("this.universe.start?.()"),'navegacao:pausa-retoma');
check(nav.includes("applyTransitionBudget('menu')")&&nav.includes("applyTransitionBudget('navigation')"),'navegacao:orcamento-unico');
check(nav.includes('this.budgetReasons = new Set()'),'navegacao:razoes-sobrepostas');
check(!nav.includes('requestAnimationFrame(')&&!nav.includes('setInterval(')&&!nav.includes('MutationObserver'),'navegacao:zero-loop-extra');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=538-fluid')")&&!loader.includes("import('./free-tarot-fire-engine-v345.js"),'tarot:sem-fogo');

const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
check(CARDS.length===78&&new Set(CARDS.map(card=>card.id)).size===78,'tarot:78-sem-repeticao');
check(CARDS.every(card=>card.orientation==='normal'),'tarot:sem-invertidas');
const {SKINS_V6=[]}=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
check(SKINS_V6.length===30,'skins:30-preservadas');
check(SKINS_V6.filter(item=>item.status==='free'&&item.priceCents===0).length===1,'skins:classica-gratis');
check(app.includes('identityPaidSkinCount:29')&&app.includes('identitySkinsAlsoSoldIndividually:true'),'skins:29-unitarias');
check(app.includes('schoolModules:17')&&app.includes('schoolLessons:124'),'escola:completa');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'whit:local-sem-api');
check(app.includes('oneCanonicalOrb:true')&&app.includes('ownerObservatoryIndependentOrbEngines:0'),'orbe:unica');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'conteudo:321-html-preservados');

const total=passed+failures.length;
console.log(`V549 Fluidez Suprema: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
