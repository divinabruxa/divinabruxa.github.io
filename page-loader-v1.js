/* DIVINA BRUXA — CARREGADOR DE MUNDOS V1.12 · MÚSICA E VÍDEO V149
   Cada motor nasce apenas quando seu portal é solicitado. */

const pageTasks = new Map();
const sharedTasks = new Map();
const PAGE_LABELS = Object.freeze({
  tarot: 'o Tarot Livre',
  daily: 'a Carta do Dia',
  library: 'a Biblioteca das 78 Cartas',
  school: 'a Escola do Tarot',
  spreads: 'o Templo das Tiragens',
  journal: 'o Diário da Orbe',
  ai: 'a Orbe IA',
  store: 'a Loja Mística',
  consultations: 'as Consultas',
  subscriptions: 'o universo Premium',
  skins: 'a Constelação das 30 Skins',
  videos: 'De Frente com o Tarot',
  music: 'o universo da Música',
  admin: 'a Central da Proprietária'
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
      import('./journal-engine.js?v=141'),
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
      const { FreeTarot } = await import('./tarot-engine.js?v=148');
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
      const { SpreadsEngine } = await import('./spreads-engine.js?v=141');
      return new SpreadsEngine({
        grid: $('#spreadGrid'),
        result: $('#spreadResult'),
        intention: $('#spreadIntention'),
        history: $('#spreadHistory')
      }, remember);
    },
    journal: ensureJournal,
    ai: async () => {
      const { AIEngine } = await import('./ai-engine.js?v=141');
      return new AIEngine($('#aiApp'), config);
    },
    store: async () => {
      await ensureCommerce();
      const { StoreEngine } = await import('./store-engine.js?v=148');
      return new StoreEngine($('#storeApp'), config);
    },
    consultations: async () => {
      await ensureCommerce();
      const { ConsultationEngine } = await import('./consultation-engine.js?v=148');
      return new ConsultationEngine($('#consultationApp'), config);
    },
    subscriptions: async () => {
      await ensureCommerce();
      const { PremiumEngine } = await import('./premium-engine.js?v=142');
      return new PremiumEngine($('#subscriptionApp'));
    },
    videos: ensureMedia,
    music: ensureMedia,
    admin: async () => {
      const { AdminEngine } = await import('./admin-engine.js?v=146');
      return new AdminEngine($('#adminApp'));
    }
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
        label: PAGE_LABELS[id] || 'o próximo portal',
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
