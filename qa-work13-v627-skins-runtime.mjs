import assert from 'node:assert/strict';
import {
  SKINS_WORLD_CONTRACT_V627,
  SkinsWorldV627,
  nextSkinPhaseV627,
  normalizeSkinPhaseV627,
  skinAccessStateV627
} from './skins-world-v627.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
}
class FakeClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
}
class FakeNode extends EventTarget {
  constructor() {
    super(); this.dataset = {}; this.hidden = false; this.disabled = false; this.textContent = '';
    this.src = ''; this.attributes = new Map(); this.classList = new FakeClassList(); this.focuses = 0;
    this.styleValues = new Map(); this.style = { setProperty:(key, value) => this.styleValues.set(key, value) };
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? (name === 'src' ? this.src || null : null); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.focuses += 1; }
}
class FakeRoot extends FakeNode {
  constructor(nodes) { super(); this.nodes = nodes; }
  querySelector(selector) { return this.nodes.get(selector) || null; }
}
class FakeDocument extends EventTarget {
  constructor() {
    super(); this.defaultView = { CustomEvent:FakeCustomEvent }; this.body = { dataset:{ screen:'skins' } };
    this.orb = new FakeNode(); this.canvas = new FakeNode(); this.skinsWorld = new FakeNode();
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return [this.orb];
    if (selector === '#orbCanvas') return [this.canvas];
    if (selector === '#skinsWorldV627') return [this.skinsWorld];
    return [];
  }
}
class FakeWindow extends EventTarget {
  constructor() { super(); this.CustomEvent = FakeCustomEvent; this.location = { hash:'#skins' }; }
}

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const contract = SKINS_WORLD_CONTRACT_V627;
ok(contract.version === 627 && contract.work === 'WORK13', 'release dentro do WORK13');
ok(contract.reality === 'skins' && contract.universe === 'atelie-dos-universos', 'mundo correto');
ok(contract.totalSkins === 30 && contract.freeSkins === 1 && contract.paidSkins === 29, 'catálogo 1 + 29');
ok(contract.individualPurchase && contract.premiumIncludesAllSkins, 'dois caminhos de direito');
ok(contract.priceTiersCents.join('|') === '1990|2990|3990|4990', 'quatro faixas oficiais');
ok(contract.cosmeticOnly && contract.tarotLogicChanges === 0 && contract.tarotResultChanges === 0, 'Tarot intocado');
ok(!contract.previewRequiresOwnership && !contract.previewGrantsEntitlement, 'prévia livre sem concessão');
ok(contract.entitlementAuthority === 'account-server-snapshot' && !contract.frontendEntitlementGrants, 'servidor é autoridade');
ok(contract.restoreAcrossDevices && contract.offlineActiveSkin && contract.fallbackSkin === 'classic', 'restauração e chão offline');
ok(contract.globalApplyWithoutReload && contract.canonicalSurfaces === 7, 'aplicação global sem reload');
ok(contract.oneCanonicalOrb && contract.oneCanonicalCanvas && contract.newOrbs === 0 && contract.newCanvases === 0, 'mesma Orbe e canvas');
ok(contract.nextReality === 'notifications' && contract.work14 === false, 'próxima realidade sem WORK14');

ok(normalizeSkinPhaseV627('anything') === 'focus' && normalizeSkinPhaseV627('gallery') === 'gallery', 'fase normalizada');
ok(nextSkinPhaseV627('focus', 'open') === 'gallery', 'Ateliê abre por ação');
ok(nextSkinPhaseV627('gallery', 'close') === 'focus' && nextSkinPhaseV627('gallery', 'leave') === 'focus', 'Ateliê recolhe');
const free = skinAccessStateV627({ id:'classic', activeId:'lunar', owned:[] });
const locked = skinAccessStateV627({ id:'lunar', activeId:'classic', owned:['classic'] });
const owned = skinAccessStateV627({ id:'lunar', activeId:'classic', owned:['classic', 'lunar'] });
const active = skinAccessStateV627({ id:'lunar', activeId:'lunar', owned:['classic', 'lunar'] });
ok(free.owned && !free.locked && free.action === 'apply', 'Clássica sempre pertence à coleção');
ok(locked.locked && locked.action === 'access', 'skin paga permanece bloqueada');
ok(owned.owned && !owned.active && owned.action === 'apply', 'skin adquirida pode ser vestida');
ok(active.active && active.action === 'active', 'skin ativa reconhecida');

const nodes = new Map();
for (const selector of [
  '.skw627-preview img', '[data-skw627-touch]', '[data-skw627-name]', '[data-skw627-state]',
  '[data-skw627-copy]', '[data-skw627-price]', '[data-skw627-apply]', '[data-skw627-open]',
  '#skw627DepthTitle', '[data-skw627-live]'
]) nodes.set(selector, new FakeNode());
const root = new FakeRoot(nodes);
const worldNode = new FakeNode();
const depth = new FakeNode(); depth.hidden = true;
const engineHost = new FakeNode(); engineHost.querySelector = () => null;
const documentTarget = new FakeDocument();
const windowTarget = new FakeWindow();
const pulses = []; const phases = []; const emitted = [];
for (const type of ['divina:skin-previewed', 'divina:skins-world-changed', 'divina:skins-continuity-checked']) {
  documentTarget.addEventListener(type, event => emitted.push({ type, detail:event.detail }));
}
let activeId = 'classic'; let prepared = 0; let chooseCalls = 0;
class FakeEngine {
  constructor(host) { this.host = host; this.owned = new Set(['classic']); this.render = () => true; }
  async choose(id) { chooseCalls += 1; if (!this.owned.has(id)) return false; activeId = id; return true; }
  destroy() { this.destroyed = true; }
}
const catalog = [
  { id:'classic', name:'Clássica Divina', priceCents:0, collection:'Essencial' },
  { id:'lunar', name:'Lunar Mistério', priceCents:1990, collection:'Lunar' }
];
const dependencies = {
  Engine:FakeEngine, catalog,
  activeSkin:() => activeId,
  skinById:id => ({ id, name:id === 'lunar' ? 'Lunar Mistério' : 'Clássica Divina', preview:`${id}.webp`, tokens:{ accent:'#a020f0', light:'#ffe08a' } }),
  prepareSkin:async () => { prepared += 1; return true; }
};
const world = Object.create(SkinsWorldV627.prototype);
Object.assign(world, {
  version:627, root, world:worldNode, depth, engineHost, documentTarget, windowTarget, dependencies, catalog,
  engine:null, engineRender:null, phase:'focus', selectedId:'classic', route:'skins', previewTouches:0,
  galleryOpens:0, applications:0, restoreSignals:0, dependencyFailures:0, destroyed:false, touchTimer:0,
  continuityBaseline:'', continuityRoutes:new Set(), continuityPasses:0, continuityConsistent:true,
  orbCore:{ pulse:(kind, detail) => pulses.push({ kind, detail }) },
  livingMedia:{ setPhase:(...args) => phases.push(args) }
});

ok(await world.ensureEngine(), 'motor existente é montado sob demanda');
ok(world.engine instanceof FakeEngine && world.engineHost.dataset.v627Engine === 'V201-preserved', 'motor V201 preservado');
ok(world.selectSkin('lunar'), 'skin pode ser contemplada');
await Promise.resolve();
ok(world.selectedId === 'lunar' && prepared === 1, 'prévia prepara apenas a imagem escolhida');
ok(!world.engine.owned.has('lunar') && emitted.at(-1).detail.grantsEntitlement === false, 'prévia não libera propriedade');
ok(world.feelPreview(), 'toque de contemplação aceito');
ok(world.previewTouches === 1 && pulses.at(-1).kind === 'skin-preview-touch', 'mesma Orbe responde ao toque');
ok(pulses.at(-1).detail.apply === false && pulses.at(-1).detail.navigate === false, 'toque não aplica nem navega');

ok(await world.openAtelier(), 'Ateliê abre explicitamente');
ok(world.phase === 'gallery' && !depth.hidden && world.galleryOpens === 1, 'profundidade revelada');
ok(nodes.get('[data-skw627-open]').attributes.get('aria-expanded') === 'true', 'estado expandido acessível');
ok(phases.at(-1)[1] === 'gallery' && phases.at(-1)[3] === true, 'camada viva recebe galeria explícita');

world.selectedId = 'lunar';
ok(!(await world.applySelected()), 'skin sem direito não é aplicada');
ok(activeId === 'classic' && !world.engine.owned.has('lunar') && chooseCalls === 1, 'bloqueio não muda direito nem forma');
world.engine.owned.add('lunar');
ok(await world.applySelected(), 'skin adquirida é aplicada');
ok(activeId === 'lunar' && chooseCalls === 2, 'motor canônico conclui a troca');

world.onApplied(new FakeCustomEvent('divina:skin-applied', { detail:{ id:'lunar' } }));
ok(world.applications === 1 && world.continuityBaseline === 'lunar', 'aplicação inicia prova de continuidade');
ok(pulses.at(-1).kind === 'skin-world-applied' && pulses.at(-1).detail.sameCanonicalOrb, 'Orbe canônica confirma aplicação');
ok(emitted.some(item => item.type === 'divina:skins-world-changed' && item.detail.reload === false), 'mudança global sem reload');
for (const id of ['home', 'tarot', 'daily']) world.onRoute({ detail:{ id } });
ok(world.continuityRoutes.size === 3 && world.continuityConsistent, 'três realidades mantêm a mesma skin');
world.onRoute({ detail:{ id:'skins' } });
ok(world.continuityPasses === 1 && world.continuityRoutes.size === 0, 'retorno ao Ateliê sela a continuidade');
ok(emitted.some(item => item.type === 'divina:skins-continuity-checked' && item.detail.realities === 3 && item.detail.consistent), 'prova de saída emitida');

world.phase = 'gallery'; depth.hidden = false;
world.onRoute({ detail:{ id:'journal' } });
ok(world.phase === 'focus' && depth.hidden, 'galeria recolhe ao sair da realidade');
ok(nodes.get('[data-skw627-open]').attributes.get('aria-expanded') === 'false', 'estado recolhido acessível');
const audit = world.audit();
ok(audit.oneCanonicalOrb && audit.oneCanonicalCanvas && audit.oneSkinsWorld, 'auditoria de singularidade');
ok(audit.duplicateOrbs === 0 && audit.duplicateCanvases === 0 && audit.newRenderers === 0, 'nenhuma duplicação ou renderizador');
ok(world.status().frontendEntitlementGrants === false && world.status().privateContentReads === 0, 'estado final seguro');
clearTimeout(world.touchTimer);

console.log(`PASS ${checks}/${checks} — runtime do Ateliê dos Universos V627`);
