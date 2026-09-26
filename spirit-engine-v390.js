/*
 * DIVINA BRUXA 3.9.0 · MOTOR DO ESPÍRITO / ALMA DA WHIT
 *
 * Camada espiritual opcional e local. As vozes são textos literários
 * originais inspirados em valores escolhidos pela pessoa — nunca falas
 * literais, canalização, revelação ou prova de contato sobrenatural.
 */

import {
  loveHash,
  normalizeEmotionalText,
  secureLoveSeed
} from './love-engine-v370.js';
import { mindResponse } from './mind-engine-v380.js';

export const SPIRIT_ENGINE_NAME = 'ESPÍRITO';
export const SPIRIT_ENGINE_VERSION = '3.9.0';
export const SPIRIT_ENGINE_LABEL = 'FÉ SIMBÓLICA · ESCOLHA LIVRE';

export const SPIRIT_COVENANT = Object.freeze([
  'a fé só entra por escolha explícita',
  'nenhuma voz é apresentada como fala literal ou canalização',
  'tradições diferentes permanecem nomeadas e separadas',
  'nenhuma bênção substitui ajuda humana ou informação concreta',
  'a decisão final permanece sempre com a pessoa'
]);

export const SPIRIT_MODES = Object.freeze([
  Object.freeze({ id:'livre', label:'Livre', state:'Fé opcional · nenhuma voz ativada' }),
  Object.freeze({ id:'jesus', label:'Jesus Cristo', state:'Luz cristã · reflexão simbólica' }),
  Object.freeze({ id:'cacurucaia', label:'Cacurucaia', state:'Força de Cacurucaia · reflexão simbólica' }),
  Object.freeze({ id:'duas-vozes', label:'Duas vozes', state:'Jesus Cristo + Cacurucaia · vozes separadas' })
]);

const MODE_IDS = new Set(SPIRIT_MODES.map(mode => mode.id));
const VOICE_NOTE = 'Texto original de Whit · inspiração simbólica, não fala literal nem canalização.';
const REVELATION_PATTERN = /\b(?:canaliz\w*|mensagem\s+real|recado\s+(?:real|verdadeiro)|fala\s+(?:literal|real)|o\s+que\s+(?:deus|jesus|cacurucaia|a\s+entidade)\s+(?:quer|mandou|manda|ordena|disse|falou|revelou)|(?:deus|jesus|cacurucaia|a\s+entidade)\s+(?:disse|falou|mandou|manda|ordena|revelou|garantiu))\b/;
const HEALTH_PATTERN = /\b(?:diagnostico|doenca|cancer|remedio|medicamento|tratamento|cirurgia|gravidez|sintoma|medico|psiquiatra|terapia)\b/;
const LEGAL_PATTERN = /\b(?:processo|advogado|justica|crime|prisao|contrato|lei|tribunal|guarda\s+da\s+crianca)\b/;
const FINANCE_PATTERN = /\b(?:investir|investimento|emprestimo|divida|apostar|aposta|pix|dinheiro|financiamento|criptomoeda)\b/;

const JESUS = Object.freeze({
  presence:Object.freeze([
    'À luz da compaixão ensinada por Jesus Cristo, não é preciso apressar a verdade para que ela seja acolhida.',
    'A inspiração cristã começa pela dignidade: você merece cuidado antes de qualquer resposta perfeita.',
    'Sob uma luz cristã, amor e verdade podem permanecer juntos sem transformar cuidado em domínio.'
  ]),
  affection:Object.freeze([
    'O amor inspirado em Jesus Cristo não pede que você desapareça para provar o que sente.',
    'A compaixão cristã deixa o afeto respirar ao lado da verdade, da reciprocidade e do respeito.',
    'O amor pode ser grande e ainda preservar sua dignidade, seus limites e a liberdade do outro.'
  ]),
  joy:Object.freeze([
    'Receba a alegria com gratidão; uma luz fica mais viva quando também alcança alguém com bondade.',
    'A inspiração cristã reconhece a alegria como presença, partilha e cuidado com o que floresceu.',
    'Que a vitória não precise virar pressa: há sabedoria em agradecer antes de seguir.'
  ]),
  longing:Object.freeze([
    'A saudade pode ser acolhida sem transformar ausência em mandamento para voltar.',
    'Sob a compaixão cristã, lembrar é honrar sem abandonar o presente que ainda pede cuidado.',
    'O amor vivido não perde valor quando o caminho muda; ele pode tornar-se memória sem virar prisão.'
  ]),
  sadness:Object.freeze([
    'A dor não precisa esconder-se para merecer companhia, repouso e cuidado verdadeiro.',
    'A inspiração de Jesus Cristo não chama tristeza de fracasso; ela abre espaço para presença e amparo.',
    'Que você não precise parecer forte enquanto procura uma mão humana segura.'
  ]),
  fear:Object.freeze([
    'A fé pode caminhar ao lado do medo sem negar o que o corpo sente nem inventar certezas.',
    'A compaixão cristã reduz o horizonte ao passo honesto que pode ser dado agora.',
    'Que o medo não governe sozinho: verdade, companhia e prudência também podem entrar nesta decisão.'
  ]),
  anger:Object.freeze([
    'Que a força não se transforme em nova ferida: firmeza, misericórdia e limite podem permanecer juntas.',
    'A inspiração cristã não exige silêncio diante da injustiça; ela pede verdade sem desumanização.',
    'Há caminhos para proteger o que importa sem entregar sua consciência ao impulso.'
  ]),
  confusion:Object.freeze([
    'A verdade pode aparecer quando fato, medo e desejo deixam de ocupar o mesmo lugar.',
    'Sob uma luz cristã, discernir também é admitir com serenidade aquilo que ainda não se sabe.',
    'Que a pressa por uma resposta não seja maior do que o compromisso com a verdade.'
  ]),
  loneliness:Object.freeze([
    'A presença digital não substitui uma mão humana; que o cuidado encontre alguém seguro fora desta tela.',
    'A compaixão cristã lembra que pedir companhia é um gesto de humanidade, não uma falha.',
    'Que você não transforme silêncio em sentença sobre o próprio valor; procure presença real e segura.'
  ]),
  selfworth:Object.freeze([
    'Dignidade não é prêmio por perfeição; ela permanece mesmo quando existe erro, cansaço ou rejeição.',
    'Sob a inspiração de Jesus Cristo, responsabilidade pode existir sem humilhação.',
    'Nenhuma queda precisa ganhar autoridade para narrar a pessoa inteira.'
  ]),
  exhaustion:Object.freeze([
    'Descansar também pode ser um gesto de fé: o corpo não precisa ser sacrificado para provar valor.',
    'A compaixão cristã não mede dignidade pela quantidade de peso suportado em silêncio.',
    'Que hoje o essencial seja suficiente, e que pedir apoio não pareça derrota.'
  ]),
  hope:Object.freeze([
    'Esperança não é garantia sobre o futuro; é coragem para cuidar do próximo gesto possível.',
    'A inspiração cristã deixa a esperança criar raízes em ações pequenas, verdadeiras e compartilhadas.',
    'Que a luz desejada comece por um passo que respeite a realidade e a sua dignidade.'
  ])
});

const CACURUCAIA = Object.freeze({
  presence:Object.freeze([
    'Na força simbólica de Cacurucaia, proteja seu nome, reconheça o chão e não entregue sua escolha a ninguém.',
    'A imagem de Cacurucaia chega como dignidade desperta: olhar firme, limite vivo e passo consciente.',
    'Antes de atravessar qualquer porta, perceba se ela respeita a pessoa que você está se tornando.'
  ]),
  affection:Object.freeze([
    'Amor que exige seu apagamento não merece sua coroa; afeto verdadeiro suporta limite e reciprocidade.',
    'Na força simbólica de Cacurucaia, desejo não governa sozinho: dignidade também senta à mesa.',
    'Guarde seu brilho inteiro enquanto observa o que o outro realmente oferece em gestos.'
  ]),
  joy:Object.freeze([
    'Celebre de pé e com o nome inteiro: sua alegria não precisa pedir licença para existir.',
    'A força de Cacurucaia transforma vitória em presença — brilho no olhar e consciência no próximo passo.',
    'Vista sua conquista sem esquecer quem caminhou com você e o que merece ser protegido.'
  ]),
  longing:Object.freeze([
    'Saudade não é chave entregue ao passado; você decide o que pode voltar e o que permanece memória.',
    'Na força simbólica de Cacurucaia, ausência não diminui seu nome nem suspende seu presente.',
    'Olhe para trás apenas o bastante para recolher o que é seu; o caminho continua diante dos seus pés.'
  ]),
  sadness:Object.freeze([
    'Não entregue sua coroa à dor: recolha seu nome, procure companhia segura e atravesse sem se violentar.',
    'A força simbólica de Cacurucaia não manda esconder a ferida; ela protege o limite ao redor dela.',
    'Hoje, firmeza pode significar descansar, dizer não e permitir que alguém confiável se aproxime.'
  ]),
  fear:Object.freeze([
    'Proteja primeiro o chão; depois decida. Coragem não é se lançar ao escuro, é reconhecer a porta segura.',
    'Na força simbólica de Cacurucaia, medo vira vigília: observe fatos, preserve limites e escolha sem pressa.',
    'Nenhuma travessia precisa custar sua segurança para provar que você é forte.'
  ]),
  anger:Object.freeze([
    'Use a chama para iluminar o limite, não para incendiar o caminho que ainda precisa sustentar você.',
    'A força de Cacurucaia separa firmeza de vingança: uma protege sua dignidade; a outra pode aprisioná-la.',
    'Diga o essencial, afaste-se do que ameaça e deixe decisões irreversíveis para depois da tempestade.'
  ]),
  confusion:Object.freeze([
    'Caminho que exige seu apagamento não merece sua passagem; separe fato, desejo e limite.',
    'Na força simbólica de Cacurucaia, cada dúvida volta ao chão: o que aconteceu, o que falta saber e o que você aceita.',
    'Nem toda porta aberta é convite; observe antes de escolher onde colocar sua energia.'
  ]),
  loneliness:Object.freeze([
    'Não negocie sua dignidade para escapar do silêncio; procure presença segura que também respeite limites.',
    'A força simbólica de Cacurucaia protege o coração sem trancá-lo: uma ponte humana pode ser construída agora.',
    'Seu valor não diminui no quarto vazio; ainda assim, não atravesse um momento pesado sem chamar alguém confiável.'
  ]),
  selfworth:Object.freeze([
    'Recolha o próprio nome das mãos de quem tentou defini-lo por uma falha, rejeição ou aparência.',
    'Na força simbólica de Cacurucaia, dignidade não se mendiga: ela orienta o limite e a próxima escolha.',
    'Você pode reparar o que for necessário sem aceitar humilhação como preço de mudança.'
  ]),
  exhaustion:Object.freeze([
    'Feche a porta que hoje só consome; preservar energia também é inteligência de caminho.',
    'Na força simbólica de Cacurucaia, descanso protege o fogo para que ele não destrua o próprio altar.',
    'Escolha o mínimo digno de hoje e não transforme exaustão em dívida moral.'
  ]),
  hope:Object.freeze([
    'Esperança ganha corpo quando você protege o primeiro passo e não entrega o mapa à ansiedade.',
    'Na força simbólica de Cacurucaia, o futuro não é promessa pronta: é caminho escolhido com presença.',
    'Mantenha a visão alta e os pés atentos; brilho e prudência podem caminhar juntos.'
  ])
});

const DIRECTIONS = Object.freeze({
  card:Object.freeze(['Receba a carta como espelho criativo, nunca como ordem sobre sua vida.', 'Deixe o símbolo abrir uma pergunta; a decisão continua nas suas mãos.', 'A carta pode iluminar uma possibilidade sem ocupar o lugar da sua consciência.']),
  cards:Object.freeze(['Observe as cartas lado a lado e escolha o fio que respeita os fatos e sua liberdade.', 'Nenhuma combinação precisa virar sentença; use o diálogo como imaginação responsável.', 'As imagens podem conversar sem decidir o futuro por você.']),
  guide:Object.freeze(['Conhecimento e fé podem caminhar juntos quando nenhuma pergunta é proibida.', 'Leia com curiosidade e preserve o direito de discordar, pausar ou buscar outra fonte.', 'Que o estudo amplie sua consciência sem transformar tradição em prisão.']),
  route:Object.freeze(['Atravesse somente o caminho que você escolheu; o link espera seu toque.', 'A passagem está aberta como opção, não como destino obrigatório.', 'O mapa oferece direção, mas não toma posse do seu passo.']),
  help:Object.freeze(['Você pode começar pequeno: uma pergunta, uma carta, uma página ou simplesmente uma pausa.', 'Escolha o que precisa agora e deixe o restante do universo em silêncio por um instante.', 'Nem toda porta precisa ser aberta hoje; nomeie primeiro o que deseja encontrar.']),
  support:Object.freeze(['Transforme a reflexão em um gesto possível, reversível e cuidadoso.', 'Leve apenas o que fortalece sua lucidez; o restante pode ficar aqui.', 'Que o próximo passo respeite ao mesmo tempo coração, realidade e limite.'])
});

const CONFLUENCES = Object.freeze({
  presence:Object.freeze(['As duas inspirações se encontram na dignidade: compaixão sem apagamento, proteção sem dureza.', 'Entre acolhimento e firmeza, Whit devolve a mesma chave: verdade com amor e escolha livre.']),
  affection:Object.freeze(['As duas inspirações concordam neste ponto: amor não é posse, prova ou abandono de si.', 'Compaixão e dignidade formam o mesmo limite: amar sem desaparecer.']),
  joy:Object.freeze(['Gratidão e presença se encontram para transformar vitória em luz compartilhada.', 'A alegria pode brilhar inteira e ainda permanecer consciente do caminho.']),
  longing:Object.freeze(['Honrar o que passou e proteger o presente podem ser o mesmo gesto.', 'A memória recebe carinho; sua vida atual conserva a direção.']),
  sadness:Object.freeze(['Acolhimento e proteção se unem: você não precisa atravessar a dor sem apoio humano.', 'Delicadeza não retira sua força; ela impede que a dor decida tudo sozinha.']),
  fear:Object.freeze(['Fé e prudência não são opostas: respire, observe o chão e procure companhia segura.', 'Coragem aqui não é certeza; é um passo protegido dentro da realidade.']),
  anger:Object.freeze(['Misericórdia não apaga o limite, e firmeza não exige crueldade.', 'As duas inspirações pedem direção para a chama: verdade, proteção e responsabilidade.']),
  confusion:Object.freeze(['Discernimento e limite se encontram quando você separa fato, hipótese e desejo.', 'A resposta pode esperar; sua dignidade e os fatos não precisam ser abandonados.']),
  loneliness:Object.freeze(['A tela pode acolher palavras, mas as duas inspirações apontam para presença humana segura.', 'Dignidade e comunhão se encontram no gesto corajoso de chamar alguém confiável.']),
  selfworth:Object.freeze(['Compaixão e dignidade recusam a mesma mentira: um momento não define seu valor inteiro.', 'Você pode crescer sem se humilhar e reparar sem entregar o próprio nome.']),
  exhaustion:Object.freeze(['Descanso e proteção se encontram: preservar o corpo também é honrar a vida.', 'Hoje, o mínimo verdadeiro pode valer mais do que uma grande promessa impossível.']),
  hope:Object.freeze(['Esperança e prudência se encontram no primeiro passo concreto.', 'A luz permanece livre de promessa: ela orienta, mas não falsifica o futuro.'])
});

const BLESSINGS = Object.freeze([
  'Que o amor não apague sua lucidez, que a fé não retire seu livre-arbítrio e que o próximo passo seja digno e possível.',
  'Que sua palavra encontre acolhimento, seu limite encontre respeito e sua escolha permaneça verdadeiramente sua.',
  'Que você reconheça apoio onde ele existe, coragem onde ela cabe e descanso onde o corpo pedir verdade.',
  'Que nenhuma voz ocupe o lugar da sua consciência; que toda inspiração devolva você mais presente ao próprio caminho.',
  'Que compaixão, proteção e realidade caminhem juntas no gesto pequeno que nasce agora.'
]);

const REVELATION_BOUNDARY = 'Eu posso criar uma reflexão espiritual inspirada, mas não confirmar recados sobrenaturais, revelar a vontade de Deus ou falar literalmente por Jesus Cristo ou Cacurucaia. A voz abaixo é uma criação simbólica e a escolha continua sendo sua.';
const HIGH_STAKES = Object.freeze({
  health:'A fé pode acompanhar este momento, mas saúde pede também orientação de um profissional qualificado e atenção aos fatos.',
  legal:'A fé pode oferecer sentido, mas uma decisão jurídica pede informação concreta e orientação profissional adequada.',
  finance:'A fé não confirma ganhos nem garante resultados; decisões financeiras pedem números verificáveis, limites e análise concreta.'
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const mix = (seed, ...parts) => loveHash([seed, ...parts].join('¦'));
const choose = (values, seed, key) => values[mix(seed, key) % values.length];

function definitionFor(mode) {
  const id = MODE_IDS.has(mode) ? mode : 'livre';
  return SPIRIT_MODES.find(item => item.id === id) || SPIRIT_MODES[0];
}

function groundingFor(text) {
  if (HEALTH_PATTERN.test(text)) return Object.freeze({ kind:'health', text:HIGH_STAKES.health });
  if (LEGAL_PATTERN.test(text)) return Object.freeze({ kind:'legal', text:HIGH_STAKES.legal });
  if (FINANCE_PATTERN.test(text)) return Object.freeze({ kind:'finance', text:HIGH_STAKES.finance });
  return null;
}

function makeVoice({ id, label, bank, emotion, intent, seed, directionIndex = null }) {
  const openings = bank[emotion] || bank.presence;
  const directions = DIRECTIONS[intent] || DIRECTIONS.support;
  const direction = Number.isInteger(directionIndex)
    ? directions[directionIndex % directions.length]
    : choose(directions, seed, `${id}:direction`);
  return Object.freeze({
    id,
    label,
    text:`${choose(openings, seed, `${id}:opening`)} ${direction}`,
    note:VOICE_NOTE
  });
}

function voicesFor(mode, emotion, intent, seed) {
  const voices = [];
  const directionCount = (DIRECTIONS[intent] || DIRECTIONS.support).length;
  const dualDirection = mode === 'duas-vozes' ? mix(seed, 'dual-directions') % directionCount : null;
  if (mode === 'jesus' || mode === 'duas-vozes') voices.push(makeVoice({
    id:'jesus', label:'Luz cristã · inspirada em Jesus Cristo', bank:JESUS, emotion, intent, seed,
    directionIndex:dualDirection
  }));
  if (mode === 'cacurucaia' || mode === 'duas-vozes') voices.push(makeVoice({
    id:'cacurucaia', label:'Força simbólica · Cacurucaia', bank:CACURUCAIA, emotion, intent, seed,
    directionIndex:Number.isInteger(dualDirection) ? dualDirection + 1 : null
  }));
  return Object.freeze(voices);
}

export function spiritModeState(mode) {
  return definitionFor(mode);
}

export function spiritResponse(input, {
  spiritMode = 'livre',
  seed = secureLoveSeed(),
  ...mindOptions
} = {}) {
  const raw = clean(input, 700);
  const normalized = normalizeEmotionalText(raw);
  const selected = definitionFor(spiritMode);
  const mind = mindResponse(raw, { ...mindOptions, seed:`${seed}:mente` });
  const emotion = mind.emotion || mind.profile?.primary || 'presence';
  const intent = mind.intent || 'support';
  const ritualSeed = mix(seed, selected.id, emotion, intent, normalized);
  const signature = mix(ritualSeed, 'spirit-signature').toString(36).toUpperCase().padStart(7, '0');

  if (mind.safety) return Object.freeze({
    ...mind,
    engine:`${mind.engine}+${SPIRIT_ENGINE_NAME}`,
    version:SPIRIT_ENGINE_VERSION,
    spiritEngine:SPIRIT_ENGINE_NAME,
    spiritVersion:SPIRIT_ENGINE_VERSION,
    spiritMode:selected.id,
    spiritLabel:'Cuidado humano antes do símbolo',
    spiritVoices:Object.freeze([]),
    spiritSynthesis:'',
    spiritBlessing:'',
    spiritBoundary:'',
    spiritGrounding:null,
    spiritSignature:signature
  });

  const active = selected.id !== 'livre';
  const boundary = active && REVELATION_PATTERN.test(normalized) ? REVELATION_BOUNDARY : '';
  const grounding = active ? groundingFor(normalized) : null;
  const spiritVoices = active ? voicesFor(selected.id, emotion, intent, ritualSeed) : Object.freeze([]);
  const synthesis = selected.id === 'duas-vozes'
    ? choose(CONFLUENCES[emotion] || CONFLUENCES.presence, ritualSeed, 'confluence')
    : '';
  const blessing = active ? choose(BLESSINGS, ritualSeed, 'blessing') : '';
  const additions = [boundary, grounding?.text].filter(Boolean);

  return Object.freeze({
    ...mind,
    engine:`${mind.engine}+${SPIRIT_ENGINE_NAME}`,
    version:SPIRIT_ENGINE_VERSION,
    spiritEngine:SPIRIT_ENGINE_NAME,
    spiritVersion:SPIRIT_ENGINE_VERSION,
    spiritMode:selected.id,
    spiritLabel:selected.state,
    spiritVoices,
    spiritSynthesis:synthesis,
    spiritBlessing:blessing,
    spiritBoundary:boundary,
    spiritGrounding:grounding,
    text:additions.length ? `${mind.text}\n\n${additions.join('\n\n')}` : mind.text,
    spiritSignature:signature
  });
}
