import assert from 'node:assert/strict';
import {
  DIARIO_SOUL_CONTRACT_V610,
  createDiarioSoulV610
} from './diario-soul-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

const dataName = value => value.replace(/-([a-z])/g, (_,letter) => letter.toUpperCase());

class FakeNode extends EventTarget {
  constructor({ id = '', tag = 'div', dataset = {}, classes = [], attrs = {} } = {}) {
    super();
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.dataset = { ...dataset };
    this.attrs = { ...attrs };
    this.children = [];
    this.parentElement = null;
    this.removed = false;
    this.classSet = new Set(classes);
    this.classList = { contains:name => this.classSet.has(name) };
  }
  append(...nodes) { for (const node of nodes) { node.parentElement = this; this.children.push(node); } }
  remove() { this.removed = true; }
  matches(selector) {
    return String(selector).split(',').some(part => {
      const value = part.trim();
      if (!value || value.includes(' ')) return false;
      if (value.startsWith('#')) return this.id === value.slice(1);
      if (value.startsWith('.')) return this.classSet.has(value.slice(1));
      const data = value.match(/^\[data-([a-z0-9-]+)(?:="([^"]+)")?\]$/i);
      if (data) {
        const key = dataName(data[1]);
        return key in this.dataset && (data[2] === undefined || String(this.dataset[key]) === data[2]);
      }
      return value.toUpperCase() === this.tagName;
    });
  }
  closest(selector) {
    let node = this;
    while (node) {
      if (node.matches?.(selector)) return node;
      node = node.parentElement;
    }
    return null;
  }
  querySelector(selector) {
    const visit = node => {
      for (const child of node.children) {
        if (child.matches?.(selector)) return child;
        const nested = visit(child);
        if (nested) return nested;
      }
      return null;
    };
    return visit(this);
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ tag:'html', dataset:{} });
    this.head = new FakeNode({ tag:'head' });
    this.body = new FakeNode({ tag:'body', dataset:{ screen:'journal' } });
    this.screen = new FakeNode({
      id:'journal', tag:'section', classes:['screen','active'],
      dataset:{ db596ChamberState:'threshold', db596ChamberMode:'none' }
    });
    this.app = new FakeNode({ id:'journalApp', dataset:{ v607JournalMode:'write' } });
    this.thresholdHost = new FakeNode({ dataset:{ v585OrbHost:'' } });
    this.orb = new FakeNode({ id:'orb' });
    this.canvas = new FakeNode({ id:'orbCanvas', tag:'canvas' });
    this.form = new FakeNode({ id:'journalForm', tag:'form' });
    this.saveState = new FakeNode({ dataset:{ journalSaveState:'', state:'idle' } });
    this.documentElement.append(this.head,this.body);
    this.body.append(this.screen);
    this.screen.append(this.thresholdHost,this.app);
    this.thresholdHost.append(this.orb);
    this.orb.append(this.canvas);
    this.app.append(this.form,this.saveState);
  }
  createElement(tag) { return new FakeNode({ tag }); }
  getElementById(id) {
    if (id === 'journal') return this.screen;
    if (id === 'journalApp') return this.app;
    if (id === 'journalForm') return this.form;
    if (id === 'orb') return this.orb;
    if (id === 'orbCanvas') return this.canvas;
    return this.head.children.find(node => node.id === id) || null;
  }
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

const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = DIARIO_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.reality === 'journal' && contract.stage === 'sexta-realidade-alma-propria', 'sexta realidade declarada');
ok(contract.universe === 'camara-da-tinta-lunar', 'universo novo declarado');
ok(contract.sequence.join('|') === 'threshold|direct-writing|silent-autosave|optional-details|explicit-memories|aggregate-mirror|return|silence', 'ordem íntima completa');
ok(contract.existingJournalAuthority === 'V556-preserved', 'Diário V556 preservado');
ok(contract.existingJournalWorldAuthority === 'V317-preserved', 'mundo V317 preservado');
ok(contract.existingChamberAuthority === 'V596-preserved', 'câmara V596 preservada');
ok(contract.existingLivingWisdomAuthority === 'V607-preserved', 'escrita direta V607 preservada');
ok(contract.directWritingFirst && contract.silentAutosavePreserved, 'escrever vem primeiro');
ok(contract.memoriesRequireExplicitGesture && contract.mirrorRequiresExplicitGesture, 'revisão só quando chamada');
ok(contract.localFirst && contract.syncDefault === 'off-until-explicit-account-consent', 'local primeiro e sync consentido');
ok(contract.privateByDefault && contract.whitSilentRead === false, 'privado e sem leitura silenciosa');
ok(contract.timelinePageSizePreserved === 12 && contract.timelineFullImageRequestsPreserved === 0, 'timeline leve preservada');
ok(contract.mirrorAggregateOnly && !contract.mirrorDiagnosis && !contract.mirrorPrediction, 'Espelho sem diagnóstico ou previsão');
ok(contract.capabilitiesPreserved.length === 19, 'motor funcional inteiro preservado');
ok(contract.reusesCanonicalOrb && contract.reusesGlobalLivingMenu, 'uma Orbe e um menu');
ok(contract.privateContentReads === 0 && contract.journalBodyReads === 0 && contract.titleReads === 0, 'alma não lê a escrita');
ok(contract.tagReads === 0 && contract.questionReads === 0 && contract.draftReads === 0 && contract.historyReads === 0, 'nenhum campo privado lido');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'nenhum peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createDiarioSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13JournalSoul === 'v610', 'identidade instalada');
ok(doc.screen.dataset.journalSoul === 'v610', 'Diário marcado como mundo próprio');
ok(doc.screen.dataset.journalSoulUniverse === 'camara-da-tinta-lunar', 'Câmara da Tinta Lunar marcada');
ok(doc.screen.dataset.journalSoulPresence === 'present', 'presença ativa na rota');
ok(doc.screen.dataset.journalSoulPhase === 'threshold', 'mundo nasce no limiar');
ok(doc.screen.dataset.journalSoulSequence === 'threshold-write-autosave-details-memories-mirror-return-silence', 'ordem pública marcada');
ok(doc.app.dataset.journalSoul === 'v610' && doc.app.dataset.journalSoulPrivacy === 'body-unread', 'app existente recebe alma privada');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('diario-soul-v610.css'), 'estilo único instalado');

ok(soul.kindFor(doc.canvas) === 'threshold', 'Orbe no limiar reconhecida sem cópia');
ok(soul.respond('threshold','touch'), 'limiar responde imediatamente');
ok(soul.phase === 'opening' && soul.thresholdGestures === 1 && pulses === 1, 'resposta finita da Orbe');

doc.screen.dataset.db596ChamberState = 'engaged';
doc.screen.dataset.db596ChamberMode = 'write';
soul.sync('write-open');
ok(soul.phase === 'writing', 'mergulho chega diretamente à escrita');
ok(soul.kindFor(doc.form) === 'write', 'editor reconhecido sem ler valor');
ok(soul.respond('write','touch') && soul.writingGestures === 1 && pulses === 2, 'papel responde ao gesto');

const details = new FakeNode({ tag:'button', dataset:{ journalDetails:'' } });
doc.form.append(details);
ok(soul.kindFor(details) === 'details', 'detalhes opcionais reconhecidos');
ok(soul.respond('details','touch') && soul.phase === 'details' && soul.detailGestures === 1, 'detalhes respondem só ao pedido');

const save = new FakeNode({ tag:'button', dataset:{ journalSave:'' } });
doc.form.append(save);
ok(soul.kindFor(save) === 'save', 'salvar reconhecido');
ok(soul.respond('save','touch') && soul.phase === 'saving' && soul.saveGestures === 1, 'salvamento responde antes de concluir');
doc.saveState.dataset.state = 'saved';
fire(doc,'divina:journal-world-updated',{
  title:'CANARY_TITLE_PRIVATE', body:'CANARY_BODY_PRIVATE', tags:['CANARY_TAG_PRIVATE']
});
ok(soul.saved && soul.phase === 'saved', 'estado público confirma autosave');
ok(soul.publicSaveSignals === 1 && pulses === 5, 'silêncio salvo recebe um pulso finito');
ok(!JSON.stringify(soul.status()).includes('CANARY'), 'nenhuma palavra privada é retida');

const review = new FakeNode({ tag:'button', dataset:{ v607Action:'journal-review' } });
doc.app.append(review);
ok(soul.kindFor(review) === 'mirror', 'Espelho reconhecido');
ok(soul.respond('mirror','touch') && soul.phase === 'mirror' && soul.mirrorGestures === 1, 'Espelho só abre no gesto');
doc.app.dataset.v607JournalMode = 'review';
doc.screen.dataset.db596ChamberMode = 'mirror';
soul.sync('mirror-open');
ok(soul.phase === 'mirror', 'estado público mantém reflexão');

const calendar = new FakeNode({ tag:'button', dataset:{ journalView:'calendar' } });
doc.app.append(calendar);
ok(soul.kindFor(calendar) === 'memories', 'calendário reconhecido');
ok(soul.respond('memories','touch') && soul.phase === 'memories' && soul.memoryGestures === 1, 'memórias aparecem sob pedido');

fire(doc,'divina:menu-state',{ state:'open' });
ok(soul.phase === 'portal', 'Orbe global abre o portal sem ler o Diário');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(soul.phase === 'mirror', 'fechar o menu devolve o Espelho escolhido');

const audit = soul.audit();
ok(audit.journalScreenPresent && audit.journalAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.timelinePageSizePreserved === 12 && audit.timelineFullImageRequestsPreserved === 0, 'timeline preservada no audit');
ok(audit.privateContentReads === 0 && audit.journalBodyReads === 0 && audit.formValueReads === 0, 'audit confirma privacidade');

fire(doc,'divina:route-ready',{ id:'library' });
ok(soul.route === 'library' && soul.phase === 'rest', 'alma repousa fora do Diário');
ok(doc.screen.dataset.journalSoulPresence === 'away', 'presença não vaza');
const responsesBefore = soul.responses;
soul.respond('write','touch');
ok(soul.responses === responsesBefore, 'gesto fora da rota não dispara a alma');

doc.screen.dataset.db596ChamberState = 'threshold';
doc.screen.dataset.db596ChamberMode = 'none';
doc.app.dataset.v607JournalMode = 'write';
doc.saveState.dataset.state = 'idle';
soul.saved = false;
fire(doc,'divina:route-ready',{ id:'journal' });
ok(soul.route === 'journal' && soul.phase === 'threshold', 'retorno reabre o limiar sem texto guardado pela alma');
ok(soul.status().automaticNavigation === false && soul.status().automaticWhitSpeech === false, 'sem ação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita paralela');
ok(soul.status().work14 === false, 'termina no WORK13');

soul.destroy();
ok(doc.getElementById('divinaDiarioSoulV610').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13JournalSoul, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.journalSoul && !doc.app.dataset.journalSoul, 'desmontagem libera mundo e app');

console.log(`PASS ${checks}/${checks} — alma funcional do Diário e Espelho V610`);
