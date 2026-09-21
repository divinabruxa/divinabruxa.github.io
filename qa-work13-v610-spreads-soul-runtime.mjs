import assert from 'node:assert/strict';
import {
  TIRAGENS_SOUL_CONTRACT_V610,
  createTiragensSoulV610
} from './tiragens-soul-v610.js';

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
    const descendant = source.split(/\s+/).at(-1);
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
    this.grid = this.add(new FakeNode({ id:'spreadGrid' }));
    this.result = this.add(new FakeNode({ id:'spreadResult' }));
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
    this.screen.append(this.grid, this.result);
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
const contract = TIRAGENS_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.reality === 'spreads' && contract.stage === 'terceira-realidade-alma-propria', 'terceira realidade declarada');
ok(contract.sequence.join('|') === 'choice|orb|revealed-card|silence|one-sentence-essence|cards-in-conversation|one-sentence-synthesis|depth-on-explicit-request', 'sequência viva completa');
ok(contract.existingSpreadAuthority === 'V331-preserved', 'motor V331 preservado');
ok(contract.existingCosmicReadingAuthority === 'V605-preserved', 'leitura V605 preservada');
ok(contract.methodsPreserved === 15 && contract.freeMethodsPreserved === 4 && contract.premiumMethodsPreserved === 11, 'quinze métodos preservados');
ok(contract.celticCrossPositionsPreserved === 10, 'Cruz Celta preservada');
ok(contract.royalTableCardsPreserved === 78 && contract.royalTableGeometryPreserved === '13x6', 'Mesa Real preservada');
ok(contract.normalOnly && contract.noRepeats, 'cartas diretas e únicas');
ok(contract.maximumConversationVoices === 3 && contract.maximumSynthesisSentences === 1, 'conversa e síntese compactas');
ok(contract.depthRequiresExplicitGesture, 'profundidade depende de gesto');
ok(contract.cardSelectionChanges === 0 && contract.shuffleChanges === 0, 'seleção e embaralhamento intocados');
ok(contract.premiumAuthorityChanges === 0 && contract.persistenceChanges === 0, 'Premium e persistência intocados');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.privateContentReads === 0 && contract.intentionReads === 0 && contract.questionReads === 0, 'privacidade preservada');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'nenhum peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createTiragensSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13SpreadsSoul === 'v610', 'identidade instalada');
ok(doc.screen.dataset.spreadsSoul === 'v610', 'Tiragens marcadas como mundo próprio');
ok(doc.screen.dataset.spreadsSoulPresence === 'present', 'presença ativa na rota');
ok(doc.screen.dataset.spreadsSoulPhase === 'origin', 'mundo nasce na escolha');
ok(doc.screen.dataset.spreadsSoulSequence === 'choice-orb-card-silence-essence-conversation-synthesis-depth', 'ordem pública marcada');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('tiragens-soul-v610.css'), 'estilo único instalado');

const choice = new FakeNode({ tag:'button', classes:['spread-choice'], dataset:{ spreadId:'three-cards' } });
doc.grid.append(choice);
ok(soul.onPointerDown({ target:choice }), 'escolha recebe resposta');
ok(soul.phase === 'choosing' && soul.choiceGestures === 1, 'escolha muda o campo');
ok(pulses === 1, 'escolha pulsa a Orbe existente com leveza');

const reading = new FakeNode({ classes:['spread-reading'], dataset:{ cosmicSpreadPhase:'silence' } });
doc.result.append(reading);
reading.append(doc.orb);
fire(doc,'divina:spreads-supreme-ready');
ok(soul.reading === reading && soul.attachments === 1, 'leitura existente anexada');
ok(reading.dataset.spreadsSoul === 'v610', 'leitura recebe a alma');
ok(soul.phase === 'silence', 'silêncio V605 preservado');
ok(soul.ownsRevealOrb(doc.canvas), 'Orbe dentro da tiragem pertence ao rito');

ok(soul.onPointerDown({ target:doc.canvas }), 'toque na Orbe responde');
ok(soul.phase === 'answering' && soul.revealGestures === 1, 'resposta é imediata');
ok(pulses === 2, 'mesma Orbe pulsa uma vez por gesto');
soul.sync('release');
ok(soul.phase === 'silence', 'resposta devolve silêncio');

reading.dataset.cosmicSpreadPhase = 'essence';
fire(doc,'divina:cosmic-spread-reading-updated',{ phase:'essence', complete:false, reason:'silence-complete' });
ok(soul.phase === 'essence', 'essência acompanha V605');
ok(soul.readingUpdates === 1, 'atualização pública observada');

const synthesis = new FakeNode({ dataset:{ cosmicSpreadSynthesis:'v605' } });
reading.append(synthesis);
reading.classList.add('complete');
fire(doc,'divina:cosmic-spread-reading-updated',{ phase:'essence', complete:true, reason:'engine-render' });
ok(soul.phase === 'conversation', 'conclusão vira conversa');

const depth = new FakeNode({ tag:'button', dataset:{ db605SynthesisDepthCall:'' } });
depth.setAttribute('aria-expanded','true');
reading.append(depth);
soul.sync('explicit-layer');
ok(soul.phase === 'depth', 'profundidade só nasce aberta pelo controle existente');

const audit = soul.audit();
ok(audit.spreadsScreenPresent && audit.spreadGridPresent && audit.spreadResultPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.methodsPreserved === 15 && audit.celticCrossPositionsPreserved === 10 && audit.royalTableCardsPreserved === 78, 'estruturas preservadas no audit');
ok(audit.privateContentReads === 0 && audit.cardIdentityReads === 0, 'alma não lê conteúdo');

fire(doc,'divina:route-ready',{ id:'school' });
ok(soul.route === 'school' && soul.phase === 'rest', 'alma repousa fora de Tiragens');
ok(doc.screen.dataset.spreadsSoulPresence === 'away', 'presença não vaza');
const responsesBefore = soul.responses;
soul.onPointerDown({ target:doc.canvas });
ok(soul.responses === responsesBefore, 'Orbe fora da rota não dispara a alma');

fire(doc,'divina:route-ready',{ id:'spreads' });
ok(soul.route === 'spreads' && soul.phase === 'depth', 'retorno recupera a camada pública');
ok(soul.status().automaticNavigation === false && soul.status().automaticWhitSpeech === false, 'sem ação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita');
ok(soul.status().work14 === false, 'termina no WORK13');

soul.destroy();
ok(doc.getElementById('divinaTiragensSoulV610').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13SpreadsSoul, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.spreadsSoul && !reading.dataset.spreadsSoul, 'desmontagem libera mundo e leitura');

console.log(`PASS ${checks}/${checks} — alma funcional das Tiragens V610`);
