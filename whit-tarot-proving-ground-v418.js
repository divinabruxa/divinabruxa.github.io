/*
 * DIVINA BRUXA 4.1.8 · PROVAÇÃO DA WHIT
 *
 * Esta camada não escreve a consulta e não cria outra voz. Ela verifica, em
 * silêncio, se a leitura final continua pertencendo às cartas, às posições,
 * à pergunta e à narrativa da mesa antes de receber o selo da Whit Taróloga.
 */

export const PROVING_GROUND_ENGINE_NAME = 'PROVAÇÃO DA WHIT';
export const PROVING_GROUND_ENGINE_VERSION = '4.1.8';

export const PROVING_GROUND_COVENANT = Object.freeze([
  'trocar uma carta precisa mudar a interpretação',
  'trocar uma posição precisa mudar a função da carta',
  'trocar a ordem precisa mudar a narrativa',
  'trocar a pergunta precisa mudar o território sem substituir o Tarot',
  'a leitura final deve permanecer curta, coesa, prática e em uma única voz',
  'amor não autoriza leitura mental e futuro nunca vira sentença inevitável',
  'nenhuma prova acessa áreas pessoais, memórias antigas ou qualquer fonte privada'
]);

const clean = (value, limit = 12000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 1000)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const sentences = value => (clean(value).match(/[^.!?…]+[.!?…]+(?=\s|$)/gu) || []).length;
const words = value => clean(value).split(/\s+/u).filter(Boolean).length;
const cardKey = card => clean(card?.canonicalId || card?.id || card?.name, 120);
const cardName = card => clean(card?.name, 120);
const fingerprint = value => {
  let hash = 2166136261;
  for (const character of clean(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).toUpperCase().padStart(7, '0');
};

const FORBIDDEN_CERTAINTY = /\b(?:certeza absoluta|destino inevit[aá]vel|vai acontecer com certeza|n[aã]o h[aá] como mudar)\b/i;
const FORBIDDEN_MIND_READING = /\b(?:ele pensa em voc[eê]|ela pensa em voc[eê]|essa pessoa te ama|eu sei que (?:ele|ela))\b/i;
const FORBIDDEN_DEPENDENCY = /\b(?:s[oó] Whit pode|sem esta leitura|n[aã]o v[aá] embora|voc[eê] precisa continuar no site)\b/i;
const FORBIDDEN_BACKSTAGE = /\b(?:motor do|algoritmo|processamento interno|prompt|modelo de linguagem)\b/i;

function visibleText(reading) {
  return [
    reading?.heartline,
    reading?.lead || reading?.whisper,
    reading?.story,
    reading?.closing
  ].filter(Boolean).join(' ');
}

function seal(checks, details) {
  const failed = Object.entries(checks).filter(([, value]) => value !== true).map(([key]) => key);
  return Object.freeze({
    engine:PROVING_GROUND_ENGINE_NAME,
    version:PROVING_GROUND_ENGINE_VERSION,
    passed:failed.length === 0,
    failed:Object.freeze(failed),
    checks:Object.freeze(checks),
    details:Object.freeze(details),
    visible:false,
    changesReading:false,
    finalVoice:'Whit'
  });
}

function commonChecks(reading, text) {
  const profile = reading?.humanRealityProfile || {};
  return {
    tarotGoverns:profile.tarotGoverns === true && reading?.tarotGrounded !== false,
    singleVoice:reading?.cohesion?.singleVoice === true,
    practicalCounsel:Boolean(clean(reading?.counselText, 2000)),
    conditionalFuture:profile.futureIsConditional === true,
    noLiteralMindReading:profile.literalMindReading === false && !FORBIDDEN_MIND_READING.test(text),
    noInevitableFuture:!FORBIDDEN_CERTAINTY.test(text),
    noDependency:reading?.divineProfile?.dependencyDesign === false && !FORBIDDEN_DEPENDENCY.test(text),
    noBackstageLanguage:!FORBIDDEN_BACKSTAGE.test(text),
    noPrivateSources:profile.privateSourcesUsed === false,
    concise:sentences(text) >= 3 && sentences(text) <= 12 && words(text) <= 340
  };
}

export function proveCardReading(reading, card, {
  position = '',
  question = ''
} = {}) {
  const text = visibleText(reading);
  const identityKey = cardKey(card);
  const checks = {
    ...commonChecks(reading, text),
    cardIdentityPreserved:Boolean(
      identityKey && normalize(reading?.knowledgeProfile?.card?.card?.name) === normalize(cardName(card))
    ),
    cardPresentInVoice:Boolean(cardName(card) && normalize(text).includes(normalize(cardName(card)))),
    positionChangesMeaning:reading?.positionProfile?.positionChangesMeaning === true,
    questionSetsTerritory:Boolean(reading?.readerProfile?.territory),
    oneCardScope:reading?.supremeCounselProfile?.cardsConsidered === 1
  };
  return seal(checks, {
    scope:'one-card',
    card:identityKey,
    position:clean(position, 120),
    questionFingerprint:fingerprint(normalize(question)),
    readingFingerprint:fingerprint(text),
    sentenceCount:sentences(text),
    wordCount:words(text)
  });
}

export function proveSpreadReading(reading, cards = [], positions = [], {
  question = ''
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  const text = visibleText(reading);
  const dialogue = reading?.dialogueProfile || {};
  const checks = {
    ...commonChecks(reading, text),
    allCardsRead:dialogue.cardsUsed === validCards.length && dialogue.allCardsUsed === true,
    allTransitionsRead:dialogue.edgeCount === Math.max(0, validCards.length - 1) && dialogue.allTransitionsRead === true,
    positionsMapped:reading?.positionProfile?.sequence?.length === validCards.length,
    orderFormsNarrative:Boolean(dialogue.turningPair || validCards.length < 2),
    wholeTableInherited:reading?.humanRealityProfile?.wholeTableInherited === true,
    completeArc:reading?.narrativeConsciousnessProfile?.completeArc === true,
    questionSetsTerritory:Boolean(reading?.readerProfile?.territory),
    counselUsesTable:reading?.supremeCounselProfile?.cardsConsidered === validCards.length
  };
  return seal(checks, {
    scope:'spread',
    cards:Object.freeze(validCards.map(cardKey)),
    positions:Object.freeze(validCards.map((_, index) => clean(positions?.[index], 120))),
    questionFingerprint:fingerprint(normalize(question)),
    readingFingerprint:fingerprint(text),
    sentenceCount:sentences(text),
    wordCount:words(text)
  });
}

export function proveSensitivity({
  original = '',
  cardChanged = '',
  positionChanged = '',
  orderChanged = '',
  questionChanged = ''
} = {}) {
  const fingerprints = Object.freeze({
    original:fingerprint(original),
    cardChanged:fingerprint(cardChanged),
    positionChanged:fingerprint(positionChanged),
    orderChanged:fingerprint(orderChanged),
    questionChanged:fingerprint(questionChanged)
  });
  const checks = {
    cardChangesReading:fingerprints.cardChanged !== fingerprints.original,
    positionChangesReading:fingerprints.positionChanged !== fingerprints.original,
    orderChangesReading:fingerprints.orderChanged !== fingerprints.original,
    questionChangesReading:fingerprints.questionChanged !== fingerprints.original
  };
  return seal(checks, { scope:'sensitivity', fingerprints });
}

export function provingGroundCapacity() {
  return Object.freeze({
    cards:78,
    cardSensitivity:true,
    positionSensitivity:true,
    orderSensitivity:true,
    questionSensitivity:true,
    conciseVoice:true,
    wholeTableAudit:true,
    conditionalFuture:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    visible:false,
    rule:'a precisão produz a magia; Whit só recebe o selo quando a leitura pertence àquela mesa'
  });
}
