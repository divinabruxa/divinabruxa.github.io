import assert from 'node:assert/strict';
import {
  ESCOLA_WORLD_CONTRACT_V618,
  createEscolaWorldV618
} from './escola-world-v618.js';

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
      if ((last === 'h2' && child.tagName === 'H2') || (last === '#schoolApp' && child.id === 'schoolApp')) result.push(child);
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
    this.body = { dataset:{ screen:'school' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'school', classes:['screen','active'],
      dataset:{ db596ChamberState:'threshold', schoolSoulPhase:'threshold' }
    }));
    this.title = new FakeNode({ tag:'h2' });
    this.app = this.add(new FakeNode({
      id:'schoolApp',
      dataset:{ v607SchoolMode:'choice', schoolSoulPhase:'threshold' }
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
  constructor() { super(); this.location = { hash:'#school' }; }
}

const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type,{ detail }));
let checks = 0;
const ok = (value, message) => { assert.ok(value,message); checks += 1; };
const contract = ESCOLA_WORLD_CONTRACT_V618;

ok(contract.version === 618 && contract.work === 'WORK13', 'V618 permanece no WORK13');
ok(contract.reality === 'school' && contract.universe === 'jardim-das-78-sementes', 'novo mundo declarado');
ok(contract.identity === 'midnight-emerald-amber-parchment', 'identidade própria');
ok(contract.sequence.join('|') === 'arrival|one-living-seed|one-next-lesson|one-whole-lesson|practice|root|silence|programme-on-explicit-request', 'travessia completa');
ok(contract.schoolAuthority === 'V555-preserved' && contract.chamberAuthority === 'V596-preserved', 'Escola e câmara protegidas');
ok(contract.livingWisdomAuthority === 'V607-preserved' && contract.soulAuthority === 'V610-preserved', 'caminho e alma protegidos');
ok(contract.stagesPreserved === 3 && contract.modulesPreserved === 17 && contract.lessonsPreserved === 124, 'programa inteiro preservado');
ok(contract.cardLessonsPreserved === 78 && contract.theoryPracticeLessonsPreserved === 46, '78 cartas e 46 aulas preservadas');
ok(contract.freeLessonsPreserved === 17 && contract.premiumLessonsPreserved === 107, '17 livres e 107 Premium preservadas');
ok(contract.foundationsFreePreserved && contract.premiumOfflinePreserved, 'Fundamentos e Premium offline preservados');
ok(contract.oneNaturalNextLesson && contract.oneWholeLessonAtATime && contract.programmeRequiresExplicitGesture, 'um passo por vez');
ok(contract.progressAuthorityChanges === 0 && contract.lessonContentChanges === 0 && contract.quizChanges === 0, 'conteúdo intacto');
ok(contract.privateContentReads === 0 && contract.schoolNoteReads === 0 && contract.answerReads === 0, 'conteúdo privado não lido');
ok(contract.storageReads === 0 && contract.networkCalls === 0 && contract.modelCalls === 0, 'sem dados externos');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso contínuo');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
const world = createEscolaWorldV618({ documentTarget:doc, windowTarget:win });

ok(doc.documentElement.dataset.work13SchoolWorld === 'v618', 'identidade global instalada');
ok(doc.screen.dataset.schoolWorld === 'v618', 'realidade marcada');
ok(doc.screen.dataset.schoolUniverse === 'jardim-das-78-sementes', 'universo anexado');
ok(doc.screen.dataset.schoolWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.schoolWorldPhase === 'threshold', 'chegada preserva o limiar');
ok(doc.app.dataset.schoolWorld === 'v618' && doc.app.dataset.schoolWorldPhase === 'threshold', 'app acompanha o mundo');
ok(doc.screen.dataset.schoolWorldSequence === 'arrival-seed-next-lesson-whole-lesson-practice-root-silence-programme', 'ordem pública marcada');
ok(doc.title.textContent === 'O saber que você toca começa a criar raiz.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('escola-world-v618.css'), 'estilo único instalado');

fire(doc,'divina:school-soul-state',{ phase:'germinating', reason:'touch' });
ok(world.phase === 'germinating' && world.stateResponses === 1, 'toque recebe resposta imediata');
fire(doc,'divina:school-soul-state',{ phase:'paths', reason:'explicit-programme' });
ok(world.phase === 'paths', 'programa nasce apenas quando pedido');
doc.app.dataset.v607SchoolMode = 'lesson';
fire(doc,'divina:school-soul-state',{ phase:'lesson', reason:'next-lesson' });
ok(world.phase === 'lesson', 'uma aula inteira ocupa o primeiro plano');
fire(doc,'divina:school-soul-state',{ phase:'practice', reason:'practice' });
ok(world.phase === 'practice', 'prática recebe espaço próprio');
fire(doc,'divina:school-soul-state',{ phase:'rooting', reason:'complete' });
ok(world.phase === 'rooting', 'conhecimento cria raiz');
fire(doc,'divina:school-progress-v555',{ done:1, total:124, percent:1 });
ok(world.phase === 'rooted' && world.progress.done === 1 && world.progress.total === 124, 'progresso público enraíza a aula');
ok(world.progressUpdates === 1, 'uma atualização pública observada');

const audit = world.audit();
ok(audit.schoolScreenPresent && audit.schoolAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.modulesPreserved === 17 && audit.lessonsPreserved === 124, 'programa auditado');
ok(audit.freeLessonsPreserved === 17 && audit.premiumLessonsPreserved === 107, 'acesso auditado');
ok(audit.privateContentReads === 0 && audit.schoolNoteReads === 0, 'auditoria sem invasão');

fire(doc,'divina:route-start',{ id:'library' });
ok(world.phase === 'travel', 'travessia recebe resposta');
fire(doc,'divina:route-ready',{ id:'library' });
ok(world.route === 'library' && world.phase === 'rest', 'mundo repousa fora da Escola');
ok(doc.screen.dataset.schoolWorldPresence === 'away', 'presença não vaza');
const responses = world.stateResponses;
fire(doc,'divina:school-soul-state',{ phase:'lesson', reason:'away' });
ok(world.stateResponses === responses + 1 && world.phase === 'rest', 'evento externo não reabre a Escola');

doc.app.dataset.schoolSoulPhase = 'lesson';
fire(doc,'divina:route-ready',{ id:'school' });
ok(world.route === 'school' && world.phase === 'lesson', 'retorno recupera a camada pública');
ok(world.status().automaticNavigation === false && world.status().automaticWhitSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaEscolaWorldV618').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13SchoolWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.schoolWorld && !doc.app.dataset.schoolWorld, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — runtime do Jardim das 78 Sementes V618`);
