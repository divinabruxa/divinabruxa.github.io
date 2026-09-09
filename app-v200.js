/* DIVINA BRUXA — APLICATIVO V200 · VERDADE COMERCIAL ÚNICA */

import { CONFIG } from './config-v200.js?v=200';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=180';
import { RealityOrbEngine } from './orb-engine-v68.js?v=100';
import { bindMiniOrbs } from './mini-orb-engine.js?v=71';
import { AuthClientV189 as AuthClient } from './auth-client-v189.js?v=191';
import { AccountEngineV189 } from './account-engine-v189.js?v=189';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { createPageLoader } from './page-loader-v1.js?v=195';
import { createOrbLoadingPortal, ORB_BOOT_REQUEST_V152 } from './orb-loading-portal-v1.js?v=152';
import { installCosmicMedia } from './cosmic-media-v1.js?v=1341';
import { bindEditorialMetrics } from './editorial-metrics-v192.js?v=192';
import { installIndexPolicyV193 } from './seo-index-policy-v193.js?v=193';
import './pwa-world-v200.js?v=200';

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
safely('métricas editoriais locais', () => bindEditorialMetrics(document.body));
safely('política de indexação V193', installIndexPolicyV193);
addEventListener('orbe:toast', event => toast(event.detail));

const authClient = new AuthClient(CONFIG);
window.divinaAuth = authClient;
window.divinaAccount = safely('Conta V189', () => new AccountEngineV189($('#login'), authClient));
safely('Orbes auxiliares', bindMiniOrbs);

const loadingPortal = createOrbLoadingPortal();
const pageLoader = createPageLoader({ config: CONFIG, go, authClient });
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

if ('serviceWorker' in navigator && !window.__divinaSWBootstrap) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=200')
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
