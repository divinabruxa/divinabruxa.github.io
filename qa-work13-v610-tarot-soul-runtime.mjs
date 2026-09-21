import assert from 'node:assert/strict';
import {
  TAROT_LIVRE_SOUL_CONTRACT_V610,
  createTarotLivreSoulV610
} from './tarot-livre-soul-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

class FakeClassList {
  constructor(...values) { this.values = new Set(values); }
  contains(value) { return this.values.has(value); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
}

class FakeNode extends EventTarget {
  constructor({ id = '', text = '', classes = [] } = {}) {
    super();
    this.id = id;
    this.textContent = text;
    this.dataset = {};
    this.attrs = {};
    this.classList = new FakeClassList(...classes);
    this.removed = false;
  }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  remove() { this.removed = true; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html' });
    this.body = { dataset:{ screen:'tarot' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.active = this.add(new FakeNode({ id:'tarot', classes:['screen','active'] }));
    this.add(new FakeNode({ id:'orb' }));
    this.add(new FakeNode({ id:'orbCanvas' }));
    this.add(new FakeNode({ id:'tableOrb' }));
    this.add(new FakeNode({ id:'current', classes:['current','empty'] }));
    this.add(new FakeNode({ id:'count', text:'0/78' }));
    this.add(new FakeNode({ id:'remaining', text:'78 cartas sem repetição' }));
    this.add(new FakeNode({ id:'shuffleDeck' }));
    this.add(new FakeNode({ id:'resetDeck' }));
    const table = this.add(new FakeNode({ id:'realTable' }));
    table.setAttribute('aria-rowcount','13');
    table.setAttribute('aria-colcount','6');
  }
  add(node) { this.nodes.set(node.id,node); return node; }
  getElementById(id) { return this.nodes.get(id) || this.head.children.find(node => node.id === id) || null; }
  querySelector(selector) {
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.active;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return [this.getElementById('orb')];
    if (selector === '#orbCanvas') return [this.getElementById('orbCanvas')];
    return [];
  }
  createElement() { return new FakeNode(); }
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#tarot' }; }
}

const fire = (target, type, detail = 1) => {
  const event = new Event(type, { cancelable:true });
  Object.defineProperty(event,'detail',{ value:detail });
  target.dispatchEvent(event);
};

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = TAROT_LIVRE_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.sequence.join('|') === 'orb|card|silence|freedom', 'sequência essencial');
ok(contract.cards === 78 && contract.rows === 13 && contract.columns === 6, 'mesa completa');
ok(contract.reversedCards === false, 'sem invertidas');
ok(contract.repetitionBeforeReset === false, 'sem repetição');
ok(contract.automaticMeanings === false && contract.meaningsAdded === 0, 'sem significado automático');
ok(contract.cardSelectionChanges === 0 && contract.shuffleChanges === 0 && contract.resetChanges === 0, 'motor intocado');
ok(contract.reusesCanonicalOrb === true && contract.newCanvases === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createTarotLivreSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13TarotSoul === 'v610', 'identidade instalada');
ok(doc.active.dataset.tarotSoul === 'v610', 'Tarot marcado como mundo próprio');
ok(doc.active.dataset.tarotSoulPresence === 'present', 'presença na rota Tarot');
ok(doc.active.dataset.tarotSoulPhase === 'origin', 'origem silenciosa');
ok(doc.head.children.length === 1, 'uma folha de estilo instalada');
ok(doc.head.children[0].href.includes('tarot-livre-soul-v610.css'), 'estilo correto');

const audit = soul.audit();
ok(audit.tarotScreenPresent && audit.revealOrbPresent, 'altar preservado');
ok(audit.shufflePreserved && audit.resetPreserved, 'controles preservados');
ok(audit.mesaRealPreserved && audit.mesaRealPositions === 78, 'Mesa Real preservada');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas, 'unicidade preservada');
ok(audit.cardSelectionChanges === 0 && audit.automaticMeanings === false, 'sem mudança de regra');

const tableOrb = doc.getElementById('tableOrb');
fire(tableOrb,'pointerdown');
ok(soul.phase === 'answering', 'toque responde imediatamente');
ok(pulses === 1, 'pulso na Orbe existente');
fire(tableOrb,'pointerup');
ok(soul.phase === 'silence', 'resposta deixa silêncio');
doc.getElementById('current').classList.remove('empty');
doc.getElementById('count').textContent = '1/78';
doc.getElementById('remaining').textContent = '77 cartas restantes';
fire(tableOrb,'click',1);
ok(soul.phase === 'silence', 'carta permanece em silêncio');
ok(soul.status().revealsObserved === 1, 'revelação observada sem interferência');
ok(soul.status().revealed === 1 && soul.status().remaining === 77, 'estado público refletido');

fire(doc.getElementById('shuffleDeck'),'click');
ok(soul.phase === 'ready' && soul.status().shuffleGestures === 1, 'embaralhar continua livre');
ok(pulses === 2, 'embaralhar recebe resposta leve');
fire(doc.getElementById('resetDeck'),'click');
ok(soul.phase === 'origin' && soul.status().resetGestures === 1, 'recomeçar retorna à origem');

fire(doc,'divina:route-ready',{ id:'daily' });
ok(soul.route === 'daily' && soul.phase === 'rest', 'alma repousa fora do Tarot');
ok(doc.active.dataset.tarotSoulPresence === 'away', 'mundo não vaza');
const responsesBefore = soul.responses;
fire(tableOrb,'pointerdown');
ok(soul.responses === responsesBefore, 'gesto inativo não responde');
fire(doc,'divina:route-ready',{ id:'tarot' });
ok(soul.route === 'tarot' && soul.phase === 'silence', 'retorno preserva carta e silêncio');

ok(soul.status().automaticNavigation === false, 'sem navegação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita');
ok(soul.status().work14 === false, 'termina dentro do WORK13');
soul.destroy();
ok(doc.getElementById('divinaTarotLivreSoulV610').removed === true, 'desmontagem limpa');

console.log(`PASS ${checks}/${checks} — alma funcional do Tarot Livre V610`);
