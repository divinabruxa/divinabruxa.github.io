/* DIVINA BRUXA — WORK13 V605 · QA DOM DAS CAMADAS DE TIRAGENS */
import './tarot-meanings.js';
import { CosmicSpreadReadingV605 } from './cosmic-spread-reading-v605.js';

const dataKey = name => name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

class FakeClassList {
  constructor(owner) { this.owner = owner; this.values = new Set(); }
  reset(value) { this.values = new Set(String(value || '').split(/\s+/).filter(Boolean)); }
  add(...values) { values.forEach(value => this.values.add(value)); this.owner._className = [...this.values].join(' '); }
  remove(...values) { values.forEach(value => this.values.delete(value)); this.owner._className = [...this.values].join(' '); }
  contains(value) { return this.values.has(value); }
}

class FakeElement {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.dataset = {};
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.hidden = false;
    this.id = '';
    this.type = '';
    this.textContent = '';
    this._className = '';
    this.classList = new FakeClassList(this);
  }
  set className(value) { this._className = String(value || ''); this.classList.reset(this._className); }
  get className() { return this._className; }
  append(...nodes) {
    nodes.filter(Boolean).forEach(node => {
      if (node.parentNode) node.parentNode.children = node.parentNode.children.filter(child => child !== node);
      node.parentNode = this;
      this.children.push(node);
    });
  }
  replaceChildren(...nodes) {
    this.children.forEach(node => { node.parentNode = null; });
    this.children = [];
    this.textContent = '';
    this.append(...nodes);
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'id') this.id = String(value);
    if (name === 'class') this.className = String(value);
    if (name.startsWith('data-')) this.dataset[dataKey(name)] = String(value);
  }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  matches(selector) {
    let source = String(selector || '').trim();
    if (!source) return false;
    if (source.includes(',')) return source.split(',').some(part => this.matches(part));
    const requiresVisible = source.includes(':not([hidden])');
    source = source.replace(':not([hidden])', '');
    if (requiresVisible && this.hidden) return false;
    const id = source.match(/#([a-zA-Z0-9_-]+)/)?.[1];
    if (id && this.id !== id) return false;
    for (const className of [...source.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map(match => match[1])) {
      if (!this.classList.contains(className)) return false;
    }
    for (const match of source.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)) {
      const [,name,expected] = match;
      let actual = null;
      if (name === 'hidden') actual = this.hidden ? '' : null;
      else if (name.startsWith('data-')) actual = this.dataset[dataKey(name)] ?? null;
      else actual = this.getAttribute(name);
      if (actual == null) return false;
      if (expected != null && String(actual) !== expected) return false;
    }
    const tag = source.match(/^[a-zA-Z][a-zA-Z0-9-]*/)?.[0];
    return !tag || this.tagName === tag.toUpperCase();
  }
  querySelectorAll(selector) {
    const found = [];
    const visit = node => {
      node.children.forEach(child => {
        if (child.matches(selector)) found.push(child);
        visit(child);
      });
    };
    visit(this);
    return found;
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

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = new FakeElement('html');
    this.body = new FakeElement('body');
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.visibilityState = 'visible';
  }
  createElement(tag) { return new FakeElement(tag); }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return this.body.querySelectorAll(selector);
  }
}

class FakeWindow extends EventTarget {
  constructor(reduced = false) { super(); this.reduced = reduced; }
  matchMedia(query) { return { matches:this.reduced && query.includes('reduced-motion') }; }
}

const make = (tag, className = '', text = '') => {
  const node = new FakeElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
};

function readingTree() {
  const result = make('div', 'result');
  const reading = make('article', 'spread-reading complete');
  const active = make('article', 'spread-active-meaning');
  const image = make('div', 'spread-meaning-card');
  const copy = make('div', 'spread-meaning-copy');
  copy.append(
    make('p', 'eyebrow', 'POSIÇÃO 3/3 · Tendência'),
    make('h3', '', 'A Estrela'),
    make('p', 'keywords', 'esperança · inspiração'),
    make('div', 'spread-meaning-sections', 'CONTEÚDO ANTIGO LONGO'),
    make('blockquote', '', 'PERGUNTA ANTIGA'),
    make('a', 'spread-library-link', 'Abrir Biblioteca')
  );
  active.append(image, copy);
  const synthesis = make('article', 'spread-synthesis spread-synthesis-v331');
  synthesis.append(make('p', '', 'SÍNTESE ANTIGA LONGA'));
  reading.append(active, synthesis);
  result.append(reading);
  return { result, reading };
}

class FakeEngine {
  constructor(tree) {
    this.result = tree.result;
    this.session = {
      spreadId:'past-present-tendency',
      cardIds:[0,18,17],
      positions:[{ label:'Passado · raiz' },{ label:'Presente' },{ label:'Tendência · conselho' }],
      revealed:3,
      activeIndex:2
    };
  }
  isComplete() { return this.session.revealed === this.session.cardIds.length; }
  renderReading() { return true; }
  revealNext() { return true; }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const doc = new FakeDocument();
const win = new FakeWindow(false);
let tree = readingTree();
doc.body.append(tree.result);
const engine = new FakeEngine(tree);
let timerId = 0;
const timers = new Map();
const runtime = new CosmicSpreadReadingV605({
  documentTarget:doc,
  windowTarget:win,
  engineProvider:() => engine,
  setTimer:(handler, delay) => { const id = ++timerId; timers.set(id, { handler, delay }); return id; },
  clearTimer:id => timers.delete(id)
});

let reading = engine.result.querySelector('.spread-reading');
let card = reading.querySelector('[data-cosmic-card-reading="v605"]');
let synthesis = reading.querySelector('[data-cosmic-spread-synthesis="v605"]');
check('mount:reading-marked', reading.dataset.cosmicSpreadReading === 'v605');
check('mount:card-marked', Boolean(card));
check('mount:card-essence-one', card.querySelectorAll('[data-db605-card-essence]').length === 1);
check('mount:card-title-preserved', card.querySelector('h3')?.textContent === 'A Estrela');
check('mount:old-wall-removed', !card.textContent.includes('CONTEÚDO ANTIGO LONGO'));
check('mount:card-depth-collapsed', card.querySelector('[data-db605-card-depth]')?.hidden === true);
check('mount:card-call-visible', card.querySelector('[data-db605-card-depth-call]')?.hidden === false);
check('mount:synthesis-marked', Boolean(synthesis));
check('mount:conversation-visible', Boolean(synthesis.querySelector('.db605-conversation')?.textContent));
check('mount:one-phrase', Boolean(synthesis.querySelector('.db605-synthesis-phrase')?.textContent));
check('mount:three-voices', synthesis.querySelector('.db605-conversation').textContent.includes('O Louco') && synthesis.querySelector('.db605-conversation').textContent.includes('A Lua') && synthesis.querySelector('.db605-conversation').textContent.includes('A Estrela'));
check('mount:old-synthesis-removed', !synthesis.textContent.includes('SÍNTESE ANTIGA LONGA'));
check('mount:synthesis-depth-collapsed', synthesis.querySelector('[data-db605-synthesis-depth]')?.hidden === true);
check('mount:no-timer-on-resume', timers.size === 0);

const cardCall = card.querySelector('[data-db605-card-depth-call]');
runtime.onClick({ target:cardCall, preventDefault(){} });
check('card-depth:opens', cardCall.getAttribute('aria-expanded') === 'true' && card.querySelector('[data-db605-card-depth]').hidden === false);
check('card-depth:label-recollect', cardCall.textContent === 'Recolher');
runtime.onClick({ target:cardCall, preventDefault(){} });
check('card-depth:recollects', cardCall.getAttribute('aria-expanded') === 'false' && card.querySelector('[data-db605-card-depth]').hidden === true);

const synthesisCall = synthesis.querySelector('[data-db605-synthesis-depth-call]');
runtime.onClick({ target:synthesisCall, preventDefault(){} });
check('synthesis-depth:opens', synthesisCall.getAttribute('aria-expanded') === 'true' && synthesis.querySelector('[data-db605-synthesis-depth]').hidden === false);
check('synthesis-depth:three-sections', synthesis.querySelectorAll('.db605-depth-section').length === 3);
check('synthesis-depth:responsible', Boolean(synthesis.querySelector('.db605-synthesis-notice')));

tree = readingTree();
engine.result = tree.result;
doc.body.replaceChildren(tree.result);
runtime.stateFor(engine).pendingReveal = 2;
runtime.afterRender(engine, { reason:'fresh-reveal' });
runtime.stateFor(engine).pendingReveal = null;
reading = engine.result.querySelector('.spread-reading');
card = reading.querySelector('[data-cosmic-card-reading="v605"]');
synthesis = reading.querySelector('[data-cosmic-spread-synthesis="v605"]');
check('silence:phase', reading.dataset.cosmicSpreadPhase === 'silence');
check('silence:essence-hidden', card.querySelector('[data-db605-card-essence]').hidden === true);
check('silence:card-call-hidden', card.querySelector('[data-db605-card-depth-call]').hidden === true);
check('silence:synthesis-hidden', synthesis.hidden === true);
check('silence:one-timer', timers.size === 1, timers.size);
check('silence:standard-delay', [...timers.values()][0]?.delay === 520, [...timers.values()][0]?.delay);
for (const [id, timer] of [...timers]) { timers.delete(id); timer.handler(); }
check('essence:phase', reading.dataset.cosmicSpreadPhase === 'essence');
check('essence:visible', card.querySelector('[data-db605-card-essence]').hidden === false);
check('essence:call-visible', card.querySelector('[data-db605-card-depth-call]').hidden === false);
check('essence:synthesis-visible', synthesis.hidden === false);
check('essence:timer-cleared', timers.size === 0);

win.reduced = true;
tree = readingTree();
engine.result = tree.result;
doc.body.replaceChildren(tree.result);
runtime.stateFor(engine).pendingReveal = 2;
runtime.afterRender(engine, { reason:'reduced-reveal' });
runtime.stateFor(engine).pendingReveal = null;
check('reduced:order-kept', engine.result.querySelector('.spread-reading').dataset.cosmicSpreadPhase === 'silence');
check('reduced:short-delay', [...timers.values()][0]?.delay === 140, [...timers.values()][0]?.delay);

const audit = runtime.audit();
check('audit:one-orb-canvas', audit.canonicalOrbs === 1 && audit.canonicalCanvases === 1);
check('audit:no-private-unrevealed', audit.privateContentReads === 0 && audit.questionReads === 0 && audit.unrevealedCardReads === 0);
check('audit:no-network-model', audit.networkCalls === 0 && audit.modelCalls === 0);
check('audit:no-loop-observer', audit.permanentAnimationLoops === 0 && audit.mutationObservers === 0);
runtime.destroy();
check('destroy:timer-cleared', timers.size === 0);
check('destroy:identity-cleared', !doc.documentElement.dataset.cosmicSpreadReading);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V605',
  work:'WORK13',
  macroStage:'5-of-10 / cards-converse-dom-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
