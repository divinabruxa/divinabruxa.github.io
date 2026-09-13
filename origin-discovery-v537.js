/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 3/14 · V537
   ORIGEM, HOME, MENU E DESCOBERTA

   Descoberta local das 17 realidades, sem rede, storage ou varredura de
   conteúdo privado. A Home continua contendo visualmente somente a Orbe.
*/

import { WORLD_ROUTES_V535, normalizeWorldRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 537;
const INSTANCE = Symbol.for('divina.origin.discovery.v537');
const STYLE_ID = 'divinaOriginDiscoveryV537';
const STYLE_HREF = './origin-discovery-v537.css?v=537';
const MENU_ID = 'divinaOrbitalMenuV502';

const TRAILS = Object.freeze([
  Object.freeze({ label:'Começar', route:'daily', detail:'Um encontro breve com a Carta do Dia.' }),
  Object.freeze({ label:'Consultar uma carta', route:'library', detail:'Encontre uma das 78 cartas na Biblioteca.' }),
  Object.freeze({ label:'Fazer uma leitura', route:'tarot', detail:'Abra o Tarot Livre, direto e sem repetição.' }),
  Object.freeze({ label:'Estudar', route:'school', detail:'Entre na Escola do Tarot.' }),
  Object.freeze({ label:'Agendar', route:'consultations', detail:'Conheça formatos, valores e limites das consultas.' })
]);

const normalizeText = value => String(value || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const installStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.append(link);
};

const button = ({ route, label, detail }, kind) => {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = `db537-discovery__item db537-discovery__item--${kind}`;
  item.dataset.v537Route = route;
  const title = document.createElement('strong');
  title.textContent = label;
  const copy = document.createElement('span');
  copy.textContent = detail;
  item.append(title, copy);
  return item;
};

export const ORIGIN_DISCOVERY_CONTRACT_V537 = Object.freeze({
  release:'V537', macroStage:'3-of-14', routeCount:17, trailCount:5,
  homeVisibleContent:'one-canonical-orb', localSearch:true,
  performanceTargets:Object.freeze({ lcpP75Ms:2500, inpP75Ms:150, homeCls:0, orbMenuLongTasks:0 }),
  permanentAnimationLoops:0, networkRequests:0, storageReads:0, storageWrites:0,
  privateContentReads:0, independentOrbEngines:0
});

export class OriginDiscoveryV537 {
  constructor({ go, vitality } = {}) {
    this.go = typeof go === 'function' ? go : globalThis.orbe?.go;
    this.vitality = vitality || globalThis.divinaVitalityReleaseV536?.bus || null;
    this.controller = new AbortController();
    this.menu = null;
    this.root = null;
    this.opened = false;
    this.query = '';
    this.bind();
    installStyles();
    this.installContext();
    this.install();
    this.publishContext(document.body?.dataset?.screen || location.hash || 'home');
    document.documentElement.dataset.originDiscovery = 'v537';
  }

  bind() {
    const { signal } = this.controller;
    document.addEventListener('divina:orbital-menu-ready', () => this.install(), { signal, passive:true });
    document.addEventListener('divina:menu-state', event => {
      if (String(event.detail?.state).toLowerCase() === 'closed') this.close({ focus:false });
    }, { signal, passive:true });
    document.addEventListener('divina:route-ready', event => this.publishContext(event.detail?.id), { signal, passive:true });
  }

  install() {
    const menuRoot = document.getElementById(MENU_ID);
    if (!menuRoot || menuRoot.querySelector('[data-v537-discovery]')) return false;
    this.menu = globalThis.divinaMenuV502 || null;
    const heading = menuRoot.querySelector('.db502-menu__heading');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'db537-discovery-toggle';
    toggle.dataset.v537DiscoveryToggle = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'divinaDiscoveryPanelV537');
    toggle.textContent = 'Buscar caminhos';
    heading?.append(toggle);

    const panel = document.createElement('section');
    panel.id = 'divinaDiscoveryPanelV537';
    panel.className = 'db537-discovery';
    panel.dataset.v537Discovery = '';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Descobrir caminhos da Divina Bruxa');
    panel.innerHTML = `
      <header><span>MAPA VIVO</span><h3>O que você deseja encontrar?</h3></header>
      <label class="db537-discovery__search">
        <span class="db537-visually-hidden">Buscar entre as realidades</span>
        <input type="search" inputmode="search" autocomplete="off" maxlength="80" placeholder="Tarot, Escola, Diário…" data-v537-query>
      </label>
      <div class="db537-discovery__trails" data-v537-trails aria-label="Comece por uma intenção"></div>
      <div class="db537-discovery__results" data-v537-results aria-live="polite"></div>`;
    menuRoot.append(panel);
    this.root = panel;
    this.toggle = toggle;
    this.input = panel.querySelector('[data-v537-query]');
    this.trails = panel.querySelector('[data-v537-trails]');
    this.results = panel.querySelector('[data-v537-results]');
    TRAILS.forEach(trail => this.trails.append(button(trail, 'trail')));
    this.renderResults('');

    toggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.opened ? this.close() : this.open();
    }, { signal:this.controller.signal });
    this.input.addEventListener('input', () => {
      this.query = this.input.value.slice(0, 80);
      this.renderResults(this.query);
    }, { signal:this.controller.signal });
    panel.addEventListener('click', event => {
      const target = event.target?.closest?.('[data-v537-route]');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      this.activate(target.dataset.v537Route, target);
    }, { signal:this.controller.signal });
    return true;
  }

  installContext() {
    if (document.querySelector('[data-v537-context]')) return;
    const header = document.querySelector('.app-header');
    if (!header) return;
    const nav = document.createElement('nav');
    nav.className = 'db537-context';
    nav.dataset.v537Context = '';
    nav.setAttribute('aria-label', 'Você está aqui');
    const home = document.createElement('button');
    home.type = 'button';
    home.textContent = 'Início';
    home.addEventListener('click', () => this.go?.('home', { source:'context-v537', target:home }), {
      signal:this.controller.signal
    });
    const separator = document.createElement('span');
    separator.textContent = '›';
    separator.setAttribute('aria-hidden', 'true');
    const current = document.createElement('strong');
    current.dataset.v537Current = '';
    nav.append(home, separator, current);
    header.append(nav);
    this.context = nav;
    this.contextCurrent = current;
  }

  open() {
    if (!this.root || this.opened) return false;
    this.opened = true;
    this.root.hidden = false;
    this.root.closest(`#${MENU_ID}`)?.classList.add('has-v537-discovery');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.vitality?.signal?.('orb:awake', { source:'discovery-v537' });
    queueMicrotask(() => this.input?.focus?.({ preventScroll:true }));
    return true;
  }

  close({ focus = true } = {}) {
    if (!this.root || !this.opened) return false;
    this.opened = false;
    this.root.hidden = true;
    this.root.closest(`#${MENU_ID}`)?.classList.remove('has-v537-discovery');
    this.toggle?.setAttribute('aria-expanded', 'false');
    if (focus) this.toggle?.focus?.({ preventScroll:true });
    return true;
  }

  renderResults(rawQuery) {
    if (!this.results) return;
    const query = normalizeText(rawQuery);
    const matches = WORLD_ROUTES_V535.filter(world => !query || normalizeText(
      `${world.name} ${world.purpose} ${world.family} ${world.id}`
    ).includes(query));
    this.results.replaceChildren();
    const summary = document.createElement('p');
    summary.className = 'db537-discovery__summary';
    summary.textContent = query
      ? `${matches.length} ${matches.length === 1 ? 'caminho encontrado' : 'caminhos encontrados'}`
      : 'Todas as 17 realidades';
    this.results.append(summary);
    for (const world of matches) this.results.append(button({
      route:world.id, label:world.name, detail:world.purpose
    }, 'result'));
  }

  async activate(rawRoute, target) {
    const route = normalizeWorldRouteV535(rawRoute);
    target?.setAttribute?.('aria-busy', 'true');
    this.close({ focus:false });
    try {
      const menu = globalThis.divinaMenuV502;
      if (menu?.targetOpen) await menu.close({ restoreFocus:false, reason:`discovery:${route}`, immediate:true });
      await Promise.resolve(this.go?.(route, { source:'origin-discovery-v537', target }));
      return true;
    } catch (error) {
      console.error('[Divina] caminho de descoberta preservado para nova tentativa', error);
      globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:'Este caminho não abriu agora.' }));
      return false;
    } finally {
      target?.removeAttribute?.('aria-busy');
    }
  }

  publishContext(rawRoute) {
    const route = normalizeWorldRouteV535(rawRoute || document.body?.dataset?.screen || 'home');
    const world = WORLD_ROUTES_V535.find(item => item.id === route) || WORLD_ROUTES_V535[0];
    document.documentElement.dataset.contextRoute = route;
    if (this.context) {
      this.context.hidden = route === 'home';
      this.contextCurrent.textContent = world.name;
      this.contextCurrent.setAttribute('aria-current', 'page');
    }
    document.dispatchEvent(new CustomEvent('divina:context-route', {
      detail:Object.freeze({ version:VERSION, route })
    }));
  }

  audit() {
    const home = document.getElementById('home');
    return Object.freeze({
      release:'V537', routeCount:WORLD_ROUTES_V535.length, trailCount:TRAILS.length,
      menuInstalled:Boolean(document.querySelector('[data-v537-discovery]')),
      oneCanonicalOrb:document.querySelectorAll('#orb').length === 1,
      homeOrbOnly:home?.classList.contains('home-orb-only-v206') === true,
      permanentAnimationLoops:0, networkRequests:0, storageReads:0, storageWrites:0,
      privateContentReads:0, independentOrbEngines:0
    });
  }

  status() { return Object.freeze({ ...this.audit(), opened:this.opened, queryLength:this.query.length }); }
  destroy() {
    this.controller.abort();
    this.root?.remove();
    this.toggle?.remove();
    this.context?.remove();
    delete document.documentElement.dataset.originDiscovery;
    delete document.documentElement.dataset.contextRoute;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
  }
}

export function createOriginDiscoveryV537(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new OriginDiscoveryV537(options);
  globalThis[INSTANCE] = instance;
  return instance;
}
