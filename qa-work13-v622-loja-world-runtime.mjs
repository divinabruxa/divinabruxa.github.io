import assert from 'node:assert/strict';
import {
  LOJA_WORLD_CONTRACT_V622,
  createLojaWorldV622
} from './loja-world-v622.js';

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
  querySelectorAll(selector) {
    const result = [];
    const wantsTitle = String(selector).includes('h2');
    const visit = node => node.children.forEach(child => {
      if (wantsTitle && child.tagName === 'H2') result.push(child);
      visit(child);
    });
    visit(this);
    return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

class FakeActionNode {
  constructor(role) { this.role = role; }
  matches(selector) {
    if (this.role === 'start') return selector.includes('store-start');
    if (this.role === 'collection') return selector.includes('[data-collection]');
    if (this.role === 'category') return selector.includes('[data-category]');
    if (this.role === 'favorite') return selector.includes('[data-favorite]');
    if (this.role === 'affiliate') return selector.includes('[data-affiliate]');
    if (this.role === 'reset') return selector.includes('[data-reset-store]');
    return false;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.documentElement = new FakeNode({ id:'html', tag:'html' });
    this.body = { dataset:{ screen:'store' } };
    this.head = { children:[], append:node => this.head.children.push(node) };
    this.nodes = new Map();
    this.screen = this.add(new FakeNode({
      id:'store', classes:['screen','active'],
      dataset:{ v608CommerceMode:'guide', db596ChamberMode:'arrival' }
    }));
    this.title = new FakeNode({ tag:'h2' });
    this.app = this.add(new FakeNode({ id:'storeApp', dataset:{ storeState:'guide' } }));
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
  closest(selector) {
    return selector === 'button,a,summary' && this.interactionRole
      ? new FakeActionNode(this.interactionRole)
      : null;
  }
  matches(selector) {
    return this.interactionRole === 'search'
      && selector.includes('[data-store-search]')
      && selector.includes('input[type="search"]');
  }
}

class FakeWindow extends EventTarget {
  constructor() { super(); this.location = { hash:'#store' }; }
}

const fire = (target,type,detail = {}) => target.dispatchEvent(new FakeCustomEvent(type,{ detail }));
let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
const contract = LOJA_WORLD_CONTRACT_V622;

ok(contract.version === 622 && contract.work === 'WORK13', 'V622 permanece no WORK13');
ok(contract.reality === 'store' && contract.universe === 'casa-das-escolhas-vivas', 'novo mundo declarado');
ok(contract.identity === 'night-emerald-patina-copper-amber-parchment', 'identidade própria');
ok(contract.sequence.join('|') === 'arrival|one-clear-intention|four-curated-paths|one-explicit-path|twenty-one-curated-choices|category-search-or-favorites-on-explicit-request|product-truth|external-amazon-passage|return|silence', 'travessia completa');
ok(contract.storeAuthority === 'V543-preserved' && contract.chamberAuthority === 'V596-preserved', 'motor e câmara protegidos');
ok(contract.livingCommerceAuthority === 'V608-preserved', 'clareza V608 protegida');
ok(contract.productsPreserved === 21 && contract.intentionPathsPreserved === 4, 'catálogo e caminhos preservados');
ok(contract.categoriesPreserved === 9 && contract.productCategoriesPreserved === 8, 'categorias preservadas');
ok(contract.featuredChoicesPreserved === 7, 'sete escolhas em destaque preservadas');
ok(contract.categoryNamesPreserved.join('|') === 'Todos|Baralhos|Livros|Cristais|Ritual|Acessórios|Decoração|Apple & Tecnologia|Presentes Premium', 'nomes de categoria preservados');
ok(contract.destinationHost === 'www.amazon.com.br' && contract.checkout === 'external-amazon-only', 'passagem externa correta');
ok(contract.affiliateDisclosureAdjacentPreserved && contract.affiliateTagAuthority === 'V543-config-preserved', 'transparência e autoridade preservadas');
ok(!contract.affiliateTagHardcodedByV622 && contract.affiliateTagChanges === 0, 'nenhum rastreio inventado');
ok(!contract.checkoutInternal && !contract.realBilling && !contract.purchaseInsideDivina, 'nenhuma compra interna inventada');
ok(!contract.priceCache && !contract.stockCache && !contract.ratingCache, 'dados mutáveis ficam na Amazon');
ok(contract.fakeDiscountClaims === 0 && contract.fakeScarcityClaims === 0 && !contract.officialPartnershipClaim, 'verdade comercial intacta');
ok(contract.searchLocalOnlyPreserved && contract.favoritesLocalOnlyPreserved, 'busca e favoritos seguem locais');
ok(contract.privateByDefault && !contract.analyticsSearchTextAccess && !contract.analyticsFavoritesAccess, 'descoberta privada por padrão');
ok(contract.existingStoreBodyReused && !contract.separateStoreBody && contract.storeFunctionChanges === 0, 'mesmo corpo funcional');
ok(contract.privateContentReads === 0 && contract.searchTextReads === 0 && contract.favoritesReads === 0, 'conteúdo privado não é observado');
ok(contract.affiliateUrlReads === 0 && contract.accountDataReads === 0 && contract.paymentDataReads === 0, 'links, conta e pagamento não são lidos');
ok(contract.reusesCanonicalOrb && contract.newCanvases === 0 && contract.newRenderers === 0, 'uma Orbe e um canvas');
ok(contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0, 'sem peso contínuo');
ok(contract.work14 === false, 'sem WORK14');

const doc = new FakeDocument();
const win = new FakeWindow();
const world = createLojaWorldV622({
  amazonStore:{ status:() => ({ version:543,products:21 }) },
  livingCommerce:{ status:() => ({ version:608 }) },
  chambers:{ status:() => ({ version:596 }) },
  documentTarget:doc,
  windowTarget:win
});

ok(doc.documentElement.dataset.work13LojaWorld === 'v622', 'identidade global instalada');
ok(doc.screen.dataset.lojaWorld === 'v622', 'realidade marcada');
ok(doc.screen.dataset.lojaUniverse === 'casa-das-escolhas-vivas', 'universo anexado');
ok(doc.screen.dataset.lojaWorldPresence === 'present', 'presença ativa');
ok(doc.screen.dataset.lojaWorldPhase === 'invitation', 'chegada oferece uma intenção');
ok(doc.app.dataset.lojaWorld === 'v622' && doc.app.dataset.lojaWorldPrivacy === 'search-favorites-links-private-unread', 'app recebe somente estado público');
ok(doc.screen.dataset.lojaWorldSequence === 'arrival-intention-paths-choice-catalog-discovery-truth-amazon-return-silence', 'ordem pública marcada');
ok(doc.title.textContent === 'Toda escolha começa por uma intenção.', 'identidade visível curta');
ok(doc.head.children.length === 1 && doc.head.children[0].href.includes('loja-world-v622.css'), 'estilo único instalado');

doc.interactionRole = 'start';
fire(doc,'click');
ok(world.phase === 'intentions' && world.intentionSignals === 1, 'intenção explícita revela quatro caminhos');
fire(doc,'divina:living-commerce-state',{ route:'store', mode:'intentions', search:'CANARY_PRIVATE_SEARCH' });
ok(world.phase === 'intentions' && world.intentionSignals === 2, 'estado público confirma os caminhos');
doc.interactionRole = 'collection';
fire(doc,'click');
ok(world.phase === 'catalog' && world.discoverySignals === 1, 'caminho explícito abre o catálogo');
fire(doc,'divina:store-state',{ state:'product', productUrl:'CANARY_PRIVATE_URL' });
ok(world.phase === 'product' && world.discoverySignals === 2, 'produto responde por estado público');
doc.interactionRole = 'search';
fire(doc,'focusin');
ok(world.phase === 'filtering' && world.discoverySignals === 3, 'busca só reage ao foco explícito');
doc.interactionRole = 'category';
fire(doc,'click');
ok(world.phase === 'filtering' && world.discoverySignals === 4, 'categoria responde imediatamente');
doc.interactionRole = 'favorite';
fire(doc,'click');
ok(world.phase === 'favorites' && world.favoriteSignals === 1, 'favorito responde sem ser lido');
doc.interactionRole = 'affiliate';
fire(doc,'click');
ok(world.phase === 'passage' && world.passageSignals === 1, 'passagem Amazon responde antes de sair');
ok(!JSON.stringify(world.status()).includes('CANARY'), 'nenhum conteúdo privado é retido');
fire(doc,'divina:menu-state',{ state:'open' });
ok(world.phase === 'portal', 'menu global abre o portal sem duplicar a Orbe');
fire(doc,'divina:menu-state',{ state:'closed' });
ok(world.phase === 'invitation', 'fechar o menu devolve a chegada pública');

const audit = world.audit();
ok(audit.storeScreenPresent && audit.storeAppPresent, 'mundo funcional presente');
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.duplicateOrbs === 0, 'unicidade preservada');
ok(audit.productsPreserved === 21 && audit.intentionPathsPreserved === 4 && audit.categoriesPreserved === 9, 'catálogo auditado');
ok(!audit.checkoutInternal && !audit.realBilling && !audit.priceCache && !audit.stockCache, 'sem ficção comercial');
ok(audit.privateContentReads === 0 && audit.searchTextReads === 0 && audit.favoritesReads === 0, 'auditoria sem invasão');

fire(doc,'divina:route-start',{ id:'subscriptions' });
ok(world.phase === 'travel', 'travessia recebe resposta');
doc.body.dataset.screen = 'subscriptions';
fire(doc,'divina:route-ready',{ id:'subscriptions' });
ok(world.route === 'subscriptions' && world.phase === 'rest', 'mundo repousa fora da Loja');
ok(doc.screen.dataset.lojaWorldPresence === 'away', 'presença não vaza');
const signals = world.publicSignals;
fire(doc,'divina:store-state',{ state:'product', search:'CANARY_AWAY' });
ok(world.publicSignals === signals + 1 && world.phase === 'rest', 'sinal externo não reabre a Loja');

doc.body.dataset.screen = 'store';
doc.screen.dataset.v608CommerceMode = 'intentions';
fire(doc,'divina:route-ready',{ id:'store' });
ok(world.route === 'store' && world.phase === 'intentions', 'retorno recupera somente o estado público');
ok(world.status().automaticNavigation === false && world.status().automaticWhitSpeech === false, 'sem ação automática');
ok(world.status().networkCalls === 0 && world.status().storageWrites === 0, 'sem rede ou escrita paralela');
ok(world.status().amazonStore.version === 543 && world.status().livingCommerce.version === 608 && world.status().chambers.version === 596, 'autoridades presentes');
ok(world.status().work14 === false, 'termina no WORK13');

world.destroy();
ok(doc.getElementById('divinaLojaWorldV622').removed === true, 'desmontagem remove o estilo');
ok(!doc.documentElement.dataset.work13LojaWorld, 'desmontagem remove a identidade');
ok(!doc.screen.dataset.lojaWorld && !doc.app.dataset.lojaWorld, 'desmontagem libera o mundo');

console.log(`PASS ${checks}/${checks} — runtime da Casa das Escolhas Vivas V622`);
