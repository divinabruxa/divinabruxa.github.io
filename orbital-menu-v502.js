/* DIVINA BRUXA 2.0 — ESSÊNCIA SUPREMA · MENU ORBITAL · V579
   O desenho V502 permanece intacto. A V579 unifica somente a autoridade,
   o estado, o foco e a reversão do movimento já aprovado.
*/

const VERSION = 579;
const AUTHORITY = 'v579';
const INSTANCE = Symbol.for('divina.orbital.menu.v579');
const ROOT_ID = 'divinaOrbitalMenuV502';
const STYLE_ID = 'divinaOrbitalMenuV502Styles';
const STYLE_HREF = './orbital-menu-v502.css?v=551-ios-motion';
const OPEN_MS = 300;
const CLOSE_MS = 180;
const MENU_STATE = Object.freeze({
  CLOSED:'closed',
  OPENING:'opening',
  OPEN:'open',
  REVERSING:'reversing',
  CLOSING:'closing',
  NAVIGATING:'navigating'
});
const MOVING_STATES = new Set([MENU_STATE.OPENING, MENU_STATE.REVERSING, MENU_STATE.CLOSING]);

const INNER = Object.freeze([
  { route:'tarot', label:'Tarot Livre', icon:'tarot' },
  { route:'daily', label:'Carta do Dia', icon:'moon' },
  { route:'spreads', label:'Tiragens', icon:'spread' },
  { route:'school', label:'Escola', icon:'book' },
  { route:'library', label:'Biblioteca', icon:'library' },
  { route:'journal', label:'Diário', spoken:'Diário e Espelho', icon:'mirror' }
]);

const OUTER = Object.freeze([
  { route:'ai', label:'Orbe IA', spoken:'Whit, Orbe IA', icon:'spark' },
  { route:'store', label:'Loja', icon:'bag' },
  { route:'consultations', label:'Consultas', icon:'message' },
  { route:'music', label:'Música', icon:'music' },
  { route:'videos', label:'Vídeo', icon:'play' },
  { route:'skins', label:'Skins', icon:'gem' },
  { route:'login', label:'Conta', icon:'user' }
]);

const ICONS = Object.freeze({
  tarot:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 8h6M12 6v10M9 14h6"/>',
  moon:'<path d="M18.5 15.2A8 8 0 0 1 8.8 5.5 7.7 7.7 0 1 0 18.5 15.2Z"/><path d="m17.5 5 .5 1.2 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5Z"/>',
  spread:'<rect x="3.5" y="7" width="7" height="12" rx="1.4"/><rect x="13.5" y="7" width="7" height="12" rx="1.4"/><path d="M8 5.2 12 3l4 2.2M7 11h.01M17 11h.01"/>',
  book:'<path d="M4 5.5c3.2-.7 5.8.1 8 2v12c-2.2-1.9-4.8-2.7-8-2V5.5Z"/><path d="M20 5.5c-3.2-.7-5.8.1-8 2v12c2.2-1.9 4.8-2.7 8-2V5.5Z"/>',
  library:'<path d="M5 4v16M9 4v16M14 5v15M18 4l2 15"/><path d="M3 20h18M5 8h4M14 9h4"/>',
  mirror:'<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M12 17v4M9 21h6M9 8c1-1.5 3-2.2 5-1.3"/>',
  spark:'<circle cx="12" cy="12" r="5.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/><circle cx="12" cy="12" r="1.3"/>',
  bag:'<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  message:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
  music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  play:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/>',
  gem:'<path d="m12 3 8 6-8 12L4 9l8-6Z"/><path d="m4 9 8 3 8-3M12 3v18"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'
});

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const safeFocus = node => {
  if (!(node instanceof HTMLElement) || !node.isConnected) return false;
  try { node.focus({ preventScroll:true }); }
  catch { try { node.focus(); } catch { return false; } }
  return document.activeElement === node;
};

function routeNow() {
  return String(
    document.body?.dataset?.screen ||
    document.querySelector('#app > .screen.active[id], .screen.active[id]')?.id ||
    location.hash.replace(/^#/, '') ||
    'home'
  ).toLowerCase();
}

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.orbitalMenuStyle = 'v502';
  document.head.append(link);
}

function iconMarkup(name) {
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${ICONS[name] || ICONS.spark}</svg>`;
}

function portalMarkup(item, ring, index, count) {
  const start = ring === 'inner' ? -90 : (-90 + (180 / count));
  const angle = start + ((360 / count) * index);
  const inverse = -angle;
  const spoken = item.spoken || item.label;
  return `<button type="button" class="db502-portal db502-portal--${ring}" data-v502-route="${item.route}" data-go="${item.route}" aria-label="${spoken}" style="--portal-i:${index};--portal-angle:${angle}deg;--portal-inverse:${inverse}deg"><span class="db502-portal__jewel">${iconMarkup(item.icon)}<i aria-hidden="true"></i></span><span class="db502-portal__label">${item.label}</span></button>`;
}

function createScene() {
  const root = document.createElement('section');
  root.id = ROOT_ID;
  root.className = 'db502-menu';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'db502MenuTitle');
  root.setAttribute('aria-describedby', 'db502MenuHint');
  root.innerHTML = `
    <div class="db502-menu__backdrop" data-v502-close="backdrop" aria-hidden="true"></div>
    <div class="db502-menu__cosmos" aria-hidden="true"></div>
    <header class="db502-menu__heading">
      <span>ORBE DAS REALIDADES</span>
      <h2 id="db502MenuTitle">Escolha uma realidade</h2>
    </header>
    <div class="db502-menu__orbit db502-menu__orbit--outer" aria-hidden="true"></div>
    <div class="db502-menu__orbit db502-menu__orbit--inner" aria-hidden="true"></div>
    <nav class="db502-menu__portals" aria-label="Realidades da Divina Bruxa">
      ${INNER.map((item, index) => portalMarkup(item, 'inner', index, INNER.length)).join('')}
      ${OUTER.map((item, index) => portalMarkup(item, 'outer', index, OUTER.length)).join('')}
    </nav>
    <div class="db502-menu__center" data-v502-orb-host>
      <span class="db502-menu__aura" aria-hidden="true"></span>
      <span class="db502-menu__halo" aria-hidden="true"></span>
    </div>
    <p class="db502-menu__hint" id="db502MenuHint">Toque em um portal. A Orbe abre o caminho.</p>
    <span class="db502-menu__live" role="status" aria-live="polite" aria-atomic="true"></span>`;

  /* O Universo Vivo V524 já existe atrás de todas as realidades. Não criamos
     uma segunda constelação no menu: a mesma matéria celeste permanece viva. */
  return root;
}

function nativePulse(style = 'Light') {
  try {
    const capacitor = globalThis.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return;
    Promise.resolve(capacitor.Plugins?.Haptics?.impact?.({ style })).catch(() => {});
  } catch {
    // Resposta tátil é exclusiva do aplicativo nativo e sempre opcional.
  }
}

function retireFormerMenus() {
  const globals = [
    'divinaMenuV502',
    'divinaMenuV340','divinaMenuV339','divinaMenuV338','divinaMenuV337',
    'divinaMenuV336','divinaMenuV335','divinaMenuV334','divinaMenuV333',
    'divinaMenuV332','divinaMenuV329','divinaMenuA11yV327','divinaMenuA11yV211'
  ];
  for (const key of globals) {
    try { globalThis[key]?.destroy?.(); } catch {}
  }
  const ids = [
    'menuOrbLockV340','menuOrbVisibleV339','menuOneMotionV338','menuSceneV337',
    'menuSceneV336','menuSceneV335','menuCelestialV334','menuFluidV333',
    'menuRebornV332','menuRebornV329'
  ];
  ids.forEach(id => document.getElementById(id)?.remove());
  document.documentElement.classList.remove('db-menu-open', 'db-menu-transitioning');
  document.body?.classList.remove('db-menu-open', 'db-menu-transitioning');
}

export class OrbitalMenuV502 {
  constructor({ core, go } = {}) {
    this.core = core || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.go = typeof go === 'function'
      ? go
      : globalThis.divinaOrbSupremeV501?.navigate || globalThis.orbe?.go || null;
    this.menuButton = document.querySelector('#menuBtn, [data-menu-toggle], [data-open-menu]');
    this.legacy = document.querySelector('#orbMenu');
    this.dockOrb = document.querySelector('.magic-dock .dock-orb, .dock-orb');
    if (!this.core?.claim || !this.core?.navigate || !this.go || !this.menuButton) {
      throw new Error('A Orbe Suprema V501 ou o botão do menu não foi encontrado.');
    }

    retireFormerMenus();
    installStyles();
    document.getElementById(ROOT_ID)?.remove();
    this.root = createScene();
    document.body.append(this.root);
    this.host = this.root.querySelector('[data-v502-orb-host]');
    this.live = this.root.querySelector('.db502-menu__live');
    this.buttons = [...this.root.querySelectorAll('[data-v502-route]')];
    this.abort = new AbortController();
    this.state = MENU_STATE.CLOSED;
    this.targetOpen = false;
    this.releaseOrb = null;
    this.lastFocus = null;
    this.motionToken = 0;
    this.navigating = false;
    this.backgroundLocked = false;
    this.backgroundSnapshots = [];
    this.fallbackTabSnapshots = [];
    this.supportsInert = typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

    document.documentElement.dataset.menuAuthority = AUTHORITY;
    this.menuButton.setAttribute('aria-controls', ROOT_ID);
    this.menuButton.setAttribute('aria-haspopup', 'dialog');
    this.legacy?.setAttribute('aria-hidden', 'true');
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = true;
    this.setRootInteractive(false);

    this.bind();
    this.syncRoute(routeNow());
    this.setMenuButton(false);
    this.publish(MENU_STATE.CLOSED, 'install');
  }

  isActive() {
    return this.state !== MENU_STATE.CLOSED || this.targetOpen || this.navigating;
  }

  setRootInteractive(interactive) {
    if (!this.root) return;
    if (this.supportsInert) this.root.inert = !interactive;
    if (interactive) this.root.removeAttribute('inert');
    else this.root.setAttribute('inert', '');
  }

  lockBackground() {
    if (this.backgroundLocked) return;
    this.backgroundLocked = true;
    const nodes = [
      document.querySelector('#app'),
      document.querySelector('.magic-dock'),
      document.querySelector('.app-header .brand'),
      document.querySelector('.v562-skip-link'),
      document.querySelector('#drawer')
    ].filter(node => node instanceof HTMLElement && node !== this.root && !this.root.contains(node));

    this.backgroundSnapshots = nodes.map(node => ({
      node,
      ariaExisted:node.hasAttribute('aria-hidden'),
      ariaValue:node.getAttribute('aria-hidden'),
      inertExisted:node.hasAttribute('inert'),
      inertValue:Boolean(node.inert)
    }));

    for (const node of nodes) {
      node.setAttribute('aria-hidden', 'true');
      if (this.supportsInert) {
        node.inert = true;
        node.setAttribute('inert', '');
        continue;
      }
      const candidates = [node, ...node.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')];
      for (const candidate of candidates) {
        if (!(candidate instanceof HTMLElement)) continue;
        this.fallbackTabSnapshots.push({
          node:candidate,
          existed:candidate.hasAttribute('tabindex'),
          value:candidate.getAttribute('tabindex')
        });
        candidate.setAttribute('tabindex', '-1');
      }
    }
    document.documentElement.dataset.menuModal = AUTHORITY;
  }

  unlockBackground() {
    if (!this.backgroundLocked) return;
    this.backgroundLocked = false;
    for (const snapshot of this.backgroundSnapshots) {
      const { node } = snapshot;
      if (!node?.isConnected) continue;
      if (snapshot.ariaExisted) node.setAttribute('aria-hidden', snapshot.ariaValue ?? '');
      else node.removeAttribute('aria-hidden');
      if (this.supportsInert) {
        node.inert = snapshot.inertValue;
        if (snapshot.inertExisted) node.setAttribute('inert', '');
        else node.removeAttribute('inert');
      }
    }
    for (const snapshot of this.fallbackTabSnapshots) {
      if (!snapshot.node?.isConnected) continue;
      if (snapshot.existed) snapshot.node.setAttribute('tabindex', snapshot.value ?? '');
      else snapshot.node.removeAttribute('tabindex');
    }
    this.backgroundSnapshots = [];
    this.fallbackTabSnapshots = [];
    delete document.documentElement.dataset.menuModal;
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest('#menuBtn, [data-menu-toggle], [data-open-menu]') === this.menuButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (this.navigating) return;
        if (this.targetOpen) this.close({ restoreFocus:true, reason:'menu-button' });
        else this.open();
        return;
      }

      if (this.isActive() && !this.root.contains(target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const dockOrb = target.closest('.magic-dock .dock-orb, .dock-orb');
      if (!this.isActive() && dockOrb && dockOrb === this.dockOrb && !this.root.contains(dockOrb)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.core.pulse?.('portal', { intensity:0.78 });
        nativePulse('Light');
        this.core.navigate('ai', { source:'footer-orb-v502', target:dockOrb }).catch?.(() => {});
        return;
      }

      if (!this.targetOpen || !this.root.contains(target)) return;

      const portal = target.closest('[data-v502-route]');
      if (portal) {
        if (![MENU_STATE.OPENING, MENU_STATE.OPEN, MENU_STATE.REVERSING].includes(this.state)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.activate(portal);
        return;
      }

      const closer = target.closest('[data-v502-close]');
      if (closer) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close({ restoreFocus:true, reason:closer.dataset.v502Close });
      }
    }, { capture:true, signal });

    document.addEventListener('pointerdown', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (this.isActive() && !this.root.contains(target) && !this.menuButton.contains(target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (!this.targetOpen || !this.root.contains(target)) return;
      const portal = target.closest('[data-v502-route]');
      if (!portal) return;
      portal.classList.add('is-touching');
      this.core.prime?.(portal.dataset.v502Route, { source:'menu-touch-v517', target:portal });
      const clear = () => portal.classList.remove('is-touching');
      portal.addEventListener('pointerup', clear, { once:true });
      portal.addEventListener('pointercancel', clear, { once:true });
      setTimeout(clear, 520);
    }, { capture:true, passive:false, signal });

    document.addEventListener('focusin', event => {
      const portal = event.target?.closest?.('[data-v502-route]');
      if (this.targetOpen && portal) {
        this.core.prime?.(portal.dataset.v502Route, { source:'menu-focus-v502', target:portal });
      }
      const target = event.target instanceof Node ? event.target : null;
      if (!this.isActive() || !target || target === this.menuButton || this.menuButton.contains(target) || this.root.contains(target)) return;
      queueMicrotask(() => safeFocus(this.targetOpen ? this.core.orb : this.menuButton));
    }, { signal });

    document.addEventListener('keydown', event => {
      if (!this.isActive()) return;
      if (event.key === 'Escape' && this.targetOpen && !this.navigating) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close({ restoreFocus:true, reason:'escape' });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [this.menuButton, this.core.orb, ...this.buttons]
        .filter(node => node instanceof HTMLElement && node.isConnected && !node.hidden && !node.hasAttribute('disabled') && !node.closest('[inert]'));
      if (!focusable.length) return;
      event.preventDefault();
      const current = focusable.indexOf(document.activeElement);
      const direction = event.shiftKey ? -1 : 1;
      const next = current < 0
        ? (event.shiftKey ? focusable.length - 1 : 0)
        : (current + direction + focusable.length) % focusable.length;
      safeFocus(focusable[next]);
    }, { capture:true, signal });

    document.addEventListener('divina:route-ready', event => {
      this.syncRoute(event.detail?.id || routeNow());
    }, { signal });
    document.addEventListener('divina:page-ready', event => {
      if (event.detail?.id) this.syncRoute(event.detail.id);
    }, { signal });
    document.addEventListener('divina:supreme-orb-will-navigate', () => {
      if (this.isActive() && !this.navigating) {
        this.navigating = true;
        this.close({
          restoreFocus:false,
          reason:'orb-navigation',
          preserveClaim:true,
          navigating:true
        });
      }
    }, { signal });
    document.addEventListener('divina:supreme-orb-did-navigate', () => {
      if (this.navigating) this.finishNavigation('orb-navigation-complete');
    }, { signal });
    document.addEventListener('divina:supreme-orb-navigation-error', () => {
      if (this.navigating) this.finishNavigation('orb-navigation-error');
    }, { signal });
  }

  setMenuButton(open) {
    this.menuButton.classList.toggle('is-open', open);
    this.menuButton.setAttribute('aria-expanded', String(open));
    this.menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    const label = this.menuButton.querySelector('span');
    if (label && /^menu$|^fechar$/i.test(label.textContent?.trim() || '')) {
      label.textContent = open ? 'FECHAR' : 'MENU';
    }
  }

  publish(state, reason) {
    const previous = this.state;
    this.state = state;
    this.root.dataset.state = state;
    document.documentElement.dataset.menuState = state;
    document.dispatchEvent(new CustomEvent('divina:menu-state', {
      detail:Object.freeze({ version:VERSION, authority:AUTHORITY, previous, state, targetOpen:this.targetOpen, reason })
    }));
  }

  async open() {
    if (this.navigating || this.targetOpen) return false;
    const reversing = !this.targetOpen && MOVING_STATES.has(this.state);
    this.targetOpen = true;
    const token = ++this.motionToken;
    if (!reversing) this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : this.menuButton;
    this.setMenuButton(true);
    this.publish(reversing ? MENU_STATE.REVERSING : MENU_STATE.OPENING, reversing ? 'reverse-open' : 'request-open');

    /* O quadro existente é preservado. Trocar o alvo durante o movimento
       apenas inverte a transição CSS a partir da posição atual. */
    this.root.hidden = false;
    this.root.setAttribute('aria-hidden', 'false');
    this.setRootInteractive(true);
    this.root.classList.add('is-ios-settling');
    document.documentElement.classList.add('db502-menu-open');
    document.body?.classList.add('db502-menu-open');
    this.lockBackground();
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.root.classList.remove('is-closing');
    this.root.classList.add('is-open');

    if (!this.host.contains(this.core.orb)) {
      this.releaseOrb = this.core.claim(this.host, {
        mode:'menu',
        ariaLabel:'Orbe das Realidades, centro do menu'
      });
    }
    this.host.classList.add('has-living-orb');
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    if (!reversing) {
      this.core.pulse?.('menu-open', { intensity:0.66 });
      nativePulse('Light');
    }
    await wait(reducedMotion() ? 30 : OPEN_MS);
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.publish(MENU_STATE.OPEN, reversing ? 'settled-reverse-open' : 'settled-open');
    this.root.classList.remove('is-ios-settling');
    this.live.textContent = 'Menu aberto. Escolha uma realidade.';
    safeFocus(this.core.orb);
    return true;
  }

  async close({ restoreFocus = false, reason = 'close', immediate = false, preserveClaim = false, navigating = false } = {}) {
    if (!this.targetOpen && this.state === MENU_STATE.CLOSED) return false;
    const reversing = this.targetOpen && MOVING_STATES.has(this.state);
    this.targetOpen = false;
    const token = ++this.motionToken;
    this.setMenuButton(false);
    this.publish(reversing ? MENU_STATE.REVERSING : MENU_STATE.CLOSING, reversing ? 'reverse-close' : reason);
    this.setRootInteractive(false);
    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing', 'is-ios-settling');
    if (navigating) {
      if (reversing) this.publish(MENU_STATE.CLOSING, 'navigation-close');
      this.publish(MENU_STATE.NAVIGATING, reason);
    }
    await wait(immediate ? 0 : reducedMotion() ? 24 : CLOSE_MS);
    if (token !== this.motionToken || this.targetOpen) return false;

    if (!preserveClaim) {
      try { this.releaseOrb?.(); }
      catch { this.core.returnHome?.(); }
      this.releaseOrb = null;
    }
    this.host.classList.remove('has-living-orb');
    this.root.classList.remove('is-closing', 'is-departing', 'is-ios-settling');
    this.root.hidden = true;
    this.root.setAttribute('aria-hidden', 'true');
    delete this.root.dataset.destination;
    document.documentElement.classList.remove('db502-menu-open');
    document.body?.classList.remove('db502-menu-open');
    if (!navigating) {
      this.unlockBackground();
      this.publish(MENU_STATE.CLOSED, reason);
    }
    this.live.textContent = '';
    if (restoreFocus && !navigating) safeFocus(this.lastFocus?.isConnected ? this.lastFocus : this.menuButton);
    return true;
  }

  finishNavigation(reason = 'navigation-complete') {
    this.motionToken += 1;
    this.targetOpen = false;
    try { this.releaseOrb?.(); } catch {}
    this.releaseOrb = null;
    this.host.classList.remove('has-living-orb');
    this.root.classList.remove('is-open', 'is-closing', 'is-departing', 'is-ios-settling');
    this.root.hidden = true;
    this.root.setAttribute('aria-hidden', 'true');
    this.setRootInteractive(false);
    delete this.root.dataset.destination;
    this.buttons.forEach(button => {
      button.classList.remove('is-chosen', 'is-touching');
      button.removeAttribute('aria-busy');
    });
    document.documentElement.classList.remove('db502-menu-open');
    document.body?.classList.remove('db502-menu-open');
    this.unlockBackground();
    this.navigating = false;
    this.setMenuButton(false);
    this.live.textContent = '';
    if (this.state !== MENU_STATE.CLOSED) this.publish(MENU_STATE.CLOSED, reason);
    this.lastFocus = null;
    return true;
  }

  async activate(portal) {
    if (this.navigating || !this.targetOpen || ![MENU_STATE.OPENING, MENU_STATE.OPEN, MENU_STATE.REVERSING].includes(this.state)) return;
    const route = portal.dataset.v502Route;
    const label = portal.querySelector('.db502-portal__label')?.textContent || 'realidade';
    this.navigating = true;
    this.root.dataset.destination = route;
    this.root.classList.add('is-departing');
    portal.classList.add('is-chosen');
    portal.setAttribute('aria-busy', 'true');
    this.live.textContent = `${label}: a Orbe está abrindo o caminho.`;
    this.core.pulse?.('portal', { intensity:1.02 });
    this.core.prime?.(route, { source:'menu-flight-v517', target:portal });
    const rect = portal.getBoundingClientRect();
    globalThis.divinaLivingUniverseV516?.ignite?.({
      x:(rect.left + rect.width / 2) / Math.max(innerWidth, 1),
      y:(rect.top + rect.height / 2) / Math.max(innerHeight, 1),
      strength:0.82
    });
    nativePulse('Medium');

    const origin = { getBoundingClientRect:() => rect };
    if (!reducedMotion()) await frame();
    // O fechamento visual começa no mesmo instante, mas a posse do corpo não
    // volta à Home. A viagem captura a #orb do centro antes de o menu sumir.
    const closing = this.close({
      restoreFocus:false,
      reason:`route:${route}`,
      preserveClaim:true,
      navigating:true
    });
    // A jornada V577 reconhece este identificador legado para capturar a
    // mesma Orbe física; o motor visual não é trocado nesta macroetapa.
    const travel = Promise.resolve(this.core.navigate(route, {
      source:'orbital-menu-v502',
      target:origin
    })).then(
      value => ({ ok:true, value }),
      error => ({ ok:false, error })
    );
    await Promise.resolve(closing).catch(() => null);
    const outcome = await travel;
    try {
      if (!outcome.ok) throw outcome.error;
      // returnHome() devolve o corpo físico ao berço. Reassentamos o modo na
      // realidade que terminou de abrir para preservar uma única consciência.
      this.core.settleRoute?.(route, 'menu-route-complete-v579');
      this.syncRoute(route);
    } catch (error) {
      console.error(`[Divina] o portal ${route} não abriu`, error);
      globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', {
        detail:'Este caminho não abriu agora. A Home foi preservada.'
      }));
    } finally {
      this.finishNavigation(outcome.ok ? 'route-complete' : 'route-error');
    }
  }

  syncRoute(route) {
    const current = String(route || 'home').replace(/^#/, '').toLowerCase();
    this.buttons.forEach(button => {
      const active = button.dataset.v502Route === current;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  status() {
    return Object.freeze({
      version:VERSION,
      state:this.state,
      portals:this.buttons.length,
      innerRing:INNER.length,
      outerRing:OUTER.length,
      includesLibrary:true,
      oneLivingOrb:true,
      samePhysicalOrb:Boolean(this.core?.snapshot?.().livingOrbConnected),
      orbCore:'v501',
      v500LoaderActive:false,
      extraApiCalls:0,
      webVibration:false,
      nativeHapticsOnly:true,
      fluidityTuning:'v579-reversible-single-authority',
      stateModel:Object.values(MENU_STATE),
      reversibleFromCurrentFrame:true,
      backgroundInert:this.backgroundLocked,
      singleMenuAuthority:true,
      opensOverCurrentRoute:true,
      duplicateCloseButton:false,
      livingUniverseBackdrop:true,
      duplicateStarfield:false
    });
  }

  destroy() {
    this.abort.abort();
    this.motionToken += 1;
    this.targetOpen = false;
    try { this.releaseOrb?.(); }
    catch { this.core?.returnHome?.(); }
    this.releaseOrb = null;
    this.unlockBackground();
    this.host?.classList.remove('has-living-orb');
    this.root?.classList.remove('is-open', 'is-closing', 'is-departing', 'is-ios-settling');
    this.root?.remove();
    this.menuButton?.classList.remove('is-open');
    this.menuButton?.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('db502-menu-open');
    document.body?.classList.remove('db502-menu-open');
    delete document.documentElement.dataset.menuAuthority;
    delete document.documentElement.dataset.menuState;
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = false;
    delete globalThis.divinaMenuV579;
    delete globalThis.divinaMenuV502;
    delete globalThis[INSTANCE];
  }
}

export function installMenuOrbitalV502(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new OrbitalMenuV502(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaMenuV579 = instance;
  globalThis.divinaMenuV502 = instance;
  document.dispatchEvent(new CustomEvent('divina:orbital-menu-ready', {
    detail:Object.freeze({ version:VERSION, authority:AUTHORITY, portals:13, oneLivingOrb:true, v500LoaderActive:false })
  }));
  return instance;
}

// Nome preservado para o bootstrap; a autoridade interna publicada é V579.
export const installOrbitalMenuV502 = installMenuOrbitalV502;
