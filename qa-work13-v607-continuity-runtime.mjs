/* DIVINA BRUXA — WORK13 V607 · QA DE CONTINUIDADE E PRIVACIDADE */
import { LivingWisdomPathV607 } from './living-wisdom-path-v607.js';

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
  createElement() { throw new Error('continuity-must-not-create-dom-on-absent-world'); }
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = { hash:'#home' };
    this.frames = [];
  }
  requestAnimationFrame(callback) {
    this.frames.push(callback);
    return this.frames.length;
  }
  flushFrames() {
    while (this.frames.length) this.frames.splice(0).forEach(callback => callback(16));
  }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const doc = new FakeDocument();
const win = new FakeWindow();
const navigation = [];
let snapshot = { route:'home', previousRoute:null, next:null };
const contextMemory = { snapshot:() => snapshot };
const runtime = new LivingWisdomPathV607({
  documentTarget:doc,
  windowTarget:win,
  contextMemory,
  navigate:(route, options) => navigation.push({ route, options })
});

check('boot:single-orb', runtime.audit().canonicalOrbs === 1);
check('boot:single-canvas', runtime.audit().canonicalCanvases === 1);
check('boot:no-navigation', navigation.length === 0);
check('boot:no-whit-event', !doc.events.some(event => /whit/i.test(event.type)));

const privateCanaries = [
  'CANARY_JOURNAL_BODY_607',
  'CANARY_JOURNAL_HISTORY_607',
  'CANARY_SCHOOL_NOTE_607',
  'CANARY_QUESTION_607',
  'CANARY_CARD_IDENTITY_607'
];

for (let index = 0; index < 124; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:school-progress-v555', {
    detail:{
      lessonId:`lesson-${index}`,
      note:`${privateCanaries[2]}-${index}`,
      answer:`${privateCanaries[3]}-${index}`
    }
  }));
}
check('school:all-124-events-survive', doc.events.filter(event => event.type === 'divina:school-progress-v555').length === 124);
check('school:no-navigation-after-124', navigation.length === 0);
check('school:no-frame-loop', win.frames.length === 0);

doc.dispatchEvent(new FakeCustomEvent('divina:route-ready', {
  detail:{ id:'library', privateQuestion:privateCanaries[3] }
}));
for (let index = 0; index < 78; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:wisdom-public-context-v539', {
    detail:{
      kind:'card',
      id:`${privateCanaries[4]}-${index}`,
      label:`PRIVATE_LABEL_${index}`,
      question:privateCanaries[3]
    }
  }));
}
check('library:all-78-discoveries-counted', runtime.libraryDiscoveries === 78, runtime.libraryDiscoveries);
check('library:discovery-state-only', runtime.libraryDiscovered === true);
check('library:no-navigation-after-78', navigation.length === 0);

snapshot = {
  route:'journal',
  previousRoute:'daily',
  returnRoute:'daily',
  next:{ route:'daily', intention:'return', reason:'writing-to-origin' },
  journalBody:privateCanaries[0],
  history:[privateCanaries[1]],
  schoolNote:privateCanaries[2],
  question:privateCanaries[3],
  selectedCard:privateCanaries[4]
};
doc.dispatchEvent(new FakeCustomEvent('divina:context-memory-updated', {
  detail:{ context:snapshot }
}));
check('context:one-public-update', runtime.contextUpdates === 1);
check('context:route-preserved', runtime.context.route === 'journal');
check('context:return-preserved', runtime.context.previousRoute === 'daily');
check('context:one-next-step', runtime.context.next?.route === 'daily');
check('context:private-fields-omitted', !('journalBody' in runtime.context) && !('history' in runtime.context));

for (let index = 0; index < 40; index += 1) {
  doc.dispatchEvent(new FakeCustomEvent('divina:journal-world-updated', {
    detail:{ body:`${privateCanaries[0]}-${index}`, history:privateCanaries[1] }
  }));
}
check('journal:all-update-events-survive', doc.events.filter(event => event.type === 'divina:journal-world-updated').length === 40);
check('journal:no-auto-review', runtime.journalReviewOpens === 0);
check('journal:no-auto-save', runtime.journalSaved === false);
check('journal:no-navigation-after-updates', navigation.length === 0);

const serialized = JSON.stringify({ status:runtime.status(), audit:runtime.audit() });
for (const canary of privateCanaries) check(`privacy:not-retained:${canary}`, !serialized.includes(canary));
for (const key of [
  'privateContentReads','formValueReads','journalBodyReads','journalDraftReads',
  'journalHistoryReads','schoolNoteReads','questionReads','cardIdentityReads',
  'storageReads','storageWrites','networkCalls','modelCalls','newCanvases',
  'newRenderers','permanentAnimationLoops','deferredTimers','mutationObservers'
]) check(`audit:zero:${key}`, runtime.audit()[key] === 0, runtime.audit()[key]);

check('continuity:no-automatic-navigation', runtime.status().automaticNavigation === false && navigation.length === 0);
check('continuity:no-automatic-whit', runtime.status().automaticWhitSpeech === false);
check('continuity:no-new-guides-with-worlds-absent', runtime.nodesCreated === 0);
check('continuity:one-journey-law', runtime.status().law === 'one-orb-one-universe-one-presence-one-journey');
check('continuity:journal-stays-private', runtime.status().journalPrivateByDefault === true);
check('continuity:maximum-one-step', runtime.status().maximumContextualContinuations === 1);

runtime.destroy();
check('destroy:runtime-stops', runtime.destroyed === true);
check('destroy:identity-removed', doc.documentElement.dataset.livingWisdomPath === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V607',
  work:'WORK13',
  macroStage:'7-of-10 / continuity-and-private-content-isolation',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  schoolEvents:124,
  libraryEvents:78,
  journalEvents:40,
  automaticNavigationCalls:navigation.length,
  privateCanariesRetained:privateCanaries.some(canary => serialized.includes(canary)),
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
