import assert from 'node:assert/strict';
import {
  DIARIO_WORLD_CONTRACT_V619,
  createDiarioWorldV619
} from './diario-world-v619.js';

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
  querySelectorAll(selector) {
    const result = [];
    const last = String(selector).split(/\s+|>/).filter(Boolean).at(-1);
    const visit = node => node.children.forEach(child => {
      if ((last === 'h2' && child.tagName === 'H2') || (last === '#journalApp' && child.id === 'journalApp')) result.push(child);
      visit(child);
    });
    visit(this);
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html', tag:'html' });
    this.body = { dataset:{ screen:'journal' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'journal', classes:['screen','active'],
      dataset:{
        db596ChamberState:'threshold',
        db596ChamberMode:'none',
        journalSoulPhase:'threshold'
      }
    }));
    this.title = new FakeNode({ tag:'h2' });
    this.app = this.add(new FakeNode({
      id:'journalApp',
      dataset:{ v607JournalMode:'write', journalSoulPhase:'threshold' }
    }));
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
    this.screen.append(this.title,this.app);
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
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#journal' }; }
}

const fire = (target,type,detail = {}) => target.dispatchEvent(new FakeCustomEvent(type,{ detail }));
let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const contract = DIARIO_WORLD_CONTRACT_V619;

ok(contract.version === 619 && contract.work === 'WORK13', 'V619 permanece no WORK13');
ok(contract.reality === 'journal' && contract.universe === 'camara-da-tinta-viva', 'novo mundo declarado');
ok(contract.identity === 'obsidian-parchment-carmine-moon-silver', 'identidade própria');
ok(contract.sequence.join('|') === 'arrival|orb-threshold|blank-page|direct-writing|silent-autosave|ink-settles|optional-details|memories-on-explicit-request|aggregate-mirror-on-explicit-request|return|silence', 'travessia completa');
ok(contract.journalAuthority === 'V556-preserved' && contract.journalWorldAuthority === 'V317-preserved', 'Diário e motor protegidos');
ok(contract.chamberAuthority === 'V596-preserved' && contract.livingWisdomAuthority === 'V607-preserved' && contract.soulAuthority === 'V610-preserved', 'câmara, caminho e alma protegidos');
ok(contract.directWritingFirst && contract.blankPageFirst && contract.silentAutosavePreserved, 'papel e escrita vêm primeiro');
ok(contract.offlinePreserved && contract.syncConflictProtectionPreserved, 'offline e conflitos protegidos');
ok(contract.memoriesRequireExplicitGesture && contract.mirrorRequiresExplicitGesture, 'profundidade só quando chamada');
ok(contract.timelinePageSizePreserved === 12 && contract.timelineFullImageRequestsPreserved === 0, 'timeline leve preservada');
ok(contract.mirrorAggregateOnly && !contract.mirrorDiagnosis && !contract.mirrorPrediction, 'Espelho agregado e ético');
ok(contract.capabilitiesPreserved.length === 22, 'motor funcional inteiro preservado');
ok(contract.privateByDefault && !contract.adminBodyAccess && !contract.analyticsBodyAccess && !contract.whitSilentRead, 'corpo privado não é observado');
ok(contract.whitShareRequiresExplicitTemporaryConsent && contract.exportUserControlled && contract.deleteUserControlled, 'controle permanece com a usuária');
ok(contract.privateContentReads === 0 && contract.journalBodyReads === 0 && contract.formValueReads === 0, 'camada não lê a escrita');
ok(contract.storageReads === 0 && contract.networkCalls === 0 && contract.modelCalls === 0, 'sem dados externos');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso contínuo');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
const world = createDiarioWorldV619({ documentTarget:doc, windowTarget:win });

ok(doc.documentElement.dataset.work13JournalWorld === 'v619', 'identidade global instalada');
ok(doc.screen.dataset.journalWorld === 'v619', 'realidade marcada');
ok(doc.screen.dataset.journalUniverse === 'camara-da-tinta-viva', 'universo anexado');
ok(doc.screen.dataset.journalWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.journalWorldPhase === 'threshold', 'chegada preserva o limiar');
ok(doc.app.dataset.journalWorld === 'v619' && doc.app.dataset.journalWorldPrivacy === 'body-unread', 'app recebe somente estado público');
ok(doc.screen.dataset.journalWorldSequence === 'arrival-orb-page-write-autosave-ink-details-memories-mirror-return-silence', 'ordem pública marcada');
ok(doc.title.textContent === 'A página espera sem observar.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('diario-world-v619.css'), 'estilo único instalado');

fire(doc,'divina:journal-soul-state',{ phase:'opening', reason:'orb-touch' });
ok(world.phase === 'opening' && world.soulResponses === 1, 'Orbe recebe resposta imediata');
fire(doc,'divina:journal-soul-state',{ phase:'writing', reason:'write-open' });
ok(world.phase === 'writing', 'página abre diretamente para escrever');
fire(doc,'divina:journal-soul-state',{ phase:'details', reason:'explicit-details' });
ok(world.phase === 'details', 'detalhes surgem somente quando pedidos');
fire(doc,'divina:journal-soul-state',{ phase:'saving', reason:'autosave' });
ok(world.phase === 'saving', 'autosave assenta a tinta');
fire(doc,'divina:journal-soul-state',{
  phase:'saved', reason:'saved',
  title:'CANARY_TITLE_PRIVATE', body:'CANARY_BODY_PRIVATE', tags:['CANARY_TAG_PRIVATE']
});
ok(world.phase === 'saved' && world.savedSignals === 1, 'salvamento público conclui em silêncio');
ok(!JSON.stringify(world.status()).includes('CANARY'), 'nenhuma palavra privada é retida');
fire(doc,'divina:journal-soul-state',{ phase:'memories', reason:'explicit-calendar' });
ok(world.phase === 'memories', 'memórias aparecem sob pedido');
fire(doc,'divina:journal-soul-state',{ phase:'mirror', reason:'explicit-mirror' });
ok(world.phase === 'mirror', 'Espelho aparece sob pedido');

const audit = world.audit();
ok(audit.journalScreenPresent && audit.journalAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.timelinePageSizePreserved === 12 && audit.timelineFullImageRequestsPreserved === 0, 'timeline auditada');
ok(audit.mirrorAggregateOnly && !audit.adminBodyAccess && !audit.analyticsBodyAccess && !audit.whitSilentRead, 'privacidade auditada');
ok(audit.privateContentReads === 0 && audit.journalBodyReads === 0 && audit.formValueReads === 0, 'auditoria sem invasão');

fire(doc,'divina:route-start',{ id:'library' });
ok(world.phase === 'travel', 'travessia recebe resposta');
fire(doc,'divina:route-ready',{ id:'library' });
ok(world.route === 'library' && world.phase === 'rest', 'mundo repousa fora do Diário');
ok(doc.screen.dataset.journalWorldPresence === 'away', 'presença não vaza');
const responses = world.soulResponses;
fire(doc,'divina:journal-soul-state',{ phase:'writing', body:'CANARY_AWAY' });
ok(world.soulResponses === responses + 1 && world.phase === 'rest', 'evento externo não reabre o Diário');

doc.app.dataset.journalSoulPhase = 'writing';
fire(doc,'divina:route-ready',{ id:'journal' });
ok(world.route === 'journal' && world.phase === 'writing', 'retorno recupera somente a camada pública');
ok(world.status().automaticNavigation === false && world.status().automaticWhitSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita paralela');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaDiarioWorldV619').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13JournalWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.journalWorld && !doc.app.dataset.journalWorld, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — runtime da Câmara da Tinta Viva V619`);
