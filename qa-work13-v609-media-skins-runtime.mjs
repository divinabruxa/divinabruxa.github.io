/* DIVINA BRUXA — WORK13 V609 · QA DE RUNTIME DA OBRA EM PRIMEIRO PLANO */
import {
  LIVING_MEDIA_SKINS_CONTRACT_V609,
  LivingMediaSkinsV609,
  mediaSkinEntryCopyV609,
  nextMediaSkinPhaseV609,
  normalizeMediaSkinRouteV609
} from './living-media-skins-v609.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeScreen {
  constructor(id) {
    this.id = id;
    this.dataset = {};
    this.attributes = new Map();
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.events = [];
    this.nodes = new Map([
      ['music',new FakeScreen('music')],
      ['videos',new FakeScreen('videos')],
      ['skins',new FakeScreen('skins')]
    ]);
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById(id) { return this.nodes.get(id) || null; }
  querySelector() { return null; }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
  createElement() { throw new Error('runtime-must-not-create-controls-without-engine-roots'); }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'#home' };
    this.frames = new Map();
    this.nextFrame = 0;
  }
  requestAnimationFrame(callback) {
    const id = ++this.nextFrame;
    this.frames.set(id, callback);
    return id;
  }
  cancelAnimationFrame(id) { this.frames.delete(id); }
  flushFrames(limit = 20) {
    let cycles = 0;
    while (this.frames.size && cycles < limit) {
      const callbacks = [...this.frames.values()];
      this.frames.clear();
      callbacks.forEach(callback => callback(cycles * 16));
      cycles += 1;
    }
    return cycles;
  }
}

const actionEvent = action => ({
  target:{ closest:selector => selector === '[data-v609-action]' ? { dataset:{ v609Action:action } } : null }
});
const selectorEvent = selected => ({
  target:{ closest:selector => selector === selected ? {} : null }
});

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const contract = LIVING_MEDIA_SKINS_CONTRACT_V609;

check('contract:version', contract.version === 609);
check('contract:base-v608', contract.base.startsWith('V608-commerce-clarity'));
check('contract:stage-nine', contract.work === 'WORK13' && contract.macroStage === '9-of-10');
check('contract:one-law', contract.law === 'one-orb-one-universe-one-presence-one-journey');
check('contract:three-worlds', contract.worlds.join('|') === 'music|videos|skins');
check('contract:sequence', contract.sequence.join('|') === 'work-first|explicit-depth|single-player-on-demand|interface-recedes');
check('contract:context-v602', contract.contextModel === 'V602-public-route-metadata-only');
check('contract:music-engine', contract.music.engine === 'V559');
check('contract:music-truth', contract.music.artist === 'Hércules DX' && contract.music.verifiedTracks === 18);
check('contract:albums', JSON.stringify(contract.music.verifiedAlbums) === JSON.stringify([
  { title:'Sobre as Estrelas', year:2024, tracks:10 },
  { title:'Z', year:2026, tracks:8 }
]));
check('contract:single-player', contract.music.activePlayersMaximum === 1 && contract.music.playerLoadsAfterExplicitGesture === true);
check('contract:no-autoplay', contract.music.autoplay === false && contract.videos.autoplay === false && contract.automaticPlayback === false);
check('contract:videos-truth', contract.videos.engine === 'V559' && contract.videos.project === 'De Frente com o Tarot');
check('contract:no-invented-video', contract.videos.publishedEpisodesAtRelease === 0 && contract.videos.inventedEpisodes === 0 && contract.videos.publishedOnly === true);
check('contract:skins-engine', contract.skins.engine === 'V201' && contract.skins.registry === 'V12');
check('contract:skins-truth', contract.skins.count === 30 && contract.skins.freeSkin === 'classic' && contract.skins.paidSkins === 29);
check('contract:global-skin', contract.skins.globalApplyWithoutReload === true && contract.skins.cosmeticOnly === true);
check('contract:no-real-billing', contract.skins.realBilling === false && contract.skins.serverAuthority === true);
check('contract:engines-preserved', JSON.stringify(contract.existingEnginesPreserved) === JSON.stringify({ music:'V559', videos:'V559', skins:'V201' }));
check('contract:no-surfaces', contract.newSurfaces === 0 && contract.maximumNewControlsSimultaneous === 3);
check('contract:no-auto-navigation', contract.automaticNavigation === false);
check('contract:no-auto-whit', contract.automaticWhitSpeech === false && contract.whitTimingAuthority === 'V606-unchanged');
for (const key of [
  'privateContentReads','listeningHistoryReads','viewingHistoryReads','searchQueryReads',
  'accountProfileReads','purchaseBodyReads','storageReads','storageWrites','networkCalls',
  'modelCalls','newCanvases','newRenderers','newPlayers','permanentAnimationLoops',
  'deferredTimers','mutationObservers'
]) check(`contract:zero:${key}`, contract[key] === 0, contract[key]);
check('contract:iphone-first', contract.iphoneFirst === true && contract.reducedMotionPreservesMeaning === true);

check('pure:normalizes-hash', normalizeMediaSkinRouteV609('#music?x=1') === 'music');
check('pure:normalizes-empty', normalizeMediaSkinRouteV609('') === 'home');
check('copy:music-reading-continuity', mediaSkinEntryCopyV609('music', { previousRoute:'daily' }).title.includes('leitura'));
check('copy:music-work-first', mediaSkinEntryCopyV609('music', {}).title.includes('álbum'));
check('copy:video-truth', mediaSkinEntryCopyV609('videos', {}).title.includes('publicado'));
check('copy:skin-media-continuity', mediaSkinEntryCopyV609('skins', { previousRoute:'music' }).title.includes('atmosfera'));
check('phase:music-depth', nextMediaSkinPhaseV609('music','focus','depth') === 'detail');
check('phase:music-collapse', nextMediaSkinPhaseV609('music','detail','depth') === 'focus');
check('phase:music-player', nextMediaSkinPhaseV609('music','focus','play') === 'immersive');
check('phase:music-close', nextMediaSkinPhaseV609('music','immersive','close') === 'focus');
check('phase:video-empty-honest', nextMediaSkinPhaseV609('videos','focus','play',false) === 'empty');
check('phase:video-player', nextMediaSkinPhaseV609('videos','focus','play',true) === 'immersive');
check('phase:skin-gallery', nextMediaSkinPhaseV609('skins','focus','toggle') === 'gallery');
check('phase:skin-collapse', nextMediaSkinPhaseV609('skins','gallery','applied') === 'focus');

const doc = new FakeDocument();
const win = new FakeWindow();
let snapshot = { route:'home', previousRoute:null, returnRoute:null };
const runtime = new LivingMediaSkinsV609({
  contextMemory:{ snapshot:() => snapshot },
  documentTarget:doc,
  windowTarget:win
});

check('runtime:identity', doc.documentElement.dataset.livingMediaSkins === 'v609');
check('runtime:macro-identity', doc.documentElement.dataset.work13Macro === '9-media-skins-interface-recedes');
check('runtime:privacy-identity', doc.documentElement.dataset.livingMediaSkinsPrivacy === 'public-route-and-public-player-state-only');
check('runtime:ready-event', doc.events.some(event => event.type === 'divina:living-media-skins-ready'));
check('runtime:no-controls-without-engines', runtime.nodesCreatedTotal === 0);
check('runtime:one-orb', runtime.audit().oneCanonicalOrb === true);
check('runtime:one-canvas', runtime.audit().oneCanonicalCanvas === true);
check('runtime:no-player-created', runtime.audit().activeMediaFrames === 0);

runtime.enterRoute('music','test');
check('runtime:music-focus', runtime.phase('music') === 'focus' && doc.getElementById('music').dataset.v609Phase === 'focus');
runtime.onClick(actionEvent('music-depth'));
check('runtime:music-detail-explicit', runtime.phase('music') === 'detail');
runtime.onClick(selectorEvent('[data-play-release]'));
check('runtime:music-immersive', runtime.phase('music') === 'immersive' && runtime.playerOpens === 1);
runtime.onClick(selectorEvent('#musicApp [data-close-player]'));
check('runtime:music-close', runtime.phase('music') === 'focus' && runtime.playerCloses === 1);
runtime.onClick(selectorEvent('[data-release-id]'));
check('runtime:music-select-stays-focus', runtime.phase('music') === 'focus');

runtime.enterRoute('videos','test');
check('runtime:videos-empty', runtime.phase('videos') === 'empty' && doc.getElementById('videos').dataset.v609InventedEpisodes === '0');
runtime.onClick(actionEvent('videos-depth'));
check('runtime:empty-video-cannot-deepen', runtime.phase('videos') === 'empty');

runtime.enterRoute('skins','test');
check('runtime:skins-focus', runtime.phase('skins') === 'focus');
runtime.onClick(actionEvent('skins-gallery'));
check('runtime:skins-gallery-explicit', runtime.phase('skins') === 'gallery' && runtime.skinGalleryOpens === 1);
doc.dispatchEvent(new FakeCustomEvent('divina:skin-applied', { detail:{ skinId:'PUBLIC_SKIN_ID' } }));
check('runtime:skins-collapse-after-apply', runtime.phase('skins') === 'focus' && runtime.skinApplications === 1);

snapshot = {
  route:'music', previousRoute:'daily', returnRoute:'daily',
  listeningHistory:'CANARY_LISTENING_609', viewingHistory:'CANARY_VIEWING_609',
  searchQuery:'CANARY_SEARCH_609', accountProfile:'CANARY_PROFILE_609',
  purchaseBody:'CANARY_PURCHASE_609'
};
doc.dispatchEvent(new FakeCustomEvent('divina:context-memory-updated', { detail:{ context:snapshot } }));
win.flushFrames();
check('runtime:context-route-only', runtime.context.route === 'music' && runtime.context.previousRoute === 'daily');
check('runtime:single-frame-coalesced', win.frames.size === 0);

const canaries = ['CANARY_LISTENING_609','CANARY_VIEWING_609','CANARY_SEARCH_609','CANARY_PROFILE_609','CANARY_PURCHASE_609'];
const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.audit(), context:runtime.context });
for (const canary of canaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
check('runtime:no-navigation-event', !doc.events.some(event => /navigate/i.test(event.type)));
check('runtime:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));
check('runtime:control-budget', runtime.audit().controlsWithinBudget === true);
check('runtime:single-player-audit', runtime.audit().singlePlayerPreserved === true);

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:identity-removed', doc.documentElement.dataset.livingMediaSkins === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V609',
  work:'WORK13',
  macroStage:'9-of-10 / media-skins-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  playerOpens:runtime.playerOpens,
  playerCloses:runtime.playerCloses,
  skinApplications:runtime.skinApplications,
  privateCanariesRetained:canaries.some(value => serialized.includes(value)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
