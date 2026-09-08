/* DIVINA BRUXA — CARREGADOR DE MUNDOS V1.23 · ORBE IA GOVERNADA V190
   Estilos e motores nascem sob demanda; toda falha oferece tentativa e retorno seguro. */

import {
  normalizeRouteId,
  routeHasModule,
  routeLabel,
  routeNeedsPortalStyles
} from './route-registry-v180.js?v=180';

const pageTasks = new Map();
const sharedTasks = new Map();
const PORTAL_STYLES_ID = 'divinaPortalStylesV180';
const PORTAL_STYLES_HREF = 'divina-core-v179.css?v=179';
const LOAD_TIMEOUT_MS = 15000;
let loadingSequence = 0;
let portalStyleAttempt = 0;

function announceLoading(type, detail) {
  document.dispatchEvent(new CustomEvent(`divina:loading-${type}`, { detail }));
}

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
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeout);
    })
  ]).finally(() => clearTimeout(timer));
}

function loadPortalStyles() {
  return once(sharedTasks, 'styles:portals:v180', () => withTimeout(new Promise((resolve, reject) => {
    let link = document.getElementById(PORTAL_STYLES_ID);
    const complete = candidate => {
      try {
        return Boolean(candidate?.sheet?.cssRules?.length > 100);
      } catch {
        return false;
      }
    };
    if (link?.dataset.ready === 'true' || complete(link)) {
      if (link) link.dataset.ready = 'true';
      resolve(link);
      return;
    }
    if (link?.dataset.failed === 'true') {
      link.remove();
      link = null;
    }
    if (!link) {
      link = document.createElement('link');
      link.id = PORTAL_STYLES_ID;
      link.rel = 'stylesheet';
      link.href = portalStyleAttempt
        ? `${PORTAL_STYLES_HREF}&retry=${++portalStyleAttempt}`
        : PORTAL_STYLES_HREF;
      if (!portalStyleAttempt) portalStyleAttempt = 1;
      link.dataset.routeStyles = 'deferred';
      document.head.append(link);
    }
    const ready = () => {
      if (!complete(link)) {
        failed();
        return;
      }
      link.dataset.ready = 'true';
      delete link.dataset.failed;
      resolve(link);
    };
    const failed = () => {
      link.dataset.failed = 'true';
      reject(new Error('Os estilos completos do portal não responderam.'));
    };
    link.addEventListener('load', ready, { once: true });
    link.addEventListener('error', failed, { once: true });
  }), LOAD_TIMEOUT_MS, 'Tempo esgotado ao vestir o portal.'));
}

function createRecovery(screen, id) {
  if (!screen || screen.querySelector(':scope > [data-route-recovery]')) return;
  const panel = document.createElement('aside');
  panel.className = 'db-route-recovery';
  panel.dataset.routeRecovery = id;
  panel.setAttribute('role', 'alert');
  panel.setAttribute('aria-live', 'assertive');

  const sigil = document.createElement('span');
  sigil.className = 'db-route-recovery__sigil';
  sigil.setAttribute('aria-hidden', 'true');
  sigil.textContent = '✦';
  const title = document.createElement('h3');
  title.textContent = 'Este portal não abriu por completo';
  const copy = document.createElement('p');
  copy.textContent = 'Nada foi perdido. Você pode tentar novamente ou voltar para a Orbe.';
  const actions = document.createElement('div');
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.dataset.routeRetry = id;
  retry.textContent = 'TENTAR NOVAMENTE';
  const home = document.createElement('button');
  home.type = 'button';
  home.dataset.go = 'home';
  home.className = 'secondary';
  home.textContent = 'VOLTAR AO INÍCIO';
  actions.append(retry, home);
  panel.append(sigil, title, copy, actions);
  screen.prepend(panel);
}

function clearRecovery(screen) {
  screen?.querySelector(':scope > [data-route-recovery]')?.remove();
}

export function createPageLoader({ config, go, authClient = globalThis.divinaAuth } = {}) {
  const $ = selector => document.querySelector(selector);
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

  const remember = entry => {
    ensureJournal().then(journal => journal?.add?.(entry)).catch(() => {});
  };

  const ensureCommerce = () => once(sharedTasks, 'commerce', async () => {
    const { CommerceEngine } = await import('./commerce-engine.js?v=148');
    return new CommerceEngine({
      store: $('#storeApp'),
      consultations: $('#consultationApp'),
      subscriptions: $('#subscriptionApp')
    }, config);
  });

  const ensureMedia = () => once(sharedTasks, 'media', async () => {
    const [{ MediaEngineV149 }, { MediaEcosystemV149 }] = await Promise.all([
      import('./media-engine-v149.js?v=149'),
      import('./media-ecosystem-v149.js?v=149')
    ]);
    const media = new MediaEngineV149({ videos: $('#videoApp'), music: $('#musicApp') }, config);
    new MediaEcosystemV149($('#videoApp'), 'videos');
    new MediaEcosystemV149($('#musicApp'), 'music');
    return media;
  });

  const loaders = Object.freeze({
    tarot: async () => {
      const { FreeTarot } = await import('./tarot-engine.js?v=182');
      return new FreeTarot($('#tarot'));
    },
    daily: async () => {
      const { DailyRitual } = await import('./ritual-engine.js?v=183');
      return new DailyRitual($('#dailyCard'), remember, { authClient });
    },
    library: async () => {
      const [, { CardLibraryEngine }] = await Promise.all([
        import('./tarot-meanings.js?v=184'),
        import('./card-library-engine.js?v=184')
      ]);
      return new CardLibraryEngine($('#cardLibraryApp'));
    },
    school: async () => {
      const { SchoolEngine } = await import('./school-engine.js?v=186');
      return new SchoolEngine($('#schoolApp'));
    },
    spreads: async () => {
      const { SpreadsEngine } = await import('./spreads-engine.js?v=185');
      return new SpreadsEngine({
        grid: $('#spreadGrid'),
        result: $('#spreadResult'),
        intention: $('#spreadIntention'),
        history: $('#spreadHistory')
      }, remember);
    },
    journal: ensureJournal,
    ai: async () => {
      const { AIEngine } = await import('./ai-engine.js?v=190');
      return new AIEngine($('#aiApp'), config);
    },
    store: async () => {
      await ensureCommerce();
      const { StoreEngine } = await import('./store-engine.js?v=148');
      return new StoreEngine($('#storeApp'), config);
    },
    consultations: async () => {
      await ensureCommerce();
      const { ConsultationEngine } = await import('./consultation-engine.js?v=188');
      return new ConsultationEngine($('#consultationApp'), config);
    },
    subscriptions: async () => {
      await ensureCommerce();
      const { PremiumEngine } = await import('./premium-engine.js?v=142');
      return new PremiumEngine($('#subscriptionApp'));
    },
    skins: async () => {
      const { SkinsEngine } = await import('./skins-v6.js?v=142');
      return new SkinsEngine($('#skinsApp'));
    },
    videos: ensureMedia,
    music: ensureMedia,
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
    tarot: () => import('./tarot-engine.js?v=182'),
    consultations: () => Promise.all([
      import('./commerce-engine.js?v=148'),
      import('./consultation-engine.js?v=188')
    ]),
    daily: () => import('./ritual-engine.js?v=183'),
    notifications: () => import('./notification-engine-v150.js?v=150')
  });

  const warm = ids => {
    const list = Array.isArray(ids) ? ids : [ids];
    return Promise.allSettled(list.filter(id => warmers[id]).map(id => (
      once(sharedTasks, `warm:${id}`, warmers[id])
    )));
  };

  const load = rawId => {
    const id = normalizeRouteId(rawId);
    if (!routeHasModule(id)) return Promise.resolve(null);
    const loader = loaders[id];
    if (!loader) return Promise.reject(new Error(`Motor ausente para ${id}`));

    return once(pageTasks, id, async () => {
      const screen = document.getElementById(id);
      const html = document.documentElement;
      const loadingId = `page:${id}:${++loadingSequence}`;
      clearRecovery(screen);
      screen?.setAttribute('aria-busy', 'true');
      screen?.setAttribute('data-module-state', 'loading');
      html.dataset.pageLoading = id;
      announceLoading('start', {
        id: loadingId,
        pageId: id,
        label: routeLabel(id),
        message: id === 'spreads'
          ? 'Preparando sua tiragem…'
          : id === 'journal'
            ? 'Abrindo suas memórias privadas…'
            : id === 'ai'
              ? 'Despertando a Orbe IA…'
              : undefined
      });
      document.dispatchEvent(new CustomEvent('divina:page-loading', { detail: { id } }));

      try {
        const styleTask = routeNeedsPortalStyles(id) ? loadPortalStyles() : Promise.resolve(null);
        const [, instance] = await Promise.all([
          styleTask,
          withTimeout(loader(), LOAD_TIMEOUT_MS, `Tempo esgotado ao abrir ${id}.`)
        ]);
        clearRecovery(screen);
        screen?.setAttribute('data-module-state', 'ready');
        document.dispatchEvent(new CustomEvent('divina:page-ready', { detail: { id } }));
        return instance;
      } catch (error) {
        screen?.setAttribute('data-module-state', 'error');
        createRecovery(screen, id);
        document.dispatchEvent(new CustomEvent('divina:page-error', { detail: { id, recoverable: true } }));
        window.dispatchEvent(new CustomEvent('orbe:toast', {
          detail: 'Este portal não conseguiu abrir agora. Você pode tentar novamente.'
        }));
        console.error(`[Divina] falha ao carregar ${id}`, error);
        throw error;
      } finally {
        announceLoading('end', { id: loadingId, pageId: id });
        screen?.removeAttribute('aria-busy');
        if (html.dataset.pageLoading === id) delete html.dataset.pageLoading;
      }
    });
  };

  const retry = id => {
    const route = normalizeRouteId(id);
    pageTasks.delete(route);
    clearRecovery(document.getElementById(route));
    return Promise.resolve(go ? go(route) : load(route));
  };

  const primeFromIntent = event => {
    const id = event.target.closest?.('[data-go]')?.dataset.go;
    if (id && routeHasModule(id)) load(id).catch(() => {});
  };

  document.addEventListener('pointerdown', primeFromIntent, { capture: true, passive: true });
  document.addEventListener('focusin', primeFromIntent, true);
  document.addEventListener('click', primeFromIntent, true);
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-route-retry]');
    if (!button) return;
    event.preventDefault();
    retry(button.dataset.routeRetry).catch(() => {});
  });

  observer = new MutationObserver(() => {
    const id = document.body.dataset.screen;
    if (id) load(id).catch(() => {});
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });

  return Object.freeze({
    load,
    prepare: load,
    retry,
    warm,
    go: id => Promise.resolve(go ? go(normalizeRouteId(id)) : load(id)),
    portalStylesReady: () => Boolean(document.getElementById(PORTAL_STYLES_ID)?.sheet),
    destroy: () => observer?.disconnect()
  });
}
