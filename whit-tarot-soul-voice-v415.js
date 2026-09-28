/*
 * DIVINA BRUXA 4.1.5 · ALMA E VOZ
 *
 * A Consciência Narrativa encontra a história. Esta camada escolhe como Whit
 * deve dizê-la: com amor sem melosidade, firmeza sem crueldade, espiritualidade
 * sem autoridade sobrenatural e magia sem palavras vazias.
 */

import {
  positionedTarotCard,
  positionedTarotSpread
} from './whit-tarot-position-engine-v411.js';
import { tarotDialogueSpread } from './whit-tarot-dialogue-engine-v412.js';
import {
  humanRealityForCard,
  humanRealitySpread
} from './whit-tarot-human-reality-v413.js';
import {
  narrativeConsciousnessForCard,
  narrativeConsciousnessSpread
} from './whit-tarot-narrative-consciousness-v414.js';

export const SOUL_VOICE_ENGINE_NAME = 'MOTOR ALMA E VOZ';
export const SOUL_VOICE_ENGINE_VERSION = '4.1.5';

export const SOUL_VOICE_COVENANT = Object.freeze([
  'Whit fala como uma única taróloga, nunca como uma coleção de motores',
  'amor aparece na precisão do cuidado e não em frases melosas repetidas',
  'firmeza sustenta a verdade difícil sem retirar dignidade da pessoa',
  'espiritualidade oferece sentido sem alegar autoridade sobrenatural',
  'magia nasce da relação entre as cartas e nunca de palavras vazias',
  'sentimento de terceiros só existe na leitura como hipótese sustentada por atitudes',
  'motores, algoritmos, processos técnicos e bastidores permanecem invisíveis'
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
const pluralCard = name => /^(?:Os|As)\s/u.test(clean(name, 100));
const agrees = (name, singular, plural) => pluralCard(name) ? plural : singular;

const REGISTERS = Object.freeze({
  grief:Object.freeze({
    key:'verdade-terna', care:5, firmness:3, mystery:2, directness:4,
    tension:'esta verdade merece cuidado, não negação'
  }),
  fear:Object.freeze({
    key:'coragem-serena', care:4, firmness:4, mystery:1, directness:5,
    tension:'o medo informa, mas não governa'
  }),
  conflict:Object.freeze({
    key:'dignidade-firme', care:3, firmness:5, mystery:1, directness:5,
    tension:'firmeza não precisa se transformar em crueldade'
  }),
  hope:Object.freeze({
    key:'esperança-aterrada', care:4, firmness:3, mystery:3, directness:3,
    tension:'a esperança amadurece quando também consegue olhar para o limite'
  }),
  sacred:Object.freeze({
    key:'mistério-com-discernimento', care:3, firmness:3, mystery:5, directness:3,
    tension:'o símbolo só ganha alma quando também encontra realidade e discernimento'
  }),
  observable:Object.freeze({
    key:'amor-observável', care:4, firmness:5, mystery:1, directness:5,
    tension:'nenhum sentimento invisível substitui uma atitude demonstrada'
  }),
  clear:Object.freeze({
    key:'presença-clara', care:3, firmness:4, mystery:2, directness:4,
    tension:''
  })
});

function voiceRegister(context) {
  if (context.subject === 'other') return REGISTERS.observable;
  if (context.tone === 'grief') return REGISTERS.grief;
  if (context.tone === 'fear') return REGISTERS.fear;
  if (context.tone === 'conflict') return REGISTERS.conflict;
  if (context.tone === 'hope') return REGISTERS.hope;
  if (context.territory === 'spirituality') return REGISTERS.sacred;
  return REGISTERS.clear;
}

function voiceProfile(context, register) {
  return Object.freeze({
    register:register.key,
    territory:context.territory,
    intent:context.intent,
    tone:context.tone,
    subject:context.subject,
    qualities:Object.freeze({
      care:register.care,
      firmness:register.firmness,
      mystery:register.mystery,
      directness:register.directness
    }),
    hardTruthWithDignity:true,
    supernaturalAuthority:false,
    literalMindReading:false,
    emptyMysticism:false,
    dependencyDesign:false,
    technicalLanguageVisible:false,
    finalVoice:'Whit'
  });
}

function voicedTension(base, register, context) {
  if (!context.hasContext || !register.tension) return base;
  return sentence(`${clause(base)}; ${register.tension}`);
}

function humanVoice(human, anchorName) {
  const context = human.context;
  if (!context.hasContext) return '';
  const evidence = human.evidence?.observable || human.signals?.observableEvidence || '';
  const verb = (singular, plural) => agrees(anchorName, singular, plural);

  if (context.subject === 'other') {
    return sentence(
      `${anchorName} não ${verb('transforma', 'transformam')} ausência em resposta: ` +
      `na busca por ${context.intentTitle}, observe ${evidence}, não pensamentos privados que ninguém demonstrou`
    );
  }
  if (context.needsTimingBoundary) {
    return sentence(
      `${anchorName} não ${verb('fecha', 'fecham')} o relógio: a busca por ${context.intentTitle} ` +
      `amadurece por ${evidence}, não numa data garantida`
    );
  }
  if (context.highStakes) {
    return sentence(
      `${anchorName} ${verb('traz', 'trazem')} a questão para a realidade: observe ${evidence} ` +
      'e confirme decisões importantes com dados e apoio adequado'
    );
  }
  if (context.tone === 'grief') {
    return sentence(
      `${anchorName} não ${verb('apressa', 'apressam')} seu encerramento: atravessar a dor sem se abandonar ` +
      `pede ${evidence}`
    );
  }
  if (context.tone === 'fear') {
    return sentence(
      `${anchorName} ${verb('separa', 'separam')} medo de direção: na busca por ${context.intentTitle}, ` +
      `deixe ${evidence} pesar mais do que a urgência por certeza`
    );
  }
  if (context.tone === 'conflict') {
    return sentence(
      `${anchorName} ${verb('retira', 'retiram')} a verdade da disputa e a devolve aos fatos: ` +
      `na busca por ${context.intentTitle}, observe ${evidence}`
    );
  }
  if (context.tone === 'hope') {
    return sentence(
      `${anchorName} ${verb('mantém', 'mantêm')} a esperança com os pés na realidade: ` +
      `na busca por ${context.intentTitle}, observe ${evidence}`
    );
  }
  if (context.territory === 'spirituality') {
    return sentence(
      `${anchorName} ${verb('une', 'unem')} símbolo e vida concreta: na busca por ${context.intentTitle}, ` +
      `observe ${evidence}`
    );
  }
  return sentence(
    `${anchorName} ${verb('leva', 'levam')} sua busca por ${context.intentTitle} ao que pode ser vivido: ` +
    `observe ${evidence}`
  );
}

function voiceClosing(entry, human, fallback) {
  const context = human.context;
  const name = entry.card.name;
  const verb = (singular, plural) => agrees(name, singular, plural);
  if (!context.hasContext) return fallback;

  if (context.subject === 'other') {
    return sentence(
      `${name} não ${verb('pede', 'pedem')} que você adivinhe o outro; ` +
      'pede que reconheça o vínculo pelas atitudes que realmente chegam até você'
    );
  }
  if (context.needsTimingBoundary) {
    return sentence(
      `${name} não ${verb('fecha', 'fecham')} o relógio; o tempo permanece vivo, ` +
      'mas precisa das condições que a mesa mostrou'
    );
  }
  if (context.highStakes) {
    return sentence(
      `${name} ${verb('mantém', 'mantêm')} a leitura no lugar certo: use o símbolo para refletir ` +
      'e confirme decisões importantes com dados e apoio adequado'
    );
  }
  if (context.tone === 'grief') {
    return sentence(
      `${name} não ${verb('pede', 'pedem')} que você negue o que viveu; ` +
      'permite honrar o que existiu sem continuar presa ao que terminou'
    );
  }
  if (context.tone === 'fear') {
    return sentence(
      `${name} não ${verb('exige', 'exigem')} certeza absoluta; pede uma escolha que preserve sua dignidade ` +
      'mesmo enquanto o medo ainda fala'
    );
  }
  if (context.tone === 'conflict') {
    return sentence(
      `${name} ${verb('deixa', 'deixam')} uma verdade firme: proteger sua dignidade não destrói o amor; ` +
      'impede que o amor seja usado contra você'
    );
  }
  if (context.tone === 'hope') {
    return sentence(
      `${name} não ${verb('promete', 'prometem')} uma vida sem feridas; mostra que a esperança se torna verdadeira ` +
      'quando encontra cuidado, limite e continuidade'
    );
  }
  if (context.territory === 'spirituality') {
    return sentence(
      `${name} ${verb('deixa', 'deixam')} uma mensagem espiritual: o sagrado desta leitura não está em obedecer ` +
      'a uma voz externa, mas em unir sentido, realidade e escolha'
    );
  }
  if (['love', 'relationship'].includes(context.territory)) {
    return sentence(
      `${name} ${verb('encerra', 'encerram')} a leitura com uma medida de amor: sentimento merece escuta, ` +
      'mas reciprocidade precisa aparecer em atitudes'
    );
  }
  return fallback;
}

function soulResult(narrative, human, anchorEntry, finalEntry) {
  const register = voiceRegister(human.context);
  const profile = voiceProfile(human.context, register);
  const humanSentence = humanVoice(human, anchorEntry.card.name);
  const visible = Object.freeze({
    opening:narrative.visible.opening,
    preserved:narrative.visible.preserved || narrative.arc.preserved.statement,
    tension:voicedTension(narrative.visible.tension, register, human.context),
    revelation:humanSentence || narrative.visible.revelation,
    human:humanSentence,
    tendency:narrative.visible.tendency,
    counsel:narrative.visible.counsel,
    closing:voiceClosing(finalEntry, human, narrative.visible.closing)
  });
  return Object.freeze({
    engine:SOUL_VOICE_ENGINE_NAME,
    version:SOUL_VOICE_ENGINE_VERSION,
    profile,
    visible,
    integrity:Object.freeze({
      narrativePreserved:true,
      tarotGoverns:true,
      hardTruthWithDignity:true,
      supernaturalAuthority:false,
      literalMindReading:false,
      privateSourcesUsed:false,
      emptyMysticism:false,
      dependencyDesign:false,
      finalVoice:true
    })
  });
}

export function soulVoiceForCard(card, {
  position = 'Posição revelada',
  question = '',
  positioned = null,
  human = null,
  narrative = null
} = {}) {
  if (!card) return null;
  const positionMap = positioned || positionedTarotCard(card, position, { question });
  const humanMap = human || humanRealityForCard(card, { position, question, positioned:positionMap });
  const narrativeMap = narrative || narrativeConsciousnessForCard(card, {
    position, question, positioned:positionMap, human:humanMap
  });
  return soulResult(narrativeMap, humanMap, positionMap, positionMap);
}

export function soulVoiceSpread(cards = [], positions = [], {
  question = '',
  positioned = null,
  dialogue = null,
  human = null,
  narrative = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    return soulVoiceForCard(validCards[0], {
      position:positions?.[0] || 'Posição revelada', question,
      positioned:positioned?.entries?.[0],
      human:human?.card ? human : null,
      narrative
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
    : humanRealitySpread(validCards, safePositions, {
      question, positioned:positionMap, dialogue:dialogueMap
    });
  const narrativeMap = narrative?.coverage?.cardsConsidered === validCards.length
    ? narrative
    : narrativeConsciousnessSpread(validCards, safePositions, {
      question, positioned:positionMap, dialogue:dialogueMap, human:humanMap
    });
  const anchorIndex = narrativeMap.arc.revelation.index;
  const anchorEntry = positionMap.entries[anchorIndex] || positionMap.entries[positionMap.axes.tensionIndex];
  const finalEntry = positionMap.entries.at(-1);
  const result = soulResult(narrativeMap, humanMap, anchorEntry, finalEntry);
  return Object.freeze({
    ...result,
    visible:Object.freeze({
      ...result.visible,
      revelation:narrativeMap.visible.revelation,
      human:result.visible.revelation,
      paragraphs:Object.freeze([
        narrativeMap.visible.revelation,
        result.visible.revelation,
        result.visible.tendency,
        result.visible.counsel
      ].filter(Boolean))
    }),
    coverage:Object.freeze({
      cardsConsidered:narrativeMap.coverage.cardsConsidered,
      transitionsRead:narrativeMap.coverage.transitionsRead,
      completeArc:narrativeMap.coverage.completeArc,
      allCardsConsidered:narrativeMap.coverage.allCardsConsidered,
      allTransitionsRead:narrativeMap.coverage.allTransitionsRead
    })
  });
}

export function soulVoiceCapacity() {
  return Object.freeze({
    cards:78,
    voiceRegisters:Object.keys(REGISTERS).length,
    registers:Object.freeze(Object.values(REGISTERS).map(register => register.key)),
    direct:true,
    loving:true,
    firm:true,
    deep:true,
    understandable:true,
    spiritualWithoutSupernaturalAuthority:true,
    magicalWithoutEmptyWords:true,
    sensitiveWithoutMelodrama:true,
    hardTruthWithDignity:true,
    literalMindReading:false,
    dependencyDesign:false,
    technicalLanguageVisible:false,
    rule:'as cartas encontram a verdade; a alma da Whit encontra a forma digna de dizê-la'
  });
}
