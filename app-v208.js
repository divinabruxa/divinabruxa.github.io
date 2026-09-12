/* DIVINA BRUXA — UNIVERSO VIVO · MACROETAPA 1/4 · ATMOSFERA VIVA RETINA V523
   A única Orbe V501 governa um cosmos Retina contínuo em todas as realidades.
   A Chama Celestial aprovada na V516 e o centro físico V521 permanecem íntegros. */

import { CONFIG } from './config-v200.js?v=200';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=211-recovery1';
import { orbMotionV207 } from './orb-motion-core-v207.js?v=207';
import { RealityOrbEngine } from './orb-engine-v208.js?v=208';
import { createSupremeOrbCoreV501 } from './supreme-orb-core-v501.js?v=501';
import { installRealityLifecycleV511 } from './reality-lifecycle-v511.js?v=511';
import { createLivingUniverseV523 } from './living-universe-core-v523.js?v=523-retina-live-cosmos';
import { installSkinPerformanceCoreV518 } from './skin-performance-core-v518.js?v=523-retina-live-bridge';
import { AuthClientV201 as AuthClient } from './auth-client-v201.js?v=201';
import { AccountEngineV201 } from './account-engine-v201.js?v=201';
import { AccountWorldV319 } from './account-consultations-world-v319.js?v=319';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { createPageLoader } from './page-loader-v1.js?v=517-ios-composition';
import { createOrbLoadingPortal, ORB_BOOT_REQUEST_V152 } from './orb-loading-portal-v1.js?v=152';
import { installCosmicMedia } from './cosmic-media-v1.js?v=1341';
import { bindEditorialMetrics } from './editorial-metrics-v192.js?v=192';
import { installIndexPolicyV193 } from './seo-index-policy-v193.js?v=323';
import { createWhitCoreV212 } from './whit-core-v212.js?v=212';
import { createWhitPresenceV307 } from './whit-presence-v307.js?v=307';
import { createWhitNervousSystemV308 } from './whit-nervous-system-v308.js?v=308';
import { createWhitContextBridgeV309 } from './whit-context-bridge-v309.js?v=309';
import { createWhitMemoryGardenV310 } from './whit-memory-garden-v310.js?v=310';
import { createWhitSignatureV311 } from './whit-signature-v311.js?v=311';
import { createWhitMindV312 } from './whit-mind-v312.js?v=312';
import { createWhitGenerationBridgeV313 } from './whit-generation-bridge-v313.js?v=316-silent1';
import { createWhitSilentPresenceV316 } from './whit-silent-presence-v316.js?v=316';

const $ = selector => document.querySelector(selector);

const installDockStabilityV326 = () => {
  if (document.getElementById('divinaDockStabilityV326')) return;
  const link = document.createElement('link');
  link.id = 'divinaDockStabilityV326';
  link.rel = 'stylesheet';
  link.href = './dock-stability-v326.css?v=326-p0';
  document.head.append(link);
};
installDockStabilityV326();

const startPwaAfterBootV326 = () => import('./pwa-world-v324.js?v=326-p0')
  .then(module => module.initializePwaV324?.())
  .catch(error => {
    console.error('[Divina] PWA isolado do boot não iniciou', error);
    document.documentElement.dataset.pwaError = 'v326';
  });

const startOrbMenuSupremeV327 = () => import('./orb-menu-supreme-v327.js?v=327')
  .then(module => module.installOrbMenuSupremeV327?.())
  .catch(error => {
    console.error('[Divina] Orbe/Menu Supremo V327 não iniciou', error);
    document.documentElement.dataset.orbMenuSupremeError = 'v327';
  });

const startOrbitalMenuV502 = () => import('./orbital-menu-v502.js?v=517-ios-flight')
  .then(module => module.installOrbitalMenuV502?.({ core:supremeOrb, go }))
  .catch(error => {
    console.error('[Divina] Menu Orbital Vivo V502 não iniciou', error);
    document.documentElement.dataset.menuOrbitalError = 'v502';
  });

const startSpreadsSupremeV331 = () => import('./spreads-supreme-v331.js?v=331')
  .then(module => module.installSpreadsSupremeV331?.())
  .catch(error => {
    console.error('[Divina] Tiragens Supremas V331 não iniciaram', error);
    document.documentElement.dataset.spreadsSupremeError = 'v331';
  });

const startLibraryDeepV332 = () => import('./library-deep-v332.js?v=332')
  .then(module => module.installLibraryDeepV332?.())
  .catch(error => {
    console.error('[Divina] Biblioteca Profunda V332 não iniciou', error);
    document.documentElement.dataset.libraryDeepError = 'v332';
  });

const clearRebirthShellResidue = () => {
  document.getElementById('divinaRebirthV300')?.remove();
  delete document.documentElement.dataset.rebirth;
  document.documentElement.classList.remove('db-menu-open','db-menu-transitioning');
  document.body?.classList.remove('db-menu-open','db-menu-transitioning');
};
clearRebirthShellResidue();

const installTarotViewportContractV521 = () => {
  const body = document.body;
  if (!body) return;
  globalThis.__divinaTarotViewportContractV521?.abort?.();
  globalThis.__divinaTarotViewportObserverV520?.disconnect?.();
  const controller = new AbortController();
  const { signal } = controller;
  let frame = 0;
  let settleTimer = 0;
  let horizontalFrame = 0;

  const physicalViewportWidth = () => Math.max(
    1,
    Math.round(document.documentElement.clientWidth || globalThis.visualViewport?.width || innerWidth)
  );

  const clampHorizontalScroll = () => {
    horizontalFrame = 0;
    if (body.dataset.screen !== 'tarot') return;
    const scroller = document.scrollingElement;
    if (scroller && Math.abs(scroller.scrollLeft) > 0.5) scroller.scrollLeft = 0;
    if (Math.abs(document.documentElement.scrollLeft) > 0.5) document.documentElement.scrollLeft = 0;
    if (Math.abs(body.scrollLeft) > 0.5) body.scrollLeft = 0;
  };

  const center = () => {
    frame = 0;
    const width = physicalViewportWidth();
    document.documentElement.style.setProperty('--db521-viewport-width', `${width}px`);
    document.getElementById('tarot')?.setAttribute('data-viewport-lock', 'physical-v521');
    if (body.dataset.screen !== 'tarot') {
      delete document.documentElement.dataset.tarotViewport;
      delete document.documentElement.dataset.tarotViewportWidth;
      return;
    }
    document.documentElement.dataset.tarotViewport = 'centered-v521';
    document.documentElement.dataset.tarotViewportWidth = String(width);
    clampHorizontalScroll();
  };

  const schedule = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => requestAnimationFrame(center));
    clearTimeout(settleTimer);
    settleTimer = setTimeout(center, 520);
  };

  const guardHorizontalScroll = () => {
    if (body.dataset.screen !== 'tarot' || horizontalFrame) return;
    horizontalFrame = requestAnimationFrame(clampHorizontalScroll);
  };

  const observer = new MutationObserver(records => {
    if (records.some(record => record.attributeName === 'data-screen')) schedule();
  });
  observer.observe(body, { attributes:true, attributeFilter:['data-screen'] });
  signal.addEventListener('abort', () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(horizontalFrame);
    clearTimeout(settleTimer);
  }, { once:true });
  ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
    .forEach(type => document.addEventListener(type, schedule, { passive:true, signal }));
  addEventListener('pageshow', schedule, { passive:true, signal });
  addEventListener('resize', schedule, { passive:true, signal });
  addEventListener('orientationchange', schedule, { passive:true, signal });
  addEventListener('scroll', guardHorizontalScroll, { passive:true, capture:true, signal });
  globalThis.visualViewport?.addEventListener('resize', schedule, { passive:true, signal });
  globalThis.visualViewport?.addEventListener('scroll', guardHorizontalScroll, { passive:true, signal });
  globalThis.__divinaTarotViewportContractV521 = controller;
  schedule();
};
installTarotViewportContractV521();

const safely = (label, task) => {
  try {
    return task();
  } catch (error) {
    console.error(`[Divina] camada opcional indisponível: ${label}`, error);
    document.dispatchEvent(new CustomEvent('divina:optional-error', { detail: { label } }));
    return null;
  }
};

globalThis.divinaLivingUniverseV515?.destroy?.();
delete globalThis.divinaLivingUniverseV515;
document.getElementById('divinaLivingUniverseV515')?.remove();
document.getElementById('divinaLivingUniverseV515Styles')?.remove();
document.body?.classList.remove('db515-universe-active');

globalThis.divinaLivingUniverseV516?.destroy?.();
delete globalThis.divinaLivingUniverseV516;
document.getElementById('divinaLivingUniverseV516')?.remove();
document.getElementById('divinaLivingUniverseV516Styles')?.remove();
document.body?.classList.remove('db516-universe-active');

globalThis.divinaLivingUniverseV519?.destroy?.();
delete globalThis.divinaLivingUniverseV519;
document.getElementById('divinaLivingUniverseV519')?.remove();
document.getElementById('divinaLivingUniverseV519Styles')?.remove();
document.body?.classList.remove('db519-universe-active');

globalThis.divinaLivingUniverseV520?.destroy?.();
delete globalThis.divinaLivingUniverseV520;
document.getElementById('divinaLivingUniverseV520')?.remove();
document.getElementById('divinaLivingUniverseV520Styles')?.remove();
document.body?.classList.remove('db520-universe-active');

globalThis.divinaLivingUniverseV521?.destroy?.();
delete globalThis.divinaLivingUniverseV521;
document.getElementById('divinaLivingUniverseV521')?.remove();
document.getElementById('divinaLivingUniverseV521Styles')?.remove();
document.body?.classList.remove('db521-universe-active');

globalThis.divinaLivingUniverseV522?.destroy?.();
delete globalThis.divinaLivingUniverseV522;
document.getElementById('divinaLivingUniverseV522')?.remove();
document.getElementById('divinaLivingUniverseV522Styles')?.remove();
document.body?.classList.remove('db522-universe-active');

const livingUniverse = safely('Atmosfera Viva Retina V523', () =>
  createLivingUniverseV523()
);

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
const navigationGo = navigation.go;
let supremeOrb = null;
const go = (id, options) => supremeOrb?.navigate?.(id, options) || navigationGo(id);
safely('guarda visual', installVisualGuard);
safely('experiência do Tarot', installTarotExperience);
safely('mídia cósmica', installCosmicMedia);
safely('métricas editoriais locais', () => bindEditorialMetrics(document.body));
safely('política de indexação V193', installIndexPolicyV193);
addEventListener('orbe:toast', event => toast(event.detail));

const authClient = new AuthClient(CONFIG);
window.divinaAuth = authClient;
window.divinaAccount = safely('Conta V201', () => new AccountEngineV201($('#login'), authClient));
window.divinaAccountWorldV319 = safely('Conta World V319', () => new AccountWorldV319($('#login'), window.divinaAccount));

const whitCore = safely('Whit 2.0 Core V212', () => createWhitCoreV212({ authClient }));
safely('presença local Whit V212', () => whitCore?.awaken());
const whitPresence = safely('Whit Presence V307', () => createWhitPresenceV307({ core: whitCore, go }));
const whitNerves = safely('Whit Nervous System V308', () => createWhitNervousSystemV308({ core: whitCore, presence: whitPresence }));
const whitContext = safely('Whit Context Bridge V309', () => createWhitContextBridgeV309({ core: whitCore, presence: whitPresence, nervousSystem: whitNerves }));
const whitMemory = safely('Whit Memory Garden V310', () => createWhitMemoryGardenV310({ core: whitCore, presence: whitPresence, authClient }));
const whitSignature = safely('Whit Signature V311', () => createWhitSignatureV311({ core: whitCore, presence: whitPresence, nervousSystem: whitNerves, contextBridge: whitContext, memoryGarden: whitMemory }));
const whitMind = safely('Whit Mind V312', () => createWhitMindV312({ core: whitCore, presence: whitPresence, nervousSystem: whitNerves, contextBridge: whitContext, memoryGarden: whitMemory, signature: whitSignature, authClient }));
const whitGeneration = safely('Whit Generation Bridge V313', () => createWhitGenerationBridgeV313({ mind: whitMind, authClient }));
const whitSilent = safely('Whit Silent Presence V316', () => createWhitSilentPresenceV316({ presence: whitPresence, mind: whitMind }));

const startWhitUniversalV333 = () => import('./whit-orbit-v333.js?v=333')
  .then(module => module.installWhitOrbitV333?.({
    presence: whitPresence,
    nervousSystem: whitNerves,
    silentPresence: whitSilent,
    generationBridge: whitGeneration,
    go
  }))
  .catch(error => {
    console.error('[Divina] Whit Orbit V333 não iniciou', error);
    document.documentElement.dataset.whitUniversalError = 'v333';
  });

const loadingPortal = createOrbLoadingPortal();
// O carregador usa a navegação direta para não criar recursão. Todo ponto de
// entrada público usa `go`, que atravessa primeiro o núcleo da Orbe Suprema.
const pageLoader = createPageLoader({ config: CONFIG, go:navigationGo, authClient });
navigation.setBeforeEnter(pageLoader.prepare);

const realityOrb = safely('motor da Orbe V208', () => new RealityOrbEngine($('#orbCanvas'), {
  onOpen: () => go('tarot', { source:'home-orb-double-tap' })
}));

supremeOrb = safely('Núcleo da Orbe Suprema V501', () => createSupremeOrbCoreV501({
  canvas:$('#orbCanvas'),
  renderer:realityOrb,
  motion:orbMotionV207,
  go:pageLoader.go,
  loading:loadingPortal
}));

const realityLifecycle = safely('Motor Universal das Realidades V511', () =>
  installRealityLifecycleV511({ core:supremeOrb })
);

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

const RELEASE_EPOCH_V523 = 523;
const releaseReloadKeyV523 = `divina-release-reload-${RELEASE_EPOCH_V523}`;
const reloadForNewReleaseV523 = version => {
  if (Number(version || 0) <= RELEASE_EPOCH_V523) return false;
  try {
    if (sessionStorage.getItem(releaseReloadKeyV523)) return false;
    sessionStorage.setItem(releaseReloadKeyV523, String(version));
  } catch {}
  location.reload();
  return true;
};

navigator.serviceWorker?.addEventListener('message', event => {
  if (event.data?.type === 'DIVINA_RELEASE_READY') {
    document.documentElement.dataset.releaseReady = String(event.data.version || 'unknown');
    reloadForNewReleaseV523(event.data.version);
    return;
  }
  if (event.data?.type !== 'divina-notification-open') return;
  const target = String(event.data.target || '#home').replace(/^#/, '');
  if (/^(home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(target)) {
    go(target, { source:'notification' });
  }
});

if ('serviceWorker' in navigator && !window.__divinaSWBootstrapV523) {
  window.__divinaSWBootstrapV523 = true;
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=523', { updateViaCache:'none' })
      .then(async registration => {
        document.documentElement.dataset.releaseEpoch = 'v523';
        await registration.update().catch(() => null);
        registration.waiting?.postMessage?.({ type:'SKIP_WAITING' });
        console.info('[Divina] PWA V523 registrado');
      })
      .catch(error => console.error('[Divina] falha ao registrar PWA', error));
  }, { once:true });
}

const skinsHeading = document.querySelector('#skins h2');
if (skinsHeading) skinsHeading.textContent = 'Trinta formas de sentir o universo.';

window.divinaLoading = loadingPortal;
window.orbe = {
  go,
  loadPage:pageLoader.load,
  loading:loadingPortal,
  universe:livingUniverse,
  supreme:supremeOrb,
  pulse:(kind, detail) => supremeOrb?.pulse?.(kind, detail),
  claim:(host, options) => supremeOrb?.claim?.(host, options),
  returnHome:() => supremeOrb?.returnHome?.(),
  snapshot:() => supremeOrb?.snapshot?.() || orbMotionV207.snapshot()
};
const skinPerformanceCore = safely('Skins, desempenho e acabamento V518', () =>
  installSkinPerformanceCoreV518()
);
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

window.divinaWhitV312 = Object.freeze({
  version: 312,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  memoryGarden: whitMemory,
  signature: whitSignature,
  mind: whitMind,
  persona: whitSignature?.persona || null,
  prepareTurn: input => whitMind?.prepareTurn?.(input) || null,
  peekEnvelopeMeta: () => whitMind?.peekEnvelopeMeta?.() || null,
  takeEnvelope: id => whitMind?.takeEnvelope?.(id) || null,
  generationContract: () => whitSignature?.generationContract?.() || null,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null,
    memory: whitMemory?.status?.() || null,
    signature: whitSignature?.status?.() || null,
    mind: whitMind?.status?.() || null
  }),
  originalPersona: true,
  literalWhitneyIdentity: false,
  voiceClone: false,
  soulClaim: false,
  explicitContextOnly: true,
  transientTurnEnvelope: true,
  persistentPromptStorage: false,
  serverBridgeActive: false,
  generationEnabled: false,
  paidApiEnabled: false,
  privateReads: false,
  solEnabled: false
});


window.divinaWhitV316 = Object.freeze({
  version: 316,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  memoryGarden: whitMemory,
  signature: whitSignature,
  mind: whitMind,
  generationBridge: whitGeneration,
  silentPresence: whitSilent,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null,
    memory: whitMemory?.status?.() || null,
    signature: whitSignature?.status?.() || null,
    mind: whitMind?.status?.() || null,
    generationBridge: whitGeneration?.status?.() || null,
    silentPresence: whitSilent?.status?.() || null
  }),
  audioEnabled: false,
  autoplay: false,
  voiceGateActive: false,
  speechSynthesisUsed: false,
  textPrimary: true,
  visualPresenceActive: Boolean(whitSilent),
  homeOrbTouched: false,
  originalPersona: true,
  literalWhitneyIdentity: false,
  voiceClone: false,
  soulClaim: false,
  solEnabled: false
});


window.divinaWhitV313 = Object.freeze({
  version: 313,
  core: whitCore,
  presence: whitPresence,
  nervousSystem: whitNerves,
  contextBridge: whitContext,
  memoryGarden: whitMemory,
  signature: whitSignature,
  mind: whitMind,
  generationBridge: whitGeneration,
  status: () => ({
    core: whitCore?.status?.() || null,
    presence: whitPresence?.status?.() || null,
    nerves: whitNerves?.status?.() || null,
    context: whitContext?.status?.() || null,
    memory: whitMemory?.status?.() || null,
    signature: whitSignature?.status?.() || null,
    mind: whitMind?.status?.() || null,
    generationBridge: whitGeneration?.status?.() || null
  }),
  generationBridgeActive: Boolean(whitGeneration),
  serverSchemaChanged: false,
  systemPolicyOverride: false,
  extraApiCalls: 0,
  originalPersona: true,
  literalWhitneyIdentity: false,
  voiceClone: false,
  soulClaim: false,
  explicitContextOnly: true,
  transientTurnEnvelope: true,
  persistentPromptStorage: false,
  paidApiEnabledByBridge: false,
  solEnabled: false
});

window.divinaOrbV208 = Object.freeze({
  version: 501,
  engine: realityOrb,
  supreme:supremeOrb,
  miniOrbs:supremeOrb?.projections?.() || [],
  snapshot:() => supremeOrb?.snapshot?.() || orbMotionV207.snapshot()
});

window.divinaOrbSupremeV501 = Object.freeze({
  version:501,
  core:supremeOrb,
  navigate:go,
  pulse:(kind, detail) => supremeOrb?.pulse?.(kind, detail),
  claim:(host, options) => supremeOrb?.claim?.(host, options),
  returnHome:() => supremeOrb?.returnHome?.(),
  snapshot:() => supremeOrb?.snapshot?.() || null,
  oneLivingOrb:true,
  independentMiniOrbEngines:false
});

window.divinaRealityLifecycleV511 = realityLifecycle;

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

    // P0 V326: CSS crítico validado = a pessoa pode entrar.
    // Navegação e PWA não têm mais permissão para manter a tela de boot fechada.
    document.documentElement.dataset.appShell = 'v180';
    document.documentElement.dataset.bootRecovery = 'v326';
    loadingPortal.end(ORB_BOOT_REQUEST_V152);
    dispatchEvent(new CustomEvent('divina:boot-ready', {
      detail: {
        shell:'v180',
        recovery:'v326',
        bootFirst:true,
        supremeOrb:'v501',
        orbitalMenu:'v502-v517-tuned-v523-transparent-cosmos',
        tarotLivre:'v517-v521-physical-viewport-lock',
        dailyWorld:'v509',
        realityLifecycle:'v511',
        transitionAuthority:'supreme-orb-v501',
        loaderProjection:'supreme-orb-v501',
        fluidity:'v523-retina-live-cosmos-touch-flow',
        livingUniverse:'v523',
        retinaTexture:'divina-universe-retina-v523.webp',
        retinaTextureBackedProceduralWorld:true,
        photographicCosmosDetail:true,
        universeDepthLayers:3,
        continuousRouteMorph:true,
        pointerParallax:true,
        scrollParallax:true,
        orbGravityField:true,
        livingCloudTouchField:true,
        touchWake:true,
        travelingCloudBreath:true,
        cosmicDustFilaments:true,
        fluidConstellations:2,
        constellationSegments:11,
        constellationTouchRefraction:true,
        tarotPhysicalViewportCentered:true,
        tarotViewportSource:'documentElement-clientWidth',
        horizontalDocumentPan:false,
        rootScrollClamp:true,
        clockPausesWhenHidden:true,
        contextFallback:true,
        globalUniverseCanvas:true,
        staticUniverseImage:false,
        proceduralStars:true,
        proceduralNebulae:true,
        proceduralGalaxies:true,
        retinaSupersampling:true,
        stableRetinaSession:true,
        resolutionResizesDuringAnimation:false,
        calmStarField:true,
        synchronizedBlinking:false,
        starLuminanceStable:true,
        skinReactiveUniverse:true,
        skinPerformance:'v518-v523-connected',
        skinCount:30,
        skinRegistryValid:skinPerformanceCore?.status?.().registryValid === true,
        adaptiveQuality:false,
        adaptiveFrameCadence:true,
        calmQualityRecovery:true,
        extraAnimationLoops:0,
        physicalCardJourney:true,
        decodedBeforeSwap:true,
        unexplainedFlyingCards:false,
        stellarFire:'v516-approved-inside-v523',
        trueCelestialFire:true,
        lightningStrokes:false,
        strokedFirePaths:0,
        whiteOverexposure:false,
        volumetricBillows:true,
        flameTongues:true,
        fireInsideUniverseCanvas:true,
        iosHistoryNavigation:true,
        mesaRealTransfer:true,
        referenceProportions:true,
        oneLivingDailyOrb:true
      }
    }));

    // O menu é opcional para o boot: a Home abre mesmo se esta camada falhar.
    startOrbitalMenuV502();
    startWhitUniversalV333();
    startSpreadsSupremeV331();
    startLibraryDeepV332();

    // Começa a navegação fora do bloqueio visual.
    const navigationTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('navigation-start-timeout-v326')), 4500)
    );
    Promise.race([Promise.resolve(navigation.start()), navigationTimeout])
      .then(() => {
        document.documentElement.dataset.navigationReady = 'v326';
      })
      .catch(error => {
        document.documentElement.dataset.navigationError = 'v326';
        console.error('[Divina] navegação abriu em recuperação', error);
        toast('A Home abriu. Um caminho ainda está terminando de despertar.');
      })
      .finally(() => {
        // PWA/offline é resiliente, mas nunca mais é boot crítico.
        startPwaAfterBootV326();
      });
  } catch (error) {
    document.documentElement.dataset.bootError = 'v326-critical-css';
    dispatchEvent(new CustomEvent('divina:boot-error', {
      detail: { recoverable:true, criticalCss:false }
    }));
    console.error('[Divina] CSS crítico não despertou', error);

    // Último fail-open visual: o HTML da Home existe e deve continuar acessível.
    document.documentElement.dataset.appShell = 'v180-emergency';
    loadingPortal.end(ORB_BOOT_REQUEST_V152);
    startOrbitalMenuV502();
    startWhitUniversalV333();
    startSpreadsSupremeV331();
    startLibraryDeepV332();
    startPwaAfterBootV326();
  }
};
awaken();
