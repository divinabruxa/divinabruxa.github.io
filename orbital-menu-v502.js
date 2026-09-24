/* DIVINA BRUXA — FECHAMENTO SUPREMO · MENU VIVO DEFINITIVO · V630
   Sem lista, painel ou segunda Orbe. Dois balões nascem ao redor da Orbe,
   respondem, silenciam e entregam a mesma viagem física entre realidades. */

const VERSION = 630;
const AUTHORITY = 'v630-fechamento-supremo';
const INSTANCE = Symbol.for('divina.orbital.menu.v502');
const ROOT_ID = 'divinaOrbitalMenuV502';
const STYLE_ID = 'divinaOrbitalMenuV502Styles';
const STYLE_HREF = './orbital-menu-v502.css?v=630-fechamento-supremo';
const OPEN_MS = 210;
const CLOSE_MS = 140;
const DISSOLVE_MS = 110;
const BIRTH_MS = 180;
const ACCEPT_MS = 70;
const MENU_MOTION_REASON = 'work12-intention-motion';
const HOME = Object.freeze({ route:'home', label:'Origem', spoken:'Voltar ao Início', intent:'Origem' });

const INTENTIONS = Object.freeze([
  Object.freeze({ route:'tarot', label:'Tarot', spoken:'Tarot Livre', intent:'Revelar' }),
  Object.freeze({ route:'daily', label:'Hoje', spoken:'Carta do Dia', intent:'Receber' }),
  Object.freeze({ route:'spreads', label:'Tiragens', intent:'Aprofundar' }),
  Object.freeze({ route:'library', label:'Cartas', spoken:'Biblioteca das 78 cartas', intent:'Descobrir' }),
  Object.freeze({ route:'school', label:'Escola', intent:'Aprender' }),
  Object.freeze({ route:'journal', label:'Diário', spoken:'Diário e Espelho', intent:'Escutar' }),
  Object.freeze({ route:'ai', label:'Whit', spoken:'Whit, Orbe IA', intent:'Conversar' }),
  Object.freeze({ route:'consultations', label:'Consultas', intent:'Acolher' }),
  Object.freeze({ route:'store', label:'Loja', intent:'Encontrar' }),
  Object.freeze({ route:'skins', label:'Pele', spoken:'Skins da Orbe', intent:'Vestir' }),
  Object.freeze({ route:'music', label:'Música', intent:'Vibrar' }),
  Object.freeze({ route:'videos', label:'Vídeos', intent:'Assistir' }),
  Object.freeze({ route:'subscriptions', label:'Premium', intent:'Expandir' }),
  Object.freeze({ route:'login', label:'Conta', intent:'Guardar' }),
  Object.freeze({ route:'notifications', label:'Sinais', spoken:'Notificações', intent:'Lembrar' })
]);

const INTENTION_FRAMES = Object.freeze(
  Array.from({ length:Math.ceil(INTENTIONS.length / 2) }, (_, index) =>
    Object.freeze(INTENTIONS.slice(index * 2, index * 2 + 2))
  )
);
const DESTINATIONS = Object.freeze([HOME, ...INTENTIONS]);

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
  link.dataset.orbitalMenuStyle = 'v630';
  document.head.append(link);
}

function intentionMarkup(item) {
  const spoken = item.spoken || item.label;
  return `<button type="button" class="db502-portal" hidden aria-hidden="true" tabindex="-1" data-v502-route="${item.route}" data-v593-intent="${item.intent}" data-go="${item.route}" aria-label="${item.intent}: ${spoken}"><span class="db502-portal__light" aria-hidden="true"></span><span class="db502-portal__verb">${item.intent}</span><span class="db502-portal__label">${item.label}</span></button>`;
}

function createScene() {
  const root = document.createElement('section');
  root.id = ROOT_ID;
  root.className = 'db502-menu';
  root.dataset.v593Next = 'sky';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'db502MenuTitle');
  root.setAttribute('aria-describedby', 'db502MenuHint');
  root.innerHTML = `
    <div class="db502-menu__backdrop" data-v593-next="sky" aria-hidden="true"></div>
    <div class="db502-menu__current db502-menu__current--one" aria-hidden="true"></div>
    <div class="db502-menu__current db502-menu__current--two" aria-hidden="true"></div>
    <header class="db502-menu__heading">
      <span>SOPRO DA ORBE</span>
      <h2 id="db502MenuTitle">O que chama?</h2>
    </header>
    <nav class="db502-menu__portals" aria-label="Intenções da Divina Bruxa">
      ${INTENTIONS.map(intentionMarkup).join('')}
    </nav>
    <div class="db502-menu__center" data-v502-orb-host data-v584-home data-v593-home>
      <span class="db502-menu__aura" aria-hidden="true"></span>
      <span class="db502-menu__halo" aria-hidden="true"></span>
      <span class="db502-menu__home-label" aria-hidden="true">Origem</span>
    </div>
    <p class="db502-menu__intention" aria-hidden="true"><span data-v593-intention>Escute</span></p>
    <p class="db502-menu__hint" id="db502MenuHint">Toque no céu para descobrir outros caminhos.</p>
    <span class="db502-menu__live" role="status" aria-live="polite" aria-atomic="true"></span>`;
  return root;
}

function nativePulse(style = 'Light') {
  try {
    const capacitor = globalThis.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return;
    Promise.resolve(capacitor.Plugins?.Haptics?.impact?.({ style })).catch(() => {});
  } catch {
    // Resposta tatil e exclusiva do aplicativo nativo e sempre opcional.
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
      throw new Error('A Orbe Suprema V501 ou o sopro de intenções não foi encontrado.');
    }

    retireFormerMenus();
    installStyles();
    document.getElementById(ROOT_ID)?.remove();
    this.root = createScene();
    document.body.append(this.root);
    this.host = this.root.querySelector('[data-v502-orb-host]');
    this.intention = this.root.querySelector('[data-v593-intention]');
    this.live = this.root.querySelector('.db502-menu__live');
    this.buttons = [...this.root.querySelectorAll('[data-v502-route]')];
    this.abort = new AbortController();
    this.state = 'closed';
    this.bubbleState = 'dormant';
    this.targetOpen = false;
    this.releaseOrb = null;
    this.lastFocus = null;
    this.motionToken = 0;
    this.cycleToken = 0;
    this.frameIndex = 0;
    this.visibleButtons = [];
    this.navigating = false;
    this.cycleBusy = false;
    this.intentTimer = 0;
    this.gesture = null;
    this.suppressSkyClickUntil = 0;
    this.backgroundSnapshots = [];
    this.backgroundLocked = false;
    this.motionLocks = new Set();
    this.menuMotionPaused = false;

    document.documentElement.dataset.menuAuthority = AUTHORITY;
    document.documentElement.dataset.work12Menu = 'v630-compatible';
    document.documentElement.dataset.fechamentoMenu = 'v630';
    document.documentElement.dataset.work14 = 'false';
    this.menuButton.setAttribute('aria-controls', ROOT_ID);
    this.menuButton.setAttribute('aria-haspopup', 'dialog');
    this.legacy?.setAttribute('aria-hidden', 'true');
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = true;

    this.bind();
    this.syncRoute(routeNow());
    this.setMenuButton(false);
    this.publish('closed', 'install');
    this.publishBubble('dormant', 'install');
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest('#menuBtn, [data-menu-toggle], [data-open-menu]') === this.menuButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (this.targetOpen) this.close({ restoreFocus:true, reason:'sopro-button' });
        else this.open();
        return;
      }

      const dockOrb = target.closest('.magic-dock .dock-orb, .dock-orb');
      if (dockOrb && dockOrb === this.dockOrb && !this.root.contains(dockOrb)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.core.pulse?.('portal', { intensity:0.78 });
        nativePulse('Light');
        this.core.navigate('ai', { source:'footer-orb-v593', target:dockOrb }).catch?.(() => {});
        return;
      }

      if (!this.targetOpen || !this.root.contains(target)) return;

      const home = target.closest('[data-v593-home], [data-v584-home]');
      if (home && this.host.contains(target)) {
        if (!['opening','open'].includes(this.state)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.activateHome();
        return;
      }

      const portal = target.closest('[data-v502-route]');
      if (portal && portal.dataset.v593Visible === 'true') {
        if (!['opening','open'].includes(this.state)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.activate(portal);
        return;
      }

      const sky = target.closest('[data-v593-next="sky"]');
      if (sky) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (Date.now() < this.suppressSkyClickUntil) return;
        this.cycleIntentions(1, { reason:'sky-touch' });
      }
    }, { capture:true, signal });

    document.addEventListener('pointerdown', event => {
      if (!this.targetOpen) return;
      const portal = event.target?.closest?.('[data-v502-route][data-v593-visible="true"]');
      if (portal) {
        portal.classList.add('is-touching');
        this.revealIntent(portal.dataset.v502Route);
        this.core.prime?.(portal.dataset.v502Route, { source:'intention-touch-v593', target:portal });
        const clear = () => portal.classList.remove('is-touching');
        portal.addEventListener('pointerup', clear, { once:true });
        portal.addEventListener('pointercancel', clear, { once:true });
        setTimeout(clear, 480);
        return;
      }
      if (this.host.contains(event.target)) {
        this.revealIntent('home');
        return;
      }
      if (event.target?.closest?.('[data-v593-next="sky"]')) {
        this.gesture = { pointerId:event.pointerId, x:event.clientX, y:event.clientY };
      }
    }, { capture:true, passive:true, signal });

    document.addEventListener('pointerup', event => {
      if (!this.targetOpen || !this.gesture || this.gesture.pointerId !== event.pointerId) return;
      const gesture = this.gesture;
      this.gesture = null;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (Math.abs(dx) < 34 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      this.suppressSkyClickUntil = Date.now() + 420;
      this.cycleIntentions(dx < 0 ? 1 : -1, { reason:'horizontal-travel' });
    }, { capture:true, passive:true, signal });

    document.addEventListener('pointercancel', event => {
      if (this.gesture?.pointerId === event.pointerId) this.gesture = null;
    }, { capture:true, passive:true, signal });

    document.addEventListener('pointerover', event => {
      if (!this.targetOpen) return;
      const portal = event.target?.closest?.('[data-v502-route][data-v593-visible="true"]');
      if (portal) this.revealIntent(portal.dataset.v502Route);
      else if (this.host.contains(event.target)) this.revealIntent('home');
    }, { passive:true, signal });

    document.addEventListener('pointerout', event => {
      if (!this.targetOpen || !this.root.contains(event.target)) return;
      if (event.relatedTarget && this.root.contains(event.relatedTarget)) return;
      this.queueListeningIntent();
    }, { passive:true, signal });

    document.addEventListener('focusin', event => {
      const portal = event.target?.closest?.('[data-v502-route][data-v593-visible="true"]');
      if (this.targetOpen && portal) {
        this.core.prime?.(portal.dataset.v502Route, { source:'intention-focus-v593', target:portal });
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
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.cycleIntentions(event.key === 'ArrowRight' ? 1 : -1, { reason:'keyboard' });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [this.homeButton, this.menuButton, this.core.orb, ...this.visibleButtons]
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
    this.menuButton.setAttribute('aria-label', open ? 'Silenciar intenções' : 'Chamar o universo');
    const label = this.menuButton.querySelector('span');
    if (label) label.textContent = open ? 'SILÊNCIO' : 'SOPRO';
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

  publishBubble(state, reason) {
    const previous = this.bubbleState;
    this.bubbleState = state;
    this.root.dataset.bubbleState = state;
    document.documentElement.dataset.work12MenuIntention = state;
    document.dispatchEvent(new CustomEvent('divina:intention-state', {
      detail:Object.freeze({ version:VERSION, previous, state, reason, visible:this.visibleRoutes() })
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

  queueListeningIntent() {
    clearTimeout(this.intentTimer);
    this.intentTimer = setTimeout(() => {
      if (!this.intention || !this.targetOpen) return;
      this.intention.textContent = 'Escute';
      if (this.intention.parentElement?.dataset) this.intention.parentElement.dataset.route = 'silence';
    }, 420);
  }

  frameForRoute(route) {
    const normalized = String(route || 'home').replace(/^#/, '').toLowerCase();
    if (normalized === 'home') return 0;
    const currentFrame = INTENTION_FRAMES.findIndex(items => items.some(item => item.route === normalized));
    return currentFrame < 0 ? 0 : (currentFrame + 1) % INTENTION_FRAMES.length;
  }

  setFrame(index, { announce = false, reason = 'frame' } = {}) {
    const total = INTENTION_FRAMES.length;
    this.frameIndex = ((Number(index) || 0) % total + total) % total;
    const frameItems = INTENTION_FRAMES[this.frameIndex];
    const routes = new Set(frameItems.map(item => item.route));
    this.visibleButtons = [];
    this.buttons.forEach(button => {
      const visible = routes.has(button.dataset.v502Route);
      button.hidden = !visible;
      button.dataset.v593Visible = String(visible);
      button.classList.toggle('is-offered', visible);
      button.classList.remove('is-leaving', 'is-touching');
      button.setAttribute('aria-hidden', String(!visible));
      button.setAttribute('tabindex', visible ? '0' : '-1');
      if (!visible) button.removeAttribute('aria-busy');
      else {
        button.dataset.v593Slot = String(this.visibleButtons.length);
        this.visibleButtons.push(button);
      }
    });
    this.root.dataset.intentFrame = `${this.frameIndex + 1}/${total}`;
    this.root.dataset.visibleIntentions = String(this.visibleButtons.length);
    this.root.dataset.frameReason = reason;
    this.queueListeningIntent();
    if (announce) {
      this.live.textContent = frameItems.map(item => `${item.intent}, ${item.spoken || item.label}`).join('. ');
    }
    return this.visibleRoutes();
  }

  visibleRoutes() {
    return Object.freeze(this.visibleButtons.map(button => button.dataset.v502Route));
  }

  async cycleIntentions(direction = 1, { reason = 'next-breath' } = {}) {
    if (!this.targetOpen || this.navigating || this.cycleBusy || !['opening','open'].includes(this.state)) return false;
    this.cycleBusy = true;
    const token = ++this.cycleToken;
    this.pauseMenuMotion('intention-cycle');
    this.publishBubble('dissolve', reason);
    this.root.classList.add('is-cycling');
    this.root.classList.remove('has-intentions');
    this.visibleButtons.forEach(button => button.classList.add('is-leaving'));
    try {
      await wait(reducedMotion() ? 20 : DISSOLVE_MS);
      if (token !== this.cycleToken || !this.targetOpen) return false;
      this.setFrame(this.frameIndex + (direction < 0 ? -1 : 1), { announce:false, reason });
      this.publishBubble('birth', reason);
      this.root.classList.remove('is-cycling');
      await frame();
      if (token !== this.cycleToken || !this.targetOpen) return false;
      this.root.classList.add('has-intentions');
      await wait(reducedMotion() ? 30 : BIRTH_MS);
      if (token !== this.cycleToken || !this.targetOpen) return false;
      this.publishBubble('breath', reason);
      this.live.textContent = this.visibleButtons
        .map(button => button.getAttribute('aria-label'))
        .filter(Boolean)
        .join('. ');
      return true;
    } finally {
      if (token === this.cycleToken) {
        this.cycleBusy = false;
        this.root.classList.remove('is-cycling');
      }
      this.resumeMenuMotion('intention-cycle');
    }
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

  pauseMenuMotion(reason = 'menu') {
    const wasPaused = this.motionLocks.size > 0;
    this.motionLocks.add(reason);
    if (wasPaused) return;
    globalThis.divinaLivingUniverseV524?.pause?.(MENU_MOTION_REASON);
    document.documentElement.dataset.menuMotion = 'active';
    this.menuMotionPaused = true;
  }

  resumeMenuMotion(reason = 'menu') {
    this.motionLocks.delete(reason);
    if (this.motionLocks.size || !this.menuMotionPaused) return;
    globalThis.divinaLivingUniverseV524?.start?.(MENU_MOTION_REASON);
    delete document.documentElement.dataset.menuMotion;
    this.menuMotionPaused = false;
  }

  async open() {
    if (this.targetOpen || this.navigating || !['closed','closing'].includes(this.state)) return false;
    const reversing = this.state === 'closing';
    this.targetOpen = true;
    const token = ++this.motionToken;
    this.cycleToken += 1;
    this.cycleBusy = false;
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : this.menuButton;
    this.pauseMenuMotion('open');
    this.setMenuButton(true);
    this.homeButton?.setAttribute('aria-label', 'Voltar ao Inicio');
    this.publish('opening', reversing ? 'reverse-open' : 'request');
    this.publishBubble('birth', 'open');
    this.setFrame(this.frameForRoute(routeNow()), { reason:'context' });

    this.root.hidden = false;
    this.setRootInteractive(true);
    this.root.classList.remove('is-closing', 'is-departing', 'is-accepting', 'is-cycling');
    document.documentElement.classList.add('db502-menu-open');
    document.body?.classList.add('db502-menu-open');
    await frame();
    if (token !== this.motionToken || !this.targetOpen) {
      this.resumeMenuMotion('open');
      return false;
    }
    this.root.classList.add('is-open', 'has-intentions', 'is-ios-settling');

    if (!this.host.contains(this.core.orb)) {
      this.releaseOrb = this.core.claim(this.host, {
        mode:'menu',
        ariaLabel:'Orbe central. Voltar ao Início'
      });
    }
    this.host.classList.add('has-living-orb');
    this.lockBackground();
    this.syncRoute(routeNow(), { preserveFrame:true });
    await frame();
    if (token !== this.motionToken || !this.targetOpen) {
      this.resumeMenuMotion('open');
      return false;
    }
    this.core.pulse?.('menu-open', { intensity:0.62 });
    nativePulse('Light');
    await wait(reducedMotion() ? 30 : OPEN_MS);
    if (token !== this.motionToken || !this.targetOpen) {
      this.resumeMenuMotion('open');
      return false;
    }
    this.publish('open', 'settled');
    this.publishBubble('breath', 'settled');
    this.root.classList.remove('is-ios-settling');
    this.resumeMenuMotion('open');
    this.live.textContent = 'Duas intenções respiram.';
    try { this.core.orb?.focus?.({ preventScroll:true }); } catch {}
    return true;
  }

  async close({ restoreFocus = false, reason = 'close', immediate = false, preserveClaim = false } = {}) {
    if (!this.targetOpen && this.state === 'closed') return false;
    this.targetOpen = false;
    const token = ++this.motionToken;
    this.cycleToken += 1;
    this.cycleBusy = false;
    this.gesture = null;
    this.pauseMenuMotion('close');
    this.setMenuButton(false);
    this.publish('closing', reason);
    this.publishBubble('dissolve', reason);
    this.setRootInteractive(false);
    this.root.classList.remove('is-open', 'has-intentions', 'is-ios-settling', 'is-cycling');
    this.root.classList.add('is-closing');
    await wait(immediate ? 0 : reducedMotion() ? 24 : CLOSE_MS);
    if (token !== this.motionToken || this.targetOpen) {
      this.resumeMenuMotion('close');
      return false;
    }

    if (!preserveClaim) {
      try { this.releaseOrb?.(); }
      catch { this.core.returnHome?.(); }
      this.releaseOrb = null;
    }
    this.host.classList.remove('has-living-orb');
    this.unlockBackground();
    this.root.classList.remove('is-closing', 'is-departing', 'is-accepting', 'is-ios-settling');
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
    this.publishBubble('dormant', reason);
    this.resumeMenuMotion('close');
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
    return this.activateDestination({ route:'home', label:'Origem', origin:this.host, chosen:this.host });
  }

  async activateDestination({ route, label, origin, chosen } = {}) {
    if (this.navigating || !this.targetOpen) return false;
    route = String(route || 'home').replace(/^#/, '').toLowerCase();
    if (route === routeNow()) {
      this.core.pulse?.('menu-rest', { intensity:0.52 });
      nativePulse('Light');
      await this.close({ restoreFocus:true, reason:`current:${route}` });
      return true;
    }
    this.navigating = true;
    this.pauseMenuMotion('accept');
    this.publishBubble('accept', route);
    const rect = origin.getBoundingClientRect();
    this.root.dataset.destination = route;
    this.root.classList.add('is-departing', 'is-accepting');
    this.root.classList.remove('has-intentions');
    chosen?.classList?.add('is-chosen');
    chosen?.setAttribute?.('aria-busy', 'true');
    this.revealIntent(route);
    this.live.textContent = `${label}. Viajando.`;
    this.core.pulse?.('portal', { intensity:1.02 });
    this.core.prime?.(route, { source:'menu-intention-v593', target:origin });
    globalThis.divinaLivingUniverseV516?.ignite?.({
      x:(rect.left + rect.width / 2) / Math.max(innerWidth, 1),
      y:(rect.top + rect.height / 2) / Math.max(innerHeight, 1),
      strength:0.78
    });
    nativePulse('Medium');

    const flightOrigin = { getBoundingClientRect:() => rect };
    if (!reducedMotion()) await wait(ACCEPT_MS);
    const closing = this.close({
      restoreFocus:false,
      reason:`route:${route}`,
      immediate:true,
      preserveClaim:true
    });
    const travel = Promise.resolve(this.core.navigate(route, {
      source:'orbital-menu-v502',
      intention:this.destination(route).intent,
      target:flightOrigin
    })).then(
      value => ({ ok:true, value }),
      error => ({ ok:false, error })
    );
    this.resumeMenuMotion('accept');
    await Promise.resolve(closing).catch(() => null);
    const outcome = await travel;
    try {
      if (!outcome.ok) throw outcome.error;
      this.core.settleRoute?.(route, 'menu-intention-complete-v593');
      this.syncRoute(route);
    } catch (error) {
      console.error(`[Divina] a intenção ${route} não abriu`, error);
      globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', {
        detail:'Este caminho não abriu agora. A Origem foi preservada.'
      }));
    } finally {
      try { this.releaseOrb?.(); } catch {}
      this.releaseOrb = null;
      chosen?.classList?.remove('is-chosen');
      chosen?.removeAttribute?.('aria-busy');
      this.root.classList.remove('is-accepting');
      this.resumeMenuMotion('accept');
      this.navigating = false;
    }
    return outcome.ok;
  }

  syncRoute(route, { preserveFrame = false } = {}) {
    const current = String(route || 'home').replace(/^#/, '').toLowerCase();
    this.buttons.forEach(button => {
      const active = button.dataset.v502Route === current;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    this.host.classList.toggle('is-current', current === 'home');
    this.root.dataset.origin = current;
    if (this.targetOpen && !preserveFrame && !this.cycleBusy) {
      this.setFrame(this.frameForRoute(current), { reason:'route-context' });
    }
  }

  status() {
    return Object.freeze({
      version:VERSION,
      release:'V630-FECHAMENTO-SUPREMO',
      authority:AUTHORITY,
      macroStage:'5-of-10',
      state:this.state,
      bubbleState:this.bubbleState,
      frame:this.frameIndex + 1,
      frames:INTENTION_FRAMES.length,
      visibleRoutes:this.visibleRoutes(),
      visibleIntentions:this.visibleButtons.length,
      maximumVisibleIntentions:2,
      destinations:INTENTIONS.length + 1,
      intentionDestinations:INTENTIONS.length,
      progressiveReveal:true,
      horizontalDiscovery:true,
      skyTouchBreath:true,
      automaticRotation:false,
      permanentAnimationLoops:0,
      technicalMenuCopy:0,
      work13:'concluido-e-congelado',
      work14:false,
      menuList:false,
      menuGrid:false,
      oneLivingOrb:true,
      samePhysicalOrb:Boolean(this.core?.snapshot?.().livingOrbConnected),
      orbCore:'v501',
      homeAlwaysAccessible:true,
      homeViaLivingOrb:true,
      oneVisibleIntention:true,
      oneIntentionPerBubble:true,
      fewWordsPerBubble:true,
      verticalLivingInformation:true,
      heavyEffectsPausedDuringMenuMotion:true,
      backgroundInteractionLocked:true,
      fullViewportWithoutScroll:true,
      duplicateCloseButton:false,
      duplicateStarfield:false,
      newCanvases:0,
      javascriptAnimationLoops:0,
      mutationObservers:0,
      silenceIsPresence:true
    });
  }

  destroy() {
    this.abort.abort();
    this.motionToken += 1;
    this.cycleToken += 1;
    this.targetOpen = false;
    clearTimeout(this.intentTimer);
    try { this.releaseOrb?.(); }
    catch { this.core?.returnHome?.(); }
    this.releaseOrb = null;
    this.unlockBackground();
    if (this.menuMotionPaused) globalThis.divinaLivingUniverseV524?.start?.(MENU_MOTION_REASON);
    this.motionLocks.clear();
    this.menuMotionPaused = false;
    this.host?.classList.remove('has-living-orb');
    this.root?.classList.remove('is-open', 'is-closing', 'is-departing', 'is-accepting', 'is-ios-settling');
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
    delete document.documentElement.dataset.work12Menu;
    delete document.documentElement.dataset.work12MenuIntention;
    delete document.documentElement.dataset.fechamentoMenu;
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
    detail:Object.freeze({
      version:VERSION,
      release:'V630-FECHAMENTO-SUPREMO',
      authority:AUTHORITY,
      destinations:INTENTIONS.length + 1,
      maximumVisibleIntentions:2,
      progressiveReveal:true,
      oneLivingOrb:true,
      homeViaLivingOrb:true
    })
  }));
  return instance;
}

// Nome histórico preservado para o bootstrap; a autoridade interna é V630.
export const installOrbitalMenuV502 = installMenuOrbitalV502;
