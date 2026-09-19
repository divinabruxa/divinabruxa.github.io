/* DIVINA BRUXA — WORK13 V605 · QA DE RUNTIME DAS TIRAGENS EM CAMADAS */
import { CARDS } from './tarot-data.js';
import { SPREADS, positionsForSpread } from './spreads-policy.js?v=554';
import './tarot-meanings.js';
import {
  COSMIC_SPREAD_READING_CONTRACT_V605,
  CosmicSpreadReadingV605,
  buildSpreadConversationV605,
  firstSentenceV605
} from './cosmic-spread-reading-v605.js';

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
    this.defaultView = { CustomEvent:FakeCustomEvent };
    this.visibilityState = 'visible';
  }
  querySelectorAll(selector) {
    if (selector === '#orb' || selector === '#orbCanvas') return [{}];
    return [];
  }
}

class FakeWindow extends EventTarget {
  matchMedia() { return { matches:false }; }
}

class FakeEngine {
  constructor() {
    this.session = null;
    this.result = { querySelector:() => null };
    this.renderCalls = 0;
    this.revealCalls = 0;
  }
  renderReading() { this.renderCalls += 1; return 'rendered'; }
  revealNext() { this.revealCalls += 1; return 'revealed'; }
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});
const sentenceCount = value => (String(value).match(/[.!?](?=\s|$)/gu) || []).length;

check('contract:version', COSMIC_SPREAD_READING_CONTRACT_V605.version === 605);
check('contract:base-v604', COSMIC_SPREAD_READING_CONTRACT_V605.base.startsWith('V604-layered-daily-reading'));
check('contract:route-spreads', COSMIC_SPREAD_READING_CONTRACT_V605.route === 'spreads');
check('contract:sequence', COSMIC_SPREAD_READING_CONTRACT_V605.sequence.join('|') === 'revealed-card|silence|one-sentence-essence|cards-in-conversation|one-sentence-synthesis|depth-on-explicit-request');
check('contract:methods', COSMIC_SPREAD_READING_CONTRACT_V605.methodsPreserved === 15);
check('contract:free-premium', COSMIC_SPREAD_READING_CONTRACT_V605.freeMethodsPreserved === 4 && COSMIC_SPREAD_READING_CONTRACT_V605.premiumMethodsPreserved === 11);
check('contract:celtic-royal', COSMIC_SPREAD_READING_CONTRACT_V605.celticCrossPositionsPreserved === 10 && COSMIC_SPREAD_READING_CONTRACT_V605.royalTableCardsPreserved === 78);
check('contract:normal-no-repeat', COSMIC_SPREAD_READING_CONTRACT_V605.normalOnly === true && COSMIC_SPREAD_READING_CONTRACT_V605.noRepeats === true);
check('contract:no-selection-change', COSMIC_SPREAD_READING_CONTRACT_V605.changesCardSelection === false && COSMIC_SPREAD_READING_CONTRACT_V605.changesShuffle === false);
check('contract:no-authority-change', COSMIC_SPREAD_READING_CONTRACT_V605.changesPremiumAuthority === false && COSMIC_SPREAD_READING_CONTRACT_V605.changesPersistence === false);
check('contract:tarot-free-protected', COSMIC_SPREAD_READING_CONTRACT_V605.tarotFreeAutomaticMeanings === false && COSMIC_SPREAD_READING_CONTRACT_V605.tarotFreeChanged === false);
check('contract:three-voices', COSMIC_SPREAD_READING_CONTRACT_V605.maximumConversationVoices === 3);
check('contract:one-synthesis', COSMIC_SPREAD_READING_CONTRACT_V605.maximumVisibleSynthesisSentences === 1);
check('contract:depth-explicit', COSMIC_SPREAD_READING_CONTRACT_V605.depthRequiresExplicitGesture === true);
check('contract:no-whit', COSMIC_SPREAD_READING_CONTRACT_V605.automaticWhitSpeech === false);
check('contract:no-private', COSMIC_SPREAD_READING_CONTRACT_V605.privateContentReads === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.questionReads === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.intentionReads === 0);
check('contract:no-unrevealed', COSMIC_SPREAD_READING_CONTRACT_V605.unrevealedCardReads === 0);
check('contract:no-io', COSMIC_SPREAD_READING_CONTRACT_V605.storageReads === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.storageWrites === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.networkCalls === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.modelCalls === 0);
check('contract:one-timer-no-loop', COSMIC_SPREAD_READING_CONTRACT_V605.maximumDeferredTimers === 1 && COSMIC_SPREAD_READING_CONTRACT_V605.permanentAnimationLoops === 0);
check('contract:no-new-matter', COSMIC_SPREAD_READING_CONTRACT_V605.newCanvases === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.newRenderers === 0 && COSMIC_SPREAD_READING_CONTRACT_V605.mutationObservers === 0);

const editorial = Object.values(globalThis.DivinaBruxaTarotMeanings?.cards || {});
check('editorial:seventy-eight', editorial.length === 78, editorial.length);
for (const [index, meaning] of editorial.entries()) {
  const sentence = firstSentenceV605(meaning.essence);
  check(`editorial:${index}:essence`, Boolean(sentence));
  check(`editorial:${index}:one-sentence`, sentenceCount(sentence) <= 1, sentence);
  check(`editorial:${index}:bounded`, sentence.length <= 260, sentence.length);
  check(`editorial:${index}:approved-prefix`, String(meaning.essence).startsWith(sentence), sentence);
}
check('helper:first-only', firstSentenceV605('Primeira frase. SEGREDO NA SEGUNDA.') === 'Primeira frase.');
check('helper:space', firstSentenceV605('  Uma   frase viva.  Outra. ') === 'Uma frase viva.');
check('helper:null', firstSentenceV605(null) === '');

check('policy:fifteen-methods', SPREADS.length === 15, SPREADS.length);
check('policy:four-free', SPREADS.filter(item => !item.premium).length === 4);
check('policy:eleven-premium', SPREADS.filter(item => item.premium).length === 11);

const privateSentinel = 'SEGREDO-DA-PERGUNTA-PRIVADA';
for (const [spreadIndex, spread] of SPREADS.entries()) {
  const positions = positionsForSpread(spread, spread.custom ? 12 : undefined);
  const cards = spread.id === 'royal-table'
    ? CARDS
    : positions.map((_, index) => CARDS[(spreadIndex * 9 + index) % CARDS.length]);
  const items = positions.map((position, index) => ({ card:cards[index], position }));
  const before = JSON.stringify(items.map(item => ({ id:item.card.id, position:item.position })));
  const output = buildSpreadConversationV605(items, { spreadId:spread.id, question:privateSentinel });
  const serialized = JSON.stringify(output);
  check(`spread:${spread.id}:valid`, output.valid === true);
  check(`spread:${spread.id}:voices`, output.voices.length >= 1 && output.voices.length <= 3, output.voices.length);
  check(`spread:${spread.id}:first-card`, output.conversation.includes(cards[0].name), output.conversation);
  check(`spread:${spread.id}:last-card`, output.conversation.includes(cards.at(-1).name), output.conversation);
  check(`spread:${spread.id}:one-synthesis-sentence`, sentenceCount(output.synthesis) <= 1, output.synthesis);
  check(`spread:${spread.id}:synthesis-bounded`, output.synthesis.length <= 420, output.synthesis.length);
  check(`spread:${spread.id}:observe`, Boolean(output.observe));
  check(`spread:${spread.id}:reflection`, output.reflection.endsWith('?'));
  check(`spread:${spread.id}:path`, Boolean(output.path));
  check(`spread:${spread.id}:responsible`, Boolean(output.responsible));
  check(`spread:${spread.id}:no-private`, !serialized.includes(privateSentinel));
  check(`spread:${spread.id}:normal-output`, !/invertid/i.test(serialized));
  check(`spread:${spread.id}:input-untouched`, JSON.stringify(items.map(item => ({ id:item.card.id, position:item.position }))) === before);
}

const royal = SPREADS.find(item => item.id === 'royal-table');
const royalItems = positionsForSpread(royal).map((position, index) => ({ card:CARDS[index], position }));
const royalOutput = buildSpreadConversationV605(royalItems, { spreadId:'royal-table' });
check('royal:seventy-eight-inputs', royalItems.length === 78);
check('royal:three-voices-only', royalOutput.voices.length === 3, royalOutput.voices.length);
check('royal:first-and-last', royalOutput.conversation.includes(CARDS[0].name) && royalOutput.conversation.includes(CARDS[77].name));
check('royal:no-wall', royalOutput.conversation.length <= 420 && royalOutput.synthesis.length <= 420);

const one = buildSpreadConversationV605([{ card:CARDS[0], position:'Mensagem central' }], { spreadId:'direct-question' });
check('one-card:one-voice', one.voices.length === 1);
check('one-card:one-synthesis', sentenceCount(one.synthesis) <= 1);
check('one-card:position', one.conversation.includes('Mensagem central'));

const reversed = buildSpreadConversationV605([{ card:{ ...CARDS[0], orientation:'reversed' }, position:'Centro' }]);
check('orientation:reversed-rejected', reversed.valid === false && reversed.voices.length === 0);
const empty = buildSpreadConversationV605(null);
check('empty:safe', empty.valid === false && empty.synthesis === '');

const fakeDocument = new FakeDocument();
const fakeWindow = new FakeWindow();
const engine = new FakeEngine();
const originalRender = FakeEngine.prototype.renderReading;
const originalReveal = FakeEngine.prototype.revealNext;
const runtimeEvents = [];
fakeDocument.addEventListener('divina:cosmic-spread-reading-ready', event => runtimeEvents.push(event.detail));
const runtime = new CosmicSpreadReadingV605({
  documentTarget:fakeDocument,
  windowTarget:fakeWindow,
  engineProvider:() => engine,
  setTimer:() => 1,
  clearTimer:() => {}
});
check('runtime:identity', fakeDocument.documentElement.dataset.cosmicSpreadReading === 'v605');
check('runtime:macro-five', fakeDocument.documentElement.dataset.work13Macro === '5-cards-converse');
check('runtime:privacy', fakeDocument.documentElement.dataset.cosmicSpreadPrivacy === 'revealed-editorial-only');
check('runtime:attached', runtime.status().attached === true && runtime.status().patched === true);
check('runtime:prototype-patched', FakeEngine.prototype.renderReading !== originalRender && FakeEngine.prototype.revealNext !== originalReveal);
check('runtime:ready-event', runtimeEvents.length === 1 && runtimeEvents[0].version === 605);
check('runtime:render-delegates', engine.renderReading() === 'rendered' && engine.renderCalls === 1);
check('runtime:reveal-delegates', engine.revealNext() === 'revealed' && engine.revealCalls === 1);
const audit = runtime.audit();
check('audit:one-orb-canvas', audit.canonicalOrbs === 1 && audit.canonicalCanvases === 1);
check('audit:tarot-protected', audit.tarotFreeAutomaticMeanings === false && audit.tarotFreeChanged === false);
check('audit:no-private', audit.privateContentReads === 0 && audit.questionReads === 0 && audit.intentionReads === 0 && audit.unrevealedCardReads === 0);
check('audit:no-io', audit.storageReads === 0 && audit.storageWrites === 0 && audit.networkCalls === 0 && audit.modelCalls === 0);
check('audit:no-matter-loop', audit.newCanvases === 0 && audit.newRenderers === 0 && audit.permanentAnimationLoops === 0 && audit.mutationObservers === 0);
runtime.destroy();
check('destroy:marked', runtime.status().destroyed === true);
check('destroy:prototype-restored', FakeEngine.prototype.renderReading === originalRender && FakeEngine.prototype.revealNext === originalReveal);
check('destroy:identity-removed', !fakeDocument.documentElement.dataset.cosmicSpreadReading);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V605',
  work:'WORK13',
  macroStage:'5-of-10 / cards-converse-spread-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  editorialCards:editorial.length,
  spreadMethods:SPREADS.length,
  royalTableCards:royalItems.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
