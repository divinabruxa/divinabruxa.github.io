import assert from 'node:assert/strict';
import {createCosmosEntryIntentionV610} from './cosmos-entry-intention-v610.js';

class TestCustomEvent extends Event{constructor(type,options={}){super(type,options);this.detail=options.detail;}}
globalThis.CustomEvent=TestCustomEvent;

class NodeLike extends EventTarget{
  constructor({dataset={}}={}){super();this.dataset=dataset;this.attrs={};this.children=[];this.parentElement=null;this.tabIndex=0;this.textContent='';}
  append(node){if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(child=>child!==node);this.children.push(node);node.parentElement=this;}
  setAttribute(name,value){this.attrs[name]=String(value);}
  getAttribute(name){return this.attrs[name]??null;}
  querySelector(){return null;}
  querySelectorAll(){return [];}
  closest(){return null;}
}

const routes=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
const body=new NodeLike({dataset:{screen:'home'}});
const html=new NodeLike({dataset:{work12State:'REST'}});
const homeHost=new NodeLike();
const entry=new NodeLike();
const pentagram=new NodeLike();
entry.querySelector=selector=>selector==='img'?pentagram:null;
const orb=new NodeLike();
const journal=new NodeLike({dataset:{db596ChamberState:'engaged'}});
const labels=new Map();
const portals=routes.map(route=>{
  const label=new NodeLike();labels.set(route,label);
  const portal=new NodeLike({dataset:{v502Route:route}});
  portal.querySelector=selector=>selector==='.db502-portal__label'?label:null;
  return portal;
});
const homeLabel=new NodeLike();
const menuRoot=new NodeLike();
menuRoot.querySelectorAll=selector=>selector==='[data-v502-route]'?portals:[];
menuRoot.querySelector=selector=>selector==='.db502-menu__home-label'?homeLabel:null;
const doc=new NodeLike();
doc.body=body;doc.documentElement=html;
doc.getElementById=id=>({cosmosEntryIntent:entry,orb,journal,divinaOrbitalMenuV502:menuRoot})[id]||null;
doc.querySelector=selector=>selector==='#home .orb-stage-ref'?homeHost:null;
const win=new NodeLike();win.location={hash:'#home'};

let calls=0;let pulses=0;let opens=0;let closes=0;
let menu={root:menuRoot,state:'closed',targetOpen:false,open(){opens+=1;return true;},close(){closes+=1;return true;}};
const controller=createCosmosEntryIntentionV610({
  documentTarget:doc,windowTarget:win,
  continuity:{cancelHomeTap(){return true;},callUniverse(){calls+=1;return true;}},
  orbCore:{pulse(){pulses+=1;}},menuResolver:()=>menu
});

let checks=0;
const ok=(condition,message)=>{assert.ok(condition,message);checks+=1;};
const fire=(target,type,detail={})=>target.dispatchEvent(new TestCustomEvent(type,{detail,cancelable:true}));

ok(controller.status().version===630,'autoridade V630');
ok(controller.status().phase==='FECHAMENTO-SUPREMO','fase correta');
ok(controller.status().work13==='concluido-e-congelado','WORK13 congelado');
ok(controller.status().work14===false,'sem WORK14');
ok(entry.parentElement===homeHost,'Entrá nasce junto da Orbe');
ok(entry.dataset.work13MenuPosition==='orb-threshold','porta no limiar da Orbe');
ok(entry.getAttribute('aria-label')==='Entrá na Divina Bruxa','convite acessível');
ok(controller.status().visibleEntryWords===1,'uma palavra visível na Home');
ok(html.dataset.fechamentoMenu==='v630','autoridade de fechamento publicada');
ok(html.dataset.work14==='false','WORK14 bloqueado no runtime');
ok(controller.status().renamedRealities===15,'quinze realidades preservadas');
ok(homeLabel.textContent==='Início','retorno chama Início');

fire(entry,'pointerdown');
ok(pulses===1,'toque responde imediatamente');
ok(entry.dataset.response==='answering','estado de resposta imediato');
fire(entry,'pointerup');
ok(entry.dataset.response==='ready','resposta volta ao silêncio');
fire(entry,'click');
ok(calls===1,'Home abre o universo uma vez');
ok(controller.status().openCalls===1,'abertura auditável');

menu={...menu,state:'opening',targetOpen:true};
fire(doc,'divina:menu-state',{state:'opening'});
ok(entry.parentElement===body,'gatilho fica global durante o menu');
ok(entry.dataset.work13MenuPosition==='top-corner','pentagrama global durante o menu');
ok(entry.getAttribute('aria-label')==='Fechar o universo de caminhos','mesmo gesto fecha');
fire(entry,'click');
ok(closes===1,'fechamento único');
menu={...menu,state:'closed',targetOpen:false};
fire(doc,'divina:menu-state',{state:'closed'});
ok(entry.parentElement===homeHost,'porta retorna à Orbe');
ok(entry.getAttribute('aria-label')==='Entrá na Divina Bruxa','convite retorna intacto');

controller.continuity=null;
for(const route of routes){
  fire(doc,'divina:route-ready',{id:route});
  ok(controller.route===route,`rota ${route}`);
  ok(entry.parentElement===body,`menu global em ${route}`);
  ok(entry.dataset.work13MenuPosition==='top-corner',`presença discreta em ${route}`);
  ok(entry.getAttribute('aria-label')==='Abrir o universo de caminhos',`nome acessível em ${route}`);
  ok(controller.status().visibleEntryWords===0,`sem texto técnico em ${route}`);
  ok(controller.openUniverse('qa-world')===true,`abertura em ${route}`);
  fire(doc,'divina:menu-state',{state:'closed'});
}
ok(opens===routes.length,'uma abertura por mundo');
ok(controller.status().openFailures===0,'nenhuma falha de abertura');
ok(controller.status().technicalMenuCopy===0,'zero cópia técnica');
ok(controller.status().permanentAnimationLoops===0,'zero loop permanente');

fire(doc,'divina:route-ready',{id:'home'});
ok(entry.parentElement===homeHost,'ida e volta terminam na mesma porta');
ok(controller.status().visibleEntryWords===1,'Entrá reaparece somente na Home');
controller.destroy();
console.log(`V631 entrada/runtime: ${checks}/${checks} PASS`);
