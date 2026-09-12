/* DIVINA BRUXA — IDENTIDADE, DIREITOS E PERSONALIZAÇÃO · MACROETAPA 7/10 · V531
   Conta, Premium, Skins e Notificações vivem na mesma Orbe V501.
   V524–V530, Whit, Tarot, Sabedoria Viva e privacidade permanecem íntegros. */

import { CONFIG } from './config-v200.js?v=200';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=211-recovery1';
import { orbMotionV207 } from './orb-motion-core-v207.js?v=207';
import { RealityOrbEngine } from './orb-engine-v208.js?v=208';
import { createSupremeOrbCoreV501 } from './supreme-orb-core-v501.js?v=526-universal-presence-retina';
import { createOrbIOSJourneyCoreV525 } from './orb-ios-journey-core-v525.js?v=525';
import { createOrbUniversalPresenceV526 } from './orb-universal-presence-v526.js?v=526';
import { installRealityLifecycleV511 } from './reality-lifecycle-v511.js?v=511';
import { createLivingUniverseV524 } from './living-universe-core-v524.js?v=524-tactile-skin-cosmos';
import { installSkinPerformanceCoreV518 } from './skin-performance-core-v518.js?v=524-tactile-skin-bridge';
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
import { createWhitCoreSupremeV527 } from './whit-core-supreme-v527.js?v=527';
import { createTarotUniverseCoreV528 } from './tarot-universe-core-v528.js?v=528';
import { createWisdomUniverseCoreV529 } from './wisdom-universe-core-v529.js?v=529';
import { createExperienceConversionCoreV530 } from './experience-conversion-core-v530.js?v=530';
import { createIdentityRightsCoreV531 } from './identity-rights-core-v531.js?v=531';

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

globalThis.divinaLivingUniverseV523?.destroy?.();
delete globalThis.divinaLivingUniverseV523;
document.getElementById('divinaLivingUniverseV523')?.remove();
document.getElementById('divinaLivingUniverseV523Styles')?.remove();
document.body?.classList.remove('db523-universe-active');

const livingUniverse = safely('Pele Cósmica Tátil V524', () =>
  createLivingUniverseV524()
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

const orbIOSJourney = safely('OrbOS iOS · Viagem Espacial V525', () =>
  createOrbIOSJourneyCoreV525({ core:supremeOrb, universe:livingUniverse })
);
supremeOrb?.setJourneyEngine?.(orbIOSJourney);

const orbUniversalPresence = safely('OrbOS · Presença Universal V526', () =>
  createOrbUniversalPresenceV526({
    core:supremeOrb,
    universe:livingUniverse,
    journey:orbIOSJourney
  })
);

const whitSupreme = safely('Whit Core Suprema V527', () =>
  createWhitCoreSupremeV527({
    core:whitCore,
    presence:whitPresence,
    nervousSystem:whitNerves,
    contextBridge:whitContext,
    memoryGarden:whitMemory,
    signature:whitSignature,
    mind:whitMind,
    generationBridge:whitGeneration,
    silentPresence:whitSilent,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    universe:livingUniverse,
    go
  })
);

const tarotUniverse = safely('Universo Completo do Tarot V528', () =>
  createTarotUniverseCoreV528({
    go,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    whit:whitSupreme
  })
);

const wisdomUniverse = safely('Sabedoria Viva V529', () =>
  createWisdomUniverseCoreV529({
    go,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    universe:livingUniverse,
    whit:whitSupreme
  })
);

const experienceConversion = safely('Experiências, Conteúdo e Conversão V530', () =>
  createExperienceConversionCoreV530({
    go,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    universe:livingUniverse,
    config:CONFIG
  })
);

const identityRights = safely('Identidade, Direitos e Personalização V531', () =>
  createIdentityRightsCoreV531({
    go,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    universe:livingUniverse
  })
);

const realityLifecycle = safely('Motor Universal das Realidades V511', () =>
  installRealityLifecycleV511({ core:supremeOrb })
);

const warmEssentialPortals = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
  pageLoader.warm(['tarot', 'daily', 'library', 'school', 'journal']).catch?.(() => {});
};

addEventListener('load', () => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmEssentialPortals, { timeout: 2200 });
  else setTimeout(warmEssentialPortals, 900);
}, { once: true });

addEventListener('divina:loading-bypass', () => {
  toast('A página foi aberta enquanto o restante termina de carregar.');
});

const RELEASE_EPOCH_V531 = 531;
const releaseReloadKeyV531 = `divina-release-reload-${RELEASE_EPOCH_V531}`;
const reloadForNewReleaseV531 = version => {
  if (Number(version || 0) <= RELEASE_EPOCH_V531) return false;
  try {
    if (sessionStorage.getItem(releaseReloadKeyV531)) return false;
    sessionStorage.setItem(releaseReloadKeyV531, String(version));
  } catch {}
  location.reload();
  return true;
};

navigator.serviceWorker?.addEventListener('message', event => {
  if (event.data?.type === 'DIVINA_RELEASE_READY') {
    document.documentElement.dataset.releaseReady = String(event.data.version || 'unknown');
    reloadForNewReleaseV531(event.data.version);
    return;
  }
  if (event.data?.type !== 'divina-notification-open') return;
  const target = String(event.data.target || '#home').replace(/^#/, '');
  if (/^(home|daily|school|consultations|login|subscriptions|ai|music|videos|skins|notifications)$/.test(target)) {
    go(target, { source:'notification' });
  }
});

if ('serviceWorker' in navigator && !window.__divinaSWBootstrapV531) {
  window.__divinaSWBootstrapV531 = true;
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=531', { updateViaCache:'none' })
      .then(async registration => {
        document.documentElement.dataset.releaseEpoch = 'v531';
        await registration.update().catch(() => null);
        registration.waiting?.postMessage?.({ type:'SKIP_WAITING' });
        console.info('[Divina] PWA V531 registrado');
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
  journey:orbIOSJourney,
  presence:orbUniversalPresence,
  whit:whitSupreme,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  experience:experienceConversion,
  identity:identityRights,
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

window.divinaWhitSupremeV527 = Object.freeze({
  version:527,
  core:whitSupreme,
  contract:() => whitSupreme?.contract?.() || null,
  guide:route => whitSupreme?.showGuidance?.(route, { source:'public-api' }) || null,
  open:(route, surface) => whitSupreme?.openSheet?.(route, surface, true) || false,
  close:() => whitSupreme?.close?.() || false,
  publicContext:() => whitSupreme?.publicContext?.() || null,
  status:() => whitSupreme?.status?.() || null,
  oneCanonicalOrb:true,
  independentWhitOrb:false,
  originalPersona:true,
  literalWhitneyIdentity:false,
  voiceClone:false,
  soulClaim:false,
  privateReads:false,
  extraApiCalls:0,
  solEnabled:false
});

window.divinaTarotUniverseV528 = Object.freeze({
  version:528,
  core:tarotUniverse,
  contract:() => tarotUniverse?.contract?.() || null,
  audit:() => tarotUniverse?.audit?.() || null,
  status:() => tarotUniverse?.status?.() || null,
  travel:route => tarotUniverse?.travel?.(route) || false,
  worlds:['tarot','daily','spreads'],
  canonicalCards:78,
  normalOnly:true,
  noRepeats:true,
  tarotLivreGridColumns:6,
  dailyCardsPerBrasiliaDay:1,
  spreadMethods:15,
  celticCrossPositions:10,
  royalTable:'13x6',
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentRenderEngines:0,
  privateQuestionReads:false,
  privateMeaningReads:false,
  extraApiCalls:0
});

window.divinaWisdomUniverseV529 = Object.freeze({
  version:529,
  core:wisdomUniverse,
  contract:() => wisdomUniverse?.contract?.() || null,
  audit:() => wisdomUniverse?.audit?.() || null,
  status:() => wisdomUniverse?.status?.() || null,
  travel:route => wisdomUniverse?.travel?.(route) || false,
  askWhit:route => wisdomUniverse?.openWhit?.(route) || false,
  worlds:['library','school','journal'],
  libraryCards:78,
  schoolModules:17,
  schoolLessons:124,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  journalPrivateReads:false,
  schoolNoteReads:false,
  extraApiCalls:0,
  permanentAnimationLoops:0
});

window.divinaExperienceConversionV530 = Object.freeze({
  version:530,
  core:experienceConversion,
  contract:() => experienceConversion?.contract?.() || null,
  audit:() => experienceConversion?.audit?.() || null,
  status:() => experienceConversion?.status?.() || null,
  travel:route => experienceConversion?.travel?.(route) || false,
  worlds:['consultations','store','music','videos'],
  consultationServices:4,
  consultationPriceCents:[50000,50000,30000,15000],
  realBilling:false,
  storeCheckoutInternal:false,
  musicAutoplay:false,
  musicUuidUsedAsSpotifyId:false,
  futureMusicFromOwnerAdmin:true,
  inventedVideos:0,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  privateContentReads:0,
  permanentAnimationLoops:0
});

window.divinaIdentityRightsV531 = Object.freeze({
  version:531,
  core:identityRights,
  contract:() => identityRights?.contract?.() || null,
  audit:() => identityRights?.audit?.() || null,
  status:() => identityRights?.status?.() || null,
  travel:route => identityRights?.travel?.(route) || false,
  worlds:['login','subscriptions','skins','notifications'],
  authAuthority:'AuthClientV201',
  accountAuthority:'AccountEngineV201',
  authSessionStorageOnly:true,
  entitlementAuthority:'server',
  frontendEntitlementGrants:false,
  premiumLifetimePriceCents:19990,
  premiumIncludesAllSkins:true,
  premiumIncludesAI:false,
  aiMonthlyPriceCents:8990,
  aiCreditsPerCycle:400,
  skinCount:30,
  skinsCosmeticOnly:true,
  notificationMarketingDefault:false,
  notificationProviderActive:false,
  realBilling:false,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  privateContentReads:0,
  storageReads:0,
  extraApiCalls:0,
  permanentAnimationLoops:0
});

window.divinaOrbV208 = Object.freeze({
  version: 501,
  engine: realityOrb,
  supreme:supremeOrb,
  journey:orbIOSJourney,
  presence:orbUniversalPresence,
  whit:whitSupreme,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  experience:experienceConversion,
  identity:identityRights,
  miniOrbs:supremeOrb?.projections?.() || [],
  snapshot:() => supremeOrb?.snapshot?.() || orbMotionV207.snapshot()
});

window.divinaOrbSupremeV501 = Object.freeze({
  version:501,
  core:supremeOrb,
  journey:orbIOSJourney,
  presence:orbUniversalPresence,
  whit:whitSupreme,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  experience:experienceConversion,
  identity:identityRights,
  navigate:go,
  pulse:(kind, detail) => supremeOrb?.pulse?.(kind, detail),
  claim:(host, options) => supremeOrb?.claim?.(host, options),
  returnHome:() => supremeOrb?.returnHome?.(),
  snapshot:() => supremeOrb?.snapshot?.() || null,
  oneLivingOrb:true,
  spatialRouteTravel:true,
  routeCurtain:false,
  independentMiniOrbEngines:false
});

window.divinaRealityLifecycleV511 = realityLifecycle;

window.divinaOrbUniversalPresenceV526 = Object.freeze({
  version:526,
  engine:orbUniversalPresence,
  status:() => orbUniversalPresence?.status?.() || null,
  onePhysicalOrb:true,
  independentOrbEngines:0,
  dedicatedLandingRoutes:15,
  retinaProjection:true,
  webVibration:false
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
        orbitalMenu:'v502-v517-tuned-v526-universal-presence',
        tarotLivre:'v517-v521-physical-viewport-lock',
        dailyWorld:'v509',
        tarotUniverse:'v528',
        tarotMacroStage:'4-of-10',
        tarotWorlds:['tarot','daily','spreads'],
        canonicalTarotCards:78,
        canonicalTarotNormalOnly:true,
        canonicalTarotNoRepeats:true,
        tarotLivreGridColumns:6,
        dailyCardsPerBrasiliaDay:1,
        spreadMethods:15,
        celticCrossPositions:10,
        royalTableLayout:'13x6',
        tarotWorldNavigation:'same-orb-v525-journey',
        tarotIndependentOrbEngines:0,
        tarotIndependentRenderEngines:0,
        tarotPrivateQuestionReads:false,
        tarotPrivateMeaningReads:false,
        tarotExtraApiCalls:0,
        wisdomUniverse:'v529',
        wisdomMacroStage:'5-of-10',
        wisdomWorlds:['library','school','journal'],
        wisdomNavigation:'same-orb-v525-journey',
        wisdomLibraryCards:78,
        wisdomSchoolModules:17,
        wisdomSchoolLessons:124,
        wisdomOrganicReadingSurfaces:true,
        wisdomTouchResponsive:true,
        wisdomReadingProgress:'geometry-only',
        wisdomSkinReactive:true,
        wisdomJournalPrivateByDefault:true,
        wisdomJournalFieldReads:0,
        wisdomJournalBodyReads:0,
        wisdomJournalDraftReads:0,
        wisdomSchoolNoteReads:0,
        wisdomWhitContext:'explicit-route-only',
        wisdomAdminPrivateReads:0,
        wisdomAnalyticsPrivateReads:0,
        wisdomStorageReads:0,
        wisdomStorageWrites:0,
        wisdomExtraApiCalls:0,
        wisdomPermanentAnimationLoops:0,
        experienceConversion:'v530',
        experienceMacroStage:'6-of-10',
        experienceWorlds:['consultations','store','music','videos'],
        experienceNavigation:'same-orb-v525-journey',
        experienceConsultationServices:4,
        experienceConsultationPriceCents:[50000,50000,30000,15000],
        experienceConsultationRealBilling:false,
        experienceStoreCheckoutInternal:false,
        experienceStoreAffiliateExternal:true,
        experienceMusicFallbackAlbums:2,
        experienceMusicPublicSource:'supabase-published-only',
        experienceMusicUuidUsedAsSpotifyId:false,
        experienceMusicAutoplay:false,
        experienceFutureMusicFromOwnerAdmin:true,
        experienceVideoPublicSource:'supabase-published-only',
        experienceInventedVideos:0,
        experienceOwnerMfaRequired:true,
        experiencePrivateContentReads:0,
        experienceIndependentOrbEngines:0,
        experienceIndependentUniverseEngines:0,
        experiencePermanentAnimationLoops:0,
        identityRights:'v531',
        identityMacroStage:'7-of-10',
        identityWorlds:['login','subscriptions','skins','notifications'],
        identityNavigation:'same-orb-v525-journey',
        identityAuthAuthority:'AuthClientV201',
        identityAccountAuthority:'AccountEngineV201',
        identityAuthSessionStorageOnly:true,
        identityAuthLocalStorageTokens:false,
        identityEntitlementAuthority:'server',
        identityFrontendEntitlementGrants:false,
        identityEnvironment:'staging',
        identityRealBilling:false,
        identityCheckoutEnabled:false,
        identityPremiumLifetimePriceCents:19990,
        identityPremiumIncludesAllSkins:true,
        identityPremiumIncludesAI:false,
        identityAiMonthlyPriceCents:8990,
        identityAiCreditsPerCycle:400,
        identitySkinCount:30,
        identityFreeSkin:'classic',
        identitySkinsCosmeticOnly:true,
        identityNotificationConsent:'granular-explicit',
        identityNotificationMarketingDefault:false,
        identityNotificationQuietHours:'22:00-08:00 America/Sao_Paulo',
        identityNotificationProviderActive:false,
        identityPrivateContentReads:0,
        identityStorageReads:0,
        identityStorageWrites:0,
        identityExtraApiCalls:0,
        identityIndependentOrbEngines:0,
        identityIndependentUniverseEngines:0,
        identityPermanentAnimationLoops:0,
        realityLifecycle:'v511',
        transitionAuthority:'supreme-orb-v501-plus-orbos-v525',
        orbOS:'v525',
        orbUniversalPresence:'v526',
        orbPresenceMacroStage:'2-of-10',
        physicalOrbHosts:['home','tarot'],
        dedicatedOrbLandingRoutes:15,
        semanticOrbLandings:true,
        retinaOrbProjections:true,
        projectionCadence:document.documentElement.dataset.performanceTier === 'constrained' ? 12 : 24,
        presencePermanentAnimationLoops:0,
        touchPresenceWakesUniverse:true,
        whitCoreSupreme:'v527',
        whitMacroStage:'3-of-10',
        whitLivesInCanonicalOrb:true,
        retiredIndependentWhitOrbit:'v333',
        independentWhitOrb:false,
        whitPublicRouteAwareness:true,
        whitLocalGuidanceRoutes:17,
        whitPrivateContentReads:false,
        whitFormFieldReads:false,
        whitModelCallsByV527:0,
        whitExtraApiCalls:0,
        whitTextPrimary:true,
        whitAudio:false,
        whitOriginalPersona:true,
        whitLiteralWhitneyIdentity:false,
        whitVoiceClone:false,
        whitSoulClaim:false,
        sharedElementOrbJourney:true,
        spatialJourneyPhases:['lift','flight','arrival','settle'],
        onePhysicalOrbDuringJourney:true,
        temporaryLivingCanvasMirror:true,
        independentJourneyOrbEngine:false,
        sameUniverseAcrossNavigation:true,
        routeCurtain:false,
        webVibration:false,
        nativeHapticsOnly:true,
        loaderProjection:'supreme-orb-v501',
        fluidity:'v524-retina-tactile-cloud-flow',
        livingUniverse:'v524',
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
        tactileCloudDisplacement:true,
        wanderingCloudField:true,
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
        selectiveSkinPigment:true,
        paletteTransition:'continuous',
        physicalOrbTouchMotion:false,
        skinPerformance:'v518-v524-connected',
        skinCount:30,
        skinRegistryValid:skinPerformanceCore?.status?.().registryValid === true,
        adaptiveQuality:false,
        adaptiveFrameCadence:true,
        calmQualityRecovery:true,
        extraAnimationLoops:0,
        physicalCardJourney:true,
        decodedBeforeSwap:true,
        unexplainedFlyingCards:false,
        stellarFire:'v516-approved-inside-v524',
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
    startSpreadsSupremeV331();
    startLibraryDeepV332();
    startPwaAfterBootV326();
  }
};
awaken();
