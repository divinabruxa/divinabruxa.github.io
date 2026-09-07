/* DIVINA BRUXA — APLICATIVO V180 · ROTAS SOBERANAS */

import { CONFIG } from './config.js';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=180';
import { RealityOrbEngine } from './orb-engine-v68.js?v=100';
import { bindMiniOrbs } from './mini-orb-engine.js?v=71';
import { AuthClient } from './auth-client-v6.js?v=151';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { createPageLoader } from './page-loader-v1.js?v=180';
import { createOrbLoadingPortal, ORB_BOOT_REQUEST_V152 } from './orb-loading-portal-v1.js?v=152';
import { installCosmicMedia } from './cosmic-media-v1.js?v=1341';

const $ = selector => document.querySelector(selector);
const safely = (label, task) => {
  try {
    return task();
  } catch (error) {
    console.error(`[Divina] camada opcional indisponível: ${label}`, error);
    document.dispatchEvent(new CustomEvent('divina:optional-error', { detail: { label } }));
    return null;
  }
};
const toast = message => {
  const element = $('#toast');
  if (!element) {
    console.info('[Divina] toast:', message);
    return;
  }
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2400);
};

safely('runtime visual', installRuntimeV12);
const navigation = createNavigation();
const { go } = navigation;
safely('guarda visual', installVisualGuard);
safely('experiência do Tarot', installTarotExperience);
safely('mídia cósmica', installCosmicMedia);
addEventListener('orbe:toast', event => toast(event.detail));

const authClient = new AuthClient(CONFIG);
window.divinaAuth = authClient;
safely('Orbes auxiliares', bindMiniOrbs);

const loadingPortal = createOrbLoadingPortal();
const pageLoader = createPageLoader({ config: CONFIG, go });
navigation.setBeforeEnter(pageLoader.prepare);
safely('motor da Orbe', () => new RealityOrbEngine($('#orbCanvas'), {
  onOpen: () => pageLoader.go('tarot')
}));

const warmEssentialPortals = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
  pageLoader.warm(['tarot', 'daily']).catch?.(() => {});
};
addEventListener('load', () => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmEssentialPortals, { timeout: 2200 });
  else setTimeout(warmEssentialPortals, 900);
}, { once: true });

addEventListener('divina:loading-bypass', () => {
  toast('A página foi aberta enquanto o restante termina de carregar.');
});

navigator.serviceWorker?.addEventListener('message', event => {
  if (event.data?.type !== 'divina-notification-open') return;
  const target = String(event.data.target || '#home').replace(/^#/, '');
  if (/^(home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(target)) pageLoader.go(target);
});

const bindSubmit = (selector, handler) => {
  const form = $(selector);
  if (form) form.onsubmit = handler;
};

bindSubmit('#userLogin', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements[0]?.value?.trim();
  const password = form.elements[1]?.value || '';
  if (!authClient.enabled) {
    toast('A conta será ativada quando o servidor seguro estiver conectado.');
    return;
  }
  if (!email || !password) {
    toast('Informe e-mail e senha.');
    return;
  }
  const result = await loadingPortal.track(
    () => authClient.login(email, password),
    { label: 'a sua conta' }
  );
  toast(result.ok
    ? 'Sessão iniciada com segurança.'
    : result.offline
      ? 'Servidor temporariamente indisponível.'
      : 'Não foi possível entrar.');
});

bindSubmit('#userRegister', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name?.value?.trim() || '';
  const email = form.elements.email?.value?.trim() || '';
  const password = form.elements.password?.value || '';
  const confirm = form.elements.confirm?.value || '';
  if (password !== confirm) {
    toast('As senhas não conferem.');
    return;
  }
  if (!authClient.enabled) {
    toast('O cadastro será ativado quando o servidor seguro estiver conectado.');
    return;
  }
  const result = await loadingPortal.track(
    () => authClient.register(email, password, name),
    { label: 'o seu novo universo' }
  );
  toast(result.ok
    ? 'Conta criada. Verifique seu e-mail.'
    : result.offline
      ? 'Servidor temporariamente indisponível.'
      : 'Não foi possível criar a conta.');
});

let installPrompt = null;
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  const installButton = $('#installApp');
  if (installButton) installButton.hidden = false;
});

const installButton = $('#installApp');
if (installButton) {
  installButton.onclick = async () => {
    if (!installPrompt) {
      toast('No iPhone: Compartilhar → Adicionar à Tela de Início.');
      return;
    }
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
  };
}

if ('serviceWorker' in navigator && !window.__divinaSWBootstrap) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=180')
      .then(() => console.info('[Divina] PWA registrado'))
      .catch(error => console.error('[Divina] falha ao registrar PWA', error));
  });
}

const skinsHeading = document.querySelector('#skins h2');
if (skinsHeading) skinsHeading.textContent = 'Trinta formas de sentir o universo.';

window.divinaLoading = loadingPortal;
window.orbe = { go: pageLoader.go, loadPage: pageLoader.load, loading: loadingPortal };

const waitForCoreStyles = () => new Promise((resolve, reject) => {
  const link = document.getElementById('divinaCoreStyles');
  const verify = () => getComputedStyle(document.documentElement).getPropertyValue('--db-shell-v180').trim() === '1';
  const finish = () => requestAnimationFrame(() => {
    if (!verify()) {
      reject(new Error('O núcleo visual V180 chegou incompleto.'));
      return;
    }
    document.documentElement.dataset.coreStyles = 'v180';
    resolve(link);
  });
  if (!link) {
    reject(new Error('Folha crítica V180 ausente.'));
    return;
  }
  if (link.sheet) {
    finish();
    return;
  }
  const timer = setTimeout(() => reject(new Error('Tempo esgotado ao carregar o núcleo visual V180.')), 15000);
  link.addEventListener('load', () => {
    clearTimeout(timer);
    finish();
  }, { once: true });
  link.addEventListener('error', () => {
    clearTimeout(timer);
    reject(new Error('Falha ao carregar o núcleo visual V180.'));
  }, { once: true });
});

const awaken = async () => {
  try {
    await waitForCoreStyles();
    await navigation.start();
    document.documentElement.dataset.appShell = 'v180';
    dispatchEvent(new CustomEvent('divina:boot-ready', { detail: { shell: 'v180' } }));
    loadingPortal.end(ORB_BOOT_REQUEST_V152);
  } catch (error) {
    document.documentElement.dataset.bootError = 'v180';
    dispatchEvent(new CustomEvent('divina:boot-error', { detail: { recoverable: true } }));
    console.error('[Divina] o núcleo protegido não despertou', error);
  }
};
awaken();
