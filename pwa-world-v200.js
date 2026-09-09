/* DIVINA BRUXA — PWA, ACESSIBILIDADE E RESILIÊNCIA V200
   Instalação orientada, continuidade offline, retorno do segundo plano e
   reforços WCAG 2.2 AA sem acrescentar conteúdo permanente à Home da Orbe.
*/
import { installWebVitalsV196, summarizeLocalWebVitalsV196 } from './performance-world-v196.js?v=196';

const VERSION = 200;
const INSTALL_ROUTES = Object.freeze({ pt: 'instalar-app.html', en: 'install-app.html', es: 'instalar-aplicacion.html' });
const ONLINE_ONLY_SELECTOR = [
  '[data-requires-online]',
  '[data-checkout]',
  '[data-restore-purchase]',
  '#ai button[type="submit"]',
  '#consultations button[type="submit"]',
  '#login button[type="submit"]'
].join(',');

let initialized = false;
let deferredInstallPrompt = null;
let networkStatus = null;
let networkStatusTimer = 0;
const openRegionState = new WeakMap();

const locale = () => {
  const language = document.documentElement.lang.toLowerCase();
  if (language.startsWith('en')) return 'en';
  if (language.startsWith('es')) return 'es';
  return 'pt';
};

const copy = () => ({
  pt: {
    skip: 'Ir para o conteúdo principal', install: 'Instalar aplicativo', installed: 'Aplicativo instalado',
    online: 'Conexão restaurada.', offline: 'Modo offline: Tarot Livre e conteúdos já preparados continuam disponíveis.',
    unavailable: 'Esta ação precisa de conexão segura.', title: 'Instalar a Orbe', kicker: 'DIVINA BRUXA · APLICATIVO',
    ios: ['Abra esta página no Safari.', 'Toque em Compartilhar.', 'Escolha “Adicionar à Tela de Início” e confirme em “Adicionar”.'],
    browser: ['Abra o menu do navegador.', 'Escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.', 'Confirme a instalação.'],
    guide: 'Ver guia completo', close: 'Fechar', preparing: 'Preparando o Tarot Livre para uso offline…',
    ready: 'Tarot Livre preparado para uso offline.', partial: 'Parte do conteúdo foi preparada. Mantenha a conexão e tente novamente.'
  },
  en: {
    skip: 'Skip to main content', install: 'Install app', installed: 'App installed',
    online: 'Connection restored.', offline: 'Offline mode: Free Tarot and prepared content remain available.',
    unavailable: 'This action requires a secure connection.', title: 'Install the Orb', kicker: 'DIVINA BRUXA · APP',
    ios: ['Open this page in Safari.', 'Tap Share.', 'Choose “Add to Home Screen”, then confirm with “Add”.'],
    browser: ['Open the browser menu.', 'Choose “Install app” or “Add to Home Screen”.', 'Confirm the installation.'],
    guide: 'Open full guide', close: 'Close', preparing: 'Preparing Free Tarot for offline use…',
    ready: 'Free Tarot is ready for offline use.', partial: 'Some content was prepared. Keep the connection and try again.'
  },
  es: {
    skip: 'Ir al contenido principal', install: 'Instalar aplicación', installed: 'Aplicación instalada',
    online: 'Conexión restablecida.', offline: 'Modo sin conexión: el Tarot Libre y el contenido preparado siguen disponibles.',
    unavailable: 'Esta acción necesita una conexión segura.', title: 'Instalar la Orbe', kicker: 'DIVINA BRUXA · APLICACIÓN',
    ios: ['Abre esta página en Safari.', 'Toca Compartir.', 'Elige “Añadir a pantalla de inicio” y confirma con “Añadir”.'],
    browser: ['Abre el menú del navegador.', 'Elige “Instalar aplicación” o “Añadir a pantalla de inicio”.', 'Confirma la instalación.'],
    guide: 'Ver guía completa', close: 'Cerrar', preparing: 'Preparando el Tarot Libre para usarlo sin conexión…',
    ready: 'El Tarot Libre está preparado para usarlo sin conexión.', partial: 'Se preparó parte del contenido. Mantén la conexión e inténtalo de nuevo.'
  }
})[locale()];

const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isAppleMobile = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const announce = message => {
  const toast = document.querySelector('#toast');
  if (toast) {
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
  }
  globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: message }));
};

const ensureSkipLink = () => {
  if (document.querySelector('a[href="#app"], a[href="#main"], .db-skip-link')) return;
  const main = document.querySelector('main');
  if (!main) return;
  if (!main.id) main.id = 'main';
  const link = document.createElement('a');
  link.className = 'db-skip-link';
  link.href = `#${main.id}`;
  link.textContent = copy().skip;
  document.body.prepend(link);
};

const setInert = (element, inert) => {
  if (!element) return;
  try { element.inert = inert; }
  catch { /* navegadores antigos continuam protegidos por aria-hidden */ }
};

const syncHiddenRegions = () => {
  document.querySelectorAll('.screen').forEach(screen => {
    const active = screen.classList.contains('active');
    if (screen.getAttribute('aria-hidden') !== String(!active)) screen.setAttribute('aria-hidden', String(!active));
    setInert(screen, !active);
  });
  const orbMenu = document.querySelector('#orbMenu');
  if (orbMenu) {
    const open = orbMenu.getAttribute('aria-hidden') === 'false';
    setInert(orbMenu, !open);
    if (open && openRegionState.get(orbMenu) !== true) requestAnimationFrame(() => focusables(orbMenu)[0]?.focus({ preventScroll: true }));
    openRegionState.set(orbMenu, open);
  }
  const drawer = document.querySelector('#drawer');
  if (drawer) {
    const open = drawer.getAttribute('aria-hidden') === 'false' || drawer.classList.contains('open');
    setInert(drawer, !open);
    if (open && openRegionState.get(drawer) !== true) requestAnimationFrame(() => focusables(drawer)[0]?.focus({ preventScroll: true }));
    openRegionState.set(drawer, open);
  }
};

const focusables = root => [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
  .filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true' && !element.closest('[inert]'));

const trapVisibleLayer = event => {
  if (event.key !== 'Tab') return;
  const layers = [...document.querySelectorAll('dialog[open], #drawer.open, #orbMenu[aria-hidden="false"]')];
  const layer = layers[layers.length - 1];
  if (!layer) return;
  const items = focusables(layer);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const installAccessibility = () => {
  ensureSkipLink();
  const main = document.querySelector('main');
  main?.setAttribute('role', 'main');
  const toast = document.querySelector('#toast');
  toast?.setAttribute('role', 'status');
  toast?.setAttribute('aria-live', 'polite');
  toast?.setAttribute('aria-atomic', 'true');
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
  });
  syncHiddenRegions();
  const observer = new MutationObserver(syncHiddenRegions);
  document.querySelectorAll('.screen, #orbMenu, #drawer').forEach(region => {
    observer.observe(region, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });
  });
  document.addEventListener('keydown', trapVisibleLayer);
  document.addEventListener('divina:route-ready', event => {
    const route = event.detail?.id;
    const screen = route ? document.getElementById(route) : null;
    const heading = screen?.querySelector('h1, h2, [role="heading"]');
    if (!heading) return;
    heading.tabIndex = -1;
    requestAnimationFrame(() => heading.focus({ preventScroll: true }));
  });
};

const ensureNetworkStatus = () => {
  if (networkStatus) return networkStatus;
  const element = document.createElement('div');
  element.className = 'db-network-status';
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-atomic', 'true');
  element.dataset.visible = 'false';
  const message = document.createElement('span');
  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', copy().close);
  close.textContent = '×';
  close.addEventListener('click', () => { element.dataset.visible = 'false'; });
  element.append(message, close);
  document.body.append(element);
  networkStatus = element;
  return element;
};

const updateOnlineOnlyActions = online => {
  document.querySelectorAll(ONLINE_ONLY_SELECTOR).forEach(element => {
    const control = element.matches('button, input[type="submit"]') ? element : null;
    if (!online && control && !control.disabled) {
      control.dataset.dbOfflineDisabled = 'true';
      control.disabled = true;
    }
    if (online && control?.dataset.dbOfflineDisabled === 'true') {
      control.disabled = false;
      delete control.dataset.dbOfflineDisabled;
    }
    element.setAttribute('aria-disabled', String(!online));
  });
};

const updateNetwork = ({ initial = false } = {}) => {
  const online = navigator.onLine;
  document.body.dataset.network = online ? 'online' : 'offline';
  updateOnlineOnlyActions(online);
  const status = ensureNetworkStatus();
  status.querySelector('span').textContent = online ? copy().online : copy().offline;
  clearTimeout(networkStatusTimer);
  if (!online) {
    status.dataset.visible = 'true';
    return;
  }
  if (!initial) {
    status.dataset.visible = 'true';
    networkStatusTimer = setTimeout(() => { status.dataset.visible = 'false'; }, 3200);
  } else status.dataset.visible = 'false';
};

const openInstallDialog = () => {
  let dialog = document.querySelector('#dbInstallDialogV196');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'dbInstallDialogV196';
    dialog.className = 'db-install-dialog';
    dialog.setAttribute('aria-labelledby', 'dbInstallTitleV196');
    dialog.setAttribute('aria-modal', 'true');
    dialog.innerHTML = `<div class="db-install-dialog__inner"><div class="db-install-dialog__top"><div><p></p><h2 id="dbInstallTitleV196"></h2></div><button class="db-install-dialog__close" type="button">×</button></div><ol></ol><div class="db-install-dialog__actions"><a></a><button class="secondary" type="button"></button></div></div>`;
    document.body.append(dialog);
    const closeDialog = () => typeof dialog.close === 'function' ? dialog.close() : dialog.removeAttribute('open');
    dialog.querySelector('.db-install-dialog__close').addEventListener('click', closeDialog);
    dialog.querySelector('.db-install-dialog__actions button').addEventListener('click', closeDialog);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });
  }
  const words = copy();
  const steps = isAppleMobile() ? words.ios : words.browser;
  dialog.querySelector('.db-install-dialog__top p').textContent = words.kicker;
  dialog.querySelector('h2').textContent = words.title;
  dialog.querySelector('ol').replaceChildren(...steps.map(step => {
    const item = document.createElement('li');
    item.textContent = step;
    return item;
  }));
  const guide = dialog.querySelector('.db-install-dialog__actions a');
  guide.href = INSTALL_ROUTES[locale()];
  guide.textContent = words.guide;
  dialog.querySelector('.db-install-dialog__actions button').textContent = words.close;
  if (!dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
  else if (!dialog.open) dialog.setAttribute('open', '');
  dialog.querySelector('.db-install-dialog__close').focus();
};

const installApp = async () => {
  if (isStandalone()) {
    announce(copy().installed);
    return;
  }
  if (!deferredInstallPrompt) {
    openInstallDialog();
    return;
  }
  const prompt = deferredInstallPrompt;
  deferredInstallPrompt = null;
  await prompt.prompt();
  const choice = await prompt.userChoice;
  if (choice?.outcome !== 'accepted') openInstallDialog();
};

const setupInstall = () => {
  document.body.dataset.installed = String(isStandalone());
  const button = document.querySelector('#installApp');
  if (button) {
    button.hidden = false;
    button.onclick = null;
    button.textContent = isStandalone() ? copy().installed : copy().install;
    button.disabled = isStandalone();
    button.addEventListener('click', installApp);
  }
  addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (button && !isStandalone()) button.disabled = false;
  });
  addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    document.body.dataset.installed = 'true';
    if (button) {
      button.textContent = copy().installed;
      button.disabled = true;
    }
    announce(copy().installed);
  });
};

const injectInternationalInstallLink = () => {
  if (locale() === 'pt' || document.body.classList.contains('db-install-page')) return;
  const href = INSTALL_ROUTES[locale()];
  const targets = [document.querySelector('.intl-home-menu-panel'), document.querySelector('.intl-footer nav')].filter(Boolean);
  for (const target of targets) {
    if (target.querySelector(`[href="${href}"]`)) continue;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = copy().install;
    target.append(link);
  }
};

const askWorker = (type, payload = {}) => new Promise((resolve, reject) => {
  if (!('serviceWorker' in navigator) || typeof MessageChannel === 'undefined') {
    reject(new Error('service-worker-unavailable'));
    return;
  }
  const timer = setTimeout(() => reject(new Error('service-worker-timeout')), 90000);
  navigator.serviceWorker.ready.then(registration => {
    const worker = navigator.serviceWorker.controller || registration.active || registration.waiting;
    if (!worker) throw new Error('service-worker-inactive');
    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      clearTimeout(timer);
      resolve(event.data);
    };
    worker.postMessage({ type, ...payload }, [channel.port2]);
  }).catch(error => {
    clearTimeout(timer);
    reject(error);
  });
});

const setupOfflinePreparation = () => {
  const buttons = document.querySelectorAll('[data-prepare-offline]');
  if (!buttons.length) return;
  buttons.forEach(button => button.addEventListener('click', async () => {
    const output = document.querySelector('[data-offline-result]');
    button.disabled = true;
    if (output) output.textContent = copy().preparing;
    try {
      const result = await askWorker('PREPARE_OFFLINE_TAROT');
      const message = result?.complete ? copy().ready : copy().partial;
      if (output) output.textContent = message;
      announce(message);
    } catch {
      if (output) output.textContent = copy().partial;
      announce(copy().partial);
    } finally {
      button.disabled = false;
    }
  }));
};

const setupReturnFromBackground = () => {
  let lastRefresh = 0;
  const resume = async reason => {
    if (document.visibilityState === 'hidden') return;
    updateNetwork({ initial: true });
    const now = Date.now();
    if ('serviceWorker' in navigator && now - lastRefresh > 60000) {
      lastRefresh = now;
      navigator.serviceWorker.getRegistration().then(registration => registration?.update()).catch(() => {});
    }
    dispatchEvent(new CustomEvent('divina:resume', { detail: { reason, at: now } }));
  };
  document.addEventListener('visibilitychange', () => resume('visibility'));
  addEventListener('pageshow', event => resume(event.persisted ? 'bfcache' : 'pageshow'));
};

const setupServiceWorker = () => {
  if (!('serviceWorker' in navigator) || globalThis.__divinaSWBootstrap) return;
  const register = () => navigator.serviceWorker.register('./sw.js?v=200')
    .then(registration => {
      dispatchEvent(new CustomEvent('divina:pwa-ready', { detail: { scope: registration.scope, version: VERSION } }));
      registration.update().catch(() => {});
      return registration;
    })
    .catch(error => console.error('[Divina] PWA V196 indisponível', error));
  if (document.readyState === 'complete') register();
  else addEventListener('load', register, { once: true });
};

const guardOnlineOnlyClicks = () => {
  document.addEventListener('click', event => {
    if (navigator.onLine) return;
    const target = event.target.closest(ONLINE_ONLY_SELECTOR);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    announce(copy().unavailable);
  }, true);
};

export function initializeWorldPwaV196() {
  if (initialized || typeof document === 'undefined') return false;
  initialized = true;
  document.documentElement.dataset.pwaWorld = String(VERSION);
  installWebVitalsV196();
  installAccessibility();
  setupInstall();
  injectInternationalInstallLink();
  setupOfflinePreparation();
  setupServiceWorker();
  setupReturnFromBackground();
  guardOnlineOnlyClicks();
  updateNetwork({ initial: true });
  addEventListener('online', () => updateNetwork());
  addEventListener('offline', () => updateNetwork());
  const dynamicActions = new MutationObserver(() => updateOnlineOnlyActions(navigator.onLine));
  dynamicActions.observe(document.body, { childList: true, subtree: true });
  globalThis.divinaPwaV196 = Object.freeze({
    install: installApp,
    prepareOfflineTarot: () => askWorker('PREPARE_OFFLINE_TAROT'),
    offlineStatus: () => askWorker('GET_OFFLINE_STATUS'),
    webVitals: summarizeLocalWebVitalsV196,
    cacheAuthorityData: false
  });
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeWorldPwaV196, { once: true });
  else queueMicrotask(initializeWorldPwaV196);
}
