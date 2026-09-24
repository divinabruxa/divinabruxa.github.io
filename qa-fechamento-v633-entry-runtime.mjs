import assert from 'node:assert/strict';
import {createCosmosEntryIntentionV610} from './cosmos-entry-intention-v610.js';

class TestCustomEvent extends Event{constructor(type,options={}){super(type,options);this.detail=options.detail;}}
globalThis.CustomEvent=TestCustomEvent;

const dataName=name=>name.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());

class NodeLike extends EventTarget{
  constructor({id='',className='',dataset={}}={}){
    super();
    this.id=id;this.className=className;this.dataset={...dataset};this.attrs={};
    this.children=[];this.parentElement=null;this.tabIndex=0;this.textContent='';
    this.disabled=false;this.clicks=0;this.selectorMap=new Map();
  }
  append(node){
    if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(child=>child!==node);
    this.children.push(node);node.parentElement=this;
  }
  setAttribute(name,value){this.attrs[name]=String(value);if(name.startsWith('data-'))this.dataset[dataName(name)]=String(value);}
  getAttribute(name){return name.startsWith('data-')?(this.dataset[dataName(name)]??null):(this.attrs[name]??null);}
  removeAttribute(name){delete this.attrs[name];if(name.startsWith('data-'))delete this.dataset[dataName(name)];}
  contains(node){for(let current=node;current;current=current.parentElement)if(current===this)return true;return false;}
  matches(selector){
    return String(selector).split(',').some(raw=>{
      const value=raw.trim();
      if(value==='#orb')return this.id==='orb';
      if(value.startsWith('#'))return this.id===value.slice(1);
      if(value.startsWith('.'))return String(this.className).split(/\s+/).includes(value.slice(1));
      const data=value.match(/^\[data-([a-z0-9-]+)(?:="([^"]*)")?\]$/i);
      if(data){const current=this.dataset[dataName(`data-${data[1]}`)];return data[2]===undefined?current!==undefined:current===data[2];}
      return false;
    });
  }
  closest(selector){for(let node=this;node;node=node.parentElement)if(node.matches?.(selector))return node;return null;}
  querySelector(selector){return this.selectorMap.get(selector)||null;}
  querySelectorAll(selector){const value=this.selectorMap.get(selector);return Array.isArray(value)?value:value?[value]:[];}
  click(){this.clicks+=1;this.dispatchEvent(new TestCustomEvent('click',{cancelable:true}));}
}

const routes=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
const body=new NodeLike({dataset:{screen:'home'}});
const html=new NodeLike({dataset:{work12State:'REST'}});
const homeHost=new NodeLike({className:'orb-stage-ref'});
const persistentHost=new NodeLike({id:'persistentOrb'});body.append(persistentHost);
const entry=new NodeLike({id:'cosmosEntryIntent'});
const pentagram=new NodeLike();entry.selectorMap.set('img',pentagram);
const orb=new NodeLike({id:'orb'});persistentHost.append(orb);

const screens=new Map();
const depthButtons=new Map();
const primaryButtons=new Map();
for(const route of routes){
  const screen=new NodeLike({id:route});
  const threshold=new NodeLike({className:'db585-intent-threshold'});
  const stage=new NodeLike({className:'db585-intent-threshold__stage'});
  const host=new NodeLike({className:'db585-intent-threshold__orb-host',dataset:{v585OrbHost:'true'}});
  const depth=new NodeLike({dataset:{v585Depth:route}});
  threshold.append(stage);stage.append(host);threshold.append(depth);screen.append(threshold);body.append(screen);
  screen.selectorMap.set(':scope > .db585-intent-threshold [data-v585-depth]',depth);
  screens.set(route,screen);depthButtons.set(route,depth);
}
for(const [route,selector] of Object.entries({
  consultations:'[data-v608-action="consultations-start"]',
  store:'[data-v608-action="store-start"]',
  subscriptions:'[data-v608-action="subscriptions-primary"]'
})){
  const button=new NodeLike();screens.get(route).selectorMap.set(selector,button);primaryButtons.set(route,button);
}

const labels=new Map();
const portals=routes.map(route=>{
  const label=new NodeLike();labels.set(route,label);
  const portal=new NodeLike({dataset:{v502Route:route}});
  portal.selectorMap.set('.db502-portal__label',label);
  return portal;
});
const homeLabel=new NodeLike();
const menuRoot=new NodeLike({id:'divinaOrbitalMenuV502'});
menuRoot.selectorMap.set('[data-v502-route]',portals);
menuRoot.selectorMap.set('.db502-menu__home-label',homeLabel);

const doc=new NodeLike();
const documentHandlers=new Map();
const addDocumentListener=doc.addEventListener.bind(doc);
doc.addEventListener=(type,handler,options)=>{
  if(!documentHandlers.has(type))documentHandlers.set(type,[]);
  documentHandlers.get(type).push(handler);
  addDocumentListener(type,handler,options);
};
doc.body=body;doc.documentElement=html;
doc.getElementById=id=>{
  if(id==='cosmosEntryIntent')return entry;
  if(id==='orb')return orb;
  if(id==='divinaOrbitalMenuV502')return menuRoot;
  return screens.get(id)||null;
};
doc.querySelector=selector=>selector==='#home .orb-stage-ref'?homeHost:null;

const win=new NodeLike();
win.location={hash:'#home'};
win.queueMicrotask=queueMicrotask;

let universeCalls=0;let pulses=0;let menuOpens=0;let menuCloses=0;
let menu={
  root:menuRoot,state:'closed',targetOpen:false,
  open(){menuOpens+=1;return true;},
  close(){menuCloses+=1;return true;}
};

const controller=createCosmosEntryIntentionV610({
  documentTarget:doc,windowTarget:win,
  continuity:{cancelHomeTap(){return true;},callUniverse(){universeCalls+=1;return true;}},
  orbCore:{pulse(){pulses+=1;}},menuResolver:()=>menu
});

let checks=0;
const ok=(condition,message)=>{assert.ok(condition,message);checks+=1;};
const fire=(target,type,detail={})=>target.dispatchEvent(new TestCustomEvent(type,{detail,cancelable:true}));
const routeTo=(route,{orbInside=true}={})=>{
  body.dataset.screen=route;win.location.hash=`#${route}`;
  if(orbInside){
    const host=screens.get(route).children[0].children[0].children[0];host.append(orb);
  }else persistentHost.append(orb);
  fire(doc,'divina:route-ready',{id:route});
};
const capturedClick=documentHandlers.get('click')[0];
const capturedKeydown=documentHandlers.get('keydown')[0];

ok(controller.status().version===633,'autoridade V633');
ok(controller.status().phase==='FECHAMENTO-SUPREMO','fase correta');
ok(controller.status().work13==='concluido-com-auditoria-real','auditoria real publicada');
ok(controller.status().work14===false,'sem WORK14');
ok(controller.status().worldOrbOpensMenu===false,'Orbe do mundo não abre menu');
ok(controller.status().worldOrbAction==='open-current-world','Orbe abre o mundo atual');
ok(entry.parentElement===homeHost,'Entrá nasce junto da Orbe na Home');
ok(entry.getAttribute('aria-label')==='Entrá na Divina Bruxa','convite acessível');
ok(html.dataset.fechamentoSupremo==='v633','fechamento V633 ativo');
ok(html.dataset.fsupremeWorlds==='v633','lei dos mundos ativa');
ok(controller.status().renamedRealities===15,'quinze realidades nomeadas');
ok(homeLabel.textContent==='Início','retorno chama Início');

fire(entry,'pointerdown');fire(entry,'pointerup');fire(entry,'click');
ok(universeCalls===1,'pentagrama abre o universo na Home');
ok(pulses===1,'pentagrama responde no mesmo toque');

routeTo('consultations');
ok(entry.parentElement===body,'pentagrama fica global nos mundos');
ok(screens.get('consultations').dataset.fsupremeWorldPhase==='arrival','Consultas chega com Orbe sozinha');
ok(orb.dataset.fsupremeOrbPath==='true','caminho físico da Orbe marcado');
let prevented=0;let stopped=0;
capturedClick({target:orb,detail:1,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}});
await Promise.resolve();
ok(prevented===1&&stopped===1,'toque não escapa para o menu');
ok(screens.get('consultations').dataset.fsupremeWorldPhase==='world','Consultas abre no toque da Orbe');
ok(depthButtons.get('consultations').clicks===1,'limiar antigo atravessado uma vez');
ok(primaryButtons.get('consultations').clicks===1,'entrada real de Consultas acionada');
ok(menuOpens===0,'Orbe de Consultas não abriu menu');
ok(controller.status().depthActionClicks===1,'profundidade auditável');
ok(controller.status().primaryActionClicks===1,'ação principal auditável');

capturedClick({target:orb,detail:1,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}});
ok(menuOpens===0,'segundo toque continua dentro de Consultas');
ok(controller.status().worldOrbResponses>=2,'segundo toque responde sem navegar');

fire(entry,'click');
ok(menuOpens===1,'pentagrama, e somente ele, abre menu no mundo');
menu={...menu,state:'opening',targetOpen:true};fire(doc,'divina:menu-state',{state:'opening'});
const beforePrevented=prevented,beforeStopped=stopped;
capturedClick({target:orb,detail:1,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}});
ok(prevented===beforePrevented&&stopped===beforeStopped,'menu aberto governa a Orbe sem interceptação');
fire(entry,'click');
ok(menuCloses===1,'mesmo pentagrama fecha menu');
menu={...menu,state:'closed',targetOpen:false};fire(doc,'divina:menu-state',{state:'closed'});

for(const route of routes){
  routeTo(route,{orbInside:route!=='tarot'});
  const screen=screens.get(route);
  ok(controller.route===route,`rota ${route}`);
  ok(controller.worldPhase==='arrival',`chegada limpa em ${route}`);
  ok(screen.dataset.fsupremeWorldPhase==='arrival',`contrato visual em ${route}`);
  ok(entry.getAttribute('aria-label')==='Abrir o universo de caminhos',`pentagrama acessível em ${route}`);
  ok(controller.status().visibleEntryWords===0,`sem Entrá repetido em ${route}`);
}

routeTo('journal');
prevented=0;stopped=0;
capturedKeydown({target:orb,key:'Enter',repeat:false,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}});
await Promise.resolve();
ok(prevented===1&&stopped===1,'teclado abre Diário sem chamar menu');
ok(depthButtons.get('journal').clicks===1,'Orbe substitui Mergulhar no Diário');
ok(screens.get('journal').dataset.fsupremeWorldPhase==='world','Diário real revelado');

routeTo('store');
capturedClick({target:orb,detail:1,preventDefault(){},stopImmediatePropagation(){}});
await Promise.resolve();
ok(depthButtons.get('store').clicks===1,'Loja atravessa limiar');
ok(primaryButtons.get('store').clicks===1,'Loja abre curadoria real');

routeTo('subscriptions');
capturedClick({target:orb,detail:1,preventDefault(){},stopImmediatePropagation(){}});
await Promise.resolve();
ok(primaryButtons.get('subscriptions').clicks===1,'Premium abre conteúdo real');

routeTo('tarot',{orbInside:false});
prevented=0;stopped=0;
capturedClick({target:orb,detail:1,preventDefault(){prevented+=1;},stopImmediatePropagation(){stopped+=1;}});
ok(prevented===0&&stopped===0,'gesto nativo do Tarot permanece livre');
ok(screens.get('tarot').dataset.fsupremeWorldPhase==='world','Tarot nasce no primeiro toque');

body.dataset.screen='home';win.location.hash='#home';persistentHost.append(orb);fire(doc,'divina:route-ready',{id:'home'});
ok(entry.parentElement===homeHost,'ida e volta terminam na mesma porta');
ok(controller.status().visibleEntryWords===1,'Entrá reaparece somente na Home');
ok(controller.status().openFailures===0,'nenhuma falha de menu');
ok(controller.status().permanentAnimationLoops===0,'zero loop permanente');

controller.destroy();
console.log(`V633 entrada/runtime: ${checks}/${checks} PASS`);
