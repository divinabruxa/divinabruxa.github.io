/* DIVINA BRUXA — WORK13 V606 · QA DE ORQUESTRACAO DOS EVENTOS DA WHIT */
import { WhitSilenceTimingV606 } from './whit-silence-timing-v606.js';

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
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const doc = new FakeDocument();
const win = new FakeWindow();
const visibleMessages = [];
const nerveEvents = [];
const signatureDelegations = [];
const silenceEvents = [];
const hidden = [];

doc.addEventListener('divina:whit-timing-silence', event => silenceEvents.push(event.detail));

const presence = {
  show(message) { visibleMessages.push(message); return true; },
  hide(immediate, reason) { hidden.push({ layer:'presence', immediate, reason }); return true; }
};
const supreme = {
  close(immediate, reason) { hidden.push({ layer:'supreme', immediate, reason }); return true; }
};

const signature = {
  offerEventLine(kind) {
    signatureDelegations.push(kind);
    if (['spread-reveal','school-complete','skin-change'].includes(kind)) {
      visibleMessages.push(`signature:${kind}`);
    }
    return true;
  }
};

// Reproduz a ordem real: V311 ja escuta o barramento quando a V606 nasce.
win.addEventListener('whit:nerve', event => {
  nerveEvents.push(event.detail);
  signature.offerEventLine(event.detail?.kind);
});

const nervousSystem = {
  signal(kind, options = {}) {
    win.dispatchEvent(new FakeCustomEvent('whit:nerve', {
      detail:{ kind, route:'spreads', source:options.source || 'local-event' }
    }));
    if (options.visible) presence.show(`nerve:${kind}`);
    return { kind, visible:Boolean(options.visible) };
  }
};

const runtime = new WhitSilenceTimingV606({
  nervousSystem,
  signature,
  presence,
  supreme,
  livingPresence:{ status:() => ({ release:'V594' }) },
  soul:{ status:() => ({ release:'V582', canonicalOrbOnly:true }) },
  governor:{ status:() => ({ release:'V580' }) },
  documentTarget:doc,
  windowTarget:win,
  documentElement:doc.documentElement
});

for (let index = 0; index < 78; index += 1) {
  nervousSystem.signal('spread-reveal', {
    visible:true,
    source:'interaction',
    phrase:`SEGREDO-QUE-NAO-DEVE-SER-EMITIDO-${index}`
  });
}
check('stress:seventy-eight-signals-live', nerveEvents.length === 78, nerveEvents.length);
check('stress:no-visible-message', visibleMessages.length === 0, visibleMessages.join('|'));
check('stress:no-signature-delegation', signatureDelegations.length === 0, signatureDelegations.length);
check('stress:all-silenced-once', silenceEvents.filter(item => item.kind === 'spread-reveal').length === 78, silenceEvents.length);
check('stress:no-private-phrase-in-silence-event', !JSON.stringify(silenceEvents).includes('SEGREDO-QUE-NAO-DEVE-SER-EMITIDO'));
check('stress:state-silent', runtime.status().state === 'silent');
check('stress:visible-requests-suppressed', runtime.status().visibleRequestsSuppressed === 78);
check('stress:signature-lines-suppressed', runtime.status().signatureLinesSuppressed === 78);

for (const kind of ['school-complete','skin-change']) {
  nervousSystem.signal(kind, { visible:true, source:'interaction' });
}
check('structure:no-school-or-skin-message', visibleMessages.length === 0);
check('structure:events-remain-nonverbal', nerveEvents.some(item => item.kind === 'school-complete') && nerveEvents.some(item => item.kind === 'skin-change'));

nervousSystem.signal('whisper', {
  visible:true,
  source:'existing-world-whisper',
  phrase:'SUSSURRO-LEGADO-PRIVADO'
});
check('legacy:no-visible-message', visibleMessages.length === 0);
check('legacy:signal-remains-public-metadata', nerveEvents.at(-1)?.kind === 'whisper' && !JSON.stringify(nerveEvents.at(-1)).includes('SUSSURRO-LEGADO-PRIVADO'));

nervousSystem.signal('spread-whit-invite', {
  visible:true,
  source:'interaction'
});
check('explicit:one-message', visibleMessages.length === 1 && visibleMessages[0] === 'nerve:spread-whit-invite', visibleMessages.join('|'));
check('explicit:event-preserved', nerveEvents.at(-1)?.kind === 'spread-whit-invite');
check('explicit:counted', runtime.status().explicitSignalsPassed === 1);

nervousSystem.signal('future-explicit', {
  visible:true,
  source:'explicit-invitation',
  explicit:true
});
check('explicit:future-contract-preserved', visibleMessages.at(-1) === 'nerve:future-explicit');
check('explicit:future-counted', runtime.status().explicitSignalsPassed === 2);

const beforeClose = hidden.length;
doc.dispatchEvent(new FakeCustomEvent('divina:menu-state', { detail:{ state:'opening' } }));
doc.dispatchEvent(new FakeCustomEvent('divina:route-start', { detail:{ to:'daily' } }));
doc.dispatchEvent(new FakeCustomEvent('divina:work12-state', { detail:{ state:'ARRIVE' } }));
check('silence:three-transitions-two-layers', hidden.length === beforeClose + 6, hidden.length - beforeClose);
check('silence:presence-and-supreme', hidden.slice(-6).filter(item => item.layer === 'presence').length === 3 && hidden.slice(-6).filter(item => item.layer === 'supreme').length === 3);

doc.visibilityState = 'hidden';
doc.dispatchEvent(new Event('visibilitychange'));
win.dispatchEvent(new Event('pagehide'));
check('silence:hidden-and-pagehide', hidden.at(-2)?.reason === 'v606-pagehide' || hidden.at(-1)?.reason === 'v606-pagehide');

doc.dispatchEvent(new FakeCustomEvent('divina:whit-living-offer', { detail:{ route:'library', messageIncluded:false } }));
check('timing:qualified-offer-observed', runtime.status().qualifiedOffersObserved === 1 && runtime.status().state === 'useful-offer');
doc.dispatchEvent(new FakeCustomEvent('divina:magic-bubble-silence', { detail:{ route:'library' } }));
check('timing:offer-disappears', runtime.status().state === 'silent');

const audit = runtime.audit();
check('audit:one-orb-and-canvas', audit.oneCanonicalOrb === true && audit.oneCanonicalCanvas === true);
check('audit:no-v606-body', audit.v606Bodies === 0);
check('audit:no-io', audit.storageReads === 0 && audit.storageWrites === 0 && audit.networkCalls === 0 && audit.modelCalls === 0);
check('audit:no-weight', audit.domNodesCreated === 0 && audit.stylesheetsCreated === 0 && audit.permanentAnimationLoops === 0 && audit.mutationObservers === 0 && audit.deferredTimers === 0);
check('audit:no-private', audit.privateContentReads === 0 && audit.formValueReads === 0 && audit.journalBodyReads === 0 && audit.questionReads === 0 && audit.cardIdentityReads === 0);

runtime.destroy();
const nerveCountBefore = nerveEvents.length;
nervousSystem.signal('spread-reveal', { visible:true, source:'interaction' });
check('destroy:original-behavior-restored', nerveEvents.length === nerveCountBefore + 1 && visibleMessages.at(-1) === 'nerve:spread-reveal');
check('destroy:signature-restored', signatureDelegations.at(-1) === 'spread-reveal');

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V606',
  work:'WORK13',
  macroStage:'6-of-10 / whit-silence-timing-event-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  structuralSignalsExercised:nerveEvents.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
