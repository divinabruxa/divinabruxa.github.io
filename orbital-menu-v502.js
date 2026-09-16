/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · MENU LENDÁRIO · V584
   A Orbe Suprema V501 é o único corpo vivo. Este menu a recebe fisicamente,
   revela treze realidades, mantém a origem acessível no próprio corpo e entrega
   a mesma matéria ao motor de viagem por coordenadas, sem portal ou cópia.
*/

const VERSION = 584;
const AUTHORITY = 'v584';
const INSTANCE = Symbol.for('divina.orbital.menu.v502');
const ROOT_ID = 'divinaOrbitalMenuV502';
const STYLE_ID = 'divinaOrbitalMenuV502Styles';
const STYLE_HREF = './orbital-menu-v502.css?v=584-menu-lendario';
const OPEN_MS = 280;
const CLOSE_MS = 170;
const MENU_MOTION_REASON = 'legendary-menu-motion';
const HOME = Object.freeze({ route:'home', label:'Início', intent:'Origem' });

const INNER = Object.freeze([
  { route:'tarot', label:'Tarot Livre', intent:'Escolher', icon:'tarot' },
  { route:'daily', label:'Carta do Dia', intent:'Receber', icon:'moon' },
  { route:'spreads', label:'Tiragens', intent:'Aprofundar', icon:'spread' },
  { route:'school', label:'Escola', intent:'Aprender', icon:'book' },
  { route:'library', label:'Biblioteca', intent:'Descobrir', icon:'library' },
  { route:'journal', label:'Diário', spoken:'Diário e Espelho', intent:'Escutar', icon:'mirror' }
]);

const OUTER = Object.freeze([
  { route:'ai', label:'Orbe IA', spoken:'Whit, Orbe IA', intent:'Conversar', icon:'spark' },
  { route:'store', label:'Loja', intent:'Encontrar', icon:'bag' },
  { route:'consultations', label:'Consultas', intent:'Acolher', icon:'message' },
  { route:'music', label:'Música', intent:'Vibrar', icon:'music' },
  { route:'videos', label:'Vídeo', intent:'Assistir', icon:'play' },
  { route:'skins', label:'Skins', intent:'Transformar', icon:'gem' },
  { route:'login', label:'Conta', intent:'Guardar', icon:'user' }
]);

const DESTINATIONS = Object.freeze([HOME, ...INNER, ...OUTER]);

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
  return `<button type="button" class="db502-portal db502-portal--${ring}" data-v502-route="${item.route}" data-v584-intent="${item.intent}" data-go="${item.route}" aria-label="${spoken}" style="--portal-i:${index};--portal-angle:${angle}deg;--portal-inverse:${inverse}deg"><span class="db502-portal__jewel">${iconMarkup(item.icon)}<i aria-hidden="true"></i></span><span class="db502-portal__label">${item.label}</span></button>`;
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
      <h2 id="db502MenuTitle">Coordenadas</h2>
    </header>
    <div class="db502-menu__orbit db502-menu__orbit--outer" aria-hidden="true"></div>
    <div class="db502-menu__orbit db502-menu__orbit--inner" aria-hidden="true"></div>
    <nav class="db502-menu__portals" aria-label="Realidades da Divina Bruxa">
      ${INNER.map((item, index) => portalMarkup(item, 'inner', index, INNER.length)).join('')}
      ${OUTER.map((item, index) => portalMarkup(item, 'outer', index, OUTER.length)).join('')}
    </nav>
    <div class="db502-menu__center" data-v502-orb-host data-v584-home>
      <span class="db502-menu__aura" aria-hidden="true"></span>
      <span class="db502-menu__halo" aria-hidden="true"></span>
      <span class="db502-menu__home-label" aria-hidden="true">Início</span>
    </div>
    <p class="db502-menu__intention" aria-hidden="true"><span data-v584-intention>Origem</span></p>
    <p class="db502-menu__hint" id="db502MenuHint">Toque. Viaje.</p>
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
    this.homeButton = document.querySelector('.app-header .brand[data-go="home"], .app-header [data-go="home"]');
    this.homeButtonLabel = this.homeButton?.getAttribute('aria-label');
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
    this.intention = this.root.querySelector('[data-v584-intention]');
    this.live = this.root.querySelector('.db502-menu__live');
    this.buttons = [...this.root.querySelectorAll('[data-v502-route]')];
    this.abort = new AbortController();
    this.state = 'closed';
    this.targetOpen = false;
    this.releaseOrb = null;
    this.lastFocus = null;
    this.motionToken = 0;
    this.navigating = false;
    this.intentTimer = 0;
    this.backgroundSnapshots = [];
    this.backgroundLocked = false;
    this.menuMotionPaused = false;

    document.documentElement.dataset.menuAuthority = AUTHORITY;
    this.menuButton.setAttribute('aria-controls', ROOT_ID);
    this.menuButton.setAttribute('aria-haspopup', 'dialog');
    this.legacy?.setAttribute('aria-hidden', 'true');
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = true;

    this.bind();
    this.syncRoute(routeNow());
    this.setMenuButton(false);
    this.publish('closed', 'install');
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest('#menuBtn, [data-menu-toggle], [data-open-menu]') === this.menuButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (this.targetOpen) this.close({ restoreFocus:true, reason:'menu-button' });
        else this.open();
        return;
      }

      const dockOrb = target.closest('.magic-dock .dock-orb, .dock-orb');
      if (dockOrb && dockOrb === this.dockOrb && !this.root.contains(dockOrb)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.core.pulse?.('portal', { intensity:0.78 });
        nativePulse('Light');
        this.core.navigate('ai', { source:'footer-orb-v502', target:dockOrb }).catch?.(() => {});
        return;
      }

      if (!this.targetOpen || !this.root.contains(target)) return;

      const home = target.closest('[data-v584-home]');
      if (home && this.host.contains(target)) {
        if (!['opening','open'].includes(this.state)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.activateHome();
        return;
      }

      const portal = target.closest('[data-v502-route]');
      if (portal) {
        if (!['opening','open'].includes(this.state)) return;
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
      if (!this.targetOpen) return;
      const portal = event.target?.closest?.('[data-v502-route]');
      if (!portal) {
        if (this.host.contains(event.target)) this.revealIntent('home');
        return;
      }
      portal.classList.add('is-touching');
      this.revealIntent(portal.dataset.v502Route);
      this.core.prime?.(portal.dataset.v502Route, { source:'menu-touch-v517', target:portal });
      const clear = () => portal.classList.remove('is-touching');
      portal.addEventListener('pointerup', clear, { once:true });
      portal.addEventListener('pointercancel', clear, { once:true });
      setTimeout(clear, 520);
    }, { capture:true, passive:true, signal });

    document.addEventListener('pointerover', event => {
      if (!this.targetOpen) return;
      const portal = event.target?.closest?.('[data-v502-route]');
      if (portal) this.revealIntent(portal.dataset.v502Route);
      else if (this.host.contains(event.target)) this.revealIntent('home');
    }, { passive:true, signal });

    document.addEventListener('pointerout', event => {
      if (!this.targetOpen || !this.root.contains(event.target)) return;
      if (event.relatedTarget && this.root.contains(event.relatedTarget)) return;
      this.queueCurrentIntent();
    }, { passive:true, signal });

    document.addEventListener('focusin', event => {
      const portal = event.target?.closest?.('[data-v502-route]');
      if (this.targetOpen && portal) {
        this.core.prime?.(portal.dataset.v502Route, { source:'menu-focus-v502', target:portal });
        this.revealIntent(portal.dataset.v502Route);
      } else if (this.targetOpen && this.host.contains(event.target)) {
        this.revealIntent('home');
      }
    }, { signal });

    document.addEventListener('keydown', event => {
      if (!this.targetOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close({ restoreFocus:true, reason:'escape' });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [this.homeButton, this.menuButton, this.core.orb, ...this.buttons]
        .filter(node => node instanceof HTMLElement && !node.hidden && !node.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, { capture:true, signal });

    document.addEventListener('divina:route-ready', event => {
      this.syncRoute(event.detail?.id || routeNow());
    }, { signal });
    document.addEventListener('divina:page-ready', event => {
      if (event.detail?.id) this.syncRoute(event.detail.id);
    }, { signal });
    document.addEventListener('divina:supreme-orb-will-navigate', () => {
      if (this.targetOpen && !this.navigating) {
        this.close({ restoreFocus:false, reason:'orb-navigation', immediate:true });
      }
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

  destination(route) {
    const normalized = String(route || 'home').replace(/^#/, '').toLowerCase();
    return DESTINATIONS.find(item => item.route === normalized) || HOME;
  }

  revealIntent(route) {
    if (!this.intention) return;
    clearTimeout(this.intentTimer);
    const destination = this.destination(route);
    this.intention.textContent = destination.intent;
    if (this.intention.parentElement?.dataset) this.intention.parentElement.dataset.route = destination.route;
  }

  queueCurrentIntent() {
    clearTimeout(this.intentTimer);
    this.intentTimer = setTimeout(() => this.revealIntent(routeNow()), 420);
  }

  setRootInteractive(interactive) {
    if ('inert' in this.root) this.root.inert = !interactive;
    this.root.setAttribute('aria-hidden', String(!interactive));
  }

  lockBackground() {
    if (this.backgroundLocked) return;
    const nodes = [
      document.querySelector('#app'),
      document.querySelector('.magic-dock'),
      document.querySelector('.v562-skip-link'),
      document.querySelector('#drawer')
    ].filter(node => node instanceof HTMLElement && !this.root.contains(node));
    this.backgroundSnapshots = nodes.map(node => ({
      node,
      inertValue:'inert' in node ? node.inert : null,
      hadAriaHidden:node.hasAttribute('aria-hidden'),
      ariaHidden:node.getAttribute('aria-hidden')
    }));
    this.backgroundSnapshots.forEach(({ node }) => {
      if ('inert' in node) node.inert = true;
      node.setAttribute('aria-hidden', 'true');
    });
    this.backgroundLocked = true;
  }

  unlockBackground() {
    if (!this.backgroundLocked) return;
    this.backgroundSnapshots.forEach(snapshot => {
      const { node } = snapshot;
      if (!node?.isConnected) return;
      if ('inert' in node && snapshot.inertValue !== null) node.inert = snapshot.inertValue;
      if (snapshot.hadAriaHidden) node.setAttribute('aria-hidden', snapshot.ariaHidden ?? 'true');
      else node.removeAttribute('aria-hidden');
    });
    this.backgroundSnapshots = [];
    this.backgroundLocked = false;
  }

  pauseMenuMotion() {
    if (this.menuMotionPaused) return;
    globalThis.divinaLivingUniverseV524?.pause?.(MENU_MOTION_REASON);
    document.documentElement.dataset.menuMotion = 'active';
    this.menuMotionPaused = true;
  }

  resumeMenuMotion() {
    if (!this.menuMotionPaused) return;
    globalThis.divinaLivingUniverseV524?.start?.(MENU_MOTION_REASON);
    delete document.documentElement.dataset.menuMotion;
    this.menuMotionPaused = false;
  }

  async open() {
    if (this.targetOpen || this.navigating || !['closed','closing'].includes(this.state)) return false;
    const reversing = this.state === 'closing';
    this.targetOpen = true;
    const token = ++this.motionToken;
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : this.menuButton;
    this.pauseMenuMotion();
    this.setMenuButton(true);
    this.homeButton?.setAttribute('aria-label', 'Voltar ao Início');
    this.publish('opening', reversing ? 'reverse-open' : 'request');

    /* A cortina cósmica responde já no primeiro quadro. A V551 preserva a
       realidade atual e reclama temporariamente a mesma Orbe. */
    this.root.hidden = false;
    this.setRootInteractive(true);
    this.root.classList.remove('is-closing', 'is-departing');
    document.documentElement.classList.add('db502-menu-open');
    document.body?.classList.add('db502-menu-open');
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.root.classList.add('is-open');
    this.root.classList.add('is-ios-settling');

    if (!this.host.contains(this.core.orb)) {
      this.releaseOrb = this.core.claim(this.host, {
        mode:'menu',
        ariaLabel:'Orbe central. Voltar ao Início'
      });
    }
    this.host.classList.add('has-living-orb');
    this.lockBackground();
    this.syncRoute(routeNow());
    this.revealIntent(routeNow());
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.core.pulse?.('menu-open', { intensity:0.66 });
    nativePulse('Light');
    await wait(reducedMotion() ? 30 : OPEN_MS);
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.publish('open', 'settled');
    this.root.classList.remove('is-ios-settling');
    this.resumeMenuMotion();
    this.live.textContent = 'Menu aberto.';
    try { this.core.orb?.focus?.({ preventScroll:true }); } catch {}
    return true;
  }

  async close({ restoreFocus = false, reason = 'close', immediate = false, preserveClaim = false } = {}) {
    if (!this.targetOpen && this.state === 'closed') return false;
    this.targetOpen = false;
    const token = ++this.motionToken;
    this.pauseMenuMotion();
    this.setMenuButton(false);
    this.publish('closing', reason);
    this.setRootInteractive(false);
    this.root.classList.remove('is-open', 'is-ios-settling');
    this.root.classList.add('is-closing');
    await wait(immediate ? 0 : reducedMotion() ? 24 : CLOSE_MS);
    if (token !== this.motionToken || this.targetOpen) return false;

    if (!preserveClaim) {
      try { this.releaseOrb?.(); }
      catch { this.core.returnHome?.(); }
      this.releaseOrb = null;
    }
    this.host.classList.remove('has-living-orb');
    this.unlockBackground();
    this.root.classList.remove('is-closing', 'is-departing', 'is-ios-settling');
    this.root.hidden = true;
    this.setRootInteractive(false);
    delete this.root.dataset.destination;
    document.documentElement.classList.remove('db502-menu-open');
    document.body?.classList.remove('db502-menu-open');
    if (this.homeButton) {
      if (this.homeButtonLabel === null) this.homeButton.removeAttribute('aria-label');
      else this.homeButton.setAttribute('aria-label', this.homeButtonLabel);
    }
    this.publish('closed', reason);
    this.resumeMenuMotion();
    this.live.textContent = '';
    if (restoreFocus) {
      try { (this.lastFocus?.isConnected ? this.lastFocus : this.menuButton).focus({ preventScroll:true }); } catch {}
    }
    return true;
  }

  async activate(portal) {
    return this.activateDestination({
      route:portal?.dataset?.v502Route,
      label:portal?.querySelector?.('.db502-portal__label')?.textContent || 'Realidade',
      origin:portal,
      chosen:portal
    });
  }

  async activateHome() {
    return this.activateDestination({ route:'home', label:'Início', origin:this.host, chosen:this.host });
  }

  async activateDestination({ route, label, origin, chosen } = {}) {
    if (this.navigating || !this.targetOpen) return;
    route = String(route || 'home').replace(/^#/, '').toLowerCase();
    if (route === routeNow()) {
      this.core.pulse?.('menu-rest', { intensity:0.54 });
      nativePulse('Light');
      await this.close({ restoreFocus:true, reason:`current:${route}` });
      return true;
    }
    this.navigating = true;
    this.root.dataset.destination = route;
    this.root.classList.add('is-departing');
    chosen?.classList?.add('is-chosen');
    chosen?.setAttribute?.('aria-busy', 'true');
    this.revealIntent(route);
    this.live.textContent = `${label}. Viajando.`;
    this.core.pulse?.('portal', { intensity:1.02 });
    this.core.prime?.(route, { source:'menu-flight-v584', target:origin });
    const rect = origin.getBoundingClientRect();
    globalThis.divinaLivingUniverseV516?.ignite?.({
      x:(rect.left + rect.width / 2) / Math.max(innerWidth, 1),
      y:(rect.top + rect.height / 2) / Math.max(innerHeight, 1),
      strength:0.82
    });
    nativePulse('Medium');

    const flightOrigin = { getBoundingClientRect:() => rect };
    if (!reducedMotion()) await frame();
    // O fechamento visual começa no mesmo instante, mas a posse do corpo não
    // volta à Home. A viagem captura a #orb do centro antes de o menu sumir.
    const closing = this.close({
      restoreFocus:false,
      reason:`route:${route}`,
      immediate:true,
      preserveClaim:true
    });
    const travel = Promise.resolve(this.core.navigate(route, {
      source:'orbital-menu-v502',
      target:flightOrigin
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
      this.core.settleRoute?.(route, 'menu-route-complete-v502');
      this.syncRoute(route);
    } catch (error) {
      console.error(`[Divina] o portal ${route} não abriu`, error);
      globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', {
        detail:'Este caminho não abriu agora. A Home foi preservada.'
      }));
    } finally {
      // A autoridade anterior já foi entregue ao motor; esta liberação apenas
      // invalida o recibo do menu e nunca move a Orbe assentada no Tarot.
      try { this.releaseOrb?.(); } catch {}
      this.releaseOrb = null;
      chosen?.classList?.remove('is-chosen');
      chosen?.removeAttribute?.('aria-busy');
      this.navigating = false;
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
    this.host.classList.toggle('is-current', current === 'home');
    this.root.dataset.origin = current;
    if (this.targetOpen) this.revealIntent(current);
  }

  status() {
    return Object.freeze({
      version:VERSION,
      release:'V584',
      authority:AUTHORITY,
      state:this.state,
      portals:this.buttons.length,
      destinations:this.buttons.length + 1,
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
      fluidityTuning:'v584-iphone-single-motion',
      opensOverCurrentRoute:true,
      homeAlwaysAccessible:true,
      homeViaLivingOrb:true,
      oneVisibleIntention:true,
      verticalLivingInformation:true,
      maximumIntentWords:1,
      heavyEffectsPausedDuringMenuMotion:true,
      backgroundInteractionLocked:true,
      fullViewportWithoutScroll:true,
      duplicateCloseButton:false,
      livingUniverseBackdrop:true,
      duplicateStarfield:false
    });
  }

  destroy() {
    this.abort.abort();
    this.motionToken += 1;
    this.targetOpen = false;
    clearTimeout(this.intentTimer);
    try { this.releaseOrb?.(); }
    catch { this.core?.returnHome?.(); }
    this.releaseOrb = null;
    this.unlockBackground();
    this.resumeMenuMotion();
    this.host?.classList.remove('has-living-orb');
    this.root?.classList.remove('is-open', 'is-closing', 'is-departing', 'is-ios-settling');
    this.root?.remove();
    this.menuButton?.classList.remove('is-open');
    this.menuButton?.setAttribute('aria-expanded', 'false');
    if (this.homeButton) {
      if (this.homeButtonLabel === null) this.homeButton.removeAttribute('aria-label');
      else this.homeButton.setAttribute('aria-label', this.homeButtonLabel);
    }
    document.documentElement.classList.remove('db502-menu-open');
    document.body?.classList.remove('db502-menu-open');
    if (document.documentElement.dataset.menuAuthority === AUTHORITY) delete document.documentElement.dataset.menuAuthority;
    delete document.documentElement.dataset.menuState;
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = false;
    delete globalThis.divinaMenuV502;
    delete globalThis[INSTANCE];
  }
}

export function installMenuOrbitalV502(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new OrbitalMenuV502(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaMenuV502 = instance;
  document.dispatchEvent(new CustomEvent('divina:orbital-menu-ready', {
    detail:Object.freeze({ version:VERSION, release:'V584', authority:AUTHORITY, portals:13, destinations:14, oneLivingOrb:true, homeViaLivingOrb:true, v500LoaderActive:false })
  }));
  return instance;
}

// Nome explícito usado pelo bootstrap V502.
export const installOrbitalMenuV502 = installMenuOrbitalV502;
