/* DIVINA BRUXA — CARREGADOR DE MUNDOS V1.3 · ESCOLA CELESTIAL V138
   Cada motor nasce apenas quando seu portal é solicitado. */

const pageTasks = new Map();
const sharedTasks = new Map();
const PAGE_LABELS = Object.freeze({
  tarot: 'o Tarot Livre',
  daily: 'a Carta do Dia',
  library: 'a Biblioteca das 78 Cartas',
  school: 'a Escola do Tarot',
  spreads: 'as Tiragens',
  journal: 'o Diário da Orbe',
  ai: 'a Orbe IA',
  store: 'a Loja Mística',
  consultations: 'as Consultas',
  subscriptions: 'o universo Premium',
  videos: 'De Frente com o Tarot',
  music: 'o universo da Música'
});

let loadingSequence = 0;

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

export function createPageLoader({ config, go } = {}) {
  const $ = selector => document.querySelector(selector);
  let observer = null;

  const ensureJournal = () => once(sharedTasks, 'journal', async () => {
    const [{ JournalEngine }, { RhythmEngine }] = await Promise.all([
      import('./journal-engine.js'),
      import('./rhythm-v6.js')
    ]);
    new RhythmEngine($('#journal'));
    const journal = new JournalEngine($('#journalForm'), $('#entries'), $('#mirrorStats'));
    return journal;
  });

  const remember = entry => {
    ensureJournal().then(journal => journal?.add?.(entry)).catch(() => {});
  };

  const ensureCommerce = () => once(sharedTasks, 'commerce', async () => {
    const { CommerceEngine } = await import('./commerce-engine.js');
    return new CommerceEngine({
      store: $('#storeApp'),
      consultations: $('#consultationApp'),
      subscriptions: $('#subscriptionApp')
    }, config);
  });

  const ensureMedia = () => once(sharedTasks, 'media', async () => {
    const [{ MediaEngineV5 }, { EcosystemEngine }] = await Promise.all([
      import('./media-engine-v5.js'),
      import('./ecosystem-v6.js')
    ]);
    new EcosystemEngine($('#videos'));
    const media = new MediaEngineV5({ videos: $('#videoApp'), music: $('#musicApp') }, config);
    return media;
  });

  const loaders = Object.freeze({
    tarot: async () => {
      const { FreeTarot } = await import('./tarot-engine.js?v=1361');
      return new FreeTarot($('#tarot'));
    },
    daily: async () => {
      const { DailyRitual } = await import('./ritual-engine.js');
      return new DailyRitual($('#dailyCard'), remember);
    },
    library: async () => {
      const { CardLibraryEngine } = await import('./card-library-engine.js');
      return new CardLibraryEngine($('#cardLibraryApp'));
    },
    school: async () => {
      const { SchoolEngine } = await import('./school-engine.js?v=138');
      return new SchoolEngine($('#schoolApp'));
    },
    spreads: async () => {
      const { SpreadsEngine } = await import('./spreads-engine.js');
      return new SpreadsEngine($('#spreadGrid'), $('#spreadResult'), remember);
    },
    journal: ensureJournal,
    ai: async () => {
      const { AIEngine } = await import('./ai-engine.js');
      return new AIEngine($('#ai'), config);
    },
    store: async () => {
      await ensureCommerce();
      const { StoreEngine } = await import('./store-engine.js');
      return new StoreEngine($('#storeApp'), config);
    },
    consultations: async () => {
      await ensureCommerce();
      const { ConsultationEngine } = await import('./consultation-engine.js');
      return new ConsultationEngine($('#consultationApp'));
    },
    subscriptions: async () => {
      await ensureCommerce();
      const { PremiumEngine } = await import('./premium-engine.js');
      return new PremiumEngine($('#subscriptionApp'));
    },
    videos: ensureMedia,
    music: ensureMedia
  });

  const load = id => {
    const loader = loaders[id];
    if (!loader) return Promise.resolve(null);
    return once(pageTasks, id, async () => {
      const screen = document.getElementById(id);
      const html = document.documentElement;
      const loadingId = `page:${id}:${++loadingSequence}`;
      screen?.setAttribute('aria-busy', 'true');
      screen?.setAttribute('data-module-state', 'loading');
      html.dataset.pageLoading = id;
      announceLoading('start', {
        id: loadingId,
        pageId: id,
        label: PAGE_LABELS[id] || 'o próximo portal'
      });
      document.dispatchEvent(new CustomEvent('divina:page-loading', { detail: { id } }));

      try {
        const instance = await loader();
        screen?.setAttribute('data-module-state', 'ready');
        document.dispatchEvent(new CustomEvent('divina:page-ready', { detail: { id } }));
        return instance;
      } catch (error) {
        screen?.setAttribute('data-module-state', 'error');
        document.dispatchEvent(new CustomEvent('divina:page-error', { detail: { id } }));
        if (document.body.dataset.screen === id) {
          window.dispatchEvent(new CustomEvent('orbe:toast', {
            detail: 'Este portal não conseguiu abrir agora. Toque novamente.'
          }));
        }
        console.error(`[Divina] falha ao carregar ${id}`, error);
        throw error;
      } finally {
        announceLoading('end', { id: loadingId, pageId: id });
        screen?.removeAttribute('aria-busy');
        if (html.dataset.pageLoading === id) delete html.dataset.pageLoading;
      }
    });
  };

  const primeFromIntent = event => {
    const id = event.target.closest?.('[data-go]')?.dataset.go;
    if (id && loaders[id]) load(id).catch(() => {});
  };

  document.addEventListener('pointerdown', primeFromIntent, { capture: true, passive: true });
  document.addEventListener('focusin', primeFromIntent, true);
  document.addEventListener('click', primeFromIntent, true);

  observer = new MutationObserver(() => {
    const id = document.body.dataset.screen;
    if (id) load(id).catch(() => {});
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });

  const initial = document.body.dataset.screen || location.hash.slice(1) || 'home';
  load(initial).catch(() => {});

  return {
    load,
    go: id => {
      load(id).catch(() => {});
      go?.(id);
    },
    destroy: () => observer?.disconnect()
  };
}
