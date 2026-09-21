import assert from 'node:assert/strict';
import {
  BIBLIOTECA_SOUL_CONTRACT_V610,
  createBibliotecaSoulV610
} from './biblioteca-soul-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}

const dataName = value => value.replace(/-([a-z])/g, (_,letter) => letter.toUpperCase());

class FakeNode extends EventTarget {
  constructor({ id = '', tag = 'div', dataset = {}, classes = [] } = {}) {
    super();
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.dataset = { ...dataset };
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
  querySelector() { return null; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ tag:'html', dataset:{} });
    this.head = new FakeNode({ tag:'head' });
    this.body = new FakeNode({ tag:'body', dataset:{ screen:'library' } });
    this.screen = new FakeNode({ id:'library', tag:'section', classes:['screen','active'], dataset:{} });
    this.app = new FakeNode({ id:'cardLibraryApp', dataset:{ v607LibraryMode:'focus' } });
    this.host = new FakeNode({ dataset:{ libraryOrbHost:'' } });
    this.orb = new FakeNode({ id:'orb', dataset:{ orb:'' } });
    this.canvas = new FakeNode({ id:'orbCanvas', tag:'canvas' });
    this.documentElement.append(this.head,this.body);
    this.body.append(this.screen);
    this.screen.append(this.app);
    this.app.append(this.host);
    this.host.append(this.orb);
    this.orb.append(this.canvas);
  }
  createElement(tag) { return new FakeNode({ tag }); }
  getElementById(id) {
    if (id === 'library') return this.screen;
    if (id === 'cardLibraryApp') return this.app;
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
  constructor() { super(); this.location = { hash:'#library' }; }
}

const fire = (target, type, detail = {}) => target.dispatchEvent(new FakeCustomEvent(type, { detail }));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = BIBLIOTECA_SOUL_CONTRACT_V610;

ok(contract.version === 610 && contract.work === 'WORK13', 'permanece no WORK13 V610');
ok(contract.reality === 'library' && contract.stage === 'quinta-realidade-alma-propria', 'quinta realidade declarada');
ok(contract.universe === 'arquivo-de-luz', 'universo novo declarado');
ok(contract.sequence.join('|') === 'threshold|orb|one-discovery|silence|symbolic-thread|related-doors|catalogue-on-explicit-request', 'travessia completa');
ok(contract.existingLibraryWorldAuthority === 'V302-preserved', 'mundo V302 preservado');
ok(contract.existingLibraryDepthAuthority === 'V332-preserved', 'profundidade V332 preservada');
ok(contract.existingPublicLibraryAuthority === 'V544-preserved', 'catálogo V544 preservado');
ok(contract.existingLivingWisdomAuthority === 'V607-preserved', 'descoberta V607 preservada');
ok(contract.cardsPreserved === 78 && contract.uprightCardsOnly && !contract.reversedCards, '78 cartas diretas preservadas');
ok(contract.cataloguePageSizePreserved === 18 && contract.gridFullImageRequestsPreserved === 0, 'catálogo leve preservado');
ok(contract.oneDiscoveryFirst && contract.catalogueRequiresExplicitGesture, 'descoberta antes do catálogo');
ok(contract.symbolicThreadsPreserved.join('|') === 'symbol|element|number|archetype|related-cards', 'fios simbólicos preservados');
ok(contract.searchLanguagesPreserved.join('|') === 'pt-BR|en|es' && contract.searchDiacriticsInsensitive, 'busca internacional preservada');
ok(contract.cardMeaningChanges === 0 && contract.cardSelectionChanges === 0, 'significados e escolha intactos');
ok(contract.searchChanges === 0 && contract.filterChanges === 0 && contract.comparisonChanges === 0, 'ferramentas intactas');
ok(contract.reusesCanonicalOrb && contract.reusesGlobalLivingMenu, 'uma Orbe e um menu');
ok(contract.privateContentReads === 0 && contract.cardIdentityReads === 0 && contract.cardMeaningReads === 0, 'alma não lê a carta');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'nenhum peso permanente');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
let pulses = 0;
const soul = createBibliotecaSoulV610({
  documentTarget:doc,
  windowTarget:win,
  orbCore:{ pulse() { pulses += 1; } }
});

ok(doc.documentElement.dataset.work13LibrarySoul === 'v610', 'identidade instalada');
ok(doc.screen.dataset.librarySoul === 'v610', 'Biblioteca marcada como mundo próprio');
ok(doc.screen.dataset.librarySoulUniverse === 'arquivo-de-luz', 'Arquivo de Luz marcado');
ok(doc.screen.dataset.librarySoulPresence === 'present', 'presença ativa na rota');
ok(doc.screen.dataset.librarySoulPhase === 'threshold', 'mundo nasce no limiar');
ok(doc.screen.dataset.librarySoulSequence === 'threshold-orb-discovery-silence-thread-doors-catalogue', 'ordem pública marcada');
ok(doc.app.dataset.librarySoul === 'v610', 'app existente recebe a alma');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('biblioteca-soul-v610.css'), 'estilo único instalado');

const invitation = new FakeNode({ tag:'button', dataset:{ v607Action:'library-primary' } });
doc.app.append(invitation);
ok(soul.kindFor(invitation) === 'invitation', 'convite reconhecido');
ok(soul.respond('invitation','touch'), 'convite responde imediatamente');
ok(soul.phase === 'answering' && soul.invitationGestures === 1, 'luz responde sem duplicar a Orbe');
ok(pulses === 0, 'convite deixa o pulso para a Orbe canônica');

ok(soul.kindFor(doc.canvas) === 'orb', 'Orbe local reconhecida pelo seu host');
ok(soul.respond('orb','touch'), 'Orbe responde');
ok(soul.phase === 'answering' && soul.orbGestures === 1 && pulses === 1, 'resposta imediata e finita');

fire(doc,'divina:wisdom-public-context-v539',{ kind:'card', cardId:'CANARY_CARD_PRIVATE', meaning:'CANARY_MEANING_PRIVATE' });
ok(soul.discovered && soul.phase === 'discovery', 'descoberta pública abre o silêncio');
ok(soul.discoverySignals === 1 && pulses === 2, 'um único sinal público contado');
ok(!JSON.stringify(soul.status()).includes('CANARY'), 'identidade e significado não são retidos');

const path = new FakeNode({ tag:'button', dataset:{ path:'element' } });
doc.app.append(path);
ok(soul.kindFor(path) === 'thread', 'fio simbólico reconhecido');
ok(soul.respond('thread','touch') && soul.phase === 'thread' && soul.threadGestures === 1, 'fio responde');

const card = new FakeNode({ tag:'button', dataset:{ libraryCard:'true' } });
doc.app.append(card);
ok(soul.kindFor(card) === 'card', 'porta de carta reconhecida');
ok(soul.respond('card','touch') && soul.phase === 'discovery' && soul.cardGestures === 1, 'porta responde');

const search = new FakeNode({ tag:'button', dataset:{ searchToggle:'' } });
doc.app.append(search);
ok(soul.kindFor(search) === 'search', 'busca reconhecida sem ler consulta');
ok(soul.respond('search','touch') && soul.phase === 'search' && soul.searchGestures === 1, 'busca responde');

const catalogue = new FakeNode({ tag:'button', dataset:{ v607Action:'library-catalogue' } });
doc.app.append(catalogue);
ok(soul.kindFor(catalogue) === 'catalogue', 'pedido das 78 reconhecido');
ok(soul.respond('catalogue','touch') && soul.catalogueGestures === 1, 'catálogo responde somente ao gesto');
doc.app.dataset.v607LibraryMode = 'catalogue';
soul.sync('catalogue-open');
ok(soul.phase === 'catalogue', 'estado público confirma catálogo');

fire(doc,'divina:menu-state',{ state:'open' });
ok(soul.phase === 'portal', 'Orbe global abre o portal sem tomar a Biblioteca');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(soul.phase === 'catalogue', 'fechar o menu devolve o arquivo aberto');

const audit = soul.audit();
ok(audit.libraryScreenPresent && audit.libraryAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.cardsPreserved === 78 && audit.cataloguePageSizePreserved === 18, 'estrutura preservada no audit');
ok(audit.privateContentReads === 0 && audit.cardIdentityReads === 0 && audit.cardMeaningReads === 0, 'audit confirma privacidade');

fire(doc,'divina:route-ready',{ id:'school' });
ok(soul.route === 'school' && soul.phase === 'rest', 'alma repousa fora da Biblioteca');
ok(doc.screen.dataset.librarySoulPresence === 'away', 'presença não vaza');
const responsesBefore = soul.responses;
soul.respond('orb','touch');
ok(soul.responses === responsesBefore, 'gesto fora da rota não dispara a alma');

doc.app.dataset.v607LibraryMode = 'focus';
fire(doc,'divina:route-ready',{ id:'library' });
ok(soul.route === 'library' && soul.phase === 'discovery', 'retorno recupera a descoberta sem guardar a carta');
ok(soul.status().automaticNavigation === false && soul.status().automaticWhitSpeech === false, 'sem ação automática');
ok(soul.status().networkCalls === 0 && soul.status().storageWrites === 0, 'sem rede ou escrita');
ok(soul.status().work14 === false, 'termina no WORK13');

soul.destroy();
ok(doc.getElementById('divinaBibliotecaSoulV610').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13LibrarySoul, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.librarySoul && !doc.app.dataset.librarySoul, 'desmontagem libera mundo e app');

console.log(`PASS ${checks}/${checks} — alma funcional da Biblioteca V610`);
