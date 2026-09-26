/*
 * DIVINA BRUXA 3.8.0 · MOTOR DA MENTE
 *
 * Inteligência local de compreensão e navegação para Whit. O motor organiza o
 * pedido, reconhece cartas/conteúdos/rotas e devolve escolhas clicáveis. Ele
 * não executa ações privadas, não lê outras áreas em silêncio e não toma a
 * decisão pela pessoa.
 */

import {
  LOVE_ENGINE_NAME,
  loveHash,
  loveResponse,
  normalizeEmotionalText,
  secureLoveSeed
} from './love-engine-v370.js';

export const MIND_ENGINE_NAME = 'MENTE';
export const MIND_ENGINE_VERSION = '3.8.0';
export const MIND_ENGINE_LABEL = 'PENSAMENTO LOCAL · MAPA VIVO';
export const MIND_STEPS = Object.freeze([
  'observar o pedido',
  'compreender a intenção',
  'verificar contexto e segurança',
  'comparar caminhos possíveis',
  'devolver escolhas claras'
]);
export const MIND_GUARDRAILS = Object.freeze([
  'não agir sem pedido explícito',
  'não ler áreas privadas em silêncio',
  'não inventar páginas ou cartas',
  'não confundir orientação com certeza',
  'manter a decisão com a pessoa'
]);

const ROUTE_RULES = Object.freeze({
  home:Object.freeze({
    label:'Início',
    terms:['inicio', 'home', 'tela inicial', 'orbe principal', 'voltar para a orbe', 'origem'],
    purpose:'voltar à Orbe central'
  }),
  tarot:Object.freeze({
    label:'Tarot Livre',
    terms:['tarot livre', 'tirar uma carta', 'tirar carta', 'revelar carta', 'carta aleatoria', 'baralho livre', 'tarot agora'],
    purpose:'revelar cartas livremente, sem repetição'
  }),
  'carta-do-dia':Object.freeze({
    label:'Carta do Dia',
    terms:['carta do dia', 'carta de hoje', 'energia de hoje', 'ritual diario', 'ritual de hoje', 'aurora'],
    purpose:'abrir o encontro simbólico de hoje'
  }),
  tiragens:Object.freeze({
    label:'Tiragens',
    terms:['tiragens', 'tiragem', 'cruz celta', 'mesa real', 'tres cartas', '3 cartas', 'pergunta ao tarot', 'varias cartas'],
    purpose:'organizar uma pergunta em várias posições'
  }),
  escola:Object.freeze({
    label:'Escola',
    terms:['escola', 'aprender tarot', 'estudar tarot', 'aula', 'aulas', 'curso', 'quiz', 'exercicio', 'estudar cartas'],
    purpose:'aprender Tarot com aulas e exercícios'
  }),
  biblioteca:Object.freeze({
    label:'Biblioteca',
    terms:['biblioteca', '78 cartas', 'todas as cartas', 'catalogo de cartas', 'pesquisar carta', 'guia de tarot', 'artigo', 'significado da carta'],
    purpose:'consultar as cartas e os guias oficiais'
  }),
  diario:Object.freeze({
    label:'Diário',
    terms:['diario', 'anotar', 'anoto', 'registrar', 'registro', 'escrever sobre', 'escrevo', 'guardar pensamento', 'guardar meus pensamentos', 'meu registro', 'pensamentos', 'reflexao', 'sonho', 'humor'],
    purpose:'registrar uma reflexão em espaço privado'
  }),
  whit:Object.freeze({
    label:'Whit',
    terms:['whit', 'conversar', 'desabafar', 'ser escutada', 'ser ouvido', 'ser ouvida', 'companhia', 'apoio'],
    purpose:'continuar esta conversa com presença'
  }),
  consultas:Object.freeze({
    label:'Consultas',
    terms:['consulta', 'consultas', 'tarologa', 'tarologo', 'leitura profissional', 'atendimento', 'marcar leitura', 'agendar leitura'],
    purpose:'conhecer as consultas humanas disponíveis'
  }),
  premium:Object.freeze({
    label:'Premium',
    terms:['premium', 'plano', 'planos', 'recursos premium', 'comprar premium', 'assinatura'],
    purpose:'conhecer recursos, limites e condições'
  }),
  conta:Object.freeze({
    label:'Conta',
    terms:['conta', 'entrar', 'login', 'cadastro', 'senha', 'sessao', 'meus dados', 'restaurar compra', 'sair da conta'],
    purpose:'entrar, proteger ou administrar a conta'
  }),
  loja:Object.freeze({
    label:'Loja',
    terms:['loja', 'comprar baralho', 'comprar tarot', 'produto', 'produtos', 'presente', 'amazon', 'compras'],
    purpose:'explorar produtos e escolhas da Loja'
  }),
  musica:Object.freeze({
    label:'Música',
    terms:['musica', 'musicas', 'album', 'albuns', 'spotify', 'ouvir musica', 'ouvir album', 'cancao', 'cancoes', 'hercules dx'],
    purpose:'entrar no universo musical'
  }),
  videos:Object.freeze({
    label:'Vídeos',
    terms:['video', 'videos', 'memoji', 'youtube', 'assistir video', 'assistir episodio', 'de frente com o tarot', 'episodio'],
    purpose:'assistir aos vídeos e Memojis publicados'
  }),
  skins:Object.freeze({
    label:'Skins',
    terms:['skin', 'skins', 'aparencia da orbe', 'mudar a orbe', 'tema', 'temas', 'personalizar', 'cor da orbe'],
    purpose:'personalizar a atmosfera da Orbe'
  })
});

const COMMAND_PATTERN = /\b(?:abra|abre|abrir|acesse|acessar|entre|entrar|ir|leve|leva|me\s+leve|me\s+leva|mostre|mostrar|muestre|open|show|quero\s+ver|quero\s+abrir|link|pagina)\b/;
const HELP_PATTERN = /\b(?:ajuda|ajude|comandos?|o\s+que\s+voce\s+faz|onde\s+posso|por\s+onde\s+comeco|nao\s+sei\s+onde)\b/;
const CARD_PATTERN = /\b(?:carta|arcano|tarot|pagina|mostre|mostrar|abrir|link)\b/;
const GUIDE_PATTERN = /\b(?:como|guia|artigo|aprender|estudar|explica|explicacao|metodo|etica)\b/;

const WORD_NUMBERS = Object.freeze({
  1:'as', 2:'dois', 3:'tres', 4:'quatro', 5:'cinco', 6:'seis', 7:'sete', 8:'oito', 9:'nove', 10:'dez'
});

const EMOTIONAL_PATHS = Object.freeze({
  affection:['diario', 'tarot', 'biblioteca'],
  joy:['carta-do-dia', 'musica', 'diario'],
  longing:['diario', 'tarot', 'musica'],
  sadness:['diario', 'carta-do-dia', 'musica'],
  fear:['diario', 'biblioteca', 'carta-do-dia'],
  anger:['diario', 'tarot', 'musica'],
  confusion:['biblioteca', 'escola', 'tiragens'],
  loneliness:['diario', 'musica', 'carta-do-dia'],
  selfworth:['diario', 'carta-do-dia', 'musica'],
  exhaustion:['musica', 'diario', 'carta-do-dia'],
  hope:['carta-do-dia', 'tarot', 'escola'],
  presence:['tarot', 'biblioteca', 'escola']
});

const MODE_PATHS = Object.freeze({
  escuta:['diario', 'whit', 'carta-do-dia'],
  clareza:['biblioteca', 'escola', 'tiragens'],
  integracao:['tarot', 'diario', 'escola']
});

const MIND_OPENINGS = Object.freeze({
  card:[
    'Eu reconheci a carta que você procura e conferi o caminho antes de responder.',
    'A MENTE encontrou a identidade exata da carta, sem adivinhar outra no lugar.',
    'Eu organizei o pedido e cheguei à página oficial desta carta.'
  ],
  cards:[
    'Seu pedido pode apontar para mais de uma carta; por isso preservei as opções em vez de escolher por você.',
    'Encontrei um pequeno conjunto de cartas possíveis e mantive cada caminho separado.',
    'A MENTE percebeu mais de uma correspondência legítima e não vai fingir uma certeza.'
  ],
  guide:[
    'Eu encontrei um conteúdo que responde diretamente ao que você quer compreender.',
    'A Biblioteca já possui um caminho específico para esta pergunta.',
    'Eu comparei os guias e separei o mais próximo do seu pedido.'
  ],
  route:[
    'Eu compreendi o destino e preparei o caminho mais direto.',
    'Seu pedido corresponde a uma realidade específica do site.',
    'A MENTE organizou o mapa e encontrou a passagem certa.'
  ],
  help:[
    'Eu posso transformar palavras comuns em caminhos claros pelo universo da Divina Bruxa.',
    'Você não precisa decorar o menu; pode me dizer o que deseja fazer.',
    'Meu papel aqui é compreender o pedido e aproximar o conteúdo certo.'
  ],
  support:[
    'Pelo que você trouxe, estes caminhos podem apoiar o próximo passo sem decidir por você.',
    'Eu comparei o momento com o mapa do site e separei opções que permanecem livres.',
    'Não existe um único destino obrigatório; estes são os caminhos mais coerentes com a sua frase.'
  ]
});

const MIND_CLOSINGS = Object.freeze([
  'Você escolhe se quer atravessar algum deles.',
  'Nada será aberto ou alterado sem o seu toque.',
  'O mapa é meu apoio; a direção continua sendo sua.',
  'Use apenas o caminho que fizer sentido agora.',
  'Eu ofereço a ponte e preservo sua decisão inteira.'
]);

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const freezeList = values => Object.freeze(values.map(value => Object.freeze(value)));

function mix(seed, ...parts) {
  return loveHash([seed, ...parts].join('¦'));
}

function choose(values, seed, key) {
  return values[mix(seed, key) % values.length];
}

function escaped(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsPhrase(text, phrase) {
  const normalized = normalizeEmotionalText(phrase);
  if (!normalized) return false;
  return new RegExp(`(?:^|\\b)${escaped(normalized).replaceAll(' ', '\\s+')}(?:\\b|$)`).test(text);
}

function tokens(value) {
  return new Set(normalizeEmotionalText(value).split(/\s+/).filter(token => token.length > 1 || /^\d+$/.test(token)));
}

function userHistory(history) {
  return (Array.isArray(history) ? history : [])
    .filter(item => typeof item === 'string' || item?.role === 'user')
    .map(item => normalizeEmotionalText(typeof item === 'string' ? item : item.text))
    .filter(Boolean)
    .slice(-4);
}

function localizedNames(card) {
  const names = card?.names && typeof card.names === 'object' ? Object.values(card.names) : [];
  return [...new Set([card?.name, ...names].map(name => clean(name, 120)).filter(Boolean))];
}

function aliasesForCard(card) {
  const aliases = new Set();
  localizedNames(card).forEach(name => {
    const normalized = normalizeEmotionalText(name);
    aliases.add(normalized);
    if (card?.arcanaCode === 'major') aliases.add(normalized.replace(/^(?:o|a|os|as)\s+/, ''));
    const number = Number(card?.number);
    if (Number.isInteger(number) && number >= 1 && number <= 10 && card?.suit) {
      aliases.add(`${WORD_NUMBERS[number]} de ${normalizeEmotionalText(card.suit)}`);
    }
  });
  const canonical = normalizeEmotionalText(String(card?.canonicalId || '').replace(/^\d{2}-/, '').replaceAll('-', ' '));
  if (canonical) aliases.add(canonical);
  return [...aliases].filter(Boolean);
}

function scoreAlias(text, alias) {
  if (!alias) return 0;
  if (containsPhrase(text, alias)) return 120 + alias.split(' ').length * 8;
  const source = tokens(text);
  const target = tokens(alias);
  if (!target.size) return 0;
  const overlap = [...target].filter(token => source.has(token)).length;
  if (!overlap) return 0;
  return Math.round((overlap / target.size) * 70) + overlap * 5;
}

export function cardPublicHref(card) {
  const canonicalId = clean(card?.canonicalId, 100);
  if (!/^\d{2}-[a-z0-9-]+$/.test(canonicalId)) return '';
  const slug = card?.arcanaCode === 'major' ? canonicalId : canonicalId.replace(/^\d{2}-/, '');
  return `carta-${slug}.html`;
}

export function findCardMatches(input, cards = [], limit = 4) {
  const text = normalizeEmotionalText(input);
  if (!text || !Array.isArray(cards)) return Object.freeze({ matches:Object.freeze([]), total:0, exact:false });
  const ranked = cards.map(card => {
    const aliases = aliasesForCard(card);
    const scores = aliases.map(alias => scoreAlias(text, alias));
    const majorNumber = card?.arcanaCode === 'major' && Number.isInteger(card?.number)
      && new RegExp(`\\barcano\\s+(?:numero\\s+)?${card.number}\\b`).test(text) ? 180 : 0;
    const queryExact = aliases.includes(text)
      || aliases.some(alias => text === `carta ${alias}` || text === `arcano ${alias}`);
    return { card, score:Math.max(majorNumber, ...scores, 0), queryExact };
  }).filter(item => item.score >= 48)
    .sort((a, b) => b.score - a.score || Number(a.card?.id || 0) - Number(b.card?.id || 0));
  const strongest = ranked[0]?.score || 0;
  const close = ranked.filter(item => item.score >= Math.max(48, strongest - 18));
  const explicit = CARD_PATTERN.test(text);
  const exact = strongest >= 120;
  const meaningful = exact || explicit || close.length <= 4;
  const selected = meaningful ? close.slice(0, Math.max(1, limit)) : [];
  return Object.freeze({
    matches:freezeList(selected.map(item => ({
      card:item.card,
      score:item.score,
      queryExact:item.queryExact,
      href:cardPublicHref(item.card)
    })).filter(item => item.href)),
    total:meaningful ? close.length : ranked.length,
    exact
  });
}

function guideScore(text, guide) {
  const title = normalizeEmotionalText(guide?.title);
  const description = normalizeEmotionalText(guide?.description);
  const category = normalizeEmotionalText(guide?.category);
  if (!title) return 0;
  let score = containsPhrase(text, title) ? 150 : 0;
  const inputTokens = tokens(text);
  const titleTokens = tokens(title);
  const descriptionTokens = tokens(description);
  for (const token of titleTokens) if (inputTokens.has(token)) score += 18;
  for (const token of descriptionTokens) if (inputTokens.has(token)) score += 4;
  if (category && containsPhrase(text, category)) score += 10;
  return score;
}

function safePageHref(value) {
  const href = clean(value, 180);
  return /^[a-z0-9][a-z0-9-]*\.html$/.test(href) ? href : '';
}

export function findGuideMatches(input, guides = [], limit = 3) {
  const text = normalizeEmotionalText(input);
  if (!text || !Array.isArray(guides)) return Object.freeze([]);
  return freezeList(guides.map(guide => ({ guide, score:guideScore(text, guide) }))
    .filter(item => item.score >= 26 && safePageHref(item.guide?.href))
    .sort((a, b) => b.score - a.score || String(a.guide?.title).localeCompare(String(b.guide?.title), 'pt-BR'))
    .slice(0, limit)
    .map(item => ({ ...item, href:safePageHref(item.guide.href) })));
}

function routeScore(text, route, world) {
  const rule = ROUTE_RULES[route];
  if (!rule) return 0;
  let score = 0;
  for (const term of rule.terms) {
    if (containsPhrase(text, term)) score += 24 + term.split(' ').length * 8;
  }
  const label = normalizeEmotionalText(world?.label || rule.label);
  const title = normalizeEmotionalText(world?.title || '');
  if (label && containsPhrase(text, label)) score += 34;
  if (title && title !== label && containsPhrase(text, title)) score += 28;
  return score;
}

function routeRanking(input, history, worlds) {
  const current = normalizeEmotionalText(input);
  const past = userHistory(history);
  return Object.keys(ROUTE_RULES).map(route => {
    const world = worlds?.[route];
    const currentScore = routeScore(current, route, world);
    let score = currentScore * 4;
    past.forEach((message, index) => {
      score += routeScore(message, route, world) * Math.pow(.42, past.length - index);
    });
    return { route, world, score, currentScore };
  }).filter(item => item.world && item.score > 0)
    .sort((a, b) => b.score - a.score || a.route.localeCompare(b.route));
}

function routeAction(route, worlds, reason = '') {
  const rule = ROUTE_RULES[route];
  const world = worlds?.[route];
  if (!rule || !world) return null;
  return Object.freeze({
    kind:'route',
    route,
    href:`#/${route}`,
    label:world.label || rule.label,
    description:reason || rule.purpose
  });
}

function cardAction(match) {
  const card = match?.card;
  const href = safePageHref(match?.href);
  if (!card || !href) return null;
  const position = Number.isInteger(card.id) ? `Carta ${String(card.id + 1).padStart(2, '0')}` : 'Carta oficial';
  return Object.freeze({
    kind:'card',
    href,
    label:localizedNames(card)[0] || 'Abrir carta',
    description:`${position} · ${card.arcana || 'Tarot'}`
  });
}

function guideAction(match) {
  const guide = match?.guide;
  const href = safePageHref(match?.href);
  if (!guide || !href) return null;
  return Object.freeze({
    kind:'guide',
    href,
    label:clean(guide.title, 90),
    description:`${clean(guide.category, 40) || 'Guia'} · ${clean(guide.description, 130)}`
  });
}

function distinctActions(actions, limit = 4) {
  const seen = new Set();
  const cleanActions = [];
  for (const action of actions) {
    if (!action?.href || seen.has(action.href)) continue;
    seen.add(action.href);
    cleanActions.push(action);
    if (cleanActions.length >= limit) break;
  }
  return freezeList(cleanActions);
}

function fallbackRoutes(profile, mode, worlds) {
  const order = [
    ...(EMOTIONAL_PATHS[profile?.primary] || EMOTIONAL_PATHS.presence),
    ...(MODE_PATHS[mode] || MODE_PATHS.escuta),
    'tarot', 'biblioteca', 'escola'
  ];
  return distinctActions(order.map(route => routeAction(route, worlds)).filter(Boolean), 3);
}

function commandKind({ cardResult, guides, ranking, help }) {
  if (cardResult.matches.length === 1 && cardResult.exact) return 'card';
  if (cardResult.matches.length > 1) return 'cards';
  if (guides.length && guides[0].score >= (ranking[0]?.score || 0)) return 'guide';
  if (ranking.length) return 'route';
  if (help) return 'help';
  return 'support';
}

function confidenceFor(kind, cardResult, guides, ranking) {
  if (kind === 'card' && cardResult.exact) return 'alta';
  if (kind === 'cards') return 'media';
  if (kind === 'guide') return guides[0]?.score >= 80 ? 'alta' : 'media';
  if (kind === 'route') return ranking[0]?.score >= 180 ? 'alta' : 'media';
  return 'aberta';
}

function actionSentence(kind, actions) {
  if (!actions.length) return 'Neste momento, o cuidado importa mais do que qualquer passagem do site.';
  if (kind === 'card') return `O caminho direto é ${actions[0].label}.`;
  if (kind === 'cards') return `Separei ${actions.length} cartas possíveis para você reconhecer a que buscava.`;
  if (kind === 'guide') return `O conteúdo mais próximo é “${actions[0].label}”.`;
  if (kind === 'route') return `A passagem mais direta é ${actions[0].label}; deixei alternativas próximas quando elas ajudam.`;
  if (kind === 'help') return 'Você pode pedir uma carta pelo nome, uma área do site ou simplesmente dizer o que deseja fazer.';
  return 'As opções abaixo combinam com o que você trouxe, mas nenhuma delas é obrigatória.';
}

function mindLabel(kind, actions) {
  if (kind === 'card') return `Carta encontrada · ${actions[0]?.label || 'Tarot'}`;
  if (kind === 'cards') return `${actions.length} cartas possíveis · escolha preservada`;
  if (kind === 'guide') return `Conteúdo encontrado · ${actions[0]?.label || 'Biblioteca'}`;
  if (kind === 'route') return `Caminho encontrado · ${actions[0]?.label || 'Mapa vivo'}`;
  if (kind === 'help') return 'Mapa vivo · pronta para guiar';
  return 'Pensamento cuidadoso · caminhos abertos';
}

export function mindResponse(input, {
  mode = 'escuta',
  history = [],
  seed = secureLoveSeed(),
  cards = [],
  worlds = {},
  guides = []
} = {}) {
  const raw = clean(input, 700);
  const normalized = normalizeEmotionalText(raw);
  const explicitCommand = COMMAND_PATTERN.test(normalized);
  const love = loveResponse(raw, { mode, history, seed:`${seed}:amor` });
  const ritualSeed = mix(seed, normalized, mode, love.profile?.primary || 'presence');

  if (love.safety) {
    return Object.freeze({
      ...love,
      engine:`${LOVE_ENGINE_NAME}+${MIND_ENGINE_NAME}`,
      mindEngine:MIND_ENGINE_NAME,
      mindVersion:MIND_ENGINE_VERSION,
      mindLabel:'Segurança antes de qualquer caminho',
      intent:'safety',
      confidence:'alta',
      actions:Object.freeze([]),
      mindSignature:mix(ritualSeed, 'safety').toString(36).toUpperCase().padStart(7, '0')
    });
  }

  const contextualRanking = routeRanking(raw, history, worlds);
  const ranking = contextualRanking.some(item => item.currentScore > 0) || explicitCommand
    ? contextualRanking
    : [];
  const recent = userHistory(history).slice(-2);
  const followup = /\b(?:ela|essa|aquela|a\s+carta|o\s+arcano|link\s+dela|abra|mostre)\b/.test(normalized);
  const currentCards = findCardMatches(raw, cards, 4);
  const possibleCards = currentCards.matches.length || ranking.length || !followup
    ? currentCards
    : findCardMatches([normalized, ...recent].join(' '), cards, 4);
  const cardRequested = CARD_PATTERN.test(normalized)
    || COMMAND_PATTERN.test(normalized)
    || /\b(?:quero|sobre|conhecer|procuro|procurando)\b/.test(normalized)
    || possibleCards.matches.some(match => match.queryExact);
  const cardResult = cardRequested
    ? possibleCards
    : Object.freeze({ matches:Object.freeze([]), total:0, exact:false });
  const currentGuides = findGuideMatches(raw, guides, 3);
  const guideMatches = currentGuides.length || ranking.length || normalized.length > 32
    ? currentGuides
    : findGuideMatches([normalized, ...recent].join(' '), guides, 3);
  const help = HELP_PATTERN.test(normalized);
  let kind = commandKind({ cardResult, guides:guideMatches, ranking, help });

  if (cardResult.matches.length === 1 && (cardResult.exact || explicitCommand)) kind = 'card';
  if (guideMatches.length && GUIDE_PATTERN.test(normalized) && kind !== 'card' && kind !== 'cards') kind = 'guide';

  let actions = [];
  if (kind === 'card' || kind === 'cards') {
    actions = cardResult.matches.map(cardAction).filter(Boolean);
    if (!actions.length) kind = ranking.length ? 'route' : 'support';
  }
  if (kind === 'guide') {
    actions = guideMatches.map(guideAction).filter(Boolean);
    const related = ranking.find(item => ['biblioteca', 'escola', 'tiragens'].includes(item.route));
    if (related) actions.push(routeAction(related.route, worlds));
  }
  if (kind === 'route') {
    actions = ranking.slice(0, explicitCommand ? 1 : 3).map(item => routeAction(item.route, worlds)).filter(Boolean);
  }
  if (kind === 'help') {
    actions = ['tarot', 'carta-do-dia', 'escola', 'biblioteca'].map(route => routeAction(route, worlds)).filter(Boolean);
  }
  if (kind === 'support') actions = fallbackRoutes(love.profile, mode, worlds);
  actions = distinctActions(actions, 4);

  const opening = choose(MIND_OPENINGS[kind], ritualSeed, 'opening');
  const direction = actionSentence(kind, actions);
  const closing = choose(MIND_CLOSINGS, ritualSeed, 'closing');
  const thought = `${opening} ${direction} ${closing}`;
  const direct = ['card', 'cards', 'guide', 'route', 'help'].includes(kind);
  const loveFoundation = love.text.split(/\n\n+/)[0] || love.text;
  const text = `${direct ? loveFoundation : love.text}\n\n${thought}`;

  return Object.freeze({
    ...love,
    engine:`${LOVE_ENGINE_NAME}+${MIND_ENGINE_NAME}`,
    version:MIND_ENGINE_VERSION,
    mindEngine:MIND_ENGINE_NAME,
    mindVersion:MIND_ENGINE_VERSION,
    mindLabel:mindLabel(kind, actions),
    intent:kind,
    confidence:confidenceFor(kind, cardResult, guideMatches, ranking),
    explicitCommand,
    actions,
    text,
    mindSignature:mix(ritualSeed, 'mind-signature').toString(36).toUpperCase().padStart(7, '0')
  });
}
