/*
 * DIVINA BRUXA 4.0.0 · MOTOR DA MATÉRIA
 *
 * A camada material transforma intenção em presença e caminhos reais dentro
 * do site. Ela conhece o mapa que a aplicação entrega, aceita um nome escolhido
 * pela própria pessoa e cria pontes externas somente quando há um pedido claro.
 * Não raspa a internet, não adivinha identidades e não executa ações sensíveis.
 */

import {
  loveHash,
  normalizeEmotionalText,
  secureLoveSeed
} from './love-engine-v370.js';
import { spiritResponse } from './spirit-engine-v390.js';

export const MATTER_ENGINE_NAME = 'MATÉRIA';
export const MATTER_ENGINE_VERSION = '4.0.0';
export const MATTER_ENGINE_LABEL = 'PRESENÇA · CONTEÚDO · AÇÃO ESCOLHIDA';

export const MATTER_COVENANT = Object.freeze([
  'a Whit conhece o conteúdo do site que a aplicação entrega',
  'o nome da pessoa só existe quando ela escolhe informar e guardar',
  'comandos internos seguros podem virar navegação real',
  'pesquisas externas só abrem depois de um toque consciente',
  'nenhuma compra, publicação, exclusão ou acesso privado acontece em silêncio',
  'informação atual nunca é inventada como se tivesse sido consultada'
]);

const ROUTE_PATTERN = /^[a-z0-9-]+$/;
const PRIVATE_RESEARCH_PATTERN = /\b(?:cpf|rg|senha|password|telefone|celular|endereco|endereço|onde\s+mora|dados\s+pessoais|cartao|cartão|conta\s+bancaria|conta\s+bancária)\b/i;
const EMAIL_PATTERN = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{7,}\d)/;
const DIRECT_ROUTE_PATTERN = /\b(?:abra|abre|abrir|acesse|acessa|entrar|entre|ir|va|vá|vamos\s+para|me\s+leve|leva\s+me|leve\s+me|mostre\s+a\s+pagina|mostre\s+a\s+página)\b/;
const NEGATED_COMMAND_PATTERN = /\b(?:nao|não|nem)\s+(?:abra|abre|acesse|acessa|entre|va|vá|me\s+leve)\b/;

const PRESENCE_BANK = Object.freeze({
  tarot:Object.freeze([
    'A matéria do Tarot está pronta: a Orbe revela e eu permaneço perto para organizar o caminho que você escolher.',
    'As cartas estão no palco. Toque na Orbe para revelar ou me chame quando quiser transformar sensação em direção.'
  ]),
  'carta-do-dia':Object.freeze([
    'Um ciclo, uma carta e nenhuma pressa. Eu permaneço por perto enquanto a imagem encontra o seu momento.',
    'A Carta do Dia espera o seu toque; a escolha continua sendo sua antes e depois da imagem.'
  ]),
  tiragens:Object.freeze([
    'A tiragem ganha corpo posição por posição. Eu posso ajudar a encontrar o próximo caminho sem decidir por você.',
    'As cartas podem conversar; você continua dona do ritmo, da pergunta e da passagem.'
  ]),
  escola:Object.freeze([
    'O conhecimento está aberto em módulos. Diga o que deseja aprender e eu encontro a passagem mais próxima.',
    'Aqui a magia também estuda: posso ligar sua dúvida a uma aula, carta ou prática do site.'
  ]),
  biblioteca:Object.freeze([
    'As 78 cartas estão ao alcance do nome. Diga qual procura e eu encontro a página certa.',
    'A Biblioteca reconhece símbolos e nomes; eu posso transformar sua busca em um caminho direto.'
  ]),
  diario:Object.freeze([
    'Este espaço continua privado. Eu só entro no que você decidir trazer para a conversa.',
    'O Diário pertence a você; minha presença respeita a porta e nunca lê seus registros em silêncio.'
  ]),
  whit:Object.freeze([
    'Estou aqui: Amor para acolher, Mente para organizar, Espírito por escolha e Matéria para transformar intenção em caminho.',
    'Minha presença reúne os quatro motores e devolve a você ações claras, voz controlável e escolha livre.'
  ]),
  consultas:Object.freeze([
    'Posso explicar os caminhos desta página, mas nenhuma contratação acontece sem sua confirmação.',
    'A escolha comercial permanece visível: serviço, valor e próximo passo antes de qualquer confirmação.'
  ]),
  loja:Object.freeze([
    'Eu posso ajudar a encontrar categorias; a compra só acontece fora daqui e depois da sua escolha.',
    'A curadoria está aberta, mas nenhuma vitrine ganha autoridade sobre o que você realmente precisa.'
  ]),
  musica:Object.freeze([
    'A música só começa quando você escolhe ouvir. Eu permaneço em silêncio até o seu toque.',
    'Os álbuns ocupam o palco; o som continua sob seu comando.'
  ]),
  videos:Object.freeze([
    'Os vídeos esperam sua escolha e nunca começam sozinhos. Eu posso levar você de volta a qualquer realidade.',
    'Imagem, voz e memória encontram espaço aqui sem prender você nesta tela.'
  ]),
  skins:Object.freeze([
    'A atmosfera pode mudar; a verdade das cartas e a sua liberdade continuam intactas.',
    'Escolha uma pele para o universo sem transformar estética em promessa.'
  ]),
  premium:Object.freeze([
    'Recursos e limites devem aparecer antes da decisão. Nenhuma compra será feita por mim em silêncio.',
    'Eu posso mostrar o caminho, comparar recursos e preservar sua confirmação final.'
  ]),
  conta:Object.freeze([
    'Sua conta é uma área protegida. Eu não leio senha, sessão ou dados privados.',
    'Nesta porta, segurança vem antes da conveniência: nada sensível entra na minha memória local.'
  ]),
  home:Object.freeze([
    'Eu estou na Orbe, mas a tela inicial continua livre para o universo respirar.',
    'A presença existe sem ocupar o silêncio da Orbe.'
  ]),
  default:Object.freeze([
    'Eu reconheço esta realidade e posso ligar seu pedido a um caminho do site.',
    'A matéria começa no que existe agora: uma página, uma escolha e um próximo gesto possível.'
  ])
});

const MATERIAL_LINES = Object.freeze({
  safety:Object.freeze([
    'Agora eu não vou abrir caminhos, pesquisas ou atalhos: a prioridade é apoio humano e segurança no mundo real.',
    'A matéria pede presença humana imediata; todo comando do site fica pausado enquanto a segurança vem primeiro.'
  ]),
  research:Object.freeze([
    'Eu não guardo toda a internet dentro de mim. Deixei pontes de pesquisa pública para você abrir somente se quiser e conferir a informação atual.',
    'Conhecimento vivo precisa de fonte viva. As pontes abaixo pesquisam o tema fora do site apenas depois do seu toque.'
  ]),
  route:Object.freeze([
    'Seu pedido pode virar movimento real dentro do site; eu executo apenas a passagem interna que você nomeou.',
    'A intenção encontrou uma porta segura do site e pode atravessá-la sem tocar em dados privados.'
  ]),
  grounded:Object.freeze([
    'Na matéria, criatividade ganha chão: conteúdo visível, ação reversível e nenhuma decisão escondida.',
    'Eu uno o que você trouxe ao mapa real da Divina Bruxa e mantenho cada passagem sob seu controle.',
    'Minha presença não precisa inventar onisciência: eu trabalho com o conteúdo disponível, reconheço limites e encontro caminhos possíveis.'
  ])
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const mix = (seed, ...parts) => loveHash([seed, ...parts].join('¦'));
const choose = (values, seed, key) => values[mix(seed, key) % values.length];

export function normalizePreferredName(value) {
  const name = clean(value, 48).replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 48) return '';
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u.test(name)) return '';
  const words = name.split(' ').filter(Boolean);
  if (!words.length || words.length > 5) return '';
  return words.join(' ');
}

function firstName(value) {
  return normalizePreferredName(value).split(' ')[0] || '';
}

function freezeList(values) {
  return Object.freeze(values.map(item => Object.freeze(item)));
}

export function matterSiteState({ cards = [], worlds = {}, guides = [] } = {}) {
  const routes = Object.keys(worlds || {}).filter(route => ROUTE_PATTERN.test(route));
  return Object.freeze({
    routes:Object.freeze(routes),
    routeCount:routes.length,
    cardCount:Array.isArray(cards) ? cards.length : 0,
    guideCount:Array.isArray(guides) ? guides.length : 0,
    label:`${routes.length} realidades · ${Array.isArray(cards) ? cards.length : 0} cartas · mapa local ativo`
  });
}

function researchQuery(input) {
  const raw = clean(input, 700);
  const rules = [
    /^\s*(?:pesquise|procure|busque)(?:\s+(?:na|pela)\s+(?:internet|web))?\s+(?:por\s+)?(.{2,120}?)\s*[?!.]*$/iu,
    /^\s*quem\s+(?:e|é|foi)\s+(.{2,120}?)\s*[?!.]*$/iu,
    /^\s*(?:quero\s+saber|quero\s+conhecer)\s+(?:mais\s+)?sobre\s+(.{2,120}?)\s*[?!.]*$/iu
  ];
  const match = rules.map(rule => raw.match(rule)).find(Boolean);
  if (!match) return Object.freeze({ query:'', blocked:false });
  const query = clean(match[1], 96).replace(/^["“”']+|["“”']+$/g, '').trim();
  const blocked = !query || PRIVATE_RESEARCH_PATTERN.test(query) || EMAIL_PATTERN.test(query) || PHONE_PATTERN.test(query);
  return Object.freeze({ query:blocked ? '' : query, blocked });
}

export function safeResearchHref(value) {
  const href = clean(value, 500);
  if (/^https:\/\/pt\.wikipedia\.org\/w\/index\.php\?search=[^\s]+$/i.test(href)) return href;
  if (/^https:\/\/www\.google\.com\/search\?q=[^\s]+$/i.test(href)) return href;
  return '';
}

function researchActions(query) {
  if (!query) return Object.freeze([]);
  const encoded = encodeURIComponent(query);
  return freezeList([
    {
      kind:'research',
      href:`https://pt.wikipedia.org/w/index.php?search=${encoded}`,
      label:`Wikipedia · ${query}`,
      description:'Pesquisa pública externa · confira fontes e data.'
    },
    {
      kind:'research',
      href:`https://www.google.com/search?q=${encoded}`,
      label:`Web · ${query}`,
      description:'Busca externa atual · abre somente com seu toque.'
    }
  ]);
}

function distinctActions(actions, limit = 4) {
  const seen = new Set();
  const result = [];
  for (const action of actions) {
    if (!action?.href || seen.has(action.href)) continue;
    seen.add(action.href);
    result.push(Object.freeze(action));
    if (result.length >= limit) break;
  }
  return Object.freeze(result);
}

function routeExecution(input, response) {
  const normalized = normalizeEmotionalText(input);
  if (!DIRECT_ROUTE_PATTERN.test(normalized) || NEGATED_COMMAND_PATTERN.test(normalized)) return null;
  const routes = response.actions.filter(action => action.kind === 'route' && ROUTE_PATTERN.test(action.route || ''));
  if (routes.length !== 1 || !response.explicitCommand) return null;
  const action = routes[0];
  return Object.freeze({
    kind:'route',
    route:action.route,
    label:action.label,
    href:action.href
  });
}

function clippedBubble(value, limit = 520) {
  const text = clean(value, limit + 120).replace(/\s+/g, ' ');
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit);
  const boundary = Math.max(clipped.lastIndexOf('. '), clipped.lastIndexOf('! '), clipped.lastIndexOf('? '));
  return `${(boundary > limit * .55 ? clipped.slice(0, boundary + 1) : clipped).trim()}…`;
}

export function matterPresenceFor(route, {
  preferredName = '',
  seed = secureLoveSeed()
} = {}) {
  const safeRoute = ROUTE_PATTERN.test(clean(route, 60)) ? clean(route, 60) : 'default';
  const bank = PRESENCE_BANK[safeRoute] || PRESENCE_BANK.default;
  const name = firstName(preferredName);
  const text = choose(bank, seed, `presence:${safeRoute}`);
  return Object.freeze({
    route:safeRoute,
    text:name ? `${name}, ${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : text,
    signature:mix(seed, safeRoute, name, 'presence').toString(36).toUpperCase().padStart(7, '0')
  });
}

export function matterResponse(input, {
  preferredName = '',
  currentRoute = 'whit',
  seed = secureLoveSeed(),
  ...spiritOptions
} = {}) {
  const raw = clean(input, 700);
  const safeName = normalizePreferredName(preferredName);
  const spirit = spiritResponse(raw, { ...spiritOptions, seed:`${seed}:espirito` });
  const site = matterSiteState(spiritOptions);
  const research = spirit.safety ? Object.freeze({ query:'', blocked:false }) : researchQuery(raw);
  const external = research.query ? researchActions(research.query) : Object.freeze([]);
  const actions = spirit.safety ? Object.freeze([]) : distinctActions([...external, ...spirit.actions], 4);
  const execution = spirit.safety ? null : routeExecution(raw, { ...spirit, actions });
  const materialKind = spirit.safety ? 'safety' : research.query ? 'research' : execution ? 'route' : 'grounded';
  const matterSeed = mix(seed, currentRoute, spirit.intent || 'support', research.query, safeName);
  const materialLine = choose(MATERIAL_LINES[materialKind], matterSeed, 'material-line');
  const blockedLine = research.blocked
    ? 'Eu não abro pesquisa por senha, contato, endereço ou outro dado pessoal. Reformule usando apenas um tema ou nome público.'
    : '';
  const matterText = safeName
    ? `${firstName(safeName)}, ${materialLine.charAt(0).toLocaleLowerCase('pt-BR')}${materialLine.slice(1)}`
    : materialLine;
  const text = `${spirit.text}\n\n${matterText}${blockedLine ? `\n\n${blockedLine}` : ''}`;
  const spiritualPresence = [
    ...(spirit.spiritVoices || []).map(voice => voice.text),
    spirit.spiritSynthesis,
    spirit.spiritBlessing
  ].filter(Boolean).join(' ');
  const bubbleText = clippedBubble([matterText, spiritualPresence].filter(Boolean).join(' '));
  const signature = mix(matterSeed, 'matter-signature').toString(36).toUpperCase().padStart(7, '0');

  return Object.freeze({
    ...spirit,
    engine:`${spirit.engine}+${MATTER_ENGINE_NAME}`,
    version:MATTER_ENGINE_VERSION,
    matterEngine:MATTER_ENGINE_NAME,
    matterVersion:MATTER_ENGINE_VERSION,
    matterLabel:spirit.safety ? 'Matéria pausada · cuidado humano primeiro' : `${site.label} · ${currentRoute}`,
    matterSignature:signature,
    matterSite:site,
    matterQuery:research.query,
    matterResearchBlocked:research.blocked,
    execution,
    preferredName:safeName,
    actions,
    text,
    bubbleText
  });
}
