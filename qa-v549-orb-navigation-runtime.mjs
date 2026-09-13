import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

class DetailEvent extends Event{constructor(type,init={}){super(type);this.detail=init.detail;}}
const documentTarget=new EventTarget();
Object.assign(documentTarget,{
  hidden:false,
  documentElement:{dataset:{},removeAttribute(name){delete this.dataset[name.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())];}},
  body:{dataset:{screen:'home'},setAttribute(){},removeAttribute(){}},
  querySelectorAll(selector){return selector==='#orb'?[{}]:[];}
});
globalThis.document=documentTarget;
globalThis.CustomEvent=DetailEvent;
Object.defineProperty(globalThis,'navigator',{value:{maxTouchPoints:5},configurable:true});
globalThis.matchMedia=()=>({matches:false});

let pauses=0,starts=0;const budgets=[];
const universe={
  targetFps:60,qualityCeiling:1.25,qualityProfile:'balanced',
  status:()=>({targetFps:60,qualityCeiling:1.25,qualityProfile:'balanced'}),
  setPerformanceBudget:value=>budgets.push(value),pause:()=>{pauses++;},start:()=>{starts++;}
};
const root=path.dirname(fileURLToPath(import.meta.url));
const {OrbFluidNavigationV535}=await import(pathToFileURL(path.join(root,'orb-fluid-navigation-v535.js')).href+`?qa=${Date.now()}`);
const controller=new OrbFluidNavigationV535({universe,core:{snapshot:()=>({navigationAuthority:'v535-single-flight'})},journey:{status:()=>({fluidityProfile:'journey-v535'})},pageLoader:{navigationPrepareBudgetMs:88}});
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

document.dispatchEvent(new DetailEvent('divina:supreme-orb-will-navigate',{detail:{from:'home',to:'tarot'}}));
check(pauses===1,'rota:pausa-imediata');
check(document.documentElement.dataset.heavyScene==='paused-for-navigation','rota:estado-pausado');
document.dispatchEvent(new DetailEvent('divina:menu-state',{detail:{state:'opening'}}));
document.dispatchEvent(new DetailEvent('divina:supreme-orb-did-navigate',{detail:{to:'tarot'}}));
await new Promise(resolve=>setTimeout(resolve,90));
check(starts===0,'sobreposicao:menu-segura-pausa');
document.dispatchEvent(new DetailEvent('divina:menu-state',{detail:{state:'open'}}));
await new Promise(resolve=>setTimeout(resolve,80));
check(starts===1,'fim:retoma-uma-vez');
check(!('heavyScene'in document.documentElement.dataset),'fim:remove-estado');
check(budgets.at(-1)?.fps===60,'fim:restaura-orcamento');
check(controller.status().extraAnimationLoops===0,'motor:zero-loop-extra');

document.dispatchEvent(new DetailEvent('divina:supreme-orb-will-navigate',{detail:{from:'tarot',to:'daily'}}));
document.dispatchEvent(new DetailEvent('divina:menu-state',{detail:{state:'closing'}}));
document.dispatchEvent(new DetailEvent('divina:supreme-orb-did-navigate',{detail:{to:'daily'}}));
document.dispatchEvent(new DetailEvent('divina:menu-state',{detail:{state:'closed'}}));
await new Promise(resolve=>setTimeout(resolve,100));
check(starts===2,'ordem-inversa:retoma-sem-congelar');
controller.destroy();

const total=passed+failures.length;
console.log(`V549 Orb Navigation runtime: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
