import assert from 'node:assert/strict';
import {
  ESCOLA_SOUL_CONTRACT_V610,
  createEscolaSoulV610
} from './escola-soul-v610.js';

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
    this.body = { dataset:{ screen:'school' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'school',
      classes:['screen','active'],
      dataset:{ db596ChamberState:'threshold' }
    }));
    this.app = this.add(new FakeNode({ id:'schoolApp', dataset:{ v607SchoolMode:'choice' } }));
    this.dashboard = new FakeNode({ classes:['school-dashboard'] });
    this.app.append(this.dashboard);
    this.screen.append(this.app);
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
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

const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = ESCOLA_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.reality === 'school' && contract.stage === 'quarta-realidade-alma-propria', 'quarta realidade declarada');
ok(contract.universe === 'jardim-arcano-do-conhecimento', 'universo novo declarado');
ok(contract.sequence.join('|') === 'seed|one-next-step|path|one-whole-lesson|practice|root|silence', 'caminho vivo completo');
ok(contract.existingSchoolAuthority === 'V555-preserved', 'Escola V555 preservada');
ok(contract.existingChamberAuthority === 'V596-preserved', 'câmara V596 preservada');
ok(contract.existingLivingWisdomAuthority === 'V607-preserved', 'um passo V607 preservado');
ok(contract.stagesPreserved === 3 && contract.modulesPreserved === 17, 'três jornadas e dezessete módulos preservados');
ok(contract.lessonsPreserved === 124 && contract.cardLessonsPreserved === 78, 'aulas preservadas');
ok(contract.freeLessonsPreserved === 17 && contract.premiumLessonsPreserved === 107, 'acessos preservados');
ok(contract.oneNaturalNextLesson && contract.programmeRequiresExplicitGesture, 'um próximo passo antes do programa');
ok(contract.progressAuthorityChanges === 0 && contract.lessonContentChanges === 0, 'progresso e conteúdo intocados');
ok(contract.quizChanges === 0 && contract.exerciseChanges === 0 && contract.searchChanges === 0, 'funções de estudo intactas');
ok(contract.premiumAuthorityChanges === 0 && contract.persistenceChanges === 0, 'Premium e persistência intactos');
ok(contract.reusesCanonicalOrb && contract.reusesGlobalLivingMenu, 'uma Orbe e um menu');
ok(contract.privateContentReads === 0 && contract.lessonBodyReads === 0 && contract.schoolNoteReads === 0, 'privacidade preservada');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'nenhum peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createEscolaSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13SchoolSoul === 'v610', 'identidade instalada');
ok(doc.screen.dataset.schoolSoul === 'v610', 'Escola marcada como mundo próprio');
ok(doc.screen.dataset.schoolSoulUniverse === 'jardim-arcano', 'Jardim Arcano marcado');
ok(doc.screen.dataset.schoolSoulPresence === 'present', 'presença ativa na rota');
ok(doc.screen.dataset.schoolSoulPhase === 'threshold', 'mundo nasce como semente');
ok(doc.screen.dataset.schoolSoulSequence === 'seed-next-step-path-lesson-practice-root-silence', 'ordem pública marcada');
ok(doc.app.dataset.schoolSoul === 'v610', 'app existente recebe a alma');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('escola-soul-v610.css'), 'estilo único instalado');

const next = new FakeNode({ tag:'button', dataset:{ schoolContinue:'' } });
doc.dashboard.append(next);
ok(soul.kindFor(next) === 'continue', 'próximo passo reconhecido');
ok(soul.respond('continue','touch'), 'toque inicial recebe resposta');
ok(soul.phase === 'germinating' && soul.continueGestures === 1, 'semente germina imediatamente');
ok(pulses === 1, 'mesma Orbe responde ao passo');

doc.screen.dataset.db596ChamberState = 'engaged';
doc.app.dataset.v607SchoolMode = 'module';
soul.sync('module-open');
ok(soul.phase === 'paths', 'programa vira caminhos');

const moduleButton = new FakeNode({ tag:'button', dataset:{ schoolModule:'fundamentos' } });
doc.app.append(moduleButton);
ok(soul.kindFor(moduleButton) === 'path', 'módulo reconhecido como caminho');
ok(soul.respond('path','touch') && soul.pathGestures === 1, 'caminho responde');

const lesson = new FakeNode({ classes:['school-lesson'], dataset:{ lessonId:'fundamentos-1' } });
const lessonButton = new FakeNode({ tag:'button' });
lesson.append(lessonButton);
doc.app.append(lesson);
doc.app.dataset.v607SchoolMode = 'lesson';
ok(soul.kindFor(lessonButton) === 'lesson', 'aula reconhecida');
ok(soul.respond('lesson','touch') && soul.phase === 'lesson', 'aula vira centro');

const practice = new FakeNode({ tag:'button', dataset:{ schoolPractice:'' } });
lesson.append(practice);
ok(soul.kindFor(practice) === 'practice', 'prática reconhecida antes da aula genérica');
ok(soul.respond('practice','touch') && soul.phase === 'practice', 'prática responde');

const complete = new FakeNode({ tag:'button', dataset:{ complete:'' } });
lesson.append(complete);
ok(soul.kindFor(complete) === 'complete', 'conclusão reconhecida antes da prática');
ok(soul.respond('complete','touch') && soul.phase === 'rooting', 'conhecimento cria raiz');

fire(doc,'divina:school-progress-v555',{ done:1, total:124, percent:1, private:false, noteIncluded:false });
ok(soul.phase === 'rooted', 'progresso público confirma a raiz');
ok(soul.progress.done === 1 && soul.progress.total === 124 && soul.progress.percent === 1, 'somente progresso público guardado');
ok(soul.progressUpdates === 1, 'uma atualização de progresso');
ok(pulses === 6, 'respostas finitas, uma por gesto e crescimento');

fire(doc,'divina:menu-state',{ state:'open' });
ok(soul.phase === 'portal', 'Orbe global abre o portal sem tomar a Escola');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(soul.phase === 'lesson', 'fechar o menu devolve a aula pública');

fire(doc,'divina:reality-chamber-state',{ route:'school', state:'awakening' });
ok(soul.phase === 'germinating', 'câmara desperta como germinação');

const audit = soul.audit();
ok(audit.schoolScreenPresent && audit.schoolAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.stagesPreserved === 3 && audit.modulesPreserved === 17 && audit.lessonsPreserved === 124, 'estrutura preservada no audit');
ok(audit.privateContentReads === 0 && audit.lessonBodyReads === 0 && audit.schoolNoteReads === 0, 'alma não lê conteúdo');

fire(doc,'divina:route-ready',{ id:'library' });
ok(soul.route === 'library' && soul.phase === 'rest', 'alma repousa fora da Escola');
ok(doc.screen.dataset.schoolSoulPresence === 'away', 'presença não vaza');
const responsesBefore = soul.responses;
soul.respond('continue','touch');
ok(soul.responses === responsesBefore, 'gesto fora da rota não dispara a alma');

doc.screen.dataset.db596ChamberState = 'present';
doc.app.dataset.v607SchoolMode = 'choice';
fire(doc,'divina:route-ready',{ id:'school' });
ok(soul.route === 'school' && soul.phase === 'choice', 'retorno recupera o próximo passo');
ok(soul.status().automaticNavigation === false && soul.status().automaticWhitSpeech === false, 'sem ação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita');
ok(soul.status().work14 === false, 'termina no WORK13');

soul.destroy();
ok(doc.getElementById('divinaEscolaSoulV610').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13SchoolSoul, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.schoolSoul && !doc.app.dataset.schoolSoul, 'desmontagem libera mundo e app');

console.log(`PASS ${checks}/${checks} — alma funcional da Escola V610`);
