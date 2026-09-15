/* DIVINA BRUXA 4.0 — ORBE SUPREMA 2.0 · MACROETAPA 1 · QA V576
   Verifica a cadeia Home -> menu -> Tarot Livre -> primeira revelação. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
let passed = 0;
const check = (condition, id, detail = '') => {
  if (condition) passed += 1;
  else failures.push({ id, detail });
};

const files = [
  'index.html',
  'app-v208.js',
  'navigation.js',
  'supreme-orb-core-v501.js',
  'orb-persistent-journey-v565.js',
  'orbital-menu-v502.js',
  'page-loader-v1.js',
  'tarot-livre-orbe-os-v517.js',
  'tarot-livre-orbe-os-v517.css',
  'tarot-session.js',
  'tarot-data.js',
  'sw.js'
];
files.forEach(file => check(fs.existsSync(path.join(root, file)), `file:${file}`));

const index = read('index.html');
const app = read('app-v208.js');
const navigation = read('navigation.js');
const core = read('supreme-orb-core-v501.js');
const journey = read('orb-persistent-journey-v565.js');
const menu = read('orbital-menu-v502.js');
const loader = read('page-loader-v1.js');
const tarot = read('tarot-livre-orbe-os-v517.js');
const tarotCss = read('tarot-livre-orbe-os-v517.css');
const sw = read('sw.js');

check((index.match(/id=["']orb["']/g) || []).length === 1, 'orb:one-canonical-id');
check(journey.includes('travelerCopies:0'), 'orb:no-traveler-copy');
check(journey.includes('physicalOrbTransport:true'), 'orb:physical-transport');
check(!journey.includes('snapshotCadence:\'one-per-navigation\''), 'orb:no-snapshot-traveler');
check(core.includes('handoffClaimToJourney(stage)'), 'orb:explicit-authority-handoff');
check(journey.includes('capturePhysicalOrb(origin,{handoffClaim:true})'), 'orb:source-claim-handed-to-flight');

const closingIndex = menu.indexOf('const closing = this.close({');
const navigationIndex = menu.indexOf('const travel = Promise.resolve(this.core.navigate(route');
const closeAwaitIndex = menu.indexOf('await Promise.resolve(closing)');
check(closingIndex >= 0 && navigationIndex > closingIndex && closeAwaitIndex > navigationIndex,
  'menu:travel-starts-before-close-finishes');
check(menu.includes('preserveClaim:true'), 'menu:no-return-home-gap');
const departOrder = core.indexOf('await journey.depart({');
const routeCommitOrder = core.indexOf('const result = await Promise.resolve(this.commit(route))');
const arrivalOrder = core.indexOf('await journey.arrive({');
check(departOrder >= 0 && routeCommitOrder > departOrder && arrivalOrder > routeCommitOrder,
  'flow:depart-commit-arrive-order');
const prepareOrder = navigation.indexOf('beforeEnter?.(id)');
const navigationCommitOrder = navigation.indexOf('const committed = commit(id, push)');
const routeReadyOrder = navigation.indexOf("document.dispatchEvent(new CustomEvent(error ? 'divina:route-error' : 'divina:route-ready'");
check(prepareOrder >= 0 && navigationCommitOrder > prepareOrder && routeReadyOrder > navigationCommitOrder,
  'flow:prepare-commit-route-ready-order');

check(loader.includes("const ARRIVAL_CRITICAL_ROUTES_V576 = new Set(['tarot'])"),
  'tarot:arrival-critical-route');
const criticalPrepare = loader.indexOf('if(ARRIVAL_CRITICAL_ROUTES_V576.has(id))');
const deferredPrepare = loader.indexOf('const settled=prime(id)');
check(criticalPrepare >= 0 && deferredPrepare > criticalPrepare, 'tarot:load-before-deferred-path');
check(loader.slice(criticalPrepare, deferredPrepare).includes('return load(id).then'),
  'tarot:world-built-before-route-commit');
check(loader.includes("import('./tarot-livre-orbe-os-v517.js?v=576-foundation')"),
  'tarot:fresh-module-query');

check(tarot.includes('readyForArrival()'), 'tarot:arrival-readiness-contract');
check(tarot.includes('this.orbCore.claimedHost === this.orbHost'), 'tarot:logical-authority-required');
check(tarot.includes('this.orbHost.contains(this.orb)'), 'tarot:physical-authority-required');
check(tarot.includes("this.orb.addEventListener('click'"), 'tarot:orb-click-bound');
check(/if \(this\.active && this\.orbHost\.contains\(this\.orb\)\) this\.draw\(\)/.test(tarot),
  'tarot:click-reveals-only-from-owned-orb');
check(journey.includes("throw new Error('tarot-owned-host-unavailable-v576')"),
  'tarot:no-provisional-landing');

check(journey.includes('adaptiveDuration + 240'), 'motion:journey-watchdog');
check(tarot.includes('settleAnimationsV576'), 'motion:reveal-watchdog');
check(journey.includes('motionLaw:\'critical-damped-bezier\''), 'motion:smooth-law');
check(journey.includes('teleportFallback:false'), 'motion:no-teleport-fallback');

check(journey.includes('body[data-screen="tarot"] .app-header .brand .mini-orb'),
  'visual:tarot-header-orb-suppressed');
check(tarotCss.includes('left: 50% !important') && tarotCss.includes('translate: -50% 0'),
  'iphone:altar-centered-css');
check(tarotCss.includes('--db521-viewport-width') && app.includes('document.documentElement.clientWidth'),
  'iphone:physical-viewport-width');
check(journey.includes('visualViewportSnapshotV574') && journey.includes('offsetLeft'),
  'iphone:visual-viewport-aware');
for (const width of [320, 375, 390, 393, 414, 430]) {
  const hostCenter = width * 0.5;
  check(Math.abs(hostCenter - width / 2) < 0.001, `iphone:center:${width}`);
}

check(index.includes('app-v208.js?v=576'), 'cache:index-v576');
check(index.includes('sw.js?v=576') && index.includes('divina.sw.reload.v576'), 'cache:inline-sw-v576');
check(app.includes("./page-loader-v1.js?v=576-foundation"), 'cache:app-loader-v576');
check(app.includes("./orb-persistent-journey-v565.js?v=576-foundation"), 'cache:app-journey-v576');
check(app.includes("./orbital-menu-v502.js?v=576-foundation"), 'cache:app-menu-v576');
check(sw.includes('const VERSION=576;') && sw.includes('divina-bruxa-v576-shell'), 'cache:worker-v576');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V576') && sw.includes('event.respondWith(networkFirst(request)'),
  'cache:critical-modules-network-first');
check(sw.includes('/app-v208\\.js\\?v=576/'), 'cache:shell-validator-v576');

globalThis.document = {
  documentElement:{ clientWidth:390, clientHeight:844, dataset:{} },
  dispatchEvent() {}
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
};
const coreModule = await import(pathToFileURL(path.join(root, 'supreme-orb-core-v501.js')).href + '?qa=v576');
const fakeOrb = { classList:{ add() {} } };
const fakeHost = { id:'menuHost', dataset:{ supremeOrbHost:'active' } };
const fakeStage = { contains:node => node === fakeOrb };
const fakeCore = Object.create(coreModule.SupremeOrbCoreV501.prototype);
Object.assign(fakeCore, {
  claimedHost:fakeHost,
  orb:fakeOrb,
  route:'home',
  journeyClaimHandoffs:0
});
const handedOff = fakeCore.handoffClaimToJourney(fakeStage);
check(handedOff === fakeHost, 'flow:menu-authority-released-to-flight');
check(fakeCore.claimedHost === null, 'flow:no-stale-menu-claim');
check(!('supremeOrbHost' in fakeHost.dataset), 'flow:menu-host-marker-cleared');
check(fakeCore.journeyClaimHandoffs === 1, 'flow:single-handoff-counted');

class FakeNode {
  constructor(id) {
    this.id = id;
    this.dataset = {};
    this.children = [];
    this.parentNode = null;
    this.isConnected = true;
    this.attributes = new Map();
    const tokens = new Set();
    this.classList = {
      add:(...names) => names.forEach(name => tokens.add(name)),
      remove:(...names) => names.forEach(name => tokens.delete(name)),
      toggle:(name, force) => {
        if (force === false) tokens.delete(name);
        else if (force === true || !tokens.has(name)) tokens.add(name);
        else tokens.delete(name);
      },
      contains:name => tokens.has(name)
    };
  }
  append(node) {
    if (node.parentNode) {
      node.parentNode.children = node.parentNode.children.filter(child => child !== node);
    }
    node.parentNode = this;
    this.children.push(node);
  }
  insertBefore(node) { this.append(node); }
  contains(node) { return node === this || this.children.some(child => child.contains?.(node) || child === node); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
}

const homeHost = new FakeNode('homeHost');
const menuHost = new FakeNode('menuHost');
const tarotHost = new FakeNode('tarotHost');
const journeyStage = new FakeNode('journeyStage');
const livingOrb = new FakeNode('orb');
homeHost.append(livingOrb);
const flowCore = Object.create(coreModule.SupremeOrbCoreV501.prototype);
Object.assign(flowCore, {
  orb:livingOrb,
  claimedHost:null,
  mode:'home',
  route:'home',
  renderer:null,
  motion:null,
  journeyClaimHandoffs:0,
  setMode(mode) { this.mode = mode; return mode; }
});
const releaseMenu = flowCore.claim(menuHost, { mode:'menu', ariaLabel:'Menu' });
check(flowCore.claimedHost === menuHost && menuHost.contains(livingOrb), 'flow:home-to-menu-one-body');
journeyStage.append(livingOrb);
flowCore.handoffClaimToJourney(journeyStage);
check(flowCore.claimedHost === null && journeyStage.contains(livingOrb), 'flow:menu-to-journey-one-body');
check(releaseMenu() === false && journeyStage.contains(livingOrb), 'flow:closed-menu-cannot-steal-body');
const releaseTarot = flowCore.claim(tarotHost, { mode:'tarot', ariaLabel:'Revelar carta' });
check(flowCore.claimedHost === tarotHost && tarotHost.contains(livingOrb), 'flow:journey-reserves-tarot-host');
journeyStage.append(livingOrb);
check(flowCore.claimedHost === tarotHost && !tarotHost.contains(livingOrb), 'flow:tarot-logical-reservation-during-arrival');
tarotHost.append(livingOrb);
check(flowCore.claimedHost === tarotHost && tarotHost.contains(livingOrb), 'flow:tarot-physical-settle');
check([homeHost, menuHost, journeyStage, tarotHost].filter(host => host.contains(livingOrb)).length === 1,
  'flow:never-two-physical-orbs');
check(typeof releaseTarot === 'function', 'flow:tarot-claim-releasable');

globalThis.matchMedia = () => ({ matches:false });
const journeyModule = await import(pathToFileURL(path.join(root, 'orb-persistent-journey-v565.js')).href + '?qa=v576');
let animationCancelled = false;
const journeyProbe = Object.create(journeyModule.OrbPersistentJourneyV565.prototype);
Object.assign(journeyProbe, {
  current:{ x:42, y:84 },
  scale:1,
  sourceSize:100,
  animations:new Set(),
  stage:{
    style:{ transform:'' },
    animate:() => ({
      finished:new Promise(() => {}),
      cancel() { animationCancelled = true; }
    })
  }
});
const watchdogStarted = performance.now();
await journeyProbe.move([{ x:195, y:320 }], [0.78], 12, 'linear');
const watchdogElapsed = performance.now() - watchdogStarted;
check(watchdogElapsed < 700, 'motion:safari-finished-cannot-lock-flight', `${watchdogElapsed.toFixed(1)}ms`);
check(animationCancelled && journeyProbe.animations.size === 0, 'motion:watchdog-cleans-animation');
check(journeyProbe.current.x === 195 && journeyProbe.current.y === 320, 'motion:watchdog-finishes-at-destination');

const session = await import(pathToFileURL(path.join(root, 'tarot-session.js')).href + '?qa=v576');
const { CARDS } = await import(pathToFileURL(path.join(root, 'tarot-data.js')).href + '?qa=v576');
let state = session.createTarotState({
  randomInt:max => max - 1,
  now:() => 1,
  sessionId:'qa-v576-first-card',
  auditSeed:'qa-v576-first-card-seed'
});
const first = session.drawNextCard(state, { now:() => 2 });
state = first.state;
check(first.cardId !== null, 'reveal:first-card-produced');
check(state.revealed.length === 1 && state.waiting.length === 77, 'reveal:first-card-committed');
check(CARDS[first.cardId]?.orientation === 'normal', 'reveal:first-card-direct');
check(session.isValidTarotState(state), 'reveal:first-state-valid');

const all = [first.cardId];
for (let index = 1; index < 78; index += 1) {
  const result = session.drawNextCard(state, { now:() => index + 2 });
  state = result.state;
  all.push(result.cardId);
}
check(all.length === 78 && new Set(all).size === 78, 'reveal:78-without-repeats');
check(state.completed && state.waiting.length === 0, 'reveal:circle-completes');
check(all.every(id => CARDS[id]?.orientation === 'normal'), 'reveal:all-direct');

const total = passed + failures.length;
const report = {
  release:'V576',
  macroStage:'Orbe Suprema 2.0 / Macroetapa 1',
  state:failures.length ? 'FAIL' : 'PASS',
  passed,
  failed:failures.length,
  total,
  firstCard:first.cardId,
  firstCardName:CARDS[first.cardId]?.name || null,
  flow:['Home','menu orbital','viagem física','Tarot Livre','1 carta revelada'],
  failures
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
