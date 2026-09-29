/*
 * DIVINA BRUXA 4.1.7 · CONSELHOS SUPREMOS
 *
 * Este motor não cria outra voz. Ele transforma o discernimento da mesa em
 * uma orientação específica, pequena e praticável para Whit entregar.
 */

import { positionedTarotCard, positionedTarotSpread } from './whit-tarot-position-engine-v411.js';
import { tarotDialogueSpread } from './whit-tarot-dialogue-engine-v412.js';
import { humanRealityForCard, humanRealitySpread } from './whit-tarot-human-reality-v413.js';
import { narrativeConsciousnessForCard, narrativeConsciousnessSpread } from './whit-tarot-narrative-consciousness-v414.js';

export const SUPREME_COUNSEL_ENGINE_NAME = 'MOTOR CONSELHOS SUPREMOS';
export const SUPREME_COUNSEL_ENGINE_VERSION = '4.1.7';

export const SUPREME_COUNSEL_COVENANT = Object.freeze([
  'cada conselho nasce da carta, da posição, da pergunta e da mesa real',
  'orientação termina em ação possível e nunca em frase vazia',
  'Whit pode aconselhar conversar, esperar, observar, limitar, iniciar, organizar ou encerrar',
  'o conselho ilumina uma escolha sem tomar a decisão pela pessoa',
  'amor exige reciprocidade observável e futuro permanece tendência',
  'saúde, direito e finanças exigem dados e apoio humano adequado'
]);

const clean = (value, limit = 5000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 1000)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};
const clause = value => clean(value).replace(/[.!?…]+$/u, '');
const lower = value => {
  const text = clause(value);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};
const inlineName = value => {
  const name = clean(value, 100);
  if (!name) return 'a carta';
  if (/^(?:A|O|As|Os)\s/u.test(name)) {
    return `${name.charAt(0).toLocaleLowerCase('pt-BR')}${name.slice(1)}`;
  }
  return `${/^Rainha\s/u.test(name) ? 'a' : 'o'} ${name}`;
};

const ACTIONS = Object.freeze({
  return:Object.freeze({ mode:'observe', text:'Não procure resposta no silêncio; defina qual mudança observável precisaria acontecer antes de reabrir a porta' }),
  trust:Object.freeze({ mode:'verify', text:'Escolha uma promessa pequena que possa ser verificada e observe se ela é cumprida com consistência' }),
  ending:Object.freeze({ mode:'close', text:'Retire um gesto que prolonga a espera e devolva esse tempo ao que ainda sustenta sua vida' }),
  commitment:Object.freeze({ mode:'speak', text:'Converse sobre intenção, disponibilidade e acordo; não aceite que promessa substitua presença' }),
  reciprocity:Object.freeze({ mode:'measure', text:'Compare o que você oferece com o que realmente recebe e ajuste sua entrega a essa medida' }),
  communication:Object.freeze({ mode:'speak', text:'Diga o que precisa em uma frase clara, faça uma pergunta direta e escute a resposta inteira' }),
  boundary:Object.freeze({ mode:'protect', text:'Nomeie o limite, a consequência e a atitude que você tomará para se proteger' }),
  healing:Object.freeze({ mode:'care', text:'Escolha um cuidado pequeno, repetível e real; peça apoio quando a dor ultrapassar o que você consegue sustentar' }),
  decision:Object.freeze({ mode:'choose', text:'Separe fato, desejo, custo e consequência; escolha o caminho cujo preço você aceita assumir' }),
  action:Object.freeze({ mode:'act', text:'Transforme a intenção no menor passo verificável que possa ser realizado agora' }),
  timing:Object.freeze({ mode:'wait', text:'Seu livre-arbítrio continua vivo: pare de cobrar uma data e observe qual condição concreta ainda precisa amadurecer' }),
  future:Object.freeze({ mode:'redirect', text:'Seu livre-arbítrio continua vivo: observe qual hábito atual alimenta essa tendência e mude uma ação antes de tentar mudar o destino' }),
  beginning:Object.freeze({ mode:'begin', text:'Comece pelo passo mais simples que produza uma resposta real, sem comprometer tudo de uma vez' }),
  stability:Object.freeze({ mode:'organize', text:'Coloque números, prazos e limites no papel antes de prometer, gastar ou assumir' }),
  conflict:Object.freeze({ mode:'protect', text:'Retire acusações, nomeie o fato, diga o limite e escolha uma consequência que você realmente consiga cumprir' }),
  purpose:Object.freeze({ mode:'practice', text:'Converta o valor que importa em uma prática regular; propósito sem rotina permanece desejo' }),
  understanding:Object.freeze({ mode:'clarify', text:'Dê nome ao fato central e diferencie o que aconteceu da história que o medo construiu' }),
  general:Object.freeze({ mode:'act', text:'Escolha uma ação pequena que honre a verdade da carta sem exigir certeza total' })
});

function includesRole(entry, words) {
  const roles = (entry?.knowledge?.narrativeRoles || []).map(normalize).join(' ');
  return words.some(word => roles.includes(normalize(word)));
}

function cardDirection(entry) {
  const name = entry.card.name;
  if (includesRole(entry, ['ruptura', 'encerramento', 'conclusão'])) {
    return `${name} pede que você retire ou finalize o que já não consegue sustentar antes de tentar reconstruir`;
  }
  if (includesRole(entry, ['suspensão', 'revisão', 'espera'])) {
    return `${name} pede pausa consciente: não confunda movimento rápido com direção correta`;
  }
  if (includesRole(entry, ['cura', 'esperança', 'renovação'])) {
    return `${name} preserva o que ainda vive, mas não permite que esperança seja usada para negar um limite`;
  }
  if (includesRole(entry, ['decisão', 'critério', 'justiça'])) {
    return `${name} mede esta escolha por fatos, proporção e consequências, não apenas pela intensidade do desejo`;
  }
  if (includesRole(entry, ['início', 'abertura', 'impulso'])) {
    return `${name} favorece um começo pequeno e reversível, capaz de revelar realidade antes de exigir compromisso total`;
  }
  if (includesRole(entry, ['autoridade', 'matéria', 'realização', 'estabilidade'])) {
    return `${name} transforma intenção em estrutura: recurso, prazo e responsabilidade precisam caber no mesmo plano`;
  }
  if (includesRole(entry, ['revelação', 'clareza', 'verdade'])) {
    return `${name} pede que a verdade seja nomeada com clareza suficiente para orientar uma atitude`;
  }
  const element = entry.knowledge.card.element;
  if (element === 'fire') return `${name} pede iniciativa com medida: aja, observe a resposta e só então aumente o movimento`;
  if (element === 'water') return `${name} acolhe o sentimento, mas pede que ele seja confirmado pelo que acontece na realidade`;
  if (element === 'air') return `${name} pede uma decisão que separe fato, interpretação e medo antes de responder`;
  return `${name} pede corpo e continuidade: escolha algo que possa ser sustentado depois do primeiro impulso`;
}

function actionFor(context) {
  if (context.highStakes) {
    return Object.freeze({
      mode:'verify',
      text:'Antes de decidir, reúna dados verificáveis, registre limites e procure apoio humano adequado para confirmar o próximo passo'
    });
  }
  return ACTIONS[context.intent] || ACTIONS.general;
}

function counselResult(entry, human, narrative, extra = {}) {
  const context = human.context;
  const action = actionFor(context);
  const direction = cardDirection(entry);
  const visible = sentence(action.text);
  const grammaticalDirection = direction.startsWith(entry.card.name)
    ? `${inlineName(entry.card.name)}${direction.slice(entry.card.name.length)}`
    : lower(direction);
  const cardCriterion = sentence(`Como ${entry.classification.title}, ${grammaticalDirection}`);
  return Object.freeze({
    engine:SUPREME_COUNSEL_ENGINE_NAME,
    version:SUPREME_COUNSEL_ENGINE_VERSION,
    visible:Object.freeze({
      action:visible,
      criterion:cardCriterion,
      counsel:sentence(`${clause(visible)}; ${lower(cardCriterion)}`)
    }),
    profile:Object.freeze({
      mode:action.mode,
      territory:context.territory,
      intent:context.intent,
      card:entry.card.key,
      position:entry.classification.role,
      specificToReading:true,
      practical:true,
      decidesForPerson:false,
      futureIsConditional:true,
      literalMindReading:false,
      privateSourcesUsed:false,
      dependencyDesign:false,
      finalVoice:'Whit',
      ...extra
    }),
    integrity:Object.freeze({
      tarotGoverns:true,
      positionMatters:true,
      questionSetsTerritory:true,
      actionIsPossible:true,
      genericCriterionFormula:false,
      supernaturalAuthority:false
    })
  });
}

export function supremeCounselForCard(card, {
  position = 'Conselho',
  question = '',
  positioned = null,
  human = null,
  narrative = null
} = {}) {
  if (!card) return null;
  const entry = positioned || positionedTarotCard(card, position, { question });
  const humanMap = human || humanRealityForCard(card, { position, question, positioned:entry });
  const narrativeMap = narrative || narrativeConsciousnessForCard(card, {
    position, question, positioned:entry, human:humanMap
  });
  return counselResult(entry, humanMap, narrativeMap, { cardsConsidered:1, transitionsRead:0 });
}

export function supremeCounselSpread(cards = [], positions = [], {
  question = '',
  positioned = null,
  dialogue = null,
  human = null,
  narrative = null
} = {}) {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    return supremeCounselForCard(validCards[0], {
      position:positions?.[0] || 'Conselho', question,
      positioned:positioned?.entries?.[0], human:human?.card ? human : null, narrative
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
  const counselIndex = positionMap.axes.counselIndex;
  const counselEntry = positionMap.entries[counselIndex];
  const tensionEntry = positionMap.entries[positionMap.axes.tensionIndex];
  const result = counselResult(counselEntry, humanMap, narrativeMap, {
    cardsConsidered:dialogueMap.coverage.cardCount,
    transitionsRead:dialogueMap.coverage.edgeCount,
    allCardsConsidered:dialogueMap.coverage.allCardsUsed,
    allTransitionsRead:dialogueMap.coverage.allTransitionsRead
  });
  const tension = sentence(
    `Como ${inlineName(tensionEntry.card.name)} ocupa a tensão da mesa, considere o conselho cumprido somente ` +
    `quando sua atitude também responder a isto: ${tensionEntry.knowledge.core.humanNeed}`
  );
  const integratedCriterion = sentence(
    `${result.visible.criterion.replace(/[.!?…]+$/u, '')}; ` +
    `como ${inlineName(tensionEntry.card.name)} ocupa a tensão, sua atitude também precisa responder a isto: ` +
    `${tensionEntry.knowledge.core.humanNeed}`
  );
  return Object.freeze({
    ...result,
    visible:Object.freeze({
      ...result.visible,
      tension,
      criterion:integratedCriterion,
      counsel:sentence(`${clause(result.visible.action)}; ${lower(integratedCriterion)}`)
    })
  });
}

export function supremeCounselCapacity() {
  return Object.freeze({
    cards:78,
    humanIntentions:Object.keys(ACTIONS).length,
    actionModes:Object.freeze([...new Set(Object.values(ACTIONS).map(action => action.mode))]),
    specificToReading:true,
    practical:true,
    decidesForPerson:false,
    futureIsConditional:true,
    literalMindReading:false,
    privateSourcesUsed:false,
    dependencyDesign:false,
    rule:'um conselho só está inteiro quando a verdade da mesa encontra uma atitude possível'
  });
}
