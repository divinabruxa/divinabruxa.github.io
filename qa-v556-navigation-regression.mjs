import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

for(const file of ['app-v208.js','index.html','manifest.webmanifest','ios-navigation-v551.css','orbital-menu-v502.js','orbital-menu-v502.css','supreme-orb-core-v501.js','pwa-world-v196.js','pwa-world-v324.js','sw.js']){
  check(fs.existsSync(path.join(root,file)),`arquivo:${file}`);
}

const app=read('app-v208.js'),index=read('index.html'),sw=read('sw.js');
const menu=read('orbital-menu-v502.js'),menuCss=read('orbital-menu-v502.css'),iosCss=read('ios-navigation-v551.css');
const supreme=read('supreme-orb-core-v501.js'),loader=read('page-loader-v1.js');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 8/14 · V556'),'app:release');
check(app.includes("release:'V556'")&&app.includes("currentMacroStage:'8-of-14'"),'app:macroetapa');
check(index.includes('ios-navigation-v551.css?v=551')&&index.includes('app-v208.js?v=556'),'index:movimento-v551');
check(index.includes('sw.js?v=556')&&index.includes('manifest.webmanifest?v=556'),'index:cache-v551');
check(sw.includes('const VERSION=556')&&sw.includes('divina-bruxa-v556-shell')&&sw.includes("'./ios-navigation-v551.css'"),'sw:atomico-v551');
check(!menu.includes('class="db502-menu__close"'),'menu:sem-fechar-duplicado');
check(menu.includes("const OPEN_MS = 300")&&menu.includes("const CLOSE_MS = 180"),'menu:duracoes');
check(menu.includes("['opening','open'].includes(this.state)"),'menu:portal-responde-cedo');
check(!menu.includes("this.go('home'")&&menu.includes('opensOverCurrentRoute:true'),'menu:sem-desvio-home');
check(menu.includes('if (!reducedMotion()) await frame();')&&!menu.includes('reducedMotion() ? 0 : 92'),'menu:sem-atraso-92ms');
check(menuCss.includes('--db502-curve:cubic-bezier(.22,.82,.24,1)')&&iosCss.includes('--db551-ios-curve:cubic-bezier(.22,.82,.24,1)'),'movimento:curva-unica');
check(menuCss.includes('animation-play-state:paused')&&menuCss.includes('animation-play-state:running'),'menu:brilho-sob-demanda');
check(iosCss.includes('translate3d(0,6px,0) scale(.997)')&&iosCss.includes('animation-duration:180ms'),'pagina:chegada-leve');
check(iosCss.includes('prefers-reduced-motion:reduce'),'pagina:movimento-reduzido');
check(supreme.includes('claim-restored-v551')&&supreme.includes('divina:supreme-orb-claim-restored'),'orbe:pilha-de-pousos');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=553-supreme')")&&!loader.includes("free-tarot-fire-engine"),'tarot:sem-fogo');

globalThis.document={documentElement:{dataset:{}},dispatchEvent(){},querySelector(){return null;}};
globalThis.CustomEvent=class{constructor(type,{detail}={}){this.type=type;this.detail=detail;}};
const {SupremeOrbCoreV501}=await import(pathToFileURL(path.join(root,'supreme-orb-core-v501.js')).href+`?qa=${Date.now()}`);
const makeParent=name=>({name,isConnected:true,dataset:{},children:[],contains(node){return node.parentNode===this;},append(node){node.parentNode=this;node.nextSibling=null;this.children.push(node);},insertBefore(node,next){node.parentNode=this;node.nextSibling=next||null;this.children.push(node);}});
const classes=new Set();const attrs=new Map([['aria-label','Orbe original']]);
const home=makeParent('home'),tarot=makeParent('tarot'),menuHost=makeParent('menu');
const orb={dataset:{},isConnected:true,parentNode:home,nextSibling:null,classList:{add:v=>classes.add(v),remove:v=>classes.delete(v),toggle:(v,on)=>on?classes.add(v):classes.delete(v)},getAttribute:n=>attrs.get(n)||null,setAttribute:(n,v)=>attrs.set(n,v),removeAttribute:n=>attrs.delete(n)};
home.children.push(orb);
const core={orb,claimedHost:null,mode:'home',route:'tarot',renderer:{resize(){}},motion:null,setMode(mode){this.mode=mode;},snapshot(){return{};}};
const releaseTarot=SupremeOrbCoreV501.prototype.claim.call(core,tarot,{mode:'tarot',ariaLabel:'Orbe no Tarot'});
const releaseMenu=SupremeOrbCoreV501.prototype.claim.call(core,menuHost,{mode:'menu',ariaLabel:'Orbe no Menu'});
check(orb.parentNode===menuHost&&core.claimedHost===menuHost,'pilha:menu-recebe-orbe');
check(releaseMenu()===true&&orb.parentNode===tarot&&core.claimedHost===tarot&&core.mode==='tarot','pilha:menu-restaura-tarot');
check(releaseTarot()===true&&orb.parentNode===home&&core.claimedHost===null&&core.mode==='home','pilha:tarot-restaura-home');
check(!classes.has('db-supreme-orb--traveling'),'pilha:classe-limpa');

const {CARDS}=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+`?qa=${Date.now()}`);
check(CARDS.length===78&&new Set(CARDS.map(card=>card.id)).size===78&&CARDS.every(card=>card.orientation==='normal'),'regressao:tarot-78-diretas');
const {SKINS_V6=[]}=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+`?qa=${Date.now()}`);
check(SKINS_V6.length===30&&app.includes('identityPaidSkinCount:29'),'regressao:skins');
check(app.includes('schoolModules:17')&&app.includes('schoolLessons:124'),'regressao:escola');
check(app.includes('whitLocalBasic:true')&&app.includes('whitLocalApiCalls:0'),'regressao:whit');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:conteudo');

const total=passed+failures.length;
console.log(`V556 Regressão de Navegação iOS: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
