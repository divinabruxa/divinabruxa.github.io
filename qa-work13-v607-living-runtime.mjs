/* DIVINA BRUXA — WORK13 V607 · QA DE RUNTIME DA SABEDORIA VIVA */
import {
  LIVING_WISDOM_PATH_CONTRACT_V607,
  LivingWisdomPathV607,
  createLivingWisdomPathV607,
  livingContinuationV607,
  livingLibraryCopyV607,
  normalizeLivingRouteV607
} from './living-wisdom-path-v607.js';

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
    this.nodes = new Map();
    this.savedState = null;
    this.activeElement = null;
    this.events = [];
  }
  dispatchEvent(event) {
    this.events.push(event);
    return super.dispatchEvent(event);
  }
  getElementById(id) { return this.nodes.get(id) || null; }
  querySelector(selector) {
    if (selector === '#journalApp [data-journal-save-state]') return this.savedState;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
  createElement() { throw new Error('unexpected-dom-create-in-runtime-harness'); }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.frames = [];
    this.location = { hash:'#home' };
  }
  requestAnimationFrame(callback) {
    this.frames.push(callback);
    return this.frames.length;
  }
  flushFrames(limit = 12) {
    let cycles = 0;
    while (this.frames.length && cycles < limit) {
      const frames = this.frames.splice(0);
      frames.forEach(callback => callback(cycles * 16));
      cycles += 1;
    }
    return cycles;
  }
}

const classList = () => {
  const values = new Set();
  return {
    add:(...items) => items.forEach(item => values.add(item)),
    remove:(...items) => items.forEach(item => values.delete(item)),
    contains:item => values.has(item)
  };
};

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });

const contract = LIVING_WISDOM_PATH_CONTRACT_V607;
check('contract:version', contract.version === 607);
check('contract:base-v606', contract.base.startsWith('V606-whit-silence-timing'));
check('contract:work13-stage-seven', contract.work === 'WORK13' && contract.macroStage === '7-of-10');
check('contract:one-law', contract.law === 'one-orb-one-universe-one-presence-one-journey');
check('contract:three-worlds', contract.worlds.join('|') === 'library|school|journal');
check('contract:one-sequence', contract.sequence.join('|') === 'one-discovery|one-lesson|direct-writing');
check('contract:context-v602', contract.contextModel === 'V602-public-route-metadata-only');
check('contract:library-entry', contract.libraryEntry === 'one-discovery-through-canonical-orb');
check('contract:library-catalogue-explicit', contract.libraryCatalogue === 'explicit-request-only');
check('contract:library-count', contract.libraryCardsPreserved === 78);
check('contract:school-entry', contract.schoolEntry === 'one-natural-next-lesson');
check('contract:school-programme-explicit', contract.schoolProgramme === 'explicit-request-only');
check('contract:school-counts', contract.schoolModulesPreserved === 17 && contract.schoolLessonsPreserved === 124);
check('contract:journal-direct', contract.journalEntry === 'direct-writing-after-explicit-depth');
check('contract:journal-review-explicit', contract.journalReview === 'explicit-request-only');
check('contract:journal-private', contract.journalPrivateByDefault === true);
check('contract:one-continuation', contract.maximumContextualContinuations === 1);
check('contract:no-auto-navigation', contract.automaticNavigation === false);
check('contract:no-auto-whit', contract.automaticWhitSpeech === false && contract.whitTimingAuthority === 'V606-unchanged');
check('contract:engines-preserved', JSON.stringify(contract.existingEnginesPreserved) === JSON.stringify({ library:'V555', school:'V555', journal:'V556' }));
for (const key of [
  'privateContentReads','formValueReads','journalBodyReads','journalDraftReads',
  'journalHistoryReads','schoolNoteReads','questionReads','cardIdentityReads',
  'storageReads','storageWrites','networkCalls','modelCalls','newCanvases',
  'newRenderers','permanentAnimationLoops','deferredTimers','mutationObservers'
]) check(`contract:zero:${key}`, contract[key] === 0, contract[key]);
check('contract:no-emotion-inference', contract.emotionInference === false);
check('contract:iphone-first', contract.iphoneFirst === true && contract.reducedMotionPreservesMeaning === true);

check('pure:normalizes-hash', normalizeLivingRouteV607('#library?x=1') === 'library');
check('pure:normalizes-empty', normalizeLivingRouteV607('') === 'home');

const readingContext = { route:'library', previousRoute:'spreads', next:{ route:'school', intention:'learn', reason:'symbol-to-study' } };
const readingCopy = livingLibraryCopyV607(readingContext, false);
check('copy:reading-origin', readingCopy.eyebrow === 'DA LEITURA AO SIMBOLO');
check('copy:reading-one-card', readingCopy.primary === 'Descobrir uma carta');
const schoolCopy = livingLibraryCopyV607({ route:'library', previousRoute:'school' }, false);
check('copy:school-origin', schoolCopy.eyebrow === 'DA PRATICA AO SIMBOLO');
const freshCopy = livingLibraryCopyV607({ route:'library', previousRoute:'home' }, false);
check('copy:fresh-one-at-time', freshCopy.title === 'Uma carta por vez.');
const discoveredCopy = livingLibraryCopyV607(readingContext, true);
check('copy:discovered-practice', discoveredCopy.primary === 'Continuar na Escola');
const libraryNext = livingContinuationV607(readingContext, 'library');
check('continuation:library-school', libraryNext?.route === 'school' && libraryNext.label === 'Continuar na Escola');
check('continuation:wrong-current-route', livingContinuationV607({ ...readingContext, route:'daily' }, 'library') === null);
const journalNext = livingContinuationV607({ route:'journal', previousRoute:'daily', next:{ route:'daily', reason:'writing-to-origin' } }, 'journal');
check('continuation:journal-daily', journalNext?.route === 'daily' && journalNext.label.includes('Carta do Dia'));
check('continuation:journal-protected-blocked', livingContinuationV607({ route:'journal', next:{ route:'ai' } }, 'journal') === null);
check('continuation:maximum-one', [libraryNext].filter(Boolean).length === 1);

const doc = new FakeDocument();
const win = new FakeWindow();
let contextSnapshot = { route:'home', previousRoute:null, returnRoute:null, next:null };
const contextMemory = { snapshot:() => contextSnapshot };
const chamberCalls = [];
const chambers = {
  clearSequence:reason => { chamberCalls.push({ type:'clear', reason }); return true; },
  engage:(route, mode, reason) => { chamberCalls.push({ type:'engage', route, mode, reason }); return true; },
  resumeEffects:() => { chamberCalls.push({ type:'resume' }); return true; }
};
const navigationCalls = [];
const runtime = new LivingWisdomPathV607({
  contextMemory,
  chambers,
  navigate:(route, options) => navigationCalls.push({ route, options }),
  documentTarget:doc,
  windowTarget:win
});

check('runtime:identity', doc.documentElement.dataset.livingWisdomPath === 'v607');
check('runtime:macro-identity', doc.documentElement.dataset.work13Macro === '7-living-wisdom-path');
check('runtime:privacy-identity', doc.documentElement.dataset.livingWisdomPrivacy === 'public-route-metadata-only');
check('runtime:ready-event', doc.events.some(event => event.type === 'divina:living-wisdom-ready'));
check('runtime:no-navigation-on-boot', navigationCalls.length === 0);

const title = { focused:false, focus(){ this.focused = true; } };
const form = { scrolled:false, scrollIntoView(){ this.scrolled = true; } };
const journalRoot = {
  dataset:{ v607JournalMode:'write' },
  querySelector(selector) {
    if (selector === '#journalForm') return form;
    if (selector === '#journalForm [name="title"]') return title;
    if (selector === '#journalMemoriesTitle') return { focus(){} };
    return null;
  }
};
const journalScreen = { dataset:{} };
doc.nodes.set('journal', journalScreen);
runtime.ensureJournal = () => journalRoot;
runtime.updateJournalPath = () => true;
runtime.updateJournalReturn = () => true;
runtime.route = 'journal';
contextSnapshot = { route:'journal', previousRoute:'daily', returnRoute:'daily', next:{ route:'daily', reason:'writing-to-origin' } };
runtime.context = contextSnapshot;

doc.dispatchEvent(new FakeCustomEvent('divina:reality-depth', {
  detail:{ route:'journal', source:'explicit-gesture', privateText:'CANARY_PRIVATE_DEPTH' }
}));
check('journal:direct-mode', journalRoot.dataset.v607JournalMode === 'write' && journalScreen.dataset.v607Journal === 'write');
check('journal:old-delay-cancelled', chamberCalls.some(call => call.type === 'clear' && call.reason.includes('direct-write')));
check('journal:existing-chamber-engaged', chamberCalls.some(call => call.type === 'engage' && call.route === 'journal' && call.mode === 'write'));
check('journal:effects-resumed', chamberCalls.some(call => call.type === 'resume'));
check('journal:editor-scrolled', form.scrolled === true);
check('journal:focus-deferred-once', title.focused === false && win.frames.length === 1);
win.flushFrames();
check('journal:title-focused-without-read', title.focused === true);
check('journal:no-auto-navigation', navigationCalls.length === 0);

runtime.enterJournalReview();
check('journal:review-explicit', journalRoot.dataset.v607JournalMode === 'review');
check('journal:mirror-existing-chamber', chamberCalls.some(call => call.type === 'engage' && call.mode === 'mirror'));
check('journal:review-count', runtime.journalReviewOpens === 1);

let returnUpdates = 0;
runtime.updateJournalReturn = () => { returnUpdates += 1; return true; };
doc.savedState = { dataset:{ state:'saved' } };
runtime.onSubmit({ target:{ matches:selector => selector === '#journalForm' } });
win.flushFrames();
check('journal:save-state-only', runtime.journalSaved === true && returnUpdates === 1);
check('journal:no-private-payload-in-status', !JSON.stringify(runtime.status()).includes('CANARY_PRIVATE_DEPTH'));

const libraryRoot = { dataset:{} };
runtime.route = 'library';
runtime.ensureLibrary = () => libraryRoot;
runtime.updateLibraryGuide = () => true;
const beforeDiscoveries = runtime.libraryDiscoveries;
for (let index = 0; index < 78; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:wisdom-public-context-v539', {
    detail:{ kind:'card', id:`PRIVATE-CARD-${index}`, label:`CANARY_CARD_${index}`, privateQuestion:'CANARY_QUESTION' }
  }));
}
check('library:seventy-eight-structural-events', runtime.libraryDiscoveries - beforeDiscoveries === 78);
check('library:discovered-without-identity', runtime.libraryDiscovered === true);
check('library:no-auto-navigation-after-78', navigationCalls.length === 0);
check('library:no-card-canary-retained', !JSON.stringify(runtime.status()).includes('CANARY_CARD'));
contextSnapshot = readingContext;
runtime.context = readingContext;
runtime.explicitNavigate('school', 'library-to-school');
check('library:explicit-navigation-only', navigationCalls.length === 1 && navigationCalls[0].route === 'school');

const schoolRoot = {
  dataset:{ v607SchoolMode:'choice' },
  querySelector(){ return null; },
  querySelectorAll(){ return []; }
};
runtime.ensureSchool = () => schoolRoot;
runtime.updateSchoolStep = () => true;
runtime.setSchoolMode('module');
check('school:programme-explicit', schoolRoot.dataset.v607SchoolMode === 'module');
const lesson = { isConnected:true, classList:classList(), scrolled:false, scrollIntoView(){ this.scrolled = true; } };
runtime.focusSchoolLesson(lesson);
check('school:one-lesson-mode', schoolRoot.dataset.v607SchoolMode === 'lesson');
check('school:current-lesson-marked', lesson.classList.contains('is-v607-current'));
check('school:current-lesson-visible-target', lesson.scrolled === true);
check('school:no-navigation-from-focus', navigationCalls.length === 1);

const audit = runtime.audit();
check('audit:one-orb', audit.canonicalOrbs === 1);
check('audit:one-canvas', audit.canonicalCanvases === 1);
check('audit:no-auto-navigation', audit.automaticNavigation === false);
check('audit:no-auto-whit', audit.automaticWhitSpeech === false);
for (const key of [
  'privateContentReads','formValueReads','journalBodyReads','journalDraftReads',
  'journalHistoryReads','schoolNoteReads','questionReads','cardIdentityReads',
  'storageReads','storageWrites','networkCalls','modelCalls','newCanvases',
  'newRenderers','permanentAnimationLoops','deferredTimers','mutationObservers'
]) check(`audit:zero:${key}`, audit[key] === 0, audit[key]);

const factoryDoc = new FakeDocument();
const factoryWin = new FakeWindow();
const first = createLivingWisdomPathV607({ documentTarget:factoryDoc, windowTarget:factoryWin, contextMemory });
const second = createLivingWisdomPathV607({ documentTarget:factoryDoc, windowTarget:factoryWin, contextMemory });
check('factory:singleton', first === second);
check('factory:global', globalThis.divinaLivingWisdomPathV607 === first);
first.destroy();
check('factory:destroy-cleans-global', globalThis.divinaLivingWisdomPathV607 !== first);

runtime.destroy();
check('runtime:destroyed', runtime.destroyed === true);
check('runtime:destroy-cleans-identity', doc.documentElement.dataset.livingWisdomPath === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V607',
  work:'WORK13',
  macroStage:'7-of-10 / living-wisdom-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  libraryStressEvents:78,
  automaticNavigationCallsBeforeExplicit:0,
  privatePayloadRetained:false,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
