/* DIVINA BRUXA 2.0 — REBIRTH R001 · BOOTSTRAP V300
   Novo universo visual sobre os dados e conteúdos válidos já construídos. */

import { CONFIG } from './config-v200.js?v=200';
import { createNavigation } from './navigation.js?v=300';
import { RealityOrbHeartV300 } from './orb-engine-v300.js?v=300';
import { AuthClientV201 as AuthClient } from './auth-client-v201.js?v=201';
import { AccountEngineV201 } from './account-engine-v201.js?v=201';
import { createPageLoader } from './page-loader-v1.js?v=300';
import { createOrbLoadingPortal, ORB_BOOT_REQUEST_V152 } from './orb-loading-portal-v1.js?v=152';
import { bindEditorialMetrics } from './editorial-metrics-v192.js?v=192';
import { installIndexPolicyV193 } from './seo-index-policy-v193.js?v=193';
import { createWhitCoreV212 } from './whit-core-v212.js?v=212';
import { createWhitPresenceV300 } from './whit-presence-v300.js?v=300';
import './pwa-world-v201.js?v=201';

const $ = selector => document.querySelector(selector);
const safely = (label, task) => {
  try { return task(); }
  catch (error) {
    console.error(`[Divina Rebirth] ${label}`, error);
    document.dispatchEvent(new CustomEvent('divina:optional-error', { detail:{ label } }));
    return null;
  }
};

function toast(message) {
  const element = $('#toast');
  if (!element) return;
  element.textContent = String(message ?? '');
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function installRebirthStyles() {
  const existing = document.getElementById('divinaRebirthV300');
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = 'divinaRebirthV300';
    link.rel = 'stylesheet';
    link.href = 'divina-rebirth-v300.css?v=300';
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error('O universo visual V300 não carregou.'));
    document.head.append(link);
  });
}

addEventListener('orbe:toast', event => toast(event.detail));
safely('métricas editoriais', () => bindEditorialMetrics(document.body));
safely('política de indexação', installIndexPolicyV193);

const authClient = new AuthClient(CONFIG);
window.divinaAuth = authClient;
window.divinaAccount = safely('conta', () => new AccountEngineV201($('#login'), authClient));

const whitCore = safely('Whit Core', () => createWhitCoreV212({ authClient }));
const navigation = createNavigation();
const { go } = navigation;
const loadingPortal = createOrbLoadingPortal();
const pageLoader = createPageLoader({ config:CONFIG, go, authClient });
navigation.setBeforeEnter(pageLoader.prepare);

const heart = safely('Orbe Coração V300', () => new RealityOrbHeartV300($('#orbCanvas'), {
  onOpen: () => pageLoader.go('tarot')
}));

const whitPresence = safely('Whit Presença V300', () => createWhitPresenceV300({ core:whitCore, go:pageLoader.go }));

const warmWorlds = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
  pageLoader.warm(['tarot','daily']).catch?.(() => {});
};

addEventListener('load', () => {
  if ('requestIdleCallback' in window) requestIdleCallback(warmWorlds, { timeout:2400 });
  else setTimeout(warmWorlds, 1100);
}, { once:true });

navigator.serviceWorker?.addEventListener('message', event => {
  if (event.data?.type !== 'divina-notification-open') return;
  const target = String(event.data.target || '#home').replace(/^#/, '');
  if (/^(home|tarot|daily|library|school|spreads|consultations|login|subscriptions|ai|music|videos|skins|notifications|journal|store)$/.test(target)) pageLoader.go(target);
});

if ('serviceWorker' in navigator && !window.__divinaSWBootstrap) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=208').catch(() => {}), { once:true });
}

window.divinaLoading = loadingPortal;
window.orbe = { go:pageLoader.go, loadPage:pageLoader.load, loading:loadingPortal };
window.whit = whitCore;
window.divinaWhit = Object.freeze({
  version:300,
  core:whitCore,
  presence:whitPresence,
  status:() => whitCore?.status?.() || null,
  generationEnabled:false,
  paidApiEnabled:false,
  solEnabled:false
});
window.divinaOrb = Object.freeze({ version:300, engine:heart, snapshot:() => heart?.snapshot?.() || null });
window.divinaRebirth = Object.freeze({ version:300, codename:'R001-UNIVERSO-VIVO' });

async function awaken() {
  try {
    await installRebirthStyles();
    await navigation.start();
    whitPresence?.start?.();
    document.documentElement.dataset.appShell = 'rebirth-v300';
    document.documentElement.dataset.rebirth = '300';
    dispatchEvent(new CustomEvent('divina:boot-ready', { detail:{ shell:'rebirth-v300' } }));
    loadingPortal.end(ORB_BOOT_REQUEST_V152);
  } catch (error) {
    document.documentElement.dataset.bootError = 'rebirth-v300';
    dispatchEvent(new CustomEvent('divina:boot-error', { detail:{ recoverable:true, version:300 } }));
    console.error('[Divina Rebirth] O universo não despertou', error);
  }
}

awaken();
