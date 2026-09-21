import assert from 'node:assert/strict';
import {
  CARTA_DO_DIA_SOUL_CONTRACT_V610,
  createCartaDoDiaSoulV610
} from './carta-do-dia-soul-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

class FakeClassList {
  constructor(...values) { this.values = new Set(values); }
  contains(value) { return this.values.has(value); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
}

class FakeNode extends EventTarget {
  constructor({ id = '', classes = [], dataset = {} } = {}) {
    super();
    this.id = id;
    this.dataset = { ...dataset };
    this.classList = new FakeClassList(...classes);
    this.children = [];
    this.parentNode = null;
    this.attrs = {};
    this.removed = false;
  }
  append(node) { node.parentNode = this; this.children.push(node); }
  contains(node) { return node === this || this.children.some(child => child.contains?.(node)); }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  remove() { this.removed = true; }
  querySelector(selector) {
    if (selector === '[data-daily-orb-host]') {
      return this.children.find(node => 'dailyOrbHost' in node.dataset) || null;
    }
    return null;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html' });
    this.body = { dataset:{ screen:'daily' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({ id:'daily', classes:['screen','active'] }));
    this.orb = this.add(new FakeNode({ id:'orb' }));
    this.add(new FakeNode({ id:'orbCanvas' }));
    this.world = new FakeNode({
      classes:['dw509'],
      dataset:{ state:'sealed', readingPhase:'rest', dailyRule:'one-per-brasilia-day', orientation:'normal' }
    });
    this.orbHost = new FakeNode({ dataset:{ dailyOrbHost:'' } });
    this.orbHost.append(this.orb);
    this.world.append(this.orbHost);
  }
  add(node) { this.nodes.set(node.id,node); return node; }
  createElement() { return new FakeNode(); }
  getElementById(id) { return this.nodes.get(id) || this.head.children.find(node => node.id === id) || null; }
  querySelector(selector) {
    if (selector === '#dailyCard .dw509') return this.world;
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.screen;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return [this.orb];
    if (selector === '#orbCanvas') return [this.getElementById('orbCanvas')];
    return [];
  }
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#daily' }; }
}

const fire = (target, type, detail = {}) => {
  const event = new FakeCustomEvent(type, { detail });
  target.dispatchEvent(event);
};

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = CARTA_DO_DIA_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.reality === 'daily' && contract.stage === 'segunda-realidade-alma-propria', 'segunda realidade declarada');
ok(contract.sequence.join('|') === 'orb|card|silence|one-sentence-essence|depth-on-explicit-request', 'sequência ritual');
ok(contract.existingDailyAuthority === 'V554-preserved', 'motor diário preservado');
ok(contract.existingRitualAuthority === 'V595-preserved', 'rito preservado');
ok(contract.existingCosmicReadingAuthority === 'V604-preserved', 'leitura cósmica preservada');
ok(contract.cardsPerBrasiliaDay === 1 && contract.timeZone === 'America/Sao_Paulo', 'ciclo de Brasília preservado');
ok(contract.accountContinuityPreserved && contract.crossDeviceContinuityPreserved, 'continuidade por conta preservada');
ok(contract.manualReveal && !contract.automaticReveal, 'revelação continua manual');
ok(contract.reversedCards === false, 'sem invertidas');
ok(contract.maximumEssenceSentences === 1 && contract.depthRequiresExplicitGesture, 'uma frase e profundidade pedida');
ok(contract.cardSelectionChanges === 0 && contract.datePolicyChanges === 0 && contract.accountPolicyChanges === 0, 'autoridades intocadas');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createCartaDoDiaSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13DailySoul === 'v610', 'identidade instalada');
ok(doc.screen.dataset.dailySoul === 'v610', 'Carta do Dia marcada como mundo próprio');
ok(doc.screen.dataset.dailySoulPresence === 'present', 'presença na rota diária');
ok(doc.screen.dataset.dailySoulPhase === 'origin', 'ritual nasce na origem');
ok(doc.world.dataset.dailySoul === 'v610', 'mundo diário anexado');
ok(doc.world.dataset.dailySoulSequence === 'orb-card-silence-essence-depth', 'ordem pública marcada');
ok(doc.head.children.length === 1, 'uma folha de estilo instalada');
ok(doc.head.children[0].href.includes('carta-do-dia-soul-v610.css'), 'estilo correto');

const audit = soul.audit();
ok(audit.dailyScreenPresent && audit.dailyWorldAttached && audit.dailyOrbHostPresent, 'altar diário presente');
ok(audit.dailyRule === 'one-per-brasilia-day', 'regra diária refletida');
ok(audit.orientation === 'normal' && audit.reversedCards === false, 'somente carta direta');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.cardSelectionChanges === 0 && audit.privateContentReads === 0, 'sem tocar em escolha ou conteúdo');

fire(doc.orb,'pointerdown');
ok(soul.phase === 'answering', 'toque responde imediatamente');
ok(pulses === 1, 'resposta pulsa a Orbe existente');
fire(doc.orb,'pointerup');
ok(soul.phase === 'origin', 'resposta deixa a origem em silêncio');

doc.world.classList.add('is-opening');
fire(doc.orb,'pointerdown');
fire(doc.orb,'pointerup');
ok(soul.phase === 'symbol', 'abertura entrega a carta primeiro');
doc.world.classList.remove('is-opening');

doc.world.dataset.state = 'revealed';
doc.world.dataset.readingPhase = 'symbol';
doc.world.classList.add('is-revealed');
fire(win,'divina:daily-v561-revealed');
ok(soul.phase === 'symbol' && soul.revealsObserved === 1, 'revelação observada sem interferência');

for (const phase of ['silence','essence','depth']) {
  doc.world.dataset.readingPhase = phase;
  fire(doc,'divina:reading-ritual-phase',{ kind:'daily', phase });
  ok(soul.phase === phase, `fase ${phase} acompanhada`);
  ok(doc.world.dataset.dailySoulPhase === phase, `mundo recebe ${phase}`);
}
ok(soul.ritualPhasesObserved === 3, 'fases públicas contadas');

doc.world.dataset.readingPhase = 'essence';
fire(doc,'divina:cosmic-daily-reading-updated',{ phase:'essence', essenceSentences:1 });
ok(soul.phase === 'essence', 'essência cósmica sincronizada');
fire(doc,'divina:reading-ritual-phase',{ kind:'tarot', phase:'silence' });
ok(soul.phase === 'essence', 'rito de outra realidade não vaza');

fire(doc,'divina:route-ready',{ id:'tarot' });
ok(soul.route === 'tarot' && soul.phase === 'rest', 'alma repousa fora da Carta do Dia');
ok(doc.screen.dataset.dailySoulPresence === 'away', 'presença não vaza');
const responsesBefore = soul.responses;
fire(doc.orb,'pointerdown');
ok(soul.responses === responsesBefore, 'Orbe fora do altar não dispara a alma diária');

fire(doc,'divina:route-ready',{ id:'daily' });
ok(soul.route === 'daily' && soul.phase === 'essence', 'retorno preserva a camada pública');
ok(doc.screen.dataset.dailySoulPresence === 'present', 'retorno recupera presença');
ok(soul.status().automaticNavigation === false && soul.status().automaticWhitSpeech === false, 'sem ação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita');
ok(soul.status().work14 === false, 'termina dentro do WORK13');

soul.destroy();
ok(doc.getElementById('divinaCartaDoDiaSoulV610').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13DailySoul, 'desmontagem remove a identidade');
ok(!doc.world.dataset.dailySoul, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — alma funcional da Carta do Dia V610`);
