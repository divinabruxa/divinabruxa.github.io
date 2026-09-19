/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 9 · V609
   Música e Vídeos deixam a obra ocupar o espaço; Skins transforma o universo
   sem recarga. Esta camada conduz somente a apresentação dos motores V559 e
   V201. Não cria player, catálogo, Orbe, canvas, entitlement ou publicação. */

const VERSION = 609;
const INSTANCE = Symbol.for('divina.work13.living.media.skins.v609');
const ROUTES = Object.freeze(['music','videos','skins']);
const ROUTE_SET = new Set(ROUTES);
const READING_ROUTES = new Set(['tarot','daily','spreads','library','school','journal']);

const ALLOWED_PHASES = Object.freeze({
  music:Object.freeze(['focus','detail','immersive']),
  videos:Object.freeze(['empty','focus','detail','immersive']),
  skins:Object.freeze(['focus','gallery'])
});

export const LIVING_MEDIA_SKINS_CONTRACT_V609 = Object.freeze({
  version:VERSION,
  base:'V608-commerce-clarity-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'9-of-10',
  title:'Música, Vídeos e Skins — a interface recua',
  law:'one-orb-one-universe-one-presence-one-journey',
  worlds:ROUTES,
  sequence:Object.freeze([
    'work-first','explicit-depth','single-player-on-demand','interface-recedes'
  ]),
  contextModel:'V602-public-route-metadata-only',
  music:Object.freeze({
    engine:'V559',
    artist:'Hércules DX',
    verifiedAlbums:Object.freeze([
      Object.freeze({ title:'Sobre as Estrelas', year:2024, tracks:10 }),
      Object.freeze({ title:'Z', year:2026, tracks:8 })
    ]),
    verifiedTracks:18,
    activePlayersMaximum:1,
    autoplay:false,
    playerLoadsAfterExplicitGesture:true,
    historyStored:false
  }),
  videos:Object.freeze({
    engine:'V559',
    project:'De Frente com o Tarot',
    publishedOnly:true,
    publishedEpisodesAtRelease:0,
    inventedEpisodes:0,
    autoplay:false,
    playerLoadsAfterExplicitGesture:true
  }),
  skins:Object.freeze({
    engine:'V201',
    registry:'V12',
    count:30,
    freeSkin:'classic',
    paidSkins:29,
    globalApplyWithoutReload:true,
    cosmeticOnly:true,
    realBilling:false,
    serverAuthority:true
  }),
  existingEnginesPreserved:Object.freeze({ music:'V559', videos:'V559', skins:'V201' }),
  maximumNewControlsSimultaneous:3,
  newSurfaces:0,
  automaticPlayback:false,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitTimingAuthority:'V606-unchanged',
  privateContentReads:0,
  listeningHistoryReads:0,
  viewingHistoryReads:0,
  searchQueryReads:0,
  accountProfileReads:0,
  purchaseBodyReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newCanvases:0,
  newRenderers:0,
  newPlayers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  eventDrivenSingleFrame:true,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const cleanRoute = value => {
  const route = String(value || '').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

export const normalizeMediaSkinRouteV609 = value => cleanRoute(value);

const publicContext = value => {
  const source = value && typeof value === 'object' ? value : {};
  return Object.freeze({
    route:cleanRoute(source.route),
    previousRoute:cleanRoute(source.returnRoute || source.previousRoute || '')
  });
};

export function mediaSkinEntryCopyV609(route, context = {}) {
  const snapshot = publicContext(context);
  if (route === 'music') {
    return Object.freeze({
      title:READING_ROUTES.has(snapshot.previousRoute)
        ? 'Deixe a leitura repousar em som.'
        : 'Escolha o álbum. O resto pode desaparecer.',
      depth:'Ver faixas e contexto',
      returnLabel:'Voltar à capa e ao play'
    });
  }
  if (route === 'videos') {
    return Object.freeze({
      title:'O cinema só acende para o que foi publicado.',
      depth:'Conhecer este episódio',
      returnLabel:'Voltar à imagem e ao play'
    });
  }
  if (route === 'skins') {
    return Object.freeze({
      title:['music','videos'].includes(snapshot.previousRoute)
        ? 'Mude a atmosfera sem interromper a obra.'
        : 'A mesma presença, outra pele.',
      depth:'Escolher outra pele',
      returnLabel:'Voltar à skin atual'
    });
  }
  return null;
}

export function nextMediaSkinPhaseV609(route, current, action, hasEpisodes = true) {
  const active = ALLOWED_PHASES[route]?.includes(current) ? current : (route === 'videos' && !hasEpisodes ? 'empty' : 'focus');
  if (route === 'music') {
    if (action === 'depth') return active === 'detail' ? 'focus' : 'detail';
    if (action === 'play') return 'immersive';
    if (action === 'close' || action === 'select' || action === 'enter') return 'focus';
  }
  if (route === 'videos') {
    if (!hasEpisodes) return 'empty';
    if (action === 'depth') return active === 'detail' ? 'focus' : 'detail';
    if (action === 'play') return 'immersive';
    if (action === 'close' || action === 'select' || action === 'enter') return 'focus';
  }
  if (route === 'skins') {
    if (action === 'toggle') return active === 'gallery' ? 'focus' : 'gallery';
    if (action === 'applied' || action === 'enter') return 'focus';
  }
  return active;
}

const routeNow = (doc, win) => cleanRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

const makeButton = (doc, action) => {
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'db609-depth-toggle';
  button.dataset.v609Action = action;
  button.dataset.v609Created = 'true';
  return button;
};

export class LivingMediaSkinsV609 {
  constructor({
    contextMemory = globalThis.divinaCosmosContextMemoryV602,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.contextMemory = contextMemory || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.destroyed = false;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.context = this.readContext();
    this.phases = new Map([
      ['music','focus'],
      ['videos','empty'],
      ['skins','focus']
    ]);
    this.frameId = 0;
    this.nodesCreatedTotal = 0;
    this.explicitDepthChanges = 0;
    this.playerOpens = 0;
    this.playerCloses = 0;
    this.skinGalleryOpens = 0;
    this.skinApplications = 0;
    this.routeEntries = 0;

    this.installIdentity();
    this.bind();
    this.decorateAll();
    this.enterRoute(this.route, 'boot');
    emit(this.documentTarget, 'divina:living-media-skins-ready', this.publicStatus());
  }

  readContext() {
    try { return publicContext(this.contextMemory?.snapshot?.() || { route:this.route }); }
    catch { return publicContext({ route:this.route }); }
  }

  installIdentity() {
    if (!this.documentElement?.dataset) return false;
    this.documentElement.dataset.work13 = 'cosmos-vivo';
    this.documentElement.dataset.work13Macro = '9-media-skins-interface-recedes';
    this.documentElement.dataset.livingMediaSkins = 'v609';
    this.documentElement.dataset.livingMediaSkinsPrivacy = 'public-route-and-public-player-state-only';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'click', event => this.onClick(event), { capture:true });
    this.listen(doc, 'input', event => this.onInput(event), { capture:true });
    this.listen(doc, 'divina:context-memory-updated', () => {
      this.context = this.readContext();
      this.scheduleDecorate();
    });
    ['divina:route-ready','divina:page-ready','divina:supreme-orb-did-navigate']
      .forEach(type => this.listen(doc, type, event => this.onRoute(event)));
    ['divina:media-supreme-ready','divina:skins-world-ready']
      .forEach(type => this.listen(doc, type, () => this.scheduleDecorate()));
    ['divina:skin-applied','divina:skin-changed']
      .forEach(type => this.listen(doc, type, () => this.onSkinApplied()));
    this.listen(doc, 'divina:reality-depth', () => this.scheduleDecorate());
    this.listen(win, 'hashchange', () => this.onRoute({ detail:{ id:routeNow(doc, win) } }));
  }

  screen(route) {
    return this.documentTarget?.getElementById?.(route) || null;
  }

  app(route) {
    const id = route === 'music' ? 'musicApp' : route === 'videos' ? 'videoApp' : 'skinsApp';
    return this.documentTarget?.getElementById?.(id) || null;
  }

  phase(route) {
    return this.phases.get(route) || (route === 'videos' ? 'empty' : 'focus');
  }

  hasPublishedVideos() {
    const app = this.app('videos');
    if (!app) return false;
    if (app.querySelector?.('.mv559-empty')) return false;
    return Boolean(app.querySelector?.('[data-episode-id],.mv559-episode-detail'));
  }

  setPhase(route, phase, reason = 'sync', explicit = false) {
    if (!ROUTE_SET.has(route) || !ALLOWED_PHASES[route]?.includes(phase)) return false;
    const changed = this.phases.get(route) !== phase;
    this.phases.set(route, phase);
    const screen = this.screen(route);
    if (screen?.dataset) {
      screen.dataset.v609World = 'v609';
      screen.dataset.v609Phase = phase;
    }
    if (changed && explicit) this.explicitDepthChanges += 1;
    if (changed) {
      emit(this.documentTarget, 'divina:living-media-skins-state', {
        version:VERSION,
        route,
        phase,
        reason,
        explicit:Boolean(explicit),
        privateContentIncluded:false
      });
    }
    this.scheduleDecorate();
    return true;
  }

  enterRoute(route, reason = 'route') {
    const next = cleanRoute(route);
    const changed = next !== this.route;
    this.route = next;
    this.context = this.readContext();
    if (ROUTE_SET.has(next) && (changed || reason === 'boot')) {
      const hasEpisodes = this.hasPublishedVideos();
      this.phases.set(next, nextMediaSkinPhaseV609(next, this.phase(next), 'enter', hasEpisodes));
      this.routeEntries += 1;
    }
    this.decorateAll();
    return next;
  }

  onRoute(event) {
    this.enterRoute(event?.detail?.id || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget), event?.type || 'route');
  }

  onInput(event) {
    if (event?.target?.closest?.('#skinsApp,#videoApp')) this.scheduleDecorate();
  }

  onSkinApplied() {
    this.skinApplications += 1;
    if (this.route === 'skins') {
      this.setPhase('skins', nextMediaSkinPhaseV609('skins', this.phase('skins'), 'applied'), 'skin-applied', false);
    } else {
      this.scheduleDecorate();
    }
  }

  onClick(event) {
    const target = event?.target;
    const actionButton = target?.closest?.('[data-v609-action]');
    if (actionButton) {
      const action = actionButton.dataset.v609Action;
      if (action === 'music-depth') {
        const next = nextMediaSkinPhaseV609('music', this.phase('music'), 'depth');
        this.setPhase('music', next, 'explicit-depth', true);
        return;
      }
      if (action === 'videos-depth') {
        const next = nextMediaSkinPhaseV609('videos', this.phase('videos'), 'depth', this.hasPublishedVideos());
        this.setPhase('videos', next, 'explicit-depth', true);
        return;
      }
      if (action === 'skins-gallery') {
        const next = nextMediaSkinPhaseV609('skins', this.phase('skins'), 'toggle');
        if (next === 'gallery') this.skinGalleryOpens += 1;
        this.setPhase('skins', next, 'explicit-gallery', true);
        return;
      }
    }

    if (target?.closest?.('[data-play-release]')) {
      this.playerOpens += 1;
      this.setPhase('music', 'immersive', 'explicit-player', false);
      return;
    }
    if (target?.closest?.('#musicApp [data-close-player]')) {
      this.playerCloses += 1;
      this.setPhase('music', 'focus', 'explicit-player-close', false);
      return;
    }
    if (target?.closest?.('[data-release-id]')) {
      this.setPhase('music', 'focus', 'explicit-release', false);
      return;
    }
    if (target?.closest?.('[data-play-episode]')) {
      this.playerOpens += 1;
      this.setPhase('videos', 'immersive', 'explicit-player', false);
      return;
    }
    if (target?.closest?.('#videoApp [data-close-player]')) {
      this.playerCloses += 1;
      this.setPhase('videos', 'focus', 'explicit-player-close', false);
      return;
    }
    if (target?.closest?.('[data-episode-id]')) {
      this.setPhase('videos', 'focus', 'explicit-episode', false);
      return;
    }
    if (target?.closest?.('#musicApp,#videoApp,#skinsApp,[data-v585-depth]')) this.scheduleDecorate();
  }

  scheduleDecorate() {
    if (this.destroyed || this.frameId) return false;
    const frame = this.windowTarget?.requestAnimationFrame;
    if (typeof frame !== 'function') {
      this.decorateAll();
      return false;
    }
    this.frameId = frame.call(this.windowTarget, () => {
      this.frameId = 0;
      if (!this.destroyed) this.decorateAll();
    });
    return true;
  }

  markScreen(route) {
    const screen = this.screen(route);
    if (!screen?.dataset) return null;
    screen.dataset.v609World = 'v609';
    screen.dataset.v609Phase = this.phase(route);
    const copy = mediaSkinEntryCopyV609(route, this.context);
    if (copy) screen.setAttribute?.('data-v609-presence', copy.title);
    return screen;
  }

  ensureDepthToggle(route, detail) {
    if (!detail || !this.documentTarget?.createElement) return null;
    let button = detail.querySelector?.(`[data-v609-action="${route}-depth"]`);
    if (!button) {
      button = makeButton(this.documentTarget, `${route}-depth`);
      const player = detail.querySelector?.('.mv559-player-slot');
      if (player?.parentNode === detail) detail.insertBefore?.(button, player);
      else detail.append?.(button);
      this.nodesCreatedTotal += 1;
    }
    const copy = mediaSkinEntryCopyV609(route, this.context);
    const expanded = this.phase(route) === 'detail';
    button.textContent = expanded ? copy?.returnLabel || 'Voltar' : copy?.depth || 'Aprofundar';
    button.setAttribute?.('aria-expanded', String(expanded));
    return button;
  }

  decorateMusic() {
    const screen = this.markScreen('music');
    const app = this.app('music');
    if (!screen || !app) return false;
    const cards = app.querySelectorAll?.('[data-release-id]') || [];
    screen.dataset.v609ReleaseCount = String(cards.length || 2);
    screen.dataset.v609Autoplay = 'off';
    const detail = app.querySelector?.('.mv559-release-detail');
    if (detail) this.ensureDepthToggle('music', detail);
    return true;
  }

  decorateVideos() {
    const screen = this.markScreen('videos');
    const app = this.app('videos');
    if (!screen) return false;
    screen.dataset.v609PublishedOnly = 'true';
    screen.dataset.v609InventedEpisodes = '0';
    if (!app) {
      this.phases.set('videos','empty');
      screen.dataset.v609Phase = 'empty';
      return false;
    }
    const hasEpisodes = this.hasPublishedVideos();
    if (!hasEpisodes && this.phase('videos') !== 'empty') this.phases.set('videos','empty');
    if (hasEpisodes && this.phase('videos') === 'empty') this.phases.set('videos','focus');
    screen.dataset.v609Phase = this.phase('videos');
    const detail = app.querySelector?.('.mv559-episode-detail');
    if (detail) this.ensureDepthToggle('videos', detail);
    return true;
  }

  decorateSkins() {
    const screen = this.markScreen('skins');
    const app = this.app('skins');
    if (!screen || !app) return false;
    screen.dataset.v609SkinCount = '30';
    screen.dataset.v609SkinScope = 'global-no-reload';
    const stage = app.querySelector?.('.skins-v191-stage');
    if (!stage || !this.documentTarget?.createElement) return false;
    let button = stage.querySelector?.('[data-v609-action="skins-gallery"]');
    if (!button) {
      button = makeButton(this.documentTarget, 'skins-gallery');
      button.classList.add?.('db609-skin-toggle');
      const copyColumn = stage.querySelector?.(':scope > div:last-child') || stage;
      copyColumn.append?.(button);
      this.nodesCreatedTotal += 1;
    }
    const copy = mediaSkinEntryCopyV609('skins', this.context);
    const expanded = this.phase('skins') === 'gallery';
    button.textContent = expanded ? copy?.returnLabel || 'Voltar' : copy?.depth || 'Escolher uma skin';
    button.setAttribute?.('aria-expanded', String(expanded));
    button.setAttribute?.('aria-controls', 'skinsApp');
    return true;
  }

  decorateAll() {
    this.decorateMusic();
    this.decorateVideos();
    this.decorateSkins();
    return true;
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      route:this.route,
      phases:Object.freeze(Object.fromEntries(this.phases)),
      playerOpens:this.playerOpens,
      playerCloses:this.playerCloses,
      skinGalleryOpens:this.skinGalleryOpens,
      skinApplications:this.skinApplications,
      privateContentIncluded:false
    });
  }

  audit() {
    const doc = this.documentTarget;
    const canonicalOrbs = doc?.querySelectorAll?.('#orb')?.length ?? 0;
    const canonicalCanvases = doc?.querySelectorAll?.('#orbCanvas')?.length ?? 0;
    const controls = doc?.querySelectorAll?.('[data-v609-created="true"]')?.length ?? 0;
    const frames = doc?.querySelectorAll?.('#musicApp iframe,#videoApp iframe')?.length ?? 0;
    return Object.freeze({
      version:VERSION,
      oneCanonicalOrb:canonicalOrbs === 1,
      oneCanonicalCanvas:canonicalCanvases === 1,
      canonicalOrbs,
      canonicalCanvases,
      newControlsSimultaneous:controls,
      controlsWithinBudget:controls <= LIVING_MEDIA_SKINS_CONTRACT_V609.maximumNewControlsSimultaneous,
      activeMediaFrames:frames,
      singlePlayerPreserved:frames <= 1,
      newSurfaces:0,
      automaticPlayback:false,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentReads:0,
      networkCalls:0,
      permanentAnimationLoops:0,
      mutationObservers:0
    });
  }

  status() {
    return Object.freeze({
      ...LIVING_MEDIA_SKINS_CONTRACT_V609,
      ...this.publicStatus(),
      nodesCreatedTotal:this.nodesCreatedTotal,
      explicitDepthChanges:this.explicitDepthChanges,
      routeEntries:this.routeEntries,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    if (this.frameId && typeof this.windowTarget?.cancelAnimationFrame === 'function') {
      this.windowTarget.cancelAnimationFrame(this.frameId);
    }
    this.frameId = 0;
    this.documentTarget?.querySelectorAll?.('[data-v609-created="true"]').forEach(node => node.remove?.());
    ROUTES.forEach(route => {
      const screen = this.screen(route);
      if (!screen?.dataset) return;
      delete screen.dataset.v609World;
      delete screen.dataset.v609Phase;
      delete screen.dataset.v609Presence;
      delete screen.dataset.v609ReleaseCount;
      delete screen.dataset.v609Autoplay;
      delete screen.dataset.v609PublishedOnly;
      delete screen.dataset.v609InventedEpisodes;
      delete screen.dataset.v609SkinCount;
      delete screen.dataset.v609SkinScope;
    });
    if (this.documentElement?.dataset?.livingMediaSkins === 'v609') {
      delete this.documentElement.dataset.livingMediaSkins;
      delete this.documentElement.dataset.livingMediaSkinsPrivacy;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    return true;
  }
}

export function createLivingMediaSkinsV609(options = {}) {
  if (globalThis[INSTANCE] && !globalThis[INSTANCE].destroyed) return globalThis[INSTANCE];
  const instance = new LivingMediaSkinsV609(options);
  globalThis[INSTANCE] = instance;
  return instance;
}
