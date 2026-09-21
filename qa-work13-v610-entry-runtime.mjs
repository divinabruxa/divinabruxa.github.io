import assert from 'node:assert/strict';
import { createCosmosEntryIntentionV610 } from './cosmos-entry-intention-v610.js';

class NodeLike extends EventTarget {
  constructor({ text = '', dataset = {} } = {}) {
    super(); this.textContent = text; this.dataset = dataset; this.attrs = {}; this.tabIndex = 0;
  }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  append(node) { this.appended = node; node.parentElement = this; }
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

const entry = new NodeLike({ text:'' });
const pentagram = new NodeLike();
entry.querySelector = selector => selector === 'img' ? pentagram : null;
entry.parentElement = new NodeLike();
const orb = new NodeLike();
const root = new NodeLike({ dataset:{} });
const journalScreen = new NodeLike({ dataset:{ db596ChamberState:'threshold' } });
const doc = new NodeLike();
doc.documentElement = root;
doc.body = new NodeLike({ dataset:{ screen:'home' } });
doc.getElementById = id => ({ cosmosEntryIntent:entry, orb, journal:journalScreen, divinaOrbitalMenuV502:menuRoot })[id] || null;
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
ok(entry.dataset.work13MenuSymbol === 'pentagram-v613', 'pentagrama assume o gesto do menu global');
ok(entry.dataset.work13MenuPosition === 'top-corner', 'pentagrama vive no canto superior');
ok(entry.dataset.work13MenuRole === 'global-toggle', 'pentagrama abre e fecha o campo vivo');
ok(entry.parentElement === doc.body, 'pentagrama movido para a camada global');
ok(entry.attrs['aria-label'] === 'Abrir o menu mágico', 'pentagrama tem nome acessível sem texto visível');
ok(controller.status().pentagramReady === true, 'imagem do pentagrama pronta');
ok(controller.status().visibleEntryWords === 0, 'nenhuma palavra de entrada visível');
ok(controller.status().globalPentagram === true, 'pentagrama disponível em todas as realidades');
ok(controller.status().globalMenuOnEveryPage === true, 'menu pertence a todas as páginas');
ok(controller.status().pentagramVisibleWhileMenuOpen === true, 'pentagrama permanece dentro do ciclo do menu');
ok(controller.status().pentagramTogglesMenu === true, 'mesmo gesto abre e fecha');
ok(controller.status().arrivalStateRecovery === true, 'chegada acorda o menu novamente');
ok(controller.status().maximumVisibleIntentions === 2, 'duas realidades respiram por vez');
ok(controller.status().menuLife === 'birth-breath-answer-silence', 'menu tem nascimento, respiração, resposta e silêncio');
ok(controller.status().movedGlobal === true, 'camada global confirmada');
ok(controller.status().renamedRealities === 15, '15 realidades nomeadas');
ok(homeLabel.textContent === 'Início', 'centro retorna ao Início');
for (const portal of portals) {
  ok(portal.label.textContent === portal.attrs['aria-label'], `nome único de ${portal.dataset.v502Route}`);
  ok(portal.label.textContent !== 'antigo', `rótulo atualizado de ${portal.dataset.v502Route}`);
}
const whitPortal = portals.find(portal => portal.dataset.v502Route === 'ai');
ok(whitPortal.label.textContent === 'Whit', 'Whit vive como realidade do menu');
ok(whitPortal.dataset.work13Whit === 'inside-canonical-orb', 'Whit permanece dentro da Orbe canônica');

fire(entry, 'pointerdown');
ok(pulses === 1, 'resposta imediata ao toque no pentagrama');
ok(entry.dataset.response === 'answering', 'o toque é respondido antes da abertura');
fire(entry, 'click', 1);
ok(cancellations === 1, 'espera anterior cancelada');
ok(calls === 1, 'universo chamado uma vez');
ok(controller.status().openCalls === 1, 'abertura registrada');
ok(entry.dataset.response === 'crossing', 'convite entrega a travessia');

fire(doc, 'divina:menu-state', { state:'opening' });
ok(entry.attrs['aria-hidden'] === 'false', 'pentagrama permanece visível dentro do menu');
ok(entry.tabIndex === 0, 'pentagrama continua alcançável durante o menu');
ok(entry.dataset.response === 'menu-open', 'pentagrama reconhece o campo aberto');
ok(entry.attrs['aria-label'] === 'Fechar o menu mágico', 'gesto aberto anuncia o fechamento');
ok(entry.attrs['aria-expanded'] === 'true', 'estado expandido exposto');
let closesFromPentagram = 0;
controller.menuResolver = () => ({
  root:menuRoot, state:'opening', targetOpen:true,
  open() { throw new Error('menu já aberto'); },
  close() { closesFromPentagram += 1; return true; }
});
fire(entry, 'click', 1);
ok(closesFromPentagram === 1, 'mesmo pentagrama fecha o menu');
ok(controller.status().closeCalls === 1, 'fechamento global auditável');
ok(entry.dataset.response === 'closing', 'fechamento responde sem corte seco');
fire(doc, 'divina:menu-state', { state:'closed' });
ok(entry.attrs['aria-hidden'] === 'false', 'convite retorna com a Orbe');
ok(entry.attrs['aria-label'] === 'Abrir o menu mágico', 'gesto fechado volta a anunciar abertura');

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
  ok(entry.attrs['aria-hidden'] === 'false', `pentagrama permanece disponível em ${route}`);
  ok(controller.openUniverse('orb-world') === true, `menu abre em ${route}`);
  fire(doc, 'divina:menu-state', { state:'open' });
  ok(entry.attrs['aria-hidden'] === 'false', `pentagrama permanece no menu de ${route}`);
  ok(entry.dataset.response === 'menu-open', `campo vivo reconhecido em ${route}`);
  ok(controller.openUniverse('orb-world') === false, `sem abertura duplicada em ${route}`);
  fire(doc, 'divina:menu-state', { state:'closed' });
}
ok(worldMenuOpens === routes.length, 'uma abertura por realidade');
ok(controller.status().worldOpenCalls === routes.length, 'ciclo global auditável');
ok(controller.status().openFailures === 0, 'nenhuma falha de abertura');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para abrir o universo', 'Orbe anuncia o caminho global');

root.dataset.work12State = 'arrive';
entry.dataset.response = 'silent';
fire(doc, 'divina:route-ready', { id:'tarot' });
ok(entry.attrs['aria-hidden'] === 'true', 'pentagrama aguarda a chegada física terminar');
root.dataset.work12State = 'rest';
fire(doc, 'divina:work12-state', { state:'REST', route:'tarot' });
ok(entry.attrs['aria-hidden'] === 'false', 'estado REST devolve o menu ao Tarot');
ok(entry.dataset.response === 'ready', 'estado silencioso antigo não prende o pentagrama');
entry.parentElement = new NodeLike();
fire(win, 'pageshow');
ok(entry.parentElement === doc.body, 'pageshow recoloca o menu na camada global');
ok(controller.status().rehomes === 2, 'reconexão global registrada sem duplicar o nó');

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
ok(controller.isRealityOwnedOrbTarget(orb) === true, 'Orbe do host físico também pertence ao Tarot');
ok(controller.status().tarotOrbAction === 'reveal-only', 'ação da Orbe no Tarot é somente revelar');
ok(controller.status().tarotOrbOpensMenu === false, 'Orbe do Tarot nunca abre o menu');
ok(controller.status().tarotOrbMenuListenersBypassed === true, 'listeners do menu cedem o gesto ao Tarot');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para revelar a próxima carta', 'Orbe anuncia a ação do Tarot');
const pulsesBeforeTarot = pulses;
fire(orb, 'pointerdown');
ok(pulses === pulsesBeforeTarot, 'pointerdown do Tarot não pulsa o menu global');
const tarotMenuOpensBeforeClick = worldMenuOpens;
const tarotClick = new Event('click', { cancelable:true });
Object.defineProperty(tarotClick, 'target', { value:tarotOrbTarget });
doc.dispatchEvent(tarotClick);
ok(tarotClick.defaultPrevented === false, 'clique revelador do Tarot não é cancelado');
ok(worldMenuOpens === tarotMenuOpensBeforeClick, 'clique revelador do Tarot não abre o menu');

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

const journalHost = { dataset:{ v585OrbHost:'' } };
const journalOrbTarget = {
  closest(selector) {
    if (selector === '#orb') return orb;
    if (selector === '[data-v585-orb-host]') return journalHost;
    return null;
  }
};
orb.closest = selector => selector === '[data-v585-orb-host]' ? journalHost : null;
fire(doc, 'divina:route-ready', { id:'journal' });
ok(controller.isCanonicalOrbTarget(journalOrbTarget) === true, 'Diário usa a Orbe canônica');
ok(controller.isRealityOwnedOrbTarget(journalOrbTarget) === true, 'limiar do Diário mantém o toque de entrar');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para entrar e escrever no Diário', 'Orbe anuncia a escrita direta');
journalScreen.dataset.db596ChamberState = 'engaged';
fire(doc, 'divina:orb-physical-claim-settled', { route:'journal' });
ok(controller.isRealityOwnedOrbTarget(journalOrbTarget) === false, 'depois do mergulho a Orbe recupera o menu global');
ok(orb.attrs['aria-label'] === 'Orbe viva. Toque para abrir o universo', 'ciclo global retorna após entrar');

fire(doc, 'divina:route-ready', { id:'home' });
controller.continuity = { cancelHomeTap() { return true; }, callUniverse() { return false; } };
controller.menuResolver = () => null;
ok(controller.openUniverse('pentagram-before-menu') === true, 'toque não morre enquanto o menu acorda');
ok(controller.status().pendingOpen === true, 'intenção de abertura fica guardada');
let delayedOpen = 0;
controller.menuResolver = () => ({ root:menuRoot, open() { delayedOpen += 1; return true; } });
fire(doc, 'divina:orbital-menu-ready');
ok(delayedOpen === 1, 'menu abre assim que os balões ficam prontos');
ok(controller.status().pendingOpen === false, 'fila de abertura termina limpa');

controller.destroy();
console.log(`PASS ${checks}/${checks} — resposta, menu vivo e nomes públicos`);
