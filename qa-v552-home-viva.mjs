import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

for(const file of ['app-v208.js','index.html','manifest.webmanifest','home-living-v552.css','home-orb-absolute-v206.css','ios-navigation-v551.css','pwa-world-v196.js','pwa-world-v324.js','sw.js']){
  check(fs.existsSync(path.join(root,file)),`arquivo:${file}`);
}

const app=read('app-v208.js');
const index=read('index.html');
const css=read('home-living-v552.css');
const sw=read('sw.js');
const manifest=read('manifest.webmanifest');
const loader=read('page-loader-v1.js');

check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 4/14 · V552'),'app:release');
check(app.includes("release:'V552'")&&app.includes("currentMacroStage:'4-of-14'"),'app:macroetapa');
check(app.includes('window.divinaHomeLivingReleaseV552'),'app:contrato-home');
check(app.includes("visibleHomeContent:'one-canonical-orb'"),'home:uma-orbe-visivel');
check(app.includes('externalAuraLoops:0')&&app.includes('externalAuraEngine:false'),'home:sem-motor-externo');
check(index.includes('home-living-v552.css?v=552')&&index.includes('app-v208.js?v=552'),'index:home-v552');
check(index.includes('sw.js?v=552')&&index.includes('manifest.webmanifest?v=552'),'index:corte-v552');
check(sw.includes('const VERSION=552')&&sw.includes('divina-bruxa-v552-shell'),'sw:corte-v552');
check(sw.includes("'./home-living-v552.css'"),'sw:home-atomica');
check(manifest.includes('?v=552'),'manifest:corte-v552');

check(css.includes('position:fixed!important')&&css.includes('inset:0!important'),'centro:viewport-absoluto');
check(css.includes('place-items:center!important'),'centro:grid');
check(css.includes('height:100dvh')&&css.includes('min-height:100svh'),'centro:viewport-dinamico');
check(css.includes('env(safe-area-inset-left')&&css.includes('env(safe-area-inset-right'),'centro:safe-area-horizontal');
check(css.includes('--db552-home-orb-size:min(89vw,47dvh,470px)'),'tamanho:desktop-fluido');
check(css.includes('--db552-home-orb-size:min(88vw,45dvh,420px)'),'tamanho:iphone-retrato');
check(css.includes('--db552-home-orb-size:min(87vw,44dvh,330px)'),'tamanho:iphone-pequeno');
check(css.includes('--db552-home-orb-size:min(64dvh,38vw,330px)'),'tamanho:iphone-paisagem');
check(css.includes('animation:none!important'),'aura:loop-antigo-desligado');
check(!/animation\s*:[^;{}]*infinite/i.test(css),'aura:sem-infinito');
check(!/requestAnimationFrame\s*\(|setInterval\s*\(/.test(css),'aura:sem-motor-js');
check(css.includes('html.db-supreme-orb-active')&&css.includes('.r027-touching'),'aura:estado-existente');
check(css.includes('[data-orb-navigation-state="active"]')&&css.includes('[data-menu-state="navigating"]'),'aura:recolhe-na-travessia');
check(css.includes('@media(prefers-reduced-motion:reduce)'),'home:movimento-reduzido');
check(index.includes('#app>#home.home-orb-only-v206.active>:not(.orb-stage-ref):not(#orbStatus){display:none!important'),'home:sem-texto-lista-linha');

check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=538-fluid')")&&!loader.includes("import('./free-tarot-fire-engine-v345.js"),'regressao:tarot-sem-fogo');
const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
check(CARDS.length===78&&new Set(CARDS.map(card=>card.id)).size===78&&CARDS.every(card=>card.orientation==='normal'),'regressao:78-diretas-sem-repetir');
const {SKINS_V6=[]}=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
check(SKINS_V6.length===30&&app.includes('identityPaidSkinCount:29'),'regressao:30-skins-29-avulsas');
check(app.includes('schoolModules:17')&&app.includes('schoolLessons:124'),'regressao:escola-17-124');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'regressao:whit-local');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:conteudo-real');

const total=passed+failures.length;
console.log(`V552 Home Viva: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
