/* DIVINA BRUXA — WORK12 · MACROETAPA 10 · FLUIDEZ SUPREMA FINAL V598
   Service Worker mínimo, atômico e recuperável. A instalação só assume o
   portal quando HTML, aplicação, continuidade final, inteligência, câmaras,
   rito, navegação, universo e Orbe pertencem ao mesmo corte.
   Rede primeiro para código; cache apenas como chão seguro, nunca como prisão.
*/

const VERSION = 598;
const CACHE_PREFIX = 'divina-bruxa-';
const CACHE_NAME = 'divina-bruxa-work12-v598-final-fluidity';
const CORE = Object.freeze([
  './index.html',
  './app-v208.js?v=598-work12-final',
  './work12-final-continuity-v598.js?v=598-work12-final',
  './work12-final-continuity-v598.css?v=598-work12-final',
  './experience-intelligence-v597.js?v=597-work12-intelligence',
  './experience-intelligence-v597.css?v=597-work12-intelligence',
  './reality-chambers-v596.js?v=596-work12-chambers',
  './reality-chambers-v596.css?v=596-work12-chambers',
  './school-world-v306.js?v=596-work12-chambers',
  './journal-world-v317.js?v=596-work12-chambers',
  './reading-ritual-core-v595.js?v=595-work12-ritual',
  './reading-ritual-core-v595.css?v=595-work12-ritual',
  './daily-world-v509.js?v=595-work12-ritual',
  './whit-living-presence-v594.js?v=594-work12-whit',
  './orbital-menu-v502.js?v=593-work12-menu',
  './orbital-menu-v502.css?v=593-work12-menu',
  './navigation.js?v=592-work12-navigation',
  './work12-foundation-v589.js?v=592-work12-navigation',
  './page-loader-v1.js?v=592-work12-navigation',
  './living-universe-core-v524.js?v=590-work12-universe',
  './supreme-orb-core-v501.js?v=591-work12-orb',
  './orb-engine-v208.js?v=591-work12-orb',
  './orb-persistent-journey-v565.js?v=583-coordinate-travel',
  './whit-orb-soul-bridge-v581.js?v=592-work12-navigation',
  './divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
]);

const sameOrigin = request => new URL(request.url).origin === self.location.origin;
const freshRequest = request => new Request(request, { cache:'no-cache' });
const isCode = url => /\.(?:html?|js|mjs|css|json|webmanifest)$/i.test(url.pathname);

const fetchCore = async path => {
  const response = await fetch(new Request(path, { cache:'no-store' }));
  if (!response?.ok) throw new Error(`work12-core-${response?.status || 'network'}:${path}`);
  return response;
};

const validateCore = async responses => {
  const index = await responses.get('./index.html')?.clone().text();
  const app = await responses.get('./app-v208.js?v=598-work12-final')?.clone().text();
  const finalContinuity = await responses.get('./work12-final-continuity-v598.js?v=598-work12-final')?.clone().text();
  const finalStyles = await responses.get('./work12-final-continuity-v598.css?v=598-work12-final')?.clone().text();
  const intelligence = await responses.get('./experience-intelligence-v597.js?v=597-work12-intelligence')?.clone().text();
  const intelligenceStyles = await responses.get('./experience-intelligence-v597.css?v=597-work12-intelligence')?.clone().text();
  const chambers = await responses.get('./reality-chambers-v596.js?v=596-work12-chambers')?.clone().text();
  const chamberStyles = await responses.get('./reality-chambers-v596.css?v=596-work12-chambers')?.clone().text();
  const school = await responses.get('./school-world-v306.js?v=596-work12-chambers')?.clone().text();
  const journal = await responses.get('./journal-world-v317.js?v=596-work12-chambers')?.clone().text();
  const ritual = await responses.get('./reading-ritual-core-v595.js?v=595-work12-ritual')?.clone().text();
  const ritualStyles = await responses.get('./reading-ritual-core-v595.css?v=595-work12-ritual')?.clone().text();
  const daily = await responses.get('./daily-world-v509.js?v=595-work12-ritual')?.clone().text();
  const whitPresence = await responses.get('./whit-living-presence-v594.js?v=594-work12-whit')?.clone().text();
  const menu = await responses.get('./orbital-menu-v502.js?v=593-work12-menu')?.clone().text();
  const menuStyles = await responses.get('./orbital-menu-v502.css?v=593-work12-menu')?.clone().text();
  const navigation = await responses.get('./navigation.js?v=592-work12-navigation')?.clone().text();
  const foundation = await responses.get('./work12-foundation-v589.js?v=592-work12-navigation')?.clone().text();
  const pageLoader = await responses.get('./page-loader-v1.js?v=592-work12-navigation')?.clone().text();
  const universe = await responses.get('./living-universe-core-v524.js?v=590-work12-universe')?.clone().text();
  const orb = await responses.get('./supreme-orb-core-v501.js?v=591-work12-orb')?.clone().text();
  const renderer = await responses.get('./orb-engine-v208.js?v=591-work12-orb')?.clone().text();
  const journey = await responses.get('./orb-persistent-journey-v565.js?v=583-coordinate-travel')?.clone().text();
  const soul = await responses.get('./whit-orb-soul-bridge-v581.js?v=592-work12-navigation')?.clone().text();
  if (!index?.includes('name="divina-work12" content="V598"')) throw new Error('work12-index-version-mismatch');
  if (!index.includes('app-v208.js?v=598-work12-final')
    || !index.includes('work12-final-continuity-v598.css?v=598-work12-final')
    || !index.includes('experience-intelligence-v597.css?v=597-work12-intelligence')
    || !index.includes('reality-chambers-v596.css?v=596-work12-chambers')
    || !index.includes('reading-ritual-core-v595.css?v=595-work12-ritual')) {
    throw new Error('work12-index-chambers-mismatch');
  }
  if (!app?.includes("./navigation.js?v=592-work12-navigation")) throw new Error('work12-app-router-mismatch');
  if (!app.includes("./work12-foundation-v589.js?v=592-work12-navigation")) throw new Error('work12-app-foundation-mismatch');
  if (!app.includes("./living-universe-core-v524.js?v=590-work12-universe")) throw new Error('work12-app-universe-mismatch');
  if (!app.includes("./supreme-orb-core-v501.js?v=591-work12-orb") || !app.includes('divinaWork12Macro3V591')) {
    throw new Error('work12-app-orb-mismatch');
  }
  if (!app.includes('divinaWork12Macro4V592')) throw new Error('work12-app-navigation-mismatch');
  if (!app.includes('divinaWork12Macro5V593') || !app.includes("orbital-menu-v502.js?v=593-work12-menu")) {
    throw new Error('work12-app-menu-mismatch');
  }
  if (!app.includes('divinaWork12Macro6V594') || !app.includes("whit-living-presence-v594.js?v=594-work12-whit")) {
    throw new Error('work12-app-whit-mismatch');
  }
  if (!app.includes('divinaWork12Macro7V595') || !app.includes("reading-ritual-core-v595.js?v=595-work12-ritual")) {
    throw new Error('work12-app-reading-ritual-mismatch');
  }
  if (!app.includes('divinaWork12Macro8V596') || !app.includes("reality-chambers-v596.js?v=596-work12-chambers")) {
    throw new Error('work12-app-reality-chambers-mismatch');
  }
  if (!app.includes('divinaWork12Macro9V597')
    || !app.includes("experience-intelligence-v597.js?v=597-work12-intelligence")) {
    throw new Error('work12-app-experience-intelligence-mismatch');
  }
  if (!app.includes('divinaWork12Macro10V598')
    || !app.includes("work12-final-continuity-v598.js?v=598-work12-final")
    || !app.includes("stage:'fluidez-suprema-final'")) {
    throw new Error('work12-app-final-continuity-mismatch');
  }
  if (!finalContinuity?.includes('FINAL_CONTINUITY_CONTRACT_V598')
    || !finalContinuity.includes("homeSingleTap:'call-intentions'")
    || !finalContinuity.includes("homeDoubleTap:'tarot-free'")
    || !finalContinuity.includes('maximumVisibleIntentions:2')
    || !finalContinuity.includes('automaticWhitSpeech:false')
    || !finalContinuity.includes('permanentAnimationLoops:0')) {
    throw new Error('work12-final-continuity-contract-missing');
  }
  if (!finalStyles?.includes('body[data-screen="home"] .app-header')
    || !finalStyles.includes('body .magic-dock')
    || !finalStyles.includes('#tarot[data-tarot-world="orbe-os-v517"] .tl517__header')
    || !finalStyles.includes('@media(max-width:430px)')) {
    throw new Error('work12-final-continuity-styles-missing');
  }
  if (!intelligence?.includes('EXPERIENCE_INTELLIGENCE_CONTRACT_V597')
    || !intelligence.includes('local-deterministic-context-coordinator')
    || !intelligence.includes('automaticWhitSpeech:false')
    || !intelligence.includes('privateContentReads:0')
    || !intelligence.includes("this.setBudget('essential', 'movement'")) {
    throw new Error('work12-experience-intelligence-contract-missing');
  }
  if (!intelligenceStyles?.includes('[data-experience-budget="essential"]')
    || !intelligenceStyles.includes('[data-experience-state="focus"]')
    || !intelligenceStyles.includes('@media(max-width:430px)')) {
    throw new Error('work12-experience-intelligence-styles-missing');
  }
  if (!chambers?.includes('REALITY_CHAMBERS_CONTRACT_V596')
    || !chambers.includes("states:Object.freeze(['threshold','awakening','present','engaged','travel'])")
    || !chambers.includes('maximumVisibleIntentions:2')
    || !chambers.includes('automaticWhitSpeech:false')) {
    throw new Error('work12-reality-chambers-contract-missing');
  }
  if (!chamberStyles?.includes('[data-db596-chamber-state="threshold"]')
    || !chamberStyles.includes('.db596-school-paths')
    || !chamberStyles.includes('.db596-store-return')
    || !chamberStyles.includes('scroll-snap-type:x mandatory')) {
    throw new Error('work12-reality-chambers-styles-missing');
  }
  if (!school?.includes("document.documentElement.dataset.realityChambers==='v596'")
    || !journal?.includes("document.documentElement.dataset.realityChambers === 'v596'")) {
    throw new Error('work12-reality-chambers-orb-authority-missing');
  }
  if (!ritual?.includes('READING_RITUAL_CONTRACT_V595')
    || !ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])")
    || !ritual.includes('automaticWhitSpeech:false')
    || !ritual.includes('oneDeferredTimer:true')) {
    throw new Error('work12-reading-ritual-contract-missing');
  }
  if (!ritualStyles?.includes('.db595-reading-intention')
    || !ritualStyles.includes('[data-reading-phase="silence"]')
    || !ritualStyles.includes('[data-reading-phase="depth"]')) {
    throw new Error('work12-reading-ritual-styles-missing');
  }
  if (!daily?.includes("readingRitualAuthority = 'work12-v595'")
    || !daily.includes("source:'daily-explicit-ritual'")
    || daily.includes("phrase:'Só existe uma carta para hoje")) {
    throw new Error('work12-daily-ritual-contract-missing');
  }
  if (!whitPresence?.includes('WHIT_LIVING_PRESENCE_CONTRACT_V594')
    || !whitPresence.includes('ordinaryTouchSpeech:false')
    || !whitPresence.includes("residence:'canonical-orb'")) {
    throw new Error('work12-whit-contract-missing');
  }
  if (!menu?.includes('const VERSION = 593;') || !menu.includes('maximumVisibleIntentions:2') || !menu.includes('progressiveReveal:true')) {
    throw new Error('work12-menu-contract-missing');
  }
  if (!menuStyles?.includes('db593IntentionBreath') || !menuStyles.includes('.db502-menu.has-intentions .db502-portal.is-offered')) {
    throw new Error('work12-menu-styles-contract-missing');
  }
  if (!navigation?.includes('const WORK12_HISTORY_RELEASE = 592;') || !navigation.includes("source:'history'")) {
    throw new Error('work12-router-contract-missing');
  }
  if (!foundation?.includes('WORK12_CONSTITUTION_V592') || !foundation.includes("navigationAuthority:this.orbNavigateProxy ? 'work12-v592'")) {
    throw new Error('work12-foundation-contract-missing');
  }
  if (!pageLoader?.includes('globalThis.divinaWork12V592') || !pageLoader.includes("source:'route-retry'")) {
    throw new Error('work12-page-loader-contract-missing');
  }
  if (!pageLoader.includes("daily-world-v509.js?v=595-work12-ritual")) {
    throw new Error('work12-page-loader-daily-ritual-mismatch');
  }
  if (!pageLoader.includes("school-world-v306.js?v=596-work12-chambers")
    || !pageLoader.includes("journal-world-v317.js?v=596-work12-chambers")) {
    throw new Error('work12-page-loader-chambers-mismatch');
  }
  if (!universe?.includes('const RELEASE = 590;') || !universe.includes('essentialUniverseDuringTravel:true')) {
    throw new Error('work12-universe-contract-missing');
  }
  if (!orb?.includes('const WORK12_RELEASE = 591;') || !orb.includes('auditPersistence(reason')) {
    throw new Error('work12-orb-identity-contract-missing');
  }
  if (!renderer?.includes('const ORB_RENDERER_RELEASE = 591;') || !renderer.includes('sharedMotionClock:true')) {
    throw new Error('work12-orb-renderer-contract-missing');
  }
  if (!journey?.includes('travelerCopies:0') || !journey.includes('physicalOrbTransport:true')) {
    throw new Error('work12-orb-journey-contract-missing');
  }
  if (!soul?.includes('const VERSION = 591;') || !soul.includes("'divina:work12-state'") || !soul.includes("591|592")) {
    throw new Error('work12-orb-soul-contract-missing');
  }
  return true;
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const responses = new Map();
    for (const path of CORE) responses.set(path, await fetchCore(path));
    await validateCore(responses);
    const cache = await caches.open(CACHE_NAME);
    for (const [path,response] of responses) await cache.put(path,response.clone());
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    for (const client of clients) {
      try {
        client.postMessage({ type:'DIVINA_WORK12_FOUNDATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_NAVIGATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_UNIVERSE_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_ORB_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_MENU_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_WHIT_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_RITUAL_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_CHAMBERS_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_INTELLIGENCE_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_FINAL_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_RELEASE_READY', version:VERSION });
      } catch {}
    }
  })());
});

const cacheSuccessful = async (cacheKey, response) => {
  if (!response?.ok || response.type === 'opaque') return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(cacheKey,response.clone()).catch(() => {});
  return response;
};

const networkFirst = async (request, fallbackKey = request) => {
  try {
    const response = await fetch(freshRequest(request));
    return cacheSuccessful(fallbackKey,response);
  } catch (error) {
    const cached = await caches.match(fallbackKey);
    if (cached) return cached;
    throw error;
  }
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request)) return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request,'./index.html'));
    return;
  }

  if (isCode(url)) {
    event.respondWith(networkFirst(request,request));
    return;
  }

  // Imagens, fontes e mídia continuam sob o cache HTTP do navegador. O WORK12
  // não ocupa o armazenamento do iPhone com um catálogo visual ilimitado.
  event.respondWith(fetch(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'WORK12_STATUS') {
    event.source?.postMessage?.({
      type:'WORK12_STATUS',
      version:VERSION,
      cache:CACHE_NAME,
      core:[...CORE]
    });
  }
  if (event.data?.type === 'CLEAR_DIVINA_CACHES') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX))
        .map(key => caches.delete(key)));
      event.source?.postMessage?.({ type:'DIVINA_CACHES_CLEARED', version:VERSION });
    })());
  }
});
