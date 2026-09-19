/* DIVINA BRUXA — WORK13 V606 · QA DE RUNTIME DA WHIT EM SILENCIO */
import {
  WHIT_SILENCE_TIMING_CONTRACT_V606,
  WhitSilenceTimingV606,
  createWhitSilenceTimingV606
} from './whit-silence-timing-v606.js';

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

class FakeWindow extends EventTarget {}

const checks = [];
const check = (id, condition, detail = '') => checks.push({
  id,
  pass:Boolean(condition),
  detail:condition ? '' : String(detail)
});

const doc = new FakeDocument();
const win = new FakeWindow();
const nerveCalls = [];
const signatureCalls = [];
const presenceCalls = [];
const supremeCalls = [];
const nervousSystem = {
  signal(kind, options = {}) {
    nerveCalls.push({ kind, options:{ ...options } });
    if (options.visible) presenceCalls.push({ type:'show', kind });
    return Object.freeze({ kind, visible:Boolean(options.visible), source:options.source || '' });
  }
};
const signature = {
  offerEventLine(kind, force = false) {
    signatureCalls.push({ kind, force });
    return `signature:${kind}`;
  }
};
const presence = {
  hide(immediate, reason) {
    presenceCalls.push({ type:'hide', immediate, reason });
    return true;
  }
};
const supreme = {
  close(immediate, reason) {
    supremeCalls.push({ immediate, reason });
    return true;
  }
};
const livingPresence = { status:() => ({ release:'V594', contextualOffers:0 }) };
const soul = { status:() => ({ release:'V582', canonicalOrbOnly:true }) };
const governor = { status:() => ({ release:'V580', active:null }) };
const originalSignal = nervousSystem.signal;
const originalOffer = signature.offerEventLine;
const events = [];
for (const type of ['divina:whit-silence-timing-ready','divina:whit-timing-silence']) {
  doc.addEventListener(type, event => events.push({ type, detail:event.detail }));
}

const runtime = new WhitSilenceTimingV606({
  livingPresence,
  soul,
  presence,
  nervousSystem,
  signature,
  supreme,
  governor,
  documentTarget:doc,
  windowTarget:win,
  documentElement:doc.documentElement
});

const contract = WHIT_SILENCE_TIMING_CONTRACT_V606;
check('contract:version', contract.version === 606);
check('contract:base-v605', contract.base.startsWith('V605-cards-converse'));
check('contract:work13-stage-six', contract.work === 'WORK13' && contract.macroStage === '6-of-10');
check('contract:one-law', contract.law === 'one-orb-one-universe-one-presence-one-journey');
check('contract:canonical-residence', contract.residence === 'canonical-orb');
check('contract:silence-default', contract.defaultResponse === 'silence');
check('contract:nonverbal-structure', contract.nonverbalStructuralResponse === true);
check('contract:explicit-visible-policy', contract.visibleSpeechPolicy === 'explicit-invitation-or-consent-only');
check('contract:v594-authority', contract.contextualOfferAuthority === 'V594-qualified-pause-unchanged');
check('contract:two-offers-unchanged', contract.maximumContextualOffersPerSession === 2);
check('contract:no-ordinary-touch', contract.ordinaryTouchSpeech === false);
check('contract:no-arrival-speech', contract.routeArrivalSpeech === false);
check('contract:no-reveal-speech', contract.automaticRevealSpeech === false);
check('contract:no-completion-speech', contract.automaticCompletionSpeech === false);
check('contract:no-skin-speech', contract.automaticSkinSpeech === false);
check('contract:no-legacy-whisper-speech', contract.automaticLegacyWhisperSpeech === false);
check('contract:absolute-silence', contract.travelPolicy === 'absolute-silence' && contract.menuPolicy === 'absolute-silence' && contract.hiddenPagePolicy === 'absolute-silence');
check('contract:explicit-preserved', contract.deliberateInvitationPreserved === true && contract.consentMessagesPreserved === true);
check('contract:context-does-not-call-whit', contract.contextMemoryTriggersWhit === false);
check('contract:no-private', contract.privateContentReads === 0 && contract.formValueReads === 0 && contract.journalBodyReads === 0 && contract.questionReads === 0 && contract.cardIdentityReads === 0);
check('contract:no-io', contract.storageReads === 0 && contract.storageWrites === 0 && contract.networkCalls === 0 && contract.modelCalls === 0);
check('contract:no-new-matter', contract.domNodesCreated === 0 && contract.stylesheetsCreated === 0 && contract.newCanvases === 0 && contract.newRenderers === 0);
check('contract:no-background-work', contract.permanentAnimationLoops === 0 && contract.mutationObservers === 0 && contract.deferredTimers === 0);

check('install:identity', doc.documentElement.dataset.work13WhitTiming === 'v606');
check('install:policy', doc.documentElement.dataset.work13WhitPolicy === 'silence-until-useful');
check('install:state', doc.documentElement.dataset.work13WhitState === 'silent');
check('install:nerve-patched', nervousSystem.signal !== originalSignal);
check('install:signature-patched', signature.offerEventLine !== originalOffer);
check('install:ready-event', events.some(item => item.type === 'divina:whit-silence-timing-ready' && item.detail.version === 606));

const spread = nervousSystem.signal('spread-reveal', { visible:true, source:'interaction', tone:'spreads' });
check('spread:delegated', spread.kind === 'spread-reveal');
check('spread:visible-forced-false', nerveCalls.at(-1).options.visible === false);
check('spread:source-preserved', nerveCalls.at(-1).options.source === 'interaction');
check('spread:no-visible-presence', !presenceCalls.some(item => item.type === 'show' && item.kind === 'spread-reveal'));
check('spread:silent-event', events.some(item => item.type === 'divina:whit-timing-silence' && item.detail.kind === 'spread-reveal'));

for (const kind of ['school-complete','skin-change','library-card-open','daily-save','world-ready']) {
  nervousSystem.signal(kind, { visible:true, source:'interaction' });
  check(`${kind}:visible-false`, nerveCalls.at(-1).options.visible === false);
  check(`${kind}:no-show`, !presenceCalls.some(item => item.type === 'show' && item.kind === kind));
}

nervousSystem.signal('whisper', { visible:true, source:'existing-world-whisper', phrase:'fala antiga' });
check('whisper:visible-false', nerveCalls.at(-1).options.visible === false);
check('whisper:source-preserved', nerveCalls.at(-1).options.source === 'existing-world-whisper');
check('whisper:no-show', !presenceCalls.some(item => item.type === 'show' && item.kind === 'whisper'));

nervousSystem.signal('unknown-automatic-signal', { visible:true });
check('unknown-visible:forced-silent', nerveCalls.at(-1).options.visible === false);

for (const kind of ['library-whit-invite','spread-whit-invite','school-whit-invite','journal-whit-invite','consent-required','consent-changed']) {
  nervousSystem.signal(kind, { visible:true, source:'interaction' });
  check(`${kind}:visible-preserved`, nerveCalls.at(-1).options.visible === true);
  check(`${kind}:show-preserved`, presenceCalls.some(item => item.type === 'show' && item.kind === kind));
}
nervousSystem.signal('future-explicit', { visible:true, explicit:true, source:'explicit-invitation' });
check('future-explicit:visible-preserved', nerveCalls.at(-1).options.visible === true);

for (const kind of ['spread-reveal','school-complete','skin-change']) {
  const before = signatureCalls.length;
  const result = signature.offerEventLine(kind, true);
  check(`signature:${kind}:silent`, result === false);
  check(`signature:${kind}:not-delegated`, signatureCalls.length === before);
}
check('signature:context-receipt-delegated', signature.offerEventLine('context-receipt', true) === 'signature:context-receipt');
check('signature:memory-changed-delegated', signature.offerEventLine('memory-changed', true) === 'signature:memory-changed');

const hideBefore = presenceCalls.filter(item => item.type === 'hide').length;
doc.dispatchEvent(new FakeCustomEvent('divina:route-start', { detail:{ id:'library' } }));
check('travel:hides-presence', presenceCalls.filter(item => item.type === 'hide').length === hideBefore + 1);
check('travel:closes-supreme', supremeCalls.at(-1)?.reason === 'v606-travel');

const closedMenuBefore = presenceCalls.filter(item => item.type === 'hide').length;
doc.dispatchEvent(new FakeCustomEvent('divina:menu-state', { detail:{ state:'closed' } }));
check('menu:closed-no-op', presenceCalls.filter(item => item.type === 'hide').length === closedMenuBefore);
doc.dispatchEvent(new FakeCustomEvent('divina:menu-state', { detail:{ state:'open' } }));
check('menu:open-silence', presenceCalls.at(-1)?.reason === 'v606-menu');

doc.dispatchEvent(new FakeCustomEvent('divina:work12-state', { detail:{ state:'TRAVEL' } }));
check('work12:travel-silence', presenceCalls.at(-1)?.reason === 'v606-work12-travel');

doc.visibilityState = 'hidden';
doc.dispatchEvent(new Event('visibilitychange'));
check('hidden:silence', presenceCalls.at(-1)?.reason === 'v606-hidden');
win.dispatchEvent(new Event('pagehide'));
check('pagehide:silence', presenceCalls.at(-1)?.reason === 'v606-pagehide');

doc.dispatchEvent(new FakeCustomEvent('divina:whit-living-offer', { detail:{ route:'library' } }));
check('offer:qualified-state', runtime.status().state === 'useful-offer');
doc.dispatchEvent(new FakeCustomEvent('divina:magic-bubble-silence', { detail:{ route:'library' } }));
check('offer:returns-silent', runtime.status().state === 'silent');
doc.dispatchEvent(new FakeCustomEvent('divina:experience-message-released', { detail:{ channel:'whit-supreme' } }));
check('message-release:silent', runtime.status().state === 'silent');

const status = runtime.status();
check('status:signals-counted', status.signalsObserved === nerveCalls.length, `${status.signalsObserved}/${nerveCalls.length}`);
check('status:suppressed-counted', status.visibleRequestsSuppressed >= 7, status.visibleRequestsSuppressed);
check('status:signature-counted', status.signatureLinesSuppressed === 3, status.signatureLinesSuppressed);
check('status:explicit-counted', status.explicitSignalsPassed === 7, status.explicitSignalsPassed);
check('status:qualified-offer-counted', status.qualifiedOffersObserved === 1);
check('status:dependencies-observed', status.livingPresence?.release === 'V594' && status.soul?.canonicalOrbOnly === true && status.governor?.release === 'V580');

const audit = runtime.audit();
check('audit:one-orb', audit.canonicalOrbs === 1 && audit.oneCanonicalOrb === true);
check('audit:one-canvas', audit.canonicalCanvases === 1 && audit.oneCanonicalCanvas === true);
check('audit:no-v606-body', audit.v606Bodies === 0 && audit.separateWhitBody === false);
check('audit:patches-live', audit.nervousSilenceInstalled === true && audit.signatureSilenceInstalled === true);
check('audit:explicit-preserved', audit.deliberateInvitationPreserved === true && audit.contextualOfferAuthorityUnchanged === true);
check('audit:no-automatic', audit.automaticRevealSpeech === false && audit.automaticCompletionSpeech === false && audit.automaticSkinSpeech === false);
check('audit:no-private', audit.privateContentReads === 0 && audit.formValueReads === 0 && audit.journalBodyReads === 0 && audit.questionReads === 0 && audit.cardIdentityReads === 0);
check('audit:no-io', audit.storageReads === 0 && audit.storageWrites === 0 && audit.networkCalls === 0 && audit.modelCalls === 0);
check('audit:no-weight', audit.domNodesCreated === 0 && audit.stylesheetsCreated === 0 && audit.newCanvases === 0 && audit.newRenderers === 0 && audit.permanentAnimationLoops === 0 && audit.mutationObservers === 0 && audit.deferredTimers === 0);

check('destroy:first', runtime.destroy() === true);
check('destroy:second-safe', runtime.destroy() === false);
check('destroy:nerve-restored', nervousSystem.signal === originalSignal);
check('destroy:signature-restored', signature.offerEventLine === originalOffer);
check('destroy:identity-removed', !doc.documentElement.dataset.work13WhitTiming && !doc.documentElement.dataset.work13WhitPolicy && !doc.documentElement.dataset.work13WhitState);

const factoryDoc = new FakeDocument();
const factoryNerves = { signal:originalSignal };
const factorySignature = { offerEventLine:originalOffer };
const factoryOptions = {
  nervousSystem:factoryNerves,
  signature:factorySignature,
  documentTarget:factoryDoc,
  windowTarget:new FakeWindow(),
  documentElement:factoryDoc.documentElement
};
const firstFactory = createWhitSilenceTimingV606(factoryOptions);
const secondFactory = createWhitSilenceTimingV606(factoryOptions);
check('factory:singleton', firstFactory === secondFactory);
check('factory:global', globalThis.divinaWhitSilenceTimingV606 === firstFactory);
firstFactory.destroy();
check('factory:global-cleared', globalThis.divinaWhitSilenceTimingV606 === undefined);

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V606',
  work:'WORK13',
  macroStage:'6-of-10 / whit-silence-timing-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
