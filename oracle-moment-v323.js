/* DIVINA BRUXA 3.2.3 — ORÁCULO DO INSTANTE
   A carta não recebe um verbete. Um ritual criptograficamente embaralhado
   compõe uma fala breve no encontro entre instante, posição e vizinhança. */

const ARRIVALS = Object.freeze([
  'O que parecia distante', 'Uma verdade ainda sem nome', 'O amor que você protegeu',
  'Uma coragem quase esquecida', 'O silêncio entre duas escolhas', 'Aquilo que voltou ao seu pensamento',
  'Uma porta que ninguém anunciou', 'O desejo que permaneceu inteiro', 'A resposta escondida no intervalo',
  'Uma ternura que resistiu', 'O que seu coração reconheceu primeiro', 'Uma coincidência delicada',
  'O caminho que parecia encerrado', 'Uma presença que chega devagar', 'O que você ainda não contou a ninguém',
  'A parte de você que não desistiu', 'Uma promessa feita em silêncio', 'O gesto que parecia pequeno',
  'O que a noite amadureceu', 'Uma lembrança que perdeu o peso', 'A liberdade que nasceu por dentro',
  'O encontro que ainda procura forma', 'Uma certeza que não precisa gritar', 'O que ficou depois da tempestade',
  'A escolha que devolve seu centro', 'Uma luz que atravessou a dúvida', 'O sentimento que pediu passagem',
  'O futuro tocando o presente', 'Uma mudança já em movimento', 'O que a sua alma preservou',
  'A beleza escondida no recomeço', 'Uma resposta que chegou antes da pergunta'
]);

const MOVEMENTS = Object.freeze([
  'muda de direção sem fazer barulho', 'se aproxima quando você solta o controle',
  'encontra espaço onde havia pressa', 'pede apenas um gesto verdadeiro',
  'deixa de ser espera e começa a ser caminho', 'revela uma saída que o medo não enxergava',
  'volta diferente para não repetir o passado', 'cresce quando você escolhe sem se abandonar',
  'desfaz um nó que já cumpriu sua função', 'acende exatamente onde faltava coragem',
  'atravessa a dúvida e permanece', 'encontra você no ponto em que a máscara cai',
  'pede presença, não perfeição', 'abre espaço para aquilo que ainda pode florescer',
  'se torna claro quando o coração desacelera', 'chega para reorganizar, não para punir',
  'transforma ausência em direção', 'se aproxima pela porta mais simples',
  'recupera a força que você entregou ao medo', 'faz o impossível parecer apenas o próximo passo',
  'troca urgência por verdade', 'rompe o ciclo sem romper você',
  'encontra abrigo no que é recíproco', 'pede para ser vivido antes de ser explicado',
  'devolve movimento ao que estava suspenso', 'se revela naquilo que continua voltando',
  'perde o peso quando recebe sinceridade', 'prepara uma virada que começa pequena',
  'separa desejo verdadeiro de antiga carência', 'mostra que o fim não levou tudo',
  'ganha forma na escolha que você vem adiando', 'responde quando você para de perseguir resposta'
]);

const DIRECTIONS = Object.freeze([
  'Escolha o que devolve paz sem apagar seu desejo.', 'Não diminua o sinal só porque ele chegou suavemente.',
  'Proteja o que floresce sem precisar se esconder.', 'O próximo passo deve caber inteiro no seu coração.',
  'Deixe partir o que só permanece quando você se perde.', 'Confie no alívio que aparece antes da certeza.',
  'O amor verdadeiro não exige que você desapareça.', 'Não corra atrás daquilo que também conhece o caminho até você.',
  'Responda ao presente, não ao medo de um passado repetido.', 'A sua paz também é uma forma de resposta.',
  'Aquilo que é recíproco não precisa ser adivinhado para sempre.', 'Dê uma chance ao gesto simples que continua chamando.',
  'O que precisa nascer agora pede menos explicação e mais verdade.', 'Espere apenas o suficiente para ouvir a sua própria voz.',
  'Não confunda intensidade com destino.', 'A porta certa preserva quem você é ao atravessá-la.',
  'Permita que a realidade confirme o que a esperança deseja.', 'A coragem desta vez pode ser permanecer fiel a você.',
  'Receba sem transformar alegria em desconfiança.', 'Soltar o controle não significa entregar o seu limite.',
  'O que for inteiro encontrará espaço sem violência.', 'A resposta mais profunda talvez seja uma decisão pequena.',
  'Não negocie novamente com aquilo que já custou sua luz.', 'Veja quem permanece quando você para de implorar presença.',
  'Seu coração pode desejar e ainda assim escolher com clareza.', 'A mudança começa no instante em que você não se abandona.',
  'Guarde energia para o que também se move em sua direção.', 'O sinal verdadeiro aproxima você da realidade, não da confusão.',
  'Deixe a vida responder antes de escrever o final.', 'Você não precisa saber tudo para reconhecer o próximo sim.',
  'O que nasceu em silêncio merece uma escolha consciente.', 'Hoje, trate sua intuição como início da pergunta, não como prisão.'
]);

const QUESTIONS = Object.freeze([
  'O que você escolheria se não precisasse provar nada?', 'Qual verdade continua viva depois que a ansiedade passa?',
  'O que está tentando chegar sem invadir?', 'Que parte sua deseja voltar para casa?',
  'Onde o amor termina e o abandono de si começa?', 'O que muda quando você aceita não controlar o final?',
  'Qual gesto faria seu coração respirar agora?', 'O que permanece verdadeiro quando o medo se cala?',
  'Que porta se abre quando você deixa de perseguir?', 'O que precisa ser sentido antes de ser decidido?',
  'Qual espera ainda tem vida e qual virou ausência?', 'O que você já sabe, mas ainda não viveu?',
  'Que desejo merece realidade, não apenas imaginação?', 'Onde a reciprocidade está tentando aparecer?',
  'O que sua paz está pedindo para proteger?', 'Qual ciclo termina quando você para de se diminuir?'
]);

const ANSWERS = Object.freeze([
  'comece pelo gesto que não fere você', 'a verdade vai ficar mais simples quando chegar',
  'nem toda demora é destino; observe o movimento real', 'o amor precisa encontrar você inteira',
  'há uma saída no limite que você ainda não colocou', 'o que é recíproco também atravessa a distância',
  'não volte ao lugar que exigiu sua ausência', 'a próxima confirmação virá pela atitude, não pela promessa',
  'deixe a realidade tocar o sonho', 'a coragem agora tem a forma de uma escolha serena',
  'o que permanece merece cuidado, não perseguição', 'a mudança já começou onde você disse a verdade',
  'receber também é uma decisão', 'não transforme uma possibilidade em prisão',
  'o caminho vivo não exige que você apague sua luz', 'a resposta chegará mais limpa quando você voltar ao centro'
]);

const BRIDGES = Object.freeze([
  'Entre as duas, nasce uma escolha que não existia antes.', 'A segunda voz não nega a primeira; ela mostra seu preço.',
  'O diálogo desloca a pergunta e devolve poder ao presente.', 'O que começou como dúvida termina pedindo um gesto.',
  'Uma revela o desejo; a outra protege a verdade.', 'A passagem está justamente no espaço entre as duas.',
  'A primeira acende; a segunda decide onde a chama pode viver.', 'O encontro muda tudo sem precisar prometer o impossível.',
  'Uma abre o coração; a outra devolve seus limites.', 'Juntas, elas retiram o excesso e deixam apenas o essencial.',
  'O movimento não pede pressa, pede coerência.', 'A conversa termina onde sua escolha começa.'
]);

export function oracleHash(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function secureOracleSeed() {
  const values = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return values[0] >>> 0;
  }
  return oracleHash(`${Date.now()}:${Math.random()}:${globalThis.performance?.now?.() || 0}`);
}

function mix(seed, ...parts) {
  return oracleHash([seed, ...parts].join(':'));
}

function choose(values, seed, ...parts) {
  return values[mix(seed, ...parts) % values.length];
}

const IGNORED_WORDS = new Set(['ainda','apenas','aquilo','quando','onde','entre','depois','antes','agora','parecia','precisa','verdadeiro','verdadeira']);

function meaningfulWords(value) {
  return new Set(String(value).toLocaleLowerCase('pt-BR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z]{5,}/g)?.filter(word => !IGNORED_WORDS.has(word)) || []);
}

function chooseWithoutEcho(values, seed, avoid, ...parts) {
  const blocked = meaningfulWords(avoid);
  const start = mix(seed, ...parts) % values.length;
  for (let offset = 0; offset < values.length; offset += 1) {
    const candidate = values[(start + offset) % values.length];
    const words = meaningfulWords(candidate);
    if (![...words].some(word => blocked.has(word))) return candidate;
  }
  return values[start];
}

export function oracleForCard(card, seed, salt = 0) {
  const identity = Number(card?.id || 0);
  const arrival = choose(ARRIVALS, seed, identity, salt, 'arrival');
  const movement = chooseWithoutEcho(MOVEMENTS, seed, arrival, salt, identity, 'movement');
  const direction = chooseWithoutEcho(DIRECTIONS, seed, `${arrival} ${movement}`, identity + salt, 'direction');
  return `${arrival} ${movement}. ${direction}`;
}

function dialogueLine(before, after, seed, index) {
  const question = choose(QUESTIONS, seed, before.id, after.id, index, 'question');
  const answer = choose(ANSWERS, seed, after.id, before.id, index, 'answer');
  return `${before.name} pergunta: “${question}” ${after.name} responde: “${answer}”.`;
}

export function oracleConversation(cards, positions, seed, intention = '') {
  const visible = cards.filter(Boolean);
  if (!visible.length) return null;
  const intentionSeed = oracleHash(String(intention || '').trim());
  const ritualSeed = mix(seed, intentionSeed, visible.length);

  if (visible.length === 1) {
    return Object.freeze({
      title:'A primeira voz',
      prompt:'A leitura nasceu neste instante. Não procure uma definição; perceba o que a frase movimenta em você.',
      facts:Object.freeze([oracleForCard(visible[0], ritualSeed, 101)])
    });
  }

  const pairs = visible.length <= 4
    ? visible.slice(1).map((card, index) => [visible[index], card, index])
    : [
        [visible[0], visible[1], 0],
        [visible[Math.floor(visible.length / 2) - 1], visible[Math.floor(visible.length / 2)], 1],
        [visible.at(-2), visible.at(-1), 2]
      ];
  const first = visible[0];
  const last = visible.at(-1);
  const bridge = choose(BRIDGES, ritualSeed, first.id, last.id, 'bridge');

  return Object.freeze({
    title:'O diálogo das cartas',
    prompt:`${first.name} abriu o campo; ${last.name} mudou sua direção. ${bridge}`,
    facts:Object.freeze(pairs.map(([before, after, index]) => dialogueLine(before, after, ritualSeed, index)).slice(0, 3))
  });
}

export const ORACLE_COMBINATION_FLOOR = ARRIVALS.length * MOVEMENTS.length * DIRECTIONS.length * 78;
