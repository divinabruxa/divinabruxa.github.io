import assert from 'node:assert/strict';
import {
  COSMOS_WORLD_PRESENCE_CONTRACT_V610,
  PUBLIC_WORLD_ROUTES_V610,
  CosmosWorldPresenceV610
} from './cosmos-world-presence-v610.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeNode extends EventTarget {
  constructor({ id = '', dataset = {}, text = '' } = {}) {
    super();
    this.id = id;
    this.dataset = dataset;
    this.textContent = text;
    this.attrs = new Map();
    this.removed = false;
    this.portals = [];
    this.parts = new Map();
  }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  removeAttribute(name) { this.attrs.delete(name); }
  remove() { this.removed = true; }
  querySelector(selector) {
    const part = this.parts.get(selector);
    return part?.removed ? null : part || null;
  }
  querySelectorAll(selector) {
    if (selector === '[data-v502-route]') return this.portals;
    if (selector === ':scope > span') {
      const label = this.parts.get('menu-label');
      return label && !label.removed ? [label] : [];
    }
    return [];
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.events = [];
    this.created = 0;
    this.documentElement = new FakeNode({ dataset:{} });
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.nodes = new Map();
    this.active = new FakeNode({ id:'home', dataset:{} });
    this.nodes.set('home', this.active);
    this.nodes.set('orb', new FakeNode({ id:'orb' }));
    this.nodes.set('orbCanvas', new FakeNode({ id:'orbCanvas' }));
    for (const route of PUBLIC_WORLD_ROUTES_V610) {
      this.nodes.set(route, new FakeNode({ id:route, dataset:{} }));
    }
    this.menuButton = new FakeNode({ id:'menuBtn' });
    this.menuButton.parts.set('menu-label', new FakeNode({ text:'ornamento' }));
    this.nodes.set('menuBtn', this.menuButton);
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById(id) { return this.nodes.get(id) || null; }
  querySelector(selector) {
    if (selector === '#app > .screen.active[id],.screen.active[id]') return this.active;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb') return [this.nodes.get('orb')];
    if (selector === '#orbCanvas') return [this.nodes.get('orbCanvas')];
    return [];
  }
  createElement() {
    this.created += 1;
    throw new Error('presence-must-not-create-dom');
  }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'#home' };
  }
}

const menuRoot = new FakeNode({ id:'divinaOrbitalMenuV502' });
for (const selector of ['.db502-menu__heading','.db502-menu__hint','.db502-menu__intention']) {
  menuRoot.parts.set(selector, new FakeNode({ text:'ornamento' }));
}
menuRoot.portals = PUBLIC_WORLD_ROUTES_V610.map(route => new FakeNode({ dataset:{ v502Route:route } }));

const doc = new FakeDocument();
doc.nodes.set('divinaOrbitalMenuV502', menuRoot);
const win = new FakeWindow();
const runtime = new CosmosWorldPresenceV610({
  documentTarget:doc,
  windowTarget:win,
  menuResolver:() => ({ root:menuRoot })
});

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const fire = (target, type, detail = {}) => {
  target.dispatchEvent(new FakeCustomEvent(type, { detail }));
};

ok(COSMOS_WORLD_PRESENCE_CONTRACT_V610.publicWorlds === 15, 'contrato com 15 realidades');
ok(COSMOS_WORLD_PRESENCE_CONTRACT_V610.touchesOrbEngine === false, 'Orbe intocada');
ok(COSMOS_WORLD_PRESENCE_CONTRACT_V610.touchesUniverseEngine === false, 'Universo intocado');
ok(doc.documentElement.dataset.work13FinalPresence === 'v610', 'presença instalada');
ok(doc.menuButton.getAttribute('aria-label') === 'Abrir o universo', 'menu sem rótulo ornamental');
ok(doc.menuButton.parts.get('menu-label').removed === true, 'ornamento do botão removido');
for (const selector of ['.db502-menu__heading','.db502-menu__hint','.db502-menu__intention']) {
  ok(menuRoot.parts.get(selector).removed === true, `${selector} removido`);
}
ok(menuRoot.getAttribute('aria-label') === 'Universo da Divina Bruxa', 'menu mantém nome acessível');
ok(menuRoot.portals.every(portal => portal.dataset.work13Portal === 'living'), 'balões marcados como vivos');

for (const route of PUBLIC_WORLD_ROUTES_V610) {
  const screen = doc.getElementById(route);
  ok(screen.dataset.work13World === route, `${route}: mundo próprio`);
  ok(Boolean(screen.dataset.work13WorldMode), `${route}: identidade própria`);
}

const initialAudit = runtime.audit();
ok(initialAudit.presentPublicWorlds === 15, 'quinze telas presentes');
ok(initialAudit.everyMenuDestinationHasFullScreen === true, 'todo balão tem destino completo');
ok(initialAudit.oneCanonicalOrb === true, 'uma Orbe');
ok(initialAudit.oneCanonicalCanvas === true, 'um canvas');
ok(initialAudit.duplicateOrbs === 0, 'nenhuma cópia da Orbe');

for (const route of PUBLIC_WORLD_ROUTES_V610) {
  fire(doc, 'divina:route-start', { from:runtime.route, to:route });
  ok(doc.documentElement.dataset.work13Passage === 'crossing', `${route}: travessia nasce`);
  ok(doc.getElementById(route).dataset.work13WorldPresence === 'approaching', `${route}: mundo se aproxima`);
  doc.body.dataset.screen = route;
  doc.active = doc.getElementById(route);
  fire(doc, 'divina:route-ready', { id:route });
  ok(doc.documentElement.dataset.work13Passage === 'silent', `${route}: chegada deixa silêncio`);
  ok(doc.getElementById(route).dataset.work13WorldPresence === 'present', `${route}: presença concluída`);
}

ok(runtime.status().passages === 15, 'quinze travessias registradas');
ok(runtime.status().route === 'notifications', 'última realidade alinhada');
ok(doc.events.filter(event => event.type === 'divina:world-present').length === 16, 'boot e chegadas respondem uma vez');
ok(doc.created === 0, 'nenhum nó criado em runtime');
ok(!doc.events.some(event => /navigate/i.test(event.type)), 'nenhuma navegação paralela');
ok(runtime.status().automaticNavigation === false, 'sem teleporte');
ok(runtime.status().work14 === false, 'termina no WORK13');

runtime.destroy();
ok(runtime.destroyed === true, 'runtime encerra limpo');
console.log(`PASS ${checks}/${checks} — presença e travessia das 15 realidades`);
