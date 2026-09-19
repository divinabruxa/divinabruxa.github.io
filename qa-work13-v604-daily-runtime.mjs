/* DIVINA BRUXA — WORK13 V604 · QA DE RUNTIME DA LEITURA DIARIA */
import {
  COSMIC_DAILY_READING_CONTRACT_V604,
  CosmicDailyReadingV604,
  essenceSentenceV604
} from './cosmic-daily-reading-v604.js';
import './tarot-meanings.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeClassList {
  constructor(...values) { this.values = new Set(values); }
  contains(value) { return this.values.has(value); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
}

class FakeNode {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.dataset = {};
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.classList = new FakeClassList();
    this.className = '';
    this.id = '';
    this.hidden = false;
    this.textContent = '';
    this.isConnected = false;
  }
  append(node) {
    node.parentNode = this;
    node.isConnected = true;
    this.children.push(node);
  }
  insertAdjacentElement(position, node) {
    if (position !== 'afterend' || !this.parentNode) return null;
    const index = this.parentNode.children.indexOf(this);
    node.parentNode = this.parentNode;
    node.isConnected = true;
    this.parentNode.children.splice(index + 1, 0, node);
    return node;
  }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(node => node !== this);
    this.parentNode = null;
    this.isConnected = false;
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  querySelector(selector) {
    if (selector === '[data-daily-identity]') return this.children.find(node => 'dailyIdentity' in node.dataset) || null;
    if (selector === '[data-reading-depth-call="daily"]') return this.children.find(node => node.dataset.readingDepthCall === 'daily') || null;
    if (selector === '[data-cosmic-daily-essence="v604"]') return this.children.find(node => node.dataset.cosmicDailyEssence === 'v604') || null;
    return null;
  }
}

class FakeDocument extends EventTarget {
  constructor(world) {
    super();
    this.world = world;
    this.documentElement = new FakeNode('html');
    this.documentElement.isConnected = true;
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.body = { dataset:{ screen:'daily' } };
  }
  createElement(tag) { return new FakeNode(tag); }
  querySelector(selector) {
    if (selector === '#dailyCard .dw509') return this.world;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    if (selector === '[data-cosmic-daily-essence="v604"]') {
      const node = this.world?.querySelector(selector);
      return node ? [node] : [];
    }
    return [];
  }
}

class FakeWindow extends EventTarget {}

const emit = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});

check('contract:version', COSMIC_DAILY_READING_CONTRACT_V604.version === 604);
check('contract:base-v603', COSMIC_DAILY_READING_CONTRACT_V604.base.startsWith('V603-reality-resonance'));
check('contract:route-daily', COSMIC_DAILY_READING_CONTRACT_V604.route === 'daily');
check('contract:exact-sequence', COSMIC_DAILY_READING_CONTRACT_V604.sequence.join('|') === 'card|silence|one-sentence-essence|depth-on-explicit-request');
check('contract:one-sentence', COSMIC_DAILY_READING_CONTRACT_V604.maximumEssenceSentences === 1);
check('contract:depth-explicit', COSMIC_DAILY_READING_CONTRACT_V604.depthRequiresExplicitGesture === true);
check('contract:reuses-control', COSMIC_DAILY_READING_CONTRACT_V604.depthControlReused === true);
check('contract:no-card-change', COSMIC_DAILY_READING_CONTRACT_V604.changesCardSelection === false);
check('contract:no-cycle-change', COSMIC_DAILY_READING_CONTRACT_V604.changesBrasiliaCycle === false);
check('contract:no-whit', COSMIC_DAILY_READING_CONTRACT_V604.automaticWhitSpeech === false);
check('contract:no-private', COSMIC_DAILY_READING_CONTRACT_V604.privateContentReads === 0);
check('contract:no-intention', COSMIC_DAILY_READING_CONTRACT_V604.intentionReads === 0);
check('contract:no-network-model', COSMIC_DAILY_READING_CONTRACT_V604.networkCalls === 0 && COSMIC_DAILY_READING_CONTRACT_V604.modelCalls === 0);
check('contract:no-clock', COSMIC_DAILY_READING_CONTRACT_V604.permanentAnimationLoops === 0 && COSMIC_DAILY_READING_CONTRACT_V604.deferredTimers === 0);

const editorialCards = Object.values(globalThis.DivinaBruxaTarotMeanings?.cards || {});
check('editorial:seventy-eight-cards', editorialCards.length === 78, editorialCards.length);
for (const [index, card] of editorialCards.entries()) {
  const sentence = essenceSentenceV604(card.essence);
  check(`editorial:${index}:exists`, Boolean(sentence));
  check(`editorial:${index}:one-sentence`, (sentence.match(/[.!?](?=\s|$)/gu) || []).length <= 1, sentence);
  check(`editorial:${index}:bounded`, sentence.length <= 240, sentence.length);
  check(`editorial:${index}:approved-prefix`, String(card.essence).startsWith(sentence), sentence);
}
check('helper:removes-later-text', essenceSentenceV604('Primeira frase. SEGREDO NA SEGUNDA.') === 'Primeira frase.');
check('helper:cleans-space', essenceSentenceV604('  Uma   frase viva.  Outra. ') === 'Uma frase viva.');
check('helper:empty-safe', essenceSentenceV604(null) === '');

const world = new FakeNode('section');
world.dataset.state = 'revealed';
world.dataset.readingPhase = 'rest';
world.classList.add('is-revealed');
world.isConnected = true;
const identity = new FakeNode('div');
identity.dataset.dailyIdentity = '';
const depth = new FakeNode('button');
depth.dataset.readingDepthCall = 'daily';
depth.textContent = 'Mergulhar';
world.append(identity);
world.append(depth);

const doc = new FakeDocument(world);
const win = new FakeWindow();
const meaning = {
  essence:'A Lua fala de percepção, imaginação e travessias que pedem discernimento. SEGREDO-NAO-MOSTRAR.',
  privateIntention:'SEGREDO-DA-PESSOA'
};
const daily = { world, currentMeaning:meaning, data:{ intention:'SEGREDO-DA-PESSOA', id:18 } };
const readingEvents = [];
doc.addEventListener('divina:cosmic-daily-reading-updated', event => readingEvents.push(event.detail));
const reading = new CosmicDailyReadingV604({
  ritual:{ status:() => ({ phase:world.dataset.readingPhase }) },
  dailyProvider:() => daily,
  documentTarget:doc,
  windowTarget:win
});

const essence = world.querySelector('[data-cosmic-daily-essence="v604"]');
check('boot:identity-v604', doc.documentElement.dataset.cosmicDailyReading === 'v604');
check('boot:macro-four', doc.documentElement.dataset.work13Macro === '4-layered-daily-reading');
check('boot:privacy-editorial-only', doc.documentElement.dataset.cosmicDailyReadingPrivacy === 'approved-editorial-only');
check('boot:whit-silent', doc.documentElement.dataset.cosmicDailyReadingWhit === 'silent');
check('boot:one-node', doc.querySelectorAll('[data-cosmic-daily-essence="v604"]').length === 1);
check('boot:hidden', essence?.hidden === true);
check('boot:no-editorial-read', reading.status().editorialReads === 0);

world.dataset.readingPhase = 'symbol';
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'symbol', private:'NAO-LER' });
check('symbol:hidden', essence.hidden === true);
check('symbol:no-read', reading.status().editorialReads === 0);

world.dataset.readingPhase = 'silence';
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'silence', card:'NAO-LER' });
check('silence:hidden', essence.hidden === true);
check('silence:no-read', reading.status().editorialReads === 0);
check('silence:layer', world.dataset.cosmicReadingLayer === 'silence');

world.dataset.readingPhase = 'essence';
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'essence', intention:'NAO-LER' });
check('essence:visible', essence.hidden === false && essence.getAttribute('aria-hidden') === 'false');
check('essence:one-approved-sentence', essence.textContent === 'A Lua fala de percepção, imaginação e travessias que pedem discernimento.');
check('essence:no-second-sentence', !essence.textContent.includes('SEGREDO'));
check('essence:one-read', reading.status().editorialReads === 1);
check('essence:one-sentence-status', reading.snapshot().essenceSentences === 1);
check('essence:button-explicit', depth.textContent === 'Aprofundar');
check('essence:button-label', depth.getAttribute('aria-label') === 'Aprofundar a Carta do Dia');
check('essence:button-described', depth.getAttribute('aria-describedby') === 'db604DailyEssence');
check('essence:no-content-in-event', !JSON.stringify(readingEvents).includes('A Lua') && !JSON.stringify(readingEvents).includes('SEGREDO'));
reading.render('repeat');
check('essence:no-repeat-read', reading.status().editorialReads === 1);

world.dataset.readingPhase = 'depth';
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'depth' });
check('depth:still-visible', essence.hidden === false);
check('depth:counted-explicitly', reading.status().depthRequests === 1);
check('depth:button-recollect', depth.textContent === 'Recolher');
check('depth:no-extra-read', reading.status().editorialReads === 1);

world.dataset.readingPhase = 'travel';
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'travel' });
check('travel:hidden', essence.hidden === true);

world.dataset.state = 'sealed';
world.classList.remove('is-revealed');
world.dataset.readingPhase = 'rest';
reading.render('new-cycle');
check('sealed:cleared', essence.hidden === true && essence.textContent === '');
check('sealed:no-private-status', !JSON.stringify(reading.status()).includes('SEGREDO-DA-PESSOA'));

const audit = reading.audit();
check('audit:one-node', audit.dailyEssenceNodes === 1 && audit.maximumDailyEssenceNodes === 1);
check('audit:one-orb', audit.canonicalOrbs === 1);
check('audit:one-canvas', audit.canonicalCanvases === 1);
check('audit:no-private', audit.privateContentReads === 0 && audit.intentionReads === 0 && audit.questionReads === 0);
check('audit:no-identity', audit.cardIdentityReads === 0 && audit.cardSelectionReads === 0);
check('audit:no-io', audit.storageReads === 0 && audit.storageWrites === 0 && audit.networkCalls === 0 && audit.modelCalls === 0);
check('audit:no-matter-clock', audit.newCanvases === 0 && audit.newRenderers === 0 && audit.permanentAnimationLoops === 0 && audit.deferredTimers === 0 && audit.mutationObservers === 0);
check('audit:no-gesture', audit.clickListeners === 0 && audit.inputListeners === 0);

const eventsBeforeDestroy = readingEvents.length;
reading.destroy();
check('destroy:marked', reading.status().destroyed === true);
check('destroy:node-removed', doc.querySelectorAll('[data-cosmic-daily-essence="v604"]').length === 0);
check('destroy:identity-removed', !doc.documentElement.dataset.cosmicDailyReading);
emit(doc, 'divina:reading-ritual-phase', { kind:'daily', phase:'essence' });
check('destroy:listeners-aborted', readingEvents.length === eventsBeforeDestroy);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V604',
  work:'WORK13',
  macroStage:'4-of-10 / layered-daily-reading-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  editorialCards:editorialCards.length,
  sequence:COSMIC_DAILY_READING_CONTRACT_V604.sequence,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
