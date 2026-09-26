/*
 * DIVINA BRUXA 3.6.0 · MOTOR ARBÍTRIO
 *
 * ARBÍTRIO não interpreta nem prevê. As 78 cartas funcionam como identidades
 * narrativas para uma ficção simbólica criada no aparelho, no instante do rito.
 * Nenhuma pergunta, carta ou criação é enviada para fora desta página.
 */

export const ARBITRIO_NAME = 'ARBÍTRIO';
export const ARBITRIO_VERSION = '3.6.0';
export const ARBITRIO_LABEL = 'FICÇÃO SIMBÓLICA CRIADA AGORA';

const TITLES = Object.freeze([
  'A realidade que aprendeu seu nome',
  'O minuto que abriu uma passagem',
  'A cidade atrás do último pensamento',
  'O jardim que nasceu no intervalo',
  'A noite em que o impossível respirou',
  'O segredo guardado pela aurora',
  'A casa construída dentro da coragem',
  'O céu que mudou de lugar',
  'A ponte feita de escolhas vivas',
  'O instante que recusou o fim',
  'A estrela escondida no gesto',
  'O reino que cabia numa respiração',
  'A porta que só existe por dentro',
  'O mapa escrito depois do medo',
  'A luz que atravessou sem ferir',
  'O oceano que devolveu a voz',
  'A palavra anterior ao destino',
  'O coração secreto do caminho',
  'A manhã inventada pela alma',
  'O lugar onde a dúvida floresceu',
  'A constelação que escolheu ficar',
  'O silêncio que acendeu o mundo',
  'A história que começou no agora',
  'O universo depois da primeira escolha'
]);

const ARRIVALS = Object.freeze([
  'abre uma janela onde ontem havia parede',
  'atravessa a sala carregando uma aurora ainda sem nome',
  'deixa sobre a mesa uma chave que só abre por dentro',
  'ergue uma ponte entre o desejo e o próximo gesto',
  'acende uma pequena estrela no lugar da pressa',
  'entra no instante como quem devolve o ar ao mundo',
  'desenha uma saída na margem do impossível',
  'faz do silêncio uma matéria luminosa',
  'pousa no presente e muda a temperatura da noite',
  'abre no escuro uma rua que ninguém havia imaginado',
  'recolhe o excesso e deixa apenas o que pulsa',
  'vira o espelho para o lado ainda não vivido',
  'costura coragem na dobra mais delicada do agora',
  'desamarra o tempo sem rasgar a memória',
  'sopra vida numa palavra que parecia adormecida',
  'coloca uma lua nova dentro da pergunta',
  'toca o chão e desperta uma passagem subterrânea',
  'leva a dúvida até um lugar onde ela pode florescer',
  'abre as mãos e deixa o futuro continuar livre',
  'ensina o labirinto a produzir uma porta',
  'aproxima duas margens sem apagar a distância',
  'faz a esperança caber num gesto possível',
  'transforma a espera em território de criação',
  'chega sem resposta e inaugura uma realidade'
]);

const OPENINGS = Object.freeze([
  'A noite dobra uma esquina que não existia.',
  'Uma escada de luz aparece debaixo do último pensamento.',
  'O céu se aproxima o bastante para ouvir uma respiração.',
  'Uma cidade invisível abre as janelas ao mesmo tempo.',
  'O tempo solta uma de suas amarras e fica mais amplo.',
  'No fundo do silêncio, alguma coisa escolhe nascer.',
  'A memória fecha os olhos e encontra uma paisagem nova.',
  'Uma estrela desce até a altura de uma decisão humana.',
  'O instante se parte com delicadeza e revela outra margem.',
  'A madrugada encontra uma palavra que ainda não foi usada.',
  'O mundo diminui o ruído para que um gesto possa existir.',
  'Uma chuva violeta lava os nomes antigos das portas.',
  'O horizonte muda de posição sem pedir licença ao medo.',
  'A realidade abre espaço para uma hipótese luminosa.',
  'Uma casa secreta acende todas as suas lâmpadas.',
  'O universo inclina o ouvido para o que quase foi esquecido.',
  'Uma pequena coragem acorda antes de todo o resto.',
  'A lua recolhe o excesso e devolve somente o essencial.',
  'Um caminho adormecido reconhece a presença de novos passos.',
  'A água aprende outra forma de atravessar a pedra.',
  'Uma página vazia começa a respirar como um animal manso.',
  'O impossível perde por um instante a sua antiga fronteira.',
  'A manhã chega por dentro antes de alcançar as janelas.',
  'Uma voz sem passado chama o presente para mais perto.'
]);

const WORLDS = Object.freeze([
  'No centro desse lugar, um relógio aprende a respirar entre dois instantes.',
  'Ali, as portas não levam a quartos; levam a versões ainda livres da história.',
  'Cada sombra guarda uma semente de luz que nunca aceitou desaparecer.',
  'O chão é feito de promessas que só existem depois de um gesto real.',
  'As janelas mostram não o futuro, mas tudo o que a imaginação ainda pode criar.',
  'Um rio de vidro transporta palavras que tiveram coragem de mudar.',
  'As paredes escutam sem julgar e devolvem espaço em vez de resposta.',
  'Nenhum mapa está pronto, porque cada passo inventa o território seguinte.',
  'A gravidade obedece ao que permanece inteiro quando o medo se cala.',
  'Uma árvore guarda nos galhos todas as escolhas que recusaram ser prisão.',
  'O ar tem a cor de uma ideia antes de ela encontrar forma.',
  'Há uma ponte para cada verdade que consegue caminhar sem ferir.',
  'As estrelas ficam próximas o bastante para iluminar detalhes pequenos.',
  'Toda despedida deixa no chão uma matéria capaz de construir começo.',
  'As horas não empurram ninguém; apenas abrem espaço para movimento.',
  'A paisagem muda quando alguém escolhe existir sem diminuir a própria luz.',
  'Um jardim cresce ao redor das perguntas que não exigem obediência.',
  'Os espelhos não repetem rostos; revelam novas maneiras de estar presente.',
  'A noite guarda um sol particular para quem atravessa sem abandonar a si.',
  'O silêncio tem rios, pontes e uma praça onde a coragem pode descansar.',
  'Cada palavra verdadeira produz uma janela em algum lugar do céu.',
  'O amor não é uma jaula nesse mundo; é espaço para duas liberdades respirarem.',
  'A realidade permanece aberta, esperando autoria em vez de adivinhação.',
  'Tudo o que nasce ali conserva o direito sagrado de mudar.'
]);

const REVERSALS = Object.freeze([
  'O que parecia fechado troca de nome e encontra passagem.',
  'A antiga certeza perde peso, e uma possibilidade consegue se levantar.',
  'A ausência deixa de comandar a sala quando a presença acende uma luz.',
  'O medo continua existindo, mas já não segura todas as chaves.',
  'A pergunta abandona a procura por sentença e se transforma em criação.',
  'O que doía como muro reaparece como matéria para construir uma ponte.',
  'A espera devolve o tempo que havia tomado emprestado.',
  'A fantasia deixa de ser fuga e vira laboratório de uma escolha consciente.',
  'O fim perde a autoridade quando um gesto inaugura outra linguagem.',
  'A distância permanece real, mas para de decidir o valor do coração.',
  'O impossível encolhe quando a primeira ação encontra o chão.',
  'A memória conserva sua verdade sem obrigar o presente a repeti-la.',
  'O desejo aprende a respirar sem transformar ninguém em destino.',
  'A solidão abre uma janela e descobre que também pode ser território fértil.',
  'O silêncio deixa de ser falta e revela a arquitetura de uma resposta interior.',
  'A urgência se desfaz, permitindo que a beleza chegue inteira.',
  'A dúvida não desaparece; ela oferece espaço para uma autoria mais livre.',
  'O caminho para de pedir certeza e começa a aceitar presença.',
  'A sombra devolve à luz tudo o que havia guardado por proteção.',
  'A promessa vira matéria somente quando encontra um gesto correspondente.',
  'A porta não se abre para fugir, mas para ampliar o lugar onde a vida cabe.',
  'O coração separa esperança de prisão e volta a respirar.',
  'A história recusa o roteiro antigo sem precisar negar o que viveu.',
  'A realidade se torna maior do que a primeira versão da pergunta.'
]);

const TRUTHS = Object.freeze([
  'A verdade não chega como ordem; chega como espaço.',
  'Nenhuma luz precisa apagar outra para provar que existe.',
  'O amor que vale presença também preserva liberdade.',
  'O que é profundo não exige que você desapareça.',
  'Uma escolha pequena pode devolver movimento ao céu inteiro.',
  'A coragem às vezes tem a delicadeza de não forçar a próxima página.',
  'Há poder em deixar uma realidade responder por seus próprios gestos.',
  'A imaginação fica mais forte quando encontra um chão consciente.',
  'Nem toda porta precisa ser atravessada para transformar quem a encontrou.',
  'O instante permanece vivo enquanto ainda existe autoria.',
  'Sua presença é parte da obra, não o preço exigido por ela.',
  'Aquilo que é recíproco também sabe caminhar em sua direção.',
  'O mistério pode continuar belo sem se tornar uma sentença.',
  'A paz não é ausência de paixão; é paixão sem abandono de si.',
  'Toda criação verdadeira deixa espaço para o inesperado respirar.',
  'A alma não precisa de pressa para ser imensa.',
  'Um limite amoroso também pode ser uma forma de luz.',
  'A ficção revela possibilidades, mas a escolha continua pertencendo a você.',
  'O coração fica mais nítido quando não precisa provar o impossível.',
  'A esperança floresce melhor quando não é obrigada a prever.',
  'O presente é o único lugar onde uma nova história consegue tocar o mundo.',
  'A beleza aumenta quando não tenta possuir aquilo que ama.',
  'Você pode honrar um sonho sem entregar a ele todas as chaves.',
  'O próximo capítulo começa onde sua liberdade continua inteira.'
]);

const CHOICES = Object.freeze([
  'Escolha o gesto que mantém sua luz inteira.',
  'Deixe a próxima ação ser menor que a ansiedade e maior que o medo.',
  'Dê realidade ao que pode ser cuidado hoje.',
  'Permita que a resposta venha também pelas atitudes do mundo.',
  'Proteja a parte de você que ainda sabe imaginar sem se perder.',
  'Faça espaço para uma surpresa que não dependa de controle.',
  'Toque primeiro aquilo que está verdadeiramente ao seu alcance.',
  'Escreva uma linha que o roteiro antigo jamais escreveria.',
  'Escolha sem transformar possibilidade em prisão.',
  'Leve consigo apenas a promessa que também sabe virar presença.',
  'Abra a mão o bastante para que o novo consiga pousar.',
  'Trate sua intuição como início da pergunta, nunca como algema.',
  'Caminhe na direção em que sua dignidade consegue respirar.',
  'Faça do cuidado uma força criadora, não uma espera infinita.',
  'Dê ao silêncio o tempo de revelar se ainda existe movimento.',
  'Conserve o sonho e devolva ao mundo a responsabilidade pelos fatos.',
  'Escolha a realidade que não exige o desaparecimento de ninguém.',
  'Permita que o amor seja vasto sem deixar de ser concreto.',
  'Crie beleza, mas mantenha aberta a porta da verdade.',
  'Faça uma pergunta que aumente sua liberdade.',
  'Reconheça o que já mudou dentro de você.',
  'Comece pelo ato capaz de existir mesmo sem garantia.',
  'Deixe a coragem escrever devagar, com letra legível.',
  'Continue somente onde a vida também continua respondendo.'
]);

const CLOSINGS = Object.freeze([
  'O resto ainda está sendo escrito.',
  'A próxima linha pertence ao encontro entre imaginação e escolha.',
  'Nenhum final foi decretado nesta página.',
  'O universo permanece aberto ao gesto que vier inteiro.',
  'A história respira melhor quando não é obrigada a prever.',
  'A porta continuará ali enquanto sua liberdade continuar com você.',
  'O céu não pede certeza; pede presença.',
  'A magia termina exatamente onde sua autoria começa.',
  'O instante guarda a chama, mas não aprisiona o caminho.',
  'A realidade seguinte ainda não recebeu um nome.',
  'A luz ficará acesa sem exigir uma promessa.',
  'O mistério pode acompanhar você sem conduzir seus passos.',
  'A página permanece viva porque pode mudar.',
  'O coração sabe reconhecer quando a ficção devolve força.',
  'O amanhã continuará livre, como deve ser.',
  'Esta criação não fecha o mundo; ela o amplia.',
  'A última palavra não é destino: é começo.',
  'O silêncio depois da frase também faz parte da obra.',
  'Leve somente o que acendeu vida em você.',
  'A passagem existe, mas a travessia continua sendo escolha.',
  'Toda estrela aqui é convite, nunca ordem.',
  'O possível volta a crescer quando ninguém o força.',
  'A ficção se recolhe; sua presença permanece.',
  'Agora o universo devolve a caneta.'
]);

const DIALOGUE_CORES = Object.freeze([
  'Eu não vim anunciar o que acontecerá; vim abrir espaço para o que ainda pode nascer.',
  'Há uma porta entre a vontade e o gesto, e ela reconhece mãos conscientes.',
  'O impossível precisa de ar antes de descobrir o próprio tamanho.',
  'Não carregue como destino aquilo que ainda é somente pergunta.',
  'Eu guardo uma chama, mas a direção do fogo continua livre.',
  'Aquilo que ama você não precisa apagar sua voz.',
  'Deixe o mundo responder também com movimento verdadeiro.',
  'Uma realidade nova começa quando o medo deixa de escrever sozinho.',
  'A beleza desta história está no que ela permite criar, não no que promete prever.',
  'O coração pode ser imenso e ainda assim conservar todas as suas portas.',
  'Há coragem suficiente numa escolha pequena e inteira.',
  'O mistério não diminui quando encontra lucidez; ele ganha profundidade.',
  'A próxima página não precisa repetir a última noite.',
  'Toda esperança merece um chão onde possa pousar sem ferir ninguém.',
  'Eu ofereço uma imagem; a autoria permanece em suas mãos.',
  'O silêncio entre nós contém uma cidade ainda sem ruas.',
  'Uma dúvida cuidada pode se tornar uma forma de sabedoria.',
  'Não transforme a intensidade em prova; deixe os gestos falarem.',
  'A ficção abre universos, e a liberdade escolhe quais podem ser habitados.',
  'O que permanece vivo encontra maneiras concretas de continuar.',
  'Existe uma ponte, mas ninguém precisa atravessá-la sozinho.',
  'A verdade pode chegar devagar sem deixar de ser inteira.',
  'O amor se torna maior quando duas presenças continuam livres.',
  'A realidade não está pronta; ela espera participação.'
]);

const BRIDGES = Object.freeze([
  'Uma voz acende a pergunta; a seguinte impede que ela vire prisão.',
  'O diálogo transforma intensidade em espaço para uma escolha viva.',
  'Cada resposta abre outra janela em vez de fechar a história.',
  'As vozes discordam do medo e concordam apenas em manter o futuro livre.',
  'Uma carta oferece fogo; a outra constrói para ele um lugar seguro.',
  'Entre as falas nasce uma terceira presença: a realidade ainda inventável.',
  'O que começa como chamado termina devolvendo autoria.',
  'Nenhuma voz domina a outra; juntas, elas ampliam o campo.',
  'A primeira desloca o silêncio, e a última devolve profundidade a ele.',
  'Uma abre o céu; a outra lembra que todo voo também precisa de corpo.',
  'O concílio não produz sentença: produz uma história capaz de respirar.',
  'As cartas não fecham a pergunta; elas mudam sua arquitetura.',
  'Uma palavra encontra outra e deixa de carregar o mundo sozinha.',
  'A conversa une imaginação e presença sem confundir uma com a outra.',
  'Cada voz entrega uma parte da chama e conserva a própria liberdade.',
  'O caminho aparece no intervalo, não na vitória de uma voz sobre as demais.',
  'A história cresce porque nenhuma carta tenta possuir o final.',
  'O diálogo retira o excesso e preserva a força.',
  'Uma carta inventa a ponte; a próxima verifica se existe chão.',
  'As vozes criam juntas uma paisagem que nenhuma criaria sozinha.',
  'O primeiro chamado ganha corpo ao atravessar todas as respostas.',
  'Cada presença altera a luz sem apagar as anteriores.',
  'O concílio transforma uma pergunta solitária numa realidade compartilhada.',
  'O último eco não encerra nada; entrega a caneta de volta.'
]);

const THREADS = Object.freeze([
  'Uma cidade de vidro se ergue ao redor do concílio, mas nenhuma parede impede a passagem.',
  'No alto, uma constelação muda de desenho sempre que uma voz escolhe a verdade.',
  'Um rio atravessa a mesa e leva embora somente aquilo que já perdeu movimento.',
  'A noite abre um palco onde o desejo pode existir sem fingir que é certeza.',
  'Uma árvore cresce entre as cartas, alimentada por perguntas que continuam livres.',
  'O chão se cobre de pequenas portas, cada uma levando a um gesto possível.',
  'Uma lua violeta ilumina primeiro os limites e depois as pontes.',
  'A mesa se transforma numa nave feita de presença, memória e imaginação.',
  'Uma biblioteca invisível escreve um livro diferente para cada nova escuta.',
  'O ar vira tinta e registra apenas as palavras que devolvem poder.',
  'Um jardim aprende a florescer sem perguntar quem ficará para sempre.',
  'A aurora chega por baixo da porta e redesenha a sala inteira.',
  'Uma torre de silêncio se abre e revela que por dentro era horizonte.',
  'O tempo coloca sua coroa no chão para ouvir todas as vozes.',
  'Um oceano suspenso guarda as possibilidades sem transformá-las em promessa.',
  'Cada carta deixa uma estrela na mesa, formando um caminho que não existia antes.',
  'O espelho no centro do rito para de repetir e começa a criar.',
  'Uma chama branca atravessa o concílio sem queimar nenhuma diferença.',
  'O universo fecha os olhos e imagina uma realidade menos estreita.',
  'Uma ponte circular une começo e fim, mas conserva muitas saídas.',
  'A noite devolve às vozes tudo o que o medo havia traduzido errado.',
  'Uma casa aparece no horizonte com espaço suficiente para a verdade inteira.',
  'O céu escreve devagar para que cada presença possa alterar a frase.',
  'Ao redor da mesa, o impossível aprende a conversar com o real.'
]);

export const ARBITRIO_COMBINATION_FLOOR = Object.freeze([
  ARRIVALS, OPENINGS, WORLDS, REVERSALS, TRUTHS, CHOICES, CLOSINGS
]).reduce((total, collection) => total * BigInt(collection.length), 78n);

export function arbitrioHash(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function secureArbitrioSeed() {
  const values = new Uint32Array(4);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return [...values].map(value => value.toString(16).padStart(8, '0')).join('');
  }
  return [Date.now(), globalThis.performance?.now?.() || 0, Math.random(), Math.random()]
    .map((value, index) => arbitrioHash(`${value}:${index}`).toString(16).padStart(8, '0'))
    .join('');
}

function mix(seed, ...parts) {
  return arbitrioHash([seed, ...parts].join('¦'));
}

function choose(collection, seed, ...parts) {
  return collection[mix(seed, ...parts) % collection.length];
}

function cardIdentity(card) {
  return `${card?.canonicalId ?? card?.id ?? 'carta'}:${card?.name ?? 'Carta sem nome'}`;
}

function cardName(card) {
  return String(card?.name || 'A carta sem nome').trim();
}

function inlineCardName(card) {
  return cardName(card).replace(/^(A|O|As|Os)\s/u, article => article.toLocaleLowerCase('pt-BR'));
}

function freezeCreation(creation) {
  if (creation.paragraphs) Object.freeze(creation.paragraphs);
  if (creation.voices) Object.freeze(creation.voices);
  return Object.freeze(creation);
}

export function arbitrioForCard(card, seed = secureArbitrioSeed(), options = {}) {
  const identity = cardIdentity(card);
  const scope = String(options.scope || 'carta');
  const moment = String(options.moment || 'agora');
  const ritualSeed = mix(seed, identity, scope, moment);
  const name = cardName(card);
  const arrival = choose(ARRIVALS, ritualSeed, 'arrival');
  const secondArrival = choose(ARRIVALS, ritualSeed, 'second-arrival');
  const opening = choose(OPENINGS, ritualSeed, 'opening');
  const world = choose(WORLDS, ritualSeed, 'world');
  const reversal = choose(REVERSALS, ritualSeed, 'reversal');
  const truth = choose(TRUTHS, ritualSeed, 'truth');
  const choice = choose(CHOICES, ritualSeed, 'choice');
  const closing = choose(CLOSINGS, ritualSeed, 'closing');

  return freezeCreation({
    engine:ARBITRIO_NAME,
    version:ARBITRIO_VERSION,
    mode:'fiction',
    label:ARBITRIO_LABEL,
    title:choose(TITLES, ritualSeed, 'title'),
    whisper:`${name} ${arrival}. ${truth}`,
    paragraphs:[
      `${opening} ${world}`,
      `${name} ${secondArrival}. ${reversal}`,
      choice
    ],
    closing,
    signature:mix(ritualSeed, 'signature').toString(36).toUpperCase().padStart(7, '0'),
    seed:String(seed)
  });
}

function positionText(positions, index) {
  const value = String(positions?.[index] || '').trim();
  return value ? ` no lugar “${value}”` : '';
}

function dialogueVoice(cards, positions, ritualSeed, index) {
  const card = cards[index];
  const before = cards[index - 1];
  const after = cards[index + 1];
  const name = cardName(card);
  const seat = positionText(positions, index);
  const words = choose(DIALOGUE_CORES, ritualSeed, cardIdentity(card), index, 'voice');

  if (cards.length === 1) return `${name}${seat} abre o concílio: “${words}”`;
  if (index === 0) return `${name}${seat} olha para ${inlineCardName(after)} e abre o concílio: “${words}”`;
  if (index === cards.length - 1) return `${name}${seat} recebe a voz de ${inlineCardName(before)} e recolhe o círculo: “${words}”`;
  return `${name}${seat} escuta ${inlineCardName(before)}, volta-se para ${inlineCardName(after)} e responde: “${words}”`;
}

export function arbitrioConversation(cards, positions = [], seed = secureArbitrioSeed(), intention = '') {
  const visible = (cards || []).filter(Boolean);
  if (!visible.length) return null;

  const identities = visible.map(cardIdentity).join('→');
  // A intenção participa apenas como entropia. O texto privado nunca é repetido.
  const intentionHash = arbitrioHash(String(intention || '').trim());
  const ritualSeed = mix(seed, identities, intentionHash, 'conversation');
  const first = visible[0];
  const last = visible.at(-1);
  const bridge = choose(BRIDGES, ritualSeed, 'bridge');
  const thread = choose(THREADS, ritualSeed, 'thread');
  const truth = choose(TRUTHS, ritualSeed, 'truth');
  const choice = choose(CHOICES, ritualSeed, 'choice');
  const closing = choose(CLOSINGS, ritualSeed, 'closing');

  return freezeCreation({
    engine:ARBITRIO_NAME,
    version:ARBITRIO_VERSION,
    mode:'fiction',
    label:ARBITRIO_LABEL,
    title:visible.length === 1 ? 'A primeira voz de uma realidade nova' : choose(TITLES, ritualSeed, 'title'),
    lead:visible.length === 1
      ? `${cardName(first)} acendeu a primeira voz. A história continuará mudando quando outra carta entrar.`
      : `${cardName(first)} abriu o campo; ${cardName(last)} levou a conversa até outra margem. ${bridge}`,
    story:`${thread} ${truth}`,
    voices:visible.map((card, index) => dialogueVoice(visible, positions, ritualSeed, index)),
    closing:`${choice} ${closing}`,
    signature:mix(ritualSeed, 'signature').toString(36).toUpperCase().padStart(7, '0'),
    seed:String(seed)
  });
}

export function arbitrioCapacity() {
  return Object.freeze({
    cards:78,
    minimum:ARBITRIO_COMBINATION_FLOOR,
    minimumLabel:'mais de 1 bilhão de combinações-base',
    randomness:globalThis.crypto?.getRandomValues ? 'crypto' : 'fallback'
  });
}
