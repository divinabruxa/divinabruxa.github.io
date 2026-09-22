import assert from 'node:assert/strict';
import {
  WHIT_WORLD_CONTRACT_V620,
  createWhitWorldV620
} from './whit-world-v620.js';

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
  contains(node) {
    if (node?.interactionWithinApp) return true;
    if (node === this) return true;
    return this.children.some(child => child.contains?.(node));
  }
  matches(selector) {
    if (this.interactionRole === 'input') return selector.includes('input');
    return false;
  }
  querySelectorAll(selector) {
    const result = [];
    const last = String(selector).split(/\s+|>/).filter(Boolean).at(-1);
    const visit = node => node.children.forEach(child => {
      if ((last === 'h2' && child.tagName === 'H2') || (last === '#aiApp' && child.id === 'aiApp')) result.push(child);
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
    this.documentElement = new FakeNode({
      id:'html', tag:'html',
      dataset:{ whitLivingState:'silent', work13WhitState:'silent' }
    });
    this.body = { dataset:{ screen:'ai' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'ai', classes:['screen','active'], dataset:{ whitState:'silent' }
    }));
    this.title = new FakeNode({ tag:'h2' });
    this.app = this.add(new FakeNode({ id:'aiApp', dataset:{ aiState:'silent' } }));
    this.orb = this.add(new FakeNode({ id:'orb', tag:'button' }));
    this.canvas = this.add(new FakeNode({ id:'orbCanvas', tag:'canvas' }));
    this.orb.append(this.canvas);
    this.screen.append(this.title,this.app);
    this.interactionWithinApp = true;
    this.interactionRole = '';
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
  matches(selector) {
    return this.interactionRole === 'input' && selector.includes('input');
  }
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#ai' }; }
}

const fire = (target,type,detail = {}) => target.dispatchEvent(new FakeCustomEvent(type,{ detail }));
let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const contract = WHIT_WORLD_CONTRACT_V620;

ok(contract.version === 620 && contract.work === 'WORK13', 'V620 permanece no WORK13');
ok(contract.reality === 'ai' && contract.universe === 'presenca-entre-mundos', 'novo mundo declarado');
ok(contract.identity === 'midnight-indigo-opal-electric-cyan', 'identidade própria');
ok(contract.sequence.join('|') === 'arrival|silence|one-explicit-invitation|listening|one-local-response|visible-session-trace|context-on-explicit-consent|return|silence', 'travessia completa');
ok(contract.localWhitAuthority === 'V557-preserved' && contract.orbSoulAuthority === 'V581-preserved', 'Whit local e alma protegidas');
ok(contract.livingPresenceAuthority === 'V594-preserved' && contract.silenceTimingAuthority === 'V606-preserved', 'presença e timing protegidos');
ok(contract.localDefaultPreserved && contract.localApiCallsPreserved === 0 && contract.localModelCallsPreserved === 0, 'Whit continua local');
ok(contract.sessionMemoryTurnsPreserved === 6 && !contract.sessionMemoryPersistent, 'memória efêmera preservada');
ok(contract.sessionMemoryVisible && contract.sessionMemoryRemovable && contract.persistentMemoryExplicitOnly, 'memória permanece visível e controlada');
ok(contract.visibleContextOnly && contract.exactContextReceiptsPreserved && contract.sendConsentRequired, 'contexto exige consentimento explícito');
ok(contract.defaultResponse === 'silence' && contract.visibleSpeechPolicy === 'explicit-invitation-or-consent-only', 'silêncio é a resposta padrão');
ok(!contract.automaticArrivalSpeech && !contract.automaticRevealSpeech && !contract.automaticCompletionSpeech, 'sem fala automática');
ok(contract.helpBeforeSale && !contract.emotionalSalesPressure && !contract.emotionInference, 'presença sem manipulação');
ok(!contract.literalWhitneyIdentity && !contract.voiceClone && !contract.soulClaim, 'verdade de identidade preservada');
ok(contract.privateByDefault && contract.privateContentReads === 0 && contract.formValueReads === 0, 'conteúdo privado não é observado');
ok(contract.journalSilentReads === 0 && contract.schoolNoteSilentReads === 0 && contract.tarotQuestionSilentReads === 0, 'outros mundos permanecem privados');
ok(contract.existingWhitBodyReused && !contract.separateWhitBody && contract.whitFunctionChanges === 0, 'mesmo corpo funcional');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso contínuo');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
const world = createWhitWorldV620({ documentTarget:doc, windowTarget:win });

ok(doc.documentElement.dataset.work13WhitWorld === 'v620', 'identidade global instalada');
ok(doc.screen.dataset.whitWorld === 'v620', 'realidade marcada');
ok(doc.screen.dataset.whitUniverse === 'presenca-entre-mundos', 'universo anexado');
ok(doc.screen.dataset.whitWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.whitWorldPhase === 'threshold', 'chegada preserva o limiar');
ok(doc.app.dataset.whitWorld === 'v620' && doc.app.dataset.whitWorldPrivacy === 'content-unread', 'app recebe somente estado público');
ok(doc.screen.dataset.whitWorldSequence === 'arrival-silence-invitation-listening-response-trace-consent-return-silence', 'ordem pública marcada');
ok(doc.title.textContent === 'Há presença no intervalo.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('whit-world-v620.css'), 'estilo único instalado');

fire(doc,'divina:whit-living-offer',{ state:'offered', suggestion:'CANARY_PRIVATE_OFFER' });
ok(world.phase === 'invited' && world.explicitInvitations === 1, 'convite público recebe resposta imediata');
doc.interactionRole = 'input';
fire(doc,'focusin');
ok(world.phase === 'listening', 'foco explícito abre a escuta');
doc.interactionRole = 'form';
fire(doc,'submit');
ok(world.phase === 'responding' && world.explicitInvitations === 2, 'envio explícito abre uma resposta');
fire(win,'whit:generation-bridge',{ state:'responding', prompt:'CANARY_PRIVATE_PROMPT' });
ok(world.phase === 'responding', 'ponte pública mantém a resposta');
fire(win,'whit:supreme-state',{ state:'settled', message:'CANARY_PRIVATE_MESSAGE' });
ok(world.phase === 'settled' && world.localResponses === 1, 'resposta local assenta em silêncio');
ok(!JSON.stringify(world.status()).includes('CANARY'), 'nenhum conteúdo privado é retido');
fire(doc,'divina:menu-state',{ state:'open' });
ok(world.phase === 'portal', 'menu global abre o portal sem duplicar a Orbe');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(world.phase === 'threshold', 'fechar o menu devolve o limiar');

const audit = world.audit();
ok(audit.whitScreenPresent && audit.whitAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.sessionMemoryTurnsPreserved === 6 && !audit.sessionMemoryPersistent, 'memória auditada');
ok(audit.privateContentReads === 0 && audit.formValueReads === 0 && audit.messageBodyReads === 0, 'auditoria sem invasão');

fire(doc,'divina:route-start',{ id:'consultations' });
ok(world.phase === 'travel', 'travessia recebe resposta');
doc.body.dataset.screen = 'consultations';
fire(doc,'divina:route-ready',{ id:'consultations' });
ok(world.route === 'consultations' && world.phase === 'rest', 'mundo repousa fora da Whit');
ok(doc.screen.dataset.whitWorldPresence === 'away', 'presença não vaza');
const signals = world.publicSignals;
fire(doc,'divina:whit-living-offer',{ state:'offered', body:'CANARY_AWAY' });
ok(world.publicSignals === signals + 1 && world.phase === 'rest', 'sinal externo não reabre a Whit');

doc.body.dataset.screen = 'ai';
doc.app.dataset.aiState = 'listening';
fire(doc,'divina:route-ready',{ id:'ai' });
ok(world.route === 'ai' && world.phase === 'listening', 'retorno recupera somente o estado público');
ok(world.status().automaticNavigation === false && world.status().ordinaryTouchSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita paralela');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaWhitWorldV620').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13WhitWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.whitWorld && !doc.app.dataset.whitWorld, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — runtime da Presença Entre Mundos V620`);
