import assert from 'node:assert/strict';
import {CONTA_WORLD_CONTRACT_V624,createContaWorldV624} from './conta-world-v624.js';
class CE extends Event{constructor(type,o={}){super(type);this.detail=o.detail}}
class CL{constructor(...v){this.v=new Set(v)}contains(v){return this.v.has(v)}}
class Node extends EventTarget{constructor({id='',tag='div',classes=[],dataset={}}={}){super();this.id=id;this.tagName=tag.toUpperCase();this.dataset={...dataset};this.classList=new CL(...classes);this.children=[];this.textContent='';this.href='';this.rel='';this.removed=false}append(...n){n.forEach(x=>this.children.push(x))}remove(){this.removed=true}querySelectorAll(s){const a=[];const visit=n=>n.children.forEach(c=>{if(String(s).includes('h2')&&c.tagName==='H2')a.push(c);if(String(s).includes('#accountWorldV319')&&c.id==='accountWorldV319')a.push(c);visit(c)});visit(this);return a}querySelector(s){return this.querySelectorAll(s)[0]||null}}
class Target{constructor(role){this.role=role}matches(s){return this.role==='field'&&s.includes('#login input')}closest(s){const r=this.role;if(s==='#login [data-acw319-main]')return r==='entry'?{}:null;if(s.includes('button[type="submit"]'))return r==='submit'?{}:null;if(s.includes('[data-logout]'))return r==='security'?{}:null;if(s.includes('[data-delete-account]'))return r==='critical'?{}:null;if(s.includes('[data-export]'))return r==='data'?{}:null;return null}}
class Doc extends EventTarget{constructor(){super();this.defaultView={CustomEvent:CE};this.documentElement=new Node({id:'html',tag:'html'});this.body={dataset:{screen:'login'}};this.head={children:[],append:n=>this.head.children.push(n)};this.nodes=new Map();this.screen=this.add(new Node({id:'login',classes:['screen','active'],dataset:{v608CommerceMode:'guide',v608Auth:'guest'}}));this.title=new Node({tag:'h2'});this.guide=new Node({id:'accountWorldV319'});this.orb=this.add(new Node({id:'orb'}));this.canvas=this.add(new Node({id:'orbCanvas',tag:'canvas'}));this.orb.append(this.canvas);this.screen.append(this.title,this.guide)}add(n){this.nodes.set(n.id,n);return n}createElement(tag){return new Node({tag})}getElementById(id){return this.nodes.get(id)||this.head.children.find(n=>n.id===id)||null}querySelector(s){if(s==='#app > .screen.active[id],.screen.active[id]')return this.screen;return null}querySelectorAll(s){if(s==='#orb')return[this.orb];if(s==='#orbCanvas')return[this.canvas];return[]}}
class Win extends EventTarget{constructor(){super();this.location={hash:'#login'}}}
const fire=(t,type,detail={},target=null)=>{const e=new CE(type,{detail});if(target)Object.defineProperty(e,'target',{value:target});t.dispatchEvent(e)};
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++};const c=CONTA_WORLD_CONTRACT_V624;
ok(c.version===624&&c.work==='WORK13'&&c.universe==='casa-do-retorno','mundo V624');
ok(c.sequence.length===8&&c.reality==='login','travessia clara');
ok(c.accountAuthority==='V201-preserved'&&c.accountWorldAuthority==='V319-preserved'&&c.livingCommerceAuthority==='V608-preserved','autoridades protegidas');
ok(c.authSessionStorageOnly&&!c.authLocalStorageTokens&&c.serverAuthority,'sessão governada');
ok(c.rowLevelSecurityPreserved&&c.emailVerificationPreserved&&c.passwordResetPreserved,'segurança preservada');
ok(c.logoutPreserved&&c.globalSessionExitPreserved&&c.exportPreserved&&c.accountDeletionPreserved,'controle preservado');
ok(c.criticalFlowBypassPreserved&&c.criticalActionsRequireServerConfirmation,'fluxos críticos diretos');
ok(c.journalPrivateByDefault&&!c.journalCloudConsentDefault&&c.journalCloudSyncOptInOnly,'Diário privado');
ok(!c.marketingConsentDefault&&c.notificationQuietHours==='22:00-08:00 America/Sao_Paulo','consentimento preservado');
ok(c.formValueReads===0&&c.passwordReads===0&&c.emailReads===0&&c.profileReads===0,'camada não lê campos');
ok(c.authPayloadReads===0&&c.journalBodyReads===0&&c.billingPayloadReads===0,'payloads privados intocados');
ok(c.reusesCanonicalOrb&&c.newCanvases===0&&c.newRenderers===0,'uma Orbe');
ok(c.permanentAnimationLoops===0&&c.mutationObservers===0&&c.deferredTimers===0,'sem peso contínuo');
ok(c.work14===false,'sem WORK14');
const doc=new Doc(),win=new Win();const world=createContaWorldV624({account:{status:()=>({version:201})},accountWorld:{status:()=>({version:319})},livingCommerce:{status:()=>({version:608})},documentTarget:doc,windowTarget:win});
ok(doc.documentElement.dataset.work13ContaWorld==='v624','identidade global');
ok(doc.screen.dataset.contaUniverse==='casa-do-retorno'&&doc.screen.dataset.contaWorldPresence==='present','casa presente');
ok(world.phase==='invitation'&&doc.screen.dataset.contaWorldPrivacy.includes('private-unread'),'chegada privada');
ok(doc.title.textContent==='Sua presença continua sob seu controle.','convite único');
ok(doc.head.children.length===1&&doc.head.children[0].href.includes('conta-world-v624.css'),'estilo único');
fire(doc,'click',{},new Target('entry'));ok(world.phase==='authentication'&&world.entrySignals===1,'entrada revela autenticação');
fire(doc,'focusin',{},new Target('field'));ok(world.phase==='authentication'&&world.formSignals===1,'foco responde sem leitura');
fire(doc,'click',{},new Target('submit'));ok(world.formSignals===2,'envio público responde');
doc.screen.dataset.v608Auth='authenticated';fire(doc,'divina:auth-state',{email:'CANARY_PRIVATE_EMAIL'});ok(world.phase==='settled'&&world.authSignals===1,'estado autenticado assenta');
ok(!JSON.stringify(world.status()).includes('CANARY'),'payload de auth não é retido');
fire(doc,'click',{},new Target('security'));ok(world.phase==='security'&&world.securitySignals===1,'segurança explícita');
fire(doc,'click',{},new Target('data'));ok(world.phase==='data'&&world.dataSignals===1,'dados explícitos');
fire(doc,'click',{},new Target('critical'));ok(world.phase==='critical'&&world.securitySignals===2,'ação crítica responde');
fire(doc,'divina:menu-state',{state:'open'});ok(world.phase==='portal','menu abre portal');
doc.screen.dataset.v608CommerceMode='detail';fire(doc,'divina:menu-state',{state:'closed'});ok(world.phase==='continuity','retorno recupera continuidade pública');
const a=world.audit();ok(a.oneCanonicalOrb&&a.oneCanonicalCanvas&&a.duplicateOrbs===0&&a.accountGuideReused,'unicidade e guia auditados');
ok(a.formValueReads===0&&a.authPayloadReads===0&&a.journalBodyReads===0,'privacidade auditada');
fire(doc,'divina:route-start',{id:'home'});ok(world.phase==='travel','travessia responde');
doc.body.dataset.screen='home';fire(doc,'divina:route-ready',{id:'home'});ok(world.phase==='rest'&&doc.screen.dataset.contaWorldPresence==='away','repouso fora da Conta');
ok(world.status().networkCalls===0&&world.status().storageWrites===0&&world.status().work14===false,'sem efeito paralelo');
world.destroy();ok(doc.getElementById('divinaContaWorldV624').removed===true&&!doc.documentElement.dataset.work13ContaWorld,'desmontagem limpa mundo');
console.log(`PASS ${checks}/${checks} — runtime da Casa do Retorno V624`);
