import assert from 'node:assert/strict';
import {
  TIRAGENS_WORLD_CONTRACT_V617,
  createTiragensWorldV617
} from './tiragens-world-v617.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

class FakeClassList {
  constructor(...values) { this.values = new Set(values); }
  contains(value) { return this.values.has(value); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
}

const dataKey = name => name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

class FakeNode extends EventTarget {
  constructor({ id = '', tag = 'div', classes = [], dataset = {} } = {}) {
    super();
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.dataset = { ...dataset };
    this.classList = new FakeClassList(...classes);
    this.children = [];
    this.parentNode = null;
    this.attrs = {};
    this.removed = false;
    this.textContent = '';
    this.href = '';
    this.rel = '';
  }
  append(...nodes) {
    nodes.filter(Boolean).forEach(node => {
      if (node.parentNode) node.parentNode.children = node.parentNode.children.filter(child => child !== node);
      node.parentNode = this;
      this.children.push(node);
    });
  }
  contains(node) { return node === this || this.children.some(child => child.contains?.(node)); }
  setAttribute(name, value) {
    this.attrs[name] = String(value);
    if (name.startsWith('data-')) this.dataset[dataKey(name)] = String(value);
  }
  getAttribute(name) { return this.attrs[name] ?? null; }
  remove() { this.removed = true; }
  matches(selector) {
    const source = String(selector || '').trim();
    if (!source) return false;
    if (source.includes(',')) return source.split(',').some(part => this.matches(part));
    const descendant = source.split(/\s+|>/).filter(Boolean).at(-1);
    const id = descendant.match(/#([\w-]+)/)?.[1];
    if (id && this.id !== id) return false;
    const tag = descendant.match(/^[a-zA-Z][\w-]*/)?.[0];
    if (tag && this.tagName !== tag.toUpperCase()) return false;
    for (const className of [...descendant.matchAll(/\.([\w-]+)/g)].map(match => match[1])) {
      if (!this.classList.contains(className)) return false;
    }
    for (const match of descendant.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)) {
      const [,name,expected] = match;
      const actual = name.startsWith('data-') ? this.dataset[dataKey(name)] : this.getAttribute(name);
      if (actual == null || (expected != null && String(actual) !== expected)) return false;
    }
    return true;
  }
  querySelectorAll(selector) {
    const result = [];
    const visit = node => node.children.forEach(child => {
      if (child.matches(selector)) result.push(child);
      visit(child);
    });
    visit(this);
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) {
    let node = this;
    while (node) {
      if (node.matches(selector)) return node;
      node = node.parentNode;
    }
    return null;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html', tag:'html' });
    this.body = { dataset:{ screen:'spreads' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({ id:'spreads', classes:['screen','active'] }));
    this.title = new FakeNode({ tag:'h2' });
    this.grid = this.add(new FakeNode({ id:'spreadGrid' }));
    this.result = this.add(new FakeNode({ id:'spreadResult' }));
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
    this.screen.append(this.title, this.grid, this.result);
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
  constructor() { super(); this.location = { hash:'#spreads' }; }
}

const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = TIRAGENS_WORLD_CONTRACT_V617;

ok(contract.version === 617 && contract.work === 'WORK13', 'V617 permanece dentro do WORK13');
ok(contract.reality === 'spreads' && contract.universe === 'concilio-das-constelacoes', 'novo mundo declarado');
ok(contract.identity === 'deep-teal-copper-ivory', 'identidade própria declarada');
ok(contract.sequence.join('|') === 'arrival|choice|orb|card-and-position|silence|essence|cards-in-conversation|one-sentence-synthesis|depth-on-explicit-request', 'travessia completa');
ok(contract.spreadAuthority === 'V331-preserved' && contract.cosmicReadingAuthority === 'V605-preserved' && contract.soulAuthority === 'V610-preserved', 'motores protegidos');
ok(contract.methodsPreserved === 15 && contract.freeMethodsPreserved === 4 && contract.premiumMethodsPreserved === 11, 'quinze métodos preservados');
ok(contract.celticCrossPositionsPreserved === 10, 'Cruz Celta preservada');
ok(contract.royalTableCardsPreserved === 78 && contract.royalTableGeometryPreserved === '13x6', 'Mesa Real preservada');
ok(contract.normalOnly && contract.noRepeats, 'cartas diretas e sem repetição');
ok(contract.cardsSpeakBy.length === 10 && contract.cardsSpeakBy.includes('position') && contract.cardsSpeakBy.includes('contrast'), 'vocabulário relacional explícito');
ok(contract.maximumConversationVoices === 3 && contract.maximumSynthesisSentences === 1, 'conversa legível e síntese curta');
ok(contract.depthRequiresExplicitGesture && contract.canonicalOrbAction === 'reveal-next-position', 'gesto canônico preservado');
ok(contract.premiumAuthorityChanges === 0 && contract.persistenceChanges === 0 && contract.synthesisAuthorityChanges === 0, 'autoridades preservadas');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.privateContentReads === 0 && contract.questionReads === 0 && contract.cardIdentityReads === 0, 'conteúdo privado não lido');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'nenhum peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const world = createTiragensWorldV617({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse(){ pulses += 1; } }
});

ok(doc.documentElement.dataset.work13SpreadsWorld === 'v617', 'identidade global instalada');
ok(doc.screen.dataset.spreadsWorld === 'v617', 'realidade marcada');
ok(doc.screen.dataset.spreadsUniverse === 'concilio-das-constelacoes', 'universo anexado');
ok(doc.screen.dataset.spreadsWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.spreadsWorldPhase === 'origin', 'mundo nasce na origem');
ok(doc.screen.dataset.spreadsWorldSequence === 'arrival-choice-orb-card-position-silence-essence-conversation-synthesis-depth', 'ordem pública marcada');
ok(doc.title.textContent === 'As cartas encontram uma voz comum.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('tiragens-world-v617.css'), 'estilo único instalado');

const choice = new FakeNode({ tag:'button', classes:['spread-choice'], dataset:{ spreadId:'three-cards' } });
doc.grid.append(choice);
ok(world.onPointerDown({ target:choice }), 'escolha recebe resposta');
ok(world.phase === 'choosing' && world.choiceResponses === 1, 'campo reconhece a escolha');
ok(pulses === 1, 'Orbe canônica responde à escolha');

const reading = new FakeNode({ classes:['spread-reading'], dataset:{ cosmicSpreadPhase:'silence' } });
doc.result.append(reading);
reading.append(doc.orb);
fire(doc,'divina:spreads-supreme-ready');
ok(world.reading === reading && world.attachments === 1, 'leitura existente anexada');
ok(reading.dataset.spreadsWorld === 'v617' && reading.dataset.spreadsUniverse === 'concilio-das-constelacoes', 'leitura entra no novo mundo');
ok(world.phase === 'silence', 'silêncio V605 preservado');
ok(world.ownsRevealOrb(doc.canvas), 'Orbe da tiragem pertence ao rito');

ok(world.onPointerDown({ target:doc.canvas }), 'toque na Orbe responde imediatamente');
ok(world.phase === 'answering' && world.orbResponses === 1, 'posição entra em resposta');
ok(pulses === 2, 'mesma Orbe pulsa uma vez por gesto');
world.sync('release');
ok(world.phase === 'silence', 'resposta encontra silêncio');

reading.dataset.cosmicSpreadPhase = 'essence';
fire(doc,'divina:cosmic-spread-reading-updated',{ phase:'essence', complete:false, reason:'silence-complete' });
ok(world.phase === 'essence' && world.readingUpdates === 1, 'essência acompanha o motor público');

const synthesis = new FakeNode({ dataset:{ cosmicSpreadSynthesis:'v605' } });
reading.append(synthesis);
reading.classList.add('complete');
fire(doc,'divina:cosmic-spread-reading-updated',{ phase:'essence', complete:true, reason:'engine-render' });
ok(world.phase === 'conversation', 'cartas concluídas entram em conversa');

const depth = new FakeNode({ tag:'button', dataset:{ db605SynthesisDepthCall:'' } });
depth.setAttribute('aria-expanded','true');
reading.append(depth);
fire(doc,'divina:cosmic-spread-reading-updated',{ complete:true, reason:'explicit-depth' });
ok(world.phase === 'depth', 'profundidade nasce somente do gesto explícito');

const audit = world.audit();
ok(audit.spreadsScreenPresent && audit.spreadGridPresent && audit.spreadResultPresent && audit.readingAttached, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.methodsPreserved === 15 && audit.freeMethodsPreserved === 4 && audit.premiumMethodsPreserved === 11, 'métodos auditados');
ok(audit.celticCrossPositionsPreserved === 10 && audit.royalTableCardsPreserved === 78 && audit.royalTableGeometryPreserved === '13x6', 'tiragens extensas auditadas');
ok(audit.privateContentReads === 0 && audit.cardIdentityReads === 0, 'mundo não invade a leitura');

fire(doc,'divina:route-start',{ id:'library' });
ok(world.phase === 'travel', 'travessia recebe resposta');
fire(doc,'divina:route-ready',{ id:'library' });
ok(world.route === 'library' && world.phase === 'rest', 'mundo repousa fora de Tiragens');
ok(doc.screen.dataset.spreadsWorldPresence === 'away', 'presença não vaza');
const before = world.responses;
world.onPointerDown({ target:doc.canvas });
ok(world.responses === before, 'Orbe fora da rota não dispara Tiragens');

fire(doc,'divina:route-ready',{ id:'spreads' });
ok(world.route === 'spreads' && world.phase === 'depth', 'retorno recupera a camada pública');
ok(world.status().automaticNavigation === false && world.status().automaticWhitSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaTiragensWorldV617').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13SpreadsWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.spreadsWorld && !reading.dataset.spreadsWorld, 'desmontagem libera mundo e leitura');

console.log(`PASS ${checks}/${checks} — runtime do Concílio das Constelações V617`);
