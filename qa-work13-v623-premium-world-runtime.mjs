import assert from 'node:assert/strict';
import { PREMIUM_WORLD_CONTRACT_V623,createPremiumWorldV623 } from './premium-world-v623.js';

class FakeCustomEvent extends Event { constructor(type,options={}){ super(type);this.detail=options.detail; } }
class FakeClassList { constructor(...values){this.values=new Set(values)} contains(value){return this.values.has(value)} }
class FakeNode extends EventTarget {
  constructor({id='',tag='div',classes=[],dataset={}}={}){super();this.id=id;this.tagName=tag.toUpperCase();this.dataset={...dataset};this.classList=new FakeClassList(...classes);this.children=[];this.parentNode=null;this.textContent='';this.href='';this.rel='';this.removed=false;}
  append(...nodes){nodes.filter(Boolean).forEach(node=>{node.parentNode=this;this.children.push(node)})}
  remove(){this.removed=true}
  querySelectorAll(selector){const out=[];const visit=node=>node.children.forEach(child=>{if(String(selector).includes('h2')&&child.tagName==='H2')out.push(child);visit(child)});visit(this);return out}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null}
}
class FakeAction {
  constructor(action=''){this.dataset={v608Action:action}}
}
class FakeTarget {
  constructor(role=''){this.role=role}
  closest(selector){
    if(selector==='[data-v608-action]'){
      const map={entry:'subscriptions-primary',premium:'subscriptions-premium',ai:'subscriptions-ai',access:'subscriptions-access'};
      return map[this.role]?new FakeAction(map[this.role]):null;
    }
    if(selector==='[data-purchase]')return this.role==='purchase'?{}:null;
    if(selector==='[data-restore]')return this.role==='restore'?{}:null;
    if(selector==='[data-refund],[data-revoke],[data-cancel-subscription]')return this.role==='lifecycle'?{}:null;
    return null;
  }
}
class FakeDocument extends EventTarget {
  constructor(){
    super();this.defaultView={CustomEvent:FakeCustomEvent};this.documentElement=new FakeNode({id:'html',tag:'html'});this.body={dataset:{screen:'subscriptions'}};this.head={children:[],append:node=>this.head.children.push(node)};this.nodes=new Map();
    this.screen=this.add(new FakeNode({id:'subscriptions',classes:['screen','active'],dataset:{v608CommerceMode:'guide',v608PremiumSection:'premium'}}));
    this.title=new FakeNode({tag:'h2'});this.app=this.add(new FakeNode({id:'subscriptionApp'}));this.orb=this.add(new FakeNode({id:'orb',tag:'button'}));this.canvas=this.add(new FakeNode({id:'orbCanvas',tag:'canvas'}));this.orb.append(this.canvas);this.screen.append(this.title,this.app);
  }
  add(node){this.nodes.set(node.id,node);return node}
  createElement(tag){return new FakeNode({tag})}
  getElementById(id){return this.nodes.get(id)||this.head.children.find(node=>node.id===id)||null}
  querySelector(selector){if(selector==='#app > .screen.active[id],.screen.active[id]')return this.screen;return null}
  querySelectorAll(selector){if(selector==='#orb')return[this.orb];if(selector==='#orbCanvas')return[this.canvas];return[]}
}
class FakeWindow extends EventTarget { constructor(){super();this.location={hash:'#subscriptions'}} }
const fire=(target,type,detail={},eventTarget=null)=>{const event=new FakeCustomEvent(type,{detail});if(eventTarget)Object.defineProperty(event,'target',{value:eventTarget});target.dispatchEvent(event)};
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1};const c=PREMIUM_WORLD_CONTRACT_V623;
ok(c.version===623&&c.work==='WORK13','release dentro do WORK13');
ok(c.universe==='sala-das-chaves'&&c.reality==='subscriptions','mundo declarado');
ok(c.sequence.length===9&&c.sections.join('|')==='premium|ai|access','travessia e três chaves');
ok(c.premiumAuthority==='V191-preserved'&&c.livingCommerceAuthority==='V608-preserved','autoridades preservadas');
ok(c.premiumLifetimeCents===19990&&c.premiumBillingMode==='one-time'&&c.skinsIncluded===30,'Premium verdadeiro');
ok(!c.aiIncludedInPremium&&c.aiMonthlyCents===8990&&c.aiCreditsPerCycle===400,'IA separada');
ok(c.aiModels.Luna===1&&c.aiModels.Terra===10&&c.aiModels.Sol==='off','modelos governados');
ok(JSON.stringify(c.extraCreditPacks)==='[[200,3990],[600,9990],[1500,19990]]','pacotes preservados');
ok(c.environment==='staging'&&c.simulatorOnly&&!c.realBilling,'STAGING sem cobrança real');
ok(!c.stripeCheckout&&!c.stripeWebhook&&!c.customerPortal&&!c.automaticTax,'travas reais desligadas');
ok(c.serverAuthority&&!c.frontendEntitlementGrants,'servidor é autoridade');
ok(c.restorePreserved&&c.refundPreserved&&c.revokePreserved&&c.cancelSubscriptionPreserved,'ciclo reversível');
ok(c.billingPayloadReads===0&&c.paymentDataReads===0&&c.privateContentReads===0,'privacidade preservada');
ok(c.reusesCanonicalOrb&&c.newCanvases===0&&c.newRenderers===0,'uma Orbe');
ok(c.permanentAnimationLoops===0&&c.mutationObservers===0&&c.deferredTimers===0,'sem peso contínuo');
ok(c.work14===false,'sem WORK14');

const doc=new FakeDocument();const win=new FakeWindow();const world=createPremiumWorldV623({premiumEngine:{status:()=>({version:191})},livingCommerce:{status:()=>({version:608})},documentTarget:doc,windowTarget:win});
ok(doc.documentElement.dataset.work13PremiumWorld==='v623','identidade global');
ok(doc.screen.dataset.premiumUniverse==='sala-das-chaves'&&doc.screen.dataset.premiumWorldPresence==='present','sala presente');
ok(world.phase==='invitation'&&doc.app.dataset.premiumWorldPrivacy==='billing-account-payment-private-unread','chegada privada');
ok(doc.title.textContent==='Escolha somente a chave que abre o que você quer viver.','convite único');
ok(doc.head.children.length===1&&doc.head.children[0].href.includes('premium-world-v623.css'),'estilo único');
fire(doc,'click',{},new FakeTarget('entry'));ok(world.phase==='keys'&&world.entrySignals===1,'intenção abre três chaves');
fire(doc,'click',{},new FakeTarget('premium'));ok(world.phase==='premium'&&world.selectedKey==='premium','câmara Premium');
fire(doc,'click',{},new FakeTarget('ai'));ok(world.phase==='ai'&&world.selectedKey==='ai','câmara IA');
fire(doc,'click',{},new FakeTarget('access'));ok(world.phase==='access'&&world.selectedKey==='access','câmara Acessos');
fire(doc,'click',{},new FakeTarget('purchase'));ok(world.phase==='confirmation'&&world.actionSignals===1,'ação STAGING responde');
fire(doc,'divina:billing-updated',{secret:'CANARY_PRIVATE_BILLING'});ok(world.phase==='settled'&&world.billingSignals===1,'retorno público assenta');
ok(!JSON.stringify(world.status()).includes('CANARY'),'payload de billing não é retido');
fire(doc,'divina:menu-state',{state:'open'});ok(world.phase==='portal','menu mágico abre portal');
fire(doc,'divina:menu-state',{state:'closed'});ok(world.phase==='access','retorno à chave escolhida');
const audit=world.audit();ok(audit.oneCanonicalOrb&&audit.oneCanonicalCanvas&&audit.duplicateOrbs===0,'unicidade auditada');
ok(!audit.realBilling&&audit.simulatorOnly&&audit.serverAuthority&&!audit.frontendEntitlementGrants,'governança auditada');
fire(doc,'divina:route-start',{id:'login'});ok(world.phase==='travel','travessia responde');
doc.body.dataset.screen='login';fire(doc,'divina:route-ready',{id:'login'});ok(world.phase==='rest'&&doc.screen.dataset.premiumWorldPresence==='away','repouso fora da sala');
ok(world.status().networkCalls===0&&world.status().storageWrites===0&&world.status().work14===false,'sem efeito paralelo');
world.destroy();ok(doc.getElementById('divinaPremiumWorldV623').removed===true,'desmontagem remove estilo');
ok(!doc.documentElement.dataset.work13PremiumWorld&&!doc.screen.dataset.premiumWorld&&!doc.app.dataset.premiumWorld,'desmontagem limpa identidade');
console.log(`PASS ${checks}/${checks} — runtime da Sala das Chaves V623`);
