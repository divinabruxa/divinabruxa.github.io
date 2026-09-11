/* DIVINA BRUXA — APLICATIVO V208 · WORK7.0 · WHIT SIGNATURE V311 */

import { CONFIG } from './config-v200.js?v=200';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=211-recovery1';
import { orbMotionV207 } from './orb-motion-core-v207.js?v=207';
import { RealityOrbEngine } from './orb-engine-v208.js?v=208';
import { bindMiniOrbs } from './mini-orb-engine-v207.js?v=207';
import { AuthClientV201 as AuthClient } from './auth-client-v201.js?v=201';
import { AccountEngineV201 } from './account-engine-v201.js?v=201';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { createPageLoader } from './page-loader-v1.js?v=302-recovery1';
import { createOrbLoadingPortal, ORB_BOOT_REQUEST_V152 } from './orb-loading-portal-v1.js?v=152';
import { installCosmicMedia } from './cosmic-media-v1.js?v=1341';
import { bindEditorialMetrics } from './editorial-metrics-v192.js?v=192';
import { installIndexPolicyV193 } from './seo-index-policy-v193.js?v=193';
import { createWhitCoreV212 } from './whit-core-v212.js?v=212';
import { createWhitPresenceV307 } from './whit-presence-v307.js?v=307';
import { createWhitNervousSystemV308 } from './whit-nervous-system-v308.js?v=308';
import { createWhitContextBridgeV309 } from './whit-context-bridge-v309.js?v=309';
import { createWhitMemoryGardenV310 } from './whit-memory-garden-v310.js?v=310';
import { createWhitSignatureV311 } from './whit-signature-v311.js?v=311';
import './pwa-world-v201.js?v=201';

const $ = selector => document.querySelector(selector);

const clearRebirthShellResidue = () => {
  document.getElementById('divinaRebirthV300')?.remove();
  delete document.documentElement.dataset.rebirth;
  document.documentElement.classList.remove('db-menu-open','db-menu-transitioning');
  document.body?.classList.remove('db-menu-open','db-menu-transitioning');
};
clearRebirthShellResidue();

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
window.divinaAccount = safely('Conta V201', () => new AccountEngineV201($('#login'), authClient));

const whitCore = safely('Whit 2.0 Core V212', () => createWhitCoreV212({ authClient }));
safely('presença local Whit V212', () => whitCore?.awaken());
const whitPresence = safely('Whit Presence V307', () => createWhitPresenceV307({ core: whitCore, go }));
const whitNerves = safely('Whit Nervous System V308', () => createWhitNervousSystemV308({ core: whitCore, presence: whitPresence }));
const whitContext = safely('Whit Context Bridge V309', () => createWhitContextBridgeV309({ core: whitCore, presence: whitPresence, nervousSystem: whitNerves }));
const whitMemory = safely('Whit Memory Garden V310', () => createWhitMemoryGardenV310({ core: whitCore, presence: whitPresence, authClient }));
const whitSignature = safely('Whit Signature V311', () => createWhitSignatureV311({ core: whitCore, presence: whitPresence, nervousSystem: whitNerves, contextBridge: whitContext, memoryGarden: whitMemory }));

const miniOrbBinding = safely('Orbes auxiliares V207', bindMiniOrbs);

const loadingPortal = createOrbLoadingPortal();
const pageLoader = createPageLoader({ config: CONFIG, go, authClient });
navigation.setBeforeEnter(pageLoader.prepare);

const realityOrb = safely('motor da Orbe V208', () => new RealityOrbEngine($('#orbCanvas'), {
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
  if (/^(home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(target)) {
    pageLoader.go(target);
  }
});

if ('serviceWorker' in navigator && !window.__divinaSWBootstrap) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=208')
      .then(() => console.info('[Divina] PWA registrado'))
      .catch(error => console.error('[Divina] falha ao registrar PWA', error));
  });
}

const skinsHeading = document.querySelector('#skins h2');
if (skinsHeading) skinsHeading.textContent = 'Trinta formas de sentir o universo.';

window.divinaLoading = loadingPortal;
window.orbe = { go: pageLoader.go, loadPage: pageLoader.load, loading: loadingPortal };
window.whit = whitCore;

window.divinaWhitV212 = Object.freeze({
  version: 212,
  core: whitCore,
  status: () => whitCore?.status?.() || null,
  generationEnabled: false,
  paidApiEnabled: false,
  solEnabled: false
});

window.divinaWhitV307 = Object.freeze({
  version: 307,
  core: whitCore,
  presence: whitPresence,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null
  }),
  localPresenceEnabled: true,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});

window.divinaWhitV308 = Object.freeze({
  version: 308,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null
  }),
  eventAwareness: true,
  contentAwareness: false,
  localOnly: true,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});

window.divinaWhitV309 = Object.freeze({
  version: 309,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null
  }),
  exactContextReceipts: true,
  sessionReceiptOnly: true,
  contextBodyStoredInReceipt: false,
  sendConsentStillRequired: true,
  localOnly: true,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});

window.divinaWhitV310 = Object.freeze({
  version: 310,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  memoryGarden: whitMemory,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null,
    memory: whitMemory?.status?.() || null
  }),
  sessionMemoryVisible: true,
  persistentMemoryExplicitOnly: true,
  persistentMemoryUserControlled: true,
  modelCallsForMemoryControls: false,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});

window.divinaWhitV311 = Object.freeze({
  version: 311,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  memoryGarden: whitMemory,
  signature: whitSignature,
  persona: whitSignature?.persona || null,
  generationContract: () => whitSignature?.generationContract?.() || null,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null,
    memory: whitMemory?.status?.() || null,
    signature: whitSignature?.status?.() || null
  }),
  originalPersona: true,
  literalWhitneyIdentity: false,
  voiceClone: false,
  soulClaim: false,
  localPersonaEnabled: true,
  generativePersonaContractReady: true,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});

window.divinaOrbV208 = Object.freeze({
  version: 208,
  engine: realityOrb,
  miniOrbs: miniOrbBinding,
  snapshot: () => orbMotionV207.snapshot()
});

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
