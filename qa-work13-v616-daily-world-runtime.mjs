import assert from 'node:assert/strict';
import {
  CARTA_DO_DIA_WORLD_CONTRACT_V616,
  createCartaDoDiaWorldV616
} from './carta-do-dia-world-v616.js';

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
    this.attrs = {};
    this.removed = false;
    this.textContent = '';
  }
  append(node) { this.children.push(node); }
  contains(node) { return node === this || this.children.some(child => child.contains?.(node)); }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  remove() { this.removed = true; }
  querySelector(selector) {
    if (selector === '[data-daily-orb-host]') return this.children.find(node => 'dailyOrbHost' in node.dataset) || null;
    if (selector === '.dw509__head span') return this.eyebrow || null;
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
    this.world = new FakeNode({ classes:['dw509'], dataset:{ state:'sealed', readingPhase:'rest', dailyRule:'one-per-brasilia-day', orientation:'normal' } });
    this.world.eyebrow = new FakeNode();
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
const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = CARTA_DO_DIA_WORLD_CONTRACT_V616;
ok(contract.version === 616 && contract.work === 'WORK13', 'V616 dentro do WORK13');
ok(contract.universe === 'santuario-da-aurora', 'universo próprio');
ok(contract.sequence.join('|') === 'arrival|orb|touch|card|silence|one-sentence-essence|depth-on-explicit-request', 'sequência ritual');
ok(contract.cardsPerBrasiliaDay === 1 && contract.timeZone === 'America/Sao_Paulo', 'ciclo diário');
ok(contract.normalCardsOnly && contract.maximumEssenceSentences === 1, 'carta direta e uma frase');
ok(contract.depthRequiresExplicitGesture && contract.canonicalOrbAction === 'reveal-daily-card', 'gesto correto');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0, 'sem peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const world = createCartaDoDiaWorldV616({ documentTarget:doc, windowTarget:win, orbCore:{ pulse(){ pulses += 1; } } });
ok(doc.documentElement.dataset.work13DailyWorld === 'v616', 'identidade instalada');
ok(doc.screen.dataset.dailyWorld === 'v616' && doc.screen.dataset.dailyWorldPresence === 'present', 'realidade presente');
ok(doc.world.dataset.dailyUniverse === 'santuario-da-aurora', 'santuário anexado');
ok(doc.world.dataset.dailyWorldSequence === 'arrival-orb-touch-card-silence-essence-depth', 'ordem pública');
ok(doc.world.eyebrow.textContent === 'SANTUÁRIO DA AURORA', 'identidade curta aplicada');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('carta-do-dia-world-v616.css'), 'estilo instalado');
ok(world.phase === 'origin', 'chegada na origem');

fire(doc.orb,'pointerdown');
ok(world.phase === 'answering' && pulses === 1, 'toque responde imediatamente');
fire(doc.orb,'pointerup');
ok(world.phase === 'origin', 'resposta repousa');
doc.world.classList.add('is-opening');
fire(doc.orb,'pointerdown');
fire(doc.orb,'pointerup');
ok(world.phase === 'symbol', 'carta vem primeiro');
doc.world.classList.remove('is-opening');
doc.world.dataset.state = 'revealed';
doc.world.dataset.readingPhase = 'symbol';
fire(win,'divina:daily-v561-revealed');
ok(world.phase === 'symbol', 'revelação observada');
for (const phase of ['silence','essence','depth']) {
  doc.world.dataset.readingPhase = phase;
  fire(doc,'divina:reading-ritual-phase',{ kind:'daily', phase });
  ok(world.phase === phase && doc.world.dataset.dailyWorldPhase === phase, `fase ${phase}`);
}
fire(doc,'divina:route-ready',{ id:'library' });
ok(world.route === 'library' && world.phase === 'rest', 'mundo repousa fora da rota');
const before = world.responses;
fire(doc.orb,'pointerdown');
ok(world.responses === before, 'toque não vaza');
fire(doc,'divina:route-ready',{ id:'daily' });
ok(world.route === 'daily' && world.phase === 'depth', 'retorno preserva camada');
const audit = world.audit();
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita');
world.destroy();
ok(doc.getElementById('divinaCartaDoDiaWorldV616').removed === true, 'estilo desmontado');
ok(!doc.documentElement.dataset.work13DailyWorld && !doc.world.dataset.dailyWorld, 'identidade liberada');

console.log(`PASS ${checks}/${checks} — runtime do Santuário da Aurora V616`);
