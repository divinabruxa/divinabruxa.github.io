/* DIVINA BRUXA — WORK13 · MÚSICA · PALCO DAS ESTRELAS · V625
   Camada de mundo sobre Música V559 e presença de mídia V609. Faz a obra
   aparecer sem reconstruir catálogo, player, Admin, Orbe ou navegação. */

const VERSION = 625;
const STYLE_ID = 'divinaMusicaWorldV625';
const STYLE_HREF = './musica-world-v625.css?v=625-palco-das-estrelas';
const INSTANCE = Symbol.for('divina.work13.musica.world.v625');
const PHASES = new Set([
  'rest','threshold','invitation','albums','album','tracks','playing','passage',
  'settled','portal','travel','silence'
]);

export const MUSICA_WORLD_CONTRACT_V625 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  reality:'music',
  name:'Música',
  universe:'palco-das-estrelas',
  identity:'cosmic-black-violet-magenta-champagne-starlight',
  sequence:Object.freeze([
    'arrival','two-real-albums','one-explicit-album','tracks-on-explicit-request',
    'one-official-player','work-in-focus','return','silence'
  ]),
  musicAuthority:'V559-preserved',
  livingMediaAuthority:'V609-preserved',
  artist:'Hércules DX',
  verifiedAlbums:Object.freeze([
    Object.freeze({title:'Sobre as Estrelas',year:2024,tracks:10}),
    Object.freeze({title:'Z',year:2026,tracks:8})
  ]),
  verifiedAlbumCount:2,
  verifiedTracks:18,
  inventedAlbums:0,
  inventedTracks:0,
  futureReleaseTypes:Object.freeze(['album','ep','single']),
  futureReleasesAdminEditable:true,
  draftPublishedFlowPreserved:true,
  publishedCatalogueOnly:true,
  coverTitleCreditsStoryPreserved:true,
  officialDestinationsPreserved:true,
  officialPlayer:'spotify-embed-or-official-link',
  playerLoadsAfterExplicitGesture:true,
  playbackNeverStartsOnArrival:true,
  autoplay:false,
  maximumActivePlayers:1,
  anotherPlayerStopsBeforePlayback:true,
  canonicalOrbRespondsOnExplicitChoice:true,
  canonicalOrbResponse:'existing-pulse-only',
  existingMusicBodyReused:true,
  separateMusicBody:false,
  catalogueChanges:0,
  releaseChanges:0,
  trackChanges:0,
  playerChanges:0,
  adminChanges:0,
  listeningHistoryStored:false,
  privateByDefault:true,
  listeningHistoryReads:0,
  accountDataReads:0,
  externalUrlReads:0,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  reusesCanonicalOrb:true,
  pentagramMenuPreserved:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  visibleCopyChanges:1,
  newVisibleDomNodes:0,
  newImages:0,
  newCanvases:0,
  newRenderers:0,
  newPlayers:0,
  permanentAnimationLoops:0,
  mutationObservers:0,
  deferredTimers:0,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true,
  work14:false
});

const normalizeRoute = value => String(value || 'home')
  .trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0] || 'home';

const routeNow = (doc,win) => normalizeRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const normalizePhase = value => {
  const phase = String(value || 'threshold').trim().toLowerCase();
  return PHASES.has(phase) ? phase : 'threshold';
};

const emit = (doc,type,detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type,{detail:Object.freeze(detail)}));
  return true;
};

const safeStatus = target => {
  try { return target?.status?.() || null; }
  catch { return null; }
};

const publicPhaseFromSignal = value => {
  const signal = String(value || '').trim().toLowerCase();
  if (/travel|depart|arriv/.test(signal)) return 'travel';
  if (/menu|portal/.test(signal)) return 'portal';
  if (/external|spotify|passage|outbound/.test(signal)) return 'passage';
  if (/playing|immersive|player-open|play/.test(signal)) return 'playing';
  if (/track|detail|depth/.test(signal)) return 'tracks';
  if (/album|release|select|focus/.test(signal)) return 'album';
  if (/catalog|ready|open|present/.test(signal)) return 'albums';
  if (/settle|close|stopped|done/.test(signal)) return 'settled';
  if (/silent|quiet|rest/.test(signal)) return 'silence';
  if (/threshold|awak/.test(signal)) return 'threshold';
  return '';
};

export class MusicaWorldV625 {
  constructor({
    media = globalThis.divinaMediaSupremeReleaseV559,
    livingMedia = globalThis.divinaLivingMediaSkinsV609,
    orbCore = globalThis.divinaSupremeOrbV501?.core,
    documentTarget = globalThis.document,
    windowTarget = globalThis.window || globalThis
  } = {}) {
    this.version = VERSION;
    this.media = media || null;
    this.livingMedia = livingMedia || null;
    this.orbCore = orbCore || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.root = this.documentTarget?.documentElement || null;
    this.screen = this.documentTarget?.getElementById?.('music') || null;
    this.app = this.documentTarget?.getElementById?.('musicApp') || null;
    this.route = routeNow(this.documentTarget,this.windowTarget);
    this.phase = 'rest';
    this.publicSignals = 0;
    this.albumChoices = 0;
    this.trackRequests = 0;
    this.playRequests = 0;
    this.playerCloses = 0;
    this.externalPassages = 0;
    this.orbResponses = 0;
    this.attachments = 0;
    this.destroyed = false;
    this.abort = typeof AbortController === 'function' ? new AbortController() : null;

    this.installStyle();
    this.installIdentity();
    this.bind();
    this.sync('boot');
    emit(this.documentTarget,'divina:musica-world-v625-ready',this.publicStatus());
  }

  installStyle() {
    const doc = this.documentTarget;
    if (!doc?.head || doc.getElementById?.(STYLE_ID)) return false;
    const link = doc.createElement?.('link');
    if (!link) return false;
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = STYLE_HREF;
    doc.head.append?.(link);
    return true;
  }

  installIdentity() {
    if (this.root?.dataset) this.root.dataset.work13MusicaWorld = 'v625';
    if (!this.screen?.dataset) return false;
    this.screen.dataset.musicaWorld = 'v625';
    this.screen.dataset.musicaUniverse = 'palco-das-estrelas';
    this.screen.dataset.musicaWorldPhase = 'rest';
    this.screen.dataset.musicaWorldPresence = 'away';
    this.screen.dataset.musicaWorldSequence = 'arrival-albums-choice-tracks-player-focus-return-silence';
    const title = this.screen.querySelector?.(':scope > h2') || this.screen.querySelector?.('h2');
    if (title && title.dataset.musicaWorldCopy !== 'v625') {
      title.textContent = 'Sobre as Estrelas e Z acendem o Palco das Estrelas.';
      title.dataset.musicaWorldCopy = 'v625';
    }
    return true;
  }

  listen(target,type,handler,options={}) {
    const signal = this.abort?.signal;
    target?.addEventListener?.(type,handler,signal ? {...options,signal} : options);
  }

  isActive() {
    return this.route === 'music' && this.screen?.classList?.contains?.('active') !== false;
  }

  attach() {
    const nextScreen = this.documentTarget?.getElementById?.('music') || null;
    const nextApp = this.documentTarget?.getElementById?.('musicApp') || null;
    if (nextScreen && nextScreen !== this.screen) this.screen = nextScreen;
    if (nextApp && nextApp !== this.app) {
      this.app = nextApp;
      this.attachments += 1;
    }
    if (this.screen?.dataset) {
      this.screen.dataset.musicaWorld = 'v625';
      this.screen.dataset.musicaUniverse = 'palco-das-estrelas';
      this.screen.dataset.musicaWorldPhase = this.phase;
    }
    if (this.app?.dataset) {
      this.app.dataset.musicaWorld = 'v625';
      this.app.dataset.musicaUniverse = 'palco-das-estrelas';
      this.app.dataset.musicaWorldPhase = this.phase;
      this.app.dataset.musicaWorldPrivacy = 'public-catalogue-and-public-player-state-only';
      this.app.dataset.musicaAutoplay = 'off';
      this.app.dataset.musicaMaximumPlayers = '1';
    }
    return this.app;
  }

  activeFrames() {
    return this.app?.querySelectorAll?.('iframe')?.length || 0;
  }

  arrivalPhase() {
    if (!this.isActive()) return 'rest';
    if (this.activeFrames() > 0 || this.screen?.dataset?.v609Phase === 'immersive') return 'playing';
    if (this.screen?.dataset?.v609Phase === 'detail') return 'tracks';
    if (this.app?.querySelector?.('.mv559-release-card.is-active')) return 'album';
    return 'albums';
  }

  setPhase(next,reason='public-signal') {
    this.phase = normalizePhase(next);
    if (this.screen?.dataset) {
      this.screen.dataset.musicaWorldPhase = this.phase;
      this.screen.dataset.musicaWorldReason = String(reason || 'public-signal').slice(0,64);
      this.screen.dataset.musicaWorldPresence = this.isActive() ? 'present' : 'away';
    }
    if (this.app?.dataset) this.app.dataset.musicaWorldPhase = this.phase;
    emit(this.documentTarget,'divina:musica-world-v625-state',this.publicStatus());
    return this.phase;
  }

  sync(reason='sync') {
    this.attach();
    return this.setPhase(this.arrivalPhase(),reason);
  }

  respondOrb(kind) {
    try {
      this.orbCore?.pulse?.(kind,{source:'work13-musica-v625',privateContentIncluded:false});
      this.orbResponses += 1;
      return true;
    } catch { return false; }
  }

  onRouteStart(event) {
    const next = normalizeRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || '');
    this.publicSignals += 1;
    if (this.isActive() && next !== 'music') this.setPhase('travel','route-start');
  }

  onRouteReady(event) {
    this.route = normalizeRoute(
      event?.detail?.id || event?.detail?.route || event?.detail?.to
      || routeNow(this.documentTarget,this.windowTarget)
    );
    this.publicSignals += 1;
    this.sync('route-ready');
  }

  onPublicMediaState(event) {
    const detail = event?.detail || {};
    const route = normalizeRoute(detail.route || detail.reality || 'music');
    if (route !== 'music' || !this.isActive()) return false;
    this.publicSignals += 1;
    const phase = publicPhaseFromSignal(detail.phase || detail.state || detail.action || '');
    if (!phase) return this.sync('public-media-ready');
    return this.setPhase(phase,`public-${event?.type || 'media'}`);
  }

  onClick(event) {
    if (!this.isActive()) return false;
    const target = event?.target;
    if (target?.closest?.('#musicApp [data-close-player]')) {
      this.playerCloses += 1;
      return this.setPhase('album','explicit-player-close');
    }
    if (target?.closest?.('#musicApp [data-play-release]')) {
      this.playRequests += 1;
      this.respondOrb('music-play');
      return this.setPhase('playing','explicit-player');
    }
    if (target?.closest?.('#musicApp [data-v609-action="music-depth"]')) {
      this.trackRequests += 1;
      const next = this.screen?.dataset?.v609Phase === 'detail' ? 'tracks' : 'album';
      return this.setPhase(next,'explicit-tracks');
    }
    if (target?.closest?.('#musicApp [data-release-id]')) {
      this.albumChoices += 1;
      this.respondOrb('music-album');
      return this.setPhase('album','explicit-album');
    }
    if (target?.closest?.('#musicApp .mv559-tracklist button,#musicApp [data-track-id]')) {
      this.trackRequests += 1;
      return this.setPhase('tracks','explicit-track');
    }
    if (target?.closest?.('#musicApp [data-open-spotify],#musicApp .mv559-actions a[target="_blank"]')) {
      this.externalPassages += 1;
      return this.setPhase('passage','explicit-official-destination');
    }
    return false;
  }

  onMenu(event) {
    if (!this.isActive()) return false;
    this.publicSignals += 1;
    const state = String(event?.detail?.state || event?.detail?.phase || '').toLowerCase();
    if (/open|opening|visible|active/.test(state)) return this.setPhase('portal','menu-open');
    if (/close|closed|hidden|idle/.test(state)) return this.sync('menu-close');
    return false;
  }

  bind() {
    const doc = this.documentTarget;
    this.listen(doc,'click',event=>this.onClick(event));
    this.listen(doc,'divina:route-start',event=>this.onRouteStart(event));
    this.listen(doc,'divina:route-ready',event=>this.onRouteReady(event));
    this.listen(doc,'divina:page-ready',event=>this.onRouteReady(event));
    this.listen(doc,'divina:media-supreme-ready',event=>this.onPublicMediaState(event));
    this.listen(doc,'divina:music-state',event=>this.onPublicMediaState(event));
    this.listen(doc,'divina:media-player-state',event=>this.onPublicMediaState(event));
    this.listen(doc,'divina:living-media-skins-state',event=>this.onPublicMediaState(event));
    this.listen(doc,'divina:menu-state',event=>this.onMenu(event));
    this.listen(doc,'divina:portal-state',event=>this.onMenu(event));
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,work:'WORK13',reality:'music',universe:'palco-das-estrelas',
      route:this.route,phase:this.phase,present:this.isActive(),
      albums:2,tracks:18,artist:'Hércules DX',autoplay:false,
      maximumActivePlayers:1,activePlayers:this.activeFrames(),
      publicSignals:this.publicSignals,albumChoices:this.albumChoices,
      trackRequests:this.trackRequests,playRequests:this.playRequests,
      playerCloses:this.playerCloses,externalPassages:this.externalPassages,
      orbResponses:this.orbResponses,automaticNavigation:false,
      automaticWhitSpeech:false,listeningHistoryReads:0,privateContentReads:0,
      networkCalls:0,storageWrites:0,work14:false
    });
  }

  status() {
    return Object.freeze({
      ...this.publicStatus(),contract:MUSICA_WORLD_CONTRACT_V625,
      media:safeStatus(this.media),livingMedia:safeStatus(this.livingMedia)
    });
  }

  audit() {
    const orbs = this.documentTarget?.querySelectorAll?.('#orb')?.length || 0;
    const canvases = this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length || 0;
    const players = this.activeFrames();
    return Object.freeze({
      version:VERSION,musicScreenPresent:Boolean(this.screen),musicBodyReused:Boolean(this.app),
      verifiedAlbums:2,verifiedTracks:18,oneCanonicalOrb:orbs===1,
      oneCanonicalCanvas:canvases===1,duplicateOrbs:Math.max(0,orbs-1),
      activePlayers:players,singlePlayer:players<=1,autoplay:false,
      inventedAlbums:0,inventedTracks:0,newPlayers:0,newCanvases:0,
      permanentAnimationLoops:0,privateContentReads:0,work14:false
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort?.abort?.();
    this.documentTarget?.getElementById?.(STYLE_ID)?.remove?.();
    if (this.root?.dataset) delete this.root.dataset.work13MusicaWorld;
    if (this.screen?.dataset) {
      ['musicaWorld','musicaUniverse','musicaWorldPhase','musicaWorldPresence','musicaWorldReason','musicaWorldSequence']
        .forEach(key=>delete this.screen.dataset[key]);
    }
    if (this.app?.dataset) {
      ['musicaWorld','musicaUniverse','musicaWorldPhase','musicaWorldPrivacy','musicaAutoplay','musicaMaximumPlayers']
        .forEach(key=>delete this.app.dataset[key]);
    }
    return true;
  }
}

export function createMusicaWorldV625(options={}) {
  const host = options.windowTarget || globalThis.window || globalThis;
  if (host?.[INSTANCE]?.destroyed === false) return host[INSTANCE];
  const world = new MusicaWorldV625(options);
  try { host[INSTANCE] = world; } catch {}
  return world;
}

export default createMusicaWorldV625;
