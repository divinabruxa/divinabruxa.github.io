/*
 * DIVINA BRUXA 4.1.0 · CONHECIMENTO PROFUNDO DAS 78 CARTAS
 *
 * Esta camada não escreve consultas. Ela organiza o conhecimento que a Whit
 * usará nas próximas etapas para interpretar carta, posição e território
 * antes de escolher qualquer palavra visível.
 */

import { tarotIdentity } from './tarot-story-engine-v402.js';

export const KNOWLEDGE_ENGINE_NAME = 'NÚCLEO DE CONHECIMENTO PROFUNDO DO TAROT';
export const KNOWLEDGE_ENGINE_VERSION = '4.1.0';

export const KNOWLEDGE_COVENANT = Object.freeze([
  'as 78 identidades existentes são preservadas e aprofundadas',
  'posição transforma a função da carta em vez de apenas nomear a casa',
  'pergunta localiza a leitura na vida sem substituir o Tarot',
  'luz e sombra permanecem simultaneamente disponíveis',
  'conselho nasce do conflito, do movimento e do espaço de escolha',
  'esta camada entrega conhecimento interno e nunca parágrafos prontos'
]);

const clean = (value, limit = 1000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const ELEMENT_WISDOM = Object.freeze({
  fire:Object.freeze({
    gift:'coragem para iniciar, desejar e mover',
    shadow:'pressa, excesso ou ação sem direção',
    need:'dar direção sustentável à própria força',
    pace:'rápido',
    agency:'ativa'
  }),
  water:Object.freeze({
    gift:'sensibilidade para perceber vínculo, memória e verdade emocional',
    shadow:'projeção, idealização ou permanência dentro do sentimento',
    need:'permitir que emoção encontre reciprocidade, limite e forma',
    pace:'orgânico',
    agency:'receptiva'
  }),
  air:Object.freeze({
    gift:'clareza para nomear, discernir e escolher',
    shadow:'ansiedade, abstração ou palavra separada da realidade',
    need:'aproximar pensamento, evidência e consequência',
    pace:'variável',
    agency:'reflexiva'
  }),
  earth:Object.freeze({
    gift:'capacidade de construir, sustentar e materializar',
    shadow:'rigidez, apego ou segurança transformada em prisão',
    need:'criar continuidade sem impedir movimento',
    pace:'gradual',
    agency:'construtiva'
  }),
  spirit:Object.freeze({
    gift:'visão ampla para reconhecer ciclos e passagens de consciência',
    shadow:'entregar a uma ideia de destino aquilo que ainda pede escolha',
    need:'integrar significado e livre-arbítrio',
    pace:'cíclico',
    agency:'integradora'
  })
});

const ARCANA_WISDOM = Object.freeze({
  louco:Object.freeze({ theme:'liberdade diante do desconhecido', need:'experimentar sem abandonar presença e responsabilidade', phase:'opening', intensity:3, roles:['início', 'salto', 'possibilidade'] }),
  mago:Object.freeze({ theme:'autoria que transforma potencial em ato', need:'concentrar recursos numa intenção executável', phase:'opening', intensity:3, roles:['início', 'ação', 'autoria'] }),
  sacerdotisa:Object.freeze({ theme:'conhecimento que amadurece no silêncio', need:'observar antes de revelar ou decidir', phase:'pause', intensity:3, roles:['mistério', 'espera', 'percepção'] }),
  imperatriz:Object.freeze({ theme:'criação nutrida por corpo, presença e cuidado', need:'alimentar o que cresce sem sufocar ou se abandonar', phase:'growth', intensity:3, roles:['gestação', 'expansão', 'cuidado'] }),
  imperador:Object.freeze({ theme:'estrutura que responde pelo que sustenta', need:'usar autoridade como responsabilidade e não controle', phase:'structure', intensity:3, roles:['limite', 'estrutura', 'governo'] }),
  hierofante:Object.freeze({ theme:'tradição examinada pela consciência', need:'distinguir princípio vivo de costume automático', phase:'structure', intensity:3, roles:['ensinamento', 'pertencimento', 'valor'] }),
  enamorados:Object.freeze({ theme:'amor revelado pela coerência da escolha', need:'alinhar desejo, valor, palavra e atitude', phase:'choice', intensity:3, roles:['escolha', 'vínculo', 'alinhamento'] }),
  carro:Object.freeze({ theme:'forças contrárias reunidas numa direção', need:'conduzir impulso e conflito para o mesmo caminho', phase:'movement', intensity:3, roles:['avanço', 'direção', 'conquista'] }),
  justica:Object.freeze({ theme:'verdade medida por fatos e consequências', need:'restaurar proporção sem privilégio ou vingança', phase:'choice', intensity:3, roles:['decisão', 'critério', 'consequência'] }),
  eremita:Object.freeze({ theme:'sabedoria que ilumina o próximo passo possível', need:'reduzir ruído sem transformar recolhimento em isolamento', phase:'pause', intensity:3, roles:['busca', 'pausa', 'discernimento'] }),
  roda:Object.freeze({ theme:'ciclo que muda posições e oportunidades', need:'adaptar-se ao giro sem abandonar autoria', phase:'turn', intensity:3, roles:['virada', 'ciclo', 'reposicionamento'] }),
  forca:Object.freeze({ theme:'potência conduzida por firmeza serena', need:'acolher intensidade sem violência ou repressão', phase:'mastery', intensity:3, roles:['domínio', 'coragem', 'integração'] }),
  enforcado:Object.freeze({ theme:'rendição consciente que muda a perspectiva', need:'interromper reação automática e enxergar por outro ângulo', phase:'pause', intensity:3, roles:['suspensão', 'revisão', 'entrega'] }),
  morte:Object.freeze({ theme:'fim necessário que devolve matéria ao começo', need:'retirar energia da forma encerrada e abrir espaço', phase:'ending', intensity:3, roles:['fim', 'transformação', 'passagem'] }),
  temperanca:Object.freeze({ theme:'terceira via construída entre extremos', need:'ajustar ritmo, proporção e cooperação', phase:'integration', intensity:3, roles:['cura', 'integração', 'equilíbrio'] }),
  diabo:Object.freeze({ theme:'desejo, medo e dependência tornados visíveis', need:'reconhecer o preço do vínculo e a parte ainda escolhível', phase:'confrontation', intensity:3, roles:['apego', 'sombra', 'libertação'] }),
  torre:Object.freeze({ theme:'verdade que derruba uma forma insustentável', need:'proteger o que está vivo e abandonar a fachada', phase:'rupture', intensity:3, roles:['ruptura', 'revelação', 'reconstrução'] }),
  estrela:Object.freeze({ theme:'esperança que nasce depois da ruptura', need:'recuperar confiança sem negar a ferida', phase:'healing', intensity:3, roles:['cura', 'esperança', 'renovação'] }),
  lua:Object.freeze({ theme:'travessia entre intuição, medo e projeção', need:'verificar impressões sem exigir certeza prematura', phase:'uncertainty', intensity:3, roles:['mistério', 'medo', 'sensibilidade'] }),
  sol:Object.freeze({ theme:'clareza que permite alegria e presença', need:'assumir o que é verdadeiro sem diminuir a própria luz', phase:'revelation', intensity:3, roles:['clareza', 'vitalidade', 'celebração'] }),
  julgamento:Object.freeze({ theme:'chamado que relê o passado e libera resposta', need:'unir responsabilidade, reparação e perdão', phase:'awakening', intensity:3, roles:['chamado', 'avaliação', 'renascimento'] }),
  mundo:Object.freeze({ theme:'conclusão que integra a jornada inteira', need:'reconhecer completude e atravessar a última fronteira', phase:'completion', intensity:3, roles:['conclusão', 'integração', 'passagem'] })
});

const SUIT_WISDOM = Object.freeze({
  paus:Object.freeze({ theme:'desejo, criação, coragem e vocação', need:'dar direção e continuidade ao impulso', domain:'ação', pace:'rápido' }),
  copas:Object.freeze({ theme:'sentimento, vínculo, imaginação e memória', need:'distinguir emoção, projeção e reciprocidade', domain:'afeto', pace:'orgânico' }),
  espadas:Object.freeze({ theme:'pensamento, palavra, conflito e decisão', need:'usar clareza sem transformar verdade em violência', domain:'mente', pace:'variável' }),
  ouros:Object.freeze({ theme:'corpo, trabalho, dinheiro, recurso e permanência', need:'construir valor que possa ser sustentado', domain:'matéria', pace:'gradual' })
});

const RANK_WISDOM = Object.freeze({
  as:Object.freeze({ stage:'semente', phase:'opening', need:'começar em escala verdadeira', intensity:1, roles:['início', 'potencial'] }),
  dois:Object.freeze({ stage:'polaridade', phase:'choice', need:'relacionar dois lados sem apagar a diferença', intensity:1, roles:['escolha', 'equilíbrio'] }),
  tres:Object.freeze({ stage:'primeira forma', phase:'growth', need:'permitir que relação ou criação ganhe estrutura', intensity:1, roles:['crescimento', 'expressão'] }),
  quatro:Object.freeze({ stage:'estrutura', phase:'stability', need:'proteger sem transformar estabilidade em imobilidade', intensity:1, roles:['base', 'limite'] }),
  cinco:Object.freeze({ stage:'ruptura da forma', phase:'conflict', need:'atravessar perda ou conflito sem perder consciência', intensity:2, roles:['crise', 'desafio'] }),
  seis:Object.freeze({ stage:'reorganização', phase:'transition', need:'restaurar fluxo, proporção ou direção', intensity:1, roles:['passagem', 'reparação'] }),
  sete:Object.freeze({ stage:'prova', phase:'assessment', need:'examinar opções, resistência e investimento', intensity:2, roles:['teste', 'discernimento'] }),
  oito:Object.freeze({ stage:'movimento concentrado', phase:'movement', need:'transformar repetição ou força em domínio', intensity:2, roles:['movimento', 'prática'] }),
  nove:Object.freeze({ stage:'maturação', phase:'culmination', need:'sustentar o que amadureceu sem se fechar', intensity:2, roles:['maturidade', 'limiar'] }),
  dez:Object.freeze({ stage:'consequência completa', phase:'completion', need:'encerrar, integrar ou redistribuir o excesso', intensity:2, roles:['resultado', 'fim'] }),
  valete:Object.freeze({ stage:'aprendizagem', phase:'opening', need:'receber a novidade com curiosidade e prática', intensity:1, roles:['mensagem', 'aprendiz'] }),
  cavaleiro:Object.freeze({ stage:'movimento', phase:'movement', need:'dar direção à intensidade antes que ela ultrapasse o propósito', intensity:2, roles:['busca', 'avanço'] }),
  rainha:Object.freeze({ stage:'domínio interior', phase:'mastery', need:'governar a força por presença, receptividade e limite', intensity:2, roles:['maturidade', 'interiorização'] }),
  rei:Object.freeze({ stage:'domínio exterior', phase:'mastery', need:'assumir responsabilidade pelo impacto do próprio poder', intensity:2, roles:['autoridade', 'realização'] })
});

const DOMAIN_FOCUS = Object.freeze({
  love:Object.freeze({
    title:'amor', boundary:'sentimento precisa aparecer em reciprocidade, atitude e respeito',
    fire:'desejo, iniciativa e direção do encontro', water:'sentimento, vínculo e reciprocidade', air:'conversa, escolha e coerência', earth:'presença, compromisso e sustentação', spirit:'sentido maior e passagem vivida pelo vínculo'
  }),
  relationship:Object.freeze({
    title:'relacionamento', boundary:'nenhuma ligação permanece inteira quando uma pessoa precisa desaparecer para conservá-la',
    fire:'movimento e vontade de construir juntos', water:'troca emocional e capacidade de acolher', air:'acordo, verdade e comunicação', earth:'rotina, compromisso e realidade compartilhada', spirit:'ciclo e aprendizado central da relação'
  }),
  work:Object.freeze({
    title:'trabalho', boundary:'esforço precisa produzir direção e não apenas ocupação',
    fire:'iniciativa, vocação e liderança', water:'pertencimento, motivação e relações profissionais', air:'estratégia, comunicação e decisão', earth:'resultado, recurso e continuidade', spirit:'chamado e mudança de ciclo profissional'
  }),
  money:Object.freeze({
    title:'dinheiro', boundary:'desejo precisa caber nos recursos, riscos e compromissos reais',
    fire:'coragem para gerar e negociar valor', water:'segurança emocional ligada ao dinheiro', air:'planejamento, contrato e critério', earth:'recurso, reserva, dívida e sustentação', spirit:'mudança de relação com prosperidade e escassez'
  }),
  family:Object.freeze({
    title:'família', boundary:'cuidar não exige carregar sozinho nem aceitar o que fere dignidade',
    fire:'autonomia e conflito de vontades', water:'afeto, memória e pertencimento', air:'conversa, verdade e padrão aprendido', earth:'responsabilidade, casa e legado', spirit:'ciclo geracional e consciência herdada'
  }),
  identity:Object.freeze({
    title:'identidade', boundary:'o momento pode afetar a pessoa sem possuir o direito de definir todo o seu valor',
    fire:'desejo, coragem e expressão pessoal', water:'sensibilidade, memória e autoacolhimento', air:'narrativa interior, crença e discernimento', earth:'corpo, rotina e valor vivido', spirit:'sentido, integração e passagem pessoal'
  }),
  change:Object.freeze({
    title:'mudança', boundary:'medo merece escuta, mas não precisa governar toda a travessia',
    fire:'primeiro passo e impulso de atravessar', water:'despedida emocional e adaptação', air:'nova interpretação e decisão', earth:'transição concreta e sustentação', spirit:'fim de ciclo e reposicionamento profundo'
  }),
  decision:Object.freeze({
    title:'decisão', boundary:'fato, medo, desejo e hipótese precisam falar com vozes diferentes',
    fire:'coragem para escolher e agir', water:'impacto emocional da escolha', air:'critério, evidência e consequência', earth:'viabilidade e custo real', spirit:'direção que reorganiza a jornada'
  }),
  spirituality:Object.freeze({
    title:'espiritualidade', boundary:'o símbolo pode iluminar a consciência sem ocupar o lugar da realidade e da escolha',
    fire:'fé transformada em atitude', water:'sensibilidade e vínculo com o sagrado', air:'discernimento e linguagem espiritual', earth:'prática, corpo e presença', spirit:'propósito, passagem e integração'
  }),
  general:Object.freeze({
    title:'momento atual', boundary:'a carta ilumina uma direção sem decidir a vida da pessoa',
    fire:'ação e desejo', water:'sentimento e vínculo', air:'pensamento e escolha', earth:'realidade e sustentação', spirit:'ciclo e significado'
  })
});

const POSITION_RULES = Object.freeze({
  origin:Object.freeze({ title:'origem', pattern:/\b(?:origem|raiz|causa|fundamento)\b/, function:'explicar de onde o padrão nasceu' }),
  past:Object.freeze({ title:'passado', pattern:/\b(?:passado|antes|heran[cç]a)\b/, function:'mostrar o que ainda condiciona o presente' }),
  present:Object.freeze({ title:'presente', pattern:/\b(?:presente|agora|momento atual|situa[cç][aã]o)\b/, function:'revelar a força que ocupa o centro agora' }),
  obstacle:Object.freeze({ title:'obstáculo', pattern:/\b(?:obst[aá]culo|bloqueio|desafio|contra)\b/, function:'mostrar como a força da carta perde proporção ou passagem' }),
  hidden:Object.freeze({ title:'oculto', pattern:/\b(?:oculto|invis[ií]vel|n[aã]o vejo|segredo)\b/, function:'revelar o fator ainda não reconhecido' }),
  desire:Object.freeze({ title:'desejo', pattern:/\b(?:desejo|esperan[cç]a|quero|aspira[cç][aã]o)\b/, function:'mostrar o que a pessoa tenta aproximar' }),
  fear:Object.freeze({ title:'medo', pattern:/\b(?:medo|receio|temor|evito)\b/, function:'mostrar o que parece ameaçar segurança ou identidade' }),
  advice:Object.freeze({ title:'conselho', pattern:/\b(?:conselho|orienta[cç][aã]o|como agir|o que fazer)\b/, function:'converter o aprendizado da carta em escolha praticável' }),
  choice:Object.freeze({ title:'escolha', pattern:/\b(?:escolha|decis[aã]o|caminho|op[cç][aã]o)\b/, function:'localizar o critério que devolve autoria' }),
  future:Object.freeze({ title:'futuro', pattern:/\b(?:futuro|tend[eê]ncia|pr[oó]ximo|adiante)\b/, function:'mostrar a direção provável se o padrão continuar' }),
  outcome:Object.freeze({ title:'resultado', pattern:/\b(?:resultado|desfecho|consequ[eê]ncia|s[ií]ntese)\b/, function:'integrar a consequência construída pela mesa' }),
  birth:Object.freeze({ title:'o que nasce', pattern:/\b(?:nasce|nascimento|come[cç]a|emerge|novo)\b/, function:'mostrar a forma que tenta ganhar vida' }),
  ending:Object.freeze({ title:'o que termina', pattern:/\b(?:termina|terminar|terminou|fim|encerra|encerrar|precisa morrer|deixar ir)\b/, function:'mostrar a forma cuja função se completou' }),
  freewill:Object.freeze({ title:'livre-arbítrio', pattern:/\b(?:livre arb[ií]trio|minha parte|posso mudar|poder pessoal)\b/, function:'localizar a escolha ainda disponível' }),
  general:Object.freeze({ title:'posição revelada', pattern:/(?!)/, function:'expressar a carta dentro do momento apresentado' })
});

const TERRITORY_PATTERNS = Object.freeze({
  relationship:/\b(?:relacionamento|rela[cç][aã]o|casamento|namoro|parceria)\b/,
  love:/\b(?:amor|amar|paix[aã]o|romance|afetiv|saudade|ex)\b/,
  work:/\b(?:trabalho|carreira|emprego|profiss[aã]|projeto|neg[oó]cio)\b/,
  money:/\b(?:dinheiro|financeir|renda|d[ií]vida|prosper|recurso)\b/,
  family:/\b(?:familia|familiar|mae|pai|filh|irma|irmao|casa)\b/,
  identity:/\b(?:identidade|autoestima|quem sou|meu valor|confian[cç]a em mim)\b/,
  change:/\b(?:mudan[cç]a|recome[cç]|transi[cç][aã]o|partir|mudar)\b/,
  decision:/\b(?:decis[aã]o|escolha|devo|caminho|op[cç][aã]o)\b/,
  spirituality:/\b(?:espiritual|alma|f[eé]|prop[oó]sito|sagrado)\b/
});

const START_KEYS = new Set(['louco', 'mago', 'as-de-paus', 'as-de-copas', 'as-de-espadas', 'as-de-ouros']);
const END_KEYS = new Set(['morte', 'julgamento', 'mundo', 'dez-de-paus', 'dez-de-copas', 'dez-de-espadas', 'dez-de-ouros']);
const TURN_KEYS = new Set(['roda', 'enforcado', 'morte', 'diabo', 'torre', 'julgamento']);
const DECISION_KEYS = new Set(['enamorados', 'carro', 'justica', 'dois-de-paus', 'dois-de-espadas', 'sete-de-copas']);
const STABILITY_KEYS = new Set(['imperador', 'hierofante', 'forca', 'temperanca', 'quatro-de-paus', 'quatro-de-copas', 'quatro-de-espadas', 'quatro-de-ouros']);

function freezeRecord(record) {
  return Object.freeze(Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Object.freeze(value)])));
}

function classifyTerritory(value) {
  const text = normalize(value);
  return Object.keys(TERRITORY_PATTERNS).find(key => TERRITORY_PATTERNS[key].test(text)) || 'general';
}

function classifyPosition(value) {
  const text = normalize(value);
  return Object.keys(POSITION_RULES).find(key => key !== 'general' && POSITION_RULES[key].pattern.test(text)) || 'general';
}

function narrativeRoles(identity, taxonomy) {
  const roles = new Set(taxonomy.roles || []);
  if (START_KEYS.has(identity.key)) roles.add('abertura');
  if (END_KEYS.has(identity.key)) roles.add('encerramento');
  if (TURN_KEYS.has(identity.key)) roles.add('transformação');
  if (DECISION_KEYS.has(identity.key)) roles.add('decisão');
  if (STABILITY_KEYS.has(identity.key)) roles.add('estabilidade');
  if (!roles.size) roles.add('desenvolvimento');
  return Object.freeze([...roles]);
}

function domainProfile(identity, key) {
  const domain = DOMAIN_FOCUS[key] || DOMAIN_FOCUS.general;
  const focus = domain[identity.element] || domain.spirit;
  return Object.freeze({
    key,
    title:domain.title,
    focus,
    truth:identity.truth,
    possibility:identity.consequence,
    risk:identity.pressure,
    action:identity.gesture,
    boundary:domain.boundary,
    evidenceRequired:key === 'love' || key === 'relationship'
      ? 'reciprocidade precisa aparecer em atitudes observáveis'
      : 'a orientação precisa encontrar fatos e consequências na vida real'
  });
}

function positionProfile(identity, key) {
  const rule = POSITION_RULES[key] || POSITION_RULES.general;
  const shared = { key, title:rule.title, function:rule.function };
  const profiles = {
    origin:{ ...shared, emphasis:identity.pressure, resource:identity.truth, movement:'reconhecer a raiz antes de repetir a consequência' },
    past:{ ...shared, emphasis:identity.consequence, resource:identity.truth, movement:'separar aprendizado vivo de padrão herdado' },
    present:{ ...shared, emphasis:identity.pressure, resource:identity.gesture, movement:'responder conscientemente à força que já está ativa' },
    obstacle:{ ...shared, emphasis:identity.pressure, resource:identity.gesture, movement:'retirar excesso, distorção ou imobilidade da expressão da carta' },
    hidden:{ ...shared, emphasis:identity.truth, resource:identity.scene, movement:'tornar reconhecível aquilo que já influencia a situação' },
    desire:{ ...shared, emphasis:identity.consequence, resource:identity.truth, movement:'distinguir desejo verdadeiro de idealização ou compensação' },
    fear:{ ...shared, emphasis:identity.pressure, resource:identity.truth, movement:'dar medida ao medo sem lhe entregar o governo da escolha' },
    advice:{ ...shared, emphasis:identity.gesture, resource:identity.truth, movement:'transformar o símbolo em atitude possível e verificável' },
    choice:{ ...shared, emphasis:identity.truth, resource:identity.gesture, movement:'usar a verdade da carta como critério de decisão' },
    future:{ ...shared, emphasis:identity.consequence, resource:identity.gesture, movement:'ler consequência como tendência condicionada pelo padrão atual' },
    outcome:{ ...shared, emphasis:identity.consequence, resource:identity.truth, movement:'avaliar se o resultado integra ou repete o conflito da mesa' },
    birth:{ ...shared, emphasis:identity.consequence, resource:identity.gesture, movement:'nutrir a possibilidade sem exigir que ela nasça pronta' },
    ending:{ ...shared, emphasis:identity.pressure, resource:identity.truth, movement:'reconhecer o que completou sua função e liberar energia' },
    freewill:{ ...shared, emphasis:identity.gesture, resource:identity.truth, movement:'localizar a ação que ainda pode alterar a direção' },
    general:{ ...shared, emphasis:identity.truth, resource:identity.gesture, movement:'unir compreensão e gesto dentro do momento apresentado' }
  };
  return Object.freeze(profiles[key] || profiles.general);
}

function temporalProfile(identity, taxonomy) {
  const phase = taxonomy.phase || 'development';
  return Object.freeze({
    phase,
    pace:taxonomy.pace || ELEMENT_WISDOM[identity.element]?.pace || 'variável',
    currentPattern:identity.pressure,
    integratedDirection:identity.consequence,
    choiceThatChangesDirection:identity.gesture,
    futureIsConditional:true
  });
}

function taxonomyFor(identity) {
  if (identity.source === 'major') return ARCANA_WISDOM[identity.key] || Object.freeze({
    theme:identity.truth, need:ELEMENT_WISDOM[identity.element]?.need, phase:'development', intensity:3, roles:['arcano maior']
  });
  const rank = RANK_WISDOM[identity.rank] || RANK_WISDOM.as;
  const suit = SUIT_WISDOM[identity.suit] || SUIT_WISDOM.ouros;
  return Object.freeze({
    theme:`${rank.stage} no território de ${suit.theme}`,
    need:`${rank.need}; ${suit.need}`,
    phase:rank.phase,
    pace:suit.pace,
    intensity:rank.intensity,
    roles:Object.freeze([...rank.roles, suit.domain])
  });
}

export function tarotKnowledge(card) {
  const identity = tarotIdentity(card);
  const taxonomy = taxonomyFor(identity);
  const element = ELEMENT_WISDOM[identity.element] || ELEMENT_WISDOM.spirit;
  const domains = Object.fromEntries(Object.keys(DOMAIN_FOCUS).map(key => [key, domainProfile(identity, key)]));
  const positions = Object.fromEntries(Object.keys(POSITION_RULES).map(key => [key, positionProfile(identity, key)]));
  return Object.freeze({
    engine:KNOWLEDGE_ENGINE_NAME,
    version:KNOWLEDGE_ENGINE_VERSION,
    card:Object.freeze({
      key:identity.key,
      name:clean(card?.name, 100) || identity.title,
      source:identity.source,
      arcana:identity.arcana || '',
      suit:identity.suit || '',
      rank:identity.rank || '',
      element:identity.element
    }),
    core:Object.freeze({
      theme:taxonomy.theme,
      truth:identity.truth,
      scene:identity.scene,
      humanNeed:taxonomy.need || element.need,
      conflict:identity.pressure,
      movement:identity.gesture,
      consequence:identity.consequence
    }),
    light:Object.freeze({ expression:identity.consequence, resource:element.gift, integratedAction:identity.gesture }),
    shadow:Object.freeze({ expression:identity.pressure, risk:element.shadow, unmetNeed:taxonomy.need || element.need }),
    advice:Object.freeze({ action:identity.gesture, criterion:identity.truth, concrete:true }),
    warning:Object.freeze({ signal:identity.pressure, neverTreatAsSentence:true }),
    temporal:temporalProfile(identity, taxonomy),
    intensity:taxonomy.intensity || (identity.source === 'major' ? 3 : 1),
    agency:element.agency,
    narrativeRoles:narrativeRoles(identity, taxonomy),
    domains:freezeRecord(domains),
    positions:freezeRecord(positions),
    concreteSignals:Object.freeze([identity.scene, identity.pressure, identity.gesture, identity.consequence]),
    integrity:Object.freeze({
      tarotGrounded:true,
      identityPreserved:true,
      privateFactsInvented:false,
      mindReading:false,
      finalProse:false
    })
  });
}

export function tarotKnowledgeForContext(card, { position = '', question = '', territory = '' } = {}) {
  const knowledge = tarotKnowledge(card);
  const territoryKey = DOMAIN_FOCUS[territory] ? territory : classifyTerritory(question);
  const positionKey = classifyPosition(position);
  return Object.freeze({
    knowledge,
    territory:knowledge.domains[territoryKey],
    position:knowledge.positions[positionKey],
    context:Object.freeze({
      territory:territoryKey,
      position:positionKey,
      question:clean(question, 700),
      positionLabel:clean(position, 100)
    })
  });
}

export function tarotKnowledgeDeck(cards = []) {
  return Object.freeze((Array.isArray(cards) ? cards : []).filter(Boolean).map(tarotKnowledge));
}

export function validateTarotKnowledge(cards = []) {
  const deck = tarotKnowledgeDeck(cards);
  const keys = deck.map(item => item.card.key);
  const requiredDomains = Object.keys(DOMAIN_FOCUS);
  const requiredPositions = Object.keys(POSITION_RULES);
  const incomplete = deck.filter(item =>
    !item.core.truth || !item.core.conflict || !item.core.movement || !item.core.consequence ||
    requiredDomains.some(key => !item.domains[key]) ||
    requiredPositions.some(key => !item.positions[key])
  ).map(item => item.card.name);
  return Object.freeze({
    cards:deck.length,
    uniqueKeys:new Set(keys).size,
    domainsPerCard:requiredDomains.length,
    positionsPerCard:requiredPositions.length,
    incomplete:Object.freeze(incomplete),
    valid:deck.length === 78 && new Set(keys).size === 78 && incomplete.length === 0
  });
}

export function tarotKnowledgeCapacity() {
  return Object.freeze({
    cards:78,
    domains:Object.keys(DOMAIN_FOCUS).length,
    positions:Object.keys(POSITION_RULES).length,
    majorArchetypes:Object.keys(ARCANA_WISDOM).length,
    suits:Object.keys(SUIT_WISDOM).length,
    ranks:Object.keys(RANK_WISDOM).length,
    writesVisibleProse:false,
    preservesExistingIdentity:true,
    rule:'primeiro compreender a carta; somente depois permitir que Whit fale'
  });
}
