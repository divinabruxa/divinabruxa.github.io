/* DIVINA BRUXA — MENU ORBITAL V502 · GEOMETRIA VIVA V510
   A Orbe Suprema V501 é o único corpo vivo. Este menu a recebe fisicamente,
   organiza treze realidades em duas órbitas elípticas responsivas e devolve
   a mesma Orbe à Home. Os nomes têm ancoragem própria e nunca orbitam sobre
   a Orbe ou uns sobre os outros.
*/

const VERSION = 502;
const INSTANCE = Symbol.for('divina.orbital.menu.v502');
const ROOT_ID = 'divinaOrbitalMenuV502';
const STYLE_ID = 'divinaOrbitalMenuV502Styles';
const STYLE_HREF = './orbital-menu-v502.css?v=510-living-geometry';
const OPEN_MS = 350;
const CLOSE_MS = 190;

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
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
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
  const existing = document.getElementById(STYLE_ID);
  if (existing) {
    existing.href = STYLE_HREF;
    existing.dataset.fluidity = 'v510';
    return;
  }
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.orbitalMenuStyle = 'v502';
  link.dataset.fluidity = 'v510';
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
  return `<button type="button" class="db502-portal db502-portal--${ring}" data-v502-route="${item.route}" data-v502-ring="${ring}" data-v502-index="${index}" data-go="${item.route}" aria-label="${spoken}" style="--portal-i:${index};--portal-angle:${angle}deg;--portal-inverse:${inverse}deg"><span class="db502-portal__jewel">${iconMarkup(item.icon)}<i aria-hidden="true"></i></span><span class="db502-portal__label">${item.label}</span></button>`;
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
    <button type="button" class="db502-menu__close" data-v502-close="button" aria-label="Fechar menu"><span aria-hidden="true"></span></button>
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

  const cosmos = root.querySelector('.db502-menu__cosmos');
  for (let index = 0; index < 34; index += 1) {
    const spark = document.createElement('i');
    spark.style.setProperty('--star-x', `${(index * 37 + 11) % 100}%`);
    spark.style.setProperty('--star-y', `${(index * 61 + 7) % 100}%`);
    spark.style.setProperty('--star-size', `${1 + (index % 3)}px`);
    spark.style.setProperty('--star-delay', `${-((index * 173) % 4200)}ms`);
    cosmos.append(spark);
  }
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
    this.state = 'closed';
    this.targetOpen = false;
    this.releaseOrb = null;
    this.lastFocus = null;
    this.motionToken = 0;
    this.navigating = false;
    this.returningHome = false;
    this.layoutFrame = 0;

    document.documentElement.dataset.menuAuthority = 'v502';
    this.menuButton.setAttribute('aria-controls', ROOT_ID);
    this.menuButton.setAttribute('aria-haspopup', 'dialog');
    this.legacy?.setAttribute('aria-hidden', 'true');
    if (this.legacy && 'inert' in this.legacy) this.legacy.inert = true;

    this.bind();
    this.layoutPortals();
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

      const portal = target.closest('[data-v502-route]');
      if (portal) {
        if (this.state !== 'open') return;
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
      if (!portal) return;
      portal.classList.add('is-touching');
      const clear = () => portal.classList.remove('is-touching');
      portal.addEventListener('pointerup', clear, { once:true });
      portal.addEventListener('pointercancel', clear, { once:true });
      setTimeout(clear, 520);
    }, { capture:true, passive:true, signal });

    document.addEventListener('focusin', event => {
      const portal = event.target?.closest?.('[data-v502-route]');
      if (this.targetOpen && portal) {
        this.core.prime?.(portal.dataset.v502Route, { source:'menu-focus-v502', target:portal });
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
      const focusable = [this.root.querySelector('.db502-menu__close'), ...this.buttons, this.core.orb]
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
      if (this.targetOpen && !this.navigating && !this.returningHome) {
        this.close({ restoreFocus:false, reason:'orb-navigation', immediate:true });
      }
    }, { signal });

    const requestLayout = () => {
      cancelAnimationFrame(this.layoutFrame);
      this.layoutFrame = requestAnimationFrame(() => this.layoutPortals());
    };
    globalThis.addEventListener?.('resize', requestLayout, { passive:true, signal });
    globalThis.addEventListener?.('orientationchange', requestLayout, { passive:true, signal });
    globalThis.visualViewport?.addEventListener?.('resize', requestLayout, { passive:true, signal });
  }

  layoutPortals() {
    if (!this.root?.isConnected) return;
    const bounds = this.root.getBoundingClientRect();
    const width = Math.max(280, Math.round(bounds.width || innerWidth || 390));
    const height = Math.max(320, Math.round(globalThis.visualViewport?.height || bounds.height || innerHeight || 760));
    const narrow = width <= 430;
    const short = height < 700;
    const landscape = width > height * 1.15 && height <= 560;
    const labelHalf = narrow ? 35 : 42;
    const outerX = landscape
      ? clamp(width * 0.34, 174, Math.min(260, width / 2 - labelHalf - 9))
      : clamp(width * 0.405, narrow ? 112 : 148, Math.min(226, width / 2 - labelHalf - 7));
    const innerX = landscape
      ? clamp(width * 0.2, 104, Math.min(160, outerX - 55))
      : clamp(width * 0.285, narrow ? 88 : 112, Math.min(154, outerX - (narrow ? 36 : 48)));
    const outerY = landscape
      ? clamp(height * 0.3, 104, 146)
      : clamp(height * 0.285, short ? 174 : 194, 310);
    const innerY = landscape
      ? clamp(height * 0.19, 62, Math.min(96, outerY - 43))
      : clamp(height * 0.16, short ? 104 : 118, Math.min(178, outerY - 70));
    const preferredY = height * (landscape ? 0.54 : short ? 0.525 : 0.52);
    const upperLimit = (short ? 61 : 92) + outerY * 0.91 + (narrow ? 43 : 50);
    const lowerLimit = height - (short ? 38 : 52) - outerY - (narrow ? 39 : 47);
    const centerY = Math.round(landscape
      ? preferredY
      : lowerLimit >= upperLimit ? clamp(preferredY, upperLimit, lowerLimit) : preferredY);
    const orbSize = Math.round(clamp(
      Math.min(width * (landscape ? 0.17 : 0.285), height * (landscape ? 0.27 : 0.16)),
      landscape ? 88 : short ? 96 : 108,
      landscape ? 118 : 150
    ));

    this.root.style.setProperty('--db502-center-y', `${centerY}px`);
    this.root.style.setProperty('--db502-inner-x', `${Math.round(innerX)}px`);
    this.root.style.setProperty('--db502-inner-y', `${Math.round(innerY)}px`);
    this.root.style.setProperty('--db502-outer-x', `${Math.round(outerX)}px`);
    this.root.style.setProperty('--db502-outer-y', `${Math.round(outerY)}px`);
    this.root.style.setProperty('--db502-orb-size', `${orbSize}px`);

    this.buttons.forEach((button, order) => {
      const ring = button.dataset.v502Ring === 'outer' ? 'outer' : 'inner';
      const index = Number(button.dataset.v502Index || 0);
      const count = ring === 'outer' ? OUTER.length : INNER.length;
      const start = ring === 'inner' ? -90 : (-90 + (180 / count));
      const degrees = start + (360 / count) * index;
      const radians = degrees * Math.PI / 180;
      const rx = ring === 'outer' ? outerX : innerX;
      const ry = ring === 'outer' ? outerY : innerY;
      const x = Math.cos(radians) * rx;
      const y = Math.sin(radians) * ry;
      const sine = Math.sin(radians);
      let anchor = sine < 0 ? 'top' : 'bottom';
      // Portais quase horizontais usam o lado oposto à órbita vizinha. Isso
      // mantém rótulos longos afastados mesmo em iPhones estreitos.
      if (ring === 'outer' && Math.abs(sine) < 0.31) {
        anchor = sine < 0 ? 'bottom' : 'top';
      }
      if (short && ring === 'inner' && index === 0) anchor = 'bottom';
      if (short && ring === 'inner' && (index === 2 || index === 4)) anchor = 'top';
      button.dataset.labelAnchor = anchor;
      button.style.setProperty('--portal-x', `${x.toFixed(2)}px`);
      button.style.setProperty('--portal-y', `${y.toFixed(2)}px`);
      button.style.setProperty('--portal-delay', `${order * (narrow ? 9 : 11)}ms`);
    });

    this.root.dataset.layout = landscape ? 'landscape-v510' : narrow ? 'portrait-compact-v510' : 'ellipse-v510';
    document.documentElement.dataset.menuFluidity = 'v510';
    requestAnimationFrame(() => this.auditLabels());
  }

  auditLabels() {
    if (!this.root?.isConnected || this.root.hidden) return 0;
    const labels = this.buttons
      .map(button => button.querySelector('.db502-portal__label')?.getBoundingClientRect())
      .filter(rect => rect?.width && rect?.height);
    let overlaps = 0;
    for (let left = 0; left < labels.length; left += 1) {
      for (let right = left + 1; right < labels.length; right += 1) {
        const a = labels[left];
        const b = labels[right];
        if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) {
          overlaps += 1;
        }
      }
    }
    this.root.dataset.labelOverlaps = String(overlaps);
    document.documentElement.dataset.menuLabelOverlaps = String(overlaps);
    return overlaps;
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
      detail:Object.freeze({ version:VERSION, authority:'v502', previous, state, targetOpen:this.targetOpen, reason })
    }));
  }

  async open() {
    if (this.targetOpen || this.state !== 'closed') return false;
    this.targetOpen = true;
    const token = ++this.motionToken;
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : this.menuButton;
    this.setMenuButton(true);
    this.publish('opening', 'request');

    /* A cortina cósmica responde já no primeiro quadro. Quando o menu nasce
       fora da Home, a volta acontece protegida por ela e a mesma Orbe só é
       reclamada depois de chegar ao próprio berço. */
    this.root.hidden = false;
    this.root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('db502-menu-open');
    this.layoutPortals();
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.root.classList.add('is-open');

    if (routeNow() !== 'home') {
      this.returningHome = true;
      try {
        await Promise.resolve(this.go('home', { source:'orbital-menu-return-home-v502', target:this.menuButton }));
      } catch (error) {
        console.error('[Divina] não foi possível voltar à Home antes do menu', error);
        await this.close({ restoreFocus:true, reason:'home-error', immediate:true });
        return false;
      } finally {
        this.returningHome = false;
      }
    }
    if (token !== this.motionToken || !this.targetOpen) return false;

    this.releaseOrb = this.core.claim(this.host, {
      mode:'menu',
      ariaLabel:'Orbe das Realidades, centro do menu'
    });
    this.host.classList.add('has-living-orb');
    await frame();
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.core.pulse?.('menu-open', { intensity:0.66 });
    nativePulse('Light');
    await wait(reducedMotion() ? 30 : OPEN_MS);
    if (token !== this.motionToken || !this.targetOpen) return false;
    this.publish('open', 'settled');
    this.auditLabels();
    this.live.textContent = 'Menu aberto. Escolha uma realidade.';
    try { this.core.orb?.focus?.({ preventScroll:true }); } catch {}
    return true;
  }

  async close({ restoreFocus = false, reason = 'close', immediate = false } = {}) {
    if (!this.targetOpen && this.state === 'closed') return false;
    this.targetOpen = false;
    const token = ++this.motionToken;
    this.setMenuButton(false);
    this.publish('closing', reason);
    this.root.classList.remove('is-open');
    this.root.classList.add('is-closing');
    await wait(immediate ? 0 : reducedMotion() ? 24 : CLOSE_MS);
    if (token !== this.motionToken || this.targetOpen) return false;

    try { this.releaseOrb?.(); }
    catch { this.core.returnHome?.(); }
    this.releaseOrb = null;
    this.host.classList.remove('has-living-orb');
    this.root.classList.remove('is-closing', 'is-departing');
    this.root.hidden = true;
    this.root.setAttribute('aria-hidden', 'true');
    delete this.root.dataset.destination;
    document.documentElement.classList.remove('db502-menu-open');
    this.publish('closed', reason);
    this.live.textContent = '';
    if (restoreFocus) {
      try { (this.lastFocus?.isConnected ? this.lastFocus : this.menuButton).focus({ preventScroll:true }); } catch {}
    }
    return true;
  }

  async activate(portal) {
    if (this.navigating || !this.targetOpen) return;
    const route = portal.dataset.v502Route;
    const label = portal.querySelector('.db502-portal__label')?.textContent || 'realidade';
    this.navigating = true;
    this.root.dataset.destination = route;
    this.root.classList.add('is-departing');
    portal.classList.add('is-chosen');
    portal.setAttribute('aria-busy', 'true');
    this.live.textContent = `${label}: a Orbe está abrindo o caminho.`;
    this.core.pulse?.('portal', { intensity:1.02 });
    nativePulse('Medium');

    const rect = portal.getBoundingClientRect();
    const origin = { getBoundingClientRect:() => rect };
    await wait(reducedMotion() ? 0 : 64);
    // A Orbe volta ao berço antes da troca de tela. O portal conserva a origem
    // visual para que o fogo direcional nasça exatamente do item tocado.
    await this.close({ restoreFocus:false, reason:`route:${route}`, immediate:true });
    const travel = Promise.resolve(this.core.navigate(route, {
      source:'orbital-menu-v502',
      target:origin
    })).then(
      value => ({ ok:true, value }),
      error => ({ ok:false, error })
    );
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
      portal.classList.remove('is-chosen');
      portal.removeAttribute('aria-busy');
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
      fluidityTuning:'v510',
      responsiveEllipse:true,
      labelOverlaps:Number(this.root?.dataset.labelOverlaps || 0)
    });
  }

  destroy() {
    this.abort.abort();
    cancelAnimationFrame(this.layoutFrame);
    this.motionToken += 1;
    this.targetOpen = false;
    try { this.releaseOrb?.(); }
    catch { this.core?.returnHome?.(); }
    this.releaseOrb = null;
    this.host?.classList.remove('has-living-orb');
    this.root?.remove();
    this.menuButton?.classList.remove('is-open');
    this.menuButton?.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('db502-menu-open');
    delete document.documentElement.dataset.menuAuthority;
    delete document.documentElement.dataset.menuState;
    delete document.documentElement.dataset.menuFluidity;
    delete document.documentElement.dataset.menuLabelOverlaps;
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
    detail:Object.freeze({ version:VERSION, portals:13, oneLivingOrb:true, v500LoaderActive:false })
  }));
  return instance;
}

// Nome explícito usado pelo bootstrap V502.
export const installOrbitalMenuV502 = installMenuOrbitalV502;
