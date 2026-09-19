/* DIVINA BRUXA — WORK13 V609 · QA DE CONTINUIDADE, PRIVACIDADE E PESO */
import { LivingMediaSkinsV609 } from './living-media-skins-v609.js';

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.documentElement = { dataset:{} };
    this.body = { dataset:{ screen:'home' } };
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.events = [];
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById() { return null; }
  querySelector() { return null; }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
  createElement() { throw new Error('continuity-must-not-create-dom-without-existing-engine-roots'); }
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
  flushFrames(limit = 8) {
    let cycles = 0;
    while (this.frames.size && cycles < limit) {
      const pending = [...this.frames.values()];
      this.frames.clear();
      pending.forEach(callback => callback(cycles * 16));
      cycles += 1;
    }
    return cycles;
  }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const doc = new FakeDocument();
const win = new FakeWindow();
let snapshot = { route:'home', previousRoute:null, returnRoute:null };
const runtime = new LivingMediaSkinsV609({
  documentTarget:doc,
  windowTarget:win,
  contextMemory:{ snapshot:() => snapshot }
});

check('boot:single-orb', runtime.audit().oneCanonicalOrb === true);
check('boot:single-canvas', runtime.audit().oneCanonicalCanvas === true);
check('boot:no-controls-with-worlds-absent', runtime.nodesCreatedTotal === 0);
check('boot:no-players', runtime.audit().activeMediaFrames === 0);
check('boot:no-frames', win.frames.size === 0);
check('boot:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));

const canaries = Object.freeze([
  'CANARY_LISTENING_HISTORY_609',
  'CANARY_VIEWING_HISTORY_609',
  'CANARY_SEARCH_QUERY_609',
  'CANARY_ACCOUNT_PROFILE_609',
  'CANARY_PURCHASE_BODY_609',
  'CANARY_PRIVATE_MEDIA_NOTE_609'
]);

for (let index = 0; index < 96; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:media-supreme-ready', {
    detail:{
      listeningHistory:`${canaries[0]}-${index}`,
      viewingHistory:`${canaries[1]}-${index}`,
      query:`${canaries[2]}-${index}`,
      privateNote:`${canaries[5]}-${index}`,
      albums:2,
      episodes:0
    }
  }));
}
check('media:all-events-survive', doc.events.filter(event => event.type === 'divina:media-supreme-ready').length === 96);
check('media:one-coalesced-frame', win.frames.size === 1, win.frames.size);
check('media:no-player-open', runtime.playerOpens === 0);

for (let index = 0; index < 88; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:skins-world-ready', {
    detail:{ profile:`${canaries[3]}-${index}`, purchase:`${canaries[4]}-${index}`, skinCount:30 }
  }));
}
check('skins:all-events-survive', doc.events.filter(event => event.type === 'divina:skins-world-ready').length === 88);
check('skins:still-one-coalesced-frame', win.frames.size === 1, win.frames.size);
check('skins:no-gallery-open', runtime.skinGalleryOpens === 0);

for (let index = 0; index < 72; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:skin-applied', {
    detail:{ skinId:`public-${index}`, profile:canaries[3], receipt:canaries[4] }
  }));
}
check('skin-apply:signals-counted', runtime.skinApplications === 72, runtime.skinApplications);
check('skin-apply:no-navigation', !doc.events.some(event => /navigate/i.test(event.type)));

snapshot = {
  route:'music', previousRoute:'daily', returnRoute:'daily',
  listeningHistory:canaries[0], viewingHistory:canaries[1], searchQuery:canaries[2],
  accountProfile:canaries[3], purchaseBody:canaries[4], privateNote:canaries[5]
};
doc.dispatchEvent(new FakeCustomEvent('divina:context-memory-updated', { detail:{ context:snapshot } }));
check('context:route-only', runtime.context.route === 'music' && runtime.context.previousRoute === 'daily');
check('context:private-omitted', !('listeningHistory' in runtime.context) && !('accountProfile' in runtime.context));
check('context:still-one-coalesced-frame', win.frames.size === 1, win.frames.size);
check('frames:one-cycle-finishes', win.flushFrames() === 1);
check('frames:none-remain', win.frames.size === 0);

runtime.enterRoute('music','continuity');
runtime.enterRoute('videos','continuity');
runtime.enterRoute('skins','continuity');
check('routes:no-dom-created', runtime.nodesCreatedTotal === 0);
check('routes:no-player-created', runtime.audit().activeMediaFrames === 0);
check('routes:videos-stays-honest-empty', runtime.phase('videos') === 'empty');

const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.audit(), context:runtime.context });
for (const canary of canaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
for (const key of [
  'privateContentReads','listeningHistoryReads','viewingHistoryReads','searchQueryReads',
  'accountProfileReads','purchaseBodyReads','storageReads','storageWrites','networkCalls',
  'modelCalls','newCanvases','newRenderers','newPlayers','permanentAnimationLoops',
  'deferredTimers','mutationObservers'
]) check(`contract:zero:${key}`, runtime.status()[key] === 0, runtime.status()[key]);

check('continuity:no-automatic-playback', runtime.status().automaticPlayback === false);
check('continuity:no-automatic-navigation', runtime.status().automaticNavigation === false);
check('continuity:no-automatic-whit', runtime.status().automaticWhitSpeech === false);
check('continuity:no-frame-loop', win.frames.size <= 1);
check('continuity:one-journey-law', runtime.status().law === 'one-orb-one-universe-one-presence-one-journey');
check('continuity:single-player-law', runtime.status().music.activePlayersMaximum === 1);
check('continuity:billing-stays-off', runtime.status().skins.realBilling === false);
check('continuity:server-authority', runtime.status().skins.serverAuthority === true);
check('continuity:video-invents-nothing', runtime.status().videos.inventedEpisodes === 0);

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:frame-cancelled', win.frames.size === 0);
check('destroy:identity-removed', doc.documentElement.dataset.livingMediaSkins === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V609',
  work:'WORK13',
  macroStage:'9-of-10 / continuity-private-content-and-weight',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  mediaSignals:96,
  skinWorldSignals:88,
  skinAppliedSignals:72,
  automaticPlayerOpens:runtime.playerOpens,
  automaticGalleryOpens:runtime.skinGalleryOpens,
  privateCanariesRetained:canaries.some(canary => serialized.includes(canary)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
