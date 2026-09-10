/* DIVINA BRUXA 2.0 — REBIRTH R003 · CARREGADOR DE MUNDOS V302
   Cada mundo nasce sob demanda. Tarot Livre V301 e Biblioteca Viva V302 são mundos Rebirth; os demais aguardam sua própria etapa. */

import {
  normalizeRouteId,
  routeHasModule,
  routeLabel,
  routeNeedsPortalStyles
} from './route-registry-v180.js?v=300';

const pageTasks = new Map();
const sharedTasks = new Map();
const LOAD_TIMEOUT_MS = 15000;
const PORTAL_STYLES_ID = 'divinaPortalStylesV180';
const PORTAL_STYLES_HREF = 'divina-core-v179.css?v=179';
let loadingSequence = 0;

function once(map, key, factory) {
  if (map.has(key)) return map.get(key);
  const task = Promise.resolve().then(factory).catch(error => {
    map.delete(key);
    throw error;
  });
  map.set(key, task);
  return task;
}

function withTimeout(task, timeout, message) {
  let timer = 0;
  return Promise.race([
    Promise.resolve(task),
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), timeout); })
  ]).finally(() => clearTimeout(timer));
}

function ensureStyle(id, href) {
  return once(sharedTasks, `style:${id}`, () => withTimeout(new Promise((resolve, reject) => {
    let link = document.getElementById(id);
    if (link?.sheet) { resolve(link); return; }
    if (link) link.remove();
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.rebirthStyle = 'true';
    link.addEventListener('load', () => resolve(link), { once:true });
    link.addEventListener('error', () => reject(new Error(`Estilo indisponível: ${href}`)), { once:true });
    document.head.append(link);
  }), LOAD_TIMEOUT_MS, `Tempo esgotado ao carregar ${href}.`));
}

function loadPortalStyles() {
  return ensureStyle(PORTAL_STYLES_ID, PORTAL_STYLES_HREF);
}

function announceLoading(type, detail) {
  document.dispatchEvent(new CustomEvent(`divina:loading-${type}`, { detail }));
}

function createRecovery(screen, id) {
  if (!screen || screen.querySelector(':scope > [data-route-recovery]')) return;
  const panel = document.createElement('aside');
  panel.className = 'db-route-recovery';
  panel.dataset.routeRecovery = id;
  panel.setAttribute('role', 'alert');
  panel.setAttribute('aria-live', 'assertive');
  panel.innerHTML = `<span class="db-route-recovery__sigil" aria-hidden="true">✦</span><h3>Este mundo não abriu por completo</h3><p>Nada foi perdido.</p><div><button type="button" data-route-retry="${id}">TENTAR NOVAMENTE</button><button type="button" class="secondary" data-go="home">VOLTAR À ORBE</button></div>`;
  screen.prepend(panel);
}

function clearRecovery(screen) {
  screen?.querySelector(':scope > [data-route-recovery]')?.remove();
}

const LOADING_MESSAGES = Object.freeze({
  tarot:'A Orbe abre o círculo…',
  daily:'Abrindo o encontro de hoje…',
  library:'Abrindo as 78 cartas…',
  spreads:'Preparando sua tiragem…',
  school:'Abrindo a Escola…',
  journal:'Abrindo seu espaço privado…',
  ai:'Whit está abrindo este espaço…',
  store:'Abrindo a Loja Mística…',
  consultations:'Abrindo Consultas…',
  music:'Abrindo Música…',
  videos:'Abrindo Vídeos…',
  skins:'Vestindo a Orbe…'
});

export function createPageLoader({ config, go, authClient = globalThis.divinaAuth } = {}) {
  const $ = selector => document.querySelector(selector);
  const abort = new AbortController();
  let observer = null;

  const ensureJournal = () => once(sharedTasks, 'journal', async () => {
    const [{ JournalEngine }, { RhythmEngine }] = await Promise.all([
      import('./journal-engine.js?v=187'),
      import('./rhythm-v6.js')
    ]);
    const journal = new JournalEngine($('#journalApp'));
    new RhythmEngine($('#journalRhythm'));
    return journal;
  });

  const remember = entry => ensureJournal().then(journal => journal?.add?.(entry)).catch(() => {});

  const ensureCommerce = () => once(sharedTasks, 'commerce', async () => {
    const { CommerceEngine } = await import('./commerce-engine.js?v=148');
    return new CommerceEngine({
      store:$('#storeApp'),
      consultations:$('#consultationApp'),
      subscriptions:$('#subscriptionApp')
    }, config);
  });

  const ensureMedia = () => once(sharedTasks, 'media', async () => {
    const [{ MediaEngineV192 }, { EditorialJourneyV192 }] = await Promise.all([
      import('./media-engine-v192.js?v=192'),
      import('./editorial-journey-v192.js?v=192')
    ]);
    const media = new MediaEngineV192({ videos:$('#videoApp'), music:$('#musicApp') }, config);
    new EditorialJourneyV192($('#videoApp'), 'videos');
    new EditorialJourneyV192($('#musicApp'), 'music');
    return media;
  });

  const loaders = Object.freeze({
    tarot: async () => {
      const [, module] = await Promise.all([
        ensureStyle('divinaTarotRebirthV301', 'free-tarot-world-v301.css?v=301'),
        import('./free-tarot-world-v301.js?v=301')
      ]);
      return new module.FreeTarot($('#tarot'));
    },
    daily: async () => {
      const { DailyRitual } = await import('./ritual-engine.js?v=183');
      return new DailyRitual($('#dailyCard'), remember, { authClient });
    },
    library: async () => {
      const [, module] = await Promise.all([
        ensureStyle('divinaLibraryRebirthV302', 'library-world-v302.css?v=302'),
        import('./library-world-v302.js?v=302')
      ]);
      return new module.LibraryWorldV302($('#cardLibraryApp'));
    },
    school: async () => {
      const { SchoolEngine } = await import('./school-engine.js?v=186');
      return new SchoolEngine($('#schoolApp'));
    },
    spreads: async () => {
      const { SpreadsEngine } = await import('./spreads-engine.js?v=213');
      return new SpreadsEngine({
        grid:$('#spreadGrid'),
        result:$('#spreadResult'),
        intention:$('#spreadIntention'),
        history:$('#spreadHistory')
      }, remember);
    },
    journal:ensureJournal,
    ai: async () => {
      const { AIEngine } = await import('./ai-engine.js?v=190');
      return new AIEngine($('#aiApp'), config);
    },
    store: async () => {
      await ensureCommerce();
      const [{ StoreEngine }, { EditorialJourneyV192 }] = await Promise.all([
        import('./store-engine.js?v=192'),
        import('./editorial-journey-v192.js?v=192')
      ]);
      const engine = new StoreEngine($('#storeApp'), config);
      new EditorialJourneyV192($('#storeApp'), 'store');
      return engine;
    },
    consultations: async () => {
      await ensureCommerce();
      const { ConsultationEngine } = await import('./consultation-engine.js?v=188');
      return new ConsultationEngine($('#consultationApp'), config);
    },
    subscriptions: async () => {
      await ensureCommerce();
      const { PremiumEngineV191 } = await import('./premium-engine-v191.js?v=191');
      return new PremiumEngineV191($('#subscriptionApp'));
    },
    skins: async () => {
      const { SkinsEngineV201 } = await import('./skins-v201.js?v=201');
      return new SkinsEngineV201($('#skinsApp'));
    },
    videos:ensureMedia,
    music:ensureMedia,
    notifications: async () => {
      const { CelestialNotificationEngine } = await import('./notification-engine-v150.js?v=150');
      return new CelestialNotificationEngine($('#notificationApp'), go);
    },
    admin: async () => {
      const { AdminEngine } = await import('./admin-engine.js?v=150');
      return new AdminEngine($('#adminApp'));
    }
  });

  const warmers = Object.freeze({
    tarot: () => Promise.all([
      ensureStyle('divinaTarotRebirthV301', 'free-tarot-world-v301.css?v=301'),
      import('./free-tarot-world-v301.js?v=301')
    ]),
    daily: () => import('./ritual-engine.js?v=183'),
    library: () => Promise.all([
      ensureStyle('divinaLibraryRebirthV302', 'library-world-v302.css?v=302'),
      import('./library-world-v302.js?v=302')
    ]),
    consultations: () => Promise.all([
      import('./commerce-engine.js?v=148'),
      import('./consultation-engine.js?v=188')
    ]),
    notifications: () => import('./notification-engine-v150.js?v=150')
  });

  const warm = ids => {
    const list = Array.isArray(ids) ? ids : [ids];
    return Promise.allSettled(list.filter(id => warmers[id]).map(id => once(sharedTasks, `warm:${id}`, warmers[id])));
  };

  const load = rawId => {
    const id = normalizeRouteId(rawId);
    if (!routeHasModule(id)) return Promise.resolve(null);
    const loader = loaders[id];
    if (!loader) return Promise.reject(new Error(`Motor ausente para ${id}`));

    return once(pageTasks, id, async () => {
      const screen = document.getElementById(id);
      const html = document.documentElement;
      const loadingId = `world:${id}:${++loadingSequence}`;
      clearRecovery(screen);
      screen?.setAttribute('aria-busy', 'true');
      screen?.setAttribute('data-module-state', 'loading');
      html.dataset.pageLoading = id;
      announceLoading('start', {
        id:loadingId,
        pageId:id,
        label:routeLabel(id),
        message:LOADING_MESSAGES[id]
      });
      document.dispatchEvent(new CustomEvent('divina:page-loading', { detail:{ id } }));

      try {
        const styleTask = routeNeedsPortalStyles(id) ? loadPortalStyles() : Promise.resolve(null);
        const [, instance] = await Promise.all([
          styleTask,
          withTimeout(loader(), LOAD_TIMEOUT_MS, `Tempo esgotado ao abrir ${routeLabel(id)}.`)
        ]);
        clearRecovery(screen);
        screen?.setAttribute('data-module-state', 'ready');
        document.dispatchEvent(new CustomEvent('divina:page-ready', { detail:{ id } }));
        return instance;
      } catch (error) {
        screen?.setAttribute('data-module-state', 'error');
        createRecovery(screen, id);
        document.dispatchEvent(new CustomEvent('divina:page-error', { detail:{ id, recoverable:true } }));
        globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:'Este mundo não abriu agora. Nada foi perdido.' }));
        console.error(`[Divina Rebirth] falha ao abrir ${id}`, error);
        throw error;
      } finally {
        announceLoading('end', { id:loadingId, pageId:id });
        screen?.removeAttribute('aria-busy');
        if (html.dataset.pageLoading === id) delete html.dataset.pageLoading;
      }
    });
  };

  const retry = id => {
    const route = normalizeRouteId(id);
    pageTasks.get(route)?.destroy?.();
    pageTasks.delete(route);
    clearRecovery(document.getElementById(route));
    return Promise.resolve(go ? go(route) : load(route));
  };

  const primeFromIntent = event => {
    const id = event.target.closest?.('[data-go]')?.dataset.go;
    if (id && routeHasModule(id)) load(id).catch(() => {});
  };

  document.addEventListener('pointerdown', primeFromIntent, { capture:true, passive:true, signal:abort.signal });
  document.addEventListener('focusin', primeFromIntent, { capture:true, signal:abort.signal });
  document.addEventListener('click', primeFromIntent, { capture:true, signal:abort.signal });
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-route-retry]');
    if (!button) return;
    event.preventDefault();
    retry(button.dataset.routeRetry).catch(() => {});
  }, { signal:abort.signal });

  observer = new MutationObserver(() => {
    const id = document.body.dataset.screen;
    if (id) load(id).catch(() => {});
  });
  observer.observe(document.body, { attributes:true, attributeFilter:['data-screen'] });

  return Object.freeze({
    load,
    prepare:load,
    retry,
    warm,
    go:id => Promise.resolve(go ? go(normalizeRouteId(id)) : load(id)),
    portalStylesReady:() => Boolean(document.getElementById(PORTAL_STYLES_ID)?.sheet),
    destroy:() => { abort.abort(); observer?.disconnect(); }
  });
}
