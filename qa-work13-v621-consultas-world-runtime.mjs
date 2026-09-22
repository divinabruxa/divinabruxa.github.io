import assert from 'node:assert/strict';
import {
  CONSULTAS_WORLD_CONTRACT_V621,
  createConsultasWorldV621
} from './consultas-world-v621.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

class FakeClassList {
  constructor(...values) { this.values = new Set(values); }
  contains(value) { return this.values.has(value); }
}

class FakeNode extends EventTarget {
  constructor({ id = '', tag = 'div', classes = [], dataset = {} } = {}) {
    super();
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.dataset = { ...dataset };
    this.classList = new FakeClassList(...classes);
    this.children = [];
    this.parentNode = null;
    this.textContent = '';
    this.href = '';
    this.rel = '';
    this.removed = false;
  }
  append(...nodes) {
    nodes.filter(Boolean).forEach(node => {
      node.parentNode = this;
      this.children.push(node);
    });
  }
  remove() { this.removed = true; }
  contains(node) {
    if (node?.interactionWithinApp) return true;
    if (node === this) return true;
    return this.children.some(child => child.contains?.(node));
  }
  querySelectorAll(selector) {
    const result = [];
    const wantsTitle = String(selector).includes('h2');
    const visit = node => node.children.forEach(child => {
      if (wantsTitle && child.tagName === 'H2') result.push(child);
      visit(child);
    });
    visit(this);
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

class FakeActionNode {
  constructor(role) { this.role = role; }
  matches(selector) {
    if (this.role === 'start') return selector.includes('consultations-start');
    if (this.role === 'service') return selector.includes('[data-service]');
    if (this.role === 'back') return selector.includes('[data-back-services]');
    if (this.role === 'tracking') return selector.includes('[data-open-tracking]');
    if (this.role === 'review') return selector.includes('[data-consultation-review]');
    return false;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html', tag:'html' });
    this.body = { dataset:{ screen:'consultations' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'consultations', classes:['screen','active'],
      dataset:{ v608CommerceMode:'guide', db596ChamberMode:'arrival' }
    }));
    this.title = new FakeNode({ tag:'h2' });
    this.app = this.add(new FakeNode({ id:'consultationApp', dataset:{ consultationState:'guide' } }));
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
    this.screen.append(this.title,this.app);
    this.interactionWithinApp = true;
    this.interactionRole = '';
  }
  add(node) { this.nodes.set(node.id,node); return node; }
  createElement(tag) { return new FakeNode({ tag }); }
  getElementById(id) { return this.nodes.get(id) || this.head.children.find(node => node.id === id) || null; }
  querySelector(selector) {
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.screen;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return [this.orb];
    if (selector === '#orbCanvas') return [this.canvas];
    return [];
  }
  closest(selector) {
    return selector === 'button,a,summary' && this.interactionRole
      ? new FakeActionNode(this.interactionRole)
      : null;
  }
  matches(selector) {
    return this.interactionRole === 'field'
      && selector.includes('input')
      && selector.includes('textarea');
  }
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#consultations' }; }
}

const fire = (target,type,detail = {}) => target.dispatchEvent(new FakeCustomEvent(type,{ detail }));
let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const contract = CONSULTAS_WORLD_CONTRACT_V621;

ok(contract.version === 621 && contract.work === 'WORK13', 'V621 permanece no WORK13');
ok(contract.reality === 'consultations' && contract.universe === 'templo-do-encontro', 'novo mundo declarado');
ok(contract.identity === 'garnet-rosewood-candle-gold-moon-ivory', 'identidade própria');
ok(contract.sequence.join('|') === 'arrival|one-clear-intention|four-human-readings|one-explicit-choice|essential-contact|private-question-or-context|review|email-handoff|private-protocol|return|silence', 'travessia completa');
ok(contract.consultationsAuthority === 'V558-preserved' && contract.chamberAuthority === 'V596-preserved', 'motor e câmara protegidos');
ok(contract.livingCommerceAuthority === 'V608-preserved', 'clareza V608 protegida');
ok(contract.servicesPreserved === 4 && contract.serviceNamesPreserved.join('|') === 'Mesa Real|Leitura de Mente|Carta de Conselho|Pergunta', 'quatro leituras humanas preservadas');
ok(contract.servicePricesCentsPreserved.join('|') === '25000|20000|15000|5000', 'valores corretos preservados');
ok(contract.priceSnapshotPreserved && contract.futurePricesAdminEditablePreserved && contract.previousOrdersImmutable, 'histórico de valores protegido');
ok(contract.humanReadingOnly && contract.separateFromPremium && contract.separateFromWhit && contract.separateFromAppRoyalTable, 'consulta humana não se mistura');
ok(contract.requiredFieldsPreserved.join('|') === 'name|email|phone|service|question-or-context', 'dados essenciais preservados');
ok(contract.emailRequired && contract.phoneRequired && !contract.whatsappRequired, 'contato sem WhatsApp obrigatório');
ok(contract.operationalContact === 'orbedasrealidades@hotmail.com' && contract.submissionChannel === 'email-only', 'passagem operacional correta');
ok(contract.onlineOnlySubmission && !contract.automaticEmail && !contract.falseDeliveryClaim, 'envio honesto e online');
ok(!contract.realBilling && contract.checkoutChanges === 0 && contract.paymentStatusChanges === 0, 'nenhuma cobrança inventada');
ok(contract.privateByDefault && !contract.otherUserAccess && !contract.analyticsPrivateBodyAccess, 'pedido privado por padrão');
ok(!contract.commonLogsPrivateBodyAccess && !contract.whitSilentRead && !contract.seoPrivateContentAccess, 'nenhum leitor silencioso');
ok(contract.existingConsultationBodyReused && !contract.separateConsultationBody && contract.consultationFunctionChanges === 0, 'mesmo corpo funcional');
ok(contract.privateContentReads === 0 && contract.formValueReads === 0 && contract.questionReads === 0, 'conteúdo privado não é observado');
ok(contract.contactReads === 0 && contract.protocolReads === 0 && contract.accountDataReads === 0, 'contato e protocolo não são lidos');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso contínuo');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
const world = createConsultasWorldV621({
  livingCommerce:{ status:() => ({ version:608 }) },
  chambers:{ status:() => ({ version:596 }) },
  documentTarget:doc,
  windowTarget:win
});

ok(doc.documentElement.dataset.work13ConsultasWorld === 'v621', 'identidade global instalada');
ok(doc.screen.dataset.consultasWorld === 'v621', 'realidade marcada');
ok(doc.screen.dataset.consultasUniverse === 'templo-do-encontro', 'universo anexado');
ok(doc.screen.dataset.consultasWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.consultasWorldPhase === 'invitation', 'chegada oferece uma intenção');
ok(doc.app.dataset.consultasWorld === 'v621' && doc.app.dataset.consultasWorldPrivacy === 'question-contact-protocol-unread', 'app recebe somente estado público');
ok(doc.screen.dataset.consultasWorldSequence === 'arrival-intention-readings-choice-contact-question-review-email-protocol-return-silence', 'ordem pública marcada');
ok(doc.title.textContent === 'Todo encontro começa pela confiança.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('consultas-world-v621.css'), 'estilo único instalado');

doc.interactionRole = 'start';
fire(doc,'click');
ok(world.phase === 'choices' && world.choiceSignals === 1, 'intenção explícita revela as quatro leituras');
fire(doc,'divina:living-commerce-state',{ route:'consultations', mode:'choices', privateBody:'CANARY_PRIVATE_BODY' });
ok(world.phase === 'choices' && world.choiceSignals === 2, 'estado público confirma as escolhas');
doc.interactionRole = 'service';
fire(doc,'click');
ok(world.phase === 'request' && world.choiceSignals === 3, 'escolha de leitura abre o pedido');
doc.interactionRole = 'field';
fire(doc,'focusin');
ok(world.phase === 'details', 'foco explícito abre os dados essenciais');
fire(doc,'divina:consultation-state',{ state:'review', question:'CANARY_PRIVATE_QUESTION', email:'CANARY_PRIVATE_EMAIL' });
ok(world.phase === 'review', 'revisão recebe resposta pública');
fire(doc,'submit',{ formBody:'CANARY_PRIVATE_FORM' });
ok(world.phase === 'handoff' && world.handoffSignals === 1, 'envio explícito abre a passagem por e-mail');
fire(doc,'divina:consultation-protocol-state',{ state:'protocol', protocol:'CANARY_PRIVATE_PROTOCOL' });
ok(world.phase === 'protocol' && world.protocolSignals === 1, 'protocolo público assenta o encontro');
ok(!JSON.stringify(world.status()).includes('CANARY'), 'nenhum conteúdo privado é retido');
fire(doc,'divina:menu-state',{ state:'open' });
ok(world.phase === 'portal', 'menu global abre o portal sem duplicar a Orbe');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(world.phase === 'invitation', 'fechar o menu devolve o encontro');

const audit = world.audit();
ok(audit.consultationsScreenPresent && audit.consultationAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.servicesPreserved === 4 && audit.servicePricesCentsPreserved.join('|') === '25000|20000|15000|5000', 'oferta auditada');
ok(audit.emailRequired && audit.phoneRequired && !audit.whatsappRequired, 'contato auditado');
ok(!audit.realBilling && !audit.automaticEmail, 'sem ficção operacional');
ok(audit.privateContentReads === 0 && audit.formValueReads === 0 && audit.protocolReads === 0, 'auditoria sem invasão');

fire(doc,'divina:route-start',{ id:'store' });
ok(world.phase === 'travel', 'travessia recebe resposta');
doc.body.dataset.screen = 'store';
fire(doc,'divina:route-ready',{ id:'store' });
ok(world.route === 'store' && world.phase === 'rest', 'mundo repousa fora de Consultas');
ok(doc.screen.dataset.consultasWorldPresence === 'away', 'presença não vaza');
const signals = world.publicSignals;
fire(doc,'divina:consultation-state',{ state:'review', body:'CANARY_AWAY' });
ok(world.publicSignals === signals + 1 && world.phase === 'rest', 'sinal externo não reabre Consultas');

doc.body.dataset.screen = 'consultations';
doc.screen.dataset.v608CommerceMode = 'choices';
fire(doc,'divina:route-ready',{ id:'consultations' });
ok(world.route === 'consultations' && world.phase === 'choices', 'retorno recupera somente o estado público');
ok(world.status().automaticNavigation === false && world.status().automaticWhitSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita paralela');
ok(world.status().livingCommerce.version === 608 && world.status().chambers.version === 596, 'autoridades presentes');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaConsultasWorldV621').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13ConsultasWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.consultasWorld && !doc.app.dataset.consultasWorld, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — runtime do Templo do Encontro V621`);
