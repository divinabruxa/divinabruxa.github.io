/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 14/14 · V562
   QA Supremo reproduzível, correção do carregador de mundos e evidência honesta.
   Todo o universo aprovado até a V561 permanece íntegro. */

import { CONFIG } from './config-v200.js?v=559';
import { installRuntimeV12 } from './runtime-v12.js?v=152';
import { createNavigation } from './navigation.js?v=535-fluid-navigation';
import { orbMotionV207 } from './orb-motion-core-v207.js?v=207';
import { RealityOrbEngine } from './orb-engine-v208.js?v=535-fluid-navigation';
import { createSupremeOrbCoreV501 } from './supreme-orb-core-v501.js?v=551-claim-stack';
import { createOrbIOSJourneyCoreV525 } from './orb-ios-journey-core-v525.js?v=550-single-physics';
import { createOrbUniversalPresenceV526 } from './orb-universal-presence-v526.js?v=550-single-physics';
import { installRealityLifecycleV511 } from './reality-lifecycle-v511.js?v=511';
import { createLivingUniverseV524 } from './living-universe-core-v524.js?v=537-no-fire';
import { installSkinPerformanceCoreV518 } from './skin-performance-core-v518.js?v=535-mobile-fluidity';
import { AuthClientV201 as AuthClient } from './auth-client-v201.js?v=532';
import { AccountEngineV201 } from './account-engine-v201.js?v=556-journal-consent';
import { AccountWorldV319 } from './account-consultations-world-v319.js?v=558-consultations-supreme';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { createPageLoader } from './page-loader-v1.js?v=562-qa-supreme';
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
import { createWhitMindV312 } from './whit-mind-v312.js?v=557-event-driven';
import { createWhitGenerationBridgeV313 } from './whit-generation-bridge-v313.js?v=316-silent1';
import { createWhitSilentPresenceV316 } from './whit-silent-presence-v316.js?v=557-event-driven';
import { createWhitCoreSupremeV527 } from './whit-core-supreme-v527.js?v=557-event-driven';
import { createTarotUniverseCoreV528 } from './tarot-universe-core-v528.js?v=528';
import { createWisdomUniverseCoreV529 } from './wisdom-universe-core-v529.js?v=529';
import { createExperienceConversionCoreV530 } from './experience-conversion-core-v530.js?v=559-media-guard';
import { createIdentityRightsCoreV531 } from './identity-rights-core-v531.js?v=542';
import { createResponsiveEnchantmentCoreV533 } from './responsive-enchantment-core-v533.js?v=542-skins';
import { createQaSupremeCoreV534 } from './qa-supreme-core-v534.js?v=534';
import { createWorldTruthRegistryV535 } from './world-truth-registry-v535.js?v=535';
import { createOrbFluidNavigationV535 } from './orb-fluid-navigation-v535.js?v=549';
import { createVitalityBusV536 } from './vitality-bus-v536.js?v=536';
import { createLivingGrammarV536 } from './living-grammar-v536.js?v=536';
import { createOriginDiscoveryV537 } from './origin-discovery-v537.js?v=537';
import { createWisdomDepthCoreV539 } from './wisdom-depth-core-v539.js?v=539';
import { createWhitPresenceDeepV540 } from './whit-presence-deep-v540.js?v=540';
import { createExperienceDepthCoreV541 } from './experience-depth-core-v541.js?v=541';
import { createAmazonStoreCoreV543 } from './amazon-store-core-v543.js?v=543';
import { createPublicLibraryCoreV544 } from './public-library-core-v544.js?v=555';
import { createInternationalParityCoreV545 } from './international-parity-core-v545.js?v=545';
import { createPwaPerformanceRecoveryCoreV546 } from './pwa-performance-recovery-core-v546.js?v=546';
import { createSecurityPrivacyCoreV547 } from './security-privacy-core-v547.js?v=547';
import { createPageDesignSupremeV560 } from './page-design-supreme-v560.js?v=560';
import { getPrivacyPreferences } from './privacy-center-v9.js?v=561';
import { createEthicalReturnCoreV561 } from './ethical-return-core-v561.js?v=561';
import { createQaSupremeLaunchV562 } from './qa-supreme-launch-v562.js?v=562';

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

const startPwaAfterBootV537 = () => import('./pwa-world-v324.js?v=562')
  .then(module => module.initializePwaV324?.())
  .catch(error => {
    console.error('[Divina] PWA isolado do boot não iniciou', error);
    document.documentElement.dataset.pwaError = 'v562';
  });

const startOrbMenuSupremeV327 = () => import('./orb-menu-supreme-v327.js?v=327')
  .then(module => module.installOrbMenuSupremeV327?.())
  .catch(error => {
    console.error('[Divina] Orbe/Menu Supremo V327 não iniciou', error);
    document.documentElement.dataset.orbMenuSupremeError = 'v327';
  });

const startOrbitalMenuV502 = () => import('./orbital-menu-v502.js?v=551-ios-motion')
  .then(module => module.installOrbitalMenuV502?.({ core:supremeOrb, go }))
  .catch(error => {
    console.error('[Divina] Menu Orbital Vivo V502 não iniciou', error);
    document.documentElement.dataset.menuOrbitalError = 'v502';
  });

const startSpreadsSupremeV331 = () => import('./spreads-supreme-v331.js?v=554')
  .then(module => module.installSpreadsSupremeV331?.())
  .catch(error => {
    console.error('[Divina] Tiragens Supremas V331 não iniciaram', error);
    document.documentElement.dataset.spreadsSupremeError = 'v331';
  });

const startLibraryDeepV332 = () => import('./library-deep-v332.js?v=555')
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

// Mede a tela antes de despertar o universo visual e restaura a rota das
// 30 skins antes que a navegação construa o mapa de mundos.
const responsiveEnchantment = safely('Responsividade e Encantamento Final V533', () =>
  createResponsiveEnchantmentCoreV533()
);

const pwaPerformanceRecovery = safely('PWA, Performance, Offline e Recuperação V546', () =>
  createPwaPerformanceRecoveryCoreV546()
);

const securityPrivacy = safely('Segurança, Privacidade e Matriz Física V547', () =>
  createSecurityPrivacyCoreV547()
);

// A tela dinâmica de Skins já existe neste ponto; o primeiro diagnóstico do
// Registro Vivo nasce, portanto, com as 17 realidades efetivamente presentes.
const worldTruth = safely('Fonte de Verdade e Registro Vivo V535', () =>
  createWorldTruthRegistryV535()
);

// A V536 traduz eventos públicos em estado semântico. Nasce antes dos mundos
// para ouvi-los desde o despertar, sem criar outro motor visual ou outro loop.
const vitalityBus = safely('Barramento de Vitalidade V536', () =>
  createVitalityBusV536()
);
const livingGrammar = safely('Gramática Viva V536', () =>
  createLivingGrammarV536({ bus:vitalityBus })
);
const originDiscovery = safely('Origem, Home, Menu e Descoberta V537', () =>
  createOriginDiscoveryV537({ go:(...args) => go(...args), vitality:vitalityBus })
);

const qaSupreme = safely('QA Supremo, Evidencias e Entrega V534', () =>
  createQaSupremeCoreV534()
);

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
let pageLoader = null;
const go = (id, options) => {
  pageLoader?.prime?.(id).catch?.(() => {});
  return supremeOrb?.navigate?.(id, options) || navigationGo(id);
};
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
pageLoader = createPageLoader({ config: CONFIG, go:navigationGo, authClient });
navigation.setBeforeEnter(pageLoader.prepare);

const realityOrb = safely('motor da Orbe V208', () => new RealityOrbEngine($('#orbCanvas'), {
  onIntent: () => pageLoader.prime('tarot').catch(() => {}),
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
navigation.setRouteRequest(go);

const orbFluidNavigation = safely('Navegação Fluida da Orbe V535', () =>
  createOrbFluidNavigationV535({
    core:supremeOrb,
    universe:livingUniverse,
    pageLoader,
    journey:orbIOSJourney
  })
);

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

const whitDeep = safely('Whit Presença Profunda V540', () =>
  createWhitPresenceDeepV540({ supreme:whitSupreme, orbCore:supremeOrb })
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

const wisdomDepth = safely('Sabedoria Viva Profunda V539', () =>
  createWisdomDepthCoreV539({ go, orbCore:supremeOrb, vitality:vitalityBus })
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

const experienceDepth = safely('Experiências, Conteúdo e Conversão V541', () =>
  createExperienceDepthCoreV541({
    go,
    orbCore:supremeOrb,
    base:experienceConversion,
    config:CONFIG
  })
);

const identityRights = safely('Identidade, Direitos, Skins e Presença V542', () =>
  createIdentityRightsCoreV531({
    go,
    orbCore:supremeOrb,
    orbPresence:orbUniversalPresence,
    universe:livingUniverse
  })
);

const amazonStore = safely('Loja Amazon V543', () =>
  createAmazonStoreCoreV543({ config:CONFIG })
);

const publicLibrary = safely('Biblioteca Pública V544', () =>
  createPublicLibraryCoreV544()
);

const internationalParity = safely('Paridade Internacional V545', () =>
  createInternationalParityCoreV545()
);

const realityLifecycle = safely('Motor Universal das Realidades V511', () =>
  installRealityLifecycleV511({ core:supremeOrb })
);

// A V560 unifica apresentação e estados sem observar conteúdo privado, criar
// outro motor ou interferir na autoridade dos mundos já aprovados.
const pageDesignSupreme = safely('Design de Páginas e Mobile Premium V560', () =>
  createPageDesignSupremeV560({
    go,
    pageLoader,
    responsive:responsiveEnchantment,
    vitality:vitalityBus
  })
);

// A V561 se conecta apenas a eventos e ações explícitas. O Diário continua
// privado; analytics só cria identificador pseudônimo após opt-in registrado.
const ethicalReturn = safely('Retorno Ético e Conteúdo Diário V561', () =>
  createEthicalReturnCoreV561({
    go,
    config:CONFIG,
    getPrivacyPreferences
  })
);

// O fechamento V562 observa somente estrutura pública e erros sanitizados da
// sessão. Aprovação da proprietária e evidências físicas continuam manuais.
const qaSupremeLaunch = safely('QA Supremo V562', () =>
  createQaSupremeLaunchV562()
);

const warmEssentialPortals = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if ((document.body.dataset.screen && document.body.dataset.screen !== 'home')
    || document.documentElement.dataset.orbNavigationState === 'active'
    || document.documentElement.dataset.performanceTier === 'constrained'
    || connection?.saveData
    || /slow-2g|(^|-)2g$/.test(connection?.effectiveType || '')) return;
  // Só o primeiro destino mais provável aquece em repouso. Os outros mundos
  // permanecem realmente lazy e são preparados pelo gesto que os escolhe.
  pageLoader.warm(['tarot']).catch?.(() => {});
};

addEventListener('load', () => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmEssentialPortals, { timeout: 5000 });
  else setTimeout(warmEssentialPortals, 2400);
}, { once: true });

addEventListener('divina:loading-bypass', () => {
  toast('A página foi aberta enquanto o restante termina de carregar.');
});

const RELEASE_EPOCH_V537 = 550;
const reloadForNewReleaseV537 = version => {
  const nextRelease = Number(version || 0);
  if (!Number.isFinite(nextRelease) || nextRelease <= RELEASE_EPOCH_V537) return false;
  const releaseReloadKeyV537 = `divina-release-reload-${nextRelease}`;
  try {
    if (sessionStorage.getItem(releaseReloadKeyV537)) return false;
    sessionStorage.setItem(releaseReloadKeyV537, String(nextRelease));
  } catch {}
  location.reload();
  return true;
};

navigator.serviceWorker?.addEventListener('message', event => {
  if (event.data?.type === 'DIVINA_RELEASE_READY') {
    document.documentElement.dataset.releaseReady = String(event.data.version || 'unknown');
    reloadForNewReleaseV537(event.data.version);
    return;
  }
  if (event.data?.type !== 'divina-notification-open') return;
  const target = String(event.data.target || '#home').replace(/^#/, '');
  if (/^(home|tarot|daily|library|spreads|school|journal|consultations|store|login|subscriptions|ai|music|videos|skins|notifications)$/.test(target)) {
    go(target, { source:'notification' });
  }
});

if ('serviceWorker' in navigator && !window.__divinaSWBootstrap) {
  window.__divinaSWBootstrap = 'v562-app';
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=562', { updateViaCache:'none' })
      .then(async registration => {
        document.documentElement.dataset.releaseEpoch = 'v562';
        await registration.update().catch(() => null);
        registration.waiting?.postMessage?.({ type:'SKIP_WAITING' });
        console.info('[Divina] PWA V562 registrado');
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
  whitDeep,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  wisdomDepth,
  experience:experienceConversion,
  experienceDepth,
  identity:identityRights,
  responsive:responsiveEnchantment,
  qa:qaSupreme,
  truth:worldTruth,
  fluidity:orbFluidNavigation,
  vitality:vitalityBus,
  grammar:livingGrammar,
  discovery:originDiscovery,
  international:internationalParity,
  recovery:pwaPerformanceRecovery,
  security:securityPrivacy,
  design:pageDesignSupreme,
  returnGarden:ethicalReturn,
  qaLaunch:qaSupremeLaunch,
  observatory:null,
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
  consultationPriceCents:[25000,20000,15000,5000],
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

window.divinaExperienceReleaseV541 = Object.freeze({
  version:541,
  macroStage:'7-of-14',
  title:'Experiências, Conteúdo e Conversão',
  core:experienceDepth,
  contract:() => experienceDepth?.contract?.() || null,
  status:() => experienceDepth?.status?.() || null,
  worlds:['consultations','store','music','videos'],
  consultationServices:4,
  consultationPriceCents:[25000,20000,15000,5000],
  consultationChannel:'email-only',
  consultationRealBilling:false,
  storeAssociateTag:'orbedasrealid-20',
  storeCheckoutInternal:false,
  musicAlbums:2,
  musicAutoplay:false,
  musicPlayerLazy:true,
  inventedVideos:0,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  privateContentReads:0,
  permanentAnimationLoops:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false
});

window.divinaIdentityRightsReleaseV542 = Object.freeze({
  version:542,
  macroStage:'8-of-14',
  title:'Identidade, Direitos, Skins e Presença',
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
  skinsAlsoSoldIndividually:true,
  paidSkinCount:29,
  individualSkinPriceTiersCents:[1990,2990,3990,4990],
  individualSkinCheckoutEnabled:false,
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
window.divinaIdentityRightsV531 = window.divinaIdentityRightsReleaseV542;

window.divinaAmazonStoreReleaseV543 = Object.freeze({
  version:543,
  macroStage:'9-of-14',
  title:'Loja Amazon',
  core:amazonStore,
  audit:()=>amazonStore?.audit?.()||null,
  status:()=>amazonStore?.status?.()||null,
  productCount:21,
  collectionCount:4,
  associateTag:'orbedasrealid-20',
  destinationHost:'www.amazon.com.br',
  affiliateDisclosureAdjacent:true,
  checkoutInternal:false,
  priceCache:false,
  stockCache:false,
  ratingCache:false,
  officialPartnershipClaim:false,
  privateContentReads:0,
  permanentAnimationLoops:0,
  realBilling:false,
  environment:'staging'
});

window.divinaPublicLibraryReleaseV544 = Object.freeze({
  version:544,
  macroStage:'10-of-14',
  title:'Biblioteca Pública, 78 Cartas, Guias e Busca',
  core:publicLibrary,
  audit:()=>publicLibrary?.audit?.()||null,
  status:()=>publicLibrary?.status?.()||null,
  cards:78,
  directCards:78,
  deepMeanings:78,
  publicGuides:8,
  searchablePages:134,
  privateSearchReads:0,
  mutationObservers:0,
  permanentAnimationLoops:0,
  oneCanonicalOrb:true,
  environment:'staging'
});

window.divinaInternationalParityReleaseV545 = Object.freeze({
  version:545,
  macroStage:'11-of-14',
  title:'Paridade Pública PT-BR, Inglês e Espanhol',
  core:internationalParity,
  audit:()=>internationalParity?.audit?.()||null,
  status:()=>internationalParity?.status?.()||null,
  languages:3,
  publicWorlds:9,
  localizedCardPages:156,
  totalCardPages:234,
  reversedCards:false,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  privateContentReads:0,
  permanentAnimationLoops:0,
  environment:'staging'
});

window.divinaPwaPerformanceRecoveryReleaseV546 = Object.freeze({
  version:546,
  macroStage:'12-of-14',
  title:'PWA, Performance, Offline e Recuperação',
  core:pwaPerformanceRecovery,
  contract:pwaPerformanceRecovery?.status?.() || null,
  audit:()=>pwaPerformanceRecovery?.audit?.() || null,
  status:()=>pwaPerformanceRecovery?.status?.() || null,
  targets:Object.freeze({touchResponseMs:100,LCPms:2500,INPms:200,CLS:0.1}),
  targetFps:Object.freeze({standard:60,fallback:30,reduced:20}),
  offlineWorlds:Object.freeze(['tarot','daily-revealed','library','journal-local','whit-local','current-skin']),
  onlineOnly:Object.freeze(['account-authority','billing','admin','consultation-submit','whit-online']),
  versionedCache:true,
  safeWorkerUpdate:true,
  navigationPreload:true,
  oneCanonicalOrb:true,
  privateContentReads:0,
  storageWrites:0,
  permanentAnimationLoops:0,
  environment:'staging'
});

window.divinaSecurityPrivacyReleaseV547 = Object.freeze({
  version:547,
  macroStage:'13-of-14',
  title:'Segurança, Privacidade e Matriz Física',
  core:securityPrivacy,
  contract:securityPrivacy?.status?.()||null,
  audit:()=>securityPrivacy?.audit?.()||null,
  status:()=>securityPrivacy?.status?.()||null,
  htmlSecurityCoverage:321,
  physicalProfiles:9,
  physicalCases:59,
  automaticPhysicalPasses:0,
  analyticsRetentionDays:90,
  hashedOwnerAllowlist:true,
  transactionalRateLimit:true,
  atomicRecoveryCode:true,
  backupAutomationVerified:false,
  restoreVerified:false,
  oneCanonicalOrb:true,
  mutationObservers:0,
  permanentAnimationLoops:0,
  privateContentReads:0,
  apiCalls:0,
  environment:'staging'
});

window.divinaOwnerObservatoryReleaseV532 = Object.freeze({
  version:548,
  macroStage:'14-of-14',
  route:'admin',
  lazyLoaded:true,
  modules:18,
  placeholderModules:0,
  ownerOnly:true,
  verifiedEmailRequired:true,
  mfaAal2Required:true,
  recoveryCodesRequired:true,
  adminAuthority:'AdminEngine + admin-api-v548',
  analyticsAuthority:'AdminIntelligenceV322',
  editorialAuthority:'AdminMediaV320',
  oneCanonicalOrb:true,
  independentAuthEngines:0,
  privateContentReads:0,
  personalIdentifierReads:0,
  privateSchemaReads:0,
  realBilling:false,
  productionPublish:false,
  storeSubmission:false,
  sol:false,
  status:()=>globalThis.divinaOwnerObservatoryV532?.status?.()||Object.freeze({release:'V548',loaded:false,route:'admin'})
});

window.divinaCompletionReleaseV548 = Object.freeze({
  version:548,macroStage:'14-of-14',title:'QA Supremo e Owner Review',route:'admin',
  technicalConstructionComplete:true,ownerReviewRequired:true,physicalEvidenceRequired:true,
  backupAutomationVerified:false,restoreVerified:false,readyToAdminister:false,
  ownerOnly:true,mfaStepUpRequired:true,expectedPhysicalProfiles:9,expectedPhysicalEvaluations:471,
  automaticPhysicalPasses:0,oneCanonicalOrb:true,permanentAnimationLoops:0,privateContentReads:0,
  productionPublish:false,realBilling:false,dns:false,storeSubmission:false,environment:'staging',
  status:()=>globalThis.divinaCompletionCenterV548?.audit?.()||Object.freeze({release:'V548',loaded:false,readyToAdminister:false})
});

window.divinaFluiditySupremeReleaseV549 = Object.freeze({
  version:549,
  plan:'4.0-fluidity-supreme',
  macroStage:'1-of-14',
  title:'Auditoria viva e baseline de fluidez',
  preserves:'V548',
  iphonePriority:true,
  oneCanonicalOrb:true,
  heavyScenePausedDuringNavigation:true,
  menuAndNavigationShareBudget:true,
  targetFps:60,
  fallbackFps:30,
  inpBudgetMs:200,
  touchResponseBudgetMs:100,
  clsBudget:0.1,
  tarotFireRemoved:true,
  privateContentReads:0,
  apiCalls:0,
  status:()=>globalThis.divinaOrbFluidNavigationV549?.status?.()
    || globalThis.divinaOrbFluidNavigationV535?.status?.()
    || Object.freeze({release:'V549',loaded:false,macroStage:'1-of-14'})
});

window.divinaSingleOrbPhysicsReleaseV550 = Object.freeze({
  version:550,
  plan:'4.0-fluidity-supreme',
  macroStage:'2-of-14',
  title:'Orbe persistente, motor e física únicos',
  preserves:'V549',
  iphonePriority:true,
  oneCanonicalOrb:true,
  oneOrbMotionClock:true,
  projectionMode:'event-snapshot-v550',
  projectionPermanentLoops:0,
  journeyMirrorMode:'single-snapshot-v550',
  journeyMirrorAnimationLoops:0,
  heavyScenePausedDuringNavigation:true,
  privateContentReads:0,
  apiCalls:0,
  status:()=>Object.freeze({
    release:'V550',
    orb:supremeOrb?.snapshot?.()||null,
    presence:orbUniversalPresence?.status?.()||null,
    journey:orbIOSJourney?.status?.()||null,
    motion:orbMotionV207.snapshot?.()||null
  })
});

window.divinaIOSNavigationReleaseV551 = Object.freeze({
  version:551,
  plan:'4.0-fluidity-supreme',
  macroStage:'3-of-14',
  title:'Navegação, Menu e transições iOS',
  preserves:'V550',
  iphonePriority:true,
  motionCurve:'cubic-bezier(.22,.82,.24,1)',
  responseMs:150,
  menuSettleMs:280,
  menuCloseMs:180,
  screenArrivalMs:260,
  menuOpensOverCurrentRoute:true,
  nestedOrbClaimRestoration:true,
  duplicateCloseButton:false,
  portalEarlyTouch:true,
  transitionEffectsPaused:true,
  privateContentReads:0,
  apiCalls:0,
  status:()=>Object.freeze({
    release:'V551',
    menu:globalThis.divinaMenuV502?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null,
    fluidity:orbFluidNavigation?.status?.()||null
  })
});

window.divinaHomeLivingReleaseV552 = Object.freeze({
  version:552,
  plan:'4.0-fluidity-supreme',
  macroStage:'4-of-14',
  title:'Home Viva — centro absoluto e aura responsiva',
  preserves:'V551',
  iphonePriority:true,
  visibleHomeContent:'one-canonical-orb',
  viewportCenter:'absolute-dynamic-viewport',
  safeAreaAware:true,
  externalAuraLoops:0,
  externalAuraEngine:false,
  existingOrbStateDriven:true,
  navigationAuraPaused:true,
  privateContentReads:0,
  apiCalls:0,
  status:()=>Object.freeze({
    release:'V552',
    screen:document.body?.dataset?.screen||null,
    centered:document.body?.dataset?.screen==='home',
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaTarotFreeSupremeReleaseV553 = Object.freeze({
  version:553,
  plan:'4.0-fluidity-supreme',
  macroStage:'5-of-14',
  title:'Tarot Livre Supremo sem fogo',
  preserves:'V552',
  iphonePriority:true,
  deckSize:78,
  normalOnly:true,
  noRepeats:true,
  gridColumns:6,
  automaticMeanings:false,
  fireEngine:false,
  birthTravelMs:280,
  constrainedBirthTravelMs:190,
  historyTransitionMs:160,
  responseBudgetMs:80,
  portalBackRedrawsPerBirth:0,
  gridFullImageRequests:0,
  atlasGrid:true,
  universePausedDuringCardFlight:true,
  privateContentReads:0,
  apiCalls:0,
  status:()=>Object.freeze({
    release:'V553',
    tarot:globalThis.divinaTarotLivreV517?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaDailySpreadsReleaseV554 = Object.freeze({
  version:554,
  plan:'4.0-fluidity-supreme',
  macroStage:'6-of-14',
  title:'Carta do Dia e Tiragens — universo funcional Free/Premium',
  preserves:'V553',
  iphonePriority:true,
  dailyOnePerBrasiliaDay:true,
  dailyNormalOnly:true,
  dailyPermanentAnimationLoops:0,
  dailyInteractionBurstMs:320,
  spreadMethods:15,
  freeSpreads:4,
  premiumSpreads:11,
  premiumAuthority:'server-confirmed-premium_lifetime',
  celticCrossPositions:10,
  royalTableCards:78,
  royalTableColumns:13,
  uniqueCards:true,
  reversedCards:false,
  canonicalOrb:true,
  gridFullImageRequests:0,
  atlasGrid:true,
  paidAiRequired:false,
  status:()=>Object.freeze({
    release:'V554',
    daily:globalThis.divinaDailyWorldV509?.status?.()||null,
    spreads:globalThis.divinaSpreadsV331?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaSchoolLibraryReleaseV555 = Object.freeze({
  version:555,
  plan:'4.0-fluidity-supreme',
  macroStage:'7-of-14',
  title:'Escola organizada e Biblioteca Portal Mágico',
  preserves:'V554',
  iphonePriority:true,
  schoolModules:17,
  schoolLessons:124,
  schoolStages:3,
  schoolDuplicateMaps:0,
  freeSchoolLessons:17,
  premiumSchoolLessons:107,
  libraryCards:78,
  libraryPageSize:18,
  libraryGridFullImageRequests:0,
  canonicalOrb:true,
  permanentAnimationLoops:0,
  status:()=>Object.freeze({
    release:'V555',
    school:globalThis.divinaSchoolWorldV306?.status?.()||null,
    library:globalThis.divinaLibraryWorldV302?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaJournalMirrorReleaseV556 = Object.freeze({
  version:556,
  plan:'4.0-fluidity-supreme',
  macroStage:'8-of-14',
  title:'Diário privado e Espelho agregado',
  preserves:'V555',
  iphonePriority:true,
  privateByDefault:true,
  localFirst:true,
  autosaveDraft:true,
  timelinePageSize:12,
  timelineFullImageRequests:0,
  mirrorAggregateOnly:true,
  mirrorDiagnostic:false,
  adminBodyAccess:false,
  analyticsText:false,
  whitSilentRead:false,
  automaticCheckIn:false,
  canonicalOrb:true,
  permanentAnimationLoops:0,
  status:()=>Object.freeze({
    release:'V556',
    journal:globalThis.divinaJournalWorldV317?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaWhitLocalReleaseV557 = Object.freeze({
  version:557,
  plan:'4.0-fluidity-supreme',
  macroStage:'9-of-14',
  title:'Whit Local Suprema',
  preserves:'V556',
  iphonePriority:true,
  localDefault:true,
  requiresAccount:false,
  localApiCalls:0,
  localModelCalls:0,
  localCreditsUsed:0,
  sessionMemoryTurns:6,
  sessionMemoryPersistent:false,
  visibleContextOnly:true,
  journalSilentReads:0,
  schoolNoteSilentReads:0,
  tarotQuestionSilentReads:0,
  canonicalOrb:true,
  duplicateOrbs:0,
  mutationObservers:0,
  permanentAnimationLoops:0,
  onlineBilling:false,
  solEnabled:false,
  status:()=>Object.freeze({
    release:'V557',
    whit:globalThis.divinaWhitLocalV557?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaConsultationsReleaseV558 = Object.freeze({
  version:558,
  plan:'4.0-fluidity-supreme',
  macroStage:'10-of-14',
  title:'Consultas Supremas',
  preserves:'V557',
  servicePricesCents:Object.freeze([25000,20000,15000,5000]),
  adminPriceEditing:true,
  historicalPriceSnapshots:true,
  ownerEmail:'orbedasrealidades@hotmail.com',
  providerAcceptanceRequiredForSentLabel:true,
  realBilling:false,
  canonicalOrb:true,
  permanentAnimationLoops:0,
  status:()=>Object.freeze({
    release:'V558',
    world:globalThis.divinaConsultationsWorldV319?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaMediaSupremeReleaseV559 = Object.freeze({
  version:559,
  plan:'4.0-fluidity-supreme',
  macroStage:'11-of-14',
  title:'Música, Vídeos e De Frente com o Tarot',
  preserves:'V558',
  verifiedAlbums:2,
  verifiedTracks:18,
  publishedEpisodesAtRelease:0,
  publicSource:'supabase-rls-published-only',
  ownerMfaRequired:true,
  autoplay:false,
  activePlayersMaximum:1,
  inventedEpisodes:0,
  permanentAnimationLoops:0,
  productionPublish:false,
  environment:'staging',
  status:()=>Object.freeze({
    release:'V559',
    publicWorld:globalThis.divinaMusicVideoSupremeV559?.status?.()||null,
    adminWorld:globalThis.divinaAdminMediaSupremeV559?.status?.()||null,
    orb:supremeOrb?.snapshot?.()||null
  })
});

window.divinaPageDesignReleaseV560 = Object.freeze({
  version:560,
  plan:'4.0-fluidity-supreme',
  macroStage:'12-of-14',
  title:'Design de Páginas e Mobile Premium',
  preserves:'V559',
  core:pageDesignSupreme,
  worlds:17,
  families:7,
  viewportWidths:[320,350,375,390,430,768,1024,1280,1920],
  minimumTouchTargetPx:44,
  safeAreas:true,
  visualViewportAware:true,
  softwareKeyboardAware:true,
  zoom200Resilient:true,
  reducedMotion:true,
  highContrast:true,
  forcedColors:true,
  canonicalOrb:true,
  duplicateOrbs:0,
  mutationObservers:0,
  permanentAnimationLoops:0,
  privateReads:0,
  storageWrites:0,
  apiCalls:0,
  productionPublish:false,
  realBilling:false,
  environment:'staging',
  status:()=>pageDesignSupreme?.status?.()||null,
  audit:()=>pageDesignSupreme?.audit?.()||null
});

window.divinaEthicalReturnReleaseV561 = Object.freeze({
  version:561,
  plan:'4.0-fluidity-supreme',
  macroStage:'13-of-14',
  title:'Retenção Ética e Conteúdo Diário',
  preserves:'V560',
  core:ethicalReturn,
  schoolDailyChallenges:14,
  streaks:false,
  punishment:false,
  history:'local-route-ids-and-days-only',
  favorites:'local-explicit-only',
  journalCalendarBridge:true,
  journalPrivateTextReads:0,
  dailyCardIdentityInNotification:false,
  notificationConsent:'granular-explicit',
  notificationQuietHours:'22:00-08:00 America/Sao_Paulo',
  notificationProviderActive:false,
  notificationTestLocalOnly:true,
  analyticsConsentRequired:true,
  analyticsRetentionDays:90,
  analyticsRawIdentifiersStored:false,
  analyticsPrivateTextFields:0,
  preciseLocation:false,
  inventedEpisodes:0,
  inventedSkins:0,
  canonicalOrb:true,
  mutationObservers:0,
  permanentAnimationLoops:0,
  productionPublish:false,
  realBilling:false,
  environment:'staging',
  status:()=>ethicalReturn?.status?.()||null,
  audit:()=>ethicalReturn?.audit?.()||null
});

window.divinaQaSupremeLaunchReleaseV562 = Object.freeze({
  version:562,
  plan:'4.0-fluidity-supreme',
  macroStage:'14-of-14',
  title:'QA Supremo',
  preserves:'V561',
  core:qaSupremeLaunch,
  fixedIncident:'route-module-selection-v561',
  affectedWorldsFixed:Object.freeze(['tarot','daily','library','school','spreads','store']),
  evidenceStates:Object.freeze(['PASS','FAIL','BLOCKED','NOT RUN']),
  requiredP0:0,
  requiredP1:0,
  ownerApprovalRequired:true,
  ownerApprovalState:'BLOCKED',
  backupRestoreState:'BLOCKED',
  sandboxBillingState:'NOT RUN',
  productionPublish:false,
  dnsChanges:false,
  realBilling:false,
  storeSubmission:false,
  sol:false,
  environment:'staging',
  status:()=>qaSupremeLaunch?.status?.()||null,
  audit:()=>qaSupremeLaunch?.audit?.('release-api')||null
});

window.divinaResponsiveEnchantmentReleaseV533 = Object.freeze({
  version:533,
  macroStage:'9-of-10',
  core:responsiveEnchantment,
  contract:()=>responsiveEnchantment?.contract||null,
  viewport:()=>responsiveEnchantment?.viewport?.()||null,
  audit:()=>responsiveEnchantment?.audit?.()||null,
  status:()=>responsiveEnchantment?.status?.()||null,
  viewportWidths:[320,375,390,430,768,1024,1280,1920],
  orientations:['portrait','landscape'],
  minimumTouchTargetPx:44,
  safeAreas:true,
  visualViewportAware:true,
  keyboardAware:true,
  backNavigationScrollRestore:true,
  adaptiveParticles:true,
  pageVisibilityPause:true,
  reducedMotion:true,
  highContrast:true,
  pwaStandalone:true,
  selectiveOffline:true,
  skinsRouteRestored:true,
  skinCount:30,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  permanentAnimationLoops:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  realBilling:false,
  productionPublish:false,
  storeSubmission:false,
  sol:false
});

window.divinaQaSupremeReleaseV534 = Object.freeze({
  version:534,
  macroStage:'10-of-10',
  core:qaSupreme,
  contract:()=>qaSupreme?.status?.().contract||null,
  audit:reason=>qaSupreme?.audit?.(reason)||null,
  status:()=>qaSupreme?.status?.()||null,
  routeCount:17,
  requiredP0:0,
  requiredP1:0,
  ownerReviewRequired:true,
  ownerReviewState:'blocked-pending-manual-evidence',
  productionReady:false,
  environment:'staging',
  realBilling:false,
  productionPublish:false,
  dnsChanges:false,
  storeSubmission:false,
  sol:false
});

window.divinaWorldTruthReleaseV535 = Object.freeze({
  version:535,
  macroStage:'1-of-14',
  title:'Fonte de Verdade e Registro Vivo',
  core:worldTruth,
  registry:worldTruth?.registry || null,
  audit:() => worldTruth?.audit?.() || null,
  status:() => worldTruth?.status?.() || null,
  routeCount:17,
  oneCanonicalOrb:true,
  environment:'staging',
  realBilling:false,
  productionPublish:false,
  dnsChanges:false,
  storeSubmission:false,
  sol:false
});

window.divinaOrbFluidNavigationReleaseV535 = Object.freeze({
  version:535,
  macroStage:'1-of-14',
  core:orbFluidNavigation,
  audit:() => orbFluidNavigation?.audit?.() || null,
  status:() => orbFluidNavigation?.status?.() || null,
  singleFlight:true,
  navigationPrepareBudgetMs:pageLoader.navigationPrepareBudgetMs,
  mobileUniverseFps:45,
  routeScrollAnimation:false,
  independentOrbEngines:0,
  permanentAnimationLoops:0,
  privateContentReads:0,
  apiCalls:0,
  realBilling:false,
  productionPublish:false,
  sol:false
});

window.divinaVitalityReleaseV536 = Object.freeze({
  version:536,
  macroStage:'2-of-14',
  title:'Barramento de Vitalidade e Gramática Viva',
  bus:vitalityBus,
  grammar:livingGrammar,
  signal:(name, detail) => vitalityBus?.signal?.(name, detail) === true,
  subscribe:(listener, options) => vitalityBus?.subscribe?.(listener, options) || (() => {}),
  snapshot:() => vitalityBus?.snapshot?.() || null,
  audit:() => vitalityBus?.audit?.() || null,
  status:() => livingGrammar?.status?.() || null,
  oneCanonicalOrb:true,
  independentOrbEngines:0,
  permanentAnimationLoops:0,
  privateContentReads:0,
  formValueReads:0,
  storageReads:0,
  storageWrites:0,
  apiCalls:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false,
  sol:false
});

window.divinaOriginDiscoveryReleaseV537 = Object.freeze({
  version:537,
  macroStage:'3-of-14',
  title:'Origem, Home, Menu e Descoberta',
  core:originDiscovery,
  audit:() => originDiscovery?.audit?.() || null,
  status:() => originDiscovery?.status?.() || null,
  routeCount:17,
  trailCount:5,
  localSearch:true,
  homeVisibleContent:'one-canonical-orb',
  tarotFireRemoved:true,
  permanentAnimationLoops:0,
  independentOrbEngines:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  networkRequests:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false,
  sol:false
});

window.divinaTarotLivreReleaseV538 = Object.freeze({
  version:538,
  macroStage:'4-of-14',
  title:'Universo Vivo do Tarot Livre',
  responseBudgetMs:100,
  targetFps:{standard:60,constrained:30},
  atlasFirstProgressive:true,
  blankFrameFree:true,
  dragNavigation:false,
  normalOnly:true,
  noRepeats:true,
  deckSize:78,
  gridColumns:6,
  completedLayout:'13x6',
  meaningsInsideFreeTarot:false,
  fireEngine:false,
  permanentAnimationLoops:0,
  localAutosave:true,
  auditableState:true,
  environment:'staging',
  productionPublish:false,
  realBilling:false,
  sol:false
});

window.divinaSabedoriaVivaReleaseV539 = Object.freeze({
  version:539,
  macroStage:'5-of-14',
  title:'Sabedoria Viva Profunda',
  libraryCards:78,
  schoolModules:17,
  schoolLessons:124,
  journey:['library','school','spreads','journal'],
  whit:'optional-explicit-action-only',
  privateFieldReads:0,
  storageReads:0,
  networkCalls:0,
  permanentAnimationLoops:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false,
  sol:false
});

window.divinaWhitPresenceReleaseV540 = Object.freeze({
  version:540,
  macroStage:'6-of-14',
  title:'Whit Presença Profunda',
  localBasic:true,
  localCredits:0,
  localApiCalls:0,
  lunaOnlineCredits:1,
  terraOnlineCredits:10,
  solEnabled:false,
  phases:['listening','forming','answering','silence'],
  answerStructure:['observation','possibility','limit','next-gesture'],
  context:'visible-removable-consented',
  privateReads:0,
  permanentAnimationLoops:0,
  environment:'staging',
  productionPublish:false,
  realBilling:false
});

window.divinaOrbV208 = Object.freeze({
  version: 501,
  engine: realityOrb,
  supreme:supremeOrb,
  journey:orbIOSJourney,
  presence:orbUniversalPresence,
  whit:whitSupreme,
  whitDeep,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  wisdomDepth,
  experience:experienceConversion,
  experienceDepth,
  identity:identityRights,
  responsive:responsiveEnchantment,
  qa:qaSupreme,
  truth:worldTruth,
  fluidity:orbFluidNavigation,
  vitality:vitalityBus,
  grammar:livingGrammar,
  discovery:originDiscovery,
  recovery:pwaPerformanceRecovery,
  security:securityPrivacy,
  design:pageDesignSupreme,
  returnGarden:ethicalReturn,
  miniOrbs:supremeOrb?.projections?.() || [],
  snapshot:() => supremeOrb?.snapshot?.() || orbMotionV207.snapshot()
});

window.divinaOrbSupremeV501 = Object.freeze({
  version:501,
  core:supremeOrb,
  journey:orbIOSJourney,
  presence:orbUniversalPresence,
  whit:whitSupreme,
  whitDeep,
  tarot:tarotUniverse,
  wisdom:wisdomUniverse,
  experience:experienceConversion,
  experienceDepth,
  identity:identityRights,
  responsive:responsiveEnchantment,
  qa:qaSupreme,
  truth:worldTruth,
  fluidity:orbFluidNavigation,
  vitality:vitalityBus,
  grammar:livingGrammar,
  discovery:originDiscovery,
  recovery:pwaPerformanceRecovery,
  security:securityPrivacy,
  design:pageDesignSupreme,
  returnGarden:ethicalReturn,
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
        release:'V562',
        supremePlan:'4.0-fluidity-supreme',
        supremePlanMacroStages:14,
        currentMacroStage:'14-of-14',
        qaSupremeLaunch:'v562',
        qaSupremeLaunchPreserves:'v561',
        qaSupremeLaunchFixedIncident:'route-module-selection-v561',
        qaSupremeLaunchEvidenceStates:'PASS|FAIL|BLOCKED|NOT RUN',
        qaSupremeLaunchRequiredP0:0,
        qaSupremeLaunchRequiredP1:0,
        qaSupremeLaunchOwnerApprovalRequired:true,
        qaSupremeLaunchOwnerApprovalState:'BLOCKED',
        qaSupremeLaunchProductionReady:false,
        qaSupremeLaunchProductionPublish:false,
        qaSupremeLaunchRealBilling:false,
        qaSupremeLaunchSol:false,
        ethicalReturn:'v561',
        ethicalReturnPreserves:'v560',
        ethicalReturnSchoolChallenges:14,
        ethicalReturnStreaks:false,
        ethicalReturnPunishment:false,
        ethicalReturnHistory:'route-ids-and-days-local-only',
        ethicalReturnFavorites:'local-explicit-only',
        ethicalReturnJournalCalendarBridge:true,
        ethicalReturnJournalPrivateTextReads:0,
        ethicalReturnDailyCardIdentityInNotification:false,
        ethicalReturnNotificationConsent:'granular-explicit',
        ethicalReturnQuietHours:'22:00-08:00 America/Sao_Paulo',
        ethicalReturnNotificationProviderActive:false,
        ethicalReturnAnalyticsConsentRequired:true,
        ethicalReturnAnalyticsRetentionDays:90,
        ethicalReturnAnalyticsRawIdentifiersStored:false,
        ethicalReturnAnalyticsPrivateTextFields:0,
        ethicalReturnPreciseLocation:false,
        ethicalReturnInventedEpisodes:0,
        ethicalReturnInventedSkins:0,
        ethicalReturnMutationObservers:0,
        ethicalReturnPermanentAnimationLoops:0,
        pageDesignSupreme:'v560',
        pageDesignWorlds:17,
        pageDesignFamilies:7,
        pageDesignMinimumTouchTargetPx:44,
        pageDesignSafeAreas:true,
        pageDesignVisualViewportAware:true,
        pageDesignSoftwareKeyboardAware:true,
        pageDesignZoom200Resilient:true,
        pageDesignReducedMotion:true,
        pageDesignHighContrast:true,
        pageDesignForcedColors:true,
        pageDesignCanonicalOrb:true,
        pageDesignMutationObservers:0,
        pageDesignPermanentAnimationLoops:0,
        pageDesignPrivateReads:0,
        worldTruth:'v535',
        worldTruthRoutes:17,
        orbFluidNavigation:'v549',
        fluiditySupreme:'v549',
        fluiditySupremePreserves:'v548',
        fluiditySupremeIphonePriority:true,
        heavyScenePausedDuringNavigation:true,
        singleOrbPhysics:'v550',
        oneOrbMotionClock:true,
        orbProjectionMode:'event-snapshot-v550',
        orbProjectionPermanentLoops:0,
        orbJourneyMirrorMode:'single-snapshot-v550',
        orbJourneyMirrorAnimationLoops:0,
        iosNavigation:'v551',
        iosMotionCurve:'cubic-bezier(.22,.82,.24,1)',
        iosResponseMs:150,
        iosMenuSettleMs:280,
        iosMenuCloseMs:180,
        iosScreenArrivalMs:260,
        menuOpensOverCurrentRoute:true,
        nestedOrbClaimRestoration:true,
        duplicateMenuCloseButton:false,
        homeLiving:'v552',
        homeViewportCenter:'absolute-dynamic-viewport',
        homeSafeAreaAware:true,
        homeExternalAuraLoops:0,
        homeExternalAuraEngine:false,
        homeAuraDrivenByExistingOrbState:true,
        tarotFreeSupreme:'v553',
        tarotFreeDeckSize:78,
        tarotFreeNormalOnly:true,
        tarotFreeNoRepeats:true,
        tarotFreeGridColumns:6,
        tarotFreeAutomaticMeanings:false,
        tarotFreeBirthTravelMs:280,
        tarotFreeConstrainedBirthTravelMs:190,
        tarotFreeHistoryTransitionMs:160,
        tarotFreeResponseBudgetMs:80,
        tarotFreePortalBackRedrawsPerBirth:0,
        tarotFreeGridFullImageRequests:0,
        dailySpreadsSupreme:'v554',
        dailyOnePerBrasiliaDay:true,
        dailyPermanentAnimationLoops:0,
        spreadMethods:15,
        spreadFreeMethods:4,
        spreadPremiumMethods:11,
        spreadPremiumAuthority:'server-confirmed-premium_lifetime',
        spreadCanonicalOrb:true,
        spreadGridFullImageRequests:0,
        schoolLibrarySupreme:'v555',
        schoolModules:17,
        schoolLessons:124,
        schoolStages:3,
        schoolDuplicateMaps:0,
        schoolFreeLessons:17,
        schoolPremiumLessons:107,
        libraryCards:78,
        libraryPageSize:18,
        libraryCanonicalOrb:true,
        libraryGridFullImageRequests:0,
        journalMirrorSupreme:'v556',
        journalPrivateByDefault:true,
        journalTimelinePageSize:12,
        journalTimelineFullImageRequests:0,
        journalCanonicalOrb:true,
        journalAutomaticCheckIn:false,
        mirrorAggregateOnly:true,
        mirrorDiagnostic:false,
        adminJournalBodyAccess:false,
        analyticsJournalText:false,
        whitJournalSilentRead:false,
        whitLocalSupreme:'v557',
        whitLocalDefault:true,
        whitLocalSessionTurns:6,
        whitLocalSessionPersistent:false,
        whitLocalVisibleContextOnly:true,
        whitLocalMutationObservers:0,
        tarotFreeUniversePausedDuringCardFlight:true,
        vitalityBus:'v536',
        livingGrammar:'v536',
        originDiscovery:'v537',
        originDiscoveryRoutes:17,
        originDiscoveryTrails:5,
        homeVisibleContent:'one-canonical-orb',
        tarotFireRemoved:true,
        vitalityPermanentAnimationLoops:0,
        vitalityPrivateContentReads:0,
        vitalityApiCalls:0,
        orbNavigationSingleFlight:true,
        orbNavigationPrepareBudgetMs:pageLoader.navigationPrepareBudgetMs,
        mobileUniverseFps:45,
        routeScrollAnimation:false,
        supremeOrb:'v501',
        orbitalMenu:'v502-v517-tuned-v526-universal-presence',
        tarotLivre:'v538-progressive-no-fire',
        tarotLivreResponseBudgetMs:100,
        tarotLivreAtlasFirst:true,
        tarotLivreDragNavigation:false,
        tarotLivreAuditFingerprint:true,
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
        wisdomDepth:'v539',
        wisdomDepthJourney:['library','school','spreads','journal'],
        wisdomDepthPrivateReads:0,
        wisdomDepthPermanentAnimationLoops:0,
        whitPresenceDeep:'v540',
        whitLocalBasic:true,
        whitLocalApiCalls:0,
        whitLocalCredits:0,
        whitOnlineLunaCredits:1,
        whitOnlineTerraCredits:10,
        whitSolEnabled:false,
        whitResponsePhases:['listening','forming','answering','silence'],
        whitContext:'visible-removable-consented',
        whitPrivateReads:0,
        whitPermanentAnimationLoops:0,
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
        experienceConsultationPriceCents:[25000,20000,15000,5000],
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
        experienceDepth:'v541',
        experienceDepthMacroStage:'7-of-14',
        experienceConsultationChannel:'email-only',
        experienceMusicPlayerLazy:true,
        experienceVideoSearchShare:'published-only',
        experiencePointerMoveEffects:0,
        identityRights:'v542',
        identityMacroStage:'8-of-14',
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
        identitySkinsAlsoSoldIndividually:true,
        identityPaidSkinCount:29,
        identityIndividualSkinPriceTiersCents:[1990,2990,3990,4990],
        identityIndividualSkinCheckoutEnabled:false,
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
        amazonStore:'v543',
        amazonStoreMacroStage:'9-of-14',
        amazonStoreProducts:21,
        amazonStoreCollections:4,
        amazonStoreAssociateTag:'orbedasrealid-20',
        amazonStoreDestinationHost:'www.amazon.com.br',
        amazonStoreCheckoutInternal:false,
        amazonStorePriceCache:false,
        amazonStoreStockCache:false,
        amazonStorePrivateContentReads:0,
        amazonStorePermanentAnimationLoops:0,
        publicLibrary:'v544',
        publicLibraryMacroStage:'10-of-14',
        publicLibraryCards:78,
        publicLibraryDirectCards:78,
        publicLibraryDeepMeanings:78,
        publicLibraryGuides:8,
        publicLibrarySearchablePages:134,
        publicLibraryPrivateSearchReads:0,
        publicLibraryMutationObservers:0,
        publicLibraryPermanentAnimationLoops:0,
        internationalParity:'v545',
        internationalParityMacroStage:'11-of-14',
        internationalParityLanguages:3,
        internationalParityPublicWorlds:9,
        internationalParityLocalizedCardPages:156,
        internationalParityTotalCardPages:234,
        internationalParityReversedCards:false,
        internationalParityIndependentOrbEngines:0,
        internationalParityPrivateContentReads:0,
        internationalParityPermanentAnimationLoops:0,
        pwaPerformanceRecovery:'v546',
        pwaPerformanceRecoveryMacroStage:'12-of-14',
        pwaPerformanceTouchResponseBudgetMs:100,
        pwaPerformanceLcpBudgetMs:2500,
        pwaPerformanceInpBudgetMs:200,
        pwaPerformanceClsBudget:0.1,
        pwaPerformanceTargetFps:60,
        pwaPerformanceFallbackFps:30,
        pwaPerformanceReducedFps:20,
        pwaPerformanceVersionedCache:true,
        pwaPerformanceNavigationPreload:true,
        pwaPerformanceOfflineWhitLocal:true,
        pwaPerformanceOfflineAuthorityData:false,
        pwaPerformanceMutationObservers:0,
        pwaPerformancePermanentAnimationLoops:0,
        securityPrivacy:'v547',
        securityPrivacyMacroStage:'13-of-14',
        securityPrivacyHtmlCoverage:321,
        securityPrivacyPhysicalProfiles:9,
        securityPrivacyPhysicalCases:59,
        securityPrivacyAutomaticPhysicalPasses:0,
        securityPrivacyAnalyticsRetentionDays:90,
        securityPrivacyHashedOwnerAllowlist:true,
        securityPrivacyTransactionalRateLimit:true,
        securityPrivacyAtomicRecoveryCode:true,
        securityPrivacyBackupAutomationVerified:false,
        securityPrivacyRestoreVerified:false,
        securityPrivacyMutationObservers:0,
        securityPrivacyPermanentAnimationLoops:0,
        securityPrivacyPrivateContentReads:0,
        securityPrivacyApiCalls:0,
        ownerObservatory:'v548',
        ownerObservatoryMacroStage:'14-of-14',
        ownerObservatoryRoute:'admin',
        ownerObservatoryModules:18,
        ownerObservatoryPlaceholderModules:0,
        ownerObservatoryLazyLoaded:true,
        ownerObservatoryAdminAuthority:'AdminEngine + admin-api-v548',
        ownerObservatoryAnalyticsAuthority:'AdminIntelligenceV322',
        ownerObservatoryEditorialAuthority:'AdminMediaV320',
        ownerObservatoryOwnerOnly:true,
        ownerObservatoryVerifiedEmailRequired:true,
        ownerObservatoryMfaAal2Required:true,
        ownerObservatoryRecoveryCodesRequired:true,
        ownerObservatoryEnvironment:'staging',
        ownerObservatoryRealBilling:false,
        ownerObservatoryProductionPublish:false,
        ownerObservatoryStoreSubmission:false,
        ownerObservatorySol:false,
        ownerObservatoryJournalBodyReads:0,
        ownerObservatoryConsultationQuestionReads:0,
        ownerObservatoryAiPromptReads:0,
        ownerObservatoryAiResponseReads:0,
        ownerObservatoryPersonalIdentifierReads:0,
        ownerObservatoryPrivateSchemaReads:0,
        ownerObservatoryIndependentAuthEngines:0,
        ownerObservatoryIndependentOrbEngines:0,
        ownerObservatoryPermanentAnimationLoops:0,
        completionCenter:'v548',
        completionMacroStage:'14-of-14',
        completionTechnicalConstructionComplete:true,
        completionOwnerReviewRequired:true,
        completionAutomaticPhysicalPasses:0,
        completionExpectedPhysicalEvaluations:471,
        completionReadyToAdminister:false,
        completionPrivateContentReads:0,
        completionPermanentAnimationLoops:0,
        responsiveEnchantment:'v533',
        responsiveMacroStage:'9-of-10',
        responsiveViewportWidths:[320,375,390,430,768,1024,1280,1920],
        responsiveOrientations:['portrait','landscape'],
        responsiveMinimumTouchTargetPx:44,
        responsiveViewportFit:'cover',
        responsiveInteractiveWidget:'resizes-content',
        responsiveVisualViewportAware:true,
        responsiveKeyboardAware:true,
        responsiveBackNavigationScrollRestore:true,
        responsiveAdaptiveParticles:true,
        responsivePageVisibilityPause:true,
        responsiveReducedMotion:true,
        responsiveHighContrast:true,
        responsiveForcedColors:true,
        responsivePwaStandalone:true,
        responsiveSelectiveOffline:true,
        responsiveSkinsRouteRestored:Boolean(document.getElementById('skinsApp')),
        responsiveSkinCount:30,
        responsiveOneCanonicalOrb:true,
        responsiveIndependentOrbEngines:0,
        responsiveIndependentUniverseEngines:0,
        responsivePermanentAnimationLoops:0,
        responsivePrivateContentReads:0,
        responsiveStorageReads:0,
        responsiveStorageWrites:0,
        responsiveApiCalls:0,
        responsiveRealBilling:false,
        responsiveProductionPublish:false,
        responsiveStoreSubmission:false,
        responsiveSol:false,
        qaSupreme:'v534',
        qaSupremeMacroStage:'10-of-10',
        qaSupremeRouteCount:17,
        qaSupremeRequiredP0:0,
        qaSupremeRequiredP1:0,
        qaSupremeConsultationsAnchor:'sanctuary-parent-sibling',
        qaSupremeMenuDockMinimumGapPx:8,
        qaSupremeMinimumTouchTargetPx:44,
        qaSupremeOwnerReviewRequired:true,
        qaSupremeOwnerReviewState:'blocked-pending-manual-evidence',
        qaSupremeProductionReady:false,
        qaSupremeEnvironment:'staging',
        qaSupremeRealBilling:false,
        qaSupremeProductionPublish:false,
        qaSupremeDnsChanges:false,
        qaSupremeStoreSubmission:false,
        qaSupremeSol:false,
        qaSupremePrivateContentReads:0,
        qaSupremeStorageReads:0,
        qaSupremeStorageWrites:0,
        qaSupremeApiCalls:0,
        qaSupremePermanentAnimationLoops:0,
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
        adaptiveQuality:true,
        adaptiveFrameCadence:true,
        calmQualityRecovery:true,
        extraAnimationLoops:0,
        physicalCardJourney:true,
        decodedBeforeSwap:false,
        blankFrameFree:true,
        unexplainedFlyingCards:false,
        stellarFire:'removed-v537',
        trueCelestialFire:false,
        lightningStrokes:false,
        strokedFirePaths:0,
        whiteOverexposure:false,
        volumetricBillows:false,
        flameTongues:false,
        fireInsideUniverseCanvas:false,
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
        startPwaAfterBootV537();
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
    startPwaAfterBootV537();
  }
};
awaken();
