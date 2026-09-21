import assert from 'node:assert/strict';
import { createCosmosEntryIntentionV610 } from './cosmos-entry-intention-v610.js';

class NodeLike extends EventTarget {
  constructor({ text = '', dataset = {} } = {}) {
    super(); this.textContent = text; this.dataset = dataset; this.attrs = {}; this.tabIndex = 0;
  }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}
const routes = ['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
const portals = routes.map(route => {
  const label = new NodeLike({ text:'antigo' });
  const portal = new NodeLike({ dataset:{ v502Route:route } });
  portal.querySelector = selector => selector === '.db502-portal__label' ? label : null;
  portal.label = label;
  return portal;
});
const homeLabel = new NodeLike({ text:'Origem' });
const menuRoot = new NodeLike();
menuRoot.querySelectorAll = selector => selector === '[data-v502-route]' ? portals : [];
menuRoot.querySelector = selector => selector === '.db502-menu__home-label' ? homeLabel : null;

const entry = new NodeLike({ text:'Entrá' });
const orb = new NodeLike();
const root = new NodeLike({ dataset:{} });
const doc = new NodeLike();
doc.documentElement = root;
doc.body = { dataset:{ screen:'home' } };
doc.getElementById = id => ({ cosmosEntryIntent:entry, orb, divinaOrbitalMenuV502:menuRoot })[id] || null;
const win = new NodeLike();
win.location = { hash:'#home' };
let calls = 0;
let cancellations = 0;
let pulses = 0;
const continuity = {
  cancelHomeTap() { cancellations += 1; return true; },
  callUniverse() { calls += 1; return true; }
};
const controller = createCosmosEntryIntentionV610({
  documentTarget:doc, windowTarget:win, continuity,
  orbCore:{ pulse() { pulses += 1; } },
  menuResolver:() => ({ root:menuRoot, open() { throw new Error('fallback indevido'); } })
});

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const fire = (target, type, detail = {}) => {
  const event = new Event(type, { cancelable:true });
  Object.defineProperty(event, 'detail', { value:detail });
  target.dispatchEvent(event);
};

ok(entry.attrs['aria-hidden'] === 'false', 'convite nasce visível');
ok(entry.tabIndex === 0, 'convite focável');
ok(entry.dataset.response === 'ready', 'convite nasce pronto para responder');
ok(controller.status().renamedRealities === 15, '15 realidades nomeadas');
ok(homeLabel.textContent === 'Início', 'centro retorna ao Início');
for (const portal of portals) {
  ok(portal.label.textContent === portal.attrs['aria-label'], `nome único de ${portal.dataset.v502Route}`);
  ok(portal.label.textContent !== 'antigo', `rótulo atualizado de ${portal.dataset.v502Route}`);
}

fire(entry, 'pointerdown');
ok(pulses === 1, 'resposta imediata ao toque em Entrá');
ok(entry.dataset.response === 'answering', 'o toque é respondido antes da abertura');
fire(entry, 'click', 1);
ok(cancellations === 1, 'espera anterior cancelada');
ok(calls === 1, 'universo chamado uma vez');
ok(controller.status().openCalls === 1, 'abertura registrada');
ok(entry.dataset.response === 'crossing', 'convite entrega a travessia');

fire(doc, 'divina:menu-state', { state:'opening' });
ok(entry.attrs['aria-hidden'] === 'true', 'convite recua ao nascer o menu');
ok(entry.tabIndex === -1, 'convite fora da ordem durante menu');
ok(entry.dataset.response === 'silent', 'resposta termina em silêncio');
fire(doc, 'divina:menu-state', { state:'closed' });
ok(entry.attrs['aria-hidden'] === 'false', 'convite retorna com a Orbe');

fire(orb, 'pointerdown');
ok(pulses === 2, 'Orbe responde imediatamente sem outro gesto');
ok(entry.dataset.response === 'answering', 'toque na Orbe acende a mesma entrada');
fire(orb, 'pointerup');
ok(entry.dataset.response === 'ready', 'gesto da Orbe termina sem estado preso');
ok(calls === 1, 'pointerdown não duplica a navegação existente');
ok(controller.status().oneCanonicalOrb === true, 'mesma Orbe canônica');
ok(controller.status().work14 === false, 'correção termina no WORK13');

let worldMenuOpens = 0;
controller.menuResolver = () => ({ root:menuRoot, open() { worldMenuOpens += 1; return true; } });
for (const route of routes) {
  fire(doc, 'divina:route-ready', { id:route });
  ok(controller.route === route, `Orbe acompanha ${route}`);
  ok(controller.openUniverse('orb-world') === true, `menu abre em ${route}`);
  fire(doc, 'divina:menu-state', { state:'open' });
  ok(controller.openUniverse('orb-world') === false, `sem abertura duplicada em ${route}`);
  fire(doc, 'divina:menu-state', { state:'closed' });
}
ok(worldMenuOpens === routes.length, 'uma abertura por realidade');
ok(controller.status().worldOpenCalls === routes.length, 'ciclo global auditável');
ok(controller.status().openFailures === 0, 'nenhuma falha de abertura');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para abrir o universo', 'Orbe anuncia o caminho global');
const tarotOrbTarget = {
  closest(selector) {
    if (selector === '#orb') return orb;
    if (selector === '#tableOrb') return { id:'tableOrb' };
    return null;
  }
};
fire(doc, 'divina:route-ready', { id:'tarot' });
ok(controller.isCanonicalOrbTarget(tarotOrbTarget) === true, 'alvo usa a Orbe canônica');
ok(controller.isRealityOwnedOrbTarget(tarotOrbTarget) === true, 'Tarot mantém o toque de revelar');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para revelar a próxima carta', 'Orbe anuncia a ação do Tarot');

const dailyOrbTarget = {
  closest(selector) {
    if (selector === '#orb') return orb;
    if (selector === '[data-daily-orb-host]') return { dataset:{ dailyOrbHost:'' } };
    return null;
  }
};
fire(doc, 'divina:route-ready', { id:'daily' });
ok(controller.isCanonicalOrbTarget(dailyOrbTarget) === true, 'Carta do Dia usa a Orbe canônica');
ok(controller.isRealityOwnedOrbTarget(dailyOrbTarget) === true, 'Carta do Dia mantém o toque ritual');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para abrir a Carta do Dia', 'Orbe anuncia o rito diário');

const spreadResult = { id:'spreadResult' };
const spreadsOrbTarget = {
  closest(selector) {
    if (selector === '#orb') return orb;
    if (selector === '#spreadResult') return spreadResult;
    return null;
  }
};
orb.closest = selector => selector === '#spreadResult' ? spreadResult : null;
fire(doc, 'divina:route-ready', { id:'spreads' });
ok(controller.isCanonicalOrbTarget(spreadsOrbTarget) === true, 'Tiragens usam a Orbe canônica');
ok(controller.isRealityOwnedOrbTarget(spreadsOrbTarget) === true, 'Tiragens mantêm o toque de revelar');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para revelar a próxima posição', 'Orbe anuncia a próxima posição');

const libraryHost = { dataset:{ libraryOrbHost:'' } };
const libraryOrbTarget = {
  closest(selector) {
    if (selector === '#orb') return orb;
    if (selector === '[data-library-orb-host]') return libraryHost;
    return null;
  }
};
orb.closest = selector => selector === '[data-library-orb-host], #cardLibraryApp [data-orb]' ? libraryHost : null;
fire(doc, 'divina:route-ready', { id:'library' });
ok(controller.isCanonicalOrbTarget(libraryOrbTarget) === true, 'Biblioteca usa a Orbe canônica');
ok(controller.isRealityOwnedOrbTarget(libraryOrbTarget) === true, 'Biblioteca mantém o toque de descobrir');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para descobrir uma carta', 'Orbe anuncia a descoberta');
fire(doc, 'divina:orb-physical-claim-settled', { route:'library' });
ok(root.dataset.work13EntryReason === 'orb-claim-settled', 'rótulo acompanha a chegada física da Orbe');

controller.destroy();
console.log(`PASS ${checks}/${checks} — resposta, menu vivo e nomes públicos`);
