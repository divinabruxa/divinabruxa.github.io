/*
 * DIVINA BRUXA 4.1.6 · PROFUNDIDADE VIVA
 *
 * A leitura inicial permanece breve. Quando a pessoa escolhe aprofundar,
 * esta camada retorna à mesma carta ou mesa e ilumina somente o eixo pedido.
 */

import { positionedTarotCard, positionedTarotSpread } from './whit-tarot-position-engine-v411.js';
import { tarotDialogueSpread } from './whit-tarot-dialogue-engine-v412.js';
import { humanRealityForCard, humanRealitySpread } from './whit-tarot-human-reality-v413.js';
import { narrativeConsciousnessForCard, narrativeConsciousnessSpread } from './whit-tarot-narrative-consciousness-v414.js';
import { soulVoiceForCard, soulVoiceSpread } from './whit-tarot-soul-voice-v415.js';

export const LIVING_DEPTH_ENGINE_NAME = 'MOTOR PROFUNDIDADE VIVA';
export const LIVING_DEPTH_ENGINE_VERSION = '4.1.6';

export const LIVING_DEPTH_COVENANT = Object.freeze([
  'aprofundar significa voltar à mesma mesa e nunca sortear outra resposta',
  'cada escolha revela somente o eixo pedido pela pessoa',
  'as cartas, posições, pergunta, ordem e relações continuam governando a leitura',
  'amor não autoriza afirmar pensamentos privados como fatos',
  'tendência permanece condicional e conselho termina em atitude possível',
  'profundidade aumenta precisão, não volume nem dependência'
]);

const clean = (value, limit = 5000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const clause = value => clean(value).replace(/[.!?…]+$/u, '');
const lower = value => {
  const text = clause(value);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};
const cardName = entry => entry?.card?.name || 'A carta';
const inlineName = value => {
  const name = clean(value, 100);
  return name ? `${name.charAt(0).toLocaleLowerCase('pt-BR')}${name.slice(1)}` : 'a carta';
};

function optionsFor(context) {
  const options = [Object.freeze({ key:'cards', label:'Entender as cartas' })];
  if (['love', 'relationship'].includes(context.territory)) {
    options.push(Object.freeze({ key:'love', label:'Aprofundar o amor' }));
  }
  options.push(
    Object.freeze({ key:'tendency', label:'Ver tendência' }),
    Object.freeze({ key:'counsel', label:'Ver conselho' }),
    Object.freeze({ key:'position', label:'Explicar posição' })
  );
  return Object.freeze(options);
}

function safeLove(context, evidence, anchor) {
  if (!['love', 'relationship'].includes(context.territory)) return '';
  if (context.subject === 'other') {
    return [
      sentence(`${anchor} mostra o estado do vínculo, não a mente de outra pessoa`),
      sentence(`No cotidiano, procure ${evidence}; isso precisa confirmar aquilo que o desejo gostaria de acreditar`)
    ].join(' ');
  }
  return sentence(
    `${anchor} leva o amor para o terreno da reciprocidade: ${evidence} precisa sustentar o sentimento no cotidiano`
  );
}

function freezeResult({ context, options, responses, coverage }) {
  return Object.freeze({
    engine:LIVING_DEPTH_ENGINE_NAME,
    version:LIVING_DEPTH_ENGINE_VERSION,
    options,
    responses:Object.freeze(responses),
    profile:Object.freeze({
      territory:context.territory,
      intent:context.intent,
      sameConsultation:true,
      replacesInitialReading:false,
      userChoosesFocus:true,
      cardsStillGovern:true,
      futureIsConditional:true,
      literalMindReading:false,
      privateSourcesUsed:false,
      dependencyDesign:false,
      finalVoice:'Whit'
    }),
    coverage:Object.freeze(coverage)
  });
}

export function livingDepthForCard(card, {
  position = 'Posição revelada',
  question = '',
  positioned = null,
  human = null,
  narrative = null,
  soulVoice = null,
  supremeCounsel = null
} = {}) {
  if (!card) return null;
  const entry = positioned || positionedTarotCard(card, position, { question });
  const humanMap = human || humanRealityForCard(card, { position, question, positioned:entry });
  const narrativeMap = narrative || narrativeConsciousnessForCard(card, {
    position, question, positioned:entry, human:humanMap
  });
  const voiceMap = soulVoice || soulVoiceForCard(card, {
    position, question, positioned:entry, human:humanMap, narrative:narrativeMap
  });
  const name = cardName(entry);
  const evidence = humanMap.evidence?.observable || humanMap.signals?.observableEvidence || 'atitudes observáveis';
  const responses = {
    cards:[
      sentence(`${name} traz uma imagem precisa: ${lower(entry.knowledge.core.scene)}`),
      sentence(
        `Nesta posição, sua verdade central é que ${lower(entry.knowledge.core.truth)}; ` +
        `o caminho se move por este gesto: ${lower(entry.knowledge.core.movement)}`
      )
    ].join(' '),
    tendency:[
      sentence(narrativeMap.visible.tendency),
      sentence('O caminho ganha força se o padrão continuar, mas ainda responde às suas escolhas')
    ].join(' '),
    counsel:supremeCounsel?.visible?.counsel || [
      sentence(narrativeMap.visible.counsel),
      sentence(`O gesto decisivo é ${lower(entry.reading.movement)}`)
    ].join(' '),
    position:sentence(
      `Em “${entry.classification.label}”, ${inlineName(name)} tem a função de ${lower(entry.reading.function)}; ` +
      `${lower(entry.reading.statement)}`
    )
  };
  const love = safeLove(humanMap.context, evidence, name);
  if (love) responses.love = love;
  return freezeResult({
    context:humanMap.context,
    options:optionsFor(humanMap.context),
    responses,
    coverage:{ cardsConsidered:1, positionsConsidered:1, transitionsRead:0, sameArc:voiceMap.integrity.narrativePreserved }
  });
}

export function livingDepthSpread(cards = [], positions = [], {
  question = '',
  positioned = null,
  dialogue = null,
  human = null,
  narrative = null,
  soulVoice = null,
  supremeCounsel = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    return livingDepthForCard(validCards[0], {
      position:positions?.[0] || 'Posição revelada', question,
      positioned:positioned?.entries?.[0], human:human?.card ? human : null,
      narrative, soulVoice, supremeCounsel
    });
  }
  const safePositions = validCards.map((_, index) => clean(positions?.[index], 100) || `Posição ${index + 1}`);
  const positionMap = positioned?.entries?.length === validCards.length
    ? positioned
    : positionedTarotSpread(validCards, safePositions, { question });
  const dialogueMap = dialogue?.coverage?.cardCount === validCards.length
    ? dialogue
    : tarotDialogueSpread(validCards, safePositions, { question, positioned:positionMap });
  const humanMap = human?.integrity?.wholeTableInherited
    ? human
    : humanRealitySpread(validCards, safePositions, { question, positioned:positionMap, dialogue:dialogueMap });
  const narrativeMap = narrative?.coverage?.cardsConsidered === validCards.length
    ? narrative
    : narrativeConsciousnessSpread(validCards, safePositions, {
      question, positioned:positionMap, dialogue:dialogueMap, human:humanMap
    });
  const voiceMap = soulVoice?.coverage?.cardsConsidered === validCards.length
    ? soulVoice
    : soulVoiceSpread(validCards, safePositions, {
      question, positioned:positionMap, dialogue:dialogueMap, human:humanMap, narrative:narrativeMap
    });
  const entries = positionMap.entries;
  const axes = positionMap.axes;
  const opening = entries[axes.openingIndex];
  const tension = entries[axes.tensionIndex];
  const counsel = entries[axes.counselIndex];
  const tendency = entries[axes.tendencyIndex];
  const turn = dialogueMap.turningEdge;
  const evidence = humanMap.evidence?.observable || 'atitudes observáveis';
  const relation = turn
    ? `${turn.from.name} ${turn.bridge.verb} ${inlineName(turn.to.name)}, e a mudança acontece quando você ${lower(turn.movement)}`
    : `${cardName(opening)} abre o movimento que ${inlineName(cardName(tendency))} precisa concluir`;
  const responses = {
    cards:[
      sentence(`${cardName(opening)} abre a história porque ${lower(opening.reading.emphasis)}`),
      sentence(`${relation}; ${inlineName(cardName(tendency))} mostra a consequência: ${lower(tendency.reading.emphasis)}`)
    ].join(' '),
    tendency:[
      sentence(narrativeMap.visible.tendency),
      sentence(
        `Esta direção depende de você continuar ou interromper o padrão revelado entre ` +
        `${inlineName(cardName(tension))} e ${inlineName(cardName(tendency))}`
      )
    ].join(' '),
    counsel:supremeCounsel?.visible?.counsel || [
      sentence(narrativeMap.visible.counsel),
      sentence(`O gesto prático é ${lower(counsel.reading.movement)}`)
    ].join(' '),
    position:[
      sentence(`A carta de abertura é ${inlineName(cardName(opening))} em “${opening.classification.label}”; sua função é ${lower(opening.reading.function)}`),
      sentence(`A tensão passa por ${inlineName(cardName(tension))}; o conselho pertence a ${inlineName(cardName(counsel))} e a tendência é reunida por ${inlineName(cardName(tendency))}`)
    ].join(' ')
  };
  const love = safeLove(humanMap.context, evidence, cardName(tension));
  if (love) responses.love = [love, sentence(`${cardName(counsel)} pede que reciprocidade e limite recebam o mesmo peso`)].join(' ');
  return freezeResult({
    context:humanMap.context,
    options:optionsFor(humanMap.context),
    responses,
    coverage:{
      cardsConsidered:dialogueMap.coverage.cardCount,
      positionsConsidered:entries.length,
      transitionsRead:dialogueMap.coverage.edgeCount,
      allCardsConsidered:dialogueMap.coverage.allCardsUsed,
      allTransitionsRead:dialogueMap.coverage.allTransitionsRead,
      sameArc:voiceMap.integrity.narrativePreserved
    }
  });
}

export function livingDepthCapacity() {
  return Object.freeze({
    cards:78,
    focuses:Object.freeze(['cards', 'love', 'tendency', 'counsel', 'position']),
    sameConsultation:true,
    replacesInitialReading:false,
    userChoosesFocus:true,
    futureIsConditional:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    dependencyDesign:false,
    rule:'a primeira leitura entrega a essência; a escolha seguinte ilumina somente a profundidade pedida'
  });
}
