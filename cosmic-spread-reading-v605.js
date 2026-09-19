/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 5 · V605
   As tiragens passam a respirar em camadas: carta, silencio, essencia,
   conversa entre posicoes e uma sintese curta. A profundidade so aparece
   depois de um gesto explicito.

   Esta camada nao sorteia cartas, nao altera metodos, Premium, persistencia
   ou Diario e nao le a pergunta privada. Ela usa somente cartas ja reveladas
   e o conteudo editorial local aprovado. Tarot Livre permanece sem
   significados automaticos. */

import { CARDS } from './tarot-data.js';

const VERSION = 605;
const INSTANCE = Symbol.for('divina.work13.cosmic.spread.reading.v605');
const PATCH = Symbol.for('divina.work13.cosmic.spread.reading.patch.v605');

const FIELD = Object.freeze({
  Maiores:'mudança de direção e consciência',
  Copas:'sentimento, vínculo e reciprocidade',
  Paus:'desejo, coragem e movimento',
  Espadas:'pensamento, conversa e escolha',
  Ouros:'corpo, rotina e recursos'
});

const TONE_BY_SPREAD = Object.freeze({
  'love-relationships':'love',
  'work-career':'career',
  'money-resources':'money',
  'spiritual-path':'spirituality'
});

const RESPONSIBLE = Object.freeze({
  love:'A leitura ajuda a observar suas necessidades e a dinâmica do vínculo; não comprova sentimentos, fidelidade ou intenções de outra pessoa.',
  career:'A leitura organiza símbolos e escolhas; não garante contratação, promoção, resultado profissional ou decisão de terceiros.',
  money:'A leitura é simbólica e não substitui números, contratos, avaliação de risco ou orientação financeira profissional.',
  spirituality:'O símbolo pode apoiar autoconhecimento e prática pessoal; não comprova mensagens externas, entidades ou acontecimentos sobrenaturais.',
  general:'Esta leitura organiza símbolos e relações para apoiar reflexão e escolha; não determina destino, não revela fatos ocultos e não substitui orientação profissional.'
});

const REFLECTION = Object.freeze({
  love:'Que necessidade, limite ou gesto de reciprocidade pode ser reconhecido sem presumir o que a outra pessoa sente?',
  career:'Que escolha, conversa ou entrega depende de você e pode ser observada na realidade?',
  money:'Qual número, prazo, gasto ou recurso concreto merece ser revisto antes de uma decisão maior?',
  spirituality:'Que percepção pode virar uma prática simples sem precisar provar o invisível?',
  general:'O que já pode ser reconhecido em atitudes, conversas ou escolhas concretas, sem exigir que o símbolo prove o futuro?'
});

const SUPPORT_PATTERN = /favorece|recurso|forca|talento|dom|apoio|possibilidade|consciente/i;
const TENSION_PATTERN = /desafio|limite|sombra|padrao|medos|bloqueio|tensao|obstaculo/i;

export const COSMIC_SPREAD_READING_CONTRACT_V605 = Object.freeze({
  version:VERSION,
  base:'V604-layered-daily-reading-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'5-of-10',
  title:'Cartas que Conversam — Tiragens em Camadas',
  law:'one-orb-one-universe-one-presence-one-journey',
  route:'spreads',
  sequence:Object.freeze(['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request']),
  methodsPreserved:15,
  freeMethodsPreserved:4,
  premiumMethodsPreserved:11,
  celticCrossPositionsPreserved:10,
  royalTableCardsPreserved:78,
  normalOnly:true,
  noRepeats:true,
  changesCardSelection:false,
  changesShuffle:false,
  changesPremiumAuthority:false,
  changesPersistence:false,
  tarotFreeAutomaticMeanings:false,
  tarotFreeChanged:false,
  essenceSource:'approved-local-editorial-first-sentence',
  maximumVisibleEssenceSentences:1,
  maximumConversationVoices:3,
  maximumVisibleSynthesisSentences:1,
  depthRequiresExplicitGesture:true,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitRole:'no-new-intervention-in-v605',
  privateContentReads:0,
  intentionReads:0,
  questionReads:0,
  journalBodyReads:0,
  unrevealedCardReads:0,
  revealedCardUse:'ephemeral-local-only',
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  maximumDeferredTimers:1,
  mutationObservers:0,
  documentClickListeners:1,
  iphoneFirst:true,
  reducedMotionPreservesOrder:true
});

const clean = (value, limit = 640) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const normalizeText = value => clean(value, 180)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const lowerFirst = value => {
  const text = clean(value, 160);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};

const positionLabel = value => clean(typeof value === 'string' ? value : value?.label || value?.short || 'Posição', 96);

export const firstSentenceV605 = value => {
  const editorial = clean(value);
  if (!editorial) return '';
  return clean(editorial.match(/^.*?[.!?](?=\s|$)/u)?.[0] || editorial, 260);
};

const safeMeaning = card => {
  const source = globalThis.DivinaBruxaTarotMeanings;
  const canonical = clean(card?.canonicalId, 96);
  const ids = [canonical, canonical.replace(/^\d{2}-/, '')].filter(Boolean);
  const meaning = ids.map(id => source?.get?.(id) || source?.cards?.[id]).find(Boolean);
  if (meaning?.orientation === 'normal') return meaning;
  const name = clean(card?.name, 96) || 'Esta carta';
  return Object.freeze({
    keywords:Object.freeze([clean(card?.element || card?.suit || 'presença', 72)]),
    essence:`${name} convida a observar o momento antes de escolher o próximo passo.`,
    light:'Reconheça os recursos disponíveis com clareza, medida e responsabilidade.',
    reflectionQuestion:'O que esta imagem ajuda você a reconhecer de forma concreta agora?',
    advice:'Escolha uma ação pequena, segura e observável para o presente.',
    action:'Escolha uma ação pequena, segura e observável para o presente.',
    responsibleNotice:'Leitura simbólica; não substitui fatos, cuidado ou orientação profissional.',
    orientation:'normal'
  });
};

const keywordFor = (meaning, card) => clean(meaning?.keywords?.[0] || card?.element || card?.suit || 'presenca', 72).toLocaleLowerCase('pt-BR');

const mostFrequent = (map, fallback = 'Maiores') => [...map.entries()]
  .sort((left, right) => right[1] - left[1] || String(left[0]).localeCompare(String(right[0]), 'pt-BR'))[0]?.[0] || fallback;

const uniqueVoices = items => {
  if (items.length <= 2) return items;
  const middle = items.find((item, index) => index > 0 && index < items.length - 1 && (
    TENSION_PATTERN.test(normalizeText(item.position)) || SUPPORT_PATTERN.test(normalizeText(item.position))
  )) || items[Math.floor((items.length - 1) / 2)];
  return [items[0], middle, items.at(-1)].filter((item, index, list) => list.indexOf(item) === index);
};

const joinVoices = voices => {
  if (voices.length === 1) {
    const item = voices[0];
    return `${item.card.name} ocupa “${item.position}” e concentra o desenho nessa relação.`;
  }
  if (voices.length === 2) {
    return `${voices[0].card.name} abre em “${voices[0].position}”; ${voices[1].card.name} responde em “${voices[1].position}”.`;
  }
  return `${voices[0].card.name} abre em “${voices[0].position}”; ${voices[1].card.name} muda o tom em “${voices[1].position}”; ${voices[2].card.name} responde em “${voices[2].position}”.`;
};

export function buildSpreadConversationV605(items, { spreadId = '' } = {}) {
  const valid = (Array.isArray(items) ? items : []).map(item => {
    if (!item?.card || item.card.orientation !== 'normal') return null;
    const position = positionLabel(item.position);
    if (!position) return null;
    const meaning = safeMeaning(item.card);
    return Object.freeze({ card:item.card, position, meaning, keyword:keywordFor(meaning, item.card) });
  }).filter(Boolean);

  if (!valid.length) return Object.freeze({
    valid:false,
    voices:Object.freeze([]),
    conversation:'',
    synthesis:'',
    observe:'',
    reflection:'',
    path:'',
    responsible:RESPONSIBLE.general,
    dominantSuit:'Maiores',
    dominantElement:'indefinido',
    majorCount:0,
    courtCount:0
  });

  const suits = new Map();
  const elements = new Map();
  let majors = 0;
  let courts = 0;
  valid.forEach(({ card }) => {
    const suit = card.suit || 'Maiores';
    suits.set(suit, (suits.get(suit) || 0) + 1);
    if (card.element) elements.set(card.element, (elements.get(card.element) || 0) + 1);
    if (card.arcanaCode === 'major' || suit === 'Maiores') majors += 1;
    if (card.court) courts += 1;
  });

  const first = valid[0];
  const last = valid.at(-1);
  const voices = uniqueVoices(valid);
  const dominantSuit = mostFrequent(suits);
  const dominantElement = mostFrequent(elements, 'indefinido');
  const firstField = FIELD[first.card.suit] || FIELD.Maiores;
  const lastField = FIELD[last.card.suit] || FIELD.Maiores;
  const keywordArc = voices.length > 2
    ? `De ${voices[0].keyword}, passando por ${voices[1].keyword}, até ${voices.at(-1).keyword}`
    : `Entre ${first.keyword} e ${last.keyword}`;
  const synthesis = valid.length === 1
    ? `O centro é ${first.keyword}: observe onde essa qualidade já aparece e escolha um gesto pequeno, possível e consciente.`
    : firstField === lastField
      ? `${keywordArc}, ${firstField} forma o fio da leitura; observe o que se repete e transforme a percepção em um gesto pequeno, possível e seu.`
      : `${keywordArc}, a leitura aproxima ${firstField} de ${lastField}; observe o que se repete e transforme a percepção em um gesto pequeno, possível e seu.`;

  const support = valid.find(item => SUPPORT_PATTERN.test(normalizeText(item.position)));
  const tension = valid.find(item => TENSION_PATTERN.test(normalizeText(item.position)));
  const observe = support && tension && support !== tension
    ? `${support.card.name}, em “${support.position}”, oferece apoio; ${tension.card.name}, em “${tension.position}”, mostra o limite. Leia uma pela outra, sem apagar a tensão.`
    : valid.length > 1
      ? `Observe como ${first.card.name}, em “${first.position}”, ganha outra função quando encontra ${last.card.name}, em “${last.position}”; contraste é relação, não sentença.`
      : `Observe ${first.card.name} dentro de “${first.position}”: a posição delimita a pergunta simbólica e evita transformar a carta em resposta absoluta.`;

  const tone = TONE_BY_SPREAD[spreadId] || 'general';
  const path = firstSentenceV605(last.meaning?.action || last.meaning?.advice)
    || 'Escolha uma ação pequena, observável e possível que dependa de você, não da previsão de um resultado.';

  return Object.freeze({
    valid:true,
    voices:Object.freeze(voices.map(item => Object.freeze({ cardName:item.card.name, position:item.position }))),
    conversation:clean(joinVoices(voices), 420),
    synthesis:clean(synthesis, 420),
    observe:clean(observe, 460),
    reflection:REFLECTION[tone],
    path:clean(path, 320),
    responsible:RESPONSIBLE[tone],
    dominantSuit,
    dominantElement,
    majorCount:majors,
    courtCount:courts
  });
}

const dispatch = (target, type, detail) => {
  const EventCtor = target?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!target?.dispatchEvent || typeof EventCtor !== 'function') return false;
  target.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

const element = (doc, tag, className = '', text = '') => {
  const node = doc?.createElement?.(tag);
  if (!node) return null;
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const section = (doc, title, text) => {
  const root = element(doc, 'section', 'db605-depth-section');
  const heading = element(doc, 'h4', '', title);
  const copy = element(doc, 'p', '', text);
  root?.append?.(heading, copy);
  return root;
};

export class CosmicSpreadReadingV605 {
  constructor({
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    engineProvider = () => globalThis.divinaSpreadsWorldV305,
    setTimer = globalThis.setTimeout?.bind(globalThis),
    clearTimer = globalThis.clearTimeout?.bind(globalThis)
  } = {}) {
    this.version = VERSION;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.engineProvider = typeof engineProvider === 'function' ? engineProvider : () => null;
    this.setTimer = typeof setTimer === 'function' ? setTimer : null;
    this.clearTimer = typeof clearTimer === 'function' ? clearTimer : null;
    this.root = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.engine = null;
    this.prototype = null;
    this.timer = 0;
    this.engineState = new WeakMap();
    this.renders = 0;
    this.silences = 0;
    this.essenceReveals = 0;
    this.cardDepthCalls = 0;
    this.synthesisDepthCalls = 0;
    this.editorialReads = 0;
    this.revealedCardReads = 0;
    this.synthesisBuilds = 0;
    this.eventsEmitted = 0;
    this.destroyed = false;

    this.installIdentity();
    this.bind();
    this.attach('boot');
    dispatch(this.documentTarget, 'divina:cosmic-spread-reading-ready', this.status());
  }

  installIdentity() {
    if (!this.root?.dataset) return false;
    this.root.dataset.work13 = 'cosmos-vivo';
    this.root.dataset.work13Macro = '5-cards-converse';
    this.root.dataset.cosmicSpreadReading = 'v605';
    this.root.dataset.cosmicSpreadPrivacy = 'revealed-editorial-only';
    this.root.dataset.cosmicSpreadWhit = 'no-new-intervention';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'divina:page-ready', event => {
      if (clean(event.detail?.id, 24) === 'spreads') this.attach('page-ready');
    });
    this.listen(doc, 'divina:spreads-supreme-ready', () => this.attach('spreads-supreme-ready'));
    this.listen(doc, 'click', event => this.onClick(event));
    ['divina:route-start','divina:supreme-orb-will-navigate'].forEach(type => {
      this.listen(doc, type, () => this.finishSilence('travel-safety'));
    });
    this.listen(doc, 'divina:menu-state', event => {
      if (String(event.detail?.state || '').toLowerCase() !== 'closed') this.finishSilence('menu-safety');
    });
    this.listen(doc, 'visibilitychange', () => {
      if (doc?.visibilityState === 'hidden') this.finishSilence('visibility-safety');
    });
    this.listen(win, 'pageshow', () => this.attach('pageshow'));
  }

  stateFor(engine) {
    let state = this.engineState.get(engine);
    if (!state) {
      state = { pendingReveal:null };
      this.engineState.set(engine, state);
    }
    return state;
  }

  attach(reason = 'attach') {
    if (this.destroyed) return false;
    let engine = null;
    try { engine = this.engineProvider(); } catch { engine = null; }
    if (!engine?.constructor?.prototype) return false;
    this.engine = engine;
    this.patchPrototype(engine.constructor.prototype);
    this.afterRender(engine, { reason, resumed:true });
    return true;
  }

  patchPrototype(prototype) {
    if (!prototype || prototype[PATCH]) {
      this.prototype = prototype || this.prototype;
      return Boolean(prototype);
    }
    const controller = this;
    const originalRender = prototype.renderReading;
    const originalReveal = prototype.revealNext;
    if (typeof originalRender !== 'function' || typeof originalReveal !== 'function') return false;

    function renderReadingV605(...args) {
      const result = originalRender.apply(this, args);
      controller.afterRender(this, { reason:'engine-render', resumed:Boolean(args[0]) });
      return result;
    }

    function revealNextV605(...args) {
      const state = controller.stateFor(this);
      state.pendingReveal = Number.isInteger(this.session?.revealed) ? this.session.revealed : null;
      try { return originalReveal.apply(this, args); }
      finally { state.pendingReveal = null; }
    }

    prototype.renderReading = renderReadingV605;
    prototype.revealNext = revealNextV605;
    Object.defineProperty(prototype, PATCH, {
      value:Object.freeze({ controller, originalRender, originalReveal, renderReadingV605, revealNextV605 }),
      configurable:true,
      enumerable:false
    });
    this.prototype = prototype;
    return true;
  }

  clearSilenceTimer() {
    if (!this.timer) return false;
    this.clearTimer?.(this.timer);
    this.timer = 0;
    return true;
  }

  delay() {
    if (this.windowTarget?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true) return 140;
    if (this.root?.dataset?.performanceTier === 'constrained' || globalThis.navigator?.connection?.saveData === true) return 280;
    return 520;
  }

  itemsFor(engine) {
    const session = engine?.session;
    if (!session || !Array.isArray(session.cardIds) || !Array.isArray(session.positions)) return [];
    const revealed = Math.max(0, Math.min(session.cardIds.length, Number(session.revealed) || 0));
    return session.cardIds.slice(0, revealed).map((id, index) => ({
      card:CARDS[id] || null,
      position:session.positions[index]
    })).filter(item => item.card);
  }

  decorateCard(engine, reading) {
    const article = reading?.querySelector?.('.spread-active-meaning');
    const copy = article?.querySelector?.('.spread-meaning-copy');
    if (!article || !copy || !engine?.session?.revealed) return null;
    const activeIndex = Math.max(0, Math.min(engine.session.revealed - 1, Number(engine.session.activeIndex) || 0));
    const card = CARDS[engine.session.cardIds?.[activeIndex]];
    const position = engine.session.positions?.[activeIndex];
    if (!card || card.orientation !== 'normal') return null;
    const meaning = safeMeaning(card);
    this.editorialReads += 1;
    this.revealedCardReads += 1;

    const eyebrow = copy.querySelector?.('.eyebrow');
    const title = copy.querySelector?.('h3');
    const libraryLink = copy.querySelector?.('.spread-library-link');
    const essence = element(this.documentTarget, 'p', 'db605-card-essence', firstSentenceV605(meaning.essence));
    essence.id = 'db605CardEssence';
    essence.dataset.db605CardEssence = '';
    essence.setAttribute('role', 'status');
    essence.setAttribute('aria-live', 'polite');
    essence.setAttribute('aria-atomic', 'true');

    const control = element(this.documentTarget, 'button', 'db605-depth-call', 'Aprofundar esta carta');
    control.type = 'button';
    control.dataset.db605CardDepthCall = '';
    control.setAttribute('aria-expanded', 'false');
    control.setAttribute('aria-controls', 'db605CardDepth');

    const depth = element(this.documentTarget, 'div', 'db605-card-depth');
    depth.id = 'db605CardDepth';
    depth.dataset.db605CardDepth = '';
    depth.hidden = true;
    depth.setAttribute('aria-hidden', 'true');
    const keywords = (meaning.keywords || []).slice(0, 3).map(clean).filter(Boolean).join(' · ');
    if (keywords) depth.append(element(this.documentTarget, 'p', 'db605-keywords', keywords));
    depth.append(
      section(this.documentTarget, 'O que observar', firstSentenceV605(meaning.light || meaning.tension)),
      section(this.documentTarget, 'Uma reflexão', clean(meaning.reflectionQuestion, 320)),
      section(this.documentTarget, 'Caminho possível', firstSentenceV605(meaning.action || meaning.advice))
    );
    const notice = element(this.documentTarget, 'small', 'db605-responsible', clean(meaning.responsibleNotice, 420));
    if (notice.textContent) depth.append(notice);
    if (libraryLink) {
      libraryLink.textContent = 'Abrir as camadas completas na Biblioteca →';
      depth.append(libraryLink);
    }

    copy.replaceChildren(...[eyebrow, title, essence, control, depth].filter(Boolean));
    article.dataset.cosmicCardReading = 'v605';
    article.dataset.cosmicCardLayer = 'essence';
    article.dataset.cosmicCardPosition = String(activeIndex + 1);
    article.setAttribute('aria-label', `${positionLabel(position)} · ${card.name} · carta direta`);
    return article;
  }

  decorateSynthesis(engine, reading, items) {
    if (!engine?.isComplete?.() || !items.length) return null;
    const article = reading?.querySelector?.('.spread-synthesis-v331,.spread-synthesis');
    if (!article) return null;
    const synthesis = buildSpreadConversationV605(items, { spreadId:engine.session?.spreadId || '' });
    if (!synthesis.valid) return null;
    this.editorialReads += items.length;
    this.revealedCardReads += items.length;
    this.synthesisBuilds += 1;

    const kicker = element(this.documentTarget, 'span', 'db605-synthesis-kicker', 'AS CARTAS CONVERSAM · LEITURA LOCAL');
    const title = element(this.documentTarget, 'h3', 'db605-synthesis-title', items.length === 1 ? 'A carta encontra uma frase.' : 'O desenho encontra uma frase.');
    const conversation = element(this.documentTarget, 'p', 'db605-conversation', synthesis.conversation);
    const phrase = element(this.documentTarget, 'blockquote', 'db605-synthesis-phrase', synthesis.synthesis);
    phrase.setAttribute('aria-label', 'Síntese da tiragem');

    const control = element(this.documentTarget, 'button', 'db605-depth-call db605-synthesis-call', 'Aprofundar a tiragem');
    control.type = 'button';
    control.dataset.db605SynthesisDepthCall = '';
    control.setAttribute('aria-expanded', 'false');
    control.setAttribute('aria-controls', 'db605SynthesisDepth');

    const depth = element(this.documentTarget, 'div', 'db605-synthesis-depth');
    depth.id = 'db605SynthesisDepth';
    depth.dataset.db605SynthesisDepth = '';
    depth.hidden = true;
    depth.setAttribute('aria-hidden', 'true');
    depth.append(
      section(this.documentTarget, 'O que observar', synthesis.observe),
      section(this.documentTarget, 'Uma reflexão', synthesis.reflection),
      section(this.documentTarget, 'Caminho possível', synthesis.path)
    );
    const patterns = element(this.documentTarget, 'p', 'db605-patterns', `${synthesis.majorCount} Maiores · ${synthesis.courtCount} Corte · ${synthesis.dominantSuit} · ${synthesis.dominantElement}`);
    const notice = element(this.documentTarget, 'aside', 'db605-synthesis-notice');
    notice.append(
      element(this.documentTarget, 'b', '', 'LEITURA RESPONSÁVEL'),
      element(this.documentTarget, 'p', '', synthesis.responsible)
    );
    depth.append(patterns, notice);

    article.replaceChildren(kicker, title, conversation, phrase, control, depth);
    article.classList.add('db605-spread-synthesis');
    article.dataset.cosmicSpreadSynthesis = 'v605';
    article.dataset.cosmicSpreadLayer = 'synthesis';
    article.setAttribute('aria-live', 'polite');
    article.setAttribute('aria-atomic', 'true');
    return article;
  }

  setVisible(reading, visible) {
    if (!reading) return false;
    const essence = reading.querySelector?.('[data-db605-card-essence]');
    const cardControl = reading.querySelector?.('[data-db605-card-depth-call]');
    const synthesis = reading.querySelector?.('[data-cosmic-spread-synthesis="v605"]');
    if (essence) {
      essence.hidden = !visible;
      essence.setAttribute('aria-hidden', String(!visible));
    }
    if (cardControl) cardControl.hidden = !visible;
    if (synthesis) {
      synthesis.hidden = !visible;
      synthesis.setAttribute('aria-hidden', String(!visible));
    }
    reading.dataset.cosmicSpreadPhase = visible ? 'essence' : 'silence';
    return true;
  }

  afterRender(engine, { reason = 'render' } = {}) {
    if (this.destroyed || !engine?.result) return false;
    const reading = engine.result.querySelector?.('.spread-reading');
    if (!reading) return false;
    this.engine = engine;
    this.clearSilenceTimer();
    const items = this.itemsFor(engine);
    this.decorateCard(engine, reading);
    this.decorateSynthesis(engine, reading, items);
    reading.dataset.cosmicSpreadReading = 'v605';
    reading.dataset.cosmicSpreadSequence = 'card-silence-essence-conversation-synthesis-depth';
    this.renders += 1;

    const fresh = Number.isInteger(this.stateFor(engine).pendingReveal);
    if (fresh) {
      this.silences += 1;
      this.setVisible(reading, false);
      if (this.setTimer) {
        this.timer = this.setTimer(() => {
          this.timer = 0;
          this.finishSilence('silence-complete');
        }, this.delay());
      } else {
        this.finishSilence('timer-unavailable');
      }
    } else {
      this.setVisible(reading, true);
    }

    this.emitUpdate(reading, reason);
    return true;
  }

  finishSilence(reason = 'complete') {
    this.clearSilenceTimer();
    const reading = this.engine?.result?.querySelector?.('.spread-reading[data-cosmic-spread-reading="v605"]');
    if (!reading) return false;
    const wasSilent = reading.dataset.cosmicSpreadPhase === 'silence';
    this.setVisible(reading, true);
    if (wasSilent) this.essenceReveals += 1;
    this.emitUpdate(reading, reason);
    return wasSilent;
  }

  onClick(event) {
    const cardControl = event.target?.closest?.('[data-db605-card-depth-call]');
    const synthesisControl = event.target?.closest?.('[data-db605-synthesis-depth-call]');
    const control = cardControl || synthesisControl;
    if (!control || control.hidden) return false;
    const article = control.closest?.(cardControl ? '[data-cosmic-card-reading="v605"]' : '[data-cosmic-spread-synthesis="v605"]');
    const depth = article?.querySelector?.(cardControl ? '[data-db605-card-depth]' : '[data-db605-synthesis-depth]');
    if (!depth) return false;
    event.preventDefault?.();
    const open = control.getAttribute('aria-expanded') !== 'true';
    control.setAttribute('aria-expanded', String(open));
    control.textContent = open ? 'Recolher' : cardControl ? 'Aprofundar esta carta' : 'Aprofundar a tiragem';
    depth.hidden = !open;
    depth.setAttribute('aria-hidden', String(!open));
    if (cardControl) {
      article.dataset.cosmicCardLayer = open ? 'depth' : 'essence';
      this.cardDepthCalls += open ? 1 : 0;
    } else {
      article.dataset.cosmicSpreadLayer = open ? 'depth' : 'synthesis';
      this.synthesisDepthCalls += open ? 1 : 0;
    }
    this.emitUpdate(article.closest?.('.spread-reading'), open ? 'explicit-depth' : 'explicit-recollect');
    return true;
  }

  emitUpdate(reading, reason) {
    if (!reading) return false;
    this.eventsEmitted += 1;
    return dispatch(this.documentTarget, 'divina:cosmic-spread-reading-updated', {
      version:VERSION,
      route:'spreads',
      phase:reading.dataset.cosmicSpreadPhase || 'essence',
      complete:Boolean(reading.classList?.contains?.('complete')),
      essenceSentences:reading.querySelector?.('[data-db605-card-essence]:not([hidden])') ? 1 : 0,
      conversationVoicesMaximum:3,
      synthesisSentences:reading.querySelector?.('[data-cosmic-spread-synthesis="v605"]:not([hidden])') ? 1 : 0,
      depthRequiresExplicitGesture:true,
      automaticWhitSpeech:false,
      reason:clean(reason, 48)
    });
  }

  audit() {
    const doc = this.documentTarget;
    return Object.freeze({
      release:'V605',
      route:'spreads',
      prototypePatched:Boolean(this.prototype?.[PATCH]),
      layeredReadings:doc?.querySelectorAll?.('[data-cosmic-spread-reading="v605"]')?.length || 0,
      layeredCardPanels:doc?.querySelectorAll?.('[data-cosmic-card-reading="v605"]')?.length || 0,
      layeredSyntheses:doc?.querySelectorAll?.('[data-cosmic-spread-synthesis="v605"]')?.length || 0,
      canonicalOrbs:doc?.querySelectorAll?.('#orb')?.length || 0,
      canonicalCanvases:doc?.querySelectorAll?.('#orbCanvas')?.length || 0,
      tarotFreeAutomaticMeanings:false,
      tarotFreeChanged:false,
      privateContentReads:0,
      intentionReads:0,
      questionReads:0,
      journalBodyReads:0,
      unrevealedCardReads:0,
      revealedCardReads:this.revealedCardReads,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      modelCalls:0,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      deferredTimers:this.timer ? 1 : 0,
      mutationObservers:0,
      documentClickListeners:1
    });
  }

  status() {
    return Object.freeze({
      ...COSMIC_SPREAD_READING_CONTRACT_V605,
      attached:Boolean(this.engine),
      patched:Boolean(this.prototype?.[PATCH]),
      phase:this.engine?.result?.querySelector?.('.spread-reading')?.dataset?.cosmicSpreadPhase || 'rest',
      renders:this.renders,
      silences:this.silences,
      essenceReveals:this.essenceReveals,
      cardDepthCalls:this.cardDepthCalls,
      synthesisDepthCalls:this.synthesisDepthCalls,
      editorialReads:this.editorialReads,
      synthesisBuilds:this.synthesisBuilds,
      eventsEmitted:this.eventsEmitted,
      destroyed:this.destroyed,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.clearSilenceTimer();
    this.abort.abort();
    const patch = this.prototype?.[PATCH];
    if (patch?.controller === this) {
      if (this.prototype.renderReading === patch.renderReadingV605) this.prototype.renderReading = patch.originalRender;
      if (this.prototype.revealNext === patch.revealNextV605) this.prototype.revealNext = patch.originalReveal;
      delete this.prototype[PATCH];
    }
    if (this.root?.dataset?.cosmicSpreadReading === 'v605') {
      ['cosmicSpreadReading','cosmicSpreadPrivacy','cosmicSpreadWhit'].forEach(key => delete this.root.dataset[key]);
    }
    try { if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE]; } catch {}
    return true;
  }
}

export function createCosmicSpreadReadingV605(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const reading = new CosmicSpreadReadingV605(options);
  globalThis[INSTANCE] = reading;
  globalThis.divinaCosmicSpreadReadingV605 = reading;
  return reading;
}

export default createCosmicSpreadReadingV605;
